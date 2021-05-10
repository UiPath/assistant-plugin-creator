import { trigger } from '@angular/animations';
import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    ViewEncapsulation,
} from '@angular/core';
import {
    ActionType,
    CollapseState,
    collapseVariableHeight,
    DialogService,
    IWidgetHomeTabItem,
    PersistentStore,
    PersistentStoreFactory,
    ProcessAction,
    RobotService,
    rotate180Animation,
    rotate360Animation,
    RotateState,
    TabLabel,
    WIDGET_ID,
    WidgetAppState,
    WidgetHomeTabService,
} from '@uipath/widget.sdk';

import { BehaviorSubject } from 'rxjs';
import {
    filter,
    switchMapTo,
} from 'rxjs/operators';

import { InputDialogComponent } from './input-dialog/input-dialog.component';
import { SampleWidgetModule } from './sample-widget.module';
import { SidePanelContentComponent } from './side-panel-content/side-panel-content.component';

type ProcessIdToAlias = Record<string, string>;

@Component({
  selector: 'sample-widget',
  templateUrl: './sample-widget.component.html',
  styleUrls: ['./sample-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('collapse', collapseVariableHeight()),
    trigger('rotate180', rotate180Animation()),
    trigger('rotate360', rotate360Animation()),
  ],
  encapsulation: ViewEncapsulation.None,
})
export class SampleWidgetComponent {
  public RotateState = RotateState;
  public CollapseState = CollapseState;
  public isCollapsed = false;
  public processList$ = this.robotService.processList$;
  public processIdToAlias = new BehaviorSubject<ProcessIdToAlias>({});
  private store: PersistentStore<ProcessIdToAlias>;
  private refreshedTimes = 0;

  constructor(
    private robotService: RobotService,
    private dialogService: DialogService,
    private appState: WidgetAppState,
    private homeTab: WidgetHomeTabService,
    @Inject(WIDGET_ID)
    private widgetId: string,
    public storageFactory: PersistentStoreFactory,
  ) {
    appState.language$.subscribe(console.log);
    appState.theme$.subscribe(console.log);
    this.store = storageFactory.create<ProcessIdToAlias>(this.widgetId);
    this.refreshProcessAliases();

    homeTab.setSection({
      items: [this.getHomeTabItem()],
      title: this.widgetItemIntl(),
      onItemClicked: () => this.homeTab.openSidePanel(SidePanelContentComponent, SampleWidgetModule, { isOnHomeTab: true, run: this.runHomeTabItem }),
      onButtonClicked: this.runHomeTabItem,
      onMenuItemClicked: item => {
        homeTab.togglePinToLaunchpad(item);
      }
    });

    homeTab.pinnedItemIds$
      .subscribe(() => homeTab.setItems([this.getHomeTabItem()]));

    homeTab.refresh$.subscribe(() => {
      this.homeTab.setItems([{
        ...this.getHomeTabItem(),
        details: appState.translate('REFRESHED_TIMES', { count: ++this.refreshedTimes }),
      }]);
    });

    appState.search$.subscribe(() => {
      homeTab.setSearchResults([{ items: [this.getHomeTabItem()], title: this.widgetItemIntl() }]);
    });
  }

  public getHomeTabItem = (): IWidgetHomeTabItem => ({
    id: '1',
    title: this.widgetItemIntl(),
    details: this.appState.translate('REFRESHED_TIMES', { count: this.refreshedTimes }),
    tooltip: this.widgetItemIntl(),
    isDraggableToLaunchpad: true,
    buttonIcon: 'play_circle_outline',
    menuItems: [{ text: this.getPinTranslation('1') }],
  });

  public getPinTranslation = (itemId: string) => this.homeTab.getPinnedItemIds().has(itemId)
    ? this.appState.translate('SAMPLE_WIDGET_ITEM_UNPIN')
    : this.appState.translate('SAMPLE_WIDGET_ITEM_PIN')


  public widgetItemIntl = () => this.appState.translate('SAMPLE_WIDGET_ITEM');

  public runHomeTabItem = () => this.dialogService.alert({
    type: 'info',
    message: this.widgetItemIntl(),
    title: this.widgetItemIntl(),
  }).afterClosedResult().subscribe();

  public refreshProcessAliases() {
    this.store.read().subscribe(mapping => this.processIdToAlias.next(mapping || {}));
  }

  public async rename(processKey: string, currentName: string) {
    const result = await this.dialogService.custom<string>(InputDialogComponent, currentName, { panelClass: 'input-dialog' })
      .afterClosedResult()
      .toPromise();
    if (!result) {
      return;
    }

    this.store.patch({ [processKey]: result })
      .subscribe(
        () => this.refreshProcessAliases(),
      );
  }

  public async actionHandler({ actionType, processKey, source }: ProcessAction) {
    switch (actionType) {
      case ActionType.Start:
        return await this.robotService.startJob({ processKey }).toPromise();
      case ActionType.Stop:
        return await this.dialogService
          .confirmation({
            isDestructive: true,
            message: this.appState.translate('STOP_PROCESS'),
            title: this.appState.translate('STOP_PROCESS_TITLE'),
            translateData: source,
          })
          .afterClosedResult()
          .pipe(
            filter(result => !!result),
            switchMapTo(this.robotService.stopProcess(processKey)),
          ).toPromise();
      case ActionType.Resume:
        return await this.robotService.resumeProcess(processKey).toPromise();
      case ActionType.Pause:
        return await this.robotService.pauseProcess(processKey).toPromise();
      case ActionType.Install:
        return await this.robotService.installProcess({ processKey }).toPromise();
      case ActionType.Edit:
        return this.appState.openSidePanel(
          this.widgetId,
          SidePanelContentComponent,
          SampleWidgetModule,
          {
            isOnHomeTab: false,
            run: () => this.actionHandler({ actionType: ActionType.Start, processKey, source, trigger: '' }),
          },
        );
    }
  }
}
