import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Check credentials are configured
    if (!process.env.CLOUD_NAME || !process.env.CLOUD_API_SECRET) {
      return NextResponse.json(
        { error: 'Cloudinary not configured on server' },
        { status: 500 }
      );
    }

    // Convert File to base64 data URI for Cloudinary
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const dataUri = `data:${file.type};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'ecomarket/products',
      transformation: [
        { width: 800, height: 800, crop: 'limit' },
        { quality: 'auto', fetch_format: 'auto' },
      ],
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
