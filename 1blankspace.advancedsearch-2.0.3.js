/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 */
 
if (ns1blankspace === undefined) {var ns1blankspace = {}}
if (ns1blankspace.advancedSearch === undefined) {ns1blankspace.advancedSearch = {data: {}, criteria: {}}}

function AdvancedSearch()
{
	this.criteria = {};
	this.criteria.field = [];
	this.criteria.summaryField = [];
	
	this.criteria.filterField = [];
	this.criteria.filterComparison = [];
	this.criteria.filterValue1 = [];
	this.criteria.filterValue2 = [];
	this.criteria.filterValue3 = [];
	this.criteria.filterApplyToSubSearchJoin = [];
	
	this.criteria.customOptionName = [];
	this.criteria.customOptionValue = [];
	
	this.criteria.sortField = [];
	this.criteria.sortDirection = [];
		
	this.sort = ns1blankspace.advancedSearch.sort;
	this.headers = {};
			
	this.addBracket = ns1blankspace.advancedSearch.addBracket;
	this.addField = ns1blankspace.advancedSearch.addField;
	this.addSummaryField = ns1blankspace.advancedSearch.addSummaryField;
	this.addFilter = ns1blankspace.advancedSearch.addFilter;
	this.addOperator = ns1blankspace.advancedSearch.addOperator;
	this.addCustomOption = ns1blankspace.advancedSearch.addCustomOption;
	
	this.getResults = ns1blankspace.advancedSearch.getResults;
	this.send = ns1blankspace.advancedSearch.getResults;
	this.reset = ns1blankspace.advancedSearch.reset;
	
	this.reset();
}

ns1blankspace.advancedSearch.reset = function ()
{
	this.async = true;
	this.endPoint = '';
	this.method = '';
	this.categoryId = '';
	this.bracketCount = 0;

	this.criteria.field.length = 0;
	this.criteria.summaryField.length = 0;
	
	this.criteria.filterField.length = 0;
	this.criteria.filterComparison.length = 0;
	this.criteria.filterValue1.length = 0;
	this.criteria.filterValue2.length = 0;
	this.criteria.filterValue3.length = 0;
	this.criteria.filterApplyToSubSearchJoin.length = 0;
		
	this.criteria.customOptionName.length = 0;
	this.criteria.customOptionValue.length = 0;
	
	this.criteria.sortField.length = 0;
	this.criteria.sortDirection.length = 0;
	
	this.rf = 'json';
	this.startRow = 0;
	this.rows = 20;
	this.headers = {}
	
	this.returnParameters = '';
}

ns1blankspace.advancedSearch.addBracket = function (asBracket)
{
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

ns1blankspace.advancedSearch.addOperator = function (asOperator)
{
	if ((asOperator != 'and') && (asOperator != 'or')) {
		alert('Operator parameter must be either (and) or (or)');
		return false;
	}
	
	//operators are implemented as a filter, as needs to be in the sequence
	this.addFilter(asOperator);
}

ns1blankspace.advancedSearch.addField = function (asField)
{
	//can be comma delimited list

	if (asField.length > 0)
	{	
		var aFields = asField.split(',');

		for (var i = 0; i < aFields.length; i++) this.criteria.field.push(aFields[i]);
	}		
}

ns1blankspace.advancedSearch.addSummaryField = function (asField)
{
	//can be comma delimited list
	var aFields = asField.split(',');

	for (var i = 0; i < aFields.length; i++) this.criteria.summaryField.push(aFields[i]);
}

ns1blankspace.advancedSearch.addFilter = function (asField, asComparison, asValue1, asValue2, asValue3, asApplyToSubSearchJoin)
{
	//Note: brackets & operators are also implemented as filters
	//to keep them in the sequence

	if (asField == undefined) {asField = ''};
	if (asComparison == undefined) {asComparison = ''};
	if (asValue1 == undefined) {asValue1 = ''};
	if (asValue2 == undefined) {asValue2 = ''};
	if (asValue3 == undefined) {asValue3 = ''};
	if (asApplyToSubSearchJoin == undefined) {asApplyToSubSearchJoin = ''};
	
	this.criteria.filterField.push(asField);
	this.criteria.filterComparison.push(asComparison);
	this.criteria.filterValue1.push(asValue1);
	this.criteria.filterValue2.push(asValue2);
	this.criteria.filterValue3.push(asValue3);
	this.criteria.filterApplyToSubSearchJoin.push(asApplyToSubSearchJoin);
}

ns1blankspace.advancedSearch.sort = function (asField, asDirection)
{
	this.criteria.sortField.push(asField);
	this.criteria.sortDirection.push(asDirection);
}

ns1blankspace.advancedSearch.addCustomOption = function (asName, asValue)
{
	if (asName == undefined) asName = '';
	if (asValue == undefined) asValue = '';

	this.criteria.customOptionName.push(asName);
	this.criteria.customOptionValue.push(asValue);
}

ns1blankspace.advancedSearch.buildCriteria = function (oSearch)
{
	var oCriteria = oSearch.criteria;

	var oData =
	{
		fields: [],
		summaryFields: [],
		filters: [],
		sorts: [],
		customoptions: [],
		options: {"rf": 'json'}
	};

	$.each(oCriteria.field, function(i, v)
	{
		oData.fields.push({name: v});
	});

	$.each(oCriteria.summaryField, function(i, v)
	{
		oData.summaryFields.push({name: v});
	});

	$.each(oCriteria.filterField, function(i, v)
	{
		oData.filters.push(
		{
			name: v,
			comparison: oCriteria.filterComparison[i],
			value1: oCriteria.filterValue1[i],
			value2: oCriteria.filterValue2[i],
			value3: oCriteria.filterValue3[i],
			ApplyToSubSearchJoin: oCriteria.filterApplyToSubSearchJoin[i]
		});
	});

	$.each(oCriteria.sortField, function(i, v)
	{
		oData.sorts.push(
		{
			name: v,
			direction: oCriteria.sortDirection[i]
		});
	});

	$.each(oCriteria.customOptionName, function(i, v)
	{
		oData.customoptions.push(
		{
			name: v,
			value: oCriteria.customOptionValue[i]
		});
	});

	oData.options =
	{
		rf: oSearch.rf,
		startrow: oSearch.startrow,
		rows: oSearch.rows,
		returnparameters: oSearch.returnParameters
	}
	
	var sCriteria = JSON.stringify(oData);

	return sCriteria;
}

ns1blankspace.advancedSearch.getResults = function (aoParm1, aoParm2)
{
	var sEndpoint = this.endPoint;

	if (sEndpoint == '')
	{
		var sMethod = this.method
		aMethod = sMethod.split('_');
		sEndpoint = aMethod[0];
	}
	
	var sURL = '/rpc/' + sEndpoint.toLowerCase() + '/?method=' + this.method + '&advanced=1';
	var sCriteria;
	var i;
	var fCallbackFunction;
	var sAjaxDataType = '';
	
	if (aoParm1 == undefined)
	{
		alert('You must pass at least the callback function')
		return false;
	}
	
	if (aoParm2 == undefined)
	{
		fCallbackFunction = aoParm1;
		sCriteria = '';
	}
	else
	{
		sCriteria = aoParm1;
		fCallbackFunction = aoParm2;
	}
	
	if (sEndpoint == '')
	{
		alert('Need to set the end point');
		return false;
	}

	if (this.method == '')
	{
		alert('Need to set the method');
		return false;
	}
	
	if (this.bracketCount != 0)
	{
		alert('Looks like you have an imbalance in your brackets.  Could be painful.');
		return false;
	}
	
	if (sCriteria == '')
	{
		sCriteria = ns1blankspace.advancedSearch.buildCriteria(this)
	}	
	
	if (sCriteria == '') return false;
	
	if (this.rf.toLowerCase() == 'xml')
	{
		sAjaxDataType = 'xml';
		sURL += '&rf=xml';
	}

	if (this.rf.toLowerCase() == 'json')
	{
		sAjaxDataType = 'json';
		sURL += '&rf=json';
	}	

	if (this.categoryId != '') {sURL += '&categoryid=' + this.categoryId;}

	if (ns1blankspace !== undefined)
	{
		if (ns1blankspace.user !== undefined)
		{
			if (ns1blankspace.user.site !== undefined && sEndpoint.toLowerCase() == 'site')
			{
				sURL += '&site=' + ns1blankspace.user.site;
			}	
		}	
	}
	
	if (ns1blankspace.debug != undefined)
	{	
		ns1blankspace.debug.message(sCriteria);
	}
	
	$.ajax(
	{
		type: 'POST',
		async: this.async,
		url: sURL,
		data: sCriteria,
		global: true,
		success: function(asData)
		{ 
			fCallbackFunction(asData)
		},		
		dataType: sAjaxDataType,
		headers: this.headers,
	});
}

ns1blankspace.advancedSearch.data.searchComparison =
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
	{title: "Does Not Contain", code: "TEXT_IS_NOT_LIKE", dataType: "text", inputCount: 1},
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


ns1blankspace.advancedSearch.comparisonGet = function (oParam)
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
		
	$.each(ns1blankspace.advancedSearch.data.searchComparison, function()
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

ns1blankspace.advancedSearch.buildXMLFromObject = function (aoThis)
{
	var sXML;
	
	sXML = '<advancedSearch>';
		
	for (i = 0; i < aoThis.criteria.field.length; i++)
	{
		sXML += 
			'<field>' + 
				'<name>' + ns1blankspace.advancedSearch.asXMLFormat(aoThis.criteria.field[i]) + '</name>' +
			'</field>';
	}
	
	for(i = 0; i < aoThis.criteria.summaryField.length; i++) {
		sXML += 
			'<summaryField>' + 
				'<name>' + s1blankspace.advancedSearch.asXMLFormat(aoThis.criteria.summaryField[i]) + '</name>' +
			'</summaryField>';
	}

	for(i = 0; i < aoThis.criteria.filterField.length; i++)
	{
		sXML += 
			'<filter>' + 
				'<name>' + ns1blankspace.advancedSearch.asXMLFormat(aoThis.criteria.filterField[i]) + '</name>' +
				'<comparison>' + ns1blankspace.advancedSearch.asXMLFormat(aoThis.criteria.filterComparison[i]) + '</comparison>' +
				'<value1>' + ns1blankspace.advancedSearch.asXMLFormat(aoThis.criteria.filterValue1[i]) + '</value1>' +
				'<value2>' + ns1blankspace.advancedSearch.asXMLFormat(aoThis.criteria.filterValue2[i]) + '</value2>' +
				'<value3>' + ns1blankspace.advancedSearch.asXMLFormat(aoThis.criteria.filterValue3[i]) + '</value3>' +
				'<ApplyToSubSearchJoin>' + ns1blankspace.advancedSearch.asXMLFormat(aoThis.criteria.filterApplyToSubSearchJoin[i]) + '</ApplyToSubSearchJoin>' +
			'</filter>';
	}

	for(i = 0; i < aoThis.criteria.sortField.length; i++)
	{
		sXML += 
			'<sort>' +
				'<name>' + ns1blankspace.advancedSearch.asXMLFormat(aoThis.criteria.sortField[i]) + '</name>' +
				'<direction>' + ns1blankspace.advancedSearch.asXMLFormat(aoThis.criteria.sortDirection[i]) + '</direction>' +
			'</sort>';
	}

	sXML += '<options>' + 
				'<rf>' + ns1blankspace.advancedSearch.asXMLFormat(aoThis.rf) + '</rf>' +
				'<startrow>' + ns1blankspace.advancedSearch.asXMLFormat(aoThis.startRow) + '</startrow>' +
				'<rows>' + ns1blankspace.advancedSearch.asXMLFormat(aoThis.rows) + '</rows>' +
				'<returnparameters>' + aoThis.returnParameters + '</returnparameters>' +
			'</options>';
			
	for(i = 0; i < aoThis.criteria.customOptionName.length; i++)
	{
		sXML += 
			'<customOption>' + 
				'<name>' + ns1blankspace.advancedSearch.asXMLFormat(aoThis.criteria.customOptionName[i]) + '</name>' +
				'<value>' + ns1blankspace.advancedSearch.asXMLFormat(aoThis.criteria.customOptionValue[i]) + '</value>' +
			'</customOption>';
	}
			
	sXML += '</advancedSearch>';

	return sXML;
}