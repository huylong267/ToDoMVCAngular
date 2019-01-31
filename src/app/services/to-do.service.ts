import { Injectable } from '@angular/core';
import { Todo } from '../models/todo.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { Filter } from '../models/filtering.model';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ToDoService {
  private static readonly TodoStorageKey = 'todos';
  private todos: Todo[];
  private filteredTodos:  Todo[];
  private lenghtSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private displayTodoSubject: BehaviorSubject<Todo[]> = new BehaviorSubject<Todo[]>([]);
  private currentFilter: Filter = Filter.All;
  todos$: Observable<Todo[]> = this.displayTodoSubject.asObservable();
  length$: Observable<number> = this.lenghtSubject.asObservable();

  constructor(private storageService: LocalStorageService) { }
  fetchFromLocalStorage() {
    this.todos = this.storageService.getValue<Todo[]>(ToDoService.TodoStorageKey) || [];
    this.filteredTodos = [...this.todos];
    this.updateTodoData();
  }



  updateTodoLocalStorage() {
    this.storageService.setObject(ToDoService.TodoStorageKey, this.todos);
    this.filterTodos(this.currentFilter, false);
    this.updateTodoData();

  }

   filterTodos(filter: Filter, isFiltering: boolean= true) {
    this.currentFilter = filter;
    switch (filter) {
      case Filter.Active:
        this.filteredTodos = this.todos.filter(todo => !todo.isCompleted);
        break;
      case Filter.Completed:
        this.filteredTodos = this.todos.filter(todo =>  todo.isCompleted);
        break;
      case Filter.All:
        this.filteredTodos =  [...this.todos];
        break;
    }
      if (isFiltering) {
        this.updateTodoData();
      }
  }

  addTodo(content: string) {
    const date = new Date(Date.now()).getTime();
    const newTodo  = new Todo (date, content, false);
    this.todos.unshift(newTodo);
    this.updateTodoLocalStorage();
  }

  changeTodoStatus(id: number, isCompleted: boolean) {
    const index = this.todos.findIndex(t => t.id === id);
    const todo  = this.todos[index];
    todo.isCompleted = isCompleted;
    this.todos.splice(index, 1, todo);
    this.updateTodoLocalStorage();
  }

  private updateTodoData() {
    this.displayTodoSubject.next(this.filteredTodos);
    this.lenghtSubject.next(this.todos.length);
  }

  editTodo(id: number , content: string) {
    const index = this.todos.findIndex(t => t.id === id);
    const todo  = this.todos[index];
    todo.content = content;
    this.todos.splice(index, 1 , todo);
    this.updateTodoLocalStorage();
  }
  deleteTodo(id: number) {
    const index = this.todos.findIndex(t => t.id === id);
    this.todos.splice(index, 1);
    this.updateTodoLocalStorage();
  }
  toggleAll() {
    this.todos = this.todos.map(todo => {
      return {
        ...todo,
        isCompleted: !this.todos.every(t => t.isCompleted)
      };
    });
    this.updateTodoLocalStorage();
  }

  clearCompleted() {
    this.todos = this.todos.filter(todo => !todo.isCompleted);
    this.updateTodoLocalStorage();
  }
}
