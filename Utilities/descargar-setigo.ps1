# ============================================================
#  SSL Chain Downloader (solo descarga / inspeccion)
#  Descarga la cadena de certificados de un host y la exporta
#  con nombres validos para Android res/raw (minusculas).
#  NO instala nada por ADB.
#
#  Uso:
#    .\descargar-setigo.ps1
#    .\descargar-setigo.ps1 -HostUrl "aplicada.somee.com"
#    .\descargar-setigo.ps1 -HostUrl "miapi.com" -Port 8443 -OutDir ".\certs"
# ============================================================
param(
    [string]$HostUrl = "aplicada.somee.com",
    [int]   $Port    = 443,
    [string]$OutDir  = "$env:TEMP\ssl_inspect_$HostUrl"
)

New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

# --- 1. CONECTAR Y OBTENER LA CADENA -------------------------
Write-Host ""
Write-Host "[SSL] Inspeccionando: $HostUrl`:$Port" -ForegroundColor Cyan

$tcp = $null
$ssl = $null
try {
    $tcp      = New-Object System.Net.Sockets.TcpClient($HostUrl, $Port)
    $callback = [System.Net.Security.RemoteCertificateValidationCallback]{ param($s,$c,$ch,$e) return $true }
    $ssl      = New-Object System.Net.Security.SslStream($tcp.GetStream(), $false, $callback)
    $ssl.AuthenticateAsClient($HostUrl)
    $serverCert = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2($ssl.RemoteCertificate)
    Write-Host "[OK] Conexion establecida" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] No se pudo conectar: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

$chain = New-Object System.Security.Cryptography.X509Certificates.X509Chain
$chain.ChainPolicy.RevocationMode    = [System.Security.Cryptography.X509Certificates.X509RevocationMode]::NoCheck
$chain.ChainPolicy.VerificationFlags = [System.Security.Cryptography.X509Certificates.X509VerificationFlags]::AllFlags
$chain.Build($serverCert) | Out-Null

# --- 2. EXPORTAR + MOSTRAR LA CADENA -------------------------
Write-Host ""
Write-Host "============================================================" -ForegroundColor White
Write-Host "  CADENA DE CERTIFICADOS  ($OutDir)"                          -ForegroundColor White
Write-Host "============================================================" -ForegroundColor White

$total      = $chain.ChainElements.Count
$rootElement = $null   # se llena con la raiz (cert autofirmado, tope de la cadena)
$i = 0
foreach ($el in $chain.ChainElements) {
    $cert       = $el.Certificate
    $isSelfSigned = ($cert.Subject -eq $cert.Issuer)

    if ($i -eq 0)                 { $label = "leaf";   $tag = "[0] Servidor (leaf)" }
    elseif ($isSelfSigned)        { $label = "root";   $tag = "[$i] CA Raiz (trust anchor)" }
    else                          { $label = "inter";  $tag = "[$i] Intermedio" }

    # nombre de archivo VALIDO para Android res/raw: solo [a-z0-9_]
    $simple = $cert.GetNameInfo([System.Security.Cryptography.X509Certificates.X509NameType]::SimpleName, $false)
    $safe   = ($simple.ToLower() -replace '[^a-z0-9]', '_') -replace '_+', '_'
    $safe   = $safe.Trim('_')
    if ($safe.Length -gt 30) { $safe = $safe.Substring(0, 30) }
    $baseName = "cert_${i}_${label}_${safe}"

    $der = "$OutDir\$baseName.cer"
    $pem = "$OutDir\$baseName.pem"
    $bytes = $cert.Export([System.Security.Cryptography.X509Certificates.X509ContentType]::Cert)
    [System.IO.File]::WriteAllBytes($der, $bytes)
    $b64 = [Convert]::ToBase64String($bytes, [Base64FormattingOptions]::InsertLineBreaks)
    Set-Content -Path $pem -Value "-----BEGIN CERTIFICATE-----`r`n$b64`r`n-----END CERTIFICATE-----" -Encoding ASCII

    $color = if ($isSelfSigned) { "Yellow" } else { "Cyan" }
    Write-Host ""
    Write-Host "  $tag" -ForegroundColor $color
    Write-Host "      Subject : $($cert.Subject)"
    Write-Host "      Issuer  : $($cert.Issuer)"
    Write-Host "      Expira  : $($cert.NotAfter.ToString('yyyy-MM-dd'))"
    Write-Host "      Archivo : $pem"

    if ($isSelfSigned) { $rootElement = @{ Cert = $cert; Base = $baseName; Pem = $pem } }
    $i++
}

# --- 3. RECOMENDACION: QUE CERTIFICADO PINEAR ----------------
# El servidor envia leaf + intermedios pero NUNCA la raiz.
# Android falla si no tiene esa raiz en su almacen -> hay que pinearla.
Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "  CERTIFICADO A AGREGAR EN LA APP (trust anchor)"            -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
if ($null -ne $rootElement) {
    Write-Host "   $($rootElement.Cert.Subject)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   1) Copiar este archivo a:  Platforms\Android\Resources\raw\" -ForegroundColor Gray
    Write-Host "         $($rootElement.Pem)" -ForegroundColor Gray
    Write-Host "      (renombralo en minusculas, ej: $($rootElement.Base).pem)" -ForegroundColor Gray
    Write-Host "   2) Referenciarlo en network_security_config.xml como:" -ForegroundColor Gray
    Write-Host "         <certificates src=`"@raw/$($rootElement.Base)`" />" -ForegroundColor Gray
} else {
    Write-Host "   [!] No se encontro una raiz autofirmada en la cadena." -ForegroundColor Red
    Write-Host "       Pinea el certificado de mayor nivel (ultimo [$($total-1)])." -ForegroundColor Red
}
Write-Host ""
Write-Host "[INFO] Todos los certs exportados en: $OutDir" -ForegroundColor Gray

if ($null -ne $ssl) { $ssl.Dispose() }
if ($null -ne $tcp) { $tcp.Dispose() }
