import Float "mo:core/Float";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import OutCall "http-outcalls/outcall";
import Migration "migration";

(with migration = Migration.run)
actor {
  // Types
  type StockData = {
    symbol : Text;
    price : Float;
    change : Float;
    volume : Int;
    marketCap : Float;
    timestamp : Time.Time;
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

  type AIResponse = {
    message : Text;
    summary : Text;
    recommendations : [Text];
  };

  module StockData {
    public func compare(stock1 : StockData, stock2 : StockData) : Order.Order {
      compareBySymbol(stock1, stock2);
    };

    public func compareBySymbol(stock1 : StockData, stock2 : StockData) : Order.Order {
      Text.compare(stock1.symbol, stock2.symbol);
    };

    public func compareByTimestamp(stock1 : StockData, stock2 : StockData) : Order.Order {
      Int.compare(stock1.timestamp, stock2.timestamp);
    };
  };

  module MarketTrend {
    public func compareBySector(trend1 : MarketTrend, trend2 : MarketTrend) : Order.Order {
      Text.compare(trend1.sector, trend2.sector);
    };

    public func compareByPerformance(trend1 : MarketTrend, trend2 : MarketTrend) : Order.Order {
      Float.compare(trend1.performance, trend2.performance);
    };
  };

  module BusinessMetric {
    public func compareByName(metric1 : BusinessMetric, metric2 : BusinessMetric) : Order.Order {
      Text.compare(metric1.name, metric2.name);
    };

    public func compareByValue(metric1 : BusinessMetric, metric2 : BusinessMetric) : Order.Order {
      Float.compare(metric1.value, metric2.value);
    };
  };

  module KPI {
    public func compareByKey(kpi1 : KPI, kpi2 : KPI) : Order.Order {
      Text.compare(kpi1.key, kpi2.key);
    };

    public func compareByValue(kpi1 : KPI, kpi2 : KPI) : Order.Order {
      Float.compare(kpi1.value, kpi2.value);
    };
  };

  // State
  let stockData = Map.empty<Text, StockData>();
  let marketTrends = Map.empty<Text, MarketTrend>();
  let businessMetrics = Map.empty<Text, BusinessMetric>();
  let kpis = Map.empty<Text, KPI>();

  // API
  public shared ({ caller }) func submitStockData(stock : StockData) : async () {
    stockData.add(stock.symbol, stock);
  };

  public shared ({ caller }) func submitMarketTrend(trend : MarketTrend) : async () {
    marketTrends.add(trend.sector, trend);
  };

  public shared ({ caller }) func submitBusinessMetric(metric : BusinessMetric) : async () {
    businessMetrics.add(metric.name, metric);
  };

  public shared ({ caller }) func submitKPI(kpi : KPI) : async () {
    kpis.add(kpi.key, kpi);
  };

  public query ({ caller }) func getAllStockData() : async [StockData] {
    stockData.values().toArray().sort();
  };

  public query ({ caller }) func getAllMarketTrendsBySector() : async [MarketTrend] {
    marketTrends.values().toArray().sort(MarketTrend.compareBySector);
  };

  public query ({ caller }) func getAllMarketTrendsByPerformance() : async [MarketTrend] {
    marketTrends.values().toArray().sort(MarketTrend.compareByPerformance);
  };

  public query ({ caller }) func getAllBusinessMetricsByName() : async [BusinessMetric] {
    businessMetrics.values().toArray().sort(BusinessMetric.compareByName);
  };

  public query ({ caller }) func getAllBusinessMetricsByValue() : async [BusinessMetric] {
    businessMetrics.values().toArray().sort(BusinessMetric.compareByValue);
  };

  public query ({ caller }) func getAllKPIsByKey() : async [KPI] {
    kpis.values().toArray().sort(KPI.compareByKey);
  };

  public query ({ caller }) func getAllKPIsByValue() : async [KPI] {
    kpis.values().toArray().sort(KPI.compareByValue);
  };

  public shared ({ caller }) func getStockData(symbol : Text) : async StockData {
    switch (stockData.get(symbol)) {
      case (null) { Runtime.trap("Stock data not found") };
      case (?data) { data };
    };
  };

  public query ({ caller }) func getMarketTrend(sector : Text) : async MarketTrend {
    switch (marketTrends.get(sector)) {
      case (null) { Runtime.trap("Market trend not found") };
      case (?trend) { trend };
    };
  };

  public query ({ caller }) func getBusinessMetric(name : Text) : async BusinessMetric {
    switch (businessMetrics.get(name)) {
      case (null) { Runtime.trap("Business metric not found") };
      case (?metric) { metric };
    };
  };

  public query ({ caller }) func getKPI(key : Text) : async KPI {
    switch (kpis.get(key)) {
      case (null) { Runtime.trap("KPI not found") };
      case (?kpi) { kpi };
    };
  };

  public query ({ caller }) func getLatestStockDataByTimestamp() : async [StockData] {
    stockData.values().toArray().sort(StockData.compareByTimestamp);
  };

  public shared ({ caller }) func processAIRequest(request : Text) : async AIResponse {
    switch (request.trim(#char ' ')) {
      case ("what are the top performing stocks today?" or "show me the top stocks") {
        {
          message = "Here are the top performing stocks today.";
          summary = "Stock prices have increased overall, with tech stocks leading.";
          recommendations = [
            "Analyze the top gaining stocks history",
            "Diversify your portfolio",
          ];
        };
      };
      case ("how is the market performing?" or "market performance") {
        {
          message = "The market is currently experiencing an upward trend.";
          summary = "Economic indicators are positive, with stable growth.";
          recommendations = ["Monitor key metrics", "Adjust strategies"];
        };
      };
      case ("give me a summary of business metrics" or "business metric summary") {
        {
          message = "Here is a summary of key business metrics.";
          summary = "Revenue is up, expenses are controlled, and KPIs are being met.";
          recommendations = ["Focus on revenue growth", "Optimize cost structure"];
        };
      };
      case (_) {
        {
          message = "I'm sorry, I couldn't understand your request.";
          summary = "Please rephrase your question or provide more specific information.";
          recommendations = [
            "Ask about stocks, market trends, or business metrics",
            "Check the dashboard for available data",
          ];
        };
      };
    };
  };

  /// Fetches real-time data from YAHOO API as a
  /// JSON blob max 2MB, which needs to
  /// be parsed on the frontend.
  public shared ({ caller }) func getYahooAPIInbox() : async Text {
    await OutCall.httpGetRequest(
      "https://query1.finance.yahoo.com/v8/finance/chart/BTC-EUR",
      [],
      transform,
    );
  };

  func makeGoogleAPIRequest() : async () {
    ignore await OutCall.httpGetRequest("https://www.google.com/finance/", [], transform);
  };

  // Transform callback for HTTP outcalls must be part of actor
  public query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };
};
