/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 */
 
ns1blankspace.option.defaultView = "Select...";
ns1blankspace.option.defaultSetupView = "Spaces";
ns1blankspace.option.autoSetupSwitch = false;

ns1blankspace.scripts =
[
	{
		nameSpace: '1blankspace.advancedsearch',
		source: '/jscripts/1blankspace.advancedsearch-2.0.3.js'
	},
	{
		nameSpace: '1blankspace.home',
		source: '/jscripts/1blankspace.developer.home-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.format',
		source: '/jscripts/1blankspace.format-2.0.3.js'
	},
	{
		nameSpace: '1blankspace.developer.membership',
		source: '/jscripts/1blankspace.developer.membership-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.developer.space',
		source: '/jscripts/1blankspace.developer.space-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.news',
		source: '/jscripts/1blankspace.news-2.0.0.js'
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
		nameSpace: '1blankspace.setup.messaging',
		source: '/jscripts/1blankspace.setup.messaging-2.0.1.js'
	},
	{
		nameSpace: '1blankspace.setup.networkGroup',
		source: '/jscripts/1blankspace.setup.networkgroup-2.0.0.js'
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
		nameSpace: '1blankspace.supportIssue',
		source: '/jscripts/1blankspace.supportissue-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.setup.file',
		source: '/jscripts/1blankspace.setup.file-2.0.1.js'
	}
]

ns1blankspace.xhtml.logonNotes =
	'<a href="http://mydigitalstructure.com/gettingstarted_first_app_ide" target="_blank"><strong>Help on building your first app<br/>using this simple development environment (IDE).</strong></a>' +
	'<br /><br /><hr />' +
	'<br />This is a simple jQuery based app for managing your websites, webapps, structures & forms.' +
	'<br /><br />If you wish, you can grab these scripts and modify them to create your own IDE or use your preferred IDE.' +
	'<br /><br /><a href="http://mydigitalstructure.com/examples" target="_blank">More code examples</a>' +
	'<br /><br /><a href="http://mydigitalstructure.com/documentation" target="_blank">Documentation</a>' +
	'<br /><br /><a href="http://mydigitalstructure.com/gettingstarted" target="_blank">Getting started</a>' +
	'<br /><br /><a href="http://twitter.com/ibComMYDS" target="_blank">twitter.com/ibComMYDS</a>' +
	'<br /><br /><a href="http://mydigitalstructure.com/terms" target="_blank">By logging on you agree to the  mydigitalstructure terms of use</a>';

ns1blankspace.xhtml.homeNotes =
	'<table class="ns1blankspaceColumn2"><tr><td class="ns1blankspaceSub" style="font-size:0.875em;">' +
	'This is a simple jQueryUI app for managing your websites, webapps, structures & forms.' +
	'<br /><br />If you wish, you can grab these scripts and modify them to create your own IDE or use your existing preferred IDE.' +
	'<br /><br /><a href="https://github.com/ibcom/1blankspace" target="_blank">github Repository</a>' +
	'<br /><br /><a href="http://mydigitalstructure.com/examples" target="_blank">More code examples</a>' +
	'<br /><br /><hr />' +
	'<br /><a href="http://mydigitalstructure.com/documentation" target="_blank">Documentation</a>' +
	'<br /><br /><a href="http://mydigitalstructure.com/endpoints" target="_blank">Endpoints</a>' +
	'<br /><br />If you\'re looking for help on a method you can do <i>mydigitalstructure.com/<br />[method name]</i> as a shortcut.' +
	'<br /><br /><hr />' +
	'<br /><a href="https://app.1blankspace.com" target="_blank">app.1blankspace.com</a> is an example js/jQuery app that covers all the endpoints.  You can use your logon to check it out.' +
		'<br /><br /><a href="http://mydigitalstructure.com/1blankspace" target="_blank">Developer notes</a>' +
	'</td></tr></table>';

ns1blankspace.xhtml.header =
	'<div id="ns1blankspaceLogo" style="width:265px; float:left; "><img src="/jscripts/images/mydigitalstructure.develop-2.0.0.png"></div>' +
	'<div id="ns1blankspaceHeaderControl" style="float:right; margin-right:3px;">' +
	'<div id="ns1blankspaceSpaceText" style="width:450px;"></div>' +
	'<div id="ns1blankspaceLogonName" style="width:450px;"></div></div>';

ns1blankspace.themes = 
[
	{
		title: 				'Standard',
		cssURI: 			'', 
		xhtmlHeaderLogo: 	'<img src="/jscripts/images/mydigitalstructure.develop-2.0.0.png">',
		default: 			true
	},
	{
		title: 				'Travelling',
		cssURI: 			'/jscripts/1blankspace.theme.travelling-2.0.0.css',
		xhtmlHeaderLogo: 	'<img src="/jscripts/images/mydigitalstructure.develop.white-2.0.0.png">'
	},
	{
		title: 				'Wall',
		cssURI: 			'/jscripts/1blankspace.theme.wall-2.0.0.css',
		xhtmlHeaderLogo: 	'<img src="/jscripts/images/mydigitalstructure.develop.white-2.0.0.png">'
	}
]

ns1blankspace.views = 
[
	{
		title: "Websites&nbsp;&&nbsp;Webapps",
		parentnamespace: "setup",
		namespace: "website",
		endpoint: "SETUP_SITE", 
		show: true,
		group: 1,
		type: 1
	},
	{
		title: "Users",
		parentnamespace: "setup",
		namespace: "user",
		endpoint: "SETUP_USER", 
		show: true,
		group: 1,
		type: 1
	},
	{
		title: "User&nbsp;Roles",
		parentnamespace: "setup",
		namespace: "userRole",
		endpoint: "SETUP_USER_ROLE", 
		show: true,
		group: 1,
		type: 1
	},
	{
		title: "Network Groups",
		parentnamespace: "setup",
		namespace: "networkGroup",
		endpoint: "SETUP_USER_NETWORK_GROUP", 
		show: true,
		group: 1,
		type: 1
	},
	{
		title: "Structures",
		parentnamespace: "setup",
		namespace: "structure",
		endpoint: "SETUP_STRUCTURE", 
		show: true,
		group: 1,
		type: 1
	},
	{
		title: "Automation",
		parentnamespace: "setup",
		namespace: "automation",
		endpoint: "SETUP_USER_AUTOMATION", 
		show: true,
		group: 1,
		type: 1
	},
	{
		title: "File Import",
		parentnamespace: "setup",
		namespace: "file",
		endpoint: "SETUP_IMPORT_MANAGEA", 
		show: true,
		group: 1,
		type: 1
	},
	{
		title: "Spaces",
		parentnamespace: "developer",
		namespace: "space",
		endpoint: "SETUP_SPACE", 
		show: true,
		group: 1,
		type: 2
	},
	{
		title: "Apps&nbsp;(Memberships)",
		parentnamespace: "developer",
		namespace: "membership",
		endpoint: "ADMIN_MEMBERSHIP", 
		show: true,
		group: 1,
		type: 2
	},
	{
		title: "My&nbsp;Space&nbsp;/&nbsp;Account",
		parentnamespace: "setup",
		namespace: "space",
		endpoint: "", 
		show: true,
		group: 1,
		type: 2
	}
]

ns1blankspace.control.views.show = function ()
{
	if (ns1blankspace.xhtml.viewControl == undefined)
	{
		var aHTML = [];

		aHTML.push('<table class="ns1blankspaceViewControlContainer" style="width: 220px;">');
		aHTML.push('<tr class="ns1blankspaceViewControl">');

		$($.grep(ns1blankspace.views, function (a) {return a.type == 1;})).each(function()
		{
			aHTML.push('<tr class="ns1blankspaceViewControl">' +
							'<td class="ns1blankspaceViewControl">' +
							'<span id="ns1blankspaceViewControl_' + this.parentnamespace + '_' + this.namespace  + '" class="ns1blankspaceViewControl">' + 
							this.title + '</span>' +
							'</td></tr>');
		});		

		ns1blankspace.xhtml.viewControl = aHTML.join('');	
	}

	ns1blankspace.container.show(
	{
		xhtmlElementID: 'ns1blankspaceViewControlViewContainer',
		xhtml: ns1blankspace.xhtml.viewControl,
		setWidth: false
	});

	ns1blankspace.control.views.bind();
}			

ns1blankspace.control.setup.views.show = function ()
{
	if (ns1blankspace.xhtml.setupViewControl == undefined)
	{
		var aHTML = [];

		aHTML.push('<table class="ns1blankspaceViewControlContainer" style="width: 220px;">');
		aHTML.push('<tr class="ns1blankspaceViewControl">');

		$($.grep(ns1blankspace.views, function (a) {return a.type == 2;})).each(function()
		{
			aHTML.push('<tr class="ns1blankspaceViewControl">' +
							'<td class="ns1blankspaceViewControl">' +
							'<span id="ns1blankspaceViewControl_' + this.parentnamespace + '_' + this.namespace + '" class="ns1blankspaceViewControl">' + 
							this.title + '</span>' +
							'</td></tr>');
		});		

		ns1blankspace.xhtml.setupViewControl = aHTML.join('');	
	}

	ns1blankspace.container.show(
	{
		xhtmlElementID: 'ns1blankspaceViewControlViewContainer',
		xhtml: ns1blankspace.xhtml.setupViewControl
	});

	ns1blankspace.control.setup.views.bind();
}

ns1blankspace.control.setView =
{
	default: 		function ()
					{
						ns1blankspace.setup.website.init();		
					},

	setup:			function ()
					{
						ns1blankspace.developer.space.init();
					},
}















