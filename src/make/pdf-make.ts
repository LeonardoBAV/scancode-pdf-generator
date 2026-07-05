import pdfMake from 'pdfmake/build/pdfmake';
import pdfFontsModule from 'pdfmake/build/vfs_fonts';
import type { TDocumentDefinitions } from 'pdfmake/interfaces';

const pdfVfs: Record<string, string> = pdfFontsModule as unknown as Record<string, string>;
(pdfMake as { vfs: Record<string, string> }).vfs = pdfVfs;

export function generatePdfBuffer(docDefinition: TDocumentDefinitions): Promise<Uint8Array> {
    return new Promise((resolve: (buffer: Uint8Array) => void, reject: (error: unknown) => void) => {
        let pdf;
        try {
            pdf = pdfMake.createPdf(docDefinition);
        } catch (err: unknown) {
            reject(err);
            return;
        }

        try {
            pdf.getBuffer((buffer: Uint8Array) => {
                resolve(buffer);
            });
        } catch (err: unknown) {
            reject(err);
        }
    });
}
