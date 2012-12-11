_V_.Timer = _V_.Class.extend({

    init: function () {
        this.previousElapsed = 0;
        this.elapsed = 0;
        this.running = false;
    },

    start: function () {
        if (this.running == false) {
            this.lastStart = new Date().getTime();
            this.interval = window.setInterval(
                new function ()
                {
                    var time = new Date().getTime() - this.lastStart;
                    this.elapsed = Math.floor(time / 100) / 10;
                }, 100);
            this.running = true;
        };
    },

    updateTime: function (object) {
        var time = new Date().getTime() - this.lastStart;
        this.elapsed = Math.floor(time / 100) / 10;
    },

    stop: function () {
        if (this.running == true) {
            this.previousElapsed += this.elapsed;
            clearInterval(this.interval);
            this.elapsed = 0;
            this.running = false;
        }
    },

    reset: function () {
        this.previousElapsed = 0;
        this.elapsed = 0;
    },

    getTime: function () {
        return (this.previousElapsed + this.elapsed);
    }
});

Array.prototype.phpFilter = function (func) {
    var retObj = [],
      k;

    func = func || function (v) { return v; };

    for (k in this) {
        if (func(this[k])) {
            retObj.push(this[k]);
        }
    }

    return retObj;
}

utils = new function () { };

// because ie8 doesn't support the .bind() method on functions
utils.bind = function (func, value) {
    return function () {
        return func.apply(value, arguments);
    }
};