"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Lock, Eye, Database, UserCheck, FileText } from "lucide-react";

export default function PrivacyPolicyModal() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-foreground/50 hover:text-foreground/80 transition-colors underline">
          Privacy Policy
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Shield className="h-6 w-6 text-green-600" />
            Privacy Policy
          </DialogTitle>
          <DialogDescription>
            Last updated: December 13, 2025
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <Card className="border-l-4 border-l-green-600 animate-in slide-in-from-bottom-4 duration-500">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Database className="h-5 w-5 text-green-600 mt-1 shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Data Collection</h3>
                  <p className="text-sm text-muted-foreground">
                    We collect only essential information necessary for election administration: 
                    student IDs, email addresses, and voting records. All data is encrypted and 
                    stored securely in compliance with educational data protection standards.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-600 animate-in slide-in-from-bottom-4 duration-500 delay-100">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 text-blue-600 mt-1 shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Data Security</h3>
                  <p className="text-sm text-muted-foreground">
                    Your votes are encrypted end-to-end and stored anonymously. We implement 
                    industry-standard security measures including SSL/TLS encryption, secure 
                    authentication, and regular security audits to protect your information.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-600 animate-in slide-in-from-bottom-4 duration-500 delay-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Eye className="h-5 w-5 text-purple-600 mt-1 shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Vote Privacy</h3>
                  <p className="text-sm text-muted-foreground">
                    Your individual voting choices are completely private and anonymous. No one, 
                    including administrators, can trace a vote back to a specific voter. We only 
                    track whether you have voted, not how you voted.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-600 animate-in slide-in-from-bottom-4 duration-500 delay-300">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <UserCheck className="h-5 w-5 text-orange-600 mt-1 shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Your Rights</h3>
                  <p className="text-sm text-muted-foreground">
                    You have the right to access your voter registration data, request corrections, 
                    and withdraw consent at any time. Contact your election administrator for data 
                    access requests or privacy concerns.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-600 animate-in slide-in-from-bottom-4 duration-500 delay-400">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-red-600 mt-1 shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Data Retention</h3>
                  <p className="text-sm text-muted-foreground">
                    Election data is retained for audit purposes as required by your institution's 
                    policies. Voting records are anonymized immediately after voting closes. 
                    Personal information is deleted according to educational record retention schedules.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 p-4 bg-muted rounded-lg animate-in fade-in duration-500 delay-500">
            <p className="text-sm text-muted-foreground">
              <strong>Questions?</strong> If you have any questions about our privacy practices or 
              how we handle your data, please contact your election administrator or the system 
              administrator at your institution.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
