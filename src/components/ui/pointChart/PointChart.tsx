import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, LineChart } from 'recharts';
import { PopData } from '../../../types/pointvspop';

interface ChartProps {
    data: PopData;
}

const PointChart = ({data}:ChartProps) => {
    return (
            <LineChart
                      width={800}
                      height={250}
                      data={data?.points.map((value,index) => ({pop:index,point:value}))}
                      margin={{
                        top: 15,
                        right: 10,
                        left: 10,
                        bottom: 20,
                      }}
                      barSize={20}
                    >
                    <XAxis label={{
                    style: { fontSize: 20, fill: "#2036da",paddingTop:50 },
                    value: "Pop",
                    position: "insideBottom",
                    offset: -10, // Adjust position
                    dy: 5, // Additional vertical offset
                    dx:0
                        }} dataKey="pop"
                            interval="preserveStartEnd"
                            tickFormatter={(value) => (value === data?.points.length - 1 ? "100" : value)} 
                            allowDataOverflow={true}/>

                    <YAxis  label={{
                    style: { fontSize: 20, fill: "#2036da" },
                    value: "Points",
                    angle: -90, // Rotate for vertical text
                    position: "insideLeft",
                    dx: 0, // Horizontal offset
                    dy:30
                    }}/>
                    <Tooltip formatter={(value) => [`points: ${value}`]}/>
                    {/* <Legend /> */}
                    <CartesianGrid strokeDasharray="3 3" />
                    <Line type="monotone" dataKey="point" stroke="#2036da" strokeWidth={3} dot={false}/>
                </LineChart>
    );
};

export default PointChart;