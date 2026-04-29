import {prisma} from '../../common/db.js';

export const generateInsights = async () => {
    const delays = await prisma.shipment.count({
        where: { status: 'DELAYED' }
    });

    const total = await prisma.shipment.count();

    const delayRate = (delays / total) * 100;

    if(delayRate > 20){
        return "⚠️ High delay rate detected.";
    }

    return "🟢 Shipment performance stable ";
};