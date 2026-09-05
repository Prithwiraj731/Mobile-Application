import { NextResponse } from "next/server";
import { DataStore } from "@/lib/data-store";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const program = searchParams.get("program") || undefined;
    const semester = searchParams.get("semester") || undefined;
    const search = searchParams.get("search") || undefined;

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
