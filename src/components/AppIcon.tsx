type AppIconProps = {
  icon: "calculator";
};

export function AppIcon({ icon }: AppIconProps) {
  return (
    <svg className="app-icon" data-icon={icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M9 6h6M9 11h.01M15 11h.01M9 15h.01M15 15h.01M9 19h.01M15 19h.01" />
    </svg>
  );
}
