'use client';

import Head from 'next/head';

interface SocialSharingProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}

export function SocialSharing({
  title = 'UpFLows - Creador de Flujos de WhatsApp Business',
  description = 'Crea flujos interactivos para WhatsApp Business con sintaxis natural. Diseña conversaciones, formularios y experiencias de usuario sin código.',
  image = 'https://upflows.juanalvarez.pro/upflows-og-image.png',
  url = 'https://upflows.juanalvarez.pro',
  type = 'website'
}: SocialSharingProps) {
  return (
    <Head>
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="UpFLows" />
      <meta property="og:locale" content="es_ES" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:site" content="@upflows" />
      <meta name="twitter:creator" content="@upflows" />

      {/* WhatsApp específico */}
      <meta property="og:image" content="https://upflows.juanalvarez.pro/whatsapp-share-image.png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="1200" />

      {/* LinkedIn */}
      <meta property="og:updated_time" content={new Date().toISOString()} />

      {/* Pinterest */}
      <meta name="pinterest-rich-pin" content="true" />

      {/* Meta tags adicionales para mejor compatibilidad */}
      <meta name="description" content={description} />
      <meta name="keywords" content="WhatsApp Business, flujos de conversación, automatización WhatsApp, chatbot WhatsApp, formularios WhatsApp, sintaxis natural, no-code, creador de flujos" />
    </Head>
  );
}
