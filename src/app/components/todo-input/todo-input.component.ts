import { Component, OnInit } from '@angular/core';
import { ToDoService } from 'src/app/services/to-do.service';

@Component({
  selector: 'app-todo-input',
  templateUrl: './todo-input.component.html',
  styleUrls: ['./todo-input.component.scss']
})
export class TodoInputComponent implements OnInit {
  todoContent = '';
  constructor(private todoService: ToDoService) { }

  ngOnInit() {
  }
  onSubmit() {
    if ( this.todoContent.trim() === '' ) {
      return false;
    }
    this.todoService.addTodo(this.todoContent);
    this.todoContent = '';
  }
}
