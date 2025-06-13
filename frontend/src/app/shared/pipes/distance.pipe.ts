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
    const kilometers = meters / 1000;
    return `${kilometers.toFixed(1)}km`;
  }
}
