
import { Router, NavigationStart } from '@angular/router';
import { Component, Input, ViewChild, ViewChildren, QueryList, EventEmitter, Output } from '@angular/core';
//import { Head_menuComponentCss } from './head_menu.component.css';
import { Observable } from 'rxjs/Observable';
import { ModalBtnComponent } from 'app/components/modalBtn/modalBtn.component';
import { DataProvideService } from '@_utils/service/data.provide.service';
import { InitDataService } from '@_utils/service/init.data.service';
import { Entree_modals_triggerService, ModalOnTriggerCommmet } from './entree_modals_trigger.service';
import { LanguageService } from '@_utils/service/language.service';
import { ViewAbstractComponent } from '@_views/view.abstract.component';

@Component({
    selector: 'entree-modals-component',
    templateUrl: 'entree_modals.component.html',
    //   styles: [Head_menuComponentCss],
    styleUrls: ['entree_modals.component.scss','../ex_modal.theme.css']

})
export class Entree_modalsComponent extends ViewAbstractComponent{
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
        public modalsService: Entree_modals_triggerService,
        public la: LanguageService,
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
        console.log(err)
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
        /*try {
            this.popState$.unsubscribe()
        } catch (e) {
            console.error(e);
        }
        try {
            this.dataProvide$.unsubscribe()
        } catch (e) {
            console.error(e);
        }*/
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
