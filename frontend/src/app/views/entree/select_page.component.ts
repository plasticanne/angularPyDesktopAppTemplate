import { Component } from '@angular/core';
import { ViewAbstractComponent } from '@_views/view.abstract.component';
import { LanguageService } from '@_utils/service/language.service';
import { InitDataService } from '@_utils/service/init.data.service'

@Component({
  selector: 'select-page-component',
  templateUrl: 'select_page.component.html',
  styleUrls: ['entree_layout.component.scss','select_page.component.scss']
})
export class Select_pageComponent extends ViewAbstractComponent  {
    myMajorAppLink=['/myMajorApp/main']


    constructor(
        public init: InitDataService,
        public la: LanguageService,

    ) {
        super()
    }
    ngOnInit(){

        super.ngOnInit()
    }


}
