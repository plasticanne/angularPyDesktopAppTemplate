import { Component, OnInit, ViewEncapsulation,HostListener } from '@angular/core';
import { Router ,NavigationEnd,NavigationStart,ActivatedRoute} from '@angular/router';
import { LoadingScreenService } from './utils/service/loading.screen.service';
import { LinkService } from '@_utils/service/link.service';
import { LanguageService } from '@_utils/service/language.service';

@Component({
  // tslint:disable-next-line
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent{
    entree_page='/entree/select_page'
    language$
    constructor(
        private router: Router,
        public loadingImg: LoadingScreenService,
        public linkS:LinkService,
        private pageRoute:ActivatedRoute,
        public la:LanguageService,

        ) {
        this.router.events.subscribe(routerEvent => {
            /*if (routerEvent instanceof NavigationEnd) {
                dataLayer.push({
                'event':'VirtualPageView',
                'root':'/',
                'virtualUrl':routerEvent.url
                })
            }*/



            if (routerEvent instanceof NavigationEnd) {
                let url=routerEvent.url.split('?')
                let lang= this.praseQ(`${url[1]}`,"lang")

                if (lang=='zh_hant'){
                    this.la.setLanguage(lang)
                    this.setFontFamily(lang)
                    if (url[0]=='/' ){
                        this.router.navigate(
                            [this.entree_page],
                            {
                                queryParams:{lang:lang},replaceUrl: true
                            },
                        );
                        return
                    }
                // }else if (lang=='zh_hans'){
                //     this.la.setLanguage(lang)
                //     this.setFontFamily(lang)
                // if (url[0]=='/' ){
                //     reRouter='/entree/select_page'
                //     this.router.navigate(
                //         [reRouter],
                //         {
                //             queryParams:{lang:lang},replaceUrl: true
                //         },
                //     );
                //     return
                //}

                }else if (lang=='en'){
                    this.la.setLanguage(lang)
                    this.setFontFamily(lang)
                    if (url[0]=='/' ){
                        this.router.navigate(
                            [this.entree_page],
                            {
                                queryParams:{lang:lang},replaceUrl: true
                            },
                        );
                        return
                    }

                }else{
                    lang=this.la.detectLang()
                    let reRouter
                    if (url[0]=='/' ){
                        reRouter=this.entree_page
                    }else{
                        reRouter=url[0]
                    }
                    this.router.navigate(
                        [reRouter],
                        {
                            queryParams:{lang:lang},replaceUrl: true
                        },
                    );
                }

                this.setLinks(`${this.router.url.split('?')[0]}`)
                window.scrollTo(0, 0)
            }
        });


    }

    ngOnInit() {
        // this.router.events.subscribe((evt) => {
        // if (!(evt instanceof NavigationEnd)) {
        //     return;
        // }
        // window.scrollTo(0, 0);
        // });
        window.addEventListener("dragover", e => {
            e && e.preventDefault();
          }, false);
        window.addEventListener("drop", e => {
        e && e.preventDefault();
        }, false);
    }
    font_family
        setFontFamily(r:string){
            if (r=='zh_hant' || r=='zh_hans'){
                this.font_family={'font-family':'Segoe UI, "Heiti TC", "Microsoft JhengHei" !important;'}
            }
            if (r=='en'){
                this.font_family={'font-family':'Arial ,"Heiti TC", "Microsoft JhengHei" !important;'}
            }

        }
    setLinks(url){
        this.linkS.removeTag('rel=alternate')
        this.linkS.addTag({
            href: `${url}?lang=en`,
            hreflang: 'en',
            rel: 'alternate'
        })
        this.linkS.addTag({
            href: `${url}?lang=zh_hant`,
            hreflang: 'zh-hant',
            rel: 'alternate'
        })
        this.linkS.addTag({
            href: `${url}?lang=zh_hans`,
            hreflang: 'zh-hans',
            rel: 'alternate'
        })
        this.linkS.addTag({
            href: `${url}?lang=en`,
            hreflang: 'x-default',
            rel: 'alternate'
        })

    }

    praseQ(r:string,variable:string){
        let vars = r.split('&');
        for (let i = 0; i < vars.length; i++) {
            let pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
        return undefined
    }
    }
    changeLang(r:string){

        let url=`${this.router.url.split('?')[0]}`

        this.router.navigate(
            [url],
            {
                queryParams:{lang:r},

            }
        );


    }
}
