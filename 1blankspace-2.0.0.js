/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */

"use strict";

Function.prototype.method = function(name, func)
{
	if (!this.prototype[name])
	{
		this.prototype[name] = func;
		return this;
	}
};

Number.prototype.formatMoney = function(c, d, t)
{
	var n = this, c = isNaN(c = Math.abs(c)) ? 2 : c, d = d === undefined ? "," : d, t = t === undefined ? "." : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
   	return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};
 
String.prototype.formatXHTML = function(bDirection)
{
	var sValue = this;
	var aFind = [
		String.fromCharCode(8220), //“
		String.fromCharCode(8221), //”
		String.fromCharCode(8216), //‘
		String.fromCharCode(8217), //‘
		String.fromCharCode(8211), //–
		String.fromCharCode(8212), //—
		String.fromCharCode(189), //½
		String.fromCharCode(188), //¼
		String.fromCharCode(190), //¾
		String.fromCharCode(169), //©
		String.fromCharCode(174), //®
		String.fromCharCode(8230) //…
	];	

	var aReplace = [
		'"',
		'"',
		"'",
		"'",
		"-",
		"--",
		"1/2",
		"1/4",
		"3/4",
		"(C)",
		"(R)",
		"..."
	];

	if (bDirection)
	{
		sValue = sValue.replace(/\&/g,'&amp;');
		sValue = sValue.replace(/</g,'&lt;');
		sValue = sValue.replace(/>/g,'&gt;');
		sValue = sValue.replace(/-/g, '&#45;');
		sValue = sValue.replace(/@/g, '&#64;');
		sValue = sValue.replace(/\//g, '&#47;');
		sValue = sValue.replace(/"/g, '&quot;');
		sValue = sValue.replace(/\\/g, '&#39;');
	}
	else
	{
		sValue = sValue.replace(/\&amp;/g,'&');
		sValue = sValue.replace(/\&lt;/g,'<');
		sValue = sValue.replace(/\&gt;/g,'>');
		sValue = sValue.replace(/\&#45;/g, '-');
		sValue = sValue.replace(/\&#64;/g, '@');
		sValue = sValue.replace(/\&#47;/g, '/');
		sValue = sValue.replace(/\&quot;/g, '"');
		sValue = sValue.replace(/\&#39;/g, '\'');

		for ( var i = 0; i < aFind.length; i++ ) 
		{
			var regex = new RegExp(aFind[i], "gi");
			sValue = sValue.replace(regex, aReplace[i]);
		}
	}
	
	return sValue;
};

String.method('trim', function () {return this.replace(/^\s+|\s+$/g, '');});
String.method('parseCurrency', function () {var c = this; if (c == undefined || c == '') {c = '0'}; return parseFloat(c.replace(/,/g, ''));});

var ns1blankspace = {};

ns1blankspace.history = {};
ns1blankspace.xhtml = {};
ns1blankspace.option = {};
ns1blankspace.timer = {};
ns1blankspace.counter = {};
ns1blankspace.user = {};
ns1blankspace.data = {};
ns1blankspace.debug = {};

ns1blankspace.selector = 'body';

ns1blankspace.scripts =
[
	{
		nameSpace: '1blankspace.advancedsearch',
		source: '/jscripts/1blankspace.advancedsearch-2.0.0.js'
	}
]

window.onbeforeunload = function() 
{
	if (ns1blankspace.unloadWarning)
	{
	      return "You potentially will lose unsaved information if you close. Press Cancel to stop the close."
	}
}

$(function()
{
	ns1blankspace.app.init();

	if (window.location.hash === '#PASSWORDEXPIRED')
	{
		ns1blankspace.logon.changePassword.show();
	}
	else
	{
		ns1blankspace.app.start();
	}
});

ns1blankspace.app =
{
	loadScript: function (sScript)
				{
					var xhtmlHeadID = document.getElementsByTagName("head")[0]; 
					var oScript = document.createElement('script');
					oScript.type = 'text/javascript';
					oScript.src = sScript;
					xhtmlHeadID.appendChild(oScript);
				},

	init: 		function (oParam)
				{
					var bInitialise = true;

					if (oParam != undefined)
					{
						if (oParam.initialise != undefined) {bInitialise = oParam.initialise}
					}

					if ($('#ns1blankspaceContainer').length === 0)
					{
						$(ns1blankspace.selector).append('<div id="ns1blankspaceContainer">' +
											'<div id="ns1blankspaceHeader"></div>' +
											'<div id="ns1blankspaceViewControl"></div>' +
											'<div id="ns1blankspaceControl"></div>' +
											'<div id="ns1blankspaceMain"></div>' +
											'<div id="ns1blankspaceFooter"></div>' +
											'<div id="ns1blankspaceMultiUseContainer"></div>' +
											'</div>');
					}		

					if (!bInitialise)
					{
						$('#ns1blankspaceViewControl').html('<span style="font-size:1.3em; padding-left:6px; color: #999999;">Initialising the app...</span>');
						window.setTimeout('ns1blankspace.app.init({initialise: true})', 100);
					}
					else
					{	
						$.each(ns1blankspace.scripts, function()
						{
							if (this.source != '')
							{
								ns1blankspace.app.loadScript(this.source);
							}	
						});

						$('#ns1blankspaceHeader').html(ns1blankspace.xhtml.header);

						ns1blankspace.version = 2;

						ns1blankspace.option.showSpeed = 0;
						ns1blankspace.option.showSpeedOptions = 0;
						ns1blankspace.option.hideSpeed = 0;
						ns1blankspace.option.hideSpeedOptions = 0;
						ns1blankspace.option.typingWait = 400;
						ns1blankspace.option.logonStayOnDocument = true;
						ns1blankspace.option.setFocus = false;
						ns1blankspace.option.richTextEditing = true;
						ns1blankspace.option.setupURI = '/ondemand/setup/';
						ns1blankspace.option.dateFormat = 'dd M yy';

						ns1blankspace.timer.messaging = 0;
						ns1blankspace.timer.delay;

						ns1blankspace.setupViewport = false;
						ns1blankspace.inputDetected = false;
						ns1blankspace.unloadWarning = false;
						
						ns1blankspace.object = -1;
						ns1blankspace.objectName = '';
						ns1blankspace.objectContext = -1;
						ns1blankspace.objectContextData;
						ns1blankspace.objectContextSearch = '';

						ns1blankspace.okToSave = true;

						ns1blankspace.counter.editor = 0;

						ns1blankspace.xhtml.masterControl = '';
						ns1blankspace.xhtml.action = '';
						ns1blankspace.xhtml.home = '';
						ns1blankspace.xhtml.divID = '';
						ns1blankspace.xhtml.container = '#ns1blankspaceMultiUseContainer'

						ns1blankspace.user.commonname = '';
						ns1blankspace.user.email = '';
						ns1blankspace.user.networkGroups = '';
						ns1blankspace.user.id = -1;
						ns1blankspace.user.contactperson = -1;
						ns1blankspace.user.systemAdmin = false;
						ns1blankspace.setupShow = false;
						ns1blankspace.user.theme = 'Standard';

						ns1blankspace.data.searchSource = {text: 1, browse: 2, select: 3, all: 4}

						ns1blankspace.debug.appContext = 'start';

						ns1blankspace.param;

						ns1blankspace.history.viewList = ['ns1blankspace.home.show()']
						ns1blankspace.history.currentIndex = 0
						ns1blankspace.history.lastDestinationInstruction = '';
						ns1blankspace.history.list = [];

						ns1blankspace.user.networkGroups = '';
						ns1blankspace.setupShow = false;

						$.ajaxSetup(
						{
							cache: false,
							dataType: 'json',
							global: true,
							beforeSend: function (oRequest)
										{
					            			oRequest.setRequestHeader("X-HTTP-myds-rest-level", ns1blankspace.option.restLevel);
					        			}
						});

						$(document).ajaxError(function(oEvent, oXMLHTTPRequest, oAjaxOptions, oError) 
						{
							console.log('Error: ' + oAjaxOptions.url + ' \nException: ' + oError + ' \nReturned: ' + oXMLHTTPRequest.responseText);
							ns1blankspace.status.error('An error has occured');
						});	

						$(document).ajaxComplete(function(oEvent, oXMLHTTPResponse, oAjaxSettings)
						{
							ns1blankspace.ajaxSettings = undefined;

							if (oAjaxSettings.dataType == 'json')
							{	
								var oResponse = $.parseJSON(oXMLHTTPResponse.responseText);

								if (oResponse.status == 'ER')
								{
									if (oResponse.error.errornotes == 'Not logged on')
									{
										ns1blankspace.history.sendOnLogon = oAjaxSettings;
										ns1blankspace.app.start({message: 'You need to logon again.'});		
									}
									else if ((oResponse.error.errornotes).toLowerCase().indexOf('undefined') != -1)
									{
										ns1blankspace.status.error('There is an error with this app.');
									}	
									else
									{	
										ns1blankspace.status.error(oResponse.error.errornotes);
									}	
								}
							}
							else if (oAjaxSettings.dataType == 'text')
							{
								var aResponse = (oXMLHTTPResponse.responseText).split('|');

								if (aResponse[0] == 'ER')
								{
									if (aResponse[1] == 'Not logged on')
									{
										ns1blankspace.history.sendOnLogon = oAjaxSettings;
										ns1blankspace.app.start({message: 'You need to logon again.'});		
									}	
									else if ((aResponse[1]).toLowerCase().indexOf('undefined') != -1)
									{
										ns1blankspace.status.error('There is an error with this app.');
									}	
									else
									{	
										ns1blankspace.status.error(aResponse[1]);
									}	
								}
							}		
						});

						if (navigator.platform.indexOf('iPad') != -1 || navigator.platform.indexOf('iPhone') != -1) 
						{
							ns1blankspace.option.setFocus = false;
						}	 

						$('td.ns1blankspaceControl').live('click', function()
						{
							ns1blankspace.history.control({xhtmlElementID: this.id});
						});
						
						$('td.ns1blankspaceControl').live('mousedown', function() 
						{
							$('td.ns1blankspaceHighlight').removeClass('ns1blankspaceHighlight');
						});

						$('td.ns1blankspaceControl').live('mouseup', function() 
						{
							$(this).addClass('ns1blankspaceHighlight');
						});

						$('.ns1blankspaceWatermark').live('focus', function() 
						{
							if ($(this).hasClass('ns1blankspaceWatermark'))
							{
								$(this).val('');
								$(this).removeClass('ns1blankspaceWatermark');
							}	
						});		
							
						$('input.ns1blankspaceSelect').live('focusin', function() 
						{		
							$('input.ns1blankspaceHighlight').removeClass('ns1blankspaceHighlight');

							$(this).addClass('ns1blankspaceHighlight');
							
							ns1blankspace.xhtml.divID = this.id;
							
							$(ns1blankspace.xhtml.container).html('');
							$(ns1blankspace.xhtml.container).show();
							$(ns1blankspace.xhtml.container).offset(
							{ 
								top: $('#' + ns1blankspace.xhtml.divID).offset().top,
								left: $('#' + ns1blankspace.xhtml.divID).offset().left + $('#' + ns1blankspace.xhtml.divID).width() - 10
							});
									
							$(ns1blankspace.xhtml.container).html('<span id="ns1blankspaceSelectOptions" class="ns1blankspaceSelectOptions"></span>');
							
							$('#ns1blankspaceSelectOptions').button({
								text: false,
								icons: {
									primary: "ui-icon-triangle-1-s"
								}
							})
							.click(function() {
								ns1blankspace.search.show({xhtmlElementID: ns1blankspace.xhtml.divID, source: 4});
							})
							.css('width', '14px')
							.css('height', '21px')
						});
							
						$('input.ns1blankspaceSelect').live('keyup', function()
						{
							ns1blankspace.search.show({xhtmlElementID: ns1blankspace.xhtml.divID, source: 1, minimumLength: 3});	
						});	
						
						$('.ns1blankspaceSelectAddress').live('focusin', function() 
						{
							$('input.ns1blankspaceHighlight').removeClass('ns1blankspaceHighlight');

							$(this).addClass('ns1blankspaceHighlight');
							
							ns1blankspace.xhtml.divID = this.id;
							$(ns1blankspace.xhtml.container).html('');
							$(ns1blankspace.xhtml.container).show();
							$(ns1blankspace.xhtml.container).offset(
							{ 
								top: $('#' + ns1blankspace.xhtml.divID).offset().top,
								left: $('#' + ns1blankspace.xhtml.divID).offset().left + $('#' + ns1blankspace.xhtml.divID).width() - 10
							});
							//$(ns1blankspace.xhtml.container).offset({ top: $(this).offset().top, left: $(this).offset().left + $(this).width() - 10});
							$(ns1blankspace.xhtml.container).html('<span id="ns1blankspaceSelectOptions" class="ns1blankspaceSelectOptions"></span>');
							
							$('#ns1blankspaceSelectOptions').button( {
								text: false,
								icons: {
									primary: "ui-icon-triangle-1-s"
								}
							})
							.click(function() {
								ns1blankspace.search.address.show(ns1blankspace.xhtml.divID);
							})
							.css('width', '14px')
							.css('height', '21px')
						});
						
						$('input.ns1blankspaceSelectAddress').live('keyup', function()
						{
							ns1blankspace.search.address.show(ns1blankspace.xhtml.divID, {source: 1, minimumLength: 3});	
						});	
						
						$('.ns1blankspaceSelectAddress').live('keyup', function() 
						{
							$(ns1blankspace.xhtml.container).hide();
						});
						
						$('.ns1blankspaceSelectContact').live('keyup', function()
						{
							ns1blankspace.search.contact.show(ns1blankspace.xhtml.divID, 1, 3);	
						});	
						
						$('.ns1blankspaceSelectContact').live('focusin', function() 
						{
							ns1blankspace.xhtml.divID = this.id;
							$(ns1blankspace.xhtml.container).html('');
							$(ns1blankspace.xhtml.container).show();
							$(ns1blankspace.xhtml.container).offset({ top: $(this).offset().top, left: $(this).offset().left + $(this).width() - 10});
							$(ns1blankspace.xhtml.container).html('<span id="ns1blankspaceSelectOptions" class="ns1blankspaceSelectOptions"></span>');
							
							$('#ns1blankspaceSelectOptions').button( {
								text: false,
								icons: {
									primary: "ui-icon-triangle-1-s"
								}
							})
							.click(function() {
								ns1blankspace.search.contact.show(ns1blankspace.xhtml.divID, 4);
							})
							.css('width', '14px')
							.css('height', '21px')
						});
						
						$('.ns1blankspaceSelectContactEmail').live('focusin', function() 
						{
							ns1blankspace.xhtml.divID = this.id;
							$(ns1blankspace.xhtml.container).html('');
							$(ns1blankspace.xhtml.container).show();
							$(ns1blankspace.xhtml.container).offset({ top: $(this).offset().top, left: $(this).offset().left + $(this).width()});
							$(ns1blankspace.xhtml.container).html('<span id="ns1blankspaceSelectOptions" class="ns1blankspaceSelectOptions"></span>');
							
							$('#ns1blankspaceSelectOptions').button( {
								text: false,
								icons: {
									primary: "ui-icon-triangle-1-s"
								}
							})
							.click(function() {
								ns1blankspace.contact.email.search(ns1blankspace.xhtml.divID, {
										source: 4, 
										emailOnly: true,
										contactBusiness: $('#' + ns1blankspace.xhtml.divID).attr('data-contactbusiness'),
										setXHTMLElementID: $(this).attr('data-setelementid')
										});
							})
							.css('width', '14px')
							.css('height', '21px')
						});
						
						$('.ns1blankspaceSelectContactEmail').live('keyup', function() 
						{
							if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
							
							var sFunction = "ns1blankspace.search.email.show(ns1blankspace.xhtml.divID, {" +
										"source: 1," +
										"emailOnly: true," +
										"contactBusiness: " + $(this).attr('data-contactbusiness') + "," +
										"setXHTMLElementID: '" + $(this).attr('data-setelementid') + "'});"
							
							ns1blankspace.timer.delayCurrent = setTimeout(sFunction, ns1blankspace.option.typingWait);
							
						});
						
						$('.ns1blankspaceOptionsClose').live('click', function() 
						{
							$(ns1blankspace.xhtml.container).slideUp(500);
							$(ns1blankspace.xhtml.container).attr('data-initiator', '');
						});
						
						$('.ns1blankspaceSearchHeaderPage').live('click', function() 
						{
							interfaceAuditSearchShowPage(this.id);
						}); //???
								
						$('input.ns1blankspaceText').live('focus', function() 
						{
							$(this).addClass('ns1blankspaceHighlight');
						});

						$('input.ns1blankspaceText').live('keyup', function() 
						{
							ns1blankspace.inputDetected = true;
						});
							
						$('input.ns1blankspaceText').live('blur', function() 
						{
							$(this).removeClass('ns1blankspaceHighlight');
						});

						$('input.ns1blankspaceDate').live('focus', function() 
						{
							$(this).addClass('ns1blankspaceHighlight');
						});

						$('input.ns1blankspaceDate').live('blur', function() 
						{
							$(this).removeClass('ns1blankspaceHighlight');
						});

						$('.ns1blankspaceTextMulti').live('focus', function()
						{
							$(this).addClass('ns1blankspaceHighlight');
						});

						$('.ns1blankspaceTextMulti').live('blur', function() 
						{
							$(this).removeClass('ns1blankspaceHighlight');
						});
					}	
				},
							
	start: 		function (oParam)
				{
					if (oParam == undefined) {oParam = {}}
					$.ajax(
					{
						type: 'GET',
						url: ns1blankspace.util.endpointURI('CORE_GET_USER_DETAILS'),
						dataType: 'json',
						cache: false,
						global: false,
						success: function(data) 
						{
							$('#ns1blankspaceViewControl').html('&nbsp;');
							$('#ns1blankspaceMain').html('');
							$('#ns1blankspaceControl').html('');
							$('#ns1blankspaceLogonName').html('&nbsp;')
							$('#ns1blankspaceLogonName').unbind('click');
							$('#ns1blankspaceSpaceText').html('&nbsp;')
							$('#ns1blankspaceSpaceText').unbind('click');

							if (data.status === 'ER')
							{
								if (data.error.errornotes == 'No rights (No Access to method)')
								{
									oParam.message = 'You do not have any access rights to this space.';		
								}

								ns1blankspace.logon.show(oParam);
							}
							else
							{
								ns1blankspace.app.show(data);
							}	
						}
					});
				},

	show: 		function (oResponse)	
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
							sDestination = 'ns1blankspace' + sNS + '.init({id:' + aHash[2] + '})';
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

					var aHTML = [];

					ns1blankspace.user.id = oResponse.user;
					ns1blankspace.user.unrestricted = (oResponse.unrestrictedaccess == 'Y' || oResponse.unrestrictedaccess === undefined ? true : false);
					ns1blankspace.user.space = oResponse.space;
					ns1blankspace.user.spaceText = oResponse.spacename
					ns1blankspace.user.logonName = oResponse.userlogonname;
					ns1blankspace.user.contactPerson = oResponse.contactperson;
					ns1blankspace.user.contactBusiness = oResponse.contactbusiness;
					ns1blankspace.user.email = oResponse.email;
					ns1blankspace.user.systemAdmin = oResponse.systemadmin;
					ns1blankspace.user.roles = oResponse.roles.rows;

					ns1blankspace.spaceText = oResponse.spacename;
					ns1blankspace.space = oResponse.space;
					
					ns1blankspace.unloadWarning = true;

					ns1blankspace.setupShow = ns1blankspace.user.systemAdmin;

					ns1blankspace.control.init();
											
					$('#ns1blankspaceSpaceText').html(ns1blankspace.spaceText);
					$('#ns1blankspaceLogonName').html(ns1blankspace.user.logonName);

					aHTML.push('<div id="ns1blankspaceViewControlHomeContainer">' +
									'<span id="ns1blankspaceViewControlHome">&nbsp;</span>' +
									'<span id="ns1blankspaceViewControlHomeOptions">&nbsp;</span>' +
									'</div>');
									
					aHTML.push('<div id="ns1blankspaceViewControlHistoryContainer">' +
									'<span id="ns1blankspaceViewControlBack" >&nbsp;</span>' +
									'<span id="ns1blankspaceViewControlRefresh">&nbsp;</span>' +
									'<span id="ns1blankspaceViewControlForward">&nbsp;</span>' +
									'</div>');				
							
					aHTML.push('<div id="ns1blankspaceViewControlViewContainer">' +
									'<span id="ns1blankspaceViewControlView">&nbsp;</span>' +
									'</div>');
									
					aHTML.push('<div id="ns1blankspaceViewControlSearchContainer">' +
									'<input id="ns1blankspaceViewControlSearch">' +
									'</div>');
									
					aHTML.push('<div id="ns1blankspaceViewControlSearchStatus"></div>');
									
					aHTML.push('<div id="ns1blankspaceViewControlNewContainer">' +
									'<span id="ns1blankspaceViewControlNew">New</span>' +
									'</div>');
									
					aHTML.push('<div id="ns1blankspaceViewControlActionContainer">' +
									'<span id="ns1blankspaceViewControlAction" ></span>' +
									'<span id="ns1blankspaceViewControlActionOptions">&nbsp;</span>' +
									'</div>');
					
					aHTML.push('<div id="ns1blankspaceViewControlActionStatus">&nbsp;</div>');
					
					if (ns1blankspace.setupShow) 
					{
						aHTML.push('<div id="ns1blankspaceViewControlSetupContainer">' +
										'<input type="checkbox" id="ns1blankspaceViewControlSetup"/>' +
										'<label for="ns1blankspaceViewControlSetup">&nbsp;</label>' +
										'</div>');
					}				
					
					aHTML.push('<div id="ns1blankspaceViewControlHelpContainer">' + 
									'<span id="ns1blankspaceViewControlHelp">&nbsp;</span>' +
									'</div>');
					
					$('#ns1blankspaceViewControl').html(aHTML.join(''));

					if (!ns1blankspace.setupShow) 
					{
						$('#ns1blankspaceViewControlActionStatus')
							.css('width', '215px');
					}	

					$('#ns1blankspaceViewControlHome')
						.button({
								text: false,
								icons: {
									primary: "ui-icon-home"
								}})
						.click(function(event)
						{
							ns1blankspace.home.show();
						})
								
						.next()
							.button( {
								text: false,
								icons: {
									primary: "ui-icon-triangle-1-s"
								}
							})
							.click(function() {
								ns1blankspace.home.options.show(this);
							})
							.css('width', '12px')
							.css('margin-left', '2px')
							.parent()
								.buttonset();
					
					$('#ns1blankspaceViewControlBack')
						.button({
								text: false,
								icons: {}
								})
						.click(function(event)
						{
							ns1blankspace.history.view({instruction: 2});
						})
						.css('width', '19px')
						.next()
							.button( {
								text: false,
								icons: {
									primary: "ui-icon-arrowrefresh-1-e"
								}
							})
							.click(function() {
								ns1blankspace.history.view({instruction: 7});
							})
							.css('width', '25px')
							.css('margin-left', '2px')
						.next()
							.button( {
								text: false,
								icons: {}
							})
							.click(function() {
								ns1blankspace.history.view({instruction: 3});
							})
							.css('width', '19px')
							.css('margin-left', '2px')
							.parent()
								.buttonset();
					
					$('#ns1blankspaceViewControlViewContainer')
						.button(
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
					
					$('#ns1blankspaceViewControlNew')
						.button({
								label: "New"
								})
							
						.next()
							.button( {
								text: false,
								icons: {
									primary: "ui-icon-triangle-1-s"
								}
							})
							.css('width', '12px')
							.parent()
								.buttonset();
					
					$('#ns1blankspaceViewControlAction')
						.button({
								label: "Save"
								})
										
						.next()
							.button( {
								text: false,
								icons: {
									primary: "ui-icon-triangle-1-s"
								}
							})
							.css('width', '12px')
							.css('margin-left', '2px')
							.parent()
								.buttonset();	
														
					$('#ns1blankspaceViewControlSetup')
						.button({
									text: false,
									label: 'Set up your space.  Once finished click on this icon again.',
									icons: {
										primary: "ui-icon-gear"
									}})
						.css('font-size', '0.75em')			
						.click(function() 
						{
							ns1blankspace.setup.switch();
						});	
					
					$('#ns1blankspaceViewControlHelp')
						.button({
								text: false,
								icons: {
									primary: "ui-icon-help"
								}})
						.click(function() 
						{
							if (ns1blankspace.option.helpURI)
							{	
								window.open(ns1blankspace.option.helpURI);
							}
							else
							{
								window.alert('No help available.  May be search the internet?')
							}	
						});		
					
					$('#ns1blankspaceLogonName').click(function(event)
					{
						ns1blankspace.control.user.show(this);
					});

					$('#ns1blankspaceSpaceText').click(function(event)
					{
						ns1blankspace.control.spaces.show(this);
					});
					
					//if (ns1blankspace.option.showBrowsing)
					//{
						//$('#ns1blankspaceViewControlBrowse').html(ns1blankspaceViewportBrowse());
					//}
					//else
					//{
						$('#ns1blankspaceViewControlBrowse')
							.css('height', '1px')
							.css('border-width', '0px');
							
						//$('#ns1blankspaceViewControl')
						//	.css('top', '90px');
							
						//$('#ns1blankspaceViewControl')
						//	.css('top', '90px');
					//}
					
					$("#ns1blankspaceHeader").touchwipe({
							wipeLeft: function() {ns1blankspace.history.view({instruction: 3});},
							wipeRight: function() {ns1blankspace.history.view({instruction: 2});},
							min_move_x: 35,
							min_move_y: 35,
							preventDefaultEvents: true
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
				},

	scriptLoaded:

				function (sNamespace)
				{
					if (ns1blankspace[sNamespace])
					{
						return true
					}	
				},

	showWhenLoaded:
			
				function (sNamespace)
				{
					if (ns1blankspace.timer.whenLoaded === undefined)
					{	
						ns1blankspace.timer.whenLoaded = window.setInterval('ns1blankspace.app.showWhenLoaded("' + sNamespace + '")', 100);
					}
					else
					{	
						if (ns1blankspace[sNamespace])
						{
							window.clearInterval(ns1blankspace.timer.whenLoaded);
							ns1blankspace[sNamespace].show()
						}	
					}	
				},		

	reset:		function ()
				{				
					$(ns1blankspace.xhtml.container).hide(500);
					$('#ns1blankspaceViewControlSearch').unbind('keyup');
					$('#ns1blankspaceViewControlSearch').unbind('click');
					$('#ns1blankspaceViewControlSearch').unbind('click');
					$('#ns1blankspaceViewControlSearchOptions').unbind('click');
					$('#ns1blankspaceViewControlNew').unbind('click');
					$('#ns1blankspaceViewControlNewOptions').unbind('click');
					$('#ns1blankspaceViewControlAction').unbind('click');
					$('#ns1blankspaceViewControlActionOptions').unbind('click');
					$('#ns1blankspaceViewControlSetupOptions').unbind('click');
					$('#nns1blankspaceViewControlHelp').unbind('click');
					$('#ns1blankspaceViewControlHelpOptions').unbind('click');
					$('td.ns1blankspaceViewControlBrowse').unbind('click');
					$('td.ns1blankspaceViewControlBrowseAll').unbind('click');
					$('#ns1blankspaceViewControlActionStatus').text('');
					if (ns1blankspace.timer.messaging != 0) {clearInterval(ns1blankspace.timer.messaging)};
					ns1blankspace.inputDetected = false;
					ns1blankspace.xhtml.action = '';
					ns1blankspace.object = undefined;
					ns1blankspace.objectParentName = undefined;
					ns1blankspace.objectName = undefined;
					ns1blankspace.objectMethod = undefined;
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.viewName = undefined;
					ns1blankspace.viewOptionsBind = undefined;
				},

	refresh: 	function (oParam)
				{
					var sParentNamespace = ns1blankspace.objectParentName;
					var sNamespace = ns1blankspace.objectName;
					var oRoot = ns1blankspace.util.getParam(oParam, 'rootnamespace', {default: ns1blankspace}).value
							
					if (oParam != undefined)
					{
						if (oParam.namespace != undefined) {sNamespace = oParam.namespace}
						if (oParam.parentNamespace != undefined) {sParentNamespace = oParam.parentNamespace}
					}	

					if (sNamespace)
					{
						if (sParentNamespace)
						{
							var oNS = oRoot[sParentNamespace][sNamespace];
						}
						else
						{
							var oNS = oRoot[sNamespace];
						}

						if (oNS.init)
						{
							oNS.init();
						}
						else
						{
							ns1blankspace.home.show();
						}
					}	
				},		

	set: 		function (oParam)
				{
					var bShowHome = true;
					var sParentNamespace = ns1blankspace.objectParentName;
					var sNamespace = ns1blankspace.objectName;
					var bNew;
					var iID;
					var bExtendInit = false;
					var oRoot = ns1blankspace.util.getParam(oParam, 'rootNamespace', {default: ns1blankspace}).value
					var sRoot = ns1blankspace.util.getParam(oParam, 'rootNameSpaceText', {default: 'ns1blankspace'}).value

					if (oParam != undefined)
					{
						if (oParam.namespace != undefined) {sNamespace = oParam.namespace}
						if (oParam.parentNamespace != undefined) {sParentNamespace = oParam.parentNamespace}
						if (oParam.showHome != undefined) {bShowHome = oParam.showHome}	
						if (oParam.new != undefined) {bNew = oParam.new}
						if (oParam.id != undefined) {iID = oParam.id}
						if (oParam.extendInit != undefined) {bExtendInit = oParam.extendInit}
					}	

					if (iID) {bShowHome = false}

					if (!bExtendInit)
					{	
						ns1blankspace.extend.init(oParam);
					}
					else
					{	

						if (sNamespace)
						{
							if (sParentNamespace)
							{
								var oNS = oRoot[sParentNamespace][sNamespace];
								var sNS = sRoot + '["' + sParentNamespace + '"]["' + sNamespace + '"]';
							}
							else
							{
								var oNS = oRoot[sNamespace];
								var sNS = sRoot + '["' + sNamespace + '"]';
							}

							if (bShowHome)
							{
								ns1blankspace.history.view({
									newDestination: sNS + '.init({showHome: true});',
									move: false
									});	
							}
							
							$('#ns1blankspaceViewControlViewContainer').button(
							{
								label: ns1blankspace.viewName
							});
							
							$('#ns1blankspaceViewControlSearch').keyup(function(event)
							{
								if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
						        ns1blankspace.timer.delayCurrent = setTimeout(sNS + '.search.send("ns1blankspaceViewControlSearch")', ns1blankspace.option.typingWait);
							});
							
							$('#ns1blankspaceViewControlSearch').focusin(function(event)
							{
								ns1blankspace.search.advanced();
							});
							
							$("#ns1blankspaceViewControlSearch").click(function()
							{
							    this.select();
							});

							$('#ns1blankspaceViewControlSearchOptions').click(function(event)
							{
								oNS.search.options.show();
							});
							
							$('#ns1blankspaceViewControlNew').click(function(event)
							{
								oNS.init({new: true});
							});
							
							$('#ns1blankspaceViewControlNew').button({disabled: false});

							$('#ns1blankspaceViewControlNewOptions').click(function(event)
							{
								oNS.new.options();
							});
							
							$('#ns1blankspaceViewControlAction').click(function(event)
							{
								oNS.save.send();
							});
							
							$('#ns1blankspaceViewControlAction').button({disabled: true});
							
							$('#ns1blankspaceViewControlActionOptions').click(function(event)
							{
								ns1blankspace.app.options.show($.extend(true, oParam,
								{
									element: this,
									xhtml: undefined,
									namespace: oNS,
									namespaceText: sNS
								}));
							});
							
							$('#ns1blankspaceViewControlActionOptions').button({disabled: true});
								
							$('#ns1blankspaceControl').html('');	

							if (ns1blankspace.option.setFocus) {$('#ns1blankspaceViewControlSearch').focus()};

							if (bNew) 
							{
								ns1blankspace.objectContextData = undefined
								ns1blankspace.objectContext = -1;
								$('#ns1blankspaceViewControlAction').button({disabled: false});
								if (typeof(oNS.layout) === 'function') {oNS.layout()}
								ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
								if (typeof(oNS.details) === 'function') {oNS.details()} else {oNS.home.show()}
							}
							else
							{
								if (iID)
								{	
									oNS.search.send('-' + iID);
								}
								else
								{	
									if (bShowHome) 
									{
										ns1blankspace.history.view({
											newDestination: sNS + '.init({showHome: true});',
											move: false
											});	

										if (typeof(oNS.home) === 'function') {oNS.home()} else {oNS.home.show()}
									}
								}		
							}
						}	
					}	
				},

	options: 	{
					show: 		function (oParam)
								{
									var oElement;
									var sXHTML;
									var fBind = ns1blankspace.viewOptionsBind;

									if (oParam != undefined)
									{
										if (oParam.element != undefined) {oElement = oParam.element}
										if (oParam.xhtml != undefined) {sXHTML = oParam.xhtml}
										if (oParam.bind != undefined) {fBind = oParam.bind}	
									}		

									if (sXHTML === undefined)
									{
										sXHTML = '<table id="ns1blankspaceOptions" class="ns1blankspaceViewControlContainer">' +	
													'<tr class="ns1blankspaceOptions">' +
													'<td id="ns1blankspaceControlActionOptionsRemove" class="ns1blankspaceViewControl">' +
													'Delete' +
													'</td></tr></table>';
									}	

									if ($(ns1blankspace.xhtml.container).attr('data-initiator') === oElement.id)
									{
										$(ns1blankspace.xhtml.container).hide();
										$(ns1blankspace.xhtml.container).attr('data-initiator', '');
									}
									else
									{	
										$(ns1blankspace.xhtml.container).attr('data-initiator', oElement.id)
																		.html("&nbsp;")
																		.show()
																		.offset({ top: $(oElement).offset().top + $(oElement).height(), left: $(oElement).offset().left })
																		.html(sXHTML);
										
										if (fBind != undefined)
											{fBind()}
										else
										{
											ns1blankspace.app.options.bind(oParam);
										}
									
									}	
								},

					bind: 		function (oParam)
								{
									$('#ns1blankspaceControlActionOptionsRemove')
									.click(function() 
									{
										ns1blankspace.app.options.remove(oParam)
									});
								},

					hide: 		function (oParam)
								{
									$(ns1blankspace.xhtml.container).hide();
									$(ns1blankspace.xhtml.container).attr('data-initiator', '');
								},

					remove: 	function (oParam, oResponse)
								{		
									var oNS;

									if (oParam != undefined)
									{
										if (oParam.namespace != undefined) {oNS = oParam.namespace}
									}	

									var sMethod = ns1blankspace.objectMethod;

									if (sMethod === undefined)
									{
										var sMethod = ns1blankspace.objectMethod;

										var sParentNamespace = ns1blankspace.objectParentName;
										var sNamespace = ns1blankspace.objectName;

										if (sMethod === undefined)
										{	
											if (sParentNamespace)
											{
												sMethod = (sParentNamespace).toUpperCase() + '_' + (sNamespace).toUpperCase();
											}
											else
											{
												sMethod = (sNamespace).toUpperCase();
											}
										}	
									}	

									if (oResponse === undefined && sMethod)
									{
										sMethod += '_MANAGE';

										$('#ns1blankspaceControlActionOptionsRemove').html(ns1blankspace.xhtml.loadingSmall);

										$.ajax(
										{
											type: 'POST',
											url: ns1blankspace.util.endpointURI(sMethod),
											data: 'remove=1&id=' + ns1blankspace.objectContext,
											dataType: 'json',
											success: function(data){ns1blankspace.app.options.remove(oParam, data)}
										});

									}
									else if (oResponse != undefined)
									{
										if (oResponse.notes === 'REMOVED')
										{
											ns1blankspace.inputDetected = false;
											ns1blankspace.app.options.hide();
											oNS.init();
											ns1blankspace.status.message("Deleted");
										}
										else
										{
											$('#ns1blankspaceControlActionOptionsRemove').html(oResponse.error.errornotes)
										}
									}	
									else
									{
										ns1blankspace.app.options.hide();
										ns1blankspace.status.error('Cannot delete!')
									}	
								}							
				}										
}

ns1blankspace.logon = 
{
	show: 		function (oParam)
				{
					var aHTML = [];
					var h = -1;
					var sXHTMLElementID = '#ns1blankspaceViewControl';
					var sMessage = '';
					
					if (oParam != undefined)
					{
						if (oParam.objectContext != undefined) {iObjectContext = oParam.objectContext}
						if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
						if (oParam.message != undefined) {sMessage = oParam.message}
					}	
						
					aHTML.push('<table id="ns1blankspaceLogonContainer" style="width:700px;">');
					
					aHTML.push('<tr><td style="width:235px; padding-right:25px;">');

					aHTML.push('<table id="ns1blankspaceLogon" class="ns1blankspaceLogonContainer">');

					aHTML.push('<tr>' +
									'<td class="ns1blankspaceLogonCaption">' +
									'Logon Name' +
									'</td>')

					aHTML.push('<td class="ns1blankspaceLogonSub" style="padding-right:2px;">' +
									'remember <input style="margin:0px; padding:0px; border: 0px;" type="checkbox" id="ns1blankspaceLogonRemember"/></td></tr>');

					aHTML.push('<tr><td colspan=2 style="padding-bottom: 10px;">' +
									'<input id="ns1blankspaceLogonLogonName" class="ns1blankspaceLogon">' +
									'</td></tr>');
									
					aHTML.push('<tr>' +
									'<td class="ns1blankspaceLogonCaption">' +
									'Password' +
									'</td>')

					aHTML.push('<td class="ns1blankspaceLogonSub" style="padding-right:2px;">' +
									'<span id="ns1blankspacePasswordSend" style="cursor: pointer;">get it</span>' +
									'</td></tr>');

					aHTML.push('<tr><td class="ns1blankspaceLogonText" colspan=2 style="padding-bottom: 15px;">' +
									'<input id="ns1blankspaceLogonPassword" class="ns1blankspaceLogon" type="password">' +
									'</td></tr>');

					aHTML.push('<tr>' +
								'<td class="ns1blankspaceLogon" style="width:110px">' +
								'<span id="ns1blankspaceLogonSend">Logon</span>' +
								'</td>');
				
					aHTML.push('<td id="ns1blankspaceLogonStatus" style="vertical-align:middle;">' +
								'&nbsp;' +
								'</td></tr>');

					if (sMessage != '')
					{
						aHTML.push('<tr><td class="ns1blankspaceSub" colspan=2 style="padding-top: 15px;">' +
									sMessage + '</td></tr>');
					}	

					aHTML.push('</table>');					
					
					if (ns1blankspace.xhtml.logonNotes)
					{	
						aHTML.push('</td><td class="ns1blankspaceLogonNotes">');
					
						aHTML.push('<table class="ns1blankspace"><tr><td>' +
										ns1blankspace.xhtml.logonNotes +
										'</td></tr></table>');
					}				

					aHTML.push('</td></tr></table>');
					
					$('#ns1blankspaceMain').html('');
					$('#ns1blankspaceControl').html('');

					ns1blankspace.container.show(
										{
											xhtmlElementID: 'ns1blankspaceViewControl',
											xhtml: aHTML.join(''),
											forceShow: true,
											offsetTop: -15
										});	

					var sLogonName = $.cookie('mydigitalstucturelogonname')
					
					if (sLogonName != '' && sLogonName != null)
					{
						$('#ns1blankspaceLogonLogonName').val(sLogonName);
						$('#ns1blankspaceLogonRemember').attr('checked', true);
						$('#ns1blankspaceLogonPassword').focus();
					}
					else
					{
						$('#ns1blankspaceLogonLogonName').focus();
					}
					
					$('#ns1blankspaceLogonSend').button(
					{
						label: "Logon"
					})
					.click(function() 
					{
						ns1blankspace.logon.send();
					});	

					$('#ns1blankspaceLogonLogonName').keypress(function(e)
					{
					    if (e.which === 13)
					    {
					        ns1blankspace.logon.send();
					    }
					});

					$('#ns1blankspaceLogonPassword').keypress(function(e)
					{
					    if (e.which === 13)
					    {
					        ns1blankspace.logon.send();
					    }
					});

					$('#ns1blankspacePasswordSend').click(function()
					{
						ns1blankspace.logon.getPassword.show();
					});
				},

	send: 		function ()
				{
					var sData = 'logon=' + ns1blankspace.util.fs($('#ns1blankspaceLogonLogonName').val()) +
								'&password=' + ns1blankspace.util.fs($('#ns1blankspaceLogonPassword').val());

					$('#ns1blankspaceLogonStatus').html(ns1blankspace.xhtml.loading);
					
					$.ajax(
					{
						type: 'POST',
						url: '/ondemand/logon/',
						data: sData,
						dataType: 'json',
						success: this.process
					})
				},

	process: 	function (oResponse)	
				{		
					if (oResponse.status === 'ER')
					{
						$('#ns1blankspaceLogonStatus').html('Logon name or password is incorrect.');
						$('#ns1blankspaceContainer').effect("shake", { times:2 }, 100);
					}
					else 
					{
						$('#ns1blankspaceLogonStatus').html('Logon successful, starting app...');
						
						if ($('#ns1blankspaceLogonRemember').attr('checked'))
						{
							$.cookie('mydigitalstucturelogonname', $('#ns1blankspaceLogonLogonName').val(), {expires:30});
						}
						
						if (oResponse.passwordStatus === "EXPIRED")
						{
							ns1blankspace.logon.changePassword.show(); 
						}
						else
						{	
							if (oResponse.url === '#' || ns1blankspace.option.logonStayOnDocument)
							{
								//document.location.reload(false);
								ns1blankspace.container.hide();
								ns1blankspace.app.start();
							}	
							else
							{
								document.location.href = oResponse.url;
							}
						}
					}
				}
}

ns1blankspace.logon.changePassword = 
{
	show: 	function (oParam)
				{
					var aHTML = [];
					var h = -1;
					var sXHTMLElementID = 'ns1blankspaceViewControl';
					
					if (oParam != undefined)
					{
						if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
					}	
					
					aHTML.push('<table id="ns1blankspaceLogonChangePasswordContainer" class="ns1blankspaceViewControlContainer">');
					
					aHTML.push('<tr>' +
									'<td class="ns1blankspaceLogonCaption">' +
									'Current Password' +
									'</td></tr>' +
									'<tr><td class="ns1blankspaceLogonInput">' +
									'<input id="ns1blankspaceLogonCurrentPassword" class="ns1blankspaceLogon" type="password">' +
									'</td></tr>');
									
					aHTML.push('<tr>' +
									'<td class="ns1blankspaceLogonCaption">' +
									'New Password' +
									'</td></tr>' +
									'<tr><td class="ns1blankspaceLogonInput">' +
									'<input id="ns1blankspaceLogonNewPassword" class="ns1blankspaceLogon" type="password">' +
									'</td></tr>');

					aHTML.push('<tr class="ns1blankspaceLogon">' +
									'<td class="ns1blankspaceLogonCaption">' +
									'Confirm Password' +
									'</td></tr>' +
									'<tr><td class="ns1blankspaceLogonInput">' +
									'<input id="ns1blankspaceLogonNewPasswordConfirm" class="ns1blankspaceLogon" type="password">' +
									'</td></tr>');
									
					aHTML.push('<tr class="ns1blankspaceLogon">' +
									'<td class="ns1blankspaceLogon">' +
									'<span id="ns1blankspaceLogonChangePassword" class="ns1blankspaceAction">Change Password</span>' +
									'</td></tr>');
									
					aHTML.push('<tr class="ns1blankspaceLogon">' +
									'<td id="ns1blankspaceLogonChangePasswordStatus" class="ns1blankspaceLogon" colspan=2>' +
									'&nbsp;' +
									'</td></tr>');
									
					aHTML.push('</table>');					
					
					ns1blankspace.container.show(
										{
											xhtmlElementID: sXHTMLElementID,
											xhtml: aHTML.join(''),
											forceShow: true,
											offsetTop: -3,
											offsetLeft: 24
										});	
					
					$('#ns1blankspaceLogonCurrentPassword').focus();
					
					$('#ns1blankspaceLogonChangePassword').button(
					{
						label: "Change Password"
					})
					.click(function()
					{
						ns1blankspace.logon.changePassword.send();
					});	
					
					$('#' + sXHTMLElementID).show(ns1blankspace.option.showSpeed);
				},

	send: 		function() 
				{		
					var sNewPassword = $('#ns1blankspaceLogonNewPassword').val();
					var sNewPasswordConfirm = $('#ns1blankspaceLogonNewPasswordConfirm').val();

					if (sNewPassword != sNewPasswordConfirm)
					{
						$('#ns1blankspaceLogonChangePasswordStatus').html('New passwords do not match.');
					}

					else if (sNewPassword === '')
					{
						$('#ns1blankspaceLogonChangePasswordStatus').html('New password can not be blank.');
					}
					else
					{
						$('#ns1blankspaceLogonChangePasswordStatus').html('Updating password...');
						
						var sCurrentPassword = $('#ns1blankspaceLogonCurrentPassword').val();

						var sData = 'expiredays=36500' +
										'&site=1533' +
										'&currentpassword=' + sCurrentPassword + 
										'&newpassword=' + sNewPassword +
										'&newpasswordconfirm=' + sNewPasswordConfirm;
						
						$.ajax(
						{
							type: 'POST',
							url: ns1blankspace.util.endpointURI('SITE_USER_PASSWORD_MANAGE'),
							data: sData,
							dataType: 'json',
							success: this.process
						});
					}	
				},

	process: 	function (oResponse)
				{	
					if (oResponse.status === 'ER') 
					{
						if (oResponse.error.errornotes === 'PASSWORD_LESS_THAN_6_CHAR') 
						{
							$('#ns1blankspaceLogonChangePasswordStatus').html('New password needs to be at least 6 characters.');
						}
						else
						{
							$('#ns1blankspaceLogonChangePasswordStatus').html('Incorrect current password or you are not logged on.');
						}
					}
					else
					{
						$('#ns1blankspaceLogonChangePasswordStatus').html('Password changed!');
					
						if (oResponse.url === '#' || ns1blankspace.option.logonStayOnDocument)
						{
							window.location.hash = '';
							document.location.reload(false);
						}	
						else
						{
							document.location.href = aReturn[2];
						}
					}
				}
}				

ns1blankspace.logon.getPassword = 
{
	show: 		function ()
				{
					var aHTML = [];

					aHTML.push('<table class="ns1blankspace">');
					
					aHTML.push('<tr class="ns1blankspaceLogon">' +
									'<td class="ns1blankspaceLogonCaption">' +
									'Logon Name' +
									'</td></tr>' +
									'<tr><td class="ns1blankspaceLogon" style="padding-bottom:10px;">' +
									'<input id="ns1blankspaceGetPasswordLogonName" class="ns1blankspaceLogon">' +
									'</td></tr>');
									
					aHTML.push('<tr class="ns1blankspaceLogon">' +
									'<td class="ns1blankspaceLogon">' +
									'<span id="ns1blankspaceGetPassword" class="ns1blankspaceLogon ns1blankspaceAction">Send Password</span>' +
									'</td></tr>');
									
					aHTML.push('<tr class="ns1blankspaceLogon">' +
									'<td id="ns1blankspaceGetPasswordStatus" class="ns1blankspaceLogon" colspan=2>' +
									'&nbsp;' +
									'</td></tr>');
									
					aHTML.push('</table>');					
					
					ns1blankspace.container.show(
										{
											xhtmlElementID: 'ns1blankspaceViewControl',
											xhtml: aHTML.join(''),
											forceShow: true,
											offsetTop: -15
										});	
					
					$('#ns1blankspaceGetPasswordLogon').focus();
					
					$('#ns1blankspaceGetPassword').button(
					{
						label: "Get Password"
					})
					.click(function()
					{
						ns1blankspace.logon.getPassword.send();
					});	
					
					$('#div1blankspaceLogon').show(ns1blankspace.option.showSpeed); //?
				},

	send: 		function ()
				{	
					if ($('#ns1blankspaceGetPasswordLogonName').val() === '')
					{
						$('#ns1blankspaceGetPasswordStatus').html('Logon name is blank, please enter a logon name.');
					}
					else
					{
						$('#tns1blankspaceGetPasswordStatus').html('Sending password...');
										
						var sData = 'site=1533' +
										'&logon=' + $('#ns1blankspaceGetPasswordLogonName').val();	
						
						$.ajax(
						{
							type: 'POST',
							url: ns1blankspace.util.endpointURI('SITE_SEND_PASSWORD'),
							data: sData,
							dataType: 'json',
							success: this.process
						})
					}
				},

	process:	function (oResponse)
				{
					if (oResponse.status === 'OK')
					{
						$('#ns1blankspaceGetPasswordStatus').html('Your password has been emailed to you.');
					}
					else
					{
						$('#ns1blankspaceGetPasswordStatus').html('Can not find this logon name!');
					}
				}
}

ns1blankspace.logOff = function ()
				{
					$.ajax(
					{
						type: 'GET',
						async: false,
						url: ns1blankspace.util.endpointURI('CORE_LOGOFF'),
						dataType: 'json',
						global: false,
						success: function ()
						{
							if (!ns1blankspace.debug.enabled)
							{
								//ns1blankspace.inputDetected = false;
								//ns1blankspace.refresh();
								ns1blankspace.app.init();
								ns1blankspace.app.start();
							}
						}
					})	
				}

ns1blankspace.logOut = function ()
				{
					$.ajax(
					{
						type: 'GET',
						async: false,
						url: ns1blankspace.util.endpointURI('CORE_LOGOFF'),
						dataType: 'json',
						global: false,
						success: function ()
						{
							ns1blankspace.status.message('Logged out.')
						}
					})		
				}

ns1blankspace.refresh = function ()
				{
					document.location.reload(false);
				}

ns1blankspace.history.control =
				function (oParam)
				{
					var bGet = false;
					var iObject = ns1blankspace.object;
					var iObjectContext = ns1blankspace.objectContext;
					var sXHTMLElementID;
					var sFunctionDefault;
					
					if (oParam != undefined)
					{
						if (oParam.object != undefined) {iObject = oParam.object}
						if (oParam.objectContext != undefined) {iObjectContext = oParam.objectContext}
						if (oParam.functionDefault != undefined) {sFunctionDefault = oParam.functionDefault}
						if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
					}
					
					$.each(ns1blankspace.history.list, function(index, v) 
					{ 
						if (iObject && v)
						{	
							if ((v.object === iObject) && (v.objectContext === iObjectContext))
							{
								if (sFunctionDefault != undefined)
								{
									sXHTMLElementID = v.xhtmlElementID
								}
								else
								{
									ns1blankspace.history.list.splice(index,1)
								}	
							}
						}	
					});
					
					if (sFunctionDefault === undefined)
					{
						ns1blankspace.history.list.push(
							{
								object: iObject,
								objectContext: iObjectContext,
								xhtmlElementID: sXHTMLElementID
							}
						)
					}
					else
					{
						if (sXHTMLElementID === undefined)
						{
							eval(sFunctionDefault);
						}
						else
						{
							$('.ns1blankspaceControl').removeClass('ns1blankspaceHighlight')
							$('#' + sXHTMLElementID).addClass('ns1blankspaceHighlight')
							$('#' + sXHTMLElementID).click()
						}
					}
				}

ns1blankspace.history.view =
				function (oParam)
				{
					var sDestinationInstructions;
					var iInstruction = 1;
					var iInstructionCount = 1;
					var bContinue = true;
					var bMove = true;
					var bAdd = false;
					
					if (ns1blankspace.inputDetected)
					{
						 bContinue = confirm("You have edited this page.  Do you want to continue moving to the new page?")
					}	
							
					if (bContinue)
					{	
						ns1blankspace.inputDetected = false;
						
						if (oParam != undefined)
						{
							if (oParam.newDestination != undefined) {sDestinationInstructions = oParam.newDestination}
							if (oParam.instruction != undefined) {iInstruction = oParam.instruction}
							if (oParam.instructionCount != undefined) {iInstructionCount = oParam.instructionCount}
							if (oParam.index != undefined) {ns1blankspace.history.currentIndex = oParam.index}
							if (oParam.move != undefined) {bMove = oParam.move}
							
							if (iInstruction === 1 && sDestinationInstructions != undefined)
							{
								if (sDestinationInstructions === ns1blankspace.history.lastDestinationInstruction)
								{
									var aTmp = sDestinationInstructions.split(';');
									
									$.each(aTmp, function(index) 
									{ 
										if (this === '')
										{
											aTmp.splice(index,1)
										}
									});
									
									if (aTmp.length === 1) 
									{
										$.each(ns1blankspace.history.viewList, function(index) 
										{ 
											if (this === sDestinationInstructions)
											{
												ns1blankspace.history.viewList.splice(index,1)
												bAdd = true;
											}
										});
									}	
								}
								else
								{
									bAdd = true;
								}	
								
								if (bAdd)
								{
									ns1blankspace.history.viewList.push(sDestinationInstructions);
									ns1blankspace.history.currentIndex = ns1blankspace.history.viewList.length - 1;
									
									var sData = 'value=' + ns1blankspace.util.fs(ns1blankspace.history.viewList.slice(-2).join('|').toString()) +
													'&advanced=4';
									
									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('CORE_PROFILE_MANAGE'),
										data: sData,
										dataType: 'text'
									})
								}		
							}	
							
							if (iInstruction === 2)
							{
								ns1blankspace.history.currentIndex = ns1blankspace.history.currentIndex - iInstructionCount;
								if (ns1blankspace.history.currentIndex < 0) {ns1blankspace.history.currentIndex = 0}
							}
							
							if (iInstruction === 3)
							{
								ns1blankspace.history.currentIndex = ns1blankspace.history.currentIndex + iInstructionCount;
								if (ns1blankspace.history.currentIndex > ns1blankspace.history.viewList.length - 1) {ns1blankspace.history.currentIndex = ns1blankspace.history.viewList.length - 1}
							}
							
							if (iInstruction === 4)
							{
								ns1blankspace.history.viewList.length = 0;
								ns1blankspace.history.currentIndex = 0;
							}	
							
							if (iInstruction === 5)
							{
								ns1blankspace.history.currentIndex = ns1blankspace.history.viewList.length - 1;
							}	
							
							if (iInstruction === 6)
							{
								ns1blankspace.history.currentIndex = 0;
							}	
							
							if (iInstruction === 7)
							{
								//refresh
							}	
								
							if (iInstruction === 8)
							{
								$.ajax(
								{
									type: 'GET',
									url: ns1blankspace.util.endpointURI('CORE_PROFILE_SEARCH'),
									data: 'advanced=4&rf=TEXT',
									dataType: 'text',
									async: false,
									success: function(data) {
										data = data.replace('OK|RETURNED|', '')
										if (data === '')
										{
											ns1blankspace.history.viewList.push('ns1blankspace.home.show()');
										}	
										else
										{
											ns1blankspace.history.viewList = data.split('|');
											ns1blankspace.history.currentIndex = ns1blankspace.history.viewList.length - 1
										}	
									}
								})
							}		
								
							$('#ns1blankspaceViewControlBack').button("destroy");	
							$('#ns1blankspaceViewControlRefresh').button("destroy");	
							$('#ns1blankspaceViewControlForward').button("destroy");	
							
							var bBack = true;
							var bForward = true;
							
							if (ns1blankspace.history.currentIndex > 0)
							{	
								bBack = false;
							};
							
							if (ns1blankspace.history.currentIndex < ns1blankspace.history.viewList.length - 1)
							{
								bForward = false;					
							};			
					
							$('#ns1blankspaceViewControlBack')
								.button({
										text: false,
										icons: {primary: "ui-icon-triangle-1-w"},
										disabled: bBack
										})
								.next()
									.button( {
										text: false,
										icons: {
											primary: "ui-icon-arrowrefresh-1-e"
										}
									})
								.next()
									.button( {
										text: false,
										icons: {primary: "ui-icon-triangle-1-e"},
										disabled: bForward
									})
									.parent()
										.buttonset();
					
							$('#ns1blankspaceViewControlBack')
								.button({disabled: bBack})
					
							$('#s1blankspaceViewControlForward')
								.button({disabled: bForward})
					
							sDestinationInstructions = ns1blankspace.history.viewList[ns1blankspace.history.currentIndex]
							ns1blankspace.history.lastDestinationInstruction = sDestinationInstructions;
							
							if (bMove)
							{
								if (ns1blankspace.timer.history === undefined)
								{	
									ns1blankspace.timer.history = window.setInterval('ns1blankspace.history.view({instruction: 0, move: true})', 100);
								}
								else
								{	
									var aDestinationInstructions = sDestinationInstructions.split(';');
									var aDestination = (aDestinationInstructions[0]).split('(');

									if (aDestination[0])
									{
										window.clearInterval(ns1blankspace.timer.history);
										
										if (sDestinationInstructions != '' && sDestinationInstructions != undefined)
										{
											if ((sDestinationInstructions).indexOf('setup') != -1 && ns1blankspace.option.autoSetupSwitch)
											{
												ns1blankspace.setupView = false;
												$('#ns1blankspaceViewControlSetup').attr('checked', true);
												$('#ns1blankspaceViewControlSetup').button('refresh');
												ns1blankspace.setup.switch({viewScript: sDestinationInstructions});
											}
											else
											{	
												var aDestinationInstructions = sDestinationInstructions.split('.');

												if (eval(aDestinationInstructions[0]) != undefined)
												{	
													eval(sDestinationInstructions);
													//NEED TO CONVERT INSTUCTIONS TO USE NAMESPACE AND GET RID OF EVAL
												}
												else
												{
													ns1blankspace.home.show();
												}
											}	
										}
									}	
								}			
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
					}
					
					if (oActions.add)
					{
						var aHTML = [];
									
						aHTML.push('<table>' +
									'<tr>' +
									'<td id="ns1blankspaceAttachmentsColumn1" class="ns1blankspaceColumn1Flexixble">' +
									ns1blankspace.xhtml.loading +
									'</td>' +
									'<td id="ns1blankspaceAttachmentsColumn2" class="ns1blankspaceColumn2" style="width:100px;">' +
									'</td></tr>' +
									'</table>');					
							
						$('#' + sXHTMLElementID).html(aHTML.join(''));
						
						var aHTML = [];
						var h = -1;	
						
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
						.click(function() {
							 ns1blankspace.attachments.add(oParam);
						})
					
						sXHTMLElementID = 'ns1blankspaceAttachmentsColumn1';
					}
					
					if (iObjectContext != -1)
					{	
						var oSearch = new AdvancedSearch();
						oSearch.method = 'CORE_ATTACHMENT_SEARCH';
						oSearch.addField('type,filename,description,download,modifieddate,attachment');
						oSearch.addFilter('object', 'EQUAL_TO', iObject);
						oSearch.addFilter('objectcontext', 'EQUAL_TO', iObjectContext);
						
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
					var h = -1;
						
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
						aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>');
						aHTML.push('</tr>');

						$.each(oResponse.data.rows, function()
						{
							aHTML.push(ns1blankspace.attachments.row(this));
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
							functionNewPage: 'ns1blankspace.attachments.bind()',
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
										'<a href="' + oRow.download + '">' + oRow.filename + '</a></td>');
										
					aHTML.push('<td id="ns1blankspaceAttachment_date-' + oRow.id + '" class="ns1blankspaceRow">' + oRow.modifieddate + '</td>');
					
					aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">' +
									'<span id="ns1blankspaceAttachment_options_remove-' + oRow.attachment + 
									'" class="ns1blankspaceAttachmentsRemove">&nbsp;</span></td>');
					
					aHTML.push('</tr>');
					
					return aHTML.join('');
				},

	bind:		function ()
				{
					$('#ns1blankspaceAttachments .ns1blankspaceAttachmentsRemove').button({
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
									}	

									$('[name="ns1blankspaceFileUpload"]').remove();

									aHTML.push('<form name="ns1blankspaceFileUpload" action="/ondemand/attach/" ' +
													'enctype="multipart/form-data" method="POST" target="ns1blankspaceUploadProxy" accept-charset="utf-8">' +
													'<input type="hidden" name="maxfiles" id="maxfiles" value="' + iMaxFiles + '">' +
													'<input type="hidden" name="object" id="object" value="' + iObject + '">' +
													'<input type="hidden" name="objectcontext" id="objectcontext" value="' + lObjectContext + '">');
											
									for (var i = 0; i < iMaxFiles; i++) 	
									{
										aHTML.push('<input type="hidden" name="filetype' + i + '" id="filetype' + i + '" value="' + iAttachmentType + '">');
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

ns1blankspace.setup = 
{
	switch:		function (oParam)
				{
					var sViewScript;
					var sXHTMLElementID;

					if (oParam != undefined)
					{
						if (oParam.viewScript != undefined) {sViewScript = oParam.viewScript}
						if (oParam.xhtmlElementID != undefined ) {sXHTMLElementID = oParam.xhtmlElementID}
					}		

					var aHTML = [];
					var h = -1;
					
					$(ns1blankspace.xhtml.container).attr('data-initiator', '');
					$('#ns1blankspaceViewControlViewContainer').unbind('click');
					
					if (ns1blankspace.setupView)
					{
						ns1blankspace.setupView = false;
						
						$('#ns1blankspaceViewControlViewContainer')
						.button(
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
							ns1blankspace.control.views.show(this);;
						});

						if (sViewScript)
						{
							eval(sViewScript);
						}
						else
						{
							ns1blankspace.control.setView.default();
						}
											
						ns1blankspace.status.message('');
					}
					else
					{
						ns1blankspace.setupView = true;

						$('#ns1blankspaceViewControlViewContainer')
						.button(
						{
							label: ns1blankspace.option.defaultSetupView
						})
						.click(function() 
						{
							ns1blankspace.control.setup.views.show(this);;
						});
						
						if (sViewScript)
						{
							eval(sViewScript);
						}
						else
						{
							ns1blankspace.control.setView.setup();
						}

						ns1blankspace.status.message('');	
					}		
				}
}				

ns1blankspace.help =
{
	show: 		function ()
				{
					if (ns1blankspace.help.uri != '')
					{
						window.open(ns1blankspace.help.uri);
					}
					else	
					{
						$('#ns1blankspaceMain').html(ns1blankspace.help.show());
					}	
				}
}				

ns1blankspace.status =
{
	clear: 		function (sStatus)
				{	
					$('#ns1blankspaceViewControlActionStatus').html('&nbsp;');
				},

	message: 	function (sStatus)
				{	
					$('#ns1blankspaceViewControlActionStatus').html('<div style="position:relative;width:100%;height:35px;width:180px;">' +
							'<div style="display:table-cell; vertical-align:bottom; padding-bottom:5px; height:25px;">' + sStatus + '</div></div>');
				},

	working:	function (sStatus)
				{	
					$('#ns1blankspaceViewControlActionStatus').html('<div style="position:relative;width:100%;height:35px;width:180px;">' +
							'<div style="display:table-cell; vertical-align:bottom; padding-bottom:5px; height:25px;">' + ns1blankspace.xhtml.loadingSmall + 
							(sStatus===undefined?'':' ' + sStatus) + '</div></div>');
				},

	error: 		function (sError)
				{
					if (sError === undefined) {sError = 'Error!'};

					if (sError.length < 22)
					{	
						$('#ns1blankspaceViewControlActionStatus').html(
							'<div style="margin:2px; padding: 4px; height:17px; color:white; background-color:red; width:10px; float:left; font-size:1.35em; text-align:center;">!</div>' +
							'<div style="margin:2px; margin-left: 6px; padding-left: 7px; padding-top:10px; height:14px;">' + sError + '</div>');
					}
					else
					{
						$('#ns1blankspaceViewControlActionStatus').html(
							'<div id="ns1blankspaceStatusError" style="margin:2px; padding: 4px; height:17px; color:white; background-color:red; width:10px; float:left; font-size:1.35em; text-align:center; cursor: pointer">!</div>' +
							'<div style="margin:2px; margin-left: 6px; padding-left: 7px; padding-top:10px; height:14px;"></div>');

						$('#ns1blankspaceStatusError').click(function()
						{
							ns1blankspace.container.position({xhtmlElementID: 'ns1blankspaceViewControlActionStatus', topOffset: 2, setWidth: true});
							$(ns1blankspace.xhtml.container).html('<div style="font-size: 0.75em; background-color: #F8F8F8; width: 100%; color: #888888; border-style:solid; border-width: 7px;border-color: #F8F8F8; opacity: 0.95;">' + sError + '</div>');
							window.setTimeout('$(ns1blankspace.xhtml.container).fadeOut(4000)', 7000);
						});

						ns1blankspace.container.position({xhtmlElementID: 'ns1blankspaceViewControlActionStatus', topOffset: 2, setWidth: true});
						$(ns1blankspace.xhtml.container).html('<div style="font-size: 0.75em; background-color: #F8F8F8; width: 100%; color: #888888; border-style:solid; border-width: 7px;border-color: #F8F8F8; opacity: 0.95;">' + sError + '</div>');
						window.setTimeout('$(ns1blankspace.xhtml.container).fadeOut(3000)', 5000);
					}	
				}
}

ns1blankspace.container = 
{
	init: 		function(sSource)
				{
					if (sSource === undefined) {sSource = ''}
					$(ns1blankspace.xhtml.container).attr('data-initiator', sSource);
				},

	show:		function (oParam)
				{
					var aHTML = [];
					var h = -1;
					var sXHTMLElementID;
					var oXHTMLElement;
					var sXHTML;
					var sFunctionBind;
					var iOffsetTop = 0;
					var iOffsetLeft = 0;
					var bForceShow = false;
					var bSetWidth = false;
					
					if (oParam != undefined)
					{
						if (oParam.xhtmlElement != undefined) {oXHTMLElement = oParam.xhtmlElement}
						if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
						if (oParam.xhtml != undefined) {sXHTML = oParam.xhtml}
						if (oParam.functionBind != undefined) {sFunctionBind = oParam.functionBind}
						if (oParam.offsetTop != undefined) {iOffsetTop = oParam.offsetTop}
						if (oParam.offsetLeft != undefined) {iOffsetLeft = oParam.offsetLeft}
						if (oParam.topOffset != undefined) {iOffsetTop = oParam.topOffset}
						if (oParam.leftOffset != undefined) {iOffsetLeft = oParam.leftOffset}
						if (oParam.forceShow != undefined) {bForceShow = oParam.forceShow}
						if (oParam.setWidth != undefined) {bSetWidth = oParam.setWidth}
					}
					
					if (oXHTMLElement === undefined)
					{
						oXHTMLElement = $('#' + sXHTMLElementID)
					}
					
					if (oXHTMLElement != undefined)
					{
						if ($(ns1blankspace.xhtml.container).attr('data-initiator') === oXHTMLElement.attr('id') && !bForceShow)
						{
							$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
							$(ns1blankspace.xhtml.container).attr('data-initiator', '');
							return false;
						}
						else
						{
							$(ns1blankspace.xhtml.container).attr('data-initiator', oXHTMLElement.attr('id'));
							$(ns1blankspace.xhtml.container).html("&nbsp;")
								.show(ns1blankspace.option.showSpeedOptions)
								.offset({ top: $(oXHTMLElement).offset().top + $(oXHTMLElement).height() + iOffsetTop, left: $(oXHTMLElement).offset().left + iOffsetLeft})
								.html(sXHTML);
							
							if (bSetWidth) {$(ns1blankspace.xhtml.container + ' table').css('width', oXHTMLElement.width())}

							if (sFunctionBind != undefined)
								{eval(sFunctionBind)}

							return true;
						}
					}	
				},

	hide:		function ()
				{
					$(ns1blankspace.xhtml.container).attr('data-initiator', '')
						.html("&nbsp;")
						.hide(ns1blankspace.option.hideSpeedOptions);
				},
				
	position:	function (oParam)
				{
					var sXHTMLElementID = '';
					var iLeftOffset = 0;
					var iTopOffset = 7;
					var bSetWidth = false;
					
					if (oParam != undefined)
					{
						if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
						if (oParam.leftOffset != undefined) {iLeftOffset = oParam.leftOffset}
						if (oParam.topOffset != undefined) {iTopOffset = oParam.topOffset}
						if (oParam.offsetLeft != undefined) {iLeftOffset = oParam.offsetLeft}
						if (oParam.offsetTop != undefined) {iTopOffset = oParam.offsetTop}
						if (oParam.setWidth != undefined) {bSetWidth = oParam.setWidth}
					}
					
					var oElement = $('#' + sXHTMLElementID)
					
					$(ns1blankspace.xhtml.container).html('')
						.show()
						.offset({ top: $(oElement).offset().top + $(oElement).height() + iTopOffset, left: $(oElement).offset().left + iLeftOffset});

					if (bSetWidth)
					{
						$(ns1blankspace.xhtml.container).css('width', oElement.width());
					}
					else
					{
						$(ns1blankspace.xhtml.container).css('width', '');
					}
				},

	confirm:	function (oParam)
				{
					var aHTML = [];
					var sTitle = '';
					
					if (oParam != undefined)
					{
						if (oParam.html != undefined) {aHTML = oParam.html}
						if (oParam.title != undefined) {sTitle = oParam.title}
					}	
					
					$('#ns1blankspaceDialog').html(aHTML.join(''));
					
					$('#ns1blankspaceDialog').dialog(
						{
							resizable: false,
							modal: true,
							title: sTitle,
							buttons: 
							{
								"Ok": function() 
								{
									$(this).dialog("close");
								}
							}
						});
				}
}

ns1blankspace.search =
{
	show: 	function (oParam, oResponse)
				{
					var sXHTMLElementID;
					var sXHTMLInputElementID;
					var iXHTMLElementContextID;
					var sXHTMLParentInputElementID;
					var iSource = ns1blankspace.data.searchSource.text;
					var iMinimumLength = 1;
					var iMaximumColumns = 1;
					var sMethod;
					var sSearchText = '';
					var sColumns;
					var iColumn = 0;
					var sMethodFilter;
					var bMultiSelect;
						
					if (oParam != undefined)
					{
						if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
						if (oParam.xhtmlInputElementID != undefined) {sXHTMLInputElementID = oParam.xhtmlInputElementID}
						if (oParam.xhtmlParentInputElementID != undefined) {sXHTMLParentInputElementID = oParam.xhtmlParentInputElementID}
						if (oParam.source != undefined) {iSource = oParam.source}
						if (oParam.minimumLength != undefined) {iMinimumLength = oParam.minimumLength}
						if (oParam.method != undefined) {sMethod = oParam.method}
						if (oParam.searchText != undefined) {sSearchText = oParam.searchText}
						if (oParam.sColumns != undefined) {sColumns = oParam.columns}
						if (oParam.methodFilter != undefined) {sMethodFilter = oParam.methodFilter}
						if (oParam.multiSelect != undefined) {bMultiSelect = oParam.multiSelect; }
					}
					
					if (sXHTMLElementID != undefined)
					{
						var aXHTMLElementID = sXHTMLElementID.split('-');
						sXHTMLInputElementID = aXHTMLElementID[0];
						iXHTMLElementContextID = aXHTMLElementID[1];
					
						$.extend(true, oParam, {xhtmlInputElementID: sXHTMLInputElementID});
					
						if (sMethod === undefined)
						{
							sMethod = $('#' + sXHTMLInputElementID).attr("onDemandMethod");
							if (sMethod === undefined) {sMethod = $('#' + sXHTMLInputElementID).attr("data-method")}	
						}
						
						if (sColumns === undefined)
						{
							sColumns = $('#' + sXHTMLInputElementID).attr("onDemandColumns");
							if (sColumns === undefined) {sColumns = $('#' + sXHTMLInputElementID).attr("data-columns")}
							if (sColumns != undefined) {$.extend(true, oParam, {columns: sColumns})};	
						}
						
						if (sXHTMLParentInputElementID === undefined)
						{
							sXHTMLParentInputElementID = $('#' + sXHTMLInputElementID).attr("data-parent")
							if (sXHTMLParentInputElementID != undefined) {$.extend(true, oParam, {xhtmlParentInputElementID: sXHTMLParentInputElementID})};	
						}

						if (sMethodFilter === undefined)
						{
							sMethodFilter = $('#' + sXHTMLInputElementID).attr("data-methodFilter");
						}

						if (bMultiSelect === undefined) {
							bMultiSelect = ($('#' + sXHTMLInputElementID).attr("data-multiselect") === "true");
							$.extend(true, oParam, {multiselect: bMultiSelect});
						}
					}	
					
					if (iXHTMLElementContextID != undefined)
					{
						$('#' + sXHTMLInputElementID).val($('#' + sXHTMLElementID).html())
						$('#' + sXHTMLInputElementID).attr("data-id", iXHTMLElementContextID)
						$(ns1blankspace).hide();
					}
					else
					{
						if (oResponse === undefined)
						{
							ns1blankspace.status.working();

							ns1blankspace.container.position({xhtmlElementID: sXHTMLInputElementID, topOffset: 10, setWidth: true});
							
							if (sColumns === undefined) {sColumns = 'title'};
							
							if (sSearchText === '' && iSource === ns1blankspace.data.searchSource.text)
							{
								sSearchText = $('#' + sXHTMLInputElementID).val();
							}	
						
							if (sSearchText.length >= iMinimumLength || iSource === ns1blankspace.data.searchSource.all)
							{
								var aColumns = sColumns.split('-');	

								if (ns1blankspace.util.isMethodAdvancedSearch(sMethod))
								{
									var oSearch = new AdvancedSearch();
									oSearch.method = sMethod;

									$.each(aColumns, function() 
									{
										if (this != 'space' && this != 'comma' && this != 'pipe')
										{	
											oSearch.addField(this);
										}	
									});	

									if (iSource === ns1blankspace.data.searchSource.text)
									{	
										$.each(aColumns, function(i) 
										{
											if (this != 'space' && this != 'comma' && this != 'pipe')
											{	
												if (i != 0)
												{
													oSearch.addOperator('or');
												}

												oSearch.addFilter(this, 'TEXT_IS_LIKE', sSearchText);
											}	
										});	
									}	
									
									if (sMethodFilter)
									{
										var aMethodFilters = sMethodFilter.split('|');

										$.each(aMethodFilters, function(i) 
										{
											var aMethodFilter = this.split('-');
											oSearch.addFilter(aMethodFilter[0], aMethodFilter[1], aMethodFilter[2]);
										});	
									}	

									if (sXHTMLParentInputElementID != undefined)
									{
										var sParentColumnID = $('#' + sXHTMLInputElementID).attr("data-parent-search-id")
										var sParentColumnText = $('#' + sXHTMLInputElementID).attr("data-parent-search-text")
										var sParentContextID = $('#' + sXHTMLParentInputElementID).attr("data-id");
										var sParentContextText = $('#' + sXHTMLParentInputElementID).val();
										
										if (sParentColumnID != undefined && (sParentContextID != undefined && sParentContextID != ''))
										{
											oSearch.addFilter(sParentColumnID, 'EQUAL_TO', sParentContextID);
										}
										else if	(sParentColumnText != undefined && sParentContextText != '')
										{
											oSearch.addFilter(sParentColumnText, 'TEXT_STARTS_WITH', sParentContextText);
										}
									}
									
									oSearch.sort(aColumns[0], 'asc');
									oSearch.getResults(function(data){ns1blankspace.search.show(oParam, data)});
								}
								else
								{
									var sData = '=_';

									if (iSource === ns1blankspace.data.searchSource.text)
									{	
										sData = '&' + aColumns[0] + '=' + ns1blankspace.util.fs(sSearchText);
									}	
									
									if (sXHTMLParentInputElementID != undefined)
									{
										var sParentColumnID = $('#' + sXHTMLInputElementID).attr("data-parent-search-id")
										var sParentColumnText = $('#' + sXHTMLInputElementID).attr("data-parent-search-text")
										var sParentContextID = $('#' + sXHTMLParentInputElementID).attr("data-id");
										var sParentContextText = $('#' + sXHTMLParentInputElementID).val();
										
										if (sParentColumnID != undefined && (sParentContextID != undefined && sParentContextID != ''))
										{
											sData = '&' + sParentColumnID + '=' + sParentContextID;
										}
									}

									$.ajax(
									{
										type: 'GET',
										url: ns1blankspace.util.endpointURI(sMethod),
										data: sData,
										dataType: 'json',
										success: function(data){ns1blankspace.search.show(oParam, data)}
									});
								}	
							}
						}	
						else
						{
							ns1blankspace.status.message('');

							if (sColumns == undefined) {sColumns = 'title'}
							var aColumns = sColumns.split('-');
							var aHTML = [];
							
							if (oResponse.data.rows.length === 0)
							{
								$(ns1blankspace.xhtml.container).hide();
							}
							else
							{
								aHTML.push('<table class="ns1blankspaceSearchMedium" style="width:' +
												$('#' + sXHTMLInputElementID).width() + 'px;">');
							
								$.each(oResponse.data.rows, function(i, v) 
								{ 
									iColumn = iColumn + 1;
							
									if (iColumn == 1)
									{
										aHTML.push('<tr class="ns1blankspaceSearch">');
									}
										
									if (sColumns.length == 0)
									{
										aHTML.push('<td class="ns1blankspaceSearch" id="' + sXHTMLInputElementID +
															'-' + v.id + '">' + v.title + '</td>');
									}
									else
									{
										var bNewTD = true;

										aHTML.push('<td class="ns1blankspaceSearch" id="' + sXHTMLInputElementID +
																	'-' + v.id + '">');

										$.each(aColumns, function(j, k) 
										{
											bNewTD = false;

											switch (k)
											{
												case 'space':
													aHTML.push(' ');
													break;

												case 'comma':
													aHTML.push(',');
													break;

												case 'pipe':
													aHTML.push('|');
													break;

												default:

													if (bNewTD)
													{
														aHTML.push('</td><td class="ns1blankspaceSearch" id="' + sXHTMLInputElementID +
																	'-' + v.id + '">');
													}				
																
													aHTML.push(v[k]);
													bNewTD = true;
											}
										});

										aHTML.push('</td>');
									}
							
									if (iColumn === iMaximumColumns)
									{
										aHTML.push('</tr>');
										iColumn = 0;
									}	
								});
				    	
								aHTML.push('</table>');
					
								$(ns1blankspace.xhtml.container).show(ns1blankspace.option.showSpeedOptions);
								$(ns1blankspace.xhtml.container).html(aHTML.join(''));
							
								$('td.ns1blankspaceSearch').click(function(event)
								{
									$(ns1blankspace.xhtml.container).hide(200);
									$.extend(true, oParam, {xhtmlElementID: event.target.id})
									if (bMultiSelect) {
										ns1blankspace.search.multiSelect.add(oParam);
									}
									else {
										ns1blankspace.search.show(oParam);
									}
								});
							}	
						}
					}		
				},

	start: 		function ()
				{
					var sElementStatusID = 'ns1blankspaceViewControlSearchStatus';
					var sElementID = 'ns1blankspaceViewControlSearch';
					$('#' + sElementStatusID).show();
					$('#' + sElementStatusID).html(ns1blankspace.xhtml.loadingSmall);
					ns1blankspace.container.position({xhtmlElementID: sElementID, topOffset: 10});
				},

	stop:		function ()
				{
					var sElementID = 'ns1blankspaceViewControlSearchStatus';
					$('#' + sElementID).hide();
					$('#' + sElementID).html('');
				},

	advanced: 	function ()
				{
					var sElementID = 'ns1blankspaceViewControlSearch';
					ns1blankspace.container.position({xhtmlElementID: sElementID, topOffset: -38, leftOffset: 49});
					$(ns1blankspace.xhtml.container).show();
					$(ns1blankspace.xhtml.container).html('<span id="ns1blankspaceSearchAdvanced" style="padding:3px; padding-left: 4px; padding-right: 4px; color:#CCCCCC; font-size:0.625em; cursor:pointer;">advanced&nbsp;search</span>');
					$('#ns1blankspaceSearchAdvanced').click(function() {ns1blankspace.report.init({all: false})});
				},		

	multiSelect: 
	{
		add: 	function(oParam) {

					var sXHTMLElementID = '';
					var sInputElementId;
					var sCellElementId;
					var sTableElementId;
					var aHTML = [];

					if (oParam) {
						if (oParam.xhtmlElementID) {sXHTMLElementID = oParam.xhtmlElementID;}
					}

					sInputElementId = sXHTMLElementID.split('-')[0];
					sCellElementId = $('#' + sInputElementId).parent().attr('id');
					sTableElementId = sCellElementId.replace(/-/g, '_');
					sTableElementId = sTableElementId.replace('_input_', '_selectrows_');

					if ($('#' + sTableElementId).html() === undefined) {
						aHTML.push('<table id="' + sTableElementId + '" style="width:100%;">');

					}

					// Make sure the value hasn't already been selected and then Insert the row that's just been clicked 
					if ($('#' + sInputElementId.replace('_input_', '_selectrows_') + '-' + sXHTMLElementID.split('-')[1]).html() === undefined) {
						aHTML.push('<tr>' +
									'<td id="' + sInputElementId.replace('_input_', '_selectrows_') + '-' + sXHTMLElementID.split('-')[1] + '"' +
									   ' width="250px" class="ns1blankspaceMultiSelect">' +
									$('#' + sXHTMLElementID).html() + 
									'</td>' +
									'<td class="ns1blankspaceMultiRemove">Delete</td>' +
									'</tr>');
					}
					else { 
						ns1blankspace.status.message("Value has already been selected.");
						return;
					}
					

					if ($('#' + sTableElementId).html() === undefined) {
						// Let's insert the table into the td following the input element
						aHTML.push('</table>');

						$('#' + sCellElementId).html($('#' + sCellElementId).html() + aHTML.join(''));
					}
					else {
						// Insert the row into the table 
						$('#' + sTableElementId).append(aHTML.join(''));
					}

					// Now bind the remove button (we need to unbind all clicks first)
					$('.ns1blankspaceMultiRemove').unbind('click');
					$('.ns1blankspaceMultiRemove')
					.button({
							 text: false,
							 icons: {
								 primary: "ui-icon-close"
							}
					})
					.css('height', '15px')
					.css('width', '15px')
					.click( function(event) {
						// remove the row
						$(this).parent().remove();
					});
		}
	}
}

ns1blankspace.save =
{
	send: 		function (sParam, sData, sSuccessMessage)
				{
					if (sParam === undefined) {sParam = ''};
					
					if (sData != '' && sData.indexOf('&') === 0) {sData = sData.substr(1)};
					
					$.ajax(
					{
						type: 'POST',
						url: sParam,
						data: sData,
						dataType: 'json',
						async: false,
						success: function(data) {this.process(data, sSuccessMessage)}
					});
				},

	process: 	function (data, sSuccessMessage)
				{
					oResponse = data;
					
					if (oResponse.status === 'OK')
					{
						ns1blankspace.status.message(sSuccessMessage);
						ns1blankspace.objectSaveId =  oResponse.id;  //???
					}
					else
					{
						ns1blankspace.status.error(oResponse.error.errornotes);
						ns1blankspace.objectSaveId =  -1; //???
						return '';
					}
				}
}

ns1blankspace.util =
{
	setParam: 	function(oParam, sParam, sValue, oOption)
				{
					var bOnlyIfMissing = false;

					if (ns1blankspace.util.param(oOption, 'onlyIfMissing').exists)
					{
						bOnlyIfMissing = ns1blankspace.util.param(oOption, 'onlyIfMissing').value
					}

					if (oParam === undefined) {oParam = {}}

					if (oParam.hasOwnProperty(sParam))
					{
						if (!bOnlyIfMissing) {oParam[sParam] = sValue};
					}
					else
					{
						oParam[sParam] = sValue;
					}
						
					return oParam
				},	

	getParam: 	function(oParam, sParam, oOption)
				{
					var sDefault;
					var sSplit;
					var iIndex;

					var oReturn = {exists: false};

					if (ns1blankspace.util.param(oOption, 'default').exists)
					{
						oReturn.value = ns1blankspace.util.param(oOption, 'default').value
					}

					if (ns1blankspace.util.param(oOption, 'split').exists)
					{
						sSplit = ns1blankspace.util.param(oOption, 'split').value
					}

					if (ns1blankspace.util.param(oOption, 'index').exists)
					{
						iIndex = ns1blankspace.util.param(oOption, 'index').value
					}

					if (oParam !== undefined) 
					{ 
						if (oParam.hasOwnProperty(sParam))
						{
							oReturn.value = oParam[sParam];
							oReturn.exists = true;

							if (iIndex !== undefined && sSplit === undefined) {sSplit = '-'}

							if (sSplit !== undefined)
							{
								oReturn.values = oParam[sParam].split(sSplit);

								if (iIndex !== undefined)
								{
									if (iIndex < oReturn.values.length)
									{
										oReturn.value = oReturn.values[iIndex];
									}
								}	
							}
						}	
					}	

					return oReturn;
				},

	param: 		function(oParam, sParam, sSplit)
				{
					var oReturn = {exists: false};

					if (oParam !== undefined) 
					{ 
						if (oParam.hasOwnProperty(sParam))
						{
							oReturn.value = oParam[sParam];
							oReturn.exists = true;

							if (sSplit !== undefined)
							{
								oReturn.values = oParam[sParam].split(sSplit);
							}
						}	
					}	

					return oReturn;
				},

	json: 		function (oJSON, sElement, iRow)
				{
					oJSON = (oJSON === undefined)?'':oJSON;
					sElement = (sElement === undefined)?'':asElement;
					iRow = (iRow === undefined)?0:iRow;
					
					if (oJSON.length === 0) return '';
					
					if (sElement === '' || aiRow < 0) return '';
					
					if (oJSON.data.rows.length > 0)
					{	return oJSON.data.rows[iRow][sElement];	}
					else
					{	return '';}
				},

	tf2OnOff:	function (bValue)
				{
					if (bValue === undefined) {bValue = false}
					
					if (bValue)
					{ 
						return '1';
					}
					else
					{
						return '0';
					}	
					
				},

	onOff2TF:	function (sValue)
				{
					if (sValue === undefined) {sValue = '0'}
					
					if (sValue === '1')
					{ 
						return true;
					}
					else
					{
						return false;
					}	
				},

	tf2YN:		function (bValue)
				{
					if (bValue === undefined) {bValue = false}
					
					if (bValue)
					{ 
						return 'Y';
					}
					else
					{
						return 'N';
					}	
				},

	yn2tf:		function (sValue)
				{
					if (sValue === undefined) {sValue = 'N'}
					
					if (sValue === 'Y')
					{ 
						return true;
					}
					else
					{
						return false;
					}	
				},

	formatSave:	function (sValue)
				{
					if (sValue === undefined || sValue === 'undefined') { sValue = ''; }
					
					return encodeURIComponent(sValue)

				},

	fs:			function (sValue) {return this.formatSave(sValue)},

	fz: 		function (sValue)
				{
					if (sValue === undefined || sValue === 'undefined') { sValue = 0; }
					
					if (parseInt((sValue).parseCurrency()) === 0)
					{
						return '-';
					}
					else
					{
						return sValue
					}	
				},

	getID:		function (sValue) {return (sValue).split('-')[1]},

	getMethods:		function ()
				{
					if (ns1blankspace.methods === undefined)
					{
						$.ajax(
						{
							type: 'GET',
							url: '/jscripts/1blankspace.rpc-2.0.0.json',
							dataType: 'json',
							async: false,
							success: function(data) {ns1blankspace.methods = data.methods}
						});
					}
				},

	endpointURI:
				function (sMethod)
				{
					ns1blankspace.util.getMethods();

					var sBaseEndpoint = '/ondemand/';

					var oMethod = $.grep(ns1blankspace.methods, function (a) {return a.title == sMethod;})	

					if (oMethod.length != 0) 
					{
						if (oMethod[0].rpc == 'true')
						{	
							sBaseEndpoint = '/rpc/';
						}	
					}

					var aMethod = sMethod.split('_');
					var sEndpoint = aMethod[0];
					
					return sBaseEndpoint + (aMethod[0]).toLowerCase() + '/?method=' + (sMethod).toUpperCase();
				},

	isMethodAdvancedSearch:
				function (sMethod)
				{
					ns1blankspace.util.getMethods();

					var sBaseEndpoint;

					var oMethod = $.grep(ns1blankspace.methods, function (a) {return a.title == sMethod;})	

					if (oMethod.length == 0) 
					{
						return false;
					}
					else
					{
						return (oMethod[0].advancedSearch == 'true');
					}
				},

	uri: 		{
					parameters: 	function()
									{
										var vars = [], hash;
										var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
										
										for (var i = 0; i < hashes.length; i++)
										{
											hash = hashes[i].split('=');
											vars.push(hash[0]);
											vars[hash[0]] = hash[1];
										};
										
										return vars;
									},

					parameter: 		function(sName)
									{
										return $.urlParameters()[sName];
									}
				},

	unique: 	function (oParam)
				{
					var oData;
					var sKey;
					var oUniqueData = [];
					var aUniqueKey = [];

					if (oParam != undefined)
					{
						if (oParam.data != undefined) {oData = oParam.data}
						if (oParam.key != undefined) {sKey = oParam.key}	

						$.each(oData, function()
						{
							if ($.inArray(this[sKey], aUniqueKey) === -1)
							{
								aUniqueKey.push(this[sKey]);
								oUniqueData.push(this);
							}	
						});

						return oUniqueData;
					}		
				},

	initTemplate:  	
				function (oParam)
				{
					var sTemplate = 'invoice';

					if (ns1blankspace.util.param(oParam, 'template').exists) {sTemplate = ns1blankspace.util.param(oParam, 'template').value}

					if (ns1blankspace.xhtml.templates[sTemplate] == undefined)
					{
						var oSearch = new AdvancedSearch();
						oSearch.method = 'DOCUMENT_SEARCH';
						oSearch.addField('title,content');
						oSearch.addFilter('type', 'EQUAL_TO', 10);
						oSearch.addFilter('title', 'EQUAL_TO', (sTemplate).toUpperCase() + ' TEMPLATE');

						oSearch.getResults(function(oResponse)
						{
							if (oResponse.data.rows.length == 0)
							{
								if (ns1blankspace.xhtml.templates.source[sTemplate])
								{
									$.ajax(
									{
										type: 'GET',
										url: ns1blankspace.xhtml.templates.source[sTemplate],
										dataType: 'text',
										global: false,
										success: function(data)
										{
											ns1blankspace.xhtml.templates[sTemplate] = data;
											ns1blankspace.util.onComplete(oParam);
										},
										error: function(data)
										{
											ns1blankspace.xhtml.templates[sTemplate] = '';
											ns1blankspace.util.onComplete(oParam);
										}
									});
								}	
							}
							else
							{
								ns1blankspace.xhtml.templates[sTemplate] = (oResponse.data.rows[0].content).formatXHTML();
								ns1blankspace.xhtml.templates.document[sTemplate] = oResponse.data.rows[0].id;
								ns1blankspace.util.onComplete(oParam);
							}
						});		
					}
					else
					{
						ns1blankspace.util.onComplete(oParam);
					}
				},

	onComplete: function (oParam)
				{
					if (ns1blankspace.util.param(oParam, 'onComplete').exists)
					{
						var fOnComplete = ns1blankspace.util.param(oParam, 'onComplete').value;
	
						if (ns1blankspace.util.param(oParam, 'onCompleteWhenCan').exists)
						{
							oParam.onComplete = oParam.onCompleteWhenCan;
							delete oParam.onCompleteWhenCan;
						}	
						else
						{
							delete oParam.onComplete;
						}

						fOnComplete(oParam);
					}
					else if (ns1blankspace.util.param(oParam, 'onCompleteWhenCan').exists)
					{
						var fOnCompleteWhenCan = ns1blankspace.util.param(oParam, 'onCompleteWhenCan').value;

						delete oParam.onCompleteWhenCan;
					
						fOnCompleteWhenCan(oParam);
					}
				},

	isEmpty: 	function (oObject)
				{
			  		for (var key in oObject)
			  		{
			     		if (oObject.hasOwnProperty(key)) {return false;}
			     	}
			  		
			   		return true;
				}											
}

ns1blankspace.debug = 
{
	enabled: 	false,

	log: 		[],

	message: 	function (sMessage)
				{
					if (ns1blankspace.debug.enabled)
					{
						ns1blankspace.debug.log.push({time: Date(), message: sMessage})
						console.log(sMessage);
					}
				},

	clear: 		function ()
				{
					ns1blankspace.debug.log = [];
				}			
}

ns1blankspace.search.address =
{
	show:		function (sXHTMLElementID, oParam)
				{
					var aSearch = sXHTMLElementID.split('-');
					var bSelected = false;
					var sSearchText = '';
					var iMinimumLength = 1;
					var iSource = ns1blankspace.data.searchSource.text;
					
					if (oParam) {
						if (oParam.minimumLength) {iMinimumLength = oParam.minimumLength;}
						if (oParam.source) {iSource = oParam.sourcel}
						if (oParam.selected != undefined) {bSelected = oParam.selected;}
					}

					oParam = ns1blankspace.util.setParam(oParam, "xhtmlElementID", sXHTMLElementID);

					if (bSelected)
					{
						var sElementReplaceID;
						var bUpdateHTML = false;

						$('#' + ns1blankspace.xhtml.divID).val($('#' + sXHTMLElementID).attr("data-suburb"));
						$('#' + ns1blankspace.xhtml.divID).attr('data-id', sXHTMLElementID);

						if ($('#' + ns1blankspace.xhtml.divID).attr('data-stateElementID')) {
							sElementReplaceID = $('#' + ns1blankspace.xhtml.divID).attr('data-stateElementID');
						}
						else {
							sElementReplaceID = ns1blankspace.xhtml.divID.replace('Suburb', 'State');
						}
						if ($('#' + ns1blankspace.xhtml.divID).attr('data-stateUpdateHTML') || $('#' + ns1blankspace.xhtml.divID).attr('data-stateUpdateHTML') == 'true') {
							$('#' + sElementReplaceID).html($('#' + sXHTMLElementID).attr("data-state"));
						}
						else {
							$('#' + sElementReplaceID).val($('#' + sXHTMLElementID).attr("data-state"));
						}

						if ($('#' + ns1blankspace.xhtml.divID).attr('data-postcodeElementID')) {
							sElementReplaceID = $('#' + ns1blankspace.xhtml.divID).attr('data-postcodeElementID');
						}
						else {
							sElementReplaceID = ns1blankspace.xhtml.divID.replace('Suburb', 'PostCode');
						}
						if ($('#' + ns1blankspace.xhtml.divID).attr('data-postcodeUpdateHTML') || $('#' + ns1blankspace.xhtml.divID).attr('data-postcodeUpdateHTML') == 'true') {
							$('#' + sElementReplaceID).html($('#' + sXHTMLElementID).attr("data-postcode"));
						}
						else {
							$('#' + sElementReplaceID).val($('#' + sXHTMLElementID).attr("data-postcode"));
						}

						$(ns1blankspace.xhtml.container).hide();
					}
					else
					{
						ns1blankspace.status.working();
						ns1blankspace.container.position({xhtmlElementID: sXHTMLElementID});
						sSearchText = $('#' + ns1blankspace.xhtml.divID).val();

						if (sSearchText.length >= iMinimumLength || iSource === ns1blankspace.data.searchSource.all)
						{
							$.ajax(
							{
								type: 'POST',
								url: ns1blankspace.util.endpointURI('CORE_ADDRESS_SEARCH'),
								data: 'suburblike=' + ns1blankspace.util.fs(sSearchText),
								dataType: 'json',
								success: function(data) {ns1blankspace.search.address.process(oParam, data);}
							});
						}
					}
				},

	process:	function (oParam, oResponse)
				{
					var iColumn = 0;
					var aHTML = [];
					var h = -1;
					var	iMaximumColumns = 1;
					var sXHTMLElementID;
							
					if (oParam) {
						if (oParam.xhtmlElementID) {sXHTMLElementID = oParam.xhtmlElementID;}
					}

					ns1blankspace.status.message('');

					if (oResponse.data.rows.length === 0) {
						$(ns1blankspace.xhtml.container).hide();
					}
					else {
						
						aHTML.push('<table class="ns1blankspaceSearchMedium" style="width:' +
										$('#' + sXHTMLElementID).width() + 'px;">');

						$.each(oResponse.data.rows, function()
						{
							aHTML.push('<tr class="ns1blankspaceSearch">');
										
							aHTML.push('<td class="ns1blankspaceSearch"' +
											' id="ns1blankspaceAddressSearchSuburb-' + 
												this.suburb.replace(/ /g,'') + '-' + 
												this.state.replace(/ /g,'') + '-' + 
												this.postcode.replace(/ /g,'') + '"' +
											' data-suburb="' + this.suburb + '"' + 
											' data-state="' + this.state + '"' + 
											' data-postcode="' + this.postcode + '"' + 
											'>' + this.suburb + '</td>');
													
							aHTML.push('<td class="ns1blankspaceSearch"' + 
											' id="ns1blankspaceAddressSearchState' + 
												this.suburb.replace(/ /g,'') + '-' + 
												this.state.replace(/ /g,'') + '-' + 
												this.postcode.replace(/ /g,'') + '"' +
											' data-suburb="' + this.suburb + '"' + 
											' data-state="' + this.state + '"' + 
											' data-postcode="' + this.postcode + '"' + 
											'>' + this.state + '</td>');
							
							aHTML.push('<td class="ns1blankspaceSearch"' +
											' id="ns1blankspaceAddressSearchPostCode' + 
												this.suburb.replace(/ /g,'') + '-' + 
												this.state.replace(/ /g,'') + '-' + 
												this.postcode.replace(/ /g,'') + '"' +
											' data-suburb="' + this.suburb + '"' + 
											' data-state="' + this.state + '"' + 
											' data-postcode="' + this.postcode + '"' + 
											'>' + this.postcode + '</td>');
							
							aHTML.push('</tr>');
						});
				    	
						aHTML.push('</table>');
					
						$(ns1blankspace.xhtml.container).html(aHTML.join(''));
						$(ns1blankspace.xhtml.container).show(ns1blankspace.option.showSpeedOptions);
						
						$('td.ns1blankspaceSearch').click(function(event)
						{
							$(ns1blankspace.xhtml.container).hide(200);
							ns1blankspace.search.address.show(event.target.id, {selected: true});
						});
					}				
				}
}				

ns1blankspace.search.email =
{
	show: 		function (sXHTMLElementID, oParam)
				{

					var iSource = ns1blankspace.data.searchSource.text;
					var iMinimumLength = 1;
					var sMethod;
					var sSearchText;
					var iMaximumColumns = 1;
					var bEmailOnly = false;
					var sParentSearchID;
					var sParentElementID;
					var sSetXHTMLElementID;
					
					if (oParam != undefined)
					{
						if (oParam.source != undefined) {iSource = oParam.source}
						if (oParam.minimumLength != undefined) {iMinimumLength = oParam.minimumLength}
						if (oParam.method != undefined) {sMethod = oParam.method}
						if (oParam.searchText != undefined) {sSearchText = oParam.searchText}
						if (oParam.maximumColumns != undefined) {iMaximumColumns = oParam.maximumColumns}
						if (oParam.emailOnly != undefined) {bEmailOnly = oParam.emailOnly}
						if (oParam.contactBusiness != undefined) {sParentSearchId = oParam.contactBusiness}
						if (oParam.setXHTMLElementID != undefined) {sSetXHTMLElementID = oParam.setXHTMLElementID}
					}

					var aSearch = sXHTMLElementID.split('---');
					var sElementId = aSearch[0];
					var lElementSearchContext = aSearch[1];
						
					if (sElementId != '')
					{
						var sMethod = $('#' + sElementId).attr("data-method")
						var sParentElementId = $('#' + sElementId).attr("data-parent")
					}	
					
					if (lElementSearchContext != undefined)
					{
						if (sSetXHTMLElementID === undefined) {sSetXHTMLElementID = sElementID}
					
						var lDataID = $('#' + sSetXHTMLElementId).attr("data-id")
						
						if (lDataID === undefined) 
						{
							lDataID = aSearch[1];
						}
						else
						{	
							lDataID += '-' + aSearch[1]
						}	
						
						$('#' + sSetXHTMLElementId).attr("data-id", lOnDemandID)
						
						var sValue = $('#' + sSetXHTMLElementID).val()
						
						if (bEmailOnly) 
						{
							if (sValue === '') 
							{
								sValue = aSearch[6]
							}
							else
							{
								sValue += ';' + aSearch[6]
							}		
								
							$('#' + sSetXHTMLElementID).val(sValue)	
						}
						else
						{
							$('#' + sSetXHTMLElementID).val(aSearch[2] + ' ' + aSearch[3])
						}	
						
						$('#' + sParentElementId).attr("data-id", aSearch[4])
						$('#' + sParentElementId).val(aSearch[5])
						$(ns1blankspace.xhtml.container).hide();
					}
					else
					{
						ns1blankspace.container.position({xhtmlElementID: sXHTMLElementID});
					
						if (sSearchText === undefined) {sSearchText = ''};
							
						if (sSearchText === '' && iSource === ns1blankspace.data.searchSource.text)
						{
							sSearchText = $('#' + sElementId).val();
						}	
						
						if (sSearchText.length >= iMinimumLength || iSource === ns1blankspace.data.searchSource.all)
						{						
							var oSearch = new AdvancedSearch();
							oSearch.rows = 10;
							oSearch.method = 'CONTACT_PERSON_SEARCH';
							oSearch.addField( 'firstname,surname,contactbusinesstext,contactbusiness,email');
							oSearch.addFilter('quicksearch', 'TEXT_IS_LIKE', sSearchText);
							
							if (sParentElementID != undefined)
							{
								var sParentSearchText = $('#' + sParentElementID).val();
								sParentSearchID = $('#' + sParentElementID).attr("data-id");
							}	
							
							if (sParentSearchID != undefined)
							{
								oSearch.addFilter('contactbusiness', 'EQUAL_TO', sParentSearchID);
							}
							else if	(sParentSearchText != undefined)
							{
								oSearch.addFilter('contactbusinesstext', 'TEXT_STARTS_WITH', sParentSearchText);
							}
							
							if (bEmailOnly)
							{
								oSearch.addFilter('email', 'IS_NOT_NULL', sParentSearchText);
								oSearch.addFilter('email', 'TEXT_IS_LIKE', '@');
							}	
							
							oSearch.rf = 'JSON';
						
							oSearch.getResults(function (data) {ns1blankspace.search.email.process(data, sElementId, oParam)}) 
										
						}
					};	
				},

	process: 	function (oResponse, sElementID, oParam)
				{

					var iColumn = 0;
					var aHTML = [];
					var h = -1;
					var	iMaximumColumns = 1;
					var sElementIDSuffix;
					
					if (oResponse.data.rows.length === 0)
					{
						$(ns1blankspace.xhtml.container).hide();
					}
					else
					{
						aHTML.push('<table class="ns1blankspaceSearchLarge">');
							
						$.each(oResponse.data.rows, function()
						{	
							sElementIDSuffix = '---' + this.id +
													'---' + this.firstname +
													'---' + this.surname +
													'---' + this.contactbusiness +
													'---' + this.contactbusinesstext +
													'---' + this.email;
						
							aHTML.push('<tr class="ns1blankspaceSearch">');
							
							aHTML.push('<td class="ns1blankspaceSearch" id="' + sElementID +
													sElementIDSuffix +
													'">' + this.firstname +
													'</td>');
													
							aHTML.push('<td class="ns1blankspaceSearch" id="' + sElementID +
													sElementIDSuffix +
													'">' + this.surname +
													'</td>');
																			
							aHTML.push('<td class="ns1blankspaceSearch" id="' + sElementID +
													sElementIDSuffix +
													'">' + this.email +
													'</td>');
													
							aHTML.push('<td class="ns1blankspaceSearch" id="' + sElementID +
													sElementIDSuffix +
													'">' + this.contactbusinesstext +
													'</td>');
													
							aHTML.push('</tr>');
						});
				    	
						aHTML.push('</table>');
					
						$(ns1blankspace.xhtml.container).html(ns1blankspace.render.init(
							{
								html: aHTML.join(''),
								more: (oResponse.morerows === 'true'),
								headerClass: 'ns1blankspaceSearchHeaderLarge',
								footerClass: 'ns1blankspaceSearchFooterLarge'
							})	
						);
					
						$(ns1blankspace.xhtml.container).show(ns1blankspace.option.showSpeedOptions);
						
						$('td.interfaceSearch').click(function(event)
						{
							$(ns1blankspace.xhtml.container).hide(200);
							ns1blankspace.email.search.send(event.target.id, oParam);
						});
						
						ns1blankspace.render.bind(
						{
							columns: 'firstname-surname-email-contactbusinesstext',
							idColumns: 'firstname-surname-contactbusiness-contactbusinesstext-email',
							more: oResponse.moreid, 
							bodyClass: 'ns1blankspaceSearchLarge',
							functionSearch: ns1blankspace.email.search.send,
							xhtmlElementID: sElementID,
							idSeperator: '---',
							type: 'JSON'
						})	
					}	
							
				}
}				

ns1blankspace.render =
{
	init: 		function (oParam)
				{
					var aHTML = [];
					
					var sHTML = '';
					var bMore = false;
					var sWidth = 250;

					if (oParam != undefined)
					{
						if (oParam.html != undefined) {sHTML = oParam.html}
						if (oParam.more != undefined) {bMore = oParam.more}
						if (oParam.width != undefined) {sWidth = oParam.width}
					}

					aHTML.push('<table id="ns1blankspaceSearchHeader" class="ns1blankspaceSearchHeaderMedium" style="border-spacing:2px; width:' + sWidth + 'px;">');
					aHTML.push('<tr>');
					
					if (bMore)
					{
						aHTML.push('<td style="width:5px; cursor:pointer; padding-top:5px;" class="ns1blankspaceRenderHeader ns1blankspaceRenderHeaderPage ns1blankspaceRenderHeaderPageSelected"' +
											' id="ns1blankspaceRenderHeader-0" data-rowstart="0">1</td>');

						aHTML.push('<td style="cursor:pointer;" class="ns1blankspaceRenderHeaderMore' + 
											'" id="ns1blankspaceRenderHeaderMore">more...</td>');
					}

					aHTML.push('<td class="ns1blankspaceSearchHeaderClose" style="padding-left:5px;padding-right:3px;padding-top:3px;width:20px;text-align:right;">' +
											'<span id="ns1blankspaceSearchHeaderClose"></span></td>');
					
					aHTML.push('</tr>');
					aHTML.push('</table>');
						
					aHTML.push('<div id="ns1blankspaceSearch-0" class="ns1blankspaceSearchPage">');
								
					aHTML.push(sHTML);

					aHTML.push('</div>');

					return aHTML.join('');
				},

	bind:		function (oParam)
				{
					var fFunctionMore = ns1blankspace.render.showMore;
					var iMore;
					
					if (oParam != undefined)
					{
						if (oParam.functionMore != undefined) {fFunctionMore = oParam.functionMore}
						if (oParam.more != undefined) {iMore = oParam.more}
					}
					
					$('#ns1blankspaceSearchHeaderClose').button(
					{
						text: false,
						icons:
						{
							primary: "ui-icon-close"
						}
					})
					.click(function() {
						$(ns1blankspace.xhtml.container).slideUp(1000);
						$(ns1blankspace.xhtml.container).html('&nbsp;');
					})
					.css('width', '15px')
					.css('height', '18px')
						
					$('#ns1blankspaceRenderHeaderMore')
					.click(function() {
						(oParam != undefined?oParam.more = iMore:oParam = {more: iMore})
						fFunctionMore(oParam);
					})
					.css('font-size', '0.75em');
						
					$('#ns1blankspaceRenderHeader-0')
					.click(function(event)
					{
						ns1blankspace.render.showPage(this.id);
					});
				},

	showMore:	function (oParam, oResponse)
				{
					
					var sXHTMLElementID = '';
					var iMore = -1;
					var iStartRow = 10;
					var iRows = 2;
					var iColumn = 0;
					var iMaximumColumns = 1;
					var sColumns = "title";
					var sIDColumns = '';
					var fFunctionSearch;
					var fFunctionClass;
					var sClass;
					var sIdAdditional = '';
					var sBodyClass = 'ns1blankspaceSearchMedium';
					var sIDSeperator = '-';
					var sWidth = 250;
					
					if (oParam != undefined)
					{
						if (oParam.more != undefined) {iMore = oParam.more}
						if (oParam.startRow != undefined) {iStartRow = oParam.startRow}
						if (oParam.rows != undefined) {iRows = oParam.rows}
						if (oParam.xhtmlElementId != undefined) {sXHTMLElementID = oParam.xhtmlElementId}
						if (oParam.columns != undefined) {sColumns = oParam.columns}
						if (oParam.idColumns != undefined) {sIDColumns = oParam.idColumns}
						if (oParam.functionSearch != undefined) {fFunctionSearch = oParam.functionSearch}
						if (oParam.functionClass != undefined) {fFunctionClass = oParam.functionClass}
						if (oParam.idAdditional != undefined) {sIdAdditional = oParam.idAdditional}
						if (oParam.bodyClass != undefined) {sBodyClass = oParam.bodyClass}
						if (oParam.idSeperator != undefined) {sIDSeperator = oParam.idSeperator}
						if (oParam.width != undefined) {sWidth = oParam.width}
					}
					
					$('#ns1blankspaceRenderHeaderMore').html(ns1blankspace.xhtml.loadingSmall);
					
					if (iMore === -1)
					{
						ns1blankspace.status.error('No more!');
					}
					else
					{
						if (oResponse === undefined)
						{
							var sData =	'id=' + iMore +
											'&startrow=' + iStartRow + 
											'&rows=' + iRows;
							
							$.ajax(
							{
								type: 'GET',
								url: ns1blankspace.util.endpointURI('CORE_SEARCH_MORE'),
								data: sData,
								dataType: 'json',
								success: function(data){ns1blankspace.render.showMore(oParam, data)}
							});
						}
						else
						{	
							var aHTML = [];
						
							if ($('#ns1blankspaceSearch-' + iStartRow).length === 0)
							{
								aHTML.push('<div id="ns1blankspaceSearch-' + iStartRow + '" class="ns1blankspaceSearchPage">');
							
								aHTML.push('<table class="' + sBodyClass + '" style="width:' + sWidth + 'px;">');
										
								var iStartRow = parseInt(oResponse.startrow);
								var iRows = parseInt(oResponse.rows);
								var bMoreRows = (oResponse.morerows === 'true');
												
								if (bMoreRows)
								{				
									$('#ns1blankspaceRenderHeaderMore').html('more...');
								}
								else
								{
									$('#ns1blankspaceRenderHeaderMore').html('&nbsp;');
									$('#ns1blankspaceRenderHeaderMore').unbind('click');
									$('#ns1blankspaceRenderHeaderMore').css('cursor', 'auto');
								}	
								
								oParam.startRow = iStartRow + iRows;	
												
								$.each(oResponse.data.rows, function()
								{		
									iColumn = iColumn + 1;
									
									if (iColumn === 1)
									{
										aHTML.push('<tr class="ns1blankspaceSearch">');
									}
									
									var aIDColumns = sIDColumns.split("-");
									
									var sIDData = '';

									for (var i = 0; i < aIDColumns.length; i++)
									{
										sIDData += '-' + this[aIDColumns[i]];
									}
									
									var aColumns = sColumns.split("-");
									
									for (var i = 0; i < aColumns.length; i++)
									{
										sClass = 'ns1blankspaceSearch';

										if (fFunctionClass != undefined)
										{
											sClass = sClass + fFunctionClass(oRow);
										}	
									
										aHTML.push('<td class="' + sClass + '" id="' +
															sXHTMLElementID + '-' + this.id + sIDData + sIdAdditional + '">');
															
										switch (aColumns[i])
										{
										case 'space':
											aHTML.push(' ');
											break;
										case 'comma':
											aHTML.push(',');
											break;
										case 'pipe':
											aHTML.push('|');
											break;
										default:
											aHTML.push(this[aColumns[i]]);
										}
										
										aHTML.push('</td>');
									}
									
									if (iColumn === iMaximumColumns)
									{    
										aHTML.push('</tr>');
										iColumn = 0;
									}	
								});
							
								aHTML.push('</table>');
								
								aHTML.push('</div>');
								
								$('.ns1blankspaceSearchPage').hide();
								$('.ns1blankspaceSearchPage:last').after(aHTML.join(''));
								
								$('td.ns1blankspaceSearch').click(function(event)
								{
									$(ns1blankspace.xhtml.container).html('&nbsp;');
									$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions)
									fFunctionSearch(event.target.id, {source: 1});
								});
										
								$('td.ns1blankspaceRenderHeader').removeClass('ns1blankspaceRenderHeaderPageSelected');
									
								$('td.ns1blankspaceRenderHeader:last').after('<td style="width:5px; cursor:pointer; padding-top:5px;" class="ns1blankspaceRenderHeader ns1blankspaceRenderHeaderPage ns1blankspaceRenderHeaderPageSelected"' +
											' id="ns1blankspaceRenderHeader-' + iStartRow + '" data-rowstart="0">' +
											(parseInt(iStartRow/iRows) + 1) + '</td>');
													
							}
						
							$('td.ns1blankspaceRenderHeader:last').click(function(event)
							{
								ns1blankspace.render.showPage(this.id);
							});
						}
					}
				},

	showPage:	function (sXHTMLElementID)
				{
					var aElement = sXHTMLElementID.split('-');
					
					$('td.ns1blankspaceRenderHeader').removeClass('ns1blankspaceRenderHeaderPageSelected');
					$('#ns1blankspaceRenderHeader-' + aElement[1]).addClass('ns1blankspaceRenderHeaderPageSelected');
					$('.ns1blankspaceSearchPage').hide();
					$('#ns1blankspaceSearch-' + aElement[1]).show();
				}
}				

ns1blankspace.actions =
{
	show: 		function (oParam)
				{
					var sXHTMLElementID = 'ns1blankspaceMainActions';
					var iObject = ns1blankspace.object;
					var iObjectContext = ns1blankspace.objectContext;
					var bShowAdd = true;
					var iType;
					var oActions = {add: true};
					var iContactBusiness;
					var iContactPerson;
					var sContactBusinessText;
					var sContactPersonText;
					
					if (oParam != undefined)
					{
						if (oParam.object != undefined) {iObject = oParam.object}
						if (oParam.objectContext != undefined) {iObjectContext = oParam.objectContext}
						if (oParam.objectName != undefined) {sObjectName = oParam.objectName}
						if (oParam.showAdd != undefined) {bShowAdd = oParam.showAdd}
						if (oParam.actionType != undefined ) {iType = oParam.actionType}
						if (oParam.type != undefined ) {iType = oParam.type}
						if (oParam.xhtmlElementID != undefined ) {sXHTMLElementID = oParam.xhtmlElementID}
						if (oParam.actions != undefined) {oActions = oParam.actions}
						if (oParam.contactBusiness != undefined) {iContactBusiness = oParam.contactBusiness}
						if (oParam.contactPerson != undefined) {iContactPerson = oParam.contactPerson}
						if (oParam.contactBusinessText != undefined) {sContactBusinessText = oParam.contactBusinessText}
						if (oParam.contactPersonText != undefined) {sContactPersonText = oParam.contactPersonText}
					}	
					else
					{
						oParam = {};
					}
					
					if (oActions.add)
					{
						var aHTML = [];
						var h = -1;	
									
						aHTML.push('<table id="ns1blankspace" class="ns1blankspace">' +
									'<tr>' +
									'<td id="ns1blankspaceActionsColumn1" class="ns1blankspaceColumn1Flexible">' +
									ns1blankspace.xhtml.loading +
									'</td>' +
									'<td id="ns1blankspaceActionsColumn2" class="ns1blankspaceColumn2" style="width: 100px;">' +
									'</td></tr>' +
									'</table>');					
							
						$('#' + sXHTMLElementID).html(aHTML.join(''));
						
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
						.click(function() {
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
							aHTML.push('<tr>');

							aHTML.push('<td id="ns1blankspaceAction_subject-' + this.id + '" class="ns1blankspaceRow">' +
											this.subject + '</td>');

							aHTML.push('<td id="ns1blankspaceAction_date-' + this.id + '" class="ns1blankspaceRow">' +
											this.duedate + '</td>');

							aHTML.push('<td id="ns1blankspaceAction_type-' + this.id + '" class="ns1blankspaceRow">' +
											this.actiontypetext + '</td>');
							
							if (bShowDescription)
							{
								aHTML.push('<td id="ns1blankspaceAction_description-' + this.id + '" class="ns1blankspaceRow">' +
												this.description + '</td>');
							}					
							
							aHTML.push('<td style="width:60px;text-align:right;" class="ns1blankspaceRow">' + 			
											'<span id="ns1blankspaceAction_options_remove-' + this.id + '" class="ns1blankspaceRowRemove"></span>' +
											'<span id="ns1blankspaceAction_options_select-' + this.id + '" class="ns1blankspaceRowSelect"></span>' +	
											'</td>');

							aHTML.push('</tr>');
						});
				    	
						aHTML.push('</table>');
						
						ns1blankspace.render.page.show(
						   {
							xhtmlElementID: sXHTMLElementID,
							xhtmlContext: 'Action',
							xhtml: aHTML.join(''),
							showMore: (oResponse.morerows === 'true'),
							columns: 'subject-actiondate',
							more: oResponse.moreid,
							rows: ns1blankspace.option.defaultRows,
							functionSearch: ns1blankspace.action.search.send,
							functionOpen: "ns1blankspace.action.init({showHome: false});ns1blankspace.action.search.show(this.id)"
						   }); 
						
						$('#ns1blankspaceActions .ns1blankspaceRowRemove').button({
							text: false,
							icons:
							{
								primary: "ui-icon-close"
							}
						})
						.click(function() {
							ns1blankspace.actions.remove({xhtmlElementID: this.id});
						})
						.css('width', '15px')
						.css('height', '17px');
						
						$('#ns1blankspaceActions span.ns1blankspaceRowSelect').button({
							text: false,
							icons:
							{
								primary: "ui-icon-play"
							}
						})
						.click(function() {
							ns1blankspace.action.init({id: (this.id).split('-')[1]})
						})
						.css('width', '15px')
						.css('height', '17px');
					}
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
						.click(function() {
							ns1blankspace.actions.show();
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
							fPostSave();
						}
						else
						{
							ns1blankspace.status.error(oResponse.error.errornotes);
						}
					}
				}				
}

ns1blankspace.render.page = 
{
	show: 		function (oParam)
				{
					var aHTML = [];
					var h = -1;
					var sXHTMLElementID;
					
					var sHTML = '';
					var bMore = false;
					var iMore;
					var iStartRow = 0;
					var iRows = 30;
					var bShowList = true;
					var sXHTMLContext = '';
					var bHeaderRow = true;
					
					if (oParam != undefined)
					{
						if (oParam.xhtml != undefined) {sHTML = oParam.xhtml}
						if (oParam.showMore != undefined) {bMore = oParam.showMore}
						if (oParam.more != undefined) {iMore = oParam.more}
						if (oParam.startRow != undefined) {iStartRow = oParam.startRow}
						if (oParam.rows != undefined) {iRows = oParam.rows}
						if (oParam.showList != undefined) {bShowList = oParam.showList}
						if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
						if (oParam.xhtmlContext != undefined) {sXHTMLContext = oParam.xhtmlContext}
						if (oParam.headerRow != undefined) {bHeaderRow = oParam.headerRow}
					}

					if (bHeaderRow) {oParam.xhtmlFirstRow = $('tr:first', sHTML).html()};
					
					if (bMore)
					{
						aHTML.push('<table style="border-spacing:2px;" id="ns1blankspaceRenderHeaderPage_' + sXHTMLContext + '"><tr>');
						aHTML.push('<td style="width:5px; cursor:pointer;" class="ns1blankspaceRenderHeaderPage ns1blankspaceRenderHeaderPageSelected"' +
											' id="ns1blankspaceRenderHeaderPage_' + sXHTMLContext + '-0" data-rowstart="0">1</td>');
						aHTML.push('<td></td></tr></table>');
					}
						
					aHTML.push('<div id="ns1blankspaceRenderPage_' + sXHTMLContext + '-0" class="ns1blankspaceRenderPage ns1blankspaceRenderPage_' + sXHTMLContext + '">');
					aHTML.push(sHTML);
					aHTML.push('</div>');

					$('#' + sXHTMLElementID).html(aHTML.join(''));
					if (bShowList) {$('#' + sXHTMLElementID).show(ns1blankspace.option.showSpeed)};
						
					if (bMore)
					{
						var sHTML = '<td style="width:5px;cursor:pointer;" class="ns1blankspaceRenderHeaderMore' + 
											'" id="ns1blankspaceRenderHeaderPage_' + sXHTMLContext + '-' +
											(iStartRow + iRows) + '" data-rowstart="' +
											(iStartRow + iRows) + '">' + 'more...' + '</td>';
										
						$('#ns1blankspaceRenderHeaderPage_' + sXHTMLContext + '-' + (iStartRow)).after(sHTML);
					
						$('#ns1blankspaceRenderHeaderPage_' + sXHTMLContext + '-' + (iStartRow + iRows)).click(function(event)
						{
							var sID = event.target.id;
							var sStart = $('#' + sID).attr('data-rowstart');
							$('#' + sID).html(ns1blankspace.xhtml.loadingSmall);
							if (oParam != undefined) {oParam.more = iMore;oParam.startRow = sStart} else {oParam = {more: iMore, startRow: sStart}};
							ns1blankspace.render.page.showMore(oParam);
						});
					}
					
					$('#ns1blankspaceRenderHeaderPage_' + sXHTMLContext + '-0').click(function(event)
					{
						ns1blankspace.render.page.showPage(this.id, sXHTMLContext);
					});
				},

	showMore:	function (oParam, oData)
				{
					
					var sXHTMLElementID = '';
					var iMore = -1;
					var iStartRow = 10;
					var iRows = 10;
					var iColumn = 0;
					var iMaximumColumns = 1;
					var sColumns = "title";
					var sIDColumns = '';
					var sFunctionOpen;
					var fFunctionClass;
					var sFunctionNewPage;
					var sClass;
					var sIdAdditional = '';
					var sIDSeperator = '-';
					var sBodyClass = '';
					var sXHTMLlFirstRow;
					var sXHTMLContext = '';
					var fFunctionShowRow;
					
					if (oParam != undefined)
					{
						if (oParam.more != undefined) {iMore = oParam.more}
						if (oParam.startRow != undefined) {iStartRow = oParam.startRow}
						if (oParam.rows != undefined) {iRows = oParam.rows}
						if (oParam.xhtmlElementId != undefined) {sXHTMLElementID = oParam.xhtmlElementId}
						if (oParam.columns != undefined) {sColumns = oParam.columns}
						if (oParam.idColumns != undefined) {sIDColumns = oParam.idColumns}
						if (oParam.functionOpen != undefined) {sFunctionOpen = oParam.functionOpen}
						if (oParam.functionClass != undefined) {fFunctionClass = oParam.functionClass}
						if (oParam.functionShowRow != undefined) {fFunctionShowRow = oParam.functionShowRow}
						if (oParam.idAdditional != undefined) {sIdAdditional = oParam.idAdditional}
						if (oParam.bodyClass != undefined) {sBodyClass = oParam.bodyClass}
						if (oParam.idSeperator != undefined) {sIDSeperator = oParam.idSeperator}
						if (oParam.xhtmlFirstRow != undefined) {sXHTMLlFirstRow = oParam.xhtmlFirstRow}
						if (oParam.functionNewPage != undefined) {sFunctionNewPage = oParam.functionNewPage}
						if (oParam.xhtmlContext != undefined) {sXHTMLContext = oParam.xhtmlContext}
					}
				
					if (iMore === -1)
					{
						alert('No more!')
					}
					else
					{
						if (oData === undefined)
						{
							var sData =	'id=' + iMore +
											'&startrow=' + iStartRow + 
											'&rows=' + iRows;
							
							$.ajax(
							{
								type: 'GET',
								url: ns1blankspace.util.endpointURI('CORE_SEARCH_MORE'),
								data: sData,
								dataType: 'json',
								success: function(data){ns1blankspace.render.page.showMore(oParam, data)}
							});
						}
						else
						{
							var aHTML = [];
						
							if ($('#ns1blankspaceRenderPage_' + sXHTMLContext + '-' + iStartRow).length === 0)
							{
								aHTML.push('<div id="ns1blankspaceRenderPage_' + sXHTMLContext + '-' + iStartRow + 
												'" class="ns1blankspaceRenderPage ns1blankspaceRenderPage_' + sXHTMLContext + '">');
							
								aHTML.push('<table class="' + sBodyClass + '">');
								
								if (sXHTMLlFirstRow != undefined)
								{
									aHTML.push(sXHTMLlFirstRow);
								}
					
								var iStartRow = parseInt(oData.startrow)
								var iRows = parseInt(oData.rows);
								var bMoreRows = (oData.morerows === "true");
												
								oParam.startRow = iStartRow + iRows;	
								
								var oRows = oData.data.rows;
						
								$(oRows).each(function() 
								{
									aHTML.push(fFunctionShowRow(this));
								});
								
								aHTML.push('</table>');
								
								aHTML.push('</div>');
								
								$('.ns1blankspaceRenderPage_' + sXHTMLContext).hide();
								$('.ns1blankspaceRenderPage_' + sXHTMLContext + ':last').after(aHTML.join(''));
								
								//$('.ns1blankspaceRowSelect' + sXHTMLContext).unbind('click');
								
								if (sFunctionOpen != undefined)
								{
									$('#ns1blankspaceRenderPage_' + sXHTMLContext + '-' + iStartRow + ' .ns1blankspaceRowSelect').button({
										text: false,
										icons: {
											primary: "ui-icon-play"
										}
									})
									.click(function() {
										eval(sFunctionOpen);
									})
									.css('width', '15px')
									.css('height', '20px')
								}
								
								$('#ns1blankspaceRenderHeaderPage_' + sXHTMLContext + '-' + iStartRow).html(((iStartRow)/iRows)+1);
								$('#ns1blankspaceRenderHeaderPage_' + sXHTMLContext + '-' + iStartRow).removeClass('ns1blankspaceRenderHeaderMore');
								$('#ns1blankspaceRenderHeaderPage_' + sXHTMLContext + '-' + iStartRow).addClass('ns1blankspaceRenderHeaderPage');

								$('#ns1blankspaceRenderHeaderPage_' + sXHTMLContext + '-' + iStartRow).unbind('click');
								
								$('#ns1blankspaceRenderHeaderPage_' + sXHTMLContext + '-' + iStartRow).click(function(event)
								{
									ns1blankspace.render.page.showPage(this.id, sXHTMLContext);
								});
							
								$('.ns1blankspaceRenderHeaderPage').removeClass('ns1blankspaceRenderHeaderPageSelected');
								$('#ns1blankspaceRenderHeaderPage_' + sXHTMLContext + '-' + (iStartRow)).addClass('ns1blankspaceRenderHeaderPageSelected');

								if (bMoreRows)
								{
									var sHTML = '<td style="width:5px; cursor:pointer;" class="ns1blankspaceRenderHeaderMore' + 
														'" id="ns1blankspaceRenderHeaderPage_' + sXHTMLContext + '-' +
														(iStartRow + iRows) + '" data-rowstart="' +
														(iStartRow + iRows) + '">' + 'more...' + '</td>';
													
									$('#ns1blankspaceRenderHeaderPage_' + sXHTMLContext + '-' + (iStartRow)).after(sHTML);

									$('#ns1blankspaceRenderHeaderPage_' + sXHTMLContext + '-' + (iStartRow + iRows)).click(function(event)
									{
										var sID = event.target.id;
										var sStart = $('#' + sID).attr('data-rowstart');
										$('#' + sID).html(ns1blankspace.xhtml.loadingSmall);
										if (oParam != undefined) {oParam.more = iMore; oParam.startRow = sStart} else {oParam = {more: iMore, startRow: sStart}};
										ns1blankspace.render.page.showMore(oParam);
									});
								}
								
								if (sFunctionNewPage != undefined)
								{
									eval(sFunctionNewPage);
								}
							}
						}
					}
				},

	showPage:	function (sXHTMLElementID, sXHTMLContext)
				{
					var aElement = sXHTMLElementID.split('-');
					
					$('.ns1blankspaceRenderHeaderPage').removeClass('ns1blankspaceRenderHeaderPageSelected');
					$('#' + sXHTMLElementID).addClass('ns1blankspaceRenderHeaderPageSelected');

					$('.ns1blankspaceRenderPage_' + sXHTMLContext).hide();
					$('#ns1blankspaceRenderPage_' + sXHTMLContext + '-' + aElement[1]).show();
				}
}

ns1blankspace.pdf = 
{
	create:		function (oParam, sReturn)
				{
					var sXHTMLElementID = 'ns1blankspaceSummaryCreatePDF';
					var iObject = ns1blankspace.object;
					var iObjectContext = ns1blankspace.objectContext;
					var sFileName = ns1blankspace.objectContextData.id + '.pdf'
					var sXHTMLContent = '';
					var bOpen = false;

					if (oParam)
					{
						if (oParam.object) {iObject = oParam.object}
						if (oParam.objectContext) {iObjectContext = oParam.objectContext}
						if (oParam.filename) {sFileName = oParam.filename}	
						if (oParam.xhtmlContent) {sXHTMLContent = oParam.xhtmlContent}
						if (oParam.open) {bOpen = oParam.open}
						if (oParam.xhtmlElementID) {sXHTMLElementID = oParam.xhtmlElementID}
					}

					if (sReturn === undefined)
					{
						$('#' + sXHTMLElementID).button(
						{
							label: 'Creating'
						});
						
						var sData = 'rf=TEXT&object=' + iObject;
						sData += '&objectcontext=' + iObjectContext;
						sData += '&filename=' + ns1blankspace.util.fs(sFileName);
						sData += '&xhtmlcontent=' + ns1blankspace.util.fs(sXHTMLContent);
						
						$.ajax(
						{
							type: 'POST',
							url: ns1blankspace.util.endpointURI('CORE_PDF_CREATE'),
							data: sData,
							dataType: 'text',
							success: function(data) {ns1blankspace.pdf.create(oParam, data)}
						});
					}	
					else	
					{
						var aReturn = sReturn.split('|');

						if (aReturn[1])
						{
							if (bOpen)
							{
								window.open('/download/' + aReturn[1])	
							}
							
							$('#' + sXHTMLElementID).button(
							{
								label: 'Open'
							})
							.click(function(event)
							{
								window.open('/download/' + aReturn[1])
							});
						}
						else
						{
							$('#' + sXHTMLElementID).button(
							{
								label: 'Error'
							})
							.click(function(event)
							{
								window.alert('An error occured while creating the PDF.');
							});
						}	
					}	

				}
}				

ns1blankspace.edit = {}

ns1blankspace.edit.editor = 
{
	addTag:		function (oParam)
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

ns1blankspace.show = 
				function (oParam)
				{
					var bRefresh = false;
					var sSelector = '#ns1blankspaceMain';
					var sClassSelector = 'div.ns1blankspaceControlMain';

					if (oParam)
					{
						if (oParam.refresh) {bRefresh = oParam.refresh}
						if (oParam.selector) {sSelector = oParam.selector}
						if (oParam.classSelector) {sClassSelector = oParam.classSelector}
					}
							
					$(ns1blankspace.xhtml.container).hide();

					$(sClassSelector).hide();

					$(sSelector).show();

					ns1blankspace.xhtml.divID = sSelector;
					
					if ($(sSelector).html() === '' || bRefresh)
					{
						$(sSelector).attr('data-loading', '1');
						$(sSelector).html(ns1blankspace.xhtml.loading);
					}	
				}			

ns1blankspace.extend =
{
	init: 		function (oParam, oResponse)
				{
					var iObject = ns1blankspace.object;
					var aCategories = [];
					var bSetApp = true;
					var iStep = 1;

					if (oParam != undefined)
					{
						if (oParam.object != undefined) {iObject = oParam.object}	
						if (oParam.categories != undefined) {aCategories = oParam.categories}
						if (oParam.setApp != undefined) {bSetApp = oParam.setApp}
						if (oParam.step != undefined) {iStep = oParam.step}
					}
					else
					{
						oParam = {}
					}

					if (iStep == 1)
					{
						if (ns1blankspace.extend.structure != undefined)
						{
							oParam.step = 2;
							ns1blankspace.extend.init(oParam)
						}
						else
						{
							if (oResponse == undefined)
							{	
								var oSearch = new AdvancedSearch();
								oSearch.method = 'SETUP_STRUCTURE_OBJECT_LINK_SEARCH';
								oSearch.addField('objecttext,categorytext,category,object');
								oSearch.rows = 100;
								oSearch.async = false;  //LOOK AT REMOVE THIS
								oSearch.sort('object', 'asc');
								oSearch.getResults(function(data) {ns1blankspace.extend.init(oParam, data)})
							}
							else
							{
								ns1blankspace.extend.structure = oResponse.data.rows;
								oParam.step = 2;
								ns1blankspace.extend.init(oParam)
							}
						}		
					}	

					if (iStep == 2)
					{	
						if (oResponse == undefined)
						{	
							ns1blankspace.objectExtended = false;

							$(ns1blankspace.extend.structure).each(function()
							{
								if (this.elements === undefined)
								{	
									aCategories.push(this.category);
								}
								else
								{
									ns1blankspace.objectExtended = true;
								}	
							})	

							oParam.categories = aCategories;

							if (aCategories.length == 0)
							{
								if (bSetApp)
								{	
									oParam.extendInit = true;
									ns1blankspace.app.set(oParam);
								}	
							}	
							else
							{	
								var oSearch = new AdvancedSearch();
								oSearch.method = 'SETUP_STRUCTURE_ELEMENT_SEARCH';		
								oSearch.addField('structure,backgroundcolour,caption,category,categorytext,datatype,datatypetext,' +
													'description,displayorder,hint,id,notes,notestype,notestypetext,' +
													'reference,structure,structuretext,textcolour,title');
								oSearch.rows = 1000;
								oSearch.addFilter('category', 'IN_LIST', aCategories.join(','))
								oSearch.sort('category', 'asc');
								oSearch.sort('displayorder', 'asc');
								oSearch.async = false;  //LOOK AT REMOVE THIS
								
								oSearch.getResults(function(data) {ns1blankspace.extend.init(oParam, data)});
							}	
						}
						else
						{
							var oElements = oResponse.data.rows;
						
							$(ns1blankspace.extend.structure).each(function(i, v)
							{
								this.elements = $.grep(oElements, function (a) {return a.category == v.category;});

								if (this.elements.length > 0)
								{
									ns1blankspace.objectExtended = true;
								}	
							});

							if (bSetApp)
							{	
								oParam.extendInit = true;
								ns1blankspace.app.set(oParam)
							}	
						}
					}	
				},

	elements: 	function (oParam)
				{
					var iObject = ns1blankspace.object;
		
					if (oParam != undefined)
					{
						if (oParam.object != undefined) {iObject = oParam.object}
					}

					var aElements = [];

					$($.grep(ns1blankspace.extend.structure, function (a) {return a.object == iObject;})).each(function(i,v)
					{
						$(v.elements).each(function(j,k)
						{
							if (k.datatype == 2)
							{	
								aElements.push('se' + k.id + 'text');
							}	
							aElements.push('se' + k.id);
						});
					})	

					return aElements.join(',');
				},

	layout: 	function (oParam)
				{
					var iObject = ns1blankspace.object;
		
					if (oParam != undefined)
					{
						if (oParam.object != undefined) {iObject = oParam.object}
					}

					var aHTMLTR = [];
					var aHTMLDIV = [];

					$($.grep(ns1blankspace.extend.structure, function (a) {return a.object == iObject;})).each(function()
					{	
						var sTitle = this.title;
						if (sTitle == undefined) {sTitle = this.categorytext}

						aHTMLTR.push('<tr><td id="ns1blankspaceControl-' + this.category + '" class="ns1blankspaceControl">' +
											sTitle + '</td></tr>');

						aHTMLDIV.push('<div id="ns1blankspaceMain' + this.category + '" class="ns1blankspaceControlMain"></div>');
					});

					var aHTML = [];

					if (aHTMLTR.length > 0)
					{	
						aHTML.push('<table class="ns1blankspaceControl">');
						aHTML.push(aHTMLTR.join(''));
						aHTML.push('</table>');
					}
					
					$('table.ns1blankspaceControl :last').append(aHTML.join(''));	
					$('#ns1blankspaceMain').append(aHTMLDIV.join(''));

					$($.grep(ns1blankspace.extend.structure, function (a) {return a.object == iObject;})).each(function()
					{
						$('#ns1blankspaceControl-' + this.category).click(function(event)
						{
							ns1blankspace.show({selector: '#ns1blankspaceMain' + (this.id).split('-')[1]});
							ns1blankspace.extend.show({category: (this.id).split('-')[1]});
						});
					});	
				},

	show: 		function (oParam)
				{
					var iCategory;
					var aHTML = [];
					var fShow;

					if (oParam != undefined)
					{
						if (oParam.category != undefined) {iCategory = oParam.category}
					}

					if (iCategory)
					{
						if ($('#ns1blankspaceMain' + iCategory).attr('data-loading') == '1')
						{
							$('#ns1blankspaceMain' + iCategory).attr('data-loading', '');

							var oCategory = $.grep(ns1blankspace.extend.structure, function (a) {return a.category == iCategory;})

							if (oCategory.length != 0)
							{
								oCategory = oCategory[0];

								if (oCategory.show != undefined) {fShow = oCategory.show}

								if (fShow)
								{
									fShow();
								}
								else	
								{	
									aHTML.push('<table class="ns1blankspace" style="width:50%">');

									$(oCategory.elements).each(function()
									{	
										var sCaption = this.caption;
										if (sCaption == '') {sCaption = this.title}

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														sCaption +
														'</td></tr>' +
														'<tr class="ns1blankspace">');

										if (this.datatype == 4)
										{	
											aHTML.push('<td class="ns1blankspaceText">' +
												'<input id="ns1blankspaceStructure_' + this.id + '" class="ns1blankspaceText">');
										}
										else if (this.datatype == 3)
										{	
											aHTML.push('<td class="ns1blankspaceDate">' +
												'<input id="ns1blankspaceStructure_' + this.id + '" class="ns1blankspaceDate">');
										}
										else if (this.datatype == 2)
										{
											aHTML.push('<td class="ns1blankspaceSelect">' +
												'<input id="ns1blankspaceStructure_' + this.id + '" class="ns1blankspaceSelect"' +
												' data-method="SETUP_STRUCTURE_ELEMENT_OPTION_SEARCH"' +
												' data-methodFilter="element-EQUAL_TO-' + this.id + '">');
										}
										else if (this.datatype == 1)
										{
											aHTML.push('<td class="ns1blankspaceTextMulti">' +
												'<textarea rows="3" cols="35" id="ns1blankspaceStructure_' + this.id + '" class="ns1blankspaceTextMulti"></textarea>');
										}
											
										aHTML.push('</td></tr>');
									});

									aHTML.push('</table>');

									$('#ns1blankspaceMain' + iCategory).html(aHTML.join(''));

									$('input.ns1blankspaceDate').datepicker({ dateFormat: 'dd M yy' });
								}	
							}

							if (ns1blankspace.objectContextData != undefined)
							{
								$(oCategory.elements).each(function()
								{
									if (this.datatype == 2)
									{	
										$('#ns1blankspaceStructure_' + this.id).val(ns1blankspace.objectContextData['se' + this.id + 'text']);
										$('#ns1blankspaceStructure_' + this.id).attr('data-id', ns1blankspace.objectContextData['se' + this.id]);
									}
									else
									{
										$('#ns1blankspaceStructure_' + this.id).val(ns1blankspace.objectContextData['se' + this.id]);
									}	
								});	
							}	
						}	
					}
				},

	save:   	function (oParam)
				{
					var iObject = ns1blankspace.object;
		
					if (oParam != undefined)
					{
						if (oParam.object != undefined) {iObject = oParam.object}
					}

					var sData = '';

					$($.grep(ns1blankspace.extend.structure, function (a) {return a.object == iObject;})).each(function(i,v)
					{				
						if ($('#ns1blankspaceMain' + v.category).html() != '')
						{
							var oCategory = $.grep(ns1blankspace.extend.structure, function (a) {return a.category == v.category;})

							if (oCategory.length != 0)
							{
								oCategory = oCategory[0];

								$(oCategory.elements).each(function(j,k)
								{	
									if (this.datatype == 2)
									{
										sData += '&se' + k.id + '=' + ns1blankspace.util.fs($('#ns1blankspaceStructure_' + k.id).attr('data-id'));
									}
									else
									{	
										sData += '&se' + k.id + '=' + ns1blankspace.util.fs($('#ns1blankspaceStructure_' + k.id).val());
									}	
								});	
							}	
						}		
					});

					return sData;

				}						
}