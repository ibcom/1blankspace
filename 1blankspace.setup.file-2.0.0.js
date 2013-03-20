/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */

ns1blankspace.setup.file = 
{
	data: {},

	init: 		function (oParam)
				{
					ns1blankspace.app.reset();
					ns1blankspace.objectParentName = 'setup';
					ns1blankspace.objectName = 'file';
					//ns1blankspace.viewName = 'File Import & Export';
					ns1blankspace.viewName = 'File Import';					
					ns1blankspace.app.set(oParam);
				},

	home:		function ()
				{
					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
					$('#ns1blankspaceViewControlAction').button({disabled: false});
					$('#ns1blankspaceViewControlNew').button({disabled: true});
					
					var aHTML = [];
								
					aHTML.push('<table>');

					aHTML.push('<tr><td><div id="ns1blankspaceViewFileLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>');

					aHTML.push('</table>');		
						
					aHTML.push('<table class="ns1blankspaceControl">');
					
					aHTML.push('<tr><td id="ns1blankspaceControlSummary" class="ns1blankspaceControl ns1blankspaceHighlight">' +
									'Quick Import</td></tr>');
					
					aHTML.push('<tr><td id="ns1blankspaceControlSummary" class="ns1blankspaceControl">' +
									'History</td></tr>');

					aHTML.push('</table>');	

					$('#ns1blankspaceControl').html(aHTML.join(''));

					ns1blankspace.setup.file.import.init();
				},

	import: 	{
					data: 		{},

					init: 		function (oParam)
								{
									//build 2 columns with first holding the types - like unallocated accounts.
									//1st column - choose object (holding method and unique fields)- default people
									//2nd column - generate sample file or upload data file

									var iObject;

									if (oParam != undefined)
									{
										if (oParam.object != undefined) {iObject = oParam.object}
									}	

									if (iObject == undefined)
									{	
										var aHTML = [];
							
										aHTML.push('<table><tr>' +
														'<td id="ns1blankspaceFileImportColumn1" style="width:120px;"></td>' +
														'<td id="ns1blankspaceFileImportColumn2"></td>' +
														'</tr></table>');				
										
										$('#ns1blankspaceMain').html(aHTML.join(''));
											
										var aHTML = [];

										aHTML.push('<div id="ns1blankspaceFileImportObject" style="width:120px; margin-bottom:10px;">');

										aHTML.push('<input type="radio" id="ns1blankspaceFileImport-32" name="radioObject" />' +
														'<label for="ns1blankspaceFileImport-32" style="width: 120px; margin-bottom:3px;">' +
														'People</label>');
										
										aHTML.push('<input type="radio" id="ns1blankspaceFileImport-12" name="radioObject" />' +
														'<label for="ns1blankspaceFileImport-12" style="width: 120px; margin-bottom:1px;">' +
														'Businesses</label>');

										aHTML.push('</div>');

										$('#ns1blankspaceFileImportColumn1').html(aHTML.join(''));
									
										$('#ns1blankspaceFileImportObject').buttonset().css('font-size', '0.75em');
										
										$('#ns1blankspaceFileImportObject :radio').click(function()
										{
											var aID = (event.target.id).split('-');
											var oParam = {object: parseInt(aID[1])};
											ns1blankspace.setup.file.import.init(oParam);
										});
									}
									else
									{
										var aHTML = [];
							
										aHTML.push('<table><tr>' +
														'<td class="ns1blankspaceRow" style="width:15px;"><span id="ns1blankspaceFileImportObjectBack">Back</span></td>' +
														'<td class="ns1blankspaceRow" style="font-size: 1.1em;font-weight: bold;color: #666666; vertical-align:middle;">People</td>' +
														'</tr></table>')

										$('#ns1blankspaceFileImportObject').html(aHTML.join(''));

										$('#ns1blankspaceFileImportObjectBack').button(
										{
											text: false,
											icons:
											{
												primary: "ui-icon-triangle-1-w"
											}
										})
										.click(function() {
											ns1blankspace.setup.file.import.init({object: undefined});
										})
										.css('width', '15px')
										.css('height', '17px');

										ns1blankspace.setup.file.import.show(oParam);
									}	
								},
								
					show: 		function (oParam)
								{
									var iObject = ns1blankspace.object;

									if (oParam != undefined)
									{
										if (oParam.object != undefined) {iObject = oParam.object}
									}		

									var aHTML = [];

									aHTML.push('<table>' +
													'<tr>' +
													'<td id="ns1blankspaceFileImportShowColumn1"></td>' +
													'<td id="ns1blankspaceFileImportShowColumn2" style="width:250px;"></td>' +
													'</tr>' +
													'</table>');				
									
									$('#ns1blankspaceFileImportColumn2').html(aHTML.join(''));

									var aHTML = [];

									aHTML.push('<div id="ns1blankspaceFileImportTask" style="width:120px; text-align:right;">');

									aHTML.push('<input type="radio" id="ns1blankspaceFileTask-1" name="radioType" />' +
													'<label for="ns1blankspaceFileTask-1" style="width: 120px; margin-bottom:3px;">' +
													'Create Template</label>');
									
									aHTML.push('<input type="radio" id="ns1blankspaceFileTask-2" name="radioType" />' +
													'<label for="ns1blankspaceFileTask-2" style="width: 120px; margin-bottom:1px;">' +
													'Upload Data File</label>');

									aHTML.push('</div>');

									//$('#ns1blankspaceFileImportShowColumn1').html(aHTML.join(''));

									$('#ns1blankspaceFileImportObject').after(aHTML.join(''));
								
									$('#ns1blankspaceFileImportTask').buttonset().css('font-size', '0.75em');

									$('#ns1blankspaceFileImportTask :radio').click(function()
									{
										var aID = (event.target.id).split('-');

										if (aID[1] == 1)
										{	
											ns1blankspace.setup.file.import.template.init(oParam);
										}
										else
										{	
											ns1blankspace.setup.file.import.upload(oParam);
										}
									});	
								},

					template: 	{
									init: 		function (oParam, oResponse)
												{
													var iObject = ns1blankspace.object;

													if (oParam != undefined)
													{
														if (oParam.object != undefined) {iObject = oParam.object}
													}		

													if (iObject == 32)
													{ 
														ns1blankspace.setup.file.import.data.method = 'CONTACT_PERSON_SEARCH';
														ns1blankspace.setup.file.import.data.objectName = 'contactperson';
													}

													if (iObject == 12)
													{ 
														ns1blankspace.setup.file.import.data.method = 'CONTACT_BUSINESS_SEARCH';
														ns1blankspace.setup.file.import.data.objectName = 'contactbusiness';
													}

													if (oResponse == undefined)
													{	
														var oSearch = new AdvancedSearch();
														oSearch.method = ns1blankspace.setup.file.import.data.method;
														oSearch.returnParameters = ns1blankspace.setup.file.import.data.objectName;
														oSearch.getResults(function(data) {ns1blankspace.setup.file.import.template.init(oParam, data)});
													}
													else
													{
														var aHTML = [];
														var aParameters = [];
														var sName;
														var sCaption;

														aHTML.push('<table class="ns1blankspaceColumn2">');

														$.each(oResponse.data.parameters, function() 
														{
															if (this.datatype == 'text')
															{	
																aParameters.push(this.name);
															}	
														});	

														aParameters.sort()

														$.each(aParameters, function(i,k) 
														{
															var oParameter = $.grep(oResponse.data.parameters, function (a) { return a.name == k})[0];

															sName = (k).split(".")[1]
															sCaption = sName;  //to be translated to more user friendly names

															aHTML.push('<tr><td style="width:15px;" class="ns1blankspaceRow">' +
																			'<input type="checkbox" id="ns1blankspaceTemplate_include_' + sName + '"' +
																			' data-name="' + this.name + '"' +
																			' class="ns1blankspaceTemplateInclude">' +
																			'</td>');
												
															aHTML.push('<td id="ns1blankspaceTemplate_caption_' + sName + '" class="ns1blankspaceRow">' +
																			sCaption + '</td>');

															aHTML.push('<td style="width:50px; font-size:0.75em;" id="ns1blankspaceTemplate_caption_' + sName + '" class="ns1blankspaceRow ns1blankspaceSub">' +
																			oParameter.datatype + '</td></tr>');
														});		

														aHTML.push('</table>');

														$('#ns1blankspaceFileImportShowColumn1').html(aHTML.join(''));

														var aHTML = [];
													
														aHTML.push('<table class="ns1blankspaceColumn2">');
																
														aHTML.push('<tr><td><span id="ns1blankspaceTemplateCreateFile" class="ns1blankspaceAction">' +
																		'Create File</span></td></tr>');

														aHTML.push('</table>');					
														
														$('#ns1blankspaceFileImportShowColumn2').html(aHTML.join(''));
														
														$('#ns1blankspaceTemplateCreateFile').button(
														{
															text: "Create File"
														})
														.click(function()
														{	
															ns1blankspace.setup.file.import.template.create(oParam)
														});
													}

													//CORE_FILE_MANAGE
													//Use returnParameters + structures linked to object
													
												},

									create: 	function(oParam)
												{
													if ($("input.ns1blankspaceTemplateInclude:checked").length == 0)
													{
														ns1blankspace.status.error('Need to select at least one field.')
													}	
													else
													{
														ns1blankspace.status.working();

														var aParameters = [];

														$("input.ns1blankspaceTemplateInclude:checked").each(function()
														{
															aParameters.push(this);
														});
																	
														var sData = 'filedata=' + aParameters.join(',');
														sData =+ '&filename=import_template.csv';
														
														$.ajax(
														{
															type: 'POST',
															url: ns1blankspace.util.endpointURI('CORE_FILE_MANAGE'),
															data: sData,
															dataType: 'json',
															success: function(data)
															{
																ns1blankspace.status.message('File created');
																window.open(data.link);
															}
														});
													}	
												}
								},						

					upload: 	function ()
								{
									//show upload button - like bank reco import
									//SETUP_IMPORT_MANAGE
								},

					validate: 	function ()
								{
									//Check file against returnParameter
									//CORE_ATTACHMENT_READ - first row
								},

					process: 	function ()
								{
									//CORE_ATTACHMENT_READ
									//Go through each and do search & manage
								}
				},

	export: 	{
					show: 		function ()
								{
									//choose object
									//holding method
								},

					process: 	function ()
								{
									//Similar logic to report namespace
								}
				}									
}
