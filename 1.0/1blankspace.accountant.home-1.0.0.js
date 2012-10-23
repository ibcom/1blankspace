var gsHomeDefaultElementId = 'tdInterfaceViewportControlClients';

$(function()
{
	//Direct entry points using #
	
	var sHash = window.location.hash;
	
	switch(sHash)
	{
	case '#home':
		interfaceMasterHomeShow();
		break;
	}
	
	//if (giUserID != -1 && giUserID != undefined)
	//{
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
	//}	
	
});

function interfaceHomeViewport()
{
				
	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<table id="tableInterfaceHomeViewport">';
	
	aHTML[++h] = '<tr>' +
						'<td style="background-position: right center;" id="interfaceMasterViewportFinancialLarge" class="interfaceMasterViewportImageLarge">' +
						'&nbsp;' + 
						'</td>' +
						'</tr>';
		
	aHTML[++h] = '<tr id="trInterfaceViewportControl1" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlClients" class="interfaceViewportControl interfaceViewportControlHome">Clients</td>' +
					'</tr>';
	
	aHTML[++h] = '</table>';					
			
	$('#divInterfaceViewportControl').html(aHTML.join(''));
	
	interfaceMasterHomeViewportBind();
}

function interfaceMasterHomeViewportBind()
{
	
	$('#tdInterfaceViewportControlClients').click(function(event)
	{
		$('#tdInterfaceMainHomeColumn1').html(gsLoadingXHTML);
		gsHomeDefaultElementId = this.id;
		interfaceHomeClientsShow()
		
	});
}	

function interfaceHome()
{

	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<table id="tableInterfaceMainHome" class="interfaceMainHome">';
		
	aHTML[++h] = '<tr id="trInterfaceMainHome1" class="interfaceMainHome">';

	aHTML[++h] = '<td id="tdInterfaceMainHomeColumn1" class="interfaceMainHome" style="width:470px;">';
	
	aHTML[++h] = '</td>';	
	
	aHTML[++h] = '<td id="tdInterfaceMainHomeColumn2" class="interfaceMainHome">';
	aHTML[++h] = '<table id="tableInterfaceMainHomeColumn2" class="interfaceMainHome">';
	aHTML[++h] = '<tr id="trInterfaceMainHomeColumn2Row2" class="interfaceMainHome">' +						
						'<td id="tdInterfaceMainHomeNotes" class="interfaceMainHome" style="font-size:0.75em;color:#404040;">' +
						'An app for accountants to manage their clients.' +
						'</td>' +
						'</tr>';
						
	aHTML[++h] = '</table>'
	aHTML[++h] = '</td>'	
	
	aHTML[++h] = '</tr>'	
	aHTML[++h] = '</table>'
	
	return aHTML.join('');
}

function interfaceHomeShow()
{	
	if (gsHomeDefaultElementId != '')
	{
		$('#' + gsHomeDefaultElementId).addClass('interfaceViewportControlHighlight');
		$('#' + gsHomeDefaultElementId).click();
	}

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
	
}

function interfaceHomeOptionsUpdate()
{
	
}

function interfaceHomeClientsShow(oResponse)
{
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<table id="tableInterfaceWebsiteHomeMostLikely">';
	
		aHTML[++h] = '<tr class="interfaceMainRow">';
						
		aHTML[++h] = '<td id="tdSummaryHome_closed-" class="interfaceMainRow interfaceMainRowSelect">' +
								'ABC Pty Ltd</td>';
																	
		aHTML[++h] = '</tr>';
		
		aHTML[++h] = '<tr class="interfaceMainRow">';
						
		aHTML[++h] = '<td id="tdSummaryHome_closed-" class="interfaceMainRow interfaceMainRowSelect">' +
								'DEF Pty Ltd</td>';
																	
		aHTML[++h] = '</tr>';
	
	aHTML[++h] = '</tbody></table>';

	$('#tdInterfaceMainHomeColumn1').html(aHTML.join(''))
}


function interfaceHomeSummaryShow(oResponse)
{
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<table id="tableInterfaceWebsiteHomeMostLikely">';
	
		aHTML[++h] = '<tr class="interfaceMainRow">';
						
		aHTML[++h] = '<td id="tdSummaryHome_closed-" class="interfaceMainRow" style="width:200px;">' +
								'Accounts are closed as at</td>';
		
		aHTML[++h] = '<td id="tdSummaryHome_closed_value-" class="interfaceMainRow" style="text-align:right;">' +
									 '30 June 2012</td>';
																	
		aHTML[++h] = '</tr>';
		
		aHTML[++h] = '<tr class="interfaceMainRow">';
						
		aHTML[++h] = '<td id="tdSummaryHome_closed-" class="interfaceMainRow" style="width:200px;">' +
								'Tax last reported</td>';
		
		aHTML[++h] = '<td id="tdSummaryHome_closed_value-" class="interfaceMainRow" style="text-align:right;">' +
									 '30 June 2012</td>';
																	
		aHTML[++h] = '</tr>';
	
	aHTML[++h] = '</tbody></table>';

	$('#tdInterfaceMainHomeColumn1').html(aHTML.join(''))
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
						'An app for accountants to manage their clients.' +
						'</td>' +
						'</tr>' +
					'</table>';
					
	aHTML[++h] = '</td></tr></table>';				
	
	$('#divInterfaceBox').css("z-index", "1");
	$('#divInterfaceBox').css("width", "600px");
	$('#divInterfaceBox').html(aHTML.join(''));
	
	interfaceMasterLogonShow({xhtmlElementID: 'tdInterfaceHomeLogon'})
}
