"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import {
  mockRepasses,
  getConditionLabel,
  getConditionColor,
  getRepasseStatusLabel,
  getRepasseStatusColor,
  getCategoryIcon,
} from "@/data/mock-repasses";

export default function RepasseDetailPage() {
  const params = useParams();
  const item = mockRepasses.find((r) => r.id === params.id);

  const [shareToggle, setShareToggle] = useState(false);
  const [saveToggle, setSaveToggle] = useState(false);
  const [proposalValue, setProposalValue] = useState("");
  const [proposalMessage, setProposalMessage] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const imageCount = item?.images.length ?? 0;

  const goNext = useCallback(() => {
    setSelectedImage((prev) => (prev + 1) % imageCount);
  }, [imageCount]);

  const goPrev = useCallback(() => {
    setSelectedImage((prev) => (prev - 1 + imageCount) % imageCount);
  }, [imageCount]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "Escape") setLightboxOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxOpen, goNext, goPrev]);

  if (!item) {
    return (
      <section className="pt60 pb60">
        <div className="container text-center">
          <i className="flaticon-loupe" style={{ fontSize: 64, color: "#ccc" }} />
          <h3 className="mt20">Bem não encontrado</h3>
          <Link href="/marketplace/repasses" className="ud-btn btn-thm mt20">
            Voltar aos Repasses <i className="fal fa-arrow-right-long" />
          </Link>
        </div>
      </section>
    );
  }

  const cl = item.creditLetter;
  const paidPct = Math.round((cl.paidAmount / cl.creditValue) * 100);
  const remainingDebt = cl.remainingInstallments * cl.installmentValue;
  const totalPaid = cl.paidAmount;
  const totalAdminFee = cl.creditValue * (cl.adminFee / 100);
  const totalReserveFund = cl.creditValue * (cl.reserveFund / 100);
  const isVehicle = item.category === "veiculo" || item.category === "moto" || item.category === "caminhao";
  const isProperty = item.category === "imovel";

  const goodTags: string[] = [];
  if (isVehicle && item.vehicleDetails) {
    goodTags.push(item.vehicleDetails.fuel.split(" ")[0], item.vehicleDetails.transmission.split(" ")[0]);
    if (item.vehicleDetails.doors) goodTags.push(`${item.vehicleDetails.doors} portas`);
  }
  if (isProperty && item.propertyDetails) {
    if (item.propertyDetails.hasPool) goodTags.push("Piscina");
    if (item.propertyDetails.hasBarbecue) goodTags.push("Churrasqueira");
    if (item.propertyDetails.furnished) goodTags.push("Mobiliado");
  }

  return (
    <>
      {/* TabSection1 — Category navigation */}
      <section className="categories_list_section overflow-hidden">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="listings_category_nav_list_menu">
                <ul className="mb0 d-flex ps-0">
                  <li><Link href="/marketplace">Cotas</Link></li>
                  <li><Link href="/marketplace/grupos">Grupos</Link></li>
                  <li><a className="active" style={{ cursor: "pointer" }}>Repasses</a></li>
                  <li><Link href="/marketplace/assembleias">Assembleias</Link></li>
                  <li><Link href="/simulador">Simulador</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcumb10 — breadcrumb + share/save */}
      <section className="breadcumb-section">
        <div className="container">
          <div className="row">
            <div className="col-sm-8 col-lg-10">
              <div className="breadcumb-style1 mb10-xs">
                <div className="breadcumb-list">
                  <Link href="/">Início</Link>
                  <Link href="/marketplace">Marketplace</Link>
                  <Link href="/marketplace/repasses">Repasses</Link>
                  <a>{item.categoryLabel}</a>
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

      {/* ProjectDetail2 — Main content */}
      <section className="pt30 pb90">
        <div className="container">
          <div className="row wrap">
            {/* Left column — col-lg-8 */}
            <div className="col-lg-8">
              {/* CTA Banner */}
              <div className="cta-service-v1 mb30 freelancer-single-v1 pt60 pb60 bdrs16 position-relative overflow-hidden d-flex align-items-center">
                <img className="left-top-img" src="/images/vector-img/left-top.png" alt="" />
                <img className="right-bottom-img" src="/images/vector-img/right-bottom.png" alt="" />
                <div className="row">
                  <div className="col-xl-12">
                    <div className="position-relative pl60 pl20-sm">
                      <div className="d-flex align-items-center gap-2 mb10 flex-wrap">
                        <span className="text-white fz12 fw600" style={{ padding: "3px 12px", borderRadius: 20, backgroundColor: "#6f42c1" }}>
                          <i className={`${getCategoryIcon(item.category)} me-1`} /> {item.categoryLabel}
                        </span>
                        <span className="text-white fz12 fw600" style={{ padding: "3px 12px", borderRadius: 20, backgroundColor: getRepasseStatusColor(item.status) }}>
                          {getRepasseStatusLabel(item.status)}
                        </span>
                        <span className="text-white fz12 fw600" style={{ padding: "3px 12px", borderRadius: 20, backgroundColor: getConditionColor(item.condition) }}>
                          {getConditionLabel(item.condition)}
                        </span>
                      </div>
                      <h2>{item.title}</h2>
                      <div className="list-meta mt15">
                        <p className="mb-0 dark-color fz15 fw500 list-inline-item mb5-sm">
                          <i className="flaticon-place vam fz20 text-thm2 me-2" />
                          {cl.administradora}
                        </p>
                        <p className="mb-0 dark-color fz15 fw500 list-inline-item ml15 mb5-sm ml0-xs">
                          <i className="flaticon-document text-thm2 vam fz20 me-2" />
                          {cl.groupCode} / Cota {cl.quotaNumber}
                        </p>
                        <p className="mb-0 dark-color fz15 fw500 list-inline-item ml15 mb5-sm ml0-xs">
                          <i className="flaticon-website text-thm2 vam fz20 me-2" />
                          {item.views} Visualizações
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scrollbalance content */}
              <div className="column">
                <div className="scrollbalance-inner">
                  {/* Iconbox row — key specs */}
                  <div className="row">
                    {isVehicle && item.vehicleDetails && (
                      <>
                        <div className="col-sm-6 col-xl-4">
                          <div className="iconbox-style1 contact-style d-flex align-items-start mb30">
                            <div className="icon flex-shrink-0"><span className="fas fa-car" /></div>
                            <div className="details">
                              <h5 className="title">Marca / Modelo</h5>
                              <p className="mb-0 text">{item.vehicleDetails.brand} {item.vehicleDetails.model}</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6 col-xl-4">
                          <div className="iconbox-style1 contact-style d-flex align-items-start mb30">
                            <div className="icon flex-shrink-0"><span className="fas fa-calendar-alt" /></div>
                            <div className="details">
                              <h5 className="title">Ano / Modelo</h5>
                              <p className="mb-0 text">{item.vehicleDetails.year}/{item.vehicleDetails.yearModel}</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6 col-xl-4">
                          <div className="iconbox-style1 contact-style d-flex align-items-start mb30">
                            <div className="icon flex-shrink-0"><span className="fas fa-tachometer-alt" /></div>
                            <div className="details">
                              <h5 className="title">Quilometragem</h5>
                              <p className="mb-0 text">{item.vehicleDetails.km.toLocaleString("pt-BR")} km</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6 col-xl-4">
                          <div className="iconbox-style1 contact-style d-flex align-items-start mb30">
                            <div className="icon flex-shrink-0"><span className="fas fa-palette" /></div>
                            <div className="details">
                              <h5 className="title">Cor</h5>
                              <p className="mb-0 text">{item.vehicleDetails.color}</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6 col-xl-4">
                          <div className="iconbox-style1 contact-style d-flex align-items-start mb30">
                            <div className="icon flex-shrink-0"><span className="fas fa-gas-pump" /></div>
                            <div className="details">
                              <h5 className="title">Combustível</h5>
                              <p className="mb-0 text">{item.vehicleDetails.fuel}</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6 col-xl-4">
                          <div className="iconbox-style1 contact-style d-flex align-items-start mb30">
                            <div className="icon flex-shrink-0"><span className="fas fa-cog" /></div>
                            <div className="details">
                              <h5 className="title">Câmbio</h5>
                              <p className="mb-0 text">{item.vehicleDetails.transmission}</p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    {isProperty && item.propertyDetails && (
                      <>
                        <div className="col-sm-6 col-xl-4">
                          <div className="iconbox-style1 contact-style d-flex align-items-start mb30">
                            <div className="icon flex-shrink-0"><span className="flaticon-home" /></div>
                            <div className="details">
                              <h5 className="title">Tipo</h5>
                              <p className="mb-0 text" style={{ textTransform: "capitalize" }}>{item.propertyDetails.propertyType}</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6 col-xl-4">
                          <div className="iconbox-style1 contact-style d-flex align-items-start mb30">
                            <div className="icon flex-shrink-0"><span className="fas fa-ruler-combined" /></div>
                            <div className="details">
                              <h5 className="title">Área</h5>
                              <p className="mb-0 text">{item.propertyDetails.area}m²</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6 col-xl-4">
                          <div className="iconbox-style1 contact-style d-flex align-items-start mb30">
                            <div className="icon flex-shrink-0"><span className="fas fa-bed" /></div>
                            <div className="details">
                              <h5 className="title">Quartos</h5>
                              <p className="mb-0 text">{item.propertyDetails.bedrooms}</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6 col-xl-4">
                          <div className="iconbox-style1 contact-style d-flex align-items-start mb30">
                            <div className="icon flex-shrink-0"><span className="fas fa-bath" /></div>
                            <div className="details">
                              <h5 className="title">Banheiros</h5>
                              <p className="mb-0 text">{item.propertyDetails.bathrooms}</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6 col-xl-4">
                          <div className="iconbox-style1 contact-style d-flex align-items-start mb30">
                            <div className="icon flex-shrink-0"><span className="fas fa-parking" /></div>
                            <div className="details">
                              <h5 className="title">Vagas</h5>
                              <p className="mb-0 text">{item.propertyDetails.parkingSpots}</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6 col-xl-4">
                          <div className="iconbox-style1 contact-style d-flex align-items-start mb30">
                            <div className="icon flex-shrink-0"><span className="flaticon-place" /></div>
                            <div className="details">
                              <h5 className="title">Localização</h5>
                              <p className="mb-0 text">{item.propertyDetails.city} - {item.propertyDetails.state}</p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Description */}
                  <div className="service-about">
                    <h4>Descrição</h4>
                    <p className="text mb30">{item.description}</p>

                    {/* Situation — vehicle */}
                    {isVehicle && item.vehicleDetails && (
                      <>
                        <div className="row mb20">
                          <div className="col-sm-4 mb10">
                            <div className="d-flex align-items-center gap-2">
                              <i className={`fas ${item.vehicleDetails.ipvaUpToDate ? "fa-check-circle text-thm" : "fa-times-circle"}`} style={!item.vehicleDetails.ipvaUpToDate ? { color: "#eb6753" } : {}} />
                              <span>IPVA em dia</span>
                            </div>
                          </div>
                          <div className="col-sm-4 mb10">
                            <div className="d-flex align-items-center gap-2">
                              <i className={`fas ${!item.vehicleDetails.hasFines ? "fa-check-circle text-thm" : "fa-times-circle"}`} style={item.vehicleDetails.hasFines ? { color: "#eb6753" } : {}} />
                              <span>Sem multas</span>
                            </div>
                          </div>
                          <div className="col-sm-4 mb10">
                            <div className="d-flex align-items-center gap-2">
                              <i className={`fas ${!item.vehicleDetails.hasAccidentHistory ? "fa-check-circle text-thm" : "fa-exclamation-circle"}`} style={item.vehicleDetails.hasAccidentHistory ? { color: "#f0ad4e" } : {}} />
                              <span>{item.vehicleDetails.hasAccidentHistory ? "Possui sinistro" : "Sem sinistro"}</span>
                            </div>
                          </div>
                        </div>
                        {item.vehicleDetails.hasAccidentHistory && item.vehicleDetails.accidentDescription && (
                          <div className="p15 bdrs8 mb20" style={{ backgroundColor: "rgba(240,173,78,0.1)", border: "1px solid rgba(240,173,78,0.3)" }}>
                            <p className="mb-0 fz14">
                              <i className="fas fa-info-circle me-2" style={{ color: "#f0ad4e" }} />
                              {item.vehicleDetails.accidentDescription}
                            </p>
                          </div>
                        )}
                      </>
                    )}

                    {/* Costs — property */}
                    {isProperty && item.propertyDetails && (item.propertyDetails.condominium || item.propertyDetails.iptuMonthly) && (
                      <div className="row mb20">
                        {item.propertyDetails.condominium && (
                          <div className="col-sm-6 mb10">
                            <div className="d-flex justify-content-between p15 bgc-thm3 bdrs8">
                              <span>Condomínio</span>
                              <span className="fw600">{formatCurrency(item.propertyDetails.condominium)}/mês</span>
                            </div>
                          </div>
                        )}
                        {item.propertyDetails.iptuMonthly && (
                          <div className="col-sm-6 mb10">
                            <div className="d-flex justify-content-between p15 bgc-thm3 bdrs8">
                              <span>IPTU</span>
                              <span className="fw600">{formatCurrency(item.propertyDetails.iptuMonthly)}/mês</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <hr className="opacity-100 mb60 mt60" />

                    {/* Photos */}
                    <h4 className="mb30">Fotos do Bem ({item.images.length})</h4>
                    {item.images.length > 0 ? (
                      <>
                        <div className="position-relative mb20" style={{ borderRadius: 12, overflow: "hidden", backgroundColor: "#f8f8f8" }}>
                          <img
                            src={item.images[selectedImage]}
                            alt={`${item.title} - Foto ${selectedImage + 1}`}
                            style={{ width: "100%", height: 400, objectFit: "contain", display: "block", cursor: "pointer" }}
                            onClick={() => setLightboxOpen(true)}
                          />
                          {item.images.length > 1 && (
                            <>
                              <button className="d-flex align-items-center justify-content-center" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 40, height: 40, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.9)", border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.15)", cursor: "pointer" }} onClick={goPrev}>
                                <i className="far fa-arrow-left-long fz14" />
                              </button>
                              <button className="d-flex align-items-center justify-content-center" style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", width: 40, height: 40, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.9)", border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.15)", cursor: "pointer" }} onClick={goNext}>
                                <i className="far fa-arrow-right-long fz14" />
                              </button>
                            </>
                          )}
                          <div className="d-flex align-items-center gap-2" style={{ position: "absolute", bottom: 12, right: 12 }}>
                            <span className="fz12 fw600 text-white" style={{ backgroundColor: "rgba(0,0,0,0.55)", padding: "4px 12px", borderRadius: 20 }}>
                              {selectedImage + 1} / {item.images.length}
                            </span>
                            <button className="d-flex align-items-center justify-content-center" style={{ width: 32, height: 32, borderRadius: "50%", backgroundColor: "rgba(0,0,0,0.55)", border: "none", color: "#fff", cursor: "pointer" }} onClick={() => setLightboxOpen(true)}>
                              <i className="fas fa-expand fz12" />
                            </button>
                          </div>
                        </div>
                        <div className="row g-2 mb30">
                          {item.images.map((img, i) => (
                            <div key={i} className="col-4 col-sm-3 col-lg-3">
                              <div
                                className="bdrs8 overflow-hidden"
                                style={{ cursor: "pointer", height: 90, outline: i === selectedImage ? "3px solid #6f42c1" : "3px solid transparent", outlineOffset: -3, borderRadius: 8, opacity: i === selectedImage ? 1 : 0.7, transition: "all 0.15s" }}
                                onClick={() => setSelectedImage(i)}
                              >
                                <img src={img} alt={`Foto ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <p className="text mb30">Nenhuma foto disponível.</p>
                    )}

                    <hr className="opacity-100 mb60 mt30" />

                    {/* Carta de Crédito */}
                    <h4 className="mb30">Carta de Crédito</h4>
                    <div className="row mb20">
                      <div className="col-12">
                        <div className="d-flex justify-content-between mb5">
                          <span className="fz14 fw500">Parcelas pagas</span>
                          <span className="fz14 fw600">{cl.totalInstallments - cl.remainingInstallments} de {cl.totalInstallments}</span>
                        </div>
                        <div className="progress mb10" style={{ height: 12, borderRadius: 6 }}>
                          <div className="progress-bar bgc-thm" style={{ width: `${paidPct}%`, borderRadius: 6 }} />
                        </div>
                        <div className="d-flex justify-content-between">
                          <span className="fz13" style={{ color: "#5bbb7b" }}>{paidPct}% concluído</span>
                          <span className="fz13 body-color">{cl.remainingInstallments} restantes</span>
                        </div>
                      </div>
                    </div>
                    <div className="table-style2 mb30">
                      <table className="table">
                        <tbody>
                          <tr><td className="fw500">Valor do Crédito</td><td className="text-end fw600">{formatCurrency(cl.creditValue)}</td></tr>
                          <tr><td className="fw500">Total Já Pago</td><td className="text-end fw600 text-thm">{formatCurrency(totalPaid)}</td></tr>
                          <tr><td className="fw500">Parcela Mensal</td><td className="text-end fw600">{formatCurrency(cl.installmentValue)}/mês</td></tr>
                          <tr><td className="fw500">Parcelas Restantes</td><td className="text-end fw600">{cl.remainingInstallments} de {cl.totalInstallments}</td></tr>
                          <tr><td className="fw500">Saldo Devedor (est.)</td><td className="text-end fw600" style={{ color: "#eb6753" }}>{formatCurrency(remainingDebt)}</td></tr>
                          <tr><td className="fw500">Taxa de Administração</td><td className="text-end fw600">{cl.adminFee}% ({formatCurrency(totalAdminFee)})</td></tr>
                          <tr><td className="fw500">Fundo de Reserva</td><td className="text-end fw600">{cl.reserveFund}% ({formatCurrency(totalReserveFund)})</td></tr>
                          <tr>
                            <td className="fw500">Contemplação</td>
                            <td className="text-end">
                              <span className="text-white fz12 fw600" style={{ padding: "2px 10px", borderRadius: 12, backgroundColor: cl.isContemplada ? "#5bbb7b" : "#f0ad4e" }}>
                                {cl.isContemplada ? "Contemplada" : "Não contemplada"}
                              </span>
                            </td>
                          </tr>
                          {cl.contemplationDate && (
                            <tr><td className="fw500">Data da Contemplação</td><td className="text-end fw600">{new Date(cl.contemplationDate).toLocaleDateString("pt-BR")}</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    <hr className="opacity-100 mb60 mt30" />

                    {/* Extras / Skills tags */}
                    <h4 className="mb30">Características</h4>
                    <div className="mb60">
                      {isVehicle && item.vehicleDetails && item.vehicleDetails.extras.map((e, i) => (
                        <a key={i} className="tag list-inline-item mb-2 mr10">{e}</a>
                      ))}
                      {isProperty && item.propertyDetails && item.propertyDetails.extras.map((e, i) => (
                        <a key={i} className="tag list-inline-item mb-2 mr10">{e}</a>
                      ))}
                      {goodTags.map((t, i) => (
                        <a key={`t-${i}`} className="tag list-inline-item mb-2 mr10">{t}</a>
                      ))}
                    </div>

                    <hr className="opacity-100 mb60" />

                    {/* Send Proposal — like "Send Your Proposal" */}
                    <div className="bsp_reveiw_wrt">
                      <h4>Enviar Proposta</h4>
                      {!submitted ? (
                        <div className="comments_form mt30 mb30-md">
                          <div className="row">
                            <div className="col-md-6">
                              <div className="mb20">
                                <label className="fw500 ff-heading dark-color mb-2">Valor da proposta</label>
                                <input
                                  type="number"
                                  className="form-control"
                                  placeholder={`${formatCurrency(item.askingPrice)}`}
                                  value={proposalValue}
                                  onChange={(e) => setProposalValue(e.target.value)}
                                />
                                {proposalValue && Number(proposalValue) < item.askingPrice && (
                                  <small className="fz13 mt5 d-block" style={{ color: "#f0ad4e" }}>
                                    <i className="fas fa-info-circle me-1" />
                                    Abaixo do valor pedido
                                  </small>
                                )}
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="mb20">
                                <label className="fw500 ff-heading dark-color mb-2">Parcelas que assume</label>
                                <input type="text" className="form-control" value={`${cl.remainingInstallments}x de ${formatCurrency(cl.installmentValue)}`} readOnly />
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="mb-4">
                                <label className="fw500 fz16 ff-heading dark-color mb-2">Mensagem ao vendedor</label>
                                <textarea
                                  className="pt15"
                                  rows={6}
                                  placeholder="Apresente-se e explique seu interesse no bem. Informe sua disponibilidade para visita e documentação..."
                                  value={proposalMessage}
                                  onChange={(e) => setProposalMessage(e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="col-md-12 mb20">
                              <label className="custom_checkbox fz14">
                                Aceito os termos de transferência e entendo que assumirei as parcelas restantes do consórcio
                                <input type="checkbox" checked={acceptTerms} onChange={() => setAcceptTerms(!acceptTerms)} />
                                <span className="checkmark" />
                              </label>
                            </div>
                            <div className="col-md-12">
                              <div className="d-grid">
                                <a
                                  className={`ud-btn btn-thm ${(!proposalValue || !proposalMessage || !acceptTerms) ? "disabled" : ""}`}
                                  style={{ opacity: (!proposalValue || !proposalMessage || !acceptTerms) ? 0.6 : 1, pointerEvents: (!proposalValue || !proposalMessage || !acceptTerms) ? "none" : "auto", cursor: "pointer" }}
                                  onClick={() => setSubmitted(true)}
                                >
                                  Enviar Proposta <i className="fal fa-arrow-right-long" />
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p30 text-center bgc-thm3 bdrs12 mt30">
                          <i className="fas fa-check-circle fz40 text-thm mb10" />
                          <h5>Proposta enviada com sucesso!</h5>
                          <p className="text">O vendedor receberá sua proposta e entrará em contato.</p>
                          <div className="d-flex gap-2 justify-content-center mt20">
                            <Link href="/marketplace/repasses" className="ud-btn btn-thm bdrs4">
                              Ver Mais Repasses <i className="fal fa-arrow-right-long" />
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column — col-lg-4 sidebar */}
            <div className="col-lg-4">
              <div className="column">
                <div className="scrollbalance-inner">
                  <div className="blog-sidebar ms-lg-auto">
                    {/* ProjectPriceWidget1 */}
                    <div className="price-widget pt25 bdrs8">
                      <h3 className="widget-title" style={{ color: "#6f42c1" }}>{formatCurrency(item.askingPrice)}</h3>
                      <p className="text fz14">Valor pedido pelo bem</p>
                      <div className="d-flex justify-content-between fz14 mb5">
                        <span>Parcela mensal</span>
                        <span className="fw600">{formatCurrency(cl.installmentValue)}</span>
                      </div>
                      <div className="d-flex justify-content-between fz14 mb5">
                        <span>Parcelas restantes</span>
                        <span className="fw600">{cl.remainingInstallments}</span>
                      </div>
                      <div className="d-flex justify-content-between fz14 mb5">
                        <span>Crédito total</span>
                        <span className="fw600">{formatCurrency(cl.creditValue)}</span>
                      </div>
                      <div className="d-flex justify-content-between fz14 mb15">
                        <span>Já pago</span>
                        <span className="fw600 text-thm">{formatCurrency(totalPaid)}</span>
                      </div>
                      <div className="progress mb10" style={{ height: 6, borderRadius: 3 }}>
                        <div className="progress-bar bgc-thm" style={{ width: `${paidPct}%`, borderRadius: 3 }} />
                      </div>
                      <p className="fz12 body-color mb20">{paidPct}% pago</p>
                      <div className="d-grid">
                        <a
                          className="ud-btn btn-thm"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            document.querySelector(".bsp_reveiw_wrt")?.scrollIntoView({ behavior: "smooth" });
                          }}
                        >
                          Enviar Proposta <i className="fal fa-arrow-right-long" />
                        </a>
                      </div>
                    </div>

                    {/* ProjectContactWidget1 — Seller */}
                    <div className="freelancer-style1 service-single mb-0 bdrs8">
                      <h4>Sobre o Vendedor</h4>
                      <div className="wrapper d-flex align-items-center mt20">
                        <div className="thumb position-relative mb25">
                          <div className="rounded-circle mx-auto d-flex align-items-center justify-content-center" style={{ width: 50, height: 50, backgroundColor: "rgba(111,66,193,0.1)" }}>
                            <span className="flaticon-user fz20" style={{ color: "#6f42c1" }} />
                          </div>
                        </div>
                        <div className="ml20">
                          <h5 className="title mb-1">{item.seller.name}</h5>
                          <p className="mb-0">{item.seller.verified ? "Vendedor Verificado" : "Vendedor"}</p>
                          <div className="review">
                            <p>
                              <i className="fas fa-star fz10 review-color pr10" />
                              <span className="dark-color">{item.seller.rating}</span> ({item.seller.reviews} avaliações)
                            </p>
                          </div>
                        </div>
                      </div>
                      <hr className="opacity-100" />
                      <div className="details">
                        <div className="fl-meta d-flex align-items-center justify-content-between">
                          <a className="meta fw500 text-start">
                            Resposta<br />
                            <span className="fz14 fw400">{item.seller.responseTime}</span>
                          </a>
                          <a className="meta fw500 text-start">
                            Desde<br />
                            <span className="fz14 fw400">{item.seller.memberSince}</span>
                          </a>
                          <a className="meta fw500 text-start">
                            Propostas<br />
                            <span className="fz14 fw400">{item.proposals}</span>
                          </a>
                        </div>
                      </div>
                      <div className="d-grid mt30">
                        <a className="ud-btn btn-thm-border" style={{ cursor: "pointer" }}>
                          Contatar Vendedor <i className="fal fa-arrow-right-long" />
                        </a>
                      </div>
                    </div>

                    {/* How it works */}
                    <div className="bdr1 bdrs8 p30 mt30">
                      <h5 className="mb20">Como Funciona</h5>
                      <div className="d-flex flex-column gap-3">
                        {[
                          { icon: "fa-search", text: "Escolha o bem desejado" },
                          { icon: "fa-paper-plane", text: "Envie uma proposta ao vendedor" },
                          { icon: "fa-handshake", text: "Negocie e chegue a um acordo" },
                          { icon: "fa-lock", text: "Valor depositado em escrow" },
                          { icon: "fa-file-signature", text: "Administradora aprova a transferência" },
                          { icon: "fa-check-circle", text: "Bem e consórcio transferidos" },
                        ].map((step, i) => (
                          <div key={i} className="d-flex align-items-center gap-3">
                            <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 36, height: 36, backgroundColor: "rgba(91,187,123,0.1)" }}>
                              <i className={`fas ${step.icon} fz14 text-thm`} />
                            </div>
                            <span className="fz14">{step.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Security */}
                    <div className="p20 bdrs8 mt30" style={{ backgroundColor: "rgba(91,187,123,0.08)", border: "1px solid rgba(91,187,123,0.2)" }}>
                      <div className="d-flex align-items-center gap-2 mb10">
                        <i className="fas fa-shield-alt text-thm fz18" />
                        <h6 className="mb-0">Transação Segura</h6>
                      </div>
                      <p className="fz13 mb-0 body-color">
                        Todas as transações são protegidas por escrow. O valor só é liberado ao vendedor após aprovação da transferência pela administradora.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.96)", zIndex: 99999, display: "flex", flexDirection: "column" }}>
          <div className="d-flex align-items-center justify-content-between" style={{ height: 56, flexShrink: 0, padding: "0 24px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <button className="d-flex align-items-center gap-2" style={{ background: "none", border: "none", color: "#fff", fontSize: 14, cursor: "pointer" }} onClick={() => setLightboxOpen(false)}>
              <i className="fas fa-arrow-left fz14" /> <span>Voltar</span>
            </button>
            <span className="text-white fz14 fw500">{selectedImage + 1} de {item.images.length}</span>
            <button style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", fontSize: 20, cursor: "pointer" }} onClick={() => setLightboxOpen(false)}>
              <i className="fas fa-times" />
            </button>
          </div>
          <div className="d-flex align-items-center justify-content-center position-relative" style={{ flex: 1, minHeight: 0, padding: "20px 80px" }}>
            <button className="d-flex align-items-center justify-content-center" style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: 16, cursor: "pointer" }} onClick={goPrev}>
              <i className="far fa-arrow-left-long" />
            </button>
            <img src={item.images[selectedImage]} alt={`${item.title} - Foto ${selectedImage + 1}`} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: 6, userSelect: "none" }} draggable={false} />
            <button className="d-flex align-items-center justify-content-center" style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: 16, cursor: "pointer" }} onClick={goNext}>
              <i className="far fa-arrow-right-long" />
            </button>
          </div>
          <div className="d-flex gap-2 justify-content-center align-items-center" style={{ flexShrink: 0, padding: "12px 24px 20px", overflowX: "auto" }}>
            {item.images.map((img, i) => (
              <div key={i} className="flex-shrink-0 overflow-hidden" style={{ width: 64, height: 44, cursor: "pointer", borderRadius: 4, outline: i === selectedImage ? "2px solid #fff" : "2px solid transparent", outlineOffset: 2, opacity: i === selectedImage ? 1 : 0.4, transition: "all 0.15s" }} onClick={() => setSelectedImage(i)}>
                <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
