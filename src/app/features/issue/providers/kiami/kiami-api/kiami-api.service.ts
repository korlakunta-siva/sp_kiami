import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { EMPTY, forkJoin, Observable, ObservableInput, of, throwError } from 'rxjs';
import { SnackService } from 'src/app/core/snack/snack.service';

import { KiamiCfg } from '../kiami';
import { KiamiOriginalComment, KiamiOriginalIssue } from './kiami-api-responses';
import { HANDLED_ERROR_PROP_STR } from 'src/app/app.constants';
import { KIAMI_API_BASE_URL, KIAMI_PROJECT_REGEX } from '../kiami.const';
import { T } from 'src/app/t.const';
import { catchError, filter, map, mergeMap, take } from 'rxjs/operators';
import { KiamiIssue } from '../kiami-issue/kiami-issue.model';
import {
  mapKiamiIssue,
  mapKiamiIssueToSearchResult,
} from '../kiami-issue/kiami-issue-map.util';
import { SearchResultItem } from '../../../issue.model';
import { KIAMI_TYPE, ISSUE_PROVIDER_HUMANIZED } from '../../../issue.const';

@Injectable({
  providedIn: 'root',
})
export class KiamiApiService {
  constructor(private _snackService: SnackService, private _http: HttpClient) {}

  getById$(id: string, cfg: KiamiCfg): Observable<KiamiIssue> {
    return this._sendRequest$(
      {
        url: this._issueApiLink(cfg, id),
      },
      cfg,
    ).pipe(
      mergeMap((issue: KiamiOriginalIssue) => {
        return this.getIssueWithComments$(mapKiamiIssue(issue, cfg), cfg);
      }),
    );
  }

  private getScopeParam(cfg: KiamiCfg): string {
    if (cfg.scope) {
      return `&scope=${cfg.scope}`;
    } else {
      return '';
    }
  }

  getByIds$(
    project: string,
    ids: string[] | number[],
    cfg: KiamiCfg,
  ): Observable<KiamiIssue[]> {
    const iids = ids.map((id) => {
      return this._getIidFromIssue(id);
    });
    const queryParams = 'iids[]=' + iids.join('&iids[]=');

    return this._sendRequest$(
      {
        url: `${this._apiLink(cfg, project)}/issues?${queryParams}${this.getScopeParam(
          cfg,
        )}&per_page=100`,
      },
      cfg,
    ).pipe(
      map((issues: KiamiOriginalIssue[]) => {
        return issues ? issues.map((issue) => mapKiamiIssue(issue, cfg)) : [];
      }),
      mergeMap((issues: KiamiIssue[]) => {
        if (issues && issues.length) {
          return forkJoin([
            ...issues.map((issue) => this.getIssueWithComments$(issue, cfg)),
          ]);
        } else {
          return of([]);
        }
      }),
    );
  }

  getIssueWithComments$(issue: KiamiIssue, cfg: KiamiCfg): Observable<KiamiIssue> {
    return this._getIssueComments$(issue.id, 1, cfg).pipe(
      map((comments) => {
        return {
          ...issue,
          comments,
          commentsNr: comments.length,
        };
      }),
    );
  }

  searchIssueInProject$(
    searchText: string,
    cfg: KiamiCfg,
  ): Observable<SearchResultItem[]> {
    if (!this._isValidSettings(cfg)) {
      return EMPTY;
    }
    return this._sendRequest$(
      {
        url: `${this._apiLink(cfg)}/issues?search=${searchText}${this.getScopeParam(
          cfg,
        )}&order_by=updated_at`,
      },
      cfg,
    ).pipe(
      map((issues: KiamiOriginalIssue[]) => {
        return issues ? issues.map((issue) => mapKiamiIssue(issue, cfg)) : [];
      }),
      mergeMap((issues: KiamiIssue[]) => {
        if (issues && issues.length) {
          return forkJoin([
            ...issues.map((issue) => this.getIssueWithComments$(issue, cfg)),
          ]);
        } else {
          return of([]);
        }
      }),
      map((issues: KiamiIssue[]) => {
        return issues ? issues.map(mapKiamiIssueToSearchResult) : [];
      }),
    );
  }

  // getProjectIssuesWithComments$(cfg: KiamiCfg): Observable<KiamiIssue[]> {
  //   if (!this._isValidSettings(cfg)) {
  //     return EMPTY;
  //   }
  //   return this._getProjectIssues$(1, cfg).pipe(
  //     mergeMap((issues: KiamiIssue[]) => {
  //       if (issues && issues.length) {
  //         return forkJoin([
  //           ...issues.map((issue) => this.getIssueWithComments$(issue, cfg)),
  //         ]);
  //       } else {
  //         return of([]);
  //       }
  //     }),
  //   );
  // }

  getProjectIssues$(pageNumber: number, cfg: KiamiCfg): Observable<KiamiIssue[]> {
    return this._sendRequest$(
      {
        url: `${this._apiLink(
          cfg,
        )}/issues?state=opened&order_by=updated_at&per_page=100${this.getScopeParam(
          cfg,
        )}&page=${pageNumber}`,
      },
      cfg,
    ).pipe(
      take(1),
      map((issues: KiamiOriginalIssue[]) => {
        return issues ? issues.map((issue) => mapKiamiIssue(issue, cfg)) : [];
      }),
    );
  }

  getFullIssueRef$(issue: string | number, projectConfig: KiamiCfg): string {
    if (KiamiApiService.getPartsFromIssue(issue).length === 2) {
      return issue.toString();
    } else {
      return this.getProject$(projectConfig, issue) + '#' + this._getIidFromIssue(issue);
    }
  }

  getProject$(projectConfig: KiamiCfg, issue?: string | number | undefined): string {
    if (issue) {
      const parts: string[] = KiamiApiService.getPartsFromIssue(issue);
      if (parts.length === 2) {
        return parts[0];
      }
    }

    const projectURL: string = projectConfig.project ? projectConfig.project : '';

    const projectPath = projectURL.match(KIAMI_PROJECT_REGEX);
    if (!projectPath) {
      throwError('Kiami Project URL');
    }
    return projectURL;
  }

  private _getIidFromIssue(issue: string | number): string {
    const parts: string[] = KiamiApiService.getPartsFromIssue(issue);
    if (parts.length === 2) {
      return parts[1];
    } else {
      return parts[0];
    }
  }

  public static getPartsFromIssue(issue: string | number): string[] {
    if (typeof issue === 'string') {
      return issue.split('#');
    } else {
      return [issue.toString()];
    }
  }

  private _getIssueComments$(
    issueid: number | string,
    pageNumber: number,
    cfg: KiamiCfg,
  ): Observable<KiamiOriginalComment[]> {
    if (!this._isValidSettings(cfg)) {
      return EMPTY;
    }
    return this._sendRequest$(
      {
        url: `${this._issueApiLink(cfg, issueid)}/notes?per_page=100&page=${pageNumber}`,
      },
      cfg,
    ).pipe(
      map((comments: KiamiOriginalComment[]) => {
        return comments ? comments : [];
      }),
    );
  }

  private _isValidSettings(cfg: KiamiCfg): boolean {
    if (cfg && cfg.project && cfg.project.length > 0) {
      return true;
    }
    this._snackService.open({
      type: 'ERROR',
      msg: T.F.ISSUE.S.ERR_NOT_CONFIGURED,
      translateParams: {
        issueProviderName: ISSUE_PROVIDER_HUMANIZED[KIAMI_TYPE],
      },
    });
    return false;
  }

  private _sendRequest$(
    params: HttpRequest<string> | any,
    cfg: KiamiCfg,
  ): Observable<any> {
    this._isValidSettings(cfg);

    const p: HttpRequest<any> | any = {
      ...params,
      method: params.method || 'GET',
      headers: {
        ...(cfg.token ? { Authorization: 'Bearer ' + cfg.token } : {}),
        ...(params.headers ? params.headers : {}),
      },
    };

    const bodyArg = params.data ? [params.data] : [];

    const allArgs = [
      ...bodyArg,
      {
        headers: new HttpHeaders(p.headers),
        params: new HttpParams({ fromObject: p.params }),
        reportProgress: false,
        observe: 'response',
        responseType: params.responseType,
      },
    ];
    const req = new HttpRequest(p.method, p.url, ...allArgs);
    return this._http.request(req).pipe(
      // TODO remove type: 0 @see https://brianflove.com/2018/09/03/angular-http-client-observe-response/
      filter((res) => !(res === Object(res) && res.type === 0)),
      map((res: any) => (res && res.body ? res.body : res)),
      catchError(this._handleRequestError$.bind(this)),
    );
  }

  private _handleRequestError$(
    error: HttpErrorResponse,
    caught: Observable<unknown>,
  ): ObservableInput<unknown> {
    console.error(error);
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      this._snackService.open({
        type: 'ERROR',
        msg: T.F.ISSUE.S.ERR_NETWORK,
        translateParams: {
          issueProviderName: ISSUE_PROVIDER_HUMANIZED[KIAMI_TYPE],
        },
      });
    } else if (error.error && error.error.message) {
      this._snackService.open({
        type: 'ERROR',
        msg: ISSUE_PROVIDER_HUMANIZED[KIAMI_TYPE] + ': ' + error.error.message,
      });
    } else {
      // The backend returned an unsuccessful response code.
      this._snackService.open({
        type: 'ERROR',
        translateParams: {
          errorMsg:
            (error.error && (error.error.name || error.error.statusText)) ||
            error.toString(),
          statusCode: error.status,
        },
        msg: T.F.KIAMI.S.ERR_UNKNOWN,
      });
    }

    if (error && error.message) {
      return throwError({ [HANDLED_ERROR_PROP_STR]: 'Kiami: ' + error.message });
    }
    return throwError({ [HANDLED_ERROR_PROP_STR]: 'Kiami: Api request failed.' });
  }

  private _issueApiLink(cfg: KiamiCfg, issue: string | number): string {
    return `${this._apiLink(
      cfg,
      this.getProject$(cfg, issue),
    )}/issues/${this._getIidFromIssue(issue)}`;
  }

  private _apiLink(projectConfig: KiamiCfg, project?: string | number): string {
    let apiURL: string = '';

    if (projectConfig.kiamiBaseUrl) {
      const fixedUrl = projectConfig.kiamiBaseUrl.match(/.*\/$/)
        ? projectConfig.kiamiBaseUrl
        : `${projectConfig.kiamiBaseUrl}/`;
      apiURL = fixedUrl + 'api/v4/';
    } else {
      apiURL = KIAMI_API_BASE_URL + '/';
    }

    let projectURL = project;

    if (!projectURL) {
      projectURL = this.getProject$(projectConfig);
    }

    projectURL = (projectURL as string).replace(/\//gi, '%2F');

    if (project || projectConfig.source === 'project') {
      apiURL += 'projects/' + projectURL;
    } else if (projectConfig.source === 'group') {
      apiURL += 'groups/' + projectURL;
    }

    return apiURL;
  }
}
