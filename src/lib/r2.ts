import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { R2_CONFIG } from './r2-config';

// Configuración de Cloudflare R2
const r2Client = new S3Client({
  region: 'auto',
  endpoint: R2_CONFIG.endpoint,
  credentials: {
    accessKeyId: R2_CONFIG.accessKeyId,
    secretAccessKey: R2_CONFIG.secretAccessKey,
  },
});

const BUCKET_NAME = R2_CONFIG.bucketName;

export interface R2ImageData {
  id: string;
  url: string;
  name: string;
  size: number;
  uploadedAt: string;
}

// Subir imagen a R2
export async function uploadImageToR2(file: File): Promise<R2ImageData> {
  const id = `image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const key = `temp/${id}`;
  
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      Metadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
      },
    });
    
    await r2Client.send(command);
    
    // Generar URL usando dominio público si está configurado, sino usar endpoint directo
    const url = R2_CONFIG.publicDomain 
      ? `${R2_CONFIG.publicDomain}/${key}`
      : `${R2_CONFIG.endpoint}/${BUCKET_NAME}/${key}`;
    
    return {
      id,
      url,
      name: file.name,
      size: file.size,
      uploadedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Error al subir la imagen');
  }
}

// Descargar imagen de R2 y convertir a base64
export async function downloadImageAsBase64(url: string): Promise<string> {
  try {
    // Extraer la key de la URL
    const urlParts = url.split('/');
    const key = urlParts.slice(-2).join('/'); // temp/image_id
    
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });
    
    const response = await r2Client.send(command);
    const arrayBuffer = await response.Body?.transformToByteArray();
    
    if (!arrayBuffer) {
      throw new Error('No se pudo descargar la imagen');
    }
    
    // Convertir a base64 puro (sin prefijo)
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    
    return base64;
  } catch (error) {
    console.error('Error downloading image:', error);
    throw new Error('Error al descargar la imagen');
  }
}

// Eliminar imagen de R2
export async function deleteImageFromR2(url: string): Promise<void> {
  try {
    const urlParts = url.split('/');
    const key = urlParts.slice(-2).join('/');
    
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });
    
    await r2Client.send(command);
  } catch (error) {
    console.error('Error deleting image:', error);
    // No lanzar error para no interrumpir el flujo
  }
}

// Verificar si una URL es de R2
export function isR2Url(url: string): boolean {
  return url.includes('r2.dev') || url.includes('r2.cloudflarestorage.com') || url.includes(BUCKET_NAME) || url.includes(R2_CONFIG.endpoint);
}
