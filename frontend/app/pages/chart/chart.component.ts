import {Component, OnInit} from '@angular/core';
import {ChartService, ReleaseInfo} from '../../services/api/chart.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  dataSet: ReleaseInfo[];

  constructor(private chartService: ChartService) {
    chartService.releaseList().subscribe(list => this.dataSet = list.Releases);
  }

  ngOnInit() {
  }

}
