/**
 * Cross-platform helper to reliably download study materials
 * Works seamlessly across Android Native WebView (Capacitor/Java bridge),
 * mobile browsers (Chrome/Safari), and desktop web browsers.
 */
export async function downloadMaterialFile(
  materialId: string,
  fallbackFilename?: string
): Promise<boolean> {
  try {
    const downloadUrl = `/api/materials/${materialId}/download`;

    // 1. Fetch file directly in memory (passes cookies and auth headers)
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

    const mimeType = response.headers.get("Content-Type") || "application/pdf";
    const blob = await response.blob();

    // 2. Native Android App Bridge Check (Capacitor Android WebView)
    const androidBridge = typeof window !== "undefined" ? (window as any).AndroidBridge : null;
    if (androidBridge && typeof androidBridge.saveFile === "function") {
      return new Promise<boolean>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          try {
            const base64Data = reader.result as string;
            const success = androidBridge.saveFile(base64Data, finalFilename, mimeType);
            resolve(Boolean(success));
          } catch (bridgeErr) {
            console.warn("AndroidBridge execution error:", bridgeErr);
            resolve(false);
          }
        };
        reader.onerror = () => resolve(false);
        reader.readAsDataURL(blob);
      });
    }

    // 3. Programmatically trigger native download in Web Browsers (Chrome, Firefox, Safari, Edge)
    const blobUrl = window.URL.createObjectURL(blob);
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
    if (typeof window !== "undefined") {
      window.open(`/api/materials/${materialId}/download`, "_blank");
    }
    return true;
  }
}
