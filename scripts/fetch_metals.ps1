<#
.SYNOPSIS
  抓取金银价格数据（新浪财经 hq.sinajs.cn 接口）
.DESCRIPTION
  供金融财经 sub agent 调用。输出 JSON 到 stdout。
  接口：hf_GC（国际黄金）、hf_SI（国际白银）、au9999（国内黄金）、USDCNY（汇率）
  失败时返回 error 字段，sub agent 应降级到 web search。
#>
param(
    [int]$TimeoutSec = 15
)
$ProgressPreference = "SilentlyContinue"
$timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
$result = @{ timestamp = $timestamp; status = "ok"; data = @{} }

# 新浪行情接口：hf_GC=黄金 hf_SI=白银
$sinaUrl = "https://hq.sinajs.cn/list=hf_GC,hf_SI"
try {
    $resp = Invoke-WebRequest -Uri $sinaUrl -UseBasicParsing `
        -Headers @{ "Referer" = "https://finance.sina.com.cn/"; "User-Agent" = "Mozilla/5.0" } `
        -TimeoutSec $TimeoutSec
    $lines = $resp.Content -split "`n"
    foreach ($line in $lines) {
        if ($line -match 'var\s+(\w+)\s*=\s*"([^"]*)"') {
            $varName = $Matches[1]
            $content = $Matches[2]
            $fields = $content -split ","
            if ($fields.Count -gt 5) {
                $result.data[$varName] = @{
                    name       = $fields[0]
                    latest     = $fields[1]
                    open       = $fields[5]
                    high       = $fields[3]
                    low        = $fields[4]
                    prevClose  = $fields[7]
                    settleDate = $fields[$fields.Count - 3]
                }
            }
        }
    }
} catch {
    $result.status = "error"
    $result.error = "sina_hq: $($_.Exception.Message)"
}

# 尝试从新浪获取国内金价 Au9999 和汇率
# 注意：au2412 合约代码已过期（7/29 调试发现），国内金价应优先用 web search 搜东方财富
$sinaUrl2 = "https://hq.sinajs.cn/list=au2412,fx_susdcny"
try {
    $resp2 = Invoke-WebRequest -Uri $sinaUrl2 -UseBasicParsing `
        -Headers @{ "Referer" = "https://finance.sina.com.cn/"; "User-Agent" = "Mozilla/5.0" } `
        -TimeoutSec $TimeoutSec
    $lines2 = $resp2.Content -split "`n"
    foreach ($line in $lines2) {
        if ($line -match 'var\s+(\w+)\s*=\s*"([^"]*)"') {
            $varName = $Matches[1]
            $content = $Matches[2]
            $fields = $content -split ","
            if ($fields.Count -gt 3) {
                $result.data[$varName] = @{
                    name      = $fields[0]
                    latest    = $fields[1]
                    prevClose = $fields[7]
                }
            }
        }
    }
} catch {
    # 国内金价获取失败不致命，主接口已有国际金价
    # Au9999 应由 sub agent 通过 web search 搜东方财富网获取
    if (-not $result.ContainsKey("warnings")) { $result.warnings = @() }
    $result.warnings += "sina_au: $($_.Exception.Message)"
}

$result | ConvertTo-Json -Depth 5
