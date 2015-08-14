function rowOffset(input, is_back, row, column, i) {
	return row;
}


$(document).ready(function(){
	setTimeout(applyPattern, 1000, 0, 100, rowOffset, new ColorMap());
});
