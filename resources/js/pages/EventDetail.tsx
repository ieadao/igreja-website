import { Head } from '@inertiajs/react';
import GlobalLayout from '@/layouts/GlobalLayout';
import ComingSoon from '@/components/ComingSoon';

export default function EventDetail() {
    return (
        <GlobalLayout>
            <Head title="Evento" />
            <ComingSoon title="Evento" />
        </GlobalLayout>
    );
}
