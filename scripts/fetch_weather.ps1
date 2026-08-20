<#
.SYNOPSIS
  抓取嘉兴和余杭的天气数据 + AQI
.DESCRIPTION
  供天气 sub agent 调用。输出 JSON 到 stdout。
  主源：wttr.in JSON 接口
  降级：中国天气网 weather.com.cn 页面抓取
  AQI：标注为待 web search 补充
#>
param(
    [int]$TimeoutSec = 15
)
$ProgressPreference = "SilentlyContinue"

# 城市配置（内部定义，避免命令行传参问题）
$Cities = @(
    @{ name = "Jiaxing"; code = "101210301"; label = "嘉兴" },
    @{ name = "Yuhang"; code = "101210104"; label = "余杭" }
)

$result = [ordered]@{}
$timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")

foreach ($cityObj in $Cities) {
    $cityName = $cityObj.name
    $cityCode = $cityObj.code
    $cityLabel = $cityObj.label
    $cityData = [ordered]@{ city = $cityName; label = $cityLabel }

    # 方案1: wttr.in JSON
    $wttrOk = $false
    try {
        $url = "https://wttr.in/$cityName`?format=j1"
        $resp = Invoke-RestMethod -Uri $url -Headers @{ "User-Agent" = "curl/8.0" } -TimeoutSec $TimeoutSec
        $current = $resp.current_condition[0]
        $today = $resp.weather | Select-Object -First 1

        $cityData.source = "wttr.in"
        $cityData.temperature = "$($today.mintempC)-$($today.maxtempC) C"
        $cityData.currentTemp = "$($current.temp_C) C"
        $cityData.feelsLike = "$($current.FeelsLikeC) C"
        $cityData.humidity = "$($current.humidity)%"
        $cityData.windDir = $current.winddir16
        $cityData.windSpeed = "$($current.windspeedKmph)km/h"
        $cityData.weatherDesc = $current.weatherDesc[0].value
        $cityData.uvIndex = $today.uvIndex
        $cityData.precipChance = "$($today.hourly[0].chanceofrain)%"
        $cityData.visibility = "$($current.visibility)km"
        $cityData.aqi = "待web search补充"
        $cityData.status = "ok"
        $wttrOk = $true
    } catch {
        # wttr.in 失败，降级到中国天气网
    }

    # 方案2: 中国天气网（降级）
    if (-not $wttrOk) {
        try {
            $url = "https://www.weather.com.cn/weather/$cityCode.shtml"
            $resp = Invoke-WebRequest -Uri $url -UseBasicParsing -Headers @{
                "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
                "Accept-Language" = "zh-CN,zh;q=0.9"
            } -TimeoutSec $TimeoutSec
            # 天气网是 UTF-8，用 RawContentStream 手动解码
            $bytes = $resp.RawContentStream.ToArray()
            $html = [System.Text.Encoding]::UTF8.GetString($bytes)

            # 提取 hidden_title（含日期、天气、温度）
            $hiddenMatch = [regex]::Match($html, 'id="hidden_title"\s+value="([^"]*)"')
            $hidden = if ($hiddenMatch.Success) { $hiddenMatch.Groups[1].Value } else { "" }

            # 从 hidden_title 解析温度，格式如 "07月29日08时 周三  多云转晴  32/26°C"
            $temp = ""
            if ($hidden -match "(\d+)/(\d+)\s*") { $temp = "$($Matches[2])-$($Matches[1]) C" }

            # 从 hidden_title 解析天气描述
            $wea = ""
            if ($hidden -match "\s+(\S+)\s+\d+/\d+") { $wea = $Matches[1] }

            # 提取风向
            $windMatch = [regex]::Match($html, '<p class="win">[\s\S]*?<span title="([^"]*)"')
            $wind = if ($windMatch.Success) { $windMatch.Groups[1].Value } else { "" }

            $cityData.source = "weather.com.cn"
            $cityData.temperature = $temp
            $cityData.weatherDesc = $wea
            $cityData.windDir = $wind
            $cityData.hiddenTitle = $hidden
            $cityData.aqi = "待web search补充"
            $cityData.status = "ok"
        } catch {
            $cityData.status = "error"
            $cityData.error = "wttr.in timeout; weather.com.cn: $($_.Exception.Message)"
        }
    }

    $result[$cityName] = $cityData
}

$result.timestamp = $timestamp
$result | ConvertTo-Json -Depth 5
