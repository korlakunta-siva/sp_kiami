import {
  KiamiOriginalComment,
  KiamiOriginalIssueState,
  KiamiOriginalMilestone,
  KiamiOriginalUser,
} from '../kiami-api/kiami-api-responses';

export type KiamiState = KiamiOriginalIssueState;
export type KiamiUser = KiamiOriginalUser;
export type KiamiComment = KiamiOriginalComment;

export type KiamiIssue = Readonly<{
  // repository_url: string;
  // labels_url: string;
  // comments_url: string;
  // events_url: string;
  html_url: string;
  // eslint-disable-next-line id-blacklist
  number: number;
  state: KiamiState;
  title: string;
  body: string;
  user: KiamiUser;
  labels: string[];
  assignee: KiamiUser;
  milestone: KiamiOriginalMilestone;
  // locked: boolean;
  // active_lock_reason: string;
  // pull_request: KiamiPullRequest;
  closed_at: string;
  created_at: string;
  updated_at: string;

  // added
  wasUpdated: boolean;
  commentsNr: number;
  // apiUrl: string;
  _id: number;

  // transformed
  comments: KiamiComment[];
  url: string;
  // NOTE: the old version used the issue number as id
  // the new version uses the real id ("project#iid")
  id: number | string;
  project: string;

  // according to the docs: "Users on GitLab Starter, Bronze, or higher will also see the weight parameter"
  weight?: number;
}>;
