import { NextResponse } from "next/server";
import { DataStore } from "@/lib/data-store";

export async function GET(
  request: Request,
  { params }: { params: { materialId: string } }
) {
  try {
    const { materialId } = params;
    const material = DataStore.getMaterialById(materialId);

    if (!material) {
      return NextResponse.json({ error: "Material not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      material,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch material." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { materialId: string } }
) {
  try {
    const { materialId } = params;
    const deleted = DataStore.deleteMaterial(materialId);

    if (!deleted) {
      return NextResponse.json({ error: "Material not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Material deleted successfully.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to delete material." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { materialId: string } }
) {
  try {
    const { materialId } = params;
    const updated = DataStore.toggleMaterialStatus(materialId);

    return NextResponse.json({
      success: true,
      material: updated,
      message: `Material is now ${updated.status}.`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to update material status." },
      { status: 500 }
    );
  }
}
