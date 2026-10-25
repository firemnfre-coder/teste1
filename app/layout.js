import "./globals.css";

export const metadata = {
  title: "Drogaria Paulinho Farma",
  description: "A mais popular do bairro — Qualidade tem nome!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
