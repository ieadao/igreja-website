import { Head } from '@inertiajs/react';
import GlobalLayout from '@/layouts/GlobalLayout';
import ComingSoon from '@/components/ComingSoon';

export default function Documents() {
    return (
        <GlobalLayout>
            <Head title="Documentos" />
            <ComingSoon title="Documentos" />
        </GlobalLayout>
    );
}
