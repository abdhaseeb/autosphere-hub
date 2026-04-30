import KPIBox from "../components/KPIBox";
import OrderTrendChart from "../components/charts/OrderTrendChart";
import { useKPIs, useOrdersTrend } from "../hooks/useDashboard.js";
import { useRealtime } from "../hooks/useRealtime.js";
import { useForecast, useAiInsights } from "../hooks/useAi.js";
import {formatCurrency} from '../utils/formatCurrency.js';

const dashboard = () => {
    useRealtime();
    const { data: kpis, isLoading: kpiLoading } = useKPIs();
    const { data: trend, isLoading: trendLoading } = useOrdersTrend();
    const { data: ai, isLoading: aiLoading } = useAiInsights();
    //const { data } = useTopSuppliers();

    if(kpiLoading || trendLoading) return <p>Loading...</p>;

    return(
        <div style={ {padding: '20px'} }>
            <h1>Supplier Dashboard</h1>

            {/**KPI Section*/}
            <div style={ {display: 'flex', gap: '16px', marginBottom: '20px'} }>
                <KPIBox title="Total Orders" value={kpis.totalOrders}/>
                <KPIBox title="Revenue" value={formatCurrency(kpis.totalRevenue)}/>
                <KPIBox title="Fulfillment Rate" value={`${kpis.fulfillmentRate.toFixed(2)}%`}/>
            </div>

            {/**Chart */}
            <OrderTrendChart data={trend}/>

            {/**
             * <TopSuppliersChart data={data/>
             */}

            <div style={{marginTop: '30px'}}>
                <h2>AI Insights</h2>

                {isLoading ? (
                    <p>Analysing data...</p>
                    ) : (
                        <>
                            <p>{ai.summary}</p>
                            {ai.insights.map( (i, idx) => (
                                <div key={idx}>
                                    <strong>{i.title}</strong>
                                    <p>{i.description}</p>
                                </div>
                            ))}     

                            <h4>Recommendations</h4>
                            <ul>
                                {ai.recommendations.map( (r, i) => (
                                    <li key={i}>{r}</li>
                                ))}
                            </ul>
                        </>
                )}
            </div>
        </div>
    );
};

export default dashboard;