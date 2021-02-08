import {
    ChangeDetectorRef,
    Inject,
    Pipe,
    PipeTransform,
} from '@angular/core';
import {
    TranslatePipe,
    TranslateService,
} from '@ngx-translate/core';

declare const widgetName: string;

@Pipe({
  name: 'translation',
  pure: false,
})
export class TranslationPipe implements PipeTransform {
  private pipe = new TranslatePipe(this.translate, this.ref);

  constructor(
    @Inject(TranslateService)
    private translate: TranslateService,
    @Inject(ChangeDetectorRef)
    private ref: ChangeDetectorRef) {
  }

  public transform(value: string, ...args: unknown[]): unknown {
    return this.pipe.transform(`WIDGETS.${widgetName}.${value}`, ...args);
  }
}
