/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 *
 * jscripts/modernizr-load.js
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
	var n = this, c = isNaN(c = Math.abs(c)) ? 2 : c, d = d === undefined ? "." : d, t = t === undefined ? "," : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
   	return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

String.prototype.repeat = function(num)
{
    return new Array(num + 1).join(this);
}

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
		sValue = sValue.replace(/\&#60;/g,'<');
		sValue = sValue.replace(/\&#62;/g,'>');
		
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

$.curCSS = function (element, attrib, val) {
    $(element).css(attrib, val);
};

var ns1blankspace = {};

ns1blankspace.history = {};
ns1blankspace.xhtml = {};
ns1blankspace.option = {};
ns1blankspace.timer = {};
ns1blankspace.counter = {};
ns1blankspace.user = {};
ns1blankspace.data = {search: []};
ns1blankspace.debug = {};
ns1blankspace.authenticationLevel = 1;
ns1blankspace.session = {};

ns1blankspace.selector = 'body';

ns1blankspace.scripts =
[
	{
		nameSpace: '1blankspace.advancedsearch',
		source: '/jscripts/1blankspace.advancedsearch-2.0.4.js'
	}
]

ns1blankspace.formFactor = 
{
	is: function (oParam)
	{
		var sSize = ns1blankspace.util.getParam(oParam, 'size').value;
		var bNot = ns1blankspace.util.getParam(oParam, 'not', {"default": false}).value
		return (this.not(bNot, this.size.value == this.size.options[sSize]) ? ns1blankspace.util.getParam(oParam, 'data').value : ns1blankspace.util.getParam(oParam, 'default').value)
	},

	not: function (bNot, bValue) {return (bNot?!bValue:bValue)},

	size:
	{
		value: 2, options: {large: 1, medium: 2, small: 3}
	}
}

window.onbeforeunload = function(event) 
{
	if (ns1blankspace.unloadWarning)
	{
	      return "You potentially will lose unsaved information if you close. Press Cancel to stop the close."
	}
	else
	{
		ns1blankspace.unloadWarning = true;
	}
}

$(function()
{
	window.$vq = ns1blankspace.util.view.queue;

	if (ns1blankspace.option.httpsOnly && window.location.protocol == 'http:')
	{
		window.location.href = window.location.href.replace('http', 'https')
	}
	else
	{		
		var match = navigator.userAgent.match(/(?:MSIE |Trident\/.*; rv:)(\d+)/);
		var sIEVersion = match ? parseInt(match[1]) : undefined;

		if (sIEVersion == undefined || (sIEVersion != undefined && sIEVersion > 8))
		{
			ns1blankspace.app.init();
		}
		else
		{
			var para = document.createElement('p');
			para.setAttribute('id', 'browserError');
			para.className = '1blankspaceCaption';
			var message = document.createTextNode("Your browser is outdated and is not supported by this app. Please upgrade to IE 9 or later or use an alternate modern browser.");
			para.appendChild(message);
			var body = document.body;
			body.insertBefore(para);
		}
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
					var bInitialise = false;
					var bInitialise = ns1blankspace.util.getParam(oParam, 'initialise', {"default": false}).value;
					var bInitialiseScripts = ns1blankspace.util.getParam(oParam, 'initialiseScripts', {"default": false}).value;

					if ($('#ns1blankspaceContainer').length === 0)
					{
						$(ns1blankspace.selector).append('<div id="ns1blankspaceContainer">' +
											'<div id="ns1blankspaceHeader"></div>' +
											'<div id="ns1blankspaceViewControl"><span style="font-size:1.3em; padding-left:6px; color: #999999;">Initialising the app...</span></div>' +
											'<div id="ns1blankspaceViewControlBrowse"></div>' +
											'<div id="ns1blankspaceControl"></div>' +
											'<div id="ns1blankspaceMain"></div>' +
											'<div id="ns1blankspaceFooter"></div>' +
											'<div id="ns1blankspaceMultiUseContainer"></div>' +
											'<div id="ns1blankspaceMultiUseDialog"></div>' +
											'</div>');
					}		

					if (!bInitialise)
					{
						window.setTimeout('ns1blankspace.app.init({initialise: true})', 100);
					}
					else if (!bInitialiseScripts)
					{
						if ($.type(ns1blankspace.option.preLoad) === 'function')
						{
							ns1blankspace.option.preLoad();
						}
						
						if (window.Modernizr == undefined)
						{
							ns1blankspace.debug.message("NEED A REFERENCE TO Modernizr - /jscripts/modernizr-load.js", true)
						}
						else
						{
							Modernizr.load(
							{
								load: $.map(ns1blankspace.scripts, function(a) {return a.source}),
								complete: 	function()
											{
												ns1blankspace.scriptsLoaded = true;
												oParam = ns1blankspace.util.setParam(oParam, 'initialiseScripts', true);
												ns1blankspace.app.init(oParam);
											}
							});
						}	
					}	
					else
					{	
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
						ns1blankspace.option.auditFields = 'createddate,createduser,createdusertext,modifieddate,modifieduser,modifiedusertext';
						ns1blankspace.option.retryLimit = 5;
									
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

						if (ns1blankspace.counter.editor === undefined) {ns1blankspace.counter.editor = 0};

						ns1blankspace.xhtml.masterControl = '';
						ns1blankspace.xhtml.action = '';
						ns1blankspace.xhtml.home = '';
						ns1blankspace.xhtml.divID = '';
						ns1blankspace.xhtml.container = '#ns1blankspaceMultiUseContainer';
						ns1blankspace.xhtml.dropDownContainer = '#ns1blankspaceMultiUseDialog';
						ns1blankspace.xhtml.searchContainer = '#ns1blankspaceViewControlSearchResultsContainer';

						ns1blankspace.user.commonName = '';
						ns1blankspace.user.email = '';
						ns1blankspace.user.networkGroups = '';
						ns1blankspace.user.id = -1;
						ns1blankspace.user.contactPerson = -1;
						ns1blankspace.user.contactBusiness = -1;
						ns1blankspace.user.contactBusinessText = '';
						ns1blankspace.user.systemAdmin = false;
						ns1blankspace.setupShow = false;
						ns1blankspace.user.theme = 'Standard';

						ns1blankspace.data.searchSource = {text: 1, browse: 2, select: 3, all: 4}
						
						ns1blankspace.data.search = [];
						ns1blankspace.data.search.push(
						{
							method: 'REPORT_OBJECT_SEARCH',
							rows: 
							[
								{id: '17',  title: 'Action'},
								{id: '158', title: 'Bank Reconciliation'},
								{id: '129', title: 'Bank Transfer'},
								{id: '46',  title: 'BAS'},
								{id: '12',  title: 'Business'},
								{id: '14',  title: 'Document'},
								{id: '39',  title: 'Event'},
								{id: '2',   title: 'Expense'},
								{id: '5',   title: 'Invoice'},
								{id: '35',  title: 'Opportunity'},
								{id: '30',  title: 'Order'},
								{id: '3',   title: 'Payment'},
								{id: '32',  title: 'Person'},
								{id: '16',  title: 'Product'},
								{id: '1',   title: 'Project'},
								{id: '11',  title: 'Project Task'},
								{id: '6',   title: 'Receipt'},
								{id: '8',   title: 'Support Issue'},
							]
						});
						ns1blankspace.data.search[0].data = ns1blankspace.data.search[0].rows;

						ns1blankspace.debug.appContext = 'start';

						ns1blankspace.param;

						ns1blankspace.history.viewList = ['ns1blankspace.home.init()']
						ns1blankspace.history.currentIndex = 0
						ns1blankspace.history.lastDestinationInstruction = '';
						ns1blankspace.history.list = [];

						if (ns1blankspace.option.defaultRowsSmall == undefined)
						{
							ns1blankspace.option.defaultRowsSmall = 10
						}

						if (ns1blankspace.option.defaultRows == undefined)
						{
							ns1blankspace.option.defaultRows = 20
						}

						ns1blankspace.user.networkGroups = '';
						ns1blankspace.setupShow = false;

						$.ajaxSetup(
						{
							cache: false,
							dataType: 'json',
							global: true,
							headers: {"cache-control": "no-cache"},
							beforeSend: function (oRequest)
							{
								oRequest.setRequestHeader("X-HTTP-myds-rest-level", ns1blankspace.option.restLevel);
							}
						});

						$.ajaxPrefilter(function(options, originalOptions, jqXHR)
						{
						   originalOptions._error = originalOptions.error;
						   originalOptions._success = originalOptions.success;

						   options.error = function(_jqXHR, _textStatus, _errorThrown)
						   {
								if (originalOptions.retryLimit == undefined)
								{
									originalOptions.retryLimit = (ns1blankspace.option.retryLimit?ns1blankspace.option.retryLimit:3);
								}

								if (originalOptions.retryCount == undefined) {originalOptions.retryCount = 0}

								if (originalOptions.retryCount == originalOptions.retryLimit || String(_jqXHR.status).substr(0,1) !== '5')
								{
									if (originalOptions._error) {originalOptions._error(_jqXHR, _textStatus, _errorThrown)}
									return;
								};

								if (originalOptions.retryCount == 0)
								{	
									var oErrors = ns1blankspace.util.local.cache.search({key: '1blankspace-debug.json', persist: true});
									if (oErrors == undefined) {oErrors = []}
									oErrors.unshift(
									{
										time: Date(),
										uri: originalOptions.url,
										instance: _jqXHR.getResponseHeader('X-HTTP-myds-instance'),
										fault: _jqXHR.getResponseHeader('X-HTTP-myds-service-fault'),
										statusCode: _jqXHR.status,
										status: _errorThrown
									});

									ns1blankspace.util.local.cache.save({key: '1blankspace-debug.json', persist: true, data: oErrors});
								}	

								originalOptions.retryCount = originalOptions.retryCount + 1;

								$.ajax(originalOptions);
							}

					   	options.success = function(data, _textStatus, _jqXHR)
					   	{
					   		ns1blankspace.ajaxSettings = undefined;

					   		if (originalOptions.global != false)
					   		{	
									if (originalOptions.dataType == 'json' || originalOptions.dataType == '')
									{	
										if (data.status == 'ER')
										{
											if (data.error.errorcode == '1')
											{
												originalOptions.success = originalOptions._success;
												originalOptions._success = undefined;
												ns1blankspace.history.sendOnLogon = originalOptions;
												ns1blankspace.app.start({message: 'You need to log on again.'});		
											}
											else if ((data.error.errornotes).toLowerCase().indexOf('undefined') != -1)
											{
												ns1blankspace.status.error('There is an error with this app.');
											}	
											else
											{	
												ns1blankspace.status.error(data.error.errornotes);
											}	
										}
									}
									else if (originalOptions.dataType == 'text')
									{
										var aResponse = (data).split('|');

										if (aResponse[0] == 'ER')
										{
											if (aResponse[1].indexOf('Not logged on') !== -1)
											{
												originalOptions.success = originalOptions._success;
												originalOptions._success = undefined;
												ns1blankspace.history.sendOnLogon = originalOptions;
												ns1blankspace.app.start({message: 'You need to log on again.'});		
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
								}

								if (originalOptions._managed && originalOptions._rf.toLowerCase() == 'csv')
								{
									data = ns1blankspace.util.convert.csvToJSON({response: data})
								}	
							   		
								if (originalOptions._success !== undefined) {originalOptions._success(data)};
						   }	
						});

						$(document).ajaxError(function(oEvent, oXMLHTTPRequest, oAjaxOptions, oError) 
						{
							ns1blankspace.status.error('An error has occured');
						});	

						if (navigator.platform.indexOf('iPad') != -1 || navigator.platform.indexOf('iPhone') != -1) 
						{
							ns1blankspace.option.setFocus = false;
						}	

						$(document).on('click', '.ns1blankspaceNoUnloadWarn', function (e)
						{
							ns1blankspace.unloadWarning = false;
						});

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
						
						$('input.ns1blankspaceSelect').live('focusout', function() 
						{	
							$(this).removeClass('ns1blankspaceHighlight');
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
							
							$('#ns1blankspaceSelectOptions').button(
							{
								text: false,
								icons:
								{
									primary: "ui-icon-triangle-1-s"
								}
							})
							.click(function()
							{
								ns1blankspace.search.show({xhtmlElementID: ns1blankspace.xhtml.divID, source: 4});
							})
							.css('width', '14px')
							.css('height', '21px')
						});
							
						$('input.ns1blankspaceSelect').live('keyup', function(e)
						{
							if ($(this).val().length == 0) {$(this).attr('data-id', '')}

							if (e.which === 13)
					    	{
								ns1blankspace.search.show({xhtmlElementID: ns1blankspace.xhtml.divID, source: 4});
							}
							else
							{
								if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
							
								var sFunction = "ns1blankspace.search.show({xhtmlElementID: ns1blankspace.xhtml.divID," +
													"source: 1," +
													"minimumLength: 1});"
							
								ns1blankspace.timer.delayCurrent = setTimeout(sFunction, ns1blankspace.option.typingWait);
							}		
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
								// 2.1.9 Was calling contact.email.search which doesn't exist??
								ns1blankspace.search.email.show(ns1blankspace.xhtml.divID, {
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
							if (!$(this).attr('data-nohide') == 'true') {$(ns1blankspace.xhtml.container).hide()};
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
							$(ns1blankspace.xhtml.container).hide();
						});

						$('input.ns1blankspaceDate').live('blur', function() 
						{
							$(this).removeClass('ns1blankspaceHighlight');
						});

						$('.ns1blankspaceTextMulti').live('focus', function()
						{
							$(this).addClass('ns1blankspaceHighlight');
							$(ns1blankspace.xhtml.container).hide();
						});

						$('.ns1blankspaceTextMulti').live('blur', function() 
						{
							$(this).removeClass('ns1blankspaceHighlight');
						});

						$('.ns1blankspaceTextMulti').live('keyup', function() 
						{
							ns1blankspace.inputDetected = true;
						});

						$('.ns1blankspaceViewLink').live('click', function()
						{
							if ($(this).attr('data-id') != undefined && $(this).attr('data-object') != undefined)
							{
								if (ns1blankspace[$(this).attr('data-object')] != undefined)
								{
									ns1blankspace[$(this).attr('data-object')].init({id: $(this).attr('data-id')});
								}	
							}	
						});

						if (window.location.hash === '#PASSWORDEXPIRED')
						{
							ns1blankspace.logon.changePassword.show();
						}
						else
						{	
							ns1blankspace.app.start();
						}
					}	
				},
							
	start: 	function (oParam)
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
							$('#ns1blankspaceViewControlBrowse').html('');
							$('#ns1blankspaceMain').html('');
							$('#ns1blankspaceControl').html('');
							$('#ns1blankspaceLogonName').html('&nbsp;')
							$('#ns1blankspaceLogonName').unbind('click');
							$('#ns1blankspaceSpaceText').html('&nbsp;')
							$('#ns1blankspaceSpaceText').unbind('click');
							ns1blankspace.status.message('');
							$('#ns1blankspaceMultiUseDialog').hide();

							if (data.status === 'ER')
							{
								if (data.error.errornotes == 'No rights (No Access to method)')
								{
									oParam.message = 'You do not have any access rights to this space.';		
								}

								ns1blankspace.logonKey = data.logonkey;
								ns1blankspace.session.logonkey = ns1blankspace.logonKey;
								ns1blankspace.util.local.cache.save({key: '_lk', data: ns1blankspace.logonKey, persist: true})
								ns1blankspace.logon.show(oParam);
							}
							else
							{
								if (ns1blankspace.financial) {ns1blankspace.financial.data = undefined};
								if (ns1blankspace.control.extend !== undefined) {ns1blankspace.control.extend()}
								if (ns1blankspace.control.doLast !== undefined) {ns1blankspace.control.doLast()}
								oParam = ns1blankspace.util.setParam(oParam, 'user', data);

								if (ns1blankspace.session.logonkey == undefined)
								{
									ns1blankspace.session.logonkey = ns1blankspace.util.local.cache.search({key: '_lk', persist: true});
								}

								if (ns1blankspace.session.sid == undefined)
								{
									$.ajax(
									{
										type: 'GET',
										url: ns1blankspace.util.endpointURI('CORE_GET_SID'),
										dataType: 'json',
										cache: false,
										global: false,
										success: function(data) 
										{
											ns1blankspace.session.sid = data.sid;
											ns1blankspace.app.show(oParam)
										}
									});
								}
								else
								{
									ns1blankspace.app.show(oParam)
								}
							}	
						}
					});
				},

	browse: 	function ()
				{
					var aBrowse = ('#abcdefghijklmnopqrstuvwxyz').toUpperCase().split('');

					var aHTML = [];
					
					aHTML.push('<table id="ns1blankspaceViewControlBrowse" class="ns1blankspaceViewControlBrowse">');
					aHTML.push('<tr class="ns1blankspaceViewControlBrowse">');
						
					$.each(aBrowse, function ()
					{
						aHTML.push('<td id="ns1blankspaceViewControlBrowse-' + this + '" class="ns1blankspaceViewControlBrowse">' + this + '</td>');
					});
									
					aHTML.push('<td id="ns1blankspaceViewControlBrowse-" class="ns1blankspaceViewControlBrowseAll">ALL</td></tr></table>');			

					return aHTML.join('');
				},		

	show: 		function (oParam)	
				{
					var bInitialised = ns1blankspace.util.getParam(oParam, 'initialised', {"default": false}).value;

					if (!bInitialised)
					{	
						ns1blankspace.container.hide({sXHTMLElementID: 'ns1blankspaceViewControl'});
						$('#ns1blankspaceViewControl').html('<span style="font-size:1.3em; padding-left:6px; color: #999999;">Initialising the app...</span>');
						oParam = ns1blankspace.util.setParam(oParam, 'onComplete', ns1blankspace.app.show);
						ns1blankspace.extend.init(oParam);
					}	
					else
					{
						var oResponse = ns1blankspace.util.getParam(oParam, 'user').value;

						if (ns1blankspace.option.destination == undefined)
						{
							ns1blankspace.option.destination = window.location.hash;
						}

						var sHash = ns1blankspace.option.destination;
						sHash = sHash.split('?')[0];
						var sDestination;

						var sNS = 'ns1blankspace';
						// Pattern: #/contactBusiness/123/summary/123
						//			#/~/nsFreshcare-admin.user/contactBusiness:1330495,role:Grower

						if (sHash.substr(0, 2) == '#/')
						{	
							var aHash = sHash.split('/');
						
							if (aHash.length > 1)
							{
								if (aHash[1] == '~')
								{
									ns1blankspace.option.destination = sHash.replace('~/', '');
								}
								else
								{				
									ns1blankspace.option.returnToLast = true;

									var sSubNS;
									var aHashNS = aHash[1].split('-');

									if (aHashNS.length == 1)
									{
										sSubNS = aHashNS[0];
									}	
									else
									{
										sNS = aHashNS[0];
										sSubNS = aHashNS[1];
									}

									if (aHash.length == 2)
									{		
										sDestination = sNS + '.' + sSubNS + '.init({showHome: true});';
									}	

									if (aHash.length == 3)
									{
										if (aHash[2].indexOf(':') > -1)
										{
											sDestination = sNS + '.' + sSubNS + '.init({' + aHash[2] + '})';
										}	
										else
										{
											sDestination = sNS + '.' + sSubNS + '.init({id:' + aHash[2] + '})';
										}
									}

									if (aHash.length > 3)
									{
										var sDefaultParam = '';
										if (aHash.length > 4) {sDefaultParam = '{id: ' + aHash[4] + '}'}

										var sDefault = sNS + '.' + sSubNS + '.' + aHash[3];

										sDestination = sNS + '.' + sSubNS + '.init({id: ' + aHash[2] + ', default: "' + sDefault + '", defaultParam: "' + sDefaultParam + '"})';
									}

									ns1blankspace.history.view(
									{
										newDestination: sDestination,
										move: false
									});

									ns1blankspace.option.destination = undefined;
								}	
							}	

							window.location.hash = '';
						}	

						if (oResponse !== undefined)
						{
							ns1blankspace.user.id = oResponse.user;
							ns1blankspace.user.unrestricted = (oResponse.unrestrictedaccess == 'Y' || oResponse.unrestrictedaccess === undefined ? true : false);
							ns1blankspace.user.space = oResponse.space;
							ns1blankspace.user.spaceText = oResponse.spacename
							ns1blankspace.user.logonName = oResponse.userlogonname;

							if (ns1blankspace.option.logonSuffix != undefined)
								{ns1blankspace.user.logonName = ns1blankspace.user.logonName.replace(ns1blankspace.option.logonSuffix, '')}

							ns1blankspace.user.contactPerson = oResponse.contactperson;
							ns1blankspace.user.contactBusiness = oResponse.contactbusiness;
							ns1blankspace.user.contactBusinessText = oResponse.contactbusinesstext;
							ns1blankspace.user.commonName = oResponse.firstname + ' ' + oResponse.surname;
							ns1blankspace.user.email = oResponse.email;
							ns1blankspace.user.systemAdmin = (oResponse.systemadmin == "true");
							
							if (!ns1blankspace.user.systemAdmin)
							{
								ns1blankspace.user.systemAdmin = (oResponse.unrestrictedaccess == 'Y');
							}
							
							ns1blankspace.user.roles = oResponse.roles.rows;

							if (oResponse.site != "0")
							{	
								ns1blankspace.user.site = parseInt(oResponse.site);
							}	

							ns1blankspace.spaceText = oResponse.spacename;
							ns1blankspace.space = oResponse.space;
							ns1blankspace.spaceContactBusiness = oResponse.contactbusiness;
							
							ns1blankspace.unloadWarning = true;

							ns1blankspace.setupShow = ns1blankspace.user.systemAdmin;

							ns1blankspace.control.init(oParam);
						}
					}		
				},

	postInit: 	function (oParam)
				{			
					var aHTML = [];
					var sSpaceText = ns1blankspace.user.spaceText;
					var sSpaceTextExtra;
					if (ns1blankspace.user.spaceText.length > (ns1blankspace.option.spaceTextMaximumLength || 20)) 
					{
						var aSpaceText = ns1blankspace.user.spaceText.substr(0,20).split(' ');
						aSpaceText.pop();
						sSpaceText = aSpaceText.join(' ');
						sSpaceTextExtra = ns1blankspace.user.spaceText.substr(sSpaceText.length);
					}
					
					$('#ns1blankspaceSpaceText').html(sSpaceText + ((sSpaceTextExtra && sSpaceTextExtra.length > 0) 
								? '<span id="ns1blankspacespacetextextra" data-extratext="' + sSpaceTextExtra + '">..</span>' : ''));

					$('#ns1blankspaceLogonName').html(ns1blankspace.user.logonName);
					$('#ns1blankspaceLogoff').html(',&nbsp;log&nbsp;off');

					if (ns1blankspace.xhtml.viewContainer !== undefined)
					{
						aHTML.push(ns1blankspace.xhtml.viewContainer);
					}	
					else
					{	
						aHTML.push('<div id="ns1blankspaceViewControlHomeContainer">' +
										'<span id="ns1blankspaceViewControlHome">&nbsp;</span>' +
										'<span id="ns1blankspaceViewControlHomeOptions">&nbsp;</span>' +
										'</div>');

						if (ns1blankspace.option.showFavourites)
						{
							aHTML.push('<div id="ns1blankspaceViewControlHistoryContainer">' +
										'<span id="ns1blankspaceViewControlRefresh" >&nbsp;</span>' +
										'<span id="ns1blankspaceViewControlFavourites">&nbsp;</span>' +
										'</div>');
						}	
						else
						{				
							aHTML.push('<div id="ns1blankspaceViewControlHistoryContainer">' +
										'<span id="ns1blankspaceViewControlBack" >&nbsp;</span>' +
										'<span id="ns1blankspaceViewControlRefresh">&nbsp;</span>' +
										'<span id="ns1blankspaceViewControlForward">&nbsp;</span>' +
										'</div>');
						}							
								
						aHTML.push('<div id="ns1blankspaceViewControlViewContainer">' +
										'<span id="ns1blankspaceViewControlView">&nbsp;</span>' +
										'</div>');
										
						aHTML.push('<div id="ns1blankspaceViewControlSearchContainer">' +
										'<input id="ns1blankspaceViewControlSearch"')

						if (ns1blankspace.option.searchWatermark != undefined)
						{	
							aHTML.push(' class="ns1blankspaceWatermark" value="' + ns1blankspace.option.searchWatermark + '"');
						}

						aHTML.push('></div>');

										
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
					}	
					
					$('#ns1blankspaceViewControl').html(aHTML.join(''));

					if (!ns1blankspace.setupShow) 
					{
						$('#ns1blankspaceViewControlActionStatus')
							.css('width', '215px');
					}

					ns1blankspace.app.bind(oParam);

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
					
	bind: 		function (oParam)	
				{					
					$('#ns1blankspaceViewControlHome')
						.button({
								text: false,
								icons: {
									primary: "ui-icon-home"
								}})
						.click(function(event)
						{
							ns1blankspace.home.init();
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

					if (ns1blankspace.option.showFavourites)
					{
						$('#ns1blankspaceViewControlRefresh')
								.button({
									label: 'Back to top',
									text: false,
									icons:
									{
										primary: "ui-icon-arrowthickstop-1-n"
									}
								})
								.click(function()
								{
									var sNS = ns1blankspace.namespace;
									if (sNS == undefined) {sNS = 'ns1blankspace'}

									if (ns1blankspace.objectParentName !== undefined)
									{
										window[sNS][ns1blankspace.objectParentName][ns1blankspace.objectName].init();
									}	
									else
									{
										window[sNS][ns1blankspace.objectName].init();
									}	
								})
								.css('width', '25px')
								.css('margin-left', '20px')
							.next()
								.button(
								{
									text: false,
									disabled: false,
									label: 'Most used',
									icons:
									{
										primary: "ui-icon-star"
									}
								})
								.click(function()
								{
									ns1blankspace.control.favourites.show({instruction: 3});
								})
								.css('width', '25px')
								.css('margin-left', '4px')
								.parent()
									.buttonset();
					}
					else
					{
						$('#ns1blankspaceViewControlBack')
							.button({
									label: 'Previous',
									text: false,
									icons: {}
									})
							.click(function(event)
							{
								ns1blankspace.history.view({instruction: 2});
							})
							.css('width', '19px')
							.next()
								.button(
								{
									label: 'Back to top',
									text: false,
									icons:
									{
										primary: "ui-icon-arrowthickstop-1-n"
									}
								})
								.click(function()
								{
									var sNS = ns1blankspace.namespace;
									if (sNS == undefined) {sNS = 'ns1blankspace'}

									if (ns1blankspace.objectParentName !== undefined)
									{
										window[sNS][ns1blankspace.objectParentName][ns1blankspace.objectName].init();
									}	
									else
									{
										window[sNS][ns1blankspace.objectName].init();
									}	
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
					}				
					
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
							ns1blankspace.setup["switch"]();
						});	
					
					$('#ns1blankspaceViewControlHelp')
						.button({
								text: false,
								icons: {
									primary: "ui-icon-help"
								}})
						.click(function() 
						{
							ns1blankspace.supportIssue.init();
						});		
					
					$('#ns1blankspaceLogonOptions').button(
					{
						text: false,
						label: 'Log off, change password...',
						icons:
						{
							primary: "ui-icon-triangle-1-s"
						}
					})
					.click(function(event)
					{
						ns1blankspace.control.user.show(this);
					})
					.css('width', '12px;')
					.css('height', '27px;');

					if (ns1blankspace.option.showLogonOptionsOnHover)
					{
						$('#ns1blankspaceLogonName').hover(
						function(event)
						{
							ns1blankspace.container.position({xhtmlElementID: this.id, leftOffset: 379, topOffset: -5});
							$(ns1blankspace.xhtml.container).attr('data-initiator', '');

							$vq.clear({queue: 'logoff'});
							$vq.add('<div id="ns1blankspaceUserLogOnOff" class="ns1blankspaceViewControlContainer" style="font-size:0.875em; width:60px; cursor:pointer; text-align:center;">Log off</div>', {queue: 'logoff'});
							$vq.render(ns1blankspace.xhtml.container, {queue: 'logoff'});

							$(ns1blankspace.xhtml.container).show();

							$('#ns1blankspaceUserLogOnOff').click(function(event)
							{
								ns1blankspace.logOff();
							})
							.mouseleave(function()
							{
								$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
								$(ns1blankspace.xhtml.container).attr('data-initiator', '');
							});
						},
						function(event)
						{
							if (event.toElement != undefined)
							{	
								if (event.toElement.id != 'ns1blankspaceMultiUseContainer' && event.toElement.id != this.id)
								{
									$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
									$(ns1blankspace.xhtml.container).attr('data-initiator', '');
								}
							}	
						});
					}	

					$('#ns1blankspaceLogonName').click(function(event)
					{
						ns1blankspace.control.user.show(this);
					});

					$('#ns1blankspaceLogoff').click(function(event)
					{
						ns1blankspace.logOff();
					});

					$('#ns1blankspaceSpaceText').click(function(event)
					{
						ns1blankspace.control.spaces.show(this);
					});

					$('#ns1blankspaceSpaceTextExtra').hover(
					function(event)
					{
						var sSpaceText = $(this).html();
						var sSpaceTextExtra = $(this).attr('data-extraText');
						$(this).html(sSpaceTextExtra);
					},
					function(event)
					{
						$(this).html('..');
					});

					if (ns1blankspace.option.showBrowsing)
					{
						$('#ns1blankspaceViewControlBrowse').html(ns1blankspace.app.browse());
						$('#ns1blankspaceControl')
							.css('top', '90px');
						$('#ns1blankspaceMain')
							.css('top', '90px');
					}
					else
					{
						$('#ns1blankspaceViewControlBrowse').remove();
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
					$(ns1blankspace.xhtml.container).html('');			
					$(ns1blankspace.xhtml.container).hide();
					$(ns1blankspace.xhtml.dropDownContainer).html('');
					$(ns1blankspace.xhtml.dropDownContainer).hide();
					$('#ns1blankspaceViewControlSearch').unbind('keyup');
					$('#ns1blankspaceViewControlSearch').unbind('click');
					$('#ns1blankspaceViewControlSearch').unbind('click');
					$('#ns1blankspaceViewControlSearchOptions').unbind('click');
					$('#ns1blankspaceViewControlNew').unbind('click');
					$('#ns1blankspaceViewControlNewOptions').unbind('click');
					$('#ns1blankspaceViewControlAction').unbind('click');
					$('#ns1blankspaceViewControlActionOptions').unbind('click');
					$('#ns1blankspaceViewControlSetupOptions').unbind('click');
					$('#ns1blankspaceViewControlHelpOptions').unbind('click');
					$('td.ns1blankspaceViewControlBrowse').unbind('click');
					$('td.ns1blankspaceViewControlBrowseAll').unbind('click');
					$('#ns1blankspaceViewControlActionStatus').text('');
					$('#ns1blankspaceViewControlAction').button({label: "Save"});
					if (ns1blankspace.timer.messaging != 0) {clearInterval(ns1blankspace.timer.messaging)};
					ns1blankspace.util.app.option({titleSuffix: ''});
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

	clean:		function()
				{	
					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
					$(ns1blankspace.xhtml.dropDownContainer).hide(ns1blankspace.option.hideSpeedOptions);
				},			

	refresh: 	function (oParam)
				{
					var sParentNamespace = ns1blankspace.objectParentName;
					var sNamespace = ns1blankspace.objectName;
					var oRoot = ns1blankspace.util.getParam(oParam, 'rootnamespace', {"default": ns1blankspace}).value
							
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
					var bNew = false;
					var iID;
					var bExtendInit = true;
					var oRoot = ns1blankspace.util.getParam(oParam, 'rootNamespace', {"default": ns1blankspace}).value
					var sRoot = ns1blankspace.util.getParam(oParam, 'rootNameSpaceText', {"default": 'ns1blankspace'}).value

					if (oParam != undefined)
					{
						if (oParam.namespace != undefined) {sNamespace = oParam.namespace}
						if (oParam.parentNamespace != undefined) {sParentNamespace = oParam.parentNamespace}
						if (oParam.showHome != undefined) {bShowHome = oParam.showHome}	
						if (oParam["new"] != undefined) {bNew = oParam["new"]}
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
								var sNS = sRoot + '.' + sParentNamespace + '.' + sNamespace;
							}
							else
							{
								var oNS = oRoot[sNamespace];
								var sNS = sRoot + '.' + sNamespace;
							}

							$('#ns1blankspaceViewControlRefresh').unbind('click').click(function(oParam)
							{
								oNS.init({showHome: true});	
							});

							$('#ns1blankspaceViewControlViewContainer').button(
							{
								label: ns1blankspace.viewName
							});
							
							$('#ns1blankspaceViewControlSearch').keyup(function(event)
							{
								if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
						        ns1blankspace.timer.delayCurrent = setTimeout(sNS + '.search.send("ns1blankspaceViewControlSearch")', ns1blankspace.option.typingWait);
							});

							$('td.ns1blankspaceViewControlBrowse, td.ns1blankspaceViewControlBrowseAll').click(function()
							{
								oNS.search.send(this.id, {source: ns1blankspace.data.searchSource.browse});
							});
							
							$('#ns1blankspaceViewControlSearch').focusin(function(event)
							{
								ns1blankspace.search.advanced.show();
							});
							
							$("#ns1blankspaceViewControlSearch").click(function()
							{
							    this.select();
							});

							$('#ns1blankspaceViewControlSearchOptions').click(function(event)
							{
								if ($(this).attr("disabled") != 'disabled')
								{
									oNS.search.options.show();
								}	
							});
							
							$('#ns1blankspaceViewControlNew').click(function(event)
							{
								if ($(this).attr("disabled") != 'disabled')
								{	
									oNS.init({"new": true});
								}	
							});
							
							$('#ns1blankspaceViewControlNew').button({disabled: false});

							$('#ns1blankspaceViewControlNewOptions').click(function(event)
							{
								if ($(this).attr("disabled") != 'disabled')
								{
									oNS["new"].options();
								}	
							});
							
							$('#ns1blankspaceViewControlAction').click(function(event)
							{
								if ($(this).attr("disabled") != 'disabled')
								{
									oNS.save.send();
								}	
							});
							
							$('#ns1blankspaceViewControlAction').button({disabled: true});
							
							$('#ns1blankspaceViewControlActionOptions').click(function(event)
							{
								if ($(this).attr("disabled") != 'disabled')
								{
									ns1blankspace.app.options.show($.extend(true, oParam,
									{
										element: this,
										xhtml: undefined,
										namespace: oNS,
										namespaceText: sNS
									}));
								}	
							});
							
							$('#ns1blankspaceViewControlActionOptions').button({disabled: true});
								
							$('#ns1blankspaceControl').html('');	

							if (ns1blankspace.option.setFocus) {$('#ns1blankspaceViewControlSearch').focus()};

							if (bNew) 
							{
								ns1blankspace.objectContextData = undefined
								ns1blankspace.objectContext = -1;
								$('#ns1blankspaceViewControlAction').button({disabled: false});
							
								if (typeof(oNS["new"]) === 'function')
								{
									oNS["new"]()
								}	
								else
								{
									if (typeof(oNS.layout) === 'function') {oNS.layout()}
									ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
									if (typeof(oNS.details) === 'function') {oNS.details()} else {oNS.home.show()}
								}		
							}
							else
							{
								if (iID)
								{	
									oNS.search.send('-' + iID, oParam);
								}
								else
								{	
									if (bShowHome) 
									{
										ns1blankspace.history.view(
										{
											newDestination: sNS + '.init()',
											move: false
										});	

										if (typeof(oNS.home) === 'function') {oNS.home(oParam)} else {oNS.home.show(oParam)}
									}
								}		
							}
						}	
					}	
				},

	context: 	function (oParam)
				{
					var bNew = ns1blankspace.util.getParam(oParam, 'new', {"default": false}).value;
					var bAction = ns1blankspace.util.getParam(oParam, 'action', {"default": false}).value;
					var bActionOptions = ns1blankspace.util.getParam(oParam, 'actionOptions', {"default": false}).value;
					var bContext = ns1blankspace.util.getParam(oParam, 'in').value;
					if (bContext == undefined) {bContext = ns1blankspace.util.getParam(oParam, 'inContext', {"default": true}).value};
					var bAll = ns1blankspace.util.getParam(oParam, 'all', {"default": true}).value;

					var bSpecific = (bNew || bAction || bActionOptions);

					if (bAll || bNew) {$('#ns1blankspaceViewControlNew').button({disabled: !bContext && (!bSpecific || bNew)})};
					if (bAll || bAction) {$('#ns1blankspaceViewControlAction').button({disabled: !bContext && (!bSpecific || bAction)})};
					if (bAll || bActionOptions) {$('#ns1blankspaceViewControlActionOptions').button({disabled: !bContext && (!bSpecific || bActionOptions)})};
				},				

	options: 	{
					show: 		function (oParam)
								{
									var oElement;
									var sXHTML;
									var fBind = ns1blankspace.viewOptionsBind;
									var aXHTMLAudit = [];

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

									if (ns1blankspace.objectContextData.createddate !== undefined)
									{
										aXHTMLAudit.push('<tr><td class="ns1blankspaceSummaryCaption">Created</td></tr>' +
															'<tr><td class="ns1blankspaceSummary">' +
															ns1blankspace.objectContextData.createddate + '</td></tr>');
									}

									if (ns1blankspace.objectContextData.createdusertext !== undefined)
									{
										aXHTMLAudit.push('<tr><td class="ns1blankspaceSummaryCaption">Created By</td></tr>' +
															'<tr><td class="ns1blankspaceSummary">' +
															ns1blankspace.objectContextData.createdusertext + '</td></tr>');
									}

									if (ns1blankspace.objectContextData.modifieddate !== undefined)
									{
										aXHTMLAudit.push('<tr><td class="ns1blankspaceSummaryCaption">Last Updated</td></tr>' +
															'<tr><td class="ns1blankspaceSummary">' +
															ns1blankspace.objectContextData.modifieddate + '</td></tr>');
									}

									if (ns1blankspace.objectContextData.modifiedusertext !== undefined)
									{
										aXHTMLAudit.push('<tr><td class="ns1blankspaceSummaryCaption">Last Updated By</td></tr>' +
															'<tr><td class="ns1blankspaceSummary">' +
															ns1blankspace.objectContextData.modifiedusertext + '</td></tr>');
									}

									if (aXHTMLAudit.length != 0)
									{
										sXHTML += '<table class="ns1blankspaceViewControlContainer" style="font-size:0.75em;">' + aXHTMLAudit.join('') + '</table>';
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
										
										if (fBind !== undefined)
										{
											fBind(oParam);
										}
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
									var oNS = ns1blankspace.util.getParam(oParam, 'namespace').value;
									var fDoRemove = ns1blankspace.util.getParam(oParam, 'doRemove').value;

									if (oNS == undefined)
									{	
										if (ns1blankspace.objectParentName)
										{
											oNS = ns1blankspace[ns1blankspace.objectParentName][ns1blankspace.objectName];
										}
										else
										{
											oNS = ns1blankspace[ns1blankspace.objectName];
										}
									}	

									if (oResponse === undefined)
									{
										if (fDoRemove == undefined)
										{
											fDoRemove = oNS['remove'];
										}

										if (fDoRemove !== undefined)
										{
											fDoRemove(oParam);
										}
										else
										{
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

											if (sMethod !== undefined)
											{
												sMethod += '_MANAGE';

												$('#ns1blankspaceControlActionOptionsRemove').html(ns1blankspace.xhtml.loadingSmall);

												var oData = {remove: 1, id: ns1blankspace.objectContext}

												if (ns1blankspace.option.financialOverride)
												{
													oData.override = 'Y'
												}	

												$.ajax(
												{
													type: 'POST',
													url: ns1blankspace.util.endpointURI(sMethod),
													data: oData,
													dataType: 'json',
													success: function(data){ns1blankspace.app.options.remove(oParam, data)}
												});

											}
											else
											{
												ns1blankspace.app.options.hide();
												ns1blankspace.status.error('Cannot delete!')
											}
										}		
									}	
									else //oResponse
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
					
					ns1blankspace.logonInitialised = false;

					if (oParam != undefined)
					{
						if (oParam.objectContext != undefined) {iObjectContext = oParam.objectContext}
						if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
						if (oParam.message != undefined) {sMessage = oParam.message}
					}	
						
					$('#ns1blankspaceViewControl').html('&nbsp;');
						
					aHTML.push('<table id="ns1blankspaceLogonContainer">');
					
					aHTML.push('<tr><td style="width:235px; padding-right:25px;">');

					aHTML.push('<table id="ns1blankspaceLogon" class="ns1blankspaceLogonContainer">');

					aHTML.push('<tr>' +
									'<td class="ns1blankspaceLogonCaption">' +
									'Logon Name' +
									'</td>')

					aHTML.push('<td class="ns1blankspaceLogonSub" style="padding-right:2px;">' +
									'remember <input style="margin:0px; padding:0px; border: 0px; margin-top:3px;" type="checkbox" id="ns1blankspaceLogonRemember"/></td></tr>');

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

					aHTML.push('<tr class="ns1blankspacePasswordCodeContainer" style="display:none;">' +
									'<td class="ns1blankspaceLogonCaption">' +
									'Code</td>');

					aHTML.push('<td class="ns1blankspaceLogonSub" style="padding-right:2px;">' +
									'<span id="ns1blankspacePasswordCodeSend" style="cursor: pointer;">resend</span>' +
									'</td></tr>');

					aHTML.push('<tr class="ns1blankspacePasswordCodeContainer" style="display:none;"><td class="ns1blankspaceLogonText" colspan=2 style="padding-bottom: 15px;">' +
									'<input id="ns1blankspaceLogonPasswordCode" class="ns1blankspaceLogon" type="password">' +
									'</td></tr>');

					aHTML.push('<tr>' +
								'<td class="ns1blankspaceLogon" style="width:110px">' +
								'<span id="ns1blankspaceLogonSend">Log on</span>' +
								'</td>');
				
					aHTML.push('<td id="ns1blankspaceLogonStatus" style="vertical-align:middle;">' +
								'&nbsp;' +
								'</td></tr>');

					aHTML.push('<tr><td id="ns1blankspaceLogonMessage" class="ns1blankspaceSub" colspan=2 style="padding-top: 15px;">' +
									sMessage + '</td></tr>');	

					aHTML.push('</table>');					
					
					if (ns1blankspace.xhtml.logonNotes)
					{	
						aHTML.push('</td><td class="ns1blankspaceLogonNotes">');
					
						aHTML.push('<table class="ns1blankspace"><tr><td>' +
										ns1blankspace.xhtml.logonNotes +
										'</td></tr></table>');
					}

					if (ns1blankspace.xhtml.logonNotesFooter)
					{	
						aHTML.push('</td></tr><tr><td style="padding:8px; padding-top:15px;" class="ns1blankspaceLogonNotesFooter">' +
									ns1blankspace.xhtml.logonNotesFooter);
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
						if (!$('#ns1blankspaceLogonPassword').is(':focus')) {$('#ns1blankspaceLogonPassword').focus()}
					}
					else
					{
						if (!$('#ns1blankspaceLogonLogonName').is(':focus')) {$('#ns1blankspaceLogonLogonName').focus()}
					}
					
					$('#ns1blankspaceLogonSend').button(
					{
						label: "Logon"
					})
					.click(function() 
					{
						ns1blankspace.logon.init();
					});	

					$('#ns1blankspaceLogonLogonName').keypress(function(e)
					{
					    if (e.which === 13)
					    {
					        ns1blankspace.logon.init();
					    }
					});

					$('#ns1blankspaceLogonPassword').keypress(function(e)
					{
					    if (e.which === 13)
					    {
					        ns1blankspace.logon.init();
					    }
					});

					$('#ns1blankspacePasswordSend').click(function()
					{
						ns1blankspace.logon.getPassword.show();
					});

					$('#ns1blankspacePasswordCodeSend').click(function()
					{
						ns1blankspace.logonInitialised = false;
						ns1blankspace.logon.init();
					});
				},

	init: 		function ()
				{
					if (ns1blankspace.logonInitialised)
					{
						ns1blankspace.logon.send();
					}	
					else
					{
						var sLogonName = $('#ns1blankspaceLogonLogonName').val();
						var sPassword = $('#ns1blankspaceLogonPassword').val();

						if (ns1blankspace.option.logonSuffix != undefined)
							{sLogonName = sLogonName + ns1blankspace.option.logonSuffix}

						if (ns1blankspace.option.passwordSuffix != undefined)
							{sPassword = sPassword + ns1blankspace.option.passwordSuffix}	

						var oData = 
						{
							method: 'LOGON_GET_USER_AUTHENTICATION_LEVEL',
							logon: sLogonName
						}	

						oData.passwordhash = ns1blankspace.util.hash({value: sLogonName + sPassword})
						
						$('#ns1blankspaceLogonStatus').html(ns1blankspace.xhtml.loading);
						
						$.ajax(
						{
							type: 'POST',
							url: '/rpc/logon/',
							data: oData,
							global: false,
							dataType: 'json',
							success: function (data)
							{
								ns1blankspace.authenticationLevel = data.authenticationlevel;

								if (ns1blankspace.authenticationLevel == '3')
								{	
									$('#ns1blankspaceLogonMessage').html('A logon code is being sent to you via ' + (data.authenticationdelivery==1?'email':'SMS') + '.')

									var oData = 
									{
										method: 'LOGON_SEND_PASSWORD_CODE',
										logon: sLogonName
									}	

									oData.passwordhash = ns1blankspace.util.hash({value: sLogonName + sPassword + ns1blankspace.logonKey});

									$.ajax(
									{
										type: 'POST',
										url: '/rpc/logon/',
										data: oData,
										global: false,
										dataType: 'json',
										success: function (data)
										{
											if (data.status == 'OK')
											{	
												$('tr.ns1blankspacePasswordCodeContainer').show();
												$('#ns1blankspaceLogonStatus').html('');
												$('#ns1blankspaceLogonMessage').html('Please enter the code sent to you via ' + (data.authenticationdelivery==1?'email':'SMS') + ', and then press Logon again.');
												ns1blankspace.logonInitialised = true;
												$('#ns1blankspaceLogonPasswordCode').focus();
											}
											else
											{
												$('#ns1blankspaceLogonStatus').html('There is an issue with your user account (' + data.error.errornotes + ').');
												$('#ns1blankspaceContainer').effect("shake", { times:2 }, 100);
											}	
										}
									});		
								}
								else
								{	
									ns1blankspace.logon.send();
								}
							}	
						});	
					}
				},

	send: 	function (oParam)
				{
					var iAuthenticationLevel = ns1blankspace.authenticationLevel;
					var dNow = new Date();
					var sLogonName = $('#ns1blankspaceLogonLogonName').val();
					var sPassword = $('#ns1blankspaceLogonPassword').val();

					if (ns1blankspace.option.logonSuffix != undefined)
						{sLogonName = sLogonName + ns1blankspace.option.logonSuffix}

					if (ns1blankspace.option.passwordSuffix != undefined)
						{sPassword = sPassword + ns1blankspace.option.passwordSuffix}	

					var oData = 
					{
						method: 'LOGON',
						logon: sLogonName,
						localtime: dNow.toString('dd MMM yyyy HH:mm')
					}	

					if (iAuthenticationLevel == 1)
					{
						oData.passwordhash = ns1blankspace.util.hash({value: sLogonName + sPassword})
					}
					else if (iAuthenticationLevel == 2)
					{
						oData.passwordhash = ns1blankspace.util.hash({value: sLogonName + sPassword + ns1blankspace.logonKey})
					}
					else if (iAuthenticationLevel == 3)
					{
						oData.passwordhash = ns1blankspace.util.hash({value: sLogonName + sPassword + ns1blankspace.logonKey + $('#ns1blankspaceLogonPasswordCode').val()})
					}
					
					$('#ns1blankspaceLogonStatus').html(ns1blankspace.xhtml.loading);
					
					$.ajax(
					{
						type: 'POST',
						url: '/rpc/logon/',
						global: false,
						data: oData,
						dataType: 'json',
						success: this.process
					})
				},

	process: function (oResponse)	
				{		
					ns1blankspace.session = oResponse;

					if (oResponse.status === 'ER')
					{
						if (oResponse.error.errornotes == 'Can only call the LOGON Method via https')
						{
							$('#ns1blankspaceLogonStatus').html('Insecure connection!<br /><a href="' +
									window.location.href.replace('http', 'https') + '">Go to secure logon</a>');
						}
						else
						{	
							$('#ns1blankspaceLogonStatus').html('Logon name or password is incorrect.');
						}

						$('#ns1blankspaceContainer').effect("shake", { times:2 }, 100);
					}
					else 
					{
						ns1blankspace.logonKey = oResponse.logonkey;
						ns1blankspace.session.logonkey;
						ns1blankspace.util.local.cache.save({key: '_lk', data: ns1blankspace.logonKey, persist: true})

						$('#ns1blankspaceLogonStatus').html('Logon successful, starting app...');
						
						if ($('#ns1blankspaceLogonRemember').attr('checked'))
						{
							$.cookie('mydigitalstucturelogonname', $('#ns1blankspaceLogonLogonName').val(), {expires:30});
						}
						
						var sStatus = (oResponse.passwordStatus!==undefined?oResponse.passwordStatus:oResponse.passwordstatus);

						if (sStatus === "EXPIRED")
						{
							ns1blankspace.logon.changePassword.show(); 
						}
						else
						{	
							if (oResponse.url === '#' || ns1blankspace.option.logonStayOnDocument)
							{
								ns1blankspace.container.hide({force: true});
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

						if (ns1blankspace.option.passwordSuffix != undefined)
						{	
							sNewPassword = sNewPassword + ns1blankspace.option.passwordSuffix;
							sNewPasswordConfirm = sNewPasswordConfirm + ns1blankspace.option.passwordSuffix;
							sCurrentPassword = sCurrentPassword + ns1blankspace.option.passwordSuffix;
						}

						var iDays = (ns1blankspace.option.passwordExpiry!=undefined?(ns1blankspace.option.passwordExpiry.days||36500):36500);
						var iSite = (ns1blankspace.option.passwordExpiry!=undefined?ns1blankspace.option.passwordExpiry.site:ns1blankspace.user.site)

						var oData =
						{
							expiredays: iDays,
							site: iSite,
							currentpassword: sCurrentPassword,
							newpassword: sNewPassword,
							newpasswordconfirm: sNewPasswordConfirm
						}	
						
						$.ajax(
						{
							type: 'POST',
							url: ns1blankspace.util.endpointURI('SITE_USER_PASSWORD_MANAGE'),
							data: oData,
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
						ns1blankspace.unloadWarning = false;
					
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
										
						var sData = 'site=' + mydigitalstructureSiteId +
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
								ns1blankspace.logonInitialised = false;
								ns1blankspace.logonKey = '';
								ns1blankspace.extend.structure = undefined;
								ns1blankspace.financial.data = undefined;
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
								if (sFunctionDefault !== undefined)
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
							var aFunctionDefault = (sFunctionDefault).split('(');
							var sFunctionDefaultNamespace = aFunctionDefault[0];
							var sFunctionDefaultParam = (aFunctionDefault[1]).split(')')[0];

							var fFunctionDefaultNamespace = ns1blankspace.util.toFunction(sFunctionDefaultNamespace)

							if (fFunctionDefaultNamespace !== undefined)
							{	
								if (sFunctionDefaultParam.substring(0,1) == "{")
								{
									fFunctionDefaultNamespace(ns1blankspace.util.toObject(sFunctionDefaultParam));
								}
								else if (sFunctionDefaultParam != '')
								{	
									fFunctionDefaultNamespace(sFunctionDefaultParam);
								}
								else
								{	
									fFunctionDefaultNamespace();
								}
							}	

							//ns1blankspace.util.execute(sFunctionDefault, oParam);
						}
						else
						{
							$('.ns1blankspaceControl').removeClass('ns1blankspaceHighlight');
							$('#' + sXHTMLElementID).addClass('ns1blankspaceHighlight');
							$('#' + sXHTMLElementID).click();
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
								if (sDestinationInstructions !== ns1blankspace.history.lastDestinationInstruction)
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
										dataType: 'json'
									});
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
					
							if (!ns1blankspace.option.showFavourites)
							{	
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
											primary: "ui-icon-arrowthickstop-1-n"
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
							}			
					
							$('#ns1blankspaceViewControlBack')
								.button({disabled: bBack})
					
							$('#s1blankspaceViewControlForward')
								.button({disabled: bForward})
					
							sDestinationInstructions = ns1blankspace.history.viewList[ns1blankspace.history.currentIndex]
							ns1blankspace.history.lastDestinationInstruction = sDestinationInstructions;
							
							if (bMove)
							{	
								var aDestinationInstructions = sDestinationInstructions.split(';');
								var aDestination = (aDestinationInstructions[0]).split('(');
								var sDestinationNamespace = aDestination[0];
								var sDestinationParam = (aDestination[1]).split(')')[0];

								if (sDestinationNamespace)
								{									
									if ((sDestinationNamespace).indexOf('setup') != -1 && ns1blankspace.option.autoSetupSwitch)
									{
										ns1blankspace.setupView = false;
										$('#ns1blankspaceViewControlSetup').attr('checked', true);
										$('#ns1blankspaceViewControlSetup').button('refresh');
										ns1blankspace.setup["switch"]({viewNamespace: sDestinationNamespace});
									}
									else
									{	
										if (sDestinationNamespace !== undefined)
										{	
											var fDestinationNamespace = ns1blankspace.util.toFunction(sDestinationNamespace)

											if (fDestinationNamespace !== undefined)
											{	
												if (sDestinationParam.substring(0,1) == "{")
												{
													fDestinationNamespace(ns1blankspace.util.toObject(sDestinationParam));
												}
												else if (sDestinationParam != '')
												{	
													fDestinationNamespace(sDestinationParam);
												}
												else
												{	
													fDestinationNamespace();
												}
											}	
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

ns1blankspace.setup = 
{
	"switch":		function (oParam)
				{
					var sViewNamespace;
					var sXHTMLElementID;

					if (oParam != undefined)
					{
						if (oParam.viewNamespace != undefined) {sViewNamespace = oParam.viewNamespace}
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
							label: 'Select...'
						})
						.click(function() 
						{
							ns1blankspace.control.views.show(this);;
						});

						var fViewNamespace = ns1blankspace.util.toFunction(sViewNamespace);

						if (fViewNamespace !== undefined)
						{
							fViewNamespace();
						}
						else
						{
							ns1blankspace.control.setView["default"]();
						}
					}
					else
					{
						ns1blankspace.setupView = true;

						$('#ns1blankspaceViewControlViewContainer')
						.click(function() 
						{
							ns1blankspace.control.setup.views.show(this);
						});
						
						var fViewNamespace = ns1blankspace.util.toFunction(sViewNamespace)

						if (fViewNamespace !== undefined)
						{
							fViewNamespace();
						}
						else
						{
							ns1blankspace.control.setView.setup();
						}
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
	clear: 		function (oParam)
				{	
					var iDuration = ns1blankspace.util.getParam(oParam, 'duration').value;

					if (iDuration === undefined)
					{	
						$('#ns1blankspaceViewControlActionStatus').html('&nbsp;');
					}
					else
					{
						window.setTimeout('$("#ns1blankspaceViewControlActionStatusMessage").fadeOut(3000)', iDuration);
					}	
				},

	message: 	function (sStatus, oParam)
				{	
					var bTimeout = ns1blankspace.util.getParam(oParam, 'timeout', {"default": true}).value;
					var iDuration = ns1blankspace.util.getParam(oParam, 'duration', {"default": 6000}).value;

					$('#ns1blankspaceViewControlActionStatus').html('<div style="position:relative;width:100%;height:35px;width:180px;">' +
							'<div id="ns1blankspaceViewControlActionStatusMessage" style="display:table-cell; vertical-align:bottom; padding-bottom:5px; height:25px;">' + sStatus + '</div></div>');

					if (bTimeout)
					{
						window.setTimeout('$("#ns1blankspaceViewControlActionStatusMessage").fadeOut(3000)', iDuration);
					}	
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
							ns1blankspace.container.show(
							{
								xhtmlElementID: 'ns1blankspaceViewControlActionStatus',
								xhtml: '<div style="font-size: 0.75em; background-color: #F8F8F8; width: 100%; color: #888888; ' +
											'border-style:solid; border-width: 7px;border-color: #F8F8F8; opacity: 0.95;">' + sError + '</div>',
								forceShow: true,
								offsetTop: 8,
								setWidth: true,
								timeOut: 7000,
								fadeOutTime: 3500
							});	
						});

						ns1blankspace.container.show(
						{
							xhtmlElementID: 'ns1blankspaceViewControlActionStatus',
							xhtml: '<div style="font-size: 0.75em; background-color: #F8F8F8; width: 100%; color: #888888; ' +
										'border-style:solid; border-width: 7px;border-color: #F8F8F8; opacity: 0.95;">' + sError + '</div>',
							forceShow: true,
							offsetTop: 8,
							setWidth: true,
							timeOut: 10000,
							fadeOutTime: 3500
						});				
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
					var iTimeOut = ns1blankspace.util.getParam(oParam, 'timeOut').value;
					var fOnShow;
					var sContainerID = ns1blankspace.xhtml.container;

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
						if (oParam.onShow != undefined) {fOnShow = oParam.onShow}
						if (oParam.containerID != undefined) {sContainerID = oParam.containerID}
					}

					var bDropdown = ns1blankspace.util.getParam(oParam, 'dropdown', {"default": false}).value;
					if (bDropdown) {sContainerID = ns1blankspace.xhtml.dropDownContainer}
					
					if (oXHTMLElement === undefined && sXHTMLElementID != undefined)
					{
						oXHTMLElement = $('#' + sXHTMLElementID)
					}
					
					if (iTimeOut)
					{	
						window.setTimeout('ns1blankspace.container.hide(' + JSON.stringify(oParam) + ')', iTimeOut);
					}	

					if (oXHTMLElement !== undefined)
					{
						if ($(sContainerID).attr('data-initiator') === oXHTMLElement.attr('id') && !bForceShow)
						{
							$(sContainerID).hide(ns1blankspace.option.hideSpeedOptions);
							$(sContainerID).attr('data-initiator', '');
							return false;
						}
						else
						{
							$(sContainerID).attr('data-initiator', oXHTMLElement.attr('id'));
							$(sContainerID).html("&nbsp;")
								.show(ns1blankspace.option.showSpeedOptions)
								.offset({ top: $(oXHTMLElement).offset().top + $(oXHTMLElement).height() + iOffsetTop, left: $(oXHTMLElement).offset().left + iOffsetLeft})
								.html(sXHTML);
							
							if (bSetWidth) {$(sContainerID + ' table').css('width', oXHTMLElement.width())}

							if (sFunctionBind != undefined)
								{eval(sFunctionBind)}

							if (fOnShow != undefined)
								{fOnShow(oParam)}

							return true;
						}
					}	
				},

	hide:		function (oParam)
				{
					var iFadeOutTime = ns1blankspace.util.getParam(oParam, 'fadeOutTime', {"default": ns1blankspace.option.hideSpeedOptions}).value;
					var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;
					var bForce = ns1blankspace.util.getParam(oParam, 'force', {"default": false}).value;
					var sContainerID = ns1blankspace.util.getParam(oParam, 'containerID', {"default": ns1blankspace.xhtml.container}).value;
					var bDropdown = ns1blankspace.util.getParam(oParam, 'dropdown', {"default": false}).value;
					if (bDropdown) {sContainerID = ns1blankspace.xhtml.dropDownContainer}

					if (bForce || $(ns1blankspace.xhtml.container).attr('data-initiator') == sXHTMLElementID)
					{
						if (iFadeOutTime == 0)
						{
							$(sContainerID).attr('data-initiator', '')
							.html("&nbsp;")
							.hide();
						}
						else
						{
							$(sContainerID).attr('data-initiator', '')
							.fadeOut(iFadeOutTime);
						}
					}	
				},
				
	position:	function (oParam)
				{
					var sXHTMLElementID = '';
					var iLeftOffset = 0;
					var iTopOffset = 7;
					var bSetWidth = false;
					var sXHTMLElementContainerID = ns1blankspace.xhtml.container;
					
					if (oParam != undefined)
					{
						if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
						if (oParam.leftOffset != undefined) {iLeftOffset = oParam.leftOffset}
						if (oParam.topOffset != undefined) {iTopOffset = oParam.topOffset}
						if (oParam.offsetLeft != undefined) {iLeftOffset = oParam.offsetLeft}
						if (oParam.offsetTop != undefined) {iTopOffset = oParam.offsetTop}
						if (oParam.setWidth != undefined) {bSetWidth = oParam.setWidth}
						if (oParam.xhtmlElementContainerID != undefined) {sXHTMLElementContainerID = '#' + oParam.xhtmlElementContainerID}
					}
					
					var oElement = $('#' + sXHTMLElementID)
					
					if (oElement.length > 0)
					{	
						$(sXHTMLElementContainerID).html('')
							.show()
							.offset({ top: $(oElement).offset().top + $(oElement).height() + iTopOffset, left: $(oElement).offset().left + iLeftOffset})
							.attr('data-initiator', sXHTMLElementID);

						if (bSetWidth)
						{
							$(sXHTMLElementContainerID).css('width', oElement.width());
						}
						else
						{
							$(sXHTMLElementContainerID).css('width', '');
						}
					}	
				},

	confirm:	function (oParam)
				{
					var sHTML = ns1blankspace.util.getParam(oParam, 'html', {'default': ''}).value;
					var sTitle = ns1blankspace.util.getParam(oParam, 'title', {'default': ''}).value;
					var aButtons = ns1blankspace.util.getParam(oParam, 'buttons', 
											{'default': [{text: "OK", icons: {primary: 'ui-icon-check'}, click: function() {$(this).dialog('close')}}]}).value;
					

					$('#ns1blankspaceMultiUseDialog')
						.html(sHTML)
						.css('font-size', '0.75em')
						.css('position', 'static')
						.dialog(
						{
							resizable: false,
							modal: true,
							title: sTitle,
							open: function(event, ui) 
								  { 
									$('.ui-dialog-titlebar-close').hide();
									$('.ui-dialog-buttonset').children().css('font-size', '0.625em');
									$('.ui-dialog-buttonset').css('text-align', 'center')
									$('.ui-dialog-title').css('font-size', '0.75em');
								  },
							buttons: aButtons
						});
				}
}

ns1blankspace.search =
{
	data: 		{},

	cache: 		{
					exists: 	function (oParam)
								{
									var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;
									var sMethod = ns1blankspace.util.getParam(oParam, 'method').value;
									return ($.grep(ns1blankspace.data.search, function (a) {return a.method == sMethod && a.xhtmlElementID == sXHTMLElementID;}).length == 1);
								},

					search: 	function (oParam)
								{
									var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;
									var sMethod = ns1blankspace.util.getParam(oParam, 'method').value;
									var sSearchText = ns1blankspace.util.getParam(oParam, 'searchText').value;

									var aCache = $.grep(ns1blankspace.data.search, function (a) {return a.method == sMethod && a.xhtmlElementID == sXHTMLElementID;});

									if (aCache.length > 0)
									{	
										if (sSearchText == '')
										{
											var aCacheSearch = aCache[0].rows;
										}
										else
										{
											var aCacheSearch = $.grep(aCache[0].rows, function(a) {return ns1blankspace.search.cache.filter(a, oParam)});
										}

										return aCacheSearch;
									}	
								},

					filter:		function (a, oParam)
								{
									var sColumns = ns1blankspace.util.getParam(oParam, 'columns').value;
									var sFixedFilter = ns1blankspace.util.getParam(oParam, 'fixedFilter').value;
									var sSearchText = ns1blankspace.util.getParam(oParam, 'searchText').value;
									var sFilterFunction = ns1blankspace.util.getParam(oParam, 'filterFunction', {"default": ''}).value;

									var aFilter = [];

									if (sFixedFilter == '')
									{	
										var aColumns = sColumns.split('-');	

										$.each(aColumns, function(i) 
										{
											if (this != 'space' && this != 'comma' && this != 'pipe' && this != 'column' && this != 'hyphen')
											{	
												if (i != 0)
												{
													oFilter.push(' || ');
												}

												aFilter.push('(a["' + this + '"].toLowerCase().indexOf((sSearchText).toLowerCase()) !== -1)');
											}	
										});
									}
									else
									{
										var aFixedFilters = sFixedFilter.split('|');

										var aFilterSearch = $.grep(aFixedFilters, function (a) {return a.split('-').length == 2;});

										if (aFilterSearch.length > 0)
										{	
											aFilter.push('(');

											$.each(aFilterSearch, function(i) 
											{
												var aMethodFilter = this.split('-');
											
												if (i != 0)
												{
													oFilter.push(' || ');
												}
												
												aFilter.push('(a["' + aMethodFilter[0] + '"].toLowerCase().indexOf((sSearchText).toLowerCase()) !== -1)');
											});

											aFilter.push(')');
										}

										var aFilterFixed = $.grep(aFixedFilters, function (a) {return a.split('-').length == 3;});
				
										$.each(aFilterFixed, function(i) 
										{
											if (aFilter.length > 0) {aFilter.push(' && ')}
											
											var aFixedFilter = this.split('-');
										
											var sFilter = '== ' + aFixedFilter[2];

											if (aFixedFilter[1] == 'NOT_EQUAL_TO') {sFilter = ' != ' + aFixedFilter[2]}
											if (aFixedFilter[1] == 'GREATER_THAN') {sFilter = ' > ' + aFixedFilter[2]}
											if (aFixedFilter[1] == 'GREATER_THAN_OR_EQUAL_TO') {sFilter = ' >= ' + aFixedFilter[2]}
											if (aFixedFilter[1] == 'LESS_THAN') {sFilter = ' < ' + aFixedFilter[2];}
											if (aFixedFilter[1] == 'LESS_THAN_OR_EQUAL_TO') {sFilter = ' <= ' + aFixedFilter[2]}
											if (aFixedFilter[1] == 'TEXT_IS_LIKE') {sFilter = '.toLowerCase().indexOf((' + aFixedFilter[2] + ').toLowerCase()))'}
											
											aFilter.push('(a["' + aFixedFilter[0] + '"]' + sFilter + ')');
										});	
									}	

									aFilter.push(sFilterFunction);

									return eval(aFilter.join(''));	
								},

					add: 		function (oParam)
								{
									var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;
									var sMethod = ns1blankspace.util.getParam(oParam, 'method').value;
									var oRows = ns1blankspace.util.getParam(oParam, 'rows').value;

									ns1blankspace.data.search.push(
									{
										xhtmlElementID: sXHTMLElementID,
										method: sMethod,
										rows: oRows
									});
								}
				},

	show: 		function (oParam, oResponse)
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
					var fOnComplete = ns1blankspace.util.getParam(oParam, 'onComplete').value;
						
					if (oParam != undefined)
					{
						if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
						if (oParam.xhtmlInputElementID != undefined) {sXHTMLInputElementID = oParam.xhtmlInputElementID}
						if (oParam.xhtmlParentInputElementID != undefined) {sXHTMLParentInputElementID = oParam.xhtmlParentInputElementID}
						if (oParam.source != undefined) {iSource = oParam.source}
						if (oParam.minimumLength != undefined) {iMinimumLength = oParam.minimumLength}
						if (oParam.method != undefined) {sMethod = oParam.method}
						if (oParam.searchText != undefined) {sSearchText = oParam.searchText}
						if (oParam.columns != undefined) {sColumns = oParam.columns}
						if (oParam.methodFilter != undefined) {sMethodFilter = oParam.methodFilter}
						if (oParam.multiSelect != undefined) {bMultiSelect = oParam.multiSelect}
					}
					
					if (sXHTMLElementID != undefined)
					{
						var aXHTMLElementID = sXHTMLElementID.split('-');
						sXHTMLInputElementID = aXHTMLElementID[0];
						iXHTMLElementContextID = aXHTMLElementID[1];
					
						$.extend(true, oParam, {xhtmlInputElementID: sXHTMLInputElementID});
					
						var bCache = ($('#' + sXHTMLInputElementID).attr("data-cache") == "true")

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

						if (sMethodFilter === undefined) {sMethodFilter = ''}

						if (bMultiSelect === undefined)
						{
							bMultiSelect = ($('#' + sXHTMLInputElementID).attr("data-multiselect") === "true");
							$.extend(true, oParam, {multiselect: bMultiSelect});
						}

						if (fOnComplete === undefined)
						{
							fOnComplete = ns1blankspace.util.toFunction($('#' + sXHTMLInputElementID).attr("data-click"));
							$.extend(true, oParam, {onComplete: fOnComplete});
						}
					}	
					
					if (iXHTMLElementContextID != undefined)
					{
						$('#' + sXHTMLInputElementID).val(($('#' + sXHTMLElementID).html()).formatXHTML());
						$('#' + sXHTMLInputElementID).attr("data-id", iXHTMLElementContextID)
						$(ns1blankspace).hide();

						if (fOnComplete != undefined)
						{
							fOnComplete(oParam);
						}
					}
					else
					{
						if (sColumns === undefined) {sColumns = 'title'};

						if (sSearchText === '' && iSource === ns1blankspace.data.searchSource.text)
						{
							sSearchText = $('#' + sXHTMLInputElementID).val();
						}

						ns1blankspace.container.position({xhtmlElementID: sXHTMLInputElementID, topOffset: 10, setWidth: true});

						if (bCache && oResponse === undefined)
						{
							oResponse = ns1blankspace.search.cache.search({method: sMethod, searchText: sSearchText, columns: sColumns, fixedFilter: sMethodFilter});

							if (oResponse !== undefined)
							{
								oResponse = {data: {rows: oResponse}}
							}	
						}

						if (oResponse === undefined)
						{							
							if (sSearchText === '' && iSource === ns1blankspace.data.searchSource.text)
							{
								sSearchText = $('#' + sXHTMLInputElementID).val();
							}	
						
							if (sSearchText.length >= iMinimumLength || iSource === ns1blankspace.data.searchSource.all || bCache)
							{
								ns1blankspace.status.working();

								var aColumns = sColumns.split('-');	

								if (ns1blankspace.util.isMethodAdvancedSearch(sMethod))
								{
									var oSearch = new AdvancedSearch();
									oSearch.method = sMethod;

									$.each(aColumns, function() 
									{
										if (this != 'space' && this != 'comma' && this != 'pipe' && this != 'column' && this != 'hyphen')
										{	
											oSearch.addField(this);
										}	
									});	

									if (!bCache && iSource === ns1blankspace.data.searchSource.text && sMethodFilter == '')
									{	
										oSearch.addBracket("(");

										$.each(aColumns, function(i) 
										{
											if (this != 'space' && this != 'comma' && this != 'pipe' && this != 'column' && this != 'hyphen')
											{	
												if (i != 0)
												{
													oSearch.addOperator('or');
												}

												oSearch.addFilter(this, 'TEXT_IS_LIKE', sSearchText);
											}	
										});

										oSearch.addBracket(")"); 
									}
									
									if (sMethodFilter != '')
									{
										var aMethodFilters = sMethodFilter.split('|');

										var aFilterSearch = $.grep(aMethodFilters, function (a) {return a.split('-').length == 2;});

										if (!bCache && aFilterSearch.length > 0)
										{	
											oSearch.addBracket('(');

											$.each(aFilterSearch, function(i) 
											{
												var aMethodFilter = this.split('-');
											
												if (i != 0)
												{
													oSearch.addOperator('or');
												}
												
												oSearch.addFilter(aMethodFilter[0], aMethodFilter[1], sSearchText);
											});

											oSearch.addBracket(')');
										}

										var aFilterFixed = $.grep(aMethodFilters, function (a) {return a.split('-').length == 3;});
				
										$.each(aFilterFixed, function(i) 
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

									var sCustomOption = $('#' + sXHTMLInputElementID).attr("data-customoption");

									if (sCustomOption != undefined)
									{
										var aCustomOption = sCustomOption.split('-');
										oSearch.addCustomOption(aCustomOption[0], aCustomOption[1]);
									}

									var iRows = $('#' + sXHTMLInputElementID).attr("data-rows");
									if (iRows == undefined) {iRows = 100}

									oSearch.rows = iRows;

									var sSortColumn = $('#' + sXHTMLInputElementID).attr("data-methodsortcolumn");
									if (sSortColumn == undefined) {sSortColumn = aColumns[0]}

									var sSortDirection = $('#' + sXHTMLInputElementID).attr("data-methodsortdirection");
									if (sSortDirection == undefined) {sSortDirection = 'asc'}

									oSearch.sort(sSortColumn, sSortDirection);

									oSearch.getResults(function(data){ns1blankspace.search.show(oParam, data)});
								}
								else
								{
									var oData = {"rows": "100"};
									var sSearch = $('#' + sXHTMLInputElementID).attr("data-search");
						
									if (sXHTMLParentInputElementID != undefined)
									{
										var sParentColumnID = $('#' + sXHTMLInputElementID).attr("data-parent-search-id");
										var sParentColumnText = $('#' + sXHTMLInputElementID).attr("data-parent-search-text");
										var sParentContextID = $('#' + sXHTMLParentInputElementID).attr("data-id");
										var sParentContextText = $('#' + sXHTMLParentInputElementID).val();

										if (sParentColumnID != undefined && (sParentContextID != undefined && sParentContextID != ''))
										{
											oData[sParentColumnID] = sParentContextID;
										}
									}

									if (iSource === ns1blankspace.data.searchSource.text)
									{
										if (sSearch != undefined)
										{
											oData[sSearch] = sSearchText;
										}
										else
										{	
											oData[aColumns[0]] = sSearchText;
										}
									}	

									$.ajax(
									{
										type: 'GET',
										url: ns1blankspace.util.endpointURI(sMethod),
										data: oData,
										dataType: 'json',
										success: function(data){ns1blankspace.search.show(oParam, data)}
									});
								}	
							}
							else
							{
								ns1blankspace.status.message('At least ' + iMinimumLength + ' letters')
							}
						}	
						else
						{
							ns1blankspace.status.message('');

							if (sColumns == undefined) {sColumns = 'title'}
							var aColumns = sColumns.split('-');
							var aHTML = [];

							if (bCache && !ns1blankspace.search.cache.exists({method: sMethod}))
							{
								ns1blankspace.search.cache.add({method: sMethod, rows: oResponse.data.rows});
								oResponse.data = {rows: ns1blankspace.search.cache.search({method: sMethod, searchText: sSearchText, columns: sColumns, fixedFilter: sMethodFilter})}
							}
							
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
													
												case 'hyphen':
													aHTML.push('-');
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
									if (bMultiSelect)
									{
										ns1blankspace.search.multiSelect.add(oParam);
									}
									else
									{
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
				},

	stop:		function ()
				{
					var sElementID = 'ns1blankspaceViewControlSearchStatus';
					$('#' + sElementID).hide();
					$('#' + sElementID).html('');
				},

	advanced: 	{
					show:		function ()
								{
									$('#ns1blankspaceMultiUseDialog').show();
										
									if ($('#ns1blankspaceViewControlSearchHeaderContainer').length == 0)
									{		
										var sElementID = 'ns1blankspaceViewControlSearch';
										ns1blankspace.container.position({xhtmlElementID: sElementID, topOffset: 10, xhtmlElementContainerID: 'ns1blankspaceMultiUseDialog'});

										$('#ns1blankspaceMultiUseDialog').html(
											'<div id="ns1blankspaceViewControlSearchHeaderContainer"></div>' +
											'<div id="ns1blankspaceViewControlSearchFilterContainer" style="display:none; width:250px;"></div>' +
											'<div id="ns1blankspaceViewControlSearchResultsContainer" style="margin-top:4px;"></div>');

										var oView = $.grep(ns1blankspace.views, function (a) {return a.title == ns1blankspace.viewName;})[0];

										var sCaption;
										var aHTMLHeader = [];

										aHTMLHeader.push('<table style="width:138px; background-color: #F3F3F3; opacity:0.80;">');
										aHTMLHeader.push('<tr><td style="padding-left:1px;padding-right:3px;padding-top:0px; vertical-align:middle;">');
										aHTMLHeader.push('<span id="ns1blankspaceViewControlSearchHeaderClose"></span>');

										if (oView !== undefined)
										{	
											if (oView.search !== undefined)
											{	
												ns1blankspace.search.data.viewControl = oView.search;

												if (oView.search.filters === undefined) {oView.search.filters = []}
												if (oView.search.filters.length != 0)
												{	
													aHTMLHeader.push('<span id="ns1blankspaceViewControlSearchHeaderFilters"></span>');
													aHTMLHeader.push('<span id="ns1blankspaceViewControlSearchHeaderSearch"></span>');
												}
													
												if (oView.search.advanced)
												{	
													aHTMLHeader.push('<span id="ns1blankspaceViewControlSearchHeaderAdvanced"></span>');
												}

												if (oView.search.caption)
												{	
													sCaption = oView.search.caption;
												}

												var aHTMLFilter = [];

												aHTMLFilter.push('<table class="ns1blankspaceViewControlSearchFilterContainer" style="width:250px;">');

												$.each(oView.search.filters, function (i, v)
												{
													aHTMLFilter.push(ns1blankspace.search.advanced.showFields(i, v) );
												});

												aHTMLFilter.push('</table>');

												$('#ns1blankspaceViewControlSearchFilterContainer')
													.html(aHTMLFilter.join(''));

												$('input.ns1blankspaceDate').datepicker({dateFormat: 'dd M yy'});
											}		
										}

										if (sCaption !== undefined)
										{
											aHTMLHeader.push('<span style="padding-left:3px; padding-top:3px;" class="ns1blankspaceSubNote">' + sCaption + '<span>');
										}	

										aHTMLHeader.push('</td></tr></table>');

										$('#ns1blankspaceViewControlSearchHeaderContainer')
											.html(aHTMLHeader.join(''));	

										$('#ns1blankspaceViewControlSearchHeaderClose').button(
										{
											text: false,
											icons:
											{
												primary: "ui-icon-close"
											}
										})
										.click(function()
										{
											$('#ns1blankspaceMultiUseDialog').hide();
										})
										.css('width', '18px')
										.css('height', '20px');

										$('#ns1blankspaceViewControlSearchHeaderAdvanced').button(
										{
											text: false,
											icons:
											{
												primary: "ui-icon-extlink"
											}
										})
										.click(function()
										{
											ns1blankspace.report.init({all: false});
										})
										.css('width', '18px')
										.css('height', '20px')
										.css('margin-left', '1px')

										$('#ns1blankspaceViewControlSearchHeaderFilters').button(
										{
											text: false,
											icons:
											{
												primary: "ui-icon-arrowthickstop-1-s"
											}
										})
										.click(function()
										{
											$('#ns1blankspaceViewControlSearchFilterContainer').show();
										})
										.css('width', '18px')
										.css('height', '20px')
										.css('margin-left', '1px');

										$('#ns1blankspaceViewControlSearchHeaderSearch').button(
										{
											text: false,
											icons:
											{
												primary: "ui-icon-search"
											}
										})
										.click(function()
										{
											$('#ns1blankspaceViewControlSearch').keyup();
										})
										.css('width', '18px')
										.css('height', '20px')
										.css('margin-left', '1px');
									}
								},

					showFields: function(i, v)
								{
										var sName = v.name;
										sName = sName.replace(/\./g, "_");
										var aHTMLFilter = [];

										if (!v.fixed)
										{
											aHTMLFilter.push('<tr><td class="ns1blankspaceCaption" style="font-weight:400;">' + 
																v.caption + ((v.comparison === "BETWEEN") ? " From": "") + '</td>');
											
											if (v.type === "Check") {
												
												aHTMLFilter.push('<td style="padding-right:7px;vertical-align:middle;">' + 
																 '<input type="checkbox" style="margin:0px;"' + 
																 ' nohide="true"' + 
																 ' id="ns1blankspaceViewControlSearchFilter_' + sName + '"' +
															' class="ns1blankspace' + v.type + ' ns1blankspaceViewControlSearchFilter"' +
															' data-comparison="' + v.comparison + '"' +
															' data-name="'+ v.name + '"></td></tr>');

											}
											else {
												
												aHTMLFilter.push('<td style="padding-right:7px;">' + 
																 '<input style="margin:0px;"' + 
																 ' nohide="true"' + 
																 ' id="ns1blankspaceViewControlSearchFilter_' + sName + '"' +
															' class="ns1blankspace' + v.type + ' ns1blankspaceViewControlSearchFilter"' +
															' data-comparison="' + v.comparison + '"' +
															(v.type == 'Select'?' data-method="' + v.method + '"':'') +
															((v.type == 'Select' && v.methodColumns) ? ' data-columns="' + v.methodColumns + '"': '') +
															((v.type == 'Select' && v.methodFilter) ? ' data-methodFilter="' + v.methodFilter + '"': '') +
															' data-name="'+ v.name + '"></td></tr>');
											}

											if (v.comparison == "BETWEEN" && v.type === 'Date') {

												aHTMLFilter.push('<tr><td class="ns1blankspaceCaption" style="font-weight:400;">' + 
																	v.caption + ((v.comparison === "BETWEEN") ? " To": "") + '</td>');
												aHTMLFilter.push('<td style="padding-right:7px;">' + 
																 '<input style="margin:0px;"' + 
																 ' nohide="true"' + 
																 ' id="ns1blankspaceViewControlSearchFilter_' + sName + '_value2"' +
															' class="ns1blankspace' + v.type + ' ns1blankspaceViewControlSearchFilter">' +
															'</td></tr>');

											}
										}	

										return aHTMLFilter.join('');
								},

					setFilters:	function ()
								{
									var dToday = new Date();

									$.each(ns1blankspace.search.data.viewControl.filters, function ()
									{
										var sXHTMLElementID = 'ns1blankspaceViewControlSearchFilter_' + this.name.replace(/\./g, '_');

										if (this.type == 'Select')
										{	
											this.value = $('#' + sXHTMLElementID).attr('data-id');
										}
										else if (this.type === 'Text' || (this.type === 'Date' && this.comparison != 'BETWEEN'))
										{	
											this.value = $('#' + sXHTMLElementID).val();
										}	
										else if (this.type === 'Date' && this.comparison === 'BETWEEN')
										{
											this.value = $('#' + sXHTMLElementID).val();
											this.value2 = $('#' + sXHTMLElementID + '_value2').val();
											if (this.value2 === '') {
												this.value2 = dToday.toString('dd MMM yyyy');
											}
										}
									});
								},

					addFilters: function (oSearch)
								{
									if (ns1blankspace.search.data.viewControl !== undefined)
									{
										ns1blankspace.search.advanced.setFilters();

										$.each(ns1blankspace.search.data.viewControl.filters, function()
										{
											var sXHTMLElementID = 'ns1blankspaceViewControlSearchFilter_' + this.name.replace(/\./g, '_');
	
											if (this.value != undefined && this.value != '')
											{	
												if (this.value2 && this.value2 != '') {
													oSearch.addFilter(this.name, this.comparison, this.value, this.value2);
												}
												else {
													// If a checkbox, only filter if checked
													if (this.type != 'Check' || (this.type === 'Check' && $('#' + sXHTMLElementID).attr('checked') === 'checked'))
													 {
															oSearch.addFilter(this.name, this.comparison, this.value);
													 }	
												}
											}	
										});
									}
								}									
				},		

	multiSelect: 
	{
		add: 	function(oParam) 
				{

					var sXHTMLElementID = '';
					var sInputElementId;
					var sCellElementId;
					var sTableElementId;
					var aHTML = [];

					// User has selected a value from the combo (sXHTMLElementID)
					// We need to create a table to hold the list of selected items - place it below the input element if not already existing
					// We're assuming that the input element is within a table cell
					if (oParam) 
					{
						if (oParam.xhtmlElementID) {sXHTMLElementID = oParam.xhtmlElementID;}
					}

					sInputElementId = sXHTMLElementID.split('-').shift();

					sTableElementId = sInputElementId + '_SelectRows';

					if (!$('#' + sTableElementId).is('*')) 
					{
						aHTML.push('<table id="' + sTableElementId + '" style="width:100%;">');

					}

					if ($('#' + sTableElementId + '-' + sXHTMLElementID.split('-').pop()).is('*')) 
					{
						ns1blankspace.status.message("Value has already been selected.");
						return;
					}
					else 
					{ 
						aHTML.push('<tr>' +
									'<td id="' + sTableElementId + '-' + sXHTMLElementID.split('-').pop() + '"' +
									   ' class="ns1blankspaceMultiSelect">' +
									$('#' + sXHTMLElementID).html() + 
									'</td>' +
									'<td width="20px" class="ns1blankspaceMultiRemove">Delete</td>' +
									'</tr>');
					}
					

					if (!$('#' + sTableElementId).is('*')) 
					{
						aHTML.push('</table>');

						$('#' + sInputElementId).parent().html($('#' + sInputElementId).parent().html() + aHTML.join(''));
					}
					else 
					{
						$('#' + sTableElementId).append(aHTML.join(''));
					}

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

					if ($('#' + sInputElementId).attr('data-click'))
					{
						// We have a post-click function to call
						var fFunctionToCall = ns1blankspace.util.toFunction($('#' + sInputElementId).attr('data-click'));
						fFunctionToCall();
					}
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
					var bRemove = ns1blankspace.util.param(oOption, 'remove').value;
					var bSet = ns1blankspace.util.param(oOption, 'set').value;

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
								if (oParam[sParam] !== undefined)
								{	
									oReturn.values = oParam[sParam].split(sSplit);

									if (iIndex !== undefined)
									{
										if (iIndex < oReturn.values.length)
										{
											oReturn.value = oReturn.values[iIndex];
										}
										else
										{
											oReturn.value = undefined;
										}
									}
								}	
							}

							if (bRemove) {delete oParam[sParam]};
							if (bSet) {oParam[sParam] = oReturn.value}
						}
					}	

					return oReturn;
				},

	getData: function(oParam, sDataKey, oOption)
				{
					var sParam;
				
					var oReturn = {exists: false};

					if (ns1blankspace.util.param(oOption, 'param').exists)
					{
						sParam = ns1blankspace.util.param(oOption, 'param').value;
					}
					else
					{
						sParam = 'xhtmlElementID';
					}

					if (ns1blankspace.util.param(oParam, sParam).exists)
					{
						var sXHTMLElementID = ns1blankspace.util.param(oParam, sParam).value;
						oReturn.value = $('#' + sXHTMLElementID).attr(sDataKey);
						oReturn.exists = (oReturn.value !== undefined);
					}

					if (!oReturn.exists && ns1blankspace.util.param(oOption, 'default').exists)
					{
						oReturn.value = ns1blankspace.util.param(oOption, 'default').value
					}
					
					return oReturn;
				},

	getRow: 	function(oResponse, sDataKey, oOption)
				{
					var oReturn;

					if (oResponse.status == 'OK')
					{
						if (oResponse.data.rows !== undefined)
						{	
							iRow = ns1blankspace.util.getParam(oOption, 'row', {"default": 0}).value;

							if (iRow < oResponse.data.rows.length)
							{
								var oReturn = oResponse.data.rows[iRow];

								if (ns1blankspace.util.param(oOption, 'attr').exists)
								{
									oReturn = oReturn[ns1blankspace.util.param(oOption, 'property').value]
								}	
							}	
						}	
					}

					return oReturn;
				},								

	param: 	function(oParam, sParam, sSplit)
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

	formatDate:	function (sDate, oOption)
				{
					var sFormat = ns1blankspace.util.getParam(oOption, 'format', {"default": "D MMM YYYY"}).value;
					var bFromNow = ns1blankspace.util.getParam(oOption, 'fromNow', {"default": false}).value;
					var sReturn = sDate;

					if (sReturn != '')
					{
						var oDate = moment(sDate, 'DD MMM YYYY HH:mm:ss')
						if (oDate.isValid())
						{
							if (bFromNow)
							{
								sReturn = oDate.fromNow()
							}
							else
							{
								sReturn = oDate.format(sFormat);
							}	
						}
					}
					
					return sReturn
				},

	fd:		function (sValue, oOption) {return this.formatDate(sValue, oOption)},

	formatSave:	function (sValue)
				{
					if (sValue === undefined || sValue === 'undefined') { sValue = ''; }
					
					return encodeURIComponent(sValue)

				},

	fs:		function (sValue) {return this.formatSave(sValue)},

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
					if (ns1blankspace.ondemand === undefined)
					{
						$.ajax(
						{
							type: 'GET',
							url: '/jscripts/1blankspace.mydigitalstructure-2.0.2.json',
							dataType: 'json',
							async: false,
							success: function(data) {ns1blankspace.ondemand = data.ondemand}
						});
					}
				},

	endpointURI:
				function (sMethod)
				{
					ns1blankspace.util.getMethods();

					var sBaseEndpoint = '/rpc/';

					var oMethod = $.grep(ns1blankspace.ondemand, function (a) {return a.title == sMethod;})	

					if (oMethod.length != 0) 
					{
						sBaseEndpoint = '/ondemand/';
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

					var oMethod = $.grep(ns1blankspace.ondemand, function (a) {return a.title == sMethod;})	

					if (oMethod.length == 0) 
					{
						return true;
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
					var sTemplate = ns1blankspace.util.getParam(oParam, 'template', {"default": 'invoice'}).value;
					var iObject = ns1blankspace.util.getParam(oParam, 'object').value;
					var bRefresh = ns1blankspace.util.getParam(oParam, 'refresh', {"default": false}).value;
					var bCheckForSchedule = ns1blankspace.util.getParam(oParam, 'checkForSchedule', {"default": false}).value;

					if (bCheckForSchedule)
					{
						oParam = ns1blankspace.util.setParam(oParam, 'onCompleteWhenCan', oParam.onComplete);
						oParam = ns1blankspace.util.setParam(oParam, 'onComplete', ns1blankspace.util.initTemplate);
						delete oParam.checkForSchedule;
						oParam.object = oParam.checkForScheduleObject;
						oParam.template = sTemplate + 'schedule';
					}

					if (ns1blankspace.xhtml.templates[sTemplate] == undefined || bRefresh)
					{
						var oSearch = new AdvancedSearch();
						oSearch.method = 'DOCUMENT_SEARCH';
						oSearch.addField('title,content');
						oSearch.addFilter('type', 'EQUAL_TO', 10);

						if (iObject != undefined && sTemplate == undefined)
						{
							oSearch.addFilter('object', 'EQUAL_TO', iObject);
						}	
						else
						{	
							oSearch.addFilter('title', 'TEXT_IS_LIKE', (sTemplate).toUpperCase() + ' TEMPLATE');
						}	

						oSearch.getResults(function(oResponse)
						{
							if (oResponse.data.rows.length == 0) 
							{
								if (ns1blankspace.xhtml.templates.source[sTemplate] !== undefined)
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
								var oTemplate = $.grep(oResponse.data.rows, function(row) {return (row.title).toUpperCase()==(sTemplate).toUpperCase() + ' TEMPLATE'})[0];

								if (oTemplate != undefined)
								{	
									ns1blankspace.xhtml.templates[sTemplate] = (oResponse.data.rows[0].content).formatXHTML();
									ns1blankspace.xhtml.templates.document[sTemplate] = oResponse.data.rows[0].id;
									if (ns1blankspace.xhtml.templates.all==undefined) {ns1blankspace.xhtml.templates.all=={}}
									ns1blankspace.xhtml.templates.all[sTemplate] = oResponse.data.rows;
								}
								
								oParam = ns1blankspace.util.setParam(oParam, 'count', oResponse.data.rows.length)

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

	whenCan: 	{
					queue: 		[],

					completed: 	[],

					exists: 	function(oParam)
								{
									if (oParam && oParam.uuid)
									{
										return ($.grep(ns1blankspace.util.whenCan.queue, function (a) {a.uuid == oParam.uuid}).length > 0)
									}	
									else
									{	
										return (ns1blankspace.util.whenCan.queue.length != 0);
									}	
								},

					then: 	function(oParam)
								{
									if (oParam && oParam.uuid)
									{
										return ($.grep(ns1blankspace.util.whenCan.queue, function (a) {a.uuid == oParam.uuid})[0])
									}	
								},			

					clear: 		function(oParam)
								{
									ns1blankspace.util.whenCan.queue.length = 0;
								},

					execute: 	function(oParam)
								{
									var sUUID = ns1blankspace.util.uuid();

									oParam.then.uuid = sUUID;
									ns1blankspace.util.whenCan.queue.unshift(oParam.then);

									ns1blankspace.debug.message(oParam.then, true);

									if (oParam.now)
									{
										var oNowParam = $.extend(true, {}, oParam.now.param);
										oNowParam.uuid = sUUID;
										oParam.now.method(oNowParam)
									}	
								},
								
					complete: 	function(sReturn, oParam)
								{
									if (ns1blankspace.util.whenCan.queue.length > 0)
									{	
										var oThen;

										if (oParam.uuid)
										{
											$.each(ns1blankspace.util.whenCan.queue, function (i, v)
											{
												if (v)
												{	
													if (v.uuid == oParam.uuid)
													{
														oThen = v;
														ns1blankspace.util.whenCan.queue.splice(i, 1);
													}
												}	
											});
										}	
										else
										{	
											oThen = ns1blankspace.util.whenCan.queue.shift();
										}

										if (oThen)
										{	
											ns1blankspace.util.whenCan.completed.unshift(oThen);

											if (!oParam) {oParam = {}}
											oParam = $.extend(true, oParam, oThen.param)
											if (oThen.set) {oParam[oThen.set] = sReturn};

											sReturn = undefined;
											
											var fMethod = oThen.method;
											if (fMethod)
											{
												if (typeof fMethod === 'string')
												{
													ns1blankspace.util.execute(fMethod, oParam)
												}
												else
												{
													fMethod(oParam)
												}	
											}
										}	
									}
									
									return sReturn;
								}			
				},			

	isEmpty: 	function (oObject)
				{
			  		for (var key in oObject)
			  		{
			     		if (oObject.hasOwnProperty(key)) {return false;}
			     	}
			  		
			   		return true;
				},

	isDate: 	function(sValue)
				{
					var toClass = {}.toString;
					return (toClass.call(sValue) == '[object Date]')
				},		

	sortBy: 	function (prop, direction)
				{
					//yourArray.sort(ns1blankspace.util.sortBy('firstname'))

					if (direction==undefined) {direction = 'asc'}

					return function(a,b)
					{
						if (a[prop] > b[prop])
						{
							return (direction.toLowerCase()=='desc'?-1:1);
						}
						else if(a[prop] < b[prop])
						{
							return (direction.toLowerCase()=='desc'?1:-1);
						}
						return 0;
					}
				},

	sortByNumber: 
				function (prop, direction)
				{
					//yourArray.sort(ns1blankspace.util.sortByNumber('count'))

					if (direction==undefined) {direction = 'asc'}

					return function(a,b)
					{
						if (parseFloat(a[prop]) > parseFloat(b[prop]))
						{
							return (direction.toLowerCase()=='desc'?-1:1);
						}
						else if(parseFloat(a[prop]) < parseFloat(b[prop]))
						{
							return (direction.toLowerCase()=='desc'?1:-1);
						}
						return 0;
					}
				},			

	sortByDate: function (prop)
				{
					//yourArray.sort(ns1blankspace.util.sortByDate('date'))

					return function(a,b) { return new Date(a[prop]) - new Date(b[prop]) }
				},			

	remove:		function (array, property, value)
				{
					return $.grep(array, function (a)
					{ 
						return (a[property] != value)
					});
				},

	trimLast:	function (sValue, sChar)
				{
					if (sChar == undefined) {sChar = '/'}
					if (sValue.charAt(sValue.length-1) == sChar)
					{
  						return sValue.slice(0, -1);
  					}
  					else
  					{
  						return sValue;
  					}	
  				},

  	toFunction:
  				function (sFunction, oNS)
  				{
  					if (sFunction === undefined || sFunction == '')
  					{
  						oNS = undefined;
  					}
  					else
  					{
	  					if (oNS === undefined) {oNS = window}

	  					sFunction = sFunction.split('(')[0];	

	  					var aF = (sFunction).split(".");

	  					$.each(aF, function(i,v)
	  					{
	  						if(oNS !== undefined) {oNS = oNS[this]};	
	  					});
		  					
	  				}	

  					return oNS;
  				},

  	execute:
  				function (sFunction, oParam, oNS)
  				{
  					var fFunction = ns1blankspace.util.toFunction(sFunction, oNS);

  					if (fFunction !== undefined) {fFunction(oParam);}
  					
  				},

  	toObject:
  				function (sObject)
  				{
  					var oObject;

  					if (sObject !== undefined && sObject != '')
  					{
  						oObject = {};

  						sObject = sObject.replace('{', '');
  						sObject = sObject.replace('}', '');

	  					var aObject = sObject.split(',');	
	  					var aValue;
	  					var sValue;

	  					$.each(aObject, function(i,v)
	  					{
	  						aValue = v.split(':');
	  						var sProperty = (aValue[0]).trim();
	  						aValue.splice(0, 1);
	  						sValue = aValue.join(':');
	  						sValue = (sValue).replace(/"/g, '');
	  						sValue = (sValue).replace(/'/g, '');
							sValue = (sValue).trim();
	  						oObject[sProperty] = sValue;	
	  					});
	  				}	

  					return oObject;
  				},

  	toBR: 		function (sValue)
  				{
					sValue = (sValue).replace(/\r\n/g, '<br />');

  					return sValue;
  				},

  	toFixed: 	function (sValue)
				{
					if (sValue == '' || sValue === undefined)
					{	
						sValue = 0;
					}
					
					return parseFloat(sValue).toFixed(2);	
				},

	format: 	function(oParam)
				{
					var sValue = ns1blankspace.util.getParam(oParam, 'text').value;
					var iLength = ns1blankspace.util.getParam(oParam, 'length').value;
					var sFill = ns1blankspace.util.getParam(oParam, 'fill').value;
					var sFillLeft = ns1blankspace.util.getParam(oParam, 'fillLeft').value;
					var sDefault = ns1blankspace.util.getParam(oParam, 'default').value;
					var sDateFormat = ns1blankspace.util.getParam(oParam, 'dateFormat').value;
					var iAmountDecimalPlaces = ns1blankspace.util.getParam(oParam, 'amountDecimalPlaces').value;
					var bUpper = ns1blankspace.util.getParam(oParam, 'upper', {"default": false}).value;
	
					if (sValue === undefined) {sValue = sDefault}

					if (sValue !== undefined && sValue !== null)
					{
						if (!_.isString(sValue)) {sValue = sValue.toString()}

						if (sDateFormat !== undefined)
						{
							if (!ns1blankspace.util.isDate(sValue)) {sValue = Date.parse(sValue)}

							if (sValue !== null)
							{	
								sValue = sValue.toString(sDateFormat);
							}
							else
							{
								sValue = '';
							}
						}

						if (iAmountDecimalPlaces !== undefined)
						{
							sValue = (sValue).parseCurrency().toFixed(iAmountDecimalPlaces)
						}

						if (iLength !== undefined)
						{	
							if (sValue.length > iLength)
							{
								sValue = sValue.substr(0, iLength);
							}
							else if (sValue.length < iLength)
							{
								if (sFill !== undefined)
								{	
									sValue += sFill.repeat(iLength - sValue.length)
								}	

								if (sFillLeft !== undefined)
								{	
									sValue = sFillLeft.repeat(iLength - sValue.length) + sValue
								}
							}	
						}
					}
					else if (sFill !== undefined && iLength !== undefined)
					{
						sValue = sFill.repeat(iLength)
					}

					if (bUpper) {sValue = sValue.toUpperCase()}

					if (sValue) {sValue = sValue.formatXHTML()}
						
					return sValue;
				},								

  	getMethod: 
  				function getM ()
  				{
  					var methods = [];
					for (var m in ns1blankspace) {
					    if (typeof ns1blankspace[m] == "function") {
					        methods.push(m);
					    }
					}
					console.log(methods.join(","));
  				},

  	hash: 		function(oParam)
  				{
  					//requires /jscripts/md5-min.js
  					
  					var iType = ns1blankspace.util.getParam(oParam, 'type', {"default": 1}).value;
  					var sValue = ns1blankspace.util.getParam(oParam, 'value').value;

  					if (sValue !== undefined)
  					{	
	  					if (iType == 1)
	  					{
	  						return hex_md5(sValue);
	  					}
	  				}	
  				},

  	app:		{
  					option: 	function (oParam)
  								{
  									if (ns1blankspace.option.appTitle == undefined)
  									{
  										ns1blankspace.option.appTitle = document.title;
  									}

  									var sTitleSuffix = ns1blankspace.util.getParam(oParam, 'titleSuffix', {"default": ''}).value;
  									var sTitlePrefix = ns1blankspace.util.getParam(oParam, 'titlePrefix', {"default": ''}).value;
  									var sTitle = sTitlePrefix + ns1blankspace.util.getParam(oParam, 'title', {"default": ns1blankspace.option.appTitle}).value +
  													sTitleSuffix

  									document.title = sTitle;
  								}
  				},						

  	about: 		{
  					data: 		[],

  					init: 		function ()
  								{
  									ns1blankspace.util.about.initPush();
  									ns1blankspace.util.about.data.sort(ns1blankspace.util.sortBy('namePath'));
  								},

				  	initPush:
				  				function (sNamespace, sType, sProperty)
				  				{
				  					if (sNamespace === undefined) {sNamespace = 'ns1blankspace'}
				  					if (sType === undefined) {sType = 'object'}
				  					if (sProperty === undefined) {sProperty = 'namespaces'}

				  					if (sNamespace.indexOf('.data') == -1)
				  					{	
					  					var oNamespace = ns1blankspace.util.toFunction(sNamespace)

					  					var aNamespaces = [];

										for (var m in oNamespace)
										{
											var iLevel = sNamespace.split('.').length;

										    if (typeof oNamespace[m] == 'object')
										    {
										    	if (m != 'data' && m != 'views' && m != 'methods' && m != 'scripts' && m != 'tags' && m != 'reportSummary' && m != 'xhtml' && m != 'themes')
										    	{	
										        	ns1blankspace.util.about.data.push({name: m, namePath: sNamespace + '.' + m, type: 'namespace', level: iLevel});
										        	aNamespaces.push({name: m, namePath: sNamespace + '.' + m});
										        }	
										    }

										    if (typeof oNamespace[m] == 'function')
										    {
										        ns1blankspace.util.about.data.push({name: m, namePath: sNamespace + '.' + m, type: 'method', level: iLevel});
										    }
										}

										$.each(aNamespaces, function(i,v)
										{	
											ns1blankspace.util.about.initPush(v.namePath, sType, sProperty)
										});
									}	
				  				},

				  	toConsole: 	function (oParam) {ns1blankspace.util.about.show(oParam)},		

				  	show: 		function (oParam)
  								{
  									var sNamespace = ns1blankspace.util.getParam(oParam, 'namespace').value;
  									var iLevel = ns1blankspace.util.getParam(oParam, 'level').value;
  									var sType = ns1blankspace.util.getParam(oParam, 'type').value;
  									var bShowCode = ns1blankspace.util.getParam(oParam, 'showCode', {"default": false}).value;

  									if (ns1blankspace.util.about.data.length == 0)
  									{
  										ns1blankspace.util.about.init();
  									}

  									var aData = ns1blankspace.util.about.data;

  									if (sNamespace !== undefined)
  									{
  										aData = $.grep(aData, function (a) {return (a.namePath.indexOf(sNamespace) != -1)})
  									}

  									if (iLevel !== undefined)
  									{
  										aData = $.grep(aData, function (a) {return (a.level <= iLevel)})
  									}

  									if (sType !== undefined)
  									{
  										aData = $.grep(aData, function (a) {return (a.type == sType)})
  									}

									var aTmp = ['1BLANKSPACE NAMESPACE'];

  									aTmp.push($.grep(aData, function(a) {return a.type == 'namespace'}).length + ' namespaces')
  									aTmp.push($.grep(aData, function(a) {return a.type == 'method'}).length + ' methods')

  									$.each(aData, function (i,v)
  									{
  										aTmp.push(v.namePath + (v.type=='namespace'?'/':''))

  										if (v.type == 'method' && bShowCode)
  										{
  											aTmp.push(ns1blankspace.util.toFunction(v.namePath).valueOf())
  										}	
  									});

  									console.log(aTmp.join('\r\n'));
  								}
				},

	cleanURL: 	function (oParam)
				{
					var sText = ns1blankspace.util.getParam(oParam, 'text').value;
					var oSearchHost = ns1blankspace.util.getParam(oParam, 'searchHost', {"default": [{value: 'secure.mydigitalspacelive.com'}, {value: 'beta.mydigitalspacelive.com'}]}).value;
					var sNewHost = ns1blankspace.util.getParam(oParam, 'newHost', {"default": window.location.host}).value;
					var sProtocol = ns1blankspace.util.getParam(oParam, 'protocol').value;

					if (sText !== undefined)
					{
						$.each(oSearchHost, function()
						{
							sText = sText.replace(RegExp(this.value, "gi"), sNewHost);
						});
					}

					if (sProtocol !== undefined)
					{
						sText = sText.replace(RegExp('http', "gi"), sProtocol);
						sText = sText.replace(RegExp('https', "gi"), sProtocol);
					}

					return sText;
				},

	ifExists: 	function (oParam)
				{
					var sVariable = ns1blankspace.util.getParam(oParam, 'variable').value;

					if (sVariable in window)
					{
   						return window[sVariable];
					}
				},

	toWords: 	function (oParam)
				{
					var sNumber = ns1blankspace.util.getParam(oParam, 'number').value;
					var bUpper = ns1blankspace.util.getParam(oParam, 'upper', {"default": false}).value;

					var sWords = toWords(String(sNumber));
					if (bUpper) {sWords = (sWords).toUpperCase()}

					return sWords;
				},

	uuid: 		function (oParam)
				{
					var sPattern = ns1blankspace.util.getParam(oParam, 'pattern', {"default": 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'}).value;
				    var d = new Date().getTime();
				    var sUUID = sPattern.replace(/[xy]/g, function(c)
				    {
				        var r = (d + Math.random()*16)%16 | 0;
				        d = Math.floor(d/16);
				        return (c=='x' ? r : (r&0x7|0x8)).toString(16);
				    });

				    return sUUID;
				},

	compress: 	{
					exists: 	function () {return (LZString !== undefined)},

					formats: 	[
									{
										name: 'UTF16',
										value: ''
									},
									{
										name: 'UTF16 Save',
										value: 'UTF16'
									},
									{
										name: 'Base 64',
										value: 'Base64'
									}
								],	

					"in": 		function (oParam)
								{
									var sData = ns1blankspace.util.getParam(oParam, 'data').value;
									var sFormat = ns1blankspace.util.getParam(oParam, 'format', {"default": ""}).value;

									if (LZString)
									{
										sData = LZString["compress" + (sFormat==''?'':'To') + sFormat](sData);
									}

									return sData
								},

					out: 		function (oParam)
								{
									var sData = ns1blankspace.util.getParam(oParam, 'data').value;
									var sFormat = ns1blankspace.util.getParam(oParam, 'format', {"default": ""}).value;

									if (LZString)
									{
										sData = LZString["decompress" + (sFormat==''?'':'From') + sFormat](sData);
									}

									return sData
								}
				},

	view:		{
					data: {base: []},

					queue:
					{
						init: function (sData, oParam)
						{
							this.clear(oParam);
							this.add(sData, oParam);
						},

						clear: function (oParam)
						{
							var sType = ns1blankspace.util.getParam(oParam, 'type', {"default": 'data'}).value;
							var sQueueID = ns1blankspace.util.getParam(oParam, 'queue', {"default": 'base'}).value;
							var bPreserve = ns1blankspace.util.getParam(oParam, 'preserve', {"default": false}).value;
							
							if (!bPreserve) {ns1blankspace.util.view[sType][sQueueID] = []};
						},

						add: function (sData, oParam)
						{
							var sType = ns1blankspace.util.getParam(oParam, 'type', {"default": 'data'}).value;
							var sQueueID = ns1blankspace.util.getParam(oParam, 'queue', {"default": 'base'}).value;
							var bClear = ns1blankspace.util.getParam(oParam, 'clear', {"default": false}).value;
							
							if (bClear) {$.vq.clear(oParam)}
							if (ns1blankspace.util.view[sType][sQueueID] == undefined) {ns1blankspace.util.view.data[sQueueID] = []}
							ns1blankspace.util.view[sType][sQueueID].push(sData);
						},

						render: function (sElementSelector, oParam)
						{
							var sType = ns1blankspace.util.getParam(oParam, 'type', {"default": 'data'}).value;
							var sQueueID = ns1blankspace.util.getParam(oParam, 'queue', {"default": 'base'}).value;
							var bShow = ns1blankspace.util.getParam(oParam, 'show', {"default": false}).value;

							if (sElementSelector == undefined)
							{
								console.log(ns1blankspace.util.view[sType][sQueueID].join(''));
							}
							else
							{
								if (ns1blankspace.util.view[sType][sQueueID] != undefined)
								{	
									$(sElementSelector).html(ns1blankspace.util.view[sType][sQueueID].join(''));
								}

								if (bShow)
								{
									$(sElementSelector).show(ns1blankspace.option.showSpeedOptions);
								}	

								if ($.fn.datepicker != undefined)
								{
									$('input.ns1blankspaceDate').datepicker({dateFormat: 'dd M yy'});
								}	
									
								ns1blankspace.util.view.queue.clear(oParam);
							}	
						},

						get: function (oParam)
						{
							var sType = ns1blankspace.util.getParam(oParam, 'type', {"default": 'data'}).value;
							var sQueueID = ns1blankspace.util.getParam(oParam, 'queue', {"default": 'base'}).value;
							var sReturn = ns1blankspace.util.view[sType][sQueueID].join('');
							ns1blankspace.util.view.queue.clear(oParam);

							return sReturn	
						},

						show: function (sElementSelector, sData, oParam)
						{
							this.clear(oParam);
							this.add(sData, oParam);
							this.render(sElementSelector, oParam);
						},

						exists: function (oParam)
						{
							var sType = ns1blankspace.util.getParam(oParam, 'type', {"default": 'data'}).value;
							var sQueueID = ns1blankspace.util.getParam(oParam, 'queue', {"default": 'base'}).value;
							return (ns1blankspace.util.view[sType][sQueueID].length!=0);
						}
					}	
				},

	copy: 		function (oObject)
				{
					return $.extend(true, [], oObject)
				},

	hasRole: 	function (oParam)
				{
					var sTitle = ns1blankspace.util.getParam(oParam, 'title').value;
					var aRole = $.grep(ns1blankspace.user.roles, function (role) {return role.title==sTitle})
					return (aRole.length!=0)
				}													
}

ns1blankspace.debug = 
{
	enabled: 	false,

	log: 		[],

	message: 	function (sMessage, bLog)
				{
					if (ns1blankspace.debug.enabled || bLog)
					{
						ns1blankspace.debug.log.push({time: Date(), message: sMessage})
						window.console && console.log(sMessage);
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
					
					if (oParam) 
					{
						if (oParam.minimumLength) {iMinimumLength = oParam.minimumLength;}
						if (oParam.source) {iSource = oParam.sourcel}
						if (oParam.selected != undefined) {bSelected = oParam.selected;}
					}

					oParam = ns1blankspace.util.setParam(oParam, "xhtmlElementID", sXHTMLElementID);

					if (bSelected)
					{
						var sElementReplaceID;
						var bUpdateHTML = false;
						var bUpperCase = ($('#' + ns1blankspace.xhtml.divID).attr('data-suburbcase') === 'upper');

						$('#' + ns1blankspace.xhtml.divID).val(((bUpperCase) ? $('#' + sXHTMLElementID).attr("data-suburb").toUpperCase() : $('#' + sXHTMLElementID).attr("data-suburb")));
						$('#' + ns1blankspace.xhtml.divID).attr('data-id', sXHTMLElementID);

						if ($('#' + ns1blankspace.xhtml.divID).attr('data-stateelementid')) 
						{
							sElementReplaceID = $('#' + ns1blankspace.xhtml.divID).attr('data-stateElementID');
						}
						else 
						{
							sElementReplaceID = ns1blankspace.xhtml.divID.replace('Suburb', 'State');
						}
						if ($('#' + ns1blankspace.xhtml.divID).attr('data-stateupdatehtml') || $('#' + ns1blankspace.xhtml.divID).attr('data-stateUpdateHTML') == 'true') 
						{
							$('#' + sElementReplaceID).html($('#' + sXHTMLElementID).attr("data-state"));
						}
						else 
						{
							$('#' + sElementReplaceID).val($('#' + sXHTMLElementID).attr("data-state"));
						}

						if ($('#' + ns1blankspace.xhtml.divID).attr('data-postcodeelementid')) 
						{
							sElementReplaceID = $('#' + ns1blankspace.xhtml.divID).attr('data-postcodeElementID');
						}
						else 
						{
							sElementReplaceID = ns1blankspace.xhtml.divID.replace('Suburb', 'PostCode');
						}
						if ($('#' + ns1blankspace.xhtml.divID).attr('data-postcodeupdatehtml') || $('#' + ns1blankspace.xhtml.divID).attr('data-postcodeUpdateHTML') == 'true') 
						{
							$('#' + sElementReplaceID).html($('#' + sXHTMLElementID).attr("data-postcode"));
						}
						else 
						{
							$('#' + sElementReplaceID).val($('#' + sXHTMLElementID).attr("data-postcode"));
						}

						if ($('#' + ns1blankspace.xhtml.divID).attr('data-countryelementid')) 
						{
							sElementReplaceID = $('#' + ns1blankspace.xhtml.divID).attr('data-countryElementID');
						}
						else 
						{
							sElementReplaceID = ns1blankspace.xhtml.divID.replace('Suburb', 'Country');
						}
						if ($('#' + ns1blankspace.xhtml.divID).attr('data-countryupdatehtml') || $('#' + ns1blankspace.xhtml.divID).attr('data-countryUpdateHTML') == 'true') 
						{
							$('#' + sElementReplaceID).html('Australia');
						}
						else 
						{
							$('#' + sElementReplaceID).val('Australia');
						}

						$(ns1blankspace.xhtml.container).hide();
						if (oParam.onComplete) 
						{
							ns1blankspace.util.onComplete(oParam);
						}
					}
					else
					{
						ns1blankspace.container.position({xhtmlElementID: sXHTMLElementID});
						sSearchText = $('#' + ns1blankspace.xhtml.divID).val();

						if (sSearchText.length >= iMinimumLength || iSource === ns1blankspace.data.searchSource.all)
						{
							ns1blankspace.status.working();
							var oSearch = new AdvancedSearch();
							oSearch.method = 'CORE_ADDRESS_SEARCH';
							oSearch.addField('suburb,state,postcode');
							oSearch.addFilter('suburb', 'TEXT_IS_LIKE', sSearchText);
							oSearch.rows = 100;
							oSearch.dataType = 'json';
							oSearch.getResults(function(data) {ns1blankspace.search.address.process(oParam, data);});
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
							
					if (oParam) 
					{
						if (oParam.xhtmlElementID) {sXHTMLElementID = oParam.xhtmlElementID;}
					}

					ns1blankspace.status.message('');

					if (oResponse.data.rows.length === 0) 
					{
						$(ns1blankspace.xhtml.container).hide();
					}
					else 
					{
						
						aHTML.push('<table class="ns1blankspaceSearchMedium" style="width:' +
										$('#' + sXHTMLElementID).width() + 'px;">');

						$.each(oResponse.data.rows, function()
						{
							aHTML.push('<tr class="ns1blankspaceSearch">');
										
							aHTML.push('<td class="ns1blankspaceSearch"' +
											' id="ns1blankspaceAddressSearchSuburb-' + 
												this.suburb.replace(/ /g,'') + 
												this.state.replace(/ /g,'') + 
												this.postcode.replace(/ /g,'') + '"' +
											' data-suburb="' + this.suburb + '"' + 
											' data-state="' + this.state + '"' + 
											' data-postcode="' + this.postcode + '"' + 
											'>' + this.suburb + '</td>');
													
							aHTML.push('<td class="ns1blankspaceSearch"' + 
											' id="ns1blankspaceAddressSearchState' + 
												this.suburb.replace(/ /g,'') + 
												this.state.replace(/ /g,'') + 
												this.postcode.replace(/ /g,'') + '"' +
											' data-suburb="' + this.suburb + '"' + 
											' data-state="' + this.state + '"' + 
											' data-postcode="' + this.postcode + '"' + 
											'>' + this.state + '</td>');
							
							aHTML.push('<td class="ns1blankspaceSearch"' +
											' id="ns1blankspaceAddressSearchPostCode' + 
												this.suburb.replace(/ /g,'') + 
												this.state.replace(/ /g,'') + 
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
							ns1blankspace.data.searchClicked = true;
							var oParam = {selected: true, 
										  onComplete: ((ns1blankspace.xhtml.action && ns1blankspace.xhtml.action != '') ? ns1blankspace.xhtml.action : undefined),
										  xhtmlInputElementID: sXHTMLElementID
										}
							ns1blankspace.xhtml.action = '';
							$(ns1blankspace.xhtml.container).hide(200);
							ns1blankspace.search.address.show(event.target.id, oParam);
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
					var iMaximumColumns = 3;
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

					var aSearch = sXHTMLElementID.split('-');
					var sElementID = aSearch[0];
					var lElementSearchContext = aSearch[1];
						
					if (sElementID != '')
					{
						var sMethod = $('#' + sElementID).attr("data-method")
						var sParentElementID = $('#' + sElementID).attr("data-parent")
					}	
					
					if (lElementSearchContext != undefined)
					{
						if (sSetXHTMLElementID === undefined) {sSetXHTMLElementID = sElementID}
					
						var lDataID = $('#' + sSetXHTMLElementID).attr("data-id")
						lDataID = (lDataID === undefined) ? aSearch[1] : lDataID + '-' + aSearch[1];
						$('#' + sSetXHTMLElementID).attr("data-id", lDataID)
						
						var sValue = $('#' + sSetXHTMLElementID).val();
						
						if (bEmailOnly) 
						{
							sValue = (sValue === '') 
									? $('#' + sXHTMLElementID).parent().attr('data-email') 
									: sValue + ';' + $('#' + sXHTMLElementID).parent().attr('data-email');
								
							$('#' + sSetXHTMLElementID).val(sValue);
							$('#' + sSetXHTMLElementID).attr('data-values', ($('#' + sSetXHTMLElementID).attr('data-values') === undefined 
																			? $('#' + sXHTMLElementID).parent().attr('data-email') 
																			: sValue + ';' + $('#' + sXHTMLElementID).parent().attr('data-email')
																			));	
						}
						else
						{
							$('#' + sSetXHTMLElementID).val($('#' + sXHTMLElementID).parent().attr('data-firstname') + ' ' + $('#' + sXHTMLElementID).parent().attr('data-surname'))
						}	
						
						$('#' + sParentElementID).attr("data-id", $('#' + sXHTMLElementID).parent().attr('data-contactbusiness'));
						$('#' + sParentElementID).val($('#' + sXHTMLElementID).parent().attr('data-contactbusinesstext'));

						$(ns1blankspace.xhtml.container).hide();
					}
					else
					{
						ns1blankspace.container.position({xhtmlElementID: sXHTMLElementID});
					
						if (sSearchText === undefined) {sSearchText = ''};
							
						if (sSearchText === '' && iSource === ns1blankspace.data.searchSource.text)
						{
							sSearchText = $('#' + sElementID).val();
						}	
						
						if (sSearchText.length >= iMinimumLength || iSource === ns1blankspace.data.searchSource.all)
						{						
							var sFirstName = sSearchText;
							var sSurname = sSearchText;
							if (sSearchText.split(' ').length == 2)
							{
								sFirstName = sSearchText.split(' ').shift();
								sSurname = sSearchText.split(' ').pop();
							}

							var oSearch = new AdvancedSearch();
							oSearch.rows = 15;
							oSearch.method = 'CONTACT_PERSON_SEARCH';
							oSearch.addField( 'firstname,surname,contactbusinesstext,contactbusiness,email');
							oSearch.addFilter('contactbusinesstext', 'TEXT_IS_LIKE', sSearchText);
							oSearch.addOperator('or');
							oSearch.addBracket('(');
							oSearch.addFilter('firstname', 'TEXT_IS_LIKE', (sSearchText != sFirstName) ? sFirstName : sSearchText);
							oSearch.addOperator((sFirstName != sSurname ? 'and' : 'or'));
							oSearch.addFilter('surname', 'TEXT_IS_LIKE', (sSearchText != sSurname) ? sSurname : sSearchText);
							oSearch.addBracket(')');
							if (bEmailOnly)
							{
								oSearch.addOperator('or');
								oSearch.addFilter('email', 'TEXT_IS_LIKE', sSearchText);
							}
							
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
							}	
													
							oSearch.getResults(function (data) {ns1blankspace.search.email.process(data, sElementID, oParam)}) 								
						}
					};
				},

	process: 	function (oResponse, sElementID, oParam)
				{
					var iColumn = 0;
					var aHTML = [];
					var h = -1;
					var	iMaximumColumns = 1;
					var sData;
					
					if (oResponse.data.rows.length === 0)
					{
						$(ns1blankspace.xhtml.container).hide();
					}
					else
					{
						aHTML.push('<table class="ns1blankspaceSearchMedium">');
							
						$.each(oResponse.data.rows, function()
						{								
							aHTML.push(ns1blankspace.search.email.row(oParam, this));
						});
				    	
						aHTML.push('</table>');
					
						$(ns1blankspace.xhtml.container).html(
							ns1blankspace.render.init(
							{
								html: aHTML.join(''),
								more: (oResponse.morerows === 'true')
							})
						);
					
						$(ns1blankspace.xhtml.container).show(ns1blankspace.option.showSpeedOptions);
						
						$('td.ns1blankspaceSearch').click(function(event)
						{
							$(ns1blankspace.xhtml.container).hide(200);
							ns1blankspace.search.email.show(event.target.id, oParam);
						});

						ns1blankspace.render.bind(
						$.extend(oParam,
						{
							columns: 'firstname-surname-email-contactbusinesstext',
							idColumns: 'firstname-surname-contactbusiness-contactbusinesstext-email',
							more: oResponse.moreid, 
							functionSearch: ns1blankspace.search.email.show,
							xhtmlElementID: sElementID,
							type: 'JSON',
							functionRow: ns1blankspace.search.email.row
						}));
					}
				},

	row: 		function (oParam, oRow)
				{
					var sData = ' data-firstname="' + oRow.firstname + '"' +
									' data-surname="' + oRow.surname + '"' +
									' data-contactbusiness="' + oRow.contactbusiness + '"' +
									' data-contactbusinesstext="'+ oRow.contactbusinesstext + '"' +
									' data-email="' + oRow.email + '"';
					
					var aHTML = [];

					aHTML.push('<tr class="ns1blankspaceSearch"' + sData + '>');
					
					aHTML.push('<td class="ns1blankspaceSearch" id="-' + oRow.id +
											'">' + oRow.firstname +
											'</td>');
											
					aHTML.push('<td class="ns1blankspaceSearch" id="-' + oRow.id +
											'">' + oRow.surname +
											'</td>');
																	
					aHTML.push('<td class="ns1blankspaceSearch" id="-' + oRow.id +
											'">' + oRow.email +
											'</td>');
											
					aHTML.push('<td class="ns1blankspaceSearch" id="-' + oRow.id +
											'">' + oRow.contactbusinesstext +
											'</td>');
											
					aHTML.push('</tr>');

					return aHTML.join('');
				}			
}				

ns1blankspace.render =
{
	init: 		function (oParam)
				{
					var aHTML = [];
					
					var sHTML = '';
					var bMore = false;
					var sWidth = 251;
					var bHeader = true;

					if (oParam != undefined)
					{
						if (oParam.html != undefined) {sHTML = oParam.html}
						if (oParam.more != undefined) {bMore = oParam.more}
						if (oParam.width != undefined) {sWidth = oParam.width}
						if (oParam.header != undefined) {bHeader = oParam.header}
					}

					if (bMore || bHeader)
					{
						aHTML.push('<table id="ns1blankspaceSearchHeader" class="ns1blankspaceSearchHeaderMedium" style="border-spacing:2px; width:' + sWidth + 'px;">');
						aHTML.push('<tr>');
						
						if (bMore)
						{
							aHTML.push('<td style="width:5px; cursor:pointer; padding-top:5px;" class="ns1blankspaceRenderHeader ns1blankspaceRenderHeaderPage ns1blankspaceRenderHeaderPageSelected"' +
												' id="ns1blankspaceRenderHeader-0" data-rowstart="0">1</td>');

							aHTML.push('<td style="cursor:pointer;" class="ns1blankspaceRenderHeaderMore' + 
												'" id="ns1blankspaceRenderHeaderMore">more...</td>');
						}

						if (bHeader)
						{
							aHTML.push('<td class="ns1blankspaceSearchHeaderClose" style="padding-left:5px;padding-right:3px;padding-top:3px;width:20px;text-align:right;">' +
												'<span id="ns1blankspaceSearchHeaderClose"></span></td>');
						}

						aHTML.push('</tr>');
						aHTML.push('</table>');
					}	
						
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
					.click(function()
					{
						$(ns1blankspace.xhtml.container).slideUp(1000);
						$(ns1blankspace.xhtml.container).html('&nbsp;');
					})
					.css('width', '15px')
					.css('height', '18px');
						
					$('#ns1blankspaceRenderHeaderMore')
					.click(function()
					{
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
					var iStartRow = ns1blankspace.option.defaultRowsSmall;
					var iRows = ns1blankspace.option.defaultRowsSmall;
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
					var fFunctionRow = ns1blankspace.render.row;


					
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
						if (oParam.functionRow != undefined) {fFunctionRow = oParam.functionRow}
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
									aHTML.push(fFunctionRow(oParam, this));
								});
							
								aHTML.push('</table>');
								
								aHTML.push('</div>');
								
								$('.ns1blankspaceSearchPage').hide();
								$('.ns1blankspaceSearchPage:last').after(aHTML.join(''));
								
								$('td.ns1blankspaceSearch').click(function(event)
								{
									oParam.source = 1;
									fFunctionSearch(event.target.id, oParam);
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

	row:		function (oParam, oRow)
				{
					var aHTML = [];
					var sClass;

					var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;
					var sIDColumns = ns1blankspace.util.getParam(oParam, 'idColumns', {"default": ''}).value;
					var sColumns = ns1blankspace.util.getParam(oParam, 'columns', {"default": 'title'}).value;
					var fFunctionClass = ns1blankspace.util.getParam(oParam, 'functionClass').value;
					var sIdAdditional = ns1blankspace.util.getParam(oParam, 'idAdditional').value;

					aHTML.push('<tr class="ns1blankspaceSearch">');
					
					var aIDColumns = sIDColumns.split("-");
					
					var sIDData = '';

					for (var i = 0; i < aIDColumns.length; i++)
					{
						sIDData += '-' + oRow[aIDColumns[i]];
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
											sXHTMLElementID + '-' + oRow.id + sIDData + sIdAdditional + '">');
											
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
						case 'hyphen':
							aHTML.push('-');
							break;
						default:
							aHTML.push(oRow[aColumns[i]]);
						}
						
						aHTML.push('</td>');
					}
										
					aHTML.push('</tr>');

					return aHTML.join('');
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
					var fFunctionOnNewPage;
					var oSummary;

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
						if (oParam.functionOnNewPage != undefined) {fFunctionOnNewPage = oParam.functionOnNewPage}
						if (oParam.summary != undefined) {oSummary = oParam.summary}
					}

					if (ns1blankspace.data.render == undefined) {ns1blankspace.data.render = {}}

					if (sXHTMLContext != undefined)
					{
						ns1blankspace.data.render[sXHTMLContext] = oParam;
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

					if (fFunctionOnNewPage !== undefined)
					{
						oParam = ns1blankspace.util.setParam(oParam, 'xhtmlContainerID', 'ns1blankspaceRenderPage_' + sXHTMLContext + '-0');
						fFunctionOnNewPage(oParam);
					}	
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
					var fFunctionOnNewPage;
					
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
						if (oParam.functionOnNewPage != undefined) {fFunctionOnNewPage = oParam.functionOnNewPage}
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
									aHTML.push(fFunctionShowRow(this, oParam));
								});
								
								aHTML.push('</table>');
								
								aHTML.push('</div>');
								
								$('.ns1blankspaceRenderPage_' + sXHTMLContext).hide();
								$('.ns1blankspaceRenderPage_' + sXHTMLContext + ':last').after(aHTML.join(''));
																
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
								
								if (fFunctionOnNewPage !== undefined)
								{
									oParam = ns1blankspace.util.setParam(oParam, 'xhtmlContainerID', 'ns1blankspaceRenderPage_' + sXHTMLContext + '-' + iStartRow);
									fFunctionOnNewPage(oParam);
								}	
								else if (sFunctionNewPage != undefined)
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
	create:		function (oParam, oResponse)
				{
					var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {"default": 'ns1blankspaceSummaryCreatePDF'}).value;
					var iObject = ns1blankspace.util.getParam(oParam, 'object', {"default": ns1blankspace.object}).value;
					var iObjectContext = ns1blankspace.util.getParam(oParam, 'objectContext', {"default": ns1blankspace.objectContext}).value;
					var sFileName = ns1blankspace.util.getParam(oParam, 'filename').value;
					
					if (sFileName == undefined)
					{
						if (ns1blankspace.objectContextData != undefined)
						{
							sFileName = ns1blankspace.objectContextData.id + '.pdf'
						}
						else
						{
							sFileName = 'download.pdf'
						}
					}

					var sXHTMLContentHeader = ns1blankspace.util.getParam(oParam, 'xhtmlContentHeader', {"default": ''}).value;
					var sXHTMLContent = ns1blankspace.util.getParam(oParam, 'xhtmlContent', {"default": ''}).value;
					var sXHTMLContentFooter = ns1blankspace.util.getParam(oParam, 'xhtmlContentFooter', {"default": ''}).value;
					var bOpen = ns1blankspace.util.getParam(oParam, 'open', {"default": false}).value;
					var fOnComplete = ns1blankspace.util.getParam(oParam, 'onComplete').value;
					var bReplace = ns1blankspace.util.getParam(oParam, 'replace', {"default": false}).value;
					var iLeftMargin = ns1blankspace.util.getParam(oParam, 'leftmargin', {"default": 25}).value;
					var iRightMargin = ns1blankspace.util.getParam(oParam, 'rightmargin', {"default": 25}).value;
					var iTopMargin = ns1blankspace.util.getParam(oParam, 'topmargin', {"default": 25}).value;
					var iBottomMargin = ns1blankspace.util.getParam(oParam, 'bottommargin', {"default": 25}).value;
					var iOrientation = ns1blankspace.util.getParam(oParam, 'orientation', {"default": 1}).value;
					var bLink = ns1blankspace.util.getParam(oParam, 'link', {"default": false}).value;
					var sLinkText = ns1blankspace.util.getParam(oParam, 'linkText', {"default": "Download&nbsp;&raquo;"}).value;
					var iHeaderHeight = ns1blankspace.util.getParam(oParam, 'headerheight', {"default": 25}).value;
					var iFooterHeight = ns1blankspace.util.getParam(oParam, 'footerheight', {"default": 25}).value;

					if (bReplace)
					{	
						sXHTMLContent = sXHTMLContent.replace(/https/g,'http');
						sXHTMLContent = sXHTMLContent.replace(/app.alt-enter.com/g,'[[host]]');
						sXHTMLContent = sXHTMLContent.replace(/app.1blankspace.com/g,'[[host]]');
					}

					if (ns1blankspace.option.pdfStyles != undefined)
					{
						sXHTMLContent = ns1blankspace.option.pdfStyles + sXHTMLContent;
						sXHTMLContentHeader = ns1blankspace.option.pdfStyles + sXHTMLContentHeader;
						sXHTMLContentFooter = ns1blankspace.option.pdfStyles + sXHTMLContentFooter;
					}
													
					if (oResponse === undefined)
					{
						ns1blankspace.status.working('PDFing');

						$('#' + sXHTMLElementID).button(
						{
							label: 'Creating'
						});
						
						var oData =
						{
							object: iObject,
							objectcontext: iObjectContext,
							filename: sFileName,
							orientation: iOrientation,
							xhtmlheader: sXHTMLContentHeader,
							xhtmlbody: sXHTMLContent,
							xhtmlfooter: sXHTMLContentFooter,
							xhtmlheader_height: iHeaderHeight,
							xhtmlfooter_height: iFooterHeight,
						}

						if (iLeftMargin !== undefined) {oData.xhtml_LeftMargin = iLeftMargin}
						if (iRightMargin !== undefined) {oData.xhtml_RightMargin = iRightMargin}
						if (iTopMargin !== undefined) {oData.xhtml_TopMargin = iTopMargin}
						if (iBottomMargin !== undefined) {oData.xhtml_BottomMargin = iBottomMargin}
						
						if (oParam.baseURLBody != undefined) {oData.xhtmlbody_baseurl = oParam.baseURLBody}
						if (oParam.baseURLHeader != undefined) {oData.xhtmlheader_baseurl = oParam.baseURLHeader}
						if (oParam.baseURLFooter != undefined) {oData.xhtmlfooter_baseurl = oParam.baseURLFooter}
						
						$.ajax(
						{
							type: 'POST',
							url: ns1blankspace.util.endpointURI('CORE_PDF_CREATE'),
							data: oData,
							dataType: 'json',
							success: function(data) {ns1blankspace.pdf.create(oParam, data)}
						});
					}	
					else	
					{
						ns1blankspace.status.clear();

						if (fOnComplete === undefined)
						{	
							if (oResponse.status == 'OK')
							{
								if (bOpen)
								{
									window.open('/download/' + oResponse.attachmentlink)	
								}
								else
								{
									if (bLink && sXHTMLElementID !== undefined)
									{
										$('#' + sXHTMLElementID).button("destroy");
										$('#' + sXHTMLElementID).html('<a href="/download/' + oResponse.attachmentlink + '" target="_blank">' + sLinkText + '</a>');
									}
									else
									{	
										$('#' + sXHTMLElementID).button("destroy");
										$('#' + sXHTMLElementID).button(
										{
											label: 'Open'
										})
										.click(function(event)
										{
											window.open('/download/' + oResponse.attachmentlink, '_self')
										});
									}	
								}	
							}
							else
							{
								$('#' + sXHTMLElementID).button("destroy");
								$('#' + sXHTMLElementID).button(
								{
									label: 'Error'
								})
								.click(function(event)
								{
									ns1blankspace.status.error('An error occured while creating the PDF.');
								});
							}
						}
						else
						{
							if (oParam.attachmentLink == undefined)
							{
								oParam.attachmentLink = oResponse.attachmentlink;
							}
							else
							{
								oParam.attachmentLink = oParam.attachmentLink + ',' + oResponse.attachmentlink;
							}
							oParam.attachment = oResponse.attachment;
							delete oParam.onComplete;
							fOnComplete(oParam);
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
					var oContext;

					if (oParam)
					{
						if (oParam.refresh) {bRefresh = oParam.refresh}
						if (oParam.selector) {sSelector = oParam.selector}
						if (oParam.classSelector) {sClassSelector = oParam.classSelector}
						if (oParam.context) {oContext = oParam.context}
					}
							
					if (!oContext && bRefresh) {oContext = {inContext: false}} 		
					ns1blankspace.app.context(oContext);
							
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

ns1blankspace.remove =
				function (oParam, oResponse)
				{
					var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;
					var sID = ns1blankspace.util.getParam(oParam, 'id', {"default": ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 1}).value}).value;
					var bConfirmed = ns1blankspace.util.getParam(oParam, 'confirmed').value;
					var iLeftOffset = ns1blankspace.util.getParam(oParam, 'leftOffset', {"default": -72}).value;
					var iTopOffset = ns1blankspace.util.getParam(oParam, 'topOffset', {"default": -19}).value;
					var sWidth = ns1blankspace.util.getParam(oParam, 'width', {"default": '60px'}).value;
					var sHeight = ns1blankspace.util.getParam(oParam, 'height', {"default": '100%'}).value;
					var sFontSize = ns1blankspace.util.getParam(oParam, 'fontSize', {"default": '0.675em'}).value;
					var iParentLevel = ns1blankspace.util.getParam(oParam, 'parentLevel').value;
					var sMethod = ns1blankspace.util.getParam(oParam, 'method').value;
					var fIfNone = ns1blankspace.util.getParam(oParam, 'ifNone').value;
					var sIfNoneMessage = ns1blankspace.util.getParam(oParam, 'ifNoneMessage', {"default": 'Nothing to show.'}).value;
					var fDoRemove = ns1blankspace.util.getParam(oParam, 'doRemove').value;
					var iMinimumSiblings = ns1blankspace.util.getParam(oParam, 'minimumSiblings', {"default": 1}).value;
	
					if (!bConfirmed)
					{
						if (fDoRemove == undefined) {fDoRemove = ns1blankspace.remove}	

						if ($(ns1blankspace.xhtml.container).attr('data-initiator') == sXHTMLElementID)
						{
							$(ns1blankspace.xhtml.container).slideUp(300);
							$(ns1blankspace.xhtml.container).attr('data-initiator', '');
						}
						else
						{	
							$(ns1blankspace.xhtml.container).attr('data-initiator', sXHTMLElementID)

							ns1blankspace.container.position({xhtmlElementID: sXHTMLElementID, leftOffset: -66, topOffset: -21});

							var aHTML = [];
											
							aHTML.push('<div style="margin-right:4px;" id="ns1blankspaceMessageRemove" class="ns1blankspaceAction">Delete</div>');
		
							$(ns1blankspace.xhtml.container).html(aHTML.join(''));

							$('#ns1blankspaceMessageRemove').button(
							{
								label: 'Delete'
							})
							.click(function()
							{
								ns1blankspace.app.options.hide();
								oParam = ns1blankspace.util.setParam(oParam, 'confirmed', true);
								fDoRemove(oParam);
							})
							.css('width', sWidth)
							.css('height', sHeight)
							.css('font-size', sFontSize)
							.css('margin-top', '0px');
						}
					}	
					else
					{	
						if (sMethod)
						{	
							if (oResponse === undefined)
							{	
								var oData = {remove: 1, id: sID}

								if (ns1blankspace.option.financialOverride)
								{
									oData.override = 'Y'
								}

								$.ajax(
								{
									type: 'POST',
									url: ns1blankspace.util.endpointURI(sMethod),
									data: oData,
									dataType: 'json',
									success: function(data){ns1blankspace.remove(oParam, data)}
								});
							}	
							else
							{
								if (oResponse.status === 'OK')
								{
									var oXHTMLElement = $('#' + sXHTMLElementID);
									
									if (iParentLevel)
									{
										for ( var i = 0; i < iParentLevel; i++ ) 
										{
											oXHTMLElement = oXHTMLElement.parent();
										}
									}
									else
									{
										oXHTMLElement = oXHTMLElement.closest('tr');
									}
									
									oXHTMLElement.fadeOut(500, function ()
									{
										if (oXHTMLElement.siblings(':visible').length == iMinimumSiblings)
										{	
											if (fIfNone)
											{
												fIfNone()
											}
											else
											{
												oXHTMLElement.closest('div').html('<div class="ns1blankspaceNothing" style="margin-top:5px;">' + sIfNoneMessage + '</div>');
											}
										}
									});

									ns1blankspace.util.onComplete(oParam)
								}
								else
								{
									ns1blankspace.status.error('Could not be deleted');
								}
							}
						}	
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
					var bAsync = true;
					var fOnComplete;

					if (oParam != undefined)
					{
						if (oParam.object != undefined) {iObject = oParam.object}	
						if (oParam.categories != undefined) {aCategories = oParam.categories}
						if (oParam.setApp != undefined) {bSetApp = oParam.setApp}
						if (oParam.step != undefined) {iStep = oParam.step}
						if (oParam.bAsync != undefined) {bAsync = oParam.async}
						if (oParam.onComplete != undefined) {fOnComplete = oParam.onComplete}	
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
								oSearch.addField('objecttext,categorytext,category,object,structuretext,structureobjectlink.object.prefix');
								oSearch.rows = 100;
								oSearch.async = bAsync; 
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
								if (fOnComplete !== undefined)
								{
									oParam.initialised = true;
									ns1blankspace.util.onComplete(oParam);
								}	
								else if (bSetApp)
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
													'reference,structure,structuretext,textcolour,title,alias');
								oSearch.rows = 1000;
								oSearch.addFilter('category', 'IN_LIST', aCategories.join(','))
								oSearch.sort('category', 'asc');
								oSearch.sort('displayorder', 'asc');
								oSearch.async = bAsync;
								
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

							if (fOnComplete !== undefined)
							{
								oParam.initialised = true;
								ns1blankspace.util.onComplete(oParam);
							}	
							else if (bSetApp)
							{	
								oParam.extendInit = true;
								ns1blankspace.app.set(oParam);
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
					var sAlias;

					if (ns1blankspace.extend.structure !== undefined)
					{	
						$($.grep(ns1blankspace.extend.structure, function (a) {return a.object == iObject;})).each(function(i,v)
						{
							$(v.elements).each(function(j,k)
							{
								sAlias = k.alias;
								if (sAlias == undefined) {sAlias = 'se' + k.reference}

								if (k.datatype == 2 || k.datatype == 7)
								{	
									aElements.push(sAlias + 'text');
								}	
								aElements.push(sAlias);
							});
						});	
					}
					
					return aElements.join(',');
				},

	layout: 	function (oParam)
				{
					var iObject = ns1blankspace.object;
		
					if (oParam != undefined)
					{
						if (oParam.object != undefined) {iObject = oParam.object}
					}

					if (ns1blankspace.extend.structure !== undefined)
					{
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
					}	
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
										else if (this.datatype == 2 || this.datatype == 7)
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
								var sAlias;

								$(oCategory.elements).each(function()
								{
									sAlias = this.alias;
									if (sAlias == undefined) {sAlias = 'se' + this.reference}
									sAlias = sAlias.toLowerCase();

									if (this.datatype == 2)
									{	
										$('#ns1blankspaceStructure_' + this.id).val(ns1blankspace.objectContextData[sAlias + 'text']);
										$('#ns1blankspaceStructure_' + this.id).attr('data-id', ns1blankspace.objectContextData[sAlias]);
									}
									else
									{
										$('#ns1blankspaceStructure_' + this.id).val(ns1blankspace.objectContextData[sAlias]);
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
					var sAlias;

					if (ns1blankspace.extend.structure !== undefined)
					{
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
										sAlias = k.alias;
										if (sAlias == undefined) {sAlias = 'se' + k.reference}

										if (this.datatype == 2)
										{
											sData += '&' + sAlias + '=' + ns1blankspace.util.fs($('#ns1blankspaceStructure_' + k.id).attr('data-id'));
										}
										else
										{	
											sData += '&' + sAlias + '=' + ns1blankspace.util.fs($('#ns1blankspaceStructure_' + k.id).val());
										}	
									});	
								}	
							}		
						});
					}	

					return sData;

				}						
}
