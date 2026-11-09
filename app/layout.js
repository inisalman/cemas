import './globals.css';
import { Header, Footer } from './components/Chrome';
export const metadata = { title: 'Ruang Tenang | Hadapi Cemas Sebelum Operasi', description: 'Panduan mengenali kecemasan dan relaksasi hipnosis lima jari sebelum operasi.' };
export default function RootLayout({ children }) { return <html lang="id"><body><Header/>{children}<Footer/></body></html>; }
