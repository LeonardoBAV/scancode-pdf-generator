export type OrderPdfStatus = 'pending' | 'completed' | 'cancelled';

export interface OrderPdfItemInput {
    productName: string;
    qty: number;
    unitPrice: number;
}

export interface OrderPdfInput {
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
