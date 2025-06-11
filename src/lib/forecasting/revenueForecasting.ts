import { addMonths, startOfMonth } from 'date-fns';

interface InvoiceData {
  amount: number;
  due_date: string;
  status: string;
  is_recurring?: boolean;
  client_id?: string;
}

interface TimeSeriesDataPoint {
  date: string;
  value: number;
}

interface SeasonalityPattern {
  monthIndex: number; // 0-11
  factor: number;    // Multiplicative factor
}

interface ForecastResult {
  date: string;
  actual: number | null;
  forecast: number;
  lower: number;
  upper: number;
  confidence: number;
}

export class RevenueForecastEngine {
  private readonly MIN_DATA_POINTS = 6; // Minimum months of data needed
  private readonly RECENT_WEIGHT_FACTOR = 1.5; // Weight factor for recent data
  private readonly MAX_OUTLIER_STDDEV = 2.5; // Maximum standard deviations for outlier detection
  
  /**
   * Detect and remove outliers using Z-score method
   */
  private removeOutliers(data: TimeSeriesDataPoint[]): TimeSeriesDataPoint[] {
    if (data.length < 3) return data;

    const values = data.map(d => d.value);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const stdDev = Math.sqrt(
      values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
    );

    return data.filter(point => {
      const zScore = Math.abs((point.value - mean) / stdDev);
      return zScore <= this.MAX_OUTLIER_STDDEV;
    });
  }

  /**
   * Calculate seasonality patterns
   */
  private calculateSeasonality(data: TimeSeriesDataPoint[]): SeasonalityPattern[] {
    const monthlyAverages: number[] = Array(12).fill(0);
    const monthCounts: number[] = Array(12).fill(0);

    // Calculate average value for each month
    data.forEach(point => {
      const month = new Date(point.date).getMonth();
      monthlyAverages[month] += point.value;
      monthCounts[month]++;
    });

    // Calculate average and create seasonality factors
    const yearlyAverage = monthlyAverages.reduce((sum, val, i) => {
      return sum + (val / (monthCounts[i] || 1));
    }, 0) / 12;

    return monthlyAverages.map((total, month) => ({
      monthIndex: month,
      factor: monthCounts[month] ? (total / monthCounts[month]) / yearlyAverage : 1
    }));
  }

  /**
   * Calculate weighted growth rate
   */
  private calculateWeightedGrowth(data: TimeSeriesDataPoint[]): number {
    if (data.length < 2) return 0;

    const growthRates: { rate: number; weight: number }[] = [];
    
    for (let i = 1; i < data.length; i++) {
      const prev = data[i - 1].value;
      const curr = data[i].value;
      
      if (prev > 0) {
        const monthsFromNow = data.length - i;
        const weight = Math.pow(this.RECENT_WEIGHT_FACTOR, -monthsFromNow); // More recent = higher weight
        growthRates.push({
          rate: (curr - prev) / prev,
          weight
        });
      }
    }

    if (growthRates.length === 0) return 0;

    const totalWeight = growthRates.reduce((sum, { weight }) => sum + weight, 0);
    return growthRates.reduce((sum, { rate, weight }) => sum + (rate * weight), 0) / totalWeight;
  }

  /**
   * Calculate dynamic confidence interval based on historical volatility
   */
  private calculateConfidenceInterval(data: TimeSeriesDataPoint[], forecastMonths: number): number {
    if (data.length < 2) return 0.2; // Default 20% if not enough data

    const monthlyChanges: number[] = [];
    for (let i = 1; i < data.length; i++) {
      const percentChange = Math.abs((data[i].value - data[i - 1].value) / data[i - 1].value);
      monthlyChanges.push(percentChange);
    }

    const volatility = Math.sqrt(
      monthlyChanges.reduce((sum, change) => sum + Math.pow(change, 2), 0) / monthlyChanges.length
    );

    // Increase confidence interval with forecast distance
    const baseInterval = Math.min(Math.max(volatility, 0.1), 0.5); // Between 10% and 50%
    return baseInterval * Math.sqrt(forecastMonths);
  }

  /**
   * Separate recurring and non-recurring revenue
   */
  private separateRevenueTypes(invoices: InvoiceData[]): {
    recurring: TimeSeriesDataPoint[];
    nonRecurring: TimeSeriesDataPoint[];
  } {
    const recurringByMonth = new Map<string, number>();
    const nonRecurringByMonth = new Map<string, number>();

    invoices.forEach(invoice => {
      const date = startOfMonth(new Date(invoice.due_date)).toISOString().split('T')[0];
      const map = invoice.is_recurring ? recurringByMonth : nonRecurringByMonth;
      map.set(date, (map.get(date) || 0) + invoice.amount);
    });

    const toTimeSeriesData = (map: Map<string, number>): TimeSeriesDataPoint[] => {
      return Array.from(map.entries())
        .map(([date, value]) => ({ date, value }))
        .sort((a, b) => a.date.localeCompare(b.date));
    };

    return {
      recurring: toTimeSeriesData(recurringByMonth),
      nonRecurring: toTimeSeriesData(nonRecurringByMonth)
    };
  }

  /**
   * Generate forecast for a specific revenue type
   */
  private generateTypeSpecificForecast(
    historicalData: TimeSeriesDataPoint[],
    forecastMonths: number,
    seasonality: SeasonalityPattern[]
  ): ForecastResult[] {
    const cleanData = this.removeOutliers(historicalData);
    const growth = this.calculateWeightedGrowth(cleanData);
    
    const lastActualDate = new Date(cleanData[cleanData.length - 1].date);
    const lastValue = cleanData[cleanData.length - 1].value;
    const results: ForecastResult[] = [];

    for (let i = 0; i < forecastMonths; i++) {
      const forecastDate = addMonths(lastActualDate, i + 1);
      const monthIndex = forecastDate.getMonth();
      const seasonalFactor = seasonality[monthIndex].factor;
      const distanceInMonths = i + 1;
      
      const baseForecast = lastValue * Math.pow(1 + growth, distanceInMonths);
      const seasonalForecast = baseForecast * seasonalFactor;
      
      const confidence = this.calculateConfidenceInterval(cleanData, distanceInMonths);
      
      results.push({
        date: forecastDate.toISOString().split('T')[0],
        actual: null,
        forecast: seasonalForecast,
        lower: seasonalForecast * (1 - confidence),
        upper: seasonalForecast * (1 + confidence),
        confidence
      });
    }

    return results;
  }

  /**
   * Generate complete revenue forecast
   */
  public generateForecast(
    invoices: InvoiceData[],
    forecastMonths: number = 6
  ): ForecastResult[] {
    if (invoices.length < this.MIN_DATA_POINTS) {
      throw new Error(`Insufficient data for forecasting. Need at least ${this.MIN_DATA_POINTS} months of data.`);
    }

    // Separate revenue types
    const { recurring, nonRecurring } = this.separateRevenueTypes(invoices);

    // Calculate seasonality patterns
    const seasonality = this.calculateSeasonality([...recurring, ...nonRecurring]);

    // Generate separate forecasts
    const recurringForecast = recurring.length >= this.MIN_DATA_POINTS
      ? this.generateTypeSpecificForecast(recurring, forecastMonths, seasonality)
      : [];
      
    const nonRecurringForecast = nonRecurring.length >= this.MIN_DATA_POINTS
      ? this.generateTypeSpecificForecast(nonRecurring, forecastMonths, seasonality)
      : [];

    // Combine forecasts
    const combinedForecast: ForecastResult[] = [];
    for (let i = 0; i < forecastMonths; i++) {
      const recurringResult = recurringForecast[i] || { forecast: 0, lower: 0, upper: 0, confidence: 0 };
      const nonRecurringResult = nonRecurringForecast[i] || { forecast: 0, lower: 0, upper: 0, confidence: 0 };

      const date = recurringResult.date || nonRecurringResult.date;
      const forecast = recurringResult.forecast + nonRecurringResult.forecast;
      
      // Weighted confidence based on revenue type proportions
      const totalForecast = forecast || 1; // Avoid division by zero
      const recurringWeight = recurringResult.forecast / totalForecast;
      const nonRecurringWeight = nonRecurringResult.forecast / totalForecast;
      const weightedConfidence = 
        (recurringResult.confidence * recurringWeight) +
        (nonRecurringResult.confidence * nonRecurringWeight);

      combinedForecast.push({
        date,
        actual: null,
        forecast,
        lower: forecast * (1 - weightedConfidence),
        upper: forecast * (1 + weightedConfidence),
        confidence: weightedConfidence
      });
    }

    return combinedForecast;
  }
}