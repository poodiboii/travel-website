@echo off
echo Starting Cloudflared tunnel to http://localhost:5000
echo Keep this window open.
echo Copy the https://*.trycloudflare.com URL it prints.
echo.
"%USERPROFILE%\OneDrive\Desktop\cloudflared.exe" tunnel --url http://localhost:5000
