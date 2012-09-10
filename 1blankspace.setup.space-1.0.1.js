/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 
function interfaceSetupSpaceMasterViewport()
{

	gsSetupName = 'My Account';
	goSetupContextXML = '';
	giSetupContext = -1;
	giObjectContext = -1;
	giObject = -1;
	
	interfaceMasterReset();		
			
	$('#divInterfaceMasterViewportControlSet').button(
	{
		label: "My Account"
	});
	
	$('#inputInterfaceMasterViewportControlSearch').keyup(function(event)
	{
		if (giKeyPressTimeoutId != 0) {clearTimeout(giKeyPressTimeoutId)};
        giKeyPressTimeoutId = setTimeout("interfaceSetupSpaceSearch('inputInterfaceMasterViewportControlSearch')", giWaitForStop);
	});
	
	$('#spanInterfaceMasterViewportControlSearch').click(function(event)
	{
		interfaceSetupSpaceSearch('inputInterfaceMasterViewportControlSearch');
	});
	
	$('#spanInterfaceMasterViewportControlSearchOptions').click(function(event)
	{
		interfaceSetupSpaceSearchOptions();
	});
	
	$('#spanInterfaceMasterViewportControlNew').click(function(event)
	{
		interfaceSetupSpaceNew();
	})
	
	$('#spanInterfaceMasterViewportControlNewOptions').click(function(event)
	{
		interfaceSetupSpaceNewOptions();
	});
	
	$('#spanInterfaceMasterViewportControlAction').click(function(event)
	{
		interfaceSetupSpaceSave();
	});
	
	$('#spanInterfaceMasterViewportControlAction').button({disabled: true});
	
	$('#spanInterfaceMasterViewportControlActionOptions').click(function(event)
	{
	});
	
	$('#spanInterfaceMasterViewportControlActionOptions').button({disabled: true});
		
	$('#spanInterfaceMasterViewportControlSetup').click(function(event)
	{
		interfaceSetupSpaceSetup();
	});
	
	$('#spanInterfaceMasterViewportControlSetupOptions').click(function(event)
	{
		interfaceSetupSpaceSetupOptions();
	});
	
	$('#spanInterfaceMasterViewportControlHelp').click(function(event)
	{
		interfaceSetupSpaceHelp();
	});
	
	$('#spanInterfaceMasterViewportControlHelpOptions').click(function(event)
	{
		interfaceSetupSpaceHelpOptions();
	});

	$('td.interfaceViewportMasterControlBrowse').click(function(event)
	{
		interfaceSetupSpaceSearch(event.target.id, {source: giSearchSource_BROWSE});
	});
	
	$('td.interfaceViewportMasterControlBrowseAll').click(function(event)
	{
		interfaceSetupSpaceSearch(event.target.id, {source: giSearchSource_BROWSE});
	});
	
	if (gbSetFocus) {$('#inputInterfaceMasterViewportControlSearch').focus()};
	
	interfaceSetupSpaceHomeShow();
	
}

function interfaceSetupSpaceHomeShow()
{
	var aHTML = [];
	var h = -1;
		
	$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
				
	aHTML[++h] = '<table id="tableInterfaceMainSummary" class="interfaceMain">';
	aHTML[++h] = '<tr id="trInterfaceMainSummaryRow1" class="interfaceMainRow1">' +
				'<td id="tdInterfaceWebsiteHomeMostLikely" class="interfaceMainColumn1Large">' +
					'</td>' +
					'<td id="tdInterfaceMainSummaryColumn2Actionx" style="width:175px;">' +
					'</td>' +
					'</tr>';
	aHTML[++h] = '</table>';		
					
	$('#divInterfaceMain').html(aHTML.join(''));
	
	var aHTML = [];
	var h = -1;
	
	var aHTML = [];
	var h = -1;
				
	aHTML[++h] = '<table>';
	aHTML[++h] = '<tr>' +
					'<td id="interfaceMasterViewportSetupSpaceLarge" class="interfaceMasterViewportImageLarge">' +
					'&nbsp;' + 
					'</td>' +
					'</tr>';	
	
	aHTML[++h] = '<tr id="trInterfaceViewportControl2" class="interfaceViewportControl">' +
				'<td id="tdInterfaceViewportControlSubscriptions" class="interfaceViewportControl" style="padding-top:10px;">Subscriptions</td>' +
				'</tr>';			
			
	//aHTML[++h] = '<tr id="trInterfaceViewportControl3" class="interfaceViewportControl">' +
	//			'<td id="tdInterfaceViewportControlBilling" class="interfaceViewportControl" style="padding-top:10px;">Billing</td>' +
	//			'</tr>';	

	aHTML[++h] = '</table>';

	$('#divInterfaceViewportControl').html(aHTML.join(''));	
	
	$('#tdInterfaceViewportControlSubscriptions').addClass('interfaceViewportControlHighlight');

	interfaceSetupSpaceSubscriptions({xhtmlElementID: "divInterfaceMain"})

	$('#tdInterfaceViewportControlSubscriptions').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMain", true);
		interfaceSetupSpaceSubscriptions({xhtmlElementID: "divInterfaceMain"});
	});
	
}

function interfaceSetupSpaceSubscriptions(aParam, oResponse)
{
	var iStep = 1;
	var sID; 
	var sXHTMLElementID;
		
	if (aParam != undefined)
	{
		if (aParam.step != undefined) {iStep = aParam.step}
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
	}
	else
	{
		aParam = {step: 1};
	}
	
	if (sXHTMLElementID != undefined)
	{
		var aXHTMLElementID = sXHTMLElementID.split('-');
		var sID = aXHTMLElementID[1];
	}	

	if (iStep == 1)
	{
		
		if (oResponse == undefined)
		{
			$.ajax(
			{
				type: 'POST',
				url: '/ondemand/admin/?method=ADMIN_MEMBERSHIP_SUBSCRIPTION_SEARCH',
				data: '',
				dataType: 'json',
				success: function(data){interfaceSetupSpaceSubscriptions(aParam, data)}
			});	
		}
		else
		{
			var aHTML = [];
			var h = -1;
		
			aHTML[++h] = '<table id="tableInterfaceMainSubscription" class="interfaceMain" style="width:100%">' +
							'<tr id="trInterfaceMainSubscriptionRow1" class="interfaceMainRow1">' +
							'<td id="tdInterfaceMainSubscriptionColumn1" style="width:250px;" class="interfaceMainColumn1">' +
							gsLoadingXHTML +
							'</td>';

			//aHTML[++h] = '<td id="tdInterfaceMainSubscriptionColumn2" class="interfaceMainColumn2">' +
			//				'<span id="spanSubscription_options_add" class="interfaceMainRowOptionsAdd" style="font-size:0.75em;">Add</span>'
			//				'</td>';

			aHTML[++h] = '</tr>' +
							'</table>';				
		
			$('#divInterfaceMain').html(aHTML.join(''));
		
			var aHTML = [];
			var h = -1;
			
			if (oResponse.data.rows.length == 0)
			{
				aHTML[++h] = '<table>';
				aHTML[++h] = '<tr>';
				aHTML[++h] = '<td class="interfaceMainRowNothing">You have no subsriptions</td>';
				aHTML[++h] = '</tr>';
				aHTML[++h] = '</table>';

				$('#tdInterfaceMainSubscriptionColumn1').html(aHTML.join(''));
			}
			else
			{			
				var aHTML = [];
				var h = -1;
			
				aHTML[++h] = '<table border="0" cellspacing="0" cellpadding="0" class="interfaceMain">';
				aHTML[++h] = '<tbody>'
		
				$(oResponse.data.rows).each(function() 
				{
					aHTML[++h] = '<tr class="interfaceMainRow">';
					
					aHTML[++h] = '<td id="interfaceSetupSubscription_Membership-' + this.id + '" class="interfaceMainRow interfaceMainRowSelect membership">' +
											this.membershiptext + '</td>';
										
					aHTML[++h] = '<td style="width:30px;text-align:right;" class="interfaceMainRow">';
					
					aHTML[++h] = '<span id="spanSubscription_options_remove-' + this.id + '" class="interfaceMainRowOptionsRemove"></span>';
						
					aHTML[++h] = '</td>';				
																	
					aHTML[++h] = '</tr>'
				});
				
				aHTML[++h] = '</tbody></table>';
			}
			
			$('#tdInterfaceMainSubscriptionColumn1').html(aHTML.join(''));

			$('.interfaceMainRowOptionsRemoveX').button(
			{
				text: false,
				icons: {
					primary: "ui-icon-close"
				}
			})
			.click(function() {
				$.extend(true, aParam, {step: 4, xhtmlElementID: this.id});
				interfaceSetupSpaceSubscriptions(aParam);
			})
			.css('width', '15px')
			.css('height', '17px');

			$('#spanSubscription_options_add').button(
			{
				text: "Add"
			})
			.click(function() {
				$.extend(true, aParam, {step: 2, xhtmlElementID: ""});
				interfaceSetupSpaceSubscriptions(aParam);
			})
			.css('font-size', '0.75em')

			$('.bankaccount').click(function() {
				$.extend(true, aParam, {step: 2, xhtmlElementID: event.target.id});
				interfaceSetupSpaceSubscriptions(aParam);
			})
		}	
	}

	if (iStep == 2)
	{	
		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table class="interfaceMain">' +
				'<tr id="trInterfaceMainSubscriptionRow1" class="interfaceMainRow1">' +
				'<td id="tdInterfaceMainSubscriptionEditColumn1"  class="interfaceMainColumn1" style="width:300px;padding-right:15px;">' +
				gsLoadingXHTML +
				'</td>' +
				'<td id="tdInterfaceMainSubscriptionEditColumn2" class="interfaceMainColumn2">' +
				'</td>' +
				'</tr>' +
				'</table>';				
	
		$('#tdInterfaceMainSubscriptionColumn2').html(aHTML.join(''));

		var aHTML = [];
		var h = -1;

		aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMain">';
					
		aHTML[++h] = '<tr id="trInterfaceMainBankAccountTitle" class="interfaceMain">' +
						'<td id="tdInterfaceMainBankAccountTitle" class="interfaceMain">' +
						'' +
						'</td></tr>';

		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSubscriptionEditColumn1').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table iclass="interfaceMain" style="font-size:0.875em">';
				
		//aHTML[++h] = '<tr id="trInterfaceMainSubscriptionEditSave" class="interfaceMainAction">' +
		//				'<td id="tdInterfaceMainSubscriptionEditSave" class="interfaceMainAction">' +
		//				'<span style="width:70px;" id="spanInterfaceMainSubscriptionEditSave">Save</span>' +
		//				'</td></tr>';
						
		aHTML[++h] = '<tr id="trInterfaceMainSubscriptionEditCancel" class="interfaceMainAction">' +
						'<td id="tdInterfaceMainSubscriptionEditCancel" class="interfaceMainAction">' +
						'<span style="width:70px;" id="spanInterfaceMainSubscriptionEditCancel">Cancel</span>' +
						'</td></tr>';
										
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainSubscriptionEditColumn2').html(aHTML.join(''));
		
		$('#spanInterfaceMainSubscriptionEditSave').button(
		{
			text: "Save"
		})
		.click(function() 
		{
			interfaceMasterStatusWorking();

			var sData = 'id=' + interfaceMasterFormatSave(sID);
			sData += '&title=' + interfaceMasterFormatSave($('#inputInterfaceMainSubscriptionTitle').val());
			sData += '&financialaccount=' + interfaceMasterFormatSave($('#inputInterfaceMainBankAccountFinancialAccount').attr("data-id"));

			$.ajax(
			{
				type: 'POST',
				url: '/ondemand/setup/?method=SETUP_FINANCIAL_BANK_ACCOUNT_MANAGE',
				data: sData,
				dataType: 'json',
				success: function() {
					$.extend(true, aParam, {step: 1});
					interfaceSetupFinancialBankAccount(aParam);
					interfaceMasterStatus('Saved');
				}
			});
		})
		
		$('#spanInterfaceMainSubscriptionEditCancel').button(
		{
			text: "Cancel"
		})
		.click(function() 
		{
			$.extend(true, aParam, {step: 1});
			interfaceSetupSpaceSubscriptions(aParam);
		})

		if (sID != undefined)
		{
			interfaceMasterStatusWorking();

			var oSearch = new AdvancedSearch();
			oSearch.method = 'FINANCIAL_BANK_ACCOUNT_SEARCH';
			oSearch.addField('title,financialaccount,financialaccounttext');
			oSearch.addFilter('id', 'EQUAL_TO', sID);
			oSearch.getResults(function(data) {
					$.extend(true, aParam, {step: 3});
					interfaceSetupFinancialBankAccount(aParam, data)
					});
		}
		else
		{
		}
	}
		
	if (iStep == 3 && oResponse)
	{
		var oObjectContext = oResponse.data.rows[0];
		$('#inputInterfaceMainBankAccountTitle').val(oObjectContext.title);
		$('#inputInterfaceMainBankAccountTitle').focus();
		$('#inputInterfaceMainBankAccountFinancialAccount').val(oObjectContext.financialaccounttext)
		$('#inputInterfaceMainBankAccountFinancialAccount').attr('data-id', goObjectContext.financialaccount);

		interfaceMasterStatus('');
	}

	if (iStep == 4)
	{			
		var sParam = 'method=SETUP_FINANCIAL_BANK_ACCOUNT_MANAGE&remove=1';
		var sData = 'id=' + sID;
		
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/setup/?' + sParam,
			data: sData,
			dataType: 'json',
			success: function(data)
			{
				if (data.status == 'OK')
				{
					$('#' + sXHTMLElementID).parent().parent().fadeOut(500);
					$.extend(true, aParam, {step: 1});
					interfaceSetupFinancialBankAccount(aParam);
					interfaceMasterStatus('Saved');
				}
				else
				{
					interfaceMasterError(data.error.errornotes);
				}
			}
		});
	}		
}

