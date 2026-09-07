import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { DataStore, parseEnrollment } from "@/lib/data-store";
import { canAccessMaterial } from "@/lib/security/access-control";

export async function GET(
  request: Request,
  { params }: { params: { materialId: string } }
) {
  try {
    const materialId = params.materialId;
    const material = DataStore.getMaterialById(materialId);

    if (!material) {
      return NextResponse.json({ error: "Material not found." }, { status: 404 });
    }

    // 1. Check user session from cookies
    const cookieStore = cookies();
    const demoCookie = cookieStore.get("demo_user_session")?.value;
    let sessionUser: any = null;
    if (demoCookie) {
      try {
        sessionUser = JSON.parse(decodeURIComponent(demoCookie));
      } catch {}
    }

    if (material && sessionUser) {
      // If user is pending or suspended or rejected
      if (sessionUser.status === "pending_approval" && sessionUser.role !== "admin") {
        return NextResponse.json(
          { error: "Your admission is awaiting approval from the admin." },
          { status: 403 }
        );
      }
      if (sessionUser.status === "suspended") {
        return NextResponse.json(
          { error: "Your account is suspended. Please contact support." },
          { status: 403 }
        );
      }

      // Check Program and Semester scoping for students
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
          return NextResponse.json(
            {
              error: `Access Restricted: This note is for ${matProg} (${matSem.toUpperCase()}). Your registered batch is ${studentProgram} (${studentSemester.toUpperCase()}).`,
            },
            { status: 403 }
          );
        }
      }

      const sessionTraceId = `SEC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      const watermarkText = `${sessionUser.full_name} • ${sessionUser.email} • Pabir Paul's Tuition • Session #${sessionTraceId}`;

      const signedUrl = `/api/preview/${materialId}/stream?trace=${sessionTraceId}`;

      return NextResponse.json({
        success: true,
        material,
        signedUrl,
        watermarkText,
        sessionTraceId,
      });
    }

    // Fallback to canAccessMaterial if real Supabase session exists
    const ipAddress = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const userAgent = request.headers.get("user-agent") || "Unknown Browser";

    const authResult = await canAccessMaterial({
      materialId,
      action: "preview",
      ipAddress,
      userAgent,
    });

    if (!authResult.allowed) {
      return NextResponse.json(
        {
          error: authResult.reason || "Unauthorized access.",
          requiredPlanRank: authResult.requiredPlanRank,
          userPlanRank: authResult.userPlanRank,
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      material: authResult.material,
      signedUrl: authResult.signedUrl,
      watermarkText: authResult.watermarkText,
      sessionTraceId: authResult.sessionTraceId,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to authorize preview." },
      { status: 500 }
    );
  }
}
