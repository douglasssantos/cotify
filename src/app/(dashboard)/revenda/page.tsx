"use client";

import StatCard from "@/components/ui/StatCard";

const recentSales = [
  {
    client: "João Silva",
    quota: "GRP-4052 #12",
    value: "R$ 2.450/mês",
    commission: "R$ 1.225",
    status: "Pago",
    date: "15/02/2026",
  },
  {
    client: "Maria Santos",
    quota: "GRP-5521 #7",
    value: "R$ 3.800/mês",
    commission: "R$ 1.900",
    status: "Pendente",
    date: "12/02/2026",
  },
  {
    client: "Pedro Costa",
    quota: "GRP-3187 #45",
    value: "R$ 980/mês",
    commission: "R$ 490",
    status: "Pago",
    date: "08/02/2026",
  },
  {
    client: "Ana Oliveira",
    quota: "GRP-2899 #23",
    value: "R$ 1.450/mês",
    commission: "R$ 725",
    status: "Aguardando 1ª parcela",
    date: "05/02/2026",
  },
];

const leads = [
  { name: "Carlos Lima", stage: "Simulação Enviada", date: "27/02" },
  { name: "Fernanda Souza", stage: "Contato", date: "26/02" },
  { name: "Ricardo Alves", stage: "Aguardando Pagamento", date: "25/02" },
  { name: "Julia Mendes", stage: "Cota Ativa", date: "22/02" },
];

export default function RevendaDashboard() {
  return (
    <div className="dashboard__content hover-bgc-color">
      <div className="row pb40">
        <div className="col-lg-12">
          <div className="dashboard_title_area">
            <h2>Dashboard da Revenda</h2>
            <p className="text">
              Acompanhe vendas, comissões e gerencie seus leads
            </p>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-6 col-xxl-3">
          <StatCard
            title="Cotas Vendidas"
            value="34"
            subtitle="8 este mês"
            icon="flaticon-shop"
          />
        </div>
        <div className="col-sm-6 col-xxl-3">
          <StatCard
            title="Comissão Acumulada"
            value="R$ 28.500"
            subtitle="R$ 4.340 este mês"
            icon="flaticon-dollar"
          />
        </div>
        <div className="col-sm-6 col-xxl-3">
          <StatCard
            title="Comissão Pendente"
            value="R$ 2.625"
            subtitle="3 aguardando"
            icon="flaticon-review"
          />
        </div>
        <div className="col-sm-6 col-xxl-3">
          <StatCard
            title="Taxa de Conversão"
            value="23%"
            subtitle="12 leads ativos"
            icon="flaticon-chart"
          />
        </div>
      </div>
      <div className="row mt30">
        <div className="col-lg-8">
          <div className="ps-widget bgc-white bdrs4 p30 mb30 overflow-hidden position-relative">
            <div className="d-flex justify-content-between bdrb1 pb15 mb20">
              <h5 className="title">Vendas Recentes</h5>
              <a className="text-decoration-underline text-thm6">Ver todas</a>
            </div>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th className="fz13 fw600">Cliente</th>
                    <th className="fz13 fw600">Cota</th>
                    <th className="fz13 fw600">Valor</th>
                    <th className="fz13 fw600">Comissão</th>
                    <th className="fz13 fw600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSales.map((sale, i) => (
                    <tr key={i}>
                      <td className="fz14">{sale.client}</td>
                      <td className="fz14">{sale.quota}</td>
                      <td className="fz14">{sale.value}</td>
                      <td className="fz14 fw500">{sale.commission}</td>
                      <td>
                        <span
                          className={`quota-status-badge ${
                            sale.status === "Pago"
                              ? "ativa"
                              : sale.status === "Pendente"
                              ? "inadimplente"
                              : "contemplada"
                          }`}
                        >
                          {sale.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="ps-widget bgc-white bdrs4 p30 mb30 overflow-hidden position-relative">
            <div className="d-flex justify-content-between bdrb1 pb15 mb20">
              <h5 className="title">Pipeline de Leads</h5>
              <a className="text-decoration-underline text-thm6">Ver todos</a>
            </div>
            {leads.map((lead, i) => (
              <div
                key={i}
                className={`d-flex justify-content-between align-items-center ${
                  i < leads.length - 1 ? "bdrb1 pb10 mb10" : ""
                }`}
              >
                <div>
                  <p className="fz14 mb-0 dark-color fw500">{lead.name}</p>
                  <p className="fz12 body-color mb-0">{lead.stage}</p>
                </div>
                <span className="fz12 body-color">{lead.date}</span>
              </div>
            ))}
          </div>
          <div className="ps-widget bgc-white bdrs4 p30 mb30 overflow-hidden position-relative">
            <div className="bdrb1 pb15 mb20">
              <h5 className="title">Gerar Link de Venda</h5>
            </div>
            <div className="mb15">
              <select className="form-select fz14">
                <option>Selecione a Administradora</option>
                <option>Embracon</option>
                <option>Porto Seguro</option>
                <option>Rodobens</option>
              </select>
            </div>
            <div className="mb15">
              <select className="form-select fz14">
                <option>Tipo de Bem</option>
                <option>Imóvel</option>
                <option>Veículo</option>
                <option>Serviço</option>
              </select>
            </div>
            <div className="d-grid">
              <button className="ud-btn btn-thm bdrs4 fz14">
                <i className="fas fa-link mr10" />
                Gerar Link UTM
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
