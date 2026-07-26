import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CustomerExperienceProvider } from "@/context/CustomerExperienceContext";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://priya-foot-wear.vercel.app"),
  title: "Priya Foot Wear | Premium Men's Footwear Catalog",
  description: "Browse the exclusive collection of men's formal shoes, casual wear, sports footwear, sandals, and slippers at Priya Foot Wear. Premium quality, comfortable fit, and latest designs.",
  keywords: ["men footwear", "formal shoes", "casual shoes", "sports shoes", "sandals", "slippers", "Priya Foot Wear", "premium shoes"],
  authors: [{ name: "Priya Foot Wear" }],
  openGraph: {
    title: "Priya Foot Wear | Premium Men's Footwear Catalog",
    description: "Discover premium men's footwear for every occasion. View our collection online and contact us directly via WhatsApp to purchase.",
    type: "website",
    locale: "en_US",
    siteName: "Priya Foot Wear",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${plusJakartaSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300 relative">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ShoeStore",
              "name": "Priya Foot Wear",
              "image": "https://priya-foot-wear.vercel.app/placeholder.jpg",
              "@id": "https://priya-foot-wear.vercel.app",
              "url": "https://priya-foot-wear.vercel.app",
              "telephone": "+918374284265",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Shop # 02, Jeep Stand, Opposite Gandhi Ganj, Beside Nerolac Paint Shop",
                "addressLocality": "Bhainsa",
                "addressRegion": "Telangana",
                "postalCode": "504103",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 19.1023,
                "longitude": 77.9620
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday"
                ],
                "opens": "10:00",
                "closes": "20:30"
              }
            })
          }}
        />
        <ThemeProvider defaultTheme="dark">
          {/* Subtle design texture */}
          <div className="noise-overlay" />
          
          <CustomerExperienceProvider>
            <Navbar />
            <main className="flex-grow flex flex-col">{children}</main>
            <Footer />
          </CustomerExperienceProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
