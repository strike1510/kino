@echo off
cd /clientside
start http://localhost:8081/
npm run serve -- --port 8081
