import { Shield, Award, UtensilsCrossed, FileCheck } from "lucide-react";

interface CertificationBadgesProps {
  certifications: string[];
  variant?: "default" | "compact";
}

const certificationIcons: Record<string, React.ReactNode> = {
  SNI: <FileCheck className="w-4 h-4" />,
  "ISO 9001": <Award className="w-4 h-4" />,
  "Food Grade": <UtensilsCrossed className="w-4 h-4" />,
  "SS 304": <Shield className="w-4 h-4" />,
};

const certificationDescriptions: Record<string, string> = {
  SNI: "Standar Nasional Indonesia",
  "ISO 9001": "Sistem Manajemen Mutu Internasional",
  "Food Grade": "Aman untuk kontak dengan makanan",
  "SS 304": "Stainless Steel 304 berkualitas tinggi",
};

export function CertificationBadges({ certifications, variant = "default" }: CertificationBadgesProps) {
  if (!certifications || certifications.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {certifications.map((cert) => (
        <div
          key={cert}
          className={`inline-flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-sm text-green-700 ${
            variant === "compact" ? "text-xs px-2 py-1" : ""
          }`}
          title={certificationDescriptions[cert] || cert}
        >
          {certificationIcons[cert] || <Shield className="w-4 h-4" />}
          <span className="font-medium">{cert}</span>
        </div>
      ))}
    </div>
  );
}
