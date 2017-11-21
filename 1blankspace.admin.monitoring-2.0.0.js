/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 */

if (ns1blankspace.admin === undefined) {ns1blankspace.admin = {}}

ns1blankspace.admin.monitoring = 
{
	init: 		function (oParam)
				{
					var bShowHome = true
					
					if (oParam != undefined)
					{
						if (oParam.showHome != undefined) {bShowHome = oParam.showHome}
					}

					ns1blankspace.app.reset();

					ns1blankspace.objectParentName = 'admin';
					ns1blankspace.objectName = 'monitoring';
					ns1blankspace.viewName = 'Monitoring';
					
					ns1blankspace.app.set(oParam);
				},

	home:		function (oParam, oResponse)
				{
					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
					$('#ns1blankspaceViewControlAction').button({disabled: false});
					$('#ns1blankspaceViewControlNew').button({disabled: true});
					
					var aHTML = [];
								
					aHTML.push('<table>');

					aHTML.push('<tr><td><div id="ns1blankspaceViewFinancialLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>');

					aHTML.push('</table>');		
						
					aHTML.push('<table class="ns1blankspaceControl" style="padding-top:10px;">');
					
					aHTML.push('<tr><td id="ns1blankspaceControlSummary" class="ns1blankspaceControl ns1blankspaceHighlight">' +
									'Summary</td></tr>');
						
					aHTML.push('<tr><td id="ns1blankspaceControlServiceFaults" class="ns1blankspaceControl">' +
									'Service Faults</td></tr>');

					aHTML.push('<tr><td id="ns1blankspaceControlRequests" class="ns1blankspaceControl">' +
									'Requests</td></tr>');

					aHTML.push('<tr><td id="ns1blankspaceControlNews" class="ns1blankspaceControl">' +
									'News</td></tr>');

					aHTML.push('</table>');		
					
					aHTML.push('<table class="ns1blankspaceControl">');
					
					aHTML.push('<tr><td class="ns1blankspaceSub" style="font-size:0.875em; border-bottom-style:solid; border-width: 0px; border-color: #D0D0D0;">' +
									'STATE CHANNEL</td></tr>');

					aHTML.push('<tr><td id="ns1blankspaceControlStateChannelStatus" class="ns1blankspaceControl">' +
									'Status</td></tr>');

					aHTML.push('</table>');

					$('#ns1blankspaceControl').html(aHTML.join(''));	
					
					var aHTML = [];
					
					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainServiceFaults" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainRequests" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainNews" class="ns1blankspaceControlMain"></div>');

					aHTML.push('<div id="ns1blankspaceMainStateChannel" class="ns1blankspaceControlMain"></div>');

					$('#ns1blankspaceMain').html(aHTML.join(''));
					
					$('#ns1blankspaceControlSummary').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
						ns1blankspace.admin.monitoring.summary();
					});

					$('#ns1blankspaceControlStateChannelStatus').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainStateChannel'});
						ns1blankspace.admin.monitoring.stateChannel.status();
					});

					ns1blankspace.admin.monitoring.summary();
				},

	summary:	function ()
				{
					var aHTML = [];

					aHTML.push('<table class="ns1blankspaceMain">' +
								'<tr class="ns1blankspaceRow">' +
								'<td id="ns1blankspaceSummaryColumn1" class="ns1blankspaceColumn1Flexible"></td>' +
								'<td id="ns1blankspaceSummaryColumn2" class="ns1blankspaceColumn2" style="width:250px;"></td>' +
								'</tr>' +
								'</table>');				
					
					$('#ns1blankspaceMainSummary').html(aHTML.join(''));	

					var aHTML = [];

					aHTML.push('<table class="ns1blankspace">');

					aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Service Faults (last 24 hours)</td></tr>' +
									'<tr><td id="ns1blankspaceSummaryServiceFaults" class="ns1blankspaceSummary">' +
									ns1blankspace.xhtml.loadingSmall +
									'</td></tr>');

					aHTML.push('</table>');

					$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));

					ns1blankspace.admin.monitoring.serviceFaults.count()
				},

	stateChannel:
				{
					status: 	function (oParam, oResponse)
								{
									if (oResponse === undefined)
									{
										$.ajax(
									{
										type: 'GET',
										url: ns1blankspace.util.endpointURI('ADMIN_MODEL_DATA_AUDIT_SYNC_STATUS'),
										dataType: 'json',
										success: function(data)
										{
											ns1blankspace.admin.monitoring.stateChannel.status(oParam, data);
										}
									});		
									}
									else
									{
										var aHTML = [];

										aHTML.push('<table>');

										aHTML.push('<tr><td class="ns1blankspaceHeader">TO BE PROCESSED</td>' +
														'<td class="ns1blankspaceHeader"></td></tr>');

										aHTML.push('<tr><td class="ns1blankspaceRow">Count</td>' +
														'<td class="ns1blankspaceRow">' + oResponse["tobeprocesssed-count"] + '</td></tr>');

										aHTML.push('<tr><td class="ns1blankspaceRow">Source Minimum Date (lag)</td>' +
														'<td class="ns1blankspaceRow">' + oResponse["tobeprocesssed-sourceminimumdate"] + '</td></tr>');

										aHTML.push('</table>');	

										$('#ns1blankspaceMainStateChannel').html(aHTML.join(''))	

										//{"status": "OK","notes": "COMPLETED","xhtmlcontext": "","tobeprocesssed-count": "136401","tobeprocesssed-minimumdate": "9 Feb 2014 22:45:53","tobeprocesssed-sourceminimumdate": "4 Feb 2014 22:29:33","tobeprocesssed-maximumdate": "9 Feb 2014 22:46:05","tobeprocesssed-sourcemaximumdate": "9 Feb 2014 22:36:14","processsed-count": "124717","processsed-maximumdate": "9 Feb 2014 22:46:05","processsed-sourcemaximumdate": "9 Feb 2014 22:42:34","processsed-last24h-count": "37502","processsed-last24h-maximumdate": "9 Feb 2014 22:46:05","processsed-last24h-sourcemaximumdate": "9 Feb 2014 22:42:34"}
									}	
								}
				}
}				


ns1blankspace.admin.monitoring.serviceFaults =
{
	data: 	{searchText: undefined},

	init: 	function (oParam, oResponse)
				{
					ns1blankspace.financial.payroll.superannuation.urls(
					{
						onComplete: ns1blankspace.financial.payroll.superannuation.providers,
						onCompleteWhenCan: ns1blankspace.financial.payroll.superannuation.expenses
					});
				},

	count: 	function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{
						var oSearch = new AdvancedSearch();
						oSearch.method = 'ADMIN_SERVICE_FAULT_SEARCH';
						oSearch.addField('id');
						oSearch.addFilter('createddate', 'GREATER_THAN_OR_EQUAL_TO', 'hour', '-24', 'start_of_today');
						oSearch.addSummaryField('count(id) count');
						oSearch.rows = 1;
						oSearch.getResults(function(data) {ns1blankspace.admin.monitoring.serviceFaults.count(oParam, data)})	
					}
					else
					{
						$('#ns1blankspaceSummaryServiceFaults').html(oResponse.summary.count);
					}	
				},	

	summary:	function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{}
					else
					{}	
				},			

	expenses:	function (oParam, oResponse)
				{
					var iSearchBankAccount = ns1blankspace.util.getParam(oParam, 'searchBankAccount', {"default": -1}).value;
					var oSearchText = ns1blankspace.util.getParam(oParam, 'searchText');
					var sSearchText;

					if (oSearchText.exists)
					{
						sSearchText = oSearchText.value;
						ns1blankspace.financial.payroll.superannuation.data.searchText = sSearchText;
					}
					else
					{	
						sSearchText = ns1blankspace.financial.payroll.superannuation.data.searchText;
					}	

					if (oResponse == undefined)
					{	
						var aHTML = [];
	
						aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspacePayrollSuperannuationExpenseColumn1"></td>' +
										'<td id="ns1blankspacePayrollSuperannuationExpenseColumn2" style="width:115px;"></td>' +
										'</tr>' +
										'</table>');				
						
						$('#ns1blankspaceMainSuperannuation').html(aHTML.join(''));

						$('#ns1blankspacePayrollSuperannuationExpenseColumn1').html(ns1blankspace.xhtml.loading);

						ns1blankspace.financial.payroll.superannuation.data.expenses = [];

						var aContactBusiness = _.map(ns1blankspace.financial.payroll.superannuation.data.providers, 'supercontactbusiness');
						aContactBusiness.push(ns1blankspace.financial.data.settings.payrollsuperannuationcontactbusiness);

						var oSearch = new AdvancedSearch();
						oSearch.method = 'FINANCIAL_EXPENSE_SEARCH';
						oSearch.addField('reference,amount,outstandingamount,description,contactbusinesspaidto,contactbusinesspaidtotext,contactpersonpaidto,contactpersonpaidtotext,accrueddate');
						oSearch.addFilter('paystatus', 'EQUAL_TO', 1);
						oSearch.addFilter('outstandingamount', 'NOT_EQUAL_TO', 0);
						oSearch.addFilter('contactbusinesspaidto', 'IN_LIST', aContactBusiness.join(','));

						if (sSearchText != undefined)
						{
							oSearch.addBracket('(');
							oSearch.addFilter('contactpersonpaidtotext', 'TEXT_IS_LIKE', sSearchText);
							oSearch.addOperator('or');
							oSearch.addFilter('contactbusinesspaidtotext', 'TEXT_IS_LIKE', sSearchText);
							oSearch.addOperator('or');
							oSearch.addFilter('description', 'TEXT_IS_LIKE', sSearchText);
							oSearch.addBracket(')');
						}

						if (iSearchBankAccount != -1)
						{
							oSearch.addFilter('bankaccount', 'EQUAL_TO', iSearchBankAccount);
						}

						oSearch.addSummaryField('sum(amount) totalamount')

						oSearch.rows = 100;
						oSearch.sort('accrueddate', 'asc');
						oSearch.getResults(function(data) {ns1blankspace.financial.payroll.superannuation.expenses(oParam, data)});
					}
					else
					{
						var aHTML = [];
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table id="ns1blankspaceInvoicingUnsent">' +
											'<tr><td class="ns1blankspaceSub">No outstanding superannuation expenses.</td></tr></table>');

							$('#ns1blankspacePayrollSuperannuationExpenseColumn1').html('');
						}
						else
						{
							var iPaymentAccount = ns1blankspace.util.getParam(oParam, 'paymentAccount').value;

							$('#ns1blankspacePayrollSuperannuationExpenseColumn2').html(aHTML.join(''));
						
							var aHTML = [];

							aHTML.push('<table id="ns1blankspacePayrollSuperannuationExpense" class="ns1blankspace" style="font-size:0.875em;">' +
										'<tr class="ns1blankspaceHeaderCaption">' +
										'<td class="ns1blankspaceHeaderCaption" style="width:10px;"><span class="ns1blankspacePayrollSuperannuationExpenseSelectAll"></span></td>' +
										'<td class="ns1blankspaceHeaderCaption" style="width:100px;">Contact</td>' +
										'<td class="ns1blankspaceHeaderCaption">Description</td>' +
										'<td class="ns1blankspaceHeaderCaption" style="width:50px; text-align:right;">Amount</td>' +
										'<td class="ns1blankspaceHeaderCaption" style="width:70px; text-align:right;">Due Date</td>' +
										'<td class="ns1blankspaceHeaderCaption" style="width:25px; text-align:right;">&nbsp;</td>' +
										'</tr>');

							$(oResponse.data.rows).each(function() 
							{
								aHTML.push(ns1blankspace.financial.payroll.superannuation.row(this));
							});
							
							aHTML.push('</table>');
						}

						ns1blankspace.render.page.show(
						{
							type: 'JSON',
							xhtmlElementID: 'ns1blankspacePayrollSuperannuationExpenseColumn1',
							xhtmlContext: 'PayrollSuperannuationExpense',
							xhtml: aHTML.join(''),
							showMore: (oResponse.morerows == "true"),
							more: oResponse.moreid,
							rows: 100,
							functionShowRow: ns1blankspace.financial.payroll.superannuation.row,
							functionOpen: undefined,
							functionOnNewPage: ns1blankspace.financial.payroll.superannuation.bind
						});

						var aHTML = [];

						aHTML.push('<table class="ns1blankspaceColumn2">');

						aHTML.push('<tr><td class="ns1blankspaceText" style="padding-top:14px;">' +
												'<input id="ns1blankspacePayrollSuperannuationExpenseSearchText" class="ns1blankspaceText" style="width:130px;">' +
												'</td></tr>');
																			
						aHTML.push('<tr><td style="padding-top:0px;">' +
										'<span id="ns1blankspacePayrollSuperannuationExpenseSearch" class="ns1blankspaceAction">Search</span>' +
										'');

						if (sSearchText != undefined)
						{	
							aHTML.push('' +
										' <span id="ns1blankspacePayrollSuperannuationExpenseSearchClear" class="ns1blankspaceAction">Clear</span>' +
										'</td></tr>');
						}

						aHTML.push('<tr><td style="padding-top:15px; padding-bottom:0px; font-size:0.75em;" class="ns1blankspaceSub">' +
										'Selected expenses total</td></tr>');

						aHTML.push('<tr><td id="ns1blankspacePayrollSuperannuationExpenseTotal" style="padding-top:0px; font-size:1.2em; padding-bottom:16px;" class="ns1blankspaceSub">' +
										'</td></tr>');

						aHTML.push('<tr><td id="ns1blankspacePayrollSuperannuationExpenseURLs" style="padding-top:0px; font-size:1em; padding-bottom:16px;" class="ns1blankspaceSub">' +
										'</td></tr>');

						aHTML.push('<tr><td id="ns1blankspacePayrollSuperannuationExpenseTotals" style="padding-top:0px; padding-bottom:6px;" class="ns1blankspaceSub">' +
										'</td></tr>');
						
						aHTML.push('</table>');

						if ($('#ns1blankspacePayrollSuperannuationExpenseColumn2 table').length == 0)
						{
							$('#ns1blankspacePayrollSuperannuationExpenseColumn2').html(aHTML.join(''));
						}
						else
						{
							$('#ns1blankspacePayrollSuperannuationExpenseColumn2 table').before(aHTML.join(''));
						}

						$('#ns1blankspacePayrollSuperannuationExpenseSearch').button(
						{
							label: 'Search'
						})
						.click(function() 
						{
							oParam = ns1blankspace.util.setParam(oParam, 'searchText', $('#ns1blankspacePayrollSuperannuationExpenseSearchText').val());
							ns1blankspace.financial.payroll.superannuation.expenses(oParam);
						})
						.css('width', '65px');

						$('#ns1blankspacePayrollSuperannuationExpenseSearchClear').button(
						{
							label: 'Clear'
						})
						.click(function() 
						{
							oParam = ns1blankspace.util.setParam(oParam, 'searchText', undefined);
							ns1blankspace.financial.payroll.superannuation.expenses(oParam);
						})
						.css('width', '57px');

						$('#ns1blankspacePayrollSuperannuationExpenseSearchText').keyup(function(e)
						{
							if (e.which === 13)
					    	{
					    		oParam = ns1blankspace.util.setParam(oParam, 'searchText', $('#ns1blankspacePayrollSuperannuationExpenseSearchText').val())
					    		ns1blankspace.financial.payroll.superannuation.expenses(oParam);
					    	}
						});				

						$('#ns1blankspacePayrollSuperannuationExpenseSearchText').val(sSearchText);

						if (ns1blankspace.financial.payroll.data.urls.length == 0)
						{

						}
						else
						{
							$('#ns1blankspacePayrollSuperannuationExpenseURLs').html(
								'<div style="font-size:0.75em;">Make a payment using...</div>' +
								_.join(_.map(ns1blankspace.financial.payroll.data.urls, function (provider)
								{
									return '<div><a style="font-size:0.875em;" href="' + (provider.url.indexOf('http')==-1?'http://':'') + provider.url + '" target="_blank" title="' + provider.urllogon + '">' +
										 provider.title + '</a></div>'
								}), '')
							)
						}

						ns1blankspace.financial.payroll.superannuation.summary();

						ns1blankspace.financial.payroll.superannuation.refresh();		
					}
				},

	refresh: function ()
				{
					var cTotal = _.sum(_.map($('#ns1blankspacePayrollSuperannuationExpenseColumn1 input:checked'), function (input) {return _.toNumber($(input).attr('data-outstandingamount'))}));
					var sTotal = ns1blankspace.option.currencySymbol + _.toNumber(cTotal).formatMoney(2, '.', ',');
					$('#ns1blankspacePayrollSuperannuationExpenseTotal').html(sTotal)
				},						

	row: 		function (oRow)	
				{
					var aHTML = [];

					oRow.hasEmail = false;
					
					var sContact = oRow['contactbusinesspaidtotext'];
					if (sContact == '') {sContact = oRow['contactpersonpaidtotext']}

					ns1blankspace.financial.payroll.superannuation.data.expenses.push(oRow);

					aHTML.push('<tr class="ns1blankspaceRow">' +
									'<td class="ns1blankspaceRow ns1blankspaceSub" id="ns1blankspacePayrollSuperannuationExpense_selectContainer-' + oRow["id"] + '">' +
									'<input type="checkbox" checked="checked" id="ns1blankspacePayrollSuperannuationExpense_select-' + oRow["id"] + '"' + 
									' title="' + oRow["reference"] + '"' +
									' data-outstandingamount="' + oRow["outstandingamount"].replace(',', '') + '" /></td>');

					aHTML.push('<td id="ns1blankspacePayrollSuperannuationExpense_contact-' + oRow["id"] + '" class="ns1blankspaceRow">' +
										sContact + '</td>');

					aHTML.push('<td id="ns1blankspacePayrollSuperannuationExpense_description-' + oRow["id"] + '" class="ns1blankspaceRow">' +
									'<div>' + oRow["description"] + '</div><div class="ns1blankspaceSubNote">' + oRow["reference"] + '</div></td>');

					aHTML.push('<td id="ns1blankspacePayrollSuperannuationExpense_amount-' + oRow["id"] + '" class="ns1blankspaceRow" style="text-align:right;">' +
									oRow["outstandingamount"] + '</td>'); 

					aHTML.push('<td id="ns1blankspacePayrollSuperannuationExpense_paymentduedate-' + oRow["id"] + '" class="ns1blankspaceRow ns1blankspaceSub" style="text-align:right;">' +
									ns1blankspace.util.fd(oRow["accrueddate"]) + '</td>');

					aHTML.push('<td style="text-align:right;" class="ns1blankspaceRow">');

					aHTML.push('<span style="margin-right:5px;" id="ns1blankspacePayrollSuperannuationExpense_option_preview-' + oRow['id'] + '"' +
									' class="ns1blankspaceRowPreview"></span>');

					aHTML.push('<span id="ns1blankspacePayrollSuperannuationExpense_option-' + oRow['id'] + '-1"' +
									' class="ns1blankspaceRowView"></span></td>');
					aHTML.push('</tr>');

					return aHTML.join('');
				},

	bind: 	function ()
				{
					$('#ns1blankspacePayrollSuperannuationExpense .ns1blankspaceRowView').button(
					{
						text: false,
						icons:
						{
							primary: "ui-icon-play"
						}
					})
					.click(function()
					{
						ns1blankspace.financial.expense.init({id: (this.id).split('-')[1]});
					})
					.css('width', '15px')
					.css('height', '20px');

					$('.ns1blankspacePayrollSuperannuationExpenseSelectAll').button(
					{
						text: false,
						icons:
						{
							primary: "ui-icon-check"
						}
					})
					.click(function()
					{	
						$('#ns1blankspacePayrollSuperannuationExpense input').each(function () {$(this).prop('checked', !($(this).prop('checked')))});
						ns1blankspace.financial.payroll.superannuation.refresh();
					})
					.css('width', '14px');

					$('#ns1blankspacePayrollSuperannuationExpense input:checked').click(function()
					{	
						ns1blankspace.financial.payroll.superannuation.refresh();
					})

					ns1blankspace.financial.payroll.superannuation.refresh();			
				},

	urls:		function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{
						var oSearch = new AdvancedSearch();
						oSearch.method = 'CORE_URL_SEARCH';		
						oSearch.addField('title,url,urllogon');
						oSearch.addFilter('title', 'TEXT_IS_LIKE', 'Superannuation');
						oSearch.sort('private', 'desc');
						oSearch.getResults(function(data) {ns1blankspace.financial.payroll.superannuation.urls(oParam, data)});
					}
					else
					{
						ns1blankspace.financial.payroll.data.urls = oResponse.data.rows
						ns1blankspace.util.onComplete(oParam);
					}
				},

	providers:	
				function (oParam, oResponse)
				{
					if (oResponse == undefined)
					{
						var oSearch = new AdvancedSearch();
						oSearch.method = 'FINANCIAL_PAYROLL_EMPLOYEE_SEARCH';
						oSearch.addField('supercontactbusiness');
						oSearch.addFilter('supercontactbusiness', 'IS_NOT_NULL');
						oSearch.rows = 1000;
						oSearch.getResults(function(data) {ns1blankspace.financial.payroll.superannuation.providers(oParam, data)});
					}
					else
					{
						ns1blankspace.financial.payroll.superannuation.data.providers = oResponse.data.rows;
						ns1blankspace.util.onComplete(oParam);
					}
				}			
}
