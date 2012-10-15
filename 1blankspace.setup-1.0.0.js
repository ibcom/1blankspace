/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 
function interfaceSetupMasterViewport(aParam)
{
	if (aParam != undefined)
	{
		if (aParam.setupMethod != undefined) {gsSetupMethod = aParam.setupMethod}
		if (aParam.setupName != undefined) {gsSetupName = aParam.setupName}
	}

	interfaceMasterReset();
	
	$('#divInterfaceMasterViewportControlSet').button(
	{
		label: gsSetupName
	});
	
	$('#inputInterfaceMasterViewportControlSearch').keyup(function(event)
	{
		interfaceSetupSearch('inputInterfaceMasterViewportControlSearch');
	});
	
	$('#imgInterfaceMasterViewportControlSearch').click(function(event)
	{
		interfaceSetupSearch('inputInterfaceMasterViewportControlSearch');
	});
	
	$('#spanInterfaceMasterViewportControlSearchOptions').click(function(event)
	{
		interfaceSetupSearchOptions();
	});
	
	$('#spanInterfaceMasterViewportControlNew').click(function(event)
	{
		interfaceSetupAdd();
	})
	
	$('#spanInterfaceMasterViewportControlNewOptions').click(function(event)
	{
		interfaceSetupNewOptions();
	});
	
	$('#spanInterfaceMasterViewportControlAction').click(function(event)
	{
		interfaceSetupSave();
	});
	
	$('#spanInterfaceMasterViewportControlAction').button({disabled: true});
	
	$('#spanInterfaceMasterViewportControlActionOptions').click(function(event)
	{
	
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableinterfaceActionOptions" class="interfaceActionOptions">';
						
		aHTML[++h] = '<tr id="trinterfaceActionOptions" class="interfaceActionOptions">' +
						'<td id="tdinterfaceActionOptionsDelete" class="interfaceActionOptions">' +
						'Delete' +
						'</td>' +
						'</tr>';

		aHTML[++h] = '</table>';

		interfaceMasterViewportActionShow(this, aHTML.join(''), "interfaceContactPersonActionOptionsBind()");
	});
	
	$('#spanInterfaceMasterViewportControlActionOptions').button({disabled: true});
	
	$('#spanInterfaceMasterViewportControlHelp').click(function(event)
	{
		interfaceSetupHelp();
	});
	
	$('#spanInterfaceMasterViewportControlHelpOptions').click(function(event)
	{
		interfaceSetupHelpOptions();
	});
	
	$('.InterfaceMasterViewportControlBrowse').click(function(event)
	{
		interfaceSetupSearch(giSearchSource_BROWSE, event.target.id);
	});
	
	var aHTML = [];
	var h = -1;
				
	aHTML[++h] = '<table>';
	aHTML[++h] = '<tr>' +
					'<td id="interfaceMasterViewportSetupLarge" class="interfaceMasterViewportImageLarge">' +
					'&nbsp;' + 
					'</td>' +
					'</tr>';
	aHTML[++h] = '</table>';		
	
	$('#divInterfaceViewportControl').html(aHTML.join(''));	
	
	interfaceMasterStatus('Click value to edit.')
	
	var oSearch = new AdvancedSearch();
	oSearch.method = gsSetupMethod + '_SEARCH';
	oSearch.addField('title');
	oSearch.rows = 100;
	oSearch.sort('title', 'asc');
	oSearch.getResults(function(data) {interfaceSetupHomeShow(aParam, data)});
}

function interfaceSetupHomeShow(aParam, oResponse)
{
	var aHTML = [];
	var h = -1;
				
	var aHTML = [];
	var h = -1;
				
	aHTML[++h] = '<table id="tableInterfaceViewportMain" class="interfaceViewportMain">';
	aHTML[++h] = '<tr id="trInterfaceViewportMain" class="interfaceViewportMain">' +
					'<td id="tdInterfaceSetupHomeMostLikely" class="interfaceViewportMain">' +
					gsLoadingXHTML + 
					'</td>' +
					'</tr>';
	aHTML[++h] = '</table>';					
	
	$('#divInterfaceMain').html(aHTML.join(''));
	
	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<table style="width:100%" border="0" cellspacing="0" cellpadding="0" id="tableInterfaceSetupHomeMostLikely">';
	aHTML[++h] = '<tbody>'
		
	aHTML[++h] = '<tr class="interfaceMainRow">';
	aHTML[++h] = '<td class="interfaceMainCaption">Title</td>';
	aHTML[++h] = '<td class="interfaceMainCaption" style="text-align:right"><span id="spanInterfaceSetupAdd">Add</span></td>';
	aHTML[++h] = '</tr>';
	
	if (oResponse.data.rows.length == 0)
	{
		aHTML[++h] = '<tr>';
		aHTML[++h] = '<td class="interfaceMainRowNothing">Nothing to show.</td>';
		aHTML[++h] = '<td></td>';
		aHTML[++h] = '</tr>';	
		$('#tdInterfaceProjectHomeMostLikely').html('Nothing to show.');
	}
	else
	{	
		$.each(oResponse.data.rows, function()
		{
			aHTML[++h] = '<tr class="interfaceMainRow">';
						
			aHTML[++h] = '<td id="tdSetup-' + this.id + 
							'" class="interfaceMainRow interfaceHomeMostLikely">' +
							this.title + '</td>';
			
			aHTML[++h] = '<td style="width:23px;text-align:right;" id="tdSetup_delete-' + this.id + 
							'" class="interfaceMainRowOptionsDelete"></td>';
			
			aHTML[++h] = '</tr>'
		});
	}

	aHTML[++h] = '</tbody></table>';

	$('#tdInterfaceSetupHomeMostLikely').html(aHTML.join(''));
		
	$('#spanInterfaceSetupAdd').button({
			text: false,
			 icons: {
				 primary: "ui-icon-plus"
			}
		})
		.click(function() {
			interfaceSetupAdd()
		})
		.css('width', '15px')
		.css('height', '20px')	
		
	$('td.interfaceHomeMostLikely').click(function(event)
	{
		interfaceSetupElementEditStart(event.target.id);
	});
	
	$('.interfaceMainRowOptionsDelete').button({
			text: false,
			 icons: {
				 primary: "ui-icon-close"
			}
		})
		.click(function() {
			interfaceSetupRemove(this.id)
		})
		.css('width', '15px')
		.css('height', '20px')
			
	$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
}			
	
function interfaceSetupAdd()
{
	var aHTML = [];
	var h = -1;
		
	aHTML[++h] = '<tr class="interfaceMainRow">';
						
	aHTML[++h] = '<td id="tdSetup-" class="interfaceMainRow interfaceHomeMostLikely"></td>';
	
	aHTML[++h] = '<td style="width:23px;text-align:right;" id="tdSetup_delete-' + 
					'" class="interfaceMainRowOptionsDelete"></td>';
	
	aHTML[++h] = '</tr>'
			
	$('#tableInterfaceSetupHomeMostLikely tr:first').after(aHTML.join(''));	
	$('#spanInterfaceMasterViewportControlNew').button({disabled: true});
	$('#spanInterfaceSetupAdd').button({disabled: true});
	
	interfaceSetupElementEditStart("tdSetup-")
}
	
function interfaceSetupSearch(sXHTMLElementId, iSource, sSearchText, sSearchContext)
{
	
	var aSearch = sXHTMLElementId.split('-');
	var sElementId = aSearch[0];
	var sSearchContext = aSearch[1];
		
	if (sSearchContext != undefined)
	{
		glSetupContext = aSearch[1];
		var sParam = gsSetupMethod + '_SEARCH&rf=XML&id=' + glSetupContext;
		
		$.ajax(
		{
			type: 'GET',
			url: sParam,
			dataType: 'xml',
			success: interfaceSetupShow
		});
	}
	else
	{
	
		var iMinimumLength = 3;
		var iMaximumColumns = 1;
	
		if (iSource == undefined)
		{
			iSource = giSearchSource_TEXT_INPUT;
		}	
		
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
			
			var sParam = gsSetupMethod + '_SEARCH&rf=XMLtitle=' + sSearchText;
								
			$.ajax(
			{
				type: 'GET',
				url: sParam,
				dataType: 'xml',
				success: interfaceSetupSearchShow
			});
			
		}
	};	
}

function interfaceSetupSearchShow(oXML)
{

	var iColumn = 0;
	var aHTML = [];
	var h = -1;
	var	iMaximumColumns = 1;
		
	var oRoot = oXML.getElementsByTagName('ondemand').item(0);
	
	if (oRoot.childNodes.length == 0)
	{
		$('#divInterfaceMasterViewportControlOptions').hide();
	}
	else
	{
		var oRow = oRoot.childNodes.item(0);
		
		aHTML[++h] = '<table border="0" cellspacing="0" cellpadding="0">';
		aHTML[++h] = '<tbody>'
			
		for (var iRow = 0; iRow < oRoot.childNodes.length; iRow++) 
		{
			
			var oRow = oRoot.childNodes.item(iRow);
			
			iColumn = iColumn + 1;
			
			if (iColumn == 1)
			{
				aHTML[++h] = '<tr class="interfaceSearch">';
			}
			
			aHTML[++h] = '<td class="interfaceSearch" id="' + onDemandXMLGetData(oRow, "xhtmlcontext") +
							'-' + onDemandXMLGetData(oRow, "id") + '">' +
							onDemandXMLGetData(oRow, "title") + '</td>';
			
			if (iColumn == iMaximumColumns)
			{
				aHTML[++h] = '</tr>'
				iColumn = 0;
			}	
		}
    	
		aHTML[++h] = '</tbody></table>';

		$('#divInterfaceMasterViewportControlOptions').html(aHTML.join(''));
		$('#divInterfaceMasterViewportControlOptions').show(giShowSpeedOptions);
		
		$('td.interfaceSearch').click(function(event)
		{
			$('#divInterfaceMasterViewportControlOptions').html('&nbsp;');
			$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions)
			interfaceSetupSearch(event.target.id, 1);
		});
	}	
			
}

function interfaceSetupViewport()
{
	
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceViewportControlContext" class="interfaceViewportControlContext"></div>';
	
	aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
					
	aHTML[++h] = '<tr id="trInterfaceViewportControl" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlDetails" class="interfaceViewportControl">Details</td>' +
					'</tr>';
					
	aHTML[++h] = '</table>';					
		
	//$('#divInterfaceViewportControl').html(aHTML.join(''));
	
	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<div id="divInterfaceMainDetails" class="divInterfaceViewportMain">&nbsp;</div>';
		
	$('#divInterfaceMain').html(aHTML.join(''));
		
	$('#tdInterfaceViewportControlDetails').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainDetails");
		interfaceSetupDetails();
	})
	
}

function interfaceSetupShow(aParam, oXML)
{

	var iActionID = -1;
	var dStartDate = new Date();
	var dEndDate = dStartDate;
	var sXHTMLElementID;
	var iOffsetHeight = 5;
	var iOffsetLeft = 0;
	
	if (aParam != undefined)
	{
		if (aParam.setupObjectContextID != undefined) {iSetupObjectContextID = aParam.setupObjectContextID};
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID};
		if (aParam.offsetHeight != undefined) {iOffsetHeight = aParam.offsetHeight};
		if (aParam.offsetLeft != undefined) {iOffsetLeft = aParam.offsetLeft};
	}	

	if ($('#divInterfaceMasterDialog').attr('onDemandSource') == sXHTMLElementID)
	{
		$('#divInterfaceMasterDialog').hide("slide", { direction: "up" }, 500);
		$('#divInterfaceMasterDialog').attr('onDemandSource', '');
	}
	else
	{
		$('#divInterfaceMasterDialog').attr('onDemandSource', sXHTMLElementID);
	
		if (iActionID != -1 && oXML == undefined)
		{
			var sParam = gsSetupMethod + '_SEARCH&rf=XML&rows=100';
			sParam += 'id=' + iSetupObjectContextID;
		
			$.ajax(
			{
				type: 'GET',
				url: '/ondemand/setup/?' + sParam,
				dataType: 'xml',
				success: function(data) {interfaceSetupShow(aParam, data)}
			});	
		}
		else
		{
			var aHTML = [];
			var h = -1;
			
			aHTML[++h] = '<table id="tableInterfaceMasterActionAdd" class="interfaceDialogMedium">';
			
			aHTML[++h] = '<tr id="trInterfaceActionCalendarAddSubjectValue" class="interfaceMainText">' +
								'<td id="tdInterfaceActionCalendarAddSubjectValue" class="interfaceMainText">' +
								'<input onDemandType="TEXT" id="inputMasterActionAddSubject" class="inputInterfaceMainText';
								
			if (iActionID == -1)
			{	
				aHTML[++h] = ' interfaceMasterWatermark" value="Subject">';
			}
			else
			{
				aHTML[++h] = '">'
			}
			
			aHTML[++h] = '</td></tr>';
			
			aHTML[++h] = '<tr><td id="tdInterfaceMasterActionAddDescriptionValue" class="interfaceMain">' +
								'<textarea rows="5" cols="35" onDemandType="TEXTMULTI" id="inputInterfaceMasterActionAddDescription" class="inputInterfaceMainTextMultiSmall';

			if (iActionID == -1)
			{	
				aHTML[++h] = ' interfaceMasterWatermark">Add more text here, if required.</textarea>';
			}
			else
			{
				aHTML[++h] = '"></textarea>'
			}

			aHTML[++h] = '</td></tr>';

			aHTML[++h] = '<tr id="trInterfaceMasterActionAddBusiness" class="interfaceMain">' +
								'<td id="tdInterfaceMasterActionAddBusiness" class="interfaceMain">' +
								'Business' +
								'</td></tr>' +
								'<tr id="trInterfaceMasterActionAddBusinessValue" class="interfaceMainSelect">' +
								'<td id="tdInterfaceMasterActionAddBusinessValue" class="interfaceMainSelect">' +
								'<input onDemandType="SELECT" id="inputInterfaceMasterActionAddBusiness" class="inputInterfaceMainSelect"' +
									' onDemandMethod="/ondemand/contact/?method=CONTACT_BUSINESS_SEARCH"' +
									' onDemandColumns="tradename">' +
								'</td></tr>';
								
			
			aHTML[++h] = '<tr id="trInterfaceMasterActionAddPerson" class="interfaceMain">' +
								'<td id="tdInterfaceMasterActionAddPerson" class="interfaceMain">' +
								'Person' +
								'</td></tr>' +
								'<tr id="trInterfaceMasterActionAddPersonValue" class="interfaceMainSelect">' +
								'<td id="tdInterfaceMasterActionAddPersonValue" class="interfaceMainSelect">' +
								'<input onDemandType="SELECT" id="inputInterfaceMasterActionAddPerson" class="inputInterfaceMainSelectContact"' +
									' onDemandMethod="/ondemand/contact/?method=CONTACT_PERSON_SEARCH"' +
									' onDemandParent="inputInterfaceMasterActionAddBusiness">' +
								'</td></tr>';									
								
								
			aHTML[++h] = '<tr><td id="tdInterfaceMasterActionAddHighPriority" class="interfaceMain">' +
								'<input type="checkbox" id="inputInterfaceMasterActionAddNoteHighPriority"/>&nbsp;High Priority?<td></tr>';
								
				
			aHTML[++h] = '<tr><td>';
			
				aHTML[++h] = '<table class="interfaceSearchFooterMedium">';
				
				aHTML[++h] = '<tr><td style="text-align: right;">' +
									'<span id="spanSave">Save</span>' +
									'<span id="spanCancel">Cancel</span>' +
									'<td></tr>';
				
				aHTML[++h] = '</table>';						

			aHTML[++h] = '</td></tr>';	
				
			aHTML[++h] = '</table>';		
			
			var oElement = $('#' + sXHTMLElementID)
			
			$('#divInterfaceMasterDialog').html('');
			$('#divInterfaceMasterDialog').show();
			$('#divInterfaceMasterDialog').offset(
				{
					top: $(oElement).offset().top + $(oElement).height() + iOffsetHeight,
					left: $(oElement).offset().left + iOffsetLeft
				});
			$('#divInterfaceMasterDialog').html(aHTML.join(''));
			
			$('#spanCancel').button(
				{
					text: false,
					 icons: {
						 primary: "ui-icon-close"
					}
				})
				.click(function() {
					$('#divInterfaceMasterDialog').slideUp(500);
					$('#divInterfaceMasterDialog').html('');
				})
				.css('width', '20px')
				.css('height', '20px')

			$('#spanSave').button(
				{
					text: false,
					 icons: {
						 primary: "ui-icon-check"
					}
				})
				.click(function() {
					interfaceActionQuickSave({
							id: iActionID,
							date: $.fullCalendar.formatDate(dStartDate, "dd MMM yyyy") + 
										' ' + $.fullCalendar.formatDate(dStartDate, "HH:mm"),
							endDate: $.fullCalendar.formatDate(dEndDate, "dd MMM yyyy") + 
										' ' + $.fullCalendar.formatDate(dEndDate, "HH:mm"),
							subject: $('#inputActionCalendarAddSubject').val(),
							description: $('#inputActionCalendarAddDescription').val(),
							priority: ($('#inputActionCalendarAddHighPriority').attr('checked')?3:2),
							calendarXHTMLElementID: 'divInterfaceMainCalendar'
							});
					
					$('#divInterfaceMasterDialog').slideUp(500);
					$('#divInterfaceMasterDialog').html('');

				})
				.css('width', '30px')
				.css('height', '20px')
			
			if (oXML != undefined)
			{
				var oRoot = oXML.getElementsByTagName('ondemand').item(0);
				
				if (oRoot.childNodes.length != 0)
				{
					var oRow = oRoot.childNodes.item(0);
					
					$('#inputActionCalendarAddSubject').val(onDemandXMLGetData(oRow, 'subject'));
					$('#inputActionCalendarAddDescription').val(onDemandXMLGetData(oRow, 'description'));
				}	
			}	
		}
	}
}

function interfaceSetupShow2(oXML)
{

	$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
	interfaceSetupViewport();
	
	goSetupContextXML = oXML;
	
	var aHTML = [];
	var h = -1;
	
	oRoot = oXML.getElementsByTagName('ondemand').item(0);
	
	if (true)
	{
		var oRow = oRoot.childNodes.item(0);
				
		$('#divInterfaceViewportControlContext').html(onDemandXMLGetData(oRow, 'title') + 
					'<br />' + 
					'<span class="interfaceContextName">' + gsSetupName + '</span><br /><br />');
				
		aHTML[++h] = '<table id="tableInterfaceMainDetails" class="interfaceMainDetails">';
		aHTML[++h] = '<tr id="trInterfaceMainDetailsRow1" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsColumn1" class="interfaceMain">' +
						'</td>' +
						'<td id="tdInterfaceMainDetailsColumn2" class="interfaceMain">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMainDetails').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn1" class="interfaceMain">';
		
		aHTML[++h] = '<tr><td id="tdInterfaceMainDetailsTitle" class="interfaceMain">' +
						'Title' +
						'</td></tr>';
		
		aHTML[++h] = '<tr><td id="tdInterfaceMainDetailsTitleValue" class="interfaceMain">' +
						'<input onDemandType="TEXT" id="inputInterfaceMainDetailsTitle" class="inputInterfaceMainText">' +
						'</td></tr>';
		
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainDetailsColumn1').html(aHTML.join(''));
		
		if (oRoot.childNodes.length != 0)
		{
			$('#inputInterfaceMainDetailsTitle').val(onDemandXMLGetData(oRow, 'title'));
		}
			
	}	
}

function interfaceSetupRemove(sXHTMLElementId)
{
	var aSearch = sXHTMLElementId.split('-');
	var sElementId = aSearch[0];
	var sSearchContext = aSearch[1];
	
	if (confirm('Are you sure?'))
	{
		var aMethod = gsSetupMethod.split('_');
		var sEndpoint = aMethod[0];
		var sParam = '/ondemand/' + sEndpoint + '/?method=' + gsSetupMethod + '_MANAGE&remove=1';
		var sData = 'id=' + sSearchContext;
					
		$.ajax(
			{
				type: 'POST',
				url: sParam,
				data: sData,
				dataType: 'text',
				success: function(data){$('#' + sXHTMLElementId).parent().fadeOut(500)}
			});
	}
}

function interfaceSetupElementEditStart(sElementId)
{
	var aSearch = sElementId.split('-');
	var sActionElementId = '#' + aSearch[0] + '-options-' + aSearch[2];

	if (1==0)
	{
		$('td.interfaceActionsOptions').button('destroy');
		
		$(sActionElementId).button(
		{
			icons: 
			{
				primary: "ui-icon-disk"
			}
		});
	}
	
	var sHTML = $('#' + sElementId).html();
	
	var sElementInputId = sElementId.replace('td', 'input');
	
	sHTML = '<input style="width:100%;" onDemandType="TEXT" id="' + sElementInputId + '" class="inputInterfaceMainValue" ' +
							'value="' + sHTML + '">'
	
	$('#' + sElementId).html(sHTML);
	$('#' + sElementInputId).focus();
	
	$('#' + sElementInputId).blur(function(event)
	{
		interfaceSetupElementEditStop(sElementId);
	});
}

function interfaceSetupElementEditStop(sElementId)
{
	
	interfaceSetupElementEditSave(sElementId);
	
	var aSearch = sElementId.split('-');
	var sHTML = $('#' + sElementId.replace('td', 'input')).val();

	$('#' + sElementId).html(sHTML);

}

function interfaceSetupElementEditSave(sElementId)
{
	var aMethod = gsSetupMethod.split('_');
	var sEndpoint = aMethod[0];
	var aElement = sElementId.split('-');
	var sParam = '/ondemand/' + sEndpoint + '/?method=' + gsSetupMethod + '_MANAGE&id=' + aElement[1];
	sParam += '&title=' + $('#' + sElementId.replace('td', 'input')).val();
	
	if (aElement[1] == '' && $('#' + sElementId.replace('td', 'input')).val() == '')
	{
		$('#tableInterfaceSetupHomeMostLikely tr:first').next().fadeOut(500);	
		$('#spanInterfaceMasterViewportControlNew').button({disabled: false});
		$('#spanInterfaceSetupAdd').button({disabled: false});
	}
	else
	{
		$.ajax(
		{
			type: 'POST',
			url: sParam,
			dataType: 'text',
			success: function(data) 
					{
						var aReturn = data.split('|');
						if (aReturn[2] == 'ADDED')
						{
							$('#tdSetup-').attr('id','tdSetup-' + aReturn[3]);
							
							$('td.interfaceHomeMostLikely').unbind('click');
								
							$('td.interfaceHomeMostLikely').click(function(event)
								{
									interfaceSetupElementEditStart(event.target.id);
								});

							$('#tdSetup_delete-').attr('id','tdSetup_delete-' + aReturn[3]);
							
							$('.interfaceMainRowOptionsDelete').button({
									text: false,
									 icons: {
										 primary: "ui-icon-close"
									}
								})
								.click(function() {
									interfaceSetupRemove(this.id)
								})
								.css('width', '15px')
								.css('height', '20px')
						}
						interfaceMasterStatus('Saved')
						$('#spanInterfaceMasterViewportControlNew').button({disabled: false});
						$('#spanInterfaceSetupAdd').button({disabled: false});
					}
		});
	}			
}