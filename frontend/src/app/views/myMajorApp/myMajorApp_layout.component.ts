import { MyMajorAppDataService } from './myMajorApp.data.service';
import { Component, OnDestroy, Inject, HostListener, ViewChildren, ElementRef,ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { navItems } from '../../nav';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter'
import { InitDataService } from '@_utils/service/init.data.service';
import { LanguageService } from '@_utils/service/language.service';
import { ViewAbstractComponent } from '@_views/view.abstract.component';
@Component({
    selector: 'myMajorApp-layout-component',
    templateUrl: './myMajorApp_layout.component.html',
    styleUrls: ['./myMajorApp_layout.component.css']
})
export class MyMajorApp_layoutComponent extends ViewAbstractComponent{
    public navItems = navItems;
    public sidebarMinimized = true;
    private changes: MutationObserver;
    public element: HTMLElement;
    private router$
    public sn
    private tplAppend$
    private der$
    command$
    constructor(
        public data:MyMajorAppDataService,
        public init: InitDataService,
        public  la: LanguageService,
        private router: Router,
        @Inject(DOCUMENT) _document?: any,

        ) {
        super()
        this.changes = new MutationObserver((mutations) => {
            this.sidebarMinimized = _document.body.classList.contains('sidebar-minimized');
        });
        this.element = _document.body;
        this.changes.observe(<Element>this.element, {
            attributes: true,
            attributeFilter: ['class']
        });


    }

    ngAfterViewInit(){




    }



    selectLang(e){
        this.router.navigate([],{ queryParams: { lang: e.value }} );

    }



    ngOnDestroy(): void {
        super.ngOnDestroy()
        this.changes.disconnect();
        try {
            this.router$.unsubscribe()
        } catch (e) {
        }
        try {
            this.command$.unsubscribe()
        } catch (e) {
        }
    }


    exec_new_intance(){
        return this.data.injectData('exec_new_intance').toPromise().catch(e =>{})
    }




}
