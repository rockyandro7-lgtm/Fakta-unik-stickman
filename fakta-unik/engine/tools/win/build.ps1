# Versi Windows dari fakta-unik/engine/make.sh.  Pakai:  powershell -ExecutionPolicy Bypass -File fakta-unik/engine/tools/win/build.ps1 -Dir <folder-episode> [-Workers 8] [-AudioOnly]
# Butuh di folder episode: script.json, audio/vo.wav (+ audio/timemap.json dari tighten.py), scribe_words.json (sudah mapwords+snaponset), web/shots.js, audio.py
param([Parameter(Mandatory = $true)][string]$Dir, [int]$Workers = 8, [switch]$AudioOnly)
$ErrorActionPreference = 'Stop'
$env:Path = [Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' + [Environment]::GetEnvironmentVariable('Path', 'User')
$tools = $PSScriptRoot; if (-not $env:NODE_PATH) { $env:NODE_PATH = Join-Path $tools 'node_modules' }
$engine = Split-Path (Split-Path $tools)
Set-Location $Dir; $name = Split-Path $Dir -Leaf
Write-Host '== aligning words (Scribe)'; python (Join-Path $engine 'tools\align_scribe.py') scribe_words.json; if ($LASTEXITCODE) { throw 'align gagal' }
Write-Host '== music + sfx mix'; python audio.py; if ($LASTEXITCODE) { throw 'audio.py gagal' }
if (-not $AudioOnly -or -not (Test-Path silent.mp4)) {
  $n = [int](node (Join-Path $tools 'render_win.js') count | Select-Object -Last 1)
  Write-Host "== rendering $n shots with $Workers workers"
  if (Test-Path seg) { Remove-Item -Recurse -Force seg }; New-Item -ItemType Directory seg | Out-Null
  $procs = @()
  for ($w = 0; $w -lt $Workers; $w++) {
    $ids = @(); for ($i = $w; $i -lt $n; $i += $Workers) { $ids += $i }
    if ($ids.Count) { $procs += Start-Process node -ArgumentList @("`"$(Join-Path $tools 'render_win.js')`"", 'segments', ($ids -join ',')) -NoNewWindow -PassThru -RedirectStandardOutput "seg\log$w.txt" -RedirectStandardError "seg\err$w.txt" }
  }
  $procs | Wait-Process
  $segs = Get-ChildItem seg -Filter 'shot_??.mp4' | Sort-Object Name
  if ($segs.Count -ne $n) { throw "a shot failed ($($segs.Count)/$n), see seg\log*.txt" }
  $segs | ForEach-Object { "file '$($_.FullName -replace '\\','/')'" } | Set-Content seg\list.txt -Encoding ascii
  ffmpeg -v error -y -f concat -safe 0 -i seg\list.txt -c copy silent.mp4; if ($LASTEXITCODE) { throw 'concat gagal' }
}
Write-Host '== final mux'
ffmpeg -v error -y -i silent.mp4 -i audio\mix.wav -map 0:v -map 1:a -c:v copy -af 'alimiter=limit=0.8:attack=2:release=60,loudnorm=I=-14:TP=-1.5:LRA=9' -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart "$name.part.mp4"
if ($LASTEXITCODE) { throw 'mux gagal' }
Move-Item -Force "$name.part.mp4" "$name.mp4"; Write-Host "done: $(Join-Path $Dir "$name.mp4")"

