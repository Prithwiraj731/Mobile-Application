import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { DataStore } from "@/lib/data-store";
import fs from "fs";
import path from "path";

export async function GET(
  request: Request,
  { params }: { params: { materialId: string } }
) {
  try {
    const materialId = params.materialId;
    const material = DataStore.getMaterialById(materialId);

    if (!material) {
      return NextResponse.json({ error: "Study material not found." }, { status: 404 });
    }

    // 1. Verify user session if available
    const cookieStore = cookies();
    const demoCookie = cookieStore.get("demo_user_session")?.value;
    let sessionUser: any = null;
    if (demoCookie) {
      try {
        sessionUser = JSON.parse(decodeURIComponent(demoCookie));
      } catch {}
    }

    // Re-verify against DataStore to check freshest status
    if (sessionUser?.id) {
      const fresh = DataStore.getUserById(sessionUser.id);
      if (fresh) {
        sessionUser = fresh;
      }
    }

    // Check approval if an authenticated session exists
    if (sessionUser && sessionUser.status !== "approved" && sessionUser.role !== "admin") {
      return NextResponse.json(
        { error: "Your account is pending admin approval. You will be able to download study materials once verified." },
        { status: 403 }
      );
    }

    // Common CORS and caching headers for reliable downloads
    const baseHeaders: Record<string, string> = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Expose-Headers": "Content-Disposition, Content-Length",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    };

    // 2. Handle Text Note download as formatted document
    if (material.type === "text_note") {
      const sanitizedName = material.title.replace(/[^a-zA-Z0-9_-]/g, "_");
      const content = `=====================================================
${material.title.toUpperCase()}
Debraj Commerce Tutorials • Study Resource
Access Tier: ${material.access_level.toUpperCase()}
Generated on: ${new Date().toLocaleString()}
=====================================================

DESCRIPTION:
${material.description || "No description provided."}

-----------------------------------------------------
STUDY NOTES CONTENT:
-----------------------------------------------------
${material.content_text || "Study notes content."}

=====================================================
CONFIDENTIAL STUDY MATERIAL • DEBRAJ COMMERCE TUTORIALS
=====================================================`;

      return new Response(content, {
        headers: {
          ...baseHeaders,
          "Content-Disposition": `attachment; filename="${sanitizedName}_Study_Notes.txt"`,
          "Content-Type": "text/plain; charset=utf-8",
        },
      });
    }

    // 3. Handle File Download (PDF, Audio, Image)
    if (material.file?.file_path) {
      const relPath = material.file.file_path.startsWith("/")
        ? material.file.file_path.substring(1)
        : material.file.file_path;
      const physicalPath = path.join(process.cwd(), "public", relPath);

      if (fs.existsSync(physicalPath)) {
        const fileBuffer = await fs.promises.readFile(physicalPath);
        const filename = material.file.original_filename || path.basename(physicalPath);
        const cleanName = filename.replace(/["\r\n]/g, "");
        const asciiName = cleanName.replace(/[^\x20-\x7E]/g, "_");

        return new Response(fileBuffer, {
          headers: {
            ...baseHeaders,
            "Content-Disposition": `attachment; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(cleanName)}`,
            "Content-Type": material.file.mime_type || "application/octet-stream",
            "Content-Length": fileBuffer.length.toString(),
          },
        });
      }
    }

    // 4. Fallback for materials without physical file
    const safeTitle = material.title.replace(/[^a-zA-Z0-9_-]/g, "_");
    const fallbackContent = `=====================================================
DEBRAJ COMMERCE TUTORIALS • STUDY MATERIAL DOWNLOAD
=====================================================
Material: ${material.title}
Type: ${material.type.toUpperCase()}
Access Clearance: ${material.access_level.toUpperCase()}
Course: ${(material.topic as any)?.chapter?.subject?.course?.title || "Commerce Curriculum"}
Downloaded On: ${new Date().toLocaleString()}
=====================================================

SYNOPSIS:
${material.description || "Comprehensive academic revision notes and study guidance."}

KEY LEARNING HIGHLIGHTS:
1. Core theoretical foundations, formula derivations, and standard problem schemas.
2. Verified ledger formats, ICAI/CMA standard presentation guidelines.
3. Exam-oriented question-answer breakdown with step marking pointers.

Faculty Desk: Debraj Commerce Tutorials
Official Tuition Portal • All Rights Reserved.`;

    const filename = `${safeTitle}_Reference_Pack.txt`;

    return new Response(fallbackContent, {
      headers: {
        ...baseHeaders,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to download study material." },
      { status: 500 }
    );
  }
}
