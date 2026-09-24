param([string]$Ffmpeg = (Join-Path $PSScriptRoot '../.preview/ffmpeg.exe'))
$ErrorActionPreference = 'Stop'
$renderer = (Resolve-Path -LiteralPath $Ffmpeg).Path
Push-Location (Join-Path $PSScriptRoot '..')
try {
    # Freeze the last source frame so each message has time to be read.
    # Render both sizes from the original, keeping all existing media intact.
    $filters = '[0:v]fps=24,tpad=stop_mode=clone:stop_duration=9,ass=scripts/hero-subtitles.ass,split=2[desktop][small];[small]scale=854:480[mobile];[0:a]apad,asplit=2[desktopAudio][mobileAudio]'
    & $renderer -hide_banner -loglevel warning -y -i 'public/videos/dreamina-2026-09-20-9111.mp4' -filter_complex $filters `
        -map '[desktop]' -map '[desktopAudio]' -t 24 -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p -c:a aac -b:a 96k -movflags +faststart 'public/videos/hero-captioned-desktop.mp4' `
        -map '[mobile]' -map '[mobileAudio]' -t 24 -c:v libx264 -preset medium -crf 22 -pix_fmt yuv420p -c:a aac -b:a 80k -movflags +faststart 'public/videos/hero-captioned-mobile.mp4'
    if ($LASTEXITCODE -ne 0) { throw 'Subtitle rendering failed.' }
} finally {
    Pop-Location
}
