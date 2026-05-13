import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <div className="relative flex min-h-screen flex-col">
    {/* Global animated gradient mesh + precision grid */}
    <div aria-hidden="true" className="mesh-bg" />
    <div aria-hidden="true" className="grid-overlay" />
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

export default Layout;
