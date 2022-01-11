import { KiamiIssue } from './kiami-issue.model';
import { KiamiOriginalIssue } from '../kiami-api/kiami-api-responses';
import { IssueProviderKey, SearchResultItem } from '../../../issue.model';
import { KiamiCfg } from '../kiami';
import { KiamiApiService } from '../kiami-api/kiami-api.service';

export const mapKiamiIssue = (issue: KiamiOriginalIssue, cfg: KiamiCfg): KiamiIssue => {
  return {
    html_url: issue.web_url,
    // eslint-disable-next-line id-blacklist
    number: issue.iid,
    state: issue.state,
    title: issue.title,
    body: issue.description,
    user: issue.author,
    labels: issue.labels,
    assignee: issue.assignee,
    milestone: issue.milestone as any,
    closed_at: issue.closed_at,
    created_at: issue.created_at,
    updated_at: issue.updated_at,

    // added
    wasUpdated: false,
    commentsNr: issue.user_notes_count,
    _id: issue.id,

    // transformed
    comments: [],
    url: issue.web_url,
    // NOTE: we use the issue number as id as well, as it there is not much to be done with the id with the api
    // when we can get issues from multiple projects we use full refence as id
    id: issue.references.full,
    project: KiamiApiService.getPartsFromIssue(issue.references.full)[0],
  };
};

export const mapKiamiIssueToSearchResult = (issue: KiamiIssue): SearchResultItem => {
  return {
    title: '#' + issue.id + ' ' + issue.title,
    issueType: 'KIAMI' as IssueProviderKey,
    issueData: issue,
  };
};
