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

function randomPatterns() {
	var offset = all_offsets[chance.integer({min: 0, max: all_offsets.length})];
	var left_pattern = new Pattern(getOffsets(0, offset, 0));
	var right_pattern = new Pattern(getOffsets(0, offset, nColumns));
	return {left: left_pattern, right: right_pattern};
	
}


$(document).ready(function(){
	patterns = randomPatterns();
	var color_map = randomColorMap();
	var left_painter = new Painter(color_map, patterns.left);
	var right_painter = new Painter(color_map, patterns.right);
	setTimeout(applyPattern, 10, 0, 100, left_painter, right_painter);
});
