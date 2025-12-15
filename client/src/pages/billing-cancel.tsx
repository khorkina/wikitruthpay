import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";

export default function BillingCancelPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="container max-w-md mx-auto py-16 px-4">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-muted flex items-center justify-center">
            <X className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle>Payment Cancelled</CardTitle>
          <CardDescription>
            Your payment was cancelled. No charges were made.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            className="w-full" 
            onClick={() => setLocation("/billing")}
            data-testid="button-try-again"
          >
            Try Again
          </Button>
          <Button 
            variant="outline"
            className="w-full" 
            onClick={() => setLocation("/")}
            data-testid="button-back-home"
          >
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
