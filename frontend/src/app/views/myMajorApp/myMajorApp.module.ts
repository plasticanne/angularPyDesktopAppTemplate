import { PlotFrameModule } from './../../components/plotFrame/plotFrame.module';
import { MyMajorAppDataService } from './myMajorApp.data.service';


import { SharedModule } from '../../utils/shared.module';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MyMajorApp_mainComponent } from './myMajorApp_main.component';
import { MyMajorApp_layoutComponent } from './myMajorApp_layout.component';
import { AppAsideModule,  AppSidebarModule } from '@coreui/angular';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { MyMajorAppRoutingModule } from './myMajorApp.routing.module';
import { ModalBtnModule } from 'app/components/modalBtn/modalBtn.module';
import { MyMajorApp_modalsComponent } from './myMajorApp_modals.component';
import { AppHeaderModule } from 'app/components/header/app-header.module';
import { MyMajorApp_modals_triggerService } from './myMajorApp_modals_trigger.service';

import {DropdownModule} from 'primeng/dropdown';


@NgModule({
  imports: [
    MyMajorAppRoutingModule,
    AppAsideModule,
    //AppBreadcrumbModule.forRoot(),
    //AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    FormsModule,
    SharedModule,
    PlotFrameModule,
    ModalBtnModule,
    DropdownModule,



  ],
  declarations: [
    MyMajorApp_layoutComponent,
    MyMajorApp_mainComponent,
    MyMajorApp_modalsComponent

 ],
 providers: [
    MyMajorAppDataService,
    MyMajorApp_modals_triggerService,

 ]
})
export class MyMajorAppModule { }
