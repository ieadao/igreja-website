import { Head } from '@inertiajs/react';
import GlobalLayout from '@/layouts/GlobalLayout';
import ComingSoon from '@/components/ComingSoon';

export default function NewsDetail() {
    return (
        <GlobalLayout>
            <Head title="Notícia" />
            <ComingSoon title="Notícia" />
        </GlobalLayout>
    );
}
