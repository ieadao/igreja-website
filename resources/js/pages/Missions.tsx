import { Head } from '@inertiajs/react';
import GlobalLayout from '@/layouts/GlobalLayout';
import ComingSoon from '@/components/ComingSoon';

export default function Missions() {
    return (
        <GlobalLayout>
            <Head title="Missões" />
            <ComingSoon title="Missões" />
        </GlobalLayout>
    );
}
