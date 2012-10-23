var gsHomeDefaultElementId = 'tdInterfaceViewportControlActionToday';

$(function()
{
	//Direct entry points using #
	
	var sHash = window.location.hash;
	
	switch(sHash)
	{
	case '#home':
		interfaceMasterHomeShow();
		break;
	
	case '#contacts':	
	case '#contacts.person':
		interfaceContactPersonMasterViewport();
		break;

	case '#contacts.business':
		interfaceContactBusinessMasterViewport();
		break;
		
	}
	
	if (giUserID != -1 && giUserID != undefined)
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

function interfaceHomeViewport2()
{

	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<table id="tableInterfaceHomeViewport" class="interfaceHomeViewport">';
	
	aHTML[++h] = '<tr id="trInterfaceHomeViewport" class="interfaceHomeViewport">' +
					'<td id="tdInterfaceViewportControlIntroduction" class="interfaceHomeViewport">' +
					'Welcome<br />' + gsUserName +
					'</td>' +
					'</tr>';
					
	aHTML[++h] = '</table>'
	
	return aHTML.join('');
}


function interfaceHomeViewport()
{
				
	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<table id="tableInterfaceHomeViewport">';
	
	aHTML[++h] = '<tr>' +
						'<td style="background-position: right center;" id="interfaceMasterViewportAction" class="interfaceMasterViewportImageLarge">' +
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
	
	interfaceMasterHomeViewportBind();
}

function interfaceMasterHomeViewportBind()
{
	
	$('#tdInterfaceViewportControlActionToday').click(function(event)
	{
		$('#tdInterfaceMainHomeColumn1').html(gsLoadingXHTML);
		gsHomeDefaultElementId = this.id;
		
		interfaceMasterHomeTodayActions({
			show: false,
			xhtmlElementId: 'tdInterfaceMainHomeColumn1',
			day: 0
			})
	});

	$('#tdInterfaceViewportControlActionTomorrow').click(function(event)
	{
		$('#tdInterfaceMainHomeColumn1').html(gsLoadingXHTML);
		gsHomeDefaultElementId = this.id;
		
		interfaceMasterHomeTodayActions({
			show: false,
			xhtmlElementId: 'tdInterfaceMainHomeColumn1',
			day: 1
			})
	});
	
	$('#tdInterfaceViewportControlActionOverdue').click(function(event)
	{
		$('#tdInterfaceMainHomeColumn1').html(gsLoadingXHTML);
		gsHomeDefaultElementId = this.id;
		
		interfaceMasterHomeTodayActions({
			show: false,
			xhtmlElementId: 'tdInterfaceMainHomeColumn1',
			overdue: true
			})
	});
	
	$('#tdInterfaceViewportControlActionFuture').click(function(event)
	{
		$('#tdInterfaceMainHomeColumn1').html(gsLoadingXHTML);
		gsHomeDefaultElementId = this.id;
		
		interfaceMasterHomeTodayActions({
			show: false,
			xhtmlElementId: 'tdInterfaceMainHomeColumn1',
			future: true
			})
	});
	
}	

function interfaceHome()
{

	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<table id="tableInterfaceMainHome" class="interfaceMainHome">';
		
	aHTML[++h] = '<tr id="trInterfaceMainHome1" class="interfaceMainHome">';

	aHTML[++h] = '<td id="tdInterfaceMainHomeColumn1" class="interfaceMainHome" style="width:500px;">';
	
	aHTML[++h] = '</td>';	
	
	if (false)
	{
		aHTML[++h] = '<td id="tdInterfaceMainHomeColumn2" class="interfaceMainHome">';
		aHTML[++h] = '<table id="tableInterfaceMainHomeColumn2" class="interfaceMainHome">';
		aHTML[++h] = '<tr id="trInterfaceMainHomeColumn2Row2" class="interfaceMainHome">' +						
							'<td id="tdInterfaceMainHomeLatestNews" class="interfaceMainHome">' +
							gsLoadingSmallXHTML +
							'</td>' +
							'</tr>';
		aHTML[++h] = '</table>'
		aHTML[++h] = '</td>'	
	}
	
	aHTML[++h] = '</tr>'	
	aHTML[++h] = '</table>'
	
	return aHTML.join('');
}

function interfaceHomeShow()
{

	if (false)
	{

		sParam = 'method=NEWS_SEARCH&rf=XML&rows=5';

		$.ajax(
		{
			type: 'GET',
			url: '/directory/ondemand/object.asp?' + sParam,
			dataType: 'xml',
			success: interfaceHomeShowLatestNews
		});
	}
	
	if (gsHomeDefaultElementId != '')
	{
		$('#' + gsHomeDefaultElementId).addClass('interfaceViewportControlHighlight');
		$('#' + gsHomeDefaultElementId).click();
	}

}

function interfaceHomeShowLatestNews(oXML)
{

	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<table id="tableHomeOption">';
			
	aHTML[++h] = '<tbody>'
	aHTML[++h] = '<tr class="interfaceHomeOptionCaption">';
	aHTML[++h] = '<td class="interfaceMain">LATEST NEWS</td>';
	aHTML[++h] = '</tr>';

	var oRoot = oXML.getElementsByTagName("ondemand").item(0);
	
	for (var iRow = 0; iRow < oRoot.childNodes.length; iRow++) 
	{
		var oRow = oRoot.childNodes.item(iRow);
		
		aHTML[++h] = '<tr class="interfaceMainRow">';
		
		aHTML[++h] = '<td id="tdNews_Subject-' + onDemandXMLGetData(oRow, "id") + '">' +
								onDemandXMLGetData(oRow, "subject") + '</td>';
		
		aHTML[++h] = '</tr>'
	}
	
		aHTML[++h] = '</tbody></table>';

	$('#tdInterfaceMainHomeLatestNews').html(aHTML.join(''));
	
		

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
					
		/* aHTML[++h] = '<tr id="trinterfaceHomeOptionsNewOpportunities" class="interfaceHomeOptions">' +
					'<td id="tdinterfaceHomeOptionsNewOpportunities" class="interfaceHomeOptions">' +
					'New Opportunities<span id="spaninterfaceHomeOptionsNewOpportunities" class="interfaceHomeOptions"><span>' +
					'</td>' +
					'</tr>';		 */	
	}
	
	aHTML[++h] = '</table>'
	
	return aHTML.join('');
		
}

function interfaceHomeOptionsBind()
{

	$('#tdinterfaceHomeOptionsCalendar').click(function(event)
	{
		interfaceActionMasterViewport({calendar: true});
	});
	
	$('#tdinterfaceHomeOptionsNewOpportunities').click(function(event)
	{
		$(this).html(gsLoadingSmallXHTML);
		interfaceHomeOptionsNewOpportunities();
	});
	
	//interfaceHomeOptionsUpdate();
}

function interfaceHomeActions(sXHTMLElementId)
{
	if (sXHTMLElementId == 'h3interfaceHomeActionsNewOpportunities')
	{
		interfaceHomeOptionsNewOpportunities($('#' + sXHTMLElementId).next('div').attr('id'))
	}
}

function interfaceHomeOptionsUpdate()
{

	if (gbRoleBase)
	{
		$('#spaninterfaceHomeOptionsNewClientEnquiries').html(gsLoadingSmallXHTML);
		
		var sParam = 'method=DASHBOARD_OPPORTUNITY_SUMMARY';
			
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/dashboard/dashboard.asp?rf=XML&' + sParam,
			dataType: 'xml',
			success: function (oXML)
						{
							var oRoot = oXML.getElementsByTagName("ondemand").item(0);
							if (oRoot.childNodes.length != 0)
							{
								var oRow = oRoot.childNodes.item(0);
								$('#spaninterfaceHomeOptionsNewOpportunities').html('(' + onDemandXMLGetData(oRow, "newcount") + ')');
							}
						}
		});
	}
	
}

function interfaceHomeOptionsNewOpportunities(sXHTMLElementId, oXML)
{
	var bShow = false;

	if (sXHTMLElementId == undefined) 
	{
		sXHTMLElementId = 'divInterfaceMasterViewportControlOptions';
	}
	
	if (sXHTMLElementId == 'divInterfaceMasterViewportControlOptions') 
	{
		bShow = true;
	}	

	var aHTML = [];
	var h = -1;
	
	if (oXML == undefined)
	{
		var sParam = 'method=OPPORTUNITY_SEARCH';
		
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/opportunity/?rf=XML&' + sParam,
			dataType: 'xml',
			success: function(data) {interfaceHomeOptionsNewOpportunities(sXHTMLElementId, data)}
		});
	}
	else
	{
		oRoot = oXML.getElementsByTagName("ondemand").item(0);
	
		if (oRoot.childNodes.length == 0)
		{
			aHTML[++h] = '<table id="tableHomeOption" class="interfaceHomeOptions">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">' +
							'<td class="interfaceMainRowNothing">No new opportunities.</td></tr>';
			aHTML[++h] = '</tbody></table>';

			$('#' + sXHTMLElementId).html(aHTML.join(''));
			if (bShow) {$('#' + sXHTMLElementId).show(giShowSpeedOptions)}
		
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

			for (var iRow = 0; iRow < oRoot.childNodes.length; iRow++) 
			{
				var oRow = oRoot.childNodes.item(iRow);
				
				aHTML[++h] = '<tr class="interfaceMainRow">';
				
				aHTML[++h] = '<td id="tdHomeOption-contactbusiness-' + onDemandXMLGetData(oRow, "id") + '" class="interfaceHomeOptionRow">' +
										onDemandXMLGetData(oRow, "contactbusinesstext") + '</td>';
										
				aHTML[++h] = '<td id="tdHomeOption-contactperson-' + onDemandXMLGetData(oRow, "id") + '" class="interfaceHomeOptionRow">' +
										onDemandXMLGetData(oRow, "contactpersontext") + '</td>';						
				
				aHTML[++h] = '<td id="tdHomeOption-date-' + onDemandXMLGetData(oRow, "id") + '" class="interfaceHomeOptionRow">' +
										onDemandXMLGetData(oRow, "date") + '</td>';						
				
				aHTML[++h] = '<td id="tdHomeOption-description-' + onDemandXMLGetData(oRow, "id") + '" class="interfaceHomeOptionRow">' +
										onDemandXMLGetData(oRow, "description") + '</td>';						
				
				aHTML[++h] = '<td id="tdHomeOption-' + onDemandXMLGetData(oRow, "id") + '" class="interfaceHomeOptionRowOptions">&nbsp;</td>';
				
				aHTML[++h] = '</tr>'
			}
			
			aHTML[++h] = '</tbody></table>';

			$('#' + sXHTMLElementId).html(aHTML.join(''));
			if (bShow) {$('#' + sXHTMLElementId).show(giShowSpeedOptions)}
	
			$('.interfaceHomeOptionRowOptions').button( {
				text: false,
				icons: {
					primary: "ui-icon-play"
				}
			})
			.click(function() {
				$('#divInterfaceMasterViewportControlOptions').attr('onDemandSource', '')
				interfaceEnquiryMasterViewport();
				interfaceEnquirySearch(this.id)
			})
			.css('width', '15px')
			.css('height', '16px')
		}
	}
}

function interfaceHomeCalendarGetActions()
{
	var sParam;
	var sReturn;
	var sParam;
	var oRoot;
	var oXML;
	var oRow;
			
	var iActionId = 0;
	var sHTML = '';
	sParam = 'method=ACTION_SEARCH&contactperson=ALL&actionby=' + gsUserID + '&month=' + curr_month + '&rf=XML';
	
	$.ajax({
		type: 'GET',
		url: '/directory/ondemand/object.asp?' + sParam,
		dataType: 'xml',
		async: false,
		cache: false,
		success: function(data, textStatus, XMLHttpRequest) 
		{
			oXML = data;
			oRoot = oXML.getElementsByTagName("ondemand").item(0);
	
			for (var iRow = 0; iRow < oRoot.childNodes.length; iRow++) 
			{
				var sEvent;
				var oRow = oRoot.childNodes.item(iRow);
				var sTitle = onDemandXMLGetData(oRow, "subject");
				var sStart = onDemandXMLGetData(oRow, "actiondatetime");
				var sEnd = onDemandXMLGetData(oRow, "enddatetime");
				var sDescription = onDemandXMLGetData(oRow, "description");
				var sId = onDemandXMLGetData(oRow, "id");
				var iHours = onDemandXMLGetData(oRow, "hours");
					
				sEvent = '{'
				sEvent = sEvent + '\"title\":\"' + sTitle + '\",'
				sEvent = sEvent + '\"start\":\"' + sStart + '\",'
				sEvent = sEvent + '\"end\":\"' + sEnd + '\",'
				//COULD NOT SHOW DESCRIPTION AS IT CAUSES ERROR EVERYTHING BUT FF
				//sEvent = sEvent + '\"description\": \"' + sDescription + '\",'
				sEvent = sEvent + '\"id\":\"' + sId + '\",'
				sEvent = sEvent + '\"hours\":\"' + iHours + '\",'
				sEvent = sEvent + '\"allDay\": false}'
									
				//CONVERT STRING TO JSON OBJECT AND PLACE IN ARRAY 
				var oEventObject = JSON.parse(sEvent);
				aEvents[iRow] = oEventObject;
			}
		}
	})
};

function interfaceHomeCalendar()
{
			
	interfaceHomeCalendarGetActions();
	
	$('#divInterfaceMasterViewportControlOptions').hide(0);
	
	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<table id="tableHomeOption" class="">';
	aHTML[++h] = '<tbody>'
	aHTML[++h] = '<tr class="">';
	aHTML[++h] = '<td class="interfaceViewportMasterCalendar">' +
					'<span id="spanInterfaceMasterCalendarAction" class="interfaceMasterViewport">&nbsp;</span>' +
					'</td>';
	aHTML[++h] = '</tr>';
	aHTML[++h] = '<tr class="">';
	aHTML[++h] = '<td class=""><span id="spanInterfaceMasterDialog"></span></td>';
	aHTML[++h] = '</tr>';
		
	$('#divInterfaceMasterDialog').html(aHTML.join(''));

	$('#spanInterfaceMasterCalendarAction')
		.button(
		{
			icons: 
			{
				primary: "ui-icon-grip-dotted-vertical",
				secondary: "ui-icon-triangle-1-s"
			},
			label: "Audit To Book:"
		})
		.click(function() 
		{
			interfaceMasterCalendarActionShow(this);
		})
		.css('text-align', 'left');
	
	$('#spanInterfaceMasterDialog').fullCalendar({
		theme: true,
		defaultView: 'agendaWeek',
		header: {
			left: 'prev,today,next',
			center: 'title',
			right: 'month,agendaWeek,agendaDay'
		},
		editable: true,
		firstHour: 7,
		minTime: 7,
		events: aEvents,
		columnFormat: {	month: 'ddd',    // Mon
					week: 'ddd d/M', // Mon 9/7
					day: 'dddd d/M'},
		
		eventClick: function(calEvent, jsEvent, view) 
		{
			interfaceHomeCalendarAction(calEvent.id, calEvent.title);
			//CreateDate();
			//CreateTime();
		},
		
		dayClick: function(date, allDay, jsEvent, view) 
		{
		    if (allDay) 
			{
				alert('Clicked on the entire day: ' + date);
			}
			else
			{
				
			}
		},
		
		eventDrop: function(event,dayDelta,minuteDelta,allDay,revertFunc) {
			if (allDay) 
			{
				//alert("Event is now all-day");
			}
			else
			{
				//alert("Event has a time-of-day");
			}
			
			var sParam;
			var sReturn;
			
			sParam = 'method=ACTION_UPDATE&select=' + event.id + '&date=' + $.fullCalendar.formatDate(event.start, "dd/MM/yyyy") + ' ' + $.fullCalendar.formatDate(event.start, "HH:mm") + '&hours=' + event.hours;
			sReturn = onDemandSend(sParam);
			RefreshCalendar();
			
		},
		
		eventResize: function(event,dayDelta,minuteDelta,revertFunc) {
			//alert(
			//	"The end date of " + event.title + "has been moved " +
			//	dayDelta + " days and " +
			//	minuteDelta + " minutes."
			//);
			if (!confirm("Are you sure about this change?")) {
				revertFunc();
			}
			else
			{
				//ACTION_UPDATE TIME
				var sParam;
				var sReturn;
				var iMilliseconds = event.end.getTime() - event.start.getTime();
				var sec = Math.floor(iMilliseconds/1000);
				var min = Math.floor(sec/60);
				var hr = min/60;
				sParam = 'method=ACTION_UPDATE&select=' + event.id + '&hours=' + hr;
				//alert(sParam);
				sReturn = onDemandSend(sParam);
				RefreshCalendar();
			}
		}
	});	
	
	$('#divInterfaceMasterDialog').dialog({
		title: 'Calendar',	
		modal: true,
		width: 850,
		height: 700,
		stack: false,
		draggable: false,
		resizeable: false,
		dialogClass: "masterDialog",
		beforeClose: function(event, ui) {$('#divInterfaceMasterViewportControlOptions').attr('onDemandSource', '');}
	});
	
}

function interfaceHomeCalendarAction(iActionId, sActionTitle)
{

	sParam = 'method=ACTION_SEARCH&contactperson=ALL&select=' + iActionId + '&rf=XML';
	
	$.ajax(
	{
		type: 'GET',
		url: '/directory/ondemand/object.asp?' + sParam,
		dataType: 'xml',
		success: interfaceHomeCalendarActionShow()
	});	

	$('#divInterfaceMasterViewportControlOptions').html(gsLoadingXHTML);
	
	$('#divInterfaceMasterViewportControlOptions').dialog({
		title: sActionTitle,	
		modal: true,
		stack: false,
		draggable: false,
		resizeable: false
	});
}

	$('#divInterfaceMasterViewportControlOptions')
	
function ShowEventDetails2(iActionId)
{	
	var iActionId;
	var oActionDate;
	//POPULATE THE MAINCONTENT WITH DATA BEFORE SHOWING
	GetEventDetails(iActionId);
	UpdateTotalOrder();
	ShowProductCart();
	$( "#mainContent" ).dialog({
		modal: true,
		height: 700,
		buttons: {
			Save: function() {
					
					var sParam;
					var sReturn;
					
					sParam = 'method=ACTION_UPDATE&select=' + iActionId + '&subject=' + $("#jobsubject").val() + '&date=' + $("#JobDate").val() + ' ' + $("#JobTime").val() + '&description=' + $("#jobdescription").val() + '&hours=' + $("#jobhoursbillable").val();
					sParam = sParam + '&contactbusiness=' + $("#businessid").text();
					sParam = sParam + '&contactperson=' + $("#personid").text(); 
					sReturn = onDemandSend(sParam);
					//ACTION_UPDATE
					
					
					RefreshCalendar();
					$( this ).dialog( "close" );	
			},
			Cancel: function() {
				$( this ).dialog( "close" );
			}
		},
		width: 800,
		stack: false,
		draggable: false,
		resizeable: false
	});

}

function interfaceMasterCalendarActionShow(oElement)
{

	var aHTML = [];
	var h = -1;

	if ($('#divInterfaceMasterViewportControlOptions').attr('onDemandSource') == oElement.id)
	{
		$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
		$('#divInterfaceMasterViewportControlOptions').attr('onDemandSource', '');
	}
	else
	{	
		$('#divInterfaceMasterViewportControlOptions').attr('onDemandSource', oElement.id);
		$('#divInterfaceMasterViewportControlOptions').html("&nbsp;");
		$('#divInterfaceMasterViewportControlOptions').show(giShowSpeedOptions);
		$('#divInterfaceMasterViewportControlOptions').offset({ top: $(oElement).offset().top + $(oElement).height(), left: $(oElement).offset().left });
		
		aHTML[++h] = '<table id="tableHomeOption" class="">';
		aHTML[++h] = '<tbody>'
		aHTML[++h] = '<tr class="">';
		aHTML[++h] = '<td class="interfaceViewportMasterCalendar">' +
						'12345' +
						'</td>';
		aHTML[++h] = '</tr></tbody></table>';
		
		$('#divInterfaceMasterViewportControlOptions').html(aHTML.join(''));
		
		//interfaceControlOptionsBind();
	}	
}

function interfaceMasterHomeTodayActions(aParam, oXML)
{

	var bShow = false;
	var sXHTMLElementId = 'tdInterfaceMainToday';
	var iDay = 0;
	var sLabel = 'Actions';
	var bOverdue = false;
	var bFuture = false;
	
	if (aParam != undefined)
	{
		if (aParam.show != undefined) {bShow = aParam.show}
		if (aParam.overdue != undefined) {bOverdue = aParam.overdue}
		if (aParam.future != undefined) {bFuture = aParam.future}
		if (aParam.xhtmlElementId != undefined) {sXHTMLElementId = aParam.xhtmlElementId}
		if (aParam.day != undefined) {iDay = aParam.day}
		if (aParam.label != undefined) {sLabel = aParam.label}
	}

	var aHTML = [];
	var h = -1;
	
	if (oXML == undefined)
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
			url: '/ondemand/action/?rf=XML&' + sParam,
			data: sData,
			dataType: 'xml',
			success: function(data) {interfaceMasterHomeTodayActions(aParam, data)}
		});
	}
	else
	{
		oRoot = oXML.getElementsByTagName("ondemand").item(0);
	
		if (oRoot.childNodes.length == 0)
		{
			aHTML[++h] = '<table id="tableHomeTodayActions" class="interfaceMasterHomeTodayActions">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">' +
							'<td class="interfaceMainRowNothing">No ' + sLabel + '</td></tr>';
			aHTML[++h] = '</tbody></table>';

			$('#' + sXHTMLElementId).html(aHTML.join(''));
			if (bShow) {$('#' + sXHTMLElementId).show(giShowSpeedOptions)}	
		}
		else
		{
			if (bShow)
			{
				aHTML[++h] = '<table id="tableHomeToday" class="interfaceMasterHomeOptionsHeaderLarge">';
				aHTML[++h] = '<tbody>'
				aHTML[++h] = '<tr class="interfaceHomeTodayActions">';
				aHTML[++h] = '<td class="interfaceHomeTodayActions">' + sLabel + '</td>';
				aHTML[++h] = '<td id="tdInterfaceHomeTodayActions" class="interfaceHomeOptionClose">Close</td>';
				aHTML[++h] = '</tr>';
				aHTML[++h] = '</tbody></table>';
				
				aHTML[++h] = '<table id="tableHomeOption" class="interfaceMasterHomeOptionsHeaderLarge">';
			}
			else
			{
				aHTML[++h] = '<table id="tableHomeTodayActions' + iDay + '">';
			}	
			
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">';
			aHTML[++h] = '<td class="interfaceMainCaption">Subject</td>';
			
			var fFunctionSearch = interfaceMasterHomeTodayActionsRowStandard
			
			if (bOverdue || bFuture)
			{
				aHTML[++h] = '<td class="interfaceMainCaption">Date</td>';
				var fFunctionSearch = interfaceMasterHomeTodayActionsRowShowDate
			}
			
			aHTML[++h] = '<td class="interfaceMainCaption">Time</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">Contact</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">&nbsp;</td>';
			aHTML[++h] = '</tr>';

			for (var iRow = 0; iRow < oRoot.childNodes.length; iRow++) 
			{
				var oRow = oRoot.childNodes.item(iRow);
				aHTML[++h] = fFunctionSearch(oRow);
			}
			
			aHTML[++h] = '</tbody></table>';

			if (bShow) {$('#' + sXHTMLElementId).show(giShowSpeedOptions)}	
			
			interfaceMasterPaginationList(
			{
				xhtmlElementID: sXHTMLElementId,
				xhtmlContext: 'HomeTodayAction',
				xhtml: aHTML.join(''),
				showMore: ($(oRoot).attr('morerows') == "true"),
				more: $(oRoot).attr('moreid'),
				rows: 10,
				functionShowRow: fFunctionSearch,
				functionNewPage: 'interfaceMasterHomeTodayActionsBind()'
			}); 	
			
			interfaceMasterHomeTodayActionsBind();
		}
	}
}

function interfaceMasterHomeTodayActionsRowShowDate(oRow)
{
	return interfaceMasterHomeTodayActionsRow(oRow, true)
}

function interfaceMasterHomeTodayActionsRowStandard(oRow)
{
	return interfaceMasterHomeTodayActionsRow(oRow, false)
}

function interfaceMasterHomeTodayActionsRow(oRow, bShowDate)
{
	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<tr class="interfaceMainRow">';
				
	aHTML[++h] = '<td id="tdHomeTodayActions_subject-' + onDemandXMLGetData(oRow, "id") + '" class="interfaceMainRow">' +
							onDemandXMLGetData(oRow, "subject") + '</td>';
		
	if (bShowDate)
	{
		var sDate = new Date(onDemandXMLGetData(oRow, 'actiondatetime'));
		sDate = $.fullCalendar.formatDate(sDate, 'dd MMM yyyy')
		aHTML[++h] = '<td id="tdHomeTodayActions_date-' + onDemandXMLGetData(oRow, "id") + '" class="interfaceMainRow">' +
							sDate + '</td>';
	}
	
	var sDate = new Date(onDemandXMLGetData(oRow, 'actiondatetime'));
	
	if ($.fullCalendar.formatDate(sDate, 'H') != '0' || $.fullCalendar.formatDate(sDate, 'm') != '0')
	{
		sDate = $.fullCalendar.formatDate(sDate, 'h:mm TT')
	}
	else
	{
		sDate = '&nbsp;';
	}	
							
	aHTML[++h] = '<td id="tdHomeTodayActions_time-' + onDemandXMLGetData(oRow, "id") + '" class="interfaceMainRow">' +
							sDate + '</td>';
							
	aHTML[++h] = '<td id="tdHomeTodayActions_contact-' + onDemandXMLGetData(oRow, "contactperson") + '" class="interfaceMainRow interfaceContact">' +
							onDemandXMLGetData(oRow, "contactpersonfirstname") + ' ' + 
							onDemandXMLGetData(oRow, "contactpersonsurname") + '</td>';
	
	aHTML[++h] = '<td id="tdHomeTodayActions-' + onDemandXMLGetData(oRow, "id") + '" class="interfaceMainRow" style="width:65px;">';
	
	aHTML[++h] = '<span id="spanHomeTodayActions_cancel-' + onDemandXMLGetData(oRow, "id") + '" class="interfaceMainRowOptionsCancel"></span>';
	aHTML[++h] = '<span id="spanHomeTodayActions_complete-' + onDemandXMLGetData(oRow, "id") + '" class="interfaceMainRowOptionsComplete"></span>';
	aHTML[++h] = '<span id="spanHomeTodayActions-' + onDemandXMLGetData(oRow, "id") + '" class="interfaceMainRowOptionsSelect"></span>';
	
	aHTML[++h] = '</td></tr>';
	
	return aHTML.join('');
	
}	
	
function interfaceMasterHomeTodayActionsBind()	
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
		interfaceMasterHomeTodayActionsStatus(this.id, 3)
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
		interfaceMasterHomeTodayActionsStatus(this.id, 1)
	})
	.css('width', '15px')
	.css('height', '18px')	
	
}
		
		
function interfaceMasterHomeTodayActionsStatus(sXHTMLElementID, iStatus)
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
			sData += '&status=' + interfaceMasterFormatSave(iStatus);
			
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
	
	aHTML[++h] = '<table id="tableInterfaceHomeLogon" class="interfaceMasterLogon" style="width:600px;">';
	
	aHTML[++h] = '<tr id="trInterfaceHomeLogonNotes" class="interfaceMasterLogon" >' +
					'<td id="tdInterfaceHomeLogon" class="interfaceMasterLogon" style="width:150px;padding-right:15px;border-right-style:solid;border-width: 1px;border-color: #B8B8B8;">' +
					gsLoadingXHTML + 
					'</td>';
					
	aHTML[++h] = '<td id="tdInterfaceMasterLogonNotes" class="interfaceMasterLogon"  style="width:150px;padding-left:15px;">';
	
	aHTML[++h] = '<table id="tableInterfaceMainHomeNotes" class="interfaceMainHome">' +
						'<tr id="trInterfaceMainHomeNotes" class="interfaceMainHome">' +						
						'<td id="tdInterfaceMainHomeNotes" class="interfaceMainHome" style="color:#404040;">' +
						'This is a example app based on mydigitalstructure.com.' +
						'<br /><br /><a href="http://mydigitalstructure.com/examples" target="_blank">More code examples</a>' +
						'<br /><br /><a href="http://mydigitalstructure.com/documentation" target="_blank">Documentation</a>' +
						'<br /><br /><a href="http://mydigitalstructure.com/gettingstarted" target="_blank">Getting started</a>' +
						'<br /><br /><a href="http://twitter.com/mydsondemand" target="_blank">twitter.com/mydsondemand</a>' +
						'<br /><br /><hr />' +
						'<br /><a href="https://developer.1blankspace.com" target="_blank"><strong>Modify this app or create your own app using the simple jQuery IDE.</strong></a>' +
						'</td>' +
						'</tr>' +
					'</table>';
					
	aHTML[++h] = '</td></tr></table>';				
	
	$('#divInterfaceBox').css("z-index", "1");
	$('#divInterfaceBox').css("width", "600px");
	$('#divInterfaceBox').html(aHTML.join(''));
	
	interfaceMasterLogonShow({xhtmlElementID: 'tdInterfaceHomeLogon'})
}