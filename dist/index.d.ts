type OrderPdfStatus = 'pending' | 'completed' | 'cancelled';
interface OrderPdfItemInput {
    productName: string;
    qty: number;
    unitPrice: number;
}
interface OrderPdfInput {
    orderId: number | string;
    createdAt: string;
    updatedAt: string;
    status: OrderPdfStatus;
    corporateName: string;
    cnpj: string;
    buyerName: string;
    buyerEmail: string;
    paymentMethodName: string;
    carrier: string;
    observation: string;
    distributorName: string;
    items: OrderPdfItemInput[];
}

declare function generateOrderPdf(input: OrderPdfInput): Promise<Uint8Array>;

export { type OrderPdfInput, type OrderPdfItemInput, type OrderPdfStatus, generateOrderPdf };
