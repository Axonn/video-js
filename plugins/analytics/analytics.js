var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-36505192-1']);
_gaq.push(['_trackPageview']);

(function () {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

_V_.GoogleAnalyticsTracker = _V_.Class.extend({

    _pointsToPlay: Array(),

    init: function (player) {
        try
        {
            this.EventHasFired = {};
            this.EventHasFired["Play"] = false;

            this.playedPoints = [];

            this.category = "Videos";
            this.title = location.pathname.substring(1);
            this.player = player;    

            this.nextTimeTriggeredIndex = 0;

            player.tech.addEvent("play", _V_.proxy(this, window.utils.bind(this.reportPlayEvent, this)));

            player.tech.addEvent("pause", _V_.proxy(this, window.utils.bind(this.reportPauseEvent, this)));
            player.tech.addEvent("error", _V_.proxy(this, window.utils.bind(this.reportErrorEvent, this)));

            player.addEvent("share", _V_.proxy(this, window.utils.bind(this.reportShareEvent, this)));
            player.addEvent("changeres", _V_.proxy(this, window.utils.bind(this.reportQualityChange, this)));

            $(window).on("beforeunload", window.utils.bind(this.reportLoadingDuration, this));
            $(window).on("beforeunload", window.utils.bind(this.reportVideoDepartTime, this));

            player.addEvent("seeked", _V_.proxy(this, window.utils.bind(this.setSeekedState, this)));
            player.addEvent("timeupdate", _V_.proxy(this, window.utils.bind(this.reportPlayedPoint, this)));
        }
        catch (error)
        {
            window.onerror(error);
        }
    },

    getPointsToPlay: function()
    {
        if (this._pointsToPlay == undefined || this._pointsToPlay.length == 0) {
            var duration = this.player.duration();
            var pointsToPlay = [0.5, 5, 10, 15, 30, 45, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360, 390, 420, 450, 480, 510, 540, 570, 600, 630, 660, 690, 720, 750, 780, 810, 840, 870, 900, 930, 960, 990, 1020, 1050, 1080, 1110, 1140, 1170, 1200];

            while (pointsToPlay.length > 0 && duration < pointsToPlay[pointsToPlay.length - 1]) {
                pointsToPlay.pop();
            }

            this._pointsToPlay = pointsToPlay;
        }

        return this._pointsToPlay;
    },

    reportEvent: function (action) {
        _gaq.push(['_trackEvent', this.category, action, this.title]);
    },

    reportPlayEvent:function()
    {
        this.reportSingleEvent("Play");
    },

    reportPauseEvent: function () {
        this.reportEvent("Pause");
    },

    reportErrorEvent: function () {
        this.reportEvent("Error");
    },

    reportShareEvent: function () {
        this.reportEvent("Share");
    },

    reportSingleEvent: function (action) {
        if (!this.EventHasFired[action]) {
            _gaq.push(['_trackEvent', this.category, action, this.title]);
            this.EventHasFired[action] = true;
        }
    },

    reportLoadingDuration: function () {
        var time = this.player.loadingTimer.getTime() * 1000;
        _gaq.push(['_trackTiming', this.category, "LoadingDuration", time, this.title, 100]);
    },

    reportVideoDepartTime: function () {
        var time = this.player.currentTime() * 1000;
        _gaq.push(['_trackTiming', this.category, "TimeAtDepart", time, this.title, 100]);
    },

    reportQualityChange: function () {
        _gaq.push(['_trackEvent', this.category, "QualityChange_" + this.player.options.currentResolution, this.title]);
    },

    reportPlayedPoint: function (value)
    {
        if (this.player.tech.seeking() == false) {
            if (this.seeked) {
                this.resetPlayedTriggerIndex();
                this.seeked = false;
            }
            var nextTimeToTrigger = this.getPointsToPlay()[this.nextTimeTriggeredIndex];
            var time = this.player.currentTime();
            if (this.player.currentTime() > nextTimeToTrigger) {

                if ($.inArray(nextTimeToTrigger, this.playedPoints) == -1) {
                    _gaq.push(['_trackEvent', this.category, "VideoWatched_" + nextTimeToTrigger.toString(), this.title]);
                    this.playedPoints.push(nextTimeToTrigger);
                }
                this.nextTimeTriggeredIndex += 1;
            }
        }
    },

    setSeekedState: function() {
        this.seeked = true;
    },

    resetPlayedTriggerIndex: function () {
        this.nextTimeTriggeredIndex = 0;
        var currentTime = this.player.currentTime();
        var nextTime = this.getPointsToPlay()[this.nextTimeTriggeredIndex];
        while (this.nextTimeTriggeredIndex < this.getPointsToPlay().length && this.player.currentTime() > this.getPointsToPlay()[this.nextTimeTriggeredIndex])
        {
            this.nextTimeTriggeredIndex++;
        }
        nextTime = this.getPointsToPlay()[this.nextTimeTriggeredIndex];
    }
});

_V_.LoadingTimer = _V_.Timer.extend({

    init: function (player) {
        this._super;

        player.addEvent("canplay", _V_.proxy(this, this.stop));
        player.addEvent("canplaythrough", _V_.proxy(this, this.stop));
        player.addEvent("playing", _V_.proxy(this, this.stop));
        player.addEvent("waiting", _V_.proxy(this, this.start));
    }
});

$(document).ready(function () {
    _V_.autoSetup();

    $.each(window._V_.players, function (playerName, player) {
        player.loadingTimer = new _V_.LoadingTimer(player);
        player.loadingTimer.start();
        player.googleAnalyticsTracker = new _V_.GoogleAnalyticsTracker(player);
    });
});