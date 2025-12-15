import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ResponsiveNav } from "@/components/responsive-nav";
import { MobileFAB } from "@/components/mobile-fab";
import { Footer } from "@/components/footer";
import { clientStorage } from "@/lib/storage";
import Home from "@/pages/home";
import MainPage from "@/pages/main";
import SearchPage from "@/pages/search";
import ComparePage from "@/pages/compare";
import ToolsPage from "@/pages/tools";
import RecentComparisonsPage from "@/pages/recent-comparisons";
import HelpPage from "@/pages/help";
import AboutPage from "@/pages/about";
import HowItWorksPage from "@/pages/how-it-works";
import PrivacyPage from "@/pages/privacy";
import LanguageSelection from "@/pages/language-selection";
import ComparisonResults from "@/pages/comparison-results";
import TermsOfServicePage from "@/pages/terms-of-service";
import ContactUsPage from "@/pages/contact-us";
import ReportIssuesPage from "@/pages/report-issues";
import ComparisonLoading from "@/pages/comparison-loading";
import BillingPage from "@/pages/billing";
import BillingSuccessPage from "@/pages/billing-success";
import BillingCancelPage from "@/pages/billing-cancel";
import NotFound from "@/pages/not-found";

function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    // Scroll to top when route changes
    window.scrollTo(0, 0);
  }, [location]);
  
  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={MainPage} />
        <Route path="/home" component={Home} />
        <Route path="/search" component={SearchPage} />
        <Route path="/compare" component={ComparePage} />
        <Route path="/tools" component={ToolsPage} />
        <Route path="/recent" component={RecentComparisonsPage} />
        <Route path="/help" component={HelpPage} />
        <Route path="/about" component={AboutPage} />
        <Route path="/how-it-works" component={HowItWorksPage} />
        <Route path="/privacy" component={PrivacyPage} />
        <Route path="/select-languages" component={LanguageSelection} />
        <Route path="/comparison-loading" component={ComparisonLoading} />
        <Route path="/results/:id" component={ComparisonResults} />
        <Route path="/terms-of-service" component={TermsOfServicePage} />
        <Route path="/contact-us" component={ContactUsPage} />
        <Route path="/report-issues" component={ReportIssuesPage} />
        <Route path="/billing" component={BillingPage} />
        <Route path="/billing/success" component={BillingSuccessPage} />
        <Route path="/billing/cancel" component={BillingCancelPage} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  useEffect(() => {
    // Initialize client storage on app startup
    clientStorage.getCurrentUser().catch(console.error);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <ResponsiveNav />
          
          <div className="desktop-content">
            <main className="pt-16 lg:pt-20 pb-16 lg:pb-8 px-4 lg:px-6 min-h-screen">
              <div className="max-w-7xl mx-auto">
                <Router />
              </div>
            </main>
          </div>
          
          <MobileFAB />
          <Footer />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
