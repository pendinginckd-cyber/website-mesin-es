export interface VisitorStats {
  id: string;
  dailyVisitors: number;
  yearlyVisitors: number;
  totalVisitors: number;
  baseDaily: number;
  baseYearly: number;
  baseTotal: number;
  lastResetDate: string;
  lastYearReset: string;
}
