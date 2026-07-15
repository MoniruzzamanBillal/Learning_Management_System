import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TEnrollmentPoint } from "@/types/stat.types";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type TEnrollmentChartProps = {
  data: TEnrollmentPoint[];
};

const EnrollmentChart = ({ data }: TEnrollmentChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          Enrollments (Last 30 Days)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-sm text-muted-foreground">
            No enrollment data yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={256}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default EnrollmentChart;
