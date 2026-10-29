export type UserRole = 'admin' | 'chapter_leader' | 'player' | 'treasurer' | 'member';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  clubWing: string;
  membershipId: string;
  joinedDate: string;
  status: 'active' | 'pending' | 'suspended';
  avatar?: string;
  bio?: string;
  position?: string;
  jerseyNumber?: number;
  volunteerHours?: number;
  emergencyContact?: string;
  onboardingCompleted?: boolean;
  province?: string;
  district?: string;
  localLevel?: string;
  ward?: string;
  preferredLanguage?: 'ne' | 'en';
  chapterId?: string;
  assignedWing?: string;
  attendanceRate?: number;
  rank?: string;
}

export interface MatchFixture {
  id: string;
  tournament: string;
  round: string;
  homeTeam: string;
  homeScore?: number;
  homeLogo?: string;
  awayTeam: string;
  awayScore?: number;
  awayLogo?: string;
  matchDate: string;
  venue: string;
  status: 'upcoming' | 'live' | 'completed' | 'postponed';
  currentMinute?: number;
  scorers?: string[];
  referee?: string;
  highlights?: string;
}

export interface Player {
  id: string;
  name: string;
  jerseyNumber: number;
  position: 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward';
  age: number;
  appearances: number;
  goals: number;
  assists: number;
  hometown: string;
  joinedYear: string;
  avatar: string;
  isCaptain?: boolean;
  status: 'Active' | 'Injured' | 'On Loan';
}

export interface ClubEvent {
  id: string;
  title: string;
  category: 'Sports' | 'Community' | 'Health' | 'Cultural' | 'Training';
  date: string;
  location: string;
  description: string;
  registeredCount: number;
  capacity?: number;
  imageUrl: string;
  organizer: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
}

export interface Notice {
  id: string;
  title: string;
  category: 'Tournament' | 'Executive' | 'General' | 'Finance';
  publishDate: string;
  priority: 'High' | 'Normal' | 'Urgent';
  summary: string;
  content: string;
  publishedBy: string;
  pdfUrl?: string;
}

export interface FinancialRecord {
  id: string;
  type: 'income' | 'expense';
  category: 'Membership Dues' | 'Sponsorship' | 'Tournament Prize' | 'Ground Maintenance' | 'Equipment' | 'Social Welfare' | 'Donation';
  title: string;
  amount: number;
  date: string;
  recordedBy: string;
  donorOrVendor?: string;
  receiptNumber: string;
  notes?: string;
}

export interface MembershipApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  bloodGroup: string;
  interestWing: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface PlatformStats {
  youthMembers: number;
  activeChapters: number;
  communityProjects: number;
  issuesResolved: number;
}

export interface Chapter {
  id: string;
  slug: string;
  name: string;
  location: string;
  province: string;
  district: string;
  localLevel?: string;
  shortDescription: string;
  about?: string;
  recentActivity: string;
  projectsCompleted: number;
  issuesResolved: number;
  lastActive: string;
  meetingSchedule?: string;
  meetingPlace?: string;
  coordinatorName?: string;
  coordinatorContact?: string;
  establishedYear?: number;
}

export interface IssueTimelineEvent {
  step: string;
  title: string;
  description: string;
  date: string;
  completed: boolean;
}

export interface CommunityIssue {
  id: string;
  title: string;
  description: string;
  location: string;
  province?: string;
  district?: string;
  category: string;
  status: 'Reported' | 'Under Review' | 'Verified' | 'In Progress' | 'Resolved';
  reportedDate: string;
  ward?: string;
  reportedBy?: string;
  timeline?: IssueTimelineEvent[];
  relatedProjectId?: string;
  relatedProjectName?: string;
  actionTaken?: string;
}

export interface CommunityProject {
  id: string;
  name: string;
  description: string;
  location: string;
  category: 'Community' | 'Environment' | 'Education' | 'Leadership' | 'Volunteering' | 'Culture' | 'Health' | 'Tourism';
  date: string;
  imageUrl: string;
  status: 'Upcoming' | 'In Progress' | 'Completed';
  participantsCount: number;
  isParticipating?: boolean;
  participationInfo?: {
    targetVolunteers?: number;
    requiredSkills?: string;
    volunteerHoursCredit?: number;
    prerequisites?: string;
    coordinatorNotes?: string;
  };
  images?: string[];
}

// ==========================================================================
// PHASE 11: CHAPTER LEADER DOMAIN TYPES & AUTHORIZATION CONTRACTS
// ==========================================================================

export interface LeaderCapabilities {
  canViewMembers: boolean;
  canPromoteMembers: boolean;
  canAssignRoles: boolean;
  canSuspendMembers: boolean;
  canRemoveMembers: boolean;
  canManageIssues: boolean;
  canUpdateIssueStatus: boolean;
  canAddIssueNotes: boolean;
  canCreateProjects: boolean;
  canMarkAttendance: boolean;
  canExportAttendance: boolean;
  canManagePromotions: boolean;
}

export interface LeaderContext {
  authorized: boolean;
  userRole?: UserRole;
  userName?: string;
  chapter: Chapter;
  capabilities: LeaderCapabilities;
  allowedActions: string[];
  reason?: string;
}

export interface LeaderPendingAction {
  id: string;
  type: 'issue_review' | 'promotion_approval' | 'attendance_due' | 'project_kickoff';
  title: string;
  description: string;
  targetId: string;
  route: string;
  priority: 'urgent' | 'high' | 'normal';
  createdAt: string;
  allowedActions: string[];
}

export interface LeaderActivityLog {
  id: string;
  action: string;
  performedBy: string;
  details: string;
  timestamp: string;
  type: 'member' | 'issue' | 'project' | 'attendance' | 'promotion';
}

export interface LeaderDashboardData {
  chapter: Chapter;
  capabilities: LeaderCapabilities;
  allowedActions: string[];
  chapterActivity: {
    totalMembers: number;
    activeProjects: number;
    openIssues: number;
    resolvedIssues: number;
    volunteerHoursLogged: number;
    averageAttendanceRate: number;
  };
  members: Array<{
    id: string;
    name: string;
    membershipId: string;
    role: string;
    clubWing: string;
    status: string;
    volunteerHours: number;
    avatar?: string;
    rank?: string;
    ward?: string;
  }>;
  projects: Array<CommunityProject & {
    volunteersRegistered?: number;
    targetVolunteers?: number;
  }>;
  issues: Array<CommunityIssue & {
    priority?: 'High' | 'Normal' | 'Urgent';
  }>;
  pendingActions: LeaderPendingAction[];
  recentActivity: LeaderActivityLog[];
}

export interface LeaderMemberItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  membershipId: string;
  role: string;
  clubWing: string;
  status: 'active' | 'pending' | 'suspended';
  joinedDate: string;
  volunteerHours: number;
  avatar?: string;
  ward?: string;
  attendanceRate: number;
  currentRank: string;
  allowedActions: string[];
}

export interface LeaderMembersResponse {
  chapter: Chapter;
  members: LeaderMemberItem[];
  allowedActions: string[];
  capabilities: LeaderCapabilities;
}

export interface LeaderIssuesResponse {
  chapter: Chapter;
  issues: CommunityIssue[];
  allowedActions: string[];
  capabilities: LeaderCapabilities;
  statusOptions: Array<'Reported' | 'Under Review' | 'Verified' | 'In Progress' | 'Resolved'>;
}

export interface AttendanceRecord {
  memberId: string;
  memberName: string;
  membershipId: string;
  avatar?: string;
  clubWing?: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  checkInTime?: string;
  notes?: string;
  hoursAwarded: number;
}

export interface AttendanceSession {
  id: string;
  title: string;
  type: 'project' | 'event' | 'meeting';
  date: string;
  location: string;
  targetHours: number;
  totalExpected: number;
  totalPresent: number;
}

export interface LeaderAttendanceData {
  chapter: Chapter;
  sessions: AttendanceSession[];
  activeSessionId: string;
  records: AttendanceRecord[];
  allowedActions: string[];
  capabilities: LeaderCapabilities;
}

export interface PromotionCandidate {
  id: string;
  memberId: string;
  memberName: string;
  membershipId: string;
  avatar?: string;
  currentRank: string;
  proposedRank: string;
  volunteerHours: number;
  attendanceRate: number;
  projectsCompleted: number;
  nominatedBy: string;
  nominatedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  criteriaMet: string[];
  allowedActions: string[];
}

export interface LeaderPromotionsResponse {
  chapter: Chapter;
  candidates: PromotionCandidate[];
  allowedActions: string[];
  capabilities: LeaderCapabilities;
  rankHierarchy: string[];
}

// ==========================================================================
// PHASE 12: PLATFORM ADMINISTRATION DOMAIN TYPES
// ==========================================================================

export interface AdminCapabilities {
  canManageChapters: boolean;
  canCreateChapter: boolean;
  canUpdateChapter: boolean;
  canPauseChapter: boolean;
  canManagePromotions: boolean;
  canApprovePromotions: boolean;
  canRevokePromotions: boolean;
  canManageModeration: boolean;
  canQuarantineContent: boolean;
  canDeleteContent: boolean;
  canManageConfig: boolean;
  canViewAudit: boolean;
  canExportAudit: boolean;
}

export interface AdminContext {
  authorized: boolean;
  userRole?: UserRole;
  userName?: string;
  capabilities: AdminCapabilities;
  allowedActions: string[];
  reason?: string;
}

export interface ModerationItem {
  id: string;
  itemType: 'issue' | 'comment' | 'member_profile' | 'project_submission';
  targetId: string;
  targetTitle: string;
  reportedReason: string;
  reportedBy: string;
  reportedDate: string;
  status: 'pending' | 'reviewed' | 'quarantined' | 'dismissed' | 'deleted';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  excerpt: string;
  allowedActions: string[];
}

export interface AdminPendingAction {
  id: string;
  type: 'moderation' | 'chapter_approval' | 'promotion_final' | 'config_review';
  title: string;
  description: string;
  targetId: string;
  route: string;
  priority: 'urgent' | 'high' | 'normal';
  createdAt: string;
  allowedActions: string[];
}

export interface AdminAuditRecord {
  id: string;
  actor: {
    name: string;
    role: string;
    identifier: string; // sanitized non-sensitive identifier
  };
  action: string;
  resource: string;
  date: string;
  result: 'SUCCESS' | 'DENIED' | 'FLAGGED';
  details: string;
}

export interface PlatformConfig {
  organizationName: string;
  helplinePhone: string;
  supportEmail: string;
  currentFiscalYear: string;
  autoVerifyTrustedReporters: boolean;
  requirePhoneOtpForReporting: boolean;
  publicFinancialTransparency: boolean;
  allowDirectMemberApplications: boolean;
  minVolunteerHoursForSquadLead: number;
  minVolunteerHoursForCoordinator: number;
  maxUploadFileSizeMb: number;
  flaggingKeywords: string[];
}

export interface AdminDashboardData {
  capabilities: AdminCapabilities;
  allowedActions: string[];
  summary: {
    totalChapters: number;
    activeChapters: number;
    provincesCovered: number;
    totalProjects: number;
    activeProjects: number;
    totalIssues: number;
    openIssues: number;
    resolvedIssues: number;
    moderationPending: number;
    totalMembers: number;
  };
  chapters: Chapter[];
  projects: CommunityProject[];
  issues: CommunityIssue[];
  moderationQueue: ModerationItem[];
  pendingActions: AdminPendingAction[];
  recentActivity: AdminAuditRecord[];
}

export interface AdminChaptersResponse {
  chapters: Array<Chapter & {
    status?: 'active' | 'under_review' | 'paused' | 'archived';
    totalMembersCount?: number;
    allowedActions: string[];
  }>;
  capabilities: AdminCapabilities;
  allowedActions: string[];
  provinces: string[];
}

export interface AdminPromotionsResponse {
  candidates: Array<PromotionCandidate & {
    chapterName: string;
  }>;
  capabilities: AdminCapabilities;
  allowedActions: string[];
  rankHierarchy: string[];
}

export interface AdminModerationResponse {
  queue: ModerationItem[];
  capabilities: AdminCapabilities;
  allowedActions: string[];
  counts: {
    pending: number;
    quarantined: number;
    dismissed: number;
    total: number;
  };
}

export interface AdminAuditResponse {
  records: AdminAuditRecord[];
  capabilities: AdminCapabilities;
  allowedActions: string[];
  actionTypes: string[];
}

