import { Injectable } from '@angular/core';
import { Settings } from './app.settings.model';

@Injectable()
export class AppSettings {
    public settings = new Settings(
        'CK',
        'Angular Admin Template with Bootstrap 4',
        {
            menu: 'horizontal', //horizontal , vertical
            menuType: 'default', //default, compact, mini
            showMenu: true,
            navbarIsFixed: true,
            footerIsFixed: true,
            sidebarIsFixed: true,
            showSideChat: false,
            sideChatIsHoverable: true,
            skin: 'dark'  //light , dark, blue, green, combined, purple, orange, brown, grey, pink          
        }
    )
}