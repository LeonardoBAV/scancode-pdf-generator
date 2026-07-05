# @scancode/pdf-core

Geração de PDF (pdfmake) para pedidos ScanCode. Consumido pelo app NativeScript e, no futuro, pelo serviço Node/Laravel.

## Instalação (consumidor)

```bash
npm install github:LeonardoBAV/pdf-core-scancode#v0.1.0
```

Em monorepo com myCoolApp, clonar para `packages/pdf-core/` e usar `workspace:*` na raiz.

## API

```typescript
import { generateOrderPdf, type OrderPdfInput } from '@scancode/pdf-core';

const buffer: Uint8Array = await generateOrderPdf(input);
```

Ver `src/types/order-pdf-input.ts` para o contrato JSON (`OrderPdfInput`).

## Desenvolvimento

```bash
npm install
npm run build        # dist/
npm run build:watch  # recompila ao guardar
```

## Repositórios relacionados

- [myCoolApp](https://github.com/LeonardoBAV/myCoolApp) — app mobile (mapper em `app/services/pdf/order-pdf-mapper.ts`)
