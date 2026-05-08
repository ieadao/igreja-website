import { Head } from '@inertiajs/react';
import GlobalLayout from '@/layouts/GlobalLayout';
import ComingSoon from '@/components/ComingSoon';

export default function Sermons() {
    return (
        <GlobalLayout>
            <Head title="Pregações" />
            <ComingSoon title="Pregações" />
        </GlobalLayout>
    );
}
