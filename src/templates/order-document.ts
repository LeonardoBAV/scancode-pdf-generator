import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import { formatCNPJ, formatCurrencyBR, formatIsoDateToBR } from '../format/br';
import type { OrderPdfInput, OrderPdfItemInput, OrderPdfStatus } from '../types/order-pdf-input';

const TABLE_HEADER_FILL: string = '#1e293b';
const TABLE_HEADER_TEXT: string = '#f8fafc';
const TABLE_ROW_ALT_FILL: string = '#f1f5f9';
const TABLE_BORDER: string = '#cbd5e1';

const ORDER_STATUS_LABELS: Record<OrderPdfStatus, string> = {
    pending: 'Aberto',
    completed: 'Finalizado',
    cancelled: 'Cancelado',
};

export function buildOrderDocument(input: OrderPdfInput): TDocumentDefinitions {
    const orderNumber: string = String(input.orderId);
    const createdAt: string = formatIsoDateToBR(input.createdAt.slice(0, 10));
    const updatedAt: string = formatIsoDateToBR(input.updatedAt.slice(0, 10));
    const statusLabel: string = ORDER_STATUS_LABELS[input.status] ?? input.status;
    const subtotal: number = input.items.reduce(
        (sum: number, item: OrderPdfItemInput) => sum + item.unitPrice * item.qty,
        0,
    );

    const itemRows = input.items.map((item: OrderPdfItemInput, index: number) => {
        const lineTotal: number = item.unitPrice * item.qty;
        const rowFill: string | undefined = index % 2 === 1 ? TABLE_ROW_ALT_FILL : undefined;
        return [
            { text: item.productName, style: index % 2 === 1 ? 'tableCellAlt' : 'tableCell' },
            { text: String(item.qty), style: 'tableCell', fillColor: rowFill },
            { text: 'un', style: 'tableCell', fillColor: rowFill },
            { text: formatCurrencyBR(item.unitPrice), style: 'tableCell', fillColor: rowFill },
            { text: formatCurrencyBR(lineTotal), style: 'tableCellBold', fillColor: rowFill },
        ];
    });

    const orderInfoRows: { label: string; value: string }[] = [
        { label: 'Data de Criação', value: createdAt },
        { label: 'Data de Alteração', value: updatedAt },
        { label: 'Status', value: statusLabel },
        { label: 'Nome do Cliente (Razão Social)', value: input.corporateName },
        { label: 'CNPJ', value: formatCNPJ(input.cnpj) },
        { label: 'Nome Comprador', value: input.buyerName },
        { label: 'Email Comprador', value: input.buyerEmail },
        { label: 'Tipo de Pagamento', value: input.paymentMethodName },
        { label: 'Transportadora', value: input.carrier },
    ];

    return {
        pageSize: 'A4',
        pageMargins: [40, 48, 40, 48],
        defaultStyle: { font: 'Roboto', fontSize: 10, color: '#334155' },
        content: [
            { text: input.distributorName, style: 'distributorTitle' },
            { text: `Pedido #${orderNumber}`, style: 'orderTitle', margin: [0, 0, 0, 20] },
            { text: 'INFORMAÇÕES DO PEDIDO AQUI MOSTA QUE MUDOU ALGO SIMM KKKK', style: 'sectionLabel', margin: [0, 0, 0, 8] },
            {
                stack: orderInfoRows.map((row: { label: string; value: string }) => ({
                    text: [
                        { text: `${row.label}: `, style: 'infoLabel' },
                        { text: row.value, style: 'infoValue' },
                    ],
                    margin: [0, 0, 0, 6],
                })),
                margin: [0, 0, 0, 24],
            },
            { text: 'ITENS DO PEDIDO mudoi 3 kkkk', style: 'sectionLabel', margin: [0, 0, 0, 8] },
            {
                table: {
                    headerRows: 1,
                    widths: ['*', 40, 40, 72, 72],
                    body: [
                        [
                            { text: 'Produto', style: 'tableHeader' },
                            { text: 'Qtd', style: 'tableHeader' },
                            { text: 'Un', style: 'tableHeader' },
                            { text: 'Preço', style: 'tableHeader' },
                            { text: 'Total', style: 'tableHeader' },
                        ],
                        ...itemRows,
                    ],
                },
                layout: {
                    hLineWidth: () => 0.5,
                    vLineWidth: () => 0.5,
                    hLineColor: () => TABLE_BORDER,
                    vLineColor: () => TABLE_BORDER,
                    paddingLeft: () => 8,
                    paddingRight: () => 8,
                    paddingTop: () => 6,
                    paddingBottom: () => 6,
                },
                margin: [0, 0, 0, 16],
            },
            {
                stack: [
                    {
                        text: [
                            { text: 'Subtotal: ', style: 'totalLabel' },
                            { text: formatCurrencyBR(subtotal), style: 'totalValue' },
                        ],
                        margin: [0, 0, 0, 4],
                    },
                    {
                        text: [
                            { text: 'Total: ', style: 'totalLabelBold' },
                            { text: formatCurrencyBR(subtotal), style: 'totalValueBold' },
                        ],
                    },
                ],
                margin: [0, 0, 0, 20],
            },
            {
                stack: [
                    { text: 'OBSERVAÇÕES', style: 'sectionLabel', margin: [0, 0, 0, 4] },
                    { text: input.observation, style: 'observation' },
                ],
            },
        ],
        styles: {
            distributorTitle: { fontSize: 20, bold: true, color: '#0f172a' },
            orderTitle: { fontSize: 14, bold: true, color: '#334155' },
            sectionLabel: { fontSize: 8, bold: true, color: '#64748b' },
            infoLabel: { fontSize: 9, bold: true, color: '#475569' },
            infoValue: { fontSize: 9, color: '#0f172a' },
            tableHeader: { bold: true, fontSize: 9, color: TABLE_HEADER_TEXT, fillColor: TABLE_HEADER_FILL },
            tableCell: { fontSize: 9 },
            tableCellAlt: { fontSize: 9, fillColor: TABLE_ROW_ALT_FILL },
            tableCellBold: { fontSize: 9, bold: true },
            totalLabel: { fontSize: 9, color: '#64748b' },
            totalLabelBold: { fontSize: 10, bold: true, color: '#0f172a' },
            totalValue: { fontSize: 9, color: '#0f172a' },
            totalValueBold: { fontSize: 11, bold: true, color: '#0f172a' },
            observation: { fontSize: 9, color: '#475569', italics: true },
        },
    };
}
