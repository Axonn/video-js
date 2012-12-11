_V_.SocialShareButton = _V_.Button.extend({

    kind: "share",
    className: "vjs-share-button",

    init: function (player, options) {

        this._super(player, options);

        player.options = player.options || {};

        this.menu = this.createMenu();
    },

    createMenu: function () {

        var menu = new _V_.Menu(this.player);

        // Add a title list item to the top
        menu.el.appendChild(_V_.createElement("li", {
            className: "vjs-menu-title",
            innerHTML: _V_.uc(this.kind)
        }));

        this.items = this.createItems();

        // Add menu items to the menu
        this.each(this.items, function (item) {
            menu.addItem(item);
        });

        // Add list to element
        this.addComponent(menu);

        return menu;
    },

    // Override the default _V_.Button createElement so the button text isn't hidden
    createElement: function (type, attrs) {

        // Add standard Aria and Tabindex info
        attrs = _V_.merge({
            className: this.buildCSSClass(),
            innerHTML: '<div></div>',
            role: "button",
            tabIndex: 0
        }, attrs);

        return this._super(type, attrs);
    },

    // Create a menu item for each text track
    createItems: function () {

        var items = [];

        items.push(_V_.FacebookShareMenuItem(this.player));
        items.push(_V_.TwitterShareMenuItem(this.player));
        items.push(_V_.GooglePlusShareMenuItem(this.player));
        items.push(_V_.LinkedInShareMenuItem(this.player));
        items.push(_V_.TumblrShareMenuItem(this.player));

        return items;
    },

    buildCSSClass: function () {

        return this.className + " vjs-menu-button " + this._super();
    },

    // Focus - Add keyboard functionality to element
    onFocus: function () {

        // Show the menu, and keep showing when the menu items are in focus
        this.menu.lockShowing();
        this.menu.el.style.display = "block";

        // When tabbing through, the menu should hide when focus goes from the last menu item to the next tabbed element.
        _V_.one(this.menu.el.childNodes[this.menu.el.childNodes.length - 1], "blur", this.proxy(function () {

            this.menu.unlockShowing();
        }));
    },

    // Can't turn off list display that we turned on with focus, because list would go away.
    onBlur: function () { },

    onClick: function () {

        /*
		When you click the button it adds focus, which will show the menu indefinitely.
		So we'll remove focus when the mouse leaves the button.
		Focus is needed for tab navigation.
		*/
        this.one('mouseout', this.proxy(function () {

            this.menu.unlockShowing();
            this.el.blur();
        }));
    }
});

/*
Define the base class for the share menu items
*/
_V_.ShareMenuItem = _V_.MenuItem.extend({

    init: function (player, options) {

        // Modify options for parent MenuItem class's init.
        this._super(player, options);
        this.player = player;

    },

    createElement: function (type, attrs) {
        return this._super("li", _V_.merge({
            className: "vjs-menu-item",
            innerHTML: "<img src='" + this.options.imageSrc + "' />" + "<div class='vjs-share-network'>" + this.options.label + "</div>" 
        }, attrs));
    },

    onClick: function () {
        this.player.triggerEvent('share');
        window.open(this.options.link, '', 'resizable=no,status=no,location=no,toolbar=no,menubar=no,fullscreen=no,scrollbars=no,dependent=no,width=' + this.options.popupWidth + ',height=' + this.options.popupHeight);
    },

    update: function () {

        if (this.options.label === this.player.options.currentResolution) {

            this.selected(true);

        } else {

            this.selected(false);
        }
    }
});

_V_.FacebookShareMenuItem = function(player) {
    return new _V_.ShareMenuItem(player, {
        label: 'facebook',
        link: 'http://www.facebook.com/sharer/sharer.php?u=' + window.location.href,
        imageSrc: 'http://rc-video-encoding-samples.s3.amazonaws.com/videojsPluginTests/facebook-icon-16x16.png',
        popupHeight: 200,
        popupWidth: 350
    });
};

_V_.TwitterShareMenuItem = function(player) {
    return new _V_.ShareMenuItem(player, {
        label: 'twitter',
        link: 'https://twitter.com/intent/tweet?original_referer=' + window.location.href + '&url=' + window.location.href,
        imageSrc: 'http://rc-video-encoding-samples.s3.amazonaws.com/videojsPluginTests/twitter-icon-16x16.png',
        popupHeight: 450,
        popupWidth: 550
    });
};

_V_.LinkedInShareMenuItem = function(player) {
    return new _V_.ShareMenuItem(player, {
        label: 'linkedIn',
        link: 'https://www.linkedin.com/cws/share?url=' + window.location.href,
        imageSrc: 'http://rc-video-encoding-samples.s3.amazonaws.com/videojsPluginTests/linkedin-icon-16x16.png',
        popupHeight: 300,
        popupWidth: 350
    });
};

_V_.GooglePlusShareMenuItem = function(player) {
    return new _V_.ShareMenuItem(player, {
        label: 'google+',
        link: 'https://plus.google.com/share?url=' + window.location.href,
        imageSrc: 'http://rc-video-encoding-samples.s3.amazonaws.com/videojsPluginTests/google-plus-icon-16x16.png',
        popupHeight: 300,
        popupWidth: 350
    });
};

_V_.TumblrShareMenuItem = function (player) {
    return new _V_.ShareMenuItem(player, {
        label: 'tumblr',
        link: 'http://tumblr.com/share',
        imageSrc: 'http://rc-video-encoding-samples.s3.amazonaws.com/videojsPluginTests/tumblr-icon-16x16.png',
        popupHeight: 450,
        popupWidth: 450
    });
};

jQuery(function ($) {
    var globals = {
    },
	methods = {
	    setup_video_share: function ($video) {
	            $.each(window._V_.players, function (playerName, player) {

	                if (player.techName == "html5") {
	                    _V_.merge(_V_.ControlBar.prototype.options.components, { SocialShareButton: {} });

	                    _V_.SocialShareButton.prototype.init(player);

	                    player.controlBar.addComponent(_V_.SocialShareButton.prototype);
	                };
	            });
	    }
	};

    $(document).ready(function () {
        _V_.autoSetup();
        methods.setup_video_share();
    });

});