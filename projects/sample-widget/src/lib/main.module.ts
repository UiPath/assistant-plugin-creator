import { NgModule } from '@angular/core';

import { MainComponent } from './main.component';
import { SampleWidgetModule } from './sample-widget.module';

@NgModule({
  declarations: [
    MainComponent,
  ],
  imports: [
    SampleWidgetModule,
  ],
  exports: [MainComponent]
})
export class MainModule { }
