import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CoreService} from '../services/core.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  private _isCollapsed: boolean;
  private coreService: CoreService;
  triggerTemplate = null;
  @ViewChild('trigger') customTrigger: TemplateRef<void>;

  constructor(coreService: CoreService) {
    this.coreService = coreService;
  }


  ngOnInit(): void {
  }

  set isCollapsed(isCollapsed) {
    this.coreService.layoutCollapsed.next(isCollapsed);
    this._isCollapsed = isCollapsed;
  }

  get isCollapsed(): boolean {
    return this._isCollapsed;
  }


  /** custom trigger can be TemplateRef **/
  changeTrigger(): void {
    this.triggerTemplate = this.customTrigger;
  }

  toggle() {
    this.isCollapsed = !this.isCollapsed;
  }

}
