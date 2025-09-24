import type * as monaco from 'monaco-editor';
import { Keywords } from '@/enums/keyWords';

const pantallaRegex = new RegExp(Keywords.Pantalla);
const mostramosRegex = new RegExp(Keywords.Mostramos);
const opcionesRegex = new RegExp(Keywords.Opciones);
const siEligesRegex = new RegExp(Keywords.SiEliges);
const irAPantallaRegex = new RegExp(Keywords.IrAPantalla);


export const tokensEditor = {
    tokenizer: {
        root: [
            [pantallaRegex, 'keyword'],
            [mostramosRegex, 'keyword'],
            [opcionesRegex, 'keyword'],
            [siEligesRegex, 'keyword'],
            [irAPantallaRegex, 'keyword'],
            [/•/, 'bullet'],
            [/[0-9]+\./, 'number'],
            [/"[^"]*"/, 'string'],
            [/[a-zA-Z][a-zA-Z0-9\s]*/, 'identifier'],
            [/\s+/, 'white'],
        ],
    },
} as monaco.languages.IMonarchLanguage;