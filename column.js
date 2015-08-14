function columnOffset(input, is_back, row, column, i) {
	return column;
}


$(document).ready(function(){
	setTimeout(applyPattern, 1000, 0, 100, columnOffset, new ColorMap());
});
