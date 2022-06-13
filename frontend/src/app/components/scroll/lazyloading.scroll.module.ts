
import { NgModule, Provider, ModuleWithProviders } from '@angular/core';
import { LazyLoadScrollDirective } from './lazyloading.scroll.directive';
import { LazyLoadScrollService } from './lazyloading.scroll.service';

@NgModule({
    declarations: [
        LazyLoadScrollDirective
    ],
    imports: [
    ],
    exports: [
        LazyLoadScrollDirective
    ],
    providers: [
        LazyLoadScrollService
    ],
})
export class LazyLoadScrollModule {


}





