import { BaseIssueProviderCfg } from '../../issue.model';

export interface KiamiCfg extends BaseIssueProviderCfg {
  isSearchIssuesFromKiami: boolean;
  isAutoAddToBacklog: boolean;
  isAutoPoll: boolean;
  filterUsername: string | null;
  kiamiBaseUrl: string | null | undefined;
  source: string | null;
  project: string | null;
  token: string | null;
  scope: string | null;
}
