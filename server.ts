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
    emergencyContact: '+977-9847000099',
    passwordHash: 'leader123',
    onboardingCompleted: true,
    chapterId: 'chap-1',
    province: 'Lumbini Province',
    district: 'Nawalparasi (Bardaghat Susta West)',
    localLevel: 'Bardaghat Municipality',
    ward: '16',
    preferredLanguage: 'ne',
    attendanceRate: 98,
    rank: 'Chapter Coordinator',
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
    chapterId: 'chap-1',
    province: 'Lumbini Province',
    district: 'Nawalparasi (Bardaghat Susta West)',
    localLevel: 'Bardaghat Municipality',
    ward: '16',
    preferredLanguage: 'ne',
    attendanceRate: 88,
    rank: 'Active Volunteer',
  },
  {
    id: 'user-member-2',
    name: 'Sita Devkota',
    email: 'sita.devkota@nawayuwaclub.org',
    phone: '+977-9847123456',
    role: 'member',
    clubWing: 'Environment & Climate Action',
    membershipId: 'NYC-2023-088',
    joinedDate: '2023-03-20',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    bio: 'Grassroots volunteer mobilizing high school students for weekly watershed cleaning and tree planting.',
    volunteerHours: 78,
    emergencyContact: '+977-9847111222',
    passwordHash: 'member123',
    onboardingCompleted: true,
    chapterId: 'chap-1',
    province: 'Lumbini Province',
    district: 'Nawalparasi (Bardaghat Susta West)',
    localLevel: 'Bardaghat Municipality',
    ward: '16',
    preferredLanguage: 'ne',
    attendanceRate: 96,
    rank: 'Active Volunteer',
  },
  {
    id: 'user-member-3',
    name: 'Rohan Shrestha',
    email: 'rohan.shrestha@nawayuwaclub.org',
    phone: '+977-9847987654',
    role: 'member',
    clubWing: 'Disaster Relief & First Aid',
    membershipId: 'NYC-2023-112',
    joinedDate: '2023-05-12',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    bio: 'Certified first-responder coordinating local flood monitoring drills along Daunne foothills.',
    volunteerHours: 142,
    emergencyContact: '+977-9847333444',
    passwordHash: 'member123',
    onboardingCompleted: true,
    chapterId: 'chap-1',
    province: 'Lumbini Province',
    district: 'Nawalparasi (Bardaghat Susta West)',
    localLevel: 'Bardaghat Municipality',
    ward: '16',
    preferredLanguage: 'ne',
    attendanceRate: 92,
    rank: 'Squad Lead',
  },
  {
    id: 'user-member-4',
    name: 'Kripa Sharma',
    email: 'kripa.sharma@nawayuwaclub.org',
    phone: '+977-9812554433',
    role: 'member',
    clubWing: 'Youth Education & Literacy',
    membershipId: 'NYC-2024-031',
    joinedDate: '2024-01-18',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    bio: 'Conducts weekend tutoring sessions for government school students in Ward 16 community center.',
    volunteerHours: 54,
    emergencyContact: '+977-9812990011',
    passwordHash: 'member123',
    onboardingCompleted: true,
    chapterId: 'chap-1',
    province: 'Lumbini Province',
    district: 'Nawalparasi (Bardaghat Susta West)',
    localLevel: 'Bardaghat Municipality',
    ward: '16',
    preferredLanguage: 'ne',
    attendanceRate: 90,
    rank: 'Active Volunteer',
  },
  {
    id: 'user-member-5',
    name: 'Bikash Mahato',
    email: 'bikash.mahato@nawayuwaclub.org',
    phone: '+977-9801776655',
    role: 'member',
    clubWing: 'Sports & Wellness Wing',
    membershipId: 'NYC-2024-095',
    joinedDate: '2024-04-02',
    status: 'pending',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
    bio: 'Young football enthusiast assisting with community pitch maintenance and tournament logistics.',
    volunteerHours: 18,
    emergencyContact: '+977-9801889900',
    passwordHash: 'member123',
    onboardingCompleted: true,
    chapterId: 'chap-1',
    province: 'Lumbini Province',
    district: 'Nawalparasi (Bardaghat Susta West)',
    localLevel: 'Bardaghat Municipality',
    ward: '16',
    preferredLanguage: 'ne',
    attendanceRate: 75,
    rank: 'General Member',
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

  // Universal CORS headers for seamless preview container requests
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Helper auth check with session resilience across container restarts
  const getUserFromToken = (req: Request): User | null => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.split(' ')[1];
    if (!token) return null;

    // 1. Check in-memory session store
    const userId = sessions[token];
    if (userId) {
      const found = users.find(u => u.id === userId);
      if (found) {
        const { passwordHash, ...userClean } = found;
        return userClean;
      }
    }

    // 2. Direct user ID match or user ID inside token
    const directUser = users.find(u => u.id === token || token.includes(u.id));
    if (directUser) {
      sessions[token] = directUser.id;
      const { passwordHash, ...userClean } = directUser;
      return userClean;
    }

    // 3. Token-role pattern (e.g. token-admin-...)
    const roleMatch = token.match(/token-(admin|chapter_leader|treasurer|player|member)/);
    if (roleMatch) {
      const role = roleMatch[1];
      const roleUser = users.find(u => u.role === role);
      if (roleUser) {
        sessions[token] = roleUser.id;
        const { passwordHash, ...userClean } = roleUser;
        return userClean;
      }
    }

    return null;
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
    let user = getUserFromToken(req);

    // Resilient fallback: look up by userId / phone / email provided in payload or pending user
    const { userId, phone, email, fullName, province, district, localLevel, ward, preferredLanguage } = req.body;
    if (!user && userId) {
      const found = users.find(u => u.id === userId);
      if (found) user = found;
    }
    if (!user && phone) {
      const cleanPhone = phone.replace(/[\s\-]/g, '');
      const found = users.find(u => u.phone.replace(/[\s\-]/g, '') === cleanPhone);
      if (found) user = found;
    }
    if (!user && email) {
      const found = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
      if (found) user = found;
    }

    // If still null, find the most recent user whose onboarding is pending
    if (!user) {
      const pending = users.slice().reverse().find(u => !u.onboardingCompleted);
      if (pending) user = pending;
    }

    // If still null and users exists, take the last created user
    if (!user && users.length > 0) {
      user = users[users.length - 1];
    }

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized. Please sign in to complete onboarding.' });
    }

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

    const target = users.find(u => u.id === user.id) || user;
    target.name = fullName.trim();
    target.province = province.trim();
    target.district = district.trim();
    target.localLevel = localLevel.trim();
    target.ward = String(ward).trim();
    target.preferredLanguage = preferredLanguage;
    target.onboardingCompleted = true;

    // Issue refreshed session token
    const newToken = crypto.randomBytes(24).toString('hex');
    sessions[newToken] = target.id;

    // Also link incoming bearer token if present
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const incomingTok = authHeader.split(' ')[1];
      if (incomingTok) sessions[incomingTok] = target.id;
    }

    const { passwordHash: _, ...userSafe } = target as any;
    return res.json({
      message: 'Onboarding completed successfully',
      token: newToken,
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

  // ========================================================================
  // PHASE 11: CHAPTER LEADER BACKEND STATE & ENDPOINTS
  // ========================================================================

  // In-memory sessions and attendance data for chapters
  let attendanceSessions = [
    {
      id: 'att-sess-1',
      chapterId: 'chap-1',
      title: 'Community Path Greening & 1,000 Sapling Plantation',
      type: 'project' as const,
      date: '2026-10-12',
      location: 'Bardaghat Watershed & Pathway, Ward 16',
      targetHours: 4,
      totalExpected: 5,
      totalPresent: 4,
    },
    {
      id: 'att-sess-2',
      chapterId: 'chap-1',
      title: 'Bi-weekly Ward Civic Problem Identification Assembly',
      type: 'meeting' as const,
      date: '2026-10-05',
      location: 'Ward 16 Youth Community Hall, Bardaghat',
      targetHours: 2,
      totalExpected: 5,
      totalPresent: 5,
    },
    {
      id: 'att-sess-3',
      chapterId: 'chap-1',
      title: 'Urgent Solid Waste Cleanup & Drainage Clearance Drive',
      type: 'project' as const,
      date: '2026-10-10',
      location: 'Postal Highway Roadside, Bardaghat-16',
      targetHours: 3,
      totalExpected: 5,
      totalPresent: 4,
    },
  ];

  let attendanceRecords: Record<string, {
    memberId: string;
    memberName: string;
    membershipId: string;
    avatar?: string;
    clubWing?: string;
    status: 'present' | 'absent' | 'late' | 'excused';
    checkInTime?: string;
    notes?: string;
    hoursAwarded: number;
  }> = {
    'att-sess-1_user-member': {
      memberId: 'user-member',
      memberName: 'Pradeep Chaudhary',
      membershipId: 'NYC-2022-118',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      clubWing: 'Cultural & Social Wing',
      status: 'present',
      checkInTime: '08:05 AM',
      notes: 'Planted 35 sal and neem saplings along bank.',
      hoursAwarded: 4,
    },
    'att-sess-1_user-member-2': {
      memberId: 'user-member-2',
      memberName: 'Sita Devkota',
      membershipId: 'NYC-2023-088',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
      clubWing: 'Environment & Climate Action',
      status: 'present',
      checkInTime: '07:55 AM',
      notes: 'Led student group from Ward 16 school.',
      hoursAwarded: 4,
    },
    'att-sess-1_user-member-3': {
      memberId: 'user-member-3',
      memberName: 'Rohan Shrestha',
      membershipId: 'NYC-2023-112',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
      clubWing: 'Disaster Relief & First Aid',
      status: 'present',
      checkInTime: '08:00 AM',
      notes: 'Managed tool distribution & hydration stand.',
      hoursAwarded: 4,
    },
    'att-sess-1_user-member-4': {
      memberId: 'user-member-4',
      memberName: 'Kripa Sharma',
      membershipId: 'NYC-2024-031',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      clubWing: 'Youth Education & Literacy',
      status: 'present',
      checkInTime: '08:15 AM',
      notes: 'Assisted documentation and attendance desk.',
      hoursAwarded: 4,
    },
    'att-sess-1_user-member-5': {
      memberId: 'user-member-5',
      memberName: 'Bikash Mahato',
      membershipId: 'NYC-2024-095',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
      clubWing: 'Sports & Wellness Wing',
      status: 'absent',
      notes: 'Exam preparation notice submitted.',
      hoursAwarded: 0,
    },
  };

  let promotionCandidates: Array<{
    id: string;
    chapterId: string;
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
  }> = [
    {
      id: 'prom-1',
      chapterId: 'chap-1',
      memberId: 'user-member-2',
      memberName: 'Sita Devkota',
      membershipId: 'NYC-2023-088',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
      currentRank: 'Active Volunteer',
      proposedRank: 'Squad Lead',
      volunteerHours: 78,
      attendanceRate: 96,
      projectsCompleted: 8,
      nominatedBy: 'Bibek Sharma (Chapter Lead)',
      nominatedDate: '2026-10-10',
      status: 'pending',
      criteriaMet: [
        '50+ Verified Volunteer Hours',
        '90%+ Attendance Rate Across Recent Drives',
        'Demonstrated Field Leadership in Environment Wing',
      ],
      allowedActions: ['promotion:approve', 'promotion:reject'],
    },
    {
      id: 'prom-2',
      chapterId: 'chap-1',
      memberId: 'user-member-3',
      memberName: 'Rohan Shrestha',
      membershipId: 'NYC-2023-112',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
      currentRank: 'Squad Lead',
      proposedRank: 'Wing Coordinator',
      volunteerHours: 142,
      attendanceRate: 92,
      projectsCompleted: 14,
      nominatedBy: 'Santosh Shrestha (Club President)',
      nominatedDate: '2026-10-08',
      status: 'pending',
      criteriaMet: [
        '100+ Verified Volunteer Hours',
        'Led 3+ Chapter Disaster Readiness Field Exercises',
        'Clean Disciplinary & Fiscal Transparency Record',
      ],
      allowedActions: ['promotion:approve', 'promotion:reject'],
    },
  ];

  let leaderActivityLogs: Array<{
    id: string;
    chapterId: string;
    action: string;
    performedBy: string;
    details: string;
    timestamp: string;
    type: 'member' | 'issue' | 'project' | 'attendance' | 'promotion';
  }> = [
    {
      id: 'act-1',
      chapterId: 'chap-1',
      action: 'Status Updated',
      performedBy: 'Bibek Sharma Adhikari (Chapter Lead)',
      details: 'Updated Issue #iss-2 (Solid Waste Accumulation) to "In Progress" with municipal tractor coordination note.',
      timestamp: '2026-10-13T10:30:00Z',
      type: 'issue',
    },
    {
      id: 'act-2',
      chapterId: 'chap-1',
      action: 'Attendance Recorded',
      performedBy: 'Bibek Sharma Adhikari (Chapter Lead)',
      details: 'Verified attendance for 4 volunteers at Bardaghat Watershed Tree Drive (16 volunteer hours credited).',
      timestamp: '2026-10-12T16:00:00Z',
      type: 'attendance',
    },
    {
      id: 'act-3',
      chapterId: 'chap-1',
      action: 'Promotion Nominated',
      performedBy: 'Bibek Sharma Adhikari (Chapter Lead)',
      details: 'Nominated Sita Devkota for promotion from Active Volunteer to Squad Lead.',
      timestamp: '2026-10-10T14:15:00Z',
      type: 'promotion',
    },
    {
      id: 'act-4',
      chapterId: 'chap-1',
      action: 'Issue Inspected',
      performedBy: 'Bibek Sharma Adhikari (Chapter Lead)',
      details: 'Conducted on-site inspection of Postal Highway clogged culvert with Ward 16 committee.',
      timestamp: '2026-10-09T11:45:00Z',
      type: 'issue',
    },
  ];

  // Helper to evaluate server-side leader authorization
  const evaluateLeaderAuth = (req: Request) => {
    const user = getUserFromToken(req);
    // Find chapter for this user (defaults to Bardaghat Chapter chap-1 for evaluation)
    const targetChapter = chapters.find(c => c.id === (user?.chapterId || 'chap-1')) || chapters[0];

    if (!user) {
      return {
        authorized: false,
        reason: 'unauthenticated',
        chapter: targetChapter,
        capabilities: {
          canViewMembers: false,
          canPromoteMembers: false,
          canAssignRoles: false,
          canSuspendMembers: false,
          canRemoveMembers: false,
          canManageIssues: false,
          canUpdateIssueStatus: false,
          canAddIssueNotes: false,
          canCreateProjects: false,
          canMarkAttendance: false,
          canExportAttendance: false,
          canManagePromotions: false,
        },
        allowedActions: [],
      };
    }

    const isLeader = user.role === 'chapter_leader' || user.role === 'admin';

    if (!isLeader) {
      return {
        authorized: false,
        userRole: user.role,
        userName: user.name,
        reason: 'insufficient_role_permissions',
        chapter: targetChapter,
        capabilities: {
          canViewMembers: false,
          canPromoteMembers: false,
          canAssignRoles: false,
          canSuspendMembers: false,
          canRemoveMembers: false,
          canManageIssues: false,
          canUpdateIssueStatus: false,
          canAddIssueNotes: false,
          canCreateProjects: false,
          canMarkAttendance: false,
          canExportAttendance: false,
          canManagePromotions: false,
        },
        allowedActions: [],
      };
    }

    // Role-authorized leader: return full server capabilities & explicit allowedActions
    const capabilities = {
      canViewMembers: true,
      canPromoteMembers: true,
      canAssignRoles: true,
      canSuspendMembers: true,
      canRemoveMembers: user.role === 'admin', // destructive removal restricted to admins
      canManageIssues: true,
      canUpdateIssueStatus: true,
      canAddIssueNotes: true,
      canCreateProjects: true,
      canMarkAttendance: true,
      canExportAttendance: true,
      canManagePromotions: true,
    };

    const allowedActions = [
      'member:view',
      'member:assign_wing',
      'member:promote',
      'member:suspend',
      ...(user.role === 'admin' ? ['member:remove'] : []),
      'issue:view',
      'issue:review',
      'issue:update_status',
      'issue:add_note',
      'project:create',
      'attendance:record',
      'attendance:update',
      'attendance:export',
      'promotion:approve',
      'promotion:reject',
      'promotion:nominate',
    ];

    return {
      authorized: true,
      userRole: user.role,
      userName: user.name,
      chapter: targetChapter,
      capabilities,
      allowedActions,
    };
  };

  // GET /api/leader/context
  app.get('/api/leader/context', (req: Request, res: Response) => {
    const auth = evaluateLeaderAuth(req);
    return res.json(auth);
  });

  // GET /api/leader/dashboard
  app.get('/api/leader/dashboard', (req: Request, res: Response) => {
    const auth = evaluateLeaderAuth(req);
    if (!auth.authorized) {
      return res.status(403).json({
        error: 'Access denied. Chapter leadership authorization required.',
        reason: auth.reason,
      });
    }

    const chapterMembers = users.filter(u => u.chapterId === auth.chapter.id || (!u.chapterId && u.role === 'member'));
    const chapterIssues = issues.filter(i =>
      i.location.toLowerCase().includes(auth.chapter.name.toLowerCase().replace(' chapter', '')) ||
      (i.district && auth.chapter.district.includes(i.district))
    );
    const chapterProjects = communityProjects.filter(p =>
      p.location.toLowerCase().includes(auth.chapter.name.toLowerCase().replace(' chapter', '')) ||
      p.location.toLowerCase().includes('bardaghat')
    );

    const totalVolunteerHours = chapterMembers.reduce((acc, curr) => acc + (curr.volunteerHours || 0), 0);
    const averageAttendance = Math.round(
      chapterMembers.reduce((acc, curr) => acc + (curr.attendanceRate || 85), 0) / (chapterMembers.length || 1)
    );

    const pendingActions = [
      {
        id: 'pend-1',
        type: 'issue_review' as const,
        title: 'Review Reported Solid Waste Culvert Clog',
        description: 'New photographs and resident reports in Ward 16 await municipal coordination.',
        targetId: 'iss-2',
        route: '/leader/issues',
        priority: 'urgent' as const,
        createdAt: '2026-10-13T08:00:00Z',
        allowedActions: ['issue:review', 'issue:update_status'],
      },
      {
        id: 'pend-2',
        type: 'promotion_approval' as const,
        title: 'Approve 2 Pending Volunteer Promotions',
        description: 'Sita Devkota & Rohan Shrestha have met required hours and attendance thresholds.',
        targetId: 'prom-1',
        route: '/leader/promotions',
        priority: 'high' as const,
        createdAt: '2026-10-11T12:00:00Z',
        allowedActions: ['promotion:approve', 'promotion:reject'],
      },
      {
        id: 'pend-3',
        type: 'attendance_due' as const,
        title: 'Finalize Attendance for Watershed Drive',
        description: 'Session records logged. 1 attendee marked absent pending verification.',
        targetId: 'att-sess-1',
        route: '/leader/attendance',
        priority: 'normal' as const,
        createdAt: '2026-10-12T17:00:00Z',
        allowedActions: ['attendance:record', 'attendance:update'],
      },
    ];

    const cleanMembers = chapterMembers.map(m => ({
      id: m.id,
      name: m.name,
      membershipId: m.membershipId,
      role: m.role,
      clubWing: m.clubWing,
      status: m.status,
      volunteerHours: m.volunteerHours || 0,
      avatar: m.avatar,
      rank: m.rank || 'Active Volunteer',
      ward: m.ward || '16',
    }));

    return res.json({
      chapter: auth.chapter,
      capabilities: auth.capabilities,
      allowedActions: auth.allowedActions,
      chapterActivity: {
        totalMembers: chapterMembers.length,
        activeProjects: chapterProjects.length,
        openIssues: chapterIssues.filter(i => i.status !== 'Resolved').length,
        resolvedIssues: chapterIssues.filter(i => i.status === 'Resolved').length,
        volunteerHoursLogged: totalVolunteerHours,
        averageAttendanceRate: averageAttendance,
      },
      members: cleanMembers,
      projects: chapterProjects.map(p => ({
        ...p,
        volunteersRegistered: p.participantsCount || 12,
        targetVolunteers: 25,
      })),
      issues: chapterIssues,
      pendingActions,
      recentActivity: leaderActivityLogs,
    });
  });

  // GET /api/leader/members
  app.get('/api/leader/members', (req: Request, res: Response) => {
    const auth = evaluateLeaderAuth(req);
    if (!auth.authorized) {
      return res.status(403).json({ error: 'Unauthorized to view chapter members' });
    }

    const chapterMembers = users.filter(u => u.chapterId === auth.chapter.id || (!u.chapterId && u.role === 'member'));

    const membersWithPermissions = chapterMembers.map(m => ({
      id: m.id,
      name: m.name,
      email: m.email,
      phone: m.phone || '+977-9847000000',
      membershipId: m.membershipId,
      role: m.role,
      clubWing: m.clubWing,
      status: m.status,
      joinedDate: m.joinedDate,
      volunteerHours: m.volunteerHours || 0,
      avatar: m.avatar,
      ward: m.ward || '16',
      attendanceRate: m.attendanceRate || 85,
      currentRank: m.rank || (m.volunteerHours && m.volunteerHours > 100 ? 'Squad Lead' : 'Active Volunteer'),
      allowedActions: [
        'view_contact',
        'assign_wing',
        'promote',
        m.status === 'active' ? 'suspend' : 'activate',
        ...(auth.capabilities.canRemoveMembers ? ['remove'] : []),
      ],
    }));

    return res.json({
      chapter: auth.chapter,
      members: membersWithPermissions,
      allowedActions: auth.allowedActions,
      capabilities: auth.capabilities,
    });
  });

  // POST /api/leader/members/:id/action
  app.post('/api/leader/members/:id/action', (req: Request, res: Response) => {
    const auth = evaluateLeaderAuth(req);
    if (!auth.authorized) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const { action, newWing, newStatus } = req.body;

    const targetUser = users.find(u => u.id === id);
    if (!targetUser) {
      return res.status(404).json({ error: 'Member not found' });
    }

    // Verify action is allowed
    if (action === 'remove' && !auth.capabilities.canRemoveMembers) {
      return res.status(403).json({ error: 'Removal of members requires Platform Administrator privilege' });
    }

    if (action === 'assign_wing') {
      if (!newWing) return res.status(400).json({ error: 'Target wing is required' });
      targetUser.clubWing = newWing;
      leaderActivityLogs.unshift({
        id: `act-${Date.now()}`,
        chapterId: auth.chapter.id,
        action: 'Wing Assigned',
        performedBy: `${auth.userName} (${auth.userRole})`,
        details: `Reassigned ${targetUser.name} to "${newWing}".`,
        timestamp: new Date().toISOString(),
        type: 'member',
      });
      return res.json({ message: `Successfully assigned ${targetUser.name} to ${newWing}`, member: targetUser });
    }

    if (action === 'suspend') {
      targetUser.status = 'suspended';
      leaderActivityLogs.unshift({
        id: `act-${Date.now()}`,
        chapterId: auth.chapter.id,
        action: 'Member Suspended',
        performedBy: `${auth.userName} (${auth.userRole})`,
        details: `Suspended membership for ${targetUser.name}.`,
        timestamp: new Date().toISOString(),
        type: 'member',
      });
      return res.json({ message: `Suspended member ${targetUser.name}`, member: targetUser });
    }

    if (action === 'activate') {
      targetUser.status = 'active';
      leaderActivityLogs.unshift({
        id: `act-${Date.now()}`,
        chapterId: auth.chapter.id,
        action: 'Member Activated',
        performedBy: `${auth.userName} (${auth.userRole})`,
        details: `Re-activated membership for ${targetUser.name}.`,
        timestamp: new Date().toISOString(),
        type: 'member',
      });
      return res.json({ message: `Activated member ${targetUser.name}`, member: targetUser });
    }

    if (action === 'remove') {
      const idx = users.findIndex(u => u.id === id);
      if (idx !== -1) {
        users.splice(idx, 1);
        leaderActivityLogs.unshift({
          id: `act-${Date.now()}`,
          chapterId: auth.chapter.id,
          action: 'Member Removed',
          performedBy: `${auth.userName} (${auth.userRole})`,
          details: `Permanently removed member ${targetUser.name} from club roster.`,
          timestamp: new Date().toISOString(),
          type: 'member',
        });
        return res.json({ message: `Removed member ${targetUser.name} from chapter` });
      }
    }

    return res.status(400).json({ error: 'Unknown member action' });
  });

  // GET /api/leader/issues
  app.get('/api/leader/issues', (req: Request, res: Response) => {
    const auth = evaluateLeaderAuth(req);
    if (!auth.authorized) {
      return res.status(403).json({ error: 'Unauthorized to review chapter issues' });
    }

    const chapterIssues = issues.filter(i =>
      i.location.toLowerCase().includes(auth.chapter.name.toLowerCase().replace(' chapter', '')) ||
      (i.district && auth.chapter.district.includes(i.district))
    );

    return res.json({
      chapter: auth.chapter,
      issues: chapterIssues,
      allowedActions: ['issue:view', 'issue:review', 'issue:update_status', 'issue:add_note'],
      capabilities: auth.capabilities,
      statusOptions: ['Reported', 'Under Review', 'Verified', 'In Progress', 'Resolved'],
    });
  });

  // POST /api/leader/issues/:id/status
  app.post('/api/leader/issues/:id/status', (req: Request, res: Response) => {
    const auth = evaluateLeaderAuth(req);
    if (!auth.authorized || !auth.capabilities.canUpdateIssueStatus) {
      return res.status(403).json({ error: 'Unauthorized to update issue status' });
    }

    const { id } = req.params;
    const { status, notes } = req.body;

    const targetIssue = issues.find(i => i.id === id);
    if (!targetIssue) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    const validStatuses = ['Reported', 'Under Review', 'Verified', 'In Progress', 'Resolved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid issue status' });
    }

    const oldStatus = targetIssue.status;
    targetIssue.status = status;

    // Add note to timeline
    if (!targetIssue.timeline) targetIssue.timeline = [];
    targetIssue.timeline.push({
      step: status,
      title: `Status changed to ${status}`,
      description: notes || `Updated by Chapter Leader ${auth.userName}.`,
      date: new Date().toISOString().split('T')[0],
      completed: true,
    });

    if (notes) {
      targetIssue.actionTaken = `${targetIssue.actionTaken || ''} [${status}]: ${notes}`.trim();
    }

    leaderActivityLogs.unshift({
      id: `act-${Date.now()}`,
      chapterId: auth.chapter.id,
      action: 'Issue Status Updated',
      performedBy: `${auth.userName} (${auth.userRole})`,
      details: `Changed "${targetIssue.title}" status from "${oldStatus}" to "${status}".`,
      timestamp: new Date().toISOString(),
      type: 'issue',
    });

    return res.json({
      message: `Issue status updated to ${status}`,
      issue: targetIssue,
    });
  });

  // POST /api/leader/issues/:id/notes
  app.post('/api/leader/issues/:id/notes', (req: Request, res: Response) => {
    const auth = evaluateLeaderAuth(req);
    if (!auth.authorized || !auth.capabilities.canAddIssueNotes) {
      return res.status(403).json({ error: 'Unauthorized to add issue notes' });
    }

    const { id } = req.params;
    const { note } = req.body;

    if (!note || !note.trim()) {
      return res.status(400).json({ error: 'Note text is required' });
    }

    const targetIssue = issues.find(i => i.id === id);
    if (!targetIssue) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    if (!targetIssue.timeline) targetIssue.timeline = [];
    targetIssue.timeline.push({
      step: 'Field Update',
      title: 'Chapter Action Note',
      description: note.trim(),
      date: new Date().toISOString().split('T')[0],
      completed: true,
    });

    targetIssue.actionTaken = `${targetIssue.actionTaken || ''} ${note.trim()}`.trim();

    leaderActivityLogs.unshift({
      id: `act-${Date.now()}`,
      chapterId: auth.chapter.id,
      action: 'Field Note Appended',
      performedBy: `${auth.userName} (${auth.userRole})`,
      details: `Added field progress note to issue "${targetIssue.title}".`,
      timestamp: new Date().toISOString(),
      type: 'issue',
    });

    return res.json({
      message: 'Field action note added successfully',
      issue: targetIssue,
    });
  });

  // POST /api/leader/projects/new
  app.post('/api/leader/projects/new', (req: Request, res: Response) => {
    const auth = evaluateLeaderAuth(req);
    if (!auth.authorized || !auth.capabilities.canCreateProjects) {
      return res.status(403).json({ error: 'Unauthorized to create projects' });
    }

    const {
      name,
      description,
      category,
      location,
      date,
      targetVolunteers,
      requiredSkills,
      volunteerHoursCredit,
      prerequisites,
      coordinatorNotes,
      images,
      imageUrl,
    } = req.body;

    if (!name || !description || !category || !location || !date) {
      return res.status(400).json({
        error: 'Name, description, category, location, and date are required.',
      });
    }

    const chosenImage = imageUrl || (images && images.length > 0 ? images[0] : '/src/assets/images/project_clean_water_1791953725518.jpg');

    const newProject = {
      id: `proj-${Date.now()}`,
      name,
      description,
      category,
      location,
      date,
      imageUrl: chosenImage,
      images: images && images.length > 0 ? images : [chosenImage],
      status: 'Upcoming' as const,
      participantsCount: 1, // Leader is automatically enrolled
      isParticipating: true,
      participationInfo: {
        targetVolunteers: Number(targetVolunteers) || 20,
        requiredSkills: requiredSkills || 'Youth enthusiasm and civic commitment',
        volunteerHoursCredit: Number(volunteerHoursCredit) || 4,
        prerequisites: prerequisites || 'Open to all registered chapter members',
        coordinatorNotes: coordinatorNotes || `Coordinated by ${auth.userName}`,
      },
    };

    communityProjects.unshift(newProject);

    // Auto-create an attendance session for this project
    const newSession = {
      id: `att-sess-${Date.now()}`,
      chapterId: auth.chapter.id,
      title: newProject.name,
      type: 'project' as const,
      date: newProject.date,
      location: newProject.location,
      targetHours: Number(volunteerHoursCredit) || 4,
      totalExpected: users.filter(u => u.chapterId === auth.chapter.id).length,
      totalPresent: 0,
    };
    attendanceSessions.unshift(newSession);

    leaderActivityLogs.unshift({
      id: `act-${Date.now()}`,
      chapterId: auth.chapter.id,
      action: 'Project Created',
      performedBy: `${auth.userName} (${auth.userRole})`,
      details: `Launched community project "${name}" in ${location}.`,
      timestamp: new Date().toISOString(),
      type: 'project',
    });

    return res.status(201).json({
      message: 'Chapter project created successfully',
      project: newProject,
    });
  });

  // GET /api/leader/attendance
  app.get('/api/leader/attendance', (req: Request, res: Response) => {
    const auth = evaluateLeaderAuth(req);
    if (!auth.authorized || !auth.capabilities.canMarkAttendance) {
      return res.status(403).json({ error: 'Unauthorized to access attendance module' });
    }

    const chapterSessions = attendanceSessions.filter(s => s.chapterId === auth.chapter.id);
    const activeSessionId = (req.query.sessionId as string) || (chapterSessions[0] ? chapterSessions[0].id : '');
    const activeSession = chapterSessions.find(s => s.id === activeSessionId) || chapterSessions[0];

    const chapterMembers = users.filter(u => u.chapterId === auth.chapter.id || (!u.chapterId && u.role === 'member'));

    const records = chapterMembers.map(m => {
      const key = `${activeSession?.id}_${m.id}`;
      const existing = attendanceRecords[key];
      return existing || {
        memberId: m.id,
        memberName: m.name,
        membershipId: m.membershipId,
        avatar: m.avatar,
        clubWing: m.clubWing,
        status: 'absent' as const,
        hoursAwarded: 0,
      };
    });

    return res.json({
      chapter: auth.chapter,
      sessions: chapterSessions,
      activeSessionId: activeSession ? activeSession.id : '',
      records,
      allowedActions: ['attendance:mark', 'attendance:update', 'attendance:export'],
      capabilities: auth.capabilities,
    });
  });

  // POST /api/leader/attendance/mark
  app.post('/api/leader/attendance/mark', (req: Request, res: Response) => {
    const auth = evaluateLeaderAuth(req);
    if (!auth.authorized || !auth.capabilities.canMarkAttendance) {
      return res.status(403).json({ error: 'Unauthorized to mark attendance' });
    }

    const { sessionId, records } = req.body;
    if (!sessionId || !Array.isArray(records)) {
      return res.status(400).json({ error: 'Session ID and records array are required' });
    }

    const session = attendanceSessions.find(s => s.id === sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Attendance session not found' });
    }

    let presentCount = 0;

    for (const item of records) {
      const key = `${sessionId}_${item.memberId}`;
      const user = users.find(u => u.id === item.memberId);
      const isPresent = item.status === 'present';
      const hours = isPresent ? session.targetHours : item.status === 'late' ? Math.round(session.targetHours * 0.75) : 0;

      if (isPresent || item.status === 'late') {
        presentCount += 1;
      }

      // If newly marked present, update volunteer hours
      if (user && isPresent && (!attendanceRecords[key] || attendanceRecords[key].status !== 'present')) {
        user.volunteerHours = (user.volunteerHours || 0) + session.targetHours;
      }

      attendanceRecords[key] = {
        memberId: item.memberId,
        memberName: user ? user.name : 'Member',
        membershipId: user ? user.membershipId : 'NYC-000',
        avatar: user ? user.avatar : '',
        clubWing: user ? user.clubWing : 'General',
        status: item.status,
        checkInTime: item.status === 'present' ? (attendanceRecords[key]?.checkInTime || 'Checked in') : undefined,
        notes: item.notes || '',
        hoursAwarded: hours,
      };
    }

    session.totalPresent = presentCount;

    leaderActivityLogs.unshift({
      id: `act-${Date.now()}`,
      chapterId: auth.chapter.id,
      action: 'Attendance Saved',
      performedBy: `${auth.userName} (${auth.userRole})`,
      details: `Saved attendance for "${session.title}" (${presentCount} present out of ${records.length} rostered).`,
      timestamp: new Date().toISOString(),
      type: 'attendance',
    });

    return res.json({
      message: 'Attendance saved successfully',
      session,
      presentCount,
    });
  });

  // GET /api/leader/promotions
  app.get('/api/leader/promotions', (req: Request, res: Response) => {
    const auth = evaluateLeaderAuth(req);
    if (!auth.authorized || !auth.capabilities.canManagePromotions) {
      return res.status(403).json({ error: 'Unauthorized to manage member promotions' });
    }

    const chapterCandidates = promotionCandidates.filter(p => p.chapterId === auth.chapter.id);

    return res.json({
      chapter: auth.chapter,
      candidates: chapterCandidates,
      allowedActions: ['promotion:approve', 'promotion:reject', 'promotion:nominate'],
      capabilities: auth.capabilities,
      rankHierarchy: [
        'General Member',
        'Active Volunteer',
        'Squad Lead',
        'Wing Coordinator',
        'Deputy Chapter Lead',
        'Chapter Coordinator',
      ],
    });
  });

  // POST /api/leader/promotions/:id/action
  app.post('/api/leader/promotions/:id/action', (req: Request, res: Response) => {
    const auth = evaluateLeaderAuth(req);
    if (!auth.authorized || !auth.capabilities.canManagePromotions) {
      return res.status(403).json({ error: 'Unauthorized to execute promotion actions' });
    }

    const { id } = req.params;
    const { action, memberId, proposedRank, reason } = req.body;

    if (action === 'nominate') {
      if (!memberId || !proposedRank) {
        return res.status(400).json({ error: 'Member and proposed rank are required for nomination' });
      }
      const member = users.find(u => u.id === memberId);
      if (!member) return res.status(404).json({ error: 'Member not found' });

      const newCandidate = {
        id: `prom-${Date.now()}`,
        chapterId: auth.chapter.id,
        memberId: member.id,
        memberName: member.name,
        membershipId: member.membershipId,
        avatar: member.avatar,
        currentRank: member.rank || 'Active Volunteer',
        proposedRank,
        volunteerHours: member.volunteerHours || 0,
        attendanceRate: member.attendanceRate || 85,
        projectsCompleted: 5,
        nominatedBy: `${auth.userName} (${auth.userRole})`,
        nominatedDate: new Date().toISOString().split('T')[0],
        status: 'pending' as const,
        criteriaMet: [
          `${member.volunteerHours || 0} Hours Logged`,
          `${member.attendanceRate || 85}% Attendance Recorded`,
          reason || 'Recommended by Chapter Leadership',
        ],
        allowedActions: ['promotion:approve', 'promotion:reject'],
      };

      promotionCandidates.unshift(newCandidate);

      leaderActivityLogs.unshift({
        id: `act-${Date.now()}`,
        chapterId: auth.chapter.id,
        action: 'Promotion Nominated',
        performedBy: `${auth.userName} (${auth.userRole})`,
        details: `Nominated ${member.name} for "${proposedRank}".`,
        timestamp: new Date().toISOString(),
        type: 'promotion',
      });

      return res.status(201).json({
        message: `Nominated ${member.name} for ${proposedRank}`,
        candidate: newCandidate,
      });
    }

    const candidate = promotionCandidates.find(p => p.id === id);
    if (!candidate) {
      return res.status(404).json({ error: 'Promotion candidate not found' });
    }

    if (action === 'approve') {
      candidate.status = 'approved';
      const user = users.find(u => u.id === candidate.memberId);
      if (user) {
        user.rank = candidate.proposedRank;
      }
      leaderActivityLogs.unshift({
        id: `act-${Date.now()}`,
        chapterId: auth.chapter.id,
        action: 'Promotion Approved',
        performedBy: `${auth.userName} (${auth.userRole})`,
        details: `Approved promotion for ${candidate.memberName} to "${candidate.proposedRank}".`,
        timestamp: new Date().toISOString(),
        type: 'promotion',
      });
      return res.json({
        message: `Successfully promoted ${candidate.memberName} to ${candidate.proposedRank}!`,
        candidate,
      });
    }

    if (action === 'reject') {
      candidate.status = 'rejected';
      leaderActivityLogs.unshift({
        id: `act-${Date.now()}`,
        chapterId: auth.chapter.id,
        action: 'Promotion Rejected',
        performedBy: `${auth.userName} (${auth.userRole})`,
        details: `Declined promotion for ${candidate.memberName}.`,
        timestamp: new Date().toISOString(),
        type: 'promotion',
      });
      return res.json({
        message: `Declined promotion for ${candidate.memberName}`,
        candidate,
      });
    }

    return res.status(400).json({ error: 'Invalid promotion action' });
  });

  // ========================================================================
  // PHASE 12: PLATFORM ADMINISTRATION BACKEND STATE & ENDPOINTS
  // ========================================================================

  let moderationQueue: Array<{
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
  }> = [
    {
      id: 'mod-1',
      itemType: 'issue',
      targetId: 'iss-mod-1',
      targetTitle: 'Commercial advertising banner reported as drainage hazard',
      reportedReason: 'Suspected commercial business advertising disguised as municipal flood risk complaint.',
      reportedBy: 'Kishore Jha (Civic Auditor)',
      reportedDate: '2026-10-14',
      status: 'pending',
      riskLevel: 'medium',
      excerpt: 'Special 50% discount offers on groceries outside the private commercial warehouse...',
      allowedActions: ['approve_content', 'dismiss_flag', 'quarantine_content', 'delete_content', 'warn_user'],
    },
    {
      id: 'mod-2',
      itemType: 'comment',
      targetId: 'iss-1-comm-4',
      targetTitle: 'Abusive language on Janakpur Water Pipeline report',
      reportedReason: 'Harassment and aggressive personal threats directed at ward utility technicians.',
      reportedBy: 'Automated Language Filter',
      reportedDate: '2026-10-13',
      status: 'pending',
      riskLevel: 'high',
      excerpt: 'Contains flagged hostile language targeting municipal utility repair team members.',
      allowedActions: ['approve_content', 'dismiss_flag', 'quarantine_content', 'delete_content', 'suspend_user'],
    },
    {
      id: 'mod-3',
      itemType: 'member_profile',
      targetId: 'user-unverified-9',
      targetTitle: 'Suspicious membership submission: duplicate citizenship ID',
      reportedReason: 'Duplicate phone number and invalid citizenship image scan submitted during onboarding.',
      reportedBy: 'System Integrity Check',
      reportedDate: '2026-10-12',
      status: 'quarantined',
      riskLevel: 'critical',
      excerpt: 'Multiple consecutive registration submissions from flagged external IP address.',
      allowedActions: ['approve_content', 'dismiss_flag', 'delete_content', 'suspend_user'],
    },
  ];

  let platformConfig = {
    organizationName: 'Nawa Yuwa Club (Central Committee)',
    helplinePhone: '+977-9857012345',
    supportEmail: 'central@nawayuwaclub.org',
    currentFiscalYear: '2081/82 BS',
    autoVerifyTrustedReporters: true,
    requirePhoneOtpForReporting: false,
    publicFinancialTransparency: true,
    allowDirectMemberApplications: true,
    minVolunteerHoursForSquadLead: 50,
    minVolunteerHoursForCoordinator: 100,
    maxUploadFileSizeMb: 10,
    flaggingKeywords: ['spam', 'buy now', 'promo', 'gambling', 'offensive', 'scam'],
  };

  let auditRecords: Array<{
    id: string;
    actor: {
      name: string;
      role: string;
      identifier: string;
    };
    action: string;
    resource: string;
    date: string;
    result: 'SUCCESS' | 'DENIED' | 'FLAGGED';
    details: string;
  }> = [
    {
      id: 'aud-1',
      actor: { name: 'Santosh Shrestha', role: 'admin', identifier: 'NYC-2005-001' },
      action: 'PROMOTION_APPROVED',
      resource: 'User: Rohan Shrestha (Wing Coordinator)',
      date: '2026-10-14T09:12:00Z',
      result: 'SUCCESS',
      details: 'Executive presidential confirmation of regional leadership promotion.',
    },
    {
      id: 'aud-2',
      actor: { name: 'Santosh Shrestha', role: 'admin', identifier: 'NYC-2005-001' },
      action: 'CONFIG_UPDATED',
      resource: 'Settings: Fiscal Transparency',
      date: '2026-10-13T14:40:00Z',
      result: 'SUCCESS',
      details: 'Updated public transparency disclosures and financial balance sheet rules.',
    },
    {
      id: 'aud-3',
      actor: { name: 'Bibek Sharma Adhikari', role: 'chapter_leader', identifier: 'NYC-2021-002' },
      action: 'ISSUE_STATUS_UPDATE',
      resource: 'Issue #iss-2',
      date: '2026-10-13T10:30:00Z',
      result: 'SUCCESS',
      details: 'Updated Postal Highway issue status to "In Progress".',
    },
    {
      id: 'aud-4',
      actor: { name: 'Security Monitor', role: 'system', identifier: 'SYS-INTEGRITY' },
      action: 'MODERATION_FLAGGED',
      resource: 'Issue #iss-mod-1',
      date: '2026-10-13T08:15:00Z',
      result: 'FLAGGED',
      details: 'Automated filter quarantined suspected promotional link.',
    },
    {
      id: 'aud-5',
      actor: { name: 'Unauthenticated Client', role: 'anonymous', identifier: 'ANON-CLIENT' },
      action: 'ADMIN_ROUTE_ACCESS_ATTEMPT',
      resource: '/api/admin/config',
      date: '2026-10-12T22:04:00Z',
      result: 'DENIED',
      details: 'Blocked unauthorized settings mutation without Bearer credentials.',
    },
  ];

  const appendAuditLog = (
    actor: { name: string; role: string; identifier: string },
    action: string,
    resource: string,
    result: 'SUCCESS' | 'DENIED' | 'FLAGGED',
    details: string
  ) => {
    auditRecords.unshift({
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      actor,
      action,
      resource,
      date: new Date().toISOString(),
      result,
      details,
    });
  };

  const evaluateAdminAuth = (req: Request) => {
    const user = getUserFromToken(req);

    if (!user) {
      appendAuditLog(
        { name: 'Unauthenticated Visitor', role: 'guest', identifier: 'ANON' },
        'ADMIN_AUTH_CHECK',
        req.path,
        'DENIED',
        'Authentication token missing or invalid.'
      );
      return {
        authorized: false,
        reason: 'unauthenticated',
        capabilities: {
          canManageChapters: false,
          canCreateChapter: false,
          canUpdateChapter: false,
          canPauseChapter: false,
          canManagePromotions: false,
          canApprovePromotions: false,
          canRevokePromotions: false,
          canManageModeration: false,
          canQuarantineContent: false,
          canDeleteContent: false,
          canManageConfig: false,
          canViewAudit: false,
          canExportAudit: false,
        },
        allowedActions: [],
      };
    }

    if (user.role !== 'admin') {
      appendAuditLog(
        { name: user.name, role: user.role, identifier: user.membershipId || user.id },
        'ADMIN_AUTH_CHECK',
        req.path,
        'DENIED',
        `User with role "${user.role}" attempted platform admin access.`
      );
      return {
        authorized: false,
        userRole: user.role,
        userName: user.name,
        reason: 'insufficient_role_permissions',
        capabilities: {
          canManageChapters: false,
          canCreateChapter: false,
          canUpdateChapter: false,
          canPauseChapter: false,
          canManagePromotions: false,
          canApprovePromotions: false,
          canRevokePromotions: false,
          canManageModeration: false,
          canQuarantineContent: false,
          canDeleteContent: false,
          canManageConfig: false,
          canViewAudit: false,
          canExportAudit: false,
        },
        allowedActions: [],
      };
    }

    // Role is admin: granted full central platform capabilities
    const capabilities = {
      canManageChapters: true,
      canCreateChapter: true,
      canUpdateChapter: true,
      canPauseChapter: true,
      canManagePromotions: true,
      canApprovePromotions: true,
      canRevokePromotions: true,
      canManageModeration: true,
      canQuarantineContent: true,
      canDeleteContent: true,
      canManageConfig: true,
      canViewAudit: true,
      canExportAudit: true,
    };

    const allowedActions = [
      'chapter:create',
      'chapter:edit',
      'chapter:pause',
      'chapter:activate',
      'chapter:archive',
      'promotion:approve',
      'promotion:reject',
      'promotion:revoke',
      'moderation:approve',
      'moderation:dismiss',
      'moderation:quarantine',
      'moderation:delete',
      'moderation:warn_user',
      'moderation:suspend_user',
      'config:update',
      'audit:view',
      'audit:export',
    ];

    return {
      authorized: true,
      userRole: user.role,
      userName: user.name,
      capabilities,
      allowedActions,
    };
  };

  // GET /api/admin/context
  app.get('/api/admin/context', (req: Request, res: Response) => {
    const auth = evaluateAdminAuth(req);
    return res.json(auth);
  });

  // GET /api/admin/dashboard
  app.get('/api/admin/dashboard', (req: Request, res: Response) => {
    const auth = evaluateAdminAuth(req);
    if (!auth.authorized) {
      return res.status(403).json({
        error: 'Access denied. Central Platform Administration privileges required.',
        reason: auth.reason,
      });
    }

    const provinces = new Set(chapters.map(c => c.province));
    const activeChaps = chapters.filter(c => c.status !== 'paused');
    const openIss = issues.filter(i => i.status !== 'Resolved');
    const resIss = issues.filter(i => i.status === 'Resolved');
    const pendingMods = moderationQueue.filter(m => m.status === 'pending');

    const adminPendingActions = [
      {
        id: 'adm-pend-1',
        type: 'moderation' as const,
        title: `${pendingMods.length} Flagged Items in Moderation Queue`,
        description: 'Commercial spam report and flagged hostile comments require administrator determination.',
        targetId: 'mod-1',
        route: '/admin/moderation',
        priority: 'urgent' as const,
        createdAt: '2026-10-14T07:00:00Z',
        allowedActions: ['moderation:quarantine', 'moderation:dismiss'],
      },
      {
        id: 'adm-pend-2',
        type: 'promotion_final' as const,
        title: 'Executive Confirmation for 2 Regional Promotions',
        description: 'Sita Devkota (Squad Lead) & Rohan Shrestha (Wing Coordinator) submitted by Bardaghat Chapter.',
        targetId: 'prom-1',
        route: '/admin/promotions',
        priority: 'high' as const,
        createdAt: '2026-10-13T16:00:00Z',
        allowedActions: ['promotion:approve', 'promotion:reject'],
      },
      {
        id: 'adm-pend-3',
        type: 'chapter_approval' as const,
        title: 'Quarterly Audit Review for 6 Active Chapters',
        description: 'Verify meeting schedules, coordinator certifications, and community project hours across Madhesh and Lumbini.',
        targetId: 'chap-1',
        route: '/admin/chapters',
        priority: 'normal' as const,
        createdAt: '2026-10-12T11:00:00Z',
        allowedActions: ['chapter:edit', 'chapter:pause'],
      },
    ];

    return res.json({
      capabilities: auth.capabilities,
      allowedActions: auth.allowedActions,
      summary: {
        totalChapters: chapters.length,
        activeChapters: activeChaps.length,
        provincesCovered: provinces.size,
        totalProjects: communityProjects.length,
        activeProjects: communityProjects.filter(p => p.status !== 'Completed').length,
        totalIssues: issues.length,
        openIssues: openIss.length,
        resolvedIssues: resIss.length,
        moderationPending: pendingMods.length,
        totalMembers: users.length,
      },
      chapters: chapters.map(c => ({
        ...c,
        status: c.status || 'active',
      })),
      projects: communityProjects,
      issues: issues,
      moderationQueue,
      pendingActions: adminPendingActions,
      recentActivity: auditRecords.slice(0, 8),
    });
  });

  // GET /api/admin/chapters
  app.get('/api/admin/chapters', (req: Request, res: Response) => {
    const auth = evaluateAdminAuth(req);
    if (!auth.authorized) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const enhancedChapters = chapters.map(c => {
      const memberCount = users.filter(u => u.chapterId === c.id).length;
      return {
        ...c,
        status: c.status || 'active',
        totalMembersCount: memberCount > 0 ? memberCount : 12,
        allowedActions: ['edit', 'pause', 'activate', 'archive'],
      };
    });

    const provinces = Array.from(new Set(chapters.map(c => c.province)));

    return res.json({
      chapters: enhancedChapters,
      capabilities: auth.capabilities,
      allowedActions: auth.allowedActions,
      provinces,
    });
  });

  // POST /api/admin/chapters
  app.post('/api/admin/chapters', (req: Request, res: Response) => {
    const auth = evaluateAdminAuth(req);
    if (!auth.authorized || !auth.capabilities.canCreateChapter) {
      return res.status(403).json({ error: 'Unauthorized to create chapter' });
    }

    const {
      name,
      location,
      province,
      district,
      localLevel,
      shortDescription,
      about,
      coordinatorName,
      coordinatorContact,
      meetingSchedule,
      meetingPlace,
    } = req.body;

    if (!name || !location || !province || !district) {
      return res.status(400).json({ error: 'Name, location, province, and district are required.' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newChapter = {
      id: `chap-${Date.now()}`,
      slug,
      name,
      location,
      province,
      district,
      localLevel: localLevel || '',
      shortDescription: shortDescription || 'Newly chartered Nawa Yuwa Club youth community chapter.',
      about: about || 'Spearheading local civic youth initiatives and transparent community development.',
      recentActivity: 'Chapter charter approved by Central Platform Administration.',
      projectsCompleted: 0,
      issuesResolved: 0,
      lastActive: 'Chartered today',
      meetingSchedule: meetingSchedule || 'Every Saturday at 8:00 AM',
      meetingPlace: meetingPlace || `${location} Community Center`,
      coordinatorName: coordinatorName || 'Assigned Chapter Coordinator',
      coordinatorContact: coordinatorContact || '+977-9800000000',
      establishedYear: new Date().getFullYear(),
      status: 'active',
    };

    chapters.unshift(newChapter);

    appendAuditLog(
      { name: auth.userName || 'Admin', role: 'admin', identifier: 'NYC-CENTRAL' },
      'CHAPTER_CREATED',
      `Chapter: ${name} (${province})`,
      'SUCCESS',
      `Chartered new chapter in ${district}, ${province}.`
    );

    return res.status(201).json({
      message: `Chapter "${name}" established successfully.`,
      chapter: newChapter,
    });
  });

  // PATCH /api/admin/chapters/:id
  app.patch('/api/admin/chapters/:id', (req: Request, res: Response) => {
    const auth = evaluateAdminAuth(req);
    if (!auth.authorized || !auth.capabilities.canUpdateChapter) {
      return res.status(403).json({ error: 'Unauthorized to update chapter' });
    }

    const { id } = req.params;
    const chap = chapters.find(c => c.id === id || c.slug === id);
    if (!chap) {
      return res.status(404).json({ error: 'Chapter not found' });
    }

    const {
      name,
      coordinatorName,
      coordinatorContact,
      location,
      meetingSchedule,
      meetingPlace,
      shortDescription,
      about,
      status,
    } = req.body;

    if (name) chap.name = name;
    if (coordinatorName) chap.coordinatorName = coordinatorName;
    if (coordinatorContact) chap.coordinatorContact = coordinatorContact;
    if (location) chap.location = location;
    if (meetingSchedule) chap.meetingSchedule = meetingSchedule;
    if (meetingPlace) chap.meetingPlace = meetingPlace;
    if (shortDescription) chap.shortDescription = shortDescription;
    if (about) chap.about = about;
    if (status) chap.status = status;

    appendAuditLog(
      { name: auth.userName || 'Admin', role: 'admin', identifier: 'NYC-CENTRAL' },
      'CHAPTER_UPDATED',
      `Chapter: ${chap.name}`,
      'SUCCESS',
      `Updated executive records for ${chap.name}.`
    );

    return res.json({
      message: 'Chapter details updated successfully',
      chapter: chap,
    });
  });

  // POST /api/admin/chapters/:id/action
  app.post('/api/admin/chapters/:id/action', (req: Request, res: Response) => {
    const auth = evaluateAdminAuth(req);
    if (!auth.authorized) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const { action } = req.body;
    const chap = chapters.find(c => c.id === id || c.slug === id);
    if (!chap) {
      return res.status(404).json({ error: 'Chapter not found' });
    }

    if (action === 'pause') {
      chap.status = 'paused';
      appendAuditLog(
        { name: auth.userName || 'Admin', role: 'admin', identifier: 'NYC-CENTRAL' },
        'CHAPTER_PAUSED',
        `Chapter: ${chap.name}`,
        'SUCCESS',
        `Temporarily paused chapter operations for administrative review.`
      );
      return res.json({ message: `Chapter ${chap.name} has been paused.`, chapter: chap });
    }

    if (action === 'activate') {
      chap.status = 'active';
      appendAuditLog(
        { name: auth.userName || 'Admin', role: 'admin', identifier: 'NYC-CENTRAL' },
        'CHAPTER_ACTIVATED',
        `Chapter: ${chap.name}`,
        'SUCCESS',
        `Re-activated full chapter charter.`
      );
      return res.json({ message: `Chapter ${chap.name} is now active.`, chapter: chap });
    }

    if (action === 'archive') {
      chap.status = 'archived';
      appendAuditLog(
        { name: auth.userName || 'Admin', role: 'admin', identifier: 'NYC-CENTRAL' },
        'CHAPTER_ARCHIVED',
        `Chapter: ${chap.name}`,
        'SUCCESS',
        `Archived chapter records.`
      );
      return res.json({ message: `Chapter ${chap.name} archived.`, chapter: chap });
    }

    return res.status(400).json({ error: 'Unknown chapter action' });
  });

  // GET /api/admin/promotions
  app.get('/api/admin/promotions', (req: Request, res: Response) => {
    const auth = evaluateAdminAuth(req);
    if (!auth.authorized) {
      return res.status(403).json({ error: 'Unauthorized to review executive promotions' });
    }

    const candidatesWithChapter = promotionCandidates.map(c => {
      const chap = chapters.find(ch => ch.id === c.chapterId);
      return {
        ...c,
        chapterName: chap ? chap.name : 'Bardaghat Chapter',
        allowedActions: ['approve', 'reject', 'revoke'],
      };
    });

    return res.json({
      candidates: candidatesWithChapter,
      capabilities: auth.capabilities,
      allowedActions: auth.allowedActions,
      rankHierarchy: [
        'General Member',
        'Active Volunteer',
        'Squad Lead',
        'Wing Coordinator',
        'Deputy Chapter Lead',
        'Chapter Coordinator',
      ],
    });
  });

  // POST /api/admin/promotions/:id/action
  app.post('/api/admin/promotions/:id/action', (req: Request, res: Response) => {
    const auth = evaluateAdminAuth(req);
    if (!auth.authorized || !auth.capabilities.canApprovePromotions) {
      return res.status(403).json({ error: 'Unauthorized to decide promotions' });
    }

    const { id } = req.params;
    const { action } = req.body;

    const candidate = promotionCandidates.find(p => p.id === id);
    if (!candidate) {
      return res.status(404).json({ error: 'Promotion candidate not found' });
    }

    if (action === 'approve') {
      candidate.status = 'approved';
      const user = users.find(u => u.id === candidate.memberId);
      if (user) {
        user.rank = candidate.proposedRank;
      }
      appendAuditLog(
        { name: auth.userName || 'Central Admin', role: 'admin', identifier: 'NYC-PRESIDENT' },
        'EXECUTIVE_PROMOTION_APPROVED',
        `User: ${candidate.memberName} -> ${candidate.proposedRank}`,
        'SUCCESS',
        `Central presidential approval granted for rank advancement to "${candidate.proposedRank}".`
      );
      return res.json({
        message: `Executive approval granted: ${candidate.memberName} is promoted to ${candidate.proposedRank}.`,
        candidate,
      });
    }

    if (action === 'reject') {
      candidate.status = 'rejected';
      appendAuditLog(
        { name: auth.userName || 'Central Admin', role: 'admin', identifier: 'NYC-PRESIDENT' },
        'EXECUTIVE_PROMOTION_DECLINED',
        `User: ${candidate.memberName}`,
        'SUCCESS',
        `Promotion nomination declined by Central Administration.`
      );
      return res.json({ message: `Promotion nomination declined for ${candidate.memberName}.`, candidate });
    }

    if (action === 'revoke') {
      candidate.status = 'rejected';
      const user = users.find(u => u.id === candidate.memberId);
      if (user) {
        user.rank = 'Active Volunteer';
      }
      appendAuditLog(
        { name: auth.userName || 'Central Admin', role: 'admin', identifier: 'NYC-PRESIDENT' },
        'RANK_REVOKED',
        `User: ${candidate.memberName}`,
        'SUCCESS',
        `Rank revoked back to Active Volunteer.`
      );
      return res.json({ message: `Revoked rank for ${candidate.memberName}.`, candidate });
    }

    return res.status(400).json({ error: 'Invalid promotion action' });
  });

  // GET /api/admin/moderation
  app.get('/api/admin/moderation', (req: Request, res: Response) => {
    const auth = evaluateAdminAuth(req);
    if (!auth.authorized) {
      return res.status(403).json({ error: 'Unauthorized to view moderation queue' });
    }

    const pending = moderationQueue.filter(m => m.status === 'pending').length;
    const quarantined = moderationQueue.filter(m => m.status === 'quarantined').length;
    const dismissed = moderationQueue.filter(m => m.status === 'dismissed').length;

    return res.json({
      queue: moderationQueue,
      capabilities: auth.capabilities,
      allowedActions: auth.allowedActions,
      counts: {
        pending,
        quarantined,
        dismissed,
        total: moderationQueue.length,
      },
    });
  });

  // POST /api/admin/moderation/:id/action
  app.post('/api/admin/moderation/:id/action', (req: Request, res: Response) => {
    const auth = evaluateAdminAuth(req);
    if (!auth.authorized || !auth.capabilities.canManageModeration) {
      return res.status(403).json({ error: 'Unauthorized to moderate content' });
    }

    const { id } = req.params;
    const { action, notes } = req.body;

    const modItem = moderationQueue.find(m => m.id === id);
    if (!modItem) {
      return res.status(404).json({ error: 'Moderation item not found' });
    }

    if (action === 'dismiss_flag' || action === 'approve_content') {
      modItem.status = 'dismissed';
      appendAuditLog(
        { name: auth.userName || 'Moderator', role: 'admin', identifier: 'NYC-MOD-01' },
        'MODERATION_FLAG_DISMISSED',
        `${modItem.itemType}: ${modItem.targetTitle}`,
        'SUCCESS',
        `Flag dismissed as false positive. Content approved.`
      );
      return res.json({ message: 'Content approved and flag dismissed.', item: modItem });
    }

    if (action === 'quarantine_content') {
      modItem.status = 'quarantined';
      appendAuditLog(
        { name: auth.userName || 'Moderator', role: 'admin', identifier: 'NYC-MOD-01' },
        'CONTENT_QUARANTINED',
        `${modItem.itemType}: ${modItem.targetTitle}`,
        'SUCCESS',
        notes || 'Content quarantined pending verification.'
      );
      return res.json({ message: 'Content quarantined from public feeds.', item: modItem });
    }

    if (action === 'delete_content') {
      modItem.status = 'deleted';
      // If target was an issue, remove from issues array
      if (modItem.itemType === 'issue') {
        const issIdx = issues.findIndex(i => i.id === modItem.targetId);
        if (issIdx !== -1) issues.splice(issIdx, 1);
      }
      appendAuditLog(
        { name: auth.userName || 'Moderator', role: 'admin', identifier: 'NYC-MOD-01' },
        'CONTENT_PURGED',
        `${modItem.itemType}: ${modItem.targetTitle}`,
        'SUCCESS',
        notes || 'Permanently removed spam / violating content.'
      );
      return res.json({ message: 'Content permanently removed.', item: modItem });
    }

    if (action === 'warn_user') {
      appendAuditLog(
        { name: auth.userName || 'Moderator', role: 'admin', identifier: 'NYC-MOD-01' },
        'USER_WARNED',
        `Reporter/Author: ${modItem.reportedBy}`,
        'SUCCESS',
        'Official warning notice issued regarding community guidelines.'
      );
      return res.json({ message: `Warning issued to author of ${modItem.targetTitle}.`, item: modItem });
    }

    if (action === 'suspend_user') {
      appendAuditLog(
        { name: auth.userName || 'Moderator', role: 'admin', identifier: 'NYC-MOD-01' },
        'USER_SUSPENDED',
        `Target Author: ${modItem.targetTitle}`,
        'SUCCESS',
        'Account suspended due to policy violation.'
      );
      return res.json({ message: 'User suspended from reporting.', item: modItem });
    }

    return res.status(400).json({ error: 'Invalid moderation action' });
  });

  // GET /api/admin/config
  app.get('/api/admin/config', (req: Request, res: Response) => {
    const auth = evaluateAdminAuth(req);
    if (!auth.authorized) {
      return res.status(403).json({ error: 'Unauthorized to view platform config' });
    }

    return res.json({
      config: platformConfig,
      capabilities: auth.capabilities,
      allowedActions: ['config:update'],
    });
  });

  // PATCH /api/admin/config
  app.patch('/api/admin/config', (req: Request, res: Response) => {
    const auth = evaluateAdminAuth(req);
    if (!auth.authorized || !auth.capabilities.canManageConfig) {
      return res.status(403).json({ error: 'Unauthorized to modify platform configuration' });
    }

    const updates = req.body;
    if (updates.organizationName) platformConfig.organizationName = String(updates.organizationName).trim();
    if (updates.helplinePhone) platformConfig.helplinePhone = String(updates.helplinePhone).trim();
    if (updates.supportEmail) platformConfig.supportEmail = String(updates.supportEmail).trim();
    if (updates.currentFiscalYear) platformConfig.currentFiscalYear = String(updates.currentFiscalYear).trim();
    if (typeof updates.autoVerifyTrustedReporters === 'boolean') {
      platformConfig.autoVerifyTrustedReporters = updates.autoVerifyTrustedReporters;
    }
    if (typeof updates.requirePhoneOtpForReporting === 'boolean') {
      platformConfig.requirePhoneOtpForReporting = updates.requirePhoneOtpForReporting;
    }
    if (typeof updates.publicFinancialTransparency === 'boolean') {
      platformConfig.publicFinancialTransparency = updates.publicFinancialTransparency;
    }
    if (typeof updates.allowDirectMemberApplications === 'boolean') {
      platformConfig.allowDirectMemberApplications = updates.allowDirectMemberApplications;
    }
    if (Number(updates.minVolunteerHoursForSquadLead) > 0) {
      platformConfig.minVolunteerHoursForSquadLead = Number(updates.minVolunteerHoursForSquadLead);
    }
    if (Number(updates.minVolunteerHoursForCoordinator) > 0) {
      platformConfig.minVolunteerHoursForCoordinator = Number(updates.minVolunteerHoursForCoordinator);
    }
    if (Array.isArray(updates.flaggingKeywords)) {
      platformConfig.flaggingKeywords = updates.flaggingKeywords.map((k: string) => String(k).trim()).filter(Boolean);
    }

    appendAuditLog(
      { name: auth.userName || 'Central Admin', role: 'admin', identifier: 'NYC-PRESIDENT' },
      'PLATFORM_SETTINGS_MUTATION',
      'Configuration: Global Core Settings',
      'SUCCESS',
      'Updated platform rules, thresholds, and operational flags.'
    );

    return res.json({
      message: 'Platform configuration updated successfully.',
      config: platformConfig,
    });
  });

  // GET /api/admin/audit
  app.get('/api/admin/audit', (req: Request, res: Response) => {
    const auth = evaluateAdminAuth(req);
    if (!auth.authorized || !auth.capabilities.canViewAudit) {
      return res.status(403).json({ error: 'Unauthorized to view audit registry' });
    }

    const { action, result, search } = req.query;

    let filtered = [...auditRecords];

    if (action && action !== 'all') {
      filtered = filtered.filter(a => a.action === action);
    }
    if (result && result !== 'all') {
      filtered = filtered.filter(a => a.result === result);
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      filtered = filtered.filter(a =>
        a.actor.name.toLowerCase().includes(q) ||
        a.resource.toLowerCase().includes(q) ||
        a.action.toLowerCase().includes(q) ||
        a.details.toLowerCase().includes(q)
      );
    }

    const actionTypes = Array.from(new Set(auditRecords.map(a => a.action)));

    return res.json({
      records: filtered,
      capabilities: auth.capabilities,
      allowedActions: ['audit:view', 'audit:export'],
      actionTypes,
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
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const PORT = Number(process.env.PORT) || 3000;
  const HOST = process.env.HOST || '0.0.0.0';
  app.listen(PORT, HOST, () => {
    console.log(`Nawa Yuwa Club server listening on http://${HOST}:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
