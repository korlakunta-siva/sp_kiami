import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { T } from 'src/app/t.const';
import { TaskWithSubTasks } from 'src/app/features/tasks/task.model';

@Component({
  selector: 'kiami-issue-header',
  templateUrl: './kiami-issue-header.component.html',
  styleUrls: ['./kiami-issue-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KiamiIssueHeaderComponent {
  T: typeof T = T;
  @Input() public task?: TaskWithSubTasks;

  constructor() {}
}
