import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Task, TaskWithAllData } from '../task.model';
import { TaskState } from './task.reducer';

export enum TaskActionTypes {
  LoadState = '[Task] Load Task State',
  SetCurrentTask = '[Task] SetCurrentTask',
  UnsetCurrentTask = '[Task] UnsetCurrentTask',

  // Task Actions
  LoadTasks = '[Task] Load Tasks',
  AddTask = '[Task] Add Task',
  AddTaskWithIssue = '[Task] Add Task with Issue',
  AddTasks = '[Task] Add Tasks',
  UpdateTask = '[Task] Update Task',
  UpdateTasks = '[Task] Update Tasks',
  DeleteTask = '[Task] Delete Task',
  DeleteTasks = '[Task] Delete Tasks',
  ClearTasks = '[Task] Clear Tasks',
  MoveAfter = '[Task] Move After',

  // Sub Task Actions
  AddSubTask = '[Task] Add SubTask',
}

export class LoadState implements Action {
  readonly type = TaskActionTypes.LoadState;

  constructor(public payload: { state: TaskState }) {
  }
}

export class SetCurrentTask implements Action {
  readonly type = TaskActionTypes.SetCurrentTask;

  constructor(public payload: any) {
  }
}

export class UnsetCurrentTask implements Action {
  readonly type = TaskActionTypes.UnsetCurrentTask;
}

export class LoadTasks implements Action {
  readonly type = TaskActionTypes.LoadTasks;

  constructor(public payload: { tasks: Task[] }) {
  }
}

export class AddTask implements Action {
  readonly type = TaskActionTypes.AddTask;

  constructor(public payload: { task: Task }) {
  }
}

export class AddTaskWithIssue implements Action {
  readonly type = TaskActionTypes.AddTaskWithIssue;

  constructor(public payload: { task: TaskWithAllData }) {
  }
}

export class AddTasks implements Action {
  readonly type = TaskActionTypes.AddTasks;

  constructor(public payload: { tasks: Task[] }) {
  }
}

export class UpdateTask implements Action {
  readonly type = TaskActionTypes.UpdateTask;

  constructor(public payload: { task: Update<Task> }) {
  }
}

export class UpdateTasks implements Action {
  readonly type = TaskActionTypes.UpdateTasks;

  constructor(public payload: { tasks: Update<Task>[] }) {
  }
}

export class DeleteTask implements Action {
  readonly type = TaskActionTypes.DeleteTask;

  constructor(public payload: { id: string }) {
  }
}

export class DeleteTasks implements Action {
  readonly type = TaskActionTypes.DeleteTasks;

  constructor(public payload: { ids: string[] }) {
  }
}

export class ClearTasks implements Action {
  readonly type = TaskActionTypes.ClearTasks;
}

export class MoveAfter implements Action {
  readonly type = TaskActionTypes.MoveAfter;

  constructor(public payload: { taskId: string, targetItemId }) {
  }
}

export class AddSubTask implements Action {
  readonly type = TaskActionTypes.AddSubTask;

  constructor(public payload: { task: Task, parentId: string }) {
  }
}

export type TaskActions
  = LoadTasks
  | LoadState
  | SetCurrentTask
  | UnsetCurrentTask
  | AddTask
  | AddTaskWithIssue
  | AddTasks
  | UpdateTask
  | UpdateTasks
  | DeleteTask
  | DeleteTasks
  | ClearTasks
  | MoveAfter
  | AddSubTask;

