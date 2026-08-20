<#
.SYNOPSIS
  SMTP HTML email sender (163, implicit SSL 465)
.PARAMETER Subject
  Email subject (if SubjectFile not provided)
.PARAMETER HtmlBody
  HTML body (if HtmlFile not provided)
.PARAMETER SubjectFile
  Read subject from this UTF-8 file (avoids encoding issues)
.PARAMETER HtmlFile
  Read HTML body from this UTF-8 file
.PARAMETER DateStr
  Date string for logging
#>
param(
    [string]$Subject = "",
    [string]$HtmlBody = "",
    [string]$SubjectFile = "",
    [string]$HtmlFile = "",
    [string]$DateStr = ""
)
$ErrorActionPreference = "Stop"

if ($SubjectFile -and (Test-Path $SubjectFile)) {
    $Subject = Get-Content $SubjectFile -Raw -Encoding UTF8
    $Subject = $Subject.Trim()
}

if ($HtmlFile -and (Test-Path $HtmlFile)) {
    $HtmlBody = Get-Content $HtmlFile -Raw -Encoding UTF8
}

# 邮件发送前校验：NumberAlign @font-face 必须存在，否则数字会回退到 Georgia 偏小、与中文不等高
if ($HtmlFile -and (Test-Path $HtmlFile)) {
    if (-not $HtmlBody -or -not ($HtmlBody -match "NumberAlign") -or -not ($HtmlBody -match "@font-face")) {
        $logResult = [ordered]@{ date = $DateStr; timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ"); status = "error"; error = "HTML 缺少 NumberAlign @font-face，数字字体校验未通过，已阻止发送" }
        $logResult | ConvertTo-Json -Depth 3
        exit 1
    }
}

$configPath = Join-Path $PSScriptRoot "..\config\smtp.env"
$logResult = [ordered]@{ date = $DateStr; timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ") }
$encoding = [System.Text.Encoding]::ASCII

if (-not (Test-Path $configPath)) {
    $logResult.status = "error"
    $logResult.error = "Config file not found: $configPath"
    $logResult | ConvertTo-Json -Depth 3
    exit 1
}
$config = @{}
Get-Content $configPath | ForEach-Object {
    $line = $_.Trim()
    if ($line -and -not $line.StartsWith("#") -and $line.Contains("=")) {
        $parts = $line -split "=", 2
        $config[$parts[0].Trim()] = $parts[1].Trim()
    }
}
$smtpHost = $config["SMTP_HOST"]
$smtpPort = [int]$config["SMTP_PORT"]
$smtpUser = $config["SMTP_USER"]
$smtpPass = $config["SMTP_PASS"]
$mailTo = $config["MAIL_TO"]

if (-not $smtpHost -or -not $smtpUser -or -not $smtpPass -or -not $mailTo) {
    $logResult.status = "error"
    $logResult.error = "Missing required config values in smtp.env"
    $logResult | ConvertTo-Json -Depth 3
    exit 1
}

try {
    $tcpClient = New-Object System.Net.Sockets.TcpClient
    $tcpClient.Connect($smtpHost, $smtpPort)
    $sslStream = New-Object System.Net.Security.SslStream($tcpClient.GetStream(), $false, ({ $true } -as [System.Net.Security.RemoteCertificateValidationCallback]))
    $sslStream.AuthenticateAsClient($smtpHost)

    function ReadLine($stream) {
        $sb = New-Object System.Text.StringBuilder
        while ($true) {
            $b = $stream.ReadByte()
            if ($b -eq -1) { break }
            [void]$sb.Append([char]$b)
            if ($sb.ToString().EndsWith("`r`n")) { break }
        }
        return $sb.ToString().TrimEnd("`r","`n")
    }
    function ReadMulti($stream) {
        $last = ""
        do { $last = ReadLine $stream } while ($last -match "^\d{3}-")
        return $last
    }
    function SendLine($stream, $cmd) {
        $bytes = $encoding.GetBytes("$cmd`r`n")
        $stream.Write($bytes, 0, $bytes.Length)
        $stream.Flush()
    }

    ReadMulti $sslStream | Out-Null
    SendLine $sslStream "EHLO localhost"
    ReadMulti $sslStream | Out-Null
    SendLine $sslStream "AUTH LOGIN"
    ReadLine $sslStream | Out-Null
    SendLine $sslStream ([Convert]::ToBase64String($encoding.GetBytes($smtpUser)))
    ReadLine $sslStream | Out-Null
    SendLine $sslStream ([Convert]::ToBase64String($encoding.GetBytes($smtpPass)))
    $authResult = ReadLine $sslStream
    if ($authResult -notmatch "^235") {
        $logResult.status = "error"
        $logResult.error = "SMTP auth failed: $authResult"
        $logResult | ConvertTo-Json -Depth 3
        $sslStream.Close(); $tcpClient.Close()
        exit 1
    }

    SendLine $sslStream "MAIL FROM:<$smtpUser>"
    ReadLine $sslStream | Out-Null
    SendLine $sslStream "RCPT TO:<$mailTo>"
    ReadLine $sslStream | Out-Null
    SendLine $sslStream "DATA"
    ReadLine $sslStream | Out-Null

    # RFC 2047: encode subject as =?UTF-8?B?<base64>?= so non-ASCII chars
    # survive SMTP headers (which are traditionally ASCII-only).
    # Use explicit + concatenation to avoid PowerShell interpolation pitfalls.
    $subjectB64 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($Subject))
    $encodedSubject = "=?UTF-8?B?" + $subjectB64 + "?="

    # RFC 2045: base64-encode the HTML body and wrap at 76 chars per line.
    # This avoids 8BITMIME dependency and guarantees ASCII-only SMTP data.
    $bodyB64Raw = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($HtmlBody))
    $bodyB64Lines = @()
    for ($i = 0; $i -lt $bodyB64Raw.Length; $i += 76) {
        $len = [Math]::Min(76, $bodyB64Raw.Length - $i)
        $bodyB64Lines += $bodyB64Raw.Substring($i, $len)
    }
    $bodyB64 = ($bodyB64Lines -join "`r`n")

    $emailLines = @(
        "From: <$smtpUser>",
        "To: <$mailTo>",
        "Subject: $encodedSubject",
        "MIME-Version: 1.0",
        "Content-Type: text/html; charset=UTF-8",
        "Content-Transfer-Encoding: base64",
        "",
        $bodyB64,
        "."
    )
    # Entire message is now ASCII-only (base64 + encoded-word subject).
    $emailText = ($emailLines -join "`r`n") + "`r`n"
    $asciiBytes = [System.Text.Encoding]::ASCII.GetBytes($emailText)
    $sslStream.Write($asciiBytes, 0, $asciiBytes.Length)
    $sslStream.Flush()

    Start-Sleep -Milliseconds 500
    $dataResult = ReadLine $sslStream

    if ($dataResult -notmatch "^250") {
        $logResult.status = "error"
        $logResult.error = "DATA not queued: $dataResult"
        $logResult | ConvertTo-Json -Depth 3
        SendLine $sslStream "QUIT"
        $sslStream.Close(); $tcpClient.Close()
        exit 1
    }

    SendLine $sslStream "QUIT"
    Start-Sleep -Milliseconds 500
    $sslStream.Close()
    $tcpClient.Close()

    $logResult.status = "ok"
    $logResult.subject = $Subject
    $logResult.queueId = ($dataResult -replace "^250 Mail OK queued as ", "")
    $logResult | ConvertTo-Json -Depth 3
} catch {
    $logResult.status = "error"
    $logResult.error = $_.Exception.Message
    $logResult | ConvertTo-Json -Depth 3
    exit 1
}
