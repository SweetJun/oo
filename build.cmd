@ECHO OFF

rem make sure current work directory is where the script is located
cd %~dp0
SET "scriptDir=%cd%"

call yarn install
call yarn build

