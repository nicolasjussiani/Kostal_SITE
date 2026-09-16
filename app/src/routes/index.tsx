import { createFileRoute } from "@tanstack/react-router";

import { ScrollScrub } from "@/components/scroll-scrub/scroll-scrub";
import { ProductLab } from "@/components/kostal/product-lab";
import { scrollScrubScenes, scrollScrubTheme } from "@/scroll-scrub-scenes";
import "@/kostal.css";

export const Route = createFileRoute("/")({ component: Index });

const capabilities = [
  ["Comando", "Interfaces táteis para condução, iluminação e conveniência."],
  ["Sinal", "Avisos sonoros e elétricos claros em condições críticas."],
  ["Conexão", "Encaixes precisos que protegem continuidade e montagem."],
  ["Movimento", "Transmissão de energia e dados mesmo durante a rotação."],
];

function BrandMark() {
  return (
    <a className="brand-mark" href="#inicio" aria-label="KOSTAL Brasil, início">
      <img src="/assets/brand/kostal-logo.png" alt="KOSTAL Brasil" />
      <span>BRASIL</span>
    </a>
  );
}

function Index() {
  return (
    <main id="inicio" className="kostal-site">
      <header className="site-header">
        <BrandMark />
        <nav aria-label="Navegação principal">
          <a href="#produtos">Produtos</a>
          <a href="#engenharia">Engenharia</a>
          <a href="#aftermarket">Aftermarket</a>
          <a className="nav-contact" href="#contato">Contato</a>
        </nav>
      </header>

      <ScrollScrub scenes={scrollScrubScenes} theme={scrollScrubTheme} />
      <ProductLab />

      <section className="engineering-statement" id="engenharia" aria-labelledby="engineering-title">
        <div className="engineering-statement__copy">
          <h2 id="engineering-title">Engenharia que responde.</h2>
          <p>Da matéria-prima ao teste final, cada detalhe existe para funcionar com consistência no veículo.</p>
        </div>
        <figure className="engineering-statement__media">
          <img src="/assets/products/cinta-airbag.jpg" alt="Cinta de airbag KOSTAL em vista de produto" />
          <figcaption>Integração elétrica para sistemas em movimento.</figcaption>
        </figure>
      </section>

      <section className="capabilities-section" aria-labelledby="capabilities-title">
        <div className="capabilities-section__heading">
          <h2 id="capabilities-title">Do toque ao sinal.</h2>
          <p>Uma cadeia de soluções para transformar intenção em resposta elétrica.</p>
        </div>
        <div className="capabilities-rail">
          {capabilities.map(([title, body], index) => (
            <article key={title}>
              <span>0{index + 1}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="aftermarket-section" id="aftermarket" aria-labelledby="aftermarket-title">
        <div className="aftermarket-section__image">
          <img src="/assets/products/chave-combinada.png" alt="Chave combinada KOSTAL para reposição automotiva" />
        </div>
        <div className="aftermarket-section__copy">
          <p className="technical-label">PEÇAS PARA REPOSIÇÃO</p>
          <h2 id="aftermarket-title">Padrão de origem no aftermarket.</h2>
          <p>Peças para reposição desenvolvidas com o mesmo compromisso de qualidade aplicado ao fornecimento para montadoras.</p>
          <a className="catalog-link" href="https://kostalbrasil.com.br/catalogo/pecas" target="_blank" rel="noreferrer">Ver catálogo</a>
        </div>
      </section>

      <section className="company-band" aria-labelledby="company-title">
        <div>
          <h2 id="company-title">Tecnologia feita para durar.</h2>
        </div>
        <p>Em São Bernardo do Campo, a KOSTAL conecta experiência industrial, desenvolvimento e suporte ao mercado brasileiro.</p>
        <img src="/assets/products/comutador.jpg" alt="Comutador de ignição KOSTAL" />
      </section>

      <footer className="site-footer" id="contato">
        <div className="site-footer__lead">
          <BrandMark />
          <h2>Vamos mover o próximo projeto.</h2>
          <a className="footer-contact" href="mailto:sac@kostal.com">
            <span>Falar com KOSTAL</span>
            <b aria-hidden="true">↗</b>
          </a>
        </div>
        <div className="site-footer__details">
          <a href="tel:08004567825">0800 456 7825</a>
          <a href="mailto:sac@kostal.com">sac@kostal.com</a>
          <address>Avenida Redenção, 495, São Bernardo do Campo, SP</address>
        </div>
        <p className="site-footer__legal">KOSTAL Eletromecânica LTDA. CNPJ 60.852.274/0001-30.</p>
      </footer>
    </main>
  );
}
