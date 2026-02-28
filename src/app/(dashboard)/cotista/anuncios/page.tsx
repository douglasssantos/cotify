"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import {
  mockListings,
  getListingStatusLabel,
  getListingStatusClass,
  type ListingStatus,
} from "@/data/mock-secondary-market";

const statusTabs: { label: string; value: ListingStatus | "todos" }[] = [
  { label: "Todos", value: "todos" },
  { label: "Ativos", value: "ativo" },
  { label: "Pausados", value: "pausado" },
  { label: "Vendidos", value: "vendido" },
];

export default function MeusAnunciosPage() {
  const [activeTab, setActiveTab] = useState<ListingStatus | "todos">("todos");

  const filtered =
    activeTab === "todos"
      ? mockListings
      : mockListings.filter((l) => l.status === activeTab);

  return (
    <div className="dashboard__content hover-bgc-color">
      <div className="row pb40">
        <div className="col-lg-12">
          <div className="dashboard_title_area d-flex justify-content-between align-items-center flex-wrap">
            <div>
              <h2>Meus Anúncios</h2>
              <p className="text">Gerencie suas cotas à venda no marketplace</p>
            </div>
            <Link href="/cotista/anunciar" className="ud-btn btn-thm bdrs12">
              <i className="fas fa-plus me-2" /> Novo Anúncio
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="row mb30">
        {[
          { label: "Ativos", value: mockListings.filter((l) => l.status === "ativo").length, color: "#5bbb7b", icon: "flaticon-flash" },
          { label: "Visualizações", value: mockListings.reduce((sum, l) => sum + l.views, 0), color: "#0d6efd", icon: "flaticon-view" },
          { label: "Propostas", value: mockListings.reduce((sum, l) => sum + l.proposals, 0), color: "#f0ad4e", icon: "flaticon-chat" },
          { label: "Vendidos", value: mockListings.filter((l) => l.status === "vendido").length, color: "#6f42c1", icon: "flaticon-badge" },
        ].map((stat) => (
          <div key={stat.label} className="col-sm-6 col-xxl-3">
            <div className="d-flex align-items-center justify-content-between ps-widget bgc-white bdrs4 p20 mb20">
              <div>
                <div className="fz15 fw600 dark-color">{stat.value}</div>
                <span className="fz13 body-color">{stat.label}</span>
              </div>
              <div
                className="d-flex align-items-center justify-content-center rounded-circle"
                style={{ width: 48, height: 48, backgroundColor: `${stat.color}15` }}
              >
                <i className={`${stat.icon} fz20`} style={{ color: stat.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="row mb20">
        <div className="col-12">
          <div className="ps-widget bgc-white bdrs4 p15">
            <div className="d-flex gap-2 flex-wrap">
              {statusTabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`ud-btn bdrs12 fz14 ${
                    activeTab === tab.value ? "btn-thm" : "btn-thm-border"
                  }`}
                  style={{ padding: "8px 20px" }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Listings */}
      <div className="row">
        {filtered.length === 0 ? (
          <div className="col-12">
            <div className="ps-widget bgc-white bdrs4 p30 text-center">
              <i className="flaticon-document fz40 body-light-color" />
              <h5 className="mt15">Nenhum anúncio encontrado</h5>
              <p className="body-color fz14">
                {activeTab === "todos"
                  ? "Você ainda não criou nenhum anúncio."
                  : `Nenhum anúncio com status "${getListingStatusLabel(activeTab as ListingStatus)}".`}
              </p>
              <Link href="/cotista/anunciar" className="ud-btn btn-thm bdrs12">
                Criar Anúncio <i className="fal fa-arrow-right-long" />
              </Link>
            </div>
          </div>
        ) : (
          filtered.map((listing) => {
            const paidPct = Math.round((listing.paidAmount / listing.creditValue) * 100);
            return (
              <div key={listing.id} className="col-12">
                <div className="freelancer-style1 bdr1 hover-box-shadow row ms-0 align-items-lg-center mb10">
                  <div className="col-lg-7 ps-0">
                    <div className="d-lg-flex bdrr1 bdrn-xl pr15 pr0-lg">
                      <div className="thumb w60 position-relative rounded-circle mb15-md">
                        <div
                          className="rounded-circle mx-auto d-flex align-items-center justify-content-center bgc-thm2"
                          style={{ width: 56, height: 56 }}
                        >
                          <i className={`${
                            listing.goodType === "imovel" ? "flaticon-home" :
                            listing.goodType === "veiculo" ? "fas fa-car" :
                            "flaticon-briefcase"
                          } text-white fz18`} />
                        </div>
                      </div>
                      <div className="details ml15 ml0-md mb15-md">
                        <h5 className="title mb-2">
                          {listing.groupCode} · Cota #{listing.quotaNumber}
                        </h5>
                        <p className="mb-0 fz14 list-inline-item mb5-sm pe-1">
                          <i className="flaticon-place fz16 vam text-thm2 me-1" />
                          {listing.administradora}
                        </p>
                        <p className="mb-0 fz14 list-inline-item mb5-sm pe-1">
                          <i className="flaticon-contract fz16 vam text-thm2 me-1 bdrl1 pl15 pl0-xs bdrn-xs" />
                          Crédito {formatCurrency(listing.creditValue)}
                        </p>
                        <p className="mb-0 fz14 list-inline-item mb5-sm">
                          <i className="flaticon-30-days fz16 vam text-thm2 me-1 bdrl1 pl15 pl0-xs bdrn-xs" />
                          {listing.remainingInstallments}/{listing.totalInstallments} parcelas
                        </p>
                        <div className="d-flex align-items-center mt10" style={{ maxWidth: 250 }}>
                          <div className="progress w-100" style={{ height: 5 }}>
                            <div className="progress-bar bgc-thm" style={{ width: `${paidPct}%` }} />
                          </div>
                          <span className="fz12 ms-2 body-color text-nowrap">{paidPct}%</span>
                        </div>
                        <div className="d-flex flex-wrap gap-2 mt10">
                          <span className="fz12 body-color">
                            <i className="flaticon-view me-1" />{listing.views} views
                          </span>
                          <span className="fz12 body-color">
                            <i className="flaticon-chat me-1" />{listing.proposals} propostas
                          </span>
                          {listing.isContemplada && (
                            <span className="tag bdrs60 fz12" style={{ padding: "2px 10px" }}>
                              Contemplada
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-5 ps-0 ps-xl-3 pe-0">
                    <div className="details d-lg-flex align-items-center justify-content-between">
                      <div className="text-lg-end mb15-md">
                        <span
                          className="text-white fz12 fw600 d-inline-flex align-items-center mb10"
                          style={{
                            height: 22, padding: "0 10px",
                            borderRadius: 12,
                            backgroundColor: getListingStatusClass(listing.status),
                          }}
                        >
                          {getListingStatusLabel(listing.status)}
                        </span>
                        <h4>{formatCurrency(listing.askingPrice)}</h4>
                        <p className="text fz13 mb-0">
                          Parcela: {formatCurrency(listing.installmentValue)}/mês
                        </p>
                      </div>
                      <div className="d-flex flex-column gap-2">
                        {listing.status === "ativo" && (
                          <>
                            <Link
                              href="/cotista/propostas"
                              className="ud-btn btn-light-thm bdrs12 fz13"
                              style={{ padding: "8px 16px" }}
                            >
                              Propostas ({listing.proposals})
                            </Link>
                            <button
                              className="ud-btn btn-thm-border bdrs12 fz13"
                              style={{ padding: "8px 16px" }}
                            >
                              Pausar
                            </button>
                          </>
                        )}
                        {listing.status === "pausado" && (
                          <button
                            className="ud-btn btn-thm bdrs12 fz13"
                            style={{ padding: "8px 16px" }}
                          >
                            Reativar
                          </button>
                        )}
                        {listing.status === "vendido" && (
                          <Link
                            href="/cotista/repasses"
                            className="ud-btn btn-light-thm bdrs12 fz13"
                            style={{ padding: "8px 16px" }}
                          >
                            Ver Repasse
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
