import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";
import { DataStore, parseEnrollment } from "@/lib/data-store";

export async function GET(
  request: Request,
  { params }: { params: { materialId: string } }
) {
  try {
    const materialId = params.materialId;
    const material = DataStore.getMaterialById(materialId);

    if (!material) {
      return new Response("Study material not found.", {
        status: 404,
        headers: { "Content-Type": "text/plain" },
      });
    }

    // 1. Authenticate user session
    const cookieStore = cookies();
    const demoCookie = cookieStore.get("demo_user_session")?.value;
    let sessionUser: any = null;
    if (demoCookie) {
      try {
        sessionUser = JSON.parse(decodeURIComponent(demoCookie));
      } catch {}
    }

    if (!sessionUser) {
      return new Response("Authentication required to preview study materials.", {
        status: 401,
        headers: { "Content-Type": "text/plain" },
      });
    }

    // Refresh user from DataStore if available
    if (sessionUser.id) {
      const freshUser = DataStore.getUserById(sessionUser.id);
      if (freshUser) {
        sessionUser = freshUser;
      }
    }

    // Check account status
    if (sessionUser.status === "pending_approval" && sessionUser.role !== "admin") {
      return new Response(
        "Your account is awaiting approval from the faculty administrator.",
        { status: 403, headers: { "Content-Type": "text/plain" } }
      );
    }

    if (sessionUser.status === "suspended" || sessionUser.status === "rejected") {
      return new Response(
        "Your account does not have active admission clearance.",
        { status: 403, headers: { "Content-Type": "text/plain" } }
      );
    }

    // 2. Strict Semester & Course Scoping check for students
    if (sessionUser.role !== "admin" && sessionUser.role !== "super_admin") {
      const userEnrollment = parseEnrollment(sessionUser.address);
      const studentProgram = (sessionUser.program || userEnrollment.program || "BCOM").toUpperCase();
      const studentSemester = (sessionUser.semester || userEnrollment.semester || "Semester 1").toLowerCase();

      const matProg = (
        (material as any).program ||
        (material.topic as any)?.chapter?.subject?.course?.program ||
        "BCOM"
      ).toUpperCase();

      const matSem = (
        (material as any).semester ||
        (material.topic as any)?.title ||
        (material.topic as any)?.chapter?.subject?.course?.semester ||
        "Semester 1"
      ).toLowerCase();

      const programMatches = studentProgram === matProg;
      const semesterMatches =
        studentSemester.includes(matSem) ||
        matSem.includes(studentSemester);

      if (!programMatches || !semesterMatches) {
        return new Response(
          `Access Restricted: This study resource belongs to ${matProg} (${matSem.toUpperCase()}). Your registered batch is ${studentProgram} (${studentSemester.toUpperCase()}).`,
          { status: 403, headers: { "Content-Type": "text/plain" } }
        );
      }
    }

    // 3. Handle Text Note
    if (material.type === "text_note") {
      const noteContent = material.content_text || material.description || "Study note content.";
      return new Response(noteContent, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "private, no-cache, no-store, must-revalidate",
        },
      });
    }

    // 4. Handle PDF, Audio, Image file stream
    if (material.file?.file_path) {
      const relPath = material.file.file_path.startsWith("/")
        ? material.file.file_path.substring(1)
        : material.file.file_path;
      const physicalPath = path.join(process.cwd(), "public", relPath);

      if (fs.existsSync(physicalPath)) {
        const fileBuffer = await fs.promises.readFile(physicalPath);
        const mimeType =
          material.file.mime_type ||
          (material.type === "pdf"
            ? "application/pdf"
            : material.type === "audio"
            ? "audio/mpeg"
            : "image/png");

        const filename = material.file.original_filename || path.basename(physicalPath);
        const cleanFilename = filename.replace(/["\r\n]/g, "");

        return new Response(fileBuffer, {
          headers: {
            "Content-Type": mimeType,
            "Content-Disposition": `inline; filename="${cleanFilename}"`,
            "Content-Length": String(fileBuffer.length),
            "Accept-Ranges": "bytes",
            "Cache-Control": "private, no-cache, no-store, must-revalidate",
            "X-Content-Type-Options": "nosniff",
          },
        });
      }
    }

    // If physical file not found on disk, return informative placeholder note
    return new Response(
      `Pabir Paul Tuition - Study Material: ${material.title}\n\nDescription: ${material.description || "No description provided."}`,
      {
        status: 200,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "private, no-cache, no-store, must-revalidate",
        },
      }
    );
  } catch (err: any) {
    return new Response(err.message || "Failed to stream material preview.", {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
