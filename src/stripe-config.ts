export interface StripeProduct {
  name: string;
  description: string;
  monthlyPriceId: string;
  annualPriceId: string;
  monthlyPrice: number;
  annualPrice: number;
}

export const STRIPE_PRODUCTS: Record<string, StripeProduct> = {
  pro: {
    name: 'Pro',
    description: 'Everything you need for growing your business',
    monthlyPriceId: 'price_1RX7OODnl7eA7o2ILPyqAk3r',
    annualPriceId: 'price_1RX7TcDnl7eA7o2IAROVqhIK',
    monthlyPrice: 8,
    annualPrice: 100,
  },
  premium: {
    name: 'Premium',
    description: 'For established freelancers with complex needs.',
    monthlyPriceId: 'price_1RX7RLDnl7eA7o2ImjEdcoOa',
    annualPriceId: 'price_1RX7SPDnl7eA7o2IuZTSsS3Y',
    monthlyPrice: 15,
    annualPrice: 150,
  },
};

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return Object.values(STRIPE_PRODUCTS).find(
    product => product.monthlyPriceId === priceId || product.annualPriceId === priceId
  );
};
