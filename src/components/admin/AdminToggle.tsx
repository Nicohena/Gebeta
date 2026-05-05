"use client";

interface AdminToggleProps {
  checked: boolean;
  onChange: (val: boolean) => void;
  label?: string;
  size?: "sm" | "md";
  id?: string;
}

export default function AdminToggle({ checked, onChange, label, size = "md", id }: AdminToggleProps) {
  const trackW = size === "sm" ? "w-8" : "w-11";
  const trackH = size === "sm" ? "h-4" : "h-6";
  const thumb = size === "sm" ? "w-3 h-3" : "w-4 h-4";
  const translateOn = size === "sm" ? "translate-x-4" : "translate-x-5";
  const margin = size === "sm" ? "m-0.5" : "m-1";

  return (
    <label className="inline-flex items-center gap-2 cursor-pointer select-none" htmlFor={id}>
      <div
        id={id}
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        onClick={() => onChange(!checked)}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onChange(!checked)}
        className={`relative ${trackW} ${trackH} rounded-full transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-1 ${checked ? "bg-[#F97316]" : "bg-gray-200"}`}
      >
        <span
          className={`absolute top-0 left-0 ${margin} ${thumb} rounded-full bg-white shadow-sm transition-transform duration-200 ${checked ? translateOn : "translate-x-0"}`}
        />
      </div>
      {label && <span className="text-sm text-gray-700 font-medium">{label}</span>}
    </label>
  );
}
