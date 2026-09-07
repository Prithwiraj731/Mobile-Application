import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { DataStore, parseEnrollment } from "@/lib/data-store";

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

    // Verify student batch scoping
    const cookieStore = cookies();
    const demoCookie = cookieStore.get("demo_user_session")?.value;
    let sessionUser: any = null;
    if (demoCookie) {
      try {
        sessionUser = JSON.parse(decodeURIComponent(demoCookie));
      } catch {}
    }

    if (sessionUser && sessionUser.role !== "admin" && sessionUser.role !== "super_admin") {
      const parsed = parseEnrollment(sessionUser.address);
      const studentProgram = (sessionUser.program || parsed.program || "BCOM").toUpperCase();
      const studentSemester = (sessionUser.semester || parsed.semester || "Semester 1").toLowerCase();

      const courseProgram = (course.program || "BCOM").toUpperCase();
      const courseSemester = (course.semester || "Semester 1").toLowerCase();

      const programMatches = studentProgram === courseProgram;
      const semesterMatches =
        studentSemester.includes(courseSemester) ||
        courseSemester.includes(studentSemester);

      if (!programMatches || !semesterMatches) {
        return NextResponse.json(
          {
            error: `Access Restricted: This course belongs to ${courseProgram} (${course.semester}). Your registered batch is ${studentProgram} (${sessionUser.semester || parsed.semester}).`,
          },
          { status: 403 }
        );
      }
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
