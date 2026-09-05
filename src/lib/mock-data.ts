import { Profile, SubscriptionPlan, Course, Subject, Chapter, Topic, MaterialWithDetails, AdminAuditLog, MaterialAccessLog } from "@/types";

export interface ProgramStructure {
  id: "BCOM" | "MCOM" | "CA" | "CMA";
  name: string;
  fullName: string;
  description: string;
  semestersOrGroups: string[];
}

export const COMMERCE_PROGRAMS: ProgramStructure[] = [
  {
    id: "BCOM",
    name: "B.COM",
    fullName: "Bachelor of Commerce (Honours / General)",
    description: "Comprehensive 8-Semester curriculum covering Financial Accounting, Costing, Taxation, Corporate Law, Auditing & Financial Management.",
    semestersOrGroups: [
      "Semester 1",
      "Semester 2",
      "Semester 3",
      "Semester 4",
      "Semester 5",
      "Semester 6",
      "Semester 7",
      "Semester 8",
    ],
  },
  {
    id: "MCOM",
    name: "M.COM",
    fullName: "Master of Commerce (Postgraduate)",
    description: "Advanced 4-Semester postgraduate studies in Financial Reporting, Strategic Management Accounting, Corporate Tax Planning & Security Analysis.",
    semestersOrGroups: [
      "Semester 1",
      "Semester 2",
      "Semester 3",
      "Semester 4",
    ],
  },
  {
    id: "CA",
    name: "CA",
    fullName: "Chartered Accountancy (ICAI Curriculum)",
    description: "Targeted coaching for CA Foundation, CA Intermediate (Group 1 & 2), and CA Final with comprehensive scanner solutions.",
    semestersOrGroups: [
      "Foundation",
      "Intermediate - Group 1",
      "Intermediate - Group 2",
      "Final",
    ],
  },
  {
    id: "CMA",
    name: "CMA",
    fullName: "Cost & Management Accountancy (ICMAI Curriculum)",
    description: "Professional coaching for CMA Foundation, CMA Intermediate (Group 1 & 2), and CMA Final in Costing, SCM & Taxation.",
    semestersOrGroups: [
      "Foundation",
      "Intermediate - Group 1",
      "Intermediate - Group 2",
      "Final",
    ],
  },
];

export const MOCK_PLANS: SubscriptionPlan[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    name: "Standard Commerce Pass",
    code: "FREE",
    rank: 1,
    description: "Access to foundational summary notes, ledger formats, and introductory audio briefings.",
    price_cents: 0,
    duration_days: 365,
    is_default: true,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    name: "Pro Commerce Scholar",
    code: "PRO",
    rank: 2,
    description: "Unlocks full semester PDFs, scanner solved problems, taxation formula charts, and complete chapter audio lectures.",
    price_cents: 1499,
    duration_days: 30,
    is_default: false,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    name: "VIP Professional Pass",
    code: "PREMIUM",
    rank: 3,
    description: "Complete VIP access: solved university & professional scanner keys, CA/CMA masterclass audio recaps, and direct doubt notes.",
    price_cents: 2999,
    duration_days: 30,
    is_default: false,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
  },
];

export const MOCK_USERS: Array<Profile & { planCode: "FREE" | "PRO" | "PREMIUM"; demoPassword: string }> = [
  {
    id: "u-admin-master",
    full_name: "Pabir Paul (Faculty Admin)",
    email: "admin@debrajtuition.com",
    phone_number: "+91 98765 00001",
    address: "Pabir Paul Commerce Tuition Center, Kolkata",
    role: "admin",
    status: "approved",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    rejection_reason: null,
    planCode: "PREMIUM",
    demoPassword: "Admin@2026",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
];

export const MOCK_COURSES: (Course & { program: "BCOM" | "MCOM" | "CA" | "CMA"; semester: string })[] = [];

export const MOCK_SUBJECTS: Subject[] = [];

export const MOCK_CHAPTERS: Chapter[] = [];

export const MOCK_TOPICS: Topic[] = [];

export const MOCK_MATERIALS: MaterialWithDetails[] = [];

export const MOCK_ACCESS_LOGS: MaterialAccessLog[] = [];

export const MOCK_AUDIT_LOGS: AdminAuditLog[] = [];
