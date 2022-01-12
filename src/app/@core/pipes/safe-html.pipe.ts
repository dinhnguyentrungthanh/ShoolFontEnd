import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {

  constructor(protected sanitizer: DomSanitizer){}

  transform(value: unknown, ...args: unknown[]): unknown {
      if(typeof value !== 'string'){
        return value;
      }
     return this.sanitizer.bypassSecurityTrustHtml(value);
  }

}
