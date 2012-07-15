function interfaceFinancialBankAccountMasterViewport(aParam)
{
	interfaceFinancialMasterInitialise();
	
	var bShowHome = true
	
	if (aParam != undefined)
	{
		if (aParam.showHome != undefined) {bShowHome = aParam.showHome}	
	}

	giObject = -1;
	goObjectContext = undefined;
	gsObjectName = 'Bank Accounts';
	giObjectContext = -1;
	
	if (bShowHome)
	{
		interfaceMasterViewportDestination({
			newDestination: 'interfaceFinancialBankAccountMasterViewport({showHome: true});',
			move: false
			})		
	}	
			
	interfaceMasterReset();
	
	$('#divInterfaceMasterViewportControlSet').button(
	{
		label: "Bank Accounts"
	});
	
	$('#inputInterfaceMasterViewportControlSearch').keyup(function(event)
	{
		if (giKeyPressTimeoutId != 0) {clearTimeout(giKeyPressTimeoutId)};
        giKeyPressTimeoutId = setTimeout("interfaceFinancialSearch('inputInterfaceMasterViewportControlSearch')", giWaitForStop);
	});
	
	$('#spanInterfaceMasterViewportControlSearch').click(function(event)
	{
		interfaceFinancialSearch('inputInterfaceMasterViewportControlSearch');
	});
	
	$('#spanInterfaceMasterViewportControlSearchOptions').click(function(event)
	{
		interfaceFinancialSearchOptions();
	});
	
	$('#spanInterfaceMasterViewportControlNew').click(function(event)
	{
		interfaceFinancialNew();
	})
	
	$('#spanInterfaceMasterViewportControlNewOptions').click(function(event)
	{
		interfaceFinancialNewOptions();
	});
	
	$('#spanInterfaceMasterViewportControlAction').click(function(event)
	{
		interfaceFinancialSave();
	});
	
	$('#spanInterfaceMasterViewportControlActionOptions').click(function(event)
	{
		interfaceFinancialSaveOptions();
	});
	
	$('#spanInterfaceMasterViewportControlSetup').click(function(event)
	{
		interfaceFinancialSetup();
	});
	
	$('#spanInterfaceMasterViewportControlSetupOptions').click(function(event)
	{
		interfaceFinancialSetupOptions();
	});
	
	$('#spanInterfaceMasterViewportControlHelp').click(function(event)
	{
		interfaceFinancialHelp();
	});
	
	$('#spanInterfaceMasterViewportControlHelpOptions').click(function(event)
	{
		interfaceFinancialHelpOptions();
	});
	
	$('td.interfaceViewportMasterControlBrowse').click(function(event)
	{
		interfaceFinancialSearch(event.target.id, {source: giSearchSource_BROWSE});
	});
	
	$('td.interfaceViewportMasterControlBrowseAll').click(function(event)
	{
		interfaceFinancialSearch(event.target.id, {source: giSearchSource_BROWSE});
	});
	
	if (gbSetFocus) {$('#inputInterfaceMasterViewportControlSearch').focus()};
	if (bShowHome) {interfaceFinancialBankAccountHomeShow()};	
}

function interfaceFinancialBankAccountHomeShow(aParam, oResponse)
{	
	
	var aHTML = [];
	var h = -1;
			
	aHTML[++h] = '<table>';
	aHTML[++h] = '<tr>' +
					'<td id="interfaceMasterViewportFinancialLarge" class="interfaceMasterViewportImageLarge">' +
					'&nbsp;' + 
					'</td>' +
					'</tr>';
	aHTML[++h] = '</table>';		

	aHTML[++h] = '<table>';
	
	$('#divInterfaceViewportControl').html(aHTML.join(''));	

	$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
	
	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<table id="tableFinancialBankAccount" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
	aHTML[++h] = '<tbody>'
	
	$.each(ns1blankspace.financial.bankaccounts, function()
	{
		aHTML[++h] = '<tr class="interfaceMainRow">';
						
		aHTML[++h] = '<td id="tdBankAccount_title-' + this.id + '" class="interfaceHomeMostLikely" style="width:150px;">' +
								this["title"] + '</td>';
				
		aHTML[++h] = '<td id="interfaceBankAccount_lastreconcileddate-' + this.id + '" class="interfaceHomeMostLikelySub" style="width:90px;text-align:right;">' +
									this.lastreconcileddate + '</td>';
													
		aHTML[++h] = '<td id="interfaceBankAccount_lastreconciledamount-' + this.id + '" class="interfaceHomeMostLikelySub" style="width:90px;text-align:right;">' +
									'$' + this.lastreconciledamount + '</td>';
			
		aHTML[++h] = '<td>&nbsp;</td>';																	
		aHTML[++h] = '</tr>';
	});
	
	aHTML[++h] = '</tbody></table>';

	$('#tdInterfaceMainItemColumn1').html(aHTML.join(''));
	
	$('#divInterfaceMain').html(aHTML.join(''));

	$('.interfaceHomeMostLikely').click(function() {
		var aID = (event.target.id).split('-');
		interfaceFinancialBankAccountShow({id: aID[1]});
	});
}

function interfaceFinancialBankAccountViewport()
{
	
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceViewportControlContext" class="interfaceViewportControlContext"></div>';
	
	aHTML[++h] = '<table class="interfaceViewportControl">';
	
	aHTML[++h] = '<tr id="trInterfaceViewportControl1" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlSummary" class="interfaceViewportControl interfaceViewportControlHighlight">Summary</td>' +
					'</tr>';
	
	aHTML[++h] = '</table>';
	
	aHTML[++h] = '<table class="interfaceViewportControl">';
				
	aHTML[++h] = '<tr id="trInterfaceViewportControl2" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlImport" class="interfaceViewportControl">Import</td>' +
					'</tr>';
	
	aHTML[++h] = '<tr id="trInterfaceViewportControlItem" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlReconcile" class="interfaceViewportControl">Reconcile</td>' +
					'</tr>';

	aHTML[++h] = '</table>';					
			
	$('#divInterfaceViewportControl').html(aHTML.join(''));
	
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceMainContext" class="divInterfaceViewportMainContext"></div>';
	aHTML[++h] = '<div id="divInterfaceMainSummary" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainImport" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainReconcile" class="divInterfaceViewportMain"></div>';
	
	$('#divInterfaceMain').html(aHTML.join(''));
	
	$('#tdInterfaceViewportControlSummary').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainSummary");
		interfaceFinancialBankAccountSummary();
	});
	
	$('#tdInterfaceViewportControlImport').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainImport");
		interfaceFinancialBankAccountImport();
	});
	
	$('#tdInterfaceViewportControlReconcile').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainReconcile", true);
		interfaceFinancialBankAccountReconcile();
	});
}

function interfaceFinancialBankAccountShow(aParam, oResponse)
{
	if (aParam != undefined)
	{
		if (aParam.id != undefined) {giObjectContext = aParam.id}	
	}
	
	$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
	interfaceFinancialBankAccountViewport();
	
	goObjectContext == undefined;
	goObjectContext = ($.grep(ns1blankspace.financial.bankaccounts, function (a) { return a.id == giObjectContext; }))[0];
	
	var aHTML = [];
	var h = -1;
	
	if (goObjectContext == undefined)
	{
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find the bankaccount.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
			
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
			
		$('#divInterfaceViewportControlContext').html(goObjectContext.title+
			'<br /><span class="interfaceViewportControlSubContext" id="spanInterfaceViewportControlSubContext_date">' + goObjectContext.lastreconcileddate + '</span>' +
			'<br /><span class="interfaceViewportControlSubContext" id="spanInterfaceViewportControlSubContext_amount">$' + goObjectContext.lastreconciledamount + '</span>');
		
		interfaceMasterViewportDestination({
			newDestination: 'interfaceFinancialBankAccountMasterViewport({showHome: false});interfaceFinancialBankAccountShow({id: ' + giObjectContext + '})',
			move: false
			})
	
		interfaceMasterObjectViewportHistory({functionDefault: 'interfaceFinancialBankAccountSummary()'});
	}		
}	

function interfaceFinancialBankAccountSummary(aParam, oResponse)
{
	var aHTML = [];
	var h = -1;

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
					
	aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryTotalAmount" class="interfaceMainSummary"></td></tr>' +
					'<tr><td id="tdInterfaceMainSummaryTotalAmountValue" class="interfaceMainSummaryValue">' +
					'Last reconciled on the ' + goObjectContext.lastreconcileddate + '.' +
					'</td></tr>';			
	
	aHTML[++h] = '</table>';					

	$('#tdInterfaceMainSummaryColumn1Large').html(aHTML.join(''))
}

function interfaceFinancialBankAccountReconcile(aParam, oResponse)
{
	if (oResponse == undefined)
	{
		var oSearch = new AdvancedSearch();
		oSearch.method = 'FINANCIAL_RECONCILIATION_SEARCH';
		oSearch.addField('statementbalance,statementdate,statustext,status');
		oSearch.addFilter('bankaccount', 'EQUAL_TO', giObjectContext);
		oSearch.sort('statementdate', 'desc');
		oSearch.rows = giMessagingRows;
		oSearch.getResults(function(data) {interfaceFinancialBankAccountReconcile(aParam, data)});
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		// Bank Account type = reco from trans then add another column
		aHTML[++h] = '<table id="tableInterfaceMainBankAccount" class="interfaceMain">' +
					'<tr id="trInterfaceMainBankAccountRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainBankAccountColumnReco" style="width: 75px;padding-right:5px;font-size:0.875em;" class="interfaceMainColumn1">' +
					gsLoadingXHTML +
					'</td>' +
					'<td id="tdInterfaceMainBankAccountColumnItem" class="interfaceMainColumn2" style="width: 200px;font-size:0.875em;">' +
					'</td>' +
					'<td id="tdInterfaceMainBankAccountColumnEdit" class="interfaceMainColumn2">' +
					'</td>' +
					'</tr>' +
					'</table>';				
		
		$('#divInterfaceMainReconcile').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<div id="interfaceMainBankAccountColumnItemSource" style="width: 200px;;margin-bottom:3px;">';
		aHTML[++h] = '<input style="width: 100px;" type="radio" id="interfaceMainBankAccountColumnItemSourceStatement" name="radioSource" checked="checked" /><label for="interfaceMainBankAccountColumnItemSourceStatement" style="width: 90px;">Statement</label>';
		aHTML[++h] = '<input style="width: 100px;" type="radio" id="interfaceMainBankAccountColumnItemSourceReconciled" name="radioSource" /><label for="interfaceMainBankAccountColumnItemSourceReconciled" style="width: 90px;">Reconciled</label>';
		aHTML[++h] = '</div>';
		
		aHTML[++h] = '<div id="interfaceMainBankAccountColumnItemType" style="width: 200px;margin-bottom:3px;">';
		aHTML[++h] = '<input style="width: 100px;" type="radio" id="interfaceMainBankAccountColumnItemTypeDebit" name="radioType" checked="checked" /><label for="interfaceMainBankAccountColumnItemTypeDebit" style="width: 90px;">Debit</label>';
		aHTML[++h] = '<input style="width: 100px;"  type="radio" id="interfaceMainBankAccountColumnItemTypeCredit" name="radioType" /><label for="interfaceMainBankAccountColumnItemTypeCredit" style="width: 90px;">Credit</label>';
		aHTML[++h] = '</div>';
		
		$('#tdInterfaceMainBankAccountColumnItem').html(aHTML.join(''));
		
		$('#interfaceMainBankAccountColumnItemType').buttonset().css('font-size', '0.75em');
		$('#interfaceMainBankAccountColumnItemType :radio').click(function(){alert('1')});
			
		$('#interfaceMainBankAccountColumnItemSource').buttonset().css('font-size', '0.75em');
		$('#interfaceMainBankAccountColumnItemSource :radio').click(function(){alert('2')});
			
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableInterfaceFinancialHomeMostLikely">';
			aHTML[++h] = '<tr class="trInterfaceFinancialHomeMostLikelyNothing">';
			aHTML[++h] = '<tr><td style="font-size:0.75em;"><span id="spanInterfaceBankAccountRecoAdd">Add</span></td></tr>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</table>';
			
			$('#tdInterfaceMainBankAccountColumnReco').html(aHTML.join(''));	
		}
		else
		{		
			aHTML[++h] = '<table id="tableReco" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			//aHTML[++h] = '<tr class="interfaceMainCaption">';
			//aHTML[++h] = '<td class="interfaceMainCaption">Reconciliation</td>';
			//aHTML[++h] = '<td class="interfaceMainCaption">&nbsp;</td>';
			//aHTML[++h] = '</tr>';
			
			var oRows = oResponse.data.rows;
			
			$(oRows).each(function(i) 
			{
				if (i==0)
				{
					if (this.status == 2)
					{
						aHTML[++h] = '<tr><td style="font-size:0.75em;"><span id="spanInterfaceBankAccountRecoAdd">Add</span></td></tr>';
					}
				}
				
				aHTML[++h] = interfaceFinancialBankAccountRecoRow(this);
			});
			
			aHTML[++h] = '</tbody></table>';
			
			$('#tdInterfaceMainBankAccountColumnReco').html(aHTML.join(''));
		}
		
		/*
		interfaceMasterPaginationList(
		   {
			type: 'JSON',
			xhtmlElementID: 'tdInterfaceMainBankAccountColumnReco' + iID,
			xhtmlContext: 'BankAccountReco',
			xhtml: aHTML.join(''),
			showMore: (oResponse.morerows == "true"),
			more: oResponse.moreid,
			rows: 100,
			functionShowRow: interfaceFinancialBankAccountRecoRow,
			functionOpen: undefined,
			functionNewPage: ''
		   });
		*/
		
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableInterfaceMainBankAccountColumnReco" class="interfaceMainColumn2">';
		
		aHTML[++h] = '<tr><td id="tdInterfaceMainBankAccountEdit" class="interfaceMainAction" style="font-size:0.875em;">' +
						'<span id="spanInterfaceBankAccountRecoEdit">Add</span>' +
						'</td></tr>';
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainBankAccountColumnEditx').html(aHTML.join(''));
		
		$('#spanInterfaceBankAccountRecoAdd').button(
		{
			label: "Add"
		})
		.click(function() {
			//interfaceOrderProductItemsAdd()
		})
		.css("width", "75px");
		
		$('.reco').click(function()
		{
			var aID = (event.target.id).split('-');
			interfaceFinancialBankAccountRecoItems({reconcilitation: aID[1]});
		});
	}
}

function interfaceFinancialBankAccountRecoRow(oRow)
{
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<tr class="interfaceMainRow">';
				
	aHTML[++h] = '<td id="interfaceFinancialBankAccountReco_title-' + oRow.id + '" class="interfaceMainRow interfaceMainRowSelect reco"' +
							' title="' + oRow.notes + '">' +
							oRow.statementdate + '<br />';
	
	aHTML[++h] = '<span class="interfaceViewportControlSubContext">' + oRow.statementbalance + '</span><br />';
	aHTML[++h] = '<span class="interfaceViewportControlSubContext">' + oRow.statustext + '</span></td>';
													
	aHTML[++h] = '</tr>'
	
	return aHTML.join('');
}


function interfaceFinancialBankAccountRecoEdit(aParam, oResponse)
{
	var sID; 
	var iDefaultCategory;
	
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
	
		for (edId in tinyMCE.editors) 
					tinyMCE.editors[edId].destroy(true);
					
		giEditorCounter = giEditorCounter + 1;
	
		var aHTML = [];
		var h = -1;

		aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMain">';
				
		aHTML[++h] = '<tr id="trInterfaceMainSetupSetupStructureElementTitle" class="interfaceMain">' +
						'<td id="tdInterfaceMainSetupSetupStructureElementTitle" class="interfaceMain">' +
						'Statement Date' +
						'</td></tr>' +
						'<tr id="trInterfaceMainSetupSetupStructureElementAddTitleValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainSetupSetupStructureElementAddTitleValue" class="interfaceMainText">' +
						'<textarea rows="3" cols="35"  id="inputInterfaceMainSetupStructureElementAddTitle" class="inputInterfaceMainTextMultiSmall" style="height: 80px;"></textarea>' +
						'</td></tr>';
		
		aHTML[++h] = '<tr id="trInterfaceMainSetupSetupStructureElementDescription" class="interfaceMain">' +
						'<td id="tdInterfaceMainSetupSetupStructureElementDescription" class="interfaceMain">' +
						'Statement Amount' +
						'</td></tr>' +
						'<tr id="trInterfaceMainSetupSetupStructureElementAddDescriptionValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainSetupSetupStructureElementAddDescriptionValue" class="interfaceMainText">' +
						'<textarea rows="3" cols="35" id="inputInterfaceMainSetupStructureElementAddDescription' +
						 			giEditorCounter + '" data-editorcount="' + giEditorCounter + 
									'" class="inputInterfaceMainTextMultiLarge" style="height: 125px;"></textarea>' +
						'</td></tr>';
										
		aHTML[++h] = '<tr id="trInterfaceMainDetailsCategory" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsCategory" class="interfaceMain">' +
						'Category' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsCategory" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsCategoryValue" class="interfaceMainRadio">';
	
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/setup/setup_structure.asp?method=SETUP_STRUCTURE_CATEGORY_SEARCH',
			data: 'structure=' + giObjectContext,
			dataType: 'json',
			async: false,
			success: function(oResponse)
			{
				$.each(oResponse.data.rows, function()
				{
					if (iDefaultCategory == undefined) {iDefaultCategory = this.id}
					aHTML[++h] = '<input type="radio" id="radioCategory' + this.id + '" name="radioCategory" value="' + this.id + '"/>' +
										this.title + '<br />';				
				});
			}
		});
		
		aHTML[++h] = '</td></tr>';
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsDataType" class="interfaceMain">' +
							'<td id="tdInterfaceMainDetailsDataType" class="interfaceMain">' +
							'Data Type' +
							'</td></tr>' +
							'<tr id="trInterfaceMainDetailsDataType" class="interfaceMainText">' +
							'<td id="tdInterfaceMainDetailsDataTypeValue" class="interfaceMainRadio">' +
							'<input type="radio" id="radioDataType4" name="radioDataType" value="4"/>Text (Single Line)' +
							'<br /><input type="radio" id="radioDataType1" name="radioDataType" value="1"/>Text (Multi Line)' +
							'<br /><input type="radio" id="radioDataType3" name="radioDataType" value="3"/>Date' +
							'<br /><input type="radio" id="radioDataType2" name="radioDataType" value="2"/>Select / Choice' +
						'</td></tr>';
					
		aHTML[++h] = '<tr id="trInterfaceMainSetupSetupStructureElementTextColour" class="interfaceMain">' +
							'<td id="tdInterfaceMainSetupSetupStructureElementTextColour" class="interfaceMain">' +
							'Text Colour' +
							'</td></tr>' +
							'<tr id="trInterfaceMainSetupStructureElementAddTextColourValue" class="interfaceMainText">' +
							'<td id="tdInterfaceMainSetupStructureElementAddTextColourValue" class="interfaceMainText">' +
							'<input id="inputInterfaceMainSetupSetupStructureElementAddTextColour" class="inputInterfaceMainText">' +
							'</td></tr>';			
							
		aHTML[++h] = '<tr id="trInterfaceMainSetupStructureElementBackgroundColour" class="interfaceMain">' +
							'<td id="tdInterfaceMainSetupStructureElementBackgroundColour" class="interfaceMain">' +
							'Background Colour' +
							'</td></tr>' +
							'<tr id="trInterfaceMainSetupStructureElementAddBackgroundColourValue" class="interfaceMainText">' +
							'<td id="tdInterfaceMainSetupStructureElementAddBackgroundColourValue" class="interfaceMainText">' +
							'<input id="inputInterfaceMainSetupStructureElementAddBackgroundColour" class="inputInterfaceMainText">' +
							'</td></tr>';
										
		aHTML[++h] = '<tr id="trInterfaceMainSetupStructureElementDisplayOrder" class="interfaceMain">' +
							'<td id="tdInterfaceMainSetupStructureElementDisplayOrder" class="interfaceMain">' +
							'Display Order' +
							'</td></tr>' +
							'<tr id="trInterfaceMainSetupStructureElementAddDisplayOrderValue" class="interfaceMainText">' +
							'<td id="tdInterfaceMainSetupStructureElementAddDisplayOrderValue" class="interfaceMainText">' +
							'<input id="inputInterfaceMainSetupStructureElementAddDisplayOrder" class="inputInterfaceMainText">' +
							'</td></tr>';
											
		aHTML[++h] = '<tr id="trInterfaceMainSetupStructureElementAddOptionsValue" class="interfaceMainText">' +
							'<td id="tdInterfaceMainSetupStructureElementAddOptionsValue" class="interfaceMainText">' +
							'</td></tr>';
																										
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSetupStructureElementColumnElement2').html(aHTML.join(''));
		
		if (gbRichEdit)
		{
			tinyMCE.execCommand('mceAddControl', false, 'inputInterfaceMainSetupStructureElementAddDescription' + giEditorCounter);
		}
	
		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMain" style="font-size:0.875em;">';
				
		aHTML[++h] = '<tr id="trInterfaceMainSetupStructureElementAddSave" class="interfaceMainAction">' +
						'<td id="tdInterfaceMainSetupStructureElementAddSave" class="interfaceMainAction">' +
						'<span style="width:70px;" id="spanInterfaceMainSetupStructureElementAddSave">Save</span>' +
						'</td></tr>';
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSetupStructureElementColumnElement3').html(aHTML.join(''));
		
		$('#spanInterfaceMainSetupStructureElementAddSave').button(
		{
			text: "Save"
		})
		.click(function() 
		{
			var sData = 'structure=' + giObjectContext;
			sData += '&id=' + interfaceMasterFormatSave(sID);
			sData += '&title=' + interfaceMasterFormatSave($('#inputInterfaceMainSetupStructureElementAddTitle').val());
			sData += '&datatype=' + interfaceMasterFormatSave($('input[name="radioDataType"]:checked').val());
			sData += '&category=' + interfaceMasterFormatSave($('input[name="radioCategory"]:checked').val());
			sData += '&textcolour=' + interfaceMasterFormatSave($('#inputInterfaceMainSetupSetupStructureElementAddTextColour').val());
			sData += '&backgroundcolour=' + interfaceMasterFormatSave($('#inputInterfaceMainSetupSetupStructureElementAddBackgroundColour').val());
			sData += '&displayorder=' + interfaceMasterFormatSave($('#inputInterfaceMainSetupSetupStructureElementAddDisplayOrder').val());
			sData += '&description=' + interfaceMasterFormatSave(tinyMCE.get('inputInterfaceMainSetupStructureElementAddDescription' + giEditorCounter).getContent());
				
			$.ajax(
			{
				type: 'POST',
				url: '/ondemand/setup/setup_structure.asp?method=SETUP_STRUCTURE_ELEMENT_MANAGE',
				data: sData,
				dataType: 'json',
				success: function() {
					$('#tdSetupStructureElement_title-' + sID).html($('#inputInterfaceMainSetupStructureElementAddTitle').val());
					$('#tdInterfaceMainSetupStructureElementColumnElement2').html('Element has been saved.');
				}
			});
		});
		
		if (sID != undefined)
		{
			$.ajax(
			{
				type: 'POST',
				url: '/ondemand/setup/setup_structure.asp?method=SETUP_STRUCTURE_ELEMENT_SEARCH',
				data: 'id=' + sID,
				dataType: 'json',
				success: function(data) {interfaceMasterSetupStructureElementAdd(aParam, data)}
			});
		}
		else
		{
			$('[name="radioDataType"][value="4"]').attr('checked', true);
			$('[name="radioCategory"][value="' + iDefaultCategory + '"]').attr('checked', true);	
		}
	}
	else
	{
		if (oResponse.data.rows.length != 0)
		{
			var oObjectContext = oResponse.data.rows[0];
			$('#inputInterfaceMainSetupStructureElementAddTitle').val(oObjectContext.title);
			
			var sHTML = interfaceMasterFormatXHTML(oObjectContext.description);
			
			tinyMCE.get('inputInterfaceMainSetupStructureElementAddDescription' + giEditorCounter).setContent(sHTML)
			
			$('[name="radioDataType"][value="' + oObjectContext.datatype + '"]').attr('checked', true);
			$('[name="radioCategory"][value="' + oObjectContext.category + '"]').attr('checked', true);
			$('#inputInterfaceMainSetupSetupStructureElementAddTextColour').val(oObjectContext.textcolour)
			$('#inputInterfaceMainSetupSetupStructureElementAddBackgroundColour').val(oObjectContext.backgroundcolour)
			$('#inputInterfaceMainSetupSetupStructureElementAddDisplayOrder').val(oObjectContext.displayorder)	
			$('#inputInterfaceMainSetupSetupStructureElementAddTitle').focus();
			interfaceSetupStructureElementOptionsShow({structureElementID: oObjectContext.id});
		}
	}
}

function interfaceFinancialBankAccountRecoItems(aParam, oResponse)
{
	var iObjectContext = giObjectContext;
	var sXHTMLElementId = 'tdInterfaceMainSetupStructureElementColumnElement1';
	var oOptions = {view: true, remove: true, automation: true};
	var oActions = {add: true};
	var iRecocilitation;
	
	if (aParam != undefined)
	{
		if (aParam.objectContext != undefined) {iObjectContext = aParam.objectContext}
		if (aParam.xhtmlElementId != undefined) {sXHTMLElementId = aParam.xhtmlElementId}
		if (aParam.options != undefined) {oOptions = aParam.options}
		if (aParam.actions != undefined) {oActions = aParam.actions}
		if (aParam.recocilitation != undefined) {iRecocilitation = aParam.recocilitation}
	}		
		
	if (oResponse == undefined)
	{	
		var oSearch = new AdvancedSearch();
		oSearch.method = 'FINANCIAL_RECEIPT_SEARCH';
		oSearch.addField('reference,amount');
		oSearch.addFilter('reconciliation', 'EQUAL_TO', iRecocilitation);
		oSearch.sort('reference', 'desc');
		oSearch.rows = giMessagingRows;
		oSearch.getResults(function(data) {interfaceFinancialBankAccountRecoItems(aParam, data)});
	}
	else
	{
		var aHTML = [];
		var h = -1;	
			
		aHTML[++h] = '<table style="margin-top:20px;">';
			
		aHTML[++h] = '<tr><td class="interfaceViewportControlSub">' +
						'No element selected.' +
						'<br /><br/ >Click the gear icon to set up automation (issue creation) for an element.' +
					'</td></tr>';

		aHTML[++h] = '</table>';		
		
		$('#tdInterfaceMainSetupStructureElementColumnElement2').html(aHTML.join(''));
			
		if (oActions != undefined)
		{	
			var aHTML = [];
			var h = -1;	
			
			aHTML[++h] = '<table id="tableInterfaceMainSetupStructureElementColumn2" class="interfaceMainColumn2">';
			
			if (oActions.add)
			{
				aHTML[++h] = '<tr><td id="tdInterfaceMainFormStructureAdd" class="interfaceMainAction">' +
							'<span id="spanInterfaceMainSetupStructureAdd">Add</span>' +
							'</td></tr>';
			}
			
			aHTML[++h] = '</table>';					
			
			$('#tdInterfaceMainSetupStructureElementColumnElement3').html(aHTML.join(''));
		
			$('#spanInterfaceMainSetupStructureAdd').button(
			{
				label: "Add"
			})
			.click(function() {
				 interfaceMasterSetupStructureElementAdd(aParam);
			})
			
		}	
	
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableSetupStructureElement" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			aHTML[++h] = '<tr class="interfaceMainCaption">' +
							'<td class="interfaceMainRowNothing">No layout elements.</td></tr>';
			aHTML[++h] = '</tbody></table>';

			$('#tdInterfaceMainSetupStructureElementColumnElement1').html(aHTML.join(''));
		
		}
		else
		{
			aHTML[++h] = '<table id="tableClientAudits" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
			
			$.each(oResponse.data.rows, function()
			{
				aHTML[++h] = '<tr class="interfaceMainRow">';
								
				aHTML[++h] = '<td id="tdSetupStructureElement_title-' + this.id + '" class="interfaceMainRow interfaceMainRowSelect element">' +
										this.title + '</td>';				
										
				aHTML[++h] = '<td style="width:30px;text-align:right;" class="interfaceMainRow">';
				
				if (oOptions.automation)
				{	
					aHTML[++h] = '<span id="spanSetupStructureElement_options_view-' + this.id + '" class="interfaceMainRowOptionsAutomation"></span>';
				};	
					
				if (oOptions.remove)
				{	
					aHTML[++h] = '<span id="spanSetupStructureElementoptions_remove-' + this.id + '" class="interfaceMainRowOptionsRemove"></span>';
				};	
					
				if (oOptions.view)
				{	
					aHTML[++h] = '<span id="spanSetupStructureElement_options_view-' + this.id + '" class="interfaceMainRowOptionsView"></span>';
				};	
					
				aHTML[++h] = '</td>';
								
				aHTML[++h] = '</tr>';
			});
			
			aHTML[++h] = '</tbody></table>';

			$('#tdInterfaceMainSetupStructureElementColumnElement1').html(aHTML.join(''));
			
			if (oOptions.remove) 
			{
				$('.interfaceMainRowOptionsRemove').button( {
					text: false,
					icons: {
						primary: "ui-icon-close"
					}
				})
				.click(function() {
					interfaceMasterSetupStructureElementRemove({xhtmlElementID: this.id});
				})
				.css('width', '15px')
				.css('height', '17px')
			}
			
			if (oOptions.view) 
			{
				$('td.element').click(function() {
					interfaceMasterSetupStructureElementAdd({xhtmlElementID: this.id})
				})
				.css('width', '15px')
				.css('height', '17px')
			}	
			
			if (oOptions.automation) 
			{
				$('.interfaceMainRowOptionsAutomation').button( {
					text: false,
					icons: {
						primary: "ui-icon-gear"
					}
				})
				.click(function() {
					interfaceSetupStructureAutomation({xhtmlElementID: this.id})
				})
				.css('width', '15px')
				.css('height', '17px')
			}	
		}
	}	
}

function interfaceFinancialBankAccountImport(aParam, oResponse)
{
	if (oResponse == undefined)
	{
		var oSearch = new AdvancedSearch();
		oSearch.method = 'FINANCIAL_BANK_ACCOUNT_TRANSACTION_SOURCE_SEARCH';
		oSearch.addField('startdate,enddate');
		oSearch.addFilter('bankaccount', 'EQUAL_TO', giObjectContext);
		oSearch.sort('enddate', 'desc');
		oSearch.rows = giMessagingRows;
		oSearch.getResults(function(data) {interfaceFinancialBankAccountImport(aParam, data)});
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableInterfaceMainBankAccountImport" class="interfaceMain">' +
					'<tr id="trInterfaceMainBankAccountRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainBankAccountColumnImportSource" style="width: 75px;padding-right:5px;font-size:0.875em;" class="interfaceMainColumn1">' +
					gsLoadingXHTML +
					'</td>' +
					'<td id="tdInterfaceMainBankAccountColumnImportTran" class="interfaceMainColumn2" style="width: 225px;">' +
					'<span class="interfaceViewportControlSubContext">Select an import.</span>' +
					'</td>' +
					'<td id="tdInterfaceMainBankAccountColumnImportEdit" class="interfaceMainColumn2">' +
					'</td>' +
					'</tr>' +
					'</table>';				
		
		$('#divInterfaceMainImport').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableInterfaceFinancialHomeMostLikely">';
			aHTML[++h] = '<tr class="trInterfaceFinancialHomeMostLikelyNothing">';
			aHTML[++h] = '<tr><td style="font-size:0.75em;"><span id="spanInterfaceBankAccountImportAdd">Add</span></td></tr>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</table>';
			
			$('#tdInterfaceMainBankAccountColumnImportSource').html(aHTML.join(''));	
		}
		else
		{		
			aHTML[++h] = '<table id="tableReco" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
	
			var oRows = oResponse.data.rows;
			
			$(oRows).each(function(i) 
			{
				if (i==0)
				{
					if (this.status == 2)
					{
						aHTML[++h] = '<tr><td style="font-size:0.75em;"><span id="spanInterfaceBankAccountImportAdd">Add</span></td></tr>';
					}
				}
				
				aHTML[++h] = interfaceFinancialBankAccountRecoRow(this);
			});
			
			aHTML[++h] = '</tbody></table>';
			
			$('#tdInterfaceMainBankAccountColumnImportSource').html(aHTML.join(''));
		}
		
		/*
		interfaceMasterPaginationList(
		   {
			type: 'JSON',
			xhtmlElementID: 'tdInterfaceMainBankAccountColumnReco' + iID,
			xhtmlContext: 'BankAccountReco',
			xhtml: aHTML.join(''),
			showMore: (oResponse.morerows == "true"),
			more: oResponse.moreid,
			rows: 100,
			functionShowRow: interfaceFinancialBankAccountRecoRow,
			functionOpen: undefined,
			functionNewPage: ''
		   });
		*/
		
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableInterfaceMainBankAccountColumnReco" class="interfaceMainColumn2">';
		
		aHTML[++h] = '<tr><td id="tdInterfaceMainBankAccountEdit" class="interfaceMainAction" style="font-size:0.875em;">' +
						'<span id="spanInterfaceBankAccountRecoEdit">Add</span>' +
						'</td></tr>';
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainBankAccountColumnEditx').html(aHTML.join(''));
		
		$('#spanInterfaceBankAccountImportAdd').button(
		{
			label: "Add"
		})
		.click(function() {
			//interfaceOrderProductItemsAdd()
		})
		.css("width", "75px");
	}
}