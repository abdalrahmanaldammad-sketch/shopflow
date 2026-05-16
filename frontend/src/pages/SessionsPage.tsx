import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useSessions, useRevokeSession, useRevokeAllSessions } from '@/hooks/useSessions';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { formatDate } from '@/lib/utils';
import {
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Trash2,
  LogOut,
} from 'lucide-react';

function DeviceIcon({ type }: { type: string }) {
  switch (type) {
    case 'Mobile':
      return <Smartphone className="h-5 w-5" />;
    case 'Tablet':
      return <Tablet className="h-5 w-5" />;
    default:
      return <Monitor className="h-5 w-5" />;
  }
}

export function SessionsPage() {
  const { data: sessions, isLoading } = useSessions();
  const revokeSession = useRevokeSession();
  const revokeAll = useRevokeAllSessions();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Active Sessions</h1>
            <p className="text-muted-foreground mt-1">
              Manage your active sessions across devices
            </p>
          </div>
          {sessions && sessions.length > 1 && (
            <Button
              variant="outline"
              className="text-destructive hover:text-destructive"
              onClick={() => revokeAll.mutate()}
              disabled={revokeAll.isPending}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Revoke All Others
            </Button>
          )}
        </div>

        {isLoading && (
          <div className="flex justify-center py-12">
            <Spinner size={32} />
          </div>
        )}

        <div className="space-y-3">
          {sessions?.map((session) => (
            <Card key={session.id} className={session.current ? 'border-primary/30' : ''}>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center shrink-0 text-muted-foreground">
                    <DeviceIcon type={session.deviceType} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">
                        {session.browser} on {session.operatingSystem}
                      </p>
                      {session.current && (
                        <Badge variant="success" className="text-[10px]">
                          Current
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        {session.ipAddress}
                      </span>
                      <span>Last active: {formatDate(session.lastUsedAt)}</span>
                    </div>
                  </div>
                  {!session.current && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive shrink-0"
                      onClick={() => revokeSession.mutate(session.id)}
                      disabled={revokeSession.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {sessions?.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Monitor className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No active sessions found</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
