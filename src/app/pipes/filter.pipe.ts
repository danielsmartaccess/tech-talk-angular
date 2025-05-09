import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {
  transform<T>(items: T[], searchText: string, properties: (keyof T)[]): T[] {
    if (!items || !searchText || !properties.length) {
      return items;
    }
    
    searchText = searchText.toLowerCase().trim();
    
    return items.filter(item => {
      return properties.some(prop => {
        const value = item[prop];
        
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchText);
        }
        
        if (typeof value === 'number') {
          return value.toString().includes(searchText);
        }
        
        return false;
      });
    });
  }
}
