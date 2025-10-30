import { useAuth } from '@/_core/hooks/useAuth';
import { getLoginUrl } from '@/const';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Truck, ArrowLeft, Users, DollarSign, Calendar, Mail, Phone, Globe 
} from 'lucide-react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';

export default function CRMClients() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Fetch clients and payments
  const { data: clients } = trpc.clients.getAll.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: payments } = trpc.payments.getAllPayments.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      active: { label: 'Activo', variant: 'default' },
      paused: { label: 'Pausado', variant: 'secondary' },
      cancelled: { label: 'Cancelado', variant: 'destructive' },
      overdue: { label: 'Vencido', variant: 'destructive' },
    };
    
    const config = statusConfig[status] || statusConfig.active;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPlanBadge = (plan: string) => {
    const planColors: Record<string, string> = {
      bronze: 'bg-amber-100 text-amber-800',
      silver: 'bg-slate-200 text-slate-800',
      gold: 'bg-yellow-100 text-yellow-800',
    };
    
    return (
      <Badge className={planColors[plan] || planColors.silver}>
        {plan.toUpperCase()}
      </Badge>
    );
  };

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
    window.location.href = getLoginUrl();
    return null;
  }

  const totalRevenue = payments?.reduce((sum, p) => {
    if (p.status === 'succeeded') {
      return sum + Number(p.amount);
    }
    return sum;
  }, 0) || 0;

  const activeClients = clients?.filter(c => c.status === 'active').length || 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => setLocation('/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <div className="flex items-center gap-2">
                <Truck className="h-8 w-8 text-orange-600" />
                <span className="text-2xl font-bold text-slate-900">Clientes y Pagos</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Clientes Activos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-slate-900">{activeClients}</div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-xs text-slate-500 mt-2">De {clients?.length || 0} totales</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Ingresos Totales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-slate-900">€{totalRevenue.toFixed(0)}</div>
                <DollarSign className="h-8 w-8 text-orange-600" />
              </div>
              <p className="text-xs text-slate-500 mt-2">{payments?.length || 0} pagos recibidos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Ingresos Mensuales Recurrentes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-slate-900">€0</div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-xs text-slate-500 mt-2">MRR estimado</p>
            </CardContent>
          </Card>
        </div>

        {/* Clients Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Clientes</CardTitle>
            <CardDescription>Lista de todos tus clientes y su estado de suscripción</CardDescription>
          </CardHeader>
          <CardContent>
            {clients && clients.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Ciclo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Inicio</TableHead>
                    <TableHead>Próximo Pago</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-slate-400" />
                          {client.companyName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">{client.contactName || '-'}</div>
                          <div className="flex items-center gap-1 text-xs text-slate-600">
                            <Mail className="h-3 w-3" />
                            {client.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getPlanBadge(client.plan)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {client.billingCycle === 'monthly' ? 'Mensual' : 'Anual'}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(client.status)}</TableCell>
                      <TableCell>
                        {client.contractStartDate 
                          ? new Date(client.contractStartDate).toLocaleDateString('es-ES')
                          : '-'
                        }
                      </TableCell>
                      <TableCell>
                        {client.nextPaymentDate 
                          ? new Date(client.nextPaymentDate).toLocaleDateString('es-ES')
                          : '-'
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay clientes todavía</p>
                <p className="text-sm">Los clientes aparecerán aquí cuando conviertas leads</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payments Table */}
        <Card>
          <CardHeader>
            <CardTitle>Historial de Pagos</CardTitle>
            <CardDescription>Todos los pagos recibidos a través de Stripe</CardDescription>
          </CardHeader>
          <CardContent>
            {payments && payments.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => {
                    const client = clients?.find(c => c.id === payment.clientId);
                    return (
                      <TableRow key={payment.id}>
                        <TableCell>
                          {payment.paidAt 
                            ? new Date(payment.paidAt).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })
                            : '-'
                          }
                        </TableCell>
                        <TableCell className="font-medium">
                          {client?.companyName || `Cliente #${payment.clientId}`}
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {payment.description || '-'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {payment.type === 'setup_fee' ? 'Setup' : 
                             payment.type === 'subscription' ? 'Suscripción' : 'Único'}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold">
                          €{Number(payment.amount).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {payment.status === 'succeeded' && (
                            <Badge className="bg-green-100 text-green-800">Exitoso</Badge>
                          )}
                          {payment.status === 'pending' && (
                            <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
                          )}
                          {payment.status === 'failed' && (
                            <Badge variant="destructive">Fallido</Badge>
                          )}
                          {payment.status === 'refunded' && (
                            <Badge className="bg-slate-200 text-slate-800">Reembolsado</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay pagos registrados</p>
                <p className="text-sm">Los pagos de Stripe aparecerán aquí automáticamente</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

