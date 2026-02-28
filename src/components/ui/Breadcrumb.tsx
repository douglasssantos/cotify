import Link from "next/link";

interface BreadcrumbProps {
  title: string;
  subtitle?: string;
  items?: { label: string; href?: string }[];
}

export default function Breadcrumb({ title, subtitle, items }: BreadcrumbProps) {
  return (
    <section className="breadcumb-section mt40">
      <div className="cta-commmon-v1 cta-banner bgc-thm2 mx-auto maxw1700 pt120 pb120 bdrs16 position-relative overflow-hidden d-flex align-items-center mx20-lg">
        <img
          className="left-top-img"
          src="/images/vector-img/left-top.png"
          alt=""
        />
        <img
          className="right-bottom-img"
          src="/images/vector-img/right-bottom.png"
          alt=""
        />
        <div className="container">
          <div className="row">
            <div className="col-xl-5">
              <div className="position-relative">
                {items && (
                  <nav aria-label="breadcrumb" className="mb10">
                    <ol
                      className="breadcrumb mb-0"
                      style={{ background: "transparent" }}
                    >
                      {items.map((item, i) => (
                        <li
                          key={i}
                          className={`breadcrumb-item fz14 ${
                            i === items.length - 1 ? "active text-white" : ""
                          }`}
                        >
                          {item.href ? (
                            <Link
                              href={item.href}
                              style={{ color: "rgba(255,255,255,0.7)" }}
                            >
                              {item.label}
                            </Link>
                          ) : (
                            <span className="text-white">{item.label}</span>
                          )}
                        </li>
                      ))}
                    </ol>
                  </nav>
                )}
                <h2 className="text-white">{title}</h2>
                {subtitle && (
                  <p className="text mb30 text-white">{subtitle}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
