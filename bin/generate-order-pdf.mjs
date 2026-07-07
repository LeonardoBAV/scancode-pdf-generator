#!/usr/bin/env node

import { createRequire } from 'node:module';

/**
 * CLI bridge for non-JS consumers (e.g. Laravel Process::input(json)->run()).
 * stdin:  OrderPdfInput JSON
 * stdout: PDF bytes as base64 (safe binary pipe)
 * stderr: error message on failure
 *
 * Loads the CJS build: the ESM build imports pdfmake without file extension,
 * which bundlers accept but plain Node ESM resolution rejects.
 */
const require = createRequire(import.meta.url);
const { generateOrderPdf } = require('@scancode/pdf-core');

async function readStdin() {
    const chunks = [];

    for await (const chunk of process.stdin) {
        chunks.push(chunk);
    }

    return Buffer.concat(chunks).toString('utf8');
}

async function main() {
    const raw = await readStdin();

    if (raw.trim() === '') {
        console.error('Expected OrderPdfInput JSON on stdin.');
        process.exit(1);
    }

    let input;

    try {
        input = JSON.parse(raw);
    } catch {
        console.error('Invalid JSON on stdin.');
        process.exit(1);
    }

    try {
        const pdfBytes = await generateOrderPdf(input);
        process.stdout.write(Buffer.from(pdfBytes).toString('base64'));
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(message);
        process.exit(1);
    }
}

main();
