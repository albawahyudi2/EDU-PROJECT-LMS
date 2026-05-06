import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { NodeHttpHandler } from '@smithy/node-http-handler';
import * as https from 'https';

@Injectable()
export class R2Service {
  private s3Client: S3Client;
  private bucketName: string;
  private publicUrl: string;

  constructor() {
    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    
    this.bucketName = process.env.R2_BUCKET_NAME || 'lms-abk-storage';
    this.publicUrl = process.env.R2_PUBLIC_URL || '';

    if (!accountId || !accessKeyId || !secretAccessKey) {
      console.warn('R2 credentials not configured. File uploads will be disabled.');
      return;
    }

    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      requestHandler: new NodeHttpHandler({
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      }),
    });
  }

  /**
   * Generate a pre-signed URL for direct browser-to-R2 upload.
   * Avoids Railway → R2 TLS issues by letting the browser upload directly.
   * Pre-signing only does local crypto — no actual network call to R2.
   */
  async generateUploadPresignedUrl(
    folder: string = 'uploads',
    filename: string,
    contentType: string,
    expiresIn: number = 300,
  ): Promise<{ uploadUrl: string; publicUrl: string; key: string }> {
    if (!this.s3Client) {
      throw new Error('R2 client not initialized. Check your environment variables.');
    }

    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const extension = filename.split('.').pop();
    const key = `${folder}/${timestamp}-${randomStr}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(this.s3Client, command, { expiresIn });
    const publicFileUrl = this.publicUrl ? `${this.publicUrl}/${key}` : key;

    return { uploadUrl, publicUrl: publicFileUrl, key };
  }

  /**
   * Upload file to R2 (server-side, may have SSL issues on some hosts)
   */
  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'uploads',
  ): Promise<{ url: string; key: string }> {
    if (!this.s3Client) {
      throw new Error('R2 client not initialized. Check your environment variables.');
    }

    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const extension = file.originalname.split('.').pop();
    const key = `${folder}/${timestamp}-${randomStr}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3Client.send(command);

    const url = this.publicUrl ? `${this.publicUrl}/${key}` : key;
    return { url, key };
  }

  /**
   * Delete file from R2
   */
  async deleteFile(key: string): Promise<void> {
    if (!this.s3Client) {
      throw new Error('R2 client not initialized.');
    }

    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    await this.s3Client.send(command);
  }

  /**
   * Get signed URL for private files
   */
  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    if (!this.s3Client) {
      throw new Error('R2 client not initialized.');
    }

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn });
  }

  /**
   * Check if R2 is configured
   */
  isConfigured(): boolean {
    return !!this.s3Client;
  }
}
