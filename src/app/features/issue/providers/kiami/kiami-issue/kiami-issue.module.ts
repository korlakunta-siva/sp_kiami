import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KiamiIssueHeaderComponent } from './kiami-issue-header/kiami-issue-header.component';
import { KiamiIssueContentComponent } from './kiami-issue-content/kiami-issue-content.component';
import { UiModule } from 'src/app/ui/ui.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [KiamiIssueHeaderComponent, KiamiIssueContentComponent],
  imports: [CommonModule, UiModule, FormsModule, ReactiveFormsModule],
  exports: [KiamiIssueHeaderComponent, KiamiIssueContentComponent],
})
export class KiamiIssueModule {}
