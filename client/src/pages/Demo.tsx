import { useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Truck, Mail, Phone, MapPin, Check } from 'lucide-react';

export default function Demo() {
  const [, params] = useRoute('/demo/:slug');
  const slug = params?.slug || 'example';

  // In production, this would fetch demo data from the backend
  const demoData = {
    companyName: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    logoUrl: null,
    primaryColor: '#1e40af',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Demo Banner */}
      <div className="bg-blue-600 text-white py-3 text-center">
        <p className="text-sm font-medium">
          🎉 This is a preview of how your website could look - Professional, Modern, Ready in 7 days
        </p>
      </div>

      {/* Navigation */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-slate-900">{demoData.companyName}</span>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              <a href="#services" className="text-slate-600 hover:text-blue-600 transition">Services</a>
              <a href="#about" className="text-slate-600 hover:text-blue-600 transition">About</a>
              <a href="#contact" className="text-slate-600 hover:text-blue-600 transition">Contact</a>
            </div>

            <Button className="bg-blue-600 hover:bg-blue-700">
              Get Quote
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Professional Transport & Logistics Solutions
              </h1>
              <p className="text-xl text-slate-600 mb-8">
                Reliable freight forwarding across Europe. Your trusted partner for efficient logistics solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Request Quote
                </Button>
                <Button size="lg" variant="outline">
                  Our Services
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
              Our Services
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Comprehensive logistics solutions tailored to your needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Road Freight',
                description: 'Full and partial loads across Europe with real-time tracking',
                features: ['FTL & LTL', 'Express delivery', 'Temperature controlled'],
              },
              {
                title: 'Warehousing',
                description: 'Secure storage facilities with modern inventory management',
                features: ['24/7 security', 'Climate control', 'Flexible contracts'],
              },
              {
                title: 'Customs Clearance',
                description: 'Expert handling of all customs documentation and procedures',
                features: ['Fast processing', 'EU expertise', 'Compliance guaranteed'],
              },
            ].map((service, i) => (
              <Card key={i} className="border-2 hover:border-blue-500 transition">
                <CardContent className="pt-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{service.title}</h3>
                  <p className="text-slate-600 mb-6">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-600" />
                        <span className="text-sm text-slate-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
                Get in Touch
              </h2>
              <p className="text-xl text-slate-600">
                Ready to optimize your logistics? Contact us today
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Mail className="h-6 w-6 text-blue-600 mt-1" />
                      <div>
                        <div className="font-semibold text-slate-900">Email</div>
                        <div className="text-slate-600">info@{slug}.com</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="h-6 w-6 text-blue-600 mt-1" />
                      <div>
                        <div className="font-semibold text-slate-900">Phone</div>
                        <div className="text-slate-600">+49 123 456 7890</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-6 w-6 text-blue-600 mt-1" />
                      <div>
                        <div className="font-semibold text-slate-900">Address</div>
                        <div className="text-slate-600">Business Park 123<br />12345 City, Germany</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-600 text-white">
                <CardContent className="pt-6">
                  <h3 className="text-2xl font-bold mb-4">Like what you see?</h3>
                  <p className="mb-6">
                    This could be YOUR website in just 7 days. Professional, modern, and ready to attract customers.
                  </p>
                  <Button size="lg" className="w-full bg-white text-blue-600 hover:bg-slate-100">
                    Get Your Website Now
                  </Button>
                  <p className="text-sm mt-4 text-blue-100">
                    Starting from €297 setup + €27/month
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Truck className="h-8 w-8" />
              <span className="text-2xl font-bold">{demoData.companyName}</span>
            </div>
            <p className="text-slate-400 mb-4">Professional Transport & Logistics Solutions</p>
            <div className="text-sm text-slate-500">
              © 2025 {demoData.companyName}. This is a demo website created by Cargo Branding.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

