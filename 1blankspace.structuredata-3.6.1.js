/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 */
 
ns1blankspace.structureData = 
{
	data: 		{},

	init: 		function (oParam)
	{
		ns1blankspace.app.reset();

		ns1blankspace.object = 41;
		ns1blankspace.objectName = 'structureData';
		ns1blankspace.viewName = 'Structure Data';
		ns1blankspace.objectMethod = 'STRUCTURE_DATA';
	
		ns1blankspace.app.set(oParam);
	},

	home: 		
	{
		show: 		function (oParam, oResponse)
		{
			var iStructure = ns1blankspace.util.getParam(oParam, 'structure').value;

			$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);

			if (oResponse == undefined)
			{	
				var aHTML = [];
							
				aHTML.push('<table class="ns1blankspaceMain">');
				aHTML.push('<tr class="ns1blankspaceMain">' +
								'<td id="ns1blankspaceMostLikely" class="ns1blankspaceSub">' +
								'Select a structure to edit its data' +
								'</td>' +
								'</tr>');
				aHTML.push('</table>');					
				
				$('#ns1blankspaceMain').html(aHTML.join(''));

				var aHTML = [];
							
				aHTML.push('<table>' +
					'<tr><td><div id="ns1blankspaceViewSetupLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>' +
					'<tr><td id="ns1blankspaceStructureDataStructures"></td></tr>' +
					'</table>');		
				
				$('#ns1blankspaceControl').html(aHTML.join(''));	
				
				$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);

				ns1blankspace.status.working();

				var oSearch = new AdvancedSearch();
				oSearch.method = 'SETUP_STRUCTURE_SEARCH';
				oSearch.addField('title');
				oSearch.rows = 100;
				oSearch.sort('title', 'asc');
				oSearch.getResults(function (data) {ns1blankspace.structureData.home.show(oParam, data)})
			}
			else
			{
				ns1blankspace.status.clear();

				var aHTML = [];
				
				if (oResponse.data.rows.length != 0)
				{
					ns1blankspace.structureData.data.structures = oResponse.data.rows;

					aHTML.push('<table class="ns1blankspaceControl">');

					$.each(oResponse.data.rows, function(r, row)
					{
						aHTML.push('<tr><td id="ns1blankspaceControlStructure-' + row.id + '" class="ns1blankspaceControl">' +
										row.title + '</td></tr>');
					});
					
					aHTML.push('</table>');

					$('#ns1blankspaceStructureDataStructures').html(aHTML.join(''));

					$('#ns1blankspaceControlStructure-' + iStructure).addClass('ns1blankspaceHighlight');

					$('td.ns1blankspaceControl').unbind('click').click(function ()
					{	
						ns1blankspace.structureData.home.data(
						{
							structure: (this.id).split('-')[1]
						})
					});

					if (iStructure != undefined)
					{
						ns1blankspace.structureData.home.data(
						{
							structure: iStructure
						})
					}	
				}
			}	
		},	

		data:		function (oParam, oResponse)
		{
			var iStructure = ns1blankspace.util.getParam(oParam, 'structure').value;
			ns1blankspace.structureData.data.structure = iStructure;

			if (oResponse == undefined)
			{
				var oSearch = new AdvancedSearch();
				oSearch.method = 'STRUCTURE_DATA_SEARCH';
				oSearch.addField('reference,title,structuretext,completedbyusertext,contactbusinesstext,contactpersontext,referencedate,modifieddate');

				if (iStructure != undefined)
				{
					oSearch.addFilter('structure', 'EQUAL_TO', iStructure);
				}

				oSearch.rows = 250;
				oSearch.sort('title', 'asc');
				oSearch.getResults(function (data) {ns1blankspace.structureData.home.data(oParam, data)})
			}
			else
			{
				var aHTML = [];
				
				if (oResponse.data.rows.length == 0)
				{
					aHTML.push('<table>' +
									'<tr><td class="ns1blankspaceNothing">Click New to add data to the structure.</td></tr>' +
									'</table>');
				}
				else
				{
					var sContext;

					aHTML.push('<table>');

					$.each(oResponse.data.rows, function()
					{
						sContext = this.title;
						sModifiedDate = this.modifieddate;

						if (sContext == '')
						{
							sContext = this.modifieddate;
							sModifiedDate = '&nbsp;';
						}

						aHTML.push('<tr class="ns1blankspaceRow">');
						
						aHTML.push('<td id="ns1blankspaceMostLikely_title-' + this.id + 
												'" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
												sContext +
												'</td>');

						aHTML.push('<td id="ns1blankspaceMostLikely_completedbyusertext-' + this.id + 
												'" class="ns1blankspaceRow ns1blankspaceSubNote">' +
												this.completedbyusertext +
												'</td>');
						
						aHTML.push('<td id="ns1blankspaceMostLikely_contactbusinesstext-' + this.id + 
												'" class="ns1blankspaceRow ns1blankspaceSubNote">' +
												this.contactbusinesstext +
												'</td>');

						aHTML.push('<td id="ns1blankspaceMostLikely_contactpersontext-' + this.id + 
												'" class="ns1blankspaceRow ns1blankspaceSubNote">' +
												this.contactpersontext +
												'</td>');

						aHTML.push('<td id="ns1blankspaceMostLikely_modifieddate-' + this.id + 
												'" class="ns1blankspaceRow ns1blankspaceSubNote">' +
												sModifiedDate +
												'</td>');

						aHTML.push('<td id="ns1blankspaceMostLikely_id-' + this.id + 
												'" class="ns1blankspaceRow ns1blankspaceSubNote">' +
												this.id +
												'</td>');

						aHTML.push('</tr>');
					});
					
					aHTML.push('</table>');			
				}
				
				$('#ns1blankspaceMostLikely').html(aHTML.join(''));
			
				$('td.ns1blankspaceRowSelect').click(function(event)
				{
					ns1blankspace.structureData.search.send(event.target.id, {source: 1});
				});

				ns1blankspace.structureData.util.object.get({structure: iStructure});
			}
		}				
	},

	search: 	
	{
		send: 		function (sXHTMLElementId, oParam)
		{
			
			var aSearch = sXHTMLElementId.split('-');
			var sElementId = aSearch[0];
			var sSearchContext = aSearch[1];
			var iMinimumLength = 0;
			var iSource = ns1blankspace.data.searchSource.text;
			var sSearchText;
			var iMaximumColumns = 1;
			
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

				var oSearch = new AdvancedSearch();
				oSearch.method = 'STRUCTURE_DATA_SEARCH';
				oSearch.addField('completedbyuser,contactbusiness,contactperson,structure,completedbyuser,completedbyusertext,contactbusiness,' +
									'contactbusinesstext,contactperson,contactpersontext,notes,object,objectcontext,reference,referencedate,' +
									'referencetype,referencetypetext,resultscore,resultscoretext,scheduleddate,status,' +
									'statustext,structure,structuretext,title,totalpoints,modifieddate');
				oSearch.addFilter('id', 'EQUAL_TO', sSearchContext);
				oSearch.getResults(function (data) {ns1blankspace.structureData.show(oParam, data)})
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
					ns1blankspace.search.start();

					var oSearch = new AdvancedSearch();
					oSearch.method = 'STRUCTURE_DATA_SEARCH';
					oSearch.addField('reference,title,structuretext,completedbyusertext,contactbusinesstext,contactpersontext,referencedate');
					oSearch.rows = 10;
					oSearch.addFilter('title', 'TEXT_IS_LIKE', sSearchText);
					oSearch.getResults(function (data) {ns1blankspace.structureData.search.process(oParam, data)})
				}
			};	
		},

		process:	function (oParam, oResponse)
		{
			var iColumn = 0;
			var aHTML = [];
			var	iMaximumColumns = 1;
			
			ns1blankspace.search.stop();

			if (oResponse.data.rows.length == 0)
			{
				$(ns1blankspace.xhtml.searchContainer).html('<table class="ns1blankspaceSearchMedium"><tr><td class="ns1blankspaceSubNote">Nothing to show</td></tr></table>');
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

				$(ns1blankspace.xhtml.searchContainer).html(aHTML.join(''));
				$(ns1blankspace.xhtml.searchContainer).show(ns1blankspace.option.showSpeedOptions);
				
				$('td.ns1blankspaceSearch').click(function(event)
				{
					$(ns1blankspace.xhtml.dropDownContainer).html('&nbsp;');
					$(ns1blankspace.xhtml.dropDownContainer).hide(ns1blankspace.option.hideSpeedOptions)
					ns1blankspace.structureData.search.send(event.target.id, 1);
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

			aHTML.push('<tr><td id="ns1blankspaceControlElement" class="ns1blankspaceControl">' +
							'Values</td></tr>');

			aHTML.push('</table><table class="ns1blankspaceControl">');

			aHTML.push('<tr><td id="ns1blankspaceControlAccess" class="ns1blankspaceControl">' +
							'Access</td></tr>');
		}	
		
		aHTML.push('</table>');					
					
		$('#ns1blankspaceControl').html(aHTML.join(''));
		
		var aHTML = [];

		aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>');
		aHTML.push('<div id="ns1blankspaceMainDetails" class="ns1blankspaceControlMain"></div>');
		aHTML.push('<div id="ns1blankspaceMainElement" class="ns1blankspaceControlMain"></div>');
		aHTML.push('<div id="ns1blankspaceMainAccess" class="ns1blankspaceControlMain"></div>');	
		
		$('#ns1blankspaceMain').html(aHTML.join(''));
			
		$('#ns1blankspaceControlSummary').click(function(event)
		{
			ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
			ns1blankspace.structureData.summary();
		});
		
		$('#ns1blankspaceControlDetails').click(function(event)
		{
			ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
			ns1blankspace.structureData.details();
		});

		$('#ns1blankspaceControlElement').click(function(event)
		{
			ns1blankspace.show({selector: '#ns1blankspaceMainElement', refresh: true});
			ns1blankspace.structureData.elements.init();
		});

		$('#ns1blankspaceControlAccess').click(function(event)
		{
			ns1blankspace.show({selector: '#ns1blankspaceMainAccess', refresh: true});
			ns1blankspace.structureData.access.show();
		});
	},

	show: 		function (oParam, oResponse)
	{
		ns1blankspace.app.clean();
		ns1blankspace.structureData.layout();
		
		var aHTML = [];
		
		if (oResponse.data.rows.length == 0)
		{
			ns1blankspace.objectContextData = undefined;
			
			aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find this structure data.</td></tr></table>');
					
			$('#ns1blankspaceMain').html(aHTML.join(''));
		}
		else
		{
			ns1blankspace.objectContextData = oResponse.data.rows[0];
		
			var sContext = ns1blankspace.objectContextData.title;
			if (sContext == '') {sContext = ns1blankspace.objectContextData.modifieddate}

			$('#ns1blankspaceControlContext').html(sContext +
				'<div id="ns1blankspaceControlContext_structure" class="ns1blankspaceSub" style="cursor:pointer;">' +
					ns1blankspace.objectContextData.structuretext + '</div>');

			$('#ns1blankspaceViewControlAction').button({disabled: false});
			$('#ns1blankspaceViewControlActionOptions').button({disabled: false});

			$('#ns1blankspaceControlContext_structure').click(function ()
			{
				ns1blankspace.structureData.init({structure: ns1blankspace.objectContextData.structure});
			})
			
			ns1blankspace.history.view(
			{
				newDestination: 'ns1blankspace.structureData.init({id: ' + ns1blankspace.objectContext + '})',
				move: false
			});
			
			if (ns1blankspace.objectContextData.object != '')
			{
				ns1blankspace.objectContextData.objectView = $.grep(ns1blankspace.views, function (view) {return view.object == ns1blankspace.objectContextData.object})[0];

				if (ns1blankspace.objectContextData.objectView != undefined)
				{
					var oSearch = new AdvancedSearch();
					oSearch.method = ns1blankspace.objectContextData.objectView.endpoint + '_SEARCH';

					if (ns1blankspace.objectContextData.objectView.keyObjectProperties != undefined)
					{
						oSearch.addField(ns1blankspace.objectContextData.objectView.keyObjectProperties);
					}
					else
					{	
						oSearch.addField('reference');
					}

					oSearch.addFilter('id', 'EQUAL_TO', ns1blankspace.objectContextData.objectcontext);
					
					oSearch.getResults(function (oResponse)
					{
						ns1blankspace.objectContextData.object = oResponse.data.rows[0];
						ns1blankspace.history.control({functionDefault: 'ns1blankspace.structureData.summary()'});
					});
				}
				else
				{
					ns1blankspace.history.control({functionDefault: 'ns1blankspace.structureData.summary()'});
				}
			}
			else
			{
				ns1blankspace.history.control({functionDefault: 'ns1blankspace.structureData.summary()'});
			}	
		}	
	},	
		
	summary: 	function ()
	{
		var aHTML = [];
		
		if (ns1blankspace.objectContextData == undefined)
		{
			aHTML.push('<table><tr><td valign="top">Sorry can\'t find this structure data.</td></tr></table>');
					
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
			
			aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">ID</td></tr>' +
							'<tr><td id="ns1blankspaceSummaryID" class="ns1blankspaceSummary">' +
							ns1blankspace.objectContextData.id +
							'</td></tr>');

			aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Last Updated</td></tr>' +
							'<tr><td id="ns1blankspaceSummaryModifiedDate" class="ns1blankspaceSummary">' +
							ns1blankspace.objectContextData.modifieddate +
							'</td></tr>');

			if (ns1blankspace.objectContextData.contactbusinesstext != '')
			{	
				aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Contact (Business)</td></tr>' +
							'<tr><td id="ns1blankspaceSummaryBusiness" class="ns1blankspaceSummary">' +
							ns1blankspace.objectContextData.contactbusinesstext +
							'</td></tr>');
			}						
			
			if (ns1blankspace.objectContextData.contactpersontext != '')
			{	
				aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Contact (Person)</td></tr>' +
							'<tr><td id="ns1blankspaceSummaryPerson" class="ns1blankspaceSummary">' +
							ns1blankspace.objectContextData.contactpersontext +
							'</td></tr>');
			}

			if (ns1blankspace.objectContextData.object != undefined)
			{
				var aKeyObjectProperties = ['Reference'];

				if (ns1blankspace.objectContextData.objectView != undefined)
				{	
					if (ns1blankspace.objectContextData.objectView.keyObjectProperties)
					{
						aKeyObjectProperties = ns1blankspace.objectContextData.objectView.keyObjectProperties.split(',')
					}

					aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Linked to Object</td></tr>');

					aHTML.push('<tr><td id="ns1blankspaceSummaryObject" class="ns1blankspaceSummary ns1blankspaceRowSelect">');

					$.each(aKeyObjectProperties, function (p, property)
					{
						if (ns1blankspace.objectContextData.object[property] != '')
						{
							aHTML.push(ns1blankspace.objectContextData.object[property] + ' ');
						}	
					});
				}	

				aHTML.push('</td></tr>');
			}	

			aHTML.push('</table>');					
			
			$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));

			$('.ns1blankspaceRowSelect').click(function ()
			{
				var oNS = ns1blankspace;

				if (ns1blankspace.objectContextData.objectView.parentNamespace != undefined)
				{
					oNS = oNS[ns1blankspace.objectContextData.objectView.parentNamespace]
				}

				oNS[ns1blankspace.objectContextData.objectView.namespace].init(
				{
					id: ns1blankspace.objectContextData.object.id
				})
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
							'Structure' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceText">' +
							'<input id="ns1blankspaceDetailsStructure" class="ns1blankspaceSelect"' +
								' data-method="SETUP_STRUCTURE_SEARCH"' +
								' data-columns="title">' +
							'</td></tr>');	

			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Title' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceSelect">' +
							'<input id="ns1blankspaceDetailsTitle" class="ns1blankspaceText">' +
							'</td></tr>');			
		
			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Contact Business' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceText">' +
							'<input id="ns1blankspaceDetailsBusiness" class="ns1blankspaceSelect"' +
								' data-method="CONTACT_BUSINESS_SEARCH"' +
								' data-columns="tradename">' +
							'</td></tr>');	
				
			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Contact Person' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceText">' +
							'<input id="ns1blankspaceDetailsPerson" class="ns1blankspaceSelect"' +
								' data-method="CONTACT_PERSON_SEARCH"' +
								' data-columns="surname"' +
								' data-parent="ns1blankspaceDetailsBusiness"' +
								' data-parent-search-id="contactbusiness"' +
								' data-parent-search-text="tradename">' +
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
							'<input type="radio" id="radioStatus2" name="radioStatus" value="2"/>In Progress' +
							'<br /><input type="radio" id="radioStatus1" name="radioStatus" value="1"/>Approved' +
							'</td></tr>');

			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Object' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceSelect">' +
							'<input id="ns1blankspaceDetailsObject" class="ns1blankspaceText">' +
							'</td></tr>');
							
			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Object Context' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceSelect">' +
							'<input id="ns1blankspaceDetailsObjectContext" class="ns1blankspaceText">' +
							'</td></tr>');										
			
			aHTML.push('</table>');					
			
			$('#ns1blankspaceDetailsColumn2').html(aHTML.join(''));
			
			if (ns1blankspace.objectContextData != undefined)
			{
				$('#ns1blankspaceDetailsTitle').val(ns1blankspace.objectContextData.title);
				$('#ns1blankspaceDetailsStructure').val(ns1blankspace.objectContextData.structuretext);
				$('#ns1blankspaceDetailsStructure').attr('data-id', ns1blankspace.objectContextData.structure);
				$('[name="radioStatus"][value="' + ns1blankspace.objectContextData.status + '"]').attr('checked', true);
				$('#ns1blankspaceDetailsBusiness').val(ns1blankspace.objectContextData.contactbusinesstext);
				$('#ns1blankspaceDetailsBusiness').attr('data-id', ns1blankspace.objectContextData.contactbusiness);

				$('#ns1blankspaceDetailsPerson').val(ns1blankspace.objectContextData.contactpersontext);
				$('#ns1blankspaceDetailsPerson').attr('data-id', ns1blankspace.objectContextData.contactperson);

				$('#ns1blankspaceDetailsObject').val(ns1blankspace.objectContextData.object);
				$('#ns1blankspaceDetailsObjectContext').val(ns1blankspace.objectContextData.objectcontext);
			}
			else
			{
				if (ns1blankspace.structureData.data.structure != undefined)
				{
					var oStructure = $.grep(ns1blankspace.structureData.data.structures, function (structure) {return structure.id == ns1blankspace.structureData.data.structure})[0];
					$('#ns1blankspaceDetailsStructure').val(oStructure.title);
					$('#ns1blankspaceDetailsStructure').attr('data-id', oStructure.id);
				}	

				$('[name="radioStatus"][value="2"]').attr('checked', true);	
			}
		}	
	},

	save: 		
	{
		send: 		function (oParam, oResponse)
		{
			if (oResponse == undefined)
			{
				ns1blankspace.status.working();
				
				var oData = {};
				
				if (ns1blankspace.objectContext != -1)
				{
					oData.id = ns1blankspace.objectContext;
				}
				else
				{
					oData.object = 26;
					oData.objectcontext = $('#ns1blankspaceDetailsStructure').attr('data-id');
				}	
				
				if ($('#ns1blankspaceMainDetails').html() != '')
				{
					var sTitle = $('#ns1blankspaceDetailsTitle').val();
					if (sTitle == '') {sTitle = $('#ns1blankspaceDetailsStructure').val() + ' data'}
					oData.structure = $('#ns1blankspaceDetailsStructure').attr('data-id');
					oData.title = sTitle;
					oData.status = $('input[name="radioStatus"]:checked').val();	
					oData.contactbusiness = $('#ns1blankspaceDetailsBusiness').attr('data-id');
					oData.contactperson = $('#ns1blankspaceDetailsPerson').attr('data-id');
					oData.object = $('#ns1blankspaceDetailsObject').val();
					oData.objectcontext = $('#ns1blankspaceDetailsObjectContext').val();
				};
				
				$.ajax(
				{
					type: 'POST',
					url: ns1blankspace.util.endpointURI('STRUCTURE_DATA_MANAGE'),
					data: oData,
					dataType: 'json',
					success: function(data) {ns1blankspace.structureData.save.send(oParam, data)}
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

						var oData = 
						{
							id: ns1blankspace.objectContext,
							object: 41,
							objectcontext: ns1blankspace.objectContext
						}

						$.ajax(
						{
							type: 'POST',
							url: ns1blankspace.util.endpointURI('STRUCTURE_DATA_MANAGE'),
							data: oData,
							dataType: 'json',
							success: function(data)
							{
								ns1blankspace.structureData.init({id: ns1blankspace.objectContext})
							}
						});
					}	
				}
				else
				{
					ns1blankspace.status.message('Could not save the data!');
				}
			}
		}
	},
				
	elements: 	
	{							
		init:		function (oParam, oResponse)
		{
			if (oResponse == undefined)
			{
				ns1blankspace.structureData.data.category = undefined;

				var oSearch = new AdvancedSearch();
				oSearch.method = 'SETUP_STRUCTURE_CATEGORY_SEARCH';
				oSearch.addField( 'description,displayorder,id,structure,structuretext,title,type,typetext');
				oSearch.addFilter('structure', 'EQUAL_TO', ns1blankspace.objectContextData.structure);
				oSearch.getResults(function(data) {ns1blankspace.structureData.elements.init(oParam, data)}) 
			}
			else
			{
				var aHTML = [];
				
				aHTML.push('<table id="ns1blankspaceElementCategories">');
				
				if (oResponse.data.rows.length == 0)
				{
					aHTML.push('<table><tr><td valign="top">No categories</td></tr></table>');

					$('#ns1blankspaceMainElement').html(aHTML.join(''));
				}
				else if (oResponse.data.rows.length == 1)
				{
					aHTML.push('<table class="ns1blankspaceContainer" >' +
								'<tr class="ns1blankspaceContainer">' +
								'<td id="ns1blankspaceElementColumnElement" style="width: 450px" class="ns1blankspaceColumn2"></td>' +
								'<td id="ns1blankspaceElementColumnEdit" class="ns1blankspaceColumn2"></td>' +
								'</tr>' +
								'</table>');					
				
					$('#ns1blankspaceMainElement').html(aHTML.join(''));

					ns1blankspace.structureData.elements.show({xhtmlElementID: 'ns1blankspaceElementColumnElement'});
				}
				else
				{
					aHTML.push('<table class="ns1blankspaceContainer" >' +
								'<tr class="ns1blankspaceContainer">' +
								'<td id="ns1blankspaceElementColumnCategory" style="width: 120px" class="ns1blankspaceColumn1"></td>' +
								'<td id="ns1blankspaceElementColumnElement" style="width: 350px" class="ns1blankspaceColumn2"></td>' +
								'<td id="ns1blankspaceElementColumnEdit" class="ns1blankspaceColumn2"></td>' +
								'</tr>' +
								'</table>');					
				
					$('#ns1blankspaceMainElement').html(aHTML.join(''));

					var aHTML = [];

					aHTML.push('<table>');

					$.each(oResponse.data.rows, function()
					{
						aHTML.push('<tr class="ns1blankspaceRow">');
										
						aHTML.push('<td id="ns1blankspaceStructureDataCategory_title-' + this.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
												this.title + '</td>');
												
						aHTML.push('</tr>');
					});
					
					aHTML.push('</table>');

					$('#ns1blankspaceElementColumnCategory').html(aHTML.join(''));
		
					$('td.ns1blankspaceRowSelect').click(function(event)
					{
						var sXHTMLElementId = event.target.id;
						var aId = sXHTMLElementId.split('-');
						
						ns1blankspace.structureData.elements.show({xhtmlElementID: 'ns1blankspaceElementColumnElement', category: aId[1]});
					});
				}

				
			}	
		},

		show:		function (oParam, oResponse)
		{
			var iObjectContext = ns1blankspace.objectContext;
			var iValue = ns1blankspace.util.getParam(oParam, 'value').value;
			ns1blankspace.structureData.data.category = ns1blankspace.util.getParam(oParam, 'category').value;

			if (oParam != undefined)
			{
				if (oParam.objectContext != undefined) {iObjectContext = oParam.objectContext}
				if (oParam.options != undefined) {oOptions = oParam.options}
				if (oParam.actions != undefined) {oActions = oParam.actions}
			}		
				
			if (oResponse == undefined)
			{	
				if (iValue == undefined)
				{	
					var aHTML = [];

					aHTML.push('<table class="ns1blankspaceColumn2">' +
									'<tr><td>' +
									'<span id="ns1blankspaceElementEdit" class="ns1blankspaceAction">Add</span>' +
									'</td></tr></table>');					
					
					$('#ns1blankspaceElementColumnEdit').html(aHTML.join(''));
				
					$('#ns1blankspaceElementEdit').button(
					{
						label: "Add"
					})
					.click(function()
					{
						 ns1blankspace.structureData.elements.edit(oParam);
					})
					.css('width', '55px');
				}	

				var oSearch = new AdvancedSearch();
				oSearch.method = 'STRUCTURE_DATA_VALUE_SEARCH';
				oSearch.addField('structuredata,date,element,elementtext,formattedvalue,option,optiontext,points,text,modifieddate,' +
									'structuredatavalue.element.datatype,structuredatavalue.element.alias');
				oSearch.addFilter('structuredata', 'EQUAL_TO', ns1blankspace.objectContext);

				if (ns1blankspace.structureData.data.category != undefined)
				{	
					oSearch.addFilter('structuredatavalue.element.category', 'EQUAL_TO', ns1blankspace.structureData.data.category);
				}	
				oSearch.rows = 250;
				oSearch.sort('id', 'asc');
				oSearch.getResults(function (data)
				{
					ns1blankspace.structureData.elements.show(oParam, data)
				});
			}
			else
			{
				var aHTML = [];
				
				if (oResponse.data.rows.length == 0)
				{
					aHTML.push('<table><tr><td class="ns1blankspaceNothing">No values</td></tr></table>');

					$('#ns1blankspaceElementColumnElement').html(aHTML.join(''));
				}
				else
				{
					aHTML.push('<table class="' + (ns1blankspace.structureData.data.category!=undefined?'ns1blankspaceColumn2':'') + '">');

					var sClass;
					
					$.each(oResponse.data.rows, function()
					{
						aHTML.push('<tr class="ns1blankspaceRow">');
															
						aHTML.push('<td id="ns1blankspaceStructureDataCategoryElement_property-' + this.id + '" class="ns1blankspaceRow" style="width:120px;">' +
												'<div>' + this.elementtext + '</div>' + 
												'<div class="ns1blankspaceSubNote">' + this['structuredatavalue.element.alias'].replace('se', '') + '</div>' +
												'</td>');

						aHTML.push('<td id="ns1blankspaceStructureDataCategoryElement_value' + this.id + '" class="ns1blankspaceRow">' +
												(this.formattedvalue==''?this.text:this.formattedvalue) + '</td>');
												
						aHTML.push('<td style="width:60px; text-align:right;" class="ns1blankspaceRow">');
							
						aHTML.push('<span id="ns1blankspaceStructureDataCategoryoptions_remove-' + this.id + '" class="ns1blankspaceRowRemove"></span>');
						aHTML.push('<span id="ns1blankspaceStructureDataCategory_options_edit-' + this.id + '"' +
										' data-type="' + this['structuredatavalue.element.datatype'] + '"' +
										' data-valuetext="' + (this.formattedvalue==''?this.text:this.formattedvalue) + '"' +
										' data-value="' + (this.option) + '"' +
										' data-element="' + (this.element) + '"' +
										' class="ns1blankspaceRowEdit"></span>');
						
						aHTML.push('</td>');			
						aHTML.push('</tr>');
					});
					
					aHTML.push('</table>');

					$('#ns1blankspaceElementColumnElement').html(aHTML.join(''));
					
					$('.ns1blankspaceRowRemove').button(
					{
						text: false,
						icons: {
							primary: "ui-icon-close"
						}
					})
					.click(function()
					{
						ns1blankspace.remove(
						{
							xhtmlElementID: this.id,
							method: 'STRUCTURE_DATA_VALUE_MANAGE',
							ifNoneMessage: 'No values.',
							minimumSiblings: 0
						});
					})
					.css('width', '15px')
					.css('height', '17px');
				
					$('.ns1blankspaceRowEdit').button(
					{
						text: false,
						icons:
						{
							primary: "ui-icon-pencil"
						}
					})
					.click(function()
					{
						ns1blankspace.structureData.elements.edit(
						{
							xhtmlElementID: this.id,
							dataType: $(this).attr('data-type'),
							dataValue: $(this).attr('data-value'),
							dataValueText: $(this).attr('data-valuetext'),
							element: $(this).attr('data-element')
						});
					})
					.css('width', '15px')
					.css('height', '17px');

					if (iValue != undefined)
					{
						$('#ns1blankspaceStructureDataCategory_options_edit-' + iValue).click();
					}	
				}
			}	
		},

		edit:		function (oParam)
		{
			var sID; 
			
			var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;
			var iDataType = ns1blankspace.util.getParam(oParam, 'dataType').value;
			var sDataValue = ns1blankspace.util.getParam(oParam, 'dataValue', {"default": ''}).value;
			var sDataValueText = ns1blankspace.util.getParam(oParam, 'dataValueText').value;
			var iElement = ns1blankspace.util.getParam(oParam, 'element').value;

			if (sXHTMLElementID != undefined)
			{
				var aXHTMLElementID = sXHTMLElementID.split('-');
				var sID = aXHTMLElementID[1];
			}	
		
			var aHTML = [];
				
			aHTML.push('<table class="ns1blankspaceColumn2">');
					
			aHTML.push('<tr><td>' +
							'<span id="ns1blankspaceStructureDataElementSave" class="ns1blankspaceAction">Save</span>' +
							'</td></tr>');
									
			if (sID == undefined)
			{
				aHTML.push('<tr><td class="ns1blankspaceSelect">' +
								'<input id="ns1blankspaceStructureDataElement" class="ns1blankspaceSelect"' +
								'data-method="SETUP_STRUCTURE_ELEMENT_SEARCH" ' +
								'data-methodfilter="structure-EQUAL_TO-' + ns1blankspace.objectContextData.structure) 

				if (ns1blankspace.structureData.data.category != undefined)
				{	
					aHTML.push('|category-EQUAL_TO-' + ns1blankspace.structureData.data.category);
				}					

				aHTML.push('"></td></tr>');
			}
			else
			{					
				if (iDataType == 1)
				{
					aHTML.push('<tr><td class="ns1blankspaceText">' +
									'<textarea rows="14" cols="35" id="ns1blankspaceStructureDataElementValue" ' +
									' style="width:96%;" class="ns1blankspaceTextMult">' +
									sDataValueText + '</textarea></td></tr>');
				}
				else
				{
					var sClass = 'ns1blankspaceText';	
					var aOtherAttributes = [];

					if (iDataType == 3 || iDataType == 7)
					{	
						sClass = 'ns1blankspaceDate';
					}

					if (iDataType == 2)
					{
						sClass = 'ns1blankspaceSelect';
						aOtherAttributes.push('data-method="SETUP_STRUCTURE_ELEMENT_OPTION_SEARCH" ');
						aOtherAttributes.push('data-methodfilter="element-EQUAL_TO-' + iElement + '" ');
						aOtherAttributes.push('data-id="' + sDataValue + '"');
					}
					
					aHTML.push('<tr><td class="ns1blankspaceText">' +
									'<input id="ns1blankspaceStructureDataElementValue" class="' + sClass + '"' +
									' value="' + sDataValueText + '"' +
									aOtherAttributes.join(''));

					aHTML.push('></td></tr>');
				}	
			}

			aHTML.push('</table>');					
			
			$('#ns1blankspaceElementColumnEdit').html(aHTML.join(''));
			

			if (sClass == 'ns1blankspaceDate')
			{
				ns1blankspace.util.initDatePicker();
			}

			$('#ns1blankspaceStructureDataElementSave').button(
			{
				text: "Save"
			})
			.click(function() 
			{
				var oData = 
				{
					structuredata: ns1blankspace.objectContext
				}

				if (iDataType == 3 || iDataType == 7)
				{
					oData.date = $('#ns1blankspaceStructureDataElementValue').val();
				}
				else if (iDataType == 1 || iDataType == 4)
				{
					oData.text = $('#ns1blankspaceStructureDataElementValue').val();
				}
				else if (iDataType == 5)
				{
					oData.number = $('#ns1blankspaceStructureDataElementValue').val();
				}
				else if (iDataType == 2)
				{
					oData.option = $('#ns1blankspaceStructureDataElementValue').attr('data-id');
				}

				if (sID == undefined)
				{
					oData.element = $('#ns1blankspaceStructureDataElement').attr('data-id')
				}
				else
				{
					oData.id = sID;
				}	
				
				$.ajax(
				{
					type: 'POST',
					url: ns1blankspace.util.endpointURI('STRUCTURE_DATA_VALUE_MANAGE'),
					data: oData,
					dataType: 'json',
					success: function(oResponse)
					{
						ns1blankspace.status.message('Saved');
						ns1blankspace.structureData.elements.show(
						{
							category: ns1blankspace.structureData.data.category,
							value: oResponse.id
						});
					}
				});
			});
				
			$('#ns1blankspaceStructureDataElementCancel').button(
			{
				text: "Cancel"
			})
			.click(function() 
			{
				$('#ns1blankspaceElementColumnEdit').html('');
			});
		}
	},				

	debug: 		
	{
		test: 		function ()
		{
			var oData = {
							"fields": 	[
											{
												"name": "contactbusiness"
											}
										],

							"filters": 	[],

							"options": 	{
											"rf": "JSON",
											"rows": "100"
										}		
						}

			$.ajax({
				url: ns1blankspace.util.endpointURI('STRUCTURE_DATA_SEARCH') + '&advanced=1',
				type: 'POST',
				cache: false,
				dataType: 'json',
				data: JSON.stringify(oData),
				success: function(response) {}
			});			

		}
	},

	cache:		
	{
		data: {},

		init: 			function (oParam, oResponse)
		{
			var iID = ns1blankspace.util.getParam(oParam, 'id').value;
			var iIndex = ns1blankspace.util.getParam(oParam, 'index', {"default": 1}).value;
			var iCountDownStart = ns1blankspace.util.getParam(oParam, 'iCountDownStart', {"default": 10}).value;

			if (ns1blankspace.structureData.cache.data.values !== undefined)
			{
				ns1blankspace.structureData.cache.structureData(oParam);
			}	
			else
			{	
				ns1blankspace.util.whenCan.execute(
				{
					now:
					{
						method: ns1blankspace.util.protect.decrypt,
						param:
						{
							cryptoKeyReference: ns1blankspace.util.local.cache.data.cryptoKeyReference,
							cryptoKey: ns1blankspace.util.protect.key.data[ns1blankspace.util.local.cache.data.cryptoKeyReference],
							protectedData: sData
						}
					},
					then:
					{
						comment: 'util.protect.decrypt<>util.local.cache.search',
						method: (bAdvanced?ns1blankspace.util.local.db.search:ns1blankspace.util.local.cache.search),
						set: 'data',
						param: oParam
					}	
				});
				
				
				if (ns1blankspace.structureData.cache.data.raw == undefined)
				{
					ns1blankspace.status.working('Getting data... <span id="countDown" style="font-weight:bold;"></span>')
					ns1blankspace.structureData.cache.data.raw = [];
					iID = 0;
				}

				$('#countDown').html((iCountDownStart-iIndex).toFixed(0));

				if (oResponse==undefined)
				{
					var oSearch = new AdvancedSearch();
					oSearch.method = 'STRUCTURE_DATA_VALUE_SEARCH';
					oSearch.addField('structuredata,date,element,elementtext,formattedvalue,option,optiontext,points,text,modifieddate');
					oSearch.addFilter('structuredatavalue.element.structure', 'IN_LIST', ns1blankspace.option.defaultStructures.join(','));
					oSearch.addFilter('id', 'GREATER_THAN', iID);
					oSearch.rows = 250;
					oSearch.sort('id', 'asc');
					oSearch.getResults(function (data)
					{
						ns1blankspace.structureData.cache.init(oParam, data)}
					);
				}	
				else
				{
					ns1blankspace.structureData.cache.data.raw =
							ns1blankspace.structureData.cache.data.raw.concat(oResponse.data.rows);

					if (oResponse.morerows == "true")
					{
						var oRow = oResponse.data.rows.pop();

						iID = oRow.id;
						oParam = ns1blankspace.util.setParam(oParam, 'id', iID);
						oParam = ns1blankspace.util.setParam(oParam, 'index', iIndex + 1)
						ns1blankspace.structureData.cache.init(oParam);
					}	
					else
					{		
						ns1blankspace.status.working('Analysing...');

						delete oParam.id;
						delete oParam.index;

						ns1blankspace.structureData.cache.structureData(oParam);
					}	
				}
			}	
		},

		notes: 			function (oParam, oResponse)
		{
			var iID = ns1blankspace.util.getParam(oParam, 'id').value;
			var iIndex = ns1blankspace.util.getParam(oParam, 'index', {"default": 1}).value;

			ns1blankspace.status.working('Getting notes...');

			if (ns1blankspace.structureData.cache.data.notes !== undefined)
			{
				ns1blankspace.structureData.cache.structureData(oParam);
			}	
			else
			{	
				ns1blankspace.status.working('Getting notes... ' + (iIndex/11*100).toFixed(0) + '%');

				if (ns1blankspace.structureData.cache.data._notes == undefined)
				{
					ns1blankspace.structureData.cache.data._notes = [];
					iID = 0
				}

				if (oResponse==undefined)
				{
					var oSearch = new AdvancedSearch();
					oSearch.method = 'STRUCTURE_DATA_NOTE_SEARCH';
					oSearch.addField('element,notes,text,modifieddate,structuredata');
					oSearch.addFilter('structuredatanote.element.structure', 'IN_LIST', ns1blankspace.option.defaultStructures.join(','));
					oSearch.addFilter('id', 'GREATER_THAN', iID);
					oSearch.rows = 250;
					oSearch.sort('id', 'asc');
					oSearch.getResults(function (data)
					{
						ns1blankspace.structureData.cache.notes(oParam, data)}
					);
				}	
				else
				{
					ns1blankspace.structureData.cache.data._notes =
							ns1blankspace.structureData.cache.data._notes.concat(oResponse.data.rows);

					if (oResponse.morerows == "true")
					{
						var oRow = oResponse.data.rows.pop();

						iID = oRow.id;
						oParam = ns1blankspace.util.setParam(oParam, 'id', iID);
						oParam = ns1blankspace.util.setParam(oParam, 'index', iIndex + 1)
						ns1blankspace.structureData.cache.notes(oParam);
					}	
					else
					{		
						ns1blankspace.status.working('Checking...');

						delete oParam.id;

						ns1blankspace.structureData.cache.data.notes = $.extend(true, [], ns1blankspace.structureData.cache.data._notes);
						delete ns1blankspace.structureData.cache.data._notes;

						ns1blankspace.structureData.cache.structureData(oParam);
					}	
				}
			}	
		},				

		structureData: 	function (oParam, oResponse)
		{
			if (ns1blankspace.structureData.cache.data.structuredata !== undefined)
			{
				ns1blankspace.structureData.cache.elements(oParam);
			}	
			else
			{	
				if (oResponse==undefined)
				{
					var oSearch = new AdvancedSearch();
					oSearch.method = 'STRUCTURE_DATA_SEARCH';
					oSearch.addField('title,totalpoints,resultscore,resultscoretext,contactbusiness,object,objectcontext,status,statustext,' +
										'structure,structuredata.contactbusiness.tradename,structuredata.contactbusiness.se13417,structuredata.contactbusiness.se13421text,' +
										'structuredata.contactbusiness.se13418,' +
										'structuredata.contactbusiness.streetregion');
					oSearch.addFilter('structuredata.contactbusiness.CustomerStatus', 'EQUAL_TO', 1);
					oSearch.sort('modifieddate', 'desc');
					oSearch.rows = 250;
					oSearch.getResults(function (data)
					{
						ns1blankspace.structureData.cache.structureData(oParam, data)}
					);
				}	
				else
				{
					ns1blankspace.structureData.cache.data.structuredata = oResponse.data.rows;
					ns1blankspace.structureData.cache.elements(oParam);
				}
			}	
		},		

		elements: 		function (oParam)
		{
			if (ns1blankspace.structureData.cache.data.elements !== undefined)
			{
				ns1blankspace.structureData.cache.groups(oParam);
			}
			else
			{
				var oSearch = new AdvancedSearch();
				oSearch.method = 'SETUP_STRUCTURE_ELEMENT_SEARCH';
				oSearch.addField('backgroundcolour,caption,category,categorytext,datatype,datatypetext,' +
									'description,displayorder,hint,id,notes,notestype,notestypetext,' +
									'reference,structure,structuretext,textcolour,title');
				oSearch.rows = 250;
				oSearch.addFilter('structure', 'IN_LIST', ns1blankspace.option.defaultStructures.join(','));
				oSearch.sort('displayorder', 'asc');
				oSearch.getResults(function(oResponse)
				{
					ns1blankspace.structureData.cache.data.elements = oResponse.data.rows;

					var oSearch = new AdvancedSearch();
					oSearch.method = 'SETUP_STRUCTURE_ELEMENT_OPTION_SEARCH';
					oSearch.addField('defaultvalue,displayorder,element,elementtext,internalreference,points,title');
					oSearch.rows = 250;
					oSearch.addFilter('structureelementoption.structureelement.structure', 'IN_LIST', ns1blankspace.option.defaultStructures.join(','));
					oSearch.sort('points', 'asc');
					oSearch.getResults(function(oResponse)
					{
						$.each(ns1blankspace.structureData.cache.data.elements, function (i, element)
						{
							element.options = $.grep(oResponse.data.rows, function (row) {return row.element==element.id})
						});

						ns1blankspace.structureData.cache.data.categories = $.map(
						ns1blankspace.util.unique(
						{
							data: ns1blankspace.structureData.cache.data.elements,
							key: 'category'
						}),
						function (v)
						{
							return ({id: v.category, text: v.categorytext})
						});

						ns1blankspace.structureData.cache.groups(oParam);
					});
				});
			}
		},

		groups: 		function (oParam, oResponse)
		{
			if (ns1blankspace.structureData.cache.data.groups !== undefined)
			{
				ns1blankspace.structureData.cache.attachments(oParam);
			}	
			else
			{	
				if (oResponse==undefined)
				{
					var oSearch = new AdvancedSearch();
					oSearch.method = 'SETUP_STRUCTURE_DATA_GROUP_SEARCH';
					oSearch.addField('backgroundcolour,description,document,documenttext,groupingfactor,' +
										'maximumpoints,minimumpoints,structure,structuretext,textcolour,title,type,typetext');
					oSearch.addFilter('structure', 'IN_LIST', ns1blankspace.option.defaultStructures.join(','))
					oSearch.rows = 250;
					oSearch.getResults(function (data)
					{
						ns1blankspace.structureData.cache.groups(oParam, data)}
					);
				}	
				else
				{
					ns1blankspace.structureData.cache.data.groups = oResponse.data.rows;
					ns1blankspace.structureData.cache.attachments(oParam);
				}
			}	
		},

		attachments: 	function (oParam, oResponse)
		{
			if (ns1blankspace.structureData.cache.data.attachments !== undefined)
			{
				ns1blankspace.structureData.cache.complete(oParam);
			}	
			else
			{	
				if (oResponse==undefined)
				{
					var oSearch = new AdvancedSearch();
					oSearch.method = 'CORE_ATTACHMENT_SEARCH';
					oSearch.addField('type,filename,description,download,object,objectcontext,title');
					oSearch.addFilter('filename', 'TEXT_IS_LIKE', 'afi-policy-profile')
					oSearch.rows = 50;
					oSearch.getResults(function (data)
					{
						ns1blankspace.structureData.cache.attachments(oParam, data)}
					);
				}	
				else
				{
					ns1blankspace.structureData.cache.data.attachments = oResponse.data.rows;
					ns1blankspace.structureData.cache.complete(oParam);
				}
			}	
		},											

		complete: 		function (oParam)
		{
			ns1blankspace.status.message('Complete');
			ns1blankspace.util.onComplete(oParam);
		}
	},

	access: 	
	{
		show: 		function (oParam, oResponse)
		{
			if (oResponse == undefined)
			{
				$vq.init('<table class="ns1blankspaceMain">' +
								'<tr class="ns1blankspaceRow">' +
								'<td id="ns1blankspaceAccessColumn1" class="ns1blankspaceColumn1Large"></td>' +
								'<td id="ns1blankspaceAccessColumn2" class="ns1blankspaceColumn2Action" style="width:270px;"></td>' +
								'</tr>' +
								'</table>');				

				$vq.render('#ns1blankspaceMainAccess');

				$vq.init('<table class="ns1blankspaceColumn2">');
				
				$vq.add('<tr><td>' +
								'<span id="ns1blankspaceUserRoleAccessEdit" class="ns1blankspaceAction">Add</span>' +
								'</td></tr>');

				$vq.add('<tr><td style="padding-top:12px;" class="ns1blankspaceSubNote">' +
								'By default all data is available to any user that has functional access to it.' +
								' You can use this area to set up restricted access to specific data.' +
								'</td></tr>');

				$vq.add('<tr><td style="padding-top:12px;" class="ns1blankspaceSubNote">' +
								'<a href="http://mydigitalstructure.com/gettingstarted_responsive_controls" target="_blank">More on data access control.</a>' +
								'</td></tr>');
								
				$vq.add('</table>');					
				
				$vq.render('#ns1blankspaceAccessColumn2');

				$('#ns1blankspaceUserRoleAccessEdit').button(
				{
					label: "Add"
				})
				.click(function()
				{
					 ns1blankspace.structureData.access.edit();
				})

				var oSearch = new AdvancedSearch();
				oSearch.method = 'SETUP_ROLE_OBJECT_ACCESS_SEARCH';
				oSearch.addField('canremove,cansearch,canupdate,notes,role,roletext,createduser,createdusertext,createddate');
				oSearch.addFilter('object', 'EQUAL_TO', ns1blankspace.object);
				oSearch.addFilter('objectcontext', 'EQUAL_TO', ns1blankspace.objectContext);
				oSearch.rows = ns1blankspace.option.defaultRows;
				oSearch.sort('roletext', 'desc');
				oSearch.getResults(function(data) {ns1blankspace.structureData.access.show(oParam, data)});
			}
			else
			{
				var aHTML = [];

				if (oResponse.data.rows.length == 0)
				{
					aHTML.push('<table><tr><td class="ns1blankspaceNothing">No data access roles set up.</td></tr></table>');

					aHTML.push('</table>');

					$('#ns1blankspaceAccessColumn1').html(aHTML.join(''));
				}
				else
				{		
					aHTML.push('<table id="ns1blankspaceStructureDataAccess" class="ns1blankspaceContainer" style="font-size:0.875em;">');
					
					aHTML.push('<tr class="ns1blankspaceCaption">');
					aHTML.push('<td class="ns1blankspaceHeaderCaption">Role</td>');
					aHTML.push('<td class="ns1blankspaceHeaderCaption">Notes</td>');
					aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:center;">Search</td>');
					aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:center;">Update</td>');
					aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:center;">Remove</td>');
					aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:center;">&nbsp;</td>');
					aHTML.push('</tr>');

					$.each(oResponse.data.rows, function()
					{
						aHTML.push(ns1blankspace.structureData.access.row(this));
					});
						
					aHTML.push('</table>');
					
					ns1blankspace.render.page.show(
					{
						xhtmlElementID: 'ns1blankspaceAccessColumn1',
						xhtmlContext: 'UserRoleAccess',
						xhtml: aHTML.join(''),
						showMore: (oResponse.morerows == "true"),
						more: oResponse.moreid,
						rows: ns1blankspace.option.defaultRows,
						functionShowRow: ns1blankspace.structureData.access.row,
						functionOnNewPage: ns1blankspace.structureData.access.bind,
						headerRow: true,
					});
				}
			}
		},		

		row:		function (oRow)
		{
			var aHTML = [];

			aHTML.push('<tr class="ns1blankspaceRow">');
			aHTML.push('<td id="ns1blankspaceUserRoleAccess_role-' + oRow.id + '" class="ns1blankspaceRow"' +
									' data-object="' + oRow.role + '"' +
									' data-objectcontext="' + oRow.roletext + '">' +
									oRow.roletext + '</td>');
			aHTML.push('<td id="ns1blankspaceUserRoleAccess_notes-' + oRow.id + '" class="ns1blankspaceRow">' +
									oRow.notes + '</td>');
			aHTML.push('<td id="ns1blankspaceUserRoleAccess_search-' + oRow.id + '" class="ns1blankspaceRow" style="text-align:center;">' +
									(oRow.cansearch=='N'?'No':'Yes') + '</td>');
			aHTML.push('<td id="ns1blankspaceUserRoleAccess_update-' + oRow.id + '" class="ns1blankspaceRow" style="text-align:center;">' +
									(oRow.canupdate=='N'?'No':'Yes') + '</td>');
			aHTML.push('<td id="ns1blankspaceUserRoleAccess_remove-' + oRow.id + '" class="ns1blankspaceRow" style="text-align:center;">' +
									(oRow.canremove=='N'?'No':'Yes') + '</td>');

			aHTML.push('<td style="width:60px; text-align:right;" class="ns1blankspaceRow">');
				
			aHTML.push('<span id="ns1blankspaceStructureDataAccess_remove-' + oRow.id + '" class="ns1blankspaceRowRemove"></span>');
			aHTML.push('<span id="ns1blankspaceStructureDataAccess_edit-' + oRow.id + '"' +
							' data-role="' + oRow.role + '"' +
							' data-roletext="' + oRow.roletext + '"' +
							' data-cansearch="' + oRow.cansearch + '"' +
							' data-canupdate="' + oRow.canupdate + '"' +
							' data-canremove="' + oRow.canremove + '"' +
							' class="ns1blankspaceRowEdit"></span>');
			
			aHTML.push('</td>');			

			aHTML.push('</tr>');

			return aHTML.join('');						
		},

		bind:  		function (oParam)
		{
			$('#ns1blankspaceStructureDataAccess .ns1blankspaceRowRemove').button(
			{
				text: false,
				icons: {
					primary: "ui-icon-close"
				}
			})
			.click(function()
			{
				ns1blankspace.remove(
				{
					xhtmlElementID: this.id,
					method: 'SETUP_ROLE_OBJECT_ACCESS_MANAGE',
					ifNoneMessage: 'No access rules.',
					minimumSiblings: 1
				});
			})
			.css('width', '15px')
			.css('height', '17px');
		
			$('#ns1blankspaceStructureDataAccess .ns1blankspaceRowEdit').button(
			{
				text: false,
				icons:
				{
					primary: "ui-icon-pencil"
				}
			})
			.click(function()
			{
				ns1blankspace.structureData.access.edit(
				{
					xhtmlElementID: this.id,
					role: $(this).attr('data-role'),
					roletext: $(this).attr('data-roletext'),
					cansearch: $(this).attr('data-cansearch'),
					canupdate: $(this).attr('data-canupdate'),
					canremove: $(this).attr('data-canremove')
				});
			})
			.css('width', '15px')
			.css('height', '17px');
		},

		edit: 	function (oParam)
		{
			var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;
			var sID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 1, "default": ''}).value;

			$vq.init('<table class="ns1blankspaceColumn2">');
					
			$vq.add('<tr><td><span id="ns1blankspaceStructureDataAccessSave" class="ns1blankspaceAction">Save</span>' +
						'</td></tr>');
									
			$vq.add('<tr><td class="ns1blankspaceCaption">Role</td></tr>' +
						'<tr><td class="ns1blankspaceSelect">' +
						'<input id="ns1blankspaceStructureDataAccessRole" class="ns1blankspaceSelect"' +
						'data-method="SETUP_ROLE_SEARCH"></td></tr>');

			$vq.add('<tr><td class="ns1blankspaceCaption">' +
						'Search?' +
						'</td></tr>' +
						'<tr class="ns1blankspace">' +
						'<td class="ns1blankspaceRadio">' +
						'<input type="radio" id="radioCanSearchY" name="radioCanSearch" value="Y"/>Yes' +
						'<br /><input type="radio" id="radioCanSearchN" name="radioCanSearch" checked="checked" value="N"/>No' +
						'</td></tr>');

			$vq.add('<tr><td class="ns1blankspaceCaption">' +
						'Update?' +
						'</td></tr>' +
						'<tr class="ns1blankspace">' +
						'<td class="ns1blankspaceRadio">' +
						'<input type="radio" id="radioCanUpdateY" name="radioCanUpdate" value="Y"/>Yes' +
						'<br /><input type="radio" id="radioCanUpdateN" name="radioCanUpdate" checked="checked" value="N"/>No' +
						'</td></tr>');

			$vq.add('<tr><td class="ns1blankspaceCaption">' +
						'Remove?' +
						'</td></tr>' +
						'<tr class="ns1blankspace">' +
						'<td class="ns1blankspaceRadio">' +
						'<input type="radio" id="radioCanRemoveY" name="radioCanRemove" value="Y"/>Yes' +
						'<br /><input type="radio" id="radioCanRemoveN" name="radioCanRemove" checked="checked" value="N"/>No' +
						'</td></tr>');
			
			$vq.add('</table>');					
			
			$vq.render('#ns1blankspaceAccessColumn2');

			if (sID != '')
			{
				$('#ns1blankspaceStructureDataAccessRole').val(oParam.roletext);
				$('#ns1blankspaceStructureDataAccessRole').attr('data-id', oParam.role);
				$('#radioCanRemove' + oParam.canremove).attr('checked', true);
				$('#radioCanUpdate' + oParam.canupdate).attr('checked', true);
				$('#radioCanSearch' + oParam.cansearch).attr('checked', true);
			}	

			$('#ns1blankspaceStructureDataAccessSave').button(
			{
				text: "Save"
			})
			.click(function() 
			{
				ns1blankspace.status.working();

				var oData = 
				{
					id: sID,
					object: ns1blankspace.object,
					objectcontext: ns1blankspace.objectContext,
					role: $('#ns1blankspaceStructureDataAccessRole').attr('data-id'),
					canremove: $('input[name="radioCanRemove"]:checked').val(),
					canupdate: $('input[name="radioCanUpdate"]:checked').val(),
					cansearch: $('input[name="radioCanSearch"]:checked').val()
				}

				$.ajax(
				{
					type: 'POST',
					url: ns1blankspace.util.endpointURI('SETUP_ROLE_OBJECT_ACCESS_MANAGE'),
					data: oData,
					dataType: 'json',
					success: function(data)
					{
						if (data.status == "OK")
						{
							ns1blankspace.status.message('Saved');
							ns1blankspace.structureData.access.show(oParam);
						}
						else
						{
							ns1blankspace.status.error(data.error.errornotes);
						}
					}
				});
			});
		}					
	},														

	util: 		
	{
		clean:  		function (oParam)
		{
			var aData;
			var aCleanData = [];
			var aStructureDataIDs;

			if (oParam != undefined)
			{
				if (oParam.data != undefined) {aData = oParam.data}
				if (oParam.structureDataIDs != undefined) {aStructureDataIDs = oParam.structureDataIDs}	

				$.each(aData, function(i, data)
				{
					if (aStructureDataIDs.indexOf(data.structuredata) != -1)
					{
						if (data.structureelement.hint == 'multi' || data.structureelement.datatype == 7)
						{	
							if ($.grep(aCleanData, function (cData) {return cData.element==data.element && cData.structuredata==data.structuredata && data.option==cData.option}).length==0)
							{
								aCleanData.push(data);
							}
						}
						else
						{
							if ($.grep(aCleanData, function (cData) {return cData.element==data.element && cData.structuredata==data.structuredata}).length==0)
							{
								aCleanData.push(data);
							}
						}	
					}	
				});

				return aCleanData;
			}		
		},

		reduce: 		function (oParam)
		{
			var iElement = ns1blankspace.util.getParam(oParam, 'element').value;
			var aStructureDataIDs = ns1blankspace.util.getParam(oParam, 'structureDataIDs').value;
			var aReduce = [];

			if (iElement != undefined)
			{	
				var oElement = $.grep(ns1blankspace.structureData.cache.data.elements, function (element) {return element.id==iElement})[0];
				var aValues = $.grep(ns1blankspace.structureData.cache.data.values, function (value) {return value.element==iElement});

				$.each(oElement.options, function (o, option)
				{	
					aReduce.push({element: iElement, option: option.id, text: option.title, count: 0, structuredataids: []})
				});

				if (aStructureDataIDs != undefined)
				{
					aValues = $.grep(aValues, function (value) {return aStructureDataIDs.indexOf(value.structuredata) != -1})
				}

				$.each(aValues, function (i, value)
				{	
					var aOption = $.grep(aReduce, function (reduce) {return reduce.option==value.option});

					if (aOption.length==0)
					{
						aReduce.push({element: iElement, elementtext: value.elementtext, option: value.option, text: value.optiontext, count: 1, structuredataids: [value.structuredata]})
					}
					else
					{
						aOption[0].count++
						aOption[0].structuredataids.push(value.structuredata)
					}
				});

				$.each(aReduce, function (r, reduce)
				{
					reduce.percentage = (reduce.count / aValues.length * 100).toFixed(0)
				});
			}	

			return aReduce;
		},

		points: 	
		{
			calculate: 	function (oParam)
			{
				var iStructureData = ns1blankspace.util.getParam(oParam, 'structuredata').value;
				var iStructure = ns1blankspace.util.getParam(oParam, 'structure', {"default": ns1blankspace.option.defaultStructure}).value;
				var iContactBusiness = ns1blankspace.util.getParam(oParam, 'contactbusiness').value;
				var iCategory = ns1blankspace.util.getParam(oParam, 'category').value;
				var iPoints = 0;

				if (iStructureData == undefined && iContactBusiness != undefined && iStructure != undefined)
				{
					iStructureData = $.grep(ns1blankspace.structureData.cache.data.structuredata, function (data) {return data.structure==iStructure && data.contactbusiness==iContactBusiness})[0].id;
				}	

				var aValues = $.grep(ns1blankspace.structureData.cache.data.values,
								function (value)
								{
									return (value.structuredata == iStructureData) && (iCategory!=undefined?value.structureelement.category==iCategory:true)
								});

				$.each(aValues, function (i, value)
				{
					iPoints = iPoints + parseFloat(value.points)
				});

				return iPoints
			}
		},

		grouping: 	
		{
			calculate: 	function (oParam)
			{
				var iPoints = ns1blankspace.util.getParam(oParam, 'points').value;
				var iStructure = ns1blankspace.util.getParam(oParam, 'structure', {"default": ns1blankspace.option.defaultStructure}).value;
				var iCategory = ns1blankspace.util.getParam(oParam, 'category').value;
				var aGroups = ns1blankspace.structureData.cache.data.groups;

				if (iPoints == undefined)
				{
					iPoints = ns1blankspace.structureData.util.points.calculate(oParam)
				}
				
				var oGroup = $.grep(aGroups, function (group)
								{
									return group.structure==iStructure && group.minimumpoints <= parseInt(iPoints) && parseInt(iPoints) <= group.maximumpoints && (iCategory!=undefined?group.category==iCategory:true)
								})[0];

				return {points: iPoints, group: oGroup}
			}

		},

		object: 	
		{
			data: 		{},

			log: 		function (oParam)
			{
				console.log(oParam.data)
			},

			get: 		function (oParam)
			{
				var iStructure = ns1blankspace.util.getParam(oParam, 'structure').value;
				var sStructureText = ns1blankspace.util.getParam(oParam, 'structureText').value;
				var iCategory = ns1blankspace.util.getParam(oParam, 'category').value;
				var aDataStructures = ns1blankspace.util.getParam(oParam, 'dataStructures').value;
				var aElements = ns1blankspace.util.getParam(oParam, 'elements').value;

				if (aElements == undefined)
				{
					var oSearch = new AdvancedSearch();
					oSearch.method = 'SETUP_STRUCTURE_ELEMENT_SEARCH';
					oSearch.addField('alias');

					if (iStructure != undefined) {oSearch.addFilter('structure', 'EQUAL_TO', iStructure)}
					if (sStructureText != undefined) {oSearch.addFilter('structureText', 'EQUAL_TO', sStructureText)}
					if (iCategory != undefined) {oSearch.addFilter('category', 'EQUAL_TO', iCategory)}

					oSearch.rows = 250;
					oSearch.sort('id', 'asc');
					oSearch.getResults(function (oResponse)
					{
						oParam = ns1blankspace.util.setParam(oParam, 'elements', oResponse.data.rows);
						ns1blankspace.structureData.util.object.get(oParam)
					});
				}
				else
				{
					if (aDataStructures == undefined)
					{
						var oSearch = new AdvancedSearch();
						oSearch.method = 'STRUCTURE_DATA_SEARCH';
						oSearch.addField('reference,title,completedbyusertext,contactbusinesstext,contactpersontext,referencedate,modifieddate' +
											(aElements.length>0?',':'') +
											$.map(aElements, function (element) {return element.alias}).join(','));
						
						if (iStructure != undefined) {oSearch.addFilter('structure', 'EQUAL_TO', iStructure)}
						if (sStructureText != undefined) {oSearch.addFilter('structureText', 'EQUAL_TO', sStructureText)}

						oSearch.rows = 1000;
						oSearch.sort('title', 'asc');
						oSearch.getResults(function (oResponse)
						{
							oParam = ns1blankspace.util.setParam(oParam, 'dataStructures', oResponse.data.rows);
							ns1blankspace.structureData.util.object.get(oParam)
						});
					}
					else
					{	
						var aReturn = [];
						var oData;
						var sValue;

						$.each(aDataStructures, function (ds, datastructure)
						{
							oData = {id: datastructure.id, modifieddate: datastructure.modifieddate};

							for (var key in datastructure)
					  		{
					     		if (datastructure.hasOwnProperty(key) && key.substring(0, 2) == 'se')
					     		{
					     			oData[key.replace('se','').toLowerCase()] = datastructure[key]
					     		}

					     		if (datastructure.hasOwnProperty(key) && key == 'title')
					     		{
					     			oData['key'] = datastructure[key]
					     		}
					     	}

							aReturn.push(oData);
						});

						oParam = ns1blankspace.util.setParam(oParam, 'data', aReturn);
						ns1blankspace.util.onComplete(oParam);
					}	
				}	
			},			

			set: 		function (oParam)
			{
				var iID = ns1blankspace.util.getParam(oParam, 'id').value;
				var oData = {id: iID}

				for (var key in oParam)
		  		{
		     		if (oParam.hasOwnProperty(key) && key != 'id' && key != 'title' && key != 'key')
		     		{
		     			oData['se' + key] = oParam[key]
		     		}

		     		if (oParam.hasOwnProperty(key) && (key == 'title' || key == 'key'))
		     		{
		     			oData['title'] = oParam[key]
		     		}
		     	}

		     	$.ajax(
				{
					type: 'POST',
					url: ns1blankspace.util.endpointURI('STRUCTURE_DATA_MANAGE'),
					data: oData,
					dataType: 'json',
					success: function(oResponse)
					{
						ns1blankspace.status.message('Saved');
					}
				});
			}				
		},			

		value: 		function (oParam)
		{
			var aDataStructureValues = ns1blankspace.util.getParam(oParam, 'dataStructureValues').value;
			var oReturn = {};
			var sValue;

			$.each(aDataStructureValues, function (v, value)
			{
				if (v==0) {oReturn.id = value.structuredata}
				sValue = value['formattedvalue'];
				if (sValue == '') {sValue = value['text'];}
				oReturn[value['structuredatavalue.element.alias'].replace('se','').toLowerCase()] = sValue
			});

			return oReturn
		}			
	}					
}									
