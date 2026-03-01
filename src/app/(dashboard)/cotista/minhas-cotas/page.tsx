"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  mockQuotas,
  installmentBreakdown,
  bidSimulation,
  creditStatusLabels,
  creditStatusColors,
  type CreditStatus,
} from "@/data/mock-quotas";
import { mockGroups } from "@/data/mock-groups";
import {
  mockMyPayments,
  mockContemplationRequests,
  mockQuotaDocuments,
  getPaymentStatusLabel,
  getPaymentStatusColor,
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

const myQuotas = mockQuotas.slice(0, 5);

// ─── helpers ──────────────────────────────────────────────────────────────────

function getPaymentsForQuota(quota: Quota) {
  return mockMyPayments.filter(
    (p) => p.groupCode === quota.groupCode && p.quotaNumber === quota.quotaNumber
  );
}

function getNextOpenPayment(quota: Quota) {
  return mockMyPayments.find(
    (p) =>
      p.groupCode === quota.groupCode &&
      p.quotaNumber === quota.quotaNumber &&
      (p.status === "pendente" || p.status === "agendado" || p.status === "atrasado")
  );
}

function getContemplationRequest(quotaId: string) {
  return mockContemplationRequests.find((r) => r.quotaId === quotaId);
}

function getDocumentsForQuota(quotaId: string) {
  return mockQuotaDocuments.filter((d) => d.quotaId === quotaId);
}

function saldoDevedor(quota: Quota) {
  return quota.creditValue - quota.paidAmount;
}

// ─── status de inadimplência ──────────────────────────────────────────────────

type DrawerTab = "resumo" | "parcelas" | "lance" | "documentos";

const drawerTabs: { id: DrawerTab; label: string }[] = [
  { id: "resumo", label: "Resumo" },
  { id: "parcelas", label: "Histórico" },
  { id: "lance", label: "Simulação" },
  { id: "documentos", label: "Documentos" },
];

// ─── sub-components ────────────────────────────────────────────────────────────

function CreditStatusBadge({ status }: { status: CreditStatus }) {
  return (
    <span
      className="fz11 fw500"
      style={{
        padding: "2px 8px",
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
    { id: "pending", label: "Pendente" },
    { id: "awaiting_docs", label: "Documentos" },
    { id: "under_review", label: "Análise" },
    { id: "approved", label: "Aprovado" },
    { id: "released", label: "Liberado" },
  ];
  const currentIdx = steps.findIndex((s) => s.id === status);
  return (
    <div className="d-flex align-items-center gap-0 my15">
      {steps.map((step, idx) => {
        const done = idx <= currentIdx;
        const active = idx === currentIdx;
        return (
          <div key={step.id} className="d-flex align-items-center" style={{ flex: idx < steps.length - 1 ? "1 1 0" : "none" }}>
            <div className="d-flex flex-column align-items-center">
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  backgroundColor: done ? "#5bbb7b" : "#e8e8e8",
                  border: active ? "2px solid #5bbb7b" : "2px solid transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: active ? "0 0 0 3px rgba(91,187,123,0.2)" : "none",
                }}
              >
                {done && (
                  <i className="fal fa-check" style={{ color: "#fff", fontSize: 11 }} />
                )}
              </div>
              <span className="fz10 body-color mt-1 text-center" style={{ whiteSpace: "nowrap" }}>
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: 2,
                  backgroundColor: idx < currentIdx ? "#5bbb7b" : "#e8e8e8",
                  marginBottom: 18,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── main component ────────────────────────────────────────────────────────────

export default function MinhasCotasPage() {
  const [selectedQuota, setSelectedQuota] = useState<Quota | null>(null);
  const [drawerTab, setDrawerTab] = useState<DrawerTab>("resumo");
  const [contemplationRequested, setContemplationRequested] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [modalLance, setModalLance] = useState(false);
  const [modalContemplacao, setModalContemplacao] = useState(false);
  const [modalParcelas, setModalParcelas] = useState(false);
  const [modalInadimplencia, setModalInadimplencia] = useState(false);
  const [simuladorQuota, setSimuladorQuota] = useState<Quota | null>(myQuotas[0] ?? null);

  const handleSolicitarContemplacao = (quotaId: string) => {
    setContemplationRequested((prev) => new Set(prev).add(quotaId));
  };

  const openDrawer = (quota: Quota, tab: DrawerTab = "resumo") => {
    setSelectedQuota(quota);
    setDrawerTab(tab);
  };

  // Estatísticas de resumo
  const stats = useMemo(() => {
    const ativas = myQuotas.filter((q) => q.status === "ativa").length;
    const contempladas = myQuotas.filter((q) => q.status === "contemplada").length;
    const inadimplentes = myQuotas.filter((q) => q.status === "inadimplente").length;
    const totalCredito = myQuotas.reduce((s, q) => s + q.creditValue, 0);
    const totalPago = myQuotas.reduce((s, q) => s + q.paidAmount, 0);
    const totalSaldo = myQuotas.reduce((s, q) => s + saldoDevedor(q), 0);
    return { ativas, contempladas, inadimplentes, totalCredito, totalPago, totalSaldo };
  }, []);

  // Filtragem
  const filteredQuotas = useMemo(() => {
    if (statusFilter === "todos") return myQuotas;
    return myQuotas.filter((q) => q.status === statusFilter);
  }, [statusFilter]);

  return (
    <div className="dashboard__content hover-bgc-color">
      {/* Título */}
      <div className="row pb10">
        <div className="col-lg-12">
          <div className="dashboard_title_area">
            <h2>Minhas Cotas</h2>
            <p className="text body-color">
              Gerencie suas cotas, acompanhe parcelas, lances e contemplações
            </p>
          </div>
        </div>
      </div>

      {/* KPIs resumo */}
      <div className="row g-3 mb25">
        <div className="col-6 col-lg-2">
          <div className="ps-widget bgc-white bdrs8 p20 bdr1 text-center">
            <p className="fz22 fw700 mb-1 dark-color">{myQuotas.length}</p>
            <p className="fz12 body-color mb-0">Total de cotas</p>
          </div>
        </div>
        <div className="col-6 col-lg-2">
          <div className="ps-widget bgc-white bdrs8 p20 bdr1 text-center">
            <p className="fz22 fw700 mb-1" style={{ color: "#5bbb7b" }}>{stats.ativas}</p>
            <p className="fz12 body-color mb-0">Ativas</p>
          </div>
        </div>
        <div className="col-6 col-lg-2">
          <div className="ps-widget bgc-white bdrs8 p20 bdr1 text-center">
            <p className="fz22 fw700 mb-1" style={{ color: "#0d6efd" }}>{stats.contempladas}</p>
            <p className="fz12 body-color mb-0">Contempladas</p>
          </div>
        </div>
        <div className="col-6 col-lg-2">
          <div
            className="bdrs8 p20 bdr1 text-center"
            style={{
              backgroundColor: stats.inadimplentes > 0 ? "rgba(235,103,83,0.07)" : "#fff",
              borderColor: stats.inadimplentes > 0 ? "rgba(235,103,83,0.3)" : undefined,
            }}
          >
            <p className="fz22 fw700 mb-1" style={{ color: stats.inadimplentes > 0 ? "#c53030" : "#6c757d" }}>
              {stats.inadimplentes}
            </p>
            <p className="fz12 body-color mb-0">Inadimplentes</p>
          </div>
        </div>
        <div className="col-6 col-lg-2">
          <div className="ps-widget bgc-white bdrs8 p20 bdr1 text-center">
            <p className="fz15 fw700 mb-1 dark-color">{formatCurrency(stats.totalPago)}</p>
            <p className="fz12 body-color mb-0">Total pago</p>
          </div>
        </div>
        <div className="col-6 col-lg-2">
          <div className="ps-widget bgc-white bdrs8 p20 bdr1 text-center">
            <p className="fz15 fw700 mb-1 dark-color">{formatCurrency(stats.totalSaldo)}</p>
            <p className="fz12 body-color mb-0">Saldo devedor</p>
          </div>
        </div>
      </div>

      {/* Alerta de inadimplência */}
      {stats.inadimplentes > 0 && (
        <div className="row mb20">
          <div className="col-12">
            <div
              className="bdrs8 p15 d-flex align-items-center gap-3"
              style={{
                backgroundColor: "rgba(235,103,83,0.07)",
                border: "1px solid rgba(235,103,83,0.3)",
              }}
            >
              <i className="fal fa-exclamation-triangle fz18" style={{ color: "#c53030" }} />
              <div>
                <p className="fz13 fw600 mb-0" style={{ color: "#c53030" }}>
                  Você possui {stats.inadimplentes} cota{stats.inadimplentes > 1 ? "s" : ""} em situação de inadimplência.
                </p>
                <p className="fz12 body-color mb-0">
                  Regularize seus pagamentos para evitar penalidades e perda da cota.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Simuladores em modais */}
      <div className="row mb25">
        <div className="col-12">
          <div className="ps-widget bgc-white bdrs8 p25 bdr1">
            <h5 className="mb15">Simuladores</h5>
            <p className="fz13 body-color mb15">
              Use os simuladores para lance, contemplação, parcelas e inadimplência. Escolha a cota abaixo para simular.
            </p>
            <div className="d-flex flex-wrap align-items-center gap-3 mb15">
              <label className="fz13 fw500 dark-color mb-0">Cota para simular:</label>
              <select
                value={simuladorQuota?.id ?? ""}
                onChange={(e) => setSimuladorQuota(myQuotas.find((q) => q.id === e.target.value) ?? null)}
                className="form-select"
                style={{ width: "auto", minWidth: 220 }}
              >
                {myQuotas.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.groupCode} — Cota #{q.quotaNumber} · {formatCurrency(q.creditValue)}
                  </option>
                ))}
              </select>
            </div>
            <div className="d-flex flex-wrap gap-2">
              <button
                type="button"
                className="ud-btn btn-thm bdrs8 fz13"
                disabled={!simuladorQuota}
                onClick={() => simuladorQuota && setModalLance(true)}
              >
                <i className="fal fa-gavel me-1" />Simular lance
              </button>
              <button
                type="button"
                className="ud-btn btn-thm-border bdrs8 fz13"
                disabled={!simuladorQuota}
                onClick={() => simuladorQuota && setModalContemplacao(true)}
              >
                <i className="fal fa-trophy me-1" />Simular contemplação
              </button>
              <button
                type="button"
                className="ud-btn btn-white bdrs8 fz13"
                style={{ border: "1px solid #e8e8e8" }}
                disabled={!simuladorQuota}
                onClick={() => simuladorQuota && setModalParcelas(true)}
              >
                <i className="fal fa-calendar-check me-1" />Simular parcelas
              </button>
              <button
                type="button"
                className="ud-btn btn-white bdrs8 fz13"
                style={{ border: "1px solid #e8e8e8" }}
                disabled={!simuladorQuota}
                onClick={() => simuladorQuota && setModalInadimplencia(true)}
              >
                <i className="fal fa-exclamation-triangle me-1" />Simular inadimplência
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="row">
        <div className="col-12">
          <div className="ps-widget bgc-white bdrs8 p25 mb30 overflow-hidden">

            {/* Filtro de status */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb20">
              <h5 className="mb-0">Cotas e participação</h5>
              <div className="d-flex flex-wrap gap-2">
                {["todos", "ativa", "contemplada", "inadimplente", "cancelada"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatusFilter(s)}
                    className="ud-btn bdrs8 fz12"
                    style={{
                      backgroundColor: statusFilter === s ? "#0d6efd" : "#f4f4f4",
                      color: statusFilter === s ? "#fff" : "#6c757d",
                      border: "none",
                      padding: "5px 12px",
                    }}
                  >
                    {s === "todos"
                      ? "Todas"
                      : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-hover">
                <thead style={{ backgroundColor: "#f8f9fa" }}>
                  <tr>
                    <th className="fz12 fw600">Grupo / Cota</th>
                    <th className="fz12 fw600">Tipo</th>
                    <th className="fz12 fw600">Situação</th>
                    <th className="fz12 fw600">Parcela</th>
                    <th className="fz12 fw600">Saldo devedor</th>
                    <th className="fz12 fw600">Parcelas</th>
                    <th className="fz12 fw600">Lances</th>
                    <th className="fz12 fw600">Crédito</th>
                    <th className="fz12 fw600">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuotas.map((quota) => {
                    const request = getContemplationRequest(quota.id);
                    const nextPayment = getNextOpenPayment(quota);
                    const isInadimplente = quota.status === "inadimplente";
                    const paidCount = quota.totalInstallments - quota.remainingInstallments;

                    return (
                      <tr
                        key={quota.id}
                        style={
                          isInadimplente
                            ? { backgroundColor: "rgba(235,103,83,0.035)" }
                            : undefined
                        }
                      >
                        <td>
                          <p className="fw600 fz13 mb-0">{quota.groupCode}</p>
                          <span className="fz12 body-color">Cota #{quota.quotaNumber}</span>
                          {isInadimplente && quota.defaultingSince && (
                            <div className="fz11 mt-1" style={{ color: "#c53030" }}>
                              <i className="fal fa-exclamation-triangle me-1" />
                              Desde {new Date(quota.defaultingSince).toLocaleDateString("pt-BR")}
                            </div>
                          )}
                        </td>
                        <td className="fz13">{quota.goodTypeLabel}</td>
                        <td>
                          <span className={`quota-status-badge ${getStatusColor(quota.status)}`}>
                            {getStatusLabel(quota.status)}
                          </span>
                        </td>
                        <td>
                          <p className="fz13 fw500 mb-0">{formatCurrency(quota.installmentValue)}</p>
                          <p className="fz11 body-color mb-0">
                            FC {formatCurrency(quota.creditValue / quota.totalInstallments)}
                          </p>
                        </td>
                        <td className="fz13">{formatCurrency(saldoDevedor(quota))}</td>
                        <td>
                          <div className="fz13 fw500">{paidCount}/{quota.totalInstallments}</div>
                          <div
                            style={{
                              height: 4,
                              width: 60,
                              backgroundColor: "#f0f0f0",
                              borderRadius: 3,
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                height: "100%",
                                width: `${Math.round((paidCount / quota.totalInstallments) * 100)}%`,
                                backgroundColor: "#5bbb7b",
                                borderRadius: 3,
                              }}
                            />
                          </div>
                        </td>
                        <td>
                          <span className="fz13 fw500">{quota.bidCount}</span>
                          {quota.bidCount > 0 && (
                            <span className="fz11 body-color ms-1">lance{quota.bidCount > 1 ? "s" : ""}</span>
                          )}
                        </td>
                        <td>
                          {quota.creditStatus ? (
                            <CreditStatusBadge status={quota.creditStatus} />
                          ) : (
                            <span className="fz12 body-color">—</span>
                          )}
                        </td>
                        <td>
                          <div className="d-flex flex-wrap gap-1">
                            <button
                              type="button"
                              className="ud-btn btn-thm-border bdrs4 fz12 px-2 py-1"
                              onClick={() => openDrawer(quota, "resumo")}
                            >
                              Detalhes
                            </button>
                            {quota.status !== "contemplada" &&
                              quota.status !== "cancelada" &&
                              !request &&
                              !contemplationRequested.has(quota.id) && (
                                <button
                                  type="button"
                                  className="ud-btn btn-thm bdrs4 fz12 px-2 py-1"
                                  onClick={() => handleSolicitarContemplacao(quota.id)}
                                >
                                  Contemplação
                                </button>
                              )}
                            {nextPayment && (
                              <button
                                type="button"
                                className="ud-btn bdrs4 fz12 px-2 py-1"
                                style={{ border: "1px solid #0d6efd", color: "#0d6efd" }}
                              >
                                Boleto
                              </button>
                            )}
                            <Link
                              href={`/cotista/anunciar?quota=${quota.id}`}
                              className="ud-btn btn-white bdrs4 fz12 px-2 py-1"
                            >
                              Vender
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredQuotas.length === 0 && (
                    <tr>
                      <td colSpan={9} className="text-center py-4 body-color fz14">
                        Nenhuma cota encontrada com este filtro.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ── Drawer lateral ───────────────────────────────────────────────── */}
      {selectedQuota && (
        <>
          <div
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{ backgroundColor: "rgba(0,0,0,0.3)", zIndex: 1040 }}
            onClick={() => setSelectedQuota(null)}
          />
          <div
            className="position-fixed top-0 end-0 h-100 overflow-auto bgc-white shadow-lg"
            style={{ width: "min(100%, 520px)", zIndex: 1050 }}
          >
            <div className="p25">

              {/* Drawer header */}
              <div className="d-flex justify-content-between align-items-start mb20">
                <div>
                  <h5 className="mb-1">
                    {selectedQuota.groupCode} — Cota #{selectedQuota.quotaNumber}
                  </h5>
                  <div className="d-flex align-items-center gap-2">
                    <span className={`quota-status-badge ${getStatusColor(selectedQuota.status)}`}>
                      {getStatusLabel(selectedQuota.status)}
                    </span>
                    <span className="fz13 body-color">{selectedQuota.goodTypeLabel}</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="ud-btn btn-white bdrs4"
                  onClick={() => setSelectedQuota(null)}
                >
                  <i className="fal fa-times" />
                </button>
              </div>

              {/* Drawer tabs */}
              <div
                className="d-flex mb20"
                style={{ borderBottom: "2px solid #f0f0f0" }}
              >
                {drawerTabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setDrawerTab(tab.id)}
                    style={{
                      border: "none",
                      background: "none",
                      padding: "8px 14px",
                      fontSize: 13,
                      fontWeight: drawerTab === tab.id ? 600 : 400,
                      color: drawerTab === tab.id ? "#0d6efd" : "#6c757d",
                      borderBottom: drawerTab === tab.id ? "2px solid #0d6efd" : "2px solid transparent",
                      marginBottom: -2,
                      cursor: "pointer",
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* ── Tab: Resumo ── */}
              {drawerTab === "resumo" && (
                <DrawerResumo
                  quota={selectedQuota}
                  contemplationRequested={contemplationRequested}
                  onSolicitarContemplacao={handleSolicitarContemplacao}
                />
              )}

              {/* ── Tab: Histórico de pagamentos ── */}
              {drawerTab === "parcelas" && (
                <DrawerHistorico quota={selectedQuota} />
              )}

              {/* ── Tab: Simulação de lance/sorteio ── */}
              {drawerTab === "lance" && (
                <DrawerLanceSimulacao quota={selectedQuota} />
              )}

              {/* ── Tab: Documentos ── */}
              {drawerTab === "documentos" && (
                <DrawerDocumentos quotaId={selectedQuota.id} />
              )}

            </div>
          </div>
        </>
      )}

      {/* Modais dos simuladores */}
      {simuladorQuota && (
        <>
          <SimuladorLanceModal
            open={modalLance}
            onClose={() => setModalLance(false)}
            quota={simuladorQuota}
            activeQuotas={mockGroups.find((g) => g.code === simuladorQuota.groupCode)?.activeQuotas ?? 100}
          />
          <SimuladorContemplacaoModal
            open={modalContemplacao}
            onClose={() => setModalContemplacao(false)}
            quota={simuladorQuota}
          />
          <SimuladorParcelasModal
            open={modalParcelas}
            onClose={() => setModalParcelas(false)}
            quota={simuladorQuota}
          />
          <SimuladorInadimplenciaModal
            open={modalInadimplencia}
            onClose={() => setModalInadimplencia(false)}
            quota={simuladorQuota}
          />
        </>
      )}
    </div>
  );
}

// ─── Drawer sub-panels ────────────────────────────────────────────────────────

function DrawerResumo({
  quota,
  contemplationRequested,
  onSolicitarContemplacao,
}: {
  quota: Quota;
  contemplationRequested: Set<string>;
  onSolicitarContemplacao: (id: string) => void;
}) {
  const breakdown = installmentBreakdown(quota);
  const paidCount = quota.totalInstallments - quota.remainingInstallments;
  const progress = Math.round((paidCount / quota.totalInstallments) * 100);
  const nextPayment = getNextOpenPayment(quota);

  return (
    <div>
      {/* Valores */}
      <div className="row g-2 mb20">
        <div className="col-6">
          <div className="bdrs8 p10" style={{ backgroundColor: "#f8f9fa" }}>
            <p className="fz11 body-color mb-1">Crédito</p>
            <p className="fz16 fw700 mb-0 dark-color">{formatCurrency(quota.creditValue)}</p>
          </div>
        </div>
        <div className="col-6">
          <div className="bdrs8 p10" style={{ backgroundColor: "#f8f9fa" }}>
            <p className="fz11 body-color mb-1">Saldo devedor</p>
            <p className="fz16 fw700 mb-0 dark-color">{formatCurrency(saldoDevedor(quota))}</p>
          </div>
        </div>
        <div className="col-6">
          <div className="bdrs8 p10" style={{ backgroundColor: "#f8f9fa" }}>
            <p className="fz11 body-color mb-1">Valor já pago</p>
            <p className="fz16 fw700 mb-0" style={{ color: "#5bbb7b" }}>{formatCurrency(quota.paidAmount)}</p>
          </div>
        </div>
        <div className="col-6">
          <div className="bdrs8 p10" style={{ backgroundColor: "#f8f9fa" }}>
            <p className="fz11 body-color mb-1">Parcela mensal</p>
            <p className="fz16 fw700 mb-0 dark-color">{formatCurrency(quota.installmentValue)}</p>
          </div>
        </div>
      </div>

      {/* Progresso */}
      <div className="mb20">
        <div className="d-flex justify-content-between mb-1">
          <span className="fz12 body-color">Progresso</span>
          <span className="fz12 fw600">{paidCount}/{quota.totalInstallments} parcelas ({progress}%)</span>
        </div>
        <div style={{ height: 6, backgroundColor: "#f0f0f0", borderRadius: 4, overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              backgroundColor: "#5bbb7b",
              borderRadius: 4,
            }}
          />
        </div>
      </div>

      {/* Detalhamento da parcela */}
      <div className="mb20">
        <p className="fz12 fw600 body-color text-uppercase mb10" style={{ letterSpacing: "0.05em" }}>
          Composição da parcela mensal
        </p>
        <div className="bdrs8 overflow-hidden" style={{ border: "1px solid #f0f0f0" }}>
          {[
            { label: "Fundo comum", value: breakdown.fundoComum, hint: "Crédito ÷ Prazo" },
            { label: `Taxa de administração (${quota.adminFee}%)`, value: breakdown.taxaAdm },
            { label: `Fundo de reserva (${quota.reserveFund}%)`, value: breakdown.fundoReserva },
            { label: "Seguro", value: breakdown.seguro },
          ].map((item, idx) => (
            <div
              key={idx}
              className="d-flex justify-content-between align-items-center px-3 py-2"
              style={{ borderBottom: "1px solid #f8f8f8", backgroundColor: idx % 2 === 0 ? "#fdfdfd" : "#fff" }}
            >
              <div>
                <span className="fz13 body-color">{item.label}</span>
                {item.hint && <span className="fz11 body-color ms-1">({item.hint})</span>}
              </div>
              <span className="fz13 fw500">{formatCurrency(item.value)}</span>
            </div>
          ))}
          <div className="d-flex justify-content-between align-items-center px-3 py-2" style={{ backgroundColor: "#f8f9fa" }}>
            <span className="fz13 fw600 dark-color">Total</span>
            <span className="fz14 fw700 dark-color">{formatCurrency(breakdown.total)}</span>
          </div>
        </div>
        <p className="fz11 body-color mt-1">
          Índice de correção: <strong>{quota.correctionIndex}</strong> ({quota.correctionRate}% a.a.)
        </p>
      </div>

      {/* Status do crédito para contempladas */}
      {quota.status === "contemplada" && quota.creditStatus && (
        <div className="mb20">
          <p className="fz12 fw600 body-color text-uppercase mb10" style={{ letterSpacing: "0.05em" }}>
            Status do crédito
          </p>
          <CreditStatusStepper status={quota.creditStatus} />
          {quota.creditReleasedValue && (
            <p className="fz13 body-color">
              Valor liberado: <strong>{formatCurrency(quota.creditReleasedValue)}</strong>
              {quota.creditReleasedAt && (
                <> em {new Date(quota.creditReleasedAt).toLocaleDateString("pt-BR")}</>
              )}
            </p>
          )}
        </div>
      )}

      {/* Inadimplência */}
      {quota.status === "inadimplente" && (
        <div
          className="bdrs8 p15 mb20"
          style={{ backgroundColor: "rgba(235,103,83,0.07)", border: "1px solid rgba(235,103,83,0.25)" }}
        >
          <p className="fz13 fw600 mb-1" style={{ color: "#c53030" }}>
            <i className="fal fa-exclamation-triangle me-1" />
            Cota inadimplente
          </p>
          {quota.defaultingSince && (
            <p className="fz12 body-color mb10">
              Situação de inadimplência desde:{" "}
              {new Date(quota.defaultingSince).toLocaleDateString("pt-BR")}
            </p>
          )}
          <button type="button" className="ud-btn bdrs8 fz12" style={{ backgroundColor: "#c53030", color: "#fff", border: "none" }}>
            Regularizar pagamento
          </button>
        </div>
      )}

      {/* Parcela em aberto */}
      {nextPayment && (
        <div
          className="bdrs8 p15 mb20"
          style={{ backgroundColor: "rgba(13,110,253,0.07)", border: "1px solid rgba(13,110,253,0.2)" }}
        >
          <p className="fz13 fw500 mb-2 dark-color">
            <i className="fal fa-calendar me-1" style={{ color: "#0d6efd" }} />
            Próxima parcela:{" "}
            <strong>{formatCurrency(nextPayment.value)}</strong>
            {" "}— venc. {new Date(nextPayment.date).toLocaleDateString("pt-BR")}
          </p>
          <button type="button" className="ud-btn btn-thm bdrs8 fz12">
            <i className="fal fa-barcode me-1" />
            Gerar boleto
          </button>
        </div>
      )}

      {/* Solicitação de contemplação */}
      {quota.status !== "contemplada" && quota.status !== "cancelada" && (
        <div className="mb20">
          <p className="fz12 fw600 body-color text-uppercase mb10" style={{ letterSpacing: "0.05em" }}>
            Contemplação
          </p>
          {getContemplationRequest(quota.id) ? (
            <div className="d-flex align-items-center gap-2">
              <span className="fz13 body-color">Solicitação:</span>
              <span
                className="fz12 fw500 text-white"
                style={{
                  padding: "2px 8px",
                  borderRadius: 12,
                  backgroundColor:
                    getContemplationRequest(quota.id)!.status === "aprovada"
                      ? "#5bbb7b"
                      : getContemplationRequest(quota.id)!.status === "recusada"
                        ? "#eb6753"
                        : "#f0ad4e",
                }}
              >
                {getContemplationRequestStatusLabel(getContemplationRequest(quota.id)!.status)}
              </span>
            </div>
          ) : contemplationRequested.has(quota.id) ? (
            <p className="fz13 body-color mb-0">
              <i className="fal fa-clock me-1" style={{ color: "#f0ad4e" }} />
              Solicitação registrada. Acompanhe no painel.
            </p>
          ) : (
            <button
              type="button"
              className="ud-btn btn-thm bdrs8 fz13"
              onClick={() => onSolicitarContemplacao(quota.id)}
            >
              Solicitar contemplação
            </button>
          )}
        </div>
      )}

      <Link
        href={`/cotista/minhas-cotas/${quota.id}`}
        className="ud-btn btn-thm-border bdrs8 fz13 w-100 text-center"
      >
        Ver página completa <i className="fal fa-arrow-right ms-1" />
      </Link>
    </div>
  );
}

function DrawerHistorico({ quota }: { quota: Quota }) {
  const payments = getPaymentsForQuota(quota)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div>
      <p className="fz13 body-color mb15">
        Últimos pagamentos da cota #{quota.quotaNumber} no grupo {quota.groupCode}.
      </p>
      {payments.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-sm">
            <thead style={{ backgroundColor: "#f8f9fa" }}>
              <tr>
                <th className="fz12 fw600">Data</th>
                <th className="fz12 fw600">Descrição</th>
                <th className="fz12 fw600">Valor</th>
                <th className="fz12 fw600">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id}>
                  <td className="fz13">{new Date(p.date).toLocaleDateString("pt-BR")}</td>
                  <td className="fz13">{p.description}</td>
                  <td className="fz13 fw500">{formatCurrency(p.value)}</td>
                  <td>
                    <span
                      className="fz11 text-white"
                      style={{
                        padding: "2px 6px",
                        borderRadius: 6,
                        backgroundColor: getPaymentStatusColor(p.status),
                      }}
                    >
                      {getPaymentStatusLabel(p.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="fz13 body-color text-center py-3">Nenhum pagamento registrado.</p>
      )}
      <Link
        href="/cotista/financeiro"
        className="ud-btn btn-thm-border bdrs8 fz13 mt10 d-inline-block"
      >
        Ver extrato completo
      </Link>
    </div>
  );
}

function DrawerLanceSimulacao({ quota }: { quota: Quota }) {
  const group = mockGroups.find((g) => g.code === quota.groupCode);
  const sim = bidSimulation(quota, group?.activeQuotas ?? 100);

  return (
    <div>
      <p className="fz12 fw600 body-color text-uppercase mb15" style={{ letterSpacing: "0.05em" }}>
        Simulação de lance e sorteio
      </p>

      {/* Probabilidade por sorteio */}
      <div
        className="bdrs8 p15 mb15"
        style={{ backgroundColor: "#f8f9fa", border: "1px solid #f0f0f0" }}
      >
        <div className="d-flex justify-content-between align-items-center mb-1">
          <p className="fz13 body-color mb-0">Probabilidade por sorteio</p>
          <p className="fz18 fw700 mb-0 dark-color">{sim.lotterProbability}%</p>
        </div>
        <p className="fz11 body-color mb-0">
          {group?.activeQuotas ?? "—"} cotas ativas no grupo · 1 contemplação por assembleia
        </p>
      </div>

      {/* Lance */}
      <div
        className="bdrs8 p15 mb15"
        style={{ backgroundColor: "#f8f9fa", border: "1px solid #f0f0f0" }}
      >
        <p className="fz12 fw600 body-color mb10">Simulação de lance</p>
        <ul className="list-unstyled fz13 mb-0">
          <li className="d-flex justify-content-between mb-2">
            <span className="body-color">Lance mínimo competitivo</span>
            <span className="fw600">{sim.minBidPercent}% = {formatCurrency(sim.minBidValue)}</span>
          </li>
          {sim.currentBidPercent > 0 && (
            <li className="d-flex justify-content-between mb-2">
              <span className="body-color">Seu lance atual (estimado)</span>
              <span className="fw600 text-thm">{sim.currentBidPercent}%</span>
            </li>
          )}
          {sim.ranking && (
            <li className="d-flex justify-content-between mb-2">
              <span className="body-color">Posição estimada no ranking</span>
              <span className="fw600">#{sim.ranking}</span>
            </li>
          )}
          <li className="d-flex justify-content-between">
            <span className="body-color">Lances realizados até hoje</span>
            <span className="fw600">{quota.bidCount}</span>
          </li>
        </ul>
      </div>

      {/* Correção monetária */}
      <div
        className="bdrs8 p15 mb15"
        style={{ backgroundColor: "#f8f9fa", border: "1px solid #f0f0f0" }}
      >
        <p className="fz12 fw600 body-color mb10">Correção monetária</p>
        <ul className="list-unstyled fz13 mb-0">
          <li className="d-flex justify-content-between mb-2">
            <span className="body-color">Índice</span>
            <span className="fw600">{quota.correctionIndex}</span>
          </li>
          <li className="d-flex justify-content-between">
            <span className="body-color">Taxa anual</span>
            <span className="fw600">{quota.correctionRate}%</span>
          </li>
        </ul>
      </div>

      <Link
        href={`/simulador?credito=${quota.creditValue}&prazo=${quota.totalInstallments}&taxa=${quota.adminFee}&fr=${quota.reserveFund}`}
        className="ud-btn btn-thm bdrs8 fz13 w-100 text-center"
      >
        <i className="fal fa-calculator me-1" />
        Abrir simulador completo
      </Link>
    </div>
  );
}

function DrawerDocumentos({ quotaId }: { quotaId: string }) {
  const docs = getDocumentsForQuota(quotaId);
  return (
    <div>
      {docs.length > 0 ? (
        <ul className="list-unstyled mb-0">
          {docs.map((doc) => (
            <li
              key={doc.id}
              className="d-flex align-items-center justify-content-between bdrs8 p10 mb10"
              style={{ border: "1px solid #f0f0f0" }}
            >
              <div className="d-flex align-items-center gap-2">
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 6,
                    backgroundColor: "rgba(13,110,253,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <i className="fal fa-file-pdf fz13" style={{ color: "#0d6efd" }} />
                </div>
                <div>
                  <p className="fz13 fw500 dark-color mb-0">{doc.name}</p>
                  <p className="fz11 body-color mb-0">
                    {getDocumentTypeLabel(doc.type)} · {new Date(doc.uploadedAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
              <a
                href={doc.url}
                className="ud-btn btn-white bdrs4 fz12 px-2 py-1"
                style={{ border: "1px solid #e8e8e8", flexShrink: 0 }}
              >
                <i className="fal fa-download me-1" />
                Baixar
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-4">
          <i className="fal fa-folder-open fz30 body-color d-block mb-2" />
          <p className="fz13 body-color mb-0">Nenhum documento disponível.</p>
        </div>
      )}
    </div>
  );
}
