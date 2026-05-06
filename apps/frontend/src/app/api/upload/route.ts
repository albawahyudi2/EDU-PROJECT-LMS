import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Initialize R2 client using Vercel environment variables
function getR2Client() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error('R2 credentials not configured');
  }

  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    forcePathStyle: true,
    credentials: { accessKeyId, secretAccessKey },
  });
}

export async function POST(request: NextRequest) {
  try {
    // Validate auth token (pass it to Railway backend to verify)
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify token with Railway backend
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const graphqlUrl = apiUrl.endsWith('/graphql') ? apiUrl : `${apiUrl}/graphql`;
    
    const verifyRes = await fetch(graphqlUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: authHeader },
      body: JSON.stringify({ query: '{ me { id } }' }),
    });
    const verifyData = await verifyRes.json();
    if (!verifyData?.data?.me?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = verifyData.data.me.id;

    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const mediaType = formData.get('type') as string || 'IMAGE';
    const folder = formData.get('folder') as string || 'uploads';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Generate unique key
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split('.').pop();
    const key = `${folder}/${timestamp}-${randomStr}.${extension}`;

    // Upload to R2 from Vercel (no SSL issues)
    const r2 = getR2Client();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await r2.send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME || 'lms-abk-storage',
      Key: key,
      Body: buffer,
      ContentType: file.type,
    }));

    const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

    // Save to database via Railway backend
    const confirmRes = await fetch(graphqlUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: authHeader },
      body: JSON.stringify({
        query: `
          mutation ConfirmMediaUpload($key: String!, $originalName: String!, $mimeType: String!, $size: Int!, $type: MediaType!, $publicUrl: String!) {
            confirmMediaUpload(key: $key, originalName: $originalName, mimeType: $mimeType, size: $size, type: $type, publicUrl: $publicUrl) {
              id
              url
              originalName
              size
            }
          }
        `,
        variables: {
          key,
          originalName: file.name,
          mimeType: file.type,
          size: file.size,
          type: mediaType,
          publicUrl,
        },
      }),
    });

    const confirmData = await confirmRes.json();
    if (confirmData.errors) {
      throw new Error(confirmData.errors[0].message);
    }

    return NextResponse.json({ 
      success: true,
      media: confirmData.data.confirmMediaUpload,
    });

  } catch (error: any) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}
