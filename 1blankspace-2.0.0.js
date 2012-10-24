/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */

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
	var n = this, c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "," : d, t = t == undefined ? "." : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
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
		sValue = sValue.replace(/-/g, '&#45;')
		sValue = sValue.replace(/@/g, '&#64;')
		sValue = sValue.replace(/\//g, '&#47;')
		sValue = sValue.replace(/"/g, '&quot;')
		sValue = sValue.replace(/\\/g, '&#39;')
	}
	else
	{
		sValue = sValue.replace(/\&amp;/g,'&');
		sValue = sValue.replace(/\&lt;/g,'<');
		sValue = sValue.replace(/\&gt;/g,'>');
		sValue = sValue.replace(/\&#45;/g, '-')
		sValue = sValue.replace(/\&#64;/g, '@')
		sValue = sValue.replace(/\&#47;/g, '/')
		sValue = sValue.replace(/\&quot;/g, '"')
		sValue = sValue.replace(/\&#39;/g, '\'')
		for ( var i = 0; i < aFind.length; i++ ) 
		{
			var regex = new RegExp(aFind[i], "gi");
			sValue = sValue.replace(regex, aReplace[i]);
		}
	}
	
	return sValue;
};

String.method('trim', function () {return this.replace(/^\s+|\s+$/g, '');});

var ns1blankspace = {};

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

	if (window.location.hash == '#PASSWORDEXPIRED')
	{
		ns1blankspace.logon.changePassword.show();
	}
	else
	{
		ns1blankspace.app.start();
	}
};

ns1blankspace.app =
{
	loadScript: 	function (sScript)
					{
						var xhtmlHeadID = document.getElementsByTagName("head")[0]; 
						var oScript = document.createElement('script');
						oScript.type = 'text/javascript';
						oScript.src = sScript;
						xhtmlHeadID.appendChild(oScript);
					},

	init: 			function ()
					{
						if $('#ns1blankspace').length == 0
						{
							$('body').append('<div id="ns1blankspace" class="interface">' +
												'<div id="ns1blankspaceViewControl" class="ns1blankspaceViewControl"></div>' +
												'<div id="ns1blankspaceControl" class="ns1blankspaceControl"></div>' +
												'<div id="ns1blankspaceMain" class="ns1blankspaceMain"></div>' +
												'<div id="ns1blankspaceFooter" class="ns1blankspaceFooter"></div>' +
												'<div id="ns1blankspaceBox" class="ns1blankspaceBox"></div>' +
												'<div id="ns1blankspaceDialog"></div>' +
												'</div>');
						}		

						$('#divInterfaceMasterViewportControl').html('Loading...')

						ns1blankspace.option = {};
						ns1blankspace.timer = {};
						ns1blankspace.counter = {};
						ns1blankspace.xhtml = {};
						ns1blankspace.user = {};
						ns1blankspace.data = {};
						ns1blankspace.debug = {};
						ns1blankspace.history = {};

						ns1blankspace.version = 2;

						ns1blankspace.option.showSpeed = 0;
						ns1blankspace.option.showSpeedOptions = 0;
						ns1blankspace.option.hideSpeed = 0;
						ns1blankspace.option.hideSpeedOptions = 0;
						ns1blankspace.option.typingWait = 400;
						ns1blankspace.option.logonStayOnDocument = true;
						ns1blankspace.option.setFocus = true;
						ns1blankspace.option.richTextEditing = true;
						ns1blankspace.option.setupURI = '/ondemand/setup/';
						ns1blankspace.option.dateFormat = 'dd M yy';

						ns1blankspace.timer.messaging = 0;
						ns1blankspace.timer.delay;

						ns1blankspace.setupViewport = false;
						ns1blankspace.inputDetected = false;
						ns1blankspace.unloadWarning = false;
						ns1blankspace.systemAdmin = false;

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
						ns1blankspace.xhtml.container = '#ns1blankspaceOptionsContainer'

						ns1blankspace.user.commonname = '';
						ns1blankspace.user.email = '';
						ns1blankspace.user.networkGroups = '';
						ns1blankspace.user.id = -1;
						ns1blankspace.user.contactperson = -1;
						ns1blankspace.setupShow = false;
							
						ns1blankspace.data.searchSource = {text: 1, browse: 2, select: 3, all: 4}

						ns1blankspace.debug.appContext = 'start';

						ns1blankspace.param;

						ns1blankspace.history.viewport = ['ns1blankspaceHomeShow()']
						ns1blankspace.history.currentIndex = 0
						ns1blankspace.history.lastDestinationInstruction = '';
						ns1blankspace.history.list = [];
						ns1blankspace.user.networkGroups = '';
						ns1blankspace.setupShow = false;
	
						$(document).ajaxError(
							function(oEvent, oXMLHTTPRequest, oAjaxOptions, oError) 
								{
									alert('Error: ' + oAjaxOptions.url + ' \nException: ' + oError + ' \nReturned: ' + oXMLHTTPRequest.responseText);
								}
						);	

						$.ajaxSetup(
						{
							cache: false
						});
	
						if (navigator.platform.indexOf('iPad') != -1 || navigator.platform.indexOf('iPhone') != -1) 
						{
							ns1blankspace.option.setFocus = false;
						}	 

						if ($('#scriptControl').length == 0)
						{
							this.loadScript('/jscripts/jqueryui/jqueryui-1.8.12.min.js');
							this.loadScript('/jscripts/jqueryui/jquery-ui-1.8.11.custom.min.js');
							this.loadScript('/jscripts/jqueryui/jqueryui-timepicker.js');
							this.loadScript('/jscripts/jquery.cookie.js');
							this.loadScript('/jscripts/tiny_mce-3.4.4/tiny_mce.js');
							this.loadScript('/jscripts/fullcalendar.min.js');
							this.loadScript('/jscripts/jquery.touchwipe.1.1.1.min.js');
							this.loadScript('/jscripts/1blankspace-1.0.4.js');
							this.loadScript('/jscripts/1blankspace.advancedsearch-1.0.3.js');
							this.loadScript('/jscripts/1blankspace.developer.control-1.0.0.js');
							this.loadScript('/jscripts/1blankspace.developer.home-1.0.0.js');
							this.loadScript('/jscripts/1blankspace.developer.space-1.0.0.js');
							this.loadScript('/jscripts/1blankspace.developer.membership-1.0.0.js');
							this.loadScript('/jscripts/1blankspace.setup-1.0.0.js');
							this.loadScript('/jscripts/1blankspace.setup.website-1.0.0.js');
							this.loadScript('/jscripts/1blankspace.setup.website.form-1.0.0.js');
							this.loadScript('/jscripts/1blankspace.setup.structure-1.0.2.js');
							this.loadScript('/jscripts/1blankspace.setup.space-1.0.1.js');
							this.loadScript('/jscripts/1blankspace.setup.automation-1.0.0.js');
							this.loadScript('/jscripts/1blankspace.setup.user-1.0.0.js');
							this.loadScript('/jscripts/1blankspace.setup.user.role-1.0.0.js');
							this.loadScript('/jscripts/1blankspace.setup.networkgroup-1.0.0.js');
						}

						$('td.ns1blankspaceControl').live('click', function()
						{
							ns1blankspace.history.instruction({xhtmlElementID: this.id});
						});
						
						$('.ns1blankspaceControl').live('mousedown', function() 
						{
							$('td.ns1blankspaceControlHighlight').removeClass('ns1blankspaceControlHighlight');
						});

						$('.ns1blankspaceControl').live('mouseup', function() 
						{
							$(this).addClass('ns1blankspaceControlHighlight');
						});

						$('.ns1blankspaceWatermark').live('focus', function() 
						{
							if ($(this).hasClass('ns1blankspaceWatermark'))
							{
								$(this).val('');
								$(this).removeClass('ns1blankspaceWatermark');
							}	
						});		
							
						$('.ns1blankspaceSearch').live('focus', function() 
						{		
							$(this).addClass('ns1blankspaceHighlight');
							
							ns1blankspace.xhtml.divID = this.id;
							
							$(ns1blankspace.xhtml.container).html('');
							$(ns1blankspace.xhtml.container).show();
							$(ns1blankspace.xhtml.container).offset(
							{ 
								top: $('#' + ns1blankspace.xhtml.divID).offset().top,
								left: $('#' + ns1blankspace.xhtml.divID).offset().left + $('#' + ns1blankspace.xhtml.divID).width() - 10
							});
									
							$(ns1blankspace.xhtml.container).html('<span id="ns1blankspaceSearchOptions" class="ns1blankspaceSearchOptions"></span>');
							
							$('#ns1blankspaceSearchOptions').button({
								text: false,
								icons: {
									primary: "ui-icon-triangle-1-s"
								}
							})
							.click(function() {
								ns1blankspace.search.show({xhtmlElementID: ns1blankspace.xhtml.divID, source: 4});
							})
							.css('width', '14px')
							.css('height', '23px')
						});
							
						$('.ns1blankspaceSearch').live('keyup', function()
						{
							ns1blankspace.search.show({xhtmlElementID: ns1blankspace.xhtml.divID, source: 1, minimumLength: 3});	
						});	
							
						$('.ns1blankspaceSearch').live('blur', function() 
						{
							$(this).removeClass('ns1blankspaceHighlight');
						});
						
						$('.ns1blankspaceSearchAddress').live('focus', function() 
						{
							ns1blankspace.xhtml.divID = this.id;
							$(ns1blankspace.xhtml.container).html('');
							$(ns1blankspace.xhtml.container).show();
							$(ns1blankspace.xhtml.container).offset({ top: $(this).offset().top, left: $(this).offset().left + $(this).width() - 10});
							$(ns1blankspace.xhtml.container).html('<span id="ns1blankspaceSearchOptions" class="ns1blankspaceSearchOptions"></span>');
							
							$('#ns1blankspaceSearchOptions').button( {
								text: false,
								icons: {
									primary: "ui-icon-triangle-1-s"
								}
							})
							.click(function() {
								ns1blankspace.search.address.show(ns1blankspace.xhtml.divID);
							})
							.css('width', '14px')
							.css('height', '23px')
						});
						
						$('.ns1blankspaceSearchAddress').live('blur', function() 
						{
							$(ns1blankspace.xhtml.container).hide();
						});
						
						$('.ns1blankspaceSearchContact').live('keyup', function()
						{
							ns1blankspace.search.contact.show(ns1blankspace.xhtml.divID, 1, 3);	
						});	
						
						$('.ns1blankspaceSearchContact').live('focus', function() 
						{
							ns1blankspace.xhtml.divID = this.id;
							$(ns1blankspace.xhtml.container).html('');
							$(ns1blankspace.xhtml.container).show();
							$(ns1blankspace.xhtml.container).offset({ top: $(this).offset().top, left: $(this).offset().left + $(this).width() - 10});
							$(ns1blankspace.xhtml.container).html('<span id="ns1blankspaceSearchOptions" class="ins1blankspaceSearchOptions"></span>');
							
							$('#ns1blankspaceSearchOptions').button( {
								text: false,
								icons: {
									primary: "ui-icon-triangle-1-s"
								}
							})
							.click(function() {
								ns1blankspace.search.contact.show(ns1blankspace.xhtml.divID, 4);
							})
							.css('width', '14px')
							.css('height', '23px')
						});
						
						$('.ns1blankspaceSearchContactEmail').live('focus', function() 
						{
							ns1blankspace.xhtml.divID = this.id;
							$(ns1blankspace.xhtml.container).html('');
							$(ns1blankspace.xhtml.container).show();
							$(ns1blankspace.xhtml.container).offset({ top: $(this).offset().top, left: $(this).offset().left + $(this).width()});
							$(ns1blankspace.xhtml.container).html('<span id="ns1blankspaceSearchOptions" class="ns1blankspaceSearchOptions"></span>');
							
							$('#ns1blankspaceSearchOptions').button( {
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
							.css('height', '23px')
						});
						
						$('.ns1blankspaceSearchContactEmail').live('keyup', function() 
						{
							if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
							
							var sFunction = "ns1blankspace.contact.email.search(ns1blankspace.xhtml.divID, {" +
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
					},
							
	start: 			function ()
					{
						$.ajax(
						{
							type: 'GET',
							url: '/ondemand/core/?method=CORE_GET_USER_NAME',
							dataType: 'json',
							cache: false,
							success: function(data) 
							{
								if (data.status == 'ER')
								{
									ns1blankspace.logon.show();
								}
								else
								{
									this.show(data);
								}	
							}
						})
					},

	show: 			function (oResponse)	
					{
						var aHTML = [];
						var h = -1;

						ns1blankspace.user = oResponse.user;
						ns1blankspace.userUnrestricted = (oResponse.unrestrictedaccess = 'Y' || oResponse.unrestrictedaccess == undefined ? true : false);
						ns1blankspace.spaceText = oResponse.spacename;
						ns1blankspace.space = oResponse.space;
						ns1blankspace.userSpace = oResponse.space;
						ns1blankspace.userSpaceText = oResponse.spacename
						ns1blankspace.contactBusiness = oResponse.contactbusiness;
						ns1blankspace.contactPerson = oResponse.contactperson;

						ns1blankspace.user.commonname = oResponse.userlogonname;
						gsUserID = oResponse.user;
						gsUserContactPersonID = oResponse.contactperson;
						ns1blankspace.user.email = oResponse.email;
						ns1blankspace.systemAdmin = oResponse.systemadmin;
						
						interfaceControlSecurity();
						
						ns1blankspace.unloadWarning = true;
							
						aHTML[++h] = '<div id="ns1blankspaceContainer" class="ns1blankspace">';
						
						$('#ns1blankspaceHeaderColumn2').css('width', '250px');
						$('#ns1blankspaceHeaderColumn2').html('<div id="ns1blankspaceSpaceText">' + ns1blankspace.spaceText + '</div>' +
														'<div id="ns1blankspaceLogonName">' + ns1blankspace.user.commonname + '</div>')
						
						aHTML[++h] = '<div id="ns1blankspaceViewControlContainer" class="ns1blankspaceControl">';
						
							aHTML[++h] = '<div id="ns1blankspaceViewControlHomeContainer">' +
											'<span id="ns1blankspaceViewControlHome" class="ns1blankspaceControl">&nbsp;</span>' +
											'<span id="ns1blankspaceViewControlHomeOptions" class="ns1blankspaceControl">&nbsp;</span>' +
											'</div>';
											
							aHTML[++h] = '<div id="ns1blankspaceViewControlHistoryContainer">' +
											'<span id="ns1blankspaceViewControlBack" class="ns1blankspaceControl">&nbsp;</span>' +
											'<span id="ns1blankspaceViewControlRefresh" class="ns1blankspaceControl">&nbsp;</span>' +
											'<span id="ns1blankspaceViewControlForward" class="ns1blankspaceControl">&nbsp;</span>' +
											'</div>';				
									
							aHTML[++h] = '<div id="ns1blankspaceViewControlSetContainer" class="ns1blankspaceControl">' +
											'<span id="ns1blankspaceViewControlSet" class="ns1blankspaceControl">&nbsp;</span>' +
											'</div>';
											
							aHTML[++h] = '<div id="ns1blankspaceViewControlSearchContainer">' +
											'<input id="ns1blankspaceViewControlSearch" class="ns1blankspaceControl">' +
											'</div>';
											
							aHTML[++h] = '<div id="ns1blankspaceViewControlSearchStatus"></div>';
											
							aHTML[++h] = '<div id="ns1blankspaceViewControlNewContainer">' +
											'<span id="ns1blankspaceViewControlNew" class="ns1blankspaceControl">New</span>' +
											'</div>';
											
							aHTML[++h] = '<div id="ns1blankspaceViewControlActionContainer">' +
											'<span id="ns1blankspaceViewControlAction" class="ns1blankspaceControl"></span>' +
											'<span id="ns1blankspaceViewControlActionOptions" class="ns1blankspaceControl">&nbsp;</span>' +
											'</div>';
							
							aHTML[++h] = '<div id="ns1blankspaceViewControlActionStatus" class="ns1blankspaceControl">&nbsp;</div>';
							
							if (ns1blankspace.setupShow) 
							{

								aHTML[++h] = '<div id="ns1blankspaceViewControlSetupContainer">' +
												'<input type="checkbox" id="ns1blankspaceViewControlSetupSwitch" class="ns1blankspaceControl"/>' +
												'<label style="font-size:0.875em;" for="ns1blankspaceControlSetupSwitch">&nbsp;</label>' +
												'</div>';
							}				
							
							aHTML[++h] = '<div id="ns1blankspaceViewControlHelpContainer">' + 
											'<span id="ns1blankspaceViewControlHelp" class="ns1blankspaceControl">&nbsp;</span>' +
											'</div>';
						
						aHTML[++h] = '</div>';
						
						aHTML[++h] = '</div>';
						
						aHTML[++h] = '<div id="ns1blankspaceViewportControlBrowse" class="ns1blankspaceControl">&nbsp;</div>';
						
						aHTML[++h] = '<div id="ns1blankspaceOptionsContainer" class="ns1blankspaceOptionsContainer">&nbsp;</div>';
						aHTML[++h] = '<div id="ns1blankspaceDialog" class="divns1blankspaceDialog">&nbsp;</div>';
						
						$('#ns1blankspaceViewControlContainer').html(aHTML.join(''));
						
						$('#ns1blankspaceControlHome')
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
								.parent()
									.buttonset();
						
						$('#ns1blankspaceControlBack')
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
						
						$('#ns1blankspaceControlView')
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
						
						$('#spanns1blankspaceViewportControlNew')
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
						
						$('#spanns1blankspaceViewportControlAction')
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
															
						$('#ns1blankspaceControlSetupSwitch')
							.button({
										text: false,
										label: 'Set up your system.  Once finished click on this icon again.',
										icons: {
											primary: "ui-icon-gear"
										}})
							.css('font-size', '0.75em')			
							.click(function() 
							{
								ns1blankspace.setup.switch(this);
							});	
						
						$('#ns1blankspaceControlHelp')
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
						})

						$('#ns1blankspaceViewportSpaceText').click(function(event)
						{
							ns1blankspace.control.space.show(this);
						})
						
						if (ns1blankspace.option.showBrowsing)
						{
							$('#divns1blankspaceViewportControlBrowse').html(ns1blankspaceViewportBrowse());
						}
						else
						{
							$('#divns1blankspaceViewportControlBrowse')
								.css('height', '1px')
								.css('border-width', '0px');
								
							$('#divInterfaceViewportControl')
								.css('top', '90px');
								
							$('#divInterfaceMain')
								.css('top', '90px');
						}
						
						$("#ns1blankspaceControlContainer").touchwipe({
								wipeLeft: function() {ns1blankspace.history.view({instruction: 3});},
								wipeRight: function() {ns1blankspace.history.view({instruction: 2});},
								min_move_x: 35,
								min_move_y: 35,
								preventDefaultEvents: true
								});
						
						interfaceControlSetMasterViewport();
						
						if (gbReturnToLast) 
						{
							ns1blankspace.history.view({instruction: 8})
						}
						else
						{
							ns1blankspace.home.show();  //??? .init()
						}	
						
						$('#ns1blankspaceControlSearch').focus();	
					},

	reset:		function ()
				{				
					$('#ns1blankspaceControlSearch').unbind('keyup');
					$('#ns1blankspaceControlSearch').unbind('click');
					$('#ns1blankspaceControlSearch').unbind('click');
					$('#ns1blankspaceControlSearchOptions').unbind('click');
					$('#ns1blankspaceControlNew').unbind('click');
					$('#ns1blankspaceControlNewOptions').unbind('click');
					$('#ns1blankspaceControlAction').unbind('click');
					$('#ns1blankspaceControlActionOptions').unbind('click');
					$('#ns1blankspaceControlSetup').unbind('click');
					$('#ns1blankspaceControlSetupOptions').unbind('click');
					$('#ns1blankspaceControlHelp').unbind('click');
					$('#ns1blankspaceControlHelpOptions').unbind('click');
					$('td.interfaceViewportMasterControlBrowse').unbind('click');
					$('td.interfaceViewportMasterControlBrowseAll').unbind('click');
					$('#divns1blankspaceViewportControlActionStatus').text('');
					if (ns1blankspace.timer.messaging != 0) {clearInterval(ns1blankspace.timer.messaging)};
					ns1blankspace.inputDetected = false;
					ns1blankspace.xhtml.action = '';
				},

	set: 		function (oParam)
				{
					var bShowHome;
					var sNamespace = ns1blankspace.objectName;
					var bNew;

					if (oParam != undefined)
					{
						if (oParam.namespace != undefined) {bNamespace = oParam.namespace}
						if (oParam.showHome != undefined) {bShowHome = oParam.showHome}	
						if (oParam.new != undefined) {bNew = oParam.new}	
					}	

					if (sNamespace)
					{
						if (bShowHome)
						{
							ns1blankspace.history.view({
								newDestination: 'ns1blankspace["' + sNamespace + '"].init({showHome: true});',
								move: false
								})		
						}
						
						$('#ns1blankspaceViewControlSet').button(
						{
							label: ns1blankspace.viewName
						});
						
						$('#ns1blankspaceViewControlSearch').keyup(function(event)
						{
							if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
					        ns1blankspace.timer.delayCurrent = setTimeout('ns1blankspace["' + sNamespace + '"].search.show("ns1blankspaceViewControlSearch")', ns1blankspace.option.typingWait);
						});
						
						$('#ns1blankspaceViewControlSearch').click(function(event)
						{
							ns1blankspace["' + sNamespace + '"].search.show('inputns1blankspaceViewportControlSearch')
						});
						
						$('#ns1blankspaceViewControlSearchOptions').click(function(event)
						{
							ns1blankspace["' + sNamespace + '"].search.options.show();
						});
						
						$('#ns1blankspaceViewControlNew').click(function(event)
						{
							ns1blankspace["' + sNamespace + '"].new();
						})
						
						$('#ns1blankspaceViewControlNewOptions').click(function(event)
						{
							ns1blankspace["' + sNamespace + '"].new.options();
						});
						
						$('#ns1blankspaceViewportControlAction').click(function(event)
						{
							ns1blankspace["' + sNamespace + '"].save.send();
						});
						
						$('ns1blankspaceViewportControlAction').button({disabled: true});
						
						$('#ns1blankspaceViewportControlActionOptions').click(function(event)
						{
							var aHTML = [];
							var h = -1;
							
							aHTML[++h] = '<table id="tableinterfaceActionOptions" class="interfaceActionOptions">';
											
							aHTML[++h] = '<tr id="trinterfaceActionOptions" class="interfaceActionOptions">' +
											'<td id="tdinterfaceActionOptionsDelete" class="interfaceActionOptions">' +
											'Delete' +
											'</td>' +
											'</tr>';

							aHTML[++h] = '</table>';

							ns1blankspace["' + sNamespace + '"].save.action.show();

							//ns1blankspaceViewportActionShow(this, aHTML.join(''), "interfaceContactPersonActionOptionsBind()");
						});
						
						$('#ns1blankspaceViewControlActionOptions').button({disabled: true});
							
						$('#ns1blankspaceControl').html('');	

						if (ns1blankspace.option.setFocus) {$('#ns1blankspaceViewControlSearch').focus()};

						if (bNew) 
						{
							ns1blankspace["' + sNamespace + '"].new();
						}
						else
						{
							if (bShowHome) {ns1blankspace["' + sNamespace + '"].home()};
						}
				}				
}

ns1blankspace.history =
{
	control: 		function (oParam)
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
					
					$.each(ns1blankspace.history.list, function(index) 
					{ 
						if ((this.object == iObject) && (this.objectContext == iObjectContext))
						{
							if (sFunctionDefault != undefined)
							{
								sXHTMLElementID = this.xhtmlElementID
							}
							else
							{
								ns1blankspace.history.list.splice(index,1)
							}	
						}
					});
					
					if (sFunctionDefault == undefined)
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
						if (sXHTMLElementID == undefined)
						{
							eval(sFunctionDefault);
						}
						else
						{
							$('.ns1blankspaceControl').removeClass('ns1blankspaceControlHighlight')
							$('#' + sXHTMLElementID).addClass('ns1blankspaceControlHighlight')
							$('#' + sXHTMLElementID).click()
						}
					}
				},

	view: 		function (oParam)
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
							
							if (iInstruction == 1 && sDestinationInstructions != undefined)
							{
								if (sDestinationInstructions == ns1blankspace.history.lastDestinationInstruction)
								{
									var aTmp = sDestinationInstructions.split(';');
									
									$.each(aTmp, function(index) 
									{ 
										if (this == '')
										{
											aTmp.splice(index,1)
										}
									});
									
									if (aTmp.length == 1) 
									{
										$.each(ns1blankspace.history.viewport, function(index) 
										{ 
											if (this == sDestinationInstructions)
											{
												ns1blankspace.history.viewport.splice(index,1)
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
									ns1blankspace.history.viewport.push(sDestinationInstructions);
									ns1blankspace.history.currentIndex = ns1blankspace.history.viewport.length - 1;
									
									var sData = 'value=' + ns1blankspace.util.fs(ns1blankspace.history.viewport.slice(-2).toString());
									
									$.ajax(
									{
										type: 'POST',
										url: '/ondemand/core/?method=CORE_PROFILE_MANAGE&advanced=4',
										data: sData,
										dataType: 'text'
									})
								}		
							}	
							
							if (iInstruction == 2)
							{
								ns1blankspace.history.currentIndex = ns1blankspace.history.currentIndex - iInstructionCount;
								if (ns1blankspace.history.currentIndex < 0) {ns1blankspace.history.currentIndex = 0}
							}
							
							if (iInstruction == 3)
							{
								ns1blankspace.history.currentIndex = ns1blankspace.history.currentIndex + iInstructionCount;
								if (ns1blankspace.history.currentIndex > ns1blankspace.history.viewport.length - 1) {ns1blankspace.history.currentIndex = ns1blankspace.history.viewport.length - 1}
							}
							
							if (iInstruction == 4)
							{
								ns1blankspace.history.viewport.length = 0;
								ns1blankspace.history.currentIndex = 0;
							}	
							
							if (iInstruction == 5)
							{
								ns1blankspace.history.currentIndex = ns1blankspace.history.viewport.length - 1;
							}	
							
							if (iInstruction == 6)
							{
								ns1blankspace.history.currentIndex = 0;
							}	
							
							if (iInstruction == 7)
							{
								//refresh
							}	
								
							if (iInstruction == 8)
							{
								$.ajax(
								{
									type: 'GET',
									url: '/ondemand/core/?method=CORE_PROFILE_SEARCH&advanced=4&rf=TEXT',
									dataType: 'text',
									async: false,
									success: function(data) {
										data = data.replace('OK|RETURNED|', '')
										if (data == '')
										{
											ns1blankspace.history.viewport.push('ns1blankspaceHomeShow()');
										}	
										else
										{
											ns1blankspace.history.viewport = data.split(',');
											ns1blankspace.history.currentIndex = ns1blankspace.history.viewport.length - 1
										}	
									}
								})
							}		
								
							$('#spanns1blankspaceViewportControlBack').button("destroy");	
							$('#spanns1blankspaceViewportControlRefresh').button("destroy");	
							$('#spanns1blankspaceViewportControlForward').button("destroy");	
							
							var bBack = true;
							var bForward = true;
							
							if (ns1blankspace.history.currentIndex > 0)
							{	
								bBack = false;
							};
							
							if (ns1blankspace.history.currentIndex < ns1blankspace.history.viewport.length - 1)
							{
								bForward = false;					
							};			
					
							$('#ns1blankspaceControlBack')
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
					
							$('#ns1blankspaceControlBack')
								.button({disabled: bBack})
					
							$('#ns1blankspaceControlForward')
								.button({disabled: bForward})
					
							sDestinationInstructions = ns1blankspace.history.viewport[ns1blankspace.history.currentIndex]
							ns1blankspace.history.lastDestinationInstruction = sDestinationInstructions;
							
							if (bMove)
							{
								if (sDestinationInstructions != '' && sDestinationInstructions != undefined)
								{
									eval(sDestinationInstructions)
								}	
							}	
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
					var sXHTMLElementID = "divInterfaceBox";
					
					if (oParam != undefined)
					{
						if (oParam.objectContext != undefined) {iObjectContext = oParam.objectContext}
						if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
					}	
						
					aHTML[++h] = '<table id="ns1blankspaceLogonContainer" class="ns1blankspaceLogon">';
					
					aHTML[++h] = '<tr class="ns1blankspaceLogon">' +
									'<td class="ns1blankspaceLogon">' +
									'Logon Name' +
									'</td>' +
									'<td class="ns1blankspaceLogonInput">' +
									'<input id="ns1blankspaceLogonName" class="ns1blankspaceLogon">' +
									'</td>' +
									'</tr>';
									
					aHTML[++h] = '<tr class="ns1blankspaceLogon">' +
									'<td class="ns1blankspaceLogon">' +
									'Password' +
									'</td>' +
									'<td class="ns1blankspaceLogonInput">' +
									'<input id="ns1blankspaceLogonPassword" class="ns1blankspaceLogon" type="password">' +
									'</td>' +
									'</tr>';

					aHTML[++h] = '<tr class="ns1blankspaceLogon">' +
									'<td class="ns1blankspaceLogon" colspan=2>' +
									'<span id="ns1blankspaceLogon"></span>' +
									'</td>' +
									'</tr>';
					
					aHTML[++h] = '<tr class="ns1blankspaceLogon">' +
								    '<td class="ns1blankspaceLogon" colspan=2>' +
									'<input type="checkbox" id="ns1blankspaceLogonNameRemember"/>Remember Me</td></tr>';

					aHTML[++h] = '<tr class="ns1blankspaceLogon">' +
									'<td class="ns1blankspaceLogon" colspan=2>' +
									'<a href="#" id="ns1blankspaceLogonGetPassword">Get Password</a>' +
									'</td>' +
									'</tr>';
									
					aHTML[++h] = '<tr class="ns1blankspaceLogon">' +
									'<td id="ns1blankspaceLogonStatus" class="ns1blankspaceLogon" colspan=2>' +
									'&nbsp;' +
									'</td>' +
									'</tr>';
									
					aHTML[++h] = '</table>';					
					
					$('#' + sXHTMLElementID).css("z-index", "1");
					$('#' + sXHTMLElementID).html(aHTML.join(''));
					
					$('#' + sXHTMLElementID).show();

					var sLogonName = $.cookie('mydigitalstucturelogonname')
					
					if (sLogonName != '' && sLogonName != null)
					{
						$('#ns1blankspaceLogonName').val(sLogonName);
						$('#ns1blankspaceLogonNameRemember').attr('checked', true);
						$('#ns1blankspaceLogonPassword').focus();
					}
					else
					{
						$('#ins1blankspaceLogonName').focus();
					}
					
					$('#ns1blankspaceLogon').button(
					{
						label: "Logon"
					})
					.click(function() 
					{
						ns1blankspace.logon.send();
					});	

					$('#ns1blankspaceLogonName').keypress(function(e)
					{
					    if (e.which == 13)
					    {
					        ns1blankspace.logon.send();
					    }
					});

					$('#ns1blankspaceLogonPassword').keypress(function(e)
					{
					    if (e.which == 13)
					    {
					        ns1blankspace.logon.send();
					    }
					});

					$('#ns1blankspaceLogonGetPassword').click(function()
					{
						ns1blankspace.logon.getPassword.show();
					});
				},

	send: 		function ()
				{
					var sData = 'logon=' + ns1blankspace.util.fs($('#inputns1blankspaceLogonName').val()) +
								'&password=' + ns1blankspace.util.fs($('#inputns1blankspaceLogonPassword').val());

					$('#ns1blankspaceLogonStatus').html(ns1blankspace.xhtml.loadingSmall);
					
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
					if (oResponse.status == 'ER')
					{
						$('#ns1blankspaceLogonStatus').html('Logon Name or password is incorrect.');
						$('#ns1blankspaceContainer').effect("shake", { times:2 }, 100);
					}
					else 
					{
						$('#ns1blankspaceLogonStatus').html('Logon successful, loading app...');
						
						if ($('#ns1blankspaceLogonNameRemember').attr('checked'))
						{
							$.cookie('mydigitalstucturelogonname', $('#inputns1blankspaceLogonName').val(), {expires:30});
						}
						
						if (oResponse.passwordStatus == "EXPIRED")
						{
							ns1blankspace.logon.changePassword.show(); 
						}
						else
						{	
							if (oResponse.url == '#' || ns1blankspace.option.logonStayOnDocument)
							{
								document.location.reload(false);
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
					var sXHTMLElementID = 'ns1blankspaceBox';
					
					if (oParam != undefined)
					{
						if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
					}	
					
					aHTML[++h] = '<table id="ns1blankspaceLogonChangePasswordContainer" class="ns1blankspaceLogon">';
					
					aHTML[++h] = '<tr class="ns1blankspaceLogon">' +
									'<td class="ns1blankspaceLogon">' +
									'Current Password' +
									'</td>' +
									'<td class="ns1blankspaceLogonInput">' +
									'<input id="ns1blankspaceLogonCurrentPassword" class="ns1blankspaceLogon" type="password">' +
									'</td>' +
									'</tr>';
									
					aHTML[++h] = '<tr class="ns1blankspaceLogon">' +
									'<td class="ns1blankspaceLogon">' +
									'New Password' +
									'</td>' +
									'<td class="ns1blankspaceLogonInput">' +
									'<input id="ns1blankspaceLogonNewPassword" class="ns1blankspaceLogon" type="password">' +
									'</td>' +
									'</tr>';

					aHTML[++h] = '<tr class="ns1blankspaceLogon">' +
									'<td class="ns1blankspaceLogon">' +
									'Confirm Password' +
									'</td>' +
									'<td class="ns1blankspaceLogonInput">' +
									'<input id="ns1blankspaceLogonNewPasswordConfirm" class="ns1blankspaceLogon" type="password">' +
									'</td>' +
									'</tr>';
									
					aHTML[++h] = '<tr class="ns1blankspaceLogon">' +
									'<td class="ns1blankspaceLogon" colspan=2>' +
									'<span id="ns1blankspaceLogonChangePassword" class="ns1blankspaceLogon">Change Password</span>' +
									'</td>' +
									'</tr>';
									
					aHTML[++h] = '<tr class="ns1blankspaceLogon">' +
									'<td id="ns1blankspaceLogonChangePasswordStatus" class="ns1blankspaceLogon" colspan=2>' +
									'&nbsp;' +
									'</td>' +
									'</tr>';
									
					aHTML[++h] = '</table>';					
					
					$('#' + sXHTMLElementID).html(aHTML.join(''));
					
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

				else if (sNewPassword == '')
				{
					$('#ns1blankspaceLogonChangePasswordStatus').html('New password can not be blank.');
				}
				else
				{
					$('#ns1blankspaceLogonChangePasswordStatus').html('Updating password...');
					
					var sCurrentPassword = $('#ns1blankspaceLogonCurrentPassword').val();

					var sData = 'expiredays=36500' +
									'&site=' + msOnDemandSiteId +
									'&currentpassword=' + sCurrentPassword + 
									'&newpassword=' + sNewPassword +
									'&newpasswordconfirm=' + sNewPasswordConfirm;
					
					$.ajax(
					{
						type: 'POST',
						url: '/ondemand/site/?method=SITE_USER_PASSWORD_MANAGE',
						data: sData,
						dataType: 'json',
						success: this.process
					})
				},

	process: 	function (oResponse)
				{	
					if (oResponse.status == 'ER') 
					{
						if (oResponse.error.errornotes == 'PASSWORD_LESS_THAN_6_CHAR') 
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
					
						if (oResponse.url == '#' || ns1blankspace.option.logonStayOnDocument)
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
					var h = -1;

					aHTML[++h] = '<table class="ns1blankspaceLogon">';
					
					aHTML[++h] = '<tr class="ns1blankspaceLogon">' +
									'<td class="ns1blankspaceLogon">' +
									'Logon Name' +
									'</td>' +
									'<td class="ns1blankspaceLogon">' +
									'<input id="ns1blankspaceGetPasswordLogonName" class="ns1blankspaceLogon">' +
									'</td>' +
									'</tr>';
									
					aHTML[++h] = '<tr class="ns1blankspaceLogon">' +
									'<td class="ns1blankspaceLogon" colspan=2>' +
									'<span id="ns1blankspaceGetPassword" class="ns1blankspaceLogon">Send Password</span>' +
									'</td>' +
									'</tr>';
									
					aHTML[++h] = '<tr class="ns1blankspaceLogon">' +
									'<td id="ns1blankspaceGetPasswordStatus" class="ns1blankspaceLogon" colspan=2>' +
									'&nbsp;' +
									'</td>' +
									'</tr>';
									
					aHTML[++h] = '</table>';					
					
					$('#ns1blankspaceBox').css("z-index", "1");
					$('#ns1blankspaceBox').html(aHTML.join(''));
					
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
					if ($('#ns1blankspaceGetPasswordLogonName').val() == '')
					{
						$('#ns1blankspaceGetPasswordStatus').html('Logon name is blank, please enter a logon name.');
					}
					else
					{
						$('#tns1blankspaceGetPasswordStatus').html('Sending password...');
										
						var sData = 'site=' + msOnDemandSiteId +
										'&logon=' + $('#ns1blankspaceGetPasswordLogonName').val();	
						
						$.ajax(
						{
							type: 'POST',
							url: '/ondemand/site/?method=SITE_SEND_PASSWORD',
							data: sData,
							dataType: 'json',
							success: this.process
						})
					}
				},

	process:	function (oResponse)
				{
					if (oResponse.status == 'OK')
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
						url: '/ondemand/core/?method=CORE_LOGOFF',
						dataType: 'json'
					})
					
					ns1blankspace.unloadWarning = false;
					document.location.reload(false);
				}

ns1blankspace.attachments = 
{
	show: 		function (oParam)
				{
					var sXHTMLElementID;
					var iObject = ns1blankspace.object;
					var iObjectContext = ns1blankspace.objectContext;
					var bShowAdd = gbShowAdd;
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
						var h = -1;	
									
						aHTML[++h] = '<table>' +
									'<tr>' +
									'<td id="ns1blankspaceAttachmentsColumn1" class="ns1blankspaceColumn1Large">' +
									ns1blankspace.xhtml.loading +
									'</td>' +
									'<td id="ns1blankspaceAttachmentsColumn2" class="ns1blankspaceColumn2Action">' +
									'</td>' +
									'</tr>' +
									'</table>';					
							
						$('#' + sXHTMLElementID).html(aHTML.join(''));
						
						var aHTML = [];
						var h = -1;	
						
						aHTML[++h] = '<table class="ns1blankspaceColumn2">';
						
						aHTML[++h] = '<tr><td class="ns1blankspaceAction">' +
										'<span id="ns1blankspaceAttachmentsAdd">Add</span>' +
										'</td></tr>';
							
						if (sHelpNotes != undefined)
						{
							aHTML[++h] = '<tr><td class="ns1blankspaceAction">' +
										'<hr />' +
										'</td></tr>';
										
							aHTML[++h] = '<tr><td id="ns1blankspaceAttachmentsAddHelpNotes" class="ns1blankspaceAction" style="font-size:0.75em;color:#404040;">' +
										sHelpNotes +
										'</td></tr>';
						}
						
						aHTML[++h] = '</table>';					
						
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
						oSearch.getResults(function(data) {this.process(data, sXHTMLElementID)});
					}

				},

	process: 	function (oResponse, sXHTMLElementID)
				{	
					var aHTML = [];
					var h = -1;
						
					if (oResponse.data.rows.length == 0)
					{
						aHTML[++h] = '<table border="0" cellspacing="0" cellpadding="0" width="750" style="margin-top:15px; margin-bottom:15px;"><tbody>';
						aHTML[++h] = '<tr class="ns1blankspaceAttachments">';
						aHTML[++h] = '<td class="ns1blankspaceNothing">No attachments.</td>';
						aHTML[++h] = '</tr>';
						aHTML[++h] = '</tbody></table>';
						
						$('#' + sXHTMLElementID).html(aHTML.join(''));
						$('#' + sXHTMLElementID).show(ns1blankspace.option.showSpeed);
					}
					else
					{
						aHTML[++h] = '<table><tbody>'
					
						aHTML[++h] = '<tr class="ns1blankspaceCaption">';
						aHTML[++h] = '<td class="ns1blankspaceCaption">File Name</td>';
						aHTML[++h] = '<td class="ns1blankspaceCaption">Date</td>';
						aHTML[++h] = '<td class="ns1blankspaceCaption">&nbsp;</td>';
						aHTML[++h] = '</tr>';

						$.each(oResponse.data.rows, function()
						{
							aHTML[++h] = ns1blankspace.attachments.row(this);
						});
				    	
						aHTML[++h] = '</tbody></table>';

						ns1blankspace.pagination.list(
						   {
							xhtmlElementID: sXHTMLElementID,
							xhtmlContext: 'Attachment',
							xhtml: aHTML.join(''),
							showMore: (oResponse.morerows == "true"),
							columns: 'subject-actiondate',
							more: oResponse.moreid,
							rows: ns1blankspace.option.defaultRows,
							functionSearch: ns1blankspace.actions.show(),
							functionShowRow: ns1blankspace.attachments.row,
							functionNewPage: 'ns1blankspace.attachments.bind()',
							type: 'json'
						   }); 	
							
						ns1blankspace.attachments.bind();
					}
				}
				
	row:		function (oRow)
				{
					var aHTML = [];
					
					aHTML.push('<tr class="ns1blankspaceAttachments">');
					
					aHTML.push('<td id="ns1blankspaceAttachment_filename-' + oRow.id + '" class="ns1blankspaceRow">' +
										'<a href="' + oRow.download + '">' + oRow.filename + '</a></td>');
										
					aHTML.push('<td id="ns1blankspaceAttachment_date-' + oRow.id + '" class="ns1blankspaceRow">' + oRow.modifieddate + '</td>');
					
					aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">' +
									'<span id="ns1blankspaceAttachment_options_remove-' + oRow.attachment + 
									'" class="ns1blankspaceAttachmentOptionsRemove">&nbsp;</span></td>');
					
					aHTML.push('</tr>');
					
					return aHTML.join('');
				},


	bind:		function ()
				{
					$('td.ns1blankspaceAttachmentOptionsRemove').button({
								text: false,
								 icons: {
									 primary: "ui-icon-close"
						}
					})
					.click(function() {
						this.remove(this.id)
					})
					.css('width', '15px')
					.css('height', '20px')	
				},

	remove: 	function (sXHTMLElementID)
				{
					var aSearch = sXHTMLElementID.split('-');
					var sElementId = aSearch[0];
					var sSearchContext = aSearch[1];
					
					var sParam = 'method=CORE_ATTACHMENT_MANAGE&remove=1';
					var sData = 'id=' + sSearchContext;
								
					$.ajax(
						{
							type: 'POST',
							url: '/ondemand/core/?' + sParam,
							data: sData,
							dataType: 'json',
							success: function(data){$('#' + sXHTMLElementID).parent().fadeOut(500)}
						});
				},

	add: 		function (oParam)
				{
					$('#ns1blankspaceAttachmentsColumn1').html(ns1blankspace.attachments.upload.show(oParam));
					
					$('#spanInterfaceMainUpload').button(
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
									var sLabel = 'Select File';
									var sObjectName = '';
									var iAttachmentType = '';
									var bShowUpload = true;
									var sXHTML = '';
									var sHelpNotes;
									
									if (oParam != undefined)
									{
										if (oParam.maxFiles != undefined) {iMaxFiles = oParam.maxFiles}
										if (oParam.object != undefined || iObject == '') {iObject = oParam.object}
										if (oParam.objectName != undefined) {sObjectName = oParam.objectName}
										if (oParam.objectContext != undefined ) {lObjectContext = oParam.objectContext}
										if (oParam.label != undefined) {sLabel = oParam.label}
										if (oParam.attachmentType != undefined) {iAttachmentType = oParam.attachmentType}
										if (oParam.showUpload != undefined) {bShowUpload = oParam.showUpload}
										if (oParam.xhtml != undefined) {sXHTML = oParam.xhtml}
										if (oParam.helpNotes != undefined) {sHelpNotes = oParam.helpNotes}
									}	

									aHTML[++h] = '<form name="frmonDemandFileUpload" action="/ondemand/attach/" ' +
													'enctype="multipart/form-data" method="POST" target="ifonDemandUpload">' +
													'<input type="hidden" name="maxfiles" id="maxfiles" value="' + iMaxFiles + '">' +
													'<input type="hidden" name="object" id="object" value="' + iObject + '">' +
													'<input type="hidden" name="objectcontext" id="objectcontext" value="' + lObjectContext + '">';
											
									for (var i = 0; i < iMaxFiles; i++) 	
									{
										aHTML[++h] = '<input type="hidden" name="filetype' + i + '" id="filetype' + i + '" value="' + iAttachmentType + '">';
									}

									aHTML[++h] = sXHTML;
									
									if (sLabel != '') 
									{
										aHTML[++h] = '<div id="interfaceUploadLabel" class="ns1blankspaceControl">' + sLabel + '</div>';
									}	
										
									for (var i = 0; i < iMaxFiles; i++) 	
									{
										aHTML[++h] = '<div id="interfaceUploadFile' + i + '" class="ns1blankspaceUpload">' +
														'<input class="interfaceMainUpload" type="file" name="oFile' + i + '" id="oFile' + i + '">' +
														'</div>';
									}
									
									if (bShowUpload)
									{
										aHTML[++h] = '<span id="spanInterfaceMainUpload" class="interfaceMainAction interfaceMainMarginTop"></span>';
										aHTML[++h] = '<br /><br /><span id="spanInterfaceMainUploadStatus" class="ns1blankspaceUpload"></span>';
									}	
										
									aHTML[++h] = '<iframe style="display:none;" name="ifonDemandUpload" id="ifonDemandUpload" class="interfaceUpload" frameborder="0"></iframe>' +
													'</form>';
									
									return aHTML.join('');
									
								},


					process:	function (oParam)
								{
									ns1blankspace.param = {};
									if (oParam != undefined) {ns1blankspace.param = oParam};
									
									$('#spanInterfaceMainUploadStatus').html('Uploading..');
									var oForm = document.frmonDemandFileUpload;
								  	oForm.submit();
								 	this.upload.status();
									ns1blankspace.timer.delay = setInterval('ns1blankspace.attachments.upload.status()', 1000);
								},

					status:		function ()
								{
									var oDivStatus = document.getElementById('divonDemandFileUploadStatus');
									var oFrame = document.getElementById('ifonDemandUpload');
									var sStatus;
									var sCurrentState;

									var fFunctionPostUpdate = ns1blankspaceAttachments;
									
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
										if (oFrame.contentDocument.body.innerHTML == 'OK') 
										{
											sCurrentState = 'complete';
										}
										else 
										{
											sCurrentState = oFrame.contentDocument.body.innerHTML;
										}
									}
								 
									if (sCurrentState == 'complete') 
									{
										clearInterval(ns1blankspace.timer.delay);

										if (oDivStatus != null)
										{
											oDivStatus.setAttribute("class", "");
											oDivStatus.style.display = 'none';
										}
										
										$('#spanInterfaceMainUploadStatus').html('File Upload Complete...');
										fFunctionPostUpdate();
										
									}
								}
				}						
}

ns1blankspace.setup = 
{
	switch:		function ()
				{
					var aHTML = [];
					var h = -1;
					
					$(ns1blankspace.xhtml.container).attr('data-initiator', '');
					$('#div1blankspaceViewportControlSet').unbind('click');
					
					if (ns1blankspace.setupViewport)
					{
						ns1blankspace.setupViewport = false;
						
						$('#divns1blankspaceViewportControlSet')
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
							ns1blankspaceViewportControlShow(this);
						});
						
						ns1blankspace.control.setView.default();
						ns1blankspace.home.show();
						
						ns1blankspace.status.message("")	
					}
					else
					{
						ns1blankspace.setupViewport = true;

						$('#divns1blankspaceViewportControlSet')
						.button(
						{
							label: ns1blankspace.option.defaultSetupView
						})
						.click(function() 
						{
							ns1blankspace.setup.show(this);
						});
					
						$('.divInterfaceViewportMain').html(interfaceControlSetupOptions);
						
						ns1blankspace.control.setView.setup();
						
						ns1blankspace.status.message("Click icon again to return.")		
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
	message: 		function (sStatus)
				{	
					$('#ns1blankspaceViewControlActionStatus').html('<div style="position:relative;width:100%;height:35px;width:180px;">' +
							'<div style="display:table-cell; vertical-align:bottom; padding-bottom:5px; height:25px;">' + sStatus + '</div></div>');
				},

	working:	function ()
				{	
					$('#ns1blankspaceViewControlActionStatus').html('<div style="position:relative;width:100%;height:35px;width:180px;">' +
							'<div style="display:table-cell; vertical-align:bottom; padding-bottom:5px; height:25px;">' + ns1blankspace.xhtml.loadingSmall + '</div></div>');
				},

	error: 		function ns1blankspaceError(sError)
				{
					if (sError == undefined) {sError = 'Error!'};
					
					$('#ns1blankspaceViewControlActionStatus').html('<div style="position:relative;width:100%;height:35px;width:180px;">' +
							'<div style="display:table-cell; vertical-align:bottom; padding:5px; height:25px; color:white; background-color:red;">' + sError + '</div></div>');
				}
}

ns1blankspace.edit =
{
	start: 		function (sElementId)
				{	
					var aSearch = sElementId.split('-');
					var sActionElementId = '#' + aSearch[0] + '-options-' + aSearch[2];

					if (1==0)
					{
						$('td.interfaceActionsOptions').button('destroy');
						
						$(sActionElementId).button(
						{
							icons: 
							{
								primary: "ui-icon-disk"
							}
						});
					}
					
					var sHTML = $('#' + sElementId).html();
					
					var sElementInputId = sElementId.replace('td', 'input');
					
					sHTML = '<input id="' + sElementInputId + '" class="inputInterfaceMainValue" ' +
											'value="' + sHTML + '">'
					
					$('#' + sElementId).html(sHTML);
					$('#' + sElementInputId).focus();
					
					$('#' + sElementInputId).blur(function(event)
					{
						ns1blankspace.edit.stop(sElementId);
					});
				},

	stop:		function (sElementId)
				{
					ns1blankspace.edit.save(sElementId);
					
					var aSearch = sElementId.split('-');
					var sHTML = $('#' + sElementId.replace('td', 'input')).val();

					$('#' + sElementId).html(sHTML);
				},

	save:		function (sElementId)
				{
					var aSearch = sElementId.split('-');

					var sMethod = aSearch[0];
					sMethod = sMethod.replace('td', '');
					sMethod = sMethod.toUpperCase();
					sMethod = sMethod + '_MANAGE';
					
					var sParam = 'method=' + sMethod + '&select=' + aSearch[2];
					sParam += '&' + aSearch[1] + '=' + $('#' + sElementId.replace('td', 'input')).val();
					
					$.ajax(
					{
						type: 'GET',
						url: '/directory/ondemand/object.asp?' + sParam,
						dataType: 'text',
						success: ns1blankspaceStatus('Saved')
					});
						
				}
}				

ns1blankspace.dialog = 
{
	init: 		function(sSource)
				{
					if (sSource == undefined) {sSource = ''}
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
					
					if (oParam != undefined)
					{
						if (oParam.xhtmlElement != undefined) {oXHTMLElement = oParam.xhtmlElement}
						if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
						if (oParam.xhtml != undefined) {sXHTML = oParam.xhtml}
						if (oParam.functionBind != undefined) {sFunctionBind = oParam.functionBind}
						if (oParam.offsetTop != undefined) {iOffsetTop = oParam.offsetTop}
						if (oParam.offsetLeft != undefined) {iOffsetLeft = oParam.offsetLeft}
						if (oParam.forceShow != undefined) {bForceShow = oParam.forceShow}
					}
					
					if (oXHTMLElement == undefined)
					{
						oXHTMLElement = $('#' + sXHTMLElementID)
					}
					
					if (oXHTMLElement != undefined)
					{
						if ($(ns1blankspace.xhtml.container).attr('data-initiator') == oXHTMLElement.attr('id') && !bForceShow)
						{
							$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
							$(ns1blankspace.xhtml.container).attr('data-initiator', '');
						}
						else
						{
							$(ns1blankspace.xhtml.container).attr('data-initiator', oXHTMLElement.attr('id'))
								.html("&nbsp;")
								.show(ns1blankspace.option.showSpeedOptions)
								.offset({ top: $(oXHTMLElement).offset().top + $(oXHTMLElement).height() + iOffsetTop, left: $(oXHTMLElement).offset().left + iOffsetLeft})
								.html(sXHTML);
							
							if (sFunctionBind != undefined)
								{eval(sFunctionBind)}
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
					
					if (oParam != undefined)
					{
						if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
						if (oParam.leftOffset != undefined) {iLeftOffset = oParam.leftOffset}
						if (oParam.topOffset != undefined) {iTopOffset = oParam.topOffset}
					}
					
					var oElement = $('#' + sXHTMLElementID)
					
					$(ns1blankspace.xhtml.container).html('')
						.show();
						.offset({ top: $(oElement).offset().top + $(oElement).height() + iTopOffset, left: $(oElement).offset().left + iLeftOffset});
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
					}
					
					if (sXHTMLElementID != undefined)
					{
						var aXHTMLElementID = sXHTMLElementID.split('-');
						sXHTMLInputElementID = aXHTMLElementID[0];
						iXHTMLElementContextID = aXHTMLElementID[1];
					
						$.extend(true, oParam, {xhtmlInputElementID: sXHTMLInputElementID});
					
						if (sMethod == undefined)
						{
							sMethod = $('#' + sXHTMLInputElementID).attr("onDemandMethod");
							if (sMethod == undefined) {sMethod = $('#' + sXHTMLInputElementID).attr("data-method")}	
						}
						
						if (sColumns == undefined)
						{
							sColumns = $('#' + sXHTMLInputElementID).attr("onDemandColumns");
							if (sColumns == undefined) {sColumns = $('#' + sXHTMLInputElementID).attr("data-columns")}
							if (sColumns != undefined) {$.extend(true, oParam, {columns: sColumns})};	
						}
						
						if (sXHTMLParentInputElementID == undefined)
						{
							sXHTMLParentInputElementID = $('#' + sXHTMLInputElementID).attr("data-parent")
							if (sXHTMLParentInputElementID != undefined) {$.extend(true, oParam, {xhtmlParentInputElementID: sXHTMLParentInputElementID})};	
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
						if (oResponse == undefined)
						{
							ns1blankspace.dialog.position(sXHTMLInputElementID);
							
							if (sColumns == undefined) {sColumns = 'title'};
							
							if (sSearchText == '' && iSource == ns1blankspace.data.searchSource.text)
							{
								sSearchText = $('#' + sXHTMLInputElementID).val();
							}	
						
							if (sSearchText.length >= iMinimumLength || iSource == ns1blankspace.data.searchSource.all)
							{
								var aColumns = sColumns.split(',');	
								var oSearch = new AdvancedSearch();
								oSearch.method = sMethod;
								oSearch.addField(sColumns);
								oSearch.addFilter(aColumns[0], 'STRING_IS_LIKE', sSearchText);
								
								if (sXHTMLParentInputElementID != undefined)
								{
									var sParentColumnID = $('#' + sXHTMLInputElementID).attr("data-parent-search-id")
									var sParentColumnText = $('#' + sXHTMLInputElementID).attr("data-parent-search-text")
									var sParentContextID = $('#' + sXHTMLParentInputElementID).attr("data-id");
									var sParentContextText = $('#' + sXHTMLParentInputElementID).val();
									
									if (sParentColumnID != undefined && sParentContextID != undefined)
									{
										oSearch.addFilter(sParentColumnID, 'EQUAL_TO', sParentContextID);
									}
									else if	(sParentColumnText != undefined && sParentContextText != '')
									{
										oSearch.addFilter(sParentColumnText, 'STRING_STARTS_WITH', sParentContextText);
									}
								}
								
								oSearch.sort(aColumns[0], 'asc');
								oSearch.getResults(function(data){this.search(oParam, data)});
							}
						}	
						else
						{
							var aColumns = sColumns.split('-');
							var aHTML = [];
							var h = -1;
							
							if (oResponse.data.rows.length == 0)
							{
								$(ns1blankspace).hide();
							}
							else
							{
								aHTML[++h] = '<table class="interfaceSearchLarge">';
								aHTML[++h] = '<tbody>'
							
								$.each(oResponse.data.rows, function() 
								{ 
									iColumn = iColumn + 1;
							
									if (iColumn == 1)
									{
										aHTML[++h] = '<tr class="interfaceSearch">';
									}
										
									if (sColumns.length == 0)
									{
										aHTML[++h] = '<td class="interfaceSearch" id="' + sXHTMLInputElementID +
															'-' + this.id + '">' + this.title + '</td>';
									}
									else
									{
										aHTML[++h] = '<td class="interfaceSearch" id="' + sXHTMLInputElementID +
																'-' + this.id + '">' 
														
										for (var i = 0; i < aColumns.length; i++)
										{
											switch (aColumns[i])
											{
											case 'space':
												aHTML[++h] = ' ';
												break;
											case 'comma':
												aHTML[++h] = ',';
												break;
											case 'pipe':
												aHTML[++h] = '|';
												break;
											default:
												aHTML[++h] = this[aColumns[i]];
											}
										}
										aHTML[++h] = '</td>';
									}
							
									if (iColumn == iMaximumColumns)
									{
										aHTML[++h] = '</tr>'
										iColumn = 0;
									}	
								});
				    	
								aHTML[++h] = '</tbody></table>';
					
								$(ns1blankspace.xhtml.container).show(ns1blankspace.option.showSpeedOptions);
								$(ns1blankspace.xhtml.container).html(aHTML.join(''));
							
								$('td.interfaceSearch').click(function(event)
								{
									$(ns1blankspace.xhtml.container).hide(200);
									$.extend(true, oParam, {xhtmlElementID: event.target.id})
									ns1blankspace.search.show(oParam);
								});
							}	
						}
					}		
				},

	start: 		function ()
				{
					var sElementId = 'ns1blankspaceViewControlSearchStatus';
					$('#' + sElementId).show();
					$('#' + sElementId).html(ns1blankspace.xhtml.loadingSmall);
				},


	stop:		function ()
				{
					var sElementId = 'ns1blankspaceViewControlSearchStatus';
					$('#' + sElementId).hide(
					$('#' + sElementId).html('');
				}
}

ns1blankspace.save =
{
	send: 		function (sParam, sData, sSuccessMessage)
				{
					if (sParam == undefined) {sParam = ''};
					
					if (sData != '' && sData.indexOf('&') == 0) {sData = sData.substr(1)};
					
					$.ajax(
					{
						type: 'POST',
						url: sParam + '&rf=JSON',
						data: sData,
						dataType: 'json',
						async: false,
						success: function(data) {this.process(data, sSuccessMessage)}
					});
				},

	process: 	function (data, sSuccessMessage)
				{
					oResponse = data;
					
					if (oResponse.status == 'OK')
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

//TODO

ns1blankspace.util =
{
	json: 		function (oJSON, sElement, iRow)
				{
					oJSON = (oJSON == undefined)?'':oJSON;
					sElement = (sElement == undefined)?'':asElement;
					iRow = (iRow == undefined)?0:iRow;
					
					if (oJSON.length == 0) return '';
					
					if (sElement == '' || aiRow < 0) return '';
					
					if (oJSON.data.rows.length > 0)
					{	return oJSON.data.rows[iRow][sElement];	}
					else
					{	return '';}
				},

	tf2OnOff:	function (bValue)
				{
					if (bValue == undefined) {bValue = false}
					
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
					if (sValue == undefined) {sValue = '0'}
					
					if (sValue == '1')
					{ 
						return true;
					}
					else
					{
						return false;
					}	
					
				},

	tf2YN:		function ns1blankspaceTF2YN(bValue)
				{
					if (bValue == undefined) {bValue = false}
					
					if (bValue)
					{ 
						return 'Y';
					}
					else
					{
						return 'N';
					}	
					
				},

	yn2tf:		function ns1blankspaceYN2TF(sValue)
				{
					if (sValue == undefined) {sValue = 'N'}
					
					if (sValue == 'Y')
					{ 
						return true;
					}
					else
					{
						return false;
					}	
					
				}

	formatSave:	function (sValue)
				{
					if (sValue == undefined || sValue == 'undefined') { sValue = ''; }
					
					return encodeURIComponent(sValue)

				},

	fs:			function (sValue) {return this.formatSave(sValue)},

	getRPC:		function ()
				{
					if (ns1blankspace.rpc == undefined)
					{
						$.ajax(
						{
							type: 'GET',
							url: '/jscripts/1blankspace.rpc-1.0.1.json',
							dataType: 'json',
							async: false,
							success: function(data) {ns1blankspace.rpc = data.methods}
						});
					}
				},

	endpointURI:function (asMethod)
				{
					ns1blankspaceRPCGet();

					var sBaseEndpoint;

					if ($.inArray(asMethod, ns1blankspace.rpc) == -1)
					{
						sBaseEndpoint = '/ondemand/';
					}
					else
					{
						sBaseEndpoint = '/rpc/';
					}

					aMethod = asMethod.split('_');
					sEndpoint = aMethod[0];
					
					return sBaseEndpoint + (aMethod[0]).toLowerCase() + '/?method=' + asMethod;
				},

	uri: 
				{
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
				}			
}

ns1blankspace.search.address =
{
	show:		function ns1blankspaceAddressSearch(sXHTMLElementID, oParam)
				{
					
					var aSearch = sXHTMLElementID.split('-');
					var sElementId = aSearch[0];
					var lElementSearchContext = aSearch[1];	
					
					if (lElementSearchContext != undefined)
					{
						$('#' + ns1blankspace.xhtml.divID).val(aSearch[2])
						$('#' + ns1blankspace.xhtml.divID.replace('Suburb', 'State')).val(aSearch[3])
						$('#' + ns1blankspace.xhtml.divID.replace('Suburb', 'PostCode')).val(aSearch[4])
						$('#divns1blankspaceViewportControlOptions').hide();
					}
					else
					{
						var sParam = '/ondemand/core/?method=CORE_ADDRESS_SEARCH&rf=XML';
						var sData = '';
						
						ns1blankspaceOptionsSetPosition(sXHTMLElementID)
						
						//sData += '&postpcde=' + encodeURIComponent((oParam.postcode==undefined?'':oParam.postcode));
						
						sData += 'suburblike=' + encodeURIComponent($('#' + ns1blankspace.xhtml.divID).val());

						$.ajax(
						{
							type: 'POST',
							url: sParam,
							data: sData,
							dataType: 'json',
							success: this.process
						});
					}
				},

	process:	function (oResponse)
				{
					var iColumn = 0;
					var aHTML = [];
					var h = -1;
					var	iMaximumColumns = 1;
							
					if (oResponse.data.rows.length == 0)
					{
						$('#divns1blankspaceViewportControlOptions').hide();
					}
					else
					{
						aHTML[++h] = '<table class="interfaceSearchLarge">';
						aHTML[++h] = '<tbody>'
							
						$.each(oResponse.data.rows, function()
						{
							aHTML[++h] = '<tr class="interfaceSearch">';
										
							aHTML[++h] = '<td class="interfaceSearch" id="interfaceMainAddressSearch' +
													'-' + this.id +
													'-' + this.suburb +
													'-' + this.state +
													'-' + this.postcode +
													'">' +
													this.suburb + '</td>';
													
							aHTML[++h] = '<td class="interfaceSearchSub" id="interfaceMainAddressSearchState' +
													'-' + this.id + '">' +
													this.state + '</td>';
							
							aHTML[++h] = '<td class="interfaceSearchSub" id="interfaceMainAddressSearchPostCode' +
													'-' + this.id + '">' +
													this.postcode + '</td>';
							
							aHTML[++h] = '</tr>'
						});
				    	
						aHTML[++h] = '</tbody></table>';
					
						$('#divns1blankspaceViewportControlOptions').html(aHTML.join(''));
						$('#divns1blankspaceViewportControlOptions').show(ns1blankspace.option.showSpeedOptions);
						
						$('td.interfaceSearch').click(function(event)
						{
							$('#divns1blankspaceViewportControlOptions').hide(200);
							ns1blankspaceAddressSearch(event.target.id);
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
					var sParentSearchId;
					var sSetXHTMLElementId;
					
					if (oParam != undefined)
					{
						if (oParam.source != undefined) {iSource = oParam.source}
						if (oParam.minimumLength != undefined) {iMinimumLength = oParam.minimumLength}
						if (oParam.method != undefined) {sMethod = oParam.method}
						if (oParam.searchText != undefined) {sSearchText = oParam.searchText}
						if (oParam.maximumColumns != undefined) {iMaximumColumns = oParam.maximumColumns}
						if (oParam.emailOnly != undefined) {bEmailOnly = oParam.emailOnly}
						if (oParam.contactBusiness != undefined) {sParentSearchId = oParam.contactBusiness}
						if (oParam.setXHTMLElementID != undefined) {sSetXHTMLElementId = oParam.setXHTMLElementID}
					}

					var aSearch = sXHTMLElementID.split('---');
					var sElementId = aSearch[0];
					var lElementSearchContext = aSearch[1];
						
					if (sElementId != '')
					{
						var sMethod = $('#' + sElementId).attr("onDemandMethod")
						var sParentElementId = $('#' + sElementId).attr("onDemandParent")
					}	
					
					if (lElementSearchContext != undefined)
					{
						if (sSetXHTMLElementId == undefined) {sSetXHTMLElementId = sElementId}
					
						var lOnDemandID = $('#' + sSetXHTMLElementId).attr("onDemandID")
						
						if (lOnDemandID == undefined) 
						{
							lOnDemandID = aSearch[1];
						}
						else
						{	
							lOnDemandID += '-' + aSearch[1]
						}	
						
						$('#' + sSetXHTMLElementId).attr("onDemandID", lOnDemandID)
						
						var sValue = $('#' + sSetXHTMLElementId).val()
						
						if (bEmailOnly) 
						{
							if (sValue == '') 
							{
								sValue = aSearch[6]
							}
							else
							{
								sValue += ';' + aSearch[6]
							}		
								
							$('#' + sSetXHTMLElementId).val(sValue)	
						}
						else
						{
							$('#' + sSetXHTMLElementId).val(aSearch[2] + ' ' + aSearch[3])
						}	
						
						$('#' + sParentElementId).attr("onDemandID", aSearch[4])
						$('#' + sParentElementId).val(aSearch[5])
						$('#divns1blankspaceViewportControlOptions').hide();
					}
					else
					{
					
						ns1blankspaceOptionsSetPosition(sXHTMLElementID);
					
						if (sSearchText == undefined) {sSearchText = ''};
							
						if (sSearchText == '' && iSource == ns1blankspace.data.searchSource.text)
						{
							sSearchText = $('#' + sElementId).val();
						}	
						
						if (sSearchText.length >= iMinimumLength || iSource == ns1blankspace.data.searchSource.all)
						{
							
							var oSearch = new AdvancedSearch();
							oSearch.endPoint = 'contact';
							oSearch.rows = 10;
							oSearch.method = 'CONTACT_PERSON_SEARCH';
							oSearch.addField( 'firstname,surname,contactbusinesstext,contactbusiness,email');
							oSearch.addFilter('quicksearch', 'STRING_IS_LIKE', sSearchText);
							
							if (sParentElementId != undefined)
							{
								var sParentSearchText = $('#' + sParentElementId).val();
								sParentSearchId = $('#' + sParentElementId).attr("onDemandID");
							}	
							
							if (sParentSearchId != undefined)
							{
								oSearch.addFilter('contactbusiness', 'EQUAL_TO', sParentSearchId);
							}
							else if	(sParentSearchText != undefined)
							{
								oSearch.addFilter('contactbusinesstext', 'STRING_STARTS_WITH', sParentSearchText);
							}
							
							if (bEmailOnly)
							{
								oSearch.addFilter('email', 'IS_NOT_NULL', sParentSearchText);
								oSearch.addFilter('email', 'STRING_IS_LIKE', '@');
							}	
							
							oSearch.rf = 'JSON';
						
							oSearch.getResults(function (data) {this.process(data, sElementId, oParam)}) 
										
						}
					};	
				},

	process: 	function (oResponse, sElementId, oParam)
				{

					var iColumn = 0;
					var aHTML = [];
					var h = -1;
					var	iMaximumColumns = 1;
					var sElementIDSuffix;
					
					if (oResponse.data.rows.length == 0)
					{
						$('#divns1blankspaceViewportControlOptions').hide();
					}
					else
					{
						aHTML[++h] = '<table class="interfaceSearchLarge">';
						aHTML[++h] = '<tbody>'
							
						$.each(oResponse.data.rows, function()
						{	
							sElementIDSuffix = '---' + this.id +
													'---' + this.firstname +
													'---' + this.surname +
													'---' + this.contactbusiness +
													'---' + this.contactbusinesstext +
													'---' + this.email;
						
							aHTML[++h] = '<tr class="interfaceSearch">';
							
							aHTML[++h] = '<td class="interfaceSearch" id="' + sElementId +
													sElementIDSuffix +
													'">' + onDemandXMLGetData(oRow, "firstname")
													'</td>';
													
							aHTML[++h] = '<td class="interfaceSearch" id="' + sElementId +
													sElementIDSuffix +
													'">' + onDemandXMLGetData(oRow, "surname")
													'</td>';
																			
							aHTML[++h] = '<td class="interfaceSearch" id="' + sElementId +
													sElementIDSuffix +
													'">' + onDemandXMLGetData(oRow, "email") +
													'</td>';
													
							aHTML[++h] = '<td class="interfaceSearch" id="' + sElementId +
													sElementIDSuffix +
													'">' + onDemandXMLGetData(oRow, "contactbusinesstext") +
													'</td>';
													
							aHTML[++h] = '</tr>'
						});
				    	
						aHTML[++h] = '</tbody></table>';
					
						$('#divns1blankspaceViewportControlOptions').html(ns1blankspacePagination(
							{
								html: aHTML.join(''),
								more: (oResponse.morerows == 'true'),
								headerClass: 'interfaceSearchHeaderLarge',
								footerClass: 'interfaceSearchFooterLarge'
							})	
						);
					
						$('#divns1blankspaceViewportControlOptions').show(ns1blankspace.option.showSpeedOptions);
						
						$('td.interfaceSearch').click(function(event)
						{
							$('#divns1blankspaceViewportControlOptions').hide(200);
							ns1blankspaceContactEmailSearch(event.target.id, oParam);
						});
						
						ns1blankspacePaginationBind(
						{
							columns: 'firstname-surname-email-contactbusinesstext',
							idColumns: 'firstname-surname-contactbusiness-contactbusinesstext-email',
							more: oResponse.moreid, 
							bodyClass: 'interfaceSearchLarge',
							functionSearch: ns1blankspaceContactEmailSearch,
							xhtmlElementId: sElementId,
							idSeperator: '---',
							type: 'JSON'
						})	
					}	
							
				}
}				

ns1blankspace.pagination =
{
	init: 		function ns1blankspacePagination(oParam)
				{

					var aHTML = [];
					var h = -1;
					
					var sHTML = '';
					var bMore = false;

					if (oParam != undefined)
					{
						if (oParam.html != undefined) {sHTML = oParam.html}
						if (oParam.more != undefined) {bMore = oParam.more}
					}

					
					aHTML[++h] = '<table border="0" id="tableInterfaceSearchHeader" class="interfaceSearchHeaderMedium"><tbody>';
					aHTML[++h] = '<tr class="interfaceSearchHeader">';
					aHTML[++h] = '<td id="tdInterfaceSearchHeaderClose" class="interfaceSearchHeaderClose">' +
											'<span id="spanInterfaceSearchHeaderClose"></span></td>'
					if (bMore)
					{
						aHTML[++h] = '<td id="tdInterfaceSearchHeaderMore" class="interfaceSearchHeaderMore">' +
											'<span id="spanInterfaceSearchHeaderMore"></span></td>';
					}
					
					aHTML[++h] = '</tr>';
					aHTML[++h] = '</tbody></table>';
						
					aHTML[++h] = '<div id="divns1blankspaceSearch-0" class="ns1blankspaceSearchPage">';
								
					aHTML[++h] = sHTML;

					aHTML[++h] = '</div>';

					if (bMore)
					{
						aHTML[++h] = '<table border="0" class="interfaceSearchFooterMedium"><tbody>';
						aHTML[++h] = '<tr class="interfaceSearchFooter">';
						
						aHTML[++h] = '<td id="tdInterfaceSearchFooterPage" class="interfaceSearchHeader">' +
									'<span id="spanInterfaceSearchFooterPage-0" class="interfaceSearchFooterPage">' +
									'1</span></td>';
						
						aHTML[++h] = '</tr>';
						aHTML[++h] = '</tbody></table>';
					}	
					
					return aHTML.join('');
				},

	bind:		function (oParam)
				{
					var fFunctionMore = ns1blankspacePaginationShowMore;
					var iMore;
					
					if (oParam != undefined)
					{
						if (oParam.functionMore != undefined) {fFunctionMore = oParam.functionMore}
						if (oParam.more != undefined) {iMore = oParam.more}
					}
					
					$('#spanInterfaceSearchHeaderClose').button( {
								text: false,
								icons: {
									primary: "ui-icon-close"
								}
							})
							.click(function() {
								$('#divns1blankspaceViewportControlOptions').slideUp(1000);
								$('#divns1blankspaceViewportControlOptions').html('&nbsp;');
							})
							.css('width', '15px')
							.css('height', '16px')
						
					$('#spanInterfaceSearchHeaderMore').button( {
								text: false,
								icons: {
									primary: "ui-icon-play"
								}
							})
							.click(function() {
								(oParam != undefined?oParam.more = iMore:oParam = {more: iMore})
								fFunctionMore(oParam);
							})
							.css('width', '15px')
							.css('height', '16px')
						
					$('.interfaceSearchFooterPage').click(function(event)
					{
						ns1blankspacePaginationShowPage(this.id);
					});
				},

	showMore:	function (oParam, oResponse)
				{
					
					var sXHTMLElementID = '';
					var iMore = -1;
					var iStartRow = 10;
					var iRows = 10;
					var iColumn = 0;
					var iMaximumColumns = 1;
					var sColumns = "title";
					var sIDColumns = '';
					var fFunctionSearch;
					var fFunctionClass;
					var sClass;
					var sIdAdditional = '';
					var sBodyClass = 'interfaceSearchMedium';
					var sIDSeperator = '-';
					
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
						
					}
					
					$('#tdInterfaceSearchFooterMoreStatus').html(ns1blankspace.xhtml.loadingSmall);
					
					if (iMore == -1)
					{
						alert('No more!')
					}
					else
					{
						if (oResponse == undefined)
						{
							var sParam = 'method=CORE_SEARCH_MORE';
							var sData =	'id=' + iMore +
											'&startrow=' + iStartRow + 
											'&rows=' + iRows;
							
							$.ajax(
							{
								type: 'GET',
								url: '/ondemand/core/?' + sParam,
								data: sData,
								dataType: 'json',
								success: function(data){ns1blankspacePaginationShowMore(oParam, data)}
							});
						}
						else
						{	
							var aHTML = [];
							var h = -1;
						
							if ($('#divns1blankspaceSearch-' + iStartRow).length == 0)
							{
								aHTML[++h] = '<div id="divns1blankspaceSearch-' + iStartRow + '" class="ns1blankspaceSearchPage">';
							
								aHTML[++h] = '<table border="0" class="' + sBodyClass + '">';
								aHTML[++h] = '<tbody>'
										
								var iStartRow = parseInt(oResponse.startrow);
								var iRows = parseInt(oResponse.rows);
								var bMoreRows = (oResponse.morerows == 'true');
												
								if (bMoreRows)
								{				
									$('#spanInterfaceSearchHeaderMore').show();
								}
								else
								{
									$('#spanInterfaceSearchHeaderMore').hide();
								}	
								
								oParam.startRow = iStartRow + iRows;	
									
								$('#tdInterfaceSearchFooterMore').unbind('click');
									
								$('#tdInterfaceSearchFooterMore').click(function(event)
								{
									interfaceAuditSearchAdd(oParam);
								});	
										
								$.each(oResponse.data.rows, function()
								{		
									iColumn = iColumn + 1;
									
									if (iColumn == 1)
									{
										aHTML[++h] = '<tr class="interfaceSearch">';
									}
									
									var aIDColumns = sIDColumns.split("-");
									
									var sIDData = '';
									for (var i = 0; i < aIDColumns.length; i++)
									{
										sIDData += '-' + onDemandXMLGetData(oRow, aIDColumns[i]);
									}
									
									var aColumns = sColumns.split("-");
									
									for (var i = 0; i < aColumns.length; i++)
									{
										sClass = 'interfaceSearch'
										if (fFunctionClass != undefined)
										{
											sClass = sClass + fFunctionClass(oRow);
										}	
									
										aHTML[++h] = '<td class="' + sClass + '" id="' +
															sXHTMLElementID + '-' + this.id + sIDData + sIdAdditional + '">' 
															
										switch (aColumns[i])
										{
										case 'space':
											aHTML[++h] = ' ';
											break;
										case 'comma':
											aHTML[++h] = ',';
											break;
										case 'pipe':
											aHTML[++h] = '|';
											break;
										default:
											aHTML[++h] = this[aColumns[i]];
										}
										
										aHTML[++h] = '</td>';
									}
									
									if (iColumn == iMaximumColumns)
									{
										aHTML[++h] = '</tr>'
										iColumn = 0;
									}	
								});
							
								aHTML[++h] = '</tbody></table>';
								
								aHTML[++h] = '</div>';
								
								$('.ns1blankspaceSearchPage').hide();
								$('.ns1blankspaceSearchPage:last').after(aHTML.join(''));
								
								$('td.interfaceSearch').click(function(event)
								{
									$('#divns1blankspaceViewportControlOptions').html('&nbsp;');
									$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions)
									fFunctionSearch(event.target.id, {source: 1});
								});
										
								$('#tdInterfaceSearchFooterPage').append(
										' | <span id="spanInterfaceSearchFooterPage-' + iStartRow + '" class="interfaceSearchFooterPage">' +
											(parseInt(iStartRow/iRows) + 1) + '</span>');
											
								$('#tdInterfaceSearchFooterMoreStatus').html('&nbsp;');			
							}
						
							$('.interfaceSearchFooterPage').click(function(event)
							{
								ns1blankspacePaginationShowPage(this.id);
							});
						
						}
					}
				},

	showPage:	function ns1blankspacePaginationShowPage(sXHTMLElementID)
				{

					var aElement = sXHTMLElementID.split('-');
					
					$('.ns1blankspaceSearchPage').hide();
					$('#divns1blankspaceSearch-' + aElement[1]).show();
					
				}
}				

ns1blankspace.actions =
{
	show: function (oParam)
				{

					var sXHTMLElementID;
					var iObject = ns1blankspace.object;
					var iObjectContext = ns1blankspace.objectContext;
					var bShowAdd = gbShowAdd;
					var iActionType = '';
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
						if (oParam.actionType != undefined ) {iActionType = oParam.actionType}
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
									
						aHTML[++h] = '<table id="tableInterfaceMainActions" class="interfaceMain">' +
									'<tr id="trInterfaceMainActionsRow1" class="interfaceMainRow1">' +
									'<td id="tdInterfaceMainActionsColumn1" class="interfaceMainColumn1Large">' +
									ns1blankspace.xhtml.loading +
									'</td>' +
									'<td id="tdInterfaceMainActionsColumn2" class="interfaceMainColumn2Action">' +
									'</td>' +
									'</tr>' +
									'</table>';					
							
						$('#' + sXHTMLElementID).html(aHTML.join(''));
						
						var aHTML = [];
						var h = -1;	
						
						aHTML[++h] = '<table id="tableInterfaceMainActionsColumn2" class="interfaceMainColumn2">';
						
						aHTML[++h] = '<tr><td id="tdInterfaceMainActionsAdd" class="interfaceMainAction">' +
										'<span id="spanInterfaceMainActionsAdd">Add</span>' +
										'</td></tr>';
												
						aHTML[++h] = '</table>';					
						
						$('#tdInterfaceMainActionsColumn2').html(aHTML.join(''));
					
						oParam.xhtmlElementID = 'spanInterfaceMainActionsAdd';
						oParam.offsetHeight = -30;
						oParam.offsetLeft = -305;
						
						$('#spanInterfaceMainActionsAdd').button(
						{
							label: "Add"
						})
						.click(function() {
							interfaceActionMasterViewport({
															showHome: false, 
															showNew: true,
															contactPerson: iContactPerson,
															contactBusiness: iContactBusiness,
															contactPersonText: sContactPersonText,
															contactBusinessText: sContactBusinessText
															})
						})
					
						sXHTMLElementID = 'tdInterfaceMainActionsColumn1';
					}
					
					if (iObjectContext != -1)
					{
						var sParam = 'method=ACTION_SEARCH&lastfirst=1' +
										'&object=' + iObject + 
										'&objectcontext=' + iObjectContext +
										'&type=' + iActionType +
										'&contactbusiness=' + iContactBusiness + 
										'&contactperson=' + iContactPerson;
						
						$.ajax(
						{
							type: 'GET',
							url: '/ondemand/action/?rows=' + ns1blankspace.option.defaultRows + '&' + sParam,
							dataType: 'json',
							success: function(data) {this.process(data, sXHTMLElementID, oParam)}
						});	
					}

				}

	process: 	function (oResponse, sXHTMLElementID, oParam)
				{	
					var aHTML = [];
					var h = -1;
					var bDescription = false;
					
					if (oResponse.data.rows.length == 0)
					{
						aHTML[++h] = '<table border="0" cellspacing="0" cellpadding="0" width="750" style="margin-top:15px; margin-bottom:15px;">';
						aHTML[++h] = '<tbody>'
						aHTML[++h] = '<tr class="interfaceActions">';
						aHTML[++h] = '<td class="interfaceMainRowNothing">No actions.</td>';
						aHTML[++h] = '</tr>';
						
						$('#' + sXHTMLElementID).html(aHTML.join(''));
						$('#' + sXHTMLElementID).show(ns1blankspace.option.showSpeed);
					}
					else
					{
						aHTML[++h] = '<table class="interfaceMain">';
						aHTML[++h] = '<tbody>'
					
						aHTML[++h] = '<tr class="interfaceMainCaption">';
						aHTML[++h] = '<td class="interfaceMainCaption">Subject</td>';
						aHTML[++h] = '<td class="interfaceMainCaption">Date</td>';
						if (bDescription)
						{
							aHTML[++h] = '<td class="interfaceMainCaption">Description</td>';
						}
						aHTML[++h] = '<td class="interfaceMainCaption">&nbsp;</td>';
						aHTML[++h] = '</tr>';

						$.each(oResponse.data.rows, function()
						{	
							aHTML[++h] = '<tr class="interfaceAttachments">';
							aHTML[++h] = '<td id="tdAction_subject-' + this.id + '" class="interfaceMainRow">' +
											this.subject + '</td>';
							aHTML[++h] = '<td id="tdAction_date-' + this.id + '" class="interfaceMainRow">' +
											this.actiondate + '</td>';
							
							if (bDescription)
							{
								aHTML[++h] = '<td id="tdAction_description-' + this.id + '" class="interfaceMainRow">' +
												this.description + '</td>';
							}					
							
							aHTML[++h] = '<td id="tdAction_options-' + this.id + '" class="interfaceMainRowOptionsSelect">&nbsp;</td>';
							aHTML[++h] = '</tr>'
						});
				    	
						aHTML[++h] = '</tbody></table>';
						
						ns1blankspacePaginationList(
						   {
							xhtmlElementID: sXHTMLElementID,
							xhtmlContext: 'Action',
							xhtml: aHTML.join(''),
							showMore: (oResponse.morerows == 'true'),
							columns: 'subject-actiondate',
							more: this.moreid,
							rows: ns1blankspace.option.defaultRows,
							functionSearch: ns1blankspaceActions,
							functionOpen: "interfaceActionMasterViewport({showHome: false});interfaceActionSearch(this.id)"
						   }); 
						
						$('.interfaceMainRowOptionsSelect').button( {
								text: false,
								icons: {
									primary: "ui-icon-play"
								}
							})
							.click(function()
							{
								interfaceActionMasterViewport({showHome: false});
								interfaceActionSearch(this.id)
							})
							.css('width', '15px')
							.css('height', '20px')
					}
				}

	add:		function (oParam, oResponse)
				{
					var iActionID = -1;
					var dStartDate = new Date();
					var dEndDate = dStartDate;
					var sXHTMLElementID = 'spanInterfaceMainActionsAdd';
					var iOffsetHeight = 5;
					var iOffsetLeft = 0;
					
					if (oParam != undefined)
					{
						if (oParam.actionID != undefined) {iActionID = oParam.actionID};
						if (oParam.startDate != undefined) {dStartDate = oParam.startDate};
						if (oParam.endDate != undefined) {dEndDate = oParam.endDate};
						if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID};
						if (oParam.offsetHeight != undefined) {iOffsetHeight = oParam.offsetHeight};
						if (oParam.offsetLeft != undefined) {iOffsetLeft = oParam.offsetLeft};
					}	

					if ($('#divns1blankspaceDialog').attr('data-initiator') == sXHTMLElementID)
					{
						$('#divns1blankspaceDialog').hide("slide", { direction: "right" }, 500);
						$('#divns1blankspaceDialog').attr('data-initiator', '');
					}
					else
					{
						$('#divns1blankspaceDialog').attr('data-initiator', sXHTMLElementID);
					
						if (iActionID != -1 && oResponse == undefined)
						{
							sParam = 'method=ACTION_SEARCH&rf=XML&contactperson=ALL&select=' + iActionID;
						
							$.ajax(
							{
								type: 'GET',
								url: '/ondemand/action/?' + sParam,
								dataType: 'json',
								success: function(data) {ns1blankspaceActionAddShow(oParam, data)}
							});	
						}
						else
						{
							var aHTML = [];
							var h = -1;
							
							aHTML[++h] = '<table id="tablens1blankspaceActionAdd" class="interfaceDialogMedium">';
							
							aHTML[++h] = '<tr id="trInterfaceActionCalendarAddSubjectValue" class="interfaceMainText">' +
												'<td id="tdInterfaceActionCalendarAddSubjectValue" class="interfaceMainText">' +
												'<input id="inputMasterActionAddSubject" class="inputInterfaceMainText';
												
							if (iActionID == -1)
							{	
								aHTML[++h] = ' ns1blankspaceWatermark" value="Subject">';
							}
							else
							{
								aHTML[++h] = '">'
							}
							
							aHTML[++h] = '</td></tr>';
							
							aHTML[++h] = '<tr><td id="tdns1blankspaceActionAddDescriptionValue" class="interfaceMain">' +
												'<textarea rows="5" cols="35" id="inputns1blankspaceActionAddDescription" class="inputInterfaceMainTextMultiSmall';

							if (iActionID == -1)
							{	
								aHTML[++h] = ' ns1blankspaceWatermark">Add more text here, if required.</textarea>';
							}
							else
							{
								aHTML[++h] = '"></textarea>'
							}

							aHTML[++h] = '</td></tr>';

							aHTML[++h] = '<tr id="trns1blankspaceActionAddBusiness" class="interfaceMain">' +
												'<td id="tdns1blankspaceActionAddBusiness" class="interfaceMain">' +
												'Business' +
												'</td></tr>' +
												'<tr id="trns1blankspaceActionAddBusinessValue" class="interfaceMainSelect">' +
												'<td id="tdns1blankspaceActionAddBusinessValue" class="interfaceMainSelect">' +
												'<input id="inputns1blankspaceActionAddBusiness" class="inputInterfaceMainSelect"' +
													' onDemandMethod="/ondemand/contact/?method=CONTACT_BUSINESS_SEARCH"' +
													' onDemandColumns="tradename">' +
												'</td></tr>';
												
							
							aHTML[++h] = '<tr id="trns1blankspaceActionAddPerson" class="interfaceMain">' +
												'<td id="tdns1blankspaceActionAddPerson" class="interfaceMain">' +
												'Person' +
												'</td></tr>' +
												'<tr id="trns1blankspaceActionAddPersonValue" class="interfaceMainSelect">' +
												'<td id="tdns1blankspaceActionAddPersonValue" class="interfaceMainSelect">' +
												'<input id="inputns1blankspaceActionAddPerson" class="inputInterfaceMainSelectContact"' +
													' onDemandMethod="/ondemand/contact/?method=CONTACT_PERSON_SEARCH"' +
													' onDemandParent="inputns1blankspaceActionAddBusiness">' +
												'</td></tr>';									
												
												
							aHTML[++h] = '<tr><td id="tdns1blankspaceActionAddHighPriority" class="interfaceMain">' +
												'<input type="checkbox" id="inputns1blankspaceActionAddNoteHighPriority"/>&nbsp;High Priority?<td></tr>';
												
								
							aHTML[++h] = '<tr><td>';
							
								aHTML[++h] = '<table class="interfaceSearchFooterMedium">';
								
								aHTML[++h] = '<tr><td style="text-align: right;">' +
													'<span id="spanSave">Save</span>' +
													'<span id="spanCancel">Cancel</span>' +
													'<td></tr>';
								
								aHTML[++h] = '</table>';						

							aHTML[++h] = '</td></tr>';	
								
							aHTML[++h] = '</table>';		
							
							var oElement = $('#' + sXHTMLElementID)
							
							$('#divns1blankspaceDialog').html('');
							$('#divns1blankspaceDialog').show();
							$('#divns1blankspaceDialog').offset(
								{
									top: $(oElement).offset().top + $(oElement).height() + iOffsetHeight,
									left: $(oElement).offset().left + iOffsetLeft
								});
							$('#divns1blankspaceDialog').html(aHTML.join(''));
							
							$('#spanCancel').button(
								{
									text: false,
									 icons: {
										 primary: "ui-icon-close"
									}
								})
								.click(function() {
									$('#divns1blankspaceDialog').slideUp(500);
									$('#divns1blankspaceDialog').html('');
								})
								.css('width', '20px')
								.css('height', '20px')

							$('#spanSave').button(
								{
									text: false,
									 icons: {
										 primary: "ui-icon-check"
									}
								})
								.click(function() {
									interfaceActionQuickSave({
											id: iActionID,
											date: $.fullCalendar.formatDate(dStartDate, "dd MMM yyyy") + 
														' ' + $.fullCalendar.formatDate(dStartDate, "HH:mm"),
											endDate: $.fullCalendar.formatDate(dEndDate, "dd MMM yyyy") + 
														' ' + $.fullCalendar.formatDate(dEndDate, "HH:mm"),
											subject: $('#inputActionCalendarAddSubject').val(),
											description: $('#inputActionCalendarAddDescription').val(),
											priority: ($('#inputActionCalendarAddHighPriority').attr('checked')?3:2),
											calendarXHTMLElementID: 'divInterfaceMainCalendar'
											});
									
									$('#divns1blankspaceDialog').slideUp(500);
									$('#divns1blankspaceDialog').html('');

								})
								.css('width', '30px')
								.css('height', '20px')
							
							if (oResponse != undefined)
							{	
								if (oResponse.data.rows.length == 0)
								{	
									$('#inputActionCalendarAddSubject').val(oResponse.data.rows[0].subject);
									$('#inputActionCalendarAddDescription').val(oResponse.data.rows[0].description);
								}	
							}	
						}
					}
				},

	dialog:		function ns1blankspaceViewportActionShow(oElement, sActionXHTML, sFunctionActionBind)
				{

					var aHTML = [];
					var h = -1;

					if ($('#divns1blankspaceViewportControlOptions').attr('data-initiator') == oElement.id)
					{
						$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
						$('#divns1blankspaceViewportControlOptions').attr('data-initiator', '');
					}
					else
					{	
						if (ns1blankspace.xhtml.masterControl == '')
						{
							ns1blankspace.xhtml.masterControl = interfaceControlOptions();
						}

						$('#divns1blankspaceViewportControlOptions').attr('data-initiator', oElement.id);
						$('#divns1blankspaceViewportControlOptions').html("&nbsp;");
						$('#divns1blankspaceViewportControlOptions').show(ns1blankspace.option.showSpeedOptions);
						$('#divns1blankspaceViewportControlOptions').offset({ top: $(oElement).offset().top + $(oElement).height(), left: $(oElement).offset().left });
						$('#divns1blankspaceViewportControlOptions').html(sActionXHTML);
						
						if (sFunctionActionBind != undefined)
							{eval(sFunctionActionBind)}
					}	
				}
}

ns1blankspace.pagination.list = 
{
	show: 		function ns1blankspacePaginationList(oParam)
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
					}

					oParam.xhtmlFirstRow = $('tr:first', sHTML).html();
					
					if (bMore)
					{
						aHTML[++h] = '<table><tr>';
						//aHTML[++h] = '<td style="width:1px;" class="interfaceMessagingSubHeader ns1blankspacePaginationList" id="tdns1blankspacePaginationList' + sXHTMLContext + '-"></td>';
						aHTML[++h] = '<td style="width:5px;cursor:pointer;" class="interfaceMessagingSubHeader ns1blankspacePaginationList' + sXHTMLContext + '"' +
											' id="td' + sXHTMLContext + 'ns1blankspacePaginationList-0" rowStart="0">1</td>';
						aHTML[++h] = '<td></td></tr></table>';
					}
						
					aHTML[++h] = '<div id="div' + sXHTMLContext + 'ns1blankspacePaginationList-0" class="ns1blankspacePaginationListPage' + sXHTMLContext + '">';
					aHTML[++h] = sHTML;
					aHTML[++h] = '</div>';

					$('#' + sXHTMLElementID).html(aHTML.join(''));
					if (bShowList) {$('#' + sXHTMLElementID).show(ns1blankspace.option.showSpeed)};
						
					if (bMore)
					{
						var sHTML = '<td style="width:5px;cursor:pointer;" class="interfaceMessagingSubHeader ns1blankspacePaginationList' + sXHTMLContext + 
											'" id="td' + sXHTMLContext + 'ns1blankspacePaginationList-' +
											(iStartRow + iRows - 1) + '" rowStart="' +
											(iStartRow + iRows - 1) + '">' + 'more...' + '</td>';
										
						$('#td' + sXHTMLContext + 'ns1blankspacePaginationList-' + (iStartRow)).after(sHTML);
					
						$('#td' + sXHTMLContext + 'ns1blankspacePaginationList-' + (iStartRow + iRows - 1)).click(function(event)
						{
							var sID = event.target.id;
							var sStart = $('#' + sID).attr('rowStart');
							$('#' + sID).html(ns1blankspace.xhtml.loadingSmall);
							if (oParam != undefined) {oParam.more = iMore;oParam.startRow = sStart}else{oParam = {more: iMore, startRow: sStart}};
							ns1blankspacePaginationListShowMore(oParam);
						});
					}
					
					$('.ns1blankspacePaginationListPage' + sXHTMLContext).click(function(event)
					{
						ns1blankspacePaginationListShowPage(this.id, sXHTMLContext);
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
					var sType = 'XML';
					
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
						if (oParam.type != undefined) {sType = oParam.type}
					}

					sType = sType.toUpperCase();
					
					if (iMore == -1)
					{
						alert('No more!')
					}
					else
					{
						if (oData == undefined)
						{
							var sParam = 'method=CORE_SEARCH_MORE';
							var sData =	'id=' + iMore +
											'&startrow=' + iStartRow + 
											'&rows=' + iRows;
							
							$.ajax(
							{
								type: 'GET',
								url: '/ondemand/core/?rf=' + sType + '&' + sParam,
								data: sData,
								dataType: sType.toLowerCase(),
								success: function(data){ns1blankspacePaginationListShowMore(oParam, data)}
							});
						}
						else
						{
						
							var aHTML = [];
							var h = -1;
						
							if ($('#div' + sXHTMLContext + 'ns1blankspacePaginationList-' + iStartRow).length == 0)
							{
							
								aHTML[++h] = '<div id="div' + sXHTMLContext + 'ns1blankspacePaginationList-' + iStartRow + 
												'" class="ns1blankspacePaginationListPage' + sXHTMLContext + '">';
							
								aHTML[++h] = '<table border="0" class="' + sBodyClass + '">';
								aHTML[++h] = '<tbody>'
								
								if (sXHTMLlFirstRow != undefined)
								{
									aHTML[++h] = sXHTMLlFirstRow;
								}
								
								if (sType == 'XML')
								{
								
									var oRoot = oXML.getElementsByTagName('ondemand').item(0);	
									
									var iStartRow = parseInt($(oRoot).attr('startrow'));
									var iRows = parseInt($(oRoot).attr('rows'));
									var bMoreRows = ($(oRoot).attr('morerows') == "true");
													
									oParam.startRow = iStartRow + iRows;	
								
									for (var iRow = 0; iRow < oRoot.childNodes.length; iRow++) 
									{
										
										var oRow = oRoot.childNodes.item(iRow);
										
										if (fFunctionShowRow != undefined)
										{
											aHTML[++h] = fFunctionShowRow(oRow);
										}
										else
										{
										
											iColumn = iColumn + 1;
											
											if (iColumn == 1)
											{
												aHTML[++h] = '<tr class=interfaceMainRow" id="tr' + sXHTMLContext + '-' + onDemandXMLGetData(oRow, "id") + sIDData + sIdAdditional + '">';
											}
											
											var aIDColumns = sIDColumns.split("-");
											
											var sIDData = '';
											for (var i = 0; i < aIDColumns.length; i++)
											{
												sIDData += '-' + onDemandXMLGetData(oRow, aIDColumns[i]);
											}
											
											var aColumns = sColumns.split("-");
											
											for (var i = 0; i < aColumns.length; i++)
											{
												sClass = 'interfaceMainRow'
												if (fFunctionClass != undefined)
												{
													sClass = sClass + fFunctionClass(oRow);
												}	
											
												aHTML[++h] = '<td class="' + sClass + '" id="td' + sXHTMLContext + '_' +
																	aColumns[i] + '-' + onDemandXMLGetData(oRow, "id") + sIDData + sIdAdditional + '">' 
																	
												switch (aColumns[i])
												{
												case 'space':
													aHTML[++h] = ' ';
													break;
												case 'comma':
													aHTML[++h] = ',';
													break;
												case 'pipe':
													aHTML[++h] = '|';
													break;
												default:
													aHTML[++h] = onDemandXMLGetData(oRow, aColumns[i]);
												}
												
												aHTML[++h] = '</td>';
												
												if (i == (aColumns.length-1) && (sFunctionOpen != undefined))
												{
													aHTML[++h] = '<td id="td' + sXHTMLContext + '_options-' + onDemandXMLGetData(oRow, "id") + 
																		'" class="interfaceMainRowOptionsSelect interfaceMainRowOptionsSelect' + sXHTMLContext + '">&nbsp;</td>';
												}
												
											}
											
											if (iColumn == iMaximumColumns)
											{
												aHTML[++h] = '</tr>'
												iColumn = 0;
											}	
										}	
									}
								}	
								else if (sType == 'JSON')
								{
									var iStartRow = parseInt(oData.startrow)
									var iRows = parseInt(oData.rows);
									var bMoreRows = (oData.morerows == "true");
													
									oParam.startRow = iStartRow + iRows;	
									
									var oRows = oData.data.rows;
							
									$(oRows).each(function() 
									{
										aHTML[++h] = fFunctionShowRow(this);
									})
									
								}
								
								aHTML[++h] = '</tbody></table>';
								
								aHTML[++h] = '</div>';
								
								$('.ns1blankspacePaginationListPage' + sXHTMLContext).hide();
								$('.ns1blankspacePaginationListPage' + sXHTMLContext + ':last').after(aHTML.join(''));
								
								$('.interfaceMainRowOptionsSelect' + sXHTMLContext).unbind('click');
								
								if (sFunctionOpen != undefined)
								{
									$('.interfaceMainRowOptionsSelect' + sXHTMLContext).button({
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
								
								$('#td' + sXHTMLContext + 'ns1blankspacePaginationList-' + iStartRow).html(((iStartRow+1)/iRows)+1);

								$('td.ns1blankspacePaginationList' + sXHTMLContext).unbind('click');
								
								$('td.ns1blankspacePaginationList' + sXHTMLContext).click(function(event)
								{
									ns1blankspacePaginationListShowPage(this.id, sXHTMLContext);
								});
							
								if (bMoreRows)
								{
									var sHTML = '<td style="width:5px;cursor:pointer;" class="interfaceMessagingSubHeader ns1blankspacePaginationList' + sXHTMLContext + 
											'" id="td' + sXHTMLContext + 'ns1blankspacePaginationList-' +
											(iStartRow + iRows) + '" rowStart="' +
											(iStartRow + iRows) + '">' + 'more...' + '</td>';
										
									$('#td' + sXHTMLContext + 'ns1blankspacePaginationList-' + iStartRow).after(sHTML);
									
									$('#td' + sXHTMLContext + 'ns1blankspacePaginationList-' + (iStartRow + iRows)).click(function(event)
									{
										var sID = event.target.id;
										var sStart = $('#' + sID).attr('rowStart')
										$('#' + sID).html(ns1blankspace.xhtml.loadingSmall);
										(oParam != undefined?oParam.more = iMore:oParam = {more: iMore, startRow: sStart})
										ns1blankspacePaginationListShowMore(oParam);
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
					
					$('.ns1blankspacePaginationListPage' + sXHTMLContext).hide();
					$('#div' + sXHTMLContext + 'ns1blankspacePaginationList-' + aElement[1]).show();
				}
}

ns1blankspace.pdf = 
{
	create:		function (oParam, sReturn)
				{
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
						//if (oParam.open) {bOpen = oParam.open}	
					}

					if (sReturn == undefined)
					{
						$('#aInterfaceMainSummaryViewPDF').html(ns1blankspace.xhtml.loadingSmall)
						
						var sParam = 'method=CORE_PDF_CREATE&rf=TEXT';
						var sData = 'object=' + iObject;
						sData += '&objectcontext=' + iObjectContext;
						sData += '&filename=' + encodeURIComponent(sFileName);
						sData += '&xhtmlcontent=' + encodeURIComponent(sXHTMLContent);
						
						$.ajax(
						{
							type: 'POST',
							url: '/ondemand/core/?' + sParam,
							data: sData,
							dataType: 'text',
							success: function(data) {ns1blankspaceCreatePDF(oParam, data)}
						});
					}	
					else	
					{
						var aReturn = sReturn.split('|');

						if (bOpen)
						{
							window.open('/download/' + aReturn[1])	
						}
						else
						{
							$('#aInterfaceMainSummaryViewPDF').html('<a href="/download/' + aReturn[1] + '" target="_blank">Open PDF</a>');
						}	
					}	

				}
}				

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
					var sClassSelector = '.ns1blankspaceControl';

					if (oParam)
					{
						if (oParam.refresh) {bRefresh = oParam.refresh}
						if (oParam.selector) {sSelector = oParam.selector}
						if (oParam.classSelector) {sClassSelector = oParam.classSelector}
					}
							
					$(ns1blankspace.xhtml.container).hide();

					$(sClassSelector).hide();

					$(sSelector).show(giShowSpeed);

					ns1blankspace.xhtml.divID = sDivSelector;
					
					if ($(sSelector).html() == '' || bRefresh)
					{
						$(sSelector).attr('data-loading', '1');
						$(sSelector).html(ns1blankspace.xhtml.loading);
					}	
				}			
