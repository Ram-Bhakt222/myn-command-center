# =============================================================
# inject-widget.ps1
# Adds the floating connectors widget <script> tag and a
# "Cockpit" link inside the existing MYN-NAV to every HTML page
# in the Command Center, idempotently.
#
# Uses .NET File.ReadAllText / WriteAllText with explicit
# UTF-8 (no BOM) so emoji and arrows are preserved.
#
# Usage:
#   cd "C:\Users\ram\Desktop\Command Center\myn-command-center"
#   powershell -ExecutionPolicy Bypass -File _widgets\inject-widget.ps1
# =============================================================

$root  = Split-Path -Parent $PSScriptRoot
$pages = Get-ChildItem -Path $root -Recurse -Filter *.html -File |
         Where-Object { $_.FullName -notmatch '\\_archive\\' -and $_.FullName -notmatch '\\_widgets\\' }

# Compute paths relative so docs/ subfolder finds widget at ../_widgets/...
$widgetMark  = 'floating-connectors.js'
$cockpitMark = 'data-page="cockpit"'

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

$updatedW = 0; $updatedN = 0

foreach ($p in $pages) {
    $raw = [System.IO.File]::ReadAllText($p.FullName, $utf8NoBom)

    # Determine relative path to _widgets from this file's folder
    $depth = ($p.FullName.Substring($root.Length).TrimStart('\').Split('\').Length) - 1
    $prefix = if ($depth -gt 0) { ('../' * $depth) } else { '' }
    $widgetTag = "<script src=`"${prefix}_widgets/floating-connectors.js`" defer></script>"

    $cockpitLink = '  <a href="http://localhost:8787" target="_blank" rel="noopener" data-page="cockpit">Cockpit</a>'

    $changed = $false

    # 1) Inject the widget <script> right before </body>
    if ($raw -notmatch [regex]::Escape($widgetMark)) {
        if ($raw -match '</body>') {
            $raw = $raw -replace '</body>', "$widgetTag`r`n</body>"
        } else {
            $raw = $raw + "`r`n$widgetTag`r`n"
        }
        $updatedW++; $changed = $true
    }

    # 2) Inject the Cockpit link inside the MYN-NAV before the spacer
    if ($raw -match 'class="myn-nav__spacer"' -and $raw -notmatch [regex]::Escape($cockpitMark)) {
        $raw = $raw -replace '(\s*)<span class="myn-nav__spacer"></span>', "$cockpitLink`r`n`$1<span class=`"myn-nav__spacer`"></span>"
        $updatedN++; $changed = $true
    }

    if ($changed) {
        [System.IO.File]::WriteAllText($p.FullName, $raw, $utf8NoBom)
    }
}

Write-Host "Widget injected into $updatedW page(s)."
Write-Host "Cockpit link added to $updatedN nav(s)."
Write-Host "Total pages scanned: $($pages.Count)"
