import { generatePdfBuffer } from './make/pdf-make';
import { buildOrderDocument } from './templates/order-document';
import type { OrderPdfInput } from './types/order-pdf-input';

export async function generateOrderPdf(input: OrderPdfInput): Promise<Uint8Array> {
    const docDefinition = buildOrderDocument(input);
    return generatePdfBuffer(docDefinition);
}
