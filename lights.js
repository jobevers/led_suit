var nRows = 5;
var nColumns = 5;
var left_cells = [];
var right_cells = [];


var blue = {'r': 0, 'g': 0, 'b': 255};
var red = {'r': 255, 'g': 0, 'b': 0};
var purple = {'r': 255, 'g': 0, 'b': 255};


var Cell = function(cell) {
	this.cell = cell;
	this.pixel = cell.children('.pixel');
};


Cell.prototype.light = function(r, g, b){
	this.pixel
		.css('background-color', '')
		.css('background-color', 'rgb(' + r + ', ' + g + ', ' + b + ')');
};


var ColorMap = function(wrapped) {
	if (wrapped) {
		this.range = wrappedRange(0, 360, 10);
	} else {
		this.range = _.range(0, 360, 10);
	}
};
ColorMap.prototype.color = function(i) {
	var theta = wrappedIndex(this.range, i);
	return new tinycolor('hsv ' + theta + ' 100% 100%').toRgb();
};

function wrappedIndex(array, idx) {
	idx = mod(idx, array.length);
	return array[idx];
}

var ColorToWhiteColorMap = function(color, wrapped) {
	this.my_color = color;
	if (wrapped) {
		this.range = wrappedRange(0, 100, 10);
	} else {
		this.range = _.range(0, 100, 10);
	}
};
ColorToWhiteColorMap.prototype.color = function(i) {
	var saturation = wrappedIndex(this.range, i);
	return new tinycolor('hsv ' + this.my_color + ' ' + saturation + '% 100%').toRgb();
};

var ColorToBlackColorMap = function(color, wrapped) {
	this.my_color = color;
	if (wrapped) {
		this.range = wrappedRange(0, 100, 10);
	} else {
		this.range = _.range(0, 100, 10);
	}
};
ColorToBlackColorMap.prototype.color = function(i) {
	var value = wrappedIndex(this.range, i);
	return new tinycolor('hsv ' + this.my_color + ' 100% ' + value +'%').toRgb();
};

var ColorToComplementByHueColorMap = function(color, wrapped) {
	var complement = mod(color + 180, 360);
	var start = min(color, complement);
	var end = max(color, complement);
	var step_size = (end - start) / 10;
	if (wrapped) {
		this.range = wrappedRange(start, end, step_size);
	} else {
		this.range = _.range(start, end, step_size);
	}
};
ColorToComplementByHueColorMap.prototype.color = function(i) {
	var theta = wrappedIndex(this.range, i);
	return new tinycolor('hsv ' + theta + ' 100% 100%').toRgb();
};

var ColorToComplementBySaturationColorMap = function(color) {
	var complement = mod(color + 180, 360);
	saturation_range = _.range(100, 0, -10).concat(_.range(0, 110, 10));
	colors = Array.apply(null, Array(11)).map(Number.prototype.valueOf, color);
	colors = colors.concat(Array.apply(null, Array(10)).map(Number.prototype.valueOf, complement));
	range = _.zip(colors, saturation_range);
	// need the slice so that it does not repeat the two endpoints
	this.range = range.concat(range.slice(1, -1).reverse());
};


ColorToComplementBySaturationColorMap.prototype.color = function(i) {
	var element = wrappedIndex(this.range, i);
	return new tinycolor('hsv ' + element[0] + ' '+ element[1] + '% 100%').toRgb();
};




/* There are a few different colors maps I can think of going with
 # - All of these can be:
 *   - in a loop
 *   - in a sawtooth
 * - The full HSV color map with theta varying
 * - Interpolate between a color and black
 * - Interpolate between a color and white
 * - Interpolate between two colors
 *   - by changing theta
 *   - by changing saturation
 *   - by changing value
*/


var Pattern = function(offsets){
	this.my_offsets = offsets;
};

Pattern.prototype.offsets = function(input, msg){
	return this.my_offsets;
};


var Painter = function(color_map, pattern) {
	this.color_map = color_map;
	this.pattern = pattern;
};


Painter.prototype.paint = function(input){
	var me = this;
	var colors = _.map(
		this.pattern.offsets(input), function(offset) {
			return me.color_map.color(offset - input);
		});
	return colors;
};



function setLights(cells, rgb_values){
	_.each(_.zip(cells, rgb_values), function(element) {
		var cell = element[0], rgb_value = element[1];
		if (cell && rgb_value) {
			cell.light(rgb_value.r, rgb_value.g, rgb_value.b);
		}
	});
}


function mod(n, base) {
	return ((n % base) + base) % base;
}




function drawPattern(i) {
	var row = i % nRows;
	var colors = _.map(_.range(nRows*nColumns), function(i) {
		var myRow = Math.trunc(i / nRows);
		if (myRow == row) {
			return red;
		} else {
			return blue;
		}
	});
	setLights(colors);
	setTimeout(drawPattern, 1000, i + 1);
}


function createTable(clss, parent, cells) {
	for (var i = 0; i < nRows; i++) {
		var row = $('<tr id="row' + i + '">');
		parent.append(row);
		for (var j=0; j<nColumns; j++) {
			var cell = $('<td id="cell' + i + j + '" />');
			cell.append('<div class="pixel"></div>');
			row.append(cell);
			cell.addClass(clss);
			cell = new Cell(cell);
			cells.push(cell);
		}
	}
}

function createOutfit(clss, parent, cells) {
	var front = $('<div class="front"></div>');
	var back = $('<div class="back"></div>');
	parent.append(front);
	parent.append('<hr/>');
	parent.append(back);
	createTable(clss, front, cells);
	createTable(clss, back, cells);
}


function getOffsets(input, fn, start_column) {
	var offsets = [];
	var i = 0;
	for (back=0; back<2; back++) {
		for (row=0; row<nRows; row++) {
			// For the suits, the starting and ending column will be
			// a compile-time variable
			for (column=start_column; column<start_column + nColumns; column++) {
				offsets.push(fn(input, back, row, column, i));
				i++;
			}
		}
	}
	return offsets;
}


function applyPattern(i, step_size, left_painter, right_painter) {
	setLights(left_cells, left_painter.paint(i));
	setLights(right_cells, right_painter.paint(i));
	setTimeout(applyPattern, step_size, i + 1, step_size, left_painter, right_painter);
}


function setLightsFromOffset(input, offsets, color_map, cells) {
	var colors = _.map(offsets, function(offset) {
		return color_map.color(offset - input);
	});
	setLights(cells, colors);
}


function wrappedRange(start, stop, step) {
	return _.range(start, stop, step).concat(_.range(stop, start, -step));
}


$( document ).ready(function() {
	createOutfit('left', $("#left-leds"), left_cells);
	createOutfit('right', $("#right-leds"), right_cells);

	_.each(left_cells, function(cell) {
		cell.light(20, 40, 60);
	});

	_.each(right_cells, function(cell) {
		cell.light(30, 60, 40);
	});
});
