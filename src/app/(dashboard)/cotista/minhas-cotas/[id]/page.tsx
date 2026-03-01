"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  mockQuotas,
  installmentBreakdown,
  bidSimulation,
  correctedCreditValue,
  creditStatusLabels,
  creditStatusColors,
  type CreditStatus,
} from "@/data/mock-quotas";
import { mockGroups } from "@/data/mock-groups";
import {
  getQuotaInstallments,
  getQuotaOverdueSummary,
  getInstallmentStatusLabel,
  getInstallmentStatusColor,
  mockContemplationRequests,
  mockQuotaDocuments,
  getContemplationRequestStatusLabel,
  getDocumentTypeLabel,
} from "@/data/mock-cotista";
import { formatCurrency, getStatusColor, getStatusLabel } from "@/lib/utils";
import type { Quota } from "@/data/mock-quotas";
import {
  SimuladorLanceModal,
  SimuladorContemplacaoModal,
  SimuladorParcelasModal,
  SimuladorInadimplenciaModal,
} from "@/components/cotista";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "visao-geral" | "parcelas" | "lance" | "documentos" | "contemplacao";

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: "visao-geral",  label: "Visão Geral",   icon: "fal fa-home"        },
  { id: "parcelas",     label: "Parcelas",       icon: "fal fa-list-ul"     },
  { id: "lance",        label: "Lance/Sorteio",  icon: "fal fa-gavel"       },
  { id: "documentos",   label: "Documentos",     icon: "fal fa-file-alt"    },
  { id: "contemplacao", label: "Contemplação",   icon: "fal fa-trophy"      },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function saldoDevedor(quota: Quota) {
  return quota.creditValue - quota.paidAmount;
}

/** Datas base por quota para que parcelas apareçam atrasadas no demo */
const quotaStartDates: Record<string, { startYear: number; startMonth: number }> = {
  "1": { startYear: 2022, startMonth: 1 },
  "3": { startYear: 2022, startMonth: 3 },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <li
      className="d-flex justify-content-between align-items-center mb-2 pb-2"
      style={{ borderBottom: "1px solid #f4f4f4" }}
    >
      <span className="body-color fz13">{label}</span>
      <span className="fw500 fz13 text-end">{value}</span>
    </li>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; color: string }> = {
    ativa:         { bg: "rgba(91,187,123,0.15)",  color: "#5bbb7b" },
    contemplada:   { bg: "rgba(13,110,253,0.15)",   color: "#0d6efd" },
    inadimplente:  { bg: "rgba(235,103,83,0.15)",   color: "#c53030" },
    cancelada:     { bg: "rgba(108,117,125,0.15)",  color: "#6c757d" },
    quitada:       { bg: "rgba(91,187,123,0.15)",   color: "#5bbb7b" },
    transferida:   { bg: "rgba(108,117,125,0.15)",  color: "#6c757d" },
  };
  const c = colors[status] ?? colors.ativa;
  return (
    <span
      className="fz12 fw500"
      style={{ padding: "2px 10px", borderRadius: 20, backgroundColor: c.bg, color: c.color }}
    >
      {getStatusLabel(status)}
    </span>
  );
}

function CreditStatusBadge({ status }: { status: CreditStatus }) {
  return (
    <span
      className="fz11 fw500"
      style={{
        padding: "2px 9px",
        borderRadius: 12,
        backgroundColor: `${creditStatusColors[status]}22`,
        color: creditStatusColors[status],
        border: `1px solid ${creditStatusColors[status]}55`,
      }}
    >
      {creditStatusLabels[status]}
    </span>
  );
}

function CreditStatusStepper({ status }: { status: CreditStatus }) {
  const steps: { id: CreditStatus; label: string }[] = [
    { id: "pending",       label: "Pendente"    },
    { id: "awaiting_docs", label: "Documentos"  },
    { id: "under_review",  label: "Análise"     },
    { id: "approved",      label: "Aprovado"    },
    { id: "released",      label: "Liberado"    },
  ];
  const currentIdx = steps.findIndex((s) => s.id === status);
  return (
    <div className="d-flex align-items-center my15">
      {steps.map((step, idx) => {
        const done   = idx <= currentIdx;
        const active = idx === currentIdx;
        return (
          <div
            key={step.id}
            className="d-flex align-items-center"
            style={{ flex: idx < steps.length - 1 ? "1 1 0" : "none" }}
          >
            <div className="d-flex flex-column align-items-center">
              <div
                style={{
                  width: 30, height: 30, borderRadius: "50%",
                  backgroundColor: done ? "#5bbb7b" : "#e8e8e8",
                  border: active ? "2px solid #5bbb7b" : "2px solid transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: active ? "0 0 0 4px rgba(91,187,123,0.18)" : "none",
                  flexShrink: 0,
                }}
              >
                {done
                  ? <i className="fal fa-check" style={{ color: "#fff", fontSize: 11 }} />
                  : <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#ccc", display: "block" }} />
                }
              </div>
              <span className="fz10 body-color mt-1 text-center" style={{ whiteSpace: "nowrap" }}>
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                style={{
                  flex: 1, height: 2, marginBottom: 18,
                  backgroundColor: idx < currentIdx ? "#5bbb7b" : "#e8e8e8",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function QuotaDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";

  const [activeTab, setActiveTab]         = useState<Tab>("visao-geral");
  const [filterParcelas, setFilterParcelas] = useState<"pendentes" | "todas">("pendentes");
  const [modalLance, setModalLance] = useState(false);
  const [modalContemplacao, setModalContemplacao] = useState(false);
  const [modalParcelas, setModalParcelas] = useState(false);
  const [modalInadimplencia, setModalInadimplencia] = useState(false);

  const quota = useMemo(() => mockQuotas.find((q) => q.id === id), [id]);
  const group = useMemo(
    () => (quota ? mockGroups.find((g) => g.code === quota.groupCode) : null),
    [quota]
  );

  const paidCount     = quota ? quota.totalInstallments - quota.remainingInstallments : 0;
  const progressPct   = quota ? Math.round((paidCount / quota.totalInstallments) * 100) : 0;
  const breakdown     = useMemo(() => (quota ? installmentBreakdown(quota) : null), [quota]);
  const sim           = useMemo(
    () => (quota ? bidSimulation(quota, group?.activeQuotas ?? 100) : null),
    [quota, group]
  );
  /** Crédito corrigido no último mês pago */
  const correctedCredit = useMemo(
    () => (quota ? correctedCreditValue(quota, paidCount + 1) : 0),
    [quota, paidCount]
  );

  const installments = useMemo(() => {
    if (!quota) return [];
    return getQuotaInstallments(
      quota.id, quota.groupCode, quota.quotaNumber,
      quota.totalInstallments, quota.installmentValue,
      paidCount, quotaStartDates[quota.id]
    );
  }, [quota, paidCount]);

  const overdueSummary       = useMemo(() => getQuotaOverdueSummary(installments), [installments]);
  const pendingInstallments  = useMemo(() => installments.filter((i) => i.status !== "paga"), [installments]);
  const displayInstallments  = filterParcelas === "todas" ? installments : pendingInstallments;

  const contemplationRequest = useMemo(
    () => mockContemplationRequests.find((r) => r.quotaId === id), [id]
  );
  const documents = useMemo(
    () => mockQuotaDocuments.filter((d) => d.quotaId === id), [id]
  );
  const nextAssembly = useMemo(() => {
    if (!group?.assemblies?.length) return null;
    return group.assemblies
      .filter((a) => a.status === "agendada")
      .sort((a, b) => a.date.localeCompare(b.date))[0] ?? null;
  }, [group]);

  // ── 404 ──
  if (!quota) {
    return (
      <div className="dashboard__content hover-bgc-color">
        <div className="row">
          <div className="col-12 text-center py-5">
            <i className="fal fa-search fz40 body-color mb20 d-block" />
            <h5 className="mb10">Cota não encontrada</h5>
            <p className="body-color fz14 mb20">Verifique se o endereço está correto.</p>
            <Link href="/cotista/minhas-cotas" className="ud-btn btn-thm bdrs8">
              Voltar para Minhas Cotas
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard__content hover-bgc-color">

      {/* ── Breadcrumb + cabeçalho ── */}
      <div className="row pb10">
        <div className="col-12">
          <nav className="fz13 body-color mb10">
            <Link href="/cotista/minhas-cotas" className="text-decoration-none body-color">
              <i className="fal fa-home me-1" />Minhas Cotas
            </Link>
            <span className="mx-2">/</span>
            <span className="fw500 dark-color">{quota.groupCode} — Cota #{quota.quotaNumber}</span>
          </nav>

          <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb25">
            <div>
              <h2 className="mb-1">{quota.groupCode} — Cota #{quota.quotaNumber}</h2>
              <div className="d-flex flex-wrap align-items-center gap-2">
                <span className="fz14 body-color">
                  <i className={`fal ${quota.goodType === "imovel" ? "fa-home" : quota.goodType === "veiculo" ? "fa-car" : "fa-tools"} me-1`} />
                  {quota.goodTypeLabel}
                </span>
                <span className="body-color">·</span>
                <span className="fz14 body-color">{quota.administradora}</span>
                <StatusBadge status={quota.status} />
                {quota.creditStatus && <CreditStatusBadge status={quota.creditStatus} />}
              </div>
            </div>
            <div className="d-flex gap-2 flex-wrap">
              <button
                type="button"
                className="ud-btn btn-white bdrs8 fz13"
                style={{ border: "1px solid #0d6efd", color: "#0d6efd" }}
                onClick={() => {}}
              >
                <i className="fal fa-barcode me-1" />Gerar boleto
              </button>
              <Link href={`/cotista/anunciar?quota=${quota.id}`} className="ud-btn btn-thm bdrs8 fz13">
                <i className="fal fa-tag me-1" />Vender cota
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Alerta inadimplência ── */}
      {(overdueSummary || quota.status === "inadimplente") && (
        <div className="row mb20">
          <div className="col-12">
            <div
              className="bdrs8 p20"
              style={{ backgroundColor: "rgba(235,103,83,0.08)", border: "1px solid rgba(235,103,83,0.35)" }}
            >
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                <div className="d-flex align-items-start gap-3">
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                    backgroundColor: "rgba(235,103,83,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <i className="fal fa-exclamation-triangle" style={{ color: "#c53030" }} />
                  </div>
                  <div>
                    <p className="fz14 fw600 mb-1" style={{ color: "#c53030" }}>
                      {overdueSummary
                        ? `Cota com ${overdueSummary.overdueCount} parcela${overdueSummary.overdueCount > 1 ? "s" : ""} em atraso`
                        : "Cota em situação de inadimplência"}
                    </p>
                    {overdueSummary && (
                      <p className="fz13 body-color mb-0">
                        Em atraso: <strong>{formatCurrency(overdueSummary.totalOverdueValue)}</strong>
                        {" "}+ juros <strong>{formatCurrency(overdueSummary.totalInterest)}</strong>
                        {" "}= <strong style={{ color: "#c53030" }}>
                          {formatCurrency(overdueSummary.totalOverdueValue + overdueSummary.totalInterest)}
                        </strong>
                      </p>
                    )}
                    {quota.defaultingSince && (
                      <p className="fz12 body-color mb-0 mt-1">
                        Inadimplente desde:{" "}
                        {new Date(quota.defaultingSince).toLocaleDateString("pt-BR")}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  className="ud-btn bdrs8 fz13 fw500"
                  style={{ backgroundColor: "#c53030", color: "#fff", border: "none" }}
                  onClick={() => setActiveTab("parcelas")}
                >
                  Ver parcelas em atraso
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── KPI cards ── */}
      <div className="row g-3 mb25">
        {[
          { icon: "fa-credit-card",  color: "#0d6efd",  bg: "rgba(13,110,253,0.1)",   label: "Crédito",       val: formatCurrency(quota.creditValue)   },
          { icon: "fa-check-circle", color: "#5bbb7b",  bg: "rgba(91,187,123,0.12)",  label: "Valor pago",    val: formatCurrency(quota.paidAmount)    },
          { icon: "fa-clock",        color: "#e0900a",  bg: "rgba(240,173,78,0.12)",  label: "Saldo devedor", val: formatCurrency(saldoDevedor(quota)) },
          { icon: "fa-calendar",     color: "#6c757d",  bg: "rgba(108,117,125,0.1)", label: "Parcela/mês",   val: formatCurrency(quota.installmentValue) },
          { icon: "fa-shield-alt",   color: "#9b59b6",  bg: "rgba(155,89,182,0.1)",  label: "Seguro/mês",    val: formatCurrency(quota.insurance)     },
          { icon: "fa-gavel",        color: "#e0900a",  bg: "rgba(240,173,78,0.12)", label: "Lances feitos", val: String(quota.bidCount)              },
        ].map((kpi) => (
          <div key={kpi.label} className="col-6 col-md-4 col-lg-2">
            <div className="ps-widget bgc-white bdrs8 p15 bdr1 h-100">
              <div className="d-flex align-items-center gap-2 mb-2">
                <div style={{ width: 28, height: 28, borderRadius: 7, backgroundColor: kpi.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <i className={`fal ${kpi.icon} fz12`} style={{ color: kpi.color }} />
                </div>
                <span className="fz11 body-color">{kpi.label}</span>
              </div>
              <p className="fz15 fw700 mb-0 dark-color">{kpi.val}</p>
            </div>
          </div>
        ))}

        {/* Barra de progresso */}
        <div className="col-12">
          <div className="ps-widget bgc-white bdrs8 p20 bdr1">
            <div className="d-flex justify-content-between mb-2">
              <span className="fz13 fw500 body-color">Progresso do consórcio</span>
              <span className="fz13 fw600 dark-color">
                {paidCount}/{quota.totalInstallments} parcelas
                <span className="fz12 body-color ms-2">({progressPct}%)</span>
              </span>
            </div>
            <div style={{ height: 8, backgroundColor: "#f0f0f0", borderRadius: 6, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progressPct}%`, backgroundColor: "#5bbb7b", borderRadius: 6, transition: "width .4s" }} />
            </div>
            <div className="d-flex justify-content-between mt-1">
              <span className="fz11 body-color">Pagas: {paidCount}</span>
              <span className="fz11 body-color">Restantes: {quota.remainingInstallments}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="row mb0">
        <div className="col-12">
          <div className="bgc-white bdrs8 bdr1 overflow-hidden">

            {/* Tab bar */}
            <div style={{ borderBottom: "1px solid #e8e8e8" }}>
              <div className="d-flex overflow-auto" style={{ flexWrap: "nowrap" }}>
                {tabs.map((tab) => {
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      style={{
                        border: "none", background: "none",
                        padding: "14px 22px", cursor: "pointer", whiteSpace: "nowrap",
                        fontSize: 13, fontWeight: active ? 600 : 400,
                        color: active ? "#0d6efd" : "#6c757d",
                        borderBottom: active ? "2px solid #0d6efd" : "2px solid transparent",
                        display: "flex", alignItems: "center", gap: 6, transition: "all .2s",
                      }}
                    >
                      <i className={tab.icon} style={{ fontSize: 12 }} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab content */}
            <div className="p30">

              {/* ═══════════════════ VISÃO GERAL ═══════════════════ */}
              {activeTab === "visao-geral" && (
                <div className="row g-4">

                  {/* Grupo */}
                  <div className="col-md-6">
                    <SectionTitle>Grupo</SectionTitle>
                    <ul className="list-unstyled fz14 mb-0">
                      <InfoRow label="Código" value={quota.groupCode} />
                      <InfoRow label="Status" value={
                        <span className="fz12 fw500" style={{
                          padding: "2px 8px", borderRadius: 12,
                          backgroundColor: group?.status === "em_andamento" ? "rgba(91,187,123,0.15)" : "#f0f0f0",
                          color: group?.status === "em_andamento" ? "#5bbb7b" : "#6c757d",
                        }}>
                          {group?.status === "em_andamento" ? "Em andamento" : group?.status ?? "—"}
                        </span>
                      } />
                      <InfoRow label="Tipo de bem"   value={quota.goodTypeLabel} />
                      <InfoRow label="Prazo total"   value={`${quota.totalInstallments} meses`} />
                      <InfoRow label="Cotas ativas"  value={group?.activeQuotas ?? "—"} />
                      <InfoRow label="Contempladas"  value={group?.contemplatedQuotas ?? "—"} />
                      {group?.cooperativa  && <InfoRow label="Cooperativa"   value={group.cooperativa} />}
                      {group?.comissionado && <InfoRow label="Comissionado"  value={group.comissionado} />}
                    </ul>
                  </div>

                  {/* Administradora e taxas */}
                  <div className="col-md-6">
                    <SectionTitle>Administradora e taxas</SectionTitle>
                    <ul className="list-unstyled fz14 mb-0">
                      <InfoRow label="Administradora" value={<strong>{quota.administradora}</strong>} />
                      <InfoRow label="Nº da cota"     value={`#${quota.quotaNumber}`} />
                      <InfoRow
                        label={`Taxa de adm. (${quota.adminFee}%)`}
                        value={<span>{formatCurrency((quota.creditValue * quota.adminFee / 100) / quota.totalInstallments)}<span className="fz11 body-color">/mês</span></span>}
                      />
                      <InfoRow
                        label={`Fundo de reserva (${quota.reserveFund}%)`}
                        value={<span>{formatCurrency((quota.creditValue * quota.reserveFund / 100) / quota.totalInstallments)}<span className="fz11 body-color">/mês</span></span>}
                      />
                      <InfoRow
                        label="Seguro"
                        value={<span>{formatCurrency(quota.insurance)}<span className="fz11 body-color">/mês</span></span>}
                      />
                      <InfoRow label="Índice de correção" value={<strong>{quota.correctionIndex}</strong>} />
                      <InfoRow label="Taxa de correção"   value={`${quota.correctionRate}% a.a.`} />
                    </ul>
                  </div>

                  {/* Composição detalhada da parcela */}
                  {breakdown && (
                    <div className="col-12">
                      <hr style={{ borderColor: "#f0f0f0", marginBottom: 20 }} />
                      <SectionTitle>Composição da parcela mensal</SectionTitle>
                      <div className="row g-2">
                        {[
                          { label: "Fundo comum",              value: breakdown.fundoComum,   hint: `Crédito ÷ ${quota.totalInstallments} meses`,   color: "#0d6efd"  },
                          { label: `Taxa adm. (${quota.adminFee}%)`,    value: breakdown.taxaAdm,     hint: "Sobre o crédito",                              color: "#e0900a"  },
                          { label: `Fundo reserva (${quota.reserveFund}%)`, value: breakdown.fundoReserva, hint: "Sobre o crédito",                          color: "#9b59b6"  },
                          { label: "Seguro",                   value: breakdown.seguro,       hint: "Valor fixo mensal",                             color: "#6c757d"  },
                        ].map((item) => (
                          <div key={item.label} className="col-6 col-md-3">
                            <div className="bdrs8 p15 h-100" style={{ border: "1px solid #f0f0f0" }}>
                              <div className="d-flex align-items-center gap-1 mb-1">
                                <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: item.color, flexShrink: 0 }} />
                                <span className="fz11 body-color">{item.label}</span>
                              </div>
                              <p className="fz15 fw700 mb-1 dark-color">{formatCurrency(item.value)}</p>
                              <p className="fz11 body-color mb-0">{item.hint}</p>
                            </div>
                          </div>
                        ))}
                        <div className="col-12">
                          <div className="d-flex justify-content-between align-items-center bdrs8 p15" style={{ backgroundColor: "#f8f9fa" }}>
                            <span className="fz13 fw600 dark-color">Total da parcela</span>
                            <span className="fz16 fw700 dark-color">{formatCurrency(breakdown.total)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Correção monetária */}
                  <div className="col-12">
                    <hr style={{ borderColor: "#f0f0f0", marginBottom: 20 }} />
                    <SectionTitle>Correção monetária</SectionTitle>
                    <div className="row g-3">
                      <div className="col-md-4">
                        <div className="bdrs8 p15" style={{ backgroundColor: "#f8f9fa" }}>
                          <p className="fz12 body-color mb-1">Índice</p>
                          <p className="fz18 fw700 mb-0 dark-color">{quota.correctionIndex}</p>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="bdrs8 p15" style={{ backgroundColor: "#f8f9fa" }}>
                          <p className="fz12 body-color mb-1">Taxa anual</p>
                          <p className="fz18 fw700 mb-0 dark-color">{quota.correctionRate}%</p>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="bdrs8 p15" style={{ backgroundColor: "#f8f9fa" }}>
                          <p className="fz12 body-color mb-1">Crédito corrigido (mês atual)</p>
                          <p className="fz16 fw700 mb-0 dark-color">{formatCurrency(correctedCredit)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <hr style={{ borderColor: "#f0f0f0", marginBottom: 20 }} />
                  </div>

                  {/* Assembleia */}
                  <div className="col-12">
                    <SectionTitle>Assembleia</SectionTitle>
                    <div className="row g-3">
                      <div className="col-md-4">
                        <div className="bdrs8 p15" style={{ backgroundColor: "#f8f9fa" }}>
                          <p className="fz12 body-color mb-1">Assembleia atual</p>
                          <p className="fz20 fw700 mb-0 dark-color">Nº {group?.currentAssembly ?? "—"}</p>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="bdrs8 p15" style={{ backgroundColor: "#f8f9fa" }}>
                          <p className="fz12 body-color mb-1">Próxima assembleia</p>
                          <p className="fz15 fw600 mb-0 dark-color">
                            {nextAssembly
                              ? new Date(nextAssembly.date).toLocaleDateString("pt-BR")
                              : group?.nextAssemblyDate
                                ? new Date(group.nextAssemblyDate).toLocaleDateString("pt-BR")
                                : "—"}
                          </p>
                          {nextAssembly && (
                            <p className="fz12 body-color mb-0">Assembleia nº {nextAssembly.number}</p>
                          )}
                        </div>
                      </div>
                      <div className="col-md-4 d-flex align-items-center">
                        <Link
                          href={`/marketplace/assembleias?grupo=${group?.code ?? ""}`}
                          className="ud-btn btn-thm-border bdrs8 fz13 w-100 text-center"
                        >
                          <i className="fal fa-calendar-alt me-1" />
                          Ver assembleias
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Últimas assembleias */}
                  {group?.assemblies && group.assemblies.filter((a) => a.status === "realizada").length > 0 && (
                    <div className="col-12">
                      <p className="fz13 fw600 body-color mb10">Últimas assembleias realizadas</p>
                      <div className="table-responsive">
                        <table className="table table-sm mb-0">
                          <thead style={{ backgroundColor: "#f8f9fa" }}>
                            <tr>
                              <th className="fz12 fw600">Nº</th>
                              <th className="fz12 fw600">Data</th>
                              <th className="fz12 fw600">Tipo</th>
                              <th className="fz12 fw600">Contemplados</th>
                              <th className="fz12 fw600">Forma</th>
                              <th className="fz12 fw600">Cota vencedora</th>
                            </tr>
                          </thead>
                          <tbody>
                            {group.assemblies
                              .filter((a) => a.status === "realizada")
                              .sort((a, b) => b.date.localeCompare(a.date))
                              .slice(0, 5)
                              .map((a) => (
                                <tr key={a.id}>
                                  <td className="fz13">{a.number}</td>
                                  <td className="fz13">{new Date(a.date).toLocaleDateString("pt-BR")}</td>
                                  <td className="fz13 text-capitalize">{a.type.replace("_", " ")}</td>
                                  <td className="fz13">{a.contemplatedCount}</td>
                                  <td className="fz13 text-capitalize">{a.winnerType?.replace(/_/g, " ") ?? "—"}</td>
                                  <td className="fz13">{a.winnerQuota ?? "—"}</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ═══════════════════ PARCELAS ═══════════════════ */}
              {activeTab === "parcelas" && (
                <div>
                  {/* Resumo de inadimplência */}
                  {overdueSummary && (
                    <div
                      className="bdrs8 p15 mb20"
                      style={{ backgroundColor: "rgba(235,103,83,0.06)", border: "1px solid rgba(235,103,83,0.25)" }}
                    >
                      <div className="row g-3 text-center">
                        <div className="col-6 col-md-3">
                          <p className="fz11 body-color mb-1">Em atraso</p>
                          <p className="fz22 fw700 mb-0" style={{ color: "#c53030" }}>{overdueSummary.overdueCount}</p>
                        </div>
                        <div className="col-6 col-md-3">
                          <p className="fz11 body-color mb-1">Valor em atraso</p>
                          <p className="fz16 fw700 mb-0" style={{ color: "#c53030" }}>{formatCurrency(overdueSummary.totalOverdueValue)}</p>
                        </div>
                        <div className="col-6 col-md-3">
                          <p className="fz11 body-color mb-1">Juros ({overdueSummary.interestRatePercent}% a.m.)</p>
                          <p className="fz16 fw700 mb-0" style={{ color: "#c53030" }}>{formatCurrency(overdueSummary.totalInterest)}</p>
                        </div>
                        <div className="col-6 col-md-3">
                          <p className="fz11 body-color mb-1">Total a regularizar</p>
                          <p className="fz16 fw700 mb-0" style={{ color: "#c53030" }}>
                            {formatCurrency(overdueSummary.totalOverdueValue + overdueSummary.totalInterest)}
                          </p>
                        </div>
                      </div>
                      <div className="text-center mt15">
                        <button
                          type="button"
                          className="ud-btn bdrs8 fz13"
                          style={{ backgroundColor: "#c53030", color: "#fff", border: "none" }}
                        >
                          <i className="fal fa-barcode me-1" />Regularizar pagamento
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Composição resumida da parcela */}
                  {breakdown && (
                    <div className="bdrs8 p15 mb20" style={{ backgroundColor: "#f8f9fa", border: "1px solid #f0f0f0" }}>
                      <p className="fz12 fw600 body-color mb10 text-uppercase" style={{ letterSpacing: "0.05em" }}>
                        Composição da parcela — {formatCurrency(breakdown.total)}/mês
                      </p>
                      <div className="d-flex flex-wrap gap-3">
                        {[
                          { label: "Fundo comum",     value: breakdown.fundoComum,   color: "#0d6efd" },
                          { label: "Taxa adm.",        value: breakdown.taxaAdm,     color: "#e0900a" },
                          { label: "Fundo reserva",   value: breakdown.fundoReserva, color: "#9b59b6" },
                          { label: "Seguro",           value: breakdown.seguro,       color: "#6c757d" },
                        ].map((item) => (
                          <div key={item.label} className="d-flex align-items-center gap-1">
                            <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: item.color }} />
                            <span className="fz12 body-color">{item.label}:</span>
                            <span className="fz12 fw600">{formatCurrency(item.value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Filtro pendentes/todas */}
                  <div className="d-flex flex-wrap justify-content-between align-items-center mb15">
                    <p className="fz14 fw500 mb-0 dark-color">
                      {filterParcelas === "pendentes"
                        ? `${pendingInstallments.length} parcelas pendentes`
                        : `${installments.length} parcelas no total`}
                    </p>
                    <div className="d-flex" style={{ backgroundColor: "#f0f0f0", borderRadius: 8, padding: 3, gap: 2 }}>
                      {(["pendentes", "todas"] as const).map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setFilterParcelas(f)}
                          style={{
                            border: "none", padding: "5px 14px", borderRadius: 6, fontSize: 13, cursor: "pointer",
                            backgroundColor: filterParcelas === f ? "#fff" : "transparent",
                            color: filterParcelas === f ? "#0d6efd" : "#6c757d",
                            fontWeight: filterParcelas === f ? 600 : 400,
                            boxShadow: filterParcelas === f ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                            transition: "all .15s",
                          }}
                        >
                          {f === "pendentes" ? "Pendentes" : "Todas"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tabela de parcelas */}
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead style={{ backgroundColor: "#f8f9fa" }}>
                        <tr>
                          <th className="fz12 fw600">Nº</th>
                          <th className="fz12 fw600">Vencimento</th>
                          <th className="fz12 fw600">Valor</th>
                          <th className="fz12 fw600">Juros/Multa</th>
                          <th className="fz12 fw600">Total</th>
                          <th className="fz12 fw600">Status</th>
                          <th className="fz12 fw600 text-end">Ação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayInstallments.map((inst) => (
                          <tr
                            key={inst.number}
                            style={inst.status === "atrasada" ? { backgroundColor: "rgba(235,103,83,0.04)" } : undefined}
                          >
                            <td className="fz13 fw500">{inst.number}</td>
                            <td className="fz13">
                              <div>{new Date(inst.dueDate).toLocaleDateString("pt-BR")}</div>
                              {inst.daysLate != null && inst.daysLate > 0 && (
                                <div className="fz11 fw500" style={{ color: "#c53030" }}>
                                  {inst.daysLate} dias em atraso
                                </div>
                              )}
                            </td>
                            <td className="fz13 fw500">{formatCurrency(inst.value)}</td>
                            <td className="fz13">
                              {inst.interest != null && inst.interest > 0
                                ? <span style={{ color: "#c53030" }}>+ {formatCurrency(inst.interest)}</span>
                                : <span className="body-color">—</span>}
                            </td>
                            <td className="fz13 fw600">{formatCurrency(inst.value + (inst.interest ?? 0))}</td>
                            <td>
                              <span
                                className="fz11 fw500 text-white"
                                style={{ padding: "3px 9px", borderRadius: 20, backgroundColor: getInstallmentStatusColor(inst.status) }}
                              >
                                {getInstallmentStatusLabel(inst.status)}
                              </span>
                            </td>
                            <td className="text-end">
                              {inst.status !== "paga" && (
                                <button
                                  type="button"
                                  className="ud-btn btn-white bdrs4 fz12 px-2 py-1"
                                  style={{ border: "1px solid #0d6efd", color: "#0d6efd" }}
                                >
                                  <i className="fal fa-barcode me-1" />Boleto
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {displayInstallments.length === 0 && (
                    <div className="text-center py-4">
                      <i className="fal fa-check-circle fz30 mb-2 d-block" style={{ color: "#5bbb7b" }} />
                      <p className="fz14 body-color mb-0">Nenhuma parcela pendente.</p>
                    </div>
                  )}
                </div>
              )}

              {/* ═══════════════════ LANCE / SORTEIO ═══════════════════ */}
              {activeTab === "lance" && sim && (
                <div className="row g-4">

                  {/* Probabilidade por sorteio */}
                  <div className="col-md-6">
                    <div className="bdrs8 p20 h-100" style={{ border: "1px solid #e8e8e8" }}>
                      <div className="d-flex align-items-center gap-2 mb15">
                        <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "rgba(91,187,123,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <i className="fal fa-random fz15" style={{ color: "#5bbb7b" }} />
                        </div>
                        <h6 className="mb-0">Sorteio</h6>
                      </div>
                      <p className="fz36 fw700 mb-1 dark-color">{sim.lotterProbability}%</p>
                      <p className="fz13 body-color mb15">Probabilidade de contemplação por sorteio</p>
                      <ul className="list-unstyled fz13 mb-0">
                        <InfoRow label="Cotas ativas no grupo" value={group?.activeQuotas ?? "—"} />
                        <InfoRow label="Contemplações/assembleia" value="1" />
                        <InfoRow label="Fórmula" value="1 ÷ cotas ativas" />
                      </ul>
                    </div>
                  </div>

                  {/* Simulação de lance */}
                  <div className="col-md-6">
                    <div className="bdrs8 p20 h-100" style={{ border: "1px solid #e8e8e8" }}>
                      <div className="d-flex align-items-center gap-2 mb15">
                        <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "rgba(224,144,10,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <i className="fal fa-gavel fz15" style={{ color: "#e0900a" }} />
                        </div>
                        <h6 className="mb-0">Simulação de lance</h6>
                      </div>
                      <ul className="list-unstyled fz13 mb-0">
                        <InfoRow
                          label="Lance mínimo competitivo"
                          value={<span className="fw600">{sim.minBidPercent}% = {formatCurrency(sim.minBidValue)}</span>}
                        />
                        <InfoRow
                          label="Seu lance estimado"
                          value={
                            sim.currentBidPercent > 0
                              ? <span className="fw600" style={{ color: "#0d6efd" }}>{sim.currentBidPercent}%</span>
                              : <span className="body-color">—</span>
                          }
                        />
                        <InfoRow
                          label="Posição no ranking"
                          value={
                            sim.ranking
                              ? <span className="fw600">#{sim.ranking}</span>
                              : <span className="body-color">—</span>
                          }
                        />
                        <InfoRow label="Lances realizados" value={<span className="fw600">{quota.bidCount}</span>} />
                      </ul>
                    </div>
                  </div>

                  {/* Correção monetária projetada */}
                  <div className="col-12">
                    <div className="bdrs8 p20" style={{ border: "1px solid #e8e8e8" }}>
                      <div className="d-flex align-items-center gap-2 mb15">
                        <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "rgba(13,110,253,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <i className="fal fa-chart-line fz15" style={{ color: "#0d6efd" }} />
                        </div>
                        <h6 className="mb-0">Projeção do crédito com correção monetária</h6>
                      </div>
                      <p className="fz13 body-color mb15">
                        Crédito corrigido pelo índice <strong>{quota.correctionIndex}</strong> ({quota.correctionRate}% a.a.):
                      </p>
                      <div className="row g-3">
                        {[
                          { label: "Hoje (mês atual)",   months: paidCount + 1 },
                          { label: "Em 12 meses",         months: paidCount + 12 },
                          { label: "Em 24 meses",         months: paidCount + 24 },
                          { label: "No vencimento",       months: quota.totalInstallments },
                        ].map((p) => (
                          <div key={p.label} className="col-6 col-md-3">
                            <div className="bdrs8 p15 text-center" style={{ backgroundColor: "#f8f9fa" }}>
                              <p className="fz11 body-color mb-1">{p.label}</p>
                              <p className="fz15 fw700 mb-0 dark-color">
                                {formatCurrency(correctedCreditValue(quota, p.months))}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Simuladores em modais */}
                  <div className="col-12">
                    <p className="fz12 fw600 body-color mb10 text-uppercase" style={{ letterSpacing: "0.05em" }}>
                      Simuladores
                    </p>
                    <div className="d-flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="ud-btn btn-thm bdrs8 fz13"
                        onClick={() => setModalLance(true)}
                      >
                        <i className="fal fa-gavel me-1" />Simular lance
                      </button>
                      <button
                        type="button"
                        className="ud-btn btn-thm-border bdrs8 fz13"
                        onClick={() => setModalContemplacao(true)}
                      >
                        <i className="fal fa-trophy me-1" />Simular contemplação
                      </button>
                      <button
                        type="button"
                        className="ud-btn btn-white bdrs8 fz13"
                        style={{ border: "1px solid #e8e8e8" }}
                        onClick={() => setModalParcelas(true)}
                      >
                        <i className="fal fa-calendar-check me-1" />Simular parcelas
                      </button>
                      <button
                        type="button"
                        className="ud-btn btn-white bdrs8 fz13"
                        style={{ border: "1px solid #e8e8e8" }}
                        onClick={() => setModalInadimplencia(true)}
                      >
                        <i className="fal fa-exclamation-triangle me-1" />Simular inadimplência
                      </button>
                    </div>
                    <Link
                      href={`/simulador?credito=${quota.creditValue}&prazo=${quota.totalInstallments}&taxa=${quota.adminFee}&fr=${quota.reserveFund}`}
                      className="ud-btn btn-thm-border bdrs8 fz13 mt-2 d-inline-block"
                    >
                      <i className="fal fa-calculator me-1" />Abrir simulador completo (página)
                    </Link>
                  </div>
                </div>
              )}

              {/* ═══════════════════ DOCUMENTOS ═══════════════════ */}
              {activeTab === "documentos" && (
                <div>
                  {documents.length > 0 ? (
                    <div className="row g-3">
                      {documents.map((doc) => (
                        <div key={doc.id} className="col-md-6">
                          <div className="d-flex align-items-center gap-3 bdrs8 p15" style={{ border: "1px solid #e8e8e8" }}>
                            <div style={{
                              width: 40, height: 40, borderRadius: 8, flexShrink: 0,
                              backgroundColor: "rgba(13,110,253,0.1)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                              <i className="fal fa-file-pdf fz16" style={{ color: "#0d6efd" }} />
                            </div>
                            <div className="flex-grow-1 min-w-0">
                              <p className="fz13 fw500 dark-color mb-0 text-truncate">{doc.name}</p>
                              <p className="fz11 body-color mb-0">
                                {getDocumentTypeLabel(doc.type)} · {new Date(doc.uploadedAt).toLocaleDateString("pt-BR")}
                              </p>
                            </div>
                            <a href={doc.url} className="ud-btn btn-white bdrs4 fz12 px-2 py-1" style={{ border: "1px solid #e8e8e8", flexShrink: 0 }}>
                              <i className="fal fa-download me-1" />Baixar
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <i className="fal fa-folder-open fz40 body-color mb20 d-block" />
                      <p className="fz14 body-color mb-0">Nenhum documento disponível.</p>
                    </div>
                  )}
                </div>
              )}

              {/* ═══════════════════ CONTEMPLAÇÃO ═══════════════════ */}
              {activeTab === "contemplacao" && (
                <div className="row g-4">

                  {/* Status + stepper */}
                  <div className="col-12">
                    <div className="bdrs8 p20" style={{ backgroundColor: "#f8f9fa" }}>
                      <div className="d-flex align-items-center gap-3 mb10">
                        <div style={{
                          width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
                          backgroundColor: quota.status === "contemplada" ? "rgba(13,110,253,0.12)" : "rgba(91,187,123,0.12)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <i
                            className={`fal ${quota.status === "contemplada" ? "fa-trophy" : "fa-hourglass-half"} fz18`}
                            style={{ color: quota.status === "contemplada" ? "#0d6efd" : "#5bbb7b" }}
                          />
                        </div>
                        <div>
                          <p className="fz12 body-color mb-1">Situação da cota</p>
                          <span className={`quota-status-badge ${getStatusColor(quota.status)}`}>
                            {getStatusLabel(quota.status)}
                          </span>
                        </div>
                      </div>

                      {/* Stepper do crédito (apenas para contempladas) */}
                      {quota.status === "contemplada" && quota.creditStatus && (
                        <div>
                          <p className="fz12 fw600 body-color mb-2 text-uppercase" style={{ letterSpacing: "0.05em" }}>
                            Status do crédito
                          </p>
                          <CreditStatusStepper status={quota.creditStatus} />
                          {quota.creditReleasedValue && (
                            <p className="fz13 body-color mb-0 mt-1">
                              Valor liberado:{" "}
                              <strong>{formatCurrency(quota.creditReleasedValue)}</strong>
                              {quota.creditReleasedAt && (
                                <> em {new Date(quota.creditReleasedAt).toLocaleDateString("pt-BR")}</>
                              )}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Simulação */}
                  <div className="col-md-6">
                    <div className="bdrs8 p20 h-100" style={{ border: "1px solid #e8e8e8" }}>
                      <div className="d-flex align-items-center gap-2 mb15">
                        <i className="fal fa-calculator fz16" style={{ color: "#0d6efd" }} />
                        <h6 className="mb-0">Simulação de contemplação</h6>
                      </div>
                      <p className="fz13 body-color mb15">
                        Simule valores, taxas e parcelas futuras em caso de contemplação.
                      </p>
                      <ul className="list-unstyled fz13 mb15">
                        <InfoRow label="Crédito"        value={formatCurrency(quota.creditValue)} />
                        <InfoRow label="Crédito corrigido" value={formatCurrency(correctedCredit)} />
                        <InfoRow label="Taxa de adm."   value={`${quota.adminFee}%`} />
                        <InfoRow label="Fundo reserva"  value={`${quota.reserveFund}%`} />
                        <InfoRow label="Prazo restante" value={`${quota.remainingInstallments} meses`} />
                      </ul>
                      <button
                        type="button"
                        className="ud-btn btn-thm bdrs8 fz13 w-100 mb-2"
                        onClick={() => setModalContemplacao(true)}
                      >
                        <i className="fal fa-trophy me-1" />Simular contemplação
                      </button>
                      <Link
                        href={`/simulador?credito=${quota.creditValue}&prazo=${quota.totalInstallments}&taxa=${quota.adminFee}&fr=${quota.reserveFund}`}
                        className="ud-btn btn-thm-border bdrs8 fz13 w-100 text-center"
                      >
                        <i className="fal fa-external-link me-1" />Abrir simulador (página)
                      </Link>
                    </div>
                  </div>

                  {/* Solicitação de contemplação */}
                  <div className="col-md-6">
                    <div className="bdrs8 p20 h-100" style={{ border: "1px solid #e8e8e8" }}>
                      <div className="d-flex align-items-center gap-2 mb15">
                        <i className="fal fa-star fz16" style={{ color: "#e0900a" }} />
                        <h6 className="mb-0">Solicitar contemplação</h6>
                      </div>

                      {quota.status === "contemplada" ? (
                        <div className="text-center py-3">
                          <i className="fal fa-trophy fz30 mb-2 d-block" style={{ color: "#0d6efd" }} />
                          <p className="fz14 fw500 dark-color mb-1">Cota já contemplada!</p>
                          <p className="fz13 body-color mb-0">Esta cota foi contemplada com sucesso.</p>
                        </div>
                      ) : contemplationRequest ? (
                        <div>
                          <p className="fz13 body-color mb10">Você possui uma solicitação em andamento:</p>
                          <div className="bdrs8 p15 d-flex align-items-center gap-3" style={{ backgroundColor: "#f8f9fa" }}>
                            <span
                              className="fz12 fw500 text-white"
                              style={{
                                padding: "3px 10px", borderRadius: 12,
                                backgroundColor:
                                  contemplationRequest.status === "aprovada" ? "#5bbb7b"
                                  : contemplationRequest.status === "recusada" ? "#eb6753"
                                  : "#f0ad4e",
                              }}
                            >
                              {getContemplationRequestStatusLabel(contemplationRequest.status)}
                            </span>
                            <span className="fz13 body-color">
                              Solicitado em {new Date(contemplationRequest.requestedAt).toLocaleDateString("pt-BR")}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="fz13 body-color mb15">
                            Solicite a contemplação da sua cota. Nossa equipe irá analisar e retornar em breve.
                          </p>
                          <button type="button" className="ud-btn btn-thm bdrs8 fz13 w-100" onClick={() => {}}>
                            <i className="fal fa-paper-plane me-1" />Solicitar contemplação
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Voltar */}
      <div className="row mt25">
        <div className="col-12">
          <Link href="/cotista/minhas-cotas" className="ud-btn btn-white bdrs8 fz13">
            <i className="fal fa-arrow-left me-2" />Voltar para Minhas Cotas
          </Link>
        </div>
      </div>

      {/* Modais dos simuladores */}
      <SimuladorLanceModal
        open={modalLance}
        onClose={() => setModalLance(false)}
        quota={quota}
        activeQuotas={group?.activeQuotas ?? 100}
      />
      <SimuladorContemplacaoModal
        open={modalContemplacao}
        onClose={() => setModalContemplacao(false)}
        quota={quota}
      />
      <SimuladorParcelasModal
        open={modalParcelas}
        onClose={() => setModalParcelas(false)}
        quota={quota}
      />
      <SimuladorInadimplenciaModal
        open={modalInadimplencia}
        onClose={() => setModalInadimplencia(false)}
        quota={quota}
      />
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h6
      className="fz12 fw600 body-color text-uppercase mb15"
      style={{ letterSpacing: "0.06em" }}
    >
      {children}
    </h6>
  );
}
