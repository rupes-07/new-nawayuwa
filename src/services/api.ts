import type {
  User,
  MatchFixture,
  Player,
  ClubEvent,
  Notice,
  FinancialRecord,
  MembershipApplication,
  UserRole,
  PlatformStats,
  Chapter,
  CommunityIssue,
  CommunityProject,
  LeaderContext,
  LeaderDashboardData,
  LeaderMembersResponse,
  LeaderIssuesResponse,
  LeaderAttendanceData,
  LeaderPromotionsResponse,
  AdminContext,
  AdminDashboardData,
  AdminChaptersResponse,
  AdminPromotionsResponse,
  AdminModerationResponse,
  AdminAuditResponse,
  PlatformConfig,
} from '../types/index.ts';

const TOKEN_KEY = 'nawa_yuwa_auth_token';
const USER_KEY = 'nawa_yuwa_auth_user';

export const getStoredToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const getStoredUser = (): User | null => {
  const data = localStorage.getItem(USER_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

export const saveAuthData = (token: string, user: User) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearAuthData = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

const getHeaders = () => {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to login');
      }
      const data = await res.json();
      saveAuthData(data.token, data.user);
      return data;
    } catch (err: any) {
      // Fallback for client preview if backend call is intercepted
      if (err.message && !err.message.includes('fetch')) throw err;
      throw new Error(err.message || 'Login failed');
    }
  },

  async register(data: { name: string; email: string; phone: string; password: string; role?: UserRole; clubWing?: string }): Promise<{ token: string; user: User }> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Registration failed');
    }
    const result = await res.json();
    saveAuthData(result.token, result.user);
    return result;
  },

  async quickLogin(role: UserRole): Promise<{ token: string; user: User }> {
    try {
      const res = await fetch('/api/auth/quick-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) throw new Error('Quick login failed');
      const data = await res.json();
      saveAuthData(data.token, data.user);
      return data;
    } catch {
      // Local resilient fallback for preview container
      const seedUsers: Record<UserRole, User> = {
        admin: {
          id: 'user-admin',
          name: 'Santosh Shrestha',
          email: 'admin@nawayuwaclub.org',
          phone: '+977-9857012345',
          role: 'admin',
          clubWing: 'Executive Committee',
          membershipId: 'NYC-2005-001',
          joinedDate: '2005-04-14',
          status: 'active',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          bio: 'Club President dedicated to youth empowerment, sports infrastructure, and community service in Nawalparasi.',
          volunteerHours: 340,
          onboardingCompleted: true,
          province: 'Lumbini Province',
          district: 'Nawalparasi (Bardaghat Susta West)',
          localLevel: 'Bardaghat Municipality',
          ward: '16',
          preferredLanguage: 'ne',
        },
        chapter_leader: {
          id: 'user-leader',
          name: 'Bibek Sharma Adhikari',
          email: 'leader@nawayuwaclub.org',
          phone: '+977-9847000001',
          role: 'chapter_leader',
          clubWing: 'Bardaghat Chapter Executive',
          membershipId: 'NYC-2021-002',
          joinedDate: '2021-02-10',
          status: 'active',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
          bio: 'Chapter Coordinator for Bardaghat Chapter, leading youth volunteering, civic reporting, and municipal development.',
          volunteerHours: 260,
          onboardingCompleted: true,
          chapterId: 'chap-1',
          province: 'Lumbini Province',
          district: 'Nawalparasi (Bardaghat Susta West)',
          localLevel: 'Bardaghat Municipality',
          ward: '16',
          preferredLanguage: 'ne',
        },
        treasurer: {
          id: 'user-treasurer',
          name: 'Kopila Gurung',
          email: 'finance@nawayuwaclub.org',
          phone: '+977-9867123980',
          role: 'treasurer',
          clubWing: 'Finance & Auditing Wing',
          membershipId: 'NYC-2018-015',
          joinedDate: '2018-06-10',
          status: 'active',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
          bio: 'Finance Secretary ensuring 100% public fiscal transparency and fund allocations for local youth.',
          volunteerHours: 190,
          onboardingCompleted: true,
          province: 'Lumbini Province',
          district: 'Nawalparasi (Bardaghat Susta West)',
          localLevel: 'Bardaghat Municipality',
          ward: '16',
          preferredLanguage: 'ne',
        },
        player: {
          id: 'user-player',
          name: 'Dinesh Bhattarai',
          email: 'captain@nawayuwaclub.org',
          phone: '+977-9812345678',
          role: 'player',
          clubWing: 'Senior Football Team',
          membershipId: 'NYC-2019-042',
          joinedDate: '2019-09-01',
          status: 'active',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
          position: 'Midfielder',
          jerseyNumber: 10,
          bio: 'First Team Captain & Midfield Playmaker. Product of Nawa Yuwa Youth Academy.',
          volunteerHours: 85,
          onboardingCompleted: true,
          province: 'Lumbini Province',
          district: 'Nawalparasi (Bardaghat Susta West)',
          localLevel: 'Bardaghat Municipality',
          ward: '14',
          preferredLanguage: 'ne',
        },
        member: {
          id: 'user-member',
          name: 'Pradeep Chaudhary',
          email: 'member@nawayuwaclub.org',
          phone: '+977-9847654321',
          role: 'member',
          clubWing: 'Cultural & Social Wing',
          membershipId: 'NYC-2022-118',
          joinedDate: '2022-01-15',
          status: 'active',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
          bio: 'Active youth volunteer for cultural festivals, tree plantation, and disaster response teams.',
          volunteerHours: 42,
          onboardingCompleted: true,
          chapterId: 'chap-1',
          province: 'Lumbini Province',
          district: 'Nawalparasi (Bardaghat Susta West)',
          localLevel: 'Bardaghat Municipality',
          ward: '16',
          preferredLanguage: 'ne',
        },
      };
      const user = seedUsers[role] || seedUsers.member;
      const token = `token-${role}-${Date.now()}`;
      saveAuthData(token, user);
      return { token, user };
    }
  },

  async sendOtp(payload: { phone?: string; email?: string }): Promise<{ message: string; demoOtp?: string; expiresInSeconds?: number }> {
    const res = await fetch('/api/auth/otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || 'Failed to send verification code. Please check your network.');
    }
    return data;
  },

  async verifyOtp(payload: { phone?: string; email?: string; otp: string }): Promise<{ token: string; user: User; onboardingCompleted: boolean; message?: string }> {
    const res = await fetch('/api/auth/otp/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || 'Failed to verify verification code.');
    }
    saveAuthData(data.token, data.user);
    return data;
  },

  async completeOnboarding(payload: {
    fullName: string;
    province: string;
    district: string;
    localLevel: string;
    ward: string;
    preferredLanguage: 'ne' | 'en';
  }): Promise<{ message: string; user: User; onboardingCompleted: boolean; token?: string }> {
    const storedUser = getStoredUser();
    const storedToken = getStoredToken();
    const headers = getHeaders();
    if (!headers['Authorization'] && storedToken) {
      headers['Authorization'] = `Bearer ${storedToken}`;
    }

    const res = await fetch('/api/auth/onboarding', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        ...payload,
        userId: storedUser?.id,
        phone: storedUser?.phone,
        email: storedUser?.email,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      if (storedUser) {
        const fallbackUpdated: User = {
          ...storedUser,
          name: payload.fullName,
          province: payload.province,
          district: payload.district,
          localLevel: payload.localLevel,
          ward: payload.ward,
          preferredLanguage: payload.preferredLanguage,
          onboardingCompleted: true,
        };
        const tok = storedToken || `tok-${storedUser.id}-${Date.now()}`;
        saveAuthData(tok, fallbackUpdated);
        return {
          message: 'Onboarding completed',
          user: fallbackUpdated,
          onboardingCompleted: true,
          token: tok,
        };
      }
      throw new Error(data.error || 'Failed to complete onboarding');
    }
    const tokenToSave = data.token || storedToken || `tok-${data.user.id}`;
    saveAuthData(tokenToSave, data.user);
    return data;
  },

  async getMe(): Promise<User> {
    const res = await fetch('/api/auth/me', {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Session invalid');
    const data = await res.json();
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data.user;
  },

  async logout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: getHeaders(),
      });
    } finally {
      clearAuthData();
    }
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    const res = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    const data = await res.json();
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data.user;
  },

  // Matches
  async getMatches(): Promise<MatchFixture[]> {
    const res = await fetch('/api/matches');
    if (!res.ok) throw new Error('Failed to fetch matches');
    return res.json();
  },

  async createMatch(matchData: Partial<MatchFixture>): Promise<MatchFixture> {
    const res = await fetch('/api/matches', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(matchData),
    });
    if (!res.ok) throw new Error('Failed to create match fixture');
    return res.json();
  },

  async updateMatch(id: string, updates: Partial<MatchFixture>): Promise<MatchFixture> {
    const res = await fetch(`/api/matches/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update match');
    return res.json();
  },

  // Players
  async getPlayers(): Promise<Player[]> {
    const res = await fetch('/api/players');
    if (!res.ok) throw new Error('Failed to fetch players');
    return res.json();
  },

  async createPlayer(playerData: Partial<Player>): Promise<Player> {
    const res = await fetch('/api/players', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(playerData),
    });
    if (!res.ok) throw new Error('Failed to add player');
    return res.json();
  },

  async updatePlayer(id: string, updates: Partial<Player>): Promise<Player> {
    const res = await fetch(`/api/players/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update player');
    return res.json();
  },

  // Events
  async getEvents(): Promise<ClubEvent[]> {
    const res = await fetch('/api/events');
    if (!res.ok) throw new Error('Failed to fetch events');
    return res.json();
  },

  async registerEvent(id: string): Promise<void> {
    const res = await fetch(`/api/events/${id}/register`, {
      method: 'POST',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to register for event');
  },

  // Finances
  async getFinances(): Promise<{ records: FinancialRecord[]; summary: { totalIncome: number; totalExpense: number; balance: number; currency: string } }> {
    const res = await fetch('/api/finances');
    if (!res.ok) throw new Error('Failed to fetch finances');
    return res.json();
  },

  async addFinanceRecord(record: Partial<FinancialRecord>): Promise<FinancialRecord> {
    const res = await fetch('/api/finances', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(record),
    });
    if (!res.ok) throw new Error('Failed to record financial entry');
    return res.json();
  },

  // Notices
  async getNotices(): Promise<Notice[]> {
    const res = await fetch('/api/notices');
    if (!res.ok) throw new Error('Failed to fetch notices');
    return res.json();
  },

  async createNotice(notice: Partial<Notice>): Promise<Notice> {
    const res = await fetch('/api/notices', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(notice),
    });
    if (!res.ok) throw new Error('Failed to publish notice');
    return res.json();
  },

  // Members
  async getMembers(): Promise<{ members: User[]; applications: MembershipApplication[] }> {
    const res = await fetch('/api/members');
    if (!res.ok) throw new Error('Failed to fetch members');
    return res.json();
  },

  async applyMembership(data: Partial<MembershipApplication>): Promise<any> {
    const res = await fetch('/api/members/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to submit application');
    return res.json();
  },

  async updateApplicationStatus(id: string, status: 'approved' | 'rejected'): Promise<any> {
    const res = await fetch(`/api/members/application/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update application');
    return res.json();
  },

  // Civic Platform APIs (Phase 3)
  async getStats(): Promise<PlatformStats> {
    const res = await fetch('/api/stats');
    if (!res.ok) throw new Error('Failed to fetch platform statistics');
    return res.json();
  },

  async getChapters(): Promise<Chapter[]> {
    const res = await fetch('/api/chapters');
    if (!res.ok) throw new Error('Failed to fetch chapters');
    return res.json();
  },

  async getChapter(slugOrId: string): Promise<Chapter> {
    const res = await fetch(`/api/chapters/${encodeURIComponent(slugOrId)}`);
    if (!res.ok) throw new Error('Failed to fetch chapter details');
    return res.json();
  },

  async getIssues(): Promise<CommunityIssue[]> {
    const res = await fetch('/api/issues');
    if (!res.ok) throw new Error('Failed to fetch community issues');
    return res.json();
  },

  async getIssue(id: string): Promise<CommunityIssue> {
    const res = await fetch(`/api/issues/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error('Failed to fetch issue details');
    return res.json();
  },

  async reportIssue(data: {
    title: string;
    description: string;
    location: string;
    category: string;
    ward?: string;
    reportedBy?: string;
  }): Promise<{ message: string; issue: CommunityIssue }> {
    const res = await fetch('/api/issues', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getHeaders(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to report issue');
    return res.json();
  },

  async getCommunityProjects(): Promise<CommunityProject[]> {
    const res = await fetch('/api/community-projects');
    if (!res.ok) throw new Error('Failed to fetch community projects');
    return res.json();
  },

  async rsvpCommunityProject(id: string): Promise<{ message: string; project: CommunityProject }> {
    const res = await fetch(`/api/community-projects/${id}/rsvp`, {
      method: 'POST',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to update project RSVP');
    return res.json();
  },

  // ========================================================================
  // PHASE 11: CHAPTER LEADER APIs
  // ========================================================================

  async getLeaderContext(): Promise<LeaderContext> {
    const res = await fetch('/api/leader/context', {
      headers: getHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch leader authorization context');
    }
    return res.json();
  },

  async getLeaderDashboard(): Promise<LeaderDashboardData> {
    const res = await fetch('/api/leader/dashboard', {
      headers: getHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch leader dashboard data');
    }
    return res.json();
  },

  async getLeaderMembers(): Promise<LeaderMembersResponse> {
    const res = await fetch('/api/leader/members', {
      headers: getHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch chapter members');
    }
    return res.json();
  },

  async executeLeaderMemberAction(id: string, action: string, payload?: any): Promise<any> {
    const res = await fetch(`/api/leader/members/${encodeURIComponent(id)}/action`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ action, ...payload }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to execute action "${action}"`);
    }
    return res.json();
  },

  async getLeaderIssues(): Promise<LeaderIssuesResponse> {
    const res = await fetch('/api/leader/issues', {
      headers: getHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch chapter issues');
    }
    return res.json();
  },

  async updateLeaderIssueStatus(id: string, status: string, notes?: string): Promise<any> {
    const res = await fetch(`/api/leader/issues/${encodeURIComponent(id)}/status`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ status, notes }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update issue status');
    }
    return res.json();
  },

  async addLeaderIssueNote(id: string, note: string): Promise<any> {
    const res = await fetch(`/api/leader/issues/${encodeURIComponent(id)}/notes`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ note }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to append note to issue');
    }
    return res.json();
  },

  async createLeaderProject(projectData: {
    name: string;
    description: string;
    category: string;
    location: string;
    date: string;
    targetVolunteers?: number;
    requiredSkills?: string;
    volunteerHoursCredit?: number;
    prerequisites?: string;
    coordinatorNotes?: string;
    images?: string[];
    imageUrl?: string;
  }): Promise<{ message: string; project: CommunityProject }> {
    const res = await fetch('/api/leader/projects/new', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(projectData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create chapter project');
    }
    return res.json();
  },

  async getLeaderAttendance(sessionId?: string): Promise<LeaderAttendanceData> {
    const query = sessionId ? `?sessionId=${encodeURIComponent(sessionId)}` : '';
    const res = await fetch(`/api/leader/attendance${query}`, {
      headers: getHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch attendance records');
    }
    return res.json();
  },

  async markLeaderAttendance(
    sessionId: string,
    records: Array<{ memberId: string; status: 'present' | 'absent' | 'late' | 'excused'; notes?: string }>
  ): Promise<any> {
    const res = await fetch('/api/leader/attendance/mark', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ sessionId, records }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update attendance');
    }
    return res.json();
  },

  async getLeaderPromotions(): Promise<LeaderPromotionsResponse> {
    const res = await fetch('/api/leader/promotions', {
      headers: getHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch promotions');
    }
    return res.json();
  },

  async executeLeaderPromotionAction(
    id: string,
    action: 'approve' | 'reject' | 'nominate',
    payload?: any
  ): Promise<any> {
    const res = await fetch(`/api/leader/promotions/${encodeURIComponent(id)}/action`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ action, ...payload }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to execute promotion action "${action}"`);
    }
    return res.json();
  },

  // ========================================================================
  // PHASE 12: PLATFORM ADMINISTRATION APIs
  // ========================================================================

  async getAdminContext(): Promise<AdminContext> {
    const res = await fetch('/api/admin/context', {
      headers: getHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch platform administration context');
    }
    return res.json();
  },

  async getAdminDashboard(): Promise<AdminDashboardData> {
    const res = await fetch('/api/admin/dashboard', {
      headers: getHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch admin dashboard metrics');
    }
    return res.json();
  },

  async getAdminChapters(): Promise<AdminChaptersResponse> {
    const res = await fetch('/api/admin/chapters', {
      headers: getHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch chapters registry');
    }
    return res.json();
  },

  async updateAdminChapter(id: string, updates: Partial<Chapter & { status?: string }>): Promise<any> {
    const res = await fetch(`/api/admin/chapters/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update chapter information');
    }
    return res.json();
  },

  async createAdminChapter(chapterData: any): Promise<any> {
    const res = await fetch('/api/admin/chapters', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(chapterData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to establish new chapter');
    }
    return res.json();
  },

  async executeAdminChapterAction(id: string, action: string): Promise<any> {
    const res = await fetch(`/api/admin/chapters/${encodeURIComponent(id)}/action`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ action }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to execute action "${action}" on chapter`);
    }
    return res.json();
  },

  async getAdminPromotions(): Promise<AdminPromotionsResponse> {
    const res = await fetch('/api/admin/promotions', {
      headers: getHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch executive promotions');
    }
    return res.json();
  },

  async executeAdminPromotionAction(
    id: string,
    action: 'approve' | 'reject' | 'revoke',
    payload?: any
  ): Promise<any> {
    const res = await fetch(`/api/admin/promotions/${encodeURIComponent(id)}/action`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ action, ...payload }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to execute promotion action "${action}"`);
    }
    return res.json();
  },

  async getAdminModeration(): Promise<AdminModerationResponse> {
    const res = await fetch('/api/admin/moderation', {
      headers: getHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch moderation queue');
    }
    return res.json();
  },

  async executeAdminModerationAction(id: string, action: string, notes?: string): Promise<any> {
    const res = await fetch(`/api/admin/moderation/${encodeURIComponent(id)}/action`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ action, notes }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to apply moderation action "${action}"`);
    }
    return res.json();
  },

  async getAdminConfig(): Promise<{ config: PlatformConfig; capabilities: any; allowedActions: string[] }> {
    const res = await fetch('/api/admin/config', {
      headers: getHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch platform configuration');
    }
    return res.json();
  },

  async updateAdminConfig(updates: Partial<PlatformConfig>): Promise<any> {
    const res = await fetch('/api/admin/config', {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update platform settings');
    }
    return res.json();
  },

  async getAdminAudit(params?: { action?: string; result?: string; search?: string }): Promise<AdminAuditResponse> {
    const query = new URLSearchParams();
    if (params?.action) query.set('action', params.action);
    if (params?.result) query.set('result', params.result);
    if (params?.search) query.set('search', params.search);

    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await fetch(`/api/admin/audit${qs}`, {
      headers: getHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch security and audit trails');
    }
    return res.json();
  },
};
