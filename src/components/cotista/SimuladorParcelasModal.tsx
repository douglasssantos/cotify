"use client";

import { useState, useMemo } from "react";
import BaseModal from "./BaseModal";
import { formatCurrency } from "@/lib/utils";
import { installmentBreakdown, correctedCreditValue, type Quota } from "@/data/mock-quotas";

export interface SimuladorParcelasModalProps {
  open: boolean;
  onClose: () => void;
  quota: Quota;
}

export default function SimuladorParcelasModal({
  open,
  onClose,
  quota,
}: SimuladorParcelasModalProps) {
  const [mesesProjecao, setMesesProjecao] = useState(12);
  const paidCount = quota.totalInstallments - quota.remainingInstallments;

  const breakdown = useMemo(() => installmentBreakdown(quota), [quota]);

  /** Projeção: para cada mês futuro, crédito corrigido e parcela (parcela pode ser fixa no modelo atual) */
  const projecao = useMemo(() => {
    const list: { mes: number; creditoCorrigido: number; parcela: number }[] = [];
    for (let m = paidCount + 1; m <= Math.min(paidCount + mesesProjecao, quota.totalInstallments); m++) {
      const creditoCorrigido = correctedCreditValue(quota, m);
      const fc = creditoCorrigido / quota.totalInstallments;
      const adm = (creditoCorrigido * (quota.adminFee / 100)) / quota.totalInstallments;
      const fr = (creditoCorrigido * (quota.reserveFund / 100)) / quota.totalInstallments;
      const parcela = fc + adm + fr + quota.insurance;
      list.push({ mes: m, creditoCorrigido, parcela });
    }
    return list;
  }, [quota, paidCount, mesesProjecao]);

  const totalProjecao = useMemo(
    () => projecao.reduce((s, p) => s + p.parcela, 0),
    [projecao]
  );

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Simulador de Parcelas e Correção"
      icon="fa-calendar-check"
      maxWidth="600px"
    >
      <p className="fz13 body-color mb20">
        Veja a composição da sua parcela e a projeção do crédito corrigido pelos próximos meses.
      </p>

      <div className="bdrs8 p15 mb20" style={{ backgroundColor: "#f8f9fa" }}>
        <p className="fz12 body-color mb-1">{quota.groupCode} — Cota #{quota.quotaNumber}</p>
        <p className="fz14 fw600 mb-0">
          Parcela atual: <strong>{formatCurrency(breakdown.total)}</strong>/mês · Índice: {quota.correctionIndex} ({quota.correctionRate}% a.a.)
        </p>
      </div>

      {/* Composição atual */}
      <div className="mb25">
        <p className="fz12 fw600 body-color text-uppercase mb10" style={{ letterSpacing: "0.05em" }}>
          Composição da parcela mensal
        </p>
        <div className="row g-2">
          {[
            { label: "Fundo comum", value: breakdown.fundoComum },
            { label: `Taxa adm. (${quota.adminFee}%)`, value: breakdown.taxaAdm },
            { label: `Fundo reserva (${quota.reserveFund}%)`, value: breakdown.fundoReserva },
            { label: "Seguro", value: breakdown.seguro },
          ].map((item) => (
            <div key={item.label} className="col-6">
              <div className="d-flex justify-content-between bdrs8 px-3 py-2" style={{ backgroundColor: "#f8f9fa" }}>
                <span className="fz12 body-color">{item.label}</span>
                <span className="fz12 fw600">{formatCurrency(item.value)}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="d-flex justify-content-between bdrs8 px-3 py-2 mt-2" style={{ backgroundColor: "#e8e8e8" }}>
          <span className="fz13 fw600">Total</span>
          <span className="fz13 fw700">{formatCurrency(breakdown.total)}</span>
        </div>
      </div>

      {/* Projeção */}
      <div className="mb20">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb10">
          <p className="fz12 fw600 body-color text-uppercase mb-0" style={{ letterSpacing: "0.05em" }}>
            Projeção (crédito corrigido + parcela)
          </p>
          <div className="d-flex align-items-center gap-2">
            <label className="fw500 ff-heading dark-color mb-0">Próximos</label>
            <select
              value={mesesProjecao}
              onChange={(e) => setMesesProjecao(Number(e.target.value))}
              className="form-select form-select-sm"
              style={{ width: 80 }}
            >
              {[6, 12, 24, 36, 60, quota.remainingInstallments].filter((n) => n <= quota.remainingInstallments).map((n) => (
                <option key={n} value={n}>{n} meses</option>
              ))}
            </select>
          </div>
        </div>
        <div className="table-responsive" style={{ maxHeight: 280, overflowY: "auto" }}>
          <table className="table table-sm mb-0">
            <thead style={{ position: "sticky", top: 0, backgroundColor: "#f8f9fa", zIndex: 1 }}>
              <tr>
                <th className="fz11 fw600">Mês</th>
                <th className="fz11 fw600 text-end">Crédito corrigido</th>
                <th className="fz11 fw600 text-end">Parcela</th>
              </tr>
            </thead>
            <tbody>
              {projecao.map((p) => (
                <tr key={p.mes}>
                  <td className="fz12">{p.mes}</td>
                  <td className="fz12 text-end">{formatCurrency(p.creditoCorrigido)}</td>
                  <td className="fz12 fw500 text-end">{formatCurrency(p.parcela)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-between bdrs8 px-3 py-2 mt-2" style={{ backgroundColor: "rgba(13,110,253,0.08)" }}>
          <span className="fz13 fw600">Total projetado ({projecao.length} parcelas)</span>
          <span className="fz13 fw700">{formatCurrency(totalProjecao)}</span>
        </div>
      </div>
    </BaseModal>
  );
}
