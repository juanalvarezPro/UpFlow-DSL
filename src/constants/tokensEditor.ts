import * as monaco from 'monaco-editor';
import { Keywords } from '@/enums/keywords';

export const tokensEditor = ({ nameEditor }: { nameEditor: string }) => {
    monaco.languages.setMonarchTokensProvider(nameEditor, {
        tokenizer: {
            root: [
                [`/${Keywords.Pantalla}/`, 'keyword'],
                [`/${Keywords.Mostramos}:/`, 'keyword'],
                [`/${Keywords.Opciones}:/`, 'keyword'],
                [`/${Keywords.SiEliges}/`, 'keyword'],
                [`/${Keywords.IrAPantalla}/`, 'keyword'],
                [/[0-9]+\./, 'number'],
                [/"[^"]*"/, 'string'],
                [/[a-zA-Z][a-zA-Z0-9\s]*/, 'identifier'],
                [/\s+/, 'white'],
            ],
        },
    });
};