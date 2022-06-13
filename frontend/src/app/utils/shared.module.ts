import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { RouterModule } from '@angular/router';
import { NgModule, Provider, ModuleWithProviders } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { SafePipe } from './safe.pipe';
import { DateFormatPipe } from './dateFormat.pipe';
import { InlineSVGModule } from 'ng-inline-svg';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
    declarations: [
        SafePipe,
        DateFormatPipe,

    ],
    imports: [
        RouterModule,
        FormsModule,
        HttpModule,
        InlineSVGModule,
        CommonModule ,
        HttpClientModule,
        BsDropdownModule,
        ButtonsModule.forRoot()
    ],
    exports: [
        RouterModule,
        FormsModule,
        HttpModule,
        SafePipe,
        DateFormatPipe,
        InlineSVGModule,
        CommonModule,
        HttpClientModule,
        BsDropdownModule,
        ButtonsModule,
    ],
    providers: [],
})
export class SharedModule {
};







