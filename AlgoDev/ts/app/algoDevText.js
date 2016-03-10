"use strict";
define(['ext/canvas/drawingExt', 'ext/canvas/animationExt'], 
function (drawingExt, animationExt) {
	function algoDevText(){
		var self = this;
		
		// Properties
		self.stageObj = null;
		self.initialized = false;
		
		// Text options
		self.strokeStyleColor = new drawingExt.RgbaColor(0, 0, 0, 1);
		self.lineWidth = 1;
		self.textWidth = 0;
		self.textHeight = 0;
		self.textOrigin = new drawingExt.Point(0, 0);
			
		
		self.init = function(stageObj){
		
			self.resizeText(stageObj);
		
			self.strokeStyleColor = new drawingExt.RgbaColor(255, 0, 102, 1);
						
			self.initialized = true;
		}
		
		self.resizeText = function(stageObj){
			self.stageObj = stageObj;
			
			
		};
		
		self.animateText = function(){
			var animTextDef = new $.Deferred();
			
			/*
			$.when(animationExt.animateObjectArray(animationObjectArr, self.stageObj))
			.done(function(response){
				var ctx = self.stageObj.context;
				self.drawCloudPath();
				 $.when(self.animateCloudGradientFill())
				 .done(function(r){
					animTextDef.resolve();
					return;
				 })
				 .fail(function(r){
					animTextDef.reject();
					return;
				 });
			})
			.fail(function(response){
				animTextDef.reject();
				return 
			});
			*/
			return animTextDef.promise();
		};
	}
	return new algoDevText();
});