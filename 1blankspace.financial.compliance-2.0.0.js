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
		var sStartDate = ns1blankspace.util.getParam(oParam, 'startDate').value;
		var sEndDate = ns1blankspace.util.getParam(oParam, 'endDate').value;
		var bNoZero = ns1blankspace.util.getParam(oParam, 'noZero', {"default": false}).value;

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
				sStartDate = moment().subtract('year', 1).month('July').startOf('month').format('DD MMM YYYY');
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
				sEndDate = Date.today().toString("dd MMM yyyy");
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
						'Create PDF</span></td></tr>');	
		
		aHTML.push('</table>');					
		
		$('#ns1blankspaceComplianceColumn1').html(aHTML.join(''));

		$('input.ns1blankspaceDate').datepicker({dateFormat: ns1blankspace.option.dateFormat});

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
			label: 'Refresh',
			icons:
			{
				primary: "ui-icon-arrowrefresh-1-e"
			}
		})
		.click(function()
		{
			ns1blankspace.financial.compliance.init(
			{
				startDate: $('#ns1blankspaceComplianceStartDate').val(),
				endDate: $('#ns1blankspaceComplianceEndDate').val()
			});
		});

		$('#ns1blankspaceComplianceCreatePDF').button(
		{
			label: 'Create PDF'
		})
		.click(function(event)
		{
			var sHTML =  $('#ns1blankspaceComplianceColumn2').html();
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
				topmargin: 1,
				headerheight: 15,
				footerheight: 15,
				baseURLBody: sURL,
				object: 12,
				objectContext: ns1blankspace.spaceContactBusiness
			});
		});

		var aHTML = [];
		
		//Bank accounts

		aHTML.push('<div style="background-color:#f5f5f5; margin-bottom:16px; padding:12px;">');

			aHTML.push('<div style="color:#666666; font-weight:100; margin-bottom:2px; font-size:1.5em;">BANK ACCOUNTS</div>');
			aHTML.push('<div style="color:#666666; font-weight:100; margin-left:1px; margin-bottom:6px; font-size:0.75em;">Do the financal accounts (general ledger) totals match the totals at bank?</div>');
	
			aHTML.push('<div style="font-size: 0.875em;">');

			aHTML.push('<table>');

			aHTML.push('<tr><td class="ns1blankspaceHeaderCaption" style="vertical-align:bottom;">Name</td>' +
							'<td class="ns1blankspaceHeaderCaption" style="width:80px; text-align:right; vertical-align:bottom;">' + sStartDate + '</td>' +
							'<td class="ns1blankspaceHeaderCaption" style="width:80px; text-align:right; vertical-align:bottom;">' + sEndDate + '</td>' +
							'<td class="ns1blankspaceHeaderCaption" style="width:80px; text-align:right; vertical-align:bottom;">Difference</td>' +
							'<td class="ns1blankspaceHeaderCaption" style="text-align:center; vertical-align:bottom;">Reconciled</td>' +
							'<td class="ns1blankspaceHeaderCaption" style="text-align:center; vertical-align:bottom;">Transactions</td>')

			ns1blankspace.financial.data.bankaccounts.sort(ns1blankspace.util.sortBy('title'));

			$.each(ns1blankspace.financial.data.bankaccounts, function(b, bankAccount)
			{
				bankAccount.financialaccounttext = $.grep(ns1blankspace.financial.data.accounts, function (a) {return a.id == bankAccount.financialaccount})[0].title;
			});

			$.each($.grep(_.uniqBy(ns1blankspace.financial.data.bankaccounts, 'financialaccount'), function (b) {return b.status == 1}), function(b, bankAccount)
			{					
				aHTML.push('<tr><td class="ns1blankspaceRow" id="ns1blankspaceComplianceBankAccount-' +
										bankAccount.id + '"><div>' + bankAccount.title + '</div>' +
											'<div class="ns1blankspaceSubNote" id="ns1blankspaceComplianceBankAccount-' + bankAccount.id + '_financialaccount">' +
											bankAccount.financialaccounttext + '</div>' +
										'</td>' +
										'<td class="ns1blankspaceRow" id="ns1blankspaceComplianceBankAccount-' +
										bankAccount.id + '_start" style="width:80px; text-align:right; color:#666666; vertical-align:middle;">-</td>' +
										'<td class="ns1blankspaceRow" id="ns1blankspaceComplianceBankAccount-' +
										bankAccount.id + '_end" style="width:80px; text-align:right; color:#666666; vertical-align:middle;">-</td>' +
										'<td class="ns1blankspaceRow" id="ns1blankspaceComplianceBankAccount-' +
										bankAccount.id + '_difference" style="width:80px; text-align:right; color:#666666; vertical-align:middle;">-</td>' +
										'<td class="ns1blankspaceRow ns1blankspaceSubNote" id="ns1blankspaceComplianceBankAccount-' +
										bankAccount.id + '_lastreconciled" style="text-align:center;">' + (bankAccount.lastreconcileddate==''?'':bankAccount.lastreconcileddate) + '</td>' +
										'<td class="ns1blankspaceRow ns1blankspaceSubNote" style="width:110px; text-align:center;" id="ns1blankspaceComplianceBankAccount-' + bankAccount.id + '_transactions"></td>' +
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
			aHTML.push('<div style="color:#666666; font-weight:100; margin-left:1px; margin-bottom:6px; font-size:0.75em;">Has the correct amount of tax been paid, based on the GL transactions, as per <a href="https://www.business.gov.au/info/run/tax" target="_blank">the law</a>?</div>');

			aHTML.push('<div id="ns1blankspaceComplianceTaxShow" style="font-size: 0.875em;">' +
								ns1blankspace.xhtml.loadingSmall +
								'</div>');

		aHTML.push('</div>');	


		//Payroll & Super

		aHTML.push('<div style="background-color:#f5f5f5; margin-bottom:16px; padding:12px;">');
			aHTML.push('<div style="color:#666666; font-weight:100; margin-bottom:2px; font-size:1.5em;">SUPERANNUATION</div>');
			aHTML.push('<div style="color:#666666; font-weight:100; margin-left:1px; margin-bottom:6px; font-size:0.75em;">Has the correct amount of superannuation been paid, based on the GL transactions, as per <a href="https://www.ato.gov.au/business/super-for-employers/" target="_blank">the law</a>?</div>');
			aHTML.push('<div id="ns1blankspaceComplianceSuperannuationShow" style="font-size: 0.875em;">' +
								ns1blankspace.xhtml.loadingSmall +
								'</div>');
		aHTML.push('</div>');


		//Transactions

		aHTML.push('<div style="background-color:#f5f5f5; margin-bottom:16px; padding:12px;">');
			aHTML.push('<div style="color:#666666; font-weight:100; margin-bottom:6px; font-size:1.5em;">TRANSACTIONS</div>');
			aHTML.push('<div style="color:#666666; font-weight:100; margin-left:1px; margin-bottom:6px; font-size:0.75em;">Search for financial accounts (general ledger) transactions and export.</div>');
		
			//Search
			aHTML.push('<div>' +
					'<input id="ns1blankspaceComplianceTransactionsSearch" class="ns1blankspaceText" data-1blankspace="ignore" style="width:50%;">' +
					'</div>');

			aHTML.push('<div id="ns1blankspaceComplianceTransactionsShow" style="font-size: 0.875em;" data-filename="compliance-transactions.csv">' +
								ns1blankspace.xhtml.loadingSmall +
								'</div>');

			aHTML.push('<div id="ns1blankspaceComplianceTransactionsShow" style="margin-top:12px;">' +
								'<span class="ns1blankspaceAction" id="ns1blankspaceComplianceTransactionsExport">' +
										'Export</span>' +
								'</div>');

		aHTML.push('</div>');	

			
		$('#ns1blankspaceComplianceColumn2').html(aHTML.join(''));

		$('#ns1blankspaceComplianceTransactionsExport').button(
		{
			label: 'Export'
		})
		.click(function(event)
		{
			ns1blankspace.financial.compliance.export.transactions({xhtmlElementID: 'ns1blankspaceComplianceTransactionsShow'})
		});

		ns1blankspace.financial.compliance.initData.balanceSheet(oParam);
	},

	initData:
	{
		balanceSheet: function (oParam, oResponse)
		{
			var sStartDate = ns1blankspace.util.getParam(oParam, 'startDate').value;
			var sEndDate = ns1blankspace.util.getParam(oParam, 'endDate').value;

			if (oResponse == undefined)
			{
				ns1blankspace.status.working();

				var oData = 
				{
					rows: 500
				}

				if (sStartDate != undefined)
				{
					oData.endDate0 = sStartDate;
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
				ns1blankspace.status.clear();
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
				ns1blankspace.status.working();

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
				ns1blankspace.status.clear();
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

				ns1blankspace.financial.compliance.initData.debtors(oParam);
			}
		},

		debtors: function (oParam, oResponse)
		{
			var sEndDate = ns1blankspace.util.getParam(oParam, 'endDate').value;
			var iProject = ns1blankspace.util.getParam(oParam, 'project').value;
			
			if (oResponse == undefined)
			{			
				var oSearch = new AdvancedSearch();
				oSearch.method = 'FINANCIAL_DEBTOR_SEARCH';
				oSearch.rows = 100;

				if (sEndDate != '') {oSearch.addFilter('enddate', 'LESS_THAN_OR_EQUAL_TO', sEndDate)};

				oSearch.getResults(function(data) {ns1blankspace.financial.compliance.initData.debtors(oParam, data)});
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
				var oSearch = new AdvancedSearch();
				oSearch.method = 'FINANCIAL_CREDITOR_SEARCH';
				oSearch.rows = 100;

				if (sEndDate != '') {oSearch.addFilter('enddate', 'LESS_THAN_OR_EQUAL_TO', sEndDate)};

				oSearch.getResults(function(data) {ns1blankspace.financial.compliance.initData.creditors(oParam, data)});
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
			ns1blankspace.financial.compliance.show.bankAccounts(oParam);
			ns1blankspace.financial.compliance.profitLoss.show(oParam);
			ns1blankspace.financial.compliance.debtors.show(oParam);
			ns1blankspace.financial.compliance.creditors.show(oParam);
			ns1blankspace.financial.compliance.balanceSheet.show(oParam);
			ns1blankspace.financial.compliance.tax.show(oParam);
			ns1blankspace.financial.compliance.superannuation.show(oParam);
			ns1blankspace.financial.compliance.transactions.show(oParam);
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
							{field: 'description'},
							{field: 'amount'},
							{field: 'objecttext'},
							{field: 'reference'}
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

		if (ns1blankspace.financial.compliance.data.transactions.length == 0)
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

			aHTML.push('<table>');

			aHTML.push('<tr><td class="ns1blankspaceRow">Sales</td>' +
									'<td class="ns1blankspaceRow" style="text-align:right;">' + numeral(profitLoss.totalsales).format('0,0.00') + '</td></tr>');

			aHTML.push('<tr><td class="ns1blankspaceRow">Cost of Sales</td>' +
									'<td class="ns1blankspaceRow" style="text-align:right;">' + numeral(profitLoss.totalcostofsales).format('0,0.00') + '</td></tr>');

			aHTML.push('<tr><td class="ns1blankspaceRow">Gross Margin</td>' +
									'<td class="ns1blankspaceRow" style="text-align:right;">' + numeral(profitLoss.grossmargin).format('0,0.00') + '</td></tr>');

			aHTML.push('<tr><td class="ns1blankspaceRow">Expenses</td>' +
									'<td class="ns1blankspaceRow" style="text-align:right;">' + numeral(profitLoss.totaloperationalexpenses).format('0,0.00') + '</td></tr>');
		
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
								'<td class="ns1blankspaceHeaderCaption" style="padding:6px; text-align:center; font-size:1.2em;">Difference</td></tr>' +
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

			aHTML.push('<tr><td class="ns1blankspaceRow ns1blankspaceSub">Accounts Receivable</td>' +
								'<td class="ns1blankspaceRow ns1blankspaceSub" style="text-align:right;">' + numeral(ns1blankspace.financial.compliance.data.debtors.end.data.totals.total).format('0,0.00') + '</td></tr>');

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
								'<td class="ns1blankspaceHeaderCaption" style="padding:6px; text-align:center; font-size:1.2em;">Difference</td></tr>' +
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

			aHTML.push('<tr><td class="ns1blankspaceRow ns1blankspaceSub">Accounts Payable</td>' +
								'<td class="ns1blankspaceRow ns1blankspaceSub" style="text-align:right;">' + numeral(ns1blankspace.financial.compliance.data.creditors.end.data.totals.total).format('0,0.00') + '</td></tr>');

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
								'<td class="ns1blankspaceHeaderCaption" style="padding:6px; text-align:center; font-size:1.2em;">Difference</td></tr>' +
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

			var taxTotalPayable = $.grep(ns1blankspace.financial.compliance.data.transactions.data.rows, function (row)
			{
				return row.financialaccount == ns1blankspace.financial.data.settings.taxreportfinancialaccountpayable;
			})[0].total;

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

			aHTML.push('<tr><td class="ns1blankspaceRow">Tax Payable</td>' +
									'<td class="ns1blankspaceRow" style="text-align:right;">' + numeral(taxTotalPayable).format('0,0.00') + '</td></tr>');

			aHTML.push('<tr><td class="ns1blankspaceRow ns1blankspaceSub">Sales</td>' +
									'<td class="ns1blankspaceRow ns1blankspaceSub" style="text-align:right;">' + numeral(ns1blankspace.financial.compliance.data.profitLoss.totalsales).format('0,0.00') + '</td></tr>');

			aHTML.push('<tr><td class="ns1blankspaceRow ns1blankspaceSub">Expenses</td>' +
									'<td class="ns1blankspaceRow ns1blankspaceSub" style="text-align:right;">' + numeral(ns1blankspace.financial.compliance.data.profitLoss.totaloperationalexpenses).format('0,0.00') + '</td></tr>');

			aHTML.push('<tr><td class="ns1blankspaceRow">Sales (that collected GST)</td>' +
									'<td class="ns1blankspaceRow" style="text-align:right;">' + taxSalesTotal.format('0,0.00') + '</td></tr>');

			aHTML.push('<tr><td class="ns1blankspaceRow">Expenses (that included GST)</td>' +
									'<td class="ns1blankspaceRow" style="text-align:right;">' + taxExpensesTotal.format('0,0.00') + '</td></tr>');

			aHTML.push('<tr><td class="ns1blankspaceRow">Margin (that related to GST)</td>' +
									'<td class="ns1blankspaceRow" style="text-align:right;">' + numeral(taxSalesTotal.value() - taxExpensesTotal.value()).format('0,0.00') + '</td></tr>');
		
			aHTML.push('</table>');

			$('#ns1blankspaceComplianceTaxShowVAT').html(aHTML.join(''));

			//Employees

			var aHTML = [];

			aHTML.push('<table>');

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

			aHTML.push('<tr><td class="ns1blankspaceRow">Tax Payable</td>' +
									'<td class="ns1blankspaceRow" style="text-align:right;">' + numeral(sTaxTotalPayable).format('0,0.00') + '</td></tr>');

			aHTML.push('<tr><td class="ns1blankspaceRow">Expenses (that related to payroll)</td>' +
									'<td class="ns1blankspaceRow" style="text-align:right;">' + taxExpensesTotal.format('0,0.00') + '</td></tr>');
		
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

			aHTML.push('<tr><td class="ns1blankspaceRow">Salary</td>' +
									'<td class="ns1blankspaceRow" style="text-align:right;">' + numeral(sSalaryTotal).format('0,0.00') + '</td></tr>');

			if (ns1blankspace.financial.data.settings.payrollfinancialaccountallowance != ns1blankspace.financial.data.settings.payrollfinancialaccountsalary)
			{
				aHTML.push('<tr><td class="ns1blankspaceRow">Allowances</td>' +
									'<td class="ns1blankspaceRow" style="text-align:right;">' + numeral(sAllowanceTotal).format('0,0.00') + '</td></tr>');
			}	

			aHTML.push('<tr><td class="ns1blankspaceRow">Superannuation</td>' +
									'<td class="ns1blankspaceRow" style="text-align:right;">' + numeral(sSuperannuationTotal).format('0,0.00') + '</td></tr>');
		
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
		var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {"default": 'ns1blankspaceComplianceTransactionsShow'}).value;
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
				//$('#' + sXHTMLElementID.replace('-transactions-', '-export-')).hide();
				
				aHTML.push('<table><tbody>' +
								'<tr class="ns1blankspace">' +
								'<td class="ns1blankspaceNothing">No financial transactions.</td>' +
								'</tr>' +
								'</tbody></table>');

				$('#' + sXHTMLElementID).html(aHTML.join(''));

			}
			else
			{
				aHTML.push('<table class="ns1blankspace">');

				aHTML.push('<tr class="ns1blankspaceHeaderCaption">');

				if (iFinancialAccount == undefined)
				{
					aHTML.push('<td class="ns1blankspaceHeaderCaption" style="width:150px;">Account</td>');
				}

				aHTML.push('<td class="ns1blankspaceHeaderCaption" style="width:75px; text-align:right;">Date</td>' +
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
								
		aHTML.push('<td id="ns1blankspaceFinancialTransaction_date-' + oRow.id + '" class="ns1blankspaceRow" style="color:#666666; text-align:right;">' +
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
		$('#ns1blankspaceComplianceTransactionsSearch').unbind('keyup').keyup(function(event)
		{
			if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
	        ns1blankspace.timer.delayCurrent = setTimeout('ns1blankspace.financial.compliance.transactions.show()', ns1blankspace.option.typingWait);
		});

		$('div[data-object]').click(function (event)
		{
			var iObject = $(this).attr('data-object');
			var iObjectContext = $(this).attr('data-objectcontext');
			var sNamespace = _.toLower(_.find(ns1blankspace.financial.data.objects, function (object) {return object.id == iObject}).name);

			ns1blankspace.financial[sNamespace].init({id: iObjectContext});
		});	
	}	
}

