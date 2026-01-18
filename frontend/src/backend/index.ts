
export interface StockData {
    symbol: string;
    price: number;
    change: number;
    volume: bigint;
    marketCap: number;
    timestamp: bigint;
}

export interface MarketTrend {
    sector: string;
    performance: number;
    trend: Variant_up_down_notChanging;
    analysis: string;
}

export interface BusinessMetric {
    name: string;
    value: number;
    description: string;
}

export interface KPI {
    key: string;
    value: number;
    target: number;
    status: Variant_belowTarget_onTrack_exceeding;
}

export type AIResponse = {
    text: string;
};

export enum Variant_up_down_notChanging {
    up = 'up',
    down = 'down',
    notChanging = 'notChanging'
}

export enum Variant_belowTarget_onTrack_exceeding {
    belowTarget = 'belowTarget',
    onTrack = 'onTrack',
    exceeding = 'exceeding'
}
