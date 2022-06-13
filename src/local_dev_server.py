from datetime import datetime,timedelta,timezone
from flask import jsonify
import json,time
import setting_base

setting_base.GUI_DEBUG=True  
setting_base.TLS=False
setting_base.EXE_PACK=False
setting_base.RANDOM_PORT=False

import setting

def run_server():
    import logging
    setting.LOGGING_LEVEL=logging.DEBUG
    import backend.util
    import backend.server
    
    # import eventlet
    # eventlet.monkey_patch(os=True,
    #                  select=True,
    #                  socket=True,
    #                  thread=False,
    #                  time=True)
    backend.server.server.run(host=setting.HOST,port=setting.PORT,
    debug=True,
    threaded=True,
    #processes=1
    #ssl_context='adhoc'
    )


import cefpython3
if __name__ == '__main__':

    run_server()

    