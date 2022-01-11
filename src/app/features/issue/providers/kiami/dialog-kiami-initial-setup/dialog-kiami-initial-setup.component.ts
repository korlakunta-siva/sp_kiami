import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { T } from 'src/app/t.const';
import { GitlabCfg } from '../kiami';
import { DEFAULT_KIAMI_CFG, KIAMI_CONFIG_FORM } from '../kiami.const';

@Component({
  selector: 'dialog-kiami-initial-setup',
  templateUrl: './dialog-gitlab-initial-setup.component.html',
  styleUrls: ['./dialog-gitlab-initial-setup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogKiamiInitialSetupComponent {
  T: typeof T = T;
  kiamiCfg: KiamiCfg;
  formGroup: FormGroup = new FormGroup({});
  formConfig: FormlyFieldConfig[] = KIAMI_CONFIG_FORM;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _matDialogRef: MatDialogRef<DialogKiamiInitialSetupComponent>,
  ) {
    this.kiamiCfg = this.data.kiamiCfg || DEFAULT_KIAMI_CFG;
  }

  saveGitlabCfg(kiamiCfg: KiamiCfg): void {
    this._matDialogRef.close(kiamiCfg);
  }

  close(): void {
    this._matDialogRef.close();
  }
}
