import type * as monaco from 'monaco-editor';
import { Keywords } from '@/enums/keyWords';

// Create regex patterns for all keywords, escaping special characters
const pantallaRegex = new RegExp(`\\b${Keywords.Pantalla}\\b`);
const listaRegex = new RegExp(`\\b${Keywords.Lista}\\b`);
const irAPantallaRegex = new RegExp(Keywords.IrAPantalla.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
const imagenRegex = new RegExp(`\\b${Keywords.Imagen}\\b`);
const opcionalRegex = new RegExp(`\\b${Keywords.Opcional}\\b`);
const tituloRegex = new RegExp(`\\b${Keywords.Titulo}\\b`);


export const tokensEditor = {
    tokenizer: {
        root: [
            [/\/\/.*$/, 'comment'], // Comentarios de línea
            [pantallaRegex, 'keyword'],
            [tituloRegex, 'keyword'],
            [listaRegex, 'keyword'],
            [irAPantallaRegex, 'keyword'],
            [imagenRegex, 'keyword'],
            [opcionalRegex, 'keyword'],
            [/•/, 'bullet'],
            [/[0-9]+\./, 'number'],
            [/\[IMAGEN:[^\]]*\]/, 'string'],
            [/"[^"]*"/, 'string'],
            [/[a-zA-Z][a-zA-Z0-9\s]*/, 'identifier'],
            [/\s+/, 'white'],
        ],
    },
} as monaco.languages.IMonarchLanguage;