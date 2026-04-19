/**
 * Reads a user-facing message from an axios error (backend JSON or string body).
 */
export function getApiErrorMessage(err, fallback = "Something went wrong.") {
  const data = err?.response?.data;
  if (data == null) {
    return err?.message || fallback;
  }
  if (typeof data === "string") {
    return data || fallback;
  }
  if (typeof data === "object") {
    return data.message || data.error || fallback;
  }
  return fallback;
}
