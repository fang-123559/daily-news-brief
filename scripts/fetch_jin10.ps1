<#
.SYNOPSIS
  抓取金十数据最新快讯（jin10.com 快讯流）
.DESCRIPTION
  供金融财经 sub agent 调用。输出 JSON 到 stdout。
  抓取 jin10.com/flash_newest.js，解析 JS 变量。
  参考：Lysander66/briefy 项目的 jin10.py
  失败时返回 error 字段，sub agent 应降级到纯 web search。
#>
param(
    [int]$MaxItems = 30,
    [int]$TimeoutSec = 15
)
$ProgressPreference = "SilentlyContinue"
$timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
$result = @{ timestamp = $timestamp; status = "ok"; items = @() }

try {
    $ts = [int64]((Get-Date) - (Get-Date "1970-01-01")).TotalMilliseconds
    $url = "https://www.jin10.com/flash_newest.js?t=$ts"
    $resp = Invoke-WebRequest -Uri $url -UseBasicParsing `
        -Headers @{ "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"; "Referer" = "https://www.jin10.com/" } `
        -TimeoutSec $TimeoutSec

    $raw = $resp.Content
    # 去掉 JS 变量声明
    $jsonStr = $raw -replace "var newest\s*=\s*", "" -replace ";$", "" -replace "`r`n", ""
    $jsonStr = $jsonStr.Trim()

    $data = $jsonStr | ConvertFrom-Json
    $count = 0
    foreach ($item in $data) {
        if ($count -ge $MaxItems) { break }
        # 跳过 channel 含 5 的（广告类）
        $channels = $item.channel
        if ($channels -and ($channels -contains 5)) { continue }

        $itemData = $item.data
        $title = $itemData.title
        if (-not $title) { $title = $itemData.content }
        if (-not $title) { continue }

        # 清理 HTML 标签
        $title = $title -replace "</?b>", ""
        $itemId = $item.id
        if (-not $itemId) { continue }

        # 提取【】格式的标题和内容
        $parsedTitle = $title
        $parsedDesc = ""
        if ($title -match "^\S*?【([^】]*)】(.*)$") {
            $parsedTitle = $Matches[1]
            $parsedDesc = $Matches[2].Trim()
        }

        $result.items += [ordered]@{
            id          = "$itemId"
            title       = $parsedTitle
            description = $parsedDesc
            url         = "https://flash.jin10.com/detail/$itemId"
            time        = $item.time
        }
        $count++
    }
    $result.totalFetched = $result.items.Count
} catch {
    $result.status = "error"
    $result.error = $_.Exception.Message
}

$result | ConvertTo-Json -Depth 5
