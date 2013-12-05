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
		var sourceTrailParticles = [];
		var currentSourceTrailParticle = null;
		var listenerTrailParticles = [];
		var currentListenerTrailParticle = null;




		var onSpriteTouch = function(e)
		{
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
			if(currentListenerTrailParticle !== null)
			{
				currentListenerTrailParticle.x = audioListener.center.x;
				currentListenerTrailParticle.y = audioListener.center.y;
			}
		};
		
		var onAudioListenerTouchEnd = function(e)
		{
//			Ti.API.info(e.source.name + ' fired a touch event with type: ' + e.type);
//			    Ti.API.info(e.type + ": " + JSON.stringify(e.points));

			audioListener.center = {x: e.x * TOUCH_SCALE, y:e.y * TOUCH_SCALE};
			audioListener.color(1.0, 0.0, 0.0);
			if(currentListenerTrailParticle !== null)
			{
				currentListenerTrailParticle.x = audioListener.center.x;
				currentListenerTrailParticle.y = audioListener.center.y;
			}

		};
		

		var onAudioSourceTouchStart = function(e)
		{
//			Ti.API.info(e.source.name + ' fired a touch event with type: ' + e.type);
			 //   Ti.API.info(e.type + ": " + JSON.stringify(e.points));

			audioSource.center = {x: e.x * TOUCH_SCALE, y:e.y * TOUCH_SCALE};
//						audioListener.color(1.0, 0, 1.0);
			if(currentSourceTrailParticle !== null)
			{
				currentSourceTrailParticle.x = audioSource.center.x;
				currentSourceTrailParticle.y = audioSource.center.y;
			}
		};

		var onAudioSourceTouchMove = function(e)
		{
			//			Ti.API.info(e.source.name + ' fired a touch event with type: ' + e.type);
			//			    Ti.API.info(e.type + ": " + JSON.stringify(e.points));

			audioSource.center = {x: e.x * TOUCH_SCALE, y:e.y * TOUCH_SCALE};
//						audioListener.color(1.0, 1.0, 1.0);
			if(currentSourceTrailParticle !== null)
			{
				currentSourceTrailParticle.x = audioSource.center.x;
				currentSourceTrailParticle.y = audioSource.center.y;
			}
		};

		var onAudioSourceTouchEnd = function(e)
		{
			//			Ti.API.info(e.source.name + ' fired a touch event with type: ' + e.type);
			//			    Ti.API.info(e.type + ": " + JSON.stringify(e.points));

			audioSource.center = {x: e.x * TOUCH_SCALE, y:e.y * TOUCH_SCALE};
//						audioListener.color(1.0, 0.0, 0.0);
			if(currentSourceTrailParticle !== null)
			{
				currentSourceTrailParticle.x = audioSource.center.x;
				currentSourceTrailParticle.y = audioSource.center.y;
			}
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
		

		var onSceneActivated = function(e)
		{
			// ---- create sprites, add listeners, etc. ----
var current_particle_index = 0;
			Ti.API.info("MainScene has been activated.");
			
			audioSource = platino.createSprite(
            {
				width:48,
				height:48,
				x:100,
				y:100
			});
			audioSource.color(0, 0, 1.0);
			audioSource.name = 'audioSource';
			
			
			sourceTrailParticles[0] = platino.createParticles({image:'SourceTrail_100.lap'});
			sourceTrailParticles[1] = platino.createParticles({image:'SourceTrail_200.lap'});
			sourceTrailParticles[2] = platino.createParticles({image:'SourceTrail_300.lap'});
			sourceTrailParticles[3] = platino.createParticles({image:'SourceTrail_400.lap'});
			sourceTrailParticles[4] = platino.createParticles({image:'SourceTrail_500.lap'});
			currentSourceTrailParticle = null; // don't show anything at 0 velocity

			listenerTrailParticles[0] = platino.createParticles({image:'SourceTrail_100.lap'});
			listenerTrailParticles[1] = platino.createParticles({image:'SourceTrail_200.lap'});
			listenerTrailParticles[2] = platino.createParticles({image:'SourceTrail_300.lap'});
			listenerTrailParticles[3] = platino.createParticles({image:'SourceTrail_400.lap'});
			listenerTrailParticles[4] = platino.createParticles({image:'SourceTrail_500.lap'});
			currentListenerTrailParticle = null; // don't show anything at 0 velocity


			audioListener = platino.createSprite(
            {
				width:64,
				height:64,
				x:100,
				y:200
			});
			audioListener.color(1.0, 0, 0);
			audioListener.name = 'audioListener';

//			scene.add(source_trail);

			for(current_particle_index=0; current_particle_index<5; current_particle_index++)
			{
				scene.add(sourceTrailParticles[current_particle_index]);
				sourceTrailParticles[current_particle_index].hide();
//				sourceTrailParticles[current_particle_index].alpha = 0;
			}
			for(current_particle_index=0; current_particle_index<5; current_particle_index++)
			{
				listenerTrailParticles[current_particle_index].angle = 180.0;
				scene.add(listenerTrailParticles[current_particle_index]);
				sourceTrailParticles[current_particle_index].hide();
//				sourceTrailParticles[current_particle_index].alpha = 0;
			}

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

		var onSceneDeactivated = function(e)
		{

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
		
		
		
			
		var source_velocity_slider = Titanium.UI.createSlider({
			min:0,
			max:1.0,
			value:0.0,
			width:'80%',
			height:'auto',
			top:0,
			text:"Source Velocity"
			//   leftTrackImage:'../images/slider_orangebar.png',
			//   rightTrackImage:'../images/slider_lightbar.png',
			//   thumbImage:'../images/slider_thumb.png'
		});
		source_velocity_slider.addEventListener('change',function(e)
		{
			//	ALmixer.SetMasterVolume(e.value);
			var which_particle = null;
			var current_particle_index = 0;
			if(e.value <= 1.0/10.0)
			{
				// don't show the emitter
			}
			else if(e.value <= 3.0/10.0)
			{
				// warp 100
				which_particle = sourceTrailParticles[0];
			}
			else if(e.value <= 5.0/10.0)
			{
				// warp 200
				which_particle = sourceTrailParticles[1];
			}
				else if(e.value <= 7.0/10.0)
			{
				// warp 300
				which_particle = sourceTrailParticles[2];
			}
			else if(e.value <= 9.0/10.0)
			{
				// warp 400
				which_particle = sourceTrailParticles[3];
			}
			else
			{
				// warp 500
				which_particle = sourceTrailParticles[4];
			}

			if(which_particle !== currentSourceTrailParticle)
			{
				currentSourceTrailParticle = which_particle;

				for(current_particle_index=0; current_particle_index<5; current_particle_index++)
				{
					if(which_particle === sourceTrailParticles[current_particle_index])
					{
						//				        sourceTrailParticles[current_particle_index].alpha = 1.0;
						sourceTrailParticles[current_particle_index].show();
					}
					else
					{
	//				        sourceTrailParticles[current_particle_index].alpha = 0.0;
						sourceTrailParticles[current_particle_index].hide();
					}
					// sourceTrailParticles[current_particle_index].hide();
				}
					

				if(which_particle !== null)
				{
					// need to make sure source sprite is drawn on top of particles
					currentSourceTrailParticle.x = audioSource.center.x;
					currentSourceTrailParticle.y = audioSource.center.y;
					//    which_particle.show();
				}
			}
		});
		window.add(source_velocity_slider);

		var listener_velocity_slider = Titanium.UI.createSlider({
			min:0,
			max:1.0,
			value:0.0,
			width:'80%',
			height:'auto',
			top:280,
			text:"Listener Velocity"
			//   leftTrackImage:'../images/slider_orangebar.png',
			//   rightTrackImage:'../images/slider_lightbar.png',
			//   thumbImage:'../images/slider_thumb.png'
		});
		listener_velocity_slider.addEventListener('change',function(e)
		{
			//	ALmixer.SetMasterVolume(e.value);
			var which_particle = null;
			var current_particle_index = 0;
			if(e.value <= 1.0/10.0)
			{
				// don't show the emitter
			}
			else if(e.value <= 3.0/10.0)
			{
				// warp 100
				which_particle = listenerTrailParticles[0];
			}
			else if(e.value <= 5.0/10.0)
			{
				// warp 200
				which_particle = listenerTrailParticles[1];
			}
				else if(e.value <= 7.0/10.0)
			{
				// warp 300
				which_particle = listenerTrailParticles[2];
			}
			else if(e.value <= 9.0/10.0)
			{
				// warp 400
				which_particle = listenerTrailParticles[3];
			}
			else
			{
				// warp 500
				which_particle = listenerTrailParticles[4];
			}

			if(which_particle !== currentListenerTrailParticle)
			{
				currentListenerTrailParticle = which_particle;

				for(current_particle_index=0; current_particle_index<5; current_particle_index++)
				{
					if(which_particle === listenerTrailParticles[current_particle_index])
					{
						//				        listenerTrailParticles[current_particle_index].alpha = 1.0;
						listenerTrailParticles[current_particle_index].show();
					}
					else
					{
	//				        listenerTrailParticles[current_particle_index].alpha = 0.0;
						listenerTrailParticles[current_particle_index].hide();
					}
					// listenerTrailParticles[current_particle_index].hide();
				}
					

				if(which_particle !== null)
				{
					// need to make sure listener sprite is drawn on top of particles
					currentListenerTrailParticle.x = audioListener.center.x;
					currentListenerTrailParticle.y = audioListener.center.y;
					//    which_particle.show();
				}
			}
		});
		window.add(listener_velocity_slider);


		return scene;
	};

	module.exports = MainScene;
}).call(this);
