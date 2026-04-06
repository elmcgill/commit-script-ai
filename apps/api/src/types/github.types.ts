export type Nullable<T> = T | null;
export type URI = string;
export type DateTime = string;
export type SecurityStatus = "enabled" | "disabled";

export type GithubOrganizationResponseDTO = {
    login: string,
    id: number,
    node_id: string,
    url: string,
    repos_url: string,
    events_url: string,
    hooks_url: string,
    issues_url: string,
    members_url: string,
    public_members_url: string,
    avatar_url: string,
    description: string
}

export type GithubUser = {
    login: string;
    id: number;
    node_id: string;
    avatar_url: URI;
    gravatar_id: Nullable<string>;
    url: URI;
    html_url: URI;
    followers_url: URI;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: URI;
    organizations_url: URI;
    repos_url: URI;
    events_url: string;
    received_events_url: URI;
    type: string;
    site_admin: boolean;

    name?: Nullable<string>;
    email?: Nullable<string>;
    starred_at?: string;
    user_view_type?: string;
}

export type GithubLicense = {
    key: string;
    name: string;
    url: Nullable<URI>;
    spdx_id: Nullable<string>;
    node_id: string;
    html_url?: URI;
}

export type GithubPermissions = {
  admin: boolean;
  pull: boolean;
  push: boolean;
  triage?: boolean;
  maintain?: boolean;
}

export type CodeSearchIndexStatus = {
  lexical_search_ok?: boolean;
  lexical_commit_sha?: string;
}

export type CodeOfConduct = {
  url: URI;
  key: string;
  name: string;
  html_url: Nullable<URI>;
}

export type SecurityFeature = {
  status: SecurityStatus;
}

export type SecretScanningBypassReviewer = {
  reviewer_id: number;
  reviewer_type: "TEAM" | "ROLE";
}

export type SecurityAndAnalysis = {
  advanced_security?: SecurityFeature;
  code_security?: SecurityFeature;
  dependabot_security_updates?: SecurityFeature;
  secret_scanning?: SecurityFeature;
  secret_scanning_push_protection?: SecurityFeature;
  secret_scanning_non_provider_patterns?: SecurityFeature;
  secret_scanning_ai_detection?: SecurityFeature;
  secret_scanning_delegated_alert_dismissal?: SecurityFeature;
  secret_scanning_delegated_bypass?: SecurityFeature;
  secret_scanning_delegated_bypass_options?: {
    reviewers: SecretScanningBypassReviewer[];
  };
}

export interface GithubRepository {
  id: number;
  node_id: string;
  name: string;
  full_name: string;

  owner: GithubUser;

  private: boolean;
  html_url: URI;
  description: Nullable<string>;
  fork: boolean;
  url: URI;

  archive_url: string;
  assignees_url: string;
  blobs_url: string;
  branches_url: string;
  collaborators_url: string;
  comments_url: string;
  commits_url: string;
  compare_url: string;
  contents_url: string;
  contributors_url: URI;
  deployments_url: URI;
  downloads_url: URI;
  events_url: URI;
  forks_url: URI;
  git_commits_url: string;
  git_refs_url: string;
  git_tags_url: string;
  git_url: string;
  issue_comment_url: string;
  issue_events_url: string;
  issues_url: string;
  keys_url: string;
  labels_url: string;
  languages_url: URI;
  merges_url: URI;
  milestones_url: string;
  notifications_url: string;
  pulls_url: string;
  releases_url: string;
  ssh_url: string;
  stargazers_url: URI;
  statuses_url: string;
  subscribers_url: URI;
  subscription_url: URI;
  tags_url: URI;
  teams_url: URI;
  trees_url: string;
  clone_url: string;
  mirror_url: Nullable<URI>;
  hooks_url: URI;
  svn_url: URI;

  homepage: Nullable<URI>;
  language: Nullable<string>;

  forks_count: number;
  stargazers_count: number;
  watchers_count: number;
  size: number;

  default_branch: string;
  open_issues_count: number;

  is_template: boolean;
  topics: string[];

  has_issues: boolean;
  has_projects: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  has_discussions: boolean;
  has_pull_requests: boolean;

  pull_request_creation_policy: "all" | "collaborators_only";

  archived: boolean;
  disabled: boolean;
  visibility: string;

  pushed_at: Nullable<DateTime>;
  created_at: Nullable<DateTime>;
  updated_at: Nullable<DateTime>;

  permissions?: GithubPermissions;
}

export interface GithubRepositoryResponseDTO extends GithubRepository {
  allow_rebase_merge: boolean;
  allow_squash_merge: boolean;
  allow_auto_merge: boolean;
  allow_merge_commit: boolean;
  allow_update_branch: boolean;
  delete_branch_on_merge: boolean;
  allow_forking: boolean;

  squash_merge_commit_title: "PR_TITLE" | "COMMIT_OR_PR_TITLE";
  squash_merge_commit_message: "PR_BODY" | "COMMIT_MESSAGES" | "BLANK";

  merge_commit_title: "PR_TITLE" | "MERGE_MESSAGE";
  merge_commit_message: "PR_BODY" | "PR_TITLE" | "BLANK";

  web_commit_signoff_required: boolean;

  subscribers_count: number;
  network_count: number;

  license: Nullable<GithubLicense>;
  organization: Nullable<GithubUser>;

  parent?: GithubRepository;
  source?: GithubRepository;
  template_repository?: Nullable<GithubRepository>;

  temp_clone_token?: Nullable<string>;

  forks?: number;
  open_issues?: number;
  watchers?: number;

  master_branch?: string;
  starred_at?: string;

  anonymous_access_enabled?: boolean;

  code_search_index_status?: CodeSearchIndexStatus;

  code_of_conduct?: CodeOfConduct;

  security_and_analysis?: Nullable<SecurityAndAnalysis>;
}

export type GithubRepositoryDTO = {
    id: number;
    name: string;
    url: string;
}
