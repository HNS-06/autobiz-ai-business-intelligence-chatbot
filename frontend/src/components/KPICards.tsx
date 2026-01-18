import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import { useKPIs } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Variant_belowTarget_onTrack_exceeding } from '../backend';

export default function KPICards() {
  const { data: kpis, isLoading } = useKPIs();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (kpis && kpis.length > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [kpis]);

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

  const getStatusIcon = (status: Variant_belowTarget_onTrack_exceeding) => {
    switch (status) {
      case Variant_belowTarget_onTrack_exceeding.exceeding:
        return <TrendingUp className="h-4 w-4 text-chart-1" />;
      case Variant_belowTarget_onTrack_exceeding.onTrack:
        return <CheckCircle2 className="h-4 w-4 text-chart-2" />;
      case Variant_belowTarget_onTrack_exceeding.belowTarget:
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: Variant_belowTarget_onTrack_exceeding) => {
    switch (status) {
      case Variant_belowTarget_onTrack_exceeding.exceeding:
        return 'text-chart-1';
      case Variant_belowTarget_onTrack_exceeding.onTrack:
        return 'text-chart-2';
      case Variant_belowTarget_onTrack_exceeding.belowTarget:
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusLabel = (status: Variant_belowTarget_onTrack_exceeding) => {
    switch (status) {
      case Variant_belowTarget_onTrack_exceeding.exceeding:
        return 'Exceeding';
      case Variant_belowTarget_onTrack_exceeding.onTrack:
        return 'On Track';
      case Variant_belowTarget_onTrack_exceeding.belowTarget:
        return 'Below Target';
      default:
        return 'Unknown';
    }
  };

  return (
    <Card className="border-chart-3/20 hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-chart-3" />
          Key Performance Indicators
        </CardTitle>
        <CardDescription>Track your business goals - updated every 60 seconds</CardDescription>
      </CardHeader>
      <CardContent>
        {kpis && kpis.length > 0 ? (
          <div className={cn('space-y-6 transition-opacity duration-500', isAnimating && 'opacity-70')}>
            {kpis.map((kpi) => {
              const progress = (kpi.value / kpi.target) * 100;
              return (
                <div key={kpi.key} className="space-y-2 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(kpi.status)}
                      <span className="font-medium">{kpi.key}</span>
                    </div>
                    <span className={cn('text-sm font-bold transition-colors duration-300', getStatusColor(kpi.status))}>
                      {kpi.value.toFixed(1)} / {kpi.target.toFixed(1)}
                    </span>
                  </div>
                  <Progress value={Math.min(progress, 100)} className="h-2 transition-all duration-500" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{progress.toFixed(0)}% Complete</span>
                    <span>{getStatusLabel(kpi.status)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>No KPI data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
