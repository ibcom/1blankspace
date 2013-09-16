/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */

ns1blankspace.xhtml.defaultElementID = 'ns1blankspaceControlWebsite';

ns1blankspace.home = 
{
	init: 		function () {ns1blankspace.home.show()},

	show: 		function ()
				{	
					if (ns1blankspace.setupView)
					{	
						$('#ns1blankspaceViewControlSetup').attr('checked', false);
						$('#ns1blankspaceViewControlSetup').button('refresh');
						ns1blankspace.setup["switch"]({viewScript: 'ns1blankspace.home.show()'});
					}	

					$('#ns1blankspaceViewControlAction').button({disabled: true});
					$('#ns1blankspaceViewControlNew').button({disabled: true});
					$('#ns1blankspaceViewControlActionOptions').button({disabled: true});

					$('#ns1blankspaceViewControlViewContainer').button(
						{
							label: 'Select...'
						});

					var aHTML = [];
					
					aHTML.push('<table id="ns1blankspaceHomeContainer">');
					
					aHTML.push('<tr><td><div id="ns1blankspaceViewSetupWebsiteLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>');
						
					aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlWebsite" class="ns1blankspaceControl ns1blankspaceControlHome">' +
										'Websites<br />& Webapps</td>' +
									'</tr>');
					
					aHTML.push('</table>');					
							
					$('#ns1blankspaceControl').html(aHTML.join(''));
					
					this.bind();

					var aHTML = [];
					
					aHTML.push('<table id="ns1blankspaceHomeContainer">');
					aHTML.push('<tr><td id="ns1blankspaceHomeColumn1" class="ns1blankspaceColumn1Flexible"></td>');
					aHTML.push('<td id="ns1blankspaceHomeColumn2" class="ns1blankspaceColumn2" style="width:300px;">');
					aHTML.push('</td></tr></table>');	

					$('#ns1blankspaceMain').html(aHTML.join(''));

					$('#ns1blankspaceHomeColumn2').html(ns1blankspace.xhtml.homeNotes);

					if (ns1blankspace.xhtml.defaultElementID != '')
					{
						$('#' + ns1blankspace.xhtml.defaultElementID).addClass('ns1blankspaceHighlight');
						$('#' + ns1blankspace.xhtml.defaultElementID).click();
					};
				},

	bind: 		function ()
				{
					
					$('#ns1blankspaceControlWebsite').click(function(event)
					{
						$('#ns1blankspaceHomeColumn1').html(ns1blankspace.xhtml.loading);
						ns1blankspace.xhtml.defaultElementID = this.id;
						
						ns1blankspace.home.websites.show();
					});
				}
}	

ns1blankspace.home.options = 
{
	show: 		function ()
				{
					var aHTML = [];
					
					aHTML.push('<table id="ns1blankspaceHomeOptions" class="ns1blankspaceViewControlContainer" style="font-size:0.875em;">');
						
					aHTML.push('<tr><td id="ns1blankspaceHomeOptionsMyStartPage" class="ns1blankspace">' +
											'<a href="/index.asp?Site=475&p=asms%2Fmystartpage.asp" target="_blank">' +
											'My Start Page (Classic)</a></td></tr>');
					
					aHTML.push('</table>');
						
					if ($(ns1blankspace.xhtml.container).attr('data-initiator') == 'ns1blankspaceViewControlHomeOptions')
					{
						$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
						$(ns1blankspace.xhtml.container).attr('data-initiator', '');
					}
					else
					{	
						var oElement = $('#ns1blankspaceViewControlHomeOptions');
						$(ns1blankspace.xhtml.container).attr('data-initiator', 'ns1blankspaceViewControlHomeOptions');
						$(ns1blankspace.xhtml.container).html("&nbsp;");
						$(ns1blankspace.xhtml.container).show(ns1blankspace.option.showSpeedOptions);
						$(ns1blankspace.xhtml.container).offset({ top: $(oElement).offset().top + $(oElement).height(), left: $(oElement).offset().left });
						$(ns1blankspace.xhtml.container).html(aHTML.join(''));
						ns1blankspace.home.options.bind();
					}
				},

	bind:		function () {}
}				

ns1blankspace.home.websites = 
{
	show:		function (oResponse)
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
						
						$('#ns1blankspaceHomeColumn1').html(aHTML.join(''));
											
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
											'<tr><td class="ns1blankspaceNothing">No websites or webapps.</td></tr>' +
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
							ns1blankspace.setup.website.init();
							ns1blankspace.setup.website.search.send(event.target.id, {source: 1});
						});
					}
				}
}