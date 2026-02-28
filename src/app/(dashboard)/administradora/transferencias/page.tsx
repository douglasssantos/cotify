"use client";

const transfers = [
  {
    id: 1,
    quota: "GRP-4052 #12",
    seller: "João Silva",
    buyer: "Maria Santos",
    value: "R$ 95.000",
    date: "25/02/2026",
    status: "pendente",
    docs: true,
  },
  {
    id: 2,
    quota: "GRP-5521 #7",
    seller: "Pedro Costa",
    buyer: "Ana Oliveira",
    value: "R$ 165.000",
    date: "24/02/2026",
    status: "pendente",
    docs: true,
  },
  {
    id: 3,
    quota: "GRP-3187 #45",
    seller: "Carlos Lima",
    buyer: "Lucas Rocha",
    value: "R$ 52.000",
    date: "23/02/2026",
    status: "pendente",
    docs: false,
  },
  {
    id: 4,
    quota: "GRP-2899 #23",
    seller: "Fernanda Souza",
    buyer: "Ricardo Alves",
    value: "R$ 105.000",
    date: "20/02/2026",
    status: "aprovada",
    docs: true,
  },
  {
    id: 5,
    quota: "GRP-7744 #33",
    seller: "Marcos Pereira",
    buyer: "Julia Mendes",
    value: "R$ 15.000",
    date: "18/02/2026",
    status: "rejeitada",
    docs: true,
  },
];

export default function TransferenciasPage() {
  return (
    <div className="dashboard__content hover-bgc-color">
      <div className="row pb40">
        <div className="col-lg-12">
          <div className="dashboard_title_area">
            <h2>Aprovação de Transferências</h2>
            <p className="text">
              Valide documentação e aprove ou rejeite transferências de cotas
            </p>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="ps-widget bgc-white bdrs4 p30 mb30 overflow-hidden position-relative">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th className="fz14 fw600">Cota</th>
                    <th className="fz14 fw600">Vendedor</th>
                    <th className="fz14 fw600">Comprador</th>
                    <th className="fz14 fw600">Valor</th>
                    <th className="fz14 fw600">Data</th>
                    <th className="fz14 fw600">Documentos</th>
                    <th className="fz14 fw600">Status</th>
                    <th className="fz14 fw600">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {transfers.map((t) => (
                    <tr key={t.id}>
                      <td className="fz14 fw500">{t.quota}</td>
                      <td className="fz14">{t.seller}</td>
                      <td className="fz14">{t.buyer}</td>
                      <td className="fz14 fw500">{t.value}</td>
                      <td className="fz14">{t.date}</td>
                      <td>
                        {t.docs ? (
                          <span className="fz12" style={{ color: "#5bbb7b" }}>
                            <i className="fas fa-check-circle mr5" />
                            Completo
                          </span>
                        ) : (
                          <span className="fz12" style={{ color: "#eb6753" }}>
                            <i className="fas fa-exclamation-circle mr5" />
                            Pendente
                          </span>
                        )}
                      </td>
                      <td>
                        <span
                          className={`quota-status-badge ${
                            t.status === "pendente"
                              ? "inadimplente"
                              : t.status === "aprovada"
                              ? "ativa"
                              : "cancelada"
                          }`}
                        >
                          {t.status === "pendente"
                            ? "Pendente"
                            : t.status === "aprovada"
                            ? "Aprovada"
                            : "Rejeitada"}
                        </span>
                      </td>
                      <td>
                        {t.status === "pendente" && (
                          <div className="d-flex gap-2">
                            <button className="ud-btn btn-thm bdrs4 fz12 px-3 py-1">
                              Aprovar
                            </button>
                            <button className="ud-btn btn-white bdrs4 fz12 px-3 py-1">
                              Rejeitar
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
