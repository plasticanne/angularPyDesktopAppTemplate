import setting,os
import socket
import matplotlib
matplotlib.use('agg')
import matplotlib.pyplot as plt  
plt.switch_backend('agg')

def getfqdn(name=''):
    """override getfqdn for socket server
    """
    name = name.strip()
    if not name or name == '0.0.0.0':
        name = socket.gethostname() 
    try:
        hostname, aliases, ipaddrs = socket.gethostbyaddr(name)
    except:
        pass
    else:
        aliases.insert(0, hostname)
        for name in aliases:
            if '.' in name:
                break
        else:
            name = hostname
    return name
socket.getfqdn=getfqdn
from engineio.async_drivers.threading import threading, time ,queue

import werkzeug.serving 


def log_request(self, code="-", size="-"):
    """override for custom logger
    """
    try:
        path = werkzeug.serving.uri_to_iri(self.path).split("/")
        if (len(path)>2):
            p="/".join(path[2:] )
        else:
            p="/".join(path[1:] )
        msg = "%s %s %s" % (self.command, p, self.request_version)
    except werkzeug.serving.AttributeError:
        # path isn't set if the requestline was bad
        msg = self.requestline

    code = str(code)
    self.log("info", '"%s" %s %s', msg, code, size)

werkzeug.serving.WSGIRequestHandler.log_request=log_request

#import win32gui
from ctypes import windll

import webview
import webview.platforms.cef
# override for set cef Browser setting
cef=webview.platforms.cef.cef
Browser=webview.platforms.cef.Browser
instances=webview.platforms.cef.instances
default_html=webview.platforms.cef.default_html
LoadHandler=webview.platforms.cef.LoadHandler
#create_browser=webview.platforms.cef.create_browser
browserSettings={}

def create_browser(window, handle, alert_func):
    def _create():
        real_url = 'data:text/html,{0}'.format(window.html) if window.html else window.real_url or 'data:text/html,{0}'.format(default_html)
        cef_browser = cef.CreateBrowserSync(window_info=window_info, url=real_url,settings=browserSettings)
        browser = Browser(window, handle, cef_browser)

        bindings = cef.JavascriptBindings()
        bindings.SetObject('external', browser.js_bridge)
        bindings.SetFunction('alert', alert_func)

        cef_browser.SetJavascriptBindings(bindings)
        cef_browser.SetClientHandler(LoadHandler())

        instances[window.uid] = browser
        
        window.shown.set()
        # windll.user32.AllowSetForegroundWindow(browser.inner_hwnd)
        # windll.user32.SetForegroundWindow(browser.inner_hwnd)
        # windll.user32.BringWindowToTop(browser.inner_hwnd)
        # window.hide()
        # window.show()
        # cef_browser.SetFocus(True)
        
        

    window_info = cef.WindowInfo()
    window_info.SetAsChild(handle)
    cef.PostTask(cef.TID_UI, _create)
    
webview.platforms.cef.create_browser=create_browser


def focus_browser(uid):
    browser=webview.platforms.cef.instance[uid].browser
    windll.user32.AllowSetForegroundWindow(browser.inner_hwnd)
    windll.user32.SetForegroundWindow(browser.inner_hwn)
    windll.user32.BringWindowToTop(browser.inner_hwnd)

# override cef.create_browser
# def _create():
#     window=create_browser.window
#     handle=create_browser.handle
#     window_info=create_browser.window_info
#     alert_func=create_browser.alert_func

#     real_url = 'data:text/html,{0}'.format(window.html) if window.html else window.real_url or 'data:text/html,{0}'.format(default_html)
#     cef_browser = cef.CreateBrowserSync(window_info=window_info, url=real_url,settings=browserSettings )
#     browser = Browser(window, handle, cef_browser)

#     bindings = cef.JavascriptBindings()
#     bindings.SetObject('external', browser.js_bridge)
#     bindings.SetFunction('alert', alert_func)

#     cef_browser.SetJavascriptBindings(bindings)
#     cef_browser.SetClientHandler(LoadHandler())

#     instances[window.uid] = browser
#     window.shown.set()
#webview.platforms.cef.create_browser._create=_create

# pre import Dash 
if setting_base.USE_DASH:
    import plotly
    import plotly.tools as tls
    import plotly.graph_objects as go
    #from plotly.validators.layout import *
    import plotly.express as px
    import dash_html_components as html
    import dash_core_components as dcc
    import dash_table
    

# pre import sklearn
if setting_base.USE_SK:
    import sklearn.utils._cython_blas
    import sklearn.neighbors.typedefs
    import sklearn.neighbors.quad_tree
    import sklearn.tree
    import sklearn.tree._utils
    import backend.analyser.custom_provider