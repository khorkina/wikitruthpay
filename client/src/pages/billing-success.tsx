import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";

export default function BillingSuccessPage() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<"loading" | "success" | "pending">("loading");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("orderId");

    if (orderId) {
      fetch(`/api/billing/verify?orderId=${orderId}`)
        .then(res => res.json())
        .then(data => {
          if (data.status === "completed" || data.status === "success") {
            setStatus("success");
          } else {
            setStatus("pending");
          }
        })
        .catch(() => setStatus("pending"));
    } else {
      setStatus("success");
    }
  }, []);

  if (status === "loading") {
    return (
      <div className="container max-w-md mx-auto py-16 px-4 text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground">Verifying payment...</p>
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto py-16 px-4">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
            <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle>
            {status === "success" ? "Payment Successful!" : "Payment Processing"}
          </CardTitle>
          <CardDescription>
            {status === "success" 
              ? "Welcome to WikiTruth Premium! You now have unlimited access."
              : "Your payment is being processed. Premium access will be activated shortly."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            className="w-full" 
            onClick={() => setLocation("/")}
            data-testid="button-continue"
          >
            Continue to WikiTruth
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
