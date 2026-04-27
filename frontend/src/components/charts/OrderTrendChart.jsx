import {
    LineChart, 
    Line, 
    XAxis,YAxis,
    Tooltip,
    CartesianGrid
} from 'recharts';

const OrderTrendChart = ({ data }) => {
    return (
        <LineChart width={800} height={300} data={data}>
            <CartesianGrid stroke="#444"/>
            <XAxis dataKey="date"/>
            <YAxis/>
            <Tooltip/>
            <Line type="monotone" dataKey="totalOrders" stroke="#82ca9d" />
        </LineChart>
    );
};

export default OrderTrendChart;