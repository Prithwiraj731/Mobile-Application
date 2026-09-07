import fs from "fs";
import path from "path";
import { MOCK_USERS } from "./mock-data";
import { MaterialWithDetails, Profile, AccessLevel, MaterialType, Course } from "@/types";

export interface StoredUser extends Profile {
  demoPassword?: string;
  planCode?: "FREE" | "PRO" | "PREMIUM";
  program?: string;
  semester?: string;
}

export function parseEnrollment(address?: string | null): { program: string; semester: string } {
  if (!address) return { program: "BCOM", semester: "Semester 1" };
  const match = address.match(/(BCOM|MCOM|CA|CMA)\s*-\s*([A-Za-z0-9\s]+?)(?:\s*\(|$)/i);
  if (match) {
    return {
      program: match[1].toUpperCase(),
      semester: match[2].trim(),
    };
  }
  return { program: "BCOM", semester: "Semester 1" };
}

export interface StoredCourse {
  id: string;
  title: string;
  slug: string;
  code: string;
  program: "BCOM" | "MCOM" | "CA" | "CMA";
  semester: string;
  description: string;
  thumbnail_url?: string | null;
  is_published: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

interface AppDataSchema {
  users: StoredUser[];
  courses: StoredCourse[];
  materials: MaterialWithDetails[];
  lastUpdated: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "app-data.json");
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

// Helper to ensure folders exist
function ensureDirectories() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

export const DEFAULT_COURSES: StoredCourse[] = [
  {
    id: "c-bcom-sem1",
    title: "B.COM Semester 1 - Financial Accounting & Regulatory Framework",
    slug: "bcom-semester-1",
    code: "BCOM-SEM1",
    program: "BCOM",
    semester: "Semester 1",
    description: "Official study materials, syllabus modules, and lecture curriculum for B.COM Semester 1.",
    thumbnail_url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80",
    is_published: true,
    order_index: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "c-bcom-sem2",
    title: "B.COM Semester 2 - Corporate Accounting & Company Law",
    slug: "bcom-semester-2",
    code: "BCOM-SEM2",
    program: "BCOM",
    semester: "Semester 2",
    description: "Official study materials, share capital notes, and lecture curriculum for B.COM Semester 2.",
    thumbnail_url: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80",
    is_published: true,
    order_index: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "c-bcom-sem3",
    title: "B.COM Semester 3 - Cost & Management Accounting",
    slug: "bcom-semester-3",
    code: "BCOM-SEM3",
    program: "BCOM",
    semester: "Semester 3",
    description: "Official study materials, cost sheets, and problem sets for B.COM Semester 3.",
    thumbnail_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80",
    is_published: true,
    order_index: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "c-bcom-sem4",
    title: "B.COM Semester 4 - Direct & Indirect Taxation",
    slug: "bcom-semester-4",
    code: "BCOM-SEM4",
    program: "BCOM",
    semester: "Semester 4",
    description: "Official study materials, computation rules, and GST modules for B.COM Semester 4.",
    thumbnail_url: "https://images.unsplash.com/photo-1586486855514-8c633cc6fd38?w=600&auto=format&fit=crop&q=80",
    is_published: true,
    order_index: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "c-bcom-sem5",
    title: "B.COM Semester 5 - Auditing & Corporate Governance",
    slug: "bcom-semester-5",
    code: "BCOM-SEM5",
    program: "BCOM",
    semester: "Semester 5",
    description: "Official study materials, verification techniques, and standards for B.COM Semester 5.",
    thumbnail_url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80",
    is_published: true,
    order_index: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "c-bcom-sem6",
    title: "B.COM Semester 6 - Financial Management & Analysis",
    slug: "bcom-semester-6",
    code: "BCOM-SEM6",
    program: "BCOM",
    semester: "Semester 6",
    description: "Official study materials, capital budgeting, and working capital guides for B.COM Semester 6.",
    thumbnail_url: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&auto=format&fit=crop&q=80",
    is_published: true,
    order_index: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const DEFAULT_MATERIALS: MaterialWithDetails[] = [];

// Initial seed builder
function getInitialData(): AppDataSchema {
  return {
    users: [...MOCK_USERS],
    courses: [...DEFAULT_COURSES],
    materials: [],
    lastUpdated: new Date().toISOString(),
  };
}

// Read database
function readData(): AppDataSchema {
  ensureDirectories();
  if (!fs.existsSync(DATA_FILE)) {
    const initial = getInitialData();
    writeData(initial);
    return initial;
  }

  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (!parsed.courses || parsed.courses.length === 0) parsed.courses = [...DEFAULT_COURSES];
    if (!parsed.materials) parsed.materials = [];
    if (!parsed.users) parsed.users = [];

    // Ensure all users have program and semester
    parsed.users = parsed.users.map((u: StoredUser) => {
      if (!u.program || !u.semester) {
        const parsedInfo = parseEnrollment(u.address);
        return {
          ...u,
          program: u.program || parsedInfo.program,
          semester: u.semester || parsedInfo.semester,
        };
      }
      return u;
    });

    // Ensure all materials have top-level program and semester
    parsed.materials = parsed.materials.map((m: any) => {
      const prog =
        m.program ||
        m.topic?.chapter?.subject?.course?.program ||
        "BCOM";
      const sem =
        m.semester ||
        m.topic?.title ||
        m.topic?.chapter?.subject?.course?.semester ||
        "Semester 1";
      return {
        ...m,
        program: prog,
        semester: sem,
      };
    });

    return parsed;
  } catch (err) {
    console.error("Error reading data store file, resetting to defaults:", err);
    const initial = getInitialData();
    writeData(initial);
    return initial;
  }
}

// Write database
function writeData(data: AppDataSchema) {
  ensureDirectories();
  data.lastUpdated = new Date().toISOString();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export const DataStore = {
  /**
   * Fetch all users with optional filtering
   */
  getUsers(filter?: { status?: string; role?: string; search?: string }): StoredUser[] {
    const data = readData();
    let result = [...data.users];

    if (filter?.status && filter.status !== "all") {
      result = result.filter((u) => u.status === filter.status);
    }
    if (filter?.role && filter.role !== "all") {
      result = result.filter((u) => u.role === filter.role);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (u) =>
          u.full_name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.phone_number && u.phone_number.includes(q))
      );
    }

    return result.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  },

  /**
   * Find user by ID
   */
  getUserById(id: string): StoredUser | null {
    const data = readData();
    return data.users.find((u) => u.id === id) || null;
  },

  /**
   * Find user by Email (case-insensitive)
   */
  getUserByEmail(email: string): StoredUser | null {
    const data = readData();
    return data.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  /**
   * Register a new user with status 'pending_approval'
   */
  createUser(params: {
    fullName: string;
    email: string;
    password?: string;
    phoneNumber?: string;
    address?: string;
    program?: string;
    semester?: string;
    role?: "student" | "admin" | "super_admin";
    status?: "pending_approval" | "approved" | "rejected" | "suspended";
    planCode?: "FREE" | "PRO" | "PREMIUM";
  }): StoredUser {
    const data = readData();

    // Check if already exists
    const existing = data.users.find((u) => u.email.toLowerCase() === params.email.toLowerCase());
    if (existing) {
      throw new Error(`An account with email ${params.email} is already registered.`);
    }

    const parsedEnrollment = parseEnrollment(params.address);
    const finalProgram = params.program || parsedEnrollment.program;
    const finalSemester = params.semester || parsedEnrollment.semester;

    const newUser: StoredUser = {
      id: `u-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      full_name: params.fullName,
      email: params.email,
      phone_number: params.phoneNumber || null,
      address: params.address || `${finalProgram} - ${finalSemester}`,
      program: finalProgram,
      semester: finalSemester,
      role: params.role || "student",
      status: params.status || (params.role === "admin" ? "approved" : "pending_approval"),
      avatar_url: null,
      rejection_reason: null,
      planCode: params.planCode || "FREE",
      demoPassword: params.password || "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    data.users.unshift(newUser);
    writeData(data);
    return newUser;
  },

  /**
   * Update user status (approve, reject, suspend)
   */
  updateUserStatus(
    id: string,
    status: "pending_approval" | "approved" | "rejected" | "suspended",
    rejectionReason?: string
  ): StoredUser {
    const data = readData();
    const index = data.users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new Error("User not found.");
    }

    data.users[index].status = status;
    data.users[index].updated_at = new Date().toISOString();
    if (rejectionReason !== undefined) {
      data.users[index].rejection_reason = rejectionReason;
    }

    writeData(data);
    return data.users[index];
  },

  /**
   * Update user subscription plan tier
   */
  updateUserPlan(id: string, planCode: "FREE" | "PRO" | "PREMIUM"): StoredUser {
    const data = readData();
    const index = data.users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new Error("User not found.");
    }

    data.users[index].planCode = planCode;
    data.users[index].updated_at = new Date().toISOString();
    writeData(data);
    return data.users[index];
  },

  /**
   * Retrieve all study materials with optional filtering
   */
  getMaterials(filter?: {
    type?: string;
    program?: string;
    semester?: string;
    search?: string;
    status?: string;
  }): MaterialWithDetails[] {
    const data = readData();
    let result = [...data.materials];

    if (filter?.status && filter.status !== "all") {
      result = result.filter((m) => m.status === filter.status);
    } else {
      // Default: exclude archived unless specified
      result = result.filter((m) => m.status === "published");
    }

    if (filter?.type && filter.type !== "all") {
      result = result.filter((m) => m.type === filter.type);
    }

    if (filter?.program && filter.program !== "all") {
      const p = filter.program.toLowerCase();
      result = result.filter((m) => {
        const prog =
          (m as any).program ||
          (m.topic as any)?.chapter?.subject?.course?.program ||
          "";
        return prog.toLowerCase() === p;
      });
    }

    if (filter?.semester && filter.semester !== "all") {
      const s = filter.semester.toLowerCase();
      result = result.filter((m) => {
        const sem =
          (m as any).semester ||
          (m.topic as any)?.title ||
          (m.topic as any)?.chapter?.subject?.course?.semester ||
          "";
        return sem.toLowerCase().includes(s) || s.includes(sem.toLowerCase());
      });
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          (m.description && m.description.toLowerCase().includes(q))
      );
    }

    return result.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  },

  /**
   * Find single material by ID
   */
  getMaterialById(id: string): MaterialWithDetails | null {
    const data = readData();
    return data.materials.find((m) => m.id === id) || null;
  },

  /**
   * Fetch all courses with optional filtering
   */
  getCourses(filter?: { program?: string; semester?: string; search?: string }): StoredCourse[] {
    const data = readData();
    let result = [...data.courses];

    if (filter?.program && filter.program !== "all") {
      result = result.filter((c) => c.program === filter.program);
    }
    if (filter?.semester && filter.semester !== "all") {
      result = result.filter((c) => c.semester.toLowerCase().includes(filter.semester!.toLowerCase()));
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q)
      );
    }

    return result.sort((a, b) => a.order_index - b.order_index);
  },

  /**
   * Find single course by ID
   */
  getCourseById(id: string): StoredCourse | null {
    const data = readData();
    return data.courses.find((c) => c.id === id) || null;
  },

  /**
   * Create a new course/batch
   */
  createCourse(params: {
    title: string;
    program: "BCOM" | "MCOM" | "CA" | "CMA";
    semester: string;
    code?: string;
    description?: string;
    thumbnailUrl?: string;
  }): StoredCourse {
    const data = readData();
    const courseId = `c-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const slug = params.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const newCourse: StoredCourse = {
      id: courseId,
      title: params.title.trim(),
      slug,
      code: params.code?.trim() || `${params.program}-${params.semester.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()}`,
      program: params.program,
      semester: params.semester,
      description: params.description?.trim() || `Course curriculum and lecture notes for ${params.title.trim()}.`,
      thumbnail_url: params.thumbnailUrl || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80",
      is_published: true,
      order_index: data.courses.length + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    data.courses.push(newCourse);
    writeData(data);
    return newCourse;
  },

  /**
   * Delete a course
   */
  deleteCourse(id: string): boolean {
    const data = readData();
    const initLen = data.courses.length;
    data.courses = data.courses.filter((c) => c.id !== id);
    if (data.courses.length !== initLen) {
      writeData(data);
      return true;
    }
    return false;
  },

  /**
   * Create a new material uploaded/created by admin
   */
  createMaterial(params: {
    title: string;
    description: string;
    type: MaterialType;
    accessLevel?: AccessLevel;
    courseId?: string;
    courseTitle?: string;
    semester?: string;
    program?: string;
    contentText?: string;
    fileInfo?: {
      originalFilename: string;
      filePath: string;
      mimeType: string;
      sizeBytes: number;
      durationSeconds?: number;
      pageCount?: number;
    };
    createdById?: string;
  }): MaterialWithDetails {
    const data = readData();
    const materialId = `m-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

    // 1. Resolve or dynamically auto-create course
    let targetCourse: StoredCourse | null = null;
    if (params.courseId) {
      targetCourse = data.courses.find((c) => c.id === params.courseId) || null;
    }

    if (!targetCourse && params.courseTitle && params.courseTitle.trim()) {
      const existing = data.courses.find(
        (c) =>
          c.title.toLowerCase() === params.courseTitle!.trim().toLowerCase() &&
          (!params.program || c.program === params.program)
      );
      if (existing) {
        targetCourse = existing;
      } else {
        const program = (params.program as any) || "BCOM";
        const semester = params.semester || "Semester 1";
        const courseId = `c-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
        targetCourse = {
          id: courseId,
          title: params.courseTitle.trim(),
          slug: params.courseTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          code: `${program}-${semester.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()}`,
          program,
          semester,
          description: `Study materials and lecture curriculum for ${params.courseTitle.trim()}.`,
          thumbnail_url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80",
          is_published: true,
          order_index: data.courses.length + 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        data.courses.push(targetCourse);
      }
    }

    if (!targetCourse && data.courses.length > 0) {
      targetCourse = data.courses[0];
    }

    const resolvedProgram = params.program || targetCourse?.program || "BCOM";
    const resolvedSemester = params.semester || targetCourse?.semester || "Semester 1";

    const courseTitle = targetCourse?.title || params.courseTitle || `${resolvedProgram} ${resolvedSemester} Coursework`;
    const courseId = targetCourse?.id || `c-default-${Date.now()}`;
    const courseSlug = targetCourse?.slug || "commerce-coursework";

    const newMaterial: any = {
      id: materialId,
      topic_id: `t-${Date.now()}`,
      title: params.title,
      description: params.description || null,
      type: params.type,
      access_level: params.accessLevel || "free",
      status: "published",
      order_index: data.materials.length + 1,
      content_text: params.type === "text_note" ? params.contentText || null : null,
      created_by_admin_id: params.createdById || "u-admin-master",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      program: resolvedProgram,
      semester: resolvedSemester,
      topic: {
        id: `t-${Date.now()}`,
        chapter_id: `ch-${Date.now()}`,
        title: resolvedSemester || "General Coursework",
        slug: "general-coursework",
        description: "",
        order_index: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        chapter: {
          id: `ch-${Date.now()}`,
          subject_id: `s-${Date.now()}`,
          title: courseTitle,
          slug: courseSlug,
          description: "",
          order_index: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          subject: {
            id: `s-${Date.now()}`,
            course_id: courseId,
            title: courseTitle,
            slug: courseSlug,
            description: "",
            order_index: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            course: {
              id: targetCourse ? targetCourse.id : courseId,
              title: targetCourse ? targetCourse.title : courseTitle,
              slug: targetCourse ? targetCourse.slug : courseSlug,
              code: targetCourse ? targetCourse.code : "COURSE-01",
              program: targetCourse ? targetCourse.program : resolvedProgram,
              semester: targetCourse ? targetCourse.semester : resolvedSemester,
              description: targetCourse ? targetCourse.description : "",
              thumbnail_url: targetCourse?.thumbnail_url ?? null,
              is_published: targetCourse ? targetCourse.is_published : true,
              order_index: targetCourse ? targetCourse.order_index : 1,
              created_at: targetCourse ? targetCourse.created_at : new Date().toISOString(),
              updated_at: targetCourse ? targetCourse.updated_at : new Date().toISOString(),
            },
          },
        },
      },
      file: params.fileInfo
        ? {
            id: `f-${Date.now()}`,
            material_id: materialId,
            bucket_name: "study-materials",
            file_path: params.fileInfo.filePath,
            original_filename: params.fileInfo.originalFilename,
            mime_type: params.fileInfo.mimeType,
            size_bytes: params.fileInfo.sizeBytes,
            checksum_sha256: null,
            page_count: params.fileInfo.pageCount || (params.type === "pdf" ? 8 : null),
            duration_seconds: params.fileInfo.durationSeconds || (params.type === "audio" ? 600 : null),
            created_at: new Date().toISOString(),
          }
        : null,
    };

    data.materials.unshift(newMaterial);
    writeData(data);
    return newMaterial;
  },

  /**
   * Toggle material published / archived status
   */
  toggleMaterialStatus(id: string): MaterialWithDetails {
    const data = readData();
    const index = data.materials.findIndex((m) => m.id === id);
    if (index === -1) {
      throw new Error("Material not found.");
    }

    const nextStatus = data.materials[index].status === "published" ? "archived" : "published";
    data.materials[index].status = nextStatus;
    data.materials[index].updated_at = new Date().toISOString();
    writeData(data);
    return data.materials[index];
  },

  /**
   * Delete a material
   */
  deleteMaterial(id: string): boolean {
    const data = readData();
    const initialLen = data.materials.length;
    data.materials = data.materials.filter((m) => m.id !== id);
    if (data.materials.length !== initialLen) {
      writeData(data);
      return true;
    }
    return false;
  },

  /**
   * Save uploaded file to public/uploads
   */
  async saveUploadedFile(originalFilename: string, buffer: Buffer): Promise<{
    urlPath: string;
    filePath: string;
    sizeBytes: number;
    filename: string;
  }> {
    ensureDirectories();
    const ext = path.extname(originalFilename);
    const cleanBase = path
      .basename(originalFilename, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .substring(0, 40);
    const uniqueFilename = `${cleanBase}_${Date.now().toString(36)}${ext}`;
    const absolutePath = path.join(UPLOAD_DIR, uniqueFilename);

    await fs.promises.writeFile(absolutePath, buffer);

    return {
      urlPath: `/uploads/${uniqueFilename}`,
      filePath: absolutePath,
      sizeBytes: buffer.length,
      filename: uniqueFilename,
    };
  },
};
