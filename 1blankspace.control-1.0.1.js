/*!
 * 1blankspace
 * http://1blankspace.com/
 *
 * Copyright 2010, ibCom Pty Ltd
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://1blankspace.com/license
 */

var gbRoleBase = false;
var gbRoleOperations = false;
var gbRoleFinancials = false;
var gbRoleSetup = false;
var gbRoleSpecial1 = false;

var gsLoadingXHTML = '<img class="interfaceLoading" src="/jscripts/1blankspace.loading.square.20.gif">';
var gsLoadingSmallXHTML = '<img class="interfaceLoadingSmall" id="imgInterfaceLoadingSmall" src="/jscripts/1blankspace.loading.square.10.gif">';
var giReturnRows = 20;
var gsEditorCSS = '';
var gsViewportDefault = "People";
var gsSetupViewportDefault = "Website";

var giObjectPerson = 32;
var giObjectBusiness = 12;
var giObjectOpportunity = 35;

var gaAttachmentTypes = [];
var gaNetworkGroups;

var gbDebug = true;
var gbShowAdd = true;
var gbReturnToLast = true;
var gbShowBrowseBar = false;

var gbMessagingEmailShowCount = false;
var gsMessagingEmailAccount = '';
var giMessagingCheckForNew = 60000;

ns1blankspace.loadingXHTML = gsLoadingXHTML;
ns1blankspace.loadingSmallXHTML = gsLoadingSmallXHTML

if (ns1blankspace.financial === undefined) {ns1blankspace.financial = {}}

ns1blankspace.financial.summaryUseTemplate = false; 
ns1blankspace.financial.defaultInvoiceTemplateXHTML = '/jscripts/1blankspace.setup.financial.invoice-1.0.0.html';


ns1blankspace.viewports = 
[
	{
		title: "People",
		endpoint: "CONTACT_PERSON",
		show: true,
		group: 1
	},
	{
		title: "Businesses",
		endpoint: "CONTACT_BUSINESS",
		show: true,
		group: 1
	},
	{
		title: "Opportunities",
		endpoint: "OPPORTUNITY",
		show: true,
		group: 1
	},
	{
		title: "Email",
		endpoint: "MESSAGING_EMAIL",
		show: true,
		group: 1
	},
	{
		title: "Conversations",
		endpoint: "MESSAGING_CONVERSATION",
		show: true,
		group: 1
	},
	{
		title: "Projects",
		endpoint: "PROJECT",
		show: true,
		group: 2
	},
	{
		title: "Project Tasks",
		endpoint: "PROJECT_TASK",
		show: true,
		group: 2
	},
	{
		title: "Actions",
		endpoint: "ACTION",
		show: true,
		group: 2
	},
	{
		title: "Documents",
		endpoint: "DOCUMENT",
		show: true,
		group: 3
	},
	{
		title: "News",
		endpoint: "NEWS",
		show: true,
		group: 3
	},
	{
		title: "Events",
		endpoint: "EVENT",
		show: true,
		group: 3
	},
	{
		title: "Products",
		endpoint: "PRODUCT",
		show: true,
		group: 4
	},
	{
		title: "Orders",
		endpoint: "PRODUCT_ORDER",
		show: true,
		group: 4
	},
	{
		title: "Financials",
		endpoint: "FINANCIAL",
		show: true,
		group: 5
	},
	{
		title: "Bank Accounts",
		endpoint: "FINANCIAL_BANK_ACCOUNT",
		show: true,
		group: 5
	},
	{
		title: "Invoices",
		endpoint: "FINANCIAL_INVOICE",
		show: true,
		group: 5
	},
	{
		title: "Expenses",
		endpoint: "FINANCIAL_EXPENSE",
		show: true,
		group: 5
	},
	{
		title: "Receipts",
		endpoint: "FINANCIAL_RECEIPT",
		show: true,
		group: 5
	},
	{
		title: "Payments",
		endpoint: "FINANCIAL_PAYMENT",
		show: true,
		group: 5
	},
	{
		title: "Payroll",
		endpoint: "FINANCIAL_PAYROLL",
		show: true,
		group: 5
	},
	{
		title: "Reporting",
		endpoint: "DASHBOARD", 
		show: true,
		group: 6
	},
	{
		title: "Tax",
		endpoint: "FINANCIAL_TAX",
		show: true,
		group: 6
	},
	{
		title: "Structures",
		endpoint: "STRUCTURE", 
		show: true,
		group: 6
	},
]

function interfaceControlSecurity(aParam, oResponse)
{
	var iStep = 1;
	var aRoles = [];

	if (aParam != undefined)
	{
		if (aParam.step != undefined) {iStep = aParam.step}
		if (aParam.roles != undefined) {aRoles = aParam.roles}
	}
	else
	{
		aParam = {};
	}
		
	if (iStep == 1)
	{
		if (ns1blankspace.userUnrestricted)
		{
			$.extend(true, aParam, {step: 4});
			interfaceControlSecurity(aParam)
		}
		else
		{
			if (oResponse == undefined)
			{
				var oSearch = new AdvancedSearch();
				oSearch.method = 'SETUP_USER_ROLE_SEARCH';
				oSearch.addField('role');
				oSearch.addFilter('user', 'EQUAL_TO', ns1blankspace.user);
				oSearch.async = false;
				
				oSearch.getResults(function(data) {interfaceControlSecurity(aParam, data)})
			}
			else
			{
				var aIDs = [];

				$(oResponse.data.rows).each(function()
				{
					aIDs.push(this.role);	
				})

				$.extend(true, aParam, {step: 2, roles: aIDs});
				interfaceControlSecurity(aParam);
			}
		}	
	}

	else if (iStep == 2)
	{
		if (oResponse == undefined)
		{
			var oSearch = new AdvancedSearch();
			oSearch.method = 'SETUP_ROLE_METHOD_ACCESS_SEARCH';
			oSearch.addField('accessmethodtext,canadd,canremove,canupdate,canuse');
			oSearch.addFilter('role', 'IN_LIST', aRoles.join(','));
			oSearch.getResults(function(data) {interfaceControlSecurity(aParam, data)})
		}
		else
		{
			ns1blankspace.userMethods = oResponse.data.rows;
			$.extend(true, aParam, {step: 3});
			interfaceControlSecurity(aParam);
		}
	}

	else if (iStep == 3)
	{
		$(ns1blankspace.viewports).each(function(i, k)
		{
			var oMethods = $.grep(ns1blankspace.userMethods, function (a) {return (a.accessmethodtext).indexOf(k.endpoint) != -1;})	
			if (oMethods.length == 0) {this.show = false};
		});
	}

	else if (iStep == 4)
	{
		//manipulate ns1blankspace.viewports

	}	
	
	gbRoleSetup = gbSystemAdmin;
	
	//Show the setup icon?
	if (gbRoleSetup) {gbSetupShow = true};

	//Change the default viewport control menu option
	if (gbRoleSpecial1) 
	{
		gsViewportDefault = "Special 1"
	}	
	
}

function interfaceControlSetMasterViewport()
{
	if (gbRoleSpecial1) 
	{
		interfaceSpecialMasterViewport();
	}	
	else
	{
		interfaceContactPersonMasterViewport({showHome: false});
	}	
}

function interfaceControlSetSetupMasterViewport()
{
	interfaceSetupWebsiteMasterViewport();
}

function interfaceControlOptions()
{
	var aHTML = [];
	var oViewport;

	if (ns1blankspace.viewportXHTML == undefined)
	{
		aHTML.push('<table id="tableInterfaceViewportMasterControl" class="interfaceViewportMasterControl">');
		aHTML.push('<tr id="trInterfaceViewportMasterControlRow1" class="interfaceViewportMasterControl">');

		var aHTMLViewport = [];

		var oViewport = $.grep(ns1blankspace.viewports, function (a) {return a.title == 'People';})[0];
		if (oViewport ? oViewport.show : false)
		{		
			aHTMLViewport.push('<tr id="trInterfaceViewportMasterControlContactPerson" class="interfaceViewportMasterControl">' +
					'<td id="tdInterfaceViewportMasterControlContactPerson" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlContactPerson" class="interfaceViewportMasterControl">' + 
					'People</span>' +
					'</td></tr>');
		}			

		var oViewport = $.grep(ns1blankspace.viewports, function (a) {return a.title == 'Businesses';})[0];	
		if (oViewport ? oViewport.show : false)
		{	
			aHTMLViewport.push('<tr id="trInterfaceViewportMasterControlContactBusiness" class="interfaceViewportMasterControl">' +
					'<td id="tdInterfaceViewportMasterControlContactBusiness" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlContactBusiness" class="interfaceViewportMasterControl">' + 
					'Businesses</span>' +
					'</td></tr>');
		}	

		var oViewport = $.grep(ns1blankspace.viewports, function (a) {return a.title == 'Opportunities';})[0];	
		if (oViewport ? oViewport.show : false)
		{	
				aHTMLViewport.push('<tr id="trInterfaceViewportMasterControlOpportunity" class="interfaceViewportMasterControl">' +	
					'<td id="tdInterfaceViewportMasterControlOpportunity" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlOpportunity" class="interfaceViewportMasterControl">' + 
					'Opportunities</span>' +
					'</td>' +
					'</tr>');	
		}
		
		var oViewport = $.grep(ns1blankspace.viewports, function (a) {return a.title == 'Email';})[0];		
		if (oViewport ? oViewport.show : false)
		{	
			aHTMLViewport.push('<tr id="trInterfaceViewportMasterControlMessaging" class="interfaceViewportMasterControl">' +	
					'<td id="tdInterfaceViewportMasterControlMessaging" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlMessaging" class="interfaceViewportMasterControl">' + 
					'Email</span>' +
					'</td>' +
					'</tr>');
		}
		
		var oViewport = $.grep(ns1blankspace.viewports, function (a) {return a.title == 'Conversations';})[0];	
		if (oViewport ? oViewport.show : false)
		{
			aHTMLViewport.push('<tr id="trInterfaceViewportMasterControlMessagingConversation" class="interfaceViewportMasterControl">' +	
					'<td id="tdInterfaceViewportMasterControlMessagingConversation" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlMessagingConversation" class="interfaceViewportMasterControl">' + 
					'Conversations</span>' +
					'</td>' +
					'</tr>');	
		}
	
		if (aHTMLViewport.length > 0)
		{
			aHTML.push('<td class="interfaceViewportMasterControlColumn">');
			aHTML.push('<table class="interfaceViewportMasterControlColumn">');

			aHTML.push('<tr class="interfaceViewportMasterControl">' +
						'<td id="interfaceMasterViewportContact" class="interfaceMasterViewportImage">' +
						'&nbsp;' +
						'</td></tr>');			
		
			aHTML.push(aHTMLViewport.join(''))

			aHTML.push('</table>');
			aHTML.push('</td>');
		}	

		var aHTMLViewport = [];

		var oViewport = $.grep(ns1blankspace.viewports, function (a) {return a.title == 'Projects';})[0];
		if (oViewport ? oViewport.show : false)
		{		
			aHTMLViewport.push('<tr id="trInterfaceViewportMasterControlProject" class="interfaceViewportMasterControl">' +
					'<td id="tdInterfaceViewportMasterControlProject" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlProject" class="interfaceViewportMasterControl">' + 
					'Projects</span>' +
					'</td></tr>');
		}		

		var oViewport = $.grep(ns1blankspace.viewports, function (a) {return a.title == 'Project Tasks';})[0];
		if (oViewport ? oViewport.show : false)
		{		
			aHTMLViewport.push('<tr id="trInterfaceViewportMasterControlProjectTask" class="interfaceViewportMasterControl">' +
					'<td id="tdInterfaceViewportMasterControlProjectTask" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlProjectTask" class="interfaceViewportMasterControl">' + 
					'Project Tasks</span>' +
					'</td></tr>');
		}		

		var oViewport = $.grep(ns1blankspace.viewports, function (a) {return a.title == 'Actions';})[0];
		if (oViewport ? oViewport.show : false)
		{		
			aHTMLViewport.push('<tr id="trInterfaceViewportMasterControlAction" class="interfaceViewportMasterControl">' +				
					'<td id="tdInterfaceViewportMasterControlAction" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlAction" class="interfaceViewportMasterControl">' +
					'Actions</span>' +
					'</td>' +
					'</tr>');
		}			

		if (aHTMLViewport.length > 0)
		{
			aHTML.push('<td class="interfaceViewportMasterControlColumn">');
			aHTML.push('<table class="interfaceViewportMasterControlColumn">');

			aHTML.push('<tr class="interfaceViewportMasterControl">' +
						'<td id="interfaceMasterViewportProject" class="interfaceMasterViewportImage">' +
						'&nbsp;' +
						'</td></tr>');			
		
			aHTML.push(aHTMLViewport.join(''))

			aHTML.push('</table>');
			aHTML.push('</td>');
		}	
					
		var aHTMLViewport = [];

		var oViewport = $.grep(ns1blankspace.viewports, function (a) {return a.title == 'Documents';})[0];
		if (oViewport ? oViewport.show : false)
		{		
			aHTMLViewport.push('<tr id="trInterfaceViewportMasterControlDocument" class="interfaceViewportMasterControl">' +
					'<td id="tdInterfaceViewportMasterControlDocument" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlDocument" class="interfaceViewportMasterControl">' +
					'Documents</span>' +
					'</td></tr>');
		}		

		var oViewport = $.grep(ns1blankspace.viewports, function (a) {return a.title == 'News';})[0];
		if (oViewport ? oViewport.show : false)
		{		
			aHTMLViewport.push('<tr id="trInterfaceViewportMasterControlNews" class="interfaceViewportMasterControl">' +
					'<td id="tdInterfaceViewportMasterControlNews" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlNews" class="interfaceViewportMasterControl">' +
					'News</span>' +
					'</td></tr>');
		}		
		
		var oViewport = $.grep(ns1blankspace.viewports, function (a) {return a.title == 'Events';})[0];
		if (oViewport ? oViewport.show : false)
		{		
			aHTMLViewport.push('<tr id="trInterfaceViewportMasterControlEvent" class="interfaceViewportMasterControl">' +
					'<td id="tdInterfaceViewportMasterControlEvent" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlEvent" class="interfaceViewportMasterControl">' +
					'Events</span>' +
					'</td></tr>');
		}	

		if (aHTMLViewport.length > 0)
		{
			aHTML.push('<td class="interfaceViewportMasterControlColumn">');
			aHTML.push('<table class="interfaceViewportMasterControlColumn">');

			aHTML.push('<tr class="interfaceViewportMasterControl">' +
						'<td id="interfaceMasterViewportDocument" class="interfaceMasterViewportImage">' +
						'&nbsp;' +
						'</td></tr>');			
		
			aHTML.push(aHTMLViewport.join(''))

			aHTML.push('</table>');
			aHTML.push('</td>');
		}	
		
		var aHTMLViewport = [];

		var oViewport = $.grep(ns1blankspace.viewports, function (a) {return a.title == 'Products';})[0];
		if (oViewport ? oViewport.show : false)
		{		
			aHTMLViewport.push('<tr id="trInterfaceViewportMasterControlProduct" class="interfaceViewportMasterControl">' +
					'<td id="tdInterfaceViewportMasterControlProduct" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlProduct" class="interfaceViewportMasterControl">' +
					'Products</span>' +
					'</td></tr>');
		}		
		
		var oViewport = $.grep(ns1blankspace.viewports, function (a) {return a.title == 'Orders';})[0];
		if (oViewport ? oViewport.show : false)
		{		
			aHTMLViewport.push('<tr id="trInterfaceViewportMasterControlOrder" class="interfaceViewportMasterControl">' +
					'<td id="tdInterfaceViewportMasterControlOrder" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlOrder" class="interfaceViewportMasterControl">' +
					'Orders</span>' +
					'</td></tr>');
		}	

		if (aHTMLViewport.length > 0)
		{
			aHTML.push('<td class="interfaceViewportMasterControlColumn">');
			aHTML.push('<table class="interfaceViewportMasterControlColumn">');

			aHTML.push('<tr class="interfaceViewportMasterControl">' +
						'<td id="interfaceMasterViewportProduct" class="interfaceMasterViewportImage">' +
						'&nbsp;' +
						'</td></tr>');			
		
			aHTML.push(aHTMLViewport.join(''))

			aHTML.push('</table>');
			aHTML.push('</td>');
		}	

		var aHTMLViewport = [];

		var oViewport = $.grep(ns1blankspace.viewports, function (a) {return a.title == 'Financials';})[0];
		if (oViewport ? oViewport.show : false)
		{		
			aHTMLViewport.push('<tr id="trInterfaceViewportMasterControlFinancial" class="interfaceViewportMasterControl">' +
					'<td id="tdInterfaceViewportMasterControlFinancial" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlFinancial" class="interfaceViewportMasterControl">' +
					'Financials</span>' +
					'</td></tr>');
		}		

		var oViewport = $.grep(ns1blankspace.viewports, function (a) {return a.title == 'Bank Accounts';})[0];
		if (oViewport ? oViewport.show : false)
		{		
			aHTMLViewport.push('<tr id="trInterfaceViewportMasterControlFinancialBankAccount" class="interfaceViewportMasterControl">' +
					'<td id="tdInterfaceViewportMasterControlFinancialBankAccount" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlFinancialBankAccount" class="interfaceViewportMasterControl">' +
					'Bank Accounts</span>' +
					'</td></tr>');
		}	
		
		var oViewport = $.grep(ns1blankspace.viewports, function (a) {return a.title == 'Invoices';})[0];
		if (oViewport ? oViewport.show : false)
		{		
			aHTMLViewport.push('<tr id="trInterfaceViewportMasterControlFinancialInvoice" class="interfaceViewportMasterControl">' +
					'<td id="tdInterfaceViewportMasterControlFinancialInvoice" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlFinancialInvoice" class="interfaceViewportMasterControl">' +
					'Invoices</span>' +
					'</td></tr>');
		}

		var oViewport = $.grep(ns1blankspace.viewports, function (a) {return a.title == 'Expenses';})[0];
		if (oViewport ? oViewport.show : false)
		{		
			aHTMLViewport.push('<tr id="trInterfaceViewportMasterControlFinancialExpense" class="interfaceViewportMasterControl">' +
					'<td id="tdInterfaceViewportMasterControlFinancialExpense" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlFinancialExpense" class="interfaceViewportMasterControl">' +
					'Expenses</span>' +
					'</td></tr>');
		}

		var oViewport = $.grep(ns1blankspace.viewports, function (a) {return a.title == 'Receipts';})[0];
		if (oViewport ? oViewport.show : false)
		{		
			aHTMLViewport.push('<tr id="trInterfaceViewportMasterControlFinancialReceipt" class="interfaceViewportMasterControl">' +
					'<td id="tdInterfaceViewportMasterControlFinancialReceipt" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlFinancialReceipt" class="interfaceViewportMasterControl">' +
					'Receipts</span>' +
					'</td></tr>');
		}	

		var oViewport = $.grep(ns1blankspace.viewports, function (a) {return a.title == 'Payments';})[0];
		if (oViewport ? oViewport.show : false)
		{		
			aHTMLViewport.push('<tr id="trInterfaceViewportMasterControlFinancialPayment" class="interfaceViewportMasterControl">' +
					'<td id="tdInterfaceViewportMasterControlFinancialPayment" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlFinancialPayment" class="interfaceViewportMasterControl">' +
					'Payments</span>' +
					'</td></tr>');
		}	

		var oViewport = $.grep(ns1blankspace.viewports, function (a) {return a.title == 'Payroll';})[0];
		if (oViewport ? oViewport.show : false)
		{		
			aHTMLViewport.push('<tr id="trInterfaceViewportMasterControlFinancialPayroll" class="interfaceViewportMasterControl">' +
					'<td id="tdInterfaceViewportMasterControlFinancialPayroll" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlFinancialPayroll" class="interfaceViewportMasterControl">' +
					'Payroll</span>' +
					'</td></tr>');
		}	

		if (aHTMLViewport.length > 0)
		{
			aHTML.push('<td class="interfaceViewportMasterControlColumn">');
			aHTML.push('<table class="interfaceViewportMasterControlColumn">');

			aHTML.push('<tr class="interfaceViewportMasterControl">' +
						'<td id="interfaceMasterViewportFinancial" class="interfaceMasterViewportImage">' +
						'&nbsp;' +
						'</td></tr>');			
		
			aHTML.push(aHTMLViewport.join(''))

			aHTML.push('</table>');
			aHTML.push('</td>');
		}	

		var aHTMLViewport = [];

		var oViewport = $.grep(ns1blankspace.viewports, function (a) {return a.title == 'Reporting';})[0];
		if (oViewport ? oViewport.show : false)
		{		
			aHTMLViewport.push('<tr id="trInterfaceViewportMasterControlReport" class="interfaceViewportMasterControl">' +
						'<td id="tdInterfaceViewportMasterControlReport" class="interfaceViewportMasterControl">' +
						'<span id="spanInterfaceViewportMasterControlReport" class="interfaceViewportMasterControl">' +
						'Reporting</span>' +
						'</td>' +
						'</tr>');
		}		
		
		var oViewport = $.grep(ns1blankspace.viewports, function (a) {return a.title == 'Tax';})[0];
		if (oViewport ? oViewport.show : false)
		{		
			aHTMLViewport.push('<tr id="trInterfaceViewportMasterControlFinancialTax" class="interfaceViewportMasterControl">' +
						'<td id="tdInterfaceViewportMasterControlFinancialTax" class="interfaceViewportMasterControl">' +
						'<span id="spanInterfaceViewportMasterControlFinancialTax" class="interfaceViewportMasterControl">' +
						'Tax</span>' +
						'</td>' +
						'</tr>');
		}

		var oViewport = $.grep(ns1blankspace.viewports, function (a) {return a.title == 'Structures';})[0];
		if (oViewport ? oViewport.show : false)
		{		
			aHTMLViewport.push('<tr id="trInterfaceViewportMasterControlStructure" class="interfaceViewportMasterControl">' +
						'<td id="tdInterfaceViewportMasterControlStructure" class="interfaceViewportMasterControl">' +
						'<span id="spanInterfaceViewportMasterControlStructure" class="interfaceViewportMasterControl">' +
						'Structures</span>' +
						'</td>' +
						'</tr>');
		}	

		if (aHTMLViewport.length > 0)
		{
			aHTML.push('<td class="interfaceViewportMasterControlColumn">');
			aHTML.push('<table class="interfaceViewportMasterControlColumn">');

			aHTML.push('<tr class="interfaceViewportMasterControl">' +
						'<td id="interfaceMasterViewportReport" class="interfaceMasterViewportImage">' +
						'&nbsp;' +
						'</td></tr>');			
		
			aHTML.push(aHTMLViewport.join(''))

			aHTML.push('</table>');
			aHTML.push('</td>');
		}	

		aHTML.push('</tr></table>');

		ns1blankspace.viewportXHTML = aHTML.join('');
	}

	return ns1blankspace.viewportXHTML;
		
}

function interfaceControlOptionsBind()
{
	$('#tdInterfaceViewportMasterControlContactPerson').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceContactPersonMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlContactBusiness').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceContactBusinessMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlOpportunity').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceOpportunityMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlProject').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceProjectMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlProjectTask').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceProjectTaskMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlAction').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceActionMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlDocument').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceDocumentMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlNews').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceNewsMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlEvent').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceEventMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlProduct').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceProductMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlOrder').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceOrderMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlFinancial').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceFinancialMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlFinancialBankAccount').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceFinancialBankAccountMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlFinancialInvoice').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceFinancialInvoiceMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlFinancialExpense').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceFinancialExpenseMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlFinancialReceipt').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceFinancialReceiptMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlFinancialPayment').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceFinancialPaymentMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlFinancialTax').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceFinancialTaxMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlFinancialPayroll').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceFinancialPayrollMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlHelp').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceHelpMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlMessaging').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceMessagingIMAPMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlMessagingConversation').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceMessagingConversationMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlReport').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceReportMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlStructure').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceStructureMasterViewport();
	});
	
}

function interfaceControlSetupOptions()
{
	var aHTML = [];
	var h = -1;
			
	aHTML[++h] = '<table id="tableInterfaceViewportMasterSetupControl" class="interfaceViewportMasterControl">';
	aHTML[++h] = '<tr id="trInterfaceViewportMasterSetupControlRow1" class="interfaceViewportMasterControl">';
	
	if (gbRoleSetup)
	{	
	
		aHTML[++h] = '<td id="tdInterfaceViewportMasterSetupControlColumn1" class="interfaceViewportMasterControlColumn">';
		aHTML[++h] = '<table id="tableInterfaceViewportMasterSetupControlColumn1" class="interfaceViewportMasterControlColumn">';

		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlSetupUser" class="interfaceViewportMasterControl">' +	
					'<td id="tdInterfaceViewportMasterControlSetupUser" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlSetupUser" class="interfaceViewportMasterControl">' +
					'Users</span>' +
					'</td></tr>';
	
		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlSetupUserRole" class="interfaceViewportMasterControl">' +	
					'<td id="tdInterfaceViewportMasterControlSetupUserRole" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlSetupUserRole" class="interfaceViewportMasterControl">' +
					'User Roles</span>' +
					'</td></tr>';

		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlSetupNetworkGroup" class="interfaceViewportMasterControl">' +	
					'<td id="tdInterfaceViewportMasterControlSetupNetworkGroup" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlSetupNetworkGroup" class="interfaceViewportMasterControl">' +
					'Network&nbsp;Groups</span>' +
					'</td></tr>';
					
		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlSetupMessaging" class="interfaceViewportMasterControl">' +	
					'<td id="tdInterfaceViewportMasterControlSetupMessaging" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlSetupMessaging" class="interfaceViewportMasterControl">' +
					'Messaging</span>' +
					'</td></tr>';			
					
		aHTML[++h] = '</table>';
		aHTML[++h] = '</td>';
		
		aHTML[++h] = '<td id="tdInterfaceViewportMasterSetupControlColumn2" class="interfaceViewportMasterControlColumn">';
		aHTML[++h] = '<table id="tableInterfaceViewportMasterSetupControlColumn2" class="interfaceViewportMasterControlColumn">';

		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlSetupWebsite" class="interfaceViewportMasterControl">' +
					'<td id="tdInterfaceViewportMasterControlSetupWebsite" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlSetupWebsite" class="interfaceViewportMasterControl">' +
					'Websites</span>' +
					'</td></tr>';
	
		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlSetupStructures" class="interfaceViewportMasterControl">' +	
					'<td id="tdInterfaceViewportMasterControlSetupStructures" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlSetupStructures" class="interfaceViewportMasterControl">' +
					'Structures</span>' +
					'</td></tr>';
					
		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlSetupAutomation" class="interfaceViewportMasterControl">' +	
					'<td id="tdInterfaceViewportMasterControlSetupAutomation" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlSetupAutomation" class="interfaceViewportMasterControl">' +
					'Automation</span>' +
					'</td></tr>';			
					
		if (false)
		{
			aHTML[++h] = '<tr id="trInterfaceViewportMasterControlSetupImport" class="interfaceViewportMasterControl">' +	
						 '<td id="tdInterfaceViewportMasterControlSetupImport" class="interfaceViewportMasterControl">' +
						 '<span id="spanInterfaceViewportMasterControlSetupImport" class="interfaceViewportMasterControl">' +
						 'Imports</span>' +
						 '</td></tr>';
		}
					
		aHTML[++h] = '</table>';
		aHTML[++h] = '</td>';
	
		aHTML[++h] = '<td id="tdInterfaceViewportMasterSetupControlColumn2" class="interfaceViewportMasterControlColumn">';
		aHTML[++h] = '<table id="tableInterfaceViewportMasterSetupControlColumn2" class="interfaceViewportMasterControlColumn">';

		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlSetupFinancial" class="interfaceViewportMasterControl">' +	
					'<td id="tdInterfaceViewportMasterControlSetupFinancial" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlSetupFinancial" class="interfaceViewportMasterControl">' +
					'Financials</span>' +
					'</td></tr>';
					
		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlSetupContactBusinessGroup" class="interfaceViewportMasterControl">' +	
					'<td id="tdInterfaceViewportMasterControlSetupContactBusinessGroup" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlSetupContactBusinessGroup" class="interfaceViewportMasterControl">' +
					'Contact&nbsp;Business&nbsp;Groups</span>' +
					'</td></tr>';
					
		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlSetupContactPersonGroup" class="interfaceViewportMasterControl">' +	
					'<td id="tdInterfaceViewportMasterControlSetupContactPersonGroup" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlSetupContactPersonGroup" class="interfaceViewportMasterControl">' +
					'Contact&nbsp;Person&nbsp;Groups</span>' +
					'</td></tr>';
					
		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlSetupProject" class="interfaceViewportMasterControl">' +	
					'<td id="tdInterfaceViewportMasterControlSetupProject" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlSetupProject" class="interfaceViewportMasterControl">' +
					'Project&nbsp;Templates</span>' +
					'</td></tr>';
	
		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlSetupProjectTask" class="interfaceViewportMasterControl">' +	
					'<td id="tdInterfaceViewportMasterControlSetupProjectTask" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlSetupProjectTask" class="interfaceViewportMasterControl">' +
					'Project&nbsp;Template&nbsp;Tasks</span>' +
					'</td></tr>';
	
		aHTML[++h] = '</table>';
		aHTML[++h] = '</td>';

		aHTML[++h] = '<td id="tdInterfaceViewportMasterSetupControlColumn3" class="interfaceViewportMasterControlColumn">';
		aHTML[++h] = '<table id="tableInterfaceViewportMasterSetupControlColumn3" class="interfaceViewportMasterControlColumn">';

		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlSupportIssue" class="interfaceViewportMasterControl">' +	
					'<td id="tdInterfaceViewportMasterControlSupportIssue" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlSupportIssue" class="interfaceViewportMasterControl">' +
					'Support&nbsp;Issues</span>' +
					'</td></tr>';
					
		aHTML[++h] = '</table>';
		aHTML[++h] = '</td>';
		
	}	
	
	aHTML[++h] = '</tr></table>'
	
	return aHTML.join('');	
}

function interfaceControlSetupOptionsBind()
{
	$('#tdInterfaceViewportMasterControlSetupWebsite').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceSetupWebsiteMasterViewport();
	});
		
	$('#tdInterfaceViewportMasterControlSetupUser').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceSetupUserMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlSetupUserRole').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceSetupUserRoleMasterViewport();
	});

	$('#tdInterfaceViewportMasterControlSetupNetworkGroup').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceSetupNetworkGroupMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlSetupAutomation').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceSetupAutomationMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlSetupMessaging').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceSetupMessagingMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlSetupImport').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceSetupImportMasterViewport();
	});

	$('#tdInterfaceViewportMasterControlSetupFinancial').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceSetupFinancialMasterViewport();
	});

	$('#tdInterfaceViewportMasterControlSetupContactBusinessGroup').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceSetupMasterViewport(
				{
				setupName: "Contact Business Groups",
				setupMethod: "SETUP_CONTACT_BUSINESS_GROUP"
				});
	});
	
	$('#tdInterfaceViewportMasterControlSetupContactPersonGroup').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceSetupMasterViewport(
				{
				setupName: "Contact Person Groups",
				setupMethod: "SETUP_CONTACT_PERSON_GROUP"
				});
	});
	
	$('#tdInterfaceViewportMasterControlSetupProject').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceSetupProjectMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlSetupProjectTaak').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceSetupProjectTaskMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlSupportIssue').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceSupportIssueMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlSetupStructures').click(function(event)
	{
		interfaceSetupStructureMasterViewport();
	});
}

function interfaceControlUserOptionsShow(oElement)
{
	if ($('#divInterfaceMasterViewportControlOptions').attr('onDemandSource') == oElement.id)
	{
		$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
		$('#divInterfaceMasterViewportControlOptions').attr('onDemandSource', '');
	}
	else
	{	
		$('#divInterfaceMasterViewportControlOptions').attr('onDemandSource', oElement.id);
		$('#divInterfaceMasterViewportControlOptions').html("&nbsp;");
		$('#divInterfaceMasterViewportControlOptions').show(giShowSpeedOptions);
		$('#divInterfaceMasterViewportControlOptions').offset({ top: $(oElement).offset().top + $(oElement).height(), left: $(oElement).offset().left - 22 });
		$('#divInterfaceMasterViewportControlOptions').html(interfaceControlUserOptions);
			
		interfaceControlUserOptionsBind();
	}	
}


function interfaceControlUserOptions()
{

	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<table id="tableInterfaceMasterUserOptions" class="interfaceViewportMasterControl" cellpadding=6>';
		
	aHTML[++h] = '<tr id="trInterfaceMasterUserOptionsLogOff" class="interfaceMasterUserOptions">' +
					'<td id="tdInterfaceMasterUserOptionsLogOff" class="interfaceMasterUserOptions">' +
					'Log Off' +
					'</td>' +
					'</tr>'
				
	aHTML[++h] = '<tr id="trInterfaceMasterUserOptionsChangePassword" class="interfaceMasterUserOptions">' +
					'<td id="tdInterfaceMasterUserOptionsChangePassword" class="interfaceMasterUserOptions">' +
					'Change My Password' +
					'</td>' +
					'</tr>'			
				
	aHTML[++h] = '<tr id="trInterfaceMasterUserOptionsCreateSecureKey" class="interfaceMasterUserOptions">' +
					'<td id="tdInterfaceMasterUserOptionsCreateSecureKey" class="interfaceMasterUserOptions">' +
					'Secure Access Token' +
					'</td>' +
					'</tr>'						
					
	aHTML[++h] = '</table>'
	
	return aHTML.join('');
}

function interfaceControlUserOptionsBind()
{

	$('#tdInterfaceMasterUserOptionsLogOff').click(function(event)
	{
		interfaceMasterLogoff();
	})
	
	$('#tdInterfaceMasterUserOptionsChangePassword').click(function(event)
	{
		$(this).html(gsLoadingSmallXHTML);
		interfaceMasterUserOptionsChangePassword();
	});
	
	$('#tdInterfaceMasterUserOptionsCreateSecureKey').click(function(event)
	{
		$(this).html(gsLoadingSmallXHTML);
		interfaceMasterUserOptionsCreateSecureKey();
	});
}

function interfaceControlSpaceOptionsShow(oElement)
{
	if ($('#divInterfaceMasterViewportControlOptions').attr('onDemandSource') == oElement.id)
	{
		$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
		$('#divInterfaceMasterViewportControlOptions').attr('onDemandSource', '');
	}
	else
	{	
		$('#divInterfaceMasterViewportControlOptions').attr('onDemandSource', oElement.id);
		$('#divInterfaceMasterViewportControlOptions').html("&nbsp;");
		$('#divInterfaceMasterViewportControlOptions').show(giShowSpeedOptions);
		$('#divInterfaceMasterViewportControlOptions').offset({ top: $(oElement).offset().top + $(oElement).height(), left: $(oElement).offset().left - 22 });
		$('#divInterfaceMasterViewportControlOptions').html(interfaceControlSpaceOptions);
			
		interfaceControlSpaceOptionsBind();
	}	
}

function interfaceControlSpaceOptions(aParam, oResponse)
{

	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<table id="tableInterfaceMasterUserOptions" class="interfaceViewportMasterControl" cellpadding=6>';
		
	aHTML[++h] = '<tr id="trInterfaceMasterUserOptionsLogOff" class="interfaceMasterUserOptions">' +
					'<td id="tdInterfaceMasterUserOptionsLogOff" class="interfaceMasterUserOptions">' +
					'Log Off' +
					'</td>' +
					'</tr>'
				
					
					
	aHTML[++h] = '</table>'
	
	return aHTML.join('');
}

function interfaceControlUserOptionsBind()
{

	$('#tdInterfaceMasterUserOptionsLogOff').click(function(event)
	{
		interfaceMasterLogoff();
	})
	
	$('#tdInterfaceMasterUserOptionsChangePassword').click(function(event)
	{
		$(this).html(gsLoadingSmallXHTML);
		interfaceMasterUserOptionsChangePassword();
	});
	
	$('#tdInterfaceMasterUserOptionsCreateSecureKey').click(function(event)
	{
		$(this).html(gsLoadingSmallXHTML);
		interfaceMasterUserOptionsCreateSecureKey();
	});
}

function interfaceMasterUserOptionsChangePassword(aParam)
{
	var aHTML = [];
	var h = -1;
	var bShow = true;
	var sXHTMLElementID = 'divInterfaceMasterViewportControlOptions'
	
	if (aParam != undefined)
	{
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
		if (aParam.show != undefined) {bShow = aParam.show}
	}	
	
	aHTML[++h] = '<table id="tableInterfaceUserOptionsChangePassword" class="interfaceViewportMasterControl" style="width:350px;">';
		
	if (bShow)
	{
		interfaceMasterOptionsSetPosition(sXHTMLElementID, 0, -255)
		
		aHTML[++h] = '<tr class="interfaceHomeOptionContext">';
		aHTML[++h] = '<td class="interfaceHomeOptionContext">Change Password</td>';
		aHTML[++h] = '<td id="tdInterfaceHomeOptionClose" style="text-align:right;"><span id="spanInterfaceMainOptionsClose">Close</span></td>';
		aHTML[++h] = '</tr>';
	}
		
	aHTML[++h] = '<tr><td id="tdInterfaceUserOptionsChangePassword" style="font-size:0.875em" colspan=2></td></tr></table>';
	
	$('#' + sXHTMLElementID).html(aHTML.join(''));	
	
	$('#spanInterfaceMainOptionsClose').button(
	{
		text: false,
		 icons: {
			 primary: "ui-icon-close"
		}
	})
	.click(function() {
		$('#' + sXHTMLElementID).slideUp(500);
		$('#' + sXHTMLElementID).html('');
		$('#' + sXHTMLElementID).attr('onDemandSource', '');
	})
	.css('width', '20px')
	.css('height', '20px')
	
	interfaceMasterLogonChangePasswordShow({xhtmlElementID: 'tdInterfaceUserOptionsChangePassword'});
	
}

function interfaceMasterUserOptionsCreateSecureKey(aParam, oResponse)
{
	var aHTML = [];
	var h = -1;
	var bShow = true;
	var bSetPosition = true;
	var sXHTMLElementID = 'divInterfaceMasterViewportControlOptions'
	
	if (aParam != undefined)
	{
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
		if (aParam.show != undefined) {bShow = aParam.show}
		if (aParam.setPosition != undefined) {bSetPosition = aParam.setPosition}
	}	
	
	if (oResponse == undefined)
	{
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/core/?method=CORE_SECURE_TOKEN_SEARCH&rf=JSON',
			dataType: 'json',
			success: function(data) {interfaceMasterUserOptionsCreateSecureKey(aParam, data)}
		})
	}
	else
	{	
	
		aHTML[++h] = '<table id="tableInterfaceUserOptionsCreateSecureKey" class="interfaceViewportMasterControl" style="width:400px;"><tr><td>';	

		if (bSetPosition)
		{
			interfaceMasterOptionsSetPosition(sXHTMLElementID, 0, -305)
		}	
	
		if (bShow)
		{
			aHTML[++h] = '<table id="tableInterfaceUserOptionsCreateSecureKey" style="width:400px;>';	
			aHTML[++h] = '<tr class="interfaceHomeOptionContext">';
			aHTML[++h] = '<td class="interfaceHomeOptionContext">Secure Access Token</td>';
			aHTML[++h] = '<td id="tdInterfaceHomeOptionClose" style="text-align:right;"><span id="spanInterfaceMainOptionsClose">Close</span></td>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</table>';
		}
		
		aHTML[++h] = '<table id="tableInterfaceUserOptionsCreateSecureKey" style="width:400px;font-size:0.75em">';
		
		if (oResponse.access_token == undefined)
		{
			aHTML[++h] = '<tr><td>' +
								'<br />No key has been set up.  Click <b>New Token</b> to create a token, which you can use to link to your information.<br /><br /></td></tr>';
			
		}
		else
		{
		
			aHTML[++h] = '<tr><td>' +
								oResponse.access_token + '<br /><br /></td></tr>';
			
			aHTML[++h] = '<tr><td style="text-align:right;" id="tdInterfaceHomeOptionsCreateSecureKeyDisable"><span id="spanInterfaceHomeOptionsCreateSecureKeyDisable">Disable Token</span></td></tr>';								
			aHTML[++h] = '<tr><td>' +
								'<br />If you generate a new token, the current token will no longer work.<br /><br /></td></tr>';
			
		}
		
		aHTML[++h] = '<tr><td style="text-align:right;" id="tdInterfaceHomeOptionsCreateSecureKeyNew"><span id="spanInterfaceHomeOptionsCreateSecureKeyNew">New Token</span></td></tr>';
		
		if (oResponse.access_token != undefined)
		{
			aHTML[++h] = '<tr><td><br /><b>Example link for future diary events in iCal format:</b><br /><br />' +
								window.location.protocol + '//' + window.location.host + '/ondemand/action/' +
								'<br />?method=ACTION_ICAL_SEARCH' +
								'<br />&access_token=' + oResponse.access_token + '<br /><br /></td></tr>';
								
			aHTML[++h] = '<tr><td><a href="' +
								window.location.protocol + '//' + window.location.host + '/ondemand/action/?method=ACTION_ICAL_SEARCH' +
								'&access_token=' + oResponse.access_token + '" target="_blank" style="font-size:1.2em">Open example link</a>' +
								'<br /><span style="color: #A0A0A0;">(You can then copy & paste it)<br /><br /></span></td></tr>';					
		}
		
		aHTML[++h] = '</table>';
		
		aHTML[++h] = '</td></tr></table>';
		
		$('#' + sXHTMLElementID).html(aHTML.join(''));	
		
		$('#spanInterfaceMainOptionsClose').button(
		{
			text: false,
			 icons: {
				 primary: "ui-icon-close"
			}
		})
		.click(function() {
			$('#' + sXHTMLElementID).slideUp(500);
			$('#' + sXHTMLElementID).html('');
			$('#' + sXHTMLElementID).attr('onDemandSource', '');
		})
		.css('width', '20px')
		.css('height', '20px')
		
		$('#spanInterfaceHomeOptionsCreateSecureKeyDisable').button()
		.click(function() {
		
			if (confirm('Are you sure?'))
			{
				$.ajax(
				{
					type: 'POST',
					url: '/ondemand/core/?method=CORE_SECURE_TOKEN_MANAGE&remove=1&rf=TEXT',
					dataType: 'text',
					async: false,
					success: function(data) {interfaceMasterUserOptionsCreateSecureKey({setPosition: false})}
				})
			}		
		})
		.css('width', '150px')
		
		$('#spanInterfaceHomeOptionsCreateSecureKeyNew').button()
		.click(function() {
		
			if (confirm('Are you sure?'))
			{
				$.ajax(
				{
					type: 'POST',
					url: '/ondemand/core/?method=CORE_SECURE_TOKEN_MANAGE&rf=TEXT',
					dataType: 'text',
					async: false,
					success: function(data) {interfaceMasterUserOptionsCreateSecureKey({setPosition: false})}
				})
			}		
		})
		.css('width', '150px')
	}		
}

function interfaceControlHelpURL()
{
	return 'http://help.1blankspace.com';
}