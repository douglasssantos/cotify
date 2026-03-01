"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { CurrencyInput } from "@/components/ui/CurrencyInput";
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
  const [activeTab, setActiveTab] = useState<"bem" | "fotos" | "credito" | "vendedor">("bem");
  const [proposalValue, setProposalValue] = useState(0);
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

  return (
    <>

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
                  <a>{item.title}</a>
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

      {/* Detail Content */}
      <section className="pt10 pb90">
        <div className="container">
          <div className="row">
            {/* Main */}
            <div className="col-lg-8">

            <div className="cta-service-v1 mb30 freelancer-single-v1 pt60 pb60 bdrs16 position-relative overflow-hidden d-flex align-items-center">
                <img className="left-top-img" src="/images/vector-img/left-top.png" alt="" />
                <img className="right-bottom-img" src="/images/vector-img/right-bottom.png" alt="" />
                <div className="row">
                  <div className="col-xl-12">
                    <div className="position-relative pl60 pl20-sm">
                      <h2>{item.title}</h2>
                      <div className="d-flex align-items-center gap-2 mb10 flex-wrap">
                        <span className="text-white fz12 fw600" style={{ padding: "0px 12px", borderRadius: 20, backgroundColor: "#6f42c1" }}>
                          <i className={`${getCategoryIcon(item.category)} me-1`} /> {item.categoryLabel}
                        </span>
                        <span className="text-white fz12 fw600" style={{ padding: "0px 12px", borderRadius: 20, backgroundColor: getRepasseStatusColor(item.status) }}>
                          {getRepasseStatusLabel(item.status)}
                        </span>
                        <span className="text-white fz12 fw600" style={{ padding: "0px 12px", borderRadius: 20, backgroundColor: getConditionColor(item.condition) }}>
                          {getConditionLabel(item.condition)}
                        </span>
                      </div>
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
              {/* Tabs */}
              <div className="navtab-style1 mb30">
                <nav>
                  <div className="nav nav-tabs">
                    <button
                      className={`nav-link fw600 ${activeTab === "bem" ? "active" : ""}`}
                      onClick={() => setActiveTab("bem")}
                    >
                      <i className={`${getCategoryIcon(item.category)} me-2`} />
                      Dados do Bem
                    </button>
                    <button
                      className={`nav-link fw600 ${activeTab === "fotos" ? "active" : ""}`}
                      onClick={() => setActiveTab("fotos")}
                    >
                      <i className="fas fa-images me-2" />
                      Fotos
                      {item.images.length > 0 && (
                        <span className="ms-1 fz12 body-color">({item.images.length})</span>
                      )}
                    </button>
                    <button
                      className={`nav-link fw600 ${activeTab === "credito" ? "active" : ""}`}
                      onClick={() => setActiveTab("credito")}
                    >
                      <i className="flaticon-document me-2" />
                      Carta de Crédito
                    </button>
                    <button
                      className={`nav-link fw600 ${activeTab === "vendedor" ? "active" : ""}`}
                      onClick={() => setActiveTab("vendedor")}
                    >
                      <i className="flaticon-user me-2" />
                      Vendedor
                    </button>
                  </div>
                </nav>
              </div>

              {/* Tab: Good Details */}
              {activeTab === "bem" && (
                <>
                  {/* Description */}
                  <div className="service-about mb30">
                    <h4 className="fw600 mb20">Descrição</h4>
                    <p className="text">{item.description}</p>
                  </div>

                  {/* Vehicle */}
                  {isVehicle && item.vehicleDetails && (
                    <>
                      <div className="service-about mb30">
                        <h4 className="fw600 mb40">Informações do Veículo</h4>
                        <div className="row">
                          <div className="col-sm-6 col-lg-4 mb20">
                            <div className="iconbox-style1 contact-style d-flex align-items-start">
                              <div className="icon flex-shrink-0"><span className="fas fa-car" /></div>
                              <div className="details">
                                <p className="mb-0 text">Marca/Modelo</p>
                                <h6 className="mb-0">{item.vehicleDetails.brand} {item.vehicleDetails.model}</h6>
                              </div>
                            </div>
                          </div>
                          <div className="col-sm-6 col-lg-4 mb20">
                            <div className="iconbox-style1 contact-style d-flex align-items-start">
                              <div className="icon flex-shrink-0"><span className="fas fa-calendar-alt" /></div>
                              <div className="details">
                                <p className="mb-0 text">Ano/Modelo</p>
                                <h6 className="mb-0">{item.vehicleDetails.year}/{item.vehicleDetails.yearModel}</h6>
                              </div>
                            </div>
                          </div>
                          <div className="col-sm-6 col-lg-4 mb20">
                            <div className="iconbox-style1 contact-style d-flex align-items-start">
                              <div className="icon flex-shrink-0"><span className="fas fa-palette" /></div>
                              <div className="details">
                                <p className="mb-0 text">Cor</p>
                                <h6 className="mb-0">{item.vehicleDetails.color}</h6>
                              </div>
                            </div>
                          </div>
                          <div className="col-sm-6 col-lg-4 mb20">
                            <div className="iconbox-style1 contact-style d-flex align-items-start">
                              <div className="icon flex-shrink-0"><span className="fas fa-tachometer-alt" /></div>
                              <div className="details">
                                <p className="mb-0 text">Quilometragem</p>
                                <h6 className="mb-0">{item.vehicleDetails.km.toLocaleString("pt-BR")} km</h6>
                              </div>
                            </div>
                          </div>
                          <div className="col-sm-6 col-lg-4 mb20">
                            <div className="iconbox-style1 contact-style d-flex align-items-start">
                              <div className="icon flex-shrink-0"><span className="fas fa-gas-pump" /></div>
                              <div className="details">
                                <p className="mb-0 text">Combustível</p>
                                <h6 className="mb-0">{item.vehicleDetails.fuel}</h6>
                              </div>
                            </div>
                          </div>
                          <div className="col-sm-6 col-lg-4 mb20">
                            <div className="iconbox-style1 contact-style d-flex align-items-start">
                              <div className="icon flex-shrink-0"><span className="fas fa-cog" /></div>
                              <div className="details">
                                <p className="mb-0 text">Câmbio</p>
                                <h6 className="mb-0">{item.vehicleDetails.transmission}</h6>
                              </div>
                            </div>
                          </div>
                          {item.vehicleDetails.doors && (
                            <div className="col-sm-6 col-lg-4 mb20">
                              <div className="iconbox-style1 contact-style d-flex align-items-start">
                                <div className="icon flex-shrink-0"><span className="fas fa-door-open" /></div>
                                <div className="details">
                                  <p className="mb-0 text">Portas</p>
                                  <h6 className="mb-0">{item.vehicleDetails.doors}</h6>
                                </div>
                              </div>
                            </div>
                          )}
                          {item.vehicleDetails.plate && (
                            <div className="col-sm-6 col-lg-4 mb20">
                              <div className="iconbox-style1 contact-style d-flex align-items-start">
                                <div className="icon flex-shrink-0"><span className="fas fa-id-card" /></div>
                                <div className="details">
                                  <p className="mb-0 text">Placa</p>
                                  <h6 className="mb-0">{item.vehicleDetails.plate}</h6>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Situation */}
                      <div className="service-about mb30">
                        <h4 className="fw600 mb20">Situação do Veículo</h4>
                        <div className="row">
                          <div className="col-sm-6 col-lg-4 mb15">
                            <div className="d-flex align-items-center gap-2">
                              <i className={`fas ${item.vehicleDetails.ipvaUpToDate ? "fa-check-circle text-thm" : "fa-times-circle"}`} style={!item.vehicleDetails.ipvaUpToDate ? { color: "#eb6753" } : {}} />
                              <span>IPVA em dia</span>
                            </div>
                          </div>
                          <div className="col-sm-6 col-lg-4 mb15">
                            <div className="d-flex align-items-center gap-2">
                              <i className={`fas ${!item.vehicleDetails.hasFines ? "fa-check-circle text-thm" : "fa-times-circle"}`} style={item.vehicleDetails.hasFines ? { color: "#eb6753" } : {}} />
                              <span>Sem multas</span>
                            </div>
                          </div>
                          <div className="col-sm-6 col-lg-4 mb15">
                            <div className="d-flex align-items-center gap-2">
                              <i className={`fas ${!item.vehicleDetails.hasAccidentHistory ? "fa-check-circle text-thm" : "fa-exclamation-circle"}`} style={item.vehicleDetails.hasAccidentHistory ? { color: "#f0ad4e" } : {}} />
                              <span>{item.vehicleDetails.hasAccidentHistory ? "Possui sinistro" : "Sem sinistro"}</span>
                            </div>
                          </div>
                        </div>
                        {item.vehicleDetails.hasAccidentHistory && item.vehicleDetails.accidentDescription && (
                          <div className="p15 bdrs8 mt10" style={{ backgroundColor: "rgba(240, 173, 78, 0.1)", border: "1px solid rgba(240, 173, 78, 0.3)" }}>
                            <p className="mb-0 fz14">
                              <i className="fas fa-info-circle me-2" style={{ color: "#f0ad4e" }} />
                              {item.vehicleDetails.accidentDescription}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Extras */}
                      {item.vehicleDetails.extras.length > 0 && (
                        <div className="service-about mb30">
                          <h4 className="fw600 mb20">Opcionais e Extras</h4>
                          <div className="row">
                            {item.vehicleDetails.extras.map((e, i) => (
                              <div key={i} className="col-sm-6 col-lg-4 mb10">
                                <div className="d-flex align-items-center gap-2">
                                  <i className="fas fa-check text-thm fz12" />
                                  <span className="fz14">{e}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Property */}
                  {isProperty && item.propertyDetails && (
                    <>
                      <div className="service-about mb30">
                        <h4 className="fw600 mb30">Informações do Imóvel</h4>
                        <div className="row">
                          <div className="col-sm-6 col-lg-4 mb20">
                            <div className="iconbox-style1 contact-style d-flex align-items-start">
                              <div className="icon flex-shrink-0"><span className="flaticon-home" /></div>
                              <div className="details">
                                <p className="mb-0 text">Tipo</p>
                                <h6 className="mb-0" style={{ textTransform: "capitalize" }}>{item.propertyDetails.propertyType}</h6>
                              </div>
                            </div>
                          </div>
                          <div className="col-sm-6 col-lg-4 mb20">
                            <div className="iconbox-style1 contact-style d-flex align-items-start">
                              <div className="icon flex-shrink-0"><span className="fas fa-ruler-combined" /></div>
                              <div className="details">
                                <p className="mb-0 text">Área</p>
                                <h6 className="mb-0">{item.propertyDetails.area}m²</h6>
                              </div>
                            </div>
                          </div>
                          {item.propertyDetails.bedrooms && (
                            <div className="col-sm-6 col-lg-4 mb20">
                              <div className="iconbox-style1 contact-style d-flex align-items-start">
                                <div className="icon flex-shrink-0"><span className="fas fa-bed" /></div>
                                <div className="details">
                                  <p className="mb-0 text">Quartos</p>
                                  <h6 className="mb-0">{item.propertyDetails.bedrooms}</h6>
                                </div>
                              </div>
                            </div>
                          )}
                          {item.propertyDetails.bathrooms && (
                            <div className="col-sm-6 col-lg-4 mb20">
                              <div className="iconbox-style1 contact-style d-flex align-items-start">
                                <div className="icon flex-shrink-0"><span className="fas fa-bath" /></div>
                                <div className="details">
                                  <p className="mb-0 text">Banheiros</p>
                                  <h6 className="mb-0">{item.propertyDetails.bathrooms}</h6>
                                </div>
                              </div>
                            </div>
                          )}
                          {item.propertyDetails.parkingSpots && (
                            <div className="col-sm-6 col-lg-4 mb20">
                              <div className="iconbox-style1 contact-style d-flex align-items-start">
                                <div className="icon flex-shrink-0"><span className="fas fa-parking" /></div>
                                <div className="details">
                                  <p className="mb-0 text">Vagas</p>
                                  <h6 className="mb-0">{item.propertyDetails.parkingSpots}</h6>
                                </div>
                              </div>
                            </div>
                          )}
                          {item.propertyDetails.floor && (
                            <div className="col-sm-6 col-lg-4 mb20">
                              <div className="iconbox-style1 contact-style d-flex align-items-start">
                                <div className="icon flex-shrink-0"><span className="fas fa-building" /></div>
                                <div className="details">
                                  <p className="mb-0 text">Andar</p>
                                  <h6 className="mb-0">{item.propertyDetails.floor}º</h6>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Location */}
                      <div className="service-about mb30">
                        <h4 className="fw600 mb20">Localização</h4>
                        <p className="text fz15">
                          <i className="flaticon-place me-2 text-thm2" />
                          {item.propertyDetails.neighborhood}, {item.propertyDetails.city} - {item.propertyDetails.state}
                        </p>
                      </div>

                      {/* Costs */}
                      <div className="service-about mb30">
                        <h4 className="fw600 mb20">Custos Mensais</h4>
                        <div className="row">
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
                      </div>

                      {/* Amenities */}
                      <div className="service-about mb30">
                        <h4 className="fw600 mb20">Comodidades</h4>
                        <div className="row mb10">
                          <div className="col-sm-6 col-lg-4 mb10">
                            <div className="d-flex align-items-center gap-2">
                              <i className={`fas ${item.propertyDetails.hasPool ? "fa-check-circle text-thm" : "fa-times-circle body-color"}`} />
                              <span>Piscina</span>
                            </div>
                          </div>
                          <div className="col-sm-6 col-lg-4 mb10">
                            <div className="d-flex align-items-center gap-2">
                              <i className={`fas ${item.propertyDetails.hasBarbecue ? "fa-check-circle text-thm" : "fa-times-circle body-color"}`} />
                              <span>Churrasqueira</span>
                            </div>
                          </div>
                          <div className="col-sm-6 col-lg-4 mb10">
                            <div className="d-flex align-items-center gap-2">
                              <i className={`fas ${item.propertyDetails.furnished ? "fa-check-circle text-thm" : "fa-times-circle body-color"}`} />
                              <span>Mobiliado</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Extras */}
                      {item.propertyDetails.extras.length > 0 && (
                        <div className="service-about mb30">
                          <h4 className="fw600 mb20">Diferenciais</h4>
                          <div className="row">
                            {item.propertyDetails.extras.map((e, i) => (
                              <div key={i} className="col-sm-6 col-lg-4 mb10">
                                <div className="d-flex align-items-center gap-2">
                                  <i className="fas fa-check text-thm fz12" />
                                  <span className="fz14">{e}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}

              {/* Tab: Photos */}
              {activeTab === "fotos" && (
                <>
                  {item.images.length > 0 ? (
                    <>
                      {/* Main selected image */}
                      <div className="service-about mb20">
                        <div className="position-relative" style={{ borderRadius: 12, overflow: "hidden", backgroundColor: "#f8f8f8" }}>
                          <img
                            src={item.images[selectedImage]}
                            alt={`${item.title} - Foto ${selectedImage + 1}`}
                            style={{ width: "100%", height: 450, objectFit: "contain", display: "block", cursor: "pointer" }}
                            onClick={() => setLightboxOpen(true)}
                          />
                          {/* Nav arrows */}
                          {item.images.length > 1 && (
                            <>
                              <button
                                className="d-flex align-items-center justify-content-center"
                                style={{
                                  position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                                  width: 40, height: 40, borderRadius: "50%",
                                  backgroundColor: "rgba(255,255,255,0.9)", border: "none",
                                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)", cursor: "pointer",
                                }}
                                onClick={goPrev}
                              >
                                <i className="far fa-arrow-left-long fz14" />
                              </button>
                              <button
                                className="d-flex align-items-center justify-content-center"
                                style={{
                                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                                  width: 40, height: 40, borderRadius: "50%",
                                  backgroundColor: "rgba(255,255,255,0.9)", border: "none",
                                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)", cursor: "pointer",
                                }}
                                onClick={goNext}
                              >
                                <i className="far fa-arrow-right-long fz14" />
                              </button>
                            </>
                          )}
                          {/* Counter + expand */}
                          <div
                            className="d-flex align-items-center gap-2"
                            style={{ position: "absolute", bottom: 12, right: 12 }}
                          >
                            <span className="fz12 fw600 text-white" style={{ backgroundColor: "rgba(0,0,0,0.55)", padding: "4px 12px", borderRadius: 20 }}>
                              {selectedImage + 1} / {item.images.length}
                            </span>
                            <button
                              className="d-flex align-items-center justify-content-center"
                              style={{
                                width: 32, height: 32, borderRadius: "50%",
                                backgroundColor: "rgba(0,0,0,0.55)", border: "none",
                                color: "#fff", cursor: "pointer",
                              }}
                              onClick={() => setLightboxOpen(true)}
                            >
                              <i className="fas fa-expand fz12" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Thumbnail grid */}
                      <div className="service-about mb30">
                        <div className="row g-2">
                          {item.images.map((img, i) => (
                            <div key={i} className="col-4 col-sm-3 col-md-3">
                              <div
                                className="bdrs8 overflow-hidden"
                                style={{
                                  cursor: "pointer", height: 100,
                                  outline: i === selectedImage ? "3px solid #6f42c1" : "3px solid transparent",
                                  outlineOffset: -3,
                                  borderRadius: 8,
                                  transition: "outline 0.15s, opacity 0.15s",
                                  opacity: i === selectedImage ? 1 : 0.75,
                                }}
                                onClick={() => setSelectedImage(i)}
                              >
                                <img
                                  src={img}
                                  alt={`Foto ${i + 1}`}
                                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="service-about mb30 text-center py-5">
                      <i className="fas fa-camera fz40 body-color mb15" />
                      <h5>Nenhuma foto disponível</h5>
                      <p className="body-color">O vendedor ainda não adicionou fotos deste bem.</p>
                    </div>
                  )}
                </>
              )}

              {/* Lightbox */}
              {lightboxOpen && (
                <div
                  style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.96)", zIndex: 99999, display: "flex", flexDirection: "column" }}
                >
                  <div
                    className="d-flex align-items-center justify-content-between"
                    style={{ height: 56, flexShrink: 0, padding: "0 24px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <button
                      className="d-flex align-items-center gap-2"
                      style={{ background: "none", border: "none", color: "#fff", fontSize: 14, cursor: "pointer" }}
                      onClick={() => setLightboxOpen(false)}
                    >
                      <i className="fas fa-arrow-left fz14" />
                      <span>Voltar</span>
                    </button>
                    <span className="text-white fz14 fw500">
                      {selectedImage + 1} de {item.images.length}
                    </span>
                    <button
                      style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", fontSize: 20, cursor: "pointer" }}
                      onClick={() => setLightboxOpen(false)}
                    >
                      <i className="fas fa-times" />
                    </button>
                  </div>
                  <div
                    className="d-flex align-items-center justify-content-center position-relative"
                    style={{ flex: 1, minHeight: 0, padding: "20px 80px" }}
                  >
                    <button
                      className="d-flex align-items-center justify-content-center"
                      style={{
                        position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)",
                        width: 44, height: 44, borderRadius: "50%",
                        backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
                        color: "#fff", fontSize: 16, cursor: "pointer", transition: "background 0.2s",
                      }}
                      onClick={goPrev}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)")}
                    >
                      <i className="far fa-arrow-left-long" />
                    </button>
                    <img
                      src={item.images[selectedImage]}
                      alt={`${item.title} - Foto ${selectedImage + 1}`}
                      style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: 6, userSelect: "none" }}
                      draggable={false}
                    />
                    <button
                      className="d-flex align-items-center justify-content-center"
                      style={{
                        position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)",
                        width: 44, height: 44, borderRadius: "50%",
                        backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
                        color: "#fff", fontSize: 16, cursor: "pointer", transition: "background 0.2s",
                      }}
                      onClick={goNext}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)")}
                    >
                      <i className="far fa-arrow-right-long" />
                    </button>
                  </div>
                  <div
                    className="d-flex gap-2 justify-content-center align-items-center"
                    style={{ flexShrink: 0, padding: "12px 24px 20px", overflowX: "auto" }}
                  >
                    {item.images.map((img, i) => (
                      <div
                        key={i}
                        className="flex-shrink-0 overflow-hidden"
                        style={{
                          width: 64, height: 44, cursor: "pointer", borderRadius: 4,
                          outline: i === selectedImage ? "2px solid #fff" : "2px solid transparent",
                          outlineOffset: 2,
                          opacity: i === selectedImage ? 1 : 0.4,
                          transition: "all 0.15s ease",
                        }}
                        onClick={() => setSelectedImage(i)}
                      >
                        <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab: Credit Letter */}
              {activeTab === "credito" && (
                <>
                  <div className="service-about mb30">
                    <h4 className="fw600 mb20">Dados da Carta de Crédito</h4>
                    <div className="row">
                      <div className="col-sm-6 col-lg-4 mb20">
                        <div className="iconbox-style1 contact-style d-flex align-items-start">
                          <div className="icon flex-shrink-0"><span className="flaticon-document" /></div>
                          <div className="details">
                            <p className="mb-0 text">Grupo / Cota</p>
                            <h6 className="mb-0">{cl.groupCode} / Cota {cl.quotaNumber}</h6>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6 col-lg-4 mb20">
                        <div className="iconbox-style1 contact-style d-flex align-items-start">
                          <div className="icon flex-shrink-0"><span className="flaticon-dollar" /></div>
                          <div className="details">
                            <p className="mb-0 text">Valor do Crédito</p>
                            <h6 className="mb-0">{formatCurrency(cl.creditValue)}</h6>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6 col-lg-4 mb20">
                        <div className="iconbox-style1 contact-style d-flex align-items-start">
                          <div className="icon flex-shrink-0"><span className="flaticon-home" /></div>
                          <div className="details">
                            <p className="mb-0 text">Administradora</p>
                            <h6 className="mb-0">{cl.administradora}</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="service-about mb30">
                    <h4 className="fw600 mb20">Progresso do Consórcio</h4>
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
                          <span className="fz13 body-color">{cl.remainingInstallments} parcelas restantes</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Financial Details */}
                  <div className="service-about mb30">
                    <h4 className="fw600 mb20">Detalhes Financeiros</h4>
                    <div className="table-style2">
                      <table className="table">
                        <tbody>
                          <tr>
                            <td className="fw500">Valor do Crédito</td>
                            <td className="text-end fw600">{formatCurrency(cl.creditValue)}</td>
                          </tr>
                          <tr>
                            <td className="fw500">Total Já Pago</td>
                            <td className="text-end fw600 text-thm">{formatCurrency(totalPaid)}</td>
                          </tr>
                          <tr>
                            <td className="fw500">Parcela Mensal</td>
                            <td className="text-end fw600">{formatCurrency(cl.installmentValue)}/mês</td>
                          </tr>
                          <tr>
                            <td className="fw500">Parcelas Restantes</td>
                            <td className="text-end fw600">{cl.remainingInstallments} de {cl.totalInstallments}</td>
                          </tr>
                          <tr>
                            <td className="fw500">Saldo Devedor (estimativa)</td>
                            <td className="text-end fw600" style={{ color: "#eb6753" }}>{formatCurrency(remainingDebt)}</td>
                          </tr>
                          <tr>
                            <td className="fw500">Taxa de Administração</td>
                            <td className="text-end fw600">{cl.adminFee}% ({formatCurrency(totalAdminFee)})</td>
                          </tr>
                          <tr>
                            <td className="fw500">Fundo de Reserva</td>
                            <td className="text-end fw600">{cl.reserveFund}% ({formatCurrency(totalReserveFund)})</td>
                          </tr>
                          <tr>
                            <td className="fw500">Status da Contemplação</td>
                            <td className="text-end">
                              <span className="text-white fz12 fw600" style={{ padding: "2px 10px", borderRadius: 12, backgroundColor: cl.isContemplada ? "#5bbb7b" : "#f0ad4e" }}>
                                {cl.isContemplada ? "Contemplada" : "Não contemplada"}
                              </span>
                            </td>
                          </tr>
                          {cl.contemplationDate && (
                            <tr>
                              <td className="fw500">Data da Contemplação</td>
                              <td className="text-end fw600">{new Date(cl.contemplationDate).toLocaleDateString("pt-BR")}</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* What Buyer Assumes */}
                  <div className="p20 bdrs8 mb30" style={{ backgroundColor: "rgba(111, 66, 193, 0.05)", border: "1px solid rgba(111, 66, 193, 0.15)" }}>
                    <h5 className="mb15 fw600" style={{ color: "#6f42c1" }}>
                      <i className="fas fa-info-circle me-2" />
                      O que o comprador assume
                    </h5>
                    <div className="row">
                      <div className="col-sm-6 mb10">
                        <div className="d-flex align-items-center gap-2">
                          <i className="fas fa-check-circle" style={{ color: "#6f42c1" }} />
                          <span className="fz14">{cl.remainingInstallments} parcelas de {formatCurrency(cl.installmentValue)}</span>
                        </div>
                      </div>
                      <div className="col-sm-6 mb10">
                        <div className="d-flex align-items-center gap-2">
                          <i className="fas fa-check-circle" style={{ color: "#6f42c1" }} />
                          <span className="fz14">Taxa de administração de {cl.adminFee}%</span>
                        </div>
                      </div>
                      <div className="col-sm-6 mb10">
                        <div className="d-flex align-items-center gap-2">
                          <i className="fas fa-check-circle" style={{ color: "#6f42c1" }} />
                          <span className="fz14">Fundo de reserva de {cl.reserveFund}%</span>
                        </div>
                      </div>
                      <div className="col-sm-6 mb10">
                        <div className="d-flex align-items-center gap-2">
                          <i className="fas fa-check-circle" style={{ color: "#6f42c1" }} />
                          <span className="fz14">Saldo devedor de ~{formatCurrency(remainingDebt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Tab: Seller */}
              {activeTab === "vendedor" && (
                <>
                  <div className="service-about mb30">
                    <h4 className="fw600 mb20">Sobre o Vendedor</h4>
                    <div className="freelancer-style1 bdr1 p30 bdrs12">
                      <div className="d-flex align-items-center gap-3 mb20">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{ width: 60, height: 60, backgroundColor: "rgba(111, 66, 193, 0.1)" }}
                        >
                          <span className="flaticon-user fz22" style={{ color: "#6f42c1" }} />
                        </div>
                        <div>
                          <h5 className="mb-0">{item.seller.name}</h5>
                          <div className="d-flex align-items-center gap-2 mt5">
                            {item.seller.verified && (
                              <span className="text-white fz10 fw600" style={{ padding: "0px 12px", borderRadius: 10, backgroundColor: "#5bbb7b" }}>
                                <i className="fas fa-check me-1" />Verificado
                              </span>
                            )}
                            <span className="fz13 body-color">Membro desde {item.seller.memberSince}</span>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-4 mb15">
                          <div className="text-center p15 bgc-thm3 bdrs8">
                            <h5 className="mb5 text-thm">{item.seller.rating}</h5>
                            <p className="fz13 mb-0">
                              <i className="fas fa-star fz12 me-1" style={{ color: "#f0ad4e" }} />
                              Avaliação ({item.seller.reviews})
                            </p>
                          </div>
                        </div>
                        <div className="col-sm-4 mb15">
                          <div className="text-center p15 bgc-thm3 bdrs8">
                            <h5 className="mb5" style={{ color: "#6f42c1" }}>{item.seller.responseTime}</h5>
                            <p className="fz13 mb-0">Tempo de resposta</p>
                          </div>
                        </div>
                        <div className="col-sm-4 mb15">
                          <div className="text-center p15 bgc-thm3 bdrs8">
                            <h5 className="mb5">{item.views}</h5>
                            <p className="fz13 mb-0">Visualizações</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Proposal Form */}
              <div className="service-about mb30">
                <h4 className="fw600 mb30">Fazer Proposta</h4>
                {!submitted ? (
                  <div className="bdr1 bdrs12 p30">
                    <p className="text mb15">
                      Envie uma proposta para adquirir este bem e assumir as parcelas restantes do consórcio.
                      A transação é protegida por escrow — o valor só é liberado após aprovação da administradora.
                    </p>
                    <div className="row">
                      <div className="col-md-6 mb20">
                        <label className="form-label fw500 d-block mb-2">Valor da Proposta</label>
                        <CurrencyInput
                          value={proposalValue}
                          onValueChange={setProposalValue}
                          placeholder={`Valor pedido: ${formatCurrency(item.askingPrice)}`}
                        />
                        {proposalValue > 0 && proposalValue < item.askingPrice && (
                          <small style={{ color: "#f0ad4e" }}>
                            <i className="fas fa-info-circle me-1" />
                            Abaixo do valor pedido de {formatCurrency(item.askingPrice)}
                          </small>
                        )}
                      </div>
                      <div className="col-12 mb20">
                        <label className="form-label fw500">Mensagem ao vendedor</label>
                        <textarea
                          className="form-control"
                          rows={4}
                          placeholder="Apresente-se e explique seu interesse no bem..."
                          value={proposalMessage}
                          onChange={(e) => setProposalMessage(e.target.value)}
                        />
                      </div>
                      <div className="col-12 mb20">
                        <label className="custom_checkbox fz14">
                          Aceito os termos de transferência de consórcio e entendo que assumirei as parcelas restantes
                          <input
                            type="checkbox"
                            checked={acceptTerms}
                            onChange={() => setAcceptTerms(!acceptTerms)}
                          />
                          <span className="checkmark" />
                        </label>
                      </div>
                      <div className="col-12">
                        <button
                          className="ud-btn btn-thm"
                          disabled={!proposalValue || !proposalMessage || !acceptTerms}
                          onClick={() => setSubmitted(true)}
                        >
                          Enviar Proposta <i className="fal fa-arrow-right-long" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p30 text-center bgc-thm3 bdrs12">
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

            {/* Sidebar */}
            <div className="col-lg-4">
              {/* Price */}
              <div className="price-widget bdrs12 bdr1 p30 mb30">
                <div className="d-flex align-items-center gap-2 mb15">
                  <span
                    className="text-white fz12 fw600"
                    style={{ padding: "4px 14px", borderRadius: 12, backgroundColor: "#6f42c1" }}
                  >
                    <i className={`${getCategoryIcon(item.category)} me-1`} />
                    Repasse de {item.categoryLabel}
                  </span>
                </div>

                <div className="mb15">
                  <p className="fz13 mb5 body-color fw600">Valor Pedido pelo Bem</p>
                  <h3 style={{ color: "#6f42c1" }}>{formatCurrency(item.askingPrice)}</h3>
                </div>

                <hr className="opacity-25" />

                <div className="mb15">
                  <p className="fz13 mb5 body-color">Parcela Mensal</p>
                  <h5>{formatCurrency(cl.installmentValue)}/mês</h5>
                  <p className="fz12 body-color mb-0">{cl.remainingInstallments} parcelas restantes</p>
                </div>

                <hr className="opacity-25" />

                <div className="mb15">
                  <div className="d-flex justify-content-between fz14 mb5">
                    <span>Crédito total</span>
                    <span className="fw600">{formatCurrency(cl.creditValue)}</span>
                  </div>
                  <div className="d-flex justify-content-between fz14 mb5">
                    <span>Já pago</span>
                    <span className="fw600 text-thm">{formatCurrency(totalPaid)}</span>
                  </div>
                  <div className="d-flex justify-content-between fz14 mb5">
                    <span>Saldo devedor (est.)</span>
                    <span className="fw600" style={{ color: "#eb6753" }}>{formatCurrency(remainingDebt)}</span>
                  </div>
                </div>

                <div className="progress mb10" style={{ height: 8, borderRadius: 4 }}>
                  <div className="progress-bar bgc-thm" style={{ width: `${paidPct}%`, borderRadius: 4 }} />
                </div>
                <p className="fz12 body-color mb20">{paidPct}% do consórcio já foi pago</p>

                <a
                  href="#proposta"
                  className="ud-btn btn-thm w-100 mb10"
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector(".service-about:last-of-type")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Fazer Proposta <i className="fal fa-arrow-right-long" />
                </a>
              </div>

              {/* Seller */}
              <div className="freelancer-style1 bdr1 p30 bdrs12 mb30">
                <h6 className="mb15">Vendedor</h6>
                <div className="d-flex align-items-center gap-2 mb15">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: 40, height: 40, backgroundColor: "rgba(111, 66, 193, 0.1)" }}
                  >
                    <span className="flaticon-user fz16" style={{ color: "#6f42c1" }} />
                  </div>
                  <div>
                    <h6 className="mb-0 fz15">{item.seller.name}</h6>
                    <div className="d-flex align-items-center gap-1">
                      <i className="fas fa-star fz11" style={{ color: "#f0ad4e" }} />
                      <span className="fz13">{item.seller.rating} ({item.seller.reviews} avaliações)</span>
                    </div>
                  </div>
                </div>
                <div className="d-flex flex-column gap-2">
                  {item.seller.verified && (
                    <div className="d-flex align-items-center gap-2 fz14">
                      <i className="fas fa-shield-check text-thm" />
                      <span>Identidade verificada</span>
                    </div>
                  )}
                  <div className="d-flex align-items-center gap-2 fz14">
                    <i className="fas fa-clock body-color" />
                    <span>Responde em {item.seller.responseTime}</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 fz14">
                    <i className="fas fa-eye body-color" />
                    <span>{item.views} visualizações</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 fz14">
                    <i className="fas fa-comments body-color" />
                    <span>{item.proposals} propostas recebidas</span>
                  </div>
                </div>
              </div>

              {/* Transfer Process */}
              <div className="bdr1 bdrs12 p30 mb30">
                <h6 className="mb15">Como funciona</h6>
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
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{ width: 36, height: 36, backgroundColor: "rgba(91, 187, 123, 0.1)" }}
                      >
                        <i className={`fas ${step.icon} fz14 text-thm`} />
                      </div>
                      <span className="fz14">{step.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security */}
              <div className="p20 bdrs12" style={{ backgroundColor: "rgba(91, 187, 123, 0.08)", border: "1px solid rgba(91, 187, 123, 0.2)" }}>
                <div className="d-flex align-items-center gap-2 mb10">
                  <i className="fas fa-shield-alt text-thm fz18" />
                  <h6 className="mb-0">Transação Segura</h6>
                </div>
                <p className="fz13 mb-0 body-color">
                  Todas as transações são protegidas por escrow. O valor só é liberado ao vendedor após
                  aprovação da transferência pela administradora do consórcio.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
