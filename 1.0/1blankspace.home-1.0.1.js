/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */

ns1blankspace.xhtml.defaultElementID = 'tdInterfaceViewportControlActionToday';

$(function()
{
	//Direct entry points using #
	
	var sHash = window.location.hash;
	
	switch(sHash)
	{
	case '#home':
		ns1blankspaceHomeShow();
		break;
	
	case '#contacts.person':
		interfaceContactPersonMasterViewport();
		break;

	case '#contacts.business':
		interfaceContactBusinessMasterViewport();
		break;
		
	}
	
	if (ns1blankspace.user != -1 && ns1blankspace.user != undefined)
	{
		if (sHash != '')
		{
			var aHash = sHash.split('-');
		
			if (aHash[0] == '#viewport')
			{
				if (aHash.length > 1)
				{
					var sID = aHash[2]
					sID = aHash[1] + '-' + sID;
					eval('interface' + aHash[1] + 'MasterViewport({showHome: false});interface' + aHash[1] + 'Search("' + sID + '")');
				}
			}
		}
	}	
	
});

function interfaceHomeViewport()
{				
	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<table id="tableInterfaceHomeViewport">';
	
	aHTML[++h] = '<tr>' +
						'<td style="background-position: right center;" id="ns1blankspaceViewportAction" class="ns1blankspaceViewportImageLarge">' +
						'&nbsp;' + 
						'</td>' +
						'</tr>';
		
	aHTML[++h] = '<tr id="trInterfaceViewportControl1" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlActionToday" class="interfaceViewportControl interfaceViewportControlHome">Today</td>' +
					'</tr>';

	aHTML[++h] = '<tr id="trInterfaceViewportControl1" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlActionTomorrow" class="interfaceViewportControl interfaceViewportControlHome">Tomorrow</td>' +
					'</tr>';
	
	aHTML[++h] = '<tr>' +
					'<td>&nbsp;</td>' +
					'</tr>';
		
	aHTML[++h] = '<tr id="trInterfaceViewportControl1" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlActionFuture" class="interfaceViewportControl interfaceViewportControlHome">Future</td>' +
					'</tr>';
	
	aHTML[++h] = '<tr id="trInterfaceViewportControl1" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlActionOverdue" class="interfaceViewportControl interfaceViewportControlHome">Overdue</td>' +
					'</tr>';
		
	aHTML[++h] = '<tr id="trInterfaceViewportControlEnd" class="interfaceViewportControl">' +
					'<td>&nbsp;</td>' +
					'</tr>';
					
	aHTML[++h] = '</table>';					
			
	$('#divInterfaceViewportControl').html(aHTML.join(''));
	
	ns1blankspaceHomeViewportBind();
}

function ns1blankspaceHomeViewportBind()
{
	
	$('#tdInterfaceViewportControlActionToday').click(function(event)
	{
		$('#tdInterfaceMainHomeColumn1').html(ns1blankspace.xhtml.loading);
		ns1blankspace.xhtml.defaultElementID = this.id;
		
		ns1blankspaceHomeTodayActions({
			show: false,
			xhtmlElementId: 'tdInterfaceMainHomeColumn1',
			day: 0
			})
	});

	$('#tdInterfaceViewportControlActionTomorrow').click(function(event)
	{
		$('#tdInterfaceMainHomeColumn1').html(ns1blankspace.xhtml.loading);
		ns1blankspace.xhtml.defaultElementID = this.id;
		
		ns1blankspaceHomeTodayActions({
			show: false,
			xhtmlElementId: 'tdInterfaceMainHomeColumn1',
			day: 1
			})
	});
	
	$('#tdInterfaceViewportControlActionOverdue').click(function(event)
	{
		$('#tdInterfaceMainHomeColumn1').html(ns1blankspace.xhtml.loading);
		ns1blankspace.xhtml.defaultElementID = this.id;
		
		ns1blankspaceHomeTodayActions({
			show: false,
			xhtmlElementId: 'tdInterfaceMainHomeColumn1',
			overdue: true
			})
	});
	
	$('#tdInterfaceViewportControlActionFuture').click(function(event)
	{
		$('#tdInterfaceMainHomeColumn1').html(ns1blankspace.xhtml.loading);
		ns1blankspace.xhtml.defaultElementID = this.id;
		
		ns1blankspaceHomeTodayActions({
			show: false,
			xhtmlElementId: 'tdInterfaceMainHomeColumn1',
			future: true
			})
	});
	
}	

function interfaceHome()
{
	var aHTML = [];
	
	aHTML.push('<table id="tableInterfaceMainHome" class="interfaceMainHome">');
		
	aHTML.push('<tr id="trInterfaceMainHome1" class="interfaceMainHome">' + 
					'<td id="tdInterfaceMainHomeColumn1" class="interfaceMainHome" style="width:500px;"></td></tr>');
	
	aHTML.push('</table>');
	
	return aHTML.join('');
}

function interfaceHomeShow()
{
	if (ns1blankspace.xhtml.defaultElementID != '')
	{
		$('#' + ns1blankspace.xhtml.defaultElementID).addClass('interfaceViewportControlHighlight');
		$('#' + ns1blankspace.xhtml.defaultElementID).click();
	};
}

function interfaceHomeOptions()
{
	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<table id="tableinterfaceHomeOptions" class="interfaceHomeOptions">';
		
	if (gbRoleBase)
	{
		aHTML[++h] = '<tr id="trinterfaceHomeOptions" class="interfaceHomeOptions">' +
					'<td id="tdinterfaceHomeOptionsMyStartPage" class="interfaceHomeOptions">' +
					'<a href="/index.asp?Site=475&p=asms%2Fmystartpage.asp" target="_blank">My Start Page (Classic)</a>' +
					'</td>' +
					'</tr>';
					
		aHTML[++h] = '<tr id="trinterfaceHomeOptions" class="interfaceHomeOptions">' +
					'<td id="tdinterfaceHomeOptionsCalendar" class="interfaceHomeOptions">' +
					'Calendar<span id="spaninterfaceHomeOptionsCalendar"><span>' +
					'</td>' +
					'</tr>';
	};
	
	aHTML[++h] = '</table>'
	
	return aHTML.join('');	
}

function interfaceHomeOptionsBind()
{
	$('#tdinterfaceHomeOptionsCalendar').click(function(event)
	{
		interfaceActionMasterViewport({calendar: true});
	});
	
	interfaceHomeOptionsUpdate();
}

function interfaceHomeOptionsUpdate()
{
	
}

function interfaceHomeOptionsNewOpportunities(sXHTMLElementId, oResponse)
{
	var bShow = false;

	if (sXHTMLElementId == undefined) 
	{
		sXHTMLElementId = 'divns1blankspaceViewportControlOptions';
	}
	
	if (sXHTMLElementId == 'divns1blankspaceViewportControlOptions') 
	{
		bShow = true;
	}	

	var aHTML = [];
	var h = -1;
	
	if (oResponse == undefined)
	{
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/opportunity/?method=OPPORTUNITY_SEARCH',
			dataType: 'json',
			success: function(data) {interfaceHomeOptionsNewOpportunities(sXHTMLElementId, data)}
		});
	}
	else
	{
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableHomeOption" class="interfaceHomeOptions">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">' +
							'<td class="interfaceMainRowNothing">No new opportunities.</td></tr>';
			aHTML[++h] = '</tbody></table>';

			$('#' + sXHTMLElementId).html(aHTML.join(''));
			if (bShow) {$('#' + sXHTMLElementId).show(ns1blankspace.option.showSpeedOptions)}
		}
		else
		{
			if (bShow)
			{
				aHTML[++h] = '<table id="tableHomeOption" class="interfaceHomeOptionsHeaderLarge">';
				aHTML[++h] = '<tbody>'
				aHTML[++h] = '<tr class="interfaceHomeOptionContext">';
				aHTML[++h] = '<td class="interfaceHomeOptionContext">New Opportunities</td>';
				aHTML[++h] = '<td id="tdInterfaceHomeOptionClose" class="interfaceHomeOptionClose">Close</td>';
				aHTML[++h] = '</tr>';
				aHTML[++h] = '</tbody></table>';
				
				aHTML[++h] = '<table id="tableHomeOption" class="interfaceHomeOptionsLarge">';
			}
			else
			{
				aHTML[++h] = '<table id="tableHomeOption">';
			}	
			
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceHomeOptionCaption">';
			aHTML[++h] = '<td class="interfaceHomeOptionCaption">Business</td>';
			aHTML[++h] = '<td class="interfaceHomeOptionCaption">Person</td>';
			aHTML[++h] = '<td class="interfaceHomeOptionCaption">Date Received</td>';
			aHTML[++h] = '<td class="interfaceHomeOptionCaption">Description</td>';
			aHTML[++h] = '<td class="interfaceHomeOptionCaptionOptions">&nbsp;</td>';
			aHTML[++h] = '</tr>';

			$.each(oResponse.data.rows, function()
			{	
				aHTML[++h] = '<tr class="interfaceMainRow">';
				
				aHTML[++h] = '<td id="tdHomeOption-contactbusiness-' + this.id + '" class="interfaceHomeOptionRow">' +
										this.contactbusinesstext + '</td>';
										
				aHTML[++h] = '<td id="tdHomeOption-contactperson-' + this.id + '" class="interfaceHomeOptionRow">' +
										this.contactpersontext + '</td>';						
				
				aHTML[++h] = '<td id="tdHomeOption-date-' + this.id + '" class="interfaceHomeOptionRow">' +
										this.date + '</td>';						
				
				aHTML[++h] = '<td id="tdHomeOption-description-' + this.id + '" class="interfaceHomeOptionRow">' +
										this.description + '</td>';						
				
				aHTML[++h] = '<td id="tdHomeOption-' + this.id + '" class="interfaceHomeOptionRowOptions">&nbsp;</td>';
				
				aHTML[++h] = '</tr>'
			});
			
			aHTML[++h] = '</tbody></table>';

			$('#' + sXHTMLElementId).html(aHTML.join(''));
			if (bShow) {$('#' + sXHTMLElementId).show(ns1blankspace.option.showSpeedOptions)}
	
			$('.interfaceHomeOptionRowOptions').button( {
				text: false,
				icons: {
					primary: "ui-icon-play"
				}
			})
			.click(function() {
				$('#divns1blankspaceViewportControlOptions').attr('data-initiator', '')
				interfaceEnquiryMasterViewport();
				interfaceEnquirySearch(this.id)
			})
			.css('width', '15px')
			.css('height', '16px')
		}
	}
}

function ns1blankspaceHomeTodayActions(oParam, oResponse)
{

	var bShow = false;
	var sXHTMLElementId = 'tdInterfaceMainToday';
	var iDay = 0;
	var sLabel = 'Actions';
	var bOverdue = false;
	var bFuture = false;
	
	if (oParam != undefined)
	{
		if (oParam.show != undefined) {bShow = oParam.show}
		if (oParam.overdue != undefined) {bOverdue = oParam.overdue}
		if (oParam.future != undefined) {bFuture = oParam.future}
		if (oParam.xhtmlElementId != undefined) {sXHTMLElementId = oParam.xhtmlElementId}
		if (oParam.day != undefined) {iDay = oParam.day}
		if (oParam.label != undefined) {sLabel = oParam.label}
	}

	var aHTML = [];
	var h = -1;
	
	if (oResponse == undefined)
	{
		var sParam = 'method=ACTION_SEARCH&diary=1';
		
		var sData = 'actionby=' + gsUserID;
		sData += '&rows=10';
		
		if (bOverdue)
		{
			sData += '&past=1&status=2-4';
		}
		else if (bFuture)
		{
			sData += '&future=1&status=2-4';
		}
		else
		{
			sData += '&day=' + iDay;
		}	
		
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/action/?' + sParam,
			data: sData,
			dataType: 'json',
			success: function(data) {ns1blankspaceHomeTodayActions(oParam, data)}
		});
	}
	else
	{
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableHomeTodayActions" class="ns1blankspaceHomeTodayActions">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">' +
							'<td class="interfaceMainRowNothing">No ' + sLabel + '</td></tr>';
			aHTML[++h] = '</tbody></table>';

			$('#' + sXHTMLElementId).html(aHTML.join(''));
			if (bShow) {$('#' + sXHTMLElementId).show(ns1blankspace.option.showSpeedOptions)}	
		}
		else
		{
			if (bShow)
			{
				aHTML[++h] = '<table id="tableHomeToday" class="ns1blankspaceHomeOptionsHeaderLarge">';
				aHTML[++h] = '<tbody>'
				aHTML[++h] = '<tr class="interfaceHomeTodayActions">';
				aHTML[++h] = '<td class="interfaceHomeTodayActions">' + sLabel + '</td>';
				aHTML[++h] = '<td id="tdInterfaceHomeTodayActions" class="interfaceHomeOptionClose">Close</td>';
				aHTML[++h] = '</tr>';
				aHTML[++h] = '</tbody></table>';
				
				aHTML[++h] = '<table id="tableHomeOption" class="ns1blankspaceHomeOptionsHeaderLarge">';
			}
			else
			{
				aHTML[++h] = '<table id="tableHomeTodayActions' + iDay + '">';
			}	
			
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">';
			aHTML[++h] = '<td class="interfaceMainCaption">Subject</td>';
			
			var fFunctionSearch = ns1blankspaceHomeTodayActionsRowStandard
			
			if (bOverdue || bFuture)
			{
				aHTML[++h] = '<td class="interfaceMainCaption">Date</td>';
				var fFunctionSearch = ns1blankspaceHomeTodayActionsRowShowDate
			}
			
			aHTML[++h] = '<td class="interfaceMainCaption">Time</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">Contact</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">&nbsp;</td>';
			aHTML[++h] = '</tr>';

			$.each(oResponse.data.rows, function()
			{
				aHTML[++h] = fFunctionSearch(this);
			});
			
			aHTML[++h] = '</tbody></table>';

			if (bShow) {$('#' + sXHTMLElementId).show(ns1blankspace.option.showSpeedOptions)}	
			
			ns1blankspacePaginationList(
			{
				xhtmlElementID: sXHTMLElementId,
				xhtmlContext: 'HomeTodayAction',
				xhtml: aHTML.join(''),
				showMore: (oResponse.morerows == 'true'),
				more: oResponse.moreid,
				rows: 10,
				functionShowRow: fFunctionSearch,
				functionNewPage: 'ns1blankspaceHomeTodayActionsBind()',
				type: 'json'
			}); 	
			
			ns1blankspaceHomeTodayActionsBind();
		}
	}
}

function ns1blankspaceHomeTodayActionsRowShowDate(oRow)
{
	return ns1blankspaceHomeTodayActionsRow(oRow, true)
}

function ns1blankspaceHomeTodayActionsRowStandard(oRow)
{
	return ns1blankspaceHomeTodayActionsRow(oRow, false)
}

function ns1blankspaceHomeTodayActionsRow(oRow, bShowDate)
{
	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<tr class="interfaceMainRow">';
				
	aHTML[++h] = '<td id="tdHomeTodayActions_subject-' + oRow.id + '" class="interfaceMainRow">' +
							oRow.subject + '</td>';
		
	if (bShowDate)
	{
		var sDate = new Date(oRow.actiondatetime);
		sDate = $.fullCalendar.formatDate(sDate, 'dd MMM yyyy');
		aHTML[++h] = '<td id="tdHomeTodayActions_date-' + oRow.id + '" class="interfaceMainRow">' +
							sDate + '</td>';
	}
	
	var sDate = new Date(oRow.actiondatetime);
	
	if ($.fullCalendar.formatDate(sDate, 'H') != '0' || $.fullCalendar.formatDate(sDate, 'm') != '0')
	{
		sDate = $.fullCalendar.formatDate(sDate, 'h:mm TT')
	}
	else
	{
		sDate = '&nbsp;';
	}	
							
	aHTML[++h] = '<td id="tdHomeTodayActions_time-' + oRow.id + '" class="interfaceMainRow">' +
							sDate + '</td>';
							
	aHTML[++h] = '<td id="tdHomeTodayActions_contact-' + oRow.contactperson + '" class="interfaceMainRow interfaceContact">' +
							oRow.contactpersonfirstname + ' ' + 
							oRow.contactpersonsurname + '</td>';
	
	aHTML[++h] = '<td id="tdHomeTodayActions-' + oRow.id + '" class="interfaceMainRow" style="width:65px;">';
	
	aHTML[++h] = '<span id="spanHomeTodayActions_cancel-' + oRow.id + '" class="interfaceMainRowOptionsCancel"></span>';
	aHTML[++h] = '<span id="spanHomeTodayActions_complete-' + oRow.id + '" class="interfaceMainRowOptionsComplete"></span>';
	aHTML[++h] = '<span id="spanHomeTodayActions-' + oRow.id + '" class="interfaceMainRowOptionsSelect"></span>';
	
	aHTML[++h] = '</td></tr>';
	
	return aHTML.join('');
}	
	
function ns1blankspaceHomeTodayActionsBind()	
{

	$('.interfaceContact').click(function() {
		interfaceContactPersonMasterViewport();
		interfaceContactPersonSearch(this.id)
	})

	$('.interfaceMainRowOptionsSelect').button( {
		text: false,
		icons: {
			primary: "ui-icon-play"
		}
	})
	.click(function() {
		interfaceActionMasterViewport();
		interfaceActionSearch(this.id)
	})
	.css('width', '15px')
	.css('height', '18px')

	$('.interfaceMainRowOptionsCancel').button({
		text: false,
		label: "Cancel",
		icons: {
			 primary: "ui-icon-close"
		}
	})
	.click(function() {
		ns1blankspaceHomeTodayActionsStatus(this.id, 3)
	})
	.css('width', '15px')
	.css('height', '18px')
		
		
	$('.interfaceMainRowOptionsComplete').button({
		text: false,
		label: "Complete",
		icons: {
			 primary: "ui-icon-check"
		}
	})
	.click(function() {
		ns1blankspaceHomeTodayActionsStatus(this.id, 1)
	})
	.css('width', '15px')
	.css('height', '18px')
}
		
		
function ns1blankspaceHomeTodayActionsStatus(sXHTMLElementID, iStatus)
{
	var sParam = '/ondemand/action/?rf=JSON&method=ACTION_MANAGE';
	var sData = '';
	
	if (iStatus == undefined) {iStatus = 1}
	
	if (sXHTMLElementID != undefined)
	{
		aXHTMLElementID = sXHTMLElementID.split('-');
		
		if (aXHTMLElementID[1] != undefined)
		{
			sData += 'id=' + aXHTMLElementID[1];
			sData += '&status=' + ns1blankspace.util.fs(iStatus);
			
			$.ajax(
			{
				type: 'POST',
				url: sParam,
				data: sData,
				dataType: 'json',
				success: function(data){$('#' + sXHTMLElementID).parent().parent().fadeOut(500)}
			});
		}
	}	
}				

function interfaceHomeLogonShow()
{
	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<table id="tableInterfaceHomeLogon" class="ns1blankspaceLogon" style="width:600px;">';
	
	aHTML[++h] = '<tr id="trInterfaceHomeLogonNotes" class="ns1blankspaceLogon" >' +
					'<td id="tdInterfaceHomeLogon" class="ns1blankspaceLogon" style="width:150px;padding-right:15px;border-right-style:solid;border-width: 1px;border-color: #B8B8B8;">' +
					ns1blankspace.xhtml.loading + 
					'</td>';
					
	aHTML[++h] = '<td id="tdns1blankspaceLogonNotes" class="ns1blankspaceLogon"  style="width:150px;padding-left:15px;">';
	
	aHTML[++h] = '<table id="tableInterfaceMainHomeNotes" class="interfaceMainHome">' +
						'<tr id="trInterfaceMainHomeNotes" class="interfaceMainHome">' +						
						'<td id="tdInterfaceMainHomeNotes" class="interfaceMainHome" style="color:#404040;">' +
						'1blankspace.com is an example app based on the mydigitalstructure.com platform.' +
						'<br /><br /><a href="https://github/ibcom/1blankspace" target="_blank">github Repository</a>' +
						'<br /><br /><a href="http://mydigitalstructure.com/examples" target="_blank">More code examples</a>' +
						'<br /><br /><a href="http://mydigitalstructure.com/documentation" target="_blank">Documentation</a>' +
						'<br /><br /><a href="http://mydigitalstructure.com/gettingstarted" target="_blank">Getting started</a>' +
						'<br /><br /><a href="http://twitter.com/ibComMYDS" target="_blank">twitter.com/ibComMYDS</a>' +
						'<br /><br /><hr />' +
						'<br /><a href="https://developer.1blankspace.com" target="_blank"><strong>Modify this app or create your own app using the simple jQuery IDE.</strong></a>' +
						'</td>' +
						'</tr>' +
					'</table>';
					
	aHTML[++h] = '</td></tr></table>';				
	
	$('#divInterfaceBox').css("z-index", "1");
	$('#divInterfaceBox').css("width", "600px");
	$('#divInterfaceBox').html(aHTML.join(''));
	
	ns1blankspaceLogonShow({xhtmlElementID: 'tdInterfaceHomeLogon'})
}