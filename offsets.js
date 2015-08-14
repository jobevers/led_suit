function columnOffset(input, is_back, row, column, i) {
	return column;
}

function rowOffset(input, is_back, row, column, i) {
	return row;
}

function diagonalOffset(input, is_back, row, column, i) {
	return row + column;
}

function midColumnOffset(input, is_back, row, column, i) {
	return [4, 3, 2, 1, 0, 0, 1, 2, 3, 4][column];
}


function midRowOffset(input, is_back, row, column, i) {
	return [2, 1, 0, 1, 2][row];
}


function midDiagonalOffset(input, is_back, row, column, i) {
	var row_offset = midRowOffset(input, is_back, row, column, i);
	var column_offset = midColumnOffset(input, is_back, row, column, i);
	return row_offset + column_offset;
}


var all_offsets = [
	columnOffset,
	rowOffset,
	diagonalOffset,
	midColumnOffset,
	midRowOffset,
	midDiagonalOffset,
];
