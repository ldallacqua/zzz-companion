/**
 * Pass-through root layout. The real document (<html>, fonts, providers) lives in
 * `[locale]/layout.tsx`; only the locale redirect page and the global 404 sit here.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
