*Description*  
A python base desktop app with lighweigth(compare to Electron) pywebview with CEF  for python base data analysis  GUI project  

frontend : Angular7 + primeng  
chart solutions : Dash with iframe + uplot.js   
backend : flask , flask_socketio  
package : pyinstaller  



*Install For Development Env*  

**Install python**  
dont install by anaconda for smaller package size
    `pip install -r min_requirements`  


**Install and build frontend**  
see readme  ../frontend/README.md  


*Run For Dev*

there are 3 mode for different dev steps: 
- use any browser: for base code dev
- use cef: for gui adjustment on cef browser
- use main.py: for full app adjustment, this must have build frontend before  

**use any browser**  

***run flask server***  
run at 127.0.0.1:23948  
    `cd src; python local_dev_server.py  `

***frontend server***  
by angular-cli

run at 127.0.0.1:4200  
    `cd frontend; npm start  `

**use cef**  

***flask server***  
same 'to use any browser'  

***frontend server***  
same 'to use any browser'  

***cef browser***  
    `cd src; python local_cef_test.py  `

**use main.py**  

***frontend setting***  
build frontend  
   `cd frontend; npm run build`

***run enter point***  
   `cd src; python main.py  `


*Package by pyinstaller*  

**Setting**  

***frontend setting***  
    `cd frontend; npm run build`

**Build**  
    `build.cmd`


