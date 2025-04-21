
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "$0",
    duration: "forever",
    features: [
      "3 active projects",
      "Basic audio effects",
      "5GB storage",
      "Community support",
      "720p export quality"
    ],
    cta: "Get Started",
    highlighted: false
  },
  {
    name: "Pro",
    price: "$15",
    duration: "per month",
    features: [
      "Unlimited projects",
      "Advanced effects suite",
      "50GB storage",
      "Priority support",
      "4K export quality",
      "AI mixing assistance",
      "Custom branding"
    ],
    cta: "Try Pro",
    highlighted: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    duration: "per org",
    features: [
      "Everything in Pro",
      "Unlimited storage",
      "24/7 dedicated support",
      "Custom integration",
      "Team management",
      "Advanced analytics",
      "SLA guarantee"
    ],
    cta: "Contact Sales",
    highlighted: false
  }
];

const Pricing = () => {
  return (
    <div className="py-20 bg-cyber-darker min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyber-purple to-cyber-blue bg-clip-text text-transparent">
            Choose Your Plan
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            From solo artists to enterprise studios, we have a plan that fits your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`glass-card border-cyber-purple/20 p-8 rounded-lg relative ${
                plan.highlighted
                  ? "border-cyber-purple border-2"
                  : "border"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-cyber-purple to-cyber-blue text-white px-4 py-1 rounded-full text-sm">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold bg-gradient-to-r from-cyber-purple to-cyber-blue bg-clip-text text-transparent">
                  {plan.price}
                </div>
                <div className="text-white/60 text-sm">{plan.duration}</div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center text-white/80">
                    <svg
                      className="w-5 h-5 mr-3 text-cyber-purple"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className={`w-full ${
                  plan.highlighted
                    ? "bg-gradient-to-r from-cyber-purple to-cyber-blue text-white"
                    : "border-cyber-purple/50 hover:bg-cyber-purple/20"
                }`}
                variant={plan.highlighted ? "default" : "outline"}
              >
                <Link to="/auth">
                  {plan.cta}
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
