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
					ns1blankspace.viewName = 'File Import & Export';					
					ns1blankspace.app.set(oParam);
				},

	home:		function (oResponse)
				{
					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
					$('#ns1blankspaceViewControlAction').button({disabled: false});
					$('#ns1blankspaceViewControlNew').button({disabled: true});
					
					var aHTML = [];
								
					aHTML.push('<table>');

					aHTML.push('<tr><td><div id="ns1blankspaceViewFinancialLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>');

					aHTML.push('</table>');		
						
					aHTML.push('<table class="ns1blankspaceControl">');
					
					aHTML.push('<tr><td id="ns1blankspaceControlSummary" class="ns1blankspaceControl ns1blankspaceHighlight">' +
									'Quick Import</td></tr>');	
				},

	import: 	{
					show: 		function()
								{
									//choose object
									//holding method
								},

					sample: 	function ()
								{
									//CORE_CREATE_FILE
									//Use returnParameters
								},

					validate: 	function()
								{
									//Check file against returnParameter
								},

					process: 	function()
								{
									//CORE_ATTACHMENT_READ
									//Go through each and do manage
								}
				},

	export: 	{
					show: 		function()
								{
									//choose object
									//holding method
								},

					process: 	function()
								{
									//Like report namespace
								}
				}									
}
