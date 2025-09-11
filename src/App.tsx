import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Review from "./pages/Review";
import DemoReview from "./pages/DemoReview";
import ProductionRooms from "./pages/ProductionRooms";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/demo-review" element={<DemoReview />} />
            <Route path="/rooms" element={<ProductionRooms />} />
            <Route path="/search" element={<Search />} />
            <Route path="/earnings" element={<Dashboard />} />
            <Route path="/profile" element={<Dashboard />} />
            <Route path="/coordination" element={<Dashboard />} />
            <Route path="/analytics" element={<Dashboard />} />
            <Route path="/settings" element={<Dashboard />} />
            {/* Legacy routes */}
            <Route path="/review" element={<Review />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
