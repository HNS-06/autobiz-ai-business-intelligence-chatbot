import { useEffect, useState } from 'react';
import StockOverview from '../components/StockOverview';
import MarketTrends from '../components/MarketTrends';
import BusinessMetrics from '../components/BusinessMetrics';
import KPICards from '../components/KPICards';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, BarChart3, Target } from 'lucide-react';

export default function Dashboard() {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 5) setGreeting('Good Night');
      else if (hour < 12) setGreeting('Good Morning');
      else if (hour < 18) setGreeting('Good Afternoon');
      else setGreeting('Good Evening');
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-chart-1/10 to-chart-2/10 p-8 md:p-12 border border-primary/20">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent">
            {greeting}, Welcome to AutoBiz AI
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Your intelligent business companion for real-time market analysis, stock tracking, and strategic insights.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-chart-1/20 to-transparent rounded-full blur-3xl" />
      </section>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-chart-1/20 hover:border-chart-1/40 transition-all duration-300 hover:shadow-lg hover:shadow-chart-1/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Status</CardTitle>
            <TrendingUp className="h-4 w-4 text-chart-1" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-1">Active</div>
            <p className="text-xs text-muted-foreground">Real-time data streaming</p>
          </CardContent>
        </Card>
        <Card className="border-chart-2/20 hover:border-chart-2/40 transition-all duration-300 hover:shadow-lg hover:shadow-chart-2/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Analytics Engine</CardTitle>
            <BarChart3 className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-2">Online</div>
            <p className="text-xs text-muted-foreground">AI-powered insights ready</p>
          </CardContent>
        </Card>
        <Card className="border-chart-3/20 hover:border-chart-3/40 transition-all duration-300 hover:shadow-lg hover:shadow-chart-3/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <Target className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-3">Optimal</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      {/* Stock Overview */}
      <StockOverview />

      {/* Market Trends & KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MarketTrends />
        <KPICards />
      </div>

      {/* Business Metrics */}
      <BusinessMetrics />
    </div>
  );
}
