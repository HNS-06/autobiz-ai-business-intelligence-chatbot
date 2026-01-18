import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { DollarSign } from 'lucide-react';
import { useBusinessMetrics } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const COLORS = [
  'oklch(var(--chart-1))',
  'oklch(var(--chart-2))',
  'oklch(var(--chart-3))',
  'oklch(var(--chart-4))',
  'oklch(var(--chart-5))',
];

export default function BusinessMetrics() {
  const { data: metrics, isLoading } = useBusinessMetrics();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (metrics && metrics.length > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [metrics]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const chartData = metrics?.map((metric) => ({
    name: metric.name,
    value: metric.value,
  }));

  return (
    <Card className="border-chart-4/20 hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-chart-4" />
          Business Metrics
        </CardTitle>
        <CardDescription>Financial performance updated every 60 seconds</CardDescription>
      </CardHeader>
      <CardContent>
        {metrics && metrics.length > 0 ? (
          <div className={cn('grid grid-cols-1 lg:grid-cols-2 gap-6 transition-opacity duration-500', isAnimating && 'opacity-70')}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  animationDuration={500}
                >
                  {chartData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-4">
              {metrics.map((metric, index) => (
                <div
                  key={metric.name}
                  className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-3 h-3 rounded-full transition-all duration-300"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="font-medium">{metric.name}</span>
                  </div>
                  <div className="text-2xl font-bold mb-1 transition-all duration-300">
                    ${metric.value.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">{metric.description}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>No business metrics available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
