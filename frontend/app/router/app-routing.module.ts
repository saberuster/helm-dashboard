import {NgModule} from '@angular/core';
import {LoginComponent} from '../pages/login/login.component';
import {RouterModule} from '@angular/router';
import {LayoutComponent} from '../layout/layout.component';
import {DashboardComponent} from '../pages/dashboard/dashboard.component';
import {ChartComponent} from '../pages/chart/chart.component';
import {RepoComponent} from '../pages/repo/repo.component';
import {PluginComponent} from '../pages/plugin/plugin.component';
import {SearchComponent} from '../pages/chart/search/search.component';


const routers = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'chart/list',
        component: ChartComponent
      },
      {
        path: 'chart/search',
        component: SearchComponent
      },
      {
        path: 'repo/list',
        component: RepoComponent
      },
      {
        path: 'plugin/list',
        component: PluginComponent
      },
    ]
  },
  {
    path: 'login',
    component: LoginComponent,
  }
];


@NgModule({
  imports: [
    RouterModule.forRoot(routers)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
