export function formatIsoDateToBR(isoDate: string): string {
    const m: RegExpExecArray | null = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim());
    if (!m) {
        return isoDate;
    }
    return `${m[3]}/${m[2]}/${m[1]}`;
}

export function formatCurrencyBR(value: number): string {
    const fixed: string = value.toFixed(2);
    const [intPart, decPart]: string[] = fixed.split('.');
    const withThousands: string = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return 'R$ ' + withThousands + ',' + decPart;
}

export function formatCNPJ(value: string | null | undefined): string {
    if (!value) {
        return '—';
    }
    const digits: string = value.replace(/\D/g, '');
    if (digits.length !== 14) {
        return value;
    }
    return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}
