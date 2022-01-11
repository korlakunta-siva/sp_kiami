// TODO use as a checklist
import { KiamiCfg } from './kiami';
import { T } from '../../../../t.const';
import {
  ConfigFormSection,
  LimitedFormlyFieldConfig,
} from '../../../config/global-config.model';
import { GITHUB_INITIAL_POLL_DELAY  } from '../github/github.const';

export const DEFAULT_KIAMI_CFG: KiamiCfg = {
  isEnabled: false,
  project: null,
  kiamiBaseUrl: null,
  token: null,
  isSearchIssuesFromKiami: false,
  isAutoPoll: false,
  isAutoAddToBacklog: false,
  filterUsername: null,
  scope: 'created-by-me',
  source: 'project',
};

// NOTE: we need a high limit because git has low usage limits :(
export const KIAMI_MAX_CACHE_AGE = 10 * 1000;
export const KIAMI_POLL_INTERVAL = KIAMI_MAX_CACHE_AGE;
export const KIAMI_INITIAL_POLL_DELAY = 0 + 8000;

// export const KIAMI_POLL_INTERVAL = 15 * 1000;
export const KIAMI_BASE_URL = 'https://time.andnow.io/';

export const KIAMI_API_BASE_URL = `${KIAMI_BASE_URL}api/v4`;

export const KIAMI_PROJECT_REGEX = /(^[1-9][0-9]*$)|((\/|%2F|\w-?|\.-?)+$)/i;

export const KIAMI_CONFIG_FORM: LimitedFormlyFieldConfig<KiamiCfg>[] = [
  {
    key: 'project',
    type: 'input',
    hideExpression: (model: any) => !model.isEnabled,
    templateOptions: {
      required: true,
      label: T.F.KIAMI.FORM.PROJECT,
      type: 'text',
      pattern: KIAMI_PROJECT_REGEX,
    },
  },
  {
    key: 'token',
    type: 'input',
    hideExpression: (model: any) => !model.isEnabled,
    templateOptions: {
      label: T.F.KIAMI.FORM.TOKEN,
      type: 'password',
    },
    validation: {
      show: true,
    },
    expressionProperties: {
      // !! is used to get the associated boolean value of a non boolean value
      // It's not a fancy trick using model.project alone gets the required case right but won't remove it
      // if the project field is empty so this is needed for the wanted behavior
      'templateOptions.required': '!!model.project',
    },
  },
  {
    key: 'source',
    type: 'select',
    defaultValue: 'project',
    hideExpression: (model: any) => !model.isEnabled,
    templateOptions: {
      required: true,
      label: T.F.KIAMI.FORM.SOURCE,
      options: [
        { value: 'project', label: T.F.KIAMI.FORM.SOURCE_PROJECT },
        { value: 'group', label: T.F.KIAMI.FORM.SOURCE_GROUP },
        { value: 'global', label: T.F.KIAMI.FORM.SOURCE_GLOBAL },
      ],
    },
  },
  {
    key: 'scope',
    type: 'select',
    defaultValue: 'created-by-me',
    hideExpression: (model: any) => !model.isEnabled,
    templateOptions: {
      required: true,
      label: T.F.KIAMI.FORM.SCOPE,
      options: [
        { value: 'all', label: T.F.KIAMI.FORM.SCOPE_ALL },
        { value: 'created-by-me', label: T.F.KIAMI.FORM.SCOPE_CREATED },
        { value: 'assigned-to-me', label: T.F.KIAMI.FORM.SCOPE_ASSIGNED },
      ],
    },
  },
  {
    key: 'kiamiBaseUrl',
    type: 'input',
    hideExpression: (model: any) => !model.isEnabled,
    templateOptions: {
      label: T.F.KIAMI.FORM.KIAMI_BASE_URL,
      type: 'text',
      pattern:
        /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/,
    },
  },
  {
    key: 'isSearchIssuesFromKiami',
    type: 'checkbox',
    hideExpression: (model: any) => !model.isEnabled,
    templateOptions: {
      label: T.F.KIAMI.FORM.IS_SEARCH_ISSUES_FROM_KIAMI,
    },
  },
  {
    key: 'isAutoPoll',
    type: 'checkbox',
    hideExpression: (model: any) => !model.isEnabled,
    templateOptions: {
      label: T.F.KIAMI.FORM.IS_AUTO_POLL,
    },
  },
  {
    key: 'isAutoAddToBacklog',
    type: 'checkbox',
    hideExpression: (model: any) => !model.isEnabled,
    templateOptions: {
      label: T.F.KIAMI.FORM.IS_AUTO_ADD_TO_BACKLOG,
    },
  },
  {
    key: 'filterUsername',
    type: 'input',
    hideExpression: (model: any) => !model.isEnabled,
    templateOptions: {
      label: T.F.KIAMI.FORM.FILTER_USER,
    },
  },
];

export const KIAMI_CONFIG_FORM_SECTION: ConfigFormSection<KiamiCfg> = {
  title: 'Kiami',
  key: 'KIAMI',
  items: KIAMI_CONFIG_FORM,
  help: T.F.KIAMI.FORM_SECTION.HELP,
};
