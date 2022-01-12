import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(values: any, ...args: string[]): any {
    if(values instanceof Array){
      return values.filter(v => v[args[0]] === args[1]);
    }
    return values;
  }

}
