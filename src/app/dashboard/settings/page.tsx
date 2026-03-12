"use client";

import React, { useState } from "react";
import {
  Save,
  Store,
  MapPin,
  Clock,
  Palette,
  CreditCard,
  Settings2,
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// --- Mock data ---

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const initialHours = {
  Monday: { open: "11:00", close: "22:00", closed: false },
  Tuesday: { open: "11:00", close: "22:00", closed: false },
  Wednesday: { open: "11:00", close: "22:00", closed: false },
  Thursday: { open: "11:00", close: "22:00", closed: false },
  Friday: { open: "11:00", close: "23:00", closed: false },
  Saturday: { open: "10:00", close: "23:00", closed: false },
  Sunday: { open: "10:00", close: "21:00", closed: false },
};

export default function SettingsPage() {
  const [restaurant, setRestaurant] = useState({
    name: "The Golden Fork",
    description: "Contemporary American cuisine with a farm-to-table philosophy. Fresh, seasonal ingredients prepared with passion.",
    phone: "(555) 234-5678",
    email: "hello@thegoldenfork.com",
    website: "https://thegoldenfork.com",
  });

  const [address, setAddress] = useState({
    line1: "123 Main Street",
    line2: "Suite 100",
    city: "New York",
    state: "NY",
    zip: "10001",
  });

  const [hours, setHours] = useState(initialHours);

  const [branding, setBranding] = useState({
    logoUrl: "",
    bannerUrl: "",
    primaryColor: "#E63946",
    secondaryColor: "#1D3557",
    accentColor: "#F4A261",
    fontFamily: "Inter",
  });

  const [orderSettings, setOrderSettings] = useState({
    taxRate: 8.75,
    serviceFee: 0,
    minOrderAmount: 15,
    estimatedPrepTime: 20,
  });

  const [toggles, setToggles] = useState({
    isActive: true,
    acceptsOrders: true,
  });

  const updateHour = (day: string, field: "open" | "close", value: string) => {
    setHours((prev) => ({
      ...prev,
      [day]: { ...prev[day as keyof typeof prev], [field]: value },
    }));
  };

  const toggleClosed = (day: string) => {
    setHours((prev) => ({
      ...prev,
      [day]: { ...prev[day as keyof typeof prev], closed: !prev[day as keyof typeof prev].closed },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your restaurant profile and preferences.
          </p>
        </div>
        <Button className="gap-2 self-start">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="general" className="gap-2">
            <Store className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="hours" className="gap-2">
            <Clock className="h-4 w-4" />
            Hours
          </TabsTrigger>
          <TabsTrigger value="branding" className="gap-2">
            <Palette className="h-4 w-4" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="orders" className="gap-2">
            <Settings2 className="h-4 w-4" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="payments" className="gap-2">
            <CreditCard className="h-4 w-4" />
            Payments
          </TabsTrigger>
        </TabsList>

        {/* General */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Store className="h-4 w-4" />
                Restaurant Information
              </CardTitle>
              <CardDescription>
                Basic details about your restaurant visible to customers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="r-name">Restaurant Name</Label>
                  <Input
                    id="r-name"
                    value={restaurant.name}
                    onChange={(e) =>
                      setRestaurant({ ...restaurant, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="r-phone">Phone</Label>
                  <Input
                    id="r-phone"
                    value={restaurant.phone}
                    onChange={(e) =>
                      setRestaurant({ ...restaurant, phone: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="r-desc">Description</Label>
                <Textarea
                  id="r-desc"
                  value={restaurant.description}
                  onChange={(e) =>
                    setRestaurant({ ...restaurant, description: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="r-email">Email</Label>
                  <Input
                    id="r-email"
                    type="email"
                    value={restaurant.email}
                    onChange={(e) =>
                      setRestaurant({ ...restaurant, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="r-website">Website</Label>
                  <Input
                    id="r-website"
                    value={restaurant.website}
                    onChange={(e) =>
                      setRestaurant({ ...restaurant, website: e.target.value })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Address
              </CardTitle>
              <CardDescription>
                Your restaurant&apos;s physical location.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="a-line1">Street Address</Label>
                <Input
                  id="a-line1"
                  value={address.line1}
                  onChange={(e) =>
                    setAddress({ ...address, line1: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="a-line2">Suite / Unit (optional)</Label>
                <Input
                  id="a-line2"
                  value={address.line2}
                  onChange={(e) =>
                    setAddress({ ...address, line2: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="a-city">City</Label>
                  <Input
                    id="a-city"
                    value={address.city}
                    onChange={(e) =>
                      setAddress({ ...address, city: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="a-state">State</Label>
                  <Input
                    id="a-state"
                    value={address.state}
                    onChange={(e) =>
                      setAddress({ ...address, state: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="a-zip">ZIP Code</Label>
                  <Input
                    id="a-zip"
                    value={address.zip}
                    onChange={(e) =>
                      setAddress({ ...address, zip: e.target.value })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status toggles */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Status</CardTitle>
              <CardDescription>
                Control your restaurant&apos;s visibility and order acceptance.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label className="text-sm font-medium">Restaurant Active</Label>
                  <p className="text-xs text-muted-foreground">
                    When disabled, your restaurant won&apos;t appear in search results
                  </p>
                </div>
                <Switch
                  checked={toggles.isActive}
                  onCheckedChange={(v) =>
                    setToggles({ ...toggles, isActive: v })
                  }
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label className="text-sm font-medium">Accepting Orders</Label>
                  <p className="text-xs text-muted-foreground">
                    Temporarily pause incoming orders without going offline
                  </p>
                </div>
                <Switch
                  checked={toggles.acceptsOrders}
                  onCheckedChange={(v) =>
                    setToggles({ ...toggles, acceptsOrders: v })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Hours */}
        <TabsContent value="hours" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Business Hours
              </CardTitle>
              <CardDescription>
                Set your opening and closing times for each day.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {days.map((day) => {
                  const h = hours[day as keyof typeof hours];
                  return (
                    <div
                      key={day}
                      className="flex items-center gap-4 rounded-lg border p-3"
                    >
                      <span className="w-24 text-sm font-medium">{day}</span>
                      <div className="flex flex-1 items-center gap-3">
                        {h.closed ? (
                          <span className="text-sm text-muted-foreground italic">
                            Closed
                          </span>
                        ) : (
                          <>
                            <Input
                              type="time"
                              value={h.open}
                              onChange={(e) =>
                                updateHour(day, "open", e.target.value)
                              }
                              className="w-32"
                            />
                            <span className="text-sm text-muted-foreground">to</span>
                            <Input
                              type="time"
                              value={h.close}
                              onChange={(e) =>
                                updateHour(day, "close", e.target.value)
                              }
                              className="w-32"
                            />
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-xs text-muted-foreground">
                          Closed
                        </Label>
                        <Switch
                          checked={h.closed}
                          onCheckedChange={() => toggleClosed(day)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Branding */}
        <TabsContent value="branding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Brand Colors
              </CardTitle>
              <CardDescription>
                Customize the look and feel of your restaurant&apos;s page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={branding.primaryColor}
                      onChange={(e) =>
                        setBranding({ ...branding, primaryColor: e.target.value })
                      }
                      className="h-10 w-14 cursor-pointer rounded-md border p-1"
                    />
                    <Input
                      value={branding.primaryColor}
                      onChange={(e) =>
                        setBranding({ ...branding, primaryColor: e.target.value })
                      }
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Secondary Color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={branding.secondaryColor}
                      onChange={(e) =>
                        setBranding({ ...branding, secondaryColor: e.target.value })
                      }
                      className="h-10 w-14 cursor-pointer rounded-md border p-1"
                    />
                    <Input
                      value={branding.secondaryColor}
                      onChange={(e) =>
                        setBranding({ ...branding, secondaryColor: e.target.value })
                      }
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Accent Color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={branding.accentColor}
                      onChange={(e) =>
                        setBranding({ ...branding, accentColor: e.target.value })
                      }
                      className="h-10 w-14 cursor-pointer rounded-md border p-1"
                    />
                    <Input
                      value={branding.accentColor}
                      onChange={(e) =>
                        setBranding({ ...branding, accentColor: e.target.value })
                      }
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Font Family</Label>
                <Select
                  value={branding.fontFamily}
                  onValueChange={(v) =>
                    setBranding({ ...branding, fontFamily: v })
                  }
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="Roboto">Roboto</SelectItem>
                    <SelectItem value="Poppins">Poppins</SelectItem>
                    <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                    <SelectItem value="Lora">Lora</SelectItem>
                    <SelectItem value="Montserrat">Montserrat</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Color preview */}
              <div>
                <Label className="mb-3 block">Preview</Label>
                <div
                  className="rounded-lg border p-6"
                  style={{
                    fontFamily: branding.fontFamily,
                  }}
                >
                  <div
                    className="mb-3 h-2 w-full rounded-full"
                    style={{ backgroundColor: branding.primaryColor }}
                  />
                  <h3
                    className="text-lg font-bold mb-1"
                    style={{ color: branding.secondaryColor }}
                  >
                    {restaurant.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Preview of your brand colors applied to your page.
                  </p>
                  <button
                    className="rounded-md px-4 py-2 text-sm font-medium text-white"
                    style={{ backgroundColor: branding.primaryColor }}
                  >
                    Order Now
                  </button>
                  <button
                    className="ml-2 rounded-md px-4 py-2 text-sm font-medium text-white"
                    style={{ backgroundColor: branding.accentColor }}
                  >
                    View Menu
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Images</CardTitle>
              <CardDescription>
                Upload your logo and banner images.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="logo-url">Logo URL</Label>
                  <Input
                    id="logo-url"
                    value={branding.logoUrl}
                    onChange={(e) =>
                      setBranding({ ...branding, logoUrl: e.target.value })
                    }
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="banner-url">Banner URL</Label>
                  <Input
                    id="banner-url"
                    value={branding.bannerUrl}
                    onChange={(e) =>
                      setBranding({ ...branding, bannerUrl: e.target.value })
                    }
                    placeholder="https://..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Order Settings */}
        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Settings2 className="h-4 w-4" />
                Order Configuration
              </CardTitle>
              <CardDescription>
                Set tax rates, fees, and timing for orders.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                  <Input
                    id="tax-rate"
                    type="number"
                    step="0.01"
                    value={orderSettings.taxRate}
                    onChange={(e) =>
                      setOrderSettings({
                        ...orderSettings,
                        taxRate: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Applied to all orders automatically
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="service-fee">Service Fee ($)</Label>
                  <Input
                    id="service-fee"
                    type="number"
                    step="0.01"
                    value={orderSettings.serviceFee}
                    onChange={(e) =>
                      setOrderSettings({
                        ...orderSettings,
                        serviceFee: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Fixed fee added to each order
                  </p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="min-order">Minimum Order Amount ($)</Label>
                  <Input
                    id="min-order"
                    type="number"
                    step="0.01"
                    value={orderSettings.minOrderAmount}
                    onChange={(e) =>
                      setOrderSettings({
                        ...orderSettings,
                        minOrderAmount: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prep-time">Estimated Prep Time (minutes)</Label>
                  <Input
                    id="prep-time"
                    type="number"
                    value={orderSettings.estimatedPrepTime}
                    onChange={(e) =>
                      setOrderSettings({
                        ...orderSettings,
                        estimatedPrepTime: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments */}
        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payment Processing
              </CardTitle>
              <CardDescription>
                Connect your Stripe account to receive payments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-dashed p-8 text-center">
                <CreditCard className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Connect Stripe Account
                </h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                  To accept payments, you need to connect a Stripe account. This
                  allows secure processing of credit card, Apple Pay, and Google
                  Pay transactions.
                </p>
                <Button className="gap-2">
                  <CreditCard className="h-4 w-4" />
                  Connect with Stripe
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
