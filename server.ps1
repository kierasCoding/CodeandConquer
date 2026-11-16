# Kleiner lokaler Webserver fuer "Mord im Server-Raum". Wird von starten.bat aufgerufen.
# Nur vom eigenen Rechner erreichbar (localhost), liefert nur Website-Dateitypen aus.

$wurzel = [System.IO.Path]::GetFullPath($PSScriptRoot).TrimEnd('\') + '\'

$typen = @{
  '.html' = 'text/html; charset=utf-8'
  '.css'  = 'text/css; charset=utf-8'
  '.js'   = 'text/javascript; charset=utf-8'
  '.pdf'  = 'application/pdf'
  '.png'  = 'image/png'
  '.jpg'  = 'image/jpeg'
  '.webp' = 'image/webp'
  '.svg'  = 'image/svg+xml'
}

# Text- und Python-Dateien nur aus dem Ordner "dokumente" (Downloads fuer die Raetsel)
$nurDokumente = @{
  '.txt' = 'text/plain; charset=utf-8'
  '.py'  = 'text/plain; charset=utf-8'
}
$dokumente = $wurzel + 'dokumente\'

$server = $null
$port = 0
foreach ($p in 8765..8785) {
  $versuch = New-Object System.Net.HttpListener
  $versuch.Prefixes.Add("http://localhost:$p/")
  try {
    $versuch.Start()
    $server = $versuch
    $port = $p
    break
  } catch {
    $versuch.Close()
  }
}

if ($null -eq $server) {
  Write-Host 'Es konnte kein freier Port gefunden werden.'
  exit 1
}

$adresse = "http://localhost:$port/"
Write-Host ''
Write-Host '  MORD IM SERVER-RAUM'
Write-Host "  Die Website laeuft unter $adresse"
Write-Host '  Dieses Fenster waehrend des Spiels bitte offen lassen.'
Write-Host '  Zum Beenden das Fenster einfach schliessen.'
Write-Host ''

if (-not $env:MORD_OHNE_BROWSER) { Start-Process $adresse }

while ($server.IsListening) {
  $ctx = $server.GetContext()
  $antwort = $ctx.Response
  try {
    $methode = $ctx.Request.HttpMethod
    $pfad = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath).TrimStart('/').Replace('/', '\')
    if ($pfad -eq '') { $pfad = 'index.html' }
    $datei = [System.IO.Path]::GetFullPath((Join-Path $wurzel $pfad))
    $endung = [System.IO.Path]::GetExtension($datei).ToLower()

    $typ = $null
    if ($typen.ContainsKey($endung) -and $datei.StartsWith($wurzel, [StringComparison]::OrdinalIgnoreCase)) {
      $typ = $typen[$endung]
    } elseif ($nurDokumente.ContainsKey($endung) -and $datei.StartsWith($dokumente, [StringComparison]::OrdinalIgnoreCase)) {
      $typ = $nurDokumente[$endung]
    }

    $erlaubt = ($methode -eq 'GET' -or $methode -eq 'HEAD') -and
               ($null -ne $typ) -and
               (Test-Path -LiteralPath $datei -PathType Leaf)

    if ($erlaubt) {
      $bytes = [System.IO.File]::ReadAllBytes($datei)
      $antwort.ContentType = $typ
      $antwort.Headers.Add('Cache-Control', 'no-cache')
      $antwort.ContentLength64 = $bytes.Length
      if ($methode -eq 'GET') { $antwort.OutputStream.Write($bytes, 0, $bytes.Length) }
    } else {
      $antwort.StatusCode = 404
    }
  } catch {
    # z. B. Browser hat die Verbindung abgebrochen oder ungueltiger Pfad: weiter bedienen
    try { $antwort.StatusCode = 404 } catch {}
  } finally {
    try { $antwort.Close() } catch {}
  }
}
