import { Head } from '@inertiajs/react';
import GlobalLayout from '@/layouts/GlobalLayout';

export default function Privacy() {
    return (
        <GlobalLayout>
            <Head title="Política de Privacidade — MAO" />

            <section className="pt-16 lg:pt-20 bg-ink text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                    <p className="text-brand-light text-xs font-semibold uppercase tracking-widest mb-3">Legal</p>
                    <h1 className="font-display text-4xl lg:text-5xl font-bold">Política de Privacidade</h1>
                    <p className="text-white/65 mt-3">Última actualização: Janeiro de 2025</p>
                </div>
            </section>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-ink prose-p:text-ink-muted prose-a:text-brand-text">
                    <h2>1. Responsável pelo Tratamento de Dados</h2>
                    <p>
                        O Ministério Alfa e Ômega (MAO), com sede em Maputo, Moçambique, é o responsável pelo
                        tratamento dos seus dados pessoais recolhidos através deste website.
                    </p>

                    <h2>2. Dados Recolhidos</h2>
                    <p>Recolhemos apenas os dados necessários para as finalidades descritas nesta política:</p>
                    <ul>
                        <li><strong>Formulários de contacto:</strong> nome, endereço de e-mail, telefone e mensagem.</li>
                        <li><strong>Inscrições em eventos:</strong> nome, e-mail e telefone para confirmação de presença.</li>
                        <li><strong>Pedidos de apoio financeiro:</strong> informações necessárias ao processamento das contribuições.</li>
                    </ul>

                    <h2>3. Finalidade do Tratamento</h2>
                    <p>Os seus dados são utilizados exclusivamente para:</p>
                    <ul>
                        <li>Responder aos seus pedidos e mensagens;</li>
                        <li>Gerir a sua inscrição em eventos e actividades;</li>
                        <li>Processar contribuições e apoios financeiros;</li>
                        <li>Enviar comunicações relacionadas com as actividades do ministério, caso tenha dado o seu consentimento.</li>
                    </ul>

                    <h2>4. Partilha de Dados</h2>
                    <p>
                        O MAO não vende, aluga nem partilha os seus dados pessoais com terceiros, excepto quando
                        exigido por lei ou necessário à prestação de serviços directamente relacionados com as
                        actividades do ministério.
                    </p>

                    <h2>5. Armazenamento e Segurança</h2>
                    <p>
                        Os seus dados são armazenados em servidores seguros e protegidos por medidas técnicas e
                        organizacionais adequadas. O acesso é restrito aos colaboradores que necessitam dos dados
                        para desempenhar as suas funções.
                    </p>

                    <h2>6. Os Seus Direitos</h2>
                    <p>Tem o direito de:</p>
                    <ul>
                        <li>Aceder aos dados pessoais que conservamos sobre si;</li>
                        <li>Solicitar a correcção de dados incorrectos ou incompletos;</li>
                        <li>Solicitar a eliminação dos seus dados;</li>
                        <li>Opor-se ao tratamento dos seus dados para fins de marketing.</li>
                    </ul>
                    <p>
                        Para exercer estes direitos, contacte-nos através do endereço:{' '}
                        <a href="mailto:privacidade@maoministério.org">privacidade@maoministério.org</a>
                    </p>

                    <h2>7. Cookies</h2>
                    <p>
                        Este website pode utilizar cookies técnicos essenciais para o seu funcionamento. Não
                        utilizamos cookies de rastreamento ou publicidade de terceiros.
                    </p>

                    <h2>8. Alterações a Esta Política</h2>
                    <p>
                        Reservamo-nos o direito de actualizar esta política periodicamente. Quaisquer alterações
                        significativas serão comunicadas através do website. A continuação da utilização do website
                        após a publicação de alterações constitui a sua aceitação das mesmas.
                    </p>

                    <h2>9. Contacto</h2>
                    <p>
                        Para quaisquer questões relacionadas com a privacidade dos seus dados, contacte-nos em:{' '}
                        <a href="/contacto">Formulário de Contacto</a> ou por e-mail para{' '}
                        <a href="mailto:geral@maoministério.org">geral@maoministério.org</a>.
                    </p>
                </div>
            </div>
        </GlobalLayout>
    );
}
