import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

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

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      console.log('❌ No file provided');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validar tipo de archivo (permitir texto para testing)
    if (!file.type.startsWith('image/') && !file.type.startsWith('text/')) {
      console.log('❌ Invalid file type:', file.type);
      return NextResponse.json({ error: 'File must be an image or text' }, { status: 400 });
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.log('❌ File too large:', file.size);
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
    }

    // Generar ID único
    const id = `image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const key = `temp/${id}`;


    // Convertir archivo a buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Sanitizar nombre del archivo para metadata
    const sanitizedName = file.name
      .replace(/[^a-zA-Z0-9.-]/g, '_') // Reemplazar caracteres especiales con _
      .substring(0, 50); // Limitar longitud


    // Subir a R2
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      Metadata: {
        originalName: sanitizedName, // Usar nombre sanitizado
        uploadedAt: new Date().toISOString(),
      },
    });

    await r2Client.send(command);

    // Generar URL usando dominio público si está configurado, sino usar endpoint directo
    const publicDomain = process.env.R2_PUBLIC_DOMAIN;
    const url = publicDomain 
      ? `${publicDomain}/${key}`
      : `${process.env.R2_ENDPOINT}/${BUCKET_NAME}/${key}`;


    return NextResponse.json({
      success: true,
      data: {
        id,
        url,
        name: file.name, // Nombre original
        sanitizedName, // Nombre sanitizado
        size: file.size,
        uploadedAt: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('❌ Error uploading to R2:', error);
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { 
        error: 'Failed to upload image',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
