import { Head } from '@inertiajs/react';
import ProvinceLayout from '@/layouts/ProvinceLayout';
import ComingSoon from '@/components/ComingSoon';
import type { Province } from '@/types';

export default function ProvinceContact({ province }: { province: Province }) {
    return (
        <ProvinceLayout province={province}>
            <Head title="Contacto" />
            <ComingSoon title="Contacto" />
        </ProvinceLayout>
    );
}
