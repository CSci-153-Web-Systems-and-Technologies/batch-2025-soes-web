"use client";

import { useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { User, Bell, Shield, Database, Mail, Key } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [systemNotifications, setSystemNotifications] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);

  const handleSaveProfile = () => {
    toast.success("Profile settings saved successfully");
  };

  const handleSaveNotifications = () => {
    toast.success("Notification preferences updated");
  };

  const handleSaveSecurity = () => {
    toast.success("Security settings updated");
  };

  const handleChangePassword = () => {
    toast.success("Password change request sent");
  };

  const handleBackupData = () => {
    toast.success("Data backup initiated");
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Profile Settings</CardTitle>
          </div>
          <CardDescription>
            Update your personal information and profile details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" placeholder="Enter your full name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="your@email.com" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="organization">Organization</Label>
            <Input id="organization" placeholder="Your organization name" />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSaveProfile}>Save Profile</Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Notification Preferences</CardTitle>
          </div>
          <CardDescription>
            Choose how you want to receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive email updates about elections and system events
              </p>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>System Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Get in-app notifications for important updates
              </p>
            </div>
            <Switch
              checked={systemNotifications}
              onCheckedChange={setSystemNotifications}
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSaveNotifications}>Save Preferences</Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Security</CardTitle>
          </div>
          <CardDescription>
            Manage your security settings and password
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch
              checked={twoFactorAuth}
              onCheckedChange={setTwoFactorAuth}
            />
          </div>
          <Separator />
          <div className="space-y-2">
            <Label>Change Password</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Update your password to keep your account secure
            </p>
            <Button
              variant="outline"
              onClick={handleChangePassword}
              className="w-full md:w-auto"
            >
              <Key className="h-4 w-4 mr-2" />
              Change Password
            </Button>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSaveSecurity}>Save Security Settings</Button>
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-muted-foreground" />
            <CardTitle>System & Data</CardTitle>
          </div>
          <CardDescription>
            Manage system settings and data backup
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Automatic Backups</Label>
              <p className="text-sm text-muted-foreground">
                Automatically backup election data daily
              </p>
            </div>
            <Switch checked={autoBackup} onCheckedChange={setAutoBackup} />
          </div>
          <Separator />
          <div className="space-y-2">
            <Label>Manual Backup</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Create a backup of all election data and settings
            </p>
            <Button
              variant="outline"
              onClick={handleBackupData}
              className="w-full md:w-auto"
            >
              <Database className="h-4 w-4 mr-2" />
              Backup Data Now
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Support */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Support</CardTitle>
          </div>
          <CardDescription>Get help and contact support team</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Need Help?</Label>
            <p className="text-sm text-muted-foreground">
              Contact our support team for assistance with the election system
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              Documentation
            </Button>
            <Button variant="outline" className="flex-1">
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
