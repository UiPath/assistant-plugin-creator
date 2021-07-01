import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'process-details-tab',
  templateUrl: './process-details-tab.component.html',
  styleUrls: ['./process-details-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ProcessDetailsTabComponent {
  public data: { processKey: string };
}
