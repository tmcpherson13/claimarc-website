import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import EobConversionPage from "./pages/EobConversionPage";
import EraProcessingPage from "./pages/EraProcessingPage";
import AcceleratorPage from "./pages/AcceleratorPage";
import WhyClaimArcPage from "./pages/WhyClaimArcPage";
import LeadershipPage from "./pages/LeadershipPage";
import ContactPage from "./pages/ContactPage";
import InsightsIndex from "./pages/InsightsIndex";
import InsightsDetail from "./pages/InsightsDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/eob-conversion" element={<EobConversionPage />} />
          <Route path="/era-processing" element={<EraProcessingPage />} />
          <Route path="/accelerator" element={<AcceleratorPage />} />
          <Route path="/why-claimarc" element={<WhyClaimArcPage />} />
          <Route path="/leadership" element={<LeadershipPage />} />
          <Route path="/insights" element={<InsightsIndex />} />
          <Route path="/insights/:slug" element={<InsightsDetail />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Legacy ZDefense paths → closest ClaimARC equivalent */}
          <Route path="/platform" element={<Navigate to="/why-claimarc" replace />} />
          <Route path="/why-zdefense" element={<Navigate to="/why-claimarc" replace />} />
          <Route path="/solutions" element={<Navigate to="/why-claimarc" replace />} />
          <Route path="/workflows" element={<Navigate to="/why-claimarc" replace />} />
          <Route path="/pricing" element={<Navigate to="/contact" replace />} />
          <Route path="/about" element={<Navigate to="/why-claimarc" replace />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
