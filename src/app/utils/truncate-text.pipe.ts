import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  standalone: true,
  name: 'truncateText'
})
export class TruncateTextPipe implements PipeTransform {
  transform(value: string, maxLength: number): string {
    const ellipsis = '…';
    if (!value) return '';
    if (value.length <= maxLength) return value;

    const maxWordLength = 25;
    let truncated = value.slice(0, maxLength + maxWordLength);

    while (truncated.length > maxLength - ellipsis.length) {
      const lastSpace = truncated.lastIndexOf(' ');
      if (lastSpace === -1) break;
      truncated = truncated.slice(0, lastSpace).replace(/[!,.?;:]$/, '');
    }

    return truncated + ellipsis;
  }

}
