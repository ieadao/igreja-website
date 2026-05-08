import { Link } from '@inertiajs/react';

export default function ComingSoon({ title }: { title: string }) {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand mb-4">Em breve</p>
            <h1 className="font-display text-5xl font-semibold text-ink mb-4">{title}</h1>
            <p className="text-ink-muted max-w-md mb-10">
                Esta página está em construção. Volte em breve.
            </p>
            <Link
                href="/"
                className="px-6 py-3 bg-brand text-white rounded-lg hover:bg-brand-dark transition-colors font-medium"
            >
                Voltar ao Início
            </Link>
        </div>
    );
}
