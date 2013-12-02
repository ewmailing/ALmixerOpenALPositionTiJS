var TOUCH_SCALE = 1;


(function() {
	var platino = require('co.lanica.platino');

	var MainScene = function(window, game) {
		var scene = platino.createScene();
		    game.registerForMultiTouch();
		    
		var touchableObjectsArray = [];
		var currentlyTouchedObjectsList = {};
		var audioSource = null;
		var audioListener = null;



		var onSpriteTouch = function(e) {
			Ti.API.info(e.source.name + ' fired a touch event with type: ' + e.type);
		};

		var onAudioListenerTouchStart = function(e)
		{
//			Ti.API.info(e.source.name + ' fired a touch event with type: ' + e.type);
			 //   Ti.API.info(e.type + ": " + JSON.stringify(e.points));

			audioListener.center = {x: e.x * TOUCH_SCALE, y:e.y * TOUCH_SCALE};
						audioListener.color(1.0, 0, 1.0);

		};
		
		var onAudioListenerTouchMove = function(e)
		{
//			Ti.API.info(e.source.name + ' fired a touch event with type: ' + e.type);
//			    Ti.API.info(e.type + ": " + JSON.stringify(e.points));

			audioListener.center = {x: e.x * TOUCH_SCALE, y:e.y * TOUCH_SCALE};
						audioListener.color(1.0, 1.0, 1.0);

		};
		
		var onAudioListenerTouchEnd = function(e)
		{
//			Ti.API.info(e.source.name + ' fired a touch event with type: ' + e.type);
//			    Ti.API.info(e.type + ": " + JSON.stringify(e.points));

			audioListener.center = {x: e.x * TOUCH_SCALE, y:e.y * TOUCH_SCALE};
						audioListener.color(1.0, 0.0, 0.0);

		};
		

		var onAudioSourceTouchStart = function(e)
		{
//			Ti.API.info(e.source.name + ' fired a touch event with type: ' + e.type);
			 //   Ti.API.info(e.type + ": " + JSON.stringify(e.points));

			audioSource.center = {x: e.x * TOUCH_SCALE, y:e.y * TOUCH_SCALE};
//						audioListener.color(1.0, 0, 1.0);

		};
		
		var onAudioSourceTouchMove = function(e)
		{
//			Ti.API.info(e.source.name + ' fired a touch event with type: ' + e.type);
//			    Ti.API.info(e.type + ": " + JSON.stringify(e.points));

			audioSource.center = {x: e.x * TOUCH_SCALE, y:e.y * TOUCH_SCALE};
//						audioListener.color(1.0, 1.0, 1.0);

		};
		
		var onAudioSourceTouchEnd = function(e)
		{
//			Ti.API.info(e.source.name + ' fired a touch event with type: ' + e.type);
//			    Ti.API.info(e.type + ": " + JSON.stringify(e.points));

			audioSource.center = {x: e.x * TOUCH_SCALE, y:e.y * TOUCH_SCALE};
//						audioListener.color(1.0, 0.0, 0.0);

		};
		
		var onScreenTouchStart = function(e)
		{
			var i;
			var event_data;
			var current_touched_object;

			for(i=0; i<touchableObjectsArray.length; i++)
			{
				if(touchableObjectsArray[i].contains(e.x, e.y))
				{
					event_data =
					{
						x: e.x,
						y: e.y
					};
			    		    			current_touched_object = touchableObjectsArray[i];
			    		    			Ti.API.debug("onScreenTouchStart object " + current_touched_object);
			    		    			Ti.API.debug("onScreenTouchStart object.name " + current_touched_object.name);
			    		    			Ti.API.debug("onScreenTouchStart e.type " + e.type);
					currentlyTouchedObjectsList[current_touched_object] = current_touched_object;
//					touchableObjectsArray[i].fireEvent('touchstart', event_data);
//					touchableObjectsArray[i].fireEvent('touchmove', event_data);
//					touchableObjectsArray[i].fireEvent('touchend', event_data);
					current_touched_object.fireEvent(e.type, event_data);
				}
			}
		};
		
		var onScreenTouchMove = function(e)
		{
		    			Ti.API.debug("onScreenTouchMove");
			    		    			Ti.API.debug("onScreenTouchMove e.type " + e.type);


			var key;
			var touched_object;
			var event_data;
			event_data =
			{
				x: e.x,
				y: e.y
			};
			for(key in currentlyTouchedObjectsList)
			{
			    touched_object = currentlyTouchedObjectsList[key];
			    		    			Ti.API.debug("onScreenTouchMove object " + touched_object);
			    		    			Ti.API.debug("onScreenTouchMove object.name " + touched_object.name);
			    		    			Ti.API.debug("onScreenTouchMove object.name " + currentlyTouchedObjectsList[touched_object].name);

				touched_object.fireEvent(e.type, event_data);
//								touched_object.fireEvent('touchstart', event_data);

			}
		};
		
		var onScreenTouchEnd = function(e)
		{
			var key;
			var touched_object;
			var event_data;
			event_data =
			{
				x: e.x,
				y: e.y
			};
			for(key in currentlyTouchedObjectsList)
			{
			    touched_object = currentlyTouchedObjectsList[key];
				touched_object.fireEvent(e.type, event_data);
				delete currentlyTouchedObjectsList[key];
			}
		};
		

		var onSceneActivated = function(e) {

			// ---- create sprites, add listeners, etc. ----

			Ti.API.info("MainScene has been activated.");
			
			audioSource = platino.createSprite(
            {
				width:64,
				height:64,
				x:10,
				y:100
			});
			audioSource.color(0, 0, 1.0);
			audioSource.name = 'audioSource';
			
			audioListener = platino.createSprite(
            {
				width:64,
				height:64,
				x:100,
				y:200
			});
			audioListener.color(1.0, 0, 0);
			audioListener.name = 'audioListener';


			scene.add(audioListener);
			scene.add(audioSource);

			// add touch events to sprites
			audioSource.addEventListener('touchstart', onAudioSourceTouchStart);
			audioSource.addEventListener('touchmove', onAudioSourceTouchMove);
			audioSource.addEventListener('touchend', onAudioSourceTouchEnd);
			audioListener.addEventListener('touchstart', onAudioListenerTouchStart);
			audioListener.addEventListener('touchmove', onAudioListenerTouchMove);
            audioListener.addEventListener('touchend', onAudioListenerTouchEnd);

			// add sprites to the 'touchable' array
			touchableObjectsArray.push(audioSource);
			touchableObjectsArray.push(audioListener);

			// add touch event listener to the screen (which is responsible for redistributing touches to individual sprites)
			game.addEventListener('touchstart', onScreenTouchStart);
			game.addEventListener('touchmove', onScreenTouchMove);
			game.addEventListener('touchend', onScreenTouchEnd);
		};

		var onSceneDeactivated = function(e) {

			// ---- remove sprites, listeners, etc. ----

			Ti.API.info("MainScene has been deactivated.");

			game.removeEventListener('touchstart', onScreenTouchStart);
			game.removeEventListener('touchmove', onScreenTouchMoved);
			game.removeEventListener('touchend', onScreenTouchEnd);

			if(audioSource)
			{
				scene.remove(audioSource);
				audioSource.removeEventListener('touchstart', onAudioSourceTouchStart);
				audioSource.removeEventListener('touchmove', onAudioSourceTouchMove);
				audioSource.removeEventListener('touchend', onAudioSourceTouchEnd);
				audioSource = null;
			}

			if(audioListener)
			{
				scene.remove(audioListener);
				audioListener.removeEventListener('touchstart', onAudioListenerTouchStart);
				audioListener.removeEventListener('touchmove', onAudioListenerTouchMove)
				audioListener.removeEventListener('touchend', onAudioListenerTouchEnd);
				audioListener = null
			}



			touchableObjectsArray = null;
			currentlyTouchedObjectsArray = null;


			scene.dispose();
		};

		scene.addEventListener('activated', onSceneActivated);
		scene.addEventListener('deactivated', onSceneDeactivated);
		return scene;
	};

	module.exports = MainScene;
}).call(this);
