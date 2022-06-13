import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from '@_utils/service/language.service';
import { InitDataService } from '@_utils/service/init.data.service';


@Component({
  selector: 'entree-layout-component',
  templateUrl: 'entree_layout.component.html',
  styleUrls: ['entree_layout.component.scss']
})
export class Entree_layoutComponent   {

    constructor(
        public init: InitDataService,
        public la: LanguageService,
        private router:Router

    ) {

    }
    selectLang(e){
        this.router.navigate([],{ queryParams: { lang: e.value }} );

    }
}
