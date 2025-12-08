"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import clsx from "clsx";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
}

export default function SidebarItem({
  icon: Icon,
  label,
  href,
}: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href as any}>
      <div
        className={clsx(
          "flex items-center gap-3 px-4 py-2 rounded-lg transition-all cursor-pointer",
          isActive
            ? "bg-blue-600 text-white"
            : "text-gray-300 hover:bg-gray-700"
        )}
      >
        <Icon size={20} />
        <span className="text-sm">{label}</span>
      </div>
    </Link>
  );
}
