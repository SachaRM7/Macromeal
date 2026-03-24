import "./globals.css";

export const metadata = {
  title: "MacroMeal — Portions ajustées",
  description: "Calcule automatiquement les portions de tes repas selon tes macros",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
