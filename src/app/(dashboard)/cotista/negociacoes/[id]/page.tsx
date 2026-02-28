"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import {
  mockNegotiations,
  getNegotiationStatusLabel,
  getNegotiationStatusColor,
} from "@/data/mock-secondary-market";

export default function NegociacaoDetalhePage() {
  const params = useParams();
  const negotiation = mockNegotiations.find((n) => n.id === params.id);
  const [newMessage, setNewMessage] = useState("");
  const [counterValue, setCounterValue] = useState("");
  const [showCounterForm, setShowCounterForm] = useState(false);

  if (!negotiation) {
    return (
      <div className="dashboard__content hover-bgc-color">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="ps-widget bgc-white bdrs12 p30 text-center">
              <i className="flaticon-loupe fz40 text-thm2" />
              <h5 className="mt15">Negociação não encontrada</h5>
              <Link href="/cotista/propostas" className="ud-btn btn-thm bdrs12 mt15">
                Voltar às Propostas <i className="fal fa-arrow-right-long" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setNewMessage("");
  };

  const handleSendCounter = () => {
    if (!counterValue) return;
    setCounterValue("");
    setShowCounterForm(false);
  };

  return (
    <div className="dashboard__content hover-bgc-color">
      <div className="row pb40">
        <div className="col-lg-12">
          <div className="dashboard_title_area d-flex justify-content-between align-items-center flex-wrap">
            <div>
              <div className="d-flex align-items-center gap-2 mb10">
                <Link href="/cotista/propostas" className="body-color">
                  <i className="fas fa-arrow-left me-1" /> Propostas
                </Link>
                <span className="body-light-color">/</span>
                <span className="dark-color">Negociação</span>
              </div>
              <h2>
                Negociação com {negotiation.buyerName}
              </h2>
              <p className="text">
                {negotiation.listing.groupCode} · Cota #{negotiation.listing.quotaNumber} · {negotiation.listing.goodTypeLabel}
              </p>
            </div>
            <span
              className="text-white fz13 fw600"
              style={{
                padding: "6px 16px",
                borderRadius: 20,
                backgroundColor: getNegotiationStatusColor(negotiation.status),
              }}
            >
              {getNegotiationStatusLabel(negotiation.status)}
            </span>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Chat/Timeline */}
        <div className="col-lg-8">
          <div className="ps-widget bgc-white bdrs12 p30 mb30">
            <h5 className="mb20">Histórico da Negociação</h5>

            <div style={{ maxHeight: 500, overflowY: "auto" }} className="pe-2">
              {negotiation.messages.map((msg) => {
                const isSystem = msg.sender === "sistema";
                const isSeller = msg.sender === "vendedor";
                return (
                  <div key={msg.id} className={`mb20 ${isSystem ? "text-center" : ""}`}>
                    {isSystem ? (
                      <div
                        className="d-inline-block p10 bdrs8 fz13"
                        style={{ backgroundColor: "#f1f3f5", maxWidth: "80%" }}
                      >
                        <i className="fas fa-info-circle me-1 body-light-color" />
                        <span className="body-color">{msg.content}</span>
                        {msg.value && (
                          <span className="fw600 ms-1" style={{ color: "#5bbb7b" }}>
                            {formatCurrency(msg.value)}
                          </span>
                        )}
                        <div className="fz11 body-light-color mt5">
                          {new Date(msg.timestamp).toLocaleString("pt-BR")}
                        </div>
                      </div>
                    ) : (
                      <div className={`d-flex ${isSeller ? "justify-content-end" : ""}`}>
                        <div
                          className="p15 bdrs12"
                          style={{
                            maxWidth: "75%",
                            backgroundColor: isSeller ? "#1f4b3f" : "#f8f9fa",
                            color: isSeller ? "#fff" : "#333",
                          }}
                        >
                          <div className="d-flex justify-content-between align-items-center mb5">
                            <span className={`fz13 fw600 ${isSeller ? "text-white" : "dark-color"}`}>
                              {msg.senderName}
                            </span>
                            {(msg.type === "proposta" || msg.type === "contra_proposta") && msg.value && (
                              <span
                                className="fz12 fw600 ms-2"
                                style={{
                                  padding: "2px 10px",
                                  borderRadius: 12,
                                  backgroundColor: isSeller ? "rgba(255,255,255,0.15)" : "rgba(91,187,123,0.1)",
                                  color: isSeller ? "#a5d6a7" : "#5bbb7b",
                                }}
                              >
                                {msg.type === "contra_proposta" ? "Contra: " : "Oferta: "}
                                {formatCurrency(msg.value)}
                              </span>
                            )}
                          </div>
                          <p className={`fz14 mb5 ${isSeller ? "" : "body-color"}`}>{msg.content}</p>
                          <span className={`fz11 ${isSeller ? "opacity-75" : "body-light-color"}`}>
                            {new Date(msg.timestamp).toLocaleString("pt-BR")}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Message Input */}
            {negotiation.status === "em_andamento" && (
              <div className="mt20 pt20" style={{ borderTop: "1px solid #eee" }}>
                {showCounterForm ? (
                  <div className="bdr1 bdrs12 p20">
                    <h6 className="mb15">Enviar Contra-proposta</h6>
                    <div className="row align-items-end">
                      <div className="col-md-4 mb15">
                        <label className="fz13 fw500 mb5">Novo Valor (R$)</label>
                        <input
                          type="number"
                          className="form-control"
                          value={counterValue}
                          onChange={(e) => setCounterValue(e.target.value)}
                          placeholder="0"
                          min={0}
                          step={1000}
                        />
                      </div>
                      <div className="col-md-5 mb15">
                        <label className="fz13 fw500 mb5">Mensagem</label>
                        <input
                          className="form-control"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Justifique sua contra-proposta..."
                        />
                      </div>
                      <div className="col-md-3 mb15 d-flex gap-2">
                        <button className="ud-btn btn-thm bdrs12 fz13 flex-grow-1" onClick={handleSendCounter}>
                          Enviar
                        </button>
                        <button
                          className="ud-btn btn-thm-border bdrs12 fz13"
                          onClick={() => setShowCounterForm(false)}
                        >
                          <i className="fas fa-times" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="d-flex gap-2">
                    <input
                      className="form-control"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Digite uma mensagem..."
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <button className="ud-btn btn-thm bdrs12" onClick={handleSendMessage}>
                      <i className="fas fa-paper-plane" />
                    </button>
                    <button
                      className="ud-btn btn-thm-border bdrs12 fz13 text-nowrap"
                      onClick={() => setShowCounterForm(true)}
                    >
                      Contra-proposta
                    </button>
                  </div>
                )}
              </div>
            )}

            {negotiation.status === "repasse" && (
              <div
                className="mt20 p15 bdrs8 text-center"
                style={{ backgroundColor: "rgba(111, 66, 193, 0.08)" }}
              >
                <i className="fas fa-exchange-alt me-2" style={{ color: "#6f42c1" }} />
                <span className="fz14 fw500" style={{ color: "#6f42c1" }}>
                  Negociação concluída — Processo de repasse em andamento
                </span>
                <div className="mt10">
                  <Link href="/cotista/repasses" className="ud-btn btn-thm bdrs12 fz13">
                    Acompanhar Repasse <i className="fal fa-arrow-right-long" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-lg-4">
          {/* Quota Info */}
          <div className="price-widget pt25 pb25 bdrs12 mb20">
            <h5 className="widget-title mb15">Detalhes da Cota</h5>
            <div className="d-flex justify-content-between mb10">
              <span className="fz14 body-color">Grupo</span>
              <span className="fw500 fz14">{negotiation.listing.groupCode}</span>
            </div>
            <div className="d-flex justify-content-between mb10">
              <span className="fz14 body-color">Cota</span>
              <span className="fw500 fz14">#{negotiation.listing.quotaNumber}</span>
            </div>
            <div className="d-flex justify-content-between mb10">
              <span className="fz14 body-color">Tipo</span>
              <span className="fw500 fz14">{negotiation.listing.goodTypeLabel}</span>
            </div>
            <div className="d-flex justify-content-between mb10">
              <span className="fz14 body-color">Administradora</span>
              <span className="fw500 fz14">{negotiation.listing.administradora}</span>
            </div>
            <div className="d-flex justify-content-between mb10">
              <span className="fz14 body-color">Parcela</span>
              <span className="fw500 fz14">{formatCurrency(negotiation.listing.installmentValue)}/mês</span>
            </div>
            <hr className="opacity-100" />
            <div className="d-flex justify-content-between mb10">
              <span className="fz14 body-color">Crédito</span>
              <span className="fw600 fz15">{formatCurrency(negotiation.listing.creditValue)}</span>
            </div>
            <div className="d-flex justify-content-between mb10">
              <span className="fz14 body-color">Preço Pedido</span>
              <span className="fw500 fz14">{formatCurrency(negotiation.listing.askingPrice)}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="fz15 fw600 dark-color">Oferta Atual</span>
              <span className="fw700 fz17 text-thm2">{formatCurrency(negotiation.currentOffer)}</span>
            </div>
          </div>

          {/* Actions */}
          {negotiation.status === "em_andamento" && (
            <div className="ps-widget bgc-white bdrs12 p20 mb20">
              <h6 className="mb15">Ações</h6>
              <div className="d-grid gap-2">
                <button className="ud-btn btn-thm bdrs12">
                  <i className="fas fa-check me-2" /> Aceitar Oferta de {formatCurrency(negotiation.currentOffer)}
                </button>
                <button
                  className="ud-btn bdrs12 fz14"
                  style={{ color: "#eb6753", border: "1px solid #eb6753" }}
                >
                  <i className="fas fa-times me-2" /> Cancelar Negociação
                </button>
              </div>
            </div>
          )}

          {/* Participant */}
          <div className="freelancer-style1 service-single bdrs12 p20">
            <h6 className="mb15">Comprador</h6>
            <div className="d-flex align-items-center">
              <div
                className="d-flex align-items-center justify-content-center rounded-circle bgc-thm me-3"
                style={{ width: 48, height: 48, flexShrink: 0 }}
              >
                <span className="text-white fw600 fz16">
                  {negotiation.buyerName.charAt(0)}
                </span>
              </div>
              <div>
                <h6 className="mb-0">{negotiation.buyerName}</h6>
                <span className="fz13 body-color">
                  Membro desde 2025
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
