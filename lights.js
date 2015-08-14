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


var ColorMap = function() {};


ColorMap.prototype.color = function(i) {
	var theta = mod(i, 36) * 10;
	return new tinycolor('hsv ' + theta + ' 100% 100%').toRgb();
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


function applyPattern(i, step_size, offset_fn, color_map) {
	var left_offset = getOffsets(i, offset_fn, 0);
	setLightsFromOffset(i, left_offset, color_map, left_cells);
	var right_offset = getOffsets(i, offset_fn, nColumns);
	setLightsFromOffset(i, right_offset, color_map, right_cells);
	setTimeout(applyPattern, step_size, i + 1, step_size, offset_fn, color_map);
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
