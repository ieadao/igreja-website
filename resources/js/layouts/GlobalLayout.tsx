import { type ReactNode } from 'react';
import GlobalHeader from '@/components/navigation/GlobalHeader';
import GlobalFooter from '@/components/GlobalFooter';
import WhatsAppFloat from '@/components/WhatsAppFloat';

interface Props {
    children: ReactNode;
    heroTransparent?: boolean;
}

export default function GlobalLayout({ children, heroTransparent = false }: Props) {
    return (
        <div className="min-h-screen flex flex-col">
            <GlobalHeader transparent={heroTransparent} />
            <main className={`flex-1 ${heroTransparent ? '' : 'pt-16 lg:pt-20'}`}>
                {children}
            </main>
            <GlobalFooter />
            <WhatsAppFloat />
        </div>
    );
}
