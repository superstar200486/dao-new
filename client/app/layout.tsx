"use client"
import "./globals.css";
import WalletContextProvider from "./_providers/walletContextProvider";
import ProgramContextProvider from "./_providers/programContextProvider";
import ConfigProvider from "./_providers/configProvider";
import SnackBarProvider from "./_providers/snackBarProvider";

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