import KPIBox from "../components/KPIBox";
import OrderTrendChart from "../components/charts/OrderTrendChart";
import { useKPIs, useOrdersTrend } from "../hooks/useDashboard";
import {formatCurrency} from '../utils/formatCurrency.js';

const dashboard = () => {
    const { data: kpis, isLoading: kpiLoading } = useKPIs();
    const { data: trend, isLoading: trendLoading } = useOrdersTrend();
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
        </div>
    );
};

export default dashboard;