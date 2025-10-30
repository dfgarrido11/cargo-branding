import { useAuth } from '@/_core/hooks/useAuth';
import { getLoginUrl } from '@/const';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Truck, Users, Mail, TrendingUp, ArrowLeft, Plus, 
  LayoutDashboard, UserCircle, DollarSign, Activity 
} from 'lucide-react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';

export default function Dashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  
  // Fetch dashboard stats
  const { data: stats } = trpc.dashboard.getStats.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  
  const { data: recentActivities } = trpc.activities.getRecent.useQuery(
    { limit: 5 },
    { enabled: isAuthenticated }
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Autenticación Requerida</CardTitle>
            <CardDescription>Por favor inicia sesión para acceder al CRM</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => window.location.href = getLoginUrl()}>
              Iniciar Sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => setLocation('/')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Sitio
              </Button>
              <div className="flex items-center gap-2">
                <Truck className="h-8 w-8 text-orange-600" />
                <span className="text-2xl font-bold text-slate-900">Cargo Branding CRM</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">
                Bienvenido, <strong>{user?.name}</strong>
              </span>
              {user?.role === 'admin' && (
                <Badge variant="default" className="bg-orange-600">Admin</Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              className="rounded-none border-b-2 border-orange-600"
              onClick={() => setLocation('/dashboard')}
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button 
              variant="ghost" 
              className="rounded-none"
              onClick={() => setLocation('/crm/leads')}
            >
              <UserCircle className="h-4 w-4 mr-2" />
              Leads
            </Button>
            <Button 
              variant="ghost" 
              className="rounded-none"
              onClick={() => setLocation('/crm/clients')}
            >
              <Users className="h-4 w-4 mr-2" />
              Clientes
            </Button>
            <Button 
              variant="ghost" 
              className="rounded-none"
              onClick={() => setLocation('/crm/payments')}
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Pagos
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
            <p className="text-slate-600">Resumen de tu negocio y actividad reciente</p>
          </div>
          <Button 
            size="lg"
            className="bg-orange-600 hover:bg-orange-700"
            onClick={() => setLocation('/crm/leads/new')}
          >
            <Plus className="h-5 w-5 mr-2" />
            Nuevo Lead
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardDescription>Total Leads</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-slate-900">
                  {stats?.totalLeads || 0}
                </div>
                <UserCircle className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-xs text-slate-500 mt-2">Prospectos en pipeline</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardDescription>Clientes Activos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-slate-900">
                  {stats?.activeClients || 0}
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                De {stats?.totalClients || 0} clientes totales
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardDescription>Ingresos Totales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-slate-900">
                  €{stats?.totalRevenue ? Number(stats.totalRevenue).toFixed(0) : '0'}
                </div>
                <DollarSign className="h-8 w-8 text-orange-600" />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {stats?.totalPayments || 0} pagos recibidos
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardDescription>Tasa de Conversión</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-slate-900">
                  {stats?.totalLeads && stats?.totalClients 
                    ? Math.round((stats.totalClients / stats.totalLeads) * 100)
                    : 0}%
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <p className="text-xs text-slate-500 mt-2">Leads → Clientes</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Actividad Reciente</CardTitle>
                  <CardDescription>Últimas interacciones registradas</CardDescription>
                </div>
                <Activity className="h-5 w-5 text-slate-400" />
              </div>
            </CardHeader>
            <CardContent>
              {recentActivities && recentActivities.length > 0 ? (
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                      <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-orange-600"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">
                          {activity.subject || activity.type}
                        </p>
                        {activity.description && (
                          <p className="text-xs text-slate-600 mt-1">{activity.description}</p>
                        )}
                        <p className="text-xs text-slate-400 mt-1">
                          {new Date(activity.createdAt).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay actividad reciente</p>
                  <p className="text-sm">Las interacciones aparecerán aquí</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Acciones Rápidas</CardTitle>
                  <CardDescription>Tareas comunes del CRM</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setLocation('/crm/leads/new')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Nuevo Lead
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setLocation('/crm/leads')}
                >
                  <UserCircle className="h-4 w-4 mr-2" />
                  Ver Todos los Leads
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setLocation('/crm/clients')}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Ver Clientes Activos
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setLocation('/crm/payments')}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Ver Historial de Pagos
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>📊 Resumen del Pipeline</CardTitle>
            <CardDescription>Estado actual de tus leads</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-5 gap-4">
              <div className="p-4 border rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">-</div>
                <p className="text-sm text-slate-600 mt-1">Nuevos</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-600">-</div>
                <p className="text-sm text-slate-600 mt-1">Contactados</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">-</div>
                <p className="text-sm text-slate-600 mt-1">Demo Enviado</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600">-</div>
                <p className="text-sm text-slate-600 mt-1">Negociando</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats?.totalClients || 0}
                </div>
                <p className="text-sm text-slate-600 mt-1">Ganados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

