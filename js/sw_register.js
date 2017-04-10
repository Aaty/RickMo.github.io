"use strict";

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register("/sw.js", {scope: "./"}).then(function (reg) {
		console.log("serviceWorker successfully registered");
	}).catch(function (err) {
		console.warm("Error registering serviceWorker");
	});
}

