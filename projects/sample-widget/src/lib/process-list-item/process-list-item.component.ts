import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';
import {
    ActionType,
    ILiveProcess,
    ProcessAction,
    ProcessInstallationState,
} from '@uipath/widget.sdk';

@Component({
    selector: 'process-list-item',
    templateUrl: './process-list-item.component.html',
    styleUrls: ['./process-list-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProcessListItemComponent {
    @Input()
    public disabled = false;

    @Input()
    public process!: ILiveProcess;

    @Input()
    public alias: string;

    @Output()
    public processAction = new EventEmitter<ProcessAction>();

    public ActionType = ActionType;
    public ProcessInstallationState = ProcessInstallationState;

    public dispatch(action: ActionType) {
        this.processAction.emit({
            actionType: action,
            processKey: this.process.key,
            source: this.process,
        });
    }
}
