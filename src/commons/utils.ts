
export function convertBigInt(obj: any) {
    if (Array.isArray(obj)) {
        return obj.map(convertBigInt);
    } else if (obj !== null && typeof obj === 'object') {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [key, convertBigInt(value)])
        );
    } else if (typeof obj === 'bigint') {
        return Number(obj);
    }
    return obj;
}

// Função utilitária para converter datas
export function parseDate(dateStr: string): string | null {
    if (!dateStr) return null;
    // Aceita formatos dd/mm/yyyy, yyyy-mm-dd, etc.
    if (dateStr.includes('/')) {
        const parts = dateStr.split('/');
        if (parts.length === 3) {
            // dd/mm/yyyy ou mm/dd/yyyy
            const [a, b, c] = parts;
            // Se ano tem 4 dígitos, assume yyyy-mm-dd
            if (c.length === 4) return `${c}-${b.padStart(2, '0')}-${a.padStart(2, '0')}`;
        }
    }
    // Se já está em yyyy-mm-dd
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    // Tenta converter para Date e formatar
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
    return null;
}