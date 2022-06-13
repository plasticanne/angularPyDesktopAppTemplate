
import logging
import webview
import setting
from contextlib import redirect_stdout
from io import StringIO
from threading import Thread, Lock
from time import sleep
from backend.server import run_server


# cefpython/cefpython_py36.pyd   dependencies list
# system32/user32.dll
# system32/MSVCP140.dll
# system32/SHELL32.dll
# system32/gdi32.dll
# system32/kernel32.dll
# system32/VCRUNTIME140_1.dll
# system32/VCRUNTIME140.dll
# system32/ucrtbase.dll


server_lock = Lock()

logger = logging.getLogger(__name__)

import webview.platforms.cef
cef=webview.platforms.cef.cef
Browser=webview.platforms.cef.Browser
instances=webview.platforms.cef.instances
default_html=webview.platforms.cef.default_html
create_browser=webview.platforms.cef.create_browser
browserSettings={}

def _create():
    window=create_browser.window
    handle=create_browser.handle
    alert_func=create_browser.alert_func
    real_url = 'data:text/html,{0}'.format(window.html) if window.html else window.real_url or 'data:text/html,{0}'.format(default_html)
    cef_browser = cef.CreateBrowserSync(window_info=window_info, url=real_url,settings=browserSettings )
    browser = Browser(window, handle, cef_browser)

    bindings = cef.JavascriptBindings()
    bindings.SetObject('external', browser.js_bridge)
    bindings.SetFunction('alert', alert_func)

    cef_browser.SetJavascriptBindings(bindings)
    cef_browser.SetClientHandler(LoadHandler())

    instances[window.uid] = browser
    window.shown.set()
webview.platforms.cef.create_browser._create=_create
#https://github.com/cztomczak/cefpython/blob/master/api/ApplicationSettings.md
webview.platforms.cef.settings.update({
    'debug': True,
    'remote_debugging_port':5000,
    'context_menu':{
        "enabled" :True,
        "navigation" :True,
        "view_source" :True,
        "external_browser" :True,
        "devtools" :True,
    },
    'ignore_certificate_errors':True,
    'net_security_expiration_enabled':False
})
browserSettings.update({
            'file_access_from_file_urls_allowed':True,
            'web_security_disabled':True,
            'universal_access_from_file_urls_allowed':True,
            'inherit_client_handlers_for_popups':False,
            'tab_to_links_disabled':True,
            'load_drops_disabled':True,
        })




def run_standalone_cef():
    from cefpython3 import cefpython as cef
    import platform
    import sys
    
    browserSettings={
            'file_access_from_file_urls_allowed':True,
            'web_security_disabled':True,
            'universal_access_from_file_urls_allowed':True
        }
    
    sys.excepthook = cef.ExceptHook  # To shutdown all CEF processes on error
    cef.Initialize()
    cef.CreateBrowserSync(url='http://127.0.0.1:4200/entree/select_page?lang=zh_hant',
                        window_title="Hello World!")
    cef.MessageLoop()
    cef.Shutdown()

def run_pywebview():
    stream = StringIO()
    
    with redirect_stdout(stream):

        
        window = webview.create_window('cef', 
        'http://127.0.0.1:4200'
        #'https://127.0.0.1:23948/api/usersn'
        )
        
        webview.start(gui='cef',debug=True)

if __name__ == '__main__':
    
    run_standalone_cef()



