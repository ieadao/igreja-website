import { type ReactNode } from 'react';
import ProvinceHeader from '@/components/navigation/ProvinceHeader';
import ProvinceFooter from '@/components/ProvinceFooter';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import type { Province } from '@/types';

interface Props {
    children: ReactNode;
    province: Province;
    heroTransparent?: boolean;
}

export default function ProvinceLayout({ children, province, heroTransparent = false }: Props) {
    return (
        <div className="min-h-screen flex flex-col">
            <ProvinceHeader province={province} transparent={heroTransparent} />
            <main className={`flex-1 ${heroTransparent ? '' : 'pt-16 lg:pt-20'}`}>
                {children}
            </main>
            <ProvinceFooter province={province} />
            <WhatsAppFloat />
        </div>
    );
}
