import { NextResponse } from "next/server";
import { DataStore } from "@/lib/data-store";
import { MaterialType, AccessLevel } from "@/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "all";
    const program = searchParams.get("program") || undefined;
    const semester = searchParams.get("semester") || undefined;
    const search = searchParams.get("search") || undefined;
    const status = searchParams.get("status") || "published";

    const materials = DataStore.getMaterials({
      type,
      program,
      semester,
      search,
      status,
    });

    return NextResponse.json({
      success: true,
      materials,
      count: materials.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch study materials." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";

    let title = "";
    let description = "";
    let type: MaterialType = "pdf";
    let accessLevel: AccessLevel = "free";
    let courseId = "";
    let semester = "";
    let program = "";
    let contentText = "";
    let fileInfo: any = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      title = (formData.get("title") as string) || "";
      description = (formData.get("description") as string) || "";
      type = ((formData.get("type") as string) || "pdf") as MaterialType;
      accessLevel = ((formData.get("accessLevel") as string) || "free") as AccessLevel;
      courseId = (formData.get("courseId") as string) || "";
      semester = (formData.get("semester") as string) || "";
      program = (formData.get("program") as string) || "";
      contentText = (formData.get("contentText") as string) || "";

      const file = formData.get("file") as File | null;
      if (file && file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const saved = await DataStore.saveUploadedFile(file.name, buffer);

        fileInfo = {
          originalFilename: file.name,
          filePath: saved.urlPath,
          mimeType: file.type || (type === "pdf" ? "application/pdf" : type === "audio" ? "audio/mpeg" : "image/png"),
          sizeBytes: saved.sizeBytes,
          durationSeconds: type === "audio" ? 480 : undefined,
          pageCount: type === "pdf" ? 6 : undefined,
        };
      }
    } else {
      const body = await request.json();
      title = body.title || "";
      description = body.description || "";
      type = (body.type || "pdf") as MaterialType;
      accessLevel = (body.accessLevel || "free") as AccessLevel;
      courseId = body.courseId || "";
      semester = body.semester || "";
      program = body.program || "";
      contentText = body.contentText || "";

      if (body.fileInfo) {
        fileInfo = body.fileInfo;
      }
    }

    if (!title.trim()) {
      return NextResponse.json({ error: "Material title is required." }, { status: 400 });
    }

    // Create material
    const material = DataStore.createMaterial({
      title: title.trim(),
      description: description.trim(),
      type,
      accessLevel,
      courseId,
      semester,
      program,
      contentText,
      fileInfo,
    });

    return NextResponse.json({
      success: true,
      material,
      message: `Successfully published "${material.title}" for students.`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to create study material." },
      { status: 500 }
    );
  }
}
