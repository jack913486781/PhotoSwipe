// PhotoSwipe - http://www.photoswipe.com/
// Copyright (c) 2011 by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license

(function(Util, CaptionClass, ToolbarClass){

	/*
	 * Class: Code.PhotoSwipe.CaptionToolbarClass
	 */
	Code.PhotoSwipe.CaptionToolbarClass = Code.PhotoSwipe.EventClass.extend({
		
		toolbar: null,
		caption: null,
		
		isHidden: null,
		isFading: null,
		
		hasAddedEventListeners: null,
		
		toolbarClickEventHandler: null,
	
		
		/*
		 * Function: init
		 */
		init: function(options){
			
			this._super();
			
			this.settings = {
				opacity: 0.8,
				fadeInSpeed: 250,
				fadeOutSpeed: 500,
				autoHideDelay: 5000,
				flipPosition: false,
				showEmptyCaptions: true
			};
			
			Util.extend(this.settings, options);
			
			this.isHidden = true;
			this.isFading = false;
			this.hasAddedEventListeners = false;
			
			this.toolbarClickEventHandler = this.onToolbarClick.bind(this);
			
			this.caption = new CaptionClass({
				fadeInSpeed: this.settings.fadeInSpeed,
				fadeOutSpeed: this.settings.fadeOutSpeed,
				opacity: this.settings.opacity,
				position: (this.settings.flipPosition) ? 'bottom' : 'top'
			});
			
			
			this.toolbar = new ToolbarClass({
				fadeInSpeed: this.settings.fadeInSpeed,
				fadeOutSpeed: this.settings.fadeOutSpeed,
				opacity: this.settings.opacity,
				position: (this.settings.flipPosition) ? 'top' : 'bottom'
			});
						
		},
		
		
		
		/*
		 * Function: resetPosition
		 */
		resetPosition: function(){
			
			this.caption.resetPosition();
			this.toolbar.resetPosition();
			
		},
		
		
		
		/*
		 * Function: addEventListeners
		 */
		addEventListeners: function(){
			
			if (this.hasAddedEventListeners){
				return;
			}
			
			this.toolbar.addEventListener(ToolbarClass.EventTypes.onClick, this.toolbarClickEventHandler);
			
			this.hasAddedEventListeners = true;
		
		},
		
		
		
		/*
		 * Function: removeEventListeners
		 */
		removeEventListeners: function(){
			
			this.toolbar.removeEventListener(ToolbarClass.EventTypes.onClick, this.toolbarClickEventHandler);
			this.hasAddedEventListeners = false;
		
		},
		
		
		
		/*
		 * Function: fadeIn 
		 */
		fadeIn: function(){
			
			this.stopAutoHideTimeout();
			this.stopFade();
			
			if (this.isHidden){
				
				this.isHidden = false;
				this.isFading = true;
				
				// Already hidden so fade in
				this.fadeInCaption();
			
				this.toolbar.fadeIn();
							
				window.setTimeout(
					this.onFadeIn.bind(this),
					this.settings.fadeInSpeed
				);
				
			}
			else{
				
				// Not hidden, just check caption is visible
				if (this.caption.isHidden){
					this.fadeInCaption();
				}
				
				// Reset the autoHideTimeout
				this.resetAutoHideTimeout();
				
			}
		
		},
		
		
		
		/*
		 * Function: fadeInCaption
		 */
		fadeInCaption: function(){
			
			if (this.caption.captionValue === ''){
				// Caption is empty
				if (this.settings.showEmptyCaptions){
					this.caption.fadeIn();
				}
			}
			else{
				this.caption.fadeIn();
			}
			
		},
		
		
		
		/*
		 * Function: onFadeIn
		 */
		onFadeIn: function(){
			
			this.addEventListeners();
			
			this.isFading = false;
			this.resetAutoHideTimeout();
			
		},
		
		
		
		/*
		 * Function: fadeOut
		 */
		fadeOut: function(){
			
			this.stopAutoHideTimeout();
			this.stopFade();
			
			this.isHidden = true;
			this.isFading = true;
			
			this.caption.fadeOut();
			this.toolbar.fadeOut();
			
			window.setTimeout(
				this.onFadeOut.bind(this),
				this.settings.fadeOutSpeed
			);
		
		},
		
		
		/*
		 * Function: onFadeOut
		 */
		onFadeOut: function(){
			this.isFading = false;
		},
		
		
		
		/*
		 * Function: stopFade
		 */
		stopFade: function(){
			
			this.caption.stopFade();
			this.toolbar.stopFade();
			
		},
		
		
		/*
		 * Function: hide
		 */
		hide: function(){
			
			this.stopAutoHideTimeout();
			this.stopFade();
			
			this.isHidden = true;
			this.removeEventListeners();
			
			this.caption.hide();
			this.toolbar.hide();
		
		},
		
		
		
		/*
		 * Function: setCaptionValue
		 */
		setCaptionValue: function(captionValue){
			
			this.caption.setCaptionValue(captionValue);
			
			if (this.caption.captionValue === '' && !this.settings.showEmptyCaptions){
				// The caption is empty and we don't want to show empty caption
				this.caption.fadeOut();
			}
			
		
		},
		
		
		
		/*
		 * Function: resetAutoHideTimeout
		 */
		resetAutoHideTimeout: function(){
			
			if (this.isHidden){
				return;
			}
			
			this.stopAutoHideTimeout();
			
			if (this.settings.autoHideDelay > 0){
				
				this.autoHideTimeout = window.setTimeout(
					this.fadeOut.bind(this),
					this.settings.autoHideDelay
				);
				
			}
		
		},
		
		
		
		/*
		 * Function: stopAutoHideTimeout
		 */
		stopAutoHideTimeout: function(){
			
			window.clearTimeout(this.autoHideTimeout);
			
		},
		
		
		
		/*
		 * Function: onToolbarClick
		 */
		onToolbarClick: function(e){
			
			this.dispatchEvent({ 
				type: Code.PhotoSwipe.ToolbarClass.EventTypes.onClick, 
				target: this, 
				action: e.action 
			});
			
		},
		
		
		
		/*
		 * Function: setNextState
		 */
		setNextState: function (disable) {
			
			this.toolbar.setNextState(disable);
			
		},
		
		
		
		/*
		 * Function: setPreviousState
		 */
		setPreviousState: function (disable) {
			
			this.toolbar.setPreviousState(disable);
			
		}
		
		
	});


})(Code.PhotoSwipe.Util, Code.PhotoSwipe.CaptionClass, Code.PhotoSwipe.ToolbarClass);