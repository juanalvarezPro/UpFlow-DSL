export const SOCIAL_SHARING_CONFIG = {
  // URLs base
  baseUrl: 'https://upflows.juanalvarez.pro',
  
  // Imágenes para diferentes redes sociales
  images: {
    // Imagen rectangular para Facebook, Instagram, LinkedIn (1200x630)
    og: 'https://upflows.juanalvarez.pro/upflows-og-image.png',
    
    // Imagen cuadrada para WhatsApp (1200x1200)
    whatsapp: 'https://upflows.juanalvarez.pro/whatsapp-share-image.png',
    
    // Imagen para Twitter (1200x630)
    twitter: 'https://upflows.juanalvarez.pro/upflows-twitter-card.png',
    
    // Imagen para Pinterest (1200x630)
    pinterest: 'https://upflows.juanalvarez.pro/upflows-og-image.png'
  },
  
  // Textos por defecto
  defaultTitle: 'UpFLows - Creador de Flujos de WhatsApp Business',
  defaultDescription: 'Crea flujos interactivos para WhatsApp Business con sintaxis natural. Diseña conversaciones, formularios y experiencias de usuario sin código.',
  
  // Hashtags para redes sociales
  hashtags: {
    twitter: '#UpFLows #WhatsAppBusiness #NoCode #Automatización #FlujosDeConversación',
    instagram: '#UpFLows #WhatsAppBusiness #NoCode #Automatización #FlujosDeConversación #Tech #Innovación',
    linkedin: '#UpFLows #WhatsAppBusiness #NoCode #Automatización #FlujosDeConversación #Tech #Innovación #Productividad'
  },
  
  // URLs de sharing para diferentes redes sociales
  sharingUrls: {
    whatsapp: (url: string, text: string) => 
      `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
    
    facebook: (url: string) => 
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    
    twitter: (url: string, text: string, hashtags: string) => 
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}&hashtags=${encodeURIComponent(hashtags)}`,
    
    linkedin: (url: string, title: string, summary: string) => 
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(summary)}`,
    
    pinterest: (url: string, description: string, image: string) => 
      `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(description)}&media=${encodeURIComponent(image)}`,
    
    telegram: (url: string, text: string) => 
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
  }
};

// Función helper para generar URLs de sharing
export function generateSharingUrl(
  platform: keyof typeof SOCIAL_SHARING_CONFIG.sharingUrls,
  options: {
    url?: string;
    title?: string;
    description?: string;
    text?: string;
    hashtags?: string;
    image?: string;
  } = {}
): string {
  const config = SOCIAL_SHARING_CONFIG;
  const url = options.url || config.baseUrl;
  const title = options.title || config.defaultTitle;
  const description = options.description || config.defaultDescription;
  const text = options.text || `${title} - ${description}`;
  const hashtags = options.hashtags || config.hashtags.twitter;
  const image = options.image || config.images.og;

  switch (platform) {
    case 'whatsapp':
      return config.sharingUrls.whatsapp(url, text);
    case 'facebook':
      return config.sharingUrls.facebook(url);
    case 'twitter':
      return config.sharingUrls.twitter(url, text, hashtags);
    case 'linkedin':
      return config.sharingUrls.linkedin(url, title, description);
    case 'pinterest':
      return config.sharingUrls.pinterest(url, description, image);
    case 'telegram':
      return config.sharingUrls.telegram(url, text);
    default:
      return url;
  }
}
