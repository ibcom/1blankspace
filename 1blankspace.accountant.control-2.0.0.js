var gbRoleBase = false;
var gbRoleOperations = false;
var gbRoleFinancials = false;
var gbRoleSetup = false;
var gbRoleSpecial1 = false;

var gsLoadingXHTML = '<img class="interfaceLoading" src="/jscripts/1blankspace.loading.square.20.gif">';
var gsLoadingSmallXHTML = '<img class="interfaceLoadingSmall" id="imgInterfaceLoadingSmall" src="/jscripts/1blankspace.loading.square.10.gif">';

var giReturnRows = 20;
var gsEditorCSS = '';
var gsViewportDefault = "Financials";
var gsSetupViewportDefault = "Financials";

var giObjectPerson = 32;
var giObjectBusiness = 12;
var giObjectOpportunity = 35;

var gaAttachmentTypes = [];
var gaNetworkGroups;

var gbDebug = true;
var gbShowAdd = true;
var gbReturnToLast = false;
var gbShowBrowseBar = false;

var gbMessagingEmailShowCount = false;
var gsMessagingEmailAccount = '';
var giMessagingCheckForNew = 60000;

function interfaceControlSecurity(sUserNetworkGroups)
{
	if (gsUserNetworkGroups == '')
	{
		if (sUserNetworkGroups == undefined)
		{
			$.ajax(
			{
				type: 'GET',
				url: '/ondemand/core/?method=CORE_NETWORK_GROUPS&rf=TEXT',
				dataType: 'text',
				async: false,
				success: interfaceControlSecurity
			});
		}
		else
		{
			gsUserNetworkGroups = sUserNetworkGroups
		}
	}
	
	//Based on security rights
	gbRoleBase = true;
	gbRoleOperations = true;
	gbRoleFinancials = true;
	gbRoleSetup = gbSystemAdmin;
	
	//Used if want to create greater interface role sensitivity	
	gbRoleSpecial1 = (gsUserNetworkGroups.indexOf("Special 1") != -1);
	
	//Used for testing.
	if (1==0)
	{
			gbRoleBase = true;
			gbRoleOperations = true;
			gbRoleFinancials = true;
			gbRoleSpecial1 = false;
	}
	
	//Show the setup icon?
	if (gbRoleSetup) {gbSetupShow = true};

	//Change the default viewport control menu option
	if (gbRoleSpecial1) 
	{
		gsViewportDefault = "Special 1"
	}	
	
}

function interfaceControlSetMasterViewport()
{
	if (gbRoleSpecial1) 
	{
		interfaceSpecialMasterViewport();
	}	
	else
	{
		interfaceFinancialMasterViewport({showHome: false});
	}	
}

function interfaceControlSetSetupMasterViewport()
{
	interfaceSetupFinancialMasterViewport();
}

function interfaceControlOptions()
{

	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<table id="tableInterfaceViewportMasterControl" class="interfaceViewportMasterControl">';
	aHTML[++h] = '<tr id="trInterfaceViewportMasterControlRow1" class="interfaceViewportMasterControl">';
	
	if (gbRoleBase)
	{	
		aHTML[++h] = '<td id="tdInterfaceViewportMasterControlcolumn1" class="interfaceViewportMasterControlColumn">';
		aHTML[++h] = '<table id="tableInterfaceViewportMasterControlColumn5" class="interfaceViewportMasterControlColumn">';

		aHTML[++h] = '<tr class="interfaceViewportMasterControl">' +
					'<td id="interfaceMasterViewportFinancial" class="interfaceMasterViewportImage">' +
					'&nbsp;' +
					'</td></tr>';
				
		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlFinancial" class="interfaceViewportMasterControl">' +
					'<td id="tdInterfaceViewportMasterControlFinancial" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlFinancial" class="interfaceViewportMasterControl">' +
					'Financials</span>' +
					'</td>' +
					'</tr>';	
		
		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlFinancialBankAccount" class="interfaceViewportMasterControl">' +
					'<td id="tdInterfaceViewportMasterControlFinancialBankAccount" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlFinancialBankAccount" class="interfaceViewportMasterControl">' +
					'Bank&nbsp;Accounts</span>' +
					'</td>' +
					'</tr>';
					
		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlFinancialInvoice" class="interfaceViewportMasterControl">' +
					'<td id="tdInterfaceViewportMasterControlFinancialInvoice" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlFinancialInvoice" class="interfaceViewportMasterControl">' +
					'Invoices</span>' +
					'</td>' +
					'</tr>';
					
		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlFinancialExpense" class="interfaceViewportMasterControl">' +
					'<td id="tdInterfaceViewportMasterControlFinancialExpense" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlFinancialExpense" class="interfaceViewportMasterControl">' +
					'Expenses</span>' +
					'</td>' +
					'</tr>';	
					
		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlFinancialReceipt" class="interfaceViewportMasterControl">' +
					'<td id="tdInterfaceViewportMasterControlFinancialReceipt" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlFinancialReceipt" class="interfaceViewportMasterControl">' +
					'Receipts</span>' +
					'</td>' +
					'</tr>';	
					
		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlFinancialPayment" class="interfaceViewportMasterControl">' +
					'<td id="tdInterfaceViewportMasterControlFinancialPayment" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlFinancialPayment" class="interfaceViewportMasterControl">' +
					'Payments</span>' +
					'</td>' +
					'</tr>';	
		
		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlFinancialPayroll" class="interfaceViewportMasterControl">' +
					'<td id="tdInterfaceViewportMasterControlFinancialPayroll" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlFinancialPayroll" class="interfaceViewportMasterControl">' +
					'Payroll</span>' +
					'</td>' +
					'</tr>';
							
		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlFinancialTax" class="interfaceViewportMasterControl">' +
					'<td id="tdInterfaceViewportMasterControlFinancialTax" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlFinancialTax" class="interfaceViewportMasterControl">' +
					'Tax</span>' +
					'</td>' +
					'</tr>';
									
		aHTML[++h] = '</table>'
		aHTML[++h] = '</td>';			
	
	}
	
	if (gbRoleBase)
	{	
		aHTML[++h] = '<td id="tdInterfaceViewportMasterControlcolumn2" class="interfaceViewportMasterControlColumn">';
	
		aHTML[++h] = '<table id="tableInterfaceViewportMasterControlColumn6" class="interfaceViewportMasterControlColumn">';
			
		aHTML[++h] = '<tr class="interfaceViewportMasterControl">' +
						'<td id="interfaceMasterViewportReport" class="interfaceMasterViewportImage">' +
						'&nbsp;' +
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlReport" class="interfaceViewportMasterControl">' +
						'<td id="tdInterfaceViewportMasterControlReport" class="interfaceViewportMasterControl">' +
						'<span id="spanInterfaceViewportMasterControlReport" class="interfaceViewportMasterControl">' +
						'Reporting</span>' +
						'</td>' +
						'</tr>';
						
		aHTML[++h] = '</table>'
		aHTML[++h] = '</td>'
					
	}
		
	aHTML[++h] = '</tr></table>'
	
	return aHTML.join('');
		
}

function interfaceControlOptionsBind()
{
	$('#tdInterfaceViewportMasterControlSetupUser').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceSetupUserMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlFinancial').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceFinancialMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlFinancialBankAccount').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceFinancialBankAccountMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlFinancialInvoice').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceFinancialInvoiceMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlFinancialExpense').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceFinancialExpenseMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlFinancialReceipt').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceFinancialReceiptMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlFinancialPayment').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceFinancialPaymentMasterViewport();
	});

	$('#tdInterfaceViewportMasterControlReport').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceReportMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlFinancialTax').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceFinancialTaxMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlFinancialPayroll').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceFinancialPayrollMasterViewport();
	});
}
function interfaceControlSetupOptions()
{

	var aHTML = [];
	var h = -1;
	
		
	aHTML[++h] = '<table id="tableInterfaceViewportMasterSetupControl" class="interfaceViewportMasterControl">';
	aHTML[++h] = '<tr id="trInterfaceViewportMasterSetupControlRow1" class="interfaceViewportMasterControl">';
	
	if (gbRoleSetup)
	{	
		
			aHTML[++h] = '<td id="tdInterfaceViewportMasterSetupControlColumn2" class="interfaceViewportMasterControlColumn">';
		aHTML[++h] = '<table id="tableInterfaceViewportMasterSetupControlColumn2" class="interfaceViewportMasterControlColumn">';

		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlSetupFinancial" class="interfaceViewportMasterControl">' +	
					'<td id="tdInterfaceViewportMasterControlSetupFinancial" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlSetupFinancial" class="interfaceViewportMasterControl">' +
					'Financials</span>' +
					'</td></tr>';

		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlSetupUser" class="interfaceViewportMasterControl">' +	
					'<td id="tdInterfaceViewportMasterControlSetupUser" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlSetupUser" class="interfaceViewportMasterControl">' +
					'Users</span>' +
					'</td></tr>';
	
		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlSetupUser" class="interfaceViewportMasterControl">' +	
					'<td id="tdInterfaceViewportMasterControlSetupUser" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlSetupUser" class="interfaceViewportMasterControl">' +
					'Register&nbsp;a&nbsp;client</span>' +
					'</td></tr>';		
					
		aHTML[++h] = '</table>';
		aHTML[++h] = '</td>';	
	}	
	
	aHTML[++h] = '</tr></table>'
	
	return aHTML.join('');
		
}

function interfaceControlSetupOptionsBind()
{

	$('#spanInterfaceViewportMasterControlDeveloperSpace').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceDeveloperSpaceMasterViewport();
	});
		
	$('#tdInterfaceViewportMasterControlSetupUser').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceSetupUserMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlSetupNetworkGroup').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceSetupNetworkGroupMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlSetupAutomation').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceSetupAutomationMasterViewport();
	});
	
	
	$('#tdInterfaceViewportMasterControlSetupImport').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceSetupImportMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlSetupContactBusinessGroup').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceSetupMasterViewport(
				{
				setupName: "Contact Business Groups",
				setupMethod: "/directory/ondemand/setup.asp?method=SETUP_CONTACT_BUSINESS_GROUP"
				});
	});
	
	$('#tdInterfaceViewportMasterControlSetupContactPersonGroup').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceSetupMasterViewport(
				{
				setupName: "Contact Person Groups",
				setupMethod: "/directory/ondemand/setup.asp?method=SETUP_CONTACT_PERSON_GROUP"
				});
	});
	
	$('#tdInterfaceViewportMasterControlSetupProject').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceSetupProjectMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlSetupProjectTaak').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceSetupProjectTaskMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlSupportIssue').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceSupportIssueMasterViewport();
	});
}

function interfaceControlUserOptionsShow(oElement)
{
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
		$('#divInterfaceMasterViewportControlOptions').html(interfaceControlUserOptions);
			
		interfaceControlUserOptionsBind();
	}	
}


function interfaceControlUserOptions()
{

	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<table id="tableInterfaceMasterUserOptions" class="interfaceViewportMasterControl">';
		
	aHTML[++h] = '<tr id="trInterfaceMasterUserOptionsLogOff" class="interfaceMasterUserOptions">' +
					'<td id="tdInterfaceMasterUserOptionsLogOff" class="interfaceMasterUserOptions">' +
					'Log Off' +
					'</td>' +
					'</tr>'
				
	aHTML[++h] = '<tr id="trInterfaceMasterUserOptionsChangePassword" class="interfaceMasterUserOptions">' +
					'<td id="tdInterfaceMasterUserOptionsChangePassword" class="interfaceMasterUserOptions">' +
					'Change My Password' +
					'</td>' +
					'</tr>'			
				
	aHTML[++h] = '<tr id="trInterfaceMasterUserOptionsCreateSecureKey" class="interfaceMasterUserOptions">' +
					'<td id="tdInterfaceMasterUserOptionsCreateSecureKey" class="interfaceMasterUserOptions">' +
					'Secure Access Token' +
					'</td>' +
					'</tr>'						
				
	//aHTML[++h] = '<tr id="trInterfaceMasterUserOptions" class="interfaceMasterUserOptions">' +
	//				'<td id="tdInterfaceMasterUserOptionsMyProfile" class="interfaceMasterUserOptions">' +
	//				'My Profile' +
	//				'</td>' +
	//			'</tr>'
					
	aHTML[++h] = '</table>'
	
	return aHTML.join('');
		
}

function interfaceControlUserOptionsBind()
{

	$('#tdInterfaceMasterUserOptionsLogOff').click(function(event)
	{
		interfaceMasterLogoff();
	})
	
	$('#tdInterfaceMasterUserOptionsChangePassword').click(function(event)
	{
		$(this).html(gsLoadingSmallXHTML);
		interfaceMasterUserOptionsChangePassword();
	});
	
	$('#tdInterfaceMasterUserOptionsCreateSecureKey').click(function(event)
	{
		$(this).html(gsLoadingSmallXHTML);
		interfaceMasterUserOptionsCreateSecureKey();
	});
}

function interfaceMasterUserOptionsChangePassword(aParam)
{
	var aHTML = [];
	var h = -1;
	var bShow = true;
	var sXHTMLElementID = 'divInterfaceMasterViewportControlOptions'
	
	if (aParam != undefined)
	{
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
		if (aParam.show != undefined) {bShow = aParam.show}
	}	
	
	aHTML[++h] = '<table id="tableInterfaceUserOptionsChangePassword" class="interfaceViewportMasterControl" style="width:350px;">';
		
	if (bShow)
	{
		interfaceMasterOptionsSetPosition(sXHTMLElementID, 0, -255)
		
		aHTML[++h] = '<tr class="interfaceHomeOptionContext">';
		aHTML[++h] = '<td class="interfaceHomeOptionContext">Change Password</td>';
		aHTML[++h] = '<td id="tdInterfaceHomeOptionClose" style="text-align:right;"><span id="spanInterfaceMainOptionsClose">Close</span></td>';
		aHTML[++h] = '</tr>';
	}
		
	aHTML[++h] = '<tr><td id="tdInterfaceUserOptionsChangePassword" style="font-size:0.875em" colspan=2></td></tr></table>';
	
	$('#' + sXHTMLElementID).html(aHTML.join(''));	
	
	$('#spanInterfaceMainOptionsClose').button(
	{
		text: false,
		 icons: {
			 primary: "ui-icon-close"
		}
	})
	.click(function() {
		$('#' + sXHTMLElementID).slideUp(500);
		$('#' + sXHTMLElementID).html('');
		$('#' + sXHTMLElementID).attr('onDemandSource', '');
	})
	.css('width', '20px')
	.css('height', '20px')
	
	interfaceMasterLogonChangePasswordShow({xhtmlElementID: 'tdInterfaceUserOptionsChangePassword'});
	
}

function interfaceMasterUserOptionsCreateSecureKey(aParam, oResponse)
{
	var aHTML = [];
	var h = -1;
	var bShow = true;
	var bSetPosition = true;
	var sXHTMLElementID = 'divInterfaceMasterViewportControlOptions'
	
	if (aParam != undefined)
	{
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
		if (aParam.show != undefined) {bShow = aParam.show}
		if (aParam.setPosition != undefined) {bSetPosition = aParam.setPosition}
	}	
	
	if (oResponse == undefined)
	{
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/core/?method=CORE_SECURE_TOKEN_SEARCH&rf=JSON',
			dataType: 'json',
			success: function(data) {interfaceMasterUserOptionsCreateSecureKey(aParam, data)}
		})
	}
	else
	{	
	
		aHTML[++h] = '<table id="tableInterfaceUserOptionsCreateSecureKey" class="interfaceViewportMasterControl" style="width:400px;"><tr><td>';	

		if (bSetPosition)
		{
			interfaceMasterOptionsSetPosition(sXHTMLElementID, 0, -305)
		}	
	
		if (bShow)
		{
			aHTML[++h] = '<table id="tableInterfaceUserOptionsCreateSecureKey" style="width:400px;>';	
			aHTML[++h] = '<tr class="interfaceHomeOptionContext">';
			aHTML[++h] = '<td class="interfaceHomeOptionContext">Secure Access Token</td>';
			aHTML[++h] = '<td id="tdInterfaceHomeOptionClose" style="text-align:right;"><span id="spanInterfaceMainOptionsClose">Close</span></td>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</table>';
		}
		
		aHTML[++h] = '<table id="tableInterfaceUserOptionsCreateSecureKey" style="width:400px;font-size:0.75em">';
		
		if (oResponse.access_token == undefined)
		{
			aHTML[++h] = '<tr><td>' +
								'<br />No key has been set up.  Click <b>New Token</b> to create a token, which you can use to link to your information.<br /><br /></td></tr>';
			
		}
		else
		{
		
			aHTML[++h] = '<tr><td>' +
								oResponse.access_token + '<br /><br /></td></tr>';
			
			aHTML[++h] = '<tr><td style="text-align:right;" id="tdInterfaceHomeOptionsCreateSecureKeyDisable"><span id="spanInterfaceHomeOptionsCreateSecureKeyDisable">Disable Token</span></td></tr>';								
			aHTML[++h] = '<tr><td>' +
								'<br />If you generate a new token, the current token will no longer work.<br /><br /></td></tr>';
			
		}
		
		aHTML[++h] = '<tr><td style="text-align:right;" id="tdInterfaceHomeOptionsCreateSecureKeyNew"><span id="spanInterfaceHomeOptionsCreateSecureKeyNew">New Token</span></td></tr>';
		
		if (oResponse.access_token != undefined)
		{
			aHTML[++h] = '<tr><td><br /><b>Example link for future diary events in iCal format:</b><br /><br />' +
								window.location.protocol + '//' + window.location.host + '/ondemand/action/' +
								'<br />?method=ACTION_ICAL_SEARCH' +
								'<br />&access_token=' + oResponse.access_token + '<br /><br /></td></tr>';
								
			aHTML[++h] = '<tr><td><a href="' +
								window.location.protocol + '//' + window.location.host + '/ondemand/action/?method=ACTION_ICAL_SEARCH' +
								'&access_token=' + oResponse.access_token + '" target="_blank" style="font-size:1.2em">Open example link</a>' +
								'<br /><span style="color: #A0A0A0;">(You can then copy & paste it)<br /><br /></span></td></tr>';					
		}
		
		aHTML[++h] = '</table>';
		
		aHTML[++h] = '</td></tr></table>';
		
		$('#' + sXHTMLElementID).html(aHTML.join(''));	
		
		$('#spanInterfaceMainOptionsClose').button(
		{
			text: false,
			 icons: {
				 primary: "ui-icon-close"
			}
		})
		.click(function() {
			$('#' + sXHTMLElementID).slideUp(500);
			$('#' + sXHTMLElementID).html('');
			$('#' + sXHTMLElementID).attr('onDemandSource', '');
		})
		.css('width', '20px')
		.css('height', '20px')
		
		$('#spanInterfaceHomeOptionsCreateSecureKeyDisable').button()
		.click(function() {
		
			if (confirm('Are you sure?'))
			{
				$.ajax(
				{
					type: 'POST',
					url: '/ondemand/core/?method=CORE_SECURE_TOKEN_MANAGE&remove=1&rf=TEXT',
					dataType: 'text',
					async: false,
					success: function(data) {interfaceMasterUserOptionsCreateSecureKey({setPosition: false})}
				})
			}		
		})
		.css('width', '150px')
		
		$('#spanInterfaceHomeOptionsCreateSecureKeyNew').button()
		.click(function() {
		
			if (confirm('Are you sure?'))
			{
				$.ajax(
				{
					type: 'POST',
					url: '/ondemand/core/?method=CORE_SECURE_TOKEN_MANAGE&rf=TEXT',
					dataType: 'text',
					async: false,
					success: function(data) {interfaceMasterUserOptionsCreateSecureKey({setPosition: false})}
				})
			}		
		})
		.css('width', '150px')
	}		
}
