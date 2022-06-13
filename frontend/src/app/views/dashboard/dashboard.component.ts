import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import {ViewAbstractComponent} from '../view.abstract.component';
import { DataProvideService } from '../../utils/service/data.provide.service';
import { LanguageService } from '../../utils/service/language.service';
import { InitDataService } from '../../utils/service/init.data.service'
@Component({
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent extends ViewAbstractComponent {
    seo='dashboard'
    constructor(
        public init: InitDataService ,
        public la:LanguageService,
        public dataProvide:DataProvideService,

    ){
        super()
    }
    ngOnInit() {
        super.ngOnInit()
    }
}
