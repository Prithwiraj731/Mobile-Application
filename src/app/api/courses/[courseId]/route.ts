import { NextResponse } from "next/server";
import { DataStore } from "@/lib/data-store";

export async function GET(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { courseId } = params;
    const course = DataStore.getCourseById(courseId);

    if (!course) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    const allMaterials = DataStore.getMaterials({ status: "all" });
    const courseMaterials = allMaterials.filter(
      (m) =>
        (m.topic as any)?.chapter?.subject?.course_id === courseId ||
        (m.topic as any)?.chapter?.subject?.course?.id === courseId ||
        (m.topic as any)?.chapter?.subject?.title?.toLowerCase() === course.title.toLowerCase()
    );

    return NextResponse.json({
      success: true,
      course,
      materials: courseMaterials,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch course details." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { courseId } = params;
    const deleted = DataStore.deleteCourse(courseId);

    if (!deleted) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Course removed successfully.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to delete course." },
      { status: 500 }
    );
  }
}
