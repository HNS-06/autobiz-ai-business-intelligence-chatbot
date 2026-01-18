import Map "mo:core/Map";
import Text "mo:core/Text";

module {
  // Types
  type StockData = {
    symbol : Text;
    price : Float;
    change : Float;
    volume : Int;
    marketCap : Float;
    timestamp : Int;
  };

  type MarketTrend = {
    sector : Text;
    performance : Float;
    trend : { #up; #down; #notChanging };
    analysis : Text;
  };

  type BusinessMetric = {
    name : Text;
    value : Float;
    description : Text;
  };

  type KPI = {
    key : Text;
    value : Float;
    target : Float;
    status : { #onTrack; #belowTarget; #exceeding };
  };

  type OldActor = {
    stockData : Map.Map<Text, StockData>;
    marketTrends : Map.Map<Text, MarketTrend>;
    businessMetrics : Map.Map<Text, BusinessMetric>;
    kpis : Map.Map<Text, KPI>;
  };

  type NewActor = {
    stockData : Map.Map<Text, StockData>;
    marketTrends : Map.Map<Text, MarketTrend>;
    businessMetrics : Map.Map<Text, BusinessMetric>;
    kpis : Map.Map<Text, KPI>;
  };

  public func run(old : OldActor) : NewActor {
    old;
  };
};
