"use client"
import type { Metadata } from "next";
import Link from 'next/link';
import { Inter } from 'next/font/google';
import "./globals.css";
import { usePathname } from 'next/navigation'
import WalletContextProvider from "./_providers/walletContextProvider";
import ProgramContextProvider from "./_providers/programContextProvider";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { WalletConnectWalletAdapter } from "@solana/wallet-adapter-wallets";
import ConfigProvider from "./_providers/configProvider";
import SnackBarProvider from "./_providers/snackBarProvider";

const inter = Inter({ subsets: ["latin"] });

// WalletConnectWalletAdapter
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>dao-2024</title>
      </head>
      <body className="min-h-screen">
        <WalletContextProvider>
          <ProgramContextProvider>
              <SnackBarProvider>
                <ConfigProvider>
                    {children}
                </ConfigProvider>
              </SnackBarProvider>
          </ProgramContextProvider>
        </WalletContextProvider>
      </body>
    </html>
  );
}