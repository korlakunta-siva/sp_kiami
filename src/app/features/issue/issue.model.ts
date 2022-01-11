import {
  JiraIssue,
  JiraIssueReduced,
} from './providers/jira/jira-issue/jira-issue.model';
import { JiraCfg } from './providers/jira/jira.model';
import { GithubCfg } from './providers/github/github.model';
import {
  GithubIssue,
  GithubIssueReduced,
} from './providers/github/github-issue/github-issue.model';

import { GitlabCfg } from './providers/gitlab/gitlab';
import { GitlabIssue } from './providers/gitlab/gitlab-issue/gitlab-issue.model';

import { KiamiCfg as KiamiCfg } from './providers/kiami/kiami';
import { KiamiIssue as KiamiIssue } from './providers/kiami/kiami-issue/kiami-issue.model';

import {
  CaldavIssue,
  CaldavIssueReduced,
} from './providers/caldav/caldav-issue/caldav-issue.model';
import { CaldavCfg } from './providers/caldav/caldav.model';
import { OpenProjectCfg } from './providers/open-project/open-project.model';
import {
  OpenProjectWorkPackage,
  OpenProjectWorkPackageReduced,
} from './providers/open-project/open-project-issue/open-project-issue.model';

export interface BaseIssueProviderCfg {
  isEnabled: boolean;
}

export type IssueProviderKey = 'JIRA' | 'GITHUB' | 'GITLAB' | 'KIAMI' | 'CALDAV' | 'OPEN_PROJECT';
export type IssueIntegrationCfg =
  | JiraCfg
  | GithubCfg
  | GitlabCfg
  | KiamiCfg
  | CaldavCfg
  | OpenProjectCfg;

export enum IssueLocalState {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export interface IssueIntegrationCfgs {
  // should be the same as key IssueProviderKey
  JIRA?: JiraCfg;
  GITHUB?: GithubCfg;
  GITLAB?: GitlabCfg;
  KIAMI?: KiamiCfg;
  CALDAV?: CaldavCfg;
  OPEN_PROJECT?: OpenProjectCfg;
}

export type IssueData =
  | JiraIssue
  | GithubIssue
  | GitlabIssue
  | KiamiIssue
  | CaldavIssue
  | OpenProjectWorkPackage;

export type IssueDataReduced =
  | GithubIssueReduced
  | JiraIssueReduced
  | GitlabIssue
  | KiamiIssue
  | OpenProjectWorkPackageReduced
  | CaldavIssueReduced;

export interface SearchResultItem {
  title: string;
  issueType: IssueProviderKey;
  issueData: IssueDataReduced;
  titleHighlighted?: string;
}
