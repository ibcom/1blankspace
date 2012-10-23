/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */

ns1blankspace.financial.receipt = 
{
	init: 		function interfaceFinancialReceiptMasterViewport(oParam)
				{
					interfaceFinancialMasterInitialise();
					
					var bShowHome = true
					
					if (oParam != undefined)
					{
						if (oParam.showHome != undefined) {bShowHome = oParam.showHome}	
					}

					ns1blankspace.object = 6;
					ns1blankspace.objectName = 'Receipt';
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					
					if (bShowHome)
					{
						ns1blankspaceViewportDestination({
							newDestination: 'interfaceFinancialReceiptMasterViewport({showHome: true});',
							move: false
							})		
					}	
							
					ns1blankspaceReset();
					
					$('#divns1blankspaceViewportControlSet').button(
					{
						label: "Receipts"
					});
					
					$('#inputns1blankspaceViewportControlSearch').keyup(function(event)
					{
						if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
				        ns1blankspace.timer.delayCurrent = setTimeout("interfaceFinancialReceiptSearch('inputns1blankspaceViewportControlSearch')", ns1blankspace.option.typingWait);
					});
					
					$('#spanns1blankspaceViewportControlSearch').click(function(event)
					{
						interfaceFinancialReceiptSearch('inputns1blankspaceViewportControlSearch');
					});
					
					$('#spanns1blankspaceViewportControlSearchOptions').click(function(event)
					{
						interfaceFinancialReceiptSearchOptions();
					});
					
					$('#spanns1blankspaceViewportControlNew').click(function(event)
					{
						interfaceFinancialReceiptNew();
					})
					
					$('#spanns1blankspaceViewportControlNewOptions').click(function(event)
					{
						interfaceFinancialReceiptNewOptions();
					});
					
					$('#spanns1blankspaceViewportControlAction').click(function(event)
					{
						interfaceFinancialReceiptSave();
					});
					
					$('#spanns1blankspaceViewportControlActionOptions').click(function(event)
					{
						interfaceFinancialReceiptSaveOptions();
					});
					
					$('#spanns1blankspaceViewportControlSetup').click(function(event)
					{
						interfaceFinancialReceiptSetup();
					});
					
					$('#spanns1blankspaceViewportControlSetupOptions').click(function(event)
					{
						interfaceFinancialReceiptSetupOptions();
					});
					
					$('#spanns1blankspaceViewportControlHelp').click(function(event)
					{
						interfaceFinancialReceiptHelp();
					});
					
					$('#spanns1blankspaceViewportControlHelpOptions').click(function(event)
					{
						interfaceFinancialReceiptHelpOptions();
					});
					
					$('td.interfaceViewportMasterControlBrowse').click(function(event)
					{
						interfaceFinancialReceiptSearch(event.target.id, {source: ns1blankspace.data.searchSource.browse});
					});
					
					$('td.interfaceViewportMasterControlBrowseAll').click(function(event)
					{
						interfaceFinancialReceiptSearch(event.target.id, {source: ns1blankspace.data.searchSource.browse});
					});
					
					if (ns1blankspace.option.setFocus) {$('#inputns1blankspaceViewportControlSearch').focus()};
					if (bShowHome) {interfaceFinancialReceiptHomeShow()};	
				},

	refresh: 	function interfaceFinancialReceiptRefresh(oResponse)
				{
					if (oResponse == undefined)
					{
						$('#spanInterfaceViewportControlSubContext_amount').html(ns1blankspace.xhtml.loadingSmall);
							
						var oSearch = new AdvancedSearch();
						oSearch.method = 'FINANCIAL_RECEIPT_SEARCH';
						oSearch.addField('receiveddate,amount,tax');
						oSearch.rf = 'json';
						oSearch.addFilter('id', 'EQUAL_TO', ns1blankspace.objectContext);
						
						oSearch.getResults(function(data) {interfaceFinancialReceiptRefresh(data)});
					}
					else
					{
						var oObjectContext = oResponse.data.rows[0];
						
						ns1blankspace.objectContextData.receiveddate = oObjectContext.receiveddate;
						ns1blankspace.objectContextData.amount = oObjectContext.amount;
								
						$('#spanInterfaceViewportControlSubContext_receiveddate').html(oObjectContext.receiveddate);
						$('#spanInterfaceViewportControlSubContext_amount').html(oObjectContext.amount);
					}
				}			

	home: 		function interfaceFinancialReceiptHomeShow(oResponse)
				{
					if (oResponse == undefined)
					{
						var aHTML = [];
						var h = -1;
									
						aHTML[++h] = '<table id="tableInterfaceViewportMain" class="interfaceViewportMain">';
						aHTML[++h] = '<tr id="trInterfaceViewportMain" class="interfaceViewportMain">' +
										'<td id="tdInterfaceProjectHomeMostLikely" class="interfaceViewportMain">' +
										ns1blankspace.xhtml.loading + 
										'</td>' +
										'</tr>';
						aHTML[++h] = '</table>';					
						
						$('#divInterfaceMain').html(aHTML.join(''));
						
						var aHTML = [];
						var h = -1;
									
						aHTML[++h] = '<table>';
						aHTML[++h] = '<tr>' +
										'<td id="ns1blankspaceViewportFinancialLarge" class="ns1blankspaceViewportImageLarge">' +
										'&nbsp;' + 
										'</td>' +
										'</tr>';
						aHTML[++h] = '</table>';		
						
						$('#divInterfaceViewportControl').html(aHTML.join(''));	
						
						$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
						
						var oSearch = new AdvancedSearch();
						oSearch.method = 'FINANCIAL_RECEIPT_SEARCH';
						oSearch.addField('reference,description,contactbusinessreceivedfromtext,contactpersonreceivedfromtext,receiveddate,amount');
						oSearch.rows = 10;
						oSearch.sort('modifieddate', 'desc');
						oSearch.getResults(interfaceFinancialReceiptHomeShow);
					}
					else
					{
						var aHTML = [];
						var h = -1;
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML[++h] = '<table id="tableInterfaceFinancialReceiptHomeMostLikely">';
							aHTML[++h] = '<tr class="trInterfaceFinancialReceiptHomeMostLikelyNothing">';
							aHTML[++h] = '<td class="tdInterfaceFinancialReceiptHomeMostLikelyNothing">Click New to create a invoice.</td>';
							aHTML[++h] = '</tr>';
							aHTML[++h] = '</table>';
						}
						else
						{
							aHTML[++h] = '<table id="tableInterfaceFinancialReceiptHomeMostLikely">';
							
							$.each(oResponse.data.rows, function()
							{					
								aHTML[++h] = '<tr class="interfaceMainRow">';
								
								aHTML[++h] = '<td id="interfaceFinancialReceiptHomeMostLikely_Title-' + this.id + '" class="interfaceHomeMostLikely" style="width:50px;">' +
														this.reference + '</td>';
								
								aHTML[++h] = '<td id="interfaceFinancialReceiptHomeMostLikely_Amount-' + this.id + '" class="interfaceHomeMostLikelySub" style="width:50px;text-align:right;">' +
														'$' + this.amount + '</td>';
																		
								aHTML[++h] = '<td id="interfaceFinancialReceiptHomeMostLikely_DueDate-' + this.id + '" class="interfaceHomeMostLikelySub" style="width:90px;">' +
														this.receiveddate + '</td>';
																										
								var sContact = this.contactbusinessreceivedfromtext;
								if (sContact == '') {sContact = this.contactpersonreceivedfromtext}
								
								aHTML[++h] = '<td id="interfaceFinancialReceiptHomeMostLikely_Contact-' + this.id + '" class="interfaceHomeMostLikelySub">' +
														sContact + '</td>';
									
								aHTML[++h] = '</tr>'
							});
							
							aHTML[++h] = '</tbody></table>';
						}
						
						$('#tdInterfaceProjectHomeMostLikely').html(aHTML.join(''));
					
						$('td.interfaceHomeMostLikely').click(function(event)
						{
							interfaceFinancialReceiptSearch(event.target.id, {source: 1});
						});
					}
				},

	search: 	{
					send:		function interfaceFinancialReceiptSearch(sXHTMLElementId, oParam)
								{
									var aSearch = sXHTMLElementId.split('-');
									var sElementId = aSearch[0];
									var sSearchContext = aSearch[1];
									var iMinimumLength = 3;
									var iSource = ns1blankspace.data.searchSource.text;
									var sSearchText;
									var iMaximumColumns = 1;
									var iRows = 10;
									
									if (oParam != undefined)
									{
										if (oParam.source != undefined) {iSource = oParam.source}
										if (oParam.searchText != undefined) {sSearchText = oParam.searchText}
										if (oParam.rows != undefined) {iRows = oParam.rows}
										if (oParam.searchContext != undefined) {sSearchContext = oParam.searchContext}
										if (oParam.minimumLength != undefined) {iMinimumLength = oParam.minimumLength}
										if (oParam.maximumColumns != undefined) {iMaximumColumns = oParam.maximumColumns}
									}
									
									if (sSearchContext != undefined  && iSource != ns1blankspace.data.searchSource.browse)
									{
										$('#divInterfaceViewportControl').html(ns1blankspace.xhtml.loading);
										
										ns1blankspace.objectContext = sSearchContext;
										
										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_RECEIPT_SEARCH';
										oSearch.addField('contactbusinessreceivedfromtext,contactbusinessreceivedfrom,' +
																'contactpersonreceivedfromtext,contactpersonreceivedfrom,' +
																'projecttext,project,areatext,area,' +
																'reference,paymentmethodtext,paymentmethod,receiveddate,description,amount,tax');
										oSearch.rf = 'json';
										oSearch.addFilter('id', 'EQUAL_TO', sSearchContext);
										
										oSearch.getResults(function(data) {interfaceFinancialReceiptShow(oParam, data)});
									}
									else
									{
										if (sSearchText == undefined)
										{
											sSearchText = $('#inputns1blankspaceViewportControlSearch').val();
										}	
										
										if (iSource == ns1blankspace.data.searchSource.browse)
										{
											iMinimumLength = 1;
											iMaximumColumns = 4;
											var aSearch = sSearch.split('-');
											sSearchText = aSearch[1];
										}
										
										if (sSearchText.length >= iMinimumLength || iSource == ns1blankspace.data.searchSource.browse)
										{
											ns1blankspaceOptionsSetPosition(sElementId);
											
											var oSearch = new AdvancedSearch();
											oSearch.method = 'FINANCIAL_RECEIPT_SEARCH';
											oSearch.addField('contactbusinessreceivedfromtext,contactbusinessreceivedfrom,' +
																'contactpersonreceivedfromtext,contactpersonreceivedfrom,' +
																'reference,receiveddate,description,amount');
											oSearch.rf = 'json';
											oSearch.addFilter('quicksearch', 'STRING_IS_LIKE', sSearchText);
											
											oSearch.getResults(function(data) {interfaceFinancialReceiptSearchShow(oParam, data)});	
										}
									};	
								},

					process:	function interfaceFinancialReceiptSearchShow(oParam, oResponse)
								{

									var iColumn = 0;
									var aHTML = [];
									var h = -1;
									var	iMaximumColumns = 1;
										
									if (oResponse.data.rows.length == 0)
									{
										$('#divns1blankspaceViewportControlOptions').hide();
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
										
											aHTML[++h] = '<td class="interfaceSearch" id="' + +
															'-' + this.id + '">' +
															this.reference +
															'</td>';
											
											if (iColumn == iMaximumColumns)
											{
												aHTML[++h] = '</tr>'
												iColumn = 0;
											}	
										});
								    	
										aHTML[++h] = '</tbody></table>';

										$('#divns1blankspaceViewportControlOptions').html(aHTML.join(''));
										$('#divns1blankspaceViewportControlOptions').show(ns1blankspace.option.showSpeedOptions);
										
										$('td.interfaceSearch').click(function(event)
										{
											$('#divns1blankspaceViewportControlOptions').html('&nbsp;');
											$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions)
											interfaceFinancialReceiptSearch(event.target.id, {source: 1});
										});
									}				
								}
				},		

	layout:		function interfaceFinancialReceiptViewport()
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
						
						/*
						aHTML[++h] = '<tr id="trInterfaceViewportControlItem" class="interfaceViewportControl">' +
										'<td id="tdInterfaceViewportControlItem" class="interfaceViewportControl">Items</td>' +
										'</tr>';
						*/
										
						aHTML[++h] = '</table>';					
					
						aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
									
						aHTML[++h] = '<tr id="trInterfaceViewportControlInvoices" class="interfaceViewportControl">' +
										'<td id="tdInterfaceViewportControlInvoices" class="interfaceViewportControl">Invoices</td>' +
										'</tr>';
									
						aHTML[++h] = '</table>';					

						aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
					
						aHTML[++h] = '<tr id="trInterfaceViewportControlGL" class="interfaceViewportControl">' +
										'<td id="tdInterfaceViewportControlGL" class="interfaceViewportControl">GL</td>' +
										'</tr>';
									
						aHTML[++h] = '</table>';					
					
						aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
					
						aHTML[++h] = '<tr id="trInterfaceViewportControlActions" class="interfaceViewportControl">' +
										'<td id="tdInterfaceViewportControlActions" class="interfaceViewportControl">Actions</td>' +
										'</tr>';
									
						aHTML[++h] = '<tr id="trInterfaceViewportControlAttachments" class="interfaceViewportControl">' +
										'<td id="tdInterfaceViewportControlAttachments" class="interfaceViewportControl">Attachments</td>' +
										'</tr>';
					}
									
					aHTML[++h] = '</table>';					
							
					$('#divInterfaceViewportControl').html(aHTML.join(''));
					
					var aHTML = [];
					var h = -1;

					aHTML[++h] = '<div id="divInterfaceMainContext" class="divInterfaceViewportMainContext"></div>';
					aHTML[++h] = '<div id="divInterfaceMainSummary" class="divInterfaceViewportMain"></div>';
					aHTML[++h] = '<div id="divInterfaceMainDetails" class="divInterfaceViewportMain"></div>';
					aHTML[++h] = '<div id="divInterfaceMainItem" class="divInterfaceViewportMain"></div>';
					aHTML[++h] = '<div id="divInterfaceMainInvoice" class="divInterfaceViewportMain"></div>';
					aHTML[++h] = '<div id="divInterfaceMainTransaction" class="divInterfaceViewportMain"></div>';
					aHTML[++h] = '<div id="divInterfaceMainActions" class="divInterfaceViewportMain"></div>';
					aHTML[++h] = '<div id="divInterfaceMainAttachments" class="divInterfaceViewportMain"></div>';
					
					$('#divInterfaceMain').html(aHTML.join(''));
					
					$('#tdInterfaceViewportControlSummary').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainSummary");
						interfaceFinancialReceiptSummary();
					});
					
					$('#tdInterfaceViewportControlDetails').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainDetails");
						interfaceFinancialReceiptDetails();
					});
					
					$('#tdInterfaceViewportControlItem').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainItem", true);
						interfaceFinancialReceiptItem();
					});

					$('#tdInterfaceViewportControlInvoices').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainInvoice", true);
						interfaceFinancialReceiptInvoice();
					});
					
					$('#tdInterfaceViewportControlGL').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainTransaction", true);
						interfaceFinancialTransaction();
						//You'll find this in 1blankspace.financial-[].js
					});

					$('#tdInterfaceViewportControlActions').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainActions", true);
						ns1blankspaceActions({xhtmlElementID: 'divInterfaceMainActions'});
					});

					$('#tdInterfaceViewportControlAttachments').click(function(event)
					{
						ns1blankspaceMainViewportShow("#divInterfaceMainAttachments", true);
						ns1blankspaceAttachments({xhtmlElementID: 'divInterfaceMainAttachments'});
					});
				},

	show:		function interfaceFinancialReceiptShow(oParam, oResponse)
				{
					$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
					interfaceFinancialReceiptViewport();
					
					var aHTML = [];
					var h = -1;
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
						
						aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find the receipt.</td></tr>';
						aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
								
						$('#divInterfaceMain').html(aHTML.join(''));
					}
					else
					{
						ns1blankspace.objectContextData = oResponse.data.rows[0];
						
						$('#spanns1blankspaceViewportControlAction').button({disabled: false});
									
						$('#divInterfaceViewportControlContext').html(ns1blankspace.objectContextData.reference +
							'<br /><span class="interfaceViewportControlSubContext" id="spanInterfaceViewportControlSubContext_receiveddate">' +
							 		ns1blankspace.objectContextData.receiveddate + '</span>' +
							'<br /><span class="interfaceViewportControlSubContext" id="spanInterfaceViewportControlSubContext_amount">' +
									ns1blankspace.objectContextData.amount + '</span>');
							
						ns1blankspaceViewportDestination({
							newDestination: 'interfaceFinancialReceiptMasterViewport({showHome: false});interfaceFinancialReceiptSearch("-' + ns1blankspace.objectContext + '")',
							move: false
							})
						
						ns1blankspaceObjectViewportHistory({functionDefault: 'interfaceFinancialReceiptSummary()'});
					}	
				},		
		
	summary:	function interfaceFinancialReceiptSummary()
				{
					var aHTML = [];
					var h = -1;
					
					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find the receipt.</td></tr>';
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
						
						if (ns1blankspace.objectContextData.amount != '')
						{
							aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryAmountValue" class="interfaceMainSummaryValue" style="font-size:1.5em;font-weight:bold;">';
							aHTML[++h] = '$' + ns1blankspace.objectContextData.amount;
							aHTML[++h] = '</td></tr>';
						}	
						
						if (ns1blankspace.objectContextData.contactbusinessreceivedfromtext != '')
						{
							aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryBusiness" class="interfaceMainSummary">Business</td></tr>' +
										'<tr><td id="tdInterfaceMainSummaryBusinessValue" class="interfaceMainSummaryValue">' +
										ns1blankspace.objectContextData.contactbusinessreceivedfromtext +
										'</td></tr>';
						}
						
						if (ns1blankspace.objectContextData.contactpersonreceivedfromtext != '')
						{
							aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryPerson" class="interfaceMainSummary">Person</td></tr>' +
										'<tr><td id="tdInterfaceMainSummaryPersonValue" class="interfaceMainSummaryValue">' +
										ns1blankspace.objectContextData.contactpersonreceivedfromtext +
										'</td></tr>';
						}
						
						aHTML[++h] = '<tr><td id="tdInterfaceMainSummarySentDate" class="interfaceMainSummary">Sent Date</td></tr>' +
									'<tr><td id="tdInterfaceMainSummarySentDateValue" class="interfaceMainSummaryValue">' +
									ns1blankspace.objectContextData.receiveddate +
									'</td></tr>';		
					
						if (ns1blankspace.objectContextData.description != '')
						{
							aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryDescription" class="interfaceMainSummary">Description</td></tr>' +
										'<tr><td id="tdInterfaceMainSummaryDescriptionValue" class="interfaceMainSummaryValue">' +
										ns1blankspace.objectContextData.description +
										'</td></tr>';
						}
						
						aHTML[++h] = '</table>';					
						
						$('#tdInterfaceMainSummaryColumn1Large').html(aHTML.join(''));
					}	
				},

	details: 	function interfaceFinancialReceiptDetails()
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
						
						aHTML[++h] = '<tr id="trInterfaceMainDetailsReference" class="interfaceMain">' +
										'<td id="tdInterfaceMainDetailsReference" class="interfaceMain">' +
										'Reference' +
										'</td></tr>' +
										'<tr id="trInterfaceMainDetailsReferenceValue" class="interfaceMainText">' +
										'<td id="tdInterfaceMainDetailsReferenceValue" class="interfaceMainText">' +
										'<input id="inputInterfaceMainDetailsReference" class="inputInterfaceMainText">' +
										'</td></tr>';								
							
						aHTML[++h] = '<tr id="trInterfaceMainDetailsReceivedDate" class="interfaceMain">' +
										'<td id="tdInterfaceMainDetailsReceivedDate" class="interfaceMain">' +
										'Received Date' +
										'</td></tr>' +
										'<tr id="trInterfaceMainDetailsReceivedDateValue" class="interfaceMainText">' +
										'<td id="tdInterfaceMainDetailsReceivedDateValue" class="interfaceMainText">' +
										'<input id="inputInterfaceMainDetailsReceivedDate" class="inputInterfaceMainDate">' +
										'</td></tr>';					
						
						aHTML[++h] = '<tr id="trInterfaceMainDetailsContactBusinessReceivedFrom" class="interfaceMain">' +
										'<td id="tdInterfaceMainDetailsContactBusinessReceivedFrom" class="interfaceMain">' +
										'Business' +
										'</td></tr>' +
										'<tr id="trInterfaceMainDetailsContactBusinessReceivedFromValue" class="interfaceMainSelect">' +
										'<td id="tdInterfaceMainDetailsContactBusinessReceivedFromValue" class="interfaceMainSelect">' +
										'<input id="inputInterfaceMainDetailsContactBusinessReceivedFrom" class="inputInterfaceMainSelect"' +
											' data-method="CONTACT_BUSINESS_SEARCH"' +
											' data-columns="tradename">' +
										'</td></tr>';
										
						aHTML[++h] = '<tr id="trInterfaceMainDetailsContactPersonReceivedFrom" class="interfaceMain">' +
										'<td id="tdInterfaceMainDetailsContactPersonReceivedFrom" class="interfaceMain">' +
										'Person' +
										'</td></tr>' +
										'<tr id="trInterfaceMainDetailsContactPersonReceivedFromValue" class="interfaceMainSelect">' +
										'<td id="tdInterfaceMainDetailsContactPersonReceivedFromValue" class="interfaceMainSelect">' +
										'<input id="inputInterfaceMainDetailsContactPersonReceivedFrom" class="inputInterfaceMainSelect"' +
											' data-method="CONTACT_PERSON_SEARCH"' +
											' data-columns="surname"' +
											' data-parent="inputInterfaceMainDetailsContactBusinessReceivedFrom"' +
											' data-parent-search-id="contactbusiness"' +
											' data-parent-search-text="tradename">' +
										'</td></tr>';		
											
						aHTML[++h] = '<tr id="trInterfaceMainDetailsAmount" class="interfaceMain">' +
										'<td id="tdInterfaceMainDetailsAmount" class="interfaceMain">' +
										'Amount' +
										'</td></tr>' +
										'<tr id="trInterfaceMainDetailsAmountValue" class="interfaceMainText">' +
										'<td id="tdInterfaceMainDetailsAmountValue" class="interfaceMainText">' +
										'<input id="inputInterfaceMainDetailsAmount" class="inputInterfaceMainText">' +
										'</td></tr>';	
											
						aHTML[++h] = '</table>';					
						
						$('#tdInterfaceMainDetailsColumn1').html(aHTML.join(''));
						
						$('input.inputInterfaceMainDate').datepicker({dateFormat: 'dd M yy'});
						
						var aHTML = [];
						var h = -1;
							
						aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn2" class="interfaceMain">';
						
						aHTML[++h] = '<tr id="trInterfaceMainDetailsDescription" class="interfaceMain">' +
										'<td id="tdInterfaceMainDetailsDescription" class="interfaceMain">' +
										'Description' +
										'</td></tr>' +
										'<tr id="trInterfaceMainDetailsDescriptionValue" class="interfaceMainTextMulti">' +
										'<td id="tdInterfaceMainDetailsDescriptionValue" class="interfaceMainTextMulti">' +
										'<textarea rows="10" cols="35" id="inputInterfaceMainDetailsDescription" class="inputInterfaceMainTextMulti"></textarea>' +
										'</td></tr>';
						
						aHTML[++h] = '</table>';					
							
						$('#tdInterfaceMainDetailsColumn2').html(aHTML.join(''));

						if (ns1blankspace.objectContextData != undefined)
						{
							$('#inputInterfaceMainDetailsReference').val(ns1blankspace.objectContextData.reference);
							$('#inputInterfaceMainDetailsReceivedDate').val(ns1blankspace.objectContextData.receiveddate);
							$('#inputInterfaceMainDetailsContactBusinessReceivedFrom').attr('data-id', ns1blankspace.objectContextData.contactbusinessreceivedfrom);
							$('#inputInterfaceMainDetailsContactBusinessReceivedFrom').val(ns1blankspace.objectContextData.contactbusinessreceivedfromtext);
							$('#inputInterfaceMainDetailsContactPersonReceivedFrom').attr('data-id', ns1blankspace.objectContextData.contactpersonreceivedfrom);
							$('#inputInterfaceMainDetailsContactPersonReceivedFrom').val(ns1blankspace.objectContextData.contactpersonreceivedfromtext);	
							$('#inputInterfaceMainDetailsAmount').val(ns1blankspace.objectContextData.amount);		
							$('#inputInterfaceMainDetailsDescription').val(ns1blankspace.objectContextData.description);
						}
					}	
				},

	new:		function interfaceFinancialReceiptNew(oParam)
				{
					ns1blankspace.objectContextData = undefined
					ns1blankspace.objectContext = -1;
					interfaceFinancialReceiptViewport();
					$('#spanns1blankspaceViewportControlAction').button({disabled: false});
					ns1blankspaceMainViewportShow("#divInterfaceMainDetails");
					interfaceFinancialReceiptDetails();
				},			

	save: 		{
					send:		function interfaceFinancialReceiptSave(oParam, oResponse)
								{
									ns1blankspaceStatusWorking();
									
									var sData = (ns1blankspace.objectContext == -1)?'':'id=' + ns1blankspace.objectContext;
										
									if ($('#divInterfaceMainDetails').html() != '')
									{
										sData += '&reference=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsReference').val());
										sData += '&receiveddate=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsReceivedDate').val());
										sData += '&description=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsDescription').val());
										sData += '&contactbusinessreceivedfrom=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsContactBusinessReceivedFrom').attr("data-id"));
										sData += '&contactpersonreceivedfrom=' + ns1blankspace.util.fs($('#inputInterfaceMainDetailsContactPersonReceivedFrom').attr("data-id"));
									}
									
									$.ajax(
									{
										type: 'POST',
										url: ns1blankspaceEndpointURL('FINANCIAL_RECEIPT_MANAGE'),
										data: sData,
										dataType: 'json',
										success: function(data) {interfaceFinancialRecieptSaveProcess(data)}
									});
								},

					process:	function interfaceFinancialRecieptSaveProcess(oResponse)
								{
									if (oResponse.status == 'OK')
									{
										ns1blankspaceStatus('Saved');
										if (ns1blankspace.objectContext == -1) {var bNew = true}
										ns1blankspace.objectContext = oResponse.id;	
										
										if ($('#divInterfaceMainDetails').html() != '')
										{
											interfaceFinancialReceiptAmountSave();
										}
									}
									else
									{
										ns1blankspaceError(oResponse.error.errornotes);
									}
								},

					amount:		function interfaceFinancialReceiptAmountSave(oParam)
								{
									var iAccount = ns1blankspace.financial.settings.financialaccountdebtor;
									var cAmount = $('#inputInterfaceMainDetailsAmount').val();
									if (cAmount == '') {cAmount = 0};
									cAmount = (cAmount - ns1blankspace.objectContextData.amount)
									
									if (cAmount == 0 || iAccount == undefined)
									{
										if (iAccount == undefined) {alert('No debitor account set up.')}
									}
									else
									{
										var sData = 'object=' + ns1blankspace.object;
										sData += '&objectcontext=' + ns1blankspace.objectContext;
										sData += '&financialaccount=' + iAccount;
										sData += '&amount=' + cAmount;
										sData += '&description=' + $('#inputInterfaceMainDetailsDescription').val();
										
										$.ajax(
										{
											type: 'POST',
											url: '/ondemand/financial/?method=FINANCIAL_ITEM_MANAGE',
											data: sData,
											dataType: 'json',
											success: function(oResponse)
											{
												var sData = 'object=' + ns1blankspace.object;
												sData += '&objectcontext=' + ns1blankspace.objectContext;
											
												$.ajax(
												{
													type: 'POST',
													url: '/ondemand/financial/?method=FINANCIAL_ITEM_COMPLETE',
													data: sData,
													dataType: 'json',
													success: function(oResponse)
													{
														interfaceFinancialReceiptRefresh();
													}
												});
											}
										});
									}	
								}
				},				

	item: 		{
					show: 		function interfaceFinancialReceiptItem(oParam, oResponse)
								{
									var iObjectContext = ns1blankspace.objectContext;
									var sXHTMLElementId = 'divInterfaceMainItem';
									var oOptions = {view: true, remove: true};
									var oActions = {add: true};
									
									if (oParam != undefined)
									{
										if (oParam.objectContext != undefined) {iObjectContext = oParam.objectContext}
										if (oParam.xhtmlElementId != undefined) {sXHTMLElementId = oParam.xhtmlElementId}
										if (oParam.options != undefined) {oOptions = oParam.options}
										if (oParam.actions != undefined) {oActions = oParam.actions}
									}		
										
									if (oResponse == undefined)
									{	
										var aHTML = [];
										var h = -1;	
													
										aHTML[++h] = '<table id="tableInterfaceMainItem" class="interfaceMain">' +
													'<tr id="trInterfaceMainItemRow1" class="interfaceMainRow1">' +
													'<td id="tdInterfaceMainItemColumn1" class="interfaceMainColumn1Large">' +
													ns1blankspace.xhtml.loading +
													'</td>' +
													'<td id="tdInterfaceMainItemColumn2" class="interfaceMainColumn2Action" style="width: 200px;">' +
													'</td>' +
													'</tr>' +
													'</table>';					
											
										$('#' + sXHTMLElementId).html(aHTML.join(''));
										
										if (oActions != undefined)
										{
												
											sXHTMLElementId = 'tdInterfaceMainItemColumn1';
											
											var aHTML = [];
											var h = -1;	
											
											aHTML[++h] = '<table id="tableInterfaceMainItemColumn2" class="interfaceMainColumn2">';
											
											if (oActions.add)
											{
												aHTML[++h] = '<tr><td id="tdInterfaceMainItemAdd" class="interfaceMainAction">' +
															'<span id="spanInterfaceMainItemAdd">Add</span>' +
															'</td></tr>';
											}
											
											aHTML[++h] = '</table>';					
											
											$('#tdInterfaceMainItemColumn2').html(aHTML.join(''));
										
											$('#spanInterfaceMainItemAdd').button(
											{
												label: "Add"
											})
											.click(function() {
												 ns1blankspaceFinanicalInvoiceItemAdd(oParam);
											})
											
										}
										
										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_ITEM_SEARCH';
										oSearch.addField('financialaccounttext,tax,issuedamount');
										oSearch.addFilter('object', 'EQUAL_TO', ns1blankspace.object);
										oSearch.addFilter('objectcontext', 'EQUAL_TO', ns1blankspace.objectContext);
										oSearch.sort('financialaccounttext', 'asc');
										
										oSearch.getResults(function(data) {interfaceFinancialReceiptItem(oParam, data)});
									}
									else
									{
										var aHTML = [];
										var h = -1;
										
										if (oResponse.data.rows.length == 0)
										{
											aHTML[++h] = '<table id="tableFinancialReceiptItem" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
											aHTML[++h] = '<tbody>'
											aHTML[++h] = '<tr class="interfaceMainCaption">' +
															'<td class="interfaceMainRowNothing">No items.</td></tr>';
											aHTML[++h] = '</tbody></table>';

											$('#' + sXHTMLElementId).html(aHTML.join(''));
										}
										else
										{
											aHTML[++h] = '<table id="tableClientAudits" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
											aHTML[++h] = '<tbody>'
											aHTML[++h] = '<tr class="interfaceMainCaption">';
											aHTML[++h] = '<td class="interfaceMainCaption">Financial Account</td>';
											aHTML[++h] = '<td class="interfaceMainCaption" style="text-align:right;">GST</td>';
											aHTML[++h] = '<td class="interfaceMainCaption" style="text-align:right;">Amount</td>';
											aHTML[++h] = '<td class="interfaceMainCaption">&nbsp;</td>';
											aHTML[++h] = '</tr>';
											
											$.each(oResponse.data.rows, function()
											{
												aHTML[++h] = '<tr class="interfaceMainRow">';
																
												aHTML[++h] = '<td id="tdWebsiteLineitem_financialaccounttext-' + this.id + '" class="interfaceMainRow">' +
																		this["financialaccounttext"] + '</td>';
																		
												aHTML[++h] = '<td id="tdWebsiteLineitem_financialaccounttext-' + this.id + '" style="text-align:right;" class="interfaceMainRow">' +
																		this["tax"] + '</td>';
																		
												aHTML[++h] = '<td id="tdWebsiteLineitem_financialaccounttext-' + this.id + '" style="text-align:right;" class="interfaceMainRow">' +
																		this["issuedamount"] + '</td>';
																		
												aHTML[++h] = '<td style="width:60px;text-align:right;" class="interfaceMainRow">';
													
												if (oOptions.remove)
												{	
													aHTML[++h] = '<span id="spanInvoiceItem_options_remove-' + this.id + '" class="interfaceMainRowOptionsRemove"></span>';
												};	
													
												if (oOptions.view)
												{	
													aHTML[++h] = '<span id="spanInvoiceItem_options_view-' + this.id + '" class="interfaceMainRowOptionsView"></span>';
												};	
													
												aHTML[++h] = '</td>';				
												aHTML[++h] = '</tr>';
											});
											
											aHTML[++h] = '</tbody></table>';

											$('#' + sXHTMLElementId).html(aHTML.join(''));
											
											if (oOptions.remove) 
											{
												$('.interfaceMainRowOptionsRemove').button( {
													text: false,
													icons: {
														primary: "ui-icon-close"
													}
												})
												.click(function() {
													ns1blankspaceInvoiceItemRemove({xhtmlElementID: this.id});
												})
												.css('width', '15px')
												.css('height', '17px')
											}
											
											if (oOptions.view) 
											{
												$('.interfaceMainRowOptionsView').button( {
													text: false,
													icons: {
														primary: "ui-icon-play"
													}
												})
												.click(function() {
													ns1blankspaceInvoiceItemAdd({xhtmlElementID: this.id})
												})
												.css('width', '15px')
												.css('height', '17px')
											}	
										}
									}	
								},

					add:		function ns1blankspaceFinancialReceiptItemAdd(oParam, oResponse)
								{
									var iStep = 1;
									
									if (oParam != undefined)
									{
										if (oParam.step != undefined) {iStep = oParam.step}	
									}
									
									if (oResponse == undefined)
									{
										if (iStep == 1)
										{
											var aHTML = [];
											var h = -1;
													
											aHTML[++h] = '<table id="tableInterfaceMainInvoiceItemAddColumn2" class="interfaceMain">';
									
											aHTML[++h] = '<tr id="trInterfaceMainInvoiceItemAddReference" class="interfaceMain">' +
															'<td id="tdInterfaceMainInvoiceItemAddReference" class="interfaceMain">' +
															'Account' +
															'</td></tr>' +
															'<tr id="trInterfaceMainInvoiceItemAddReferenceValue" class="interfaceMainText">' +
															'<td id="tdInterfaceMainInvoiceItemAddReferenceValue" class="interfaceMainText">' +
															'<input id="inputInterfaceMainInvoiceItemAddReference" class="inputInterfaceMainText">' +
															'</td></tr>';
											
											aHTML[++h] = '<tr id="trInterfaceMainInvoiceItemAdd" class="interfaceMain">' +
															'<td id="tdInterfaceMainInvoiceItemAddSearch" class="interfaceMain">' +
															'<span id="spanInterfaceMainInvoiceItemAddSearch">Search</span>' +
															'</td></tr>';
											
											aHTML[++h] = '<tr id="trInterfaceMainInvoiceItemAdd" class="interfaceMain">' +
															'<td id="tdInterfaceMainInvoiceItemAddSearchResults" class="interfaceMain">' +
															'Enter a code or title and click search.' +
															'</td></tr>';
																			
											aHTML[++h] = '</tbody></table>';		
											
											$('#tdInterfaceMainItemColumn2').html(aHTML.join(''));

											$('#spanInterfaceMainInvoiceItemAddSearch').button(
												{
													label: "Search"
												})
												.click(function() {
													ns1blankspaceFinanicalInvoiceItemAdd($.extend(true, oParam, {step: 2}))
												})
												.css('width', '75px')
										}
										if (iStep == 2)
										{
											var sParam = 'method=SETEP_FINANCIAL_ITEM_SEARCH&title=' + $('inputInterfaceMainInvoiceItemAddReference').val();
											sParam += '&includeimage=1';
									
											$.ajax(
											{
												type: 'GET',
												url: '/ondemand/setup/?' + sParam,
												dataType: 'json',
												success: function(data){ns1blankspaceFinanicalInvoiceItemAdd($.extend(true, oParam, {step:3}), data)}
											});	
										}
									}
									else
									{
										var aHTML = [];
										var h = -1;

										if (oResponse.data.rows.length == 0)	
										{
											aHTML[++h] = '<table border="0" cellspacing="0" cellpadding="0" width="750" style="margin-top:15px; margin-bottom:15px;">';
											aHTML[++h] = '<tbody>'
											aHTML[++h] = '<tr class="interfaceActions">';
											aHTML[++h] = '<td class="interfaceMainRowNothing">No accounts.</td>';
											aHTML[++h] = '</tr>';
											aHTML[++h] = '</tbody></table>';

											$('#tdInterfaceMainOrderProductsColumn1').html(aHTML.join(''));		
										}
										else
										{	
											$.each(oResponse.data.rows, function() 
											{ 
												aHTML[++h] = '<tr class="interfaceMainRow">';	
															
												aHTML[++h] = '<td id="tdInvoiceItems_title-' + this.id + '" class="interfaceMainRow">' +
																		this.reference + '</td>';
																						
												aHTML[++h] = '</tr>';	

											});
											
											aHTML[++h] = '</tbody></table>';

											$('#tdInterfaceMainInvoiceItemAddSearchResults').html(aHTML.join(''))
											
											//binding
										}
									}	
								}
					},
								
	invoice: 	function interfaceFinancialReceiptInvoice(oParam, oResponse)
				{
					var iObjectContext = ns1blankspace.objectContext;
					var sXHTMLElementId = 'divInterfaceMainInvoice';
					var oOptions = {view: true, remove: true};
					var oActions = {add: true};
					
					if (oParam != undefined)
					{
						if (oParam.objectContext != undefined) {iObjectContext = oParam.objectContext}
						if (oParam.xhtmlElementId != undefined) {sXHTMLElementId = oParam.xhtmlElementId}
						if (oParam.options != undefined) {oOptions = oParam.options}
						if (oParam.actions != undefined) {oActions = oParam.actions}
					}		
						
					if (oResponse == undefined)
					{	
						var aHTML = [];
						var h = -1;	
									
						aHTML[++h] = '<table id="tableInterfaceMainReceipt" class="interfaceMain">' +
									'<tr id="trInterfaceMainReceiptRow1" class="interfaceMainRow1">' +
									'<td id="tdInterfaceMainReceiptColumn1" class="interfaceMainColumn1Large">' +
									ns1blankspace.xhtml.loading +
									'</td>' +
									'<td id="tdInterfaceMainReceiptColumn2" class="interfaceMainColumn2Action" style="width: 200px;">' +
									'</td>' +
									'</tr>' +
									'</table>';					
							
						$('#' + sXHTMLElementId).html(aHTML.join(''));
						
						if (oActions != undefined)
						{
								
							var aHTML = [];
							var h = -1;	
							
							aHTML[++h] = '<table id="tableInterfaceMainReceiptColumn2" class="interfaceMainColumn2">';
							
							if (oActions.add)
							{
								aHTML[++h] = '<tr><td id="tdInterfaceMainReceiptAdd" class="interfaceMainAction">' +
											'<span id="spanInterfaceMainReceiptAdd">Add</span>' +
											'</td></tr>';
							}
							
							aHTML[++h] = '</table>';					
							
							$('#tdInterfaceMainReceiptColumn2').html(aHTML.join(''));
						
							$('#spanInterfaceMainReceiptAdd').button(
							{
								label: "Add"
							})
							.click(function() {
								 interfaceFinancialReceiptReceiptAdd(oParam);
							})
							
						}
						
						var oSearch = new AdvancedSearch();
						oSearch.method = 'FINANCIAL_RECEIPT_INVOICE_SEARCH';
						oSearch.addField('appliesdate,amount');
						oSearch.addFilter('receipt', 'EQUAL_TO', iObjectContext);
						oSearch.sort('appliesdate', 'asc');
						oSearch.getResults(function(data) {interfaceFinancialReceiptInvoice(oParam, data)});
					}
					else
					{
						var aHTML = [];
						var h = -1;
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML[++h] = '<table id="tableFinancialReceiptReceipt" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
							aHTML[++h] = '<tbody>'
							aHTML[++h] = '<tr class="interfaceMainCaption">' +
											'<td class="interfaceMainRowNothing">No invoices.</td></tr>';
							aHTML[++h] = '</tbody></table>';

							$('#' + sXHTMLElementId).html(aHTML.join(''));
						}
						else
						{
							aHTML[++h] = '<table id="tableClientAudits" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
							aHTML[++h] = '<tbody>'
							aHTML[++h] = '<tr class="interfaceMainCaption">';
							aHTML[++h] = '<td class="interfaceMainCaption">Date</td>';
							aHTML[++h] = '<td class="interfaceMainCaption" style="text-align:right;">Amount</td>';
							aHTML[++h] = '<td class="interfaceMainCaption">&nbsp;</td>';
							aHTML[++h] = '</tr>';
							
							$.each(oResponse.data.rows, function()
							{
								aHTML[++h] = '<tr class="interfaceMainRow">';
												
								aHTML[++h] = '<td id="tdWebsiteLineReceipt_financialaccounttext-' + this.id + '" class="interfaceMainRow">' +
														this.appliesdate + '</td>';
														
								aHTML[++h] = '<td id="tdWebsiteLineReceipt_financialaccounttext-' + this.id + '" style="text-align:right;" class="interfaceMainRow">' +
														this.amount + '</td>';
														
								aHTML[++h] = '<td style="width:60px;text-align:right;" class="interfaceMainRow">';
									
								if (oOptions.remove)
								{	
									aHTML[++h] = '<span id="spanInvoiceReceipt_options_remove-' + this.id + '" class="interfaceMainRowOptionsRemove"></span>';
								};	
									
								if (oOptions.view)
								{	
									aHTML[++h] = '<span id="spanInvoiceReceipt_options_view-' + this.id + '" class="interfaceMainRowOptionsView"></span>';
								};	
									
								aHTML[++h] = '</td>';				
								aHTML[++h] = '</tr>';
							});
							
							aHTML[++h] = '</tbody></table>';

							$('#tdInterfaceMainReceiptColumn1').html(aHTML.join(''));
							
							if (oOptions.remove) 
							{
								$('.interfaceMainRowOptionsRemove').button( {
									text: false,
									icons: {
										primary: "ui-icon-close"
									}
								})
								.click(function() {
									ns1blankspaceInvoiceReceiptRemove({xhtmlElementID: this.id});
								})
								.css('width', '15px')
								.css('height', '17px')
							}
							
							if (oOptions.view) 
							{
								$('.interfaceMainRowOptionsView').button( {
									text: false,
									icons: {
										primary: "ui-icon-play"
									}
								})
								.click(function() {
									ns1blankspaceInvoiceReceiptAdd({xhtmlElementID: this.id})
								})
								.css('width', '15px')
								.css('height', '17px')
							}	
						}
					}	
				}
}				