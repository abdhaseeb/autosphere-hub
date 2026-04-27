import { Tooltip, XAxis, YAxis } from "recharts";

const TopSuppliersChart = ({ data }) => {
    return(
        <div width={600} height={300} data={ data }>
            <XAxis dataKey="supplier" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="totalOrders"/>
        </div>
    );
};

export default TopSuppliersChart;