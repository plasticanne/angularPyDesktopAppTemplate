import { Injectable } from '@angular/core';




@Injectable()
export class LazyLoadScrollService {
    scrollTarget
    constructor() {
        //this.scrollTarget=new AsyncSubject()

    }
    setScrollTarget(target) {
        return this.scrollTarget = target
        //console.log(this.scrollTarget)
    }
    bottomLoadListener(offset: number, fn) {
        let loading = false

        this.scrollTarget.onscroll = () => {
            let positionY = this.scrollTarget.scrollHeight - this.scrollTarget.offsetHeight - this.scrollTarget.scrollTop
            if (loading == false && positionY <= offset) {
                loading = true
                console.log("loading...")
               
                    fn().then((res) => {
                        if (res != 'finished') {
                            loading = false
                            console.log("loading finished")
                        } else {
                            console.log("stop loading ")
                        }
                    })
              
            }
        };
    }

}