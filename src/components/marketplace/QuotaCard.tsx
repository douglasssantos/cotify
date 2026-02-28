"use client";

import Link from "next/link";
import { useState } from "react";
import { Quota } from "@/data/mock-quotas";
import { formatCurrency, getStatusColor, getStatusLabel } from "@/lib/utils";

interface QuotaCardProps {
  data: Quota;
}

export default function QuotaCard({ data }: QuotaCardProps) {
  const [isFavActive, setFavActive] = useState(false);
  const paidPercentage = Math.round(
    (data.paidAmount / data.creditValue) * 100
  );

  const goodTypeIcon: Record<string, string> = {
    imovel: "flaticon-home",
    veiculo: "fas fa-car",
    servico: "flaticon-briefcase",
  };

  return (
    <div className="listing-style1 marketplace-card-quota">
      <div className="list-thumb">
        <div
          className="w-100 d-flex align-items-center justify-content-center bgc-thm2"
          style={{ height: 180 }}
        >
          <i
            className={`${goodTypeIcon[data.goodType]} text-white`}
            style={{ fontSize: 48, opacity: 0.6 }}
          />
        </div>
        <a
          onClick={() => setFavActive(!isFavActive)}
          className={`listing-fav fz12 ${isFavActive ? "ui-fav-active" : ""}`}
        >
          <span className="far fa-heart" />
        </a>
      </div>
      <div className="list-content">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <p className="list-text body-color fz14 mb-0">
            {data.goodTypeLabel}
          </p>
          <span className={`quota-status-badge ${getStatusColor(data.status)}`}>
            {getStatusLabel(data.status)}
          </span>
        </div>
        <h5 className="list-title">
          <Link href={`/marketplace/${data.id}`}>
            Carta de Crédito {formatCurrency(data.creditValue)}
          </Link>
        </h5>
        <p className="fz13 body-color mb-1">
          {data.administradora} &bull; Grupo {data.groupCode} &bull; Cota #
          {data.quotaNumber}
        </p>
        <div className="d-flex align-items-center mt-2 mb-2">
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
        <hr className="my-2" />
        <div className="list-meta d-flex justify-content-between align-items-center mt10">
          <div>
            <p className="mb-0 fz12 body-color">Parcela</p>
            <p className="mb-0 fz15 fw500 dark-color">
              {formatCurrency(data.installmentValue)}
            </p>
          </div>
          <div className="text-center">
            <p className="mb-0 fz12 body-color">Restantes</p>
            <p className="mb-0 fz15 fw500 dark-color">
              {data.remainingInstallments}/{data.totalInstallments}
            </p>
          </div>
          <div className="text-end">
            <p className="mb-0 fz12 body-color">Preço</p>
            <p className="mb-0 fz17 fw500 dark-color">
              {formatCurrency(data.listingPrice || data.paidAmount)}
            </p>
          </div>
        </div>
        {data.profitability && (
          <div className="text-center mt10">
            <span className="fz12 text-thm">
              <i className="fas fa-arrow-up mr5" />
              Rentabilidade projetada: {data.profitability}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
