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
var giOnDemandTimer;

var giObject = -1;
var gsObjectName = '';
var giObjectContext = -1;
var goObjectContextXML;
var goObjectContextJSON;
var gsObjectContextLastSearch = '';
var giObjectSaveId = -1;
var gbOkToSave = true;
var goObjectContext;

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

$(function()
{

	gsUserNetworkGroups = '';
	gbSetupShow = false;
	
	$(document).ajaxError(
		function(oEvent, oXMLHTTPRequest, oAjaxOptions, oError) 
			{
				// change to dialog - alert('Error: ' + oAjaxOptions.url + ' \nException: ' + oError + ' \nReturned: ' + oXMLHTTPRequest.responseText);
			}
	);	
	
	$.ajaxSetup(
	{
		cache: false
	});
	
	if (window.location.hash == '#PASSWORDEXPIRED')
	{
		interfaceMasterLogonChangePasswordShow();
	}
	else
	{
		interfaceMasterViewport();
	}	
	
})

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
						if (data == '')
						{
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
			}
			
			if (giMasterViewportHistoryCurrentIndex < gaMasterViewportHistory.length - 1)
			{	
				bForward = false;					
			}			
	
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

function interfaceMasterLogonShow()
{

	var aHTML = [];
	var h = -1;

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
					'<a id="aInterfaceMasterLogon" href="#" data-role="button" >Log On</a>'+
					'</td>' +
					'</tr>';
					
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
	
	$('#divInterfaceMain').html(aHTML.join(''));
	
	var sLogonName = $.cookie('mydigitalspaceidlogonname')
	
	 if (sLogonName != '' && sLogonName != null)
	{
		$('#inputInterfaceMasterLogonName').val(sLogonName);
		$('#inputInterfaceMasterLogonPassword').focus();
	}
	else
	{
		$('#inputInterfaceMasterLogonName').focus();
	}
	
	$('#aInterfaceMasterLogon').bind("click tap", function() 
	{
		$('#tdInterfaceMasterLogonStatus').html('Logging on...');
		interfaceMasterLogon();
	});	
	
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
	
	$.ajax(
	{
		type: 'POST',
		url: '/directory/ondemand/logon.asp',
		data: sData,
		dataType: 'text',
		async: false,
		success: interfaceMasterLogonProcess
	})
}

function interfaceMasterLogonProcess(sReturn)	
{	

	if (sReturn.substring(0, 2) == 'OK')
	{
		var aReturn = sReturn.split('|');
		
		if (aReturn[0] == 'OK')
		{
			if (unescape(aReturn[1]) == "NO")
			{
				if (aReturn[2] == "LOGONFAILED")
				{
					$('#tdInterfaceMasterLogonStatus').html('Logon Name or Password is incorrect.');
				}
			}
			else 
			{
			
				$('#tdInterfaceMasterLogonStatus').html('Logon successful...');
				
				if ($('#inputInterfaceMasterLogonNameRemember').attr('checked'))
				{
					$.cookie('mydigitalspaceidlogonname', sLogonName);
				}
				
				interfaceControlSecurity();
				
				if (aReturn[3] == "PASSWORDEXPIRED")
				{
					interfaceMasterLogonChangePasswordShow(aReturn[2]); 
				}
				else
				{	
					interfaceMasterViewport();
				}
			}
		}
	}
}

function interfaceMasterLogonChangePasswordShow(aParam)
{

	var aHTML = [];
	var h = -1;
	var sXHTMLElementID = 'divInterfaceMain';
	
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
	
		var sParam = 'method=SITE_USER_CHANGE_PASSWORD&expiredays=36500' +
					'&site=' + msOnDemandSiteId +
					'&currentpassword=' + sCurrentPassword + 
					'&newpassword=' + sNewPassword +
					'&newpasswordconfirm=' + sNewPasswordConfirm;
		
		$.ajax(
		{
			type: 'POST',
			url: '/directory/ondemand/site.asp?' + sParam,
			dataType: 'text',
			async: false,
			success: interfaceMasterLogonChangePasswordProcess
		})
	}
}
	
function interfaceMasterLogonChangePasswordProcess(sReturn)
{	

	if (sReturn.substring(0, 2) == 'OK')
	{
		var aReturn = sReturn.split('|');

		if (aReturn[1] == 'ER') 
		{
			if (aReturn[2] == 'PASSWORD_LESS_THAN_6_CHAR.') 
			{
				$('#tdInterfaceMasterLogonChangePasswordStatus').html('New password needs to be at least 6 characters.');
			}
			else
			{
				$('#tdInterfaceMasterLogonChangePasswordStatus').html('Incorrect current password.');
			}
		}
		else
		{
		
			$('#tdInterfaceMasterLogonChangePasswordStatus').html('Password changed!');
		
			if (aReturn[2] == "#" || gbLogonStayOnDocument)
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
	else
	{
		alert('You need to be logged on to change your password!');
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
			url: '/directory/ondemand/site.asp?' + sParam,
			dataType: 'text',
			async: false,
			success: interfaceMasterLogonSendPasswordProcess
		})
	}
	
}

function interfaceMasterLogonSendPasswordProcess(sReturn)
{

	var aValues = sReturn.split('|');
	
	if (aValues[1] == 'OK')
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
		url: '/directory/ondemand/logoff.asp',
		dataType: 'text'
	})
	
	interfaceMasterViewport()
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

	$('#aInterfaceMobileHeaderRefresh').hide();
	$('#aInterfaceMobileHeaderNew').hide();
	$('#divInterfaceMobileFooter').hide();
	
	var sParam = 'method=CORE_GET_USER_NAME';
	
	$.ajax(
	{
		type: 'GET',
		url: '/directory/ondemand/object.asp?' + sParam,
		dataType: 'text',
		async: false,
		cache: false,
		success: function(data, textStatus, XMLHttpRequest) 
		{
			sReturn = data;
			var aValues = sReturn.split('|');

			if( aValues[0] == 'ER')
			{
				interfaceMasterLogonShow();
			}
			else
			{
				interfaceMasterViewportShow(sReturn);
			}	
		}
	})
	
}	
	
function interfaceMasterViewportShow(asReturn)	
{
	
	$('#aInterfaceMobileHeaderRefresh').show();
	$('#aInterfaceMobileHeaderNew').show();
	$('#divInterfaceMobileFooter').show();
	
	var aHTML = [];
	var h = -1;

	var aValues = asReturn.split('|');
	
	gsUserName = aValues[1];
	gsUserID = aValues[7];
	gsUserContactPersonID = aValues[11];
	gsUserEmail = aValues[12];
	gbSystemAdmin = (aValues[20] == '1')
	
	interfaceControlSecurity();
	
	$('#aInterfaceMobileFooterLogOff').bind("click tap", function() 
	{
		interfaceMasterLogoff();
	});	
	
	if (gbReturnToLast) 
	{
		interfaceMasterViewportDestination({instruction: 8})
	}
	else
	{
		interfaceHomeViewport();
	}	
	
}

function interfaceMasterReset()
{
	$('#aInterfaceMobileHeaderRefresh').unbind('click tap');
	$('#aInterfaceMobileHeaderNew').unbind('click tap');
	if (giMessagingTimerID != 0) {clearInterval(giMessagingTimerID)};
}
