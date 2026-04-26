import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import PlatformPage from "./pages/PlatformPage.tsx";
import WhyZDefensePage from "./pages/WhyZDefensePage.tsx";
import SolutionsPage from "./pages/SolutionsPage.tsx";
import PricingPage from "./pages/PricingPage.tsx";
import ContactPage from "./pages/ContactPage.tsx";
import WorkflowsPage from "./pages/WorkflowsPage.tsx";
import NotFound from "./pages/NotFound.tsx";
import ScrollToTop from "./components/ScrollToTop";
import InsightsPage from "./pages/InsightsPage.tsx";
import BlogPostPage from "./pages/BlogPostPage.tsx";
import WhitePaperPage from "./pages/WhitePaperPage.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminContentList from "./pages/admin/AdminContentList.tsx";
import AdminContentEditor from "./pages/admin/AdminContentEditor.tsx";
import AdminAssets from "./pages/admin/AdminAssets.tsx";
import AdminLogin from "./pages/admin/AdminLogin.tsx";
import AdminProfile from "./pages/admin/AdminProfile.tsx";
import AdminAboutPage from "./pages/admin/AdminAboutPage.tsx";
import AdminUsers from "./pages/admin/AdminUsers.tsx";
import AboutPage from "./pages/AboutPage.tsx";
import { ChatbotProvider } from "./context/ChatbotContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ChatbotProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/platform" element={<PlatformPage />} />
            <Route path="/why-zdefense" element={<WhyZDefensePage />} />
            <Route path="/solutions" element={<SolutionsPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/workflows" element={<WorkflowsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/blog" element={<InsightsPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/white-papers" element={<Navigate to="/blog?type=white_paper" replace />} />
            <Route path="/white-papers/:slug" element={<WhitePaperPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/content" element={<AdminContentList />} />
            <Route path="/admin/content/new" element={<AdminContentEditor />} />
            <Route path="/admin/content/:id" element={<AdminContentEditor />} />
            <Route path="/admin/assets" element={<AdminAssets />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
            <Route path="/admin/about" element={<AdminAboutPage />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            {/* Legacy redirects */}
            <Route path="/admin/blog" element={<Navigate to="/admin/content" replace />} />
            <Route path="/admin/blog/new" element={<Navigate to="/admin/content/new?type=blog" replace />} />
            <Route path="/admin/blog/:id" element={<Navigate to="/admin/content" replace />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ChatbotProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
