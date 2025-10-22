import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Check, Truck, Mail, BarChart3, HeadphonesIcon, Zap, Shield, Clock, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

export default function Home() {
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  const contactMutation = trpc.public.submitContact.useMutation({
    onSuccess: () => {
      toast.success(t.contact.success);
      setFormData({ name: '', email: '', company: '', message: '' });
    },
    onError: () => {
      toast.error(t.contact.error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate({ ...formData, language });
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-slate-900">Cargo Branding</span>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              <button onClick={() => scrollToSection('services')} className="text-slate-600 hover:text-blue-600 transition">
                {t.nav.services}
              </button>
              <button onClick={() => scrollToSection('pricing')} className="text-slate-600 hover:text-blue-600 transition">
                {t.nav.pricing}
              </button>
              <button onClick={() => scrollToSection('benefits')} className="text-slate-600 hover:text-blue-600 transition">
                {t.nav.benefits}
              </button>
              <button onClick={() => scrollToSection('contact')} className="text-slate-600 hover:text-blue-600 transition">
                {t.nav.contact}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <LanguageSelector />
              <Button variant="outline" onClick={() => setLocation('/dashboard')}>
                {t.nav.dashboard}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
                {language === 'de' ? '🇪🇺 Spezialisiert auf Europa' : language === 'es' ? '🇪🇺 Especializado en Europa' : '🇪🇺 Specialized in Europe'}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                {t.hero.title}
              </h1>
              <p className="text-xl text-slate-600 mb-8">
                {t.hero.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700" onClick={() => scrollToSection('contact')}>
                  {t.hero.cta}
                </Button>
                <Button size="lg" variant="outline" onClick={() => scrollToSection('pricing')}>
                  {t.hero.ctaSecondary}
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-8 shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop" 
                  alt="Logistics" 
                  className="rounded-lg w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
              {t.services.title}
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              {t.services.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-2 hover:border-blue-500 transition">
              <CardHeader>
                <Truck className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>{t.services.web.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">{t.services.web.description}</p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-500 transition">
              <CardHeader>
                <Mail className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>{t.services.email.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">{t.services.email.description}</p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-500 transition">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>{t.services.dashboard.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">{t.services.dashboard.description}</p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-500 transition">
              <CardHeader>
                <HeadphonesIcon className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>{t.services.support.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">{t.services.support.description}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
              {t.pricing.title}
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              {t.pricing.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Bronze Plan */}
            <Card className="border-2 hover:border-blue-500 transition">
              <CardHeader>
                <CardTitle className="text-2xl">{t.pricing.bronze.name}</CardTitle>
                <CardDescription>{t.pricing.bronze.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="text-sm text-slate-600 mb-2">{t.pricing.setup}</div>
                  <div className="text-4xl font-bold text-slate-900">€297</div>
                </div>
                <div className="mb-6">
                  <div className="text-2xl font-bold text-blue-600">€27</div>
                  <div className="text-sm text-slate-600">{t.pricing.monthly}</div>
                </div>
                <ul className="space-y-3">
                  {t.pricing.bronze.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => scrollToSection('contact')}>
                  {t.pricing.getStarted}
                </Button>
              </CardFooter>
            </Card>

            {/* Silver Plan */}
            <Card className="border-2 border-blue-500 shadow-xl scale-105">
              <CardHeader>
                <Badge className="w-fit mb-2 bg-blue-600">
                  {language === 'de' ? 'Beliebt' : language === 'es' ? 'Popular' : 'Popular'}
                </Badge>
                <CardTitle className="text-2xl">{t.pricing.silver.name}</CardTitle>
                <CardDescription>{t.pricing.silver.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="text-sm text-slate-600 mb-2">{t.pricing.setup}</div>
                  <div className="text-4xl font-bold text-slate-900">€497</div>
                </div>
                <div className="mb-6">
                  <div className="text-2xl font-bold text-blue-600">€47</div>
                  <div className="text-sm text-slate-600">{t.pricing.monthly}</div>
                </div>
                <ul className="space-y-3">
                  {t.pricing.silver.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => scrollToSection('contact')}>
                  {t.pricing.getStarted}
                </Button>
              </CardFooter>
            </Card>

            {/* Gold Plan */}
            <Card className="border-2 hover:border-blue-500 transition">
              <CardHeader>
                <CardTitle className="text-2xl">{t.pricing.gold.name}</CardTitle>
                <CardDescription>{t.pricing.gold.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="text-sm text-slate-600 mb-2">{t.pricing.setup}</div>
                  <div className="text-4xl font-bold text-slate-900">€797</div>
                </div>
                <div className="mb-6">
                  <div className="text-2xl font-bold text-blue-600">€97</div>
                  <div className="text-sm text-slate-600">{t.pricing.monthly}</div>
                </div>
                <ul className="space-y-3">
                  {t.pricing.gold.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => scrollToSection('contact')}>
                  {t.pricing.getStarted}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
              {t.benefits.title}
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              {t.benefits.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Shield, ...t.benefits.items[0] },
              { icon: Zap, ...t.benefits.items[1] },
              { icon: TrendingUp, ...t.benefits.items[2] },
              { icon: Clock, ...t.benefits.items[3] },
            ].map((benefit, i) => (
              <Card key={i} className="text-center border-2 hover:border-blue-500 transition">
                <CardHeader>
                  <benefit.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
                {t.contact.title}
              </h2>
              <p className="text-xl text-slate-600">
                {t.contact.subtitle}
              </p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">{t.contact.name}</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">{t.contact.email}</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="company">{t.contact.company}</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">{t.contact.message}</Label>
                    <Textarea
                      id="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={contactMutation.isPending}>
                    {contactMutation.isPending ? '...' : t.contact.send}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Truck className="h-8 w-8" />
                <span className="text-2xl font-bold">Cargo Branding</span>
              </div>
              <p className="text-slate-400">{t.footer.tagline}</p>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">{t.nav.contact}</h3>
              <p className="text-slate-400">info@cargobranding.com</p>
              <p className="text-slate-400">admin@cargobranding.com</p>
            </div>

            <div>
              <h3 className="font-bold mb-4">{language === 'de' ? 'Rechtliches' : language === 'es' ? 'Legal' : 'Legal'}</h3>
              <div className="space-y-2">
                <a href="#" className="block text-slate-400 hover:text-white transition">{t.footer.privacy}</a>
                <a href="#" className="block text-slate-400 hover:text-white transition">{t.footer.terms}</a>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
            <p>© 2025 Cargo Branding. {t.footer.rights}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

