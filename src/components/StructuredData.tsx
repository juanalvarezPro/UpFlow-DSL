'use client';

export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "UpFLows",
    "description": "Crea flujos interactivos para WhatsApp Business con sintaxis natural. Diseña conversaciones, formularios y experiencias de usuario sin código.",
    "url": "https://upflows.juanalvarez.pro",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "creator": {
      "@type": "Organization",
      "name": "UpFLows Team",
      "url": "https://upflows.juanalvarez.pro"
    },
    "featureList": [
      "Sintaxis natural para crear flujos",
      "Integración con WhatsApp Business",
      "Editor visual sin código",
      "Formularios interactivos",
      "Automatización de conversaciones",
      "Vista previa en tiempo real"
    ],
    "screenshot": "https://upflows.juanalvarez.pro/upflows-og-image.png",
    "softwareVersion": "1.0.0",
    "datePublished": "2024-01-15",
    "dateModified": "2024-01-15",
    "inLanguage": "es",
    "isAccessibleForFree": true,
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "softwareHelp": "https://upflows.juanalvarez.pro/help",
    "supportingData": {
      "@type": "DataCatalog",
      "name": "UpFLows Documentation",
      "url": "https://upflows.juanalvarez.pro/docs"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
