import { Head } from '@inertiajs/react';
import GlobalLayout from '@/layouts/GlobalLayout';
import ComingSoon from '@/components/ComingSoon';

export default function Prayer() {
    return (
        <GlobalLayout>
            <Head title="Pedidos de Oração" />
            <ComingSoon title="Pedidos de Oração" />
        </GlobalLayout>
    );
}
