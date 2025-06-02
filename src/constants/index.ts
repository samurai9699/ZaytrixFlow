import { Feature, NavItem, PricingPlan, Testimonial } from "../types";

export const NAV_ITEMS: NavItem[] = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Testimonials", href: "#testimonials" },
];

export const FEATURES: Feature[] = [
  {
    title: "Smart Reminders",
    description: "Automated, customizable reminders that adapt to client payment behavior",
    icon: "BellRing",
  },
  {
    title: "Payment Tracking",
    description: "Real-time dashboard showing pending, upcoming, and received payments",
    icon: "LineChart",
  },
  {
    title: "Client Profiles",
    description: "Track payment history and behavior patterns for each client",
    icon: "Users",
  },
  {
    title: "Invoice Templates",
    description: "Professional templates with your branding and payment terms",
    icon: "FileText",
  },
  {
    title: "Multi-Currency",
    description: "Send invoices and receive payments in any currency",
    icon: "Globe",
  },
  {
    title: "Payment Integrations",
    description: "Connect with popular payment gateways for faster payments",
    icon: "CreditCard",
  },
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    title: "Starter",
    price: "Free",
    description: "Perfect for freelancers just getting started",
    features: [
      "Up to 5 clients",
      "3 invoice templates",
      "Basic reminder schedule",
      "Email support",
    ],
    cta: "Get Started",
  },
  {
    title: "Pro",
    price: "$8",
    description: "Everything you need for growing your business",
    features: [
      "Up to 20 clients",
      "10 invoice templates",
      "Advanced reminder schedule",
      "Payment tracking dashboard",
      "Client payment history",
      "Priority email support",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    title: "Premium",
    price: "$15",
    description: "For established freelancers with complex needs",
    features: [
      "Unlimited clients",
      "Custom invoice templates",
      "AI-powered reminder optimization",
      "Advanced analytics dashboard",
      "Client portal access",
      "Priority phone support",
      "White-labeling options",
    ],
    cta: "Start Free Trial",
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Sarah Johnson",
    role: "Graphic Designer",
    company: "Freelance",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
    quote: "InvoiceFlow has completely transformed how I handle client payments. I've reduced my late payments by 75% and saved hours of awkward follow-up conversations.",
  },
  {
    name: "Marcus Chen",
    role: "Web Developer",
    company: "CodeCraft Studios",
    image: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150",
    quote: "As someone who hates the administrative side of freelancing, InvoiceFlow has been a game-changer. My cash flow has never been more consistent.",
  },
  {
    name: "Amelia Rodriguez",
    role: "Content Writer",
    company: "WordSmith Media",
    image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
    quote: "The automated reminders are so professional, my clients actually thank me for them! My payment timeline has shrunk from 45 days to just 12.",
  },
];

export const STATS = [
  { value: "50M+", label: "Freelancers struggle with late payments" },
  { value: "42%", label: "Average payment delay for freelancers" },
  { value: "73%", label: "Reduced payment time with InvoiceFlow" },
  { value: "8+ hrs", label: "Saved monthly on payment admin" },
];