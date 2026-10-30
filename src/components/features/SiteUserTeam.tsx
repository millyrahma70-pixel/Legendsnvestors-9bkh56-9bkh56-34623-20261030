import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Copy, Users } from "lucide-react";

export default function SiteUserTeam() {
  const [copied, setCopied] = useState(false);
  
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const userCode = localStorage.getItem("referralCode") || "USER123";
  const link = `${origin}?ref=${userCode}`;
  
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=216x216&data=${encodeURIComponent(link)}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" /> Invite & Team
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Your Referral Link</p>
            <div className="flex gap-2">
              <Input value={link} readOnly />
              <Button onClick={handleCopy} variant="outline">
                <Copy className="h-4 w-4" />
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>

          <div className="flex justify-center p-4 bg-white rounded-lg w-fit mx-auto">
            <img src={qrUrl} width={216} height={216} alt="Referral QR Code" />
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Share this QR or link to invite friends
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
