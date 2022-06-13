import { LanguageService } from '@_utils/service/language.service';
import { InitDataService } from '@_utils/service/init.data.service';
import { MyMajorAppDataService } from './myMajorApp.data.service';
import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { ViewAbstractComponent } from '@_views/view.abstract.component';
declare var uPlot;

@Component({
  selector: 'myMajorApp-main-component',
  templateUrl: 'myMajorApp_main.component.html',
  styleUrls: ['myMajorApp_main.component.css']
})
export class MyMajorApp_mainComponent  extends ViewAbstractComponent{

    constructor(
        public data:MyMajorAppDataService,
        public init: InitDataService,
        public  la: LanguageService,
        private zone: NgZone,
    ) {
        super()
    }
    ngAfterViewInit() {





        this.data.injectData('dash_datas').toPromise().then(
            res=>{}
        )
        this.data.injectData('datas').toPromise().then( res=>{
            this.genUPlot(this.data.datas)
        })

    }
    width= 800
    height= 600
    @ViewChild('baseChart', { read: ElementRef }) baseChart: ElementRef
    chartMeta
    genUPlot(datas){
        this.chartMeta={
            chart:undefined,
            data:datas,
            dom:this.baseChart,
        }
        let opts = {
            title: "i am uplot",
            ...this.getSize(),
            axes: [
                {
                    label: 'x',
                    labelSize: 20,
                    size: 80,
                    values: (u, vals, space) => vals.map(v => +v.toFixed(2) ),
                },
                {
                    label: 'y',
                    labelSize: 20,
                    size: 80,
                    values: (u, vals, space) => vals.map(v => +v.toFixed(2) ),
                },
            ],
            series: [
                {
                    spanGaps:true,
                    label: `x`,
                    value: (u, v) => v == null ? "-" : v.toFixed(2),
                    width: 2,
                },
                {
                    spanGaps:true,
                    label: `y`,
                    value: (u, v) => v == null ? "-" : v.toFixed(2),
                    width: 2,
                }

            ],
        }

        let chart = new uPlot(
            opts,
            this.chartMeta.data,
            this.baseChart.nativeElement
        );
        this.chartMeta.chart=chart



    }
    @ViewChild('plotBlock', { read: ElementRef }) plotBlock: ElementRef
    getSize() {
        let width=this.plotBlock.nativeElement.offsetWidth-80
        //console.log(width)
        return {
            width: width,
            height: this.height-200,
        }
    }
    resizeEnd() {
        if (!this.chartMeta) return
        if (!this.chartMeta.chart) return
        this.chartMeta.chart.setSize(this.getSize())

    }
    rtimer;
    delta = 300;
    onResize(event) {
        this.zone.runOutsideAngular(() => {
            clearTimeout(this.rtimer);
            this.rtimer = setTimeout(()=>this.resizeEnd(), this.delta);
        })

    }
}
