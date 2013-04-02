/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 
if (ns1blankspace.report === undefined) {ns1blankspace.report = {}}

ns1blankspace.report.endpoint;
ns1blankspace.report.method;
ns1blankspace.report.searchFunction;
ns1blankspace.report.scriptOpen;
ns1blankspace.report.scriptNewPage;
ns1blankspace.report.fixedParameters;
ns1blankspace.report.selectableParameters;
ns1blankspace.report.rowParameters;
ns1blankspace.report.allParameters;
ns1blankspace.report.today = new Date();
ns1blankspace.report.returnParameters;
ns1blankspace.report.reports = [];
ns1blankspace.report.dictionary = [];
ns1blankspace.report.selectAttributes = [];


ns1blankspace.report = 
{
	initData: 	function (oParam)
				{
					var bAll = true;

					if (oParam != undefined)
					{
						if (oParam.all != undefined) {bAll = oParam.all}
					}
							
					// Only add reports that they have access to ToDo
					/*$(ns1blankspace.views).each(function(i, k)
					{
						var oMethods = $.grep(ns1blankspace.user.methods, function (a) {return (a.accessmethodtext).indexOf(k.endpoint) != -1;})	
						if (oMethods.length == 0) {this.show = false};
					});*/

					ns1blankspace.report.reports =
						[
							{
								name: "Businesses",
								object: 12,
								objectName: "contactbusiness",
								method: "CONTACT_BUSINESS_SEARCH",
								returnParameters: 'contactbusiness,contactbusiness.contactperson',
								functionSearch: ns1blankspace.contactBusiness.search.send,
								scriptOpen: 'ns1blankspace.contactBusiness.init({showHome: false});ns1blankspace.contactBusiness.search.send(this.id)',
							},
							{
								name: "People",
								object: 32,
								objectName: "contactperson",
								method: "CONTACT_PERSON_SEARCH",
								returnParameters: 'contactperson,contactperson.contactbusiness',
								functionSearch: ns1blankspace.contactPerson.search.send,
								scriptOpen: 'ns1blankspace.contactPerson.init({showHome: false});ns1blankspace.contactPerson.search.send(this.id)'
							},
							{
								name: "Opportunities",
								object: 35,
								objectName: "opportunity",
								method: "OPPORTUNITY_SEARCH",
								returnParameters: 'opportunity,opportunity.contactbusiness,opportunity.contactperson,',
								functionSearch: ns1blankspace.opportunity.search.send,
								scriptOpen: 'ns1blankspace.opportunity.init({showHome: false});ns1blankspace.opportunity.search.send(this.id)'
							},
							{
								name: "Products",
								object: 16,
								objectName: "product",
								method: "PRODUCT_SEARCH",
								returnParameters: 'product',
								functionSearch: ns1blankspace.product.search.send,
								scriptOpen: 'ns1blankspace.product.init({showHome: false});ns1blankspace.product.search.send(this.id)'
							}
							
						]		

					ns1blankspace.report.dictionary =
						[ 
							{name: "contactbusiness.tradename", caption: "Trading Name"},
							{name: "contactbusiness.legalname", caption: "Company Name"},
							{name: "contactbusiness.abn", caption: "ABN"},
							{name: "contactbusiness.webaddress", caption: "Website"},
							{name: "contactbusiness.phonenumber", caption: "Phone"},
							{name: "contactbusiness.faxnumber", caption: "Fax"},
							{name: "contactbusiness.customerstatustext", caption: "Status"},
							{name: "contactbusiness.industrytext", caption: "Industry"},
							{name: "contactbusiness.streetaddresscombined", caption: "Street Address"},
							{name: "contactbusiness.streetaddress1", caption: "Street Address 1"},
							{name: "contactbusiness.streetaddress2", caption: "Street Address 2"},
							{name: "contactbusiness.streetsuburb", caption: "Street Suburb"},
							{name: "contactbusiness.streetstate", caption: "Street State"},
							{name: "contactbusiness.streetpostcode", caption: "Street Postcode"},
							{name: "contactbusiness.streetcountry", caption: "Street Country"},
							{name: "contactbusiness.mailingaddresscombined", caption: "Mailing Address"},
							{name: "contactbusiness.mailingaddress1", caption: "Mailing Address 1"},
							{name: "contactbusiness.mailingaddress2", caption: "Mailing Address 2"},
							{name: "contactbusiness.mailingsuburb", caption: "Mailing Suburb"},
							{name: "contactbusiness.mailingstate", caption: "Mailing State"},
							{name: "contactbusiness.mailingpostcode", caption: "Mailing Postcode"},
							{name: "contactbusiness.mailingcountry", caption: "Mailing Country"},
							{name: "contactbusiness.notes", caption: "Notes"},
							{name: "contactbusiness.reference", caption: "Reference"},
							{name: "contactbusiness.areatext", caption: "Business Area"},
							{name: "contactbusiness.primarycontactpersontext", caption: "Primary Contact"},
							{name: "contactbusiness.businessgrouptext", caption: "Group"},
							{name: "contactbusiness.contactperson.firstname", caption: "Primary Contact First Name"},
							{name: "contactbusiness.contactperson.surname", caption: "Primary Contact Surname"},
							{name: "contactbusiness.contactperson.email", caption: "Primary Contact Email"},
							
							{name: "contactperson.surname", caption: "Surname"},
							{name: "contactperson.titletext", caption: "Title"},
							{name: "contactperson.gendertext", caption: "Gender"},
							{name: "contactperson.contactbusinesstext", caption: "Business Name"},
							{name: "contactperson.firstname", caption: "First Name"},
							{name: "contactperson.position", caption: "Position"},
							{name: "contactperson.workphone", caption: "Phone"},
							{name: "contactperson.fax", caption: "Fax"},
							{name: "contactperson.mobile", caption: "Mobile"},
							{name: "contactperson.email", caption: "Email"},
							{name: "contactperson.streetaddresscombined", caption: "Street Address"},
							{name: "contactperson.streetaddress1", caption: "Street Address 1"},
							{name: "contactperson.streetaddress2", caption: "Street Address 2"},
							{name: "contactperson.streetsuburb", caption: "Street Suburb"},
							{name: "contactperson.streetstate", caption: "Street State"},
							{name: "contactperson.streetpostcode", caption: "Street Postcode"},
							{name: "contactperson.streetcountry", caption: "Street Country"},
							{name: "contactperson.mailingtitle", caption: "Mailing Name"},
							{name: "contactperson.mailingaddresscombined", caption: "Mailing Address"},
							{name: "contactperson.mailingaddress1", caption: "Mailing Address 1"},
							{name: "contactperson.mailingaddress2", caption: "Mailing Address 2"},
							{name: "contactperson.mailingsuburb", caption: "Mailing Suburb"},
							{name: "contactperson.mailingstate", caption: "Mailing State"},
							{name: "contactperson.mailingpostcode", caption: "Mailing Postcode"},
							{name: "contactperson.mailingcountry", caption: "Mailing Country"},
							{name: "contactperson.persongrouptext", caption: "Group"},
							{name: "contactperson.primarycontactfortext", caption: "Primary Contact For"},
							{name: "contactperson.contactbusiness.tradename", caption: "Business Trading Name"},
							{name: "contactperson.contactbusiness.legalname", caption: "Business Legal Name"},
							{name: "contactperson.contactbusiness.mailingaddress1", caption: "Business Mailing Address 1"},
							{name: "contactperson.contactbusiness.mailingaddress2", caption: "Business Mailing Address 2"},
							{name: "contactperson.contactbusiness.mailingsuburb", caption: "Business Mailing Suburb"},
							{name: "contactperson.contactbusiness.mailingstate", caption: "Business Mailing State"},
							{name: "contactperson.contactbusiness.mailingpostcode", caption: "Business Mailing Postcode"},
							{name: "contactperson.contactbusiness.mailingcountry", caption: "Business Mailing Country"},
							{name: "contactperson.contactbusiness.streetaddress1", caption: "Business Street Address 1"},
							{name: "contactperson.contactbusiness.streetaddress2", caption: "Business Street Address 2"},
							{name: "contactperson.contactbusiness.streetsuburb", caption: "Business Street Suburb"},
							{name: "contactperson.contactbusiness.streetstate", caption: "Business Street State"},
							{name: "contactperson.contactbusiness.streetpostcode", caption: "Business Street Postcode"},
							{name: "contactperson.contactbusiness.streetcountry", caption: "Business Street Country"},
									
							{name: "opportunity.lodgeddate", caption: "Date Received"},
							{name: "opportunity.managerusertext", caption: "Managed By"},
							{name: "opportunity.sourcetext", caption: "Source of Contact"},
							{name: "opportunity.description", caption: "Description"},
							{name: "opportunity.statustext", caption: "Quote Status"},
							{name: "opportunity.phone", caption: "Business Phone"},
							{name: "opportunity.mobile", caption: "Mobile Phone"},
							{name: "opportunity.email", caption: "Contact Email"},
							{name: "opportunity.businessname", caption: "Business Name"},
							{name: "opportunity.firstname", caption: "First Name"},
							{name: "opportunity.surname", caption: "Surname"},
							{name: "opportunity.mailingaddress1", caption: "Mailing Address 1"},
							{name: "opportunity.mailingaddress2", caption: "Mailing Address 2"},
							{name: "opportunity.mailingsuburb", caption: "Mailing Address Suburb"},
							{name: "opportunity.mailingstate", caption: "Mailing State"},
							{name: "opportunity.mailingpostcode", caption: "Mailing  Postcode"},
							{name: "opportunity.mailingcountry", caption: "Mailing Country"},
							{name: "opportunity.contactbusiness.tradename", caption: "Business Trading Name"},
							{name: "opportunity.contactbusiness.legalname", caption: "Business Legal Name"},
							{name: "opportunity.contactperson.firstname", caption: "Business Contact First Name"},
							{name: "opportunity.contactperson.surname", caption: "Business Contact Surname"},
							{name: "opportunity.contactperson.firstname", caption: "Business Contact First Name"},
							{name: "opportunity.contactperson.phone", caption: "Business Phone"},
							{name: "opportunity.contactperson.mobile", caption: "Mobile Phone"},
							{name: "opportunity.contactperson.email", caption: "Contact Email"},
							{name: "opportunity.contactperson.streetaddresscomplete", caption: "Street Address (All)"},
							{name: "opportunity.contactperson.streetaddresscombined", caption: "Street Address"},
							{name: "opportunity.contactperson.streetaddress1", caption: "Street Address 1"},
							{name: "opportunity.contactperson.streetaddress2", caption: "Street Address 2"},
							{name: "opportunity.contactperson.streetsuburb", caption: "Street Address Suburb"},
							{name: "opportunity.contactperson.streetstate", caption: "Street Address State"},
							{name: "opportunity.contactperson.streetpostcode", caption: "Street Address Postcode"},
							{name: "opportunity.contactperson.mailingaddresscomplete", caption: "Mailing Address (All)"},
							{name: "opportunity.contactperson.mailingaddresscombined", caption: "Mailing Address"},
							{name: "opportunity.contactperson.mailingaddress1", caption: "Mailing Address 1"},
							{name: "opportunity.contactperson.mailingaddress2", caption: "Mailing Address 2"},
							{name: "opportunity.contactperson.mailingsuburb", caption: "Mailing Address Suburb"},
							{name: "opportunity.contactperson.mailingstate", caption: "Mailing Address State"},
							{name: "opportunity.contactperson.mailingpostcode", caption: "Mailing Address Postcode"},

							{name: "product.reference", caption: "Reference"},
							{name: "product.title", caption: "Title"},
							{name: "product.typetext", caption: "Type"},
							{name: "product.description", caption: "Description"},
							{name: "product.categorytext", caption: "Category"},
							{name: "product.statustext", caption: "Status"},
							{name: "product.currentretailprice", caption: "Retail Price"},
							{name: "product.financialaccounttext", caption: "Financial Account"},
							{name: "product.unittypetext", caption: "Unit Type"},
							{name: "product.units", caption: "Units"}
						];

					ns1blankspace.report.selectAttributes = 			
						[
							{
								name: "contact.businesstext", 
								addClass: "ns1blankspaceSelectBusiness",
								onDemandColumns: "tradename-space-customerstatustext"
							},
							{
								name: "contactbusiness.primarycontactpersontext",
								addClass: "ns1blankspaceSelectBusiness",
								onDemandColumns: "tradename-space-customerstatustext"
							},
							{
								name: "contactperson.contactbusinesstext",
								addClass: "ns1blankspaceSelectBusiness",
								onDemandColumns: "tradename-space-customerstatustext"
							}
						];

					
					// Now extend dictionary if applicable
					if (ns1blankspace.objectExtended) {

						$.each(ns1blankspace.report.reports, function() {
							var iObject = this.object;
							var sObjectname = this.objectName;

							$($.grep(ns1blankspace.extend.structure, function (a) {return a.object == iObject;})).each(function(i,v)
							{
								$(v.elements).each(function(j,k)
								{
									var sCaption = (k.caption == "") ? k.title : k.caption;
									if (k.datatype == 2) {	
										ns1blankspace.report.dictionary.push({name: sObjectname + '.se' + k.id + 'text', caption: sCaption});
									}	
									else {
										ns1blankspace.report.dictionary.push({name: sObjectname + '.se' + k.id, caption: sCaption});
									}
								});
							})	
						});
					}

					if (!bAll)
					{
						var sMethod = ns1blankspace.objectMethod = 'CONTACT_PERSON';
						var sParentNamespace = ns1blankspace.objectParentName;
						var sNamespace = ns1blankspace.objectName;

						if (sMethod == undefined)
						{	
							if (sParentNamespace)
							{
								var sMethod = (sParentNamespace).toUpperCase() + '_' + (sNamespace).toUpperCase();
							}
							else
							{
								var sMethod = (sNamespace).toUpperCase();
							}
						}
							
						if (sMethod)
						{
							sMethod += '_SEARCH';

							ns1blankspace.report.reports = $.grep(ns1blankspace.report.reports, function (a) {return a.method == sMethod})
						}	
					}	

				},

	init: 		function (oParam)
				{
					ns1blankspace.report.initData(oParam);

					var bAll = true;

					if (oParam != undefined)
					{
						if (oParam.all != undefined) {bAll = oParam.all}
					}

					ns1blankspace.app.reset();

					ns1blankspace.objectName = 'report';

					ns1blankspace.viewName = 'Search & Reporting';
	
					ns1blankspace.app.set(oParam);
				},

	home:		function (oParam, oResponse)
				{
					
					var aHTML = [];
								
					aHTML.push('<table>');

					aHTML.push('<tr><td><div id="ns1blankspaceViewReportLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>');

					aHTML.push('</table>');		
					
					aHTML.push('<table>');
					
					$.each(ns1blankspace.report.reports, function()
					{
						var sName = (this.name).replace(/ /g,'')
						
						aHTML.push('<tr>' +
										'<td id="ns1blankspaceControl' + sName + '" class="ns1blankspaceControl"' +
												' data-method="' + this.method + '">' + this.name + '</td>' +
										'</tr>');	
					});
					
					aHTML.push('</table>');		
					
					$('#ns1blankspaceControl').html(aHTML.join(''));	
					
					var aHTML = [];
					
					aHTML.push('<div id="ns1blankspaceReport" class="ns1blankspaceMain"></div>');
					
					$('#ns1blankspaceMain').html(aHTML.join(''));
					
					$.each(ns1blankspace.report.reports, function()
					{
						var sName = (this.name).replace(/ /g,'')
								
						$('#ns1blankspaceControl' + sName).data('param', this);
						
						$('#ns1blankspaceControl' + sName).click(function(event)
						{
							ns1blankspace.show({selector: '#ns1blankspaceReport'});
							var sMethod = $(this).attr('data-method');
							ns1blankspace.report.show($(this).data('param'));
						});				
					});
					
					if (ns1blankspace.report.reports.length == 1)
					{
						ns1blankspace.show({selector: '#ns1blankspaceReport'});
						var sMethod = ns1blankspace.report.reports[0].method;
						ns1blankspace.report.show(ns1blankspace.report.reports[0]);
						$('td.ns1blankspaceControl:first').addClass('ns1blankspaceHighlight')
					}	
					else
					{	
						ns1blankspace.show({selector: '#ns1blankspaceReport'});
					
						var aHTML = [];
									
						aHTML.push('<table id="tableInterfaceViewportMain" class="interfaceViewportMain">');
						aHTML.push('<tr id="trInterfaceViewportMain" class="interfaceViewportMain">' +
										'<td class="ns1blankspaceSub">' +
										'Select a search type from left.' + 
										'</td>' +
										'</tr>');
						aHTML.push('</table>');					
						
						$('#ns1blankspaceReport').html(aHTML.join(''));
					}	
				},

	getCaption: function (oParam)
				{
					var sName;
					var sReturn;
					var sDefaultReturn;
					var bOnlyIfExists = true
					
					if (oParam != undefined)
					{
						if (oParam.name != undefined) {sName = oParam.name}
						if (oParam.defaultReturn != undefined) {sDefaultReturn = oParam.defaultReturn}
						if (oParam.onlyIfExists != undefined) {bOnlyIfExists = oParam.onlyIfExists}
					}
					
					if (!bOnlyIfExists)
					{
						if (sDefaultReturn != undefined) {sReturn = sDefaultReturn}
						if (sReturn == undefined) {sReturn = sName}
					};
					
					$.each(ns1blankspace.report.dictionary, function()
					{
						if (this.name == sName)
						{
							sReturn = this.caption;
							return false;
						}
						else
						{
							return true;
						}	
					});

					return sReturn
				},

	show:		function (oParam, oResponse)
				{
					var aHTML = [];
					var sCaption;
					var sComparison;
					var sComparisonValue;
					var aDefault = [];
					var sJSONSearch;
					var aSelectableParameterList = [];
					var aSelectableParameters = [];
					var oSelectableParameters = {};
					var oFixedParameters = {};
					var bShowSelect = true;
					var bShowFixedParameters = true;
					var sSummary;
					var iSurveyId;
					var iCategoryId;
					var sSearchFilter;
					var bShowSort = true;
					var bContainsContactPerson = false;
					var aCategory = [];
					
					ns1blankspace.report.method = undefined;
					ns1blankspace.report.endpoint = undefined;
					ns1blankspace.report.object = undefined;
					ns1blankspace.report.objectName = undefined;
					ns1blankspace.report.returnParameters = undefined;
					ns1blankspace.report.searchFunction = undefined;
					ns1blankspace.report.scriptOpen = undefined;
					ns1blankspace.report.scriptNewPage = undefined;
					ns1blankspace.report.rowParameters = undefined;
					ns1blankspace.report.selectableParameters = undefined;
					ns1blankspace.report.allParameters = [];

					if (oParam != undefined)
					{
						if (oParam.endPoint != undefined) {ns1blankspace.report.endpoint = oParam.endPoint}
						if (oParam.method != undefined) {ns1blankspace.report.method = oParam.method}
						if (oParam.object != undefined) {ns1blankspace.report.object = oParam.object}
						if (oParam.objectName != undefined) {ns1blankspace.report.objectName = oParam.objectName}
						if (oParam.returnParameters != undefined) {ns1blankspace.report.returnParameters = oParam.returnParameters}
						if (oParam.jsonSearch != undefined) {sJSONSearch = oParam.jsonSearch}
						if (oParam.functionSearch != undefined) {ns1blankspace.report.searchFunction = oParam.functionSearch}
						if (oParam.scriptOpen != undefined) {ns1blankspace.report.scriptOpen = oParam.scriptOpen}
						if (oParam.scriptNewPage != undefined) {ns1blankspace.report.scriptNewPage = oParam.scriptNewPage}
						if (oParam.selectableParameters != undefined) {oSelectableParameters = oParam.selectableParameters}
						if (oParam.fixedParameters != undefined) {oFixedParameters = oParam.fixedParameters}
						if (oParam.showSelect != undefined) {bShowSelect = oParam.showSelect}
						if (oParam.showFixedParameters != undefined) {bShowFixedParameters = oParam.showFixedParameters}
						if (oParam.summary != undefined) {sSummary = oParam.summary}
						if (oParam.survey != undefined) {iSurveyId = oParam.survey}
						if (oParam.category != undefined) {iCategoryId = oParam.category}
						if (oParam.showSort != undefined) {bShowSort = oParam.showSort}
					}
					
					if (ns1blankspace.report.endpoint == undefined && ns1blankspace.report.method != undefined)
					{
						var aMethod = ns1blankspace.report.method.split('_');
						ns1blankspace.report.endpoint = (aMethod[0]).toLowerCase();
					}

					/*if (ns1blankspace.objectExtended) {

						 if (iCategoryId) {
						 	aCategory.push(iCategoryId);
						 }

						$($.grep(ns1blankspace.extend.structure, function (a) {return a.object == ns1blankspace.report.object;})).each(function(i, v) {
							aCategory.push(v.category);
						});
						iCategoryId = aCategory.join(",");
					}*/
					
					ns1blankspace.report.fixedParameters = oFixedParameters;
					ns1blankspace.report.selectableParameters = oSelectableParameters;
					
					if (!bShowSelect)
					{
						aHTML.push('<div id="ns1blankspaceReportHeader"></div>');
						aHTML.push('<div style="display:none;" id="ns1blankspaceReportResults"></div>');
						aHTML.push('<div style="display:none;" id="ns1blankspaceReportExport">No data to export.</div>');
						//aHTML.push('<div style="display:none;" id="ns1blankspaceReportUpdate">No data to update.</div>');
						aHTML.push('<div style="display:none;" id="ns1blankspaceReportSend">No data to send.</div>');
						$('#ns1blankspaceReport').html(aHTML.join(''));	
							
						var aHTML = [];
					
						aHTML.push('<table class="ns1blankspace" style="font-size:0.875em;">');

						if (sSummary != undefined)
						{
							aHTML.push('<tr><td style="color:#B8B8B8;padding:2px;">' +
												sSummary +
												'</td></tr>');
						}	
						
						aHTML.push('</table>');
							
						$('#ns1blankspaceReportHeader').html(aHTML.join(''))	
						
						ns1blankspace.report.search.send(oParam);
					}
					else
					{
						if (oResponse == undefined)
						{
							aHTML.push('<div id="ns1blankspaceReportHeader">' + ns1blankspace.xhtml.loading + '</div>');
							aHTML.push('<div id="ns1blankspaceReportSearch"></div>');
							aHTML.push('<div style="display:none;" id="ns1blankspaceReportResults">No results.</div>');
							aHTML.push('<div style="display:none;" id="ns1blankspaceReportExport">No data to export.</div>');
							//aHTML.push('<div style="display:none;" id="ns1blankspaceReportUpdate">No data to update.</div>');
							aHTML.push('<div style="display:none;" id="ns1blankspaceReportSend">No data to send.</div>');
							$('#ns1blankspaceReport').html(aHTML.join(''));	
						}
						
						if (oResponse == undefined && sJSONSearch != undefined)
						{
							var oSearch = new AdvancedSearch();
							oSearch.returnParameters = ns1blankspace.report.returnParameters;
							oSearch.rf = 'json';
							oSearch.getResults(sJSONSearch, function(data) {ns1blankspace.report.show(oParam, data)}) ;	
						}
						
						else if (oResponse == undefined && ns1blankspace.report.method != undefined)
						{
							var oSearch = new AdvancedSearch();
							oSearch.endPoint = ns1blankspace.report.endpoint;
							oSearch.method = ns1blankspace.report.method;
							if (iSurveyId != undefined)
							{	oSearch.survey = iSurveyId;}
							if (iCategoryId != undefined)
							{	oSearch.categoryId = iCategoryId;}
							oSearch.returnParameters = ns1blankspace.report.returnParameters;
							oSearch.rf = 'json';
							oSearch.getResults(function(data) {ns1blankspace.report.show(oParam, data)}) ;
						}
						
						else if (oResponse != undefined)
						{
							if (oSelectableParameters.fields != undefined)
							{
								$.each(oSelectableParameters.fields, function() 
								{ 
									aSelectableParameterList.push(this.name);
									aSelectableParameters.push(this);
									var sCaption = this.caption;
									if (sCaption == undefined)
									{	
										sCaption = ns1blankspace.report.getCaption({name: this.name});
										if (sCaption == undefined) { sCaption = this.name;	}
									}
									ns1blankspace.report.allParameters.push({name: this.name, caption: sCaption})
									//this.name.toLowerCase().indexOf('contactperson') != -1 && 
								});	
							}
							
							if (bShowSort && ns1blankspace.report.fixedParameters.fields != undefined)
							{
								$.each(ns1blankspace.report.fixedParameters.fields, function()
								{
									ns1blankspace.report.allParameters.push({name: this.name});
									var sCaption = this.caption;
									if (sCaption == undefined)
									{	
										sCaption = ns1blankspace.report.getCaption({name: this.name});
										if (sCaption == undefined) { sCaption = this.name;	}
									}
									ns1blankspace.report.allParameters.push({name: this.name, caption: sCaption})
								});
							}
							
							var aSelectAttributesList = []
							$.each(ns1blankspace.report.selectAttributes, function()
							{	aSelectAttributesList.push(this.name);	});
							
							var aHTML = [];
						
							aHTML.push('<table style="margin-bottom:0px;border-bottom-style:solid;border-width: 1px;border-color:#E8E8E8;" class="ns1blankspace">');
							aHTML.push('<tr><td id="ns1blankspaceReportHeaderOptions" style="vertical-alignment:bottom;padding-top:10px;">' + 
												'<input id="radioReport-Search" name="radioOptions" type="radio" checked="checked"/><label for="radioReport-Search">Criteria</label>' +
												'<input id="radioReport-Results" name="radioOptions" type="radio" /><label for="radioReport-Results">Results</label>' +
												'<input id="radioReport-Export" name="radioOptions" type="radio" /><label for="radioReport-Export">Export</label>' +
												'<input id="radioReport-Send" name="radioOptions" type="radio" /><label for="radioReport-Send">Send</label>' +
											'</td>');
							//					'<input id="radioReport-Update" name="radioOptions" type="radio" /><label for="radioReport-Update">Update</label>' +

							aHTML.push('<td style="vertical-alignment:bottom;padding-top:10px;text-align:right;font-size:0.75em;"><span id="spanReportSearch">Search</span></td>');
							aHTML.push('</table>'); 
							
							$('#ns1blankspaceReportHeader').html(aHTML.join(''));

							$('#ns1blankspaceReportHeaderOptions').buttonset().css('font-size', '0.75em');
							$('#ns1blankspaceReportHeaderOptions :radio').click(function() {
								
								var sShowId = $(this).attr('id');

								$('#ns1blankspaceReportHeaderOptions :radio').each(function() {
									
									var sSuffix = $(this).attr('id').split('-')[1];

									if ($(this).attr('id') === sShowId) {

										$('#ns1blankspaceReport' + sSuffix).show();
									}
									else {
										$('#ns1blankspaceReport' + sSuffix).hide();
									}
								});
							});

							var aHTML = [];
							
							aHTML.push('<table class="ns1blankspace" style="font-size:0.875em;">');

							if (sSummary != undefined)
							{
								aHTML.push('<tr><td colspan=4 style="color:#B8B8B8;padding:2px;">' +
													sSummary +
													'</td></tr>');
							}
							
							if (oFixedParameters.fields != undefined && bShowFixedParameters)
							{
								$.each(oFixedParameters.fields, function() 
								{ 
									sCaption = ns1blankspace.report.getCaption({name: this.name})
									var sName = (this.name).replace(/\./g,'_')
									
									aHTML.push('<tr><td colspan=2 style="color:#B8B8B8;padding:2px;">' +
													sCaption +
													'</td>' +
													'<td colspan=2 style="color:#B8B8B8;padding:2px;"' +
													' id="reportHeaderComparison' + sName + '"></td></tr>');
								});	
							}
							
							aHTML.push('<tr><td colspan=2 style="color:#B8B8B8;padding:4px;background-color:#F8F8F8;">Select</td>' +
											'<td colspan=2 style="color:#B8B8B8;padding:4px;background-color:#F8F8F8;">Comparison</td></tr>');
							
							$.each(oResponse.data.parameters, function() 
							{ 
								sCaption = ns1blankspace.report.getCaption({name: this.name})
								
								var iSelectableIndex = $.inArray(this.name, aSelectableParameterList)
								var sSearchFilter = '';
								
								if (iSelectableIndex != -1)
								{
									if (aSelectableParameters[iSelectableIndex].caption != undefined)
									{
										sCaption = aSelectableParameters[iSelectableIndex].caption;
									}

									if (aSelectableParameters[iSelectableIndex].xhtmlBefore != undefined)
									{
										aHTML.push('<tr><td colspan=4 class="ns1blankspaceReport">' +
														aSelectableParameters[iSelectableIndex].xhtmlBefore +
														'</td></tr>');
									}
									
									if (aSelectableParameters[iSelectableIndex].searchFilter != undefined)
									{
										sSearchFilter = aSelectableParameters[iSelectableIndex].searchFilter;
									}

								}	
								
								if (sCaption != undefined && (iSelectableIndex != -1 || aSelectableParameterList.length == 0))
								{
									var sName = (this.name).replace(/\./g,'_');
									var iSelectAttributes = $.inArray(this.name, aSelectAttributesList);
									var sClass = 'ns1blankspaceReport';
									var sMoreAttributes = "";
									ns1blankspace.report.allParameters.push({name: this.name, caption: sCaption})
									var bSelect = false;
									var sSearchEndPoint = this.searchendpoint;
									var sSearchMethod = this.searchmethod;
									var sSearchRelatedField = this.searchrelatedfield;
									
									if (iSelectAttributes >= 0)
									{	
										if (ns1blankspace.report.selectAttributes[iSelectAttributes].addClass != undefined) {
												sMoreAttributes += ' data-selectClass="' + ns1blankspace.report.selectAttributes[iSelectAttributes].addClass + '"';	}
										if (ns1blankspace.report.selectAttributes[iSelectAttributes].onDemandColumns != undefined) {
												sMoreAttributes += ' data-columnms="' + ns1blankspace.report.selectAttributes[iSelectAttributes].onDemandColumns + '"';	}
										if (ns1blankspace.report.selectAttributes[iSelectAttributes].onDemandGroupFilter != undefined) {
												sMoreAttributes += ' data-onDemandGroupFilter="' + ns1blankspace.report.selectAttributes[iSelectAttributes].onDemandGroupFilter + '"';	}
										if (ns1blankspace.report.selectAttributes[iSelectAttributes].onDemandGroupType != undefined) {
												sMoreAttributes += ' data-onDemandGroupType="' + ns1blankspace.report.selectAttributes[iSelectAttributes].onDemandGroupType + '"';	}
										if (sMoreAttributes != "") {
												sMoreAttributes += ' style="width:200px"';}
									}
									else
									{	
										if (iSelectableIndex != -1)
										{
											if (aSelectableParameters[iSelectableIndex].onDemandColumns != undefined) 
											{	sMoreAttributes += ' data-columns="' + aSelectableParameters[iSelectableIndex].onDemandColumns + '"'; }

											if (aSelectableParameters[iSelectableIndex].onDemandClick != undefined) 
											{	sMoreAttributes += ' data-onDemandClick="' + aSelectableParameters[iSelectableIndex].onDemandClick + '"'; }
											
											if (aSelectableParameters[iSelectableIndex].searchmethod != undefined)
											{	
												bSelect = true;
												sSearchMethod = aSelectableParameters[iSelectableIndex].searchmethod; 
											}
											
											if (aSelectableParameters[iSelectableIndex].searchendpoint != undefined)
											{	sSearchEndPoint = aSelectableParameters[iSelectableIndex].searchendpoint; }
											
											if (aSelectableParameters[iSelectableIndex].searchrelatedfield != undefined)
											{	sSearchRelatedField = aSelectableParameters[iSelectableIndex].searchrelatedfield; }
											
										}
									}
								
									aHTML.push('<tr><td style="width:15px;" id="ns1blankspaceReport_include_' + sName + '">' +
												'<input type="checkbox" id="ns1blankspaceReportCheck_include-' + sName + '"' +
													' data-name="' + this.name + '"' +
													' class="ns1blankspaceReportInclude">' +
												'</td>');
								
									aHTML.push('<td style="width:200px;" id="ns1blankspaceReport_caption_' + sName + '" class="ns1blankspaceReport">' +
												sCaption +
												'</td>');
									
									aHTML.push('<td style="width:200px;cursor: pointer;" id="ns1blankspaceReport_comparison-' + sName + '-' + this.datatype + '"' +
														' data-dataType="' + this.datatype + '"' +
														' data-searchEndpoint="' + sSearchEndPoint + '"' +
														' data-searchMethod="' + sSearchMethod + sSearchFilter + '"' +
														' data-inputType="');
									if (bSelect)
									{	aHTML.push( "select"); }
									else
									{	aHTML.push(this.inputtype); }
									aHTML.push( '"' +
														' data-searchRelatedField="' + sSearchRelatedField + '"' +
														sMoreAttributes + 
														'  class="ns1blankspaceReportComparison"></td>');
														
									aHTML.push('<td id="ns1blankspaceReport_input-' + sName + '-' + this.datatype + '" class="' + sClass + '"></td>');
									
									aHTML.push('</tr>');
									
								}
								
								if (iSelectableIndex != -1)
								{
									if (aSelectableParameters[iSelectableIndex].xhtmlAfter != undefined)
									{
										aHTML.push('<tr><td colspan=4 class="ns1blankspaceReport">' +
														aSelectableParameters[iSelectableIndex].xhtmlAfter +
														'</td></tr>');
									}	
								}
							});

							if (ns1blankspace.objectExtended) {


								$($.grep(ns1blankspace.extend.structure, function (a) {return a.object == ns1blankspace.report.object;})).each(function(i,v)
								{
									$(v.elements).each(function(j,k)
									{
										var sFieldName = ns1blankspace.report.objectName + '.se' + k.id;
										sFieldName += (k.datatype == '2') ? 'text' : '';
										sCaption = ns1blankspace.report.getCaption({name: sFieldName})
										
										var iSelectableIndex = $.inArray(sFieldName, aSelectableParameterList)
										var sSearchFilter = '';
										
										if (iSelectableIndex != -1)	{
											if (aSelectableParameters[iSelectableIndex].caption != undefined) 	{
												sCaption = aSelectableParameters[iSelectableIndex].caption;
											}
										}	
										
										if (sCaption != undefined && (iSelectableIndex != -1 || aSelectableParameterList.length == 0))
										{
											var sName = sFieldName.replace(/\./g,'_');
											var iSelectAttributes = $.inArray(sFieldName, aSelectAttributesList);
											var sClass = 'ns1blankspaceReport';
											var sMoreAttributes = "";
											ns1blankspace.report.allParameters.push({name: sFieldName, caption: sCaption})
											var bSelect = (k.datatype == "2");
											var sSearchEndPoint = (bSelect) ? 'setup': ''
											var sSearchMethod = (bSelect) ? 'SETUP_STRUCTURE_ELEMENT_OPTION_SEARCH': '';
											var sSearchRelatedField = (bSelect) ? ns1blankspace.report.objectName + '.se' + k.id : '';
											var sDataType = (k.datatype == "3") ? 'date' : 'text';
											
											
											if (bSelect) {	
												sMoreAttributes += ' data-methodFilter="id|EQUAL_TO|' + k.id + '"';	
												if (sMoreAttributes != "") {
														sMoreAttributes += ' style="width:200px"';}
											}
										
											aHTML.push('<tr><td style="width:15px;" id="ns1blankspaceReport_include_' + sName + '">' +
														'<input type="checkbox" id="ns1blankspaceReportCheck_include-' + sName + '"' +
															' data-name="' + sFieldName + '"' +
															' class="ns1blankspaceReportInclude">' +
														'</td>');
										
											aHTML.push('<td style="width:200px;" id="ns1blankspaceReport_caption_' + sName + '" class="ns1blankspaceReport">' +
														sCaption +
														'</td>');
											
											aHTML.push('<td style="width:200px;cursor: pointer;" id="ns1blankspaceReport_comparison-' + sName + '-' + sDataType + '"' +
																' data-dataType="' + sDataType + '"' +
																' data-searchEndpoint="' + sSearchEndPoint + '"' +
																' data-searchMethod="' + sSearchMethod + sSearchFilter + '"' +
																' data-inputType="');
											if (bSelect)
											{	aHTML.push( "select"); }
											else
											{	aHTML.push('textbox'); }
											aHTML.push( '"' +
														' data-searchRelatedField="' + sSearchRelatedField + '"' +
														sMoreAttributes + 
														'  class="ns1blankspaceReportComparison"></td>');
																
											aHTML.push('<td id="ns1blankspaceReport_input-' + sName + '-' + sDataType + '" class="' + sClass + '"></td>');
											
											aHTML.push('</tr>');
											
										}
										
									});
								});	

							}

							if (bShowSort)
							{
								aHTML.push('<tr><td colspan=2 style="color:#B8B8B8;padding:4px;background-color:#F8F8F8;">Sort by</td>' +
											 '<td colspan=2 style="color:#B8B8B8;padding:4px;background-color:#F8F8F8;" class="interfacemainSelect">' +
											 '<input onDemandType="SELECT" id="inputInterfaceReportSort" class="inputInterfaceMainSelect"' + 
											 'data-getSelectOptions="ns1blankspace.report.allParameters"></td></tr>');
							}
							
							aHTML.push('</table>');			
							
							$('#ns1blankspaceReportSearch').html(aHTML.join(''))
							
							$('#spanReportSearch').button(
							{
								label: "Search"
							})
							.click(function() 
							{
								$("#ns1blankspaceReportResults").html('No results.');
								$("#ns1blankspaceReportExport").html('No data to export.');
								//$("#ns1blankspaceReportUpdate").html('No data to update.');
								$("#ns1blankspaceReportSend").html('No data to send.');
								$("#radioReport-Search").removeAttr('checked');
								$("#radioReport-Results").attr('checked', 'checked');
								$("#ns1blankspaceReportHeaderOptions").buttonset('refresh');
								ns1blankspace.report.search.send(oParam);
							});	
							
							$('td.ns1blankspaceReportComparison').click(function(event)
							{
								var sID = event.target.id
								ns1blankspace.report.showComparison({xhtmlElementID: sID})
							});
							
							$('td.ns1blankspaceReportComparison').mouseenter(function(event)
							{
								if ($(this).text() == '')
								{
									$(this).text('Click to set comparison.');
									$(this).css('color', 'grey');
								}
								
							});
							
							$('td.ns1blankspaceReportComparison').mouseleave(function(event)
							{
								if ($(this).text() == 'Click to set comparison.')
								{
									$(this).text('');
									$(this).css('color', '');
								}	
							});
							
						}
						else
						{
							alert('Missing report configuration.');
						}
					}	
				},

	showComparison:
				function (oParam)
				{ 
					var sXHTMLElementID;
					
					if (oParam != undefined)
					{
						if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
					}	
					
					if (sXHTMLElementID != undefined)
					{
						var aID = sXHTMLElementID.split('-');
						
						var aHTML = [];
					
						aHTML.push('<table class="ns1blankspaceSearchMedium">');
						aHTML.push((advancedSearchComparisonGet({dataType: aID[2], returnFormat: 'xhtml'})).join(''));
						aHTML.push('</table>');		
						
						ns1blankspace.container.position({xhtmlElementID: sXHTMLElementID})		
						$(ns1blankspace.xhtml.container).html(aHTML.join(''))	
						
						$('td.interfaceMainReportComparisonType').click(function(event)
						{
							var sID = event.target.id;
							var sDataType = $('#' + sID).attr('data-dataType');
							var sInputType = $('#' + sID).attr('data-inputType');
							
							var sHTML = $('#' + sID).html();
							if (sHTML == 'None') 
							{	sHTML = ''
								if ($('td.interfaceMultiple').length > 0)
								{
									$('tr.interfaceMultiple').hide();
								}
							};
							
							$('#' + sXHTMLElementID).html(sHTML);
							$('#' + sXHTMLElementID).attr('data-code', $('#' + sID).attr('data-code'));
							//$('#' + sXHTMLElementID).attr('data-dataType', sDataType);
							//$('#' + sXHTMLElementID).attr('data-inputType', sInputType);
							$('#' + sXHTMLElementID).attr('data-inputCount', $('#' + sID).attr('data-inputcount'));
							
							$(ns1blankspace.xhtml.container).hide();
							
							var sXHTMLElementInputID  = sXHTMLElementID.replace('_comparison', '_input');
							var iInputCount = $('#' + sID).attr('data-inputCount');
							var sSearchEndpoint = $('#' + sXHTMLElementID).attr('data-searchEndpoint');
							var sSearchMethod = $('#' + sXHTMLElementID).attr('data-searchMethod');
							var sInputType = $('#' + sXHTMLElementID).attr('data-inputType');
							var sSelectClass = $('#' + sXHTMLElementID).attr('data-selectClass');
							var sOnDemandColumns = $('#' + sXHTMLElementID).attr('data-onDemandColumns');
							var sOnDemandGroupFilter = $('#' + sXHTMLElementID).attr('data-onDemandGroupFilter');
							var sOnDemandGroupType = $('#' + sXHTMLElementID).attr('data-onDemandGroupType');
							var sOnDemandClick = $('#' + sXHTMLElementID).attr('data-onDemandClick');
							var sSearchRelatedField = $('#' + sXHTMLElementID).attr('data-searchrelatedfield');
								
							ns1blankspace.report.setInput(
							{
								xhtmlElementID: sXHTMLElementInputID, 
								dataType: sDataType,
								inputType: sInputType,
								inputCount: iInputCount,
								searchEndpoint: sSearchEndpoint,
								searchMethod: sSearchMethod,
								selectClass: sSelectClass,
								onDemandColumns: sOnDemandColumns,
								onDemandGroupFilter: sOnDemandGroupFilter,
								onDemandGroupType: sOnDemandGroupType,
								comparisonID: sID,
								onDemandClick: sOnDemandClick,
								searchrelatedfield: sSearchRelatedField
							});
							
						});
						
					}
				},

	setInput: 	function (oParam)
				{ 
					var sXHTMLElementID;
					var sDataType;
					var sInputType;
					var aHTML = [];
					var iInputCount = 0;
					var sSearchEndpoint;
					var sSearchMethod;
					var sSelectClass;
					var sOnDemandColumns;
					var sOnDemandGroupFilter;
					var sOnDemandGroupType;
					var sFirstInputElementId;
					var sComparisonID;
					var sOnDemandClick;
					var sSearchRelatedField;
					
					if (oParam != undefined)
					{
						if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
						if (oParam.dataType != undefined) {sDataType = oParam.dataType}
						if (oParam.inputType != undefined) {sInputType = oParam.inputType}
						if (oParam.inputCount != undefined) {iInputCount = oParam.inputCount}
						if (oParam.searchEndpoint != undefined) {sSearchEndpoint = oParam.searchEndpoint}
						if (oParam.searchMethod != undefined) {sSearchMethod = oParam.searchMethod}
						if (oParam.selectClass != undefined) {sSelectClass = oParam.selectClass}
						if (oParam.onDemandColumns != undefined) {sOnDemandColumns = oParam.onDemandColumns}		
						if (oParam.onDemandGroupFilter != undefined) {sOnDemandGroupFilter = oParam.onDemandGroupFilter}		
						if (oParam.onDemandGroupType != undefined) {sOnDemandGroupType = oParam.onDemandGroupType}		
						if (oParam.comparisonID != undefined) {sComparisonID = oParam.comparisonID}		
						if (oParam.onDemandClick != undefined) {sOnDemandClick = oParam.onDemandClick}		
						if (oParam.searchmethod != undefined) {sSearchMethod = oParam.searchmethod}		
						if (oParam.searchendpoint != undefined) {sSearchEndPoint = oParam.searchendpoint}		
						if (oParam.searchrelatedfield != undefined) {sSearchRelatedField = oParam.searchrelatedfield}		
					}	
						
					if (sXHTMLElementID != undefined)
					{
						if (iInputCount == 0) 
						{
							$('#' + sXHTMLElementID).html('');
						}
						else
						{	
							var sXHTMLInputElementID = sXHTMLElementID.replace('td', 'input');
						
							for (var i = 1; i <= iInputCount; i++) 
							{	
						
								if (i > 1) 
								{
									aHTML.push('<br />');
								}
								
								var sThisElementId = sXHTMLInputElementID;
								if (sInputType == 'textbox' || sInputType == 'textarea')
								{
									sThisElementId = sThisElementId.replace(/-/g, '_');
									sThisElementId = sThisElementId + '_' + i
									if (i == 1)	{	sFirstInputElementId = sThisElementId;}
									
									if (sDataType == 'text' || sDataType == 'numeric')
									{
										aHTML.push('<input id="' + sThisElementId +  '" class="inputInterfaceMainText">');
									}	
									
									if (sDataType == 'date')
									{
										aHTML.push('<input id="' + sThisElementId + '" class="inputInterfaceMainDate">');
									}	
								}
								
								if (sInputType == 'select')
								{
									if (sSearchEndpoint != undefined && sSearchMethod != undefined)
									{
										if (sSearchEndpoint == "") 	{sSearchEndpoint = sSearchMethod.substr(0, sSearchMethod.indexOf("_")) }
										sThisElementId = sThisElementId.replace(/-/g, '_');
										sThisElementId = sThisElementId + '_' + i
										if (false && sComparisonID.indexOf("IN_LIST") >= 0)
										{	aHTML.push('<select multiple="multiple" '); }
										else
										{	aHTML.push('<input '); }
										
										aHTML.push('id="' + sThisElementId + '"');
										aHTML.push(' data-method="' + sSearchMethod + '" ' +
													'class="') ;
										if (sSelectClass != undefined)
										{	aHTML.push(sSelectClass);	}
										else
										{	aHTML.push('ns1blankspaceSelect')}
										
										if (sComparisonID.indexOf("IN_LIST") >= 0)
										{
											aHTML.push(' inputInterfaceMainMultiSelect');
										}
										aHTML.push('"');
										
										if (sOnDemandColumns != undefined)
										{	aHTML.push(' onDemandColumns="' + sOnDemandColumns + '"')	}
										
										if (sOnDemandGroupFilter != undefined)
										{	aHTML.push(' onDemandGroupFilter="' + sOnDemandGroupFilter + '"')	}
										
										if (sOnDemandGroupType != undefined)
										{	aHTML.push(' onDemandGroupType="' + sOnDemandGroupType + '"')	}
										
										if (sOnDemandClick != undefined)
										{	aHTML.push(' onDemandClick="' + sOnDemandClick + '"')	}
										
										aHTML.push('>');
										if (false && sComparisonID.indexOf("IN_LIST") >= 0)
										{
											aHTML.push('</select>');
										}
									}
									else
									{
										aHTML.push('Report configuration error! Please contact Support.<br />No searchEndpoint and/or searchMethod defined.');
									}	
								}	
							}
							
							$('#' + sXHTMLElementID).html(aHTML.join(''));
							$('input.inputInterfaceMainDate').datepicker({ dateFormat: 'dd M yy', changeYear: true });
							$('#' + sFirstInputElementId).focus();
							
						}	
					}	
				},

	search: 	{
					send: 		function (oParam, oResponse)
								{ 
									var sXHTMLElementID;
									var aHTML = [];
									var sReturnFormat = 'json';
									var iRows = ns1blankspace.option.defaultRows;
									var sParameterList
									var oSearchParameters;
									var sExtraIDColumnBefore = '';
									var sExtraIDColumnHeader = '';
									var aSelectableParameters;
									var aFixedParameters;
									var sIDColumn;
									var bContainsContactPerson = false;
									
									if (oParam != undefined)
									{
										if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
										if (oParam.returnFormat != undefined) {sReturnFormat = oParam.returnFormat}
										if (oParam.rows != undefined) {iRows = oParam.rows}
										if (oParam.parameterList != undefined) {sParameterList = oParam.parameterList}
										if (oParam.searchParameters != undefined) {oSearchParameters = oParam.searchParameters}
										if (oParam.extraIDColumnBefore != undefined) {sExtraIDColumnBefore = oParam.extraIDColumnBefore}
										if (oParam.extraIDColumnHeader != undefined) {sExtraIDColumnHeader = oParam.extraIDColumnHeader}
										if (oParam.idColumn != undefined) {sIDColumn = oParam.idColumn}
										if (oParam.containsContactPerson != undefined) {bContainsContactPerson = oParam.containsContactPerson }
										if (oParam.searchParameters == undefined)
										{
											if (oParam.fixedParameters != undefined) {oSearchParameters = oParam.fixedParameters}
										}	
									}	
									
									if (oResponse == undefined)
									{
										var oParameterList = [];
										
										if ($("input.ns1blankspaceReportInclude:checked").length == 0 && oSearchParameters == undefined)
										{
											alert('You need to pick at least one column.');
										}
										else
										{
										
											var sShowId = 'radioReport-Results';
											$('#ns1blankspaceReportHeaderOptions :radio').each(function() {
												
												var sSuffix = $(this).attr('id').split('-')[1];
												if ($(this).attr('id') === sShowId) {
													$('#ns1blankspaceReport' + sSuffix).show();
												}
												else {
													$('#ns1blankspaceReport' + sSuffix).hide();
												}
											});
											$('#ns1blankspaceReportResults').html(ns1blankspace.xhtml.loading);
										
											var oSearch = new AdvancedSearch();
										
											var aFields = [];
											
											if (oSearchParameters != undefined)
											{
												if (oSearchParameters.fields != undefined)
												{
													$.each(oSearchParameters.fields, function()
													{
														aFields.push(this.name);	
													});
												}	
											}
											
											$("input.ns1blankspaceReportInclude:checked").each(function() 
											{ 
												var sID = this.id;
												var aID = sID.split('-');
												var sName = (aID[1]).replace(/_/g, '.');
												
												oParameterList.push(sName);
												aFields.push(sName);
												if (!bContainsContactPerson &&
												    (sName.toLowerCase().substr(sName.length - 13, 13) == "contactperson" ||
													 sName.toLowerCase().substr(sName.length - 17, 17) == "contactpersontext" ||
													 sName.toLowerCase().indexOf(".contactperson.") != -1  ||
													 ns1blankspace.report.method.toUpperCase() == "CONTACT_PERSON_SEARCH")
													)
												{	bContainsContactPerson = true;	}
												
											});	
											
											if (sIDColumn != undefined && $.inArray(sIDColumn, aFields) == -1)
											{
												aFields.push(sIDColumn);
											}
											
											oParam.parameterList = aFields.join(',');
											oSearch.addField(aFields.join(','));
											oSearch.endPoint = ns1blankspace.report.endpoint;
											oSearch.method = ns1blankspace.report.method;
											
											var aFilters = [];
											
											if (oSearchParameters != undefined)
											{
												$.each(oSearchParameters.filters, function()
												{
													var bInclude = true;
													if (this.includeEval != undefined)
													{
														if (!eval(this.includeEval))
														{	bInclude = false;	}
													}
													
													if (bInclude)
													{	aFilters.push(this);	}
												});
											}
											
											$('td.ns1blankspaceReportComparison[data-code]').each(function() 
											{ 
												var sID = this.id
												var aID = sID.split('-')
												
												var sInputID  = sID.replace('_comparison', '_input');
												sInputID  = sInputID.replace('td', 'input');
												sInputID = sInputID.replace(/-/g, '_');
												
												var sName = aID[1].replace('_', '.');
												var sComparison = $(this).attr('data-code');
												
												if (sComparison != '')
												{
													var sInputType = $('#' + sID).attr('data-inputType');
													var sSearchRelatedField = $('#' + sID).attr('data-searchRelatedField');
													var aValues = ["","",""];
													
													if ( sInputType != "select" || 
													    (sInputType == "select" && sComparison.indexOf("IN_LIST") < 0) ||
													    (sInputType == "select" && sComparison.indexOf("IN_LIST") >= 0 && $('td.interfaceMultiple').length == 0)
													   ) 
													{
														for (var i = 0; i < $('#' + sID).attr('data-inputCount'); i++)
														{
															var sThisInputID = sInputID + '_' + (i + 1);
															var sValue = '';
															if (sInputType == 'select')
															{
																if ($('#' + sThisInputID).attr('data-id') == undefined)
																{	// User has typed something so compare the text field
																	sValue = $('#' + sThisInputID).val();
																}
																else	// User has selected an id - search on the id
																{	
																	sValue = $('#' + sThisInputID).attr('data-id'); 
																	sName = sSearchRelatedField.replace('_', '.');	
																}
															}
															else
															{
																sValue = $('#' + sThisInputID).val();
															}
															
															aValues[i] = sValue;
														}
													}
													else	// IN_LIST processing
													{
														var aValueList = [];
														
														$('td.interfaceMultiple').each(function()
														{
															var sElementId = this.id;
															var aSearch = sElementId.split("-");
															aValueList.push(aSearch[aSearch.length - 1]);
														});
														
														if (aValueList.length == 0)
														{
															alert("You must choose at least one value.");
															return false;
														}
														else
														{	aValues[0] = aValueList.join(",");	}
														sName = sSearchRelatedField.replace('_', '.');	
													}
													
													aFilters.push(
													{
														name: sName,
														comparison: sComparison,
														value1: aValues[0],
														value2: aValues[1],
														value3: aValues[2]
													});
												}	
											});	
											
											$.each(aFilters, function()
											{
												if (this.bracketBefore != undefined)
												{	oSearch.addBracket(this.bracketBefore);	}
												if (this.operatorBefore != undefined)
												{	oSearch.addOperator(this.operatorBefore) }
												
												oSearch.addFilter( this.name, this.comparison, this.value1, this.value2, this.value3);
												
												if (this.bracketAfter != undefined)
												{	oSearch.addBracket(this.bracketAfter);	}
												if (this.operatorAfter != undefined)
												{	oSearch.addOperator(this.operatorAfter) }
											});
											
											if ($('#inputInterfaceReportSort').val() != undefined)
											{
												if ($('#inputInterfaceReportSort').attr('data-id') != undefined)
												{	
													//var aAllParameters = interfaceReportGetAllParameterList();
													oSearch.sort(ns1blankspace.report.allParameters[$('#inputInterfaceReportSort').attr('data-id')].name, 'asc');
												}
											}
											
											oParam.containsContactPerson = bContainsContactPerson;
											
											oSearch.addSummaryField("count(*) " + ns1blankspace.report.endpoint);
											oSearch.rows = iRows;
											oSearch.rf = sReturnFormat;
											oSearch.getResults(function(data){ns1blankspace.report.search.send(oParam, data)}) ;	
										}	
											
									}
									else
									{
									
										aHTML = [];

										if (oResponse.data.rows.length == 0)
										{
											aHTML.push('<table class="interfaceMain"">');
											aHTML.push('<tbody>');
											aHTML.push('<tr class="ns1blankspaceCaption">' +
																'<td class="interfaceMainRowNothing">Nothing to show.</td></tr>') ;

											$('#ns1blankspaceReportResults').html(aHTML.join(''));
										}
										else
										{
											aHTML.push('<table class="interfaceMain"">');
											var aColumns = [];
											oParameter = sParameterList.split(',');
											
											aHTML.push('<tr class="ns1blankspaceCaption">');
											
											$.each(oParameter, function()
											{
												if (this == sExtraIDColumnBefore)
												{
													aHTML.push('<td class="ns1blankspaceCaption">' + sExtraIDColumnHeader + '</td>');
												}
												
												var sName = this;
												var sCaption;
												if (ns1blankspace.report.selectableParameters != undefined && ns1blankspace.report.selectableParameters.fields != undefined)
												{
													$.each(ns1blankspace.report.selectableParameters.fields, function()
													{
														if (this.name == sName && this.caption != undefined)
														{	sCaption = this.caption;	
															return false;
														}
													});
												}
												
												if (oSearchParameters != undefined && oSearchParameters.fields != undefined)
												{
													$.each(oSearchParameters.fields, function()
													{
														if (this.name == sName && this.caption != undefined)
														{	sCaption = this.caption;	
															return false;
														}
													});
												}
												
												sCaption = ns1blankspace.report.getCaption({name: this});
												
												if (sName != sIDColumn)
												{	aHTML.push('<td class="ns1blankspaceCaption">' + sCaption + '</td>');	}
												
												aColumns.push({name: sName, caption: sCaption});
												
											});
											
											aHTML.push('<td class="ns1blankspaceCaption">&nbsp;</td>');
											aHTML.push('</tr>');

											$.each(oResponse.data.rows, function(index) 
											{ 
												aHTML.push(ns1blankspace.report.search.row(this, oParam));
											});
											ns1blankspace.report.rowParameters = oParam;
											
											aHTML.push('</table>');
											
											$.extend(true, oParam, {moreId: $(oResponse).attr('moreid'),
																			count: oResponse.summary[ns1blankspace.report.endpoint],
																			response: oResponse,
																			columns: aColumns
																			});

											//$('#radioReport-Update').unbind("click");
											//$('#radioReport-Update').click(function() {
											//	ns1blankspace.report.bulkUpdate.show(oParam);
											//});
											
											$('#radioReport-Export').unbind("click");
											$('#radioReport-Export').click(function() {
												ns1blankspace.report.exportToCSV(oParam);
											});	

											$('#radioReport-Send').unbind("click");
											$('#radioReport-Send').click(function() {
												ns1blankspace.report.sendEMail.show(oParam);
											});	

											ns1blankspace.render.page.show(
											   {
												xhtmlElementID: 'ns1blankspaceReportResults',
												xhtmlContext: '',
												xhtml: aHTML.join(''),
												showMore: ($(oResponse).attr('morerows') == "true"),
												columns: oParameter.join('-'),
												more: $(oResponse).attr('moreid'),
												rows: ns1blankspace.option.defaultRows,
												functionShowRow: ns1blankspace.report.search.row,
												functionSearch: ns1blankspace.report.searchFunction,
												functionOpen: ns1blankspace.report.scriptOpen,
												functionNewPage: ns1blankspace.report.scriptNewPage,
												type: 'json'
											   }); 	
												
											$('.ns1blankspaceRowSelect' + '').unbind('click');
												
											if (ns1blankspace.report.scriptOpen != undefined)
											{
												$('.ns1blankspaceRowSelect' + '').button({
													text: false,
													icons: {
														primary: "ui-icon-play"
													}
												})
												.click(function() {
													eval(ns1blankspace.report.scriptOpen);
												})
												.css('width', '15px')
												.css('height', '20px')
											}
											
											eval(ns1blankspace.report.scriptNewPage);

											//functionSearch: ns1blankspaceActions,	
											//functionOpen: 'interfaceActionMasterViewport({showHome: false});interfaceActionSearch(this.id)',
											//functionNewPage: 'ns1blankspaceAttachmentsShowBind()'	
											//ns1blankspaceAttachmentsShowBind();	
											
										}
									}	
								},


					row:		function (oResponse, oParam)
								{
									var aHTML = [];
									var oFixedParameters = ns1blankspace.report.fixedParameters;
									var aFixedName = [];
									var	aFixedValue = [];
									var i;
									var sExtraIDColumnBefore;
									var sExtraIDColumnValue;
									var bExport = false;
									var sOutput = '';
									var sParameterList = '';
									var oParameters = [];

									if (oParam == undefined) {oParam = ns1blankspace.report.rowParameters }
									
									
									if (oParam != undefined)
									{
										if (oParam.fixedParameters != undefined) {oFixedParameters = oParam.fixedParameters}
										if (oParam.extraIDColumnBefore != undefined) {sExtraIDColumnBefore = oParam.extraIDColumnBefore}
										if (oParam.extraIDColumnValue != undefined) {sExtraIDColumnValue = oParam.extraIDColumnValue}
										if (oParam.parameterList != undefined) {sParameterList = oParam.parameterList}
									}	
									
									if (oFixedParameters.fields != undefined)
									{
										$.each(oFixedParameters.fields, function() 
										{ 
											if (this.value != undefined) 
											{
												aFixedName.push(this.name)
												aFixedValue.push(this.value)
											}	
										});	
									}
									
									if (sParameterList != '')
									{	oParameters = sParameterList.split(',');	}
									
									aHTML.push('<tr class="interfaceMainRow">');

									var sLastExtraID = '';
									sIDColumn = "id";
									if (oParam != undefined) 
									{	if (oParam.idColumn != undefined) {sIDColumn = oParam.idColumn}	}
									var aLastHTML = [];
									
									$.each(oParameters, function()
									{
										
										var sValue = oResponse[this];
										var sKey = this;
										var sIdValue = oResponse[sIDColumn];
										
										if (sKey != sIDColumn)	{
											aHTML.push('<td class="interfaceMainRow ' + sKey.replace(/\./g,'_') + '" ' + 
															 'id="' + sKey.replace(/\./g,'_') + '_' + sIdValue + '">' + 
														  sValue + '</td>');
											sOutput += '"' + sValue + '",';
										}
										else
										{
											if (sKey == sIDColumn)	{	
												aLastHTML.push('<td class="ns1blankspaceRowSelect id" ' +
															 'id="id-' + sIdValue + '"' +
															 'data-extraid="' + sLastExtraID + '"></td>');
											}
										}
									});

									if (aLastHTML.length == 0) {
										aLastHTML.push('<td class="ns1blankspaceRowSelect id" ' +
													 'id="id-' + oResponse[sIDColumn] + '"</td>');

									}
									aHTML.push(aLastHTML.join(''));
									aHTML.push('</tr>'); 
									
									if (bExport)
									{	return sOutput.substr(0, sOutput.length - 1) + '%0D%0A';	}
									else
									{	return aHTML.join('');	}
									
								}
				},

	mergeFields:	function (oParam)
				{
					var sText = "";
					var aColumns = [];
					
					if (oParam != undefined)
					{
						if (oParam.columns != undefined) {aColumns = oParam.columns;}
						if (oParam.replace != undefined) {sText = oParam.replace;}
					}
					
					$.each(aColumns, function()
					{
						while (sText.indexOf("[[" + this.caption + "]]") >= 0)
						{	sText = sText.replace("[[" + this.caption + "]]", "[[" + this.name + "]]")	}
					});
					
					return sText;
				},

	newPage:	function (oParam, oResponse)
				{
					var sEndpoint;
					var sMethod;
					var sName;
					var sSourceName;
					var sCompareColumn = 'id';
					var oMoreFilters;
					var sIDColumn = 'id';
					
					if (oParam != undefined)
					{
						if (oParam.endpoint != undefined) {sEndpoint = oParam.endpoint}	
						if (oParam.method != undefined) {sMethod = oParam.method}	
						if (oParam.name != undefined) {sName = oParam.name}	
						if (oParam.sourceName != undefined) {sSourceName = oParam.sourceName}	
						if (oParam.compareColumn != undefined) {sCompareColumn = oParam.compareColumn}	
						if (oParam.moreFilters != undefined) {oMoreFilters = oParam.moreFilters}
						if (oParam.idColumn != undefined) {sIDColumn = oParam.idColumn}
					}
					
					if (oResponse == undefined)
					{
					
						if (sEndpoint == undefined && sMethod != undefined)
						{
							var aMethod = sMethod.split('_');
							sEndpoint = (aMethod[0]).toLowerCase();
						}
						if (sSourceName == "extraID")
						{
							var aID = '';
							$('td.id:visible').each(function()
							{
								aID = ($(this).attr('id')).split('-');
								$('#' + $(this).attr('data-extraid')).attr('id', aID[1]);
							});	
						}
						
						var aSourceIDs = [];
						
						$('td.' + (sSourceName).replace(/\./g,'_') + ':visible').each(function()
						{
							if ($.inArray($(this).attr('id'),aSourceIDs >= 0))
							{	aSourceIDs.push($(this).attr('id'))	}
						});
						
						var sFields = sName;
						if 	(sCompareColumn != sIDColumn)
						{	sFields += ',' + sCompareColumn;	}
						
						var oAdvancedSearch = new AdvancedSearch();
						oAdvancedSearch.endPoint = sEndpoint;
						oAdvancedSearch.method = sMethod;
						oAdvancedSearch.addField(sFields);
						oAdvancedSearch.async = false;
						oAdvancedSearch.addFilter( sCompareColumn, 'IN_LIST', aSourceIDs.join(','));
						if (oMoreFilters != undefined)
						{
							$.each(oMoreFilters.filters, function()
							{
								if (this.bracketBefore != undefined)
								{	oAdvancedSearch.addBracket(this.bracketBefore);	}
								if (this.operatorBefore != undefined)
								{	oAdvancedSearch.addOperator(this.operatorBefore) }
								
								oAdvancedSearch.addFilter( this.name, this.comparison, this.value1, this.value2);
								
								if (this.bracketAfter != undefined)
								{	oAdvancedSearch.addBracket(this.bracketAfter);	}
								if (this.operatorAfter != undefined)
								{	oAdvancedSearch.addOperator(this.operatorAfter) }
							});
						}
						
						if (sCompareColumn != sIDColumn)
						{	
							oAdvancedSearch.sort(sCompareColumn, 'asc');	
							oAdvancedSearch.rows = 200;
						}

						oAdvancedSearch.rf = 'JSON';

						oAdvancedSearch.getResults(function(data) {ns1blankspace.report.newPage(oParam, data)}) 	
					}
					else
					{
						var sLastPrimaryId = '';
						var sLastId = '';
						var sHTML = '';
						$.each(oResponse.data.rows, function(index) 
						{ 
							if (sCompareColumn != sIDColumn)
							{
								if (sLastPrimaryId == $(this).attr(sCompareColumn))
								{
									sHTML = $('td.' + (sSourceName).replace(/\./g,'_') + '[id=' + sLastPrimaryId + ']').html();
									$('td.' + (sSourceName).replace(/\./g,'_') + '[id=' + sLastPrimaryId + ']').html(sHTML + '<br />' + $(this).attr(sName));
								}
								else
								{
									$('td.' + (sSourceName).replace(/\./g,'_') + '[id=' + $(this).attr(sCompareColumn) + ']').html($(this).attr(sName));
								}
								sLastPrimaryId = $(this).attr(sCompareColumn);
								sLastId = this.id;
							}
							else
							{
								$('td.' + (sSourceName).replace(/\./g,'_') + '[id=' + $(this).attr(sCompareColumn) + ']').html($(this).attr(sName));
							}
						});		
					}
				},

	fieldIncluded: 	function (sFieldList)
				{
					var aFields = sFieldList.split('-');
					var bIncluded = false;
					
					$.each(aFields, function()
					{
						var sField = this.replace(/\./g,'_');
						if ($('#ns1blankspaceReportCheck_include-' + sField).attr('checked'))
						{
							bIncluded = true;
							return false;
						}
						else
						{	return true;	}
					});
					
					return bIncluded;
				},

	searchFilter:	function (oParam)
				{

					var sValue = $('#' + ns1blankspace.xhtml.divID).val();
					var sName;
					var sParameter = '';
					var sAttribute = '';
					var sSearchMethod = '';
					
					if (oParam != undefined)
					{
						if (oParam.name != undefined) {sName = oParam.name}
						if (oParam.parameter != undefined) {sParameter = oParam.parameter}
						if (oParam.attribute != undefined) {sAttribute = oParam.attribute}
					}
					
					if (sName != undefined)
					{
						sName = sName.replace(/\./g,'_');
						sSearchMethod = $("#ns1blankspaceReport_comparison-" + sName + '-text').attr('data-searchMethod');
						if (sAttribute != '')
						{	sValue = $('#' + ns1blankspace.xhtml.divID).attr(sAttribute)	}
						
						$("#ns1blankspaceReport_comparison-" + sName + '-text').attr('data-searchMethod', sSearchMethod + '&' + sParameter + '=' + sValue);
						
					}
					
				},

	exportToCSV:		function (oParam)
				{
					var iMoreId;
					var aHTML = [];
					
					var sShowId = 'radioReport-Export';
					$('#ns1blankspaceReportExport').html('');
					$('#ns1blankspaceReportHeaderOptions :radio').each(function() {
						
						var sSuffix = $(this).attr('id').split('-')[1];
						if ($(this).attr('id') === sShowId) {
							$('#ns1blankspaceReport' + sSuffix).show();
						}
						else {
							$('#ns1blankspaceReport' + sSuffix).hide();
						}
					});

					if (oParam != undefined)
					{
						if (oParam.count != undefined && oParam.count != "0") 
						{
							
							$('#ns1blankspaceReportExport').html(ns1blankspace.xhtml.loading);

							iMoreId = oParam.moreId;
							var sParam = '&method=CORE_MORE_FILE_MANAGE&more=' + iMoreId;
							$.ajax({
								type: 'POST',
								url: '/ondemand/core/?rf=json' + sParam,
								dataType: 'json',
								success: function(oResponse)
								{
									if (oResponse.link != '')
									{
										aHTML.push('<table class="interfaceMain"">');
										aHTML.push('<tr class="ns1blankspaceCaption">');
										aHTML.push('<td class="ns1blankspaceCaption">File created..   ' + oParam.count + ' rows.</td></tr>');
										aHTML.push('<tr class="ns1blankspaceCaption">');
										aHTML.push('<td class="ns1blankspaceCaption"><a href="' + oResponse.link);
										aHTML.push('" target="_blank">Click here</a> to download the file.</td></tr>');
										aHTML.push('</table>');
										$('#ns1blankspaceReportExport').html(aHTML.join(''));
									}
									else {
										aHTML.push('<table class="ns1blankspace">');
										aHTML.push('<tr class="ns1blankspaceCaption">');
										aHTML.push('<td class="ns1blankspaceCaption">Error creating file. Please try again..</td></tr>');
										aHTML.push('</table>');
										$('#ns1blankspaceReportExport').html(aHTML.join(''));
									}
								}
							});
							
						}
					}
					else
					{
						aHTML.push('<table class="ns1blankspace">');
						aHTML.push('<tr class="ns1blankspaceCaption">');
						aHTML.push('<td class="ns1blankspaceCaption">No results. File not created.</td></tr>');
						aHTML.push('</table>');
						$('#ns1blankspaceReportExport').html(aHTML.join(''));
					}


				},

	sendPreview:	function (oParam)
				{
					var oRow;
					var iMoreId;
					var sText = "";
					var sParam = "";
					var oParameters = [];
					var sTags = "";
					var iObject;
					
					if (oParam != undefined)
					{
						if (oParam.row != undefined) {oRow = oParam.row}
						if (oParam.moreID != undefined) {iMoreId = oParam.moreID}		
						if (oParam.parameters != undefined) {oParameters = oParam.parameters}		
						if (oParam.text != undefined) {sText = oParam.text}		
						if (oParam.object != undefined) {iObject = oParam.object}		
					}
					else
					{
						ns1blankspace.status.error('Parameters not passed to ns1blankspace.report.sendPreview. <br /><br />Preview aborted.');
						return false;
					}
					
					if (false && iObject == 32)
					{	sTags = oParameters.join('|');	}
					else
					{
						$.each(oParameters, function()
						{
							sTags = this + "|"  + sTags;
						});
						if (sTags.length > 0)
						{	sTags = sTags.substr(0, sTags.length - 1); 	}
					}
					
					sParam = "&more=" + iMoreId + 
							 "&object=" + ns1blankspace.report.object + "&objectcontext=" + oRow.id +
							 "&templatetext=" + ns1blankspace.util.fs(sText) + 
							 "&tags=" + ns1blankspace.util.fs(sTags);

					$.ajax(
					{
						type: 'POST',
						cache: false,
						url: ns1blankspace.util.endpointURI("CORE_MORE_APPLY_TEMPLATE"),
						data: "rf=text" + sParam,
						dataType: 'text',
						async: false,
						success: function(data)
						{
							if (data.substr(0,12) == "OK|RETURNED|")
							{	
								ns1blankspace.status.message(data.substring(12));	
								// ToDo: Add preview page
							}
						}
					});
				},

	sendEMail:	{

				show: 	function (oParam)
						{

							var oResponse;
							var bContainsContactPerson = false;
							var aColumns = [];

							if (oParam) {
								if (oParam.response) {oResponse = oParam.response;}
								if (oParam.containsContactPerson != undefined) {bContainsContactPerson = oParam.containsContactPerson;}
								if (oParam.columns) {aColumns = oParam.columns;}
							}

							if (oResponse && $('#ns1blankspaceReportSendColumn1').html() == undefined) {
								if (bContainsContactPerson)
								{	// Show editor and template fields, buttons for preview & Sending
									ns1blankspace.format.editor.init();
									for (edId in tinyMCE.editors) 
												tinyMCE.editors[edId].destroy(true);
											
									ns1blankspace.counter.editor = ns1blankspace.counter.editor + 1;	

									aHTML = [];
									aHTML.push('<table class="ns1blankspaceContainer"><tr>');
									aHTML.push('<td id="ns1blankspaceReportSendColumn1"></td>' +
											   '<td id="ns1blankspaceReportSendColumn2" style="width:100px;"></td>' +
											   '</tr></table>');
									
									$('#ns1blankspaceReportSend').html(aHTML.join(''));
									
									var aHTML = [];
									var oMCEBookmark;
								
									aHTML.push('<table class="ns1blankspaceContainer">');
									aHTML.push('<tr><td id="ns1blankspaceReportSendColumn1Row1">');
									
										aHTML.push('<table class="ns1blankspaceContainer"><tr>');
										aHTML.push('<td id="ns1blankspaceReportSendSubject">');

											aHTML.push('<table class="ns1blankspaceContainer">');
											aHTML.push('<tr><td class="ns1blankspaceCaption">Subject</td></tr>' +
													   '<tr><td class="ns1blankspaceText">' +
													   		'<input onDemandType="TEXT" id="ns1blankspaceReportSendSubject" class="ns1blankspaceText">' +
													   '</td></tr></table>');

										aHTML.push('</td><td id="ns1blankspaceReportSendOptions" style="width:120px; text-align:right;">');
											
											aHTML.push('<span id="ns1blankspaceReportSendPreview">Preview</span>&nbsp;' +
														'<span id="ns1blankspaceReportSendEmail">Email</span>');

										aHTML.push('</tr></table>');	

									aHTML.push('</td></tr>');			
									aHTML.push('<tr><td id="ns1blankspaceReportSendColumn1Row2">');
										aHTML.push('<table class="ns1blankspace">');
										aHTML.push('<tr><td>' +
													'<textarea rows="30" cols="50" id="ns1blankspaceReportSendText' +
														ns1blankspace.counter.editor + '" editorcount="' + ns1blankspace.counter.editor + '" class="ns1blankspaceTextMulti"></textarea>' +
													'</td></tr></table>');
											
									aHTML.push('</td></tr>');


									$('#ns1blankspaceReportSendColumn1').html(aHTML.join(''));

											
									aHTML = [];

									aHTML.push('<table>');
									aHTML.push('<tr><td class="ns1blankspaceCaption" style="font-size:0.75em;">' +
												'Tags..</td></tr>');		
									$.each(aColumns, function()
									{
										aHTML.push('<tr><td class="ns1blankspaceRow ns1blankspaceRowSelect" style="font-size:0.75em;">');

										aHTML.push('<span id="spanInterfaceFormatTag_' + (this.caption).replace(/ /g,'-') + '"' +
												  		' class="interfaceFormatTags" ' +
												   		' data-caption="[[' + (this.caption) + ']]" style="cursor: pointer;">' + this.caption + '</span>');

										aHTML.push('</td></tr>');	

									});
											
									aHTML.push('</table>');					
									
									$('#ns1blankspaceReportSendColumn2').html(aHTML.join(''));

									
									$('#ns1blankspaceReportSendPreview').button({
										text: false,
										icons: {
											primary: "ui-icon-document"}
									})
									.click(function()
									{
										//var sText = interfaceReportReplaceMailMerge();
										var sText = ns1blankspace.report.mergeFields({columns: aColumns, 
																					   replace: tinyMCE.get(('ns1blankspaceReportSendText' + ns1blankspace.counter.editor)).getContent()});
										
										var aReportParam = {row: oResponse.data.rows[0],
															moreID: oResponse.moreid,
															parameters: oParameter,
															object: ns1blankspace.report.object,
															text: sText
														   }
										ns1blankspace.report.sendPreview(aReportParam);
									})
									.css('width', '30px')
									.css('height', '30px');
								
									$('#ns1blankspaceReportSendEmail').button({
										text: false,
										icons: {
											primary: "ui-icon-mail-closed"}
									})
									.click(function()
									{
										var sText = ns1blankspace.report.mergeFields({columns: aColumns, 
																					   replace: tinyMCE.get(('ns1blankspaceReportSendText' + ns1blankspace.counter.editor)).getContent()});
										var sSubject = ns1blankspace.report.mergeFields({columns: aColumns, 
																					   replace: $('#ns1blankspaceReportSendSubject').val()});
										ns1blankspace.report.sendEMail.send({moreID: oResponse.moreid,
																  parameters: oParameter,
																  text: sText,
																  subject: sSubject
																  });
									})
									.css('width', '30px')
									.css('height', '30px');
									
									
									$('.interfaceFormatTags')
									.hover( function()
									{	
										var s = 1;
										oMCEBookmark = tinyMCE.get(('ns1blankspaceReportSendText' + ns1blankspace.counter.editor)).selection.getBookmark({type: 1, normalized: true});
										s = 2;
									})
									.click( function()
									{
										ns1blankspace.format.editor.addTag({xhtmlElementID: this.id,
																	  editorID: 'ns1blankspaceReportSendText' + ns1blankspace.counter.editor, 
																	  mceBookmark: oMCEBookmark})
									})
									
									tinyMCE.execCommand('mceAddControl', false, 'ns1blankspaceReportSendText' + ns1blankspace.counter.editor);
									
									//var sParam = 'method=DOCUMENT_GET_DOCUMENT&noformat=1&select=' + iDocument;

								}
								else {
									
									var sText = '';

									if (oResponse) {
										sText = 'To send bulk emails to people in a report, you must include at least fields from the Person record.';
									}
									else {
										sText = 'No results to send.';
									}

									aHTML = [];
									aHTML.push('<table class="ns1blankspaceContainer"><tr>');
									aHTML.push('<td id="ns1blankspaceReportSend">' + sText + '</td>' +
											   '</tr></table>');
									
									$('#ns1blankspaceReportSend').html(aHTML.join(''));
								}
							}

							var sShowId = 'radioReport-Send';

							$('#ns1blankspaceReportHeaderOptions :radio').each(function() {
								
								var sSuffix = $(this).attr('id').split('-')[1];
								if ($(this).attr('id') === sShowId) {
									$('#ns1blankspaceReport' + sSuffix).show();
								}
								else {
									$('#ns1blankspaceReport' + sSuffix).hide();
								}
							});
						},

				send: 	function(oParam) {

							var iMoreId;
							var sText = "";
							var sParam = "";
							var oParameters = [];
							var sTags = "";
							var sEmail = "";
							var sSubject = "";
							
							if (oParam != undefined)
							{
								if (oParam.moreID != undefined) {iMoreId = oParam.moreID}		
								if (oParam.parameters != undefined) {oParameters = oParam.parameters}		
								if (oParam.text != undefined) {sText = oParam.text}		
								if (oParam.subject != undefined) {sSubject = oParam.subject}		
							}
							else
							{
								ns1blankspace.status.error('Parameters not passed to ns1blankspace.report.sendEmail. <br /><br />Preview aborted.');
								return false;
							}
							
							if (confirm("Are you sure you want to send an email to all of the Contacts in the report results?"))
							{
								sTags = oParameters.join('|');
								
								var oSearch = new AdvancedSearch();
								oSearch.endPoint = "contact";
								oSearch.method = "CONTACT_PERSON_SEARCH";
								oSearch.addField("email");2182
								oSearch.addFilter("id", "EQUAL_TO", ns1blankspace.user.contactperson);
								oSearch.rf = "JSON";
								oSearch.async = false;
								oSearch.getResults(function(data)
								{
									if (data.data.rows.length > 0)
									{	sEmail = data.data.rows[0].email;	}
								});
								
								sParam = "&more=" + iMoreId + 
										 "&title=" + ns1blankspace.util.fs(sSubject) +
										 "&status=1" + 
										 "&type=2" +
										 '&scheduletype=9' +
										 "&schedulemaximumcount=1" + 
										 "&responseactionfrom=" + ns1blankspace.util.fs(sEmail) + 
										 "&templatetext=" + ns1blankspace.util.fs(sText) + 
										 "&caption=" + ns1blankspace.util.fs(sTags);

								$.ajax(
								{
									type: 'POST',
									cache: false,
									url: ns1blankspace.util.endpointURI("SETUP_AUTOMATION_MANAGE"),
									data: "rf=text" + sParam,
									dataType: 'text',
									async: false,
									success: function(data)
									{
										ns1blankspace.status.message("Email(s) sent");
									}
								});
							}
							else
							{	return false;	}
						}
				},

	bulkUpdate:	{

				show: 	function (oParam) {
							
							var oResponse;
							var nCount;
							var sMoreId;
							var oParameters;
							var sExtraIDColumnBefore;
							var sIDColumn = 'id';

							if (oParam) {
								if (oParam.response) { oResponse = oParam.response; }
								if (oParam.count) { nCount = oParam.count; }
								if (oParam.parameterList) {oParameters = oParam.parameterList.split(','); }
								if (oParam.moreId) {sMoreId = oParam.moreId; }
								if (oParam.idColumn) {sIDColumn = oParam.idColumn; }
								if (oParam.extraIDColumnBefore) {sExtraIDColumnBefore = oParam.extraIDColumnBefore; }
							}


							var aHTML = [];

							if (oResponse && $('#ns1blankspaceReportUpdateColumn1').html() == undefined ) {

								aHTML.push('<table class="ns1blankspace">');
								aHTML.push('<tr><td id="ns1blankspaceReportUpdateColumn1"></td>' +
										   '<td id="ns1blankspaceReportUpdateColumn2" style="width:200px;"></td>' +
										   '</tr></table>');
							
								$('#ns1blankspaceReportUpdate').html(aHTML.join(''));

								aHTML = [];

								aHTML.push('<table class="ns1blankspace">');
								aHTML.push('<tr><td colspan=2 style="color:#B8B8B8;padding:4px;background-color:#F8F8F8;">Include</td>' +
												'<td colspan=1 style="color:#B8B8B8;padding:4px;background-color:#F8F8F8;">Update To</td></tr>');
								
								$.each(oParameters, function() {
									
									if (this == sExtraIDColumnBefore || this === sIDColumn) {}
									else {		// We want this one

										
										var sName = this.replace(/\./g, '_');
										var sCaption = $('#ns1blankspaceReport_caption_' + sName).html();
										var sSearchRelatedField = $('#ns1blankspaceReport_caption_' + sName).next().attr('data-searchRelatedField');
										var sInputType = $('#ns1blankspaceReport_caption_' + sName).next().attr('data-inputType');
										var sSearchMethod = $('#ns1blankspaceReport_caption_' + sName).next().attr('data-searchMethod');
										var sSearchEndPoint = $('#ns1blankspaceReport_caption_' + sName).next().attr('data-searchEndpoint');
										var sDataType = $('#ns1blankspaceReport_caption_' + sName).next().attr('data-dataType');
										var sInputTypeTitle = (sInputType) ? sInputType.substr(0,1).toUpperCase() + sInputType.substr(1) : 'Text';
										sInputTypeTitle = (sInputType === 'textbox') ? 'Text' : sInputTypeTitle;

										// we can't bulk update anything except lookup fields against SETUP
										if (sSearchMethod == "" || sSearchMethod.split('_')[0] === 'SETUP') {

											aHTML.push('<tr><td style="width:15px;" id="ns1blankspaceReportUpdate_include_' + sName + '">' +
														'<input type="checkbox" id="ns1blankspaceReportUpdateCheck_include-' + sName + '"' +
															' data-name="' + this + '"' +
															' class="ns1blankspaceReportUpdateInclude">' +
														'</td>');
										
											aHTML.push('<td style="width:200px;" id="ns1blankspaceReportUpdate_caption_' + sName + '" class="ns1blankspaceReport">' +
														sCaption +
														'</td>');
											
											aHTML.push('<td style="width:200px;" id="ns1blankspaceReportUpdate_value-' + sName + '"' +
																' class="ns1blankspace' + sInputTypeTitle  + '">');
											aHTML.push('<input id="ns1blankspaceReportUpdate_input-' + sName + '"' +
																' class="ns1blankspace' + sInputTypeTitle);
											if (sDataType === "date") {
												aHTML.push(' hasDatepicker');
											}
											aHTML.push('"');

											if (sInputType === "select") {
												aHTML.push(' data-method="' + sSearchMethod + '"');
												aHTML.push(' data-searchRelatedField="' + sSearchRelatedField + '"');
											}
											aHTML.push('></td>');

													//' data-dataType="' + this.datatype + '"' +
													//' data-searchEndpoint="' + sSearchEndPoint + '"' +
													//' data-searchMethod="' + sSearchMethod + sSearchFilter + '"' +
													//' data-inputType="');

											
											aHTML.push('</tr>');
										}
									}

								});
										
								//aHTML.push('</tr>');
								aHTML.push('</table>');
								$('#ns1blankspaceReportUpdateColumn1').html(aHTML.join(''));

								aHTML = [];
								aHTML.push('<table class="ns1blankspace"><tr>');
								aHTML.push('<td id="ns1blankspaceReportUpdateProcess" style="font-size:0.75em;text-align:right;">&nbsp;</td></tr>');
								aHTML.push('<tr><td id="ns1blankspaceReportUpdateProgress">&nbsp;</td></tr>');
								aHTML.push('</table>');
								$('#ns1blankspaceReportUpdateColumn2').html(aHTML.join(''));

								$('#ns1blankspaceReportUpdateProcess').button({
									label: "Update"
								})
								.click( function(oParam) { ns1blankspace.report.bulkUpdate.process(oParam);});


							}
							else if (oResponse == undefined) {
								aHTML.push('<table class="ns1blankspace">');
								aHTML.push('<tr class="ns1blankspaceCaption">');
								aHTML.push('<td class="ns1blankspaceCaption">No results. No updates possible.</td></tr>');
								aHTML.push('</table>');
								$('#ns1blankspaceReportUpdate').html(aHTML.join(''));
							}

							var sShowId = 'radioReport-Update';

							$('#ns1blankspaceReportHeaderOptions :radio').each(function() {
								
								var sSuffix = $(this).attr('id').split('-')[1];

								if ($(this).attr('id') === sShowId) {

									$('#ns1blankspaceReport' + sSuffix).show();
								}
								else {
									$('#ns1blankspaceReport' + sSuffix).hide();
								}
							});

						},

				send: 	function (oParam)
						{
							var iMoreId;
							var sErrorText;
							
							if (oParam != undefined)
							{
								if (oParam.count != undefined && oParam.count != "0") 
								{
									iMoreId = oParam.moreId;
									$('td.ns1blankspaceRowSelect:visible').each(function() {
										oParam.rowId = $(this).attr('id').substr(3);
										ns1blankspace.report.bulkUpdate.process(oParam);
									});


									
								}
								else { sErrorText = "No results.";}
							}
							else { sErrorText = "Parameters not passed to Update.";}

							if (sErrorText) {

								var aHTML = [];
								aHTML.push('<table class="interfaceMain">');
								aHTML.push('<tr class="ns1blankspaceCaption">');
								aHTML.push('<td class="ns1blankspaceCaption">' + sErrorText + ' Nothing updated.</td></tr>');
								aHTML.push('</table>');
								$('#ns1blankspaceReportUpdate').html(aHTML.join(''));
							}
						},

				process: function(oParam) {

						var aData = [];
						var aUpdateElements =[];
						var sRowId;

						if (oParam) {
							sRowId = oParam.rowId;
						}

						if (sRowId) {
							
							aData.push('id=' + sRowId);

							$('tr.ns1blankspaceUpdate').children().each(function() {

								if ($(this).hasClass("ns1blankspaceUpdate")) {

									var oElement = $(this).children()[0];
									var aID = $(oElement).attr('id').split('-');
									var sName = aID[1].replace(/_/g,'.');
									sName = sName.replace(ns1blankspace.report.objectName + '.', '');

									if ($(oElement).hasClass('ns1blankspaceSelect') && $(oElement).attr('data-id') != undefined) {
										aData.push(sName.substr(0, sName.length - 4) + '=' + ns1blankspace.util.fs($(oElement).attr('data-id')));
										aUpdateElements.push({id: $(oElement).attr('id'), value: $(oElement).val(), data_id: $(oElement).attr('data-id')});

									}
									else if ($(oElement).val() != '') {
										aData.push(sName + '=' + ns1blankspace.util.fs($(oElement).val()));
										aUpdateElements.push({id: $(oElement).attr('id'), value: $(oElement).val(), data_id: undefined});

									}
								}
							});

							if( aData.length > 0) {

								$.ajax({
									type: 'POST',
									url: ns1blankspace.util.endpointURI(ns1blankspace.report.method.replace('_SEARCH', '_MANAGE')),
									data: aData.join('&'),
									async: false,
									dataType: 'json',
									success: function(oResponse) {

										if (oResponse.status == 'OK') {

											// We have to change the values on the visible rows
											if ($('#id_' + sRowId).is(':visible')) {
												$('#id_' + sRowId).button({
													text: false,
													 icons: {
														 primary: "ui-icon-check"
													}
												})
												.click(function() {});
											}

											//$('#ns1blankspaceReportResults').html(aHTML.join(''));
										}
									}
								});
							}
						}

						}
		}

}
