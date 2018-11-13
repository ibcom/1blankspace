/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */

ns1blankspace.setup.file = 
{
	data: {
				importObjects:
				[
					{
						object: 12, 
						objectName: 'contactbusiness',
						objectMethod: 'CONTACT_BUSINESS',
						objectCaption: 'Businesses'
					},
					{
						object: 32, 
						objectName: 'contactperson',
						objectMethod: 'CONTACT_PERSON',
						objectCaption: 'People'
					},
					{
						object: 277, 
						objectName: 'structureelementoption',
						objectMethod: 'SETUP_STRUCTURE_ELEMENT_OPTION',
						objectCaption: 'Structure Element Options'
					}
				]
	},

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

					ns1blankspace.setup.file["import"].init();
				},

	"import": 	{
					data: 		{
									rules:
									[
										{
											object: 32,
											include: false,
											name: 'contactperson.persongroup'
										},
										{
											object: 32,
											include: false,
											name: 'contactperson.persongroupdescription'
										},
										{
											object: 32,
											include: true,
											name: 'contactperson.contactbusinesstext',
											searchName: 'tradename'
										},
										{
											object: 32,
											include: true,
											name: 'contactperson.customerstatustext'
										},
										{
											object: 32,
											include: true,
											name: 'contactperson.gendertext'
										},
										{
											object: 32,
											include: true,
											name: 'contactperson.ratingtext'
										},
										{
											object: 32,
											include: true,
											name: 'contactperson.sourceofcontacttext'
										},
										{
											object: 32,
											include: true,
											name: 'contactperson.supplierstatustext'
										},
										{
											object: 32,
											include: true,
											name: 'contactperson.titletext'
										},
										{
											object: 32,
											include: true,
											child: true,
											parentID: 'contactperson',
											name: '.group',
											datatype: 'numeric',
											inputtype: 'textbox',
											searchendpoint: 'SETUP',
											searchmethod: 'SETUP_CONTACT_PERSON_GROUP_SEARCH',
											method: 'CONTACT_PERSON_GROUP'
										},
										{
											object: 12,
											include: true,
											child: true,
											parentID: 'contactbusiness',
											name: '.group',
											datatype: 'numeric',
											inputtype: 'textbox',
											searchendpoint: 'SETUP',
											searchmethod: 'SETUP_CONTACT_BUSINESS_GROUP_SEARCH',
											method: 'CONTACT_BUSINESS_GROUP'
										}
									]
								},

					init: 		function (oParam)
								{
									var iObject;

									if (oParam != undefined)
									{
										if (oParam.object != undefined) {iObject = oParam.object}
									}	

									if (iObject == undefined)
									{	
										var aHTML = [];
							
										aHTML.push('<table><tr>' +
														'<td id="ns1blankspaceFileImportColumn1" style="width:100px;"></td>' +
														'<td id="ns1blankspaceFileImportColumn2"></td>' +
														'</tr></table>');				
										
										$('#ns1blankspaceMain').html(aHTML.join(''));
											
										var aHTML = [];

										aHTML.push('<div id="ns1blankspaceFileImportObject" style="width:100px; margin-bottom:10px;">');

										$.each(ns1blankspace.setup.file.data.importObjects, function()
										{
											aHTML.push('<input type="radio" id="ns1blankspaceFileImport-' + this.object + '" name="radioObject" />' +
															'<label for="ns1blankspaceFileImport-' + this.object + '" style="width: 100px; margin-bottom:3px;">' +
															this.objectCaption + '</label>');
										
										});

										aHTML.push('</div>');

										$('#ns1blankspaceFileImportColumn1').html(aHTML.join(''));
									
										$('#ns1blankspaceFileImportObject').buttonset().css('font-size', '0.625em');
										
										$('#ns1blankspaceFileImportObject :radio').click(function()
										{
											var aID = (this.id).split('-');
											var oParam = {object: parseInt(aID[1]), objectCaption: $("label[for='" + this.id + "']").children().first().html()};
											ns1blankspace.setup.file["import"].init(oParam);
										});
									}
									else
									{
										var aHTML = [];
							
										aHTML.push('<table><tr>' +
														'<td class="ns1blankspaceRow" style="width:15px;"><span id="ns1blankspaceFileImportObjectBack">Back</span></td>' +
														'<td class="ns1blankspaceRow" style="font-size: 1.1em;font-weight: bold;color: #666666; vertical-align:middle;">' +
														oParam.objectCaption + '</td>' +
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
											ns1blankspace.setup.file["import"].init({object: undefined, objectText: undefined});
										})
										.css('width', '15px')
										.css('height', '17px');

										ns1blankspace.setup.file["import"].show(oParam);
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

									aHTML.push('<div id="ns1blankspaceFileImportTask" style="width:100px; text-align:right;">');

									aHTML.push('<input type="radio" id="ns1blankspaceFileTask-1" name="radioType" />' +
													'<label for="ns1blankspaceFileTask-1" style="width: 100px; margin-bottom:3px;">' +
													'Create Template</label>');
									
									aHTML.push('<input type="radio" id="ns1blankspaceFileTask-2" name="radioType" />' +
													'<label for="ns1blankspaceFileTask-2" style="width: 100px; margin-bottom:1px;">' +
													'Upload Data File</label>');

									aHTML.push('</div>');

									$('#ns1blankspaceFileImportObject').after(aHTML.join(''));

									$('#ns1blankspaceFileImportTask').buttonset().css('font-size', '0.625em');

									$('#ns1blankspaceFileImportTask :radio').click(function()
									{
										var aID = (this.id).split('-');

										if (aID[1] == 1)
										{	
											ns1blankspace.setup.file["import"].template.init(oParam);
										}
										else
										{	
											ns1blankspace.setup.file["import"].upload.init(oParam);
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

														oParam.onComplete = ns1blankspace.setup.file["import"].template.init;
														ns1blankspace.setup.file.util.getFields(oParam);
													}
													else
													{	
														var aHTML = [];
														var aParameters = [];
														var sName;
														var sCaption;

														$.each(ns1blankspace.setup.file.data.fields, function(i, v) 
														{
															var bInclude = (this.inputtype == 'textbox');
															sName = v.name;

															var oRule = $.grep(ns1blankspace.setup.file["import"].data.rules, function (a) {return a.name == sName && a.object == ns1blankspace.setup.file["import"].data.object})[0];

															if (oRule !== undefined)
															{
																if (oRule.include !== undefined) {bInclude = oRule.include}
															}	

															if (bInclude)
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
															if (oParameter.caption) {sCaption = oParameter.caption}

															aHTML.push('<tr id="ns1blankspaceTemplate_container-' + sName + '"><td style="width:15px;" class="ns1blankspaceRow">' +
																			'<input type="checkbox" id="ns1blankspaceTemplate_include_' + sName + '"' +
																			' data-name="' + sName + '"' +
																			' class="ns1blankspaceTemplateInclude">' +
																			'</td>');
												
															aHTML.push('<td id="ns1blankspaceTemplate_caption_' + sName + '" class="ns1blankspaceRow">' +
																			sCaption + '</td>');

															if (oParameter.searchendpoint != 'SETUP' || (oParameter.searchmethod).indexOf('SETUP_USER') != -1)
															{	
																aHTML.push('<td style="width:50px; font-size:0.75em;" id="ns1blankspaceTemplate_caption_' + sName + '" class="ns1blankspaceRow ns1blankspaceSub">' +
																			oParameter.datatype + '</td>');
															}
															else	
															{
																aHTML.push('<td style="width:50px; font-size:0.75em;" id="ns1blankspaceTemplateContainer_caption_' + sName + '" class="ns1blankspaceRow ns1blankspaceSub">' +
																				'<span id="ns1blankspaceTemplate_caption-' + sName + '"' +
																				' data-searchmethod="' + oParameter.searchmethod + '"' +
																				(oParameter.searchmethodfilter?' data-searchmethodfilter="' + oParameter.searchmethodfilter + '"':'') +
																				' class="ns1blankspaceRowOptions"></span></td>');
															}
															
															aHTML.push('</tr>');

														});		

														aHTML.push('</table>');

														$('#ns1blankspaceFileImportShowColumn1').html(aHTML.join(''));

														$('.ns1blankspaceRowOptions').button(
															{
																label: 'Options'
															})
															.click(function() {
																ns1blankspace.setup.file["import"].template.options({xhtmlElementID: this.id});
															})
															.css('font-size', '0.625em')

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
															ns1blankspace.setup.file["import"].template.create(oParam)
														})
														.css('width', '120px');

														$('#ns1blankspaceTemplateShow').button(
														{
															text: "Show as list"
														})
														.click(function()
														{	
															ns1blankspace.setup.file["import"].template.list(oParam)
														})
														.css('width', '120px');
													}												
												},

									options: 	function (oParam, oResponse)
												{
													var sXHTMLElementID;
													var sName;

													if (ns1blankspace.util.param(oParam, 'xhtmlElementID').exists)
													{
														sXHTMLElementID = ns1blankspace.util.param(oParam, 'xhtmlElementID').value
														sName = ns1blankspace.util.param(oParam, 'xhtmlElementID', '-').values[1];
													}

													if ($('#ns1blankspaceTemplate_container_options-' + sName).length != 0)
													{
														$('#ns1blankspaceTemplate_container_options-' + sName).remove();
													}
													else
													{
														if (oResponse == undefined)
														{
															var sMethod = $('#' + sXHTMLElementID).attr('data-searchmethod');
															var sMethodFilter = $('#' + sXHTMLElementID).attr('data-searchmethodfilter');

															if (ns1blankspace.util.isMethodAdvancedSearch(sMethod))
															{	
																var oSearch = new AdvancedSearch();
																oSearch.method = sMethod;
																oSearch.addField('id,title');

																if (sMethodFilter)
																{
																	var aMethodFilters = sMethodFilter.split('|');

																	$.each(aMethodFilters, function(i) 
																	{
																		var aMethodFilter = this.split('-');
																		oSearch.addFilter(aMethodFilter[0], aMethodFilter[1], aMethodFilter[2]);
																	});	
																}	

																oSearch.getResults(function(data) {ns1blankspace.setup.file["import"].template.options(oParam, data)});
															}
															else
															{
																$.ajax(
																{
																	type: 'POST',
																	url: ns1blankspace.util.endpointURI(sMethod),
																	dataType: 'json',
																	success: function(data)
																	{
																		ns1blankspace.setup.file["import"].template.options(oParam, data);
																	}
																});
															}	
														}
														else
														{
															var sHTML = 'No options';

															if (oResponse.data.rows.length > 0)
															{	
																var aHTML = [];

																aHTML.push('<table id="ns1blankspaceSetupFileTemplateOptions" style="font-size:0.75em;">');

																$(oResponse.data.rows).each(function() 
																{
																	aHTML.push('<tr><td style="width:15px; font-weight:bold;" id="ns1blankspaceSetupFileTemplateOptions-' + this.id + '" class="ns1blankspaceRow">' +
																					this.id + '</td>');

																	aHTML.push('<td id="ns1blankspaceSetupFileTemplateOptions_title-' + this.id + '" class="ns1blankspaceRow">' +
																					this.title + '</td></tr>');
																});
																
																aHTML.push('</table>');

																sHTML = aHTML.join('')
															}

															$('#ns1blankspaceTemplate_container-' + sName).after('<tr id="ns1blankspaceTemplate_container_options-' + sName + '">' +
																		'<td colspan=3><div style="background-color: #F3F3F3; padding:8px;" class="ns1blankspaceScale85">' + sHTML + '</div></td></tr>')
														}

													}
												},		

									create: 	function(oParam)
												{
													if ($("input.ns1blankspaceTemplateInclude:checked").length == 0)
													{
														ns1blankspace.status.error('Nothing selected')
													}	
													else
													{
														ns1blankspace.status.working();

														var aParameters = [];

														$("input.ns1blankspaceTemplateInclude:checked").each(function()
														{
															aParameters.push($(this).attr('data-name'));
														});
																	
														var sData = 'filedata=' + aParameters.join(',');
														sData += '&filename=import_template.csv';
														
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
														ns1blankspace.status.error('Nothing selected')
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

													ns1blankspace.setup.file["import"].data.object = oParam.object;	
														
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
																				ns1blankspace.setup.file["import"].upload.init(oParam, data);
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
															ns1blankspace.attachments.upload.process({functionPostUpdate: ns1blankspace.setup.file["import"].upload.show});
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
														oParam.object = ns1blankspace.setup.file["import"].data.object;
													}

													if (oParam.initialised != undefined) {bInitialised = oParam.initialised}

													if (!bInitialised)
													{	
														oParam.onComplete = ns1blankspace.setup.file["import"].upload.show;
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
															oSearch.getResults(function(data) {ns1blankspace.setup.file["import"].upload.show(oParam, data)});
														}
														else
														{	
															if (oResponse.data.rows.length != 0)
															{	
																ns1blankspace.setup.file["import"].data.attachment = oResponse.data.rows[0].id;

																$.ajax(
																{
																	type: 'POST',
																	url: ns1blankspace.util.endpointURI('CORE_ATTACHMENT_READ'),
																	data: 'allcolumnstext=Y&id=' + ns1blankspace.util.fs(oResponse.data.rows[0].id),
																	success: function(data)
																	{
																		var aHTML = [];

																		aHTML.push('<table class="ns1blankspaceColumn2" id="ns1blankspaceUploadFields">' +
																						'<tr class="ns1blankspaceCaption">' +
																						'<td class="ns1blankspaceHeaderCaption" style="width:5px;" colspan="2">Match Using</td>' +
																						'<td class="ns1blankspaceHeaderCaption">Sample</td>' +
																						'</tr>');

																		var sClass = '';
																		var bFieldErrors = false;
																		var bTooManyRows = (data.rowlimit == 'Y');

																		ns1blankspace.setup.file["import"].data.fields = [];
																		ns1blankspace.setup.file["import"].data.keyFields = [];

																		var oRow = data.data.rows[0];

																		for (var key in oRow)
																		{					
																			if (key != 'dataerrors')
																			{														
																				sClass = '';

																				var aKey = $.grep(ns1blankspace.setup.file.data.fields, function (a) {return (a.name).split('.')[1] == key && a.include;});

																				if (aKey.length == 0)
																				{
																					sClass = ' ns1blankspaceError';
																					bFieldErrors = true;
																				}
																				else
																				{
																					ns1blankspace.setup.file["import"].data.fields.push(key);
																				}	

																				aHTML.push('<tr>');

																				aHTML.push('<td class="ns1blankspaceRow">' +
																							'<input type="checkbox" id="ns1blankspaceTemplate_key-' + key + '" /></td>');

																				aHTML.push('<td id="ns1blankspaceTemplate_caption_' + key + '" class="ns1blankspaceRow' + sClass + '">' +
																							key + '</td>');

																				aHTML.push('<td style="font-size:0.75em;" class="ns1blankspaceRow ns1blankspaceSub">' +
																								oRow[key] + '</td></tr>');
																			}																			   
																		}

																		aHTML.push('</table>');

																		$('#ns1blankspaceFileImportShowColumn1').html(aHTML.join(''));

																		$('#ns1blankspaceUploadFields [type="checkbox"] :first').prop('checked', true)

																		var aHTML = [];
														
																		aHTML.push('<table class="ns1blankspaceColumn2">');

																		if (bFieldErrors)
																		{
																			aHTML.push('<tr><td style="font-size:0.875em;" class="ns1blankspaceSub">' +
																						'Some of the fields in the file have invalid names.  ' +
																						' You will need to fix this and then re-upload the file.' +
																						'</td></tr>');
																		}
																		else if (bTooManyRows)
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
																			if ($('#ns1blankspaceUploadFields input:checked').length == 0)
																			{
																				ns1blankspace.status.error("Need at least one key");
																			}
																			else
																			{
																				ns1blankspace.setup.file["import"].data.keys = [];
																				$('#ns1blankspaceUploadFields input:checked').each(function()
																				{
																					ns1blankspace.setup.file["import"].data.keys.push((this.id).split('-')[1]);
																				})
																				 				 
																				ns1blankspace.setup.file["import"].upload.validate(oParam);
																			}	
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

														ns1blankspace.setup.file["import"].data.rows = [];

														$.ajax(
														{
															type: 'POST',
															url: ns1blankspace.util.endpointURI('CORE_ATTACHMENT_READ'),
															data: 'allcolumnstext=Y&id=' + ns1blankspace.util.fs(ns1blankspace.setup.file["import"].data.attachment),
															success: function(data)
															{	
																if (data.rowlimit == 'Y')
																{
																	ns1blankspace.status.error('More than 500 records')
																}
																else
																{	
																	ns1blankspace.setup.file["import"].upload.validate(oParam, data);
																}
															}
														});
													}
													else
													{
														ns1blankspace.setup.file["import"].data.rows =
																	ns1blankspace.setup.file["import"].data.rows.concat(oResponse.data.rows)

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
																success: function(data){ns1blankspace.setup.file["import"].upload.validate(oParam, data)}
															});
														}	
														else
														{
															ns1blankspace.status.message(ns1blankspace.setup.file["import"].data.rows.length + ' rows');

															var aDataErrors = $.grep(ns1blankspace.setup.file["import"].data.rows, function (a) {return a.dataerrors != '';});

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
																	ns1blankspace.setup.file["import"].upload.initProcess(oParam)
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
									
									initProcess:
										 		function ()
												{
													ns1blankspace.setup.file.util.resolveSelects({onComplete: ns1blankspace.setup.file["import"].upload.resolve})
												},	

									resolve: 	function (oParam)
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
														ns1blankspace.status.working('Resolving...');
														var aHTML = [];
													
														aHTML.push('<table class="ns1blankspaceColumn2">');
															
														aHTML.push('<tr><td id="ns1blankspaceImportStatus" style="font-size:2.75em;" class="ns1blankspaceSub">' +
																		'</td></tr>');

														aHTML.push('</table>');					
														
														$('#ns1blankspaceFileImportShowColumn1').html(aHTML.join(''));

														ns1blankspace.setup.file["import"].data.errors = [];
													}

													if (iRow < ns1blankspace.setup.file["import"].data.rows.length)
													{	
														ns1blankspace.setup.file["import"].data.current = [];

														var oRow = ns1blankspace.setup.file["import"].data.rows[iRow];
														
														var oSearch = new AdvancedSearch();
														oSearch.method = ns1blankspace.setup.file["import"].data.method + '_SEARCH';

														$(ns1blankspace.setup.file["import"].data.keys).each(function(i, v)
														{
															oSearch.addField(v);
															oSearch.addFilter(v, 'EQUAL_TO', oRow[v]);
															ns1blankspace.setup.file["import"].data.current.push(v + '=' + oRow[v]);
														});	
														
														oSearch.getResults(function(oResponse)
														{
															var oRow = ns1blankspace.setup.file["import"].data.rows[iRow]; 
															
															ns1blankspace.setup.file["import"].data.rows[iRow].count = oResponse.data.rows.length;

															if (oResponse.data.rows.length <= 1)
															{
																if (oResponse.data.rows.length == 1)
																{
																	ns1blankspace.setup.file["import"].data.rows[iRow].id = oResponse.data.rows[0].id
																}
															}
															else
															{
																ns1blankspace.setup.file["import"].data.rows[iRow].error = true;
																
																ns1blankspace.setup.file["import"].data.errors.push(
																{
																	data: ns1blankspace.setup.file["import"].data.current.join('&'),
																	error: 'More than one record based on keys (' + oResponse.data.rows.length + ')'
																});
															}	

															oParam = ns1blankspace.util.setParam(oParam, 'row', iRow + 1);
															ns1blankspace.setup.file["import"].upload.resolve(oParam);

														});
													}
													else
													{
														ns1blankspace.status.message('Resolve completed');

														ns1blankspace.setup.file["import"].data.nonKeyFields = [];
														ns1blankspace.setup.file["import"].data.importFields = [];

														$(ns1blankspace.setup.file["import"].data.fields).each(function(i,v)
														{
															var oField = $.grep(ns1blankspace.setup.file.data.fields, function (a) {return a.key == v})[0];
																
															ns1blankspace.setup.file["import"].data.importFields.push(
															{
																name: v,
																stage: (oField.child?2:1)
															})

															var iLength = $.grep(ns1blankspace.setup.file["import"].data.keys, function (a) {return a == v}).length

															if (iLength == 0 )
															{
																ns1blankspace.setup.file["import"].data.nonKeyFields.push(
																{
																	name: v,
																	stage: (oField.child?2:1)
																})
															}	
														});

														ns1blankspace.setup.file["import"].upload.process();
													}	
												},						

									process: 	function (oParam)
												{
													var iObject;
													var oData;
													var iRow = 0;
													var iStage = 1

													if (oParam != undefined)
													{
														if (oParam.object != undefined) {iObject = oParam.object}
														if (oParam.row != undefined) {iRow = oParam.row}
														if (oParam.stage != undefined) {iStage = oParam.stage}
													}	

													if (iRow == 0 && iStage == 1)
													{
														ns1blankspace.status.working('Importing...');

														var aHTML = [];
													
														aHTML.push('<table class="ns1blankspaceColumn2">');
															
														aHTML.push('<tr><td id="ns1blankspaceImportStatus" style="font-size:2.75em;" class="ns1blankspaceSub">' +
																		'</td></tr>');

														aHTML.push('</table>');					
														
														$('#ns1blankspaceFileImportShowColumn1').html(aHTML.join(''));

														//ns1blankspace.setup.file["import"].data.errors = [];
													}

													if (iRow < ns1blankspace.setup.file["import"].data.rows.length)
													{	
														$('#ns1blankspaceImportStatus').html(iRow + 1);

														ns1blankspace.setup.file["import"].data.current = [];

														var oRow = ns1blankspace.setup.file["import"].data.rows[iRow];
															
														if (!oRow.error)
														{
															oData = {};

															if (iStage == 1 && oRow.id !== undefined)
															{	
																oData.id = oRow.id;

																$.each(ns1blankspace.setup.file["import"].data.nonKeyFields, function(j,v)
																{	
																	if (v.stage == iStage)
																	{	
																		if (oRow[v.name] !== undefined)
																		{	
																			oData[v.name] = oRow[v.name];
																		}
																	}		
																});
															}
															else if (iStage == 1 && oRow.id === undefined)
															{	
																$.each(ns1blankspace.setup.file["import"].data.importFields, function(j,v)
																{	
																	if (v.stage == iStage)
																	{	
																		if (oRow[v.name] !== undefined)
																		{	
																			oData[v.name] = (oRow[v.name]).formatXHTML();
																		}
																	}		
																});
															}

															else if (iStage == 2 && oRow.id !== undefined)
															{	
																$.each(ns1blankspace.setup.file["import"].data.importFields, function(j,v)
																{	
																	if (v.stage == iStage)
																	{	
																		if (oRow[v.name] !== undefined)
																		{	
																			oData[v.name] = (oRow[v.name]).formatXHTML();

																			var oRule = $.grep(ns1blankspace.setup.file["import"].data.rules, function (a) {return a.key == v.name && a.object == ns1blankspace.setup.file["import"].data.object})[0];

																			if (oRule !== undefined)
																			{
																				if (oRule.parentID !== undefined) {oData[oRule.parentID] = oRow['id'];}
																				ns1blankspace.setup.file["import"].data.method = oRule.method;
																			}

																			if ((oRow[v.name]).substring(0,1) == '-')
																			{
																				oData['remove'] = 1;
																			}	
																		}
																	}		
																});
															}

															if (!ns1blankspace.util.isEmpty(oData))
															{
																$.ajax(
																{
																	type: 'POST',
																	url: ns1blankspace.util.endpointURI(ns1blankspace.setup.file["import"].data.method + '_MANAGE'),
																	data: oData,
																	dataType: 'json',
																	global: false,
																	success: 	function(data)
																				{
																					if (data.status == 'ER')
																					{
																						ns1blankspace.setup.file["import"].data.errors.push(
																						{
																							data: oData,
																							error: data.error.errornotes
																						});
																					}	

																					oRow.id = data.id;
																					oParam = ns1blankspace.util.setParam(oParam, 'row', iRow + 1);
																					
																					ns1blankspace.setup.file["import"].upload.process(oParam)
																				}
																});
															}
															else
															{
																oParam = ns1blankspace.util.setParam(oParam, 'row', iRow + 1);
																$('#ns1blankspaceImportStatus').html(iRow + 1);
																ns1blankspace.setup.file["import"].upload.process(oParam)
															}	
														}
														else
														{
															//ns1blankspace.setup.file["import"].data.errors.push(
															//{
															//	data: ns1blankspace.setup.file["import"].data.current.join('&'),
															//	error: 'More than one record based on keys'
															//});

															oParam = ns1blankspace.util.setParam(oParam, 'row', iRow + 1);
															ns1blankspace.setup.file["import"].upload.process(oParam)
														}	
														
													}
													else
													{
														if ($.grep(ns1blankspace.setup.file["import"].data.nonKeyFields, function (a) {return a.stage == (iStage + 1);}).length > 0)
														{
															ns1blankspace.status.message('Importing Stage ' + (iStage + 1) + '...');
															oParam = ns1blankspace.util.setParam(oParam, 'row', 0);
															oParam = ns1blankspace.util.setParam(oParam, 'stage', (iStage + 1));

															ns1blankspace.setup.file["import"].upload.process(oParam)
														}
														else
														{	
															ns1blankspace.status.message('Import completed');

															var aHTML = [];
														
															aHTML.push('<table class="ns1blankspaceColumn2">');

															aHTML.push('<tr><td style="font-size:0.875em;" class="ns1blankspaceSub">');

															if (ns1blankspace.setup.file["import"].data.errors.length == 0)
															{	
																aHTML.push('No errors during import.');																
															}
															else if (ns1blankspace.setup.file["import"].data.errors.length == 0)
															{
																aHTML.push('There was one error during import');
															}
															else
															{
																aHTML.push('There was ' + ns1blankspace.setup.file["import"].data.errors.length +
																			' error' + (ns1blankspace.setup.file["import"].data.errors.length == 1?'':'s') + ' during import.');
															}

															aHTML.push('</td></tr></table>');					
																	
															$('#ns1blankspaceFileImportShowColumn1').html(aHTML.join(''));	

															if (ns1blankspace.setup.file["import"].data.errors.length > 0)
															{
																var aHTML = [];

																aHTML.push('<table class="ns1blankspaceColumn2">');

																$.each(ns1blankspace.setup.file["import"].data.errors, function(i,k) 
																{
																	var oData = this.data;
																	var aDataValues = [];

																	if (typeof(oData) === 'string')
																	{
																		aDataValues.push(oData);
																	}
																	else
																	{
																		for (var key in oData)
																		{			
																			if (typeof(oData[key]) === 'string')
																			{													
																				aDataValues.push(oData[key]);
																			}	
																		}
																	}	
																	
																	aHTML.push('<tr><td style="font-size:0.75em;" id="ns1blankspaceImportDataError_error_' + i + '" class="ns1blankspaceRow ns1blankspaceSub">' +
																					aDataValues.join('<br />') + '</td>');

																	aHTML.push('<td style="font-size:0.75em;" id="ns1blankspaceImportError_notes_' + i + '" class="ns1blankspaceRow ns1blankspaceSub">' +
																					this.error + '</td></tr>');
																});		

																aHTML.push('</table>');

																$('#ns1blankspaceFileImportShowColumn2').html(aHTML.join(''));
															}
														}	
													}	
												}			
								}			
				},

	"export": 	{
					show: 		function ()
								{
									//choose object
									//holding method
								},

					process: 	function (oParam)
								{
									var sFormatName = ns1blankspace.util.getParam(oParam, 'name').value;
									var oSummary = ns1blankspace.util.getParam(oParam, 'summary', {"default": {}}).value;
									var oItems = ns1blankspace.util.getParam(oParam, 'items', {"default": {}}).value;
									var bSaveToFile = ns1blankspace.util.getParam(oParam, 'saveToFile', {"default": false}).value;

									if (sFormatName !== undefined)
									{
										var oFormat = $.grep(ns1blankspace.setup.file["export"].formats, function (a) {return a.name == sFormatName});
									}

									var aFile = [];

									if (oFormat.length > 0)
									{
										oFormat = oFormat[0];

										$.each(oFormat.header, function(i, k)
										{
											$.each(k.fields, function (j, v)
											{
												if (v.value !== undefined)
												{
													v.text = v.value;
													aFile.push(ns1blankspace.util.format(v));
												}	
												else if (v.field !== undefined)
												{
													if (oSummary[v.field] !== undefined)
													{
														v.text = oSummary[v.field];
														aFile.push(ns1blankspace.util.format(v));
													}	
												}
												else if (v.param !== undefined)
												{
													v.text = ns1blankspace.util.getParam(oParam, v.param).value;
													aFile.push(ns1blankspace.util.format(v));
												}
												else
												{
													aFile.push(ns1blankspace.util.format(v));
												}	

											});

											aFile.push('\r\n');
										});

										var aFileLine;

										if (oFormat.item !== undefined)
										{
											$.each(oItems, function (i, oItem)
											{
												$.each(oFormat.item[0].fields, function (j, v)
												{
													delete v.text;
													aFileLine = [];

													if (v.value !== undefined)
													{
														v.text = v.value;
														aFileLine.push(ns1blankspace.util.format(v));
													}	
													else if (v.field !== undefined)
													{
														if (oItem[v.field] !== undefined)
														{
															v.text = oItem[v.field];
															aFileLine.push(ns1blankspace.util.format(v));
														}	
													}
													else if (v.param !== undefined)
													{
														v.text = ns1blankspace.util.getParam(oParam, v.param).value;
														aFileLine.push(ns1blankspace.util.format(v));
													}
													else if (v.calculate !== undefined)
													{
														v.text = v.calculate(oItem, oParam);
														aFileLine.push(ns1blankspace.util.format(v));
													}
													else
													{
														aFileLine.push(ns1blankspace.util.format(v));
													}	
												});
		
												aFile.push(aFileLine.join('') + '\r\n');
											});		
										}

										$.each(oFormat.footer, function(i, k)
										{
											$.each(k.fields, function (j, v)
											{
												if (v.value !== undefined)
												{
													aFile.push(v.value);
												}	
												else if (v.field !== undefined)
												{
													if (oSummary[v.field] !== undefined)
													{
														v.value = oSummary[v.field];
														aFile.push(ns1blankspace.util.format(v));
													}	
												}
												else if (v.param !== undefined)
												{
													v.value = ns1blankspace.util.getParam(oParam, v.param).value;
													aFile.push(ns1blankspace.util.format(v));
												}
												else
												{
													aFile.push(ns1blankspace.util.format(v));
												}	

											});

											if (i != oFormat.footer.length - 1)
											{	
												aFile.push('\r\n');
											}	
										});

									}

									if (bSaveToFile)
									{
										oParam.data = aFile.join('');
										ns1blankspace.setup.file["export"].saveToFile(oParam);
									}

									return aFile.join('');
								},

					saveToFile: function(oParam)
								{
									var sData = ns1blankspace.util.getParam(oParam, 'data').value;
									var sFileName = ns1blankspace.util.getParam(oParam, 'fileName', {"default": 'export.csv'}).value;
									var bOpen = ns1blankspace.util.getParam(oParam, 'open', {"default": false}).value;
									var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;

									var oData =
									{
										filedata: sData,
										filename: sFileName
									}

									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('CORE_FILE_MANAGE'),
										data: oData,
										dataType: 'json',
										success: function(data)
										{
											ns1blankspace.status.message('File created');
											
											if (bOpen)
											{
												window.open(data.link);
											}

											if (sXHTMLElementID !== undefined)
											{
												$('#' + sXHTMLElementID).html('<a target="_blank" href="' + data.link + '"">Download</a>')
											}	
										}
									});	
								} 			
				},

	util: 		{
					getFields: 	function (oParam, oResponse)
								{	
									var iObject = ns1blankspace.object;
									var oObject;

									if (oParam != undefined)
									{
										if (oParam.object != undefined) {iObject = oParam.object}
									}		

									if (iObject != '')
									{
										oObject = $.grep(ns1blankspace.setup.file.data.importObjects, function(x) {return x.object == iObject}).shift();
									}

									ns1blankspace.setup.file["import"].data.object = iObject;
									ns1blankspace.setup.file["import"].data.method = oObject.objectMethod;
									ns1blankspace.setup.file["import"].data.objectName = oObject.objectName;

									if (oResponse == undefined)
									{	
										var oSearch = new AdvancedSearch();
										oSearch.method = ns1blankspace.setup.file["import"].data.method + '_SEARCH';
										oSearch.returnParameters = ns1blankspace.setup.file["import"].data.objectName;
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
												var p = {};

												p.name = '.se' + k.id;
												p.caption = 'se' + k.id + ' (' + k.title + ')';
												p.inputtype = 'textbox';

												if (k.datatype == 1 || k.datatype == 4)
												{	
													p.datatype = 'text';
												}	

												if (k.datatype == 3)
												{
													p.datatype = 'date';			
												}

												if (k.datatype == 2)
												{
													p.datatype = 'select';
													p.searchendpoint = 'SETUP';
													p.searchmethod = 'SETUP_STRUCTURE_ELEMENT_OPTION_SEARCH';
													p.searchmethodfilter = 'element-EQUAL_TO-' + k.id;
												}

												ns1blankspace.setup.file.data.fields.push(p);
											});
										});

										ns1blankspace.setup.file.data.fields = 
										ns1blankspace.setup.file.data.fields.concat($.grep(ns1blankspace.setup.file["import"].data.rules, function (a) {return a.child && a.object == ns1blankspace.setup.file["import"].data.object}));

										$.each(ns1blankspace.setup.file.data.fields, function(i, v) 
										{
											var bInclude = (this.inputtype == 'textbox');
											sName = v.name;

											var oRule = $.grep(ns1blankspace.setup.file["import"].data.rules, function (a) {return a.name == sName && a.object == ns1blankspace.setup.file["import"].data.object})[0];

											if (oRule !== undefined)
											{
												v.rule = oRule;
												if (oRule.include !== undefined) {bInclude = oRule.include}
											}	

											if (bInclude)
											{	
												v.include = bInclude;
											}

											v.key = (v.name).split('.')[1];
										});	

										oParam.initialised = true;
										ns1blankspace.util.onComplete(oParam);
									}	
								},

					resolveSelects: 
								function (oParam)
								{
									var iResolveFieldsIndex = ns1blankspace.util.getParam(oParam, 'resolveFieldsIndex', {"default": 0}).value;

									if (iResolveFieldsIndex == 0)
									{
										ns1blankspace.setup.file.data.resolveFields = $.grep(ns1blankspace.setup.file.data.fields, function (a) {return a.inputtype == 'select' && a.include});
										ns1blankspace.status.working('Preparing import')
									}	

									if (iResolveFieldsIndex < ns1blankspace.setup.file.data.resolveFields.length)
									{
										var oResolveField = ns1blankspace.setup.file.data.resolveFields[iResolveFieldsIndex];
										var sName = (oResolveField.name).split(".")[1];
										var sIDName = (oResolveField.searchrelatedfield).split(".")[1];
										var sResolveName = (oResolveField.rule.searchName !== undefined?oResolveField.rule.searchName:'title');
										var aResolveText = [];

										$(ns1blankspace.setup.file["import"].data.fields).each(function(i,v)
										{
											if (v == sName) {ns1blankspace.setup.file["import"].data.fields.splice(i,1,sIDName)}
										});

										$($.grep(ns1blankspace.setup.file["import"].data.rows, function (a) {return a[sName] != '' && a[sName] != undefined})).each(function (i, k)
										{
											aResolveText.push((k[sName]).formatXHTML());
										});

										if (aResolveText.length > 0)
										{
											if (ns1blankspace.util.isMethodAdvancedSearch(oResolveField.searchmethod))
											{
												var oSearch = new AdvancedSearch();
												oSearch.method = oResolveField.searchmethod;
												oSearch.addField(sResolveName);
												oSearch.addFilter(sResolveName, 'IN_LIST', aResolveText.join(','));
												oSearch.rows = aResolveText.length,
												oSearch.getResults(function(oResponse)
												{	
													if (oResponse.status == 'OK')
													{
														if (oResponse.data.rows.length > 0)
														{
															$($.grep(ns1blankspace.setup.file["import"].data.rows, function (a) {return a[sName] != ''})).each(function (i, k)
															{
																var oRow = $.grep(oResponse.data.rows, function (a) {return a[sResolveName] == k[sName]})[0];

																if (oRow !== undefined)
																{	
																	k[sIDName] = oRow['id'];
																}
															});
														}
													}	
													
													oParam = ns1blankspace.util.setParam(oParam, 'resolveFieldsIndex', iResolveFieldsIndex + 1);
													ns1blankspace.setup.file.util.resolveSelects(oParam);	
												});
											}
											else
											{
												$.ajax(
												{
													type: 'POST',
													url: ns1blankspace.util.endpointURI(oResolveField.searchmethod),
													dataType: 'json',
													success: function(oResponse)
													{
														if (oResponse.status == 'OK')
														{
															if (oResponse.data.rows.length > 0)
															{
																$($.grep(ns1blankspace.setup.file["import"].data.rows, function (a) {return a[sName] != ''})).each(function (i, k)
																{
																	var oRow = $.grep(oResponse.data.rows, function (a) {return a[sResolveName] == k[sName]})[0];

																	if (oRow !== undefined)
																	{	
																		k[sIDName] = oRow['id'];
																	}
																});
															}
														}	
														
														oParam = ns1blankspace.util.setParam(oParam, 'resolveFieldsIndex', iResolveFieldsIndex + 1);
														ns1blankspace.setup.file.util.resolveSelects(oParam);
													}
												});
											}	
										}	
										else
										{
											oParam = ns1blankspace.util.setParam(oParam, 'resolveFieldsIndex', iResolveFieldsIndex + 1);
											ns1blankspace.setup.file.util.resolveSelects(oParam);
										}

									}
									else
									{
										ns1blankspace.util.onComplete(oParam);
									}
								}
				}

}

ns1blankspace.setup.file["export"].formats =
[
	{
		name: 'Payment Summary - AU',
		header:
		[
			{
				line: 1,
				fields:
				[
					{
						value: '628',
					},
					{
						value: 'IDENTREGISTER1',
					},
					{
						param: 'abn',
						length: 11,
						fill: ' '
					},
					{
						param: 'fileMode',
						length: 1,
						"default": 'T'
					},
					{
						param: 'endDate',
						length: 8,
						"default": Date.today(),
						dateFormat: 'ddMMyyyy'
					},
					{
						value: 'EAPFEMPA008.0',
					},
					{
						fill: ' ',
						length: (628 - 51 + 1)
					}
				]
			},
			{
				line: 2,
				fields:
				[
					{
						value: '628',
					},
					{
						value: 'IDENTREGISTER2',
					},
					{
						param: 'contactBusinessText',
						length: (217 - 18 + 1),
						fill: ' ',
						upper: true
					},
					{
						param: 'contactPersonText',
						length: (255 - 218 + 1),
						fill: ' '
					},
					{
						param: 'phone',
						length: (270 - 256 + 1),
						fill: ' '
					},
					{
						param: 'fax',
						length: (285 - 271 + 1),
						fill: ' '
					},
					{
						value: '1',
						length: (301 - 286 + 1),
						fill: '0'
					},
					{
						length: (628 - 302 + 1),
						fill: ' '
					}
				]	
			},
			{
				line: 3,
				fields:
				[
					{
						value: '628',
					},
					{
						value: 'IDENTREGISTER3',
					},
					{
						param: 'streetAddress1',
						length: (55 - 18 + 1),
						fill: ' ',
						upper: true
					},
					{
						param: 'streetAddress2',
						length: (93 - 56 + 1),
						fill: ' ',
						upper: true
					},
					{
						param: 'streetSuburb',
						length: (120 - 94 + 1),
						fill: ' ',
						upper: true
					},
					{
						param: 'streetState',
						length: (127 - 124 + 1),
						fill: ' ',
						upper: true
					},
					{
						param: 'streetPostCode',
						length: (55 - 18 + 1),
						fill: ' ',
						upper: true
					},
					{
						length: (147 - 128 + 1),
						fill: ' '
					},
					{
						param: 'mailingAddress1',
						length: (185 - 148 + 1),
						fill: ' ',
						upper: true
					},
					{
						param: 'mailingAddress2',
						length: (223 - 186 + 1),
						fill: ' ',
						upper: true
					},
					{
						param: 'mailingSuburb',
						length: (250 - 224 + 1),
						fill: ' ',
						upper: true
					},
					{
						param: 'mailingState',
						length: (253 - 251 + 1),
						fill: ' ',
						upper: true
					},
					{
						param: 'mailingPostCode',
						length: (257 - 254 + 1),
						fill: ' ',
						upper: true
					},
					{
						length: (277 - 258 + 1),
						fill: ' '
					},
					{
						param: 'email',
						length: (353 - 278 + 1),
						fill: ' '
					},
					{
						length: (628 - 354 + 1),
						fill: ' '
					}
				]
			},
			{
				line: 4,
				fields:
				[
					{
						value: '628',
					},
					{
						value: 'IDENTITY',
					},
					{
						param: 'abn',
						length: 11,
						fill: ' '
					},
					{
						value: '001',
					},
					{
						param: 'year',
						length: 4,
						dateFormat: 'yyyy'
					},
					{
						param: 'legalName',
						length: (229 - 30 + 1),
						fill: ' ',
						upper: true
					},
					{
						param: 'tradeName',
						length: (429 - 230 + 1),
						fill: ' ',
						upper: true
					},
					{
						param: 'streetAddress1',
						length: (467 - 430 + 1),
						fill: ' ',
						upper: true
					},
					{
						length: (505 - 468 + 1),
						fill: ' '
					},
					{
						param: 'streetSuburb',
						length: (532 - 506 + 1),
						fill: ' ',
						upper: true
					},
					{
						param: 'streetState',
						length: (535 - 533 + 1),
						fill: ' ',
						upper: true
					},
					{
						param: 'streetPostCode',
						length: (539 - 536 + 1),
						fill: ' ',
						upper: true
					},
					{
						length: (559 - 540 + 1),
						fill: ' '
					},
					{
						param: 'contactName',
						length: (597 - 560 + 1),
						fill: ' '
					},
					{
						param: 'phone',
						length: (612 - 598 + 1),
						fill: ' '
					},
					{
						param: 'fax',
						length: (627 - 613 + 1),
						fill: ' '
					},
					{
						length: (628 - 628 + 1),
						fill: ' '
					}
				]
			},
			{
				line: 5,
				fields:
				[
					{
						value: '628',
					},
					{
						value: 'SOFTWARE',
					},
					{
						value: 'IBCOM MYDIGITALSTUCTURE',
						length: (91 - 12 + 1),
						fill: ' '
					},
					{
						value: 'N',
					},
					{
						length: (628 - 93 + 1),
						fill: ' '
					}
				]
			}			
		],
		item:
		[
			{
				fields:
				[
					{
						value: '628',
					},
					{
						value: 'DINB',
					},
					{
						value: 'S',
					},
					{
						field: 'employee.taxfilenumber',
						length: (17 - 9 + 1),
						fill: ' ',
						remove: ' '
					},
					{
						field: 'employee.contactperson.dateofbirth',
						length: 8,
						dateFormat: 'ddMMyyyy'
					},
					{
						field: 'employee.contactperson.surname',
						length: (55 - 26 + 1),
						fill: ' ',
						upper: true
					},
					{
						field: 'employee.contactperson.firstname',
						length: (70 - 56 + 1),
						fill: ' ',
						upper: true
					},
					{
						fill: ' ',
						length: (85 - 71 + 1)
					},
					{
						field: 'employee.contactperson.streetaddress1',
						length: (123 - 86 + 1),
						fill: ' ',
						upper: true
					},
					{
						field: 'employee.contactperson.streetaddress2',
						length: (161 - 124 + 1),
						fill: ' ',
						upper: true
					},
					{
						field: 'employee.contactperson.streetsuburb',
						length: (188 - 162 + 1),
						fill: ' ',
						upper: true
					},
					{
						field: 'employee.contactperson.streetstate',
						length: (191 - 189 + 1),
						fill: ' ',
						upper: true
					},
					{
						field: 'employee.contactperson.streetpostcode',
						length: (195 - 192 + 1),
						fill: ' ',
						upper: true
					},
					{
						fill: ' ',
						length: (215 - 196 + 1)
					},
					{
						calculate: function (v, p)
						{
							if (v['employee.employmentstartdate'] > p['startDate']) {return v['employee.employmentstartdate']} else {return p['startDate']}
						},
						length: 8,
						dateFormat: 'ddMMyyyy'
					},
					{
						calculate: function (v, p)
						{
							if (v['employee.employmentenddate'] < p['endDate']) {return v['employee.employmentenddate']} else {return p['endDate']}
						},
						length: 8,
						dateFormat: 'ddMMyyyy'
					},
					{
						field: 'taxbeforerebate',
						length: 8,
						fillLeft: '0',
						amountDecimalPlaces: 0
					},
					{
						field: 'grosssalary',
						length: 8,
						fillLeft: '0',
						amountDecimalPlaces: 0
					},
					{
						field: 'allowances',
						length: 8,
						fillLeft: '0',
						amountDecimalPlaces: 0
					},
					{
						value: '0',
						length: (263 - 256 + 1),
						fillLeft: '0'
					},
					{
						value: '0',
						length: (271 - 264 + 1),
						fillLeft: '0'
					},
					{
						value: '0',
						length: (279 - 272 + 1),
						fillLeft: '0'
					},
					{
						value: '0',
						length: (287 - 280 + 1),
						fillLeft: '0'
					},
					{
						value: '0',
						length: (295 - 288 + 1),
						fillLeft: '0'
					},
					{
						value: '0',
						length: (303 - 296 + 1),
						fillLeft: '0'
					},
					{
						value: '0',
						length: (311 - 304 + 1),
						fillLeft: '0'
					},
					{
						value: 'O',
					},
					{
						value: '0',
						length: (320 - 313 + 1),
						fillLeft: '0'
					},
					{
						calculate: function (v)
						{
							if (v.allowances > 0) {return 'R'} else {return ' '}
						}
					},
					{
						value: '0',
						length: (329 - 322 + 1),
						fillLeft: '0'
					},
					{
						value: '0',
						length: (337 - 330 + 1),
						fillLeft: '0'
					},
					{
						value: '0',
						length: (345 - 338 + 1),
						fillLeft: '0'
					},
					{
						value: '0',
						length: (353 - 346 + 1),
						fillLeft: '0'
					},
					{
						fill: ' ',
						length: (628 - 354 + 1)
					}
				]
			}
		],

		footer:
		[
			{
				line: 1,
				fields:
				[
					{
						value: '628',
					},
					{
						value: 'FILE-TOTAL',
					},
					{
						param: 'totalRows',
						length: (21 - 14 + 1),
						fillLeft: '0'
					},
					{
						fill: ' ',
						length: (628 - 22 + 1)
					}
				]
			}
		]
	}
]


