'use client';

import { useState } from "react";

export function useJSONPreview({ data }: { data: unknown }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy JSON:', err);
        }
    };

    const formatJSON = (obj: unknown, indent: number = 0): string => {
        if (obj === null) return 'null';
        if (typeof obj === 'string') return `"${obj}"`;
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
        copied,
    }
}