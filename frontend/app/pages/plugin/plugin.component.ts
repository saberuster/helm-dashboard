import {Component, OnInit} from '@angular/core';
import {PluginService} from '../../services/api/plugin.service';

@Component({
  selector: 'app-plugin',
  templateUrl: './plugin.component.html',
  styleUrls: ['./plugin.component.css']
})
export class PluginComponent implements OnInit {

  dataSet = [];

  constructor(private pluginService: PluginService) {
  }

  ngOnInit() {
    this.pluginService.list().subscribe(resp => {
      this.dataSet = resp ? resp : [];
    });
  }

}
