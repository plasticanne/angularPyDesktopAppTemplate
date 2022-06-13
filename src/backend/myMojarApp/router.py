
from flask import jsonify, request, make_response
import backend.util as util
import backend.myMojarApp.handler as handler
import setting,json,setting_base
from functools import wraps
import backend.common.handler as common

IO_occupied=False # state on file opening
_memState=None
def check_io_occupied(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        global IO_occupied
        if not IO_occupied:
            IO_occupied=True
            try:
                result=func(*args, **kwargs)
            except Exception as e:
                IO_occupied=False
                return util.format_response(None,e,403)
            else:
                IO_occupied=False
                return result
        else:
            return util.format_response(None,"io occupied",403,err_code='0_1')
    return wrapper



def create_instance(dash_app,dash_page):
    util.debug_log("create_instance")
    global _memState
    _memState=handler.MemState()
    _memState.DASH_APP=dash_app
    _memState.DASH_PAGES=dash_page

def add_router(server,dash_app,dash_page):   
    this_app_path='{0}/myMajorApp'.format(setting.API_ROOT)
    # recommend design http api with JSON-RPC
    handler.set_server(server)

    @server.route('/{0}/initialize'.format(this_app_path), methods=['POST'])
    @common.verify_token
    def apipost_myMajorApp_initialize():
        create_instance(dash_app,dash_page)
        return util.format_response(None,None,200)

    @server.route('/{0}/select_read_file'.format(this_app_path), methods=['GET'])
    @common.verify_token
    @check_io_occupied
    def apipost_select_read_file():
        result,error,code = handler.get_read_path()
        return util.format_response(result,error,code)

    @server.route('/{0}/initialize'.format(this_app_path), methods=['GET'])
    @common.verify_token
    def get_dash_url():
        util.debug_log("get_dash_url")
        _memState.gen_dash_page()
        return util.format_response(None,None,200)

    @server.route('/{0}/layout'.format(this_app_path), methods=['GET'])
    @common.verify_token
    def apiget_myMajorApp_layout():
        result,error,code = handler.get_layout()
        return util.format_response(result,error,code)
    
    @server.route('/{0}/datas'.format(this_app_path), methods=['GET'])
    @common.verify_token
    def apiget_datas():
        x,y = handler.get_datas()
        return util.format_response([x.tolist(), y.tolist()],None,200)

    @server.route('/{0}/dash_datas'.format(this_app_path), methods=['GET'])
    @common.verify_token
    def apiget_dash_datas():
        result=_memState.gen_dash_page()
        return util.format_response( result,None,200)