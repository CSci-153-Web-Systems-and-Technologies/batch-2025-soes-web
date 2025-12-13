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
import { Textarea } from "@/components/ui/textarea";
import {
  Bell,
  Shield,
  Database,
  Mail,
  Key,
  AlertTriangle,
  Bug,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [systemNotifications, setSystemNotifications] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);

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

  const handleDeleteAccount = async () => {
    // TODO: Implement account deletion with Supabase
    toast.error("Account deletion is not yet implemented", {
      description: "This feature will be available soon.",
    });
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
            <Button
              onClick={handleSaveNotifications}
              className="bg-green-700 hover:bg-green-800 text-white"
            >
              Save Preferences
            </Button>
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
            <Button
              onClick={handleSaveSecurity}
              className="bg-green-700 hover:bg-green-800 text-white"
            >
              Save Security Settings
            </Button>
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
          <div className="flex flex-col sm:flex-row gap-2">
            <Button className="flex-1 bg-green-700 hover:bg-green-800 text-white">
              <Mail className="h-4 w-4 mr-2" />
              Documentation
            </Button>
            <Button className="flex-1 bg-green-700 hover:bg-green-800 text-white">
              <Mail className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
            <Button
              className="flex-1 bg-green-700 hover:bg-green-800 text-white"
              onClick={() => {
                window.location.href =
                  "mailto:studentorganizationelectionsys@gmail.com?subject=Bug Report&body=Please describe the bug you encountered:";
              }}
            >
              <Bug className="h-4 w-4 mr-2" />
              Report a Bug
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <CardTitle className="text-red-600 dark:text-red-400">
              Danger Zone
            </CardTitle>
          </div>
          <CardDescription>
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-red-600 dark:text-red-400">
              Delete Account
            </Label>
            <p className="text-sm text-muted-foreground">
              Once you delete your account, there is no going back. This will
              permanently delete your account and remove all your data from our
              servers.
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full sm:w-auto">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove all your data from our servers,
                  including:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Your profile information</li>
                    <li>All elections you created</li>
                    <li>Voting records and results</li>
                    <li>All settings and preferences</li>
                  </ul>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Yes, delete my account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
