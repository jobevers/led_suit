function diagonalOffset(input, is_back, row, column, i) {
	return row + column;
}


$(document).ready(function(){
	setTimeout(applyPattern, 1000, 0, 100, diagonalOffset, new ColorMap());
});
