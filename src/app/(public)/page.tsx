"use client";

import Link from "next/link";
import { useState } from "react";
import { mockQuotas } from "@/data/mock-quotas";
import QuotaCard from "@/components/marketplace/QuotaCard";

const popularSearches = [
  "Imóvel",
  "Veículo",
  "Contemplada",
  "Carta de crédito",
  "Consórcio barato",
  "Sem entrada",
];

const goodTypes = [
  "Todos os tipos",
  "Imóvel",
  "Veículo",
  "Serviço",
];

const categories = [
  "Todas",
  "Imóveis",
  "Veículos",
  "Serviços",
  "Contempladas",
];

const features = [
  {
    iconClass: "flaticon-shield",
    title: "Transações Seguras",
    content:
      "Pagamentos protegidos com sistema Escrow. O valor só é liberado após confirmação da transferência.",
  },
  {
    iconClass: "flaticon-like",
    title: "Cotas Verificadas",
    content:
      "Todas as cotas são validadas junto às administradoras antes de entrar no marketplace.",
  },
  {
    iconClass: "flaticon-document",
    title: "Documentação Simplificada",
    content:
      "Processo 100% digital para transferência de titularidade com suporte especializado.",
  },
];

const featuresList = [
  "Sem juros bancários",
  "Transferência regulamentada pelo Banco Central",
  "Suporte especializado em consórcios",
  "Simulador gratuito de parcelas",
  "Mais de 120 administradoras parceiras",
  "Escrow para segurança das transações",
  "Processo digital de ponta a ponta",
  "Dashboard completo para gestão",
];

const testimonials = [
  {
    name: "Maria Santos",
    role: "Cotista",
    image: "/images/testimonials/1.jpg",
    text: "Consegui comprar meu apartamento com consórcio pela ConsórcioPro. O processo foi todo digital e super seguro. Recomendo demais!",
  },
  {
    name: "Carlos Oliveira",
    role: "Vendedor de Cotas",
    image: "/images/testimonials/2.jpg",
    text: "Vendi minha cota contemplada em menos de uma semana. A plataforma é intuitiva e o sistema de Escrow dá total segurança para ambas as partes.",
  },
  {
    name: "Ana Costa",
    role: "Administradora",
    image: "/images/testimonials/3.jpg",
    text: "Como administradora, a ConsórcioPro revolucionou nossa gestão de grupos. A transparência e a tecnologia facilitaram tudo.",
  },
];

export default function HomePage() {
  const [currentCategory, setCurrentCategory] = useState("Todas");
  const [activeTestimonial, setActiveTestimonial] = useState(1);

  const filteredQuotas = mockQuotas
    .filter((q) => {
      if (currentCategory === "Todas") return true;
      if (currentCategory === "Contempladas") return q.status === "contemplada";
      return q.goodTypeLabel === currentCategory.slice(0, -1) ||
        q.goodTypeLabel === currentCategory;
    })
    .slice(0, 4);

  return (
    <div className="body_content">
      {/* Hero Section - based on Hero20 */}
      <section className="hero-home13 at-home20 overflow-hidden">
        <div className="home20-hero-imgs-left d-none d-lg-block">
          <img
            src="/images/about/home20-hero-1.png"
            alt=""
            className="img-1 bounce-y"
          />
          <img
            src="/images/about/home20-hero-2.png"
            alt=""
            className="img-2 bounce-y"
          />
          <img
            src="/images/about/home20-hero-3.png"
            alt=""
            className="img-3 bounce-y"
          />
          <img
            src="/images/about/home20-hero-4.png"
            alt=""
            className="img-4 bounce-y"
          />
        </div>
        <div className="home20-hero-imgs-right d-none d-lg-block">
          <img
            src="/images/about/home20-hero-5.png"
            alt=""
            className="img-1 bounce-y"
          />
          <img
            src="/images/about/home20-hero-6.png"
            alt=""
            className="img-2 bounce-y"
          />
          <img
            src="/images/about/home20-hero-7.png"
            alt=""
            className="img-3 bounce-y"
          />
          <img
            src="/images/about/home20-hero-8.png"
            alt=""
            className="img-4 bounce-y"
          />
        </div>
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-xl-7">
              <div className="home20-hero-content text-center">
                <h1 className="animate-up-1 mb25 title">
                  O Marketplace de <br className="d-none d-xl-block" />
                  Consórcios do Brasil
                </h1>
                <p className="text mb30 animate-up-2">
                  Compre, venda e gerencie cotas de consórcio com total
                  segurança.
                  <br className="d-none d-lg-block" />
                  Sem juros, sem burocracia — encontre a melhor oportunidade.
                </p>
                <div className="advance-search-tab bgc-white bdr1-dark bdrs60 p10 bdrs4-sm banner-btn position-relative zi9 animate-up-3">
                  <div className="row">
                    <div className="col-md-5 col-lg-6 col-xl-6">
                      <div className="advance-search-field mb10-sm bdrr1 bdrn-sm">
                        <form className="form-search position-relative">
                          <div className="box-search">
                            <span className="icon far fa-magnifying-glass" />
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Buscar grupo, administradora..."
                            />
                          </div>
                        </form>
                      </div>
                    </div>
                    <div className="col-md-4 col-lg-4 col-xl-3">
                      <div className="bselect-style1">
                        <select className="form-select border-0">
                          {goodTypes.map((item, i) => (
                            <option key={i} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-3 col-lg-2 col-xl-3">
                      <div className="text-center text-xl-start">
                        <Link
                          className="ud-btn btn-thm default-box-shadow2 bdrs60 bdrs4-sm w-100"
                          href="/marketplace"
                        >
                          Buscar
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-block d-md-flex justify-content-center mt30 text-center animate-up-4">
                  <p className="hero-text fz15 me-2 mb-0">Buscas populares</p>
                  {popularSearches.map((elm, i) => (
                    <a key={i} className="text" style={{ marginRight: "5px" }}>
                      {`${elm}${i !== popularSearches.length - 1 ? "," : " "}`}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners / Stats - based on OurPartners20 */}
      <section className="our-partners hover-bgc-color pt80 pb50 maxw1700 mx-auto bdrs30 mb100">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="main-title text-center">
                <h6>Confiado pelas maiores administradoras do Brasil</h6>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            {[
              { value: "5.000+", label: "Cotas Disponíveis" },
              { value: "120+", label: "Administradoras" },
              { value: "50.000+", label: "Cotistas Ativos" },
              { value: "R$ 2bi+", label: "Em Créditos" },
              { value: "99%", label: "Satisfação" },
              { value: "24/7", label: "Suporte" },
            ].map((stat, i) => (
              <div key={i} className="col-6 col-md-4 col-xl-2">
                <div className="partner_item text-center mb30-lg">
                  <h3 className="fw700 text-thm2 mb5">{stat.value}</h3>
                  <p className="body-color fz14 mb-0">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Quotas - based on TrendingService14 */}
      <section className="pt-0 pb100">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-3">
              <div className="main-title mb30-lg">
                <h2 className="title">Cotas em Destaque</h2>
                <p className="paragraph">
                  As melhores oportunidades do marketplace
                </p>
              </div>
            </div>
            <div className="col-xl-9">
              <div className="navpill-style2 at-home9 mb50-lg">
                <ul className="nav nav-pills mb20 justify-content-xl-end">
                  {categories.map((item, i) => (
                    <li key={i} className="nav-item">
                      <button
                        onClick={() => setCurrentCategory(item)}
                        className={`nav-link fw500 dark-color ${
                          currentCategory === item ? "active" : ""
                        }`}
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="row">
            {filteredQuotas.map((quota) => (
              <div key={quota.id} className="col-sm-6 col-xl-3">
                <QuotaCard data={quota} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories - based on BrowserCategory20 */}
      <section className="pb190 pb130-md mx-auto maxw1700 bgc-thm4 bdrs24">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-9">
              <div className="main-title">
                <h2 className="title">Explore por Categoria</h2>
                <p className="paragraph">
                  Encontre a cota ideal para cada tipo de bem
                </p>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="text-lg-end mb-3">
                <Link href="/marketplace" className="ud-btn2">
                  Ver todas <i className="fal fa-arrow-right-long" />
                </Link>
              </div>
            </div>
          </div>
          <div className="row">
            {[
              {
                icon: "flaticon-home",
                title: "Imóveis",
                skills: "2.500+",
                desc: "Casas, apartamentos, terrenos e lotes com as melhores condições",
                href: "/marketplace?tipo=imovel",
              },
              {
                icon: "fas fa-car",
                title: "Veículos",
                skills: "1.800+",
                desc: "Carros, motos, caminhões e utilitários de todas as faixas",
                href: "/marketplace?tipo=veiculo",
              },
              {
                icon: "flaticon-briefcase",
                title: "Serviços",
                skills: "500+",
                desc: "Reformas, viagens, procedimentos estéticos e muito mais",
                href: "/marketplace?tipo=servico",
              },
              {
                icon: "flaticon-flash",
                title: "Contempladas",
                skills: "300+",
                desc: "Cotas já contempladas com crédito liberado para uso imediato",
                href: "/marketplace?status=contemplada",
              },
            ].map((cat, i) => (
              <div key={i} className="col-sm-6 col-xl-3">
                <div className="iconbox-style1 bdrs12 default-box-shadow1">
                  <div className="icon">
                    <span className={cat.icon} />
                  </div>
                  <div className="details mt20">
                    <p className="text mb5">{cat.skills} cotas</p>
                    <h4 className="title">
                      <Link href={cat.href}>{cat.title}</Link>
                    </h4>
                    <p className="mb-0">{cat.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - based on NeedSomething2 */}
      <section className="our-features pb90 pb30-md pt60">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="main-title">
                <h2>Como funciona?</h2>
                <p className="text">
                  Comprar ou vender cotas de consórcio nunca foi tão fácil
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            {[
              {
                step: "01",
                title: "Escolha sua Cota",
                desc: "Navegue pelo marketplace e encontre cotas de imóveis, veículos ou serviços.",
              },
              {
                step: "02",
                title: "Faça sua Proposta",
                desc: "Envie sua proposta. O pagamento fica retido na plataforma como garantia.",
              },
              {
                step: "03",
                title: "Aprovação",
                desc: "A administradora valida a documentação e aprova a transferência.",
              },
              {
                step: "04",
                title: "Cota Transferida",
                desc: "Cota transferida e valor liberado ao vendedor. Tudo seguro e transparente.",
              },
            ].map((item, i) => (
              <div key={i} className="col-sm-6 col-lg-3 mb30">
                <div className="iconbox-style1 bdrs16 bgc-white p30 text-center default-box-shadow1">
                  <div
                    className="d-inline-flex align-items-center justify-content-center mb20 bgc-thm2"
                    style={{ width: 60, height: 60, borderRadius: "50%" }}
                  >
                    <span className="text-white fw700 fz20">{item.step}</span>
                  </div>
                  <h5 className="title mb10">{item.title}</h5>
                  <p className="body-color fz14 mb-0">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Features - based on CtaBanner18 */}
      <section className="cta-banner-about2 at-home17 maxw1700 mx-auto position-relative pt60-lg pb60-lg">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7 col-xl-5 offset-xl-1 mb60-xs mb100-md">
              <div className="mb30">
                <div className="main-title">
                  <h2 className="title">
                    Um mundo inteiro de <br className="d-none d-xl-block" />{" "}
                    consórcios na sua mão
                  </h2>
                </div>
              </div>
              <div className="why-chose-list">
                {features.map((elm, i) => (
                  <div
                    key={i}
                    className="list-one d-flex align-items-start mb30"
                  >
                    <span
                      className={`list-icon flex-shrink-0 ${elm.iconClass}`}
                    />
                    <div className="list-content flex-grow-1 ml20">
                      <h4 className="mb-1">{elm.title}</h4>
                      <p className="text mb-0 fz15">{elm.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-lg-5 col-xl-4">
              <div className="listbox-style1 px30 py-5 bdrs16 bgc-dark position-relative">
                <div className="list-style1">
                  <ul className="mb-0">
                    {featuresList.map((elm, i) => (
                      <li key={i} className="text-white fw500">
                        <i className="far fa-check dark-color bgc-white" />
                        {elm}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <img
          className="home10-cta-img bdrs24"
          src="/images/about/about-19.jpg"
          alt=""
        />
      </section>

      {/* Testimonials - based on Testimonial2 */}
      <section className="our-testimonial">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 m-auto">
              <div className="main-title text-center">
                <h2 className="title">O que nossos cotistas dizem</h2>
                <p className="paragraph mt10">
                  Milhares de pessoas já realizaram seus sonhos com a
                  ConsórcioPro.
                </p>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-xl-10 mx-auto">
              <div className="home2_testimonial_tabs position-relative">
                <div className="tab-content" id="pills-tabContent2">
                  {testimonials.map((t, i) => (
                    <div
                      key={i}
                      className={`tab-pane fade ${
                        activeTestimonial === i ? "show active" : ""
                      }`}
                    >
                      <div className="testimonial-style2 at-about2 text-center">
                        <div className="testi-content text-center">
                          <span className="icon fas fa-quote-left" />
                          <h4 className="testi-text">
                            &ldquo;{t.text}&rdquo;
                          </h4>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <ul className="nav justify-content-center" id="pills-tab2">
                  {testimonials.map((t, i) => (
                    <li key={i} className="nav-item">
                      <a
                        className={`nav-link${
                          activeTestimonial === i ? " active" : ""
                        }`}
                        onClick={() => setActiveTestimonial(i)}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="thumb d-flex align-items-center">
                          <img
                            className="rounded-circle h-100"
                            src={t.image}
                            alt={t.name}
                          />
                          <h6 className="title ml30 ml15-xl mb-0">
                            {t.name}
                            <br />
                            <small>{t.role}</small>
                          </h6>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inspiring Work - based on InspireingWork20 */}
      <section className="pb90 pb20-md pt-0">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="find-work bgc-light-yellow pb50 pt60 px20 bdrs24 text-center mb30">
                <img
                  className="mb30"
                  src="/images/about/home20-vector-1.png"
                  alt=""
                />
                <h2 className="title mb30">Compre sua Cota</h2>
                <p className="text mb30">
                  Encontre a cota ideal no nosso marketplace com milhares de
                  opções
                  <br className="d-none d-lg-block" /> de imóveis, veículos e
                  serviços.
                </p>
                <Link className="ud-btn btn-dark bdrs60" href="/marketplace">
                  Ver Marketplace <i className="fal fa-arrow-right-long" />
                </Link>
              </div>
            </div>
            <div className="col-md-6">
              <div className="find-work bgc-thm4 pb50 pt60 px20 bdrs24 text-center mb30">
                <img
                  className="mb30"
                  src="/images/about/home20-vector-2.png"
                  alt=""
                />
                <h2 className="title mb30">Venda sua Cota</h2>
                <p className="text mb30">
                  Anuncie sua cota e encontre compradores qualificados com
                  <br className="d-none d-lg-block" /> transação segura via
                  Escrow.
                </p>
                <Link className="ud-btn btn-dark bdrs60" href="/registro">
                  Começar agora <i className="fal fa-arrow-right-long" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - based on CtaBanner21 */}
      <section className="home11-cta-3 at-home20 bdrs24 maxw1700 mx-auto">
        <div className="container">
          <div className="row align-items-center justify-content-between">
            <div className="col-md-6 col-lg-8">
              <div className="cta-style3">
                <h2 className="cta-title text-white">
                  Realize seu sonho com <br className="d-none d-xl-block" />{" "}
                  consórcio inteligente.
                </h2>
                <p className="cta-text text-white">
                  Junte-se a milhares de cotistas que já encontraram a melhor
                  <br className="d-none d-lg-block" /> forma de adquirir bens
                  sem juros.
                </p>
                <Link
                  href="/simulador"
                  className="ud-btn btn-white bdrs16 mr20"
                >
                  Simular Agora <i className="fal fa-arrow-right-long" />
                </Link>
                <Link href="/registro" className="ud-btn btn-transparent2 bdrs16">
                  Criar Conta <i className="fal fa-arrow-right-long" />
                </Link>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <img
                className="home11-ctaimg-v3 at-home15 d-none d-md-block"
                src="/images/about/about-16.png"
                alt=""
              />
              <img
                className="home15-ctaimg-v2 at-home20 d-none d-md-block"
                src="/images/about/element-12.png"
                alt=""
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
