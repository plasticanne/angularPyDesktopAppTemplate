

        
import logging
import setting,setting_base
import os,sys,re
from contextlib import redirect_stdout,redirect_stderr

def exception_handler(exc_type, exc_value, exc_traceback):
    if issubclass(exc_type, KeyboardInterrupt):
        # Let the system handle things like CTRL+C
        sys.__excepthook__(exc_type, exc_value, exc_traceback)
    logger.error('---Exception: \n', exc_info=(exc_type, exc_value, exc_traceback))


# https://stackoverflow.com/questions/6234405/logging-uncaught-exceptions-in-python
sys.excepthook = exception_handler

folder=setting.LOG_ROOT
stream_log_path=os.path.join(folder,"{}__{}.log".format( setting.SERVER_TIME_FILENAME,setting_base.STDOUT_LOG ))
if not os.path.exists(folder):
    os.makedirs(folder)  
stream=open(stream_log_path, 'w', encoding='UTF-8')
# set logger before redirect_stdout
logger = logging.getLogger()
logging_format = logging.Formatter('[%(asctime)s] [%(levelname)8s] -- %(message)s')
handler=logging.StreamHandler(stream=stream)
handler.setFormatter(logging_format)
logger.addHandler(handler)
logger.setLevel(setting.LOGGING_LEVEL)




# set redirect_stdout before import most module
with redirect_stdout(stream):
    print("{} version: {}".format(setting_base.APP_NAME,setting_base.VERSION) )
    import import_index
    from mttkinter import mtTkinter as tk
    from threading import Thread, Lock
    server_lock = Lock()
    
    webview=import_index.webview
    # webview_logger = webview.logging.getLogger('pywebview')
    # webview_handler = logging.StreamHandler(stream=stream)
    # webview_formatter = logging.Formatter('[pywebview] %(message)s')
    # webview_handler.setFormatter(webview_formatter)
    # webview_logger.addHandler(webview_handler)
    # webview_logger.setLevel(logging.DEBUG)
    #set_logging(logger)
    def clean_logfile():
        folder=setting.LOG_ROOT
        reg1='^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}-[0-9]{2}-[0-9]{2}.[0-9]*__\w+.log$'
        files = os.listdir(folder )
        date_file=[]
        date_sort=[ setting.SERVER_TIME ]
        for file in files:
            if re.match(reg1, file):
                date=setting.loaclzone_filename_to_loaclzone_datetime( file.split("__")[0])
                date_file.append({"file":file,"date":date} )
                if date not in date_sort:
                    date_sort.append(date)
        date_sort.sort()        
        date_sort=date_sort[-1*(setting.MAX_LOG_FILES+1):-1]
        for file in date_file:
            if file["date"] not in date_sort:
                os.remove(os.path.join(folder,file["file"]))

    
    def set_cef():
        
        import_index.webview.platforms.cef.settings.update({
            'ignore_certificate_errors':True,
            'net_security_expiration_enabled':False,
            'persist_session_cookies':True,
            'cache_path': os.path.join( setting.ROOT_PATH,'.cache').replace('/','\\'),
            # 'debug': True,
            # 'log_file': os.path.join(folder,"{}__{}.log".format( setting.SERVER_TIME_FILENAME,setting_base.CEF_LOG )).replace('/','\\'),
            # 'log_severity':2 # 1"verbose", 2"info", 3"warning", 4"error", 5"error-report" or 6"disable".
        })
        if setting_base.GUI_DEBUG:
            #https://github.com/cztomczak/cefpython/blob/master/api/ApplicationSettings.md#application-settings
            import_index.webview.platforms.cef.settings.update(
                {'debug': True,
                'remote_debugging_port':5000,
                'context_menu':{
                    "enabled" :True,
                    "navigation" :True,
                    "print":True,
                    "view_source" :True,
                    "external_browser" :True,
                    "devtools" :True,
                }
                })
        #https://github.com/cztomczak/cefpython/blob/master/api/BrowserSettings.md#browser-settings
        import_index.browserSettings.update({
                    'file_access_from_file_urls_allowed':True,
                    'web_security_disabled':True,
                    'universal_access_from_file_urls_allowed':True,
                    #'inherit_client_handlers_for_popups':False,
                    #'tab_to_links_disabled':True,
                    #'load_drops_disabled':True,
                    
                })

    # webview.platforms.cef.browserSettings.update({
    #     'file_access_from_file_urls_allowed':True,
    #     'web_security_disabled':True,
    # })
    import ctypes 
    from time import sleep
    from http.client import HTTPConnection,HTTPSConnection
    import requests
    from backend.server import run_server,run_socket_server
    def is_server_ok():
        
        
        while True:
            try:
                # conn = HTTPSConnection(host, port)
                # conn.request('GET', url )
                # r = conn.getresponse()
                r=requests.get(setting.FRONTEND_ENTERPOINT,timeout = 1, verify=False)
                return r.status_code == 200
            except:
                print('Server not started')
                #return False

    class Logo:
        def __init__(self):
            user32 = ctypes.windll.user32 
            screensize = (user32.GetSystemMetrics(0), user32.GetSystemMetrics(1), user32.GetSystemMetrics(2), user32.GetSystemMetrics(3)) 
            self.root = tk.Tk()
            self.root.focus_force()
            self.root.wm_attributes("-topmost" , -1)
            self.hwnd=self.root.winfo_id()
            user32.AllowSetForegroundWindow(self.hwnd)
            user32.SetForegroundWindow(self.hwnd)
            user32.BringWindowToTop(self.hwnd)
            self.root.overrideredirect(1)
            self.root.wm_geometry("+{}+{}".format((screensize[0]-500-200)//2,(screensize[1]-183-60-100)//2))
            #self.root.geometry("590x110") #You want the size of the app to be 500x500
            self.root.resizable(0, 0) #Don't allow resizing in the x or y direction
            self.root.config(cursor="none")
            self.root.configure(background='white',cursor='none')
            img = tk.PhotoImage(file = os.path.join(setting.ROOT_PATH, 'img/logo_500.png'))
            label_img = tk.Label(self.root, image = img,background='white',cursor='none')
            label_img.pack(pady=30,padx=100)
            self.root.update()
            
            self.root.quit()
            
        def close(self):
            self.root.destroy()

    class ShowDetectMsg:
        def __init__(self):
            
            self.root = tk.Tk()
            self.root.title("Warning")
            self.root.wm_geometry("250x150+600+374")
            self.root.resizable(0, 0)
            tk.Label(self.root, text="偵測到程式已在執行中。").grid(row=1, sticky=tk.W,pady=20,padx=55)
            tk.Button(self.root, text="確定",width = 10,command=self.close).grid(row=2, sticky=tk.W, pady=20,padx=85)
            tk.mainloop()
        def close(self):
            self.root.destroy()
    def is_admin():
        import ctypes, sys #,subprocess
        try:
            return ctypes.windll.shell32.IsUserAnAdmin()
        except:
            return False        

    def killPort():
        
        d = os.popen("netstat -ano | findstr :{}".format(setting.PORT)).read()
        
        def fi(x):
            try:
                a=int(str(x))
            except:
                pass
            else:
                if a>0:
                    return True
        target_list=list(filter(fi  ,itertools.chain.from_iterable(([x.split(" ") for x in d.split("\n")]))))
        for s in target_list:
            print("taskkill /PID {} /F".format(s))
            #commands = "taskkill /PID {} /F".format(s)
            os.popen("taskkill /PID {} /F".format(s) ).read()
            #subprocess.Popen("taskkill /PID {} /F ".format(s))
    def direct_cef_win(logo,url,title,width, height):
        #https://www.google.com/search?sxsrf=ALeKk00DyaCguz58zzQ7XFtF0UsHqZfOvw:1598427649350&q=cefpython3+width+height&spell=1&sa=X&ved=2ahUKEwje-vOBr7jrAhVpF6YKHcSWAGUQBSgAegQIDxAr&biw=1102&bih=736
        def _exception_handler(exc_type, exc_value, exc_traceback):
            cef.ExceptHook(exc_type, exc_value, exc_traceback)
            if issubclass(exc_type, KeyboardInterrupt):
                # Let the system handle things like CTRL+C
                sys.__excepthook__(*args)
            logger.error('---Exception: \n', exc_info=(exc_type, exc_value, exc_traceback))
        sys.excepthook = _exception_handler   # To shutdown all CEF processes on error
        import_index.webview.platforms.cef.cef.Initialize(settings=import_index.webview.platforms.cef.settings)
        logo.close()
        import_index.webview.platforms.cef.cef.CreateBrowserSync(url=url,window_title=title)
        import_index.webview.platforms.cef.cef.MessageLoop()  
        import_index.webview.platforms.cef.cef.Shutdown()
    def webview_win(logo,url,title,width, height):
        def restore(window):
            try:
                focus_browser(window.uid)
            except Exception as e:
                pass

        logo.close()
        window = webview.create_window(title, 
        url=url,
        width=width, height=height, text_select=True,
        )
        
        webview.start( func=restore , args=[window], gui=setting.GUI,debug=setting_base.GUI_DEBUG)


    logo=Logo()
    clean_logfile()
    print('Starting server')
    if setting_base.USE_SOCKET:
        b_server=run_socket_server
    else:
        b_server=run_server
    t = Thread(target=b_server,args=(setting.HOST,setting.PORT))
    t.daemon = True
    t.start()
    print('Checking server')
    sleep(3)
    if is_server_ok():
        print('Server started')
        set_cef()
        webview_win(
            logo,
            setting.FRONTEND_ENTERPOINT+'?lang={}'.format(setting_base.LOCALE),
            setting_base.APP_NAME,
            1080,768
            )
        

stream.close()


