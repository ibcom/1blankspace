/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */

$.extend(true, ns1blankspace.setup, 
{
	init: 		function (oParam)
				{
					var bShowHome = false
					
					if (oParam != undefined)
					{
						if (oParam.showHome != undefined) {bShowHome = oParam.showHome}
						if (oParam.method != undefined) {ns1blankspace.setup.method = (oParam.method).toUpperCase()}
						if (oParam.viewName != undefined) {ns1blankspace.setup.name = oParam.viewName}	
					}
					else
					{
						oParam = {}
					}

					ns1blankspace.app.reset();

					ns1blankspace.object = -1;
					ns1blankspace.objectParentName = undefined;
					ns1blankspace.objectName = 'setup';
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.viewName = oParam.viewName;
								
					oParam.showHome = bShowHome;

					ns1blankspace.app.set(oParam);

					$('#ns1blankspaceViewControlNew').unbind('click');
					$('#ns1blankspaceViewControlNew').click(function()
					{
						ns1blankspace.setup.add();
					});
							
					ns1blankspace.setup.home();
				},

	home:		function (oParam, oResponse)
				{
					if (oResponse === undefined)
					{
						var aHTML = [];

						aHTML.push('<table class="ns1blankspace">');
						aHTML.push('<tr><td id="ns1blankspaceSetup">' +
										ns1blankspace.xhtml.loading + 
										'</td></tr></table>');					
						
						$('#ns1blankspaceMain').html(aHTML.join(''));
						
						var aHTML = [];

						aHTML.push('<table>' +
							'<tr><td><div id="ns1blankspaceViewProjectLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>' +
							'</table>');		
						
						$('#ns1blankspaceControl').html(aHTML.join(''));
	
						ns1blankspace.status.message('Click value to edit.');
						
						$.ajax(
						{
							type: 'GET',
							url: ns1blankspace.util.endpointURI(ns1blankspace.setup.method + '_SEARCH'),
							dataType: 'json',
							success: function(data) {
								ns1blankspace.setup.home(oParam, data)
							}
						});
					}
					else
					{
						var aHTML = [];
						
						aHTML.push('<table id="ns1blankspaceSetupContainer">');
		
						aHTML.push('<tr class="ns1blankspaceRow">');
						aHTML.push('<td class="ns1blankspaceHeaderCaption">Title</td>');
						aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right"><span id="ns1blankspaceSetupAdd">Add</span></td>');
						aHTML.push('</tr>');
						
						if (oResponse.data.rows.length === 0)
						{
							aHTML.push('<tr><td class="ns1blankspaceNothing">Nothing to show.</td></tr>');

							$('#ns1blankspaceSetup').html('Nothing to show.');
						}
						else
						{	
							$.each(oResponse.data.rows, function()
							{
								aHTML.push('<tr class="ns1blankspaceRow">');
											
								aHTML.push('<td id="td_ns1blankspaceSetup-' + this.id + 
												'" class="ns1blankspaceRow ns1blankspaceSetup" style="cursor: pointer;">' +
												this.title + '</td>');
								
								aHTML.push('<td class="ns1blankspaceRow" style="width:30px;text-align:right;">' +
												'<span id="ns1blankspaceSetup_options_remove-' + this.id + '" class="ns1blankspaceRowRemove"></span></td>');

							
								aHTML.push('</tr>');
							});
						}

						aHTML.push('</table>');

						$('#ns1blankspaceSetup').html(aHTML.join(''));
							
						$('#ns1blankspaceSetupAdd').button({
								text: false,
								 icons: {
									 primary: "ui-icon-plus"
								}
							})
							.click(function() {
								ns1blankspace.setup.add()
							})
							.css('width', '15px')
							.css('height', '20px')	
							
						$('td.ns1blankspaceSetup').click(function(event)
						{
							ns1blankspace.setup.edit.start(event.target.id);
						});
						
						$('.ns1blankspaceRowRemove').button({
								text: false,
								 icons: {
									 primary: "ui-icon-close"
								}
							})
							.click(function() {
								ns1blankspace.setup.remove(this.id)
							})
							.css('width', '15px')
							.css('height', '20px')
								
						$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
					}	
				},		
		
	add:		function ()
				{
					var aHTML = [];
						
					aHTML.push('<tr class="ns1blankspaceRow">');
										
					aHTML.push('<td id="td_ns1blankspaceSetup-" class="ns1blankspaceRow ns1blankspaceSetup"></td>');
					
					aHTML.push('<td class="ns1blankspaceRow" style="width:30px;text-align:right;">' +
											'<span id="ns1blankspaceSetup_options_remove-" class="ns1blankspaceRowRemove"></span></td>');

					aHTML.push('</tr>');
							
					$('#ns1blankspaceSetupContainer tr:first').after(aHTML.join(''));	
					$('#ns1blankspaceViewControlNew').button({disabled: true});
					$('#ns1blankspaceSetupAdd').button({disabled: true});
					
					ns1blankspace.setup.edit.start('td_ns1blankspaceSetup-');
				},
	
	search: 	{
					send: 		function (sXHTMLElementId, iSource, sSearchText, sSearchContext)
								{	
									var aSearch = sXHTMLElementId.split('-');
									var sElementId = aSearch[0];
									var sSearchContext = aSearch[1];
										
									if (sSearchContext != undefined)
									{
										ns1blankspace.setup.objectContext = aSearch[1];
										var sParam = ns1blankspace.setup.method + '_SEARCH&id=' + ns1blankspace.setup.objectContext;
										
										$.ajax(
										{
											type: 'GET',
											url: sParam,
											dataType: 'json',
											success: ns1blankspace.search.process
										});
									}
									else
									{
										var iMinimumLength = 3;
										var iMaximumColumns = 1;
									
										if (iSource === undefined)
										{
											iSource = ns1blankspace.data.searchSource.text;
										}	
										
										if (sSearchText === undefined)
										{
											sSearchText = $('#ns1blankspaceViewControlSearch').val();
										}	
										
										if (iSource === ns1blankspace.data.searchSource.browse)
										{
											iMinimumLength = 1;
											iMaximumColumns = 4;
											var aSearch = sSearch.split('-');
											sSearchText = aSearch[1];
										}
										
										if (sSearchText.length >= iMinimumLength || iSource === ns1blankspace.data.searchSource.browse)
										{
											ns1blankspace.container.position({xhtmlElementID: sElementId});
																
											$.ajax(
											{
												type: 'GET',
												url: ns1blankspace.util.endpointURI(ns1blankspace.setup.method + '_SEARCH'),
												data: 'title=' + sSearchText,
												dataType: 'json',
												success: interfaceSetupSearchShow
											});
										}
									};	
								},

					process:	function (oResponse)
								{
									var iColumn = 0;
									var	iMaximumColumns = 1;
									var aHTML = [];
														
									if (oResponse.data.rows.length === 0 === 0)
									{
										$(ns1blankspace.xhtml.container).hide();
									}
									else
									{
										aHTML.push('<table border="0" cellspacing="0" cellpadding="0">');
										
										$(oResponse.data.rows).each(function() 
										{	
											iColumn = iColumn + 1;
											
											if (iColumn === 1)
											{
												aHTML.push('<tr class="ns1blankspaceSearch">');
											}
											
											aHTML.push('<td class="ns1blankspaceSearch" id="' +
															'-' + this.id + '">' +
															this.title + '</td>');
											
											if (iColumn === iMaximumColumns)
											{
												aHTML.push('</tr>');
												iColumn = 0;
											}	
										});
								    	
										aHTML.push('</table>');

										$(ns1blankspace.xhtml.container).html(aHTML.join(''));
										$(ns1blankspace.xhtml.container).show(ns1blankspace.option.showSpeedOptions);
										
										$('td.ns1blankspaceSearch').click(function(event)
										{
											$(ns1blankspace.xhtml.container).html('&nbsp;');
											$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions)
											ns1blankspace.setup.search.send(event.target.id, {source: 1});
										});
									}		
								}
				},

	layout:		function ()
				{
					var aHTML = [];

					aHTML.push('<div id="ns1blankspaceMainDetails" class="divInterfaceViewportMain">&nbsp;</div>');
						
					$('#ns1blankspaceMain').html(aHTML.join(''));
						
					$('#tdInterfaceViewportControlDetails').click(function(event)
					{
						ns1blankspace.show({selector: '#divInterfaceMainDetails'});
						ns1blankspace.setup.details();
					})
				},

	remove:		function (sXHTMLElementID)
				{
					var aSearch = sXHTMLElementID.split('-');
					var sElementID = aSearch[0];
					var sSearchContext = aSearch[1];
					
					if (confirm('Are you sure you want to remove it?'))
					{								
						$.ajax(
						{
							type: 'POST',
							url: ns1blankspace.util.endpointURI(ns1blankspace.setup.method + '_MANAGE'),
							data: 'remove=1&id=' + sSearchContext,
							dataType: 'text',
							success: function(data){$('#' + sXHTMLElementID).parent().parent().fadeOut(500)}
						});
					}
				},

	edit: 		{
					start:		function (sElementID)
								{
									var aSearch = sElementID.split('-');
									var sActionElementID = '#' + aSearch[0] + '-options-' + aSearch[2];

									var sHTML = $('#' + sElementID).html();
									
									var sElementInputID = sElementID.replace('td', 'input');
									
									sHTML = '<input style="width:100%;" id="' + sElementInputID + '" class="ns1blankspace" ' +
															'value="' + sHTML + '">'
									
									$('#' + sElementID).html(sHTML);
									$('#' + sElementInputID).focus();
									
									$('#' + sElementInputID).focusout(function(event)
									{
										ns1blankspace.setup.edit.stop(sElementID);
									});
								},

					stop:		function (sElementID)
								{
									ns1blankspace.setup.edit.save(sElementID);
									
									var aSearch = sElementID.split('-');
									var sHTML = $('#' + sElementID.replace('td', 'input')).val();

									$('#' + sElementID).html(sHTML);
								},

					save:		function (sElementID)
								{
									if ($('#' + sElementID.replace('td', 'input')).length === 1)
									{

										var aElement = sElementID.split('-');
										
										if (aElement[1] === '' && $('#' + sElementID.replace('td', 'input')).val() === '')
										{
											$('#ns1blankspaceSetupContainer tr:first').next().fadeOut(500);	
											$('#ns1blankspaceViewControlNew').button({disabled: false});
											$('#ns1blankspaceSetupAdd').button({disabled: false});
										}
										else
										{
											ns1blankspace.status.working();
											
											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI(ns1blankspace.setup.method + '_MANAGE'),
												data: 'id=' + aElement[1] + '&title=' + ns1blankspace.util.fs($('#' + sElementID.replace('td', 'input')).val()),
												dataType: 'json',
												success: function(data) 
														{
															if (data.notes === 'ADDED')
															{
																$('#ns1blankspaceSetup-').attr('id','td_ns1blankspaceSetup-' + data.id);
																
																$('td.ns1blankspaceSetup').unbind('click');
																	
																$('td.ns1blankspaceSetupRow').click(function(event)
																{
																	ns1blankspace.setup.edit.start(event.target.id);
																});

																$('#ns1blankspaceSetup_options_remove-').attr('id','ns1blankspaceSetup_options_remove-' + data.id);
																
																$('.ns1blankspaceRowRemove').button({
																		text: false,
																		 icons: {
																			 primary: "ui-icon-close"
																		}
																	})
																	.click(function() {
																		ns1blankspace.setup.remove(this.id)
																	})
																	.css('width', '15px')
																	.css('height', '20px')
															}
															ns1blankspace.status.message('Saved')
															$('#ns1blankspaceViewControlNew').button({disabled: false});
															$('#ns1blankspaceSetupAdd').button({disabled: false});
														}
											});
										}
									}				
								}
				}
});								