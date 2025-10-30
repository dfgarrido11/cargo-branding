import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";

interface PricingSectionProps {
  language: 'de' | 'es' | 'en';
}

export function PricingSection({ language }: PricingSectionProps) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const createCheckout = trpc.payments.createCheckout.useMutation();

  const translations = {
    de: {
      title: "Preise",
      subtitle: "Wählen Sie den perfekten Plan für Ihr Unternehmen",
      setupFee: "Einrichtungsgebühr",
      monthly: "Monatlich",
      annual: "Jährlich",
      perMonth: "/Monat",
      perYear: "/Jahr",
      save: "Sparen Sie",
      popular: "Beliebt",
      getStarted: "Jetzt starten",
      bronze: {
        name: "Bronze",
        description: "Perfekt für kleine Unternehmen",
      },
      silver: {
        name: "Silber",
        description: "Ideal für wachsende Unternehmen",
      },
      gold: {
        name: "Gold",
        description: "Für etablierte Unternehmen",
      },
    },
    es: {
      title: "Precios",
      subtitle: "Elige el plan perfecto para tu empresa",
      setupFee: "Tarifa de configuración",
      monthly: "Mensual",
      annual: "Anual",
      perMonth: "/mes",
      perYear: "/año",
      save: "Ahorra",
      popular: "Popular",
      getStarted: "Comenzar ahora",
      bronze: {
        name: "Bronce",
        description: "Perfecto para pequeñas empresas",
      },
      silver: {
        name: "Plata",
        description: "Ideal para empresas en crecimiento",
      },
      gold: {
        name: "Oro",
        description: "Para empresas establecidas",
      },
    },
    en: {
      title: "Pricing",
      subtitle: "Choose the perfect plan for your business",
      setupFee: "Setup Fee",
      monthly: "Monthly",
      annual: "Annual",
      perMonth: "/mo",
      perYear: "/yr",
      save: "Save",
      popular: "Popular",
      getStarted: "Get Started",
      bronze: {
        name: "Bronze",
        description: "Perfect for small businesses",
      },
      silver: {
        name: "Silver",
        description: "Ideal for growing companies",
      },
      gold: {
        name: "Gold",
        description: "For established enterprises",
      },
    },
  };

  const t = translations[language];

  const plans = [
    {
      id: 'bronze' as const,
      name: t.bronze.name,
      description: t.bronze.description,
      setupFee: 297,
      monthlyFee: 27,
      annualFee: 275, // 15% discount: 27*12*0.85 = 275.4
      features: [
        'Professional website (5 pages)',
        'Professional email',
        'Mobile responsive',
        'Basic SEO',
        'SSL certificate',
        'Monthly maintenance',
      ],
      popular: false,
    },
    {
      id: 'silver' as const,
      name: t.silver.name,
      description: t.silver.description,
      setupFee: 497,
      monthlyFee: 47,
      annualFee: 480, // 15% discount: 47*12*0.85 = 479.4
      features: [
        'Advanced website (10 pages)',
        'Professional email',
        'Analytics dashboard',
        'Advanced SEO',
        'Social media integration',
        'Blog setup',
        'Monthly maintenance & updates',
      ],
      popular: true,
    },
    {
      id: 'gold' as const,
      name: t.gold.name,
      description: t.gold.description,
      setupFee: 797,
      monthlyFee: 97,
      annualFee: 990, // 15% discount: 97*12*0.85 = 989.4
      features: [
        'Premium website (unlimited pages)',
        'Professional email',
        'Advanced analytics dashboard',
        'Load tracking system',
        'Client portal',
        'API integrations',
        'Priority support',
        'Weekly maintenance & updates',
      ],
      popular: false,
    },
  ];

  const calculateSavings = (monthlyFee: number, annualFee: number) => {
    return Math.round(monthlyFee * 12 - annualFee);
  };

  const handleGetStarted = async (planId: 'bronze' | 'silver' | 'gold') => {
    const email = prompt('Please enter your email address:');
    if (!email) return;

    setLoadingPlan(planId);
    try {
      const result = await createCheckout.mutateAsync({
        plan: planId,
        email,
        billingCycle,
      });
      
      if (result.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      toast.error('Failed to create checkout session. Please try again.');
      console.error(error);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.title}</h2>
          <p className="text-xl text-slate-600 mb-8">{t.subtitle}</p>

          {/* Billing Cycle Toggle */}
          <div className="inline-flex items-center gap-3 bg-white rounded-full p-2 shadow-lg border-2 border-slate-200">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.monthly}
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-full font-semibold transition-all flex items-center gap-2 ${
                billingCycle === 'annual'
                  ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.annual}
              {billingCycle === 'annual' && (
                <Badge className="bg-green-500 text-white text-xs">-15%</Badge>
              )}
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const displayPrice = billingCycle === 'monthly' ? plan.monthlyFee : plan.annualFee;
            const savings = calculateSavings(plan.monthlyFee, plan.annualFee);
            
            return (
              <Card
                key={plan.id}
                className={`relative ${
                  plan.popular
                    ? 'border-orange-500 border-2 shadow-xl scale-105'
                    : 'border-slate-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      {t.popular}
                    </span>
                  </div>
                )}

                {billingCycle === 'annual' && (
                  <div className="absolute -top-4 right-4">
                    <Badge className="bg-green-500 text-white">
                      {t.save} €{savings}
                    </Badge>
                  </div>
                )}
                
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div>
                    <div className="text-sm text-slate-600 mb-1">{t.setupFee}</div>
                    <div className="text-4xl font-bold text-slate-900">
                      €{plan.setupFee}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-slate-600 mb-1">
                      {billingCycle === 'monthly' ? t.monthly : t.annual}
                    </div>
                    <div className="text-3xl font-bold text-orange-600">
                      €{displayPrice}
                      <span className="text-lg text-slate-600">
                        {billingCycle === 'monthly' ? t.perMonth : t.perYear}
                      </span>
                    </div>
                    {billingCycle === 'annual' && (
                      <div className="text-sm text-green-600 font-semibold mt-1">
                        vs €{plan.monthlyFee * 12} {t.monthly.toLowerCase()}
                      </div>
                    )}
                  </div>

                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button
                    className="w-full"
                    size="lg"
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => handleGetStarted(plan.id)}
                    disabled={loadingPlan === plan.id}
                  >
                    {loadingPlan === plan.id ? 'Loading...' : t.getStarted}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

