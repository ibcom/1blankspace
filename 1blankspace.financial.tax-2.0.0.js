/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */

ns1blankspace.financial.tax = 
{
	init: 		function (oParam)
				{
					var bInitialised = false;

					if (oParam != undefined)
					{
						if (oParam.initialised != undefined) {bInitialised = oParam.initialised}	
					}

					ns1blankspace.app.reset();

					ns1blankspace.object = -1;
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectParentName = 'financial';
					ns1blankspace.objectName = 'tax';
					ns1blankspace.objectContext = -1;
					ns1blankspace.viewName = 'Tax (BAS)';
					
					if (!bInitialised)
					{
						ns1blankspace.financial.initData(oParam)
					}
					else
					{
						ns1blankspace.app.set(oParam);
					}	
				},

	home: 		function (oParam, oResponse)
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
						oSearch.method = 'FINANCIAL_TAX_REPORT_SEARCH';
						oSearch.addField('taxstartdate,enddate,taxofficereference,statustext');
						oSearch.rows = 10;
						oSearch.sort('enddate', 'desc');
						oSearch.getResults(function(data){ns1blankspace.financial.tax.home(oParam, data)});
						
					}
					else
					{
						var aHTML = [];

						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table id="ns1blankspaceMostLikely">');
							aHTML.push('<tr><td class="ns1blankspaceNothing">Click New to add a tax report.</td></tr>');
							aHTML.push('</table>');
						}
						else
						{
							aHTML.push('<table id="ns1blankspaceMostLikely">');

							$.each(oResponse.data.rows, function()
							{
								aHTML.push('<tr class="ns1blankspaceRow">');
								
								aHTML.push('<td id="ns1blankspaceMostLikely_enddate-' + this.id + '" class="ns1blankspaceMostLikely" style="width:150px;">' +
														this.enddate + '</td>');

								aHTML.push('<td id="ns1blankspaceMostLikely_status-' + this.id + '" class="ns1blankspaceMostLikelySub" style="width:90px;">' +
														this.statustext  + '</td>');
							
								aHTML.push('<td>&nbsp;</td></tr>');
							});
					
							aHTML.push('</table>');
						}
						
						$('#ns1blankspaceMostLikely').html(aHTML.join(''));
					
						$('.ns1blankspaceMostLikely').click(function(event) {
							ns1blankspace.financial.tax.search.send(event.target.id, {source: 1});
						});
					}	
				},

	search: 	{
					send:		function (sXHTMLElementID, oParam)
								{
									var aSearch = sXHTMLElementID.split('-');
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
										$('#ns1blankspaceControl').html(ns1blankspace.xhtml.loading);
										
										ns1blankspace.objectContext = sSearchContext;
										
										var oSearch = new AdvancedSearch();
										oSearch.method = 'FINANCIAL_TAX_REPORT_SEARCH';
										oSearch.addField('*');
										oSearch.rf = 'json';
										oSearch.addFilter('id', 'EQUAL_TO', sSearchContext);
										oSearch.getResults(function(data) {ns1blankspace.financial.tax.show(oParam, data)});
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
											ns1blankspaceOptionsSetPosition(sElementId);
											
											var oSearch = new AdvancedSearch();
											oSearch.method = 'FINANCIAL_TAX_REPORT_SEARCH';
											oSearch.addField('enddate,taxofficereference');
											oSearch.addFilter('taxofficereference', 'TEXT_IS_LIKE', sSearchText);
											
											oSearch.getResults(function(data) {ns1blankspace.financial.tax.search.process(oParam, data)});	
										}
									};	
								},

					process:	function (oParam, oResponse)
								{
									var iColumn = 0;
									var aHTML = [];
									var h = -1;
									var	iMaximumColumns = 1;
										
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
												aHTML[++h] = '<tr class="ns1blankspaceSearch">';
											}
										
											aHTML[++h] = '<td class="ns1blankspaceSearch" id="' + +
															'-' + this.id + '">' +
															this.reference +
															'</td>';
											
											if (iColumn == iMaximumColumns)
											{
												aHTML[++h] = '</tr>'
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
											ns1blankspace.financial.tax.search.send(event.target.id, {source: 1});
										});
									}		
								}
				},				

	layout: 	function ()
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

						aHTML.push('<tr><td id="ns1blankspaceControlReport" class="ns1blankspaceControl">' +
										'Report</td></tr>');
					}				
					
					aHTML.push('</table>');

					$('#ns1blankspaceControl').html(aHTML.join(''));
					
					var aHTML = []

					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainDetails" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainReport" class="ns1blankspaceControlMain"></div>');
					
					$('#ns1blankspaceMain').html(aHTML.join(''));
					
						$('#ns1blankspaceControlSummary').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
						ns1blankspace.financial.tax.summary();
					});

					$('#ns1blankspaceControlDetails').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
						ns1blankspace.financial.tax.details();
					});
					
					$('#ns1blankspaceControlReport').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainReport', refresh: true});
						ns1blankspace.financial.tax.report.layout();
					});
				},

	show:		function (oParam, oResponse)
				{	
					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
					ns1blankspace.financial.tax.layout();
					
					var aHTML = [];
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
						
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find the tax report.</td></tr></table>');
								
						$('#ns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						ns1blankspace.objectContextData = oResponse.data.rows[0];
						
						$('#ns1blankspaceViewControlAction').button({disabled: false});
								
						$('#ns1blankspaceControlContext').html(ns1blankspace.objectContextData['taxreport.enddate'] +
							'<br /><span id="ns1blankspaceControlContext_startdate" class="ns1blankspaceSub">' + ns1blankspace.objectContextData['taxreport.taxstartdate'] + '</span>');
							
						ns1blankspace.history.view({
							newDestination: 'ns1blankspace.financial.tax.init({showHome: false, id: ' + ns1blankspace.objectContext + '})',
							move: false
							})
						
						ns1blankspace.history.control({functionDefault: 'ns1blankspace.financial.tax.summary()'});
					}	
				},	

	summary:	function (oParam, oResponse)
				{
					var aHTML = [];
					var bUseTemplate = false;
					
					if (oParam)
					{
						if (oParam.useTemplate != undefined) {bUseTemplate = oParam.useTemplate}
					}

					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find the tax report.</td></tr></table>');
								
						$('#ns1blankspaceMainSummary').html(aHTML.join(''));
					}
					else
					{
						aHTML.push('<table class="ns1blankspaceMain">' +
										'<tr class="ns1blankspaceRow">' +
										'<td id="ns1blankspaceSummaryColumn1" class="ns1blankspaceColumn1Flexible"></td>' +
										'<td id="ns1blankspaceSummaryColumn2" class="ns1blankspaceColumn2" style="width:250px;"></td>' +
										'</tr>' +
										'</table>');				
		
						$('#ns1blankspaceMainSummary').html(aHTML.join(''));	
				
						var aHTML = [];

						var cTaxPayable = (ns1blankspace.objectContextData['taxreport.g9']).parseCurrency();

						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">' + ns1blankspace.option.taxCaption + ' on Sales (collected)</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryG9" class="ns1blankspaceSummary">$' +
										cTaxPayable.formatMoney(0, ".", ",") +
										'</td></tr>');

						var cTaxCredit = (ns1blankspace.objectContextData['taxreport.g20']).parseCurrency();

						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">' + ns1blankspace.option.taxCaption + ' on Purchases (credits)</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryG20" class="ns1blankspaceSummary">$' +
										cTaxCredit.formatMoney(0, ".", ",")+
										'</td></tr>');

						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">' + ns1blankspace.option.taxCaption + ' Payable</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryG20" class="ns1blankspaceSummary">$' +
										(cTaxPayable - cTaxCredit).formatMoney(0, '.', ',') +
										'</td></tr>');

						$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));

						var aHTML = [];
					
						aHTML.push('<table class="ns1blankspaceColumn2">');
						aHTML.push('<tr><td id="ns1blankspaceSummaryAmount" class="ns1blankspaceSub" >' +
										'This tax report was last updated on the ' + ns1blankspace.objectContextData['taxreport.modifieddate'] + '.' +
										'</td></tr>');

						aHTML.push('<tr><td style="padding-top:10px;">' +
										'<span id="ns1blankspaceSummaryCalculate" class="ns1blankspaceAction" style="font-size:0.875em;">Recalculate</span>' +
										'</td></tr>');

						aHTML.push('</table>');					

						$('#ns1blankspaceSummaryColumn2').html(aHTML.join(''));

						$('#ns1blankspaceSummaryCalculate').button(
						{
							
						})
						.click(function() {
							ns1blankspace.financial.tax.save.send()
						});		
					}			
				},

	details:	function (oParam)
				{	
					if ($('#ns1blankspaceMainDetails').attr('data-loading') == '1')
					{
						$('#ns1blankspaceMainDetails').attr('data-loading', '');
							
						var aHTML = [];
								
						aHTML.push('<table class="ns1blankspaceContainer">');
						aHTML.push('<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceDetailsColumn1" class="ns1blankspaceColumn1"></td>' +
										'<td id="ns1blankspaceDetailsColumn2" class="ns1blankspaceColumn2"></td>' +
										'</tr>');
						aHTML.push('</table>');					
						
						$('#ns1blankspaceMainDetails').html(aHTML.join(''));

						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspace">');
						
						if (ns1blankspace.objectContext == -1)
						{
							aHTML.push('<table><tr><td class="ns1blankspaceNothing">The details for the next tax reporting will be set up automatically.' +
								'<br /><br /><span id="ns1blankspaceFinancialTaxNewContinue" class="ns1blankspaceAction">Continue</span></td></tr></table>');
						}	
						else
						{	
							aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'End Date' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceDate">' +
										'<input id="ns1blankspaceDetailsEndDate" class="ns1blankspaceDate">' +
										'</td></tr>');			

							aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Status' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioStatus1" name="radioStatus" value="1"/>In Progress' +
										'<br /><input type="radio" id="radioStatus2" name="radioStatus" value="2"/>Completed' +
										'</td></tr>');
						}	
																																	
						aHTML.push('</table>');					
					
						$('#ns1blankspaceDetailsColumn1').html(aHTML.join(''));

						$('#ns1blankspaceFinancialTaxNewContinue').button({})
						.click(function() {
							ns1blankspace.financial.tax.save.send();
						});				
					
						$('input.ns1blankspaceDate').datepicker({dateFormat: 'dd M yy'});

						if (ns1blankspace.objectContextData != undefined)
						{
							$('#ns1blankspaceDetailsEndDate').val(ns1blankspace.objectContextData['taxreport.enddate']);
							$('[name="radioStatus"][value="' + ns1blankspace.objectContextData['taxreport.status'] + '"]').attr('checked', true);
						}
					}
				},		

	report: 	{
					layout:		function ()
								{
									var aHTML = [];

									aHTML.push('<table class="ns1blankspaceContainer">');

									aHTML.push('<tr class="ns1blankspaceContainer">' +
													'<td id="ns1blankspaceTaxReportCategoryColumn" class="ns1blankspaceColumn1" style="width: 120px;padding-right:5px;font-size:0.875em;">' +
													ns1blankspace.xhtml.loading + '</td>' +
													'<td id="ns1blankspaceTaxReportTypeColumn" class="ns1blankspaceColumn2" style="width: 175px;padding-right:5px;"></td>' +
													'<td id="ns1blankspaceTaxReportItemColumn" class="ns1blankspaceColumn2"></td>' +
													'</tr>');

									aHTML.push('</table>');					
									
									$('#ns1blankspaceMainReport').html(aHTML.join(''));
												
									var aHTML = [];
									
									aHTML.push('<div id="ns1blankspaceTaxCategoryColumn" style="width: 110px;margin-bottom:3px; font-size:0.75em;">');
									aHTML.push('<input style="width: 115px;" type="radio" id="ns1blankspaceTaxCategoryColumn-revenue" name="radioCategory" checked="checked" />' +
													'<label for="ns1blankspaceTaxCategoryColumn-revenue" style="width: 115px;">Supplies (Sales)</label>');
									aHTML.push('<input style="width: 115px;" type="radio" id="ns1blankspaceTaxCategoryColumn-expense" name="radioCategory" />' +
													'<label for="ns1blankspaceTaxCategoryColumn-expense" style="width: 115px;">Aquisitions (Purchases)</label>');
									aHTML.push('</div>');

									$('#ns1blankspaceTaxReportCategoryColumn').html(aHTML.join(''));			
										
									$('#ns1blankspaceTaxCategoryColumn').buttonset().css('font-size', '0.875em');
											
									$('#ns1blankspaceTaxCategoryColumn :radio').click(function()
									{
										var aID = (event.target.id).split('-');
										ns1blankspace.financial.tax.report.show({category: aID[1]});	
									});

									ns1blankspace.financial.tax.report.show();
								},

					show:		function (oParam)	
								{	
									var sCategory = "revenue";

									ns1blankspace.financial.reportSummary = {
										"revenue":
											[
												{code: "g1", total: false, title: "Total sales income & other sales"},
												{code: "g2", total: false, title: "Exports"},
												{code: "g3", total: false, title: "Other GST-free sales"},
												{code: "g4", total: false, title: "Input taxed sales"},
												{code: "g5", total: true, title: "Total of GST-free and input taxed supplies"},
												{code: "g6", total: true, title: "Total of taxable sales"},
												{code: "g7", total: true, title: "Adjustments"},
												{code: "g8", total: true, title: "Total of taxable sales after adjustments"},
												{code: "g9", total: true, title: "GST Collected"}
											],
										"expense": 
											[
												{code: "g10", total: false, title: "Capital Acquisitions"},
												{code: "g11", total: true, title: "Other acquisitions"},
												{code: "g12", total: true, title: "Total of acquisitions"},
												{code: "g13", total: false, title: "Acquisitions for making input taxed sales"},
												{code: "g14", total: false, title: "Acquisitions with no GST in the price"},
												{code: "g15", total: false, title: "Total of estimated private use of acquisitions + non income tax deductible acquisitions"},
												{code: "g16", total: true, title: "Total of non-refundable acquisition"},
												{code: "g17", total: true, title: "Total of refundable acquisitions"},
												{code: "g18", total: true, title: "Adjustments"},
												{code: "g19", total: true, title: "Total of refundable acquisitions after adjustments"},
												{code: "g20", total: true, title: "GST Credits"}
											],
										"payroll":
											[
												{code: "w1", total: false, title: "Total salary, wages & other payments"},
												{code: "w2", total: false, title: "Amount withheld from payments shown at W1"}
											],
										"instalments":
											[
												{code: "t1", total: false, title: "PAYG Instalment Income"},
												{code: "t2", total: false, title: "Instalment Rate %"},
												{code: "t3", total: false, title: "Varied % Rate"},
												{code: "t7", total: false, title: "Nominated Value"},
												{code: "t9", total: false, title: "Varied amount for period"},
												{code: "t11", total: false, title: "Income Tax Instalment"}
											]
									};
									
									if (oParam != undefined)
									{
										if (oParam.category != undefined) {sCategory = oParam.category}
									}
									
									$('#ns1blankspaceTaxReportTypeColumn').html(ns1blankspace.xhtml.loadingSmall);
									
									var aHTML = [];
									var sField;
										
									aHTML.push('<table id="ns1blankspaceTaxReportType" class="ns1blankspace">');
									
									$.each(ns1blankspace.financial.reportSummary[sCategory], function()
									{
										sField = (this.code).toUpperCase();
										
										aHTML.push('<tr><td colspan=2 id="ns1blankspaceReportType_title-' + sField + '" class="ns1blankspaceSub" style="font-size:0.75em;">' +
														this.title + '</td></tr>');

										aHTML.push('<tr class="ns1blankspaceRow">');
														
										if (this.total)
										{		
											aHTML.push('<td id="ns1blankspaceReportType_type-' + sField + '" class="ns1blankspaceRow" style="width:150px;">' +
														sField + '</td>');

											aHTML.push('<td id="ns1blankspaceReportType_amount-' + sField + '" class="ns1blankspaceRow" style="width:90px;text-align:right;">' +
														'' + (ns1blankspace.objectContextData['taxreport.' + this.code]).parseCurrency().formatMoney(0, ".", ",") + '</td>');
										}
										else
										{
											aHTML.push('<td id="ns1blankspaceReportType_type-' + sField + '" class="ns1blankspaceRow ns1blankspaceRowSelect ns1blankspaceType" style="width:150px;">' +
														sField + '</td>');

											aHTML.push('<td id="ns1blankspaceReportType_amount-' + sField + '" class="ns1blankspaceRow ns1blankspaceRowSelect ns1blankspaceType" style="width:90px;text-align:right;">' +
														'' + (ns1blankspace.objectContextData['taxreport.' + this.code]).parseCurrency().formatMoney(0, ".", ",") + '</td>');
										}	
																																											
										aHTML.push('</tr>');
									});

									aHTML.push('</table>');
									
									$('#ns1blankspaceTaxReportTypeColumn').html(aHTML.join(''));
									$('#ns1blankspaceTaxReportItemColumn').html('');
									
									$('.ns1blankspaceType').click(function()
									{
										var aID = (event.target.id).split('-');
										ns1blankspace.financial.tax.report.items({field: aID[1]});
									});
								},

					items:		function (oParam, oResponse)
								{
									var iStep = 1;
									var iType = 1;
									var iSubType = 1;
									var sField = 'G1';
									
									if (oParam != undefined)
									{
										if (oParam.step != undefined) {iStep = oParam.step}
										if (oParam.type != undefined) {iType = oParam.type}
										if (oParam.subType != undefined) {iSubType = oParam.subType}
										if (oParam.field != undefined) {sField = oParam.field}
									}
									else
									{
										oParam = {};
									}
									
									if (iStep == 1)
									{
										$.extend(true, oParam, {step: 2});
										
										var aHTML = [];
										
										aHTML.push('<tr class="ns1blankspaceContainer">' +
													'<td id="ns1blankspaceTaxReportItemSubTypeColumn" class="ns1blankspaceColumn1" style="width:120px; padding-right:5px; font-size:0.75em;">' +
													ns1blankspace.xhtml.loading + '</td>' +
													'<td id="ns1blankspaceTaxReportItemsColumn" class="ns1blankspaceColumn2" style="width: 285px;padding-right:5px; font-size:0.875em;"></td>' +
													'</tr>');

										$('#ns1blankspaceTaxReportItemColumn').html(aHTML.join(''));
												
										var aHTML = [];

										aHTML.push('<div id="ns1blankspaceTaxSubTypeColumn" style="width: 115px;margin-bottom:3px;">');
									
										aHTML.push('<input style="width: 115px;" type="radio" id="interfaceMainTaxSubTypeColumn-1" name="radioSubType" checked="checked" />' +
														'<label for="interfaceMainTaxSubTypeColumn-1" style="width: 115px;">Standard</label>');
									
										aHTML.push('<input style="width: 115px;"  type="radio" id="interfaceMainTaxSubTypeColumn-2" name="radioSubType" />' +
														'<label for="interfaceMainTaxSubTypeColumn-2" style="width: 115px;">Credit Notes</label>');
									
										aHTML.push('<input style="width: 115px;"  type="radio" id="interfaceMainTaxSubTypeColumn-3" name="radioSubType" />' +
														'<label for="interfaceMainTaxSubTypeColumn-3" style="width: 115px;">General Jounals (+ve)</label>');
									
										aHTML.push('<input style="width: 115px;"  type="radio" id="interfaceMainTaxSubTypeColumn-4" name="radioSubType" />' +
														'<label for="interfaceMainTaxSubTypeColumn-4" style="width: 115px;">General Jounals (-ve)</label>');
										
										aHTML.push('</div>');

										$('#ns1blankspaceTaxReportItemSubTypeColumn').html(aHTML.join(''));			
										
										$('#ns1blankspaceTaxSubTypeColumn').buttonset().css('font-size', '0.875em');
											
										$('#ns1blankspaceTaxSubTypeColumn :radio').click(function()
										{
											var aID = (event.target.id).split('-');
											$.extend(true, oParam, {subType: aID[1], step: 2});
											ns1blankspace.financial.tax.report.items(oParam);	
										});
										
										ns1blankspace.financial.tax.report.items(oParam);
									}
									
									if (iStep == 2)
									{
										oParam.step = 3;
										
										var sData = 'id=' + ns1blankspace.objectContext +
													'&type=' + iType +
													'&subtype=' + iSubType +
													'&field=' + sField +
													'&rows=200';
										
										$('#ns1blankspaceTaxReportItemsColumn').html(ns1blankspace.xhtml.loading);

										$.ajax(
										{
											type: 'POST',
											url: ns1blankspace.util.endpointURI('FINANCIAL_TAX_REPORT_ITEM_SEARCH'),
											data: sData,
											dataType: 'json',
											success: function(data) {
												ns1blankspace.financial.tax.report.items(oParam, data)
											}
										});
									}
									
									if (iStep == 3)
									{
										var aHTML = [];

										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table class="ns1blankspace">' +
															'<tr><td class="ns1blankspaceNothing">No items.</td></tr>' + 
															'</table>');
										}	
										else
										{	
											aHTML.push('<table id="ns1blankspaceReportItems" class="ns1blankspace">' +
													'<tr class="ns1blankspaceCaption">' +
													'<td class="ns1blankspaceHeaderCaption">Details</td>' +
													'<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Amount</td>' +
													'<td class="ns1blankspaceHeaderCaption" style="text-align:right;">' + ns1blankspace.option.taxCaption + '</td>' +
													'<td class="ns1blankspaceHeaderCaption">&nbsp;</td>' +
													'</tr>');

											$.each(oResponse.data.rows, function()
											{
												aHTML.push('<tr class="ns1blankspaceRow">');
											
												if (iSubType == 1)
												{					
													aHTML.push('<td id="ns1blankspaceReportItems_details-' + this.parentid + '" class="ns1blankspaceRow ns1blankspaceRowSelect ns1blankspaceRowSelect11">' +
																		this.transactiondate + '<br />' + this.description + '</td>');
											
												}

												if (iSubType == 2 || iSubType == 3 || iSubType == 4)
												{					
													aHTML.push('<td id="ns1blankspaceReportItems_reference-' + this.id + '" class="ns1blankspaceRow">' +
																		this.reference + '</td>');
											
												}

												aHTML.push('<td style="text-align:right;" class="ns1blankspaceRow">' +
																		this.amount + '</td>');
												
												aHTML.push('<td style="text-align:right;" class="ns1blankspaceRow">' +
																		this.tax + '</td>');
																
												aHTML.push('</tr>');
											});
											
											aHTML.push('</table>');
										}	

										$('#ns1blankspaceTaxReportItemsColumn').html(aHTML.join(''));

										$('#ns1blankspaceReportItems .ns1blankspaceRowSelect11').click(function()
										{
											var aID = (event.target.id).split('-');
												
											ns1blankspace.financial.expense.init({showHome: false});
											ns1blankspace.financial.expense.search.send('-' + aID[1]);	
										});
									}	
								}
				},

				save: 		{
								send: 		function ()
											{
												var sData = 'id=';
												
												if (ns1blankspace.objectContext != -1)
												{
													sData += ns1blankspace.objectContext;
												} 
												
												if ($('#ns1blankspaceMainDetails').html() != '')
												{
													if (ns1blankspace.util.fs($('#ns1blankspaceDetailsEndDate').val()) != '')
													{	
														sData += '&enddate=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsEndDate').val());
													}
														
													if (ns1blankspace.util.fs($('input[name="radioStatus"]:checked').val()) != '')
													{	
														sData += '&status=' + ns1blankspace.util.fs($('input[name="radioStatus"]:checked').val());
													}	
												}
													
												ns1blankspace.status.working();
													
												$.ajax(
												{
													type: 'POST',
													url: ns1blankspace.util.endpointURI('FINANCIAL_TAX_REPORT_MANAGE'),
													data: sData,
													dataType: 'json',
													success: this.process
												});
											},

								process: 	function (oResponse)
											{	
												if (oResponse.status == 'OK')
												{
													ns1blankspace.status.message('Saved');
													if (ns1blankspace.objectContext == -1) {var bNew = true}
													ns1blankspace.objectContext = oResponse.id;	
													
													ns1blankspace.financial.tax.search.send('-' + ns1blankspace.objectContext);
												}
												else
												{
													ns1blankspace.status.error(oResponse.error.errornotes);
												}
											}
				}			

}				