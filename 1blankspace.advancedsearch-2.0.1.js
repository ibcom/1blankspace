/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
if (ns1blankspace === undefined) {ns1blankspace = {}}
if (ns1blankspace.data === undefined) {ns1blankspace.data = {}}

ns1blankspace.data.searchComparison =
		[ 
			{title: "None", code: "", dataType: "all", inputCount: 0},
			{title: "Equal to", code: "EQUAL_TO", dataType: "all", inputCount: 1},
			{title: "Not equal to", code: "NOT_EQUAL_TO", dataType: "all", inputCount: 1},
			{title: "Greater than", code: "GREATER_THAN", dataType: "all", inputCount: 1},
			{title: "Greater than or equal to", code: "GREATER_THAN_OR_EQUAL_TO", dataType: "all", inputCount: 1},
			{title: "Less than", code: "LESS_THAN", dataType: "all", inputCount: 1},
			{title: "Less than or equal to", code: "LESS_THAN_OR_EQUAL_TO", dataType: "all", inputCount: 1},
			{title: "Is in list", code: "IN_LIST", dataType: "all", inputCount: 1},
			{title: "Not in list", code: "NOT_IN_LIST", dataType: "all", inputCount: 1},
			{title: "Never set", code: "IS_NULL", dataType: "all", inputCount: 0},
			{title: "Has been set", code: "IS_NOT_NULL", dataType: "all", inputCount: 0},
			{title: "Approximately equal to", code: "APPROX_EQUAL_TO", dataType: "all", inputCount: 1},
			{title: "Contains", code: "TEXT_IS_LIKE", dataType: "text", inputCount: 1},
			{title: "Noes Not Contain", code: "TEXT_IS_NOT_LIKE", dataType: "text", inputCount: 1},
			{title: "Starts with", code: "TEXT_STARTS_WITH", dataType: "text", inputCount: 1},
			{title: "Is empty", code: "TEXT_IS_EMPTY", dataType: "text", inputCount: 0},
			{title: "Is not empty", code: "TEXT_IS_NOT_EMPTY", dataType: "text", inputCount: 0},
			{title: "Today", code: "TODAY", dataType: "date", inputCount: 0},
			{title: "Yesterday", code: "YESTERDAY", dataType: "date", inputCount: 0},
			{title: "Between", code: "BETWEEN", dataType: "date", inputCount: 2},
			{title: "Week to date", code: "WEEK_TO_DATE", dataType: "date", inputCount: 0},
			{title: "Month to date", code: "MONTH_TO_DATE", dataType: "date", inputCount: 0},
			{title: "Calendar year to date", code: "CALENDAR_YEAR_TO_DATE", dataType: "date", inputCount: 0},
			{title: "Calendar last week", code: "CALENDAR_LAST_WEEK", dataType: "date", inputCount: 0},
			{title: "Calendar next week", code: "CALENDAR_NEXT_WEEK", dataType: "date", inputCount: 0},
			{title: "Calendar last month", code: "CALENDAR_LAST_MONTH", dataType: "date", inputCount: 0},
			{title: "Calendar next month", code: "CALENDAR_NEXT_MONTH", dataType: "date", inputCount: 0},
			{title: "Calendar last year", code: "CALENDAR_LAST_YEAR", dataType: "date", inputCount: 0},
			{title: "Calendar next year", code: "CALENDAR_NEXT_YEAR", dataType: "date", inputCount: 0},
			{title: "End of last month", code: "END_OF_LAST_MONTH", dataType: "date", inputCount: 0},
			{title: "End of next month", code: "END_OF_NEXT_MONTH", dataType: "date", inputCount: 0},
			{title: "Last 52 weeks", code: "LAST_52_WEEKS", dataType: "date", inputCount: 0},
			{title: "In month", code: "IN_MONTH", dataType: "date", inputCount: 1},
			{title: "On day and month", code: "ON_DAY_MONTH", dataType: "date", inputCount: 1},
			{title: "This month", code: "THIS_MONTH", dataType: "date", inputCount: 0},
			{title: "Next month", code: "NEXT_MONTH", dataType: "date", inputCount: 0},
			{title: "Aged 30 days", code: "AGED_THIRTY", dataType: "date", inputCount: 0},
			{title: "Aged 60 days", code: "AGED_SIXTY", dataType: "date", inputCount: 0},
			{title: "Aged 90 days", code: "AGED_NINETY", dataType: "date", inputCount: 0},
			{title: "Aged 90+ days", code: "AGED_NINETY_PLUS", dataType: "date", inputCount: 0},
			{title: "Last financial quarter", code: "LAST_FINANCIAL_QUARTER", dataType: "date", inputCount: 0}
		];

function AdvancedSearch() {
//	this.async = true;
//	this.endPoint = '';
//	this.method = '';
	this.field = [];
	this.summaryField = [];
	
	//couldn't work out how to have an array of a structure within the class
	//so instead have 4 arrays that are kept synchronised
	this.filterField = [];
	this.filterComparison = [];
	this.filterValue1 = [];
	this.filterValue2 = [];
	this.filterValue3 = [];
	this.filterApplyToSubSearchJoin = [];
	
	this.customOptionName = [];
	this.customOptionValue = [];
	
//	this.rf = '';
	this.sortField = [];
	this.sortDirection = [];
	
//	this.categoryId = '';
//	this.returnParameters = '';		
		
	this.addBracket = addBracket;
	this.addField = addField;
	this.addSummaryField = addSummaryField;
	this.addFilter = addFilter;
	this.addOperator = addOperator;
	this.addCustomOption = addCustomOption;
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
	this.summaryField.length = 0;
	
	this.filterField.length = 0;
	this.filterComparison.length = 0;
	this.filterValue1.length = 0;
	this.filterValue2.length = 0;
	this.filterValue3.length = 0;
	this.filterApplyToSubSearchJoin.length = 0;
		
	this.customOptionName.length = 0;
	this.customOptionValue.length = 0;
	
	this.rf = '';
	this.sortField.length = 0;
	this.sortDirection.length = 0;
	
	this.startRow = 0;
	this.rows = 20;
	this.categoryId = '';
	this.returnParameters = '';
	
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

function addSummaryField(asField) {
	//can be comma delimited list
	var aFields = asField.split(',');

	for (var i = 0; i < aFields.length; i++) this.summaryField.push(aFields[i]);
}

function addFilter(asField, asComparison, asValue1, asValue2, asValue3, asApplyToSubSearchJoin) {
	//Note: brackets & operators are also implemented as filters
	//to keep them in the sequence

	if (asField == undefined) asField = '';
	if (asComparison == undefined) asComparison = '';
	if (asValue1 == undefined) asValue1 = '';
	if (asValue2 == undefined) asValue2 = '';
	if (asValue3 == undefined) asValue3 = '';
	if (asApplyToSubSearchJoin == undefined) asApplyToSubSearchJoin = '';
	
	this.filterField.push(asField);
	this.filterComparison.push(asComparison);
	this.filterValue1.push(asValue1);
	this.filterValue2.push(asValue2);
	this.filterValue3.push(asValue3);
	this.filterApplyToSubSearchJoin.push(asApplyToSubSearchJoin);
}

function sort(asField, asDirection) {
	this.sortField.push(asField);
	this.sortDirection.push(asDirection);
}

function addCustomOption(asName, asValue) {
	if (asName == undefined) asName = '';
	if (asValue == undefined) asValue = '';

	this.customOptionName.push(asName);
	this.customOptionValue.push(asValue);
}

function getResults(aoParm1, aoParm2) {
	//first parameter is optional, and is the xml, or json string to search with (if you are not using the object)
	//second parameter is the callback function

	var sEndpoint = this.endPoint;
	if (sEndpoint == '')
	{
		var sMethod = this.method
		aMethod = sMethod.split('_');
		sEndpoint = aMethod[0];
	}
	
	var sURL = '/rpc/' + sEndpoint.toLowerCase() + '/?method=' + this.method + '&advanced=1';
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
	
	if (sEndpoint == '') {
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
	if (this.rf.toLowerCase() == 'json') {
		sAjaxDataType = 'json';
		sURL += '&rf=json';
	}	
	//this is dodgy - passing one of the variables via querystring, and not the xml,
	//but problem is that the category is locked in before the xml is passed
	if (this.categoryId != '') sURL += '&categoryid=' + this.categoryId;
	
	//contentType: 'text/xml',
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
	
	for(i = 0; i < aoThis.summaryField.length; i++) {
		sXML += 
			'<summaryField>' + 
				'<name>' + ASXMLFormat(aoThis.summaryField[i]) + '</name>' +
			'</summaryField>';
	}

	for(i = 0; i < aoThis.filterField.length; i++) {
		sXML += 
			'<filter>' + 
				'<name>' + ASXMLFormat(aoThis.filterField[i]) + '</name>' +
				'<comparison>' + ASXMLFormat(aoThis.filterComparison[i]) + '</comparison>' +
				'<value1>' + ASXMLFormat(aoThis.filterValue1[i]) + '</value1>' +
				'<value2>' + ASXMLFormat(aoThis.filterValue2[i]) + '</value2>' +
				'<value3>' + ASXMLFormat(aoThis.filterValue3[i]) + '</value3>' +
				'<ApplyToSubSearchJoin>' + ASXMLFormat(aoThis.filterApplyToSubSearchJoin[i]) + '</ApplyToSubSearchJoin>' +
			'</filter>';
	}

	for(i = 0; i < aoThis.sortField.length; i++) {
		sXML += 
			'<sort>' +
				'<name>' + ASXMLFormat(aoThis.sortField[i]) + '</name>' +
				'<direction>' + ASXMLFormat(aoThis.sortDirection[i]) + '</direction>' +
			'</sort>';
	}

	sXML += '<options>' + 
				'<rf>' + ASXMLFormat(aoThis.rf) + '</rf>' +
				'<startrow>' + ASXMLFormat(aoThis.startRow) + '</startrow>' +
				'<rows>' + ASXMLFormat(aoThis.rows) + '</rows>' +
				'<returnparameters>' + aoThis.returnParameters + '</returnparameters>' +
			'</options>';
			
	for(i = 0; i < aoThis.customOptionName.length; i++) {
		sXML += 
			'<customOption>' + 
				'<name>' + ASXMLFormat(aoThis.customOptionName[i]) + '</name>' +
				'<value>' + ASXMLFormat(aoThis.customOptionValue[i]) + '</value>' +
			'</customOption>';
	}
			
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
	//	"summaryFields":
	//	[
	//		{
	//			"name": "count(*) actioncount"
	//		}
	//	],
	//	"filters":
	//	[
	//		{
	//			"name": "sent",
	//			"comparison": "EQUAL_TO",
	//			"value1": "N",
	//			"value2": "",
	//			"value3": "",
	//			"ApplyToSubSearchJoin": ""
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
	
	if (oAS.summaryFields != undefined) {
		for (i = 0; i < oAS.summaryFields.length; i++) aoThis.addSummaryField(oAS.summaryFields[i].name);
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
	
	sValue = sValue.replace("&", '&amp;');	//needs to be first
	sValue = sValue.replace('"', '&quot;');
	sValue = sValue.replace("'", '&apos;');
	sValue = sValue.replace("<", '&lt;');
	sValue = sValue.replace(">", '&gt;');
	
	return sValue;
}

function getResultsComplete(asData, afCallbackFunction) {
	afCallbackFunction(asData);
}

function advancedSearchComparisonGet(oParam)
{
	var aReturn = [];
	var sReturnFormat = 'JSON';
	var sDataType = '';
	var bIncludeAll = true
	var sInputType = '';
	var sCode = '';
	
	if (oParam != undefined)
	{
		if (oParam.returnFormat != undefined) {sReturnFormat = oParam.returnFormat}
		if (oParam.dataType != undefined) {sDataType = oParam.dataType}
		if (oParam.inputType != undefined) {sInputType = oParam.inputType}
		if (oParam.includeAll != undefined) {bIncludeAll = oParam.includeAll}
		if (oParam.code != undefined) {sCode = oParam.code}
	}
	
	sReturnFormat = sReturnFormat.toUpperCase();
		
	$.each(ns1blankspace.data.searchComparison, function()
	{
		if (this.dataType == sDataType || (bIncludeAll && this.dataType == 'all') || (sCode == this.code))
		{
			if (sReturnFormat == 'JSON')
			{
				this.dataType = sDataType;
				aReturn.push(this)
			}
			
			if (sReturnFormat == 'XHTML')
			{
				aReturn.push('<tr><td style="cursor: pointer;" id="tdInterfaceReportComparison_' + this.code + '"' +
									' data-code="' + this.code + '"' +
									' data-dataType="' + sDataType + '"' +
									' data-inputType="' + sInputType + '"' +
									' data-inputCount="' + this.inputCount + '"' +
									' class="interfaceMainReportComparisonType">' +
									this.title + '</td></tr>');
			}
			
			if (sReturnFormat == 'TITLE')
			{
				aReturn.push(this.title);
			}
			
		}
		
	});

	return aReturn
}
