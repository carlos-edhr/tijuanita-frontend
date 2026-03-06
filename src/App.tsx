import React, { Suspense, lazy, useEffect } from "react";
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route, Navigate, useLocation, Link, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { LanguageProvider } from "./context/LanguageProvider";
import { useAuth } from "./context/useAuth";
import { useNetworkStatus } from "./hooks/useNetworkStatus";
import { toast } from "sonner";

const LandingPage = lazy(() => import("./pages/landing/LandingPage"));
const PreviewPage = lazy(() => import("./pages/landing/PreviewPage"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const ForgotPasswordPage = lazy(() => import("./pages/auth/ForgotPasswordPage"));
const PasswordResetPage = lazy(() => import("./pages/auth/PasswordResetPage"));
const MagicLinkPage = lazy(() => import("./pages/auth/MagicLinkPage"));
const SimpleDashboard = lazy(() => import("./pages/SimpleDashboard"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const SiteBuilderPage = lazy(() => import("./pages/site-builder/SiteBuilderPage"));
const UsersManagementPage = lazy(() => import("./pages/admin/UsersManagementPage"));
const FormBuilderList = lazy(() => import("./pages/forms/FormBuilderList"));
const FormEditor = lazy(() => import("./pages/forms/FormEditor"));
const AnswersTable = lazy(() => import("./pages/forms/AnswersTable"));
const PublicFormsList = lazy(() => import("./pages/forms/PublicFormsList"));
const PublicFormView = lazy(() => import("./pages/forms/PublicFormView"));
const InternalFormsList = lazy(() => import("./pages/forms/InternalFormsList"));
const InternalFormView = lazy(() => import("./pages/forms/InternalFormView"));
import ErrorBoundary from "./components/ErrorBoundary";

const PageLoader: React.FC = () => (
  <div className="min-h-screen bg-blancoHuesoFondo flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-4 border-moradoSecundario border-t-transparent rounded-full animate-spin" />
      <p className="text-blackOlive/60 text-sm">Cargando...</p>
    </div>
  </div>
);

interface PrivateRouteProps {
  children: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { authToken } = useAuth();
  const location = useLocation();
  
  if (!authToken) {
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${returnUrl}`} replace />;
  }
  
  return children;
};

interface StaffRouteProps {
  children: React.ReactElement;
}

const StaffRoute: React.FC<StaffRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  
  if (!user?.is_staff) {
    return <Navigate to="/inicio" replace />;
  }
  
  return children;
};

const PublicRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { authToken } = useAuth();
  
  if (authToken) {
    return <Navigate to="/inicio" replace />;
  }
  
  return children;
};

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-blancoHuesoFondo flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blackOlive mb-4 font-kawaiiRT">404</h1>
        <p className="text-blackOlive/70 mb-4">Página no encontrada</p>
        <Link to="/" className="text-moradoSecundario hover:underline">Volver al inicio</Link>
      </div>
    </div>
  );
};

const NetworkStatusHandler: React.FC = () => {
  const { isOnline } = useNetworkStatus();
  const wasOffline = React.useRef(!isOnline);

  useEffect(() => {
    if (!wasOffline.current && !isOnline) {
      toast.warning('Sin conexión. Algunas funciones pueden no estar disponibles.', {
        duration: Infinity,
        id: 'offline-toast',
      });
    } else if (wasOffline.current && isOnline) {
      toast.dismiss('offline-toast');
      toast.success('¡Volviste a estar en línea!');
    }
    
    wasOffline.current = !isOnline;
  }, [isOnline]);

  return null;
};

const AppLayout: React.FC = () => {
  return (
    <ErrorBoundary>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-moradoSecundario focus:text-white focus:rounded-md focus:outline-none"
      >
        Saltar al contenido principal
      </a>
      <NetworkStatusHandler />
      <LanguageProvider>
        <AuthProvider>
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
};

const App: React.FC = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<AppLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/preview" element={<PreviewPage />} />
        
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/login/magic" element={<PublicRoute><MagicLinkPage /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
        <Route path="/reset-password" element={<PublicRoute><PasswordResetPage /></PublicRoute>} />
        
        <Route path="/inicio" element={<PrivateRoute><SimpleDashboard /></PrivateRoute>} />
        <Route path="/inicio/usuarios" element={<PrivateRoute><StaffRoute><UsersManagementPage /></StaffRoute></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="/site-builder" element={<PrivateRoute><StaffRoute><SiteBuilderPage /></StaffRoute></PrivateRoute>} />
        <Route path="/inicio/formularios" element={<PrivateRoute><FormBuilderList /></PrivateRoute>} />
        <Route path="/inicio/formularios/crear" element={<PrivateRoute><FormEditor /></PrivateRoute>} />
        <Route path="/inicio/formularios/:slug/editar" element={<PrivateRoute><FormEditor /></PrivateRoute>} />
        <Route path="/inicio/formularios/:slug/respuestas" element={<PrivateRoute><AnswersTable /></PrivateRoute>} />
        
        <Route path="/formularios" element={<PublicFormsList />} />
        <Route path="/formularios/:slug" element={<PublicFormView />} />
        
        <Route path="/formularios-internos" element={<PrivateRoute><InternalFormsList /></PrivateRoute>} />
        <Route path="/formularios-internos/:slug" element={<PrivateRoute><InternalFormView /></PrivateRoute>} />
        
        <Route path="*" element={<NotFound />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
