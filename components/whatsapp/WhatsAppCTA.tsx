import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface Props {
  message: string;
  label?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "green" | "accent";
}

export default function WhatsAppCTA({
  message,
  label = "Comprar por WhatsApp",
  className = "",
  size = "md",
  variant = "green",
}: Props) {
  const url = buildWhatsAppUrl(message);

  const sizeClasses = {
    sm:  "text-sm py-1.5 px-3",
    md:  "text-base py-2 px-5",
    lg:  "text-lg py-3 px-7",
  };

  const variantClasses = {
    green:  "bg-green-500 hover:bg-green-600 text-white",
    accent: "bg-accent hover:bg-yellow-500 text-foreground",
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded-lg font-medium transition-colors ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {/* WhatsApp icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-5 h-5 shrink-0"
        aria-hidden="true"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.555 4.124 1.528 5.856L.057 23.999l6.305-1.654A11.954 11.954 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.819 9.819 0 0 1-5.006-1.372l-.36-.214-3.724.978 1.001-3.64-.234-.374A9.818 9.818 0 0 1 2.182 12C2.182 6.565 6.565 2.182 12 2.182S21.818 6.565 21.818 12 17.435 21.818 12 21.818z"/>
      </svg>
      {label}
    </a>
  );
}
