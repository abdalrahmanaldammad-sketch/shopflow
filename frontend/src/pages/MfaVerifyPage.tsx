import { useState } from 'react';
import { useLocation, Navigate, Link } from 'react-router-dom';
import { useMfaLogin, useMfaRecoveryLogin } from '@/hooks/useMfa';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { ShieldCheck, ArrowLeft, KeyRound } from 'lucide-react';

export function MfaVerifyPage() {
  const location = useLocation();
  const mfaToken = (location.state as { mfaToken?: string })?.mfaToken;
  const [code, setCode] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [useRecovery, setUseRecovery] = useState(false);
  const mfaLogin = useMfaLogin();
  const mfaRecoveryLogin = useMfaRecoveryLogin();

  if (!mfaToken) {
    return <Navigate to="/login" replace />;
  }

  const handleTotpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mfaLogin.mutate({ mfaToken, code });
  };

  const handleRecoverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mfaRecoveryLogin.mutate({ mfaToken, recoveryCode });
  };

  return (
    <AuthLayout>
      <Card className="border-border/50">
        <CardHeader className="text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            {useRecovery ? (
              <KeyRound className="h-7 w-7 text-primary" />
            ) : (
              <ShieldCheck className="h-7 w-7 text-primary" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {useRecovery ? 'Recovery Code' : 'Two-Factor Authentication'}
          </CardTitle>
          <CardDescription>
            {useRecovery
              ? 'Enter one of your recovery codes'
              : 'Enter the 6-digit code from your authenticator app'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {useRecovery ? (
            <form onSubmit={handleRecoverySubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recoveryCode">Recovery code</Label>
                <Input
                  id="recoveryCode"
                  placeholder="XXXX-XXXX"
                  value={recoveryCode}
                  onChange={(e) => setRecoveryCode(e.target.value)}
                  required
                  className="text-center text-lg tracking-widest font-mono"
                  autoFocus
                />
              </div>
              <Button
                type="submit"
                className="w-full h-11"
                disabled={mfaRecoveryLogin.isPending}
              >
                {mfaRecoveryLogin.isPending ? (
                  <Spinner size={18} className="text-white" />
                ) : (
                  'Verify Recovery Code'
                )}
              </Button>
              <button
                type="button"
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setUseRecovery(false)}
              >
                Use authenticator app instead
              </button>
            </form>
          ) : (
            <form onSubmit={handleTotpSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Authentication code</Label>
                <Input
                  id="code"
                  placeholder="000000"
                  value={code}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setCode(val);
                  }}
                  required
                  maxLength={6}
                  className="text-center text-2xl tracking-[0.5em] font-mono"
                  autoFocus
                  autoComplete="one-time-code"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-11"
                disabled={mfaLogin.isPending || code.length !== 6}
              >
                {mfaLogin.isPending ? <Spinner size={18} className="text-white" /> : 'Verify'}
              </Button>
              <button
                type="button"
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setUseRecovery(true)}
              >
                Lost your device? Use a recovery code
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
