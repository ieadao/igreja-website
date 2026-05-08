import { Head } from '@inertiajs/react';
import GlobalLayout from '@/layouts/GlobalLayout';
import ComingSoon from '@/components/ComingSoon';

export default function SermonDetail() {
    return (
        <GlobalLayout>
            <Head title="Pregação" />
            <ComingSoon title="Pregação" />
        </GlobalLayout>
    );
}
