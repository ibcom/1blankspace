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
	ns1blankspace.objectContext = -1;
	ns1blankspace.object = -1;
	
	ns1blankspaceReset();		
			
	$('#divns1blankspaceViewportControlSet').button(
	{
		label: "My Account"
	});
	
	$('#inputns1blankspaceViewportControlSearch').keyup(function(event)
	{
	});
	
	$('#spanns1blankspaceViewportControlSearch').click(function(event)
	{
	});
	
	$('#spanns1blankspaceViewportControlSearchOptions').click(function(event)
	{
	});
	
	$('#spanns1blankspaceViewportControlNew').button({disabled: true});
	
	$('#spanns1blankspaceViewportControlAction').click(function(event)
	{
	});
	
	$('#spanns1blankspaceViewportControlAction').button({disabled: true});
	
	$('#spanns1blankspaceViewportControlActionOptions').click(function(event)
	{
	});
	
	$('#spanns1blankspaceViewportControlActionOptions').button({disabled: true});
		
	$('#spanns1blankspaceViewportControlSetup').click(function(event)
	{
		interfaceSetupSpaceSetup();
	});
	
	$('#spanns1blankspaceViewportControlSetupOptions').click(function(event)
	{
		interfaceSetupSpaceSetupOptions();
	});
	
	$('td.interfaceViewportMasterControlBrowse').click(function(event)
	{
	});
	
	$('td.interfaceViewportMasterControlBrowseAll').click(function(event)
	{
	});
	
	if (ns1blankspace.option.setFocus) {$('#inputns1blankspaceViewportControlSearch').focus()};
	
	interfaceSetupSpaceHomeShow();
	
}

function interfaceSetupSpaceHomeShow()
{
	var aHTML = [];
	var h = -1;
		
	$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
				
	aHTML[++h] = '<table class="interfaceMain">';
	aHTML[++h] = '<tr class="interfaceMainRow1">' +
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
					'<td id="ns1blankspaceViewportSetupSpaceLarge" class="ns1blankspaceViewportImageLarge">' +
					'&nbsp;' + 
					'</td>' +
					'</tr>';	
	
	aHTML[++h] = '<tr class="interfaceViewportControl">' +
				'<td id="tdInterfaceViewportControlSubscriptions" class="interfaceViewportControl" style="padding-top:10px;">Subscriptions</td>' +
				'</tr>';			
			
	aHTML[++h] = '<tr class="interfaceViewportControl">' +
				'<td id="tdInterfaceViewportControlAccess" class="interfaceViewportControl">Access</td>' +
				'</tr>';	

	aHTML[++h] = '</table>';

	$('#divInterfaceViewportControl').html(aHTML.join(''));	
	
	$('#tdInterfaceViewportControlSubscriptions').addClass('interfaceViewportControlHighlight');

	interfaceSetupSpaceSubscriptions({xhtmlElementID: "divInterfaceMain"})

	$('#tdInterfaceViewportControlSubscriptions').click(function(event)
	{
		ns1blankspaceMainViewportShow("#divInterfaceMain", true);
		interfaceSetupSpaceSubscriptions({xhtmlElementID: "divInterfaceMain"});
	});

	$('#tdInterfaceViewportControlAccess').click(function(event)
	{
		ns1blankspaceMainViewportShow("#divInterfaceMain", true);
		interfaceSetupSpaceMethodAccess({xhtmlElementID: "divInterfaceMain"});
	});
	
}

function interfaceSetupSpaceSubscriptions(oParam, oResponse)
{
	var iStep = 1;
	var sID; 
	var sXHTMLElementID;
		
	if (oParam != undefined)
	{
		if (oParam.step != undefined) {iStep = oParam.step}
		if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
	}
	else
	{
		oParam = {step: 1};
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
				success: function(data){interfaceSetupSpaceSubscriptions(oParam, data)}
			});	
		}
		else
		{
			var aHTML = [];
			var h = -1;
		
			aHTML[++h] = '<table id="tableInterfaceMainSubscription" class="interfaceMain" style="width:100%">' +
							'<tr id="trInterfaceMainSubscriptionRow1" class="interfaceMainRow1">' +
							'<td id="tdInterfaceMainSubscriptionColumn1" style="width:250px;" class="interfaceMainColumn1">' +
							ns1blankspace.xhtml.loading +
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
				$.extend(true, oParam, {step: 4, xhtmlElementID: this.id});
				interfaceSetupSpaceSubscriptions(oParam);
			})
			.css('width', '15px')
			.css('height', '17px');

			$('#spanSubscription_options_add').button(
			{
				text: "Add"
			})
			.click(function() {
				$.extend(true, oParam, {step: 2, xhtmlElementID: ""});
				interfaceSetupSpaceSubscriptions(oParam);
			})
			.css('font-size', '0.75em')

			$('.bankaccount').click(function() {
				$.extend(true, oParam, {step: 2, xhtmlElementID: event.target.id});
				interfaceSetupSpaceSubscriptions(oParam);
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
				ns1blankspace.xhtml.loading +
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
			ns1blankspaceStatusWorking();

			var sData = 'id=' + ns1blankspaceFormatSave(sID);
			sData += '&title=' + ns1blankspaceFormatSave($('#inputInterfaceMainSubscriptionTitle').val());
			sData += '&financialaccount=' + ns1blankspaceFormatSave($('#inputInterfaceMainBankAccountFinancialAccount').attr("data-id"));

			$.ajax(
			{
				type: 'POST',
				url: '/ondemand/setup/?method=SETUP_FINANCIAL_BANK_ACCOUNT_MANAGE',
				data: sData,
				dataType: 'json',
				success: function() {
					$.extend(true, oParam, {step: 1});
					interfaceSetupFinancialBankAccount(oParam);
					ns1blankspaceStatus('Saved');
				}
			});
		})
		
		$('#spanInterfaceMainSubscriptionEditCancel').button(
		{
			text: "Cancel"
		})
		.click(function() 
		{
			$.extend(true, oParam, {step: 1});
			interfaceSetupSpaceSubscriptions(oParam);
		})

		if (sID != undefined)
		{
			ns1blankspaceStatusWorking();

			var oSearch = new AdvancedSearch();
			oSearch.method = 'FINANCIAL_BANK_ACCOUNT_SEARCH';
			oSearch.addField('title,financialaccount,financialaccounttext');
			oSearch.addFilter('id', 'EQUAL_TO', sID);
			oSearch.getResults(function(data) {
					$.extend(true, oParam, {step: 3});
					interfaceSetupFinancialBankAccount(oParam, data)
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
		$('#inputInterfaceMainBankAccountFinancialAccount').attr('data-id', ns1blankspace.objectContextData.financialaccount);

		ns1blankspaceStatus('');
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
					$.extend(true, oParam, {step: 1});
					interfaceSetupFinancialBankAccount(oParam);
					ns1blankspaceStatus('Removed');
				}
				else
				{
					ns1blankspaceError(data.error.errornotes);
				}
			}
		});
	}		
}

function interfaceSetupSpaceMethodAccess(oParam, oResponse)
{
	var iStep = 1;
	var iID;
	var sXHTMLElementID;

	if (oParam != undefined)
	{
		if (oParam.step != undefined) {iStep = oParam.step}
		if (oParam.id != undefined) {iID = oParam.id}
		if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
	}
		
	if (iStep == 1)
	{
		var aHTML = [];
		var h = -1;	
			
		if (oResponse == undefined)
		{
						
			aHTML[++h] = '<table id="tableInterfaceMainMethodAccess" class="interfaceMain">' +
						'<tr id="trInterfaceMainSetupMethodAccessRow1" class="interfaceMainRow1">' +
						'<td id="tdInterfaceMainSetupMethodAccessColumnAccess" style="width:450px;padding-right:5px;font-size:0.75em;" class="interfaceMainColumn1">' +
							ns1blankspace.xhtml.loading + '</td>' +
						'<td id="tdInterfaceMainSetupMethodAccessColumnAction" class="interfaceMainColumn2">' +
						'</td>' +
						'</tr>' +
						'</table>';				
					
			$('#divInterfaceMain').html(aHTML.join(''));


			var aHTML = [];
			var h = -1;	
			
			aHTML[++h] = '<table class="interfaceMainColumn2">';
			aHTML[++h] = '<tr><td class="interfaceMainAction">' +
							'<span id="spanInterfaceMainAccessAdd">Add</span>' +
							'</td></tr>';
											
			aHTML[++h] = '</table>';					
			
			$('#tdInterfaceMainSetupMethodAccessColumnAction').html(aHTML.join(''));
		
			$('#spanInterfaceMainAccessAdd').button(
			{
				label: "Add"
			})
			.click(function()
			{
				$.extend(true, oParam, {step: 4, id: ""});
				interfaceSetupSpaceMethodAccess(oParam);
			})
		
			var oSearch = new AdvancedSearch();
			oSearch.method = 'SETUP_METHOD_ACCESS_SEARCH';
			oSearch.addField('title,accessmethod,accessmethodtext,addavailable,removeavailable,updateavailable,useavailable');
			oSearch.rows = 50;
			oSearch.sort('accessmethodtext', 'asc');
			oSearch.addFilter('accessmethodtext', 'TEXT_IS_NOT_EMPTY')
			oSearch.getResults(function(data) {interfaceSetupSpaceMethodAccess(oParam, data)})	
		}
		else
		{
			var aHTML = [];
			
			aHTML.push('<table cellspacing="0" cellpadding="0" class="interfaceMain">');
			aHTML.push('<tbody>');

			aHTML.push('<tr class="interfaceMainCaption">');
			aHTML.push('<td class="interfaceMainCaption">Method</td>');
			aHTML.push('<td class="interfaceMainCaption" style="width:35px;text-align:center;">Search</td>');
			aHTML.push('<td class="interfaceMainCaption" style="width:35px;text-align:center;">Add</td>');
			aHTML.push('<td class="interfaceMainCaption" style="width:35px;text-align:center;">Update</td>');
			aHTML.push('<td class="interfaceMainCaption" style="width:35px;text-align:center;">Remove</td>');
			aHTML.push('<td class="interfaceMainCaption">&nbsp;</td>');
			aHTML.push('</tr>');

			$(oResponse.data.rows).each(function()
			{

				aHTML.push('<tr class="interfaceMainRow">');
				
				if (this.accessmethodtext != '')
				{
					aHTML.push('<td id="interfaceSetupSpaceMethodAccess_Title-' + this.id + '" class="interfaceMainRow interfaceMainRowSelect methodaccess"' +
										' title="">' +
										this.accessmethodtext + '</td>');

					aHTML.push('<td style="width:35px;text-align:center;" ' +
									'id="spanAccessMethod_options_useavailable-' + this.id + '" class="interfaceMainRow interfaceMainRowOptionsEdit' +
										((this.useavailable == 'Y') ? ' ticked' : '') + '">&nbsp;' +
									'</td>');		

					aHTML.push('<td style="width:35px;text-align:center;" ' +
									'id="spanAccessMethod_options_addavailable-' + this.id + '" class="interfaceMainRow interfaceMainRowOptionsEdit' +
										((this.addavailable == 'Y') ? ' ticked' : '') + '">&nbsp;' +
									'</td>');

					aHTML.push('<td style="width:35px;text-align:center;" ' +
									'id="spanAccessMethod_options_updateavailable-' + this.id + '" class="interfaceMainRow interfaceMainRowOptionsEdit' +
										((this.updateavailable == 'Y') ? ' ticked' : '') + '">&nbsp;' +
									'</td>');

					aHTML.push('<td style="width:35px;text-align:right;" ' +
									'id="spanAccessMethod_options_removeavailable-' + this.id + '" class="interfaceMainRow interfaceMainRowOptionsEdit' +
										((this.removeavailable == 'Y') ? ' ticked' : '') + '">&nbsp;' +
									'</td>');									

					aHTML.push('<td style="width:30px;text-align:right;" class="interfaceMainRow">' +
									'<span id="spanAccessMethod_options_remove-' + this.id + '" class="interfaceMainRowOptionsRemove"></span>' +
									'</td>');		
				}

				aHTML.push('</tr>');

			});
		
			aHTML.push('</tbody></table>');
				
			$('#tdInterfaceMainSetupMethodAccessColumnAccess').html(aHTML.join(''));

			$('td.methodaccess').click(function(event)
			{
				var sXHTMLElementId = event.target.id;
				var aId = sXHTMLElementId.split('-');
				
				interfaceSetupSpaceMethodAccess({id: aId[1], step: 3});
			});

			$('.interfaceMainRowOptionsRemove').button(
			{
				text: false,
				icons: {
					primary: "ui-icon-close"
				}
			})
			.click(function() {
				$.extend(true, oParam, {step: 5, xhtmlElementID: this.id});
				interfaceSetupSpaceMethodAccess(oParam);
			})
			.css('width', '15px')
			.css('height', '17px');

		}
		
	}	
	else if (iStep == 3)
	{
		var oSearch = new AdvancedSearch();
		oSearch.method = 'SETUP_METHOD_ACCESS_SEARCH';
		oSearch.addField('title,accessmethod,accessmethodtext,addavailable,removeavailable,updateavailable,useavailable');
		oSearch.addFilter('id', 'EQUAL_TO', iID);

		oSearch.getResults(function(data) {
				$.extend(true, oParam, {step: 4});
				interfaceSetupSpaceMethodAccess(oParam, data)
				});
	}

	else if (iStep == 4)
	{
		var aHTML = [];
		var h = -1;
		
		if (iID == '')
		{
			aHTML[++h] = '<table class="interfaceMain">';
			
			aHTML[++h] = '<tr id="trInterfaceMainMethodAccessMethod" class="interfaceMain">' +
							'<td id="tdInterfaceMainMethodAccessMethod" class="interfaceMain">' +
							'Method' +
							'</td></tr>' +
							'<tr class="interfaceMainSelect">' +
							'<td class="interfaceMainSelect">' +
							'<input id="inputInterfaceMainMethodAccessMethod" class="inputInterfaceMainSelectCustom">' +
							'</td></tr>';

			aHTML[++h] = '</table>';					
		}

		aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMain">';
		
		aHTML[++h] = '<tr class="interfaceMain">' +
						'<td class="interfaceMain">' +
						'Search?' +
						'</td></tr>' +
						'<tr class="interfaceMainText">' +
						'<td id="tdInterfaceMainMethodAccessCanUseValue" class="interfaceMainRadio">' +
						'<input type="radio" id="radioCanUseY" name="radioCanUse" value="Y"/>Yes' +
						'<br /><input type="radio" id="radioCanUseN" name="radioCanUse" value="N"/>No' +
					'</td></tr>';

		aHTML[++h] = '<tr class="interfaceMain">' +
						'<td class="interfaceMain">' +
						'Add?' +
						'</td></tr>' +
						'<tr class="interfaceMainText">' +
						'<td id="tdInterfaceMainMethodAccessCanAddValue" class="interfaceMainRadio">' +
						'<input type="radio" id="radioCanAddY" name="radioCanAdd" value="Y"/>Yes' +
						'<br /><input type="radio" id="radioCanAddN" name="radioCanAdd" value="N"/>No' +
						'</td></tr>';
		
		aHTML[++h] = '<tr class="interfaceMain">' +
						'<td class="interfaceMain">' +
						'Remove?' +
						'</td></tr>' +
						'<tr class="interfaceMainText">' +
						'<td id="tdInterfaceMainMethodAccessCanRemoveValue" class="interfaceMainRadio">' +
						'<input type="radio" id="radioCanRemoveY" name="radioCanRemove" value="Y"/>Yes' +
						'<br /><input type="radio" id="radioCanRemoveN" name="radioCanRemove" value="N"/>No' +
					'</td></tr>';
	
			
		aHTML[++h] = '<tr class="interfaceMain">' +
						'<td class="interfaceMain">' +
						'Update?' +
						'</td></tr>' +
						'<tr class="interfaceMainText">' +
						'<td id="tdInterfaceMainMethodAccessCanUpdateValue" class="interfaceMainRadio">' +
						'<input type="radio" id="radioCanUpdateY" name="radioCanUpdate" value="Y"/>Yes' +
						'<br /><input type="radio" id="radioCanUpdateN" name="radioCanUpdate" value="N"/>No' +
					'</td></tr>';
	
		aHTML[++h] = '</table>';					
		
		aHTML[++h] = '<table class="interfaceMain" style="font-size:0.875em">';
				
		aHTML[++h] = '<tr iclass="interfaceMainAction">' +
						'<td id="tdInterfaceMainMethodAccessSave" class="interfaceMainAction">' +
						'<span style="width:70px;" id="spanInterfaceMainMethodAccessSave">Save</span>' +
						'</td></tr>';
						
		aHTML[++h] = '<tr class="interfaceMainAction">' +
							'<td id="tdInterfaceMainMethodAccessCancel" class="interfaceMainAction">' +
							'<span style="width:70px;" id="spanInterfaceMainMethodAccessCancel">Cancel</span>' +
							'</td></tr>';
											
		aHTML[++h] = '</table>';					
			
		$('#tdInterfaceMainSetupMethodAccessColumnAction').html(aHTML.join(''));

		$('#inputInterfaceMainMethodAccessMethod').keyup(function()
		{
			if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
	        ns1blankspace.timer.delayCurrent = setTimeout("interfaceSetupSpaceMethodSearch('inputInterfaceMainMethodAccessMethod')", ns1blankspace.option.typingWait);
		});	
			
		$('#inputInterfaceMainMethodAccessMethod').live('blur', function() 
		{
			$(this).removeClass('ns1blankspaceHighlight');
		});
		
		$('#spanInterfaceMainMethodAccessSave').button(
		{
			text: "Save"
		})
		.click(function() 
		{
			ns1blankspaceStatusWorking();

			var sData = 'id=' + ns1blankspaceFormatSave(iID);
			if (iID == '')
			{
				sData += '&accessmethod=' + ns1blankspaceFormatSave($('#inputInterfaceMainMethodAccessMethod').attr('data-id'));
			}	
			sData += '&addavailable=' + ns1blankspaceFormatSave($('input[name="radioCanAdd"]:checked').val());
			sData += '&removeavailable=' + ns1blankspaceFormatSave($('input[name="radioCanRemove"]:checked').val());
			sData += '&updateavailable=' + ns1blankspaceFormatSave($('input[name="radioCanUpdate"]:checked').val());
			sData += '&useavailable=' + ns1blankspaceFormatSave($('input[name="radioCanUse"]:checked').val());

			$.ajax(
			{
				type: 'POST',
				url: '/ondemand/setup/?method=SETUP_METHOD_ACCESS_MANAGE',
				data: sData,
				dataType: 'json',
				success: function(data) {
					if (data.status == "OK")
					{
						ns1blankspaceStatus('Saved');
						$.extend(true, oParam, {step: 1});
						interfaceSetupSpaceMethodAccess(oParam);
					}
					else
					{
						ns1blankspaceError(data.error.errornotes);
					}
				}
			});
		});

		$('#spanInterfaceMainMethodAccessCancel').button(
		{
			text: "Cancel"
		})
		.click(function() 
		{
			$.extend(true, oParam, {step: 1});
			interfaceSetupSpaceMethodAccess(oParam);
		});

		if (iID != '')
		{	
			if (oResponse.data.rows.length != 0)
			{
				var oObjectContext = oResponse.data.rows[0];
				
				$('[name="radioCanAdd"][value="' + oObjectContext.addavailable + '"]').attr('checked', true);
				$('[name="radioCanRemove"][value="' + oObjectContext.removeavailable + '"]').attr('checked', true);
				$('[name="radioCanUpdate"][value="' + oObjectContext.updateavailable + '"]').attr('checked', true);
				$('[name="radioCanUse"][value="' + oObjectContext.useavailable + '"]').attr('checked', true);
			}
			else
			{
				$('[name="radioCanAdd"][value="Y"]').attr('checked', true);
				$('[name="radioCanRemove"][value="Y"]').attr('checked', true);
				$('[name="radioCanUpdate"][value="Y"]').attr('checked', true);
				$('[name="radioCanUse"][value="Y"]').attr('checked', true);
			}
		}	
	}

	else if (iStep == 5)
	{
		var aSearch = sXHTMLElementID.split('-');
		
		var sParam = 'method=SETUP_METHOD_ACCESS_MANAGE';
		var sData = 'remove=1&id=' + aSearch[1];
					
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/setup/setup.asp?' + sParam,
			data: sData,
			dataType: 'json',
			success: function(data){$('#' + sXHTMLElementID).parent().parent().fadeOut(500)}
		});	
	}
}

function interfaceSetupSpaceMethodSearch(sXHTMLInputElementID, oResponse)
{
	var aHTML = [];
	var sSearchText;
	var iXHTMLElementContextID;

	if (oResponse == undefined)
	{	
		sSearchText = $('#' + sXHTMLInputElementID).val();
		
		if (sSearchText.length > 2)
		{

			var oSearch = new AdvancedSearch();
			oSearch.method = 'SETUP_METHOD_SEARCH';
			oSearch.addField('title');
			oSearch.addFilter('title', 'TEXT_IS_LIKE', sSearchText)
			oSearch.rows = 10;
			oSearch.sort('title', 'asc');
			oSearch.getResults(function(data) {interfaceSetupSpaceMethodSearch(sXHTMLInputElementID, data)})	
		}
	}
	else
	{	
		aHTML.push('<table style="width: 350px;" class="interfaceViewportMasterControl" cellpadding=4>');

		$(oResponse.data.rows).each(function()
		{
			
			aHTML.push('<tr>' +
				'<td id="tdns1blankspaceMethod-' + this.id + '" data-methodtext="' + this.title + '" class="interfaceSearch ns1blankspaceMethod">' +
				this.title +
				'</td></tr>');
				
		});			
						
		aHTML.push('</table>');
		
		$('#divns1blankspaceViewportControlOptions').html(aHTML.join(''));

		$('#divns1blankspaceViewportControlOptions').show(ns1blankspace.option.showSpeedOptions);
		$('#divns1blankspaceViewportControlOptions').offset({ top: $('#' + sXHTMLInputElementID).offset().top + $('#' + sXHTMLInputElementID).height(), left: $('#' + sXHTMLInputElementID).offset().left});

		$('.ns1blankspaceMethod').click(function(event)
		{
			var aXHTMLElementID = (event.target.id).split('-');
			iXHTMLElementContextID = aXHTMLElementID[1];

			$('#' + sXHTMLInputElementID).val($('#' + event.target.id).attr("data-methodtext"))
			$('#' + sXHTMLInputElementID).attr("data-id", iXHTMLElementContextID)
			$('#divns1blankspaceViewportControlOptions').hide();
		});
	}	
}	
