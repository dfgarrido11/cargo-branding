import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Check, Truck, Mail, BarChart3, Zap, Shield, Clock, TrendingUp, Star, MessageCircle, ArrowRight } from 'lucide-react';
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

  const testimonials = [
    {
      company: 'TransEuropa GmbH',
      name: 'Michael Schmidt',
      role: language === 'de' ? 'Geschäftsführer' : language === 'es' ? 'Director' : 'Managing Director',
      text: language === 'de' 
        ? 'Von Gmail zu professioneller Website - unsere Anfragen sind um 40% gestiegen. Beste Investition!'
        : language === 'es'
        ? 'De Gmail a sitio web profesional - nuestras consultas aumentaron un 40%. ¡Mejor inversión!'
        : 'From Gmail to professional website - our inquiries increased by 40%. Best investment!',
      rating: 5,
    },
    {
      company: 'Spedition Müller',
      name: 'Anna Weber',
      role: language === 'de' ? 'Inhaberin' : language === 'es' ? 'Propietaria' : 'Owner',
      text: language === 'de'
        ? 'In 7 Tagen online. Kunden sind beeindruckt von unserem professionellen Auftritt.'
        : language === 'es'
        ? 'Online en 7 días. Los clientes están impresionados con nuestra presencia profesional.'
        : 'Online in 7 days. Clients are impressed by our professional presence.',
      rating: 5,
    },
    {
      company: 'LogiFreight SL',
      name: 'Carlos Rodríguez',
      role: language === 'de' ? 'Betriebsleiter' : language === 'es' ? 'Gerente de Operaciones' : 'Operations Manager',
      text: language === 'de'
        ? 'Das Tracking-System im Gold-Plan hat unsere Kundenbetreuung revolutioniert.'
        : language === 'es'
        ? 'El sistema de tracking del plan Oro revolucionó nuestro servicio al cliente.'
        : 'The tracking system in the Gold plan revolutionized our customer service.',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-slate-900 to-slate-700 p-2 rounded-lg">
                <Truck className="h-7 w-7 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Cargo Branding
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('services')} className="text-slate-700 hover:text-orange-600 transition font-medium">
                {t.nav.services}
              </button>
              <button onClick={() => scrollToSection('pricing')} className="text-slate-700 hover:text-orange-600 transition font-medium">
                {t.nav.pricing}
              </button>
              <button onClick={() => scrollToSection('testimonials')} className="text-slate-700 hover:text-orange-600 transition font-medium">
                {t.nav.testimonials}
              </button>
              <button onClick={() => scrollToSection('contact')} className="text-slate-700 hover:text-orange-600 transition font-medium">
                {t.nav.contact}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <LanguageSelector />
              <Button variant="outline" onClick={() => setLocation('/dashboard')} className="hidden sm:flex">
                {t.nav.dashboard}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-orange-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200 text-sm px-4 py-1.5">
                🚛 {language === 'de' ? 'Spezialisiert auf LKW-Transport' : language === 'es' ? 'Especializado en Transporte de Camiones' : 'Specialized in Truck Transport'}
              </Badge>
              
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-tight">
                {t.hero.title.split(' ').slice(0, 3).join(' ')}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-500">
                  {t.hero.title.split(' ').slice(3).join(' ')}
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-600 leading-relaxed">
                {t.hero.subtitle}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white text-lg px-8 py-6 shadow-xl shadow-orange-500/30"
                  onClick={() => scrollToSection('contact')}
                >
                  {t.hero.cta}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 py-6 border-2 border-slate-900 hover:bg-slate-900 hover:text-white"
                  onClick={() => scrollToSection('pricing')}
                >
                  {t.hero.ctaSecondary}
                </Button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 border-2 border-white flex items-center justify-center text-white font-bold">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-slate-600">
                    <div className="font-semibold text-slate-900">50+ {language === 'de' ? 'Kunden' : language === 'es' ? 'Clientes' : 'Clients'}</div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-orange-500 text-orange-500" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-slate-900/20 rounded-3xl blur-3xl"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img 
                  src="/truck-hero.jpg" 
                  alt="Modern European Truck" 
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 border-2 border-orange-100">
                <div className="text-4xl font-black text-slate-900">7</div>
                <div className="text-sm font-medium text-slate-600">
                  {language === 'de' ? 'Tage bis online' : language === 'es' ? 'Días hasta estar online' : 'Days to go live'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-slate-900 text-white hover:bg-slate-900">
              {language === 'de' ? 'Unsere Leistungen' : language === 'es' ? 'Nuestros Servicios' : 'Our Services'}
            </Badge>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6">
              {t.services.title}
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              {t.services.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: t.services.web.title, desc: t.services.web.description, color: 'orange' },
              { icon: Mail, title: t.services.email.title, desc: t.services.email.description, color: 'blue' },
              { icon: BarChart3, title: t.services.dashboard.title, desc: t.services.dashboard.description, color: 'green' },
              { icon: MessageCircle, title: language === 'de' ? 'KI-Chat 24/7' : language === 'es' ? 'Chat IA 24/7' : 'AI Chat 24/7', desc: language === 'de' ? 'Automatischer Chat-Support für Ihre Kunden - keine manuelle Betreuung nötig.' : language === 'es' ? 'Soporte de chat automático para tus clientes - sin atención manual necesaria.' : 'Automated chat support for your customers - no manual attention needed.', color: 'purple' },
            ].map((service, i) => (
              <Card key={i} className="border-2 hover:border-orange-500 hover:shadow-xl transition-all duration-300 group">
                <CardHeader>
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${
                    service.color === 'orange' ? 'from-orange-500 to-orange-600' :
                    service.color === 'blue' ? 'from-blue-500 to-blue-600' :
                    service.color === 'green' ? 'from-green-500 to-green-600' :
                    'from-purple-500 to-purple-600'
                  } flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <service.icon className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{service.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-orange-600 text-white hover:bg-orange-600">
              {language === 'de' ? 'Preise' : language === 'es' ? 'Precios' : 'Pricing'}
            </Badge>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6">
              {t.pricing.title}
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              {t.pricing.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Bronze */}
            <Card className="border-2 hover:border-orange-500 transition-all duration-300">
              <CardHeader className="pb-8">
                <CardTitle className="text-2xl font-black">{t.pricing.bronze.name}</CardTitle>
                <CardDescription className="text-base">{t.pricing.bronze.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="text-sm text-slate-500 mb-1">{t.pricing.setup}</div>
                  <div className="text-5xl font-black text-slate-900">€297</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="text-3xl font-black text-orange-600">€27</div>
                  <div className="text-sm text-slate-600">{t.pricing.monthly}</div>
                </div>
                <ul className="space-y-3">
                  {t.pricing.bronze.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-slate-900 hover:bg-slate-800" size="lg" onClick={() => scrollToSection('contact')}>
                  {t.pricing.getStarted}
                </Button>
              </CardFooter>
            </Card>

            {/* Silver - Popular */}
            <Card className="border-4 border-orange-500 shadow-2xl shadow-orange-500/20 scale-105 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-6 py-2 text-sm font-bold shadow-lg">
                  {language === 'de' ? '⭐ BELIEBT' : language === 'es' ? '⭐ POPULAR' : '⭐ POPULAR'}
                </Badge>
              </div>
              <CardHeader className="pb-8 pt-8">
                <CardTitle className="text-2xl font-black">{t.pricing.silver.name}</CardTitle>
                <CardDescription className="text-base">{t.pricing.silver.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="text-sm text-slate-500 mb-1">{t.pricing.setup}</div>
                  <div className="text-5xl font-black text-slate-900">€497</div>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
                  <div className="text-3xl font-black">€47</div>
                  <div className="text-sm text-orange-100">{t.pricing.monthly}</div>
                </div>
                <ul className="space-y-3">
                  {t.pricing.silver.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white shadow-lg" size="lg" onClick={() => scrollToSection('contact')}>
                  {t.pricing.getStarted}
                </Button>
              </CardFooter>
            </Card>

            {/* Gold */}
            <Card className="border-2 hover:border-orange-500 transition-all duration-300">
              <CardHeader className="pb-8">
                <CardTitle className="text-2xl font-black">{t.pricing.gold.name}</CardTitle>
                <CardDescription className="text-base">{t.pricing.gold.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="text-sm text-slate-500 mb-1">{t.pricing.setup}</div>
                  <div className="text-5xl font-black text-slate-900">€797</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="text-3xl font-black text-orange-600">€97</div>
                  <div className="text-sm text-slate-600">{t.pricing.monthly}</div>
                </div>
                <ul className="space-y-3">
                  {t.pricing.gold.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-slate-900 hover:bg-slate-800" size="lg" onClick={() => scrollToSection('contact')}>
                  {t.pricing.getStarted}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-orange-600 text-white hover:bg-orange-600">
              {language === 'de' ? 'Erfolgsgeschichten' : language === 'es' ? 'Casos de Éxito' : 'Success Stories'}
            </Badge>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
              {t.testimonials.title}
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              {t.testimonials.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {testimonials.map((testimonial, i) => (
              <Card key={i} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star key={j} className="h-5 w-5 fill-orange-500 text-orange-500" />
                    ))}
                  </div>
                  <CardTitle className="text-white text-lg">{testimonial.company}</CardTitle>
                  <CardDescription className="text-slate-300">
                    {testimonial.name} • {testimonial.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-200 italic">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6">
              {t.benefits.title}
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              {t.benefits.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Shield, ...t.benefits.items[0], color: 'blue' },
              { icon: Zap, ...t.benefits.items[1], color: 'orange' },
              { icon: TrendingUp, ...t.benefits.items[2], color: 'green' },
              { icon: Clock, ...t.benefits.items[3], color: 'purple' },
            ].map((benefit, i) => (
              <div key={i} className="text-center">
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${
                  benefit.color === 'blue' ? 'from-blue-500 to-blue-600' :
                  benefit.color === 'orange' ? 'from-orange-500 to-orange-600' :
                  benefit.color === 'green' ? 'from-green-500 to-green-600' :
                  'from-purple-500 to-purple-600'
                } flex items-center justify-center shadow-xl`}>
                  <benefit.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
                <p className="text-slate-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-orange-600 text-white hover:bg-orange-600">
                {language === 'de' ? 'Kontakt' : language === 'es' ? 'Contacto' : 'Contact'}
              </Badge>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6">
                {t.contact.title}
              </h2>
              <p className="text-xl text-slate-600">
                {t.contact.subtitle}
              </p>
            </div>

            <Card className="border-2 shadow-xl">
              <CardContent className="pt-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="text-base font-semibold">{t.contact.name}</Label>
                      <Input
                        id="name"
                        required
                        className="mt-2 h-12"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-base font-semibold">{t.contact.email}</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        className="mt-2 h-12"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="company" className="text-base font-semibold">{t.contact.company}</Label>
                    <Input
                      id="company"
                      className="mt-2 h-12"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-base font-semibold">{t.contact.message}</Label>
                    <Textarea
                      id="message"
                      required
                      rows={5}
                      className="mt-2"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-14 text-lg bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 shadow-lg" 
                    disabled={contactMutation.isPending}
                  >
                    {contactMutation.isPending ? '...' : t.contact.send}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2 rounded-lg">
                  <Truck className="h-7 w-7 text-white" />
                </div>
                <span className="text-2xl font-bold">Cargo Branding</span>
              </div>
              <p className="text-slate-400 text-lg mb-6">{t.footer.tagline}</p>
              <div className="flex items-center gap-4">
                <Mail className="h-5 w-5 text-orange-500" />
                <div>
                  <div className="text-sm text-slate-500">Email</div>
                  <div className="text-white">info@cargobranding.com</div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">{language === 'de' ? 'Navigation' : language === 'es' ? 'Navegación' : 'Navigation'}</h3>
              <div className="space-y-3">
                <button onClick={() => scrollToSection('services')} className="block text-slate-400 hover:text-orange-500 transition">{t.nav.services}</button>
                <button onClick={() => scrollToSection('pricing')} className="block text-slate-400 hover:text-orange-500 transition">{t.nav.pricing}</button>
                <button onClick={() => scrollToSection('testimonials')} className="block text-slate-400 hover:text-orange-500 transition">{t.nav.testimonials}</button>
                <button onClick={() => scrollToSection('contact')} className="block text-slate-400 hover:text-orange-500 transition">{t.nav.contact}</button>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">{language === 'de' ? 'Rechtliches' : language === 'es' ? 'Legal' : 'Legal'}</h3>
              <div className="space-y-3">
                <a href="#" className="block text-slate-400 hover:text-orange-500 transition">{t.footer.privacy}</a>
                <a href="#" className="block text-slate-400 hover:text-orange-500 transition">{t.footer.terms}</a>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center">
            <p className="text-slate-400">© 2025 Cargo Branding. {t.footer.rights}</p>
          </div>
        </div>
      </footer>

      {/* AI Chat Widget Placeholder */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          size="lg"
          className="rounded-full w-16 h-16 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 shadow-2xl shadow-orange-500/50"
          onClick={() => toast.info(language === 'de' ? 'KI-Chat kommt bald!' : language === 'es' ? '¡Chat IA próximamente!' : 'AI Chat coming soon!')}
        >
          <MessageCircle className="h-7 w-7" />
        </Button>
      </div>
    </div>
  );
}

