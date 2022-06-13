import {
    LoadingScreenService
} from './loading.screen.service';
import {
    HttpService
} from './http.service';
import {
    DataProvideService
} from './data.provide.service';

import {
    Jsonp,
    Response
} from '@angular/http';

import {
    Subject
} from 'rxjs';
import {
    Injectable,
    OnChanges
} from '@angular/core';
import {
    Observable
} from 'rxjs';
import {
    Meta,
    Title
} from "@angular/platform-browser";
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { timer, BehaviorSubject, of,forkJoin,pipe } from 'rxjs';
import { switchMap, takeUntil, catchError,map,takeWhile ,delay} from 'rxjs/operators';

declare var google;
declare const base_init_root;
declare const base_api_root;

export function getRoot(){
    let root='/'
    if (base_init_root != '{{root}}') {
        root = base_init_root
    }
    return root
};

export function getApiRoot(){
    let API_HOST = 'http://127.0.0.1:23948/api/'
    if (base_api_root != '{{api_root}}') {
        API_HOST = base_api_root
    }
    return API_HOST
}




@Injectable()
export class InitDataService {
    _init
    _seo
    layout
    tagList
    seoSetting
    version
    recaptchaSitekey
    artParentUrl
    loadingIcon
    token
    fast_caches = 0.5

    //HOST="/"
    project='My_App/'
    root = ""

    API_HOST
    OTHER_INSTANCE_SCHEME='https'

    animated_fadeIn_enable=true

    turnAnimatedFadeIn(x){
        if (x){
            this.animated_fadeIn_enable=true
        }else{
            this.animated_fadeIn_enable=false
        }
    }

    //public DEFAULT_ENCODE = {  encrypt:'aes',key: '1231315'}
    public DEFAULT_ENCODE= undefined

    constructor(
        public loadingImg: LoadingScreenService,
        public dataProvide: DataProvideService,
        public headMeta: Meta,
        public headTitle: Title,
        public http: HttpService
    ) {
        this.root=getRoot()
        this.API_HOST = getApiRoot()
        //console.log(base_init_root,base_api_root)
        //console.log(this.root)
        //console.log(this.API_HOST)

        //console.log('v0.1')
    }

    public setDynamicSeo(title, description, imageUrl ? ) {

        let meta = [{
                "name": "url",
                "itemprop": "url",
                "property": "og:url",
                "content": window.location.href
            },
            {
                "name": "robots",
                "content": "index,follow"
            },
            {
                "name": "keywords",
                "content": title
            },
            {
                "name": "title",
                "itemprop": "name",
                "property": "og:title",
                "content": title
            },
            {
                "name": "description",
                "itemprop": "description",
                "property": "og:description",
                "content": description
            },
        ]
        if (imageUrl) {
            meta.push({
                "name": "image",
                "itemprop": "image",
                "property": "og:image",
                "content": imageUrl
            })
        } else {
            meta.push({
                "name": "image",
                "itemprop": "image",
                "property": "og:image",
                "content": ""
            })
        }

        this.setSeo('', title, meta)
    }
    setSeo(rawName, title ? , metaSetting ? ) {
        try {
            this.removeSeo()
        } catch (e) {}
        let name
        if (this.seoSetting[rawName] !== undefined) {
            name = rawName
        } else {
            name = "dashboard"
        }

        if (title == undefined) {
            title = this.seoSetting[name].title
        }
        if (metaSetting == undefined) {
            metaSetting = this.seoSetting[name].meta
        }
        this.headTitle.setTitle(title);
        metaSetting[0].content = window.location.href
        this.headMeta.addTags(metaSetting);
    }
    removeSeo() {
        this.headMeta.removeTag("name='url'");
        this.headMeta.removeTag("name='robots'");
        this.headMeta.removeTag("name='keywords'");
        this.headMeta.removeTag("name='title'");
        this.headMeta.removeTag("name='description'");
        this.headMeta.removeTag("name='image'");
    }
    initAppService() {
        //console.log(this.API_HOST)
        this.setHeader()
        return forkJoin([
            this.injectInitData('init'),
            this.injectInitData('seo'),
            this.injectInitData('version'),
            this.posttoken()

        ]).map(res => {
            console.log('m1')
            this.bindingData()

        }).toPromise()
        .then(
            res => {
                forkJoin([
                    this.injectInitData('layout'),
                    //this.posttest()
                    //this.injectInitData('valid'),
                ]).map(res => {
                    this.loadingImg.headOnLoading = false
                }).toPromise()
            }
        )
    }
    setHeader() {
        this.http.initHeader('post', {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            //  "Origin": "",
        })
        if (this.DEFAULT_ENCODE==undefined){
            this.http.initHeader('get', {
                "Content-Type": "text/plain; charset=UTF-8",
                //  "Origin": "",
            })
        }else{
            this.http.initHeader('get', {
                "Content-Type": "application/json; charset=UTF-8",
                //  "Origin": "",
            })
        }
        /*this.http.initHeader('options', {
           "Access-Control-Max-Age":600,
            "Content-Type": "application/json; charset=utf-8",
        })*/

    }

    bindingData() {
        this.seoSetting = this.get_seo()

        let init = this.get_init()
        this.recaptchaSitekey = init.RECAPTCHA_SITEKEY
        this.artParentUrl = init.ART_PARENT_URL
        this.loadingIcon = this.artParentUrl + 'loading.svg'


    }


    get_init() {
        return this._init
    }
    get_seo() {
        return this._seo
    }

    posttoken(){
        console.log('p1')
        return this.dataProvide.postHttp({
            url: this.API_HOST+'token',
            tag: 'init',
            life:0.5,
            encode: this.DEFAULT_ENCODE
        },null)
        .pipe(
            switchMap((result) => {
                console.log('p2')
                console.log(result.body.token)
                this.token=result.body.token
                console.log(this.token)
                return of(null)
            })
        )
    }

    bindingInitData(self, name, data) {
        switch (name) {
            case 'init':
                self._init = data
                break
            case 'layout':
                self.layout = data.body

                break
            case 'seo':
                self._seo = data
                break
            case 'version':
                self.version = data.body.ver
                //console.log('ver: '+self.version)
                break


            default:
                throw new Error(`Unable to bypass security for invalid type: ${name}`);
        }
    }

    injectInitData(name) {
        switch (name) {
            case 'init':
                return this.dataProvide.getData({
                    url: 'data/init_setting.json',
                    tag: 'init'
                }, {
                    name: name,
                    self: this,
                    bindingData: this.bindingInitData,
                    dataProvide: this.dataProvide.getSessionData,
                }, )
            case 'layout':
                console.log(this.token)
                return this.dataProvide.getData({
                    url: this.API_HOST+'layout',
                    tag: 'layout',
                    life:0.5,
                    encode: this.DEFAULT_ENCODE,
                    header:{token:this.token}

                }, {
                    name: name,
                    self: this,
                    bindingData: this.bindingInitData,
                    dataProvide: this.dataProvide.getSessionData,
                }, )
            case 'seo':
                return this.dataProvide.getData({
                    url: 'data/seo_setting.json',
                    tag: 'seo'
                }, {
                    name: name,
                    self: this,
                    bindingData: this.bindingInitData,
                    dataProvide: this.dataProvide.getSessionData,
                }, )
            case 'version':
                return this.dataProvide.getData({
                    url: this.API_HOST+'version',
                    tag: 'init',
                    life:0.5,
                    encode: this.DEFAULT_ENCODE,

                }, {
                    name: name,
                    self: this,
                    bindingData: this.bindingInitData,
                    dataProvide: this.dataProvide.getSessionData,
                }, )

            default:
                throw new Error(`Unable to bypass security for invalid type: ${name}`);
        }
    }

}
