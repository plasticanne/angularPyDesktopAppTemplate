import {Component, ElementRef, Input, OnInit, OnDestroy, Inject, Renderer2} from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-header, cui-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css']
})
export class AppHeaderComponent implements OnInit, OnDestroy {

  @Input() fixed: boolean;

  @Input() navbarBrand: any;
  @Input() navbarBrandFull: any;
  @Input() navbarBrandMinimized: any;
  @Input() navbarBrandText: any = {icon: '🅲', text: '🅲 CoreUI'};
  @Input() navbarBrandHref: string = ''; // deprecated, use navbarBrandRouterLink instead
  @Input() navbarBrandRouterLink: any[] | string = '';

  @Input() sidebarToggler: string | boolean;
  @Input() mobileSidebarToggler: boolean;

  @Input() asideMenuToggler: string | boolean;
  @Input() mobileAsideMenuToggler: boolean;

  private readonly fixedClass = 'header-fixed';
  navbarBrandImg: boolean;

  constructor(
    @Inject(DOCUMENT) private document: any,
    private renderer: Renderer2,
    private hostElement: ElementRef
  ) {
    renderer.addClass(hostElement.nativeElement, 'app-header');
    renderer.addClass(hostElement.nativeElement, 'navbar');
  }

  ngOnInit(): void {

    this.navbarBrandImg = Boolean(this.navbarBrandFull);

  }
  closeWindow() {

    window.opener=null;
    window.close();
  }

  ngOnDestroy(): void {
    //this.renderer.removeClass(this.document.body, this.fixedClass);
  }

//   isFixed(fixed: boolean = this.fixed): void {
//     if (fixed) {
//       this.renderer.addClass(this.document.body, this.fixedClass);
//     }
//   }
}
