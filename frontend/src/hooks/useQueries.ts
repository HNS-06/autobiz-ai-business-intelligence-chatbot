import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { StockData, MarketTrend, BusinessMetric, KPI, AIResponse } from '../backend';
import { Variant_up_down_notChanging, Variant_belowTarget_onTrack_exceeding } from '../backend';

// Parse Yahoo Finance API response from backend
function parseYahooFinanceResponse(jsonString: string): StockData[] {
  try {
    const data = JSON.parse(jsonString);
    const stockData: StockData[] = [];
    
    if (data.chart?.result?.[0]) {
      const result = data.chart.result[0];
      const quote = result.indicators.quote[0];
      const meta = result.meta;
      
      const currentPrice = meta.regularMarketPrice || quote.close[quote.close.length - 1];
      const previousClose = meta.previousClose || quote.close[0];
      const change = ((currentPrice - previousClose) / previousClose) * 100;
      
      stockData.push({
        symbol: meta.symbol || 'BTC-EUR',
        price: currentPrice,
        change,
        volume: BigInt(meta.regularMarketVolume || 0),
        marketCap: currentPrice * (meta.regularMarketVolume || 0),
        timestamp: BigInt(Date.now()) * BigInt(1000000),
      });
    }
    
    return stockData;
  } catch (error) {
    console.warn('Failed to parse Yahoo Finance data:', error);
    return [];
  }
}

// Fetch and cache stock data from backend with real-time updates
export function useStockData() {
  const { actor, isFetching: isActorFetching } = useActor();

  return useQuery<StockData[]>({
    queryKey: ['stockData'],
    queryFn: async () => {
      if (!actor) return [];
      
      try {
        // Fetch real-time data from backend's Yahoo Finance integration
        const yahooData = await actor.getYahooAPIInbox();
        const parsedStocks = parseYahooFinanceResponse(yahooData);
        
        // Submit parsed data to backend for caching
        for (const stock of parsedStocks) {
          try {
            await actor.submitStockData(stock);
          } catch (error) {
            console.warn('Failed to submit stock data:', error);
          }
        }
        
        // Get all cached stock data from backend
        const allStocks = await actor.getAllStockData();
        
        // If we have cached data, return it; otherwise return parsed data
        if (allStocks.length > 0) {
          return allStocks;
        }
        
        // Fallback: create sample data if no real data available
        const sampleStocks: StockData[] = [
          {
            symbol: 'AAPL',
            price: 178.25,
            change: 2.3,
            volume: BigInt(52000000),
            marketCap: 2800000000000,
            timestamp: BigInt(Date.now()) * BigInt(1000000),
          },
          {
            symbol: 'GOOGL',
            price: 142.50,
            change: 1.8,
            volume: BigInt(28000000),
            marketCap: 1800000000000,
            timestamp: BigInt(Date.now()) * BigInt(1000000),
          },
          {
            symbol: 'MSFT',
            price: 385.75,
            change: -0.5,
            volume: BigInt(24000000),
            marketCap: 2900000000000,
            timestamp: BigInt(Date.now()) * BigInt(1000000),
          },
          {
            symbol: 'AMZN',
            price: 155.30,
            change: 3.2,
            volume: BigInt(45000000),
            marketCap: 1600000000000,
            timestamp: BigInt(Date.now()) * BigInt(1000000),
          },
          {
            symbol: 'TSLA',
            price: 242.80,
            change: -1.2,
            volume: BigInt(98000000),
            marketCap: 770000000000,
            timestamp: BigInt(Date.now()) * BigInt(1000000),
          },
          {
            symbol: 'META',
            price: 468.90,
            change: 4.1,
            volume: BigInt(18000000),
            marketCap: 1200000000000,
            timestamp: BigInt(Date.now()) * BigInt(1000000),
          },
        ];
        
        // Submit sample data to backend
        for (const stock of sampleStocks) {
          try {
            await actor.submitStockData(stock);
          } catch (error) {
            console.warn('Failed to submit sample stock data:', error);
          }
        }
        
        return sampleStocks;
      } catch (error) {
        console.error('Error fetching stock data:', error);
        return [];
      }
    },
    enabled: !!actor && !isActorFetching,
    refetchInterval: 45000, // Refetch every 45 seconds
    staleTime: 30000, // Consider data stale after 30 seconds
  });
}

// Market trends hook with periodic updates
export function useMarketTrends() {
  const { actor, isFetching: isActorFetching } = useActor();

  return useQuery<MarketTrend[]>({
    queryKey: ['marketTrends'],
    queryFn: async () => {
      if (!actor) return [];
      
      try {
        // Get cached trends from backend
        let trends = await actor.getAllMarketTrendsByPerformance();
        
        // If no data, create and cache sample data
        if (trends.length === 0) {
          const sampleTrends: MarketTrend[] = [
            {
              sector: 'Technology',
              performance: 5.2,
              trend: Variant_up_down_notChanging.up,
              analysis: 'Strong growth driven by AI and cloud computing innovations',
            },
            {
              sector: 'Healthcare',
              performance: 2.8,
              trend: Variant_up_down_notChanging.up,
              analysis: 'Steady growth with biotech innovations and aging demographics',
            },
            {
              sector: 'Finance',
              performance: -1.2,
              trend: Variant_up_down_notChanging.down,
              analysis: 'Slight decline due to interest rate concerns and regulatory pressure',
            },
            {
              sector: 'Energy',
              performance: 3.5,
              trend: Variant_up_down_notChanging.up,
              analysis: 'Rising oil prices and renewable energy investments boosting sector',
            },
            {
              sector: 'Consumer',
              performance: 0.8,
              trend: Variant_up_down_notChanging.notChanging,
              analysis: 'Stable performance with mixed signals from retail spending',
            },
          ];
          
          // Submit to backend for caching
          for (const trend of sampleTrends) {
            try {
              await actor.submitMarketTrend(trend);
            } catch (error) {
              console.warn('Failed to submit market trend:', error);
            }
          }
          
          trends = sampleTrends;
        }
        
        return trends;
      } catch (error) {
        console.error('Error fetching market trends:', error);
        return [];
      }
    },
    enabled: !!actor && !isActorFetching,
    refetchInterval: 60000, // Refetch every 60 seconds
    staleTime: 45000, // Consider data stale after 45 seconds
  });
}

// Business metrics hook with periodic updates
export function useBusinessMetrics() {
  const { actor, isFetching: isActorFetching } = useActor();

  return useQuery<BusinessMetric[]>({
    queryKey: ['businessMetrics'],
    queryFn: async () => {
      if (!actor) return [];
      
      try {
        let metrics = await actor.getAllBusinessMetricsByName();
        
        if (metrics.length === 0) {
          const sampleMetrics: BusinessMetric[] = [
            {
              name: 'Revenue',
              value: 1250000,
              description: 'Total revenue for Q4 2024',
            },
            {
              name: 'Expenses',
              value: 850000,
              description: 'Operating expenses including salaries and overhead',
            },
            {
              name: 'Profit',
              value: 400000,
              description: 'Net profit after all expenses',
            },
            {
              name: 'Growth',
              value: 180000,
              description: 'Year-over-year revenue growth',
            },
          ];
          
          for (const metric of sampleMetrics) {
            try {
              await actor.submitBusinessMetric(metric);
            } catch (error) {
              console.warn('Failed to submit business metric:', error);
            }
          }
          
          metrics = sampleMetrics;
        }
        
        return metrics;
      } catch (error) {
        console.error('Error fetching business metrics:', error);
        return [];
      }
    },
    enabled: !!actor && !isActorFetching,
    refetchInterval: 60000, // Refetch every 60 seconds
    staleTime: 45000,
  });
}

// KPIs hook with periodic updates
export function useKPIs() {
  const { actor, isFetching: isActorFetching } = useActor();

  return useQuery<KPI[]>({
    queryKey: ['kpis'],
    queryFn: async () => {
      if (!actor) return [];
      
      try {
        let kpis = await actor.getAllKPIsByKey();
        
        if (kpis.length === 0) {
          const sampleKPIs: KPI[] = [
            {
              key: 'Customer Satisfaction',
              value: 4.5,
              target: 4.8,
              status: Variant_belowTarget_onTrack_exceeding.onTrack,
            },
            {
              key: 'Revenue Growth',
              value: 25,
              target: 20,
              status: Variant_belowTarget_onTrack_exceeding.exceeding,
            },
            {
              key: 'Market Share',
              value: 12,
              target: 15,
              status: Variant_belowTarget_onTrack_exceeding.belowTarget,
            },
            {
              key: 'Employee Retention',
              value: 92,
              target: 90,
              status: Variant_belowTarget_onTrack_exceeding.exceeding,
            },
          ];
          
          for (const kpi of sampleKPIs) {
            try {
              await actor.submitKPI(kpi);
            } catch (error) {
              console.warn('Failed to submit KPI:', error);
            }
          }
          
          kpis = sampleKPIs;
        }
        
        return kpis;
      } catch (error) {
        console.error('Error fetching KPIs:', error);
        return [];
      }
    },
    enabled: !!actor && !isActorFetching,
    refetchInterval: 60000, // Refetch every 60 seconds
    staleTime: 45000,
  });
}

// AI Chat mutation
export function useAIChat() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<AIResponse, Error, string>({
    mutationFn: async (message: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return await actor.processAIRequest(message);
    },
    onSuccess: () => {
      // Invalidate queries to refresh data after AI interaction
      queryClient.invalidateQueries({ queryKey: ['stockData'] });
      queryClient.invalidateQueries({ queryKey: ['marketTrends'] });
      queryClient.invalidateQueries({ queryKey: ['businessMetrics'] });
      queryClient.invalidateQueries({ queryKey: ['kpis'] });
    },
  });
}
