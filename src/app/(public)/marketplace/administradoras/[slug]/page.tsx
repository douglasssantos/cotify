"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  mockGroups,
  getGroupStatusLabel,
  getGroupStatusClass,
} from "@/data/mock-groups";
import { mockQuotas } from "@/data/mock-quotas";
import QuotaListCard from "@/components/marketplace/QuotaListCard";
import { AdminLogo } from "@/components/marketplace/AdminLogo";
import { formatCurrency } from "@/lib/utils";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}

const adminInfo: Record<
  string,
  {
    name: string;
    description: string;
    about: string;
    logo: string;
    founded: string;
    regulated: string;
    size: string;
    phone: string;
    email: string;
    location: string;
    website: string;
    rating: number;
    reviews: number;
  }
> = {
  embracon: {
    name: "Embracon",
    description: "Uma das maiores administradoras de consórcio do Brasil",
    about:
      "A Embracon é uma das maiores e mais tradicionais administradoras de consórcio do Brasil, com mais de 35 anos de experiência no mercado. Fundada em 1988, a empresa é reconhecida pela solidez, transparência e comprometimento com seus cotistas. Regulamentada pelo Banco Central do Brasil, a Embracon oferece planos para imóveis, veículos e serviços, com grupos bem estruturados e assembleias mensais organizadas.",
    // logo: "/images/partners/1.png",
    founded: "1988",
    regulated: "Banco Central do Brasil",
    size: "5.000+ colaboradores",
    phone: "(11) 3003-1988",
    email: "atendimento@embracon.com.br",
    location: "São Paulo, SP",
    website: "www.embracon.com.br",
    rating: 4.8,
    reviews: 312,
  },
  "porto-seguro": {
    name: "Porto Seguro",
    description: "Tradição e segurança em consórcios de imóveis e veículos",
    about:
      "O Porto Seguro Consórcio é o braço de consórcios do Grupo Porto Seguro, uma das maiores seguradoras do Brasil. Com décadas de experiência, oferece planos para imóveis e veículos com a segurança e credibilidade de uma das marcas mais respeitadas do mercado financeiro nacional.",
    // logo: "/images/partners/2.png",
    founded: "1945",
    regulated: "Banco Central do Brasil",
    size: "10.000+ colaboradores",
    phone: "(11) 3003-9045",
    email: "consorcio@portoseguro.com.br",
    location: "São Paulo, SP",
    website: "www.portoseguro.com.br",
    rating: 4.7,
    reviews: 256,
  },
  rodobens: {
    name: "Rodobens",
    description: "Referência nacional em consórcios de imóveis",
    about:
      "A Rodobens é uma referência nacional em consórcios de imóveis, com mais de 70 anos de história. A empresa se destaca pela facilidade de acesso ao crédito imobiliário, oferecendo planos com condições diferenciadas para quem deseja conquistar o imóvel próprio com planejamento financeiro inteligente e sem juros.",
    // logo: "/images/partners/3.png",
    founded: "1949",
    regulated: "Banco Central do Brasil",
    size: "3.000+ colaboradores",
    phone: "(17) 3321-4949",
    email: "consorcio@rodobens.com.br",
    location: "São José do Rio Preto, SP",
    website: "www.rodobens.com.br",
    rating: 4.6,
    reviews: 189,
  },
  bradesco: {
    name: "Bradesco",
    description: "A solidez do maior banco privado em consórcios",
    about:
      "O Bradesco Consórcios conta com toda a infraestrutura, tecnologia e credibilidade de um dos maiores bancos privados do Brasil. Com presença em todo o território nacional, oferece consórcios para veículos e imóveis com atendimento personalizado e condições competitivas.",
    // logo: "/images/partners/4.png",
    founded: "1943",
    regulated: "Banco Central do Brasil",
    size: "90.000+ colaboradores",
    phone: "(11) 4002-0022",
    email: "consorcio@bradesco.com.br",
    location: "Osasco, SP",
    website: "www.bradesco.com.br",
    rating: 4.5,
    reviews: 421,
  },
  itau: {
    name: "Itaú",
    description: "Tecnologia e inovação em consórcios",
    about:
      "O Itaú Consórcio oferece planos flexíveis para imóveis, veículos e serviços, com toda a solidez e tecnologia do maior banco privado da América Latina. A plataforma digital facilita o acompanhamento do grupo, lances e contemplações de forma prática e segura.",
    // logo: "/images/partners/5.png",
    founded: "1945",
    regulated: "Banco Central do Brasil",
    size: "100.000+ colaboradores",
    phone: "(11) 4004-4828",
    email: "consorcio@itau.com.br",
    location: "São Paulo, SP",
    website: "www.itauconsorcio.com.br",
    rating: 4.7,
    reviews: 538,
  },
  "banco-do-brasil": {
    name: "Banco do Brasil",
    description: "A confiança de um banco centenário em consórcios",
    about:
      "O BB Consórcios é a administradora do Banco do Brasil, oferecendo consórcios para veículos, imóveis e serviços com a confiança de um banco com mais de 200 anos de história. Presente em todo o Brasil, conta com uma extensa rede de agências para atendimento presencial e suporte completo ao cotista.",
    // logo: "/images/partners/6.png",
    founded: "1808",
    regulated: "Banco Central do Brasil",
    size: "85.000+ colaboradores",
    phone: "(61) 4004-0001",
    email: "consorcio@bb.com.br",
    location: "Brasília, DF",
    website: "www.bb.com.br/consorcio",
    rating: 4.5,
    reviews: 367,
  },
};

const tabOptions = ["Sobre", "Grupos", "Cotas Disponíveis"];

export default function AdministradoraPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const info = adminInfo[slug];

  const [activeTab, setActiveTab] = useState(() =>
    searchParams.get("tab") === "cotas" ? "Cotas Disponíveis" : "Sobre"
  );
  const [shareToggle, setShareToggle] = useState(false);
  const [saveToggle, setSaveToggle] = useState(false);
  const [groupFilter, setGroupFilter] = useState("");
  const [quotaFilter, setQuotaFilter] = useState("");

  useEffect(() => {
    if (searchParams.get("tab") === "cotas") setActiveTab("Cotas Disponíveis");
  }, [searchParams]);

  const adminGroups = mockGroups.filter(
    (g) => slugify(g.administradora) === slug
  );
  const adminQuotas = mockQuotas.filter(
    (q) => slugify(q.administradora) === slug
  );

  const filteredGroups = adminGroups.filter((g) =>
    groupFilter ? g.status === groupFilter : true
  );
  const filteredQuotas = adminQuotas.filter((q) =>
    quotaFilter ? q.status === quotaFilter : true
  );

  const totalQuotas = adminGroups.reduce((acc, g) => acc + g.totalQuotas, 0);
  const activeGroups = adminGroups.filter(
    (g) => g.status === "em_andamento"
  ).length;
  const totalContemplated = adminGroups.reduce(
    (acc, g) => acc + g.contemplatedQuotas,
    0
  );

  if (!info && adminGroups.length === 0) {
    return (
      <div className="container py-5 text-center" style={{ marginTop: 100 }}>
        <h2>Administradora não encontrada</h2>
        <Link href="/marketplace" className="ud-btn btn-thm mt20">
          Ir ao Marketplace <i className="fal fa-arrow-right-long" />
        </Link>
      </div>
    );
  }

  const adminName = info?.name || slug;

  return (
    <>
      {/* Breadcumb10 */}
      <section className="breadcumb-section">
        <div className="container">
          <div className="row">
            <div className="col-sm-8 col-lg-10">
              <div className="breadcumb-style1 mb10-xs">
                <div className="breadcumb-list">
                  <Link href="/">Início</Link>
                  <Link href="/marketplace">Marketplace</Link>
                  <Link href="/marketplace/administradoras">
                    Administradoras
                  </Link>
                  <a>{adminName}</a>
                </div>
              </div>
            </div>
            <div className="col-sm-4 col-lg-2">
              <div className="d-flex align-items-center justify-content-sm-end">
                <a
                  onClick={() => setShareToggle(!shareToggle)}
                  className="position-relative ui-share-toggle"
                  style={{ cursor: "pointer" }}
                >
                  <div
                    className={`share-save-widget d-flex align-items-center ${
                      shareToggle ? "active" : ""
                    }`}
                  >
                    <span className="icon flaticon-share dark-color fz12 mr10" />
                    <div className="h6 mb-0">Compartilhar</div>
                  </div>
                  {shareToggle && (
                    <div className="ui-social-media">
                      <a><i className="fa-brands fa-facebook-f" /></a>
                      <a><i className="fa-brands fa-twitter" /></a>
                      <a><i className="fa-brands fa-linkedin-in" /></a>
                      <a><i className="fa-brands fa-whatsapp" /></a>
                    </div>
                  )}
                </a>
                <a
                  onClick={() => setSaveToggle(!saveToggle)}
                  style={{ cursor: "pointer" }}
                >
                  <div
                    className={`share-save-widget d-flex align-items-center ml15 ${
                      saveToggle ? "active" : ""
                    }`}
                  >
                    <span className="icon flaticon-like dark-color fz12 mr10" />
                    <div className="h6 mb-0">Salvar</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcumb15 — Admin profile banner */}
      <section className="breadcumb-section pt-0">
        <div className="cta-employee-single freelancer-single-style mx-auto maxw1700 pt120 pt60-sm pb120 pb60-sm bdrs16 position-relative overflow-hidden d-flex align-items-center mx20-lg px30-lg">
          <img
            className="left-top-img"
            src="/images/vector-img/left-top.png"
            alt=""
          />
          <img
            className="right-bottom-img"
            src="/images/vector-img/right-bottom.png"
            alt=""
          />
          <div className="container">
            <div className="row">
              <div className="col-xl-7">
                <div className="position-relative">
                  <div className="list-meta d-sm-flex align-items-center">
                    <a className="position-relative freelancer-single-style">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center bgc-white default-box-shadow1 mb15-sm"
                        style={{ width: 100, height: 100 }}
                      >
                        <AdminLogo
                          logo={info?.logo ?? null}
                          website={info?.website ?? null}
                          name={adminName}
                          size={70}
                          placeholderVariant="light"
                        />
                      </div>
                      <span className="online2" />
                    </a>
                    <div className="ml20 ml0-xs">
                      <h5 className="title mb-1">{adminName}</h5>
                      <p className="text fz14 mb-2">
                        {info?.description || "Administradora de Consórcios"}
                      </p>
                      <p className="mb-0 dark-color fz15 fw500 list-inline-item mb5-sm">
                        <i className="fas fa-star vam fz10 review-color me-2" />
                        {info?.rating || 4.8}{" "}
                        <span className="body-color fw400">
                          ({info?.reviews || 0} avaliações)
                        </span>
                      </p>
                      <p className="mb-0 dark-color fz15 fw500 list-inline-item ml15 mb5-sm ml0-xs">
                        <i className="flaticon-place vam fz20 me-2" />
                        {info?.location || "Brasil"}
                      </p>
                      <p className="mb-0 dark-color fz15 fw500 list-inline-item ml15 mb5-sm ml0-xs">
                        <i className="flaticon-calendar vam fz20 me-2" />
                        Desde {info?.founded || "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EmplyeeDetail1 — Main content */}
      <section className="pt10 pb90 pb30-md">
        <div className="container">
          <div className="row">
            {/* col-lg-8 Main content */}
            <div className="col-lg-8">
              <div className="service-about">

                {/* Tabs */}
                <div className="navpill-style2 mb30">
                  <ul className="nav nav-pills">
                    {tabOptions.map((tab) => (
                      <li key={tab} className="nav-item">
                        <button
                          className={`nav-link fw500 dark-color ${
                            activeTab === tab ? "active" : ""
                          }`}
                          onClick={() => setActiveTab(tab)}
                        >
                          {tab}
                          {tab === "Grupos" && (
                            <span className="ms-1 fz12">
                              ({adminGroups.length})
                            </span>
                          )}
                          {tab === "Cotas Disponíveis" && (
                            <span className="ms-1 fz12">
                              ({adminQuotas.length})
                            </span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* ---- TAB: SOBRE ---- */}
                {activeTab === "Sobre" && (
                  <>
                    <h4 className="mb20">Sobre a {adminName}</h4>
                    <p className="text mb30">
                      {info?.about ||
                        "Informações sobre a administradora não disponíveis."}
                    </p>

                    <h5 className="mb20 mt60">Quem somos?</h5>
                    <p className="text mb30">
                      Somos uma administradora de consórcios regulamentada pelo
                      Banco Central do Brasil, com compromisso total com a
                      transparência, segurança e satisfação dos nossos cotistas.
                      Nossos grupos são bem estruturados, com assembleias mensais
                      e regras claras de contemplação.
                    </p>

                    <h5 className="mb20 mt60">O que oferecemos?</h5>
                    <p className="text mb30">
                      Oferecemos planos de consórcio para imóveis, veículos e
                      serviços com as melhores condições do mercado. Sem juros,
                      com taxas de administração competitivas e total segurança
                      jurídica para a transferência de titularidade.
                    </p>

                    {/* Stats grid */}
                    <div className="row mt40 mb40">
                      <div className="col-sm-6 col-xl-3 mb20">
                        <div className="iconbox-style1 bdr1 p20 bdrs8 text-center">
                          <span className="flaticon-document fz30 text-thm2 d-block mb10" />
                          <h4 className="mb-0">{adminGroups.length}</h4>
                          <p className="text fz13 mb-0">Grupos</p>
                        </div>
                      </div>
                      <div className="col-sm-6 col-xl-3 mb20">
                        <div className="iconbox-style1 bdr1 p20 bdrs8 text-center">
                          <span className="flaticon-contract fz30 text-thm2 d-block mb10" />
                          <h4 className="mb-0">{totalQuotas}</h4>
                          <p className="text fz13 mb-0">Total de Cotas</p>
                        </div>
                      </div>
                      <div className="col-sm-6 col-xl-3 mb20">
                        <div className="iconbox-style1 bdr1 p20 bdrs8 text-center">
                          <span className="flaticon-like fz30 text-thm2 d-block mb10" />
                          <h4 className="mb-0">{totalContemplated}</h4>
                          <p className="text fz13 mb-0">Contempladas</p>
                        </div>
                      </div>
                      <div className="col-sm-6 col-xl-3 mb20">
                        <div className="iconbox-style1 bdr1 p20 bdrs8 text-center">
                          <span className="flaticon-group fz30 text-thm2 d-block mb10" />
                          <h4 className="mb-0">{activeGroups}</h4>
                          <p className="text fz13 mb-0">Grupos Ativos</p>
                        </div>
                      </div>
                    </div>

                    {/* Featured groups as "Projects" */}
                    <div className="row">
                      <h4 className="mb25">Grupos em Destaque</h4>
                      {adminGroups.slice(0, 3).map((g) => {
                        const gQuotas = mockQuotas.filter(
                          (q) => q.groupCode === g.code
                        );
                        return (
                          <div key={g.id} className="col-sm-6 col-xl-12 mb20">
                            <div className="job-list-style1 bdr1 d-xl-flex align-items-start">
                              <div className="icon d-flex align-items-center mb20">
                                <div
                                  className="rounded-circle d-flex align-items-center justify-content-center bgc-thm2"
                                  style={{ width: 56, height: 56 }}
                                >
                                  <i
                                    className={`${
                                      g.goodType === "imovel"
                                        ? "flaticon-home"
                                        : g.goodType === "veiculo"
                                        ? "fas fa-car"
                                        : "flaticon-briefcase"
                                    } text-white fz20`}
                                  />
                                </div>
                                <span className="fav-icon flaticon-star" />
                              </div>
                              <div className="details ml20 ml0-xl">
                                <h5>{g.code}</h5>
                                <h6 className="mb-3 text-thm">
                                  {g.administradora} &bull; {g.goodTypeLabel}
                                </h6>
                                <p className="list-inline-item mb-0">
                                  {formatCurrency(g.creditValue)} crédito
                                </p>
                                <p className="list-inline-item mb-0 bdrl1 pl15">
                                  {g.term} meses
                                </p>
                                <p className="list-inline-item mb-0 bdrl1 pl15">
                                  Taxa {g.adminFee}%
                                </p>
                                <p className="list-inline-item mb-0 bdrl1 pl15">
                                  {gQuotas.length} cotas disponíveis
                                </p>
                                <div className="mt10">
                                  <Link
                                    href={`/marketplace/grupos/${g.id}`}
                                    className="ud-btn btn-light-thm btn-sm me-2 fz13"
                                  >
                                    Detalhes
                                  </Link>
                                  <Link
                                    href={`/marketplace/grupos/${g.id}/cotas`}
                                    className="ud-btn btn-thm btn-sm fz13"
                                  >
                                    Ver Cotas ({gQuotas.length})
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Reviews */}
                    <div className="product_single_content mb50">
                      <div className="mbp_pagination_comments">
                        <div className="row">
                          <div className="col-lg-12">
                            <div className="total_review mb30 mt45">
                              <h4>{info?.reviews || 0} Avaliações</h4>
                            </div>
                            <div className="d-md-flex align-items-center mb30">
                              <div className="total-review-box d-flex align-items-center text-center mb30-sm">
                                <div className="wrapper mx-auto">
                                  <div className="t-review mb15">
                                    {info?.rating || 4.8}
                                  </div>
                                  <h5>Excelente</h5>
                                  <p className="text mb-0">
                                    {info?.reviews || 0} avaliações
                                  </p>
                                </div>
                              </div>
                              <div className="wrapper ml60 ml0-sm">
                                {[
                                  { star: "5", pct: "78%", count: Math.round((info?.reviews || 100) * 0.78) },
                                  { star: "4", pct: "14%", count: Math.round((info?.reviews || 100) * 0.14) },
                                  { star: "3", pct: "5%",  count: Math.round((info?.reviews || 100) * 0.05) },
                                  { star: "2", pct: "2%",  count: Math.round((info?.reviews || 100) * 0.02) },
                                  { star: "1", pct: "1%",  count: Math.round((info?.reviews || 100) * 0.01) },
                                ].map((r) => (
                                  <div
                                    key={r.star}
                                    className="review-list d-flex align-items-center mb10"
                                  >
                                    <div className="list-number">{r.star} Estrela{r.star !== "1" ? "s" : ""}</div>
                                    <div className="progress">
                                      <div
                                        className="progress-bar"
                                        style={{ width: r.pct }}
                                      />
                                    </div>
                                    <div className="value text-end">{r.count}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          {[
                            { name: "João Pereira", date: "10 Fev 2026", text: "Ótima administradora! Processo de contemplação muito transparente e assembleia bem organizada. Consegui meu imóvel em 3 anos." },
                            { name: "Ana Costa", date: "22 Jan 2026", text: "Excelente atendimento e grupo bem gerenciado. As parcelas foram reajustadas de forma justa e o processo de repasse foi tranquilo." },
                          ].map((review, i) => (
                            <div key={i} className="col-md-12">
                              <div className={`mbp_first position-relative d-flex align-items-center justify-content-start ${i > 0 ? "mt30" : ""} mb30-sm`}>
                                <img
                                  src="/images/blog/comments-2.png"
                                  className="mr-3"
                                  alt="reviewer"
                                />
                                <div className="ml20">
                                  <h6 className="mt-0 mb-0">{review.name}</h6>
                                  <span className="fz14">{review.date}</span>
                                </div>
                              </div>
                              <p className="text mt20 mb20">{review.text}</p>
                              <div className={`review_cansel_btns d-flex ${i === 1 ? "pb30" : ""}`}>
                                <a style={{ cursor: "pointer" }}>
                                  <i className="fas fa-thumbs-up" /> Útil
                                </a>
                                <a style={{ cursor: "pointer" }}>
                                  <i className="fas fa-thumbs-down" /> Não útil
                                </a>
                              </div>
                            </div>
                          ))}
                          <div className="col-md-12">
                            <div className="position-relative bdrb1 pb50">
                              <a
                                className="ud-btn btn-light-thm"
                                style={{ cursor: "pointer" }}
                              >
                                Ver Mais Avaliações
                                <i className="fal fa-arrow-right-long" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Add a Review */}
                    <div className="bsp_reveiw_wrt mb20">
                      <h6 className="fz17">Deixar uma Avaliação</h6>
                      <p className="text">
                        Compartilhe sua experiência com esta administradora.
                      </p>
                      <h6>Sua nota</h6>
                      <div className="d-flex">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <i
                            key={s}
                            className={`${s === 1 ? "fas" : "far"} fa-star review-color ${s > 1 ? "ms-2" : ""}`}
                          />
                        ))}
                      </div>
                      <form className="comments_form mt30 mb30-md">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="mb-4">
                              <label className="fw500 fz16 ff-heading dark-color mb-2">
                                Comentário
                              </label>
                              <textarea
                                className="pt15"
                                rows={5}
                                placeholder="Conte sua experiência com esta administradora..."
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb20">
                              <label className="fw500 ff-heading dark-color mb-2">
                                Nome
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Seu nome"
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb20">
                              <label className="fw500 ff-heading dark-color mb-2">
                                E-mail
                              </label>
                              <input
                                type="email"
                                className="form-control"
                                placeholder="seu@email.com"
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="checkbox-style1 d-block d-sm-flex align-items-center justify-content-between mb20">
                              <label className="custom_checkbox fz15 ff-heading">
                                Salvar meus dados para próxima avaliação.
                                <input type="checkbox" />
                                <span className="checkmark" />
                              </label>
                            </div>
                            <a className="ud-btn btn-thm" style={{ cursor: "pointer" }}>
                              Enviar Avaliação
                              <i className="fal fa-arrow-right-long" />
                            </a>
                          </div>
                        </div>
                      </form>
                    </div>
                  </>
                )}

                {/* ---- TAB: GRUPOS ---- */}
                {activeTab === "Grupos" && (
                  <>
                    <div className="d-flex align-items-center justify-content-between mb20">
                      <h4 className="mb-0">
                        Grupos da {adminName}
                      </h4>
                      <select
                        className="form-select form-select-sm fz14"
                        style={{ width: "auto" }}
                        value={groupFilter}
                        onChange={(e) => setGroupFilter(e.target.value)}
                      >
                        <option value="">Todos os status</option>
                        <option value="em_andamento">Em Andamento</option>
                        <option value="formacao">Em Formação</option>
                        <option value="encerrado">Encerrado</option>
                      </select>
                    </div>
                    {filteredGroups.length === 0 ? (
                      <div className="text-center py-5">
                        <span className="flaticon-document fz50 text-thm2 d-block mb20" />
                        <h4>Nenhum grupo encontrado</h4>
                      </div>
                    ) : (
                      <div className="row">
                        {filteredGroups.map((g) => {
                          const gProgress = Math.round(
                            (g.currentAssembly / g.term) * 100
                          );
                          const gQuotas = mockQuotas.filter(
                            (q) => q.groupCode === g.code
                          );
                          return (
                            <div key={g.id} className="col-sm-6 mb30">
                              <div className="default-box-shadow1 bdrs8 p25 h-100 d-flex flex-column">
                                <div className="d-flex align-items-center justify-content-between mb10">
                                  <span className={`tag ${getGroupStatusClass(g.status)}`}>
                                    {getGroupStatusLabel(g.status)}
                                  </span>
                                  <span className="fz13 text">{g.goodTypeLabel}</span>
                                </div>
                                <h5 className="mb5">{g.code}</h5>
                                <p className="fz14 mb-0 fw500">
                                  {formatCurrency(g.creditValue)}
                                </p>
                                <p className="text fz13 mb15">
                                  {g.term} meses &bull; Taxa {g.adminFee}% &bull; FR {g.reserveFund}%
                                </p>
                                <div className="row fz13 mb10">
                                  <div className="col-4 text-center">
                                    <span className="fw600 d-block">{g.totalQuotas}</span>
                                    <span className="text">Total</span>
                                  </div>
                                  <div className="col-4 text-center">
                                    <span className="fw600 d-block">{g.activeQuotas}</span>
                                    <span className="text">Ativas</span>
                                  </div>
                                  <div className="col-4 text-center">
                                    <span className="fw600 d-block">{g.contemplatedQuotas}</span>
                                    <span className="text">Contempl.</span>
                                  </div>
                                </div>
                                <div className="mb5">
                                  <div className="d-flex justify-content-between fz12 mb3">
                                    <span>Assembleia {g.currentAssembly}/{g.term}</span>
                                    <span>{gProgress}%</span>
                                  </div>
                                  <div className="progress" style={{ height: 5 }}>
                                    <div className="progress-bar bgc-thm" style={{ width: `${gProgress}%` }} />
                                  </div>
                                </div>
                                <p className="text fz12 mb15 mt5">
                                  Próxima assembleia: {g.nextAssemblyDate}
                                </p>
                                <div className="mt-auto d-flex gap-2">
                                  <Link href={`/marketplace/grupos/${g.id}`} className="ud-btn btn-light-thm btn-sm flex-grow-1 fz13">
                                    Detalhes
                                  </Link>
                                  <Link href={`/marketplace/grupos/${g.id}/cotas`} className="ud-btn btn-thm btn-sm flex-grow-1 fz13">
                                    Cotas ({gQuotas.length})
                                  </Link>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}

                {/* ---- TAB: COTAS ---- */}
                {activeTab === "Cotas Disponíveis" && (
                  <>
                    <div className="d-flex align-items-center justify-content-between mb20">
                      <h4 className="mb-0">
                        Cotas disponíveis da {adminName}
                      </h4>
                      <select
                        className="form-select form-select-sm fz14"
                        style={{ width: "auto" }}
                        value={quotaFilter}
                        onChange={(e) => setQuotaFilter(e.target.value)}
                      >
                        <option value="">Todos os status</option>
                        <option value="ativa">Ativas</option>
                        <option value="contemplada">Contempladas</option>
                        <option value="cancelada">Canceladas</option>
                      </select>
                    </div>
                    {filteredQuotas.length === 0 ? (
                      <div className="text-center py-5">
                        <span className="flaticon-contract fz50 text-thm2 d-block mb20" />
                        <h4>Nenhuma cota encontrada</h4>
                        <p className="text">Tente remover o filtro selecionado.</p>
                      </div>
                    ) : (
                      filteredQuotas.map((q) => (
                        <div key={q.id} className="mb20">
                          <QuotaListCard data={q} />
                        </div>
                      ))
                    )}
                  </>
                )}
              </div>
            </div>

            {/* col-lg-4 Sidebar — AboutMe1 */}
            <div className="col-lg-4">
              <div className="blog-sidebar ms-lg-auto">
                <div className="price-widget pt25 widget-mt-minus bdrs8">
                  <h4 className="widget-title">Sobre a Administradora</h4>
                  <div className="category-list mt20">
                    <a className="d-flex align-items-center justify-content-between bdrb1 pb-2">
                      <span className="text">
                        <i className="flaticon-menu text-thm2 pe-2 vam" />
                        Segmentos
                      </span>
                      <span className="fz13">
                        {[...new Set(adminGroups.map((g) => g.goodTypeLabel))].join(", ") || "—"}
                      </span>
                    </a>
                    <a className="d-flex align-items-center justify-content-between bdrb1 pb-2">
                      <span className="text">
                        <i className="flaticon-factory text-thm2 pe-2 vam" />
                        Porte
                      </span>
                      <span className="fz13">{info?.size || "—"}</span>
                    </a>
                    <a className="d-flex align-items-center justify-content-between bdrb1 pb-2">
                      <span className="text">
                        <i className="flaticon-calendar text-thm2 pe-2 vam" />
                        Fundação
                      </span>
                      <span>{info?.founded || "—"}</span>
                    </a>
                    <a className="d-flex align-items-center justify-content-between bdrb1 pb-2">
                      <span className="text">
                        <i className="flaticon-call text-thm2 pe-2 vam" />
                        Telefone
                      </span>
                      <span className="fz13">{info?.phone || "—"}</span>
                    </a>
                    <a className="d-flex align-items-center justify-content-between bdrb1 pb-2">
                      <span className="text">
                        <i className="flaticon-mail text-thm2 pe-2 vam" />
                        E-mail
                      </span>
                      <span className="fz12">{info?.email || "—"}</span>
                    </a>
                    <a className="d-flex align-items-center justify-content-between bdrb1 pb-2">
                      <span className="text">
                        <i className="flaticon-place text-thm2 pe-2 vam" />
                        Localização
                      </span>
                      <span>{info?.location || "Brasil"}</span>
                    </a>
                    <a className="d-flex align-items-center justify-content-between pb-2">
                      <span className="text">
                        <i className="flaticon-shield text-thm2 pe-2 vam" />
                        Regulamentação
                      </span>
                      <span className="fz12">{info?.regulated || "Banco Central"}</span>
                    </a>
                  </div>
                  <div className="d-grid mt20">
                    <Link
                      href={`/marketplace/administradoras/${slug}?tab=cotas`}
                      className="ud-btn btn-thm"
                      onClick={() => setActiveTab("Cotas Disponíveis")}
                    >
                      Ver Cotas Disponíveis
                      <i className="fal fa-arrow-right-long" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* JobInvision1 — More groups at the bottom */}
      <section className="pt-0 pb90 pb30-md">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="mb30">
                <h2>
                  {adminGroups.length} grupo{adminGroups.length !== 1 ? "s" : ""} na {adminName}
                </h2>
                <p className="text">
                  {adminQuotas.length} cotas disponíveis no marketplace
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            {adminGroups.map((g) => {
              const gQuotas = mockQuotas.filter((q) => q.groupCode === g.code);
              return (
                <div key={g.id} className="col-sm-6 col-lg-4 col-xl-3 mb30">
                  <div className="default-box-shadow1 bdrs8 p20 h-100 d-flex flex-column">
                    <div className="d-flex align-items-center mb15">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center bgc-thm2 flex-shrink-0"
                        style={{ width: 44, height: 44 }}
                      >
                        <i
                          className={`${
                            g.goodType === "imovel"
                              ? "flaticon-home"
                              : g.goodType === "veiculo"
                              ? "fas fa-car"
                              : "flaticon-briefcase"
                          } text-white fz16`}
                        />
                      </div>
                      <div className="ml15">
                        <h6 className="mb-0">{g.code}</h6>
                        <p className="fz12 text mb-0">{g.goodTypeLabel}</p>
                      </div>
                    </div>
                    <p className="fz14 fw500 mb5">
                      {formatCurrency(g.creditValue)}
                    </p>
                    <p className="fz13 text mb10">
                      {g.term} meses &bull; Taxa {g.adminFee}%
                    </p>
                    <span className={`tag mb15 ${getGroupStatusClass(g.status)}`}>
                      {getGroupStatusLabel(g.status)}
                    </span>
                    <div className="progress mb5" style={{ height: 4 }}>
                      <div
                        className="progress-bar bgc-thm"
                        style={{
                          width: `${Math.round((g.currentAssembly / g.term) * 100)}%`,
                        }}
                      />
                    </div>
                    <p className="fz12 text mb15">
                      {gQuotas.length} cotas disponíveis
                    </p>
                    <div className="mt-auto">
                      <Link
                        href={`/marketplace/grupos/${g.id}/cotas`}
                        className="ud-btn btn-thm w-100 fz13"
                      >
                        Ver Cotas
                        <i className="fal fa-arrow-right-long" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
