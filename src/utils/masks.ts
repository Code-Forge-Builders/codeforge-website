export function phoneMask(value: string) {
  const digits = value.replace(/\D/g, '')

  return digits
    .replace(/^(\d{2})(\d{1,4})$/g, '($1) $2')
    .replace(/^(\d{2})(\d{4})(\d{1,4})$/g, '($1) $2-$3')
    .replace(/^(\d{2})(\d{5})(\d{1,4})$/g, '($1) $2-$3')
}
