import { Head } from '@inertiajs/react';
import GlobalLayout from '@/layouts/GlobalLayout';

export default function Terms() {
    return (
        <GlobalLayout>
            <Head title="Termos de Uso — MAO" />

            <section className="pt-16 lg:pt-20 bg-ink text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                    <p className="text-brand-light text-xs font-semibold uppercase tracking-widest mb-3">Legal</p>
                    <h1 className="font-display text-4xl lg:text-5xl font-bold">Termos de Uso</h1>
                    <p className="text-white/65 mt-3">Última actualização: Janeiro de 2025</p>
                </div>
            </section>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-ink prose-p:text-ink-muted prose-a:text-brand-text">
                    <h2>1. Aceitação dos Termos</h2>
                    <p>
                        Ao aceder e utilizar o website do Ministério Alfa e Ômega (MAO), concorda em ficar vinculado
                        a estes Termos de Uso. Se não concordar com algum dos termos aqui descritos, pedimos que
                        não utilize o website.
                    </p>

                    <h2>2. Uso Permitido</h2>
                    <p>Este website destina-se a:</p>
                    <ul>
                        <li>Informar sobre as actividades, missão e visão do Ministério Alfa e Ômega;</li>
                        <li>Partilhar pregações, eventos e notícias do ministério;</li>
                        <li>Facilitar o contacto com o ministério e as suas igrejas;</li>
                        <li>Receber contribuições financeiras e pedidos de parceria.</li>
                    </ul>

                    <h2>3. Propriedade Intelectual</h2>
                    <p>
                        Todo o conteúdo publicado neste website — incluindo textos, imagens, vídeos, áudio e
                        logótipos — é propriedade do Ministério Alfa e Ômega ou dos seus criadores, e está
                        protegido pelas leis de direitos de autor aplicáveis em Moçambique.
                    </p>
                    <p>
                        É permitida a partilha de conteúdo para fins não comerciais, desde que seja devidamente
                        atribuída a autoria ao MAO. É proibida a reprodução total ou parcial para fins comerciais
                        sem autorização prévia por escrito.
                    </p>

                    <h2>4. Conteúdo de Terceiros</h2>
                    <p>
                        Este website pode conter ligações para websites de terceiros. O MAO não se responsabiliza
                        pelo conteúdo, políticas de privacidade ou práticas desses websites.
                    </p>

                    <h2>5. Contribuições Financeiras</h2>
                    <p>
                        As contribuições efectuadas através deste website são doações voluntárias ao ministério.
                        O MAO compromete-se a utilizar os fundos recebidos de acordo com a sua missão e os
                        princípios bíblicos de administração financeira. Para questões sobre contribuições,
                        contacte <a href="/contacto">a nossa equipa</a>.
                    </p>

                    <h2>6. Limitação de Responsabilidade</h2>
                    <p>
                        O MAO esforça-se por manter a informação deste website actualizada e correcta, mas não
                        garante a sua exactidão, completude ou adequação a fins específicos. O website é
                        disponibilizado "tal como está", sem garantias de qualquer tipo.
                    </p>

                    <h2>7. Alterações ao Serviço</h2>
                    <p>
                        O MAO reserva-se o direito de modificar, suspender ou encerrar qualquer parte do website
                        a qualquer momento, sem aviso prévio.
                    </p>

                    <h2>8. Lei Aplicável</h2>
                    <p>
                        Estes termos são regidos pelas leis da República de Moçambique. Qualquer litígio será
                        submetido à jurisdição dos tribunais moçambicanos competentes.
                    </p>

                    <h2>9. Contacto</h2>
                    <p>
                        Para questões relacionadas com estes Termos de Uso, contacte-nos através do{' '}
                        <a href="/contacto">formulário de contacto</a>.
                    </p>
                </div>
            </div>
        </GlobalLayout>
    );
}
