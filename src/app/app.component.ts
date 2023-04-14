import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BnNgIdleService } from 'bn-ng-idle';
import { AppSettings } from './app.settings';
import { Settings } from './app.settings.model';
import { GvarService } from './services/gvar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
    public settings: Settings;
    constructor(
      public appSettings:AppSettings,   
      private bnIdle: BnNgIdleService,
      private router:Router,
      public translate: TranslateService, 
      public GV: GvarService){
      this.settings = this.appSettings.settings; 
      translate.addLangs(['en','de','fr','ru','tr']);
      translate.setDefaultLang('en'); 
      translate.use('en'); 
    }    

    ngOnInit(): void {
      this.bnIdle.startWatching(1800).subscribe((res) => {
        if(res) {
          this.router.navigate(['/login']);
        }
      })
    }
}
