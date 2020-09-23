import { trigger } from '@angular/animations';
import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
} from '@angular/core';
import {
    ActionType,
    CollapseState,
    collapseVariableHeight,
    DialogService,
    PersistentStore,
    PersistentStoreFactory,
    ProcessAction,
    RobotService,
    rotate180Animation,
    rotate360Animation,
    RotateState,
    WidgetAppState,
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
declare const widgetName: string;

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

  constructor(
    private robotService: RobotService,
    private dialogService: DialogService,
    private appState: WidgetAppState,
    storageFactory: PersistentStoreFactory,
  ) {
    console.log(widgetName + ' loaded!');

    appState.language$.subscribe(console.log);
    appState.theme$.subscribe(console.log);
    this.store = storageFactory.create<ProcessIdToAlias>(widgetName);
    this.refreshProcessAliases();
  }

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
            message: 'Are you sure you want to stop this process?',
            title: 'Stopping all processes',
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
        return this.appState.openSidePanel(widgetName, SidePanelContentComponent, SampleWidgetModule, processKey);
    }
  }
}
