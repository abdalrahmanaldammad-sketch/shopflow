import type { ReactNode } from 'react';
import { Shield } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/20 via-background to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--color-primary)_0%,_transparent_50%)] opacity-10" />
        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <span className="text-2xl font-bold">AuthGuard</span>
          </div>
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Secure Authentication
            <br />
            <span className="text-primary">Made Simple</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-md">
            Production-grade authentication with MFA, OAuth2, session management,
            and role-based access control.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-4 max-w-md">
            {[
              'Two-Factor Auth',
              'OAuth2 Login',
              'Session Control',
              'Role-Based Access',
            ].map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
