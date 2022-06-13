//import { InitDataService } from './../service/init.data.service';
import { Pipe } from '@angular/core';


@Pipe({
    name: 'pageCodeMap'
})
export class PageCodeMapPipe {
    tag2name


    constructor() {
        
    }
    myTWSwitch(value) {
        switch (value) {
            
           
        }
    }
    myENSwitch(value) {
        switch (value) {
           
        }
    }
   
    public transform(value, type: string) {
        switch (type) {
            case 'tw':
                return this.myTWSwitch(String(value))
            case 'en':
                return this.myENSwitch(String(value))
            default:
                throw new Error(`Unable to bypass security for invalid type: ${type}`);
        }
    }

}