'use client';

import { useState, useEffect } from "react";
import { useJSONConverter } from '../useJSONConverter';
import { ImageTooltip } from '@/components/ui/ImageTooltip';
import { R2_CONFIG } from '@/lib/r2-config';

// Función para detectar si un string es base64 de imagen
const isBase64Image = (str: string): boolean => {
    // Base64 válido debe tener solo caracteres base64 y ser de longitud múltiplo de 4
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    return base64Regex.test(str) && str.length > 100 && str.length % 4 === 0;
};

// Función para verificar si una URL es de R2
const isR2Url = (url: string): boolean => {
    return url.includes('r2.dev') || url.includes('r2.cloudflarestorage.com') || url.includes('upflows');
};

export function useJSONPreview({ data }: { data: unknown }) {
    const [copied, setCopied] = useState(false);
    const [convertedData, setConvertedData] = useState(data);
    const [isConverting, setIsConverting] = useState(false);
    const { convertR2UrlsToBase64 } = useJSONConverter();

    // Convertir URLs de R2 a base64 cuando cambie el data
    useEffect(() => {
        const convertData = async () => {
            setIsConverting(true);
            try {
                const converted = await convertR2UrlsToBase64(data);
                setConvertedData(converted);
            } catch (error) {
                console.error('Error converting data:', error);
                setConvertedData(data);
            } finally {
                setIsConverting(false);
            }
        };

        convertData();
    }, [data, convertR2UrlsToBase64]);

    const handleCopy = async () => {
        try {
            // Copiar el JSON convertido (con base64)
            await navigator.clipboard.writeText(JSON.stringify(convertedData, null, 2));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy JSON:', err);
        }
    };

    const formatJSONWithTooltips = (obj: unknown, indent: number = 0): React.ReactNode => {
        if (obj === null) return 'null';
        if (typeof obj === 'string') {
            // Si es una imagen base64 muy larga (con o sin prefijo), mostrar solo una referencia
            if (obj.length > 100 && (obj.startsWith('data:image/') || isBase64Image(obj))) {
                return (
                    <ImageTooltip url={obj}>
                        <span className="text-blue-300">&quot;[IMAGEN_BASE64_{obj.length}_caracteres]&quot;</span>
                    </ImageTooltip>
                );
            }
            // Si es una URL de R2, mostrar referencia con tooltip
            if (obj.startsWith('https://') && isR2Url(obj)) {
                // Si ya es una URL pública de R2 (pub-xxx.r2.dev), usar directamente
                let tooltipUrl = obj;
                if (R2_CONFIG.publicDomain && obj.includes(R2_CONFIG.endpoint) && obj.includes(R2_CONFIG.bucketName)) {
                    // Solo convertir si es una URL del endpoint interno, no si ya es pública
                    const urlParts = obj.split('/');
                    const key = urlParts.slice(-2).join('/'); // temp/image_id
                    tooltipUrl = `${R2_CONFIG.publicDomain}/${key}`;
                }
                return (
                    <ImageTooltip url={tooltipUrl}>
                        <span className="text-blue-300">[URL_R2_{obj.split('/').pop()}]</span>
                    </ImageTooltip>
                );
            }
            return `"${obj}"`;
        }
        if (typeof obj === 'number' || typeof obj === 'boolean') return String(obj);

        if (Array.isArray(obj)) {
            if (obj.length === 0) return '[]';
            const items = obj.map((item, index) => (
                <div key={index} className="ml-4">
                    {formatJSONWithTooltips(item, indent + 1)}
                    {index < obj.length - 1 && ','}
                </div>
            ));
            return (
                <span>
                    [
                    {items}
                    ]
                </span>
            );
        }

        if (typeof obj === 'object') {
            const entries = Object.entries(obj);
            if (entries.length === 0) return '{}';
            
            const items = entries.map(([key, value], index) => (
                <div key={key} className="ml-4">
                    <span className="text-green-300">&quot;{key}&quot;</span>: {formatJSONWithTooltips(value, indent + 1)}
                    {index < entries.length - 1 && ','}
                </div>
            ));
            
            return (
                <span>
                    {'{'}
                    {items}
                    {'}'}
                </span>
            );
        }

        return String(obj);
    };

    const formatJSON = (obj: unknown, indent: number = 0): string => {
        if (obj === null) return 'null';
        if (typeof obj === 'string') {
            // Si es una imagen base64 muy larga (con o sin prefijo), mostrar solo una referencia
            if (obj.length > 100 && (obj.startsWith('data:image/') || isBase64Image(obj))) {
                return `"[IMAGEN_BASE64_${obj.length}_caracteres]"`;
            }
            // Si es una URL de R2, mostrar referencia con tooltip
            if (obj.startsWith('https://') && isR2Url(obj)) {
                return `"[URL_R2_${obj.split('/').pop()}]"`;
            }
            return `"${obj}"`;
        }
        if (typeof obj === 'number' || typeof obj === 'boolean') return String(obj);

        if (Array.isArray(obj)) {
            if (obj.length === 0) return '[]';
            const items = obj.map(item =>
                '  '.repeat(indent + 1) + formatJSON(item, indent + 1)
            ).join(',\n');
            return `[\n${items}\n${'  '.repeat(indent)}]`;
        }

        if (typeof obj === 'object') {
            const entries = Object.entries(obj);
            if (entries.length === 0) return '{}';

            const items = entries.map(([key, value]) =>
                '  '.repeat(indent + 1) + `"${key}": ${formatJSON(value, indent + 1)}`
            ).join(',\n');

            return `{\n${items}\n${'  '.repeat(indent)}}`;
        }

        return String(obj);
    };


    return {
        handleCopy,
        formatJSON,
        formatJSONWithTooltips,
        copied,
        isConverting,
        convertedData,
    }
}