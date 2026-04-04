const PHONE = process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER || process.env.WHATSAPP_PHONE_NUMBER || "573193098152";

/** Build a wa.me link with a pre-filled message */
export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
}

export function productInquiryMessage(productName: string): string {
  return `Hola! Me interesa comprar *${productName}*. ¿Está disponible?`;
}

export function serviceInquiryMessage(serviceName: string): string {
  return `Hola! Quisiera agendar una cita de *${serviceName}*. ¿Tienen disponibilidad?`;
}

export function generalInquiryMessage(): string {
  return "Hola! Me gustaría más información sobre sus servicios veterinarios a domicilio.";
}
