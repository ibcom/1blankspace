/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 */

ns1blankspace.xhtml.loading = '<img class="ns1blankspaceLoading" id="ns1blankspaceLoading" src="/site/388/1blankspace.loading.round.20.gif">';
ns1blankspace.xhtml.loadingSmall = '<img class="ns1blankspaceLoadingSmall" id="ns1blankspaceLoadingSmall" src="/site/388/1blankspace.loading.round.10.gif">';
ns1blankspace.xhtml.editorCSS = '';

ns1blankspace.option = $.extend(true, ns1blankspace.option, 
{
	defaultRows: 20,
	defaultView: '<span style="font-weight:600;">Select...</span> <span class="caret"></span>',
	defaultSetupView: "Website",
	returnToLast: true,
	restLevel: 0,
	autoSetupSwitch: true,
	passwordhash: true,
	classicURI: '/index.asp?Site=475&p=asms%2Fmystartpage.asp',
	loadControl: false,
	httpsOnly: true,
	viewShowSearch: true,
	passwordExpiry: {site: 1533, days: 36500},
	showBrowsing: false,
	messagingEmailShowCount: false,
	messagingCheckForNew: 60000,
	helpURI: 'http://community.mydigitalstructure.com',
	taxVATCaption: 'GST',
	taxPayrollCaption: 'Employee',
	taxBusinessCaption: 'Business',
	currencySymbol: '$',
	taxOffice: 'ATO',
	bulkInvoicing: true,
	postInit: undefined,
	initialiseSpaceTemplate: '/site/312/1blankspace.setup.space-2.0.1.json',
	searchWatermark: 'search',
	showLogonOptions: false,
	showLogonOptionsOnHover: false,
	showFavourites: false,
	showLogoff: false,
	quickInvoice: false,
	spaceTextMaximumLength: 200,
	expenseShowImages: false,
	paymentShowImages: true,
	canCreateSpaces: true,
	logonSuffix: undefined,
	passwordSuffix: undefined,
	financialShowProjects: true,
	pdfStyles: '<link rel=stylesheet href="/jscripts/1blankspace-2.0.2.css">',
	_messagingCheckURL: 'https://api.mydigitalstructure.com',
	financialOverride: true,
	showProductCodes: true,
	defaultDatePickerOptions:
	{
		changeMonth: true,
		changeYear: true
	},
	attachmentsAsURLs: true,
	employeeInsuranceURL: 
	{
		australia: 'https://www.safeworkaustralia.gov.au/workers-compensation/comparing-australias-workers-compensation-schemes'
	},
	logonTOTP: 
	{
		enabled: true,
		name: 'Google Authenticator'
	},
	logonAccessToken: true,
	userRelationshipManagerBasedAccess: true,
	siteName: '1blankspace (lab)',
	messagingCreateContacts: true,
	bootstrap: true,
	rowButtonHeight: '20px',
	rowButtonWidth: '15px',
	showActionText: false
});

ns1blankspace.option.yodlee =
{
	user: 37059,
	proxyURL: 'https://yodlee.lab.ibcom.biz'
}

ns1blankspace.option.stripe =
{
	url: 'https://docs.mydigitalstructure.com/paynow',
	text: 'Pay now using a card'
}

ns1blankspace.option.showFavourites = false;

ns1blankspace.option.dateFormats = ['DD MMM YYYY', 'D MMM YYYY', 'D/MM/YYYY', 'DD/MM/YYYY', 'DD MMM YYYY HH:mm:ss'];

ns1blankspace.formFactor.size.value = ns1blankspace.formFactor.size.options.medium;

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

if (ns1blankspace.financial === undefined) {ns1blankspace.financial = {}}
if (ns1blankspace.control === undefined) {ns1blankspace.control = {}}

ns1blankspace.financial.summaryUseTemplate = false; 

ns1blankspace.xhtml.templates = {source: {}, document: {}, all: {}};

ns1blankspace.xhtml.templates.source =
{
	invoice: '/jscripts/1blankspace.setup.financial.invoice-1.0.0.html',
	statement: '/jscripts/1blankspace.setup.financial.statement-1.0.0.html',
	payroll: '/jscripts/1blankspace.setup.financial.payroll-1.0.1.html',
	payslip: '/jscripts/1blankspace.setup.financial.payslip-1.0.0.html',
	invoiceschedule: '/jscripts/1blankspace.setup.financial.invoiceschedule-1.0.0.html',
	payment: '/jscripts/1blankspace.setup.financial.payment-1.0.0.html',
	action: '/jscripts/1blankspace.setup.action-1.0.0.html',
	receipt: '/site/312/1blankspace.setup.financial.receipt-1.0.0.html'
}	

ns1blankspace.xhtml.logonNotes = undefined;
ns1blankspace.xhtml.logonContainer =
{
	"background": 'url(/site/388/1blankspace.cover-1.0.4.jpg)',
	"background-size": 'cover'
}

ns1blankspace.xhtml.header =
	'<nav class="navbar navbar-default navbar-fixed-top">' +
  		'<div class="container-fluid">' +
  			'<div>' +
	  			'<div class="navbar-header">' +
	      			'<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#ns1blankspace-navbar-collapse-1" aria-expanded="false">' +
				        	'<span class="sr-only">Toggle navigation</span>' +
				        	'<span class="icon-bar"></span>' +
				       	'<span class="icon-bar"></span>' +
				        	'<span class="icon-bar"></span>' +
			      	'</button>' +
			      	'<a class="navbar-brand" style="padding-top: 10px;" href="/"><img id="ns1blankspaceNavigationLogo" style="height:40px;" src="/site/312/1blankspace.aoe.miy-2.0.3.png"></a>' +
			    '</div>' +

			    '<div class="collapse navbar-collapse" id="ns1blankspace-navbar-collapse-1">' +
				    '<ul class="nav navbar-nav pull-right">' +
				        '<li>' +
				        	'<div class="text-right" id="ns1blankspaceSpaceText"></div>' +
				        	'<div id="ns1blankspaceLogonName"></div>' +
				       	'</li>' +
				    '</ul>' +
				'</div>' +
			'</div>' +
			'<div id="ns1blankspaceViewControl">' +

			'</div>' +
  		'</div>' +
	'</nav>';


ns1blankspace.setupShow = true;

ns1blankspace.xhtml.viewContainer =
	'<ul class="nav navbar-nav">' +
		'<li class="hidden-xs hidden-sm">' +
		 	'<div class="btn-group">' +
 				'<button type="button" id="ns1blankspaceViewControlHome" class="btn btn-default glyphicon glyphicon-home"></button>' +
  				'<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" id="ns1blankspaceHomeOptions" aria-haspopup="true" aria-expanded="false">' +
    				'<span class="caret"></span>' +
    				'<span class="sr-only">Toggle Dropdown</span>' +
				'</button>' +
				'<ul class="dropdown-menu">' +
				   '<li><a href="#" id="ns1blankspaceHomeOptionsCalendar">Calendar</a></li>' +
				   '<li >' +
				   	'<a id="ns1blankspaceHomeOptionsNewWindow" href="#" target="_blank">Open in a new window</a>' +
				   '</li>' +
				   '<li><a href="#" id="ns1blankspaceHomeOptionsConnections">' +
				   	'<div>Connections</div><div class="ns1blankspaceSubNote">Other webapps, websites..</div></a>' +
				   '</li>' +
				   '<li><a href="#" id="ns1blankspaceHomeOptionsSearch">' +
				   	'<div>Search & reporting</div><div class="ns1blankspaceSubNote">Export, update, email & SMS..</div></a>' +
				   '</li>' +
				    
				 '</ul>' +
			'</div>' +
		'</li>' +
		'<li style="margin-left:6px;" class="hidden-xs hidden-sm">' +
		 	'<div class="btn-group">' +
 				'<button type="button" class="btn btn-default glyphicon glyphicon-chevron-left" id="ns1blankspaceViewControlBack"></button>' +
 				'<button type="button" class="btn btn-default glyphicon glyphicon-chevron-up" id="ns1blankspaceViewControlRefresh"></button>' +
 				'<button type="button" class="btn btn-default glyphicon glyphicon-chevron-right" id="ns1blankspaceViewControlForward"></button>' +
			'</div>' +
		'</li>' +
		'<li style="margin-left:6px;" class="">' +
		 	'<div id="ns1blankspaceViewControlViewContainer">' +
				'<span id="ns1blankspaceViewControlView"></span>' +
			'</div>' +
		 '</li>' +
		 '<li style="margin-left:6px;" class="hidden-xs">' +
		 	'<div>' +
				'<input id="ns1blankspaceViewControlSearch" class="form-control' +
				(ns1blankspace.option.searchWatermark!=undefined?' ns1blankspaceWatermark" value="' + ns1blankspace.option.searchWatermark + '"':'"') +
				'>' +
			'</div>' +
		 '</li>' +
		 '<li style="margin-left:6px;" class="hidden-xs">' +
		 	'<button type="button" class="btn btn-default" id="ns1blankspaceViewControlNew">New</button>' +
		 '</li>' +
		 '<li style="margin-left:6px;" class="hidden-xs">' +
		 	'<div class="btn-group">' +
 				'<button type="button" class="btn btn-default" id="ns1blankspaceViewControlAction">Save</button>' +
 				'<button type="button" class="btn btn-default dropdown-toggle" id="ns1blankspaceViewControlActionOptions" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
    				'<span class="caret"></span>' +
    				'<span class="sr-only">Toggle Dropdown</span>' +
				'</button>' +
			'</div>' +
		'</li>' +
		'<li style="margin-left:6px;" class="hidden-xs hidden-sm">' +
		 	'<div id="ns1blankspaceViewControlActionStatus"></div>' +
		'</li>' +
		'</ul>' +
		'<ul class="nav navbar-nav pull-right hidden-xs">' +
		(ns1blankspace.setupShow?'<li style="margin-left:4px;">' +
									'<button type="button" class="btn btn-default glyphicon glyphicon-cog" id="ns1blankspaceViewControlSetup"></button>' +
									'</li>':'') +
		'<li style="margin-left:4px;">' +
			'<button type="button" class="btn btn-default glyphicon glyphicon-question-sign" id="ns1blankspaceViewControlHelp"></button>' +
		'</li>' +
	'</ul>';

	
ns1blankspace.scripts =
[
	{
		nameSpace: '1blankspace.advancedsearch',
		source: '/site/312/1blankspace.advancedsearch-2.0.6.js'
	},
	{
		nameSpace: '1blankspace.home',
		source: '/site/388/1blankspace.home-2.0.6.js'
	},
	{
		nameSpace: '1blankspace.format',
		source: '/site/388/1blankspace.format-2.2.1.js'
	},
	{
		nameSpace: '1blankspace.contactPerson',
		source: '/site/388/1blankspace.contactperson-2.0.8.js'
	},
	{
		nameSpace: '1blankspace.contactBusiness',
		source: '/site/388/1blankspace.contactbusiness-2.1.0.js'
	},
	{
		nameSpace: '1blankspace.opportunity',
		source: '/site/388/1blankspace.opportunity-2.0.1.js'
	},
	{
		nameSpace: '1blankspace.action',
		source: '/site/388/1blankspace.action-2.1.1.js'
	},
	{
		nameSpace: '1blankspace.messaging.conversation',
		source: '/site/388/1blankspace.messaging.conversation-2.1.2.js'
	},
	{
		nameSpace: '1blankspace.messaging.imap',
		source: '/site/388/1blankspace.messaging.imap-2.2.8.js'
	},
	{
		nameSpace: '1blankspace.document',
		source: '/site/388/1blankspace.document-2.0.2.js'
	},
	{
		nameSpace: '1blankspace.news',
		source: '/site/388/1blankspace.news-2.0.4.js'
	},
	{
		nameSpace: '1blankspace.event',
		source: '/jscripts/1blankspace.event-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.project',
		source: '/site/388/1blankspace.project-2.0.2.js'
	},
	{
		nameSpace: '1blankspace.projectTask',
		source: '/jscripts/1blankspace.project.task-2.0.1.js'
	},
	{
		nameSpace: '1blankspace.product',
		source: '/site/388/1blankspace.product-2.0.4.js'
	},
	{
		nameSpace: '1blankspace.order',
		source: '/site/312/1blankspace.order-2.0.2.js'
	},
	{
		nameSpace: '1blankspace.financial',
		source: '/site/388/1blankspace.financial-2.3.8.js'
	},
	{
		nameSpace: '1blankspace.financial.bankAccount',
		source: '/site/388/1blankspace.financial.bankaccount-2.4.5.js'
	},
	{
		nameSpace: '1blankspace.financial.invoice',
		source: '/site/388/1blankspace.financial.invoice-2.2.0.js'
	},
	{
		nameSpace: '1blankspace.financial.expense',
		source: '/site/388/1blankspace.financial.expense-2.1.6.js'
	},
	{
		nameSpace: '1blankspace.financial.receipt',
		source: '/site/388/1blankspace.financial.receipt-2.1.3.js'
	},
	{
		nameSpace: '1blankspace.financial.payment',
		source: '/site/388/1blankspace.financial.payment-2.1.5.js'
	},
	{
		nameSpace: '1blankspace.financial.credit',
		source: '/site/388/1blankspace.financial.credit-2.0.7.js'
	},
	{
		nameSpace: '1blankspace.financial.journal',
		source: '/site/388/1blankspace.financial.journal-2.0.7.js'
	},
	{
		nameSpace: '1blankspace.financial.tax',
		source: '/site/388/1blankspace.financial.tax-2.0.6.js'
	},
	{
		nameSpace: '1blankspace.financial.payroll',
		source: '/site/388/1blankspace.financial.payroll-2.4.9.js'
	},
	{
		nameSpace: '1blankspace.financial.budget',
		source: '/site/388/1blankspace.financial.budget-2.0.4.js'
	},
	{
		nameSpace: '1blankspace.financial.compliance',
		source: '/site/388/1blankspace.financial.compliance-2.0.7.js'
	},
	{
		nameSpace: '1blankspace.report',
		source: '/site/388/1blankspace.report-2.4.2.js'
	},
	{
		nameSpace: '1blankspace.setup',
		source: '/site/388/1blankspace.setup-2.0.2.js'
	},
	{
		nameSpace: '1blankspace.setup.automation',
		source: '/site/312/1blankspace.setup.automation-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.setup.financial',
		source: '/site/388/1blankspace.setup.financial-2.2.1.js'
	},
	{
		nameSpace: '1blankspace.setup.action',
		source: '/site/312/1blankspace.setup.action-2.0.2.js'
	},
	{
		nameSpace: '1blankspace.setup.messaging',
		source: '/site/388/1blankspace.setup.messaging-2.1.2.js'
	},
	{
		nameSpace: '1blankspace.setup.networkGroup',
		source: '/site/388/1blankspace.setup.networkgroup-2.0.2.js'
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
		source: '/site/312/1blankspace.setup.space-2.0.9.js'
	},
	{
		nameSpace: '1blankspace.setup.structure',
		source: '/site/388/1blankspace.setup.structure-2.0.4.js'
	},
	{
		nameSpace: '1blankspace.setup.user',
		source: '/site/388/1blankspace.setup.user-2.1.3.js'
	},
	{
		nameSpace: '1blankspace.setup.userRole',
		source: '/site/312/1blankspace.setup.userRole-2.0.4.js'
	},
	{
		nameSpace: '1blankspace.setup.website',
		source: '/site/388/1blankspace.setup.website-2.1.8.js'
	},
	{
		nameSpace: '1blankspace.setup.websiteForm',
		source: '/jscripts/1blankspace.setup.website.form-2.0.1.js'
	},
	{
		nameSpace: '1blankspace.structure',
		source: '/jscripts/1blankspace.structure-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.structureData',
		source: '/site/312/1blankspace.structuredata-2.0.1.js'
	},
	{
		nameSpace: '1blankspace.supportIssue',
		source: '/site/388/1blankspace.supportissue-2.1.0.js'
	},
	{
		nameSpace: '1blankspace.setup.file',
		source: '/site/388/1blankspace.setup.file-2.1.0.js'
	},
	{
		nameSpace: '1blankspace.developer.space',
		source: '/jscripts/1blankspace.developer.space-2.0.1.js'
	},
	{
		nameSpace: '1blankspace.util.local',
		source: '/jscripts/1blankspace.util.local-2.0.3.js'
	},
	{
		nameSpace: '1blankspace.util.protect',
		source: '/jscripts/1blankspace.util.protect-2.0.1.js'
	},
	{
		nameSpace: '1blankspace.connect',
		source: '/site/388/1blankspace.connect-2.0.4.js'
	},
	{
		nameSpace: '1blankspace.util.whenDone',
		source: '/jscripts/1blankspace.util.whendone-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.util.pdf',
		source: '/jscripts/1blankspace.util.pdf-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.visualise',
		source: '/jscripts/1blankspace.visualise-2.0.9.js'
	},
	{
		nameSpace: '1blankspace.util.object',
		source: '/jscripts/1blankspace.util.object-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.util.financial',
		source: '/jscripts/1blankspace.util.financial-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.admin.space',
		source: '/site/312/1blankspace.admin.space-2.0.6.js'
	},
	{
		nameSpace: '1blankspace.admin.monitoring',
		source: '/site/312/1blankspace.admin.monitoring-2.0.3.js'
	},
	{
		nameSpace: '1blankspace.developer.membership',
		source: '/jscripts/1blankspace.developer.membership-2.0.1.js'
	},
	{
		nameSpace: '1blankspace.util.timezone',
		source: '/jscripts/1blankspace.util.timezone-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.util.convert',
		source: '/jscripts/1blankspace.util.convert-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.util.convert',
		source: '/jscripts/1blankspace.util.saml-2.0.2.js'
	},
	{
		nameSpace: '1blankspace.contactsearch',
		source: '/jscripts/1blankspace.contactsearch-2.2.1.js'
	},
	{
		nameSpace: '1blankspace.util.financial.bankaccount',
		source: '/jscripts/1blankspace.util.financial.bankaccount-2.0.3.js'
	},
	{
		nameSpace: '1blankspace.util.messaging',
		source: '/jscripts/1blankspace.util.messaging-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.util.financial.collect',
		source: '/jscripts/1blankspace.util.financial.collect-1.0.0.js'
	},
	{
		nameSpace: '1blankspace.util.messaging',
		source: '/jscripts/1blankspace.util.attachment-2.0.2.js'
	},
	{
		nameSpace: '1blankspace.util.contacts',
		source: '/site/312/1blankspace.util.contact-2.0.1.js'
	}
]

ns1blankspace.themes = 
[
	{
		title: 				'Standard',
		cssURI: 			'', 
		xhtmlHeaderLogo: 	'<img style="height:46px;" src="/site/312/1blankspace.aoe.miy-2.0.3.png">',
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

ns1blankspace.views = 
[
	{
		title: "Contact Search",
		namespace: "contactsearch",
		endpoint: "CONTACT_BUSINESS",
		object: 12,
		show: false,
		group: 1,
		type: 1
	},
	{
		title: "People",
		namespace: "contactPerson",
		endpoint: "CONTACT_PERSON",
		object: 32,
		keyObjectProperties: 'firstname,surname',
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
		object: 12,
		keyObjectProperties: 'tradename',
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
		object: 35,
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
		type: 1,
		search:
		{
			filters:
			[
				{
					caption: "Subject",
					name: "subject",
					type: 'Text',
					comparison: 'TEXT_IS_LIKE',
					fixed: false
				},
				{
					caption: 'Message<br /><span style="font-size:0.75em;">(only opened emails or where the email is set up to import <i>Everything</i> will be searched)</span>',
					name: "message",
					type: 'Text',
					comparison: 'TEXT_IS_LIKE',
					fixed: false
				},
				{
					caption: "On or after this date",
					name: "date",
					type: 'Date',
					comparison: 'GREATER_THAN_OR_EQUAL_TO',
					fixed: false
				},
				{
					caption: "From Email",
					name: "from",
					type: 'Text',
					comparison: 'TEXT_IS_LIKE',
					fixed: false
				},
				{
					caption: "From Name",
					name: "fromname",
					type: 'Text',
					comparison: 'TEXT_IS_LIKE',
					fixed: false
				}
			],
			advanced: false	
		}
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
		object: 1,
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
		object: 17,
		keyObjectProperties: 'actionreference',
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
		object: 19,
		show: true,
		group: 3,
		type: 1
	},
	{
		title: "Events",
		namespace: "event",
		endpoint: "EVENT",
		object: 39,
		show: false,
		group: 3,
		type: 1
	},
	{
		title: "Products",
		namespace: "product",
		endpoint: "PRODUCT",
		object: 16,
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
		object: 43,
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
		object: 5,
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
		object: 2,
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
		object: 6,
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
		object: 3,
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
		group: 6,
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
		title: "Budget",
		parentNamespace: "financial",
		namespace: "budget",
		endpoint: "FINANCIAL_BUDGET",
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
		title: 'Actions',
		parentNamespace: "setup",
		namespace: "action",
		endpoint: "SETUP", 
		show: true,
		group: 9,
		type: 2,
		subNote: 'Types & Templates'
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
		title: 'Project Types',
		namespace: 'setup',
		namesuffix: 'projectType',
		endpoint: "SETUP", 
		show: true,
		group: 9,
		type: 2,
		param: {viewName: 'Project Types', method: 'SETUP_PROJECT_TYPE'}														
	},
	{
		title: 'Project Task Types',
		namespace: 'setup',
		namesuffix: 'projectTaskType',
		endpoint: "SETUP", 
		show: true,
		group: 9,
		type: 2,
		param: {viewName: 'Project Task Types', method: 'SETUP_PROJECT_TASK_TYPE'}														
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
		endpoint: "SETUP_IMPORT", 
		show: true,
		group: 10,
		type: 2
	},
	{
		title: "Other&nbsp;Spaces",
		parentNamespace: "admin",
		namespace: "space",
		endpoint: "SETUP_SPACE", 
		show: true,
		group: 10,
		type: 2
	},
	{
		title: "Structures",
		parentNamespace: "setup",
		namespace: "structure",
		endpoint: "SETUP_STRUCTURE", 
		show: true,
		group: 10,
		type: 2
	},
	{
		title: "Support&nbsp;Issues",
		namespace: "supportIssue",
		endpoint: "SUPPORT_ISSUE", 
		show: true,
		group: 10,
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
			$(ns1blankspace.views).each(function(i, k)
			{
				if (k.visits==undefined) {k.visits=0}
			});

			var oData =
			{
				advanced: 10,
				attribute: 10,
				custom: 'Y',
				type: 1
			}
		
			$.ajax(
			{
				type: 'POST',
				url: '/rpc/core/?method=CORE_PROFILE_SEARCH',
				data: oData,
				dataType: 'json',
				success: function (oResponse)
				{
					ns1blankspace.control.favourites.data.views = [];

					if (oResponse.data != '')
					{	
						$.each(JSON.parse(oResponse.data), function (fv, favouriteView)
						{
							var oView = $.grep(ns1blankspace.views, function (view) {return view.title==favouriteView.title})[0];

							if (oView != undefined)
							{
								oView.visits = favouriteView.visits;
								ns1blankspace.control.favourites.data.views.push(oView)
							}
						})
					}	

					$.extend(true, oParam, {step: 6});
					ns1blankspace.control.init(oParam)
				}

			});
		}	

		else if (iStep == 6)
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

	setView:	
	{
		"default": function ()
		{
			ns1blankspace.home.show();
		},

		setup: function ()
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

	views:		
	{					
		show: function ()
		{
			if (ns1blankspace.xhtml.viewControl == undefined)
			{
				var aHTML = [];

				aHTML.push('<table class="ns1blankspaceViewControlContainer" style="border-collapse: separate;">');
				aHTML.push('<tr class="ns1blankspaceViewControl">');

				var oGroups = $.grep(ns1blankspace.viewGroups, function (a) {return a.type == 1;});
				oGroups = $.grep(oGroups, function (a) {return a.role == undefined || ns1blankspace.util.hasRole({title: a.role})});

				$.each(oGroups, function(i, v)
				{
					var oViewGroup = $.grep(ns1blankspace.views, function (a) {return a.group == v.id && a.show == true && a.type == 1;});

					if (oViewGroup.length > 0)
					{
						oViewGroup.sort(ns1blankspace.util.sortBy('order'))

						aHTML.push('<td class="ns1blankspaceViewControlColumn" ' + (oViewGroup.style!=undefined?'style="' + oViewGroup.style + '"':'') + '>');

						aHTML.push('<table class="ns1blankspaceViewControlColumn">');

						aHTML.push('<tr><td><div id="ns1blankspaceView' + (v.imageName || v.name) + '" class="ns1blankspaceViewImage"></div>' +
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

				aHTML.push('</tr>');

				if (ns1blankspace.option.viewShowSearch)
				{	
					aHTML.push('<tr class="ns1blankspaceViewControl">');

					aHTML.push('<td class="ns1blankspaceViewControlx" colspan=' + ns1blankspace.viewGroups.length + ' style="text-align:left; color: #999999; font-size:0.825em; padding-top:6px;">' +
								'<div class="ns1blankspaceSub"><i>Explore...</i></div>' +
								'<div class="ns1blankspaceViewControl" style="cursor:pointer;"><span id="ns1blankspaceViewControl_report" class="ns1blankspaceViewControl">' +
								' Customised reporting with exporting, updating, emailing & SMS sending</span></div>' +
								'</td>');

					//	'<div class="ns1blankspaceViewControl" style="cursor:pointer;"><span id="ns1blankspaceViewControl_contactsearch" class="ns1blankspaceViewControl">' +
					//			' Search Contacts</span></div>' +

					aHTML.push('</tr>');
				}	

				aHTML.push('</table>');
				
				ns1blankspace.xhtml.viewControl = aHTML.join('');
			}

			var iTopOffset = (ns1blankspace.option.bootstrap?10:5);

			ns1blankspace.container.show(
			{
				xhtmlElementID: 'ns1blankspaceViewControlViewContainer',
				xhtml: ns1blankspace.xhtml.viewControl,
				topOffset: iTopOffset
			});	

			ns1blankspace.control.views.bind();	
		},

		bind: function ()
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
					$(ns1blankspace.xhtml.container).attr('data-initiator', '');

					var oParam = {};
					var sTitle = $(this).attr('data-title')
					var oViewport = $.grep(ns1blankspace.views, function (a) {return a.title == sTitle;})[0];
					oViewport.visits += 1;

					ns1blankspace.control.favourites.visit({view: oViewport});
					
					if (oViewport.param)
					{
						oParam = oViewport.param;
					}

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
	},
					
	setup:		
	{
		views: 		
		{
			show:		function ()
			{
				var aHTML = [];

				aHTML.push('<table class="ns1blankspaceViewControlContainer" style="border-collapse:separate;">');
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
				
				var iTopOffset = (ns1blankspace.option.bootstrap?10:5);

				ns1blankspace.container.show(
				{
					xhtmlElementID: 'ns1blankspaceViewControlViewContainer',
					xhtml: aHTML.join(''),
					topOffset: iTopOffset
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

	favourites: 	
	{
		data: 		
		{
			titles: [],
			views: []
		},

		visit: 		function (oParam)
		{
			var oView = ns1blankspace.util.getParam(oParam, 'view').value;
			
			$('#ns1blankspaceViewControlFavourites').button({disabled: false});

			var oFavourites = $.map(ns1blankspace.views, function(x) {return x;});;
			oFavourites = $.grep(oFavourites, function (favourite) {return favourite.visits!=0});
			ns1blankspace.control.favourites.data.views = [];

			oFavourites.sort(ns1blankspace.util.sortByNumber('visits', 'desc'));

			$.each(oFavourites, function (f, favourite)
			{
				if (f <= 5) {ns1blankspace.control.favourites.data.views.push(favourite)}
			});

			ns1blankspace.control.favourites.data.views.reverse();

			var oData =
			{
				advanced: 10,
				attribute: 10,
				custom: 'Y',
				type: 1,
				value: JSON.stringify($.map(ns1blankspace.control.favourites.data.views, function (view) {return {title: view.title, visits: view.visits}}))
			}
		
			$.ajax(
			{
				type: 'POST',
				url: '/ondemand/core/?method=CORE_PROFILE_MANAGE',
				data: oData,
				dataType: 'json'
			});
		},			

		show: function (oParam)
		{
			var oFavourites = ns1blankspace.control.favourites.data.views;
			
			if (oFavourites.length == 0)
			{
				ns1blankspace.status.error('No favourites');
			}
			else
			{
				$vq.clear({queue: 'view-favourites'});

				$vq.add('<table class="ns1blankspaceViewControlContainer">',
							{queue: 'view-favourites'})

				$vq.add('<tr class="ns1blankspaceViewControl">' +
							'<td class="ns1blankspaceViewControlColumn">' +
							'<table class="ns1blankspaceViewControlColumn">',
							{queue: 'view-favourites'})
				

				//oFavourites.sort(ns1blankspace.util.sortBy('title', 'asc'));

				$.each(oFavourites, function (f, favourite)
				{
					if (f <= 5)
					{	
						$vq.add('<tr class="ns1blankspaceViewControl">' +
									'<td class="ns1blankspaceViewControl">' +
									'<span id="ns1blankspaceViewControl_' + (favourite.parentNamespace!==undefined?favourite.parentNamespace + '_':'') + favourite.namespace +
										(favourite.namesuffix!==undefined?'_' + favourite.namesuffix:'') + 
									'" class="ns1blankspaceViewControl">' + favourite.title + '</span>',
									{queue: 'view-favourites'});

						if (favourite.subNote !== undefined)
						{	
							$vq.add('<br /><div class="ns1blankspaceSubNote" style="margin-top:2px;">' + 
									 	favourite.subNote + '</div>',
										{queue: 'view-favourites'});
						}	

						$vq.add('</td></tr>', {queue: 'view-favourites'});
					}	
				});

				$vq.add('</table></td></tr></table>', {queue: 'view-favourites'});
			}	
		
			ns1blankspace.container.show(
			{
				xhtmlElementID: 'ns1blankspaceViewControlFavourites',
				leftOffset: 0,
				topOffset: 9,
				xhtml: $vq.get({queue: 'view-favourites'})
			});	

			ns1blankspace.control.views.bind();
		}		
	},				

	user:			
	{
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

				if (ns1blankspace.option.bootstrap)
				{
					$(ns1blankspace.xhtml.container).offset({ top: $(oElement).offset().top + $(oElement).height() - 10, left: $(oElement).offset().left + 20});
				}
				else
				{
					$(ns1blankspace.xhtml.container).offset({ top: $(oElement).offset().top + $(oElement).height() - 3, left: $(oElement).offset().left + 220});
				}
					
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
					aHTML.push('<tr><td>' +	oResponse.access_token + '<br /><br /></td></tr>');
					
					aHTML.push('<tr><td><span id="ns1blankspaceControlUserCreateSecureKeyDisable">Disable Token</span></td></tr>');								
					aHTML.push('<tr><td><br />If you generate a new token, the current token will no longer work.<br /><br /></td></tr>');
				}
				
				aHTML.push('<tr><td><span id="ns1blankspaceControlUserCreateSecureKeyNew">New Token</span></td></tr>');
				
				if (oResponse.access_token != undefined)
				{
					aHTML.push('<tr><td><br /><b>Example link for future diary events in iCal format:</b>');

					aHTML.push('<tr><td>' + window.location.protocol + '//' + window.location.host + '/rpc/action/' +
										'<br />?method=ACTION_ICAL_SEARCH' +
										'<br />&access_token=' + oResponse.access_token + '<br /><br /></td></tr>');			
				}

				aHTML.push('<tr><td><b>Security Note</b></td></tr>');
				aHTML.push('<tr><td>Given that this token gives privileged access (outside of the multi-token authorisation process),' +
								' make sure you protect this token and be wary of using it in the URL query string,' +
								' as data in the query string is not encrypted during transmission (even if using SSL).' + 
								' It is recommended that the user associated with this token has limited access to methods.</td></tr>');

				aHTML.push('<tr><td><a href="http://mydigitalstructure.com/gettingstarted_authentication" target="_blank">More on authentication...</a></td></tr>');

				
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
							data: 'remove=1',
							dataType: 'json',
							async: false,
							success: function(data) {ns1blankspace.control.user.key({setPosition: false})}
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
							data: '',
							dataType: 'json',
							async: false,
							success: function(data) {ns1blankspace.control.user.key({setPosition: false})}
						})
					}		
				})
				.css('width', '150px');
			}		
		},
	
		device:
		{
			trust: function (oParam, oResponse)
			{
				var sAccessToken = ns1blankspace.util.getParam(oParam, 'accessToken').value;

				if (sAccessToken != undefined)
				{
					ns1blankspace.util.local.cache.save(
					{
						key: '_at',
						persist: true,
						data: sAccessToken
					})
				}
			},

			logon: function ()
			{
				var sAccessToken = ns1blankspace.util.local.cache.save(
				{
					key: '_at',
					persist: true
				})

				$.ajax({url: '/rpc/core/?method=CORE_SID_SEARCH', data: {access_token: sAccessToken}, type: 'POST'})
			}
		}
	},

	spaces:			
	{					
		show: function (oElement, oResponse)
		{
			var aHTML = [];

			if (oResponse == undefined)	
			{
				if ($(ns1blankspace.xhtml.container).attr('data-initiator') == oElement.id)
				{
					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
					$(ns1blankspace.xhtml.container).attr('data-initiator', '');
				}
				else
				{	
					$(ns1blankspace.xhtml.container).attr('data-initiator', oElement.id);
					$(ns1blankspace.xhtml.container).html('<table style="width: 250px;" class="ns1blankspaceViewControlContainer"><tr><td>' + ns1blankspace.xhtml.loadingSmall + '</tr><td></table>');
					$(ns1blankspace.xhtml.container).show(ns1blankspace.option.showSpeedOptions);

					if (ns1blankspace.option.bootstrap)
					{
						$(ns1blankspace.xhtml.container).offset({ top: $(oElement).offset().top + $(oElement).height() + 1, left: $(oElement).offset().left - 50});
					}
					else
					{
						$(ns1blankspace.xhtml.container).offset({ top: $(oElement).offset().top + $(oElement).height() - 5, left: $(oElement).offset().left + 150});
					}

					if (ns1blankspace.space == ns1blankspace.user.space)
					{	
						var oSearch = new AdvancedSearch();
						oSearch.method = 'CORE_SPACE_SEARCH';
						oSearch.addField('space,spacetext,unrestrictedaccess,guid');
						//oSearch.addFilter('guid', 'IS_NOT_NULL')
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
							ns1blankspace.container.hide({force: true});

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
										ns1blankspace.spaceContactBusiness = ns1blankspace.user.contactBusiness;
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
					aHTML.push('<tr><td class="ns1blankspaceSubNote" style="padding-left:5px;padding-right:10px;">Search for a space to switch to</td></tr>' +
						'<tr><td class="ns1blankspaceNothing" style="padding-left:5px;padding-right:10px;">' +
						'<input id="ns1blankspaceControlSpaceSearch" class="ns1blankspaceMainText" style="font-size:1.1em; width:100%;"></td></tr>');

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
					ns1blankspace.container.hide({force: true});

					var aID = (event.target.id).split('-')
					$.ajax(
					{
						type: 'POST',
						url: ns1blankspace.util.endpointURI('CORE_SPACE_MANAGE'),
						data: 'switch=1&id=' + aID[1],
						dataType: 'json',
						success: function(oResponse)
						{
							if (oResponse.status == 'OK')
							{	
								ns1blankspace.space = oResponse.TargetSpace;
								ns1blankspace.spaceText = oResponse.SpaceName;
								ns1blankspace.spaceContactBusiness = oResponse.TargetUserContactBusiness;
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
					//$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
					ns1blankspace.container.hide({force: true});

					var aID = (event.target.id).split('-')
					$.ajax(
					{
						type: 'POST',
						url: ns1blankspace.util.endpointURI('CORE_SPACE_MANAGE'),
						data: 'switch=1&id=' + aID[1],
						dataType: 'json',
						success: function(oResponse)
						{
							if (oResponse.status == 'OK')
							{	
								ns1blankspace.space = oResponse.TargetSpace;
								ns1blankspace.spaceText = oResponse.SpaceName;
								ns1blankspace.spaceContactBusiness = oResponse.TargetContactBusiness;
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
	show: function (oParam)
	{
		var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {'default': 'ns1blankspaceMainAttachments'}).value;
		var iObject = ns1blankspace.util.getParam(oParam, 'object', {'default': ns1blankspace.object}).value;
		var iObjectContext = ns1blankspace.util.getParam(oParam, 'objectContext', {'default': ns1blankspace.objectContext}).value;
		var bShowAdd = ns1blankspace.util.getParam(oParam, 'showAdd', {'default': true}).value;
		var iAttachmentType = ns1blankspace.util.getParam(oParam, 'attachmentType').value;
		var oActions = ns1blankspace.util.getParam(oParam, 'actions', {'default': {add: true}}).value;
		var sHelpNotes = ns1blankspace.util.getParam(oParam, 'helpNotes').value;
		var oContext = ns1blankspace.util.getParam(oParam, 'context', {'default': {inContext: false}}).value;
		var sSortBy = ns1blankspace.util.getParam(oParam, 'sortBy', {"default": 'filename'}).value;
		var sSortDirection = ns1blankspace.util.getParam(oParam, 'sortDirection', {"default": 'asc'}).value;
		var sSearchText = ns1blankspace.util.getParam(oParam, 'searchText').value;
		
		if (oActions.add == true)
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
			
			aHTML.push('<tr><td>' +
							'<span id="ns1blankspaceAttachmentsAdd" class="ns1blankspaceAction">Add</span>' +
							'</td></tr>');

			aHTML.push('<tr><td class="ns1blankspaceText" style="padding-top:12px;">' +
									'<input id="ns1blankspaceAttachmentsSearchText" class="ns1blankspaceText" data-1blankspace="ignore" style="width:80px;">' +
									'</td></tr>');
																
			aHTML.push('<tr><td style="padding-top:0px;">' +
							'<span id="ns1blankspaceAttachmentsSearch" class="ns1blankspaceAction">Search</span>' +
							'</td></tr>');

			if (sSearchText != undefined)
			{	
				aHTML.push('<tr><td>' +
							' <span id="ns1blankspaceAttachmentsSearchClear" class="ns1blankspaceAction">Clear</span>' +
							'</td></tr>');
			}

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
				ns1blankspace.attachments.sourceType(oParam)
			})
			.css('width', '80px');

			$('#ns1blankspaceAttachmentsSearch').button(
			{
				label: 'Search'
			})
			.click(function() 
			{
				oParam = ns1blankspace.util.setParam(oParam, 'searchText', $('#ns1blankspaceAttachmentsSearchText').val());
				delete oParam.xhtmlElementID;
				ns1blankspace.attachments.show(oParam);
			})
			.css('width', '80px');

			$('#ns1blankspaceAttachmentsSearchClear').button(
			{
				label: 'Clear'
			})
			.click(function() 
			{
				oParam = ns1blankspace.util.setParam(oParam, 'searchText', undefined);
				delete oParam.xhtmlElementID;
				ns1blankspace.attachments.show(oParam);
			})
			.css('width', '80px');

			$('#ns1blankspaceAttachmentsSearchText').keyup(function(e)
			{
				if (e.which === 13)
		    	{
		    		oParam = ns1blankspace.util.setParam(oParam, 'searchText', $('#ns1blankspaceAttachmentsSearchText').val());
		    		delete oParam.xhtmlElementID;
		    		ns1blankspace.attachments.show(oParam);
		    	}
			});				

			$('#ns1blankspaceAttachmentsSearchText').val(sSearchText);					
		}
		
		if (iObjectContext != -1)
		{	
			var oSearch = new AdvancedSearch();
			oSearch.method = 'CORE_ATTACHMENT_SEARCH';
			oSearch.addField('type,filename,title,description,download,modifieddate,attachment,bucket,createddate,createdusertext,sourcetype,url');
			oSearch.addFilter('object', 'EQUAL_TO', iObject);
			oSearch.addFilter('objectcontext', 'EQUAL_TO', iObjectContext);
			oSearch.rows = ns1blankspace.option.defaultRows;
			
			if (iAttachmentType != undefined)
			{
				oSearch.addFilter('type', 'EQUAL_TO', iAttachmentType);
			}

			if (sSearchText != undefined)
			{				
				oSearch.addBracket('(');			
				oSearch.addFilter('filename', 'TEXT_IS_LIKE', sSearchText);
				oSearch.addOperator('or');
				oSearch.addFilter('title', 'TEXT_IS_LIKE', sSearchText);
				oSearch.addOperator('or');
				oSearch.addFilter('url', 'TEXT_IS_LIKE', sSearchText);
				oSearch.addBracket(')');
			}

			oSearch.sort(sSortBy, sSortDirection);
			oSearch.getResults(function(data) {ns1blankspace.attachments.process(data, oParam)});
		}
	},

	sourceType: function (oParam)
	{
		if (ns1blankspace.option.attachmentsAsURLs)
		{
			if ($(ns1blankspace.xhtml.container).attr('data-initiator') == 'ns1blankspaceAttachmentsAdd')
			{
				$(ns1blankspace.xhtml.container).slideUp(500);
				$(ns1blankspace.xhtml.container).attr('data-initiator', '');
			}
			else
			{
				ns1blankspace.container.position(
				{
					xhtmlElementID: 'ns1blankspaceAttachmentsAdd',
					topOffset: -25,
					leftOffset: -66
				});

				$vq.clear({queue: 'sourcetype'});

				$vq.add('<div class="ns1blankspaceViewControlContainer" id="ns1blankspaceAttachmentsAddContainer" style="font-size:0.875em; width:60px; text-align:center;">',
					{queue: 'sourcetype'});

				$vq.add('<div class="ns1blankspaceRow ns1blankspaceRowSelect" style="border-width: 0px; margin:8px;"' +
								' id="ns1blankspaceAttachmentsAdd-file">File</div>', {queue: 'sourcetype'});
					
				$vq.add('<div class="ns1blankspaceRow ns1blankspaceRowSelect" style="border-width: 0px; margin:8px;"' +
								' id="ns1blankspaceAttachmentsAdd-url">URL</div>', {queue: 'sourcetype'});

				$vq.add('</div>', {queue: 'sourcetype'});

				$vq.render(ns1blankspace.xhtml.container, {queue: 'sourcetype', show: true});

				$(ns1blankspace.xhtml.container).css('width', $(ns1blankspace.xhtml.container + ' div').width() + 'px');

				$('#ns1blankspaceAttachmentsAddContainer .ns1blankspaceRowSelect').click(function ()
				{
					var sSourceType = this.id.split('-')[1];
					oParam = ns1blankspace.util.setParam(oParam, 'sourceType', sSourceType)
					ns1blankspace.attachments.add.init(oParam);
					ns1blankspace.container.hide(
					{
						xhtmlElementID: 'ns1blankspaceAttachmentsAdd',
						fadeOutTime: 0
					});
				})
			}
		}
		else
		{
			ns1blankspace.attachments.add.file(oParam);
		}
	},

	process: function (oResponse, oParam)
	{	
		var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;
		var bShowUser = ns1blankspace.util.getParam(oParam, 'showUser', {"default": false}).value;
		var fFunctionSearch = ns1blankspace.util.getParam(oParam, 'functionSearch', {'default': ns1blankspace.attachments.show}).value;
		var aHTML = [];
		var bNoRows = (oResponse.data.rows.length == 0)

		if (!bNoRows)
		{
			if (oResponse.data.rows[0].filename == '')
			{
				bNoRows = true;
			}
		}
			
		if (bNoRows)
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
			aHTML.push('<td class="ns1blankspaceHeaderCaption">Name</td>');
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
				functionSearch: fFunctionSearch,
				functionShowRow: ns1blankspace.attachments.row,
				functionOnNewPage: ns1blankspace.attachments.bind,
				type: 'json'
			}); 	
				
			ns1blankspace.attachments.bind();
		}
	},
				
	row: function (oRow, oParam)
	{
		var aHTML = [];
		var bShowUser = ns1blankspace.util.getParam(oParam, 'showUser', {"default": false}).value;
			
		aHTML.push('<tr class="ns1blankspaceAttachments">');
		
		if (oRow.sourcetype == 1)
		{
			aHTML.push('<td id="ns1blankspaceAttachment_filename-' + oRow.id + '" class="ns1blankspaceRow">' +
							'<a href="' + oRow.download + '" class="ns1blankspaceNoUnloadWarn">' + oRow.filename + '</a></td>');
		}
		else
		{
			var sURL = oRow.url;
			if (sURL.indexOf('http') == -1) {sURL = 'http://' + sURL}

			aHTML.push('<td id="ns1blankspaceAttachment_url-' + oRow.id + '" class="ns1blankspaceRow">' +
							'<a href="' + sURL + '" class="ns1blankspaceNoUnloadWarn" target="_blank">' + 
							(oRow.title!=''?oRow.title:oRow.url) + '</a></td>');
		}	
							
		aHTML.push('<td id="ns1blankspaceAttachment_date-' + oRow.id + '" class="ns1blankspaceRow">' + oRow.modifieddate + '</td>');

		if (bShowUser)
		{
			aHTML.push('<td id="ns1blankspaceAttachment_user-' + oRow.id + '" class="ns1blankspaceRow">' + oRow.createdusertext + '</td>');
		}
		
		aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">' +
						'<span id="ns1blankspaceAttachment_options_remove-' + oRow.attachment + 
						'" class="ns1blankspaceAttachmentsRemove"></span></td>');
		
		aHTML.push('</tr>');
		
		return aHTML.join('');
	},

	bind: function (oParam)
	{
		var sXHTMLContainerID = ns1blankspace.util.getParam(oParam, 'xhtmlContainerID', {"default": 'ns1blankspaceRenderPage_Action-0'}).value;
		var oActions = ns1blankspace.util.getParam(oParam, 'actions').value;
		if (oActions == undefined)
		{
			oActions = ns1blankspace.util.getParam(ns1blankspace.param, 'actions', {'default': {remove: true, add: true}}).value;
		}

		if (oActions.add == undefined) {oActions.add = true}
		if (oActions.remove == undefined) {oActions.remove = true}

		if (oActions.remove == true)
		{
			$('span.ns1blankspaceAttachmentsRemove:not(".ui-button")').button(
			{
				text: false,
				icons: {primary: "ui-icon-close"}
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
		}
	},

	add:
	{
		init:  function (oParam, oResponse)
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
					if (data.status == 'ER')
					{
						ns1blankspace.logOff()
					}
					else
					{
						var sSourceType = ns1blankspace.util.getParam(oParam, 'sourceType').value;
						ns1blankspace.attachments.add[sSourceType](oParam);	
					}
				}
			});
		},

		file:  function (oParam, oResponse)
		{
			var bShowUpload = ns1blankspace.util.getParam(oParam, 'showUpload', {"default": true}).value;

			if (ns1blankspace.option.attachmentsBucket == undefined && oResponse == undefined)
			{	
				var oSearch = new AdvancedSearch();
				oSearch.method = 'SETUP_AWS_S3_BUCKET_SEARCH';
				oSearch.addField('account,title');
				oSearch.addFilter('title', 'TEXT_IS_LIKE', '1blankspace-attachments')
				oSearch.rows = 1;
				oSearch.getResults(function(oResponse)
				{
					ns1blankspace.attachments.add.file(oParam, oResponse)
				});
			}
			else
			{	
				if (oResponse != undefined)
				{	
					ns1blankspace.option.attachmentsBucket = -1;

					if (oResponse.data.rows.length==1)
					{
						ns1blankspace.option.attachmentsBucket = oResponse.data.rows[0].id;
					}
				}	

				if (ns1blankspace.option.attachmentsBucket != -1)
				{
					oParam = ns1blankspace.util.setParam(oParam, 'bucket', ns1blankspace.option.attachmentsBucket)
				}

				$('#ns1blankspaceAttachmentsColumn1').html(ns1blankspace.attachments.upload.show(oParam));

				oParam.xhtmlElementID = 'ns1blankspaceMainAttachments';

				if (bShowUpload)
				{
					ns1blankspace.attachments.upload.submit(oParam);
				}
			
				$("select").change(function () 
				{
					aValue = ($(this).val()).split('-')	
					$('#filetype' + aValue[0]).val(aValue[1])
				});
			}	
		},

		url: function (oParam, oResponse)
		{
			var aHTML = [];

			aHTML.push('<table>');

			aHTML.push('<tr class="ns1blankspaceCaption">' +
								'<td class="ns1blankspaceCaption">' +
								'URL' +
								'</td></tr>' +
								'<tr class="ns1blankspace">' +
								'<td class="ns1blankspaceText">' +
								'<input id="ns1blankspaceAttachmentsURL" class="ns1blankspaceText">' +
								'</td></tr>');

			aHTML.push('<tr class="ns1blankspaceCaption">' +
								'<td class="ns1blankspaceCaption">' +
								'Name (optional)' +
								'</td></tr>' +
								'<tr class="ns1blankspace">' +
								'<td class="ns1blankspaceText">' +
								'<input id="ns1blankspaceAttachmentsTitle" class="ns1blankspaceText">' +
								'</td></tr>');	

			aHTML.push('</table>');

			aHTML.push('<div id="ns1blankspaceAttachmentsURLAttach" class="ns1blankspaceAction" style="margin-top:10px;">Attach</div>')

			$('#ns1blankspaceAttachmentsColumn1').html(aHTML.join(''));

			$('#ns1blankspaceAttachmentsURLAttach').button(
			{
				label: "Attach"
			})
			.click(function()
			{
				var oData =
				{
					url1: $('#ns1blankspaceAttachmentsURL').val(),
					title1: $('#ns1blankspaceAttachmentsTitle').val(),
					object: ns1blankspace.object,
					objectcontext: ns1blankspace.objectContext
				}

				$.ajax(
				{
					type: 'POST',
					url: ns1blankspace.util.endpointURI('ATTACH_FILE'),
					data: oData,
					dataType: 'json',
					success: function(data)
					{
						ns1blankspace.attachments.show(oParam)
					}
				});
			});
		}
	},	

	upload: 	
	{ 
		show: function (oParam)
		{
			var iObject = ns1blankspace.util.getParam(oParam, 'object', {'default': ns1blankspace.object}).value;
			var lObjectContext = ns1blankspace.util.getParam(oParam, 'objectContext', {'default': ns1blankspace.objectContext}).value;
			var sObjectName = ns1blankspace.util.getParam(oParam, 'objectName', {'default': ''}).value;
			var bShowAdd = ns1blankspace.util.getParam(oParam, 'showAdd', {'default': true}).value;
			var iAttachmentType = ns1blankspace.util.getParam(oParam, 'attachmentType', {'default': ''}).value;
			var oActions = ns1blankspace.util.getParam(oParam, 'showAdd', {'default': {add: true}}).value;
			var sHelpNotes = ns1blankspace.util.getParam(oParam, 'helpNotes', {'default': ''}).value;
			var oContext = ns1blankspace.util.getParam(oParam, 'context', {'default': {inContext: false}}).value;
			var sXHTML = ns1blankspace.util.getParam(oParam, 'xhtml', {"default": ''}).value;
			var sURL = ns1blankspace.util.getParam(oParam, "url", {'default': '/rpc/attach/?method=ATTACH_FILE&rf=JSON'}).value;
			
			var iMaxFiles = ns1blankspace.util.getParam(oParam, 'maxFiles', {"default": 1}).value;
			var sLabel = ns1blankspace.util.getParam(oParam, 'label', {"default": ''}).value;
			var bShowUpload = ns1blankspace.util.getParam(oParam, 'showUpload', {"default": true}).value;
			var aInputs = ns1blankspace.util.getParam(oParam, 'inputs', {"default": []}).value;
			var aInputParams = ns1blankspace.util.getParam(oParam, 'inputParams', {"default": []}).value;
			var iPublicType = ns1blankspace.util.getParam(oParam, 'publicType').value;
			var aAttachmentTypes = ns1blankspace.util.getParam(oParam, 'attachmentTypes', {"default": []}).value;
			var iBucket = ns1blankspace.util.getParam(oParam, 'bucket').value;
			var bImage = ns1blankspace.util.getParam(oParam, 'image').value;

			var match = navigator.userAgent.match(/(?:MSIE |Trident\/.*; rv:)(\d+)/);
			var sIEVersion = match ? parseInt(match[1]) : undefined;
			var aHTML = [];

			$('[name="ns1blankspaceFileUpload"]').remove();

			aHTML.push('<form name="ns1blankspaceFileUpload" action="' + sURL + 
								((sIEVersion && sIEVersion == 9) ? '&ct=text/html' : '') + '" ' +
							'enctype="multipart/form-data" method="POST" target="ns1blankspaceUploadProxy" accept-charset="utf-8">' +
							'<input type="hidden" name="maxfiles" id="maxfiles" value="' + iMaxFiles + '">' +
							'<input type="hidden" name="object" id="object" value="' + iObject + '">' +
							'<input type="hidden" name="objectcontext" id="objectcontext" value="' + lObjectContext + '">');
					
			if (iBucket != undefined)
			{		
				aHTML.push('<input type="hidden" name="bucket" id="bucket" value="' + iBucket + '">');
			}	
					
			for (var i = 0; i < iMaxFiles; i++) 	
			{
				aHTML.push('<input type="hidden" class="filetype" name="filetype' + i + '" id="filetype' + i + '" value="' + iAttachmentType + '">');
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
				aHTML.push('<div id="ns1blankspaceUploadLabel" class="ns1blankspaceUpload ns1blankspaceSubNote" style="margin-bottom:10px;">' + sLabel + '</div>');
			}	
				
			for (var i = 0; i < iMaxFiles; i++) 	
			{
				aHTML.push('<div id="ns1blankspaceUploadFile' + i + '" class="ns1blankspaceUpload" style="padding:3px;">' +
								'<input class="ns1blankspaceUpload" type="file" name="file' + i + '" id="oFile' + i + '"' +
								(bImage?' accept="image/*" capture="camera"':'') + '>');
				
				if (aAttachmentTypes.length > 0)
				{
					aHTML.push('<select class="ns1blankspaceAttachmentType">');
					
					aHTML.push('<option class="optionType" id="optionType-' + i + '--' +
										'" value="' + i + '-">' +
										'[Not Set]' +
										'</option>');
										
					$.each(aAttachmentTypes, function(index, t) 
					{
						aHTML.push('<option class="optionType" id="optionType-' + i + '-' + index + '-' + t.type +
										'" value="' + i + '-' + t.type + '">' +
										t.typetext +
										'</option>');
					});
				
					aHTML.push('</select>');
					
				}
				aHTML.push('</div>');
			}

			if (bShowUpload)
			{
				aHTML.push('<div style="margin-left:3px; margin-top:10px;">' +
							'<input id="ns1blankspaceUpload" class="ns1blankspaceAction ns1blankspaceAction ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" type="submit" value="Upload">' +
							'</div>');
			}
			else
			{
				aHTML.push('<div style="margin-left:3px; margin-top:10px;" id="ns1blankspaceUpload"></div>')
			}	
				
			aHTML.push('<div id="ns1blankspaceUploadStatus" class="ns1blankspaceUpload" style="margin-top:20px; font-size:0.875em;"></div>')
			aHTML.push('<iframe style="display:none;" name="ns1blankspaceUploadProxy" id="ns1blankspaceUploadProxy" class="ns1blankspaceUpload" frameborder="0"></iframe>' +
							'</form>');
			
			return aHTML.join('');
		},

		submit: function(oParam)
		{
			var fFunctionPostUpdate = (oParam && oParam.functionPostUpdate) ? oParam.functionPostUpdate : ns1blankspace.attachments.show;
			var fFunctionValidate = ns1blankspace.util.getParam(oParam, 'functionValidate', {'default': ns1blankspace.attachments.upload.validate}).value;
			var bSubmit = ns1blankspace.util.getParam(oParam, 'submit', {'default': false}).value;

			$('[name="ns1blankspaceFileUpload"]')['ajax' + (bSubmit?'Submit':'Form')](
			{
				beforeSubmit: function()
				{
					return fFunctionValidate("ns1blankspaceUpload");
				},
				beforeSend: function() 
				{
					oParam = ns1blankspace.attachments.upload.setTypesUploaded(oParam);
					$('#ns1blankspaceUploadStatus').html('');
					$('#ns1blankspaceUploadStatus')
						.progressbar({value: Number(0)});
				},
				uploadProgress: function(event, position, total, percentComplete) 
				{
					$('#ns1blankspaceUploadStatus')
						.progressbar({value: Number(percentComplete)});
				},
				success: function() 
				{
					$('#ns1blankspaceUploadStatus')
						.progressbar({value: Number(100)});
				},
				complete: function(xhr) 
				{
					var oResponse = JSON.parse(xhr.responseText);
					this.disabled = false;
					if (oResponse.status === 'OK')
					{
						if (fFunctionPostUpdate)
						{
							$.extend(oParam, {attachments: oResponse.data.rows}, true);
							fFunctionPostUpdate(oParam, oResponse);
						}
					}
					else
					{
						ns1blankspace.status.error(oResponse.error.errornotes);
					}
				} 			
			});
		},

		validate: function(sXHTMLElementID)
		{
			var bValid = true;

			if ($.grep($('.ns1blankspaceUpload'), function(x) {return $(x).val() != ''}).length === 0)
			{
				$('#ns1blankspaceUploadStatus')
					.html('<div class="alert alert-danger">No attachments to upload.</div>');
				bValid = false;
			}
			else
			{
				$('#' + sXHTMLElementID).attr('disabled', true);
			}
			return bValid;
		},

		setTypesUploaded: function(oParam)	
		{
			oParam = oParam || {};

			var aAttachmentTypesUploaded = [];
			$.each($('.ns1blankspaceAttachmentType'), function(index)
			{
				if ($('#oFile' + index).val() != '' && $(this).val().split('-').pop() != '' && $(this).val().split('-').pop() != undefined)
				{
					aAttachmentTypesUploaded.push($(this).val().split('-').pop());
				}
			});
			oParam.typesUploaded = aAttachmentTypesUploaded;
			return oParam;
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

		status: function ()
		{
			var oDivStatus = document.getElementById('ns1blankspaceFileUploadStatus');
			var oFrame = document.getElementById('ns1blankspaceUploadProxy');
			var sStatus;
			var sCurrentState;
			var fFunctionPostUpdate = ns1blankspace.util.getParam(ns1blankspace.param, 'functionPostUpdate', {'default': ns1blankspace.attachments.show}).value;
			
			if (oFrame !== null)
			{	
				if (oFrame.readyState) 
				{
					//IE
					sCurrentState = oFrame.readyState;
				}
				else 
				{
					if (oFrame.contentDocument.body.innerHTML.substring(0, 2) === 'OK') 
					{
						sCurrentState = 'complete';
					}
					else if (oFrame.contentDocument.body.innerHTML.substring(0, 2) === 'ER')
					{
						sCurrentState = 'error';
					}
					else 
					{
						sCurrentState = oFrame.contentDocument.body.innerHTML;
					}
				}
			}

			if (sCurrentState === 'error') 
			{	
				clearInterval(ns1blankspace.timer.delay);
				ns1blankspace.app.start({message: 'You need to log on again.'});
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
	show: 	function (oParam)
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
						ns1blankspace.formFactor.is(
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
							'<span id="ns1blankspaceActionsAdd"></span>' +
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
			
			var bContactBusiness = (iContactBusiness != undefined && iContactBusiness != '');
			var bContactPerson = (iContactPerson != undefined && iContactPerson != '');

			if (bContactBusiness || bContactPerson)
			{
				if (iObject)
				{
					oSearch.addOperator('or');
				}

				oSearch.addBracket('(');

				if (bContactBusiness)
				{
					oSearch.addFilter('contactbusiness', 'EQUAL_TO', iContactBusiness)
				};

				if (bContactPerson)
				{
					if (bContactBusiness)
					{
						oSearch.addOperator('or');
					}

					oSearch.addFilter('contactperson', 'EQUAL_TO', iContactPerson)
				};

				oSearch.addBracket(')');
			}	

			oSearch.sort('modifieddate', 'desc')

			oParam.xhtmlElementID = 'ns1blankspaceActionsColumn1';
			oSearch.getResults(function(data) {ns1blankspace.actions.process(oParam, data)});
		}
	},

	process: function (oParam, oResponse)
	{	
		var aHTML = [];
		var bShowDescription = false;
		var sXHTMLElementID = 'ns1blankspaceActionsColumn1';
		var bShowOpen = ns1blankspace.util.getParam(oParam, 'showOpen', {"default": true}).value;

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

			if (bShowOpen)
			{
				aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>');
			}

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

	bind: function (oParam)
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
		.css('height', '20px');
		
		$('#' + sXHTMLContainerID + ' td.ns1blankspaceRowSelect').click(function()
		{
			ns1blankspace.action.init({id: (this.id).split('-')[1]})
		});

		$('#' + sXHTMLContainerID + ' .ns1blankspaceRowOpen').button(
		{
			text: false,
			icons:
			{
				primary: "ui-icon-newwin"
			}
		})
		.click(function()
		{
			this.id = this.id.split('-').pop();
			window.open(document.location.origin + '/#/action/' + this.id);
		})
		.css('width', '15px')
		.css('height', '20px');

	},	

	row: function (oRow, oParam)
	{
		var bShowDescription = ns1blankspace.util.getParam(oParam, 'showDescription', {"default": false}).value;
		var bShowOpen = ns1blankspace.util.getParam(oParam, 'showOpen', {"default": true}).value;

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
		
		aHTML.push('<td style="width:30px; text-align:right; padding-right:0px;" class="ns1blankspaceRow">' + 			
						'<span id="ns1blankspaceAction_options_remove-' + oRow.id + '" class="ns1blankspaceRowRemove"></span>' +
						'</td>');

		if (bShowOpen)
		{
			aHTML.push('<td style="width:20px; text-align:left;" class="ns1blankspaceRow">' + 			
						'<span id="ns1blankspaceAction_options_open-' + oRow.id + '" class="ns1blankspaceRowOpen"></span>' +
						'</td>');
		}

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