function AdvancedSearch() {
//	this.async = true;
//	this.endPoint = '';
//	this.method = '';
	this.field = [];
	
	//couldn't work out how to have an array of a structure within the class
	//so instead have 4 arrays that are kept synchronised
	this.filterField = [];
	this.filterComparison = [];
	this.filterValue1 = [];
	this.filterValue2 = [];
	
//	this.rf = '';
//	this.sortField = '';
//	this.sortDirection = '';
	
//	this.categoryId = '';
		
	this.addBracket = addBracket;
	this.addField = addField;
	this.addFilter = addFilter;
	this.addOperator = addOperator;
	this.sort = sort;
	
	this.getResults = getResults;
	this.reset = reset;
	
	this.reset();
}

function reset() {
	//clear everything for between searches
	this.async = true;
	this.endPoint = '';
	this.method = '';
	this.field.length = 0;
	
	this.filterField.length = 0;
	this.filterComparison.length = 0;
	this.filterValue1.length = 0;
	this.filterValue2.length = 0;
	
	this.rf = '';
	this.sortField = '';
	this.sortDirection = '';
	
	this.startRow = 0;
	this.rows = 20;
	this.categoryId = '';
	
	//working variables
	this.bracketCount = 0;
}

//properties for calling advanced search as an object
function addBracket(asBracket) {
	if ((asBracket != '(') && (asBracket != ')')) {
		alert('Bracket parameter must be either ( or )');
		return false;
	}
	
	//brackets are implemented as a filter, as needs to be in the sequence
	this.addFilter(asBracket);
	
	//keep track of bracket counts to give validation of imbalance
	if (asBracket == '(') this.bracketCount ++
	else this.bracketCount --;
}

function addOperator(asOperator) {
	if ((asOperator != 'and') && (asOperator != 'or')) {
		alert('Operator parameter must be either (and) or (or)');
		return false;
	}
	
	//operators are implemented as a filter, as needs to be in the sequence
	this.addFilter(asOperator);
}

function addField(asField) {
	//can be comma delimited list
	var aFields = asField.split(',');

	for (var i = 0; i < aFields.length; i++) this.field.push(aFields[i]);
}

function addFilter(asField, asComparison, asValue1, asValue2) {
	//Note: brackers & operators are also implemented as filters
	//to keep them in the sequence

	if (asField == undefined) asField = '';
	if (asComparison == undefined) asComparison = '';
	if (asValue1 == undefined) asValue1 = '';
	if (asValue2 == undefined) asValue2 = '';
	
	this.filterField.push(asField);
	this.filterComparison.push(asComparison);
	this.filterValue1.push(asValue1);
	this.filterValue2.push(asValue2);
}

function sort(asField, asDirection) {
	this.sortField = asField
	this.sortDirection = asDirection;
}

function getResults(aoParm1, aoParm2) {
	//first parameter is optional, and is the xml, or json string to search with (if you are not using the object)
	//second parameter is the callback function

	var sURL = '/onDemand/' + this.endPoint + '/?method=' + this.method + '&advanced=1';
	var sXML;
	var i;
	var fCallbackFunction;
	var sAjaxDataType = '';
	
	if (aoParm1 == undefined) {
		alert('You must pass at least the callback function')
		return false;
	}
	
	if (aoParm2 == undefined) {
		fCallbackFunction = aoParm1;
		sXML = '';
	}
	else {
		sXML = aoParm1;
		fCallbackFunction = aoParm2;
	}
	
	if (this.endPoint == '') {
		alert('Need to set the end point');
		return false;
	}

	if (this.method == '') {
		alert('Need to set the method');
		return false;
	}
	
	if (this.bracketCount != 0) {
		alert('Looks like you have an imbalance in your brackets.  Could be painful.');
		return false;
	}
	
	//todo if no xml - make sure they have set at least one field?
	
	if (sXML == '') sXML = BuildXMLFromObject(this)
	else {
		if (sXML.substr(0, 1) == '{') sXML = BuildXMLFromJSON(this, sXML);
	}

	if (sXML == '') return false;
	
	if (this.rf.toLowerCase() == 'xml') {
		sAjaxDataType = 'xml';
		sURL += '&rf=xml';
	}
	
	//this is dodgy - passing one of the variables via querystring, and not the xml,
	//but problem is that the category is locked in before the xml is passed
	if (this.categoryId != '') sURL += '&categoryid=' + this.categoryId;
	
	$.ajax({
		type: 'POST',
		async: this.async,
		url: sURL,
		data: sXML,
		success: function(asData) { 
				getResultsComplete(asData, fCallbackFunction)
			},		
		dataType: sAjaxDataType
	});

}

function BuildXMLFromObject(aoThis) {
	var sXML;
	
	sXML = '<advancedSearch>';
		
	for(i = 0; i < aoThis.field.length; i++) {
		sXML += 
			'<field>' + 
				'<name>' + ASXMLFormat(aoThis.field[i]) + '</name>' +
			'</field>';
	}
	
	for(i = 0; i < aoThis.filterField.length; i++) {
		sXML += 
			'<filter>' + 
				'<name>' + ASXMLFormat(aoThis.filterField[i]) + '</name>' +
				'<comparison>' + ASXMLFormat(aoThis.filterComparison[i]) + '</comparison>' +
				'<value1>' + ASXMLFormat(aoThis.filterValue1[i]) + '</value1>' +
				'<value2>' + ASXMLFormat(aoThis.filterValue2[i]) + '</value2>' +
			'</filter>';
	}

	if (aoThis.sortField != '') {
		sXML += 
			'<sort>' +
				'<name>' + ASXMLFormat(aoThis.sortField) + '</name>' +
				'<direction>' + ASXMLFormat(aoThis.sortDirection) + '</direction>' +
			'</sort>';
	}

	sXML += '<options>' + 
				'<rf>' + ASXMLFormat(aoThis.rf) + '</rf>' +
				'<startrow>' + ASXMLFormat(aoThis.startRow) + '</startrow>' +
				'<rows>' + ASXMLFormat(aoThis.rows) + '</rows>' +
			'</options>';
			
	sXML += '</advancedSearch>';

	return sXML;
}

function BuildXMLFromJSON(aoThis, asSearch) {
	//expected format is:
	//{
	//	"fields":
	//	[
	//		{
	//			"name": "sentDate"
	//		}
	//	],
	//	"filters":
	//	[
	//		{
	//			"name": "sent",
	//			"comparison": "EQUAL_TO",
	//			"value1": "N",
	//			"value2": ""
	//		}
	//	],
	//	"sort":
	//	{
	//		"name": "reference",
	//		"direction": "asc"
	//	},
	//	"options":
	//	{
	//		"rf": "XML"
	//	}
	//}
	
	var oAS;
	var i;
	
	try { 
		oAS = eval('(' + asSearch + ')');
	}
	catch (e) {
		alert('Invalid JSON passed.');
		return '';
	}
	
	//convert json into our object
	if (oAS.fields != undefined) {
		for (i = 0; i < oAS.fields.length; i++) aoThis.addField(oAS.fields[i].name);
	}
	
	if (oAS.filters != undefined) {
		for (i = 0; i < oAS.filters.length; i++) aoThis.addFilter(oAS.filters[i].name, oAS.filters[i].comparison, oAS.filters[i].value1, oAS.filters[i].value2);
	}
	
	if (oAS.sort != undefined) {
		aoThis.sort(oAS.sort.name, oAS.sort.direction);
	}
	
	if (oAS.options != undefined) {
		aoThis.rf = oAS.options.rf;
	}
	
	//then use the object -> xml code
	return BuildXMLFromObject(aoThis);
}

function ASXMLFormat(asValue) {
	var sValue;
	// should be in common library
	
	if (asValue == undefined) return '';
	
	if (typeof(asValue) == 'number') sValue = asValue.toString()
	else sValue = asValue;
	
	sValue = sValue.replace('"', '&quot');
	sValue = sValue.replace("'", '&apos');
	sValue = sValue.replace("&", '&amp');
	sValue = sValue.replace("<", '&lt');
	sValue = sValue.replace(">", '&gt');
	
	return sValue;
}

function getResultsComplete(asData, afCallbackFunction) {
	afCallbackFunction(asData);
}
