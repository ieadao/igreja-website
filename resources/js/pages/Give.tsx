import { Head } from '@inertiajs/react';
import GlobalLayout from '@/layouts/GlobalLayout';
import ComingSoon from '@/components/ComingSoon';

export default function Give() {
    return (
        <GlobalLayout>
            <Head title="Dar" />
            <ComingSoon title="Dar" />
        </GlobalLayout>
    );
}
