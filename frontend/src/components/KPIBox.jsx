const KPIBox = ({ title, value }) => {
    return (
        <div style={
            {padding: '16px', background: '#1e1e1e', borderRadius: '10px', flex: 1}
        }>
            <h4>{title}</h4>
            <h4>{value}</h4>
        </div>
    );
};

export default KPIBox;