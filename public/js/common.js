function inArray(needle, haystack) {
  var length = haystack.length;
  for(var i = 0; i < length; i++) {
    if(typeof haystack[i] == 'object') {
      if(arrayCompare(haystack[i], needle)) return true;
    } else {
      if(haystack[i] == needle) return true;
    }
  }
  return false;
}

function isObjectExist(obj, fromObjects) {
	for (var i = 0; i < fromObjects.length; i++) {
		if (JSON.stringify(obj) === JSON.stringify(fromObjects[i])) {
			return true;
		}
	}
	return false;
}