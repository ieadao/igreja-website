import { Head } from '@inertiajs/react';
import GlobalLayout from '@/layouts/GlobalLayout';
import { FileText, Download, FolderOpen } from 'lucide-react';
import { storageUrl, formatDate } from '@/lib/utils';
import type { Document } from '@/types';

interface Props {
    documents: Document[];
}

const CATEGORY_LABEL: Record<string, string> = {
    statute:    'Estatutos',
    regulation: 'Regulamentos',
    report:     'Relatórios',
    other:      'Outros',
};

const CATEGORY_ORDER = ['statute', 'regulation', 'report', 'other'];

function formatSize(kb: number | null): string {
    if (!kb) return '';
    if (kb < 1024) return `${kb} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
}

export default function Documents({ documents }: Props) {
    const byCategory = CATEGORY_ORDER.reduce<Record<string, Document[]>>((acc, cat) => {
        const items = documents.filter(d => d.category === cat);
        if (items.length > 0) acc[cat] = items;
        return acc;
    }, {});

    return (
        <GlobalLayout>
            <Head title="Documentos — MAO" />

            <section className="pt-16 lg:pt-20 bg-ink text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
                    <p className="text-brand-light text-xs font-semibold uppercase tracking-widest mb-3">Recursos</p>
                    <h1 className="font-display text-4xl lg:text-5xl font-bold">Documentos</h1>
                    <p className="text-white/65 mt-3 max-w-2xl text-lg">
                        Estatutos, regulamentos e relatórios oficiais do Ministério Alfa e Ômega.
                    </p>
                </div>
            </section>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {documents.length === 0 ? (
                    <div className="text-center py-24">
                        <FolderOpen size={48} className="mx-auto text-brand-light mb-4" />
                        <p className="text-ink-muted">Nenhum documento publicado ainda.</p>
                    </div>
                ) : (
                    <div className="space-y-10">
                        {Object.entries(byCategory).map(([cat, docs]) => (
                            <section key={cat}>
                                <h2 className="font-display text-xl font-semibold text-ink mb-4 pb-2 border-b border-border">
                                    {CATEGORY_LABEL[cat] ?? cat}
                                </h2>
                                <div className="space-y-3">
                                    {docs.map(doc => (
                                        <a
                                            key={doc.id}
                                            href={storageUrl(doc.file_url)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex items-center gap-4 bg-white rounded-xl border border-border p-4 hover:shadow-md hover:border-brand/30 transition-all"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-brand-pale flex items-center justify-center shrink-0">
                                                <FileText size={18} className="text-brand" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-ink group-hover:text-brand transition-colors truncate">
                                                    {doc.title}
                                                </p>
                                                <p className="text-xs text-ink-muted mt-0.5">
                                                    {doc.published_at && formatDate(doc.published_at)}
                                                    {doc.file_size_kb && ` · ${formatSize(doc.file_size_kb)}`}
                                                </p>
                                            </div>
                                            <Download size={16} className="text-ink-muted group-hover:text-brand shrink-0 transition-colors" />
                                        </a>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </div>
        </GlobalLayout>
    );
}
