import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

interface ApplicationsPerJobData {
  jobTitle: string;
  applications: number;
}

interface ApplicationsOverTimeData {
  date: string;
  applications: number;
}

interface ApplicationsChartProps {
  applicationsPerJob: ApplicationsPerJobData[];
  applicationsOverTime: ApplicationsOverTimeData[];
}

export const ApplicationsChart = ({
  applicationsPerJob,
  applicationsOverTime,
}: ApplicationsChartProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Statistiques</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="per-job" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="per-job">Par offre</TabsTrigger>
            <TabsTrigger value="over-time">Évolution</TabsTrigger>
          </TabsList>
          
          <TabsContent value="per-job" className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={applicationsPerJob} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" />
                <YAxis 
                  type="category" 
                  dataKey="jobTitle" 
                  width={120}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [`${value} candidatures`, 'Candidatures']}
                />
                <Bar 
                  dataKey="applications" 
                  fill="hsl(var(--primary))" 
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="over-time" className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={applicationsOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [`${value} candidatures`, 'Candidatures']}
                />
                <Line 
                  type="monotone" 
                  dataKey="applications" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
