import type { ComponentType } from 'react';
import { Head } from '@inertiajs/react';
import AboutPageTemplate from '@/components/site-pages/templates/AboutPageTemplate';
import ChurchStructurePageTemplate from '@/components/site-pages/templates/ChurchStructurePageTemplate';
import HomogeneousGroupPageTemplate from '@/components/site-pages/templates/HomogeneousGroupPageTemplate';
import GlobalLayout from '@/layouts/GlobalLayout';
import type { SitePage as SitePageType, SitePageRelatedData } from '@/types';

interface Props {
    page: SitePageType;
    relatedData: SitePageRelatedData;
}

const templateRegistry: Record<string, ComponentType<Props>> = {
    about: AboutPageTemplate,
    homogeneous_group: HomogeneousGroupPageTemplate,
    church_structure: ChurchStructurePageTemplate,
};

export default function SitePage({ page, relatedData }: Props) {
    const Renderer = templateRegistry[page.template];

    return (
        <GlobalLayout heroTransparent={['homogeneous_group', 'church_structure'].includes(page.template)}>
            <Head title={page.title} />
            {Renderer ? <Renderer page={page} relatedData={relatedData} /> : null}
        </GlobalLayout>
    );
}
