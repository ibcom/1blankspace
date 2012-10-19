/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */

function interfaceSetupUserMasterViewport()
{
	ns1blankspace.objectName = 'Users';
	ns1blankspace.objectContext = -1;
	ns1blankspace.object = 40;
	ns1blankspace.objectContextData = undefined;
	
	ns1blankspaceReset();		
			
	$('#divns1blankspaceViewportControlSet').button(
	{
		label: "Users"
	});
	
	$('#inputns1blankspaceViewportControlSearch').keyup(function(event)
	{
		if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
        ns1blankspace.timer.delayCurrent = setTimeout("interfaceSetupUserSearch('inputns1blankspaceViewportControlSearch')", ns1blankspace.option.typingWait);
	});
	
	$('#spanns1blankspaceViewportControlSearch').click(function(event)
	{
		interfaceSetupUserSearch('inputns1blankspaceViewportControlSearch');
	});
	
	$('#spanns1blankspaceViewportControlSearchOptions').click(function(event)
	{
		interfaceSetupUserSearchOptions();
	});
	
	$('#spanns1blankspaceViewportControlNew').click(function(event)
	{
		interfaceSetupUserNew();
	})
	
	$('#spanns1blankspaceViewportControlNewOptions').click(function(event)
	{
		interfaceSetupUserNewOptions();
	});
	
	$('#spanns1blankspaceViewportControlAction').click(function(event)
	{
		interfaceSetupUserSave();
	});
	
	$('#spanns1blankspaceViewportControlActionOptions').click(function(event)
	{
		interfaceSetupUserSaveOptions();
	});
	
	$('#spanns1blankspaceViewportControlSetup').click(function(event)
	{
		interfaceSetupUserSetup();
	});
	
	$('#spanns1blankspaceViewportControlSetupOptions').click(function(event)
	{
		interfaceSetupUserSetupOptions();
	});
	
	$('#spanns1blankspaceViewportControlHelp').click(function(event)
	{
		interfaceSetupUserHelp();
	});
	
	$('#spanns1blankspaceViewportControlHelpOptions').click(function(event)
	{
		interfaceSetupUserHelpOptions();
	});

	$('td.interfaceViewportMasterControlBrowse').click(function(event)
	{
		interfaceSetupUserSearch(event.target.id, ns1blankspace.data.searchSource.browse);
	});
	
	$('td.interfaceViewportMasterControlBrowseAll').click(function(event)
	{
		interfaceSetupUserSearch(event.target.id, ns1blankspace.data.searchSource.browse);
	});
	
	if (ns1blankspace.option.setFocus) {$('#inputns1blankspaceViewportControlSearch').focus()};
	
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
						ns1blankspace.xhtml.loading + 
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMain').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
					
		aHTML[++h] = '<table>';
		aHTML[++h] = '<tr>' +
						'<td id="ns1blankspaceViewportSetupLarge" class="ns1blankspaceViewportImageLarge">' +
						'&nbsp;' + 
						'</td>' +
						'</tr>';

		aHTML[++h] = '<tr id="trInterfaceViewportControl2" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlInternal" class="interfaceViewportControl">Internal</td>' +
					'</tr>';			
				
		aHTML[++h] = '<tr id="trInterfaceViewportControl3" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlExternal" class="interfaceViewportControl" style="padding-top:10px;">Other User Access</td>' +
					'</tr>';	

		aHTML[++h] = '</table>';		
		
		$('#divInterfaceViewportControl').html(aHTML.join(''));
		

		$('#tdInterfaceViewportControlInternal').click(function(event)
		{
			ns1blankspaceMainViewportShow("#divInterfaceMain", true);
			interfaceSetupUserHomeShow();
		});
			
		$('#tdInterfaceViewportControlExternal').click(function(event)
		{
			ns1blankspaceMainViewportShow("#divInterfaceMain", true);
			interfaceSetupUserExternal({xhtmlElementID: "divInterfaceMain"});
		});

		$('#tdInterfaceViewportControlInternal').addClass('interfaceViewportControlHighlight');

		$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
		
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
		
			aHTML.push('<table id="tableInterfaceSetupUserHomeMostLikely" cellpadding="4">');
			aHTML.push('<tr>');
			aHTML.push('<td class="interfaceMain">MOST LIKELY</td>');
			aHTML.push('</tr>');
			
			$.each(oResponse.data.rows, function()
			{	
				aHTML.push('<tr class="interfaceMainRow">');
				aHTML.push('<td id="interfaceSetupUserHomeMostLikely_Title-' + this.id + 
										'" class="interfaceHomeMostLikely" style="width:250px;">' +
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
		}
		
		$('#tdInterfaceSetupUserHomeMostLikely').html(aHTML.join(''));
	
		$('td.interfaceHomeMostLikely').click(function(event)
		{
			interfaceSetupUserSearch(event.target.id, {source: 1});
		});
		
		$('#aInterfaceSetupUserHomeMostLikelyMore').click(function(event)
		{
			interfaceSetupUserSearch('tdInterfaceViewportMasterControlBrowse-', {source: ns1blankspace.data.searchSource.browse});
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
		iSource = ns1blankspace.data.searchSource.text;
	}	
		
	if (sSearchContext != undefined && iSource != ns1blankspace.data.searchSource.browse)
	{
		$('#divInterfaceViewportControl').html(ns1blankspace.xhtml.loading);
		
		ns1blankspace.objectContext = sSearchContext;
		
		var oSearch = new AdvancedSearch();
		oSearch.method = 'SETUP_USER_SEARCH';
		oSearch.addField('username,contactpersontext,lastlogon,disabled,disabledreason,unrestrictedaccess');
		oSearch.addFilter('id', 'EQUAL_TO', ns1blankspace.objectContext);
		oSearch.getResults(function(data) {interfaceSetupUserShow(data)});
	}
	else
	{
		var iMinimumLength = 3;
		var iMaximumColumns = 1;
		
		if (sSearchText == undefined)
		{
			sSearchText = $('#inputns1blankspaceViewportControlSearch').val();
		}	
		
		if (iSource == ns1blankspace.data.searchSource.browse)
		{
			iMinimumLength = 1;
			iMaximumColumns = 4;
			sSearchText = aSearch[1];
			if (sSearchText == '#') {sSearchText = '[0-9]'}
			sElementId = 'tableInterfaceViewportMasterBrowse';
		}
		
		if (sSearchText.length >= iMinimumLength || iSource == ns1blankspace.data.searchSource.browse)
		{	
			ns1blankspaceOptionsSetPosition(sElementId);
			ns1blankspaceSearchStart(sElementId);
			
			var oSearch = new AdvancedSearch();
			oSearch.method = 'SETUP_USER_SEARCH';
			oSearch.addField('username');
			
			if (iSource == ns1blankspace.data.searchSource.browse)
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
		ns1blankspaceSearchStop();
		$('#divns1blankspaceViewportControlOptions').hide();
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

		$('#divns1blankspaceViewportControlOptions').html(aHTML.join(''));
		$('#divns1blankspaceViewportControlOptions').show(ns1blankspace.option.showSpeedOptions);
		ns1blankspaceSearchStop();
		
		$('td.interfaceSearch').click(function(event)
		{
			$('#divns1blankspaceViewportControlOptions').html('&nbsp;');
			$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions)
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
			
	if (ns1blankspace.objectContext == -1)
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
				
		aHTML[++h] = '<tr><td>&nbsp;</td></tr>';
		
			
		aHTML[++h] = '<tr id="trInterfaceViewportControlAccess" class="interfaceViewportControl">' +
							'<td id="tdInterfaceViewportControlAccess" class="interfaceViewportControl">Access</td>' +
							'</tr>';
	}

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
		ns1blankspaceMainViewportShow("#divInterfaceMainSummary");
		interfaceSetupUserSummary();
	});
	
	$('#tdInterfaceViewportControlDetails').click(function(event)
	{
		ns1blankspaceMainViewportShow("#divInterfaceMainDetails");
		interfaceSetupUserDetails();
	});	
	
	$('#tdInterfaceViewportControlMessaging').click(function(event)
	{
		ns1blankspaceMainViewportShow("#divInterfaceMainMessaging");
		interfaceSetupUserMessaging();
	});

	$('#tdInterfaceViewportControlAccess').click(function(event)
	{
		ns1blankspaceMainViewportShow("#divInterfaceMainAccess");
		interfaceSetupUserAccess();
	});	
}

function interfaceSetupUserShow(oResponse)
{
	$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
	interfaceSetupUserViewport();
	
	var aHTML = [];
	var h = -1;
	
	if (oResponse.data.rows.length == 0)
	{
		ns1blankspace.objectContextData = undefined;
		
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find User.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		$('#spanns1blankspaceViewportControlAction').button({disabled: false});

		ns1blankspace.objectContextData = oResponse.data.rows[0];
				
		var sContext = ns1blankspace.objectContextData.username;
		var aContext = sContext.split("@");
		
		sContext = aContext[0];
		
		for (var i = 1; i < aContext.length; i++)
		{
			sContext += '<br />@' + aContext[i];
		}
			
		$('#divInterfaceViewportControlContext').html(sContext);
		
		interfaceSetupUserSummary();
	}	
}		
		
function interfaceSetupUserSummary()
{
	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<table id="tableInterfaceMainSummary" class="interfaceMain" style="width:100%;">';
	aHTML[++h] = '<tr id="trInterfaceMainSummaryRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainSummaryColumn1Large" class="interfaceMainColumn1Large">' +
					'</td>' +
					'<td id="tdInterfaceMainSummaryColumn2Action" class="interfaceMainColumn2" style="width:150px;">' +
					'</td>' +
					'</tr>';
	aHTML[++h] = '</table>';					
	
	$('#divInterfaceMainSummary').html(aHTML.join(''));

	var aHTML = [];
	var h = -1;

	if (ns1blankspace.objectContextData == undefined)
	{
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find user.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMainSummary').html(aHTML.join(''));
	}
	else
	{	
		aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMainColumn1">';
		
		var sTmpClass = ''
		
		if (ns1blankspace.objectContextData.disabled == 'Y')
		{
			sTmpClass = ' interfaceMainDisabled';
		}
		
		aHTML[++h] = '<tr><td id="tdInterfaceMainSummarySiteID" class="interfaceMainSummary">User</td></tr>' +
						'<tr><td id="tdInterfaceMainSummarySiteID" class="interfaceMainSummaryValue' + sTmpClass + '">' +
						ns1blankspace.objectContextData.username +
						'</td></tr>';
						
		aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryLastLogon" class="interfaceMainSummary">Name</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryLastLogon" class="interfaceMainSummaryValue">' +
						ns1blankspace.objectContextData.contactpersontext +
						'</td></tr>';
		
		if (ns1blankspace.objectContextData.lastlogon != '')
		{
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryLastLogon" class="interfaceMainSummary">Last Logon</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryLastLogon" class="interfaceMainSummaryValue">' +
						ns1blankspace.objectContextData.lastlogon +
						'</td></tr>';
		}
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn1Large').html(aHTML.join(''));

		var aHTML = [];
		var h = -1;	
		
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMainColumn2" style="width:150px;">';
		
		aHTML[++h] = '<tr><td id="tdInterfaceMainResetPassword">' +
						'<span style="font-size:0.75em;" id="spanInterfaceMainResetPassword">Reset Password</span>' +
						'</td></tr>';
		
		aHTML[++h] = '</table>';								
		
		$('#tdInterfaceMainSummaryColumn2Action').html(aHTML.join(''));
		
		$('#spanInterfaceMainResetPassword').button(
		{
			
		})
		.click(function() {
				
			$.ajax(
			{
				type: 'GET',
				url: '/ondemand/setup/?method=SETUP_USER_MANAGE&password=&passwordexpiry=' + Date.today().add(-1).days().toString("dd-MMM-yyyy") +'&id=' + ns1blankspace.objectContext,
				dataType: 'json',
				async: false,
				success: function(data) {
						$('#tdInterfaceMainResetPassword').html('New password is <strong>' + data.password + '</strong>.');
					}
			});
		})
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
	
		aHTML[++h] = '<tr class="interfaceMain">' +
						'<td class="interfaceMain">' +
						'User Name (Logon Name)' +
						'</td></tr>' +
						'<tr class="interfaceMainText">' +
						'<td class="interfaceMainText">' +
						'<input id="inputInterfaceMainDetailsUserName" class="inputInterfaceMainText">' +
						'</td></tr>';
		
		if (ns1blankspace.objectContext == -1)
		{
			aHTML[++h] = '<tr class="interfaceMain">' +
							'<td class="interfaceMain">' +
							'First Name' +
							'</td></tr>' +
							'<tr class="interfaceMainText">' +
							'<td class="interfaceMainText">' +
							'<input id="inputInterfaceMainDetailsFirstName" class="inputInterfaceMainText">' +
							'</td></tr>';

			aHTML[++h] = '<tr class="interfaceMain">' +
							'<td class="interfaceMain">' +
							'Last Name' +
							'</td></tr>' +
							'<tr class="interfaceMainText">' +
							'<td class="interfaceMainText">' +
							'<input id="inputInterfaceMainDetailsLastName" class="inputInterfaceMainText">' +
							'</td></tr>';			
		}

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
		
		if (ns1blankspace.objectContext != -1)
		{		
			aHTML[++h] = '<tr id="trInterfaceMainDetailsDisabledReason" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsDisabledReason" class="interfaceMain">' +
						'Disabled Reason' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsDisabledReasonValue" class="interfaceMainTextMulti">' +
						'<td id="tdInterfaceMainDetailsDisabledReasonValue" class="interfaceMainTextMulti">' +
						'<textarea rows="10" cols="35" id="inputInterfaceMainDetailsDisabledReason" class="inputInterfaceMainTextMultiSmall"></textarea>' +
						'</td></tr>';
		}				
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainDetailsColumn2').html(aHTML.join(''));
		
		if (ns1blankspace.objectContextData != undefined)
		{
			$('#inputInterfaceMainDetailsUserName').val(ns1blankspace.objectContextData.username);
			$('[name="radioDisabled"][value="' + ns1blankspace.objectContextData.disabled + '"]').attr('checked', true);
			$('#inputInterfaceMainDetailsDisabledReason').val(ns1blankspace.objectContextData.disabledreason);
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

		if (ns1blankspace.objectContextData != undefined)
		{
			$('[name="radioAccessUnrestricted"][value="' + ns1blankspace.objectContextData.unrestrictedaccess + '"]').attr('checked', true);
		}
		else
		{
			$('[name="radioAccessUnrestricted"][value="Y"]').attr('checked', true);
		}
	}	
}

function interfaceSetupUserAccessRoles(oParam, oResponse)
{
	var aHTML = [];
	var h = -1;
	
	if (ns1blankspace.objectContextData != undefined)
	{
		if (ns1blankspace.objectContextData.unrestrictedaccess == 'Y')
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
				oSearch.addFilter('user', 'EQUAL_TO', ns1blankspace.objectContext)
				oSearch.rows = 50;
				oSearch.sort('roletext', 'asc');
				oSearch.getResults(function(data) {interfaceSetupUserAccessRoles(oParam, data)})	
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
					ns1blankspaceOptionsSetPosition('spanInterfaceMainUserAccessRolesAdd', -50, -280);
					interfaceSetupUserAccessRoleAdd(oParam);
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


function interfaceSetupUserAccessRoleAdd(oParam, oResponse)
{
		
	if ($('#divns1blankspaceViewportControlOptions').attr('data-initiator') == 'spanInterfaceMainUserAccessRolesAdd')
	{
		$('#divns1blankspaceViewportControlOptions').slideUp(500);
		$('#divns1blankspaceViewportControlOptions').attr('data-initiator', '');
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
				interfaceSetupUserAccessRoleAdd(oParam, data)
			});
		}
		else
		{
			
			$('#divns1blankspaceViewportControlOptions').attr('data-initiator', 'spanInterfaceMainUserAccessRolesAdd')
			
			var aHTML = [];
			var h = -1;
			
			if (oResponse.data.rows.length == 0)
			{
				aHTML[++h] = '<table border="0" cellspacing="0" cellpadding="0" class="interfaceSearchMedium">';
				aHTML[++h] = '<tbody>'
				aHTML[++h] = '<tr class="interfaceMainCaption">' +
								'<td class="interfaceMainRowNothing">No roles.</td></tr>';
				aHTML[++h] = '</tbody></table>';

				$('#divns1blankspaceViewportControlOptions').html(aHTML.join(''));
				$('#divns1blankspaceViewportControlOptions').show(ns1blankspace.option.showSpeedOptions);
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

				$('#divns1blankspaceViewportControlOptions').html(aHTML.join(''));
				$('#divns1blankspaceViewportControlOptions').show(ns1blankspace.option.showSpeedOptions);
				
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
	var sData = 'user=' + ns1blankspace.objectContext +
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

function interfaceSetupUserSave(oResponse)
{
	ns1blankspaceStatusWorking();

	if (ns1blankspace.objectContext != -1)
	{
		interfaceSetupUserSaveProcess();
	}
	else
	{
		if (oResponse == undefined)
		{	
			if ($('#inputInterfaceMainDetailsUserName').val() == '' ||
				$('#inputInterfaceMainDetailsFirstName').val() == '' ||
				$('#inputInterfaceMainDetailsLastName').val() == '')
			{
				ns1blankspaceStatusError('Missing information.');
			}	
			else
			{
				var oSearch = new AdvancedSearch();
				oSearch.endPoint = 'contact';
				oSearch.method = 'CONTACT_PERSON_SEARCH';
				oSearch.addField('firstname');
				oSearch.addFilter('contactbusiness', 'EQUAL_TO', ns1blankspace.contactBusiness);
				oSearch.addFilter('firstname', 'EQUAL_TO', $('#inputInterfaceMainDetailsFirstName').val());
				oSearch.addFilter('surname', 'EQUAL_TO', $('#inputInterfaceMainDetailsLastName').val());
				oSearch.getResults(interfaceSetupUserSave);
			}
		}
		else	
		{
			if (oResponse.data.rows.length > 0)
			{
				interfaceSetupUserSaveProcess(
				{
					contactPerson: oResponse.data.rows[0].contactperson,
					contactBusiness: ns1blankspace.contactBusiness
				});		
			}
			else
			{
				var sData = 'contactbusiness=' + ns1blankspace.contactBusiness;
				sData += '&firstname=' + ns1blankspaceFormatSave($('#inputInterfaceMainDetailsFirstName').val());
				sData += '&surname=' + ns1blankspaceFormatSave($('#inputInterfaceMainDetailsLastName').val());

				$.ajax(
				{
					type: 'POST',
					url: ns1blankspaceEndpointURL('CONTACT_PERSON_MANAGE'),
					data: sData,
					dataType: 'json',
					success: function(data)
						{
							if (data.status == 'OK')
							{
								interfaceSetupUserSaveProcess(
								{
									contactPerson: data.id,
									contactBusiness: ns1blankspace.contactBusiness
								});	
							}
							else
							{
								ns1blankspaceStatusError('Could not add user.')
							}
						}
				});

			}	
		}
	}
}

function interfaceSetupUserSaveProcess(oParam)
{
	var sParam = 'method=SETUP_USER_MANAGE';
	var sData = '_=1';
	var iContactBusiness = ns1blankspace.contactBusiness;
	var iContactPerson;

	if (oParam != undefined)
	{
		if (oParam.contactBusiness != undefined) {iContactBusiness = oParam.contactBusiness}
		if (oParam.contactPerson != undefined) {iContactPerson = oParam.contactPerson}
	}		

	if (ns1blankspace.objectContext != -1)
	{
		sParam += '&id=' + ns1blankspace.objectContext	
	}
	else
	{
		sData += '&contactbusiness=' + iContactBusiness;
		sData += '&contactperson=' + iContactPerson;
		sData += '&unrestrictedaccess=N';
	}
	
	if ($('#divInterfaceMainDetails').html() != '')
	{
		sData += '&username=' + ns1blankspaceFormatSave($('#inputInterfaceMainDetailsUserName').val());
		sData += '&disabled=' + $('input[name="radioDisabled"]:checked').val();
		sData += '&disabledreason=' + ns1blankspaceFormatSave($('#inputInterfaceMainDetailsDisabledReason').val());
	};

	if ($('#divInterfaceMainAccess').html() != '')
	{
		sData += '&unrestrictedaccess=' + $('input[name="radioAccessUnrestricted"]:checked').val();
		ns1blankspace.objectContextData.unrestrictedaccess = $('input[name="radioAccessUnrestricted"]:checked').val();
		interfaceSetupUserAccessRoles();
	};

	$.ajax(
	{
		type: 'POST',
		url: '/ondemand/setup/setup.asp?' + sParam,
		data: sData,
		dataType: 'json',
		success: function(data)
		{
			ns1blankspaceStatus('Saved.');
			if (ns1blankspace.objectContext == -1) {var bNew = true}
			ns1blankspace.objectContext = data.id;	
			if (bNew)
			{
				ns1blankspaceStatus('Initial password is ' + data.password);
				interfaceSetupUserSearch('-' + ns1blankspace.objectContext);
			}
		}	
	});		
}

function interfaceSetupUserExternal(oParam, oResponse)
{
	var sXHTMLElementID = 'divInterfaceMain';
	var iStep = 1;
	var aXHTMLElementID = [];

	if (oParam != undefined)
	{
		if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
		if (oParam.step != undefined) {iStep = oParam.step}
	}
	else
	{
		oParam = {step: 1}
	}

	aXHTMLElementID = sXHTMLElementID.split('-');

	if (iStep == 1)
	{
		if (oResponse == undefined)
		{
			var sParam = 'method=SETUP_EXTERNAL_USER_ACCESS_SEARCH';
			
			$.ajax(
			{
				type: 'GET',
				url: '/ondemand/setup/?rf=json',
				data: sParam,
				dataType: 'json',
				success: function(data) {interfaceSetupUserExternal(oParam, data)}
			});
		}
		else
		{
			var aHTML = [];
			var h = -1;
			
			aHTML[++h] = '<table id="tableInterfaceMainSetupUserExternal" class="interfaceMain">' +
						'<tr id="trInterfaceMainSetupUserExternalRow1" class="interfaceMainRow1">' +
						'<td id="tdInterfaceMainSetupUserExternalColumn1" style="width:150px;border-right-style:solid;border-width:2px;border-color:#B8B8B8;padding-right:15px;">' +
						'</td>' +
						'<td id="tdInterfaceMainSetupUserExternalColumn2" class="interfaceMainColumn1Large" style="padding-left:15px;">' +
						'</td>' +
						'<td id="tdInterfaceMainSetupUserExternalColumn3" style="width: 100px;" class="interfaceMainColumn2Action">' +
						'</td>' +
						'</tr>' +
						'</table>';				
			
			$('#divInterfaceMain').html(aHTML.join(''));
			
			var aHTML = [];
			var h = -1;
			
			aHTML[++h] = '<table>';
			
			aHTML[++h] = '<tr><td id="tdInterfaceMainSetupUserExternalAdd" class="interfaceMainAction">' +
							'<span id="spanInterfaceMainSetupUserExternalAdd">Add</span>' +
							'</td></tr>';
			
			aHTML[++h] = '</table>';					
			
			$('#tdInterfaceMainSetupUserExternalColumn3').html(aHTML.join(''));
			
			$('#spanInterfaceMainSetupUserExternalAdd').button(
			{
				label: "Add"
			})
			.click(function()
			{
				oParam.step = 2;
				oParam.xhtmlElementID = '';
				interfaceSetupUserExternal(oParam);
			});

			var aHTML = [];
			var h = -1;
			
			if (oResponse.data.rows.length == 0)
			{
				aHTML[++h] = '<table border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
				aHTML[++h] = '<tbody>'
				aHTML[++h] = '<tr class="interfaceMainCaption">' +
								'<td class="interfaceMainRowNothing">No external user access.</td></tr>';
				aHTML[++h] = '</tbody></table>';

				$('#tdInterfaceMainSetupUserExternalColumn1').html(aHTML.join(''));
			}
			else
			{
				aHTML[++h] = '<table>';
				aHTML[++h] = '<tbody>';
				
				$.each(oResponse.data.rows, function()
				{
					aHTML[++h] = '<tr class="interfaceMainRow">';
					
					aHTML[++h] = '<td id="tdSetupUserExternal_title-' + this.id +
											'" data-usertext="' + this.userlogonname +
											'" class="interfaceMainRow interfaceRowSelect interfaceSetupUserExternal">' +
											this.userlogonname;
					
					aHTML[++h] = '<br /><span class="interfaceViewportControlSubContext" id="interfaceSetupUserExternal_space-' + this.id + '">' +
	 										this.space + '</span>';

					aHTML[++h] = '<br /><span class="interfaceViewportControlSubContext" id="interfaceSetupUserExternal_usercontactname-' + this.id + '">' +
	 										this.usercontactname + '</span>';

	 				aHTML[++h] = '</td>';						

	 				aHTML[++h] = '<td style="width:30px;text-align:right;" class="interfaceMainRow">';
					aHTML[++h] = '<span id="spanSetupUserExternal_options_remove-' + this.id + '" class="interfaceMainRowOptionsRemove"></span>';
					aHTML[++h] = '</td>';		

					aHTML[++h] = '</tr>';
				});
				
				aHTML[++h] = '</tbody></table>';

				$('#tdInterfaceMainSetupUserExternalColumn1').html(aHTML.join(''));
							
				$('td.interfaceSetupUserExternal').click(function(event)
				{
					oParam.step = 2;
					oParam.xhtmlElementID = event.target.id;
					interfaceSetupUserExternal(oParam);
				});

				$('.interfaceMainRowOptionsRemove').button(
				{
					text: false,
				 	icons: {primary: "ui-icon-close"}
				})
				.click(function()
				{
					oParam.step = 6;
					oParam.xhtmlElementID = this.id;
					interfaceSetupUserExternal(oParam);
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
			
			aHTML[++h] = '<tr id="trInterfaceMainSetupUserExternalUsername" class="interfaceMain">' +
							'<td id="tdInterfaceMainSetupUserExternalUsername" class="interfaceMain">' +
							'User' +
							'</td></tr>' +
							'<tr id="trInterfaceMainSetupUserExternalUsernameValue" class="interfaceMainSelect">' +
							'<td id="tdInterfaceMainSetupUserExternalUsernameValue" class="interfaceMainSelect">' +
							'<input id="inputInterfaceMainSetupUserExternalUsername" class="inputInterfaceMainSelectCustom">' +
							'</td></tr>';

			aHTML[++h] = '<tr class="interfaceMainCaption">' +
									'<td class="interfaceMainRowNothing">You need to search by the surname and enter at least 3 characters.</td></tr>';

			aHTML[++h] = '</table>';					
			
			$('#tdInterfaceMainSetupUserExternalColumn2').html(aHTML.join(''));
			
			$('#inputInterfaceMainSetupUserExternalUsername').keyup(function()
			{
				if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
		        ns1blankspace.timer.delayCurrent = setTimeout("interfaceSetupUserExternalSearch('inputInterfaceMainSetupUserExternalUsername')", ns1blankspace.option.typingWait);
			});	
				
			$('#inputInterfaceMainSetupUserExternalUsername').live('blur', function() 
			{
				$(this).removeClass('ns1blankspaceHighlight');
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
								'<span style="width:70px;" id="spanInterfaceMainSetupUserExternalEditSave">Save</span>' +
								'</td></tr>';
			}

			aHTML[++h] = '<tr class="interfaceMainAction">' +
								'<td class="interfaceMainAction">' +
								'<span style="width:70px;" id="spanInterfaceMainSetupUserExternalEditCancel">Cancel</span>' +
								'</td></tr>';
			
			aHTML[++h] = '</table>';					
			
			$('#tdInterfaceMainSetupUserExternalColumn3').html(aHTML.join(''));

			$('#spanInterfaceMainSetupUserExternalEditSave').button(
			{
				text: "Save"
			})
			.click(function() 
			{
				ns1blankspaceStatusWorking();

				var sData = 'id=' + ns1blankspaceFormatSave(aXHTMLElementID[1]);
				sData += '&user=' + ns1blankspaceFormatSave($('#inputInterfaceMainSetupUserExternalUsername').attr("data-id"));
				sData += '&type=2';

				$.ajax(
				{
					type: 'POST',
					url: '/ondemand/setup/setup.asp?method=SETUP_EXTERNAL_USER_ACCESS_MANAGE',
					data: sData,
					dataType: 'json',
					success: function() {
						oParam.step = 1;
						interfaceSetupUserExternal(oParam);
						ns1blankspaceStatus('Saved');
					}
				});
			})
			
			$('#spanInterfaceMainSetupUserExternalEditCancel').button(
			{
				text: "Cancel"
			})
			.click(function() 
			{
				oParam.step = 1;
				interfaceSetupUserExternal(oParam);
			})

			if (aXHTMLElementID[1])
			{
				$('#inputInterfaceMainSetupUserExternalUsername').attr("data-id", aXHTMLElementID[1])
				$('#inputInterfaceMainSetupUserExternalUsername').val($('#tdSetupUserExternal_title-' + aXHTMLElementID[1]).attr("data-usertext"));
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
				url: '/ondemand/setup/setup.asp?method=SETUP_EXTERNAL_USER_ACCESS_MANAGE&remove=1',
				data: 'id=' + aXHTMLElementID[1],
				dataType: 'json',
				success: function(data){$('#' + sXHTMLElementID).parent().parent().fadeOut(500)}
			});	
		}	
}	

function interfaceSetupUserExternalSearch(sXHTMLInputElementID, oResponse)
{
	var aHTML = [];
	var sSearchText;
	var iXHTMLElementContextID;

	if (oResponse == undefined)
	{	
		sSearchText = $('#' + sXHTMLInputElementID).val();
		
		if (sSearchText.length > 3)
		{
			$.ajax(
			{
				type: 'GET',
				url: '/ondemand/network/?method=NETWORK_USER_SEARCH&rows=10&scope=2&surname=' + ns1blankspaceFormatSave(sSearchText),
				dataType: 'json',
				success: function(data) {interfaceSetupUserExternalSearch(sXHTMLInputElementID, data)}
			});
		}
	}
	else
	{	
		aHTML.push('<table style="width: 350px;" class="interfaceViewportMasterControl" cellpadding=4>');

		$(oResponse.data.rows).each(function()
		{
			aHTML.push('<tr>' +
					'<td id="tdns1blankspaceNetworkUser-' + this.user + '" data-usertext="' + this.usertext + '" class="interfaceSearch ns1blankspaceNetworkUser">' +
					this.firstname + ' ' + this.surname + ' (' + this.contactbusinesstext + ')' +
					'</td></tr>');
		});			
						
		aHTML.push('</table>');
		
		$('#divns1blankspaceViewportControlOptions').html(aHTML.join(''));

		$('#divns1blankspaceViewportControlOptions').show(ns1blankspace.option.showSpeedOptions);
		$('#divns1blankspaceViewportControlOptions').offset({ top: $('#' + sXHTMLInputElementID).offset().top + $('#' + sXHTMLInputElementID).height(), left: $('#' + sXHTMLInputElementID).offset().left});

		$('.ns1blankspaceNetworkUser').click(function(event)
		{
			var aXHTMLElementID = (event.target.id).split('-');
			iXHTMLElementContextID = aXHTMLElementID[1];

			$('#' + sXHTMLInputElementID).val($('#' + event.target.id).attr("data-usertext"))
			$('#' + sXHTMLInputElementID).attr("data-id", iXHTMLElementContextID)
			$('#divns1blankspaceViewportControlOptions').hide();
		});
	}	
}	

function interfaceSetupUserNew(oParam)
{
	ns1blankspace.objectContextData = undefined
	ns1blankspace.objectContext = -1;
	interfaceSetupUserViewport();
	$('#spanns1blankspaceViewportControlAction').button({disabled: false});
	ns1blankspaceMainViewportShow("#divInterfaceMainDetails");
	interfaceSetupUserDetails();
}