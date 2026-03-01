"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import {
  mockProposals,
  mockNegotiations,
  getProposalStatusLabel,
  getProposalStatusColor,
  type ProposalStatus,
  type Proposal,
} from "@/data/mock-secondary-market";

// ─── constants ────────────────────────────────────────────────────────────────

type TabType = "recebidas" | "enviadas";
type SortKey = "recente" | "valor-desc" | "valor-asc";

const statusFilters: { value: ProposalStatus | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "pendente", label: "Pendente" },
  { value: "contra_proposta", label: "Contra-proposta" },
  { value: "aceita", label: "Aceita" },
  { value: "recusada", label: "Recusada" },
  { value: "expirada", label: "Expirada" },
  { value: "cancelada", label: "Cancelada" },
];

const statusIcons: Record<ProposalStatus, string> = {
  pendente: "fa-clock",
  aceita: "fa-check-circle",
  recusada: "fa-times-circle",
  contra_proposta: "fa-handshake",
  expirada: "fa-calendar-times",
  cancelada: "fa-ban",
};

// ─── helpers ──────────────────────────────────────────────────────────────────

function getNegotiationId(proposalId: string): string | null {
  const n = mockNegotiations.find((x) => x.proposalId === proposalId);
  return n?.id ?? null;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Hoje";
  if (diffDays === 1) return "Ontem";
  if (diffDays < 7) return `Há ${diffDays} dias`;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

// ─── sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ProposalStatus }) {
  const color = getProposalStatusColor(status);
  return (
    <span
      className="d-inline-flex align-items-center gap-1 fz12 fw600 text-white"
      style={{ background: color, borderRadius: 20, padding: "3px 10px" }}
    >
      <i className={`fas ${statusIcons[status]}`} style={{ fontSize: 9 }} />
      {getProposalStatusLabel(status)}
    </span>
  );
}

function ProposalCard({
  proposal,
  onAccept,
  onRefuse,
}: {
  proposal: Proposal;
  onAccept: (id: string) => void;
  onRefuse: (id: string) => void;
}) {
  const isReceived = proposal.type === "recebida";
  const otherName = isReceived ? proposal.buyerName : proposal.sellerName;
  const diff = proposal.offeredPrice - proposal.listing.askingPrice;
  const diffPct = Math.round((diff / proposal.listing.askingPrice) * 100);
  const negotiationId = getNegotiationId(proposal.id);
  const statusColor = getProposalStatusColor(proposal.status);

  return (
    <div
      className="ps-widget bgc-white bdrs12 p0 mb20 overflow-hidden"
      style={{ border: "1px solid #ebebeb", transition: "box-shadow .2s" }}
    >
      <div style={{ height: 3, backgroundColor: statusColor }} />
      <div className="p25">
        {/* Header: avatar + nome + listing + data + status */}
        <div className="d-flex flex-wrap align-items-start justify-content-between gap-3 mb18">
          <div className="d-flex align-items-center gap-3">
            <div
              className="d-flex align-items-center justify-content-center flex-shrink-0 rounded-circle fz18 fw600 text-white"
              style={{
                width: 48,
                height: 48,
                backgroundColor: statusColor,
              }}
            >
              {otherName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h6 className="mb-1 fw600 dark-color">
                {isReceived ? (
                  <>Proposta de <strong>{otherName}</strong></>
                ) : (
                  <>Sua proposta para <strong>{otherName}</strong></>
                )}
              </h6>
              <p className="fz13 body-color mb-0">
                {proposal.listing.groupCode} · Cota #{proposal.listing.quotaNumber} · {proposal.listing.goodTypeLabel}
              </p>
              <p className="fz12 body-light-color mt-1 mb-0">
                <i className="fal fa-clock me-1" />
                {formatDate(proposal.createdAt)}
                {proposal.updatedAt !== proposal.createdAt && (
                  <> · atualizado {formatDate(proposal.updatedAt)}</>
                )}
              </p>
            </div>
          </div>
          <StatusBadge status={proposal.status} />
        </div>

        {/* Valores: pedido vs oferta vs contra */}
        <div
          className="d-flex flex-wrap align-items-center gap-3 mb18 py-3 px-3 bdrs8"
          style={{ backgroundColor: "#f8f9fa" }}
        >
          <div className="d-flex align-items-baseline gap-2">
            <span className="fz12 body-color">Pedido:</span>
            <span className="fz15 fw600 dark-color">{formatCurrency(proposal.listing.askingPrice)}</span>
          </div>
          <i className="fal fa-arrow-right fz12 body-light-color" />
          <div className="d-flex align-items-baseline gap-2">
            <span className="fz12 body-color">Oferta:</span>
            <span
              className="fz16 fw700"
              style={{
                color: diff >= 0 ? "#5bbb7b" : diff > -0.05 * proposal.listing.askingPrice ? "#f0ad4e" : "#eb6753",
              }}
            >
              {formatCurrency(proposal.offeredPrice)}
            </span>
            {diff !== 0 && (
              <span
                className="fz12 fw500"
                style={{ color: diff >= 0 ? "#5bbb7b" : "#eb6753" }}
              >
                ({diff >= 0 ? "+" : ""}{diffPct}%)
              </span>
            )}
          </div>
          {proposal.counterOfferPrice != null && (
            <>
              <i className="fal fa-arrow-right fz12 body-light-color" />
              <div className="d-flex align-items-baseline gap-2">
                <span className="fz12 body-color">Sua contra:</span>
                <span className="fz15 fw600" style={{ color: "#0d6efd" }}>
                  {formatCurrency(proposal.counterOfferPrice)}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Mensagem */}
        <div className="mb18">
          <p className="fz12 fw600 body-color text-uppercase mb-2" style={{ letterSpacing: "0.05em" }}>
            Mensagem
          </p>
          <p
            className="fz13 body-color mb-0"
            style={{
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
            }}
          >
            {proposal.message}
          </p>
          {proposal.counterOfferMessage && (
            <div className="mt10 p-2 bdrs8" style={{ backgroundColor: "rgba(13,110,253,0.06)", borderLeft: "3px solid #0d6efd" }}>
              <p className="fz12 fw600 mb-1" style={{ color: "#0d6efd" }}>Sua contra-proposta:</p>
              <p className="fz13 body-color mb-0">{proposal.counterOfferMessage}</p>
            </div>
          )}
        </div>

        {/* Ações */}
        <div className="d-flex flex-wrap gap-2 pt15" style={{ borderTop: "1px solid #f3f3f3" }}>
          {proposal.status === "pendente" && isReceived && (
            <>
              <button
                className="ud-btn btn-thm bdrs12 fz13"
                style={{ padding: "8px 16px" }}
                onClick={() => onAccept(proposal.id)}
              >
                <i className="fal fa-check me-1" /> Aceitar
              </button>
              <Link
                href={negotiationId ? `/cotista/negociacoes/${negotiationId}` : "#"}
                className="ud-btn btn-thm-border bdrs12 fz13"
                style={{ padding: "8px 16px" }}
              >
                <i className="fal fa-handshake me-1" /> Negociar
              </Link>
              <button
                className="ud-btn bdrs12 fz13"
                style={{ padding: "8px 16px", color: "#eb6753", border: "1px solid #eb6753", background: "transparent" }}
                onClick={() => onRefuse(proposal.id)}
              >
                <i className="fal fa-times me-1" /> Recusar
              </button>
            </>
          )}

          {(proposal.status === "aceita" || proposal.status === "contra_proposta") && negotiationId && (
            <Link
              href={`/cotista/negociacoes/${negotiationId}`}
              className="ud-btn btn-thm bdrs12 fz13"
              style={{ padding: "8px 16px" }}
            >
              <i className="fal fa-comments me-1" /> Ver negociação
            </Link>
          )}

          {proposal.status === "pendente" && !isReceived && (
            <span className="fz13 body-color">
              <i className="fal fa-hourglass-half me-1" /> Aguardando resposta do vendedor
            </span>
          )}

          {(proposal.status === "recusada" || proposal.status === "expirada" || proposal.status === "cancelada") && isReceived && (
            <Link href="/cotista/anuncios" className="ud-btn btn-thm-border bdrs12 fz13" style={{ padding: "8px 16px" }}>
              <i className="fal fa-megaphone me-1" /> Ver anúncios
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function PropostasPage() {
  const [activeTab, setActiveTab] = useState<TabType>("recebidas");
  const [statusFilter, setStatusFilter] = useState<ProposalStatus | "todos">("todos");
  const [sortBy, setSortBy] = useState<SortKey>("recente");

  const byTab = useMemo(
    () => mockProposals.filter((p) => (activeTab === "recebidas" ? p.type === "recebida" : p.type === "enviada")),
    [activeTab]
  );

  const filtered = useMemo(() => {
    let list = statusFilter === "todos" ? byTab : byTab.filter((p) => p.status === statusFilter);
    switch (sortBy) {
      case "valor-desc":
        return [...list].sort((a, b) => b.offeredPrice - a.offeredPrice);
      case "valor-asc":
        return [...list].sort((a, b) => a.offeredPrice - b.offeredPrice);
      default:
        return [...list].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }
  }, [byTab, statusFilter, sortBy]);

  const stats = useMemo(
    () => ({
      recebidas: mockProposals.filter((p) => p.type === "recebida").length,
      pendentes: mockProposals.filter((p) => p.type === "recebida" && p.status === "pendente").length,
      enviadas: mockProposals.filter((p) => p.type === "enviada").length,
      emNegociacao: mockProposals.filter(
        (p) => p.type === "recebida" && (p.status === "aceita" || p.status === "contra_proposta")
      ).length,
    }),
    []
  );

  const handleAccept = (id: string) => {
    // TODO: chamada API; aqui só feedback visual se quiser
  };
  const handleRefuse = (id: string) => {
    // TODO: chamada API
  };

  return (
    <div className="dashboard__content hover-bgc-color">
      {/* Page header */}
      <div className="row pb40">
        <div className="col-lg-12">
          <div className="dashboard_title_area">
            <h2>Propostas</h2>
            <p className="text">Gerencie propostas recebidas nos seus anúncios e as que você enviou</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="row mb30">
        {[
          { label: "Recebidas", value: stats.recebidas, color: "#0d6efd", icon: "fal fa-inbox" },
          { label: "Pendentes de resposta", value: stats.pendentes, color: "#f0ad4e", icon: "fal fa-clock" },
          { label: "Em negociação", value: stats.emNegociacao, color: "#6f42c1", icon: "fal fa-handshake" },
          { label: "Enviadas", value: stats.enviadas, color: "#5bbb7b", icon: "fal fa-paper-plane" },
        ].map((s) => (
          <div key={s.label} className="col-sm-6 col-xxl-3">
            <div className="ps-widget bgc-white bdrs12 p20 mb20 d-flex align-items-center justify-content-between">
              <div>
                <p className="fz28 fw700 dark-color mb-0">{s.value}</p>
                <span className="fz13 body-color">{s.label}</span>
              </div>
              <div
                className="d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ width: 52, height: 52, borderRadius: 12, backgroundColor: `${s.color}15` }}
              >
                <i className={`${s.icon} fz22`} style={{ color: s.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alerta pendentes */}
      {stats.pendentes > 0 && (
        <div
          className="d-flex align-items-center justify-content-between gap-3 bdrs12 p15 mb25 flex-wrap"
          style={{ backgroundColor: "rgba(240,173,78,0.1)", border: "1px solid rgba(240,173,78,0.3)" }}
        >
          <div className="d-flex align-items-center gap-2">
            <i className="fas fa-bell fz18" style={{ color: "#f0ad4e" }} />
            <p className="mb-0 fz14 fw500 dark-color">
              <strong>{stats.pendentes} proposta{stats.pendentes > 1 ? "s" : ""}</strong> aguardando sua resposta.
            </p>
          </div>
          <button
            type="button"
            className="ud-btn btn-thm bdrs12 fz13"
            style={{ padding: "8px 18px" }}
            onClick={() => setActiveTab("recebidas")}
          >
            Ver recebidas <i className="fal fa-arrow-right-long ms-1" />
          </button>
        </div>
      )}

      {/* Tabs + Filtros + Ordenação */}
      <div className="ps-widget bgc-white bdrs12 p20 mb25">
        <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between">
          <div className="d-flex flex-wrap gap-2 align-items-center">
            <button
              onClick={() => { setActiveTab("recebidas"); setStatusFilter("todos"); }}
              className={`ud-btn bdrs60 fz13 ${activeTab === "recebidas" ? "btn-thm" : "btn-white"}`}
              style={{ padding: "6px 18px" }}
            >
              Recebidas
              <span
                className="ms-1 fz11 fw600 d-inline-flex align-items-center justify-content-center"
                style={{
                  width: 20, height: 20, borderRadius: "50%",
                  backgroundColor: activeTab === "recebidas" ? "rgba(255,255,255,0.25)" : "#f0f0f0",
                  color: activeTab === "recebidas" ? "#fff" : "#6b7177",
                }}
              >
                {stats.recebidas}
              </span>
              {stats.pendentes > 0 && (
                <span
                  className="ms-1 fz10 fw600 d-inline-flex align-items-center justify-content-center text-white"
                  style={{ background: "#f0ad4e", borderRadius: 20, padding: "0 6px", height: 18 }}
                >
                  {stats.pendentes} pendente{stats.pendentes > 1 ? "s" : ""}
                </span>
              )}
            </button>
            <button
              onClick={() => { setActiveTab("enviadas"); setStatusFilter("todos"); }}
              className={`ud-btn bdrs60 fz13 ${activeTab === "enviadas" ? "btn-thm" : "btn-white"}`}
              style={{ padding: "6px 18px" }}
            >
              Enviadas
              <span
                className="ms-1 fz11 fw600 d-inline-flex align-items-center justify-content-center"
                style={{
                  width: 20, height: 20, borderRadius: "50%",
                  backgroundColor: activeTab === "enviadas" ? "rgba(255,255,255,0.25)" : "#f0f0f0",
                  color: activeTab === "enviadas" ? "#fff" : "#6b7177",
                }}
              >
                {stats.enviadas}
              </span>
            </button>
            <span className="fz13 body-color mx-2">|</span>
            <select
              className="form-select fz13"
              style={{ width: 160, height: 38 }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ProposalStatus | "todos")}
            >
              {statusFilters.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
            <select
              className="form-select fz13"
              style={{ width: 160, height: 38 }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
            >
              <option value="recente">Mais recente</option>
              <option value="valor-desc">Maior oferta</option>
              <option value="valor-asc">Menor oferta</option>
            </select>
          </div>
        </div>
      </div>

      {/* Resultados */}
      <p className="fz13 body-color mb15">
        {filtered.length === 0 ? "Nenhuma proposta" : `${filtered.length} proposta${filtered.length !== 1 ? "s" : ""}`}
      </p>

      {filtered.length === 0 ? (
        <div className="ps-widget bgc-white bdrs12 p40 text-center">
          <div
            className="d-inline-flex align-items-center justify-content-center mb20"
            style={{ width: 72, height: 72, borderRadius: "50%", backgroundColor: "#f8f9fa" }}
          >
            <i className="fal fa-file-alt fz30 body-light-color" />
          </div>
          <h5 className="mb10">
            {statusFilter !== "todos"
              ? `Nenhuma proposta ${getProposalStatusLabel(statusFilter as ProposalStatus).toLowerCase()}`
              : activeTab === "recebidas"
                ? "Nenhuma proposta recebida"
                : "Nenhuma proposta enviada"}
          </h5>
          <p className="body-color fz14 mb25">
            {activeTab === "recebidas"
              ? "Quando receber propostas nos seus anúncios, elas aparecerão aqui."
              : "Envie propostas em cotas do marketplace para acompanhá-las aqui."}
          </p>
          <Link href={activeTab === "recebidas" ? "/cotista/anuncios" : "/marketplace"} className="ud-btn btn-thm bdrs12">
            {activeTab === "recebidas" ? "Ver meus anúncios" : "Explorar marketplace"} <i className="fal fa-arrow-right-long ms-1" />
          </Link>
        </div>
      ) : (
        filtered.map((proposal) => (
          <ProposalCard
            key={proposal.id}
            proposal={proposal}
            onAccept={handleAccept}
            onRefuse={handleRefuse}
          />
        ))
      )}
    </div>
  );
}
