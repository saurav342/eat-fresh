// Generate unique order ID
const generateOrderId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let orderId = 'EF';
    for (let i = 0; i < 10; i++) {
        orderId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return orderId;
};

// Calculate estimated delivery time based on distance
const calculateDeliveryTime = (distance) => {
    const baseTime = 30; // Base time in minutes
    const distanceKm = parseFloat(distance) || 1;
    const additionalTime = Math.ceil(distanceKm * 5);
    return `${baseTime + additionalTime} mins`;
};

// Calculate order totals
const calculateOrderTotals = (items, deliveryFee = 0) => {
    const itemTotal = items.reduce((total, item) => {
        return total + item.price * item.quantity;
    }, 0);

    const taxes = Math.round(itemTotal * 0.05 * 100) / 100; // 5% tax
    const grandTotal = itemTotal + deliveryFee + taxes;

    return {
        itemTotal,
        deliveryFee,
        taxes,
        grandTotal,
    };
};

module.exports = {
    generateOrderId,
    calculateDeliveryTime,
    calculateOrderTotals,
};
