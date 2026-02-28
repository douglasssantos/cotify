export default function DashboardFooter() {
  return (
    <footer className="dashboard_footer pt30 pb30">
      <div className="container">
        <div className="row align-items-center justify-content-center justify-content-md-between">
          <div className="col-auto">
            <div className="copyright-widget">
              <p className="mb-md-0">
                &copy; ConsórcioPro. {new Date().getFullYear()} Todos os direitos reservados.
              </p>
            </div>
          </div>
          <div className="col-auto">
            <p className="mb-0 fz14 text-gray">
              Regulamentado pelo Banco Central do Brasil
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
