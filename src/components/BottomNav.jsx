import { House, Route, Settings, UsersRound, WalletCards } from "lucide-react";

const NAV_ITEMS = [
  { key: "home", label: "Home", icon: House },
  { key: "passengers", label: "Passengers", icon: UsersRound },
  { key: "history", label: "Rides", icon: Route },
  { key: "wallet", label: "Wallet", icon: WalletCards },
  { key: "settings", label: "Settings", icon: Settings },
];

export function BottomNav({ activeKey, onChange }) {
  return (
    <nav className="pasabai-dock-wrap" aria-label="Main navigation">
      <div className="pasabai-dock">
        {NAV_ITEMS.map((item) => {
          const active = item.key === activeKey;
          const Icon = item.icon;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onChange(item.key)}
              aria-current={active ? "page" : undefined}
              className={`pasabai-dock-item ${active ? "is-active" : ""}`}
            >
              <Icon aria-hidden="true" size={25} strokeWidth={active ? 2.5 : 2.15} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
