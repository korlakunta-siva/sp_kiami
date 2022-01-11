import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiModule } from '../../../../../ui/ui.module';
import { DialogKiamiInitialSetupComponent } from './dialog-kiami-initial-setup.component';

@NgModule({
  imports: [CommonModule, UiModule],
  declarations: [DialogKiamiInitialSetupComponent],
  exports: [],
})
export class DialogKiamiInitialSetupModule {}
