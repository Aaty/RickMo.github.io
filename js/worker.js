onmessage = function(e) {
    postMessage({"message": "RETURNING MESSAGE: " + e.data.message});
}
