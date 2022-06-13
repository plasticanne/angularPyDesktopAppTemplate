python ./build_setinfo.py
if %errorlevel% neq 0 exit /b %errorlevel%
rm -r ./build/*
rm -r ./dist/*
pyinstaller ./main.spec 
for /f %%p in ('dir /a:d /s /b dist\ESRTSD\pyinstaller*') do rd /s /q %%p
for /f %%p in ('dir /a:d /s /b dist\ESRTSD\Flask_Compress*') do rd /s /q %%p