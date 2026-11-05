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
  title: "Anjucia | Boutique & App Officielle Algérie",
  description: "Boutique & Application officielle ANJUCIA Algérie. Soin visage apaisant, haute précision dermocosmétique, livraison 58 Wilayas.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/brand/anjucia-mark.png", sizes: "any", type: "image/png" }
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ]
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
    <html lang="fr" data-theme="light" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{localStorage.setItem("anjucia_theme","light");document.documentElement.setAttribute("data-theme","light");}catch(e){}})();`
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Zain:ital,wght@0,200;0,300;0,400;0,700;0,800;0,900;1,300;1,400&display=swap" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body>
        <div className="site-background-canvas" aria-hidden="true" />
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
