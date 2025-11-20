
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