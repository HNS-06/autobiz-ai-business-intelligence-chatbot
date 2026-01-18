import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStockData } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export default function StockOverview() {
  const { data: stocks, isLoading, refetch, isFetching } = useStockData();
  const [chartData, setChartData] = useState<any[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (stocks && stocks.length > 0) {
      setIsAnimating(true);
      const data = stocks.map((stock, index) => ({
        name: stock.symbol,
        price: stock.price,
        change: stock.change,
        index,
      }));
      setChartData(data);
      
      // Reset animation after transition
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [stocks]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-chart-1" />
              Stock Market Overview
            </CardTitle>
            <CardDescription>Real-time stock prices updated every 45 seconds</CardDescription>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching}
            className={cn(isFetching && 'animate-spin')}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {stocks && stocks.length > 0 ? (
          <div className={cn('transition-opacity duration-500', isAnimating && 'opacity-70')}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {stocks.slice(0, 3).map((stock) => (
                <div
                  key={stock.symbol}
                  className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-lg">{stock.symbol}</span>
                    <span
                      className={cn(
                        'flex items-center gap-1 text-sm font-medium transition-colors duration-300',
                        stock.change >= 0 ? 'text-chart-1' : 'text-destructive'
                      )}
                    >
                      {stock.change >= 0 ? (
                        <TrendingUp className="h-4 w-4 animate-pulse" />
                      ) : (
                        <TrendingDown className="h-4 w-4 animate-pulse" />
                      )}
                      {stock.change >= 0 ? '+' : ''}
                      {stock.change.toFixed(2)}%
                    </span>
                  </div>
                  <div className="text-2xl font-bold transition-all duration-300">
                    ${stock.price.toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Vol: {(Number(stock.volume) / 1000000).toFixed(2)}M
                  </div>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="oklch(var(--chart-1))"
                  strokeWidth={2}
                  dot={{ fill: 'oklch(var(--chart-1))', r: 4 }}
                  activeDot={{ r: 6 }}
                  animationDuration={500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>No stock data available. Click refresh to load data.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
