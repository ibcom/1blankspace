/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */

ns1blankspace.developer.membership = 
{
	init: 		function ns1blankspaceDeveloperMembershipMasterViewport()
				{

					var bShowHome = true
					
					if (oParam != undefined)
					{
						if (oParam.showHome != undefined) {bShowHome = oParam.showHome}	
					}

					ns1blankspace.object = -1;
					ns1blankspace.objectParentName = 'developer';
					ns1blankspace.objectName = 'membership';
					ns1blankspace.objectContextData = undefined;
					ns1blankspace.objectContext = -1;
					ns1blankspace.viewName = 'Apps (Memberships)';
					
					if (bShowHome)
					{
						ns1blankspace.history.view({
							newDestination: 'ns1blankspace.developer.membership.init({showHome: true});',
							move: false
							});	
					}	
							
					ns1blankspace.app.reset();
					ns1blankspace.app.set(oParam);
				},

	home:		function (oResponse)
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

						var aHTML = [];
									
						aHTML.push('<table>' +
									'<tr><td id="ns1blankspaceViewDeveloperSpaceLarge" class="ns1blankspaceViewImageLarge">&nbsp;</td></tr>' +
									'</table>');		
						
						$('#ns1blankspaceControl').html(aHTML.join(''));	
						
						$.ajax(
						{
							type: 'GET',
							url: ns1blankspace.util.endpointURI('ADMIN_MEMBERSHIP_SEARCH'),
							data: 'rows=100&me=1',
							dataType: 'json',
							success: ns1blankspace.developer.membership.home
						});		
					}
					else
					{
						var aHTML = [];
						
						if (oResponse.data.rows.length == 0)
						{
							aHTML.push('<table><tr><td class="ns1blankspaceNothing">Click New to create an app membership.</td></tr>' +
											'</table>');
						}
						else
						{
							aHTML.push('<table>');
							aHTML.push('<tr><td class="ns1blankspaceCaption">MOST LIKELY</td></tr>');

							$.each(oResponse.data.rows, function()
							{
								aHTML.push('<tr class="ns1blankspaceRow">');
								
								aHTML.push('<td id="ns1blankspaceMostLikely_title-' + this.id + 
														'" class="ns1blankspaceMostLikely">' +
														this.email +
														'</td>');
								
								aHTML.push('</tr>');
							});
							
							aHTML.push('</table>');			
						}
						
						$('#ns1blankspaceMostLikely').html(aHTML.join(''));
					
						$('td.ns1blankspaceMostLikely').click(function(event)
						{
							ns1blankspace.developer.membership.search.send(event.target.id, {source: 1});
						});
					}
				},

	search: 	{
					send:		function (sXHTMLElementID, oParam)
								{
									var aSearch = sXHTMLElementID.split('-');
									var sElementID = aSearch[0];
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
										$('#ns1blankspaceViewControl').html(ns1blankspace.xhtml.loading);
										
										ns1blankspace.objectContext = sSearchContext;
										
										$.ajax(
										{
											type: 'GET',
											url: ns1blankspace.util.endpointURI('ADMIN_MEMBERSHIP_SEARCH'),
											data: 'id=' + ns1blankspace.util.fs(ns1blankspace.objectContext),
											dataType: 'json',
											success: function(data) {ns1blankspace.developer.membership.show(oParam, data)}
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
											ns1blankspace.search.start(sElementId);

											$.ajax(
											{
												type: 'GET',
												url: ns1blankspace.util.endpointURI('ADMIN_MEMBERSHIP_SEARCH'),
												data: 'title=' + sSearchText,
												dataType: 'json',
												success: function(data) {ns1blankspace.developer.membership.search.show(oParam, data)}
											});
											
										}
									};	
								}

								function (oParam, oResponse)
								{

									var iColumn = 0;
									var aHTML = [];
									var	iMaximumColumns = 1;
									
									if (oResponse.data.rows.length == 0)
									{
										ns1blankspaceMasterSearchStop();
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
											
											aHTML.push('<td class="ns1blankspaceSearch" id="membership-' + this.id + '">' +
															this.title + '</td>');
											
											if (iColumn == iMaximumColumns)
											{
												aHTML.push('</tr>');
												iColumn = 0;
											}	
										});
								    	
										aHTML.push('</table>');

										$(ns1blankspace.xhtml.container).html(aHTML.join(''));
										$(ns1blankspace.xhtml.container).show(giShowSpeedOptions);
										ns1blankspace.search.stop();
										
										$('td.ns1blankspaceSearch').click(function(event)
										{
											$(ns1blankspace.xhtml.container).html('&nbsp;');
											$(ns1blankspace.xhtml.container).hide(giHideSpeedOptions)
											ns1blankspace.developer.membership.search.send(event.target.id, {source: 1});
										});
									}	
											
								}
				},

	layout:		function ()
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

						aHTML.push('<tr><td id="ns1blankspaceControlEndpoints" class="ns1blankspaceControl">' +
										'Endpoints</td></tr>');

						aHTML.push('<tr><td id="ns1blankspaceControlSubscriptions" class="ns1blankspaceControl">' +
										'Subscriptions</td></tr>');

						aHTML.push('</table>';
					}				
								
					$('#ns1blankspaceControl').html(aHTML.join(''));
					
					var aHTML = [];

					aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControl"></div>');
					aHTML.push('<div id="ns1blankspaceMainDetails" class="ns1blankspaceControl"></div>');
					aHTML.push('<div id="ns1blankspaceMainEndpoints" class="ns1blankspaceControl"></div>';
					aHTML.push('<div id="ns1blankspaceMainSubscriptions" class="ns1blankspaceControl"></div>';

					$('#ns1blankspaceMain').html(aHTML.join(''));

					$('#ns1blankspaceControlSummary').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
						ns1blankspace.developer.membership.summary();
					});
					
					$('#ns1blankspaceControlDetails').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
						ns1blankspace.developer.membership.details();
					});

					$('#ns1blankspaceControlEndpoints').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainEndpoints'});
						ns1blankspace.developer.membership.endpoints();
					});

					$('#ns1blankspaceControlSubscriptions').click(function(event)
					{
						ns1blankspace.show({selector: '#ns1blankspaceMainSubscriptions'});
						ns1blankspace.developer.membership.subscriptions();
					});
				},							

	show:		function ns1blankspaceDeveloperMembershipShow(oParam, oResponse)
				{
					$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
					ns1blankspace.developer.membership.layout();
					
					var aHTML = [];
					
					if (oResponse.data.rows.length == 0)
					{
						ns1blankspace.objectContextData = undefined;
						
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find this app membership.</td></tr></table>');
								
						$('#ns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						ns1blankspace.objectContextData = oResponse.data.rows[0];
						
						$('#ns1blankspaceControlContext').html(ns1blankspace.objectContextData.title);
						$('#ns1blankspaceViewControlAction').button({disabled: false});
						$('#ns1blankspaceViewControlActionOptions').button({disabled: false});
						
						ns1blankspace.history.view({
							newDestination: 'ns1blankspace.developer.membership.init({showHome: false});ns1blankspace.developer.membership.search.send("-' + ns1blankspace.objectContext + '")',
							move: false
							});
						
						ns1blankspace.history.object({functionDefault: 'ns1blankspace.developer.membership.summary()'});
					}	
					}	
				},

	summary:	function ()
				{
					var aHTML = [];
					
					if (ns1blankspace.objectContextData == undefined)
					{
						aHTML.push('<table><tr><td valign="top">Sorry can\'t find this app membership.</td></tr></table>');
								
						$('#ns1blankspaceMain').html(aHTML.join(''));
					}
					else
					{
						aHTML.push('<table class="ns1blankspaceMain">' +
									'<tr class="ns1blankspaceRow">' +
									'<td id="ns1blankspaceSummaryColumn1" class="ns1blankspaceColumn1Large"></td>' +
									'<td id="ns1blankspaceSummaryColumn2" class="ns1blankspaceColumn2Action" style="width:100px;"></td>' +
									'</tr>' +
									'</table>');				
						
						$('#ns1blankspaceMainSummary').html(aHTML.join(''));

						aHTML.push('<table class="ns1blankspace">');
						
						aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Membership ID</td></tr>' +
										'<tr><td id="ns1blankspaceSummaryMembershipID" class="ns1blankspaceSummary">' +
										ns1blankspace.objectContextData.id +
										'</td></tr>');

						aHTML.push('</table>');					
						
						$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));
					}	
				},
	
	details:	function ()
				{
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
										'User' +
										'</td></tr>' +
										'<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceSelect">' +
										'<input id="ns1blankspaceDetailsUser" class="ns1blankspaceSelect"' +
											' data-method="SETUP_USER_SEARCH"' +
											' data-columns="username">' +
										'</td></tr>');			


function ns1blankspaceDeveloperMembershipDetails()
{
	var aHTML = [];
	var h = -1;
		
	if ($('#divns1blankspaceMainDetails').attr('onDemandLoading') == '1')
	{
		$('#divns1blankspaceMainDetails').attr('onDemandLoading', '');
		
		aHTML.push('<table id="tablens1blankspaceMainDetails" class="ns1blankspaceMainDetails">';
		aHTML.push('<tr id="trns1blankspaceMainDetailsRow1" class="ns1blankspaceMain">' +
						'<td id="tdns1blankspaceMainDetailsColumn1" class="ns1blankspaceMainColumn1">' +
						'</td>' +
						'<td id="tdns1blankspaceMainDetailsColumn2" class="ns1blankspaceMainColumn2x">' +
						'</td>' +
						'</tr>';
		aHTML.push('</table>';					
		
		$('#divns1blankspaceMainDetails').html(aHTML.join(''));
		
		var aHTML = [];
		var h = -1;
	
		aHTML.push('<table id="tablens1blankspaceMainDetailsColumn1" class="ns1blankspaceMain">';
	
		aHTML.push('<tr id="trns1blankspaceMainDetailsTitle" class="ns1blankspaceMain">' +
						'<td id="tdns1blankspaceMainDetailsTitle" class="ns1blankspaceMain">' +
						'Title' +
						'</td></tr>' +
						'<tr id="trns1blankspaceMainDetailsTitleValue" class="ns1blankspaceMainText">' +
						'<td id="tdns1blankspaceMainDetailsTitleValue" class="ns1blankspaceMainText">' +
						'<input id="inputns1blankspaceMainDetailsTitle" class="inputns1blankspaceMainText">' +
						'</td></tr>';

		aHTML.push('<tr id="trns1blankspaceMainDetailsReference" class="ns1blankspaceMain">' +
						'<td id="tdns1blankspaceMainDetailsReference" class="ns1blankspaceMain">' +
						'Reference' +
						'</td></tr>' +
						'<tr id="trns1blankspaceMainDetailsReferenceValue" class="ns1blankspaceMainText">' +
						'<td id="tdns1blankspaceMainDetailsReferenceValue" class="ns1blankspaceMainText">' +
						'<input id="inputns1blankspaceMainDetailsReference" class="inputns1blankspaceMainText">' +
						'</td></tr>';				
		
		aHTML.push('<tr id="trns1blankspaceMainDetailsDescription" class="ns1blankspaceMain">' +
						'<td id="tdns1blankspaceMainDetailsDescription" class="ns1blankspaceMain">' +
						'Description' +
						'</td></tr>' +
						'<tr id="trns1blankspaceMainDetailsDescriptionValue" class="ns1blankspaceMainTextMulti">' +
						'<td id="tdns1blankspaceMainDetailsDescriptionValue" class="ns1blankspaceMainTextMulti">' +
						'<textarea rows="10" cols="35" id="inputns1blankspaceMainDetailsDescription" class="inputns1blankspaceMainTextMultiSmall"></textarea>' +
						'</td></tr>';

		aHTML.push('<tr id="trns1blankspaceMainDetailsBasedOnSubscription" class="ns1blankspaceMain">' +
						'<td id="tdns1blankspaceMainDetailsBasedOnSubscription" class="ns1blankspaceMain">' +
						'Based On Subscription' +
						'</td></tr>' +
						'<tr>' +
						'<td id="tdns1blankspaceMainDetailsBasedOnSubscriptionValue" class="ns1blankspaceMainRadio">' +
						ns1blankspace.loadingSmallXHTML +
						'</td></tr>';

		aHTML.push('</table>';					
		
		ns1blankspaceDeveloperMembershipDetailsSubscriptions();

		$('#tdns1blankspaceMainDetailsColumn1').html(aHTML.join(''));
		
		if (goObjectContext != undefined)
		{
			$('#inputns1blankspaceMainDetailsTitle').val(goObjectContext.title);
			$('#inputns1blankspaceMainDetailsReference').val(goObjectContext.reference);
			$('#inputns1blankspaceMainDetailsDescription').val(goObjectContext.description);
		}
	}	
}

function ns1blankspaceDeveloperMembershipDetailsSubscriptions(oParam, oResponse)
{
	if (oResponse == undefined)
	{	
		var sData = '';

		$.ajax(
			{
				type: 'POST',
				url: '/ondemand/admin/?method=ADMIN_MEMBERSHIP_SUBSCRIPTION_SEARCH',
				data: sData,
				dataType: 'json',
				success: function(data) {ns1blankspaceDeveloperMembershipDetailsSubscriptions(oParam, data)
				}
			});
	}
	else
	{
		var aHTML = [];
		var h = -1;

		if (oResponse.data.rows == 0)
		{
			aHTML.push('No subscriptions';
		}
		else
		{		
			$.each(oResponse.data.rows, function() 
			{ 
				aHTML.push('<input type="radio" id="radioBasedOnSubscription' + this.id + '" name="radioBasedOnSubscription" value="' + this.id + '"/>' +
								this.membershiptext + '<br />';
			});
		}
		
		$('#tdns1blankspaceMainDetailsBasedOnSubscriptionValue').html(aHTML.join(''));

		if (goObjectContext != undefined)
		{
			$('[name="radioBasedOnSubscription"][value="' + goObjectContext.basedonsubscription + '"]').attr('checked', true);
		}
	}
}

function ns1blankspaceDeveloperMembershipEndpoints(oParam, oResponse)
{
	var aHTML = [];
	var h = -1;
	
	
	if (oResponse == undefined)
	{
		var oSearch = new AdvancedSearch();
		oSearch.method = 'ADMIN_MEMBERSHIP_ENDPOINT_SEARCH';
		oSearch.addField('endpointtext,endpoint');
		oSearch.addFilter('membership', 'EQUAL_TO', giObjectContext)
		oSearch.rows = 50;
		oSearch.sort('endpointtext', 'asc');
		oSearch.getResults(function(data) {ns1blankspaceDeveloperMembershipEndpoints(oParam, data)})	
	}
	else
	{
		var aHTML = [];
		var h = -1;
		
		aHTML.push('<table class="ns1blankspaceMain">' +
					'<tr id="trns1blankspaceMainMembershipEndpointsRow1" class="ns1blankspaceMainRow1">' +
					'<td id="tdns1blankspaceMainMembershipEndpointsColumn1" class="ns1blankspaceMainColumn1Large">' +
					'</td>' +
					'<td id="tdns1blankspaceMainMembershipEndpointsColumn2" style="width: 100px;" class="ns1blankspaceMainColumn2Action">' +
					'</td>' +
					'</tr>' +
					'</table>';				
		
		$('#divns1blankspaceMainEndpoints').html(aHTML.join(''));

		var aHTML = [];
		var h = -1;
		
		aHTML.push('<table class="ns1blankspaceMainColumn2">';
		
		aHTML.push('<tr><td id="tdns1blankspaceMainMembershipEndpointsAdd" class="ns1blankspaceMainAction">' +
						'<span id="spanns1blankspaceMainMembershipEndpointsAdd">Add Endpoint</span>' +
						'</td></tr>';
		
		aHTML.push('</table>';					
		
		$('#tdns1blankspaceMainMembershipEndpointsColumn2').html(aHTML.join(''));
		
		$('#spanns1blankspaceMainMembershipEndpointsAdd').button(
		{
			label: "Add Endpoint"
		})
		.click(function() {
			ns1blankspaceMasterOptionsSetPosition('spanns1blankspaceMainMembershipEndpointsAdd', -50, -280);
			ns1blankspaceDeveloperMembershipEndpointsAdd(oParam);
		});

		var aHTML = [];
		var h = -1;	
				
		aHTML.push('<table cellspacing="0" cellpadding="0" class="ns1blankspaceMain">';
		aHTML.push('<tbody>';

		if (oResponse.data.rows.length == 0)
		{
			aHTML.push('<tr class="ns1blankspaceMainCaption">' +
					'<td class="ns1blankspaceMainRowNothing" >No endpoints.</td></tr>';
		}

		$(oResponse.data.rows).each(function()
		{

			aHTML.push('<tr class="ns1blankspaceMainRow">';
			
			aHTML.push('<td id="ns1blankspaceMembershipEndpoint_Title-' + this.id + '" class="ns1blankspaceMainRow ns1blankspaceMainRowSelect endpoint"' +
									' title="">' +
									this.endpointtext + '</td>';

			aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceMainRow">';
			aHTML.push('<span id="spanMembershipEndpoint_options_remove-' + this.id + '" class="ns1blankspaceMainRowOptionsRemove"></span>';
			aHTML.push('</td>';																	
			aHTML.push('</tr>';
		});
	
		aHTML.push('</tbody></table>';
			
		$('#tdns1blankspaceMainMembershipEndpointsColumn1').html(aHTML.join(''));

		$('td.endpoint').click(function(event)
		{
			var sXHTMLElementId = event.target.id;
			var aId = sXHTMLElementId.split('-');
			
			ns1blankspaceDeveloperMembershipEndpoints({endpoint: aId[1], step: 2});
		});

		$('.ns1blankspaceMainRowOptionsRemove').button(
		{
			text: false,
		 	icons: {primary: "ui-icon-close"}
		})
		.click(function() {
			ns1blankspaceDeveloperMembershipEndpointsRemove(this.id)
		})
		.css('width', '15px')
		.css('height', '20px')
	}
}

function ns1blankspaceDeveloperMembershipEndpointsAdd(oParam, oResponse)
{
		
	if ($(ns1blankspace.xhtml.container).attr('onDemandSource') == 'spanns1blankspaceMainUserAccessRolesAdd')
	{
		$(ns1blankspace.xhtml.container).slideUp(500);
		$(ns1blankspace.xhtml.container).attr('onDemandSource', '');
	}
	else
	{
		if (oResponse == undefined)
		{
			var oSearch = new AdvancedSearch();
			oSearch.method = 'SETUP_ENDPOINT_SEARCH';
			oSearch.addField('title');
			oSearch.sort('title', 'ASC');
			oSearch.rows = 50;

			oSearch.getResults(function(data)
			{
				ns1blankspaceDeveloperMembershipEndpointsAdd(oParam, data)
			});
		}
		else
		{
			
			$(ns1blankspace.xhtml.container).attr('onDemandSource', 'spanns1blankspaceMainUserAccessRolesAdd')
			
			var aHTML = [];
			var h = -1;
			
			if (oResponse.data.rows.length == 0)
			{
				aHTML.push('<table border="0" cellspacing="0" cellpadding="0" class="ns1blankspaceSearchMedium">';
				aHTML.push('<tbody>'
				aHTML.push('<tr class="ns1blankspaceMainCaption">' +
								'<td class="ns1blankspaceMainRowNothing">No endpoints.</td></tr>';
				aHTML.push('</tbody></table>';

				$(ns1blankspace.xhtml.container).html(aHTML.join(''));
				$(ns1blankspace.xhtml.container).show(giShowSpeedOptions);
			}
			else
			{
				aHTML.push('<table class="ns1blankspaceSearchMedium" style="font-size:0.725em;">';
				aHTML.push('<tbody>'
				
				$.each(oResponse.data.rows, function()
				{	
					aHTML.push('<tr class="ns1blankspaceMainRow">';
					
					aHTML.push('<td id="tdMembershipEndpointsSelect-title-' + this.id + '" class="ns1blankspaceMainRowSelect">' +
											this.title + '</td>';
					
					aHTML.push('</tr>'
				});
				
				aHTML.push('</tbody></table>';

				$(ns1blankspace.xhtml.container).html(aHTML.join(''));
				$(ns1blankspace.xhtml.container).show(giShowSpeedOptions);
				
				$('td.ns1blankspaceMainRowSelect').click(function(event)
				{
					ns1blankspaceDeveloperMembershipEndpointsSelect(event.target.id);
				});
			}
		}
	}	
}
	
function ns1blankspaceDeveloperMembershipEndpointsSelect(sXHTMLElementId)
{

	var aSearch = sXHTMLElementId.split('-');
	var sElementId = aSearch[0];
	var sSearchContext = aSearch[2];
	
	$('#' + sXHTMLElementId).fadeOut(500);
	
	var sParam = 'method=ADMIN_MEMBERSHIP_ENDPOINT_MANAGE';
	var sData = 'membership=' + giObjectContext +
				'&endpoint=' + sSearchContext;
				
	$.ajax(
		{
			type: 'POST',
			url: '/ondemand/admin/?' + sParam,
			data: sData,
			dataType: 'json',
			success: function(data){ns1blankspaceDeveloperMembershipEndpoints()}
		});
		
}

function ns1blankspaceDeveloperMembershipEndpointsRemove(sXHTMLElementId)
{

	var aSearch = sXHTMLElementId.split('-');
	var sElementId = aSearch[0];
	var sSearchContext = aSearch[1];
	
	var sParam = 'method=ADMIN_MEMBERSHIP_ENDPOINT_MANAGE&remove=1';
	var sData = 'id=' + sSearchContext;
				
	$.ajax(
		{
			type: 'POST',
			url: '/ondemand/admin/?' + sParam,
			data: sData,
			dataType: 'json',
			success: function(data){$('#' + sXHTMLElementId).parent().parent().fadeOut(500)}
		});	
}

function ns1blankspaceDeveloperMembershipSubscriptions(oParam, oResponse)
{
	var sXHTMLElementID = 'divns1blankspaceMainSubscriptions';
	var iStep = 1;
	var aXHTMLElementID = [];

	if (oParam != undefined)
	{
		if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
		if (oParam.step != undefined) {iStep = oParam.step}
	}
	else
	{
		oParam = {step: 1}
	}

	aXHTMLElementID = sXHTMLElementID.split('-');

	if (iStep == 1)
	{
		if (oResponse == undefined)
		{
			$.ajax(
			{
				type: 'POST',
				url: '/ondemand/admin/?method=ADMIN_MEMBERSHIP_SUBSCRIPTION_SEARCH',
				data: 'other=1&advanced=1&membership=' + giObjectContext,
				dataType: 'json',
				success: function(data){ns1blankspaceDeveloperMembershipSubscriptions(oParam, data)}
			});	
		}
		else
		{
			var aHTML = [];
			var h = -1;
			
			aHTML.push('<table class="ns1blankspaceMain">' +
						'<tr>' +
						'<td id="tdns1blankspaceMainMembershipSubscriptionsColumn1" style="width:150px;border-right-style:solid;border-width:2px;border-color:#B8B8B8;padding-right:15px;">' +
						'</td>' +
						'<td id="tdns1blankspaceMainMembershipSubscriptionsColumn2" class="ns1blankspaceMainColumn1Large" style="padding-left:15px;">' +
						'</td>' +
						'<td id="tdns1blankspaceMainMembershipSubscriptionsColumn3" style="width: 100px;" class="ns1blankspaceMainColumn2Action">' +
						'</td>' +
						'</tr>' +
						'</table>';				
			
			$('#divns1blankspaceMainSubscriptions').html(aHTML.join(''));
			
			var aHTML = [];
			var h = -1;
			
			aHTML.push('<table>';
			
			aHTML.push('<tr><td class="ns1blankspaceMainAction">' +
							'<span id="spanns1blankspaceMainMembershipSubscriptionsAdd">Add</span>' +
							'</td></tr>';
			
			aHTML.push('</table>';					
			
			$('#tdns1blankspaceMainMembershipSubscriptionsColumn3').html(aHTML.join(''));
			
			$('#spanns1blankspaceMainMembershipSubscriptionsAdd').button(
			{
				label: "Add"
			})
			.click(function()
			{
				oParam.step = 2;
				oParam.xhtmlElementID = '';
				ns1blankspaceDeveloperMembershipSubscriptions(oParam);
			});

			var aHTML = [];
			var h = -1;
			
			if (oResponse.data.rows.length == 0)
			{
				aHTML.push('<table border="0" cellspacing="0" cellpadding="0" class="ns1blankspaceMain">';
				aHTML.push('<tbody>'
				aHTML.push('<tr class="ns1blankspaceMainCaption">' +
								'<td class="ns1blankspaceMainRowNothing">No subscriptions.</td></tr>';
				aHTML.push('</tbody></table>';

				$('#tdns1blankspaceMainMembershipSubscriptionsColumn1').html(aHTML.join(''));
			}
			else
			{
				aHTML.push('<table>';
				aHTML.push('<tbody>';
				
				$.each(oResponse.data.rows, function()
				{
					aHTML.push('<tr class="ns1blankspaceMainRow">';
					
					aHTML.push('<td id="tdMembershipSubscriptions_title-' + this.id +
											'" data-contactbusinesstext="' + this.contactbusinesstext +
											'" class="ns1blankspaceMainRow ns1blankspaceRowSelect ns1blankspaceMembershipSubscriptions">' +
											this.contactbusinesstext;
					
					aHTML.push('<br /><span class="ns1blankspaceViewportControlSubContext" id="ns1blankspaceMembershipSubscriptions_startdate-' + this.id + '">' +
	 										this.startdate + '</span>';

	 				aHTML.push('</td>';						

	 				aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceMainRow">';
					aHTML.push('<span id="spanMembershipSubscriptions_options_remove-' + this.id + '" class="ns1blankspaceMainRowOptionsRemove"></span>';
					aHTML.push('</td>';		

					aHTML.push('</tr>';
				});
				
				aHTML.push('</tbody></table>';

				$('#tdns1blankspaceMainMembershipSubscriptionsColumn1').html(aHTML.join(''));
							
				$('td.ns1blankspaceMembershipSubscriptions').click(function(event)
				{
					oParam.step = 2;
					oParam.xhtmlElementID = event.target.id;
					ns1blankspaceDeveloperMembershipSubscriptions(oParam);
				});

				$('.ns1blankspaceMainRowOptionsRemove').button(
				{
					text: false,
				 	icons: {primary: "ui-icon-close"}
				})
				.click(function()
				{
					oParam.step = 6;
					oParam.xhtmlElementID = this.id;
					ns1blankspaceDeveloperMembershipSubscriptions(oParam);
				})
				.css('width', '15px')
				.css('height', '20px')
			}
		}
	}

	else if (iStep == 2)
	{
		if (oResponse == undefined)
		{
			var aHTML = [];
			var h = -1;

			aHTML.push('<table class="ns1blankspaceMain">';
			
			aHTML.push('<tr id="trns1blankspaceMainMembershipSubscriptionsRegistration" class="ns1blankspaceMain">' +
							'<td id="tdns1blankspaceMainMembershipSubscriptionsRegistration" class="ns1blankspaceMain">' +
							'Space' +
							'</td></tr>' +
							'<tr id="trns1blankspaceMainMembershipSubscriptionsRegistrationValue" class="ns1blankspaceMainSelect">' +
							'<td id="tdns1blankspaceMainMembershipSubscriptionsRegistrationValue" class="ns1blankspaceMainSelect">' +
							'<input id="inputns1blankspaceMainMembershipSubscriptionsRegistration" class="inputns1blankspaceMainSelectCustom">' +
							'</td></tr>';

			aHTML.push('<tr class="ns1blankspaceMainCaption">' +
									'<td class="ns1blankspaceMainRowNothing">You need to enter at least 3 characters.</td></tr>' +
									'<td class="ns1blankspaceMainRowNothing">It will only show spaces that you have signed up.</td></tr>';

			aHTML.push('</table>';					
			
			$('#tdns1blankspaceMainMembershipSubscriptionsColumn2').html(aHTML.join(''));
			
			$('#inputns1blankspaceMainMembershipSubscriptionsRegistration').keyup(function()
			{
				if (giKeyPressTimeoutId != 0) {clearTimeout(giKeyPressTimeoutId)};
		        giKeyPressTimeoutId = setTimeout("ns1blankspaceMembershipSubscriptionsRegistrationSearch('inputns1blankspaceMainMembershipSubscriptionsRegistration')", giWaitForStop);
			});	
				
			$('#inputns1blankspaceMainMembershipSubscriptionsRegistration').live('blur', function() 
			{
				$(this).removeClass('ns1blankspaceMasterHighlight');
			});

			var aHTML = [];
			var h = -1;
		
			aHTML.push('<table id="tablens1blankspaceMainColumn2" class="ns1blankspaceMain" style="font-size:0.875em">';
					
			if (aXHTMLElementID[1])
			{
				aHTML.push('<tr class="ns1blankspaceMainCaption">' +
									'<td class="ns1blankspaceMainRowNothing">To change this access you need to delete it and then re-add it.</td></tr>';

			}	
			else
			{	
				aHTML.push('<tr class="ns1blankspaceMainAction">' +
								'<td class="ns1blankspaceMainAction">' +
								'<span style="width:70px;" id="spanns1blankspaceMainMembershipSubscriptionEditSave">Save</span>' +
								'</td></tr>';
			}

			aHTML.push('<tr class="ns1blankspaceMainAction">' +
								'<td class="ns1blankspaceMainAction">' +
								'<span style="width:70px;" id="spanns1blankspaceMainMembershipSubscriptionEditCancel">Cancel</span>' +
								'</td></tr>';
			
			aHTML.push('</table>';					
			
			$('#tdns1blankspaceMainMembershipSubscriptionsColumn3').html(aHTML.join(''));

			$('#spanns1blankspaceMainMembershipSubscriptionEditSave').button(
			{
				text: "Save"
			})
			.click(function() 
			{
				ns1blankspaceMasterStatusWorking();

				var sData = 'id=' + ns1blankspaceMasterFormatSave(aXHTMLElementID[1]);
				sData += '&registration=' + ns1blankspaceMasterFormatSave($('#inputns1blankspaceMainMembershipSubscriptionsRegistration').attr("data-id"));
				sData += '&membership=' + giObjectContext;

				$.ajax(
				{
					type: 'POST',
					url: '/ondemand/admin/?method=ADMIN_MEMBERSHIP_SUBSCRIPTION_MANAGE',
					data: sData,
					dataType: 'json',
					success: function() {
						oParam.step = 1;
						ns1blankspaceDeveloperMembershipSubscriptions(oParam);
						ns1blankspaceMasterStatus('Saved');
					}
				});
			})
			
			$('#spanns1blankspaceMainMembershipSubscriptionEditCancel').button(
			{
				text: "Cancel"
			})
			.click(function() 
			{
				oParam.step = 1;
				ns1blankspaceDeveloperMembershipSubscriptions(oParam);
			})

			if (aXHTMLElementID[1])
			{
				$('#inputns1blankspaceMainMembershipSubscriptionsRegistration').attr("data-id", aXHTMLElementID[1])
				$('#inputns1blankspaceMainMembershipSubscriptionsRegistration').val($('#tdMembershipSubscriptions_title-' + aXHTMLElementID[1]).attr("data-contactbusinesstext"));
			}
		}
		else
		{
		}	
	}
	else if (iStep == 6)
	{	
		$.ajax(
			{
				type: 'POST',
				url: '/ondemand/admin/?method=ADMIN_MEMBERSHIP_SUBSCRIPTION_MANAGE&remove=1',
				data: 'id=' + aXHTMLElementID[1],
				dataType: 'json',
				success: function(data){$('#' + sXHTMLElementID).parent().parent().fadeOut(500)}
			});	
		}	
}	


function ns1blankspaceMembershipSubscriptionsRegistrationSearch(sXHTMLInputElementID, oResponse)
{
	var aHTML = [];
	var sSearchText;
	var iXHTMLElementContextID;

	if (oResponse == undefined)
	{	
		sSearchText = $('#' + sXHTMLInputElementID).val();
		
		if (sSearchText.length > 2)
		{
			$.ajax(
			{
				type: 'GET',
				url: '/ondemand/admin/?method=ADMIN_REGISTRATION_SEARCH&rows=10&status=2&contactbusinesstext=' + ns1blankspaceMasterFormatSave(sSearchText),
				dataType: 'json',
				success: function(data) {ns1blankspaceMembershipSubscriptionsRegistrationSearch(sXHTMLInputElementID, data)}
			});
		}
	}
	else
	{	
		aHTML.push('<table style="width: 350px;" class="ns1blankspaceViewportMasterControl" cellpadding=4>');

		$(oResponse.data.rows).each(function()
		{
			if (this.contactbusinesstext != '')
			{
				aHTML.push('<tr>' +
					'<td id="tdns1blankspaceMasterRegistration-' + this.id + '" data-usertext="' + this.contactbusinesstext + '" class="ns1blankspaceSearch ns1blankspaceMasterNetworkUser">' +
					this.contactbusinesstext +
					'</td></tr>');
			}	
		});			
						
		aHTML.push('</table>');
		
		$(ns1blankspace.xhtml.container).html(aHTML.join(''));

		$(ns1blankspace.xhtml.container).show(giShowSpeedOptions);
		$(ns1blankspace.xhtml.container).offset({ top: $('#' + sXHTMLInputElementID).offset().top + $('#' + sXHTMLInputElementID).height(), left: $('#' + sXHTMLInputElementID).offset().left});

		$('.ns1blankspaceMasterNetworkUser').click(function(event)
		{
			var aXHTMLElementID = (event.target.id).split('-');
			iXHTMLElementContextID = aXHTMLElementID[1];

			$('#' + sXHTMLInputElementID).val($('#' + event.target.id).attr("data-usertext"))
			$('#' + sXHTMLInputElementID).attr("data-id", iXHTMLElementContextID)
			$(ns1blankspace.xhtml.container).hide();
		});
	}	
}	

function ns1blankspaceDeveloperMembershipSave()
{

	var sParam = 'method=ADMIN_MEMBERSHIP_MANAGE';
	var sData = 'id=' + (giObjectContext != -1 ? giObjectContext : '');
		
	if ($('#divns1blankspaceMainDetails').html() != '')
	{
		sData += '&title=' + encodeURIComponent($('#inputns1blankspaceMainDetailsTitle').val());
		sData += '&reference=' + encodeURIComponent($('#inputns1blankspaceMainDetailsReference').val());
		sData += '&description=' + encodeURIComponent($('#inputns1blankspaceMainDetailsDescription').val());
		sData += '&basedonsubscription=' + ns1blankspaceMasterFormatSave($('input[name="radioBasedOnSubscription"]:checked').val());
	};

	ns1blankspaceMasterStatusWorking();

	$.ajax(
	{
		type: 'POST',
		url: '/ondemand/admin/?' + sParam,
		data: sData,
		dataType: 'json',
		success: function(oResponse)
		{
			if (oResponse.status == 'OK')
			{	
				ns1blankspaceMasterStatus('Saved');
				
				if (giObjectContext == -1)
				{
					giObjectContext = oResponse.id;
					gbInputDetected = false;
					ns1blankspaceDeveloperMembershipSearch('-' + giObjectContext, {source: 1});
				}	
			}
			else
			{
				ns1blankspaceMasterError(oResponse.error.errornotes);;
			}
		}
	});
		
}

function ns1blankspaceDeveloperMembershipNew(oParam)
{
	goObjectContext = undefined
	giObjectContext = -1;
	ns1blankspaceDeveloperMembershipViewport();
	$('#spanns1blankspaceMasterViewportControlAction').button({disabled: false});
	ns1blankspaceMasterMainViewportShow("#divns1blankspaceMainDetails");
	ns1blankspaceDeveloperMembershipDetails();
}
