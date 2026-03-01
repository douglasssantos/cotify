"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { mockQuotas } from "@/data/mock-quotas";
import QuotaCard from "@/components/marketplace/QuotaCard";
import useMarketplaceStore from "@/store/marketplaceStore";

const goodTypes = [
  { label: "Tipo de Bem", value: "" },
  { label: "Imóvel", value: "imovel" },
  { label: "Veículo", value: "veiculo" },
  { label: "Serviço", value: "servico" },
];

const searchSuggestions = [
  "Imóvel contemplado",
  "Veículo sem entrada",
  "Carta de crédito",
  "Consórcio barato",
  "Moto",
  "Apartamento",
];

const quotaCategories = [
  "Todas",
  "Imóveis",
  "Veículos",
  "Serviços",
  "Contempladas",
];

const consorcioCategories = [
  {
    icon: "flaticon-home",
    count: "350+",
    title: "Imóveis",
    description: "Casas, apartamentos, terrenos e mais",
  },
  {
    icon: "flaticon-car",
    count: "280+",
    title: "Veículos",
    description: "Carros, motos, caminhões e utilitários",
  },
  {
    icon: "flaticon-developer",
    count: "150+",
    title: "Serviços",
    description: "Reformas, viagens, educação e saúde",
  },
  {
    icon: "flaticon-shield",
    count: "120+",
    title: "Contempladas",
    description: "Cotas já contempladas prontas para uso",
  },
  {
    icon: "flaticon-like",
    count: "50+",
    title: "Repasses",
    description: "Bens consorciados com transferência",
  },
  {
    icon: "flaticon-document",
    count: "80+",
    title: "Grupos Ativos",
    description: "Grupos com assembleias em andamento",
  },
  {
    icon: "flaticon-money",
    count: "30+",
    title: "Administradoras",
    description: "Parceiras verificadas e regulamentadas",
  },
  {
    icon: "flaticon-web-design",
    count: "500+",
    title: "Cotistas Ativos",
    description: "Comunidade ativa de compradores",
  },
];

const whyChooseUs = [
  "Sem juros — parcelas acessíveis",
  "Regulamentado pelo Banco Central",
  "Mais de 120 administradoras parceiras",
  "Processo 100% digital",
  "Escrow para transações seguras",
  "Suporte especializado em consórcios",
];

const features = [
  {
    iconClass: "flaticon-badge",
    title: "Cotas Verificadas",
    description:
      "Todas as cotas são validadas junto às administradoras antes de entrar no marketplace.",
  },
  {
    iconClass: "flaticon-money",
    title: "Sem Juros Bancários",
    description:
      "O consórcio não cobra juros como financiamentos tradicionais. Pague apenas taxa de administração.",
  },
  {
    iconClass: "flaticon-security",
    title: "Transações Seguras",
    description:
      "Pagamentos protegidos com sistema Escrow. O valor só é liberado após confirmação da transferência.",
  },
];

const howItWorks = [
  {
    icon: "flaticon-cv",
    title: "Escolha sua Cota",
    description:
      "Pesquise e compare cotas de consórcio. Use filtros por tipo de bem, valor e administradora.",
  },
  {
    icon: "flaticon-web-design",
    title: "Simule e Compare",
    description:
      "Use nosso simulador para calcular parcelas, taxas e encontrar a melhor opção para você.",
  },
  {
    icon: "flaticon-secure",
    title: "Adquira com Segurança",
    description:
      "Finalize a compra com pagamento protegido por Escrow. Documentação 100% digital.",
  },
];

const testimonials = [
  {
    name: "Maria Santos",
    role: "Cotista",
    company: "ConsórcioPro",
    image: "/images/testimonials/1.jpg",
    text: "Consegui comprar meu apartamento com consórcio pela ConsórcioPro. O processo foi todo digital e super seguro. O simulador me ajudou a encontrar a cota perfeita para o meu orçamento!",
  },
  {
    name: "Carlos Oliveira",
    role: "Vendedor de Cotas",
    company: "ConsórcioPro",
    image: "/images/testimonials/2.jpg",
    text: "Vendi minha cota contemplada em menos de uma semana. A plataforma é intuitiva e o sistema de Escrow dá total segurança para ambas as partes. Recomendo!",
  },
];

const faqItems = [
  {
    question: "O que é consórcio?",
    answer:
      "Consórcio é uma modalidade de compra coletiva onde um grupo de pessoas se reúne para formar uma poupança comum destinada à aquisição de bens ou serviços. Diferente do financiamento, não há cobrança de juros, apenas taxa de administração.",
  },
  {
    question: "Como funciona a contemplação?",
    answer:
      "A contemplação pode acontecer por sorteio nas assembleias mensais ou por lance (oferta de um valor antecipado). Ao ser contemplado, o cotista recebe a carta de crédito para adquirir o bem desejado.",
  },
  {
    question: "O que é uma cota contemplada?",
    answer:
      "Uma cota contemplada é aquela que já foi sorteada ou contemplada por lance. O titular já tem acesso à carta de crédito e pode utilizá-la para comprar o bem. No marketplace, você pode comprar cotas contempladas de outros cotistas.",
  },
  {
    question: "Como funciona o repasse de consórcio?",
    answer:
      "O repasse acontece quando um cotista transfere sua cota para outra pessoa. O novo titular assume as parcelas restantes e todos os direitos da cota. O processo é regulamentado e feito com total segurança na plataforma.",
  },
  {
    question: "Quais as taxas envolvidas?",
    answer:
      "As principais taxas são: taxa de administração (cobrada mensalmente), fundo de reserva (para cobrir inadimplência do grupo) e seguro. Não há cobrança de juros como em financiamentos bancários.",
  },
];

const partners = [
  "/images/partners/1.png",
  "/images/partners/2.png",
  "/images/partners/3.png",
  "/images/partners/4.png",
  "/images/partners/5.png",
  "/images/partners/6.png",
];

export default function HomePage() {
  const router = useRouter();
  const { setSearch, setGoodType } = useMarketplaceStore();

  const [heroSearch, setHeroSearch] = useState("");
  const [heroGoodType, setHeroGoodType] = useState("");
  const [heroGoodTypeLabel, setHeroGoodTypeLabel] = useState("Tipo de Bem");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("Todas");
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);
  const [showSwiper, setShowSwiper] = useState(false);

  useEffect(() => {
    setShowSwiper(true);
  }, []);

  const handleHeroSearch = () => {
    if (heroSearch) setSearch(heroSearch);
    if (heroGoodType) setGoodType(heroGoodType);
    router.push("/marketplace");
  };

  const filteredQuotas = mockQuotas
    .filter((q) => {
      if (currentCategory === "Todas") return true;
      if (currentCategory === "Contempladas") return q.status === "contemplada";
      if (currentCategory === "Imóveis") return q.goodType === "imovel";
      if (currentCategory === "Veículos") return q.goodType === "veiculo";
      if (currentCategory === "Serviços") return q.goodType === "servico";
      return true;
    })
    .slice(0, 8);

  return (
    <div className="body_content">
      {/* Hero Section - based on Hero3 */}
      <section className="home3-hero">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-7">
              <div className="home3-hero-content pe-xl-5 position-relative zi1">
                <h2 className="title text-thm2 animate-up-1">
                  O Marketplace de
                  <br className="d-none d-lg-block" />
                  Consórcios do Brasil
                </h2>
                <p className="ff-heading mb30 mt20 animate-up-2">
                  Compre, venda e gerencie cotas de consórcio com total
                  segurança.
                  <br className="d-none d-lg-block" />
                  Sem juros, sem burocracia — encontre a melhor oportunidade.
                </p>
                <form
                  className="advance-search-tab at-home3 default-box-shadow1 bgc-white bgct-sm bdrn-sm p10 p0-md bdrs4 position-relative zi9 animate-up-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleHeroSearch();
                  }}
                >
                  <div className="row">
                    <div className="col-md-5 col-lg-6 col-xl-6">
                      <div className="advance-search-field mb10-sm">
                        <div className="form-search position-relative">
                          <div className="box-search">
                            <span className="icon far fa-magnifying-glass" />
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Buscar grupo, administradora..."
                              value={heroSearch}
                              onChange={(e) => setHeroSearch(e.target.value)}
                              onFocus={() => setShowSuggestions(true)}
                              onBlur={() =>
                                setTimeout(() => setShowSuggestions(false), 200)
                              }
                            />
                            <div
                              className="search-suggestions"
                              style={
                                showSuggestions
                                  ? {
                                      visibility: "visible",
                                      opacity: "1",
                                      top: "70px",
                                    }
                                  : {
                                      visibility: "hidden",
                                      opacity: "0",
                                      top: "100px",
                                    }
                              }
                            >
                              <h6 className="fz14 ml30 mt25 mb-3">
                                Buscas Populares
                              </h6>
                              <div className="box-suggestions">
                                <ul className="px-0 m-0 pb-4">
                                  {searchSuggestions.map((item, i) => (
                                    <li
                                      key={i}
                                      className={
                                        heroSearch === item
                                          ? "ui-list-active"
                                          : ""
                                      }
                                    >
                                      <div
                                        onClick={() => {
                                          setHeroSearch(item);
                                          setShowSuggestions(false);
                                        }}
                                        className="info-product cursor-pointer"
                                      >
                                        <div className="item_title">{item}</div>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 col-lg-4 col-xl-3 d-none d-md-block">
                      <div className="bselect-style1 bdrl1 bdrn-sm">
                        <div
                          className="dropdown bootstrap-select"
                          style={{ width: "100%" }}
                        >
                          <button
                            type="button"
                            className="btn dropdown-toggle btn-light"
                            onClick={() =>
                              setShowCategoryDropdown(!showCategoryDropdown)
                            }
                            onBlur={() =>
                              setTimeout(
                                () => setShowCategoryDropdown(false),
                                150
                              )
                            }
                          >
                            <div className="filter-option">
                              <div className="filter-option-inner">
                                <div className="filter-option-inner-inner">
                                  {heroGoodTypeLabel}
                                </div>
                              </div>
                            </div>
                          </button>
                          <div
                            className={`dropdown-menu ${
                              showCategoryDropdown ? "show" : ""
                            }`}
                          >
                            <div className="inner show">
                              <ul className="dropdown-menu inner show">
                                {goodTypes.map((item, i) => (
                                  <li
                                    key={i}
                                    className="selected"
                                    onClick={() => {
                                      setHeroGoodType(item.value);
                                      setHeroGoodTypeLabel(item.label);
                                      setShowCategoryDropdown(false);
                                    }}
                                  >
                                    <a
                                      className={`dropdown-item ${
                                        heroGoodType === item.value
                                          ? "active"
                                          : ""
                                      }`}
                                    >
                                      <span className="text">
                                        {item.label}
                                      </span>
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 col-lg-2 col-xl-3">
                      <div className="text-center text-xl-end">
                        <button
                          type="submit"
                          className="ud-btn btn-home3 w-100-sm"
                        >
                          Buscar
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
                <p className="text fz15 me-2 mb-0 mt30 animate-up-4">
                  Administradoras parceiras
                </p>
                <div className="home3-hero-partner mt20 animate-up-4">
                  {partners.slice(0, 4).map((item, i) => (
                    <li
                      key={i}
                      className="d-inline-block me-3 me-sm-5 mb-3 mb-md-0"
                    >
                      <img
                        src={item}
                        className="h-100 w-100 object-fit-contain"
                        alt="partner"
                      />
                    </li>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-xl-5 d-none d-xl-block">
              <div className="position-relative">
                <div className="home3-hero-img">
                  <div className="d-flex align-items-center">
                    <img
                      src="/images/about/home3-hero-img-1.jpg"
                      alt="consórcio"
                      className="animate-up-1"
                    />
                    <div className="wrapper ml10">
                      <img
                        src="/images/about/home3-hero-img-2.jpg"
                        alt="consórcio"
                        className="animate-up-2 mb10 object-fit-contain"
                      />
                      <img
                        src="/images/about/home3-hero-img-3.jpg"
                        alt="consórcio"
                        className="animate-up-3 object-fit-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Services - Cotas em Destaque */}
      <section className="pt200 pb-0 pb30-md">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-9 mx-auto">
              <div className="main-title text-center mb30">
                <h2 className="title">Cotas em Destaque</h2>
                <p className="paragraph">
                  As melhores oportunidades de consórcio selecionadas para você
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="navpill-style2">
                <ul className="nav nav-pills mb60 justify-content-center">
                  {quotaCategories.map((item, i) => (
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
                {showSwiper && (
                  <Swiper
                    spaceBetween={30}
                    navigation={{
                      prevEl: ".btn__prev__quotas",
                      nextEl: ".btn__next__quotas",
                    }}
                    modules={[Navigation, Pagination]}
                    className="mySwiper"
                    loop={true}
                    pagination={{
                      el: ".swiper__pagination__quotas",
                      clickable: true,
                    }}
                    breakpoints={{
                      0: { slidesPerView: 1, slidesPerGroup: 1 },
                      768: { slidesPerView: 2, slidesPerGroup: 2 },
                      992: { slidesPerView: 3, slidesPerGroup: 3 },
                      1200: { slidesPerView: 4, slidesPerGroup: 4 },
                    }}
                  >
                    {filteredQuotas.map((quota, i) => (
                      <SwiperSlide key={quota.id}>
                        <QuotaCard data={quota} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )}
                <div className="row justify-content-center mt20">
                  <div className="col-auto">
                    <button className="swiper__btn btn__prev__quotas">
                      <i className="far fa-arrow-left-long" />
                    </button>
                  </div>
                  <div className="col-auto">
                    <div className="swiper__pagination swiper__pagination__quotas" />
                  </div>
                  <div className="col-auto">
                    <button className="swiper__btn btn__next__quotas">
                      <i className="far fa-arrow-right-long" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Browse Categories - BrowserCategory3 */}
      <section className="pb40-md pb90">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-9">
              <div className="main-title2">
                <h2 className="title">Categorias de Consórcio</h2>
                <p className="paragraph">
                  Encontre a cota ideal por categoria
                </p>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="text-start text-lg-end mb-4 mb-lg-0">
                <Link className="ud-btn2" href="/marketplace">
                  Ver Todas
                  <i className="fal fa-arrow-right-long" />
                </Link>
              </div>
            </div>
          </div>
          <div className="row">
            {consorcioCategories.map((cat, i) => (
              <div key={i} className="col-sm-6 col-lg-4 col-xl-3">
                <div className="iconbox-style1 bdr1 d-flex align-items-start mb30">
                  <div className="icon flex-shrink-0">
                    <span className={cat.icon} />
                  </div>
                  <div className="details ml40">
                    <p className="mb-0 text">{cat.count} cotas</p>
                    <h5 className="title mb-1">{cat.title}</h5>
                    <p className="mb-0 fz13 text">{cat.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About4 - Por que a ConsórcioPro */}
      <section className="pt0 pb40-md">
        <div className="cta-banner mx-auto maxw1700 pt110 pb80 pb30-md bdrs12 position-relative bgc-light-yellow">
          <div className="container">
            <div className="row align-items-start align-items-xl-center">
              <div className="col-md-6 col-lg-7 col-xl-6">
                <div className="position-relative mb35 mb0-sm">
                  <div className="freelancer-widget d-none d-lg-block">
                    <h5 className="title mb20">
                      <span className="text-thm">500+</span> Cotistas
                      Verificados
                    </h5>
                    <div className="thumb d-flex align-items-center mb20">
                      <div className="flex-shrink-0">
                        <img
                          className="wa"
                          src="/images/team/ea-1.png"
                          alt=""
                        />
                      </div>
                      <div className="flex-grow-1 ml20">
                        <h6 className="title mb-0">Maria Santos</h6>
                        <p className="fz14 mb-0">Cotista Imóvel</p>
                      </div>
                    </div>
                    <div className="thumb d-flex align-items-center mb20">
                      <div className="flex-shrink-0">
                        <img
                          className="wa"
                          src="/images/team/ea-2.png"
                          alt=""
                        />
                      </div>
                      <div className="flex-grow-1 ml20">
                        <h6 className="title mb-0">Carlos Oliveira</h6>
                        <p className="fz14 mb-0">Cotista Veículo</p>
                      </div>
                    </div>
                    <div className="thumb d-flex align-items-center mb20">
                      <div className="flex-shrink-0">
                        <img
                          className="wa"
                          src="/images/team/ea-3.png"
                          alt=""
                        />
                      </div>
                      <div className="flex-grow-1 ml20">
                        <h6 className="title mb-0">Ana Costa</h6>
                        <p className="fz14 mb-0">Administradora</p>
                      </div>
                    </div>
                    <div className="thumb d-flex align-items-center">
                      <div className="flex-shrink-0">
                        <img
                          className="wa"
                          src="/images/team/ea-4.png"
                          alt=""
                        />
                      </div>
                      <div className="flex-grow-1 ml20">
                        <h6 className="title mb-0">João Pereira</h6>
                        <p className="fz14 mb-0">Revendedor</p>
                      </div>
                    </div>
                  </div>
                  <div className="freelancer-style1 about-page-style text-center d-none d-lg-block">
                    <div className="thumb w90 mb25 mx-auto position-relative rounded-circle">
                      <img
                        className="rounded-circle mx-auto"
                        src="/images/team/fl-2.png"
                        alt=""
                      />
                      <span className="online" />
                    </div>
                    <div className="details">
                      <h5 className="title mb-1">Roberta Lima</h5>
                      <p className="mb-0">Consultora de Consórcios</p>
                      <div className="review">
                        <p>
                          <i className="fas fa-star fz10 review-color pr10" />
                          <span className="dark-color">4.9</span> (245
                          avaliações)
                        </p>
                      </div>
                      <div className="skill-tags d-flex align-items-center justify-content-center mb20">
                        <span className="tag">Imóveis</span>
                        <span className="tag mx10">Veículos</span>
                        <span className="tag">Serviços</span>
                      </div>
                      <hr className="opacity-100" />
                      <div className="fl-meta d-flex align-items-center justify-content-between">
                        <a className="meta fw500 text-start">
                          Cotas
                          <br />
                          <span className="fz14 fw400">350+</span>
                        </a>
                        <a className="meta fw500 text-start">
                          Sucesso
                          <br />
                          <span className="fz14 fw400">98%</span>
                        </a>
                        <a className="meta fw500 text-start">
                          Experiência
                          <br />
                          <span className="fz14 fw400">8 anos</span>
                        </a>
                      </div>
                    </div>
                  </div>
                  <img
                    className="d-block d-lg-none w-100 h-100 object-fit-contain"
                    src="/images/about/verified-freelancer.png"
                    alt=""
                  />
                  <div className="imgbox-about-page position-relative d-none d-xl-block">
                    <img
                      className="img-1 spin-right"
                      src="/images/about/element-1.png"
                      alt=""
                    />
                    <img
                      className="img-2 bounce-x"
                      src="/images/about/element-2.png"
                      alt=""
                    />
                    <img
                      className="img-3 bounce-y"
                      src="/images/about/element-3.png"
                      alt=""
                    />
                    <img
                      className="img-4 bounce-y"
                      src="/images/about/element-4.png"
                      alt=""
                    />
                    <img
                      className="img-5 spin-right"
                      src="/images/about/element-5.png"
                      alt=""
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-5 col-xl-5 offset-xl-1">
                <div className="about-box-1 pe-4 mt100 mt0-lg mb30-lg">
                  <h2 className="title mb10">
                    Por que a <br />
                    ConsórcioPro?
                  </h2>
                  <p className="text mb25 mb30-md">
                    A plataforma mais completa para compra, venda e gestão de
                    consórcios no Brasil.
                  </p>
                  <div className="list-style3 mb40 mb30-md">
                    <ul>
                      {whyChooseUs.map((item, i) => (
                        <li key={i}>
                          <i className="far fa-check text-white bgc-review-color2" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link href="/marketplace" className="ud-btn btn-thm2">
                    Ver Marketplace
                    <i className="fal fa-arrow-right-long" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="our-partners pt0">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="main-title text-center">
                <h6>Administradoras e parceiros de confiança</h6>
              </div>
            </div>
          </div>
          <div className="row">
            {partners.map((item, i) => (
              <div key={i} className="col-6 col-md-4 col-xl-2">
                <div className="partner_item text-center mb30-lg">
                  <img
                    className="wa m-auto w-100 h-100 object-fit-contain"
                    src={item}
                    alt={`Parceiro ${i + 1}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner - Features */}
      <section className="p-0">
        <div className="cta-banner3 mx-auto maxw1600 pt120 pt60-lg pb90 pb60-lg position-relative overflow-hidden bgc-light-yellow">
          <div className="container">
            <div className="row">
              <div className="col-xl-5">
                <div className="mb30">
                  <div className="main-title">
                    <h2 className="title">
                      Tudo que você precisa
                      <br className="d-none d-xl-block" /> para seu consórcio
                    </h2>
                  </div>
                </div>
                <div className="why-chose-list">
                  {features.map((feat, i) => (
                    <div
                      key={i}
                      className="list-one d-flex align-items-start mb30"
                    >
                      <span
                        className={`list-icon flex-shrink-0 ${feat.iconClass}`}
                      />
                      <div className="list-content flex-grow-1 ml20">
                        <h4 className="mb-1">{feat.title}</h4>
                        <p className="text mb-0 fz15">{feat.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <img
            className="cta-banner3-img h-100 object-fit-cover d-none d-xl-block"
            src="/images/about/about-5.jpg"
            alt="consórcio"
          />
        </div>
      </section>

      {/* Testimonials - Testimonial3 */}
      <section>
        <div className="container">
          <div className="row">
            <div className="col-lg-12 position-relative">
              <div className="row align-items-center">
                <div className="col-lg-5 col-xl-4">
                  <div className="testimonial-style4-img position-relative">
                    <img
                      className="bdrs4 w-100 h-auto"
                      src={
                        testimonials[activeTestimonial]?.image ||
                        "/images/about/about-8.jpg"
                      }
                      alt="depoimento"
                      style={{
                        aspectRatio: "4/3",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  </div>
                </div>
                <div className="col-lg-6 col-xl-8">
                  <div className="testimonial-style4 position-relative">
                    <h2 className="sub-title text-thm mb25">
                      {testimonials[activeTestimonial]?.company}
                    </h2>
                    <h4 className="title mb35">
                      &ldquo; {testimonials[activeTestimonial]?.text} &rdquo;
                    </h4>
                    <h6 className="author fz14">
                      {testimonials[activeTestimonial]?.name}
                    </h6>
                    <p className="desig mb-0">
                      {testimonials[activeTestimonial]?.role} |{" "}
                      {testimonials[activeTestimonial]?.company}
                    </p>
                  </div>
                </div>
              </div>
              <div className="testimonial__3">
                <div className="row justify-content-center">
                  <div className="col-auto">
                    <button
                      className="swiper__btn"
                      onClick={() =>
                        setActiveTestimonial((prev) =>
                          prev === 0 ? testimonials.length - 1 : prev - 1
                        )
                      }
                    >
                      <i className="far fa-arrow-left-long" />
                    </button>
                  </div>
                  <div className="col-auto d-flex align-items-center">
                    {testimonials.map((_, i) => (
                      <span
                        key={i}
                        onClick={() => setActiveTestimonial(i)}
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          backgroundColor:
                            i === activeTestimonial ? "#222" : "#ddd",
                          margin: "0 4px",
                          cursor: "pointer",
                          transition: "background-color 0.3s",
                        }}
                      />
                    ))}
                  </div>
                  <div className="col-auto">
                    <button
                      className="swiper__btn"
                      onClick={() =>
                        setActiveTestimonial((prev) =>
                          prev === testimonials.length - 1 ? 0 : prev + 1
                        )
                      }
                    >
                      <i className="far fa-arrow-right-long" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - CtaBanner4 */}
      <section className="cta-banner-about2 mx-auto maxw1700 position-relative mx20-lg pt60-lg pb60-lg">
        <img
          className="cta-about2-img d-none d-xl-block h-100 object-fit-contain"
          src="/images/about/about-9.jpg"
          alt="como funciona"
        />
        <div className="container">
          <div className="row">
            <div className="col-md-11">
              <div className="main-title">
                <h2 className="title text-capitalize">Como Funciona?</h2>
                <p className="text">
                  Adquira sua cota de consórcio em 3 passos simples
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            {howItWorks.map((step, i) => (
              <div key={i} className="col-sm-6 col-lg-4 col-xl-3">
                <div className="iconbox-style9 default-box-shadow1 bgc-white p40 bdrs12 position-relative mb30">
                  <span className={`icon fz40 ${step.icon}`} />
                  <h4 className="iconbox-title mt20">{step.title}</h4>
                  <p className="text mb-0">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ - OurFaq1 */}
      <section className="our-faqs pb50">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 m-auto">
              <div className="main-title text-center">
                <h2 className="title">Perguntas Frequentes</h2>
                <p className="paragraph mt10">
                  Tire suas dúvidas sobre consórcio e o marketplace.
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="ui-content">
                <div className="accordion-style1 faq-page mb-4 mb-lg-5">
                  <div className="accordion" id="faqAccordion">
                    {faqItems.map((faq, i) => (
                      <div
                        key={i}
                        className={`accordion-item ${
                          openFaq === i ? "active" : ""
                        }`}
                      >
                        <h2 className="accordion-header">
                          <button
                            className={`accordion-button ${
                              openFaq !== i ? "collapsed" : ""
                            }`}
                            type="button"
                            onClick={() =>
                              setOpenFaq(openFaq === i ? -1 : i)
                            }
                          >
                            {faq.question}
                          </button>
                        </h2>
                        <div
                          className={`accordion-collapse collapse ${
                            openFaq === i ? "show" : ""
                          }`}
                        >
                          <div className="accordion-body">{faq.answer}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - OurCta1 */}
      <section className="our-cta pt90 pb90 pt60-md pb60-md mt100 mt0-lg cta-home3-last">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-md-6 col-lg-7 col-xl-5">
              <div className="cta-style3">
                <h2 className="cta-title">
                  Encontre a cota perfeita para realizar seu sonho.
                </h2>
                <p className="cta-text">
                  Mais de 500 cotas disponíveis com as melhores condições do
                  mercado. Comece agora!
                </p>
                <Link href="/registro" className="ud-btn btn-thm2">
                  Começar Agora <i className="fal fa-arrow-right-long" />
                </Link>
              </div>
            </div>
            <div className="col-md-6 col-lg-5 col-xl-5 position-relative">
              <div className="cta-img">
                <img
                  className="w-100 h-100 object-fit-contain"
                  src="/images/about/about-5.png"
                  alt="cta"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
