import "./AuthInfoPanel.scss";

export type AuthInfoItem = {
  icon: string;
  title: string;
  description: string;
  alt?: string;
  iconSize?: number;
};

export type AuthInfoPanelProps = {
  headline: string;
  subtext: string;
  items: AuthInfoItem[];
};

export const AuthInfoPanel = ({ headline, subtext, items }: AuthInfoPanelProps) => {
  return (
    <section className="auth-info-panel">
      <div className="auth-info-inner">
        <h2 className="auth-info-head-text">{headline}</h2>
        <span className="auth-info-sub-text">{subtext}</span>

        <div className="auth-info-list">
          {items.map((item) => (
            <div className="auth-info-item" key={item.title}>
              <img
                src={item.icon}
                alt={item.alt || item.title}
                width={item.iconSize || 48}
                height={item.iconSize || 48}
              />
              <div>
                <h3 className="auth-info-item-head">{item.title}</h3>
                <p className="auth-info-item-sub">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
