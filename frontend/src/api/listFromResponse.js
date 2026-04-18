/** Supports legacy plain arrays or { data: [] } from the API */
export default function listFromResponse(res) {
  const d = res?.data;
  if (Array.isArray(d)) return d;
  if (d && Array.isArray(d.data)) return d.data;
  return [];
}
