"use client";

import React, { useState, useEffect } from "react";
import {
  Save,
  Globe,
  DollarSign,
  Mail,
  ImageIcon,
  Shield,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { usePlatformSettings } from "@/lib/hooks/use-admin";

export default function AdminSettingsPage() {
  const { settings: fetchedSettings, isLoading, updatePlatformSettings } = usePlatformSettings();

  const [settings, setSettings] = useState({
    platformName: "",
    platformFeePercent: 2.5,
    supportEmail: "",
    logoUrl: "",
  });

  const [saved, setSaved] = useState(false);

  // Sync local state when fetched settings arrive
  useEffect(() => {
    if (fetchedSettings) {
      setSettings({
        platformName: fetchedSettings.platformName ?? "",
        platformFeePercent: (fetchedSettings.platformFee ?? 2.5),
        supportEmail: fetchedSettings.supportEmail ?? "",
        logoUrl: (fetchedSettings as Record<string, unknown>).logoUrl as string ?? "",
      });
    }
  }, [fetchedSettings]);

  const updateField = (field: string, value: string | number) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    await updatePlatformSettings({
      platformName: settings.platformName,
      platformFee: settings.platformFeePercent,
      supportEmail: settings.supportEmail,
      logoUrl: settings.logoUrl,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-slate-400">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Platform Settings
          </h1>
          <p className="text-slate-400">
            Configure global platform settings.
          </p>
        </div>
        <Button
          className="gap-2 bg-purple-600 hover:bg-purple-700 self-start"
          onClick={handleSave}
        >
          <Save className="h-4 w-4" />
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      {/* Platform identity */}
      <Card className="border-slate-800 bg-slate-900">
        <CardHeader>
          <CardTitle className="text-base text-white flex items-center gap-2">
            <Globe className="h-4 w-4 text-purple-400" />
            Platform Identity
          </CardTitle>
          <CardDescription className="text-slate-400">
            Core branding and identity for the platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-slate-300">Platform Name</Label>
              <Input
                value={settings.platformName}
                onChange={(e) => updateField("platformName", e.target.value)}
                className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
              />
              <p className="text-xs text-slate-500">
                Displayed throughout the platform and in emails.
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Platform Logo URL</Label>
              <Input
                value={settings.logoUrl}
                onChange={(e) => updateField("logoUrl", e.target.value)}
                placeholder="https://..."
                className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
              />
              <p className="text-xs text-slate-500">
                Used in the header, emails, and public pages.
              </p>
            </div>
          </div>

          {/* Preview */}
          <div className="rounded-lg border border-slate-700 p-6">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">
              Preview
            </p>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-600 text-white font-bold">
                {settings.logoUrl ? (
                  <ImageIcon className="h-5 w-5" />
                ) : (
                  settings.platformName.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {settings.platformName || "Platform Name"}
                </h3>
                <p className="text-xs text-slate-400">
                  Order from the best local restaurants
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial settings */}
      <Card className="border-slate-800 bg-slate-900">
        <CardHeader>
          <CardTitle className="text-base text-white flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-400" />
            Financial Settings
          </CardTitle>
          <CardDescription className="text-slate-400">
            Platform commission and fee configuration.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-w-sm space-y-2">
            <Label className="text-slate-300">Platform Fee (%)</Label>
            <Input
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={settings.platformFeePercent}
              onChange={(e) =>
                updateField(
                  "platformFeePercent",
                  parseFloat(e.target.value) || 0
                )
              }
              className="border-slate-700 bg-slate-800 text-white"
            />
            <p className="text-xs text-slate-500">
              Percentage of each order that goes to the platform. Currently set
              to {settings.platformFeePercent}%.
            </p>
          </div>

          <Separator className="bg-slate-700" />

          <div className="rounded-lg border border-slate-700 p-4">
            <h4 className="text-sm font-medium text-white mb-3">
              Fee Calculation Example
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Order Total</span>
                <span className="text-white">$100.00</span>
              </div>
              <div className="flex justify-between">
                <span>
                  Platform Fee ({settings.platformFeePercent}%)
                </span>
                <span className="text-purple-400">
                  ${(100 * (settings.platformFeePercent / 100)).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Restaurant Receives</span>
                <span className="text-green-400">
                  $
                  {(100 - 100 * (settings.platformFeePercent / 100)).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <Separator className="bg-slate-700" />

          <div className="rounded-lg border border-slate-700 p-4">
            <h4 className="text-sm font-medium text-white mb-2">
              Fee Comparison
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Fed (You)</span>
                <span className="font-medium text-green-400">
                  {settings.platformFeePercent}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Toast</span>
                <span className="text-slate-300">2.99% + $0.15</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Square</span>
                <span className="text-slate-300">2.6% + $0.10</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Olo</span>
                <span className="text-slate-300">3%+ per order</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support */}
      <Card className="border-slate-800 bg-slate-900">
        <CardHeader>
          <CardTitle className="text-base text-white flex items-center gap-2">
            <Mail className="h-4 w-4 text-blue-400" />
            Support
          </CardTitle>
          <CardDescription className="text-slate-400">
            Contact information for platform support.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-w-sm space-y-2">
            <Label className="text-slate-300">Support Email</Label>
            <Input
              type="email"
              value={settings.supportEmail}
              onChange={(e) => updateField("supportEmail", e.target.value)}
              className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
            />
            <p className="text-xs text-slate-500">
              Displayed on help pages and in transactional emails.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-red-500/30 bg-slate-900">
        <CardHeader>
          <CardTitle className="text-base text-red-400 flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Danger Zone
          </CardTitle>
          <CardDescription className="text-slate-400">
            Irreversible actions that affect the entire platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-red-500/20 p-4">
            <div>
              <p className="text-sm font-medium text-white">
                Reset Platform Data
              </p>
              <p className="text-xs text-slate-400">
                This will permanently delete all orders, reviews, and analytics
                data. Restaurant and user accounts will be preserved.
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              className="shrink-0"
              disabled
            >
              Reset Data
            </Button>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-red-500/20 p-4">
            <div>
              <p className="text-sm font-medium text-white">
                Maintenance Mode
              </p>
              <p className="text-xs text-slate-400">
                Put the entire platform into maintenance mode. All ordering will
                be paused and a maintenance page will be shown.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
            >
              Enable
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
