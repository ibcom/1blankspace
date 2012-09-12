/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */

function interfaceFinancialPayrollMasterViewport(aParam)
{
	interfaceFinancialMasterInitialise();
	
	var bShowHome = true
	
	if (aParam != undefined)
	{
		if (aParam.showHome != undefined) {bShowHome = aParam.showHome}	
	}

	giObject = -1;
	goObjectContext = undefined;
	gsObjectName = 'Payroll';
	giObjectContext = -1;
	
	if (bShowHome)
	{
		interfaceMasterViewportDestination({
			newDestination: 'interfaceFinancialPayrollMasterViewport({showHome: true});',
			move: false
			})		
	}	
			
	interfaceMasterReset();
	
	$('#divInterfaceMasterViewportControlSet').button(
	{
		label: "Payroll"
	});
	
	$('#inputInterfaceMasterViewportControlSearch').keyup(function(event)
	{
		if (giKeyPressTimeoutId != 0) {clearTimeout(giKeyPressTimeoutId)};
        giKeyPressTimeoutId = setTimeout("interfaceFinancialPayrollSearch('inputInterfaceMasterViewportControlSearch')", giWaitForStop);
	});
	
	$('#spanInterfaceMasterViewportControlSearch').click(function(event)
	{
		interfaceFinancialPayrollSearch('inputInterfaceMasterViewportControlSearch');
	});
	
	$('#spanInterfaceMasterViewportControlSearchOptions').click(function(event)
	{
		interfaceFinancialPayrollSearchOptions();
	});
	
	$('#spanInterfaceMasterViewportControlNew').click(function(event)
	{
		interfaceFinancialPayrollNew();
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
	if (bShowHome) {interfaceFinancialPayrollHomeShow()};	
}

function interfaceFinancialPayrollHomeShow(aParam, oResponse)
{		
	if (oResponse == undefined)
	{
		var aHTML = [];
		var h = -1;
					
		aHTML[++h] = '<table id="tableInterfaceViewportMain" class="interfaceViewportMain">';
		aHTML[++h] = '<tr id="trInterfaceViewportMain" class="interfaceViewportMain">' +
						'<td id="tdInterfaceProjectHomeMostLikely" class="interfaceViewportMain">' +
						gsLoadingXHTML + 
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMain').html(aHTML.join(''));
		
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
		
		aHTML[++h] = '<tr id="trInterfaceViewportControlPayRuns" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlPayRuns" class="interfaceViewportControl interfaceViewportControlHighlight">Pay Runs</td>' +
						'</tr>';
						
		aHTML[++h] = '<tr id="trInterfaceViewportControlEmployees" class="interfaceViewportControl">' +
						'<td id="tdInterfaceViewportControlEmployees" class="interfaceViewportControl">Employees</td>' +
						'</tr>';	
							
		aHTML[++h] = '</table>';
	
		$('#divInterfaceViewportControl').html(aHTML.join(''));	
		
		$('#tdInterfaceViewportControlPayRuns').click(function(event)
		{
			interfaceMasterMainViewportShow("#divInterfaceMainPayRun");
			interfaceFinancialPayrollHomeShow();
		});
	
		$('#tdInterfaceViewportControlEmployees').click(function(event)
		{
			interfaceMasterMainViewportShow("#divInterfaceMainEmployee");
			interfaceFinancialPayrollEmployees();
		});
		
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<div id="divInterfaceMainPayRun" class="divInterfaceViewportMain"></div>';
		aHTML[++h] = '<div id="divInterfaceMainEmployee" class="divInterfaceViewportMain"></div>';
	
		$('#divInterfaceMain').html(aHTML.join(''));
	
		$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
		
		var oSearch = new AdvancedSearch();
		oSearch.method = 'FINANCIAL_PAYROLL_PAY_PERIOD_SEARCH';
		oSearch.addField('startdate,paydate,statustext');
		oSearch.rows = 10;
		oSearch.sort('paydate', 'desc');
		oSearch.getResults(function(data){interfaceFinancialPayrollHomeShow(aParam, data)});		
	}
	else
	{
		var aHTML = [];
		var h = -1;

		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableInterfaceFinancialPayrollHomeMostLikely">';
			aHTML[++h] = '<tr class="trInterfaceFinancialPayrollHomeMostLikelyNothing">';
			aHTML[++h] = '<td class="tdInterfaceFinancialPayrollHomeMostLikelyNothing">Click New to create a invoice.</td>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</table>';
		}
		else
		{	
			aHTML[++h] = '<table id="tableFinancialPayroll" border="0" cellspacing="0" cellpadding="6" class="interfaceMain">';
			aHTML[++h] = '<tbody>'
		
			$.each(oResponse.data.rows, function()
			{
				aHTML[++h] = '<tr class="interfaceMainRow">';
						
				aHTML[++h] = '<td id="tdPayroll_paydate-' + this.id + '" class="interfaceHomeMostLikely" style="width:150px;">' +
										this["paydate"] + '</td>';
				
				aHTML[++h] = '<td id="interfacePayroll_lastreconcileddate-' + this.id + '" class="interfaceHomeMostLikelySub">' +
											this.statustext + '</td>';
																			
				aHTML[++h] = '</tr>';
			});
	
			aHTML[++h] = '</tbody></table>';
		}
	
		$('#divInterfaceMainPayRun').html(aHTML.join(''));

		$('.interfaceHomeMostLikely').click(function(event) {
			interfaceFinancialPayrollSearch(event.target.id, {source: 1});
		});
	}	
}

function interfaceFinancialPayrollSearch(sXHTMLElementId, aParam)
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
	
	if (sSearchContext != undefined  && iSource != giSearchSource_BROWSE)
	{
		$('#divInterfaceViewportControl').html(gsLoadingXHTML);
		
		giObjectContext = sSearchContext;
		
		var oSearch = new AdvancedSearch();
		oSearch.method = 'FINANCIAL_PAYROLL_PAY_PERIOD_SEARCH';
		oSearch.addField('startdate,paydate,statustext,status,notes,modifieddate');
		oSearch.addFilter('id', 'EQUAL_TO', sSearchContext);
		
		oSearch.getResults(function(data) {interfaceFinancialPayrollShow(aParam, data)});
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
			var aSearch = sSearch.split('-');
			sSearchText = aSearch[1];
		}
		
		if (sSearchText.length >= iMinimumLength || iSource == giSearchSource_BROWSE)
		{
			interfaceMasterOptionsSetPosition(sElementId);
			
			var oSearch = new AdvancedSearch();
			oSearch.method = 'FINANCIAL_PAYROLL_PAY_PERIOD_SEARCH';
			oSearch.addField('notes,paydate');
			oSearch.addFilter('notes', 'TEXT_IS_LIKE', sSearchText);
			
			oSearch.getResults(function(data) {interfaceFinancialPayrollSearchShow(aParam, data)});	
		}
	};	
}

function interfaceFinancialPayrollSearchShow(aParam, oResponse)
{

	var iColumn = 0;
	var aHTML = [];
	var h = -1;
	var	iMaximumColumns = 1;
		
	if (oResponse.data.rows.length == 0)
	{
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
		
			aHTML[++h] = '<td class="interfaceSearch" id="' + +
							'-' + this.id + '">' +
							this.notes +
							'</td>';
			
			if (iColumn == iMaximumColumns)
			{
				aHTML[++h] = '</tr>'
				iColumn = 0;
			}	
		});
    	
		aHTML[++h] = '</tbody></table>';

		$('#divInterfaceMasterViewportControlOptions').html(aHTML.join(''));
		$('#divInterfaceMasterViewportControlOptions').show(giShowSpeedOptions);
		
		$('td.interfaceSearch').click(function(event)
		{
			$('#divInterfaceMasterViewportControlOptions').html('&nbsp;');
			$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions)
			interfaceFinancialPayrollSearch(event.target.id, {source: 1});
		});
	}		
}

function interfaceFinancialPayrollViewport()
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
					'<td id="tdInterfaceViewportControlDetails" class="interfaceViewportControl">Details</td>' +
					'</tr>';
	
	aHTML[++h] = '<tr id="trInterfaceViewportControlItem" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlPays" class="interfaceViewportControl">Pays</td>' +
					'</tr>';

	aHTML[++h] = '</table>';					
			
	$('#divInterfaceViewportControl').html(aHTML.join(''));
	
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceMainContext" class="divInterfaceViewportMainContext"></div>';
	aHTML[++h] = '<div id="divInterfaceMainSummary" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainDetails" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainPays" class="divInterfaceViewportMain"></div>';
	
	$('#divInterfaceMain').html(aHTML.join(''));
	
	$('#tdInterfaceViewportControlSummary').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainSummary");
		interfaceFinancialPayrollSummary();
	});
	
	$('#tdInterfaceViewportControlDetails').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainDetails");
		interfaceFinancialPayrollDetails();
	});
	
	$('#tdInterfaceViewportControlPays').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainPays", true);
		interfaceFinancialPayrollPays();
	});
}

function interfaceFinancialPayrollShow(aParam, oResponse)
{	
	$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
	interfaceFinancialPayrollViewport();
		
	var aHTML = [];
	var h = -1;
	
	if (oResponse.data.rows.length == 0)
	{
		goObjectContext = undefined;
			
		aHTML[++h] = '<table><tbody><tr><td valign="top">Sorry can\'t find this pay period.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
			
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		goObjectContext = oResponse.data.rows[0];
			
		$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
			
		$('#divInterfaceViewportControlContext').html(goObjectContext.paydate +
			'<br /><span class="interfaceViewportControlSubContext" id="spanInterfaceViewportControlSubContext_status">' + goObjectContext.statustext + '</span>');
		
		interfaceMasterViewportDestination({
			newDestination: 'interfaceFinancialPayrollMasterViewport({showHome: false});interfaceFinancialPayrollSearch("-' + giObjectContext + '")',
			move: false
			})
	
		interfaceMasterObjectViewportHistory({functionDefault: 'interfaceFinancialPayrollSummary()'});
	}		
}	

function interfaceFinancialPayrollSummary(aParam, oResponse)
{
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<table id="tableInterfaceMainSummary" class="interfaceMain">';
	aHTML[++h] = '<tr id="trInterfaceMainSummaryRow1" class="interfaceMainRow1">' +
				'<td id="tdInterfaceMainSummaryColumn1Large" class="interfaceMainColumn1Large">' +
					'</td>' +
					'<td id="tdInterfaceMainSummaryColumn2Action" style="width:150px;" class="interfaceMainColumn2">' +
					'</td>' +
					'</tr>';
	aHTML[++h] = '</table>';				

	$('#divInterfaceMainSummary').html(aHTML.join(''));	

	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMainColumn1">';
					
	aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryStartDate" class="interfaceMainSummary">Start Date</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryStartDateValue" class="interfaceMainSummaryValue">' +
						goObjectContext.startdate +
						'</td></tr>';		
										
	aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryPayDate" class="interfaceMainSummary">Pay Date</td></tr>' +
						'<tr><td id="tdInterfaceMainSummaryPayDateValue" class="interfaceMainSummaryValue">' +
						goObjectContext.paydate +
						'</td></tr>';		
	
	aHTML[++h] = '</table>';					

	$('#tdInterfaceMainSummaryColumn1Large').html(aHTML.join(''));

	var aHTML = [];
	var h = -1;	
	
	aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMainColumn2" style="width: 100%">';
	
	if (goObjectContext.statustext != '')
	{	
		aHTML[++h] = '<tr><td class="interfaceMainSummary" style="padding-bottom:10px;">' +
					goObjectContext.statustext +
					'</td></tr>';				
	}
	
	if (goObjectContext.status == 1)
	{	
		aHTML[++h] = '<tr><td>' +
					'<span style="font-size:0.75em;" id="spanInterfaceMainStatusComplete" class="orderAction">Complete</span>' +
					'</td></tr>';			
	}
	
	aHTML[++h] = '</table>';					
	
	$('#tdInterfaceMainSummaryColumn2Action').html(aHTML.join(''));	

	$('#spanInterfaceMainStatusComplete').button(
	{
	})
	.click(function()
		{
			$.ajax(
			{
				type: 'POST',
				url: interfaceMasterEndpointURL('FINANCIAL_PAYROLL_PAY_PERIOD_MANAGE'),
				data: 'status=2&id=' + giObjectContext,
				dataType: 'json',
				success: function() {interfaceFinancialPayrollSearch('-' + giObjectContext)}
			});
	});
		
}

function interfaceFinancialPayrollDetails(aParam)
{	
	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<table class="interfaceMain" cellspacing=0 cellpadding=0>' +
			'<tr>' +
			'<td id="tdInterfaceMainDetails" style="padding-right:15px;width:200px;">' +
			'</td>' +
			'<td id="tdInterfaceMainDetails2" class="interfaceMainColumn2x">&nbsp;' +
			'</td>' +
			'</tr>' +
			'</table>';			

	$('#divInterfaceMainDetails').html(aHTML.join(''));
		
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<table class="interfaceMain">';
	
	aHTML[++h] = '<tr class="interfaceMain">' +
					'<td class="interfaceMain">' +
					'Start Date' +
					'</td></tr>' +
					'<tr class="interfaceMainText">' +
					'<td class="interfaceMainText">' +
					'<input id="inputInterfaceMainDetailsStartDate" class="inputInterfaceMainDate">' +
					'</td></tr>';	

	aHTML[++h] = '<tr class="interfaceMain">' +
					'<td class="interfaceMain">' +
					'End Date' +
					'</td></tr>' +
					'<tr class="interfaceMainText">' +
					'<td class="interfaceMainText">' +
					'<input id="inputInterfaceMainDetailsPayDate" class="inputInterfaceMainDate">' +
					'</td></tr>';	
						
	aHTML[++h] = '<tr class="interfaceMain">' +
					'<td class="interfaceMain">' +
					'Status' +
					'</td></tr>' +
					'<tr>' +
					'<td class="interfaceMainRadio">' +
					'<input type="radio" id="radioStatus1" name="radioStatus" value="1"/>In Progress' +
					'<br /><input type="radio" id="radioStatus2" name="radioStatus" value="2"/>Completed' +
					'</td></tr>';
																																		
	aHTML[++h] = '</table>';					
	
	$('#tdInterfaceMainDetails').html(aHTML.join(''));
	
	$('input.inputInterfaceMainDate').datepicker({dateFormat: 'dd M yy'});

	if (goObjectContext != undefined)
	{
		$('#inputInterfaceMainDetailsStartDate').val(goObjectContext.startdate);
		$('#inputInterfaceMainDetailsPayDate').val(goObjectContext.paydate);
		$('[name="radioStatus"][value="' + goObjectContext.status + '"]').attr('checked', true);
		$('#inputInterfaceMainDetailsNotes').val(goObjectContext.notes);	
	}
	else
	{
		$('[name="radioStatus"][value="1"]').attr('checked', true);
	}
}

function interfaceFinancialPayrollEmployees(aParam, oResponse)
{
	
	var iStep = 1;
	var iEmployee;
	
	if (aParam != undefined)
	{
		if (aParam.step != undefined) {iStep = aParam.step};
		if (aParam.employee != undefined) {iEmployee = aParam.employee};
	}
	else
	{
		aParam = {};
	}
	
	if (iStep == 1)	
	{
		var aHTML = [];
		var h = -1;
			
		aHTML[++h] = '<table class="interfaceMainAccount" cellspacing=0 cellpadding=0>' +
				'<tr id="trInterfaceMainPayrollEmployeeRow1" class="interfaceMainRow1">' +
				'<td id="tdInterfaceMainPayrollEmployeeColumn1" style="width:125px;font-size:0.875em;padding-right:10px;">' +
				'</td>' +
				'<td id="tdInterfaceMainPayrollEmployeeColumn2" class="interfaceMainColumn2">' +
				'</td>' +
				'</tr>' +
				'</table>';			
		
		$('#divInterfaceMainEmployee').html(aHTML.join(''));
		
		if (oResponse == undefined)
		{
			var oSearch = new AdvancedSearch();
			oSearch.method = 'FINANCIAL_PAYROLL_EMPLOYEE_SEARCH';
			oSearch.addField('contactpersontext,employmentstartdate,statustext,employee.contactperson.firstname,employee.contactperson.surname');
			oSearch.addFilter('status', 'EQUAL_TO', '2')
			oSearch.rows = 50;
			oSearch.sort('employee.contactperson.firstname', 'asc');
			oSearch.getResults(function(data) {interfaceFinancialPayrollEmployees(aParam, data)});
		}
		else
		{
			var aHTML = [];
			var h = -1;
		
			if (oResponse.data.rows.length == 0)
			{
				aHTML[++h] = '<table id="tableInterfaceFinancialHomeMostLikely">';
				aHTML[++h] = '<tr class="trInterfaceFinancialHomeMostLikelyNothing">';
				aHTML[++h] = '<td class="tdInterfaceFinancialHomeMostLikelyNothing">No employees set up.</td>';
				aHTML[++h] = '</tr>';
				aHTML[++h] = '</table>';
			}
			else
			{
				aHTML[++h] = '<table cellpadding=6>';
				aHTML[++h] = '<tbody>'
			
				var oRows = oResponse.data.rows;
			
				$(oRows).each(function() 
				{
					aHTML[++h] = interfaceFinancialPayrollEmployeesRow(this);
				});
			
				aHTML[++h] = '</tbody></table>';
			}
		
			interfaceMasterPaginationList(
			{
				type: 'JSON',
				xhtmlElementID: 'tdInterfaceMainPayrollEmployeeColumn1',
				xhtmlContext: 'PayrollEmployees',
				xhtml: aHTML.join(''),
				showMore: (oResponse.morerows == "true"),
				more: oResponse.moreid,
				rows: 50,
				functionShowRow: interfaceFinancialPayrollEmployeesRow,
				functionOpen: undefined,
				functionNewPage: ''
		   	}); 
			
			$('.employee').click(function() {
				$('.Highlight').removeClass('Highlight');
				$('#' + event.target.id).addClass('Highlight');
				var aID = (event.target.id).split('-');
				$.extend(true, aParam, {step: 2, employee: parseInt(aID[1])});
				interfaceFinancialPayrollEmployees(aParam);
			});	
		}
	}
	
	if (iStep == 2)
	{
		if (oResponse == undefined)
		{
			$('#tdInterfaceMainPayrollEmployeeColumn2').html(gsLoadingSmallXHTML);
			
			var oSearch = new AdvancedSearch();
			oSearch.method = 'FINANCIAL_PAYROLL_EMPLOYEE_SEARCH';
			oSearch.addField('*');
			oSearch.rows = 50;
			oSearch.addFilter('id', 'EQUAL_TO', iEmployee);
			oSearch.getResults(function(data) {interfaceFinancialPayrollEmployees(aParam, data)});
		}
		else
		{
			ns1blankspace.financial.employee = oResponse.data.rows[0];
		
			var aHTML = [];
			var h = -1;
			
			aHTML[++h] = '<table class="interfaceMainPayrollEmployeeDetails" cellspacing=0 cellpadding=0>' +
					'<tr id="trInterfaceMainPayrollEmployeeDetailsRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainPayrollEmployeeDetailsColumn1" style="width:50px;font-size:0.875em;padding-right:10px;">' +
					'</td>' +
					'<td id="tdInterfaceMainPayrollEmployeeDetailsColumn2" class="interfaceMainColumn2">' +
					'</td>' +
					'</tr>' +
					'</table>';			
		
			$('#tdInterfaceMainPayrollEmployeeColumn2').html(aHTML.join(''));
			
			var aHTML = [];
			var h = -1;

			aHTML[++h] = '<table cellpadding=6>';

			aHTML[++h] = '<tr class="interfaceMainRow">';		
			aHTML[++h] = '<td id="interfaceFinancialEmployee_details-11" class="interfaceMainRow interfaceMainRowSelect employeedetails">' +
									'Details</td>';
			aHTML[++h] = '</tr>';

			aHTML[++h] = '<tr class="interfaceMainRow">';
			aHTML[++h] = '<td id="interfaceFinancialEmployee_details-12" class="interfaceMainRow interfaceMainRowSelect employeedetails">' +
									'Payroll</td>';																					
			aHTML[++h] = '</tr>';

			aHTML[++h] = '</table>';

			$('#tdInterfaceMainPayrollEmployeeDetailsColumn1').html(aHTML.join(''));
	
			//$('#interfaceMainPayrollEmployeeDetails').buttonset().css('font-size', '0.8em');
		
			$('.employeedetails').click(function()
			{
				var aID = (event.target.id).split('-');
				$.extend(true, aParam, {step: parseInt(aID[1])});
				interfaceFinancialPayrollEmployees(aParam);
			});
		}
	}
	
	if (iStep == 11)
	{
		var aHTML = [];
		var h = -1;
			
		aHTML[++h] = '<table id="tableInterfaceMainEmployeeDetails" class="interfaceMain">';
		
		aHTML[++h] = '<tr id="trInterfaceMainEmployeeDetailsStatus" class="interfaceMain">' +
						'<td id="tdInterfaceMainEmployeeDetailsStatus" class="interfaceMain">' +
						'Status' +
						'</td></tr>' +
						'<tr id="trInterfaceMainEmployeeDetailsStatus" class="interfaceMainText">' +
						'<td id="tdInterfaceMainEmployeeDetailsStatusValue" class="interfaceMainRadio" style="height:33px;">' +
						'<input type="radio" id="radioStatus1" name="radioStatus" value="1"/>Proposed' +
						'&nbsp;&nbsp;<input type="radio" id="radioStatus2" name="radioStatus" value="2"/>Active' +
						'&nbsp;&nbsp;<input type="radio" id="radioStatus3" name="radioStatus" value="3"/>In-active' +
						'</td></tr>';
		
		aHTML[++h] = '<tr id="trInterfaceMainEmployeeDetailsNotes" class="interfaceMain">' +
						'<td id="tdInterfaceMainEmployeeDetailsNotes" class="interfaceMain">' +
						'Notes' +
						'</td></tr>' +
						'<tr id="trInterfaceMainEmployeeDetailsNotesValue" class="interfaceMainTextMulti">' +
						'<td id="tdInterfaceMainEmployeeDetailsNotesValue" class="interfaceMainTextMulti">' +
						'<textarea rows="10" cols="35" id="inputInterfaceMainDetailsNotes" class="inputInterfaceMainTextMulti"></textarea>' +
						'</td></tr>';
		
		aHTML[++h] = '</table>';					
			
		$('#tdInterfaceMainPayrollEmployeeDetailsColumn2').html(aHTML.join(''));

		if (ns1blankspace.financial.employee != undefined)
		{
			$('[name="radioStatus"][value="' + ns1blankspace.financial.employee.status + '"]').attr('checked', true);
			$('#inputInterfaceMainEmployeeDetailsNotes').val(ns1blankspace.financial.employee.description);
		}
		else
		{
			$('[name="radioStatus"][value="1"]').attr('checked', true);
		}
	}
	
	if (iStep == 13)
	{
		$('#tdInterfaceMainPayrollEmployeeDetailsColumn2').html('FINANCIAL_PAYROLL_EMPLOYEE_PAYRATE_SEARCH');
	}
	
	if (iStep == 14)
	{
		$('#tdInterfaceMainPayrollEmployeeDetailsColumn2').html('FINANCIAL_PAYROLL_EMPLOYEE_BANK_ACCOUNT_SEARCH');
	}	
}

function interfaceFinancialPayrollEmployeesRow(oRow)
{
	var aHTML = [];
	var h = -1;

	if (oRow.contactpersontext != '')
	{
		aHTML[++h] = '<tr class="interfaceMainRow">';
				
		aHTML[++h] = '<td id="interfaceFinancialHomeMostLikely_Contact-' + oRow.id + '" class="interfaceMainRow interfaceMainRowSelect employee">' +
								oRow["employee.contactperson.firstname"] + ' ' + oRow["employee.contactperson.surname"] + '</td>';
	
		aHTML[++h] = '</tr>'
	}

	return aHTML.join('');
}

function interfaceFinancialPayrollNew()
{
	$.ajax(
	{
		type: 'POST',
		url: interfaceMasterEndpointURL('FINANCIAL_PAYROLL_PAY_PROCESS'),
		data: 'type=1',
		dataType: 'json',
		success: function(data) {
			if (data.status == 'OK')
			{	
				giObjectContext = data.period;
				interfaceFinancialPayrollSearch('-' + giObjectContext);
			}	
		}
	});
}

function interfaceFinancialPayrollPays(aParam, oResponse)
{
	var iStep = 1;
	var iEmployee;
	var iPay;
	var sEmployeeText;

	if (aParam != undefined)
	{
		if (aParam.step != undefined) {iStep = aParam.step};
		if (aParam.employee != undefined) {iEmployee = aParam.employee};
		if (aParam.pay != undefined) {iPay = aParam.pay};
		if (aParam.employeeText != undefined) {sEmployeeText = aParam.employeeText};
	}
	else
	{
		aParam = {};
	}	
	if (iStep == 1)
	{
		var aHTML = [];
		var h = -1;	
						
		aHTML[++h] = '<table class="interfaceMain">' +
					'<tr class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainFinancialPayrollColumnList" style="width:150px;padding-right:5px;font-size:0.875em;" class="interfaceMainColumnX">' +
					gsLoadingXHTML + '</td>' +
					'<td id="tdInterfaceMainFinancialPayrollColumnPay" style="width:200px;padding-right:5px;font-size:0.875em;" class="interfaceMainColumn2">' +
					'</td>' +
					'<td id="tdInterfaceMainFinancialPayrollColumnItem" style="width:280px;padding-right:15px;font-size:0.875em;" class="interfaceMainColumn2">' +
					'</td>' +
					'<td id="tdInterfaceMainFinancialPayrollColumnAction" class="interfaceMainColumn2">' +
					'</td>' +
					'</tr>' +
					'</table>';			
				
		$('#divInterfaceMainPays').html(aHTML.join(''));
		
		if (oResponse == undefined)
		{
			$('#tdInterfaceMainFinancialPayrollColumnList').html(gsLoadingSmallXHTML);
			$('#tdInterfaceMainFinancialPayrollColumnItem').html("");

			var aHTML = [];
			var h = -1;	
			
			aHTML[++h] = '<table id="tableInterfaceMainFinancialPayrollColumnAction" class="interfaceMainColumn2">';
			aHTML[++h] = '<tr><td id="tdInterfaceMainFinancialPayrollAdd" class="interfaceMainAction">' +
							'<span id="spanInterfaceMainFinancialPayrollAdd">Add</span>' +
							'</td></tr>';
											
			aHTML[++h] = '</table>';					
			
			$('#tdInterfaceMainFinancialPayrollColumnAction').html(aHTML.join(''));
		
			$('#spanInterfaceMainFinancialPayrollAdd').button(
			{
				label: "Add"
			})
			.click(function()
			{
				$.extend(true, aParam, {step: 4, xhtmlElementID: ""});
				interfaceSetupFinancialPayrollPays(aParam);
			})

			var oSearch = new AdvancedSearch();
			oSearch.method = 'FINANCIAL_PAYROLL_PAY_RECORD_SEARCH';
			oSearch.addField('grosssalary,payrecord.employee.contactpersontext');
			oSearch.addFilter('period', 'EQUAL_TO', giObjectContext)
			oSearch.rows = 200;
			oSearch.sort('payrecord.employee.contactpersontext', 'asc');
			oSearch.getResults(function(data) {interfaceFinancialPayrollPays(aParam, data)})	
		}
		else
		{
			var aHTML = [];
			var h = -1;
	
			aHTML[++h] = '<table border="0" cellspacing="0" cellpadding="0" class="interfaceMain" style="width:100%;">';
			aHTML[++h] = '<tbody>';
		
			if (oResponse.data.rows.length == 0)
			{
				aHTML[++h] = '<tr class="interfaceMainCaption">' +
								'<td class="interfaceMainRowNothing">No pays.</td></tr>';
				aHTML[++h] = '</tbody></table>';
			}
			else
			{		
				$(oResponse.data.rows).each(function()
				{
					aHTML[++h] = '<tr class="interfaceMainRow">';
					
					aHTML[++h] = '<td id="interfaceFinancialPay_Name-' + this.id + '" class="interfaceMainRow interfaceMainRowSelect pay"' +
											' data-employeeText="' + this["payrecord.employee.contactpersontext"] + '">' +
											this["payrecord.employee.contactpersontext"] + '</td>';
									
					aHTML[++h] = '<td style="width:30px;text-align:right;" class="interfaceMainRow">';
					aHTML[++h] = '<span id="spanFinancialPay_options_remove-' + this.id + '" class="interfaceMainRowOptionsRemove"></span>';
					aHTML[++h] = '</td>';					
																								
					aHTML[++h] = '</tr>'
				});
			
				aHTML[++h] = '</tbody></table>';
			}
		
			$('#tdInterfaceMainFinancialPayrollColumnList').html(aHTML.join(''));

			$('.interfaceMainRowOptionsRemove').button(
				{
					text: false,
				 	icons: {primary: "ui-icon-close"}
				})
				.click(function() {
					$.extend(true, aParam, {step: 5, xhtmlElementID: event.target.id});
					///interfaceSetupFinancialPayrollPays(this.id)
				})
				.css('width', '15px')
				.css('height', '20px')

			$('td.pay').click(function()
			{
				var aXHTMLElementID = (event.target.id).split('-');
				var sData = $('#' + event.target.id).attr('data-employeeText');
				$.extend(true, aParam, {step: 2, pay: aXHTMLElementID[1], employeeText: sData});
				interfaceFinancialPayrollPays(aParam);
			})
		}
	}
	else if (iStep == 2)
	{	
		if (oResponse == undefined)
		{
			$('#tdInterfaceMainFinancialPayrollColumnPay').html(gsLoadingSmallXHTML);
			
			var aHTML = [];
			var h = -1;	
			
			aHTML[++h] = '<table id="tableInterfaceMainFinancialPayrollColumnAction" class="interfaceMainColumn2">';

			aHTML[++h] = '<tr class="interfaceMainCaption">';

			aHTML[++h] = '<td class="interfaceMainCaption">' +
							'<div style="float:left;""><span id="spanInterfaceMainPay-' +
							iPay +
							 '" class="interfaceMainRow interfaceMainRowOptionsParent">&nbsp;</div>' +
							'<div style="float:left;margin-left:3px;margin-top:3px;">' + sEmployeeText + 
							'</div></td>';
			aHTML[++h] = '</tr>';
			
			aHTML[++h] = '<tr class="interfaceMainCaption">';

			aHTML[++h] = '<td id="tdPayDetails">' +
							gsLoadingSmallXHTML +
							'</td>';
			aHTML[++h] = '</tr>';

			aHTML[++h] = '</table>';					
			
			$('#tdInterfaceMainFinancialPayrollColumnPay').html(aHTML.join(''));
		
			var oSearch = new AdvancedSearch();
			oSearch.method = 'FINANCIAL_PAYROLL_PAY_RECORD_SEARCH';
			oSearch.addFilter('id', 'EQUAL_TO', iPay)
			oSearch.addField('grosssalary');
			oSearch.rows = 1;
			oSearch.getResults(function(data) {interfaceFinancialPayrollPays(aParam, data)})	
		}
		else
		{
			$.extend(true, aParam, {step: 3});
			interfaceFinancialPayrollPays(aParam);

			var aHTML = [];
			var h = -1;
	
			aHTML[++h] = '<table id="tableSetupFinancialFinancialAccount" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>';
		
			if (oResponse.data.rows.length != 0)
			{
				var oRow = oResponse.data.rows[0];

				aHTML[++h] = oRow["grosssalary"];
			}
				
			aHTML[++h] = '</tbody></table>';
		
			$('#tdPayDetails').html(aHTML.join(''));
		}
	}

	else if (iStep == 3)
	{	
		if (oResponse == undefined)
		{
			$('#tdInterfaceMainFinancialPayrollColumnItem').html(gsLoadingSmallXHTML);
			
			var oSearch = new AdvancedSearch();
			oSearch.method = 'FINANCIAL_PAYROLL_PAY_RECORD_ITEM_SEARCH';
			oSearch.addFilter('id', 'EQUAL_TO', iPay)
			oSearch.addField('type,typetext,hours');
			oSearch.rows = 1;
			oSearch.getResults(function(data) {interfaceFinancialPayrollPays(aParam, data)})	
		}
		else
		{
			var aHTML = [];
			var h = -1;
	
			aHTML[++h] = '<table id="tableSetupFinancialFinancialAccount" border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
			aHTML[++h] = '<tbody>';
		
			aHTML[++h] = '<tr class="interfaceMainCaption">';
			aHTML[++h] = '<td class="interfaceMainCaption">Type</td>';
			aHTML[++h] = '<td class="interfaceMainCaption">Hours</td>';
			aHTML[++h] = '</tr>';
			
			$(oResponse.data.rows).each(function()
			{
				aHTML[++h] = '<tr class="interfaceMainRow">';
					
				aHTML[++h] = '<td id="interfaceFinancialPayPeriodItem_Type-' + this.id + '" class="interfaceMainRow interfaceMainRowSelect payitem">' +
										this["typetext"] + '</td>';

				aHTML[++h] = '<td id="interfaceFinancialPayPeriodItem_Hours-' + this.id + '" class="interfaceMainRow interfaceMainRowSelect payitem">' +
										this["hours"] + '</td>';						
								
				aHTML[++h] = '<td style="width:30px;text-align:right;" class="interfaceMainRow">';
				aHTML[++h] = '<span id="spanFinancialPay_options_remove-' + this.id + '" class="interfaceMainRowOptionsRemove"></span>';
				aHTML[++h] = '</td>';					
																							
				aHTML[++h] = '</tr>'
			});
				
			aHTML[++h] = '</tbody></table>';
		
			$('#tdInterfaceMainFinancialPayrollColumnItem').html(aHTML.join(''));
		}
	}

	else if (iStep == 4)
	{
		var sID; 
		var iType;
		var sXHTMLElementID;

		if (aParam != undefined)
		{
			if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
			if (aParam.type != undefined) {iType = aParam.type}
		}
		
		if (sXHTMLElementID != undefined)
		{
			var aXHTMLElementID = sXHTMLElementID.split('-');
			var sID = aXHTMLElementID[1];
		}	
	
		var aHTML = [];
		var h = -1;

		aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMain">';
					
		aHTML[++h] = '<tr id="trInterfaceMainAccountTitle" class="interfaceMain">' +
						'<td id="tdInterfaceMainAccountTitle" class="interfaceMain">' +
						'Title' +
						'</td></tr>' +
						'<tr id="trInterfaceMainAccountAddTitleValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainAccountAddTitleValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainAccountAddTitle" class="inputInterfaceMainText">' +
						'</td></tr>';
		

		aHTML[++h] = '<tr id="trInterfaceMainAccountParent" class="interfaceMain">' +
						'<td id="tdInterfaceMainAccountParent" class="interfaceMain">' +
						'Parent' +
						'</td></tr>' +
						'<tr id="trInterfaceMainAccountParentValue" class="interfaceMainSelect">' +
						'<td id="tdInterfaceMainAccountParentValue" class="interfaceMainSelect">' +
						'<input id="inputInterfaceMainAccountParentAccount" class="inputInterfaceMainSelect"' +
							' data-method="SETUP_FINANCIAL_ACCOUNT_SEARCH"' +
							' data-columns="title">' +
						'</td></tr>';

		aHTML[++h] = '<tr id="trInterfaceMainAccountPostable" class="interfaceMain">' +
							'<td id="tdInterfaceMainAccountPostable" class="interfaceMain">' +
							'Can transactions be linked to this account?' +
							'</td></tr>' +
							'<tr id="trInterfaceMainAccountPostable" class="interfaceMainText">' +
							'<td id="tdInterfaceMainAccountPostableValue" class="interfaceMainRadio">' +
							'<input type="radio" id="radioPostableY" name="radioPostable" value="Y"/>Yes' +
							'<br /><input type="radio" id="radioPostableN" name="radioPostable" value="N"/>No (it is a header account)' +
						'</td></tr>';

		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSetupAccountColumnEdit').html(aHTML.join(''));
		
		$('#inputInterfaceMainAccountAddTitle').focus();

		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMain" style="font-size:0.875em">';
				
		aHTML[++h] = '<tr id="trInterfaceMainAccountAddSave" class="interfaceMainAction">' +
						'<td id="tdInterfaceMainAccountAddSave" class="interfaceMainAction">' +
						'<span style="width:70px;" id="spanInterfaceMainAccountEditSave">Save</span>' +
						'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceMainBankAccountEditCancel" class="interfaceMainAction">' +
							'<td id="tdInterfaceMainBankAccountEditCancel" class="interfaceMainAction">' +
							'<span style="width:70px;" id="spanInterfaceMainAccountEditCancel">Cancel</span>' +
							'</td></tr>';
											
		aHTML[++h] = '</table>';					
			
		$('#tdInterfaceMainSetupAccountColumnAction').html(aHTML.join(''));
		
		$('#spanInterfaceMainAccountEditSave').button(
		{
			text: "Save"
		})
		.click(function() 
		{
			interfaceMasterStatusWorking();

			var sData = 'type=' + iType;
			sData += '&id=' + interfaceMasterFormatSave(sID);
			sData += '&title=' + interfaceMasterFormatSave($('#inputInterfaceMainAccountAddTitle').val());
			sData += '&parentaccount=' + interfaceMasterFormatSave($('#inputInterfaceMainAccountParentAccount').attr("data-id"));
			sData += '&postable=' + interfaceMasterFormatSave($('input[name="radioPostable"]:checked').val());

			var oAdd =
					{
						"items": [], 
						"title": $('#inputInterfaceMainAccountAddTitle').val(),
						"parentaccount": $('#inputInterfaceMainAccountParentAccount').attr("data-id"),
						"postable": $('input[name="radioPostable"]:checked').val()
					}

			$.ajax(
			{
				type: 'POST',
				url: '/ondemand/setup/setup.asp?method=SETUP_FINANCIAL_ACCOUNT_MANAGE',
				data: sData,
				dataType: 'json',
				success: function(data) {
					if (data.status == "OK")
					{
						interfaceMasterStatus('Saved');

						$.extend(true, oAdd, {id: data.id});
						
						var bNew = true;

						$(ns1blankspace.financial.accounts).each(function(i) 
						{
							if (this.id == data.id) {ns1blankspace.financial.accounts[i] = oAdd; bNew = false}
						});

						if (bNew) {(ns1blankspace.financial.accounts).unshift(oAdd)}

						$.extend(true, aParam, {step: 2});
						interfaceFinancialPayrollPays(aParam)
					}
					else
					{
						interfaceMasterError(data.error.errornotes);
					}
				}
			});
		});

		$('#spanInterfaceMainAccountEditCancel').button(
		{
			text: "Cancel"
		})
		.click(function() 
		{
			$.extend(true, aParam, {step: 2});
			interfaceSetupFinancialAccount(aParam);
		});

		$('#spanInterfaceMainAccountAdd').button(
			{
				label: "Add"
			})
			.click(function()
			{
				$.extend(true, aParam, {step: 4, xhtmlElementID: ""});
				interfaceSetupFinancialAccount(aParam);
			})

		if (sID != undefined)
		{
			var oSearch = new AdvancedSearch();
			oSearch.method = 'SETUP_FINANCIAL_ACCOUNT_SEARCH';
			oSearch.addField('title,description,parentaccount,parentaccounttext,postable');
			oSearch.addFilter('id', 'EQUAL_TO', sID);
			oSearch.getResults(function(data) {
					$.extend(true, aParam, {step: 5});
					interfaceSetupFinancialAccount(aParam, data)
					});
		}
		else
		{
			$('#inputInterfaceMainAccountParentAccount').val(($.grep(ns1blankspace.financial.accounts, function (a) { return a.id == ns1blankspace.financial.currentAccount; })[0].title).formatXHTML());
			$('#inputInterfaceMainAccountParentAccount').attr('data-id', ns1blankspace.financial.currentAccount);
			$('[name="radioPostable"][value="Y"]').attr('checked', true);
		}
	}
	else if (iStep == 5)
	{
		if (oResponse.data.rows.length != 0)
		{
			var oObjectContext = oResponse.data.rows[0];
			$('#inputInterfaceMainAccountAddTitle').val((oObjectContext.title).formatXHTML());
			$('#inputInterfaceMainAccountParentAccount').val(($.grep(ns1blankspace.financial.accounts, function (a) { return a.id == oObjectContext.parentaccount; })[0].title).formatXHTML());
			$('#inputInterfaceMainAccountParentAccount').attr('data-id', oObjectContext.parentaccount);
			$('[name="radioPostable"][value="' + oObjectContext.postable + '"]').attr('checked', true);
		}
	}	
}

