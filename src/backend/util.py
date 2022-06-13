
import setting,setting_base
import os,json,jsonlines
from io import StringIO 
import sys,stat
from collections.abc import Iterable
import traceback
from flask import  jsonify,make_response,current_app,request 
import io,glob
import backend.zipfile  as zipfile
from backend.zipfile import ZipFile
#from  backend.updateableZipFile import UpdateableZipFile
import requests
from datetime import datetime,timezone
from dateutil.tz import tzlocal
from dateutil.parser import parse
from Crypto.Cipher import AES 
from Crypto import Random
import base64
import backend.exp_controller.status as sta
import backend.analyser.model_interface as model
import hashlib
import uuid
import numpy as np
class UnsupportVersionError(Exception):
    pass
class NoFileError(Exception):
    pass
class JSONLoadError(Exception):
    pass


class ExistedFileError(Exception):
    pass
class PathError(Exception):
    pass
class JSONWriteError(Exception):
    pass

def debug_log(msg:str):
    try:
        current_app.logger.info('------'+str(msg))
    except:
        pass
def error_logger(e,msg=None):
    error_class = e.__class__.__name__ #取得錯誤類型
    detail = e.args[0] #取得詳細內容
    cl, exc, tb = sys.exc_info() #取得Call Stack
    if msg is not None:
        current_app.logger.error((msg))
    current_app.logger.error(("---Error call stack start---"))
    current_app.logger.error(traceback.format_exc())
    # for callStack in traceback.extract_tb(tb): #取得Call Stack
    #     fileName = callStack[0].split(".")[0] #取得發生的檔案名稱
    #     lineNum = callStack[1] #取得發生的行號
    #     funcName = callStack[2] #取得發生的函數名稱
    #     errMsg = "File \"{}\", line {}, in {}: [{}] {}".format(fileName, lineNum, funcName, error_class, detail)
    #     current_app.logger.error((errMsg,))
    current_app.logger.error(("---Error call stack end---"))

def fileload(path):
    if os.path.isfile(path): 

        with open(path,'r',encoding='utf-8') as f:
            return f.read()
        
    else:
        raise NoFileError("")
def jsonload(path):
    if os.path.isfile(path): 

        try:
            with open(path,'rb') as f:
                return json.load( f, encoding='utf-8')
        except Exception as e:
            raise JSONLoadError(e)
    else:
        raise NoFileError("")
def jsondump(path,folder,d,indent=None):
    if not os.path.exists(folder):
        os.makedirs(folder)
    
    try:
        with open(path,'w' , encoding='utf-8') as f:
            f.write( json.dumps(d, ensure_ascii=False ,indent=indent) )
    except Exception as e:
        raise JSONWriteError(e)
    


def ndjsondumpline(fp:io.TextIOWrapper,d):
    with jsonlines.Writer(fp,compact=True) as writer:
        writer.write(d)
    
    

def ndjsonloadline(fp:io.TextIOWrapper):
    return jsonlines.Reader(fp)


def token_valid( request,token):
    if setting_base.VALID_TOKEN:
        if request.headers["token"]!=token:
            return False,None,"invalid token",401
    return True,None,None,None
def body_input_valid(valid_fn, body):
    try:
        valid_fn(body)
    except Exception as e:
        print(e)
        return False,None,e.args[0],400
    else:
        return True,None,None,200
def format_request(request)->dict:
    return request.json



class EnumEncoder(json.JSONEncoder):
    def default(self, obj):
        if type(obj) is sta.ValveEvent:
            return obj.value
        elif type(obj) is sta.PumpEvent:
            return obj.value
        elif type(obj) is sta.StepFlag:
            return obj.name
        elif type(obj) is sta.Flow:
            return obj.name
        elif type(obj) is sta.SubjectFlag:
            return obj.name
        elif type(obj) is sta.StatusFlag:
            return obj.name
        elif type(obj) is sta.BoundaryEvent:
            return obj.value
        elif type(obj) is model.DimensionType:
            return obj.name
        elif type(obj) is np.float64 or type(obj) is np.float32:
            return float(obj)
        elif type(obj) is datetime:
            return obj.astimezone(tzlocal()).isoformat(timespec='milliseconds')
            
        return json.JSONEncoder.default(self, obj)
def format_response(result,error,code,err_code='0_0'):
    """
    err_code:  (str code)_(str code)

    define:
    0_1 io dialogue occupied
    0_2 file PermissionError
    0_3 PathError
    """
    if error == None:
        response = {
            'succeed': True,
            'body': result,
            'error_msg':None,
            'err_code':err_code
        }
      
    else:
        if type(error) is 'str':
            response = {
                'succeed': False,
                'body':result,
                'error_msg': error,
                'err_code':err_code
            }
        elif isinstance(error,BaseException):
            response = {
                'succeed': False,
                'body':result,
                'error_msg': str(error), #str(error.args[0])
                'err_code':err_code
            }
        else:
            response = {
                'succeed': False,
                'body':result,
                'error_msg': str(error),
                'err_code':err_code
            }
    # print(result)
    return jsonify( json.loads( json.dumps(response, ensure_ascii=False, cls=EnumEncoder)) ),code


    
async def do_async(fn,*args):
    return await fn(*args)
#from System.Windows.Forms import OpenFileDialog, FolderBrowserDialog

import tkinter as tk
from tkinter import filedialog
def select_file_dialog(root_path:str,filetypes=None)->str:
    root = tk .Tk()
    root.attributes("-topmost", True)
    root.withdraw()
    root.overrideredirect(True)
    root.geometry('0x0+0+0')
    file_path = filedialog.askopenfilename(initialdir = root_path,filetypes=filetypes)
    root.deiconify()
    root.lift()
    root.focus_force()
    
    root.destroy()
    if file_path:
        return file_path
    else:
        return None

def select_type_file_dialog(mode)->str:
    if mode=='csv':
        filetypes=[("csv files", '.csv' )]    
    else:    
        filetypes=None
    root = tk .Tk()
    root.attributes("-topmost", True)
    root.withdraw()
    root.overrideredirect(True)
    root.geometry('0x0+0+0')
    file_path = filedialog.askopenfilename(filetypes=filetypes)
    root.deiconify()
    root.lift()
    root.focus_force()
    #root.wm_attributes("-topmost" , -1)
    root.destroy()
    if file_path:
        return file_path
    else:
        return None


def select_folder_dialog(root_path:str)->str:
    root = tk .Tk()
    root.withdraw()
    # root.lift()
    # root.attributes('-topmost',True)
    # root.after_idle(root.attributes,'-topmost',False)
    # Make it almost invisible - no decorations, 0 size, top left corner.
    root.overrideredirect(True)
    root.geometry('0x0+0+0')
    root.focus_force()
    root.wm_attributes("-topmost" , -1)
    # Show window again and lift it to top so it can get focus,
    # otherwise dialogs will end up behind the terminal.
    file_path=filedialog.askdirectory(initialdir = root_path)
    root.deiconify()
    root.lift()
    
    root.destroy()
    if file_path:
        return file_path
    else:
        return None

def save_file_dialog(root_path:str)->str:
    root = tk .Tk()
    root.withdraw()
    file_path = filedialog.asksaveasfilename(initialdir = root_path)
    root.destroy()
    if file_path:
        return file_path
    else:
        return None


def checkZipWriteable(zip_path):
    if os.path.isfile(zip_path):
        os.chmod(zip_path,stat.S_IWRITE)
        ZipFile(zip_path,'a')
    return True
    
def creatZipIO(zip_path):
    if os.path.isfile(zip_path):
        os.chmod(zip_path,stat.S_IWRITE)
        return ZipFile(zip_path,'a',compression=zipfile.ZIP_DEFLATED,compresslevel=1)
    else:
        return ZipFile(zip_path,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=1)
def zipIOJsonLoad(zfio:ZipFile,json_path):
    json_path=json_path.replace('\\','/')
    with zfio.open(json_path) as f:
        return json.load( f, encoding='utf-8')
def zipJsonLoad(zip_path,json_path):
    with zipfile.ZipFile(zip_path) as zf:
        if json_path in zf.namelist():
            try:
                with zf.open(json_path) as f:
                    return json.load( f, encoding='utf-8')
            except Exception as e:
                raise JSONLoadError(e)
        else:
            raise NoFileError(json_path)

def zipIOStrLoad(zfio:ZipFile,json_path):
    json_path=json_path.replace('\\','/')
    with zfio.open(json_path) as f:
        return f.read()
def isDirInZip(zfio:ZipFile,file_path):
    file_path=file_path.replace('\\','/')
    return any(x.startswith("%s/" % file_path.rstrip("/")) for x in zfio.namelist())
def isFileInZip(zfio:ZipFile,file_path):
    file_path=file_path.replace('\\','/')
    return file_path in zfio.namelist()
def zipIODictToJsonDump(zfio:ZipFile,d,json_path):
    json_path=json_path.replace('\\','/')
    if json_path in zfio.namelist():
        zfio.remove(json_path)
    zfio.writestr(json_path,json.dumps(d, ensure_ascii=False))

def zipIOStrDump(zfio:ZipFile,s,file_path):
    file_path=file_path.replace('\\','/')
    if file_path in zfio.namelist():
        zfio.remove(file_path)
    zfio.writestr(file_path,s)
def zipIOFileWrite(zfio:ZipFile,source_path,file_path):
    file_path=file_path.replace('\\','/')
    if file_path in zfio.namelist():
        zfio.remove(file_path)
    zfio.write(source_path,file_path)




class Capturing(list):
    def __enter__(self):
        self._stdout = sys.stdout
        sys.stdout = self._stringio = StringIO()
        return self
    def __exit__(self, *args):
        self.extend(self._stringio.getvalue().splitlines())
        del self._stringio    # free up some memory
        sys.stdout = self._stdout
def sandbox(fn):
    '''Given code as a string, execute it in a sandboxed python environment

    return the output, stderr, and any exception code
    '''
    old_stdout = sys.stdout
    old_stderr = sys.stderr
    redirected_output = sys.stdout = StringIO()
    redirected_error = sys.stderr = StringIO()

    out, err, exc , with_exc= [], [], [] , False
    result=None
    try:
        result=fn()
    except:
        exc = traceback.format_exc(1).split('\n')
        with_exc = True

    out = redirected_output.getvalue().split('\n')
    err = redirected_error.getvalue().split('\n')

    # reset outputs to the original values
    sys.stdout = old_stdout
    sys.stderr = old_stderr

    #return out, err, exc
    s = {
        "out":out, 
        "err":err,
        "exc":exc,
        "with_exc":with_exc
    }
    return s,result



