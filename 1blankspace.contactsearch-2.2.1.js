/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 */
 
// Global Contact search - searches in Business and Person

ns1blankspace.contactsearch = 
{
	data: 
	{		
		businessColumns:
		[
			{column: 'tradename', label: 'Trading Name'},
			{column: 'legalname', label: 'Legal Name'},
			{column: function(oRow) 
					{return oRow.streetsuburb.formatXHTML() + ' ' + oRow.streetstate.formatXHTML()}, label: 'Location'},
			{column: 'phonenumber', label: 'Phone'},
			{column: 'email', label: 'Email'},
			{column: 'webaddress', label: 'Website'},
			{column: 'streetsuburb', hidden: true},
			{column: 'streetstate', hidden: true}
		],
		businessFilters: [],
		personColumns: 
		[
			{column: 'firstname', label: 'First Name'},
			{column: 'surname', label: 'Surname'},
			{column: 'workphone', label: 'Phone'},
			{column: 'mobile', label: 'Mobile'},
			{column: 'email', label: 'Email'},
			{column: 'contactbusinesstext', label: 'Business'},
			{column: 'contactbusiness', hidden: true}
		],
		personFilters: []
	},

	init: 	function (oParam)
	{
		ns1blankspace.app.reset();

		ns1blankspace.object = 32;	
		ns1blankspace.objectName = 'contactsearch';
		ns1blankspace.objectParentName = undefined;
		ns1blankspace.objectMethod = ''
		ns1blankspace.objectContextData = undefined;
		ns1blankspace.objectContext = -1;
		ns1blankspace.viewName = 'Contact Search';	
		ns1blankspace.data.contactBusiness = undefined;
		ns1blankspace.data.contactPerson = undefined;

		ns1blankspace.app.set(oParam);
	},

	home: 	function (oParam, oResponse)
	{
		var aHTML = [];

		aHTML.push('<div id="ns1blankspaceMainBusinesses" class="ns1blankspaceControlMain"></div>');
		aHTML.push('<div id="ns1blankspaceMainPeople" class="ns1blankspaceControlMain"></div>');
		$('#ns1blankspaceMain').html(aHTML.join(''));

		aHTML = [];
					
		aHTML.push('<table>');

		aHTML.push('<tr><td><div id="ns1blankspaceViewContactLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>');
				
		aHTML.push('<tr class="ns1blankspaceControl">' +
						'<td id="ns1blankspaceControlBusinesses" class="ns1blankspaceControl ns1blankspaceHighlight">Businesses</td>' +
						'</tr>');			
				
		aHTML.push('<tr class="ns1blankspaceControl">' +
						'<td id="ns1blankspaceControlPeople" class="ns1blankspaceControl">People</td>' +
						'</tr>');	
					
		aHTML.push('</table>');		
		
		$('#ns1blankspaceControl').html(aHTML.join(''));

		$('#ns1blankspaceControlBusinesses').on('click', function()
		{
			if (ns1blankspace.contactsearch.data.businessSearchCompleted)
			{
				ns1blankspace.show({selector: '#ns1blankspaceMainBusinesses'});
				ns1blankspace.contactsearch.businesses.show();
			}
		});

		$('#ns1blankspaceControlPeople').on('click', function()
		{
			if (ns1blankspace.contactsearch.data.personSearchCompleted)
			{
				ns1blankspace.show({selector: '#ns1blankspaceMainPeople'});
				ns1blankspace.contactsearch.people.show();
			}
		});
	},

	search:
	{
		send: function(sXHTMLElementId, oParam)
		{
			oParam = oParam || {};
			if ($.type(sXHTMLElementId) == 'object') 
			{ 
				oParam = sXHTMLElementId;
				sXHTMLElementId = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {'default': ''}).value;
			}
			sXHTMLElementId = (sXHTMLElementId == "-^^^^") ? '' : sXHTMLElementId;		// Special case to force search
			var sElementId = sXHTMLElementId.split('-').shift();
			var sSearchContext = ns1blankspace.util.getParam(oParam, 'searchContext', {'default': sXHTMLElementId.split('-')[1]}).value;
			var iSource = ns1blankspace.util.getParam(oParam, 'source', {'default': ns1blankspace.data.searchSource.text}).value;
			var sSearchText = ns1blankspace.util.getParam(oParam, 'searchText').value;
			var iMaximumColumns = ns1blankspace.util.getParam(oParam, 'maximumColumns', {'default': 1}).value;
			var iMinimumLength = ns1blankspace.util.getParam(oParam, 'minimumLength', {'default': 0}).value;
			var iRows = ns1blankspace.util.getParam(oParam, 'rows').value;

			var aBusinessColumns = $.grep(ns1blankspace.contactsearch.data.businessColumns, function(x) {return $.type(x.column) == 'string'});
			var aPersonColumns = $.grep(ns1blankspace.contactsearch.data.personColumns, function(x) {return $.type(x.column) == 'string'});
			
			
			if (sSearchContext == undefined || iSource != ns1blankspace.data.searchSource.browse)
			{
				// Needed for when user has clicked Back or Fwd buttons
				if (!$('#ns1blankspaceMainBusinesses').is('*'))
				{
					ns1blankspace.contactsearch.home();
				}
				ns1blankspace.show({selector: '#ns1blankspaceMainPeople', refresh: true});
				ns1blankspace.show({selector: '#ns1blankspaceMainBusinesses', refresh: true});
				$('.ns1blankspaceControl').removeClass('ns1blankspaceHighlight');
				$('#ns1blankspaceControlBusinesses').addClass('ns1blankspaceHighlight');

				ns1blankspace.contactsearch.data.businessSearchCompleted = false;
				ns1blankspace.contactsearch.data.personSearchCompleted = false;

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
					sElementId = 'ns1blankspaceViewBrowse';
				}
				
				if (sSearchText.length >= iMinimumLength || iSource == ns1blankspace.data.searchSource.browse)
				{
					ns1blankspace.search.start();
					ns1blankspace.history.view(
					{
						newDestination: 'ns1blankspace.contactsearch.init({id: "^^^^", searchText: "' + sSearchText + '"})',
						move: false
					});
					
					// Set up business search
					var oBusinessSearch = new AdvancedSearch();
					oBusinessSearch.method = 'CONTACT_BUSINESS_SEARCH';
					oBusinessSearch.addField($.map(aBusinessColumns, function(x) {return x.column}).join(','));

					oBusinessSearch.addBracket("(");
					oBusinessSearch.addFilter('tradename', 'TEXT_' + (sSearchText.length > 1 ? 'IS_LIKE' : 'STARTS_WITH'), sSearchText);
					oBusinessSearch.addOperator('or');
					oBusinessSearch.addFilter('legalname', 'TEXT_' + (sSearchText.length > 1 ? 'IS_LIKE' : 'STARTS_WITH'), sSearchText);
					oBusinessSearch.addBracket(')');

					$.each(ns1blankspace.contactsearch.data.businessFilters, function()
					{
						if (this.name.toLowerCase() == 'or' || this.name.toLowerCase() == 'and')
						{
							oBusinessSearch.addOperator(this.name);
						}
						else if (this.name == '(' || this.name == ')')
						{
							oBusinessSearch.addBracket(this.name)
						}
						else 
						{
							oBusinessSearch.addFilter(this.name, this.comparison, this.value1, this.value2, this.value3, this.applyToSubSearch);
						}
					});

					ns1blankspace.search.advanced.addFilters(oBusinessSearch);
					oBusinessSearch.rows = 30;
					oBusinessSearch.sort('tradename', 'ASC');

					oBusinessSearch.getResults(function(data) 
					{
						ns1blankspace.contactsearch.businesses.show(oParam, data);
					});


					// Set up Person search
					var sSurname = (sSearchText.split(' ').length > 1) ? sSearchText.split(' ').pop() : sSearchText;
					var sFirstName = (sSearchText.split(' ').length > 1) ? sSearchText.split(' ').shift() : sSearchText;

					var oPersonSearch = new AdvancedSearch();
					oPersonSearch.method = 'CONTACT_PERSON_SEARCH';
					oPersonSearch.addField($.map(aPersonColumns, function(x) {return x.column}).join(','));
					
					oPersonSearch.addBracket("(");
					oPersonSearch.addFilter('firstname', 
												'TEXT_' + (sSearchText.length > 1 ? 'IS_LIKE' : 'STARTS_WITH'), 
												sFirstName);
					oPersonSearch.addOperator((sFirstName != sSurname) ? 'and' : 'or');
					oPersonSearch.addFilter('surname', 
												'TEXT_' + (sSearchText.length > 1 ? 'IS_LIKE' : 'STARTS_WITH'), 
												sSurname);
					oPersonSearch.addBracket(')');
					
					$.each(ns1blankspace.contactsearch.data.personFilters, function()
					{
						if (this.name.toLowerCase() == 'or' || this.name.toLowerCase() == 'and')
						{
							oPersonSearch.addOperator(this.name);
						}
						else if (this.name == '(' || this.name == ')')
						{
							oPersonSearch.addBracket(this.name)
						}
						else 
						{
							oPersonSearch.addFilter(this.name, this.comparison, this.value1, this.value2, this.value3, this.applyToSubSearch);
						}
					});

					ns1blankspace.search.advanced.addFilters(oPersonSearch);
					oPersonSearch.rows = 30;
					oPersonSearch.sort('firstname', 'ASC');

					oPersonSearch.getResults(function(data) 
					{
						ns1blankspace.contactsearch.people.show(oParam, data);
					});
				}
			};	
		},

		process: function(oParam)
		{
			if (ns1blankspace.contactsearch.data.businessSearchCompleted && ns1blankspace.contactsearch.data.personSearchCompleted)
			{
				ns1blankspace.search.stop();
				$(ns1blankspace.xhtml.dropDownContainer).html('&nbsp;');
				$(ns1blankspace.xhtml.dropDownContainer).hide(ns1blankspace.option.hideSpeedOptions)
			}
		}
	},

	businesses: 
	{
		show: function(oParam, oResponse)
		{
			oParam = oParam || {};
			var aHTML = [];
			var fFunctionNewPage = ns1blankspace.contactsearch.businesses.bind;
			
			if ($('#ns1blankspaceMainBusinesses').attr('data-loading') === '1')
			{
				$('#ns1blankspaceMainBusinesses').attr('data-loading', '');

				ns1blankspace.contactsearch.data.businessSearchCompleted = true;
				ns1blankspace.contactsearch.search.process();

				aHTML.push('<table class="ns1blankspaceContainer">' +
							'<tr class="ns1blankspaceContainer">' +
							'<td id="ns1blankspaceBusinessContactColumn1" class="ns1blankspaceColumn1Large">' +
							'</td></tr></table>');				
				
				$('#ns1blankspaceMainBusinesses').html(aHTML.join(''));

				aHTML = [];
				if (oResponse.status == 'OK')
				{
					if (oResponse.data.rows.length == 0)
					{
						aHTML.push('<table id="ns1blankspaceBusinesses">' +
										'<tr><td class="ns1blankspaceNothing">No business found matching this criteria</td></tr>' +
										'</table>');
						$('#ns1blankspaceBusinessContactColumn1').html(aHTML.join(''));
					}
					else
					{
						aHTML.push('<table id="ns1blankspaceBusinesses">');
						aHTML.push('<tr>');

						$.each(ns1blankspace.contactsearch.data.businessColumns, function()
						{
							if (this.hidden != true)
							{
								aHTML.push('<td class="ns1blankspaceCaption">' + this.label + '</td>');
							}
							if (this.newPage)
							{
								fFunctionNewPage = this.column;
							}
						});
						aHTML.push('</tr>');

						$.each(oResponse.data.rows, function()
						{
							aHTML.push(ns1blankspace.contactsearch.businesses.row(this, oParam));
						});
						
						aHTML.push('</table>');
					}
					
					ns1blankspace.render.page.show(
					{
						xhtmlElementID: 'ns1blankspaceBusinessContactColumn1',
						xhtmlContext: 'Businesses',
						xhtml: aHTML.join(''),
						showMore: (oResponse.morerows === "true"),
						more: oResponse.moreid,
						rows: parseInt(oResponse.rows),
						functionShowRow: ns1blankspace.contactsearch.businesses.row,
						functionOnNewPage: fFunctionNewPage,
						type: 'json'
					}); 	
				}
				else
				{
					aHTML.push('<table id="ns1blankspaceBusinesses">' +
									'<tr><td class="ns1blankspaceNothing">There was an error searching for businesses.</td></tr>' +
									'</table>');

					$('#ns1blankspaceBusinessContactColumn1').html(aHTML.join(''));
				}
			}
		},

		row: function(oRow, oParam)
		{
			var aHTML = [];

			aHTML.push('<tr class="ns1blankspaceRow" data-rowID="' + oRow.id + '"'); 
			// Put hidden values in the tr as attributes
			$.each(ns1blankspace.contactsearch.data.businessColumns, function()
			{
				if (this.hidden == true)
				{
					if ($.type(this.column) != 'function')
					{
						aHTML.push(' data-' + this.column + '="' + oRow[this.column].formatXHTML() + '"')
					}
				}
			});

			aHTML.push('>');
			
			$.each(ns1blankspace.contactsearch.data.businessColumns, function()
			{
				var sColumn = ($.type(this.column) == 'function') ? this.label.replace(/ /g, '') : this.column;
				var sValue = ($.type(this.column) == 'string') ? oRow[this.column].formatXHTML() : ns1blankspace.xhtml.loadingSmall;
				if ($.type(this.column) == 'function')
				{
					if (this.secondCall != true && this.newPage != true) 
					{
						sValue = this.column(oRow)
					}
					else if (this.newPage != true && this.secondCall == true)
					{	// Call function - the function must populate this element
						this.column(oRow);
					}
				}

				if (this.hidden != true)
				{
					aHTML.push('<td id="ns1blankspaceBusinesses_' + sColumn.replace(/\./g, '_') + '-' + oRow.id + '"' +
									' class="ns1blankspaceMostLikely ns1blankspaceBusiness ns1blankspaceRow">' +
							sValue + '</td>');
				}
			});

			aHTML.push('</tr>');
			return aHTML.join('');
		},

		bind: function(oParam)
		{
			$('.ns1blankspaceBusiness').on('click', function()
			{
				var fFunctionSearch = ns1blankspace.util.getParam(oParam, 'functionSearch', {'default': ns1blankspace.contactBusiness.init}).value;

				fFunctionSearch({id: this.id.split('-').pop()});
			});
		}
	},

	people: 
	{
		show: function(oParam, oResponse)
		{
			oParam = oParam || {};
			var aHTML = [];
			var fFunctionNewPage = ns1blankspace.contactsearch.people.bind;
			
			if ($('#ns1blankspaceMainPeople').attr('data-loading') === '1')
			{
				$('#ns1blankspaceMainPeople').attr('data-loading', '');

				ns1blankspace.contactsearch.data.personSearchCompleted = true;
				ns1blankspace.contactsearch.search.process();
				
				aHTML.push('<table class="ns1blankspaceContainer">' +
							'<tr class="ns1blankspaceContainer">' +
							'<td id="ns1blankspacePersonContactColumn1" class="ns1blankspaceColumn1Large">' +
							ns1blankspace.xhtml.loading +
							'</td></tr>' +
							'</table>');				
				
				$('#ns1blankspaceMainPeople').html(aHTML.join(''));

				aHTML = [];

				if (oResponse.status == 'OK')
				{
					if (oResponse.data.rows.length == 0)
					{
						aHTML.push('<table id="ns1blankspacePerson">' +
										'<tr><td class="ns1blankspaceNothing">No people found matching this criteria.</td></tr>' +
										'</table>');
						$('#ns1blankspacePersonContactColumn1').html(aHTML.join(''));
					}
					else
					{
						aHTML.push('<table id="ns1blankspacePerson">');
						aHTML.push('<tr>');
						$.each(ns1blankspace.contactsearch.data.personColumns, function()
						{
							if (this.hidden != true)
							{
								aHTML.push('<td class="ns1blankspaceCaption">' + this.label + '</td>');
							}
							if (this.newPage)
							{
								fFunctionNewPage = this.column;
							}
						});
						aHTML.push('</tr>');

						$.each(oResponse.data.rows, function()
						{
							aHTML.push(ns1blankspace.contactsearch.people.row(this, oParam));
						});
						
						aHTML.push('</table>');
					}
					
					ns1blankspace.render.page.show(
					{
						xhtmlElementID: 'ns1blankspacePersonContactColumn1',
						xhtmlContext: 'Person',
						xhtml: aHTML.join(''),
						showMore: (oResponse.morerows === "true"),
						more: oResponse.moreid,
						rows: parseInt(oResponse.rows),
						functionShowRow: ns1blankspace.contactsearch.people.row,
						functionOnNewPage: fFunctionNewPage,
						type: 'json'
					}); 	
				}
				else
				{
					aHTML.push('<table id="ns1blankspacePerson">' +
									'<tr><td class="ns1blankspaceNothing">There was an error searching for People.</td></tr>' +
									'</table>');

					$('#ns1blankspacePersonContactColumn1').html(aHTML.join(''));
				}
			}
		},

		row: function(oRow, oParam)
		{
			var aHTML = [];

			aHTML.push('<tr class="ns1blankspaceRow" data-rowID="' + oRow.id + '"'); 
			// Put hidden values in the tr as attributes
			$.each(ns1blankspace.contactsearch.data.personColumns, function()
			{
				if (this.hidden == true)
				{
					if ($.type(this.column) != 'function')
					{
						aHTML.push(' data-' + this.column + '="' + oRow[this.column].formatXHTML() + '"')
					}
				}
			});

			aHTML.push('>');
			
			$.each(ns1blankspace.contactsearch.data.personColumns, function()
			{
				var sColumn = ($.type(this.column) == 'function') ? this.label.replace(/ /g, '') : this.column;
				var sValue = ($.type(this.column) == 'string') ? oRow[this.column].formatXHTML() : ns1blankspace.xhtml.loadingSmall;
				if ($.type(this.column) == 'function')
				{
					if (this.secondCall != true && this.newPage != true) 
					{
						sValue = this.column(oRow)
					}
					else if (this.newPage != true && this.secondCall == true)
					{	// Call function - the function must populate this element
						this.column(oRow);
					}
				}

				if (this.hidden != true)
				{
					aHTML.push('<td id="ns1blankspacePeople_' + sColumn.replace(/\./g, '_') + '-' + oRow.id + '"' +
									' class="ns1blankspaceMostLikely ns1blankspacePerson ns1blankspaceRow">' +
							sValue + '</td>');
				}
			});
			aHTML.push('</tr>');

			return aHTML.join('');
		},

		bind: function(oParam)
		{
			$('.ns1blankspacePerson').on('click', function()
			{
				var fFunctionSearch = ns1blankspace.util.getParam(oParam, 'functionSearch', {'default': ns1blankspace.contactPerson.init}).value;
				fFunctionSearch({id: this.id.split('-').pop()});
			});
		}
	}
}