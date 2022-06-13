import { ClickStopPropagationDirective } from './utils/clickStopPropagation.Directive';
import { Ng2CacheModule } from './packages/ng2-cache/ng2-cache.module';
import { DbStoreService } from './utils/service/db.store.service';
import { LanguageService } from './utils/service/language.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Provider, APP_INITIALIZER, ErrorHandler } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { CacheService } from './packages/ng2-cache/ng2-cache';
import { CookieModule, CookieService } from 'ngx-cookie'

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HttpModule, BrowserXhr } from '@angular/http'

import { LoadingScreenService } from './utils/service/loading.screen.service';
import { HttpService } from './utils/service/http.service';
import { DataProvideService } from './utils/service/data.provide.service';
import { ScriptService } from './utils/service/script.service';
import { Media_sizeService } from './utils/service/media_size.service';
import { InitDataService } from './utils/service/init.data.service';
import { CustomBrowserXhr } from './browserXhr';
import { GlobalErrorHandler } from './globalErrorHandler';
import { AppComponent } from './app.component';
import { P404Component } from '@_views/error/404.component';
import { P500Component } from '@_views/error/500.component';
import { LoginComponent } from '@_views/login/login.component';
import { RegisterComponent } from '@_views/register/register.component';
import { LinkService } from '@_utils/service/link.service';
import { Select_pageComponent } from '@_views/entree/select_page.component';
import { Entree_layoutComponent } from '@_views/entree/entree_layout.component';
import { Entree_modals_triggerService } from '@_views/entree/entree_modals_trigger.service';
import { Entree_modalsComponent } from '@_views/entree/entree_modals.component';
import { ModalBtnModule } from './components/modalBtn/modalBtn.module';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};
import {
    AppAsideModule,
    AppBreadcrumbModule,
    AppHeaderModule,
    AppFooterModule,
    AppSidebarModule,
} from '@coreui/angular';

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { InputTextareaModule} from 'primeng/inputtextarea';
import { DropdownModule} from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { LazyLoadScrollModule } from './components/scroll/lazyloading.scroll.module';



export function configServiceFactory(config: InitDataService) {
    return () => config.initAppService();
}
@NgModule({
    imports: [
        BrowserModule,
        AppRoutingModule,

        AppAsideModule,
        AppBreadcrumbModule.forRoot(),
        AppFooterModule,
        AppHeaderModule,
        AppSidebarModule,
        PerfectScrollbarModule,
        BsDropdownModule.forRoot(),
        DropdownModule,
        TabsModule.forRoot(),
        BrowserAnimationsModule,
        CookieModule.forRoot(),
        RouterModule,
        HttpModule,
        ModalBtnModule,
        FormsModule,
        InputTextareaModule,
        LazyLoadScrollModule,
        Ng2CacheModule

    ],
    declarations: [
        AppComponent,
        P404Component,
        P500Component,
        LoginComponent,
        RegisterComponent,
        Entree_layoutComponent,
        Select_pageComponent,
        Entree_modalsComponent,
        ClickStopPropagationDirective,
    ],

    providers: [
        { provide: APP_INITIALIZER, useFactory: configServiceFactory, deps: [InitDataService], multi: true },
        { provide: BrowserXhr, useClass: CustomBrowserXhr },
        { provide: ErrorHandler, useClass: GlobalErrorHandler },
        Media_sizeService,
        ScriptService,
        //  RecaptchaService,
        InitDataService,
        DataProvideService,
        HttpService,
        LoadingScreenService,
        LanguageService,
        CookieService,
        DbStoreService,
        LinkService,
        Entree_modals_triggerService,

    ],
    bootstrap: [AppComponent],
})

export class AppModule { }
