import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringHiden'
})
export class StringPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    let maxLen = 10;
    if(typeof value === 'string' ){

      if(args.length > 0 && typeof args[0] === 'number' && args[0] > 0){
        maxLen = args[0];
      }

      if(value.length < maxLen){
        return value;
      }

      return value.substr(0, maxLen) + '...';
    }

    return value;
  }

}
