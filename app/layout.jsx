import "./globals.css";
import TopAppBar from "./components/app/TopAppBar";
import BottomTabBar from "./components/app/BottomTabBar";
import CartDrawer from "./components/CartDrawer";
import Footer from "./components/Footer";
import PWAInstallBanner from "./components/PWAInstallBanner";
import AnjuBotCompanion from "./components/AnjuBotCompanion";
import GsapEngine from "./components/GsapEngine";
import ToastContainer from "./components/ui/ToastContainer";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";

export const metadata = {
  title: "Anjucia | Boutique & App Officielle Algérie • 1 800 DA",
  description: "Boutique & Application officielle ANJUCIA Algérie. Soin visage apaisant 1 800 DA, tube canule haute précision, livraison 58 Wilayas.",
  manifest: "/manifest.json",
  icons: {
    icon: "/assets/symbol.svg",
    apple: "/icons/apple-touch-icon.png"
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ANJUCIA"
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#11171A"
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" data-theme="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>
        <ThemeProvider>
          <LanguageProvider>
            <CartProvider>
              <GsapEngine />
              <ToastContainer />
              <PWAInstallBanner />
              <TopAppBar />
              <div className="app-shell-content">
                {children}
              </div>
              <AnjuBotCompanion />
              <CartDrawer />
              <BottomTabBar />
              <Footer />
            </CartProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
