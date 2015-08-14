function columnOffset(input, is_back, row, column, i) {
	return column;
}


function randomColorMap() {
	var f = chance.floating({min:0, max:1});
	console.log(f);
	if (f < .2) {
		return new ColorMap(chance.bool());
	} else if (f < .4) {
		return new ColorToWhiteColorMap(chance.integer({min: 0, max: 359}), chance.bool());
	} else if (f < .6) {
		return new ColorToBlackColorMap(chance.integer({min: 0, max: 359}), chance.bool());
	} else {
		return new ColorToComplementBySaturationColorMap(chance.integer({min: 0, max: 359}));
	}
}


$(document).ready(function(){
	var left_pattern = new Pattern(getOffsets(0, columnOffset, 0));
	var right_pattern = new Pattern(getOffsets(0, columnOffset, nColumns));
	var color_map = randomColorMap();
	var left_painter = new Painter(color_map, left_pattern);
	var right_painter = new Painter(color_map, right_pattern);
	setTimeout(applyPattern, 10, 0, 100, left_painter, right_painter);
});
