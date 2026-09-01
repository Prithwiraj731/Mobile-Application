# Pabir Paul's Tuition — Mobile Study App & Private Tuition Portal

A mobile-first, high-security tuition app and learning portal engineered for **Pabir Paul's Tuition**. Designed with controlled content delivery, teacher-verified student admissions, batch-specific enrollment clearance, and layered anti-leak deterrence.

---

## Mobile Application & PWA Architecture

1. **Mobile-First Touch & UX System**:
   - **Thumb Zone Navigation**: Sticky mobile bottom navigation bar (`<StudentBottomNav />`) with quick access to Dashboard, Batches, Tuition Passes, and Digital Student ID.
   - **Mobile Viewport & PWA Manifest**: Configured with `display: standalone`, `orientation: portrait-primary`, and safe area insets for iOS/Android home-screen installs.
   - **Responsive Protected Stage**: Mobile full-screen study viewer with gesture-friendly zoom, page flipping, and waveform audio playback.
   - **Student Digital ID Card**: Fast in-app verification card showing batch enrollment, student ID, and active clearance.

2. **Strong Layered Deterrence**:
   - Web & mobile apps cannot mathematically prevent third-party physical camera capture.
   - The platform enforces an ironclad multi-layered deterrent model:
     - **Private Object Storage**: All study files (PDFs, DPPs, schematics, audio) reside strictly in private Supabase Storage (`study-materials`). No public URLs exist.
     - **Server-Side Authorization Engine**: `canAccessMaterial()` directly verifies the authenticated user from the Supabase session, checks batch enrollment, active subscription rank, and publication state before issuing access.
     - **Cryptographic Short-Lived Signed URLs**: Short-lived signed URLs (120s TTL) are generated only after explicit policy clearance.
     - **Dynamic Personalized Watermarking**: Multi-angle SVG/canvas watermark overlay displaying student full name, email/phone, live timestamp, and unique session trace ID (`SEC-XXXX-XXXX`).
     - **Browser & App Deterrents**: Blocked right-click context menu, disabled text selection, and interception of `Ctrl+S`, `Ctrl+P`, `Ctrl+C`, `Ctrl+U`, and `@media print { display: none !important; }`.
     - **Forensic Audit Logs**: Every preview open and unauthorized attempt is recorded with IP address, user agent, session ID, and watermark payload.

3. **Full Supabase Backend Integration**:
   - **Supabase Auth**: Email/password authentication with `@supabase/ssr` cookies and middleware session refresh.
   - **Supabase PostgreSQL**: 14 relational tables with foreign keys, cascading deletions, unique constraints, and optimized indexes.
   - **Supabase Row Level Security (RLS)**: Database-level policy protection preventing unauthorized reads/writes.
   - **Supabase Storage**: Private `study-materials` bucket with restrictive storage policies.
   - **Server-Only Service Role Key**: Privileged operations utilize `createAdminClient()` strictly guarded by `import 'server-only'`.

---

## Database Architecture (14 Tables)

| Table | Description |
| :--- | :--- |
| `profiles` | Student and Administrator profiles linked 1:1 with `auth.users` |
| `subscription_plans` | Plans (`FREE`, `PRO`, `PREMIUM`) with rank hierarchies (1, 2, 3) |
| `student_subscriptions` | Active and historical subscription grants with start and expiry timestamps |
| `courses` | Course and batch definitions with metadata and publication status |
| `student_course_enrollments` | Many-to-many relationship mapping students to assigned courses/batches |
| `subjects` | Subjects belonging to courses with ordering and unique slugs |
| `chapters` | Chapters belonging to subjects with ordering and unique slugs |
| `topics` | Topics belonging to chapters with ordering and unique slugs |
| `materials` | Study materials (`pdf`, `image`, `audio`, `text_note`) with access levels |
| `material_files` | Private storage references with MIME types, sizes, and file paths |
| `material_access_logs` | Forensic logs of authorized previews and blocked attempts |
| `admin_audit_logs` | Audit trail of all administrative decisions (approvals, plan allocations) |
| `device_sessions` | Active and revoked device tokens and client metadata |
| `notifications` | In-app institutional announcements and security alerts |

---

## Getting Started & Local Development

### 1. Prerequisites
- Node.js `v18+` or `v20+`
- npm `v10+`
- A Supabase Project (Cloud instance or local Supabase CLI)

### 2. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Populate the keys from your Supabase Dashboard (**Settings -> API**):
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key # Strictly server-only
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Database Migration & Setup
Execute the SQL migrations in your Supabase SQL Editor:
1. `supabase/migrations/20260814000001_initial_schema.sql` (Creates 14 tables, triggers, and indexes)
2. `supabase/migrations/20260814000002_rls_policies.sql` (Enables RLS and security helper functions)
3. `supabase/migrations/20260814000003_storage_setup.sql` (Creates private storage buckets)
4. `supabase/seed.sql` (Populates plans, courses, chapters, topics, and materials)

### 4. Seed Demo Users via Admin API
Run the automated seed script to provision student and admin accounts:
```bash
npm run seed
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your mobile or desktop browser.

---

## 📱 Android Studio App Development & Build

This project includes a fully configured **Native Android Studio Project** in the `android/` directory powered by Capacitor with OS-level anti-screenshot protection (`FLAG_SECURE`).

### 1. Prerequisites
- Android Studio (Installer located in `Downloads/android-studio-quail3-patch1-windows.exe`)
- Android SDK & Android Virtual Device (AVD / Emulator)

### 2. Quick Android Workflow
```bash
# 1. Start dev server for Android Emulator
npm run dev:android

# 2. Sync web updates to native Android project
npm run cap:sync

# 3. Open project directly in Android Studio
npm run cap:open
```

### 3. Open in Android Studio Manually
1. Open **Android Studio** ➔ Click **Open**.
2. Select the `android/` folder: `C:\Users\USER\Desktop\Debraj_App\android`.
3. Wait for Gradle sync to complete.
4. Click **Run ▶** (`Shift + F10`) to test on the Android Emulator or connected physical phone.
5. To build an installable APK: **Build ➔ Build Bundle(s) / APK(s) ➔ Build APK(s)**.

👉 For detailed setup instructions, see the complete [ANDROID_SETUP_GUIDE.md](file:///c:/Users/USER/Desktop/Debraj_App/ANDROID_SETUP_GUIDE.md).

---

## Seed Accounts for Testing & Evaluation

| Account Name | Email | Password | Role | Status | Plan Tier |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Pabir Paul (Instructor)** | `admin@pabirpaul.io` | `Admin@123456` | `admin` | `approved` | Lead Instructor / Admin |
| **Aarav Sharma** | `student.free@example.com` | `Student@123` | `student` | `approved` | **Free Batch Pass** |
| **Elena Roy** | `student.pro@example.com` | `Student@123` | `student` | `approved` | **Pro Batch Scholar** |
| **Dr. Vikram Sethi** | `student.premium@example.com` | `Student@123` | `student` | `approved` | **Premium Master Pass** |
| **Rohan Verma** | `pending.student@example.com` | `Student@123` | `student` | `pending_approval` | Admission Pending Approval |
| **Suspended Account** | `suspended.student@example.com` | `Student@123` | `student` | `suspended` | Access Suspended |
