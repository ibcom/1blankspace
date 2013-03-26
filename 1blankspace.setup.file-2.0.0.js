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
					ns1blankspace.object = 29;
					//ns1blankspace.viewName = 'File Import & Export';
					ns1blankspace.viewName = 'File Import';					
					ns1blankspace.app.set(oParam);
				},

	home:		function ()
				{
					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
					$('#ns1blankspaceViewControlAction').button({disabled: true});
					$('#ns1blankspaceViewControlNew').button({disabled: true});
					
					var aHTML = [];
								
					aHTML.push('<table>');

					aHTML.push('<tr><td><div id="ns1blankspaceViewFileLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>');

					aHTML.push('</table>');		
						
					aHTML.push('<table class="ns1blankspaceControl">');
					
					aHTML.push('<tr><td id="ns1blankspaceControlSummary" class="ns1blankspaceControl ns1blankspaceHighlight">' +
									'Quick Import</td></tr>');
					
					//aHTML.push('<tr><td id="ns1blankspaceControlSummary" class="ns1blankspaceControl">' +
					//				'History</td></tr>');

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
													'<td id="ns1blankspaceFileImportShowColumn2" style="width:300px;"></td>' +
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
											ns1blankspace.setup.file.import.upload.init(oParam);
										}
									});	
								},		

					template: 	{
									init: 		function (oParam, oResponse)
												{
													var bInitialised = false;

													if (oParam == undefined) {oParam = {}}

													if (oParam.initialised != undefined) {bInitialised = oParam.initialised}

													if (!bInitialised)
													{	
														$('#ns1blankspaceFileImportShowColumn1').html(
															'<table class="ns1blankspaceColumn2"><tr><td>' +
															ns1blankspace.xhtml.loading + '</td></tr></table>');

														oParam.onComplete = ns1blankspace.setup.file.import.template.init;
														ns1blankspace.setup.file.util.getFields(oParam);
													}
													else
													{	
														var aHTML = [];
														var aParameters = [];
														var sName;
														var sCaption;

														$.each(ns1blankspace.setup.file.data.fields, function() 
														{
															if (this.datatype == 'text')
															{	
																aParameters.push(this.name);
															}	
														});	

														aParameters.sort()

														aHTML.push('<table class="ns1blankspaceColumn2">');

														$.each(aParameters, function(i,k) 
														{
															var oParameter = $.grep(ns1blankspace.setup.file.data.fields, function (a) { return a.name == k})[0];

															sName = (k).split(".")[1]
															sCaption = sName;  //to be translated to more user friendly names

															aHTML.push('<tr><td style="width:15px;" class="ns1blankspaceRow">' +
																			'<input type="checkbox" id="ns1blankspaceTemplate_include_' + sName + '"' +
																			' data-name="' + sName + '"' +
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
													
														aHTML.push('<table class="ns1blankspaceColumn2" style="table-layout:fixed;">');
																
														aHTML.push('<tr><td><span id="ns1blankspaceTemplateCreateFile" class="ns1blankspaceAction">' +
																		'Create file</span></td></tr>');

														aHTML.push('<tr><td><span id="ns1blankspaceTemplateShow" class="ns1blankspaceAction">' +
																		'Show as list</span></td></tr>');

														aHTML.push('<tr><td id="ns1blankspaceTemplateShowList" style="padding-top:10px; font-size:0.75em;" class="ns1blankspaceSub"></td></tr>');

														aHTML.push('</table>');					
														
														$('#ns1blankspaceFileImportShowColumn2').html(aHTML.join(''));
														
														$('#ns1blankspaceTemplateCreateFile').button(
														{
															text: "Create file"
														})
														.click(function()
														{	
															ns1blankspace.setup.file.import.template.create(oParam)
														})
														.css('width', '120px');

														$('#ns1blankspaceTemplateShow').button(
														{
															text: "Show as list"
														})
														.click(function()
														{	
															ns1blankspace.setup.file.import.template.list(oParam)
														})
														.css('width', '120px');
													}												
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
																ns1blankspace.status.message('Template file created');
																window.open(data.link);
															}
														});
													}	
												},

									list: 	 	function(oParam)
												{
													if ($("input.ns1blankspaceTemplateInclude:checked").length == 0)
													{
														ns1blankspace.status.error('Need to select at least one field.')
													}	
													else
													{
														var aParameters = [];

														$("input.ns1blankspaceTemplateInclude:checked").each(function()
														{
															aParameters.push($(this).attr('data-name'));
														});
																	
														$('#ns1blankspaceTemplateShowList').html(aParameters.join(',<br />'));
													}	
												}			
								},						

					upload: 	{
									init:		function (oParam, oResponse)
												{
													var iObjectContext;

													if (oParam == undefined) {oParam = {}}

													if (oParam != undefined)
													{
														if (oParam.objectContext != undefined) {iObjectContext = oParam.objectContext}
													}

													ns1blankspace.setup.file.import.data.object = oParam.object;	
														
													if (oResponse == undefined)
													{	
														var aHTML = [];
														
														aHTML.push('<table class="ns1blankspaceColumn2"><tr><td>');							
														aHTML.push(ns1blankspace.attachments.upload.show(
																		{	
																			object: 29,
																			objectContext: -1,
																			label: ''
																		}));
														
														aHTML.push('</td></tr></table>');

														$('#ns1blankspaceFileImportShowColumn1').html(aHTML.join(''));
														$('#ns1blankspaceFileImportShowColumn2').html('');
														
														$('#ns1blankspaceUpload').html('<div style="padding-left:3px; margin-top:8px; font-size:0.875em;" class="ns1blankspaceSub">' +
																		'500 records maximum per file.' +
																		'</div>');

														$('input.ns1blankspaceUpload').change(function()
														{
															if ($(this).val() != '')
															{
																$('#ns1blankspaceUpload').button(
																{
																	label: "Upload for checking"
																})
																.click(function()
																{
																	if ($('#oFile0').val() == '')
																	{
																		ns1blankspace.status.error("Need to select a file.");
																	}
																	else
																	{
																		$.ajax(
																		{
																			type: 'POST',
																			url: ns1blankspace.util.endpointURI('SETUP_IMPORT_MANAGE'),
																			success: function(data) {
																				ns1blankspace.setup.file.import.upload.init(oParam, data);
																			}
																		});
																	}
																});
															}	
														})
													}
													else
													{
														if (oResponse.status == 'OK')
														{	
															ns1blankspace.objectContext = oResponse.id;
															$('#objectcontext').val(oResponse.id);	
															ns1blankspace.attachments.upload.process({functionPostUpdate: ns1blankspace.setup.file.import.upload.show});
														}	
													}	
												},
								
									show: 		function (oParam, oResponse)
												{
													$('#ns1blankspaceFileImportShowColumn1').html(
														'<table class="ns1blankspaceColumn2"><tr><td>' +
															ns1blankspace.xhtml.loading + '</td></tr></table>');

													var bInitialised = false;

													if (oParam == undefined)
													{
														oParam = {};
														oParam.object = ns1blankspace.setup.file.import.data.object;
													}

													if (oParam.initialised != undefined) {bInitialised = oParam.initialised}

													if (!bInitialised)
													{	
														oParam.onComplete = ns1blankspace.setup.file.import.upload.show;
														ns1blankspace.setup.file.util.getFields(oParam);
													}
													else
													{	
														if (oResponse == undefined)
														{	
															var oSearch = new AdvancedSearch();
															oSearch.method = 'CORE_ATTACHMENT_SEARCH';
															oSearch.addField('type,filename,description,download,modifieddate,attachment');
															oSearch.addFilter('object', 'EQUAL_TO', ns1blankspace.object);
															oSearch.addFilter('objectcontext', 'EQUAL_TO', ns1blankspace.objectContext);		
															oSearch.sort('id', 'desc');
															oSearch.getResults(function(data) {ns1blankspace.setup.file.import.upload.show(oParam, data)});
														}
														else
														{	
															if (oResponse.data.rows.length != 0)
															{	
																ns1blankspace.setup.file.import.data.attachment = oResponse.data.rows[0].id;

																$.ajax(
																{
																	type: 'POST',
																	url: ns1blankspace.util.endpointURI('CORE_ATTACHMENT_READ'),
																	data: 'id=' + ns1blankspace.util.fs(oResponse.data.rows[0].id),
																	success: function(data)
																	{
																		var aHTML = [];

																		aHTML.push('<table class="ns1blankspaceColumn2">' +
																						'<tr class="ns1blankspaceCaption">' +
																						'<td class="ns1blankspaceHeaderCaption">Fields</td>' +
																						'<td class="ns1blankspaceHeaderCaption">Sample Data</td>' +
																						'</tr>');

																		var sClass = '';
																		var bFieldErrors = false;
																		var bTooManyRows = (data.rowlimit == 'Y');

																		ns1blankspace.setup.file.import.data.fields = [];
																		ns1blankspace.setup.file.import.data.keyFields = [];

																		var oRow = data.data.rows[0];

																		for (var key in oRow)
																		{					
																			if (key != 'dataerrors')
																			{														
																				sClass = '';

																				var aKey = $.grep(ns1blankspace.setup.file.data.fields, function (a) {return (a.name).split('.')[1] == key;});

																				if (aKey.length == 0)
																				{
																					sClass = ' ns1blankspaceError';
																					bFieldErrors = true;
																				}
																				else
																				{
																					ns1blankspace.setup.file.import.data.fields.push(key);
																				}	

																				aHTML.push('<tr><td id="ns1blankspaceTemplate_caption_' + key + '" class="ns1blankspaceRow' + sClass + '">' +
																							key + '</td>');

																				aHTML.push('<td style="font-size:0.75em;" class="ns1blankspaceRow ns1blankspaceSub">' +
																								oRow[key] + '</td></tr>');
																			}																			   
																		}

																		aHTML.push('</table>');

																		$('#ns1blankspaceFileImportShowColumn1').html(aHTML.join(''));

																		var aHTML = [];
														
																		aHTML.push('<table class="ns1blankspaceColumn2">');

																		if (bFieldErrors)
																		{
																			aHTML.push('<tr><td style="font-size:0.875em;" class="ns1blankspaceSub">' +
																						'Some of the fields in the file have invalid names.  ' +
																						' You will need to fix this and then re-upload the file.' +
																						'</td></tr>');
																		}
																		else if (bFieldErrors)
																		{
																			aHTML.push('<tr><td style="font-size:0.875em;" class="ns1blankspaceSub">' +
																						'There is a 500 record limit per upload.<br /><br >Please split the file up into 500 record files.' +
																						'</td></tr>');
																		}
																		else
																		{
																			aHTML.push('<tr><td><span id="ns1blankspaceUploadShow" class="ns1blankspaceAction">' +
																						'Check all data</span></td></tr>');

																			aHTML.push('<tr><td style="padding-top:10px; font-size:0.75em;" class="ns1blankspaceSub">' +
																						'This will check all data and report any data errors.<br /><br />' +
																						' You can then proceed to import the data into your space.' +
																						'</td></tr>');
																		}	

																		aHTML.push('</table>');					
																		
																		$('#ns1blankspaceFileImportShowColumn2').html(aHTML.join(''));
																		
																		$('#ns1blankspaceUploadShow').button(
																		{
																			text: "Check all"
																		})
																		.click(function()
																		{	
																			ns1blankspace.setup.file.import.upload.validate(oParam)
																		});
																	}
																});
															}	
														}	
													}
												},

									validate: 	function (oParam, oResponse)
												{
													if (oResponse == undefined)
													{	
														ns1blankspace.status.working();

														ns1blankspace.setup.file.import.data.rows = [];

														$.ajax(
														{
															type: 'POST',
															url: ns1blankspace.util.endpointURI('CORE_ATTACHMENT_READ'),
															data: 'id=' + ns1blankspace.util.fs(ns1blankspace.setup.file.import.data.attachment),
															success: function(data)
															{
																ns1blankspace.setup.file.import.upload.validate(oParam, data);
															}
														});
													}
													else
													{
														ns1blankspace.setup.file.import.data.rows =
																	ns1blankspace.setup.file.import.data.rows.concat(oResponse.data.rows)

														if (oResponse.morerows == 'true')
														{
															var sData =	'id=' + ns1blankspace.util.fs(oResponse.moreid) +
																			'&startrow=' + (parseInt(oResponse.rows) + parseInt(oResponse.startrow)) + 
																			'&rows=' + ns1blankspace.util.fs(oResponse.rows);
															
															$.ajax(
															{
																type: 'GET',
																url: ns1blankspace.util.endpointURI('CORE_SEARCH_MORE'),
																data: sData,
																dataType: 'json',
																success: function(data){ns1blankspace.setup.file.import.upload.validate(oParam, data)}
															});
														}	
														else
														{
															ns1blankspace.status.message(ns1blankspace.setup.file.import.data.rows.length + ' rows');

															var aDataErrors = $.grep(ns1blankspace.setup.file.import.data.rows, function (a) {return a.dataerrors != '';});

															if (aDataErrors.length == 0)
															{
																var aHTML = [];
													
																aHTML.push('<table class="ns1blankspaceColumn2">');
																	
																aHTML.push('<tr><td style="font-size:0.75em;" class="ns1blankspaceSub">' +
																				'There are no data read errors.' +
																				'</td></tr>');

																aHTML.push('<tr><td style="padding-top:10px;""><span id="ns1blankspaceUploadImport" class="ns1blankspaceAction">' +
																				'Import now</span></td></tr>');

																aHTML.push('</table>');		

																$('#ns1blankspaceFileImportShowColumn1').html(aHTML.join(''));			
																$('#ns1blankspaceFileImportShowColumn2').html('');
																
																$('#ns1blankspaceUploadImport').button(
																{
																	text: "Import all data now"
																})
																.click(function()
																{	
																	ns1blankspace.setup.file.import.upload.process(oParam)
																});
															}
															else
															{
																var aHTML = [];
													
																aHTML.push('<table class="ns1blankspaceColumn2">');
																	
																aHTML.push('<tr><td style="font-size:0.75em;" class="ns1blankspaceSub">' +
																				'There are data read errors, which you need to fix before importing.' +
																				'</td></tr>');

																aHTML.push('</table>');					
																
																$('#ns1blankspaceFileImportShowColumn2').html(aHTML.join(''));

																var aHTML = [];

																aHTML.push('<table class="ns1blankspaceColumn2">'+
																				'<tr class="ns1blankspaceCaption">' +
																					'<td class="ns1blankspaceHeaderCaption">Errors</td>' +
																					'</tr>');

																$.each(aDataErrors, function(i,k) 
																{
																	var sKey = '';

																	for (var key in k)
																	{					
																		if (key != 'dataerrors')
																		{											
																			sKey = k[key];
																		}																			   
																	}

																	aHTML.push('<tr><td id="ns1blankspaceImportError_error_' + i + '" class="ns1blankspaceRow">' +
																					k.dataerrors + '</td></tr>');

																	//aHTML.push('<td style="width:75px; font-size:0.75em;" id="nns1blankspaceImportError_notes_' + sName + '" class="ns1blankspaceRow ns1blankspaceSub">' +
																	//				aData.dataerrors + '</td></tr>');
																});		

																aHTML.push('</table>');

																$('#ns1blankspaceFileImportShowColumn1').html(aHTML.join(''));

															}
														}	
													}	
												},

									process: 	function (oParam)
												{
													var iObject;
													var sData;
													var iRow = 0;

													if (oParam != undefined)
													{
														if (oParam.object != undefined) {iObject = oParam.object}
														if (oParam.row != undefined) {iRow = oParam.row}
													}	

													if (iRow == 0)
													{
														ns1blankspace.status.working('Importing...');
														var aHTML = [];
													
														aHTML.push('<table class="ns1blankspaceColumn2">');
															
														aHTML.push('<tr><td id="ns1blankspaceImportStatus" style="font-size:2.75em;" class="ns1blankspaceSub">' +
																		'</td></tr>');

														aHTML.push('</table>');					
														
														$('#ns1blankspaceFileImportShowColumn1').html(aHTML.join(''));

														ns1blankspace.setup.file.import.data.errors = [];
													}

													if (iRow < ns1blankspace.setup.file.import.data.rows.length)
													{	
														var oRow = ns1blankspace.setup.file.import.data.rows[iRow];
														
														var oSearch = new AdvancedSearch();
														oSearch.method = ns1blankspace.setup.file.import.data.method + '_SEARCH';
														oSearch.addFilter(ns1blankspace.setup.file.import.data.fields[0], 'EQUAL_TO', oRow[ns1blankspace.setup.file.import.data.fields[0]])
														oSearch.getResults(function(oResponse)
														{
															var oRow = ns1blankspace.setup.file.import.data.rows[iRow]; 
															
															sData = 'id=';
															if (oResponse.data.rows.length != 0) {sData += oResponse.data.rows[0].id}

															$.each(ns1blankspace.setup.file.import.data.fields, function(j,v)
															{	
																sData += '&' + v + '=' + ns1blankspace.util.fs(oRow[v]);
															});

															$.ajax(
															{
																type: 'POST',
																url: ns1blankspace.util.endpointURI(ns1blankspace.setup.file.import.data.method + '_MANAGE'),
																data: sData,
																dataType: 'json',
																global: false,
																success: 	function(data)
																			{
																				if (data.status == 'ER')
																				{
																					ns1blankspace.setup.file.import.data.errors.push(
																					{
																						data: sData,
																						error: data.error
																					});
																				}	
																				oParam.row = iRow + 1;
																				$('#ns1blankspaceImportStatus').html(iRow);
																				ns1blankspace.setup.file.import.upload.process(oParam, data)
																			}
															});
														});
													}
													else
													{
														ns1blankspace.status.message('Import completed');

														var aHTML = [];
													
														aHTML.push('<table class="ns1blankspaceColumn2">');

														aHTML.push('<tr><td style="font-size:0.875em;" class="ns1blankspaceSub">');

														if (ns1blankspace.setup.file.import.data.errors.length == 0)
														{	
															aHTML.push('No errors during import.');																
														}
														else if (ns1blankspace.setup.file.import.data.errors.length == 0)
														{
															aHTML.push('There was one error during import');
														}
														else
														{
															aHTML.push('There were ' + ns1blankspace.setup.file.import.data.errors.length + ' errors during import.');
														}

														aHTML.push('</td></tr></table>');					
																
														$('#ns1blankspaceFileImportShowColumn1').html(aHTML.join(''));	

														if (ns1blankspace.setup.file.import.data.errors.length > 0)
														{
															var aHTML = [];

															aHTML.push('<table class="ns1blankspaceColumn2">');

															$.each(ns1blankspace.setup.file.import.data.errors, function(i,k) 
															{
																var aData = (this.data).split('&');
																var aDataValues = [];

																$.each(aData, function()
																{
																	var aValue = (this).split('=');
																	if (aValue[0] != '_')
																	{	
																		aDataValues.push(decodeURIComponent(aValue[1]));
																	}	
																});

																aHTML.push('<tr><td id="ns1blankspaceImportDataError_error_' + i + '" class="ns1blankspaceRow">' +
																				aDataValues.join('<br />') + '</td>');

																aHTML.push('<td style="font-size:0.75em;" id="nns1blankspaceImportError_notes_' + i + '" class="ns1blankspaceRow ns1blankspaceSub">' +
																				this.error.errornotes + '</td></tr>');
															});		

															aHTML.push('</table>');

															$('#ns1blankspaceFileImportShowColumn2').html(aHTML.join(''));
														}	
													}	
												}			
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
				},

	util: 		{
					getFields: 	function (oParam, oResponse)
								{	
									var iObject = ns1blankspace.object;
									var fOnComplete;

									if (oParam != undefined)
									{
										if (oParam.object != undefined) {iObject = oParam.object}
										if (oParam.onComplete != undefined) {fOnComplete = oParam.onComplete}
									}		

									if (iObject == 32)
									{ 
										ns1blankspace.setup.file.import.data.method = 'CONTACT_PERSON';
										ns1blankspace.setup.file.import.data.objectName = 'contactperson';
									}

									if (iObject == 12)
									{ 
										ns1blankspace.setup.file.import.data.method = 'CONTACT_BUSINESS';
										ns1blankspace.setup.file.import.data.objectName = 'contactbusiness';
									}

									if (oResponse == undefined)
									{	
										var oSearch = new AdvancedSearch();
										oSearch.method = ns1blankspace.setup.file.import.data.method + '_SEARCH';
										oSearch.returnParameters = ns1blankspace.setup.file.import.data.objectName;
										oSearch.getResults(function(data) {ns1blankspace.setup.file.util.getFields(oParam, data)});
									}
									else
									{
										ns1blankspace.setup.file.data.fields = oResponse.data.parameters;

										oParam.setApp = false;
										ns1blankspace.extend.init(oParam);

										$($.grep(ns1blankspace.extend.structure, function (a) {return a.object == iObject;})).each(function(i,v)
										{
											$(v.elements).each(function(j,k)
											{
												if (k.datatype == 1)
												{	
													var p = {};
													p.name = '.se' + k.id;
													p.datatype = 'text';
													ns1blankspace.setup.file.data.fields.push(p);
												}	
											});
										});

										if (fOnComplete)
										{	
											oParam.initialised = true;
											fOnComplete(oParam)
										}
									}
								}		
				}												
}
