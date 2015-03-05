/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 */

ns1blankspace.xhtml.loading = '<img class="ns1blankspaceLoading" id="ns1blankspaceLoading" src="/jscripts/images/1blankspace.loading.square.20.gif">';
ns1blankspace.xhtml.loadingSmall = '<img class="ns1blankspaceLoadingSmall" id="ns1blankspaceLoadingSmall" src="/jscripts/images/1blankspace.loading.square.10.gif">';
ns1blankspace.xhtml.editorCSS = '';

ns1blankspace.option.defaultRows = 20;
ns1blankspace.option.defaultView = "Select...";
ns1blankspace.option.defaultSetupView = "Website";
ns1blankspace.option.returnToLast = true;
ns1blankspace.option.restLevel = 0;
ns1blankspace.option.autoSetupSwitch = true;
ns1blankspace.option.passwordhash = true;
ns1blankspace.option.formFactor.size.value = ns1blankspace.option.formFactor.size.options.medium;
ns1blankspace.option.classic = true;
ns1blankspace.option.loadControl = false;

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
ns1blankspace.option.messagingCheckForNew = 60000;
ns1blankspace.option.helpURI = 'http://community.mydigitalstructure.com';
ns1blankspace.option.taxVATCaption = 'GST';
ns1blankspace.option.taxPayrollCaption = 'Employee';
ns1blankspace.option.taxBusinessCaption = 'Business';
ns1blankspace.option.currencySymbol = '$';
ns1blankspace.option.postInit = undefined;
ns1blankspace.option.initialiseSpaceTemplate = '/jscripts/1blankspace.setup.space-2.0.0.json';

if (ns1blankspace.financial === undefined) {ns1blankspace.financial = {}}
if (ns1blankspace.control === undefined) {ns1blankspace.control = {}}

ns1blankspace.financial.summaryUseTemplate = false; 

ns1blankspace.xhtml.templates = {source: {}, document: {}};

ns1blankspace.xhtml.templates.source =
{
	invoice: '/jscripts/1blankspace.setup.financial.invoice-1.0.0.html',
	statement: '/jscripts/1blankspace.setup.financial.statement-1.0.0.html',
	payroll: '/jscripts/1blankspace.setup.financial.payroll-1.0.0.html',
	payslip: '/jscripts/1blankspace.setup.financial.payslip-1.0.0.html',
}	

ns1blankspace.xhtml.logonNotes =
	'<span style="font-weight:bold;">THIS IS AN UI BEING WORKED ON BY THE COMMUNITY.</span><br /><br />' +
	'As much as mydigitalstructure is well proven and stable, this HTML/js UI code is not yet stable and should not be used in production as is. ' +
	'It exists to allow the community to debug and others to learn from. ' +
	'Each day it gets more stable, so keep a watch on the repo.  If you find a bug, please raise an issue on github.<br /><br />' +
	'<span style="font-weight:bold">Thanks!</span></span><br /><br />' +
	'1blankspace all-of-enterprise is an example app based on the mydigitalstructure platform.' +
	'<br /><br /><a href="http://mydigitalstructure.com/1blankspace" target="_blank">1blankspace namespace</a>' +
	'<br /><br /><a href="https://github.com/ibcom/1blankspace" target="_blank">github repository</a>' +
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

ns1blankspace.scripts =
ns1blankspace.scripts.concat(
[
	{
		nameSpace: '1blankspace.home',
		source: '/jscripts/1blankspace.home-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.format',
		source: '/jscripts/1blankspace.format-2.0.1.js'
	},
	{
		nameSpace: '1blankspace.contactPerson',
		source: '/jscripts/1blankspace.contactperson-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.contactBusiness',
		source: '/jscripts/1blankspace.contactbusiness-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.opportunity',
		source: '/jscripts/1blankspace.opportunity-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.action',
		source: '/jscripts/1blankspace.action-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.messaging.conversation',
		source: '/jscripts/1blankspace.messaging.conversation-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.messaging.imap',
		source: '/jscripts/1blankspace.messaging.imap-2.0.6.js'
	},
	{
		nameSpace: '1blankspace.document',
		source: '/jscripts/1blankspace.document-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.news',
		source: '/jscripts/1blankspace.news-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.event',
		source: '/jscripts/1blankspace.event-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.project',
		source: '/jscripts/1blankspace.project-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.projectTask',
		source: '/jscripts/1blankspace.projecttask-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.product',
		source: '/jscripts/1blankspace.product-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.order',
		source: '/jscripts/1blankspace.order-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.financial',
		source: '/jscripts/1blankspace.financial-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.financial.bankAccount',
		source: '/jscripts/1blankspace.financial.bankaccount-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.financial.invoice',
		source: '/jscripts/1blankspace.financial.invoice-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.financial.expense',
		source: '/jscripts/1blankspace.financial.expense-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.financial.receipt',
		source: '/jscripts/1blankspace.financial.receipt-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.financial.payment',
		source: '/jscripts/1blankspace.financial.payment-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.financial.credit',
		source: '/jscripts/1blankspace.financial.credit-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.financial.journal',
		source: '/jscripts/1blankspace.financial.journal-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.financial.tax',
		source: '/jscripts/1blankspace.financial.tax-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.financial.payroll',
		source: '/jscripts/1blankspace.financial.payroll-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.report',
		source: '/jscripts/1blankspace.report-2.0.1.js'
	},
	{
		nameSpace: '1blankspace.setup',
		source: '/jscripts/1blankspace.setup-2.0.1.js'
	},
	{
		nameSpace: '1blankspace.setup.automation',
		source: '/jscripts/1blankspace.setup.automation-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.setup.financial',
		source: '/jscripts/1blankspace.setup.financial-2.0.1.js'
	},
	{
		nameSpace: '1blankspace.setup.messaging',
		source: '/jscripts/1blankspace.setup.messaging-2.0.1.js'
	},
	{
		nameSpace: '1blankspace.setup.networkGroup',
		source: '/jscripts/1blankspace.setup.networkgroup-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.setup.project',
		source: '/jscripts/1blankspace.setup.project-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.setup.projectTask',
		source: '/jscripts/1blankspace.setup.projecttask-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.setup.space',
		source: '/jscripts/1blankspace.setup.space-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.setup.structure',
		source: '/jscripts/1blankspace.setup.structure-2.0.1.js'
	},
	{
		nameSpace: '1blankspace.setup.user',
		source: '/jscripts/1blankspace.setup.user-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.setup.userRole',
		source: '/jscripts/1blankspace.setup.userRole-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.setup.website',
		source: '/jscripts/1blankspace.setup.website-2.0.1.js'
	},
	{
		nameSpace: '1blankspace.setup.websiteForm',
		source: '/jscripts/1blankspace.setup.websiteForm-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.structure',
		source: '/jscripts/1blankspace.structure-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.structureData',
		source: '/jscripts/1blankspace.structuredata-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.supportIssue',
		source: '/jscripts/1blankspace.supportissue-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.setup.file',
		source: '/jscripts/1blankspace.setup.file-2.0.1.js'
	},
	{
		nameSpace: '1blankspace.developer.space',
		source: '/jscripts/1blankspace.developer.space-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.util.local',
		source: '/jscripts/1blankspace.util.local-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.util.protect',
		source: '/jscripts/1blankspace.util.protect-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.connect',
		source: '/jscripts/1blankspace.connect-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.util.whenDone',
		source: '/jscripts/1blankspace.util.whendone-2.0.0.js'
	}
])

ns1blankspace.themes = 
[
	{
		title: 				'Standard',
		cssURI: 			'', 
		xhtmlHeaderLogo: 	'<img src="/jscripts/images/1blankspace.aoe-2.0.0.png">',
		"default": 			true
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
		type: 1,
		search:
		{
			filters:
			[
				{
					caption: "Email",
					name: "email",
					type: 'Text',
					comparison: 'TEXT_IS_LIKE',
					fixed: false
				},
				{
					caption: "Mobile",
					name: "mobile",
					type: 'Text',
					comparison: 'TEXT_IS_LIKE',
					fixed: false
				}
			],
			advanced: true	
		}
	},
	{
		title: "Businesses",
		namespace: "contactBusiness",
		endpoint: "CONTACT_BUSINESS",
		show: true,
		group: 1,
		type: 1,
		search:
		{
			advanced: true
		}
	},
	{
		title: "Opportunities",
		namespace: "opportunity",
		endpoint: "OPPORTUNITY",
		show: true,
		group: 1,
		type: 1,
		search:
		{
			advanced: true
		}
	},
	{
		title: "Email",
		parentNamespace: "messaging",
		namespace: "imap",
		endpoint: "MESSAGING_IMAP",
		show: true,
		group: 1,
		type: 1
	},
	{
		title: "Conversations",
		parentNamespace: "messaging",
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
		show: false,
		group: 2,
		type: 1
	},
	{
		title: "Actions",
		namespace: "action",
		endpoint: "ACTION",
		show: true,
		group: 2,
		type: 1,
		subNote: '& calendar'
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
		type: 1,
		search:
		{
			advanced: true
		}
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
		type: 1,
		subNote: 'P&L, Debtors..'
	},
	{
		title: "Bank&nbsp;Accounts",
		parentNamespace: "financial",
		namespace: "bankAccount",
		endpoint: "FINANCIAL_BANK_ACCOUNT",
		show: true,
		group: 5,
		type: 1,
		subNote: 'Reconcile..'
	},
	{
		title: "Invoices",
		parentNamespace: "financial",
		namespace: "invoice",
		endpoint: "FINANCIAL_INVOICE",
		show: true,
		group: 5,
		type: 1,
		search:
		{
			advanced: true,
			filters:
			[
				{
					caption: "Amount",
					name: "amount",
					type: 'Text',
					comparison: 'EQUAL_TO',
					fixed: false
				},
				{
					caption: "Date",
					name: "sentdate",
					type: 'Date',
					comparison: 'EQUAL_TO',
					fixed: false
				}
			],
		}
	},
	{
		title: "Expenses",
		parentNamespace: "financial",
		namespace: "expense",
		endpoint: "FINANCIAL_EXPENSE",
		show: true,
		group: 5,
		type: 1,
		search:
		{
			advanced: true,
			filters:
			[
				{
					caption: "Amount",
					name: "amount",
					type: 'Text',
					comparison: 'EQUAL_TO',
					fixed: false
				},
				{
					caption: "Date",
					name: "accrueddate",
					type: 'Date',
					comparison: 'EQUAL_TO',
					fixed: false
				}
			],
		}
	},
	{
		title: "Receipts",
		parentNamespace: "financial",
		namespace: "receipt",
		endpoint: "FINANCIAL_RECEIPT",
		show: true,
		group: 5,
		type: 1,
		search:
		{
			advanced: true,
			filters:
			[
				{
					caption: "Amount",
					name: "amount",
					type: 'Text',
					comparison: 'EQUAL_TO',
					fixed: false
				},
				{
					caption: "Date",
					name: "receiveddate",
					type: 'Date',
					comparison: 'EQUAL_TO',
					fixed: false
				}
			],
		}
	},
	{
		title: "Payments",
		parentNamespace: "financial",
		namespace: "payment",
		endpoint: "FINANCIAL_PAYMENT",
		show: true,
		group: 5,
		type: 1,
		search:
		{
			advanced: true,
			filters:
			[
				{
					caption: "Amount",
					name: "amount",
					type: 'Text',
					comparison: 'EQUAL_TO',
					fixed: false
				},
				{
					caption: "Date",
					name: "paiddate",
					type: 'Date',
					comparison: 'EQUAL_TO',
					fixed: false
				}
			],
		}
	},
	{
		title: "Credits",
		parentNamespace: "financial",
		namespace: "credit",
		endpoint: "FINANCIAL_CREDIT",
		show: true,
		group: 5,
		type: 1
	},
	{
		title: "Journals",
		parentNamespace: "financial",
		namespace: "journal",
		endpoint: "FINANCIAL_GENERAL_JOURNAL",
		show: true,
		group: 6,
		type: 1
	},
	{
		title: "Payroll",
		parentNamespace: "financial",
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
		show: false,
		group: 6,
		type: 1
	},
	{
		title: "Tax",
		parentNamespace: "financial",
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
		parentNamespace: "setup",
		namespace: "user",
		endpoint: "SETUP_USER", 
		show: true,
		group: 7,
		type: 2
	},
	{
		title: "User&nbsp;Roles",
		parentNamespace: "setup",
		namespace: "userRole",
		endpoint: "SETUP_USER_ROLE", 
		show: true,
		group: 7,
		type: 2
	},
	{
		title: "Network&nbsp;Groups",
		parentNamespace: "setup",
		namespace: "networkGroup",
		endpoint: "SETUP_NETWORK_GROUP", 
		show: true,
		group: 7,
		type: 2
	},
	{
		title: "Messaging",
		parentNamespace: "setup",
		namespace: "messaging",
		endpoint: "SETUP_MESSAGING", 
		show: true,
		group: 7,
		type: 2,
		subNote: 'Email'
	},
	{
		title: "Websites & Webapps",
		parentNamespace: "setup",
		namespace: "website",
		endpoint: "SETUP_SITE", 
		show: true,
		group: 8,
		type: 2
	},
	{
		title: "Connections",
		namespace: "connect",
		endpoint: "CORE_URL", 
		show: true,
		group: 8,
		type: 2
	},
	{
		title: "Automation",
		parentNamespace: "setup",
		namespace: "automation",
		endpoint: "SETUP_AUTOMATION", 
		show: true,
		group: 8,
		type: 2
	},
	{
		title: "Financials",
		parentNamespace: "setup",
		namespace: "financial",
		endpoint: "SETUP_FINANCIAL", 
		show: true,
		group: 9,
		type: 2
	},
	{
		title: 'Person&nbsp;Groups',
		namespace: 'setup',
		namesuffix: 'contactPersonGroup',
		endpoint: "SETUP", 
		show: true,
		group: 9,
		type: 2,
		param: {viewName: 'Person Groups', method: 'SETUP_CONTACT_PERSON_GROUP'}														
	},
	{
		title: 'Business&nbsp;Groups',
		namespace: 'setup',
		namesuffix: 'contactBusinessGroup',
		endpoint: "SETUP", 
		show: true,
		group: 9,
		type: 2,
		param: {viewName: 'Business Groups', method: 'SETUP_CONTACT_BUSINESS_GROUP'}														
	},
	{
		title: 'Product&nbsp;Categories',
		namespace: 'setup',
		namesuffix: 'productCategory',
		endpoint: "SETUP", 
		show: true,
		group: 9,
		type: 2,
		param: {viewName: 'Product Categories', method: 'SETUP_PRODUCT_CATEGORY'}														
	},
	{
		title: "Project&nbsp;Templates",
		parentNamespace: "setup",
		namespace: "project",
		endpoint: "PROJECT", 
		show: false,
		group: 9,
		type: 2
	},
	{
		title: "Project&nbsp;Template&nbsp;Tasks",
		parentNamespace: "setup",
		namespace: "projectTask",
		endpoint: "PROJECT", 
		show: false,
		group: 9,
		type: 2
	},
	{
		title: "My&nbsp;Space&nbsp;&&nbsp;Account",
		parentNamespace: "setup",
		namespace: "space",
		endpoint: "ADMIN", 
		show: true,
		group: 10,
		type: 2
	},
	{
		title: "File Import",
		parentNamespace: "setup",
		namespace: "file",
		endpoint: "SETUP_IMPORT_MANAGE", 
		show: true,
		group: 10,
		type: 2
	},
	{
		title: "Other&nbsp;Spaces",
		parentNamespace: "developer",
		namespace: "space",
		endpoint: "ADMIN_SPACE_MANAGE", 
		show: true,
		group: 10,
		type: 2
	},
	{
		title: "Structures",
		parentNamespace: "setup",
		namespace: "structure",
		endpoint: "SETUP_STRUCTURE_MANAGE", 
		show: true,
		group: 10,
		type: 2
	},
	{
		title: "Support&nbsp;Issues",
		namespace: "supportIssue",
		endpoint: "SUPPORT_ISSUE_MANAGE", 
		show: true,
		group: 10,
		type: 2
	}
]

ns1blankspace.viewGroups =
[
	{
		id: 1,
		name: 'Contact',
		type: 1
	},
	{
		id: 2,
		name: 'Project',
		type: 1
	},
	{
		id: 3,
		name: 'Document',
		type: 1
	},
	{
		id: 4,
		name: 'Product',
		type: 1
	},
	{
		id: 5,
		name: 'Financial',
		type: 1
	},
	{
		id: 6,
		name: '',
		type: 1
	},
	{
		id: 7,
		name: 'SetupUser',
		type: 2
	},
	{
		id: 8,
		name: 'SetupWebsite',
		type: 2
	},
	{
		id: 9,
		name: 'Financial',
		type: 2,
		width: '150px'
	},
	{
		id: 10,
		name: 'SetupSpace',
		type: 2
	}
]

ns1blankspace.control = 
{
	init: 		function (oParam, oResponse)
				{
					var iStep = 1;
					var aRoles = [];
					var sPostInit = ns1blankspace.option.postInit;
					if (sPostInit === undefined) {sPostInit = 'ns1blankspace.app.postInit'}

					if (oParam != undefined)
					{
						if (oParam.step != undefined) {iStep = oParam.step}
						if (oParam.roles != undefined) {aRoles = oParam.roles}
						if (oParam.postInit != undefined) {sPostInit = oParam.postInit}
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
						if (ns1blankspace.user.unrestricted)
						{
							$.extend(true, oParam, {step: 4});
							ns1blankspace.control.init(oParam)
						}
						else
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

						var iSiteID = ns1blankspace.user.site;

						if (iSiteID === undefined && ns1blankspace.util.ifExists({variable: 'mydigitalstructureSiteId'}) !== undefined)
						{
							iSiteID = mydigitalstructureSiteId;
						}

						if (ns1blankspace.option.loadControl)
						{
							var sURI = ns1blankspace.option.controlDataURI;

							if (sURI === undefined && iSiteID !== undefined)
							{
								sURI = '/site/' + parseInt(ns1blankspace.user.site) + '/1blankspace.control.json'
							}

							if (sURI !== undefined)
							{	
								$.ajax(
								{
									type: 'GET',
									url: sURI,
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
							success: function(data)
							{
								sData = data.replace('OK|RETURNED|', '')
								if (sData != '')
								{
									ns1blankspace.control.user.changeTheme({theme: sData});
								}

								if (sPostInit) {ns1blankspace.util.execute(sPostInit, oParam)}
							}
						})
					}		
				},

	setView:	{
					"default": 		function ()
									{
										ns1blankspace.home.show();
									},

					setup:			function ()
									{
										if (ns1blankspace.util.toFunction('ns1blankspace.setup.website.init') !== undefined)
										{	
											ns1blankspace.setup.website.init();
										}
										else
										{
											ns1blankspace.setupView = false;
											ns1blankspace.control.setView["default"]();
										}	
									}
				},					

	views:		{					
					show: 			function ()
									{
										if (ns1blankspace.xhtml.viewControl == undefined)
										{
											var aHTML = [];
											
											aHTML.push('<table class="ns1blankspaceViewControlContainer">');
											aHTML.push('<tr class="ns1blankspaceViewControl">');

											$.each($.grep(ns1blankspace.viewGroups, function (a) {return a.type == 1;}), function(i, v)
											{
												var oViewGroup = $.grep(ns1blankspace.views, function (a) {return a.group == v.id && a.show == true && a.type == 1;});

												if (oViewGroup.length > 0)
												{
													oViewGroup.sort(ns1blankspace.util.sortBy('order'))

													aHTML.push('<td class="ns1blankspaceViewControlColumn">');
													aHTML.push('<table class="ns1blankspaceViewControlColumn">');

													aHTML.push('<tr><td><div id="ns1blankspaceView' + v.name + '" class="ns1blankspaceViewImage"></div>' +
																	'</td></tr>');	

													$.each(oViewGroup, function(j, k)
													{
														aHTML.push('<tr class="ns1blankspaceViewControl">' +
																	'<td class="ns1blankspaceViewControl">' +
																	'<span id="ns1blankspaceViewControl_' + (k.parentNamespace!==undefined?k.parentNamespace + '_':'') + k.namespace +
																	'" class="ns1blankspaceViewControl">' + k.title + '</span>');

														if (k.subNote !== undefined)
														{	
															aHTML.push('<br /><div class="ns1blankspaceSubNote" style="margin-top:2px;">' + 
																	 k.subNote + '</div>');
														}	

														aHTML.push('</td></tr>');
													});

													aHTML.push('</table>');
													aHTML.push('</td>');
												}	
											});

											aHTML.push('</tr>');

											aHTML.push('<tr class="ns1blankspaceViewControl">');

											aHTML.push('<td class="ns1blankspaceViewControl" colspan=' + ns1blankspace.viewGroups.length + ' style="text-align: right; color: #999999; font-size:0.825em; padding-top:6px;">' +
															'<span id="ns1blankspaceViewControl_report" class="ns1blankspaceViewControl">' +
															'Search... report, export, update, email & SMS</span></td>');

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
											var oRoot = ns1blankspace;
											if (this.rootnamespace !== undefined) {oRoot = this.rootnamespace}
											if (this.rootNamespace !== undefined) {oRoot = this.rootNamespace}

											var sParent = this.parentNamespace;
											if (sParent === undefined) {sParent = this.parentnamespace}

											if (sParent)
											{
												sNS = '_' + sParent + sNS;
												$('#ns1blankspaceViewControl' + sNS).attr('data-parentnamespace', sParent);
											}

											$('#ns1blankspaceViewControl' + sNS).attr('data-namespace', this.namespace);

											$('#ns1blankspaceViewControl' + sNS).click(function(event)
											{
												$(ns1blankspace.xhtml.container).attr('data-initiator', '');

												if ($(this).attr('data-parentnamespace'))
												{
													var oNS = oRoot[$(this).attr('data-parentnamespace')][$(this).attr('data-namespace')];
												}
												else
												{
													var oNS = oRoot[$(this).attr('data-namespace')];
												}

												oNS.init();
											});
										});
									}
				},
					
	setup:		{
						views: 		{
										show:		function ()
													{
														var aHTML = [];
				
														aHTML.push('<table class="ns1blankspaceViewControlContainer">');
														aHTML.push('<tr class="ns1blankspaceViewControl">');
														
														var aHTMLViewport = [];

														$.each($.grep(ns1blankspace.viewGroups, function (a) {return a.type == 2;}), function(i, v)
														{
															var oViewGroup = $.grep(ns1blankspace.views, function (a) {return a.group == v.id && a.show == true && a.type == 2;});

															if (oViewGroup.length > 0)
															{
																oViewGroup.sort(ns1blankspace.util.sortBy('order'))

																aHTML.push('<td class="ns1blankspaceViewControlColumn">');
																aHTML.push('<table class="ns1blankspaceViewControlColumn">');

																aHTML.push('<tr><td><div id="ns1blankspaceView' + v.name + '" class="ns1blankspaceViewImage"' +
																				(oViewGroup.width!==undefined?' style="' + oViewGroup.width + '"':'') + '></div>' +
																				'</td></tr>');	

																$.each(oViewGroup, function(j, k)
																{
																	aHTML.push('<tr class="ns1blankspaceViewControl">' +
																				'<td class="ns1blankspaceViewControl">' +
																				'<span id="ns1blankspaceViewControl_' + (k.parentNamespace!==undefined?k.parentNamespace + '_':'') + k.namespace +
																					(k.namesuffix!==undefined?'_' + k.namesuffix:'') + 
																				'" class="ns1blankspaceViewControl">' + k.title + '</span>');

																	if (k.subNote !== undefined)
																	{	
																		aHTML.push('<br /><div class="ns1blankspaceSubNote" style="margin-top:2px;">' + 
																				 k.subNote + '</div>');
																	}	

																	aHTML.push('</td></tr>');
																});

																aHTML.push('</table>');
																aHTML.push('</td>');
															}	
														});

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
															var oRoot = ns1blankspace;
															if (this.rootnamespace !== undefined) {oRoot = this.rootnamespace}
															if (this.rootNamespace !== undefined) {oRoot = this.rootNamespace}

															var sParent = this.parentNamespace;
															if (sParent === undefined) {sParent = this.parentnamespace}

															if (sParent)
															{
																sNS = '_' + sParent + sNS;
																$('#ns1blankspaceViewControl' + sNS).attr('data-parentnamespace', sParent);
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
																	var oNS = oRoot[$(this).attr('data-parentnamespace')][$(this).attr('data-namespace')];
																}
																else
																{
																	var oNS = oRoot[$(this).attr('data-namespace')];
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
														'<td id="ns1blankspaceUserLogOnOff" class="ns1blankspaceViewControl">' +
														ns1blankspace.xhtml.loadingSmall + '</td></tr>');

										aHTML.push('<tr>' +
														'<td id="ns1blankspaceControlUserChangeTheme" class="ns1blankspaceViewControl">' +
														'Change Theme</td></tr>');
													
										aHTML.push('<tr>' +
														'<td id="ns1blankspaceControlUserChangePassword" class="ns1blankspaceViewControl">' +
														'Change My Password</td></tr>');		
													
										aHTML.push('<tr>' +
														'<td id="ns1blankspaceControlUserCreateSecureKey" class="ns1blankspaceViewControl">' +
														'Secure Access Token</td></tr>');					
														
										aHTML.push('</table>');
										
										return aHTML.join('');
									},

						bind:		function ()
									{
										$.ajax(
										{
											type: 'GET',
											url: ns1blankspace.util.endpointURI('CORE_GET_USER_DETAILS'),
											dataType: 'json',
											cache: false,
											global: false,
											success: function(data) 
											{
												if (data.status === 'ER')
												{
													$('#ns1blankspaceUserLogOnOff').html('Log On');	
												}
												else
												{
													$('#ns1blankspaceUserLogOnOff').html('Log Off');	
												}
											}
										});		

										$('#ns1blankspaceUserLogOnOff').click(function(event)
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
																	window.location.protocol + '//' + window.location.host + '/rpc/action/' +
																	'<br />?method=ACTION_ICAL_SEARCH' +
																	'<br />&access_token=' + (oResponse.access_token).replace('|', ',') + '<br /><br /></td></tr>');
																	
												aHTML.push('<tr><td><a href="' +
																	window.location.protocol + '//' + window.location.host + '/rpc/action/?method=ACTION_ICAL_SEARCH' +
																	'&access_token=' + (oResponse.access_token).replace('|', ',') + '" target="_blank" style="font-size:1.2em">Open example link</a>' +
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
													oSearch.sort('spacetext', 'asc');
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
											oSearch.sort('spacetext', 'asc');
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

ns1blankspace.attachments = 
{
	show: 		function (oParam)
				{
					var sXHTMLElementID = 'ns1blankspaceMainAttachments';
					var iObject = ns1blankspace.object;
					var iObjectContext = ns1blankspace.objectContext;
					var bShowAdd = true;
					var iAttachmentType;
					var oActions = {add: true};
					var sHelpNotes;
					var oContext = {inContext: false};

					var sSortBy = ns1blankspace.util.getParam(oParam, 'sortBy', {"default": 'filename'}).value;
					var sSortDirection = ns1blankspace.util.getParam(oParam, 'sortDirection', {"default": 'asc'}).value;
					
					if (oParam != undefined)
					{
						if (oParam.object != undefined) {iObject = oParam.object}
						if (oParam.objectContext != undefined) {iObjectContext = oParam.objectContext}
						if (oParam.objectName != undefined) {sObjectName = oParam.objectName}
						if (oParam.showAdd != undefined) {bShowAdd = oParam.showAdd}
						if (oParam.attachmentType != undefined ) {iAttachmentType = oParam.attachmentType}
						if (oParam.xhtmlElementID != undefined ) {sXHTMLElementID = oParam.xhtmlElementID}
						if (oParam.actions != undefined) {oActions = oParam.actions}
						if (oParam.helpNotes != undefined) {sHelpNotes = oParam.helpNotes}
						if (oParam.context != undefined) {oContext = oParam.context}
					}
					
					if (oActions.add)
					{
						if (ns1blankspace.app.context) {ns1blankspace.app.context(oContext)};

						var aHTML = [];
									
						aHTML.push('<table>' +
									'<tr>' +
									'<td id="ns1blankspaceAttachmentsColumn1" class="ns1blankspaceColumn1Flexible">' +
									ns1blankspace.xhtml.loading + '</td>' +
									'<td id="ns1blankspaceAttachmentsColumn2" class="ns1blankspaceColumn2" style="width:100px;"></td></tr>' +
									'</table>');					
							
						$('#' + sXHTMLElementID).html(aHTML.join(''));

						oParam = ns1blankspace.util.setParam(oParam, 'xhtmlElementID', 'ns1blankspaceAttachmentsColumn1');
						
						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspaceColumn2">');
						
						aHTML.push('<tr><td class="ns1blankspaceAction">' +
										'<span id="ns1blankspaceAttachmentsAdd">Add</span>' +
										'</td></tr>');
							
						if (sHelpNotes != undefined)
						{
							aHTML.push('<tr><td class="ns1blankspaceAction">' +
										'<hr />' +
										'</td></tr>');
										
							aHTML.push('<tr><td id="ns1blankspaceAttachmentsAddHelpNotes" class="ns1blankspaceAction" style="font-size:0.75em;color:#404040;">' +
										sHelpNotes +
										'</td></tr>');
						}
						
						aHTML.push('</table>');					
						
						$('#ns1blankspaceAttachmentsColumn2').html(aHTML.join(''));
					
						$('#ns1blankspaceAttachmentsAdd').button(
						{
							label: "Add"
						})
						.click(function()
						{
							 ns1blankspace.attachments.add(oParam);
						})
					
						sXHTMLElementID = 'ns1blankspaceAttachmentsColumn1';
					}
					
					if (iObjectContext != -1)
					{	
						var oSearch = new AdvancedSearch();
						oSearch.method = 'CORE_ATTACHMENT_SEARCH';
						oSearch.addField('type,filename,description,download,modifieddate,attachment,createddate,createdusertext');
						oSearch.addFilter('object', 'EQUAL_TO', iObject);
						oSearch.addFilter('objectcontext', 'EQUAL_TO', iObjectContext);
						oSearch.rows = ns1blankspace.option.defaultRows;
						
						if (iAttachmentType != undefined)
						{
							oSearch.addFilter('type', 'EQUAL_TO', iAttachmentType);
						}
						
						oSearch.sort(sSortBy, sSortDirection);
						oSearch.getResults(function(data) {ns1blankspace.attachments.process(data, oParam)});
					}
				},

	process: 	function (oResponse, oParam)
				{	
					var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;
					var bShowUser = ns1blankspace.util.getParam(oParam, 'showUser', {"default": false}).value;

					var aHTML = [];
						
					if (oResponse.data.rows.length === 0)
					{
						aHTML.push('<table style="margin-top:5px;">');
						aHTML.push('<tr class="ns1blankspaceAttachments">');
						aHTML.push('<td class="ns1blankspaceNothing">No attachments.</td>');
						aHTML.push('</tr>');
						aHTML.push('</table>');
						
						$('#' + sXHTMLElementID).html(aHTML.join(''));
						$('#' + sXHTMLElementID).show(ns1blankspace.option.showSpeed);
					}
					else
					{
						aHTML.push('<table id="ns1blankspaceAttachments">');
					
						aHTML.push('<tr class="ns1blankspaceCaption">');
						aHTML.push('<td class="ns1blankspaceHeaderCaption">File Name</td>');
						aHTML.push('<td class="ns1blankspaceHeaderCaption">Date</td>');

						if (bShowUser)
						{
							aHTML.push('<td class="ns1blankspaceHeaderCaption">User</td>');
						}

						aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>');
						aHTML.push('</tr>');

						$.each(oResponse.data.rows, function()
						{
							aHTML.push(ns1blankspace.attachments.row(this, oParam));
						});
				    	
						aHTML.push('</table>');

						ns1blankspace.render.page.show(
						{
							xhtmlElementID: sXHTMLElementID,
							xhtmlContext: 'Attachment',
							xhtml: aHTML.join(''),
							showMore: (oResponse.morerows === "true"),
							columns: 'subject-actiondate',
							more: oResponse.moreid,
							rows: ns1blankspace.option.defaultRows,
							functionSearch: ns1blankspace.attachments.show,
							functionShowRow: ns1blankspace.attachments.row,
							functionOnNewPage: ns1blankspace.attachments.bind,
							type: 'json'
						}); 	
							
						ns1blankspace.attachments.bind();
					}
				},
				
	row:		function (oRow, oParam)
				{
					var aHTML = [];
					var bShowUser = ns1blankspace.util.getParam(oParam, 'showUser', {"default": false}).value;

					//onClick="ns1blankspace.unloadWarning=false;"
					
					aHTML.push('<tr class="ns1blankspaceAttachments">');
					
					aHTML.push('<td id="ns1blankspaceAttachment_filename-' + oRow.id + '" class="ns1blankspaceRow">' +
										'<a href="' + oRow.download + '" class="ns1blankspaceNoUnloadWarn">' + oRow.filename + '</a></td>');
										
					aHTML.push('<td id="ns1blankspaceAttachment_date-' + oRow.id + '" class="ns1blankspaceRow">' + oRow.modifieddate + '</td>');

					if (bShowUser)
					{
						aHTML.push('<td id="ns1blankspaceAttachment_user-' + oRow.id + '" class="ns1blankspaceRow">' + oRow.createdusertext + '</td>');
					}
					
					aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">' +
									'<span id="ns1blankspaceAttachment_options_remove-' + oRow.attachment + 
									'" class="ns1blankspaceAttachmentsRemove">&nbsp;</span></td>');
					
					aHTML.push('</tr>');
					
					return aHTML.join('');
				},

	bind:		function (oParam)
				{
					$('span.ns1blankspaceAttachmentsRemove:not(".ui-button")').button(
					{
								text: false,
								 icons: {
									 primary: "ui-icon-close"
						}
					})
					.click(function()
					{
						ns1blankspace.remove(
						{
							xhtmlElementID: this.id,
							method: 'CORE_ATTACHMENT_MANAGE',
							parentLevel: 2,
							ifNoneMessage: 'No attachments.'
						});
					})
					.css('width', '15px')
					.css('height', '20px')	
				},

	add: 		function (oParam)
				{
					$('#ns1blankspaceAttachmentsColumn1').html(ns1blankspace.attachments.upload.show(oParam));
					
					$('#ns1blankspaceUpload').button(
						{
							label: "Upload"
						})
						.click(function() {
							 ns1blankspace.attachments.upload.process();
						})
				},

	upload: 	{ 
						show: 	function (oParam)
								{
									var aHTML = [];
									var h = -1;

									var iMaxFiles = 1
									var iObject = ns1blankspace.object
									var lObjectContext = ns1blankspace.objectContext
									var sLabel = '';
									var sObjectName = '';
									var iAttachmentType = '';
									var bShowUpload = true;
									var sXHTML = '';
									var sHelpNotes;
									var aInputs = [];
									var sURL = '/ondemand/attach/';
									var aInputParams = [];
									var iPublicType;
									
									if (oParam != undefined)
									{
										if (oParam.maxFiles != undefined) {iMaxFiles = oParam.maxFiles}
										if (oParam.object != undefined || iObject === '') {iObject = oParam.object}
										if (oParam.objectName != undefined) {sObjectName = oParam.objectName}
										if (oParam.objectContext != undefined ) {lObjectContext = oParam.objectContext}
										if (oParam.label != undefined) {sLabel = oParam.label}
										if (oParam.attachmentType != undefined) {iAttachmentType = oParam.attachmentType}
										if (oParam.showUpload != undefined) {bShowUpload = oParam.showUpload}
										if (oParam.xhtml != undefined) {sXHTML = oParam.xhtml}
										if (oParam.helpNotes != undefined) {sHelpNotes = oParam.helpNotes}
										if (oParam.inputs != undefined) {aInputs = oParam.inputs}
										if (oParam.url != undefined) {sURL = oParam.url}
										if (oParam.inputParams != undefined) {aInputParams = oParam.inputParams}
										if (oParam.publicType != undefined) {iPublicType = oParam.publicType}
									}	

									$('[name="ns1blankspaceFileUpload"]').remove();

									aHTML.push('<form name="ns1blankspaceFileUpload" action="' + sURL + '" ' +
													'enctype="multipart/form-data" method="POST" target="ns1blankspaceUploadProxy" accept-charset="utf-8">' +
													'<input type="hidden" name="maxfiles" id="maxfiles" value="' + iMaxFiles + '">' +
													'<input type="hidden" name="object" id="object" value="' + iObject + '">' +
													'<input type="hidden" name="objectcontext" id="objectcontext" value="' + lObjectContext + '">');
											
									for (var i = 0; i < iMaxFiles; i++) 	
									{
										aHTML.push('<input type="hidden" name="filetype' + i + '" id="filetype' + i + '" value="' + iAttachmentType + '">');
									}

									$.each(aInputs, function ()
									{	
										aHTML.push('<input type="hidden" name="' + this + '" id="' + this + '" value="">');
									});

									for (var i = 0; i < iMaxFiles; i++) 	
									{
										$.each(aInputParams, function ()
										{	
											aHTML.push('<input type="hidden" name="' + this.id + i + '" id="' + this.id + i + '" value="' + (this.value || '') + '">');
										});
									}

									if (iPublicType)
									{
										for (var i = 0; i < iMaxFiles; i++) 	
										{
											aHTML.push('<input type="hidden" name="publictype' + i + '" id="publictype' + i + '" value="' + iPublicType + '">');
										}
									}	

									aHTML.push(sXHTML);
									
									if (sLabel != '') 
									{
										aHTML.push('<div id="ns1blankspaceUploadLabel" class="ns1blankspaceUpload">' + sLabel + '</div>');
									}	
										
									for (var i = 0; i < iMaxFiles; i++) 	
									{
										aHTML.push('<div id="ns1blankspaceUploadFile' + i + '" class="ns1blankspaceUpload">' +
														'<input class="ns1blankspaceUpload" type="file" name="oFile' + i + '" id="oFile' + i + '">' +
														'</div>');
									}

									if (bShowUpload)
									{
										aHTML.push('<span id="ns1blankspaceUpload" class="ns1blankspaceAction" style="margin-top:10px;"></span>');
										aHTML.push('<br /><br /><span id="ns1blankspaceUploadStatus" class="ns1blankspaceUpload"></span>');
									}	
										
									aHTML.push('<iframe style="display:none;" name="ns1blankspaceUploadProxy" id="ns1blankspaceUploadProxy" class="ns1blankspaceUpload" frameborder="0"></iframe>' +
													'</form>');
									
									return aHTML.join('');
									
								},

					process:	function (oParam)
								{
									ns1blankspace.param = {};
									if (oParam != undefined) {ns1blankspace.param = oParam};
									
									$('#ns1blankspaceUploadStatus').html('Uploading..');
									var oForm = document.ns1blankspaceFileUpload;
								  	oForm.submit();
								 	ns1blankspace.attachments.upload.status();
									ns1blankspace.timer.delay = setInterval('ns1blankspace.attachments.upload.status()', 1000);
								},

					status:		function ()
								{
									var oDivStatus = document.getElementById('ns1blankspaceFileUploadStatus');
									var oFrame = document.getElementById('ns1blankspaceUploadProxy');
									var sStatus;
									var sCurrentState;

									var fFunctionPostUpdate = ns1blankspace.attachments.show;
									
									if (ns1blankspace.param != undefined)
									{
										if (ns1blankspace.param.functionPostUpdate != undefined) {fFunctionPostUpdate = ns1blankspace.param.functionPostUpdate}
									}
									
									if (oFrame !== null)
									{	
										if (oFrame.readyState) 
										{
											//IE
											sCurrentState = oFrame.readyState;
										}
										else 
										{
											//FF
											if (oFrame.contentDocument.body.innerHTML === 'OK') 
											{
												sCurrentState = 'complete';
											}
											else 
											{
												sCurrentState = oFrame.contentDocument.body.innerHTML;
											}
										}
									}	
								 
									if (sCurrentState === 'complete') 
									{
										clearInterval(ns1blankspace.timer.delay);

										if (oDivStatus != null)
										{
											oDivStatus.setAttribute("class", "");
											oDivStatus.style.display = 'none';
										}
										
										$('#ns1blankspaceUploadStatus').html('File Upload Complete...');
										fFunctionPostUpdate();
										
									}
								}
				}						
}

ns1blankspace.actions =
{
	show: 		function (oParam)
				{
					var sXHTMLElementContainerID = 'ns1blankspaceMainActions';
					var iObject = ns1blankspace.object;
					var iObjectContext = ns1blankspace.objectContext;
					var bShowAdd = true;
					var iType;
					var oActions = {add: true};
					var iContactBusiness;
					var iContactPerson;
					var sContactBusinessText;
					var sContactPersonText;
					var oContext = {inContext: false};
					
					if (oParam != undefined)
					{
						if (oParam.object != undefined) {iObject = oParam.object}
						if (oParam.objectContext != undefined) {iObjectContext = oParam.objectContext}
						if (oParam.objectName != undefined) {sObjectName = oParam.objectName}
						if (oParam.showAdd != undefined) {bShowAdd = oParam.showAdd}
						if (oParam.actionType != undefined ) {iType = oParam.actionType}
						if (oParam.type != undefined ) {iType = oParam.type}
						if (oParam.xhtmlElementContainerID != undefined ) {sXHTMLElementContainerID = oParam.xhtmlElementContainerID}
						if (oParam.actions != undefined) {oActions = oParam.actions}
						if (oParam.contactBusiness != undefined) {iContactBusiness = oParam.contactBusiness}
						if (oParam.contactPerson != undefined) {iContactPerson = oParam.contactPerson}
						if (oParam.contactBusinessText != undefined) {sContactBusinessText = oParam.contactBusinessText}
						if (oParam.contactPersonText != undefined) {sContactPersonText = oParam.contactPersonText}
						if (oParam.context != undefined) {oContext = oParam.context}
					}	
					else
					{
						oParam = {};
					}
					
					if (oActions.add)
					{
						if (ns1blankspace.app.context) {ns1blankspace.app.context(oContext)};

						var aHTML = [];
						var h = -1;	
									
						aHTML.push('<table id="ns1blankspace" class="ns1blankspace">' +
									'<tr>' +
									'<td id="ns1blankspaceActionsColumn1" class="ns1blankspaceColumn1Flexible">' +
									ns1blankspace.xhtml.loading +
									'</td>' +
									ns1blankspace.option.formFactor.is(
									{
										size: 'small',
										not: true,
										data: '<td id="ns1blankspaceActionsColumn2" class="ns1blankspaceColumn2" style="width:100px;"></td></tr>',
										"default": ''
									}) + '</table>');					
							
						$('#' + sXHTMLElementContainerID).html(aHTML.join(''));
						
						var aHTML = [];
						var h = -1;	
						
						aHTML.push('<table id="tablens1blankspaceActionsColumn2" class="ns1blankspaceColumn2">');
						
						aHTML.push('<tr><td class="ns1blankspaceAction">' +
										'<span id="ns1blankspaceActionsAdd">Add</span>' +
										'</td></tr>');
												
						aHTML.push('</table>');					
						
						$('#ns1blankspaceActionsColumn2').html(aHTML.join(''));
						
						$('#ns1blankspaceActionsAdd').button(
						{
							label: "Add"
						})
						.click(function()
						{
							ns1blankspace.actions.edit(oParam);
						});
					}
					
					if (iObjectContext != -1)
					{
						var oSearch = new AdvancedSearch();
						oSearch.method = 'ACTION_SEARCH';
						oSearch.addField('subject,duedate,actiontype,actiontypetext');

						if (iType) {oSearch.addFilter('actiontype', 'EQUAL_TO', iType)};

						if (iObject != undefined && iObject != '') {oSearch.addFilter('object', 'EQUAL_TO', iObject)};
						if (iObjectContext != undefined && iObjectContext != '') {oSearch.addFilter('objectcontext', 'EQUAL_TO', iObjectContext)};
						
						if (iContactBusiness) {oSearch.addFilter('contactbusiness', 'EQUAL_TO', iContactBusiness)};
						if (iContactPerson) {oSearch.addFilter('contactperson', 'EQUAL_TO', iContactPerson)};

						oSearch.sort('modifieddate', 'desc')

						oParam.xhtmlElementID = 'ns1blankspaceActionsColumn1';
						oSearch.getResults(function(data) {ns1blankspace.actions.process(oParam, data)});
					}
				},

	process: 	function (oParam, oResponse)
				{	
					var aHTML = [];
					var bShowDescription = false;
					var sXHTMLElementID = 'ns1blankspaceActionsColumn1';
					
					if (oParam != undefined)
					{
						if (oParam.xhtmlElementID != undefined ) {sXHTMLElementID = oParam.xhtmlElementID}
						if (oParam.showDescription != undefined ) {bShowDescription = oParam.showDescription}
					}	

					if (oResponse.data.rows.length === 0)
					{
						aHTML.push('<table class="ns1blankspace">' +
										'<tr><td class="ns1blankspaceNothing">No actions.</td>' +
										'</tr>');
						
						$('#' + sXHTMLElementID).html(aHTML.join(''));
						$('#' + sXHTMLElementID).show(ns1blankspace.option.showSpeed);
					}
					else
					{
						aHTML.push('<table id="ns1blankspaceActions" class="ns1blankspace">');
					
						aHTML.push('<tr class="ns1blankspaceCaption">');
						aHTML.push('<td class="ns1blankspaceHeaderCaption">Subject</td>');
						aHTML.push('<td class="ns1blankspaceHeaderCaption">Date</td>');
						aHTML.push('<td class="ns1blankspaceHeaderCaption">Type</td>');

						if (bShowDescription)
						{
							aHTML.push('<td class="ns1blankspaceHeaderCaption">Description</td>');
						}

						aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>');
						aHTML.push('</tr>');

						$.each(oResponse.data.rows, function()
						{	
							aHTML.push(ns1blankspace.actions.row(this, oParam));
						});
				    	
						aHTML.push('</table>');
						
						ns1blankspace.render.page.show(
						{
							xhtmlElementID: sXHTMLElementID,
							xhtmlContext: 'Action',
							xhtml: aHTML.join(''),
							showMore: (oResponse.morerows === 'true'),
							more: oResponse.moreid,
							rows: ns1blankspace.option.defaultRows,
							functionShowRow: ns1blankspace.actions.row,
							functionOnNewPage: ns1blankspace.actions.bind,
						}); 
					}
				},

	bind: 		function (oParam)
				{
					var sXHTMLContainerID = ns1blankspace.util.getParam(oParam, 'xhtmlContainerID', {"default": 'ns1blankspaceRenderPage_Action-0'}).value;

					$('#' + sXHTMLContainerID + ' .ns1blankspaceRowRemove').button(
					{
						text: false,
						icons:
						{
							primary: "ui-icon-close"
						}
					})
					.click(function()
					{
						ns1blankspace.remove(
						{
							xhtmlElementID: this.id,
							method: 'ACTION_MANAGE',
							parentLevel: 2,
							ifNoneMessage: 'No actions.'
						});
					})
					.css('width', '15px')
					.css('height', '17px');
					
					$('#' + sXHTMLContainerID + ' td.ns1blankspaceRowSelect').click(function()
					{
						ns1blankspace.action.init({id: (this.id).split('-')[1]})
					});
				},	

	row: 		function (oRow, oParam)
				{
					var bShowDescription = ns1blankspace.util.getParam(oParam, 'showDescription', {"default": false}).value;

					var aHTML = [];

					aHTML.push('<tr>');

					aHTML.push('<td id="ns1blankspaceAction_subject-' + oRow.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
									oRow.subject + '</td>');

					aHTML.push('<td id="ns1blankspaceAction_date-' + oRow.id + '" class="ns1blankspaceRow">' +
									oRow.duedate + '</td>');

					aHTML.push('<td id="ns1blankspaceAction_type-' + oRow.id + '" class="ns1blankspaceRow">' +
									oRow.actiontypetext + '</td>');
					
					if (bShowDescription)
					{
						aHTML.push('<td id="ns1blankspaceAction_description-' + oRow.id + '" class="ns1blankspaceRow">' +
										oRow.description + '</td>');
					}					
					
					aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">' + 			
									'<span id="ns1blankspaceAction_options_remove-' + oRow.id + '" class="ns1blankspaceRowRemove"></span>' +
									'</td>');

					aHTML.push('</tr>');

					return aHTML.join('');
				},

	edit:		function (oParam, oResponse)
				{
					var iActionID = -1;
					var dStartDate = new Date();
					var dEndDate = dStartDate;
					var sXHTMLElementID = 'ns1blankspaceActionsColumn1';
					var iOffsetHeight = 5;
					var iOffsetLeft = 0;
				
					if (oParam != undefined)
					{
						if (oParam.actionID != undefined) {iActionID = oParam.actionID};
						if (oParam.id != undefined) {iActionID = oParam.id};
						if (oParam.startDate != undefined) {dStartDate = oParam.startDate};
						if (oParam.endDate != undefined) {dEndDate = oParam.endDate};
						if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID};
						if (oParam.offsetHeight != undefined) {iOffsetHeight = oParam.offsetHeight};
						if (oParam.offsetLeft != undefined) {iOffsetLeft = oParam.offsetLeft};
					}	

					if (iActionID != -1 && oResponse === undefined)
					{
						var oSearch = new AdvancedSearch();
						oSearch.method = 'ACTION_SEARCH';
						oSearch.addField('subject,actiontype');
						oSearch.rf = 'json';
						oSearch.addFilter('id', 'EQUAL_TO', iActionID);	
						oSearch.getResults(function(data) {ns1blankspace.actions.edit(oParam, data)});
					}
					else
					{
						var aHTML = [];
					
						aHTML.push('<table class="ns1blankspaceMain">' +
										'<tr class="ns1blankspaceRow">' +
										'<td id="ns1blankspaceEditColumn1" class="ns1blankspaceColumn1Flexible"></td>' +
										'<td id="ns1blankspaceEditColumn2" class="ns1blankspaceColumn2" style="width:200px;"></td>' +
										'</tr>' +
										'</table>');
						
						$('#' + sXHTMLElementID).html(aHTML.join(''));

						var aHTML = [];

						aHTML.push('<table class="ns1blankspaceColumn2">');
						
						aHTML.push('<tr><td>' +
											'<span id="ns1blankspaceActionAddSave" class="ns1blankspaceAction">Save</span>' +
											'<td></tr>');
						

						aHTML.push('<tr><td>' +
											'<span id="ns1blankspaceActionAddCancel" class="ns1blankspaceAction">Cancel</span>' +
											'<td></tr>');

						aHTML.push('</table>');						

						$('#' + (sXHTMLElementID).replace('Column1', 'Column2')).html(aHTML.join(''));

						$('#ns1blankspaceActionAddCancel').button(
						{
							label: 'Cancel',
						})
						.click(function()
						{
							ns1blankspace.actions.show(oParam);
						})
						.css('width', '75px');

						$('#ns1blankspaceActionAddSave').button(
						{
							label: 'Save',
						})
						.click(function()
						{
							ns1blankspace.actions.save(oParam,
							{
								id: iActionID,
								subject: $('#ns1blankspaceActionAddSubject').val(),
								date: $('#ns1blankspaceActionAddDate').val(),
								description: $('#ns1blankspaceActionAddDescription').val(),
								priority: ($('#ns1blankspaceActionAddImportant').attr('checked') ? 3 : 2),
								type: $('input[name="radioActionType"]:checked').val(),
								status: $('input[name="radioActionStatus"]:checked').val()
							});
						})
						.css('width', '75px');
						
						var aHTML = [];

						aHTML.push('<table class="ns1blankspace">');

						aHTML.push('<tr><td class="ns1blankspaceCaption">Subject</td></tr>' + 
										'<tr><td><input id="ns1blankspaceActionAddSubject" class="ns1blankspaceText">' + 
										'</td></tr>');
						
						aHTML.push('<tr>' +
										'<td class="ns1blankspaceCaption">' +
										'Date' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceDate">' +
										'<input id="ns1blankspaceActionAddDate" class="ns1blankspaceDate">' +
										'</td></tr>');		

						aHTML.push('<tr><td class="ns1blankspaceCaption">Description</td></tr>' + 
										'<tr><td>' +
										'<textarea rows="5" cols="35" id="ns1blankspaceActionAddDescription" class="ns1blankspaceTextMulti" style="width:100%; height:100px;"></textarea>' +
										'</td></tr>');

						aHTML.push('</table>');
						
						$('#ns1blankspaceEditColumn1').html(aHTML.join(''));

						$('input.ns1blankspaceDate').datepicker({dateFormat: 'dd M yy'});

						$('#ns1blankspaceActionAddSubject').focus();

						var aHTML = [];

						aHTML.push('<table class="ns1blankspaceColumn2">');

						aHTML.push('<tr><td class="ns1blankspaceCheck">' +
											'<input type="checkbox" id="ns1blankspaceActionAddImportant"/>&nbsp;Important!<td></tr>');	
							
						aHTML.push('<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceCaption" style="padding-top: 10px;">' +
										'Type' +
										'</td></tr>' +
										'<tr class="ns1blankspaceRadio">' +
										'<td class="ns1blankspaceRadio">');
						
						$.each(ns1blankspace.data.actionTypes, function(k, v)
						{
							aHTML.push('<input type="radio" id="radioActionType' + v.id + '" name="radioActionType" value="' + v.id + '"/>' +
												v.title + '<br />');				
						});
						
						aHTML.push('</td></tr>');				

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Status' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioActionStatus2" name="radioActionStatus" value="2"/>Not Started' +
											'<br /><input type="radio" id="radioActionStatus4" name="radioActionStatus" value="4"/>In Progress' +
											'<br /><input type="radio" id="radioActionStatus1" name="radioActionStatus" value="1"/>Completed' +
										'</td></tr>');

						aHTML.push('</table>');
						
						$('#ns1blankspaceEditColumn2').html(aHTML.join(''));

						if (oResponse != undefined)
						{	
							if (oResponse.data.rows.length === 0)
							{	
								$('#ns1blankspaceActionAddSubject').val(oResponse.data.rows[0].subject);
								$('#ns1blankspaceActionAddDescription').val(oResponse.data.rows[0].description);
								$('[name="radioActionType"][value="' + oResponse.data.rows[0].actiontype + '"]').attr('checked', true);
								$('[name="radioActionStatus"][value="' + oResponse.data.rows[0].status + '"]').attr('checked', true);
							}	
						}
						else
						{
							$('#ns1blankspaceActionAddDate').val(Date.today().toString("d MMM yyyy"));
							$('[name="radioActionType"][value="' + ns1blankspace.data.actionTypes.fileNote.id + '"]').attr('checked', true);
							$('[name="radioActionStatus"][value="1"]').attr('checked', true);
						}	
					}
				},

	save: 		function (oParam, oData, oResponse)
				{
					if (oResponse === undefined)
					{
						var sData = '';
						var iType = ns1blankspace.data.actionTypes.fileNote;
						var iStatus = 1;
						var iHours;
						var dDate = Date.today().toString("dd-MMM-yyyy");
						var dEndDate;
						var iActionBy = ns1blankspace.user.id;
						var iObject = ns1blankspace.object;
						var iObjectContext = ns1blankspace.objectContext;
						var fPostSave = ns1blankspace.actions.show;
						
						if (oData != undefined)
						{
							if (oData.type != undefined) {iType = oData.type}
							if (oData.status != undefined) {iStatus = oData.status}
							if (oData.hours != undefined) {iHours = oData.hours}
							if (oData.date != undefined) {dDate = oData.date}
							if (oData.endDate != undefined) {dEndDate = oData.endDate}
							if (oData.actionBy != undefined) {iActionBy = oData.actionBy}
						
							sData += 'object=' + ns1blankspace.util.fs(iObject);
							sData += '&objectcontext=' + ns1blankspace.util.fs(iObjectContext);
							sData += '&subject=' + ns1blankspace.util.fs(oData.subject);
							sData += '&description=' + ns1blankspace.util.fs(oData.description);
							sData += '&priority=' + ns1blankspace.util.fs(oData.priority);
							sData += '&status=' + ns1blankspace.util.fs(iStatus);
							sData += '&actiontype=' + ns1blankspace.util.fs(iType);
							sData += '&date=' + ns1blankspace.util.fs(dDate);
							sData += '&actionby=' + ns1blankspace.util.fs(iActionBy);
							sData += '&contactbusiness=' + ns1blankspace.util.fs(oParam.contactBusiness);
							sData += '&contactperson=' + ns1blankspace.util.fs(oParam.contactPerson);
							
							if (iHours != undefined)
							{
								sData += '&totaltimehours=' + ns1blankspace.util.fs(iHours);
							}
							
							if (dEndDate != undefined)
							{
								sData += '&enddate=' + ns1blankspace.util.fs(dEndDate);
							}
							
							sData += (oData.otherData === undefined ? '' : oData.otherData)
								  
							$.ajax(
							{
								type: 'POST',
								url: ns1blankspace.util.endpointURI('ACTION_MANAGE'),
								data: sData,
								dataType: 'json',
								success: function(data) {ns1blankspace.actions.show(oParam, oData, data);}
							});
						}
						else
						{
							
						}
					}
					else	
					{
						if (oResponse.status === 'OK')
						{
							ns1blankspace.status.message('Action saved');
							fPostSave(oParam);
						}
						else
						{
							ns1blankspace.status.error(oResponse.error.errornotes);
						}
					}
				}				
}