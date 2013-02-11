/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
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
								
						$('#ns1blankspaceControlContext_balance').html(ns1blankspace.objectContextData.balanceAmount);
					}
				},

	home: 		function (oResponse)
				{
					if (oResponse == undefined)
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
						aHTML.push('</table>');		
						
						$('#ns1blankspaceControl').html(aHTML.join(''));	

						$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
						
						var oSearch = new AdvancedSearch();
						oSearch.method = 'FINANCIAL_GENERAL_JOURNAL_SEARCH';
						oSearch.addField('area,areatext,description,id,journaldate,object,objecttext,objectcontext,' +
											'project,projecttext,reference,status,statustext');
						oSearch.rows = 10;
						oSearch.sort('modifieddate', 'desc');
						oSearch.getResults(ns1blankspace.financial.journal.home);
					}
					else
					{
						var aHTML = [];
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table id="ns1blankspaceMostLikely">');
							aHTML.push('<tr><td class="ns1blankspaceNothing">Click New to add a general journal.</td></tr>');
							aHTML.push('</table>');
						}
						else
						{
							aHTML.push('<table id="ns1blankspaceMostLikely">');
							aHTML.push('<tr><td class="ns1blankspaceCaption" colspan="4">MOST LIKELY</td></tr>');
							
							$.each(oResponse.data.rows, function()
							{					
								aHTML.push('<tr class="ns1blankspaceRow">');
									
								aHTML.push('<td id="ns1blankspaceMostLikely_Title-' + this.id + '" class="ns1blankspaceMostLikely" style="width:60px;">' +
														this.reference + '</td>');
										
								aHTML.push('<td id="ns1blankspaceMostLikely_Date-' + this.id + '" class="ns1blankspaceMostLikelySub" style="width:90px;">' +
														this.journaldate + '</td>');

								aHTML.push('<td id="ns1blankspaceMostLikely_Description-' + this.id + '" class="ns1blankspaceMostLikelySub">' +
														this.description + '</td>');
																											
								aHTML.push('</tr>');
							});
							
							aHTML.push('</table>');
						}
						
						$('#ns1blankspaceMostLikely').html(aHTML.join(''));
					
						$('td.ns1blankspaceMostLikely').click(function(event)
						{
							 ns1blankspace.financial.journal.search.send(event.target.id, {source: 1});
						});
					}
				},

	search: 	{
					send:		function (sXHTMLElementID, oParam)
								{
									var aSearch = sXHTMLElementID.split('-');
									var sElementID = aSearch[0];
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
										$('#ns1blankspaceControl').html(ns1blankspace.xhtml.loading);
										
										ns1blankspace.objectContext = sSearchContext;
										
										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_GENERAL_JOURNAL_SEARCH';
										oSearch.addField('area,areatext,description,id,journaldate,object,objecttext,objectcontext,' +
															'project,projecttext,reference,status,statustext');
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
											oSearch.addField('area,areatext,description,id,journaldate,object,objecttext,objectcontext,' +
															'project,projecttext,reference,status,statustext');
											oSearch.addFilter('reference', 'TEXT_IS_LIKE', sSearchText);
											oSearch.addOperator('or');
											oSearch.addFilter('description', 'TEXT_IS_LIKE', sSearchText);
											oSearch.getResults(function(data) {ns1blankspace.financial.journal.search.process(oParam, data)});	
										}
									};	
								},

					process:	function (oParam, oResponse)
								{
									var iColumn = 0;
									var aHTML = [];
									var	iMaximumColumns = 1;
									var sContact;
										
									ns1blankspace.search.stop();
										
									if (oResponse.data.rows.length == 0)
									{
										$(ns1blankspace.xhtml.container).hide();
									}
									else
									{		
										aHTML.push('<table class="ns1blankspaceSearchMedium">');
											
										$.each(oResponse.data.rows, function()
										{	
											iColumn = iColumn + 1;
											
											if (iColumn == 1)
											{
												aHTML.push('<tr class="ns1blankspaceSearch">');
											}
										
											aHTML.push('<td class="ns1blankspaceSearch" id="' +
														'search-' + this.id + '">' +
														this.reference +
														'</td>');
	
											if (iColumn == iMaximumColumns)
											{
												aHTML.push('</tr>');
												iColumn = 0;
											}	
										});
								    	
										aHTML.push('</table>');

										$(ns1blankspace.xhtml.container).html(aHTML.join(''));
										$(ns1blankspace.xhtml.container).show(ns1blankspace.option.showSpeedOptions);
										
										$('td.ns1blankspaceSearch').click(function(event)
										{
											$(ns1blankspace.xhtml.container).html('&nbsp;');
											$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions)
											ns1blankspace.financial.journal.search.send(event.target.id, {source: 1});
										});
									}				
								}
				},		

	layout:		function ()
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
									
						aHTML.push('<tr><td id="ns1blankspaceControlDetails" class="ns1blankspaceControl">' +
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
						ns1blankspace.financial.journal.summary.show();
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

					$('#ns1blankspaceControlControlAttachments').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainAttachments', refresh: true});
						ns1blankspace.attachments.show({xhtmlElementID: 'ns1blankspaceMainAttachments'});
					});			
				},

	show:		function (oParam, oResponse)
				{
					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
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
						
						$('#ns1blankspaceViewControlAction').button({disabled: false});
						$('#ns1blankspaceViewControlActionOptions').button({disabled: false});
								
						$('#ns1blankspaceControlContext').html(ns1blankspace.objectContextData.reference +
							'<br /><span id="ns1blankspaceControlContext_date" class="ns1blankspaceSub">' + ns1blankspace.objectContextData.journaldate + '</span>' +
							'<br /><span id="ns1blankspaceControlContext_balance" class="ns1blankspaceSub"></span>');
							
						ns1blankspace.history.view({
							newDestination: 'ns1blankspace.financial.journal.init({showHome: false, id: ' + ns1blankspace.objectContext + '})',
							move: false
							})
						
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

							//aHTML.push('<tr><td>' +
							//			'<span id="ns1blankspaceSummaryActionReverse" class="journalAction ns1blankspaceAction">Reverse</span>' +
							//			'</td></tr>');
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
							
							$.ajax(
							{
								type: 'GET',
								url: ns1blankspace.util.endpointURI('FINANCIAL_GENERAL_JOURNAL_MANAGE'),
								data: 'status=' + iStatus + '&id=' + ns1blankspace.objectContext,
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
						
						$('input.ns1blankspaceDate').datepicker({dateFormat: 'dd M yy'});
						
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
										ns1blankspaceStatus('Saved');
										if (ns1blankspace.objectContext == -1) {var bNew = true}
										ns1blankspace.objectContext = oResponse.id;	
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
														'<td id="ns1blankspaceItemColumn1" class="ns1blankspaceColumn1Flexible"></td>' +
														'<td id="ns1blankspaceItemColumn2" class="ns1blankspaceColumn2" style="width:150px;"></td>' +
														'</tr>');

										aHTML.push('</table>');					
										
										$('#ns1blankspaceMainItem').html(aHTML.join(''));
										
										var aHTML = [];
										
										aHTML.push('<table class="ns1blankspaceColumn2" style="width:50px;">');
										
										
										aHTML.push('<tr><td class="ns1blankspaceAction">' +
														'<span id="ns1blankspaceItemAdd">Add</span>' +
														'</td></tr>');
							
										
										aHTML.push('</table>');					
										
										$('#ns1blankspaceItemColumn2').html(aHTML.join(''));
									
										$('#ns1blankspaceItemAdd').button(
										{
											label: "Add"
										})
										.click(function() {
											 ns1blankspace.financial.item.edit(oParam);
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

											aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">');
											aHTML.push('<span id="ns1blankspaceRowItem_options_remove-' + this.id + '" class="ns1blankspaceItemRemove"></span>');
											aHTML.push('</td></tr>');
										});
										
										aHTML.push('</table>');

										$('#ns1blankspaceItemColumn1').html(aHTML.join(''));
										
										$('.ns1blankspaceItemRemove').button( {
											text: false,
											icons: {
												primary: "ui-icon-close"
											}
										})
										.click(function() {
											oParam.xhtmlElementID = this.id;
											ns1blankspace.financial.item.remove(oParam);
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
											ns1blankspace.financial[sNamespace].item.edit({xhtmlElementID: this.id})
										})
										.css('width', '15px')
										.css('height', '17px')	
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
										url: ns1blankspace.util.endpointURI('FINANCIAL_ITEM_MANAGE'),
										data: 'remove=1&id=' + sID,
										dataType: 'json',
										success: function(data)
										{
											var sData = 'object=' + ns1blankspace.object;
											sData += '&objectcontext=' + ns1blankspace.objectContext;
											
											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('FINANCIAL_ITEM_COMPLETE'),
												data: sData,
												dataType: 'json',
												success: function(data){ns1blankspace.financial[sNamespace].refresh()}
											});
											
											ns1blankspace.financial[sNamespace].remove(oParam, data)
										}
									});
								}	
								else
								{
									if (oResponse.status == 'OK')
									{
										$('#' + sXHTMLElementID).parent().parent().fadeOut(500);
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
														'Amount' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceItemAmount" class="ns1blankspaceText">' +
														'</td></tr>');

										aHTML.push('<tr class="ns1blankspaceCaption">' +
														'<td class="ns1blankspaceCaption">' +
														'Description' +
														'</td></tr>' +
														'<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceTextMulti">' +
														'<textarea id="ns1blankspaceItemDescription" class="ns1blankspaceTextMulti" style="height:100px; width:200px;" rows="10" cols="35" ></textarea>' +
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
					
										$('#ns1blankspaceItemAccount').live('keyup', function()
										{
											$.extend(true, oParam, {step: 2});
											if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
									        ns1blankspace.timer.delayCurrent = setTimeout(ns1blankspace.financial.item.edit(oParam), ns1blankspace.option.typingWait);
										});	
											
										$('#ns1blankspaceItemAmount').focus();
									}

									if (iStep == 2)
									{	
										var oSearch = new AdvancedSearch();
										oSearch.method = 'SETUP_FINANCIAL_ACCOUNT_SEARCH';
										oSearch.addField('title');
										oSearch.addFilter('title', 'TEXT_IS_LIKE', $('#ns1blankspaceItemAccount').val());
										oSearch.addFilter('postable', 'EQUAL_TO', 'Y');
										oSearch.sort('title', 'asc');
										oSearch.getResults(function(data){ns1blankspace.financial.item.edit($.extend(true, oParam, {step:3}), data)});
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
											
											var sData = 'object=' + ns1blankspace.object;
											sData += '&objectcontext=' + ns1blankspace.objectContext;
											sData += '&financialaccount=' + iAccount;
											sData += '&amount=' + cAmount;
											sData += '&description=' + ns1blankspace.util.fs($('#ns1blankspaceItemDescription').val());
												
											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('FINANCIAL_ITEM_MANAGE'),
												data: sData,
												dataType: 'json',
												success: function(oResponse)
												{
													ns1blankspace.status.message('Added.');

													var sData = 'object=' + ns1blankspace.object;
													sData += '&objectcontext=' + ns1blankspace.objectContext;
													
													$.ajax(
													{
														type: 'POST',
														url: ns1blankspace.util.endpointURI('FINANCIAL_ITEM_COMPLETE'),
														data: sData,
														dataType: 'json',
														success: function(oResponse)
														{	
															oParam.refresh = true;
															ns1blankspace.financial.item.show(oParam);
															ns1blankspace.financial[sNamespace].refresh();
														}
													});
												}
											});
										})
										.css('width', '20px')
										.css('height', '20px')
										
										//$('input.ns1blankspaceText:first').focus();
									}
								}	
							}
				}					
}				