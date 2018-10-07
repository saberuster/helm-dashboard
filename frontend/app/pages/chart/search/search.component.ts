import {Component, OnInit} from '@angular/core';
import {ChartService, SearchResultItem} from '../../../services/api/chart.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  resultSet: SearchResultItem[] = [];

  keyword: string;

  constructor(private chartService: ChartService) {
  }


  ngOnInit() {
  }


  search() {
    this.chartService.searchChart(this.keyword.trim()).subscribe(resp => this.loadResult(resp));
  }

  loadResult(result: SearchResultItem[]) {
    this.resultSet.splice(0, this.resultSet.length, ...result);
  }
}
