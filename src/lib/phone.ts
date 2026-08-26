export function normalizeWaPhone(phone: string): string {
  const digits = phone.replace(/[^0-9]/g, "");
  // wa.me mewajibkan format internasional tanpa awalan 0
  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("0")) return "62" + digits.slice(1);
  if (digits.startsWith("8")) return "62" + digits;
  return digits;
}
