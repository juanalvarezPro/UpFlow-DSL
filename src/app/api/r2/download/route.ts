import { NextRequest, NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

// Configuración de Cloudflare R2 (solo servidor)
const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME!;

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
    }

    // Verificar si es una URL de R2 (endpoint directo o dominio público)
    const isDirectR2Url = url.includes(process.env.R2_ENDPOINT!) && url.includes(BUCKET_NAME);
    const isPublicDomainUrl = process.env.R2_PUBLIC_DOMAIN && url.includes(process.env.R2_PUBLIC_DOMAIN);
    
    if (!isDirectR2Url && !isPublicDomainUrl) {
      return NextResponse.json({ error: 'Invalid R2 URL' }, { status: 400 });
    }

    // Extraer la key de la URL
    const urlParts = url.split('/');
    const key = urlParts.slice(-2).join('/'); // temp/image_id

    // Descargar de R2
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const response = await r2Client.send(command);
    const arrayBuffer = await response.Body?.transformToByteArray();

    if (!arrayBuffer) {
      return NextResponse.json({ error: 'Failed to download image' }, { status: 500 });
    }

    // Convertir a base64 puro (sin prefijo)
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    return NextResponse.json({
      success: true,
      data: {
        url,
        base64,
        contentType: response.ContentType || 'image/png',
      },
    });

  } catch (error) {
    console.error('Error downloading from R2:', error);
    return NextResponse.json(
      { error: 'Failed to download image' },
      { status: 500 }
    );
  }
}
