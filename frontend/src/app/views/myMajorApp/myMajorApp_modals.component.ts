
import { Router, NavigationStart } from '@angular/router';
import { Component, Input, ViewChild, ViewChildren, QueryList, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ModalBtnComponent } from 'app/components/modalBtn/modalBtn.component';
import { DataProvideService } from '@_utils/service/data.provide.service';
import { InitDataService } from '@_utils/service/init.data.service';
import { MyMajorApp_modals_triggerService, ModalOnTriggerCommmet } from './myMajorApp_modals_trigger.service';
import { ViewAbstractComponent } from '@_views/view.abstract.component';
import { LanguageService } from '@_utils/service/language.service';

@Component({
    selector: 'myMajorApp-modals-component',
    templateUrl: 'myMajorApp_modals.component.html',
    //   styles: [Head_menuComponentCss],
    styleUrls: ['myMajorApp_modals.component.css','../ex_modal.theme.css']

})
export class MyMajorApp_modalsComponent extends ViewAbstractComponent{
    @ViewChild('popoutBlock') public popoutModal: ModalBtnComponent;



    public dataProvide$
    public popState$
    public router$
    public modalCommmet$

    //public allSubmit
    constructor(
        public router: Router,
        public dataProvide: DataProvideService,
        public init: InitDataService,
        public modalsService: MyMajorApp_modals_triggerService,
        public  la: LanguageService,
        ) {
            super()
        }
    ngOnInit(){
        super.ngOnInit()
        this.modalCommmet$=this.modalsService.modalCommmet$.subscribe(([Commmet,msg])=>{
            this.setPopoutMsg(msg)
            this.doModal(Commmet)
        } )
    }


      public handleError(err) {
        //console.log(4)
        //console.log(err)
        this.setPopoutMsg(err)
    }
    popoutMsg
    public setPopoutMsg(msg:string){
        this.popoutMsg=msg
    }
    public resetMsg(){
        this.popoutMsg=undefined
     }
    public onHidden(event){
        this.popoutModal.hideChildModal();
    }

    public allHide() {
        this.popoutModal.hideChildModal();

    }

    public ngOnDestroy() {
        super.ngOnDestroy()
        try {
            this.modalCommmet$.unsubscribe()
        } catch (e) {
            console.error(e);
        }
        this.allHide()


    }


    public doModal(mode:ModalOnTriggerCommmet) {
        switch (mode) {
            case ModalOnTriggerCommmet.allHide:
                this.allHide();
                break
            case ModalOnTriggerCommmet.popoutShow:
                this.popoutModal.showChildModal();
                break
            case ModalOnTriggerCommmet.popoutHide:
                this.popoutModal.hideChildModal();
                    break

            default:
                break
        }
    }

}
