self.addEventListener("message", function(e) {
    postMessage({"message": "RETURNING MESSAGE: " + e.data.message});
});
