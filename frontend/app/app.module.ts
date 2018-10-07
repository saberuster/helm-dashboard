import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {LoginComponent} from './pages/login/login.component';
import {AppRoutingModule} from './router/app-routing.module';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgZorroAntdModule, NZ_I18N, zh_CN} from 'ng-zorro-antd';
/** 配置 angular i18n **/
import {CommonModule, registerLocaleData} from '@angular/common';
import zh from '@angular/common/locales/zh';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {RepoComponent} from './pages/repo/repo.component';
import {ChartComponent} from './pages/chart/chart.component';
import {PluginComponent} from './pages/plugin/plugin.component';
import {LayoutComponent} from './layout/layout.component';
import {SiderComponent} from './layout/sider/sider.component';
import { SearchComponent } from './pages/chart/search/search.component';

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    RepoComponent,
    ChartComponent,
    PluginComponent,
    LayoutComponent,
    SiderComponent,
    SearchComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgZorroAntdModule
  ],
  bootstrap: [AppComponent],
  /** 配置 ng-zorro-antd 国际化 **/
  providers: [{provide: NZ_I18N, useValue: zh_CN}],
})
export class AppModule {
}
