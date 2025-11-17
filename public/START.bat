@echo off
title Zagon projekta

echo Zagon backend-a...
start cmd /k "nodemon server.js"

echo Odpri frontend...
start "" "index.html"

echo Vse je zagnano!
pause
