import { Component, OnInit } from '@angular/core';
import { ToDoService } from './services/to-do.service';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  hasTodo$: Observable<boolean>;
  constructor(private todoService: ToDoService) {}
  ngOnInit() {
    this.todoService.fetchFromLocalStorage();
    this.hasTodo$ = this.todoService.length$.pipe(map(length => length > 0 )) ;
  }

}
