import { Injectable, Inject } from '@angular/core';
import { DataProvideService } from './data.provide.service';
import { HttpService } from './http.service';
@Injectable()
export class DbStoreService {
    constructor(
        private http: HttpService,
        private dataProvide: DataProvideService,
    ){

    }
    isTurnOnCache=true
    getData(sn:string,m_start:number,m_end:number) {


    }
}
