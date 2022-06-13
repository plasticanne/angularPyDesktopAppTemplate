import { Injectable, } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'

export enum ModalOnTriggerCommmet {
    allHide="allHide",
    popoutShow="popoutShow",
    popoutHide="popoutHide",

}



@Injectable()
export class MyMajorApp_modals_triggerService {
    modalState
    isShowEmptyModal=false
    modalCommmet$
    constructor() {
        this.modalCommmet$ = new BehaviorSubject([null,null])

    }

    CommmetModal(Commmet:ModalOnTriggerCommmet,msg:string){
        this.modalCommmet$.next([Commmet,msg])

    }
    onShowEmptyModal(){
        this.isShowEmptyModal=true
    }
    onHiddenEmptyModal(){
        this.isShowEmptyModal=false
    }

    public generalErrorHandler(e){
        console.log(e)
        let msg
        if (e.status < 500){
            let body
            if ( typeof e.body !== 'string' && e.body !== undefined && e.body !== null){
                if (e.body.error_msg == undefined){
                    body=e.body.body
                }else{
                    body=e.body.error_msg
                }
            }else{
                body=e.body
            }
            msg=`status: ${e.status}; body: ${body}`
        }else if (e.status==undefined){
            msg=`status: 200; body: ${e}`
        }else{
            msg=`status: ${e.status} error`
        }
        this.CommmetModal( ModalOnTriggerCommmet.popoutShow, msg)
    }

}
