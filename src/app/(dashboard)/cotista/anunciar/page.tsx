"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { mockQuotas } from "@/data/mock-quotas";

const myQuotas = mockQuotas.filter(
  (q) => q.status === "ativa" || q.status === "contemplada"
);

export default function AnunciarCotaPage() {
  const [selectedQuotaId, setSelectedQuotaId] = useState("");
  const [askingPrice, setAskingPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [acceptsCounterOffer, setAcceptsCounterOffer] = useState(true);
  const [acceptsFinancing, setAcceptsFinancing] = useState(false);
  const [step, setStep] = useState(1);
  const [published, setPublished] = useState(false);

  const selectedQuota = myQuotas.find((q) => q.id === selectedQuotaId);

  const handleSelectQuota = (quotaId: string) => {
    setSelectedQuotaId(quotaId);
    const q = myQuotas.find((item) => item.id === quotaId);
    if (q) {
      setAskingPrice(q.listingPrice || q.paidAmount);
    }
  };

  const handlePublish = () => {
    setPublished(true);
  };

  if (published) {
    return (
      <div className="dashboard__content hover-bgc-color">
        <div className="row pb40">
          <div className="col-lg-12">
            <div className="dashboard_title_area">
              <h2>Anúncio Criado!</h2>
              <p className="text">Sua cota foi anunciada no marketplace.</p>
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="ps-widget bgc-white bdrs12 p30 text-center">
              <div
                className="d-inline-flex align-items-center justify-content-center mb20"
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  backgroundColor: "rgba(91, 187, 123, 0.1)",
                }}
              >
                <i className="fas fa-check-circle fz40" style={{ color: "#5bbb7b" }} />
              </div>
              <h4 className="mb10">Anúncio publicado com sucesso!</h4>
              <p className="body-color fz14 mb25">
                Sua cota do grupo {selectedQuota?.groupCode} (Cota #{selectedQuota?.quotaNumber})
                está agora visível no marketplace por {formatCurrency(askingPrice)}.
              </p>
              <div className="d-flex gap-2 justify-content-center">
                <Link href="/cotista/anuncios" className="ud-btn btn-thm bdrs12">
                  Ver Meus Anúncios <i className="fal fa-arrow-right-long" />
                </Link>
                <Link href="/marketplace" className="ud-btn btn-thm-border bdrs12">
                  Ver no Marketplace <i className="fal fa-arrow-right-long" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard__content hover-bgc-color">
      <div className="row pb40">
        <div className="col-lg-12">
          <div className="dashboard_title_area">
            <h2>Anunciar Cota para Venda</h2>
            <p className="text">
              Venda sua cota de consórcio no marketplace
            </p>
          </div>
        </div>
      </div>

      {/* Steps indicator */}
      <div className="row mb30">
        <div className="col-12">
          <div className="ps-widget bgc-white bdrs12 p30">
            <div className="d-flex justify-content-between align-items-center">
              {[
                { n: 1, label: "Selecionar Cota" },
                { n: 2, label: "Definir Preço" },
                { n: 3, label: "Revisar e Publicar" },
              ].map((s, i) => (
                <div key={s.n} className="d-flex align-items-center">
                  <div
                    className="d-flex align-items-center justify-content-center text-white fw600 me-2"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      backgroundColor: step >= s.n ? "#5bbb7b" : "#dee2e6",
                      fontSize: 14,
                    }}
                  >
                    {step > s.n ? <i className="fas fa-check" /> : s.n}
                  </div>
                  <span className={`fz14 fw500 ${step >= s.n ? "dark-color" : "body-light-color"}`}>
                    {s.label}
                  </span>
                  {i < 2 && (
                    <div
                      className="mx-3"
                      style={{
                        width: 60,
                        height: 2,
                        backgroundColor: step > s.n ? "#5bbb7b" : "#dee2e6",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Step 1: Select Quota */}
      {step === 1 && (
        <div className="row">
          <div className="col-12">
            <div className="ps-widget bgc-white bdrs12 p30 mb30">
              <h4 className="mb20">Selecione a cota que deseja vender</h4>
              <p className="body-color fz14 mb25">
                Apenas cotas ativas ou contempladas podem ser anunciadas.
              </p>
              {myQuotas.length === 0 ? (
                <div className="text-center py-4">
                  <i className="flaticon-document fz40 text-thm2" />
                  <h5 className="mt15">Nenhuma cota disponível</h5>
                  <p className="body-color fz14">
                    Você não possui cotas ativas ou contempladas para vender.
                  </p>
                </div>
              ) : (
                <div className="row">
                  {myQuotas.map((quota) => {
                    const isSelected = selectedQuotaId === quota.id;
                    const paidPct = Math.round((quota.paidAmount / quota.creditValue) * 100);
                    return (
                      <div key={quota.id} className="col-md-6 col-xl-4">
                        <div
                          onClick={() => handleSelectQuota(quota.id)}
                          className={`ps-widget bdrs12 p25 mb20 ${
                            isSelected ? "default-box-shadow2" : "bdr1 hover-box-shadow"
                          }`}
                          style={{
                            cursor: "pointer",
                            borderColor: isSelected ? "#5bbb7b" : undefined,
                            borderWidth: isSelected ? 2 : undefined,
                            borderStyle: isSelected ? "solid" : undefined,
                            position: "relative",
                          }}
                        >
                          {isSelected && (
                            <span
                              className="position-absolute d-flex align-items-center justify-content-center text-white"
                              style={{
                                top: 10, right: 10,
                                width: 26, height: 26,
                                borderRadius: "50%",
                                backgroundColor: "#5bbb7b",
                                fontSize: 12,
                              }}
                            >
                              <i className="fas fa-check" />
                            </span>
                          )}
                          <div className="d-flex align-items-center mb15">
                            <div
                              className="d-flex align-items-center justify-content-center rounded-circle bgc-thm2 me-3"
                              style={{ width: 48, height: 48, flexShrink: 0 }}
                            >
                              <i className={`${
                                quota.goodType === "imovel" ? "flaticon-home" :
                                quota.goodType === "veiculo" ? "fas fa-car" :
                                "flaticon-briefcase"
                              } text-white fz18`} />
                            </div>
                            <div>
                              <h6 className="mb-0">{quota.groupCode} · Cota #{quota.quotaNumber}</h6>
                              <span className="fz13 body-color">{quota.goodTypeLabel} · {quota.administradora}</span>
                            </div>
                          </div>
                          <div className="d-flex justify-content-between mb10">
                            <span className="fz13 body-color">Crédito</span>
                            <span className="fz13 fw500">{formatCurrency(quota.creditValue)}</span>
                          </div>
                          <div className="d-flex justify-content-between mb10">
                            <span className="fz13 body-color">Já pago</span>
                            <span className="fz13 fw500">{formatCurrency(quota.paidAmount)}</span>
                          </div>
                          <div className="d-flex justify-content-between mb10">
                            <span className="fz13 body-color">Parcela</span>
                            <span className="fz13 fw500">{formatCurrency(quota.installmentValue)}/mês</span>
                          </div>
                          <div className="d-flex align-items-center mt10">
                            <div className="progress w-100" style={{ height: 5 }}>
                              <div className="progress-bar bgc-thm" style={{ width: `${paidPct}%` }} />
                            </div>
                            <span className="fz12 ms-2 body-color text-nowrap">{paidPct}%</span>
                          </div>
                          <div className="mt10">
                            <span
                              className="fz12 text-white px-2 py-1"
                              style={{
                                borderRadius: 12,
                                backgroundColor: quota.status === "contemplada" ? "#5bbb7b" : "#0d6efd",
                              }}
                            >
                              {quota.status === "contemplada" ? "Contemplada" : "Ativa"}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="d-flex justify-content-end mt15">
                <button
                  className="ud-btn btn-thm bdrs12"
                  disabled={!selectedQuotaId}
                  onClick={() => setStep(2)}
                >
                  Próximo <i className="fal fa-arrow-right-long" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Define Price */}
      {step === 2 && selectedQuota && (
        <div className="row">
          <div className="col-lg-7">
            <div className="ps-widget bgc-white bdrs12 p30 mb30">
              <h4 className="mb25">Defina o preço e condições</h4>

              <div className="mb25">
                <label className="fw500 ff-heading dark-color mb-2">
                  Preço de Venda (R$)
                </label>
                <input
                  type="number"
                  className="form-control form-control-lg"
                  value={askingPrice}
                  onChange={(e) => setAskingPrice(Number(e.target.value))}
                  min={0}
                  step={1000}
                />
                <div className="d-flex gap-3 mt10">
                  <span className="fz13 body-color">
                    Já pago: <strong>{formatCurrency(selectedQuota.paidAmount)}</strong>
                  </span>
                  <span className="fz13 body-color">
                    Crédito: <strong>{formatCurrency(selectedQuota.creditValue)}</strong>
                  </span>
                </div>
                {askingPrice > 0 && (
                  <div className="mt10 p15 bdrs8" style={{ backgroundColor: "rgba(91, 187, 123, 0.08)" }}>
                    <span className="fz13">
                      {askingPrice < selectedQuota.paidAmount ? (
                        <span style={{ color: "#eb6753" }}>
                          <i className="fas fa-exclamation-triangle me-1" />
                          Preço abaixo do valor já pago ({formatCurrency(selectedQuota.paidAmount - askingPrice)} de desconto)
                        </span>
                      ) : askingPrice <= selectedQuota.paidAmount * 1.1 ? (
                        <span style={{ color: "#5bbb7b" }}>
                          <i className="fas fa-thumbs-up me-1" />
                          Preço competitivo — maior chance de venda rápida
                        </span>
                      ) : (
                        <span style={{ color: "#f0ad4e" }}>
                          <i className="fas fa-info-circle me-1" />
                          Preço acima do pago (+{formatCurrency(askingPrice - selectedQuota.paidAmount)}) — pode demorar mais para vender
                        </span>
                      )}
                    </span>
                  </div>
                )}
              </div>

              <div className="mb25">
                <label className="fw500 ff-heading dark-color mb-2">
                  Descrição do Anúncio
                </label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva sua cota, motivo da venda, diferenciais..."
                />
              </div>

              <div className="mb20">
                <div className="form-check form-switch mb15">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="counterOffer"
                    checked={acceptsCounterOffer}
                    onChange={(e) => setAcceptsCounterOffer(e.target.checked)}
                  />
                  <label className="form-check-label fz14" htmlFor="counterOffer">
                    Aceitar contra-propostas
                  </label>
                  <p className="fz12 body-light-color mb-0 mt-1">
                    Compradores poderão enviar propostas abaixo do preço pedido
                  </p>
                </div>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="financing"
                    checked={acceptsFinancing}
                    onChange={(e) => setAcceptsFinancing(e.target.checked)}
                  />
                  <label className="form-check-label fz14" htmlFor="financing">
                    Aceitar parcelamento do valor de repasse
                  </label>
                  <p className="fz12 body-light-color mb-0 mt-1">
                    O comprador poderá pagar o valor do repasse em parcelas
                  </p>
                </div>
              </div>

              <div className="d-flex justify-content-between mt25">
                <button className="ud-btn btn-thm-border bdrs12" onClick={() => setStep(1)}>
                  <i className="fal fa-arrow-left-long me-2" /> Voltar
                </button>
                <button className="ud-btn btn-thm bdrs12" onClick={() => setStep(3)}>
                  Revisar <i className="fal fa-arrow-right-long" />
                </button>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="price-widget pt25 pb25 bdrs12">
              <h5 className="widget-title mb15">Resumo da Cota</h5>
              <div className="d-flex justify-content-between mb10">
                <span className="fz14 body-color">Grupo</span>
                <span className="fw500 fz14">{selectedQuota.groupCode}</span>
              </div>
              <div className="d-flex justify-content-between mb10">
                <span className="fz14 body-color">Cota</span>
                <span className="fw500 fz14">#{selectedQuota.quotaNumber}</span>
              </div>
              <div className="d-flex justify-content-between mb10">
                <span className="fz14 body-color">Tipo</span>
                <span className="fw500 fz14">{selectedQuota.goodTypeLabel}</span>
              </div>
              <div className="d-flex justify-content-between mb10">
                <span className="fz14 body-color">Crédito</span>
                <span className="fw500 fz14">{formatCurrency(selectedQuota.creditValue)}</span>
              </div>
              <div className="d-flex justify-content-between mb10">
                <span className="fz14 body-color">Parcelas restantes</span>
                <span className="fw500 fz14">
                  {selectedQuota.remainingInstallments}/{selectedQuota.totalInstallments}
                </span>
              </div>
              <div className="d-flex justify-content-between mb10">
                <span className="fz14 body-color">Administradora</span>
                <span className="fw500 fz14">{selectedQuota.administradora}</span>
              </div>
              <hr className="opacity-100" />
              <div className="d-flex justify-content-between mt10">
                <span className="fz15 fw600 dark-color">Preço de Venda</span>
                <span className="fw700 fz17 text-thm2">{formatCurrency(askingPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && selectedQuota && (
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="ps-widget bgc-white bdrs12 p30 mb30">
              <h4 className="mb25">Revise seu anúncio</h4>

              <div className="bdr1 bdrs12 p20 mb20">
                <div className="d-flex align-items-center mb15">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle bgc-thm2 me-3"
                    style={{ width: 48, height: 48, flexShrink: 0 }}
                  >
                    <i className={`${
                      selectedQuota.goodType === "imovel" ? "flaticon-home" :
                      selectedQuota.goodType === "veiculo" ? "fas fa-car" :
                      "flaticon-briefcase"
                    } text-white fz18`} />
                  </div>
                  <div>
                    <h5 className="mb-0">{selectedQuota.groupCode} · Cota #{selectedQuota.quotaNumber}</h5>
                    <span className="fz14 body-color">
                      {selectedQuota.goodTypeLabel} · {selectedQuota.administradora}
                    </span>
                  </div>
                </div>

                <div className="row mb15">
                  <div className="col-6 col-md-3">
                    <span className="fz12 body-light-color d-block">Crédito</span>
                    <span className="fw500 fz14">{formatCurrency(selectedQuota.creditValue)}</span>
                  </div>
                  <div className="col-6 col-md-3">
                    <span className="fz12 body-light-color d-block">Já Pago</span>
                    <span className="fw500 fz14">{formatCurrency(selectedQuota.paidAmount)}</span>
                  </div>
                  <div className="col-6 col-md-3">
                    <span className="fz12 body-light-color d-block">Parcela</span>
                    <span className="fw500 fz14">{formatCurrency(selectedQuota.installmentValue)}/mês</span>
                  </div>
                  <div className="col-6 col-md-3">
                    <span className="fz12 body-light-color d-block">Restantes</span>
                    <span className="fw500 fz14">{selectedQuota.remainingInstallments} meses</span>
                  </div>
                </div>

                <hr className="opacity-100" />

                <div className="row mt15">
                  <div className="col-md-6">
                    <div className="d-flex justify-content-between mb10">
                      <span className="fz14 body-color">Preço de Venda</span>
                      <span className="fw600 fz15 text-thm2">{formatCurrency(askingPrice)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb10">
                      <span className="fz14 body-color">Aceita contra-proposta</span>
                      <span className="fw500 fz14">{acceptsCounterOffer ? "Sim" : "Não"}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="fz14 body-color">Aceita parcelamento</span>
                      <span className="fw500 fz14">{acceptsFinancing ? "Sim" : "Não"}</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <span className="fz12 body-light-color d-block mb5">Descrição</span>
                    <p className="fz14 body-color mb-0">
                      {description || "Nenhuma descrição fornecida."}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="p15 bdrs8 mb20"
                style={{ backgroundColor: "rgba(91, 187, 123, 0.08)" }}
              >
                <p className="fz13 mb-0">
                  <i className="fas fa-info-circle me-1" style={{ color: "#5bbb7b" }} />
                  Ao publicar, sua cota ficará visível no marketplace para todos os compradores.
                  Você pode pausar ou remover o anúncio a qualquer momento na página{" "}
                  <Link href="/cotista/anuncios" className="text-thm">Meus Anúncios</Link>.
                </p>
              </div>

              <div className="d-flex justify-content-between">
                <button className="ud-btn btn-thm-border bdrs12" onClick={() => setStep(2)}>
                  <i className="fal fa-arrow-left-long me-2" /> Voltar
                </button>
                <button className="ud-btn btn-thm bdrs12" onClick={handlePublish}>
                  <i className="fas fa-megaphone me-2" /> Publicar Anúncio
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
