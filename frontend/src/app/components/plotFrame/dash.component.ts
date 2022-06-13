import { Component,ViewChild,ElementRef, Input, NgZone } from '@angular/core';
import {IFrameComponent, iframeResizer} from 'iframe-resizer';
@Component({
  selector: 'dash-component',
  templateUrl: 'dash.component.html',
  styleUrls: ['dash.component.css']
})
export class DashComponent  {
    @Input() src
    @Input() width
    @Input() height
    constructor(
        private zone: NgZone

    ) {


    }
    ngOnInit(){


    }
    ngAfterViewInit(){
        //this.getDoc()
        this.initIframeResizer()
    }
    getDoc(){
        console.log(this.frameElement.nativeElement.contentWindow.document)
    }
    @ViewChild("frame") frameElement: ElementRef;
    setHeight(){
        //console.log(this.frameElement.nativeElement.contentWindow)
        //this.height=this.frameElement.nativeElement.contentWindow.document.body.scrollHeight

    }

    // onResize(e){
	// 	if (window.innerWidth>900){
	// 		this.width=900
	// 	}else if(window.innerWidth<=900 ){
	// 		this.width=window.innerWidth
	// 	}
    // }
    // onResize(e){
    //     if (this.component && this.component.iFrameResizer) {
    //     this.component.iFrameResizer.resize()
    //     }
    // }
    component: IFrameComponent;
    initIframeResizer(){
        const components = iframeResizer({
            autoResize: false,
            checkOrigin: false,
            minHeight:300,
            heightCalculationMethod: 'bodyOffset',
            widthCalculationMethod: 'bodyOffset',
            log: false,
            resizedCallback:( { iframe , height , width , type } ) =>{this.onResize()}
        }, this.frameElement.nativeElement);
        /* save component reference so we can close it later */
        this.component = components && components.length > 0 ? components[0] : null;

    }
    rtimer;
    delta = 1000;
    onResize() {
        this.zone.runOutsideAngular(() => {
            clearTimeout(this.rtimer);
            this.rtimer = setTimeout(()=>this.resizeEnd(), this.delta);
        })

    }
    resizeEnd() {
        console.log('resizeEnd')
        if (this.component && this.component.iFrameResizer) {
                this.component.iFrameResizer.resize()
        }

    }


}
