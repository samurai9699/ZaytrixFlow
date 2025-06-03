export interface PricingPlan {
  title: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

export interface Feature {
  title: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  image: string;
  quote: string;
}

export interface NavItem {
  label: string;
  href: string;
  description?: string;
}