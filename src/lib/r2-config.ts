// Configuración de Cloudflare R2
// Copia este archivo a .env.local y configura tus credenciales

export const R2_CONFIG = {
  endpoint: process.env.NEXT_PUBLIC_R2_ENDPOINT || process.env.R2_ENDPOINT || 'https://your-account-id.r2.cloudflarestorage.com',
  accessKeyId: process.env.NEXT_PUBLIC_R2_ACCESS_KEY_ID || process.env.R2_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.NEXT_PUBLIC_R2_SECRET_ACCESS_KEY || process.env.R2_SECRET_ACCESS_KEY || '',
  bucketName: process.env.NEXT_PUBLIC_R2_BUCKET_NAME || process.env.R2_BUCKET_NAME || 'upflows',
  // Dominio público personalizado (opcional)
  publicDomain: process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN || process.env.R2_PUBLIC_DOMAIN || null,
};
