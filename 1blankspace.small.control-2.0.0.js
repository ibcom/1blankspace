/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
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

ns1blankspace.xhtml.logonNotesFooter =
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

ns1blankspace.xhtml.header2 =
	'<div id="ns1blankspaceLogo" style="width:300px;"><img src="/jscripts/images/1blankspace.aoe-2.0.0.png"></div>' +
	'<div id="ns1blankspaceSpaceText" style="width:300px;"></div>' +
	'<div id="ns1blankspaceLogonName" style="width:300px;"></div>';

ns1blankspace.xhtml.header = '';

ns1blankspace.xhtml.viewContainer =
	'<div id="ns1blankspaceViewControlHomeContainer">' +
		'<span id="ns1blankspaceViewControlHome">&nbsp;</span>' +
		'<span id="ns1blankspaceViewControlHomeOptions">&nbsp;</span></div>' +
	'<div id="ns1blankspaceViewControlHistoryContainer">' +
		'<span id="ns1blankspaceViewControlBack" >&nbsp;</span>' +
		'<span id="ns1blankspaceViewControlRefresh">&nbsp;</span>' +
		'<span id="ns1blankspaceViewControlForward">&nbsp;</span></div>' +			
	'<div id="ns1blankspaceViewControlViewContainer">' +
		'<span id="ns1blankspaceViewControlView">&nbsp;</span></div>' +				
	'<div id="ns1blankspaceViewControlSearchContainer">' +
		'</div>' +				
	'<div id="ns1blankspaceViewControlSearchStatus"></div>' +				
	'<div id="ns1blankspaceViewControlActionStatus">&nbsp;</div>' +
	'<div id="ns1blankspaceViewControlUser">&nbsp;</div>' +
	'<div id="ns1blankspaceViewControlContextImage" ></div>' +
	'<div id="ns1blankspaceViewControlContext">&nbsp;</div>' +
	'<div id="ns1blankspaceViewControlNew"></div>';
	
ns1blankspace.scripts =
ns1blankspace.scripts.concat(
[
	{
		nameSpace: '1blankspace.home',
		source: '/jscripts/1blankspace.small.home-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.contactPerson',
		source: '/jscripts/1blankspace.small.contactperson-2.0.0.js'
	}
])

ns1blankspace.themes = 
[
	{
		title: 				'Standard',
		cssURI: 			'', 
		xhtmlHeaderLogo: 	'<img src="/jscripts/images/1blankspace.aoe-2.0.0.png">',
		default: 			true
	}
]	

ns1blankspace.control.init = 
				function (oParam, oResponse)
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

						var iSiteID = ns1blankspace.user.site;

						if (iSiteID === undefined && ns1blankspace.util.ifExists({variable: 'mydigitalstructureSiteId'}) !== undefined)
						{
							iSiteID = mydigitalstructureSiteId;
						}

						if (iSiteID !== undefined)
						{
							$.ajax(
							{
								type: 'GET',
								url: '/site/' + iSiteID + '/1blankspace.control.json',
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
									//ns1blankspace.control.user.changeTheme({theme: sData});
								}

								if (fPostInit) {fPostInit()}
							}
						})
					}		
				}
	
ns1blankspace.views = 
[
	{
		title: "People",
		namespace: "contactPerson",
		endpoint: "CONTACT_PERSON",
		show: true,
		group: 1,
		type: 1
	}
]

ns1blankspace.control.views =
{					
	show: 		function ()
				{
					var aHTML = [];

					if (ns1blankspace.xhtml.viewControl == undefined)
					{
						$($.grep(ns1blankspace.views, function (a) {return a.show})).each(function()
						{
							aHTML.push('<table class="ns1blankspaceViewControlContainer">');
							aHTML.push('<tr class="ns1blankspaceViewControl">');
							aHTML.push('<tr class="ns1blankspaceViewControl">' +
											'<td class="ns1blankspaceViewControl">' +
											'<span id="ns1blankspaceViewControl_contactPerson" class="ns1blankspaceViewControl">' + 
											this.title + '</span></td></tr>');
						});

						ns1blankspace.xhtml.viewControl = aHTML.join('');
					}

					ns1blankspace.container.show(
					{
						xhtmlElementID: 'ns1blankspaceViewControlViewContainer',
						xhtml: ns1blankspace.xhtml.viewControl
					});	

					ns1blankspace.control.views.bind();	
				},
			
	bind: 		function ()
				{
					$($.grep(ns1blankspace.views, function (a) {return a.show})).each(function()
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
}

ns1blankspace.app.bind =
				function ()
				{
					$('#ns1blankspaceViewControlViewContainer').button(	
					{
						icons: 
						{
							primary: "ui-icon-grip-dotted-vertical",
							secondary: "ui-icon-triangle-1-s"
						},
						label: ns1blankspace.option.defaultView
					})
					.click(function() 
					{
						ns1blankspace.control.views.show(this);
					})
					.css('text-align', 'left');

					$('#ns1blankspaceViewControlHome').button(
					{
						text: false,
						icons:
						{
							primary: "ui-icon-home"
						}
					})
					.click(function(event)
					{
						ns1blankspace.home.show();
					});

					$('#ns1blankspaceViewControlBack').button(
					{
						text: false,
						icons:
						{
							primary: 'ui-icon-triangle-1-w'
						}
					})
					.click(function(event)
					{
						ns1blankspace.history.view({instruction: 2});
					})
					.css('margin-right', '2px');

					$('#ns1blankspaceViewControlRefresh').button(
					{
						text: false,
						icons:
						{
							primary: 'ui-icon-arrowthickstop-1-n'
						}
					})
					.click(function()
					{
						if (ns1blankspace.objectParentName !== undefined)
						{
							ns1blankspace[ns1blankspace.objectParentName][ns1blankspace.objectName].init();
						}	
						else
						{
							ns1blankspace[ns1blankspace.objectName].init();
						}	
					});

					$('#ns1blankspaceViewControlNew').button(
					{
						text: false,
						icons:
						{
							primary: "ui-icon-plus"
						}
					})
					.css('width', '26px')
					.css('height', '26px');	

					$('#REMOVEns1blankspaceViewControlActionOptions').button(
					{
						text: false,
						icons:
						{
							primary: 'ui-icon-triangle-1-s'
						}
					})
					.click(function(event)
					{
						ns1blankspace.history.view({instruction: 2});
					})
					.css('height', '26px');

					$('#ns1blankspaceViewControlUser').button(
					{
						text: false,
						icons:
						{
							primary: 'ui-icon-power'
						}
					})
					.click(function(event)
					{
						ns1blankspace.control.user.show(this);
					});

					if (ns1blankspace.history.sendOnLogon)
					{
						$.ajax(ns1blankspace.history.sendOnLogon);
					}					

					if (ns1blankspace.option.returnToLast) 
					{
						ns1blankspace.history.view({instruction: 8})
					}
					else
					{
						ns1blankspace.app.showWhenLoaded('home');
					}	
				}				
	
ns1blankspace.control.user =
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
						$(ns1blankspace.xhtml.container).offset({ top: $(oElement).offset().top + $(oElement).height(), left: $(oElement).offset().left - 147});
						$(ns1blankspace.xhtml.container).html(this.layout());
							
						ns1blankspace.control.user.bind();
					}	
				},

	layout:		function ()
				{
					var aHTML = [];

					aHTML.push('<table style="width: 180px; font-size: 0.875em;" id="ns1blankspaceControlUser" class="ns1blankspaceViewControlContainer">');
						
					aHTML.push('<tr><td id="ns1blankspaceUserLogOff" class="ns1blankspaceViewControl">' +
									'Log Off</td></tr>');
			
					aHTML.push('<tr><td id="ns1blankspaceControlUserChangePassword" class="ns1blankspaceViewControl">' +
									'Change My Password</td></tr>');		

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

	changePassword:
				function (oParam)
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
					
				}
}