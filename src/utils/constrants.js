export const colors = {
    primary: '#5dbe79'
}

export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};