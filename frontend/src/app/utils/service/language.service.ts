import { Injectable, } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'




@Injectable()
export class LanguageService {
    language="en"
    language$
    options = [
        //{label:"--Language--", value:null},
        {label:'English', value:'en'},
        {label:'中文', value:'zh_hant'},
        //{label:'简体中文', value:'zh_hans'},
        //{label:'日本語', value:'jp'},

    ];
    constructor() {
        this.language$ = new BehaviorSubject(null)

    }

    detectLang(){
        let inla=navigator.language.toLowerCase()

        let la
        if(inla=="zh_cn"||inla=="zh_sg"){
            la="zh_hant"
        }else if(inla=="zh_tw"||inla=="zh_hk"){
            la="zh_hant"
        }else if(inla=="ja"){
            la="en"
        }else{
            la="en"
        }
        return la
    }
    setLanguage(la:"en"|"jp"|"zh_hant"|"zh_hans"){
        this.language$.next(la)
        this.language = la
    }

}
