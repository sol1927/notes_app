import "../styles/globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute left-[-8rem] top-[-6rem] h-72 w-72 rounded-full bg-sky-300/30 blur-3xl" />
          <div className="absolute bottom-[-8rem] right-[-5rem] h-80 w-80 rounded-full bg-blue-300/25 blur-3xl" />
        </div>
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
