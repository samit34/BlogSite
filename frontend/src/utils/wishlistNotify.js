export async function addToWishlistWithToast(api, id, showToast) {
  try {
    await api.post("/user/wishlist", { id });
    showToast("Saved to your wishlist.", "success");
  } catch (err) {
    if (err.response?.status === 409) {
      showToast(
        err.response?.data?.message ||
          "This post is already in your wishlist.",
        "info"
      );
    } else {
      showToast(
        err.response?.data?.message || "Could not save to your wishlist.",
        "error"
      );
    }
  }
}

export async function removeFromWishlistWithToast(api, id, showToast) {
  try {
    await api.post("/user/deletecard", { id });
    showToast("Removed from your wishlist.", "success");
    return true;
  } catch (err) {
    const msg =
      err.response?.data?.message ||
      (typeof err.response?.data === "string"
        ? err.response.data
        : null) ||
      "Could not remove this item.";
    showToast(msg, "error");
    return false;
  }
}
