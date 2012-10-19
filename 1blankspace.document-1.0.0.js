/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 
function interfaceDocumentMasterViewport(oParam)
{
	ns1blankspace.object = 14;
	ns1blankspace.objectName = 'Document';
	ns1blankspace.objectContextData = undefined;
	ns1blankspace.objectContext = -1;
	
	var bShowHome = true;
	var bNew = false;
	
	if (oParam != undefined)
	{
		if (oParam.showHome != undefined) {bShowHome = oParam.showHome}
		if (oParam.showNew != undefined) {bNew = oParam.showNew}
		if (bNew) {interfaceDocumentNew()};
	}	
		
	ns1blankspaceReset();		
			
	if (bShowHome)
	{
		ns1blankspaceViewportDestination({
			newDestination: 'interfaceDocumentMasterViewport({showHome: true});',
			move: false
			})		
	}
			
	$('#divns1blankspaceViewportControlSet').button(
	{
		label: "Documents"
	});
	
	$('#inputns1blankspaceViewportControlSearch').keyup(function(event)
	{
		if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
        ns1blankspace.timer.delayCurrent = setTimeout("interfaceDocumentSearch('inputns1blankspaceViewportControlSearch')", ns1blankspace.option.typingWait);
	});
	
	$('#spanns1blankspaceViewportControlSearch').click(function(event)
	{
		interfaceDocumentSearch('inputns1blankspaceViewportControlSearch');
	});
	
	$('#spanns1blankspaceViewportControlSearchOptions').click(function(event)
	{
		interfaceDocumentSearchOptions();
	});
	
	$('#spanns1blankspaceViewportControlNew').click(function(event)
	{
		interfaceDocumentNew();
	})
	
	$('#spanns1blankspaceViewportControlNewOptions').click(function(event)
	{
		interfaceDocumentNewOptions();
	});
	
	$('#spanns1blankspaceViewportControlAction').click(function(event)
	{
		interfaceDocumentSave();
	});
	
	$('#spanns1blankspaceViewportControlAction').button({disabled: true});
	
	$('#spanns1blankspaceViewportControlActionOptions').click(function(event)
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

		ns1blankspaceViewportActionShow(this, aHTML.join(''), "interfaceDoocumentActionOptionsBind()");
	});
	
	$('#spanns1blankspaceViewportControlActionOptions').button({disabled: true});
	
	$('#spanns1blankspaceViewportControlSetup').click(function(event)
	{
		interfaceDocumentSetup();
	});
	
	$('#spanns1blankspaceViewportControlSetupOptions').click(function(event)
	{
		interfaceDocumentSetupOptions();
	});
	
	$('#spanns1blankspaceViewportControlHelp').click(function(event)
	{
		interfaceDocumentHelp();
	});
	
	$('#spanns1blankspaceViewportControlHelpOptions').click(function(event)
	{
		interfaceDocumentHelpOptions();
	});
	
	$('td.interfaceViewportMasterControlBrowse').click(function(event)
	{
		interfaceDocumentSearch(event.target.id, {source: ns1blankspace.data.searchSource.browse});
	});
	
	$('td.interfaceViewportMasterControlBrowseAll').click(function(event)
	{
		interfaceDocumentSearch(event.target.id, {source: ns1blankspace.data.searchSource.browse});
	});
	
	if (ns1blankspace.option.setFocus) {$('#inputns1blankspaceViewportControlSearch').focus()};
	
	$('#divInterfaceViewportControl').html('');	
		
	if (bShowHome) {interfaceDocumentHomeShow()};
}

function interfaceDocumentHomeShow(oResponse)
{
	if (oResponse == undefined)
	{
		var aHTML = [];
		var h = -1;
					
		aHTML[++h] = '<table id="tableInterfaceViewportMain" class="interfaceViewportMain">';
		aHTML[++h] = '<tr id="trInterfaceViewportMain" class="interfaceViewportMain">' +
						'<td id="tdInterfaceProjectHomeMostLikely" class="interfaceViewportMain">' +
						ns1blankspace.xhtml.loading +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMain').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
					
		aHTML[++h] = '<table>';
		aHTML[++h] = '<tr>' +
						'<td id="ns1blankspaceViewportDocumentLarge" class="ns1blankspaceViewportImageLarge">' +
						'&nbsp;' + 
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';		
		
		$('#divInterfaceViewportControl').html(aHTML.join(''));	
		
		$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
		
		var oSearch = new AdvancedSearch();
		oSearch.method = 'DOCUMENT_SEARCH';
		oSearch.addField('title');
		oSearch.rows = 10;
		oSearch.sort('modifieddate', 'desc');
		
		oSearch.getResults(function(data) {interfaceDocumentHomeShow(data)});
		
		/*
		var sParam = 'method=DOCUMENT_SEARCH';
		sParam += '&rows=10';
				
		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/document/?' + sParam,
			dataType: 'json',
			success: function(data) {interfaceDocumentHomeShow(data)}
		});
*/
		
	}
	else
	{
		var aHTML = [];
		var h = -1;

		if (oResponse.data.rows.length == 0)
		{
			aHTML[++h] = '<table id="tableInterfaceDocumentHomeMostLikely">';
			aHTML[++h] = '<tr class="trInterfaceDocumentHomeMostLikelyNothing">';
			aHTML[++h] = '<td class="tdInterfaceDocumentHomeMostLikelyNothing">Click New to create a document.</td>';
			aHTML[++h] = '</tr>';
			aHTML[++h] = '</table>';
		}
		else
		{
			aHTML[++h] = '<table id="tableInterfaceDocumentHomeMostLikely">';
			aHTML[++h] = '<tr>';
			aHTML[++h] = '<td class="interfaceMain">MOST LIKELY</td>';
			aHTML[++h] = '</tr>';
			
			$.each(oResponse.data.rows, function()
			{
				aHTML[++h] = '<tr class="interfaceMainRow">';
				
				aHTML[++h] = '<td id="interfaceProjectHomeMostLikely_Title-' + this.id + 
										'" class="interfaceHomeMostLikely">' +
										this.title +
										'</td>';
				
				aHTML[++h] = '</tr>';
			});
			
			aHTML[++h] = '</tbody></table>';
		}
		
		$('#tdInterfaceProjectHomeMostLikely').html(aHTML.join(''));
	
		$('td.interfaceHomeMostLikely').click(function(event)
		{
			interfaceDocumentSearch(event.target.id, {source: 1});
		});
	}
}

function interfaceDocumentSearch(sXHTMLElementId, oParam)
{
	
	var aSearch = sXHTMLElementId.split('-');
	var sElementId = aSearch[0];
	var sSearchContext = aSearch[1];
	var iMinimumLength = 3;
	var iSource = ns1blankspace.data.searchSource.text;
	var sSearchText;
	var iMaximumColumns = 1;
	var iRows = 10;
	var bWebsiteOnly = false;
	
	if (oParam != undefined)
	{
		if (oParam.source != undefined) {iSource = oParam.source}
		if (oParam.searchText != undefined) {sSearchText = oParam.searchText}
		if (oParam.rows != undefined) {iRows = oParam.rows}
		if (oParam.searchContext != undefined) {sSearchContext = oParam.searchContext}
		if (oParam.minimumLength != undefined) {iMinimumLength = oParam.minimumLength}
		if (oParam.maximumColumns != undefined) {iMaximumColumns = oParam.maximumColumns}
		if (oParam.websiteOnly != undefined) {bWebsiteOnly = oParam.websiteOnly}
	}
	
	if (sSearchContext != undefined && iSource != ns1blankspace.data.searchSource.browse)
	{
		$('#divInterfaceViewportControl').html(ns1blankspace.xhtml.loading);
		
		ns1blankspace.objectContext = sSearchContext;

		var oSearch = new AdvancedSearch();
		oSearch.method = 'DOCUMENT_SEARCH';
		oSearch.addField('title,summary,keywords,url,status,statustext,websitedisplay,website,websitetext,style,internal,content,type,typetext');
		oSearch.addFilter('id', 'EQUAL_TO', ns1blankspace.objectContext);
		oSearch.getResults(function(data) {interfaceDocumentShow(oParam, data)});
	}
	else
	{
		if (sSearchText == undefined)
		{
			sSearchText = $('#inputns1blankspaceViewportControlSearch').val();
		}	
		
		if (iSource == ns1blankspace.data.searchSource.browse)
		{
			iMinimumLength = 1;
			iMaximumColumns = 4;
			sSearchText = aSearch[1];
			if (sSearchText == '#') {sSearchText = '[0-9]'}
			sElementId = 'tableInterfaceViewportMasterBrowse';
		}
		
		if (sSearchText.length >= iMinimumLength || iSource == ns1blankspace.data.searchSource.browse)
		{
			
			ns1blankspaceOptionsSetPosition(sElementId);
			ns1blankspaceSearchStart(sElementId);
			
			var sParam = 'method=DOCUMENT_SEARCH' +
								'&quicksearch=' + sSearchText + 
								'&xhtmlcontext=' + sXHTMLElementId;

			if (bWebsiteOnly)
			{
				sParam += '&foldertitle=[My Website Documents]';
			}	
								
			$.ajax(
			{
				type: 'GET',
				url: '/ondemand/document/?' + sParam,
				dataType: 'json',
				success: function(data) {interfaceDocumentSearchShow(oParam, data)}
			});
		}
	};	
}

function interfaceDocumentSearchShow(oParam, oResponse)
{
	var iColumn = 0;
	var aHTML = [];
	var h = -1;
	var	iMaximumColumns = 1;
		
	if (oResponse.data.rows.length == 0)
	{
		$('#divns1blankspaceViewportControlOptions').hide();
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
			
			aHTML[++h] = '<td class="interfaceSearch" id="' +
							'-' + this.id + '">' +
							this.title + '</td>';
			
			if (iColumn == iMaximumColumns)
			{
				aHTML[++h] = '</tr>'
				iColumn = 0;
			}	
		});
    	
		aHTML[++h] = '</tbody></table>';

		$('#divns1blankspaceViewportControlOptions').html(aHTML.join(''));
		$('#divns1blankspaceViewportControlOptions').show(ns1blankspace.option.showSpeedOptions);
		
		$('td.interfaceSearch').click(function(event)
		{
			$('#divns1blankspaceViewportControlOptions').html('&nbsp;');
			$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions)
			interfaceDocumentSearch(event.target.id, 1);
		});
	}	
	
	ns1blankspaceSearchStop();	
}

function interfaceDocumentViewport()
{
	
	var aHTML = [];
	var h = -1;

	if (ns1blankspace.option.richTextEditing)
	{	
		if (tinyMCE.getInstanceById('inputInterfaceMainEditText'))
		{
			tinyMCE.get('inputInterfaceMainEditText').remove();
			$('#inputInterfaceMainEditText').remove();
		}	
	}
	
	aHTML[++h] = '<div id="divInterfaceViewportControlContext" class="interfaceViewportControlContext"></div>';
	
	aHTML[++h] = '<table id="tableInterfaceViewportControl" class="interfaceViewportControl">';
	
	aHTML[++h] = '<tr id="trInterfaceViewportControl1" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlSummary" class="interfaceViewportControl interfaceViewportControlHighlight">Summary</td>' +
					'</tr>';
					
	aHTML[++h] = '<tr id="trInterfaceViewportControl2" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlDetails" class="interfaceViewportControl">Details</td>' +
					'</tr>';
				
	aHTML[++h] = '<tr id="trInterfaceViewportControl2" class="interfaceViewportControl">' +
					'<td id="tdInterfaceViewportControlEdit" class="interfaceViewportControl">Edit</td>' +
					'</tr>';			
					
	aHTML[++h] = '</table>';					
			
	$('#divInterfaceViewportControl').html(aHTML.join(''));
	
	var aHTML = [];
	var h = -1;

	aHTML[++h] = '<div id="divInterfaceMainSummary" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainDetails" class="divInterfaceViewportMain"></div>';
	aHTML[++h] = '<div id="divInterfaceMainEdit" class="divInterfaceViewportMain"></div>';
		
	$('#divInterfaceMain').html(aHTML.join(''));
	
	$('#tdInterfaceViewportControlSummary').click(function(event)
	{
		ns1blankspaceMainViewportShow("#divInterfaceMainSummary");
		interfaceDocumentSummary();
	});
	
	$('#tdInterfaceViewportControlDetails').click(function(event)
	{
		ns1blankspaceMainViewportShow("#divInterfaceMainDetails");
		interfaceDocumentDetails();
	});
	
	$('#tdInterfaceViewportControlEdit').click(function(event)
	{
		ns1blankspaceMainViewportShow("#divInterfaceMainEdit");
		interfaceDocumentEdit();
	});
}

function interfaceDocumentShow(oParam, oResponse)
{
	$('#divns1blankspaceViewportControlOptions').hide(ns1blankspace.option.hideSpeedOptions);
	interfaceDocumentViewport();

	var aHTML = [];
	var h = -1;
	
	if (oResponse.data.rows.length == 0)
	{
		ns1blankspace.objectContextData = undefined;
		
		aHTML[++h] = '<table><tbody><tr><td class="interfaceMainRowNothing" valign="top">Sorry can\'t find the document.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		ns1blankspace.objectContextData = oResponse.data.rows[0];
				
		$('#divInterfaceViewportControlContext').html(ns1blankspace.objectContextData.title);
		$('#spanns1blankspaceViewportControlAction').button({disabled: false});
		$('#spanns1blankspaceViewportControlActionOptions').button({disabled: false});
		
		ns1blankspaceViewportDestination({
			newDestination: 'interfaceDocumentMasterViewport({showHome: false});interfaceDocumentSearch("-' + ns1blankspace.objectContext + '")',
			move: false
			})
			
		ns1blankspaceObjectViewportHistory({functionDefault: 'interfaceDocumentSummary()'});
	}	
}		
		
function interfaceDocumentSummary()
{
	var aHTML = [];
	var h = -1;
	
	if (ns1blankspace.objectContextData == undefined)
	{
		aHTML[++h] = '<table><tbody><tr><td valign="top" class="interfaceMainRowNothing">Sorry can\'t find document.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMainSummary').html(aHTML.join(''));
	}
	else
	{
		aHTML[++h] = '<table id="tableInterfaceMainSummary" class="interfaceMain">';
		aHTML[++h] = '<tr id="trInterfaceMainSummaryRow1" class="interfaceMainRow1">' +
					'<td id="tdInterfaceMainSummaryColumn1" class="interfaceMainColumn1">' +
						'</td>' +
						'<td id="tdInterfaceMainSummaryColumn2" class="interfaceMainColumn2">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMainSummary').html(aHTML.join(''));
	
		var aHTML = [];
		var h = -1;
	
		if (ns1blankspace.objectContextData.summary == '')
		{
			aHTML[++h] = '<table><tbody><tr><td valign="top" class="interfaceMainRowNothing">There is no document summary.</td></tr>';
			aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
		}
		else
		{	
			aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMainColumn1">';
		
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummarySummary" class="interfaceMainSummary">&nbsp;</td></tr>' +
							'<tr><td id="tdInterfaceMainSummarySummaryValue" class="interfaceMainSummaryValue">' +
							ns1blankspace.objectContextData.summary +
							'</td></tr>';
							
			aHTML[++h] = '</table>';					
		}
		
		$('#tdInterfaceMainSummaryColumn1').html(aHTML.join(''));

		var aHTML = [];
		var h = -1;	
		
		aHTML[++h] = '<table id="tableInterfaceMainColumn2" class="interfaceMainColumn2">';
								
		 aHTML[++h] = '<tr><td id="tdInterfaceMainSummaryPDF" class="interfaceMainColumn2Action">' +
						 '<a href="#" id="aInterfaceMainSummaryPDF">View as PDF</a>' +
						'</td></tr>';
		
						
		aHTML[++h] = '</table>';					
		
		//$('#tdInterfaceMainSummaryColumn2').html(aHTML.join(''));	
	
		$('#aInterfaceMainSummaryPDF').click(function(event)
		{
			interfaceDocumentPDF();
		});
	}	
}

function interfaceDocumentDetails()
{
	var aHTML = [];
	var h = -1;
	
	if ($('#divInterfaceMainDetails').attr('onDemandLoading') == '1')
	{
		$('#divInterfaceMainDetails').attr('onDemandLoading', '');
		
		aHTML[++h] = '<table id="tableInterfaceMainDetails" class="interfaceMainDetails">';
		aHTML[++h] = '<tr id="trInterfaceMainDetailsRow1" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsColumn1" class="interfaceMainColumn1">' +
						'</td>' +
						'<td id="tdInterfaceMainDetailsColumn2" class="interfaceMainColumn2">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMainDetails').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
		
		aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn1" class="interfaceMain">';
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsTitle" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsTitle" class="interfaceMain">' +
						'Title' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsTitleValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsTitleValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainDetailsTitle" class="inputInterfaceMainText">' +
						'</td></tr>';
	
		aHTML[++h] = '<tr id="trInterfaceMainDetailsURL" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsURL" class="interfaceMain">' +
						'URL' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsURLValue" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsURLValue" class="interfaceMainText">' +
						'<input id="inputInterfaceMainDetailsURL" class="inputInterfaceMainText">' +
						'</td></tr>';
	
		aHTML[++h] = '<tr id="trInterfaceMainDetailsSharing" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsSharing" class="interfaceMain">' +
						'Sharing' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsSharing" class="interfaceMainText">' +
						'<td id="tdInterfaceMainDetailsFromEmailValue" class="interfaceMainText">' +
						'<input type="radio" id="radioPublicY" name="radioPublic" value="Y"/>Public' +
						'<br /><input type="radio" id="radioPublicN" name="radioPublic" value="N"/>Private' +
						'</td></tr>';
	
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainDetailsColumn1').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
			
		aHTML[++h] = '<table id="tableInterfaceMainDetailsColumn2" class="interfaceMain">';
		
		aHTML[++h] = '<tr id="trInterfaceMainDetailsSummary" class="interfaceMain">' +
						'<td id="tdInterfaceMainDetailsSummary class="interfaceMain">' +
						'Document Summary' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsSummaryValue" class="interfaceMainTextMulti">' +
						'<td id="tdInterfaceMainDetailsSummaryValue" class="interfaceMainTextMulti">' +
						'<textarea rows="10" cols="35" id="inputInterfaceMainDetailsSummary" class="inputInterfaceMainTextMulti"></textarea>' +
						'</td></tr>';
		
		aHTML[++h] = '</table>';					
			
		$('#tdInterfaceMainDetailsColumn2').html(aHTML.join(''));

		if (ns1blankspace.objectContextData != undefined)
		{
			$('#inputInterfaceMainDetailsTitle').val(ns1blankspace.objectContextData.title);
			$('#inputInterfaceMainDetailsURL').val(ns1blankspace.objectContextData.url);
			$('#inputInterfaceMainDetailsSummary').val(ns1blankspace.objectContextData.summary);
			$('[name="radioPublic"][value="' + ns1blankspace.objectContextData.public + '"]').attr('checked', true);
		}
		
	}	
}

function interfaceDocumentEdit(sReturn)
{	
	if ($('#divInterfaceMainEdit').attr('onDemandLoading') == '1')
	{
		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table id="tableInterfaceMainEdit" class="interfaceMain">';
		aHTML[++h] = '<tr id="trInterfaceMainEditRow1" class="interfaceMain">' +
						'<td id="tdInterfaceMainEditColumn1" class="interfaceMain">' +
						'</td>' +
						'<td id="tdInterfaceMainEditColumn2" class="interfaceMain">' +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
			
		$('#divInterfaceMainEdit').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
	
		aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMain">';
				
		aHTML[++h] = '<tr id="trInterfaceMainEditText" class="interfaceMain">' +
						'<td id="tdInterfaceMainEditText" class="interfaceMain" style="text-align:right;">' +
						'<a href="#" id="aInterfaceMainEditPDF">View as PDF</a>' +
						'</td></tr>' +
						'<tr id="trInterfaceMainDetailsEditTextValue" class="interfaceMainTextMulti">' +
						'<td id="tdInterfaceMainDetailsEditTextValue" class="interfaceMainTextMulti">' +
						'<textarea rows="10" cols="60" onDemandType="TEXTMULTI" name="inputInterfaceMainEditText" id="inputInterfaceMainEditText" class="inputInterfaceMainTextMultiLarge tinymceAdvanced"></textarea>' +
						'</td></tr>';
						
		aHTML[++h] = '</table>';					
		
		$('#tdInterfaceMainEditColumn1').html(aHTML.join(''));
			
		$('#aInterfaceMainEditPDF').click(function(event)
		{
			interfaceDocumentPDF();
		});
		
		if (sReturn == undefined)
		{
			if (ns1blankspace.objectContext != -1)
			{
				sParam = 'method=DOCUMENT_CONTENT_SEARCH&id=' + ns1blankspace.objectContext;

				$.ajax(
				{
					type: 'GET',
					cache: false,
					url: '/ondemand/document/?' + sParam,
					dataType: 'text',
					success: interfaceDocumentEdit
				});
			}
			else
			{
				interfaceDocumentEdit("OK|");
			}
			
		}
		else
		{
		
			$('#divInterfaceMainEdit').attr('onDemandLoading', '');
			
			var sHTML = sReturn;
			
			$('#inputInterfaceMainEditText').val(sHTML);
				
			tinyMCE.init(
			{
				mode : "none",
				height : "415px", 
				width : "100%",
				theme : "advanced",

				plugins : "table,advimage,advlink,emotions,iespell,insertdatetime,templateFields,preview,media,fullscreen,print,visualchars,nonbreaking,pagebreak,style,paste,searchreplace,print,contextmenu", 

				theme_advanced_buttons1_add_before : "forecolor,backcolor", 
				theme_advanced_buttons1_add : "fontselect,fontsizeselect", 
		 
				theme_advanced_buttons2_add : "separator,insertdate,inserttime,preview,zoom,separator,nonbreaking,pagebreak,visualchars", 
				theme_advanced_buttons2_add_before: "cut,copy,paste,pasteword,separator,search,replace,separator", 
				
				theme_advanced_buttons3_add_before : "tablecontrols,separator", 
				theme_advanced_buttons3_add : "emotions,iespell,fullscreen,print,templateFields,media,selectall,advhr",
		 
				
				plugin_insertdate_dateFormat : "%d-%m-%y", 
				plugin_insertdate_timeFormat : "%H:%M:%S", 
			
				theme_advanced_toolbar_location : "top",
				theme_advanced_toolbar_align : "left",
				theme_advanced_resizing : true,
			
				font_size_style_values : "8pt,10pt,12pt,14pt,18pt,24pt,36pt",
				
				extended_valid_elements : "style,input[accept|accesskey|align<bottom?left?middle?right?top|alt|checked<checked|class|dir<ltr?rtl|disabled<disabled|id|ismap<ismap|lang|maxlength|name|onblur|onclick|ondblclick|onfocus|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|onselect|readonly<readonly|size|src|style|tabindex|title|type<button?checkbox?file?hidden?image?password?radio?reset?submit?text|usemap|value],select[class|dir<ltr?rtl|disabled<disabled|id|lang|multiple<multiple|name|onblur|onchange|onclick|ondblclick|onfocus|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|size|style|tabindex|title],ol[class|compact<compact|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|start|style|title|type],div[align<center?justify?left?right|class|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|style|title],li[class|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|style|title|type|value],iframe[src|width|height|name|align|frameborder|scrolling|marginheight|marginwidth]",

				fullscreen_new_window : true, 
				fullscreen_settings : 
				{ 
					theme_advanced_path_location : "top" 
				}, 
				relative_urls : false, 
				remove_script_host : false, 
				convert_urls : false, 
				visual : true, 
				gecko_spellcheck : true,
				content_css : ns1blankspace.xhtml.editorCSS,
				
				external_link_list_url : "/jscripts/ibcom/linkList.asp", 
				external_image_list_url : "/jscripts/ibcom/imageList.asp?LinkType=14&LinkId=" + ns1blankspace.objectContext, 
				media_external_list_url : "/jscripts/ibcom/mediaList.asp?LinkType=14&LinkId=" + ns1blankspace.objectContext,  TemplateLinkType : "0", 

			});				
			
			tinyMCE.execCommand('mceAddControl', false, 'inputInterfaceMainEditText');
					
		}	
	}	
}

function interfaceDocumentNew(oXML)
{
	if (oXML == undefined)
	{
		var sParam = 'method=CORE_GET_NEW&rf=XML';

		$.ajax(
		{
			type: 'GET',
			url: '/ondemand/core/?' + sParam,
			dataType: 'xml',
			success: interfaceDocumentNew
		});
	}	
	else	
	{
		ns1blankspace.objectContext = -1;
		ns1blankspace.objectContextDataXML = oXML;
		interfaceDocumentViewport();
		$('#divInterfaceMainDetails').html(ns1blankspace.xhtml.loading);
		$('#divInterfaceMainDetails').attr('onDemandLoading', '1');
		$('#spanns1blankspaceViewportControlAction').button({disabled: false});
		$('#spanns1blankspaceViewportControlActionOptions').button({disabled: true});
		interfaceDocumentDetails();
	}	
}

function interfaceDocumentSave()
{
	var sData = '_=1';
	
	if (ns1blankspace.objectContext != -1)
	{
		sParam += '&select=' + ns1blankspace.objectContext	
	}	
		
	if ($('#divInterfaceMainDetails').html() != '')
	{
		sData += '&title=' + encodeURIComponent($('#inputInterfaceMainDetailsTitle').val());
		sData += '&url=' + encodeURIComponent($('#inputInterfaceMainDetailsURL').val());
		sData += '&public=' + $('input[name="radioPublic"]:checked').val();
		sData += '&summary=' + encodeURIComponent($('#inputInterfaceMainDetailsSummary').val());
	}
	
	if ($('#divInterfaceMainEdit').html() != '')
	{
		sData += '&details=' + encodeURIComponent(tinyMCE.get('inputInterfaceMainEditText').getContent());
	}
	
	$.ajax(
	{
		type: 'POST',
		url: ns1blankspaceEndpointURL('DOCUMENT_MANAGE'),
		data: sData,
		dataType: 'text',
		success: interfaceDocumentSaveProcess
	});
		
}

function interfaceDocumentSaveProcess(sReturn)
{
	if (ns1blankspace.objectContext == -1)
	{

		var aReturn = sReturn.split('|');
		var sParam = 'method=DOCUMENT_FOLDER_LINK_MANAGE';
		var sData = 'foldertitle=' + encodeURIComponent('[My Website Documents]');

		ns1blankspace.objectContext = aReturn[3];
		sData += '&select=' + aReturn[3];	
				
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/document/?' + sParam,
			data: sData,
			dataType: 'text',
			success: ns1blankspaceStatus('Saved')
		});
	
	}	
	else
	{
		ns1blankspaceStatus('Saved');
	}	
	
}

function interfaceDocumentPDF(oParam, sReturn)
{
	var sFilename = 'document_' + ns1blankspace.objectContext + '.pdf'
	var sXHTMLElementID = '';
	var sXHTMLContent;
	
	if (oParam != undefined)
	{
		if (oParam.filename != undefined) {sFilename = oParam.filename}
		if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
		if (oParam.xhtmlContent != undefined) {sXHTMLContent = oParam.xhtmlContent}
	}		

	if (sXHTMLContent == undefined)
	{
		if ($('#divInterfaceMainEdit').html() != '')
		{
			sXHTMLContent = tinyMCE.get('inputInterfaceMainEditText').getContent();
		}
		else
		{
		
		}
	
	}
	
	if (sXHTMLContent == undefined)
	{
		alert('Nothing to PDF!')
	}
	else
	{	
		if (sReturn == undefined)
		{
			var sParam = 'method=CORE_PDF_CREATE&rf=TEXT';
			var sData = 'object=' + ns1blankspace.object
			sData += '&objectcontext=' + ns1blankspace.objectContext;
			sData += '&filename=' + encodeURIComponent(sFilename);
			sData += '&xhtmlcontent=' + encodeURIComponent(sXHTMLContent);
			
			$.ajax(
			{
				type: 'POST',
				url: '/ondemand/core/?' + sParam,
				data: sData,
				dataType: 'text',
				success: function(data) {interfaceDocumentPDF(oParam, data)}
			});
		}	
		else	
		{
			var aReturn = sReturn.split('|');
			window.open('/download/' + aReturn[1]);
		}	
	}
}

