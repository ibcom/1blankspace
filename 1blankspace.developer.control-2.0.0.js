/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 
ns1blankspace.option.defaultView = "Website";
ns1blankspace.option.defaultSetupView = "Spaces";

ns1blankspace.views = 
[
	{
		title: "Websites",
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
		title: "User Roles",
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
		title: "Spaces",
		parentnamespace: "setup",
		namespace: "space",
		endpoint: "SETUP_SPACE", 
		show: true,
		group: 1,
		type: 2
	},
	{
		title: "Apps&nbsp;(Memberships)",
		parentnamespace: "developer",
		namespace: "space",
		endpoint: "ADMIN_MEMBERSHIP", 
		show: true,
		group: 1,
		type: 2
	},
	{
		title: "My&nbsp;Account",
		parentnamespace: "setup",
		namespace: "space",
		endpoint: "", 
		show: true,
		group: 1,
		type: 2
	}
]

ns1blankspace.views.show = function ()
{
	if (ns1blankspace.viewportXHTML == undefined)
	{
		var aHTML = [];

		aHTML.push('<table id="ns1blankspaceViewControl" class="ns1blankspaceViewControlContainer">');
		aHTML.push('<tr class="ns1blankspaceViewControlColumnContainer">');

		$($.grep(ns1blankspace.views, function (a) {return a.type == 1;})).each(function()
		{
			aHTML.push('<tr class="ns1blankspaceViewControl">' +
							'<td id="ns1blankspaceViewControl_' + this.parentnamespace + '_' + this.namespace '" class="interfaceViewControl">' +
							'<span id="ns1blankspaceViewControl' + this.parentnamespace + '_' + this.namespace '" class="interfaceViewControl">' + 
							this.title + '</span>' +
							'</td></tr>');
		});		

		ns1blankspace.viewportXHTML = aHTML.join('');	
	}

	return ns1blankspace.viewportXHTML
}			

ns1blankspace.views.bind = function ()
{
	$($.grep(ns1blankspace.views, function (a) {return a.type == 1;})).each(function()
	{
		$('#ns1blankspaceViewControl' + this.parentnamespace + '_' + this.namespace).click(function(event)
		{
			$(ns1blankspace.xhtml.container).attr('data-initiator', '');

			if (this.parentnamespace)
			{
				var oNS = ns1blankspace[this.parentnamespace][this.namespace];
			}
			else
			{
				var oNS = ns1blankspace[this.parentnamespace];
			}

			oNS.init();
		});
}			

ns1blankspace.setup.views.show = function ()
{
	if (ns1blankspace.viewportXHTML == undefined)
	{
		var aHTML = [];

		aHTML.push('<table id="ns1blankspaceViewControl" class="ns1blankspaceViewControlContainer">');
		aHTML.push('<tr class="ns1blankspaceViewControlColumnContainer">');

		$($.grep(ns1blankspace.views, function (a) {return a.type == 2;})).each(function()
		{
			aHTML.push('<tr class="ns1blankspaceViewControl">' +
							'<td id="ns1blankspaceViewControl_' + this.parentnamespace + '_' + this.namespace '" class="interfaceViewControl">' +
							'<span id="ns1blankspaceViewControl' + this.parentnamespace + '_' + this.namespace '" class="interfaceViewControl">' + 
							this.title + '</span>' +
							'</td></tr>');
		});		

		ns1blankspace.viewportXHTML = aHTML.join('');	
	}

	return ns1blankspace.viewportXHTML
}			

ns1blankspace.setup.views.bind = function ()
{
	$($.grep(ns1blankspace.views, function (a) {return a.type == 2;})).each(function()
	{
		$('#ns1blankspaceViewControl' + this.parentnamespace + '_' + this.namespace).click(function(event)
		{
			$(ns1blankspace.xhtml.container).attr('data-initiator', '');

			if (this.parentnamespace)
			{
				var oNS = ns1blankspace[this.parentnamespace][this.namespace];
			}
			else
			{
				var oNS = ns1blankspace[this.parentnamespace];
			}

			oNS.init();
		});
}			