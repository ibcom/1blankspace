/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 */

//STANDARD OBJECT TEMPLATE / FORMATTING
//type: 1=local primary object json, 2=remote mydigitalstructure object

/* 

PARSE 1 - PREP:

	<table><tr><td>[[Reference]]</td></tr></table>
	<table>
	<tr><td>Item Reference</td><td>Amount</td></tr>
	<tr><td>[[Item Reference]]</td><td>[[Item Amount]]</td></tr>
	</table>

	[[Item Reference]]:  find parent that is table, $('td').closest('table'); or $('#selector').parents("table:first");, set data-format-group: [[Item Reference]]
							on the td set data-format-name= [[Item Reference]]
	[[Item Amount]]:  find parent that is table, $('td').closest('table'); or $('#selector').parents("table:first");, set data-format-group: [[Item Reference]]-[[Item About]]
	 						on the td set data-format-name= [[Item Anmount]]

PARSE 2 - RENDER:

	.replace(/g /) based on dictionary where type = 1

	Select any tables with attribute $("table[data-format-group]")
	Get the data based on the method and columns - advanced search
	Get the row based on the first td and copy and replace for each row in return.
	
*/

if (ns1blankspace.format == undefined) {ns1blankspace.format = {}}

ns1blankspace.format.tags =
[
	{
		type: 3,
		caption: "Today"
	},
	{
		object: 3,
		type: 1,
		caption: "Reference",
		source: "payment.reference"
	},
	{
		object: 3,
		type: 1,
		caption: "Amount",
		source: "payment.amount"
	},
	{
		object: 3,
		type: 1,
		caption: "Tax",
		source: "payment.tax"
	},
	{
		object: 3,
		type: 1,
		caption: "Paid Date",
		source: "payment.paiddate"
	},
	{
		object: 3,
		type: 1,
		caption: "Business",
		source: "payment.contactbusinesspaidtotext"
	},
	{
		object: 3,
		type: 1,
		caption: "Person",
		source: "payment.contactpersonpaidtotext"
	},
	{
		object: 3,
		type: 1,
		caption: "Description",
		source: "payment.description"
	},
	{
		object: 3,
		type: 1,
		caption: "Project",
		source: "payment.projecttext"
	},
	{
		object: 5,
		type: 1,
		caption: "Reference",
		source: "invoice.reference"
	},
	{
		object: 5,
		type: 1,
		caption: "Sent Date",
		source: "invoice.sentdate"
	},
	{
		object: 5,
		type: 1,
		caption: "Due Date",
		source: "invoice.duedate"
	},
	{
		object: 5,
		type: 1,
		caption: "Description",
		source: "invoice.description"
	},
	{
		object: 5,
		type: 1,
		caption: "Amount",
		source: "invoice.amount"
	},
	{
		object: 5,
		type: 1,
		caption: "Outstanding Amount",
		source: "invoice.outstandingamount"
	},
	{
		object: 5,
		type: 1,
		caption: "Receipted Amount",
		source: "invoice.receiptamount"
	},
	{
		object: 5,
		type: 1,
		caption: "Credit Note Amount",
		source: "invoice.creditamount"
	},
	{
		object: 5,
		type: 1,
		caption: "Purchase Order",
		source: "invoice.purchaseorder"
	},
	{
		object: 5,
		type: 1,
		caption: "Tax",
		source: "invoice.tax"
	},
	{
		object: 5,
		type: 1,
		caption: "Description",
		source: "invoice.description"
	},			
	{
		object: 5,
		type: 1,
		caption: "Purchase Order",
		source: "invoice.purchaseorder"
	},			
	{
		object: 5,
		type: 1,
		caption: "Project",
		source: "invoice.projecttext"
	},			
	{
		object: 5,
		type: 1,
		caption: "Business",
		source: "invoice.contactbusinesssenttotext"
	},	
	{
		object: 5,
		type: 1,
		caption: "Business Legal Name",
		source: "invoice.contactbusinesssentto.legalname"
	},	
	{
		object: 5,
		type: 1,
		caption: "Business Reference",
		source: "invoice.contactbusinesssentto.reference"
	},	
	{
		object: 5,
		type: 1,
		caption: "Person",
		source: "invoice.contactpersonsenttotext"
	},	
	{
		object: 5,
		type: 1,
		caption: "Person Reference",
		source: "invoice.contactpersonsentto.reference"
	},
	{
		object: 5,
		type: 1,
		caption: "Mailing Address 1",
		sourceMethod: 'format.methods.mailingAddress1',
		sourceGroup: "invoice.contactbusinesssentto"
	},
	{
		object: 5,
		type: 1,
		caption: "Mailing Address 2",
		sourceMethod: 'format.methods.mailingAddress2',
		sourceGroup: "invoice.contactbusinesssentto"
	},
	{
		object: 5,
		type: 1,
		caption: "Mailing Suburb",
		sourceMethod: 'format.methods.mailingSuburb',
		sourceGroup: "invoice.contactbusinesssentto"
	},
	{
		object: 5,
		type: 1,
		caption: "Mailing State",
		sourceMethod: 'format.methods.mailingState',
		sourceGroup: "invoice.contactbusinesssentto"
	},
	{
		object: 5,
		type: 1,
		caption: "Mailing Post Code",
		sourceMethod: 'format.methods.mailingPostCode',
		sourceGroup: "invoice.contactbusinesssentto"
	},
	{
		object: 5,
		type: 1,
		caption: "Mailing Country",
		sourceMethod: 'format.methods.mailingCountry',
		sourceGroup: "invoice.contactbusinesssentto"
	},
	{
		object: 5,
		type: 1,
		caption: "Unique ID",
		source: "invoice.guid"
	},		
	{
		object: 5,
		type: 2,
		caption: "Item Description",
		method: "FINANCIAL_ITEM_SEARCH",
		source: "lineitem.description"
	},
	{
		object: 5,
		type: 2,
		caption: "Item Account",
		method: "FINANCIAL_ITEM_SEARCH",
		source: "lineitem.financialaccounttext"
	},
	{
		object: 5,
		type: 2,
		caption: "Item Amount",
		method: "FINANCIAL_ITEM_SEARCH",
		source: "lineitem.amount"
	},
	{
		object: 5,
		type: 2,
		caption: "Item Tax",
		method: "FINANCIAL_ITEM_SEARCH",
		source: "lineitem.tax"
	},
	{
		object: 5,
		type: 2,
		caption: "Item Tax Type",
		method: "FINANCIAL_ITEM_SEARCH",
		source: "lineitem.taxtyperevenuetext"
	},
	{
		object: 5,
		type: 2,
		caption: "Item Currency",
		method: "FINANCIAL_ITEM_SEARCH",
		source: "lineitem.issuedcurrencytext"
	},
	{
		object: 5,
		type: 1,
		caption: 'Pay Now',
		sourceMethod: 'ns1blankspace.util.financial.paynow'
	},
	{
		type: 6,
		caption: "Today"
	},
	{
		object: 6,
		type: 1,
		caption: "Reference",
		source: "receipt.reference"
	},
	{
		object: 6,
		type: 1,
		caption: "Amount",
		source: "receipt.amount"
	},
	{
		object: 6,
		type: 1,
		caption: "Tax",
		source: "receipt.tax"
	},
	{
		object: 6,
		type: 1,
		caption: "Received Date",
		source: "receipt.receiveddate"
	},
	{
		object: 6,
		type: 1,
		caption: "Business",
		source: "receipt.contactbusinessreceivedfromtext"
	},
	{
		object: 6,
		type: 1,
		caption: "Person",
		source: "receipt.contactpersonreceivedfromtext"
	},
	{
		object: 6,
		type: 1,
		caption: "Notes",
		source: "receipt.notes"
	},
	{
		object: 6,
		type: 1,
		caption: "Project",
		source: "receipt.projecttext"
	},
	{
		object: 6,
		type: 1,
		caption: "Area",
		source: "receipt.areatext"
	},
	{
		object: 6,
		type: 1,
		caption: "Transaction Reference",
		source: "receipt.paymentreferencetransactionreference"
	},
	{
		object: 175,
		type: 1,
		caption: "Name",
		source: "debtorname"
	},
	{
		object: 175,
		type: 1,
		caption: "Outstanding Amount",
		source: "total"
	},
	{
		object: 175,
		type: 1,
		caption: "Last Receipt Date",
		source: "lastreceiptdate"
	},
	{
		object: 175,
		type: 1,
		caption: "Last Receipt Amount",
		source: "lastreceiptamount"
	},
	{
		object: 175,
		type: 2,
		caption: "Invoice Amount",
		source: "invoice.amount"
	},
	{
		object: 175,
		type: 2,
		caption: "Invoice Outstanding Amount",
		source: "invoice.outstandingamount"
	},
	{
		object: 175,
		type: 2,
		caption: 'Invoice Reference',
		source: 'invoice.reference'
	},
	{
		object: 175,
		type: 2,
		caption: 'Invoice Date',
		source: 'invoice.sentdate'
	},
	{
		object: 175,
		type: 2,
		caption: 'Invoice Date Due',
		source: 'invoice.duedate'
	},
	{
		object: 37,
		type: 1,
		caption: 'Business Name',
		source: 'contactbusinesstext'
	},
	{
		object: 37,
		type: 1,
		caption: 'Business ABN',
		source: 'employee.contactbusiness.abn'
	},
	{
		object: 37,
		type: 1,
		caption: 'Business Street 1',
		source: 'employee.contactbusiness.streetaddress1'
	},
	{
		object: 37,
		type: 1,
		caption: 'Business Street 2',
		source: 'employee.contactbusiness.streetaddress2'
	},
	{
		object: 37,
		type: 1,
		caption: 'Business Suburb',
		source: 'employee.contactbusiness.streetsuburb'
	},
	{
		object: 37,
		type: 1,
		caption: 'Business State',
		source: 'employee.contactbusiness.streetstate'
	},
	{
		object: 37,
		type: 1,
		caption: 'Business Post Code',
		source: 'employee.contactbusiness.streetpostcode'
	},
	{
		object: 37,
		type: 1,
		caption: 'Year',
		source: 'year'
	},
	{
		object: 37,
		type: 1,
		caption: 'First Name',
		source: 'employee.contactperson.firstname'
	},
	{
		object: 37,
		type: 1,
		caption: 'Last Name',
		source: 'employee.contactperson.surname'
	},
	{
		object: 37,
		type: 1,
		caption: 'TFN',
		source: 'employee.taxfilenumber'
	},
	{
		object: 37,
		type: 1,
		caption: 'Gross Salary',
		source: 'employee.grosssalary'
	},
	{
		object: 37,
		type: 1,
		caption: 'Net Salary',
		source: 'employee.netsalary'
	},
	{
		object: 37,
		type: 1,
		caption: 'Tax Before Rebate',
		source: 'employee.taxbeforerebate'
	},
	{
		object: 37,
		type: 1,
		caption: 'Superannuation',
		source: 'employee.superannuation'
	},
	{
		object: 37,
		type: 1,
		caption: 'Start Date',
		source: 'startdate'
	},
	{
		object: 37,
		type: 1,
		caption: 'End Date',
		source: 'enddate'
	},
	{
		object: 37,
		type: 1,
		caption: 'Street Address 1',
		source: 'employee.contactperson.streetaddress1'
	},
	{
		object: 37,
		type: 1,
		caption: 'Street Address 2',
		source: 'employee.contactperson.streetaddress2'
	},
	{
		object: 37,
		type: 1,
		caption: 'Street Postcode',
		source: 'employee.contactperson.streetpostcode'
	},
	{
		object: 37,
		type: 1,
		caption: 'Street Suburb',
		source: 'employee.contactperson.streetsuburb'
	},
	{
		object: 37,
		type: 1,
		caption: 'Email',
		source: 'employee.contactperson.email'
	},
	{
		object: 37,
		type: 2,
		caption: 'Pay Gross Salary',
		source: 'grosssalary'
	},
	{
		object: 37,
		type: 2,
		caption: 'Pay Net Salary',
		source: 'netsalary'
	},
	{
		object: 37,
		type: 2,
		caption: 'Pay Superannuation',
		source: 'superannuation'
	},
	{
		object: 37,
		type: 2,
		caption: 'Pay Deductions',
		source: 'deductions'
	},		
	{
		object: 37,
		type: 2,
		caption: 'Pay Date',
		source: 'payrecord.payperiod.paydate'
	},
	{
		object: 371,
		type: 1,
		caption: 'Pay Slip Business Name',
		source: 'contactbusinesstext'
	},
	{
		object: 371,
		type: 1,
		caption: 'Pay Slip First Name',
		source: 'payrecord.employee.contactperson.firstname'
	},
	{
		object: 371,
		type: 1,
		caption: 'Pay Slip Last Name',
		source: 'payrecord.employee.contactperson.surname'
	},
	{
		object: 371,
		type: 1,
		caption: 'Pay Slip TFN',
		source: 'payrecord.employee.taxfilenumber'
	},
	{
		object: 371,
		type: 1,
		caption: 'Pay Slip Gross Salary',
		source: 'payrecord.grosssalary'
	},
	{
		object: 371,
		type: 1,
		caption: 'Pay Slip Net Salary',
		source: 'payrecord.netsalary'
	},
	{
		object: 371,
		type: 1,
		caption: 'Pay Slip Tax Before Rebate',
		source: 'payrecord.taxbeforerebate'
	},
	{
		object: 371,
		type: 1,
		caption: 'Pay Slip Superannuation',
		source: 'payrecord.superannuation'
	},
	{
		object: 371,
		type: 1,
		caption: 'Pay Slip Start Date',
		source: 'payrecord.payperiod.startdate'
	},
	{
		object: 371,
		type: 1,
		caption: 'Pay Slip Pay Date',
		source: 'payrecord.payperiod.paydate'
	},
	{
		object: 371,
		type: 2,
		caption: 'Pay Slip Item Type',
		source: 'typetext'
	},
	{
		object: 371,
		type: 2,
		caption: 'Pay Slip Item Hours',
		source: 'hours'
	},
	{
		object: 17,
		type: 1,
		caption: "Reference",
		source: "action.reference"
	},
	{
		object: 17,
		type: 1,
		caption: "Description",
		source: "action.description"
	},
	{
		object: 17,
		type: 1,
		caption: "Date",
		source: "action.date"
	},
	{
		object: 17,
		type: 1,
		caption: "Date And Time",
		source: "action.duedatetime"
	},
	{
		object: 17,
		type: 1,
		caption: "Action Type",
		source: "action.actiontypetext"
	},
	{
		object: 17,
		type: 1,
		caption: "First name",
		source: "action.contactperson.firstname"
	},
	{
		object: 17,
		type: 1,
		caption: "Last name",
		source: "action.contactperson.surname"
	},
];

ns1blankspace.format.methods =
{
	mailingAddress1: function(oRow)
	{
		// v3.1.2 SUP022625 Now uses Street address if mailing not populated
		return (oRow['invoice.contactbusinesssentto.mailingaddress1'] == '' 
				? oRow['invoice.contactbusinesssentto.streetaddress1'] 
				: oRow['invoice.contactbusinesssentto.mailingaddress1']);
	},

	mailingAddress2: function(oRow)
	{
		// v3.1.2 SUP022625 Now uses Street address if mailing not populated
		return (oRow['invoice.contactbusinesssentto.mailingaddress2'] == '' 
				? oRow['invoice.contactbusinesssentto.streetaddress2'] 
				: oRow['invoice.contactbusinesssentto.mailingaddress2']);
	},

	mailingSuburb: function(oRow)
	{
		// v3.1.2 SUP022625 Now uses Street address if mailing not populated
		return (oRow['invoice.contactbusinesssentto.mailingsuburb'] == '' 
				? oRow['invoice.contactbusinesssentto.streetsuburb'] 
				: oRow['invoice.contactbusinesssentto.mailingsuburb']);
	},

	mailingState: function(oRow)
	{
		return (oRow['invoice.contactbusinesssentto.mailingstate'] == '' 
				? oRow['invoice.contactbusinesssentto.streetstate'] 
				: oRow['invoice.contactbusinesssentto.mailingstate']);
	},

	mailingPostCode: function(oRow)
	{
		return (oRow['invoice.contactbusinesssentto.mailingpostcode'] == '' 
				? oRow['invoice.contactbusinesssentto.streetpostcode'] 
				: oRow['invoice.contactbusinesssentto.mailingpostcode']);
	},

	mailingCountry: function(oRow)
	{
		return (oRow['invoice.contactbusinesssentto.mailingcountry'] == '' 
				? oRow['invoice.contactbusinesssentto.streetcountry'] 
				: oRow['invoice.contactbusinesssentto.mailingcountry']);
	}
}		

ns1blankspace.format.test = function()
{
	ns1blankspace.format.xhtmlTest = '<table><tr><td>[[Reference]]</td></tr></table>' +
										'<table>' +
										'<tr><td>Item Reference</td><td>Amount</td></tr>' +
										'<tr><td>[[Item Reference]]</td><td>[[Item Amount]]</td></tr>' +
										'</table>';

	return ns1blankspace.format.render({xhtmlTemplate: ns1blankspace.format.xhtmlTest});
}

ns1blankspace.format.render = function (oParam)
{
	var sXHTMLTemplate;
	var sXHTMLRendered;
	var iObject = ns1blankspace.object;
	var iObjectContext = ns1blankspace.objectContext;
	var aSourceMethods = [];
	var oObjectData = ns1blankspace.objectContextData;
	var oObjectOtherData;

	if (oParam != undefined)
	{
		if (oParam.xhtmlTemplate != undefined) {sXHTMLTemplate = oParam.xhtmlTemplate}
		if (oParam.object != undefined) {iObject = oParam.object}
		if (oParam.objectContext != undefined) {iObjectContext = oParam.objectContext}
		if (oParam.objectData != undefined) {oObjectData = oParam.objectData}
		if (oParam.objectOtherData != undefined) {oObjectOtherData = oParam.objectOtherData}		
	}

	//var bIncludeSchedule = ns1blankspace.util.getParam(oParam, 'includeSchedule', {'default': false}).value;
	var bPageBreak = ns1blankspace.util.getParam(oParam, 'pageBreak', {'default': false}).value;
	var iMaxRows = ns1blankspace.util.getParam(oParam, 'maxRows').value;

	sXHTMLTemplate = (sXHTMLTemplate).replace(/\[\[/g,'<span class="template">');
	sXHTMLTemplate = (sXHTMLTemplate).replace(/\]\]/g,'</span>');
	sXHTMLTemplate = (sXHTMLTemplate).replace(/\{\{/g,'<span class="template">');
	sXHTMLTemplate = (sXHTMLTemplate).replace(/\}\}/g,'</span>');

	var oXHTML;

	$(ns1blankspace.xhtml.container).html(sXHTMLTemplate)
	oXHTML = $(ns1blankspace.xhtml.container);

	var aXHTML = [];

	$('span.template', oXHTML).each(function(i,e) 
	{
		var oTemplateTag = $.grep(ns1blankspace.format.tags, function (a) { return a.caption == $(e).html() && a.object == iObject; })

		if (oTemplateTag[0])
		{
			$(e).html('');
			$(e).attr('data-format-tag', oTemplateTag[0].caption);
			$(e).attr('data-format-source', oTemplateTag[0].source);

			if (oTemplateTag[0].sourceMethod)
			{
				$(e).attr('data-format-source-method', oTemplateTag[0].sourceMethod);
				$(e).attr('data-format-source-method-namespace', oTemplateTag[0].sourceMethodRootNamespace);
			}
			else
			{
				if (oTemplateTag[0].sourceGroup)
				{
					$(e).attr('data-format-source-group', oTemplateTag.sourceGroup);
				}
				else
				{
					var aSource = (oTemplateTag[0].source).split('.');
					$(e).attr('data-format-source-group', aSource[0]);
				}
			}	

			if (oTemplateTag[0].object == iObject && oTemplateTag[0].type == 1)
			{
				var sSource = oTemplateTag[0].source;
				var sSourceMethod = $(e).attr('data-format-source-method');

				if (sSourceMethod != undefined)
				{
					var oRoot = (oTemplateTag.sourceMethodRootNamespace) ? oTemplateTag.sourceMethodRootNamespace : ns1blankspace;
					var fFunction = ns1blankspace.util.toFunction(sSourceMethod, oRoot);

					if (typeof fFunction == 'function')
					{
						$(e).html(fFunction(oObjectData));
					}	
				}

				else if (oObjectData[sSource] != undefined)
				{	
					$(e).html(ns1blankspace.util.toBR(_.toString(oObjectData[sSource])));
				}
				else
				{
					var aSource = (sSource).split('.');
					sSource = aSource[aSource.length-1];

					if (oObjectData[sSource])
					{	
						$(e).html(ns1blankspace.util.toBR(_.toString(oObjectData[sSource])));
					}
				}	
			}

			if (oTemplateTag[0].object == iObject && oTemplateTag[0].type == 2)
			{
				if ($.grep(aSourceMethods, function (a) { return a.method == oTemplateTag[0].method; }).length == 0)
				{
					aSourceMethods.push({method: oTemplateTag[0].method, group: aSource[0]});
				}	
			}
		}			
	});

	//TYPE = 2 - subtables - need to gather up

	var sHTML = $(oXHTML).html();

	if (aSourceMethods.length != 0)
	{	
		$(aSourceMethods).each(function() 
		{
			if (oObjectOtherData == undefined)
			{
				var oSearch = new AdvancedSearch();
				oSearch.method = this.method;
				oSearch.addField('*');
				oSearch.addFilter('object', 'EQUAL_TO', iObject);
				oSearch.addFilter('objectcontext', 'EQUAL_TO', iObjectContext);
				oSearch.sort('id', 'desc');
				oSearch.rows = 500;

				var oTmp = {group: this.group};
				oSearch.getResults(function(oResponse) {ns1blankspace.format.process(oTmp, oResponse.data.rows)});
			}
			else
			{
				oParam.group = this.group;
				oParam.xhtml = sHTML;
				sHTML = ns1blankspace.format.process(oParam, oObjectOtherData)
			}
		});
	}	

	return sHTML;
};

ns1blankspace.format.process = function (oParam, oResponse)
{
	var iMaxRows = ns1blankspace.util.getParam(oParam, 'maxRows').value;

	var oXHTML = document;

	if (ns1blankspace.util.param(oParam, 'xhtml').exists)
	{
		$(ns1blankspace.xhtml.container).html(ns1blankspace.util.param(oParam, 'xhtml').value)
		oXHTML = $(ns1blankspace.xhtml.container);
	}

	var aTR = [];
	var sTRID = 'template-' + oParam.group;

	$('[data-format-source-group="' + oParam.group + '"]', oXHTML).each(function(i) 
	{
		$('[data-format-source-group="' + oParam.group + '"]:first', oXHTML).closest('tr').clone()

		var oTR = $(this).closest('tr');
		var sTRXHTML = $(oTR).html();
		$(oTR).addClass(sTRID);

		$(sTRXHTML).each(function()
		{
			$(this).find('span.template').each(function(i,e) 
			{
				$(e).html($(e).attr('data-format-source'));
			});

			aTR.push($(this).html());
		});
	});	

	sTRXHTML = aTR.join('');

	$(oResponse).each(function(r)
	{	
		var oRow = this;

		var oTRClone = $('[data-format-source-group="' + oParam.group + '"]:first', oXHTML).closest('tr').clone();

		oTRClone.find('[data-format-source]').each(function()
		{
			var sSource = $(this).attr('data-format-source');
			var sSourceMethod = $(this).attr('data-format-source-method');

			if (sSourceMethod != undefined)
			{
				var oRoot = (oTemplateTag.sourceMethodRootNamespace) ? oTemplateTag.sourceMethodRootNamespace : ns1blankspace;
				var fFunction = ns1blankspace.util.toFunction(sSourceMethod, oRoot);
				$(this).html(fFunction(oRow));
			}	
			else if (oRow[sSource])
			{	
				$(this).html(ns1blankspace.util.toBR(oRow[sSource]));
			}
			else
			{
				var aSource = (sSource).split('.');
				sSource = aSource[aSource.length-1];

				if (oRow[sSource])
				{	
					$(this).html(ns1blankspace.util.toBR(oRow[sSource]));
				}
			}	
		})

		$('[data-format-source-group="' + oParam.group + '"]:first', oXHTML).closest('tr').parent().after(oTRClone);
			
	});

	$('[data-format-source-group="' + oParam.group + '"]:first', oXHTML).closest('tr').remove();

	//Split if greater than iMaxRows.

	if (iMaxRows != undefined)
	{	
		var aAllRows =  $('tr', oXHTML);

		if (aAllRows.length > iMaxRows + 1)
		{
			var table = $('[data-format-source-group="' + oParam.group + '"]:first', oXHTML).closest('table');
			var tableContainer = table.children().remove();
			var tableHeader = table.children().first('tr');

			var aPagedRows = [];
			var sHTML = ''

			while(aAllRows.length)
			{
				aPagedRows.push(aAllRows.splice(0, iMaxRows));
			}

			$.each(aPagedRows, function (r, rows)
			{	
				rows.unshift('<div style="page-break-before:always;"></div>' + tableContainer.replace('</table>', ''))
				rows.push('</table>');
				sHTML = sHTML & rows.join('');
			});

			oXHTML.html(sHTML)
		}
	}

	if (ns1blankspace.util.param(oParam, 'xhtml').exists)
		{return oXHTML.html()};
};

ns1blankspace.format.editor = 
{
	init:		function (oParam)
				{
					var sHeight = ns1blankspace.util.getParam(oParam, 'height', {"default": '370px'}).value;
					var sWidth = ns1blankspace.util.getParam(oParam, 'width', {"default": '100%'}).value;
					var bDynamicTags = ns1blankspace.util.getParam(oParam, 'dynamicTags', {"default": false}).value;
					var sVersion = ns1blankspace.util.getParam(oParam, 'version').value;
					var sTheme = ns1blankspace.util.getParam(oParam, 'theme', {"default": 'advanced'}).value;
					var sXHTMLElement = ns1blankspace.util.getParam(oParam, 'xhtmlElement', {"default": 'textarea'}).value;
					var sSelector = ns1blankspace.util.getParam(oParam, 'selector', {"default": sXHTMLElement}).value;
					var iObject = ns1blankspace.util.getParam(oParam, 'object', {"default": '32'}).value;
					var aToolbars = ns1blankspace.util.getParam(oParam, 'toolbars').value;
					var bSimple = ns1blankspace.util.getParam(oParam, 'simple', {"default": false}).value;
					var oInit = ns1blankspace.util.getParam(oParam, 'init').value;
					var fOnInit = ns1blankspace.util.getParam(oParam, 'onInit').value;
					var sContentCSS = ns1blankspace.util.getParam(oParam, 'contentCSS').value;

					var sAdditional = '';

					if (sVersion == undefined && tinyMCE != undefined )
					{
						sVersion = tinyMCE.majorVersion;
					}

					if (sTheme == 'advanced' && sVersion == '4') {sTheme = 'modern'}

					if (ns1blankspace.option.richTextEditing)
					{
						if (bDynamicTags) {sAdditional = 'dynamicTags,'}

						if (sVersion == '4')
						{	
							if (sSelector && sSelector.indexOf('#') == -1) {sSelector = '#' + sSelector}
							if (oInit == undefined)
							{	
								oInit = 
								{
									selector: sSelector,
									theme: "modern",
									skin: 'light',
									height : sHeight, 
									width : sWidth,
									plugins:
									[
									  "advlist link image lists charmap hr anchor pagebreak",
									  "searchreplace visualblocks code fullscreen insertdatetime media nonbreaking",
									  "table contextmenu directionality emoticons template textcolor paste textcolor colorpicker textpattern"
									],

									menubar: false,
									statusbar : false,
									toolbar_items_size: 'small',

									style_formats:
									[
									  {title: 'Bold text', inline: 'b'}
									],

									templates: '/ondemand/core/?method=CORE_DYNAMIC_TAG_SEARCH',
									link_list: '/rpc/core/?method=CORE_EDITOR_LINK_SEARCH',
									image_list: '/rpc/core/?method=CORE_EDITOR_IMAGE_SEARCH',

									browser_spellcheck: true,
									content_css: sContentCSS,
									convert_urls: false
								}

								if (bSimple)
								{
									oInit.toolbar1 = 'bold italic underline | alignleft aligncenter alignright alignjustify | fontselect fontsizeselect';
									oInit.toolbar2 = 'forecolor backcolor | cut copy paste | bullist numlist | outdent indent blockquote | undo redo | link unlink anchor image media code';
								}	
								else
								{	
									if (aToolbars == undefined)
									{
										oInit.toolbar1 = 'bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | formatselect fontselect fontsizeselect | fullscreen';
										oInit.toolbar2 = 'forecolor backcolor | cut copy paste | bullist numlist | outdent indent blockquote | undo redo | link unlink anchor image media code';
							     		oInit.toolbar3 = 'table | hr removeformat | subscript superscript | charmap emoticons | ltr rtl | visualchars visualblocks nonbreaking pagebreak | template';
									}
									else
									{
										$.each(aToolbars, function (t, toolbar)
										{
											oInit['toolbar' + (t+1)] = toolbar;
										});
									}
								}

								if (fOnInit != undefined)
								{
									oInit.init_instance_callback = fOnInit;
								}	
							}	
						}
						else if (sVersion == '3')
						{
							if (sSelector && sSelector.indexOf('#') == 0) {sSelector = sSelector.substr(1)}
							var oInit = 
							{
								mode : "none",
								height : sHeight, 
								width : "100%",
								theme : sTheme,

								theme_advanced_path : false,

								plugins : "table,advimage,advlink,emotions,iespell,insertdatetime," + sAdditional + "preview,media,fullscreen,print,visualchars,nonbreaking,pagebreak,style,paste,searchreplace,print,contextmenu", 

								theme_advanced_buttons1_add_before : "forecolor,backcolor", 
								theme_advanced_buttons1_add : "fontselect,fontsizeselect", 
						 
								theme_advanced_buttons2_add : "separator,insertdate,inserttime,preview,zoom,separator,nonbreaking,pagebreak", 
								theme_advanced_buttons2_add_before: "cut,copy,paste,pasteword,separator,search,replace,separator", 
								
								theme_advanced_buttons3_add_before : "tablecontrols,separator", 
								theme_advanced_buttons3_add : "emotions,iespell,fullscreen,print," + sAdditional + "media,selectall,advhr",
						 
								plugin_insertdate_dateFormat : "%d-%m-%y", 
								plugin_insertdate_timeFormat : "%H:%M:%S", 
							
								theme_advanced_toolbar_location : "top",
								theme_advanced_toolbar_align : "left",
								theme_advanced_resizing : true,
							
								font_size_style_values : "8pt,10pt,12pt,14pt,18pt,24pt,36pt",
								
								extended_valid_elements : "style,input[accept|accesskey|align<bottom?left?middle?right?top|alt|checked<checked|class|dir<ltr?rtl|disabled<disabled|id|ismap<ismap|lang|maxlength|name|onblur|onclick|ondblclick|onfocus|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|onselect|readonly<readonly|size|src|style|tabindex|title|type<button?checkbox?file?hidden?image?password?radio?reset?submit?text|usemap|value],select[class|dir<ltr?rtl|disabled<disabled|id|lang|multiple<multiple|name|onblur|onchange|onclick|ondblclick|onfocus|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|size|style|tabindex|title],ol[class|compact<compact|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|start|style|title|type],div[align<center?justify?left?right|class|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|style|title],li[class|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|style|title|type|value],iframe[src|width|height|name|align|frameborder|scrolling|marginheight|marginwidth],article,section",

								fullscreen_new_window : true, 
								fullscreen_settings : 
								{ 
									theme_advanced_path_location : "top" 
								}, 
								relative_urls : false, 
								remove_script_host : false, 
								convert_urls : false, 
								visual : true, 
								gecko_spellcheck : true,
								TemplateLinkType : iObject,
								content_css : ns1blankspace.xhtml.editorCSS,
								
								external_link_list_url : "/ondemand/core/?method=CORE_EDITOR_LINK_SEARCH", 
								external_image_list_url : "/ondemand/core/?method=CORE_EDITOR_IMAGE_SEARCH&object=19&objectcontext=" + ns1blankspace.objectContext, 
								media_external_list_url : "/ondemand/core/?method=CORE_EDITOR_MEDIA_SEARCH&object=19&objectcontext=" + ns1blankspace.objectContext
							}
						}	

						tinyMCE.init(oInit);
						if (sVersion == '3' && sSelector)
						{
							tinyMCE.execCommand('mceAddControl', false, sSelector);
						}		
					}
				},

	addTag:	function (oParam)
				{ 
					var sXHTMLElementID;
					var sEditorID;
					var oMCEBookmark;
					
					if (oParam != undefined)
					{
						if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
						if (oParam.editorID != undefined) {sEditorID = oParam.editorID}
						if (oParam.mceBookmark != undefined) {oMCEBookmark = oParam.mceBookmark}
						
						var oEditor = tinyMCE.get(sEditorID); 
						var sInsertText = $('#' + sXHTMLElementID).attr('data-caption');
						if (oMCEBookmark != undefined)
						{
							tinyMCE.get(sEditorID).selection.moveToBookmark(oMCEBookmark);
						}
						oEditor.execCommand('mceInsertContent', false, sInsertText); 
					}
					else
					{
						ns1blankspaceConfim({title: 'Error inserting field!', html: ["An error occurred when inserting the field. Please contact support." +
																					  "<br /><br />Details: No parameters passed to ns1blankspaceEditorAddTag"]});
						return false;
					}
				}
}

ns1blankspace.format.tree = 
{
	init: 		function (oParam)
				{
					var sXHTMLElementID;
					var oDataRoot;
					var sXHTMLElementContext = '';
					var fOnLastChild;
					var sLastChildElementID;
					var bShowAll = ns1blankspace.util.getParam(oParam, 'showAll', {"default": false}).value;

					if (oParam != undefined)
					{
						if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
						if (oParam.dataRoot != undefined) {oDataRoot = oParam.dataRoot}
						if (oParam.xhtmlElementContext != undefined) {sXHTMLElementContext = oParam.xhtmlElementContext}
						if (oParam.onLastChild != undefined) {fOnLastChild = oParam.onLastChild}
					}

					if ($('#' + sXHTMLElementID + ' .ns1blankspaceTreeRoot').length == 0)
					{	
						var aHTML = [];

						aHTML.push('<table id="ns1blankspaceTree_' + sXHTMLElementID + '"" class="ns1blankspaceContainer ns1blankspaceTreeRoot">');

						if (oDataRoot)
						{
							$(oDataRoot).each(function(i) 
							{
								aHTML.push('<tr><td id="ns1blankspaceRow' + sXHTMLElementContext + '-' + i + '" class="ns1blankspaceRow" style="width: 100%;"></td></tr>');
							});

						}
						else
						{
							aHTML.push('<tr><td id="ns1blankspaceRow' + sXHTMLElementContext + '-1" class="ns1blankspaceRow" style="width: 100%;"></td></tr>');
						}

						aHTML.push('</table>');

						$('#' + sXHTMLElementID).html(aHTML.join(''))
						
						ns1blankspace.format.tree.root(oParam);

						$('#' + sXHTMLElementID).off('mouseup', '.ns1blankspaceParent');
						$('#' + sXHTMLElementID).on('mouseup', '.ns1blankspaceParent', function(event)
						{
							oParam.xhtmlElementID = (event.target.id ? event.target.id : event.target.parentElement.id);
							ns1blankspace.format.tree.branch(oParam);
						});

						$('#' + sXHTMLElementID).off('mouseup', '.ns1blankspaceRoot');
						$('#' + sXHTMLElementID).on('mouseup', '.ns1blankspaceRoot', function(event)
						{
							oParam.xhtmlElementID = (event.target.id ? event.target.id : event.target.parentElement.id);
							oParam.shaded = true;
							ns1blankspace.format.tree.branch(oParam);
						});

						if (fOnLastChild)
						{	
							$('#' + sXHTMLElementID).off('mouseup', '.ns1blankspaceLastChild');
							$('#' + sXHTMLElementID).on('mouseup', '.ns1blankspaceLastChild', function(event)
							{
								sLastChildElementID = event.target.id;
								
								fOnLastChild(
								{
									xhtmlElementID: sLastChildElementID,
									id: $(this).attr('data-id')
								});
							});
						}	

						ns1blankspace.format.initStatus = 1;
						
						if (bShowAll)
						{
							oParam.isDataRoot = true;
							ns1blankspace.format.tree.show(oParam);
						}	
						
					}	
				},
				
	root: 	function(oParam)
				{	
					var sXHTMLElementID;
					var oDataRoot;
					var oDataTree;
					var sXHTMLElementContext = '';
					var sAlign= ns1blankspace.util.getParam(oParam, 'align', {"default": 'right'}).value;
					
					if (oParam != undefined)
					{
						if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
						if (oParam.dataRoot != undefined) {oDataRoot = oParam.dataRoot}
						if (oParam.dataTree != undefined) {oDataTree = oParam.dataTree}
						if (oParam.xhtmlElementContext != undefined) {sXHTMLElementContext = oParam.xhtmlElementContext}
					}

					if (oDataRoot)
					{
						$(oDataRoot).each(function(i) 
						{
							var aHTML = [];

							aHTML.push('<table>' +
											'<tr><td id="ns1blankspace' + sXHTMLElementContext + '_' + i + '-1" data-title="' + (this.title?this.title:'') + '" data-id="' + (this.id?this.id:'') + '" class="' +
											(this["class"] ? this["class"] : 'ns1blankspaceRoot') + '" style="width:150px; text-align:' + sAlign + '; padding-right:14px;">' +
											(this.xhtml ? this.xhtml : this.title) +
											'</td>' +
											'<td id="ns1blankspace' + sXHTMLElementContext + '_' + i + '-2" data-parent-id="' + (this.id?this.id:'') + '"class="' + (this["class"] ? this["class"] : 'ns1blankspaceChild') + '"></td></tr>' +
											'</table>');

							$('#' + sXHTMLElementID + ' #ns1blankspaceRow' + sXHTMLElementContext + '-' + i).html(aHTML.join(''))

						});
					}				
				},

	branch: 	function(oParam)
				{	
					var sXHTMLElementID;
					var iParentID = ns1blankspace.util.getParam(oParam, 'parentID').value;
					var oDataTree;
					var oDataBranch;
					var oDataRoot;
					var sXHTMLElementContext = '';
					var sBranchDetailName = 'amount'
					var sParentClass;
					var sClass = '';
					var bShaded = false;
					var sTitle = ns1blankspace.util.getParam(oParam, 'title').value;

					if (oParam != undefined)
					{
						if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
						if (oParam.xhtmlElementContext != undefined) {sXHTMLElementContext = oParam.xhtmlElementContext}
						if (oParam.dataTree != undefined) {oDataTree = oParam.dataTree}
						if (oParam.dataBranch != undefined) {oDataBranch = oParam.dataBranch}
						if (oParam.dataRoot != undefined) {oDataRoot = oParam.dataRoot}
						if (oParam.branchDetailName != undefined) {sBranchDetailName = oParam.branchDetailName}
						if (oParam.shaded != undefined)
						{
							bShaded = oParam.shaded;
							oParam.shaded = false;
						}
					}

					if (iParentID == undefined) {iParentID = $('#' + sXHTMLElementID).attr('data-id')};
					if (sTitle == undefined) {sTitle = $('#' + sXHTMLElementID).attr('data-title')};

					var oDataRootBranch = $.grep(oDataRoot, function (a) {return a.title == sTitle;})[0];

					var oDataTreeChild;

					if (iParentID != '')
					{
						oDataTreeChild = $.grep(oDataTree, function (a) {return parseInt(a.parentaccount) == parseInt(iParentID);});

						if (oDataRootBranch)
						{
							if (oDataRootBranch.filter)
							{
								oDataTreeChild = $.grep(oDataTreeChild, oDataRootBranch.filter)
							}
						}	
					}
					else if (oDataRootBranch)
					{
						if (oDataRootBranch.filter)
						{
							oDataTreeChild = $.grep(oDataTree, oDataRootBranch.filter)
						}
					}

					var aHTML= [];

					if (oDataTreeChild.length > 0)
					{
						if ($('#' + sXHTMLElementID).attr('data-tree-type') == "2")
						{
							var sHTML = $('#' + sXHTMLElementID + ' .ns1blankspaceTreeSubContext').html();
							
							if (sHTML)
							{
								$('#' + sXHTMLElementID).next("td").html(sHTML);
								$('#' + sXHTMLElementID + ' .ns1blankspaceTreeSubContext').html('');
								$('#' + sXHTMLElementID).next("td").css('text-align', 'right');
							}
							else
							{
								$('#' + sXHTMLElementID).next("td").html('&nbsp;');
							}

							$('#' + sXHTMLElementID).attr('data-tree-type', '1');
						}
						else
						{
							var sHTML = $('#' + sXHTMLElementID).next("td").html();
							$('#' + sXHTMLElementID + ' .ns1blankspaceTreeSubContext').html(sHTML)
							$('#' + sXHTMLElementID).attr('data-tree-type', '2'); 
						
							aHTML.push('<table>');

							$(oDataTreeChild).each(function(i, k) 
							{
								if (bShaded)
								{
									if (sClass == '')
									{
										sClass = ' ns1blankspaceRowShaded';
									}
									else
									{
										sClass = '';
									}
								}

								var oDataTreeHasChild = $.grep(oDataTree, function (a) {return parseInt(a.parentaccount) == parseInt(k.id);})[0];
								if (oDataTreeHasChild) {sParentClass = 'ns1blankspaceParent ' } else {sParentClass = 'ns1blankspaceLastChild '}

								var oDataBranchChild = $.grep(oDataBranch, function (a) {return parseInt(a.financialaccount) == parseInt(k.id);})[0]

								if (oDataBranchChild)
								{
									aHTML.push('<tr id="' + sXHTMLElementID + '_' + i + '"><td id="' + sXHTMLElementID + '_' + i + '-1" data-tree-type="1" data-id="' + this.id + '"' +
												' data-title="' + k.title + '" class="' + sParentClass + 'ns1blankspaceTreeColumn1' + sClass + '">' +
												this.title +
												'<br /><span class="ns1blankspaceSub ns1blankspaceTreeSubContext">' +
												'</td>' +
												'<td id="' + sXHTMLElementID + '_' + i + '-2" data-parent-id="' + this.id + '" class="ns1blankspaceChild ns1blankspaceTreeColumn2' + sClass + '" style="text-align: right;">');

									aHTML.push(oDataBranchChild[sBranchDetailName]);

									$('#' + sXHTMLElementID).next("td").css('text-align', 'left');
								}
								else
								{
									aHTML.push('<tr id="' + sXHTMLElementID + '_' + i + '"><td id="' + sXHTMLElementID + '_' + i + '-1" data-tree-type="1" data-id="' + this.id + '"' +
												' data-title="' + k.title + '" class="' + sParentClass + 'ns1blankspaceTreeColumn1' + sClass + '" >' +
												k.title +
												'<br /><span class="ns1blankspaceSub ns1blankspaceTreeSubContext">' +
												'</td>' +
												'<td id="' + sXHTMLElementID + '_' + i + '-2" data-parent-id="' + this.id + '" class="ns1blankspaceChild ns1blankspaceTreeColumn2' + sClass + '" style="text-align: right; color: #CCCCCC">-&nbsp;');

									$('#' + sXHTMLElementID).next("td").css('text-align', 'left');
								}
								
								aHTML.push('</td></tr>');
							});

							aHTML.push('</table>');

							$('#' + sXHTMLElementID).next("td").html(aHTML.join(''));
						}	
					}
					else
					{
						var oDataBranchChild = $.grep(oDataBranch, function (a) {return parseInt(a.financialaccount) == parseInt(iParentID);})[0]

						if (oDataBranchChild)
						{
							$('#' + sXHTMLElementID).next("td").html(oDataBranchChild[sBranchDetailName]);
						}
					}			
				},

	show: 		function (oParam)
				{
					var oData;
					var sClass = '.ns1blankspaceParent';

					if (oParam.isDataRoot)
					{
						oData = oParam.dataRoot;
						sClass = '.ns1blankspaceRoot';
					}
					else
					{
						oData = oParam.dataSubBranch;
					}

					$($.grep(oData, function (dR) {return dR.id != undefined})).each(function(i, dataRoot) 
					{
						oParam.xhtmlElementID = $(sClass + '[data-title="' + dataRoot.title + '"]').attr('id');
						oParam.parentID = dataRoot.id;
						oParam.shaded = $(sClass + '[data-title="' + dataRoot.title + '"]').hasClass('ns1blankspaceRoot');

						ns1blankspace.format.tree.branch(oParam);
					});

					var oDataSubBranch = $('.ns1blankspaceParent[data-tree-type="1"]').map(function (a)
					{
						var oReturn = {};
						oReturn.id = $(this).attr('data-id');
						oReturn.title = $(this).attr('data-title');
						return oReturn;
					});
					
					if (oDataSubBranch.length != 0)
					{
						var oParamBranch = $.extend(true, oParam, {});
						oParamBranch.isDataRoot = false;
						oParamBranch.dataSubBranch = oDataSubBranch;
						ns1blankspace.format.tree.show(oParamBranch);
					}
				}	
}

ns1blankspace.format.templates = 
{
	data: 		{},

	convert:  	function (oParam)
				{
					var iObject = ns1blankspace.util.getParam(oParam, 'object').value;
					
					var oSearch = new AdvancedSearch();
					oSearch.method = 'DOCUMENT_SEARCH';
					oSearch.addField('title,content');
					oSearch.addFilter('type', 'EQUAL_TO', 10);
					oSearch.addFilter('object', 'IS_NULL');
					oSearch.addFilter('title', 'TEXT_IS_LIKE', 'TEMPLATE');
					
					oSearch.getResults(function(oResponse)
					{
						if (oResponse.data.rows.length == 0)
						{
							ns1blankspace.util.onComplete(oParam);
						}	
						else
						{
							$.each(oResponse.data.rows, function (r, row)
							{
								var oData = {id: row.id}

								if (row.title.indexOf('INVOICE') >= 0) {oData.object = 5}
								if (row.title.indexOf('STATEMENT') >= 0) {oData.object = 175}
								if (row.title.indexOf('PAYSLIP') >= 0) {oData.object = 371}
								if (row.title.indexOf('PAYROLL') >= 0) {oData.object = 37}
								
								$.ajax(
								{
									type: 'POST',
									url: ns1blankspace.util.endpointURI('DOCUMENT_MANAGE'),
									data: oData,
									success: function ()
									{
										if (r == oResponse.data.rows.length-1)
										{	
											ns1blankspace.util.onComplete(oParam);
										}	
									}
								});
							});
						}	
					});	
				},

	init:  		function (oParam)
				{
					var iObject = ns1blankspace.util.getParam(oParam, 'object').value;
					var bRefresh = ns1blankspace.util.getParam(oParam, 'refresh', {"default": false}).value;
					var bNew = ns1blankspace.util.getParam(oParam, 'new', {"default": true}).value;

					oParam = ns1blankspace.util.setParam(oParam, 'templateInitialised', true);

					if (ns1blankspace.format.templates.data[iObject] == undefined || bRefresh)
					{
						ns1blankspace.format.templates.data[iObject] == [];

						var oSearch = new AdvancedSearch();
						oSearch.method = 'DOCUMENT_SEARCH';
						oSearch.addField('title,content');
						oSearch.addFilter('type', 'EQUAL_TO', 10);
						oSearch.addFilter('object', 'EQUAL_TO', iObject);
						
						oSearch.getResults(function(oResponse)
						{
							if (oResponse.data.rows.length == 0)
							{
								if (bNew)
								{ 
									ns1blankspace.format.templates.new(oParam);
								}
								else
								{
									ns1blankspace.util.onComplete(oParam);
								}	
							}
							else
							{
								ns1blankspace.format.templates.data[iObject] = oResponse.data.rows;

								$.each(ns1blankspace.format.templates.data[iObject], function (t, template)
								{	
									template.xhtml = (template.content).formatXHTML();
								});

								ns1blankspace.util.onComplete(oParam);
							}
						});		
					}
					else
					{
						ns1blankspace.util.onComplete(oParam);
					}
				},

	get: 		function (oParam)
				{
					var iObject = ns1blankspace.util.getParam(oParam, 'object').value;
					var iDocument = ns1blankspace.util.getParam(oParam, 'document').value;
					var sTitleText = ns1blankspace.util.getParam(oParam, 'titleText').value;
					var oTemplate, aTemplate;

					if (iObject != undefined && ns1blankspace.format.templates.data != undefined)
					{	
						aTemplate = ns1blankspace.format.templates.data[iObject];

						if (aTemplate == undefined) {aTemplate = []}

						if (iDocument != undefined)
						{
							aTemplate = $.grep(aTemplate, function (template) {return template.id == iDocument});
						}	
						else if (sTitleText)
						{
							aTemplate = $.grep(aTemplate, function (template) {return template.title.toLowerCase().indexOf(sTitleText.toLowerCase()) > -1});
						}

						if (aTemplate.length != 0) {oTemplate = aTemplate[0]}
					}

					return oTemplate
				},		

	"new": 	function (oParam)
				{
					var sTemplate = ns1blankspace.util.getParam(oParam, 'template', {"default": 'invoice'}).value;
					var iObject = ns1blankspace.util.getParam(oParam, 'object').value;

					if (ns1blankspace.xhtml.templates.source[sTemplate] == undefined)
					{
						oParam = ns1blankspace.util.setParam(oParam, 'content', '');
						ns1blankspace.format.templates.save(oParam);
					}
					else
					{
						$.ajax(
						{
							type: 'GET',
							url: ns1blankspace.xhtml.templates.source[sTemplate],
							dataType: 'text',
							global: false,
							success: function(data)
							{
								oParam = ns1blankspace.util.setParam(oParam, 'content', data);
								ns1blankspace.format.templates.save(oParam);
							},
							error: function(data)
							{
								oParam = ns1blankspace.util.setParam(oParam, 'content', '');
								ns1blankspace.format.templates.save(oParam);
							}
						});	
					}
				},

	save:		function (oParam)
				{
					var sTemplate = ns1blankspace.util.getParam(oParam, 'template', {"default": 'invoice'}).value;
					var sContent = ns1blankspace.util.getParam(oParam, 'content').value;
					var iDocumentID = ns1blankspace.util.getParam(oParam, 'document').value;
					var iObject = ns1blankspace.util.getParam(oParam, 'object').value;

					ns1blankspace.status.working();

					var oData = 
					{
						id: iDocumentID,
						content: sContent,
						type: 10,
						object: iObject
					}

					if (iDocumentID == undefined)
					{
						sTitle = sTemplate.toUpperCase() + ' TEMPLATE';

						if (ns1blankspace.format.templates.data[iObject] != undefined)
						{	
							if (ns1blankspace.format.templates.data[iObject].length >= 1)
							{
								sTitle = sTitle + ' ' + (ns1blankspace.format.templates.data[iObject].length + 1)
							}
						}	

						oData.title = sTitle;
						oParam.refresh = true;
					}	

					$.ajax(
					{
						type: 'POST',
						url: ns1blankspace.util.endpointURI('DOCUMENT_MANAGE'),
						data: oData,
						dataType: 'json',
						success: function(data)
						{
							oParam = ns1blankspace.util.setParam(oParam, 'document', data.id);
							ns1blankspace.status.message('Saved');
							ns1blankspace.format.templates.init(oParam);
						}
					});	
				}	
}

ns1blankspace.format.templates.edit =
{
	init: 	function (oParam)
				{
					var bNew = ns1blankspace.util.getParam(oParam, 'new', {"default": false}).value;

					if (bNew)
					{
						delete oParam.document;
						delete oParam.new;
						oParam = ns1blankspace.util.setParam(oParam, 'onComplete', ns1blankspace.format.templates.edit.show);
						ns1blankspace.format.templates.new(oParam);
					}
					else
					{	
						oParam = ns1blankspace.util.setParam(oParam, 'template', 'invoice', {onlyIfMissing: true});
						oParam = ns1blankspace.util.setParam(oParam, 'object', 5, {onlyIfMissing: true});
						oParam = ns1blankspace.util.setParam(oParam, 'onComplete', ns1blankspace.format.templates.init);
						oParam = ns1blankspace.util.setParam(oParam, 'onCompleteWhenCan', ns1blankspace.format.templates.edit.show);

						ns1blankspace.format.templates.convert(oParam);
					}	
				},

	show: 	function (oParam)
				{
					var sTemplate = ns1blankspace.util.getParam(oParam, 'template', {"default": 'invoice'}).value;
					var iObject = ns1blankspace.util.getParam(oParam, 'object', {"default": 5}).value;
					var iDocument = ns1blankspace.util.getParam(oParam, 'document').value;
					var bVariants = ns1blankspace.util.getParam(oParam, 'variants', {"default": false}).value;
					var bRefresh = ns1blankspace.util.getParam(oParam, 'refresh', {"default": false}).value;
					var bUseSource = ns1blankspace.util.getParam(oParam, 'useSource', {"default": false}).value;

					var aHTML = [];
					
					if ($('#ns1blankspaceMainTemplate_' + sTemplate).attr('data-loading') == '1' || bRefresh)
					{
						$('#ns1blankspaceMainTemplate_' + sTemplate).attr('data-loading', '');
								
						ns1blankspace.counter.editor = ns1blankspace.counter.editor + 1;		
								
						aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceTemplateColumn1_' + sTemplate + '" class="ns1blankspaceColumn1Flexible"></td>' +
										'<td id="ns1blankspaceTemplateColumn2_' + sTemplate + '" class="ns1blankspaceColumn2Action" style="width:100px; padding-left:12px;"></td>' +
										'</tr>' + 
										'</table>');
									
						$('#ns1blankspaceMainTemplate_' + sTemplate).html(aHTML.join(''));
						
						var aHTML = [];

						aHTML.push('<table id="ns1blankspaceTemplate_variants_' + sTemplate + '">');											

						aHTML.push('<tr><td>' +
										'<div id="ns1blankspaceTemplate_variants_container">' +
										'<span id="ns1blankspaceTemplate_variants_save_' + sTemplate + '" class="ns1blankspaceAction"></span>' +
										(bVariants?'<span id="ns1blankspaceTemplate_variants_remove_' + sTemplate + '" class="ns1blankspaceAction"></span>':'') +
										(bVariants?'<span id="ns1blankspaceTemplate_variants_add_' + sTemplate + '" class="ns1blankspaceAction"></span>':'') +
										'</div>' +
										'</td></tr>');

						if (bVariants)
						{	
							$.each(ns1blankspace.format.templates.data[iObject], function(t, template)
							{
								if ((iDocument == undefined) && (t==0))
								{
									iDocument = template.id;
									oParam = ns1blankspace.util.setParam(oParam, 'document', iDocument)
								}

								aHTML.push('<tr><td style="font-size:0.75em;" ');

								aHTML.push('id="ns1blankspaceTemplate_variants-' + template.id + '"' +
										  		' class="ns1blankspaceRow ns1blankspaceRowSelect' + (template.id==iDocument?' ns1blankspaceHighlight':'') + '" ' +
										   		' data-caption="' + (template.title) + '" style="cursor: pointer;">' + template.title);

								aHTML.push('</td></tr>');		   		
							});
						}
						else
						{
							iDocument = ns1blankspace.format.templates.data[iObject][0].id;
							oParam = ns1blankspace.util.setParam(oParam, 'document', iDocument)
						}
					
						aHTML.push('</table>');

						var aHTMLTags = [];
						
						$.each(ns1blankspace.format.tags, function()
						{
							if (this.object == iObject && this.type == 1)
							{
								aHTMLTags.push('<tr><td class="ns1blankspaceRow ns1blankspaceRowSelect" style="font-size:0.75em;">');

								aHTMLTags.push('<span id="spanInterfaceFormatTag_' + (this.caption).replace(/ /g,'-') + '"' +
										  		' class="interfaceFormatTags" ' +
										   		' data-caption="[[' + (bUseSource?this.source:this.caption) + ']]" style="cursor: pointer;">' + this.caption + '</span>');

								aHTMLTags.push('</td></tr>');		   		
							}				
						});

						$.each(ns1blankspace.format.tags, function()
						{
							if (this.object == iObject && this.type == 2)
							{
								aHTMLTags.push('<tr><td class="ns1blankspaceRow ns1blankspaceRowSelect" style="font-size:0.75em;">');

								aHTMLTags.push('<span id="spanInterfaceFormatTag_' + (this.caption).replace(/ /g,'-') + '"' +
										  		 ' class="interfaceFormatTags" ' +
										   		' data-caption="[[' + (bUseSource?this.source:this.caption) + ']]" style="cursor: pointer;">' + this.caption + '</span>');

								aHTMLTags.push('</td></tr>');		   		
							}				
						});

						if (aHTMLTags.length > 0)
						{
							aHTML.push('<table style="margin-top:10px;">');
											
							aHTML.push('<tr><td class="ns1blankspaceCaption" style="font-size:0.825em;">TAGS</td</tr>');

							aHTML.push(aHTMLTags.join(''));
											
							aHTML.push('</table>');	
						}
										
						$('#ns1blankspaceTemplateColumn2_' + sTemplate).html(aHTML.join(''));

						$('#ns1blankspaceTemplate_variants_save_' + sTemplate)
						.button(
						{
							label: "Save"
						})
						.click(function()
						{
							ns1blankspace.format.templates.edit.save(oParam);
						})
						.css('width', (bVariants?'38px':'54px'))
						.css('padding-left', (bVariants?'4px':'12px'))
						.css('height', '28px')
						.next()
							.button(
							{
								text: false,
								icons:
								{
									primary: "ui-icon-close"
								}
							})
							.click(function()
							{
								if (confirm('Click OK to delete this template, else click Cancel.'))
								{
									ns1blankspace.format.templates.edit.remove(oParam);
								}	
							})
							.css('font-size', '0.725em')
							.css('width', '20px')
							.css('height', '28px')
							.css('margin-left', '2px')
							.css('padding-left', '3px')	
							.css('padding-top', '6px')	
						.next()
							.button(
							{
								text: false,
								icons:
								{
									primary: "ui-icon-plus"
								}
							})
							.click(function()
							{
								if (confirm('Click OK to add a new template, else click Cancel.'))
								{
									oParam = ns1blankspace.util.setParam(oParam, 'new', true);
									ns1blankspace.format.templates.edit.init(oParam);
								}	
							})
							.css('font-size', '0.725em')
							.css('width', '20px')
							.css('height', '28px')
							.css('margin-left', '2px')
							.css('padding-left', '3px')	
							.css('padding-top', '6px')	
							.parent()
								.buttonset();	

						$('#ns1blankspaceTemplate_variants_save_' + sTemplate).find('span').css('padding-left', '4px');		

						$('#ns1blankspaceTemplate_variants_' + sTemplate + ' .ns1blankspaceRowSelect').click(function ()
						{
							oParam = ns1blankspace.util.setParam(oParam, 'document', this.id.split('-')[1]);
							ns1blankspace.format.templates.edit.init(oParam);
						});

						var aHTML = [];
						
						aHTML.push('<table id="ns1blankspaceColumn1" class="ns1blankspaceTemplateText_' + sTemplate + '" data-editorcount="' + ns1blankspace.counter.editor + '"">');

						if (bVariants)
						{
							aHTML.push('<tr class="ns1blankspace">' +
											'<td class="ns1blankspaceText">' +
											'<input id="ns1blankspaceTemplateTitle_' + sTemplate + ns1blankspace.counter.editor + '" class="ns1blankspaceText">' +
											'</td></tr>');
						}	
								
						aHTML.push('<tr><td>' +
										'<textarea rows="30" cols="50" id="ns1blankspaceTemplateText_' + sTemplate +
											ns1blankspace.counter.editor + '" data-editorcount="' + ns1blankspace.counter.editor +
											'" class="ns1blankspaceTextMulti"></textarea>' +
										'</td></tr>');
										
						aHTML.push('</table>');					
						
						$('#ns1blankspaceTemplateColumn1_' + sTemplate).html(aHTML.join(''));

						var oTemplate = ns1blankspace.format.templates.get(oParam);
						
						$('#ns1blankspaceTemplateText_' + sTemplate + ns1blankspace.counter.editor).val(oTemplate.xhtml);
						$('#ns1blankspaceTemplateTitle_' + sTemplate + ns1blankspace.counter.editor).val(oTemplate.title);

						ns1blankspace.format.editor.init(
						{
							height: '500px',
							selector: '#ns1blankspaceTemplateText_' + sTemplate + ns1blankspace.counter.editor
						});

						$('.interfaceFormatTags')
						.hover( function()
						{	
							oMCEBookmark = tinyMCE.get('ns1blankspaceTemplateText_' + sTemplate + ns1blankspace.counter.editor).selection.getBookmark({type: 1, normalized: true});
						})
						.click( function()
						{
							ns1blankspace.format.editor.addTag(
							{
								xhtmlElementID: this.id,
								editorID: 'ns1blankspaceTemplateText_' + sTemplate + ns1blankspace.counter.editor, 
								mceBookmark: oMCEBookmark
							});
						});
					}
				},	

	save:		function (oParam)
				{
					var sTemplate = ns1blankspace.util.getParam(oParam, 'template', {"default": 'invoice'}).value;
					var sCounter = $('table.ns1blankspaceTemplateText_' + sTemplate).attr('data-editorcount');
					var iDocument = ns1blankspace.util.getParam(oParam, 'document').value;
					var sTitle = ns1blankspace.util.getParam(oParam, 'title', {"default": sTemplate.toUpperCase() + ' TEMPLATE'}).value 

					ns1blankspace.status.working();

					if ($('#ns1blankspaceTemplateTitle_' + sTemplate + sCounter).length > 0)
					{
						sTitle = $('#ns1blankspaceTemplateTitle_' + sTemplate + sCounter).val();
					}	

					var oData = {id: iDocument};
					oData.content = tinyMCE.get('ns1blankspaceTemplateText_' + sTemplate + sCounter).getContent();
					oData.type = 10;
					oData.title = sTitle;

					$.ajax(
					{
						type: 'POST',
						url: ns1blankspace.util.endpointURI('DOCUMENT_MANAGE'),
						data: oData,
						dataType: 'json',
						success: function(data)
						{
							var sCounter = $('table.ns1blankspaceTemplateText_' + sTemplate).attr('data-editorcount');
							$('#ns1blankspaceTemplate_variants-' + iDocument).text(sTitle);
							ns1blankspace.status.message('Saved');
						}
					});
				},

	remove:	function (oParam)
				{
					var iDocument = ns1blankspace.util.getParam(oParam, 'document').value;
					
					ns1blankspace.status.working();

					var oData = {id: iDocument, remove: 1};
					
					$.ajax(
					{
						type: 'POST',
						url: ns1blankspace.util.endpointURI('DOCUMENT_MANAGE'),
						data: oData,
						dataType: 'json',
						success: function(data)
						{
							ns1blankspace.status.message('Removed');
							delete oParam.document;
							ns1blankspace.format.templates.edit.init(oParam);
						}
					});
				}				
}				





