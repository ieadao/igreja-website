import { Head } from '@inertiajs/react';
import GlobalLayout from '@/layouts/GlobalLayout';
import ComingSoon from '@/components/ComingSoon';

export default function About() {
    return (
        <GlobalLayout>
            <Head title="Sobre Nós" />
            <ComingSoon title="Sobre Nós" />
        </GlobalLayout>
    );
}
