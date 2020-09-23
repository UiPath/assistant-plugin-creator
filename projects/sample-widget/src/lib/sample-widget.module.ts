import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
    FormatDistanceModule,
    TitleBarComponentModule,
    WidgetItemModule,
} from '@uipath/widget.sdk';

import { InputDialogComponent } from './input-dialog/input-dialog.component';
import { ProcessListItemComponent } from './process-list-item/process-list-item.component';
import { SampleWidgetComponent } from './sample-widget.component';
import { SidePanelContentComponent } from './side-panel-content/side-panel-content.component';

@NgModule({
  declarations: [
    SampleWidgetComponent,
    ProcessListItemComponent,
    InputDialogComponent,
    SidePanelContentComponent,
  ],
  imports: [
    TitleBarComponentModule,
    WidgetItemModule,
    FormatDistanceModule,
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatListModule,
    MatProgressBarModule,
    ScrollingModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  exports: [
    SampleWidgetComponent,
    SidePanelContentComponent,
  ]
})
export class SampleWidgetModule { }
