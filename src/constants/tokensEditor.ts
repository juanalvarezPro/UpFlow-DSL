import type * as monaco from 'monaco-editor';
import { Keywords } from '@/enums/keyWords';

// Create regex patterns for all keywords, escaping special characters
const pantallaRegex = new RegExp(`\\b${Keywords.Pantalla}\\b`);
const mostramosRegex = new RegExp(`\\b${Keywords.Mostramos}\\b`);
const listaRegex = new RegExp(`\\b${Keywords.Lista}\\b`);
const siEligesRegex = new RegExp(Keywords.SiEliges.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
const irAPantallaRegex = new RegExp(Keywords.IrAPantalla.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
const salirRegex = new RegExp(`\\b${Keywords.Salir}\\b`);
const cancelarRegex = new RegExp(`\\b${Keywords.Cancelar}\\b`);
const siRegex = new RegExp(`\\b${Keywords.Sí}\\b`);
const noRegex = new RegExp(`\\b${Keywords.No}\\b`);
const imagenRegex = new RegExp(`\\b${Keywords.Imagen}\\b`);
const formularioRegex = new RegExp(Keywords.Formulario.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
const opcionalRegex = new RegExp(`\\b${Keywords.Opcional}\\b`);


export const tokensEditor = {
    tokenizer: {
        root: [
            [pantallaRegex, 'keyword'],
            [mostramosRegex, 'keyword'],
            [listaRegex, 'keyword'],
            [siEligesRegex, 'keyword'],
            [irAPantallaRegex, 'keyword'],
            [salirRegex, 'keyword'],
            [cancelarRegex, 'keyword'],
            [siRegex, 'keyword'],
            [noRegex, 'keyword'],
            [imagenRegex, 'keyword'],
            [formularioRegex, 'keyword'],
            [opcionalRegex, 'keyword'],
            [/•/, 'bullet'],
            [/[0-9]+\./, 'number'],
            [/\[IMAGEN:[^\]]*\]/, 'string'],
            [/\[FORMULARIO\]/, 'keyword'],
            [/"[^"]*"/, 'string'],
            [/[a-zA-Z][a-zA-Z0-9\s]*/, 'identifier'],
            [/\s+/, 'white'],
        ],
    },
} as monaco.languages.IMonarchLanguage;