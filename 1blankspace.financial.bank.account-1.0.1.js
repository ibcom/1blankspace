function interfaceFinancialBankAccountMasterViewport(aParam)
{
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
	if (oResponse == undefined)
	{
		var oSearch = new AdvancedSearch();
		oSearch.method = 'FINANCIAL_BANK_ACCOUNT_SEARCH';
		oSearch.addField('title,lastreconciledamount,lastreconcileddate,notes');
		oSearch.sort('title', 'asc');
		oSearch.rows = giMessagingRows;
		oSearch.getResults(function(data) {interfaceFinancialBankAccountHomeShow(aParam, data)});
	}
	else
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
	
		aHTML[++h] = '<table id="tableFinancialItems" border="0" cellspacing="0" cellpadding="0" class="interfaceMain" style="font-size:0.875em;">';
		aHTML[++h] = '<tbody>'
		aHTML[++h] = '<tr class="interfaceMainCaption">';
		aHTML[++h] = '<td class="interfaceMainCaption" style="width:125px;">Account</td>';
		aHTML[++h] = '<td class="interfaceMainCaption">Description</td>';
		aHTML[++h] = '<td class="interfaceMainCaption" style="text-align:right;">Amount</td>';
		aHTML[++h] = '<td class="interfaceMainCaption">&nbsp;</td>';
		aHTML[++h] = '</tr>';
		
		$.each(oResponse.data.rows, function()
		{
			aHTML[++h] = '<tr class="interfaceMainRow">';
							
			aHTML[++h] = '<td id="tdWebsiteLineitem_financialaccounttext-' + this.id + '" class="interfaceMainRow">' +
									this["financialaccounttext"] + '</td>';
													
			aHTML[++h] = '<td id="tdWebsiteLineitem_financialaccounttext-' + this.id + '" class="interfaceMainRow">' +
									this["description"] + '</td>';
										
			aHTML[++h] = '<td id="tdWebsiteLineitem_financialaccounttext-' + this.id + '" style="text-align:right;" class="interfaceMainRow"' +
									' title="' + this["tax"] + '">' +
									this["amount"] + '</td>';
									
			aHTML[++h] = '<td style="width:60px;text-align:right;" class="interfaceMainRow">';
				
			if (oOptions.remove)
			{	
				aHTML[++h] = '<span id="spanBankAccount_options_import-' + this.id + '" class="interfaceMainRowOptionsRemove"></span>';
			};	
				
			if (oOptions.view)
			{	
				aHTML[++h] = '<span id="spanBankAccount_options_reconcile-' + this.id + '" class="interfaceMainRowOptionsView"></span>';
			};	
				
			aHTML[++h] = '</td>';				
			aHTML[++h] = '</tr>';
		});
		
		aHTML[++h] = '</tbody></table>';

		$('#tdInterfaceMainItemColumn1').html(aHTML.join(''));
		
		
		$('#divInterfaceMain').html(aHTML.join(''));
	
		$('.interfaceViewportControl').click(function(event)
		{
			
			var sID = $('#' + event.target.id).attr('data-id');
			
			interfaceMasterMainViewportShow('#divInterfaceBankAccount_' + sID);
		
			if (sID == '')
			{
				interfaceFinancialBankAccountSummary();
			}
			else
			{
				interfaceFinancialBankAccountDetails({id: sID});
			}	
		});
	
		$('#tdInterfaceViewportControlSummary').addClass('interfaceViewportControlHighlight');
		interfaceMasterMainViewportShow("#divInterfaceMainSummary");
		interfaceFinancialBankAccountSummary();
	}
}

function interfaceFinancialBankAccountSummary(aParam, oResponse)
{
	if (oResponse == undefined)
	{
		var oSearch = new AdvancedSearch();
		oSearch.method = 'FINANCIAL_RECONCILIATION_SEARCH';
		oSearch.addField('statementdate')
		oSearch.addSummaryField('max(statementdate) maxstatementdate')
		oSearch.rows = 1;
		oSearch.getResults(function(data) {interfaceFinancialBankAccountSummary(aParam, data)});
	}
	else
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
						'Your last reconciled statement date is ' + oResponse.summary.maxstatementdate +
						'</td></tr>';			
		
		aHTML[++h] = '</table>';					
	
		$('#tdInterfaceMainSummaryColumn1Large').html(aHTML.join(''))
	}	
}

function interfaceFinancialBankAccountDetails(aParam, oResponse)
{
	var iID;
	
	if (aParam != undefined)
	{
		if (aParam.id != undefined) {iID = aParam.id}	
	}

	if (oResponse == undefined)
	{
		var oSearch = new AdvancedSearch();
		oSearch.method = 'FINANCIAL_RECONCILIATION_SEARCH';
		oSearch.addField('statementbalance,statementdate,statustext,status');
		oSearch.addFilter('bankaccount', 'EQUAL_TO', iID);
		oSearch.sort('statementdate', 'desc');
		oSearch.rows = giMessagingRows;
		oSearch.getResults(function(data) {interfaceFinancialBankAccountDetails(aParam, data)});
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		// Bank Account type = reco from trans then add another column
		aHTML[++h] = '<table id="tableInterfaceMainBankAccount" class="interfaceMain">' +
					'<tr id="trInterfaceMainBankAccountRow1_' + iID + '" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainBankAccountColumnReco_' + iID + '" style="width: 75px;padding-right:5px;font-size:0.875em;" class="interfaceMainColumn1">' +
					gsLoadingXHTML +
					'</td>' +
					'<td id="tdInterfaceMainBankAccountColumnTran_' + iID + '" class="interfaceMainColumn2">' +
					'</td>' +
					'<td id="tdInterfaceMainBankAccountColumnEdit_' + iID + '" class="interfaceMainColumn2">' +
					'</td>' +
					'</tr>' +
					'</table>';				
		
		$('#divInterfaceBankAccount_' + iID).html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableInterfaceFinancialHomeMostLikely">';
			aHTML[++h] = '<tr class="trInterfaceFinancialHomeMostLikelyNothing">';
			aHTML[++h] = '<td class="tdInterfaceFinancialHomeMostLikelyNothing">No recos.</td>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</table>';
			
			$('#tdInterfaceMainBankAccountColumnReco_' + iID).html(aHTML.join(''));	
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
						aHTML[++h] = '<tr><td style="font-size:0.75em;"><span id="spanInterfaceBankAccountRecoAdd-' + iID + '">Add</span></td></tr>';
					}
				}
				
				aHTML[++h] = interfaceFinancialBankAccountRecoRow(this);
			});
			
			aHTML[++h] = '</tbody></table>';
			
			$('#tdInterfaceMainBankAccountColumnReco_' + iID).html(aHTML.join(''));
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
		
		$('#tdInterfaceMainBankAccountColumnEdit').html(aHTML.join(''));
		
		$('#spanInterfaceBankAccountRecoAdd-' + iID).button(
		{
			label: "Add"
		})
		.click(function() {
			//interfaceOrderProductItemsAdd()
		})
		.css("width", "75px");
	}
}

function interfaceFinancialBankAccountRecoRow(oRow)
{
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<tr class="interfaceMainRow">';
				
	aHTML[++h] = '<td id="interfaceFinancialHomeMostLikely_Title-' + oRow.id + '" class="interfaceMainRow interfaceMainRowSelect reco"' +
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