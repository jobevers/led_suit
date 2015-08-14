

function RedColorMap(){};
RedColorMap.prototype = Object.create(ColorMap.prototype);
RedColorMap.prototype.color = function(i) {
	var saturation = mod(i, 10) * 10;
	return new tinycolor('hsv 0 '+ saturation  + '% 100%').toRgb();
};


function WhiteRedColorMap(){};
RedColorMap.prototype = Object.create(ColorMap.prototype);
RedColorMap.prototype.color = function(i) {
	var saturation = [0, 2, 4, 6, 8, 10, 8, 6, 4, 2][mod(i, 10)];
	saturation = saturation * 10;
	return new tinycolor('hsv 0 '+ saturation  + '% 100%').toRgb();
};


function BlackRedColorMap(){};
BlackRedColorMap.prototype = Object.create(ColorMap.prototype);
BlackRedColorMap.prototype.color = function(i) {
	var hue = wrappedRange(0, 20, 1)[mod(i, 40)];
	hue = hue * 5;
	return new tinycolor('hsv 0 100% '+ hue + '%').toRgb();
};


$(document).ready(function(){
	setTimeout(applyPattern, 1000, 0, 500, midColumnOffset, new BlackRedColorMap());
});
