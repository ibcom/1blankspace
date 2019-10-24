/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 */
 
ns1blankspace.document = 
{
	data: 		{},

	init: 		function (oParam)
	{
		ns1blankspace.app.reset();

		ns1blankspace.object = 14;
		ns1blankspace.objectParentName = undefined;
		ns1blankspace.objectName = 'document';
		ns1blankspace.objectContextData = undefined;
		ns1blankspace.objectContext = -1;
		ns1blankspace.viewName = 'Documents';
		
		ns1blankspace.document.data.websiteContext = ((oParam?oParam:{}).websiteContext ? oParam.websiteContext : undefined);

		ns1blankspace.app.set(oParam);
	},

	home:		function (oParam, oResponse)
	{
		if (oResponse == undefined)
		{

			$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);

			var aHTML = [];
						
			aHTML.push('<table class="ns1blankspaceMain">');
			aHTML.push('<tr class="ns1blankspaceMain">' +
							'<td id="ns1blankspaceMostLikely" class="ns1blankspaceMain">' +
							ns1blankspace.xhtml.loading +
							'</td>' +
							'</tr>');
			aHTML.push('</table>');					
			
			$('#ns1blankspaceMain').html(aHTML.join(''));

			var aHTML = [];
						
			aHTML.push('<table>');

			aHTML.push('<tr><td><div id="ns1blankspaceViewDocumentLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>');
				
			aHTML.push('</table>');		
			
			$('#ns1blankspaceControl').html(aHTML.join(''));	

			var oSearch = new AdvancedSearch();
			oSearch.method = 'DOCUMENT_SEARCH';
			oSearch.addField('title');
			oSearch.addCustomOption('includemynetworkgroups', 'Y');
			oSearch.addCustomOption('includemydocuments', 'Y');
			oSearch.rows = 20;
			oSearch.sort('modifieddate', 'desc');
			oSearch.getResults(function(data) {ns1blankspace.document.home(oParam, data)});
		}
		else
		{
			var aHTML = [];
			
			if (oResponse.data.rows.length == 0)
			{
				aHTML.push('<table>' +
								'<tr><td class="ns1blankspaceNothing">Click New to create a document.</td></tr>' +
								'</table>');
			}
			else
			{
				aHTML.push('<div class="ns1blankspaceCaption" style="padding-left:8px;">RECENT</div>');
				aHTML.push('<table id="ns1blankspaceMostLikely" class="table">');

				$.each(oResponse.data.rows, function()
				{
					aHTML.push('<tr class="ns1blankspaceRow">');
					
					aHTML.push('<td id="ns1blankspaceMostLikely_title-' + this.id + 
											'" class="ns1blankspaceMostLikely">' +
											this.title +
											'</td>');
					
					aHTML.push('</tr>');
				});
				
				aHTML.push('</table>');			
			}
			
			$('#ns1blankspaceMostLikely').html(aHTML.join(''));
		
			$('td.ns1blankspaceMostLikely').click(function(event)
			{
				ns1blankspace.document.search.send(event.target.id, {source: 1});
			});
		}
	},

	search: 	
	{
	
		send: 		function (sXHTMLElementID, oParam)
		{
			var aSearch = sXHTMLElementID.split('-');
			var sElementID = aSearch[0];
			var sSearchContext = aSearch[1];
			var iMinimumLength = 0;
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
				$('#ns1blankspaceControl').html(ns1blankspace.xhtml.loading);
				
				ns1blankspace.objectContext = sSearchContext;

				var oSearch = new AdvancedSearch();
				oSearch.method = 'DOCUMENT_SEARCH';
				oSearch.addField('title,summary,keywords,url,status,statustext,public,website,websitetext,style,internal,private,content,type,typetext,modifieddate');

				oSearch.addField(ns1blankspace.option.auditFields);
				oSearch.addCustomOption('includemynetworkgroups', 'Y');
				oSearch.addCustomOption('includemydocuments', 'Y');
				
				oSearch.addFilter('id', 'EQUAL_TO', ns1blankspace.objectContext);
				oSearch.getResults(function(data) {ns1blankspace.document.show(oParam, data)});
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
					sSearchText = aSearch[1];
					if (sSearchText == '#') {sSearchText = '[0-9]'}
					sElementId = 'ns1blankspaceViewControlBrowse';
				}
				
				if (sSearchText.length >= iMinimumLength || iSource == ns1blankspace.data.searchSource.browse)
				{
					ns1blankspace.search.start();

					var oSearch = new AdvancedSearch();
					oSearch.method = 'DOCUMENT_SEARCH';
					oSearch.addField('title');
					oSearch.addFilter('title', 'TEXT_IS_LIKE', sSearchText);

					if (ns1blankspace.document.data.websiteContext)
					{
						oSearch.addFilter('foldertitle', 'EQUAL_TO', '[My Website Documents]');
					}

					oSearch.addCustomOption('includemynetworkgroups', 'Y');
					oSearch.addCustomOption('includemydocuments', 'Y');

					ns1blankspace.search.advanced.addFilters(oSearch);
					oSearch.rows = ns1blankspace.option.defaultRowsSmall;

					oSearch.getResults(function(data) {ns1blankspace.document.search.process(oParam, data)});
				}
			};	
		},

		process:	function (oParam, oResponse)
		{
			var aHTML = [];
										
			ns1blankspace.search.stop();
						
			if (oResponse.data.rows.length == 0)
			{
				$(ns1blankspace.xhtml.searchContainer).html('<table class="ns1blankspaceSearchMedium"><tr><td class="ns1blankspaceSubNote">Nothing to show</td></tr></table>');
			}
			else
			{
					aHTML.push('<table class="ns1blankspaceSearchMedium" style="width:520px;">');
					
				$.each(oResponse.data.rows, function()
				{	
					aHTML.push(ns1blankspace.document.search.row(oParam, this));
				});
		    	
				aHTML.push('</table>');

				$(ns1blankspace.xhtml.searchContainer).html(
					ns1blankspace.render.init(
					{
						html: aHTML.join(''),
						more: (oResponse.morerows == "true"),
						width: 520,
						header: false
					}) 
				);		
				
				$('td.ns1blankspaceSearch').click(function(event)
				{
					$(ns1blankspace.xhtml.dropDownContainer).html('&nbsp;');
					$(ns1blankspace.xhtml.dropDownContainer).hide(ns1blankspace.option.hideSpeedOptions)
					ns1blankspace.document.search.send(event.target.id, {source: 1});
				});
				
				ns1blankspace.render.bind(
				{
					more: oResponse.moreid,
					width: 520,
					startRow: parseInt(oResponse.startrow) + parseInt(oResponse.rows),
					functionSearch: ns1blankspace.document.search.send,
					functionRow: ns1blankspace.document.search.row
				});   				
			}	
		},

		row: 		function (oParam, oRow)
		{
			var aHTML = [];
			var sContact;
						
			aHTML.push('<tr class="ns1blankspaceSearch">');
		
			aHTML.push('<td class="ns1blankspaceSearch" id="' +
							'search-' + oRow.id + '">' +
							oRow.title +
							'</td>');

			aHTML.push('</tr>');
			
			return aHTML.join('')
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

			aHTML.push('<tr><td id="ns1blankspaceControlEdit" class="ns1blankspaceControl">' +
							'Edit</td></tr>');
		}	
		
		aHTML.push('</table>');					
					
		if (ns1blankspace.objectContext != -1)
		{		
			aHTML.push('<table class="ns1blankspaceControl">');
						
			aHTML.push('<tr><td id="ns1blankspaceControlAttachments" class="ns1blankspaceControl">' +
							'Attachments</td></tr>');

			aHTML.push('</table>');
		}	

		$('#ns1blankspaceControl').html(aHTML.join(''));
		
		var aHTML = [];

		aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>');
		aHTML.push('<div id="ns1blankspaceMainDetails" class="ns1blankspaceControlMain"></div>');
		aHTML.push('<div id="ns1blankspaceMainEdit" class="ns1blankspaceControlMain"></div>');
		aHTML.push('<div id="ns1blankspaceMainAttachments" class="ns1blankspaceControlMain"></div>');

		aHTML.push('<div id="ns1blankspaceMainPDF" class="ns1blankspaceControlMain" style="display:none;">' +
							'<iframe name="ns1blankspaceContainerPDF" ' +
							'id="ns1blankspaceContainerPDF" frameborder="2" border="0" scrolling="no" style="width:97%; height:500px;"></iframe></div>');

		
				
		$('#ns1blankspaceMain').html(aHTML.join(''));

		$('#ns1blankspaceControlSummary').click(function(event)
		{
			ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
			ns1blankspace.document.summary();
		});
		
		$('#ns1blankspaceControlDetails').click(function(event)
		{
			ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
			ns1blankspace.document.details();
		});

		$('#ns1blankspaceControlEdit').click(function(event)
		{
			ns1blankspace.show({selector: '#ns1blankspaceMainEdit'});
			ns1blankspace.document.edit();
		});

		$('#ns1blankspaceControlAttachments').click(function(event)
		{
			ns1blankspace.show({selector: '#ns1blankspaceMainAttachments'});
			ns1blankspace.attachments.show();
		});
	},

	show: 		function (oParam, oResponse)
	{
		ns1blankspace.app.clean();
		ns1blankspace.document.layout();
		
		var aHTML = [];
		
		if (oResponse.data.rows.length == 0)
		{
			ns1blankspace.objectContextData = undefined;
			
			aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find this document.</td></tr></table>');
					
			$('#ns1blankspaceMain').html(aHTML.join(''));
		}
		else
		{
			ns1blankspace.objectContextData = oResponse.data.rows[0];
			
			$('#ns1blankspaceControlContext').html(ns1blankspace.objectContextData.title);
			$('#ns1blankspaceViewControlAction').button({disabled: false});
			$('#ns1blankspaceViewControlActionOptions').button({disabled: false});
			
			ns1blankspace.history.view(
			{
				newDestination: 'ns1blankspace.document.init({id: ' + ns1blankspace.objectContext + '})',
				move: false
			});
			
			ns1blankspace.history.control({functionDefault: 'ns1blankspace.document.summary()'});
		}	
	},		
		
	summary: 	function ()
	{
		var aHTML = [];
		
		if (ns1blankspace.objectContextData == undefined)
		{
			aHTML.push('<table><tr><td valign="top">Sorry can\'t find this document.</td></tr></table>');
					
			$('#ns1blankspaceMain').html(aHTML.join(''));
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

			aHTML.push('<table class="ns1blankspace">');
			
			if (ns1blankspace.objectContextData.summary != '')
			{	
				aHTML.push('<tr><td id="ns1blankspaceSummarySummary" class="ns1blankspaceSummary">' +
							ns1blankspace.objectContextData.summary +
							'</td></tr>');
			}		
			
			var oDate = new Date(ns1blankspace.objectContextData.modifieddate);

			aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Last Updated</td></tr>' +
							'<tr><td id="ns1blankspaceSummaryLastUpdated" class="ns1blankspaceSummary">' +
							oDate.toString("dd MMM yyyy") +
							'</td></tr>');	

			aHTML.push('</table>');					
			
			$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));

			var aHTML = [];
		
			aHTML.push('<table class="ns1blankspaceColumn2">');

			aHTML.push('<tr><td class="ns1blankspaceSummaryCaption" style="padding-bottom:10px;">' +
							(ns1blankspace.objectContextData.public=='Y'?'<span style="color:#CC0000;">Shared publicly</span>':'Not shared publicly') +
							'</td></tr>');

			if (ns1blankspace.objectContextData.private == 'Y')
			{	
				aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">' +
							'Only shared with you within this space' +
							'</td></tr>');
			}	

			aHTML.push('</table>');					
		
			$('#ns1blankspaceSummaryColumn2').html(aHTML.join(''));	
		}	
	},

	details: 	function ()
	{
		var aHTML = [];

		if ($('#ns1blankspaceMainDetails').attr('data-loading') == '1')
		{
			$('#ns1blankspaceMainDetails').attr('data-loading', '');
			
			aHTML.push('<table class="ns1blankspaceContainer">' +
							'<tr class="ns1blankspaceContainer">' +
							'<td id="ns1blankspaceDetailsColumn1" class="ns1blankspaceColumn1"></td>' +
							'<td id="ns1blankspaceDetailsColumn2" class="ns1blankspaceColumn2"></td>' +
							'</tr>' + 
							'</table>');					
			
			$('#ns1blankspaceMainDetails').html(aHTML.join(''));
			
			var aHTML = [];
			
			aHTML.push('<table class="ns1blankspace">');
			
			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Title' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceText">' +
							'<input id="ns1blankspaceDetailsTitle" class="ns1blankspaceText">' +
							'</td></tr>');	

			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'URL' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceText">' +
							'<input id="ns1blankspaceDetailsURL" class="ns1blankspaceText">' +
							'</td></tr>');	

			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Document Summary' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceTextMulti">' +
							'<textarea rows="10" cols="35" id="ns1blankspaceDetailsSummary" class="ns1blankspaceMainTextMulti" style="width:100%;"></textarea>' +
							'</td></tr>');
			
				aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Status' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceRadio">' +
							'<input type="radio" id="radioStatus1" name="radioStatus" value="1"/>Draft<br />' +
							'<input type="radio" id="radioStatus2" name="radioStatus" value="2"/>Approved<br />' +
							'<input type="radio" id="radioStatus3" name="radioStatus" value="3"/>Under Review<br />' +
							'<input type="radio" id="radioStatus4" name="radioStatus" value="3"/>To Be linked to Folders' +
							'</td></tr>');	

			aHTML.push('</table>');					
			
			$('#ns1blankspaceDetailsColumn1').html(aHTML.join(''));
			
			var aHTML = [];
				
			aHTML.push('<table class="ns1blankspace">');
			
			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Status' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceRadio">' +
							'<input type="radio" id="radioStatus1" name="radioStatus" value="1"/>Draft<br />' +
							'<input type="radio" id="radioStatus2" name="radioStatus" value="2"/>Approved<br />' +
							'<input type="radio" id="radioStatus3" name="radioStatus" value="3"/>Under Review<br />' +
							'<input type="radio" id="radioStatus4" name="radioStatus" value="3"/>To Be linked to Folders' +
							'</td></tr>');	

			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Share with others users in this space' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceRadio">' +
							'<input type="radio" id="radioPrivateN" name="radioPrivate" value="N"/>Yes' +
							'<br /><input type="radio" id="radioPrivateY" name="radioPrivate" value="Y"/>No&nbsp;<span class="ns1blankspaceSub">(Only shared with you)</span>' +
							'</td></tr>');	

			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption" style="padding-top:10px;">' +
							'Share with external users' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceRadio">' +
							'<input type="radio" id="radioPublicY" name="radioPublic" value="Y"/>Yes&nbsp;<span class="ns1blankspaceSub">(Public)</span>' +
							'<br /><input type="radio" id="radioPublicN" name="radioPublic" value="N"/>No' +
							'</td></tr>');	
			
			aHTML.push('</table>');					
				
			aHTML.push('<table class="ns1blankspace" style="margin-top:10px;">' +
							'<tr>' + 
							'<td class="ns1blankspaceCaption" id="ns1blankspaceDocumentNetworkGroupsCaption">Shared With</td>' +
							'<td style="padding-right:10px; text-align:right;">' +
							'<span id="ns1blankspaceDocumentNetworkGroupsAdd"></span></td>' +
							'</tr>');
			aHTML.push('<tr><td colspan=2" class="ns1blankspaceSubNote">' +
								'If sharing this document, you must ensure you are a member of at least one of the network groups ' +
								'to allow you to find the document again.' +
							'</td></tr>');

			aHTML.push('<tr><td colspan=2 class="ns1blankspaceText" id="ns1blankspaceDocumentNetworkGroups">' +
							'<table><tr><td class="ns1blankspaceNothing">No one.</td></tr></table> ' +
							'</td></tr>');

			aHTML.push('</table>');

			$('#ns1blankspaceDetailsColumn2').html(aHTML.join(''));

			if (ns1blankspace.objectContextData != undefined)
			{
				$('#ns1blankspaceDetailsTitle').val(ns1blankspace.objectContextData.title);
				$('#ns1blankspaceDetailsURL').val(ns1blankspace.objectContextData.url);
				$('#ns1blankspaceDetailsSummary').val(ns1blankspace.objectContextData.summary);
				$('[name="radioStatus"][value="' + ns1blankspace.objectContextData.status + '"]').attr('checked', true);
				$('[name="radioPublic"][value="' + ns1blankspace.objectContextData.public + '"]').attr('checked', true);
				$('[name="radioPrivate"][value="' + ns1blankspace.objectContextData.private + '"]').attr('checked', true);
			}
			else
			{
				$('[name="radioStatus"][value="1"]').attr('checked', true);
				$('[name="radioPublic"][value="N"]').attr('checked', true);
				$('[name="radioPrivate"][value="N"]').attr('checked', true);
			}

			if (ns1blankspace.objectContext != -1)
			{	
				ns1blankspace.setup.networkGroup.groups.init(
				{
					xhtmlElementContainerID: 'ns1blankspaceDocumentNetworkGroups',
					xhtmlElementAddID: 'ns1blankspaceDocumentNetworkGroupsAdd',
					object: 14,
					objectcontext: ns1blankspace.objectContext
				});
			}	
		}	
	},

	edit: 		function (sReturn)
	{	
		if ($('#ns1blankspaceMainEdit').attr('data-loading') == '1')
		{
			var aHTML = [];
			
				aHTML.push('<table class="ns1blankspaceContainer">' +
							'<tr class="ns1blankspaceContainer">' +
							'<td id="ns1blankspaceEditColumn1" class="ns1blankspaceColumn1Flexible"></td>' +
							'<td id="ns1blankspaceEditColumn2" class="ns1blankspaceColumn2Action" style="width:50px;"></td>' +
							'</tr>' + 
							'</table>');		
				
			$('#ns1blankspaceMainEdit').html(aHTML.join(''));

			//$('#ns1blankspaceEditColumn2').html('<div style="margin-top:4px;" id="ns1blankspaceEditPDFv2" class="ns1blankspaceAction">PDF</div>');
				
			$('#ns1blankspaceEditPDFv1').click(function(event)
			{
				ns1blankspace.document.pdf.v1();
			});

			$('#ns1blankspaceEditPDFv2').button(
			{
				label: "PDF"
			})
			.click(function(event)
			{
				var sXHTML = tinyMCE.get('ns1blankspaceEditText' + ns1blankspace.counter.editor).getContent();
				ns1blankspace.show({selector: '#ns1blankspaceMainPDF'});
				ns1blankspace.document.pdf.v2({xhtml: sXHTML});
			});
			
			if (sReturn == undefined)
			{
				if (ns1blankspace.objectContext != -1)
				{
					$.ajax(
					{
						type: 'GET',
						cache: false,
						url: ns1blankspace.util.endpointURI('DOCUMENT_CONTENT_SEARCH'),
						data: 'id=' + ns1blankspace.util.fs(ns1blankspace.objectContext),
						dataType: 'text',
						success: ns1blankspace.document.edit
					});
				}
				else
				{
					ns1blankspace.document.edit('');
				}
				
			}
			else
			{
				$('#ns1blankspaceMainEdit').attr('data-loading', '');
				
				var sHTML = sReturn;
											
				ns1blankspace.counter.editor = ns1blankspace.counter.editor + 1;

				var aHTML = [];
			
				aHTML.push('<table class="ns1blankspace">');
						
				aHTML.push('<tr class="ns1blankspaceMainTextMulti">' +
								'<td class="ns1blankspaceMainTextMulti">' +
								'<textarea rows="10" cols="60" name="ns1blankspaceEditText"' + 
								' id="ns1blankspaceEditText' + ns1blankspace.counter.editor +
								'" class="ns1blankspaceTextMultiLarge tinymceAdvanced"></textarea>' +
								'</td></tr>');
								
				aHTML.push('</table>');					
				
				$('#ns1blankspaceEditColumn1').html(aHTML.join(''));

				$('#ns1blankspaceEditText' + ns1blankspace.counter.editor).val(sHTML);
					
				ns1blankspace.format.editor.init(
				{
					selector: '#ns1blankspaceEditText' + ns1blankspace.counter.editor,
					height: '415px'
				});	
			}	
		}	
	},

	save: 	
	{
		send: 		function ()
		{
			ns1blankspace.status.working();
			
			var sData = '_=1';
			
			if (ns1blankspace.objectContext != -1)
			{
				sData += '&id=' + ns1blankspace.objectContext	
			}	
				
			if ($('#ns1blankspaceMainDetails').html() != '')
			{
				sData += '&title=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsTitle').val());
				sData += '&url=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsURL').val());
				sData += '&public=' + ns1blankspace.util.fs($('input[name="radioPublic"]:checked').val());
				sData += '&summary=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsSummary').val());
				sData += '&private=' + ns1blankspace.util.fs($('input[name="radioPrivate"]:checked').val());
				sData += '&status=' + ns1blankspace.util.fs($('input[name="radioStatus"]:checked').val());
			}
			
			if ($('#ns1blankspaceMainEdit').html() != '')
			{
				sData += '&details=' + ns1blankspace.util.fs(tinyMCE.get('ns1blankspaceEditText' + ns1blankspace.counter.editor).getContent());
				if ($('input[name="radioDocumentType"]:checked').val() == '5')
				{
					sData += '&content=' + ns1blankspace.util.fs(tinyMCE.get('ns1blankspaceEditText' + ns1blankspace.counter.editor).getContent());
				}
				else
				{
					sData += '&content=' + ns1blankspace.util.fs($('#ns1blankspaceEditText' + ns1blankspace.counter.editor).val());
				}
			}
			
			$.ajax(
			{
				type: 'POST',
				url: ns1blankspace.util.endpointURI('DOCUMENT_MANAGE'),
				data: sData,
				dataType: 'json',
				success: ns1blankspace.document.save.process
			});	
		},

		process:	function (oResponse)
		{
			if (ns1blankspace.objectContext == -1) {var bNew = true}
			ns1blankspace.objectContext = oResponse.id;	
			ns1blankspace.inputDetected = false;

			if (ns1blankspace.objectContext == -1 && ns1blankspace.document.data.websiteContext)
			{
				ns1blankspace.objectContext = oResponse.id;

				var sData = 'foldertitle=' + ns1blankspace.util.endpointURI('[My Website Documents]');
				sData += '&document=' + ns1blankspace.objectContext;	
						
				$.ajax(
				{
					type: 'POST',
					url: ns1blankspace.util.endpointURI('DOCUMENT_FOLDER_LINK_MANAGE'),
					data: sData,
					dataType: 'text',
					success: function (data)
					{
						ns1blankspace.status.message('Saved');
						if (bNew) {ns1blankspace.document.search.send('-' + ns1blankspace.objectContext)}
					}		
				});
			
			}	
			else
			{
				ns1blankspace.status.message('Saved');
				if (bNew) {ns1blankspace.document.search.send('-' + ns1blankspace.objectContext)}
			}	
		}
	},

	pdf: 		
	{
		v1:			function (oParam, sReturn)
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
				if ($('#ns1blankspaceMainEdit').html() != '')
				{
					sXHTMLContent = tinyMCE.get('ns1blankspaceEditText' + ns1blankspace.counter.editor).getContent();
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
					var sData = 'rf=TEXT&object=' + ns1blankspace.util.fs(ns1blankspace.object)
					sData += '&objectcontext=' + ns1blankspace.util.fs(ns1blankspace.objectContext);
					sData += '&filename=' + ns1blankspace.util.fs(sFilename);
					sData += '&xhtmlcontent=' + ns1blankspace.util.fs(sXHTMLContent);
					
					$.ajax(
					{
						type: 'POST',
						url: ns1blankspace.util.endpointURI('CORE_PDF_CREATE'),
						data: sData,
						dataType: 'text',
						success: function(data) {ns1blankspace.document.pdf(oParam, data)}
					});
				}	
				else	
				{
					var aReturn = sReturn.split('|');
					window.open('/download/' + aReturn[1]);
				}	
			}
		},

		v2:			function (oParam)
		{
			oParam = ns1blankspace.util.setParam(oParam, 'xhtmlContainerElementID', 'ns1blankspaceContainerPDF');

			if (ns1blankspace.util.getParam(oParam, 'xhtml').exists)
			{
				ns1blankspace.util.pdf.create(oParam);
 			}	
		}			
	}				
}