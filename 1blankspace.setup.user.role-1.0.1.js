/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 
function interfaceSetupUserRoleMasterViewport()
{
	ns1blankspace.objectName = 'User Roles';
	ns1blankspace.objectContext = -1;
	ns1blankspace.object = -1;
	ns1blankspace.objectContextData = undefined;
	
	interfaceMasterReset();		
			
	$('#divInterfaceMasterViewportControlSet').button(
	{
		label: "User Roles"
	});
	
	$('#inputInterfaceMasterViewportControlSearch').keyup(function(event)
	{
		if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
        ns1blankspace.timer.delayCurrent = setTimeout("interfaceSetupUserRoleSearch('inputInterfaceMasterViewportControlSearch')", ns1blankspace.option.typingWait);
	});
	
	$('#spanInterfaceMasterViewportControlSearch').click(function(event)
	{
		interfaceSetupUserRoleSearch('inputInterfaceMasterViewportControlSearch');
	});
	
	$('#spanInterfaceMasterViewportControlSearchOptions').click(function(event)
	{
		interfaceSetupUserRoleSearchOptions();
	});
	
	$('#spanInterfaceMasterViewportControlNew').click(function(event)
	{
		interfaceSetupUserRoleNew();
	})
	
	$('#spanInterfaceMasterViewportControlNewOptions').click(function(event)
	{
		interfaceSetupUserRoleNewOptions();
	});
	
	$('#spanInterfaceMasterViewportControlAction').click(function(event)
	{
		interfaceSetupUserRoleSave();
	});
	
	$('#spanInterfaceMasterViewportControlActionOptions').click(function(event)
	{
		interfaceSetupUserRoleSaveOptions();
	});
	
	$('#spanInterfaceMasterViewportControlSetup').click(function(event)
	{
		interfaceSetupUserRoleSetup();
	});
	
	$('#spanInterfaceMasterViewportControlSetupOptions').click(function(event)
	{
		interfaceSetupUserRoleSetupOptions();
	});
	
	$('#spanInterfaceMasterViewportControlHelp').click(function(event)
	{
		interfaceSetupUserRoleHelp();
	});
	
	$('#spanInterfaceMasterViewportControlHelpOptions').click(function(event)
	{
		interfaceSetupUserRoleHelpOptions();
	});

	$('td.interfaceViewportMasterControlBrowse').click(function(event)
	{
		interfaceSetupUserRoleSearch(event.target.id, ns1blankspace.data.searchSource.browse);
	});
	
	$('td.interfaceViewportMasterControlBrowseAll').click(function(event)
	{
		interfaceSetupUserRoleSearch(event.target.id, ns1blankspace.data.searchSource.browse);
	});
	
	if (ns1blankspace.option.setFocus) {$('#inputInterfaceMasterViewportControlSearch').focus()};
	
	interfaceSetupUserRoleHomeShow();
	
}

function interfaceSetupUserRoleHomeShow(oResponse)
{
	if (oResponse == undefined)
	{
		var aHTML = [];
		var h = -1;
					
		aHTML[++h] = '<table id="tableInterfaceViewportMain" class="interfaceViewportMain">';
		aHTML[++h] = '<tr id="trInterfaceViewportMain" class="interfaceViewportMain">' +
						'<td id="tdInterfaceSetupUserRoleHomeMostLikely" class="interfaceViewportMain">' +
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
		aHTML[++h] = '</table>';		
		
		$('#divInterfaceViewportControl').html(aHTML.join(''));
		
		$('#divInterfaceMasterViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
		
		var oSearch = new AdvancedSearch();
		oSearch.method = 'SETUP_ROLE_SEARCH';
		oSearch.addField('title');
		oSearch.rows = 50;
		oSearch.sort('title', 'asc');
		oSearch.getResults(interfaceSetupUserRoleHomeShow);
	}
	else
	{
		var aHTML = [];
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML.push('<table id="tableInterfaceMessagingConversationHomeMostLikely">');
			aHTML.push('<tr class="trInterfaceMessagingConversationHomeMostLikelyNothing">');
			aHTML.push('<td class="tdInterfaceMessagingConversationHomeMostLikelyNothing">Click New to create a user role.</td>');
			aHTML.push('</tr>');
			aHTML.push('</table>');
		}
		else
		{
			aHTML.push('<table id="tableInterfaceSetupUserRoleHomeMostLikely">');
			aHTML.push('<tr>');
			aHTML.push('<td class="interfaceMain">MOST LIKELY</td>');
			aHTML.push('</tr>');
			
			$.each(oResponse.data.rows, function()
			{	
				aHTML.push('<tr class="interfaceMainRow">');
				aHTML.push('<td id="interfaceSetupUserRoleHomeMostLikely_Title-' + this.id + 
										'" class="interfaceHomeMostLikely">' +
										this.title +
										'</td>');
				aHTML.push('</tr>');
			});
			
			aHTML.push('</tbody></table>');
			
		}
		
		$('#tdInterfaceSetupUserRoleHomeMostLikely').html(aHTML.join(''));
	
		$('td.interfaceHomeMostLikely').click(function(event)
		{
			interfaceSetupUserRoleSearch(event.target.id, {source: 1});
		});
		
		$('#aInterfaceSetupUserRoleHomeMostLikelyMore').click(function(event)
		{
			interfaceSetupUserRoleSearch('tdInterfaceViewportMasterControlBrowse-', {source: ns1blankspace.data.searchSource.browse});
		});
	}
}

function interfaceSetupUserRoleSearch(sXHTMLElementId, iSource, sSearchText, sSearchContext)
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
		oSearch.method = 'SETUP_ROLE_SEARCH';
		oSearch.addField('title,notes');
		oSearch.addFilter('id', 'EQUAL_TO', ns1blankspace.objectContext);
		oSearch.getResults(function(data) {interfaceSetupUserRoleShow(data)});
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
			oSearch.method = 'SETUP_ROLE_SEARCH';
			oSearch.addField('title');
			
			if (iSource == ns1blankspace.data.searchSource.browse)
			{
				oSearch.addFilter('title', 'STRING_STARTS_WITH', sSearchText);
			}
			else
			{	
				oSearch.addFilter('title', 'STRING_IS_LIKE', sSearchText);
			}	
			
			oSearch.getResults(interfaceSetupUserRoleSearchShow);
		}
	};	
}

function interfaceSetupUserRoleSearchShow(oResponse)
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
		$('#divInterfaceMasterViewportControlOptions').show(ns1blankspace.option.showSpeedOptions);
		interfaceMasterSearchStop();
		
		$('td.interfaceSearch').click(function(event)
		{
			$('#divInterfaceMasterViewportControlOptions').html('&nbsp;');
			$('#divInterfaceMasterViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions)
			interfaceSetupUserRoleSearch(event.target.id, 1);
		});
	}			
}

function interfaceSetupUserRoleViewport()
{
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceViewportControlContext" class="interfaceViewportControlContext"></div>';
	
	aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
		
	if (ns1blankspace.objectContext == -1)
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
			
	$('#divInterfaceMain').html(aHTML.join(''));
		
	$('#tdInterfaceViewportControlSummary').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainSummary");
		interfaceSetupUserRoleSummary();
	});
	
	$('#tdInterfaceViewportControlDetails').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainDetails");
		interfaceSetupUserRoleDetails();
	});	
	
	$('#tdInterfaceViewportControlAccess').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainAccess");
		interfaceSetupUserRoleMethodAccess();
	});	
}

function interfaceSetupUserRoleShow(oResponse)
{
	$('#divInterfaceMasterViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
	interfaceSetupUserRoleViewport();
	
	var aHTML = [];
	var h = -1;
	
	if (oResponse.data.rows.length == 0)
	{
		ns1blankspace.objectContextData = undefined;
		
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find user role.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
		
		ns1blankspace.objectContextData = oResponse.data.rows[0];
				
		$('#divInterfaceViewportControlContext').html(ns1blankspace.objectContextData.title);
		
		aHTML[++h] = '<table id="tableInterfaceMainSummary" class="interfaceMain">';
		aHTML[++h] = '<tr id="trInterfaceMainSummaryRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainSummaryColumn1" class="interfaceMainColumn1">' +
						'</td>' +
						'<td id="tdInterfaceMainSummaryColumn2" class="interfaceMainColumn2x">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMainSummary').html(aHTML.join(''));
		
		interfaceSetupUserRoleSummary();
	}	
}		
		
function interfaceSetupUserRoleSummary()
{
	var aHTML = [];
	var h = -1;
	
	if (ns1blankspace.objectContextData == undefined)
	{
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find user.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{	
		aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMainColumn1">';
						
		aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryNotes" class="interfaceMainSummaryValue">' +
						ns1blankspace.objectContextData.notes +
						'</td></tr>';
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn1').html(aHTML.join(''));
	}	
}

function interfaceSetupUserRoleDetails()
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
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsNotes" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsNotes" class="interfaceMain">' +
						'Notes' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsNotesValue" class="interfaceMainTextMulti">' +
						'<td id="tdInterfaceMainDetailsNotesValue" class="interfaceMainTextMulti">' +
						'<textarea rows="10" cols="35" id="inputInterfaceMainDetailsNotes" class="inputInterfaceMainTextMultiSmall"></textarea>' +
						'</td></tr>';

		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainDetailsColumn1').html(aHTML.join(''));
		
		if (ns1blankspace.objectContextData != undefined)
		{
			$('#inputInterfaceMainDetailsTitle').val(ns1blankspace.objectContextData.title);
			$('#inputInterfaceMainDetailsNotes').val(ns1blankspace.objectContextData.notes);
		}
	}	
}

function interfaceSetupUserRoleSave()
{
	var sParam = 'method=SETUP_ROLE_MANAGE';
	var sData = '_=1';
	
	if (ns1blankspace.objectContext != -1)
	{
		sParam += '&id=' + ns1blankspace.objectContext	
	}	
	
	if ($('#divInterfaceMainDetails').html() != '')
	{
		sData += '&title=' + encodeURIComponent($('#inputInterfaceMainDetailsTitle').val());
		sData += '&notes=' + encodeURIComponent($('#inputInterfaceMainDetailsNotes').val());
	};

	$.ajax(
	{
		type: 'POST',
		url: '/ondemand/setup/?' + sParam,
		data: sData,
		dataType: 'text',
		success: interfaceMasterStatus('Saved')
	});		
}


function interfaceSetupUserRoleMethodAccess(aParam, oResponse)
{
	var iStep = 1;
	var iEndpoint;
	var oMethods;

	if (aParam != undefined)
	{
		if (aParam.step != undefined) {iStep = aParam.step}
		if (aParam.endpoint != undefined) {iEndpoint = aParam.endpoint}
		if (aParam.methods != undefined) {oMethods = aParam.methods}
	}
		
	if (iStep == 1)
	{
		var aHTML = [];
		var h = -1;	
						
		aHTML[++h] = '<table id="tableInterfaceMainMethodAccess" class="interfaceMain">' +
					'<tr id="trInterfaceMainSetupMethodAccessRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainSetupMethodAccessColumnEndpoint" style="width:100px;padding-right:5px;font-size:0.875em;" class="interfaceMainColumn1">' +
						ns1blankspace.xhtml.loading + '</td>' +
					'<td id="tdInterfaceMainSetupMethodAccessColumnMethod" style="width:200px;padding-right:5px;font-size:0.875em;" class="interfaceMainColumn2">' +
					'</td>' +
					'<td id="tdInterfaceMainSetupMethodAccessColumnEdit" style="width:280px;padding-right:15px;font-size:0.875em;" class="interfaceMainColumn2">' +
					'</td>' +
					'<td id="tdInterfaceMainSetupMethodAccessColumnAction" class="interfaceMainColumn2">' +
					'</td>' +
					'</tr>' +
					'</table>';				
				
		$('#divInterfaceMainAccess').html(aHTML.join(''));

		if (oResponse == undefined)
		{
			var oSearch = new AdvancedSearch();
			oSearch.method = 'SETUP_ENDPOINT_SEARCH';
			oSearch.addField('title');
			oSearch.rows = 50;
			oSearch.sort('title', 'asc');
			oSearch.getResults(function(data) {interfaceSetupUserRoleMethodAccess(aParam, data)})	
		}
		else
		{
			var aHTML = [];
			var h = -1;	
			
			ns1blankspace.endpoints = oResponse.data.rows;
	
			aHTML[++h] = '<table cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>';

			$(oResponse.data.rows).each(function()
			{

				aHTML[++h] = '<tr class="interfaceMainRow">';
				
				aHTML[++h] = '<td id="interfaceUserRoleEndpoint_Title-' + this.id + '" class="interfaceMainRow interfaceMainRowSelect endpoint"' +
										' title="">' +
										(this.title).toUpperCase() + '</td>';
																		
				aHTML[++h] = '</tr>'

			});
		
			aHTML[++h] = '</tbody></table>';
				
			$('#tdInterfaceMainSetupMethodAccessColumnEndpoint').html(aHTML.join(''));

			$('td.endpoint').click(function(event)
			{
				var sXHTMLElementId = event.target.id;
				var aId = sXHTMLElementId.split('-');
				
				interfaceSetupUserRoleMethodAccess({endpoint: aId[1], step: 3});
			});
		}
	}	
	else if (iStep == 2)
	{
		if (oResponse == undefined)
		{
			var oSearch = new AdvancedSearch();
			oSearch.method = 'SETUP_METHOD_SEARCH';
			oSearch.addField('title,useavailable,addavailable,updateavailable,removeavailable');
			oSearch.addFilter('endpoint', 'EQUAL_TO', iEndpoint)
			oSearch.rows = 50;
			oSearch.sort('title', 'asc');
			oSearch.getResults(function(data) {interfaceSetupUserRoleMethodAccess(aParam, data)})	
		}
		else
		{
			$.extend(true, aParam, {step: 3, methods: oResponse.data.rows});
			interfaceSetupUserRoleMethodAccess(aParam);	
		}
	}

	else if (iStep == 3)
	{
		if (oResponse == undefined)
		{
			$('#tdInterfaceMainSetupMethodAccessColumnMethod').html(ns1blankspace.xhtml.loadingSmall);
			$('#tdInterfaceMainSetupMethodAccessColumnEdit').html("");

			var aHTML = [];
			var h = -1;	
			
			aHTML[++h] = '<table class="interfaceMainColumn2">';
			aHTML[++h] = '<tr><td id="tdInterfaceMainAccesstAdd" class="interfaceMainAction">' +
							'<span id="spanInterfaceMainAccessAdd">Add</span>' +
							'</td></tr>';
											
			aHTML[++h] = '</table>';					
			
			$('#tdInterfaceMainSetupMethodAccessColumnAction').html(aHTML.join(''));
		
			$('#spanInterfaceMainAccessAdd').button(
			{
				label: "Add"
			})
			.click(function()
			{
				$.extend(true, aParam, {step: 4, xhtmlElementID: ""});
				interfaceSetupUserRoleMethodAccess(aParam);
			})

			var aIDs = [];

			$(oMethods).each(function()
			{
				aIDs.push(this.id);	
			})

			var oSearch = new AdvancedSearch();
			oSearch.method = 'SETUP_METHOD_SEARCH';
			oSearch.addField('title,useavailable,addavailable,updateavailable,removeavailable');
			oSearch.addFilter('endpoint', 'EQUAL_TO', iEndpoint)
			oSearch.rows = 50;
			oSearch.sort('title', 'asc');
			oSearch.getResults(function(data) {interfaceSetupUserRoleMethodAccess(aParam, data)})	

			//var oSearch = new AdvancedSearch();
			//oSearch.method = 'SETUP_METHOD_ACCESS_SEARCH';
			//oSearch.addField('title,accessmethod,accessmethodtext,addavailable,removeavailable,updateavailable,useavailable');
			//oSearch.addFilter('accessmethod', 'IN_LIST', aIDs.join(','))
			//oSearch.rows = 50;
			//oSearch.sort('accessmethodtext', 'asc');
			//oSearch.getResults(function(data) {interfaceSetupUserRoleMethodAccess(aParam, data)})	
		}
		else
		{
			var aHTML = [];
			var h = -1;
	
			aHTML[++h] = '<table id="tableSetupFinancialFinancialAccount" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>';
			
			if (oResponse.data.rows.length == 0)
			{
				aHTML[++h] = '<tr class="interfaceMainCaption">' +
								'<td class="interfaceMainRowNothing">No methods.</td></tr>';
				aHTML[++h] = '</tbody></table>';
			}
			else
			{		

				$(oResponse.data.rows).each(function()
				{
					aHTML[++h] = '<tr class="interfaceMainRow">';

					aHTML[++h] = '<td id="interfaceUserRoleMethod_Title-' + this.id +
										'-' + this.addavailable +
										'-' + this.removeavailable +
										'-' + this.updateavailable +
										'-' + this.useavailable +
										'" class="interfaceMainRow interfaceMainRowSelect method"' +
										' title="">' +
											this.title + '</td>';
			
					aHTML[++h] = '</tr>'
				});
			
				aHTML[++h] = '</tbody></table>';
			}
		
			$('#tdInterfaceMainSetupMethodAccessColumnMethod').html(aHTML.join(''));

			$('td.method').click(function()
			{
				$.extend(true, aParam, {step: 4, xhtmlElementID: event.target.id});
				interfaceSetupUserRoleMethodAccess(aParam);
			})
		}
	}

	else if (iStep == 4)
	{
		var sXHTMLElementID;
		var aXHTMLElementID;

		if (aParam != undefined)
		{
			if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
		}
		
		if (sXHTMLElementID != undefined)
		{
			aXHTMLElementID = sXHTMLElementID.split('-');
		}	

		var oSearch = new AdvancedSearch();
		oSearch.method = 'SETUP_ROLE_METHOD_ACCESS_SEARCH';
		oSearch.addField('canadd,canremove,canupdate,canuse');
		oSearch.addFilter('role', 'EQUAL_TO', ns1blankspace.objectContext);
		//oSearch.addFilter('access', 'EQUAL_TO', aXHTMLElementID[1]);
		oSearch.addFilter('accessmethod', 'EQUAL_TO', aXHTMLElementID[1]);

		oSearch.getResults(function(data) {
				$.extend(true, aParam, {step: 5});
				interfaceSetupUserRoleMethodAccess(aParam, data)
				});
	}

	else if (iStep == 5)
	{
		var sID; 
		var sXHTMLElementID;
		var aXHTMLElementID;
		var aHTML = [];
		var h = -1;
		var bCan = false;

		if (aParam != undefined)
		{
			if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
		}
		
		if (sXHTMLElementID != undefined)
		{
			aXHTMLElementID = sXHTMLElementID.split('-');
		}	
	
		aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMain">';

		if (oResponse != undefined)
		{
			if (oResponse.data.rows.length > 0)
			{
				sID = oResponse.data.rows[0].id;
			}
			else
			{
				aHTML[++h] = '<tr class="interfaceMainCaption">' +
									'<td class="interfaceMainRowNothing">This role doesn\'t have access to this method.  Click Save to add it.</td></tr>';
			}
		}

		if (aXHTMLElementID[5] == 'Y')
		{
			bCan = true;			
			aHTML[++h] = '<tr id="trInterfaceMainUserRoleAccessCanUse" class="interfaceMain">' +
							'<td id="tdInterfaceMainUserRoleAccessCanUse" class="interfaceMain">' +
							'Search?' +
							'</td></tr>' +
							'<tr id="trInterfaceMainUserRoleAccessCanUse" class="interfaceMainText">' +
							'<td id="tdInterfaceMainUserRoleAccessCanUseValue" class="interfaceMainRadio">' +
							'<input type="radio" id="radioCanUseY" name="radioCanUse" value="Y"/>Yes' +
							'<br /><input type="radio" id="radioCanUseN" name="radioCanUse" value="N"/>No' +
						'</td></tr>';
		}

		if (aXHTMLElementID[2] == 'Y')
		{		
			bCan = true;	
			aHTML[++h] = '<tr id="trInterfaceMainUserRoleAccessCanAdd" class="interfaceMain">' +
							'<td id="tdInterfaceMainUserRoleAccessCanAdd" class="interfaceMain">' +
							'Add?' +
							'</td></tr>' +
							'<tr id="trInterfaceMainUserRoleAccessCanAdd" class="interfaceMainText">' +
							'<td id="tdInterfaceMainUserRoleAccessCanAddValue" class="interfaceMainRadio">' +
							'<input type="radio" id="radioCanAddY" name="radioCanAdd" value="Y"/>Yes' +
							'<br /><input type="radio" id="radioCanAddN" name="radioCanAdd" value="N"/>No' +
						'</td></tr>';
		}
			
		if (aXHTMLElementID[4] == 'Y')
		{	
			bCan = true;		
			aHTML[++h] = '<tr id="trInterfaceMainUserRoleAccessCanUpdate" class="interfaceMain">' +
							'<td id="tdInterfaceMainUserRoleAccessCanUpdate" class="interfaceMain">' +
							'Update?' +
							'</td></tr>' +
							'<tr id="trInterfaceMainUserRoleAccessCanUpdate" class="interfaceMainText">' +
							'<td id="tdInterfaceMainUserRoleAccessCanUpdateValue" class="interfaceMainRadio">' +
							'<input type="radio" id="radioCanUpdateY" name="radioCanUpdate" value="Y"/>Yes' +
							'<br /><input type="radio" id="radioCanUpdateN" name="radioCanUpdate" value="N"/>No' +
						'</td></tr>';
		}
			
		if (aXHTMLElementID[3] == 'Y')
		{		
			bCan = true;	
			aHTML[++h] = '<tr id="trInterfaceMainUserRoleAccessCanRemove" class="interfaceMain">' +
							'<td id="tdInterfaceMainUserRoleAccessCanRemove" class="interfaceMain">' +
							'Remove?' +
							'</td></tr>' +
							'<tr id="trInterfaceMainUserRoleAccessCanRemove" class="interfaceMainText">' +
							'<td id="tdInterfaceMainUserRoleAccessCanRemoveValue" class="interfaceMainRadio">' +
							'<input type="radio" id="radioCanRemoveY" name="radioCanRemove" value="Y"/>Yes' +
							'<br /><input type="radio" id="radioCanRemoveN" name="radioCanRemove" value="N"/>No' +
						'</td></tr>';
		}
					
		if (!bCan)
		{
			aHTML[++h] = '<tr class="interfaceMainCaption">' +
								'<td class="interfaceMainRowNothing">Can not set any access on this function.</td></tr>';

		}

		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSetupMethodAccessColumnEdit').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMain" style="font-size:0.875em">';
				
		aHTML[++h] = '<tr id="trInterfaceMainUserRoleAccessSave" class="interfaceMainAction">' +
						'<td id="tdInterfaceMainUserRoleAccessSave" class="interfaceMainAction">' +
						'<span style="width:70px;" id="spanInterfaceMainUserRoleAccessSave">Save</span>' +
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceMainBankAccountEditCancel" class="interfaceMainAction">' +
							'<td id="tdInterfaceMainUserRoleAccessCancel" class="interfaceMainAction">' +
							'<span style="width:70px;" id="spanInterfaceMainUserRoleAccessCancel">Cancel</span>' +
							'</td></tr>';
											
		aHTML[++h] = '</table>';					
			
		$('#tdInterfaceMainSetupMethodAccessColumnAction').html(aHTML.join(''));
		
		$('#spanInterfaceMainUserRoleAccessSave').button(
		{
			text: "Save"
		})
		.click(function() 
		{
			interfaceMasterStatusWorking();

			var sData = 'id=' + interfaceMasterFormatSave(sID);
			sData += '&role=' + interfaceMasterFormatSave(ns1blankspace.objectContext);
			//sData += '&access=' + interfaceMasterFormatSave(aXHTMLElementID[1]);
			sData += '&accessmethod=' + interfaceMasterFormatSave(aXHTMLElementID[1]);

			sData += '&canadd=' + (interfaceMasterFormatSave($('input[name="radioCanAdd"]:checked').val()) != '' ? interfaceMasterFormatSave($('input[name="radioCanAdd"]:checked').val()) : 'N');
			sData += '&canremove=' + (interfaceMasterFormatSave($('input[name="radioCanRemove"]:checked').val()) != '' ? interfaceMasterFormatSave($('input[name="radioCanRemove"]:checked').val()) : 'N');
			sData += '&canupdate=' + (interfaceMasterFormatSave($('input[name="radioCanUpdate"]:checked').val()) != '' ? interfaceMasterFormatSave($('input[name="radioCanUpdate"]:checked').val()) : 'N');
			sData += '&canuse=' + (interfaceMasterFormatSave($('input[name="radioCanUse"]:checked').val()) != '' ? interfaceMasterFormatSave($('input[name="radioCanUse"]:checked').val()) : 'N');

			$.ajax(
			{
				type: 'POST',
				url: '/ondemand/setup/?method=SETUP_ROLE_METHOD_ACCESS_MANAGE',
				data: sData,
				dataType: 'json',
				success: function(data) {
					if (data.status == "OK")
					{
						interfaceMasterStatus('Saved');
			
						//$.extend(true, aParam, {step: 2});
						//interfaceSetupFinancialAccount(aParam)
					}
					else
					{
						interfaceMasterError(data.error.errornotes);
					}
				}
			});
		});

		$('#spanInterfaceMainUserRoleAccessCancel').button(
		{
			text: "Cancel"
		})
		.click(function() 
		{
			$.extend(true, aParam, {step: 2});
			interfaceSetupUserRoleMethodAccess(aParam);
		});

		if (oResponse.data.rows.length != 0)
		{
			var oObjectContext = oResponse.data.rows[0];
			
			$('[name="radioCanAdd"][value="' + oObjectContext.canadd + '"]').attr('checked', true);
			$('[name="radioCanRemove"][value="' + oObjectContext.canremove + '"]').attr('checked', true);
			$('[name="radioCanUpdate"][value="' + oObjectContext.canupdate + '"]').attr('checked', true);
			$('[name="radioCanUse"][value="' + oObjectContext.canuse + '"]').attr('checked', true);
		}
		else
		{
			$('[name="radioCanAdd"][value="Y"]').attr('checked', true);
			$('[name="radioCanRemove"][value="Y"]').attr('checked', true);
			$('[name="radioCanUpdate"][value="Y"]').attr('checked', true);
			$('[name="radioCanUse"][value="Y"]').attr('checked', true);
		}
	}
}

function interfaceSetupUserRoleNew(aParam)
{
	ns1blankspace.objectContextData = undefined
	ns1blankspace.objectContext = -1;
	interfaceSetupUserRoleViewport();
	$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
	interfaceMasterMainViewportShow("#divInterfaceMainDetails");
	interfaceSetupUserRoleDetails();
}