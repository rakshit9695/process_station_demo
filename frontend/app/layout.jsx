import "./globals.css";

export const metadata = {
  title: "Process Station — MMS Dashboard",
  description:
    "Academic dashboard for the Siemens MMS04 Process Station — mechatronics & industrial automation.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
