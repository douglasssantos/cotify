"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  mockGroups,
  getGroupStatusLabel,
  getAssemblyStatusLabel,
  getWinnerTypeLabel,
} from "@/data/mock-groups";
import { formatCurrency, formatPercent } from "@/lib/utils";

export default function GroupDetailPage() {
  const params = useParams();
  const group = mockGroups.find((g) => g.id === params.id);
  const [shareToggle, setShareToggle] = useState(false);
  const [saveToggle, setSaveToggle] = useState(false);

  if (!group) {
    return (
      <div className="container py-5 text-center" style={{ marginTop: 100 }}>
        <h2>Grupo não encontrado</h2>
        <Link href="/marketplace/grupos" className="ud-btn btn-thm mt20">
          Voltar aos Grupos <i className="fal fa-arrow-right-long" />
        </Link>
      </div>
    );
  }

  const progressPercent = Math.round(
    (group.currentAssembly / group.term) * 100
  );
  const paidInstallments = group.currentAssembly;
  const realizadas = group.assemblies.filter((a) => a.status === "realizada");
  const agendadas = group.assemblies.filter((a) => a.status === "agendada");

  const tags = [
    group.goodTypeLabel,
    getGroupStatusLabel(group.status),
    group.administradora,
    `Taxa ${group.adminFee}%`,
    `FR ${group.reserveFund}%`,
    `${group.term} meses`,
    `${group.totalQuotas} cotas`,
  ];

  return (
    <>
      {/* TabSection1 */}
      {/* <section className="categories_list_section overflow-hidden">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="listings_category_nav_list_menu">
                <ul className="mb0 d-flex ps-0">
                  <li><Link href="/marketplace" className="">Cotas</Link></li>
                  <li><Link href="/marketplace/grupos" className="active">Grupos</Link></li>
                  <li><Link href="/marketplace/assembleias" className="">Assembleias</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Breadcumb10 */}
      <section className="breadcumb-section">
        <div className="container">
          <div className="row">
            <div className="col-sm-8 col-lg-10">
              <div className="breadcumb-style1 mb10-xs">
                <div className="breadcumb-list">
                  <Link href="/">Início</Link>
                  <Link href="/marketplace">Marketplace</Link>
                  <Link href="/marketplace/grupos">Grupos</Link>
                  <a>{group.code}</a>
                </div>
              </div>
            </div>
            <div className="col-sm-4 col-lg-2">
              <div className="d-flex align-items-center justify-content-sm-end">
                <a onClick={() => setShareToggle(!shareToggle)} className="position-relative ui-share-toggle" style={{ cursor: "pointer" }}>
                  <div className={`share-save-widget d-flex align-items-center ${shareToggle ? "active" : ""}`}>
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
                <a onClick={() => setSaveToggle(!saveToggle)} style={{ cursor: "pointer" }}>
                  <div className={`share-save-widget d-flex align-items-center ml15 ${saveToggle ? "active" : ""}`}>
                    <span className="icon flaticon-like dark-color fz12 mr10" />
                    <div className="h6 mb-0">Salvar</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detail */}
      <section className="pt30 pb90">
        <div className="container">
          <div className="row wrap">
            {/* Left */}
            <div className="col-lg-8">
              {/* Banner */}
              <div className="cta-service-v1 mb30 freelancer-single-v1 pt60 pb60 bdrs16 position-relative overflow-hidden d-flex align-items-center">
                <img className="left-top-img" src="/images/vector-img/left-top.png" alt="" />
                <img className="right-bottom-img" src="/images/vector-img/right-bottom.png" alt="" />
                <div className="row">
                  <div className="col-xl-12">
                    <div className="position-relative pl60 pl20-sm">
                      <h2>{group.code} — {formatCurrency(group.creditValue)}</h2>
                      <div className="list-meta mt15">
                        <p className="mb-0 dark-color fz15 fw500 list-inline-item mb5-sm">
                          <i className="flaticon-place vam fz20 text-thm2 me-2" />
                          {group.administradora}
                        </p>
                        <p className="mb-0 dark-color fz15 fw500 list-inline-item ml15 mb5-sm ml0-xs">
                          <i className="flaticon-calendar text-thm2 vam fz20 me-2" />
                          Assembleia {group.currentAssembly}ª de {group.term}
                        </p>
                        <p className="mb-0 dark-color fz15 fw500 list-inline-item ml15 mb5-sm ml0-xs">
                          <i className="flaticon-website text-thm2 vam fz20 me-2" />
                          {group.totalQuotas} cotas
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Cards */}
              <div className="column">
                <div className="scrollbalance-inner">
                  <div className="row">
                    <div className="col-sm-6 col-xl-4">
                      <div className="iconbox-style1 contact-style d-flex align-items-start mb30">
                        <div className="icon flex-shrink-0"><span className="flaticon-home" /></div>
                        <div className="details">
                          <h5 className="title">Tipo de Bem</h5>
                          <p className="mb-0 text">{group.goodTypeLabel}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-6 col-xl-4">
                      <div className="iconbox-style1 contact-style d-flex align-items-start mb30">
                        <div className="icon flex-shrink-0"><span className="flaticon-like-1" /></div>
                        <div className="details">
                          <h5 className="title">Status</h5>
                          <p className="mb-0 text">{getGroupStatusLabel(group.status)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-6 col-xl-4">
                      <div className="iconbox-style1 contact-style d-flex align-items-start mb30">
                        <div className="icon flex-shrink-0"><span className="flaticon-dollar" /></div>
                        <div className="details">
                          <h5 className="title">Crédito</h5>
                          <p className="mb-0 text">{formatCurrency(group.creditValue)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-6 col-xl-4">
                      <div className="iconbox-style1 contact-style d-flex align-items-start mb30">
                        <div className="icon flex-shrink-0"><span className="flaticon-fifteen" /></div>
                        <div className="details">
                          <h5 className="title">Prazo</h5>
                          <p className="mb-0 text">{group.term} meses</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-6 col-xl-4">
                      <div className="iconbox-style1 contact-style d-flex align-items-start mb30">
                        <div className="icon flex-shrink-0"><span className="flaticon-notification-1" /></div>
                        <div className="details">
                          <h5 className="title">Taxa Administração</h5>
                          <p className="mb-0 text">{formatPercent(group.adminFee)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-6 col-xl-4">
                      <div className="iconbox-style1 contact-style d-flex align-items-start mb30">
                        <div className="icon flex-shrink-0"><span className="flaticon-goal" /></div>
                        <div className="details">
                          <h5 className="title">Fundo de Reserva</h5>
                          <p className="mb-0 text">{formatPercent(group.reserveFund)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="service-about">
                    <h4>Sobre o Grupo</h4>
                    <p className="text mb30">
                      O grupo {group.code} é administrado pela {group.administradora}
                      {group.cooperativa && `, em parceria com a cooperativa ${group.cooperativa}`}
                      {group.comissionado && `, com comercialização pelo comissionado ${group.comissionado}`}.
                      Com carta de crédito de {formatCurrency(group.creditValue)} para {group.goodTypeLabel.toLowerCase()},
                      o grupo possui {group.totalQuotas} cotas, das quais {group.contemplatedQuotas} já foram contempladas
                      e {group.activeQuotas} permanecem ativas. O prazo total é de {group.term} meses.
                    </p>
                    <p className="text mb30">
                      Até o momento, o grupo arrecadou {formatCurrency(group.totalArrecadado)} em fundo comum
                      ({formatCurrency(group.fundoComum)}). A assembleia atual é a {group.currentAssembly}ª,
                      representando {progressPercent}% do prazo total.
                    </p>

                    <hr className="opacity-100 mb60 mt60" />

                    {/* Progress */}
                    <h4 className="mb30">Progresso do Grupo</h4>
                    <div className="row mb30">
                      <div className="col-6 col-lg-3">
                        <div className="project-attach">
                          <h6 className="title">Arrecadado</h6>
                          <p>{formatCurrency(group.totalArrecadado)}</p>
                          <span className="icon flaticon-dollar" />
                        </div>
                      </div>
                      <div className="col-6 col-lg-3">
                        <div className="project-attach">
                          <h6 className="title">Contempladas</h6>
                          <p>{group.contemplatedQuotas}/{group.totalQuotas}</p>
                          <span className="icon flaticon-like-1" />
                        </div>
                      </div>
                      <div className="col-6 col-lg-3">
                        <div className="project-attach">
                          <h6 className="title">Assembleia</h6>
                          <p>{paidInstallments}ª de {group.term}</p>
                          <span className="icon flaticon-calendar" />
                        </div>
                      </div>
                      <div className="col-6 col-lg-3">
                        <div className="project-attach">
                          <h6 className="title">Progresso</h6>
                          <p>{progressPercent}%</p>
                          <span className="icon flaticon-goal" />
                        </div>
                      </div>
                    </div>

                    <div className="mb30">
                      <div className="progress" style={{ height: 10 }}>
                        <div className="progress-bar bgc-thm" style={{ width: `${progressPercent}%` }} />
                      </div>
                    </div>

                    <hr className="opacity-100 mb60 mt30" />

                    {/* Tags */}
                    <h4 className="mb30">Características</h4>
                    <div className="mb60">
                      {tags.map((item, i) => (
                        <a key={i} className="tag list-inline-item mb-2 mb-xl-0 mr10">
                          {item}
                        </a>
                      ))}
                    </div>

                    <hr className="opacity-100 mb60" />

                    {/* Assemblies History */}
                    <h4 className="mb30">Histórico de Assembleias ({realizadas.length})</h4>
                    <div className="row">
                      {realizadas.length > 0 ? realizadas.map((assembly) => (
                        <div key={assembly.id} className="col-md-6 col-lg-12">
                          <div className="freelancer-style1 bdr1 hover-box-shadow row ms-0 align-items-lg-center">
                            <div className="col-lg-8 ps-0">
                              <div className="d-lg-flex bdrr1 bdrn-xl pr15 pr0-lg">
                                <div className="thumb w60 position-relative rounded-circle mb15-md">
                                  <div
                                    className="rounded-circle mx-auto d-flex align-items-center justify-content-center bgc-thm"
                                    style={{ width: 60, height: 60 }}
                                  >
                                    <span className="text-white fw700 fz18">
                                      {assembly.number}ª
                                    </span>
                                  </div>
                                </div>
                                <div className="details ml15 ml0-md mb15-md">
                                  <h5 className="title mb-3">
                                    Assembleia {assembly.number}ª — {assembly.type === "ordinaria" ? "Ordinária" : "Extraordinária"}
                                  </h5>
                                  <p className="mb-0 fz14 list-inline-item mb5-sm pe-1">
                                    <i className="flaticon-calendar fz16 vam text-thm2 me-1" />
                                    {new Date(assembly.date).toLocaleDateString("pt-BR")}
                                  </p>
                                  <p className="mb-0 fz14 list-inline-item mb5-sm pe-1">
                                    <i className="flaticon-user fz16 vam text-thm2 me-1 bdrl1 pl15 pl0-xs bdrn-xs" />
                                    {assembly.totalParticipants} participantes
                                  </p>
                                  <p className="mb-0 fz14 list-inline-item mb5-sm">
                                    <i className="flaticon-like-1 fz16 vam text-thm2 me-1 bdrl1 pl15 pl0-xs bdrn-xs" />
                                    {assembly.contemplatedCount} contemplados
                                  </p>
                                  <div className="skill-tags d-flex align-items-center justify-content-start mt10">
                                    <span className="tag">{getAssemblyStatusLabel(assembly.status)}</span>
                                    {assembly.winnerType && (
                                      <span className="tag mx10">{getWinnerTypeLabel(assembly.winnerType)}</span>
                                    )}
                                    {assembly.winnerQuota && (
                                      <span className="tag text-thm">{assembly.winnerQuota}</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-4 ps-0 ps-xl-3 pe-0">
                              <div className="details">
                                <div className="text-lg-end">
                                  {assembly.winnerBidValue ? (
                                    <>
                                      <h4>{assembly.winnerBidValue}%</h4>
                                      <p className="text">Lance vencedor</p>
                                    </>
                                  ) : (
                                    <>
                                      <h4>Sorteio</h4>
                                      <p className="text">Contemplação</p>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )) : (
                        <p className="body-color">Nenhuma assembleia realizada.</p>
                      )}
                    </div>

                    {/* Upcoming Assemblies */}
                    {agendadas.length > 0 && (
                      <>
                        <hr className="opacity-100 mb60 mt30" />
                        <h4 className="mb30">Próximas Assembleias ({agendadas.length})</h4>
                        <div className="row">
                          {agendadas.map((assembly) => (
                            <div key={assembly.id} className="col-md-6 col-lg-12">
                              <div className="freelancer-style1 bdr1 row ms-0 align-items-lg-center">
                                <div className="col-lg-8 ps-0">
                                  <div className="d-lg-flex bdrr1 bdrn-xl pr15 pr0-lg">
                                    <div className="thumb w60 position-relative rounded-circle mb15-md">
                                      <div
                                        className="rounded-circle mx-auto d-flex align-items-center justify-content-center bgc-thm4"
                                        style={{ width: 60, height: 60 }}
                                      >
                                        <span className="dark-color fw700 fz18">
                                          {assembly.number}ª
                                        </span>
                                      </div>
                                    </div>
                                    <div className="details ml15 ml0-md mb15-md">
                                      <h5 className="title mb-3">
                                        Assembleia {assembly.number}ª — {assembly.type === "ordinaria" ? "Ordinária" : "Extraordinária"}
                                      </h5>
                                      <p className="mb-0 fz14 list-inline-item mb5-sm pe-1">
                                        <i className="flaticon-calendar fz16 vam text-thm2 me-1" />
                                        {new Date(assembly.date).toLocaleDateString("pt-BR")}
                                      </p>
                                      <p className="mb-0 fz14 list-inline-item mb5-sm pe-1">
                                        <i className="flaticon-user fz16 vam text-thm2 me-1 bdrl1 pl15 pl0-xs bdrn-xs" />
                                        {assembly.totalParticipants} participantes
                                      </p>
                                      <div className="skill-tags d-flex align-items-center justify-content-start mt10">
                                        <span className="tag style2">{getAssemblyStatusLabel(assembly.status)}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-4 ps-0 ps-xl-3 pe-0">
                                  <div className="details">
                                    <div className="text-lg-end">
                                      <h5>{new Date(assembly.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "long" })}</h5>
                                      <p className="text">Data prevista</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Sidebar */}
            <div className="col-lg-4">
              <div className="column">
                <div className="scrollbalance-inner">
                  <div className="blog-sidebar ms-lg-auto">
                    {/* Price Widget */}
                    <div className="price-widget pt25 bdrs8">
                      <h3 className="widget-title">{group.totalQuotas} Cotas</h3>
                      <p className="text fz14">
                        Crédito: {formatCurrency(group.creditValue)}
                      </p>
                      <div className="d-grid">
                        <Link href={`/marketplace?grupo=${group.code}`} className="ud-btn btn-thm">
                          Ver Cotas Disponíveis
                          <i className="fal fa-arrow-right-long" />
                        </Link>
                      </div>
                    </div>

                    {/* Contact Widget - Administradora */}
                    <div className="freelancer-style1 service-single mb-0 bdrs8">
                      <h4>Administradora</h4>
                      <div className="wrapper d-flex align-items-center mt20">
                        <div className="thumb position-relative mb25">
                          <div
                            className="rounded-circle mx-auto d-flex align-items-center justify-content-center bgc-thm2"
                            style={{ width: 60, height: 60 }}
                          >
                            <i className="flaticon-home text-white fz24" />
                          </div>
                        </div>
                        <div className="ml20">
                          <h5 className="title mb-1">{group.administradora}</h5>
                          <p className="mb-0">Administradora de Consórcios</p>
                          <div className="review">
                            <p>
                              <i className="fas fa-star fz10 review-color pr10" />
                              <span className="dark-color">4.8</span> (312 avaliações)
                            </p>
                          </div>
                        </div>
                      </div>
                      <hr className="opacity-100" />
                      <div className="details">
                        <div className="fl-meta d-flex align-items-center justify-content-between">
                          <a className="meta fw500 text-start">
                            Cotas Ativas<br />
                            <span className="fz14 fw400">{group.activeQuotas}</span>
                          </a>
                          <a className="meta fw500 text-start">
                            Contempladas<br />
                            <span className="fz14 fw400">{group.contemplatedQuotas}</span>
                          </a>
                          <a className="meta fw500 text-start">
                            Segmento<br />
                            <span className="fz14 fw400">{group.goodTypeLabel}</span>
                          </a>
                        </div>
                      </div>
                      {group.cooperativa && (
                        <>
                          <hr className="opacity-100" />
                          <div className="mt15">
                            <p className="fz14 body-color mb5">Cooperativa</p>
                            <p className="fw500 mb-0">{group.cooperativa}</p>
                          </div>
                        </>
                      )}
                      {group.comissionado && (
                        <>
                          <hr className="opacity-100" />
                          <div className="mt15">
                            <p className="fz14 body-color mb5">Comissionado</p>
                            <p className="fw500 mb-0">{group.comissionado}</p>
                          </div>
                        </>
                      )}
                      <div className="d-grid gap-2 mt30">
                        <Link
                          href={`/marketplace/grupos/${group.id}/cotas`}
                          className="ud-btn btn-thm"
                        >
                          Ver Cotas Disponíveis
                          <i className="fal fa-arrow-right-long" />
                        </Link>
                        <Link
                          href={`/marketplace/administradoras/${group.administradora.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-")}`}
                          className="ud-btn btn-light-thm"
                        >
                          Ver {group.administradora}
                          <i className="fal fa-arrow-right-long" />
                        </Link>
                        <Link
                          href="/marketplace/grupos"
                          className="ud-btn btn-thm-border"
                        >
                          Ver Outros Grupos
                          <i className="fal fa-arrow-right-long" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
