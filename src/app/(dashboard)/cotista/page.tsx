"use client";

import StatCard from "@/components/ui/StatCard";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

const recentPayments = [
  { date: "15/02/2026", group: "GRP-4052", value: 2450, status: "Pago" },
  { date: "15/01/2026", group: "GRP-4052", value: 2450, status: "Pago" },
  { date: "15/12/2025", group: "GRP-4052", value: 2450, status: "Pago" },
  { date: "15/11/2025", group: "GRP-4052", value: 2450, status: "Pago" },
];

export default function CotistaDashboard() {
  return (
    <div className="dashboard__content hover-bgc-color">
      <div className="row pb40">
        <div className="col-lg-12">
          <div className="dashboard_title_area">
            <h2>Dashboard do Cotista</h2>
            <p className="text">
              Acompanhe suas cotas e gerencie seus consórcios
            </p>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-6 col-xxl-3">
          <StatCard
            title="Cotas Ativas"
            value="2"
            subtitle="1 contemplada"
            icon="flaticon-document"
          />
        </div>
        <div className="col-sm-6 col-xxl-3">
          <StatCard
            title="Total Investido"
            value="R$ 130.000"
            subtitle="+R$ 2.450 este mês"
            icon="flaticon-dollar"
          />
        </div>
        <div className="col-sm-6 col-xxl-3">
          <StatCard
            title="Crédito Total"
            value="R$ 435.000"
            subtitle="2 grupos"
            icon="flaticon-contract"
          />
        </div>
        <div className="col-sm-6 col-xxl-3">
          <StatCard
            title="Próxima Parcela"
            value="R$ 2.450"
            subtitle="Vence em 15/03"
            icon="flaticon-calendar"
          />
        </div>
      </div>
      <div className="row mt30">
        <div className="col-md-6">
          <div className="ps-widget bgc-white bdrs4 p30 mb30 overflow-hidden position-relative">
            <div className="d-flex justify-content-between bdrb1 pb15 mb20">
              <h5 className="title">Minhas Cotas</h5>
              <Link
                href="/cotista/minhas-cotas"
                className="text-decoration-underline text-thm6"
              >
                Ver todas
              </Link>
            </div>
            <div className="dashboard-img-service">
              <div className="d-flex align-items-center justify-content-between bdrb1 pb15 mb15">
                <div>
                  <h6 className="mb5">Grupo GRP-4052 - Cota #12</h6>
                  <p className="fz13 body-color mb-0">Imóvel • Embracon</p>
                </div>
                <span className="quota-status-badge ativa">Ativa</span>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="mb5">Grupo GRP-3187 - Cota #45</h6>
                  <p className="fz13 body-color mb-0">Veículo • Porto Seguro</p>
                </div>
                <span className="quota-status-badge contemplada">
                  Contemplada
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="ps-widget bgc-white bdrs4 p30 mb30 overflow-hidden position-relative">
            <div className="d-flex justify-content-between bdrb1 pb15 mb20">
              <h5 className="title">Últimos Pagamentos</h5>
              <Link
                href="/cotista/financeiro"
                className="text-decoration-underline text-thm6"
              >
                Ver extrato
              </Link>
            </div>
            <div>
              {recentPayments.map((payment, i) => (
                <div
                  key={i}
                  className={`d-flex justify-content-between align-items-center ${
                    i < recentPayments.length - 1 ? "bdrb1 pb10 mb10" : ""
                  }`}
                >
                  <div>
                    <p className="fz14 mb-0 dark-color">{payment.date}</p>
                    <p className="fz12 body-color mb-0">{payment.group}</p>
                  </div>
                  <div className="text-end">
                    <p className="fz14 fw500 mb-0 dark-color">
                      {formatCurrency(payment.value)}
                    </p>
                    <span className="fz12" style={{ color: "#5bbb7b" }}>
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Secondary Market */}
      <div className="row mt30">
        <div className="col-12">
          <div className="ps-widget bgc-white bdrs4 p30 mb30 overflow-hidden position-relative">
            <div className="d-flex justify-content-between bdrb1 pb15 mb20">
              <h5 className="title">Mercado Secundário</h5>
              <Link
                href="/cotista/anuncios"
                className="text-decoration-underline text-thm6"
              >
                Ver anúncios
              </Link>
            </div>
            <div className="row">
              <div className="col-md-3 col-sm-6 mb15">
                <Link href="/cotista/anunciar" className="d-block text-center p20 bdr1 bdrs12 hover-box-shadow">
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb10"
                    style={{ width: 48, height: 48, backgroundColor: "rgba(91,187,123,0.1)" }}
                  >
                    <i className="fas fa-plus fz18" style={{ color: "#5bbb7b" }} />
                  </div>
                  <h6 className="fz14 mb-0">Anunciar Cota</h6>
                  <span className="fz12 body-light-color">Vender no marketplace</span>
                </Link>
              </div>
              <div className="col-md-3 col-sm-6 mb15">
                <Link href="/cotista/anuncios" className="d-block text-center p20 bdr1 bdrs12 hover-box-shadow">
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb10"
                    style={{ width: 48, height: 48, backgroundColor: "#0d6efd15" }}
                  >
                    <i className="flaticon-shop fz18" style={{ color: "#0d6efd" }} />
                  </div>
                  <h6 className="fz14 mb-0">Meus Anúncios</h6>
                  <span className="fz12 body-light-color">2 ativos</span>
                </Link>
              </div>
              <div className="col-md-3 col-sm-6 mb15">
                <Link href="/cotista/propostas" className="d-block text-center p20 bdr1 bdrs12 hover-box-shadow">
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb10"
                    style={{ width: 48, height: 48, backgroundColor: "#f0ad4e15" }}
                  >
                    <i className="flaticon-chat fz18" style={{ color: "#f0ad4e" }} />
                  </div>
                  <h6 className="fz14 mb-0">Propostas</h6>
                  <span className="fz12 body-light-color">2 pendentes</span>
                </Link>
              </div>
              <div className="col-md-3 col-sm-6 mb15">
                <Link href="/cotista/repasses" className="d-block text-center p20 bdr1 bdrs12 hover-box-shadow">
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb10"
                    style={{ width: 48, height: 48, backgroundColor: "#6f42c115" }}
                  >
                    <i className="flaticon-transfer fz18" style={{ color: "#6f42c1" }} />
                  </div>
                  <h6 className="fz14 mb-0">Repasses</h6>
                  <span className="fz12 body-light-color">1 em andamento</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="ps-widget bgc-white bdrs4 p30 mb30 overflow-hidden position-relative">
            <div className="bdrb1 pb15 mb20">
              <h5 className="title">Atividade Recente</h5>
            </div>
            <div className="dashboard-timeline-label">
              {[
                {
                  time: "08:42",
                  title: "Parcela paga com sucesso",
                  subtitle: "Grupo GRP-4052 • R$ 2.450,00",
                },
                {
                  time: "14:37",
                  title: "Assembleia realizada",
                  subtitle: "Grupo GRP-4052 • Não contemplado nesta rodada",
                },
                {
                  time: "16:50",
                  title: "Lance registrado",
                  subtitle: "Grupo GRP-3187 • Lance livre de R$ 15.000,00",
                },
              ].map((item, i) => (
                <div key={i} className="timeline-item pb15">
                  <div className="child-timeline-label">{item.time}</div>
                  <div className="timeline-badge d-flex align-items-center">
                    <i className="fas fa-genderless" />
                  </div>
                  <div className="ra_pcontent pl10">
                    <span className="title">{item.title}</span>
                    <br />
                    <span className="subtitle">{item.subtitle}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
