import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { DataStore, parseEnrollment } from "@/lib/data-store";

export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const demoCookie = cookieStore.get("demo_user_session")?.value;
    let sessionUser: any = null;
    if (demoCookie) {
      try {
        sessionUser = JSON.parse(decodeURIComponent(demoCookie));
      } catch {}
    }

    const { searchParams } = new URL(request.url);
    let program = searchParams.get("program") || undefined;
    let semester = searchParams.get("semester") || undefined;
    const search = searchParams.get("search") || undefined;

    // If caller is student, restrict to their registered program & semester
    if (sessionUser && sessionUser.role !== "admin" && sessionUser.role !== "super_admin") {
      const parsed = parseEnrollment(sessionUser.address);
      program = sessionUser.program || parsed.program || "BCOM";
      semester = sessionUser.semester || parsed.semester || "Semester 1";
    }

    const courses = DataStore.getCourses({
      program,
      semester,
      search,
    });

    return NextResponse.json({
      success: true,
      courses,
      count: courses.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch courses." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, program, semester, code, description, thumbnailUrl } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: "Course title is required." },
        { status: 400 }
      );
    }
    if (!program) {
      return NextResponse.json(
        { error: "Academic stream/program is required." },
        { status: 400 }
      );
    }
    if (!semester) {
      return NextResponse.json(
        { error: "Target semester/group is required." },
        { status: 400 }
      );
    }

    const newCourse = DataStore.createCourse({
      title: title.trim(),
      program,
      semester,
      code,
      description,
      thumbnailUrl,
    });

    return NextResponse.json({
      success: true,
      course: newCourse,
      message: `Successfully created course "${newCourse.title}".`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to create course." },
      { status: 500 }
    );
  }
}
