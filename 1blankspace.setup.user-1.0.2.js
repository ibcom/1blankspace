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
	
	interfaceMasterReset();		
			
	$('#divInterfaceMasterViewportControlSet').button(
	{
		label: "Users"
	});
	
	$('#inputInterfaceMasterViewportControlSearch').keyup(function(event)
	{
		if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
        ns1blankspace.timer.delayCurrent = setTimeout("interfaceSetupUserSearch('inputInterfaceMasterViewportControlSearch')", ns1blankspace.option.typingWait);
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
		interfaceSetupUserSearch(event.target.id, ns1blankspace.data.searchSource.browse);
	});
	
	$('td.interfaceViewportMasterControlBrowseAll').click(function(event)
	{
		interfaceSetupUserSearch(event.target.id, ns1blankspace.data.searchSource.browse);
	});
	
	if (ns1blankspace.option.setFocus) {$('#inputInterfaceMasterViewportControlSearch').focus()};
	
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
						'<td id="interfaceMasterViewportSetupLarge" class="interfaceMasterViewportImageLarge">' +
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
			interfaceMasterMainViewportShow("#divInterfaceMain", true);
			interfaceSetupUserHomeShow();
		});
			
		$('#tdInterfaceViewportControlExternal').click(function(event)
		{
			interfaceMasterMainViewportShow("#divInterfaceMain", true);
			interfaceSetupUserExternal({xhtmlElementID: "divInterfaceMain"});
		});

		$('#tdInterfaceViewportControlInternal').addClass('interfaceViewportControlHighlight');

		$('#divInterfaceMasterViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
		
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
			sSearchText = $('#inputInterfaceMasterViewportControlSearch').val();
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
			interfaceMasterOptionsSetPosition(sElementId);
			interfaceMasterSearchStart(sElementId);
			
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
		$('#divInterfaceMasterViewportControlOptions').show(ns1blankspace.option.showSpeedOptions);
		interfaceMasterSearchStop();
		
		$('td.interfaceSearch').click(function(event)
		{
			$('#divInterfaceMasterViewportControlOptions').html('&nbsp;');
			$('#divInterfaceMasterViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions)
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
	$('#divInterfaceMasterViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
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
		$('#spanInterfaceMasterViewportControlAction').button({disabled: false});

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

function interfaceSetupUserAccessRoles(aParam, oResponse)
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
	var iUserType = 1;

	if (aParam != undefined)
	{
		if (aParam.userType != undefined) {iUserType = aParam.userType}
	}	
	else
	{
		aParam = {userType: 1}
	}
		
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
				$('#divInterfaceMasterViewportControlOptions').show(ns1blankspace.option.showSpeedOptions);
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
				$('#divInterfaceMasterViewportControlOptions').show(ns1blankspace.option.showSpeedOptions);
				
				$('td.interfaceMainRowSelect').click(function(event)
				{
					aParam.xhtmlElementID = event.target.id;
					interfaceSetupUserAccessRoleSelect(aParam);
				});
			}
		}
	}	
}
		
function interfaceSetupUserAccessRoleSelect(aParam)
{
	var sXHTMLElementID;
	var iUser = ns1blankspace.objectContext;
	var iUserType = 1;

	if (aParam != undefined)
	{
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
		if (aParam.user != undefined) {iUser = aParam.user}
		if (aParam.userType != undefined) {iUserType = aParam.userType}
	}		

	if (sXHTMLElementID)
	{
		var aSearch = sXHTMLElementID.split('-');
		var iRole = aSearch[2];
		
		$('#' + sXHTMLElementID).fadeOut(500);
		
		var sData = 'user=' + iUser +
					'&role=' + iRole;
					
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/setup/?method=SETUP_USER_ROLE_MANAGE',
			data: sData,
			dataType: 'json',
			success: function(data)
			{
				if (iUserType == 1)
				{	
					interfaceSetupUserAccessRoles()
				}
				else
				{	
					interfaceSetupUserExternal({step:3, user: iUser});
				}	
			}
		});
	}	
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
	interfaceMasterStatusWorking();

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
				interfaceMasterStatusError('Missing information.');
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
				sData += '&firstname=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsFirstName').val());
				sData += '&surname=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsLastName').val());

				$.ajax(
				{
					type: 'POST',
					url: interfaceMasterEndpointURL('CONTACT_PERSON_MANAGE'),
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
								interfaceMasterStatusError('Could not add user.')
							}
						}
				});

			}	
		}
	}
}

function interfaceSetupUserSaveProcess(aParam)
{
	var sParam = 'method=SETUP_USER_MANAGE';
	var sData = '_=1';
	var iContactBusiness = ns1blankspace.contactBusiness;
	var iContactPerson;

	if (aParam != undefined)
	{
		if (aParam.contactBusiness != undefined) {iContactBusiness = aParam.contactBusiness}
		if (aParam.contactPerson != undefined) {iContactPerson = aParam.contactPerson}
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
		sData += '&username=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsUserName').val());
		sData += '&disabled=' + $('input[name="radioDisabled"]:checked').val();
		sData += '&disabledreason=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsDisabledReason').val());
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
			interfaceMasterStatus('Saved.');
			if (ns1blankspace.objectContext == -1) {var bNew = true}
			ns1blankspace.objectContext = data.id;	
			if (bNew)
			{
				interfaceMasterStatus('Initial password is ' + data.password);
				interfaceSetupUserSearch('-' + ns1blankspace.objectContext);
			}
		}	
	});		
}

function interfaceSetupUserExternal(aParam, oResponse)
{
	var sXHTMLElementID = 'divInterfaceMain';
	var iStep = 1;
	var aXHTMLElementID = [];
	var iUser;

	if (aParam != undefined)
	{
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
		if (aParam.step != undefined) {iStep = aParam.step}
		if (aParam.user != undefined) {iUser = aParam.user}
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
			var oSearch = new AdvancedSearch();
			oSearch.method = 'SETUP_EXTERNAL_USER_ACCESS_SEARCH';
			oSearch.addField('userlogon,spacetext,usercontactpersontext,unrestrictedaccess,user');
			oSearch.rows = 50;
			oSearch.sort('userlogon', 'asc');
			oSearch.getResults(function(data) {interfaceSetupUserExternal(aParam, data)});
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
				aParam.step = 2;
				aParam.xhtmlElementID = '';
				interfaceSetupUserExternal(aParam);
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
											'" data-user="' + this.user +
											'" data-usertext="' + this.userlogon +
											'" data-unrestrictedaccess="' + this.unrestrictedaccess +	
											'" class="interfaceMainRow interfaceRowSelect interfaceSetupUserExternal">' +
											this.userlogon;
					
					aHTML[++h] = '<br /><span class="interfaceViewportControlSubContext" id="interfaceSetupUserExternal_space-' + this.id + '">' +
	 										this.spacetext + '</span>';

					aHTML[++h] = '<br /><span class="interfaceViewportControlSubContext" id="interfaceSetupUserExternal_usercontactname-' + this.id + '">' +
	 										this.usercontactpersontext + '</span>';

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
					aParam.step = 2;
					aParam.xhtmlElementID = event.target.id;
					interfaceSetupUserExternal(aParam);
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
					interfaceSetupUserExternal(aParam);
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
									'<td style="padding-bottom:10px;" class="interfaceMainRowNothing">You need to search by the surname<br />and enter at least 3 characters.</td></tr>';
	
			aHTML[++h] = '<tr><td class="interfaceMain">Access</td></tr>' +
							'<tr><td class="interfaceMainRadio">' +
							'<input type="radio" id="radioExternalAccessUnrestrictedY" name="radioExternalAccessUnrestricted" value="Y"/>Access&nbsp;to&nbsp;everything<br />' +
							'<input type="radio" id="radioExternalAccessUnrestrictedN" name="radioExternalAccessUnrestricted" value="N"/>Restricted by role' +
							'</td></tr>';
		
			aHTML[++h] = '<tr>' +
							'<td style="padding-top:10px;" id="interfaceMainExternalUserRoles"></td></tr>';

			aHTML[++h] = '</table>';					
			
			$('#tdInterfaceMainSetupUserExternalColumn2').html(aHTML.join(''));
			
			$('#inputInterfaceMainSetupUserExternalUsername').keyup(function()
			{
				if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
		        ns1blankspace.timer.delayCurrent = setTimeout("interfaceSetupUserExternalSearch('inputInterfaceMainSetupUserExternalUsername')", ns1blankspace.option.typingWait);
			});	
				
			$('#inputInterfaceMainSetupUserExternalUsername').live('blur', function() 
			{
				$(this).removeClass('interfaceMasterHighlight');
			});

			var aHTML = [];
			var h = -1;
		
			aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMain" style="font-size:0.875em">';
					
			if (aXHTMLElementID[1] && false)
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

			aHTML[++h] = '<tr class="interfaceMainAction">' +
								'<td style="padding-top:20px;" class="interfaceMainAction">' +
								'<span style="width:70px;" id="spanInterfaceMainSetupUserExternalEditRole">Add Role</span>' +
								'</td></tr>';					
			
			aHTML[++h] = '</table>';					
			
			$('#tdInterfaceMainSetupUserExternalColumn3').html(aHTML.join(''));

			$('#spanInterfaceMainSetupUserExternalEditSave').button(
			{
				text: "Save"
			})
			.click(function() 
			{
				interfaceMasterStatusWorking();

				var sData = 'id=' + interfaceMasterFormatSave(aXHTMLElementID[1]);
				sData += '&user=' + interfaceMasterFormatSave($('#inputInterfaceMainSetupUserExternalUsername').attr("data-id"));
				sData += '&type=2';
				sData += '&unrestrictedaccess=' + $('input[name="radioExternalAccessUnrestricted"]:checked').val();

				$.ajax(
				{
					type: 'POST',
					url: '/ondemand/setup/?method=SETUP_EXTERNAL_USER_ACCESS_MANAGE',
					data: sData,
					dataType: 'json',
					success: function() {
						aParam.step = 1;
						interfaceSetupUserExternal(aParam);
						interfaceMasterStatus('Saved');
					}
				});
			})
			
			$('#spanInterfaceMainSetupUserExternalEditCancel').button(
			{
				text: "Cancel"
			})
			.click(function() 
			{
				aParam.step = 1;
				interfaceSetupUserExternal(aParam);
			})

			$('#spanInterfaceMainSetupUserExternalEditRole').button(
			{
				text: "Add Role"
			})
			.click(function() 
			{
				interfaceMasterOptionsSetPosition('spanInterfaceMainSetupUserExternalEditRole', -42, -258);
				aParam.user = $('#tdSetupUserExternal_title-' + aXHTMLElementID[1]).attr("data-user");
				aParam.userType = 2;
				interfaceSetupUserAccessRoleAdd(aParam);
			})

			if (aXHTMLElementID[1])
			{
				$('#inputInterfaceMainSetupUserExternalUsername').attr("data-id", $('#tdSetupUserExternal_title-' + aXHTMLElementID[1]).attr("data-user"))
				$('#inputInterfaceMainSetupUserExternalUsername').val($('#tdSetupUserExternal_title-' + aXHTMLElementID[1]).attr("data-usertext"));
				$('[name="radioExternalAccessUnrestricted"][value="' + $('#tdSetupUserExternal_title-' + aXHTMLElementID[1]).attr("data-unrestrictedaccess") + '"]').attr('checked', true);

				aParam.user = $('#tdSetupUserExternal_title-' + aXHTMLElementID[1]).attr("data-user");
				aParam.step = 3;
				interfaceSetupUserExternal(aParam);
			}
			else
			{
				$('[name="radioExternalAccessUnrestricted"][value="N"]').attr('checked', true);
			}
		}
		else
		{

		}	
	}
	else if (iStep == 3)
	{	
		if (oResponse == undefined)
		{
			var oSearch = new AdvancedSearch();
			oSearch.method = 'SETUP_USER_ROLE_SEARCH';
			oSearch.addField('roletext,role');
			oSearch.addFilter('user', 'EQUAL_TO', iUser)
			oSearch.rows = 50;
			oSearch.sort('roletext', 'asc');
			oSearch.getResults(function(data) {interfaceSetupUserExternal(aParam, data)})
		}
		else
		{
			var aHTML = [];
			var h = -1;

			aHTML[++h] = '<table><tbody>';

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
		
			if (h != 0)
			{	
				aHTML[++h] = '</tbody></table>';
				
				$('#interfaceMainExternalUserRoles').html(aHTML.join(''));

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

	else if (iStep == 6)
	{	
		$.ajax(
			{
				type: 'POST',
				url: '/ondemand/setup/?method=SETUP_EXTERNAL_USER_ACCESS_MANAGE&remove=1',
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
				url: '/ondemand/network/?method=NETWORK_USER_SEARCH&rows=10&scope=2&surname=' + interfaceMasterFormatSave(sSearchText),
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
					'<td id="tdInterfaceMasterNetworkUser-' + this.user + '" data-usertext="' + this.usertext + '" class="interfaceSearch interfaceMasterNetworkUser">' +
					this.firstname + ' ' + this.surname + ' (' + this.contactbusinesstext + ')' +
					'</td></tr>');
		});			
						
		aHTML.push('</table>');
		
		$('#divInterfaceMasterViewportControlOptions').html(aHTML.join(''));

		$('#divInterfaceMasterViewportControlOptions').show(ns1blankspace.option.showSpeedOptions);
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

function interfaceSetupUserNew(aParam)
{
	ns1blankspace.objectContextData = undefined
	ns1blankspace.objectContext = -1;
	interfaceSetupUserViewport();
	$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
	interfaceMasterMainViewportShow("#divInterfaceMainDetails");
	interfaceSetupUserDetails();
}