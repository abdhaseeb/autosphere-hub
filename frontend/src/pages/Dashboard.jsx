import KPIBox from "../components/KPIBox";
import OrderTrendChart from "../components/charts/OrderTrendChart";
import { useKPIs, useOrdersTrend } from "../hooks/useDashboard";

const dashboard = () => {
    const { data: kpis, isLoading: kpiLoading } = useKPIs();
    const { data: trend, isLoading: trendLoading } = useOrdersTrend();

    if(kpiLoading || trendLoading) return <p>Loading...</p>;

    return(
        <div style={ {padding: '20px'} }>
            <h1>Supplier Dashboard</h1>

            {/**KPI Section*/}
            <div style={ {display: 'flex', gap: '16px', marginBottom: '20px'} }>
                <KPIBox title="Total Orders" value={kpis.totalOrders}/>
                <KPIBox title="Revenue" value={kpis.totalRevenue}/>
                <KPIBox title="Fulfillment Rate" value={`${kpis.fulfillmentRate.toFixed(2)}%`}/>
            </div>

            {/**Chart */}
            <OrderTrendChart data={trend}/>
        </div>
    );
};

export default dashboard;