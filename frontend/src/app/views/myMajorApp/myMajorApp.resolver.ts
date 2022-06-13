import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { MyMajorAppDataService } from './myMajorApp.data.service';
import { Entree_modals_triggerService,ModalOnTriggerCommmet } from '@_views/entree/entree_modals_trigger.service';
import { LanguageService } from '@_utils/service/language.service';
import { timer, Observable,BehaviorSubject, Subject,of,forkJoin,pipe } from 'rxjs';
@Injectable()
export class MyMajorAppResolver implements Resolve<any>{
    public urlList
    public host
    constructor(
        public modalsService: Entree_modals_triggerService,
        public data:MyMajorAppDataService,
        private router: Router,
        public la:LanguageService,
        ) {
    }

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.data.initialize().then( (res)=>{
            return Promise.all([

                this.data.injectData("layout").toPromise(),

            ]).then(() =>{
                console.log("resolved")
            }).catch( e=>{
                this.router.navigate(['/entree/select_page'],{ queryParams: { lang: this.la.language }} );
                this.modalsService.generalErrorHandler(e)

            })



        })
    }
}
