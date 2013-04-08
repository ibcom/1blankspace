/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */

$(function()
{	
	var sHash = window.location.hash;
	var sDestination;

	var sNS;
	// Pattern: #/contactBusiness/123/summary

	if (sHash.substr(0, 2) == '#/')
	{	
		var aHash = sHash.split('/');

		if (aHash.length > 1)
		{	
			ns1blankspace.option.returnToLast = true;
			
			sNS = aHash[1];
			var aNS = sNS.split('.');

			if (aNS.length == 1)
			{
				sNS = '["' + aNS[0] + '"]';
			}
			else
			{
				sNS = '["' + aNS[0] + '"]["' + aNS[1] + '"]';
			}
		}
			
		if (aHash.length == 2)
		{		
			sDestination = 'ns1blankspace' + sNS + '.init({showHome: true});';
		}	

		if (aHash.length == 3)
		{
			sDestination = 'ns1blankspace' + sNS + '.init({showHome: false});ns1blankspace' + sNS + '.search.send("-' + aHash[2] + '")';
		}

		ns1blankspace.history.view({
							newDestination: sDestination,
							move: false
							});

		if (aHash.length == 4)
		{
			ns1blankspace.history.control({functionDefault: 'ns1blankspace' + sNS + '.' + aHash[3] + '()'});
		}
	}	
	
});

ns1blankspace.xhtml.loading = '<img class="ns1blankspaceLoading" id="ns1blankspaceLoading" src="/jscripts/images/1blankspace.loading.square.20.gif">';
ns1blankspace.xhtml.loadingSmall = '<img class="ns1blankspaceLoadingSmall" id="ns1blankspaceLoadingSmall" src="/jscripts/images/1blankspace.loading.square.10.gif">';
ns1blankspace.xhtml.editorCSS = '';

ns1blankspace.option.defaultRows = 20;
ns1blankspace.option.defaultView = "Select...";
ns1blankspace.option.defaultSetupView = "Website";
ns1blankspace.option.returnToLast = true;
ns1blankspace.option.restLevel = 0;
ns1blankspace.option.autoSetupSwitch = true;

ns1blankspace.data.object = {person: 32, business: 12, opportunity: 35};
ns1blankspace.data.attachmentTypes = [];
ns1blankspace.data.networkGroups;
ns1blankspace.data.actionTypes =
{
	meeting: {id: 3, title: 'Meeting'},
	fileNote: {id: 4, title: 'File Note'},
	emailSent: {id: 5, title: 'Email Sent'},
	emailReceived: {id: 9, title: 'Email Received'}
};

ns1blankspace.option.showBrowsing = false;
ns1blankspace.option.messagingEmailShowCount = false;
ns1blankspace.option.messagingCheckForNew = 30000;
ns1blankspace.option.helpURI = 'http://community.mydigitalstructure.com';
ns1blankspace.option.taxVATCaption = 'GST';
ns1blankspace.option.taxPayrollCaption = 'Employee';
ns1blankspace.option.taxBusinessCaption = 'Business';
ns1blankspace.option.postInit = undefined;
ns1blankspace.option.initialiseSpaceTemplate = '/jscripts/1blankspace.setup.space-2.0.0.json';

if (ns1blankspace.financial === undefined) {ns1blankspace.financial = {}}
if (ns1blankspace.control === undefined) {ns1blankspace.control = {}}

ns1blankspace.financial.summaryUseTemplate = false; 

ns1blankspace.xhtml.templates = {source: {}, document: {}};

ns1blankspace.xhtml.templates.source.invoice = '/jscripts/1blankspace.setup.financial.invoice-1.0.0.html';
ns1blankspace.xhtml.templates.source.statement = '/jscripts/1blankspace.setup.financial.statement-1.0.0.html';

ns1blankspace.xhtml.logonNotes =
	'<span style="font-weight:bold;">THIS IS AN UI BEING WORKED ON BY THE COMMUNITY.</span><br /><br />' +
	'As much as mydigitalstructure is well proven and stable, this HTML/js UI code is not yet stable and should not be used in production as is. ' +
	'It exists to allow the community to debug and others to learn from. ' +
	'Each day it gets more stable, so keep a watch on the repo.  If you find a bug, please raise any issue on github.<br /><br />' +
	'<span style="font-weight:bold">Thanks!</span></span><br /><br />' +
	'1blankspace all-of-enterprise is an example app based on the mydigitalstructure platform.' +
	'<br /><br /><a href="http://mydigitalstructure.com/1blankspace" target="_blank">1blankspace namespace</a>' +
	'<br /><br /><a href="https://github/ibcom/1blankspace" target="_blank">github repository</a>' +
	'<br /><br /><a href="http://mydigitalstructure.com/examples" target="_blank">More code examples</a>' +
	'<br /><br /><a href="http://mydigitalstructure.com/documentation" target="_blank">Documentation</a>' +
	'<br /><br /><a href="http://mydigitalstructure.com/gettingstarted" target="_blank">Getting started</a>' +
	'<br /><br /><a href="http://twitter.com/ibComMYDS" target="_blank">twitter.com/ibComMYDS</a>' +
	'<br /><br /><hr />' +
	'<br /><a href="https://developer.1blankspace.com" target="_blank"><strong>Modify this app or create your own app using the simple jQuery IDE.</strong></a>';

ns1blankspace.xhtml.header =
	'<div id="ns1blankspaceLogo" style="width:250px; float:left; "><img src="/jscripts/images/1blankspace.aoe-2.0.0.png"></div>' +
	'<div style="float:right; margin-right:3px;">' +
	'<div id="ns1blankspaceSpaceText" style="width:450px;"></div>' +
	'<div id="ns1blankspaceLogonName" style="width:450px;"></div></div>';

ns1blankspace.themes = 
[
	{
		title: 				'Standard',
		cssURI: 			'', 
		xhtmlHeaderLogo: 	'<img src="/jscripts/images/1blankspace.aoe-2.0.0.png">',
		default: 			true
	},
	{
		title: 				'Helping Hand',
		cssURI: 			'/jscripts/1blankspace.theme.helpinghand-2.0.0.css',
		xhtmlHeaderLogo: 	'<img src="/jscripts/images/1blankspace.white-2.0.0.png">'
	},
	{
		title: 				'New York',
		cssURI: 			'/jscripts/1blankspace.theme.newyork-2.0.0.css',
		xhtmlHeaderLogo: 	'<img src="/jscripts/images/1blankspace.white-2.0.0.png">'
	},
	{
		title: 				'Photography',
		cssURI: 			'/jscripts/1blankspace.theme.photography-2.0.0.css',
		xhtmlHeaderLogo: 	'<img src="/jscripts/images/1blankspace.white-2.0.0.png">'
	},
	{
		title: 				'Travelling',
		cssURI: 			'/jscripts/1blankspace.theme.travelling-2.0.0.css',
		xhtmlHeaderLogo: 	'<img src="/jscripts/images/1blankspace.white-2.0.0.png">'
	},
	{
		title: 				'Wall',
		cssURI: 			'/jscripts/1blankspace.theme.wall-2.0.0.css',
		xhtmlHeaderLogo: 	'<img src="/jscripts/images/1blankspace.white-2.0.0.png">'
	}
]	

ns1blankspace.views = 
[
	{
		title: "People",
		namespace: "contactPerson",
		endpoint: "CONTACT_PERSON",
		show: true,
		group: 1,
		type: 1
	},
	{
		title: "Businesses",
		namespace: "contactBusiness",
		endpoint: "CONTACT_BUSINESS",
		show: true,
		group: 1,
		type: 1
	},
	{
		title: "Opportunities",
		namespace: "opportunity",
		endpoint: "OPPORTUNITY",
		show: true,
		group: 1,
		type: 1
	},
	{
		title: "Email",
		parentnamespace: "messaging",
		namespace: "imap",
		endpoint: "MESSAGING_IMAP",
		show: true,
		group: 1,
		type: 1
	},
	{
		title: "Conversations",
		parentnamespace: "messaging",
		namespace: "conversation",
		endpoint: "MESSAGING_CONVERSATION",
		show: true,
		group: 1,
		type: 1
	},
	{
		title: "Projects",
		namespace: "project",
		endpoint: "PROJECT",
		show: true,
		group: 2,
		type: 1
	},
	{
		title: "Project Tasks",
		namespace: "projectTask",
		endpoint: "PROJECT_TASK",
		show: true,
		group: 2,
		type: 1
	},
	{
		title: "Actions",
		namespace: "action",
		endpoint: "ACTION",
		show: true,
		group: 2,
		type: 1
	},
	{
		title: "Documents",
		namespace: "document",
		endpoint: "DOCUMENT",
		show: true,
		group: 3,
		type: 1
	},
	{
		title: "News",
		namespace: "news",
		endpoint: "NEWS",
		show: true,
		group: 3,
		type: 1
	},
	{
		title: "Events",
		namespace: "event",
		endpoint: "EVENT",
		show: false,
		group: 3,
		type: 1
	},
	{
		title: "Products",
		namespace: "product",
		endpoint: "PRODUCT",
		show: true,
		group: 4,
		type: 1
	},
	{
		title: "Orders",
		namespace: "order",
		endpoint: "PRODUCT_ORDER",
		show: true,
		group: 4,
		type: 1
	},
	{
		title: "Financials",
		namespace: "financial",
		endpoint: "FINANCIAL",
		show: true,
		group: 5,
		type: 1
	},
	{
		title: "Bank Accounts",
		parentnamespace: "financial",
		namespace: "bankAccount",
		endpoint: "FINANCIAL_BANK_ACCOUNT",
		show: true,
		group: 5,
		type: 1
	},
	{
		title: "Invoices",
		parentnamespace: "financial",
		namespace: "invoice",
		endpoint: "FINANCIAL_INVOICE",
		show: true,
		group: 5,
		type: 1
	},
	{
		title: "Expenses",
		parentnamespace: "financial",
		namespace: "expense",
		endpoint: "FINANCIAL_EXPENSE",
		show: true,
		group: 5,
		type: 1
	},
	{
		title: "Receipts",
		parentnamespace: "financial",
		namespace: "receipt",
		endpoint: "FINANCIAL_RECEIPT",
		show: true,
		group: 5,
		type: 1
	},
	{
		title: "Payments",
		parentnamespace: "financial",
		namespace: "payment",
		endpoint: "FINANCIAL_PAYMENT",
		show: true,
		group: 5,
		type: 1
	},
	{
		title: "Credits",
		parentnamespace: "financial",
		namespace: "credit",
		endpoint: "FINANCIAL_CREDIT",
		show: true,
		group: 5,
		type: 1
	},
	{
		title: "Journals",
		parentnamespace: "financial",
		namespace: "journal",
		endpoint: "FINANCIAL_GENERAL_JOURNAL",
		show: true,
		group: 6,
		type: 1
	},
	{
		title: "Payroll",
		parentnamespace: "financial",
		namespace: "payroll",
		endpoint: "FINANCIAL_PAYROLL",
		show: true,
		group: 6,
		type: 1
	},
	{
		title: "Search & Report",
		namespace: "report",
		endpoint: "", 
		show: true,
		group: 6,
		type: 1
	},
	{
		title: "Tax",
		parentnamespace: "financial",
		namespace: "tax",
		endpoint: "FINANCIAL_TAX",
		show: true,
		group: 6,
		type: 1
	},
	{
		title: "Structures",
		namespace: "structure",
		endpoint: "STRUCTURE", 
		show: false,
		group: 6,
		type: 1
	},
	{
		title: "Users",
		parentnamespace: "setup",
		namespace: "user",
		endpoint: "SETUP_USER", 
		show: true,
		group: 1,
		type: 2
	},
	{
		title: "User Roles",
		parentnamespace: "setup",
		namespace: "userRole",
		endpoint: "SETUP_USER_ROLE", 
		show: true,
		group: 1,
		type: 2
	},
	{
		title: "Network Groups",
		parentnamespace: "setup",
		namespace: "networkGroup",
		endpoint: "SETUP_NETWORK_GROUP", 
		show: true,
		group: 1,
		type: 2
	},
	{
		title: "Messaging",
		parentnamespace: "setup",
		namespace: "messaging",
		endpoint: "SETUP_MESSAGING", 
		show: true,
		group: 1,
		type: 2
	},
	{
		title: "Websites & Webapps",
		parentnamespace: "setup",
		namespace: "website",
		endpoint: "SETUP_SITE", 
		show: true,
		group: 2,
		type: 2
	},
	{
		title: "Structures",
		parentnamespace: "setup",
		namespace: "structure",
		endpoint: "SETUP_STRUCTURE", 
		show: true,
		group: 2,
		type: 2
	},
	{
		title: "Automation",
		parentnamespace: "setup",
		namespace: "automation",
		endpoint: "SETUP_AUTOMATION", 
		show: true,
		group: 2,
		type: 2
	},
	{
		title: "Financials",
		parentnamespace: "setup",
		namespace: "financial",
		endpoint: "SETUP_FINANCIAL", 
		show: true,
		group: 3,
		type: 2
	},
	{
		title: 'Person Groups',
		namespace: 'setup',
		namesuffix: 'contactPersonGroup',
		endpoint: "SETUP", 
		show: false,
		group: 4,
		type: 2,
		param: {viewName: 'Person Groups', method: 'SETUP_CONTACT_PERSON_GROUP'}														
	},
	{
		title: 'Business Groups',
		namespace: 'setup',
		namesuffix: 'contactBusinessGroup',
		endpoint: "SUPPORT", 
		show: false,
		group: 4,
		type: 2,
		param: {viewName: 'Business Groups', method: 'SETUP_CONTACT_BUSINESS_GROUP'}														
	},
	{
		title: "Project Templates",
		parentnamespace: "setup",
		namespace: "project",
		endpoint: "PROJECT", 
		show: true,
		group: 3,
		type: 2
	},
	{
		title: "Project Template Tasks",
		parentnamespace: "setup",
		namespace: "projectTask",
		endpoint: "PROJECT", 
		show: true,
		group: 3,
		type: 2
	},
	{
		title: "My Account",
		parentnamespace: "setup",
		namespace: "space",
		endpoint: "ADMIN", 
		show: true,
		group: 4,
		type: 2
	},
	{
		title: "File Import",
		parentnamespace: "setup",
		namespace: "file",
		endpoint: "SETUP_IMPORT_MANAGE", 
		show: true,
		group: 4,
		type: 2
	},
	{
		title: "Other Spaces",
		parentnamespace: "developer",
		namespace: "space",
		endpoint: "ADMIN_SPACE_MANAGE", 
		show: true,
		group: 4,
		type: 2
	},
	{
		title: "Structures",
		parentnamespace: "setup",
		namespace: "structure",
		endpoint: "SETUP_STRUCTURE_MANAGE", 
		show: true,
		group: 4,
		type: 2
	},
	{
		title: "Support",
		namespace: "supportIssue",
		endpoint: "SETUP", 
		show: false,
		group: 4,
		type: 2
	}
]

ns1blankspace.control = 
{
	init: 		function (oParam, oResponse)
				{
					var iStep = 1;
					var aRoles = [];
					var fPostInit = ns1blankspace.option.postInit;

					if (oParam != undefined)
					{
						if (oParam.step != undefined) {iStep = oParam.step}
						if (oParam.roles != undefined) {aRoles = oParam.roles}
						if (oParam.postInit != undefined) {fPostInit = oParam.postInit}
					}
					else
					{
						oParam = {};
					}
						
					if (iStep == 1)
					{
						if (ns1blankspace.user.unrestricted)
						{
							$.extend(true, oParam, {step: 4});
							ns1blankspace.control.init(oParam)
						}
						else
						{	
							var aIDs = [];

							$(ns1blankspace.user.roles).each(function()
							{
								aIDs.push(this.id);	
							})

							$.extend(true, oParam, {step: 2, roles: aIDs});
							ns1blankspace.control.init(oParam);	
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
							oSearch.getResults(function(data) {ns1blankspace.control.init(oParam, data)})
						}
						else
						{
							ns1blankspace.user.methods = oResponse.data.rows;
							$.extend(true, oParam, {step: 3});
							ns1blankspace.control.init(oParam);
						}
					}

					else if (iStep == 3)
					{
						$(ns1blankspace.views).each(function(i, k)
						{
							var oMethods = $.grep(ns1blankspace.user.methods, function (a) {return (a.accessmethodtext).indexOf(k.endpoint) != -1;})	
							if (oMethods.length == 0) {this.show = false};
						});

						$.extend(true, oParam, {step: 4});
						ns1blankspace.control.init(oParam)
					}

					else if (iStep == 4)
					{
						$.extend(true, oParam, {step: 5});

						if (mydigitalstructureSiteId)
						{
							$.ajax(
							{
								type: 'GET',
								url: '/site/' + mydigitalstructureSiteId + '/1blankspace.control.json',
								dataType: 'json',
								global: false,
								success: function(data)
								{
									ns1blankspace.data.control = data.control;
									ns1blankspace.control.init(oParam)
								},
								error: function(data)
								{
									ns1blankspace.control.init(oParam)
								}
							});
						}
						else
						{
							ns1blankspace.control.init(oParam)
						}
					}

					else if (iStep == 5)
					{
						if (ns1blankspace.user.systemAdmin) {ns1blankspace.setupShow = true};

						$.ajax(
						{
							type: 'GET',
							url: '/ondemand/core/?method=CORE_PROFILE_SEARCH&type=1&rf=TEXT&id=455',
							dataType: 'text',
							async: true,
							success: function(data) {
								sData = data.replace('OK|RETURNED|', '')
								if (sData != '')
								{
									ns1blankspace.control.user.changeTheme({theme: sData});
								}

								if (fPostInit) {fPostInit()}
							}
						})
					}		
				},

	setView:	{
					default: 		function ()
									{
										ns1blankspace.contactPerson.init({showHome: true});		
									},

					setup:			function ()
									{
										ns1blankspace.setup.website.init();
									},
				},					

	views:		{					
					show: 			function ()
									{
										var aHTML = [];
										var oViewport;

										if (ns1blankspace.xhtml.viewControl == undefined)
										{
											aHTML.push('<table class="ns1blankspaceViewControlContainer">');
											aHTML.push('<tr class="ns1blankspaceViewControl">');

											var aHTMLViewport = [];

											var oViewport = $.grep(ns1blankspace.views, function (a) {return a.title == 'People';})[0];
											if (oViewport ? oViewport.show : false)
											{		
												aHTMLViewport.push('<tr class="ns1blankspaceViewControl">' +
																		'<td class="ns1blankspaceViewControl">' +
																		'<span id="ns1blankspaceViewControl_contactPerson" class="ns1blankspaceViewControl">' + 
																		'People</span></td></tr>');
											}			

											var oViewport = $.grep(ns1blankspace.views, function (a) {return a.title == 'Businesses';})[0];	
											if (oViewport ? oViewport.show : false)
											{	
												aHTMLViewport.push('<tr class="ns1blankspaceViewControl">' +
																		'<td class="ns1blankspaceViewControl">' +
																		'<span id="ns1blankspaceViewControl_contactBusiness" class="ns1blankspaceViewControl">' + 
																		'Businesses</span></td></tr>');
											}	

											var oViewport = $.grep(ns1blankspace.views, function (a) {return a.title == 'Opportunities';})[0];	
											if (oViewport ? oViewport.show : false)
											{	
													aHTMLViewport.push('<tr class="ns1blankspaceViewControl">' +	
																			'<td class="ns1blankspaceViewControl">' +
																			'<span id="ns1blankspaceViewControl_opportunity" class="ns1blankspaceViewControl">' + 
																			'Opportunities</span></td></tr>');	
											}
											
											var oViewport = $.grep(ns1blankspace.views, function (a) {return a.title == 'Email';})[0];		
											if (oViewport ? oViewport.show : false)
											{	
												aHTMLViewport.push('<tr class="ns1blankspaceViewControl">' +	
																		'<td class="ns1blankspaceViewControl">' +
																		'<span id="ns1blankspaceViewControl_messaging_imap" class="ns1blankspaceViewControl">' + 
																		'Email</span></td></tr>');
											}
											
											var oViewport = $.grep(ns1blankspace.views, function (a) {return a.title == 'Conversations';})[0];	
											if (oViewport ? oViewport.show : false)
											{
												aHTMLViewport.push('<tr class="ns1blankspaceViewControl">' +	
																		'<td class="ns1blankspaceViewControl">' +
																		'<span id="ns1blankspaceViewControl_messaging_conversation" class="ns1blankspaceViewControl">' + 
																		'Conversations</span></td></tr>');	
											}
										
											if (aHTMLViewport.length > 0)
											{
												aHTML.push('<td class="ns1blankspaceViewControlColumn">');
												aHTML.push('<table class="ns1blankspaceViewControlColumn">');

												aHTML.push('<tr><td>' +
																'<div id="ns1blankspaceViewContact" class="ns1blankspaceViewImage"></div>' +
																'</td></tr>');	
											
												aHTML.push(aHTMLViewport.join(''))

												aHTML.push('</table>');
												aHTML.push('</td>');
											}	

											var aHTMLViewport = [];

											var oViewport = $.grep(ns1blankspace.views, function (a) {return a.title == 'Projects';})[0];
											if (oViewport ? oViewport.show : false)
											{		
												aHTMLViewport.push('<tr class="ns1blankspaceViewControl">' +
																		'<td class="ns1blankspaceViewControl">' +
																		'<span id="ns1blankspaceViewControl_project" class="ns1blankspaceViewControl">' + 
																		'Projects</span></td></tr>');
											}		

											var oViewport = $.grep(ns1blankspace.views, function (a) {return a.title == 'Project Tasks';})[0];
											if (oViewport ? oViewport.show : false)
											{		
												aHTMLViewport.push('<tr class="ns1blankspaceViewControl">' +
																		'<td class="ns1blankspaceViewControl">' +
																		'<span id="ns1blankspaceViewControl_projectTask" class="ns1blankspaceViewControl">' + 
																		'Project Tasks</span></td></tr>');
											}		

											var oViewport = $.grep(ns1blankspace.views, function (a) {return a.title == 'Actions';})[0];
											if (oViewport ? oViewport.show : false)
											{		
												aHTMLViewport.push('<tr class="ns1blankspaceViewControl">' +				
																		'<td class="ns1blankspaceViewControl">' +
																		'<span id="ns1blankspaceViewControl_action" class="ns1blankspaceViewControl">' +
																		'Actions</span></td></tr>');
											}			

											if (aHTMLViewport.length > 0)
											{
												aHTML.push('<td class="ns1blankspaceViewControlColumn">');
												aHTML.push('<table class="ns1blankspaceViewControlColumn">');

												aHTML.push('<tr><td>' +
																'<div id="ns1blankspaceViewProject" class="ns1blankspaceViewImage"></div>' +
																'</td></tr>');
						
												aHTML.push(aHTMLViewport.join(''))

												aHTML.push('</table>');
												aHTML.push('</td>');
											}	
														
											var aHTMLViewport = [];

											var oViewport = $.grep(ns1blankspace.views, function (a) {return a.title == 'Documents';})[0];
											if (oViewport ? oViewport.show : false)
											{		
												aHTMLViewport.push('<tr class="ns1blankspaceViewControl">' +
																		'<td class="ns1blankspaceViewControl">' +
																		'<span id="ns1blankspaceViewControl_document" class="ns1blankspaceViewControl">' +
																		'Documents</span></td></tr>');
											}		

											var oViewport = $.grep(ns1blankspace.views, function (a) {return a.title == 'News';})[0];
											if (oViewport ? oViewport.show : false)
											{		
												aHTMLViewport.push('<tr class="ns1blankspaceViewControl">' +
																		'<td class="ns1blankspaceViewControl">' +
																		'<span id="ns1blankspaceViewControl_news" class="ns1blankspaceViewControl">' +
																		'News</span></td></tr>');
											}		
											
											var oViewport = $.grep(ns1blankspace.views, function (a) {return a.title == 'Events';})[0];
											if (oViewport ? oViewport.show : false)
											{		
												aHTMLViewport.push('<tr class="ns1blankspaceViewControl">' +
																		'<td class="ns1blankspaceViewControl">' +
																		'<span id="ns1blankspaceViewControl_event" class="ns1blankspaceViewControl">' +
																		'Events</span></td></tr>');
											}	

											if (aHTMLViewport.length > 0)
											{
												aHTML.push('<td class="ns1blankspaceViewControlColumn">');
												aHTML.push('<table class="ns1blankspaceViewControlColumn">');

												aHTML.push('<tr><td>' +
																'<div id="ns1blankspaceViewDocument" class="ns1blankspaceViewImage"></div>'+
																'</td></tr>');

												aHTML.push(aHTMLViewport.join(''))

												aHTML.push('</table>');
												aHTML.push('</td>');
											}	
											
											var aHTMLViewport = [];

											var oViewport = $.grep(ns1blankspace.views, function (a) {return a.title == 'Products';})[0];
											if (oViewport ? oViewport.show : false)
											{		
												aHTMLViewport.push('<tr class="ns1blankspaceViewControl">' +
																		'<td class="ns1blankspaceViewControl">' +
																		'<span id="ns1blankspaceViewControl_product" class="ns1blankspaceViewControl">' +
																		'Products</span>' +
																		'</td></tr>');
											}		
											
											var oViewport = $.grep(ns1blankspace.views, function (a) {return a.title == 'Orders';})[0];
											if (oViewport ? oViewport.show : false)
											{		
												aHTMLViewport.push('<tr class="ns1blankspaceViewControl">' +
																		'<td class="ns1blankspaceViewControl">' +
																		'<span id="ns1blankspaceViewControl_order" class="ns1blankspaceViewControl">' +
																		'Orders</span></td></tr>');
											}	

											if (aHTMLViewport.length > 0)
											{
												aHTML.push('<td class="ns1blankspaceViewControlColumn">');
												aHTML.push('<table class="ns1blankspaceViewControlColumn">');

												aHTML.push('<tr><td>' +
																'<div id="ns1blankspaceViewProduct" class="ns1blankspaceViewImage"></div>' +
																'</td></tr>');

												aHTML.push(aHTMLViewport.join(''))

												aHTML.push('</table>');
												aHTML.push('</td>');
											}	

											var aHTMLViewport = [];

											var oViewport = $.grep(ns1blankspace.views, function (a) {return a.title == 'Financials';})[0];
											if (oViewport ? oViewport.show : false)
											{		
												aHTMLViewport.push('<tr class="ns1blankspaceViewControl">' +
																		'<td class="ns1blankspaceViewControl">' +
																		'<span id="ns1blankspaceViewControl_financial" class="ns1blankspaceViewControl">' +
																		'Financials</span></td></tr>');
											}		

											var oViewport = $.grep(ns1blankspace.views, function (a) {return a.title == 'Bank Accounts';})[0];
											if (oViewport ? oViewport.show : false)
											{		
												aHTMLViewport.push('<tr class="ns1blankspaceViewControl">' +
																		'<td class="ns1blankspaceViewControl">' +
																		'<span id="ns1blankspaceViewControl_financial_bankAccount" class="ns1blankspaceViewControl">' +
																		'Bank Accounts</span></td></tr>');
											}	
											
											var oViewport = $.grep(ns1blankspace.views, function (a) {return a.title == 'Invoices';})[0];
											if (oViewport ? oViewport.show : false)
											{		
												aHTMLViewport.push('<tr class="ns1blankspaceViewControl">' +
																		'<td class="ns1blankspaceViewControl">' +
																		'<span id="ns1blankspaceViewControl_financial_invoice" class="ns1blankspaceViewControl">' +
																		'Invoices</span></td></tr>');
											}

											var oViewport = $.grep(ns1blankspace.views, function (a) {return a.title == 'Expenses';})[0];
											if (oViewport ? oViewport.show : false)
											{		
												aHTMLViewport.push('<tr class="ns1blankspaceViewControl">' +
																		'<td class="ns1blankspaceViewControl">' +
																		'<span id="ns1blankspaceViewControl_financial_expense" class="ns1blankspaceViewControl">' +
																		'Expenses</span></td></tr>');
											}

											var oViewport = $.grep(ns1blankspace.views, function (a) {return a.title == 'Receipts';})[0];
											if (oViewport ? oViewport.show : false)
											{		
												aHTMLViewport.push('<tr class="ns1blankspaceViewControl">' +
																		'<td class="ns1blankspaceViewControl">' +
																		'<span id="ns1blankspaceViewControl_financial_receipt" class="ns1blankspaceViewControl">' +
																		'Receipts</span></td></tr>');
											}	

											var oViewport = $.grep(ns1blankspace.views, function (a) {return a.title == 'Payments';})[0];
											if (oViewport ? oViewport.show : false)
											{		
												aHTMLViewport.push('<tr class="ns1blankspaceViewControl">' +
																		'<td class="ns1blankspaceViewControl">' +
																		'<span id="ns1blankspaceViewControl_financial_payment" class="ns1blankspaceViewControl">' +
																		'Payments</span></td></tr>');
											}	

											var oViewport = $.grep(ns1blankspace.views, function (a) {return a.title == 'Credits';})[0];
											if (oViewport ? oViewport.show : false)
											{		
												aHTMLViewport.push('<tr class="ns1blankspaceViewControl">' +
																		'<td class="ns1blankspaceViewControl">' +
																		'<span id="ns1blankspaceViewControl_financial_credit" class="ns1blankspaceViewControl">' +
																		'Credits</span></td></tr>');
											}	

											if (aHTMLViewport.length > 0)
											{
												aHTML.push('<td class="ns1blankspaceViewControlColumn">');
												aHTML.push('<table class="ns1blankspaceViewControlColumn">');

												aHTML.push('<tr><td>' +
																'<div id="ns1blankspaceViewFinancial" class="ns1blankspaceViewImage"></div>' +
																'</td></tr>');			
											
												aHTML.push(aHTMLViewport.join(''))

												aHTML.push('</table>');
												aHTML.push('</td>');
											}	

											var aHTMLViewport = [];

											var oViewport = $.grep(ns1blankspace.views, function (a) {return a.title == 'Payroll';})[0];
											if (oViewport ? oViewport.show : false)
											{		
												aHTMLViewport.push('<tr class="ns1blankspaceViewControl">' +
																		'<td class="ns1blankspaceViewControl">' +
																		'<span id="ns1blankspaceViewControl_financial_payroll" class="ns1blankspaceViewControl">' +
																		'Payroll</span></td></tr>');
											}	

											var oViewport = $.grep(ns1blankspace.views, function (a) {return a.title == 'Tax';})[0];
											if (oViewport ? oViewport.show : false)
											{		
												aHTMLViewport.push('<tr class="ns1blankspaceViewControl">' +
																		'<td class="ns1blankspaceViewControl">' +
																		'<span id="ns1blankspaceViewControl_financial_tax" class="ns1blankspaceViewControl">' +
																		'Tax&nbsp;(BAS)</span></td></tr>');
											}

											var oViewport = $.grep(ns1blankspace.views, function (a) {return a.title == 'Journals';})[0];
											if (oViewport ? oViewport.show : false)
											{		
												aHTMLViewport.push('<tr class="ns1blankspaceViewControl">' +
																		'<td class="ns1blankspaceViewControl">' +
																		'<span id="ns1blankspaceViewControl_financial_journal" class="ns1blankspaceViewControl">' +
																		'Journals</span></td></tr>');
											}	
	
											var oViewport = $.grep(ns1blankspace.views, function (a) {return a.title == 'Structures' && a.type == 1;})[0];
											if (oViewport ? oViewport.show : false)
											{		
												aHTMLViewport.push('<tr class="ns1blankspaceViewControl">' +
																		'<td class="ns1blankspaceViewControl">' +
																		'<span id="ns1blankspaceViewControl_structure" class="ns1blankspaceViewControl">' +
																		'Structures</span></td></tr>');
											}	

											if (aHTMLViewport.length > 0)
											{
												aHTML.push('<td class="ns1blankspaceViewControlColumn">');
												aHTML.push('<table class="ns1blankspaceViewControlColumn">');

												aHTML.push('<tr><td>' +
																'<div id="ns1blankspaceViewReportX" class="ns1blankspaceViewImage"></div>' +
																'</td></tr>');		
											
												aHTML.push(aHTMLViewport.join(''))

												aHTML.push('</table>');
												aHTML.push('</td>');
											}	

											aHTML.push('</tr>');

											aHTML.push('<tr class="ns1blankspaceViewControl">');

											aHTML.push('<td class="ns1blankspaceViewControl" colspan=6 style="text-align: right; color: #999999; font-size:0.825em;"><span id="ns1blankspaceViewControl_report" class="ns1blankspaceViewControl">Search & Reporting</span></td>');

											aHTML.push('</tr></table>');

											ns1blankspace.xhtml.viewControl = aHTML.join('');
										}

										ns1blankspace.container.show(
										{
											xhtmlElementID: 'ns1blankspaceViewControlViewContainer',
											xhtml: ns1blankspace.xhtml.viewControl
										});	

										ns1blankspace.control.views.bind();	
									},
			
					bind: 			function ()
									{
										$($.grep(ns1blankspace.views, function (a) {return a.type == 1;})).each(function()
										{
											var sNS = '_' + this.namespace;
											
											if (this.parentnamespace)
											{
												sNS = '_' + this.parentnamespace + sNS;
												$('#ns1blankspaceViewControl' + sNS).attr('data-parentnamespace', this.parentnamespace);
											}

											$('#ns1blankspaceViewControl' + sNS).attr('data-namespace', this.namespace);

											$('#ns1blankspaceViewControl' + sNS).click(function(event)
											{
												$(ns1blankspace.xhtml.container).attr('data-initiator', '');

												if ($(this).attr('data-parentnamespace'))
												{
													var oNS = ns1blankspace[$(this).attr('data-parentnamespace')][$(this).attr('data-namespace')];
												}
												else
												{
													var oNS = ns1blankspace[$(this).attr('data-namespace')];
												}

												oNS.init();
											});
										});
									}
					},
					
	setup:			{
						views: 		{
										show:		function ()
													{
														var aHTML = [];

														aHTML.push('<table class="ns1blankspaceViewControlContainer">');
														aHTML.push('<tr class="ns1blankspaceViewControl">');
														
														var aHTMLViewport = [];

														aHTMLViewport.push('<tr class="ns1blankspaceViewControl">' +
																				'<td class="ns1blankspaceViewControl">' +
																				'<span id="ns1blankspaceViewControl_setup_user" class="ns1blankspaceViewControl">' +
																				'Users</span></td></tr>');

														aHTMLViewport.push('<tr class="ns1blankspaceViewControl">' +
																				'<td class="ns1blankspaceViewControl">' +
																				'<span id="ns1blankspaceViewControl_setup_userRole" class="ns1blankspaceViewControl">' +
																				'User&nbsp;Roles</span></td></tr>');

														aHTMLViewport.push('<tr class="ns1blankspaceViewControl">' +
																				'<td class="ns1blankspaceViewControl">' +
																				'<span id="ns1blankspaceViewControl_setup_networkGroup" class="ns1blankspaceViewControl">' +
																				'Network&nbsp;Groups</span></td></tr>');

														aHTMLViewport.push('<tr class="ns1blankspaceViewControl">' +
																				'<td class="ns1blankspaceViewControl">' +
																				'<span id="ns1blankspaceViewControl_setup_messaging" class="ns1blankspaceViewControl">' +
																				'Messaging</span></td></tr>');

														if (aHTMLViewport.length > 0)
														{
															aHTML.push('<td class="ns1blankspaceViewControlColumn">');
															aHTML.push('<table class="ns1blankspaceViewControlColumn">');

															aHTML.push('<tr><td>' +
																'<div id="ns1blankspaceViewSetupUser" class="ns1blankspaceViewImage"></div>' +
																'</td></tr>');

															aHTML.push(aHTMLViewport.join(''))

															aHTML.push('</table>');
															aHTML.push('</td>');
														}	

														var aHTMLViewport = [];

														var oViewport = $.grep(ns1blankspace.views, function (a) {return a.title == 'Websites & Webapps';})[0];
														if (oViewport ? oViewport.show : false)
														{
															aHTMLViewport.push('<tr class="ns1blankspaceViewControl">' +
																				'<td class="ns1blankspaceViewControl">' +
																				'<span id="ns1blankspaceViewControl_setup_website" class="ns1blankspaceViewControl">' +
																				'Websites & Webapps</span></td></tr>');
														}

														var oViewport = $.grep(ns1blankspace.views, function (a) {return a.title == 'Structures';})[0];
														if (oViewport ? oViewport.show : false)
														{
															aHTMLViewport.push('<tr class="ns1blankspaceViewControl">' +
																				'<td class="ns1blankspaceViewControl">' +
																				'<span id="ns1blankspaceViewControl_setup_structure" class="ns1blankspaceViewControl">' +
																				'Structures</span></td></tr>');
														}

														var oViewport = $.grep(ns1blankspace.views, function (a) {return a.title == 'Automation';})[0];
														if (oViewport ? oViewport.show : false)
														{
															aHTMLViewport.push('<tr class="ns1blankspaceViewControl">' +
																				'<td class="ns1blankspaceViewControl">' +
																				'<span id="ns1blankspaceViewControl_setup_automation" class="ns1blankspaceViewControl">' +
																				'Automation</span></td></tr>');
														}

														var oViewport = $.grep(ns1blankspace.views, function (a) {return a.title == 'Imports';})[0];
														if (oViewport ? oViewport.show : false)
														{
															aHTMLViewport.push('<tr class="ns1blankspaceViewControl">' +
																				'<td class="ns1blankspaceViewControl">' +
																				'<span id="ns1blankspaceViewControl_setup_import" class="ns1blankspaceViewControl">' +
																				'Imports</span></td></tr>');
														}

														if (aHTMLViewport.length > 0)
														{
															aHTML.push('<td class="ns1blankspaceViewControlColumn">');
															aHTML.push('<table class="ns1blankspaceViewControlColumn">');

															aHTML.push('<tr><td>' +
																'<div id="ns1blankspaceViewSetupWebsite" class="ns1blankspaceViewImage"></div>' +
																'</td></tr>');
														
															aHTML.push(aHTMLViewport.join(''))

															aHTML.push('</table>');
															aHTML.push('</td>');
														}		

														var aHTMLViewport = [];

														var oViewport = $.grep(ns1blankspace.views, function (a) {return a.title == 'Financials';})[0];
														if (oViewport ? oViewport.show : false)
														{
															aHTMLViewport.push('<tr class="ns1blankspaceViewControl">' +
																				'<td class="ns1blankspaceViewControl">' +
																				'<span id="ns1blankspaceViewControl_setup_financial" class="ns1blankspaceViewControl">' +
																				'Financials</span></td></tr>');
														}

														var oViewport = $.grep(ns1blankspace.views, function (a) {return a.title == 'Businesses';})[0];
														if (oViewport ? oViewport.show : false)
														{
															aHTMLViewport.push('<tr class="ns1blankspaceViewControl">' +
																				'<td class="ns1blankspaceViewControl">' +
																				'<span id="ns1blankspaceViewControl_setup_contactBusinessGroup" class="ns1blankspaceViewControl">' +
																				'Business&nbsp;Groups</span></td></tr>');
														}

														var oViewport = $.grep(ns1blankspace.views, function (a) {return a.title == 'People';})[0];
														if (oViewport ? oViewport.show : false)
														{
															aHTMLViewport.push('<tr class="ns1blankspaceViewControl">' +
																				'<td class="ns1blankspaceViewControl">' +
																				'<span id="ns1blankspaceViewControl_setup_contactPersonGroup" class="ns1blankspaceViewControl">' +
																				'Person&nbsp;Groups</span></td></tr>');
														}

														var oViewport = $.grep(ns1blankspace.views, function (a) {return a.title == 'Project Templates';})[0];
														if (oViewport ? oViewport.show : false)
														{
															aHTMLViewport.push('<tr class="ns1blankspaceViewControl">' +
																				'<td class="ns1blankspaceViewControl">' +
																				'<span id="ns1blankspaceViewControl_setup_project" class="ns1blankspaceViewControl">' +
																				'Project&nbsp;Templates</span></td></tr>');
														}

														var oViewport = $.grep(ns1blankspace.views, function (a) {return a.title == 'Project Template Tasks';})[0];
														if (oViewport ? oViewport.show : false)
														{
															aHTMLViewport.push('<tr class="ns1blankspaceViewControl">' +
																				'<td class="ns1blankspaceViewControl">' +
																				'<span id="ns1blankspaceViewControl_setup_projectTask" class="ns1blankspaceViewControl">' +
																				'Project&nbsp;Template&nbsp;Tasks</span></td></tr>');
														}

														if (aHTMLViewport.length > 0)
														{
															aHTML.push('<td class="ns1blankspaceViewControlColumn">');
															aHTML.push('<table class="ns1blankspaceViewControlColumn">');

															aHTML.push('<tr><td>' +
																'<div id="ns1blankspaceViewFinancial" class="ns1blankspaceViewImage"></div>' +
																'</td></tr>');		
														
															aHTML.push(aHTMLViewport.join(''))

															aHTML.push('</table>');
															aHTML.push('</td>');
														}		
														
														var aHTMLViewport = [];
																		
														var oViewport = $.grep(ns1blankspace.views, function (a) {return a.title == 'My Account';})[0];
														if (oViewport ? oViewport.show : false)
														{
															aHTMLViewport.push('<tr class="ns1blankspaceViewControl">' +
																				'<td class="ns1blankspaceViewControl">' +
																				'<span id="ns1blankspaceViewControl_setup_space" class="ns1blankspaceViewControl">' +
																				'My&nbsp;Space&nbsp;/&nbsp;Account</span></td></tr>');
														}

														var oViewport = $.grep(ns1blankspace.views, function (a) {return a.title == 'Other Spaces';})[0];
														if (oViewport ? oViewport.show : false)
														{
															aHTMLViewport.push('<tr class="ns1blankspaceViewControl">' +
																				'<td class="ns1blankspaceViewControl">' +
																				'<span id="ns1blankspaceViewControl_developer_space" class="ns1blankspaceViewControl">' +
																				'Other&nbsp;Spaces</span></td></tr>');
														}

														var oViewport = $.grep(ns1blankspace.views, function (a) {return a.title == 'File Import';})[0];
														if (oViewport ? oViewport.show : false)
														{
															aHTMLViewport.push('<tr class="ns1blankspaceViewControl">' +
																				'<td class="ns1blankspaceViewControl">' +
																				'<span id="ns1blankspaceViewControl_setup_file" class="ns1blankspaceViewControl">' +
																				'File&nbsp;Import</span></td></tr>');
														}

														var oViewport = $.grep(ns1blankspace.views, function (a) {return a.title == 'Structures' && a.type == 2;})[0];
														if (oViewport ? oViewport.show : false)
														{		
															aHTMLViewport.push('<tr class="ns1blankspaceViewControl">' +
																					'<td class="ns1blankspaceViewControl">' +
																					'<span id="ns1blankspaceViewControl_setup_structure" class="ns1blankspaceViewControl">' +
																					'Structures</span></td></tr>');
														}	

														var oViewport = $.grep(ns1blankspace.views, function (a) {return a.title == 'Support';})[0];
														if (oViewport ? oViewport.show : false)
														{
															aHTMLViewport.push('<tr class="ns1blankspaceViewControl">' +
																				'<td class="ns1blankspaceViewControl">' +
																				'<span id="ns1blankspaceViewControl_supportIssue" class="ns1blankspaceViewControl">' +
																				'Support&nbsp;Issues</span></td></tr>');
														}

														if (aHTMLViewport.length > 0)
														{
															aHTML.push('<td class="ns1blankspaceViewControlColumn">');
															aHTML.push('<table class="ns1blankspaceViewControlColumn">');

															aHTML.push('<tr><td>' +
																'<div id="ns1blankspaceViewSetupSpace" class="ns1blankspaceViewImage"></div>' +
																'</td></tr>');		
														
															aHTML.push(aHTMLViewport.join(''))

															aHTML.push('</table>');
															aHTML.push('</td>');
														}	
														
														aHTML.push('</tr></table>');
														
														ns1blankspace.container.show(
														{
															xhtmlElementID: 'ns1blankspaceViewControlViewContainer',
															xhtml: aHTML.join('')
														});	

														ns1blankspace.control.setup.views.bind();
													},

										bind:		function ()
													{
														$($.grep(ns1blankspace.views, function (a) {return a.type == 2;})).each(function()
														{
															var sNS = '_' + this.namespace;
															
															if (this.parentnamespace)
															{
																sNS = '_' + this.parentnamespace + sNS;
																$('#ns1blankspaceViewControl' + sNS).attr('data-parentnamespace', this.parentnamespace);
															}

															if (this.namesuffix)
															{
																sNS = sNS + '_' + this.namesuffix;
																$('#ns1blankspaceViewControl' + sNS).attr('data-namesuffix', this.namesuffix);
															}

															$('#ns1blankspaceViewControl' + sNS).attr('data-namespace', this.namespace);
															$('#ns1blankspaceViewControl' + sNS).attr('data-fullnamespace', sNS);
															$('#ns1blankspaceViewControl' + sNS).attr('data-title', this.title);

															$('#ns1blankspaceViewControl' + sNS).click(function(event)
															{
																var oParam = {};
																var sTitle = $(this).attr('data-title')

																var oViewport = $.grep(ns1blankspace.views, function (a) {return a.title == sTitle;})[0];

																if (oViewport.param)
																{
																	oParam = oViewport.param;
																}

																$(ns1blankspace.xhtml.container).attr('data-initiator', '');

																if ($(this).attr('data-parentnamespace'))
																{
																	var oNS = ns1blankspace[$(this).attr('data-parentnamespace')][$(this).attr('data-namespace')];
																}
																else
																{
																	var oNS = ns1blankspace[$(this).attr('data-namespace')];
																}

																oNS.init(oParam);
															});
														});
													}
									}
					},

	user:			{
						show: 		function (oElement)
									{
										if ($(ns1blankspace.xhtml.container).attr('data-initiator') == oElement.id)
										{
											$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
											$(ns1blankspace.xhtml.container).attr('data-initiator', '');
										}
										else
										{
											$(ns1blankspace.xhtml.container).attr('data-initiator', oElement.id);
											$(ns1blankspace.xhtml.container).html("&nbsp;");
											$(ns1blankspace.xhtml.container).show(ns1blankspace.option.showSpeedOptions);
											$(ns1blankspace.xhtml.container).offset({ top: $(oElement).offset().top + $(oElement).height() - 3, left: $(oElement).offset().left + 220});
											$(ns1blankspace.xhtml.container).html(this.layout());
												
											ns1blankspace.control.user.bind();
										}	
									},

						layout:		function ()
									{
										var aHTML = [];
		
										aHTML.push('<table style="width: 232px; font-size: 0.875em;" id="ns1blankspaceControlUser" class="ns1blankspaceViewControlContainer">');
											
										aHTML.push('<tr>' +
														'<td id="ns1blankspaceUserLogOff" class="ns1blankspaceViewControl">' +
														'Log Off</td></tr>');

										aHTML.push('<tr>' +
														'<td id="ns1blankspaceControlUserChangeTheme" class="ns1blankspaceViewControl">' +
														'Change Theme</td></tr>');
													
										aHTML.push('<tr>' +
														'<td id="ns1blankspaceControlUserChangePassword" class="ns1blankspaceViewControl">' +
														'Change My Password</td></tr>');		
													
										aHTML.push('<tr">' +
														'<td id="ns1blankspaceControlUserCreateSecureKey" class="ns1blankspaceViewControl">' +
														'Secure Access Token</td></tr>');					
														
										aHTML.push('</table>');
										
										return aHTML.join('');
									},

						bind:		function ()
									{
										$('#ns1blankspaceUserLogOff').click(function(event)
										{
											ns1blankspace.logOff();
										})
										
										$('#ns1blankspaceControlUserChangeTheme').click(function(event)
										{
											$(this).html(ns1blankspace.xhtml.loadingSmall);
											ns1blankspace.control.user.changeTheme();
										});

										$('#ns1blankspaceControlUserChangePassword').click(function(event)
										{
											$(this).html(ns1blankspace.xhtml.loadingSmall);
											ns1blankspace.control.user.changePassword();
										});
										
										$('#ns1blankspaceControlUserCreateSecureKey').click(function(event)
										{
											$(this).html(ns1blankspace.xhtml.loadingSmall);
											ns1blankspace.control.user.key({setPosition: true, xhtmlPositionElementID: 'ns1blankspaceLogonName'});
										});
									},

						changePassword:	function (oParam)
									{
										var aHTML = [];

										var bShow = false;
										var sXHTMLElementID = 'ns1blankspaceMultiUseContainer';
										
										if (oParam != undefined)
										{
											if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
											if (oParam.show != undefined) {bShow = oParam.show}
										}	
										
										aHTML.push('<table id="ns1blankspaceControlUserChangePasswordContainer" class="ns1blankspaceViewControlContainer" style="width:350px;">');
											
										if (bShow)
										{
											ns1blankspace.container.position({xhtmlElementID: sXHTMLElementID, leftOffset: 0, topOffset: -255});
											
											aHTML.push('<tr><td class="ns1blankspaceHeader">Change Password</td>' +
															'<td class="ns1blankspaceHeader" style="text-align:right;">' +
															'<span id="ns1blankspaceClose">Close</span></td></tr>');
										}
											
										aHTML.push('<tr><td id="ns1blankspaceControlUserChangePassword" style="font-size:0.875em" colspan=2></td></tr></table>');
										
										$('#' + sXHTMLElementID).html(aHTML.join(''));	
										
										$('#ns1blankspaceClose').button(
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
										
										ns1blankspace.logon.changePassword.show({xhtmlElementID: 'ns1blankspaceLogonName'});
										
									},

						changeTheme:
									function (oParam, oResponse)
									{
										var aHTML = [];
										var h = -1;
										var bShow = true;
										var bSetPosition = false;
										var sXHTMLElementID = 'ns1blankspaceMultiUseContainer'
										var sXHTMLPositionElementID = 'ns1blankspaceMultiUseContainer'
										var sTheme;

										if (oParam != undefined)
										{
											if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
											if (oParam.xhtmlPositionElementID != undefined) {sXHTMLPositionElementID = oParam.xhtmlPositionElementID}
											if (oParam.show != undefined) {bShow = oParam.show}
											if (oParam.setPosition != undefined) {bSetPosition = oParam.setPosition}
											if (oParam.theme != undefined) {sTheme = oParam.theme}
										}	
										
										if (sTheme == undefined)
										{
											aHTML.push('<table id="ns1blankspaceControlUserKeyContainer" class="ns1blankspaceViewControlContainer" style="width:200px;"><tr><td>');	

											if (bSetPosition)
											{
												ns1blankspace.container.position({xhtmlElementID: sXHTMLElementID, leftOffset: -198, topOffset: 0})
											}	
											
											aHTML.push('<table id="ns1blankspaceControlUserChangeTheme" style="width:200px;">');
											
											aHTML.push('<tr class="ns1blankspace">' +
														'<td id="ns1blankspaceContolUser" class="ns1blankspaceRadio">');
									
											$.each(ns1blankspace.themes, function(i)
											{
												aHTML.push('<input class="theme" type="radio" id="radioTheme-' + i + '" name="radioTheme" value="' + this.cssURI + '"' +
																	' title="' + this.title + '"/>' + this.title + '<br />');				
											});
											
											aHTML.push('</td></tr>');	
											
											aHTML.push('<tr><td><span id="ns1blankspaceClose" class="ns1blankspaceAction">Close</span></td></tr>');
										
											aHTML.push('</table>');
												
											$('#' + sXHTMLElementID).html(aHTML.join(''));	
											
											$('#ns1blankspaceClose').button()
											.click(function() {
												$('#' + sXHTMLElementID).slideUp(500);
												$('#' + sXHTMLElementID).html('');
												$('#' + sXHTMLElementID).attr('data-initiator', '');
											})
											
											$('[name="radioTheme"][title="' + ns1blankspace.user.theme + '"]').attr('checked', true);
										
											$('input.theme')
											.click(function()
											{
												var sTitle = $(this).attr('title');
												ns1blankspace.control.user.changeTheme({theme: sTitle})
											});
										}	
										else
										{		
											 var oTheme = $.grep(ns1blankspace.themes, function (a) {return a.title == sTheme;})[0];	

											 if (oTheme != undefined)
											 {	
											 	ns1blankspace.user.theme = sTheme;

												var sCSSURI = oTheme.cssURI;

												$.ajax(
												{
													type: 'POST',
													url: ns1blankspace.util.endpointURI('CORE_PROFILE_MANAGE'),
													data: 'type=1&id=455&value=' + ns1blankspace.util.fs(ns1blankspace.user.theme),
													dataType: 'text'
												})

												if (sCSSURI == '')
												{
													$("#ns1blankspaceThemeCSS").remove();
												}
												else
												{
												    if ($("#ns1blankspaceThemeCSS").length == 0)
												    {
												        $("head").append("<link>");

												        var cssLink = $("head").children(":last");

												        cssLink.attr(
												        {
													        id: "ns1blankspaceThemeCSS",
													        rel:  "stylesheet",
													        type: "text/css",
													        href: sCSSURI
												        });
												    }
												    else
												    {
												        $("#ns1blankspaceThemeCSS").attr("href", sCSSURI);
												    }
												}
												    
											    if (oTheme.xhtmlHeader != undefined)
											    {
											    	$('#ns1blankspaceHeader').html(oTheme.xhtmlHeader);
											    }

											    if (oTheme.xhtmlHeaderLogo != undefined)
											    {
											    	$('#ns1blankspaceLogo').html(oTheme.xhtmlHeaderLogo);
											    }
											}   
										}
									},		

						key:		function (oParam, oResponse)
									{
										var aHTML = [];
										var h = -1;
										var bShow = true;
										var bSetPosition = false;
										var sXHTMLElementID = 'ns1blankspaceMultiUseContainer'
										var sXHTMLPositionElementID = 'ns1blankspaceMultiUseContainer'

										if (oParam != undefined)
										{
											if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
											if (oParam.xhtmlPositionElementID != undefined) {sXHTMLPositionElementID = oParam.xhtmlPositionElementID}
											if (oParam.show != undefined) {bShow = oParam.show}
											if (oParam.setPosition != undefined) {bSetPosition = oParam.setPosition}
										}	
										
										if (oResponse == undefined)
										{
											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('CORE_SECURE_TOKEN_SEARCH'),
												dataType: 'json',
												success: function(data) {ns1blankspace.control.user.key(oParam, data)}
											})
										}
										else
										{	
											aHTML.push('<table id="ns1blankspaceControlUserKeyContainer" class="ns1blankspaceViewControlContainer" style="width:400px;"><tr><td>');	

											if (bSetPosition)
											{
												ns1blankspace.container.position({xhtmlElementID: sXHTMLElementID, leftOffset: -198, topOffset: 0})
											}	
										
											if (bShow)
											{
												aHTML.push('<table style="width:400px;">' + 
																'<tr><td class="ns1blankspaceCaption">Secure Access Token</td>' +
																'<td id="tdns1blankspaceHomeOptionClose" style="text-align:right;">' +
																'<span id="ns1blankspaceClose">Close</span></td>' +
																'</tr>' +
																'</table>');
											}
											
											aHTML.push('<table id="ns1blankspaceControlUserCreateSecureKey" style="width:400px; font-size:0.75em">');
											
											if (oResponse.access_token == undefined)
											{
												aHTML.push('<tr><td>' +
																'<br />No key has been set up.  Click <b>New Token</b> to create a token, which you can use to link to your information.<br /><br /></td></tr>');
												
											}
											else
											{
												aHTML.push('<tr><td>' +
																	oResponse.access_token + '<br /><br /></td></tr>');
												
												aHTML.push('<tr><td><span id="ns1blankspaceControlUserCreateSecureKeyDisable">Disable Token</span></td></tr>');								
												aHTML.push('<tr><td><br />If you generate a new token, the current token will no longer work.<br /><br /></td></tr>');
											}
											
											aHTML.push('<tr><td><span id="ns1blankspaceControlUserCreateSecureKeyNew">New Token</span></td></tr>');
											
											if (oResponse.access_token != undefined)
											{
												aHTML.push('<tr><td><br /><b>Example link for future diary events in iCal format:</b><br /><br />' +
																	window.location.protocol + '//' + window.location.host + '/ondemand/action/' +
																	'<br />?method=ACTION_ICAL_SEARCH' +
																	'<br />&access_token=' + oResponse.access_token + '<br /><br /></td></tr>');
																	
												aHTML.push('<tr><td><a href="' +
																	window.location.protocol + '//' + window.location.host + '/ondemand/action/?method=ACTION_ICAL_SEARCH' +
																	'&access_token=' + oResponse.access_token + '" target="_blank" style="font-size:1.2em">Open example link</a>' +
																	'<br /><span style="color: #A0A0A0;">(You can then copy & paste it)<br /><br /></span></td></tr>');					
											}
											
											aHTML.push('</table>');
											
											aHTML.push('</td></tr></table>');
											
											$('#' + sXHTMLElementID).html(aHTML.join(''));	
											
											$('#ns1blankspaceClose').button(
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
											
											$('#ns1blankspaceControlUserCreateSecureKeyDisable').button()
											.click(function() {
											
												if (confirm('Are you sure?'))
												{
													$.ajax(
													{
														type: 'POST',
														url: ns1blankspace.util.endpointURI('CORE_SECURE_TOKEN_MANAGE'),
														data: 'remove=1&rf=TEXT',
														dataType: 'text',
														async: false,
														success: function(data) {ns1blankspace.control.user.createSecureKey({setPosition: false})}
													})
												}		
											})
											.css('width', '150px')
											
											$('#ns1blankspaceControlUserCreateSecureKeyNew').button()
											.click(function() {
											
												if (confirm('Are you sure?'))
												{
													$.ajax(
													{
														type: 'POST',
														url: ns1blankspace.util.endpointURI('CORE_SECURE_TOKEN_MANAGE'),
														data: 'rf=TEXT',
														dataType: 'text',
														async: false,
														success: function(data) {ns1blankspace.control.user.createSecureKey({setPosition: false})}
													})
												}		
											})
											.css('width', '150px');
										}		
									}
					},
					
	spaces:			{					
						show:		function (oElement, oResponse)
									{
										var aHTML = [];

										if (oResponse == undefined)	
										{
											if ($(ns1blankspace.xhtml.container).attr('data-source') == oElement.id)
											{
												$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
												$(ns1blankspace.xhtml.container).attr('data-source', '');
											}
											else
											{	
												$(ns1blankspace.xhtml.container).attr('data-source', oElement.id);
												$(ns1blankspace.xhtml.container).html('<table style="width: 250px;" class="ns1blankspaceViewControlContainer"><tr><td>' + ns1blankspace.xhtml.loadingSmall + '</tr><td></table>');
												$(ns1blankspace.xhtml.container).show(ns1blankspace.option.showSpeedOptions);
												$(ns1blankspace.xhtml.container).offset({ top: $(oElement).offset().top + $(oElement).height() - 5, left: $(oElement).offset().left + 150});

												if (ns1blankspace.space == ns1blankspace.user.space)
												{	
													var oSearch = new AdvancedSearch();
													oSearch.method = 'CORE_SPACE_SEARCH';
													oSearch.addField('space,spacetext,unrestrictedaccess');
													oSearch.sort('space', 'asc');
													oSearch.rows = 15;
													oSearch.getResults(function(data) {ns1blankspace.control.spaces.show(oElement, data)});

													//Add: space.role.RoleText to get roles
												}
												else
												{
													aHTML.push('<table style="width: 300px;" class="ns1blankspaceViewControlContainer">' +
																	'<tr class="ns1blankspaceSpaceOptions">' +
																	'<td id="ns1blankspaceControlSpaceSwitchBack" class="ns1blankspaceRowSelect">' +
																	'Switch back to your space.' +
																	'</td></tr>' +
																	'</table>');
											
													$(ns1blankspace.xhtml.container).html(aHTML.join(''));

													$('#ns1blankspaceControlSpaceSwitchBack').click(function(event)
													{
														$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);

														$.ajax(
														{
															type: 'POST',
															url: ns1blankspace.util.endpointURI('CORE_SPACE_MANAGE'),
															data: 'switchback=1',
															dataType: 'json',
															success: function(data)
															{
																if (data.status == 'OK')
																{	
																	ns1blankspace.space = ns1blankspace.user.space;
																	ns1blankspace.spaceText = ns1blankspace.user.spaceText;
																	ns1blankspace.financial.data = undefined;
																	ns1blankspace.financial.initStatus = undefined;
																	ns1blankspace.extend.structure = undefined;
																	$('#ns1blankspaceSpaceText').html(ns1blankspace.spaceText);
																	ns1blankspace.app.refresh();
																}
															}
														});	
													});

												}	
											}
										}	
										else
										{
											aHTML.push('<table style="width: 302px;" class="ns1blankspaceViewControlContainer">');

											if (oResponse.data.rows.length == 0)
											{
												aHTML.push('<tr><td class="ns1blankspaceNothing">No access to other spaces.</td></tr>');
											}
											else
											{
												aHTML.push('<tr><td class="ns1blankspaceNothing" style="padding-left:5px;padding-right:10px;">' +
													'<input id="ns1blankspaceControlSpaceSearch" class="ns1blankspaceMainText" style="font-size:1.1em; width:100%; height:23px;"></td></tr>');

												aHTML.push('<tr><td id="ns1blankspaceSpaceSearchResults"></td></tr>');

											}	

											aHTML.push('</table>');

											$(ns1blankspace.xhtml.container).html(aHTML.join(''));

											var aHTML = [];

											aHTML.push('<table id="ns1blankspaceControlSpaceSwitchContainer" style="width: 100%;" cellpadding=4>');

											$(oResponse.data.rows).each(function()
											{
												aHTML.push('<tr>' +
																'<td id="ns1blankspaceControlSpaceSwitch-' + this.id + '" class="ns1blankspaceRowSelect">' +
																this.spacetext +
																'</td></tr>');
											});			
															
											aHTML.push('</table>');
											
											$('#ns1blankspaceSpaceSearchResults').html(aHTML.join(''));
										
											$('#ns1blankspaceControlSpaceSearch').focus();

											$('#ns1blankspaceControlSpaceSearch').keyup(function(event)
											{
												if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
										        ns1blankspace.timer.delayCurrent = setTimeout("ns1blankspace.control.spaces.process('ns1blankspaceControlSpaceSearch')", ns1blankspace.option.typingWait);
											});

											$('#ns1blankspaceControlSpaceSwitchContainer td.ns1blankspaceRowSelect').click(function(event)
											{
												$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);

												var aID = (event.target.id).split('-')
												$.ajax(
												{
													type: 'GET',
													url: ns1blankspace.util.endpointURI('CORE_SPACE_MANAGE'),
													data: 'switch=1&id=' + aID[1],
													dataType: 'json',
													success: function(data)
													{
														if (data.status == 'OK')
														{	
															ns1blankspace.space = aID[1];
															ns1blankspace.spaceText = $('#' + event.target.id).html();
															ns1blankspace.financial.data = undefined;
															ns1blankspace.financial.initStatus = undefined;
															ns1blankspace.extend.structure = undefined;
															$('#ns1blankspaceSpaceText').html(ns1blankspace.spaceText);
															ns1blankspace.app.refresh();
														}	
													}
												});	
											});
										}
									},

						process:	function (sXHTMLElementID, oResponse)
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
											
											var oSearch = new AdvancedSearch();
											oSearch.method = 'CORE_SPACE_SEARCH';
											oSearch.addField('space,spacetext,unrestrictedaccess');
											oSearch.addFilter('spacetext', 'TEXT_IS_LIKE', sSearchText);
											oSearch.sort('space', 'asc');
											oSearch.rows = 15;
											oSearch.getResults(function(data) {ns1blankspace.control.spaces.process(sXHTMLElementID, data)});
										}
										else
										{	
											aHTML.push('<table id="ns1blankspaceControlSpaceSwitchContainer" style="width: 100%;" cellspacing=4>');

											$(oResponse.data.rows).each(function()
											{
												aHTML.push('<tr>' +
																'<td id="ns1blankspaceControlSpaceSwitch-' + this.id + '" class="ns1blankspaceRowSelect">' +
																this.spacetext +
																'</td></tr>');
											});		
															
											aHTML.push('</table>');
											
											$('#ns1blankspaceSpaceSearchResults').html(aHTML.join(''));

											$('#ns1blankspaceControlSpaceSwitchContainer td.ns1blankspaceRowSelect').click(function(event)
											{
												$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);

												var aID = (event.target.id).split('-')
												$.ajax(
												{
													type: 'GET',
													url: ns1blankspace.util.endpointURI('CORE_SPACE_MANAGE'),
													data: 'switch=1&id=' + aID[1],
													dataType: 'json',
													success: function(data)
													{
														if (data.status == 'OK')
														{	
															ns1blankspace.space = aID[1];
															ns1blankspace.spaceText = $('#' + event.target.id).html();
															ns1blankspace.financial.data = undefined;
															ns1blankspace.financial.initStatus = undefined;
															ns1blankspace.extend.structure = undefined;
															$('#ns1blankspaceSpaceText').html(ns1blankspace.spaceText);
															ns1blankspace.app.refresh();
														}	
													}
												});	
											});
										}	
									}
					}
}									
