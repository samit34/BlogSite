/** 200 with a clear message when a list is empty */
function sendList(res, items, emptyMessage = "No data found") {
  const list = items || [];
  return res.status(200).json({
    success: list.length > 0,
    count: list.length,
    data: list,
    message: list.length === 0 ? emptyMessage : undefined,
  });
}

function notFound(res, message = "Not found") {
  return res.status(404).json({ success: false, message });
}

module.exports = { sendList, notFound };
