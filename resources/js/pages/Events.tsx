import { Head } from '@inertiajs/react';
import GlobalLayout from '@/layouts/GlobalLayout';
import ComingSoon from '@/components/ComingSoon';

export default function Events() {
    return (
        <GlobalLayout>
            <Head title="Eventos" />
            <ComingSoon title="Eventos" />
        </GlobalLayout>
    );
}
