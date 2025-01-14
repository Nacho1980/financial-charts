export type StockQuote = {
  current: number; // Current price
  high: number; // High price of the day
  low: number; // Low price of the day
  open: number; // Open price of the day
  previousClose: number; // Previous close price
  symbol: string; // Symbol to check which company the quote belongs to
};
export type StockCompany = {
  currency: string;
  description: string;
  displaySymbol: string;
  figi: string;
  mic: string;
  symbol: string;
  type: string;
};
export type CompanyNews = {
  category: string;
  datetime: number;
  headline: string;
  id: number;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
};
