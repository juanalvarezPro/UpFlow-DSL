'use client';

import React from 'react'
import { Button } from './button'
import { Check, Copy } from 'lucide-react'

interface CopyButtonProps {
    handleCopy: () => void;
    isValid: boolean;
    copied: boolean;
}

export const CopyButton = ({ handleCopy, isValid, copied }: CopyButtonProps) => {
    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            disabled={!isValid}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700"
        >
            {copied ? (
                <>
                    <Check className="h-4 w-4" />
                    <span className="text-sm">Copiado</span>
                </>
            ) : (
                <>
                    <Copy className="h-4 w-4" />
                    <span className="text-sm">Copiar</span>
                </>
            )}
        </Button>
    )
}