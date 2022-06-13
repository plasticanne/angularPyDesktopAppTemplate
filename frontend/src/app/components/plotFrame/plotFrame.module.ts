import { NgModule, Provider, ModuleWithProviders } from '@angular/core';
import { SharedModule } from '@_utils/shared.module';
import { DashComponent } from './dash.component';
import { PlotlyComponent } from './plotly.component';


@NgModule({
    declarations: [
        DashComponent,
        PlotlyComponent
    ],
    imports: [
        SharedModule,
    ],
    exports: [
        DashComponent
    ],
    providers: [],
})
export class PlotFrameModule {


}





