<#
.SYNOPSIS
  抓取财联社热门文章列表（cls.cn API）
.DESCRIPTION
  供金融财经 sub agent 调用。输出 JSON 到 stdout。
  调用 cls.cn/v2/article/hot/list，带签名验证（SHA1+MD5）。
  参考：Lysander66/briefy 项目的 cailian.py
  失败时返回 error 字段，sub agent 应降级到纯 web search。
#>
param(
    [int]$MaxItems = 20,
    [int]$TimeoutSec = 15
)
$ProgressPreference = "SilentlyContinue"
$timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
$result = @{ timestamp = $timestamp; status = "ok"; items = @() }

try {
    $params = [ordered]@{
        appName = "CailianpressWeb"
        os      = "web"
        sv      = "7.7.5"
    }

    # 生成签名：参数按 key 排序，urlencode 拼接，SHA1 后再 MD5
    $sortedParams = $params.GetEnumerator() | Sort-Object Name
    $queryString = ($sortedParams | ForEach-Object { "$($_.Key)=$([System.Uri]::EscapeDataString($_.Value))" }) -join "&"
    $sha1Bytes = [System.Security.Cryptography.SHA1]::Create().ComputeHash([System.Text.Encoding]::UTF8.GetBytes($queryString))
    $sha1Hex = ($sha1Bytes | ForEach-Object { $_.ToString("x2") }) -join ""
    $md5Bytes = [System.Security.Cryptography.MD5]::Create().ComputeHash([System.Text.Encoding]::UTF8.GetBytes($sha1Hex))
    $sign = ($md5Bytes | ForEach-Object { $_.ToString("x2") }) -join ""

    $params["sign"] = $sign

    $url = "https://www.cls.cn/v2/article/hot/list"
    $headers = @{
        "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        "Referer"    = "https://www.cls.cn/"
    }

    $resp = Invoke-RestMethod -Uri $url -Method Get -Headers $headers -Body $params -TimeoutSec $TimeoutSec
    $itemsData = $resp.data

    if (-not $itemsData) {
        $result.status = "empty"
        $result.error = "API returned no data"
    } else {
        $count = 0
        foreach ($item in $itemsData) {
            if ($count -ge $MaxItems) { break }
            $itemId = $item.id
            if (-not $itemId) { continue }

            $brief = $item.brief
            $title = $item.title
            if (-not $title -and $brief) { $title = ($brief -split "`n")[0].Trim() }
            if (-not $title) { continue }

            $result.items += [ordered]@{
                id          = "$itemId"
                title       = $title
                description = $brief
                url         = "https://www.cls.cn/detail/$itemId"
            }
            $count++
        }
        $result.totalFetched = $result.items.Count
    }
} catch {
    $result.status = "error"
    $result.error = $_.Exception.Message
}

$result | ConvertTo-Json -Depth 5
