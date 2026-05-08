import { Head } from '@inertiajs/react';
import GlobalLayout from '@/layouts/GlobalLayout';
import ComingSoon from '@/components/ComingSoon';

export default function Privacy() {
    return (
        <GlobalLayout>
            <Head title="Política de Privacidade" />
            <ComingSoon title="Política de Privacidade" />
        </GlobalLayout>
    );
}
