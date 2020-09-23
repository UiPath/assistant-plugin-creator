import { Component } from '@angular/core';
import { WidgetAppState } from '@uipath/widget.sdk';

declare const widgetName: string;

@Component({
  selector: 'lib-side-panel-content',
  templateUrl: './side-panel-content.component.html',
  styleUrls: ['./side-panel-content.component.scss']
})
export class SidePanelContentComponent {
  public data: string;

  constructor(private appState: WidgetAppState) { }

  public close() {
    this.appState.closeSidePanel(widgetName);
  }
}
