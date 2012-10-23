var gbRoleBase = false;
var gbRoleOperations = false;
var gbRoleFinancials = false;
var gbRoleSetup = false;
var gbRoleSpecial1 = false;

var gsLoadingXHTML = '<img src="/images/1blankspace.loading.gif">';
var gsLoadingSmallXHTML = '<img id="imgInterfaceLoadingSmall" src="/images/1blankspace.loading.small.gif">';
var giReturnRows = 20;
var gsEditorCSS = '';
var gsViewportDefault = "People";
var gsSetupViewportDefault = "Website";

var giObjectPerson = 32;
var giObjectBusiness = 12;
var giObjectOpportunity = 35;

var gaAttachmentTypes = [];
var gaNetworkGroups;

var gbDebug = true;
var gbShowAdd = true;
var gbReturnToLast = false;

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

function interfaceControlOptions()
{

	//TODO:Update for Mobile - use dialog

	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<table id="tableInterfaceViewportMasterControl" class="interfaceViewportMasterControl">';
	aHTML[++h] = '<tr id="trInterfaceViewportMasterControlRow1" class="interfaceViewportMasterControl">';
	
	if (gbRoleBase)
	{	
	
		aHTML[++h] = '<td id="tdInterfaceViewportMasterControlcolumn1" class="interfaceViewportMasterControlColumn">';
		aHTML[++h] = '<table id="tableInterfaceViewportMasterControlColumn1" class="interfaceViewportMasterControlColumn">';

		aHTML[++h] = '<tr class="interfaceViewportMasterControl">' +
					'<td id="interfaceMasterViewportContact" class="interfaceMasterViewportImage">' +
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
					'Messaging</span>' +
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
					'<td id="interfaceMasterViewportProject" class="interfaceMasterViewportImage">' +
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
					'<td id="interfaceMasterViewportDocument" class="interfaceMasterViewportImage">' +
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
					'<td id="interfaceMasterViewportProduct" class="interfaceMasterViewportImage">' +
					'&nbsp;' +
					'</td></tr>';
		
		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlProduct" class="interfaceViewportMasterControl">' +
					'<td id="tdInterfaceViewportMasterControlProduct" class="interfaceViewportMasterControl version2">' +
					'<span id="spanInterfaceViewportMasterControlProduct" class="interfaceViewportMasterControl version2">' +
					'Products</span>' +
					'</td>' +
					'</tr>'
	
		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlOrder" class="interfaceViewportMasterControl">' +
					'<td id="tdInterfaceViewportMasterControlOrder" class="interfaceViewportMasterControl version2">' +
					'<span id="spanInterfaceViewportMasterControlOrder" class="interfaceViewportMasterControl version2">' +
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
					'<td id="interfaceMasterViewportFinancial" class="interfaceMasterViewportImage">' +
					'&nbsp;' +
					'</td></tr>';
				
		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlFinancial" class="interfaceViewportMasterControl">' +
					'<td id="tdInterfaceViewportMasterControlFinancial" class="interfaceViewportMasterControl version3">' +
					'<span id="spanInterfaceViewportMasterControlFinancial" class="interfaceViewportMasterControl version3">' +
					'Financials</span>' +
					'</td>' +
					'</tr>';	
					
		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlFinancialInvoice" class="interfaceViewportMasterControl">' +
					'<td id="tdInterfaceViewportMasterControlFinancialInvoice" class="interfaceViewportMasterControl version3">' +
					'<span id="spanInterfaceViewportMasterControlFinancialInvoice" class="interfaceViewportMasterControl version3">' +
					'Invoices</span>' +
					'</td>' +
					'</tr>';
					
		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlFinancialExpense" class="interfaceViewportMasterControl">' +
					'<td id="tdInterfaceViewportMasterControlFinancialExpense" class="interfaceViewportMasterControl version3">' +
					'<span id="spanInterfaceViewportMasterControlFinancialExpense" class="interfaceViewportMasterControl version3">' +
					'Expense</span>' +
					'</td>' +
					'</tr>';	
					
		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlFinancialReceipt" class="interfaceViewportMasterControl">' +
					'<td id="tdInterfaceViewportMasterControlFinancialReceipt" class="interfaceViewportMasterControl version3">' +
					'<span id="spanInterfaceViewportMasterControlFinancialReceipt" class="interfaceViewportMasterControl version3">' +
					'Receipt</span>' +
					'</td>' +
					'</tr>';	
					
		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlFinancialPayment" class="interfaceViewportMasterControl">' +
					'<td id="tdInterfaceViewportMasterControlFinancialPayment" class="interfaceViewportMasterControl version3">' +
					'<span id="spanInterfaceViewportMasterControlFinancialPayment" class="interfaceViewportMasterControl version3">' +
					'Payment</span>' +
					'</td>' +
					'</tr>';	
					
		aHTML[++h] = '</table>'
		aHTML[++h] = '</td>';			
	}
	
	if (giVersion > 1)
	{
		aHTML[++h] = '<td id="tdInterfaceViewportMasterControlcolumn6" class="interfaceViewportMasterControlColumn">';

		aHTML[++h] = '<table id="tableInterfaceViewportMasterControlColumn6" class="interfaceViewportMasterControlColumn">';
			
		aHTML[++h] = '<tr class="interfaceViewportMasterControl">' +
						'<td id="interfaceMasterViewportHelp" class="interfaceMasterViewportImage">' +
						'&nbsp;' +
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceViewportMasterControlHelp" class="interfaceViewportMasterControl">' +
						'<td id="tdInterfaceViewportMasterControlHelp" class="interfaceViewportMasterControl">' +
						'<span id="spanInterfaceViewportMasterControlHelp" class="interfaceViewportMasterControl">' +
						'Help</span>' +
						'</td>' +
						'</tr>'
	
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
		interfaceMasterOptionsSource();
		interfaceContactPersonMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlContactBusiness').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceContactBusinessMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlOpportunity').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceOpportunityMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlProject').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceProjectMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlProjectTask').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceProjectTaskMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlAction').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceActionMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlDocument').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceDocumentMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlNews').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceNewsMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlEvent').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceEventMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlProduct').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceProductMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlOrder').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceOrderMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlFinancial').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceFinancialMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlFinancialInvoice').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceFinancialInvoiceMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlHelp').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceHelpMasterViewport();
	});
	
	$('#tdInterfaceViewportMasterControlMessaging').click(function(event)
	{
		interfaceMasterOptionsSource();
		interfaceMessagingMasterViewport();
	});
}