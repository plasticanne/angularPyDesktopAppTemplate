
import winreg
import hashlib
import setting_base
import jwt,csv
from datetime import datetime
import random
def os_detect():
    if setting_base.OS=="Windows":
        if setting_base.IS64BIT:
            pass
        else:
            raise ValueError("OS not supported")
    elif setting_base.OS=="Darwin":
        raise ValueError("OS not supported")
    elif setting_base.OS=="Linux":
        raise ValueError("OS not supported")
    else:
        raise ValueError("OS not supported")



def get_machineguid():
    os_detect()
    regpath='Software\Microsoft\Cryptography'
    with winreg.OpenKey(
        winreg.HKEY_LOCAL_MACHINE, regpath, 0, winreg.KEY_READ | winreg.KEY_WOW64_64KEY) as key:
        guid = winreg.QueryValueEx(key, "MachineGuid")[0]
        return guid
       





    

