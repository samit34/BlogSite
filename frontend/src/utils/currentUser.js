import { jwtDecode } from "jwt-decode";

export function getCurrentUserId() {
  const token = localStorage.getItem("token");
  if (!token) return "";
  try {
    const decoded = jwtDecode(token);
    return String(decoded.userid || decoded.id || "");
  } catch {
    return "";
  }
}

export function userHasLiked(liked, userId = getCurrentUserId()) {
  if (!userId || !Array.isArray(liked)) return false;
  return liked.map(String).includes(String(userId));
}
