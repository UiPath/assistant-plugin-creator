import {
    Component,
    Inject,
} from '@angular/core';
import {
    TabLabel,
    WIDGET_ID,
    WidgetAppState,
    WidgetHomeTabService,
} from '@uipath/widget.sdk';

@Component({
  templateUrl: './side-panel-content.component.html',
  styleUrls: ['./side-panel-content.component.scss']
})
export class SidePanelContentComponent {
  public data: { isOnHomeTab: boolean, run: () => void };

  constructor(
    private appState: WidgetAppState,
    private homeTab: WidgetHomeTabService,
    @Inject(WIDGET_ID)
    private widgetId: string
  ) { }

  public close() {
    if (this.data.isOnHomeTab) {
      return this.homeTab.closeSidePanel();
    }

    this.appState.closeSidePanel(this.widgetId);
  }
}
