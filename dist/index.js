// src/make/pdf-make.ts
import pdfMake from "pdfmake/build/pdfmake";
import pdfFontsModule from "pdfmake/build/vfs_fonts";
var pdfVfs = pdfFontsModule;
pdfMake.vfs = pdfVfs;
function generatePdfBuffer(docDefinition) {
  return new Promise((resolve, reject) => {
    let pdf;
    try {
      pdf = pdfMake.createPdf(docDefinition);
    } catch (err) {
      reject(err);
      return;
    }
    try {
      pdf.getBuffer((buffer) => {
        resolve(buffer);
      });
    } catch (err) {
      reject(err);
    }
  });
}

// src/format/br.ts
function formatIsoDateToBR(isoDate) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim());
  if (!m) {
    return isoDate;
  }
  return `${m[3]}/${m[2]}/${m[1]}`;
}
function formatCurrencyBR(value) {
  const fixed = value.toFixed(2);
  const [intPart, decPart] = fixed.split(".");
  const withThousands = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return "R$ " + withThousands + "," + decPart;
}
function formatCNPJ(value) {
  if (!value) {
    return "\u2014";
  }
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 14) {
    return value;
  }
  return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
}

// src/templates/order-document.ts
var TABLE_HEADER_FILL = "#1e293b";
var TABLE_HEADER_TEXT = "#f8fafc";
var TABLE_ROW_ALT_FILL = "#f1f5f9";
var TABLE_BORDER = "#cbd5e1";
var ORDER_STATUS_LABELS = {
  pending: "Aberto",
  completed: "Finalizado",
  cancelled: "Cancelado"
};
function buildOrderDocument(input) {
  const orderNumber = String(input.orderId);
  const createdAt = formatIsoDateToBR(input.createdAt.slice(0, 10));
  const updatedAt = formatIsoDateToBR(input.updatedAt.slice(0, 10));
  const statusLabel = ORDER_STATUS_LABELS[input.status] ?? input.status;
  const subtotal = input.items.reduce(
    (sum, item) => sum + item.unitPrice * item.qty,
    0
  );
  const itemRows = input.items.map((item, index) => {
    const lineTotal = item.unitPrice * item.qty;
    const rowFill = index % 2 === 1 ? TABLE_ROW_ALT_FILL : void 0;
    return [
      { text: item.productName, style: index % 2 === 1 ? "tableCellAlt" : "tableCell" },
      { text: String(item.qty), style: "tableCell", fillColor: rowFill },
      { text: "un", style: "tableCell", fillColor: rowFill },
      { text: formatCurrencyBR(item.unitPrice), style: "tableCell", fillColor: rowFill },
      { text: formatCurrencyBR(lineTotal), style: "tableCellBold", fillColor: rowFill }
    ];
  });
  const orderInfoRows = [
    { label: "Data de Cria\xE7\xE3o", value: createdAt },
    { label: "Data de Altera\xE7\xE3o", value: updatedAt },
    { label: "Status", value: statusLabel },
    { label: "Nome do Cliente (Raz\xE3o Social)", value: input.corporateName },
    { label: "CNPJ", value: formatCNPJ(input.cnpj) },
    { label: "Nome Comprador", value: input.buyerName },
    { label: "Email Comprador", value: input.buyerEmail },
    { label: "Tipo de Pagamento", value: input.paymentMethodName },
    { label: "Transportadora", value: input.carrier }
  ];
  return {
    pageSize: "A4",
    pageMargins: [40, 48, 40, 48],
    defaultStyle: { font: "Roboto", fontSize: 10, color: "#334155" },
    content: [
      { text: input.distributorName, style: "distributorTitle" },
      { text: `Pedido #${orderNumber}`, style: "orderTitle", margin: [0, 0, 0, 20] },
      { text: "INFORMA\xC7\xD5ES DO PEDIDO AQUI MOSTA QUE MUDOU ALGO SIMM KKKK", style: "sectionLabel", margin: [0, 0, 0, 8] },
      {
        stack: orderInfoRows.map((row) => ({
          text: [
            { text: `${row.label}: `, style: "infoLabel" },
            { text: row.value, style: "infoValue" }
          ],
          margin: [0, 0, 0, 6]
        })),
        margin: [0, 0, 0, 24]
      },
      { text: "ITENS DO PEDIDO mudoi 3 kkkk", style: "sectionLabel", margin: [0, 0, 0, 8] },
      {
        table: {
          headerRows: 1,
          widths: ["*", 40, 40, 72, 72],
          body: [
            [
              { text: "Produto", style: "tableHeader" },
              { text: "Qtd", style: "tableHeader" },
              { text: "Un", style: "tableHeader" },
              { text: "Pre\xE7o", style: "tableHeader" },
              { text: "Total", style: "tableHeader" }
            ],
            ...itemRows
          ]
        },
        layout: {
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => TABLE_BORDER,
          vLineColor: () => TABLE_BORDER,
          paddingLeft: () => 8,
          paddingRight: () => 8,
          paddingTop: () => 6,
          paddingBottom: () => 6
        },
        margin: [0, 0, 0, 16]
      },
      {
        stack: [
          {
            text: [
              { text: "Subtotal: ", style: "totalLabel" },
              { text: formatCurrencyBR(subtotal), style: "totalValue" }
            ],
            margin: [0, 0, 0, 4]
          },
          {
            text: [
              { text: "Total: ", style: "totalLabelBold" },
              { text: formatCurrencyBR(subtotal), style: "totalValueBold" }
            ]
          }
        ],
        margin: [0, 0, 0, 20]
      },
      {
        stack: [
          { text: "OBSERVA\xC7\xD5ES", style: "sectionLabel", margin: [0, 0, 0, 4] },
          { text: input.observation, style: "observation" }
        ]
      }
    ],
    styles: {
      distributorTitle: { fontSize: 20, bold: true, color: "#0f172a" },
      orderTitle: { fontSize: 14, bold: true, color: "#334155" },
      sectionLabel: { fontSize: 8, bold: true, color: "#64748b" },
      infoLabel: { fontSize: 9, bold: true, color: "#475569" },
      infoValue: { fontSize: 9, color: "#0f172a" },
      tableHeader: { bold: true, fontSize: 9, color: TABLE_HEADER_TEXT, fillColor: TABLE_HEADER_FILL },
      tableCell: { fontSize: 9 },
      tableCellAlt: { fontSize: 9, fillColor: TABLE_ROW_ALT_FILL },
      tableCellBold: { fontSize: 9, bold: true },
      totalLabel: { fontSize: 9, color: "#64748b" },
      totalLabelBold: { fontSize: 10, bold: true, color: "#0f172a" },
      totalValue: { fontSize: 9, color: "#0f172a" },
      totalValueBold: { fontSize: 11, bold: true, color: "#0f172a" },
      observation: { fontSize: 9, color: "#475569", italics: true }
    }
  };
}

// src/generate-order-pdf.ts
async function generateOrderPdf(input) {
  const docDefinition = buildOrderDocument(input);
  return generatePdfBuffer(docDefinition);
}
export {
  generateOrderPdf
};
