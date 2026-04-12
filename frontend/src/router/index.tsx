import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Spin } from "antd";

// Public pages
import LandingPage     from "@/pages/public/Landing";
import PricingPage     from "@/pages/public/Pricing";
import SignInPage      from "@/pages/auth/SignIn";
import SignUpPage      from "@/pages/auth/SignUp";

// Dashboard layout + pages
import DashboardLayout from "@/pages/dashboard/Layout";
import DashboardHome   from "@/pages/dashboard/Home";
import GeneratePage    from "@/pages/dashboard/Generate";
import ProposalsPage   from "@/pages/dashboard/Proposals";
import ClientsPage     from "@/pages/dashboard/Clients";
import ClientDetail    from "@/pages/dashboard/ClientDetail";
import ProjectsPage    from "@/pages/dashboard/Projects";
import ProjectDetail   from "@/pages/dashboard/ProjectDetail";
import ContractsPage   from "@/pages/dashboard/Contracts";
import TemplatesPage   from "@/pages/dashboard/Templates";
import PortalsPage     from "@/pages/dashboard/Portals";
import PortalManage    from "@/pages/dashboard/PortalManage";
import AnalyticsPage   from "@/pages/dashboard/Analytics";
import ContentLibrary  from "@/pages/dashboard/ContentLibrary";
import BrandPage       from "@/pages/dashboard/Brand";
import SubscriptionPage from "@/pages/dashboard/Subscription";
import SettingsPage    from "@/pages/dashboard/Settings";

// Public (client-facing) portal
import ClientPortal from "@/pages/portal/ClientPortal";

/** Route guard — redirect to /sign-in if not authed */
function RequireAuth() {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Spin size="large" />
    </div>
  );
  return user ? <Outlet /> : <Navigate to="/sign-in" replace />;
}

/** Redirect authenticated users away from auth pages */
function RedirectIfAuthed() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" replace /> : <Outlet />;
}

export const router = createBrowserRouter([
  // ── Public ────────────────────────────────────────────────
  { path: "/",        element: <LandingPage /> },
  { path: "/pricing", element: <PricingPage /> },

  // ── Auth (redirect away if already signed in) ─────────────
  {
    element: <RedirectIfAuthed />,
    children: [
      { path: "/sign-in", element: <SignInPage /> },
      { path: "/sign-up", element: <SignUpPage /> },
    ],
  },

  // ── Client-facing portal (no auth) ────────────────────────
  { path: "/portal/:token", element: <ClientPortal /> },

  // ── Dashboard (auth required) ─────────────────────────────
  {
    element: <RequireAuth />,
    children: [{
      element: <DashboardLayout />,
      children: [
        { path: "/dashboard",             element: <DashboardHome /> },
        { path: "/generate",              element: <GeneratePage /> },
        { path: "/proposals",             element: <ProposalsPage /> },
        { path: "/clients",               element: <ClientsPage /> },
        { path: "/clients/:id",           element: <ClientDetail /> },
        { path: "/projects",              element: <ProjectsPage /> },
        { path: "/projects/:id",          element: <ProjectDetail /> },
        { path: "/contracts",             element: <ContractsPage /> },
        { path: "/templates",             element: <TemplatesPage /> },
        { path: "/portals",               element: <PortalsPage /> },
        { path: "/portals/:id",           element: <PortalManage /> },
        { path: "/analytics",             element: <AnalyticsPage /> },
        { path: "/content-library",       element: <ContentLibrary /> },
        { path: "/brand",                 element: <BrandPage /> },
        { path: "/subscription",          element: <SubscriptionPage /> },
        { path: "/settings",              element: <SettingsPage /> },
      ],
    }],
  },

  // ── 404 fallback ──────────────────────────────────────────
  { path: "*", element: <Navigate to="/" replace /> },
]);
