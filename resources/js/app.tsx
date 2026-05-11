import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '../css/app.css';

const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: 1, staleTime: 1000 * 60 * 5 } },
});

createInertiaApp({
    title: (title) => (title ? `${title} — MAO` : 'Ministério Alfa e Ômega'),
    resolve: (name) =>
        resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        createRoot(el).render(
            <QueryClientProvider client={queryClient}>
                <App {...props} />
            </QueryClientProvider>,
        );
    },
    progress: {
        color: '#7B3B2A',
    },
});
