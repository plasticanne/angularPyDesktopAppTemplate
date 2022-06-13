import setting_base,setting
import os,json,random,string,re
import backend.common.register as register
import backend.util as util
from flask import request
import dash_table
import dash_html_components as html
import dash_core_components as dcc
import numpy as np
import pandas as pd
import plotly.graph_objects as go
import plotly.express as px
SERVER=None
TOKEN=None
def set_server(server):
    global SERVER
    SERVER=server



def get_read_path():
    try:
        result= util.select_type_file_dialog('csv')
    except Exception as e:
        util.error_logger(e)
        #loop.close()
        return None,e,422
    else:
        #loop.close()
        return result,None,200    



def get_layout():
    def new_one():
        path= setting.MYMOJARAPP_LAYOUT_PATH
        try:
            d=util.jsonload(path)
        except util.NoFileError:
            return None,"Missing layout file.",403
        else:
            return  d,None,200
    return  new_one()
        
    

def get_datas():
    # Get x values of the sine wave
    x        = np.arange(0, 10, 0.1)
    # Amplitude of the sine wave is sine of a variable like time
    y   = np.sin(x)
    
    return x,y



class MemState:
    DASH_APP=None
    DASH_PAGES={}
    def set_dash_page(self,index,div):
        if self.DASH_APP is None: return
        pathname=setting.DASH_PATH+index
        self.DASH_PAGES[pathname]=div
    def gen_dash_page(self):
        index=0
        x,y=get_datas()
        df = pd.DataFrame(dict(
            x = x,
            y = y
            ))
        
        g=dcc.Graph(
            figure=px.line(df, x="x", y="y", ),
            style={
                    'height': 500
                },
    )
        div=html.Div(
            children=[html.P('i am dash page'),g]
            )

        #instance.DASH_APP.layout =div
        self.set_dash_page(str(index),div)
        return {"dash":setting.DASH_API+str(index)}


