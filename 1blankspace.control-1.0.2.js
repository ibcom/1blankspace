/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */

//var gbShowAdd = true;
//var gbReturnToLast = true;
//var gsMessagingEmailAccount = '';

ns1blankspace.xhtml.loading = '<img class="interfaceLoading" src="/jscripts/1blankspace.loading.square.20.gif">';
ns1blankspace.xhtml.loadingSmall = '<img class="interfaceLoadingSmall" id="imgInterfaceLoadingSmall" src="/jscripts/1blankspace.loading.square.10.gif">';
ns1blankspace.xhtml.editorCSS = '';

ns1blankspace.option.defaultRows = 20;
ns1blankspace.option.defaultViewport = "People";
ns1blankspace.option.defaultSetupViewport = "Website";

ns1blankspace.data.object = {person: 32, business: 12, opportunity: 35};
ns1blankspace.data.attachmentTypes = [];
ns1blankspace.data.networkGroups;

ns1blankspace.debug.enabled = true;

ns1blankspace.option.showBrowsing = false;
ns1blankspace.option.messagingEmailShowCount = false;
ns1blankspace.option.messagingCheckForNew = 60000;
ns1blankspace.option.helpURI = 'http://community.mydigitalstructure.com';

if (ns1blankspace.financial === undefined) {ns1blankspace.financial = {}}
if (ns1blankspace.control === undefined) {ns1blankspace.control = {}}

ns1blankspace.financial.summaryUseTemplate = false; 
ns1blankspace.financial.defaultInvoiceTemplateXHTML = '/jscripts/1blankspace.setup.financial.invoice-1.0.0.html';


ns1blankspace.control.user = 
{
	show: 		function (oElement)
				{

					$('#div1blankspaceViewportControlOptions').offset({ top: $(oElement).offset().top + $(oElement).height(), left: $(oElement).offset().left });
					$('#div1blankspaceViewportControlOptions').html(interfaceControlUserOptions());
					$('#div1blankspaceViewportControlOptions').show(ns1blankspace.option.showSpeedOptions);
					
					//interfaceControlUserOptionsBind();
					this.bind();  // ns1blankspace.control
				}
}	

ns1blankspace.viewports = 
[
	{
		title: "People",
		endpoint: "CONTACT_PERSON",
		show: true,
		group: 1,
		type: 1
	},
	{
		title: "Businesses",
		endpoint: "CONTACT_BUSINESS",
		show: true,
		group: 1,
		type: 1
	},
	{
		title: "Opportunities",
		endpoint: "OPPORTUNITY",
		show: true,
		group: 1,
		type: 1
	},
	{
		title: "Email",
		endpoint: "MESSAGING_EMAIL",
		show: true,
		group: 1,
		type: 1
	},
	{
		title: "Conversations",
		endpoint: "MESSAGING_CONVERSATION",
		show: true,
		group: 1,
		type: 1
	},
	{
		title: "Projects",
		endpoint: "PROJECT",
		show: true,
		group: 2,
		type: 1
	},
	{
		title: "Project Tasks",
		endpoint: "PROJECT_TASK",
		show: true,
		group: 2,
		type: 1
	},
	{
		title: "Actions",
		endpoint: "ACTION",
		show: true,
		group: 2,
		type: 1
	},
	{
		title: "Documents",
		endpoint: "DOCUMENT",
		show: true,
		group: 3,
		type: 1
	},
	{
		title: "News",
		endpoint: "NEWS",
		show: true,
		group: 3,
		type: 1
	},
	{
		title: "Events",
		endpoint: "EVENT",
		show: true,
		group: 3,
		type: 1
	},
	{
		title: "Products",
		endpoint: "PRODUCT",
		show: true,
		group: 4,
		type: 1
	},
	{
		title: "Orders",
		endpoint: "PRODUCT_ORDER",
		show: true,
		group: 4,
		type: 1
	},
	{
		title: "Financials",
		endpoint: "FINANCIAL",
		show: true,
		group: 5,
		type: 1
	},
	{
		title: "Bank Accounts",
		endpoint: "FINANCIAL_BANK_ACCOUNT",
		show: true,
		group: 5,
		type: 1
	},
	{
		title: "Invoices",
		endpoint: "FINANCIAL_INVOICE",
		show: true,
		group: 5,
		type: 1
	},
	{
		title: "Expenses",
		endpoint: "FINANCIAL_EXPENSE",
		show: true,
		group: 5,
		type: 1
	},
	{
		title: "Receipts",
		endpoint: "FINANCIAL_RECEIPT",
		show: true,
		group: 5,
		type: 1
	},
	{
		title: "Payments",
		endpoint: "FINANCIAL_PAYMENT",
		show: true,
		group: 5,
		type: 1
	},
	{
		title: "Payroll",
		endpoint: "FINANCIAL_PAYROLL",
		show: true,
		group: 5,
		type: 1
	},
	{
		title: "Reporting",
		endpoint: "DASHBOARD", 
		show: true,
		group: 6,
		type: 1
	},
	{
		title: "Tax",
		endpoint: "FINANCIAL_TAX",
		show: true,
		group: 6,
		type: 1
	},
	{
		title: "Structures",
		endpoint: "STRUCTURE", 
		show: true,
		group: 6,
		type: 1
	},
	{
		title: "Websites",
		endpoint: "SETUP_SITE", 
		show: true,
		group: 2,
		type: 2
	},
	{
		title: "Automation",
		endpoint: "SETUP_AUTOMATION", 
		show: true,
		group: 2,
		type: 2
	},
	{
		title: "My Account",
		endpoint: "ADMIN", 
		show: true,
		group: 4,
		type: 2
	},
	{
		title: "Support",
		endpoint: "SUPPORT", 
		show: false,
		group: 4,
		type: 2
	}
]

function interfaceControlSecurity(oParam, oResponse)
{
	var iStep = 1;
	var aRoles = [];

	if (oParam != undefined)
	{
		if (oParam.step != undefined) {iStep = oParam.step}
		if (oParam.roles != undefined) {aRoles = oParam.roles}
	}
	else
	{
		oParam = {};
	}
		
	if (iStep == 1)
	{
		if (ns1blankspace.userUnrestricted)
		{
			$.extend(true, oParam, {step: 4});
			interfaceControlSecurity(oParam)
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
				
				oSearch.getResults(function(data) {interfaceControlSecurity(oParam, data)})
			}
			else
			{
				var aIDs = [];

				$(oResponse.data.rows).each(function()
				{
					aIDs.push(this.role);	
				})

				$.extend(true, oParam, {step: 2, roles: aIDs});
				interfaceControlSecurity(oParam);
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
			oSearch.getResults(function(data) {interfaceControlSecurity(oParam, data)})
		}
		else
		{
			ns1blankspace.userMethods = oResponse.data.rows;
			$.extend(true, oParam, {step: 3});
			interfaceControlSecurity(oParam);
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
	
	gbRoleSetup = ns1blankspace.systemAdmin;
	
	//Show the setup icon?
	if (gbRoleSetup) {ns1blankspace.setupShow = true};

	//Change the default viewport control menu option
	if (gbRoleSpecial1) 
	{
		ns1blankspace.option.defaultViewport = "Special 1"
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
						'<td id="ns1blankspaceViewportContact" class="ns1blankspaceViewportImage">' +
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
						'<td id="ns1blankspaceViewportProject" class="ns1blankspaceViewportImage">' +
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
						'<td id="ns1blankspaceViewportDocument" class="ns1blankspaceViewportImage">' +
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
						'<td id="ns1blankspaceViewportProduct" class="ns1blankspaceViewportImage">' +
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
						'<td id="ns1blankspaceViewportFinancial" class="ns1blankspaceViewportImage">' +
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
						'<td id="ns1blankspaceViewportReport" class="ns1blankspaceViewportImage">' +
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
		ns1blankspaceOptionsSource();
		interfaceContactPersonMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlContactBusiness').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceContactBusinessMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlOpportunity').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceOpportunityMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlProject').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceProjectMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlProjectTask').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceProjectTaskMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlAction').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceActionMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlDocument').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceDocumentMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlNews').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceNewsMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlEvent').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceEventMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlProduct').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceProductMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlOrder').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceOrderMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlFinancial').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceFinancialMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlFinancialBankAccount').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceFinancialBankAccountMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlFinancialInvoice').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceFinancialInvoiceMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlFinancialExpense').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceFinancialExpenseMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlFinancialReceipt').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceFinancialReceiptMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlFinancialPayment').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceFinancialPaymentMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlFinancialTax').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceFinancialTaxMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlFinancialPayroll').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceFinancialPayrollMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlHelp').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceHelpMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlMessaging').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceMessagingIMAPMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlMessagingConversation').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceMessagingConversationMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlReport').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceReportMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlStructure').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceStructureMasterViewport();
	});
	
}

function interfaceControlSetupOptions()
{
	var aHTML = [];

	aHTML.push('<table id="tableInterfaceViewportMasterSetupControl" class="interfaceViewportMasterControl">');
	aHTML.push('<tr id="trInterfaceViewportMasterSetupControlRow1" class="interfaceViewportMasterControl">');
	
	var aHTMLViewport = [];

	aHTMLViewport.push('<tr id="trInterfaceViewportMasterControlSetupUser" class="interfaceViewportMasterControl">' +	
					'<td id="tdInterfaceViewportMasterControlSetupUser" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlSetupUser" class="interfaceViewportMasterControl">' +
					'Users</span>' +
					'</td></tr>');

	aHTMLViewport.push('<tr id="trInterfaceViewportMasterControlSetupUserRole" class="interfaceViewportMasterControl">' +	
					'<td id="tdInterfaceViewportMasterControlSetupUserRole" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlSetupUserRole" class="interfaceViewportMasterControl">' +
					'User Roles</span>' +
					'</td></tr>');

	aHTMLViewport.push('<tr id="trInterfaceViewportMasterControlSetupNetworkGroup" class="interfaceViewportMasterControl">' +	
					'<td id="tdInterfaceViewportMasterControlSetupNetworkGroup" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlSetupNetworkGroup" class="interfaceViewportMasterControl">' +
					'Network&nbsp;Groups</span>' +
					'</td></tr>');

	aHTMLViewport.push('<tr id="trInterfaceViewportMasterControlSetupMessaging" class="interfaceViewportMasterControl">' +	
					'<td id="tdInterfaceViewportMasterControlSetupMessaging" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlSetupMessaging" class="interfaceViewportMasterControl">' +
					'Messaging</span>' +
					'</td></tr>');

	if (aHTMLViewport.length > 0)
	{
		aHTML.push('<td class="interfaceViewportMasterControlColumn">');
		aHTML.push('<table class="interfaceViewportMasterControlColumn">');

		aHTML.push('<tr class="interfaceViewportMasterControl">' +
					'<td id="ns1blankspaceViewportContact" class="ns1blankspaceViewportImage">' +
					'&nbsp;' +
					'</td></tr>');			
	
		aHTML.push(aHTMLViewport.join(''))

		aHTML.push('</table>');
		aHTML.push('</td>');
	}	

	var aHTMLViewport = [];

	var oViewport = $.grep(ns1blankspace.viewports, function (a) {return a.title == 'Websites';})[0];
	if (oViewport ? oViewport.show : false)
	{
		aHTMLViewport.push('<tr id="trInterfaceViewportMasterControlSetupWebsite" class="interfaceViewportMasterControl">' +
					'<td id="tdInterfaceViewportMasterControlSetupWebsite" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlSetupWebsite" class="interfaceViewportMasterControl">' +
					'Websites & Webapps</span>' +
					'</td></tr>');
	}

	var oViewport = $.grep(ns1blankspace.viewports, function (a) {return a.title == 'Structures';})[0];
	if (oViewport ? oViewport.show : false)
	{
		aHTMLViewport.push('<tr id="trInterfaceViewportMasterControlSetupStructures" class="interfaceViewportMasterControl">' +	
					'<td id="tdInterfaceViewportMasterControlSetupStructures" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlSetupStructures" class="interfaceViewportMasterControl">' +
					'Structures</span>' +
					'</td></tr>');
	}

	var oViewport = $.grep(ns1blankspace.viewports, function (a) {return a.title == 'Automation';})[0];
	if (oViewport ? oViewport.show : false)
	{
		aHTMLViewport.push('<tr id="trInterfaceViewportMasterControlSetupAutomation" class="interfaceViewportMasterControl">' +	
					'<td id="tdInterfaceViewportMasterControlSetupAutomation" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlSetupAutomation" class="interfaceViewportMasterControl">' +
					'Automation</span>' +
					'</td></tr>');
	}

	var oViewport = $.grep(ns1blankspace.viewports, function (a) {return a.title == 'Imports';})[0];
	if (oViewport ? oViewport.show : false)
	{
		aHTMLViewport.push('<tr id="trInterfaceViewportMasterControlSetupImport" class="interfaceViewportMasterControl">' +	
					 '<td id="tdInterfaceViewportMasterControlSetupImport" class="interfaceViewportMasterControl">' +
					 '<span id="spanInterfaceViewportMasterControlSetupImport" class="interfaceViewportMasterControl">' +
					 'Imports</span>' +
					 '</td></tr>');
	}

	if (aHTMLViewport.length > 0)
	{
		aHTML.push('<td class="interfaceViewportMasterControlColumn">');
		aHTML.push('<table class="interfaceViewportMasterControlColumn">');

		aHTML.push('<tr class="interfaceViewportMasterControl">' +
					'<td id="ns1blankspaceViewportSetupWebsite" class="ns1blankspaceViewportImage">' +
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
		aHTMLViewport.push('<tr id="trInterfaceViewportMasterControlSetupFinancial" class="interfaceViewportMasterControl">' +	
					'<td id="tdInterfaceViewportMasterControlSetupFinancial" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlSetupFinancial" class="interfaceViewportMasterControl">' +
					'Financials</span>' +
					'</td></tr>');
	}

	var oViewport = $.grep(ns1blankspace.viewports, function (a) {return a.title == 'Businesses';})[0];
	if (oViewport ? oViewport.show : false)
	{
		aHTMLViewport.push('<tr id="trInterfaceViewportMasterControlSetupContactBusinessGroup" class="interfaceViewportMasterControl">' +	
					'<td id="tdInterfaceViewportMasterControlSetupContactBusinessGroup" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlSetupContactBusinessGroup" class="interfaceViewportMasterControl">' +
					'Contact&nbsp;Business&nbsp;Groups</span>' +
					'</td></tr>');
	}

	var oViewport = $.grep(ns1blankspace.viewports, function (a) {return a.title == 'People';})[0];
	if (oViewport ? oViewport.show : false)
	{
		aHTMLViewport.push('<tr id="trInterfaceViewportMasterControlSetupContactPersonGroup" class="interfaceViewportMasterControl">' +	
					'<td id="tdInterfaceViewportMasterControlSetupContactPersonGroup" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlSetupContactPersonGroup" class="interfaceViewportMasterControl">' +
					'Contact&nbsp;Person&nbsp;Groups</span>' +
					'</td></tr>');
	}

	var oViewport = $.grep(ns1blankspace.viewports, function (a) {return a.title == 'Projects';})[0];
	if (oViewport ? oViewport.show : false)
	{
		aHTMLViewport.push('<tr id="trInterfaceViewportMasterControlSetupProject" class="interfaceViewportMasterControl">' +	
					'<td id="tdInterfaceViewportMasterControlSetupProject" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlSetupProject" class="interfaceViewportMasterControl">' +
					'Project&nbsp;Templates</span>' +
					'</td></tr>');
	}

	var oViewport = $.grep(ns1blankspace.viewports, function (a) {return a.title == 'Project Tasks';})[0];
	if (oViewport ? oViewport.show : false)
	{
		aHTMLViewport.push('<tr id="trInterfaceViewportMasterControlSetupProjectTask" class="interfaceViewportMasterControl">' +	
					'<td id="tdInterfaceViewportMasterControlSetupProjectTask" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlSetupProjectTask" class="interfaceViewportMasterControl">' +
					'Project&nbsp;Template&nbsp;Tasks</span>' +
					'</td></tr>');
	}

	if (aHTMLViewport.length > 0)
	{
		aHTML.push('<td class="interfaceViewportMasterControlColumn">');
		aHTML.push('<table class="interfaceViewportMasterControlColumn">');

		aHTML.push('<tr class="interfaceViewportMasterControl">' +
					'<td id="ns1blankspaceViewportFinancial" class="ns1blankspaceViewportImage">' +
					'&nbsp;' +
					'</td></tr>');			
	
		aHTML.push(aHTMLViewport.join(''))

		aHTML.push('</table>');
		aHTML.push('</td>');
	}		
	

	var aHTMLViewport = [];
					
	var oViewport = $.grep(ns1blankspace.viewports, function (a) {return a.title == 'My Account';})[0];
	if (oViewport ? oViewport.show : false)
	{
		aHTMLViewport.push('<tr id="trInterfaceViewportMasterControlSetupSpace" class="interfaceViewportMasterControl">' +	
					'<td id="tdInterfaceViewportMasterControlSetupSpace" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlSetupSpace" class="interfaceViewportMasterControl">' +
					'My&nbsp;Account</span>' +
					'</td></tr>');
	}

	var oViewport = $.grep(ns1blankspace.viewports, function (a) {return a.title == 'Support';})[0];
	if (oViewport ? oViewport.show : false)
	{
		aHTMLViewport.push('<tr id="trInterfaceViewportMasterControlSupportIssue" class="interfaceViewportMasterControl">' +	
					'<td id="tdInterfaceViewportMasterControlSupportIssue" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlSupportIssue" class="interfaceViewportMasterControl">' +
					'Support&nbsp;Issues</span>' +
					'</td></tr>');
	}

	if (aHTMLViewport.length > 0)
	{
		aHTML.push('<td class="interfaceViewportMasterControlColumn">');
		aHTML.push('<table class="interfaceViewportMasterControlColumn">');

		aHTML.push('<tr class="interfaceViewportMasterControl">' +
					'<td id="ns1blankspaceViewportSetupSpace" class="ns1blankspaceViewportImage">' +
					'&nbsp;' +
					'</td></tr>');			
	
		aHTML.push(aHTMLViewport.join(''))

		aHTML.push('</table>');
		aHTML.push('</td>');
	}	
	
	aHTML.push('</tr></table>');
	
	return aHTML.join('');	
}

function interfaceControlSetupOptionsBind()
{
	$('#tdInterfaceViewportMasterControlSetupWebsite').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceSetupWebsiteMasterViewport();
	});
		
	$('#tdInterfaceViewportMasterControlSetupUser').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceSetupUserMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlSetupUserRole').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceSetupUserRoleMasterViewport();
	});

	$('#tdInterfaceViewportMasterControlSetupNetworkGroup').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceSetupNetworkGroupMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlSetupAutomation').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceSetupAutomationMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlSetupMessaging').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceSetupMessagingMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlSetupImport').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceSetupImportMasterViewport();
	});

	$('#tdInterfaceViewportMasterControlSetupFinancial').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceSetupFinancialMasterViewport();
	});

	$('#tdInterfaceViewportMasterControlSetupContactBusinessGroup').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceSetupMasterViewport(
				{
				setupName: "Contact Business Groups",
				setupMethod: "SETUP_CONTACT_BUSINESS_GROUP"
				});
	});
	
	$('#tdInterfaceViewportMasterControlSetupContactPersonGroup').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceSetupMasterViewport(
				{
				setupName: "Contact Person Groups",
				setupMethod: "SETUP_CONTACT_PERSON_GROUP"
				});
	});
	
	$('#tdInterfaceViewportMasterControlSetupProject').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceSetupProjectMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlSetupProjectTaak').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceSetupProjectTaskMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlSupportIssue').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceSupportIssueMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlSetupStructures').click(function(event)
	{
		interfaceSetupStructureMasterViewport();
	});

	$('#tdInterfaceViewportMasterControlSetupSpace').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceSetupSpaceMasterViewport();
	});
}

function interfaceControlUserOptionsShow(oElement)
{
	if ($('#divns1blankspaceViewportControlOptions').attr('data-initiator') == oElement.id)
	{
		$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
		$('#divns1blankspaceViewportControlOptions').attr('data-initiator', '');
	}
	else
	{	
		$('#divns1blankspaceViewportControlOptions').attr('data-initiator', oElement.id);
		$('#divns1blankspaceViewportControlOptions').html("&nbsp;");
		$('#divns1blankspaceViewportControlOptions').show(ns1blankspace.option.showSpeedOptions);
		$('#divns1blankspaceViewportControlOptions').offset({ top: $(oElement).offset().top + $(oElement).height() - 3, left: $(oElement).offset().left + 70});
		$('#divns1blankspaceViewportControlOptions').html(interfaceControlUserOptions);
			
		interfaceControlUserOptionsBind();
	}	
}


function interfaceControlUserOptions()
{

	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<table style="width: 180px;" id="tablens1blankspaceUserOptions" class="interfaceViewportMasterControl" cellpadding=6>';
		
	aHTML[++h] = '<tr id="trns1blankspaceUserOptionsLogOff" class="ns1blankspaceUserOptions">' +
					'<td id="tdns1blankspaceUserOptionsLogOff" class="ns1blankspaceUserOptions">' +
					'Log Off' +
					'</td>' +
					'</tr>'
				
	aHTML[++h] = '<tr id="trns1blankspaceUserOptionsChangePassword" class="ns1blankspaceUserOptions">' +
					'<td id="tdns1blankspaceUserOptionsChangePassword" class="ns1blankspaceUserOptions">' +
					'Change My Password' +
					'</td>' +
					'</tr>'			
				
	aHTML[++h] = '<tr id="trns1blankspaceUserOptionsCreateSecureKey" class="ns1blankspaceUserOptions">' +
					'<td id="tdns1blankspaceUserOptionsCreateSecureKey" class="ns1blankspaceUserOptions">' +
					'Secure Access Token' +
					'</td>' +
					'</tr>'						
					
	aHTML[++h] = '</table>'
	
	return aHTML.join('');
}

function interfaceControlUserOptionsBind()
{

	$('#tdns1blankspaceUserOptionsLogOff').click(function(event)
	{
		ns1blankspaceLogoff();
	})
	
	$('#tdns1blankspaceUserOptionsChangePassword').click(function(event)
	{
		$(this).html(ns1blankspace.xhtml.loadingSmall);
		ns1blankspaceUserOptionsChangePassword();
	});
	
	$('#tdns1blankspaceUserOptionsCreateSecureKey').click(function(event)
	{
		$(this).html(ns1blankspace.xhtml.loadingSmall);
		ns1blankspaceUserOptionsCreateSecureKey();
	});
}

function interfaceControlSpaceOptionsShow(oElement, oResponse)
{
	var aHTML = [];

	if (oResponse == undefined)	
	{
		if ($('#divns1blankspaceViewportControlOptions').attr('data-source') == oElement.id)
		{
			$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
			$('#divns1blankspaceViewportControlOptions').attr('data-source', '');
		}
		else
		{	
			$('#divns1blankspaceViewportControlOptions').attr('data-source', oElement.id);
			$('#divns1blankspaceViewportControlOptions').html('<table style="width: 250px;" class="interfaceViewportMasterControl"><tr><td>' + ns1blankspace.xhtml.loadingSmall + '</tr><td></table>');
			$('#divns1blankspaceViewportControlOptions').show(ns1blankspace.option.showSpeedOptions);
			$('#divns1blankspaceViewportControlOptions').offset({ top: $(oElement).offset().top + $(oElement).height() - 5, left: $(oElement).offset().left});

			if (ns1blankspace.space == ns1blankspace.userSpace)
			{	
				$.ajax(
				{
					type: 'GET',
					url: '/ondemand/core/?method=CORE_SPACE_SEARCH&rows=20',
					dataType: 'json',
					success: function(data) {interfaceControlSpaceOptionsShow(oElement, data)}
				});
			}
			else
			{
				aHTML.push('<table style="width: 250px;" id="tablens1blankspaceSpaceOptions" class="interfaceViewportMasterControl" cellpadding=4>');
				aHTML.push('<tr class="ns1blankspaceSpaceOptions">' +
								'<td id="tdns1blankspaceSpaceOptionsSwitchBack" class="ns1blankspaceUserOptions">' +
								'Switch back to your space.' +
								'</td></tr>');
				aHTML.push('</table>');
		
				$('#divns1blankspaceViewportControlOptions').html(aHTML.join(''));

				$('#tdns1blankspaceSpaceOptionsSwitchBack').click(function(event)
				{
					$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);

					$.ajax(
					{
						type: 'GET',
						url: '/ondemand/core/?method=CORE_SPACE_MANAGE&switchback=1',
						dataType: 'json',
						success: function(data)
						{
							if (data.status == 'OK')
							{	
								ns1blankspace.space = ns1blankspace.userSpace;
								ns1blankspace.spaceText = ns1blankspace.userSpaceText;
								$('#divns1blankspaceViewportSpaceText').html(ns1blankspace.spaceText);
							}
						}
					});	
				});

			}	
		}
	}	
	else
	{
		aHTML.push('<table style="width: 250px;" id="tablens1blankspaceSpaceOptions" class="interfaceViewportMasterControl" cellpadding=0>');

		if (oResponse.data.rows.length == 0)
		{
			aHTML.push('<tr class="interfaceMainCaption">' +
								'<td class="interfaceMainRowNothing">No access to other spaces.</td></tr>');
		}
		else
		{
			aHTML.push('<tr class="interfaceMainCaption">' +
								'<td class="interfaceMainRowNothing" style="padding-left:5px;padding-right:10px;"><input id="inputns1blankspaceSpaceSearch" class="inputInterfaceMainText"></td></tr>');

			aHTML.push('<tr class="interfaceMainCaption">' +
								'<td id="tdns1blankspaceSpaceSearch"></td></tr>');

		}	

		aHTML.push('</table>');

		$('#divns1blankspaceViewportControlOptions').html(aHTML.join(''));

		var aHTML = [];

		aHTML.push('<table style="width: 100%;" cellpadding=4>');

		$(oResponse.data.rows).each(function()
		{
			aHTML.push('<tr class="ns1blankspaceSpaceOptions">' +
					'<td id="tdns1blankspaceSpaceOptionsSwitch-' + this.id + '" class="ns1blankspaceUserOptions">' +
					this.space +
					'</td></tr>');
		});			
						
		aHTML.push('</table>');
		
		$('#tdns1blankspaceSpaceSearch').html(aHTML.join(''));
	
		$('#inputns1blankspaceSpaceSearch').focus();

		$('#inputns1blankspaceSpaceSearch').keyup(function(event)
		{
			if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
	        ns1blankspace.timer.delayCurrent = setTimeout("interfaceControlSpaceOptionsShowSearch('inputns1blankspaceSpaceSearch')", ns1blankspace.option.typingWait);
		});

		$('.ns1blankspaceSpaceOptions').click(function(event)
		{
			$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);

			var aID = (event.target.id).split('-')
			$.ajax(
			{
				type: 'GET',
				url: '/ondemand/core/?method=CORE_SPACE_MANAGE&switch=1&id=' + aID[1],
				dataType: 'json',
				success: function(data)
				{
					if (data.status == 'OK')
					{	
						ns1blankspace.space = aID[1];
						ns1blankspace.spaceText = $('#' + event.target.id).html();
						$('#divns1blankspaceViewportSpaceText').html(ns1blankspace.spaceText);
					}	
				}
			});	
		});
	}
}

function interfaceControlSpaceOptionsShowSearch(sXHTMLElementID, oResponse)
{	
	var aSearch = sXHTMLElementID.split('-');
	var sElementId = aSearch[0];
	var sSearchText = aSearch[1];
	var aHTML = [];

	if (oResponse == undefined)
	{	
		if (sSearchText == undefined)
		{
			sSearchText = $('#' + sXHTMLElementID).val();
		}	
		
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/core/?method=CORE_SPACE_SEARCH&rows=20&spacetext=' + ns1blankspaceFormatSave(sSearchText),
			dataType: 'json',
			success: function(data) {interfaceControlSpaceOptionsShowSearch(sXHTMLElementID, data)}
		});
	}
	else
	{	
		aHTML.push('<table style="width: 100%;" cellspacing=4>');

		$(oResponse.data.rows).each(function()
		{
			aHTML.push('<tr class="ns1blankspaceSpaceOptions">' +
					'<td id="tdns1blankspaceSpaceOptionsSwitch-' + this.id + '" class="ns1blankspaceUserOptions">' +
					this.space +
					'</td></tr>');
		});			
						
		aHTML.push('</table>');
		
		$('#tdns1blankspaceSpaceSearch').html(aHTML.join(''));

		$('.ns1blankspaceSpaceOptions').click(function(event)
		{
			$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);

			var aID = (event.target.id).split('-')
			$.ajax(
			{
				type: 'GET',
				url: '/ondemand/core/?method=CORE_SPACE_MANAGE&switch=1&id=' + aID[1],
				dataType: 'json',
				success: function(data)
				{
					if (data.status == 'OK')
					{	
						ns1blankspace.space = aID[1];
						ns1blankspace.spaceText = $('#' + event.target.id).html();
						$('#divns1blankspaceViewportSpaceText').html(ns1blankspace.spaceText);
					}	
				}
			});	
		});
	}	
}

function ns1blankspaceUserOptionsChangePassword(oParam)
{
	var aHTML = [];
	var h = -1;
	var bShow = true;
	var sXHTMLElementID = 'divns1blankspaceViewportControlOptions'
	
	if (oParam != undefined)
	{
		if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
		if (oParam.show != undefined) {bShow = oParam.show}
	}	
	
	aHTML[++h] = '<table id="tableInterfaceUserOptionsChangePassword" class="interfaceViewportMasterControl" style="width:350px;">';
		
	if (bShow)
	{
		ns1blankspaceOptionsSetPosition(sXHTMLElementID, 0, -255)
		
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
		$('#' + sXHTMLElementID).attr('data-initiator', '');
	})
	.css('width', '20px')
	.css('height', '20px')
	
	ns1blankspaceLogonChangePasswordShow({xhtmlElementID: 'tdInterfaceUserOptionsChangePassword'});
	
}

function ns1blankspaceUserOptionsCreateSecureKey(oParam, oResponse)
{
	var aHTML = [];
	var h = -1;
	var bShow = true;
	var bSetPosition = true;
	var sXHTMLElementID = 'divns1blankspaceViewportControlOptions'
	
	if (oParam != undefined)
	{
		if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
		if (oParam.show != undefined) {bShow = oParam.show}
		if (oParam.setPosition != undefined) {bSetPosition = oParam.setPosition}
	}	
	
	if (oResponse == undefined)
	{
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/core/?method=CORE_SECURE_TOKEN_SEARCH&rf=JSON',
			dataType: 'json',
			success: function(data) {ns1blankspaceUserOptionsCreateSecureKey(oParam, data)}
		})
	}
	else
	{	
	
		aHTML[++h] = '<table id="tableInterfaceUserOptionsCreateSecureKey" class="interfaceViewportMasterControl" style="width:400px;"><tr><td>';	

		if (bSetPosition)
		{
			ns1blankspaceOptionsSetPosition(sXHTMLElementID, 0, -305)
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
			$('#' + sXHTMLElementID).attr('data-initiator', '');
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
					success: function(data) {ns1blankspaceUserOptionsCreateSecureKey({setPosition: false})}
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
					success: function(data) {ns1blankspaceUserOptionsCreateSecureKey({setPosition: false})}
				})
			}		
		})
		.css('width', '150px')
	}		
}



function interfaceControlHelpURL()
{
	return 'http://community.mydigitalstructure.com';
}