import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TaskWithSubTasks } from '../../../../../tasks/task.model';
import { KiamiIssue } from '../kiami-issue.model';
import { expandAnimation } from '../../../../../../ui/animations/expand.ani';
import { T } from '../../../../../../t.const';
import { TaskService } from '../../../../../tasks/task.service';

@Component({
  selector: 'kiami-issue-content',
  templateUrl: './kiami-issue-content.component.html',
  styleUrls: ['./kiami-issue-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [expandAnimation],
})
export class KiamiIssueContentComponent {
  @Input() issue?: KiamiIssue;
  @Input() task?: TaskWithSubTasks;

  T: typeof T = T;

  constructor(private readonly _taskService: TaskService) {}

  hideUpdates(): void {
    if (!this.task) {
      throw new Error('No task');
    }
    if (!this.issue) {
      throw new Error('No issue');
    }
    this._taskService.markIssueUpdatesAsRead(this.task.id);
  }

  trackByIndex(i: number, p: any): number {
    return i;
  }
}
