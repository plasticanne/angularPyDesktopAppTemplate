import { Component,ViewChild,ElementRef, Input } from '@angular/core';


@Component({
  selector: 'plotly-component',
  templateUrl: 'plotly.component.html',
  styleUrls: ['plotly.component.css']
})
export class PlotlyComponent  {

    @Input() src
    @Input() width
    @Input() height
    constructor(

    ) {


    }
    ngOnInit(){


    }
    @ViewChild("frame") frameElement: ElementRef;

    srcReplace(src){
        '<html>'+src.replace("https://cdn.plot.ly/plotly-latest.min.js","assets/plotly-latest.min.js")+'</html>'
    }




}
