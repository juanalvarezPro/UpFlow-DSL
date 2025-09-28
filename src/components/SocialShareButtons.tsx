'use client';

import React from 'react';
import { Button } from './ui/button';
import { 
  Share2, 
  MessageCircle, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Send,
  Copy,
  Check
} from 'lucide-react';
import { generateSharingUrl, SOCIAL_SHARING_CONFIG } from '../constants/socialSharing';
import { toast } from 'sonner';
import { useState } from 'react';

interface SocialShareButtonsProps {
  url?: string;
  title?: string;
  description?: string;
  className?: string;
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function SocialShareButtons({
  url,
  title,
  description,
  className = '',
  showLabels = false,
  size = 'md'
}: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = (platform: keyof typeof SOCIAL_SHARING_CONFIG.sharingUrls) => {
    const sharingUrl = generateSharingUrl(platform, {
      url,
      title,
      description
    });
    
    // Abrir en nueva ventana
    window.open(sharingUrl, '_blank', 'width=600,height=400');
  };

  const handleCopyLink = async () => {
    try {
      const linkToCopy = url || SOCIAL_SHARING_CONFIG.baseUrl;
      await navigator.clipboard.writeText(linkToCopy);
      setCopied(true);
      toast.success('¡Enlace copiado al portapapeles!');
      
      // Resetear el estado después de 2 segundos
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Error al copiar el enlace');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || SOCIAL_SHARING_CONFIG.defaultTitle,
          text: description || SOCIAL_SHARING_CONFIG.defaultDescription,
          url: url || SOCIAL_SHARING_CONFIG.baseUrl,
        });
      } catch (error) {
        // El usuario canceló el sharing
      }
    } else {
      // Fallback: copiar al portapapeles
      handleCopyLink();
    }
  };

  const sizeClasses = {
    sm: 'h-8 w-8 p-1.5',
    md: 'h-10 w-10 p-2',
    lg: 'h-12 w-12 p-3'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Botón de compartir nativo */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleNativeShare}
        className={`${sizeClasses[size]} text-slate-300 hover:text-white hover:bg-blue-500/20 border border-blue-500/20`}
        title="Compartir"
      >
        <Share2 className={iconSizes[size]} />
        {showLabels && <span className={`ml-2 ${textSizes[size]}`}>Compartir</span>}
      </Button>

      {/* WhatsApp */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleShare('whatsapp')}
        className={`${sizeClasses[size]} text-green-400 hover:text-green-300 hover:bg-green-500/20 border border-green-500/20`}
        title="Compartir en WhatsApp"
      >
        <MessageCircle className={iconSizes[size]} />
        {showLabels && <span className={`ml-2 ${textSizes[size]}`}>WhatsApp</span>}
      </Button>

      {/* Facebook */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleShare('facebook')}
        className={`${sizeClasses[size]} text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 border border-blue-500/20`}
        title="Compartir en Facebook"
      >
        <Facebook className={iconSizes[size]} />
        {showLabels && <span className={`ml-2 ${textSizes[size]}`}>Facebook</span>}
      </Button>

      {/* Twitter */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleShare('twitter')}
        className={`${sizeClasses[size]} text-sky-400 hover:text-sky-300 hover:bg-sky-500/20 border border-sky-500/20`}
        title="Compartir en Twitter"
      >
        <Twitter className={iconSizes[size]} />
        {showLabels && <span className={`ml-2 ${textSizes[size]}`}>Twitter</span>}
      </Button>

      {/* LinkedIn */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleShare('linkedin')}
        className={`${sizeClasses[size]} text-blue-600 hover:text-blue-500 hover:bg-blue-600/20 border border-blue-600/20`}
        title="Compartir en LinkedIn"
      >
        <Linkedin className={iconSizes[size]} />
        {showLabels && <span className={`ml-2 ${textSizes[size]}`}>LinkedIn</span>}
      </Button>

      {/* Copiar enlace */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopyLink}
        className={`${sizeClasses[size]} ${copied ? 'text-green-400 bg-green-500/20 border-green-500/30' : 'text-slate-300 hover:text-white hover:bg-blue-500/20 border border-blue-500/20'}`}
        title={copied ? '¡Copiado!' : 'Copiar enlace'}
      >
        {copied ? <Check className={iconSizes[size]} /> : <Copy className={iconSizes[size]} />}
        {showLabels && <span className={`ml-2 ${textSizes[size]}`}>{copied ? 'Copiado' : 'Copiar'}</span>}
      </Button>
    </div>
  );
}
