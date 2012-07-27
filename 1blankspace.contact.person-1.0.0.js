var glContactBusiness = '';
var gsContactBusinessText = '';
var gsContactPersonText = '';

$(function()
{
})

function interfaceContactPersonMasterViewport(aParam)
{
	giObject = 32;	
	gsObjectName = 'Person';
	goObjectContext = undefined;
	giObjectContext = -1;
	
	var bShowHome = true;
	var bNew = false;
	
	if (aParam != undefined)
	{
		if (aParam.showHome != undefined) {bShowHome = aParam.showHome}
		if (aParam.showNew != undefined) {bNew = aParam.showNew}
		if (aParam.contactBusiness != undefined) {glContactBusiness = aParam.contactBusiness}
		if (aParam.contactBusinessText != undefined) {gsContactBusinessText = aParam.contactBusinessText}
		if (bNew) {interfaceContactPersonNew()};
	}	
			
	interfaceMasterReset();
	
	if (bShowHome)
	{
		interfaceMasterViewportDestination({
			newDestination: 'interfaceContactPersonMasterViewport({showHome: true});',
			move: false
			})		
	}
	
	$('#divInterfaceMasterViewportControlSet').button(
	{
		label: "People"
	});
	
	$('#inputInterfaceMasterViewportControlSearch').keyup(function(event)
	{
		if (giKeyPressTimeoutId != 0) {clearTimeout(giKeyPressTimeoutId)};
        giKeyPressTimeoutId = setTimeout("interfaceContactPersonSearch('inputInterfaceMasterViewportControlSearch')", giWaitForStop);
	});
	
	$('#spanInterfaceMasterViewportControlSearch').click(function(event)
	{
		interfaceContactPersonSearch('inputInterfaceMasterViewportControlSearch');
	});
	
	$('#spanInterfaceMasterViewportControlSearchOptions').click(function(event)
	{
		interfaceContactPersonSearchOptions();
	});
	
	$('#spanInterfaceMasterViewportControlNew').click(function(event)
	{
		interfaceContactPersonNew();
	})
	
	$('#spanInterfaceMasterViewportControlNewOptions').click(function(event)
	{
		interfaceContactPersonNewOptions();
	});
	
	$('#spanInterfaceMasterViewportControlAction').click(function(event)
	{
		interfaceContactPersonSave();
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
		
	$('#spanInterfaceMasterViewportControlSetupOptions').click(function(event)
	{
		interfaceContactPersonSetupOptions();
	});
	
	$('#spanInterfaceMasterViewportControlHelpOptions').click(function(event)
	{
		interfaceContactPersonHelp();
	});
	
	$('td.interfaceViewportMasterControlBrowse').click(function(event)
	{
		interfaceContactPersonSearch(event.target.id, {source: giSearchSource_BROWSE});
	});
	
	$('td.interfaceViewportMasterControlBrowseAll').click(function(event)
	{
		interfaceContactPersonSearch(event.target.id, {source: giSearchSource_BROWSE});
	});
	
	$('#divInterfaceViewportControl').html('');	
	if (gbSetFocus) {$('#inputInterfaceMasterViewportControlSearch').focus()};
	if (bNew) 
	{
		interfaceContactPersonNew();
	}
	else
	{
		if (bShowHome) {interfaceContactPersonHomeShow()};
	}
}

function interfaceContactPersonHomeShow(oResponse)
{
	if (oResponse == undefined)
	{
		var aHTML = [];
		var h = -1;
					
		aHTML[++h] = '<table id="tableInterfaceViewportMain" class="interfaceViewportMain">';
		aHTML[++h] = '<tr id="trInterfaceViewportMain" class="interfaceViewportMain">' +
						'<td id="tdInterfaceProjectHomeMostLikely" class="interfaceViewportMain">' +
						gsLoadingXHTML + 
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMain').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
					
		aHTML[++h] = '<table>';
		aHTML[++h] = '<tr>' +
						'<td id="interfaceMasterViewportContactLarge" class="interfaceMasterViewportImageLarge">' +
						'&nbsp;' + 
						'</td>' +
						'</tr>';
				
		aHTML[++h] = '<tr id="trInterfaceViewportControl2" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlFavourites" class="interfaceViewportControl">Favourites</td>' +
					'</tr>';			
				
		aHTML[++h] = '<tr id="trInterfaceViewportControl3" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlByGroup" class="interfaceViewportControl">Groups</td>' +
					'</tr>';	
					
		aHTML[++h] = '</table>';		
		
		$('#divInterfaceViewportControl').html(aHTML.join(''));	
		
		$('#tdInterfaceViewportControlByGroup').click(function(event)
		{
			interfaceMasterMainViewportShow("#divInterfaceMain", true);
			interfaceContactPersonByGroup("divInterfaceMain");
		});
			
		$('#tdInterfaceViewportControlFavourites').click(function(event)
		{
			interfaceMasterMainViewportShow("#divInterfaceMain", true);
			interfaceContactFavourites({xhtmlElementID: "divInterfaceMain"});
		});
		
		$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
		
		var oSearch = new AdvancedSearch();
		oSearch.endPoint = 'contact';
		oSearch.method = 'CONTACT_PERSON_SEARCH';
		
		oSearch.addField('firstname,surname');
		
		//Could add a switch to show the users favourites only
		//oSearch.addFilter('', 'IS_FAVOURITE', '');
		
		oSearch.async = false;
		oSearch.rf = 'json';
		oSearch.rows = 10;
		oSearch.sort('modifieddate', 'desc');
		
		oSearch.getResults(interfaceContactPersonHomeShow);
		
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableInterfaceContactPersonHomeMostLikely">';
			aHTML[++h] = '<tr class="trInterfaceProjectHomeMostLikely">';
			aHTML[++h] = '<td class="tdInterfaceProjectHomeMostLikelyNothing">Click New to create a person contact.</td>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</table>';
		}
		else
		{
			aHTML[++h] = '<table id="tableInterfaceContactPersonHomeMostLikely">';
			aHTML[++h] = '<tr>';
			aHTML[++h] = '<td class="interfaceMain">MOST LIKELY</td>';
			aHTML[++h] = '</tr>';

			$.each(oResponse.data.rows, function()
			{
				aHTML[++h] = '<tr class="interfaceMainRow">';
				
				aHTML[++h] = '<td id="interfaceProjectHomeMostLikely_Title-' + this.id + 
										'" class="interfaceHomeMostLikely">' +
										this.firstname + ' ' +
										this.surname +
										'</td>';
				
				aHTML[++h] = '</tr>'
			});
			
			aHTML[++h] = '</tbody></table>';
		}
		
		$('#tdInterfaceProjectHomeMostLikely').html(aHTML.join(''));
	
		$('td.interfaceHomeMostLikely').click(function(event)
		{
			interfaceContactPersonSearch(event.target.id, {source: 1});
		});
	}
}

function interfaceContactPersonSearch(sXHTMLElementId, aParam)
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
		
		giObjectContext = sSearchContext;
		
		var oSearch = new AdvancedSearch();
		oSearch.endPoint = 'contact';
		oSearch.method = 'CONTACT_PERSON_SEARCH';
		oSearch.addField('firstname,surname,contactbusiness,contactbusinesstext,title,titletext,position,workphone,fax,mobile,email,' +
								 'customerstatus,customerstatustext,primarycontactfor,gender,gendertext,' +
								 'streetaddress1,streetaddress2,streetsuburb,streetstate,streetpostcode,streetcountry,' +
								 'mailingaddress1,mailingaddress2,mailingsuburb,mailingstate,mailingpostcode,mailingcountry');
		oSearch.addFilter('id', 'EQUAL_TO', sSearchContext);
		oSearch.rf = 'json';
		oSearch.getResults(function(data) {interfaceContactPersonShow(aParam, data)});
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
			
			var oSearch = new AdvancedSearch();
			oSearch.endPoint = 'contact';
			oSearch.method = 'CONTACT_PERSON_SEARCH';
			oSearch.addField('firstname,surname');
			
			if (iSource == giSearchSource_BROWSE)
			{
				oSearch.addFilter('quicksearch', 'STRING_STARTS_WITH', sSearchText);
			}
			else
			{	
				oSearch.addFilter('quicksearch', 'STRING_IS_LIKE', sSearchText);
			}	
			
			oSearch.rows = 15;
			oSearch.rf = 'json';
			oSearch.getResults(function(data) {interfaceContactPersonSearchShow(aParam, data)});
		}
	};	
}

function interfaceContactPersonSearchShow(aParam, oResponse)
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
			
			aHTML[++h] = '<td class="interfaceSearch" id="contactperson' +
							'-' + this.id + '">' +
							this.firstname + 
							'</td>';
			
			aHTML[++h] = '<td class="interfaceSearch" id="contactperson' +
							'-' + this.id + '">' +
							this.surname + '</td>';
							
			if (iColumn == iMaximumColumns)
			{
				aHTML[++h] = '</tr>'
				iColumn = 0;
			}	
		});
    	
		aHTML[++h] = '</tbody></table>';
		
		$('#divInterfaceMasterViewportControlOptions').html(
			interfaceMasterPagination(
			{
				html: aHTML.join(''),
				more: (oResponse.morerows == "true")
			}) 
		);		
		
		$('#divInterfaceMasterViewportControlOptions').show(giShowSpeedOptions);
		
		interfaceMasterSearchStop();
		
		$('td.interfaceSearch').click(function(event)
		{
			$('#divInterfaceMasterViewportControlOptions').html('&nbsp;');
			$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions)
			interfaceContactPersonSearch(event.target.id, {source: 1});
		});
		
		interfaceMasterPaginationBind(
		{
			columns: 'firstname-surname',
			more: oResponse.moreid,
			rows: 15,
			startRow: parseInt($(oRoot).attr('startrow')) + parseInt($(oRoot).attr('rows')),
			functionSearch: interfaceContactPersonSearch
		});   
		
	}	
}

function interfaceContactPersonViewport()
{
	
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceViewportControlContext" class="interfaceViewportControlContext"></div>';
	
	aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
	
	if (giObjectContext == -1)
	{
		aHTML[++h] = '<tr id="trInterfaceViewportControl2" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlDetails" class="interfaceViewportControl interfaceViewportControlHighlight">Details</td>' +
						'</tr>';
						
		aHTML[++h] = '<tr id="trInterfaceViewportControl3" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlAddress" class="interfaceViewportControl">Address</td>' +
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
					
		aHTML[++h] = '<tr id="trInterfaceViewportControl3" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlAddress" class="interfaceViewportControl">Address</td>' +
						'</tr>';
	
		aHTML[++h] = '</table>';					
	
		aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
	
		aHTML[++h] = '<tr id="trInterfaceViewportControl" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlGroups" class="interfaceViewportControl">Groups</td>' +
						'</tr>';
					
		aHTML[++h] = '</table>';				
	
		aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
	
		aHTML[++h] = '<tr id="trInterfaceViewportControl" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlBusiness" class="interfaceViewportControl">Business</td>' +
						'</tr>';
					
		aHTML[++h] = '</table>';		
	
		aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
	
		aHTML[++h] = '<tr id="trInterfaceViewportControl" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlActions" class="interfaceViewportControl">Actions</td>' +
						'</tr>';
					
		aHTML[++h] = '<tr id="trInterfaceViewportControl" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlAttachments" class="interfaceViewportControl">Attachments</td>' +
						'</tr>';
	}
			
	aHTML[++h] = '</table>';					
		
	$('#divInterfaceViewportControl').html(aHTML.join(''));
	
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceMainSummary" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainDetails" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainAddress" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainUser" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainGroups" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainBusiness" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainActions" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainAttachments" class="divInterfaceViewportMain"></div>';
	
	$('#divInterfaceMain').html(aHTML.join(''));
	
	$('#tdInterfaceViewportControlSummary').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainSummary");
		interfaceContactPersonSummary();
	});
	
	$('#tdInterfaceViewportControlDetails').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainDetails");
		interfaceContactPersonDetails();
	});
	
	
	$('#tdInterfaceViewportControlAddress').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainAddress");
		interfaceContactPersonAddress();
	});
	
	$('#tdInterfaceViewportControlUser').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainUser", true);
		interfaceContactPersonUser();
	});
	
	$('#tdInterfaceViewportControlGroups').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainGroups", true);
		interfaceContactPersonGroups();
	});
	
	$('#tdInterfaceViewportControlBusiness').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainBusiness", true);
		interfaceContactPersonBusiness();
	});
	
	$('#tdInterfaceViewportControlActions').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainActions", true);
		
		if ($('#inputInterfaceMainDetailsFirstName').val() != undefined)
		{
			gsContactPersonText = $('#inputInterfaceMainDetailsFirstName').val() + ' ' + $('#inputInterfaceMainDetailsSurname').val();
		}
		
		interfaceMasterActions({
							xhtmlElementID: 'divInterfaceMainActions',
							contactPerson: giObjectContext, 
							contactPersonText: gsContactPersonText,
							contactBusiness: glContactBusiness, 
							contactBusinessText: gsContactBusinessText,
							object: '',
							objectContext: ''
							});
	});
	
	$('#tdInterfaceViewportControlAttachments').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainAttachments", true);
		interfaceMasterAttachments({xhtmlElementID: 'divInterfaceMainAttachments'});
	});
	
}

function interfaceContactPersonShow(aParam, oResponse)
{
	$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
	interfaceContactPersonViewport();
	
	var aHTML = [];
	var h = -1;
	
	if (oResponse.data.rows.length == 0)
	{
		goObjectContext = undefined;
		
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find contact person.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		goObjectContext = oResponse.data.rows[0];
		
		glContactBusiness = goObjectContext.contactbusiness;
		gsContactBusinessText = goObjectContext.contactbusinesstext
		gsContactPersonText = goObjectContext.firstname + ' ' + goObjectContext.surname;
		
		$('#divInterfaceViewportControlContext').html(goObjectContext.firstname + 
					'<br />' + goObjectContext.surname);
		$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
		$('#spanInterfaceMasterViewportControlActionOptions').button({disabled: false});
		
		interfaceMasterViewportDestination({
			newDestination: 'interfaceContactPersonMasterViewport({showHome: false});interfaceContactPersonSearch("-' + giObjectContext + '")',
			move: false
			})
		
		interfaceMasterObjectViewportHistory({functionDefault: 'interfaceContactPersonSummary()'})
	}	
}		
		
function interfaceContactPersonSummary()
{
	var aHTML = [];
	var h = -1;
	
	if (goObjectContext == undefined)
	{
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find this contact.</td></tr>';
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
		
		if (goObjectContext.workphone != '')
		{
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryPhone" class="interfaceMainSummary">Phone</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryPhoneValue" class="interfaceMainSummaryValue">' +
						goObjectContext.workphone +
						'</td></tr>';
		}

		if (goObjectContext.mobile != '')
		{
			aHTML[++h] =  '<tr><td id="tdInterfaceMainSummaryMobile" class="interfaceMainSummary">Mobile</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryMobileValue" class="interfaceMainSummaryValue">' +
						goObjectContext.mobile +
						'</td>' +
						'</tr>';
		}				
		
		if (goObjectContext.email != '')
		{
			aHTML[++h] =  '<tr><td id="tdInterfaceMainSummaryEmail" class="interfaceMainSummary">Email</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryEmailValue" class="interfaceMainSummaryValue">' +
						goObjectContext.email +
						'</td>' +
						'</tr>';
		}				
				
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn1Large').html(aHTML.join(''));

		var aHTML = [];
		var h = -1;	
		
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMainColumn2Action">';
								
		/* aHTML[++h] = '<tr><td id="tdInterfaceMainSummarySendEmail" class="interfaceMainSummary">' +
						'<a class="linkedin-profileinsider-popup" href="http://www.linkedin.com/in/">LinkedIn</a>' +
						'</td></tr>'; */
	 
	 	/* aHTML[++h] = '<tr><td id="tdInterfaceMainSummarySignUpUser" class="interfaceMainColumn2Action">' +
						'<a href="#" id="aInterfaceMainSummarySignUpUser">Set&nbsp;up&nbsp;logon</a>' +
						'</td></tr>'; */
		
		/* aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryPDF" class="interfaceMainColumn2Action">' +
						 '<a href="#" id="aInterfaceMainSummaryPDF">PDF</a>' +
						'</td></tr>'; */
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn2Action').html(aHTML.join(''));	
		
		/* $('#aInterfaceMainSummarySendEmail').click(function(event)
		{
			interfaceContactPersonSendEmail();
		});
		
		$('#aInterfaceMainSummarySignUpUser').click(function(event)
		{
			interfaceMasterMainViewportShow("#divInterfaceMainUser", true);
			interfaceContactPersonUser();
		});
	 
		$('#aInterfaceMainSummaryPDF').click(function(event)
		{
			interfaceContactPersonPDF();
		}); */
	 
	}	
}

function interfaceContactPersonDetails()
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
						
		aHTML[++h] = '<tr id="trInterfaceMainDetailsTitle" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsTitle" class="interfaceMain">' +
						'Title' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsTitleValue" class="interfaceMainSelect">' +
						'<td id="tdInterfaceMainDetailsTitleValue" class="interfaceMainSelect">' +
						'<input id="inputInterfaceMainDetailsTitle" class="inputInterfaceMainSelect"' +
							' onDemandMethod="SETUP_CONTACT_TITLE_SEARCH">' +
						'</td></tr>';							
						
		aHTML[++h] = '<tr id="trInterfaceMainDetailsPosition" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsPosition" class="interfaceMain">' +
						'Position' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsPositionValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsPositionValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainDetailsPosition" class="inputInterfaceMainText">' +
						'</td></tr>';

		aHTML[++h] = '<tr id="trInterfaceMainDetailsPhone" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsPhone" class="interfaceMain">' +
						'Phone' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsPhoneValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsPhoneValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainDetailsPhone" class="inputInterfaceMainText">' +
						'</td></tr>';

		aHTML[++h] = '<tr id="trInterfaceMainDetailsMobile" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsMobile" class="interfaceMain">' +
						'Mobile' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsMobileValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsMobileValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainDetailsMobile" class="inputInterfaceMainText">' +
						'</td></tr>';

		aHTML[++h] = '<tr id="trInterfaceMainDetailsFax" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsFax" class="interfaceMain">' +
						'Fax' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsFaxValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsFaxValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainDetailsFax" class="inputInterfaceMainText">' +
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
		
		$('#tdInterfaceMainDetailsColumn1').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
			
		aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn2" class="interfaceMain">';
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsDescription" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsDescription" class="interfaceMain">' +
						'Description / Notes' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsDescriptionValue" class="interfaceMainTextMulti">' +
						'<td id="tdInterfaceMainDetailsDescriptionValue" class="interfaceMainTextMulti">' +
						'<textarea rows="10" cols="35" id="inputInterfaceMainDetailsDescription" class="inputInterfaceMainTextMulti"></textarea>' +
						'</td></tr>';
		
		aHTML[++h] = '</table>';					
			
		$('#tdInterfaceMainDetailsColumn2').html(aHTML.join(''));

		if (goObjectContext != undefined)
		{
			$('#inputInterfaceMainDetailsFirstName').val(goObjectContext.firstname);
			$('#inputInterfaceMainDetailsSurname').val(goObjectContext.surname);
			$('#inputInterfaceMainDetailsTitle').attr('onDemandID', goObjectContext.title);
			$('#inputInterfaceMainDetailsTitle').val(goObjectContext.titletext);
			$('#inputInterfaceMainDetailsPosition').val(goObjectContext.position);
			$('#inputInterfaceMainDetailsPhone').val(goObjectContext.workphone);
			$('#inputInterfaceMainDetailsMobile').val(goObjectContext.mobile);
			$('#inputInterfaceMainDetailsFax').val(goObjectContext.fax);
			$('#inputInterfaceMainDetailsEmail').val(goObjectContext.email);
		}
		
		$('#inputInterfaceMainDetailsTitle').keyup(function(event)
		{
			$('#divInterfaceMasterViewportControlOptions').hide(200);
			interfaceMasterElementOptionsSearch(event.target.id);
		});
	}	
}

function interfaceContactPersonAddress()
{

	var aHTML = [];
	var h = -1;
	
	if ($('#divInterfaceMainAddress').attr('onDemandLoading') == '1')
	{
		$('#divInterfaceMainAddress').attr('onDemandLoading', '');
			
		aHTML[++h] = '<table id="tableInterfaceMainAddress" class="interfaceMain">';
		aHTML[++h] = '<tr id="trInterfaceMainAddressRow1" class="interfaceMain">' +
						'<td id="tdInterfaceMainAddressColumn1" class="interfaceMain">' +
						'</td>' +
						'<td id="tdInterfaceMainAddressColumn2" class="interfaceMain">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMainAddress').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMain">';
		
		aHTML[++h] = '<tr id="trInterfaceMainAddressStreet" class="interfaceMainSectionLabel">' +
						'<td id="tdInterfaceMainAddressStreet" class="interfaceMainSectionLabel">' +
						'Street' +
						'</td></tr>';
				
		aHTML[++h] = '<tr id="trInterfaceMainAddressStreetAddress1" class="interfaceMain">' +
						'<td id="tdInterfaceMainAddressStreetAddress1" class="interfaceMain">' +
						'Address' +
						'</td></tr>' +
						'<tr id="trInterfaceMainAddressStreetAddress1Value" class="interfaceMainText">' +
						'<td id="tdInterfaceMainAddressStreetAddress1Value" class="interfaceMainText">' +
						'<input onDemandType="TEXT" id="inputInterfaceMainAddressStreetAddress1" class="inputInterfaceMainText">' +
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceMainAddressStreetSuburb" class="interfaceMain">' +
						'<td id="tdInterfaceMainAddressStreetSuburb" class="interfaceMain">' +
						'Suburb' +
						'</td></tr>' +
						'<tr id="trInterfaceMainAddressStreetSuburbValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainAddressStreetSuburbValue" class="interfaceMainText">' +
						'<input onDemandType="TEXT" id="inputInterfaceMainAddressStreetSuburb" class="inputInterfaceMainText">' +
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceMainAddressStreetState" class="interfaceMain">' +
						'<td id="tdInterfaceMainAddressStreetState" class="interfaceMain">' +
						'State' +
						'</td></tr>' +
						'<tr id="trInterfaceMainAddressStreetStateValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainAddressStreetStateValue" class="interfaceMainText">' +
						'<input onDemandType="TEXT" id="inputInterfaceMainAddressStreetState" class="inputInterfaceMainText">' +
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceMainAddressStreetPostCode" class="interfaceMain">' +
						'<td id="tdInterfaceMainAddressStreetPostCode" class="interfaceMain">' +
						'Post Code' +
						'</td></tr>' +
						'<tr id="trInterfaceMainAddressStreetPostCodeValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainAddressStreetPostCodeValue" class="interfaceMainText">' +
						'<input onDemandType="TEXT" id="inputInterfaceMainAddressStreetPostCode" class="inputInterfaceMainText">' +
						'</td></tr>';				
						
		aHTML[++h] = '<tr id="trInterfaceMainAddressStreetCountry" class="interfaceMain">' +
						'<td id="tdInterfaceMainAddressStreetCountry" class="interfaceMain">' +
						'Country' +
						'</td></tr>' +
						'<tr id="trInterfaceMainAddressStreetCountryValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainAddressStreetCountryValue" class="interfaceMainText">' +
						'<input onDemandType="TEXT" id="inputInterfaceMainAddressStreetCountry" class="inputInterfaceMainText">' +
						'</td></tr>';						
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainAddressColumn1').html(aHTML.join(''));

		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMain">';
		
		aHTML[++h] = '<tr id="trInterfaceMainAddressMailing" class="interfaceMainSectionLabel">' +
						'<td id="tdInterfaceMainAddressMailing" class="interfaceMainSectionLabel">' +
						'Mailing' +
						'</td></tr>';
				
		aHTML[++h] = '<tr id="trInterfaceMainAddressMailingAddress1" class="interfaceMain">' +
						'<td id="tdInterfaceMainAddressMailingAddress1" class="interfaceMain">' +
						'Address' +
						'</td></tr>' +
						'<tr id="trInterfaceMainAddressMailingAddress1Value" class="interfaceMainText">' +
						'<td id="tdInterfaceMainAddressMailingAddress1Value" class="interfaceMainText">' +
						'<input onDemandType="TEXT" id="inputInterfaceMainAddressStreetAddress1" class="inputInterfaceMainText">' +
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceMainAddressMailingSuburb" class="interfaceMain">' +
						'<td id="tdInterfaceMainAddressMailingSuburb" class="interfaceMain">' +
						'Suburb' +
						'</td></tr>' +
						'<tr id="trInterfaceMainAddressMailingSuburbValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainAddressMailingSuburbValue" class="interfaceMainText">' +
						'<input onDemandType="TEXT" id="inputInterfaceMainAddressMailingSuburb" class="inputInterfaceMainText">' +
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceMainAddressMailingState" class="interfaceMain">' +
						'<td id="tdInterfaceMainAddressMailingState" class="interfaceMain">' +
						'State' +
						'</td></tr>' +
						'<tr id="trInterfaceMainAddressMailingStateValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainAddressMailingStateValue" class="interfaceMainText">' +
						'<input onDemandType="TEXT" id="inputInterfaceMainAddressMailingState" class="inputInterfaceMainText">' +
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceMainAddressMailingPostCode" class="interfaceMain">' +
						'<td id="tdInterfaceMainAddressMailingPostCode" class="interfaceMain">' +
						'Post Code' +
						'</td></tr>' +
						'<tr id="trInterfaceMainAddressMailingPostCodeValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainAddressMailingPostCodeValue" class="interfaceMainText">' +
						'<input onDemandType="TEXT" id="inputInterfaceMainAddressMailingPostCode" class="inputInterfaceMainText">' +
						'</td></tr>';				
						
		aHTML[++h] = '<tr id="trInterfaceMainAddressMailingCountry" class="interfaceMain">' +
						'<td id="tdInterfaceMainAddressMailingCountry" class="interfaceMain">' +
						'Country' +
						'</td></tr>' +
						'<tr id="trInterfaceMainAddressMailingCountryValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainAddressMailingCountryValue" class="interfaceMainText">' +
						'<input onDemandType="TEXT" id="inputInterfaceMainAddressMailingCountry" class="inputInterfaceMainText">' +
						'</td></tr>';						
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainAddressColumn2').html(aHTML.join(''));
		
		if (goObjectContext != undefined)
		{
			$('#inputInterfaceMainAddressStreetAddress1').val(goObjectContext.streetaddress1);
			$('#inputInterfaceMainAddressStreetSuburb').val(goObjectContext.streetsuburb);
			$('#inputInterfaceMainAddressStreetState').val(goObjectContext.streetstate);
			$('#inputInterfaceMainAddressStreetPostCode').val(goObjectContext.streetpostcode);
			$('#inputInterfaceMainAddressStreetCountry').val(goObjectContext.streetcountry);
			$('#inputInterfaceMainAddressMailingAddress1').val(goObjectContext.mailingaddress1);
			$('#inputInterfaceMainAddressMailingSuburb').val(goObjectContext.mailingsuburb);
			$('#inputInterfaceMainAddressMailingState').val(goObjectContext.mailingstate);
			$('#inputInterfaceMainAddressMailingPostCode').val(goObjectContext.mailingpostcode);
			$('#inputInterfaceMainAddressMailingCountry').val(goObjectContext.mailingcountry);
		}
	}	
}

function interfaceContactPersonBusiness()
{
	var aHTML = [];
	var h = -1;
	
	if ($('#divInterfaceMainBusiness').attr('onDemandLoading') == '1')
	{
		$('#divInterfaceMainBusiness').attr('onDemandLoading', '');
		
		aHTML[++h] = '<table id="tableInterfaceMainBusiness" class="interfaceMain">';
		aHTML[++h] = '<tr id="trInterfaceMainBusinessRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainBusinessColumn1Large" class="interfaceMainColumn1Large">' +
						'</td>' +
						'<td id="tdInterfaceMainBusinessColumn2Action" style="width:100px;">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';				
		
		$('#divInterfaceMainBusiness').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn1" class="interfaceMain">';
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsContactBusiness" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsContactBusiness" class="interfaceMain">' +
						'Trading Name' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsContactBusinessValue" class="interfaceMainSelect">' +
						'<td id="tdInterfaceMainDetailsContactBusinessValue" class="interfaceMainSelect">' +
						'<input onDemandType="SELECT" id="inputInterfaceMainDetailsContactBusiness" class="inputInterfaceMainSelect"' +
							' onDemandMethod="/ondemand/contact/?rf=XML&method=CONTACT_BUSINESS_SEARCH"' +
							' onDemandColumns="tradename">' +
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceMainDetailsBusinessSummary" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsBusinessSummary" class="interfaceMain">' +
						'</td></tr>';
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainBusinessColumn1Large').html(aHTML.join(''));
	
		if (goObjectContext != undefined)
		{
			$('#inputInterfaceMainDetailsContactBusiness').attr('onDemandID', goObjectContext.contactbusiness);
			$('#inputInterfaceMainDetailsContactBusiness').val(goObjectContext.contactbusinesstext);
		}
		else
		{
			$('#inputInterfaceMainDetailsContactBusiness').attr('onDemandID', glContactBusiness);
			$('#inputInterfaceMainDetailsContactBusiness').val(gsContactBusinessText);
		}
		
		var aHTML = [];
		var h = -1;	
		
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMainColumn2Action">';
			
		if (goObjectContext.contactbusiness != '')
		{	
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryViewContactBusiness" class="interfaceMainColumn2Action">' +
						'<a href="#" id="aInterfaceMainSummaryViewContactBusiness">View&nbsp;Business</a>' +
						'</td></tr>';
		}
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainBusinessColumn2Action').html(aHTML.join(''));	
		
		$('#aInterfaceMainSummaryViewContactBusiness').click(function(event)
		{
			interfaceContactBusinessMasterViewport({showHome: false});
			interfaceContactBusinessSearch('-' + goObjectContext.contactbusiness, {source: 1});
		});
	}	
}


function interfaceContactPersonSave()
{

	var sParam = 'method=CONTACT_PERSON_MANAGE'
	var sData = 'id=';
	
	if (giObjectContext != -1)
	{
		sData += giObjectContext;
	} 
	
	if ($('#divInterfaceMainDetails').html() != '')
	{
		sData += '&firstname=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsFirstName').val());
		sData += '&surname=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsSurname').val());
		sData += '&title=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsTitle').attr('onDemandID'));
		sData += '&jobtitle=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsPosition').val());
		sData += '&phone=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsPhone').val());
		sData += '&fax=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsFax').val());
		sData += '&mobile=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsMobile').val());
		sData += '&email=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsEmail').val());
		sData += '&notes=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsDescription').val());
	}
	
	if ($('#divInterfaceMainAddress').html() != '')
	{
		sData += '&streetaddress1=' + $('#inputInterfaceMainAddressStreetAddress1').val();
		sData += '&streetsuburb=' + $('#inputInterfaceMainAddressStreetSuburb').val();
		sData += '&streetstate=' + $('#inputInterfaceMainAddressStreetState').val();
		sData += '&streetpostcode=' + $('#inputInterfaceMainAddressStreetPostCode').val();
		sData += '&streetcountry=' + $('#inputInterfaceMainAddressStreetCountry').val();
		sData += '&mailingaddress1=' + $('#inputInterfaceMainAddressMailingAddress1').val();
		sData += '&mailingsuburb=' + $('#inputInterfaceMainAddressMailingSuburb').val();
		sData += '&mailingstate=' + $('#inputInterfaceMainAddressMailingState').val();
		sData += '&mailingpostcode=' + $('#inputInterfaceMainAddressMailingPostCode').val();
		sData += '&mailingcountry=' + $('#inputInterfaceMainAddressMailingCountry').val();
	}
	
	$.ajax(
	{
		type: 'POST',
		url: '/ondemand/contact/?' + sParam,
		data: sData,
		dataType: 'json',
		success: interfaceContactPersonSaveProcess
	});
		
}

function interfaceContactPersonSaveProcess(oResponse)
{	
	if (oResponse.status == 'OK')
	{
		interfaceMasterStatus('Saved');
		if (giObjectContext == -1) {var bNew = true}
		giObjectContext = oResponse.id;	
		
		if (bNew) {interfaceContactPersonSearch('-' + giObjectContext)}
	}
	else
	{
		interfaceMasterStatus(oResponse.error.errornotes);
		interfaceMasterConfirm( {html: [oResponse.error.errornotes]
								   , title: 'Save error!'});
	}
}

function interfaceContactPersonUser(aParam, oXML)
{

	var iObject = giObject;
	var iObjectContext = giObjectContext;
	
	if (aParam != undefined)
	{
		if (aParam.object != undefined || iObject == '') {iObject = aParam.object}
		if (aParam.objectName != undefined) {sObjectName = aParam.objectName}
	}

	if (oXML == undefined)
	{
		var sParam = 'method=SETUP_USER_SEARCH';
		var sData = 'contactperson=' + iObjectContext;
	
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/setup/?rf=json&' + sParam,
			dataType: 'json',
			data: sData,
			success: function(data) {interfaceContactPersonUser(aParam, data)}
		});

	}
	else
	{	
		var aHTML = [];
		var h = -1;
	
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMain">';
				
			var sUserName = oResponse.username;
			sUserName = sUserName.replace('@' + msOnDemandSiteId, '');
			
			aHTML[++h] = '<tr id="trInterfaceMainDetailsRegistrationImport" class="interfaceMainTextMulti">' +
						'<td id="tdInterfaceMainDetailsRegistrationImport" class="interfaceMainTextMulti">' +
						'This person already has access as ' +
						sUserName;
						
			if (oResponse.lastlogondatetime != '&nbsp;')
			{	
				aHTML[++h] = ' and last logged on ' +
						oResponse.lastlogondatetime +
						'.</td></tr>';
			}
			else
			{
				aHTML[++h] = '.</td></tr>';
			}	
						
			aHTML[++h] = '</table>';					
		
			$('#divInterfaceMainUser').html(aHTML.join(''));
		}
		else
		{
		
			var aHTML = [];
			var h = -1;

			aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMain">';
					
			aHTML[++h] = '<tr id="trInterfaceMainUserRegister" class="interfaceMainTextMulti">' +
							'<td id="tdInterfaceMainUserRegister" class="interfaceMainTextMulti">' +
							'<span id="spanInterfaceMainUserRegister">Register As User Now</span>' +
							'</td></tr>';
							
			aHTML[++h] = '</table>';					
			
			$('#divInterfaceMainUser').html(aHTML.join(''));
			
			$('#spanInterfaceMainUserRegister').button(
			{
				text: "Register As User Now"
			})
			.click(function() {
				interfaceContactPersonUserRegister();
			});
		}
	}
}	

function interfaceContactPersonUserRegister(sResponse)
{

	if (sResponse == undefined)
	{

		$('#divInterfaceMainUser').html(gsLoadingXHTML);
		
		var sParam = 'method=REGISTER_ADD_USER';
		sParam += '&site=' + msOnDemandSiteId;
		
		var sData = 'ContactPersonperson=' + giObjectContext;
		//sData += '&ContactPersonbusiness=' + aResponse[4];
		sData += '&uselogonsuffix=1&logonsuffix=' + encodeURIComponent('@' + msOnDemandSiteId);
		sData += '&networkgroup=' + glNetworkGroupId; 
		
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/register/?' + sParam,
			data: sData,
			dataType: 'text',
			success: interfaceContactPersonUserRegister
		});
	}		
	else
	{
		//NEED TO CONVRT TO JSON
		var aResponse = sResponse.split('|');
		
		var aHTML = [];
		var h = -1;

		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMain">';
				
		var sUserName = aResponse[2];
		sUserName = sUserName.replace('@' + msOnDemandSiteId, '');
			
		aHTML[++h] = '<tr id="trInterfaceMainUserRegister" class="interfaceMainTextMulti">' +
						'<td id="tdInterfaceMainUserRegister" class="interfaceMainTextMulti">' +
						'User set up as ' +
						sUserName +
						' with initial password of ' +
						aResponse[3] +
						'.</td></tr>';
						
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMainUser').html(aHTML.join(''));
	}	
}	

function interfaceContactPersonGroups(aParam, oResponse)
{
	
	var sXHTMLElementID = 'divInterfaceMainGroups';
	var sLabel = "groups";
	var iOption = 1;
	
	if (aParam != undefined)
	{
		if (aParam.label != undefined) {sLabel = aParam.label}
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
	}

	if (oResponse == undefined)
	{
		var oSearch = new AdvancedSearch();
		oSearch.method = 'CONTACT_PERSON_GROUP_SEARCH';
		oSearch.addField('contactperson,contactpersontext,group,grouptext');
		oSearch.addFilter('contactperson', 'EQUAL_TO', giObjectContext);
		oSearch.rows = 100;
		oSearch.sort('grouptext', 'asc');
		oSearch.getResults(function(data) {interfaceContactPersonGroups(aParam, data)});
	}
	else
	{
	
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableInterfaceMainContactPersonGroups" class="interfaceMain">' +
					'<tr id="trInterfaceMainContactPersonGroupsRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainContactPersonGroupsColumn1" class="interfaceMainColumn1Large">' +
					'</td>' +
					'<td id="tdInterfaceMainContactPersonGroupsColumn2" style="width: 100px;" class="interfaceMainColumn2Action">' +
					'</td>' +
					'</tr>' +
					'</table>';				
		
		$('#divInterfaceMainGroups').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableInterfaceMainNewsGroupsColumn2" class="interfaceMainColumn2">';
		
		aHTML[++h] = '<tr><td id="tdInterfaceMainContactPersonGroupsAdd" class="interfaceMainAction">' +
						'<span id="spanInterfaceMainContactPersonGroupsAdd">Add Group</span>' +
						'</td></tr>';
		
		aHTML[++h] = '<tr><td>' +
						'&nbsp;' +
						'</td></tr>';
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainContactPersonGroupsColumn2').html(aHTML.join(''));
		
		$('#spanInterfaceMainContactPersonGroupsAdd').button(
		{
			label: "Add Group"
		})
		.click(function() {
			interfaceMasterOptionsSetPosition('spanInterfaceMainContactPersonGroupsAdd', -50, -280);
			interfaceContactPersonGroupsAdd(aParam);
		})
		.css('width', '75px')
		
		var aHTML = [];
		var h = -1;
	
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table border="0" cellspacing="0" cellpadding="0" width="750" style="margin-top:15px; margin-bottom:15px;">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceActions">';
			aHTML[++h] = '<td class="interfaceMainRowNothing">No groups.</td>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</tbody></table>';

			$('#tdInterfaceMainContactPersonGroupsColumn1').html(aHTML.join(''));		
		}
		else
		{
			aHTML[++h] = '<table id="tableContacPersonGroupsList" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			
			$.each(oResponse.data.rows, function()
			{	
				if (this.grouptext != '')
				{
					aHTML[++h] = '<tr class="interfaceMainRow">';
									
					aHTML[++h] = '<td id="tdNewsGroupsList-title-' + this.id + '" class="interfaceMainRow">' +
											this.grouptext + '</td>';
											
											
					aHTML[++h] = '<td id="tdNewsGroupsList-' + this.id + '" class="interfaceMainRowOptionsSelect">&nbsp;</td>';
											
					aHTML[++h] = '</tr>';
				}					
			});
			
			aHTML[++h] = '</tbody></table>';

			$('#tdInterfaceMainContactPersonGroupsColumn1').html(aHTML.join(''));
			
			$('.interfaceMainRowOptionsSelect').button( {
				text: false,
				 icons: {
					 primary: "ui-icon-close"
				}
			})
			.click(function() {
				interfaceContactPersonGroupsAddRemove(this.id)
			})
			.css('width', '15px')
			.css('height', '20px')
		
		}
		
	}	
}	

function interfaceContactPersonGroupsAdd(aParam, oResponse)
{
		
	if ($('#divInterfaceMasterViewportControlOptions').attr('onDemandSource') == 'spanInterfaceMainContactPersonGroupsAdd')
	{
		$('#divInterfaceMasterViewportControlOptions').slideUp(500);
		$('#divInterfaceMasterViewportControlOptions').attr('onDemandSource', '');
	}
	else
	{
		if (oResponse == undefined)
		{
			var sParam = 'method=SETUP_CONTACT_PERSON_GROUP_SEARCH';
		
			$.ajax(
			{
				type: 'GET',
				url: '/ondemand/setup/?method=SETUP_CONTACT_PERSON_GROUP_SEARCH',
				dataType: 'json',
				success: function(data){interfaceContactPersonGroupsAdd(aParam, data)}
			});
		}
		else
		{
			
			$('#divInterfaceMasterViewportControlOptions').attr('onDemandSource', 'spanInterfaceMainContactPersonGroupsAdd')
			
			var aHTML = [];
			var h = -1;
			
			if (oResponse.data.rows.length == 0)
			{
				aHTML[++h] = '<table id="tableContactPersonGroupsAddSelect" border="0" cellspacing="0" cellpadding="0" class="interfaceSearchMedium">';
				aHTML[++h] = '<tbody>'
				aHTML[++h] = '<tr class="interfaceMainCaption">' +
								'<td class="interfaceMainRowNothing">No groups.</td></tr>';
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
					
					aHTML[++h] = '<td id="tdNewsGroupsAddSelect-title-' + this.id + '" class="interfaceMainRowSelect">' +
											this.title + '</td>';
					
					aHTML[++h] = '</tr>'
				});
				
				aHTML[++h] = '</tbody></table>';

				$('#divInterfaceMasterViewportControlOptions').html(aHTML.join(''));
				$('#divInterfaceMasterViewportControlOptions').show(giShowSpeedOptions);
				
				$('td.interfaceMainRowSelect').click(function(event)
				{
					interfaceContactPersonGroupsAddSelect(event.target.id);
				});
			}
		}
	}	
}
	
	
function interfaceContactPersonGroupsAddSelect(sXHTMLElementId)
{

	var aSearch = sXHTMLElementId.split('-');
	var sElementId = aSearch[0];
	var sSearchContext = aSearch[2];
	
	$('#' + sXHTMLElementId).fadeOut(500);
	
	var sParam = 'method=CONTACT_PERSON_GROUP_MANAGE';
	var sData = 'contactperson=' + giObjectContext +
				'&group=' + sSearchContext;
				
	$.ajax(
		{
			type: 'POST',
			url: '/ondemand/contact/?' + sParam,
			data: sData,
			dataType: 'json',
			success: function(data){interfaceContactPersonGroups()}
		});
		
}

function interfaceContactPersonGroupsAddRemove(sXHTMLElementId)
{

	var aSearch = sXHTMLElementId.split('-');
	var sElementId = aSearch[0];
	var sSearchContext = aSearch[1];
	
	var sParam = 'method=CONTACT_PERSON_GROUP_MANAGE&remove=1';
	var sData = 'id=' + sSearchContext;
				
	$.ajax(
		{
			type: 'POST',
			url: '/ondemand/contact/?' + sParam,
			data: sData,
			dataType: 'json',
			success: function(data){$('#' + sXHTMLElementId).parent().fadeOut(500)}
		});
		
}

function interfaceContactPersonNew()
{
	goObjectContext = undefined
	giObjectContext = -1;
	interfaceContactPersonViewport();
	interfaceMasterMainViewportShow("#divInterfaceMainDetails");
	$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
	$('#spanInterfaceMasterViewportControlActionOptions').button({disabled: true});
	interfaceContactPersonDetails();
}

function interfaceContactPersonByGroup(aParam, oResponse)
{
	var sXHTMLElementID = 'divInterfaceMain';
	var sLabel = "groups";
	var iOption = 1;
	
	if (aParam != undefined)
	{
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
	}

	if (oResponse == undefined)
	{
		var sParam = 'method=SETUP_CONTACT_PERSON_GROUP_SEARCH';
		
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/setup/?rf=json',
			data: sParam,
			dataType: 'json',
			success: function(data) {interfaceContactPersonByGroup(aParam, data)}
		});
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableInterfaceMainContactPersonByGroup" class="interfaceMain">' +
					'<tr id="trInterfaceMainContactPersonByGroupRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainContactPersonByGroupColumn1" style="width:150px;border-right-style:solid;border-width:2px;border-color:#B8B8B8;padding-right:15px;">' +
					'</td>' +
					'<td id="tdInterfaceMainContactPersonByGroupColumn2" class="interfaceMainColumn1Large" style="padding-left:15px;">' +
					'</td>' +
					'</tr>' +
					'</table>';				
		
		$('#divInterfaceMain').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableContactPersonByGroupSelect" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">' +
							'<td class="interfaceMainRowNothing">No groups.</td></tr>';
			aHTML[++h] = '</tbody></table>';

			$('#tdInterfaceMainContactPersonByGroupColumn1').html(aHTML.join(''));
		}
		else
		{
			aHTML[++h] = '<table id="tableContactPersonByGroupSelect">';
			aHTML[++h] = '<tbody>'
			
			$.each(oResponse.data.rows, function()
			{
				aHTML[++h] = '<tr class="interfaceMainRow">';
				
				aHTML[++h] = '<td id="tdNewsGroupsAddSelect_title-' + this.id +
										'-' + this.title +
										'" class="interfaceRowSelect interfaceContactPersonByGroup">' +
										this.title + '</td>';
				
				aHTML[++h] = '</tr>'
			});
			
			aHTML[++h] = '</tbody></table>';

			$('#tdInterfaceMainContactPersonByGroupColumn1').html(aHTML.join(''));
						
			$('td.interfaceContactPersonByGroup').click(function(event)
			{
				interfaceContactPersonByGroupContacts({xhtmlElementID: event.target.id});
			});
		}
	}	
}	

function interfaceContactPersonByGroupContacts(aParam, oResponse)
{
	var sXHTMLElementID;
	
	if (aParam != undefined)
	{
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
	}

	var aXHTMLElementId = sXHTMLElementID.split('-')
	
	if (oResponse == undefined)
	{
		$('#tdInterfaceMainContactPersonByGroupColumn2').html(gsLoadingXHTML);
		
		var oSearch = new AdvancedSearch();
		oSearch.method = 'CONTACT_PERSON_GROUP_SEARCH';
		oSearch.addField('contactperson,persongroup.contactperson.firstname,persongroup.contactperson.surname,group,grouptext');
		oSearch.addFilter('group', 'EQUAL_TO', aXHTMLElementId[1]);
		oSearch.sort('contactperson.firstname,contactperson.surname', 'asc');
		oSearch.getResults(function(data) {interfaceContactPersonByGroupContacts(aParam, data)});
	}
	else
	{
	
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableInterfaceNewsHomeMostLikely">';
			aHTML[++h] = '<tr class="interfaceMainCaption">' +
								'<td class="interfaceMainRowNothing">No contacts.</td></tr>';
			aHTML[++h] = '</tbody></table>';
		}
		else
		{		
			aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn1" class="interfaceMain">';
				
			aHTML[++h] = '<table id="tableNewsGroupsList" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			
			aHTML[++h] = '<tr class="interfaceMainCaption">';
			aHTML[++h] = '<td colspan=2 class="interfaceMainCaption">' + aXHTMLElementId[2] + '</td>';
			aHTML[++h] = '</tr>';
			
			$.each(oResponse.data.rows, function()
			{
				aHTML[++h] = interfaceContactPersonByGroupContactsRow(this);
			});
			
			aHTML[++h] = '</tbody></table>';
		}
		
		interfaceMasterPaginationList(
		{
			xhtmlElementID: "tdInterfaceMainContactPersonByGroupColumn2",
			xhtmlContext: 'ContactPersonGroupsContacts',
			xhtml: aHTML.join(''),
			showMore: (oResponse.data.morerows == "true"),
			more: oResponse.moreid,
			rows: giReturnRows,
			functionShowRow: interfaceContactPersonByGroupContactsRow,
			functionNewPage: 'interfaceContactPersonByGroupContactsBind()',
			type: 'json'
		}); 	
		
		interfaceContactPersonByGroupContactsBind();
	}	
}	

function interfaceContactPersonByGroupContactsRow(oRow)
{
	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<tr class="interfaceMainRow">';
							
	aHTML[++h] = '<td id="tdNewsGroupsList_contact-' + oRow.contactperson + '" class="interfaceMainRow">' +
							oRow.contactpersonfirstname + '</td>';
							
	aHTML[++h] = '<td id="tdNewsGroupsList_activity-' + oRow.contactperson + '" class="interfaceMainRow">' +
							oRow.contactpersonsurname + '</td>';
							
	aHTML[++h] = '<td id="tdContactBusinessGroupsContacts-' + oRow.contactperson + '" class="interfaceMainRowOptionsSelect interfaceContactPersonGroupsContactsSelect">&nbsp;</td>';						
	
	aHTML[++h] = '</tr>';
				
	return aHTML.join('');
}	

function interfaceContactPersonByGroupContactsBind()
{
	$('.interfaceContactPersonGroupsContactsSelect').button( {
				text: false,
				icons: {
					primary: "ui-icon-play"
				}
	})
	.click(function() {
		interfaceContactPersonMasterViewport({showHome: false});
		interfaceContactPersonSearch(this.id)
	})
	.css('width', '15px')
	.css('height', '20px')
	
}	

function interfaceContactFavourites(aParam, oResponse)
{
	var sXHTMLElementID;
	
	if (aParam != undefined)
	{
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
	}

	var aXHTMLElementId = sXHTMLElementID.split('-')
	
	if (oResponse == undefined)
	{
	
		$('#tdInterfaceMainContactPersonByGroupColumn2').html(gsLoadingXHTML);
		
		var oSearch = new AdvancedSearch();
		oSearch.endPoint = 'contact';
		oSearch.method = 'CONTACT_PERSON_SEARCH';
		oSearch.addField('firstname,surname');
		oSearch.addFilter('', 'IS_FAVOURITE', '');
		oSearch.rows = 20;
		oSearch.sort('firstname', 'asc');
		oSearch.getResults(function(data) {interfaceContactFavourites(aParam, data)});
		
	}
	else
	{
		var aHTML = [];
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML.push('<table id="tableInterfaceNewsHomeMostLikely">');
			aHTML.push('<tr class="interfaceMainCaption">' +
								'<td class="interfaceMainRowNothing">No contacts.</td></tr>');
			aHTML.push('</tbody></table>');
		}
		else
		{		
			
			aHTML.push('<table id="tableInterfaceMainDetailsColumn1" class="interfaceMain">');
				
			aHTML.push('<table id="tableContactsFavouritesList" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">');
			aHTML.push('<tbody>');
			
			aHTML.push('<tr class="interfaceMainCaption">');
			aHTML.push('<td class="interfaceMainCaption">First Name</td>');
			aHTML.push('<td class="interfaceMainCaption">Last Name</td>');
			aHTML.push('</tr>');
			
			$.each(oResponse.data.rows, function() {
			
				aHTML.push(interfaceContactFavouritesRow(this));
			});
			
			aHTML.push('</tbody></table>');
		}
		
		interfaceMasterPaginationList(
		{
			xhtmlElementID: sXHTMLElementID,
			xhtmlContext: 'ContactFavourites',
			xhtml: aHTML.join(''),
			showMore: (oResponse.morerows == "true"),
			more: oResponse.moreid,
			rows: giReturnRows,
			functionShowRow: interfaceContactFavouritesRow,
			functionNewPage: 'interfaceContactFavouritesBind()',
			type: 'json'
		}); 	
		
		interfaceContactFavouritesBind();
	}	
}	

function interfaceContactFavouritesRow(oRow)
{
	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<tr class="interfaceMainRow">';
							
	aHTML[++h] = '<td id="tdNewsGroupsList_contact-' + oRow.id + '" class="interfaceMainRow">' +
							oRow.firstname + '</td>';
							
	aHTML[++h] = '<td id="tdNewsGroupsList_activity-' + oRow.id + '" class="interfaceMainRow">' +
							oRow.surname + '</td>';
							
	aHTML[++h] = '<td id="tdContactFavourites-' + oRow.id + '" class="interfaceMainRowOptionsSelect interfaceContactFavouritesSelect">&nbsp;</td>';						
	
	aHTML[++h] = '</tr>';
				
	return aHTML.join('');
}	

function interfaceContactFavouritesBind()
{
	$('.interfaceContactFavouritesSelect').button( {
				text: false,
				icons: {
					primary: "ui-icon-play"
				}
	})
	.click(function() {
		interfaceContactPersonMasterViewport({showHome: false});
		interfaceContactPersonSearch(this.id)
	})
	.css('width', '15px')
	.css('height', '20px')
	
}	

