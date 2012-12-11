logglyClient = _V_.Class.extend({
    init: function () {
        var scriptPaths = {
            http: "http://cloudfront.loggly.com/js/loggly-0.2.1.js",
            https: "https://d3eyf2cx8mbems.cloudfront.net/js/loggly-0.2.1.js"
        };

        var protocol = document.location.protocol;
        protocol = protocol.substring(0, protocol.length - 1);
        var scriptSrc = scriptPaths[protocol];
        var logglyPaths = {
            http: "http://logs.loggly.com",
            https: "https://logs.loggly.com"
        };
        var logglySrc = logglyPaths[protocol];
        this.key = "3e53bbf5-2443-4561-b75b-a8d59956310b";
        this.config = {
            url: logglySrc + '/inputs/' + this.key,
            level: 'log'
        }

        $.getScript(scriptSrc);
        this.setCastor();
    },

    logError: function (error, file, line) {
        var logError = {};

        console.log(error);

        logError.url = window.location.href;
        logError.userAgent = navigator.userAgent;

        if (file != undefined) {
            logError.file = file;
        }

        if (line != undefined) {
            logError.line = line;
        }

        if (error.message != undefined) {
            logError.message = error.message;
        }

        if (error.source != undefined) {
            logError.source = error.source;
        }

        if (error.href != undefined) {
            logError.href = error.href;
        }

        if (error.category != undefined) {
            logError.category = error.category;
        }

        if (error.lineNo != undefined) {
            logError.lineNo = error.lineNo;
        }

        if (error.currentTarget != undefined && error.currentTarget.id != undefined) {
            logError.currentTarget = error.currentTarget.id;
        }

        window.logglyClient.castor.log(logError);
    },

    setCastor: function () {
        this.castor = new loggly.castor(this.config)
        window.onerror = this.logError;
    }
});

window.logglyClient = new logglyClient();

$(document).ready(function () {
    _V_.autoSetup();

    $.each(window._V_.players, function (playerName, player) {
        player.tech.addEvent("error", _V_.proxy(logglyClient, logglyClient.logError));
        player.addEvent("error", _V_.proxy(logglyClient, logglyClient.logError));
    });
});