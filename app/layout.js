export const metadata = {
  title: "FEABA Travels Invoice",
  description: "Professional invoice generator for FEABA Travels",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#f0f2f5", fontFamily: "'Segoe UI', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
