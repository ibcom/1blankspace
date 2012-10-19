var gbRoleBase = false;
var gbRoleOperations = false;
var gbRoleFinancials = false;
var gbRoleSetup = false;
var gbRoleSpecial1 = false;

var ns1blankspace.xhtml.loading = '<img class="interfaceLoading" src="/jscripts/1blankspace.loading.square.20.gif">';
var ns1blankspace.xhtml.loadingSmall = '<img class="interfaceLoadingSmall" id="imgInterfaceLoadingSmall" src="/jscripts/1blankspace.loading.square.10.gif">';
var ns1blankspace.option.defaultRows = 20;
var ns1blankspace.xhtml.editorCSS = '';
var ns1blankspace.option.defaultViewport = "People";
var ns1blankspace.option.defaultSetupViewport = "Website";

var ns1blankspace.data.object.contactperson = 32;
var ns1blankspace.data.object.contactbusiness = 12;
var ns1blankspace.data.object.opportunity = 35;

var ns1blankspace.data.attachmentTypes = [];
var ns1blankspace.data.networkGroups;

var ns1blankspace.debug.enabled = true;
var gbShowAdd = true;
var gbReturnToLast = true;
var ns1blankspace.option.showBrowsing = false;

var ns1blankspace.option.messagingEmailShowCount = false;
var gsMessagingEmailAccount = '';
var ns1blankspace.option.messagingCheckForNew = 60000;

ns1blankspace.xhtml.loading = ns1blankspace.xhtml.loading;
ns1blankspace.xhtml.loadingSmall = ns1blankspace.xhtml.loadingSmall

if (ns1blankspace.financial === undefined) {ns1blankspace.financial = {}}

ns1blankspace.financial.summaryUseTemplate = false; 
ns1blankspace.financial.defaultInvoiceTemplateXHTML = '/jscripts/1blankspace.setup.financial.invoice-1.0.0.html';

function interfaceControlSecurity(sUserNetworkGroups)
{
	//For deep in model security, refer to http://mydigitalstructure.com/gettingstarted_access_control
	
	if (ns1blankspace.user.networkGroups == '')
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
			ns1blankspace.user.networkGroups = sUserNetworkGroups
		}
	}
	
	//Based on security rights
	gbRoleBase = true;
	gbRoleOperations = true;
	gbRoleFinancials = true;
	gbRoleSetup = ns1blankspace.systemAdmin;
	
	//Used if want to create greater interface role sensitivity	
	gbRoleSpecial1 = (ns1blankspace.user.networkGroups.indexOf("Special 1") != -1);
	
	//Used for testing.
	if (1==0)
	{
			gbRoleBase = true;
			gbRoleOperations = true;
			gbRoleFinancials = true;
			gbRoleSpecial1 = false;
	}
	
	//Show the setup icon?
	if (gbRoleSetup) {ns1blankspace.setupShow = true};

	//Change the default viewport control menu option
	if (gbRoleSpecial1) 
	{
		ns1blankspace.option.defaultViewport = "Special 1"
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
		interfaceContactPersonMasterViewport({showHome: false});
	}	
}

function interfaceControlSetSetupMasterViewport()
{
	interfaceSetupWebsiteMasterViewport();
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
		aHTML[++h] = '<table id="tableInterfaceViewportMasterControlColumn1" class="interfaceViewportMasterControlColumn">';

		aHTML[++h] = '<tr class="interfaceViewportMasterControl">' +
					'<td id="ns1blankspaceViewportContact" class="ns1blankspaceViewportImage">' +
					'&nbsp;' +
					'</td></tr>';
	
		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlContactPerson" class="interfaceViewportMasterControl">' +
					'<td id="tdInterfaceViewportMasterControlContactPerson" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlContactPerson" class="interfaceViewportMasterControl">' + 
					'People</span>' +
					'</td></tr>';
	
		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlContactBusiness" class="interfaceViewportMasterControl">' +
					'<td id="tdInterfaceViewportMasterControlContactBusiness" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlContactBusiness" class="interfaceViewportMasterControl">' + 
					'Businesses</span>' +
					'</td></tr>';
	
		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlOpportunity" class="interfaceViewportMasterControl">' +	
					'<td id="tdInterfaceViewportMasterControlOpportunity" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlOpportunity" class="interfaceViewportMasterControl">' + 
					'Opportunities</span>' +
					'</td>' +
					'</tr>';	
	
		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlMessaging" class="interfaceViewportMasterControl">' +	
					'<td id="tdInterfaceViewportMasterControlMessaging" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlMessaging" class="interfaceViewportMasterControl">' + 
					'Email</span>' +
					'</td>' +
					'</tr>';	
	
		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlMessagingConversation" class="interfaceViewportMasterControl">' +	
					'<td id="tdInterfaceViewportMasterControlMessagingConversation" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlMessagingConversation" class="interfaceViewportMasterControl">' + 
					'Conversations</span>' +
					'</td>' +
					'</tr>';	
	
		aHTML[++h] = '</table>';
		aHTML[++h] = '</td>';
	
	}
	
	if (gbRoleBase)
	{	
	
		aHTML[++h] = '<td id="tdInterfaceViewportMasterControlcolumn2" class="interfaceViewportMasterControlColumn">';
		aHTML[++h] = '<table id="tableInterfaceViewportMasterControlColumn2" class="interfaceViewportMasterControlColumn">';

		aHTML[++h] = '<tr class="interfaceViewportMasterControl">' +
					'<td id="ns1blankspaceViewportProject" class="ns1blankspaceViewportImage">' +
					'&nbsp;' +
					'</td></tr>';
					
		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlProject" class="interfaceViewportMasterControl">' +
					'<td id="tdInterfaceViewportMasterControlProject" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlProject" class="interfaceViewportMasterControl">' + 
					'Projects</span>' +
					'</td></tr>';
					
		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlProjectTask" class="interfaceViewportMasterControl">' +
					'<td id="tdInterfaceViewportMasterControlProjectTask" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlProjectTask" class="interfaceViewportMasterControl">' + 
					'Project Tasks</span>' +
					'</td></tr>';			
	
		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlAction" class="interfaceViewportMasterControl">' +				
					'<td id="tdInterfaceViewportMasterControlAction" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlAction" class="interfaceViewportMasterControl">' +
					'Actions</span>' +
					'</td>' +
					'</tr>'
					
		aHTML[++h] = '</table>'
		aHTML[++h] = '</td>';
					
	}
	
	if (gbRoleBase)
	{	
	
		aHTML[++h] = '<td id="tdInterfaceViewportMasterControlcolumn3" class="interfaceViewportMasterControlColumn">';	
		aHTML[++h] = '<table id="tableInterfaceViewportMasterControlColumn3" class="interfaceViewportMasterControlColumn">';			
		aHTML[++h] = '<tr class="interfaceViewportMasterControl">' +
					'<td id="ns1blankspaceViewportDocument" class="ns1blankspaceViewportImage">' +
					'&nbsp;' +
					'</td></tr>';
		
		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlDocument" class="interfaceViewportMasterControl">' +
					'<td id="tdInterfaceViewportMasterControlDocument" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlDocument" class="interfaceViewportMasterControl">' +
					'Documents</span>' +
					'</td></tr>';
	
		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlNews" class="interfaceViewportMasterControl">' +
					'<td id="tdInterfaceViewportMasterControlNews" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlNews" class="interfaceViewportMasterControl">' +
					'News</span>' +
					'</td></tr>';
	
		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlEvent" class="interfaceViewportMasterControl">' +
					'<td id="tdInterfaceViewportMasterControlEvent" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlEvent" class="interfaceViewportMasterControl">' +
					'Events</span>' +
					'</td></tr>';
					
		aHTML[++h] = '</table>'
		aHTML[++h] = '</td>';			
	}	
					
	if (gbRoleBase)
	{	
	
		aHTML[++h] = '<td id="tdInterfaceViewportMasterControlcolumn4" class="interfaceViewportMasterControlColumn">';	
		aHTML[++h] = '<table id="tableInterfaceViewportMasterControlColumn4" class="interfaceViewportMasterControlColumn">';	
		
		aHTML[++h] = '<tr class="interfaceViewportMasterControl">' +
					'<td id="ns1blankspaceViewportProduct" class="ns1blankspaceViewportImage">' +
					'&nbsp;' +
					'</td></tr>';
		
		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlProduct" class="interfaceViewportMasterControl">' +
					'<td id="tdInterfaceViewportMasterControlProduct" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlProduct" class="interfaceViewportMasterControl">' +
					'Products</span>' +
					'</td>' +
					'</tr>'
	
		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlOrder" class="interfaceViewportMasterControl">' +
					'<td id="tdInterfaceViewportMasterControlOrder" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlOrder" class="interfaceViewportMasterControl">' +
					'Orders</span>' +
					'</td></tr>';
					
		aHTML[++h] = '</table>';
		aHTML[++h] = '</td>';
	}
	
	if (gbRoleFinancials)
	{	
	
		aHTML[++h] = '<td id="tdInterfaceViewportMasterControlcolumn5" class="interfaceViewportMasterControlColumn">';
		aHTML[++h] = '<table id="tableInterfaceViewportMasterControlColumn5" class="interfaceViewportMasterControlColumn">';

		aHTML[++h] = '<tr class="interfaceViewportMasterControl">' +
					'<td id="ns1blankspaceViewportFinancial" class="ns1blankspaceViewportImage">' +
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
					'Bank Accounts</span>' +
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
								
		aHTML[++h] = '</table>'
		aHTML[++h] = '</td>';			
	}
	
	if (ns1blankspace.version > 1)
	{
		aHTML[++h] = '<td id="tdInterfaceViewportMasterControlcolumn6" class="interfaceViewportMasterControlColumn">';

		aHTML[++h] = '<table id="tableInterfaceViewportMasterControlColumn6" class="interfaceViewportMasterControlColumn">';
			
		aHTML[++h] = '<tr class="interfaceViewportMasterControl">' +
						'<td id="ns1blankspaceViewportReport" class="ns1blankspaceViewportImage">' +
						'&nbsp;' +
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlReport" class="interfaceViewportMasterControl">' +
						'<td id="tdInterfaceViewportMasterControlReport" class="interfaceViewportMasterControl">' +
						'<span id="spanInterfaceViewportMasterControlReport" class="interfaceViewportMasterControl">' +
						'Reporting</span>' +
						'</td>' +
						'</tr>';
		
		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlFinancialTax" class="interfaceViewportMasterControl">' +
						'<td id="tdInterfaceViewportMasterControlFinancialTax" class="interfaceViewportMasterControl">' +
						'<span id="spanInterfaceViewportMasterControlFinancialTax" class="interfaceViewportMasterControl">' +
						'Tax</span>' +
						'</td>' +
						'</tr>';				
						
		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlStructure" class="interfaceViewportMasterControl">' +
						'<td id="tdInterfaceViewportMasterControlStructure" class="interfaceViewportMasterControl">' +
						'<span id="spanInterfaceViewportMasterControlStructure" class="interfaceViewportMasterControl">' +
						'Structures</span>' +
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
	$('#tdInterfaceViewportMasterControlContactPerson').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceContactPersonMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlContactBusiness').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceContactBusinessMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlOpportunity').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceOpportunityMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlProject').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceProjectMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlProjectTask').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceProjectTaskMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlAction').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceActionMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlDocument').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceDocumentMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlNews').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceNewsMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlEvent').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceEventMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlProduct').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceProductMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlOrder').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceOrderMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlFinancial').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceFinancialMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlFinancialBankAccount').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceFinancialBankAccountMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlFinancialInvoice').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceFinancialInvoiceMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlFinancialExpense').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceFinancialExpenseMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlFinancialReceipt').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceFinancialReceiptMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlFinancialPayment').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceFinancialPaymentMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlFinancialTax').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceFinancialTaxMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlFinancialPayroll').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceFinancialPayrollMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlHelp').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceHelpMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlMessaging').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceMessagingIMAPMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlMessagingConversation').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceMessagingConversationMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlReport').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceReportMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlStructure').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceStructureMasterViewport();
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
	
		aHTML[++h] = '<td id="tdInterfaceViewportMasterSetupControlColumn1" class="interfaceViewportMasterControlColumn">';
		aHTML[++h] = '<table id="tableInterfaceViewportMasterSetupControlColumn1" class="interfaceViewportMasterControlColumn">';

		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlSetupUser" class="interfaceViewportMasterControl">' +	
					'<td id="tdInterfaceViewportMasterControlSetupUser" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlSetupUser" class="interfaceViewportMasterControl">' +
					'Users</span>' +
					'</td></tr>';
	
		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlSetupUserRole" class="interfaceViewportMasterControl">' +	
					'<td id="tdInterfaceViewportMasterControlSetupUserRole" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlSetupUserRole" class="interfaceViewportMasterControl">' +
					'User Roles</span>' +
					'</td></tr>';

		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlSetupNetworkGroup" class="interfaceViewportMasterControl">' +	
					'<td id="tdInterfaceViewportMasterControlSetupNetworkGroup" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlSetupNetworkGroup" class="interfaceViewportMasterControl">' +
					'Network&nbsp;Groups</span>' +
					'</td></tr>';
					
		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlSetupMessaging" class="interfaceViewportMasterControl">' +	
					'<td id="tdInterfaceViewportMasterControlSetupMessaging" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlSetupMessaging" class="interfaceViewportMasterControl">' +
					'Messaging</span>' +
					'</td></tr>';			
					
		aHTML[++h] = '</table>';
		aHTML[++h] = '</td>';
		
		aHTML[++h] = '<td id="tdInterfaceViewportMasterSetupControlColumn2" class="interfaceViewportMasterControlColumn">';
		aHTML[++h] = '<table id="tableInterfaceViewportMasterSetupControlColumn2" class="interfaceViewportMasterControlColumn">';

		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlSetupWebsite" class="interfaceViewportMasterControl">' +
					'<td id="tdInterfaceViewportMasterControlSetupWebsite" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlSetupWebsite" class="interfaceViewportMasterControl">' +
					'Websites</span>' +
					'</td></tr>';
	
		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlSetupStructures" class="interfaceViewportMasterControl">' +	
					'<td id="tdInterfaceViewportMasterControlSetupStructures" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlSetupStructures" class="interfaceViewportMasterControl">' +
					'Structures</span>' +
					'</td></tr>';
					
		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlSetupAutomation" class="interfaceViewportMasterControl">' +	
					'<td id="tdInterfaceViewportMasterControlSetupAutomation" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlSetupAutomation" class="interfaceViewportMasterControl">' +
					'Automation</span>' +
					'</td></tr>';			
					
		if (false)
		{
			aHTML[++h] = '<tr id="trInterfaceViewportMasterControlSetupImport" class="interfaceViewportMasterControl">' +	
						 '<td id="tdInterfaceViewportMasterControlSetupImport" class="interfaceViewportMasterControl">' +
						 '<span id="spanInterfaceViewportMasterControlSetupImport" class="interfaceViewportMasterControl">' +
						 'Imports</span>' +
						 '</td></tr>';
		}
					
		aHTML[++h] = '</table>';
		aHTML[++h] = '</td>';
	
		aHTML[++h] = '<td id="tdInterfaceViewportMasterSetupControlColumn2" class="interfaceViewportMasterControlColumn">';
		aHTML[++h] = '<table id="tableInterfaceViewportMasterSetupControlColumn2" class="interfaceViewportMasterControlColumn">';

		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlSetupFinancial" class="interfaceViewportMasterControl">' +	
					'<td id="tdInterfaceViewportMasterControlSetupFinancial" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlSetupFinancial" class="interfaceViewportMasterControl">' +
					'Financials</span>' +
					'</td></tr>';
					
		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlSetupContactBusinessGroup" class="interfaceViewportMasterControl">' +	
					'<td id="tdInterfaceViewportMasterControlSetupContactBusinessGroup" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlSetupContactBusinessGroup" class="interfaceViewportMasterControl">' +
					'Contact&nbsp;Business&nbsp;Groups</span>' +
					'</td></tr>';
					
		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlSetupContactPersonGroup" class="interfaceViewportMasterControl">' +	
					'<td id="tdInterfaceViewportMasterControlSetupContactPersonGroup" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlSetupContactPersonGroup" class="interfaceViewportMasterControl">' +
					'Contact&nbsp;Person&nbsp;Groups</span>' +
					'</td></tr>';
					
		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlSetupProject" class="interfaceViewportMasterControl">' +	
					'<td id="tdInterfaceViewportMasterControlSetupProject" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlSetupProject" class="interfaceViewportMasterControl">' +
					'Project&nbsp;Templates</span>' +
					'</td></tr>';
	
		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlSetupProjectTask" class="interfaceViewportMasterControl">' +	
					'<td id="tdInterfaceViewportMasterControlSetupProjectTask" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlSetupProjectTask" class="interfaceViewportMasterControl">' +
					'Project&nbsp;Template&nbsp;Tasks</span>' +
					'</td></tr>';
	
		aHTML[++h] = '</table>';
		aHTML[++h] = '</td>';

		aHTML[++h] = '<td id="tdInterfaceViewportMasterSetupControlColumn3" class="interfaceViewportMasterControlColumn">';
		aHTML[++h] = '<table id="tableInterfaceViewportMasterSetupControlColumn3" class="interfaceViewportMasterControlColumn">';

		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlSupportIssue" class="interfaceViewportMasterControl">' +	
					'<td id="tdInterfaceViewportMasterControlSupportIssue" class="interfaceViewportMasterControl">' +
					'<span id="spanInterfaceViewportMasterControlSupportIssue" class="interfaceViewportMasterControl">' +
					'Support&nbsp;Issues</span>' +
					'</td></tr>';
					
		aHTML[++h] = '</table>';
		aHTML[++h] = '</td>';
		
	}	
	
	aHTML[++h] = '</tr></table>'
	
	return aHTML.join('');	
}

function interfaceControlSetupOptionsBind()
{
	$('#tdInterfaceViewportMasterControlSetupWebsite').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceSetupWebsiteMasterViewport();
	});
		
	$('#tdInterfaceViewportMasterControlSetupUser').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceSetupUserMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlSetupUserRole').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceSetupUserRoleMasterViewport();
	});

	$('#tdInterfaceViewportMasterControlSetupNetworkGroup').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceSetupNetworkGroupMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlSetupAutomation').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceSetupAutomationMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlSetupMessaging').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceSetupMessagingMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlSetupImport').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceSetupImportMasterViewport();
	});

	$('#tdInterfaceViewportMasterControlSetupFinancial').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceSetupFinancialMasterViewport();
	});

	$('#tdInterfaceViewportMasterControlSetupContactBusinessGroup').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceSetupMasterViewport(
				{
				setupName: "Contact Business Groups",
				setupMethod: "SETUP_CONTACT_BUSINESS_GROUP"
				});
	});
	
	$('#tdInterfaceViewportMasterControlSetupContactPersonGroup').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceSetupMasterViewport(
				{
				setupName: "Contact Person Groups",
				setupMethod: "SETUP_CONTACT_PERSON_GROUP"
				});
	});
	
	$('#tdInterfaceViewportMasterControlSetupProject').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceSetupProjectMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlSetupProjectTaak').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceSetupProjectTaskMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlSupportIssue').click(function(event)
	{
		ns1blankspaceOptionsSource();
		interfaceSupportIssueMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlSetupStructures').click(function(event)
	{
		interfaceSetupStructureMasterViewport();
	});
}

function interfaceControlUserOptionsShow(oElement)
{
	if ($('#divns1blankspaceViewportControlOptions').attr('onDemandSource') == oElement.id)
	{
		$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
		$('#divns1blankspaceViewportControlOptions').attr('onDemandSource', '');
	}
	else
	{	
		$('#divns1blankspaceViewportControlOptions').attr('onDemandSource', oElement.id);
		$('#divns1blankspaceViewportControlOptions').html("&nbsp;");
		$('#divns1blankspaceViewportControlOptions').show(ns1blankspace.option.showSpeedOptions);
		$('#divns1blankspaceViewportControlOptions').offset({ top: $(oElement).offset().top + $(oElement).height(), left: $(oElement).offset().left });
		$('#divns1blankspaceViewportControlOptions').html(interfaceControlUserOptions);
			
		interfaceControlUserOptionsBind();
	}	
}


function interfaceControlUserOptions()
{

	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<table id="tablens1blankspaceUserOptions" class="interfaceViewportMasterControl">';
		
	aHTML[++h] = '<tr id="trns1blankspaceUserOptionsLogOff" class="ns1blankspaceUserOptions">' +
					'<td id="tdns1blankspaceUserOptionsLogOff" class="ns1blankspaceUserOptions">' +
					'Log Off' +
					'</td>' +
					'</tr>'
				
	aHTML[++h] = '<tr id="trns1blankspaceUserOptionsChangePassword" class="ns1blankspaceUserOptions">' +
					'<td id="tdns1blankspaceUserOptionsChangePassword" class="ns1blankspaceUserOptions">' +
					'Change My Password' +
					'</td>' +
					'</tr>'			
				
	aHTML[++h] = '<tr id="trns1blankspaceUserOptionsCreateSecureKey" class="ns1blankspaceUserOptions">' +
					'<td id="tdns1blankspaceUserOptionsCreateSecureKey" class="ns1blankspaceUserOptions">' +
					'Secure Access Token' +
					'</td>' +
					'</tr>'						
					
	aHTML[++h] = '</table>'
	
	return aHTML.join('');
}

function interfaceControlUserOptionsBind()
{

	$('#tdns1blankspaceUserOptionsLogOff').click(function(event)
	{
		ns1blankspaceLogoff();
	})
	
	$('#tdns1blankspaceUserOptionsChangePassword').click(function(event)
	{
		$(this).html(ns1blankspace.xhtml.loadingSmall);
		ns1blankspaceUserOptionsChangePassword();
	});
	
	$('#tdns1blankspaceUserOptionsCreateSecureKey').click(function(event)
	{
		$(this).html(ns1blankspace.xhtml.loadingSmall);
		ns1blankspaceUserOptionsCreateSecureKey();
	});
}

function ns1blankspaceUserOptionsChangePassword(oParam)
{
	var aHTML = [];
	var h = -1;
	var bShow = true;
	var sXHTMLElementID = 'divns1blankspaceViewportControlOptions'
	
	if (oParam != undefined)
	{
		if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
		if (oParam.show != undefined) {bShow = oParam.show}
	}	
	
	aHTML[++h] = '<table id="tableInterfaceUserOptionsChangePassword" class="interfaceViewportMasterControl" style="width:350px;">';
		
	if (bShow)
	{
		ns1blankspaceOptionsSetPosition(sXHTMLElementID, 0, -255)
		
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
	
	ns1blankspaceLogonChangePasswordShow({xhtmlElementID: 'tdInterfaceUserOptionsChangePassword'});
	
}

function ns1blankspaceUserOptionsCreateSecureKey(oParam, oResponse)
{
	var aHTML = [];
	var h = -1;
	var bShow = true;
	var bSetPosition = true;
	var sXHTMLElementID = 'divns1blankspaceViewportControlOptions'
	
	if (oParam != undefined)
	{
		if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
		if (oParam.show != undefined) {bShow = oParam.show}
		if (oParam.setPosition != undefined) {bSetPosition = oParam.setPosition}
	}	
	
	if (oResponse == undefined)
	{
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/core/?method=CORE_SECURE_TOKEN_SEARCH&rf=JSON',
			dataType: 'json',
			success: function(data) {ns1blankspaceUserOptionsCreateSecureKey(oParam, data)}
		})
	}
	else
	{	
	
		aHTML[++h] = '<table id="tableInterfaceUserOptionsCreateSecureKey" class="interfaceViewportMasterControl" style="width:400px;"><tr><td>';	

		if (bSetPosition)
		{
			ns1blankspaceOptionsSetPosition(sXHTMLElementID, 0, -305)
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
					success: function(data) {ns1blankspaceUserOptionsCreateSecureKey({setPosition: false})}
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
					success: function(data) {ns1blankspaceUserOptionsCreateSecureKey({setPosition: false})}
				})
			}		
		})
		.css('width', '150px')
	}		
}

function interfaceControlHelpURL()
{
	return 'http://help.1blankspace.com';
}