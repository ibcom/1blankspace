/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */

Number.prototype.formatMoney = function(c, d, t){
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
		//sValue = sValue.replace(/-/g, '&#45;')
		//sValue = sValue.replace(/@/g, '&#64;')
		//sValue = sValue.replace(/\//g, '&#47;')
		//sValue = sValue.replace(/"/g, '&quot;')
		//sValue = sValue.replace(/\\/g, '&#39;')
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

var ns1blankspace = {};

var giVersion = 2;

var giShowSpeed = 0;
var giShowSpeedOptions = 0;
var giHideSpeed = 0;
var giHideSpeedOptions = 0;
var giWaitForStop = 400;
var giMessagingTimerID = 0;

var gbLogonStayOnDocument = true;
var gbSetupViewport = false;
var gbSetFocus = true;
var gbRichEdit = true;
var giKeyPressTimeoutId = 0;
var gbInputDetected = false;
var gbUnloadWarning = false;
var gbSystemAdmin = false;

var gsSetupMethod = '';
var gsSetupName = '';
var giSetupContext = -1;
var goSetupContextXML;
var goSetupContext;
var giOnDemandTimer;

var giObject = -1;
var gsObjectName = '';
var giObjectContext = -1;
var goObjectContextXML;
var goObjectContextJSON;
var goObjectContext;
var gsObjectContextLastSearch = '';
var giObjectSaveId = -1;
var gbOkToSave = true;
var goObjectContext;
var giEditorCounter = 0;

var gsViewportMasterControlXHTML = '';
var gsHomeXHTML = '';
var gsHomeViewportXHTML = '';
var gsUserName = '';
var gsUserEmail = '';
var gsUserNetworkGroups = '';
var gsViewportMasterActionXHTML = '';

var gaReturn = [];

var giUserID = -1;
var giUserContactPersonID = -1;

var gbSetupShow = false;
var giHelpOption = -1;
	
var giSearchSource_TEXT_INPUT = 1;
var giSearchSource_BROWSE = 2;
var giSearchSource_SELECT = 3;
var giSearchSource_ALL = 4;

var gsApplicationContext = 'start';

var gsLastShowDivID = '';
var gsOnDemandSetupURL = '/ondemand/setup/';
var gaParam;

var gaMasterViewportHistory = ['interfaceMasterHomeShow()']
var giMasterViewportHistoryCurrentIndex = 0
var gsLastDestinationInstructions = '';
var gaMasterObjectViewportHistory = [];

window.onbeforeunload = function() 
{
	if (gbUnloadWarning)
	{
	      return "You potentially will lose unsaved information if you close. Press Cancel to stop the close."
	}
}

$(function()
{

	gsUserNetworkGroups = '';
	gbSetupShow = false;
	
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
		gbSetFocus = false;
	}	 
	
	$('td.interfaceViewportControl').live('click', function()
	{
		interfaceMasterObjectViewportHistory({xhtmlElementID: this.id});
	});
	
	$('.interfaceViewportControl').live('mousedown', function() 
	{
		$('td.interfaceViewportControlHighlight').removeClass('interfaceViewportControlHighlight');
	});

	$('.interfaceViewportControl').live('mouseup', function() 
	{
		$(this).addClass('interfaceViewportControlHighlight');
	});

	$('.interfaceMasterWatermark').live('focus', function() 
	{
		if ($(this).hasClass('interfaceMasterWatermark'))
		{
			$(this).val('');
			$(this).removeClass('interfaceMasterWatermark');
		}	
	});		
		
	$('.inputInterfaceMainSelect').live('focus', function() 
	{		
		$(this).addClass('interfaceMasterHighlight');
		
		ns1blankspace.currentXHTMLElementID = this.id;
		gsLastShowDivID = this.id;
		
		$('#divInterfaceMasterViewportControlOptions').html('');
		$('#divInterfaceMasterViewportControlOptions').show();
		$('#divInterfaceMasterViewportControlOptions').offset({ top: $('#' + gsLastShowDivID).offset().top, left: $('#' + gsLastShowDivID).offset().left + $('#' + gsLastShowDivID).width() - 10});
				
		$('#divInterfaceMasterViewportControlOptions').html('<span id="spanInterfaceMainSelectOptions" class="interfaceMainSelectOptions"></span>');
		
		$('#spanInterfaceMainSelectOptions').button({
			text: false,
			icons: {
				primary: "ui-icon-triangle-1-s"
			}
		})
		.click(function() {
			interfaceMasterElementOptionsSearch({xhtmlElementID: gsLastShowDivID, source: 4});
		})
		.css('width', '14px')
		.css('height', '23px')
	});
		
	$('.inputInterfaceMainSelect').live('keyup', function()
	{
		interfaceMasterElementOptionsSearch({xhtmlElementID: gsLastShowDivID, source: 1, minimumLength: 3});	
	});	
		
	$('.inputInterfaceMainSelect').live('blur', function() 
	{
		$(this).removeClass('interfaceMasterHighlight');
	});
	
	$('.inputInterfaceMainSelectAddress').live('focus', function() 
	{
		gsLastShowDivID = this.id;
		$('#divInterfaceMasterViewportControlOptions').html('');
		$('#divInterfaceMasterViewportControlOptions').show();
		$('#divInterfaceMasterViewportControlOptions').offset({ top: $(this).offset().top, left: $(this).offset().left + $(this).width() - 10});
		$('#divInterfaceMasterViewportControlOptions').html('<span id="spanInterfaceMainSelectOptions" class="interfaceMainSelectOptions"></span>');
		
		$('#spanInterfaceMainSelectOptions').button( {
			text: false,
			icons: {
				primary: "ui-icon-triangle-1-s"
			}
		})
		.click(function() {
			interfaceMasterAddressSearch(gsLastShowDivID);
		})
		.css('width', '14px')
		.css('height', '23px')
	});
	
	$('.inputInterfaceMainSelectAddress').live('blur', function() 
	{
		$('#divInterfaceMasterViewportControlOptions').hide();
	});
	
	$('.inputInterfaceMainSelectContact').live('keyup', function()
	{
		interfaceMasterContactSearch(gsLastShowDivID, 1, 3);	
	});	
	
	$('.inputInterfaceMainSelectContact').live('focus', function() 
	{
		gsLastShowDivID = this.id;
		$('#divInterfaceMasterViewportControlOptions').html('');
		$('#divInterfaceMasterViewportControlOptions').show();
		$('#divInterfaceMasterViewportControlOptions').offset({ top: $(this).offset().top, left: $(this).offset().left + $(this).width() - 10});
		$('#divInterfaceMasterViewportControlOptions').html('<span id="spanInterfaceMainSelectOptions" class="interfaceMainSelectOptions"></span>');
		
		$('#spanInterfaceMainSelectOptions').button( {
			text: false,
			icons: {
				primary: "ui-icon-triangle-1-s"
			}
		})
		.click(function() {
			interfaceMasterContactSearch(gsLastShowDivID, 4);
		})
		.css('width', '14px')
		.css('height', '23px')
	});
	
	$('.inputInterfaceMainSelectContactEmail').live('focus', function() 
	{
		gsLastShowDivID = this.id;
		$('#divInterfaceMasterViewportControlOptions').html('');
		$('#divInterfaceMasterViewportControlOptions').show();
		$('#divInterfaceMasterViewportControlOptions').offset({ top: $(this).offset().top, left: $(this).offset().left + $(this).width()});
		$('#divInterfaceMasterViewportControlOptions').html('<span id="spanInterfaceMainSelectOptions" class="interfaceMainSelectOptions"></span>');
		
		$('#spanInterfaceMainSelectOptions').button( {
			text: false,
			icons: {
				primary: "ui-icon-triangle-1-s"
			}
		})
		.click(function() {
			interfaceMasterContactEmailSearch(gsLastShowDivID, {
					source: 4, 
					emailOnly: true,
					contactBusiness: $('#' + gsLastShowDivID).attr('ondemandcontactbusiness'),
					setXHTMLElementID: $(this).attr('ondemandsetelementid')
					});
		})
		.css('width', '14px')
		.css('height', '23px')
	});
	
	$('.inputInterfaceMainSelectContactEmail').live('keyup', function() 
	{
		if (giKeyPressTimeoutId != 0) {clearTimeout(giKeyPressTimeoutId)};
		
		var sFunction = "interfaceMasterContactEmailSearch(gsLastShowDivID, {" +
					"source: 1," +
					"emailOnly: true," +
					"contactBusiness: " + $(this).attr('ondemandcontactbusiness') + "," +
					"setXHTMLElementID: '" + $(this).attr('ondemandsetelementid') + "'});"
		
		giKeyPressTimeoutId = setTimeout(sFunction, giWaitForStop);
		
	});
	
	$('.spanInterfaceMainOptionsClose').live('click', function() 
	{
		$('#divInterfaceMasterViewportControlOptions').slideUp(500);
		$('#divInterfaceMasterViewportControlOptions').attr('onDemandSource', '');
	});
	
	$('.interfaceSearchHeaderPage').live('click', function() 
	{
		interfaceAuditSearchShowPage(this.id);
	});
	
	$('td.interfaceHomeOptionClose').live('click', function() 
	{
		$('#divInterfaceMasterViewportControlOptions').hide(1000);
		$('#divInterfaceMasterViewportControlOptions').html(interfaceHomeOptions());
		$('#divInterfaceMasterViewportControlOptions').show(500);
		interfaceHomeOptionsBind();
	});
	
	$('input.inputInterfaceMainText').live('focus', function() 
	{
		$(this).addClass('interfaceMasterHighlight');
	});

	$('input.inputInterfaceMainText').live('keyup', function() 
	{
		gbInputDetected = true;
	});
		
	$('input.inputInterfaceMainText').live('blur', function() 
	{
		$(this).removeClass('interfaceMasterHighlight');
	});

	$('input.inputInterfaceMainDate').live('focus', function() 
	{
		$(this).addClass('interfaceMasterHighlight');
	});

	$('input.inputInterfaceMainDate').live('blur', function() 
	{
		$(this).removeClass('interfaceMasterHighlight');
	});

	$('.inputInterfaceMainTextMulti').live('focus', function()
	{
		$(this).addClass('interfaceMasterHighlight');
	});

	$('.inputInterfaceMainTextMulti').live('blur', function() 
	{
		$(this).removeClass('interfaceMasterHighlight');
	});		
		
	//MAIN	
		
	if (window.location.hash == '#PASSWORDEXPIRED')
	{
		interfaceMasterLogonChangePasswordShow();
	}
	else
	{
		interfaceMasterViewport();
	}	
	
})

$.extend(
{
	urlParameters: function(){
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
	urlParameter: function(name)
	{
		return $.urlParameters()[name];
	}
});

function interfaceMasterObjectViewportHistory(aParam)
{
	var bGet = false;
	var iObject = giObject;
	var iObjectContext = giObjectContext;
	var sXHTMLElementID;
	var sFunctionDefault;
	
	if (aParam != undefined)
	{
		if (aParam.object != undefined) {iObject = aParam.object}
		if (aParam.objectContext != undefined) {iObjectContext = aParam.objectContext}
		if (aParam.functionDefault != undefined) {sFunctionDefault = aParam.functionDefault}
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
	}
	
	$.each(gaMasterObjectViewportHistory, function(index) 
	{ 
		if ((this.object == iObject) && (this.objectContext ==iObjectContext))
		{
			if (sFunctionDefault != undefined)
			{
				sXHTMLElementID = this.xhtmlElementID
			}
			else
			{
				gaMasterObjectViewportHistory.splice(index,1)
			}	
		}
	});
	
	if (sFunctionDefault == undefined)
	{
		gaMasterObjectViewportHistory.push(
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
			$('.interfaceViewportControl').removeClass('interfaceViewportControlHighlight')
			$('#' + sXHTMLElementID).addClass('interfaceViewportControlHighlight')
			$('#' + sXHTMLElementID).click()
		}
	}
}

function interfaceMasterViewportDestination(aParam)
{
	var sDestinationInstructions;
	var iInstruction = 1;
	var iInstructionCount = 1;
	var bContinue = true;
	var bMove = true;
	var bAdd = false;
	
	if (gbInputDetected)
	{
		 bContinue = confirm("You have edited this page.  Do you want to continue moving to the new page?")
	}	
			
	if (bContinue)
	{	
		gbInputDetected = false;
		
		if (aParam != undefined)
		{
			if (aParam.newDestination != undefined) {sDestinationInstructions = aParam.newDestination}
			if (aParam.instruction != undefined) {iInstruction = aParam.instruction}
			if (aParam.instructionCount != undefined) {iInstructionCount = aParam.instructionCount}
			if (aParam.index != undefined) {giMasterViewportHistoryCurrentIndex = aParam.index}
			if (aParam.move != undefined) {bMove = aParam.move}
			
			if (iInstruction == 1 && sDestinationInstructions != undefined)
			{
				if (sDestinationInstructions == gsLastDestinationInstructions)
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
						$.each(gaMasterViewportHistory, function(index) 
						{ 
							if (this == sDestinationInstructions)
							{
								gaMasterViewportHistory.splice(index,1)
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
					gaMasterViewportHistory.push(sDestinationInstructions);
					giMasterViewportHistoryCurrentIndex = gaMasterViewportHistory.length - 1;
					
					var sData = 'value=' + encodeURIComponent(gaMasterViewportHistory.slice(-2).toString());
					
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
				giMasterViewportHistoryCurrentIndex = giMasterViewportHistoryCurrentIndex - iInstructionCount;
				if (giMasterViewportHistoryCurrentIndex < 0) {giMasterViewportHistoryCurrentIndex = 0}
			}
			
			if (iInstruction == 3)
			{
				giMasterViewportHistoryCurrentIndex = giMasterViewportHistoryCurrentIndex + iInstructionCount;
				if (giMasterViewportHistoryCurrentIndex > gaMasterViewportHistory.length - 1) {giMasterViewportHistoryCurrentIndex = gaMasterViewportHistory.length - 1}
			}
			
			if (iInstruction == 4)
			{
				gaMasterViewportHistory.length = 0;
				giMasterViewportHistoryCurrentIndex = 0;
			}	
			
			if (iInstruction == 5)
			{
				giMasterViewportHistoryCurrentIndex = gaMasterViewportHistory.length - 1;
			}	
			
			if (iInstruction == 6)
			{
				giMasterViewportHistoryCurrentIndex = 0;
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
							gaMasterViewportHistory.push('interfaceMasterHomeShow()');
						}	
						else
						{
							gaMasterViewportHistory = data.split(',');
							giMasterViewportHistoryCurrentIndex = gaMasterViewportHistory.length - 1
						}	
					}
				})
			}		
				
			$('#spanInterfaceMasterViewportControlBack').button("destroy");	
			$('#spanInterfaceMasterViewportControlRefresh').button("destroy");	
			$('#spanInterfaceMasterViewportControlForward').button("destroy");	
			
			var bBack = true;
			var bForward = true;
			
			if (giMasterViewportHistoryCurrentIndex > 0)
			{	
				bBack = false;
			};
			
			if (giMasterViewportHistoryCurrentIndex < gaMasterViewportHistory.length - 1)
			{
				bForward = false;					
			};			
	
			$('#spanInterfaceMasterViewportControlBack')
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
	
			$('#spanInterfaceMasterViewportControlBack')
				.button({disabled: bBack})
	
			$('#spanInterfaceMasterViewportControlForward')
				.button({disabled: bForward})
	
			sDestinationInstructions = gaMasterViewportHistory[giMasterViewportHistoryCurrentIndex]
			gsLastDestinationInstructions = sDestinationInstructions;
			
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

function interfaceMasterLogonShow(aParam)
{
	//In some cases home.js::interfaceHomeLogonShow() is used instead

	var aHTML = [];
	var h = -1;
	var sXHTMLElementID = "divInterfaceBox";
	
	if (aParam != undefined)
	{
		if (aParam.objectContext != undefined) {iObjectContext = aParam.objectContext}
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
	}	
		
	aHTML[++h] = '<table id="tableInterfaceMasterLogon" class="interfaceMasterLogon">';
	
	aHTML[++h] = '<tr id="trInterfaceMasterLogonName" class="interfaceMasterLogon">' +
					'<td id="tdInterfaceMasterLogonName" class="interfaceMasterLogon">' +
					'Logon Name' +
					'</td>' +
					'<td id="tdinterfaceMasterLogonNameValue" class="interfaceMasterLogon">' +
					'<input id="inputInterfaceMasterLogonName" class="interfaceMasterLogon">' +
					'</td>' +
					'</tr>';
					
	aHTML[++h] = '<tr id="trInterfaceMasterLogonPassword" class="interfaceMasterLogon">' +
					'<td id="tdInterfaceMasterLogonPassword" class="interfaceMasterLogon">' +
					'Password' +
					'</td>' +
					'<td id="tdinterfaceMasterLogonPasswordValue" class="interfaceMasterLogon">' +
					'<input id="inputInterfaceMasterLogonPassword" class="interfaceMasterLogon" type="password">' +
					'</td>' +
					'</tr>';

	aHTML[++h] = '<tr id="trInterfaceMasterLogon" class="interfaceMasterLogon">' +
					'<td id="tdInterfaceMasterLogon" class="interfaceMasterLogon" colspan=2>' +
					'<span id="spanInterfaceMasterLogon"></span>' +
					'</td>' +
					'</tr>';
	
	aHTML[++h] = '<tr id="trInterfaceMasterLogonNameRemember" class="interfaceMasterLogon">' +
				    '<td id="tdInterfaceMasterLogonNameRemember" class="interfaceMasterLogon" colspan=2>' +
					'<input type="checkbox" id="inputInterfaceMasterLogonNameRemember"/>Remember Me</td></tr>';

	aHTML[++h] = '<tr id="trInterfaceMasterLogonSendPassword" class="interfaceMasterLogon">' +
					'<td id="tdInterfaceMasterLogonSendPassword" class="interfaceMasterLogon" colspan=2>' +
					'<a href="#" id="aInterfaceMasterLogonSendPassword">Send Password</a>' +
					'</td>' +
					'</tr>';
					
	aHTML[++h] = '<tr id="trInterfaceMasterLogonStatus" class="interfaceMasterLogon">' +
					'<td id="tdInterfaceMasterLogonStatus" class="interfaceMasterLogon" colspan=2>' +
					'&nbsp;' +
					'</td>' +
					'</tr>';
					
	aHTML[++h] = '</table>';					
	
	$('#' + sXHTMLElementID).css("z-index", "1");
	$('#' + sXHTMLElementID).html(aHTML.join(''));
	
	var sLogonName = $.cookie('mydigitalstucturelogon')
	
	if (sLogonName != '' && sLogonName != null)
	{
		$('#inputInterfaceMasterLogonName').val(sLogonName);
		$('#inputInterfaceMasterLogonNameRemember').attr('checked', true);
		$('#inputInterfaceMasterLogonPassword').focus();
	}
	else
	{
		$('#inputInterfaceMasterLogonName').focus();
	}
	
	$('#spanInterfaceMasterLogon').button(
	{
		label: "Logon"
	})
	.click(function() 
	{
		interfaceMasterLogon();
	});	

	$('#inputInterfaceMasterLogonName').keypress(function(e)
	{
	    if (e.which == 13)
	    {
	        interfaceMasterLogon();
	    }
	});

	$('#inputInterfaceMasterLogonPassword').keypress(function(e)
	{
	    if (e.which == 13)
	    {
	        interfaceMasterLogon();
	    }
	});

	$('#' + sXHTMLElementID).show(giShowSpeed);
	
	$('#aInterfaceMasterLogonSendPassword').click(function()
	{
		interfaceMasterLogonSendPasswordShow();
	});
	
}

function interfaceMasterLogon()
{
	var sReturn;
	var sData;

	var sLogonName = $('#inputInterfaceMasterLogonName').val();
	var sPassword = $('#inputInterfaceMasterLogonPassword').val();
	
	sData = 'logon=' + encodeURIComponent(sLogonName) + '&password=' + encodeURIComponent(sPassword);
	$('#tdInterfaceMasterLogonStatus').html(gsLoadingSmallXHTML);
	
	$.ajax(
	{
		type: 'POST',
		url: '/ondemand/logon/',
		data: sData,
		dataType: 'json',
		async: true,
		success: interfaceMasterLogonProcess
	})
}

function interfaceMasterLogonProcess(oResponse)	
{		
	if (oResponse.status == 'ER')
	{
		$('#tdInterfaceMasterLogonStatus').html('Logon Name or password is incorrect.');
		$('#divInterface').effect("shake", { times:2 }, 100);
	}
	else 
	{
		$('#tdInterfaceMasterLogonStatus').html('Logon successful...');
		
		if ($('#inputInterfaceMasterLogonNameRemember').attr('checked'))
		{
			$.cookie('mydigitalstucturelogon', $('#inputInterfaceMasterLogonName').val(), {expires:30});
		}
		
		//interfaceControlSecurity();
		
		if (oResponse.passwordStatus == "EXPIRED")
		{
			interfaceMasterLogonChangePasswordShow(); 
		}
		else
		{	
			if (oResponse.url == '#' || gbLogonStayOnDocument)
			{
				document.location.reload();
			}	
			else
			{
				document.location.href = oResponse.url;
			}
		}
	}
	
}

function interfaceMasterLogonChangePasswordShow(aParam)
{

	var aHTML = [];
	var h = -1;
	var sXHTMLElementID = 'divInterfaceBox';
	
	if (aParam != undefined)
	{
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
	}	
	
	aHTML[++h] = '<table id="tableInterfaceMasterLogonChangePassword" class="interfaceMasterLogon">';
	
	aHTML[++h] = '<tr id="trInterfaceMasterLogonCurrentPassword" class="interfaceMasterLogon">' +
					'<td id="tdInterfaceMasterCurrentPassword" class="interfaceMasterLogon">' +
					'Current Password' +
					'</td>' +
					'<td id="tdinterfaceMasterLogonCurrentPasswordValue" class="interfaceMasterLogon">' +
					'<input id="inputInterfaceMasterLogonCurrentPassword" class="interfaceMasterLogon" type="password">' +
					'</td>' +
					'</tr>';
					
	aHTML[++h] = '<tr id="trInterfaceMasterLogonNewPassword" class="interfaceMasterLogon">' +
					'<td id="tdInterfaceMasterLogonNewPassword" class="interfaceMasterLogon">' +
					'New Password' +
					'</td>' +
					'<td id="tdinterfaceMasterLogonNewPasswordValue" class="interfaceMasterLogon">' +
					'<input id="inputInterfaceMasterLogonNewPassword" class="interfaceMasterLogon" type="password">' +
					'</td>' +
					'</tr>';

	aHTML[++h] = '<tr id="trInterfaceMasterLogonNewPasswordConfirm" class="interfaceMasterLogon">' +
					'<td id="tdInterfaceMasterLogonNewPasswordConfirm" class="interfaceMasterLogon">' +
					'Confirm Password' +
					'</td>' +
					'<td id="tdinterfaceMasterLogonNewPasswordConfirmValue" class="interfaceMasterLogon">' +
					'<input id="inputInterfaceMasterLogonNewPasswordConfirm" class="interfaceMasterLogon" type="password">' +
					'</td>' +
					'</tr>';
					
	aHTML[++h] = '<tr id="trInterfaceMasterLogonChangePassword" class="interfaceMasterLogon">' +
					'<td id="tdInterfaceMasterLogonChangePassword" class="interfaceMasterLogon" colspan=2>' +
					'<span id="spanInterfaceMasterLogonChangePassword" class="interfaceMasterLogon">Change Password</span>' +
					'</td>' +
					'</tr>';
					
	aHTML[++h] = '<tr id="trInterfaceMasterLogonChangePasswordStatus" class="interfaceMasterLogon">' +
					'<td id="tdInterfaceMasterLogonChangePasswordStatus" class="interfaceMasterLogon" colspan=2>' +
					'&nbsp;' +
					'</td>' +
					'</tr>';
					
	aHTML[++h] = '</table>';					
	
	$('#' + sXHTMLElementID).html(aHTML.join(''));
	
	$('#inputInterfaceMasterLogonCurrentPassword').focus();
	
	$('#spanInterfaceMasterLogonChangePassword').button(
	{
		label: "Change Password"
	})
	.click(function()
	{
		interfaceMasterLogonChangePassword();
	});	
	
	$('#' + sXHTMLElementID).show(giShowSpeed);
}

function interfaceMasterLogonChangePassword()
{
		
	var sNewPassword = $('#inputInterfaceMasterLogonNewPassword').val();
	var sNewPasswordConfirm = $('#inputInterfaceMasterLogonNewPasswordConfirm').val();
	
	if (sNewPassword != sNewPasswordConfirm)
	{
		$('#tdInterfaceMasterLogonChangePasswordStatus').html('New passwords do not match.');
	}
	
	else if (sNewPassword == '')
	{
		$('#tdInterfaceMasterLogonChangePasswordStatus').html('New password can not be blank.');
	}
	else
	{
	
		$('#tdInterfaceMasterLogonChangePasswordStatus').html('Updating password...');
		
		var sCurrentPassword = $('#inputInterfaceMasterLogonCurrentPassword').val();
	
		var sParam = 'method=SITE_USER_PASSWORD_MANAGE&expiredays=36500' +
					'&site=' + msOnDemandSiteId +
					'&currentpassword=' + sCurrentPassword + 
					'&newpassword=' + sNewPassword +
					'&newpasswordconfirm=' + sNewPasswordConfirm;
		
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/site/?' + sParam,
			dataType: 'json',
			async: false,
			success: interfaceMasterLogonChangePasswordProcess
		})
	}
}
	
function interfaceMasterLogonChangePasswordProcess(oResponse)
{	

	if (oResponse.status == 'ER') 
	{
		if (oResponse.error.errornotes == 'PASSWORD_LESS_THAN_6_CHAR') 
		{
			$('#tdInterfaceMasterLogonChangePasswordStatus').html('New password needs to be at least 6 characters.');
		}
		else
		{
			$('#tdInterfaceMasterLogonChangePasswordStatus').html('Incorrect current password or your not logged on.');
		}
	}
	else
	{
		$('#tdInterfaceMasterLogonChangePasswordStatus').html('Password changed!');
	
		if (oResponse.url == '#' || gbLogonStayOnDocument)
		{
			window.location.hash = '';
			document.location.reload();
		}	
		else
		{
			document.location.href = aReturn[2];
		}
	
	}
}

function interfaceMasterLogonSendPasswordShow()
{

	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<table id="tableInterfaceMasterLogonSendPassword" class="interfaceMasterLogon">';
	
	aHTML[++h] = '<tr id="trInterfaceMasterLogonSendPassword" class="interfaceMasterLogon">' +
					'<td id="tdInterfaceMasterSendPassword" class="interfaceMasterLogon">' +
					'Logon Name' +
					'</td>' +
					'<td id="tdinterfaceMasterLogonSendPasswordValue" class="interfaceMasterLogon">' +
					'<input id="inputInterfaceMasterLogonSendPassword" class="interfaceMasterLogon">' +
					'</td>' +
					'</tr>';
					
	aHTML[++h] = '<tr id="trInterfaceMasterLogonSendPassword" class="interfaceMasterLogon">' +
					'<td id="tdInterfaceMasterLogonSendPassword" class="interfaceMasterLogon" colspan=2>' +
					'<span id="spanInterfaceMasterLogonSendPassword" class="interfaceMasterLogon">Send Password</span>' +
					'</td>' +
					'</tr>';
					
	aHTML[++h] = '<tr id="trInterfaceMasterLogonChangePasswordStatus" class="interfaceMasterLogon">' +
					'<td id="tdInterfaceMasterLogonSendPasswordStatus" class="interfaceMasterLogon" colspan=2>' +
					'&nbsp;' +
					'</td>' +
					'</tr>';
					
	aHTML[++h] = '</table>';					
	
	$('#divInterfaceBox').css("z-index", "1");
	$('#divInterfaceBox').html(aHTML.join(''));
	
	$('#inputInterfaceMasterLogonSendPassword').focus();
	
	$('#spanInterfaceMasterLogonSendPassword').button(
	{
		label: "Send Password"
	})
	.click(function()
	{
		interfaceMasterLogonSendPassword();
	});	
	
	$('#divInterfaceMasterLogon').show(giShowSpeed);
}

function interfaceMasterLogonSendPassword()
{	
	if ($('#inputInterfaceMasterLogonSendPassword').val() == '')
	{
		$('#tdInterfaceMasterLogonSendPasswordStatus').html('Logon name is blank, please enter logon name.');
	}
	else
	{
	
		$('#tdInterfaceMasterLogonSendPasswordStatus').html('Sending password...');
		
		var sCurrentPassword = $('#inputInterfaceMasterLogonCurrentPassword').val();
					
		var sParam = 'method=SITE_SEND_PASSWORD&site=' + msOnDemandSiteId +
					'&logon=' + $('#inputInterfaceMasterLogonSendPassword').val();	
		
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/site/?' + sParam,
			dataType: 'json',
			async: false,
			success: interfaceMasterLogonSendPasswordProcess
		})
	}
	
}

function interfaceMasterLogonSendPasswordProcess(oResponse)
{
	if (oResponse.status == 'OK')
	{
		$('#tdInterfaceMasterLogonSendPasswordStatus').html('Your password has been emailed to you.');
	
	}
	else
	{
		$('#tdInterfaceMasterLogonSendPasswordStatus').html('Can not find this logon name!');
	}
}

function interfaceMasterLogoff()
{
	$.ajax(
	{
		type: 'GET',
		async: false,
		url: '/ondemand/core/?method=CORE_LOGOFF',
		dataType: 'json'
	})
	
	gbUnloadWarning = false;
	document.location.reload();
}

function interfaceMasterViewportUserControlShow(oElement)
{

	$('#divInterfaceMasterViewportControlOptions').offset({ top: $(oElement).offset().top + $(oElement).height(), left: $(oElement).offset().left });
	$('#divInterfaceMasterViewportControlOptions').html(interfaceControlUserOptions());
	$('#divInterfaceMasterViewportControlOptions').show(giShowSpeedOptions);
	
	interfaceControlUserOptionsBind();
}

function interfaceMasterViewport()
{
	var sParam = 'method=CORE_GET_USER_NAME';
	
	$.ajax(
	{
		type: 'GET',
		url: '/ondemand/core/?' + sParam,
		dataType: 'json',
		async: false,
		cache: false,
		success: function(data) 
		{
			if (data.status == 'ER')
			{
				interfaceHomeLogonShow();
			}
			else
			{
				interfaceMasterViewportShow(data);
			}	
		}
	})
	
}	
	
function interfaceMasterViewportShow(oResponse)	
{
	var aHTML = [];
	var h = -1;

	ns1blankspace.user = oResponse.user;
	ns1blankspace.userUnrestricted = (oResponse.unrestrictedaccess = 'Y' || oResponse.unrestrictedaccess == undefined ? true : false);
	ns1blankspace.spaceText = oResponse.spacename;
	ns1blankspace.space = oResponse.space;
	ns1blankspace.userSpace = oResponse.space;
	ns1blankspace.userSpaceText = oResponse.spacename

	gsUserName = oResponse.userlogonname;
	gsUserID = oResponse.user;
	gsUserContactPersonID = oResponse.contactperson;
	gsUserEmail = oResponse.email;
	gbSystemAdmin = oResponse.systemadmin;
	
	interfaceControlSecurity();
	
	gbUnloadWarning = true;
		
	aHTML[++h] = '<div id="divInterfaceMasterViewport" class="interfaceMaster">';
	
	$('#tdInterfaceMasterHeaderColumn2').css('width', '250px');
	$('#tdInterfaceMasterHeaderColumn2').html('<div id="divInterfaceMasterViewportSpaceText">' + ns1blankspace.spaceText + '</div>' +
									'<div id="divInterfaceMasterViewportLogonName">' + gsUserName + '</div>')
	
	aHTML[++h] = '<div id="divInterfaceMasterViewportControl" class="interfaceMasterViewport">';
	
		aHTML[++h] = '<div id="divInterfaceMasterViewportControlHome">' +
						'<span id="spanInterfaceMasterViewportControlHome" class="interfaceMasterViewport">&nbsp;</span>' +
						'<span id="spanInterfaceMasterViewportControlHomeOptions" class="interfaceMasterViewport">&nbsp;</span>' +
						'</div>';
						
		aHTML[++h] = '<div id="divInterfaceMasterViewportControlDestination">' +
						'<span id="spanInterfaceMasterViewportControlBack" class="interfaceMasterViewport">&nbsp;</span>' +
						'<span id="spanInterfaceMasterViewportControlRefresh" class="interfaceMasterViewport">&nbsp;</span>' +
						'<span id="spanInterfaceMasterViewportControlForward" class="interfaceMasterViewport">&nbsp;</span>' +
						'</div>';				
				
		aHTML[++h] = '<div id="divInterfaceMasterViewportControlSet" class="interfaceMasterViewport">' +
						'<span id="spanInterfaceMasterViewportControlSet" class="interfaceMasterViewport">&nbsp;</span>' +
						'</div>';
						
		aHTML[++h] = '<div id="divInterfaceMasterViewportControlSearch">' +
						'<input id="inputInterfaceMasterViewportControlSearch" class="interfaceMasterViewport">' +
						'</div>';
						
		aHTML[++h] = '<div id="divInterfaceMasterViewportControlSearchStatus"></div>';
						
		aHTML[++h] = '<div id="divInterfaceMasterViewportControlNew">' +
						'<span id="spanInterfaceMasterViewportControlNew" class="interfaceMasterViewport">New</span>' +
						'</div>';
						
		aHTML[++h] = '<div id="divInterfaceMasterViewportControlAction">' +
						'<span id="spanInterfaceMasterViewportControlAction" class="interfaceMasterViewport"></span>' +
						'<span id="spanInterfaceMasterViewportControlActionOptions" class="interfaceMasterViewport">&nbsp;</span>' +
						'</div>';
		
		aHTML[++h] = '<div id="divInterfaceMasterViewportControlActionStatus" class="interfaceMasterViewport">&nbsp;</div>';
		
		if (gbSetupShow) 
		{

			aHTML[++h] = '<div id="divInterfaceMasterViewportControlSetup">' +
							'<input type="checkbox" id="spanInterfaceMasterViewportControlSetupSwitch" class="interfaceMasterViewport"/>' +
							'<label style="font-size:0.875em;" for="spanInterfaceMasterViewportControlSetupSwitch">&nbsp;</label>' +
							'</div>';
		}				
		
		aHTML[++h] = '<div id="divInterfaceMasterViewportControlHelp">' + 
						'<span id="spanInterfaceMasterViewportControlHelpHome" class="interfaceMasterViewport">&nbsp;</span>' +
						'</div>';
	
	aHTML[++h] = '</div>';
	
	aHTML[++h] = '</div>';
	
	aHTML[++h] = '<div id="divInterfaceMasterViewportControlBrowse" class="interfaceMasterViewport">&nbsp;</div>';
	
	aHTML[++h] = '<div id="divInterfaceMasterViewportControlOptions" class="interfaceMasterViewportOptions">&nbsp;</div>';
	aHTML[++h] = '<div id="divInterfaceMasterDialog" class="divInterfaceMasterDialog">&nbsp;</div>';
	
	$('#divInterfaceMasterViewportControl').html(aHTML.join(''));
	
	$('#spanInterfaceMasterViewportControlHome')
		.button({
				text: false,
				icons: {
					primary: "ui-icon-home"
				}})
		.click(function(event)
		{
			interfaceMasterHomeShow();
		})
				
		.next()
			.button( {
				text: false,
				icons: {
					primary: "ui-icon-triangle-1-s"
				}
			})
			.click(function() {
				interfaceMasterHomeOptionsShow(this);
			})
			.css('width', '12px')
			.parent()
				.buttonset();
	
	$('#spanInterfaceMasterViewportControlBack')
		.button({
				text: false,
				icons: {}
				})
		.click(function(event)
		{
			interfaceMasterViewportDestination({instruction: 2});
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
				interfaceMasterViewportDestination({instruction: 7});
			})
			.css('width', '25px')
			.css('margin-left', '2px')
		.next()
			.button( {
				text: false,
				icons: {}
			})
			.click(function() {
				interfaceMasterViewportDestination({instruction: 3});
			})
			.css('width', '19px')
			.css('margin-left', '2px')
			.parent()
				.buttonset();
	
	$('#divInterfaceMasterViewportControlSet')
		.button(
		{
			icons: 
			{
				primary: "ui-icon-grip-dotted-vertical",
				secondary: "ui-icon-triangle-1-s"
			},
			label: gsViewportDefault
		})
		.click(function() 
		{
			interfaceMasterViewportControlShow(this);
		})
		.css('text-align', 'left');
	
	$('#spanInterfaceMasterViewportControlNew')
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
	
	$('#spanInterfaceMasterViewportControlAction')
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
				
	$('#spanInterfaceMasterViewportControlDashboard')
		.button({
				text: false,
				icons: {
					primary: "ui-icon-calculator"
				}})
		.click(function() 
		{
			interfaceMasterDashboardShow(this);
		});					
	
	$('#spanInterfaceMasterViewportControlSetupSwitch')
		.button({
					text: false,
					label: 'Setup your system.  Once finished click on this icon again.',
					icons: {
						primary: "ui-icon-gear"
					}})
		.css('font-size', '0.75em')			
		.click(function() 
		{
			interfaceMasterViewportSetup(this);
		});	
	
	$('#spanInterfaceMasterViewportControlHelpHome')
		.button({
				text: false,
				icons: {
					primary: "ui-icon-help"
				}})
		.click(function() 
		{
			if (ns1blankspace.helpURL)
			{	
				window.open(ns1blankspace.helpURL);
			}
			else
			{
				window.alert('No help available.  May be search the internet?')
			}	
		});		
	
	$('#divInterfaceMasterViewportLogonName').click(function(event)
	{
		interfaceControlUserOptionsShow(this);
	})

	$('#divInterfaceMasterViewportSpaceText').click(function(event)
	{
		interfaceControlSpaceOptionsShow(this);
	})
	
	if (gbShowBrowseBar)
	{
		$('#divInterfaceMasterViewportControlBrowse').html(interfaceMasterViewportBrowse());
	}
	else
	{
		$('#divInterfaceMasterViewportControlBrowse')
			.css('height', '1px')
			.css('border-width', '0px');
			
		$('#divInterfaceViewportControl')
			.css('top', '90px');
			
		$('#divInterfaceMain')
			.css('top', '90px');
	}
	
	$("#divInterfaceMasterViewport").touchwipe({
			wipeLeft: function() {interfaceMasterViewportDestination({instruction: 3});},
			wipeRight: function() {interfaceMasterViewportDestination({instruction: 2});},
			min_move_x: 35,
			min_move_y: 35,
			preventDefaultEvents: true
			});
	
	interfaceControlSetMasterViewport();
	
	if (gbReturnToLast) 
	{
		interfaceMasterViewportDestination({instruction: 8})
	}
	else
	{
		interfaceMasterHomeShow();
	}	
	
	$('#inputInterfaceMasterViewportControlSearch').focus();
	
}

function interfaceMasterReset()
{
	
	$('#inputInterfaceMasterViewportControlSearch').unbind('keyup');
	$('#inputInterfaceMasterViewportControlSearch').unbind('click');
	$('#spanInterfaceMasterViewportControlSearch').unbind('click');
	$('#spanInterfaceMasterViewportControlSearchOptions').unbind('click');
	$('#spanInterfaceMasterViewportControlNew').unbind('click');
	$('#spanInterfaceMasterViewportControlNewOptions').unbind('click');
	$('#spanInterfaceMasterViewportControlAction').unbind('click');
	$('#spanInterfaceMasterViewportControlActionOptions').unbind('click');
	$('#spanInterfaceMasterViewportControlSetup').unbind('click');
	$('#spanInterfaceMasterViewportControlSetupOptions').unbind('click');
	$('#spanInterfaceMasterViewportControlHelp').unbind('click');
	$('#spanInterfaceMasterViewportControlHelpOptions').unbind('click');
	$('td.interfaceViewportMasterControlBrowse').unbind('click');
	$('td.interfaceViewportMasterControlBrowseAll').unbind('click');
	$('#divInterfaceMasterViewportControlActionStatus').text('');
	if (giMessagingTimerID != 0) {clearInterval(giMessagingTimerID)};
	gbInputDetected = false;
	gsViewportMasterActionXHTML = '';
}

function interfaceMasterOptionsSource(sSource)
{
	if (sSource == undefined) {sSource = ''}
	$('#divInterfaceMasterViewportControlOptions').attr('onDemandSource', sSource);
}

function interfaceMasterHomeShow()
{	
	interfaceHomeViewport();
	
	if (gsHomeXHTML == '')
	{
		gsHomeXHTML = interfaceHome();
	}
	
	$('#divInterfaceMain').html(gsHomeXHTML)
	
	interfaceHomeShow();
}

function interfaceMasterHomeOptionsShow(oElement)
{

	var aHTML = [];
	var h = -1;
	
	if ($('#divInterfaceMasterViewportControlOptions').attr('onDemandSource') == oElement.id)
	{
		$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
		$('#divInterfaceMasterViewportControlOptions').attr('onDemandSource', '');
	}
	else
	{	
		$('#divInterfaceMasterViewportControlOptions').attr('onDemandSource', oElement.id);
		$('#divInterfaceMasterViewportControlOptions').html("&nbsp;");
		$('#divInterfaceMasterViewportControlOptions').show(giShowSpeedOptions);
		$('#divInterfaceMasterViewportControlOptions').offset({ top: $(oElement).offset().top + $(oElement).height(), left: $(oElement).offset().left });
		$('#divInterfaceMasterViewportControlOptions').html(interfaceHomeOptions());
		interfaceHomeOptionsBind();
	}	
	
}

function interfaceMasterViewportControlShow(oElement)
{

	var aHTML = [];
	var h = -1;

	if ($('#divInterfaceMasterViewportControlOptions').attr('onDemandSource') == oElement.id)
	{
		$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
		$('#divInterfaceMasterViewportControlOptions').attr('onDemandSource', '');
	}
	else
	{	
		if (gsViewportMasterControlXHTML == '')
		{
			gsViewportMasterControlXHTML = interfaceControlOptions();
		}

		$('#divInterfaceMasterViewportControlOptions').attr('onDemandSource', oElement.id);
		$('#divInterfaceMasterViewportControlOptions').html("&nbsp;");
		$('#divInterfaceMasterViewportControlOptions').show(giShowSpeedOptions);
		$('#divInterfaceMasterViewportControlOptions').offset({ top: $(oElement).offset().top + $(oElement).height(), left: $(oElement).offset().left });
		$('#divInterfaceMasterViewportControlOptions').html(gsViewportMasterControlXHTML);
			
		interfaceControlOptionsBind();
	}	
}

function interfaceMasterAttachments(aParam)
{

	var sXHTMLElementID;
	var iObject = giObject;
	var iObjectContext = giObjectContext;
	var bShowAdd = gbShowAdd;
	var iAttachmentType;
	var oActions = {add: true};
	var sHelpNotes;
	
	if (aParam != undefined)
	{
		if (aParam.object != undefined) {iObject = aParam.object}
		if (aParam.objectContext != undefined) {iObjectContext = aParam.objectContext}
		if (aParam.objectName != undefined) {sObjectName = aParam.objectName}
		if (aParam.showAdd != undefined) {bShowAdd = aParam.showAdd}
		if (aParam.attachmentType != undefined ) {iAttachmentType = aParam.attachmentType}
		if (aParam.xhtmlElementID != undefined ) {sXHTMLElementID = aParam.xhtmlElementID}
		if (aParam.actions != undefined) {oActions = aParam.actions}
		if (aParam.helpNotes != undefined) {sHelpNotes = aParam.helpNotes}
	}
	
	if (oActions.add)
	{
	
		var aHTML = [];
		var h = -1;	
					
		aHTML[++h] = '<table id="tableInterfaceMainAttachments" class="interfaceMain">' +
					'<tr id="trInterfaceMainAttachmentsRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainAttachmentsColumn1" class="interfaceMainColumn1Large">' +
					gsLoadingXHTML +
					'</td>' +
					'<td id="tdInterfaceMainAttachmentsColumn2" class="interfaceMainColumn2Action">' +
					'</td>' +
					'</tr>' +
					'</table>';					
			
		$('#' + sXHTMLElementID).html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;	
		
		aHTML[++h] = '<table id="tableInterfaceMainAttachmentsColumn2" class="interfaceMainColumn2">';
		
		aHTML[++h] = '<tr><td id="tdInterfaceMainAttachmentsAdd" class="interfaceMainAction">' +
						'<span id="spanInterfaceMainAttachmentsAdd">Add</span>' +
						'</td></tr>';
			
		if (sHelpNotes != undefined)
		{
			aHTML[++h] = '<tr><td id="tdInterfaceMainAttachmentsAddHelpNotes" class="interfaceMainAction">' +
						'<hr />' +
						'</td></tr>';
						
			aHTML[++h] = '<tr><td id="tdInterfaceMainAttachmentsAddHelpNotes" class="interfaceMainAction" style="font-size:0.75em;color:#404040;">' +
						sHelpNotes +
						'</td></tr>';
		}
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainAttachmentsColumn2').html(aHTML.join(''));
	
		$('#spanInterfaceMainAttachmentsAdd').button(
		{
			label: "Add"
		})
		.click(function() {
			 interfaceMasterAttachmentsAdd(aParam);
		})
	
		sXHTMLElementID = 'tdInterfaceMainAttachmentsColumn1';
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
		oSearch.getResults(function(data) {interfaceMasterAttachmentsShow(data, sXHTMLElementID)});
	}

}

function interfaceMasterAttachmentsShow(oResponse, sXHTMLElementID)
{	
	var aHTML = [];
	var h = -1;
		
	if (oResponse.data.rows.length == 0)
	{
		aHTML[++h] = '<table border="0" cellspacing="0" cellpadding="0" width="750" style="margin-top:15px; margin-bottom:15px;">';
		aHTML[++h] = '<tbody>'
		aHTML[++h] = '<tr class="interfaceAttachments">';
		aHTML[++h] = '<td class="interfaceMainRowNothing">No attachments.</td>';
		aHTML[++h] = '</tr>';
		
		$('#' + sXHTMLElementID).html(aHTML.join(''));
		$('#' + sXHTMLElementID).show(giShowSpeed);
	}
	else
	{
		aHTML[++h] = '<table class="interfaceMain"">';
		aHTML[++h] = '<tbody>'
	
		aHTML[++h] = '<tr class="interfaceMainCaption">';
		aHTML[++h] = '<td class="interfaceMainCaption">Filename</td>';
		aHTML[++h] = '<td class="interfaceMainCaption">Date</td>';
		aHTML[++h] = '<td class="interfaceMainCaption">&nbsp;</td>';
		aHTML[++h] = '</tr>';

		$.each(oResponse.data.rows, function()
		{
			aHTML[++h] = interfaceMasterAttachmentsShowRow(this);
		});
    	
		aHTML[++h] = '</tbody></table>';

		interfaceMasterPaginationList(
		   {
			xhtmlElementID: sXHTMLElementID,
			xhtmlContext: 'Attachment',
			xhtml: aHTML.join(''),
			showMore: (oResponse.morerows == "true"),
			columns: 'subject-actiondate',
			more: oResponse.moreid,
			rows: giReturnRows,
			functionSearch: interfaceMasterActions,
			functionShowRow: interfaceMasterAttachmentsShowRow,
			functionOpen: 'interfaceActionMasterViewport({showHome: false});interfaceActionSearch(this.id)',
			functionNewPage: 'interfaceMasterAttachmentsShowBind()',
			type: 'json'
		   }); 	
			
		interfaceMasterAttachmentsShowBind();
	}
	
}

function interfaceMasterAttachmentsShowRow(oRow)
{
	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<tr class="interfaceAttachments">';
	
	aHTML[++h] = '<td id="tdAttachment_filename-' + oRow.id + '" class="interfaceMainRow">' +
						'<a href="' + oRow.download + '">' + oRow.filename + '</a></td>';
						
	aHTML[++h] = '<td id="tdAttachment_date-' + oRow.id + '" class="interfaceMainRow">' + oRow.modifieddate + '</td>';
	
	aHTML[++h] = '<td id="tdAttachment_options_delete-' + oRow.attachment + 
					'" class="interfaceMainRowOptionsDelete interfaceMainRowOptionsDeleteAttachment">&nbsp;</td>';
	
	aHTML[++h] = '</tr>';
	
	return aHTML.join('');
}	

function interfaceMasterAttachmentsShowBind()
{
	$('.interfaceMainRowOptionsDeleteAttachment').button({
				text: false,
				 icons: {
					 primary: "ui-icon-close"
		}
	})
	.click(function() {
		interfaceMasterAttachmentsRemove(this.id)
	})
	.css('width', '15px')
	.css('height', '20px')	
}

function interfaceMasterAttachmentsRemove(sXHTMLElementID)
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
			dataType: 'text',
			success: function(data){$('#' + sXHTMLElementID).parent().fadeOut(500)}
		});
}

function interfaceMasterAttachmentsAdd(aParam)
{

	$('#tdInterfaceMainAttachmentsColumn1').html(interfaceMasterAttachmentsUpload(aParam));
	
	$('#spanInterfaceMainUpload').button(
		{
			label: "Upload"
		})
		.click(function() {
			 interfaceMasterAttachmentsUploadProcess();
		})
}

function interfaceMasterAttachmentsUploadProcess(aParam)
{
	gaParam = {};
	if (aParam != undefined) {gaParam = aParam};
	
	$('#spanInterfaceMainUploadStatus').html('Uploading..');
	var oForm = document.frmonDemandFileUpload;
  	oForm.submit();
 	interfaceMasterAttachmentsAddStatus();
	giOnDemandTimer = setInterval('interfaceMasterAttachmentsAddStatus()', 1000);
}

function interfaceMasterAttachmentsAddStatus()
{
	var oDivStatus = document.getElementById('divonDemandFileUploadStatus');
	var oFrame = document.getElementById('ifonDemandUpload');
	var sStatus;
	var sCurrentState;

	var fFunctionPostUpdate = interfaceMasterAttachments;
	
	if (gaParam != undefined)
	{
		if (gaParam.functionPostUpdate != undefined) {fFunctionPostUpdate = gaParam.functionPostUpdate}
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
		clearInterval(giOnDemandTimer);

		if (oDivStatus != null)
		{
			oDivStatus.setAttribute("class", "");
			oDivStatus.style.display = 'none';
		}
		
		$('#spanInterfaceMainUploadStatus').html('File Upload Complete...');
		fFunctionPostUpdate();
		
	}
}

function interfaceMasterAttachmentsUpload(aParam)
{

	var aHTML = [];
	var h = -1;

	var iMaxFiles = 1
	var iObject = giObject
	var lObjectContext = giObjectContext
	var sLabel = 'Select File';
	var sObjectName = '';
	var iAttachmentType = '';
	var bShowUpload = true;
	var sXHTML = '';
	var sHelpNotes;
	
	if (aParam != undefined)
	{
		if (aParam.maxFiles != undefined) {iMaxFiles = aParam.maxFiles}
		if (aParam.object != undefined || iObject == '') {iObject = aParam.object}
		if (aParam.objectName != undefined) {sObjectName = aParam.objectName}
		if (aParam.objectContext != undefined ) {lObjectContext = aParam.objectContext}
		if (aParam.label != undefined) {sLabel = aParam.label}
		if (aParam.attachmentType != undefined) {iAttachmentType = aParam.attachmentType}
		if (aParam.showUpload != undefined) {bShowUpload = aParam.showUpload}
		if (aParam.xhtml != undefined) {sXHTML = aParam.xhtml}
		if (aParam.helpNotes != undefined) {sHelpNotes = aParam.helpNotes}
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
		aHTML[++h] = '<div id="interfaceUploadLabel" class="interfaceMasterViewport">' + sLabel + '</div>';
	}	
		
	for (var i = 0; i < iMaxFiles; i++) 	
	{
		aHTML[++h] = '<div id="interfaceUploadFile' + i + '" class="interfaceMasterUpload">' +
						'<input class="interfaceMainUpload" type="file" name="oFile' + i + '" id="oFile' + i + '">' +
						'</div>';
	}
	
	if (bShowUpload)
	{
		aHTML[++h] = '<span id="spanInterfaceMainUpload" class="interfaceMainAction interfaceMainMarginTop"></span>';
		aHTML[++h] = '<br /><br /><span id="spanInterfaceMainUploadStatus" class="interfaceMasterUpload"></span>';
	}	
		
	aHTML[++h] = '<iframe style="display:none;" name="ifonDemandUpload" id="ifonDemandUpload" class="interfaceUpload" frameborder="0"></iframe>' +
					'</form>';
	
	return aHTML.join('');
	
}						

function interfaceMasterViewportBrowse()
{

	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<table id="tableInterfaceViewportMasterBrowse" class="interfaceViewportMasterBrowse">';
		
	aHTML[++h] = '<tr id="trInterfaceViewportMasterBrowse" class="interfaceViewportMasterBrowse">' +
						'<td id="tdInterfaceViewportMasterControlBrowse-#" class="interfaceViewportMasterControlBrowse">#</td>' +
						'<td id="tdInterfaceViewportMasterControlBrowse-A" class="interfaceViewportMasterControlBrowse">A</td>' +
						'<td id="tdInterfaceViewportMasterControlBrowse-B" class="interfaceViewportMasterControlBrowse">B</td>' +
						'<td id="tdInterfaceViewportMasterControlBrowse-C" class="interfaceViewportMasterControlBrowse">C</td>' +
						'<td id="tdInterfaceViewportMasterControlBrowse-D" class="interfaceViewportMasterControlBrowse">D</td>' +
						'<td id="tdInterfaceViewportMasterControlBrowse-E" class="interfaceViewportMasterControlBrowse">E</td>' +
						'<td id="tdInterfaceViewportMasterControlBrowse-F" class="interfaceViewportMasterControlBrowse">F</td>' +
						'<td id="tdInterfaceViewportMasterControlBrowse-G" class="interfaceViewportMasterControlBrowse">G</td>' +
						'<td id="tdInterfaceViewportMasterControlBrowse-H" class="interfaceViewportMasterControlBrowse">H</td>' +
						'<td id="tdInterfaceViewportMasterControlBrowse-I" class="interfaceViewportMasterControlBrowse">I</td>' +
						'<td id="tdInterfaceViewportMasterControlBrowse-J" class="interfaceViewportMasterControlBrowse">J</td>' +
						'<td id="tdInterfaceViewportMasterControlBrowse-K" class="interfaceViewportMasterControlBrowse">K</td>' +
						'<td id="tdInterfaceViewportMasterControlBrowse-L" class="interfaceViewportMasterControlBrowse">L</td>' +
						'<td id="tdInterfaceViewportMasterControlBrowse-M" class="interfaceViewportMasterControlBrowse">M</td>' +
						'<td id="tdInterfaceViewportMasterControlBrowse-N" class="interfaceViewportMasterControlBrowse">N</td>' +
						'<td id="tdInterfaceViewportMasterControlBrowse-O" class="interfaceViewportMasterControlBrowse">O</td>' +
						'<td id="tdInterfaceViewportMasterControlBrowse-P" class="interfaceViewportMasterControlBrowse">P</td>' +
						'<td id="tdInterfaceViewportMasterControlBrowse-Q" class="interfaceViewportMasterControlBrowse">Q</td>' +
						'<td id="tdInterfaceViewportMasterControlBrowse-R" class="interfaceViewportMasterControlBrowse">R</td>' +
						'<td id="tdInterfaceViewportMasterControlBrowse-S" class="interfaceViewportMasterControlBrowse">S</td>' +
						'<td id="tdInterfaceViewportMasterControlBrowse-T" class="interfaceViewportMasterControlBrowse">T</td>' +
						'<td id="tdInterfaceViewportMasterControlBrowse-U" class="interfaceViewportMasterControlBrowse">U</td>' +
						'<td id="tdInterfaceViewportMasterControlBrowse-V" class="interfaceViewportMasterControlBrowse">V</td>' +
						'<td id="tdInterfaceViewportMasterControlBrowse-W" class="interfaceViewportMasterControlBrowse">W</td>' +
						'<td id="tdInterfaceViewportMasterControlBrowse-X" class="interfaceViewportMasterControlBrowse">X</td>' +
						'<td id="tdInterfaceViewportMasterControlBrowse-Y" class="interfaceViewportMasterControlBrowse">Y</td>' +
						'<td id="tdInterfaceViewportMasterControlBrowse-Z" class="interfaceViewportMasterControlBrowse">Z</td>' +
						'<td id="tdInterfaceViewportMasterControlBrowse-" class="interfaceViewportMasterControlBrowseAll">ALL</td>' +
					'</tr>'
					
	aHTML[++h] = '</table>'				

	return aHTML.join('');
	
}

function interfaceMasterViewportSetup()
{

	var aHTML = [];
	var h = -1;
	
	$('#divInterfaceMasterViewportControlOptions').attr('onDemandSource', '');
	$('#divInterfaceMasterViewportControlSet').unbind('click');
	
	if (gbSetupViewport)
	{
		gbSetupViewport = false;
		
		$('#divInterfaceMasterViewportControlSet')
		.button(
		{
			icons: 
			{
				primary: "ui-icon-grip-dotted-vertical",
				secondary: "ui-icon-triangle-1-s"
			},
			label: gsViewportDefault
		})
		.click(function() 
		{
			interfaceMasterViewportControlShow(this);
		});
		
		interfaceControlSetMasterViewport();
		interfaceMasterHomeShow();
		
		interfaceMasterStatus("")	
	}
	else
	{
		gbSetupViewport = true;

		$('#divInterfaceMasterViewportControlSet')
		.button(
		{
			label: gsSetupViewportDefault
		})
		.click(function() 
		{
			interfaceMasterViewportControlSetupShow(this);
		});
	
		$('.divInterfaceViewportMain').html(interfaceControlSetupOptions);
		
		interfaceControlSetSetupMasterViewport();
		
		interfaceMasterStatus("Click icon again to return.")		
	}		
}

function interfaceMasterViewportControlSetupShow(oElement)
{

	var aHTML = [];
	var h = -1;
	
	if ($('#divInterfaceMasterViewportControlOptions').attr('onDemandSource') == oElement.id)
	{
		$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
		$('#divInterfaceMasterViewportControlOptions').attr('onDemandSource', '');
	}
	else
	{	
		$('#divInterfaceMasterViewportControlOptions').attr('onDemandSource', oElement.id);
		$('#divInterfaceMasterViewportControlOptions').html("&nbsp;");
		$('#divInterfaceMasterViewportControlOptions').show(giShowSpeedOptions);
		$('#divInterfaceMasterViewportControlOptions').offset({ top: $(oElement).offset().top + $(oElement).height(), left: $(oElement).offset().left });
		$('#divInterfaceMasterViewportControlOptions').html(interfaceControlSetupOptions());
			
		interfaceControlSetupOptionsBind();
	}	

}

function interfaceMasterHelpShow()
{
	if (interfaceControlHelpURL() != '')
	{
		window.open(interfaceControlHelpURL());
	}
	else	
	{
		$('#divInterfaceMain').html(interfaceHelp());
	}	
}

function interfaceMasterMainViewportShow(asDivID, bRefresh)
{
	if (bRefresh == undefined) {bRefresh = false}

	$('#divInterfaceMasterViewportControlOptions').hide();
	$('.divInterfaceViewportMain').hide();
	$(asDivID).show(giShowSpeed);
	gsLastShowDivID = asDivID;
	if ($(asDivID).html() == '' || bRefresh)
	{
		$(asDivID).attr('onDemandLoading', '1');
		$(asDivID).html(gsLoadingXHTML);
	}	
}


function interfaceMasterMainViewportHideLoading(asDivID)
{
	if (asDivID == undefined) {asDivID = gsLastShowDivID};

	$(asDivID).removeClass("loading");
}

function interfaceMasterStatus(sStatus)
{	
	$('#divInterfaceMasterViewportControlActionStatus').html('<div style="position:relative;width:100%;height:35px;width:180px;">' +
			'<div style="display:table-cell; vertical-align:bottom; padding-bottom:5px; height:25px;">' + sStatus + '</div></div>');
}

function interfaceMasterStatusWorking()
{	
	$('#divInterfaceMasterViewportControlActionStatus').html('<div style="position:relative;width:100%;height:35px;width:180px;">' +
			'<div style="display:table-cell; vertical-align:bottom; padding-bottom:5px; height:25px;">' + gsLoadingSmallXHTML + '</div></div>');
}

function interfaceMasterError(sError)
{
	if (sError == undefined) {sError = 'Error!'};
	
	$('#divInterfaceMasterViewportControlActionStatus').html('<div style="position:relative;width:100%;height:35px;width:180px;">' +
			'<div style="display:table-cell; vertical-align:bottom; padding:5px; height:25px; color:white; background-color:red;">' + sError + '</div></div>');
}


function interfaceMasterElementEditStart(sElementId)
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
		interfaceMasterElementEditStop(sElementId);
	});
	
}

function interfaceMasterElementEditStop(sElementId)
{
	
	interfaceMasterElementEditSave(sElementId);
	
	var aSearch = sElementId.split('-');
	var sHTML = $('#' + sElementId.replace('td', 'input')).val();

	$('#' + sElementId).html(sHTML);

}

function interfaceMasterElementEditSave(sElementId)
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
		success: interfaceMasterStatus('Saved')
	});
		
}

function interfaceMasterOptionsSetPosition(sElementId, iOffsetTop, iOffsetLeft)
{
	var oElement = $('#' + sElementId)
	
	if (iOffsetTop == undefined) {iOffsetTop = 5}
	if (iOffsetLeft == undefined) {iOffsetLeft = 0}
	
	$('#divInterfaceMasterViewportControlOptions').html('');
	$('#divInterfaceMasterViewportControlOptions').show();
	$('#divInterfaceMasterViewportControlOptions').offset({ top: $(oElement).offset().top + $(oElement).height() + iOffsetTop, left: $(oElement).offset().left + iOffsetLeft});
}

function interfaceMasterOptionsPosition(aParam)
{

	var sXHTMLElementID = '';
	var iLeftOffset = 0;
	var iTopOffset = 7;
	
	if (aParam != undefined)
	{
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
		if (aParam.leftOffset != undefined) {iLeftOffset = aParam.leftOffset}
		if (aParam.topOffset != undefined) {iTopOffset = aParam.topOffset}
	}
	
	var oElement = $('#' + sXHTMLElementID)
	
	$('#divInterfaceMasterViewportControlOptions').html('');
	$('#divInterfaceMasterViewportControlOptions').show();
	$('#divInterfaceMasterViewportControlOptions').offset({ top: $(oElement).offset().top + $(oElement).height() + iTopOffset, left: $(oElement).offset().left + iLeftOffset});
}


function interfaceMasterElementOptionsSearch(aParam, oResponse)
{
	var sXHTMLElementID;
	var sXHTMLInputElementID;
	var iXHTMLElementContextID;
	var sXHTMLParentInputElementID;
	var iSource = giSearchSource_TEXT_INPUT;
	var iMinimumLength = 1;
	var iMaximumColumns = 1;
	var sMethod;
	var sSearchText = '';
	var sColumns;
	var iColumn = 0;
		
	if (aParam != undefined)
	{
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
		if (aParam.xhtmlInputElementID != undefined) {sXHTMLInputElementID = aParam.xhtmlInputElementID}
		if (aParam.xhtmlParentInputElementID != undefined) {sXHTMLParentInputElementID = aParam.xhtmlParentInputElementID}
		if (aParam.source != undefined) {iSource = aParam.source}
		if (aParam.minimumLength != undefined) {iMinimumLength = aParam.minimumLength}
		if (aParam.method != undefined) {sMethod = aParam.method}
		if (aParam.searchText != undefined) {sSearchText = aParam.searchText}
		if (aParam.sColumns != undefined) {sColumns = aParam.columns}
	}
	
	if (sXHTMLElementID != undefined)
	{
		var aXHTMLElementID = sXHTMLElementID.split('-');
		sXHTMLInputElementID = aXHTMLElementID[0];
		iXHTMLElementContextID = aXHTMLElementID[1];
	
		$.extend(true, aParam, {xhtmlInputElementID: sXHTMLInputElementID});
	
		if (sMethod == undefined)
		{
			sMethod = $('#' + sXHTMLInputElementID).attr("onDemandMethod");
			if (sMethod == undefined) {sMethod = $('#' + sXHTMLInputElementID).attr("data-method")}	
		}
		
		if (sColumns == undefined)
		{
			sColumns = $('#' + sXHTMLInputElementID).attr("onDemandColumns");
			if (sColumns == undefined) {sColumns = $('#' + sXHTMLInputElementID).attr("data-columns")}
			if (sColumns != undefined) {$.extend(true, aParam, {columns: sColumns})};	
		}
		
		if (sXHTMLParentInputElementID == undefined)
		{
			sXHTMLParentInputElementID = $('#' + sXHTMLInputElementID).attr("data-parent")
			if (sXHTMLParentInputElementID != undefined) {$.extend(true, aParam, {xhtmlParentInputElementID: sXHTMLParentInputElementID})};	
		}
	}	
	
	if (iXHTMLElementContextID != undefined)
	{
		$('#' + sXHTMLInputElementID).val($('#' + sXHTMLElementID).html())
		$('#' + sXHTMLInputElementID).attr("onDemandID", iXHTMLElementContextID)
		$('#' + sXHTMLInputElementID).attr("data-id", iXHTMLElementContextID)
		$('#divInterfaceMasterViewportControlOptions').hide();
	}
	else
	{
		if (oResponse == undefined)
		{
			interfaceMasterOptionsSetPosition(sXHTMLInputElementID);
			
			if (sColumns == undefined) {sColumns = 'title'};
			
			if (sSearchText == '' && iSource == giSearchSource_TEXT_INPUT)
			{
				sSearchText = $('#' + sXHTMLInputElementID).val();
			}	
		
			if (sSearchText.length >= iMinimumLength || iSource == giSearchSource_ALL)
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
				oSearch.getResults(function(data){interfaceMasterElementOptionsSearch(aParam, data)});
			}
		}	
		else
		{
			var aColumns = sColumns.split('-');
			var aHTML = [];
			var h = -1;
			
			if (oResponse.data.rows.length == 0)
			{
				$('#divInterfaceMasterViewportControlOptions').hide();
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
	
				$('#divInterfaceMasterViewportControlOptions').show(giShowSpeedOptions);
				$('#divInterfaceMasterViewportControlOptions').html(aHTML.join(''));
			
				$('td.interfaceSearch').click(function(event)
				{
					$('#divInterfaceMasterViewportControlOptions').hide(200);
					$.extend(true, aParam, {xhtmlElementID: event.target.id})
					interfaceMasterElementOptionsSearch(aParam);
				});
			}	
		}
	}		
}

function interfaceMasterSearchStart(sElementId)
{
	sElementId = 'divInterfaceMasterViewportControlSearchStatus';
	$('#' + sElementId).show();
	$('#' + sElementId).html(gsLoadingSmallXHTML);
}

function interfaceMasterSearchStop(sElementId)
{
	sElementId = 'divInterfaceMasterViewportControlSearchStatus';
	$('#' + sElementId).hide()
	$('#' + sElementId).html('');
}

function interfaceMasterSave(sParam, sData, sSuccessMessage)
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
		success: function(data) { interfaceMasterSaveSuccess(data, sSuccessMessage)}
	});
}

function interfaceMasterSaveSuccess(data, sSuccessMessage)
{
	oResponse = data;
	
	if (oResponse.status == 'OK')
	{
		interfaceMasterStatus(sSuccessMessage);
		giObjectSaveId =  oResponse.id;
	}
	else
	{
		interfaceMasterStatus(oResponse.error.errornotes);
		giObjectSaveId =  -1;
		return '';
	}
}

function interfaceMasterJSONGetData(aoJSON, asElement, aiRow)
{
	aoJSON = (aoJSON == undefined)?'':aoJSON;
	asElement = (asElement == undefined)?'':asElement;
	aiRow = (aiRow == undefined)?0:aiRow;
	
	if (aoJSON.length == 0) return '';
	
	if (asElement == '' || aiRow < 0) return '';
	
	if (aoJSON.data.rows.length > 0)
	{	return eval( 'aoJSON.data.rows[' + aiRow + '].' + asElement);	}
	else
	{	return '';}
}

function interfaceMasterTF2OnOff(bValue)
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
	
}

function interfaceMasterOnOff2TF(sValue)
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
	
}

function interfaceMasterTF2YN(bValue)
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
	
}

function interfaceMasterYN2TF(sValue)
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

function interfaceMasterFormatSave(sValue)
{

	if (sValue == undefined || sValue == 'undefined') { sValue = ''; }
	
	return encodeURIComponent(sValue)

}

function interfaceMasterAddressSearch(sXHTMLElementID, aParam)
{
	
	var aSearch = sXHTMLElementID.split('-');
	var sElementId = aSearch[0];
	var lElementSearchContext = aSearch[1];	
	
	if (lElementSearchContext != undefined)
	{
		$('#' + gsLastShowDivID).val(aSearch[2])
		$('#' + gsLastShowDivID.replace('Suburb', 'State')).val(aSearch[3])
		$('#' + gsLastShowDivID.replace('Suburb', 'PostCode')).val(aSearch[4])
		$('#divInterfaceMasterViewportControlOptions').hide();
	}
	else
	{
		var sParam = '/ondemand/core/?method=CORE_ADDRESS_SEARCH&rf=XML';
		var sData = '';
		
		interfaceMasterOptionsSetPosition(sXHTMLElementID)
		
		//sData += '&postpcde=' + encodeURIComponent((aParam.postcode==undefined?'':aParam.postcode));
		
		sData += 'suburblike=' + encodeURIComponent($('#' + gsLastShowDivID).val());

		$.ajax(
		{
			type: 'POST',
			url: sParam,
			data: sData,
			dataType: 'json',
			success: interfaceMasterAddressSearchShow
		});
	}
}

function interfaceMasterAddressSearchShow(oResponse)
{
	var iColumn = 0;
	var aHTML = [];
	var h = -1;
	var	iMaximumColumns = 1;
			
	if (oResponse.data.rows.length == 0)
	{
		$('#divInterfaceMasterViewportControlOptions').hide();
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
	
		$('#divInterfaceMasterViewportControlOptions').html(aHTML.join(''));
		$('#divInterfaceMasterViewportControlOptions').show(giShowSpeedOptions);
		
		$('td.interfaceSearch').click(function(event)
		{
			$('#divInterfaceMasterViewportControlOptions').hide(200);
			interfaceMasterAddressSearch(event.target.id);
		});
	}	
			
}

function interfaceMasterContactEmailSearch(sXHTMLElementID, aParam)
{

	var iSource = giSearchSource_TEXT_INPUT;
	var iMinimumLength = 1;
	var sMethod;
	var sSearchText;
	var iMaximumColumns = 1;
	var bEmailOnly = false;
	var sParentSearchId;
	var sSetXHTMLElementId;
	
	if (aParam != undefined)
	{
		if (aParam.source != undefined) {iSource = aParam.source}
		if (aParam.minimumLength != undefined) {iMinimumLength = aParam.minimumLength}
		if (aParam.method != undefined) {sMethod = aParam.method}
		if (aParam.searchText != undefined) {sSearchText = aParam.searchText}
		if (aParam.maximumColumns != undefined) {iMaximumColumns = aParam.maximumColumns}
		if (aParam.emailOnly != undefined) {bEmailOnly = aParam.emailOnly}
		if (aParam.contactBusiness != undefined) {sParentSearchId = aParam.contactBusiness}
		if (aParam.setXHTMLElementID != undefined) {sSetXHTMLElementId = aParam.setXHTMLElementID}
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
		$('#divInterfaceMasterViewportControlOptions').hide();
	}
	else
	{
	
		interfaceMasterOptionsSetPosition(sXHTMLElementID);
	
		if (sSearchText == undefined) {sSearchText = ''};
			
		if (sSearchText == '' && iSource == giSearchSource_TEXT_INPUT)
		{
			sSearchText = $('#' + sElementId).val();
		}	
		
		if (sSearchText.length >= iMinimumLength || iSource == giSearchSource_ALL)
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
		
			oSearch.getResults(function (data) {interfaceMasterContactEmailSearchShow(data, sElementId, aParam)}) 
						
		}
	};	
}

function interfaceMasterContactEmailSearchShow(oResponse, sElementId, aParam)
{

	var iColumn = 0;
	var aHTML = [];
	var h = -1;
	var	iMaximumColumns = 1;
	var sElementIDSuffix;
	
	if (oResponse.data.rows.length == 0)
	{
		$('#divInterfaceMasterViewportControlOptions').hide();
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
	
		$('#divInterfaceMasterViewportControlOptions').html(interfaceMasterPagination(
			{
				html: aHTML.join(''),
				more: (oResponse.morerows == 'true'),
				headerClass: 'interfaceSearchHeaderLarge',
				footerClass: 'interfaceSearchFooterLarge'
			})	
		);
	
		$('#divInterfaceMasterViewportControlOptions').show(giShowSpeedOptions);
		
		$('td.interfaceSearch').click(function(event)
		{
			$('#divInterfaceMasterViewportControlOptions').hide(200);
			interfaceMasterContactEmailSearch(event.target.id, aParam);
		});
		
		interfaceMasterPaginationBind(
		{
			columns: 'firstname-surname-email-contactbusinesstext',
			idColumns: 'firstname-surname-contactbusiness-contactbusinesstext-email',
			more: oResponse.moreid, 
			bodyClass: 'interfaceSearchLarge',
			functionSearch: interfaceMasterContactEmailSearch,
			xhtmlElementId: sElementId,
			idSeperator: '---',
			type: 'JSON'
		})	
	}	
			
}

function interfaceMasterPagination(aParam)
{

	var aHTML = [];
	var h = -1;
	
	var sHTML = '';
	var bMore = false;

	if (aParam != undefined)
	{
		if (aParam.html != undefined) {sHTML = aParam.html}
		if (aParam.more != undefined) {bMore = aParam.more}
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
		
	aHTML[++h] = '<div id="divInterfaceMasterSearch-0" class="interfaceMasterSearchPage">';
				
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
		
}

function interfaceMasterPaginationBind(aParam)
{
	var fFunctionMore = interfaceMasterPaginationShowMore;
	var iMore;
	
	if (aParam != undefined)
	{
		if (aParam.functionMore != undefined) {fFunctionMore = aParam.functionMore}
		if (aParam.more != undefined) {iMore = aParam.more}
	}
	
	$('#spanInterfaceSearchHeaderClose').button( {
				text: false,
				icons: {
					primary: "ui-icon-close"
				}
			})
			.click(function() {
				$('#divInterfaceMasterViewportControlOptions').slideUp(1000);
				$('#divInterfaceMasterViewportControlOptions').html('&nbsp;');
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
				(aParam != undefined?aParam.more = iMore:aParam = {more: iMore})
				fFunctionMore(aParam);
			})
			.css('width', '15px')
			.css('height', '16px')
		
	$('.interfaceSearchFooterPage').click(function(event)
	{
		interfaceMasterPaginationShowPage(this.id);
	});
}

function interfaceMasterPaginationShowMore(aParam, oResponse)
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
	
	if (aParam != undefined)
	{
		if (aParam.more != undefined) {iMore = aParam.more}
		if (aParam.startRow != undefined) {iStartRow = aParam.startRow}
		if (aParam.rows != undefined) {iRows = aParam.rows}
		if (aParam.xhtmlElementId != undefined) {sXHTMLElementID = aParam.xhtmlElementId}
		if (aParam.columns != undefined) {sColumns = aParam.columns}
		if (aParam.idColumns != undefined) {sIDColumns = aParam.idColumns}
		if (aParam.functionSearch != undefined) {fFunctionSearch = aParam.functionSearch}
		if (aParam.functionClass != undefined) {fFunctionClass = aParam.functionClass}
		if (aParam.idAdditional != undefined) {sIdAdditional = aParam.idAdditional}
		if (aParam.bodyClass != undefined) {sBodyClass = aParam.bodyClass}
		if (aParam.idSeperator != undefined) {sIDSeperator = aParam.idSeperator}
		
	}
	
	$('#tdInterfaceSearchFooterMoreStatus').html(gsLoadingSmallXHTML);
	
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
				success: function(data){interfaceMasterPaginationShowMore(aParam, data)}
			});
		}
		else
		{	
			var aHTML = [];
			var h = -1;
		
			if ($('#divInterfaceMasterSearch-' + iStartRow).length == 0)
			{
				aHTML[++h] = '<div id="divInterfaceMasterSearch-' + iStartRow + '" class="interfaceMasterSearchPage">';
			
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
				
				aParam.startRow = iStartRow + iRows;	
					
				$('#tdInterfaceSearchFooterMore').unbind('click');
					
				$('#tdInterfaceSearchFooterMore').click(function(event)
				{
					interfaceAuditSearchAdd(aParam);
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
				
				$('.interfaceMasterSearchPage').hide();
				$('.interfaceMasterSearchPage:last').after(aHTML.join(''));
				
				$('td.interfaceSearch').click(function(event)
				{
					$('#divInterfaceMasterViewportControlOptions').html('&nbsp;');
					$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions)
					fFunctionSearch(event.target.id, {source: 1});
				});
						
				$('#tdInterfaceSearchFooterPage').append(
						' | <span id="spanInterfaceSearchFooterPage-' + iStartRow + '" class="interfaceSearchFooterPage">' +
							(parseInt(iStartRow/iRows) + 1) + '</span>');
							
				$('#tdInterfaceSearchFooterMoreStatus').html('&nbsp;');			
			}
		
			$('.interfaceSearchFooterPage').click(function(event)
			{
				interfaceMasterPaginationShowPage(this.id);
			});
		
		}
	}
}	

function interfaceMasterPaginationShowPage(sXHTMLElementID)
{

	var aElement = sXHTMLElementID.split('-');
	
	$('.interfaceMasterSearchPage').hide();
	$('#divInterfaceMasterSearch-' + aElement[1]).show();
	
}

function interfaceMasterActions(aParam)
{

	var sXHTMLElementID;
	var iObject = giObject;
	var iObjectContext = giObjectContext;
	var bShowAdd = gbShowAdd;
	var iActionType = '';
	var oActions = {add: true};
	var iContactBusiness;
	var iContactPerson;
	var sContactBusinessText;
	var sContactPersonText;
	
	if (aParam != undefined)
	{
		if (aParam.object != undefined) {iObject = aParam.object}
		if (aParam.objectContext != undefined) {iObjectContext = aParam.objectContext}
		if (aParam.objectName != undefined) {sObjectName = aParam.objectName}
		if (aParam.showAdd != undefined) {bShowAdd = aParam.showAdd}
		if (aParam.actionType != undefined ) {iActionType = aParam.actionType}
		if (aParam.xhtmlElementID != undefined ) {sXHTMLElementID = aParam.xhtmlElementID}
		if (aParam.actions != undefined) {oActions = aParam.actions}
		if (aParam.contactBusiness != undefined) {iContactBusiness = aParam.contactBusiness}
		if (aParam.contactPerson != undefined) {iContactPerson = aParam.contactPerson}
		if (aParam.contactBusinessText != undefined) {sContactBusinessText = aParam.contactBusinessText}
		if (aParam.contactPersonText != undefined) {sContactPersonText = aParam.contactPersonText}
	}	
	else
	{
		aParam = {};
	}
	
	if (oActions.add)
	{
	
		var aHTML = [];
		var h = -1;	
					
		aHTML[++h] = '<table id="tableInterfaceMainActions" class="interfaceMain">' +
					'<tr id="trInterfaceMainActionsRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainActionsColumn1" class="interfaceMainColumn1Large">' +
					gsLoadingXHTML +
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
	
		aParam.xhtmlElementID = 'spanInterfaceMainActionsAdd';
		aParam.offsetHeight = -30;
		aParam.offsetLeft = -305;
		
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
			url: '/ondemand/action/?rows=' + giReturnRows + '&' + sParam,
			dataType: 'json',
			success: function(data) {interfaceMasterActionsShow(data, sXHTMLElementID, aParam)}
		});	
	}

}

function interfaceMasterActionsShow(oResponse, sXHTMLElementID, aParam)
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
		$('#' + sXHTMLElementID).show(giShowSpeed);
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
		
		interfaceMasterPaginationList(
		   {
			xhtmlElementID: sXHTMLElementID,
			xhtmlContext: 'Action',
			xhtml: aHTML.join(''),
			showMore: (oResponse.morerows == 'true'),
			columns: 'subject-actiondate',
			more: this.moreid,
			rows: giReturnRows,
			functionSearch: interfaceMasterActions,
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

function interfaceMasterConfirm(aParam)
{

	var aHTML = [];
	var sTitle = '';
	
	if (aParam != undefined)
	{
		if (aParam.html != undefined) {aHTML = aParam.html}
		if (aParam.title != undefined) {sTitle = aParam.title}
	}	
	
	$('#divInterfaceDialog').html(aHTML.join(''));
	
	$('#divInterfaceDialog').dialog(
		{
			resizable: false,
			modal: true,
			title: sTitle,
			buttons: 
			{
				"Ok": function() 
				{
					$( this ).dialog( "close" );
				}
			}
		});
}

function interfaceMasterActionAddShow(aParam, oResponse)
{
	var iActionID = -1;
	var dStartDate = new Date();
	var dEndDate = dStartDate;
	var sXHTMLElementID = 'spanInterfaceMainActionsAdd';
	var iOffsetHeight = 5;
	var iOffsetLeft = 0;
	
	if (aParam != undefined)
	{
		if (aParam.actionID != undefined) {iActionID = aParam.actionID};
		if (aParam.startDate != undefined) {dStartDate = aParam.startDate};
		if (aParam.endDate != undefined) {dEndDate = aParam.endDate};
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID};
		if (aParam.offsetHeight != undefined) {iOffsetHeight = aParam.offsetHeight};
		if (aParam.offsetLeft != undefined) {iOffsetLeft = aParam.offsetLeft};
	}	

	if ($('#divInterfaceMasterDialog').attr('onDemandSource') == sXHTMLElementID)
	{
		$('#divInterfaceMasterDialog').hide("slide", { direction: "right" }, 500);
		$('#divInterfaceMasterDialog').attr('onDemandSource', '');
	}
	else
	{
		$('#divInterfaceMasterDialog').attr('onDemandSource', sXHTMLElementID);
	
		if (iActionID != -1 && oResponse == undefined)
		{
			sParam = 'method=ACTION_SEARCH&rf=XML&contactperson=ALL&select=' + iActionID;
		
			$.ajax(
			{
				type: 'GET',
				url: '/ondemand/action/?' + sParam,
				dataType: 'json',
				success: function(data) {interfaceMasterActionAddShow(aParam, data)}
			});	
		}
		else
		{
			var aHTML = [];
			var h = -1;
			
			aHTML[++h] = '<table id="tableInterfaceMasterActionAdd" class="interfaceDialogMedium">';
			
			aHTML[++h] = '<tr id="trInterfaceActionCalendarAddSubjectValue" class="interfaceMainText">' +
								'<td id="tdInterfaceActionCalendarAddSubjectValue" class="interfaceMainText">' +
								'<input id="inputMasterActionAddSubject" class="inputInterfaceMainText';
								
			if (iActionID == -1)
			{	
				aHTML[++h] = ' interfaceMasterWatermark" value="Subject">';
			}
			else
			{
				aHTML[++h] = '">'
			}
			
			aHTML[++h] = '</td></tr>';
			
			aHTML[++h] = '<tr><td id="tdInterfaceMasterActionAddDescriptionValue" class="interfaceMain">' +
								'<textarea rows="5" cols="35" id="inputInterfaceMasterActionAddDescription" class="inputInterfaceMainTextMultiSmall';

			if (iActionID == -1)
			{	
				aHTML[++h] = ' interfaceMasterWatermark">Add more text here, if required.</textarea>';
			}
			else
			{
				aHTML[++h] = '"></textarea>'
			}

			aHTML[++h] = '</td></tr>';

			aHTML[++h] = '<tr id="trInterfaceMasterActionAddBusiness" class="interfaceMain">' +
								'<td id="tdInterfaceMasterActionAddBusiness" class="interfaceMain">' +
								'Business' +
								'</td></tr>' +
								'<tr id="trInterfaceMasterActionAddBusinessValue" class="interfaceMainSelect">' +
								'<td id="tdInterfaceMasterActionAddBusinessValue" class="interfaceMainSelect">' +
								'<input id="inputInterfaceMasterActionAddBusiness" class="inputInterfaceMainSelect"' +
									' onDemandMethod="/ondemand/contact/?method=CONTACT_BUSINESS_SEARCH"' +
									' onDemandColumns="tradename">' +
								'</td></tr>';
								
			
			aHTML[++h] = '<tr id="trInterfaceMasterActionAddPerson" class="interfaceMain">' +
								'<td id="tdInterfaceMasterActionAddPerson" class="interfaceMain">' +
								'Person' +
								'</td></tr>' +
								'<tr id="trInterfaceMasterActionAddPersonValue" class="interfaceMainSelect">' +
								'<td id="tdInterfaceMasterActionAddPersonValue" class="interfaceMainSelect">' +
								'<input id="inputInterfaceMasterActionAddPerson" class="inputInterfaceMainSelectContact"' +
									' onDemandMethod="/ondemand/contact/?method=CONTACT_PERSON_SEARCH"' +
									' onDemandParent="inputInterfaceMasterActionAddBusiness">' +
								'</td></tr>';									
								
								
			aHTML[++h] = '<tr><td id="tdInterfaceMasterActionAddHighPriority" class="interfaceMain">' +
								'<input type="checkbox" id="inputInterfaceMasterActionAddNoteHighPriority"/>&nbsp;High Priority?<td></tr>';
								
				
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
			
			$('#divInterfaceMasterDialog').html('');
			$('#divInterfaceMasterDialog').show();
			$('#divInterfaceMasterDialog').offset(
				{
					top: $(oElement).offset().top + $(oElement).height() + iOffsetHeight,
					left: $(oElement).offset().left + iOffsetLeft
				});
			$('#divInterfaceMasterDialog').html(aHTML.join(''));
			
			$('#spanCancel').button(
				{
					text: false,
					 icons: {
						 primary: "ui-icon-close"
					}
				})
				.click(function() {
					$('#divInterfaceMasterDialog').slideUp(500);
					$('#divInterfaceMasterDialog').html('');
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
					
					$('#divInterfaceMasterDialog').slideUp(500);
					$('#divInterfaceMasterDialog').html('');

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
}

function interfaceMasterFormatXHTML(sXHTML)
{
	var sTmp = sXHTML;
	
	sTmp = sTmp.replace(/&amp;/g, '&')
	sTmp = sTmp.replace(/&lt;/g, '<')
	sTmp = sTmp.replace(/&gt;/g, '>')
	sTmp = sTmp.replace(/&#45;/g, '-')
	sTmp = sTmp.replace(/&#64;/g, '@')
	sTmp = sTmp.replace(/&#47;/g, '/')
	sTmp = sTmp.replace(/&quot;/g, '"')
	sTmp = sTmp.replace(/&#39;/g, '\'')
	
	return sTmp
}

function interfaceMasterViewportActionShow(oElement, sActionXHTML, sFunctionActionBind)
{

	var aHTML = [];
	var h = -1;

	if ($('#divInterfaceMasterViewportControlOptions').attr('onDemandSource') == oElement.id)
	{
		$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
		$('#divInterfaceMasterViewportControlOptions').attr('onDemandSource', '');
	}
	else
	{	
		if (gsViewportMasterControlXHTML == '')
		{
			gsViewportMasterControlXHTML = interfaceControlOptions();
		}

		$('#divInterfaceMasterViewportControlOptions').attr('onDemandSource', oElement.id);
		$('#divInterfaceMasterViewportControlOptions').html("&nbsp;");
		$('#divInterfaceMasterViewportControlOptions').show(giShowSpeedOptions);
		$('#divInterfaceMasterViewportControlOptions').offset({ top: $(oElement).offset().top + $(oElement).height(), left: $(oElement).offset().left });
		$('#divInterfaceMasterViewportControlOptions').html(sActionXHTML);
		
		if (sFunctionActionBind != undefined)
			{eval(sFunctionActionBind)}
	}	
}

function interfaceMasterPaginationList(aParam)
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
	
	if (aParam != undefined)
	{
		if (aParam.xhtml != undefined) {sHTML = aParam.xhtml}
		if (aParam.showMore != undefined) {bMore = aParam.showMore}
		if (aParam.more != undefined) {iMore = aParam.more}
		if (aParam.startRow != undefined) {iStartRow = aParam.startRow}
		if (aParam.rows != undefined) {iRows = aParam.rows}
		if (aParam.showList != undefined) {bShowList = aParam.showList}
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
		if (aParam.xhtmlContext != undefined) {sXHTMLContext = aParam.xhtmlContext}
	}

	aParam.xhtmlFirstRow = $('tr:first', sHTML).html();
	
	if (bMore)
	{
		aHTML[++h] = '<table><tr>';
		//aHTML[++h] = '<td style="width:1px;" class="interfaceMessagingSubHeader interfaceMasterPaginationList" id="tdInterfaceMasterPaginationList' + sXHTMLContext + '-"></td>';
		aHTML[++h] = '<td style="width:5px;cursor:pointer;" class="interfaceMessagingSubHeader interfaceMasterPaginationList' + sXHTMLContext + '"' +
							' id="td' + sXHTMLContext + 'InterfaceMasterPaginationList-0" rowStart="0">1</td>';
		aHTML[++h] = '<td></td></tr></table>';
	}
		
	aHTML[++h] = '<div id="div' + sXHTMLContext + 'InterfaceMasterPaginationList-0" class="interfaceMasterPaginationListPage' + sXHTMLContext + '">';
	aHTML[++h] = sHTML;
	aHTML[++h] = '</div>';

	$('#' + sXHTMLElementID).html(aHTML.join(''));
	if (bShowList) {$('#' + sXHTMLElementID).show(giShowSpeed)};
		
	if (bMore)
	{
		var sHTML = '<td style="width:5px;cursor:pointer;" class="interfaceMessagingSubHeader interfaceMasterPaginationList' + sXHTMLContext + 
							'" id="td' + sXHTMLContext + 'InterfaceMasterPaginationList-' +
							(iStartRow + iRows - 1) + '" rowStart="' +
							(iStartRow + iRows - 1) + '">' + 'more...' + '</td>';
						
		$('#td' + sXHTMLContext + 'InterfaceMasterPaginationList-' + (iStartRow)).after(sHTML);
	
		$('#td' + sXHTMLContext + 'InterfaceMasterPaginationList-' + (iStartRow + iRows - 1)).click(function(event)
		{
			var sID = event.target.id;
			var sStart = $('#' + sID).attr('rowStart');
			$('#' + sID).html(gsLoadingSmallXHTML);
			if (aParam != undefined) {aParam.more = iMore;aParam.startRow = sStart}else{aParam = {more: iMore, startRow: sStart}};
			interfaceMasterPaginationListShowMore(aParam);
		});
	}
	
	$('.interfaceMasterPaginationListPage' + sXHTMLContext).click(function(event)
	{
		interfaceMasterPaginationListShowPage(this.id, sXHTMLContext);
	});
		
}

function interfaceMasterPaginationListShowMore(aParam, oData)
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
	
	if (aParam != undefined)
	{
		if (aParam.more != undefined) {iMore = aParam.more}
		if (aParam.startRow != undefined) {iStartRow = aParam.startRow}
		if (aParam.rows != undefined) {iRows = aParam.rows}
		if (aParam.xhtmlElementId != undefined) {sXHTMLElementID = aParam.xhtmlElementId}
		if (aParam.columns != undefined) {sColumns = aParam.columns}
		if (aParam.idColumns != undefined) {sIDColumns = aParam.idColumns}
		if (aParam.functionOpen != undefined) {sFunctionOpen = aParam.functionOpen}
		if (aParam.functionClass != undefined) {fFunctionClass = aParam.functionClass}
		if (aParam.functionShowRow != undefined) {fFunctionShowRow = aParam.functionShowRow}
		if (aParam.idAdditional != undefined) {sIdAdditional = aParam.idAdditional}
		if (aParam.bodyClass != undefined) {sBodyClass = aParam.bodyClass}
		if (aParam.idSeperator != undefined) {sIDSeperator = aParam.idSeperator}
		if (aParam.xhtmlFirstRow != undefined) {sXHTMLlFirstRow = aParam.xhtmlFirstRow}
		if (aParam.functionNewPage != undefined) {sFunctionNewPage = aParam.functionNewPage}
		if (aParam.xhtmlContext != undefined) {sXHTMLContext = aParam.xhtmlContext}
		if (aParam.type != undefined) {sType = aParam.type}
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
				success: function(data){interfaceMasterPaginationListShowMore(aParam, data)}
			});
		}
		else
		{
		
			var aHTML = [];
			var h = -1;
		
			if ($('#div' + sXHTMLContext + 'InterfaceMasterPaginationList-' + iStartRow).length == 0)
			{
			
				aHTML[++h] = '<div id="div' + sXHTMLContext + 'InterfaceMasterPaginationList-' + iStartRow + 
								'" class="interfaceMasterPaginationListPage' + sXHTMLContext + '">';
			
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
									
					aParam.startRow = iStartRow + iRows;	
				
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
									
					aParam.startRow = iStartRow + iRows;	
					
					var oRows = oData.data.rows;
			
					$(oRows).each(function() 
					{
						aHTML[++h] = fFunctionShowRow(this);
					})
					
				}
				
				aHTML[++h] = '</tbody></table>';
				
				aHTML[++h] = '</div>';
				
				$('.interfaceMasterPaginationListPage' + sXHTMLContext).hide();
				$('.interfaceMasterPaginationListPage' + sXHTMLContext + ':last').after(aHTML.join(''));
				
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
				
				$('#td' + sXHTMLContext + 'InterfaceMasterPaginationList-' + iStartRow).html(((iStartRow+1)/iRows)+1);

				$('td.interfaceMasterPaginationList' + sXHTMLContext).unbind('click');
				
				$('td.interfaceMasterPaginationList' + sXHTMLContext).click(function(event)
				{
					interfaceMasterPaginationListShowPage(this.id, sXHTMLContext);
				});
			
				if (bMoreRows)
				{
					var sHTML = '<td style="width:5px;cursor:pointer;" class="interfaceMessagingSubHeader interfaceMasterPaginationList' + sXHTMLContext + 
							'" id="td' + sXHTMLContext + 'InterfaceMasterPaginationList-' +
							(iStartRow + iRows) + '" rowStart="' +
							(iStartRow + iRows) + '">' + 'more...' + '</td>';
						
					$('#td' + sXHTMLContext + 'InterfaceMasterPaginationList-' + iStartRow).after(sHTML);
					
					$('#td' + sXHTMLContext + 'InterfaceMasterPaginationList-' + (iStartRow + iRows)).click(function(event)
					{
						var sID = event.target.id;
						var sStart = $('#' + sID).attr('rowStart')
						$('#' + sID).html(gsLoadingSmallXHTML);
						(aParam != undefined?aParam.more = iMore:aParam = {more: iMore, startRow: sStart})
						interfaceMasterPaginationListShowMore(aParam);
					});
				}	
				
				if (sFunctionNewPage != undefined)
				{
					eval(sFunctionNewPage);
				}
			}
		}
	}
}	

function interfaceMasterPaginationListShowPage(sXHTMLElementID, sXHTMLContext)
{

	var aElement = sXHTMLElementID.split('-');
	
	$('.interfaceMasterPaginationListPage' + sXHTMLContext).hide();
	$('#div' + sXHTMLContext + 'InterfaceMasterPaginationList-' + aElement[1]).show();
	
}

function interfaceMasterViewportOptionsShow(aParam)
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
	
	if (aParam != undefined)
	{
		if (aParam.xhtmlElement != undefined) {oXHTMLElement = aParam.xhtmlElement}
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
		if (aParam.xhtml != undefined) {sXHTML = aParam.xhtml}
		if (aParam.functionBind != undefined) {sFunctionBind = aParam.functionBind}
		if (aParam.offsetTop != undefined) {iOffsetTop = aParam.offsetTop}
		if (aParam.offsetLeft != undefined) {iOffsetLeft = aParam.offsetLeft}
		if (aParam.forceShow != undefined) {bForceShow = aParam.forceShow}
	}
	
	if (oXHTMLElement == undefined)
	{
		oXHTMLElement = $('#' + sXHTMLElementID)
	}
	
	if (oXHTMLElement != undefined)
	{
		if ($('#divInterfaceMasterViewportControlOptions').attr('onDemandSource') == oXHTMLElement.attr('id') && !bForceShow)
		{
			$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
			$('#divInterfaceMasterViewportControlOptions').attr('onDemandSource', '');
		}
		else
		{
			$('#divInterfaceMasterViewportControlOptions').attr('onDemandSource', oXHTMLElement.attr('id'));
			$('#divInterfaceMasterViewportControlOptions').html("&nbsp;");
			$('#divInterfaceMasterViewportControlOptions').show(giShowSpeedOptions);
			$('#divInterfaceMasterViewportControlOptions').offset({ top: $(oXHTMLElement).offset().top + $(oXHTMLElement).height() + iOffsetTop, left: $(oXHTMLElement).offset().left + iOffsetLeft});
			$('#divInterfaceMasterViewportControlOptions').html(sXHTML);
			
			if (sFunctionBind != undefined)
				{eval(sFunctionBind)}
		}
	}	
}

function interfaceMasterViewportOptionsHide()
{
	$('#divInterfaceMasterViewportControlOptions').attr('onDemandSource', '');
	$('#divInterfaceMasterViewportControlOptions').html("&nbsp;");
	$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
}


function interfaceMasterCreatePDF(aParam, sReturn)
{
	var iObject = giObject;
	var iObjectContext = giObjectContext;
	var sFileName = goObjectContext.id + '.pdf'
	var sXHTMLContent = '';
	var bOpen = false;

	if (aParam)
	{
		if (aParam.object) {iObject = aParam.object}
		if (aParam.objectContext) {iObjectContext = aParam.objectContext}
		if (aParam.filename) {sFileName = aParam.filename}	
		if (aParam.xhtmlContent) {sXHTMLContent = aParam.xhtmlContent}
		//if (aParam.open) {bOpen = aParam.open}	
	}

	if (sReturn == undefined)
	{
		$('#aInterfaceMainSummaryViewPDF').html(gsLoadingSmallXHTML)
		
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
			success: function(data) {interfaceMasterCreatePDF(aParam, data)}
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

function interfaceMasterEditorAddTag(aParam)
{ 
	var sXHTMLElementID;
	var sEditorID;
	var oMCEBookmark;
	
	if (aParam != undefined)
	{
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
		if (aParam.editorID != undefined) {sEditorID = aParam.editorID}
		if (aParam.mceBookmark != undefined) {oMCEBookmark = aParam.mceBookmark}
		
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
		interfaceMasterConfim({title: 'Error inserting field!', html: ["An error occurred when inserting the field. Please contact support." +
																	  "<br /><br />Details: No parameters passed to interfaceMasterEditorAddTag"]});
		return false;
	}
}

function interfaceMasterRPCGet()
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
}

function interfaceMasterEndpointURL(asMethod)
{
	interfaceMasterRPCGet();

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
}

