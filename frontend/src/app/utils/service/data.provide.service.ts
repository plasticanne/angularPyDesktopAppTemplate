import { Observable } from 'rxjs';
//import { LoadingScreenService } from '@_children_models/loading/loading.screen.service';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from './http.service';
import { URLSearchParams } from '@angular/http/http';
import { AsyncSubject } from 'rxjs';
import { Subject } from 'rxjs';
import { Injectable, Inject } from '@angular/core';
import { CacheService, CacheStoragesEnum } from '../../packages/ng2-cache/ng2-cache';
import { CookieService, CookieOptions } from 'ngx-cookie';
// 获取Http服务
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/filter';
//import  'rxjs/Observable/fromPromise';
//import  {Buffer} from 'node';
import  {Buffer} from 'Buffer';
import { error } from 'util';
import { IsTurnOnCache } from './staticFunction';
import * as cryptoJS from 'crypto-js';
import { HttpErrorResponse } from '@angular/common/http';
import {ErrorResponse } from '@_utils/service/interface';
interface Setting {
    url?,
    life?,
    tag?,
    key?,
    err?: {},
    domin?,
    sameSite?,
    header?: {
        token?: string,
        ReCaptcha?: string,
        [propName: string]: any;
    },
    encode?: {key?:string, encrypt:string},
}
//const _IV = '0102030405060708'
//cryptoJS.enc.Utf8.parse(_IV)
function encrypt_cbc(msgString, key) {
    key=cryptoJS.enc.Utf8.parse(key)
    // msgString is expected to be Utf8 encoded
    var iv:cryptoJS.WordArray = cryptoJS.lib.WordArray.random(16);
    var encrypted = cryptoJS.AES.encrypt(msgString, key, {
        iv: iv,
        mode:cryptoJS.mode.CBC,
        padding: cryptoJS.pad.ZeroPadding

    });
    return iv.concat(encrypted.ciphertext).toString(cryptoJS.enc.Base64);
}

function decrypt_cbc(ciphertextStr, key) {
    key=cryptoJS.enc.Utf8.parse(key)
    var ciphertext = cryptoJS.enc.Base64.parse(ciphertextStr);

    // split IV and ciphertext
    var iv = ciphertext.clone();
    iv.sigBytes = 16;
    iv.clamp();
    ciphertext.words.splice(0, 4); // delete 4 words = 16 bytes
    ciphertext.sigBytes -= 16;
    let setting={
        iv:iv,
        mode:cryptoJS.mode.CBC,
        padding: cryptoJS.pad.ZeroPadding
    }
    // decryption
    let decrypted = cryptoJS.AES.decrypt({ciphertext: ciphertext}, key, setting).toString(cryptoJS.enc.Utf8)//.replace(/\0/g, '')
    return JSON.parse( decrypted)
}
function encrypt_ecb(msgString, key) {
    key=cryptoJS.enc.Utf8.parse(key)
    // msgString is expected to be Utf8 encoded
    var encrypted = cryptoJS.AES.encrypt(msgString, key, {
        mode:cryptoJS.mode.ECB,
        padding: cryptoJS.pad.ZeroPadding
    });
    return encrypted.ciphertext.toString(cryptoJS.enc.Base64);
}
export function decrypt_base64(ciphertextStr) {

    var ciphertext = cryptoJS.enc.Base64.parse(ciphertextStr);

    return JSON.parse( ciphertext)
}

function decrypt_ecb(ciphertextStr, key) {
    key=cryptoJS.enc.Utf8.parse(key)
    var ciphertext = cryptoJS.enc.Base64.parse(ciphertextStr);
    let setting={
        mode:cryptoJS.mode.ECB,
        padding: cryptoJS.pad.ZeroPadding
    }

    // decryption
    let decrypted = cryptoJS.AES.decrypt({ciphertext: ciphertext}, key,setting).toString(cryptoJS.enc.Utf8)//.replace(/\0/g, '')
    //console.log(JSON.parse( decrypted))
    return JSON.parse( decrypted)
}
/*
function encrypt(text,key){

    key=cryptoJS.enc.Utf8.parse(key)
    text = cryptoJS.enc.Utf8.parse(text)
    let setting={ iv:cryptoJS.enc.Utf8.parse(_IV), mode:cryptoJS.mode.CBC, padding:cryptoJS.pad.Pkcs7 }
    return cryptoJS.AES.encrypt(text, key, setting)
}
function decrypt(text,key){

    key=cryptoJS.enc.Utf8.parse(key)
    //text = cryptoJS.enc.Utf8.parse(text)
    text = cryptoJS.enc.Utf8.stringify(cryptoJS.enc.Base64.parse(text));
    console.log(text)
    let setting={ iv:cryptoJS.enc.Utf8.parse(_IV), mode:cryptoJS.mode.CBC, padding:cryptoJS.pad.Pkcs7 }
    let result = cryptoJS.AES.decrypt(text, key ,setting).toString(cryptoJS.enc.Utf8)
    console.log(result)
    return result
}*/




@Injectable()
export class DataProvideService {
    private _sessionSubjectStore: Subject<any>[] = []

    public errCodeSub
    API_HOST = ""
    HOST=""


    constructor(
        //public http: Http
        private http: HttpService,
       // public loadingImg: LoadingScreenService,
        private cookie: CookieService,
        public sessionCache: CacheService,
        public localCache: CacheService,

    ) {
        //  console.log(this.localCache.get('cartBeforeCheck'))
        //    console.log(this.sessionCache.get('cartBeforeCheck'))
        this.initStorages()
        this.errCodeSub = new Subject()
        http.errCodeSub.subscribe(this.errCodeSub)
        //  console.log(this.localCache.get('cartBeforeCheck'))

    }

    public get_sessionSubjectStore() {
        return this._sessionSubjectStore
    }



    public getData(
        setting: Setting,
        options: {
            name: any,
            self: any,
            bindingData: any,
            dataProvide: any,
            delayTime?: number
        },
        ...passingData: any[]): Observable<any>
    {
        let that = this
        /*if (options['promise'] == null || options['promise'] === undefined){
            options['promise']=true
        }*/
        if (options['delayTime'] == null || options['delayTime'] === undefined) {
            options['delayTime'] = 0
        }
        return Observable.create(
            (obs) => {
                if (setting.url === '' || setting.url == null || setting.url === undefined) {
                    options.bindingData(options.self, options.name, '', ...passingData)
                    obs.next()
                    obs.complete()
                } else {
                    options.dataProvide(setting, that).delay(options.delayTime).subscribe({
                        next: (response) => {
                            options.bindingData(options.self, options.name, response, ...passingData)
                            obs.next(response)
                            obs.complete()
                        },
                        error: (err) => { obs.error(err) },
                        // tslint:disable-next-line:no-empty
                        complete: (response) => { obs.complete() }
                    })
                }
            })

    }



    private initStorages() {
       //this.sessionCache.useStorage(CacheStoragesEnum.SESSION_STORAGE);
       this.localCache=this.localCache.useStorage(CacheStoragesEnum.LOCAL_STORAGE);


    }
    getSessionData(setting: Setting, _self = this) {
        setting.life === undefined && (setting.life = 300)
        setting.tag === undefined && (setting.tag = 'normal')
        return _self._getData(setting, _self.sessionCache, _self._sessionSubjectStore)
    }



    private _setDate(s): Date {
        let now = new Date();
        now.setSeconds(now.getSeconds() + s);
        return now
    }

    private _getData(setting: Setting, cache: CacheService, subjectStore: Subject<any>[]):Observable<any> {
        let exists: boolean = cache.exists(setting.url);
        if(!IsTurnOnCache){
            exists = false //Debug
        }
        if (exists && subjectStore[setting.url] !== undefined) {
                    let response = this._getKeyCache(setting.url, cache)
                    subjectStore[setting.url].next(response)
                    return Observable.create(
                        (obs)=>{
                            obs.next(response)
                            obs.complete()
                        }
                    )
            } else {
                subjectStore[setting.url] = new BehaviorSubject(undefined)
                    return this.getHttp(setting).map(
                        (res) => {
                            subjectStore[setting.url].next(res)
                            this._setCache(setting.url, res, setting.life, setting.tag, cache)
                            return res
                        }
                    )

        }

    }




    public getHttp(setting: Setting): Observable<any> {
        if (setting.encode) {
            if (setting.encode.encrypt == 'aes') {
                let getUrl = this.http.getText(setting.url, this.http.makeHeader(setting.header))
                getUrl =getUrl.map((res: Response) => {
                    return decrypt_ecb(res,setting.encode.key)
                }).catch(err => {throw this.aesHandleError(err,setting)})
                return getUrl
            }
        }else {
            let getUrl = this.http.getJSON(setting.url, this.http.makeHeader(setting.header)).catch(err => {throw this.handleError(err)})
            return getUrl
        }
    }

    public postHttp(setting: Setting, data): Observable<any> {
        let enData
        let postUrl
        if (setting.encode) {
            if (setting.encode.encrypt == 'base64') {
                enData = new Buffer(JSON.stringify(data)).toString('base64')
            }else if (setting.encode.encrypt == 'aes') {
                enData = encrypt_ecb(JSON.stringify(data),setting.encode.key)
            } else {
                enData = JSON.stringify(data)
            }
        } else {
            enData = JSON.stringify(data)

        }

        if (setting.encode) {
            if (setting.encode.encrypt == 'aes') {
                postUrl=this.http.postText(setting.url, enData, this.http.makeHeader(setting.header)).map((res: Response) => {
                    return decrypt_ecb(res,setting.encode.key)
                }).catch(err => {throw this.aesHandleError(err,setting)})
            }else{
                postUrl=this.http.postHttp(setting.url, enData, this.http.makeHeader(setting.header)).catch(err => {throw this.handleError(err)})
            }
        }else{
            postUrl=this.http.postHttp(setting.url, data, this.http.makeHeader(setting.header)).catch(err => {throw this.handleError(err)})
        }
        return postUrl
    }
    private aesHandleError(err: Response,setting: Setting):ErrorResponse {

        let result= new ErrorResponse()
        result.headers=err.headers
        result.status=err.status
        if (err.status<500 &&  err.status>=200 ){
            result.body=decrypt_ecb(err.text(), setting.encode.key)
        }else{
            result.body=err.text()
        }
        throw  result
    }

    private handleError(err: Response):ErrorResponse {
        let result= new ErrorResponse()
        result.headers=err.headers
        result.status=err.status
        result.body=err.text()
        throw result
    }
    private _getKeyCache(key, cache: CacheService) {
        return cache.get(key)
    }

    private _setCache(key, data, life, tag, cache: CacheService) {
        return cache.set(key, data, { maxAge: life, tag: tag });
    }
    public getLocalCache(key: string) {
        return this._getKeyCache(key, this.localCache)
    }
    public setLocalCache(key: string,data, setting: Setting) {
        return this._setCache(key, data, setting.life, setting.tag,this.localCache)
    }
    private removeKeyLocalCache(key, ) {
        return this._removeKeyCache(key, this.localCache)
    }
    private removeTagLocalCache(tag, ) {
        return this._removeTagCache(tag, this.localCache)
    }
    private removeAllLocalCache( ) {
        return this._removeAllCache( this.localCache)
    }

    private _getCookie(key: string) {
        return this.cookie.get(key)
    }
    private _getCookieObject(key: string) {
        return this.cookie.getObject(key)
    }

    public getCookieObject(key: string) {

        return this._getCookieObject(key)
    }
    public getCookie(key: string) {

        return this._getCookie(key)
    }
    private _setCookie(key: string, value: string, options?: CookieOptions) {
        return this.cookie.put(key, value, options)
    }

    private _setCookieObject(key: string, value: Object, options?: CookieOptions) {
        return this.cookie.putObject(key, value, options)
    }
    public setCookieObject(key: string, value: Object, setting?: Setting) {
        if (setting){
            let options:CookieOptions={}
            options["expires"]=(setting.life!=undefined && setting.life!=null) ? new Date(Date.now()+setting.life*1000 ) : null
            options["domin"]=(setting.domin!=undefined && setting.domin!=null) ? setting.domin : undefined

            return this.cookie.putObject(key, value, options)
        }else{
            return this.cookie.putObject(key, value)
        }

    }
    public setCookie(key: string, value: string, setting?: Setting) {
        if (setting){
            let options:CookieOptions={}
            options["expires"]=(setting.life!=undefined && setting.life!=null) ? new Date(Date.now()+setting.life*1000 ) : null
            options["domin"]=(setting.domin!=undefined && setting.domin!=null) ? setting.domin : undefined
            return this.cookie.put(key, value, options)
        }else{
            return this.cookie.put(key, value)
        }

    }


    //get all data related to tag "tag" :
    // {'key' => 'key data', ...}
    private _getTagCache(tag, cache: CacheService) {
        return cache.getTagData(tag);
    }

    //remove all data from cache with url
    private _removeKeyCache(key, cache: CacheService) {
        return cache.set(key, undefined, { maxAge: 0 });
    }

    //remove all data from cache with tag "tag"
    private _removeTagCache(tag, cache: CacheService) {
        return cache.removeTag(tag);
    }

    //remove all from cache
    private _removeAllCache(cache: CacheService) {
        return cache.removeAll();
    }

}
