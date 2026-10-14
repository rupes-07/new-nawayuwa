export type UserRole = 'admin' | 'player' | 'treasurer' | 'member';

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
}

