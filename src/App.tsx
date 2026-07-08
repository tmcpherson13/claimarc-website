import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import EobConversionPage from "./pages/EobConversionPage";
import EraProcessingPage from "./pages/EraProcessingPage";
import AcceleratorPage from "./pages/AcceleratorPage";
import ContractIntelligencePage from "./pages/ContractIntelligencePage";
import WhyClaimArcPage from "./pages/WhyClaimArcPage";
import OurStoryPage from "./pages/OurStoryPage";
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
      <Analytics />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/eob-conversion" element={<EobConversionPage />} />
          <Route path="/era-processing" element={<EraProcessingPage />} />
          <Route path="/accelerator" element={<AcceleratorPage />} />
          <Route path="/contract-intelligence" element={<ContractIntelligencePage />} />
          <Route path="/why-claimarc" element={<WhyClaimArcPage />} />
          <Route path="/our-story" element={<OurStoryPage />} />
          <Route path="/insights" element={<InsightsIndex />} />
          <Route path="/insights/:slug" element={<InsightsDetail />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Legacy short-link redirects */}
          <Route path="/pricing" element={<Navigate to="/contact" replace />} />
          <Route path="/about" element={<Navigate to="/why-claimarc" replace />} />
          <Route path="/leadership" element={<Navigate to="/our-story" replace />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
