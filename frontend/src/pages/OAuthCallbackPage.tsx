import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Spinner } from '@/components/ui/spinner';
import toast from 'react-hot-toast';

export function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = searchParams.get('token');
    const mfaRequired = searchParams.get('mfa_required');
    const mfaToken = searchParams.get('mfa_token');
    const error = searchParams.get('error');

    if (error) {
      toast.error('OAuth login failed. Please try again.');
      navigate('/login');
      return;
    }

    if (mfaRequired === 'true' && mfaToken) {
      navigate('/mfa-verify', { state: { mfaToken } });
      return;
    }

    if (token) {
      localStorage.setItem('access_token', token);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      toast.success('Welcome!');
      navigate('/dashboard');
      return;
    }

    navigate('/login');
  }, [searchParams, navigate, queryClient]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <Spinner size={40} className="mx-auto" />
        <p className="text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
}
