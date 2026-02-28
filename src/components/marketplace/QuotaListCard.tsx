"use client";

import Link from "next/link";
import { Quota } from "@/data/mock-quotas";
import { formatCurrency, getStatusColor, getStatusLabel } from "@/lib/utils";

export interface QuotaListCardProps {
  data: Quota;
  isRepasse?: boolean;
  sellerName?: string;
  acceptsCounterOffer?: boolean;
  acceptsFinancing?: boolean;
}

const goodTypeIcon: Record<string, string> = {
  imovel: "flaticon-home",
  veiculo: "fas fa-car",
  servico: "flaticon-briefcase",
};

export default function QuotaListCard({
  data,
  isRepasse,
  sellerName,
  acceptsCounterOffer,
  acceptsFinancing,
}: QuotaListCardProps) {
  const paidPercentage = Math.round(
    (data.paidAmount / data.creditValue) * 100
  );

  return (
    <div className="freelancer-style1 bdr1 hover-box-shadow row ms-0 align-items-lg-center">
      <div className="col-lg-8 ps-0">
        <div className="d-lg-flex bdrr1 bdrn-xl pr15 pr0-lg">
          <div className="thumb w60 position-relative rounded-circle mb15-md">
            <div
              className={`rounded-circle mx-auto d-flex align-items-center justify-content-center ${
                isRepasse ? "bgc-thm" : "bgc-thm2"
              }`}
              style={{ width: 60, height: 60 }}
            >
              <i
                className={`${goodTypeIcon[data.goodType]} text-white fz20`}
              />
            </div>
            <span
              className={`online-badge2 ${
                data.status === "contemplada" ? "" : "bg-warning"
              }`}
            />
          </div>
          <div className="details ml15 ml0-md mb15-md">
            <div className="d-flex align-items-center gap-2 mb-1">
              <h5 className="title mb-0">
                Carta de Crédito {formatCurrency(data.creditValue)}
              </h5>
              {isRepasse && (
                <span
                  className="text-white fz11 fw600"
                  style={{
                    padding: "2px 10px",
                    borderRadius: 12,
                    backgroundColor: "#6f42c1",
                  }}
                >
                  Repasse
                </span>
              )}
            </div>
            <p className="mb-0 fz14 list-inline-item mb5-sm pe-1">
              <i className="flaticon-place fz16 vam text-thm2 me-1" />
              {data.administradora}
            </p>
            <p className="mb-0 fz14 list-inline-item mb5-sm pe-1">
              <i className="flaticon-30-days fz16 vam text-thm2 me-1 bdrl1 pl15 pl0-xs bdrn-xs" />
              {data.remainingInstallments}/{data.totalInstallments} parcelas
            </p>
            <p className="mb-0 fz14 list-inline-item mb5-sm">
              <i className="flaticon-contract fz16 vam text-thm2 me-1 bdrl1 pl15 pl0-xs bdrn-xs" />
              Grupo {data.groupCode} &bull; Cota #{data.quotaNumber}
            </p>
            <div
              className="d-flex align-items-center mt10 mb10"
              style={{ maxWidth: 300 }}
            >
              <div className="progress w-100" style={{ height: 6 }}>
                <div
                  className="progress-bar bgc-thm"
                  style={{ width: `${paidPercentage}%` }}
                />
              </div>
              <span className="fz12 ml10 body-color text-nowrap">
                {paidPercentage}% pago
              </span>
            </div>
            <div className="skill-tags d-flex align-items-center justify-content-start flex-wrap">
              <span
                className={`tag quota-status-badge ${getStatusColor(data.status)}`}
              >
                {getStatusLabel(data.status)}
              </span>
              <span className="tag mx10">{data.goodTypeLabel}</span>
              <span className="tag">Taxa Adm. {data.adminFee}%</span>
              {data.profitability && (
                <span className="tag mx10 text-thm">
                  <i className="fas fa-arrow-up mr5" />
                  {data.profitability}% rent.
                </span>
              )}
              {isRepasse && sellerName && (
                <span className="tag mx10 fz12">
                  <i className="flaticon-user fz12 me-1" />
                  {sellerName}
                </span>
              )}
              {isRepasse && acceptsCounterOffer && (
                <span className="tag fz12" style={{ color: "#0d6efd" }}>
                  Aceita propostas
                </span>
              )}
              {isRepasse && acceptsFinancing && (
                <span className="tag mx10 fz12" style={{ color: "#5bbb7b" }}>
                  Aceita parcelamento
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-4 ps-0 ps-xl-3 pe-0">
        <div className="details">
          <div className="text-lg-end">
            <h4>{formatCurrency(data.listingPrice || data.paidAmount)}</h4>
            <p className="text mb-0">
              Parcela: {formatCurrency(data.installmentValue)}/mês
            </p>
            {isRepasse && (
              <p className="fz12 mb-0" style={{ color: "#6f42c1" }}>
                <i className="fas fa-exchange-alt me-1" />
                Mercado Secundário
              </p>
            )}
          </div>
          <div className="d-grid mt15">
            <Link
              href={`/marketplace/${data.id}`}
              className={`ud-btn ${isRepasse ? "btn-thm" : "btn-light-thm"}`}
            >
              {isRepasse ? "Fazer Proposta" : "Ver Detalhes"}
              <i className="fal fa-arrow-right-long" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
