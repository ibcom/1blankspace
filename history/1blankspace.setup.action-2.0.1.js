/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 */

// ns1blankspace.setup.home({viewName: 'Action Types', method: 'SETUP_ACTION_TYPE', search: {fields: 'title', sort: [{name: 'title'}], filters: [{name: 'fixed', comparison: 'EQUAL_TO', value1: 'N'}]}});	

ns1blankspace.setup.action = 
{
	init: 	function (oParam)
				{
					var bShowHome = true
					var bInitialised = false;

					if (oParam != undefined)
					{
						if (oParam.showHome != undefined) {bShowHome = oParam.showHome}
						if (oParam.initialised != undefined) {bInitialised = oParam.initialised}
					}

					ns1blankspace.app.reset();

					ns1blankspace.objectParentName = 'setup';
					ns1blankspace.objectName = 'action';
					ns1blankspace.viewName = 'Actions';
					
					ns1blankspace.app.set(oParam);
				},

	home:		function (oParam, oResponse)
				{
					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
					$('#ns1blankspaceViewControlAction').button({disabled: false});
					$('#ns1blankspaceViewControlNew').button({disabled: true});
					
					var aHTML = [];
								
					aHTML.push('<table>');

					aHTML.push('<tr><td><div id="ns1blankspaceViewFinancialLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>');

					aHTML.push('</table>');		
						
					aHTML.push('<table class="ns1blankspaceControl" style="padding-top:10px;">');
					
					aHTML.push('<tr><td id="ns1blankspaceControlActionTemplate" class="ns1blankspaceControl  ns1blankspaceHighlight">' +
									'Templates</td></tr>');

					aHTML.push('<tr><td id="ns1blankspaceControlTypes" class="ns1blankspaceControl">' +
									'Types</td></tr>');

					aHTML.push('</table>');		

					$('#ns1blankspaceControl').html(aHTML.join(''));	
					
					var aHTML = [];
					
					aHTML.push('<div id="ns1blankspaceMainTypes" class="ns1blankspaceControlMain"></div>');
					aHTML.push('<div id="ns1blankspaceMainTemplate_action" class="ns1blankspaceControlMain"></div>');
					
					$('#ns1blankspaceMain').html(aHTML.join(''));
					
					$('#ns1blankspaceControlTypes').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainTypes'});
						ns1blankspace.setup.init({viewName: 'Action Types', method: 'SETUP_ACTION_TYPE', search: {fields: 'title', sort: [{name: 'title'}], filters: [{name: 'fixed', comparison: 'EQUAL_TO', value1: 'N'}]}});	
					});

					$('#ns1blankspaceControlActionTemplate').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainTemplate_action'});
						ns1blankspace.format.templates.edit.init({template: 'action', object: 17, refresh: true, variants: true, useSource: true});
					});

					ns1blankspace.format.templates.edit.init({template: 'action', object: 17, refresh: true, variants: true});				
				}
}