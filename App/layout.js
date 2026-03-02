
export const metadata = { title: "FEABA Travels Invoice" };

export default function RootLayout({ children }) {
  return (
    <html>
      <body style={{ background:"#f3f4f6", fontFamily:"Arial, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
