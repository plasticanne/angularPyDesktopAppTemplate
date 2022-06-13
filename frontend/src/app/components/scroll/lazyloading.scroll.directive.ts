import { LazyLoadScrollService } from './lazyloading.scroll.service';
import { Directive, ElementRef,  OnInit, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[mainScroll]'
})
export class LazyLoadScrollDirective implements OnInit  {

    constructor(public el: ElementRef ,public scroll:LazyLoadScrollService,public vc:ViewContainerRef) {
  //console.log(this.vc.element.nativeElement.querySelector('.mainScroll'))
    }
     ngOnInit(){
         //console.log(this.vc.element.nativeElement)
        this.scroll.setScrollTarget(this.el.nativeElement)
       // this.scroll.setScrollTarget(this.vc.element.nativeElement.querySelector('.mainScroll'))
    }

}
