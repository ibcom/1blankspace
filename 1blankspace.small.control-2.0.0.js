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
ns1blankspace.option.formFactor.size.value = ns1blankspace.option.formFactor.size.options.small;

ns1blankspace.data.object = 
{
	person: 32,
	business: 12,
	opportunity: 35
};

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

ns1blankspace.xhtml.logonNotes = undefined;

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
	'<div id="ns1blankspaceViewControlSearchStatus"></div>' +
		'</div>' +							
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
		nameSpace: '1blankspace.contactBusiness',
		source: '/jscripts/1blankspace.small.contactbusiness-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.contactPerson',
		source: '/jscripts/1blankspace.small.contactperson-2.0.0.js'
	},
	{
		nameSpace: '1blankspace.messaging.conversation',
		source: '/jscripts/1blankspace.small.messaging.conversation-2.0.0.js'
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

ns1blankspace.control.init = function (oParam, oResponse)
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
		title: "Businesses",
		namespace: "contactBusiness",
		endpoint: "CONTACT_BUSINESS",
		show: true,
		group: 1,
		type: 1
	},
	{
		title: "People",
		namespace: "contactPerson",
		endpoint: "CONTACT_PERSON",
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
	}
]

ns1blankspace.control.views =
{					
	show: 		function ()
				{
					var aHTML = [];

					if (ns1blankspace.xhtml.viewControl == undefined)
					{
						aHTML.push('<table class="ns1blankspaceViewControlContainer">');

						$($.grep(ns1blankspace.views, function (a) {return a.show})).each(function()
						{	
							aHTML.push('<tr class="ns1blankspaceViewControl">' +
											'<td class="ns1blankspaceViewControl">' +
											'<span id="ns1blankspaceViewControl_' +
											(this.parentNamespace != undefined ? this.parentNamespace + '_' : '') +
											this.namespace + '" class="ns1blankspaceViewControl">' + 
											this.title + '</span></td></tr>');
						});

						aHTML.push('</table>');

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

ns1blankspace.app.bind = function ()
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


ns1blankspace.control.setView =
{
	default: 		function ()
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
							ns1blankspace.control.setView.default();
						}	
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
			
					//aHTML.push('<tr><td id="ns1blankspaceControlUserChangePassword" class="ns1blankspaceViewControl">' +
					//				'Change My Password</td></tr>');		

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
					.click(function()
					{
						$('#' + sXHTMLElementID).slideUp(500);
						$('#' + sXHTMLElementID).html('');
						$('#' + sXHTMLElementID).attr('data-initiator', '');
					})
					.css('width', '20px')
					.css('height', '20px')
					
					ns1blankspace.logon.changePassword.show({xhtmlElementID: 'ns1blankspaceLogonName'});
				}
}

ns1blankspace.attachments = 
{
	show: 		function (oParam)
				{
					var sXHTMLElementID = 'ns1blankspaceMainAttachments';
					var iObject = ns1blankspace.object;
					var iObjectContext = ns1blankspace.objectContext;
					var iAttachmentType;
					
					if (oParam != undefined)
					{
						if (oParam.object != undefined) {iObject = oParam.object}
						if (oParam.objectContext != undefined) {iObjectContext = oParam.objectContext}
						if (oParam.objectName != undefined) {sObjectName = oParam.objectName}
						if (oParam.showAdd != undefined) {bShowAdd = oParam.showAdd}
						if (oParam.attachmentType != undefined ) {iAttachmentType = oParam.attachmentType}
						if (oParam.xhtmlElementID != undefined ) {sXHTMLElementID = oParam.xhtmlElementID}
					}
					
					$('#' + sXHTMLElementID).html(ns1blankspace.xhtml.loading);
					
					if (iObjectContext != -1)
					{	
						var oSearch = new AdvancedSearch();
						oSearch.method = 'CORE_ATTACHMENT_SEARCH';
						oSearch.addField('type,filename,description,download,modifieddate,attachment');
						oSearch.addFilter('object', 'EQUAL_TO', iObject);
						oSearch.addFilter('objectcontext', 'EQUAL_TO', iObjectContext);
						oSearch.rows = ns1blankspace.option.defaultRows;
						
						if (iAttachmentType != undefined)
						{
							oSearch.addFilter('type', 'EQUAL_TO', iAttachmentType);
						}
						
						oSearch.sort('filename', 'asc');
						oSearch.getResults(function(data) {ns1blankspace.attachments.process(data, sXHTMLElementID)});
					}

				},

	process: 	function (oResponse, sXHTMLElementID)
				{	
					var aHTML = [];
						
					if (oResponse.data.rows.length === 0)
					{						
						$('#' + sXHTMLElementID).html('<div class="ns1blankspaceNothing">No attachments.</div>');
					}
					else
					{
						aHTML.push('<table id="ns1blankspaceAttachments">');
					
						$.each(oResponse.data.rows, function()
						{
							aHTML.push(ns1blankspace.attachments.row(this));
						});
				    	
						aHTML.push('</table>');

						ns1blankspace.render.page.show(
						{
						   	headerRow: false,
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
				
	row:		function (oRow)
				{
					var aHTML = [];
					
					aHTML.push('<tr class="ns1blankspaceAttachments">');
					
					aHTML.push('<td id="ns1blankspaceAttachment_filename-' + oRow.id + '" class="ns1blankspaceRow">' +
										'<a href="' + oRow.download + '">' + oRow.filename + '</a><br />');
										
					aHTML.push('<div class="ns1blankspaceSub">' + oRow.modifieddate + '</div></td>');
					
					aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">' +
									'<span id="ns1blankspaceAttachment_options_remove-' + oRow.attachment + 
									'" class="ns1blankspaceAttachmentsRemove">&nbsp;</span></td>');
					
					aHTML.push('</tr>');
					
					return aHTML.join('');
				},

	bind:		function ()
				{
					$('span.ns1blankspaceAttachmentsRemove:not("ui-button")').button({
								text: false,
								 icons: {
									 primary: "ui-icon-close"
						}
					})
					.click(function() {
						ns1blankspace.attachments.remove(this.id)
					})
					.css('width', '15px')
					.css('height', '20px')	
				},

	remove: 	function (sXHTMLElementID)
				{
					var aSearch = sXHTMLElementID.split('-');
					var sElementId = aSearch[0];
					var sSearchContext = aSearch[1];
					
					var sData = 'id=' + ns1blankspace.util.fs(sSearchContext) + '&remove=1';
								
					$.ajax(
						{
							type: 'POST',
							url: ns1blankspace.util.endpointURI('CORE_ATTACHMENT_MANAGE'),
							data: sData,
							dataType: 'json',
							success: function(data){$('#' + sXHTMLElementID).parent().parent().fadeOut(500)}
						});
				}
}

ns1blankspace.actions =
{
	show: 		function (oParam)
				{
					var sXHTMLElementContainerID = 'ns1blankspaceMainActions';
					var iObject = ns1blankspace.object;
					var iObjectContext = ns1blankspace.objectContext;
					var iType;
					var iContactBusiness;
					var iContactPerson;
					var sContactBusinessText;
					var sContactPersonText;
					
					if (oParam != undefined)
					{
						if (oParam.object != undefined) {iObject = oParam.object}
						if (oParam.objectContext != undefined) {iObjectContext = oParam.objectContext}
						if (oParam.objectName != undefined) {sObjectName = oParam.objectName}
						if (oParam.actionType != undefined ) {iType = oParam.actionType}
						if (oParam.type != undefined ) {iType = oParam.type}
						if (oParam.xhtmlElementContainerID != undefined ) {sXHTMLElementContainerID = oParam.xhtmlElementContainerID}
						if (oParam.contactBusiness != undefined) {iContactBusiness = oParam.contactBusiness}
						if (oParam.contactPerson != undefined) {iContactPerson = oParam.contactPerson}
						if (oParam.contactBusinessText != undefined) {sContactBusinessText = oParam.contactBusinessText}
						if (oParam.contactPersonText != undefined) {sContactPersonText = oParam.contactPersonText}
					}	
					else
					{
						oParam = {};
					}
					
					$('#' + sXHTMLElementContainerID).html(ns1blankspace.xhtml.loading);
					
					var aHTML = [];
					
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
						oSearch.getResults(function(data) {ns1blankspace.actions.process(oParam, data)});
					}
				},

	process: 	function (oParam, oResponse)
				{	
					var aHTML = [];
					var bShowDescription = false;
					var sXHTMLElementID = 'ns1blankspaceMainActions';
					
					if (oParam != undefined)
					{
						if (oParam.xhtmlElementID != undefined ) {sXHTMLElementID = oParam.xhtmlElementID}
						if (oParam.showDescription != undefined ) {bShowDescription = oParam.showDescription}
					}	

					if (oResponse.data.rows.length === 0)
					{						
						$('#' + sXHTMLElementID).html('<div class="ns1blankspaceNothing">No actions.</div>');
					}
					else
					{
						aHTML.push('<table id="ns1blankspaceActions" class="ns1blankspace">');

						$.each(oResponse.data.rows, function()
						{	
							aHTML.push(ns1blankspace.actions.row(this, oParam));
						});
				    	
						aHTML.push('</table>');
						
						ns1blankspace.render.page.show(
						{
							headerRow: false,
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

					$('#' + sXHTMLContainerID + ' .ns1blankspaceRowRemove').button({
						text: false,
						icons:
						{
							primary: "ui-icon-close"
						}
					})
					.click(function()
					{
						ns1blankspace.actions.remove({xhtmlElementID: this.id});
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
									oRow.subject + '');

					aHTML.push('<div class="ns1blankspaceSub">' + oRow.duedate + '</div>');

					aHTML.push('<div class="ns1blankspaceSub">' + oRow.actiontypetext + '</div></td>');
					
					if (bShowDescription)
					{
						aHTML.push('<td id="ns1blankspaceAction_description-' + oRow.id + '" class="ns1blankspaceRow">' +
										oRow.description + '</td>');
					}					
					
					aHTML.push('<td style="width:60px;text-align:right;" class="ns1blankspaceRow">' + 			
									'<span id="ns1blankspaceAction_options_remove-' + oRow.id + '" class="ns1blankspaceRowRemove"></span>' +	
									'</td>');

					aHTML.push('</tr>');

					return aHTML.join('');
				},

	remove:		function (oParam, oResponse)
				{
					var sXHTMLElementID;

					if (oParam != undefined)
					{
						if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
					}
					
					var aXHTMLElementID = sXHTMLElementID.split('-');
					var sID = aXHTMLElementID[1];
					
					if (oResponse === undefined)
					{	
						$.ajax(
						{
							type: 'POST',
							url: ns1blankspace.util.endpointURI('ACTION_MANAGE'),
							data: 'remove=1&id=' + sID,
							dataType: 'json',
							success: function(data){ns1blankspace.actions.remove(oParam, data)}
						});
					}	
					else
					{
						if (oResponse.status === 'OK')
						{
							$('#' + sXHTMLElementID).parent().parent().fadeOut(500);
						}	
					}	
					
				}
}