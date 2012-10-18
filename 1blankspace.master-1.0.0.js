Number.prototype.formatMoney = function(c, d, t){
var n = this, c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "," : d, t = t == undefined ? "." : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };
 
var ns1blankspace.version = 2;

var ns1blankspace.option.showSpeed = 0;
var ns1blankspace.option.showSpeedOptions = 0;
var ns1blankspace.option.hideSpeed = 0;
var ns1blankspace.option.hideSpeedOptions = 0;
var ns1blankspace.option.typingWait = 400;
var ns1blankspace.timer.messaging = 0;

var ns1blankspace.option.logonStayOnDocument = true;
var ns1blankspace.setupViewport = false;
var ns1blankspace.option.setFocus = true;
var ns1blankspace.option.richTextEditing = true;
var ns1blankspace.timer.delayCurrent = 0;
var ns1blankspace.inputDetected = false;
var ns1blankspace.unloadWarning = false;
var ns1blankspace.systemAdmin = false;

var gsSetupMethod = '';
var gsSetupName = '';
var giSetupContext = -1;
var goSetupContextXML;
var goSetupContext;
var ns1blankspace.timer.delay;

var ns1blankspace.object = -1;
var ns1blankspace.objectName = '';
var ns1blankspace.objectContext = -1;
var ns1blankspace.objectContextDataXML;
var ns1blankspace.objectContextDataJSON;
var ns1blankspace.objectContextData;
var ns1blankspace.objectContextSearch = '';
var ns1blankspace.objectSaveId = -1;
var ns1blankspace.okToSave = true;
var ns1blankspace.objectContextData;
var ns1blankspace.counter.editor = 0;

var ns1blankspace.xhtml.masterControl = '';
var ns1blankspace.xhtml.home = '';
var gsHomeViewportXHTML = '';
var ns1blankspace.user.commonname = '';
var ns1blankspace.user.email = '';
var ns1blankspace.user.networkGroups = '';
var ns1blankspace.xhtml.action = '';

var gaReturn = [];

var ns1blankspace.user.id = -1;
var ns1blankspace.user.contactperson = -1;

var ns1blankspace.setupShow = false;
var giHelpOption = -1;
	
var ns1blankspace.data.searchSource.text = 1;
var ns1blankspace.data.searchSource.browse = 2;
var ns1blankspace.data.searchSource.select = 3;
var ns1blankspace.data.searchSource.all = 4;

var ns1blankspace.debug.appContext = 'start';

var ns1blankspace.xhtml.divID = '';
var ns1blankspace.option.setupURI = '/ondemand/setup/';
var ns1blankspace.param;

var ns1blankspace.history.viewport = ['interfaceMasterHomeShow()']
var ns1blankspace.history.currentIndex = 0
var ns1blankspace.history.lastDestinationInstruction = '';
var ns1blankspace.history.list = [];

window.onbeforeunload = function() 
{
	if (ns1blankspace.unloadWarning)
	{
	      return "You potentially will lose unsaved information if you close. Press Cancel to stop the close."
	}
}

$(function()
{

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
		ns1blankspace.xhtml.divID = this.id;
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
			interfaceMasterElementOptionsSearch(ns1blankspace.xhtml.divID, 4);
		})
		.css('width', '14px')
		.css('height', '23px')
	});
		
	$('.inputInterfaceMainSelect').live('keyup', function()
	{
		interfaceMasterElementOptionsSearch(ns1blankspace.xhtml.divID, 1, 3);	
	});	
		
	$('.inputInterfaceMainSelect').live('blur', function() 
	{
		$(this).removeClass('interfaceMasterHighlight');
	});
	
	$('.inputInterfaceMainSelectAddress').live('focus', function() 
	{
		ns1blankspace.xhtml.divID = this.id;
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
			interfaceMasterAddressSearch(ns1blankspace.xhtml.divID);
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
		interfaceMasterContactSearch(ns1blankspace.xhtml.divID, 1, 3);	
	});	
	
	$('.inputInterfaceMainSelectContact').live('focus', function() 
	{
		ns1blankspace.xhtml.divID = this.id;
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
			interfaceMasterContactSearch(ns1blankspace.xhtml.divID, 4);
		})
		.css('width', '14px')
		.css('height', '23px')
	});
	
	$('.inputInterfaceMainSelectContactEmail').live('focus', function() 
	{
		ns1blankspace.xhtml.divID = this.id;
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
			interfaceMasterContactEmailSearch(ns1blankspace.xhtml.divID, {
					source: 4, 
					emailOnly: true,
					contactBusiness: $('#' + ns1blankspace.xhtml.divID).attr('ondemandcontactbusiness'),
					setXHTMLElementID: $(this).attr('ondemandsetelementid')
					});
		})
		.css('width', '14px')
		.css('height', '23px')
	});
	
	$('.inputInterfaceMainSelectContactEmail').live('keyup', function() 
	{
		if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
		
		var sFunction = "interfaceMasterContactEmailSearch(ns1blankspace.xhtml.divID, {" +
					"source: 1," +
					"emailOnly: true," +
					"contactBusiness: " + $(this).attr('ondemandcontactbusiness') + "," +
					"setXHTMLElementID: '" + $(this).attr('ondemandsetelementid') + "'});"
		
		ns1blankspace.timer.delayCurrent = setTimeout(sFunction, ns1blankspace.option.typingWait);
		
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
		ns1blankspace.inputDetected = true;
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
	var iObject = ns1blankspace.object;
	var iObjectContext = ns1blankspace.objectContext;
	var sXHTMLElementID;
	var sFunctionDefault;
	
	if (aParam != undefined)
	{
		if (aParam.object != undefined) {iObject = aParam.object}
		if (aParam.objectContext != undefined) {iObjectContext = aParam.objectContext}
		if (aParam.functionDefault != undefined) {sFunctionDefault = aParam.functionDefault}
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
	}
	
	$.each(ns1blankspace.history.list, function(index) 
	{ 
		if ((this.object == iObject) && (this.objectContext ==iObjectContext))
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
	
	if (ns1blankspace.inputDetected)
	{
		 bContinue = confirm("You have edited this page.  Do you want to continue moving to the new page?")
	}	
			
	if (bContinue)
	{	
		ns1blankspace.inputDetected = false;
		
		if (aParam != undefined)
		{
			if (aParam.newDestination != undefined) {sDestinationInstructions = aParam.newDestination}
			if (aParam.instruction != undefined) {iInstruction = aParam.instruction}
			if (aParam.instructionCount != undefined) {iInstructionCount = aParam.instructionCount}
			if (aParam.index != undefined) {ns1blankspace.history.currentIndex = aParam.index}
			if (aParam.move != undefined) {bMove = aParam.move}
			
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
					
					var sData = 'value=' + encodeURIComponent(ns1blankspace.history.viewport.slice(-2).toString());
					
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
						if (data == '')
						{
							//ns1blankspace.history.viewport.push('interfaceMasterHomeShow()');
						}	
						else
						{
							ns1blankspace.history.viewport = data.split(',');
							ns1blankspace.history.currentIndex = ns1blankspace.history.viewport.length - 1
						}	
					}
				})
			}		
				
			$('#spanInterfaceMasterViewportControlBack').button("destroy");	
			$('#spanInterfaceMasterViewportControlRefresh').button("destroy");	
			$('#spanInterfaceMasterViewportControlForward').button("destroy");	
			
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
	
	$('#spanInterfaceMasterLogon').button(
	{
		label: "Logon"
	})
	.click(function() 
	{
		interfaceMasterLogon();
	});	

	$('#' + sXHTMLElementID).show(ns1blankspace.option.showSpeed);
	
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
	$('#tdInterfaceMasterLogonStatus').html(ns1blankspace.xhtml.loadingSmall);
	
	$.ajax(
	{
		type: 'POST',
		url: '/ondemand/logon/',
		data: sData,
		dataType: 'json',
		async: false,
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
			$.cookie('mydigitalstucturelogon', sLogonName);
		}
		
		interfaceControlSecurity();
		
		if (oResponse.passwordStatus == "PASSWORDEXPIRED")
		{
			interfaceMasterLogonChangePasswordShow(); 
		}
		else
		{	
			if (oResponse.url == '#' || ns1blankspace.option.logonStayOnDocument)
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
	
	$('#' + sXHTMLElementID).show(ns1blankspace.option.showSpeed);
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
	
		if (oResponse.url == '#' || ns1blankspace.option.logonStayOnDocument)
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
	
	$('#divInterfaceMasterLogon').show(ns1blankspace.option.showSpeed);
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
	
	ns1blankspace.unloadWarning = false;
	document.location.reload();
}

function interfaceMasterViewportUserControlShow(oElement)
{

	$('#divInterfaceMasterViewportControlOptions').offset({ top: $(oElement).offset().top + $(oElement).height(), left: $(oElement).offset().left });
	$('#divInterfaceMasterViewportControlOptions').html(interfaceControlUserOptions());
	$('#divInterfaceMasterViewportControlOptions').show(ns1blankspace.option.showSpeedOptions);
	
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

	ns1blankspace.user.commonname = oResponse.userlogonname;
	gsUserID = oResponse.user;
	gsUserContactPersonID = oResponse.contactperson;
	ns1blankspace.user.email = oResponse.email;
	ns1blankspace.systemAdmin = oResponse.systemadmin;
	
	interfaceControlSecurity();
	
	ns1blankspace.unloadWarning = true;
	
	aHTML[++h] = '<div id="divInterfaceMasterViewport" class="interfaceMaster">';
	
	$('#tdInterfaceMasterHeaderColumn2').html('<span id="spanInterfaceMasterViewportLogonName">' + ns1blankspace.user.commonname + '</span>')
	
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
		
		if (ns1blankspace.setupShow) 
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
			label: ns1blankspace.option.defaultViewport
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
						primary: "ui-icon-wrench"
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
			interfaceMasterHelpShow(this);
		});		
	
	$('#spanInterfaceMasterViewportLogonName').click(function(event)
	{
		interfaceControlUserOptionsShow(this);
	})
	
	if (ns1blankspace.option.showBrowsing)
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
	if (ns1blankspace.timer.messaging != 0) {clearInterval(ns1blankspace.timer.messaging)};
	ns1blankspace.inputDetected = false;
	ns1blankspace.xhtml.action = '';
}

function interfaceMasterOptionsSource(sSource)
{
	if (sSource == undefined) {sSource = ''}
	$('#divInterfaceMasterViewportControlOptions').attr('onDemandSource', sSource);
}

function interfaceMasterHomeShow()
{	
	interfaceHomeViewport();
	
	if (ns1blankspace.xhtml.home == '')
	{
		ns1blankspace.xhtml.home = interfaceHome();
	}
	
	$('#divInterfaceMain').html(ns1blankspace.xhtml.home)
	
	interfaceHomeShow();
}

function interfaceMasterHomeOptionsShow(oElement)
{

	var aHTML = [];
	var h = -1;
	
	if ($('#divInterfaceMasterViewportControlOptions').attr('onDemandSource') == oElement.id)
	{
		$('#divInterfaceMasterViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
		$('#divInterfaceMasterViewportControlOptions').attr('onDemandSource', '');
	}
	else
	{	
		$('#divInterfaceMasterViewportControlOptions').attr('onDemandSource', oElement.id);
		$('#divInterfaceMasterViewportControlOptions').html("&nbsp;");
		$('#divInterfaceMasterViewportControlOptions').show(ns1blankspace.option.showSpeedOptions);
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
		$('#divInterfaceMasterViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
		$('#divInterfaceMasterViewportControlOptions').attr('onDemandSource', '');
	}
	else
	{	
		if (ns1blankspace.xhtml.masterControl == '')
		{
			ns1blankspace.xhtml.masterControl = interfaceControlOptions();
		}

		$('#divInterfaceMasterViewportControlOptions').attr('onDemandSource', oElement.id);
		$('#divInterfaceMasterViewportControlOptions').html("&nbsp;");
		$('#divInterfaceMasterViewportControlOptions').show(ns1blankspace.option.showSpeedOptions);
		$('#divInterfaceMasterViewportControlOptions').offset({ top: $(oElement).offset().top + $(oElement).height(), left: $(oElement).offset().left });
		$('#divInterfaceMasterViewportControlOptions').html(ns1blankspace.xhtml.masterControl);
			
		interfaceControlOptionsBind();
	}	
}

function interfaceMasterAttachments(aParam)
{

	var sXHTMLElementID;
	var iObject = ns1blankspace.object;
	var iObjectContext = ns1blankspace.objectContext;
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
					ns1blankspace.xhtml.loading +
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
		var sParam = 'method=CORE_ATTACHMENT_SEARCH' +
						'&object=' + iObject + 
						'&objectcontext=' + iObjectContext;
						
		if (iAttachmentType != undefined)
		{	
			sParam = sParam + '&type=' + iAttachmentType;
		}
		
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/core/?' + sParam,
			dataType: 'json',
			success: function(data) {interfaceMasterAttachmentsShow(data, sXHTMLElementID)}
		});
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
		$('#' + sXHTMLElementID).show(ns1blankspace.option.showSpeed);
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
			rows: ns1blankspace.option.defaultRows,
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
						'<a href="' + oRow.link + '">' + oRow.filename + '</a></td>';
						
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

function interfaceMasterAttachmentsRemove(sXHTMLElementId)
{

	var aSearch = sXHTMLElementId.split('-');
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
			success: function(data){$('#' + sXHTMLElementId).parent().fadeOut(500)}
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
	ns1blankspace.param = {};
	if (aParam != undefined) {ns1blankspace.param = aParam};
	
	$('#spanInterfaceMainUploadStatus').html('Uploading..');
	var oForm = document.frmonDemandFileUpload;
  	oForm.submit();
 	interfaceMasterAttachmentsAddStatus();
	ns1blankspace.timer.delay = setInterval('interfaceMasterAttachmentsAddStatus()', 1000);
}

function interfaceMasterAttachmentsAddStatus()
{
	var oDivStatus = document.getElementById('divonDemandFileUploadStatus');
	var oFrame = document.getElementById('ifonDemandUpload');
	var sStatus;
	var sCurrentState;

	var fFunctionPostUpdate = interfaceMasterAttachments;
	
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

function interfaceMasterAttachmentsUpload(aParam)
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
	
	if (ns1blankspace.setupViewport)
	{
		ns1blankspace.setupViewport = false;
		
		$('#divInterfaceMasterViewportControlSet')
		.button(
		{
			icons: 
			{
				primary: "ui-icon-grip-dotted-vertical",
				secondary: "ui-icon-triangle-1-s"
			},
			label: ns1blankspace.option.defaultViewport
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
		ns1blankspace.setupViewport = true;

		$('#divInterfaceMasterViewportControlSet')
		.button(
		{
			label: ns1blankspace.option.defaultSetupViewport
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
		$('#divInterfaceMasterViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
		$('#divInterfaceMasterViewportControlOptions').attr('onDemandSource', '');
	}
	else
	{	
		$('#divInterfaceMasterViewportControlOptions').attr('onDemandSource', oElement.id);
		$('#divInterfaceMasterViewportControlOptions').html("&nbsp;");
		$('#divInterfaceMasterViewportControlOptions').show(ns1blankspace.option.showSpeedOptions);
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
	$(asDivID).show(ns1blankspace.option.showSpeed);
	ns1blankspace.xhtml.divID = asDivID;
	if ($(asDivID).html() == '' || bRefresh)
	{
		$(asDivID).attr('onDemandLoading', '1');
		$(asDivID).html(ns1blankspace.xhtml.loading);
	}	
}


function interfaceMasterMainViewportHideLoading(asDivID)
{
	if (asDivID == undefined) {asDivID = ns1blankspace.xhtml.divID};

	$(asDivID).removeClass("loading");
}

function interfaceMasterStatus(asStatus)
{
	
	$('#divInterfaceMasterViewportControlActionStatus').html('<div style="position:relative;width:100%;height:35px;width:180px;">' +
			'<div style="position:absolute; top:50%; height:35px; margin-top:-17px;width:180px;">' + asStatus + '</div></div>');
}

function interfaceMasterError()
{
	$('#divInterfaceMasterViewportControlActionStatus').text('Error');
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


function interfaceMasterElementOptionsSearch(sXHTMLElementId, iSource, iMinimumLength, sMethod, sSearchText)
{

	var aSearch = sXHTMLElementId.split('-');
	var sElementId = aSearch[0];
	var lElementSearchContext = aSearch[1];
	var sURL = '';
	var sItemColumns = '';
	
	if (iSource == undefined)
	{
		iSource = ns1blankspace.data.searchSource.text;
	}	
	
	if (sElementId != '')
	{
		var sMethod = $('#' + sElementId).attr("onDemandMethod")
		sItemColumns = $('#' + sElementId).attr("onDemandColumns")
	}	
	
	if (lElementSearchContext != undefined)
	{
		$('#' + ns1blankspace.xhtml.divID).val($('#' + sXHTMLElementId).html())
		$('#' + ns1blankspace.xhtml.divID).attr("onDemandID", lElementSearchContext)
		$('#divInterfaceMasterViewportControlOptions').hide();
	}
	else
	{
	
		interfaceMasterOptionsSetPosition(sXHTMLElementId);
		
		var iMaximumColumns = 1;
	
		if (iMinimumLength == undefined)
		{
			iMinimumLength = 1;
		}	
	
		if (sSearchText == undefined) {sSearchText = ''};
			
		if (sSearchText == '' && iSource == ns1blankspace.data.searchSource.text)
		{
			sSearchText = $('#' + sElementId).val();
		}	
		
		if (sSearchText.length >= iMinimumLength || iSource == ns1blankspace.data.searchSource.all)
		{
			
			if (sMethod.indexOf("/") == -1)
			{
				var sParam = ns1blankspace.option.setupURI + '?rf=XML&method=' + sMethod +
							'&xhtmlcontext=' + sElementId;
			}
			else
			{
				var sParam = sMethod +
							'&xhtmlcontext=' + sElementId;
			}
				
			if (sSearchText != '')
			{
				sParam = sParam + '&quicksearch=' + sSearchText;
			}	
			
			$.ajax(
			{
				type: 'GET',
				url: sParam,
				dataType: 'xml',
				async: true,
				success: function (data, textStatus)
				{	interfaceMasterElementOptionsSearchShow(data, sItemColumns)	}
			});
			
		}
	};	
}

function interfaceMasterElementOptionsSearchShow(oXML, sItemColumns)
{

	var iColumn = 0;
	var aHTML = [];
	var h = -1;
	var	iMaximumColumns = 1;
	sItemColumns = (sItemColumns == undefined)?'':sItemColumns;
	var aColumns = sItemColumns.split('-');
	
		
	var oRoot = oXML.getElementsByTagName('ondemand').item(0);
	
	if (oRoot.childNodes.length == 0)
	{
		$('#divInterfaceMasterViewportControlOptions').hide();
	}
	else
	{
		var oRow = oRoot.childNodes.item(0);
		
		aHTML[++h] = '<table class="interfaceSearchLarge">';
		aHTML[++h] = '<tbody>'
			
		for (var iRow = 0; iRow < oRoot.childNodes.length; iRow++) 
		{
			
			var oRow = oRoot.childNodes.item(iRow);
			
			iColumn = iColumn + 1;
			
			if (iColumn == 1)
			{
				aHTML[++h] = '<tr class="interfaceSearch">';
			}
						
			if (sItemColumns.length == 0)
			{
				aHTML[++h] = '<td class="interfaceSearch" id="' + onDemandXMLGetData(oRow, "xhtmlcontext") +
									'-' + onDemandXMLGetData(oRow, "id") + '">' + onDemandXMLGetData(oRow, "title") + '</td>';
			}
			else
			{
			
				aHTML[++h] = '<td class="interfaceSearch" id="' + onDemandXMLGetData(oRow, "xhtmlcontext") +
										'-' + onDemandXMLGetData(oRow, "id") + '">' 
										
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
						aHTML[++h] = onDemandXMLGetData(oRow, aColumns[i]);
					}
				}
				aHTML[++h] = '</td>';
			}
			
			if (iColumn == iMaximumColumns)
			{
				aHTML[++h] = '</tr>'
				iColumn = 0;
			}	
		}
    	
		aHTML[++h] = '</tbody></table>';
	
		$('#divInterfaceMasterViewportControlOptions').html(aHTML.join(''));
		$('#divInterfaceMasterViewportControlOptions').show(ns1blankspace.option.showSpeedOptions);
		
		$('td.interfaceSearch').click(function(event)
		{
			$('#divInterfaceMasterViewportControlOptions').hide(200);
			interfaceMasterElementOptionsSearch(event.target.id);
		});
	}	
			
}

function interfaceMasterSearchStart(sElementId)
{
	sElementId = 'divInterfaceMasterViewportControlSearchStatus';
	$('#' + sElementId).show();
	$('#' + sElementId).html(ns1blankspace.xhtml.loadingSmall);
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
		ns1blankspace.objectSaveId =  oResponse.id;
	}
	else
	{
		interfaceMasterStatus(oResponse.error.errornotes);
		ns1blankspace.objectSaveId =  -1;
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

function interfaceMasterAddressSearch(sXHTMLElementId, aParam)
{
	
	var aSearch = sXHTMLElementId.split('-');
	var sElementId = aSearch[0];
	var lElementSearchContext = aSearch[1];	
	
	if (lElementSearchContext != undefined)
	{
		$('#' + ns1blankspace.xhtml.divID).val(aSearch[2])
		$('#' + ns1blankspace.xhtml.divID.replace('Suburb', 'State')).val(aSearch[3])
		$('#' + ns1blankspace.xhtml.divID.replace('Suburb', 'PostCode')).val(aSearch[4])
		$('#divInterfaceMasterViewportControlOptions').hide();
	}
	else
	{
		var sParam = '/ondemand/core/?method=CORE_ADDRESS_SEARCH&rf=XML';
		var sData = '';
		
		interfaceMasterOptionsSetPosition(sXHTMLElementId)
		
		//sData += '&postpcde=' + encodeURIComponent((aParam.postcode==undefined?'':aParam.postcode));
		
		sData += 'suburblike=' + encodeURIComponent($('#' + ns1blankspace.xhtml.divID).val());

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
		$('#divInterfaceMasterViewportControlOptions').show(ns1blankspace.option.showSpeedOptions);
		
		$('td.interfaceSearch').click(function(event)
		{
			$('#divInterfaceMasterViewportControlOptions').hide(200);
			interfaceMasterAddressSearch(event.target.id);
		});
	}	
			
}

function interfaceMasterContactSearch(sXHTMLElementId, iSource, iMinimumLength, sMethod, sSearchText)
{

	var aSearch = sXHTMLElementId.split('-');
	var sElementId = aSearch[0];
	var lElementSearchContext = aSearch[1];
	var sURL = '';
		
	if (iSource == undefined)
	{
		iSource = ns1blankspace.data.searchSource.text;
	}	
	
	if (sElementId != '')
	{
		var sMethod = $('#' + sElementId).attr("onDemandMethod")
		var sParentElementId = $('#' + sElementId).attr("onDemandParent")
	}	
	
	if (lElementSearchContext != undefined)
	{
		$('#' + sElementId).attr("onDemandID", aSearch[1])
		$('#' + sElementId).val(aSearch[2] + ' ' + aSearch[3])
		$('#' + sParentElementId).attr("onDemandID", aSearch[4])
		$('#' + sParentElementId).val(aSearch[5])
		$('#divInterfaceMasterViewportControlOptions').hide();
	}
	else
	{
	
		interfaceMasterOptionsSetPosition(sXHTMLElementId);
		
		var iMaximumColumns = 1;
	
		if (iMinimumLength == undefined)
		{
			iMinimumLength = 1;
		}	
	
		if (sSearchText == undefined) {sSearchText = ''};
			
		if (sSearchText == '' && iSource == ns1blankspace.data.searchSource.text)
		{
			sSearchText = $('#' + sElementId).val();
		}	
		
		if (sSearchText.length >= iMinimumLength || iSource == ns1blankspace.data.searchSource.all)
		{
			
			var oSearch = new AdvancedSearch();
			oSearch.endPoint = 'contact';
			oSearch.method = 'CONTACT_PERSON_SEARCH';
			oSearch.addField( 'firstname,surname,contactbusinesstext,contactbusiness');
			oSearch.addFilter('quicksearch', 'STRING_IS_LIKE', sSearchText);
			
			if (sParentElementId != undefined)
			{
				var sParentSearchText = $('#' + sParentElementId).val();
				var sParentSearchId = $('#' + sParentElementId).attr("onDemandID");
			}	
			
			if (sParentSearchId != undefined)
			{
				oSearch.addFilter('contactbusiness', 'EQUAL_TO', sParentSearchId);
			}
			else if	(sParentSearchText != undefined)
			{
				oSearch.addFilter('contactbusinesstext', 'STRING_STARTS_WITH', sParentSearchText);
			}
			
			oSearch.rf = 'JSON';
		
			oSearch.getResults(function (data) {interfaceMasterContactSearchShow(data, sElementId)}) 
						
		}
	};	
}

function interfaceMasterContactSearchShow(oResponse, sElementId)
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
			
			aHTML[++h] = '<td class="interfaceSearch" id="' + sElementId +
									'-' + this.id +
									'-' + this.firstname +
									'-' + this.surname +
									'-' + this.contactbusiness +
									'-' + this.contactbusinesstext +
									'">' + this.firstname +
									'&nbsp;' + this.surname +
									'</td>';
									
			aHTML[++h] = '<td class="interfaceSearch" id="' + sElementId +
									'-' + this.id +
									'-' + this.firstname +
									'-' + this.surname +
									'-' + this.contactbusiness +
									'-' + this.contactbusinesstext +
									'">' + this.contactbusinesstext +
									'</td>';
									
			aHTML[++h] = '</tr>'
		});
    	
		aHTML[++h] = '</tbody></table>';
	
		$('#divInterfaceMasterViewportControlOptions').html(aHTML.join(''));
		$('#divInterfaceMasterViewportControlOptions').show(ns1blankspace.option.showSpeedOptions);
		
		$('td.interfaceSearch').click(function(event)
		{
			$('#divInterfaceMasterViewportControlOptions').hide(200);
			interfaceMasterContactSearch(event.target.id);
		});
	}	
			
}

function interfaceMasterContactEmailSearch(sXHTMLElementId, aParam)
{

	var iSource = ns1blankspace.data.searchSource.text;
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

	var aSearch = sXHTMLElementId.split('---');
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
	
		interfaceMasterOptionsSetPosition(sXHTMLElementId);
	
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
	
		$('#divInterfaceMasterViewportControlOptions').show(ns1blankspace.option.showSpeedOptions);
		
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
	
	var sXHTMLElementId = '';
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
		if (aParam.xhtmlElementId != undefined) {sXHTMLElementId = aParam.xhtmlElementId}
		if (aParam.columns != undefined) {sColumns = aParam.columns}
		if (aParam.idColumns != undefined) {sIDColumns = aParam.idColumns}
		if (aParam.functionSearch != undefined) {fFunctionSearch = aParam.functionSearch}
		if (aParam.functionClass != undefined) {fFunctionClass = aParam.functionClass}
		if (aParam.idAdditional != undefined) {sIdAdditional = aParam.idAdditional}
		if (aParam.bodyClass != undefined) {sBodyClass = aParam.bodyClass}
		if (aParam.idSeperator != undefined) {sIDSeperator = aParam.idSeperator}
		
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
											sXHTMLElementId + '-' + this.id + sIDData + sIdAdditional + '">' 
											
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
					$('#divInterfaceMasterViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions)
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

function interfaceMasterPaginationShowPage(sXHTMLElementId)
{

	var aElement = sXHTMLElementId.split('-');
	
	$('.interfaceMasterSearchPage').hide();
	$('#divInterfaceMasterSearch-' + aElement[1]).show();
	
}

function interfaceMasterActions(aParam)
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
			url: '/ondemand/action/?rows=' + ns1blankspace.option.defaultRows + '&' + sParam,
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
		
		interfaceMasterPaginationList(
		   {
			xhtmlElementID: sXHTMLElementID,
			xhtmlContext: 'Action',
			xhtml: aHTML.join(''),
			showMore: (oResponse.morerows == 'true'),
			columns: 'subject-actiondate',
			more: this.moreid,
			rows: ns1blankspace.option.defaultRows,
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
		$('#divInterfaceMasterViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
		$('#divInterfaceMasterViewportControlOptions').attr('onDemandSource', '');
	}
	else
	{	
		if (ns1blankspace.xhtml.masterControl == '')
		{
			ns1blankspace.xhtml.masterControl = interfaceControlOptions();
		}

		$('#divInterfaceMasterViewportControlOptions').attr('onDemandSource', oElement.id);
		$('#divInterfaceMasterViewportControlOptions').html("&nbsp;");
		$('#divInterfaceMasterViewportControlOptions').show(ns1blankspace.option.showSpeedOptions);
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
		aHTML[++h] = '<td style="width:10px;" class="interfaceMessagingSubHeader interfaceMasterPaginationList" id="tdInterfaceMasterPaginationList' + sXHTMLContext + '-">Page:</td>';
		aHTML[++h] = '<td style="width:5px;cursor:pointer;" class="interfaceMessagingSubHeader interfaceMasterPaginationList' + sXHTMLContext + '"' +
							' id="td' + sXHTMLContext + 'InterfaceMasterPaginationList-0" rowStart="0">1</td>';
		aHTML[++h] = '<td></td></tr></table>';
	}
		
	aHTML[++h] = '<div id="div' + sXHTMLContext + 'InterfaceMasterPaginationList-0" class="interfaceMasterPaginationListPage' + sXHTMLContext + '">';
	aHTML[++h] = sHTML;
	aHTML[++h] = '</div>';

	$('#' + sXHTMLElementID).html(aHTML.join(''));
	if (bShowList) {$('#' + sXHTMLElementID).show(ns1blankspace.option.showSpeed)};
		
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
			$('#' + sID).html(ns1blankspace.xhtml.loadingSmall);
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
	
	var sXHTMLElementId = '';
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
		if (aParam.xhtmlElementId != undefined) {sXHTMLElementId = aParam.xhtmlElementId}
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
						$('#' + sID).html(ns1blankspace.xhtml.loadingSmall);
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

function interfaceMasterPaginationListShowPage(sXHTMLElementId, sXHTMLContext)
{

	var aElement = sXHTMLElementId.split('-');
	
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
			$('#divInterfaceMasterViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
			$('#divInterfaceMasterViewportControlOptions').attr('onDemandSource', '');
		}
		else
		{
			$('#divInterfaceMasterViewportControlOptions').attr('onDemandSource', oXHTMLElement.attr('id'));
			$('#divInterfaceMasterViewportControlOptions').html("&nbsp;");
			$('#divInterfaceMasterViewportControlOptions').show(ns1blankspace.option.showSpeedOptions);
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
	$('#divInterfaceMasterViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
}