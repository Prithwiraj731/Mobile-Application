import { NextResponse } from "next/server";
import { canAccessMaterial } from "@/lib/security/access-control";

export async function GET(
  request: Request,
  { params }: { params: { materialId: string } }
) {
  try {
    const materialId = params.materialId;
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
