import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StringPipe } from './string.pipe';
import { SafeHtmlPipe } from './safe-html.pipe';
import { FilterPipe } from './filter.pipe';



@NgModule({
  declarations: [
    StringPipe,
    SafeHtmlPipe,
    FilterPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    StringPipe,
    SafeHtmlPipe,
    FilterPipe
  ]
})
export class PipeModule { }
