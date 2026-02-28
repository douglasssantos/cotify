"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import {
  mockProposals,
  getProposalStatusLabel,
  getProposalStatusColor,
  type ProposalStatus,
} from "@/data/mock-secondary-market";

type TabType = "recebidas" | "enviadas";

export default function PropostasPage() {
  const [activeTab, setActiveTab] = useState<TabType>("recebidas");
  const [statusFilter, setStatusFilter] = useState<ProposalStatus | "todos">("todos");

  const byTab = mockProposals.filter((p) =>
    activeTab === "recebidas" ? p.type === "recebida" : p.type === "enviada"
  );

  const filtered =
    statusFilter === "todos"
      ? byTab
      : byTab.filter((p) => p.status === statusFilter);

  const pendingCount = mockProposals.filter(
    (p) => p.type === "recebida" && p.status === "pendente"
  ).length;

  return (
    <div className="dashboard__content hover-bgc-color">
      <div className="row pb40">
        <div className="col-lg-12">
          <div className="dashboard_title_area">
            <h2>Propostas</h2>
            <p className="text">
              Gerencie propostas recebidas e enviadas
            </p>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="row mb20">
        <div className="col-12">
          <div className="ps-widget bgc-white bdrs4 p15 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div className="d-flex gap-2">
              <button
                onClick={() => { setActiveTab("recebidas"); setStatusFilter("todos"); }}
                className={`ud-btn bdrs12 fz14 ${activeTab === "recebidas" ? "btn-thm" : "btn-thm-border"}`}
                style={{ padding: "8px 20px" }}
              >
                Recebidas
                {pendingCount > 0 && (
                  <span
                    className="ms-2 text-white fz11 fw600 d-inline-flex align-items-center justify-content-center"
                    style={{
                      width: 22, height: 22, borderRadius: "50%",
                      backgroundColor: activeTab === "recebidas" ? "#fff3" : "#eb6753",
                      color: activeTab === "recebidas" ? "#fff" : "#fff",
                    }}
                  >
                    {pendingCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => { setActiveTab("enviadas"); setStatusFilter("todos"); }}
                className={`ud-btn bdrs12 fz14 ${activeTab === "enviadas" ? "btn-thm" : "btn-thm-border"}`}
                style={{ padding: "8px 20px" }}
              >
                Enviadas
              </button>
            </div>
            <select
              className="form-select w-auto fz14"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ProposalStatus | "todos")}
            >
              <option value="todos">Todos os status</option>
              <option value="pendente">Pendente</option>
              <option value="aceita">Aceita</option>
              <option value="recusada">Recusada</option>
              <option value="contra_proposta">Contra-proposta</option>
            </select>
          </div>
        </div>
      </div>

      {/* Proposals */}
      <div className="row">
        {filtered.length === 0 ? (
          <div className="col-12">
            <div className="ps-widget bgc-white bdrs4 p30 text-center">
              <i className="flaticon-chat fz40 body-light-color" />
              <h5 className="mt15">Nenhuma proposta encontrada</h5>
              <p className="body-color fz14">
                {activeTab === "recebidas"
                  ? "Você ainda não recebeu propostas."
                  : "Você ainda não enviou propostas."}
              </p>
            </div>
          </div>
        ) : (
          filtered.map((proposal) => (
            <div key={proposal.id} className="col-12">
              <div className="ps-widget bgc-white bdrs4 p25 mb15 bdr1 hover-box-shadow">
                <div className="row align-items-center">
                  {/* Proposal Info */}
                  <div className="col-lg-5">
                    <div className="d-flex align-items-start">
                      <div
                        className="d-flex align-items-center justify-content-center rounded-circle me-3 flex-shrink-0"
                        style={{
                          width: 48, height: 48,
                          backgroundColor: getProposalStatusColor(proposal.status) + "15",
                        }}
                      >
                        <i
                          className={`fas ${
                            proposal.type === "recebida" ? "fa-inbox" : "fa-paper-plane"
                          } fz18`}
                          style={{ color: getProposalStatusColor(proposal.status) }}
                        />
                      </div>
                      <div>
                        <h6 className="mb5">
                          {proposal.type === "recebida"
                            ? proposal.buyerName
                            : proposal.sellerName}
                        </h6>
                        <p className="fz13 body-color mb5">
                          {proposal.listing.groupCode} · Cota #{proposal.listing.quotaNumber} ·{" "}
                          {proposal.listing.goodTypeLabel}
                        </p>
                        <span className="fz12 body-light-color">{proposal.createdAt}</span>
                      </div>
                    </div>
                  </div>

                  {/* Prices */}
                  <div className="col-lg-3">
                    <div className="mt15-md mb15-md">
                      <div className="d-flex justify-content-between mb5">
                        <span className="fz13 body-color">Pedido:</span>
                        <span className="fz13 fw500">{formatCurrency(proposal.listing.askingPrice)}</span>
                      </div>
                      <div className="d-flex justify-content-between mb5">
                        <span className="fz13 body-color">Oferta:</span>
                        <span className="fz14 fw600 text-thm2">{formatCurrency(proposal.offeredPrice)}</span>
                      </div>
                      {proposal.counterOfferPrice && (
                        <div className="d-flex justify-content-between">
                          <span className="fz13 body-color">Contra:</span>
                          <span className="fz13 fw500" style={{ color: "#0d6efd" }}>
                            {formatCurrency(proposal.counterOfferPrice)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status + Actions */}
                  <div className="col-lg-4">
                    <div className="d-flex align-items-center justify-content-lg-end gap-2 flex-wrap">
                      <span
                        className="text-white fz12 fw600"
                        style={{
                          padding: "4px 12px",
                          borderRadius: 12,
                          backgroundColor: getProposalStatusColor(proposal.status),
                        }}
                      >
                        {getProposalStatusLabel(proposal.status)}
                      </span>
                      {proposal.status === "pendente" && proposal.type === "recebida" && (
                        <>
                          <button
                            className="ud-btn btn-thm bdrs12 fz13"
                            style={{ padding: "6px 14px" }}
                          >
                            Aceitar
                          </button>
                          <button
                            className="ud-btn btn-thm-border bdrs12 fz13"
                            style={{ padding: "6px 14px" }}
                          >
                            Negociar
                          </button>
                          <button
                            className="ud-btn fz13"
                            style={{ padding: "6px 14px", color: "#eb6753", border: "1px solid #eb6753", borderRadius: 12 }}
                          >
                            Recusar
                          </button>
                        </>
                      )}
                      {(proposal.status === "aceita" || proposal.status === "contra_proposta") && (
                        <Link
                          href={`/cotista/negociacoes/${proposal.id}`}
                          className="ud-btn btn-light-thm bdrs12 fz13"
                          style={{ padding: "6px 14px" }}
                        >
                          Ver Negociação
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                {/* Message preview */}
                <div className="mt15 pt15 bdrb-0" style={{ borderTop: "1px solid #eee" }}>
                  <p className="fz13 body-color mb-0">
                    <i className="fas fa-quote-left fz11 me-1 body-light-color" />
                    {proposal.message.length > 150
                      ? proposal.message.slice(0, 150) + "..."
                      : proposal.message}
                  </p>
                  {proposal.counterOfferMessage && (
                    <p className="fz13 mt10 mb-0" style={{ color: "#0d6efd" }}>
                      <i className="fas fa-reply fz11 me-1" />
                      {proposal.counterOfferMessage}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
