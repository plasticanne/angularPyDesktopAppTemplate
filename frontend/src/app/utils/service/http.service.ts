import { DataProvideService } from './data.provide.service';
;
import { BehaviorSubject } from 'rxjs';


// 获取Injectable服务
import { Injectable } from '@angular/core';
// 获取Http服务
import { Http, Response, Headers, RequestOptions } from '@angular/http';
// 获取Observable服务
import { Observable } from 'rxjs';
// 获取rxjs相关操作服务（map等）,后面我们会提到
// import 'rxjs/Rx';
// adds ALL RxJS statics & operators to Observable
// See node_module/rxjs/Rxjs.js
// Import just the rxjs statics and operators we need for THIS app.
// Statics
import 'rxjs/add/observable/throw';

// Operators
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/catch';
//import 'rxjs/add/operator/debounceTime';
//import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import { ajax } from 'rxjs/ajax';
//import 'rxjs/add/operator/switchMap';
//import 'rxjs/add/operator/toPromise';
//import * as $ from 'jquery';

@Injectable()
export class HttpService {
    // 注入Http服务
    errCodeSub
    postHeaderOptions
    getHeaderOptions
    delHeaderOptions
    putHeaderOptions
    patchHeaderOptions
    constructor(public http: Http) {
        this.errCodeSub = new BehaviorSubject(NaN);
    }

    // 设置获取数据的地址，这里我们使用本地的json文件模拟
    //private dataUrl ='http://localhost:4200/app/models/cart/temp/data.json';
    // 定义方法，用于获取Observable服务
    /*createAuthorizationHeader(headers: Headers) {
        headers.append('Authorization', 'Basic ' +
            btoa('username:password'));
    }*/

    getJSON(dataUrl, requestOptions?: RequestOptions): Observable<any> {

        if (requestOptions == undefined) {
            requestOptions = this.getHeaderOptions
        }


        // 使用angular的http服务获取数据，默认返回observable
        //console.log(this.http.get("http://localhost:4200/app/models/cart/temp/data.json").map(res => res.json()));
        return this.http.get(dataUrl, requestOptions)
            // 响应数据是JSON字符串格式的。 我们必须把这个字符串解析成JavaScript对象
            .map((res: Response) => {
                let result
                try {
                    result = res.json()
                } catch (e) {
                    result = {}
                }
                return result
            })
            // 异常的捕获并进行处理
            .catch((err) => { throw this.handleError(err) });

    }
    /*getHtml(dataUrl, requestOptions?: RequestOptions): Observable<any> {
      // let myHeader= {}
        //let requestOptions=this.makeHeader(new Headers(myHeader))


        // 使用angular的http服务获取数据，默认返回observable
        //console.log(this.http.get("http://localhost:4200/app/models/cart/temp/data.json").map(res => res.json()));
        return this.http.get(dataUrl,new RequestOptions( {withCredentials:true}))
            // 响应数据是JSON字符串格式的。 我们必须把这个字符串解析成JavaScript对象
            .map((res: Response) => {

                return res
            })
            // 异常的捕获并进行处理
            .catch((err) => { throw this.handleError(err) });

    }*/
    getText(dataUrl, requestOptions?: RequestOptions): Observable<any> {
        if (requestOptions == undefined) {
            requestOptions = this.getHeaderOptions
        }

        return this.http.get(dataUrl, requestOptions)

            .map((res: Response) => {
                let result
                try {
                    result = res.text()
                } catch (e) {
                    result = {}
                }
                return result
            })
            // 异常的捕获并进行处理
            .catch((err) => { throw this.handleError(err) });
    }
    getHtml(dataUrl, requestOptions?: RequestOptions): Observable<any> {
        return ajax({
            url : dataUrl,
            crossDomain: true,
            responseType: "html",
            createXHR: function () {
              return new XMLHttpRequest();
           }
          })
          .map((res) => {

            return res.response
        })
        /* $.get(url, (html) =>{
        this.bindingData(this, '', html)
        });*/
    }
    public makeHeader(myHeader?: Object): RequestOptions {

        if (myHeader == undefined) {
            return undefined
        } else {
            let headers
            headers = new Headers(myHeader);
            return new RequestOptions({ headers: headers });
        }

    }
    initHeader(name, myHeader: Object) {
        switch (name) {
            case 'post':
                this.postHeaderOptions = this.makeHeader(myHeader)
                break
            case 'get':
                this.getHeaderOptions = this.makeHeader(myHeader)
                break
            case 'put':
                this.putHeaderOptions = this.makeHeader(myHeader)
                break
            case 'delete':
                this.delHeaderOptions = this.makeHeader(myHeader)
                break
            case 'patch':
                this.patchHeaderOptions = this.makeHeader(myHeader)
                break
            default:
                break
        }
    }
    postText(dataUrl, data, requestOptions?: RequestOptions): Observable<any> {

        //console.log(requestOptions)
        if (requestOptions == undefined) {
            requestOptions = this.postHeaderOptions
        }
        return this.http.post(dataUrl, data, requestOptions)
            .map((res: Response) => {
                let result
                try {
                    result = res.text()
                } catch (e) {
                    result = {}
                }
                return result
            }).catch((err) => { throw this.handleError(err) })
    }

    postHttp(dataUrl, data, requestOptions?: RequestOptions): Observable<any> {

        //console.log(requestOptions)
        if (requestOptions == undefined) {

            console.log(this.postHeaderOptions.headers)
            requestOptions = this.postHeaderOptions
        }
        //console.log(requestOptions.headers)
        return this.http.post(dataUrl, data, requestOptions)
            .map((res: Response) => {
                let result
                try {
                    result = res.json()
                } catch (e) {
                    result = {}
                }
                return result
            }).catch((err) => { throw this.handleError(err) })
    }
    /*post2Http(dataUrl, data, myHeader?: Object): Observable<any> {

        let headers = new Headers();
        headers.append("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
        if (myHeader != undefined) {
            for (let i = 0; i < Object.keys(myHeader).length; i++)
                headers.append(Object.keys(myHeader)[i], myHeader[Object.keys(myHeader)[i]])
        }

        let OPTIONS = new RequestOptions({ headers: headers });
        //let headers = new Headers();
        //this.createAuthorizationHeader(headers);
        return this.http.post(dataUrl, data, OPTIONS)
            .catch((err) => { throw this.handleError(err) })
    }*/
    putHttp(dataUrl, data): Observable<any> {
        //let headers = new Headers();
        //this.createAuthorizationHeader(headers);
        return this.http.put(dataUrl, data, /*{ headers: headers }*/)
            .map((res: Response) => {
                let result
                try {
                    result = res.json()
                } catch (e) {
                    result = {}
                }
                return result
            }).catch((err) => { throw this.handleError(err) })
    }

    patchHttp(dataUrl, data): Observable<any> {
        //let headers = new Headers();
        //this.createAuthorizationHeader(headers);
        return this.http.patch(dataUrl, data,/* { headers: headers }*/)
            .map((res: Response) => {
                let result
                try {
                    result = res.json()
                } catch (e) {
                    result = {}
                }
                return result
            }).catch((err) => { throw this.handleError(err) })
    }
    deleteHttp(dataUrl): Observable<any> {
        //let headers = new Headers();
        //this.createAuthorizationHeader(headers);
        return this.http.delete(dataUrl, /*{ headers: headers }*/)
            .map((res: Response) => {
                let result
                try {
                    result = res.json()
                } catch (e) {
                    result = {}
                }
                return result
            }).catch((err) => { throw this.handleError(err) })
    }

    // 定义私有方法来处理异常
    private handleError(error,data?) {
        // 我们的服务处理器(handleError)把响应对象记录到控制台中
        // 把错误转换成对用户友好的消息，并且通过Observable.throw来
        // 把这个消息放进一个新的、用于表示“失败”的可观察对象
        //let errMsg = (error.message) ? error.message :
        //   error.status ? ` ${error.status} - ${error.statusText} - ${error._body}`: 'Server error';
        this.errCodeSub.next(error.status)
        console.error(error); // 输出异常信息
        throw error
        //return Observable.throw(errMsg);
    }
}

