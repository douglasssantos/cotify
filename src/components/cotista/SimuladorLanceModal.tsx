"use client";

import { useState, useMemo } from "react";
import BaseModal from "./BaseModal";
import { formatCurrency } from "@/lib/utils";
import { bidSimulation, type Quota } from "@/data/mock-quotas";

export interface SimuladorLanceModalProps {
  open: boolean;
  onClose: () => void;
  quota: Quota;
  activeQuotas: number;
}

export default function SimuladorLanceModal({
  open,
  onClose,
  quota,
  activeQuotas,
}: SimuladorLanceModalProps) {
  const [bidPercent, setBidPercent] = useState(20);
  const baseSim = useMemo(() => bidSimulation(quota, activeQuotas), [quota, activeQuotas]);

  const bidValue = useMemo(
    () => (quota.creditValue * bidPercent) / 100,
    [quota.creditValue, bidPercent]
  );

  /** Ranking estimado: quanto maior o lance %, melhor a posição (mock: 1 a activeQuotas) */
  const estimatedRanking = useMemo(() => {
    if (activeQuotas <= 0) return null;
    const tier = Math.min(100, Math.max(0, bidPercent));
    const rank = Math.max(1, Math.ceil(activeQuotas * (1 - tier / 100)));
    return rank;
  }, [activeQuotas, bidPercent]);

  /** Probabilidade de vencer por lance (simplificado: inverso do ranking) */
  const bidWinChance = useMemo(() => {
    if (!estimatedRanking || activeQuotas <= 0) return 0;
    return Number((100 / activeQuotas).toFixed(1));
  }, [estimatedRanking, activeQuotas]);

  const isAboveMin = bidPercent >= baseSim.minBidPercent;

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Simulador de Lance"
      icon="fa-gavel"
      maxWidth="520px"
    >
      <p className="fz13 body-color mb20">
        Simule um lance e veja a estimativa de posição no ranking e o valor em reais.
      </p>

      {/* Cota em contexto */}
      <div className="bdrs8 p15 mb20" style={{ backgroundColor: "#f8f9fa" }}>
        <p className="fz12 body-color mb-1">{quota.groupCode} — Cota #{quota.quotaNumber}</p>
        <p className="fz14 fw600 mb-0 dark-color">
          Crédito: {formatCurrency(quota.creditValue)} · {activeQuotas} cotas ativas no grupo
        </p>
      </div>

      {/* Input: percentual do lance */}
      <div className="mb20">
        <label className="fw500 ff-heading dark-color mb-2 d-block">
          Valor do lance (% sobre o crédito)
        </label>
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <input
            type="range"
            min="0"
            max="50"
            step="0.5"
            value={bidPercent}
            onChange={(e) => setBidPercent(Number(e.target.value))}
            className="form-range flex-grow-1"
            style={{ maxWidth: 280 }}
          />
          <input
            type="number"
            min="0"
            max="100"
            step="0.5"
            value={bidPercent}
            onChange={(e) => setBidPercent(Math.min(100, Math.max(0, Number(e.target.value) || 0)))}
            className="form-control"
            style={{ width: 90 }}
          />
          <span className="fz14 fw500">%</span>
        </div>
        <p className="fz12 body-color mt-2 mb-0">
          Equivalente a <strong>{formatCurrency(bidValue)}</strong>
        </p>
      </div>

      {/* Resultados */}
      <div className="row g-3 mb20">
        <div className="col-6">
          <div className="bdrs8 p15 h-100" style={{ border: "1px solid #e8e8e8" }}>
            <p className="fz11 body-color mb-1">Lance mínimo sugerido</p>
            <p className="fz16 fw700 mb-0 dark-color">
              {baseSim.minBidPercent}% = {formatCurrency(baseSim.minBidValue)}
            </p>
            {!isAboveMin && (
              <p className="fz11 mb-0 mt-1" style={{ color: "#c53030" }}>
                Seu lance está abaixo do mínimo competitivo
              </p>
            )}
          </div>
        </div>
        <div className="col-6">
          <div className="bdrs8 p15 h-100" style={{ border: "1px solid #e8e8e8" }}>
            <p className="fz11 body-color mb-1">Posição estimada no ranking</p>
            <p className="fz16 fw700 mb-0 dark-color">
              {estimatedRanking != null ? `#${estimatedRanking}` : "—"}
            </p>
          </div>
        </div>
        <div className="col-6">
          <div className="bdrs8 p15 h-100" style={{ border: "1px solid #e8e8e8" }}>
            <p className="fz11 body-color mb-1">Probabilidade por sorteio</p>
            <p className="fz16 fw700 mb-0" style={{ color: "#0d6efd" }}>
              {baseSim.lotterProbability}%
            </p>
            <p className="fz11 body-color mb-0">1 ÷ {activeQuotas} cotas</p>
          </div>
        </div>
        <div className="col-6">
          <div className="bdrs8 p15 h-100" style={{ border: "1px solid #e8e8e8" }}>
            <p className="fz11 body-color mb-1">Lances já realizados (esta cota)</p>
            <p className="fz16 fw700 mb-0 dark-color">{quota.bidCount}</p>
          </div>
        </div>
      </div>

      {/* Aviso */}
      <div className="bdrs8 p15" style={{ backgroundColor: "rgba(13,110,253,0.06)", border: "1px solid rgba(13,110,253,0.2)" }}>
        <p className="fz12 body-color mb-0">
          <i className="fal fa-info-circle me-1" style={{ color: "#0d6efd" }} />
          O resultado do lance depende da concorrência na assembleia. Este simulador usa estimativas com base no percentual sobre o crédito.
        </p>
      </div>
    </BaseModal>
  );
}
