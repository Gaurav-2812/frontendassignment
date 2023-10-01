import { Component, HostListener, ViewChild } from '@angular/core';
import { Task } from 'src/app/model/task';
import { CrudService } from 'src/app/service/crud.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  @ViewChild('taskInput') taskInput: any;
  @ViewChild('descriptionInput') descriptionInput: any;
  @ViewChild('dueDateInput') dueDateInput: any;
  taskObj: Task = new Task();
  completedTaskArr: Task[] = [];
  incompleteTaskArr: Task[] = [];

  addTaskValue: string = '';
  addTaskDescription: string = '';
  addDueDate: Date | null = null;
  editTaskValue: string = '';
  editTaskDescription: string = '';
  editDueDate: Date | null = null;
  showIncompleteTasks: boolean = true;
    showCompleteTasks: boolean = true;

    // Toggle visibility of incomplete tasks section
    toggleTasksVisibility() {
        this.showIncompleteTasks = !this.showIncompleteTasks;
    }

    // Toggle visibility of complete tasks section
    toggleCompletedTasksVisibility() {
        this.showCompleteTasks = !this.showCompleteTasks;
    }

  constructor(private crudService: CrudService) { }
  isSmallScreen = false; // Initialize it to false

  // Define a function to check screen width and set isSmallScreen accordingly
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.isSmallScreen = window.innerWidth <= 767; // Adjust the width as needed
  }
  ngOnInit(): void {
    this.addTaskDescription = '';
    this.editTaskDescription = '';
    this.addDueDate = null;
    this.editDueDate = null;
    this.editTaskValue = '';
    this.addTaskValue = '';
    this.taskObj = new Task();
    this.getCompletedTasks();
    this.getIncompleteTasks();
    this.incompleteTaskArr.forEach(task => {
      task.showDetails = false; // Initialize showDetails property to false for each incomplete task
    });
    this.completedTaskArr.forEach(task => {
      task.showDetails = false; // Initialize showDetails property to false for each completed task
    });
  }
  toggleTaskDetails(task: Task) {
    task.showDetails = !task.showDetails;
  }

  addTask() {
    this.taskObj.title = this.addTaskValue;
    this.taskObj.description = this.addTaskDescription;
    this.taskObj.dueDate = this.addDueDate;
    this.crudService.addTask(this.taskObj).subscribe(res => {
      this.ngOnInit();
      this.addTaskValue = '';
      this.addDueDate = null;
      this.addTaskDescription = '';
    }, err => {
      alert(err);
    })
  }

  editTask() {
    this.taskObj.title = this.editTaskValue;
    this.taskObj.description = this.editTaskDescription;
    this.taskObj.dueDate = this.editDueDate;
    this.crudService.editTask(this.taskObj).subscribe(res => {
      this.ngOnInit();
    }, err => {
      alert("Failed to update task");
    })
  }

  deleteTask(etask: Task) {
    this.crudService.deleteTask(etask).subscribe(res => {
      this.ngOnInit();
    }, err => {
      alert("Failed to delete task")
    })
  }

  call(etask: Task) {
    this.taskObj = etask;
    this.editTaskValue = etask.title;
  }

  completeTask(etask: Task) {
    this.crudService.completeTask(etask).subscribe(res => {
      // Update the local arrays based on the response from the server
      this.completedTaskArr.push(etask); // Add the completed task to the completed tasks array
      this.incompleteTaskArr = this.incompleteTaskArr.filter(t => t !== etask); // Remove the task from the incomplete tasks array
      etask.status = true; // Update the task status locally
    }, err => {
      alert("Failed to mark task as completed");
    });
  }
  
  incompleteTask(etask: Task) {
    this.crudService.incompleteTask(etask).subscribe(res => {
      // Update the local arrays based on the response from the server
      this.incompleteTaskArr.push(etask); // Add the incomplete task to the incomplete tasks array
      this.completedTaskArr = this.completedTaskArr.filter(t => t !== etask); // Remove the task from the completed tasks array
      etask.status = false; // Update the task status locally
    }, err => {
      alert("Failed to mark task as incomplete");
    });
  }
  

  getCompletedTasks() {
    this.crudService.getCompletedTasks().subscribe(res => {
      this.completedTaskArr = res;
    }, err => {
      alert("Unable to get completed tasks");
    });
  }

  getIncompleteTasks() {
    this.crudService.getIncompleteTasks().subscribe(res => {
      this.incompleteTaskArr = res;
    }, err => {
      alert("Unable to get incomplete tasks");
    });
  }
}