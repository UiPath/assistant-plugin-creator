import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
    ViewEncapsulation,
} from '@angular/core';
import {
    ActionType,
    ILiveProcess,
    ProcessAction,
    ProcessInstallationState,
    ProcessActionType,
} from '@uipath/widget.sdk';

@Component({
    selector: 'process-list-item',
    templateUrl: './process-list-item.component.html',
    styleUrls: ['./process-list-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
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

    public dispatch(action: ProcessActionType, e: Event) {
        this.processAction.emit({
            trigger: '',
            actionType: action,
            processKey: this.process.key,
            source: this.process,
        });

        e.stopPropagation();
    }
}
