
function interfaceDeveloperMembershipMasterViewport()
{

	gsSetupName = 'Memberships';
	goSetupContextXML = '';
	giSetupContext = -1;
	giObjectContext = -1;
	giObject = -1;
	
	interfaceMasterReset();		
			
	$('#divInterfaceMasterViewportControlSet').button(
	{
		label: "Memberships (Apps)"
	});
	
	$('#inputInterfaceMasterViewportControlSearch').keyup(function(event)
	{
		if (giKeyPressTimeoutId != 0) {clearTimeout(giKeyPressTimeoutId)};
        giKeyPressTimeoutId = setTimeout("interfaceDeveloperMembershipSearch('inputInterfaceMasterViewportControlSearch')", giWaitForStop);
	});
	
	$('#spanInterfaceMasterViewportControlSearch').click(function(event)
	{
		interfaceDeveloperMembershipSearch('inputInterfaceMasterViewportControlSearch');
	});
	
	$('#spanInterfaceMasterViewportControlSearchOptions').click(function(event)
	{
		interfaceDeveloperMembershipSearchOptions();
	});
	
	$('#spanInterfaceMasterViewportControlNew').click(function(event)
	{
		interfaceDeveloperMembershipNew();
	})
	
	$('#spanInterfaceMasterViewportControlNewOptions').click(function(event)
	{
		interfaceDeveloperMembershipNewOptions();
	});
	
	$('#spanInterfaceMasterViewportControlAction').click(function(event)
	{
		interfaceDeveloperMembershipSave();
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
		interfaceDeveloperMembershipSetup();
	});
	
	$('#spanInterfaceMasterViewportControlSetupOptions').click(function(event)
	{
		interfaceDeveloperMembershipSetupOptions();
	});
	
	$('#spanInterfaceMasterViewportControlHelp').click(function(event)
	{
		interfaceDeveloperMembershipHelp();
	});
	
	$('#spanInterfaceMasterViewportControlHelpOptions').click(function(event)
	{
		interfaceDeveloperMembershipHelpOptions();
	});

	$('td.interfaceViewportMasterControlBrowse').click(function(event)
	{
		interfaceDeveloperMembershipSearch(event.target.id, {source: giSearchSource_BROWSE});
	});
	
	$('td.interfaceViewportMasterControlBrowseAll').click(function(event)
	{
		interfaceDeveloperMembershipSearch(event.target.id, {source: giSearchSource_BROWSE});
	});
	
	$('#inputInterfaceMasterViewportControlSearch').focus();
	
	interfaceDeveloperMembershipHomeShow();
	
}

function interfaceDeveloperMembershipHomeShow(oResponse)
{

	if (oResponse == undefined)
	{	
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
			url: '/ondemand/admin/?method=ADMIN_MEMBERSHIP_SEARCH&rows=100&me=1',
			dataType: 'json',
			success: interfaceDeveloperMembershipHomeShow
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
			aHTML[++h] = '<td class="tdInterfaceWebsiteHomeMostLikelyNothing">Click New to create a membership.</td>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</table>';
		}
		else
		{
		
			aHTML[++h] = '<table id="tableInterfaceWebsiteHomeMostLikely">';
			
			$.each(oResponse.data.rows, function()
			{	
				aHTML[++h] = '<tr class="interfaceMainRow">';
				
				aHTML[++h] = '<td id="interfaceMembershipHomeMostLikely_Title-' + this.id + 
										'" class="interfaceHomeMostLikely">' +
										this.title +
										'</td>';
				
				aHTML[++h] = '</tr>'
			});
			
			aHTML[++h] = '</tbody></table>';
		}
		
		$('#divInterfaceMain').html(aHTML.join(''));
	
		$('td.interfaceHomeMostLikely').click(function(event)
		{
			interfaceDeveloperMembershipSearch(event.target.id, {source: 1});
		});
	}
}

function interfaceDeveloperMembershipSearch(sXHTMLElementId, aParam)
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
		var sParam = 'method=ADMIN_MEMBERSHIP_SEARCH&id=' + giObjectContext;
		
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/admin/?' + sParam,
			dataType: 'json',
			success: function(data) {interfaceDeveloperMembershipShow(aParam, data)}
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
			
			var sParam = 'method=ADMIN_MEMBERSHIP_SEARCH&title=' + sSearchText + 
								'&xhtmlcontext=' + sXHTMLElementId;

			$.ajax(
			{
				type: 'GET',
				url: '/ondemand/admin/?' + sParam,
				dataType: 'json',
				success: function(data) {interfaceDeveloperMembershipSearchShow(aParam, data)}
			});
			
		}
	};	
}

function interfaceDeveloperMembershipSearchShow(aParam, oResponse)
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
			
			aHTML[++h] = '<td class="interfaceSearch" id="membership-' + this.id + '">' +
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
			interfaceDeveloperMembershipSearch(event.target.id, 1);
		});
	}	
			
}

function interfaceDeveloperMembershipViewport()
{
	
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceViewportControlContext" class="interfaceViewportControlContext"></div>';
	
	aHTML[++h] = '<table class="interfaceViewportControl">';
	
	if (giObjectContext == -1)
	{
		aHTML[++h] = '<tr class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlDetails" class="interfaceViewportControl interfaceViewportControlHighlight">Details</td>' +
						'</tr>';	
	}
	else
	{
		aHTML[++h] = '<tr class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlSummary" class="interfaceViewportControl interfaceViewportControlHighlight">Summary</td>' +
						'</tr>';
						
		aHTML[++h] = '<tr class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlDetails" class="interfaceViewportControl">Details</td>' +
						'</tr>';		
			
		aHTML[++h] = '<tr class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlEndpoints" class="interfaceViewportControl">Endpoints</td>' +
						'</tr>';
														
		aHTML[++h] = '</table>';

		aHTML[++h] = '<table class="interfaceViewportControl">';
		
		aHTML[++h] = '<tr class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlSubcriptions" class="interfaceViewportControl">Subscriptions</td>' +
						'</tr>';
	}
	
	aHTML[++h] = '</table>';			
				
	$('#divInterfaceViewportControl').html(aHTML.join(''));
	
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceMainSummary" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainDetails" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainEndpoints" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainSubscriptions" class="divInterfaceViewportMain"></div>';
		
	$('#divInterfaceMain').html(aHTML.join(''));
		
	$('#tdInterfaceViewportControlSummary').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainSummary");
		interfaceDeveloperMembershipSummary();
	});

	$('#tdInterfaceViewportControlDetails').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainDetails");
		interfaceDeveloperMembershipDetails();
	});
	
	$('#tdInterfaceViewportControlEndpoints').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainEndpoints");
		interfaceDeveloperMembershipEndpoints();
	});

	$('#tdInterfaceViewportControlSubcriptions').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainSubscriptions");
		interfaceDeveloperMembershipSubscriptions();
	});
}

function interfaceDeveloperMembershipShow(aParam, oResponse)
{

	$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
	interfaceDeveloperMembershipViewport();
	
	var aHTML = [];
	var h = -1;
	
	if (oResponse.data.rows.length == 0)
	{
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find this membership.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		goObjectContext = undefined;
		
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		$('#spanInterfaceMasterViewportControlAction').button({disabled: false});

		goObjectContext = oResponse.data.rows[0];
				
		$('#divInterfaceViewportControlContext').html(goObjectContext.title);
		
		aHTML[++h] = '<table id="tableInterfaceMainSummary" class="interfaceMain">';
		aHTML[++h] = '<tr id="trInterfaceMainSummaryRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainSummaryColumn1" class="interfaceMainColumn1">' +
						'</td>' +
						'<td id="tdInterfaceMainSummaryColumn2" class="interfaceMainColumn2x">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMainSummary').html(aHTML.join(''));
		
		interfaceDeveloperMembershipSummary();
	}	
}		
		
function interfaceDeveloperMembershipSummary()
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
		
		aHTML[++h] = '<tr><td id="tdInterfaceMainSummarySpaceID" class="interfaceMainSummary">Membership ID</td></tr>' +
						'<tr><td id="tdInterfaceMainSummarySpaceID" class="interfaceMainSummaryValue">' +
						goObjectContext.id +
						'</td></tr>';
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn1').html(aHTML.join(''));
	}	
}

function interfaceDeveloperMembershipDetails()
{
	var aHTML = [];
	var h = -1;
		
	if ($('#divInterfaceMainDetails').attr('onDemandLoading') == '1')
	{
		$('#divInterfaceMainDetails').attr('onDemandLoading', '');
		
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
	
		aHTML[++h] = '<tr id="trInterfaceMainDetailsTitle" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsTitle" class="interfaceMain">' +
						'Title' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsTitleValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsTitleValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainDetailsTitle" class="inputInterfaceMainText">' +
						'</td></tr>';

		aHTML[++h] = '<tr id="trInterfaceMainDetailsReference" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsReference" class="interfaceMain">' +
						'Reference' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsReferenceValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsReferenceValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainDetailsReference" class="inputInterfaceMainText">' +
						'</td></tr>';				
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsDescription" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsDescription" class="interfaceMain">' +
						'Description' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsDescriptionValue" class="interfaceMainTextMulti">' +
						'<td id="tdInterfaceMainDetailsDescriptionValue" class="interfaceMainTextMulti">' +
						'<textarea rows="10" cols="35" id="inputInterfaceMainDetailsDescription" class="inputInterfaceMainTextMultiSmall"></textarea>' +
						'</td></tr>';

		aHTML[++h] = '<tr id="trInterfaceMainDetailsBasedOnSubscription" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsBasedOnSubscription" class="interfaceMain">' +
						'Based On Subscription' +
						'</td></tr>' +
						'<tr>' +
						'<td id="tdInterfaceMainDetailsBasedOnSubscriptionValue" class="interfaceMainRadio">' +
						ns1blankspace.loadingSmallXHTML +
						'</td></tr>';

		aHTML[++h] = '</table>';					
		
		interfaceDeveloperMembershipDetailsSubscriptions();

		$('#tdInterfaceMainDetailsColumn1').html(aHTML.join(''));
		
		if (goObjectContext != undefined)
		{
			$('#inputInterfaceMainDetailsTitle').val(goObjectContext.title);
			$('#inputInterfaceMainDetailsReference').val(goObjectContext.reference);
			$('#inputInterfaceMainDetailsDescription').val(goObjectContext.description);
		}
	}	
}

function interfaceDeveloperMembershipDetailsSubscriptions(aParam, oResponse)
{
	if (oResponse == undefined)
	{	
		var sData = '';

		$.ajax(
			{
				type: 'POST',
				url: '/ondemand/admin/?method=ADMIN_MEMBERSHIP_SUBSCRIPTION_SEARCH',
				data: sData,
				dataType: 'json',
				success: function(data) {interfaceDeveloperMembershipDetailsSubscriptions(aParam, data)
				}
			});
	}
	else
	{
		var aHTML = [];
		var h = -1;

		if (oResponse.data.rows == 0)
		{
			aHTML[++h] = 'No subscriptions';
		}
		else
		{		
			$.each(oResponse.data.rows, function() 
			{ 
				aHTML[++h] = '<input type="radio" id="radioBasedOnSubscription' + this.id + '" name="radioBasedOnSubscription" value="' + this.id + '"/>' +
								this.membershiptext + '<br />';
			});
		}
		
		$('#tdInterfaceMainDetailsBasedOnSubscriptionValue').html(aHTML.join(''));

		if (goObjectContext != undefined)
		{
			$('[name="radioBasedOnSubscription"][value="' + goObjectContext.basedonsubscription + '"]').attr('checked', true);
		}
	}
}

function interfaceDeveloperMembershipEndpoints(aParam, oResponse)
{
	var aHTML = [];
	var h = -1;
	
	
	if (oResponse == undefined)
	{
		var oSearch = new AdvancedSearch();
		oSearch.method = 'ADMIN_MEMBERSHIP_ENDPOINT_SEARCH';
		oSearch.addField('endpointtext,endpoint');
		oSearch.addFilter('membership', 'EQUAL_TO', giObjectContext)
		oSearch.rows = 50;
		oSearch.sort('endpointtext', 'asc');
		oSearch.getResults(function(data) {interfaceDeveloperMembershipEndpoints(aParam, data)})	
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table class="interfaceMain">' +
					'<tr id="trInterfaceMainMembershipEndpointsRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainMembershipEndpointsColumn1" class="interfaceMainColumn1Large">' +
					'</td>' +
					'<td id="tdInterfaceMainMembershipEndpointsColumn2" style="width: 100px;" class="interfaceMainColumn2Action">' +
					'</td>' +
					'</tr>' +
					'</table>';				
		
		$('#divInterfaceMainEndpoints').html(aHTML.join(''));

		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table class="interfaceMainColumn2">';
		
		aHTML[++h] = '<tr><td id="tdInterfaceMainMembershipEndpointsAdd" class="interfaceMainAction">' +
						'<span id="spanInterfaceMainMembershipEndpointsAdd">Add Endpoint</span>' +
						'</td></tr>';
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainMembershipEndpointsColumn2').html(aHTML.join(''));
		
		$('#spanInterfaceMainMembershipEndpointsAdd').button(
		{
			label: "Add Endpoint"
		})
		.click(function() {
			interfaceMasterOptionsSetPosition('spanInterfaceMainMembershipEndpointsAdd', -50, -280);
			interfaceDeveloperMembershipEndpointsAdd(aParam);
		});

		var aHTML = [];
		var h = -1;	
				
		aHTML[++h] = '<table cellspacing="0" cellpadding="0" class="interfaceMain">';
		aHTML[++h] = '<tbody>';

		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<tr class="interfaceMainCaption">' +
					'<td class="interfaceMainRowNothing" >No endpoints.</td></tr>';
		}

		$(oResponse.data.rows).each(function()
		{

			aHTML[++h] = '<tr class="interfaceMainRow">';
			
			aHTML[++h] = '<td id="interfaceMembershipEndpoint_Title-' + this.id + '" class="interfaceMainRow interfaceMainRowSelect endpoint"' +
									' title="">' +
									this.endpointtext + '</td>';

			aHTML[++h] = '<td style="width:30px;text-align:right;" class="interfaceMainRow">';
			aHTML[++h] = '<span id="spanMembershipEndpoint_options_remove-' + this.id + '" class="interfaceMainRowOptionsRemove"></span>';
			aHTML[++h] = '</td>';																	
			aHTML[++h] = '</tr>';
		});
	
		aHTML[++h] = '</tbody></table>';
			
		$('#tdInterfaceMainMembershipEndpointsColumn1').html(aHTML.join(''));

		$('td.endpoint').click(function(event)
		{
			var sXHTMLElementId = event.target.id;
			var aId = sXHTMLElementId.split('-');
			
			interfaceDeveloperMembershipEndpoints({endpoint: aId[1], step: 2});
		});

		$('.interfaceMainRowOptionsRemove').button(
		{
			text: false,
		 	icons: {primary: "ui-icon-close"}
		})
		.click(function() {
			interfaceDeveloperMembershipEndpointsRemove(this.id)
		})
		.css('width', '15px')
		.css('height', '20px')
	}
}

function interfaceDeveloperMembershipEndpointsAdd(aParam, oResponse)
{
		
	if ($('#divInterfaceMasterViewportControlOptions').attr('onDemandSource') == 'spanInterfaceMainUserAccessRolesAdd')
	{
		$('#divInterfaceMasterViewportControlOptions').slideUp(500);
		$('#divInterfaceMasterViewportControlOptions').attr('onDemandSource', '');
	}
	else
	{
		if (oResponse == undefined)
		{
			var oSearch = new AdvancedSearch();
			oSearch.method = 'SETUP_ENDPOINT_SEARCH';
			oSearch.addField('title');
			oSearch.sort('title', 'ASC');
			oSearch.rows = 50;

			oSearch.getResults(function(data)
			{
				interfaceDeveloperMembershipEndpointsAdd(aParam, data)
			});
		}
		else
		{
			
			$('#divInterfaceMasterViewportControlOptions').attr('onDemandSource', 'spanInterfaceMainUserAccessRolesAdd')
			
			var aHTML = [];
			var h = -1;
			
			if (oResponse.data.rows.length == 0)
			{
				aHTML[++h] = '<table border="0" cellspacing="0" cellpadding="0" class="interfaceSearchMedium">';
				aHTML[++h] = '<tbody>'
				aHTML[++h] = '<tr class="interfaceMainCaption">' +
								'<td class="interfaceMainRowNothing">No endpoints.</td></tr>';
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
					
					aHTML[++h] = '<td id="tdMembershipEndpointsSelect-title-' + this.id + '" class="interfaceMainRowSelect">' +
											this.title + '</td>';
					
					aHTML[++h] = '</tr>'
				});
				
				aHTML[++h] = '</tbody></table>';

				$('#divInterfaceMasterViewportControlOptions').html(aHTML.join(''));
				$('#divInterfaceMasterViewportControlOptions').show(giShowSpeedOptions);
				
				$('td.interfaceMainRowSelect').click(function(event)
				{
					interfaceDeveloperMembershipEndpointsSelect(event.target.id);
				});
			}
		}
	}	
}
	
function interfaceDeveloperMembershipEndpointsSelect(sXHTMLElementId)
{

	var aSearch = sXHTMLElementId.split('-');
	var sElementId = aSearch[0];
	var sSearchContext = aSearch[2];
	
	$('#' + sXHTMLElementId).fadeOut(500);
	
	var sParam = 'method=ADMIN_MEMBERSHIP_ENDPOINT_MANAGE';
	var sData = 'membership=' + giObjectContext +
				'&endpoint=' + sSearchContext;
				
	$.ajax(
		{
			type: 'POST',
			url: '/ondemand/admin/?' + sParam,
			data: sData,
			dataType: 'json',
			success: function(data){interfaceDeveloperMembershipEndpoints()}
		});
		
}

function interfaceDeveloperMembershipEndpointsRemove(sXHTMLElementId)
{

	var aSearch = sXHTMLElementId.split('-');
	var sElementId = aSearch[0];
	var sSearchContext = aSearch[1];
	
	var sParam = 'method=ADMIN_MEMBERSHIP_ENDPOINT_MANAGE&remove=1';
	var sData = 'id=' + sSearchContext;
				
	$.ajax(
		{
			type: 'POST',
			url: '/ondemand/admin/?' + sParam,
			data: sData,
			dataType: 'json',
			success: function(data){$('#' + sXHTMLElementId).parent().parent().fadeOut(500)}
		});	
}

function interfaceDeveloperMembershipSubscriptions(aParam, oResponse)
{
	var sXHTMLElementID = 'divInterfaceMainSubscriptions';
	var iStep = 1;
	var aXHTMLElementID = [];

	if (aParam != undefined)
	{
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
		if (aParam.step != undefined) {iStep = aParam.step}
	}
	else
	{
		aParam = {step: 1}
	}

	aXHTMLElementID = sXHTMLElementID.split('-');

	if (iStep == 1)
	{
		if (oResponse == undefined)
		{
			$.ajax(
			{
				type: 'POST',
				url: '/ondemand/admin/?method=ADMIN_MEMBERSHIP_SUBSCRIPTION_SEARCH',
				data: 'other=1&advanced=1&membership=' + giObjectContext,
				dataType: 'json',
				success: function(data){interfaceDeveloperMembershipSubscriptions(aParam, data)}
			});	
		}
		else
		{
			var aHTML = [];
			var h = -1;
			
			aHTML[++h] = '<table class="interfaceMain">' +
						'<tr>' +
						'<td id="tdInterfaceMainMembershipSubscriptionsColumn1" style="width:150px;border-right-style:solid;border-width:2px;border-color:#B8B8B8;padding-right:15px;">' +
						'</td>' +
						'<td id="tdInterfaceMainMembershipSubscriptionsColumn2" class="interfaceMainColumn1Large" style="padding-left:15px;">' +
						'</td>' +
						'<td id="tdInterfaceMainMembershipSubscriptionsColumn3" style="width: 100px;" class="interfaceMainColumn2Action">' +
						'</td>' +
						'</tr>' +
						'</table>';				
			
			$('#divInterfaceMainSubscriptions').html(aHTML.join(''));
			
			var aHTML = [];
			var h = -1;
			
			aHTML[++h] = '<table>';
			
			aHTML[++h] = '<tr><td class="interfaceMainAction">' +
							'<span id="spanInterfaceMainMembershipSubscriptionsAdd">Add</span>' +
							'</td></tr>';
			
			aHTML[++h] = '</table>';					
			
			$('#tdInterfaceMainMembershipSubscriptionsColumn3').html(aHTML.join(''));
			
			$('#spanInterfaceMainMembershipSubscriptionsAdd').button(
			{
				label: "Add"
			})
			.click(function()
			{
				aParam.step = 2;
				aParam.xhtmlElementID = '';
				interfaceDeveloperMembershipSubscriptions(aParam);
			});

			var aHTML = [];
			var h = -1;
			
			if (oResponse.data.rows.length == 0)
			{
				aHTML[++h] = '<table border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
				aHTML[++h] = '<tbody>'
				aHTML[++h] = '<tr class="interfaceMainCaption">' +
								'<td class="interfaceMainRowNothing">No subscriptions.</td></tr>';
				aHTML[++h] = '</tbody></table>';

				$('#tdInterfaceMainMembershipSubscriptionsColumn1').html(aHTML.join(''));
			}
			else
			{
				aHTML[++h] = '<table>';
				aHTML[++h] = '<tbody>';
				
				$.each(oResponse.data.rows, function()
				{
					aHTML[++h] = '<tr class="interfaceMainRow">';
					
					aHTML[++h] = '<td id="tdMembershipSubscriptions_title-' + this.id +
											'" data-contactbusinesstext="' + this.contactbusinesstext +
											'" class="interfaceMainRow interfaceRowSelect interfaceMembershipSubscriptions">' +
											this.contactbusinesstext;
					
					aHTML[++h] = '<br /><span class="interfaceViewportControlSubContext" id="interfaceMembershipSubscriptions_startdate-' + this.id + '">' +
	 										this.startdate + '</span>';

	 				aHTML[++h] = '</td>';						

	 				aHTML[++h] = '<td style="width:30px;text-align:right;" class="interfaceMainRow">';
					aHTML[++h] = '<span id="spanMembershipSubscriptions_options_remove-' + this.id + '" class="interfaceMainRowOptionsRemove"></span>';
					aHTML[++h] = '</td>';		

					aHTML[++h] = '</tr>';
				});
				
				aHTML[++h] = '</tbody></table>';

				$('#tdInterfaceMainMembershipSubscriptionsColumn1').html(aHTML.join(''));
							
				$('td.interfaceMembershipSubscriptions').click(function(event)
				{
					aParam.step = 2;
					aParam.xhtmlElementID = event.target.id;
					interfaceDeveloperMembershipSubscriptions(aParam);
				});

				$('.interfaceMainRowOptionsRemove').button(
				{
					text: false,
				 	icons: {primary: "ui-icon-close"}
				})
				.click(function()
				{
					aParam.step = 6;
					aParam.xhtmlElementID = this.id;
					interfaceDeveloperMembershipSubscriptions(aParam);
				})
				.css('width', '15px')
				.css('height', '20px')
			}
		}
	}

	else if (iStep == 2)
	{
		if (oResponse == undefined)
		{
			var aHTML = [];
			var h = -1;

			aHTML[++h] = '<table class="interfaceMain">';
			
			aHTML[++h] = '<tr id="trInterfaceMainMembershipSubscriptionsRegistration" class="interfaceMain">' +
							'<td id="tdInterfaceMainMembershipSubscriptionsRegistration" class="interfaceMain">' +
							'Space' +
							'</td></tr>' +
							'<tr id="trInterfaceMainMembershipSubscriptionsRegistrationValue" class="interfaceMainSelect">' +
							'<td id="tdInterfaceMainMembershipSubscriptionsRegistrationValue" class="interfaceMainSelect">' +
							'<input id="inputInterfaceMainMembershipSubscriptionsRegistration" class="inputInterfaceMainSelectCustom">' +
							'</td></tr>';

			aHTML[++h] = '<tr class="interfaceMainCaption">' +
									'<td class="interfaceMainRowNothing">You need to enter at least 3 characters.</td></tr>' +
									'<td class="interfaceMainRowNothing">It will only show spaces that you have signed up.</td></tr>';

			aHTML[++h] = '</table>';					
			
			$('#tdInterfaceMainMembershipSubscriptionsColumn2').html(aHTML.join(''));
			
			$('#inputInterfaceMainMembershipSubscriptionsRegistration').keyup(function()
			{
				if (giKeyPressTimeoutId != 0) {clearTimeout(giKeyPressTimeoutId)};
		        giKeyPressTimeoutId = setTimeout("interfaceMembershipSubscriptionsRegistrationSearch('inputInterfaceMainMembershipSubscriptionsRegistration')", giWaitForStop);
			});	
				
			$('#inputInterfaceMainMembershipSubscriptionsRegistration').live('blur', function() 
			{
				$(this).removeClass('interfaceMasterHighlight');
			});

			var aHTML = [];
			var h = -1;
		
			aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMain" style="font-size:0.875em">';
					
			if (aXHTMLElementID[1])
			{
				aHTML[++h] = '<tr class="interfaceMainCaption">' +
									'<td class="interfaceMainRowNothing">To change this access you need to delete it and then re-add it.</td></tr>';

			}	
			else
			{	
				aHTML[++h] = '<tr class="interfaceMainAction">' +
								'<td class="interfaceMainAction">' +
								'<span style="width:70px;" id="spanInterfaceMainMembershipSubscriptionEditSave">Save</span>' +
								'</td></tr>';
			}

			aHTML[++h] = '<tr class="interfaceMainAction">' +
								'<td class="interfaceMainAction">' +
								'<span style="width:70px;" id="spanInterfaceMainMembershipSubscriptionEditCancel">Cancel</span>' +
								'</td></tr>';
			
			aHTML[++h] = '</table>';					
			
			$('#tdInterfaceMainMembershipSubscriptionsColumn3').html(aHTML.join(''));

			$('#spanInterfaceMainMembershipSubscriptionEditSave').button(
			{
				text: "Save"
			})
			.click(function() 
			{
				interfaceMasterStatusWorking();

				var sData = 'id=' + interfaceMasterFormatSave(aXHTMLElementID[1]);
				sData += '&registration=' + interfaceMasterFormatSave($('#inputInterfaceMainMembershipSubscriptionsRegistration').attr("data-id"));
				sData += '&membership=' + giObjectContext;

				$.ajax(
				{
					type: 'POST',
					url: '/ondemand/admin/?method=ADMIN_MEMBERSHIP_SUBSCRIPTION_MANAGE',
					data: sData,
					dataType: 'json',
					success: function() {
						aParam.step = 1;
						interfaceDeveloperMembershipSubscriptions(aParam);
						interfaceMasterStatus('Saved');
					}
				});
			})
			
			$('#spanInterfaceMainMembershipSubscriptionEditCancel').button(
			{
				text: "Cancel"
			})
			.click(function() 
			{
				aParam.step = 1;
				interfaceDeveloperMembershipSubscriptions(aParam);
			})

			if (aXHTMLElementID[1])
			{
				$('#inputInterfaceMainMembershipSubscriptionsRegistration').attr("data-id", aXHTMLElementID[1])
				$('#inputInterfaceMainMembershipSubscriptionsRegistration').val($('#tdMembershipSubscriptions_title-' + aXHTMLElementID[1]).attr("data-contactbusinesstext"));
			}
		}
		else
		{
		}	
	}
	else if (iStep == 6)
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


function interfaceMembershipSubscriptionsRegistrationSearch(sXHTMLInputElementID, oResponse)
{
	var aHTML = [];
	var sSearchText;
	var iXHTMLElementContextID;

	if (oResponse == undefined)
	{	
		sSearchText = $('#' + sXHTMLInputElementID).val();
		
		if (sSearchText.length > 2)
		{
			$.ajax(
			{
				type: 'GET',
				url: '/ondemand/admin/?method=ADMIN_REGISTRATION_SEARCH&rows=10&status=2&contactbusinesstext=' + interfaceMasterFormatSave(sSearchText),
				dataType: 'json',
				success: function(data) {interfaceMembershipSubscriptionsRegistrationSearch(sXHTMLInputElementID, data)}
			});
		}
	}
	else
	{	
		aHTML.push('<table style="width: 350px;" class="interfaceViewportMasterControl" cellpadding=4>');

		$(oResponse.data.rows).each(function()
		{
			if (this.contactbusinesstext != '')
			{
				aHTML.push('<tr>' +
					'<td id="tdInterfaceMasterRegistration-' + this.id + '" data-usertext="' + this.contactbusinesstext + '" class="interfaceSearch interfaceMasterNetworkUser">' +
					this.contactbusinesstext +
					'</td></tr>');
			}	
		});			
						
		aHTML.push('</table>');
		
		$('#divInterfaceMasterViewportControlOptions').html(aHTML.join(''));

		$('#divInterfaceMasterViewportControlOptions').show(giShowSpeedOptions);
		$('#divInterfaceMasterViewportControlOptions').offset({ top: $('#' + sXHTMLInputElementID).offset().top + $('#' + sXHTMLInputElementID).height(), left: $('#' + sXHTMLInputElementID).offset().left});

		$('.interfaceMasterNetworkUser').click(function(event)
		{
			var aXHTMLElementID = (event.target.id).split('-');
			iXHTMLElementContextID = aXHTMLElementID[1];

			$('#' + sXHTMLInputElementID).val($('#' + event.target.id).attr("data-usertext"))
			$('#' + sXHTMLInputElementID).attr("data-id", iXHTMLElementContextID)
			$('#divInterfaceMasterViewportControlOptions').hide();
		});
	}	
}	

function interfaceDeveloperMembershipSave()
{

	var sParam = 'method=ADMIN_MEMBERSHIP_MANAGE';
	var sData = 'id=' + (giObjectContext != -1 ? giObjectContext : '');
		
	if ($('#divInterfaceMainDetails').html() != '')
	{
		sData += '&title=' + encodeURIComponent($('#inputInterfaceMainDetailsTitle').val());
		sData += '&reference=' + encodeURIComponent($('#inputInterfaceMainDetailsReference').val());
		sData += '&description=' + encodeURIComponent($('#inputInterfaceMainDetailsDescription').val());
		sData += '&basedonsubscription=' + interfaceMasterFormatSave($('input[name="radioBasedOnSubscription"]:checked').val());
	};

	interfaceMasterStatusWorking();

	$.ajax(
	{
		type: 'POST',
		url: '/ondemand/admin/?' + sParam,
		data: sData,
		dataType: 'json',
		success: function(oResponse)
		{
			if (oResponse.status == 'OK')
			{	
				interfaceMasterStatus('Saved');
				
				if (giObjectContext == -1)
				{
					giObjectContext = oResponse.id;
					gbInputDetected = false;
					interfaceDeveloperMembershipSearch('-' + giObjectContext, {source: 1});
				}	
			}
			else
			{
				interfaceMasterError(oResponse.error.errornotes);;
			}
		}
	});
		
}

function interfaceDeveloperMembershipNew(aParam)
{
	goObjectContext = undefined
	giObjectContext = -1;
	interfaceDeveloperMembershipViewport();
	$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
	interfaceMasterMainViewportShow("#divInterfaceMainDetails");
	interfaceDeveloperMembershipDetails();
}
