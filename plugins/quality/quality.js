_V_.ResolutionSelector = _V_.Button.extend({
	
	kind: "quality",
	className: "vjs-quality-button",

	init: function(player, options) {
		
		this._super(player, options);
		
        player.options = player.options || {};

		// Save the starting resolution as a property of the player object
		player.options.currentResolution = this.buttonText;		
		
		this.menu = this.createMenu();
	},
	
	createMenu: function() {
		
		var menu = new _V_.Menu(this.player);
		
		// Add a title list item to the top
		menu.el.appendChild(_V_.createElement("li", {
			className: "vjs-menu-title",
			innerHTML: _V_.uc(this.kind)
		}));
		
		this.items = this.createItems();
		
		// Add menu items to the menu
		this.each(this.items, function(item){
			menu.addItem(item);
		});
		
		// Add list to element
		this.addComponent(menu);
		
		return menu;
	},
	
	// Override the default _V_.Button createElement so the button text isn't hidden
	createElement: function(type, attrs) {
		
		// Add standard Aria and Tabindex info
		attrs = _V_.merge({
			className: this.buildCSSClass(),
			innerHTML: '<div><span class="vjs-quality-text">' + this.buttonText + '</span></div>',
			role: "button",
			tabIndex: 0
		}, attrs);
		
		return this._super(type, attrs);
	},
	
	// Create a menu item for each text track
	createItems: function() {
		
		var items = [];
		
		this.each( this.availableSources, function( source ) {

			items.push( new _V_.QualityMenuItem( this.player, {

				label: source.res + 'p',
				src: source.src
			}));
		});
			
		return items;
	},
	
	buildCSSClass: function() {
		
		return this.className + " vjs-menu-button " + this._super();
	},
	
	// Focus - Add keyboard functionality to element
	onFocus: function() {
		
		// Show the menu, and keep showing when the menu items are in focus
		this.menu.lockShowing();
		this.menu.el.style.display = "block";
		
		// When tabbing through, the menu should hide when focus goes from the last menu item to the next tabbed element.
		_V_.one(this.menu.el.childNodes[this.menu.el.childNodes.length - 1], "blur", this.proxy(function() {
			
			this.menu.unlockShowing();
		}));
	},
	
	// Can't turn off list display that we turned on with focus, because list would go away.
	onBlur: function(){},
	
	onClick: function() {
		
		/*
		When you click the button it adds focus, which will show the menu indefinitely.
		So we'll remove focus when the mouse leaves the button.
		Focus is needed for tab navigation.
		*/
		this.one( 'mouseout', this.proxy(function() {
			
			this.menu.unlockShowing();
			this.el.blur();
		}));
	}
});

/*
Define the base class for the share menu items
*/
_V_.QualityMenuItem = _V_.MenuItem.extend({

	init: function(player, options){
		
		// Modify options for parent MenuItem class's init.
		options.selected = ( options.label === player.options.currentResolution );
		this._super( player, options );
		
		this.player.addEvent( 'changeres', _V_.proxy( this, this.update ) );
	},
	
	onClick: function() {
		
		// Check that we are changing to a new quality (not the one we are already on)
		if ( this.options.label === this.player.options.currentResolution )
			return;
		
		var current_time = this.player.currentTime();
		
		// Set the button text to the newly chosen quality
		jQuery( this.player.controlBar.el ).find( '.vjs-quality-text' ).html( this.options.label );


		this.player.src(this.options.src).one('loadedmetadata', function () {
		    this.currentTime(current_time);
		    this.play();
		});
		
		// Save the newly selected resolution in our player options property
		this.player.options.currentResolution = this.options.label;
		
		// Update the classes to reflect the currently selected resolution
		this.player.triggerEvent( 'changeres' );
	},
	
	update: function() {
		
		if ( this.options.label === this.player.options.currentResolution ) {
			
			this.selected( true );
			
		} else {
			
			this.selected( false );
		}
	}
});

function GetSourceResolution(source)
{
    return source["data-resolution"].match("[0-9]*");
    //return source.height;
}

jQuery(function ($) {
	// Setup some globally accessible variables
	var globals = {
	},
	methods = {
		
		/*
		Add our video quality selector button to the videojs controls. This takes
		a mandatory jQuery object of the <video> element we are setting up the
		videojs video for.
		*/
		setup_video_quality : function() {

            $.each( window._V_.players, function(playerName, player)
            {
                if (player.techName == "html5") {
                    $defaultPlayerSource = player.options.sources.phpFilter(function (value) {
                        return value.src == player.values.src
                    })[0];

                    $defaultPlayerSource.res = GetSourceResolution($defaultPlayerSource);

                    $sourcesOfSimilarType = player.options.sources.phpFilter(function (value) {
                        return value.type == $defaultPlayerSource.type
                    });

                    // Determine the available resoultions
                    $.each($sourcesOfSimilarType, function (i, source) {
                        source.res = GetSourceResolution(source);
                    });

                    // Setup the quality button for this video (using the determined default) if we have more than 1 available resolution
                    if ($sourcesOfSimilarType.length > 1) {

                        // Sort the available_res array so it is in descending order
                        $sourcesOfSimilarType.sort(function (a, b) {
                            return (parseFloat(b.res) - parseFloat(a.res));
                        });

                        _V_.ResolutionSelectorButton = _V_.ResolutionSelector.extend({
                            buttonText: $defaultPlayerSource.res + 'p',
                            availableSources: $sourcesOfSimilarType
                        });

                        _V_.merge(_V_.ControlBar.prototype.options.components, { ResolutionSelectorButton: {} });

                        _V_.ResolutionSelectorButton.prototype.init(player);

                        player.controlBar.addComponent(_V_.ResolutionSelectorButton.prototype);

                    };
                };
			});
		}
	};
	
	$(document).ready(function() {
		_V_.autoSetup();
	    methods.setup_video_quality();
	}); 	
}); 