# Script to enable Windows Long Path Support
# This requires Administrator privileges
# Run this script as Administrator: Right-click PowerShell -> Run as Administrator

Write-Host "Enabling Windows Long Path Support..." -ForegroundColor Yellow
Write-Host "This requires Administrator privileges." -ForegroundColor Yellow
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "ERROR: This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Red
    exit 1
}

try {
    $regPath = "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem"
    $regName = "LongPathsEnabled"
    $regValue = 1
    
    # Check current value
    $currentValue = Get-ItemProperty -Path $regPath -Name $regName -ErrorAction SilentlyContinue
    
    if ($currentValue.LongPathsEnabled -eq 1) {
        Write-Host "Long path support is already enabled." -ForegroundColor Green
    } else {
        # Set the registry value
        Set-ItemProperty -Path $regPath -Name $regName -Value $regValue -Type DWORD -Force
        Write-Host "Long path support has been enabled successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "IMPORTANT: You must restart your computer for this change to take effect." -ForegroundColor Yellow
        Write-Host "After restarting, try building your project again." -ForegroundColor Yellow
    }
} catch {
    Write-Host "ERROR: Failed to enable long path support: $_" -ForegroundColor Red
    exit 1
}

