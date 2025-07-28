import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'distance',
  standalone: true,
})
export class DistancePipe implements PipeTransform {
  transform(meters: number): string {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  }
}
