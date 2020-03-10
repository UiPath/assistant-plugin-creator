import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    ViewEncapsulation,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
    MAT_DIALOG_DATA,
    MatDialogRef,
} from '@angular/material/dialog';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    templateUrl: './input-dialog.component.html',
    styleUrls: ['./input-dialog.component.scss']
})
export class InputDialogComponent {
    public search: FormControl;

    constructor(
        @Inject(MAT_DIALOG_DATA)
        public name: string,
        @Inject(MatDialogRef)
        public dialog: MatDialogRef<any, any>,
    ) {
        this.search = new FormControl(name);
    }
}
