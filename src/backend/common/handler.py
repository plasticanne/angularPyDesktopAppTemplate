import setting_base,setting
import os,json,random,string,re
import backend.common.register as register
import backend.util as util
from flask import request

SERVER=None
TOKEN=None
def set_server(server):
    global SERVER
    #SERVER=server
def set_token():
    global TOKEN
    X=32
    TOKEN=''.join(random.choice(string.ascii_letters+string.digits) for x in range(X))
    return {"token":TOKEN},None,200
def get_machineguid():
    try:
        guid=register.get_machineguid()
    except Exception as e:
        return None,e,200
    else:
        d={"guid":guid }
        return {"code":d,"can_access":None},None,200


def get_layout():
    def new_one():
        path= setting.COMMON_LAYOUT_PATH
        try:
            d=util.jsonload(path)
        except util.NoFileError:
            return None,"Missing layout file.",403
        else:
            return  d,None,200
    return  new_one()
        
    

from functools import wraps

def verify_token(func):
    """verify_token
    """
    @wraps(func)
    def wrapper(*args, **kwargs):
        
        is_pass,result,error,code=util.token_valid( request,TOKEN)
        if not is_pass:
            return util.format_response(result,error,code)
        return func(*args, **kwargs)
    return wrapper
    
def verify_request(keys:list):
    """verify_request
    """
    def outterWrapper(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            def fn(_body):
                for key in keys:
                    if key not in _body: raise ValueError("{} is null".format(key))
            _body=util.format_request(request)
            is_pass,result,error,code=util.body_input_valid(fn,_body)
            if not is_pass:
                return util.format_response(result,error,code)
            return func(_body)
        return wrapper
    return outterWrapper
def get_near_server():
    r =os.popen(f'wmic process where name="{setting_base.EXE_NAME}" get processid').read()
    d=re.split("\s",r)
    near_servers=[]
    for pid in [x for x in d if x is not ''][1:]:
        r =os.popen('netstat -ano | findstr " {} "'.format(pid)).read()
        d=[x for x in re.split("\n",r)if x is not '']
        for line in d:
            ad=[x for x in re.split("\s",line) if x is not '']
            r_port=int(ad[1].split(':')[1])
            if r_port != setting.PORT and  setting_base.RANDOM_PORT_RANGE[0] <=  r_port <=setting_base.RANDOM_PORT_RANGE[1]:
                near_servers.append(ad[1])
    return near_servers,None,200

def exec_new_intance():
    path=os.path.join(setting.ROOT_PATH).replace('\\', '/')
    cmd=f'start /d "{path}" '+setting_base.EXE_NAME
    os.system(cmd)
    return None,None,200



