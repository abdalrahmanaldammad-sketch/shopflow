import { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useVerifyEmail } from '@/hooks/useAuth';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { CheckCircle2, XCircle } from 'lucide-react';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const verifyEmail = useVerifyEmail();

  useEffect(() => {
    if (token) {
      verifyEmail.mutate(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <AuthLayout>
      <Card className="border-border/50">
        <CardContent className="pt-8 pb-8">
          {verifyEmail.isPending && (
            <div className="text-center space-y-4">
              <Spinner size={40} className="mx-auto" />
              <p className="text-muted-foreground">Verifying your email...</p>
            </div>
          )}

          {verifyEmail.isSuccess && (
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
              </div>
              <h2 className="text-xl font-semibold">Email Verified!</h2>
              <p className="text-sm text-muted-foreground">
                Your email has been verified successfully. You can now sign in to your account.
              </p>
              <Button asChild className="mt-2">
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          )}

          {verifyEmail.isError && (
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <XCircle className="h-8 w-8 text-destructive" />
              </div>
              <h2 className="text-xl font-semibold">Verification Failed</h2>
              <p className="text-sm text-muted-foreground">
                The verification link may be expired or invalid.
              </p>
              <Button variant="outline" asChild className="mt-2">
                <Link to="/login">Back to Sign In</Link>
              </Button>
            </div>
          )}

          {!token && (
            <div className="text-center space-y-4">
              <XCircle className="h-10 w-10 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">No verification token provided.</p>
              <Button variant="outline" asChild>
                <Link to="/login">Back to Sign In</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
