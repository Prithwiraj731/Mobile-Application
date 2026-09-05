import fs from "fs";
import path from "path";
import { MOCK_USERS, MOCK_COURSES } from "./mock-data";
import { MaterialWithDetails, Profile, AccessLevel, MaterialType } from "@/types";

export interface StoredUser extends Profile {
  demoPassword?: string;
  planCode?: "FREE" | "PRO" | "PREMIUM";
}

interface AppDataSchema {
  users: StoredUser[];
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

// Initial seed builder
function getInitialData(): AppDataSchema {
  return {
    users: [...MOCK_USERS],
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
    return JSON.parse(raw);
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

    const newUser: StoredUser = {
      id: `u-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      full_name: params.fullName,
      email: params.email,
      phone_number: params.phoneNumber || null,
      address: params.address || null,
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
   * Create a new material uploaded/created by admin
   */
  createMaterial(params: {
    title: string;
    description: string;
    type: MaterialType;
    accessLevel?: AccessLevel;
    courseId?: string;
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
    const matchedCourse = MOCK_COURSES.find((c) => c.id === params.courseId) || MOCK_COURSES[0];

    const newMaterial: MaterialWithDetails = {
      id: materialId,
      topic_id: `t-${Date.now()}`,
      title: params.title,
      description: params.description || null,
      type: params.type,
      access_level: params.accessLevel || "free",
      status: "published",
      order_index: data.materials.length + 1,
      content_text: params.type === "text_note" ? params.contentText || null : null,
      created_by_admin_id: params.createdById || "u-admin-001",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      topic: {
        id: `t-${Date.now()}`,
        chapter_id: `ch-${Date.now()}`,
        title: params.semester || "General Coursework",
        slug: "general-coursework",
        description: "",
        order_index: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        chapter: {
          id: `ch-${Date.now()}`,
          subject_id: `s-${Date.now()}`,
          title: matchedCourse.title,
          slug: matchedCourse.slug || "course-module",
          description: "",
          order_index: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          subject: {
            id: `s-${Date.now()}`,
            course_id: matchedCourse.id,
            title: matchedCourse.title,
            slug: matchedCourse.slug || "subject",
            description: "",
            order_index: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            course: matchedCourse,
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
