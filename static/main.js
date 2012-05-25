var Gistlicious = {
    minGistId: 1,
    maxGistId: 2000,

    apiRoot: "https://api.github.com/gists/public",

    publicGistUrl: "?per_page=1&page=",

    jsonp: function (url, callback, context) {
        var id = +new Date,
        script = document.createElement("script");

        while (window.__jsonp_callbacks[id] !== undefined)
            id += Math.random(); // Avoid slight possibility of id clashes.

        window.__jsonp_callbacks[id] = function () {
            delete window.__jsonp_callbacks[id];
            callback.apply(context, arguments);
        };

        var prefix = "?";
        if (url.indexOf("?") >= 0)
            prefix = "&";

        url += prefix + "callback=" + encodeURIComponent("window.__jsonp_callbacks[" + id + "]");
        script.setAttribute("src", this.apiRoot + url);

        document.getElementsByTagName('head')[0].appendChild(script);
    },

    getRandomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    getRandomGist: function(callback) {
        var page = this.getRandomInt(this.minGistId, this.maxGistId);

        var url = this.publicGistUrl + page;

        var callbackWrapper = function(response) {
            if (response.meta.status !== 200) {
                console.log("GitHub ERROR", response);
            } else {
                var gist = response.data[0];
                callback(gist);
            }
        };

        this.jsonp(url, callbackWrapper, this);
    },

    onReady: function() {
        var callback = function(targetId, data) {
            // Create an iframe, append it to this document where specified
            var gistFrame = document.createElement("iframe");
            gistFrame.setAttribute("width", "100%");
            gistFrame.id = "gistFrame-" + data.id;

            var zone = document.getElementById(targetId);
            zone.innerHTML = "";
            zone.appendChild(gistFrame);

            // Create the iframe's document
            var gistFrameHTML = '<html><body onload="parent.adjustIframeSize(\'' + data.id + '\', document.body.scrollHeight)"><scr' + 'ipt type="text/javascript" src="https://gist.github.com/' + data.id + '.js"></sc'+'ript></body></html>';

            // Set iframe's document with a trigger for this document to adjust the height
            var gistFrameDoc = gistFrame.document;

            if (gistFrame.contentDocument) {
                gistFrameDoc = gistFrame.contentDocument;
            } else if (gistFrame.contentWindow) {
                gistFrameDoc = gistFrame.contentWindow.document;
            }

            gistFrameDoc.open();
            gistFrameDoc.writeln(gistFrameHTML);
            gistFrameDoc.close();
        };

        this.getRandomGist(function(data) { callback("left", data); });
        this.getRandomGist(function(data) { callback("right", data); });
    },
};

window.__jsonp_callbacks = {};

window.adjustIframeSize = function(id, newHeight) {
    var i = document.getElementById("gistFrame-" + id);
    i.style.height = parseInt(newHeight) + "px";
};

Gistlicious.onReady();
