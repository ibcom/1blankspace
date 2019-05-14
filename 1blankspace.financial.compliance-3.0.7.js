/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 */

ns1blankspace.financial.compliance =
{
	data:
	{},

	init: function (oParam, oResponse)
	{
		//$('#ns1blankspaceComplianceCreatePDF').button('destroy');

		var sStartDate = ns1blankspace.util.getParam(oParam, 'startDate').value;
		var sEndDate = ns1blankspace.util.getParam(oParam, 'endDate').value;
		var bNoZero = ns1blankspace.util.getParam(oParam, 'noZero', {"default": false}).value;
		var bRefresh = ns1blankspace.util.getParam(oParam, 'refresh', {"default": false}).value;

		if (oParam == undefined)
		{
			oParam = {}
		}

		if (sStartDate == undefined)
		{
			if (ns1blankspace.financial.data.defaults.startdate != undefined)
			{
				sStartDate = ns1blankspace.financial.data.defaults.startdate;
			}
			else
			{
				if (moment().month() < 6)
				{
					sStartDate = moment().subtract('year', 2).month('July').startOf('month').format('DD MMM YYYY');
				}
				else
				{
					sStartDate = moment().subtract('year', 1).month('July').startOf('month').format('DD MMM YYYY');
				}	
			}
		}

		ns1blankspace.financial.data.defaults.startdate = sStartDate;

		if (sEndDate == undefined)
		{
			if (ns1blankspace.financial.data.defaults.enddate != undefined)
			{
				sEndDate = ns1blankspace.financial.data.defaults.enddate;
			}
			else
			{
				if (moment().month() < 6)
				{
					sEndDate = moment().subtract('year', 1).month('June').endOf('month').format('DD MMM YYYY');
				}
				else
				{
					sEndDate = moment().subtract('year', 0).month('June').endOf('month').format('DD MMM YYYY');
				}	
				
			}
		}

		ns1blankspace.financial.data.defaults.enddate = sEndDate;

		var aHTML = [];

		aHTML.push('<table class="ns1blankspaceMain" style="width:100%;">' +
				'<tr>' +
				'<td id="ns1blankspaceComplianceColumn1" class="ns1blankspaceColumn1Divider" style="width:100px; font-size: 0.875em; padding-right:10px;"></td>' +
				'<td id="ns1blankspaceComplianceColumn2" style="font-size: 0.925em; padding-left:10px;">' + ns1blankspace.xhtml.loading + '</td>' +
				'</tr>' +
				'</table>');	

		$('#ns1blankspaceMainCompliance').html(aHTML.join(''));

		var aHTML = [];
		
		aHTML.push('<table>');
		
		aHTML.push('<tr>' +
						'<tr><td class="ns1blankspaceDate">' +
						'<input id="ns1blankspaceComplianceStartDate" class="ns1blankspaceDate" data-1blankspace="ignore">' +
						'</td></tr>');
			
		aHTML.push('<tr>' +
						'<td class="ns1blankspaceCaption" style="padding-top:0px;">' +
						'To' +
						'</td></tr>' +
						'<tr><td class="ns1blankspaceDate">' +
						'<input id="ns1blankspaceComplianceEndDate" class="ns1blankspaceDate" data-1blankspace="ignore">' +
						'</td></tr>');
										
		aHTML.push('<tr><td style="padding-top:5px;">' +
						'<span class="ns1blankspaceAction" style="width:95px;" id="ns1blankspaceComplianceRefresh">Refresh</span>' +
						'</td></tr>');

		if (bNoZero)
		{	
			aHTML.push('<tr><td style="padding-top:10px;">' +
						'<span class="ns1blankspaceSubNote" style="width:95px;">Accounts with zero values are not shown.</span>' +
						'</td></tr>');
		}

		aHTML.push('<tr><td style="padding-top:14px;"><span class="ns1blankspaceAction" id="ns1blankspaceComplianceCreatePDF"  style="width:95px;">' +
						'</span></td></tr>');	
		
		aHTML.push('</table>');					
		
		$('#ns1blankspaceComplianceColumn1').html(aHTML.join(''));

		ns1blankspace.util.initDatePicker({select: 'input.ns1blankspaceDate'});

		if (sStartDate != undefined)
		{
			oParam.startDate = sStartDate;
			$('#ns1blankspaceComplianceStartDate').val(sStartDate);
		}
			
		if (sEndDate != undefined)
		{
			oParam.endDate = sEndDate;
			$('#ns1blankspaceComplianceEndDate').val(sEndDate);
		}

		$('#ns1blankspaceComplianceRefresh').button(
		{
			label: 'Refresh'
		})
		.click(function()
		{
			ns1blankspace.financial.compliance.init(
			{
				startDate: $('#ns1blankspaceComplianceStartDate').val(),
				endDate: $('#ns1blankspaceComplianceEndDate').val(),
				refresh: true
			});
		});

		var aHTML = [];
		
		//Bank accounts

		if (!bRefresh)
		{
			aHTML.push('<div class="ns1blankspaceSubNote">' +
							'Please select the dates and then click Refresh.</div>');

			$('#ns1blankspaceComplianceColumn2').html(aHTML.join(''));
		}
		else
		{
			aHTML.push('<div id="ns1blankspaceFinancialCompliancePDF">');

			aHTML.push('<div style="background-color:#f5f5f5; margin-bottom:16px; padding:12px;">');

				aHTML.push('<div style="color:#666666; font-weight:100; margin-bottom:2px; font-size:1.5em;">BANK ACCOUNTS</div>');
				aHTML.push('<div style="color:#666666; font-weight:100; margin-left:1px; margin-bottom:6px; font-size:0.75em;">Do the financal accounts (general ledger) totals match the totals at bank?</div>');
		
				aHTML.push('<div style="font-size: 0.875em;">');

				aHTML.push('<table>');

				aHTML.push('<tr><td class="ns1blankspaceHeaderCaption" style="vertical-align:bottom;">Name</td>' +
								'<td class="ns1blankspaceHeaderCaption" style="width:80px; text-align:right; vertical-align:bottom;">' + sStartDate + '</td>' +
								'<td class="ns1blankspaceHeaderCaption" style="width:80px; text-align:right; vertical-align:bottom;">' + sEndDate + '</td>' +
								'<td class="ns1blankspaceHeaderCaption" style="width:80px; text-align:right; vertical-align:bottom;">Change</td>' +
								'<td class="ns1blankspaceHeaderCaption" style="text-align:center; vertical-align:bottom;">Reconciled</td>' +
								'<td class="ns1blankspaceHeaderCaption" style="text-align:right; vertical-align:bottom;">Transactions</td>')

				ns1blankspace.financial.data.bankaccounts.sort(ns1blankspace.util.sortBy('title'));

				$.each(ns1blankspace.financial.data.bankaccounts, function(b, bankAccount)
				{
					bankAccount.financialaccounttext = $.grep(ns1blankspace.financial.data.accounts, function (a) {return a.id == bankAccount.financialaccount})[0].title;
				});

				$.each($.grep(_.uniqBy(ns1blankspace.financial.data.bankaccounts, 'financialaccount'), function (b) {return b.status == 1}), function(b, bankAccount)
				{					
					aHTML.push('<tr><td class="ns1blankspaceRow" style="vertical-align:middle;" id="ns1blankspaceComplianceBankAccount-' +
											bankAccount.id + '"><div>' + bankAccount.title + '</div>' +
												'<div class="ns1blankspaceSubNote" id="ns1blankspaceComplianceBankAccount-' + bankAccount.id + '_financialaccount">' +
												bankAccount.financialaccounttext + '</div>' +
											'</td>' +
											'<td class="ns1blankspaceRow" id="ns1blankspaceComplianceBankAccount-' +
											bankAccount.id + '_start" style="width:80px; text-align:right; vertical-align:middle;">-</td>' +
											'<td class="ns1blankspaceRow" id="ns1blankspaceComplianceBankAccount-' +
											bankAccount.id + '_end" style="width:80px; text-align:right; vertical-align:middle;">-</td>' +
											'<td class="ns1blankspaceRow" id="ns1blankspaceComplianceBankAccount-' +
											bankAccount.id + '_difference" style="width:80px; text-align:right; color:#666666; vertical-align:middle;">-</td>' +
											'<td class="ns1blankspaceRow ns1blankspaceSubNote" id="ns1blankspaceComplianceBankAccount-' +
											bankAccount.id + '_lastreconciled" style="text-align:center;">' + (bankAccount.lastreconcileddate==''?'':bankAccount.lastreconcileddate) + '</td>' +
											'<td class="ns1blankspaceRow ns1blankspaceSubNote" style="width:110px; text-align:right;" id="ns1blankspaceComplianceBankAccount-' + bankAccount.id + '_transactions"></td>' +
											'</tr>');		
				});
			
				aHTML.push('</table>');
				aHTML.push('</div>');
			aHTML.push('</div>');

			//Debtors

			aHTML.push('<div style="background-color:#f5f5f5; margin-bottom:16px; padding:12px;">');
				aHTML.push('<div style="color:#666666; font-weight:100; margin-bottom:2px; font-size:1.5em;">DEBTORS</div>');
				aHTML.push('<div style="color:#666666; font-weight:100; margin-left:1px; margin-bottom:6px; font-size:0.75em;">Who owes you?</div>');
				aHTML.push('<div id="ns1blankspaceComplianceDebtorsShow" style="font-size: 0.875em;">' +
									ns1blankspace.xhtml.loadingSmall +
									'</div>');
			aHTML.push('</div>');

			//Creditors	

			aHTML.push('<div style="background-color:#f5f5f5; margin-bottom:16px; padding:12px;">');
				aHTML.push('<div style="color:#666666; font-weight:100; margin-bottom:2px; font-size:1.5em;">CREDITORS</div>');
				aHTML.push('<div style="color:#666666; font-weight:100; margin-left:1px; margin-bottom:6px; font-size:0.75em;">Who do you owe?</div>');
				aHTML.push('<div id="ns1blankspaceComplianceCreditorsShow" style="font-size: 0.875em;">' +
									ns1blankspace.xhtml.loadingSmall +
									'</div>');
			aHTML.push('</div>');

			//Profit / Loss

			aHTML.push('<div style="background-color:#f5f5f5; margin-bottom:16px; padding:12px;">');
				aHTML.push('<div style="color:#666666; font-weight:100; margin-bottom:2px; font-size:1.5em;">PROFIT & LOSS</div>');
				aHTML.push('<div style="color:#666666; font-weight:100; margin-left:1px; margin-bottom:6px; font-size:0.75em;">What went on? (financial activity)</div>');
				aHTML.push('<div id="ns1blankspaceComplianceProfitLossShow" style="font-size: 0.875em;">' +
									ns1blankspace.xhtml.loadingSmall +
									'</div>');
			aHTML.push('</div>');

			//Balance Sheet

			aHTML.push('<div style="background-color:#f5f5f5; margin-bottom:16px; padding:12px;">');
				aHTML.push('<div style="color:#666666; font-weight:100; margin-bottom:2px; font-size:1.5em;">BALANCE SHEET</div>');
				aHTML.push('<div style="color:#666666; font-weight:100; margin-left:1px; margin-bottom:6px; font-size:0.75em;">What is the financial state?</div>');
				aHTML.push('<div id="ns1blankspaceComplianceBalanceSheetShow" style="font-size: 0.875em;">' +
									ns1blankspace.xhtml.loadingSmall +
									'</div>');
			aHTML.push('</div>');
		
			//Tax	

			aHTML.push('<div style="background-color:#f5f5f5; margin-bottom:16px; padding:12px;">');
				aHTML.push('<div style="color:#666666; font-weight:100; margin-bottom:2px; font-size:1.5em;">TAX</div>');
				aHTML.push('<div style="color:#666666; font-weight:100; margin-left:1px; margin-bottom:6px; font-size:0.75em;">Has the correct amount of tax been paid as per <a href="https://www.business.gov.au/info/run/tax" target="_blank">the law</a>?</div>');

				aHTML.push('<div id="ns1blankspaceComplianceTaxShow" style="font-size: 0.875em;">' +
									ns1blankspace.xhtml.loadingSmall +
									'</div>');

			aHTML.push('</div>');	


			//Payroll & Super

			aHTML.push('<div style="background-color:#f5f5f5; margin-bottom:16px; padding:12px;">');
				aHTML.push('<div style="color:#666666; font-weight:100; margin-bottom:2px; font-size:1.5em;">SUPERANNUATION</div>');
				aHTML.push('<div style="color:#666666; font-weight:100; margin-left:1px; margin-bottom:6px; font-size:0.75em;">Has the correct amount of superannuation been paid as per <a href="https://www.ato.gov.au/business/super-for-employers/" target="_blank">the law</a>?</div>');
				aHTML.push('<div id="ns1blankspaceComplianceSuperannuationShow" style="font-size: 0.875em;">' +
									ns1blankspace.xhtml.loadingSmall +
									'</div>');
			aHTML.push('</div>');

			aHTML.push('</div>');

			//NOT PDF

			//Search

			aHTML.push('<div style="background-color:#f5f5f5; margin-bottom:16px; padding:12px;">');
				aHTML.push('<div style="color:#666666; font-weight:100; margin-bottom:6px; font-size:1.5em;">SEARCH FOR</div>');
				//aHTML.push('<div style="color:#666666; font-weight:100; margin-left:1px; margin-bottom:6px; font-size:0.75em;">Search for financial transactions and export.</div>');
			
				aHTML.push('<div style="margin-left:0px; margin-right:0px; margin-bottom:8px;" id="ns1blankspaceComplianceSearchObjects">' +										
								'<input style="width: 100%;" type="radio" id="ns1blankspaceComplianceSearchObject-transactions" name="radioObject" checked="checked" />' +
								'<label for="ns1blankspaceComplianceSearchObject-transactions" style="margin-bottom:1px;">' +
												'GL</label>' +

								'<input style="width: 100%;" type="radio" id="ns1blankspaceComplianceSearchObject-receipts" name="radioObject"/>' +
								'<label for="ns1blankspaceComplianceSearchObject-receipts" style="margin-bottom:1px;">' +
												'Receipts</label>' +

								'<input style="width: 100%;" type="radio" id="ns1blankspaceComplianceSearchObject-payments" name="radioObject"/>' +
								'<label for="ns1blankspaceComplianceSearchObject-payments" style="margin-bottom:1px;">' +
												'Payments</label>' +

								'<input style="width: 100%;" type="radio" id="ns1blankspaceComplianceSearchObject-invoices" name="radioObject"/>' +
								'<label for="ns1blankspaceComplianceSearchObject-invoices" style="margin-bottom:1px;">' +
												'Invoices</label>' +			

								'<input style="width: 100%;" type="radio" id="ns1blankspaceComplianceSearchObject-expenses" name="radioObject"/>' +
								'<label for="ns1blankspaceComplianceSearchObject-expenses" style="margin-bottom:1px;">' +
												'Expenses</label>' +
								
								'<input style="width: 100%;" type="radio" id="ns1blankspaceComplianceSearchObject-credits" name="radioObject"/>' +
								'<label for="ns1blankspaceComplianceSearchObject-credits" style="margin-bottom:1px;">' +
												'Credits</label>' +

								'<input style="width: 100%;" type="radio" id="ns1blankspaceComplianceSearchObject-journals" name="radioObject"/>' +
								'<label for="ns1blankspaceComplianceSearchObject-journals" style="margin-bottom:1px;">' +
												'Journals</label>' +

								'<input style="width: 100%;" type="radio" id="ns1blankspaceComplianceSearchObject-bank_transactions" name="radioObject"/>' +
								'<label for="ns1blankspaceComplianceSearchObject-bank_transactions" style="margin-bottom:1px;">' +
												'Bank Transactions</label>' +

								'</div>')

				aHTML.push('<div id="ns1blankspaceComplianceSearchContainer">' + ns1blankspace.xhtml.loadingSmall + ' </div>');

			aHTML.push('</div>');	

			$('#ns1blankspaceComplianceColumn2').html(aHTML.join(''));

			$('#ns1blankspaceComplianceSearchObjects').buttonset().css('font-size', '0.625em');
			
			$('#ns1blankspaceComplianceSearchObjects :radio').click(function()
			{
				var sObject = (this.id).split('-')[1];

				ns1blankspace.financial.compliance[sObject].show(
				{
					xhtmlElementID: 'ns1blankspaceComplianceSearchContainer'
				});
			});

			ns1blankspace.financial.compliance.initData.balanceSheet(oParam);
		}
	},

	initData:
	{
		balanceSheet: function (oParam, oResponse)
		{
			var sStartDate = ns1blankspace.util.getParam(oParam, 'startDate').value;
			var sEndDate = ns1blankspace.util.getParam(oParam, 'endDate').value;

			if (oResponse == undefined)
			{
				ns1blankspace.status.working('Getting Balance Sheet');

				var oData = 
				{
					rows: 500
				}

				if (sStartDate != undefined)
				{
					oData.endDate0 = moment(sStartDate, ns1blankspace.option.dateFormats).add(-1, 'days').format('DD MMM YYYY');
				}
					
				if (sEndDate != undefined)
				{
					oData.endDate1 = sEndDate;
				}
					
				$.ajax(
				{
					type: 'GET',
					url: ns1blankspace.util.endpointURI('FINANCIAL_BALANCE_SHEET_SEARCH'),
					data: oData,
					dataType: 'json',
					success: function(data) {ns1blankspace.financial.compliance.initData.balanceSheet(oParam, data)}
				});
			}
			else
			{
				ns1blankspace.financial.compliance.data.balanceSheet = oResponse;
				ns1blankspace.financial.compliance.initData.profitLoss(oParam);
			}	
		},

		profitLoss: function (oParam, oResponse)
		{
			var sStartDate = ns1blankspace.util.getParam(oParam, 'startDate').value;
			var sEndDate = ns1blankspace.util.getParam(oParam, 'endDate').value;

			if (oResponse == undefined)
			{
				ns1blankspace.status.working('Getting Profit & Loss');

				var oData = 
				{
					rows: 500
				}

				if (sStartDate != undefined)
				{
					oData.startdate = sStartDate;
				}
					
				if (sEndDate != undefined)
				{
					oData.enddate = sEndDate;
				}
					
				$.ajax(
				{
					type: 'GET',
					url: ns1blankspace.util.endpointURI('FINANCIAL_PROFIT_LOSS_SEARCH'),
					data: oData,
					dataType: 'json',
					success: function(data) {ns1blankspace.financial.compliance.initData.profitLoss(oParam, data)}
				});
			}
			else
			{
				ns1blankspace.financial.compliance.data.profitLoss = oResponse;

				$.each(ns1blankspace.financial.compliance.data.profitLoss.data.rows, function (r, row)
				{
					row._financialAccount = $.grep(ns1blankspace.financial.data.accounts, function (a) {return a.id == row.financialaccount})[0];
					row.taxtype = row._financialAccount.taxtype;
					row.payroll = (row._financialAccount.expensepayroll == 'Y');
				});

				ns1blankspace.financial.compliance.initData.bankAccounts(oParam);
			}	

		},

		bankAccounts: function (oParam)
		{
			var iStep = ns1blankspace.util.getParam(oParam, 'step', {"default": 1}).value;
			var sStartDate = ns1blankspace.util.getParam(oParam, 'startDate').value;
			var sEndDate = ns1blankspace.util.getParam(oParam, 'endDate').value;

			if (iStep == 1)
			{
				ns1blankspace.status.working('Getting Bank Transactions');

					var oSearch = new AdvancedSearch();
					oSearch.method = 'FINANCIAL_BANK_ACCOUNT_TRANSACTION_SEARCH';
					oSearch.addField('bankaccount,bankaccounttext,count(id) bankaccounttotal');
					oSearch.addSummaryField('count(id) total');
					oSearch.addFilter('status', 'EQUAL_TO', 1);
					oSearch.addFilter('bankaccount', 'IS_NOT_NULL');
					if (sStartDate != '') {oSearch.addFilter('posteddate', 'GREATER_THAN_OR_EQUAL_TO', sStartDate)};
					if (sEndDate != '') {oSearch.addFilter('posteddate', 'LESS_THAN_OR_EQUAL_TO', sEndDate)};
					oSearch.rows = 100;
					oSearch.getResults(function(oResponse)
					{
						ns1blankspace.financial.compliance.data.bankAccounts = {unconfirmed: oResponse};
						oParam.step = 2;
						ns1blankspace.financial.compliance.initData.bankAccounts(oParam);
					})
			}

			if (iStep == 2)
			{
				ns1blankspace.status.working('Getting Bank Transactions');

				var oSearch = new AdvancedSearch();
				oSearch.method = 'FINANCIAL_BANK_ACCOUNT_TRANSACTION_SEARCH';
				oSearch.addField('bankaccount,type,sum(amount) totalamount');
				oSearch.addFilter('status', 'EQUAL_TO', 2);
				oSearch.addFilter('bankaccount', 'IS_NOT_NULL');
				if (sStartDate != '') {oSearch.addFilter('posteddate', 'GREATER_THAN_OR_EQUAL_TO', sStartDate)};
				if (sEndDate != '') {oSearch.addFilter('posteddate', 'LESS_THAN_OR_EQUAL_TO', sEndDate)};
				oSearch.rows = 100;
				oSearch.getResults(function(oResponse)
				{
					ns1blankspace.financial.compliance.data.bankAccounts.summary = oResponse;
					oParam.step = 3;
					ns1blankspace.financial.compliance.initData.bankAccounts(oParam);
				});
			}


			if (iStep == 3)
			{
					var oSearch = new AdvancedSearch();
					oSearch.method = 'FINANCIAL_BANK_ACCOUNT_TRANSACTION_SEARCH';
					oSearch.addField('bankaccount,bankaccounttext,count(id) bankaccounttotal');
					oSearch.addSummaryField('count(id) total');
					oSearch.addFilter('status', 'EQUAL_TO', 3);
					oSearch.addFilter('bankaccount', 'IS_NOT_NULL');
					if (sStartDate != '') {oSearch.addFilter('posteddate', 'GREATER_THAN_OR_EQUAL_TO', sStartDate)};
					if (sEndDate != '') {oSearch.addFilter('posteddate', 'LESS_THAN_OR_EQUAL_TO', sEndDate)};
					oSearch.rows = 100;
					oSearch.getResults(function(oResponse)
					{
						ns1blankspace.financial.compliance.data.bankAccounts.unreconciled = oResponse;

						$.each(ns1blankspace.financial.data.bankaccounts, function(ba, bankAccount)
						{
							delete bankAccount.unconfirmed;

							var oUnconfirmed = $.grep(ns1blankspace.financial.compliance.data.bankAccounts.unconfirmed.data.rows, function (row)
							{	
								return row.bankaccount == bankAccount.id
							})[0];

							if (oUnconfirmed != undefined)
							{
								bankAccount.unconfirmed = oUnconfirmed.bankaccounttotal;
							}

							delete bankAccount.unreconciled;

							var oUnreconciled = $.grep(ns1blankspace.financial.compliance.data.bankAccounts.unreconciled.data.rows, function (row)
							{	
								return row.bankaccount == bankAccount.id
							})[0];

							if (oUnreconciled != undefined)
							{
								bankAccount.unreconciled = oUnreconciled.bankaccounttotal;
							}

							bankAccount.summaryCredits = 0;

							var oSummaryCredits = $.grep(ns1blankspace.financial.compliance.data.bankAccounts.summary.data.rows, function (row)
							{	
								return row.bankaccount == bankAccount.id && row.type == 1
							})[0];

							if (oSummaryCredits != undefined)
							{
								bankAccount.summaryCredits = Math.abs(numeral(oSummaryCredits.totalamount).value());
							}

							bankAccount.summaryDebits = 0;

							var oSummaryDebits = $.grep(ns1blankspace.financial.compliance.data.bankAccounts.summary.data.rows, function (row)
							{	
								return row.bankaccount == bankAccount.id && row.type == 2
							})[0];

							if (oSummaryDebits != undefined)
							{
								bankAccount.summaryDebits = Math.abs(numeral(oSummaryDebits.totalamount).value());
							}
						});

						ns1blankspace.financial.compliance.initData.transactions(oParam);
					})
			}
		},		

		transactions: function (oParam, oResponse)
		{
			var sStartDate = ns1blankspace.util.getParam(oParam, 'startDate').value;
			var sEndDate = ns1blankspace.util.getParam(oParam, 'endDate').value;
			var iProject = ns1blankspace.util.getParam(oParam, 'project').value;
			
			if (oResponse == undefined)
			{			
				ns1blankspace.status.working('Getting Financial Accounts');

				var aFinancialAccounts =
				[
					ns1blankspace.financial.data.settings.taxreportfinancialaccountemployee,
					ns1blankspace.financial.data.settings.taxreportfinancialaccountinstalment,
					ns1blankspace.financial.data.settings.taxreportfinancialaccountcredits,
					ns1blankspace.financial.data.settings.taxreportfinancialaccountpayable,
					ns1blankspace.financial.data.settings.payrollfinancialaccountallowance,
					ns1blankspace.financial.data.settings.payrollfinancialaccountsalary,
					ns1blankspace.financial.data.settings.payrollfinancialaccountsuperannuation,
					ns1blankspace.financial.data.settings.financialaccountdebtor,
					ns1blankspace.financial.data.settings.financialaccountcreditor
				]

				aFinancialAccounts = _.filter(aFinancialAccounts, function (fa) {return fa != ''});

				var oSearch = new AdvancedSearch();
				oSearch.method = 'FINANCIAL_TRANSACTION_SEARCH';
				oSearch.rows = 100;

				oSearch.addField('financialaccount,financialaccounttext,sum(amount) total');						
				oSearch.addFilter('financialaccount', 'IN_LIST', aFinancialAccounts.join(','));

				oSearch.addFilter('amount', 'NOT_EQUAL_TO', 0)

				if (sStartDate != '') {oSearch.addFilter('date', 'GREATER_THAN_OR_EQUAL_TO', sStartDate)};
				if (sEndDate != '') {oSearch.addFilter('date', 'LESS_THAN_OR_EQUAL_TO', sEndDate)};

				if (iProject != undefined)
				{
					oSearch.addFilter('project', 'EQUAL_TO', iProject);
				}

				oSearch.sort('financialaccounttext', 'asc');
				oSearch.getResults(function(data) {ns1blankspace.financial.compliance.initData.transactions(oParam, data)});
			}
			else
			{	
				ns1blankspace.financial.compliance.data.transactions = oResponse;

				$.each(ns1blankspace.financial.compliance.data.transactions.data.rows, function (r, row)
				{
					row._financialAccount = $.grep(ns1blankspace.financial.data.accounts, function (a) {return a.id == row.financialaccount})[0];
					row.taxtype = row._financialAccount.taxtype;
				});

				ns1blankspace.financial.compliance.initData.receipts(oParam);
			}
		},

		receipts: function (oParam, oResponse)
		{
			var sStartDate = ns1blankspace.util.getParam(oParam, 'startDate').value;
			var sEndDate = ns1blankspace.util.getParam(oParam, 'endDate').value;
			var iProject = ns1blankspace.util.getParam(oParam, 'project').value;
			
			if (oResponse == undefined)
			{		
				ns1blankspace.status.working('Getting Receipts');

				var oSearch = new AdvancedSearch();
				oSearch.method = 'FINANCIAL_RECEIPT_SEARCH';
				oSearch.rows = 100;

				oSearch.addField('bankaccount,sum(amount) total,sum(tax) taxtotal');

				if (sStartDate != '') {oSearch.addFilter('receiveddate', 'GREATER_THAN_OR_EQUAL_TO', sStartDate)};
				if (sEndDate != '') {oSearch.addFilter('receiveddate', 'LESS_THAN_OR_EQUAL_TO', sEndDate)};

				if (iProject != undefined)
				{
					oSearch.addFilter('project', 'EQUAL_TO', iProject);
				}

				oSearch.addSummaryField('sum(tax) taxtotal')
				oSearch.getResults(function(data) {ns1blankspace.financial.compliance.initData.receipts(oParam, data)});
			}
			else
			{	
				ns1blankspace.financial.compliance.data.receipts = oResponse;
				ns1blankspace.financial.compliance.initData.payments(oParam);
			}
		},

		payments: function (oParam, oResponse)
		{
			var sStartDate = ns1blankspace.util.getParam(oParam, 'startDate').value;
			var sEndDate = ns1blankspace.util.getParam(oParam, 'endDate').value;
			var iProject = ns1blankspace.util.getParam(oParam, 'project').value;
			
			if (oResponse == undefined)
			{			
				ns1blankspace.status.working('Getting Payments');

				var oSearch = new AdvancedSearch();
				oSearch.method = 'FINANCIAL_PAYMENT_SEARCH';
				oSearch.rows = 100;

				oSearch.addField('bankaccount,sum(amount) total,sum(tax) taxtotal');

				if (sStartDate != '') {oSearch.addFilter('paiddate', 'GREATER_THAN_OR_EQUAL_TO', sStartDate)};
				if (sEndDate != '') {oSearch.addFilter('paiddate', 'LESS_THAN_OR_EQUAL_TO', sEndDate)};

				if (iProject != undefined)
				{
					oSearch.addFilter('project', 'EQUAL_TO', iProject);
				}

				oSearch.addSummaryField('sum(tax) taxtotal')
				oSearch.getResults(function(data) {ns1blankspace.financial.compliance.initData.payments(oParam, data)});
			}
			else
			{	
				ns1blankspace.financial.compliance.data.payments = oResponse;
				ns1blankspace.financial.compliance.initData.credits(oParam);
			}
		},

		credits: function (oParam, oResponse)
		{
			var sStartDate = ns1blankspace.util.getParam(oParam, 'startDate').value;
			var sEndDate = ns1blankspace.util.getParam(oParam, 'endDate').value;
			var iProject = ns1blankspace.util.getParam(oParam, 'project').value;
			
			if (oResponse == undefined)
			{			
				ns1blankspace.status.working('Getting Credits');

				var oSearch = new AdvancedSearch();
				oSearch.method = 'FINANCIAL_CREDIT_NOTE_SEARCH';
				oSearch.rows = 100;

				oSearch.addField('type,sum(amount) total,sum(tax) taxtotal');

				if (sStartDate != '') {oSearch.addFilter('creditdate', 'GREATER_THAN_OR_EQUAL_TO', sStartDate)};
				if (sEndDate != '') {oSearch.addFilter('creditdate', 'LESS_THAN_OR_EQUAL_TO', sEndDate)};

				if (iProject != undefined)
				{
					oSearch.addFilter('project', 'EQUAL_TO', iProject);
				}

				oSearch.addSummaryField('sum(tax) taxtotal')
				oSearch.getResults(function(data) {ns1blankspace.financial.compliance.initData.credits(oParam, data)});
			}
			else
			{	
				ns1blankspace.financial.compliance.data.credits = oResponse;
				ns1blankspace.financial.compliance.initData.payroll(oParam);
			}
		},

		payroll: function (oParam, oResponse)
		{
			var sStartDate = ns1blankspace.util.getParam(oParam, 'startDate').value;
			var sEndDate = ns1blankspace.util.getParam(oParam, 'endDate').value;
			var iProject = ns1blankspace.util.getParam(oParam, 'project').value;

			if (oResponse == undefined)
			{	
				ns1blankspace.status.working('Getting Payroll');

				var oSearch = new AdvancedSearch();
				oSearch.method = 'FINANCIAL_PAYROLL_PAY_RECORD_SEARCH';
				oSearch.addField('payrecord.employee.contactperson,payrecord.employee.contactpersontext,payrecord.employee.employeenumber,' +
									'sum(grosssalary) grosssalary,sum(netsalary) netsalary,sum(deductions) deductions,sum(superannuation) superannuation,sum(taxbeforerebate) taxbeforerebate');
				oSearch.addSummaryField('sum(grosssalary) grosssalary');
				oSearch.addSummaryField('sum(netsalary) netsalary');
				oSearch.addSummaryField('sum(superannuation) superannuation');
				oSearch.addSummaryField('sum(taxbeforerebate) taxbeforerebate');
				oSearch.addSummaryField('sum(deductions) deductions');
				oSearch.addFilter('payrecord.payperiod.status', 'EQUAL_TO', 2)

				if (sStartDate != '') {oSearch.addFilter('payrecord.payperiod.paydate', 'GREATER_THAN_OR_EQUAL_TO', sStartDate)};
				if (sEndDate != '') {oSearch.addFilter('payrecord.payperiod.paydate', 'LESS_THAN_OR_EQUAL_TO', sEndDate)};

				oSearch.rows = 200;
				oSearch.getResults(function(data) {ns1blankspace.financial.compliance.initData.payroll(oParam, data)});	
			}
			else
			{
				ns1blankspace.financial.compliance.data.payroll = oResponse;
				ns1blankspace.financial.compliance.initData.debtors(oParam);
			}	
		},	

		debtors: function (oParam, oResponse)
		{
			var sEndDate = ns1blankspace.util.getParam(oParam, 'endDate').value;
			var iProject = ns1blankspace.util.getParam(oParam, 'project').value;
			
			if (oResponse == undefined)
			{			
				ns1blankspace.status.working('Getting Debtors');

				var oData = {rows: 1000, view: 1, enddate: sEndDate, reportby: 3}

				$.ajax(
				{
					type: 'POST',
					url: ns1blankspace.util.endpointURI('FINANCIAL_DEBTOR_SEARCH'),
					data: oData,
					dataType: 'json',
					global: false,
					success: function(oResponse)
					{
						if (oResponse.status == 'OK')
						{	
							ns1blankspace.financial.compliance.initData.debtors(oParam, oResponse);
						}
						else
						{
							if (oResponse.error.errorcode == '4')
							{	
								if (oResponse.error.errornotes.indexOf('FINANCIAL_DEBTORSCREDITORS_PROCESSING_MANAGE') != -1)
								{	
									ns1blankspace.status.working('Optimising debtors');
									oParam = ns1blankspace.util.setParam(oParam, 'onComplete', ns1blankspace.financial.compliance.initData.debtors)
									ns1blankspace.financial.optimise.start(oParam);
								}
							}
						}
					}
				});

				/*var oSearch = new AdvancedSearch();
				oSearch.method = 'FINANCIAL_DEBTOR_SEARCH';
				oSearch.rows = 100;

				if (sEndDate != '') {oSearch.addFilter('enddate', 'LESS_THAN_OR_EQUAL_TO', sEndDate)};

				oSearch.getResults(function(data) {ns1blankspace.financial.compliance.initData.debtors(oParam, data)});*/
			}
			else
			{	
				ns1blankspace.financial.compliance.data.debtors = {end: oResponse};

				$.each(ns1blankspace.financial.compliance.data.debtors.end.data.rows, function (r, row)
				{
					row._financialAccount = $.grep(ns1blankspace.financial.data.accounts, function (a) {return a.id == row.financialaccount})[0];
				});

				ns1blankspace.financial.compliance.initData.creditors(oParam);
			}
		},		

		creditors: function (oParam, oResponse)
		{
			var sEndDate = ns1blankspace.util.getParam(oParam, 'endDate').value;
			var iProject = ns1blankspace.util.getParam(oParam, 'project').value;
			
			if (oResponse == undefined)
			{			
				ns1blankspace.status.working('Getting Creditors');

				var oData = {rows: 1000, view: 1, enddate: sEndDate, reportby: 3}

				$.ajax(
				{
					type: 'POST',
					url: ns1blankspace.util.endpointURI('FINANCIAL_CREDITOR_SEARCH'),
					data: oData,
					dataType: 'json',
					global: false,
					success: function(oResponse)
					{
						if (oResponse.status == 'OK')
						{	
							ns1blankspace.financial.compliance.initData.creditors(oParam, oResponse);
						}
						else
						{
							if (oResponse.error.errorcode == '4')
							{	
								if (oResponse.error.errornotes.indexOf('FINANCIAL_DEBTORSCREDITORS_PROCESSING_MANAGE') != -1)
								{	
									ns1blankspace.status.working('Optimising creditors');
									oParam = ns1blankspace.util.setParam(oParam, 'onComplete', ns1blankspace.financial.compliance.initData.creditors)
									ns1blankspace.financial.optimise.start(oParam);
								}
							}
						}
					}
				});
			}
			else
			{	
				ns1blankspace.financial.compliance.data.creditors = {end: oResponse};

				$.each(ns1blankspace.financial.compliance.data.creditors.end.data.rows, function (r, row)
				{
					row._financialAccount = $.grep(ns1blankspace.financial.data.accounts, function (a) {return a.id == row.financialaccount})[0];
				});

				ns1blankspace.financial.compliance.initData.done(oParam);
			}
		},																						

		done: function (oParam)
		{
			ns1blankspace.status.working('Finalising');
			ns1blankspace.financial.compliance.show.bankAccounts(oParam);
			ns1blankspace.financial.compliance.profitLoss.show(oParam);
			ns1blankspace.financial.compliance.debtors.show(oParam);
			ns1blankspace.financial.compliance.creditors.show(oParam);
			ns1blankspace.financial.compliance.balanceSheet.show(oParam);
			ns1blankspace.financial.compliance.tax.show(oParam);
			ns1blankspace.financial.compliance.superannuation.show(oParam);
			//ns1blankspace.financial.compliance.transactions.show(oParam);
			//ns1blankspace.financial.compliance.payments.show(oParam);
			ns1blankspace.financial.compliance.transactions.show(
			{
				xhtmlElementID: 'ns1blankspaceComplianceSearchContainer'
			});

			$('#ns1blankspaceComplianceCreatePDF').button(
			{
				label: 'Create PDF'
			})
			.click(function(event)
			{
				var sHTML =  $('#ns1blankspaceFinancialCompliancePDF').html();

				var sURL = document.location.protocol + '//' + document.location.host;
				var aHeaderHTML =
				[
					'<div style="margin-bottom:20px;">',
					'<div style="font-size:2em;">' + ns1blankspace.user.contactBusinessText + '</div>',
					'<div style="font-size:1.6em;">COMPLIANCE</div>',
				];

				aHeaderHTML.push('<div>');

				if ($('#ns1blankspaceComplianceStartDate').val() != '')
				{
					aHeaderHTML.push($('#ns1blankspaceComplianceStartDate').val());
				}

				if ($('#ns1blankspaceComplianceEndDate').val() != '')
				{
					aHeaderHTML.push(' to ' + $('#ns1blankspaceComplianceEndDate').val());
				}

				aHeaderHTML.push('</div>');

				aHeaderHTML.push('</div><hr>');

				ns1blankspace.pdf.create(
				{
					xhtmlContent: aHeaderHTML.join('') + sHTML,
					filename: 'compliance.pdf',
					open: true,
					leftmargin: 45,
					topmargin: 20,
					headerheight: 15,
					footerheight: 15,
					baseURLBody: sURL,
					object: 12,
					objectContext: ns1blankspace.spaceContactBusiness
				});
			});

			ns1blankspace.status.clear();
		}
	},

	show: 
	{
		bankAccounts: function (oParam, oResponse)
		{
			
			$.each($.grep(ns1blankspace.financial.data.bankaccounts, function (b) {return b.status == 1}), function(b, bankAccount)
			{
				bankAccount.compliance = $.grep(ns1blankspace.financial.compliance.data.balanceSheet.data.rows, function (a) {return a.financialaccount == bankAccount.financialaccount})[0];

				if (bankAccount.compliance != undefined)
				{
					$('#ns1blankspaceComplianceBankAccount-' + bankAccount.id + '_start').html(bankAccount.compliance.amount0);
					$('#ns1blankspaceComplianceBankAccount-' + bankAccount.id + '_end').html(bankAccount.compliance.amount1);

					var sDifference = numeral(numeral(bankAccount.compliance.amount1).value() - numeral(bankAccount.compliance.amount0).value()).format('0,0.00');

					$('#ns1blankspaceComplianceBankAccount-' + bankAccount.id + '_difference').html(sDifference);

					var aHTML = [];

					aHTML.push('<div>' + numeral(bankAccount.summaryCredits).format('$0,0.00') + '</div>');
					aHTML.push('<div> <i>minus</i> ' + numeral(bankAccount.summaryDebits).format('$0,0.00') + '</div>');
					
					aHTML.push('<div> <i>equals</i> ' + numeral(numeral(bankAccount.summaryCredits).value() - numeral(bankAccount.summaryDebits).value()).format('$0,0.00') + '</div>');

					if (bankAccount.unconfirmed != undefined)
					{
						aHTML.push('<div>' + bankAccount.unconfirmed + ' unconfirmed</div>');
					}

					if (bankAccount.unreconciled != undefined)
					{
						aHTML.push('<div>' + bankAccount.unreconciled + ' unreconciled</div>');
					}	

					$('#ns1blankspaceComplianceBankAccount-' + bankAccount.id + '_transactions').html(aHTML.join(''));
				}	
			});
		}
	},

	export: 
	{
		transactions: function (oParam, oResponse)
		{
			var sXHTMLContext = ns1blankspace.util.getParam(oParam, 'xhtmlContext', {'default': 'ns1blankspaceComplianceTransactionsShow'}).value;

			var oFormat =
			[{
				options:
				{
					delimiter: ",",
					surroundWith: '"'
				},

				header:
				[
					{
						line: 1,
						fields:
						[
							{value: 'Date'},
							{value: 'Financial Account'},
							{value: 'Description'},
							{value: 'Amount'},
							{value: 'Reference'},
							{value: 'Relates To'}
						]
					}	
				],

				item:
				[
					{
						fields:
						[
							{field: 'date'},
							{field: 'financialaccounttext'},
							{field: 'description'},
							{field: 'amount'},
							{field: 'reference'},
							{field: 'objecttext'}
						]
					}		
				]
			}]

			var sFileName = $('#' + sXHTMLContext).attr('data-filename');

			ns1blankspace.setup.file.export.data.get(
		   {
				xhtmlContext: sXHTMLContext,
				format: oFormat,
				saveToFile: true,
				open: true,
				fileName: sFileName
			});
		},

		bank_transactions: function (oParam, oResponse)
		{
			var sXHTMLContext = ns1blankspace.util.getParam(oParam, 'xhtmlContext', {'default': 'ns1blankspaceComplianceBankTransactionsShow'}).value;

			var oFormat =
			[{
				options:
				{
					delimiter: ",",
					surroundWith: '"'
				},

				header:
				[
					{
						line: 1,
						fields:
						[
							{value: 'Date'},
							{value: 'Description'},
							{value: 'Type'},
							{value: 'Amount'},
							{value: 'Status'}
						]
					}	
				],

				item:
				[
					{
						fields:
						[
							{field: 'posteddate'},
							{field: 'notes'},
							{field: 'typetext'},
							{field: 'amount'},		
							{field: 'statustext'}
						]
					}		
				]
			}]

			var sFileName = $('#' + sXHTMLContext).attr('data-filename');

			ns1blankspace.setup.file.export.data.get(
		   {
				xhtmlContext: sXHTMLContext,
				format: oFormat,
				saveToFile: true,
				open: true,
				fileName: sFileName
			});
		},

		items: function (oParam, oResponse)
		{
			var sXHTMLContext = ns1blankspace.util.getParam(oParam, 'xhtmlContext', {'default': 'ns1blankspaceCompliancePaymentsShow'}).value;
			var sDateAttribute = ns1blankspace.util.getParam(oParam, 'dateAttribute', {'default': 'paiddate'}).value;
			var sSuffix = ns1blankspace.util.getParam(oParam, 'suffix', {'default': 'paidto'}).value;
			var bIncludeBankTransaction = ns1blankspace.util.getParam(oParam, 'includeBankTransaction', {'default': false}).value;
			var sBankTransactionAmountAttibute = ns1blankspace.util.getParam(oParam, 'bankTransactionAmountAttibute', {'default': 'payment_sourcebanktransaction_amount'}).value;

			var oFormat =
			[{
				options:
				{
					delimiter: ",",
					surroundWith: '"'
				},

				header:
				[
					{
						line: 1,
						fields:
						[
							{value: 'Reference'},
							{value: 'Date'},
							{value: 'Description'},
							{value: 'Amount'},
							{value: 'Tax'},
							{value: 'Contact (Business)'},
							{value: 'Contact (Person)'}
						]
					}	
				],

				item:
				[
					{
						fields:
						[
							{field: 'reference'},
							{field: sDateAttribute},
							{field: 'description'},
							{field: 'amount'},
							{field: 'tax'},
							{field: 'contactbusiness' + sSuffix + 'text'},
							{field: 'contactperson' + sSuffix + 'text'}
						]
					}		
				]
			}]

			if (bIncludeBankTransaction)
			{
				oFormat[0].header[0].fields.push({value: 'Bank Transaction'});
				oFormat[0].item[0].fields.push({field: 'sourcebanktransactiontext'});

				//oFormat[0].header[0].fields.push({value: 'Bank Transaction Amount'});
				//oFormat[0].item[0].fields.push({field: sBankTransactionAmountAttibute});
			}

			var sFileName = $('#' + sXHTMLContext).attr('data-filename');

			ns1blankspace.setup.file.export.data.get(
		   {
				xhtmlContext: sXHTMLContext,
				format: oFormat,
				saveToFile: true,
				open: true,
				fileName: sFileName
			});
		},

		credits: function (oParam, oResponse)
		{
			var sXHTMLContext = ns1blankspace.util.getParam(oParam, 'xhtmlContext', {'default': 'ns1blankspaceComplianceCreditsShow'}).value;

			var oFormat =
			[{
				options:
				{
					delimiter: ",",
					surroundWith: '"'
				},

				header:
				[
					{
						line: 1,
						fields:
						[
							{value: 'Reference'},
							{value: 'Type'},
							{value: 'Date'},
							{value: 'Financial Account'},
							{value: 'Notes'},
							{value: 'Contact (Business)'},
							{value: 'Contact (Person)'},
							{value: 'Amount'},
							{value: 'Tax'}
						]
					}	
				],

				item:
				[
					{
						fields:
						[
							{field: 'reference'},
							{field: 'typetext'},
							{field: 'creditdate'},
							{field: 'financialaccounttext'},
							{field: 'notes'},
							{field: 'contactbusinesstext'},
							{field: 'contactpersontext'},
							{field: 'amount'},
							{field: 'tax'}
						]
					}		
				]
			}]

			var sFileName = $('#' + sXHTMLContext).attr('data-filename');

			ns1blankspace.setup.file.export.data.get(
		   {
				xhtmlContext: sXHTMLContext,
				format: oFormat,
				saveToFile: true,
				open: true,
				fileName: sFileName
			});
		},

		journals: function (oParam, oResponse)
		{
			var sXHTMLContext = ns1blankspace.util.getParam(oParam, 'xhtmlContext', {'default': 'ns1blankspaceComplianceJournalsShow'}).value;

			var oFormat =
			[{
				options:
				{
					delimiter: ",",
					surroundWith: '"'
				},

				header:
				[
					{
						line: 1,
						fields:
						[
							{value: 'Reference'},
							{value: 'Date'},
							{value: 'Description'},
							{value: 'Financial Account'},
							{value: 'Credit Amount'},
							{value: 'Credit Tax Amount'},
							{value: 'Debit Amount'},
							{value: 'Debit Tax Amount'}
						]
					}	
				],

				item:
				[
					{
						fields:
						[
							{field: 'generaljournalitem_generaljournal_reference'},
							{field: 'generaljournalitem_generaljournal_journaldate'},
							{field: 'generaljournalitem_generaljournal_description'},
							{field: 'financialaccounttext'},
							{field: 'creditamount'},
							{field: 'credittax'},
							{field: 'debitamount'},
							{field: 'debittax'}
						]
					}		
				]
			}]

			var sFileName = $('#' + sXHTMLContext).attr('data-filename');

			ns1blankspace.setup.file.export.data.get(
		   {
				xhtmlContext: sXHTMLContext,
				format: oFormat,
				saveToFile: true,
				open: true,
				fileName: sFileName
			});
		}
	},

	_util:
	{
		formatTransaction: function (oRow)
		{
			var aText = _.split(oRow.description, ' - ')

			_.each(aText, function (sText, t)
			{
				if (t == _.size(aText)-1)
				{
					aText[t] = '<div class="ns1blankspaceRowSelect" data-object="' + oRow.object + '" data-objectcontext="' + oRow.objectcontext + '">' + sText + '</div>';
				}
				else
				{
					aText[t] = '<div>' + sText + '</div>'
				}
			})

			return _.join(aText, '')
		}
	}
}

ns1blankspace.financial.compliance.profitLoss =
{
	show: 	function (oParam, oResponse)
	{
		var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {"default": 'ns1blankspaceComplianceProfitLossShow'}).value;
		var aHTML = [];

		if (ns1blankspace.financial.compliance.data.profitLoss == undefined)
		{							
			aHTML.push('<table><tbody>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceNothing">No profit or loss.</td>' +
							'</tr>' +
							'</tbody></table>');

			$('#' + sXHTMLElementID).html(aHTML.join(''));
		}
		else
		{
			var profitLoss = ns1blankspace.financial.compliance.data.profitLoss;
			var aHTML = [];

			profitLoss.totalemployeeexpenses = 0;

			var aEmployeeAccountsPL = $.grep(profitLoss.data.rows, function (row)
			{
				var bInclude = (row.financialaccount == ns1blankspace.financial.data.settings.payrollfinancialaccountallowance ||
									row.financialaccount == ns1blankspace.financial.data.settings.payrollfinancialaccountsalary ||
									row.financialaccount == ns1blankspace.financial.data.settings.payrollfinancialaccountsuperannuation ||
									row.financialaccount == ns1blankspace.financial.data.settings.payrollfinancialaccounttax)

				return bInclude
			});

			if (_.size(aEmployeeAccountsPL) != 0)
			{
				profitLoss.totalemployeeexpenses = numeral(_.sumBy(aEmployeeAccountsPL, function (pl) {return numeral(pl.total).value()}));
			}

			aHTML.push('<table>');

			aHTML.push('<tr><td class="ns1blankspaceRow">Sales</td>' +
									'<td class="ns1blankspaceRow" style="text-align:right;">' + numeral(profitLoss.totalsales).format('0,0.00') + '</td></tr>');

			aHTML.push('<tr><td class="ns1blankspaceRow">Cost of Sales</td>' +
									'<td class="ns1blankspaceRow" style="text-align:right;">' + numeral(profitLoss.totalcostofsales).format('0,0.00') + '</td></tr>');

			aHTML.push('<tr><td class="ns1blankspaceRow">Gross Margin</td>' +
									'<td class="ns1blankspaceRow" style="text-align:right;">' + numeral(profitLoss.grossmargin).format('0,0.00') + '</td></tr>');

			aHTML.push('<tr><td class="ns1blankspaceRow">Expenses</td>' +
									'<td class="ns1blankspaceRow" style="text-align:right;">' +
											numeral(numeral(profitLoss.totaloperationalexpenses).value() - numeral(profitLoss.totalemployeeexpenses).value()).format('0,0.00') + '</td></tr>');
		
			aHTML.push('<tr><td class="ns1blankspaceRow">Employee Expenses</td>' +
									'<td class="ns1blankspaceRow" style="text-align:right;">' + numeral(profitLoss.totalemployeeexpenses).format('0,0.00') + '</td></tr>');

			aHTML.push('<tr><td class="ns1blankspaceRow">Margin</td>' +
									'<td class="ns1blankspaceRow" style="text-align:right;">' + numeral(profitLoss.operatingmargin).format('0,0.00') + '</td></tr>');

			aHTML.push('</table>');

			$('#' + sXHTMLElementID).html(aHTML.join(''));
			
			ns1blankspace.financial.compliance.profitLoss.bind();
		}	
	},

	bind: 	function()
	{

	}
}	

ns1blankspace.financial.compliance.debtors =
{
	show: function (oParam, oResponse)
	{
		var sStartDate = ns1blankspace.util.getParam(oParam, 'startDate').value;
		var sEndDate = ns1blankspace.util.getParam(oParam, 'endDate').value;
		var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {"default": 'ns1blankspaceComplianceDebtorsShow'}).value;
		var aHTML = [];

		if (ns1blankspace.financial.compliance.data.debtors.end.length == 0)
		{							
			aHTML.push('<table><tbody>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceNothing">No debtors.</td>' +
							'</tr>' +
							'</tbody></table>');

			$('#' + sXHTMLElementID).html(aHTML.join(''));

		}
		else
		{
			aHTML.push('<table class="ns1blankspace">' +
								'<tr><td class="ns1blankspaceHeaderCaption" style="padding:6px; text-align:center; font-size:1.2em;">' + sStartDate + '</td>' +
								'<td></td>' +
								'<td class="ns1blankspaceHeaderCaption" style="padding:6px; text-align:center; font-size:1.2em;">' + sEndDate + '</td>' +
								'<td></td>' +
								'<td class="ns1blankspaceHeaderCaption" style="padding:6px; text-align:center; font-size:1.2em;">Change</td></tr>' +
								'<tr><td id="ns1blankspaceComplianceDebtorsShowStart" style="padding:6px; width:30%;">-</td>' +
								'<td></td>' +
								'<td id="ns1blankspaceComplianceDebtorsShowEnd" style="padding:6px; width:30%;">-</td>' +
								'<td></td>' +
								'<td id="ns1blankspaceComplianceDebtorsShowDifference" style="padding:6px; width:30%;">-</td></tr>' +
								'</table>');

			$('#' + sXHTMLElementID).html(aHTML.join(''));

			var oDebtorsBS = $.grep(ns1blankspace.financial.compliance.data.balanceSheet.data.rows, function (row)
			{
				return row.financialaccount == ns1blankspace.financial.data.settings.financialaccountdebtor;
			})[0];

			var aHTML = [];

			if (oDebtorsBS == undefined)
			{
				oDebtorsBS = {amount1: 0, amount0: 0}
			}

			aHTML.push('<table>');
			
			aHTML.push('<tr><td class="ns1blankspaceRow">Total' +
								'<div class="ns1blankspaceSubNote">' +
									ns1blankspace.financial.data.settings.financialaccountdebtortext + '</div></td>' +
								'<td class="ns1blankspaceRow" style="text-align:right;">' + numeral(oDebtorsBS.amount0).format('0,0.00') + '</td></tr>');

			aHTML.push('</table>');

			$('#ns1blankspaceComplianceDebtorsShowStart').html(aHTML.join(''));

			var aHTML = [];

			aHTML.push('<table>');
			
			aHTML.push('<tr><td class="ns1blankspaceRow">Total' +
								'<div class="ns1blankspaceSubNote">' +
									ns1blankspace.financial.data.settings.financialaccountdebtortext + '</div></td>' +
								'<td class="ns1blankspaceRow" style="text-align:right;">' + numeral(oDebtorsBS.amount1).format('0,0.00') + '</td></tr>');


			if (ns1blankspace.financial.compliance.data.debtors.end.data.totals == undefined)
			{
				ns1blankspace.financial.compliance.data.debtors.end.data.totals = 0
			}

			aHTML.push('<tr><td class="ns1blankspaceRow ns1blankspaceSub">Accounts Receivable</td>' +
								'<td class="ns1blankspaceRow ns1blankspaceSub" style="text-align:right;">' + numeral(ns1blankspace.financial.compliance.data.debtors.end.data.totals.total).format('0,0.00') + '</td></tr>');
	
			if (numeral(oDebtorsBS.amount1).value() != numeral(ns1blankspace.financial.compliance.data.debtors.end.data.totals.total).value())
			{
				aHTML.push('<tr><td class="ns1blankspaceRow ns1blankspaceSub" style="color:red;">Out of balance</td>' +
								'<td class="ns1blankspaceRow ns1blankspaceSub" style="text-align:right; color:red;">' +
								numeral(numeral(oDebtorsBS.amount1).value() -
								numeral(ns1blankspace.financial.compliance.data.debtors.end.data.totals.total).value()).format('0,0.00') + '</td></tr>');

			}

			aHTML.push('</table>');

			$('#ns1blankspaceComplianceDebtorsShowEnd').html(aHTML.join(''));

			var aHTML = [];

			aHTML.push('<table>');
			
			aHTML.push('<tr><td class="ns1blankspaceRow">Total' +
								'<div class="ns1blankspaceSubNote">' +
									ns1blankspace.financial.data.settings.financialaccountdebtortext + '</div></td>' +
								'<td class="ns1blankspaceRow" style="text-align:right;">' + 
									numeral(numeral(oDebtorsBS.amount1).value() - numeral(oDebtorsBS.amount0).value()).format('0,0.00') + '</td></tr>');

			aHTML.push('</table>');

			$('#ns1blankspaceComplianceDebtorsShowDifference').html(aHTML.join(''));
		}	
	}
}

ns1blankspace.financial.compliance.creditors =
{
	show: function (oParam, oResponse)
	{
		var sStartDate = ns1blankspace.util.getParam(oParam, 'startDate').value;
		var sEndDate = ns1blankspace.util.getParam(oParam, 'endDate').value;
		var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {"default": 'ns1blankspaceComplianceCreditorsShow'}).value;
		var aHTML = [];

		if (ns1blankspace.financial.compliance.data.creditors.end.length == 0)
		{							
			aHTML.push('<table><tbody>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceNothing">No creditors.</td>' +
							'</tr>' +
							'</tbody></table>');

			$('#' + sXHTMLElementID).html(aHTML.join(''));
		}
		else
		{
			aHTML.push('<table class="ns1blankspace">' +
								'<tr><td class="ns1blankspaceHeaderCaption" style="padding:6px; text-align:center; font-size:1.2em;">' + sStartDate + '</td>' +
								'<td></td>' +
								'<td class="ns1blankspaceHeaderCaption" style="padding:6px; text-align:center; font-size:1.2em;">' + sEndDate + '</td>' +
								'<td></td>' +
								'<td class="ns1blankspaceHeaderCaption" style="padding:6px; text-align:center; font-size:1.2em;">Change</td></tr>' +
								'<tr><td id="ns1blankspaceComplianceCreditorsShowStart" style="padding:6px; width:30%;">-</td>' +
								'<td></td>' +
								'<td id="ns1blankspaceComplianceCreditorsShowEnd" style="padding:6px; width:30%;">-</td>' +
								'<td></td>' +
								'<td id="ns1blankspaceComplianceCreditorsShowDifference" style="padding:6px; width:30%;">-</td></tr>' +
								'</table>');

			$('#' + sXHTMLElementID).html(aHTML.join(''));

			var oCreditorsBS = $.grep(ns1blankspace.financial.compliance.data.balanceSheet.data.rows, function (row)
			{
				return row.financialaccount == ns1blankspace.financial.data.settings.financialaccountcreditor;
			})[0];

			if (oCreditorsBS == undefined)
			{
				oCreditorsBS = {amount0: 0, amount1: 0}
			}

			var aHTML = [];

			aHTML.push('<table>');
			
			aHTML.push('<tr><td class="ns1blankspaceRow">Total' +
								'<div class="ns1blankspaceSubNote">' +
									ns1blankspace.financial.data.settings.financialaccountcreditortext + '</div></td>' +
								'<td class="ns1blankspaceRow" style="text-align:right;">' + numeral(oCreditorsBS.amount0).format('0,0.00') + '</td></tr>');

			aHTML.push('</table>');

			$('#ns1blankspaceComplianceCreditorsShowStart').html(aHTML.join(''));

			var aHTML = [];

			aHTML.push('<table>');
			
			aHTML.push('<tr><td class="ns1blankspaceRow">Total' +
								'<div class="ns1blankspaceSubNote">' +
									ns1blankspace.financial.data.settings.financialaccountcreditortext + '</div></td>' +
								'<td class="ns1blankspaceRow" style="text-align:right;">' + numeral(oCreditorsBS.amount1).format('0,0.00') + '</td></tr>');

			if (ns1blankspace.financial.compliance.data.creditors.end.data.totals == undefined)
			{
				ns1blankspace.financial.compliance.data.creditors.end.data.totals = 0
			}

			aHTML.push('<tr><td class="ns1blankspaceRow ns1blankspaceSub">Accounts Payable</td>' +
								'<td class="ns1blankspaceRow ns1blankspaceSub" style="text-align:right;">' + numeral(ns1blankspace.financial.compliance.data.creditors.end.data.totals.total).format('0,0.00') + '</td></tr>');
			
			if (numeral(oCreditorsBS.amount1).value() != numeral(ns1blankspace.financial.compliance.data.creditors.end.data.totals.total).value())
			{
				aHTML.push('<tr><td class="ns1blankspaceRow ns1blankspaceSub" style="color:red;">Out of balance</td>' +
								'<td class="ns1blankspaceRow ns1blankspaceSub" style="text-align:right; color:red;">' +
								numeral(numeral(oCreditorsBS.amount1).value() -
								numeral(ns1blankspace.financial.compliance.data.creditors.end.data.totals.total).value()).format('0,0.00') + '</td></tr>');

			}

			aHTML.push('</table>');

			$('#ns1blankspaceComplianceCreditorsShowEnd').html(aHTML.join(''));

			var aHTML = [];

			aHTML.push('<table>');
			
			aHTML.push('<tr><td class="ns1blankspaceRow">Total' +
								'<div class="ns1blankspaceSubNote">' +
									ns1blankspace.financial.data.settings.financialaccountcreditortext + '</div></td>' +
								'<td class="ns1blankspaceRow" style="text-align:right;">' + 
									numeral(numeral(oCreditorsBS.amount1).value() - numeral(oCreditorsBS.amount0).value()).format('0,0.00') + '</td></tr>');

			aHTML.push('</table>');

			$('#ns1blankspaceComplianceCreditorsShowDifference').html(aHTML.join(''));
		}	
	}
}

ns1blankspace.financial.compliance.balanceSheet =
{
	show: function (oParam, oResponse)
	{
		var sStartDate = ns1blankspace.util.getParam(oParam, 'startDate').value;
		var sEndDate = ns1blankspace.util.getParam(oParam, 'endDate').value;
		var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {"default": 'ns1blankspaceComplianceBalanceSheetShow'}).value;
		var aHTML = [];

		if (ns1blankspace.financial.compliance.data.creditors.end.length == 0)
		{							
			aHTML.push('<table><tbody>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceNothing">No balance sheet.</td>' +
							'</tr>' +
							'</tbody></table>');

			$('#' + sXHTMLElementID).html(aHTML.join(''));
		}
		else
		{
			aHTML.push('<table class="ns1blankspace">' +
								'<tr><td class="ns1blankspaceHeaderCaption" style="padding:6px; text-align:center; font-size:1.2em;">' + sStartDate + '</td>' +
								'<td></td>' +
								'<td class="ns1blankspaceHeaderCaption" style="padding:6px; text-align:center; font-size:1.2em;">' + sEndDate + '</td>' +
								'<td></td>' +
								'<td class="ns1blankspaceHeaderCaption" style="padding:6px; text-align:center; font-size:1.2em;">Change</td></tr>' +
								'<tr><td id="ns1blankspaceComplianceBalanceSheetShowStart" style="padding:6px; width:30%;">-</td>' +
								'<td></td>' +
								'<td id="ns1blankspaceComplianceBalanceSheetShowEnd" style="padding:6px; width:30%;">-</td>' +
								'<td></td>' +
								'<td id="ns1blankspaceComplianceBalanceSheetShowDifference" style="padding:6px; width:30%;">-</td></tr>' +
								'</table>');

			$('#' + sXHTMLElementID).html(aHTML.join(''));

			var balanceSheet = ns1blankspace.financial.compliance.data.balanceSheet;

			var aHTML = [];

			aHTML.push('<table>');
			
			aHTML.push('<tr><td class="ns1blankspaceRow">Assets</td>' +
								'<td class="ns1blankspaceRow" style="text-align:right;">' + numeral(balanceSheet.assettotal0).format('0,0.00') + '</td></tr>');

			aHTML.push('<tr><td class="ns1blankspaceRow">Liabilities</td>' +
								'<td class="ns1blankspaceRow" style="text-align:right;">' + numeral(balanceSheet.liabilitytotal0).format('0,0.00') + '</td></tr>');

			aHTML.push('<tr><td class="ns1blankspaceRow">Equity</td>' +
								'<td class="ns1blankspaceRow" style="text-align:right;">' + numeral(balanceSheet.equitytotal0).format('0,0.00') + '</td></tr>');

			aHTML.push('</table>');

			$('#ns1blankspaceComplianceBalanceSheetShowStart').html(aHTML.join(''));

			var aHTML = [];

			aHTML.push('<table>');
			
			aHTML.push('<tr><td class="ns1blankspaceRow">Assets</td>' +
								'<td class="ns1blankspaceRow" style="text-align:right;">' + numeral(balanceSheet.assettotal1).format('0,0.00') + '</td></tr>');

			aHTML.push('<tr><td class="ns1blankspaceRow">Liabilities</td>' +
								'<td class="ns1blankspaceRow" style="text-align:right;">' + numeral(balanceSheet.liabilitytotal1).format('0,0.00') + '</td></tr>');

			aHTML.push('<tr><td class="ns1blankspaceRow">Equity</td>' +
								'<td class="ns1blankspaceRow" style="text-align:right;">' + numeral(balanceSheet.equitytotal1).format('0,0.00') + '</td></tr>');

			aHTML.push('</table>');

			$('#ns1blankspaceComplianceBalanceSheetShowEnd').html(aHTML.join(''));


				var aHTML = [];

			aHTML.push('<table>');
			
			aHTML.push('<tr><td class="ns1blankspaceRow">Assets</td>' +
								'<td class="ns1blankspaceRow" style="text-align:right;">' +
									numeral(numeral(balanceSheet.assettotal1).value() - numeral(balanceSheet.assettotal0).value()).format('0,0.00') + '</td></tr>');

			aHTML.push('<tr><td class="ns1blankspaceRow">Liabilities</td>' +
								'<td class="ns1blankspaceRow" style="text-align:right;">' + 
								numeral(numeral(balanceSheet.liabilitytotal1).value() - numeral(balanceSheet.liabilitytotal0).value()).format('0,0.00') + '</td></tr>');

			aHTML.push('<tr><td class="ns1blankspaceRow">Equity</td>' +
								'<td class="ns1blankspaceRow" style="text-align:right;">' +
								numeral(numeral(balanceSheet.equitytotal1).value() - numeral(balanceSheet.equitytotal0).value()).format('0,0.00') + '</td></tr>');

			aHTML.push('</table>');

			$('#ns1blankspaceComplianceBalanceSheetShowDifference').html(aHTML.join(''));
		}	
	}
}

ns1blankspace.financial.compliance.tax =
{
	show: 	function (oParam, oResponse)
	{
		var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {"default": 'ns1blankspaceComplianceTaxShow'}).value;
		var aHTML = [];

		if (ns1blankspace.financial.compliance.data.transactions.length == 0)
		{							
			aHTML.push('<table><tbody>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceNothing">No financial transactions.</td>' +
							'</tr>' +
							'</tbody></table>');

			$('#' + sXHTMLElementID).html(aHTML.join(''));
		}
		else
		{
			aHTML.push('<table class="ns1blankspace">' +
								'<tr><td class="ns1blankspaceHeaderCaption" style="padding:6px; text-align:center; font-size:1.2em;">' + ns1blankspace.option.taxVATCaption + '</td>' +
								'<td></td>' +
								'<td class="ns1blankspaceHeaderCaption" style="padding:6px; text-align:center; font-size:1.2em;">Employee</td></tr>' +
								'<tr><td id="ns1blankspaceComplianceTaxShowVAT" style="padding:6px; width:46%;">-</td>' +
								'<td></td>' +
								'<td id="ns1blankspaceComplianceTaxShowEmployee" style="padding:6px; width:46%;">-</td></tr>' +
								'</table>');

			$('#' + sXHTMLElementID).html(aHTML.join(''));

			//VAT (GST)

			var aHTML = [];

			aHTML.push('<table>');

			var cTaxTotalPayments = ns1blankspace.financial.compliance.data.payments.summary.taxtotal;
			var cTaxTotalReceipts = ns1blankspace.financial.compliance.data.receipts.summary.taxtotal;

			var cTaxTotalPaymentCredits = 0;

			//Type: 1=You owe Customer,2=Supplier owes You
			var oTaxTotalPaymentCredits = $.grep(ns1blankspace.financial.compliance.data.credits.data.rows, function (row)
			{
				return row.type == 1;
			})[0];

			if (oTaxTotalPaymentCredits != undefined)
			{
				cTaxTotalPaymentCredits = oTaxTotalPaymentCredits.taxtotal
			}

			var cTaxTotalReceiptCredits = 0;

			//Type: 1=You owe Customer,2=Supplier owes You
			var oTaxTotalReceiptCredits = $.grep(ns1blankspace.financial.compliance.data.credits.data.rows, function (row)
			{
				return row.type == 2;
			})[0];

			if (oTaxTotalReceiptCredits != undefined)
			{
				cTaxTotalReceiptCredits = oTaxTotalReceiptCredits.taxtotal
			}

			var cTaxTotalPayable = 0;

			var oTaxTotalPayable = $.grep(ns1blankspace.financial.compliance.data.transactions.data.rows, function (row)
			{
				return row.financialaccount == ns1blankspace.financial.data.settings.taxreportfinancialaccountpayable;
			})[0];

			if (oTaxTotalPayable != undefined)
			{
				cTaxTotalPayable = oTaxTotalPayable.total
			}

			var taxTotalCredits = 0;

			if (ns1blankspace.financial.data.settings.taxreportfinancialaccountcredits !=
						ns1blankspace.financial.data.settings.taxreportfinancialaccountpayable)
			{
				var taxTotalPayable = $.grep(ns1blankspace.financial.compliance.data.transactions.data.rows, function (row)
				{
					return row.financialaccount == ns1blankspace.financial.data.settings.taxreportfinancialaccountpayable;
				})[0].total;
			}	

			taxTotalPayable = numeral(taxTotalPayable).value() - numeral(taxTotalCredits).value();

			var profitLossTransactions = ns1blankspace.financial.compliance.data.profitLoss.data.rows;

			var aTaxSales = $.grep(profitLossTransactions, function (transaction)
			{
				return transaction.type == 1 && transaction.taxtype == 1
			});

			var aTaxExpenses = $.grep(profitLossTransactions, function (transaction)
			{
				return transaction.type == 3 && transaction.taxtype == 1
			});

			var taxSalesTotal = numeral(_.sumBy(aTaxSales, function (taxSale) {return numeral(taxSale.total).value()}));
			var taxExpensesTotal = numeral(_.sumBy(aTaxExpenses, function (taxExpense) {return numeral(taxExpense.total).value()}));

			aHTML.push('<tr><td class="ns1blankspaceRow"><div>Tax Collected</div>' +
							'<div class="ns1blankspaceSubNote">Receipts ' +
								'(' + numeral(cTaxTotalReceipts).format('0,0.00') + ') - Credit Notes (' + numeral(cTaxTotalReceiptCredits).format('0,0.00') + ')</div>' + 
									'</td>' +
									'<td class="ns1blankspaceRow" style="text-align:right;">' + 
										numeral(numeral(cTaxTotalReceipts).value() - numeral(cTaxTotalReceiptCredits).value()).format('0,0.00') + '</td></tr>');

			aHTML.push('<tr><td class="ns1blankspaceRow"><div>Tax Credits</div>' +
							'<div class="ns1blankspaceSubNote">Payments ' + 
									'(' + numeral(cTaxTotalPayments).format('0,0.00') + ') - Credit Notes (' + numeral(cTaxTotalPaymentCredits).format('0,0.00') + ')</div>' + 
									'</td>' +
									'<td class="ns1blankspaceRow" style="text-align:right;">' +
									numeral(numeral(cTaxTotalPayments).value() - numeral(cTaxTotalPaymentCredits).value()).format('0,0.00') + '</td></tr>');

			aHTML.push('<tr><td class="ns1blankspaceRow"><div>Tax Payable</div>' +
							'<div class="ns1blankspaceSubNote">Collected - Credits</div>' + 
									'</td>' +
									'<td class="ns1blankspaceRow" style="text-align:right;">' + 
											numeral(numeral(cTaxTotalReceipts).value() - numeral(cTaxTotalPayments).value()).format('0,0.00') + '</td></tr>');

/*			aHTML.push('<tr><td class="ns1blankspaceRow ns1blankspaceSub">Sales</td>' +
									'<td class="ns1blankspaceRow ns1blankspaceSub" style="text-align:right;">' + numeral(ns1blankspace.financial.compliance.data.profitLoss.totalsales).format('0,0.00') + '</td></tr>');

			aHTML.push('<tr><td class="ns1blankspaceRow ns1blankspaceSub">Expenses</td>' +
									'<td class="ns1blankspaceRow ns1blankspaceSub" style="text-align:right;">' + numeral(ns1blankspace.financial.compliance.data.profitLoss.totaloperationalexpenses).format('0,0.00') + '</td></tr>');


			aHTML.push('<tr><td class="ns1blankspaceRow"><div>Sales</div>' +
									'<div class="ns1blankspaceSubNote">Invoices that collected GST</div></td>' +
									'<td class="ns1blankspaceRow" style="text-align:right;">' + taxSalesTotal.format('0,0.00') + '</td></tr>');

			aHTML.push('<tr><td class="ns1blankspaceRow">Expenses (that included GST)</td>' +
									'<td class="ns1blankspaceRow" style="text-align:right;">' + taxExpensesTotal.format('0,0.00') + '</td></tr>');

			aHTML.push('<tr><td class="ns1blankspaceRow">Margin (that related to GST)</td>' +
									'<td class="ns1blankspaceRow" style="text-align:right;">' + numeral(taxSalesTotal.value() - taxExpensesTotal.value()).format('0,0.00') + '</td></tr>');
		
*/

			aHTML.push('</table>');

			$('#ns1blankspaceComplianceTaxShowVAT').html(aHTML.join(''));

			//Employees

			var aHTML = [];

			aHTML.push('<table>');

			var sPayrollTotalWages = ns1blankspace.financial.compliance.data.payroll.summary.grosssalary;
			var sPayrollTotalTax = ns1blankspace.financial.compliance.data.payroll.summary.taxbeforerebate;

			var oTaxTotalPayable = $.grep(ns1blankspace.financial.compliance.data.transactions.data.rows, function (row)
			{
				return row.financialaccount == ns1blankspace.financial.data.settings.taxreportfinancialaccountemployee;
			})[0]

			var sTaxTotalPayable = 0;

			if (oTaxTotalPayable != undefined)
			{
				sTaxTotalPayable.total;
			}
			
			var profitLossTransactions = ns1blankspace.financial.compliance.data.profitLoss.data.rows;

			var aTaxExpenses = $.grep(profitLossTransactions, function (transaction)
			{
				return transaction.type == 3 && transaction.payroll
			});

			var taxExpensesTotal = numeral(_.sumBy(aTaxExpenses, function (taxExpense) {return numeral(taxExpense.total).value()}));

			aHTML.push('<tr><td class="ns1blankspaceRow"><div>Wages</div>' +
							'<div class="ns1blankspaceSubNote">Payroll</div>' + 
								'</td>' +
								'<td class="ns1blankspaceRow" style="text-align:right;">' + numeral(sPayrollTotalWages).format('0,0.00') + '</td></tr>');

			aHTML.push('<tr><td class="ns1blankspaceRow"><div>Tax Payable</div>' +
							'<div class="ns1blankspaceSubNote">Payroll</div>' + 
								'</td>' +
								'<td class="ns1blankspaceRow" style="text-align:right;">' + numeral(sPayrollTotalTax).format('0,0.00') + '</td></tr>');

/*			aHTML.push('<tr><td class="ns1blankspaceRow"><div>Tax Payable</div>' +
							'<div class="ns1blankspaceSubNote">' + ns1blankspace.financial.data.settings.taxreportfinancialaccountemployeetext + ' financial account</div>' + 
								'</td>' +
								'<td class="ns1blankspaceRow" style="text-align:right;">' + numeral(sTaxTotalPayable).format('0,0.00') + '</td></tr>');

			aHTML.push('<tr><td class="ns1blankspaceRow">Expenses (that related to payroll)</td>' +
									'<td class="ns1blankspaceRow" style="text-align:right;">' + taxExpensesTotal.format('0,0.00') + '</td></tr>');*/
		
			aHTML.push('</table>');

			$('#ns1blankspaceComplianceTaxShowEmployee').html(aHTML.join(''));
			
			ns1blankspace.financial.compliance.tax.bind();
		}	
	},

	bind: 	function()
	{

	}	
}

ns1blankspace.financial.compliance.superannuation =
{
	show: 	function (oParam, oResponse)
	{
		var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {"default": 'ns1blankspaceComplianceSuperannuationShow'}).value;
		var aHTML = [];

		if (ns1blankspace.financial.compliance.data.transactions.length == 0)
		{							
			aHTML.push('<table><tbody>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceNothing">No financial transactions.</td>' +
							'</tr>' +
							'</tbody></table>');

			$('#' + sXHTMLElementID).html(aHTML.join(''));
		}
		else
		{
			var aHTML = [];

			aHTML.push('<table>');

			var oSalaryTotal = $.grep(ns1blankspace.financial.compliance.data.transactions.data.rows, function (row)
			{
				return row.financialaccount == ns1blankspace.financial.data.settings.payrollfinancialaccountsalary;
			})[0];

			var sSalaryTotal = 0;

			if (oSalaryTotal != undefined)
			{
				sSalaryTotal = oSalaryTotal.total;
			}

			if (ns1blankspace.financial.data.settings.payrollfinancialaccountallowance != ns1blankspace.financial.data.settings.payrollfinancialaccountsalary)
			{	
				var oAllowanceTotal = $.grep(ns1blankspace.financial.compliance.data.transactions.data.rows, function (row)
				{
					return row.financialaccount == ns1blankspace.financial.data.settings.payrollfinancialaccountallowance;
				})[0]

				var sAllowanceTotal = 0;

				if (oAllowanceTotal != undefined)
				{
					sAllowanceTotal = oAllowanceTotal.total;
				}
			}	

			var oSuperannuationTotal = $.grep(ns1blankspace.financial.compliance.data.transactions.data.rows, function (row)
			{
				return row.financialaccount == ns1blankspace.financial.data.settings.payrollfinancialaccountsuperannuation;
			})[0];

			var sSuperannuationTotal = 0;

			if (oSuperannuationTotal != undefined)
			{
				sSuperannuationTotal = oSuperannuationTotal.total;
			}

			var sPayrollTotalSuperannuation = ns1blankspace.financial.compliance.data.payroll.summary.superannuation;
			var sPayrollTotalWages = ns1blankspace.financial.compliance.data.payroll.summary.grosssalary;

/*
			aHTML.push('<tr><td class="ns1blankspaceRow">Salary</td>' +
									'<td class="ns1blankspaceRow" style="text-align:right;">' + numeral(sSalaryTotal).format('0,0.00') + '</td></tr>');

			if (ns1blankspace.financial.data.settings.payrollfinancialaccountallowance != ns1blankspace.financial.data.settings.payrollfinancialaccountsalary)
			{
				aHTML.push('<tr><td class="ns1blankspaceRow">Allowances</td>' +
									'<td class="ns1blankspaceRow" style="text-align:right;">' + numeral(sAllowanceTotal).format('0,0.00') + '</td></tr>');
			}	

			aHTML.push('<tr><td class="ns1blankspaceRow">Superannuation</td>' +
									'<td class="ns1blankspaceRow" style="text-align:right;">' + numeral(sSuperannuationTotal).format('0,0.00') + '</td></tr>');
*/
			aHTML.push('<tr><td class="ns1blankspaceRow"><div>Wages</div>' +
							'<div class="ns1blankspaceSubNote">Payroll</div>' + 
								'</td>' +
								'<td class="ns1blankspaceRow" style="text-align:right;">' + numeral(sPayrollTotalWages).format('0,0.00') + '</td></tr>');

			aHTML.push('<tr><td class="ns1blankspaceRow"><div>Superannuation</div>' +
							'<div class="ns1blankspaceSubNote">Payroll</div>' + 
								'</td>' +
								'<td class="ns1blankspaceRow" style="text-align:right;">' + numeral(sPayrollTotalSuperannuation).format('0,0.00') + '</td></tr>');

			aHTML.push('<tr><td class="ns1blankspaceRow ns1blankspaceSub"><div>Total</div>' +
							'<div class="ns1blankspaceSubNote">Wages + Superannuation</div>' + 
								'</td>' +
								'<td class="ns1blankspaceRow ns1blankspaceSub" style="text-align:right;">' + 
									numeral(numeral(sPayrollTotalWages).value() + numeral(sPayrollTotalSuperannuation).value()).format('0,0.00') + '</td></tr>');
		
			aHTML.push('</table>');

			$('#' + sXHTMLElementID).html(aHTML.join(''));
			
			ns1blankspace.financial.compliance.superannuation.bind();
		}	
	},

	bind: 	function()
	{

	}
}	

ns1blankspace.financial.compliance.transactions =
{
	show: function (oParam, oResponse)
	{
		var sStartDate = ns1blankspace.util.getParam(oParam, 'startDate', {"default":ns1blankspace.financial.data.defaults.startdate}).value;
		var sEndDate = ns1blankspace.util.getParam(oParam, 'endDate', {"default":ns1blankspace.financial.data.defaults.enddate}).value;

		var iObject = ns1blankspace.object;
		var iObjectContext = ns1blankspace.objectContext;
		var iProject = ns1blankspace.util.getParam(oParam, 'project').value;
		var iFinancialAccount;
		var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {"default": 'ns1blankspaceComplianceSearchContainer'}).value;
		var iRows = ns1blankspace.util.getParam(oParam, 'rows', {"default": 8}).value;
		
		var sSearchText = $('#ns1blankspaceComplianceTransactionsSearch').val();

		if (oParam != undefined)
		{
			if (oParam.object != undefined) {iObject = oParam.object}
			if (oParam.objectContext != undefined) {iObjectContext = oParam.objectContext}
			if (oParam.financialAccount != undefined) {iFinancialAccount = oParam.financialAccount}
		}		
			
		if (oResponse == undefined)
		{		
			if (sSearchText == undefined)
			{
				var aHTML = [];

				aHTML.push('<div>' +
							'<input id="ns1blankspaceComplianceTransactionsSearch" class="ns1blankspaceText" data-1blankspace="ignore" style="width:50%;">' +
							'</div>');

				aHTML.push('<div id="ns1blankspaceComplianceTransactionsShow" style="font-size: 0.875em;"' +
							' data-filename="compliance-transactions-' + _.kebabCase(sStartDate) + '-to-' + _.kebabCase(sEndDate) + '.csv">' +
							ns1blankspace.xhtml.loadingSmall +
							'</div>');

				aHTML.push('<div style="margin-top:12px;">' +
							'<div class="ns1blankspaceAction" id="ns1blankspaceComplianceTransactionsExport" style="font-size:0.75em;">' +
									'</div>' +
							'</div>');

				aHTML.push('</div>');

				$('#' + sXHTMLElementID).html(aHTML.join(''));

				$('#ns1blankspaceComplianceTransactionsSearch').unbind('keyup').keyup(function(event)
				{
					if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
			        ns1blankspace.timer.delayCurrent = setTimeout('ns1blankspace.financial.compliance.transactions.show()', ns1blankspace.option.typingWait);
				});

				$('#ns1blankspaceComplianceTransactionsExport').button(
				{
					label: 'Export'
				})
				.click(function(event)
				{
					ns1blankspace.financial.compliance.export.transactions({xhtmlElementID: 'ns1blankspaceComplianceTransactionsShow'})
				});
			}	

			var oSearch = new AdvancedSearch();
			oSearch.method = 'FINANCIAL_TRANSACTION_SEARCH';
			oSearch.rows = iRows;

			oSearch.addField('financialaccounttext,amount,date,description,reference,object,objectcontext,objecttext');
			if (sSearchText != '')
			{
				oSearch.addBracket('(');
				oSearch.addFilter('financialaccounttext', 'TEXT_IS_LIKE', sSearchText);
				oSearch.addFilter('or')
				oSearch.addFilter('description', 'TEXT_IS_LIKE', sSearchText);

				var oSearchDate = moment(sSearchText, 'DD MMM YYYY HH:mm:ss')
				if (oSearchDate.isValid())
				{
					oSearch.addOperator('or');
					oSearch.addFilter('date', 'EQUAL_TO', oSearchDate.format('DD MMM YYYY'));
				}
				oSearch.addBracket(')')
			}

			oSearch.addSummaryField('count(id) count');
			oSearch.sort('date', 'asc');

			oSearch.addFilter('amount', 'NOT_EQUAL_TO', 0)

			if (sStartDate != '') {oSearch.addFilter('date', 'GREATER_THAN_OR_EQUAL_TO', sStartDate)};
			if (sEndDate != '') {oSearch.addFilter('date', 'LESS_THAN_OR_EQUAL_TO', sEndDate)};

			if (iProject != undefined)
			{
				oSearch.addFilter('project', 'EQUAL_TO', iProject);
			}

			oSearch.getResults(function(data) {ns1blankspace.financial.compliance.transactions.show(oParam, data)});
		}
		else
		{
			var aHTML = [];
			
			if (oResponse.data.rows.length == 0)
			{	
				aHTML.push('<table><tbody>' +
								'<tr class="ns1blankspace">' +
								'<td class="ns1blankspaceNothing">No financial transactions.</td>' +
								'</tr>' +
								'</tbody></table>');

				$('#ns1blankspaceComplianceTransactionsShow').html(aHTML.join(''));

			}
			else
			{
				sXHTMLElementID = 'ns1blankspaceComplianceTransactionsShow';

				aHTML.push('<table class="ns1blankspace">');

				aHTML.push('<tr class="ns1blankspaceHeaderCaption">');

				if (iFinancialAccount == undefined)
				{
					aHTML.push('<td class="ns1blankspaceHeaderCaption" style="width:150px;">Account</td>');
				}

				aHTML.push('<td class="ns1blankspaceHeaderCaption" style="width:75px;">Date</td>' +
								'<td class="ns1blankspaceHeaderCaption">Description</td>' +
								'<td class="ns1blankspaceHeaderCaption" style="width:100px; text-align:right;">Amount</td>' +
								'</tr>')

				$.each(oResponse.data.rows, function()
				{
					aHTML.push(ns1blankspace.financial.compliance.transactions.row(this));
				});
				
				aHTML.push('</table>');

				ns1blankspace.render.page.show(
				{
					xhtmlElementID: sXHTMLElementID,
					xhtmlContext: sXHTMLElementID,
					xhtml: aHTML.join(''),
					showMore: (oResponse.morerows == "true"),
					more: oResponse.moreid,
					rows: iRows,
					functionShowRow: ns1blankspace.financial.compliance.transactions.row,
					functionNewPage: 'ns1blankspace.financial.compliance.transactions.bind()',
					headerRow: true,
					summary: oResponse.summary
				}); 	
					
				ns1blankspace.financial.compliance.transactions.bind();
			}
		}	
	},

	row: function(oRow)
	{
		var aHTML = [];
		
		aHTML.push('<tr class="ns1blankspaceRow">');
			
		if (oRow.financialaccounttext)
		{							
			aHTML.push('<td id="ns1blankspaceFinancialTransaction_financialaccounttext-' + oRow.id + '" class="ns1blankspaceRow" style="color:#666666; width:65px;">' +
								oRow.financialaccounttext + '</td>');
		}	
								
		aHTML.push('<td id="ns1blankspaceFinancialTransaction_date-' + oRow.id + '" class="ns1blankspaceRow" style="color:#666666;">' +
								oRow.date + '</td>');
										
		aHTML.push('<td id="ns1blankspaceFinancialTransaction_description-' + oRow.id + '" class="ns1blankspaceRow" style="color:#666666;">' + 
						ns1blankspace.financial.compliance._util.formatTransaction(oRow) + '</td>');
							
		aHTML.push('<td id="ns1blankspaceFinancialTransaction_amount-' + oRow.id + '" style="text-align:right; color:#666666;" class="ns1blankspaceRow">' +
								oRow.amount + '</td>');
																				
		aHTML.push('</td></tr>');

		return aHTML.join('');
	},

	bind: 	function()
	{
		$('div[data-object]:visible').click(function (event)
		{
			var iObject = $(this).attr('data-object');
			var iObjectContext = $(this).attr('data-objectcontext');
			var sNamespace = _.toLower(_.find(ns1blankspace.financial.data.objects, function (object) {return object.id == iObject}).name);

			ns1blankspace.financial[sNamespace].init({id: iObjectContext});
		});	
	}	
}

ns1blankspace.financial.compliance.bank_transactions =
{
	show: function (oParam, oResponse)
	{
		var sStartDate = ns1blankspace.util.getParam(oParam, 'startDate', {"default":ns1blankspace.financial.data.defaults.startdate}).value;
		var sEndDate = ns1blankspace.util.getParam(oParam, 'endDate', {"default":ns1blankspace.financial.data.defaults.enddate}).value;

		var iProject = ns1blankspace.util.getParam(oParam, 'project').value;
		var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {"default": 'ns1blankspaceComplianceSearchContainer'}).value;
		var iRows = ns1blankspace.util.getParam(oParam, 'rows', {"default": 8}).value;
		
		var sSearchText = $('#ns1blankspaceComplianceBankTransactionsSearch').val();
			
		if (oResponse == undefined)
		{		
			if (sSearchText == undefined)
			{
				var aHTML = [];

				aHTML.push('<div>' +
							'<input id="ns1blankspaceComplianceBankTransactionsSearch" class="ns1blankspaceText" data-1blankspace="ignore" style="width:50%;">' +
							'</div>');

				aHTML.push('<div id="ns1blankspaceComplianceBankTransactionsShow" style="font-size: 0.875em;"' +
							' data-filename="compliance-bank-transactions-' + _.kebabCase(sStartDate) + '-to-' + _.kebabCase(sEndDate) + '.csv">' +
							ns1blankspace.xhtml.loadingSmall +
							'</div>');

				aHTML.push('<div style="margin-top:12px;">' +
							'<div class="ns1blankspaceAction" id="ns1blankspaceComplianceBankTransactionsExport" style="font-size:0.75em;">' +
									'</div>' +
							'</div>');

				aHTML.push('</div>');

				$('#' + sXHTMLElementID).html(aHTML.join(''));

				$('#ns1blankspaceComplianceBankTransactionsSearch').unbind('keyup').keyup(function(event)
				{
					if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
			        ns1blankspace.timer.delayCurrent = setTimeout('ns1blankspace.financial.compliance.bank_transactions.show()', ns1blankspace.option.typingWait);
				});

				$('#ns1blankspaceComplianceBankTransactionsExport').button(
				{
					label: 'Export'
				})
				.click(function(event)
				{
					ns1blankspace.financial.compliance.export.bank_transactions({xhtmlElementID: 'ns1blankspaceComplianceBankTransactionsShow'})
				});
			}	

			var oSearch = new AdvancedSearch();
			oSearch.method = 'FINANCIAL_BANK_ACCOUNT_TRANSACTION_SEARCH';
			oSearch.rows = iRows;

			oSearch.addField('typetext,amount,posteddate,bankaccounttext,notes,statustext');

			if (sSearchText != '')
			{
				oSearch.addBracket('(');
				oSearch.addFilter('statustext', 'TEXT_IS_LIKE', sSearchText);
				oSearch.addFilter('or')
				oSearch.addFilter('notes', 'TEXT_IS_LIKE', sSearchText);
				oSearch.addFilter('or')
				oSearch.addFilter('typetext', 'TEXT_IS_LIKE', sSearchText);

				var oSearchDate = moment(sSearchText, 'DD MMM YYYY HH:mm:ss')
				if (oSearchDate.isValid())
				{
					oSearch.addOperator('or');
					oSearch.addFilter('posteddate', 'EQUAL_TO', oSearchDate.format('DD MMM YYYY'));
				}

				if (_.isNumber(numeral(sSearchText).value()))
				{
					oSearch.addOperator('or');
					oSearch.addFilter('amount', 'EQUAL_TO', numeral(sSearchText).value());
				}

				oSearch.addBracket(')')
			}

			oSearch.addFilter('status', 'NOT_EQUAL_TO', 1);
			oSearch.addFilter('bankaccount', 'IS_NOT_NULL');
			oSearch.addFilter('amount', 'NOT_EQUAL_TO', 0)

			if (sStartDate != '') {oSearch.addFilter('posteddate', 'GREATER_THAN_OR_EQUAL_TO', sStartDate)};
			if (sEndDate != '') {oSearch.addFilter('posteddate', 'LESS_THAN_OR_EQUAL_TO', sEndDate)};

			if (iProject != undefined)
			{
				oSearch.addFilter('project', 'EQUAL_TO', iProject);
			}

			oSearch.addSummaryField('count(id) count');
			oSearch.sort('posteddate', 'asc');

			oSearch.getResults(function(data) {ns1blankspace.financial.compliance.bank_transactions.show(oParam, data)});
		}
		else
		{
			var aHTML = [];
			
			if (oResponse.data.rows.length == 0)
			{	
				aHTML.push('<table><tbody>' +
								'<tr class="ns1blankspace">' +
								'<td class="ns1blankspaceNothing">No bank transactions.</td>' +
								'</tr>' +
								'</tbody></table>');

				$('#ns1blankspaceComplianceBankTransactionsShow').html(aHTML.join(''));

			}
			else
			{
				sXHTMLElementID = 'ns1blankspaceComplianceBankTransactionsShow';

				aHTML.push('<table class="ns1blankspace">');

				aHTML.push('<tr class="ns1blankspaceHeaderCaption">');

				aHTML.push('<td class="ns1blankspaceHeaderCaption">Description</td>' +
								'<td class="ns1blankspaceHeaderCaption" style="width:75px;">Date</td>' +
								'<td class="ns1blankspaceHeaderCaption">Type</td>' +
								'<td class="ns1blankspaceHeaderCaption" style="width:75px; text-align:right;">Amount</td>' +
								'<td class="ns1blankspaceHeaderCaption">Status</td>' +
								'</tr>')

				$.each(oResponse.data.rows, function()
				{
					aHTML.push(ns1blankspace.financial.compliance.bank_transactions.row(this));
				});
				
				aHTML.push('</table>');

				ns1blankspace.render.page.show(
				{
					xhtmlElementID: sXHTMLElementID,
					xhtmlContext: sXHTMLElementID,
					xhtml: aHTML.join(''),
					showMore: (oResponse.morerows == "true"),
					more: oResponse.moreid,
					rows: iRows,
					functionShowRow: ns1blankspace.financial.compliance.bank_transactions.row,
					functionNewPage: 'ns1blankspace.financial.compliance.bank_transactions.bind()',
					headerRow: true,
					summary: oResponse.summary
				}); 	
					
				ns1blankspace.financial.compliance.bank_transactions.bind();
			}
		}	
	},

	row: function(oRow)
	{
		var aHTML = [];
		
		aHTML.push('<tr class="ns1blankspaceRow">');
			
		aHTML.push('<td id="ns1blankspaceFinancialBankTransaction_notes-' + oRow.id + '" class="ns1blankspaceRow" style="color:#666666;">' +
								oRow.notes + '</td>');
								
		aHTML.push('<td id="ns1blankspaceFinancialBankTransaction_date-' + oRow.id + '" class="ns1blankspaceRow" style="color:#666666;">' +
								oRow.posteddate + '</td>');
										
		aHTML.push('<td id="ns1blankspaceFinancialBankTransaction_type-' + oRow.id + '" class="ns1blankspaceRow" style="color:#666666;">' + 
								oRow.typetext + '</td>');
							
		aHTML.push('<td id="ns1blankspaceFinancialBankTransaction_amount-' + oRow.id + '" style="text-align:right; color:#666666;" class="ns1blankspaceRow">' +
								oRow.amount + '</td>');

		aHTML.push('<td id="ns1blankspaceFinancialBankTransaction_type-' + oRow.id + '" class="ns1blankspaceRow" style="color:#666666;">' + 
								oRow.statustext + '</td>');
																				
		aHTML.push('</td></tr>');

		return aHTML.join('');
	},

	bind: 	function()
	{
		/*$('div[data-object]:visible').click(function (event)
		{
			var iObject = $(this).attr('data-object');
			var iObjectContext = $(this).attr('data-objectcontext');
			var sNamespace = _.toLower(_.find(ns1blankspace.financial.data.objects, function (object) {return object.id == iObject}).name);

			ns1blankspace.financial[sNamespace].init({id: iObjectContext});
		});	*/
	}	
}

ns1blankspace.financial.compliance.payments =
{
	show: function (oParam, oResponse)
	{
		var sStartDate = ns1blankspace.util.getParam(oParam, 'startDate', {"default":ns1blankspace.financial.data.defaults.startdate}).value;
		var sEndDate = ns1blankspace.util.getParam(oParam, 'endDate', {"default":ns1blankspace.financial.data.defaults.enddate}).value;
		var iProject = ns1blankspace.util.getParam(oParam, 'project').value;
		var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {"default": 'ns1blankspaceComplianceSearchContainer'}).value;
		var iRows = ns1blankspace.util.getParam(oParam, 'rows', {"default": 8}).value;
		
		var sSearchText = $('#ns1blankspaceCompliancePaymentsSearch').val();
			
		if (oResponse == undefined)
		{			
			if (sSearchText == undefined)
			{
				var aHTML = [];

				aHTML.push('<div>' +
				'<input id="ns1blankspaceCompliancePaymentsSearch" class="ns1blankspaceText" data-1blankspace="ignore" style="width:50%;">' +
				'</div>');

				aHTML.push('<div id="ns1blankspaceCompliancePaymentsShow" style="font-size: 0.875em;"' +
							'data-filename="compliance-payments-' + _.kebabCase(sStartDate) + '-to-' + _.kebabCase(sEndDate) + '.csv">' +
							ns1blankspace.xhtml.loadingSmall +
							'</div>');

				aHTML.push('<div style="margin-top:12px;">' +
							'<div class="ns1blankspaceAction" id="ns1blankspaceCompliancePaymentsExport" style="font-size:0.75em;">' +
									'</div>' +
							'</div>');

				aHTML.push('</div>');

				$('#' + sXHTMLElementID).html(aHTML.join(''));

				$('#ns1blankspaceCompliancePaymentsSearch').unbind('keyup').keyup(function(event)
				{
					if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
			        ns1blankspace.timer.delayCurrent = setTimeout('ns1blankspace.financial.compliance.payments.show()', ns1blankspace.option.typingWait);
				});

				$('#ns1blankspaceCompliancePaymentsExport').button(
				{
					label: 'Export'
				})
				.click(function(event)
				{
					ns1blankspace.financial.compliance.export.items(
					{
						xhtmlContext: 'ns1blankspaceCompliancePaymentsShow',
						dateAttribute: 'paiddate',
						suffix: 'paidto',
						includeBankTransaction: true,
						bankTransactionAmountAttibute: 'payment_sourcebanktransaction_amount'
					})
				});
			}	

			var oSearch = new AdvancedSearch();
			oSearch.method = 'FINANCIAL_PAYMENT_SEARCH';
			oSearch.rows = iRows;

			oSearch.addField('amount,tax,paiddate,description,reference,reconciliation,contactbusinesspaidtotext,contactpersonpaidtotext,sourcebanktransactiontext,payment_sourcebanktransaction_amount');
			if (sSearchText != '')
			{
				oSearch.addBracket('(');
				oSearch.addFilter('reference', 'TEXT_IS_LIKE', sSearchText);
				oSearch.addFilter('or')
				oSearch.addFilter('description', 'TEXT_IS_LIKE', sSearchText);

				var oSearchDate = moment(sSearchText, 'DD MMM YYYY HH:mm:ss')
				if (oSearchDate.isValid())
				{
					oSearch.addOperator('or');
					oSearch.addFilter('paiddate', 'EQUAL_TO', oSearchDate.format('DD MMM YYYY'));
				}

				if (_.isNumber(numeral(sSearchText).value()))
				{
					oSearch.addOperator('or');
					oSearch.addFilter('amount', 'EQUAL_TO', numeral(sSearchText).value());
				}
				oSearch.addBracket(')')
			}

			oSearch.addSummaryField('count(id) count');
			oSearch.sort('paiddate', 'asc');

			if (sStartDate != '') {oSearch.addFilter('paiddate', 'GREATER_THAN_OR_EQUAL_TO', sStartDate)};
			if (sEndDate != '') {oSearch.addFilter('paiddate', 'LESS_THAN_OR_EQUAL_TO', sEndDate)};

			if (iProject != undefined)
			{
				oSearch.addFilter('project', 'EQUAL_TO', iProject);
			}

			oSearch.getResults(function(data) {ns1blankspace.financial.compliance.payments.show(oParam, data)});
		}
		else
		{
			sXHTMLElementID = 'ns1blankspaceCompliancePaymentsShow';

			var aHTML = [];
			
			if (oResponse.data.rows.length == 0)
			{
				aHTML.push('<table><tbody>' +
								'<tr class="ns1blankspace">' +
								'<td class="ns1blankspaceNothing">No payments.</td>' +
								'</tr>' +
								'</tbody></table>');

				$('#ns1blankspaceCompliancePaymentsShow').html(aHTML.join(''));

			}
			else
			{
				aHTML.push('<table class="ns1blankspace">');

				aHTML.push('<tr class="ns1blankspaceHeaderCaption">');

				aHTML.push('<td class="ns1blankspaceHeaderCaption">Reference</td>' +
								'<td class="ns1blankspaceHeaderCaption" style="width:75px;">Date</td>' +
								'<td class="ns1blankspaceHeaderCaption">Description</td>' +
								'<td class="ns1blankspaceHeaderCaption">Paid To</td>' +
								'<td class="ns1blankspaceHeaderCaption" style="width:40px; text-align:right;">Amount</td>' +
								'<td class="ns1blankspaceHeaderCaption" style="width:40px; text-align:right;">Tax</td>' +
								'<td class="ns1blankspaceHeaderCaption">Bank Transaction</td>' +
								'</tr>')

				$.each(oResponse.data.rows, function()
				{
					aHTML.push(ns1blankspace.financial.compliance.payments.row(this));
				});
				
				aHTML.push('</table>');

				ns1blankspace.render.page.show(
				{
					xhtmlElementID: sXHTMLElementID,
					xhtmlContext: sXHTMLElementID,
					xhtml: aHTML.join(''),
					showMore: (oResponse.morerows == "true"),
					more: oResponse.moreid,
					rows: iRows,
					functionShowRow: ns1blankspace.financial.compliance.payments.row,
					functionNewPage: 'ns1blankspace.financial.compliance.payments.bind()',
					headerRow: true,
					summary: oResponse.summary
				}); 	
					
				ns1blankspace.financial.compliance.payments.bind();
			}
		}	
	},

	row: function(oRow)
	{
		var sContact = oRow.contactbusinesspaidtotext;
		if (oRow.contactpersonpaidtotext != '')
		{
			sContact = oRow.contactpersonpaidtotext
		}

		var aHTML = [];
		
		aHTML.push('<tr class="ns1blankspaceRow">');
			
								
		aHTML.push('<td id="ns1blankspaceFinancialTransaction_financialaccounttext-' + oRow.id + '" data-id="' + oRow.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
								oRow.reference + '</td>');
								
		aHTML.push('<td id="ns1blankspaceFinancialTransaction_date-' + oRow.id + '" class="ns1blankspaceRow" style="color:#666666;">' +
								ns1blankspace.util.fd(oRow.paiddate) + '</td>');
										
		aHTML.push('<td id="ns1blankspaceFinancialTransaction_description-' + oRow.id + '" class="ns1blankspaceRow" style="color:#666666;">' + 
								oRow.description + '</td>');
			
		aHTML.push('<td id="ns1blankspaceFinancialTransaction_contact-' + oRow.id + '" class="ns1blankspaceRow" style="color:#666666;">' + 
								sContact + '</td>');
												
		aHTML.push('<td id="ns1blankspaceFinancialTransaction_amount-' + oRow.id + '" style="text-align:right; color:#666666;" class="ns1blankspaceRow">' +
								oRow.amount + '</td>');

		aHTML.push('<td id="ns1blankspaceFinancialTransaction_amount-' + oRow.id + '" style="text-align:right; color:#666666;" class="ns1blankspaceRow">' +
								oRow.tax + '</td>');

		aHTML.push('<td id="ns1blankspaceFinancialTransaction_banktransaction-' + oRow.id + '" style="vertical-align:top; font-size:0.75em;" class="ns1blankspaceRow ns1blankspaceSubNote">' +
								oRow.sourcebanktransactiontext + '</td>');
																				
		aHTML.push('</td></tr>');

		return aHTML.join('');
	},

	bind: function()
	{
		$('#ns1blankspaceCompliancePaymentsShow td.ns1blankspaceRowSelect:visible').click(function (event)
		{
			var iObjectContext = $(this).attr('data-id');
			var sNamespace = 'payment'
			ns1blankspace.financial[sNamespace].init({id: iObjectContext});
		});	
	}	
}

ns1blankspace.financial.compliance.receipts =
{
	show: function (oParam, oResponse)
	{
		var sStartDate = ns1blankspace.util.getParam(oParam, 'startDate', {"default":ns1blankspace.financial.data.defaults.startdate}).value;
		var sEndDate = ns1blankspace.util.getParam(oParam, 'endDate', {"default":ns1blankspace.financial.data.defaults.enddate}).value;
		var iProject = ns1blankspace.util.getParam(oParam, 'project').value;
		var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {"default": 'ns1blankspaceComplianceSearchContainer'}).value;
		var iRows = ns1blankspace.util.getParam(oParam, 'rows', {"default": 8}).value;
		
		var sSearchText = $('#ns1blankspaceComplianceReceiptsSearch').val();

		if (oResponse == undefined)
		{			
			if (sSearchText == undefined)
			{
				var aHTML = [];

				aHTML.push('<div>' +
				'<input id="ns1blankspaceComplianceReceiptsSearch" class="ns1blankspaceText" data-1blankspace="ignore" style="width:50%;">' +
				'</div>');

				aHTML.push('<div id="ns1blankspaceComplianceReceiptsShow" style="font-size: 0.875em;"' +
							'data-filename="compliance-receipts-' + _.kebabCase(sStartDate) + '-to-' + _.kebabCase(sEndDate) + '.csv">' +
							ns1blankspace.xhtml.loadingSmall +
							'</div>');

				aHTML.push('<div style="margin-top:12px;">' +
							'<div class="ns1blankspaceAction" id="ns1blankspaceComplianceReceiptsExport" style="font-size:0.75em;">' +
									'</div>' +
							'</div>');

				aHTML.push('</div>');

				$('#' + sXHTMLElementID).html(aHTML.join(''));

				$('#ns1blankspaceComplianceReceiptsSearch').unbind('keyup').keyup(function(event)
				{
					if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
			        ns1blankspace.timer.delayCurrent = setTimeout('ns1blankspace.financial.compliance.receipts.show()', ns1blankspace.option.typingWait);
				});

				$('#ns1blankspaceComplianceReceiptsExport').button(
				{
					label: 'Export'
				})
				.click(function(event)
				{
					ns1blankspace.financial.compliance.export.items(
					{
						xhtmlContext: 'ns1blankspaceComplianceReceiptsShow',
						dateAttribute: 'receiveddate',
						suffix: 'receivedfrom',
						includeBankTransaction: true,
						bankTransactionAmountAttibute: 'receipt_sourcebanktransaction_amount'
					})
				});
			}	

			var oSearch = new AdvancedSearch();
			oSearch.method = 'FINANCIAL_RECEIPT_SEARCH';
			oSearch.rows = iRows;

			oSearch.addField('amount,tax,receiveddate,description,reference,reconciliation,contactbusinessreceivedfromtext,contactpersonreceivedfromtext,sourcebanktransactiontext,receipt_sourcebanktransaction_amount');
			if (sSearchText != '')
			{
				oSearch.addBracket('(');
				oSearch.addFilter('reference', 'TEXT_IS_LIKE', sSearchText);
				oSearch.addFilter('or')
				oSearch.addFilter('description', 'TEXT_IS_LIKE', sSearchText);

				var oSearchDate = moment(sSearchText, 'DD MMM YYYY HH:mm:ss')
				if (oSearchDate.isValid())
				{
					oSearch.addOperator('or');
					oSearch.addFilter('receiveddate', 'EQUAL_TO', oSearchDate.format('DD MMM YYYY'));
				}
				oSearch.addBracket(')')
			}

			oSearch.addSummaryField('count(id) count');
			oSearch.sort('receiveddate', 'asc');

			if (sStartDate != '') {oSearch.addFilter('receiveddate', 'GREATER_THAN_OR_EQUAL_TO', sStartDate)};
			if (sEndDate != '') {oSearch.addFilter('receiveddate', 'LESS_THAN_OR_EQUAL_TO', sEndDate)};

			if (iProject != undefined)
			{
				oSearch.addFilter('project', 'EQUAL_TO', iProject);
			}

			oSearch.getResults(function(data) {ns1blankspace.financial.compliance.receipts.show(oParam, data)});
		}
		else
		{
			sXHTMLElementID = 'ns1blankspaceComplianceReceiptsShow';

			var aHTML = [];
			
			if (oResponse.data.rows.length == 0)
			{
				aHTML.push('<table><tbody>' +
								'<tr class="ns1blankspace">' +
								'<td class="ns1blankspaceNothing">No receipts.</td>' +
								'</tr>' +
								'</tbody></table>');

				$('#ns1blankspaceComplianceReceiptsShow').html(aHTML.join(''));

			}
			else
			{
				aHTML.push('<table class="ns1blankspace">');

				aHTML.push('<tr class="ns1blankspaceHeaderCaption">');

				aHTML.push('<td class="ns1blankspaceHeaderCaption">Reference</td>' +
								'<td class="ns1blankspaceHeaderCaption" style="width:75px;">Date</td>' +
								'<td class="ns1blankspaceHeaderCaption">Description</td>' +
								'<td class="ns1blankspaceHeaderCaption">Received From</td>' +
								'<td class="ns1blankspaceHeaderCaption" style="width:40px; text-align:right;">Amount</td>' +
								'<td class="ns1blankspaceHeaderCaption" style="width:40px; text-align:right;">Tax</td>' +
								'<td class="ns1blankspaceHeaderCaption">Bank Transaction</td>' +
								'</tr>')

				$.each(oResponse.data.rows, function()
				{
					aHTML.push(ns1blankspace.financial.compliance.receipts.row(this));
				});
				
				aHTML.push('</table>');

				ns1blankspace.render.page.show(
				{
					xhtmlElementID: sXHTMLElementID,
					xhtmlContext: sXHTMLElementID,
					xhtml: aHTML.join(''),
					showMore: (oResponse.morerows == "true"),
					more: oResponse.moreid,
					rows: iRows,
					functionShowRow: ns1blankspace.financial.compliance.receipts.row,
					functionNewPage: 'ns1blankspace.financial.compliance.receipts.bind()',
					headerRow: true,
					summary: oResponse.summary
				}); 	
					
				ns1blankspace.financial.compliance.receipts.bind();
			}
		}	
	},

	row: function(oRow)
	{
		var sContact = oRow.contactbusinessreceivedfromtext;

		if (oRow.contactpersonreceivedfromtext != '')
		{
			sContact = oRow.contactpersonreceivedfromtext
		}

		var aHTML = [];
		
		aHTML.push('<tr class="ns1blankspaceRow">');
			
								
		aHTML.push('<td id="ns1blankspaceFinancialTransaction_financialaccounttext-' + oRow.id + '" data-id="' + oRow.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
								oRow.reference + '</td>');
								
		aHTML.push('<td id="ns1blankspaceFinancialTransaction_date-' + oRow.id + '" class="ns1blankspaceRow" style="color:#666666;">' +
								ns1blankspace.util.fd(oRow.receiveddate) + '</td>');
										
		aHTML.push('<td id="ns1blankspaceFinancialTransaction_description-' + oRow.id + '" class="ns1blankspaceRow" style="color:#666666;">' + 
								oRow.description + '</td>');

		aHTML.push('<td id="ns1blankspaceFinancialTransaction_contact-' + oRow.id + '" class="ns1blankspaceRow" style="color:#666666;">' + 
								sContact + '</td>');
							
		aHTML.push('<td id="ns1blankspaceFinancialTransaction_amount-' + oRow.id + '" style="text-align:right; color:#666666;" class="ns1blankspaceRow">' +
								oRow.amount + '</td>');

		aHTML.push('<td id="ns1blankspaceFinancialTransaction_amount-' + oRow.id + '" style="text-align:right; color:#666666;" class="ns1blankspaceRow">' +
								oRow.tax + '</td>');

		aHTML.push('<td id="ns1blankspaceFinancialTransaction_banktransaction-' + oRow.id + '" style="vertical-align:top; font-size:0.75em;" class="ns1blankspaceRow ns1blankspaceSubNote">' +
								oRow.sourcebanktransactiontext + '</td>');
																				
		aHTML.push('</td></tr>');

		return aHTML.join('');
	},

	bind: function()
	{
		$('#ns1blankspaceComplianceReceiptsShow td.ns1blankspaceRowSelect:visible').click(function (event)
		{
			var iObjectContext = $(this).attr('data-id');
			ns1blankspace.financial['receipt'].init({id: iObjectContext});
		});	
	}	
}

ns1blankspace.financial.compliance.invoices =
{
	show: function (oParam, oResponse)
	{
		var sStartDate = ns1blankspace.util.getParam(oParam, 'startDate', {"default":ns1blankspace.financial.data.defaults.startdate}).value;
		var sEndDate = ns1blankspace.util.getParam(oParam, 'endDate', {"default":ns1blankspace.financial.data.defaults.enddate}).value;
		var iProject = ns1blankspace.util.getParam(oParam, 'project').value;
		var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {"default": 'ns1blankspaceComplianceSearchContainer'}).value;
		var iRows = ns1blankspace.util.getParam(oParam, 'rows', {"default": 8}).value;
		
		var sSearchText = $('#ns1blankspaceComplianceInvoicesSearch').val();

		if (oResponse == undefined)
		{			
			if (sSearchText == undefined)
			{
				var aHTML = [];

				aHTML.push('<div>' +
				'<input id="ns1blankspaceComplianceInvoicesSearch" class="ns1blankspaceText" data-1blankspace="ignore" style="width:50%;">' +
				'</div>');

				aHTML.push('<div id="ns1blankspaceComplianceInvoicesShow" style="font-size: 0.875em;"' +
							'data-filename="compliance-invoices-' + _.kebabCase(sStartDate) + '-to-' + _.kebabCase(sEndDate) + '.csv">' +
							ns1blankspace.xhtml.loadingSmall +
							'</div>');

				aHTML.push('<div style="margin-top:12px;">' +
							'<div class="ns1blankspaceAction" id="ns1blankspaceComplianceInvoicesExport" style="font-size:0.75em;">' +
									'</div>' +
							'</div>');

				aHTML.push('</div>');

				$('#' + sXHTMLElementID).html(aHTML.join(''));

				$('#ns1blankspaceComplianceInvoicesSearch').unbind('keyup').keyup(function(event)
				{
					if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
			        ns1blankspace.timer.delayCurrent = setTimeout('ns1blankspace.financial.compliance.invoices.show()', ns1blankspace.option.typingWait);
				});

				$('#ns1blankspaceComplianceInvoicesExport').button(
				{
					label: 'Export'
				})
				.click(function(event)
				{
					ns1blankspace.financial.compliance.export.items(
					{
						xhtmlContext: 'ns1blankspaceComplianceInvoicesShow',
						dateAttribute: 'sentdate',
						suffix: 'sentto'
					})
				});
			}	

			var oSearch = new AdvancedSearch();
			oSearch.method = 'FINANCIAL_INVOICE_SEARCH';
			oSearch.rows = iRows;

			oSearch.addField('amount,tax,sentdate,description,reference,contactbusinesssenttotext,contactpersonsenttotext');
			if (sSearchText != '')
			{
				oSearch.addBracket('(');
				oSearch.addFilter('reference', 'TEXT_IS_LIKE', sSearchText);
				oSearch.addFilter('or')
				oSearch.addFilter('description', 'TEXT_IS_LIKE', sSearchText);

				var oSearchDate = moment(sSearchText, 'DD MMM YYYY HH:mm:ss')
				if (oSearchDate.isValid())
				{
					oSearch.addOperator('or');
					oSearch.addFilter('sentdate', 'EQUAL_TO', oSearchDate.format('DD MMM YYYY'));
				}
				oSearch.addBracket(')')
			}

			oSearch.addSummaryField('count(id) count');
			oSearch.sort('sentdate', 'asc');

			if (sStartDate != '') {oSearch.addFilter('sentdate', 'GREATER_THAN_OR_EQUAL_TO', sStartDate)};
			if (sEndDate != '') {oSearch.addFilter('sentdate', 'LESS_THAN_OR_EQUAL_TO', sEndDate)};

			if (iProject != undefined)
			{
				oSearch.addFilter('project', 'EQUAL_TO', iProject);
			}

			oSearch.getResults(function(data) {ns1blankspace.financial.compliance.invoices.show(oParam, data)});
		}
		else
		{
			sXHTMLElementID = 'ns1blankspaceComplianceInvoicesShow';

			var aHTML = [];
			
			if (oResponse.data.rows.length == 0)
			{
				aHTML.push('<table><tbody>' +
								'<tr class="ns1blankspace">' +
								'<td class="ns1blankspaceNothing">No invoices.</td>' +
								'</tr>' +
								'</tbody></table>');

				$('#ns1blankspaceComplianceInvoicesShow').html(aHTML.join(''));

			}
			else
			{
				aHTML.push('<table class="ns1blankspace">');

				aHTML.push('<tr class="ns1blankspaceHeaderCaption">');

				aHTML.push('<td class="ns1blankspaceHeaderCaption">Reference</td>' +
								'<td class="ns1blankspaceHeaderCaption" style="width:75px;">Date</td>' +
								'<td class="ns1blankspaceHeaderCaption">Description</td>' +
								'<td class="ns1blankspaceHeaderCaption">Sent To</td>' +
								'<td class="ns1blankspaceHeaderCaption" style="width:100px; text-align:right;">Amount</td>' +
								'<td class="ns1blankspaceHeaderCaption" style="width:100px; text-align:right;">Tax</td>' +
								'</tr>')

				$.each(oResponse.data.rows, function()
				{
					aHTML.push(ns1blankspace.financial.compliance.invoices.row(this));
				});
				
				aHTML.push('</table>');

				ns1blankspace.render.page.show(
				{
					xhtmlElementID: sXHTMLElementID,
					xhtmlContext: sXHTMLElementID,
					xhtml: aHTML.join(''),
					showMore: (oResponse.morerows == "true"),
					more: oResponse.moreid,
					rows: iRows,
					functionShowRow: ns1blankspace.financial.compliance.invoices.row,
					functionNewPage: 'ns1blankspace.financial.compliance.invoices.bind()',
					headerRow: true,
					summary: oResponse.summary
				}); 	
					
				ns1blankspace.financial.compliance.invoices.bind();
			}
		}	
	},

	row: function(oRow)
	{
		var sContact = oRow.contactbusinesssenttotext;

		if (oRow.contactpersonsenttotext != '')
		{
			sContact = oRow.contactpersonsenttotext
		}

		var aHTML = [];
		
		aHTML.push('<tr class="ns1blankspaceRow">');
			
								
		aHTML.push('<td id="ns1blankspaceFinancialTransaction_financialaccounttext-' + oRow.id + '" data-id="' + oRow.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
								oRow.reference + '</td>');
								
		aHTML.push('<td id="ns1blankspaceFinancialTransaction_date-' + oRow.id + '" class="ns1blankspaceRow" style="color:#666666;">' +
								ns1blankspace.util.fd(oRow.sentdate) + '</td>');
				
		aHTML.push('<td id="ns1blankspaceFinancialTransaction_contact-' + oRow.id + '" class="ns1blankspaceRow" style="color:#666666;">' + 
								sContact + '</td>');
																
		aHTML.push('<td id="ns1blankspaceFinancialTransaction_description-' + oRow.id + '" class="ns1blankspaceRow" style="color:#666666;">' + 
								oRow.description + '</td>');
							
		aHTML.push('<td id="ns1blankspaceFinancialTransaction_amount-' + oRow.id + '" style="text-align:right; color:#666666;" class="ns1blankspaceRow">' +
								oRow.amount + '</td>');

		aHTML.push('<td id="ns1blankspaceFinancialTransaction_amount-' + oRow.id + '" style="text-align:right; color:#666666;" class="ns1blankspaceRow">' +
								oRow.tax + '</td>');
																				
		aHTML.push('</td></tr>');

		return aHTML.join('');
	},

	bind: function()
	{
		$('#ns1blankspaceComplianceInvoicesShow td.ns1blankspaceRowSelect:visible').click(function (event)
		{
			var iObjectContext = $(this).attr('data-id');
			ns1blankspace.financial.invoice.init({id: iObjectContext});
		});	
	}	
}

ns1blankspace.financial.compliance.expenses =
{
	show: function (oParam, oResponse)
	{
		var sStartDate = ns1blankspace.util.getParam(oParam, 'startDate', {"default":ns1blankspace.financial.data.defaults.startdate}).value;
		var sEndDate = ns1blankspace.util.getParam(oParam, 'endDate', {"default":ns1blankspace.financial.data.defaults.enddate}).value;
		var iProject = ns1blankspace.util.getParam(oParam, 'project').value;
		var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {"default": 'ns1blankspaceComplianceSearchContainer'}).value;
		var iRows = ns1blankspace.util.getParam(oParam, 'rows', {"default": 8}).value;
		
		var sSearchText = $('#ns1blankspaceComplianceExpensesSearch').val();

		if (oResponse == undefined)
		{			
			if (sSearchText == undefined)
			{
				var aHTML = [];

				aHTML.push('<div>' +
				'<input id="ns1blankspaceComplianceExpensesSearch" class="ns1blankspaceText" data-1blankspace="ignore" style="width:50%;">' +
				'</div>');

				aHTML.push('<div id="ns1blankspaceComplianceExpensesShow" style="font-size: 0.875em;"' +
							'data-filename="compliance-expenses-' + _.kebabCase(sStartDate) + '-to-' + _.kebabCase(sEndDate) + '.csv">' +
							ns1blankspace.xhtml.loadingSmall +
							'</div>');

				aHTML.push('<div style="margin-top:12px;">' +
							'<div class="ns1blankspaceAction" id="ns1blankspaceComplianceExpensesExport" style="font-size:0.75em;">' +
									'</div>' +
							'</div>');

				aHTML.push('</div>');

				$('#' + sXHTMLElementID).html(aHTML.join(''));

				$('#ns1blankspaceComplianceExpensesSearch').unbind('keyup').keyup(function(event)
				{
					if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
			        ns1blankspace.timer.delayCurrent = setTimeout('ns1blankspace.financial.compliance.expenses.show()', ns1blankspace.option.typingWait);
				});

				$('#ns1blankspaceComplianceExpensesExport').button(
				{
					label: 'Export'
				})
				.click(function(event)
				{
					ns1blankspace.financial.compliance.export.items(
					{
						xhtmlContext: 'ns1blankspaceComplianceExpensesShow',
						dateAttribute: 'accrueddate',
						suffix: 'paidto'
					})
				});
			}	

			var oSearch = new AdvancedSearch();
			oSearch.method = 'FINANCIAL_EXPENSE_SEARCH';
			oSearch.rows = iRows;

			oSearch.addField('amount,tax,accrueddate,description,reference,contactbusinesspaidtotext,contactpersonpaidtotext');
			if (sSearchText != '')
			{
				oSearch.addBracket('(');
				oSearch.addFilter('reference', 'TEXT_IS_LIKE', sSearchText);
				oSearch.addFilter('or')
				oSearch.addFilter('description', 'TEXT_IS_LIKE', sSearchText);

				var oSearchDate = moment(sSearchText, 'DD MMM YYYY HH:mm:ss')
				if (oSearchDate.isValid())
				{
					oSearch.addOperator('or');
					oSearch.addFilter('accrueddate', 'EQUAL_TO', oSearchDate.format('DD MMM YYYY'));
				}
				oSearch.addBracket(')')
			}

			oSearch.addSummaryField('count(id) count');
			oSearch.sort('accrueddate', 'asc');

			if (sStartDate != '') {oSearch.addFilter('accrueddate', 'GREATER_THAN_OR_EQUAL_TO', sStartDate)};
			if (sEndDate != '') {oSearch.addFilter('accrueddate', 'LESS_THAN_OR_EQUAL_TO', sEndDate)};

			if (iProject != undefined)
			{
				oSearch.addFilter('project', 'EQUAL_TO', iProject);
			}

			oSearch.getResults(function(data) {ns1blankspace.financial.compliance.expenses.show(oParam, data)});
		}
		else
		{
			sXHTMLElementID = 'ns1blankspaceComplianceExpensesShow';

			var aHTML = [];
			
			if (oResponse.data.rows.length == 0)
			{
				aHTML.push('<table><tbody>' +
								'<tr class="ns1blankspace">' +
								'<td class="ns1blankspaceNothing">No expenses.</td>' +
								'</tr>' +
								'</tbody></table>');

				$('#ns1blankspaceComplianceExpensesShow').html(aHTML.join(''));
			}
			else
			{
				aHTML.push('<table class="ns1blankspace">');

				aHTML.push('<tr class="ns1blankspaceHeaderCaption">');

				aHTML.push('<td class="ns1blankspaceHeaderCaption">Reference</td>' +
								'<td class="ns1blankspaceHeaderCaption" style="width:75px;">Date</td>' +
								'<td class="ns1blankspaceHeaderCaption">Description</td>' +
								'<td class="ns1blankspaceHeaderCaption">Paid To</td>' +
								'<td class="ns1blankspaceHeaderCaption" style="width:100px; text-align:right;">Amount</td>' +
								'<td class="ns1blankspaceHeaderCaption" style="width:100px; text-align:right;">Tax</td>' +
								'</tr>')

				$.each(oResponse.data.rows, function()
				{
					aHTML.push(ns1blankspace.financial.compliance.expenses.row(this));
				});
				
				aHTML.push('</table>');

				ns1blankspace.render.page.show(
				{
					xhtmlElementID: sXHTMLElementID,
					xhtmlContext: sXHTMLElementID,
					xhtml: aHTML.join(''),
					showMore: (oResponse.morerows == "true"),
					more: oResponse.moreid,
					rows: iRows,
					functionShowRow: ns1blankspace.financial.compliance.expenses.row,
					functionNewPage: 'ns1blankspace.financial.compliance.expenses.bind()',
					headerRow: true,
					summary: oResponse.summary
				}); 	
					
				ns1blankspace.financial.compliance.expenses.bind();
			}
		}	
	},

	row: function(oRow)
	{
		var sContact = oRow.contactbusinesspaidtotext;

		if (oRow.contactpersonpaidtotext != '')
		{
			sContact = oRow.contactpersonpaidtotext
		}

		var aHTML = [];
		
		aHTML.push('<tr class="ns1blankspaceRow">');
			
								
		aHTML.push('<td id="ns1blankspaceFinancialTransaction_financialaccounttext-' + oRow.id + '" data-id="' + oRow.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
								oRow.reference + '</td>');
								
		aHTML.push('<td id="ns1blankspaceFinancialTransaction_date-' + oRow.id + '" class="ns1blankspaceRow" style="color:#666666;">' +
								ns1blankspace.util.fd(oRow.accrueddate) + '</td>');
										
		aHTML.push('<td id="ns1blankspaceFinancialTransaction_description-' + oRow.id + '" class="ns1blankspaceRow" style="color:#666666;">' + 
								oRow.description + '</td>');
		
		aHTML.push('<td id="ns1blankspaceFinancialTransaction_contact-' + oRow.id + '" class="ns1blankspaceRow" style="color:#666666;">' + 
								sContact + '</td>');

		aHTML.push('<td id="ns1blankspaceFinancialTransaction_amount-' + oRow.id + '" style="text-align:right; color:#666666;" class="ns1blankspaceRow">' +
								oRow.amount + '</td>');

		aHTML.push('<td id="ns1blankspaceFinancialTransaction_tax-' + oRow.id + '" style="text-align:right; color:#666666;" class="ns1blankspaceRow">' +
								oRow.tax + '</td>');
																				
		aHTML.push('</td></tr>');

		return aHTML.join('');
	},

	bind: function()
	{
		$('#ns1blankspaceComplianceExpensesShow td.ns1blankspaceRowSelect:visible').click(function (event)
		{
			var iObjectContext = $(this).attr('data-id');
			ns1blankspace.financial.expense.init({id: iObjectContext});
		});	
	}	
}

ns1blankspace.financial.compliance.credits =
{
	show: function (oParam, oResponse)
	{
		var sStartDate = ns1blankspace.util.getParam(oParam, 'startDate', {"default":ns1blankspace.financial.data.defaults.startdate}).value;
		var sEndDate = ns1blankspace.util.getParam(oParam, 'endDate', {"default":ns1blankspace.financial.data.defaults.enddate}).value;
		var iProject = ns1blankspace.util.getParam(oParam, 'project').value;
		var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {"default": 'ns1blankspaceComplianceSearchContainer'}).value;
		var iRows = ns1blankspace.util.getParam(oParam, 'rows', {"default": 8}).value;
		
		var sSearchText = $('#ns1blankspaceComplianceCreditsSearch').val();

		if (oResponse == undefined)
		{			
			if (sSearchText == undefined)
			{
				var aHTML = [];

				aHTML.push('<div>' +
				'<input id="ns1blankspaceComplianceCreditsSearch" class="ns1blankspaceText" data-1blankspace="ignore" style="width:50%;">' +
				'</div>');

				aHTML.push('<div id="ns1blankspaceComplianceCreditsShow" style="font-size: 0.875em;"' +
							'data-filename="compliance-credits-' + _.kebabCase(sStartDate) + '-to-' + _.kebabCase(sEndDate) + '.csv">' +
							ns1blankspace.xhtml.loadingSmall +
							'</div>');

				aHTML.push('<div style="margin-top:12px;">' +
							'<div class="ns1blankspaceAction" id="ns1blankspaceComplianceCreditsExport" style="font-size:0.75em;">' +
									'</div>' +
							'</div>');

				aHTML.push('</div>');

				$('#' + sXHTMLElementID).html(aHTML.join(''));

				$('#ns1blankspaceComplianceCreditsSearch').unbind('keyup').keyup(function(event)
				{
					if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
			        ns1blankspace.timer.delayCurrent = setTimeout('ns1blankspace.financial.compliance.credits.show()', ns1blankspace.option.typingWait);
				});

				$('#ns1blankspaceComplianceCreditsExport').button(
				{
					label: 'Export'
				})
				.click(function(event)
				{
					ns1blankspace.financial.compliance.export.credits(
					{
						xhtmlContext: 'ns1blankspaceComplianceCreditsShow'
					})
				});
			}	

			var oSearch = new AdvancedSearch();
			oSearch.method = 'FINANCIAL_CREDIT_NOTE_SEARCH';
			oSearch.rows = iRows;

			oSearch.addField('amount,tax,creditdate,notes,reference,typetext,financialaccounttext,contactbusinesstext,contactpersontext');
			if (sSearchText != '')
			{
				oSearch.addBracket('(');
				oSearch.addFilter('reference', 'TEXT_IS_LIKE', sSearchText);
				oSearch.addFilter('or')
				oSearch.addFilter('notes', 'TEXT_IS_LIKE', sSearchText);

				var oSearchDate = moment(sSearchText, 'DD MMM YYYY HH:mm:ss')
				if (oSearchDate.isValid())
				{
					oSearch.addOperator('or');
					oSearch.addFilter('creditdate', 'EQUAL_TO', oSearchDate.format('DD MMM YYYY'));
				}
				oSearch.addBracket(')')
			}

			oSearch.addSummaryField('count(id) count');
			oSearch.sort('creditdate', 'asc');

			if (sStartDate != '') {oSearch.addFilter('creditdate', 'GREATER_THAN_OR_EQUAL_TO', sStartDate)};
			if (sEndDate != '') {oSearch.addFilter('creditdate', 'LESS_THAN_OR_EQUAL_TO', sEndDate)};

			if (iProject != undefined)
			{
				oSearch.addFilter('project', 'EQUAL_TO', iProject);
			}

			oSearch.getResults(function(data) {ns1blankspace.financial.compliance.credits.show(oParam, data)});
		}
		else
		{
			sXHTMLElementID = 'ns1blankspaceComplianceCreditsShow';

			var aHTML = [];
			
			if (oResponse.data.rows.length == 0)
			{
				aHTML.push('<table><tbody>' +
								'<tr class="ns1blankspace">' +
								'<td class="ns1blankspaceNothing">No credits.</td>' +
								'</tr>' +
								'</tbody></table>');

				$('#ns1blankspaceComplianceCreditsShow').html(aHTML.join(''));
			}
			else
			{
				aHTML.push('<table class="ns1blankspace">');

				aHTML.push('<tr class="ns1blankspaceHeaderCaption">');

				aHTML.push('<td class="ns1blankspaceHeaderCaption">Reference</td>' +
								'<td class="ns1blankspaceHeaderCaption" style="width:75px;">Date</td>' +
								'<td class="ns1blankspaceHeaderCaption">Type</td>' +
								'<td class="ns1blankspaceHeaderCaption">Financial Account</td>' +
								'<td class="ns1blankspaceHeaderCaption">Notes</td>' +
								'<td class="ns1blankspaceHeaderCaption">Contact</td>' +
								'<td class="ns1blankspaceHeaderCaption" style="width:100px; text-align:right;">Amount</td>' +
								'<td class="ns1blankspaceHeaderCaption" style="width:100px; text-align:right;">Tax</td>' +
								'</tr>')

				$.each(oResponse.data.rows, function()
				{
					aHTML.push(ns1blankspace.financial.compliance.credits.row(this));
				});
				
				aHTML.push('</table>');

				ns1blankspace.render.page.show(
				{
					xhtmlElementID: sXHTMLElementID,
					xhtmlContext: sXHTMLElementID,
					xhtml: aHTML.join(''),
					showMore: (oResponse.morerows == "true"),
					more: oResponse.moreid,
					rows: iRows,
					functionShowRow: ns1blankspace.financial.compliance.credits.row,
					functionNewPage: 'ns1blankspace.financial.compliance.credits.bind()',
					headerRow: true,
					summary: oResponse.summary
				}); 	
					
				ns1blankspace.financial.compliance.credits.bind();
			}
		}	
	},

	row: function(oRow)
	{
		var sContact = oRow.contactbusinesstext;

		if (oRow.contactpersontext != '')
		{
			sContact = oRow.contactpersontext
		}

		var aHTML = [];
		
		aHTML.push('<tr class="ns1blankspaceRow">');
			
								
		aHTML.push('<td id="ns1blankspaceFinancialTransaction_reference-' + oRow.id + '" data-id="' + oRow.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
								oRow.reference + '</td>');
								
		aHTML.push('<td id="ns1blankspaceFinancialTransaction_date-' + oRow.id + '" class="ns1blankspaceRow" style="color:#666666;">' +
								ns1blankspace.util.fd(oRow.creditdate) + '</td>');

		aHTML.push('<td id="ns1blankspaceFinancialTransaction_type-' + oRow.id + '" class="ns1blankspaceRow" style="color:#666666;">' + 
								oRow.typetext + '</td>');
										
		aHTML.push('<td id="ns1blankspaceFinancialTransaction_financialaccounttext-' + oRow.id + '" class="ns1blankspaceRow" style="color:#666666;">' + 
								oRow.financialaccounttext + '</td>');
																
		aHTML.push('<td id="ns1blankspaceFinancialTransaction_notes-' + oRow.id + '" class="ns1blankspaceRow" style="color:#666666;">' + 
								oRow.notes + '</td>');

			aHTML.push('<td id="ns1blankspaceFinancialTransaction_contact-' + oRow.id + '" class="ns1blankspaceRow" style="color:#666666;">' + 
								sContact + '</td>');
							
		aHTML.push('<td id="ns1blankspaceFinancialTransaction_amount-' + oRow.id + '" style="text-align:right; color:#666666;" class="ns1blankspaceRow">' +
								oRow.amount + '</td>');

		aHTML.push('<td id="ns1blankspaceFinancialTransaction_amount-' + oRow.id + '" style="text-align:right; color:#666666;" class="ns1blankspaceRow">' +
								oRow.tax + '</td>');
																				
		aHTML.push('</td></tr>');

		return aHTML.join('');
	},

	bind: function()
	{
		$('#ns1blankspaceComplianceCreditsShow td.ns1blankspaceRowSelect:visible').click(function (event)
		{
			var iObjectContext = $(this).attr('data-id');
			ns1blankspace.financial.credit.init({id: iObjectContext});
		});	
	}	
}

ns1blankspace.financial.compliance.journals =
{
	show: function (oParam, oResponse)
	{
		var sStartDate = ns1blankspace.util.getParam(oParam, 'startDate', {"default":ns1blankspace.financial.data.defaults.startdate}).value;
		var sEndDate = ns1blankspace.util.getParam(oParam, 'endDate', {"default":ns1blankspace.financial.data.defaults.enddate}).value;
		var iProject = ns1blankspace.util.getParam(oParam, 'project').value;
		var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {"default": 'ns1blankspaceComplianceSearchContainer'}).value;
		var iRows = ns1blankspace.util.getParam(oParam, 'rows', {"default": 8}).value;
		
		var sSearchText = $('#ns1blankspaceComplianceJournalsSearch').val();

		if (oResponse == undefined)
		{			
			if (sSearchText == undefined)
			{
				var aHTML = [];

				aHTML.push('<div>' +
				'<input id="ns1blankspaceComplianceJournalsSearch" class="ns1blankspaceText" data-1blankspace="ignore" style="width:50%;">' +
				'</div>');

				aHTML.push('<div id="ns1blankspaceComplianceJournalsShow" style="font-size: 0.875em;"' +
							'data-filename="compliance-journals-' + _.kebabCase(sStartDate) + '-to-' + _.kebabCase(sEndDate) + '.csv">' +
							ns1blankspace.xhtml.loadingSmall +
							'</div>');

				aHTML.push('<div style="margin-top:12px;">' +
							'<div class="ns1blankspaceAction" id="ns1blankspaceComplianceJournalsExport" style="font-size:0.75em; float:left;"></div>' +
							'<div class="ns1blankspaceAction" id="ns1blankspaceComplianceJournalsNew" style="font-size:0.75em;"></div>' +
							'</div>');

				aHTML.push('</div>');

				$('#' + sXHTMLElementID).html(aHTML.join(''));

				$('#ns1blankspaceComplianceJournalsSearch').unbind('keyup').keyup(function(event)
				{
					if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
			        ns1blankspace.timer.delayCurrent = setTimeout('ns1blankspace.financial.compliance.journals.show()', ns1blankspace.option.typingWait);
				});

				$('#ns1blankspaceComplianceJournalsExport').button(
				{
					label: 'Export'
				})
				.click(function(event)
				{
					ns1blankspace.financial.compliance.export.journals(
					{
						xhtmlContext: 'ns1blankspaceComplianceJournalsShow'
					})
				});

				$('#ns1blankspaceComplianceJournalsNew').button(
				{
					label: 'Manage Journals'
				})
				.click(function(event)
				{
					ns1blankspace.financial.journal.init()
				});
			}	

			var oSearch = new AdvancedSearch();
			oSearch.method = 'FINANCIAL_GENERAL_JOURNAL_ITEM_SEARCH';

			oSearch.addField('id,generaljournalitem_generaljournal_reference,generaljournalitem_generaljournal_journaldate,generaljournalitem_generaljournal_description,creditamount,credittax,debitamount,debittax,financialaccounttext');
			oSearch.addFilter('generaljournalitem.generaljournal.status', 'EQUAL_TO', 2);

			if (sSearchText != '')
			{
				oSearch.addBracket('(');
				oSearch.addFilter('generaljournalitem.generaljournal.reference', 'TEXT_IS_LIKE', sSearchText);
				oSearch.addFilter('or')
				oSearch.addFilter('generaljournalitem.generaljournal.description', 'TEXT_IS_LIKE', sSearchText);

				var oSearchDate = moment(sSearchText, 'DD MMM YYYY HH:mm:ss')
				if (oSearchDate.isValid())
				{
					oSearch.addOperator('or');
					oSearch.addFilter('generaljournalitem.generaljournal.journaldate', 'EQUAL_TO', oSearchDate.format('DD MMM YYYY'));
				}
				oSearch.addBracket(')')
			}

			oSearch.rows = iRows;
			oSearch.addSummaryField('count(id) count');
			oSearch.sort('generaljournalitem.generaljournal.journaldate', 'asc');

			if (sStartDate != '') {oSearch.addFilter('generaljournalitem.generaljournal.journaldate', 'GREATER_THAN_OR_EQUAL_TO', sStartDate)};
			if (sEndDate != '') {oSearch.addFilter('generaljournalitem.generaljournal.journaldate', 'LESS_THAN_OR_EQUAL_TO', sEndDate)};

			if (iProject != undefined)
			{
				oSearch.addFilter('project', 'EQUAL_TO', iProject);
			}

			oSearch.getResults(function(data) {ns1blankspace.financial.compliance.journals.show(oParam, data)});
		}
		else
		{
			sXHTMLElementID = 'ns1blankspaceComplianceJournalsShow';

			var aHTML = [];
			
			if (oResponse.data.rows.length == 0)
			{
				aHTML.push('<table><tbody>' +
								'<tr class="ns1blankspace">' +
								'<td class="ns1blankspaceNothing">No journals.</td>' +
								'</tr>' +
								'</tbody></table>');

				$('#ns1blankspaceComplianceJournalsShow').html(aHTML.join(''));
			}
			else
			{
				aHTML.push('<table class="ns1blankspace">');

				aHTML.push('<tr class="ns1blankspaceHeaderCaption">');

				aHTML.push('<td class="ns1blankspaceHeaderCaption" style="width:75px;">Reference</td>' +
								'<td class="ns1blankspaceHeaderCaption" style="width:75px;">Date</td>' +
								'<td class="ns1blankspaceHeaderCaption">Description</td>' +
								'<td class="ns1blankspaceHeaderCaption">Financial Account</td>' +
								'<td class="ns1blankspaceHeaderCaption" style="width:70px; text-align:right;">Credit Amount</td>' +
								'<td class="ns1blankspaceHeaderCaption" style="width:70px; text-align:right;">Debit Amount</td>' +
								'</tr>')

				$.each(oResponse.data.rows, function()
				{
					aHTML.push(ns1blankspace.financial.compliance.journals.row(this));
				});
				
				aHTML.push('</table>');

				ns1blankspace.render.page.show(
				{
					xhtmlElementID: sXHTMLElementID,
					xhtmlContext: sXHTMLElementID,
					xhtml: aHTML.join(''),
					showMore: (oResponse.morerows == "true"),
					more: oResponse.moreid,
					rows: iRows,
					functionShowRow: ns1blankspace.financial.compliance.journals.row,
					functionNewPage: 'ns1blankspace.financial.compliance.journals.bind()',
					headerRow: true,
					summary: oResponse.summary
				}); 	
					
				ns1blankspace.financial.compliance.journals.bind();
			}
		}	
	},

	row: function(oRow)
	{
		var aHTML = [];
		
		aHTML.push('<tr class="ns1blankspaceRow">');
									
		aHTML.push('<td id="ns1blankspaceFinancialTransaction_reference-' + oRow.id + '" data-id="' + oRow.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
								oRow.generaljournalitem_generaljournal_reference + '</td>');
								
		aHTML.push('<td id="ns1blankspaceFinancialTransaction_date-' + oRow.id + '" class="ns1blankspaceRow" style="color:#666666;">' +
								ns1blankspace.util.fd(oRow.generaljournalitem_generaljournal_journaldate) + '</td>');
																
		aHTML.push('<td id="ns1blankspaceFinancialTransaction_description-' + oRow.id + '" class="ns1blankspaceRow" style="color:#666666;">' + 
								oRow.generaljournalitem_generaljournal_description + '</td>');

		aHTML.push('<td id="ns1blankspaceFinancialTransaction_financialaccount-' + oRow.id + '" style="color:#666666;" class="ns1blankspaceRow">' +
								oRow.financialaccounttext + '</td>');
							
		aHTML.push('<td id="ns1blankspaceFinancialTransaction_creditamount-' + oRow.id + '" style="text-align:right; color:#666666;" class="ns1blankspaceRow">' +
								oRow.creditamount + '</td>');

		aHTML.push('<td id="ns1blankspaceFinancialTransaction_debitamount-' + oRow.id + '" style="text-align:right; color:#666666;" class="ns1blankspaceRow">' +
								oRow.debitamount + '</td>');
																		
		aHTML.push('</td></tr>');

		return aHTML.join('');
	},

	bind: function()
	{
		$('#ns1blankspaceComplianceJournalsShow td.ns1blankspaceRowSelect:visible').click(function (event)
		{
			var iObjectContext = $(this).attr('data-id');
			ns1blankspace.financial.journal.init({id: iObjectContext});
		});	
	}	
}
