var gaOpportuntityProcessingStatus;

function interfaceOpportunityMasterViewport(aParam)
{
	giObject = giObjectOpportunity;
	gsObjectName = 'Opportunity';
	goObjectContext = undefined;
	giObjectContext = -1;
		
	var bShowHome = true;
	
	if (aParam != undefined)
	{
		if (aParam.showHome != undefined) {bShowHome = aParam.showHome}
	}	
	
	interfaceMasterReset();		
		
	if (bShowHome)
	{
		interfaceMasterViewportDestination({
			newDestination: 'interfaceOpportunityMasterViewport({showHome: true});',
			move: false
			})		
	}	
		
	$('#divInterfaceMasterViewportControlSet').button(
	{
		label: "Opportunities"
	});
	
	$('#inputInterfaceMasterViewportControlSearch').keyup(function(event)
	{
		if (giKeyPressTimeoutId != 0) {clearTimeout(giKeyPressTimeoutId)};
        giKeyPressTimeoutId = setTimeout("interfaceOpportunitySearch('inputInterfaceMasterViewportControlSearch')", giWaitForStop);
	});
	
	$('#spanInterfaceMasterViewportControlSearch').click(function(event)
	{
		interfaceOpportunitySearch('inputInterfaceMasterViewportControlSearch');
	});
	
	$('#spanInterfaceMasterViewportControlSearchOptions').click(function(event)
	{
		interfaceOpportunitySearchOptions();
	});
	
	$('#spanInterfaceMasterViewportControlNew').click(function(event)
	{
		interfaceOpportunityNew();
	})
	
	$('#spanInterfaceMasterViewportControlAction').click(function(event)
	{
		interfaceOpportunitySave();
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

		interfaceMasterViewportActionShow(this, aHTML.join(''), "interfaceOpportunityActionOptionsBind()");
	});
	
	$('#spanInterfaceMasterViewportControlActionOptions').button({disabled: true});
	
	$('#spanInterfaceMasterViewportControlSetup').click(function(event)
	{
		interfaceOpportunitySetup();
	});
	
	$('#spanInterfaceMasterViewportControlSetupOptions').click(function(event)
	{
		interfaceOpportunitySetupOptions();
	});
	
	$('#spanInterfaceMasterViewportControlHelp').click(function(event)
	{
		interfaceOpportunityHelp();
	});
	
	$('#spanInterfaceMasterViewportControlHelpOptions').click(function(event)
	{
		interfaceOpportunityHelpOptions();
	});
	
	$('td.interfaceViewportMasterControlBrowse').click(function(event)
	{
		interfaceOpportunitySearch(event.target.id, {source: giSearchSource_BROWSE});
	});
	
	$('td.interfaceViewportMasterControlBrowseAll').click(function(event)
	{
		interfaceOpportunitySearch(event.target.id, {source: giSearchSource_BROWSE});
	});
	
	if (gbSetFocus) {$('#inputInterfaceMasterViewportControlSearch').focus()};
	
	if (bShowHome) {interfaceOpportunityHomeShow()};
	
}

function interfaceOpportunityHomeShow(oResponse)
{
	if (oResponse == undefined)
	{
		var aHTML = [];
		var h = -1;
					
		aHTML[++h] = '<table id="tableInterfaceViewportMain" class="interfaceViewportMain">';
		aHTML[++h] = '<tr id="trInterfaceViewportMain" class="interfaceViewportMain">' +
						'<td id="tdInterfaceOpportunityHomeMostLikely" class="interfaceViewportMain">' +
						gsLoadingXHTML + 
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMain').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
					
		aHTML[++h] = '<table>';
		aHTML[++h] = '<tr>' +
						'<td id="interfaceMasterViewportOpportunityLarge" class="interfaceMasterViewportImageLarge">' +
						'&nbsp;' + 
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';		
		
		$('#divInterfaceViewportControl').html(aHTML.join(''));	
		
		$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
		
		var oSearch = new AdvancedSearch();
		oSearch.endPoint = 'opportunity';
		oSearch.method = 'OPPORTUNITY_SEARCH';
		
		oSearch.addField('description,reference');
		oSearch.rows = 10;
		oSearch.sort('modifieddate', 'desc');
		
		oSearch.getResults(interfaceOpportunityHomeShow);
		
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableInterfaceOpportunityHomeMostLikely">';
			aHTML[++h] = '<tr class="trInterfaceOpportunityHomeMostLikelyNothing">';
			aHTML[++h] = '<td class="tdInterfaceOpportunityHomeMostLikelyNothing">Click New to create a opportunity.</td>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</table>';
		}
		else
		{
		
			aHTML[++h] = '<table id="tableInterfaceOpportunityHomeMostLikely">';
			aHTML[++h] = '<tr>';
			aHTML[++h] = '<td class="interfaceMain">MOST LIKELY</td>';
			aHTML[++h] = '</tr>';
			
			$.each(oResponse.data.rows, function()
			{			
				aHTML[++h] = '<tr class="interfaceMainRow">';
				
				aHTML[++h] = '<td id="interfaceProjectHomeMostLikely_Title-' + this.id + 
										'" class="interfaceHomeMostLikely">';
										
				if (this.description != '')
				{
					aHTML[++h] = this.description;
				}
				else
				{	
					aHTML[++h] = this.reference;
				}
				
				aHTML[++h] = '</td></tr>';
			});
			
			aHTML[++h] = '</tbody></table>';
		}
		
		$('#tdInterfaceOpportunityHomeMostLikely').html(aHTML.join(''));
	
		$('td.interfaceHomeMostLikely').click(function(event)
		{
			interfaceOpportunitySearch(event.target.id, {source: 1});
		});
	}
}

function interfaceOpportunitySearch(sXHTMLElementId, aParam)
{
		
	var aSearch = sXHTMLElementId.split('-');
	var sElementId = aSearch[0];
	var sSearchContext = aSearch[1];
	var iMinimumLength = 3;
	var iSource = giSearchSource_TEXT_INPUT;
	var sSearchText;
	var sClientFilter = '';
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
		
		giObjectContext = sSearchContext;
		
		var oSearch = new AdvancedSearch();
		oSearch.method = 'OPPORTUNITY_SEARCH';
		
		oSearch.addField('reference,businessname,firstname,surname,' +
									'requestbybusiness,requestbybusinesstext,' +
									'requestbyperson,requestbypersontext,type,typetext,' +
									'lodgeddate,source,sourcetext,sourcetext,manageruser,managerusertext,' +
									'status,statustext,processingstatus,processingstatustext,' +
									'processingdate,description,' +
									'mailingaddress1,mailingsuburb,mailingstate,mailingpostcode,mailingcountry,' +
									'email,mobile,phone,createddate,createdusertext');
									
		oSearch.addFilter('id', 'EQUAL_TO', giObjectContext);
		oSearch.rf = 'json';
	
		oSearch.getResults(function(data){interfaceOpportunityShow(aParam, data)}) 
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
			sElementId = 'tableInterfaceViewportMasterBrowse';
		}
		
		if (sSearchText.length >= iMinimumLength || iSource == giSearchSource_BROWSE)
		{
			
			interfaceMasterOptionsSetPosition(sElementId);
			interfaceMasterSearchStart(sElementId);
			
			var oSearch = new AdvancedSearch();
			oSearch.method = 'OPPORTUNITY_SEARCH';
			
			oSearch.addField('businessname,firstname,surname,requestbytextbusiness,status,statustext');
			
			if (iSource == giSearchSource_TEXT_INPUT)
			{	
				oSearch.addFilter('quicksearch', 'STRING_IS_LIKE', sSearchText);
			}
			else
			{
				oSearch.addFilter('quicksearch', 'STRING_STARTS_WITH', sSearchText);
			}
			
			oSearch.rf = 'json';
			
			oSearch.getResults(function(data){interfaceOpportunitySearchShow(aParam, data)}) 

		}
	};	
}

function interfaceOpportunitySearchShow(aParam, oResponse)
{
	var iColumn = 0;
	var aHTML = [];
	var h = -1;
		
	if (oResponse.data.rows.length == 0)
	{
		interfaceMasterSearchStop();	
		$('#divInterfaceMasterViewportControlOptions').hide();
	}
	else
	{
		var iStartRow = parseInt($(oRoot).attr('startrow'));
		var iRows = parseInt($(oRoot).attr('rows'));
		var bMore = ($(oRoot).attr('morerows') == "true");
		var iMore = $(oRoot).attr('moreid')

		aHTML[++h] = '<table class="interfaceSearchMedium">';
		aHTML[++h] = '<tbody>'
			
		$.each(oResponse.data.rows, function()
		{	
			aHTML[++h] = '<tr class="interfaceSearch">';
			
			aHTML[++h] = '<td class="interfaceSearch';
			
			aHTML[++h] = ' interfaceOpportunity' + this.statustext;
			
			aHTML[++h] = '" id=-' + this.id + '">' +
							this.businessname + '</td>';
							
			aHTML[++h] = '<td class="interfaceSearch';
			
			aHTML[++h] = ' interfaceOpportunity' + this.statustext;
			
			aHTML[++h] = '" id=-' + this.id + '">' +
							this.firstname + ' ' + this.surname + '</td>';
			
			aHTML[++h] = '</tr>'
		});
    	
		aHTML[++h] = '</tbody></table>';

		$('#divInterfaceMasterViewportControlOptions').html(
		interfaceMasterPagination(
		   {
			html: aHTML.join(''),
			more: (oResponse.morerows == "true"),
			type: 'json'
		   }) 
		);		
		$('#divInterfaceMasterViewportControlOptions').show(giShowSpeedOptions);
		interfaceMasterSearchStop();
		
		$('td.interfaceSearch').click(function(event)
		{
			$('#divInterfaceMasterViewportControlOptions').html('&nbsp;');
			$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions)
			interfaceOpportunitySearch(event.target.id, {source: 1});
		});
		
		interfaceMasterPaginationBind(
		{
			columns: 'businessname-firstname-surname',
			more: oResponse.moreid,
			rows: 20,
			startRow: 20,
			startRow: parseInt(oResponse.startrow) + parseInt(oResponse.rows),
			functionSearch: interfaceOpportunitySearch,
		});   
	}	
}

function interfaceOpportunityViewport()
{
	
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceViewportControlContext" class="interfaceViewportControlContext"></div>';
	
	aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
	
	if (giObjectContext != -1)
	{	
		aHTML[++h] = '<tr id="trInterfaceViewportControl" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlSummary" class="interfaceViewportControl interfaceViewportControlHighlight">Summary</td>' +
						'</tr>';	
	
		aHTML[++h] = '<tr id="trInterfaceViewportControl" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlDetails" class="interfaceViewportControl">Details</td>' +
					'</tr>';
	}
	else
	{
		aHTML[++h] = '<tr id="trInterfaceViewportControl" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlDetails" class="interfaceViewportControl interfaceViewportControlHighlight">Details</td>' +
					'</tr>';
	}					
	
	aHTML[++h] = '<tr id="trInterfaceViewportControl" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlContact" class="interfaceViewportControl">Contact</td>' +
					'</tr>';
						
	aHTML[++h] = '</table>';					
	
	if (giObjectContext != -1)
	{	
		aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
		
		aHTML[++h] = '<tr id="trInterfaceViewportControl" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlActions" class="interfaceViewportControl">Actions</td>' +
					'</tr>';
						
		aHTML[++h] = '<tr id="trInterfaceViewportControl" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlAttachments" class="interfaceViewportControl">Attachments</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
	}
		
	$('#divInterfaceViewportControl').html(aHTML.join(''));
	
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceMainSummary" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainDetails" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainContact" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainActions" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainAttachments" class="divInterfaceViewportMain"></div>';
		
	$('#divInterfaceMain').html(aHTML.join(''));
	
	$('#tdInterfaceViewportControlSummary').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainSummary");
		interfaceOpportunitySummary();
	});	
	
	$('#tdInterfaceViewportControlDetails').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainDetails");
		interfaceOpportunityDetails();
	});
	
	$('#tdInterfaceViewportControlContact').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainContact");
		interfaceOpportunityContact();
	});

	$('#tdInterfaceViewportControlActions').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainActions");
		interfaceMasterActions({xhtmlElementID: 'divInterfaceMainActions'});
	});
	
	$('#tdInterfaceViewportControlAttachments').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainAttachments");
		interfaceMasterAttachments({xhtmlElementID: 'divInterfaceMainAttachments'});
	});
	
}

function interfaceOpportunityShow(aParam, oResponse)
{

	$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
	interfaceOpportunityViewport();
	interfaceMasterStatus('');

	var aHTML = [];
	var h = -1;
	
	if (oResponse.data.rows.length == 0)
	{
		goObjectContext = undefined;
		
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find this opportunity.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		goObjectContext = oResponse.data.rows[0];
		
		interfaceMasterViewportDestination({
			newDestination: 'interfaceOpportunityMasterViewport({showHome: false});interfaceOpportunitySearch("-' + giObjectContext + '")',
			move: false
			})
	
		
		var sContext = goObjectContext.reference;
		
		if (goObjectContext.businessname != '')
		{
			sContext += '<br /><span id="spanInterfaceViewportControlSubContext">' + goObjectContext.businessname + '</span>';
		}
		
		if (goObjectContext.firstname != '')
		{
			sContext += '<br /><span id="spanInterfaceViewportControlSubContext">' + goObjectContext.firstname + '</span>';
		}
		
		if (goObjectContext.surname != '')
		{
			sContext += '<br /><span id="spanInterfaceViewportControlSubContext">' + goObjectContext.surname + '</span>';
		}
		
		$('#divInterfaceViewportControlContext').html(sContext);
		
		$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
		$('#spanInterfaceMasterViewportControlActionOptions').button({disabled: false});
		
		interfaceOpportunitySummary();
	}	
}		
		
function interfaceOpportunitySummary()
{
	var aHTML = [];
	var h = -1;

	if (goObjectContext == undefined)
	{
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find this opportunity.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		aHTML[++h] = '<table id="tableInterfaceMainSummary" class="interfaceMain">';
		aHTML[++h] = '<tr id="trInterfaceMainSummaryRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainSummaryColumn1Large" class="interfaceMainColumn1Large">' +
						'</td>' +
						'<td id="tdInterfaceMainSummaryColumn2Action" style="width:100px;">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';				
		
		$('#divInterfaceMainSummary').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMainColumn1">';
		
		if (goObjectContext.businessname != '')
		{
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryBusiness" class="interfaceMainSummary">Business</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryBusinessValue" class="interfaceMainSummaryValue">' +
						goObjectContext.businessname +
						'</td></tr>';
		}				
						
		if (goObjectContext.firstname != '' || goObjectContext.surname != '')
		{
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryContact" class="interfaceMainSummary">Contact</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryContactValue" class="interfaceMainSummaryValue">' +
						goObjectContext.firstname + ' ' + goObjectContext.surname +
						'</td></tr>';
		}				
			
		if (goObjectContext.processingstatustext != '')
		{	
			aHTML[++h] = '<tr><td id="trInterfaceMainSummaryProcessingStatus" class="interfaceMainSummary">Processing Status</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryProcessingStatusValue" class="interfaceMainSummaryValue">' +
						goObjectContext.processingstatustext +
						'</td></tr>';											
		}
		
		if (goObjectContext.statustext != '')
		{	
			aHTML[++h] = '<tr><td id="trInterfaceMainSummaryStatus" class="interfaceMainSummary">Status</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryStatusValue" class="interfaceMainSummaryValue">' +
						goObjectContext.statustext +
						'</td></tr>';											
		}
		
		var sDate = new Date(goObjectContext.createddate);	
		sDate = $.fullCalendar.formatDate(sDate, 'd MMM yyyy h:mm TT');
				
		aHTML[++h] = '<tr><td id="trInterfaceMainSummaryDateLodged" class="interfaceMainSummary">Date Lodged</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryProcessingDateLogdgedValue" class="interfaceMainSummaryValue">' +
						sDate +
						'</td></tr>';		
		
		aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryDescription" class="interfaceMainSummary">Description</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryDescriptionValue" class="interfaceMainSummaryValue">' +
						goObjectContext.description +
						'</td></tr>';
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn1Large').html(aHTML.join(''));
			
		var aHTML = [];
		var h = -1;	
			
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMainColumn2Action" cellspacing=0>';
		
		if (goObjectContext.requestbyperson == '')
		{
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryCreateContact" class="interfaceMainColumn2Action">' +
							'<a href="#" id="aInterfaceMainSummaryCreateContact">Create&nbsp;Person&nbsp;Contact</a></td></tr>';
		}
		else
		{
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryViewContact" class="interfaceMainColumn2Action">' +
							'<a href="#" id="aInterfaceMainSummaryViewContact">View&nbsp;Person&nbsp;Contact</a></td></tr>';
		}	
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn2Action').html(aHTML.join(''));	
		
		$('#aInterfaceMainSummaryViewContact').click(function(event)
		{
			interfaceContactPersonMasterViewport({showHome: false});
			interfaceContactPersonSearch('-' + onDemandXMLGetData(oRow, 'requestbyperson'))
		});
		
		$('#aInterfaceMainSummaryCreateContact').click(function(event)
		{
			interfaceOpportunityCreateContact();
		});
		
		$('#aInterfaceMainSummarySendEmail').click(function(event)
		{
			interfaceMessagingSendEmail();
		});
	}	
}

function interfaceOpportunityDetails()
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
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsDateReceived" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsDateReceived" class="interfaceMain">' +
						'Date Received' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsDateReceivedValue" class="interfaceMainDate">' +
						'<td id="tdInterfaceMainDetailsDateReceivedValue" class="interfaceMainDate">' +
						'<input id="inputInterfaceMainDetailsDateReceived" class="inputInterfaceMainDate">' +
						'</td></tr>';						
						
		aHTML[++h] = '<tr id="trInterfaceMainDetailsSourceOfContact" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsSourceOfContact" class="interfaceMain">' +
						'Source of Contact' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsSourceOfContactValue" class="interfaceMainSelect">' +
						'<td id="tdInterfaceMainDetailsSourceOfContactValue" class="interfaceMainSelect">' +
						'<input id="inputInterfaceMainDetailsSourceOfContact" class="inputInterfaceMainSelect"' +
							' onDemandMethod="SETUP_OPPORTUNITY_SOURCE_OF_CONTACT_SEARCH">' +
						'</td></tr>';	
						
		aHTML[++h] = '<tr id="trInterfaceMainDetailsSourceOfContactOther" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsSourceOfContactOther" class="interfaceMain">' +
						'Source of Contact - Other Details' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsSourceOfContactOtherValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsSourceOfContactOtherValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainDetailsSourceOfContactOther" class="inputInterfaceMainText">' +
						'</td></tr>';				
						
		aHTML[++h] = '<tr id="trInterfaceMainDetailsManagedBy" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsManagedBy" class="interfaceMain">' +
						'Managed By' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsManagedByValue" class="interfaceMainSelect">' +
						'<td id="tdInterfaceMainDetailsManagedByValue" class="interfaceMainSelect">' +
						'<input id="inputInterfaceMainDetailsManagedBy" class="inputInterfaceMainSelect"' +
							' onDemandMethod="/ondemand/core/?method=CORE_USER_SEARCH&rf=xml"'+ 
														' onDemandColumns="firstname-space-surname">' +
						'</td></tr>';			
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsStatus" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsStatus" class="interfaceMain">' +
						'Status' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsStatusValue" class="interfaceMainRadio">' +
						'<td id="tdInterfaceMainDetailsStatusValue" class="interfaceMainRadio">' +
						'<input type="radio" id="radioStatus1" name="radioStatus" value="1"/>Open' +
						'<br /><input type="radio" id="radioStatus2" name="radioStatus" value="2"/>Closed' +
						'<br /><input type="radio" id="radioStatus3" name="radioStatus" value="3"/>Cancelled' +
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
						'<textarea rows="9" cols="35" id="inputInterfaceMainDetailsDescription" class="inputInterfaceMainTextMulti"></textarea>' +
						'</td></tr>';

		aHTML[++h] = '</table>';		
		
		$('#tdInterfaceMainDetailsColumn2').html(aHTML.join(''));
		
		$('input.inputInterfaceMainDate').datepicker({ dateFormat: 'dd M yy' });
		
		if (goObjectContext != undefined)
		{
			$('#inputInterfaceMainDetailsDateReceived').val(goObjectContext.lodgeddate);
			$('#inputInterfaceMainDetailsSourceOfContact').attr(goObjectContext.source);
			$('#inputInterfaceMainDetailsSourceOfContact').val(goObjectContext.sourcetext);
			$('#inputInterfaceMainDetailsSourceOfContactOther').val(goObjectContext.sourcetext);
			$('#inputInterfaceMainDetailsManagedBy').attr('onDemandID', goObjectContext.manageruser);
			$('#inputInterfaceMainDetailsManagedBy').val(goObjectContext.managerusertext);
			$('#inputInterfaceMainDetailsDescription').val(goObjectContext.description);
			$('[name="radioStatus"][value="' + goObjectContext.status + '"]').attr('checked', true);
		}
		else
		{
			var dDate = new Date();
			var dToday;
			dToday = dDate.format('d mmm yyyy');
			$('#inputInterfaceMainDetailsDateReceived').val(dToday);
			$('#inputInterfaceMainDetailsManagedBy').attr('onDemandID', gsUserID);
			$('#inputInterfaceMainDetailsManagedBy').val(gsUserName);
			$('[name="radioStatus"][value="1"]').attr('checked', true);
		}
	}	
}

function interfaceOpportunityContact()
{
	var aHTML = [];
	var h = -1;
	
	if ($('#divInterfaceMainContact').attr('onDemandLoading') == '1')
	{
		$('#divInterfaceMainContact').attr('onDemandLoading', '');
		
		aHTML[++h] = '<table id="tableInterfaceMainContact" class="interfaceMain">' +
						'<tr id="trInterfaceMainContactRow1" class="interfaceMainRow1">' +
						'<td id="tdInterfaceMainContactColumn1" class="interfaceMainColumn1Large">' +
						'</td>' +
						'<td id="tdInterfaceMainContactColumn2" class="interfaceMainColumn2Action">' +
						'</td>' +
						'</tr>' +
						'</table>';					
				
		$('#divInterfaceMainContact').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table id="tableInterfaceMainContactActionColumn1" class="interfaceMain">';
		aHTML[++h] = '<tbody>';
		
		if (goObjectContext != undefined)
		{
			if (goObjectContext.requestbybusiness != '')
			{	
				GetCurrentContactStatus('', 'business', goObjectContext.requestbybusiness);

				aHTML[++h] = '<tr><td id="tdInterfaceMainContactProspectBusiness" class="interfaceMainSummaryAction">';
				aHTML[++h] = '<a href="#" id="aInterfaceMainContactProspectBusiness">Update&nbsp;Contact';
				aHTML[++h] = '</a></td></tr>';
			}	
			else
			{
				aHTML[++h] = '<tr><td id="tdInterfaceMainContactProspectBusiness" class="interfaceMainSummaryAction">';
				aHTML[++h] = '<a href="#" id="aInterfaceMainContactProspectBusiness">Create Contact</a></td></tr>';
			}
		}	
		aHTML[++h] = '</tbody></table>';
		
		$('#tdInterfaceMainContactColumn2').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table id="tableInterfaceMainContactDetailColumn1" class="interfaceMain">';
						
		aHTML[++h] = '<tr id="trInterfaceMainContactBusinessName" class="interfaceMain">' +
						'<td id="tdInterfaceMainContactBusinessName" class="interfaceMain">' +
						'Business Name' +
						'</td></tr>' +
						'<tr id="trInterfaceMainContactBusinessNameValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainContactBusinessNameValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainContactBusinessName" class="inputInterfaceMainText">' +
						'</td></tr>';				

		aHTML[++h] = '<tr id="trInterfaceMainContactFirstName" class="interfaceMain">' +
						'<td id="tdInterfaceMainContactFirstName" class="interfaceMain">' +
						'First Name' +
						'</td></tr>' +
						'<tr id="trInterfaceMainContactFirstNameValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainContactFirstNameValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainContactFirstName" class="inputInterfaceMainText">' +
						'</td></tr>';			

		aHTML[++h] = '<tr id="trInterfaceMainContactSurname" class="interfaceMain">' +
						'<td id="tdInterfaceMainContactSurname" class="interfaceMain">' +
						'Surname' +
						'</td></tr>' +
						'<tr id="trInterfaceMainContactSurnameValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainContactSurnameValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainContactSurname" class="inputInterfaceMainText">' +
						'</td></tr>';
	
		aHTML[++h] = '<tr id="trInterfaceMainContactPhone" class="interfaceMain">' +
						'<td id="tdInterfaceMainContactPhone" class="interfaceMain">' +
						'Phone' +
						'</td></tr>' +
						'<tr id="trInterfaceMainContactPhoneValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainContactPhoneValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainContactPhone" class="inputInterfaceMainText">' +
						'</td></tr>';						
	
		aHTML[++h] = '<tr id="trInterfaceMainContactMobile" class="interfaceMain">' +
						'<td id="tdInterfaceMainContactMobile" class="interfaceMain">' +
						'Mobile' +
						'</td></tr>' +
						'<tr id="trInterfaceMainContactMobileValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainContactMobileValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainContactMobile" class="inputInterfaceMainText">' +
						'</td></tr>';			
		
		aHTML[++h] = '<tr id="trInterfaceMainContactEmail" class="interfaceMain">' +
						'<td id="tdInterfaceMainContactEmail" class="interfaceMain">' +
						'Email' +
						'</td></tr>' +
						'<tr id="trInterfaceMainContactEmailValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainContactEmailValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainContactEmail" class="inputInterfaceMainText">' +
						'</td></tr>';			
		
		aHTML[++h] = '<tr id="trInterfaceMainContactMailingAddress1" class="interfaceMain">' +
						'<td id="tdInterfaceMainContactMailingAddress1" class="interfaceMain">' +
						'Mailing Address' +
						'</td></tr>' +
						'<tr id="trInterfaceMainContactMailingAddress1Value" class="interfaceMainText">' +
						'<td id="tdInterfaceMainContactMailingAddress1Value" class="interfaceMainText">' +
						'<input id="inputInterfaceMainContactMailingAddress1" class="inputInterfaceMainText">' +
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceMainContactMailingSuburb" class="interfaceMain">' +
						'<td id="tdInterfaceMainContactMailingSuburb" class="interfaceMain">' +
						'Suburb' +
						'</td></tr>' +
						'<tr id="trInterfaceMainContactMailingSuburbValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainContactMailingSuburbValue" class="interfaceMainText">' +
						'<input onDemandType="TEXT" id="inputInterfaceMainContactMailingSuburb" class="inputInterfaceMainText">' +
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceMainContactMailingState" class="interfaceMain">' +
						'<td id="tdInterfaceMainContactMailingState" class="interfaceMain">' +
						'State' +
						'</td></tr>' +
						'<tr id="trInterfaceMainContactMailingStateValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainContactMailingStateValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainContactMailingState" class="inputInterfaceMainText">' +
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceMainContactMailingPostCode" class="interfaceMain">' +
						'<td id="tdInterfaceMainContactMailingPostCode" class="interfaceMain">' +
						'Post Code' +
						'</td></tr>' +
						'<tr id="trInterfaceMainContactMailingPostCodeValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainContactMailingPostCodeValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainContactMailingPostCode" class="inputInterfaceMainText">' +
						'</td></tr>';				
						
		aHTML[++h] = '<tr id="trInterfaceMainContactMailingCountry" class="interfaceMain">' +
						'<td id="tdInterfaceMainContactMailingCountry" class="interfaceMain">' +
						'Country' +
						'</td></tr>' +
						'<tr id="trInterfaceMainContactMailingCountryValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainContactMailingCountryValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainContactMailingCountry" class="inputInterfaceMainText">' +
						'</td></tr>';						
						
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainContactColumn1').html(aHTML.join(''));
		
		if (goObjectContext != undefined)
		{
			$('#inputInterfaceMainContactBusinessName').val(goObjectContext.businessname);
			$('#inputInterfaceMainContactFirstName').val(goObjectContext.firstname);
			$('#inputInterfaceMainContactSurname').val(goObjectContext.surname);
			$('#inputInterfaceMainContactPhone').val(goObjectContext.phone);
			$('#inputInterfaceMainContactMobile').val(goObjectContext.mobile);
			$('#inputInterfaceMainContactEmail').val(goObjectContext.email);
			$('#inputInterfaceMainContactMailingAddress1').val(goObjectContext.mailingaddress1);
			$('#inputInterfaceMainContactMailingSuburb').val(goObjectContext.mailingsuburb);
			$('#inputInterfaceMainContactMailingState').val(goObjectContext.mailingstate);
			$('#inputInterfaceMainContactMailingPostCode').val(goObjectContext.mailingpostcode);
			$('#inputInterfaceMainContactMailingCountry').val(goObjectContext.mailingcountry);
			if ((goObjectContext.requestbybusiness != '') || (goObjectContext.requestbybusiness != ''))
			{
				$('#aInterfaceMainContactProspectBusiness').click(function(event)
				{
					interfaceOpportunityManageProspect();
				});
			}
		}
	}	
}

function interfaceOpportunityNew(oXML)
{
	goObjectContext = unefined;
	giObjectContext = -1;
	interfaceOpportunityViewport(true);
	$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
	$('#spanInterfaceMasterViewportControlActionOptions').button({disabled: true});
	interfaceOpportunityDetails();	
}

function interfaceOpportunitySave()
{
	var sParam = '/ondemand/opportunity/?method=OPPORTUNITY_MANAGE';
	var sData = (giObjectContext == -1)?'':'&id=' + giObjectContext;
	var sPreviousValue;
	var sSavedProcessStatus = '';
	var iFound = -1;
	var iProcessingStatusCancelled;
	var dDate = new Date();
	var dToday;
	dToday = dDate.format('d mmm yyyy');

	iFound = $.inArray(gaOpportunityProcessingStatus, 'Opportunity Cancelled', 1)
	if (iFound >= 0)  { iProcessingStatusCancelled = gaOpportunityProcessingStatus[iFound][0]}

	if (goObjectContext != undefined)	
	{		
		sSavedProcessStatus = goObjectContext.processingstatus;
	}
	
	if ($('#divInterfaceMainDetails').html() != '')
	{
		sData += '&type=' + giOpportunityTypeOpportunity;
		sData += '&startdate=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsDateReceived').val());
		
		if ($('#inputInterfaceMainDetailsSourceOfContact').attr('onDemandID') != undefined)
		{	sData += '&source=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsSourceOfContact').attr('onDemandID'));}
		
		sData += '&sourcenote=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsSourceOfContactOther').val());
		
		if ($('#inputInterfaceMainDetailsManagedBy').attr('onDemandID'))
		{	sData += '&manageruser=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsManagedBy').attr('onDemandID'));}
		else
		{	
			if (goObjectContext != undefined)	
			{	
				sData += '&manageruser=' + goObjectContext.manageruser;	
				$('#inputInterfaceMainDetailsManagedBy').attr('onDemandID', goObjectContext.manageruser);
				$('#inputInterfaceMainDetailsManagedBy').val(goObjectContext.managerusertext)
			}
			else
			{
				sData += '&manageruser='+ gsUserID;
			}
		}

		if ($('#inputInterfaceMainDetailsStatus').attr('onDemandID') == giOpportunityStatusCancelled )
		{	 
			if	( 
				  ( $('#inputInterfaceMainDetailsNewProcessingStatus').attr('onDemandID') != undefined &&
				    $('#inputInterfaceMainDetailsNewProcessingStatus').attr('onDemandID') != iProcessingStatusCancelled 
				  )
				||
				  ( $('#inputInterfaceMainDetailsNewProcessingStatus').attr('onDemandID') == undefined && 
				    sSavedProcessStatus != iProcessingStatusCancelled
				  ) 
			    )
			{
				$('#inputInterfaceMainDetailsNewProcessingStatus').attr('onDemandID') = iProcessingStatusCancelled;
				$('#inputInterfaceMainDetailsNewProcessingStatus').val('Opportunity Cancelled');
				$('#inputInterfaceMainDetailsNewProcessingDate').val(dToday);
				$('#inputInterfaceMainDetailsNewProcessingNote').val('System update. User changed Opportunity Status to Cancelled.');
				$('#tdInterfaceMainDetailsCurrentProcessingStatusValue').html('Opportunity Cancelled');
			}
		}
		
		if ($('#inputInterfaceMainDetailsNewProcessingStatus').attr('onDemandID') == iProcessingStatusCancelled )
		{	 
			if	( 
				  ( $('#inputInterfaceMainDetailsStatus').attr('onDemandID') != undefined &&
				    $('#inputInterfaceMainDetailsStatus').attr('onDemandID') != giOpportunityStatusCancelled 
				  )
			    )
			{
				$('#inputInterfaceMainDetailsStatus').attr('onDemandID')  = giOpportunityStatusCancelled;
				$('#inputInterfaceMainDetailsStatus').val('Cancelled');
			}
			
		}

		if ($('#inputInterfaceMainDetailsStatus').attr('onDemandID') != undefined)
		{			
			sData += '&status=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsStatus').attr('onDemandID'));
		}
		else
		{	
			if (goObjectContext != undefined)	
			{	
				sData += '&status=' + goObjectContext.status;	
				$('#inputInterfaceMainDetailsStatus').attr('onDemandID', goObjectContext.status);
				$('#inputInterfaceMainDetailsStatus').val(goObjectContext.statustext);
			}
			else
			{	sData += '&status=' + giOpportunityStatusOpen;	}
		}
		
		sData += '&description=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsDescription').val());
		
		if ($('#inputInterfaceMainDetailsNewProcessingStatus').attr('onDemandID') != undefined)
		{	if (giObjectContext != -1)
			{
				if (goObjectContext != undefined)	
				{
					sPreviousValue = goObjectContext.processingstatus;	
					$('#inputInterfaceMainDetailsNewProcessingStatus').attr('onDemandID', goObjectContext.processingstatus);
				}
				else 
				{	sPreviousValue = '';	}
				
				if (sPreviousValue != $('#inputInterfaceMainDetailsNewProcessingStatus').attr('onDemandID'))
				{	
					sData += '&updateprocessingstatus=1' + 
						'&processingstatus=' + $('#inputInterfaceMainDetailsNewProcessingStatus').attr('onDemandID') +
						'&processingdate=' + $('#inputInterfaceMainDetailsNewProcessingDate').val() +
						'&processingnote=' + $('#inputInterfaceMainDetailsNewProcessingNote').val() ;	
				}
			}
			else
			{	
				iFound = interfaceOpportuntityProcessingStatus('New Opportunity')
				if (iFound != -1) {sData += '&processingstatus=' + iFound;}
			}
		}
		else
		{	
			iFound = interfaceOpportuntityProcessingStatus('New Opportunity')
			if (iFound != -1) {sData += '&processingstatus=' + iFound;}
			
			iFound = ArrayFind(gaOpportunityProcessingStatus, 'New Opportunity', 1)
			if (iFound >= 0)  {sData += '&processingstatus=' + gaOpportunityProcessingStatus[iFound][0]; }
		}
	}
		
	if ($('#divInterfaceMainContact').html() != '')
	{
		if ($('#inputInterfaceMainContactFirstName') != '' && $('#inputInterfaceMainContactSurname') == '')
		{	
			alert('Surname is mandatory for a Contact.');
			return '';	}
			
		sData += '&businessname=' + interfaceMasterFormatSave($('#inputInterfaceMainContactBusinessName').val());
		sData += '&firstname=' + interfaceMasterFormatSave($('#inputInterfaceMainContactFirstName').val());
		sData += '&surname=' + interfaceMasterFormatSave($('#inputInterfaceMainContactSurname').val());
		sData += '&phone=' + interfaceMasterFormatSave($('#inputInterfaceMainContactPhone').val());
		sData += '&mobile=' + interfaceMasterFormatSave($('#inputInterfaceMainContactMobile').val());
		sData += '&email=' + interfaceMasterFormatSave($('#inputInterfaceMainContactEmail').val());
		sData += '&mailingaddress1=' + interfaceMasterFormatSave($('#inputInterfaceMainContactMailingAddress1').val());
		sData += '&mailingsuburb=' + interfaceMasterFormatSave($('#inputInterfaceMainContactMailingSuburb').val());
		sData += '&mailingstate=' + interfaceMasterFormatSave($('#inputInterfaceMainContactMailingState').val());
		sData += '&mailingpostcode=' + interfaceMasterFormatSave($('#inputInterfaceMainContactMailingPostCode').val());
		sData += '&mailingcountry=' + interfaceMasterFormatSave($('#inputInterfaceMainContactMailingCountry').val());
	}
	
	interfaceMasterSave(sParam, sData, 'Opportunity Saved');
	
	if (glObjectSaveId != -1)
	{	
		if (giObjectContext == -1)
		{	
			giObjectContext = glObjectSaveId;
			interfaceOpportunitySearch('opporunity-' + giObjectContext);
		}
	}
}

function interfaceOpportunityManageProspect()
{
	var sParam = '';
	var sData = '';
	var sReturn = '';
	var iContactBusiness = '';
	var iContactPerson = '';
	var sSuccessMessage = '';
	
	var aHTML = [];
	var h = -1;
	
	if (goObjectContext != undefined)	
	{
		aHTML[++h] = '<table><tbody><tr><td valign="top">Opportunity must be saved before prospect can be created.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		iContactPerson = goObjectContext.requestbyperson;
		iContactBusiness = goObjectContext.requestbybusiness;
	}

	if ($('#inputInterfaceMainContactBusinessName').val() != '' || goObjectContext.businessname != '' )
	{
		sParam = 'method=CONTACT_BUSINESS_MANAGE';
		sData = '';
		
		if ($('#inputInterfaceMainContactBusinessName').val() != undefined)
		{
			sData += '&tradename=' + interfaceMasterFormatSave($('#inputInterfaceMainContactBusinessName').val());
			sData += '&mailingaddress1=' + interfaceMasterFormatSave($('#inputInterfaceMainContactMailingAddress1').val());
			sData += '&mailingsuburb=' + interfaceMasterFormatSave($('#inputInterfaceMainContactMailingSuburb').val());
			sData += '&mailingstate=' + interfaceMasterFormatSave($('#inputInterfaceMainContactMailingState').val());
			sData += '&mailingpostcode=' + interfaceMasterFormatSave($('#inputInterfaceMainContactMailingPostCode').val());
			sData += '&mailingcountry=' + interfaceMasterFormatSave($('#inputInterfaceMainContactMailingCountry').val());
			sData += '&phonenumber=' + interfaceMasterFormatSave($('#inputInterfaceMainContactPhone').val());
			sData += '&faxnumber=' + interfaceMasterFormatSave($('#inputInterfaceMainContactFax').val());
		}
		else
		{
			sData += '&tradename=' + interfaceMasterinterfaceMasterFormatSave(onDemandXMLGetData(oRow, 'businessname'));
			sData += '&mailingaddress1=' + interfaceMasterinterfaceMasterFormatSave(onDemandXMLGetData(oRow, 'mailingaddress1'));
			sData += '&mailingsuburb=' + interfaceMasterinterfaceMasterFormatSave(onDemandXMLGetData(oRow, 'mailingsuburb'));
			sData += '&mailingstate=' + interfaceMasterinterfaceMasterFormatSave(onDemandXMLGetData(oRow, 'mailingstate'));
			sData += '&mailingpostcode=' + interfaceMasterinterfaceMasterFormatSave(onDemandXMLGetData(oRow, 'mailingpostcode'));
			sData += '&mailingcountry=' + interfaceMasterinterfaceMasterFormatSave(onDemandXMLGetData(oRow, 'mailingcountry'));
			sData += '&phonenumber=' + interfaceMasterinterfaceMasterFormatSave(onDemandXMLGetData(oRow, 'phone'));
		}
		
		sData += '&customerstatus=' + giObjectStatusProspect;
		
		if (iContactBusiness != '')	
		{
			sData += '&id=' + iContactBusiness;
			sSuccessMessage = 'updated';
		}
		else {sSuccessMessage = 'added'}

		interfaceMasterSave('/ondemand/contact/?' + sParam, sData, 'Prospect Business ' + sSuccessMessage + '.');
		if (glObjectSaveId != -1)
		{
			sReturn = glObjectSaveId;
			interfaceMasterSave('/ondemand/opportunity/?method=OPPORTUNITY_MANAGE'
								, '&id=' + giObjectContext + 
								  '&requestbybusiness=' + sReturn +
								  '&updatecontactid=1'
								, '' );
			
			if (sSuccessMessage == 'added')
			{
				giObjectContext = glObjectSaveId;
				sParam = '/ondemand/contact/?method=CONTACT_BUSINESS_GROUP_MANAGE';
				sData += '&contactbusiness=' + sReturn + '&group=' + giGroupBusinessClient;
				interfaceMasterSave(sParam, sData, '');
			}

		}
	}

	if ( $('#inputInterfaceMainContactSurname').val() != '' || onDemandXMLGetData(oRow, 'surname') != '' ) 
	{
		sParam = 'method=CONTACT_PERSON_MANAGE';
		iContactBusiness = (iContactBusiness == '' && sReturn != '')?sReturn:iContactBusiness;
		sData = (iContactBusiness != '')?'&contactbusiness=' + iContactBusiness + '&primarycontact=1':'';
		
		if ($('#inputInterfaceMainContactSurname').val() != undefined)
		{
			sData += '&firstname=' + interfaceMasterFormatSave($('#inputInterfaceMainContactFirstName').val());
			sData += '&surname=' + interfaceMasterFormatSave($('#inputInterfaceMainContactSurname').val());
			sData += '&jobtitle=' + interfaceMasterFormatSave($('#inputInterfaceMainContactJobTitle').val());
			sData += '&streetaddress1=' + interfaceMasterFormatSave($('#inputInterfaceMainContactStreetAddress1').val());
			sData += '&streetsuburb=' + interfaceMasterFormatSave($('#inputInterfaceMainContactStreetSuburb').val());
			sData += '&streetstate=' + interfaceMasterFormatSave($('#inputInterfaceMainContactStreetState').val());
			sData += '&streetpostcode=' + interfaceMasterFormatSave($('#inputInterfaceMainContactStreetPostCode').val());
			sData += '&streetcountry=' + interfaceMasterFormatSave($('#inputInterfaceMainContactStreetCountry').val());
			sData += '&mailingaddress1=' + interfaceMasterFormatSave($('#inputInterfaceMainContactMailingAddress1').val());
			sData += '&mailingsuburb=' + interfaceMasterFormatSave($('#inputInterfaceMainContactMailingSuburb').val());
			sData += '&mailingstate=' + interfaceMasterFormatSave($('#inputInterfaceMainContactMailingState').val());
			sData += '&mailingpostcode=' + interfaceMasterFormatSave($('#inputInterfaceMainContactMailingPostCode').val());
			sData += '&mailingcountry=' + interfaceMasterFormatSave($('#inputInterfaceMainContactMailingCountry').val());
			sData += '&phone=' + interfaceMasterFormatSave($('#inputInterfaceMainContactPhone').val());
			sData += '&mobile=' + interfaceMasterFormatSave($('#inputInterfaceMainContactMobile').val());
			sData += '&email=' + interfaceMasterFormatSave($('#inputInterfaceMainContactEmail').val());
			sData += '&faxnumber=' + interfaceMasterFormatSave($('#inputInterfaceMainContactFax').val());
		}
		else
		{
			sData += '&firstname=' + interfaceMasterFormatSave(goObjectContext.firstname);
			sData += '&surname=' + interfaceMasterFormatSave(goObjectContext.surname);
			sData += '&mailingaddress1=' + interfaceMasterFormatSave(goObjectContext.mailingaddress1);
			sData += '&mailingsuburb=' + interfaceMasterFormatSave(goObjectContext.mailingsuburb);
			sData += '&mailingstate=' + interfaceMasterFormatSave(goObjectContext.mailingstate);
			sData += '&mailingpostcode=' + interfaceMasterFormatSave(goObjectContext.mailingpostcode);
			sData += '&mailingcountry=' + interfaceMasterFormatSave(goObjectContext.mailingcountry);
			sData += '&phone=' + interfaceMasterFormatSave(goObjectContext.phone);
			sData += '&mobile=' + interfaceMasterFormatSave(goObjectContext.mobile);
			sData += '&email=' + interfaceMasterFormatSave(goObjectContext.email);
		}
		sData += '&customerstatus=' + giObjectStatusProspect;
		
		if (iContactPerson != '')	
		{
			sData += '&idt=' + iContactPerson;
			sSuccessMessage = 'updated';
		}
		else {sSuccessMessage = 'added'}
		
		interfaceMasterSave('/ondemand/contact/?' + sParam, sData, 'Prospect Contact ' + sSuccessMessage + '!');
		if (glObjectSaveId != -1)
		{
			sReturn = glObjectSaveId;
			interfaceMasterSave('/ondemand/opportunity/?method=OPPORTUNITY_MANAGE'
								, '&select=' + giObjectContext + 
								  '&requestbyperson=' + sReturn +
								  '&updatecontactid=1'
								, '' );
		}

	}

	if (sReturn != -1)
	{	interfaceOpportunitySearch('opportunity-' + giObjectContext);	}
	
}

function interfaceOpportunityViewProspect(asId)
{
	interfaceProspectMasterViewport();
	interfaceProspectSearch('prospectid-' + asId);
	
}

function interfaceOpportunityChangeProcessingStatus()
{

	var dDate = new Date();
	var dToday;
	dToday= dDate.format('d mmm yyyy');
	
	$('#interfaceMainDetailsProcessingStatusUpdate').show();
	$('#inputInterfaceMainDetailsNewProcessingDate').val(dToday);
	
	$('#tdInterfaceMainDetailsProcessingStatusButtonLabel').html('Cancel');
	$('#tdInterfaceMainDetailsProcessingStatusButtonLabel').bind('click', function() {
		interfaceOpportunityCancelOpportunityStatusUpdate();	
	});
	
	$('.interfaceMainOptionsSelectProcessingStatus').button( {
		text: false,
		icons: {
			primary: "ui-icon-circle-cancel"
		}
	})
	.click(function() {
		interfaceOpportunityCancelProcessingStatusUpdate();
	})
	.css('width', '15px')
	.css('height', '16px')
}

function interfaceOpportunityCancelProcessingStatusUpdate()
{
	$('#interfaceMainDetailsProcessingStatusUpdate').hide();

	$('#inputInterfaceMainDetailsNewProcessing').val('');
	$('#inputInterfaceMainDetailsNewProcessing').attr('onDemandID','');
	$('#inputInterfaceMainDetailsNewProcessingDate').val('');
	$('#inputInterfaceMainDetailsNewProcessingNote').val('');

	$('#tdInterfaceMainDetailsProcessingStatusButtonLabel').html('Update');
	$('#tdInterfaceMainDetailsProcessingStatusButtonLabel').bind('click', function() {
		 interfaceOpportunityChangeProcessingStatus();
	});
	
	$('.interfaceMainOptionsSelectProcessingStatus').button( {
		text: false,
		icons: {
			primary: "ui-icon-circle-plus"
		}
	})
	.click(function() {
		interfaceOpportunityChangeProcessingStatus();
	})
	.css('width', '15px')
	.css('height', '16px')
}

function GetCurrentContactStatus(oResponse, asContactType, aiContactId)
{
	if (oResponse == undefined) {oResponse = '';}
	if (asContactType == undefined) { asContactType = '';}
	if (aiContactId == undefined) {aiContactId = -1;}
	
	if (oResponse == '' || oResponse == undefined)
	{
		var oSearch = new AdvancedSearch();
		oSearch.method = 'CONTACT_' + asContactType.toUpperCase() + '_SEARCH';
		oSearch.addField( 'customerstatus');
		oSearch.addFilter('id', 'EQUAL_TO', aiContactId);
		oSearch.rf = 'json';
		oSearch.getResults(GetCurrentContactStatus) 
	}
	else
	{	
		if (oResponse.data.rows.length == 0)
		{
			giCurrentObjectStatus = oResponse.data.rows[0].customerstatus;
		}
		else
		{	giCurrentObjectStatus = -1;	}	
	}	
}

function interfaceOpportuntityProcessingStatus(aParam)
{

	var sFind;
	var iFind = -1;
	
	if (aParam != undefined)
	{
		if (aParam.find != undefined) {sFind = aParam.find}
	}	

	if (gaOpportuntityProcessingStatus == undefined)
	{
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/setup/?method=SETUP_OPPORTUNITY_PROCESSING_STATUS_SEARCH&rf=JSON',
			dataType: 'json',
			async: false,
			success: function(oJSON) {gaOpportuntityProcessingStatus = oJSON.data.rows}
		})
	}

	if (sFind != undefined)
	{
		$.each(gaOpportuntityProcessingStatus, function() {
			if (sFind.toUpperCase() == (this.title).toUpperCase()) {iFind = parseInt(this.id); return false}
		});
	}

	return iFind;
}
