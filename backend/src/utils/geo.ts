/**
 * Utilitários geográficos para o GuardaAgro
 * Validação de coordenadas e cálculo de bounding box para FIRMS API
 */

/**
 * Valida se a latitude está no intervalo válido [-90, 90]
 */
export function isValidLatitude(lat: number): boolean {
  return !isNaN(lat) && lat >= -90 && lat <= 90;
}

/**
 * Valida se a longitude está no intervalo válido [-180, 180]
 */
export function isValidLongitude(lng: number): boolean {
  return !isNaN(lng) && lng >= -180 && lng <= 180;
}

/**
 * Cria uma bounding box ao redor de um ponto (lat, lng) para consulta na FIRMS API
 * O offset padrão é ~0.5 grau (~55km) em cada direção
 * Retorna no formato: west,south,east,north
 */
export function createBoundingBox(
  latitude: number,
  longitude: number,
  offset: number = 0.5
): string {
  const west = Math.max(longitude - offset, -180).toFixed(4);
  const south = Math.max(latitude - offset, -90).toFixed(4);
  const east = Math.min(longitude + offset, 180).toFixed(4);
  const north = Math.min(latitude + offset, 90).toFixed(4);

  return `${west},${south},${east},${north}`;
}
