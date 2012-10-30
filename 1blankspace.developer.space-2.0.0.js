/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 
function interfaceDeveloperSpaceMasterViewport()
{

	gsSetupName = 'Spaces';
	goSetupContextXML = '';
	giSetupContext = -1;
	giObjectContext = -1;
	giObject = -1;
	
	interfaceMasterReset();		
			
	$('#divInterfaceMasterViewportControlSet').button(
	{
		label: "Spaces"
	});
	
	$('#inputInterfaceMasterViewportControlSearch').keyup(function(event)
	{
		if (giKeyPressTimeoutId != 0) {clearTimeout(giKeyPressTimeoutId)};
        giKeyPressTimeoutId = setTimeout("interfaceDeveloperSpaceSearch('inputInterfaceMasterViewportControlSearch')", giWaitForStop);
	});
	
	$('#spanInterfaceMasterViewportControlSearch').click(function(event)
	{
		interfaceDeveloperSpaceSearch('inputInterfaceMasterViewportControlSearch');
	});
	
	$('#spanInterfaceMasterViewportControlSearchOptions').click(function(event)
	{
		interfaceDeveloperSpaceSearchOptions();
	});
	
	$('#spanInterfaceMasterViewportControlNew').click(function(event)
	{
		interfaceDeveloperSpaceNew();
	})
	
	$('#spanInterfaceMasterViewportControlNewOptions').click(function(event)
	{
		interfaceDeveloperSpaceNewOptions();
	});
	
	$('#spanInterfaceMasterViewportControlAction').click(function(event)
	{
		interfaceDeveloperSpaceSave();
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
		
	$('#spanInterfaceMasterViewportControlSetup').click(function(event)
	{
		interfaceDeveloperSpaceSetup();
	});
	
	$('#spanInterfaceMasterViewportControlSetupOptions').click(function(event)
	{
		interfaceDeveloperSpaceSetupOptions();
	});
	
	$('#spanInterfaceMasterViewportControlHelp').click(function(event)
	{
		interfaceDeveloperSpaceHelp();
	});
	
	$('#spanInterfaceMasterViewportControlHelpOptions').click(function(event)
	{
		interfaceDeveloperSpaceHelpOptions();
	});

	$('td.interfaceViewportMasterControlBrowse').click(function(event)
	{
		interfaceDeveloperSpaceSearch(event.target.id, {source: giSearchSource_BROWSE});
	});
	
	$('td.interfaceViewportMasterControlBrowseAll').click(function(event)
	{
		interfaceDeveloperSpaceSearch(event.target.id, {source: giSearchSource_BROWSE});
	});
	
	$('#inputInterfaceMasterViewportControlSearch').focus();
	
	interfaceDeveloperSpaceHomeShow();
	
}

function interfaceDeveloperSpaceHomeShow(oResponse)
{

	if (oResponse == undefined)
	{
		var aHTML = [];
		var h = -1;
					
		aHTML[++h] = '<table id="tableInterfaceMainSummary" class="interfaceMain">';
		aHTML[++h] = '<tr id="trInterfaceMainSummaryRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceWebsiteHomeMostLikely" class="interfaceMainColumn1Large">' +
						'</td>' +
						'<td id="tdInterfaceMainSummaryColumn2Action" style="width:175px;">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';		
						
		$('#divInterfaceMain').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" cellspacing=0>';
		
		//aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryTask3" class="interfaceMainColumn2Action" style="width:175px;">' +
		//				'<a href="/site/1262/mydigitalspace_attachment_loader.zip"' +
		//				' id="aInterfaceMainSummaryAttachmentUploader">Download File Attachment Uploader</a>' +
		//				'</td></tr>';
										
		aHTML[++h] = '</td></tr></table>';					

		$('#tdInterfaceMainSummaryColumn2Action').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
					
		aHTML[++h] = '<table>';
		aHTML[++h] = '<tr>' +
						'<td id="interfaceMasterViewportDeveloperSpaceLarge" class="interfaceMasterViewportImageLarge">' +
						'&nbsp;' + 
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';		
		
		$('#divInterfaceViewportControl').html(aHTML.join(''));	
		
		$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
		
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/admin/?method=ADMIN_REGISTRATION_SEARCH',
			dataType: 'json',
			success: interfaceDeveloperSpaceHomeShow
		});
		
	}
	else
	{
		var aHTML = [];
		var h = -1;
	
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableInterfaceWebsiteHomeMostLikely">';
			aHTML[++h] = '<tr class="trInterfaceWebsiteHomeMostLikelyNothing">';
			aHTML[++h] = '<td class="tdInterfaceWebsiteHomeMostLikelyNothing">Click New to register a new space.</td>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</table>';
		}
		else
		{
		
			aHTML[++h] = '<table id="tableInterfaceWebsiteHomeMostLikely">';
			
			$.each(oResponse.data.rows, function()
			{	
				aHTML[++h] = '<tr class="interfaceMainRow">';
				
				aHTML[++h] = '<td id="interfaceDeveloperSpaceHomeMostLikely_Title-' + this.id + 
										'" class="interfaceHomeMostLikely">' +
										this.contactbusinesstext +
										'</td>';
				
				aHTML[++h] = '</tr>'
			});
			
			aHTML[++h] = '</tbody></table>';
		}
		
		$('#tdInterfaceWebsiteHomeMostLikely').html(aHTML.join(''));
	
		$('td.interfaceHomeMostLikely').click(function(event)
		{
			interfaceDeveloperSpaceSearch(event.target.id, {source: 1});
		});
	}
}

function interfaceDeveloperSpaceSearch(sXHTMLElementId, aParam)
{
	var aSearch = sXHTMLElementId.split('-');
	var sElementId = aSearch[0];
	var sSearchContext = aSearch[1];
	var iMinimumLength = 3;
	var iSource = giSearchSource_TEXT_INPUT;
	var sSearchText;
	var iMaximumColumns = 1;
	var iRows = 10;
	
	if (aParam != undefined)
	{
		if (aParam.source != undefined) {iSource = aParam.source}
		if (aParam.searchText != undefined) {sSearchText = aParam.searchText}
		if (aParam.rows != undefined) {iRows = aParam.rows}
		if (aParam.searchContext != undefined) {sSearchContext = aParam.searchContext}
		if (aParam.minimumLength != undefined) {iMinimumLength = aParam.minimumLength}
		if (aParam.maximumColumns != undefined) {iMaximumColumns = aParam.maximumColumns}
	}
		
	if (sSearchContext != undefined && iSource != giSearchSource_BROWSE)
	{
	
		$('#divInterfaceViewportControl').html(gsLoadingXHTML);
		
		giSetupContext = sSearchContext;
		giObjectContext = sSearchContext;
		var sParam = 'method=ADMIN_REGISTRATION_SEARCH&id=' + giObjectContext;
		
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/admin/?' + sParam,
			dataType: 'json',
			success: function(data) {interfaceDeveloperSpaceShow(aParam, data)}
		});
	}
	else
	{
		
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
			
			var sParam = 'method=ADMIN_REGISTRATION_SEARCH&contactbusinesstext=' + sSearchText + 
								'&xhtmlcontext=' + sXHTMLElementId;

			$.ajax(
			{
				type: 'GET',
				url: '/ondemand/admin/?' + sParam,
				dataType: 'json',
				success: function(data) {interfaceDeveloperSpaceSearchShow(aParam, data)}
			});
			
		}
	};	
}

function interfaceDeveloperSpaceSearchShow(aParam, oResponse)
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
			
			aHTML[++h] = '<td class="interfaceSearch" id="registration-' +
							this.id + '">' +
							this.contactbusinesstext + '</td>';
			
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
			interfaceDeveloperSpaceSearch(event.target.id, 1);
		});
	}	
			
}

function interfaceDeveloperSpaceViewport()
{
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceViewportControlContext" class="interfaceViewportControlContext"></div>';
	
	aHTML[++h] = '<table class="interfaceViewportControl">';
	
	if (giObjectContext != -1)
	{
		aHTML[++h] = '<tr id="trInterfaceViewportControlSummary" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlSummary" class="interfaceViewportControl interfaceViewportControlHighlight">Summary</td>' +
					'</tr>';

		//aHTML[++h] = '<tr id="trInterfaceViewportControlDetails" class="interfaceViewportControl">' +
		//			'<td id="tdInterfaceViewportControlDetails" class="interfaceViewportControl">Details</td>' +
		//			'</tr>';

		aHTML[++h] = '</table>';
				
		aHTML[++h] = '<table class="interfaceViewportControl">';
				
		aHTML[++h] = '<tr id="trInterfaceViewportControlDetails" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlSubscriptions" class="interfaceViewportControl">Subscriptions</td>' +
					'</tr>';					
	}
	else
	{
		aHTML[++h] = '<tr id="trInterfaceViewportControlNew" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlNew" class="interfaceViewportControl interfaceViewportControlHighlight">From New</td>' +
					'</tr>';

		aHTML[++h] = '<tr id="trInterfaceViewportControlNewContact" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlNewContact" class="interfaceViewportControl">Based on contact</td>' +
					'</tr>';			
	}							
													
	aHTML[++h] = '</table>';					
				
	$('#divInterfaceViewportControl').html(aHTML.join(''));
	
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceMainSummary" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainSubscriptions" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainMembers" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainDetails" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainNew" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainNewContact" class="divInterfaceViewportMain"></div>';
		
	$('#divInterfaceMain').html(aHTML.join(''));
		
	$('#tdInterfaceViewportControlSummary').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainSummary");
		interfaceDeveloperSpaceSummary();
	});

	$('#tdInterfaceViewportControlDetails').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainDetails");
		interfaceDeveloperSpaceDetails();
	});

	$('#tdInterfaceViewportControlNew').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainNew");
		interfaceDeveloperSpaceDetails({source: 1});
	});

	$('#tdInterfaceViewportControlNewContact').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainNewContact");
		interfaceDeveloperSpaceDetails({source: 2});
	});
	
	$('#tdInterfaceViewportControlSubscriptions').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainSubscriptions");
		interfaceDeveloperSpaceSubscriptions();
	});

	$('#tdInterfaceViewportControlMembers').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainMembers");
		interfaceDeveloperSpaceMembers();
	});
}

function interfaceDeveloperSpaceShow(aParam, oResponse)
{

	$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
	interfaceDeveloperSpaceViewport();
	
	var aHTML = [];
	var h = -1;
	
	if (oResponse.data.rows.length == 0)
	{
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find the space or you don\'t have rights to it.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		goObjectContext = undefined;
		
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		goObjectContext = oResponse.data.rows[0];
				
		$('#divInterfaceViewportControlContext').html(goObjectContext.contactbusinesstext);
		
		aHTML[++h] = '<table id="tableInterfaceMainSummary" class="interfaceMain">';
		aHTML[++h] = '<tr id="trInterfaceMainSummaryRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainSummaryColumn1" class="interfaceMainColumn1">' +
						'</td>' +
						'<td id="tdInterfaceMainSummaryColumn2" class="interfaceMainColumn2x">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMainSummary').html(aHTML.join(''));
		
		interfaceDeveloperSpaceSummary();
	}	
}		
		
function interfaceDeveloperSpaceSummary()
{
	var aHTML = [];
	var h = -1;
	
	
	if (goObjectContext == undefined)
	{
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find space or you don\'t have rights to it.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMainColumn1">';
		
		aHTML[++h] = '<tr><td id="tdInterfaceMainSummarySpaceID" class="interfaceMainSummary">Space ID</td></tr>' +
						'<tr><td id="tdInterfaceMainSummarySpaceID" class="interfaceMainSummaryValue">' +
						goObjectContext.space +
						'</td></tr>';
						
		aHTML[++h] = '<tr><td class="interfaceMainSummary">Initial Logon Name</td></tr>' +
						'<tr><td class="interfaceMainSummaryValue">' +
						goObjectContext.initiallogonname +
						'</td></tr>';

		aHTML[++h] = '<tr><td class="interfaceMainSummary">Initial Password</td></tr>' +
						'<tr><td class="interfaceMainSummaryValue">' +
						goObjectContext.initialpassword +
						'</td></tr>';

		aHTML[++h] = '<tr><td class="interfaceMainSummary">Creation Date</td></tr>' +
						'<tr><td class="interfaceMainSummaryValue">' +
						goObjectContext.registrationdate +
						'</td></tr>';								
										
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn1').html(aHTML.join(''));

		var aHTML = [];
		var h = -1;	
		
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMainColumn2">';
		
		//aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryTask3" class="interfaceMainSummaryAction">' +
		//				'<a href="#" id="aInterfaceMainSummarySwitchInto">Switch Into</a>' +
		//				'</td></tr>';
										
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn2').html(aHTML.join(''));
		
		$('#aInterfaceMainSummarySwitchInto').click(function(event)
		{
			interfaceMasterMainViewportShow("#divInterfaceMainAddAttachment");
			interfaceDeveloperSpaceSwitchInto();
		});
	}	
}

function interfaceDeveloperSpaceDetails(aParam)
{
	var aHTML = [];
	var h = -1;
	var iSource = 1;	

	if (aParam != undefined)
	{
		if (aParam.source != undefined) {iSource = aParam.source}
	}
	else
	{
		aParam = {}
	}
	
	if (goObjectContext == undefined)
	{
		if (iSource == 2)
		{
			var aHTML = [];
			var h = -1;

			aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn1" class="interfaceMain" style="width:300px;">';

			aHTML[++h] = '<tr id="trInterfaceMainDetailsContactBusiness" class="interfaceMain">' +
					'<td id="tdInterfaceMainDetailsContactBusiness" class="interfaceMain">' +
					'Business' +
					'</td></tr>' +
					'<tr id="trInterfaceMainDetailsContactBusinessValue" class="interfaceMainSelect">' +
					'<td id="tdInterfaceMainDetailsContactBusinessValue" class="interfaceMainSelect">' +
					'<input id="inputInterfaceMainDetailsContactBusiness" class="inputInterfaceMainSelect"' +
						' data-method="CONTACT_BUSINESS_SEARCH"' +
						' data-columns="tradename">' +
					'</td></tr>';
					
			aHTML[++h] = '<tr id="trInterfaceMainDetailsContactPerson" class="interfaceMain">' +
					'<td id="tdInterfaceMainDetailsContactPerson" class="interfaceMain">' +
					'Person' +
					'</td></tr>' +
					'<tr id="trInterfaceMainDetailsContactPersonValue" class="interfaceMainSelect">' +
					'<td id="tdInterfaceMainDetailsContactPersonValue" class="interfaceMainSelect">' +
					'<input id="inputInterfaceMainDetailsContactPerson" class="inputInterfaceMainSelect"' +
						' data-method="CONTACT_PERSON_SEARCH"' +
						' data-columns="surname"' +
						' data-parent="inputInterfaceMainDetailsContactBusiness"' +
						' data-parent-search-id="contactbusiness"' +
						' data-parent-search-text="tradename">' +
					'</td></tr>';

			aHTML[++h] = '</table>';		

			$('#divInterfaceMainNewContact').html(aHTML.join(''));		
		}	
		else
		{
			var aHTML = [];
			var h = -1;

			aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn1" class="interfaceMain" style="width:300px;">';
	
			aHTML[++h] = '<tr id="trInterfaceMainDetailsEnterpriseName" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsEnterpriseName" class="interfaceMain">' +
						'Space Name (Business)' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsEnterpriseNameValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsEnterpriseNameValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainDetailsEnterpriseName" class="inputInterfaceMainText">' +
						'</td></tr>';

			aHTML[++h] = '<tr id="trInterfaceMainDetailsFirstName" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsFirstName" class="interfaceMain">' +
						'First Name' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsFirstNameValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsFirstNameValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainDetailsFirstName" class="inputInterfaceMainText">' +
						'</td></tr>';			
		
			aHTML[++h] = '<tr id="trInterfaceMainDetailsSurname" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsSurname" class="interfaceMain">' +
						'Surname' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsSurnameValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsSurnameValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainDetailsSurname" class="inputInterfaceMainText">' +
						'</td></tr>';

			aHTML[++h] = '<tr id="trInterfaceMainDetailsEmail" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsEmail" class="interfaceMain">' +
						'Email' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsEmailValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsEmailValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainDetailsEmail" class="inputInterfaceMainText">' +
						'</td></tr>';			

			aHTML[++h] = '</table>';					
		
			$('#divInterfaceMainNew').html(aHTML.join(''));
		}

	}
	else
	{
		aHTML[++h] = '<table id="tableInterfaceMainDetails" class="interfaceMainDetails">';
		aHTML[++h] = '<tr id="trInterfaceMainDetailsRow1" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsColumn1" class="interfaceMainColumn1">' +
						'</td>' +
						'<td id="tdInterfaceMainDetailsColumn2" class="interfaceMainColumn2x">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMainDetails').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn1" class="interfaceMain">';
	
		aHTML[++h] = '<tr id="trInterfaceMainDetailsEnterpriseName" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsEnterpriseName" class="interfaceMain">' +
						'Enterprise Name' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsEnterpriseNameValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsEnterpriseNameValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainDetailsEnterpriseName" class="inputInterfaceMainText">' +
						'</td></tr>';
		
	
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainDetailsColumn1').html(aHTML.join(''));
		
		if (goObjectContext != undefined)
		{
			$('#inputInterfaceMainDetailsTitle').val(goObjectContext.title);
			$('#inputInterfaceMainDetailsDescription').val(goObjectContext.description);
		}
	}	
	
}

function interfaceDeveloperSpaceSubscriptions(aParam, oResponse)
{
	var aHTML = [];
	var h = -1;
	var iStep = 1;
	var sXHTMLElementID;
	var aXHTMLElementID = [];

	if (aParam != undefined)
	{
		if (aParam.step != undefined) {iStep = aParam.step}
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
	}
	else
	{
		aParam = {};
	}	
		
	if (sXHTMLElementID) {aXHTMLElementID = sXHTMLElementID.split('-')};
		
	if (iStep == 1)
	{
		if (oResponse == undefined)
		{
			var sParam = 'method=ADMIN_MEMBERSHIP_SUBSCRIPTION_SEARCH&other=1&registration=' + giObjectContext;
			
			$.ajax(
			{
				type: 'GET',
				url: '/ondemand/admin/?' + sParam,
				dataType: 'json',
				success: function(data) {interfaceDeveloperSpaceSubscriptions(aParam, data)}
			});
		}
		else
		{
			var aHTML = [];
			var h = -1;
			
			aHTML[++h] = '<table class="interfaceMain">' +
						'<tr class="interfaceMainRow1">' +
						'<td id="tdInterfaceMainSpaceSubscriptionsColumn1" class="interfaceMainColumn1Large">' +
						'</td>' +
						'<td id="tdInterfaceMainSpaceSubscriptionsColumn2" style="width: 100px;" class="interfaceMainColumn2Action">' +
						'</td>' +
						'</tr>' +
						'</table>';				
			
			$('#divInterfaceMainSubscriptions').html(aHTML.join(''));

			var aHTML = [];
			var h = -1;
			
			aHTML[++h] = '<table class="interfaceMainColumn2">';
			
			aHTML[++h] = '<tr><td id="tdInterfaceMainSpaceSubscriptionsAdd" class="interfaceMainAction">' +
							'<span id="spanInterfaceMainSpaceSubscriptionsAdd">Add Endpoint</span>' +
							'</td></tr>';
			
			aHTML[++h] = '</table>';					
			
			$('#tdInterfaceMainSpaceSubscriptionsColumn2').html(aHTML.join(''));
			
			$('#spanInterfaceMainSpaceSubscriptionsAdd').button(
			{
				label: "Add"
			})
			.click(function()
			{
				if ($('#divInterfaceMasterViewportControlOptions').attr('onDemandSource') == 'spanInterfaceMainSpaceSubscriptionsAdd')
				{
					$('#divInterfaceMasterViewportControlOptions').slideUp(500);
					$('#divInterfaceMasterViewportControlOptions').attr('onDemandSource', '');
				}
				else
				{
					interfaceMasterOptionsSetPosition('spanInterfaceMainSpaceSubscriptionsAdd', -50, -280);
					$.extend(true, aParam, {step: 2});
					interfaceDeveloperSpaceSubscriptions(aParam);
				}	
			});

			var aHTML = [];
			var h = -1;	
					
			aHTML[++h] = '<table cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>';

			if (oResponse.data.rows.length == 0)
			{
				aHTML[++h] = '<tr class="interfaceMainCaption">' +
						'<td class="interfaceMainRowNothing">No subscriptions.</td></tr>';
			}

			$(oResponse.data.rows).each(function()
			{

				aHTML[++h] = '<tr class="interfaceMainRow">';
				
				aHTML[++h] = '<td id="interfaceSpaceSubscriptions_Title-' + this.id + '" class="interfaceMainRow interfaceMainRowSelect subscriptions"' +
										' title="">' +
										this.membershiptext + '</td>';

				aHTML[++h] = '<td style="width:30px;text-align:right;" class="interfaceMainRow">';
				aHTML[++h] = '<span id="spanSpaceSubscriptions_options_remove-' + this.id + '" class="interfaceMainRowOptionsRemove"></span>';
				aHTML[++h] = '</td>';																	
				aHTML[++h] = '</tr>';
			});
		
			aHTML[++h] = '</tbody></table>';
				
			$('#tdInterfaceMainSpaceSubscriptionsColumn1').html(aHTML.join(''));

			$('.interfaceMainRowOptionsRemove').button(
			{
				text: false,
			 	icons: {primary: "ui-icon-close"}
			})
			.click(function()
			{
				aParam.step = 4;
				aParam.xhtmlElementID = this.id;
				interfaceDeveloperSpaceSubscriptions(aParam)
			})
			.css('width', '15px')
			.css('height', '20px')
		}
	}
	else if (iStep == 2)
	{
		if (oResponse == undefined)
		{
			var sParam = 'method=ADMIN_MEMBERSHIP_SEARCH&me=1';
			
			$.ajax(
			{
				type: 'GET',
				url: '/ondemand/admin/?' + sParam,
				dataType: 'json',
				success: function(data) {interfaceDeveloperSpaceSubscriptions(aParam, data)}
			});
		}
		else
		{
			$('#divInterfaceMasterViewportControlOptions').attr('onDemandSource', 'spanInterfaceMainSpaceSubscriptionsAdd')
			
			var aHTML = [];
			var h = -1;
			
			if (oResponse.data.rows.length == 0)
			{
				aHTML[++h] = '<table border="0" cellspacing="0" cellpadding="0" class="interfaceSearchMedium">';
				aHTML[++h] = '<tbody>'
				aHTML[++h] = '<tr class="interfaceMainCaption">' +
								'<td class="interfaceMainRowNothing">No memberships.</td></tr>';
				aHTML[++h] = '</tbody></table>';

				$('#divInterfaceMasterViewportControlOptions').html(aHTML.join(''));
				$('#divInterfaceMasterViewportControlOptions').show(giShowSpeedOptions);
			}
			else
			{
				aHTML[++h] = '<table class="interfaceSearchMedium" style="font-size:0.725em;">';
				aHTML[++h] = '<tbody>'
				
				$.each(oResponse.data.rows, function()
				{	
					aHTML[++h] = '<tr class="interfaceMainRow">';
					
					aHTML[++h] = '<td id="tdSpaceSubscriptionsSelect_title-' + this.id + '" class="interfaceMainRowSelect">' +
											this.title + '</td>';
					
					aHTML[++h] = '</tr>'
				});
				
				aHTML[++h] = '</tbody></table>';

				$('#divInterfaceMasterViewportControlOptions').html(aHTML.join(''));
				$('#divInterfaceMasterViewportControlOptions').show(giShowSpeedOptions);
				
				$('td.interfaceMainRowSelect').click(function(event)
				{
					aParam.step = 3;
					aParam.xhtmlElementID = event.target.id;
					interfaceDeveloperSpaceSubscriptions(aParam);
				});
			}
		}
	}
	else if (iStep == 3)
	{	
		$('#' + sXHTMLElementID).fadeOut(500);
		
		var sParam = 'method=ADMIN_MEMBERSHIP_SUBSCRIPTION_MANAGE';
		var sData = 'registration=' + giObjectContext +
					'&membership=' + aXHTMLElementID[1];
					
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/admin/?' + sParam,
			data: sData,
			dataType: 'json',
			success: function(data){interfaceDeveloperSpaceSubscriptions()}
		});
	}

	else if (iStep == 4)
	{
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/admin/?method=ADMIN_MEMBERSHIP_SUBSCRIPTION_MANAGE&remove=1',
			data: 'id=' + aXHTMLElementID[1],
			dataType: 'json',
			success: function(data){$('#' + sXHTMLElementID).parent().parent().fadeOut(500)}
		});	
	}
}

function interfaceDeveloperSpaceMembers(aParam, oResponse)
{
	var iObjectContext = giObjectContext;
	var sXHTMLElementId = 'divInterfaceMainMembers';
	var oOptions = {view: true};
	var oActions = {};
	
	if (aParam != undefined)
	{
		if (aParam.objectContext != undefined) {iObjectContext = aParam.objectContext}
		if (aParam.xhtmlElementId != undefined) {sXHTMLElementId = aParam.xhtmlElementId}
		if (aParam.options != undefined) {oOptions = aParam.options}
		if (aParam.actions != undefined) {oActions = aParam.actions}
	}		
		
	if (oResponse == undefined)
	{
		var sParam = 'method=ADMIN_MEMBERSHIP_SUBSCRIPTION_MEMBER_SEARCH&space=' + iObjectContext;
		
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/admin/?' + sParam,
			dataType: 'json',
			success: function(data) {interfaceDeveloperSpaceMembers(aParam, data)}
		});
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableWebsitePages" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">' +
							'<td class="interfaceMainRowNothing">No users (members).</td></tr>';
			aHTML[++h] = '</tbody></table>';

			$('#' + sXHTMLElementId).html(aHTML.join(''));
		
		}
		else
		{
			aHTML[++h] = '<table id="tableClientAudits" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">';
			aHTML[++h] = '<td class="interfaceMainCaption">Logon Name</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">Last logged on</td>';
			aHTML[++h] = '</tr>';
			
			$.each(oResponse.data.rows, function()
			{
				
				aHTML[++h] = '<tr class="interfaceMainRow">';
								
				aHTML[++h] = '<td id="tdWebsitePages_title-' + this.id + '" class="interfaceMainRow">' +
										this.username + '</td>';
										
				aHTML[++h] = '<td id="tdWebsitePages_url-' + this.id + '" class="interfaceMainRow">' +
										this.lastlogondatetime + '</td>';
										
				aHTML[++h] = '</tr>'
			});
			
			aHTML[++h] = '</tbody></table>';

			$('#' + sXHTMLElementId).html(aHTML.join(''));
		}
	}	
}

function interfaceDeveloperSpaceNew(aParam)
{
	goObjectContext = undefined
	giObjectContext = -1;
	interfaceDeveloperSpaceViewport();
	$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
	interfaceMasterMainViewportShow("#divInterfaceMainNew");
	interfaceDeveloperSpaceDetails({source: 1});
}

function interfaceDeveloperSpaceSave()
{
	if (giObjectContext != -1)
	{
		
	}	
	else
	{
		var iContactBusinessId = ''; 

		if ($('#divInterfaceMainNewContact').html() != '')
		{
			iContactBusinessId = $('#inputInterfaceMainDetailsContactBusiness').attr('data-id');
			iContactPersonId = $('#inputInterfaceMainDetailsContactPerson').attr('data-id');
		};

		if ($('#divInterfaceMainNew').html() != '' && (iContactBusinessId == '' || iContactPersonId == ''))
		{
			interfaceMasterStatusWorking();

			var sReturn;
			var sParam = 'method=REGISTER_SPACE';
			var sData = 'firstname=' + encodeURIComponent($('#inputInterfaceMainDetailsFirstName').val()) +
								'&surname=' + encodeURIComponent($('#inputInterfaceMainDetailsSurname').val()) +
								'&email=' + encodeURIComponent($('#inputInterfaceMainDetailsEmail').val()) +
								'&spacename=' + encodeURIComponent($('#inputInterfaceMainDetailsEnterpriseName').val());

			$.ajax(
			{
				type: 'POST',
				url: '/directory/ondemand/register.asp?' + sParam,
				data: sData,
				dataType: 'text',
				success: function(data)
				{
					var aResponse = data.split('|');

					if (aResponse[0] == "OK")
					{
						interfaceMasterStatus('Space created');
						if (aResponse.length > 3)	
						{giObjectContext = aResponse[3]};
						gbInputDetected = false;
						interfaceDeveloperSpaceSearch('-' + giObjectContext, {source: 1});
					}
					else
					{
						interfaceMasterError(aResponse[1]);
					}
				}
			});
		
		};

	}
	
}