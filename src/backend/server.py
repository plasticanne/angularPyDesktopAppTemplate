import json
import os,setting,setting_base
import re
import webbrowser
from functools import wraps
from flask_cors import CORS, cross_origin
from flask import Flask, url_for, render_template, jsonify, request, make_response,send_from_directory
import webview
import logging
import backend.util




server = Flask(__name__, 
    static_folder=setting.GUI_DIR,
    #static_url_path='/123' ,
    template_folder=setting.GUI_DIR)
server.config['SEND_FILE_MAX_AGE_DEFAULT'] = 1  # disable caching

DASH_PAGES={}
if setting_base.USE_DASH:
    import dash 
    import dash_core_components as dcc
    import dash_html_components as html 
    
    dash_app = dash.Dash(
        __name__,
        server=server,
        external_stylesheets=[setting.DASH_CSS],
        external_scripts=[setting.DASH_SCRIPT],
        routes_pathname_prefix=setting.DASH_PATH
    )
    dash_app.layout = html.Div(
        [dcc.Location(id='url'),
        html.Div(id=setting.DASH_MAIN)]
        )

    @dash_app.callback(dash.dependencies.Output(setting.DASH_MAIN, 'children'),
                [dash.dependencies.Input('url', 'pathname')])
    def display_page(pathname):
        global DASH_PAGES
        
        #util.debug_log("dash path {}".format(pathname))
        try:
            return DASH_PAGES[pathname]
        except Exception as e:
            return html.Div()
        
        

def set_logging(server):
    #folder=setting.LOG_ROOT
    # path=os.path.join(setting.LOG_ROOT,"{}__{}.log".format( setting.SERVER_TIME_FILENAME,setting.ERROR_LOG ))
    # if not os.path.exists(folder):
    #     os.makedirs(folder)
    # handler = logging.FileHandler(path, encoding='UTF-8')
    # handler = logging.StreamHandler()
    # logging_format = logging.Formatter(
    #     '[%(asctime)s] [%(levelname)8s] -- %(message)s')
    # handler.setFormatter(logging_format)
    # server.logger.addHandler(handler)
    server.logger.setLevel(logging.INFO)
    server.logger.info('app start')
    server.logger.setLevel(setting.LOGGING_LEVEL)

    # handler = logging.StreamHandler()
    # logging_format = logging.Formatter('%(message)s')
    # handler.setFormatter(logging_format)
    # logging.getLogger('werkzeug').addHandler(handler)
    # logging.getLogger('werkzeug').setLevel(setting.LOGGING_LEVEL)


set_logging(server)
#logging.basicConfig(level=logging.DEBUG)
cors = CORS(server,resources={
    r"/api/*": {"origins": [setting.DEV_FRONTEND_ENTERPOINT]},
    r"/lock/*": {"origins": ['*']}
    }, supports_credentials=True)
#cors = CORS(server,resources={r"/a": {"origins": ['*']}}, supports_credentials=True)
#app_Flask.config['CORS_HEADERS'] = 'Content-Type'

if setting_base.USE_SOCKET:
    from flask_socketio import SocketIO
    socketio = SocketIO(server)
    socketio.init_app(server, cors_allowed_origins="*",
    async_mode ='threading')



@server.after_request
def add_header(response):
    response.headers['Cache-Control'] = 'no-store'
    #response.headers['Access-Control-Allow-Origin'] = '*'
    #response.headers['Access-Control-Allow-Credentials'] = False
    return response


def verify_token(function):
    @wraps(function)
    def wrapper(*args, **kwargs):
        data = json.loads(request.data)
        token = data.get('token')
        if token == webview.token:
            return function(*args, **kwargs)
        else:
            raise Exception('Authentication error')
    return wrapper





@server.route('/{0}/<path:path>'.format(setting.FRONTEND_ROOT), methods=['GET'])
#@verify_token
def static_proxy(path):
    return send_from_directory(setting.GUI_DIR, path),200

@server.route('/{0}/'.format(setting.FRONTEND_ROOT), methods=['GET'])
#@verify_token
def index():
    return render_template( 'index.html',
    root='/{0}/'.format(setting.FRONTEND_ROOT),
    api_root='/{0}/'.format(setting.API_ROOT)),200
# @server.route('/{0}/'.format(setting.FRONTEND_ROOT), methods=['GET'])
# #@verify_token
# def index():
#     """
#     Render index.html. Initialization is performed asynchronously in initialize() function
#     """
#     return render_template('index.html'
#     #return server.send_static_file('index.html',
#     #return make_response(open('index.html').read(), 
#     #token=webview.token
#     )

@server.route('/destory_app', methods=['POST'])
#@verify_token
def destory_app():
    try:
        raise Exception('123')
    except Exception as e:
        backend.util.error_logger(e,msg={"a":123})
        
    return backend.util.format_response(None,"error",500)




import backend.common.router
backend.common.router.add_router(server)   

if setting_base.USE_DASH :
    import backend.myMojarApp.router
    backend.myMojarApp.router.add_router(server,dash_app,DASH_PAGES)



# @server.errorhandler(InternalServerError)
# def handle_500(e):
#     original = getattr(e, "original_exception", None)

#     if original is None:
#         # direct 500 error, such as abort(500)
#         return backend.util.format_response(None,e,500)

#     # wrapped unhandled error
#     return backend.util.format_response(None,e,500)



def run_server(host,port):
    
    if setting_base.TLS:
        #server.debug = True
        server.run(host=host, port=port, 
        threaded=True,
        ssl_context='adhoc',
        
        )
    else:
        #server.debug = True
        server.run(host=host, port=port, 
        threaded=True,
        
        )
    
def run_socket_server(host,port):
    
    if setting_base.TLS:
        socketio.run(server,
        host=host, port=port, 
        ssl_context='adhoc')
    else:
        socketio.run(server,
        host=host, port=port, )
