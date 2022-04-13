import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppService } from '../app.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private appService: AppService) {}

  title = 'angular-nodejs-example';

  todoForm = new FormGroup({
    task: new FormControl('', Validators.required),
    assignee: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required)
  });

  tasks: any = [];
  settings: any;

  destroy$: Subject<boolean> = new Subject<boolean>();

  onSubmit() {
    console.log(this.todoForm.value);
    this.appService.addTask(this.todoForm.value).pipe(takeUntil(this.destroy$)).subscribe(data => {
      console.log('message::::', data);
      this.getTasks();
      this.todoForm.reset();
    });
  }

  deleteTask(taskid: number) {
    console.log('deleting this task:::', taskid);
    this.appService.deleteTask(taskid).pipe(takeUntil(this.destroy$)).subscribe(data => {
      console.log('message::::', data);
      this.getTasks();
    });
  }

  editTask(task: any) {
    console.log('editing this task:::', task);
    this.appService.editTask(task).pipe(takeUntil(this.destroy$)).subscribe(data => {
      console.log('message::::', data);
      this.getTasks();
    });
  }

  getTasks() {
    this.appService.getTasks().pipe(takeUntil(this.destroy$)).subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  ngOnInit() {
    this.getTasks();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}