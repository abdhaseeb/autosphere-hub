import {prisma} from '../../common/db.js';
import dayjs from 'dayjs';

//simple forecasting using moving average
export const getDemandForecast = async(productId) => {
    const data = await prisma.$queryraw`
        SELECT DATE(o."createdAt") AS date,
            SUM(oi."quantity") as total_qty
        FROM "OrderItem" oi
        JOIN "Order" o on oi."orderId" = o.id
        WHERE oi."productId" = ${productId}
            AND o."createdAt" >= NOW() - INTERVAL '30 days'
        GROUP BY date
        ORDER BY date ASC
    `;

    if(data.length === 0)
        return { forecast: 0, message: "Not enough data"};

    //Moving average
    const total = data.reduce( (sum, d) => sum + Number(d.total_qty), 0);
    const avgPerDay = total / data.length;

    //Forecast for next 7 days
    const forecast = Math.round(avgPerDay * 7);

    return {
        productId,
        avgPerDay,
        forecastNext7Days: forecast
    };
};

export const generateInsights = async () => {
    const cacheKey = 'ai:insights123';

    const cached = await redis.get(cacheKey);
    if(cached) return JSON.parse(cached);

    //1. Fetch structed data from daily stats for a month
    const stats = await prisma.dailyStats.findMany({
        orderBy: { date: 'desc' },
        take: 30,
    });

    //2. Pre-process data
    const formatted = stats.map( d => ({
        date: d.date.toISOString().split('T')[0],
        orders: d.totalOrders,
        revenue: d.totalRevenue,
        delivered: d.deliveredCount,
        delayed: d.delayedCount
    }));

    // 3. Prompt building
    const prompt = `
    You are a supply chain analytics expert.
    Analyse the following daily metrics and return insights.
    Data:
    ${JSON.stringify(formatted)}

    Instructions:
    - Identify trends (increase/decrease)
    - Detect anomalies (spikes/drops)
    - Explain possible causes
    - Suggest 2-3 actionable recommendations

    Important:
    - No explanations outside JSON
    - Return ONLY valid JSON in this format:
    {
        "summary": "...",
        "insights": [
            {"title": "...", "description": "..."}
        ],
        "recommendations": ["...", "..."]
    }
    `;
    
    //4. Calling openai
    const response = await openai.chat.completions.create({
        model: 'gpt-4.1-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
    });

    const text = response.choices[0].message.content;

    let parsed;

    try{
        parsed = JSON.parse(text);
    }catch(err){
        console.log("AI JSON parse failed: ", text);

        //fallback response
        parsed = {
            summary: 'Unable to generate insights at the moment.',
            insights: [],
            recommendations: [],
        };
    }

    //6. Cache correct object
    await redis.set(cacheKey, JSON.stringify(parsed), 'EX', 600);

    return parsed;
}