/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 
ns1blankspace.setup.websiteForm = 
{
	init: 		function (oParam)
				{
					var bShowHome = true
					
					if (oParam != undefined)
					{
						if (oParam.showHome != undefined) {bShowHome = oParam.showHome}	
					}

					ns1blankspace.object = 40;
					ns1blankspace.objectParentName = 'setup';
					ns1blankspace.objectName = 'websiteForm';
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.viewName = 'Website Forms';
					
					if (bShowHome)
					{
						ns1blankspace.history.view({
							newDestination: 'ns1blankspace.setup.websiteForm.init({showHome: true});',
							move: false
							});	
					}	
							
					ns1blankspace.app.reset();
					ns1blankspace.app.set(oParam);
					ns1blankspace.setup.websiteForm.bind();
				},

	bind:		function ()
				{
					$('#ns1blankspaceActionOptionsRemove').click(function(event)
					{
						ns1blankspace.setup.websiteForm.remove();
					});
				},

	home: 		function (oResponse)
				{
					if (oResponse == undefined)
					{
						$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);

						var aHTML = [];
									
						aHTML.push('<table class="ns1blankspaceMain">');
						aHTML.push('<tr class="ns1blankspaceMain">' +
										'<td id="ns1blankspaceMostLikely" class="ins1blankspaceMain">' +
										ns1blankspace.xhtml.loading +
										'</td>' +
										'</tr>');
						aHTML.push('</table>');					
						
						$('#ns1blankspaceMain').html(aHTML.join(''));
						
					
						aHTML.push('<table>');

						aHTML.push('<tr><td id="ns1blankspaceViewSetupWebsiteLarge" class="ns1blankspaceViewImageLarge">&nbsp;</td></tr>');
					
						aHTML.push('</table>');		
						
						$('#ns1blankspaceControl').html(aHTML.join(''));
	
						$.ajax(
						{
							type: 'GET',
							url: ns1blankspace.util.endpointURI('SETUP_SITE_FORM_SEARCH'),
							data: 'recent=1',
							dataType: 'json',
							success: ns1blankspace.setup.websiteForm.home
						});
					}
					else
					{
						var aHTML = [];
						
						if (oResponse.data.rows.length == 0)
						{
							
							aHTML.push('<table id="ns1blankspaceMostLikely">' +
											'<tr><td class="ns1blankspaceNothing">Click New to create a website form.</td></tr>' +
											'</table>');
						}
						else
						{
							aHTML.push('<table id="ns1blankspaceMostLikely">');
							aHTML.push('<tr><td class="ns1blankspaceCaption">MOST LIKELY</td></tr>');

							$.each(oResponse.data.rows, function()
							{
								aHTML.push('<tr class="ns1blankspaceRow">');
								
								aHTML.push('<td id="ns1blankspaceMostLikely_title-' + this.id + 
														'" class="ns1blankspaceMostLikely">' +
														this.title+
														'</td>');
								
								aHTML.push('</tr>');
							});
							
							aHTML.push('</table>');
						}
						
						$('#ns1blankspaceMostLikely').html(aHTML.join(''));
					
						$('td.ns1blankspaceMostLikely').click(function(event)
						{
							ns1blankspace.setup.websiteFormsearch.send(event.target.id, {source: 1});
						});
					}
				},

	search: 	{
					send:		function (sXHTMLElementID, oParam)
								{	
									var aSearch = sXHTMLElementID.split('-');
									var sSearchContext = aSearch[1];
									var iMinimumLength = 3;
									var iSource = ns1blankspace.data.searchSource.text;
									var sSearchText;
									var iMaximumColumns = 1;
									var iRows = 10;
									
									if (oParam != undefined)
									{
										if (oParam.source != undefined) {iSource = oParam.source}
										if (oParam.searchText != undefined) {sSearchText = oParam.searchText}
										if (oParam.rows != undefined) {iRows = oParam.rows}
										if (oParam.searchContext != undefined) {sSearchContext = oParam.searchContext}
										if (oParam.minimumLength != undefined) {iMinimumLength = oParam.minimumLength}
										if (oParam.maximumColumns != undefined) {iMaximumColumns = oParam.maximumColumns}
									}
										
									if (sSearchContext != undefined && iSource != ns1blankspace.data.searchSource.browse)
									{
										$('#ns1blankspaceControl').html(ns1blankspace.xhtml.loading);
										
										ns1blankspace.objectContext = sSearchContext;
									
										$.ajax(
										{
											type: 'GET',
											url: ns1blankspace.util.endpointURI('SETUP_SITE_FORM_SEARCH'),
											data: 'id=' + ns1blankspace.objectContext,
											dataType: 'json',
											success: function(data) {ns1blankspace.setup.websiteForm.show(oParam, data)}
										});
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
											ns1blankspace.container.position('ns1blankspaceViewControlSearch');
											ns1blankspace.search.start();

											$.ajax(
											{
												type: 'GET',
												url: ns1blankspace.util.endpointURI('SETUP_SITE_FORM_SEARCH'),
												data: 'quicksearch=' + ns1blankspace.util.fs(SearchText),
												dataType: 'json',
												success: function(data) {ns1blankspace.setup.websiteForm.search.process(oParam, data)}
											});			
										}
									};	
								},

					process:	function (oParam, oResponse)
								{
									var iColumn = 0;
									var aHTML = [];
									
									var	iMaximumColumns = 1;
									
									if (oResponse.data.rows.length == 0)
									{
										ns1blankspace.search.stop();
										$(ns1blankspace.xhtml.container).hide();
									}
									else
									{
										aHTML.push('<table class="ns1blankspaceSearchMedium">');
											
										$.each(oResponse.data.rows, function()
										{	
											iColumn = iColumn + 1;
											
											if (iColumn == 1)
											{
												aHTML.push('<tr class="ns1blankspaceSearch">');
											}
											
											sTitle = this.title;
											if (sTitle == '') {sTitle = this.message}
											if (sTitle == '') {sTitle = this.typetext}
											sTitle = sTitle + ' (' + this.id + ')';
												
											aHTML.push('<td class="ns1blankspaceSearch" id="title' +
															'-' + this.id + '">' +
															sTitle + '</td>';
											
											if (iColumn == iMaximumColumns)
											{
												aHTML.push('</tr>');
												iColumn = 0;
											}	
										});
								    	
										aHTML.push('</table>');

										$(ns1blankspace.xhtml.container).html(aHTML.join(''));
										$(ns1blankspace.xhtml.container).show(ns1blankspace.option.showSpeedOptions);
										ns1blankspace.search.stop();
										
										$('td.ns1blankspaceSearch').click(function(event)
										{
											$(ns1blankspace.xhtml.container).html('&nbsp;');
											$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions)
											ns1blankspace.setup.websiteForm.search.send(event.target.id, {source: 1});
										});
									}		
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
									
						aHTML.push('<tr><td id="ns1blankspaceControlLayout" class="ns1blankspaceControl">' +
										'Layout</td></tr>');
					}
					
					aHTML.push('</table>';					
								
					$('#ns1blankspaceControl').html(aHTML.join(''));
					
					var aHTML = [];

					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainDetails" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainStructure" class="ns1blankspaceControlMain"></div>');
						
					$('#ns1blankspaceMain').html(aHTML.join(''));
						
					$('#ns1blankspaceControlSummary').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
						ns1blankspace.setup.websiteForm.summary();
					});
					
					$('#ns1blankspaceControlDetails').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
						ns1blankspace.setup.websiteForm.details();
					});
					
					$('#ns1blankspaceControlStructure').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainStructure'});
						ns1blankspace.setup.websiteForm.structure();
					});
				},

	show:		function (oParam, oResponse)
				{
					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
					ns1blankspace.setup.websiteForm.layout();
					
					var aHTML = [];
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
						
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find this website form.</td></tr></table>');
								
						$('#ns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						ns1blankspace.objectContextData = oResponse.data.rows[0];

						var sContext = ns1blankspace.objectContextData.title;
						if (sContext == '') {sContext = 'Form ' + ns1blankspace.objectContextData.id}
						
						$('#ns1blankspaceControlContext').html(sContext +
								'<br /><br /><span class="ns1blankspaceSub">' + ns1blankspace.objectContextData.sitetext + '</span>');
						$('#ns1blankspaceViewControlAction').button({disabled: false});
						$('#ns1blankspaceViewControlActionOptions').button({disabled: false});
						
						ns1blankspace.history.view({
							newDestination: 'ns1blankspace.setup.websiteForm.init({showHome: false});ns1blankspace.setup.websiteForm.search.send("-' + ns1blankspace.objectContext + '")',
							move: false
							});
						
						ns1blankspace.history.control({functionDefault: 'ns1blankspace.setup.websiteForm.summary()'});
					}
				},		
		
	summary:	function ns1blankspaceSetupWebsiteFormSummary()
				{
					var aHTML = [];
					
					
					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML.push('<table><tr><td valign="top">Sorry can\'t find website.</td></tr>';
						aHTML.push('<tr>&nbsp;</tr></table>';
								
						$('#divns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						ns1blankspace.websiteFormSite = ns1blankspace.objectContextData.site;
						
						aHTML.push('<table id="tablens1blankspaceMainColumn1" class="ns1blankspaceMainColumn1">';
										
						aHTML.push('<tr><td id="tdns1blankspaceMainSummaryFormType" class="ns1blankspaceMainSummary">Type</td></tr>' +
										'<tr><td id="tdns1blankspaceMainSummaryFormType" class="ns1blankspaceMainSummaryValue">' +
										ns1blankspace.objectContextData.typetext +
										'</td></tr>';
										
						if (ns1blankspace.objectContextData.message != '')
						{	
							aHTML.push('<tr><td id="tdns1blankspaceMainSummaryFormMessage" class="ns1blankspaceMainSummary">Message</td></tr>' +
										'<tr><td id="tdns1blankspaceMainSummaryFormMessage" class="ns1blankspaceMainSummaryValue">' +
										ns1blankspace.objectContextData.message +
										'</td></tr>';
						}				
										
						aHTML.push('</table>';					
						
						$('#tdns1blankspaceMainSummaryColumn1').html(aHTML.join(''));
				
						$('#ans1blankspaceMainSummaryAddAttachment').click(function(event)
						{
				 			ns1blankspaceMainViewportShow("#divns1blankspaceMainAddAttachment");
							ns1blankspaceSetupWebsiteFormAddAttachment();
						});
					}	
				},

	details:	function ns1blankspaceSetupWebsiteFormDetails()
				{
					var aHTML = [];
					
					
					if ($('#divns1blankspaceMainDetails').attr('onDemandLoading') == '1')
					{
						$('#divns1blankspaceMainDetails').attr('onDemandLoading', '');
								
						aHTML.push('<table id="tablens1blankspaceMainDetails" class="ns1blankspaceMainDetails">';
						aHTML.push('<tr id="trns1blankspaceMainDetailsRow1" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainDetailsColumn1" class="ns1blankspaceMainColumn1">' +
										'</td>' +
										'<td id="tdns1blankspaceMainDetailsColumn2" class="ns1blankspaceMainColumn2">' +
										'</td>' +
										'</tr>';
						aHTML.push('</table>';					
						
						$('#divns1blankspaceMainDetails').html(aHTML.join(''));
						
						var aHTML = [];
						
					
						aHTML.push('<table id="tablens1blankspaceMainDetailsColumn1" class="ns1blankspaceMain">';
					
						aHTML.push('<tr id="trns1blankspaceMainDetailsTitle" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainDetailsTitle" class="ns1blankspaceMain">' +
										'Title' +
										'</td></tr>' +
										'<tr id="trns1blankspaceMainDetailsTitleValue" class="ns1blankspaceMainText">' +
										'<td id="tdns1blankspaceMainDetailsTitleValue" class="ns1blankspaceMainText">' +
										'<input id="inputns1blankspaceMainDetailsTitle" class="inputns1blankspaceMainText">' +
										'</td></tr>';
						
						aHTML.push('<tr id="trns1blankspaceMainDetailsEmail" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainDetailsEmail" class="ns1blankspaceMain">' +
										'Email' +
										'</td></tr>' +
										'<tr id="trns1blankspaceMainDetailsEmailValue" class="ns1blankspaceMainText">' +
										'<td id="tdns1blankspaceMainDetailsEmailValue" class="ns1blankspaceMainText">' +
										'<input id="inputns1blankspaceMainDetailsEmail" class="inputns1blankspaceMainText">' +
										'</td></tr>';
						
						aHTML.push('</table>';					
						
						$('#tdns1blankspaceMainDetailsColumn1').html(aHTML.join(''));
						
						var aHTML = [];
						
							
						aHTML.push('<table id="tablens1blankspaceMainDetailsColumn2" class="ns1blankspaceMain">';
					
						aHTML.push('<tr id="trns1blankspaceMainDetailsType" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainDetailsType" class="ns1blankspaceMain">' +
										'Type' +
										'</td></tr>' +
										'<tr id="trns1blankspaceMainDetailsType" class="ns1blankspaceMainText">' +
										'<td id="tdns1blankspaceMainDetailsTypeValue" class="ns1blankspaceMainRadio">' +
										'<input type="radio" id="radioType1" name="radioType" value="1"/>Standard' +
										'<br /><input type="radio" id="radioType2" name="radioType" value="2"/>Simple' +
										'<br /><input type="radio" id="radioType3" name="radioType" value="3"/>Advanced' +
										'<br /><input type="radio" id="radioType4" name="radioType" value="4"/>Customised' +
										'<br /><input type="radio" id="radioType5" name="radioType" value="5"/>Newsletter' +
										'<br /><input type="radio" id="radioType6" name="radioType" value="6"/>Suggestion' +
										'</td></tr>';
						
						aHTML.push('</table>';					
						
						$('#tdns1blankspaceMainDetailsColumn2').html(aHTML.join(''));
						
						if (ns1blankspace.objectContextData != undefined)
						{
							$('#inputns1blankspaceMainDetailsTitle').val(ns1blankspace.objectContextData.title);
							$('#inputns1blankspaceMainDetailsEmail').val(ns1blankspace.objectContextData.email);
							$('[name="radioType"][value="' + ns1blankspace.objectContextData.type + '"]').attr('checked', true);
						}
						else
						{
							$('[name="radioType"][value="1"]').attr('checked', true);	
						}
					}	
				},

	fields:		function ns1blankspaceSetupWebsiteFormLayout()
				{
					var aHTML = [];
					
					
					if ($('#divns1blankspaceMainLayout').attr('onDemandLoading') == '1')
					{
						$('#divns1blankspaceMainLayout').attr('onDemandLoading', '');
								
						aHTML.push('<table id="tablens1blankspaceMainLayout" class="ns1blankspaceMainDetails">';
						aHTML.push('<tr id="trns1blankspaceMainLayoutRow1" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainLayoutColumn1" class="ns1blankspaceMainColumn1">' +
										'</td>' +
										'<td id="tdns1blankspaceMainLayoutColumn2" class="ns1blankspaceMainColumn2">' +
										'</td>' +
										'</tr>';
						aHTML.push('</table>';					
						
						$('#divns1blankspaceMainLayout').html(aHTML.join(''));
						
						var aHTML = [];
						
					
						aHTML.push('<table id="tablens1blankspaceMainLayoutColumn1" class="ns1blankspaceMain">';
					
						
						aHTML.push('</table>';					
						
						$('#tdns1blankspaceMainLayoutColumn1').html(aHTML.join(''));
						
						var aHTML = [];
						
							
						aHTML.push('<table id="tablens1blankspaceMainlayoutColumn2" class="ns1blankspaceMain">';

						aHTML.push('<tr id="trns1blankspaceMainLayout" class="ns1blankspaceMain">' +
										'<td id="tdns1blankspaceMainLayout" class="ns1blankspaceMain">' +
										'The form includes the following standard fields:' +
										'</td></tr>' +
										'<tr id="trns1blankspaceMainLayout" class="ns1blankspaceMainText">' +
										'<td id="tdns1blankspaceMainLayoutValue" class="ns1blankspaceMainRadio">' +
										'Organisation Name' +
										'<br />First Name' +
										'<br />Surname' +
										'<br />Email' +
										'<br />Phone' +
										'<br />Mobile' +
										'<br />Mailing Address 1' +
										'<br />Mailing Address 2' +
										'<br />Mailing Suburb' +
										'<br />Mailing Post Code' +
										'<br />Mailing State' +
										'<br />Mailing Country' +
										'</td></tr>';
						
						aHTML.push('</table>';					
						
						$('#tdns1blankspaceMainLayoutColumn2').html(aHTML.join(''));
						
						if (ns1blankspace.objectContextData != undefined)
						{
							$('#inputns1blankspaceMainLayoutHeaderHeight').val(ns1blankspace.objectContextData.headerheight);
							$('#inputns1blankspaceMainLayoutFooterHeight').val(ns1blankspace.objectContextData.footerheight);
							$('#inputns1blankspaceMainLayoutColumns').val(ns1blankspace.objectContextData.columns);
							$('[name="radioLayout"][value="' + ns1blankspace.objectContextData.layout + '"]').attr('checked', true);
						}
					
					}	
				},

	new:		function ns1blankspaceSetupWebsiteFormNew(oParam)
				{
					ns1blankspace.objectContextData = undefined
					ns1blankspace.objectContext = -1;
					ns1blankspaceSetupWebsiteFormViewport();
					$('#spanns1blankspaceViewportControlAction').button({disabled: false});
					ns1blankspaceMainViewportShow("#divns1blankspaceMainDetails");
					ns1blankspaceSetupWebsiteFormDetails();
				},

	save:     	{
					send:		function ns1blankspaceSetupWebsiteFormSave(oParam, oResponse)
								{
									if (oResponse == undefined)
									{
										var sParam = 'method=SETUP_SITE_FORM_MANAGE';
										var sData = 'site=' + ns1blankspace.websiteFormSite;
										
										if (ns1blankspace.objectContext != -1)
										{
											sParam += '&id=' + ns1blankspace.objectContext	
										}	
										
										if ($('#divns1blankspaceMainDetails').html() != '')
										{
											sData += '&title=' + ns1blankspace.util.fs($('#inputns1blankspaceMainDetailsTitle').val());
											sData += '&email=' + ns1blankspace.util.fs($('#inputns1blankspaceMainDetailsEmail').val());
											sData += '&type=' + ns1blankspace.util.fs($('input[name="radioType"]:checked').val());	
										};

										if ($('#divns1blankspaceMainLayout').html() != '')
										{
											sData += '&headerheight=' + ns1blankspace.util.fs($('#inputns1blankspaceMainLayoutHeaderHeight').val());
											sData += '&footerheight=' + ns1blankspace.util.fs($('#inputns1blankspaceMainLayoutFooterHeight').val());
											sData += '&columns=' + ns1blankspace.util.fs($('#inputns1blankspaceMainLayoutColumns').val());
											sData += '&layout=' + ns1blankspace.util.fs($('input[name="radioLayout"]:checked').val());	
										};	
										
										$.ajax(
										{
											type: 'POST',
											url: '/ondemand/setup/?' + sParam,
											data: sData,
											dataType: 'json',
											success: function(data) {ns1blankspaceSetupWebsiteFormSave(oParam, data)}
										});
										
									}
									else
									{			
										if (oResponse.status == 'OK')
										{	
											ns1blankspaceStatus('Saved');
											
											if (ns1blankspace.objectContext == -1)
											{
												ns1blankspace.objectContext = oResponse.id;
												ns1blankspace.inputDetected = false;
												ns1blankspaceSetupWebsiteFormSearch('-' + ns1blankspace.objectContext, {source: 1});
											}	
										}
										else
										{
											ns1blankspaceStatus('Could not save the website form!');
										}
									}
								}
				},				

	structure: 	{
					init:
								function ns1blankspaceSetupWebsiteFormStructureCheck(oParam)
								{

									if (ns1blankspace.objectContextData.structure == '')
									{
										var sParam = 'method=SETUP_SITE_FORM_MANAGE';
										var sData = 'createstructure=1&id=' + ns1blankspace.objectContext
									
										$.ajax(
										{
											type: 'POST',
											url: '/ondemand/setup/?' + sParam,
											data: sData,
											dataType: 'json',
											success: function(data) 
												{
													ns1blankspace.objectContextData.structure = data.structure;
													ns1blankspace.objectContextData.structurecategory = data.structurecategory;
													ns1blankspaceSetupWebsiteFormStructure(oParam)
												}
										});
									}
									else
									{
										ns1blankspaceSetupWebsiteFormStructure(oParam);
									}
								},

					show:		function ns1blankspaceSetupWebsiteFormStructure(oParam, oResponse)
								{
									var iObjectContext = ns1blankspace.objectContext;
									var sXHTMLElementId = 'divns1blankspaceMainStructure';
									var oOptions = {view: true, remove: true};
									var oActions = {add: true};
									
									if (oParam != undefined)
									{
										if (oParam.objectContext != undefined) {iObjectContext = oParam.objectContext}
										if (oParam.xhtmlElementId != undefined) {sXHTMLElementId = oParam.xhtmlElementId}
										if (oParam.options != undefined) {oOptions = oParam.options}
										if (oParam.actions != undefined) {oActions = oParam.actions}
									}		
										
									if (oResponse == undefined)
									{	
										$.ajax(
										{
											type: 'GET',
											url: '/ondemand/setup/?method=SETUP_STRUCTURE_ELEMENT_SEARCH&structure=' + ns1blankspace.objectContextData.structure + '&category=' + ns1blankspace.objectContextData.structurecategory,
											dataType: 'json',
											success: function(data) {ns1blankspaceSetupWebsiteFormStructure(oParam, data)}
										});

									}
									else
									{
										if (oActions != undefined)
										{
											var aHTML = [];
												
														
											aHTML.push('<table id="tablens1blankspaceMainPages" class="ns1blankspaceMain">' +
														'<tr id="trns1blankspaceMainWebsiteFormStructureRow1" class="ns1blankspaceMainRow1">' +
														'<td id="tdns1blankspaceMainWebsiteFormStructureColumn1" class="ns1blankspaceMainColumn1Large">' +
														ns1blankspace.xhtml.loading +
														'</td>' +
														'<td id="tdns1blankspaceMainWebsiteFormStructureColumn2" class="ns1blankspaceMainColumn2Action">' +
														'</td>' +
														'</tr>' +
														'</table>';					
												
											$('#' + sXHTMLElementId).html(aHTML.join(''));
											sXHTMLElementId = 'tdns1blankspaceMainWebsiteFormStructureColumn1';
											
											var aHTML = [];
												
											
											aHTML.push('<table id="tablens1blankspaceMainWebsiteFormStructureColumn2" class="ns1blankspaceMainColumn2">';
											
											if (oActions.add)
											{
												aHTML.push('<tr><td id="tdns1blankspaceMainFormStructureAdd" class="ns1blankspaceMainAction">' +
															'<span id="spanns1blankspaceMainFormStructureAdd">Add</span>' +
															'</td></tr>';
											}
											
											aHTML.push('</table>';					
											
											$('#tdns1blankspaceMainWebsiteFormStructureColumn2').html(aHTML.join(''));
										
											$('#spanns1blankspaceMainFormStructureAdd').button(
											{
												label: "Add"
											})
											.click(function() {
												 ns1blankspaceWebsiteFormStructureAdd(oParam);
											})
											
										}	
									
										var aHTML = [];
										
										
										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table id="tableWebsiteFormStructure" border="0" cellspacing="0" cellpadding="0" class="ns1blankspaceMain">';
											aHTML.push(''
											aHTML.push('<tr class="ns1blankspaceMainCaption">' +
															'<td class="ns1blankspaceMainRowNothing">No layout elements.</td></tr>';
											aHTML.push('</table>';

											$('#' + sXHTMLElementId).html(aHTML.join(''));
										
										}
										else
										{
											aHTML.push('<table id="tableClientAudits" border="0" cellspacing="0" cellpadding="0" class="ns1blankspaceMain">';
											aHTML.push(''
											aHTML.push('<tr class="ns1blankspaceMainCaption">';
											aHTML.push('<td class="ns1blankspaceMainCaption">Title</td>';
											aHTML.push('<td class="ns1blankspaceMainCaption">Type</td>';
											aHTML.push('<td class="ns1blankspaceMainCaption">&nbsp;</td>';
											aHTML.push('</tr>';
											
											$.each(oResponse.data.rows, function()
											{
												aHTML.push('<tr class="ns1blankspaceMainRow">';
																
												aHTML.push('<td id="tdWebsiteFormStructure_title-' + this.id + '" class="ns1blankspaceMainRow">' +
																		this.title + '</td>';
																		
												aHTML.push('<td id="tdWebsiteFormStructure_type-' + this.id + '" class="ns1blankspaceMainRow">' +
																		this.datatypetext + '</td>';
																		
												aHTML.push('<td style="width:60px;text-align:right;" class="ns1blankspaceMainRow">';
													
												if (oOptions.remove)
												{	
													aHTML.push('<span id="spanWebsiteFormStructureoptions_remove-' + this.id + '" class="ns1blankspaceMainRowOptionsRemove"></span>';
												};	
													
												if (oOptions.view)
												{	
													aHTML.push('<span id="spanWebsiteFormStructure_options_view-' + this.id + '" class="ns1blankspaceMainRowOptionsView"></span>';
												};	
													
												aHTML.push('</td>';
																
												aHTML.push('</tr>';
											});
											
											aHTML.push('</table>';

											$('#' + sXHTMLElementId).html(aHTML.join(''));
											
											if (oOptions.view) 
											{
												$('.ns1blankspaceMainRowOptionsRemove').button( {
													text: false,
													icons: {
														primary: "ui-icon-close"
													}
												})
												.click(function() {
													ns1blankspaceWebsiteFormStructureRemove({xhtmlElementID: this.id});
												})
												.css('width', '15px')
												.css('height', '17px')
											}
											
											if (oOptions.remove) 
											{
												$('.ns1blankspaceMainRowOptionsView').button( {
													text: false,
													icons: {
														primary: "ui-icon-play"
													}
												})
												.click(function() {
													ns1blankspaceWebsiteFormStructureAdd({xhtmlElementID: this.id})
												})
												.css('width', '15px')
												.css('height', '17px')
											}	
										}
									}	
								},

					add:		function ns1blankspaceWebsiteFormStructureAdd(oParam, oResponse)
								{
									var sID; 
									
									if (oResponse == undefined)
									{
										var sXHTMLElementID;

										if (oParam != undefined)
										{
											if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
										}
										
										if (sXHTMLElementID != undefined)
										{
											var aXHTMLElementID = sXHTMLElementID.split('-');
											var sID = aXHTMLElementID[1];
										}	
									
										var aHTML = [];
										

										aHTML.push('<table id="tablens1blankspaceMainColumn1" class="ns1blankspaceMain">';
												
										aHTML.push('<tr id="trns1blankspaceMainSetupWebsiteFormStructureTitle" class="ns1blankspaceMain">' +
														'<td id="tdns1blankspaceMainSetupWebsiteFormStructureTitle" class="ns1blankspaceMain">' +
														'Title' +
														'</td></tr>' +
														'<tr id="trns1blankspaceMainSetupWebsiteFormStructureAddTitleValue" class="ns1blankspaceMainText">' +
														'<td id="tdns1blankspaceMainSetupWebsiteFormStructureAddTitleValue" class="ns1blankspaceMainText">' +
														'<input id="inputns1blankspaceMainSetupWebsiteFormStructureAddTitle" class="inputns1blankspaceMainText">' +
														'</td></tr>';
										
									aHTML.push('<tr id="trns1blankspaceMainDetailsDataType" class="ns1blankspaceMain">' +
														'<td id="tdns1blankspaceMainDetailsDataType" class="ns1blankspaceMain">' +
														'Data Type' +
														'</td></tr>' +
														'<tr id="trns1blankspaceMainDetailsDataType" class="ns1blankspaceMainText">' +
														'<td id="tdns1blankspaceMainDetailsDataTypeValue" class="ns1blankspaceMainRadio">' +
														'<input type="radio" id="radioDataType4" name="radioDataType" value="4"/>Text (Single Line)' +
														'<br /><input type="radio" id="radioDataType1" name="radioDataType" value="1"/>Text (Multi Line)' +
														'<br /><input type="radio" id="radioDataType3" name="radioDataType" value="3"/>Date' +
														'<br /><input type="radio" id="radioDataType2" name="radioDataType" value="2"/>Numeric' +
														'</td></tr>';
										
										
										aHTML.push('</table>';					
										
										$('#tdns1blankspaceMainWebsiteFormStructureColumn1').html(aHTML.join(''));
										
										var aHTML = [];
										
									
										aHTML.push('<table id="tablens1blankspaceMainColumn2" class="ns1blankspaceMain">';
												
										aHTML.push('<tr id="trns1blankspaceMainWebsiteFormStructureAddSave" class="ns1blankspaceMainAction">' +
														'<td id="tdns1blankspaceMainWebsiteFormStructureAddSave" class="ns1blankspaceMainAction">' +
														'<span style="width:80px;" id="spanns1blankspaceMainWebsiteFormStructureAddSave">Save</span>' +
														'</td></tr>';
									
										aHTML.push('<tr id="trns1blankspaceMainWebsiteFormStructureAddCancel" class="ns1blankspaceMainAction">' +
														'<td id="tdns1blankspaceMainWebsiteFormStructureAddCancel" class="ns1blankspaceMainAction">' +
														'<span style="width:80px;" id="spanns1blankspaceMainWebsiteFormStructureAddCancel">Cancel</span>' +
														'</td></tr>';
														
										aHTML.push('</table>';					
										
										$('#tdns1blankspaceMainWebsiteFormStructureColumn2').html(aHTML.join(''));
										
										$('#spanns1blankspaceMainWebsiteFormStructureAddSave').button(
										{
											text: "Save"
										})
										.click(function() 
										{
											var sData = 'structure=' + ns1blankspace.objectContextData.structure;
											sData += '&category=' + ns1blankspace.objectContextData.structurecategory;
											sData += '&id=' + ns1blankspace.util.fs(sID);
											sData += '&title=' + ns1blankspace.util.fs($('#inputns1blankspaceMainSetupWebsiteFormStructureAddTitle').val());
											sData += '&datatype=' + ns1blankspace.util.fs($('input[name="radioDataType"]:checked').val());	
											
											$.ajax(
											{
												type: 'POST',
												url: '/ondemand/setup/?method=SETUP_STRUCTURE_ELEMENT_MANAGE',
												data: sData,
												dataType: 'json',
												success: function() {
													ns1blankspaceMainViewportShow("#divns1blankspaceMainStructure");
													ns1blankspaceSetupWebsiteFormStructure();
												}
											});
										});
										
										$('#spanns1blankspaceMainWebsiteFormStructureAddCancel').button(
										{
											text: "Cancel"
										})
										.click(function() 
										{
											ns1blankspaceMainViewportShow("#divns1blankspaceMainStructure");
											ns1blankspaceSetupWebsiteFormStructure();
										});
										
										if (sID != undefined)
										{
											$.ajax(
											{
												type: 'POST',
												url: '/ondemand/setup/?method=SETUP_STRUCTURE_ELEMENT_SEARCH',
												data: 'id=' + sID,
												dataType: 'json',
												success: function(data) {ns1blankspaceWebsiteFormStructureAdd(oParam, data)}
											});
										}
										else
										{
											$('[name="radioDataType"][value="4"]').attr('checked', true);	
										}
									}
									else
									{
										if (oResponse.data.rows.length != 0)
										{
											var oObjectContext = oResponse.data.rows[0];
											$('#inputns1blankspaceMainSetupWebsiteFormStructureAddTitle').val(oObjectContext.title)
											$('[name="radioDataType"][value="' + oObjectContext.datatype + '"]').attr('checked', true);
											$('#inputns1blankspaceMainSetupWebsiteFormStructureAddTitle').focus();
										}
									}		
								},

					remove:		function ns1blankspaceWebsiteFormStructureRemove(oParam, oResponse)
								{
									var sXHTMLElementID;

									if (oParam != undefined)
									{
										if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
									}
									
									var aXHTMLElementID = sXHTMLElementID.split('-');
									var sID = aXHTMLElementID[1];
									
									if (oResponse == undefined)
									{	
										var sParam = 'method=SETUP_STRUCTURE_ELEMENT_MANAGE&remove=1';
										var sData = 'id=' + sID;
										
										$.ajax(
										{
											type: 'POST',
											url: '/ondemand/setup/?' + sParam,
											data: sData,
											dataType: 'json',
											success: function(data){ns1blankspaceWebsiteFormStructureRemove(oParam, data)}
										});
									}	
									else
									{
										if (oResponse.status == 'OK')
										{
											$('#' + sXHTMLElementID).parent().parent().fadeOut(500);
										}	
									}	
								}
				}
}								