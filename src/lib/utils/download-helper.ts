/**
 * Cross-platform helper to reliably download study materials
 * Works across desktop browsers, mobile Chrome/Safari, and Android WebViews.
 */
export async function downloadMaterialFile(
  materialId: string,
  fallbackFilename?: string
): Promise<boolean> {
  try {
    const downloadUrl = `/api/materials/${materialId}/download`;

    // 1. Fetch file directly in browser memory (passes cookies and auth headers)
    const response = await fetch(downloadUrl);
    if (!response.ok) {
      throw new Error(`Download failed with status ${response.status}`);
    }

    // Determine filename
    let finalFilename = fallbackFilename || "study_material.pdf";
    const disposition = response.headers.get("Content-Disposition");
    if (disposition && !fallbackFilename) {
      const match = disposition.match(/filename\*?=(?:UTF-8'')?["']?([^"';]+)["']?/i);
      if (match && match[1]) {
        try {
          finalFilename = decodeURIComponent(match[1]);
        } catch {
          finalFilename = match[1];
        }
      }
    }

    // 2. Create blob URL
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    // 3. Programmatically trigger native download
    const anchor = document.createElement("a");
    anchor.style.display = "none";
    anchor.href = blobUrl;
    anchor.download = finalFilename;
    document.body.appendChild(anchor);
    anchor.click();

    // 4. Clean up blob memory
    setTimeout(() => {
      window.URL.revokeObjectURL(blobUrl);
      if (document.body.contains(anchor)) {
        document.body.removeChild(anchor);
      }
    }, 2500);

    return true;
  } catch (error) {
    console.warn("Client blob download encountered an error, falling back to direct navigation:", error);
    // Fallback: direct window.location.href or window.open
    window.open(`/api/materials/${materialId}/download`, "_blank");
    return true;
  }
}
