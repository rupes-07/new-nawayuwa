import type { User, MatchFixture, Player, ClubEvent, Notice, FinancialRecord, MembershipApplication, UserRole, PlatformStats, Chapter, CommunityIssue, CommunityProject } from '../types/index.ts';

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
    const res = await fetch('/api/auth/quick-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    if (!res.ok) throw new Error('Quick login failed');
    const data = await res.json();
    saveAuthData(data.token, data.user);
    return data;
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
  }): Promise<{ message: string; user: User; onboardingCompleted: boolean }> {
    const res = await fetch('/api/auth/onboarding', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || 'Failed to complete onboarding');
    }
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
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
};
