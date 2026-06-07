/**
 * Utilitários de data para integração com APIs da NASA
 * As APIs da NASA usam formato YYYYMMDD
 */

/**
 * Formata uma data no padrão YYYYMMDD exigido pela NASA POWER API
 */
export function formatDateNasa(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

/**
 * Calcula o período (start/end) com base na quantidade de dias retroativos
 * Retorna datas no formato YYYYMMDD
 * Usa 2 dias de offset para garantir disponibilidade dos dados na NASA
 */
export function calculatePeriod(days: number): { start: string; end: string } {
  const now = new Date();

  // NASA POWER pode ter atraso de ~2 dias nos dados
  const end = new Date(now);
  end.setDate(end.getDate() - 2);

  const start = new Date(end);
  start.setDate(start.getDate() - (days - 1));

  return {
    start: formatDateNasa(start),
    end: formatDateNasa(end),
  };
}

/**
 * Valida se o valor de days é permitido (1, 3 ou 7)
 */
export function isValidDays(days: number): boolean {
  return [1, 3, 7].includes(days);
}
