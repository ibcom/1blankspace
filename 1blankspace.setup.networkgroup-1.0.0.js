function interfaceSetupNetworkGroupMasterViewport(aParam)
{
	gsSetupName = 'Network Group';
	giObjectContext = undefined;
	giObject = -1;
	
	var bShowHome = true;
	
	if (aParam != undefined)
	{
		if (aParam.showHome != undefined) {bShowHome = aParam.showHome}
		if (aParam.showNew != undefined) {bNew = aParam.showNew}
	}	
	
	interfaceMasterReset();		
			
	$('#divInterfaceMasterViewportControlSet').button(
	{
		label: "Network Groups"
	});
	
	$('#inputInterfaceMasterViewportControlSearch').keyup(function(event)
	{
		interfaceSetupNetworkGroupSearch('inputInterfaceMasterViewportControlSearch');
	});
	
	$('#spanInterfaceMasterViewportControlSearch').click(function(event)
	{
		interfaceSetupNetworkGroupSearch('inputInterfaceMasterViewportControlSearch');
	});
	
	$('#spanInterfaceMasterViewportControlSearchOptions').click(function(event)
	{
		interfaceSetupNetworkGroupSearchOptions();
	});
	
	$('#spanInterfaceMasterViewportControlNew').click(function(event)
	{
		interfaceSetupNetworkGroupNew();
	})
	
	$('#spanInterfaceMasterViewportControlNewOptions').click(function(event)
	{
		interfaceSetupNetworkGroupNewOptions();
	});
	
	$('#spanInterfaceMasterViewportControlAction').click(function(event)
	{
		interfaceSetupNetworkGroupSave();
	});
	
	$('#spanInterfaceMasterViewportControlAction').button({disabled: true});
	
	$('#spanInterfaceMasterViewportControlActionOptions').click(function(event)
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

		interfaceMasterViewportActionShow(this, aHTML.join(''), "interfaceContactPersonActionOptionsBind()");
	});
	
	$('#spanInterfaceMasterViewportControlActionOptions').button({disabled: true});
	
	$('#spanInterfaceMasterViewportControlSetupOptions').click(function(event)
	{
		interfaceSetupNetworkGroupSetupOptions();
	});
	
	$('#spanInterfaceMasterViewportControlHelpOptions').click(function(event)
	{
		interfaceSetupNetworkGroupHelp();
	});

	$('td.interfaceViewportMasterControlBrowse').click(function(event)
	{
		interfaceSetupNetworkGroupSearch(event.target.id, giSearchSource_BROWSE);
	});
	
	$('td.interfaceViewportMasterControlBrowseAll').click(function(event)
	{
		interfaceSetupNetworkGroupSearch(event.target.id, giSearchSource_BROWSE);
	});

	$('#divInterfaceViewportControl').html('');		
	if (gbSetFocus) {$('#inputInterfaceMasterViewportControlSearch').focus()};
	if (bShowHome) {interfaceSetupNetworkGroupHomeShow()};
}

function interfaceSetupNetworkGroupHomeShow(aParam, oResponse)
{
	if (oResponse == undefined)
	{
		var aHTML = [];
		var h = -1;
					
		aHTML[++h] = '<table id="tableInterfaceViewportMain" class="interfaceViewportMain">';
		aHTML[++h] = '<tr id="trInterfaceViewportMain" class="interfaceViewportMain">' +
						'<td id="tdInterfaceNetworkGroupHomeMostLikely" class="interfaceViewportMain">' +
						gsLoadingXHTML + 
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMain').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
					
		aHTML[++h] = '<table>';
		aHTML[++h] = '<tr>' +
						'<td id="interfaceMasterViewportSetupLarge" class="interfaceMasterViewportImageLarge">' +
						'&nbsp;' + 
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';		
		
		$('#divInterfaceViewportControl').html(aHTML.join(''));	
		
		$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
		
		var oSearch = new AdvancedSearch();
		oSearch.method = 'SETUP_NETWORK_GROUP_SEARCH';
		oSearch.addField('title');
		oSearch.rows = 10;
		oSearch.addSummaryField('count networkgroupcount')
		oSearch.sort('modifieddate', 'desc');
		oSearch.getResults(function(data) {interfaceSetupNetworkGroupHomeShow(aParam, data)});	
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableInterfaceNetworkGroupHomeMostLikely">';
			aHTML[++h] = '<tr class="trInterfaceNetworkGroupHomeMostLikely">';
			aHTML[++h] = '<td class="tdInterfaceNetworkGroupHomeMostLikelyNothing">Click New to create a network group.</td>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</table>';
		}
		else
		{
			aHTML[++h] = '<table id="tableInterfaceNetworkGroupHomeMostLikely">';
			aHTML[++h] = '<tr>';
			aHTML[++h] = '<td class="interfaceMain">MOST LIKELY</td>';
			aHTML[++h] = '</tr>';

			$.each(oResponse.data.rows, function()
			{	
				aHTML[++h] = '<tr class="interfaceMainRow">';
				
				aHTML[++h] = '<td id="interfaceNetworkGroupHomeMostLikely_Title-' + this.id + 
										'" class="interfaceHomeMostLikely">' +
										this.title +
										'</td>';
				
				aHTML[++h] = '</tr>'
			});
			
			aHTML[++h] = '</tbody></table>';
		}
		
		$('#tdInterfaceNetworkGroupHomeMostLikely').html(aHTML.join(''));
	
		$('td.interfaceHomeMostLikely').click(function(event)
		{
			interfaceSetupNetworkGroupSearch(event.target.id, {source: 1});
		});
	}
}

function interfaceSetupNetworkGroupSearch(sXHTMLElementId, iSource, sSearchText, sSearchContext)
{
	var aSearch = sXHTMLElementId.split('-');
	var sElementId = aSearch[0];
	var sSearchContext = aSearch[1];
		
	if (iSource == undefined)
	{
		iSource = giSearchSource_TEXT_INPUT;
	}	
		
	if (sSearchContext != undefined && iSource != giSearchSource_BROWSE)
	{
		$('#divInterfaceViewportControl').html(gsLoadingXHTML);
		
		giObjectContext = sSearchContext;
		
		var oSearch = new AdvancedSearch();
		oSearch.method = 'SETUP_NETWORK_GROUP_SEARCH';
		oSearch.addField('title');
		oSearch.addFilter('id', 'EQUAL_TO', giObjectContext);
		oSearch.getResults(function(data) {interfaceSetupNetworkGroupShow(data)});
	}
	else
	{
		var iMinimumLength = 3;
		var iMaximumColumns = 1;
		
		if (sSearchText == undefined)
		{
			sSearchText = $('#inputInterfaceMasterViewportControlSearch').val();
		}	
		
		if (iSource == giSearchSource_BROWSE)
		{
			iMinimumLength = 1;
			iMaximumColumns = 4;
			sSearchText = aSearch[1];
			if (sSearchText == '#') {sSearchText = '[0-9]'}
			sElementId = 'tableInterfaceViewportMasterBrowse';
		}
		
		if (sSearchText.length >= iMinimumLength || iSource == giSearchSource_BROWSE)
		{	
			interfaceMasterOptionsSetPosition(sElementId);
			interfaceMasterSearchStart(sElementId);
			
			var sParam = 'method=SETUP_NETWORK_GROUP_SEARCH&quicksearch=' + sSearchText;

			$.ajax(
			{
				type: 'GET',
				url: '/ondemand/setup/?' + sParam,
				dataType: 'json',
				success: interfaceSetupNetworkGroupSearchShow
			});
		}
	};	
}

function interfaceSetupNetworkGroupSearchShow(oResponse)
{

	var iColumn = 0;
	var aHTML = [];
	var h = -1;
	var	iMaximumColumns = 1;
		
	if (oResponse.data.rows.length == 0)
	{
		interfaceMasterSearchStop();
		$('#divInterfaceMasterViewportControlOptions').hide();
	}
	else
	{
		aHTML[++h] = '<table class="interfaceSearchMedium">';
		aHTML[++h] = '<tbody>'
			
		$.each(oResponse.data.rows, function()
		{
			iColumn = iColumn + 1;
			
			if (iColumn == 1)
			{
				aHTML[++h] = '<tr class="interfaceSearch">';
			}
			
			aHTML[++h] = '<td class="interfaceSearch" id="' +
							'-' + this.id + '">' +
							this.title + '</td>';
			
			if (iColumn == iMaximumColumns)
			{
				aHTML[++h] = '</tr>'
				iColumn = 0;
			}	
		});
    	
		aHTML[++h] = '</tbody></table>';

		$('#divInterfaceMasterViewportControlOptions').html(aHTML.join(''));
		$('#divInterfaceMasterViewportControlOptions').show(giShowSpeedOptions);
		interfaceMasterSearchStop();
		
		$('td.interfaceSearch').click(function(event)
		{
			$('#divInterfaceMasterViewportControlOptions').html('&nbsp;');
			$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions)
			interfaceSetupNetworkGroupSearch(event.target.id, 1);
		});
	}
}

function interfaceSetupNetworkGroupViewport()
{
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceViewportControlContext" class="interfaceViewportControlContext"></div>';
	
	aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
	
	if (giObjectContext == -1)
	{
		aHTML[++h] = '<tr id="trInterfaceViewportControl2" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlDetails" class="interfaceViewportControl interfaceViewportControlHighlight">Details</td>' +
					'</tr>';
	}
	else
	{
		aHTML[++h] = '<tr id="trInterfaceViewportControl1" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlSummary" class="interfaceViewportControl interfaceViewportControlHighlight">Summary</td>' +
						'</tr>';
						
		aHTML[++h] = '<tr id="trInterfaceViewportControl2" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlDetails" class="interfaceViewportControl">Details</td>' +
						'</tr>';
						
		aHTML[++h] = '<tr id="trInterfaceViewportControl" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlMembersAdd" class="interfaceViewportControl">Add Members</td>' +
						'</tr>';
	}
	
	aHTML[++h] = '</table>';					
				
	$('#divInterfaceViewportControl').html(aHTML.join(''));
	
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceMainSummary" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainDetails" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainMembersAdd" class="divInterfaceViewportMain"></div>';
		
	$('#divInterfaceMain').html(aHTML.join(''));
		
	$('#tdInterfaceViewportControlSummary').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainSummary");
		interfaceSetupNetworkGroupSummary();
	});
	
	$('#tdInterfaceViewportControlDetails').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainDetails");
		interfaceSetupNetworkGroupDetails();
	});
	
	$('#tdInterfaceViewportControlMembersAdd').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainMembersAdd", true);
		interfaceSetupNetworkGroupMembersAdd();
	});	
}

function interfaceSetupNetworkGroupShow(oResponse)
{
	$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
	interfaceSetupNetworkGroupViewport();
	
	var aHTML = [];
	var h = -1;
	
	if (oResponse.data.rows.length == 0)
	{
		goObjectContext = undefined;
		
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find Network Group.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		goObjectContext = oResponse.data.rows[0];
	
		$('#divInterfaceViewportControlContext').html(goObjectContext.title);
		
		aHTML[++h] = '<table id="tableInterfaceMainSummary" class="interfaceMain">';
		aHTML[++h] = '<tr id="trInterfaceMainSummaryRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainSummaryColumn1" class="interfaceMainColumn1">' +
						'</td>' +
						'<td id="tdInterfaceMainSummaryColumn2" class="interfaceMainColumn2">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMainSummary').html(aHTML.join(''));
		$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
		$('#spanInterfaceMasterViewportControlActionOptions').button({disabled: false});
		
		interfaceSetupNetworkGroupSummary();
	}	
}		
		
function interfaceSetupNetworkGroupSummary()
{
	var aHTML = [];
	var h = -1;
	
	if (goObjectContext == undefined)
	{
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find Network Group.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMainColumn1">';
		aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryContactSynchronisation" class="interfaceMain">';
		
		if (goObjectContext.contactsynchronisation == 'Y')
		{
			aHTML[++h] = 'Contact synchronisation is enabled.';
			//aHTML[++h] = '<br /><br />Updated member details are automatically sent to webmaster@rotarydistrict9800.com.au';
		}
		else
		{	
			aHTML[++h] = 'Contact synchronisation is disabled.'
		}	
		
		aHTML[++h] = '</td></tr></table>';					
		
		$('#tdInterfaceMainSummaryColumn1').html(aHTML.join(''));

		var aHTML = [];
		var h = -1;	
		
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMainColumn2">';
		
		//aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryTask1" class="interfaceMainSummary">' +
		//				'<a href="#" id="aInterfaceMainSummaryAddMember">Add Member</a>' +
		//				'</td></tr>';
										
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn2').html(aHTML.join(''));
		
		$('#aInterfaceMainSummaryAddAttachment').click(function(event)
		{
			interfaceMasterMainViewportShow("#divInterfaceMainAddMember");
			interfaceSetupNetworkGroupAddMember();
		});
			
	}	
}

function interfaceSetupNetworkGroupDetails()
{
	var aHTML = [];
	var h = -1;
	
	if ($('#divInterfaceMainDetails').html()  == gsLoadingXHTML)
	{			
		aHTML[++h] = '<table id="tableInterfaceMainDetails" class="interfaceMainDetails">';
		aHTML[++h] = '<tr id="trInterfaceMainDetailsRow1" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsColumn1" class="interfaceMainColumn1">' +
						'</td>' +
						'<td id="tdInterfaceMainDetailsColumn2" class="interfaceMainColumn2">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMainDetails').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn1" class="interfaceMain">';
	
		aHTML[++h] = '<tr id="trInterfaceMainDetailsTitle" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsTitle" class="interfaceMain">' +
						'Title' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsTitleValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsTitleValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainDetailsTitle" class="inputInterfaceMainText">' +
						'</td></tr>';
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsSharing" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsSharing" class="interfaceMain">' +
						'Contact Synchronisation' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsContactSynchronisation" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsContactSynchronisationValue" class="interfaceMainText">' +
						'<input type="radio" id="radioContactSynchronisationY" name="radioContactSync" value="Y"/>Enabled' +
						'<br /><input type="radio" id="radioContactSynchronisationN" name="radioContactSync" value="N"/>Disabled' +
						'</td></tr>';
					
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainDetailsColumn1').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
			
		aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn2" class="interfaceMain">';
	
		aHTML[++h] = '<tr id="trInterfaceMainDetailsDescription" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsDescription" class="interfaceMain">' +
						'Description' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsDescriptionValue" class="interfaceMainTextMulti">' +
						'<td id="tdInterfaceMainDetailsDescriptionValue" class="interfaceMainTextMulti">' +
						'<textarea rows="10" cols="35" id="inputInterfaceMainDetailsDescription" class="inputInterfaceMainTextMulti"></textarea>' +
						'</td></tr>';
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainDetailsColumn2').html(aHTML.join(''));
		
		if (goObjectContext != undefined)
		{
			$('#inputInterfaceMainDetailsTitle').val(goObjectContext.title);
			$('[name="radioContactSync"][value="' + goObjectContext.contactsynchronisation + '"]').attr('checked', true);
		}
		
		$('#inputInterfaceMainDetailsStatus').keyup(function(event)
		{
			$('#divInterfaceMasterViewportControlOptions').hide(200);
			interfaceMasterElementOptionsSearch(event.target.id);
		});		
		
	}	
}

function interfaceSetupNetworkGroupMembers()
{
	var aHTML = [];
	var h = -1;
	
	if ($('#divInterfaceMainMembers').html() == gsLoadingXHTML)
	{			
		aHTML[++h] = '<table id="tableInterfaceMainAttachments" class="interfaceMainDetails">';
		aHTML[++h] = '<tr id="trInterfaceMainAttachmentsRow1" class="interfaceMain">' +
						'<td style="width: 650px" id="tdInterfaceMainAttachmentsColumn1" class="interfaceMainColumn1">' +
						'</td>' +
						'<td id="tdInterfaceMainDetailsColumn2" class="interfaceMainColumn2">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMainMembers').html(aHTML.join(''));
			
		$('#tdInterfaceMainMembersColumn1').html(gsLoadingXHTML);
		interfaceMasterAttachments("tdInterfaceMainMembersColumn1");
		
		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMain">';
				
		aHTML[++h] = '<tr id="trInterfaceMainDetailsMembersAdd" class="interfaceMainTextMulti">' +
						'<td id="tdInterfaceMainDetailsMembersAdd" class="interfaceMainTextMulti">' +
						'<span id="spanInterfaceMainMembersAdd">Add</span>' +
						'</td></tr>';
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainDetailsColumn2').html(aHTML.join(''));
		
		$('#spanInterfaceMainMembersAdd').button(
		{
			text: "Add"
		})
		.click(function() {
			interfaceMasterMainViewportShow("#divInterfaceMainAddAttachment");
			interfaceSetupNetworkGroupAddMember();
		})
		
	}	
}

function interfaceSetupNetworkGroupSave()
{

	var sParam = 'method=SETUP_NETWORK_GROUP_MANAGE';
	var sData = '_=1';
	
	if (glObjectContext != -1)
	{
		sParam += '&id=' + glObjectContext	
	}	
	
	if ($('#divInterfaceMainDetails').html() != '')
	{
		sData += '&title=' + encodeURIComponent($('#inputInterfaceMainDetailsTitle').val());
		sData += '&contactsynchronisation=' + $('input[name="radioContactSync"]:checked').val();
	};

	$.ajax(
	{
		type: 'POST',
		url: '/ondemand/setup/?' + sParam,
		data: sData,
		dataType: 'text',
		success: function(data) 
					{ 
						var aReturn = data.split('|');
						glObjectContext = aReturn[2];
						glSetupContext = aReturn[2];
						interfaceMasterStatus('Network Group Saved.');
						
						if ($('input[name="radioContactSync"]:checked').val() == 'Y')
						{
							interfaceSetupNetworkGroupMembersAddSyncProcess(gsParentWebMasterLogonName);
						}
					}
	});
		
}



function interfaceSetupNetworkGroupMembersAddSyncProcess(gsParentWebMasterLogonName)
{
	
	var sParam = 'method=SETUP_NETWORK_GROUP_MEMBER_MANAGE';
	var sData = '_=1';
	
	sData += '&networkgroup=' + glSetupContext
	sData += '&userlogonname=' + encodeURIComponent(gsParentWebMasterLogonName);
	sData += '&sendalertwhenmemberupdated=Y';
	
	$.ajax(
	{
		type: 'POST',
		url: '/ondemand/setup/?' + sParam,
		data: sData,
		dataType: 'text',
		success: interfaceMasterStatus('Network Group Saved.')
	});
	
}
		
function interfaceSetupNetworkGroupMembersAdd(oResponse)
{
	if (oResponse == undefined)
	{
		var aHTML = [];
		var h = -1;
				
		aHTML[++h] = '<table id="tableInterfaceMainAttachments" class="interfaceMainDetails">';
		aHTML[++h] = '<tr id="trInterfaceMainAttachmentsRow1" class="interfaceMain">' +
						'<td style="width: 650px" id="tdInterfaceMainAttachmentsColumn1" class="interfaceMainColumn1">' +
						'</td>' +
						'<td id="tdInterfaceMainAttachmentsColumn2" class="interfaceMainColumn2">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMainMembersAdd').html(aHTML.join(''));
	
		var aHTML = [];
		var h = -1;

		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMain">';
				
		aHTML[++h] = '<tr id="trInterfaceMainMembersAddContactBusiness" class="interfaceMain">' +
						'<td id="tdInterfaceMainMembersAddContactBusiness" class="interfaceMain">' +
						'Select the contact business from which to add members' +					
						'</td></tr>' +
						'<tr id="trInterfaceMainMembersAddContactBusinessValue" class="interfaceMainSelect">' +
						'<td id="tdInterfaceMainMembersAddContactBusinessValue" class="interfaceMainSelect">' +
						'<input id="inputInterfaceMainMembersAddContactBusiness" class="inputInterfaceMainSelect"' +
							' onDemandMethod="/ondemand/contact?rf=XML&method=CONTACT_BUSINESS_SEARCH' +
							' onDemandColumns="tradename">' +
						'</td></tr>';
		
		aHTML[++h] = '<tr id="trInterfaceMainMembersAddSyncUser" class="interfaceMain">' +
						'<td id="tdInterfaceMainMembersAddSyncUser" class="interfaceMain">' +
						'User (logon name) to send updates to' +
						'</td></tr>' +
						'<tr id="trInterfaceMainMembersAddSyncUserValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainMembersAddSyncUserValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainMembersAddSyncUser" class="inputInterfaceMainText">' +
						'</td></tr>';
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainAttachmentsColumn1').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMain">';
				
		aHTML[++h] = '<tr id="trInterfaceMainMembersAdd" class="interfaceMainTextMulti">' +
						'<td id="tdInterfaceMainMembersAdd" class="interfaceMainTextMulti">' +
						'<span id="spanInterfaceMainMembersAddAdd">Add</span>' +
						'</td></tr>';
	
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainAttachmentsColumn2').html(aHTML.join(''));
		
		$('#spanInterfaceMainMembersAddAdd').button(
		{
			text: "Add"
		})
		.click(function() 
		{
			var sParam = 'method=CONTACT_PERSON_SEARCH&rows=2&quicksearch=Auto';
			var sData = 'contactbusiness=' + $('#inputInterfaceMainMembersAddContactBusiness').attr("ondemandID");
		
			$.ajax(
			{
				type: 'POST',
				url: '/ondemand/contact/?' + sParam,
				data: sData,
				dataType: 'json',
				success: interfaceSetupNetworkGroupMembersAdd
			});
		});
	}
	else
	{
		if (oResponse.data.rows.length == 0)
		{
			
		}
		else
		{
			var aHTML = [];
			var h = -1;

			aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMain">';
					
			aHTML[++h] = '<tr id="trInterfaceMainMembersAdd" class="interfaceMainTextMulti">' +
							'<td id="tdInterfaceMainDetailsMembersAddStatus" class="interfaceMainTextMulti">' +
							gsLoadingSmallXHTML +
							' &nbsp;Adding members...'
							'</td></tr>';
			
			aHTML[++h] = '</table>';					
			
			$('#tdInterfaceMainAttachmentsColumn1').html(aHTML.join(''));
			
			$.each(oResponse.data.rows, function()
			{
				var sParam = 'method=SETUP_NETWORK_GROUP_MEMBER_MANAGE';
				var sData = 'networkgroup=' + glSetupContext;
				sData += '&usercontactperson=' +  this.id;
				
				$.ajax(
				{
					type: 'POST',
					url: '/ondemand/setup/?' + sParam,
					data: sData,
					async: false,
					dataType: 'text',
				});
			});
			
			$('#tdInterfaceMainDetailsMembersAddStatus').html('Users add to network group!');
			
			if ($('#inputInterfaceMainMembersAddSyncUser').val() != '')
			{
			
				var sParam = 'method=SETUP_NETWORK_GROUP_MEMBER_MANAGE';
				var sData = '_=1';
				
				sData += '&networkgroup=' + glSetupContext
				sData += '&userlogonname=' + encodeURIComponent($('#inputInterfaceMainMembersAddSyncUser').val());
				sData += '&sendalertwhenmemberupdated=Y';
				
				$.ajax(
				{
					type: 'POST',
					url: '/ondemand/setup/?' + sParam,
					data: sData,
					dataType: 'text',
					success: interfaceMasterStatus('Users added.')
				});
			}
		}	
	}		
}

function interfaceSetupNetworkGroupNew(oXML)
{
	goObjectContext = undefined
	giObjectContext = -1;
	interfaceSetupNetworkGroupViewport();
	interfaceMasterMainViewportShow("#divInterfaceMainDetails");
	$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
	$('#spanInterfaceMasterViewportControlActionOptions').button({disabled: true});
	interfaceSetupNetworkGroupDetails();
}