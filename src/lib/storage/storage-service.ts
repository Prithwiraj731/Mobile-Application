import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";

export interface UploadFileOptions {
  bucketName?: string;
  folderPath?: string;
  filename: string;
  fileBuffer: Buffer | ArrayBuffer | Uint8Array;
  mimeType: string;
}

export interface UploadResult {
  filePath: string;
  originalFilename: string;
  sizeBytes: number;
  mimeType: string;
  bucketName: string;
}

export class StorageService {
  private static readonly DEFAULT_BUCKET = "study-materials";

  /**
   * Uploads a file into private Supabase Storage.
   * Uses sanitized cryptographic paths to prevent path traversal or predictable URLs.
   */
  static async uploadProtectedFile(options: UploadFileOptions): Promise<UploadResult> {
    const admin = createAdminClient();
    const bucket = options.bucketName || this.DEFAULT_BUCKET;
    const folder = options.folderPath ? options.folderPath.replace(/^\/+|\/+$/g, "") : "uploads";

    const cleanFilename = options.filename.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const storagePath = `${folder}/${uniqueSuffix}_${cleanFilename}`;

    const { error } = await admin.storage.from(bucket).upload(storagePath, options.fileBuffer, {
      contentType: options.mimeType,
      upsert: false,
    });

    if (error) {
      throw new Error(`Failed to upload to private storage: ${error.message}`);
    }

    const sizeBytes =
      options.fileBuffer instanceof Buffer
        ? options.fileBuffer.length
        : options.fileBuffer.byteLength;

    return {
      filePath: storagePath,
      originalFilename: options.filename,
      sizeBytes,
      mimeType: options.mimeType,
      bucketName: bucket,
    };
  }

  /**
   * Creates a strictly short-lived signed URL for an authorized preview session.
   * Default expiry is 120 seconds.
   */
  static async getShortLivedSignedUrl(
    filePath: string,
    bucketName = this.DEFAULT_BUCKET,
    expiresInSeconds = 120
  ): Promise<string> {
    const admin = createAdminClient();

    const { data, error } = await admin.storage
      .from(bucketName)
      .createSignedUrl(filePath, expiresInSeconds);

    if (error || !data?.signedUrl) {
      throw new Error(`Unable to generate signed access token: ${error?.message || "Unknown error"}`);
    }

    return data.signedUrl;
  }

  /**
   * Securely streams private file bytes directly for backend rendering/watermarking.
   */
  static async downloadFileBytes(
    filePath: string,
    bucketName = this.DEFAULT_BUCKET
  ): Promise<Blob> {
    const admin = createAdminClient();

    const { data, error } = await admin.storage.from(bucketName).download(filePath);

    if (error || !data) {
      throw new Error(`File download failed: ${error?.message || "File not found"}`);
    }

    return data;
  }

  /**
   * Deletes a private file from storage
   */
  static async deleteFile(filePath: string, bucketName = this.DEFAULT_BUCKET): Promise<void> {
    const admin = createAdminClient();
    const { error } = await admin.storage.from(bucketName).remove([filePath]);
    if (error) {
      console.error(`Failed to delete storage file ${filePath}:`, error.message);
    }
  }
}
