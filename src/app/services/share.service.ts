import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ShareService {
  private sub = new Subject();
  private toggleSidemenu = new BehaviorSubject(false);
  subj$ = this.sub.asObservable();
  toggleSidemenu$ = this.toggleSidemenu.asObservable();
  
  constructor() { }
  setSidemenu(value : boolean){
    this.toggleSidemenu.next(value);
  }
}
