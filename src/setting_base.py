import os,platform
import locale,logging
import ctypes

OS=platform.system()
def is_os_64bit():
    return platform.machine().endswith('64')
IS64BIT=is_os_64bit()


LOCAL_LIST={
    "zh_list":['zh_cn', 'zh_cn.big5', 'zh_cn.euc', 'zh_hk', 'zh_hk.big5hk', 'zh_sg', 'zh_sg.gbk' , 'zh_tw', 'zh_tw.euc', 'zh_tw.euctw'],
    "ja_list":['ja', 'ja_jp', 'ja_jp.euc', 'ja_jp.mscode', 'ja_jp.pck', 'japan', 'japanese', 'japanese-euc', 'japanese.euc', 'jp_jp']
}
def detect_lang():
    windll = ctypes.windll.kernel32
    lang=locale.windows_locale[windll.GetUserDefaultUILanguage()][0:2]
    if lang=='zh':
        return 'zh_hant'
    else:
        return 'en'
LOCALE=detect_lang()

VERSION="0.0.1-a1"
APP_NAME='My_App'
APP_FOLDER_NAME='My_App'
EXE_NAME='My_App.exe'


# dont change for prodoct
VALID_TOKEN=True #valid http request by token in header

GUI_DEBUG=False # fix False   , the cef debug setting
TLS=True  # fix True  , use https
EXE_PACK=True  # fix True     , the frontend path for building exe
RANDOM_PORT=True # fix True  , use random port
# for ssocket
USE_SOCKET=True

# for dash
USE_DASH=True # dash backend
# for sklearn
USE_SK=True



RESILT_HASHADDHEAD='&&'
RESILT_HASHADDTAIL='&&'


CFG_FOLDER_NAME= "cfg"

CFG_INFO_FILE_NAME= "info"
COMMON_LAYOUT_File_NAME= "common_layout"
MYMOJARAPP_LAYOUT_File_NAME= "myMojarApp_layout"



LOG_FOLDER_NAME='log'

STDOUT_LOG='stdout'
CEF_LOG='guistdout'



UNINSTALL_KEEP_TARGET=[LOG_FOLDER_NAME+'/' , CFG_FOLDER_NAME+'/' ,'.cache/']