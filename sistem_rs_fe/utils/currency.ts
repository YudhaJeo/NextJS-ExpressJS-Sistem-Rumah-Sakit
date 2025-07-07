export const formatCurrency = (value: number | string): string => {
    const num = typeof value === 'string' ? parseFloat(value) : value;

    if (typeof num !== 'number' || isNaN(num)) {
        return 'N/A';
    }

    return num.toLocaleString('id-ID', {
        style: 'currency',
        currency: 'IDR'
    });
};
