import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity } from 'lucide-react';
import { useMarketTrends } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Variant_up_down_notChanging } from '../backend';
import { cn } from '@/lib/utils';

export default function MarketTrends() {
  const { data: trends, isLoading } = useMarketTrends();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (trends && trends.length > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [trends]);

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

  const chartData = trends?.map((trend) => ({
    sector: trend.sector,
    performance: trend.performance,
    fill: trend.performance >= 0 ? 'oklch(var(--chart-1))' : 'oklch(var(--destructive))',
  }));

  const getTrendDisplay = (trend: Variant_up_down_notChanging) => {
    switch (trend) {
      case Variant_up_down_notChanging.up:
        return '↑';
      case Variant_up_down_notChanging.down:
        return '↓';
      case Variant_up_down_notChanging.notChanging:
        return '→';
      default:
        return '→';
    }
  };

  const getTrendVariant = (trend: Variant_up_down_notChanging) => {
    switch (trend) {
      case Variant_up_down_notChanging.up:
        return 'default' as const;
      case Variant_up_down_notChanging.down:
        return 'destructive' as const;
      case Variant_up_down_notChanging.notChanging:
        return 'secondary' as const;
      default:
        return 'secondary' as const;
    }
  };

  return (
    <Card className="border-chart-2/20 hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-chart-2" />
          Market Trends
        </CardTitle>
        <CardDescription>Sector performance updated every 60 seconds</CardDescription>
      </CardHeader>
      <CardContent>
        {trends && trends.length > 0 ? (
          <div className={cn('transition-opacity duration-500', isAnimating && 'opacity-70')}>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="sector" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="performance" radius={[8, 8, 0, 0]} animationDuration={500}>
                  {chartData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-6 space-y-3">
              {trends.map((trend) => (
                <div
                  key={trend.sector}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/5 transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="flex-1">
                    <div className="font-medium">{trend.sector}</div>
                    <div className="text-xs text-muted-foreground mt-1">{trend.analysis}</div>
                  </div>
                  <Badge
                    variant={getTrendVariant(trend.trend)}
                    className="ml-2 transition-all duration-300"
                  >
                    {getTrendDisplay(trend.trend)}{' '}
                    {trend.performance >= 0 ? '+' : ''}
                    {trend.performance.toFixed(1)}%
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>No market trend data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
