//Ability to assign secuity rights.

function interfaceSetupUserMasterViewport()
{
	gsObjectName = 'Users';
	giObjectContext = -1;
	giObject = 40;
	goObjectContext = undefined;
	
	interfaceMasterReset();		
			
	$('#divInterfaceMasterViewportControlSet').button(
	{
		label: "Users"
	});
	
	$('#inputInterfaceMasterViewportControlSearch').keyup(function(event)
	{
		if (giKeyPressTimeoutId != 0) {clearTimeout(giKeyPressTimeoutId)};
        giKeyPressTimeoutId = setTimeout("interfaceSetupUserSearch('inputInterfaceMasterViewportControlSearch')", giWaitForStop);
	});
	
	$('#spanInterfaceMasterViewportControlSearch').click(function(event)
	{
		interfaceSetupUserSearch('inputInterfaceMasterViewportControlSearch');
	});
	
	$('#spanInterfaceMasterViewportControlSearchOptions').click(function(event)
	{
		interfaceSetupUserSearchOptions();
	});
	
	$('#spanInterfaceMasterViewportControlNew').click(function(event)
	{
		interfaceSetupUserNew();
	})
	
	$('#spanInterfaceMasterViewportControlNewOptions').click(function(event)
	{
		interfaceSetupUserNewOptions();
	});
	
	$('#spanInterfaceMasterViewportControlAction').click(function(event)
	{
		interfaceSetupUserSave();
	});
	
	$('#spanInterfaceMasterViewportControlActionOptions').click(function(event)
	{
		interfaceSetupUserSaveOptions();
	});
	
	$('#spanInterfaceMasterViewportControlSetup').click(function(event)
	{
		interfaceSetupUserSetup();
	});
	
	$('#spanInterfaceMasterViewportControlSetupOptions').click(function(event)
	{
		interfaceSetupUserSetupOptions();
	});
	
	$('#spanInterfaceMasterViewportControlHelp').click(function(event)
	{
		interfaceSetupUserHelp();
	});
	
	$('#spanInterfaceMasterViewportControlHelpOptions').click(function(event)
	{
		interfaceSetupUserHelpOptions();
	});

	$('td.interfaceViewportMasterControlBrowse').click(function(event)
	{
		interfaceSetupUserSearch(event.target.id, giSearchSource_BROWSE);
	});
	
	$('td.interfaceViewportMasterControlBrowseAll').click(function(event)
	{
		interfaceSetupUserSearch(event.target.id, giSearchSource_BROWSE);
	});
	
	$('#inputInterfaceMasterViewportControlSearch').focus();
	
	interfaceSetupUserHomeShow();
	
}

function interfaceSetupUserHomeShow(oResponse)
{
	if (oResponse == undefined)
	{
		var aHTML = [];
		var h = -1;
					
		aHTML[++h] = '<table id="tableInterfaceViewportMain" class="interfaceViewportMain">';
		aHTML[++h] = '<tr id="trInterfaceViewportMain" class="interfaceViewportMain">' +
						'<td id="tdInterfaceSetupUserHomeMostLikely" class="interfaceViewportMain">' +
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
		oSearch.method = 'SETUP_USER_SEARCH';
		oSearch.addField('username,unrestrictedaccess');
		oSearch.rows = 10;
		oSearch.sort('modifieddate', 'desc');
		oSearch.getResults(interfaceSetupUserHomeShow);
	}
	else
	{
		var aHTML = [];
		var sRestriction;

		if (oResponse.data.rows.length == 0)
		{
			aHTML.push('<table id="tableInterfaceMessagingConversationHomeMostLikely">');
			aHTML.push('<tr class="trInterfaceMessagingConversationHomeMostLikelyNothing">');
			aHTML.push('<td class="tdInterfaceMessagingConversationHomeMostLikelyNothing">Click New to create a user.</td>');
			aHTML.push('</tr>');
			aHTML.push('</table>');
		}
		else
		{
		
			aHTML.push('<table id="tableInterfaceSetupUserHomeMostLikely">');
			aHTML.push('<tr>');
			aHTML.push('<td class="interfaceMain">MOST LIKELY</td>');
			aHTML.push('</tr>');
			
			$.each(oResponse.data.rows, function()
			{	
				aHTML.push('<tr class="interfaceMainRow">');
				aHTML.push('<td id="interfaceSetupUserHomeMostLikely_Title-' + this.id + 
										'" class="interfaceHomeMostLikely" style="width:125px;">' +
										this.username +
										'</td>');
				
				if (this.unrestrictedaccess == 'Y')
				{
					sRestriction = "Access to everything"
				}
				else
				{
					sRestriction = "Restrictred access by role"
				}

				aHTML.push('<td id="interfaceUserHomeMostLikely_Restriction-' + this.id + '" class="interfaceHomeMostLikelySub">' +
										sRestriction + '</td>');

				aHTML.push('</tr>');

			});
			
			aHTML.push('</tbody></table>');
			
			aHTML.push('<table id="tableInterfaceSetupUserHomeMostLikelyMore">');
			aHTML.push('<tr><td id="tdInterfaceSetupUserHomeMostLikelyMore">' +
						'<a href="#" id="aInterfaceSetupUserHomeMostLikelyMore">more...</a>' +
						'</td></tr>');
			aHTML.push('</tbody></table>');
		}
		
		$('#tdInterfaceSetupUserHomeMostLikely').html(aHTML.join(''));
	
		$('td.interfaceHomeMostLikely').click(function(event)
		{
			interfaceSetupUserSearch(event.target.id, {source: 1});
		});
		
		$('#aInterfaceSetupUserHomeMostLikelyMore').click(function(event)
		{
			interfaceSetupUserSearch('tdInterfaceViewportMasterControlBrowse-', {source: giSearchSource_BROWSE});
		});
	}
}

function interfaceSetupUserSearch(sXHTMLElementId, iSource, sSearchText, sSearchContext)
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
		oSearch.method = 'SETUP_USER_SEARCH';
		oSearch.addField('username,contactpersontext,lastlogon,disabled,disabledreason,unrestrictedaccess');
		oSearch.addFilter('id', 'EQUAL_TO', giObjectContext);
		oSearch.getResults(function(data) {interfaceSetupUserShow(data)});
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
			
			var oSearch = new AdvancedSearch();
			oSearch.method = 'SETUP_USER_SEARCH';
			oSearch.addField('username');
			
			if (iSource == giSearchSource_BROWSE)
			{
				oSearch.addFilter('username', 'STRING_STARTS_WITH', sSearchText);
			}
			else
			{	
				oSearch.addFilter('username', 'STRING_IS_LIKE', sSearchText);
			}	
			
			oSearch.getResults(interfaceSetupUserSearchShow);
		}
	};	
}

function interfaceSetupUserSearchShow(oResponse)
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
							this.username + '</td>';
			
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
			interfaceSetupUserSearch(event.target.id, 1);
		});
	}			
}

function interfaceSetupUserViewport()
{
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceViewportControlContext" class="interfaceViewportControlContext"></div>';
	
	aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
					
	aHTML[++h] = '<tr id="trInterfaceViewportControl1" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlSummary" class="interfaceViewportControl interfaceViewportControlHighlight">Summary</td>' +
					'</tr>';
					
	aHTML[++h] = '<tr id="trInterfaceViewportControl2" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlDetails" class="interfaceViewportControl">Details</td>' +
					'</tr>';
			
	aHTML[++h] = '<tr><td>&nbsp;</td></tr>';
	
		
	aHTML[++h] = '<tr id="trInterfaceViewportControlAccess" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlAccess" class="interfaceViewportControl">Access</td>' +
						'</tr>';
							
	aHTML[++h] = '</table>';					
				
	$('#divInterfaceViewportControl').html(aHTML.join(''));
	
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceMainSummary" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainDetails" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainAccess" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainMessaging" class="divInterfaceViewportMain"></div>';
			
	$('#divInterfaceMain').html(aHTML.join(''));
		
	$('#tdInterfaceViewportControlSummary').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainSummary");
		interfaceSetupUserSummary();
	});
	
	$('#tdInterfaceViewportControlDetails').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainDetails");
		interfaceSetupUserDetails();
	});	
	
	$('#tdInterfaceViewportControlMessaging').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainMessaging");
		interfaceSetupUserMessaging();
	});

	$('#tdInterfaceViewportControlAccess').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainAccess");
		interfaceSetupUserAccess();
	});	
}

function interfaceSetupUserShow(oResponse)
{
	$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
	interfaceSetupUserViewport();
	
	var aHTML = [];
	var h = -1;
	
	if (oResponse.data.rows.length == 0)
	{
		goObjectContext = undefined;
		
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find User.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		$('#spanInterfaceMasterViewportControlAction').button({disabled: false});

		goObjectContext = oResponse.data.rows[0];
				
		var sContext = goObjectContext.username;
		var aContext = sContext.split("@");
		
		sContext = aContext[0];
		
		for (var i = 1; i < aContext.length; i++)
		{
			sContext += '<br />@' + aContext[i];
		}
			
		$('#divInterfaceViewportControlContext').html(sContext);
		
		aHTML[++h] = '<table id="tableInterfaceMainSummary" class="interfaceMain">';
		aHTML[++h] = '<tr id="trInterfaceMainSummaryRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainSummaryColumn1" class="interfaceMainColumn1">' +
						'</td>' +
						'<td id="tdInterfaceMainSummaryColumn2" class="interfaceMainColumn2x">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMainSummary').html(aHTML.join(''));
		
		interfaceSetupUserSummary();
	}	
}		
		
function interfaceSetupUserSummary()
{
	var aHTML = [];
	var h = -1;
	
	if (goObjectContext == undefined)
	{
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find user.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{	
		aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMainColumn1">';
		
		var sTmpClass = ''
		
		if (goObjectContext.disabled == 'Y')
		{
			sTmpClass = ' interfaceMainDisabled';
		}
		
		aHTML[++h] = '<tr><td id="tdInterfaceMainSummarySiteID" class="interfaceMainSummary">User</td></tr>' +
						'<tr><td id="tdInterfaceMainSummarySiteID" class="interfaceMainSummaryValue' + sTmpClass + '">' +
						goObjectContext.username +
						'</td></tr>';
						
		aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryLastLogon" class="interfaceMainSummary">Name</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryLastLogon" class="interfaceMainSummaryValue">' +
						goObjectContext.contactpersontext +
						'</td></tr>';
		
		if (goObjectContext.lastlogon != '')
		{
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryLastLogon" class="interfaceMainSummary">Last Logon</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryLastLogon" class="interfaceMainSummaryValue">' +
						goObjectContext.lastlogon +
						'</td></tr>';
		}
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn1').html(aHTML.join(''));

		var aHTML = [];
		var h = -1;	
		
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMainColumn2">';
		
		if (1==0 && goObjectContext.disabled == 'N')
		{
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryTask1" class="interfaceMainSummary">' +
						'<a href="#" id="aInterfaceMainSummaryDisable">Disable Access</a>' +
						'</td></tr>';
		}				
										
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn2').html(aHTML.join(''));
		
		$('#aInterfaceMainSummaryDisable').click(function(event)
		{
			interfaceMasterMainViewportShow("#divInterfaceMainDisable");
			interfaceSetupUserDisable();
		});
	}	
}

function interfaceSetupUserDetails()
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
						'<td id="tdInterfaceMainDetailsColumn2" class="interfaceMainColumn2">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMainDetails').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn1" class="interfaceMain">';
	
		aHTML[++h] = '<tr id="trInterfaceMainDetailsUsername" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsUsername" class="interfaceMain">' +
						'User Name (Logon Name)' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsUserNameValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsUserNameValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainDetailsUserName" class="inputInterfaceMainText">' +
						'</td></tr>';
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainDetailsColumn1').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
			
		aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn2" class="interfaceMain">';
	
		aHTML[++h] = '<tr id="trInterfaceMainDetailsDisabled" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsDisabled" class="interfaceMain">' +
						'Disabled' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsDisabled" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsDisabledValue" class="interfaceMainRadio">' +
						'<input type="radio" id="radioDisabledN" name="radioDisabled" value="N"/>No<br />' +
						'<input type="radio" id="radioDisabledY" name="radioDisabled" value="Y"/>Yes' +
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceMainDetailsDisabledReason" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsDisabledReason" class="interfaceMain">' +
						'Disabled Reason' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsDisabledReasonValue" class="interfaceMainTextMulti">' +
						'<td id="tdInterfaceMainDetailsDisabledReasonValue" class="interfaceMainTextMulti">' +
						'<textarea rows="10" cols="35" id="inputInterfaceMainDetailsDisabledReason" class="inputInterfaceMainTextMultiSmall"></textarea>' +
						'</td></tr>';
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainDetailsColumn2').html(aHTML.join(''));
		
		if (goObjectContext != undefined)
		{
			$('#inputInterfaceMainDetailsUserName').val(goObjectContext.username);
			$('[name="radioDisabled"][value="' + goObjectContext.disabled + '"]').attr('checked', true);
			$('#inputInterfaceMainDetailsDisabledReason').val(goObjectContext.disabledreason);
		}
		else
		{
			$('[name="radioDisabled"][value="N"]').attr('checked', true);
		}
	}	
}

function interfaceSetupUserAccess()
{
	var aHTML = [];
	var h = -1;
		
	if ($('#divInterfaceMainAccess').attr('onDemandLoading') == '1')
	{
		$('#divInterfaceMainAccess').attr('onDemandLoading', '');
		
		aHTML[++h] = '<table id="tableInterfaceMainAccess" class="interfaceMainDetails">';
		aHTML[++h] = '<tr id="trInterfaceMainAccessRow1" class="interfaceMain">' +
						'<td id="tdInterfaceMainAccessColumn1" class="interfaceMainColumn1" style="width:200px;">' +
						'</td>' +
						'<td id="tdInterfaceMainAccessColumn2" class="interfaceMainColumn2">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMainAccess').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn1" class="interfaceMain">';
	
		aHTML[++h] = '<tr id="trInterfaceMainAccessUnrestricted" class="interfaceMainText">' +
						'<td id="tdInterfaceMainAccessUnrestrictedValue" class="interfaceMainRadio">' +
						'<input type="radio" id="radioAccessUnrestrictedY" name="radioAccessUnrestricted" value="Y"/>Access&nbsp;to&nbsp;everything<br />' +
						'<input type="radio" id="radioAccessUnrestrictedN" name="radioAccessUnrestricted" value="N"/>Restricted by role' +
						'</td></tr>';
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainAccessColumn1').html(aHTML.join(''));
			
		interfaceSetupUserAccessRoles();

		if (goObjectContext != undefined)
		{
			$('[name="radioAccessUnrestricted"][value="' + goObjectContext.unrestrictedaccess + '"]').attr('checked', true);
		}
		else
		{
			$('[name="radioAccessUnrestricted"][value="Y"]').attr('checked', true);
		}
	}	
}

function interfaceSetupUserAccessRoles(aParam, oResponse)
{
	var aHTML = [];
	var h = -1;
	
	if (goObjectContext != undefined)
	{
		if (goObjectContext.unrestrictedaccess == 'Y')
		{
			aHTML[++h] = '<table lass="interfaceMain">';

			aHTML[++h] = '<tr class="interfaceMainCaption">' +
							'<td class="interfaceMainRowNothing" style="font-weight:600;">This user can access all functions within this space.</td></tr>' +
							'<td class="interfaceMainRowNothing">If you select <em>restricted access</em> and save, you can then allocate predefined <em>users roles</em> to them.</td></tr>';

			aHTML[++h] = '</table>';

			$('#tdInterfaceMainAccessColumn2').html(aHTML.join(''));			
		}
		else
		{
			if (oResponse == undefined)
			{
				var oSearch = new AdvancedSearch();
				oSearch.method = 'SETUP_USER_ROLE_SEARCH';
				oSearch.addField('roletext,role');
				oSearch.rows = 50;
				oSearch.sort('roletext', 'asc');
				oSearch.getResults(function(data) {interfaceSetupUserAccessRoles(aParam, data)})	
			}
			else
			{

				var aHTML = [];
				var h = -1;
				
				aHTML[++h] = '<table class="interfaceMain">' +
							'<tr id="trInterfaceMainUserAccessRolesRow1" class="interfaceMainRow1">' +
							'<td id="tdInterfaceMainUserAccessRolesColumn1" class="interfaceMainColumn1Large">' +
							'</td>' +
							'<td id="tdInterfaceMainUserAccessRolesColumn2" style="width: 100px;" class="interfaceMainColumn2Action">' +
							'</td>' +
							'</tr>' +
							'</table>';				
				
				$('#tdInterfaceMainAccessColumn2').html(aHTML.join(''));

				var aHTML = [];
				var h = -1;
				
				aHTML[++h] = '<table class="interfaceMainColumn2">';
				
				aHTML[++h] = '<tr><td id="tdInterfaceMainUserAccessRolesAdd" class="interfaceMainAction">' +
								'<span id="spanInterfaceMainUserAccessRolesAdd">Add Role</span>' +
								'</td></tr>';
				
				aHTML[++h] = '</table>';					
				
				$('#tdInterfaceMainUserAccessRolesColumn2').html(aHTML.join(''));
				
				$('#spanInterfaceMainUserAccessRolesAdd').button(
				{
					label: "Add Role"
				})
				.click(function() {
					interfaceMasterOptionsSetPosition('spanInterfaceMainUserAccessRolesAdd', -50, -280);
					interfaceSetupUserAccessRoleAdd(aParam);
				})
				.css('width', '75px')

				var aHTML = [];
				var h = -1;	
						
				aHTML[++h] = '<table cellspacing="0" cellpadding="0" class="interfaceMain">';
				aHTML[++h] = '<tbody>';

				if (oResponse.data.rows.length == 0)
				{
					aHTML[++h] = '<tr class="interfaceMainCaption">' +
							'<td class="interfaceMainRowNothing" >This user has no roles and thus no functional access.</td></tr>';
				}

				$(oResponse.data.rows).each(function()
				{

					aHTML[++h] = '<tr class="interfaceMainRow">';
					
					aHTML[++h] = '<td id="interfaceUserRole_Title-' + this.id + '" class="interfaceMainRow interfaceMainRowSelect role"' +
											' title="">' +
											this.roletext + '</td>';

					aHTML[++h] = '<td style="width:30px;text-align:right;" class="interfaceMainRow">';
					aHTML[++h] = '<span id="spanUserAccessRole_options_remove-' + this.id + '" class="interfaceMainRowOptionsRemove"></span>';
					aHTML[++h] = '</td>';																	
					aHTML[++h] = '</tr>';
				});
			
				aHTML[++h] = '</tbody></table>';
					
				$('#tdInterfaceMainUserAccessRolesColumn1').html(aHTML.join(''));

				$('td.role').click(function(event)
				{
					var sXHTMLElementId = event.target.id;
					var aId = sXHTMLElementId.split('-');
					
					interfaceSetupUserRoleMethodAccess({endpoint: aId[1], step: 2});
				});

				$('.interfaceMainRowOptionsRemove').button(
				{
					text: false,
				 	icons: {primary: "ui-icon-close"}
				})
				.click(function() {
					interfaceSetupUserAccessRoleRemove(this.id)
				})
				.css('width', '15px')
				.css('height', '20px')
			}
		}
	}

}


function interfaceSetupUserAccessRoleAdd(aParam, oResponse)
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
			oSearch.method = 'SETUP_ROLE_SEARCH';
			oSearch.addField('title,notes')

			oSearch.getResults(function(data)
			{
				interfaceSetupUserAccessRoleAdd(aParam, data)
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
								'<td class="interfaceMainRowNothing">No roles.</td></tr>';
				aHTML[++h] = '</tbody></table>';

				$('#divInterfaceMasterViewportControlOptions').html(aHTML.join(''));
				$('#divInterfaceMasterViewportControlOptions').show(giShowSpeedOptions);
			}
			else
			{
				aHTML[++h] = '<table id="tableContactPersonGroupsAddSelect" class="interfaceSearchMedium" style="font-size:0.725em;">';
				aHTML[++h] = '<tbody>'
				
				$.each(oResponse.data.rows, function()
				{	
					aHTML[++h] = '<tr class="interfaceMainRow">';
					
					aHTML[++h] = '<td id="tdUserAccessRoleAddSelect-title-' + this.id + '" class="interfaceMainRowSelect">' +
											this.title + '</td>';
					
					aHTML[++h] = '</tr>'
				});
				
				aHTML[++h] = '</tbody></table>';

				$('#divInterfaceMasterViewportControlOptions').html(aHTML.join(''));
				$('#divInterfaceMasterViewportControlOptions').show(giShowSpeedOptions);
				
				$('td.interfaceMainRowSelect').click(function(event)
				{
					interfaceSetupUserAccessRoleSelect(event.target.id);
				});
			}
		}
	}	
}
	
	
function interfaceSetupUserAccessRoleSelect(sXHTMLElementId)
{

	var aSearch = sXHTMLElementId.split('-');
	var sElementId = aSearch[0];
	var sSearchContext = aSearch[2];
	
	$('#' + sXHTMLElementId).fadeOut(500);
	
	var sParam = 'method=SETUP_USER_ROLE_MANAGE';
	var sData = 'user=' + giObjectContext +
				'&role=' + sSearchContext;
				
	$.ajax(
		{
			type: 'POST',
			url: '/ondemand/setup/setup.asp?' + sParam,
			data: sData,
			dataType: 'json',
			success: function(data){interfaceSetupUserAccessRoles()}
		});
		
}

function interfaceSetupUserAccessRoleRemove(sXHTMLElementId)
{

	var aSearch = sXHTMLElementId.split('-');
	var sElementId = aSearch[0];
	var sSearchContext = aSearch[1];
	
	var sParam = 'method=SETUP_USER_ROLE_MANAGE&remove=1';
	var sData = 'id=' + sSearchContext;
				
	$.ajax(
		{
			type: 'POST',
			url: '/ondemand/setup/setup.asp?' + sParam,
			data: sData,
			dataType: 'json',
			success: function(data){$('#' + sXHTMLElementId).parent().parent().fadeOut(500)}
		});	
}

function interfaceSetupUserSave()
{
	var sParam = 'method=SETUP_USER_MANAGE';
	var sData = '_=1';

	interfaceMasterStatusWorking();

	if (giObjectContext != -1)
	{
		sParam += '&id=' + giObjectContext	
	}	
	
	if ($('#divInterfaceMainDetails').html() != '')
	{
		sData += '&username=' + encodeURIComponent($('#inputInterfaceMainDetailsUserName').val());
		sData += '&disabled=' + $('input[name="radioDisabled"]:checked').val();
		sData += '&disabledreason=' + encodeURIComponent($('#inputInterfaceMainDetailsDisabledReason').val());
	};

	if ($('#divInterfaceMainAccess').html() != '')
	{
		sData += '&unrestrictedaccess=' + $('input[name="radioAccessUnrestricted"]:checked').val();
		goObjectContext.unrestrictedaccess = $('input[name="radioAccessUnrestricted"]:checked').val();
		interfaceSetupUserAccessRoles();
	};

	$.ajax(
	{
		type: 'POST',
		url: '/ondemand/setup/setup.asp?' + sParam,
		data: sData,
		dataType: 'text',
		success: interfaceMasterStatus('Saved')
	});		
}

