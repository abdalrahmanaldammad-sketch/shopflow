import { useState } from 'react';
import { useCurrentUser, useLogoutAll } from '@/hooks/useAuth';
import {
  useMfaSetup,
  useMfaVerifySetup,
  useMfaDisable,
  useMfaRegenerateRecoveryCodes,
} from '@/hooks/useMfa';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import {
  ShieldCheck,
  ShieldAlert,
  QrCode,
  Copy,
  Check,
  KeyRound,
  LogOut,
  AlertTriangle,
} from 'lucide-react';
import type { MfaSetupResponse } from '@/types';

function RecoveryCodesDisplay({ codes }: { codes: string[] }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codes.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
        <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
        <p className="text-xs text-amber-300">
          Save these codes in a secure place. They will not be shown again.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {codes.map((code) => (
          <div
            key={code}
            className="px-3 py-2 rounded-md bg-muted text-center font-mono text-sm"
          >
            {code}
          </div>
        ))}
      </div>
      <Button variant="outline" size="sm" onClick={handleCopy} className="w-full">
        {copied ? (
          <>
            <Check className="h-4 w-4 mr-2" /> Copied!
          </>
        ) : (
          <>
            <Copy className="h-4 w-4 mr-2" /> Copy All Codes
          </>
        )}
      </Button>
    </div>
  );
}

export function SettingsPage() {
  const { data: user } = useCurrentUser();
  const logoutAll = useLogoutAll();
  const mfaSetup = useMfaSetup();
  const mfaVerifySetup = useMfaVerifySetup();
  const mfaDisable = useMfaDisable();
  const mfaRegenCodes = useMfaRegenerateRecoveryCodes();

  const [setupData, setSetupData] = useState<MfaSetupResponse | null>(null);
  const [setupCode, setSetupCode] = useState('');
  const [disableCode, setDisableCode] = useState('');
  const [regenCode, setRegenCode] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);
  const [regenRecoveryCodes, setRegenRecoveryCodes] = useState<string[] | null>(null);
  const [showSetup, setShowSetup] = useState(false);
  const [showDisable, setShowDisable] = useState(false);
  const [showRegen, setShowRegen] = useState(false);

  if (!user) return null;

  const handleStartSetup = () => {
    mfaSetup.mutate(undefined, {
      onSuccess: (response) => {
        setSetupData(response.data.data);
        setShowSetup(true);
        setSetupCode('');
        setRecoveryCodes(null);
      },
    });
  };

  const handleVerifySetup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!setupData?.secret) return;
    mfaVerifySetup.mutate(
      { secret: setupData.secret, code: setupCode },
      {
        onSuccess: (response) => {
          setRecoveryCodes(response.data.data.recoveryCodes);
          setSetupData(null);
          setSetupCode('');
        },
      }
    );
  };

  const handleDisable = (e: React.FormEvent) => {
    e.preventDefault();
    mfaDisable.mutate(disableCode, {
      onSuccess: () => {
        setShowDisable(false);
        setDisableCode('');
      },
    });
  };

  const handleRegenCodes = (e: React.FormEvent) => {
    e.preventDefault();
    mfaRegenCodes.mutate(regenCode, {
      onSuccess: (response) => {
        setRegenRecoveryCodes(response.data.data);
        setRegenCode('');
      },
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold">Security Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account security and authentication methods
          </p>
        </div>

        {/* MFA Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {user.mfaEnabled ? (
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                ) : (
                  <ShieldAlert className="h-5 w-5 text-amber-400" />
                )}
                <div>
                  <CardTitle className="text-lg">Two-Factor Authentication</CardTitle>
                  <CardDescription>
                    {user.mfaEnabled
                      ? 'Your account is protected with 2FA'
                      : 'Add an extra layer of security to your account'}
                  </CardDescription>
                </div>
              </div>
              <Badge variant={user.mfaEnabled ? 'success' : 'destructive'}>
                {user.mfaEnabled ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* MFA is OFF — show setup flow */}
            {!user.mfaEnabled && !showSetup && !recoveryCodes && (
              <Button onClick={handleStartSetup} disabled={mfaSetup.isPending}>
                {mfaSetup.isPending ? (
                  <Spinner size={18} className="text-white mr-2" />
                ) : (
                  <QrCode className="h-4 w-4 mr-2" />
                )}
                Enable Two-Factor Authentication
              </Button>
            )}

            {/* Step 1: Show QR code */}
            {showSetup && setupData && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50 border border-border text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Scan this QR code with Google Authenticator or Microsoft Authenticator:
                  </p>
                  {setupData.qrCodeUri && (
                    <img
                      src={setupData.qrCodeUri}
                      alt="QR Code"
                      className="mx-auto w-48 h-48 rounded-lg"
                    />
                  )}
                  <div className="mt-4 space-y-1">
                    <p className="text-xs text-muted-foreground">Or enter this secret manually:</p>
                    <code className="text-xs bg-muted px-3 py-1 rounded font-mono break-all">
                      {setupData.secret}
                    </code>
                  </div>
                </div>

                <form onSubmit={handleVerifySetup} className="space-y-3">
                  <Label htmlFor="setupCode">Enter the 6-digit code to verify</Label>
                  <Input
                    id="setupCode"
                    placeholder="000000"
                    value={setupCode}
                    onChange={(e) => setSetupCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    className="text-center text-lg tracking-widest font-mono"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      disabled={mfaVerifySetup.isPending || setupCode.length !== 6}
                      className="flex-1"
                    >
                      {mfaVerifySetup.isPending ? (
                        <Spinner size={18} className="text-white" />
                      ) : (
                        'Verify & Enable'
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowSetup(false);
                        setSetupData(null);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 2: Show recovery codes after successful setup */}
            {recoveryCodes && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-400">
                  <ShieldCheck className="h-5 w-5" />
                  <p className="font-medium">MFA enabled successfully!</p>
                </div>
                <RecoveryCodesDisplay codes={recoveryCodes} />
                <Button
                  variant="outline"
                  onClick={() => setRecoveryCodes(null)}
                  className="w-full"
                >
                  I've saved my recovery codes
                </Button>
              </div>
            )}

            {/* MFA is ON — show disable & regen options */}
            {user.mfaEnabled && !recoveryCodes && (
              <div className="space-y-4">
                <Separator />

                {/* Regenerate recovery codes */}
                {!showRegen && !regenRecoveryCodes && (
                  <Button
                    variant="outline"
                    onClick={() => setShowRegen(true)}
                    className="w-full justify-start"
                  >
                    <KeyRound className="h-4 w-4 mr-2" />
                    Regenerate Recovery Codes
                  </Button>
                )}

                {showRegen && !regenRecoveryCodes && (
                  <form onSubmit={handleRegenCodes} className="space-y-3 p-4 rounded-lg border border-border">
                    <Label>Enter TOTP code to regenerate recovery codes</Label>
                    <Input
                      placeholder="000000"
                      value={regenCode}
                      onChange={(e) => setRegenCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      maxLength={6}
                      className="text-center font-mono"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        disabled={mfaRegenCodes.isPending || regenCode.length !== 6}
                        className="flex-1"
                      >
                        {mfaRegenCodes.isPending ? <Spinner size={18} className="text-white" /> : 'Regenerate'}
                      </Button>
                      <Button variant="outline" type="button" onClick={() => setShowRegen(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}

                {regenRecoveryCodes && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium">New recovery codes:</p>
                    <RecoveryCodesDisplay codes={regenRecoveryCodes} />
                    <Button
                      variant="outline"
                      onClick={() => { setRegenRecoveryCodes(null); setShowRegen(false); }}
                      className="w-full"
                    >
                      Done
                    </Button>
                  </div>
                )}

                <Separator />

                {/* Disable MFA */}
                {!showDisable ? (
                  <Button
                    variant="outline"
                    onClick={() => setShowDisable(true)}
                    className="w-full justify-start text-destructive hover:text-destructive"
                  >
                    <ShieldAlert className="h-4 w-4 mr-2" />
                    Disable Two-Factor Authentication
                  </Button>
                ) : (
                  <form onSubmit={handleDisable} className="space-y-3 p-4 rounded-lg border border-destructive/30 bg-destructive/5">
                    <Label>Enter TOTP code to disable MFA</Label>
                    <Input
                      placeholder="000000"
                      value={disableCode}
                      onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      maxLength={6}
                      className="text-center font-mono"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        variant="destructive"
                        disabled={mfaDisable.isPending || disableCode.length !== 6}
                        className="flex-1"
                      >
                        {mfaDisable.isPending ? <Spinner size={18} className="text-white" /> : 'Disable MFA'}
                      </Button>
                      <Button variant="outline" type="button" onClick={() => setShowDisable(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Danger zone */}
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Actions here affect all your sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="text-destructive hover:text-destructive"
              onClick={() => logoutAll.mutate()}
              disabled={logoutAll.isPending}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out of All Devices
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
