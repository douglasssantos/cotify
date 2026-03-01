"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import {
  mockListings,
  mockProposals,
  getListingStatusLabel,
  getListingStatusClass,
  type ListingStatus,
  type Listing,
} from "@/data/mock-secondary-market";

// ─── constants ────────────────────────────────────────────────────────────────

type SortKey = "recente" | "preco-asc" | "preco-desc" | "visualizacoes" | "propostas";

const statusTabs: { label: string; value: ListingStatus | "todos" }[] = [
  { label: "Todos", value: "todos" },
  { label: "Ativos", value: "ativo" },
  { label: "Pausados", value: "pausado" },
  { label: "Vendidos", value: "vendido" },
  { label: "Expirados", value: "expirado" },
];

const goodTypeIcon: Record<Listing["goodType"], string> = {
  imovel: "fa-home",
  veiculo: "fa-car",
  servico: "fa-tools",
};

const goodTypeColor: Record<Listing["goodType"], string> = {
  imovel: "#5bbb7b",
  veiculo: "#0d6efd",
  servico: "#f0ad4e",
};

// ─── helpers ──────────────────────────────────────────────────────────────────

function pendingProposals(listingId: string) {
  return mockProposals.filter(
    (p) => p.listingId === listingId && p.type === "recebida" && p.status === "pendente"
  ).length;
}

function daysOnline(createdAt: string) {
  const diff = Date.now() - new Date(createdAt).getTime();
  return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

// ─── sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ListingStatus }) {
  const bg = getListingStatusClass(status);
  const iconMap: Record<ListingStatus, string> = {
    ativo: "fa-circle",
    pausado: "fa-pause-circle",
    vendido: "fa-check-circle",
    expirado: "fa-exclamation-circle",
    rascunho: "fa-edit",
  };
  return (
    <span
      className="d-inline-flex align-items-center gap-1 fz12 fw600 text-white"
      style={{ background: bg, borderRadius: 20, padding: "3px 10px" }}
    >
      <i className={`fas ${iconMap[status]}`} style={{ fontSize: 9 }} />
      {getListingStatusLabel(status)}
    </span>
  );
}

function MetricPill({
  icon,
  value,
  label,
  color = "#6b7177",
}: {
  icon: string;
  value: React.ReactNode;
  label: string;
  color?: string;
}) {
  return (
    <div
      className="d-flex align-items-center gap-1 bdrs8 px-2 py-1"
      style={{ backgroundColor: "#f8f9fa" }}
      title={label}
    >
      <i className={`fal ${icon} fz12`} style={{ color }} />
      <span className="fz12 fw600 dark-color">{value}</span>
      <span className="fz11 body-color">{label}</span>
    </div>
  );
}

function ListingCard({
  listing,
  onPause,
  onResume,
}: {
  listing: Listing;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
}) {
  const paidPct = Math.round((listing.paidAmount / listing.creditValue) * 100);
  const pending = pendingProposals(listing.id);
  const days = daysOnline(listing.createdAt);
  const iconColor = goodTypeColor[listing.goodType];

  return (
    <div
      className="ps-widget bgc-white bdrs12 p0 mb20 overflow-hidden"
      style={{ border: "1px solid #ebebeb", transition: "box-shadow .2s" }}
    >
      {/* top accent line por tipo */}
      <div style={{ height: 3, backgroundColor: iconColor }} />

      <div className="p25">
        {/* ── Header ── */}
        <div className="d-flex align-items-start justify-content-between gap-3 mb18">
          <div className="d-flex align-items-center gap-3">
            <div
              className="d-flex align-items-center justify-content-center flex-shrink-0"
              style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: `${iconColor}15` }}
            >
              <i className={`fal ${goodTypeIcon[listing.goodType]} fz20`} style={{ color: iconColor }} />
            </div>
            <div>
              <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                <h6 className="mb-0 fw600 dark-color">
                  {listing.groupCode} · Cota #{listing.quotaNumber}
                </h6>
                <StatusBadge status={listing.status} />
              </div>
              <p className="fz13 body-color mb-0">
                {listing.goodTypeLabel} · {listing.administradora}
              </p>
            </div>
          </div>

          {/* preço */}
          <div className="text-end flex-shrink-0">
            <h4 className="mb-0 fw700" style={{ color: iconColor }}>{formatCurrency(listing.askingPrice)}</h4>
            <p className="fz12 body-color mb-0">{formatCurrency(listing.installmentValue)}/mês a assumir</p>
          </div>
        </div>

        {/* ── Progress ── */}
        <div className="mb18">
          <div className="d-flex justify-content-between mb-1">
            <span className="fz12 body-color">Progresso de pagamento</span>
            <span className="fz12 fw600 dark-color">{paidPct}% pago</span>
          </div>
          <div className="progress bdrs60" style={{ height: 6 }}>
            <div
              className="progress-bar bdrs60"
              style={{ width: `${paidPct}%`, backgroundColor: iconColor }}
            />
          </div>
          <div className="d-flex justify-content-between mt-1">
            <span className="fz11 body-color">{formatCurrency(listing.paidAmount)} pagos</span>
            <span className="fz11 body-color">{listing.remainingInstallments}/{listing.totalInstallments} parcelas restantes · crédito {formatCurrency(listing.creditValue)}</span>
          </div>
        </div>

        {/* ── Métricas ── */}
        <div className="d-flex flex-wrap gap-2 mb18">
          <MetricPill icon="fa-eye" value={listing.views} label="views" color="#0d6efd" />
          <MetricPill icon="fa-file-alt" value={listing.proposals} label="propostas" color="#6f42c1" />
          {pending > 0 && (
            <MetricPill icon="fa-bell" value={pending} label="pendentes" color="#f0ad4e" />
          )}
          <MetricPill icon="fa-calendar" value={`${days}d`} label="no ar" color="#5bbb7b" />
          {listing.isContemplada && (
            <span
              className="d-inline-flex align-items-center gap-1 fz12 fw600 text-white"
              style={{ background: "#1f4b3f", borderRadius: 20, padding: "3px 10px" }}
            >
              <i className="fas fa-star" style={{ fontSize: 9 }} /> Contemplada
            </span>
          )}
          {listing.acceptsCounterOffer && (
            <span
              className="d-inline-flex align-items-center gap-1 fz12 body-color bdrs60 bdr1"
              style={{ padding: "3px 10px" }}
            >
              <i className="fal fa-handshake fz11" /> Negocia
            </span>
          )}
          {listing.acceptsFinancing && (
            <span
              className="d-inline-flex align-items-center gap-1 fz12 body-color bdrs60 bdr1"
              style={{ padding: "3px 10px" }}
            >
              <i className="fal fa-credit-card fz11" /> Parcelado
            </span>
          )}
        </div>

        {/* ── Descrição (resumo) ── */}
        {listing.description && (
          <p
            className="fz13 body-color mb18"
            style={{
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {listing.description}
          </p>
        )}

        {/* ── Footer: datas + ações ── */}
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 pt15" style={{ borderTop: "1px solid #f3f3f3" }}>
          <p className="fz12 body-color mb-0">
            <i className="fal fa-clock me-1" />
            Publicado em {new Date(listing.createdAt).toLocaleDateString("pt-BR")} · atualizado em {new Date(listing.updatedAt).toLocaleDateString("pt-BR")}
          </p>

          <div className="d-flex gap-2 flex-wrap">
            {listing.status === "ativo" && (
              <>
                {pending > 0 && (
                  <Link
                    href="/cotista/propostas"
                    className="ud-btn btn-thm bdrs12 fz13"
                    style={{ padding: "8px 16px" }}
                  >
                    <i className="fal fa-bell me-1" />
                    {pending} pendente{pending > 1 ? "s" : ""}
                  </Link>
                )}
                <Link
                  href="/cotista/propostas"
                  className="ud-btn btn-light-thm bdrs12 fz13"
                  style={{ padding: "8px 16px" }}
                >
                  <i className="fal fa-file-alt me-1" /> Propostas ({listing.proposals})
                </Link>
                <button
                  className="ud-btn btn-thm-border bdrs12 fz13"
                  style={{ padding: "8px 16px" }}
                  onClick={() => onPause(listing.id)}
                >
                  <i className="fal fa-pause-circle me-1" /> Pausar
                </button>
                <button
                  className="ud-btn btn-white bdrs12 fz13"
                  style={{ padding: "8px 16px" }}
                >
                  <i className="fal fa-edit me-1" /> Editar
                </button>
              </>
            )}

            {listing.status === "pausado" && (
              <>
                <button
                  className="ud-btn btn-thm bdrs12 fz13"
                  style={{ padding: "8px 16px" }}
                  onClick={() => onResume(listing.id)}
                >
                  <i className="fal fa-play-circle me-1" /> Reativar
                </button>
                <button
                  className="ud-btn btn-white bdrs12 fz13"
                  style={{ padding: "8px 16px" }}
                >
                  <i className="fal fa-edit me-1" /> Editar
                </button>
                <button
                  className="ud-btn fz13 bdrs12"
                  style={{ padding: "8px 16px", color: "#eb6753", border: "1px solid #eb6753", background: "transparent" }}
                >
                  <i className="fal fa-trash me-1" /> Excluir
                </button>
              </>
            )}

            {listing.status === "vendido" && (
              <>
                <Link
                  href="/cotista/transferencias"
                  className="ud-btn btn-light-thm bdrs12 fz13"
                  style={{ padding: "8px 16px" }}
                >
                  <i className="fal fa-exchange-alt me-1" /> Ver Repasse
                </Link>
                <Link
                  href="/cotista/anunciar"
                  className="ud-btn btn-thm-border bdrs12 fz13"
                  style={{ padding: "8px 16px" }}
                >
                  <i className="fal fa-redo me-1" /> Novo Anúncio
                </Link>
              </>
            )}

            {listing.status === "expirado" && (
              <>
                <button
                  className="ud-btn btn-thm bdrs12 fz13"
                  style={{ padding: "8px 16px" }}
                >
                  <i className="fal fa-redo me-1" /> Republicar
                </button>
                <button
                  className="ud-btn fz13 bdrs12"
                  style={{ padding: "8px 16px", color: "#eb6753", border: "1px solid #eb6753", background: "transparent" }}
                >
                  <i className="fal fa-trash me-1" /> Excluir
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function MeusAnunciosPage() {
  const [activeTab, setActiveTab] = useState<ListingStatus | "todos">("todos");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("recente");
  const [listings, setListings] = useState(mockListings);

  // derived stats (always from original mockListings)
  const stats = useMemo(() => ({
    total: listings.length,
    ativos: listings.filter((l) => l.status === "ativo").length,
    pausados: listings.filter((l) => l.status === "pausado").length,
    vendidos: listings.filter((l) => l.status === "vendido").length,
    views: listings.reduce((s, l) => s + l.views, 0),
    proposals: listings.reduce((s, l) => s + l.proposals, 0),
    pendingProposals: listings.reduce((s, l) => s + pendingProposals(l.id), 0),
  }), [listings]);

  const filtered = useMemo(() => {
    let list = listings;

    if (activeTab !== "todos") list = list.filter((l) => l.status === activeTab);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (l) =>
          l.groupCode.toLowerCase().includes(q) ||
          l.administradora.toLowerCase().includes(q) ||
          l.goodTypeLabel.toLowerCase().includes(q) ||
          String(l.quotaNumber).includes(q)
      );
    }

    switch (sortBy) {
      case "preco-asc": return [...list].sort((a, b) => a.askingPrice - b.askingPrice);
      case "preco-desc": return [...list].sort((a, b) => b.askingPrice - a.askingPrice);
      case "visualizacoes": return [...list].sort((a, b) => b.views - a.views);
      case "propostas": return [...list].sort((a, b) => b.proposals - a.proposals);
      default: return [...list].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }
  }, [listings, activeTab, search, sortBy]);

  const handlePause = (id: string) =>
    setListings((prev) => prev.map((l) => (l.id === id ? { ...l, status: "pausado" as ListingStatus } : l)));

  const handleResume = (id: string) =>
    setListings((prev) => prev.map((l) => (l.id === id ? { ...l, status: "ativo" as ListingStatus } : l)));

  return (
    <div className="dashboard__content hover-bgc-color">
      {/* ── Page header ── */}
      <div className="row pb40">
        <div className="col-lg-12">
          <div className="dashboard_title_area d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h2>Meus Anúncios</h2>
              <p className="text">Gerencie suas cotas e bens publicados no marketplace</p>
            </div>
            <Link href="/cotista/anunciar" className="ud-btn btn-thm bdrs12">
              <i className="fas fa-plus me-2" /> Novo Anúncio
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="row mb30">
        {[
          { label: "Ativos", value: stats.ativos, color: "#5bbb7b", bg: "rgba(91,187,123,0.1)", icon: "fal fa-check-circle" },
          { label: "Total de Views", value: stats.views.toLocaleString("pt-BR"), color: "#0d6efd", bg: "rgba(13,110,253,0.1)", icon: "fal fa-eye" },
          { label: "Propostas recebidas", value: stats.proposals, color: "#6f42c1", bg: "rgba(111,66,193,0.1)", icon: "fal fa-file-alt" },
          { label: "Pendentes de resposta", value: stats.pendingProposals, color: "#f0ad4e", bg: "rgba(240,173,78,0.1)", icon: "fal fa-bell" },
        ].map((s) => (
          <div key={s.label} className="col-sm-6 col-xxl-3">
            <div className="ps-widget bgc-white bdrs12 p20 mb20 d-flex align-items-center justify-content-between">
              <div>
                <p className="fz28 fw700 dark-color mb-0">{s.value}</p>
                <span className="fz13 body-color">{s.label}</span>
              </div>
              <div
                className="d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ width: 52, height: 52, borderRadius: 12, backgroundColor: s.bg }}
              >
                <i className={`${s.icon} fz22`} style={{ color: s.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Alerta: propostas pendentes ── */}
      {stats.pendingProposals > 0 && (
        <div
          className="d-flex align-items-center justify-content-between gap-3 bdrs12 p15 mb25 flex-wrap"
          style={{ backgroundColor: "rgba(240,173,78,0.1)", border: "1px solid rgba(240,173,78,0.3)" }}
        >
          <div className="d-flex align-items-center gap-2">
            <i className="fas fa-bell fz18" style={{ color: "#f0ad4e" }} />
            <p className="mb-0 fz14 fw500 dark-color">
              Você tem <strong>{stats.pendingProposals} proposta{stats.pendingProposals > 1 ? "s" : ""} pendente{stats.pendingProposals > 1 ? "s" : ""}</strong> aguardando resposta.
            </p>
          </div>
          <Link href="/cotista/propostas" className="ud-btn btn-thm bdrs12 fz13" style={{ padding: "8px 18px" }}>
            Ver propostas <i className="fal fa-arrow-right-long ms-1" />
          </Link>
        </div>
      )}

      {/* ── Filtros e busca ── */}
      <div className="ps-widget bgc-white bdrs12 p20 mb25">
        <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between">
          {/* Tabs de status */}
          <div className="d-flex flex-wrap gap-2">
            {statusTabs.map((tab) => {
              const count =
                tab.value === "todos"
                  ? listings.length
                  : listings.filter((l) => l.status === tab.value).length;
              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`ud-btn bdrs60 fz13 ${activeTab === tab.value ? "btn-thm" : "btn-white"}`}
                  style={{ padding: "6px 16px" }}
                >
                  {tab.label}
                  <span
                    className="ms-1 fz11 fw600 d-inline-flex align-items-center justify-content-center"
                    style={{
                      width: 18, height: 18, borderRadius: "50%",
                      backgroundColor: activeTab === tab.value ? "rgba(255,255,255,0.25)" : "#f0f0f0",
                      color: activeTab === tab.value ? "#fff" : "#6b7177",
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search + sort */}
          <div className="d-flex gap-2 flex-wrap">
            <div className="position-relative">
              <i
                className="fal fa-search fz14 position-absolute"
                style={{ left: 12, top: "50%", transform: "translateY(-50%)", color: "#9fa3a8" }}
              />
              <input
                type="text"
                className="form-control fz13"
                style={{ paddingLeft: 36, width: 220, height: 40 }}
                placeholder="Buscar por grupo, cota..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="form-select fz13"
              style={{ width: 180, height: 40 }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
            >
              <option value="recente">Mais recente</option>
              <option value="preco-desc">Maior preço</option>
              <option value="preco-asc">Menor preço</option>
              <option value="visualizacoes">Mais views</option>
              <option value="propostas">Mais propostas</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Resultados ── */}
      <div className="d-flex align-items-center justify-content-between mb15">
        <p className="fz13 body-color mb-0">
          {filtered.length === 0 ? "Nenhum anúncio encontrado" : `${filtered.length} anúncio${filtered.length !== 1 ? "s" : ""}`}
        </p>
        {search && (
          <button className="ud-btn btn-white bdrs12 fz12" onClick={() => setSearch("")} style={{ padding: "4px 12px" }}>
            <i className="fal fa-times me-1" /> Limpar busca
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="ps-widget bgc-white bdrs12 p40 text-center">
          <div
            className="d-inline-flex align-items-center justify-content-center mb20"
            style={{ width: 72, height: 72, borderRadius: "50%", backgroundColor: "#f8f9fa" }}
          >
            <i className="fal fa-megaphone fz30 body-light-color" />
          </div>
          <h5 className="mb10">
            {search
              ? "Nenhum anúncio corresponde à busca"
              : activeTab === "todos"
                ? "Você ainda não criou nenhum anúncio"
                : `Nenhum anúncio ${getListingStatusLabel(activeTab as ListingStatus).toLowerCase()}`}
          </h5>
          <p className="body-color fz14 mb25">
            {search
              ? "Tente outro termo ou limpe o filtro de busca."
              : "Publique sua cota no marketplace e receba propostas de compradores."}
          </p>
          {!search && (
            <Link href="/cotista/anunciar" className="ud-btn btn-thm bdrs12">
              <i className="fas fa-plus me-2" /> Criar Anúncio
            </Link>
          )}
        </div>
      ) : (
        filtered.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            onPause={handlePause}
            onResume={handleResume}
          />
        ))
      )}
    </div>
  );
}
