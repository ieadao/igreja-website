import { Head } from '@inertiajs/react';
import GlobalLayout from '@/layouts/GlobalLayout';
import ComingSoon from '@/components/ComingSoon';

export default function Churches() {
    return (
        <GlobalLayout>
            <Head title="Igrejas" />
            <ComingSoon title="Igrejas" />
        </GlobalLayout>
    );
}
