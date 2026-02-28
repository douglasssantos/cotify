"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { mockQuotas } from "@/data/mock-quotas";
import {
  formatCurrency,
  formatPercent,
  getStatusColor,
  getStatusLabel,
} from "@/lib/utils";

const tabCategories = [
  "Todas as Categorias",
  "Imóveis",
  "Veículos",
  "Serviços",
  "Contempladas",
  "Ativas",
  "Canceladas",
];

export default function QuotaDetailPage() {
  const params = useParams();
  const quota = mockQuotas.find((q) => q.id === params.id);
  const [shareToggle, setShareToggle] = useState(false);
  const [saveToggle, setSaveToggle] = useState(false);

  if (!quota) {
    return (
      <div className="container py-5 text-center" style={{ marginTop: 100 }}>
        <h2>Cota não encontrada</h2>
        <Link href="/marketplace" className="ud-btn btn-thm mt20">
          Voltar ao Marketplace <i className="fal fa-arrow-right-long" />
        </Link>
      </div>
    );
  }

  const paidPercentage = Math.round(
    (quota.paidAmount / quota.creditValue) * 100
  );
  const paidInstallments =
    quota.totalInstallments - quota.remainingInstallments;

  const tags = [
    quota.goodTypeLabel,
    getStatusLabel(quota.status),
    quota.administradora,
    `Taxa ${quota.adminFee}%`,
    `FR ${quota.reserveFund}%`,
    `${quota.totalInstallments} meses`,
  ];

  return (
    <>
      {/* TabSection1 */}
      <section className="categories_list_section overflow-hidden">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="listings_category_nav_list_menu">
                <ul className="mb0 d-flex ps-0">
                  {tabCategories.map((item, i) => (
                    <li key={i}>
                      <Link
                        href="/marketplace"
                        className={item === "Todas as Categorias" ? "active" : ""}
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcumb10 */}
      <section className="breadcumb-section">
        <div className="container">
          <div className="row">
            <div className="col-sm-8 col-lg-10">
              <div className="breadcumb-style1 mb10-xs">
                <div className="breadcumb-list">
                  <Link href="/">Início</Link>
                  <Link href="/marketplace">Marketplace</Link>
                  <a>Cota #{quota.quotaNumber}</a>
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
                      <a>
                        <i className="fa-brands fa-facebook-f" />
                      </a>
                      <a>
                        <i className="fa-brands fa-twitter" />
                      </a>
                      <a>
                        <i className="fa-brands fa-linkedin-in" />
                      </a>
                      <a>
                        <i className="fa-brands fa-whatsapp" />
                      </a>
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

      {/* ProjectDetail2 */}
      <section className="pt30 pb90">
        <div className="container">
          <div className="row wrap">
            {/* Left Column */}
            <div className="col-lg-8">
              {/* CTA Banner */}
              <div className="cta-service-v1 mb30 freelancer-single-v1 pt60 pb60 bdrs16 position-relative overflow-hidden d-flex align-items-center">
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
                <div className="row">
                  <div className="col-xl-12">
                    <div className="position-relative pl60 pl20-sm">
                      <h2>
                        Carta de Crédito {formatCurrency(quota.creditValue)}
                      </h2>
                      <div className="list-meta mt15">
                        <p className="mb-0 dark-color fz15 fw500 list-inline-item mb5-sm">
                          <i className="flaticon-place vam fz20 text-thm2 me-2" />
                          {quota.administradora}
                        </p>
                        <p className="mb-0 dark-color fz15 fw500 list-inline-item ml15 mb5-sm ml0-xs">
                          <i className="flaticon-calendar text-thm2 vam fz20 me-2" />
                          Grupo {quota.groupCode}
                        </p>
                        <p className="mb-0 dark-color fz15 fw500 list-inline-item ml15 mb5-sm ml0-xs">
                          <i className="flaticon-website text-thm2 vam fz20 me-2" />
                          Cota #{quota.quotaNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Cards - iconbox-style1 contact-style */}
              <div className="column">
                <div className="scrollbalance-inner">
                  <div className="row">
                    <div className="col-sm-6 col-xl-4">
                      <div className="iconbox-style1 contact-style d-flex align-items-start mb30">
                        <div className="icon flex-shrink-0">
                          <span className="flaticon-home" />
                        </div>
                        <div className="details">
                          <h5 className="title">Tipo de Bem</h5>
                          <p className="mb-0 text">{quota.goodTypeLabel}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-6 col-xl-4">
                      <div className="iconbox-style1 contact-style d-flex align-items-start mb30">
                        <div className="icon flex-shrink-0">
                          <span className="flaticon-like-1" />
                        </div>
                        <div className="details">
                          <h5 className="title">Status</h5>
                          <p className="mb-0 text">
                            {getStatusLabel(quota.status)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-6 col-xl-4">
                      <div className="iconbox-style1 contact-style d-flex align-items-start mb30">
                        <div className="icon flex-shrink-0">
                          <span className="flaticon-dollar" />
                        </div>
                        <div className="details">
                          <h5 className="title">Parcela Mensal</h5>
                          <p className="mb-0 text">
                            {formatCurrency(quota.installmentValue)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-6 col-xl-4">
                      <div className="iconbox-style1 contact-style d-flex align-items-start mb30">
                        <div className="icon flex-shrink-0">
                          <span className="flaticon-fifteen" />
                        </div>
                        <div className="details">
                          <h5 className="title">Prazo Total</h5>
                          <p className="mb-0 text">
                            {quota.totalInstallments} meses
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-6 col-xl-4">
                      <div className="iconbox-style1 contact-style d-flex align-items-start mb30">
                        <div className="icon flex-shrink-0">
                          <span className="flaticon-notification-1" />
                        </div>
                        <div className="details">
                          <h5 className="title">Taxa de Administração</h5>
                          <p className="mb-0 text">
                            {formatPercent(quota.adminFee)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-6 col-xl-4">
                      <div className="iconbox-style1 contact-style d-flex align-items-start mb30">
                        <div className="icon flex-shrink-0">
                          <span className="flaticon-goal" />
                        </div>
                        <div className="details">
                          <h5 className="title">Fundo de Reserva</h5>
                          <p className="mb-0 text">
                            {formatPercent(quota.reserveFund)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="service-about">
                    <h4>Detalhes da Cota</h4>
                    <p className="text mb30">
                      Carta de crédito no valor de{" "}
                      {formatCurrency(quota.creditValue)} administrada pela{" "}
                      {quota.administradora}. Esta cota pertence ao grupo{" "}
                      {quota.groupCode} e está atualmente com status{" "}
                      <strong>{getStatusLabel(quota.status).toLowerCase()}</strong>.
                      Já foram pagas {paidInstallments} de{" "}
                      {quota.totalInstallments} parcelas, totalizando{" "}
                      {formatCurrency(quota.paidAmount)} pagos até o momento (
                      {paidPercentage}% do crédito).
                    </p>
                    <p className="text mb30">
                      A parcela mensal atual é de{" "}
                      {formatCurrency(quota.installmentValue)}, com taxa de
                      administração de {formatPercent(quota.adminFee)} e fundo de
                      reserva de {formatPercent(quota.reserveFund)}. Restam{" "}
                      {quota.remainingInstallments} parcelas para a quitação
                      completa do consórcio.
                    </p>

                    <hr className="opacity-100 mb60 mt60" />

                    {/* Progress */}
                    <h4 className="mb30">Progresso do Pagamento</h4>
                    <div className="row mb30">
                      <div className="col-6 col-lg-3">
                        <div className="project-attach">
                          <h6 className="title">Valor Pago</h6>
                          <p>{formatCurrency(quota.paidAmount)}</p>
                          <span className="icon flaticon-dollar" />
                        </div>
                      </div>
                      <div className="col-6 col-lg-3">
                        <div className="project-attach">
                          <h6 className="title">Parcelas Pagas</h6>
                          <p>
                            {paidInstallments}/{quota.totalInstallments}
                          </p>
                          <span className="icon flaticon-calendar" />
                        </div>
                      </div>
                      <div className="col-6 col-lg-3">
                        <div className="project-attach">
                          <h6 className="title">Restantes</h6>
                          <p>{quota.remainingInstallments} meses</p>
                          <span className="icon flaticon-fifteen" />
                        </div>
                      </div>
                      <div className="col-6 col-lg-3">
                        <div className="project-attach">
                          <h6 className="title">Progresso</h6>
                          <p>{paidPercentage}%</p>
                          <span className="icon flaticon-like-1" />
                        </div>
                      </div>
                    </div>

                    <div className="mb30">
                      <div className="progress" style={{ height: 10 }}>
                        <div
                          className="progress-bar bgc-thm"
                          style={{ width: `${paidPercentage}%` }}
                        />
                      </div>
                    </div>

                    <hr className="opacity-100 mb60 mt30" />

                    {/* Tags */}
                    <h4 className="mb30">Características</h4>
                    <div className="mb60">
                      {tags.map((item, i) => (
                        <a
                          key={i}
                          className="tag list-inline-item mb-2 mb-xl-0 mr10"
                        >
                          {item}
                        </a>
                      ))}
                      {quota.profitability && (
                        <a className="tag list-inline-item mb-2 mb-xl-0 mr10 text-thm">
                          <i className="fas fa-arrow-up mr5" />
                          Rentabilidade {quota.profitability}%
                        </a>
                      )}
                    </div>

                    <hr className="opacity-100 mb60" />

                    {/* Send Proposal Form */}
                    <div className="bsp_reveiw_wrt mt25">
                      <h4>Fazer uma Proposta</h4>
                      <form className="comments_form mt30 mb30-md">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="mb20">
                              <label className="fw500 ff-heading dark-color mb-2">
                                Valor da Proposta
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder={formatCurrency(
                                  quota.listingPrice || quota.paidAmount
                                )}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb20">
                              <label className="fw500 ff-heading dark-color mb-2">
                                Forma de Pagamento
                              </label>
                              <select className="form-control form-select">
                                <option>À vista via Escrow</option>
                                <option>Parcelado</option>
                                <option>Entrada + Parcelas</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-4">
                              <label className="fw500 fz16 ff-heading dark-color mb-2">
                                Mensagem ao Vendedor
                              </label>
                              <textarea
                                className="pt15"
                                rows={6}
                                placeholder="Descreva sua proposta, condições desejadas e qualquer informação adicional relevante..."
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="extra-service-tab mb40 mt30">
                              <nav>
                                <div className="nav flex-column nav-tabs">
                                  <button className="nav-link" type="button">
                                    <label className="custom_checkbox fw500 text-start">
                                      Aceito os termos de transferência
                                      <span className="text text-bottom">
                                        Concordo com os termos e condições para
                                        transferência de cota
                                      </span>
                                      <input type="checkbox" />
                                      <span className="checkmark" />
                                    </label>
                                  </button>
                                  <button className="nav-link" type="button">
                                    <label className="custom_checkbox fw500 text-start">
                                      Possuo documentação em dia
                                      <span className="text text-bottom">
                                        Confirmo que possuo toda documentação
                                        necessária para a transferência
                                      </span>
                                      <input type="checkbox" />
                                      <span className="checkmark" />
                                    </label>
                                  </button>
                                </div>
                              </nav>
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="d-grid">
                              <a className="ud-btn btn-thm" style={{ cursor: "pointer" }}>
                                Enviar Proposta
                                <i className="fal fa-arrow-right-long" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="col-lg-4">
              <div className="column">
                <div className="scrollbalance-inner">
                  <div className="blog-sidebar ms-lg-auto">
                    {/* ProjectPriceWidget1 */}
                    <div className="price-widget pt25 bdrs8">
                      <h3 className="widget-title">
                        {formatCurrency(
                          quota.listingPrice || quota.paidAmount
                        )}
                      </h3>
                      <p className="text fz14">
                        Parcela: {formatCurrency(quota.installmentValue)}/mês
                      </p>
                      <div className="d-grid">
                        <a className="ud-btn btn-thm" href="#fazer-proposta" style={{ cursor: "pointer" }}>
                          Comprar esta Cota
                          <i className="fal fa-arrow-right-long" />
                        </a>
                      </div>
                    </div>

                    {/* ProjectContactWidget1 - Administradora Info */}
                    <div className="freelancer-style1 service-single mb-0 bdrs8">
                      <h4>Sobre a Administradora</h4>
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
                          <h5 className="title mb-1">
                            {quota.administradora}
                          </h5>
                          <p className="mb-0">Administradora de Consórcios</p>
                          <div className="review">
                            <p>
                              <i className="fas fa-star fz10 review-color pr10" />
                              <span className="dark-color">4.8</span> (312
                              avaliações)
                            </p>
                          </div>
                        </div>
                      </div>
                      <hr className="opacity-100" />
                      <div className="details">
                        <div className="fl-meta d-flex align-items-center justify-content-between">
                          <a className="meta fw500 text-start">
                            Grupo
                            <br />
                            <span className="fz14 fw400">
                              {quota.groupCode}
                            </span>
                          </a>
                          <a className="meta fw500 text-start">
                            Cotistas
                            <br />
                            <span className="fz14 fw400">150+</span>
                          </a>
                          <a className="meta fw500 text-start">
                            Segmento
                            <br />
                            <span className="fz14 fw400">
                              {quota.goodTypeLabel}
                            </span>
                          </a>
                        </div>
                      </div>
                      <div className="d-grid mt30">
                        <Link
                          href="/marketplace"
                          className="ud-btn btn-thm-border"
                        >
                          Ver Mais Cotas
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
