import { Component, Input, OnInit } from '@angular/core';
import { TodoService } from './todo.service';
import { Todo } from './todo';
import { TodoFilter } from './todofilter';

import { NgForm } from '@angular/forms';


@Component({
  selector: 'todo-list',
  templateUrl: './todo-list.component.html',
   styleUrls: ['./todo-list.component.scss']
})

export class TodoListComponent implements OnInit {
  fromDate: Date;
  toDate: Date;
  completedCount: number =0;

  todos: Todo[];
  todoFilter: TodoFilter = new TodoFilter();
  newTodo: Todo = new Todo();
  editing: boolean = false;
  editingTodo: Todo = new Todo();
  constructor(
    private todoService: TodoService,
  ) { }

  ngOnInit(): void {
    this.getTodos();
     
  }


  getTodos(): void {
    this.todoService.getTodos()
      .then(todos => {
        this.todos = todos;
        this.calculateCompletion();
      });
  }

  getTodosWithFilter(todoFilter): void {
    this.todoService.getTodosWithFilter(todoFilter)
      .then(todos => {
        this.todos = todos;
        this.calculateCompletion();
      });
  }

  createTodo(todoForm: NgForm): void {
    this.todoService.createTodo(this.newTodo)
      .then(createTodo => {
        todoForm.reset();
        this.newTodo = new Todo();
        this.todos.unshift(createTodo)
      });
  }

  deleteTodo(id: string): void {
    this.todoService.deleteTodo(id)
      .then(() => {
        this.todos = this.todos.filter(todo => todo.id != id);
      });
  }

  updateTodo(todoData: Todo): void {
    console.log(todoData);
    this.todoService.updateTodo(todoData)
      .then(updatedTodo => {
        let existingTodo = this.todos.find(todo => todo.id === updatedTodo.id);
        this.completedCount = 0;
        Object.assign(existingTodo, updatedTodo);
        this.clearEditing();
      });

  }

  toggleCompleted(todoData: Todo): void {
    todoData.completed = !todoData.completed;
    this.todoService.updateTodo(todoData)
      .then(updatedTodo => {
        let existingTodo = this.todos.find(todo => todo.id === updatedTodo.id);
        Object.assign(existingTodo, updatedTodo);
        this.calculateCompletion();
      });
  }
  calculateCompletion(){
    this.completedCount= 0;
     this.todos.forEach(item => {
          if (item.completed) {
            this.completedCount = this.completedCount + 1
          }
        });
  }

  editTodo(todoData: Todo): void {
    this.editing = true;
    Object.assign(this.editingTodo, todoData);
  }

  clearEditing(): void {
    this.editingTodo = new Todo();
    this.editing = false;
  }

}