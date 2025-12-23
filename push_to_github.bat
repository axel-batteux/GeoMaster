@echo off
echo Pushing GeoMaster to GitHub...
git add .
git commit -m "Update: %date% %time%"
git push origin main
echo Done!
pause
