/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 */

ns1blankspace.financial.journal = 
{
	init: 		function (oParam)
				{
					var bInitialised = false;
					
					if (oParam != undefined)
					{
						if (oParam.initialised != undefined) {bInitialised = oParam.initialised}	
					}

					ns1blankspace.app.reset();

					ns1blankspace.object = 122;
					ns1blankspace.objectParentName = 'financial';
					ns1blankspace.objectName = 'journal';
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.viewName = 'Journals';
					ns1blankspace.objectMethod = 'FINANCIAL_GENERAL_JOURNAL';

					if (!bInitialised)
					{
						ns1blankspace.financial.initData(oParam)
					}
					else
					{
						ns1blankspace.app.set(oParam);
					}	
				},

	refresh:	function (oResponse)
				{
					if (oResponse == undefined)
					{
						$('#ns1blankspaceControlContext_balance').html(ns1blankspace.xhtml.loadingSmall);
							
						var oSearch = new AdvancedSearch();
						oSearch.method = 'FINANCIAL_GENERAL_JOURNAL_ITEM_SEARCH';
						oSearch.addField('creditamount,credittax,debitamount,debittax');
						oSearch.addFilter('generaljournal', 'EQUAL_TO', ns1blankspace.objectContext);
						oSearch.rows = 1000;
						oSearch.getResults(function(data) {ns1blankspace.financial.journal.refresh(data)});
					}
					else
					{
						var oBalance =
						{
							creditamount: 0,
							credittax: 0,
							debitamount: 0,
							debittax: 0
						};
						
						$.each(oResponse.data.rows, function()
						{
							oBalance.creditamount += (this.creditamount).parseCurrency();
							oBalance.credittax += (this.credittax).parseCurrency();
							oBalance.debitamount += (this.debitamount).parseCurrency();
							oBalance.debittax += (this.debittax).parseCurrency();
						});	

						ns1blankspace.objectContextData.balanceAmount = oBalance.creditamount - oBalance.debitamount;
						ns1blankspace.objectContextData.balanceTax = oBalance.credittax - oBalance.debittax;
						
						var sHTML = '$' + (oBalance.creditamount).formatMoney(2, ".", ",");

						if (parseInt(ns1blankspace.objectContextData.balanceAmount) !== 0)
						{
							sHTML += '<br /><span style="background-color:red; color: white;">' +
												'$' + (ns1blankspace.objectContextData.balanceAmount).formatMoney(2, ".", ",") + '</span>';
						}

						if (parseInt(oBalance.credittax) !== 0)
						{
							sHTML += '<br /><span class="ns1blankspaceSub" style="font-size:0.75em;">' +
												ns1blankspace.option.taxVATCaption + '</span>';

							sHTML += ' $' + (oBalance.credittax).formatMoney(2, ".", ",");;
						}

						if (parseInt(ns1blankspace.objectContextData.balanceTax) !== 0)
						{
							if (parseInt(oBalance.credittax) === 0)
							{
								sHTML += '<br /><span class="ns1blankspaceSub" style="font-size:0.75em;">' +
												ns1blankspace.option.taxVATCaption + '</span> ';
							}					
							else
							{
								sHTML += '<br />'
							}

							sHTML += '<span style="background-color:red; color: white;">' +
												'$' + (ns1blankspace.objectContextData.balanceTax).formatMoney(2, ".", ",") + '</span>';
						}

						$('#ns1blankspaceControlContext_balance').html(sHTML);
					}
				},

	home: 	function (oParam)
				{	
					var aHTML = [];
								
					aHTML.push('<table class="ns1blankspaceMain">' + 
									'<tr class="ns1blankspaceMain">' +
									'<td id="ns1blankspaceMostLikely" class="ns1blankspaceMain">' +
									ns1blankspace.xhtml.loading +
									'</td></tr>' + 
									'</table>');					
					
					$('#ns1blankspaceMain').html(aHTML.join(''));
										
					var aHTML = [];

					aHTML.push('<table>');
					aHTML.push('<tr><td><div id="ns1blankspaceViewFinancialLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>');

					aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlFinalised" class="ns1blankspaceControl ns1blankspaceHighlight">Finalised</td>' +
									'</tr>');			
								
					aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlPending" class="ns1blankspaceControl">Pending</td>' +
									'</tr>');				

					aHTML.push('</table>');		
					
					$('#ns1blankspaceControl').html(aHTML.join(''));

					$('#ns1blankspaceControlFinalised').click(function(event)
					{
						ns1blankspace.financial.journal.finalised.show();
					});

					$('#ns1blankspaceControlPending').click(function(event)
					{
						ns1blankspace.financial.journal.pending.show();
					});

					ns1blankspace.financial.journal.finalised.show(oParam);
				},

	pending:
				{			
					show: 	function (oParam, oResponse)
								{	
									if (oResponse == undefined)
									{	
										ns1blankspace.status.working();

										$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
										
										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_GENERAL_JOURNAL_SEARCH';
										oSearch.addField('area,areatext,description,id,journaldate,object,objecttext,objectcontext,' +
															'project,projecttext,reference,status,statustext');
										oSearch.rows = 20;
										oSearch.addFilter('status', 'EQUAL_TO', 1);
										oSearch.sort('journaldate', 'desc');
										oSearch.getResults(function(data) {ns1blankspace.financial.journal.pending.show(oParam, data)});
									}
									else
									{
										ns1blankspace.status.clear();

										var aHTML = [];
										
										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table id="ns1blankspaceMostLikely">');
											aHTML.push('<tr><td class="ns1blankspaceNothing">Click New to add a general journal.</td></tr>');
											aHTML.push('</table>');
										}
										else
										{
											aHTML.push('<table class="ns1blankspace" id="ns1blankspaceFinancialJournalPending">');

											aHTML.push('<tr class="ns1blankspaceCaption">');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">Reference</td>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">Date</td>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">Description</td>');
											aHTML.push('</tr>');

											$.each(oResponse.data.rows, function()
											{					
												aHTML.push(ns1blankspace.financial.journal.pending.row(this));
											});
											
											aHTML.push('</table>');
										}
									
										ns1blankspace.render.page.show(
										{
											xhtmlElementID: 'ns1blankspaceMostLikely',
											xhtmlContext: 'FinancialJournalPending',
											xhtml: aHTML.join(''),
											showMore: (oResponse.morerows == "true"),
											more: oResponse.moreid,
											rows: ns1blankspace.option.defaultRows,
											functionShowRow: ns1blankspace.financial.journal.pending.row,
											functionOnNewPage: ns1blankspace.financial.journal.pending.bind,
											type: 'json'
										}); 
									}
								},

					row: 		function (oRow)
								{
									var aHTML = [];
								
									aHTML.push('<tr class="ns1blankspace">');
															
									aHTML.push('<td id="reference-' + oRow.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
															oRow.reference + '</td>' +
													'<td id="date-' + oRow.id + '" class="ns1blankspaceRow">' +
															oRow.journaldate + '</td>' +
													'<td id="description-' + oRow.id + '" class="ns1blankspaceRow">' +
															oRow.description + '</td>');
															
									aHTML.push('</tr>');
												
									return aHTML.join('');
								},

					bind: 	function ()
								{
									$('div.ns1blankspaceRenderPage_FinancialJournalPending td.ns1blankspaceRowSelect:visible')
									.click(function()
									{
										ns1blankspace.financial.journal.init({id: (this.id).split('-')[1]});
									});
								}	
				},				

	search: 	{
					send:		function (sXHTMLElementID, oParam)
								{
									var aSearch = sXHTMLElementID.split('-');
									var sElementID = aSearch[0];
									var sSearchContext = aSearch[1];
									var iMinimumLength = 0;
									var iSource = ns1blankspace.data.searchSource.text;
									var sSearchText;
									var iMaximumColumns = 1;
									
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
										$('#ns1blankspaceControl').html(ns1blankspace.xhtml.loading);
										
										ns1blankspace.objectContext = sSearchContext;
										
										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_GENERAL_JOURNAL_SEARCH';
										oSearch.addField('area,areatext,description,id,journaldate,object,objecttext,objectcontext,' +
															'project,projecttext,reference,status,statustext');

										oSearch.addField(ns1blankspace.option.auditFields);
										
										oSearch.rf = 'json';
										oSearch.addFilter('id', 'EQUAL_TO', sSearchContext);
										
										oSearch.getResults(function(data) {ns1blankspace.financial.journal.show(oParam, data)});
									}
									else
									{
										if (sSearchText == undefined)
										{
											sSearchText = $('#ns1blankspaceViewControlSearch').val();
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
											ns1blankspace.search.start();
											
											var oSearch = new AdvancedSearch();
											oSearch.method = 'FINANCIAL_GENERAL_JOURNAL_SEARCH';
											oSearch.addField('id,area,areatext,description,id,journaldate,object,objecttext,objectcontext,' +
															'project,projecttext,reference,status,statustext');

											oSearch.addBracket('(');
											oSearch.addFilter('reference', 'TEXT_IS_LIKE', sSearchText);
											oSearch.addOperator('or');
											oSearch.addFilter('description', 'TEXT_IS_LIKE', sSearchText);

											var oSearchDate = moment(sSearchText, 'DD MMM YYYY HH:mm:ss')
  											if (oSearchDate.isValid())
											{
												oSearch.addOperator('or');
												oSearch.addFilter('journaldate', 'EQUAL_TO', sSearchText);
											}

											oSearch.addBracket(')');

											ns1blankspace.search.advanced.addFilters(oSearch);

											oSearch.sort('journaldate', 'DESC');
											oSearch.rows = ns1blankspace.option.defaultRowsSmall;

											oSearch.getResults(function(data) {ns1blankspace.financial.journal.search.process(oParam, data)});	
										}
									};	
								},

					process:	function (oParam, oResponse)
								{
									var iColumn = 0;
									var aHTML = [];
									var iMaximumColumns = 1;
									var sContact;
										
									ns1blankspace.search.stop();
										
									if (oResponse.data.rows.length == 0)
									{
										$(ns1blankspace.xhtml.searchContainer).html('<table class="ns1blankspaceSearchMedium"><tr><td class="ns1blankspaceSubNote">Nothing to show</td></tr></table>');
									}
									else
									{		
										aHTML.push('<table class="ns1blankspaceSearchMedium" style="width:520px;">');
											
										$.each(oResponse.data.rows, function()
										{	
											aHTML.push(ns1blankspace.financial.journal.search.row(oParam, this));
										});
								    	
										aHTML.push('</table>');

										$(ns1blankspace.xhtml.searchContainer).html(
											ns1blankspace.render.init(
											{
												html: aHTML.join(''),
												more: (oResponse.morerows == "true"),
												width: 520,
												header: false
											}) 
										);
										
										$('td.ns1blankspaceSearch').click(function(event)
										{
											$(ns1blankspace.xhtml.dropDownContainer).html('&nbsp;');
											$(ns1blankspace.xhtml.dropDownContainer).hide(ns1blankspace.option.hideSpeedOptions)
											ns1blankspace.financial.journal.search.send(event.target.id, {source: 1});
										});

										ns1blankspace.render.bind(
										{
											columns: 'reference',
											more: oResponse.moreid,
											width: 520,
											startRow: parseInt(oResponse.startrow) + parseInt(oResponse.rows),
											functionSearch: ns1blankspace.financial.journal.search.send,
											functionRow: ns1blankspace.financial.journal.search.row
										});   
									}				
								},

						row: 	function (oParam, oRow)
								{
									var aHTML = [];
									var sContact;
												
									aHTML.push('<tr class="ns1blankspaceSearch">');
								
									aHTML.push('<td class="ns1blankspaceSearch" id="' +
													'search-' + oRow.id + '">' +
													oRow.reference +
													'</td>');

									aHTML.push('<td class="ns1blankspaceSearch" id="' +
													'searchContact-' + oRow.id + '">' +
													ns1blankspace.util.fd(oRow.journaldate) +
													'</td>');

									aHTML.push('<td class="ns1blankspaceSearch ns1blankspaceSearchSub" id="' +
													'searchContact-' + oRow.id + '">' +
													oRow.description +
													'</td>');

									aHTML.push('</tr>');
									
									return aHTML.join('')
								}								
				},		

	layout:	function ()
				{
					var aHTML = [];
					
					aHTML.push('<div id="ns1blankspaceControlContext" class="ns1blankspaceControlContext"></div>');
					
					aHTML.push('<table class="ns1blankspaceControl">');
					
					if (ns1blankspace.objectContext == -1)
					{
						aHTML.push('<tr><td id="ns1blankspaceControlDetails" class="ns1blankspaceControl ns1blankspaceHighlight">' +
										'Details</td></tr>');
					}
					else
					{	
						aHTML.push('<tr><td id="ns1blankspaceControlSummary" class="ns1blankspaceControl ns1blankspaceHighlight">' +
										'Summary</td></tr>');
							
						aHTML.push('<tr id="ns1blankspaceControlDetailsContainer"><td id="ns1blankspaceControlDetails" class="ns1blankspaceControl">' +
										'Details</td></tr>');
						
						aHTML.push('</table>');					
					
						aHTML.push('<table class="ns1blankspaceControl">');
						
						aHTML.push('<tr><td id="ns1blankspaceControlItems" class="ns1blankspaceControl">' +
										'Items</td></tr>');
											
						aHTML.push('</table>');					
					
						aHTML.push('<table class="ns1blankspaceControl">');
													
						aHTML.push('<tr><td id="ns1blankspaceControlGL" class="ns1blankspaceControl">' +
										'GL</td></tr>');
									
						aHTML.push('</table>');					
					
						aHTML.push('<table class="ns1blankspaceControl">');
					
						aHTML.push('<tr><td id="ns1blankspaceControlActions" class="ns1blankspaceControl">' +
										'Actions</td></tr>');
									
						aHTML.push('<tr><td id="ns1blankspaceControlAttachments" class="ns1blankspaceControl">' +
										'Attachments</td></tr>');
					}
									
					aHTML.push('</table>');					
							
					$('#ns1blankspaceControl').html(aHTML.join(''));

					var aHTML = [];

					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainDetails" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainItem" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainTransaction" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainActions" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainAttachments" class="ns1blankspaceControlMain"></div>');
					
					$('#ns1blankspaceMain').html(aHTML.join(''));
					
					$('#ns1blankspaceControlSummary').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
						ns1blankspace.financial.journal.summary();
					});

					$('#ns1blankspaceControlDetails').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
						ns1blankspace.financial.journal.details();
					});
					
					$('#ns1blankspaceControlItems').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainItem', refresh: true});
						ns1blankspace.financial.journal.item.show();
					});
					
					$('#ns1blankspaceControlGL').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainTransaction', refresh: true});
						ns1blankspace.financial.transactions.show();
					});

					$('#ns1blankspaceControlActions').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainActions', refresh: true});
						ns1blankspace.actions.show({xhtmlElementID: 'ns1blankspaceMainActions'});
					});

					$('#ns1blankspaceControlAttachments').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainAttachments', refresh: true});
						ns1blankspace.attachments.show({xhtmlElementID: 'ns1blankspaceMainAttachments'});
					});			
				},

	show:		function (oParam, oResponse)
				{
					ns1blankspace.app.clean();
					ns1blankspace.financial.journal.layout();
					
					var aHTML = [];
					var h = -1;
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
						
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find this general journal.</td></tr></table>');
								
						$('#ns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						ns1blankspace.objectContextData = oResponse.data.rows[0];

						ns1blankspace.financial.journal.refresh();
						
						ns1blankspace.objectContextData.locked = false;
						if (ns1blankspace.objectContextData.status === '2') {ns1blankspace.objectContextData.locked = true;}

						if (!ns1blankspace.objectContextData.locked)
						{	
							$('#ns1blankspaceViewControlAction').button({disabled: false});
							$('#ns1blankspaceViewControlActionOptions').button({disabled: false});
						}
						else
						{
							$('#ns1blankspaceControlDetailsContainer').hide();
						}	
								
						$('#ns1blankspaceControlContext').html(ns1blankspace.objectContextData.reference +
							'<br /><span id="ns1blankspaceControlContext_date" class="ns1blankspaceSub">' + ns1blankspace.objectContextData.journaldate + '</span>' +
							'<br /><span id="ns1blankspaceControlContext_balance" class="ns1blankspaceSub"></span>');
							
						ns1blankspace.history.view(
						{
							newDestination: 'ns1blankspace.financial.journal.init({id: ' + ns1blankspace.objectContext + '})',
							move: false
						});
						
						ns1blankspace.history.control({functionDefault: 'ns1blankspace.financial.journal.summary()'});
					}	
				},		

	summary: 	function (oParam)
				{
					var aHTML = [];
					var bUseTemplate = false;
					
					if (oParam)
					{
						if (oParam.useTemplate != undefined) {bUseTemplate = oParam.useTemplate}
					}

					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find the general journal.</td></tr></table>');
								
						$('#ns1blankspaceMainSummary').html(aHTML.join(''));
					}
					else
					{
						aHTML.push('<table class="ns1blankspaceMain">' +
										'<tr class="ns1blankspaceRow">' +
										'<td id="ns1blankspaceSummaryColumn1" class="ns1blankspaceColumn1Flexible"></td>' +
										'<td id="ns1blankspaceSummaryColumn2" class="ns1blankspaceColumn2Action" style="width:200px;"></td>' +
										'</tr>' +
										'</table>');				
						
						$('#ns1blankspaceMainSummary').html(aHTML.join(''));
						
						var aHTML = [];

						aHTML.push('<table class="ns1blankspace">');
																	
						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Journal Date</td></tr>' +
											'<tr><td id="ns1blankspaceSummaryJournalDate" class="ns1blankspaceSummary">' +
											ns1blankspace.objectContextData.journaldate +
											'</td></tr>');
						
						if (ns1blankspace.objectContextData.description != '')
						{
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Description</td></tr>' +
											'<tr><td id="ns1blankspaceSummaryDescription" class="ns1blankspaceSummary">' +
											ns1blankspace.objectContextData.description +
											'</td></tr>');
						}
						
						aHTML.push('</table>');		

						$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));

						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspaceColumn2">');
						
						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption" style="padding-bottom:10px;">' +
										ns1blankspace.objectContextData.statustext +
										'</td></tr>');				
				
						if (ns1blankspace.objectContextData.status == 1)
						{										
							aHTML.push('<tr><td>' +
										'<span id="ns1blankspaceSummaryActionStatus-2" class="journalAction ns1blankspaceAction">Finalise</span>' +
										'</td></tr>');			
						}
						
						if (ns1blankspace.objectContextData.status == 2)
						{	
							aHTML.push('<tr><td>' +
										'<span id="ns1blankspaceSummaryActionStatus-1" class="journalAction ns1blankspaceAction">Undo</span>' +
										'</td></tr>');

							aHTML.push('<tr><td style="padding-top:10px;">' +
										'<span class="ns1blankspaceSubNote">To edit this journal,<br />you must first undo it.</span>' +
										'</td></tr>');
						}
										
						aHTML.push('</table>');					
						
						$('#ns1blankspaceSummaryColumn2').html(aHTML.join(''));	
						
						$('span.journalAction').button(
						{
							
						})
						.click(function() {
							
							var sID = this.id;
							var aID = sID.split('-');
							var iStatus = aID[1];

							var oData = {status: iStatus, id: ns1blankspace.objectContext}

							if (ns1blankspace.option.financialOverride)
							{
								oData.override = 'Y'
							}	
							
							$.ajax(
							{
								type: 'GET',
								url: ns1blankspace.util.endpointURI('FINANCIAL_GENERAL_JOURNAL_MANAGE'),
								data: oData,
								dataType: 'json',
								success: function(oResponse) {ns1blankspace.financial.journal.search.send('-' + ns1blankspace.objectContext)}
							});
						})
						.css('width', '100px');	
					}	
				},

	details: 	function ()
				{
					var aHTML = [];
				
					if ($('#ns1blankspaceMainDetails').attr('data-loading') == '1')
					{
						$('#ns1blankspaceMainDetails').attr('data-loading', '');
								
						aHTML.push('<table class="ns1blankspaceContainer">');
						aHTML.push('<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceDetailsColumn1" class="ns1blankspaceColumn1"></td>' +
										'<td id="ns1blankspaceDetailsColumn2" class="ns1blankspaceColumn2"></td>' +
										'</tr>');
						aHTML.push('</table>');					
						
						$('#ns1blankspaceMainDetails').html(aHTML.join(''));

						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspace">');
						
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Reference' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsReference" class="ns1blankspaceText">' +
										'</td></tr>');			
					
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Journal Date' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceDate">' +
										'<input id="ns1blankspaceDetailsJournalDate" class="ns1blankspaceDate">' +
										'</td></tr>');		
													
						aHTML.push('</table>');				
						
						$('#ns1blankspaceDetailsColumn1').html(aHTML.join(''));
						
						ns1blankspace.util.initDatePicker({select: 'input.ns1blankspaceDate'});
						
						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspace">');
						
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Description' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceTextMulti">' +
										'<textarea rows="10" cols="35" id="ns1blankspaceDetailsDescription" class="ns1blankspaceTextMulti"></textarea>' +
										'</td></tr>');		
										
						aHTML.push('</table>');					
							
						$('#ns1blankspaceDetailsColumn2').html(aHTML.join(''));

						if (ns1blankspace.objectContextData != undefined)
						{
							$('#ns1blankspaceDetailsReference').val(ns1blankspace.objectContextData.reference);
							$('#ns1blankspaceDetailsJournalDate').val(ns1blankspace.objectContextData.journaldate);
							$('#ns1blankspaceDetailsDescription').val(ns1blankspace.objectContextData.description);
						}
						else
						{
							$('#ns1blankspaceDetailsJournalDate').val(Date.today().toString("dd MMM yyyy"));
						}
					}	
				},

	save: 		{
					send:		function (oParam, oResponse)
								{
									ns1blankspace.status.working();
									
									var sData = (ns1blankspace.objectContext == -1)?'':'id=' + ns1blankspace.objectContext;
										
									if ($('#ns1blankspaceMainDetails').html() != '')
									{
										sData += '&reference=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsReference').val());
										sData += '&journaldate=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsJournalDate').val());
										sData += '&description=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsDescription').val());
									}

									if (ns1blankspace.option.financialOverride)
									{
										sData += '&override=Y'
									}	
									
									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('FINANCIAL_GENERAL_JOURNAL_MANAGE'),
										data: sData,
										dataType: 'json',
										success: function(data) {ns1blankspace.financial.journal.save.process(data)}
									});
								},

					process:	function (oResponse)
								{
									if (oResponse.status == 'OK')
									{
										ns1blankspace.status.message('Saved');
										ns1blankspace.inputDetected = false;

										if (ns1blankspace.objectContext == -1)
										{
											ns1blankspace.objectContext = oResponse.id;
											ns1blankspace.financial.journal.search.send('-' + ns1blankspace.objectContext, {source: 1});
										}
									}
									else
									{
										ns1blankspace.status.error(oResponse.error.errornotes);
									}
								},

				},

	item: 		{
					show:	function (oParam, oResponse)
							{
								var iObject = ns1blankspace.object;
								var iObjectContext = ns1blankspace.objectContext;
								var sNamespace;
								var bRefresh = false;
								
								if (oParam != undefined)
								{
									if (oParam.object != undefined) {iObject = oParam.object}
									if (oParam.objectContext != undefined) {iObjectContext = oParam.objectContext}
									if (oParam.namespace != undefined) {sNamespace = oParam.namespace}
									if (oParam.refresh != undefined) {bRefresh = oParam.refresh}		
								}
								else
								{
									oParam = {}
								}	
									
								if (oResponse == undefined)
								{	
									if (!bRefresh)
									{	
										var aHTML = [];

										aHTML.push('<table class="ns1blankspaceContainer">');

										aHTML.push('<tr class="ns1blankspaceContainer">' +
														'<td id="ns1blankspaceItemColumn1" class="ns1blankspaceColumn1Flexible">' +
														ns1blankspace.xhtml.loading + '</td>' +
														'<td id="ns1blankspaceItemColumn2" class="ns1blankspaceColumn2" style="width:100px;"></td>' +
														'</tr>');

										aHTML.push('</table>');					
										
										$('#ns1blankspaceMainItem').html(aHTML.join(''));
										
										var aHTML = [];
										
										aHTML.push('<table class="ns1blankspaceColumn2" style="width:120px;">');
										
										if (ns1blankspace.objectContextData.locked)
										{
											aHTML.push('<tr><td class="ns1blankspaceSubNote">To edit these journal items,<br />you must first undo this journal.' +
														'</td></tr>');
										}
										else
										{
											aHTML.push('<tr><td class="ns1blankspaceAction">' +
														'<span id="ns1blankspaceItemAdd">Add</span>' +
														'</td></tr>');
										}
										
										aHTML.push('</table>');					
										
										$('#ns1blankspaceItemColumn2').html(aHTML.join(''));
									
										$('#ns1blankspaceItemAdd').button(
										{
											label: "Add"
										})
										.click(function() {
											 ns1blankspace.financial.journal.item.edit(oParam);
										});										
									
									}

									var oSearch = new AdvancedSearch();
									oSearch.method = 'FINANCIAL_GENERAL_JOURNAL_ITEM_SEARCH';
									oSearch.addField('area,areatext,capital,creditamount,credittax,debitamount,debittax,' +
														'financialaccount,financialaccounttext,generaljournal,generaljournaltext,' +
														'project,projecttext,reconciliation,reconciliationtext,taxcategory,taxcategorytext,' +
														'taxreport,taxreportfield,taxreportfield2,taxreporttext,taxtype,taxtypeexpensetext,taxtyperevenuetext');
									oSearch.addFilter('generaljournal', 'EQUAL_TO', iObjectContext);
									oSearch.sort('taxcategorytext', 'asc');
									oSearch.rows = 1000;
									oSearch.getResults(function(data) {ns1blankspace.financial.journal.item.show(oParam, data)});
								}
								else
								{
									var aHTML = [];
									var h = -1;
									
									if (oResponse.data.rows.length == 0)
									{
										aHTML.push('<table><tr><td class="ns1blankspaceNothing">No items.</td></tr></table>');

										$('#ns1blankspaceItemColumn1').html(aHTML.join(''));
									}
									else
									{
										aHTML.push('<table class="ns1blankspace">');

										aHTML.push('<tr>');
										aHTML.push('<td class="ns1blankspaceHeaderCaption style="width:125px;">Account</td>');
										aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Credit</td>');
										aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">' + ns1blankspace.option.taxVATCaption +'</td>');
										aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Debit</td>');
										aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">' + ns1blankspace.option.taxVATCaption +'</td>');
										aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:center;">Status</td>');
										aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>');
										aHTML.push('</tr>');

										$.each(oResponse.data.rows, function()
										{
											aHTML.push('<tr class="ns1blankspaceRow">');
																		
											aHTML.push('<td id="ns1blankspaceItem_financialaccounttext-' + this.id + '" class="ns1blankspaceRow">' +
															this["financialaccounttext"] + '</td>');
											
											aHTML.push('<td id="ns1blankspaceItem_creditamount-' + this.id + '" class="ns1blankspaceRow" style="text-align:right;">' +
															ns1blankspace.util.fz(this["creditamount"]) + '</td>');

											aHTML.push('<td id="ns1blankspaceItem_credittax-' + this.id + '" class="ns1blankspaceRow" style="text-align:right;"' +
															'">' +
															ns1blankspace.util.fz(this["credittax"]) + '</td>');

											aHTML.push('<td id="ns1blankspaceItem_debitamount-' + this.id + '" class="ns1blankspaceRow" style="text-align:right;">' +
															ns1blankspace.util.fz(this["debitamount"]) + '</td>');

											aHTML.push('<td id="ns1blankspaceItem_debittax-' + this.id + '" class="ns1blankspaceRow" style="text-align:right;"' +
															'">' +
															ns1blankspace.util.fz(this["debittax"]) + '</td>');

											aHTML.push('<td id="ns1blankspaceItem_reconciled-' + this.id + '" class="ns1blankspaceRow" style="text-align:center;"' +
															'">' + (this["reconciliation"]==''?'-':'Reconciled') + '</td>');

											aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">');
											aHTML.push('<span id="ns1blankspaceRowItem_options_remove-' + this.id + '" class="ns1blankspaceItemRemove"></span>');
											aHTML.push('</td></tr>');
										});
										
										aHTML.push('</table>');

										$('#ns1blankspaceItemColumn1').html(aHTML.join(''));
										
										if (!ns1blankspace.objectContextData.locked)
										{
											$('.ns1blankspaceItemRemove').button( {
												text: false,
												icons: {
													primary: "ui-icon-close"
												}
											})
											.click(function() {
												oParam.xhtmlElementID = this.id;
												ns1blankspace.financial.journal.item.remove(oParam);
											})
											.css('width', '15px')
											.css('height', '17px')
									
											$('.ins1blankspaceItemView').button( {
												text: false,
												icons: {
													primary: "ui-icon-play"
												}
											})
											.click(function() {
												//ns1blankspace.financial[sNamespace].item.edit({xhtmlElementID: this.id})
											})
											.css('width', '15px')
											.css('height', '17px');
										}
									}
								}	
							},

					remove:	function (oParam, oResponse)
							{
								var sXHTMLElementID;
								var sNamespace;
								var iObject = ns1blankspace.object;
								var iObjectContext = ns1blankspace.objectContext;
								var sNamespace;
								
								if (oParam != undefined)
								{
									if (oParam.object != undefined) {iObject = oParam.object}
									if (oParam.objectContext != undefined) {iObjectContext = oParam.objectContext}
									if (oParam.namespace != undefined) {sNamespace = oParam.namespace}
									if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
								}		

								var aXHTMLElementID = sXHTMLElementID.split('-');
								var sID = aXHTMLElementID[1];
								
								if (oResponse == undefined)
								{	
									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('FINANCIAL_GENERAL_JOURNAL_ITEM_MANAGE'),
										data: 'remove=1&id=' + sID,
										dataType: 'json',
										success: function(data)
										{
											ns1blankspace.financial.journal.item.remove(oParam, data);
										}
									});
								}	
								else
								{
									if (oResponse.status == 'OK')
									{
										$('#' + sXHTMLElementID).parent().parent().fadeOut(500);
										ns1blankspace.financial.journal.refresh()
									}
									else
									{
										ns1blankspace.status.error(oResponse.error.errornotes);
									}
								}	
							},

					edit:	function (oParam, oResponse)
							{
								var iStep = 1;
								var sNamespace;
								
								if (oParam != undefined)
								{
									if (oParam.step != undefined) {iStep = oParam.step}	
									if (oParam.namespace != undefined) {sNamespace = oParam.namespace}	
								}
								
								if (oResponse == undefined)
								{
									if (iStep == 1)
									{
										var aHTML = [];
										
										aHTML.push('<table class="ns1blankspaceColumn2" style="width:200px;">');
								
										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Type' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceRadio">' +
														'<input type="radio" id="radioType1" name="radioType" value="1"/>Credit' +
														'<br /><input type="radio" id="radioType2" name="radioType" value="2"/>Debit' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Amount <span style="font-size:0.75em;"(inc Tax)</span>' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceItemAmount" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														ns1blankspace.option.taxVATCaption +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceRadio">' +
														'<input type="radio" id="radioTaxCategory-1" name="radioTaxCategory" value="1"/>Sale' +
														'<br /><input type="radio" id="radioTaxCategory-2" name="radioTaxCategory" value="2"/>Purchase' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														ns1blankspace.option.taxVATCaption + ' Type' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td id="ns1blankspaceFinancialTaxCode" class="ns1blankspaceRadio">' +
														ns1blankspace.xhtml.loadingSmall +
														'</td></tr>');	

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														ns1blankspace.option.taxVATCaption + ' Amount' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceItemTax" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Description' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceTextMulti">' +
														'<textarea id="ns1blankspaceItemDescription" class="ns1blankspaceTextMulti" style="height:50px; width:200px;" rows="3" cols="35" ></textarea>' +
														'</td></tr>');	

										
										aHTML.push('<tr class="ns1blankspace ns1blankspaceCapital" style="display:none;">' +
														'<td class="ns1blankspaceCaption">' +
														'Capital' +
														'</td></tr>' +
														'<tr class="ns1blankspace ns1blankspaceCapital" style="display:none;">' +
														'<td class="ns1blankspaceRadio">' +
														'<input type="radio" id="radioCapitalN" name="radioCapital" value="N" checked="checked"/>No' +
														'<br /><input type="radio" id="radioCapitalY" name="radioCapital" value="Y"/>Yes' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Account' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceItemAccount" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('</table>');
										
										aHTML.push('<table class="ns1blankspaceColumn2" style="margin-top:15px;">');
										
										aHTML.push('<tr><td id="ns1blankspaceItemAddSearchResults"></td></tr>');
																		
										aHTML.push('</table>');		
										
										$('#ns1blankspaceItemColumn2').html(aHTML.join(''));
					
										ns1blankspace.financial.util.tax.codes({xhtmlElementID: 'ns1blankspaceFinancialTaxCode', id: 1});
										$('[name="radioType"][value="1"]').attr('checked', true);
										$('[name="radioTaxCategory"][value="1"]').attr('checked', true);

										$('#ns1blankspaceItemAccount').keyup(function()
										{
											$.extend(true, oParam, {step: 2});
											if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
											ns1blankspace.timer.delayCurrent = setTimeout(ns1blankspace.financial.journal.item.edit(oParam), ns1blankspace.option.typingWait);
										});	
											
										$('#ns1blankspaceItemAmount').focus();

										$('[name="radioTaxCategory"]').click(function()
										{
											ns1blankspace.financial.util.tax.codes(
											{
												xhtmlElementID: 'ns1blankspaceFinancialTaxCode',
												id: 1,
												type: (this.id).split('-')[1]
											});

											ns1blankspace.financial.util.tax.calculate(
											{
												amountXHTMLElementID: 'ns1blankspaceItemAmount',
												taxXHTMLElementID: 'ns1blankspaceItemTax'
											});

											$('.ns1blankspaceCapital')[((this.id).split('-')[1]==2?'show':'hide')]();

											/*$('[name="radioTaxCode"]').click(function()
											{
												ns1blankspace.financial.util.tax.calculate(
												{
													amountXHTMLElementID: 'ns1blankspaceItemAmount',
													taxXHTMLElementID: 'ns1blankspaceItemTax'
												});
											});*/
										});

										$('#ns1blankspaceItemAmount').keyup(function()
										{
											ns1blankspace.financial.util.tax.calculate(
											{
												amountXHTMLElementID: 'ns1blankspaceItemAmount',
												taxXHTMLElementID: 'ns1blankspaceItemTax'
											});
										});

										$('[name="radioTaxCode"]').click(function()
										{
											ns1blankspace.financial.util.tax.calculate(
											{
												amountXHTMLElementID: 'ns1blankspaceItemAmount',
												taxXHTMLElementID: 'ns1blankspaceItemTax'
											});
										});
									}

									if (iStep == 2)
									{	
										var oSearch = new AdvancedSearch();
										oSearch.method = 'SETUP_FINANCIAL_ACCOUNT_SEARCH';
										oSearch.addField('title');
										oSearch.addFilter('title', 'TEXT_IS_LIKE', $('#ns1blankspaceItemAccount').val());
										oSearch.addFilter('postable', 'EQUAL_TO', 'Y');
										oSearch.sort('title', 'asc');
										oSearch.getResults(function(data){ns1blankspace.financial.journal.item.edit($.extend(true, oParam, {step:3}), data)});
									}
								}
								else
								{
									var aHTML = [];
									
									if (oResponse.data.rows.length == 0)	
									{
										aHTML.push('<table class="ns1blankspace">' +
														'<tr><td class="ns1blankspaceNothing">No accounts.</td></tr>' + 
														'</table>');

										$('#ns1blankspaceItemAddSearchResults').html(aHTML.join(''));		
									}
									else
									{	
										aHTML.push('<table class="ns1blankspace">');
										
										$.each(oResponse.data.rows, function() 
										{ 
											aHTML.push('<tr class="ns1blankspaceRow">'+ 
															'<td id="ns1blankspaceItem_title-' + this.id + '" class="ns1blankspaceRow">' +
															this.title + '</td>' +
															'<td style="width:30px;text-align:right;" class="ns1blankspaceRow">' +
															'<span id="ns1blankspaceItem_options_add-' + this.id + '" class="ns1blankspaceItemAdd"></span>' +
															'</td></tr>');	
										});
										
										aHTML.push('</table>');

										$('#ns1blankspaceItemAddSearchResults').html(aHTML.join(''))
										
										$('.ns1blankspaceItemAdd').button({
											text: false,
											icons: {
												primary: "ui-icon-plus"
											}
										})
										.click(function()
										{
											ns1blankspace.status.working();

											var sID = this.id;
											var aID = sID.split('-');
											var iAccount = aID[1];
											var cAmount = $('#ns1blankspaceItemAmount').val();
											if (cAmount == '') {cAmount = 0};
											var cTax = $('#ns1blankspaceItemTax').val();
											if (cTax == '') {cTax = 0};
											
											var sData = 'generaljournal=' + ns1blankspace.objectContext;
											sData += '&financialaccount=' + iAccount;

											if ($('input[name="radioType"]:checked').val() == '1')
											{	
												sData += '&creditamount=' + cAmount;
												sData += '&credittax=' + cTax;
											}
											else
											{
												sData += '&debitamount=' + cAmount;
												sData += '&debittax=' + cTax;
											}	

											sData += '&description=' + ns1blankspace.util.fs($('#ns1blankspaceItemDescription').val());

											sData += '&taxcategory=' + $('input[name="radioTaxCategory"]:checked').val();
											sData += '&taxtype=' + $('input[name="radioTaxCode"]:checked').val();
											sData += '&capital=' + $('input[name="radioCapital"]:checked').val();
												
											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('FINANCIAL_GENERAL_JOURNAL_ITEM_MANAGE'),
												data: sData,
												dataType: 'json',
												success: function(oResponse)
												{
													ns1blankspace.status.message('Added.');
													ns1blankspace.financial.journal.item.show();
													ns1blankspace.financial.journal.refresh();
													ns1blankspace.inputDetected = false;
												}
											});
										})
										.css('width', '20px')
										.css('height', '20px');
									}
								}	
							}
				},

finalised: 	{
					show: 	function (oParam, oResponse)
								{
									var sXHTMLElementID;
									
									if (oParam != undefined)
									{
										if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
									}

									ns1blankspace.status.working();
									
									if (oResponse == undefined)
									{	
										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_GENERAL_JOURNAL_SEARCH';
										oSearch.addField('id,reference,journaldate,description,sum(generaljournal.generaljournalitem.creditamount) totalamount');
										oSearch.addFilter('status', 'EQUAL_TO', 2);
										oSearch.rows = 20;
										oSearch.sort('journaldate', 'desc');
										oSearch.getResults(function(data) {ns1blankspace.financial.journal.finalised.show(oParam, data)});	
									}
									else
									{
										ns1blankspace.status.clear()

										var aHTML = [];
										
										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table><tr><td class="ns1blankspaceNothing">Click New to add a general journal.</td></tr>' +
																'</table>');
										}
										else
										{		
											aHTML.push('<table class="ns1blankspace" id="ns1blankspaceFinancialJournalFinalised">');
											
											aHTML.push('<tr class="ns1blankspaceCaption">');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">Reference</td>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">Date</td>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">Description</td>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Amount</td>');
											aHTML.push('</tr>');
											
											$.each(oResponse.data.rows, function()
											{
												aHTML.push(ns1blankspace.financial.journal.finalised.row(this));
											});
											
											aHTML.push('</table>');
										}
										
										ns1blankspace.render.page.show(
										{
											xhtmlElementID: 'ns1blankspaceMostLikely',
											xhtmlContext: 'FinancialJournalFinalised',
											xhtml: aHTML.join(''),
											showMore: (oResponse.morerows == "true"),
											more: oResponse.moreid,
											rows: ns1blankspace.option.defaultRows,
											functionShowRow: ns1blankspace.financial.journal.finalised.row,
											functionOnNewPage: ns1blankspace.financial.journal.finalised.bind,
											type: 'json'
										}); 
									}	
								},	

					row: 		function (oRow)
								{
									var aHTML = [];
								
									aHTML.push('<tr class="ns1blankspace">');
															
									aHTML.push('<td id="reference-' + oRow.reference + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
															oRow.reference + '</td>' +
													'<td id="date-' + oRow.id + '" class="ns1blankspaceRow">' +
															oRow.journaldate + '</td>' +
													'<td id="description-' + oRow.id + '" class="ns1blankspaceRow">' +
															oRow.description + '</td>' +
													'<td id="amount-' + oRow.id + '" class="ns1blankspaceRow" style="text-align:right;">' +
															oRow.totalamount + '</td>');
															
									aHTML.push('</tr>');
												
									return aHTML.join('');
								},

					bind: 	function ()
								{
									$('div.ns1blankspaceRenderPage_FinancialJournalFinalised td.ns1blankspaceRowSelect:visible')
									.click(function()
									{
										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_GENERAL_JOURNAL_SEARCH';
										oSearch.addField('id');
										oSearch.addFilter('reference', 'EQUAL_TO', (this.id).split('-')[1]);
										oSearch.getResults(function(oResponse)
										{
											ns1blankspace.financial.journal.init({id: oResponse.data.rows[0].id})
										});	
										;
									});
								}	
				}								
}				