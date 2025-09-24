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
            className={`
                flex items-center gap-2 glass-subtle border border-blue-500/20 hover:border-blue-400/30 
                text-slate-300 hover:text-slate-100 hover:bg-blue-500/10 transition-all duration-200
                ${copied ? 'text-green-400 hover:text-green-300 border-green-500/30' : ''}
                ${!isValid ? 'opacity-50 cursor-not-allowed' : ''}
            `}
        >
            {copied ? (
                <>
                    <Check className="h-4 w-4" />
                    <span className="text-sm font-medium">Copiado</span>
                </>
            ) : (
                <>
                    <Copy className="h-4 w-4" />
                    <span className="text-sm font-medium">Copiar</span>
                </>
            )}
        </Button>
    )
}