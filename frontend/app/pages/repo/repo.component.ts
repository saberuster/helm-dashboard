import {Component, OnInit} from '@angular/core';
import {RepoService} from '../../services/api/repo.service';

@Component({
  selector: 'app-repo',
  templateUrl: './repo.component.html',
  styleUrls: ['./repo.component.css']
})
export class RepoComponent implements OnInit {
  dataSet = [];

  constructor(private repoService: RepoService) {
  }

  ngOnInit() {
    this.repoService.list().subscribe(resp => this.dataSet = resp);
  }


}
