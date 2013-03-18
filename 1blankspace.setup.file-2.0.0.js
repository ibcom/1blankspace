/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */

ns1blankspace.setup.file = 
{
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

					aHTML.push('</table>');	

					aHTML.push('<table class="ns1blankspaceControl">');
					
					aHTML.push('<tr><td id="ns1blankspaceControlSummary" class="ns1blankspaceControl">' +
									'History</td></tr>');

					aHTML.push('</table>');	

					$('#ns1blankspaceControl').html(aHTML.join(''));

					ns1blankspace.setup.file.import.init();
				},

	import: 	{
					init: 		function ()
								{
									//build 2 columns with first holding the types - like unallocated accounts.
									//1st column - choose object (holding method and unique fields)- default people
									//2nd column - generate sample file or upload data file

									var aHTML = [];
						
									aHTML.push('<table>' +
													'<tr>' +
													'<td id="ns1blankspaceFileImportColumn1" style="width:100px; font-size:0.75em;"></td>' +
													'<td id="ns1blankspaceFileImportColumn2"></td>' +
													'</tr>' +
													'</table>');				
									
									$('#ns1blankspaceMain').html(aHTML.join(''));
										
									var aHTML = [];

									aHTML.push('<div id="ns1blankspaceFileImportObject" style="width:100px; margin-top:3px; text-align:right;">');

									aHTML.push('<input type="radio" id="ns1blankspaceFileImport-32" name="radioType" />' +
													'<label for="ns1blankspaceFileImport-32" style="width: 100px; margin-bottom:1px;">' +
													'People</label>');
									
									aHTML.push('<input type="radio" id="ns1blankspaceFileImport-12" name="radioType" />' +
													'<label for="ns1blankspaceFileImport-12" style="width: 100px; margin-bottom:1px;">' +
													'Businesses</label>');

									aHTML.push('</div>');

									$('#ns1blankspaceFileImportColumn1').html(aHTML.join(''));
								
									$('#ns1blankspaceFileImportObject').buttonset().css('font-size', '0.875em');
									
									$('#ns1blankspaceFileImportObject :radio').click(function()
									{
										var aID = (event.target.id).split('-');
										var oParam = {object: parseInt(aID[1])};
										ns1blankspace.setup.file.import.show(oParam);
									});
								},
								
					show: 		function (oParam)
								{
									var iObject = ns1blankspace.object;

									if (oParam != undefined)
									{
										if (oParam.object != undefined) {iObject = oParam.object}
									}		

									var aHTML = [];

									aHTML.push('<table class="ns1blankspaceColumn2">' +
													'<tr>' +
													'<td id="ns1blankspaceFileImportShowColumn1" style="width:150px; font-size:0.75em;"></td>' +
													'<td id="ns1blankspaceFileImportShowColumn2"></td>' +
													'</tr>' +
													'</table>');				
									
									$('#ns1blankspaceFileImportColumn2').html(aHTML.join(''));

									var aHTML = [];

									aHTML.push('<div id="ns1blankspaceFileImportTask" style="width:150px; text-align:right;">');

									aHTML.push('<input type="radio" id="ns1blankspaceFileTask-1" name="radioType" />' +
													'<label for="ns1blankspaceFileTask-1" style="width: 150px; margin-bottom:1px;">' +
													'Get Sample File</label>');
									
									aHTML.push('<input type="radio" id="ns1blankspaceFileTask-2" name="radioType" />' +
													'<label for="ns1blankspaceFileTask-2" style="width: 150px; margin-bottom:1px;">' +
													'Upload Data File</label>');

									aHTML.push('</div>');

									$('#ns1blankspaceFileImportShowColumn1').html(aHTML.join(''));
								
									$('#ns1blankspaceFileImportTask').buttonset().css('font-size', '0.875em');
								},

					sample: 	function ()
								{
									//CORE_FILE_MANAGE
									//Use returnParameters + structures linked to object
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
