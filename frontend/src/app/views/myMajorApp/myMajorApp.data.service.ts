import { forEach } from '@angular/router/src/utils/collection';
import { Injectable } from '@angular/core';
import { DataProvideService } from '@_utils/service/data.provide.service';
import { InitDataService } from '@_utils/service/init.data.service'
import { BehaviorSubject } from 'rxjs';
import cloneDeep from 'lodash.clonedeep';


@Injectable()
export class MyMajorAppDataService {

    constructor(
        public init: InitDataService,
        public dataProvide: DataProvideService,

    ) {

    }
    layout:any
    initialize(){
        return this.dataProvide.postHttp({
            url: this.init.API_HOST+'myMajorApp/initialize',
            tag: 'init',
            life:0.5,
            encode: this.init.DEFAULT_ENCODE,
            header:{token:this.init.token}
        },
        null
        ).toPromise().then((result) => {

            return result
        })
    }
    datas:{x:number[],y:number[]}=undefined
    dash_url:string=undefined

    bindingData(self: MyMajorAppDataService, name, data) {

        switch (name) {

            case 'layout':
                self.layout=data.body

                break
            case 'datas':
                self.datas=data.body
                console.log(data.body)
                break
            case 'dash_datas':
                console.log(data.body)
                self.dash_url=data.body.dash

                break

            case 'exec_new_intance':
                break


            default:
                throw new Error(`Unable to bypass security for invalid type: ${name}`);
        }
    }
    injectData(name) {
        switch (name) {

            case 'layout':
                return this.dataProvide.getData({
                    url: this.init.API_HOST+'myMajorApp/layout',
                    life:1,
                    encode: this.init.DEFAULT_ENCODE,header:{token:this.init.token}
                },
                {
                    name: name,
                    self: this,
                    bindingData: this.bindingData,
                    dataProvide: this.dataProvide.getSessionData,
                })
            case 'datas':
                return this.dataProvide.getData({
                    url: this.init.API_HOST+'myMajorApp/datas',
                    life:1,
                    encode: this.init.DEFAULT_ENCODE,header:{token:this.init.token}
                },
                {
                    name: name,
                    self: this,
                    bindingData: this.bindingData,
                    dataProvide: this.dataProvide.getSessionData,
                })

            case 'dash_datas':
                return this.dataProvide.getData({
                    url: this.init.API_HOST+'myMajorApp/dash_datas',
                    life:1,
                    encode: this.init.DEFAULT_ENCODE,header:{token:this.init.token}
                },
                {
                    name: name,
                    self: this,
                    bindingData: this.bindingData,
                    dataProvide: this.dataProvide.getSessionData,
                })


            case 'exec_new_intance':
                return this.dataProvide.getData({
                    url: this.init.API_HOST+ 'exec_new_intance',
                    tag: 'exec_new_intance',
                    life:10,  //use cache to avoid multi click
                    encode: this.init.DEFAULT_ENCODE,
                    header:{token:this.init.token}
                }, {
                    name: name,
                    self: this,
                    bindingData: this.bindingData,
                    dataProvide: this.dataProvide.getSessionData,
                }, )

            default:
                throw new Error(`Unable to bypass security for invalid type: ${name}`);
        }

    }
}
