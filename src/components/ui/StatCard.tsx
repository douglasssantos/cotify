interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: string;
}

export default function StatCard({ title, value, subtitle, icon }: StatCardProps) {
  return (
    <div className="d-flex align-items-center justify-content-between statistics_funfact">
      <div className="details">
        <div className="fz15">{title}</div>
        <div className="title">{value}</div>
        {subtitle && (
          <div className="text fz14">
            <span className="text-thm">{subtitle}</span>
          </div>
        )}
      </div>
      <div className="icon text-center">
        <i className={icon} />
      </div>
    </div>
  );
}
