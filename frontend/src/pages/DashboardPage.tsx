import { useCurrentUser } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate, getInitials } from '@/lib/utils';
import {
  Shield,
  Mail,
  Clock,
  User,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';

export function DashboardPage() {
  const { data: user } = useCurrentUser();

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user.firstName}
          </p>
        </div>

        {/* Profile card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-6">
              <div className="h-16 w-16 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-xl font-bold text-primary shrink-0">
                {getInitials(user.firstName, user.lastName)}
              </div>
              <div className="space-y-1 min-w-0">
                <h2 className="text-xl font-semibold">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-muted-foreground">{user.email}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {user.roles.map((role) => (
                    <Badge key={role} variant="default">
                      {role.replace('ROLE_', '')}
                    </Badge>
                  ))}
                  <Badge variant={user.authProvider === 'LOCAL' ? 'secondary' : 'success'}>
                    {user.authProvider}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Email Status
              </CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge variant={user.emailVerified ? 'success' : 'destructive'}>
                  {user.emailVerified ? 'Verified' : 'Unverified'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                MFA Status
              </CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {user.mfaEnabled ? (
                  <>
                    <ShieldCheck className="h-5 w-5 text-emerald-400" />
                    <span className="text-sm font-medium text-emerald-400">Enabled</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="h-5 w-5 text-amber-400" />
                    <span className="text-sm font-medium text-amber-400">Disabled</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Account Type
              </CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium">{user.authProvider}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Member Since
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium">{formatDate(user.createdAt)}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
