import { element } from 'protractor';
import { Subject } from 'rxjs';
import { Component, Input, OnInit, Injectable, Inject, OnChanges, HostListener, NgZone,ViewChild,ElementRef } from '@angular/core';
//import * as $ from 'jquery';


export abstract class ViewAbstractComponent {
    seo:string
    lang:string
	language$
	init
	la
	width
	height

    dataProvide

    constructor(

    ) {
	}

    ngOnInit() {
		//this.init.setSeo(this.seo)
        this.language$=this.la.language$.subscribe(r => {
            this.changeLang(r["lang"])
            this.lang=r["lang"]
        })

    }



    changeLang(r:string){
        if(r=="en"){

        }
        if(r=="jp"){

        }
        if(r=="zh_hant"){

        }
        if(r=="zh_hans"){

        }

    }
    ngOnDestroy() {
        try {
            this.language$.unsubscribe();
        } catch (e) {

        }

	}
    onResize(e){

    }


}
