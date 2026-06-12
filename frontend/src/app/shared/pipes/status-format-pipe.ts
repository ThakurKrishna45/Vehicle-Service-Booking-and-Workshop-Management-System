import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusFormat',
  standalone: true
})
export class StatusFormatPipe implements PipeTransform {

  transform(value: string): string {

    if (!value) {
      return '';
    }

    return value
      .toLowerCase()
      .replace(/_/g, ' ')
      .split(' ')
      .map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(' ');
  }
}