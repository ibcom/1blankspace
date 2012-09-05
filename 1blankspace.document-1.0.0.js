function interfaceDocumentMasterViewport(aParam)
{
	giObject = 14;
	gsObjectName = 'Document';
	goObjectContext = undefined;
	giObjectContext = -1;
	
	var bShowHome = true;
	var bNew = false;
	
	if (aParam != undefined)
	{
		if (aParam.showHome != undefined) {bShowHome = aParam.showHome}
		if (aParam.showNew != undefined) {bNew = aParam.showNew}
		if (bNew) {interfaceDocumentNew()};
	}	
		
	interfaceMasterReset();		
			
	if (bShowHome)
	{
		interfaceMasterViewportDestination({
			newDestination: 'interfaceDocumentMasterViewport({showHome: true});',
			move: false
			})		
	}
			
	$('#divInterfaceMasterViewportControlSet').button(
	{
		label: "Documents"
	});
	
	$('#inputInterfaceMasterViewportControlSearch').keyup(function(event)
	{
		if (giKeyPressTimeoutId != 0) {clearTimeout(giKeyPressTimeoutId)};
        giKeyPressTimeoutId = setTimeout("interfaceDocumentSearch('inputInterfaceMasterViewportControlSearch')", giWaitForStop);
	});
	
	$('#spanInterfaceMasterViewportControlSearch').click(function(event)
	{
		interfaceDocumentSearch('inputInterfaceMasterViewportControlSearch');
	});
	
	$('#spanInterfaceMasterViewportControlSearchOptions').click(function(event)
	{
		interfaceDocumentSearchOptions();
	});
	
	$('#spanInterfaceMasterViewportControlNew').click(function(event)
	{
		interfaceDocumentNew();
	})
	
	$('#spanInterfaceMasterViewportControlNewOptions').click(function(event)
	{
		interfaceDocumentNewOptions();
	});
	
	$('#spanInterfaceMasterViewportControlAction').click(function(event)
	{
		interfaceDocumentSave();
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

		interfaceMasterViewportActionShow(this, aHTML.join(''), "interfaceDoocumentActionOptionsBind()");
	});
	
	$('#spanInterfaceMasterViewportControlActionOptions').button({disabled: true});
	
	$('#spanInterfaceMasterViewportControlSetup').click(function(event)
	{
		interfaceDocumentSetup();
	});
	
	$('#spanInterfaceMasterViewportControlSetupOptions').click(function(event)
	{
		interfaceDocumentSetupOptions();
	});
	
	$('#spanInterfaceMasterViewportControlHelp').click(function(event)
	{
		interfaceDocumentHelp();
	});
	
	$('#spanInterfaceMasterViewportControlHelpOptions').click(function(event)
	{
		interfaceDocumentHelpOptions();
	});
	
	$('td.interfaceViewportMasterControlBrowse').click(function(event)
	{
		interfaceDocumentSearch(event.target.id, {source: giSearchSource_BROWSE});
	});
	
	$('td.interfaceViewportMasterControlBrowseAll').click(function(event)
	{
		interfaceDocumentSearch(event.target.id, {source: giSearchSource_BROWSE});
	});
	
	if (gbSetFocus) {$('#inputInterfaceMasterViewportControlSearch').focus()};
	
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
						gsLoadingXHTML +
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';					
		
		$('#divInterfaceMain').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
					
		aHTML[++h] = '<table>';
		aHTML[++h] = '<tr>' +
						'<td id="interfaceMasterViewportDocumentLarge" class="interfaceMasterViewportImageLarge">' +
						'&nbsp;' + 
						'</td>' +
						'</tr>';
		aHTML[++h] = '</table>';		
		
		$('#divInterfaceViewportControl').html(aHTML.join(''));	
		
		$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
		
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

function interfaceDocumentSearch(sXHTMLElementId, aParam)
{
	
	var aSearch = sXHTMLElementId.split('-');
	var sElementId = aSearch[0];
	var sSearchContext = aSearch[1];
	var iMinimumLength = 3;
	var iSource = giSearchSource_TEXT_INPUT;
	var sSearchText;
	var iMaximumColumns = 1;
	var iRows = 10;
	var bWebsiteOnly = false;
	
	if (aParam != undefined)
	{
		if (aParam.source != undefined) {iSource = aParam.source}
		if (aParam.searchText != undefined) {sSearchText = aParam.searchText}
		if (aParam.rows != undefined) {iRows = aParam.rows}
		if (aParam.searchContext != undefined) {sSearchContext = aParam.searchContext}
		if (aParam.minimumLength != undefined) {iMinimumLength = aParam.minimumLength}
		if (aParam.maximumColumns != undefined) {iMaximumColumns = aParam.maximumColumns}
		if (aParam.websiteOnly != undefined) {bWebsiteOnly = aParam.websiteOnly}
	}
	
	if (sSearchContext != undefined && iSource != giSearchSource_BROWSE)
	{
		$('#divInterfaceViewportControl').html(gsLoadingXHTML);
		
		giObjectContext = sSearchContext;

		var oSearch = new AdvancedSearch();
		oSearch.method = 'DOCUMENT_SEARCH';
		oSearch.addField('title,summary,keywords,url,status,statustext,websitedisplay,website,websitetext,style,internal,content,type,typetext');
		oSearch.addFilter('id', 'EQUAL_TO', giObjectContext);
		oSearch.getResults(function(data) {interfaceDocumentShow(aParam, data)});
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
			sSearchText = aSearch[1];
			if (sSearchText == '#') {sSearchText = '[0-9]'}
			sElementId = 'tableInterfaceViewportMasterBrowse';
		}
		
		if (sSearchText.length >= iMinimumLength || iSource == giSearchSource_BROWSE)
		{
			
			interfaceMasterOptionsSetPosition(sElementId);
			interfaceMasterSearchStart(sElementId);
			
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
				success: function(data) {interfaceDocumentSearchShow(aParam, data)}
			});
		}
	};	
}

function interfaceDocumentSearchShow(aParam, oResponse)
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

		$('#divInterfaceMasterViewportControlOptions').html(aHTML.join(''));
		$('#divInterfaceMasterViewportControlOptions').show(giShowSpeedOptions);
		
		$('td.interfaceSearch').click(function(event)
		{
			$('#divInterfaceMasterViewportControlOptions').html('&nbsp;');
			$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions)
			interfaceDocumentSearch(event.target.id, 1);
		});
	}	
	
	interfaceMasterSearchStop();	
}

function interfaceDocumentViewport()
{
	
	var aHTML = [];
	var h = -1;

	if (gbRichEdit)
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
		interfaceMasterMainViewportShow("#divInterfaceMainSummary");
		interfaceDocumentSummary();
	});
	
	$('#tdInterfaceViewportControlDetails').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainDetails");
		interfaceDocumentDetails();
	});
	
	$('#tdInterfaceViewportControlEdit').click(function(event)
	{
		interfaceMasterMainViewportShow("#divInterfaceMainEdit");
		interfaceDocumentEdit();
	});
}

function interfaceDocumentShow(aParam, oResponse)
{
	$('#divInterfaceMasterViewportControlOptions').hide(giHideSpeedOptions);
	interfaceDocumentViewport();

	var aHTML = [];
	var h = -1;
	
	if (oResponse.data.rows.length == 0)
	{
		goObjectContext = undefined;
		
		aHTML[++h] = '<table><tbody><tr><td class="interfaceMainRowNothing" valign="top">Sorry can\'t find the document.</td></tr>';
		aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
				
		$('#divInterfaceMain').html(aHTML.join(''));
	}
	else
	{
		goObjectContext = oResponse.data.rows[0];
				
		$('#divInterfaceViewportControlContext').html(goObjectContext.title);
		$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
		$('#spanInterfaceMasterViewportControlActionOptions').button({disabled: false});
		
		interfaceMasterViewportDestination({
			newDestination: 'interfaceDocumentMasterViewport({showHome: false});interfaceDocumentSearch("-' + giObjectContext + '")',
			move: false
			})
			
		interfaceMasterObjectViewportHistory({functionDefault: 'interfaceDocumentSummary()'});
	}	
}		
		
function interfaceDocumentSummary()
{
	var aHTML = [];
	var h = -1;
	
	if (goObjectContext == undefined)
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
	
		if (goObjectContext.summary == '')
		{
			aHTML[++h] = '<table><tbody><tr><td valign="top" class="interfaceMainRowNothing">There is no document summary.</td></tr>';
			aHTML[++h] = '<tr>&nbsp;</tr></tbody></table>';
		}
		else
		{	
			aHTML[++h] = '<table id="tableInterfaceMainColumn1" class="interfaceMainColumn1">';
		
			aHTML[++h] = '<tr><td id="tdInterfaceMainSummarySummary" class="interfaceMainSummary">&nbsp;</td></tr>' +
							'<tr><td id="tdInterfaceMainSummarySummaryValue" class="interfaceMainSummaryValue">' +
							goObjectContext.summary +
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

		if (goObjectContext != undefined)
		{
			$('#inputInterfaceMainDetailsTitle').val(goObjectContext.title);
			$('#inputInterfaceMainDetailsURL').val(goObjectContext.url);
			$('#inputInterfaceMainDetailsSummary').val(goObjectContext.summary);
			$('[name="radioPublic"][value="' + goObjectContext.public + '"]').attr('checked', true);
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
			if (giObjectContext != -1)
			{
				sParam = 'method=DOCUMENT_CONTENT_SEARCH&id=' + giObjectContext;

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
				content_css : gsEditorCSS,
				
				external_link_list_url : "/jscripts/ibcom/linkList.asp", 
				external_image_list_url : "/jscripts/ibcom/imageList.asp?LinkType=14&LinkId=" + giObjectContext, 
				media_external_list_url : "/jscripts/ibcom/mediaList.asp?LinkType=14&LinkId=" + giObjectContext,  TemplateLinkType : "0", 

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
		giObjectContext = -1;
		goObjectContextXML = oXML;
		interfaceDocumentViewport();
		$('#divInterfaceMainDetails').html(gsLoadingXHTML);
		$('#divInterfaceMainDetails').attr('onDemandLoading', '1');
		$('#spanInterfaceMasterViewportControlAction').button({disabled: false});
		$('#spanInterfaceMasterViewportControlActionOptions').button({disabled: true});
		interfaceDocumentDetails();
	}	
}

function interfaceDocumentSave()
{
	var sData = '_=1';
	
	if (giObjectContext != -1)
	{
		sParam += '&select=' + giObjectContext	
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
		url: interfaceMasterEndpointURL('DOCUMENT_MANAGE'),
		data: sData,
		dataType: 'text',
		success: interfaceDocumentSaveProcess
	});
		
}

function interfaceDocumentSaveProcess(sReturn)
{
	if (giObjectContext == -1)
	{

		var aReturn = sReturn.split('|');
		var sParam = 'method=DOCUMENT_FOLDER_LINK_MANAGE';
		var sData = 'foldertitle=' + encodeURIComponent('[My Website Documents]');

		giObjectContext = aReturn[3];
		sData += '&select=' + aReturn[3];	
				
		$.ajax(
		{
			type: 'POST',
			url: '/ondemand/document/?' + sParam,
			data: sData,
			dataType: 'text',
			success: interfaceMasterStatus('Saved')
		});
	
	}	
	else
	{
		interfaceMasterStatus('Saved');
	}	
	
}

function interfaceDocumentPDF(aParam, sReturn)
{
	var sFilename = 'document_' + giObjectContext + '.pdf'
	var sXHTMLElementID = '';
	var sXHTMLContent;
	
	if (aParam != undefined)
	{
		if (aParam.filename != undefined) {sFilename = aParam.filename}
		if (aParam.xhtmlElementID != undefined) {sXHTMLElementID = aParam.xhtmlElementID}
		if (aParam.xhtmlContent != undefined) {sXHTMLContent = aParam.xhtmlContent}
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
			var sData = 'object=' + giObject
			sData += '&objectcontext=' + giObjectContext;
			sData += '&filename=' + encodeURIComponent(sFilename);
			sData += '&xhtmlcontent=' + encodeURIComponent(sXHTMLContent);
			
			$.ajax(
			{
				type: 'POST',
				url: '/ondemand/core/?' + sParam,
				data: sData,
				dataType: 'text',
				success: function(data) {interfaceDocumentPDF(aParam, data)}
			});
		}	
		else	
		{
			var aReturn = sReturn.split('|');
			window.open('/download/' + aReturn[1]);
		}	
	}
}

