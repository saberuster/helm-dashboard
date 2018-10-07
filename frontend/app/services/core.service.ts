import {Injectable} from '@angular/core';
import {Observable, of, Subject} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CoreService {

  layoutCollapsed: Subject<boolean>;

  private menus = [
    {name: 'Dash board', icon: 'anticon-user', to: '/dashboard', hasChildren: false, children: null, selected: false},
    {
      name: 'Chart', icon: 'anticon-user', to: '/chart', hasChildren: true, selected: false, children: [
        {name: 'Chart List', to: '/chart/list', selected: false},
        {name: 'Search Chart', to: '/chart/search', selected: false}
      ]
    },
    {name: 'Repo', icon: 'anticon-user', hasChildren: false, children: null, selected: false, to: '/repo/list'},
    {name: 'Plugin', icon: 'anticon-user', hasChildren: false, children: null, selected: false, to: '/plugin/list'}
  ];

  constructor() {
    this.layoutCollapsed = new Subject<boolean>();
    this.layoutCollapsed.next(true);
  }


  fetchMenus(): Observable<any> {
    return of(this.menus).pipe(map((menus) => {
      menus.map(menu => {
        if (menu.to === document.location.pathname) {
          menu.selected = true;
        }
        if (menu.children && menu.children.length > 0) {
          const subMenu = menu.children.find((m) => m.to === document.location.pathname);
          if (subMenu) {
            subMenu.selected = true;
            menu.selected = true;
          }
        }
        return menu;
      });
      return menus;
    }));
  }


}
