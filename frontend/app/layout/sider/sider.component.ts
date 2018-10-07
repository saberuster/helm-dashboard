import {Component, OnInit} from '@angular/core';
import {CoreService} from '../../services/core.service';

@Component({
  selector: 'app-sider',
  templateUrl: './sider.component.html',
  styleUrls: ['./sider.component.css']
})
export class SiderComponent implements OnInit {

  private _isCollapsed: boolean;
  private _menus: Array<any>;

  constructor(private coreService: CoreService) {
    coreService.layoutCollapsed.subscribe(b => this.isCollapsed = b);
    coreService.fetchMenus().subscribe(menus => this.menus = menus);
  }

  ngOnInit() {
  }

  set isCollapsed(isCollapsed) {
    this._isCollapsed = isCollapsed;
  }

  get isCollapsed(): boolean {
    return this._isCollapsed;
  }

  set menus(menus) {
    this._menus = menus;
  }

  get menus() {
    return this._menus;
  }

}
