
from flask import jsonify, request, make_response
import backend.util as util
import backend.common.handler as handler
import setting,json,setting_base
from functools import wraps


def add_router(server):   
    # recommend design http api with JSON-RPC
    handler.set_server(server)
    
    @server.route('/{0}/token'.format(setting.API_ROOT), methods=['POST'])
    def apipost_token():
        
        result,error,code = handler.set_token()
        return util.format_response(result,error,code)

    @server.route('/{0}/usersn'.format(setting.API_ROOT), methods=['GET'])
    @handler.verify_token
    def apiget_usersn():
        result,error,code = handler.get_machineguid()
        return util.format_response(result,error,code)





    @server.route('/{0}/version'.format(setting.API_ROOT), methods=['GET'])
    def apipost_version():
        return util.format_response( {"ver":setting_base.VERSION} ,None,200)

    @server.route('/{0}/layout'.format(setting.API_ROOT), methods=['GET'])
    @handler.verify_token
    def apiget_layout():
        result,error,code = handler.get_layout()
        return util.format_response(result,error,code)

    @server.route('/{0}/near_server'.format(setting.API_ROOT), methods=['GET'])
    @handler.verify_token
    def apiget_near_server():
        result,error,code = handler.get_near_server()
        return util.format_response(result,error,code)

    @server.route('/{0}/exec_new_intance'.format(setting.API_ROOT), methods=['GET'])
    @handler.verify_token
    def apiget_exec_new_intance():
        result,error,code = handler.exec_new_intance()
        return util.format_response(result,error,code)
