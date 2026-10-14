import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import type { User, MatchFixture, Player, ClubEvent, Notice, FinancialRecord, MembershipApplication } from './src/types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory Database with Authentic Nawa Yuwa Club Seeds
let users: (User & { passwordHash: string })[] = [
  {
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
    emergencyContact: '+977-9847098765',
    passwordHash: 'admin123',
    onboardingCompleted: true,
    province: 'Lumbini Province',
    district: 'Nawalparasi (Bardaghat Susta West)',
    localLevel: 'Bardaghat Municipality',
    ward: '16',
    preferredLanguage: 'ne',
  },
  {
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
    emergencyContact: '+977-9801234567',
    passwordHash: 'player123',
    onboardingCompleted: true,
    province: 'Lumbini Province',
    district: 'Nawalparasi (Bardaghat Susta West)',
    localLevel: 'Bardaghat Municipality',
    ward: '14',
    preferredLanguage: 'ne',
  },
  {
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
    emergencyContact: '+977-9847112233',
    passwordHash: 'finance123',
    onboardingCompleted: true,
    province: 'Lumbini Province',
    district: 'Nawalparasi (Bardaghat Susta West)',
    localLevel: 'Bardaghat Municipality',
    ward: '16',
    preferredLanguage: 'ne',
  },
  {
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
    emergencyContact: '+977-9812998877',
    passwordHash: 'member123',
    onboardingCompleted: true,
    province: 'Lumbini Province',
    district: 'Nawalparasi (Bardaghat Susta West)',
    localLevel: 'Bardaghat Municipality',
    ward: '16',
    preferredLanguage: 'ne',
  },
];

let sessions: { [token: string]: string } = {};

let matches: MatchFixture[] = [
  {
    id: 'm-1',
    tournament: '12th Nawa Gold Cup Championship 2081',
    round: 'Final',
    homeTeam: 'Nawa Yuwa Club',
    homeScore: 3,
    awayTeam: 'Bardaghat FC',
    awayScore: 2,
    matchDate: '2026-10-18T15:30:00Z',
    venue: 'Bardaghat Municipal Stadium, Nawalparasi',
    status: 'upcoming',
    referee: 'Sudip Pandey (FIFA Badge)',
    highlights: 'High stakes district derby final match with over 5,000 spectators expected.',
  },
  {
    id: 'm-2',
    tournament: 'Lumbini Province Youth League',
    round: 'Matchday 7',
    homeTeam: 'Butwal United XI',
    homeScore: 1,
    awayTeam: 'Nawa Yuwa Club',
    awayScore: 2,
    matchDate: '2026-10-10T14:00:00Z',
    venue: 'ANFA Technical Centre, Butwal',
    status: 'completed',
    scorers: ['Dinesh Bhattarai 34\'', 'Lal Bahadur Thapa 88\'', 'R. Thapa 61\''],
    referee: 'Bikram Thapa',
    highlights: 'Stunning 88th-minute header by Lal Bahadur secured 3 away points for Nawa Yuwa.',
  },
  {
    id: 'm-3',
    tournament: '12th Nawa Gold Cup Championship 2081',
    round: 'Semi Final',
    homeTeam: 'Nawa Yuwa Club',
    homeScore: 2,
    awayTeam: 'Chitwan Sports Academy',
    awayScore: 0,
    matchDate: '2026-10-06T15:00:00Z',
    venue: 'Nawa Yuwa Sports Ground, Kukurmara',
    status: 'completed',
    scorers: ['Manish Chaudhary 12\'', 'Dinesh Bhattarai 74\' (P)'],
    highlights: 'Clean sheet performance backed by outstanding saves by GK Rabin Adhikari.',
  },
  {
    id: 'm-4',
    tournament: 'Tanahun Youth Invitational Cup',
    round: 'Quarter Final',
    homeTeam: 'Nawa Yuwa Club',
    homeScore: 1,
    awayTeam: 'Pokhara Valley FC',
    awayScore: 1,
    currentMinute: 68,
    matchDate: '2026-10-13T16:00:00Z',
    venue: 'Damauli Regional Stadium',
    status: 'live',
    scorers: ['Pradip Chaudhary 29\'', 'K. Gurung 52\''],
    highlights: 'Live fierce battle in the midfield with counter-attacking opportunities.',
  },
];

let players: Player[] = [
  {
    id: 'p-1',
    name: 'Rabin Adhikari',
    jerseyNumber: 1,
    position: 'Goalkeeper',
    age: 23,
    appearances: 38,
    goals: 0,
    assists: 1,
    hometown: 'Bardaghat-16',
    joinedYear: '2020',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    status: 'Active',
  },
  {
    id: 'p-2',
    name: 'Lal Bahadur Thapa',
    jerseyNumber: 4,
    position: 'Defender',
    age: 25,
    appearances: 52,
    goals: 5,
    assists: 3,
    hometown: 'Sunwal, Nawalparasi',
    joinedYear: '2019',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    status: 'Active',
  },
  {
    id: 'p-3',
    name: 'Dinesh Bhattarai',
    jerseyNumber: 10,
    position: 'Midfielder',
    age: 24,
    appearances: 64,
    goals: 19,
    assists: 26,
    hometown: 'Bardaghat-14',
    joinedYear: '2019',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    isCaptain: true,
    status: 'Active',
  },
  {
    id: 'p-4',
    name: 'Manish Chaudhary',
    jerseyNumber: 9,
    position: 'Forward',
    age: 21,
    appearances: 34,
    goals: 22,
    assists: 8,
    hometown: 'Kukurmara, Bardaghat',
    joinedYear: '2021',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
    status: 'Active',
  },
  {
    id: 'p-5',
    name: 'Pradip Chaudhary',
    jerseyNumber: 8,
    position: 'Midfielder',
    age: 22,
    appearances: 45,
    goals: 9,
    assists: 14,
    hometown: 'Bardaghat-16',
    joinedYear: '2019',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
    status: 'Active',
  },
  {
    id: 'p-6',
    name: 'Bishnu Sunar',
    jerseyNumber: 5,
    position: 'Defender',
    age: 26,
    appearances: 41,
    goals: 2,
    assists: 4,
    hometown: 'Ramgram, Nawalparasi',
    joinedYear: '2020',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    status: 'Active',
  },
  {
    id: 'p-7',
    name: 'Anish Shrestha',
    jerseyNumber: 11,
    position: 'Forward',
    age: 20,
    appearances: 23,
    goals: 11,
    assists: 5,
    hometown: 'Bardaghat-12',
    joinedYear: '2023',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=300&q=80',
    status: 'Active',
  },
  {
    id: 'p-8',
    name: 'Sagar Pun',
    jerseyNumber: 3,
    position: 'Defender',
    age: 22,
    appearances: 29,
    goals: 1,
    assists: 2,
    hometown: 'Daunne, Nawalparasi',
    joinedYear: '2022',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80',
    status: 'Injured',
  },
];

let events: ClubEvent[] = [
  {
    id: 'e-1',
    title: '12th Annual Nawa Gold Cup Football Championship',
    category: 'Sports',
    date: '2026-10-14 to 2026-10-22',
    location: 'Bardaghat Municipal Ground',
    description: 'Premier regional tournament featuring 16 top football clubs from Lumbini and Gandaki provinces with cash prizes and talent scouting.',
    registeredCount: 16,
    capacity: 16,
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
    organizer: 'Nawa Yuwa Sports Committee',
    status: 'Ongoing',
  },
  {
    id: 'e-2',
    title: 'Grassroots Youth Football Clinic & Academy Tryouts',
    category: 'Training',
    date: '2026-11-05',
    location: 'Nawa Yuwa Training Ground, Kukurmara',
    description: 'Free intensive football coaching, fitness drills, and sports kits distribution for boys & girls aged 10-17.',
    registeredCount: 84,
    capacity: 120,
    imageUrl: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=800&q=80',
    organizer: 'Youth Development Wing',
    status: 'Upcoming',
  },
  {
    id: 'e-3',
    title: 'Grand Blood Donation & Free Health Screening Camp',
    category: 'Health',
    date: '2026-11-15',
    location: 'Club Hall, Bardaghat-16',
    description: 'Joint initiative with Nepal Red Cross Society to support Nawalparasi blood bank shortages and blood pressure/diabetes screenings.',
    registeredCount: 65,
    capacity: 150,
    imageUrl: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80',
    organizer: 'Social Welfare Cell',
    status: 'Upcoming',
  },
  {
    id: 'e-4',
    title: 'Community Greenery & Chure Conservation Drive',
    category: 'Community',
    date: '2026-11-28',
    location: 'Bardaghat Watershed & Community Forest',
    description: 'Plantation of 1,000 indigenous trees with youth volunteers to preserve natural biodiversity and prevent seasonal erosion.',
    registeredCount: 110,
    capacity: 200,
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    organizer: 'Environment Sub-committee',
    status: 'Upcoming',
  },
];

let notices: Notice[] = [
  {
    id: 'n-1',
    title: 'Official Team Roster & Schedule for Nawa Gold Cup 2081 Final',
    category: 'Tournament',
    publishDate: '2026-10-12',
    priority: 'Urgent',
    summary: 'Match scheduled for 18th Oct at 3:30 PM against Bardaghat FC. Supporters gates open at 1:00 PM.',
    content: 'The executive committee of Nawa Yuwa Club is delighted to announce our qualification for the 12th Nawa Gold Cup Final. All club members are requested to assemble in official green club jerseys. VIP passes are available at the club office.',
    publishedBy: 'Executive Secretary',
  },
  {
    id: 'n-2',
    title: 'General Assembly & Fiscal Year 2081/82 Financial Audit Presentation',
    category: 'Executive',
    publishDate: '2026-10-02',
    priority: 'High',
    summary: 'Mandatory annual meeting of all general, life, and honorary members at Club Bhavan.',
    content: 'Agenda items include review of annual sports expenditures, election of regional sub-committee members, approval of upcoming stadium upgrade proposal, and publication of the social balance sheet.',
    publishedBy: 'Santosh Shrestha (President)',
  },
  {
    id: 'n-3',
    title: 'Call for Applications: Youth Football Academy Scholarship 2026',
    category: 'General',
    publishDate: '2026-09-25',
    priority: 'Normal',
    summary: 'Full tuition waivers and gear kits for talented underprivileged youth athletes in Nawalparasi.',
    content: 'Under our "Sports for All" mandate, 15 deserving candidates will receive year-round coaching, nutrition stipends, and academic tutoring support.',
    publishedBy: 'Youth Development Wing',
  },
];

let finances: FinancialRecord[] = [
  {
    id: 'f-1',
    type: 'income',
    category: 'Sponsorship',
    title: 'Gold Sponsor – Lumbini Cement & Infrastructure Ltd.',
    amount: 150000,
    date: '2026-10-08',
    recordedBy: 'Kopila Gurung (Treasurer)',
    donorOrVendor: 'Lumbini Cement Ltd.',
    receiptNumber: 'REC-2081-104',
    notes: 'Official shirt sponsor for Nawa Gold Cup 2081',
  },
  {
    id: 'f-2',
    type: 'expense',
    category: 'Ground Maintenance',
    title: 'Turf leveling & goalpost nets replacement',
    amount: 32000,
    date: '2026-10-05',
    recordedBy: 'Kopila Gurung (Treasurer)',
    donorOrVendor: 'Nawal Sports & Turf Supply',
    receiptNumber: 'EXP-2081-089',
    notes: 'Preparation for tournament semi-finals',
  },
  {
    id: 'f-3',
    type: 'income',
    category: 'Membership Dues',
    title: 'Annual General Membership Renewals (Batch 4)',
    amount: 45000,
    date: '2026-10-01',
    recordedBy: 'Kopila Gurung (Treasurer)',
    donorOrVendor: 'Club General Members',
    receiptNumber: 'REC-2081-098',
  },
  {
    id: 'f-4',
    type: 'expense',
    category: 'Equipment',
    title: 'Official FIFA-certified Match Footballs & Training Cones',
    amount: 24500,
    date: '2026-09-28',
    recordedBy: 'Kopila Gurung (Treasurer)',
    donorOrVendor: 'Kathmandu Sports House',
    receiptNumber: 'EXP-2081-084',
  },
  {
    id: 'f-5',
    type: 'income',
    category: 'Donation',
    title: 'Diaspora Support: Nawalparasi Youth Association UK',
    amount: 75000,
    date: '2026-09-20',
    recordedBy: 'Kopila Gurung (Treasurer)',
    donorOrVendor: 'NYA UK Chapter',
    receiptNumber: 'REC-2081-081',
    notes: 'Earmarked for Grassroots Youth Academy Boots & Kits',
  },
  {
    id: 'f-6',
    type: 'expense',
    category: 'Social Welfare',
    title: 'Relief material kits for flood-affected families in Ward 16',
    amount: 28000,
    date: '2026-09-15',
    recordedBy: 'Kopila Gurung (Treasurer)',
    donorOrVendor: 'Local Community Provisions Store',
    receiptNumber: 'EXP-2081-077',
  },
];

let membershipApplications: MembershipApplication[] = [
  {
    id: 'app-1',
    fullName: 'Suman Shrestha',
    email: 'suman.shrestha@gmail.com',
    phone: '+977-9847118822',
    address: 'Bardaghat-16, Kukurmara',
    dateOfBirth: '2004-03-12',
    bloodGroup: 'O+',
    interestWing: 'Senior Football Team',
    submittedAt: '2026-10-11T09:15:00Z',
    status: 'pending',
  },
  {
    id: 'app-2',
    fullName: 'Anjali Rana',
    email: 'anjali.rana@yahoo.com',
    phone: '+977-9812445566',
    address: 'Bardaghat-14, Chormara',
    dateOfBirth: '2003-08-22',
    bloodGroup: 'B+',
    interestWing: 'Cultural & Social Wing',
    submittedAt: '2026-10-10T14:30:00Z',
    status: 'approved',
  },
];

async function startServer() {
  const app = express();
  app.use(express.json());

  // Helper auth check
  const getUserFromToken = (req: Request): User | null => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.split(' ')[1];
    const userId = sessions[token];
    if (!userId) return null;
    const found = users.find(u => u.id === userId);
    if (!found) return null;
    const { passwordHash, ...userClean } = found;
    return userClean;
  };

  // --- AUTHENTICATION API ---
  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { name, email, phone, password, role = 'member', clubWing, bio, emergencyContact } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const newId = `user-${Date.now()}`;
    const year = new Date().getFullYear();
    const count = String(users.length + 1).padStart(3, '0');
    const membershipId = `NYC-${year}-${count}`;

    const newUser = {
      id: newId,
      name,
      email,
      phone: phone || '',
      role: (role as any) || 'member',
      clubWing: clubWing || 'General Membership',
      membershipId,
      joinedDate: new Date().toISOString().split('T')[0],
      status: 'active' as const,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80`,
      bio: bio || 'Proud member of Nawa Yuwa Club.',
      volunteerHours: 0,
      emergencyContact: emergencyContact || '',
      passwordHash: password,
    };

    users.push(newUser);

    const token = crypto.randomBytes(24).toString('hex');
    sessions[token] = newId;

    const { passwordHash: _, ...userSafe } = newUser;
    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: userSafe,
    });
  });

  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() || u.phone === email
    );

    if (!user || user.passwordHash !== password) {
      return res.status(401).json({ error: 'Invalid credentials. Please verify your email/password.' });
    }

    const token = crypto.randomBytes(24).toString('hex');
    sessions[token] = user.id;

    const { passwordHash: _, ...userSafe } = user;
    return res.json({
      message: 'Login successful',
      token,
      user: userSafe,
    });
  });

  app.post('/api/auth/quick-login', (req: Request, res: Response) => {
    const { role } = req.body;
    const user = users.find(u => u.role === role) || users[0];
    const token = crypto.randomBytes(24).toString('hex');
    sessions[token] = user.id;

    const { passwordHash: _, ...userSafe } = user;
    return res.json({
      message: `Signed in as ${user.name} (${user.role})`,
      token,
      user: userSafe,
    });
  });

  // --- OTP & AUTHENTICATION STORE ---
  const otpStore: Record<string, { code: string; expiresAt: number; attempts: number }> = {};

  // POST /api/auth/otp/send
  app.post('/api/auth/otp/send', (req: Request, res: Response) => {
    const { phone, email } = req.body;

    if (!phone && !email) {
      return res.status(400).json({ error: 'Please provide a valid Nepal mobile number or email address' });
    }

    let identifier = '';

    if (phone) {
      const cleaned = phone.replace(/[\s\-\(\)]/g, '');
      const nepalPhoneRegex = /^(\+977)?[9][678]\d{8}$/;
      if (!nepalPhoneRegex.test(cleaned)) {
        return res.status(400).json({
          error: 'Please enter a valid 10-digit Nepal mobile number starting with 96, 97, or 98 (e.g. +977 9812345678)',
        });
      }
      identifier = cleaned.startsWith('+977') ? cleaned : cleaned.startsWith('977') ? `+${cleaned}` : `+977${cleaned}`;
    } else if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return res.status(400).json({ error: 'Please enter a valid email address' });
      }
      identifier = email.trim().toLowerCase();
    }

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresInSeconds = 300; // 5 minutes validity
    otpStore[identifier] = {
      code,
      expiresAt: Date.now() + expiresInSeconds * 1000,
      attempts: 0,
    };

    console.log(`[AUTH OTP] Sent OTP to ${identifier}: ${code}`);

    return res.json({
      success: true,
      message: `Verification code sent to ${identifier}`,
      identifier,
      expiresInSeconds,
      demoOtp: code, // Shared in dev/test environment for effortless evaluation
    });
  });

  // POST /api/auth/otp/verify
  app.post('/api/auth/otp/verify', (req: Request, res: Response) => {
    const { phone, email, otp } = req.body;

    if (!otp || typeof otp !== 'string' || !/^\d{6}$/.test(otp.trim())) {
      return res.status(400).json({ error: 'Verification code must be exactly 6 digits' });
    }

    let identifier = '';
    if (phone) {
      const cleaned = phone.replace(/[\s\-\(\)]/g, '');
      identifier = cleaned.startsWith('+977') ? cleaned : cleaned.startsWith('977') ? `+${cleaned}` : `+977${cleaned}`;
    } else if (email) {
      identifier = email.trim().toLowerCase();
    } else {
      return res.status(400).json({ error: 'Identifier (phone or email) is required' });
    }

    const record = otpStore[identifier];
    if (!record) {
      return res.status(400).json({ error: 'No verification code was requested for this number/email or it has already been used.' });
    }

    if (Date.now() > record.expiresAt) {
      delete otpStore[identifier];
      return res.status(400).json({ error: 'Verification code has expired. Please request a new OTP.' });
    }

    record.attempts += 1;
    if (record.attempts > 5) {
      delete otpStore[identifier];
      return res.status(400).json({ error: 'Too many invalid attempts. Please request a new verification code.' });
    }

    if (record.code !== otp.trim()) {
      return res.status(400).json({ error: 'Invalid verification code. Please check the 6-digit code and try again.' });
    }

    // OTP is valid! Clean up
    delete otpStore[identifier];

    // Find or create user
    let user = users.find(u =>
      (phone && (u.phone === identifier || u.phone.replace(/[\s\-]/g, '') === identifier)) ||
      (email && u.email.toLowerCase() === identifier)
    );

    let isNewUser = false;
    if (!user) {
      isNewUser = true;
      const newId = `user-${Date.now()}`;
      const year = new Date().getFullYear();
      const count = String(users.length + 1).padStart(3, '0');
      const membershipId = `NYC-${year}-${count}`;

      user = {
        id: newId,
        name: phone ? `Youth Member (${identifier.slice(-4)})` : identifier.split('@')[0],
        email: email ? identifier : `${identifier.replace('+', '')}@member.nawayuwaclub.org`,
        phone: phone ? identifier : '',
        role: 'member',
        clubWing: 'Youth & Civic Action Wing',
        membershipId,
        joinedDate: new Date().toISOString().split('T')[0],
        status: 'active',
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80`,
        bio: 'Youth community volunteer and member of Nawa Yuwa Club.',
        volunteerHours: 0,
        emergencyContact: '',
        passwordHash: '',
        onboardingCompleted: false, // New OTP user needs onboarding!
      };
      users.push(user);
    }

    const token = crypto.randomBytes(24).toString('hex');
    sessions[token] = user.id;

    const { passwordHash: _, ...userSafe } = user;
    return res.json({
      message: 'Authentication successful',
      token,
      user: userSafe,
      onboardingCompleted: Boolean(userSafe.onboardingCompleted),
    });
  });

  // GET /me and GET /api/me
  const handleGetMe = (req: Request, res: Response) => {
    const user = getUserFromToken(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized or session expired' });
    }
    return res.json({
      user,
      onboardingCompleted: Boolean(user.onboardingCompleted ?? true),
    });
  };

  app.get('/me', handleGetMe);
  app.get('/api/me', handleGetMe);
  app.get('/api/auth/me', handleGetMe);

  // POST /api/auth/onboarding
  app.post('/api/auth/onboarding', (req: Request, res: Response) => {
    const user = getUserFromToken(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized. Please sign in to complete onboarding.' });
    }

    const { fullName, province, district, localLevel, ward, preferredLanguage } = req.body;

    // Validate inputs
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return res.status(400).json({ error: 'Full name must be at least 2 characters long' });
    }
    if (!province || typeof province !== 'string' || !province.trim()) {
      return res.status(400).json({ error: 'Province is required' });
    }
    if (!district || typeof district !== 'string' || !district.trim()) {
      return res.status(400).json({ error: 'District is required' });
    }
    if (!localLevel || typeof localLevel !== 'string' || !localLevel.trim()) {
      return res.status(400).json({ error: 'Municipality or Rural Municipality is required' });
    }
    if (!ward || !/^(?:[1-9]|[12][0-9]|3[0-5])$/.test(String(ward).trim())) {
      return res.status(400).json({ error: 'Ward must be a valid number between 1 and 35' });
    }
    if (!preferredLanguage || (preferredLanguage !== 'ne' && preferredLanguage !== 'en')) {
      return res.status(400).json({ error: 'Preferred language must be Nepali (ne) or English (en)' });
    }

    const target = users.find(u => u.id === user.id);
    if (!target) return res.status(404).json({ error: 'User not found' });

    target.name = fullName.trim();
    target.province = province.trim();
    target.district = district.trim();
    target.localLevel = localLevel.trim();
    target.ward = String(ward).trim();
    target.preferredLanguage = preferredLanguage;
    target.onboardingCompleted = true;

    const { passwordHash: _, ...userSafe } = target;
    return res.json({
      message: 'Onboarding completed successfully',
      user: userSafe,
      onboardingCompleted: true,
    });
  });

  app.post('/api/auth/logout', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      delete sessions[token];
    }
    return res.json({ message: 'Successfully logged out' });
  });

  app.put('/api/auth/profile', (req: Request, res: Response) => {
    const user = getUserFromToken(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const target = users.find(u => u.id === user.id);
    if (!target) return res.status(404).json({ error: 'User not found' });

    const { name, phone, bio, emergencyContact, clubWing, avatar, province, district, localLevel, ward, preferredLanguage } = req.body;
    if (name) target.name = name;
    if (phone) target.phone = phone;
    if (bio !== undefined) target.bio = bio;
    if (emergencyContact !== undefined) target.emergencyContact = emergencyContact;
    if (clubWing) target.clubWing = clubWing;
    if (avatar) target.avatar = avatar;
    if (province) target.province = province;
    if (district) target.district = district;
    if (localLevel) target.localLevel = localLevel;
    if (ward) target.ward = ward;
    if (preferredLanguage) target.preferredLanguage = preferredLanguage;

    const { passwordHash: _, ...updated } = target;
    return res.json({ message: 'Profile updated successfully', user: updated });
  });

  // --- MATCHES API ---
  app.get('/api/matches', (_req: Request, res: Response) => {
    return res.json(matches);
  });

  app.post('/api/matches', (req: Request, res: Response) => {
    const user = getUserFromToken(req);
    if (!user || (user.role !== 'admin' && user.role !== 'player')) {
      return res.status(403).json({ error: 'Only club admins or team captains can manage fixtures' });
    }

    const newMatch: MatchFixture = {
      id: `m-${Date.now()}`,
      tournament: req.body.tournament || 'Nawa Cup Series',
      round: req.body.round || 'Round 1',
      homeTeam: req.body.homeTeam || 'Nawa Yuwa Club',
      homeScore: req.body.homeScore,
      awayTeam: req.body.awayTeam || 'Visiting XI',
      awayScore: req.body.awayScore,
      matchDate: req.body.matchDate || new Date().toISOString(),
      venue: req.body.venue || 'Nawa Yuwa Ground, Bardaghat',
      status: req.body.status || 'upcoming',
      highlights: req.body.highlights || '',
    };

    matches.unshift(newMatch);
    return res.status(201).json(newMatch);
  });

  app.patch('/api/matches/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const matchIndex = matches.findIndex(m => m.id === id);
    if (matchIndex === -1) {
      return res.status(404).json({ error: 'Match fixture not found' });
    }

    matches[matchIndex] = {
      ...matches[matchIndex],
      ...req.body,
    };

    return res.json(matches[matchIndex]);
  });

  // --- PLAYERS API ---
  app.get('/api/players', (_req: Request, res: Response) => {
    return res.json(players);
  });

  app.post('/api/players', (req: Request, res: Response) => {
    const user = getUserFromToken(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin permission required to add players' });
    }

    const newPlayer: Player = {
      id: `p-${Date.now()}`,
      name: req.body.name,
      jerseyNumber: Number(req.body.jerseyNumber) || 99,
      position: req.body.position || 'Midfielder',
      age: Number(req.body.age) || 20,
      appearances: Number(req.body.appearances) || 0,
      goals: Number(req.body.goals) || 0,
      assists: Number(req.body.assists) || 0,
      hometown: req.body.hometown || 'Bardaghat, Nawalparasi',
      joinedYear: req.body.joinedYear || new Date().getFullYear().toString(),
      avatar: req.body.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      status: req.body.status || 'Active',
      isCaptain: !!req.body.isCaptain,
    };

    players.push(newPlayer);
    return res.status(201).json(newPlayer);
  });

  app.patch('/api/players/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const idx = players.findIndex(p => p.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Player not found' });

    players[idx] = { ...players[idx], ...req.body };
    return res.json(players[idx]);
  });

  // --- EVENTS API ---
  app.get('/api/events', (_req: Request, res: Response) => {
    return res.json(events);
  });

  app.post('/api/events', (req: Request, res: Response) => {
    const newEvent: ClubEvent = {
      id: `e-${Date.now()}`,
      title: req.body.title,
      category: req.body.category || 'Community',
      date: req.body.date,
      location: req.body.location,
      description: req.body.description,
      registeredCount: 0,
      capacity: req.body.capacity,
      imageUrl: req.body.imageUrl || 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80',
      organizer: req.body.organizer || 'Nawa Yuwa Club',
      status: 'Upcoming',
    };
    events.unshift(newEvent);
    return res.status(201).json(newEvent);
  });

  app.post('/api/events/:id/register', (req: Request, res: Response) => {
    const { id } = req.params;
    const evt = events.find(e => e.id === id);
    if (!evt) return res.status(404).json({ error: 'Event not found' });
    evt.registeredCount += 1;
    return res.json({ message: 'Successfully registered for event', event: evt });
  });

  // --- FINANCES API ---
  app.get('/api/finances', (_req: Request, res: Response) => {
    const totalIncome = finances
      .filter(f => f.type === 'income')
      .reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpense = finances
      .filter(f => f.type === 'expense')
      .reduce((acc, curr) => acc + curr.amount, 0);
    const balance = totalIncome - totalExpense;

    return res.json({
      records: finances,
      summary: {
        totalIncome,
        totalExpense,
        balance,
        currency: 'NPR',
      },
    });
  });

  app.post('/api/finances', (req: Request, res: Response) => {
    const user = getUserFromToken(req);
    if (!user || (user.role !== 'admin' && user.role !== 'treasurer')) {
      return res.status(403).json({ error: 'Only Club Treasurers or Admins can record financial entries' });
    }

    const { type, category, title, amount, donorOrVendor, notes } = req.body;
    if (!title || !amount || !type) {
      return res.status(400).json({ error: 'Title, amount, and type are required' });
    }

    const newRecord: FinancialRecord = {
      id: `f-${Date.now()}`,
      type,
      category: category || 'Social Welfare',
      title,
      amount: Number(amount),
      date: new Date().toISOString().split('T')[0],
      recordedBy: `${user.name} (${user.role})`,
      donorOrVendor: donorOrVendor || '',
      receiptNumber: `${type === 'income' ? 'REC' : 'EXP'}-2081-${String(finances.length + 1).padStart(3, '0')}`,
      notes: notes || '',
    };

    finances.unshift(newRecord);
    return res.status(201).json(newRecord);
  });

  // --- NOTICES API ---
  app.get('/api/notices', (_req: Request, res: Response) => {
    return res.json(notices);
  });

  app.post('/api/notices', (req: Request, res: Response) => {
    const user = getUserFromToken(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Only Club Administrators can issue official notices' });
    }

    const newNotice: Notice = {
      id: `n-${Date.now()}`,
      title: req.body.title,
      category: req.body.category || 'General',
      publishDate: new Date().toISOString().split('T')[0],
      priority: req.body.priority || 'Normal',
      summary: req.body.summary,
      content: req.body.content,
      publishedBy: `${user.name} (${user.clubWing})`,
    };

    notices.unshift(newNotice);
    return res.status(201).json(newNotice);
  });

  // --- MEMBERS API ---
  app.get('/api/members', (_req: Request, res: Response) => {
    const cleanUsers = users.map(({ passwordHash, ...safe }) => safe);
    return res.json({
      members: cleanUsers,
      applications: membershipApplications,
    });
  });

  app.post('/api/members/apply', (req: Request, res: Response) => {
    const { fullName, email, phone, address, dateOfBirth, bloodGroup, interestWing } = req.body;
    if (!fullName || !email || !phone) {
      return res.status(400).json({ error: 'Full name, email, and phone number are required' });
    }

    const application: MembershipApplication = {
      id: `app-${Date.now()}`,
      fullName,
      email,
      phone,
      address: address || 'Bardaghat, Nawalparasi',
      dateOfBirth: dateOfBirth || '2000-01-01',
      bloodGroup: bloodGroup || 'A+',
      interestWing: interestWing || 'General Membership',
      submittedAt: new Date().toISOString(),
      status: 'pending',
    };

    membershipApplications.unshift(application);
    return res.status(201).json({
      message: 'Application submitted successfully. Club executive committee will review within 48 hours.',
      application,
    });
  });

  app.patch('/api/members/application/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const appItem = membershipApplications.find(a => a.id === id);
    if (!appItem) return res.status(404).json({ error: 'Application not found' });

    appItem.status = status;

    // If approved, create member account
    if (status === 'approved') {
      const year = new Date().getFullYear();
      const count = String(users.length + 1).padStart(3, '0');
      const newUser = {
        id: `user-${Date.now()}`,
        name: appItem.fullName,
        email: appItem.email,
        phone: appItem.phone,
        role: 'member' as const,
        clubWing: appItem.interestWing,
        membershipId: `NYC-${year}-${count}`,
        joinedDate: new Date().toISOString().split('T')[0],
        status: 'active' as const,
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80`,
        bio: `Member enrolled via online portal into ${appItem.interestWing}.`,
        volunteerHours: 0,
        passwordHash: 'member123',
      };
      users.push(newUser);
    }

    return res.json({ message: `Application ${status}`, application: appItem });
  });

  // --- CIVIC PLATFORM STATS & HOME PAGE DATA ---
  // --- CIVIC PLATFORM STATS & DIRECTORY DATA ---
  let chapters: any[] = [
    {
      id: 'chap-1',
      slug: 'bardaghat',
      name: 'Bardaghat Chapter',
      location: 'Ward 16, Bardaghat Municipality, Nawalparasi',
      province: 'Lumbini Province',
      district: 'Nawalparasi (Bardaghat Susta West)',
      localLevel: 'Bardaghat Municipality',
      shortDescription: 'Founding chapter focusing on grassroots youth sports, flood relief, and community civic infrastructure.',
      about: 'Established in 2021 by a cohort of passionate local university students and sports enthusiasts, the Bardaghat Chapter spearheads community-driven municipal advocacy, disaster risk resilience along the Daunne hill slopes, and youth sports academies across Nawalparasi. The chapter regularly partners with Ward 16 office for tree planting and watershed protection.',
      recentActivity: 'Coordinating volunteer emergency relief and municipal park greening initiative.',
      projectsCompleted: 18,
      issuesResolved: 64,
      lastActive: 'Active today',
      meetingSchedule: 'Every alternate Saturday at 8:00 AM',
      meetingPlace: 'Ward 16 Youth Community Hall, Bardaghat',
      coordinatorName: 'Bibek Sharma Adhikari',
      coordinatorContact: '+977 9847000001',
      establishedYear: 2021,
    },
    {
      id: 'chap-2',
      slug: 'janakpurdham',
      name: 'Janakpurdham Chapter',
      location: 'Ward 4, Janakpurdham Sub-Metropolitan, Dhanusha',
      province: 'Madhesh Pradesh',
      district: 'Dhanusha',
      localLevel: 'Janakpurdham Sub-Metropolitan City',
      shortDescription: 'Active youth mobilization for heritage preservation, civic education, and pond cleaning campaigns.',
      about: 'The Janakpurdham Chapter mobilizes over 180 youth volunteers in Mithila region to protect sacred historical water bodies, combat seasonal urban waterlogging, and organize free digital literacy and competitive examination workshops for rural youth from surrounding rural municipalities.',
      recentActivity: 'Completed clean drinking water filter installation in community school.',
      projectsCompleted: 12,
      issuesResolved: 48,
      lastActive: 'Active 2 hours ago',
      meetingSchedule: 'First & Third Sunday at 4:30 PM',
      meetingPlace: 'Janakpur Youth Information Center, Station Road',
      coordinatorName: 'Priyanka Kumari Sah',
      coordinatorContact: '+977 9845000002',
      establishedYear: 2022,
    },
    {
      id: 'chap-3',
      slug: 'birgunj',
      name: 'Birgunj Chapter',
      location: 'Ward 2, Birgunj Metropolitan City, Parsa',
      province: 'Madhesh Pradesh',
      district: 'Parsa',
      localLevel: 'Birgunj Metropolitan City',
      shortDescription: 'Pioneering youth vocational skills, public health drives, and municipal problem-solving forums.',
      about: 'Located in Nepal’s economic gateway, Birgunj Chapter connects high school and college students with industrial apprenticeship pathways, civic safety audits along major arterial avenues, and quarterly municipal youth townhalls with city engineers.',
      recentActivity: 'Organized community blood donation drive in partnership with local hospital.',
      projectsCompleted: 9,
      issuesResolved: 32,
      lastActive: 'Active yesterday',
      meetingSchedule: 'Every Saturday at 3:00 PM',
      meetingPlace: 'Adarshanagar Community Library Hall',
      coordinatorName: 'Ramesh Patel',
      coordinatorContact: '+977 9845000003',
      establishedYear: 2022,
    },
    {
      id: 'chap-4',
      slug: 'lahan',
      name: 'Lahan Chapter',
      location: 'Ward 7, Lahan Municipality, Siraha',
      province: 'Madhesh Pradesh',
      district: 'Siraha',
      localLevel: 'Lahan Municipality',
      shortDescription: 'Focusing on community literacy classes, road safety awareness, and green village drives.',
      about: 'Lahan Chapter works across northern Siraha uniting youth from Dalit and indigenous Tharu communities to expand after-school tutoring, monitor postal highway black-spots, and promote eco-friendly village sanitation.',
      recentActivity: 'Submitted public petition for solar streetlamp repairs on main school road.',
      projectsCompleted: 6,
      issuesResolved: 21,
      lastActive: 'Active 3 days ago',
      meetingSchedule: 'Second Saturday of every Nepali month',
      meetingPlace: 'Lahan Ward 7 Civic Center',
      coordinatorName: 'Sunita Chaudhary',
      coordinatorContact: '+977 9844000004',
      establishedYear: 2023,
    },
    {
      id: 'chap-5',
      slug: 'gaur',
      name: 'Gaur Chapter',
      location: 'Ward 3, Gaur Municipality, Rautahat',
      province: 'Madhesh Pradesh',
      district: 'Rautahat',
      localLevel: 'Gaur Municipality',
      shortDescription: 'Dedicated to flood response preparedness, irrigation maintenance, and youth agricultural innovation.',
      about: 'Bordering the Lalbakaiya river, Gaur Chapter trains young rescue squads in flood evacuation, desilting community canals, and distributing low-cost organic compost to local farmer cooperatives.',
      recentActivity: 'Completed desilting campaign for 2.5km village agricultural canal.',
      projectsCompleted: 8,
      issuesResolved: 29,
      lastActive: 'Active 4 hours ago',
      meetingSchedule: 'Weekly Friday at 5:00 PM',
      meetingPlace: 'Red Cross Building, Gaur Ward 3',
      coordinatorName: 'Dhirendra Yadav',
      coordinatorContact: '+977 9845000005',
      establishedYear: 2023,
    },
    {
      id: 'chap-6',
      slug: 'kalaiya',
      name: 'Kalaiya Chapter',
      location: 'Ward 1, Kalaiya Sub-Metropolitan, Bara',
      province: 'Madhesh Pradesh',
      district: 'Bara',
      localLevel: 'Kalaiya Sub-Metropolitan City',
      shortDescription: 'Promoting youth sports leagues, public pond preservation, and girl child educational retention.',
      about: 'Kalaiya Chapter manages youth football coaching clinics and monitors public municipal fund allocations for Ward school sanitation blocks, ensuring girls have safe and dignified menstrual hygiene facilities.',
      recentActivity: 'Launched municipal civic survey on public toilet sanitation in bazaar area.',
      projectsCompleted: 7,
      issuesResolved: 24,
      lastActive: 'Active 5 days ago',
      meetingSchedule: 'Every alternate Friday at 4:00 PM',
      meetingPlace: 'Siddheshwor Ground Sports Club Office',
      coordinatorName: 'Deepak Paswan',
      coordinatorContact: '+977 9845000006',
      establishedYear: 2023,
    },
  ];

  let issues: any[] = [
    {
      id: 'iss-1',
      title: 'Drinking Water Pipeline Rupture near Janakpurdham Chowk',
      description: 'Underground drinking water pipeline burst causing water supply disruption to 45 homes and flooding the public pathway near Station Road. Stagnant puddles are breeding mosquitoes and halting pedestrian access to the local primary healthcare post.',
      location: 'Ward 4, Janakpurdham, Dhanusha',
      province: 'Madhesh Pradesh',
      district: 'Dhanusha',
      category: 'Water & Sanitation',
      status: 'In Progress',
      reportedDate: '2026-10-11',
      ward: 'Ward 4',
      reportedBy: 'Local Community Volunteer',
      relatedProjectId: 'proj-1',
      relatedProjectName: 'Safe Drinking Water Community Filtration Station',
      actionTaken: 'Nawa Yuwa Club volunteers met with Janakpurdham Sub-Metropolitan Water Supply division engineers. Replacement PVC pipe segments and trench digging crew have been dispatched.',
      timeline: [
        {
          step: 'Reported',
          title: 'Issue Submitted by Local Youth',
          description: 'Documented with 3 geo-tagged photographs and water outage feedback from 45 resident households.',
          date: '2026-10-11',
          completed: true,
        },
        {
          step: 'Verified',
          title: 'On-site Verification by Chapter Volunteers',
          description: 'Chapter team inspected the leak and confirmed 150-meter flooded street surface and contaminated supply line.',
          date: '2026-10-12',
          completed: true,
        },
        {
          step: 'Ward Escalation',
          title: 'Formal Notice to Ward 4 Municipal Engineer',
          description: 'Official letter delivered with 62 resident signatures requesting immediate pipeline valve shutoff and repair.',
          date: '2026-10-12',
          completed: true,
        },
        {
          step: 'In Progress',
          title: 'Repair Team Excavation & Valve Replacement',
          description: 'Municipal utility crew and volunteer youth assistants began replacing damaged cast-iron joints.',
          date: '2026-10-13',
          completed: true,
        },
        {
          step: 'Resolution & Audit',
          title: 'Water Quality Testing & Surface Restoration',
          description: 'Post-repair chlorine and turbidity test before full water pressure restoration to neighborhood.',
          date: 'Scheduled 2026-10-15',
          completed: false,
        },
      ],
    },
    {
      id: 'iss-2',
      title: 'Solid Waste Accumulation Along Postal Highway Roadside',
      description: 'Lack of municipal garbage bins and delayed weekly collection created an open waste dumping spot blocking rainwater drainage culverts and causing foul odor across 300 meters of the Postal Highway.',
      location: 'Ward 16, Bardaghat, Nawalparasi',
      province: 'Lumbini Province',
      district: 'Nawalparasi (Bardaghat Susta West)',
      category: 'Waste Management',
      status: 'In Progress',
      reportedDate: '2026-10-09',
      ward: 'Ward 16',
      reportedBy: 'Anil Sharma (Resident)',
      relatedProjectId: 'proj-3',
      relatedProjectName: 'Community Path Greening & 1,000 Sapling Plantation',
      actionTaken: 'Bardaghat Chapter organized an urgent clean-up mobilization with 28 youth. Secured commitment from municipality for 2 large iron skip bins and twice-weekly garbage truck visits.',
      timeline: [
        {
          step: 'Reported',
          title: 'Citizens Reported Clogged Culvert & Dumping',
          description: 'Waste accumulation reported after seasonal monsoon rains backed up water into roadside vegetable stalls.',
          date: '2026-10-09',
          completed: true,
        },
        {
          step: 'Verified',
          title: 'Site Visit & Waste Audit',
          description: 'Estimated 2.8 tons of mixed household and plastic packaging waste requiring mechanical removal.',
          date: '2026-10-10',
          completed: true,
        },
        {
          step: 'In Progress',
          title: 'Youth Clean-Up Drive & Bin Placement',
          description: 'Volunteers cleared top-layer plastics; municipality tractor transported debris to regional landfill.',
          date: '2026-10-12',
          completed: true,
        },
        {
          step: 'Resolution & Audit',
          title: 'Tree Planting & Public Notice Signage',
          description: 'Placement of "Zero Waste Zone" signboards and flowering bougainvillea hedges to deter re-dumping.',
          date: 'Scheduled 2026-10-18',
          completed: false,
        },
      ],
    },
    {
      id: 'iss-3',
      title: 'Broken Solar Streetlights near Adarshanagar Public High School',
      description: 'Four solar battery streetlamps non-functional for over 3 weeks, creating safety and security concerns for female students attending evening coaching classes and elderly residents going to temple.',
      location: 'Ward 2, Birgunj, Parsa',
      province: 'Madhesh Pradesh',
      district: 'Parsa',
      category: 'Safety & Lighting',
      status: 'Verified',
      reportedDate: '2026-10-06',
      ward: 'Ward 2',
      reportedBy: 'Kishore Jha',
      relatedProjectId: 'proj-2',
      relatedProjectName: 'Grassroots Youth Leadership & Civic Problem-Solving Workshop',
      actionTaken: 'Birgunj Chapter submitted inspection report to Ward Chairman. Battery inverter warranty checked and municipal electrician scheduled for inverter replacement.',
      timeline: [
        {
          step: 'Reported',
          title: 'Night Safety Concern Submitted',
          description: 'Dark roadway documented outside Adarshanagar secondary school gate.',
          date: '2026-10-06',
          completed: true,
        },
        {
          step: 'Verified',
          title: 'Technical Inspection of Solar Poles',
          description: 'Volunteers diagnosed burnt 12V 100Ah lead-acid batteries and corroded circuit connectors.',
          date: '2026-10-07',
          completed: true,
        },
        {
          step: 'Municipal Action',
          title: 'Procurement of Replacement Lithium Packs',
          description: 'Ward 2 office allocated maintenance fund for high-efficiency LED drivers and new batteries.',
          date: '2026-10-11',
          completed: false,
        },
      ],
    },
    {
      id: 'iss-4',
      title: 'Desilting and Reopening of Blocked Village Irrigation Canal',
      description: 'Silt deposits and fallen eucalyptus branches blocked seasonal irrigation water to 25 bighas of winter paddy and mustard fields in Gaur Ward 3. Downstream smallholders were facing severe crop loss.',
      location: 'Ward 3, Gaur, Rautahat',
      province: 'Madhesh Pradesh',
      district: 'Rautahat',
      category: 'Agriculture & Water',
      status: 'Resolved',
      reportedDate: '2026-09-28',
      ward: 'Ward 3',
      reportedBy: 'Rautahat Youth Team',
      actionTaken: '40 youth volunteers teamed up with 15 local farmers over a weekend to clear 400 meters of silted canal channel. Unimpeded water flow restored to all 25 bighas.',
      timeline: [
        {
          step: 'Reported',
          title: 'Farmers Alerted Club to Blocked Waterway',
          description: 'Water completely cut off for 6 days during critical winter crop germination period.',
          date: '2026-09-28',
          completed: true,
        },
        {
          step: 'Verified',
          title: 'Canal Survey by Chapter Volunteers',
          description: 'Pinpointed heavy clay sedimentation at canal sluice junction.',
          date: '2026-09-29',
          completed: true,
        },
        {
          step: 'In Progress',
          title: 'Shramdaan (Voluntary Labor Drive)',
          description: 'Chapter volunteers, shovels, and wheelbarrows mobilized alongside community elders.',
          date: '2026-10-01',
          completed: true,
        },
        {
          step: 'Resolved',
          title: 'Full Water Flow Restored & Canal Banks Reinforced',
          description: 'All 25 bighas irrigated; bamboo piling installed along loose embankments to stop future bank collapse.',
          date: '2026-10-03',
          completed: true,
        },
      ],
    },
  ];

  let communityProjects = [
    {
      id: 'proj-1',
      name: 'Safe Drinking Water Community Filtration Station',
      description: 'Assembling and maintaining community-grade solar water purification units for rural wards in southern Nepal.',
      location: 'Ward 4, Janakpurdham, Dhanusha',
      category: 'Health',
      date: '2026-10-24',
      imageUrl: '/src/assets/images/project_clean_water_1791953725518.jpg',
      status: 'In Progress',
      participantsCount: 38,
      isParticipating: false,
    },
    {
      id: 'proj-2',
      name: 'Grassroots Youth Leadership & Civic Problem-Solving Workshop',
      description: 'Practical community leadership curriculum teaching young changemakers how to document, report, and follow up local issues.',
      location: 'Ward 16, Bardaghat Community Hall',
      category: 'Leadership',
      date: '2026-11-02',
      imageUrl: '/src/assets/images/project_youth_workshop_1791953748929.jpg',
      status: 'Upcoming',
      participantsCount: 52,
      isParticipating: false,
    },
    {
      id: 'proj-3',
      name: 'Community Path Greening & 1,000 Sapling Plantation',
      description: 'Planting native shade and fruit trees with student volunteers along river banks and school walkways to prevent erosion.',
      location: 'Bardaghat Watershed & Watershed Pathway',
      category: 'Environment',
      date: '2026-11-12',
      imageUrl: '/src/assets/images/project_tree_drive_1791953781228.jpg',
      status: 'Upcoming',
      participantsCount: 76,
      isParticipating: false,
    },
  ];

  app.get('/api/stats', (_req: Request, res: Response) => {
    return res.json({
      youthMembers: 1248,
      activeChapters: 14,
      communityProjects: 38,
      issuesResolved: 156,
    });
  });

  app.get('/api/chapters', (_req: Request, res: Response) => {
    return res.json(chapters);
  });

  app.get('/api/chapters/:slugOrId', (req: Request, res: Response) => {
    const { slugOrId } = req.params;
    const chapter = chapters.find(
      c => c.slug.toLowerCase() === slugOrId.toLowerCase() || c.id.toLowerCase() === slugOrId.toLowerCase()
    );
    if (!chapter) {
      return res.status(404).json({ error: 'Chapter not found' });
    }
    return res.json(chapter);
  });

  app.get('/api/issues', (_req: Request, res: Response) => {
    return res.json(issues);
  });

  app.get('/api/issues/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const issue = issues.find(i => i.id.toLowerCase() === id.toLowerCase());
    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }
    return res.json(issue);
  });

  app.post('/api/issues', (req: Request, res: Response) => {
    const { title, description, location, category, ward, reportedBy, province, district } = req.body;
    if (!title || !description || !location) {
      return res.status(400).json({ error: 'Title, description, and location are required' });
    }
    const newIssue = {
      id: `iss-${Date.now()}`,
      title,
      description,
      location,
      province: province || 'Madhesh Pradesh',
      district: district || 'Dhanusha',
      category: category || 'Community',
      status: 'Reported',
      reportedDate: new Date().toISOString().split('T')[0],
      ward: ward || 'General',
      reportedBy: reportedBy || 'Community Member',
      timeline: [
        {
          step: 'Reported',
          title: 'Issue Submitted Online',
          description: 'Logged by community reporter. Queued for local chapter verification.',
          date: new Date().toISOString().split('T')[0],
          completed: true,
        },
        {
          step: 'Verification',
          title: 'Local Chapter Field Verification',
          description: 'Youth volunteers assigned to inspect site and document urgency.',
          date: 'Pending',
          completed: false,
        },
      ],
    };
    issues.unshift(newIssue);
    return res.status(201).json({ message: 'Issue reported successfully', issue: newIssue });
  });

  app.get('/api/community-projects', (_req: Request, res: Response) => {
    return res.json(communityProjects);
  });


  app.post('/api/community-projects/:id/rsvp', (req: Request, res: Response) => {
    const { id } = req.params;
    const project = communityProjects.find(p => p.id === id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    project.isParticipating = !project.isParticipating;
    project.participantsCount += project.isParticipating ? 1 : -1;
    return res.json({
      message: project.isParticipating ? 'RSVP confirmed' : 'RSVP cancelled',
      project,
    });
  });

  // VITE DEV SERVER OR STATIC PRODUCTION BUILD
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Nawa Yuwa Club server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
