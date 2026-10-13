import "./globals.css";
import Navbar from "./components/Navbar";
import CartDrawer from "./components/CartDrawer";
import Footer from "./components/Footer";
import PWAInstallBanner from "./components/PWAInstallBanner";
import StickyMobileBuyBar from "./components/StickyMobileBuyBar";
import AnjuBotCompanion from "./components/AnjuBotCompanion";
import GsapEngine from "./components/GsapEngine";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";

export const metadata = {
  title: "Anjucia | Boutique Officielle Algérie • Advanced Skincare",
  description: "Boutique officielle ANJUCIA Algérie. Soin visage apaisant 1 500 DA, crème barrière CeraHydra+ et analyse cutanée DermoScan AI. Expédition 58 Wilayas.",
  manifest: "/manifest.json",
  icons: {
    icon: "/assets/symbol.svg",
    apple: "/assets/symbol.svg"
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
  maximumScale: 1,
  userScalable: false,
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
      </head>
      <body>
        <ThemeProvider>
          <LanguageProvider>
            <CartProvider>
              <GsapEngine />
              <AnjuBotCompanion />
              <PWAInstallBanner />
              <Navbar />
              {children}
              <CartDrawer />
              <StickyMobileBuyBar />
              <Footer />
            </CartProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
