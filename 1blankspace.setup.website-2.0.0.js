/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 
ns1blankspace.setup.website = 
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
					ns1blankspace.objectName = 'website';
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.viewName = 'Websites & Webapps';
					
					if (bShowHome)
					{
						ns1blankspace.history.view({
							newDestination: 'ns1blankspace.setup.website.init({showHome: true});',
							move: false
							});	
					}	
							
					ns1blankspace.app.reset();
					ns1blankspace.app.set(oParam);
					ns1blankspace.setup.website.bind();
				},

	bind:		function ()
				{
					$('#ns1blankspaceActionOptionsRemove').click(function(event)
					{
						ns1blankspace.setup.website.remove();
					});
				},

	home:		function (oResponse)
				{
					if (oResponse == undefined)
					{
						$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);

						var aHTML = [];
			
						aHTML.push('<table class="ns1blankspaceMain">' + 
										'<tr class="ns1blankspaceMain">' +
										'<td id="ns1blankspaceMostLikely">' +
										ns1blankspace.xhtml.loading + '</td>' +
										'<td id="ns1blankspaceHomeAction" style="width:175px;"></td>' +
										'</tr></table>');					
						
						$('#ns1blankspaceMain').html(aHTML.join(''));
											
						var aHTML = [];

						aHTML.push('<table>' +
							'<tr><td><div id="ns1blankspaceViewSetupWebsiteLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>' +
							'</table>');			
						
						$('#ns1blankspaceControl').html(aHTML.join(''));	
						
						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspaceColumn2">');
						
						aHTML.push('<tr><td style="width:200px; font-size:0.875em;" >' +
										'<a href="/site/1262/mydigitalspace_attachment_loader.zip"' +
										' id="ns1blankspaceAttachmentUploader">Get the file attachment uploader for Windows</a>' +
										'</td></tr>');	
														
						aHTML.push('</td></tr></table>');					

						$('#ns1blankspaceHomeAction').html(aHTML.join(''));	
						
						$.ajax(
						{
							type: 'GET',
							url: ns1blankspace.util.endpointURI('SETUP_SITE_SEARCH') + '&rows=50',
							dataType: 'json',
							success: ns1blankspace.setup.website.home
						});
						
					}
					else
					{
						var aHTML = [];

						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table>' +
											'<tr><td class="ns1blankspaceNothing">Click New to create a user.</td></tr>' +
											'</table>');
						}
						else
						{
						
							aHTML.push('<table>');
							
							$.each(oResponse.data.rows, function()
							{	
								aHTML.push('<tr class="ns1blankspaceRow">');
								
								aHTML.push('<td id="ns1blankspaceSetupWebsiteMostLikely_title-' + this.id + 
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
							ns1blankspace.setup.website.search.send(event.target.id, {source: 1});
						});
					}
				},

	search: 	{
					send: 		function (sXHTMLElementId, oParam)
								{
									var aSearch = sXHTMLElementId.split('-');
									var sElementId = aSearch[0];
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
											url: ns1blankspace.util.endpointURI('SETUP_SITE_SEARCH'),
											data: 'id=' + ns1blankspace.objectContext,
											dataType: 'json',
											success: function(data) {ns1blankspace.setup.website.show(oParam, data)}
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
											ns1blankspace.container.position(sElementId);
											ns1blankspace.search.tart(sElementId);
											
											$.ajax(
											{
												type: 'GET',
												url: ns1blankspace.util.endpointURI('SETUP_SITE_SEARCH'),
												data: 'quicksearch=' + sSearchText,
												dataType: 'json',
												success: function(data) {ns1blankspace.setup.website.search.send(oParam, data)}
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
											
											aHTML.push('<td class="ns1blankspaceSearch" id="title' +
															'-' + this.id + '">' +
															this.title + '</td>');
											
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
											$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
											ns1blankspace.setup.website.search.send(event.target.id, {source: 1});
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

						aHTML.push('<tr><td>&nbsp;</td></tr>');

						aHTML.push('<tr><td id="ns1blankspaceControlAttachments" class="ns1blankspaceControl">' +
										'Attachments</td></tr>');

						aHTML.push('<tr><td>&nbsp;</td></tr>');

						aHTML.push('<tr><td id="ns1blankspaceControlPages" class="ns1blankspaceControl">' +
										'Pages</td></tr>');

						aHTML.push('<tr><td id="ns1blankspaceControlForms" class="ns1blankspaceControl">' +
										'Forms</td></tr>');

						aHTML.push('<tr><td>&nbsp;</td></tr>');

						aHTML.push('<tr><td id="ns1blankspaceControlAdvanced" class="ns1blankspaceControl">' +
										'Advanced</td></tr>');

						aHTML.push('<tr><td id="ns1blankspaceControlScripts" class="ns1blankspaceControl">' +
										'Scripts</td></tr>');

						aHTML.push('<tr><td id="ns1blankspaceControlURLs" class="ns1blankspaceControl">' +
										'URLs</td></tr>');
					}	

					aHTML.push('</table>');					
								
					$('#ns1blankspaceControl').html(aHTML.join(''));

					var aHTML = [];
					
					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainDetails" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainLayout" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainAttachments" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainAddAttachment" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainPages" class="ns1blankspaceControlMain"></div>');	
					aHTML.push('<div id="ns1blankspaceMainAdvanced" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainScripts" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainURLs" class="ns1blankspaceControlMain"></div>');	
					aHTML.push('<div id="ns1blankspaceMainWebapp" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainForms" class="ns1blankspaceControlMain"></div>');		
						
					$('#ns1blankspaceMain').html(aHTML.join(''));
						
					$('#ns1blankspaceControlSummary').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
						ns1blankspace.setup.website.summary();
					});
					
					$('#ns1blankspaceControlDetails').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
						ns1blankspace.setup.website.details();
					});
					
					$('#ns1blankspaceControlLayout').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainLayout'});
						ns1blankspace.setup.website.style();
					});
						
					$('#ns1blankspaceControlAttachments').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainAttachments'});
						ns1blankspace.attachments.show(
						{
							xhtmlElementID: 'ns1blankspaceMainAttachments',
							label: 'Select the file attachment:',
							maxFiles: 1,
							helpNotes: 'If you upload a file with the same name as an existing attachment it will automatically be replaced.'
						});
					});

					$('#ns1blankspaceControlPages').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainPages'});
						ns1blankspace.setup.website.css.getURI();  //after getting custom css it calls pages.show()
					});

					$('#ns1blankspaceControlForms').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainForms'});
						ns1blankspace.setup.website.forms();
					});
					
					$('#ns1blankspaceControlAddAttachment').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainAddAttachment'});
						ns1blankspace.setup.website.attachment.add();
					});
					
					$('#ns1blankspaceControlAdvanced').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainAdvanced'});
						ns1blankspace.setup.website.advanced();
					});
					
					$('#ns1blankspaceControlScripts').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainScripts'});
						ns1blankspace.setup.website.scripts();
					});

					$('#ns1blankspaceControlURLs').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainURLs'});
						ns1blankspace.setup.website.urls.show();
					});
				},

	show: 		function (oParam, oResponse)
				{
					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
					ns1blankspace.setup.website.layout();
					
					var aHTML = [];
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
						
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find this website.</td></tr></table>');
								
						$('#ns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						ns1blankspace.objectContextData = oResponse.data.rows[0];
						
						$('#ns1blankspaceControlContext').html(ns1blankspace.objectContextData.title);
						$('#ns1blankspaceViewControlAction').button({disabled: false});
						$('#ns1blankspaceViewControlActionOptions').button({disabled: false});

						ns1blankspace.history.view({
							newDestination: 'ns1blankspace.setup.website.init({showHome: false});ns1blankspace.setup.website.search.send("-' + ns1blankspace.objectContext + '")',
							move: false
							});
						
						ns1blankspace.history.control({functionDefault: 'ns1blankspace.setup.website.summary()'});
					}	
				},	
		
	summary:	function ()
				{
					var aHTML = [];
					
					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML.push('<table><tr><td valign="top">Sorry can\'t find this website.</td></tr></table>');
								
						$('#ns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						aHTML.push('<table class="ns1blankspaceMain">' +
									'<tr class="ns1blankspaceRow">' +
									'<td id="ns1blankspaceSummaryColumn1" class="ns1blankspaceColumn1Flexible"></td>' +
									'<td id="ns1blankspaceSummaryColumn2" class="ns1blankspaceColumn2" style="width:300px;"></td>' +
									'</tr>' +
									'</table>');				
						
						$('#ns1blankspaceMainSummary').html(aHTML.join(''));	
					
						var aHTML = [];
					
						aHTML.push('<table>');

						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Site ID</td></tr>' +
										'<tr><td id="ns1blankspaceSummarySiteID" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.id +
										'</td></tr>');
				
						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Status</td></tr>' +
										'<tr><td id="ns1blankspaceSummarySiteStatus" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.statustext +
										'</td></tr>');

						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Attachments URL</td></tr>' +
										'<tr><td id="ns1blankspaceSummarySiteAttachmentsURL" class="ns1blankspaceSummary">' +
										'/site/' + ns1blankspace.objectContextData.id + '/' +
										'</td></tr>');

						if (ns1blankspace.objectContextData.ondemandstatustext == '')
						{
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">App Status</td></tr>' +
										'<tr><td class="interfaceMainSummary">' +
										'Not Enabled (click Advanced to enable requests to the site)' +
										'</td></tr>');

						}
						else
						{
							aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">App Status</td></tr>' +
										'<tr><td class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.ondemandstatustext +
										'</td></tr>');
						}			

						aHTML.push('</table>');					
						
						$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));

						var aHTML = [];
							
						
						aHTML.push('<table class="ns1blankspaceColumn2">');
											
						aHTML.push('<tr><td class="ns1blankspaceSummaryColumn2Action" style="width:175px;">' +
										'<a href="#" id="ns1blankspaceSummarySetupWebApp">' +
										'<strong>Set up as a jQuery webapp</strong></a>' +
										'</td></tr>');
									
						if (ns1blankspace.objectContextData.primaryurl != '')
						{
							aHTML.push('<tr><td class="ns1blankspaceSummaryColumn2Action" style="width:175px; padding-top:10px;">' +
										'<a href="' + ns1blankspace.objectContextData.primaryurl + '" target="_blank">' + ns1blankspace.objectContextData.primaryurl + '</a>' +
										'</td></tr>');
						}		
									
						aHTML.push('<tr><td class="ns1blankspaceSub" style="font-size:0.75em;">' +
										'<br /><hr />' +
										'<br />Use the Attachments link to add your js scripts and update the Scripts section to reference them and any other scripts your app may require.' +
										'</td>' +
										'</tr>');			
									
						aHTML.push('</table>');					
						
						$('#ns1blankspaceSummaryColumn2').html(aHTML.join(''));
										
						$('#ns1blankspaceSummarySetupWebApp').click(function() 
						{
							ns1blankspace.show({selector: '#ns1blankspaceMainWebapp'});
							ns1blankspace.setup.website.webapp();
						});
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
										'Email' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceDetailsEmail" class="ns1blankspaceText">' +
										'</td></tr>');
							
						aHTML.push('</table>');					
						
						$('#ns1blankspaceDetailsColumn1').html(aHTML.join(''));
						
						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspaceColumn2">');

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Status' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioStatus2" name="radioStatus" value="2"/>Open' +
										'<br /><input type="radio" id="radioStatus1" name="radioStatus" value="1"/>Closed' +
										'</td></tr>');
	
						aHTML.push('</table>');					
						
						$('#ns1blankspaceDetailsColumn2').html(aHTML.join(''));
						
						if (ns1blankspace.objectContextData != undefined)
						{
							$('#ns1blankspaceDetailsTitle').val(ns1blankspace.objectContextData.title);
							$('#ns1blankspaceDetailsEmail').val(ns1blankspace.objectContextData.email);
							$('[name="radioStatus"][value="' + ns1blankspace.objectContextData.status + '"]').attr('checked', true);
						}
						else
						{
							$('[name="radioStatus"][value="2"]').attr('checked', true);	
						}
					}	
				},

	style:		function ()
				{
					var aHTML = [];
					
					if ($('#ns1blankspaceMainLayout').attr('data-loading') == '1')
					{
						$('#ns1blankspaceMainLayout').attr('data-loading', '');
						
						aHTML.push('<table class="ns1blankspaceContainer">' +
										'<tr class="ns1blankspaceContainer">' +
										'<td id="ns1blankspaceLayoutColumn1" class="ns1blankspaceColumn1"></td>' +
										'<td id="ns1blankspaceLayoutColumn2" class="ns1blankspaceColumn2"></td>' +
										'</tr>' + 
										'</table>');					
						
						$('#ns1blankspaceMainLayout').html(aHTML.join(''));

						var aHTML = [];

						aHTML.push('<table class="ns1blankspace">');
						
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Style' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioLayout3" name="radioLayout" value="3"/>None (Use CSS/Divs)' +
										'<br /><input type="radio" id="radioLayout2" name="radioLayout" value="2"/>Using Tables' +
										'<br /><input type="radio" id="radioLayout1" name="radioLayout" value="1"/>Using Frames' +
										'</td></tr>');			
							
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'CSS Attachment' +
										'</td></tr>' +
										'<tr class="ns1blankspaceRadio">' +
										'<td id="ns1blankspaceDetailsCSSAttachment" class="ns1blankspaceRadio">' +
											'<span id="ns1blankspaceSetupWebsiteCSSContainer">' +
											ns1blankspace.xhtml.loadingSmall + '</span>');
						
						aHTML.push('</td></tr>');				
										
						aHTML.push('</table>');					
						
						$('#ns1blankspaceLayoutColumn1').html(aHTML.join(''));
						
						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspaceColumn2">');
						
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Header Height' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceLayoutHeaderHeight" class="ns1blankspaceText">' +
										'</td></tr>');		

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Footer Height' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceLayoutFooterHeight" class="ns1blankspaceText">' +
										'</td></tr>');		

						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Columns' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceLayoutColumns" class="ns1blankspaceText">' +
										'</td></tr>');		
						
						aHTML.push('</table>');					
						
						$('#ns1blankspaceLayoutColumn2').html(aHTML.join(''));
						
						if (ns1blankspace.objectContextData != undefined)
						{
							$('#ns1blankspaceLayoutHeaderHeight').val(ns1blankspace.objectContextData.headerheight);
							$('#ns1blankspaceLayoutFooterHeight').val(ns1blankspace.objectContextData.footerheight);
							$('#ns1blankspaceLayoutColumns').val(ns1blankspace.objectContextData.columns);
							$('[name="radioLayout"][value="' + ns1blankspace.objectContextData.layout + '"]').attr('checked', true);
							ns1blankspace.setup.website.css.list(ns1blankspace.objectContextData.cssattachment);
						}
						else
						{
							$('[name="radioLayout"][value="3"]').attr('checked', true);
							ns1blankspace.setup.website.css.list(-1);
						}
					}	
				},

	css: 		{
					list: 		function (iValue)
								{
									var oSearch = new AdvancedSearch();
									oSearch.method = 'CORE_ATTACHMENT_SEARCH';
									
									oSearch.addField('filename,attachment');
									oSearch.addFilter('filename', 'TEXT_IS_LIKE', 'css')
									oSearch.addFilter('object', 'EQUAL_TO', 40);
									oSearch.addFilter('objectcontext', 'EQUAL_TO', ns1blankspace.objectContext)
									oSearch.rf = 'json';
									oSearch.sort('filename', 'asc');
									
									oSearch.getResults(function(oResponse)
									{
										var aHTML = [];

										aHTML.push('<input type="radio" id="radioCSSAttachment-1" name="radioCSSAttachment" value="-1"/>' +
																	'None<br />');

										$.each(oResponse.data.rows, function()
										{
											aHTML.push('<input type="radio" id="radioCSSAttachment' + this.attachment + '" name="radioCSSAttachment" value="' + this.attachment + '"/>' +
																this.filename + '<br />');				
										});
										
										$('#ns1blankspaceSetupWebsiteCSSContainer').html(aHTML.join(''));
										$('[name="radioCSSAttachment"][value="' + iValue + '"]').attr('checked', true);
									});
								},

					getURI: 	function (oParam)
								{
									var iCSSAttachment = (ns1blankspace.objectContextData.cssattachment ? ns1blankspace.objectContextData.cssattachment : -1);
									var fCallback = ns1blankspace.setup.website.pages.show;

									if (oParam != undefined)
									{
										if (oParam.cssAttachment != undefined) {iCSSAttachment = oParam.cssAttachment}
									}

									if 	(iCSSAttachment != -1 && ns1blankspace.objectContextData.cssuri == undefined)
									{
										var oSearch = new AdvancedSearch();
										oSearch.method = 'CORE_ATTACHMENT_SEARCH';
										oSearch.addField('filename');
										oSearch.addFilter('attachment', 'EQUAL_TO', iCSSAttachment);
										oSearch.rf = 'json';
										
										oSearch.getResults(function(oResponse)
										{
											if (oResponse.status = "OK")
											{
												if (oResponse.data.rows.length > 0)
												{
													ns1blankspace.objectContextData.cssuri = '/site/' + ns1blankspace.objectContext + '/' +
														oResponse.data.rows[0].filename;
												}		
											}	
											 
											fCallback();
										});
									}
									else
									{
										fCallback();
									}
								},
	
				},	

	advanced:	function ()
				{
					if ($('#ns1blankspaceMainAdvanced').attr('data-loading') == '1')
					{
						$('#ns1blankspaceMainAdvanced').attr('data-loading', '');
						
						var aHTML = [];
											
						aHTML.push('<table class="ns1blankspace">');
					
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'App Status' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioAppStatus1" name="radioAppStatus" value="1"/>Disabled' +
										'<br /><input type="radio" id="radioAppStatus2" name="radioAppStatus" value="2"/>' +
												'Enabled For Testing (Allow requests from any source/site)' +
												'<br /><input type="radio" id="radioAppStatus3" name="radioAppStatus" value="3"/>' +
												'Enabled (Requests only from this website)' +
												'<br /><input type="radio" id="radioAppStatus4" name="radioAppStatus" value="4"/>' +
												'Enabled For Testing (Allow Requests from any source/site & access to any space)' +
												'<br /><input type="radio" id="radioAppStatus5" name="radioAppStatus" value="5"/>' +
												'Enabled (Requests only from this website & access to any space)' +
										'</td></tr>');
						
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Web Page Title' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio">' +
										'<input type="radio" id="radioTitleN" name="radioTitle" value="N"/>Use Document Title' +
										'<br /><input type="radio" id="radioTitleY" name="radioTitle" value="Y"/>Use Document Keywords' +
										'</td></tr>');		
	
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Document Type' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceTextMulti">' +
										'<textarea style="height: 50px;" rows="3" cols="35" id="ns1blankspaceAdvancedDocumentType" class="ns1blankspaceTextMultiLarge"></textarea>' +
										'</td></tr>');		
					
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'BODY Tag' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceTextMulti">' +
										'<textarea style="height: 50px;" rows="3" cols="35" id="ns1blankspaceAdvancedBodyTag" class="ns1blankspaceTextMultiLarge"></textarea>' +
										'</td></tr>');		
										
						aHTML.push('</table>');					
						
						$('#ns1blankspaceMainAdvanced').html(aHTML.join(''));
						
						if (ns1blankspace.objectContextData != undefined)
						{
							$('[name="radioAppStatus"][value="' + ns1blankspace.objectContextData.ondemandstatus + '"]').attr('checked', true);
							$('[name="radioTitle"][value="' + ns1blankspace.objectContextData.usekeywordsastitle + '"]').attr('checked', true);
							$('[name="radioTitle"][value="' +ns1blankspace.objectContextData.layout + '"]').attr('checked', true);
							$('#ns1blankspaceAdvancedDocumentType').val((ns1blankspace.objectContextData.documenttype).formatXHTML());
							$('#ns1blankspaceAdvancedBodyTag').val((ns1blankspace.objectContextData.bodytag).formatXHTML());
						}
					}	
				},

	scripts: 	function ()
				{
					if ($('#ns1blankspaceMainScripts').attr('data-loading') == '1')
					{
						$('#ns1blankspaceMainScripts').attr('data-loading', '');
						
						var aHTML = [];
											
						aHTML.push('<table class="ns1blankspace">');
					
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Header Script' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceTextMulti">' +
										'<textarea style="height: 350px;" rows="20" cols="80" id="ns1blankspaceScriptsHeader" class="ns1blankspaceTextMultiLarge"></textarea>' +
										'</td></tr>');		
						
						aHTML.push('<tr class="ns1blankspaceCaption">' +
										'<td class="ns1blankspaceCaption">' +
										'Footer Script (eg Google Analytics)' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceTextMulti">' +
										'<textarea style="height: 150px;" rows="20" cols="80" id="ns1blankspaceScriptsFooter" class="ns1blankspaceTextMultiLarge"></textarea>' +
										'</td></tr>');	
														
						aHTML.push('</table>');					
						
						$('#ns1blankspaceMainScripts').html(aHTML.join(''));
						
						if (ns1blankspace.objectContextData != undefined)
						{
							$('#ns1blankspaceScriptsHeader').val((ns1blankspace.objectContextData.headerscript).formatXHTML());
							$('#ns1blankspaceScriptsFooter').val((ns1blankspace.objectContextData.footerscript).formatXHTML());
						}
					}	
				},

	pages: 		{			
					show: 		function (oParam, oResponse)
								{
									var iObjectContext = ns1blankspace.objectContext;
									var oOptions = {view: true, remove: true};
									var oActions = {add: true};
									
									if (oParam != undefined)
									{
										if (oParam.objectContext != undefined) {iObjectContext = oParam.objectContext}
										if (oParam.options != undefined) {oOptions = oParam.options}
										if (oParam.actions != undefined) {oActions = oParam.actions}
									}		
										
									if (oResponse == undefined)
									{
										$.ajax(
										{
											type: 'GET',
											url: ns1blankspace.util.endpointURI('SETUP_SITE_DOCUMENT_SEARCH'),
											data: 'site=' + iObjectContext,
											dataType: 'json',
											success: function(data) {ns1blankspace.setup.website.pages.show(oParam, data)}
										});
									}
									else
									{
										if (oActions != undefined)
										{
											var aHTML = [];
												
											aHTML.push('<table class="ns1blankspaceContainer">' +
															'<tr class="ns1blankspaceContainer">' +
															'<td id="ns1blankspacePagesColumn1" class="ns1blankspaceColumn1Flexible"></td>' +
															'<td id="ns1blankspacePagesColumn2" class="ns1blankspaceColumn2" style="width:100px;"></td>' +
															'</tr>' + 
															'</table>');	
												
											$('#ns1blankspaceMainPages').html(aHTML.join(''));

											var aHTML = [];

											aHTML.push('<table class="ns1blankspaceColumn2">');
											
											if (oActions.add)
											{
												aHTML.push('<tr><td class="ns1blankspaceAction">' +
																'<span id="ns1blankspaceSetupWebsitePagesAdd">Add</span>' +
																'</td></tr>');
											}
											
											aHTML.push('</table>');					
											
											$('#ns1blankspacePagesColumn2').html(aHTML.join(''));
										
											$('#ns1blankspaceSetupWebsitePagesAdd').button(
											{
												label: "Add"
											})
											.click(function() {
												 ns1blankspace.setup.website.pages.add(oParam);
											})
										}	
									
										var aHTML = [];

										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table><tr><td class="ns1blankspaceNothing">No pages.</td></tr></table>');
	
											$('#ns1blankspacePagesColumn1').html(aHTML.join(''));
										}
										else
										{
											aHTML.push('<table id="ns1blankspaceSetupWebsitePages">');
											aHTML.push('<tr class="ns1blankspaceCaption">');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">Title</td>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">URL</td>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">Type</td>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">Sharing</td>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>');
											aHTML.push('</tr>');
											
											$.each(oResponse.data.rows, function()
											{	
												aHTML.push('<tr class="ns1blankspaceRow">');
																
												aHTML.push('<td id="ns1blankspaceWebsitePages_title-' + this.id + '" class="ns1blankspaceRow">' +
																		this.documenttitle + '</td>');
																		
												aHTML.push('<td id="ns1blankspaceWebsitePages_url-' + this.id + '" class="ns1blankspaceRow">' +
																		this.documenturl + '</td>');
																		
												if (this.locationtext == 'Header' || this.locationtext == 'Home')
												{				
													aHTML.push('<td id="ns1blankspaceWebsitePages_location-' + this.id + '" class="ns1blankspaceRow">' +
																		this.locationtext + '</td>');
												}	
												else
												{
													aHTML.push('<td id="ns1blankspaceWebsitePages_location-' + this.id + '" class="ns1blankspaceRow" style="color:#A0A0A0;">' +
																		'Page</td>');
												}						
												
												if (this.documentpublic == 'Y')
												{				
													aHTML.push('<td id="ns1blankspaceWebsitePages_public-' + this.id + '" class="ns1blankspaceRow">' +
																		'Public</td>');
												}
												else
												{
													aHTML.push('<td id="ns1blankspaceWebsitePages_public-' + this.id + '" class="ns1blankspaceRow">' +
																		'Private</td>');
												}		
																		
												aHTML.push('<td style="width:60px;text-align:right;" class="ns1blankspaceRow">');
												
												aHTML.push('<span id="ns1blankspaceWebsitePage_options_remove-' + this.id + '" class="ns1blankspaceRowRemove"></span>');
											
												aHTML.push('<span id="ns1blankspaceWebsitePage_options_select-' + this.id + '" class="ns1blankspaceRowSelect"></span>');
																	
												aHTML.push('</td></tr>');
											});
											
											aHTML.push('</table>');

											$('#ns1blankspacePagesColumn1').html(aHTML.join(''));
											
											$('#ns1blankspaceSetupWebsitePages .ns1blankspaceRowRemove').button({
												text: false,
												icons: {
													primary: "ui-icon-close"
												}
											})
											.click(function() {
												ns1blankspace.setup.website.pages.remove({xhtmlElementID: this.id});
											})
											.css('width', '15px')
											.css('height', '17px');
											
											
											$('#ns1blankspaceSetupWebsitePages span.ns1blankspaceRowSelect').button({
												text: false,
												icons: {
													primary: "ui-icon-play"
												}
											})
											.click(function() {
												ns1blankspace.setup.website.pages.edit({xhtmlElementID: this.id})
											})
											.css('width', '15px')
											.css('height', '17px');
										}
									}	
								},

					edit:		function (oParam, oResponse)
								{
									var sID; 
									var iDocumentType = 5;
									
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
										
										aHTML.push('<table class="ns1blankspace">');
												
										aHTML.push('<tr class="ns1blankspace">' +
														'<td class="ns1blankspaceCaption">' +
														'Title' +
														'</td></tr>' +
														'<tr class="ns1blankspaceText">' +
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceSetupWebsitePageTitle" class="ns1blankspaceText">' +
														'</td></tr>');
										
										aHTML.push('<tr"><td class="ns1blankspace">');
														
											aHTML.push('<table class="ns1blankspace">');
											
											aHTML.push('<tr class="ns1blankspace">' +
															'<td class="ns1blankspaceCaption">' +
															'URL' +
															'</td>' +
															'<td class="ns1blankspaceCaption">' +
															'Type' +
															'</td>' +
															'<td class="ns1blankspaceCaption">' +
															'Format' +
															'</td>' +
															'<td class="ns1blankspaceCaption">' +
															'Sharing' +
															'</td></tr>');
															
											aHTML.push('<tr class="ns1blankspaceText">' +
															'<td class="ns1blankspaceText" style="width:325px;">' +
															'<input id="ns1blankspaceSetupWebsitePageURL" class="ns1blankspaceText" style="width:275px;">' +
															'</td>');
													
											aHTML.push('<td class="ns1blankspaceRadio">' +
															'<input type="radio" id="radioType9" name="radioType" value="9"/>Page' +
															'<br /><input type="radio" id="radioType2" name="radioType" value="2"/>Home' +
															'<br /><input type="radio" id="radioType3" name="radioType" value="3"/>Header' +
															'</td>');
															
											aHTML.push('<td class="ns1blankspaceRadio">' +
															'<input type="radio" id="radioDocumentType5" name="radioDocumentType" value="5"/>HTML' +
															'<br /><input type="radio" id="radioDocumentType6" name="radioDocumentType" value="6"/>Text' +
															'</td>');
													
											aHTML.push('<td class="ns1blankspaceText">' +
															'<input type="radio" id="radioPublicY" name="radioPublic" value="Y"/>Public' +
															'<br /><input type="radio" id="radioPublicN" name="radioPublic" value="N"/>Private' +
															'</td></tr>');
										
											aHTML.push('</table>');
											
										aHTML.push('</td></tr>');
										
										ns1blankspace.counter.editor = ns1blankspace.counter.editor + 1;
										
										aHTML.push('<tr class="ns1blankspaceTextMulti">' +
														'<td class="ns1blankspaceTextMulti" style="padding-top:15px;">' +
														'<textarea rows="10" cols="60" name="ns1blankspaceEditText" id="ns1blankspaceEditText' +
														ns1blankspace.counter.editor + '" data-editorcount="' + ns1blankspace.counter.editor + '"' +
														' class="ns1blankspaceTextMultiLarge tinymceAdvanced"></textarea>' +
														'</td></tr>');
										
										aHTML.push('</table>');					
										
										$('#ns1blankspacePagesColumn1').html(aHTML.join(''));

										$('#ns1blankspaceSetupWebsitePageTitle').focus();
										
										var aHTML = [];
										
										aHTML.push('<table class="ns1blankspaceColumn2">');
												
										aHTML.push('<tr><td>' +
														'<span class="ns1blankspaceAction" id="ns1blankspaceWebsitePageSave">Save</span>' +
														'</td></tr>');
									
										aHTML.push('<tr><td>' +
														'<span class="ns1blankspaceAction" id="ns1blankspaceWebsitePageCancel">Cancel</span>' +
														'</td></tr>');
														
										aHTML.push('</table>');					
										
										$('#ns1blankspacePagesColumn2').html(aHTML.join(''));
										
										$('#ns1blankspaceWebsitePageSave').button({
											text: false,
											label: "Save",
											icons:
											{
												 primary: "ui-icon-check"
											}
										})
										.click(function() 
										{
											var sData = 'site=' + ns1blankspace.util.fs(ns1blankspace.objectContext);
											sData += '&documenttitle=' + ns1blankspace.util.fs($('#ns1blankspaceSetupWebsitePageTitle').val());
											sData += '&documenturl=' + ns1blankspace.util.fs($('#ns1blankspaceSetupWebsitePageURL').val());
											sData += '&documenttype=' + ns1blankspace.util.fs($('input[name="radioDocumentType"]:checked').val());
											sData += '&documentpublic=' + ns1blankspace.util.fs($('input[name="radioPublic"]:checked').val());
											sData += '&location=' + ns1blankspace.util.fs($('input[name="radioType"]:checked').val());
											
											if (parseInt($('input[name="radioDocumentType"]:checked').val()) == 5)
											{
												sData += '&documentcontent=' + ns1blankspace.util.fs(tinyMCE.get('ns1blankspaceEditText' + ns1blankspace.counter.editor).getContent());
											}
											else
											{
												sData += '&documentcontent=' + ns1blankspace.util.fs($('#ns1blankspaceEditText' + ns1blankspace.counter.editor).val());
											}
											
											sData += '&id=' + ns1blankspace.util.fs(sID);
											
											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('SETUP_SITE_DOCUMENT_MANAGE'),
												data: sData,
												dataType: 'json',
												success: function() {
													ns1blankspace.setup.website.pages.show();
												}
											});
										});
										
										$('#ns1blankspaceWebsitePageCancel').button(
										{
											text: false,
											label: "Cancel",
											icons:
											{
												 primary: "ui-icon-close"
											}
										})
										.click(function() 
										{
											ns1blankspace.setup.website.pages.show();
										});
										
										$('[name="radioDocumentType"]').click(function()
										{
											if (parseInt($('input[name="radioDocumentType"]:checked').val()) == 5)
											{
												tinyMCE.execCommand('mceAddControl', false, 'ns1blankspaceEditText' + ns1blankspace.counter.editor);
											}
											else
											{
												tinyMCE.execCommand('mceRemoveControl', false, 'ns1blankspaceEditText' + ns1blankspace.counter.editor);
											}
										});
										
										var sCSS = ns1blankspace.objectContextData.cssuri;
										if (sCSS == undefined) {sCSS = ns1blankspace.xhtml.editorCSS}

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
											content_css : sCSS,
											
											external_link_list_url : "/ondemand/core/?method=CORE_EDITOR_LINK_SEARCH", 
											external_image_list_url : "/ondemand/core/?method=CORE_EDITOR_LINK_SEARCH&object=19&objectcontext=" + ns1blankspace.objectContext, 
											media_external_list_url : "/ondemand/core/?method=CORE_EDITOR_LINK_SEARCH&object=19&objectcontext=" + ns1blankspace.objectContext, 

											TemplateLinkType : "0", 
										});
										
										if (sID != undefined)
										{
											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('SETUP_SITE_DOCUMENT_SEARCH'),
												data: 'includecontent=1&id=' + sID,
												dataType: 'json',
												success: function(data) {ns1blankspace.setup.website.pages.edit(oParam, data)}
											});
										}
										else
										{
											$('[name="radioDocumentType"][value="5"]').attr('checked', true);
											$('[name="radioType"][value="9"]').attr('checked', true);
											tinyMCE.execCommand('mceAddControl', false, 'ns1blankspaceEditText' + ns1blankspace.counter.editor);
											$('[name="radioPublic"][value="Y"]').attr('checked', true);	
										}
									}
									else
									{
										if (oResponse.data.rows.length != 0)
										{
											var oObjectContext = oResponse.data.rows[0];
											$('#ns1blankspaceSetupWebsitePageTitle').val(oObjectContext.documenttitle);
											$('#ns1blankspaceSetupWebsitePageURL').val(oObjectContext.documenturl);
											
											$('#ns1blankspaceEditText' + ns1blankspace.counter.editor).val((oObjectContext.documentcontent).formatXHTML());
											
											if (parseInt(oObjectContext.documenttype) == 5)
											{
												tinyMCE.execCommand('mceAddControl', false, 'ns1blankspaceEditText' + ns1blankspace.counter.editor);
											}
											
											$('[name="radioType"][value="' + oObjectContext.location + '"]').attr('checked', true);
											$('[name="radioDocumentType"][value="' + oObjectContext.documenttype + '"]').attr('checked', true);
											$('[name="radioPublic"][value="' + oObjectContext.documentpublic + '"]').attr('checked', true);
										}
										else
										{
											$('[name="radioType"][value="9"]').attr('checked', true);
											$('[name="radioDocumentType"][value="5"]').attr('checked', true);
											tinyMCE.execCommand('mceAddControl', false, 'inputInterfaceMainEditText' + ns1blankspace.counter.editor);
											$('[name="radioPublic"][value="Y"]').attr('checked', true);					
										}
									}		
								},

					remove:		function (oParam, oResponse)
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
										$.ajax(
										{
											type: 'POST',
											url: ns1blankspace.util.endpointURI('SETUP_SITE_DOCUMENT_MANAGE'),
											data: 'remove=1&id=' + sID,
											dataType: 'json',
											success: function(data){ns1blankspace.setup.website.pages.remove(oParam, data)}
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
				},
				
	forms: 		function (oParam, oResponse)
				{
					var iObjectContext = ns1blankspace.objectContext;
					var oOptions = {view: true};
					var oActions = {};
					
					if (oParam != undefined)
					{
						if (oParam.objectContext != undefined) {iObjectContext = oParam.objectContext}
						if (oParam.options != undefined) {oOptions = oParam.options}
						if (oParam.actions != undefined) {oActions = oParam.actions}
					}		
						
					if (oResponse == undefined)
					{
						$.ajax(
						{
							type: 'GET',
							url: ns1blankspace.util.endpointURI('SETUP_SITE_FORM_SEARCH'),
							data: 'site=' + iObjectContext,
							dataType: 'json',
							success: function(data) {ns1blankspace.setup.website.forms(oParam, data)}
						});
					}
					else
					{
						if (oActions != undefined)
						{
							var aHTML = [];
								
							aHTML.push('<table class="ns1blankspaceContainer">' +
											'<tr class="ns1blankspaceContainer">' +
											'<td id="ns1blankspaceFormsColumn1" class="ns1blankspaceColumn1Flexible"></td>' +
											'<td id="ns1blankspaceFormsColumn2" class="ns1blankspaceColumn2" style="width:100px;"></td>' +
											'</tr>' + 
											'</table>');	

							$('#ns1blankspaceMainForms').html(aHTML.join(''));
							
							var aHTML = [];

							aHTML.push('<table class="ns1blankspaceColumn2">');
							
							aHTML.push('<tr><td class="ns1blankspaceAction">' +
												'<span id="ns1blankspaceSetupWebsiteFormsAdd">Add</span>' +
												'</td></tr>');
							
							aHTML.push('</table>');					
							
							$('#ns1blankspaceFormsColumn2').html(aHTML.join(''));
						
							$('#ns1blankspaceSetupWebsiteFormsAdd').button(
							{
								label: "Add"
							})
							.click(function()
							{
								ns1blankspace.setup.websiteForm.init({showHome: false, site: ns1blankspace.objectContext});
								ns1blankspace.setup.websiteForm.new();
							})
						}	
					
						var aHTML = [];
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table><tr><td class="ns1blankspaceNothing">No forms.</td></tr></table>');
	
							$('#ns1blankspaceFormsColumn1').html(aHTML.join(''));
						
						}
						else
						{
							aHTML.push('<table id="ns1blankspaceSetupWebsiteForms" class="ns1blankspace">');
							aHTML.push('<tr class="ns1blankspaceCaption">');
							aHTML.push('<td class="ns1blankspaceHeaderCaption">Form</td>');
							aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>');
							aHTML.push('</tr>');
							
							$.each(oResponse.data.rows, function()
							{	
								aHTML.push('<tr class="ns1blankspaceRow">');
								
								sTitle = this.title;
								if (sTitle == '') {sTitle = this.message}
								if (sTitle == '') {sTitle = this.typetext}
								sTitle = sTitle + ' (' + this.id + ')';
								
								aHTML.push('<td id="ns1blankspaceWebsiteForms_title-' + this.id + '" class="ns1blankspaceRow">' +
														sTitle + '</td>');
														
								aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">');
								aHTML.push('<span id="ns1blankspaceWebsiteForms_options_select-' + this.id + '" class="ns1blankspaceRowSelect"></span>');
								aHTML.push('</td>');

								aHTML.push('</tr>');
							});
							
							aHTML.push('</table>');

							$('#ns1blankspaceFormsColumn1').html(aHTML.join(''));
							
							$('#ns1blankspaceSetupWebsiteForms .ns1blankspaceRowSelect').button( {
								text: false,
								icons: {
									primary: "ui-icon-play"
								}
							})
							.click(function() {
								ns1blankspace.setup.website.forms({showHome: false});
								ns1blankspace.setup.websiteForm.search.send(this.id, {source: 1})
							})
							.css('width', '15px')
							.css('height', '17px');
							
						}
					}	
				},

	urls: 		{
					show:		function (oParam, oResponse)
								{
									var iObjectContext = ns1blankspace.objectContext;
									var oOptions = {view: true, remove: true};
									var oActions = {add: true};
									
									if (oParam != undefined)
									{
										if (oParam.objectContext != undefined) {iObjectContext = oParam.objectContext}
										if (oParam.options != undefined) {oOptions = oParam.options}
										if (oParam.actions != undefined) {oActions = oParam.actions}
									}		
										
									if (oResponse == undefined)
									{	
										$.ajax(
										{
											type: 'GET',
											url: ns1blankspace.util.endpointURI('SETUP_SITE_URL_SEARCH'),
											data: 'site=' + iObjectContext,
											dataType: 'json',
											success: function(data) {ns1blankspace.setup.website.urls.show(oParam, data)}
										});
									}
									else
									{
										if (oActions != undefined)
										{
											var aHTML = [];
												
											aHTML.push('<table class="ns1blankspaceContainer">' +
															'<tr class="ns1blankspaceContainer">' +
															'<td id="ns1blankspaceURLColumn1" class="ns1blankspaceColumn1Flexible"></td>' +
															'<td id="ns1blankspaceURLColumn2" class="ns1blankspaceColumn2" style="width:100px;"></td>' +
															'</tr>' + 
															'</table>');

											$('#ns1blankspaceMainURLs').html(aHTML.join(''));
											
											var aHTML = [];
												
											aHTML.push('<table class="ns1blankspaceColumn2">');
											
											if (oActions.add)
											{
												aHTML.push('<tr><td class="ns1blankspaceAction">' +
															'<span id="ns1blankspaceWebsiteURLAdd">Add</span>' +
															'</td></tr>');
															
												aHTML.push('<tr><td style="padding-top:20px;" id="ns1blankspaceURLAdd" class="ns1blankspaceAction">' +
															'CNAME your own url to site.mydigitalstructure.com' +
															'</td></tr>');			
											}
											
											aHTML.push('</table>');					
											
											$('#ns1blankspaceURLColumn2').html(aHTML.join(''));
										
											$('#ns1blankspaceWebsiteURLAdd').button(
											{
												label: "Add"
											})
											.click(function() {
												 ns1blankspace.setup.website.urls.add(oParam);
											})
										}	
									
										var aHTML = [];

										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table><tr><td class="ns1blankspaceNothing">No urls.</td></tr></table>');
	
											$('#ns1blankspaceURLColumn1').html(aHTML.join(''));
										}
										else
										{
											aHTML.push('<table class="ns1blankspaceSetupWebsiteURLs">');
											aHTML.push('<tr class="ns1blankspaceCaption">');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">URL</td>');
											aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>');
											aHTML.push('</tr>');
		
											$.each(oResponse.data.rows, function()
											{
												aHTML.push('<tr class="ns1blankspaceRow">');
																
												aHTML.push('<td id="ns1blankspaceWebsiteURL_url-' + this.id + '" class="ns1blankspaceRow">' +
																		this.url + '</td>');
																		
												aHTML.push('<td style="width:60px;text-align:right;" class="ns1blankspaceRow">');
													
												if (oOptions.remove)
												{	
													aHTML.push('<span id="ns1blankspaceWebsiteURL_options_remove-' + this.id + '" class="ns1blankspaceRowRemove"></span>');
												};	
													
												if (oOptions.view)
												{	
													aHTML.push('<span id="ns1blankspaceWebsiteURL_options_select-' + this.id + '" class="ns1blankspaceRowSelect"></span>');
												};	
													
												aHTML.push('</td>');
																
												aHTML.push('</tr>');
											});
											
											aHTML.push('</table>');

											$('#ns1blankspaceURLColumn1').html(aHTML.join(''));
											
											if (oOptions.remove) 
											{
												$('#ns1blankspaceSetupWebsiteURLs > span.ns1blankspaceRowRemove').button( {
													text: false,
													icons: {
														primary: "ui-icon-close"
													}
												})
												.click(function() {
													ns1blankspace.setup.website.URLs.remove({xhtmlElementID: this.id});
												})
												.css('width', '15px')
												.css('height', '17px')
											}
											
											if (oOptions.view) 
											{
												$('#ns1blankspaceSetupWebsiteURLs > .ns1blankspaceRowSelect').button( {
													text: false,
													icons: {
														primary: "ui-icon-play"
													}
												})
												.click(function() {
													ns1blankspace.setup.website.URLs.add({xhtmlElementID: this.id})
												})
												.css('width', '15px')
												.css('height', '17px')
											}	
										}
									}
								},

					add:		function (oParam, oResponse)
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
	
										aHTML.push('<table class="ns1blankspace">');
												
										aHTML.push('<tr>' +
														'<td class="ns1blankspaceCaption">' +
														'URL' +
														'</td></tr>' +
														'<tr class="ns1blankspaceText">' +
														'<td class="ns1blankspaceText">' +
														'<input id="ns1blankspaceSetupWebsiteURLURL" class="ns1blankspaceText">' +
														'</td></tr>');
														
										aHTML.push('</table>');					
										
										$('#ns1blankspaceURLColumn1').html(aHTML.join(''));

										$('#ns1blankspaceSetupWebsiteURLURL').focus();
										
										var aHTML = [];

										aHTML.push('<table class="ns1blankspaceColumn2">');
												
										aHTML.push('<tr><td>' +
														'<span class="ns1blankspaceAction" style="width:80px;" id="ns1blankspaceWebsiteURLSave">Save</span>' +
														'</td></tr>');
									
										aHTML.push('<tr><td>' +
														'<span class="ns1blankspaceAction" style="width:80px;" id="ns1blankspaceWebsiteURLCancel">Cancel</span>' +
														'</td></tr>');
														
										aHTML.push('</table>');	
	
										$('#ns1blankspaceURLColumn2').html(aHTML.join(''));
										
										$('#ns1blankspaceWebsiteURLSave').button(
										{
											text: "Save"
										})
										.click(function() 
										{
											var sData = 'site=' + ns1blankspace.objectContext;
											sData += '&url=' + ns1blankspace.util.fs($('#ns1blankspaceSetupWebsiteURLURL').val());
											sData += '&id=' + ns1blankspace.util.fs(sID);
											
											ns1blankspace.status.working();

											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('SETUP_SITE_URL_MANAGE'),
												data: sData,
												dataType: 'json',
												success: function(data) {
													if (data.status == 'OK')
													{	
														ns1blankspace.status.message('URL added.')
														ns1blankspace.show({selector: '#ns1blankspaceMainURLs'});
														ns1blankspace.setup.website.urls.show();

													}
													else
													{
														ns1blankspace.status.error(data.error.errornotes);
													}	
												}
											});
										});
										
										$('#ns1blankspaceWebsiteURLCancel').button(
										{
											text: "Cancel"
										})
										.click(function() 
										{
											ns1blankspace.show({selector: '#ns1blankspaceMainURLs'});
											ns1blankspace.setup.website.urls.show();
										});
										
										if (sID != undefined)
										{
											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('SETUP_SITE_URL_SEARCH'),
												data: 'id=' + sID,
												dataType: 'json',
												success: function(data) {ns1blankspace.setup.website.urls.add(oParam, data)}
											});
										}
									}
									else
									{
										if (oResponse.data.rows.length != 0)
										{
											var oObjectContext = oResponse.data.rows[0];
											$('#ns1blankspaceSetupWebsiteURLURL').val(oObjectContext.url)
										}
									}		
								},

					remove:		function (oParam, oResponse)
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
										$.ajax(
										{
											type: 'POST',
											url: ns1blankspace.util.endpointURI('SETUP_SITE_URL_MANAGE'),
											data: 'remove=1&id=' + sID,
											dataType: 'json',
											success: function(data){ns1blankspace.setup.website.urls.remove(oParam, data)}
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
				},

	new:		function (oParam)
				{
					ns1blankspace.objectContextData = undefined
					ns1blankspace.objectContext = -1;
					ns1blankspace.setup.website.init();
					$('#ns1blankspaceViewControlAction').button({disabled: false});
					ns1blankspace.show({selector: '#divInterfaceMainDetails'});
					ns1blankspace.setup.website.details();
				},				

	save: 		{
					send:		function (oParam, oResponse)
								{
									if (oResponse == undefined)
									{
										var sData = '_=1';
										var sCSSAttachment;
										
										if (ns1blankspace.objectContext != -1)
										{
											sData += '&id=' + ns1blankspace.objectContext	
										}
										else
										{
											sCSSAttachment = -1;
										}
										
										if ($('#ns1blankspaceMainDetails').html() != '')
										{
											sData += '&title=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsTitle').val());
											sData += '&email=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsEmail').val());
											sData += '&status=' + ns1blankspace.util.fs($('input[name="radioStatus"]:checked').val());	
										}

										if ($('#ns1blankspaceMainLayout').html() != '')
										{
											sData += '&headerheight=' + ns1blankspace.util.fs($('#ns1blankspaceLayoutHeaderHeight').val());
											sData += '&footerheight=' + ns1blankspace.util.fs($('#ns1blankspaceLayoutFooterHeight').val());
											sData += '&columns=' + ns1blankspace.util.fs($('#ns1blankspaceLayoutColumns').val());
											sData += '&layout=' + ns1blankspace.util.fs($('input[name="radioLayout"]:checked').val());
											sCSSAttachment = $('input[name="radioCSSAttachment"]:checked').val();
											ns1blankspace.objectContextData.cssattachment = sCSSAttachment;
											ns1blankspace.objectContextData.cssuri = undefined;
										}
										
										if ($('#ns1blankspaceMainAdvanced').html() != '')
										{
											sData += '&ondemandstatus=' + ns1blankspace.util.fs($('input[name="radioAppStatus"]:checked').val());	
											sData += '&usekeywordsastitle=' + ns1blankspace.util.fs($('input[name="radioTitle"]:checked').val());
											sData += '&documenttype=' + ns1blankspace.util.fs($('#ns1blankspaceAdvancedDocumentType').val());
											sData += '&bodytag=' + ns1blankspace.util.fs($('#ns1blankspaceAdvancedBodyTag').val());
										}
										
										if ($('#ns1blankspaceMainScripts').html() != '')
										{
											sData += '&headerscript=' + ns1blankspace.util.fs($('#ns1blankspaceScriptsHeader').val());
											sData += '&footerscript=' + ns1blankspace.util.fs($('#ns1blankspaceScriptsFooter').val());
										}
										
										if (sCSSAttachment != undefined)
										{
											sData += '&cssattachment=' + sCSSAttachment;
										}	
										
										ns1blankspace.status.working();

										$.ajax(
										{
											type: 'POST',
											url: ns1blankspace.util.endpointURI('SETUP_SITE_MANAGE'),
											data: sData,
											dataType: 'json',
											success: function(data) {ns1blankspace.setup.website.save.send(oParam, data)}
										});
									}
									else
									{			
										if (oResponse.status == 'OK')
										{	
											ns1blankspace.status.message('Saved');
											
											if (ns1blankspace.objectContext == -1)
											{
												ns1blankspace.objectContext = oResponse.id;
												ns1blankspace.inputDetected = false;
												ns1blankspace.setup.website.search.send('-' + ns1blankspace.objectContext, {source: 1});
											}	
										}
										else
										{
											ns1blankspace.status.error('Could not save the website!');
										}
									}
								}
				},

	attachments:
				{
					add:	function ()
								{
									var aHTML = [];
									
									aHTML.push('<table class="ns1blankspaceContainer">' +
													'<tr class="ns1blankspaceContainer">' +
													'<td id="ns1blankspaceAddAttachmentColumn1" class="ns1blankspaceColumn1"></td>' +
													'<td id="ns1blankspaceAddAttachmentColumn2" class="ns1blankspaceColumn2"></td>' +
													'</tr>' + 
													'</table>');		
										
									$('#ns1blankspaceAddAttachment').html(aHTML.join(''));

									$('#ns1blankspaceAddAttachmentColumn1').html(ns1blankspace.attachments.upload.show(1, 40));
									
									$('#spanInterfaceMainUpload').button(
										{
											label: "Upload"
										})
										.click(function() {
											 ns1blankspace.attachments.setup.website.attachments.upload();
										})
								},

					updload:	function ()
								{
									var oForm = document.ns1blankspaceFileUpload;
								  	oForm.submit();
								},

					status:		function ()  //???
								{
									var oDivStatus = document.getElementById('divonDemandFileUploadStatus');
									var oFrame = document.getElementById('ifonDemandUpload');
									var sStatus;
									var sCurrentState;
								 
									if (oFrame.readyState) 
									{
										sCurrentState = oFrame.readyState;
									}
									else 
									{
										if (oFrame.contentDocument.body.innerHTML == 'OK') 
										{
											sCurrentState = 'complete';
										}
										else 
										{
											sCurrentState = oFrame.contentDocument.body.innerHTML;
										}
									}
								 
									if (sCurrentState == 'complete') 
									{
										clearInterval(iOnDemandTimer);

										if (oDivStatus != null)
										{
											oDivStatus.setAttribute("class", "");
											oDivStatus.style.display = 'none';
										}
										$.blockUI({ message: "<h2>File Upload Complete..</h2>", timeout: 500 });
									}
								}
				},				

	webapp:		function (oParam, oResponse)
				{
					var sAction; 
					
					if (oParam != undefined)
					{
						if (oParam.action != undefined) {sAction = (oParam.action).toLowerCase()}
					}
					
					if (sAction == undefined)
					{
						var aHTML = [];
						
						aHTML.push('<table class="ns1blankspace">');
								
						aHTML.push('<tr class="ns1blankspace">' +
										'<td class="ns1blankspace">' +
										'<span style="width:250px;font-size:0.875em" id="ns1blankspaceWebappjQuery">1blankspace jQuery</span>' +
										'</td>' +
										'<td style="width:25px;"></td>' +
										'<td class="ns1blankspace">' +
										'<span style="width:250px;font-size:0.875em" id="ns1blankspaceWebappjQueryMobile">1blankspace jQuery Mobile</span>' +
										'</td></tr>');
										
						aHTML.push('<tr class="ns1blankspace">' +
										'<td style="padding-top:15px;font-size:0.875em;color:#404040;">' +
										'Set the header scripts to reference the <a href="http://mydigitalstructure.com/1blankspace" target="_blank">1blankspace namespace</a>.' +
										'</td>' +
										'<td style="width:25px;"></td>' +
										'<td style="padding-top:15px;font-size:0.875em;color:#404040;">' +
										'Set the header scripts to reference the 1blankspace jQuery Mobile framework / design pattern.' +
										'</td></tr>');
										
						aHTML.push('</table>');					
						
						$('#ns1blankspaceMainWebapp').html(aHTML.join(''));
						
						$('#ns1blankspaceWebappjQuery').button(
						{
							text: "1blankspace jQuery"
						})
						.click(function() 
						{
							ns1blankspace.setup.website.webapp({action: 'jquery'});
						});
						
						$('#ns1blankspaceWebappjQueryMobile').button(
						{
							text: "1blankspace jQuery Mobile"
						})
						.click(function() 
						{
							ns1blankspace.setup.website.webapp({action: 'jquerymobile'});
						});
					}
					else
					{
						if (oResponse == undefined)
						{
							$.ajax(
							{
								type: 'POST',
								url: ns1blankspace.util.endpointURI('SETUP_SITE_MANAGE'),
								data: 'id=' + ns1blankspace.objectContext + '&createapp=' + sAction,
								dataType: 'json',
								success: function(data) {ns1blankspace.setup.website.webapp(oParam, data)}
							});
						}
						else
						{
							if (oResponse.status == 'OK')
							{
								$('#ns1blankspaceMainWebapp').html('Webapp created.')
								
								$.ajax(
								{
									type: 'POST',
									url: ns1blankspace.util.endpointURI('SETUP_SITE_SEARCH'),
									data: 'id=' + ns1blankspace.objectContext,
									dataType: 'json',
									success: function(oResponse)
												{
													$('#ns1blankspaceScripts').attr('data-loading', '1');
													ns1blankspace.objectContextData.headerscript = (oResponse.data.rows[0]).headerscript;
												}
								});
								
							}
							else
							{
								$('#ns1blankspaceMainWebapp').html('Somethings gone wrong!')
							}
						}
					}		
				},

	remove: 	function (oParam, oResponse)
				{		
					var sVerifyCode;
					var sUserVerifyCode;
					
					if (oParam != undefined)
					{
						if (oParam.verifyCode != undefined) {sVerifyCode = oParam.verifyCode}
						if (oParam.userVerifyCode != undefined) {sUserVerifyCode = oParam.userVerifyCode}
					}
					
					if (sVerifyCode == undefined && ns1blankspace.objectContext != -1)
					{							
						$.ajax(
						{
							type: 'POST',
							url: ns1blankspace.util.endpointURI('SETUP_SITE_MANAGE'),
							data: 'remove=1&id=' + ns1blankspace.objectContext,
							dataType: 'json',
							success: function(data){ns1blankspace.setup.website.remove({verifyCode: data.verifycode})}
						});
							
					}
					else if (sVerifyCode != undefined && sUserVerifyCode == undefined)
					{
						var aHTML = [];
						
						aHTML.push('<table class="ins1blankspace">');
								
						aHTML.push('<tr><td class="ns1blankspace">' +
										'Enter verification code: ' + sVerifyCode +
										'</td></tr>' +
										'<tr>' +
										'<td class="ns1blankspaceText">' +
										'<input id="ns1blankspaceSetupWebsiteRemoveVerify" class="ns1blankspaceText">' +
										'</td></tr>' +
										'<tr class="ns1blankspaceText">' +
										'<td class="ns1blankspaceText">' +
										'<span id="ns1blankspaceSetupWebsiteRemoveVerifyRemove">Remove</span>' +
										'</td></tr>');
										
						aHTML.push('</table>');					
						
						$(ns1blankspace.xhtml.container).html(aHTML.join(''));
						
						$('#ns1blankspaceSetupWebsiteRemoveVerifyRemove').button(
						{
							text: "Remove"
						})
						.click(function() 
						{
							ns1blankspace.setup.website.remove({verifyCode: sVerifyCode, userVerifyCode: $('#ns1blankspaceSetupWebsiteRemoveVerify').val()})
						});
					
					}
					else if (sVerifyCode != undefined && sUserVerifyCode != undefined && oResponse == undefined)
					{
						$.ajax(
						{
							type: 'POST',
							url: ns1blankspace.util.endpointURI('SETUP_SITE_MANAGE'),
							data: 'id=' + ns1blankspace.objectContext + '&verifycode=' + sUserVerifyCode,
							dataType: 'json',
							success: function(data){ns1blankspace.setup.website.remove(oParam, data)}
						});

					}
					else if (oResponse != undefined)
					{
						if (oResponse.notes == 'REMOVED')
						{
							ns1blankspace.status.message("Website removed");
						}
						else
						{
							ns1blankspace.status.error('Cannot remove website!')
						}
					}	
					else
					{
						ns1blankspace.status.error('Cannot remove website!')
					}	
					
				}

}