import { ModalModule } from 'ngx-bootstrap/modal';
import { ModalBtnComponent } from './modalBtn.component';
import { NgModule, Provider, ModuleWithProviders } from '@angular/core';
import { SharedModule } from '@_utils/shared.module';


@NgModule({
    declarations: [
        ModalBtnComponent,
    ],
    imports: [
        ModalModule.forRoot(),
        SharedModule,
    ],
    exports: [

        ModalModule,
        ModalBtnComponent
    ],
    providers: [],
})
export class ModalBtnModule {


}





