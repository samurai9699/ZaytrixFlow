export interface StripeProduct {
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price: number;
}

export const STRIPE_PRODUCTS: Record<string, StripeProduct> = {
  pro: {
    priceId: 'price_1RX7OODnl7eA7o2ILPyqAk3r',
    name: 'Pro',
    description: 'Everything you need for growing your business',
    mode: 'subscription',
    price: 8,
  },
  premium: {
    priceId: 'price_1RX7RLDnl7eA7o2ImjEdcoOa',
    name: 'Premium',
    description: 'For established freelancers with complex needs',
    mode: 'subscription',
    price: 15,
  },
};

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return Object.values(STRIPE_PRODUCTS).find(product => product.priceId === priceId);
};