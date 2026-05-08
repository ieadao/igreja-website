import { Head } from '@inertiajs/react';
import GlobalLayout from '@/layouts/GlobalLayout';
import ComingSoon from '@/components/ComingSoon';

export default function News() {
    return (
        <GlobalLayout>
            <Head title="Notícias" />
            <ComingSoon title="Notícias" />
        </GlobalLayout>
    );
}
