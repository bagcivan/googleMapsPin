// Define a function to load Google Maps
export async function loadGoogleMaps(options) {
    var scriptElement,
        promise,
        urlParams = new URLSearchParams,
        googleObject = window.google || (window.google = {}),
        googleMapsObject = googleObject.maps || (googleObject.maps = {}),
        libraries = new Set;

    // This function returns a promise that resolves when the Google Maps JavaScript API is loaded
    var getPromise = function () {
        if (!promise) {
            promise = new Promise(async function (resolve, reject) {
                scriptElement = document.createElement("script");

                urlParams.set("libraries", Array.from(libraries).join(","));
                for (var option in options) {
                    urlParams.set(option.replace(/[A-Z]/g, function (match) {
                        return "_" + match.toLowerCase();
                    }), options[option]);
                }

                urlParams.set("callback", "google.maps.__ib__");
                scriptElement.src = `https://maps.googleapis.com/maps/api/js?` + urlParams;

                googleMapsObject.__ib__ = resolve;
                scriptElement.onerror = function () {
                    promise = reject(new Error("The Google Maps JavaScript API could not load."));
                };

                scriptElement.nonce = document.querySelector("script[nonce]")?.nonce || "";
                document.head.append(scriptElement);
            });
        }

        return promise;
    };

    if (googleMapsObject.importLibrary) {
        console.warn("The Google Maps JavaScript API only loads once. Ignoring:", options);
    } else {
        googleMapsObject.importLibrary = function (library) {
            libraries.add(library);
            return getPromise().then(function () {
                return googleMapsObject.importLibrary(library);
            });
        };
    }
}

// Call the function with your API key and version
loadGoogleMaps({
    key: "AIzaSyCUDhkoPJ5kQs4sthWCfLCEDNayt4nraVQ",
    v: "beta",
    language: "tr"
});
