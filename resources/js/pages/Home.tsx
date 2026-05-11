import { Head } from '@inertiajs/react';
import GlobalLayout from '@/layouts/GlobalLayout';
import HeroSection from '@/components/home/HeroSection';
import SocialProjectsSection from '@/components/home/SocialProjectsSection';
import NationalEventsSection from '@/components/home/NationalEventsSection';
import SermonSection from '@/components/home/SermonSection';
import ChurchMapSection from '@/components/home/ChurchMapSection';
import SupportCTASection from '@/components/home/SupportCTASection';
import type { SocialProject, Event, Sermon } from '@/types';

interface Stats {
    churches: number;
    provinces: number;
    missionaries: number;
    years: number;
}

interface Props {
    stats: Stats;
    socialProjects: SocialProject[];
    events: Event[];
    sermon: Sermon | null;
}

export default function Home({ stats, socialProjects, events, sermon }: Props) {
    return (
        <GlobalLayout heroTransparent>
            <Head title="Início" />
            <HeroSection stats={stats} />
            <SocialProjectsSection projects={socialProjects} />
            <NationalEventsSection events={events} />
            <SermonSection sermon={sermon} />
            <ChurchMapSection />
            <SupportCTASection />
        </GlobalLayout>
    );
}
