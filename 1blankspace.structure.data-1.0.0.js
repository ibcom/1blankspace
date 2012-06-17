function interfaceStructureDataMasterViewport(aParam)
{

	gsObjectName = 'Stucture Data';
	giObjectContext = -1;
	giObject = 41;
	goObjectContext = undefined;
	
	var bShowHome = true;
	var bNew = false;
	
	if (aParam != undefined)
	{
		if (aParam.showHome != undefined) {bShowHome = aParam.showHome}
		if (aParam.showNew != undefined) {bNew = aParam.showNew}
		if (bNew) {interfaceStructureDataNew()};
	}	
	
	if (bShowHome)
	{
		interfaceMasterViewportDestination({
			newDestination: 'interfaceStructureDataMasterViewport({showHome: true});',
			move: false
			})		
	}
	
	interfaceMasterReset();		
			
	$('#divInterfaceMasterViewportControlSet').button(
	{
		label: "Structure Data"
	});
	
	$('#inputInterfaceMasterViewportControlSearch').keyup(function(event)
	{
		if (giKeyPressTimeoutId != 0) {clearTimeout(giKeyPressTimeoutId)};
        giKeyPressTimeoutId = setTimeout("interfaceStructureDataSearch('inputInterfaceMasterViewportControlSearch')", giWaitForStop);
	});
	
	$('#spanInterfaceMasterViewportControlSearch').click(function(event)
	{
		interfaceStructureDataSearch('inputInterfaceMasterViewportControlSearch');
	});
	
	$('#spanInterfaceMasterViewportControlSearchOptions').click(function(event)
	{
		interfaceStructureDataSearchOptions();
	});
	
	$('#spanInterfaceMasterViewportControlNew').click(function(event)
	{
		interfaceStructureDataNew();
	})
	
	$('#spanInterfaceMasterViewportControlNewOptions').click(function(event)
	{
		interfaceStructureDataNewOptions();
	});
	
	$('#spanInterfaceMasterViewportControlAction').click(function(event)
	{
		interfaceStructureDataSave();
	});
	
	$('#spanInterfaceMasterViewportControlAction').button({disabled: true});
	
	$('#spanInterfaceMasterViewportControlActionOptions').click(function(event)
	{
	
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableinterfaceActionOptions" class="interfaceActionOptions">';
						
		aHTML[++h] = '<tr id="trinterfaceActionOptions" class="interfaceActionOptions">' +
						'<td id="tdinterfaceActionOptionsRemove" class="interfaceActionOptions">' +
						'Remove' +
						'</td>' +
						'</tr>';

		aHTML[++h] = '</table>';

		interfaceMasterViewportActionShow(this, aHTML.join(''), "interfaceStructureDataActionOptionsBind()");
	});
	
	$('#spanInterfaceMasterViewportControlActionOptions').button({disabled: true});
		
	$('#spanInterfaceMasterViewportControlSetup').click(function(event)
	{
		interfaceStructureDataSetup();
	});
	
	$('#spanInterfaceMasterViewportControlSetupOptions').click(function(event)
	{
		interfaceStructureDataSetupOptions();
	});
	
	$('#spanInterfaceMasterViewportControlHelp').click(function(event)
	{
		interfaceStructureDataHelp();
	});
	
	$('#spanInterfaceMasterViewportControlHelpOptions').click(function(event)
	{
		interfaceStructureDataHelpOptions();
	});

	$('td.interfaceViewportMasterControlBrowse').click(function(event)
	{
		interfaceStructureDataSearch(event.target.id, {source: giSearchSource_BROWSE});
	});
	
	$('td.interfaceViewportMasterControlBrowseAll').click(function(event)
	{
		interfaceStructureDataSearch(event.target.id, {source: giSearchSource_BROWSE});
	});
	
	$('#inputInterfaceMasterViewportControlSearch').focus();
	
	interfaceStructureDataHomeShow();
	
}

function interfaceStructureDataActionOptionsBind()
{
	$('#tdinterfaceActionOptionsRemove').click(function(event)
	{
		interfaceStructureDataRemove();
	});
}

function interfaceStructureDataHomeShow(oResponse)
{

	if (oResponse == undefined)
	{
		var aHTML = [];
		var h = -1;
					
		aHTML[++h] = '<table id="tableInterfaceMainSummary" class="interfaceMain">';
		aHTML[++h] = '<tr id="trInterfaceMainSummaryRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceWebsiteHomeMostLikely" class="interfaceMainColumn1Large">' +
						'</td>' +
						'<td id="tdInterfaceMainSummaryColumn2Action" style="width:175px;">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';		
						
		$('#divInterfaceMain').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" cellspacing=0>';
										
		aHTML[++h] = '</td></tr></table>';					

		$('#tdInterfaceMainSummaryColumn2Action').html(aHTML.join(''));
		
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
		
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/setup/?method=DECISION_DATA_SEARCH&recent=1',
			dataType: 'json',
			success: interfaceStructureDataHomeShow
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
			aHTML[++h] = '<td class="tdInterfaceWebsiteHomeMostLikelyNothing">Click New to create a structure data.</td>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</table>';
		}
		else
		{
		
			aHTML[++h] = '<table id="tableInterfaceWebsiteHomeMostLikely">';
			
			$.each(oResponse.data.rows, function()
			{	
				aHTML[++h] = '<tr class="interfaceMainRow">';
				
				aHTML[++h] = '<td id="interfaceWebsiteHomeMostLikely_Title-' + this.id + 
										'" class="interfaceHomeMostLikely">' +
										this.title +
										'</td>';
				
				aHTML[++h] = '</tr>'
			});
			
			aHTML[++h] = '</tbody></table>';
		}
		
		$('#tdInterfaceWebsiteHomeMostLikely').html(aHTML.join(''));
	
		$('td.interfaceHomeMostLikely').click(function(event)
		{
			interfaceStructureDataSearch(event.target.id, {source: 1});
		});
	}
}

function interfaceStructureDataSearch(sXHTMLElementId, aParam)
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
		var sParam = 'method=DECISION_DATA_SEARCH&id=' + giSetupContext;
		
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/decision/?' + sParam,
			dataType: 'json',
			success: function(data) {interfaceStructureDataShow(aParam, data)}
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
			
			var sParam = 'method=DECISION_DATA_SEARCH&quicksearch=' + sSearchText;

			$.ajax(
			{
				type: 'GET',
				url: '/ondemand/decision/?' + sParam,
				dataType: 'json',
				success: function(data) {interfaceStructureDataSearchShow(aParam, data)}
			});
			
		}
	};	
}

function interfaceStructureDataSearchShow(aParam, oResponse)
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
			
			aHTML[++h] = '<td class="interfaceSearch" id="title' +
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
		$('#divInterfaceMasterViewportControlOptions').show(giShowSpeedOptions);
		interfaceMasterSearchStop();
		
		$('td.interfaceSearch').click(function(event)
		{
			$('#divInterfaceMasterViewportControlOptions').html('&nbsp;');
			$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions)
			interfaceStructureDataSearch(event.target.id, 1);
		});
	}	
			
}

function interfaceStructureDataViewport()
{
	
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceViewportControlContext" class="interfaceViewportControlContext"></div>';
	
	aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
	
	if (giObjectContext == -1)
	{
		aHTML[++h] = '<tr id="trInterfaceViewportControlDetails" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlDetails" class="interfaceViewportControl interfaceViewportControlHighlight">Details</td>' +
						'</tr>';
	}
	else
	{
		aHTML[++h] = '<tr id="trInterfaceViewportControlSummary" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlSummary" class="interfaceViewportControl interfaceViewportControlHighlight">Summary</td>' +
						'</tr>';
						
		aHTML[++h] = '<tr id="trInterfaceViewportControlDetails" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlDetails" class="interfaceViewportControl">Details</td>' +
						'</tr>';
		
		aHTML[++h] = '<tr><td>&nbsp;</td></tr>';
	
		aHTML[++h] = '<tr id="trInterfaceViewportControl" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlElement" class="interfaceViewportControl">Elements</td>' +
						'</tr>';	
	}
	
	aHTML[++h] = '</table>';					
				
	$('#divInterfaceViewportControl').html(aHTML.join(''));
	
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceMainSummary" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainDetails" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainElement" class="divInterfaceViewportMain"></div>';
		
	$('#divInterfaceMain').html(aHTML.join(''));
		
	$('#tdInterfaceViewportControlSummary').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainSummary");
		interfaceStructureDataSummary();
	});
	
	$('#tdInterfaceViewportControlDetails').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainDetails");
		interfaceStructureDataDetails();
	});
	
	$('#tdInterfaceViewportControlElement').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainElement", true);
		interfaceStructureDataElements();
	});
}

function interfaceStructureDataShow(aParam, oResponse)
{

	$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
	interfaceStructureDataViewport();
	
	var aHTML = [];
	var h = -1;
	
	if (oResponse.data.rows.length == 0)
	{
		goObjectContext = undefined;
		
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find this stuctural data.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		goObjectContext = oResponse.data.rows[0];
					
		aHTML[++h] = '<table id="tableInterfaceMainSummary" class="interfaceMain">';
		aHTML[++h] = '<tr id="trInterfaceMainSummaryRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainSummaryColumn1" class="interfaceMainColumn1">' +
						'</td>' +
						'<td id="tdInterfaceMainSummaryColumn2" class="interfaceMainColumn2x">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMainSummary').html(aHTML.join(''));
		
		interfaceMasterViewportDestination({
			newDestination: 'interfaceStructureDataMasterViewport({showHome: false});interfaceStructureDataSearch("-' + giObjectContext + '")',
			move: false
			})
		
		interfaceMasterObjectViewportHistory({functionDefault: 'interfaceStructureDataSummary()'})

		$('#divInterfaceViewportControlContext').html(goObjectContext.title);
		$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
		$('#spanInterfaceMasterViewportControlActionOptions').button({disabled: false});	
	}	
}		
		
function interfaceStructureDataSummary()
{
	var aHTML = [];
	var h = -1;
	
	if (goObjectContext == undefined)
	{
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find website.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMainColumn1">';
		
		aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryStructureDataID" class="interfaceMainSummary">Structure Data ID</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryStructureDataID" class="interfaceMainSummaryValue">' +
						goObjectContext.id +
						'</td></tr>';
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn1').html(aHTML.join(''));

		var aHTML = [];
		var h = -1;	
		
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMainColumn2" cellpadding=6>';
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSummaryColumn2').html(aHTML.join(''));
		
	}	
}

function interfaceStructureDataDetails()
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
	
		aHTML[++h] = '<tr id="trInterfaceMainDetailsTitle" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsTitle" class="interfaceMain">' +
						'Title' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsTitleValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsTitleValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainDetailsTitle" class="inputInterfaceMainText">' +
						'</td></tr>';
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainDetailsColumn1').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
			
		aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn2" class="interfaceMain">';
	
		aHTML[++h] = '<tr id="trInterfaceMainDetailsSharing" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsSharing" class="interfaceMain">' +
						'Status' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsSharing" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsSharingValue" class="interfaceMainRadio">' +
						'<input type="radio" id="radioStatus2" name="radioStatus" value="2"/>In Progress' +
						'<br /><input type="radio" id="radioStatus1" name="radioStatus" value="1"/>Approved' +
						'</td></tr>';
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainDetailsColumn2').html(aHTML.join(''));
		
		if (goObjectContext != undefined)
		{
			$('#inputInterfaceMainDetailsTitle').val(goObjectContext.title);
			$('[name="radioStatus"][value="' + goObjectContext.status + '"]').attr('checked', true);
		}
		else
		{
			$('[name="radioStatus"][value="2"]').attr('checked', true);	
		}
	}	
}

function interfaceStructureDataSave(aParam, oResponse)
{
	if (oResponse == undefined)
	{
		var sParam = 'method=DECISION_DATA_MANAGE';
		var sData = '_=1';
		
		if (giObjectContext != -1)
		{
			sParam += '&id=' + giObjectContext	
		}	
		
		if ($('#divInterfaceMainDetails').html() != '')
		{
			sData += '&title=' + interfaceMasterFormatSave($('#inputInterfaceMainDetailsTitle').val());
			sData += '&status=' + interfaceMasterFormatSave($('input[name="radioStatus"]:checked').val());	
		};
		
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/setup/?' + sParam,
			data: sData,
			dataType: 'json',
			success: function(data) {interfaceStructureDataSave(aParam, data)}
		});
		
	}
	else
	{			
		if (oResponse.status == 'OK')
		{	
			interfaceMasterStatus('Saved');
			
			if (giObjectContext == -1)
			{
				giObjectContext = oResponse.id;
				gbInputDetected = false;
				interfaceStructureDataSearch('-' + giObjectContext, {source: 1});
			}	
		}
		else
		{
			interfaceMasterStatus('Could not save the StructureData!');
		}
	}
}

function interfaceStructureDataElements(aParam, oResponse)
{
	var aHTML = [];
	var h = -1;
	
	if (oResponse == undefined)
	{
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/setup/?method=SETUP_STRUCTURE_CATEGORY_SEARCH&structure=' + goObjectContext.structure,
			dataType: 'json',
			success: function(data) {interfaceStructureDataElements(aParam, data)}
		});
	}
	else
	{
		if ($('#divInterfaceMainElement').attr('onDemandLoading') == '1')
		{
			$('#divInterfaceMainElement').attr('onDemandLoading', '');
		
			aHTML[++h] = '<table id="tableInterfaceMainElement" class="interfaceMain">';
			aHTML[++h] = '<tr id="trInterfaceMainElementRow1" class="interfaceMain">' +
							'<td id="tdInterfaceMainElementColumn1" style="width: 70px" class="interfaceMainColumn1">' +
							'</td>' +
							'<td id="tdInterfaceMainElementColumn2" class="interfaceMainColumn2">' +
							'</td>' +
							'</tr>';
			aHTML[++h] = '</table>';					
			
			$('#divInterfaceMainElement').html(aHTML.join(''));
			
			var aHTML = [];
			var h = -1;
		
			aHTML[++h] = '<table id="tableInterfaceMainElementCategories" class="interfaceMain">';
			
			if (oResponse.data.rows.length == 0)
			{
				aHTML[++h] = '<table id="tableStructureDataCategory" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
				aHTML[++h] = '<tbody>'
				aHTML[++h] = '<tr class="interfaceMainCaption">' +
								'<td class="interfaceMainRowNothing">No categories.</td></tr>';
				aHTML[++h] = '</tbody></table>';

				$('#tdInterfaceMainElementColumn1').html(aHTML.join(''));
			
			}
			else
			{
				aHTML[++h] = '<table id="tableStructureDataCategory" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
				aHTML[++h] = '<tbody>'
				
				$.each(oResponse.data.rows, function()
				{
					aHTML[++h] = '<tr class="interfaceMainRow">';
									
					aHTML[++h] = '<td id="tdStructureDataCategory_title-' + this.id + '" class="interfaceSearch">' +
											this.title + '</td>';
											
					aHTML[++h] = '</tr>';
				});
				
				aHTML[++h] = '</tbody></table>';

				$('#tdInterfaceMainElementColumn1').html(aHTML.join(''));
	
				$('td.interfaceSearch').click(function(event)
				{
					var sXHTMLElementId = event.target.id;
					var aId = sXHTMLElementId.split('-');
					
					interfaceStructureDataCategoryElements({xhtmlElementID: 'tdInterfaceMainElementColumn2', category: aId[1]});
					
				});
			}	
		}
	}	
}

function interfaceStructureDataCategoryElements(aParam, oResponse)
{
	var iObjectContext = giObjectContext;
	var sXHTMLElementId = 'tdInterfaceMainElementColumn2';
	var oOptions = {view: true, remove: true};
	var oActions = {add: true};
	var iCategory;
	
	if (aParam != undefined)
	{
		if (aParam.objectContext != undefined) {iObjectContext = aParam.objectContext}
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementId = aParam.xhtmlElementID}
		if (aParam.options != undefined) {oOptions = aParam.options}
		if (aParam.actions != undefined) {oActions = aParam.actions}
		if (aParam.category != undefined) {iCategory = aParam.category}
	}		
		
	if (oResponse == undefined)
	{	
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/structure/structure.asp?method=STRUCTURE_ELEMENT_DATA_VALUE_SEARCH' +
						'&data=' + giObjectContext + '&category=' + iCategory,
			dataType: 'json',
			success: function(data) {interfaceStructureDataCategoryElements(aParam, data)}
		});
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableStructureDataCategoryElements" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">' +
							'<td class="interfaceMainRowNothing">No elements</td></tr>';
			aHTML[++h] = '</tbody></table>';

			$('#' + sXHTMLElementId).html(aHTML.join(''));
		
		}
		else
		{
			aHTML[++h] = '<table id="tableStructureDataCategoryElements" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			//aHTML[++h] = '<tr class="interfaceMainCaption">';
			//aHTML[++h] = '<td class="interfaceMainCaption">Title</td>';
			//aHTML[++h] = '<td class="interfaceMainCaption">&nbsp;</td>';
			//aHTML[++h] = '</tr>';
			
			$.each(oResponse.data.rows, function()
			{
				aHTML[++h] = '<tr class="interfaceMainRow">';
								
				aHTML[++h] = '<td id="tdStructureDataCategoryElement_title-' + this.id + '" class="interfaceMainRow">' +
										this.elementtext + '</td>';
										
				aHTML[++h] = '<td style="width:60px;text-align:right;" class="interfaceMainRow">';
					
				if (oOptions.remove)
				{	
					//aHTML[++h] = '<span id="spanStructureDataCategoryoptions_remove-' + this.id + '" class="interfaceMainRowOptionsRemove"></span>';
				};	
					
				if (oOptions.view)
				{	
					//aHTML[++h] = '<span id="spanStructureDataCategory_options_view-' + this.id + '" class="interfaceMainRowOptionsView"></span>';
				};	
					
				aHTML[++h] = '</td>';
								
				aHTML[++h] = '</tr>';
			});
			
			aHTML[++h] = '</tbody></table>';

			$('#' + sXHTMLElementId).html(aHTML.join(''));
			
			if (oOptions.view) 
			{
				$('.interfaceMainRowOptionsRemove').button( {
					text: false,
					icons: {
						primary: "ui-icon-close"
					}
				})
				.click(function() {
					interfaceMasterStructureDataCategoryRemove({xhtmlElementID: this.id});
				})
				.css('width', '15px')
				.css('height', '17px')
			}
			
			if (oOptions.remove) 
			{
				$('.interfaceMainRowOptionsView').button( {
					text: false,
					icons: {
						primary: "ui-icon-play"
					}
				})
				.click(function() {
					interfaceMasterStructureDataCategoryAdd({xhtmlElementID: this.id})
				})
				.css('width', '15px')
				.css('height', '17px')
			}	
		}
	}	
}

function interfaceMasterStructureDataElementAdd(aParam, oResponse)
{
	var sID; 
	
	if (oResponse == undefined)
	{
		var sXHTMLElementID;

		if (aParam != undefined)
		{
			if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
		}
		
		if (sXHTMLElementID != undefined)
		{
			var aXHTMLElementID = sXHTMLElementID.split('-');
			var sID = aXHTMLElementID[1];
		}	
	
		var aHTML = [];
		var h = -1;

		aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMain">';
				
		aHTML[++h] = '<tr id="trInterfaceMainSetupStructureDataCategoryTitle" class="interfaceMain">' +
						'<td id="tdInterfaceMainSetupStructureDataCategoryTitle" class="interfaceMain">' +
						'Title' +
						'</td></tr>' +
						'<tr id="trInterfaceMainSetupStructureDataCategoryAddTitleValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainSetupStructureDataCategoryAddTitleValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainStructureDataCategoryAddTitle" class="inputInterfaceMainText">' +
						'</td></tr>';
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainStructureDataCategoryColumn1').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMain">';
				
		aHTML[++h] = '<tr id="trInterfaceMainStructureDataElementAddSave" class="interfaceMainAction">' +
						'<td id="tdInterfaceMainStructureDataElementAddSave" class="interfaceMainAction">' +
						'<span style="width:80px;" id="spanInterfaceMainStructureDataCategoryAddSave">Save</span>' +
						'</td></tr>';
	
		aHTML[++h] = '<tr id="trInterfaceMainStructureDataElementAddCancel" class="interfaceMainAction">' +
						'<td id="tdInterfaceMainStructureDataElementAddCancel" class="interfaceMainAction">' +
						'<span style="width:80px;" id="spanInterfaceMainStructureDataCategoryAddCancel">Cancel</span>' +
						'</td></tr>';
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainStructureDataCategoryColumn2').html(aHTML.join(''));
		
		$('#spanInterfaceMainStructureDataCategoryAddSave').button(
		{
			text: "Save"
		})
		.click(function() 
		{
			var sData = 'StructureData=' + giObjectContext;
			sData += '&id=' + interfaceMasterFormatSave(sID);
			sData += '&title=' + interfaceMasterFormatSave($('#inputInterfaceMainStructureDataCategoryAddTitle').val());
			
			$.ajax(
			{
				type: 'POST',
				url: '/ondemand/setup/?method=SETUP_StructureData_CATEGORY_MANAGE',
				data: sData,
				dataType: 'json',
				success: function() {
					//interfaceMasterMainViewportShow("#divInterfaceMainCategory");
					interfaceStructureDataCategory();
				}
			});
		});
		
		$('#spanInterfaceMainStructureDataCategoryAddCancel').button(
		{
			text: "Cancel"
		})
		.click(function() 
		{
			interfaceMasterMainViewportShow("#divInterfaceMainCategory");
			interfaceSetupStructureDataCategory();
		});
		
		if (sID != undefined)
		{
			$.ajax(
			{
				type: 'POST',
				url: '/ondemand/setup/?method=SETUP_StructureData_CATEGORY_SEARCH',
				data: 'id=' + sID,
				dataType: 'json',
				success: function(data) {interfaceMasterStructureDataCategoryAdd(aParam, data)}
			});
		}
		else
		{
			$('[name="radioDataType"][value="4"]').attr('checked', true);	
		}
	}
	else
	{
		if (oResponse.data.rows.length != 0)
		{
			var oObjectContext = oResponse.data.rows[0];
			$('#inputInterfaceMainSetupStructureDataElementAddTitle').val(oObjectContext.title)
			$('#inputInterfaceMainSetupStructureDataElementAddTitle').focus();
		}
	}		
}

function interfaceMasterStructureDataElementRemove(aParam, oResponse)
{
	var sXHTMLElementID;

	if (aParam != undefined)
	{
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
	}
	
	var aXHTMLElementID = sXHTMLElementID.split('-');
	var sID = aXHTMLElementID[1];
	
	if (oResponse == undefined)
	{	
		var sParam = 'method=SETUP_StructureData_CATEGORY_MANAGE&remove=1';
		var sData = 'id=' + sID;
		
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/setup/?' + sParam,
			data: sData,
			dataType: 'json',
			success: function(data){interfaceMasterStructureDataCategoryRemove(aParam, data)}
		});
	}	
	else
	{
		if (oResponse.status == 'OK')
		{
			$('#' + sXHTMLElementID).parent().parent().fadeOut(500);
		}	
	}	
	
}

function interfaceStructureDataNew(aParam)
{
	goObjectContext = undefined
	giObjectContext = -1;
	interfaceStructureDataViewport();
	$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
	interfaceMasterMainViewportShow("#divInterfaceMainDetails");
	interfaceStructureDataDetails();
}