import { FundCategory } from "@/types";

interface Props {
  category: FundCategory;
  className?: string;
}

export default function FundCategoryBadge({ category, className = "" }: Props) {
  const configs: Record<FundCategory, { label: string; badgeClass: string }> = {
    ALLOCATION: {
      label: "Alokasi / Penetapan",
      badgeClass: "bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]"
    },
    DISTRIBUTION: {
      label: "Penyaluran",
      badgeClass: "bg-[#EEF2FF] text-[#4338CA] border-[#C7D2FE]"
    },
    REALIZATION: {
      label: "Realisasi dilaporkan",
      badgeClass: "bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]"
    },
    PLAN: {
      label: "Rencana / Pengajuan",
      badgeClass: "bg-[#F1F5F9] text-[#475569] border-[#CBD5E1]"
    }
  };

  const config = configs[category] || { label: category, badgeClass: "bg-zinc-100 text-zinc-700 border-zinc-200" };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${config.badgeClass} ${className}`}>
      {config.label}
    </span>
  );
}
