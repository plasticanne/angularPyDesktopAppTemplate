import os,random,string,socket
import logging,requests
import setting_base
from datetime import datetime,timezone
from dateutil.tz import tzlocal
from dateutil.parser import parse
from pathlib import Path
def get_local_date_now():
    return datetime.now().astimezone(tzlocal())

def get_local_date_now_timestamp_milliseconds():
    return int(datetime.now().timestamp()* 1000)
def local_date_to_filename(timeN:datetime):
    return timeN.replace(tzinfo=None).isoformat(timespec="milliseconds").replace(":","-")
def local_date_to_filename_compact(timeN:datetime):
    return timeN.replace(tzinfo=None).isoformat(timespec="milliseconds").replace(":","").replace('T','').replace('.','').replace('-','')
def utc_datetime_loaclzone_filename(timeN:datetime):
    return timeN.astimezone(tzlocal()).replace(tzinfo=None).isoformat(timespec="milliseconds").replace(":","-")
def get_web_utc_date()->datetime:
    try:
        r = requests.get(ASYNC_DATE_URL, timeout = 1)
        result=datetime.strptime(r.headers['Date'], "%a, %d %b %Y %H:%M:%S GMT").replace(tzinfo=timezone.utc)
    except Exception as e:
        return None
    else:
        return result
def loaclzone_filename_to_loaclzone_datetime(filename:str):
    return datetime.strptime(filename, '%Y-%m-%dT%H-%M-%S.%f')

def any_isoformat_2_utc_timestamp(timeN:str)->float:
    return parse(timeN).astimezone(timezone.utc).timestamp()

frontend_tail=''.join(random.choice(string.ascii_letters + string.digits) for x in range(20))
api_tail=''.join(random.choice(string.ascii_letters + string.digits) for x in range(20))
def tryPort(port):
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = False
    try:
        sock.bind(("0.0.0.0", int(port)))
        result = True
    except:
        print("Port {} is in use".format(port))
    sock.close()
    return result




REMOTE_DEBUGGING_PORT=8080
HOST='127.0.0.1'
GUI='cef'



LOGGING_LEVEL=logging.INFO # logger level






ROOT_PATH=os.path.dirname(__file__)

if setting_base.EXE_PACK:
    FRONTEND_ROOT='frontend_'+frontend_tail
    API_ROOT='api_'+api_tail
    POLTLY_SCRIPT_PATH=os.path.join(ROOT_PATH,'frontend/assets/plotly-latest.min.js')
    POLTLY_CSS_PATH=os.path.join(ROOT_PATH,'frontend/assets/dash.css')
else:
    FRONTEND_ROOT='frontend'
    API_ROOT='api'
    POLTLY_SCRIPT_PATH=os.path.join(Path(ROOT_PATH).parent,'frontend/src/assets/plotly-latest.min.js')
    POLTLY_CSS_PATH=os.path.join(Path(ROOT_PATH).parent,'frontend/src/assets/dash.css')
RANDOM_PORT_RANGE=(20000, 60000)
if setting_base.RANDOM_PORT:
    while True:
        PORT=random.randint(*RANDOM_PORT_RANGE)
        if tryPort(PORT):
            break
        else:
            continue
else:
    PORT='23948'

if setting_base.TLS:
    SCHEME='https'
else:
    SCHEME='http'
HOST_ENTERPOINT='{}://{}:{}'.format(SCHEME,HOST,PORT)
FRONTEND_ENTERPOINT='{}/{}/'.format(HOST_ENTERPOINT,FRONTEND_ROOT)
DEV_FRONTEND_ENTERPOINT='{}://{}:4200'.format(SCHEME,HOST)
if not setting_base.RANDOM_PORT:
    DASH_CSS=DEV_FRONTEND_ENTERPOINT+'/assets/dash.css'
    DASH_SCRIPT=DEV_FRONTEND_ENTERPOINT+'/assets/iframeResizer.contentWindow.min.js'
else:    
    DASH_CSS=FRONTEND_ENTERPOINT+'assets/dash.css'
    DASH_SCRIPT=FRONTEND_ENTERPOINT+'assets/iframeResizer.contentWindow.min.js'

DASH_PATH='/'+API_ROOT+'/dash/'
DASH_API='dash/'
DASH_MAIN='dash-container'
#FRONTEND_ENTERPOINT='frontend/index.html'


ASYNC_DATE_URL='http://ubuntu.com'
#'http://windowsupdate.microsoft.com'
#'http://download.windowsupdate.com'





if setting_base.EXE_PACK:
    GUI_DIR = os.path.join(ROOT_PATH, 'frontend')  # dist path
    
else:
    GUI_DIR = os.path.join(ROOT_PATH, '..', 'frontend','dist')  # dist path

# if not os.path.exists(gui_dir):  # frozen executable path
#     gui_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'frontend')
CFG_ROOT= os.path.join(ROOT_PATH,setting_base.CFG_FOLDER_NAME)

COMMON_LAYOUT_PATH= os.path.join(CFG_ROOT,setting_base.COMMON_LAYOUT_File_NAME)

MYMOJARAPP_LAYOUT_PATH= os.path.join(CFG_ROOT,setting_base.MYMOJARAPP_LAYOUT_File_NAME)


LOG_ROOT=os.path.join(ROOT_PATH,setting_base.LOG_FOLDER_NAME)
MAX_LOG_FILES= 50
SERVER_TIME=get_local_date_now().replace(tzinfo=None)
SERVER_TIME_FILENAME=local_date_to_filename(SERVER_TIME)

LOG_LINES_REALTIME=True




def enable_ana():
    global VERSION
    global USE_DASH
    global USE_SK
    global DASH_CSS
    global APP_NAME
    VERSION=setting_base.VERSION+'-anaDev'
    APP_NAME=setting_base.APP_NAME+'_ana'
    # for dash
    USE_DASH=True # dash backend
    # for sklearn
    USE_SK=True
    DASH_CSS=FRONTEND_ENTERPOINT+'assets/dash.css'