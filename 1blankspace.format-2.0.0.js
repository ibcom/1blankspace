/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */

//STANDARD OBJECT TEMPLATE / FORMATTING
//type: 1=local primary object json, 2=remote mydigitalstructure object

/* 

PARSE 1 - PREP:

	<table><tr><td>[[Reference]]</td></tr></table>
	<table>
	<tr><td>Item Reference</td><td>Amount</td></tr>
	<tr><td>[[Item Reference]]</td><td>[[Item Amount]]</td></tr>
	</table>

	[[Item Reference]]:  find parent that is table, $('td').closest('table'); or $('#selector').parents("table:first");, set data-format-group: [[Item Reference]]
							on the td set data-format-name= [[Item Reference]]
	[[Item Amount]]:  find parent that is table, $('td').closest('table'); or $('#selector').parents("table:first");, set data-format-group: [[Item Reference]]-[[Item About]]
	 						on the td set data-format-name= [[Item Anmount]]

PARSE 2 - RENDER:

	.replace(/g /) based on dictionary where type = 1

	Select any tables with attribute $("table[data-format-group]")
	Get the data based on the method and columns - advanced search
	Get the row based on the first td and copy and replace for each row in return.
	
*/

if (ns1blankspace.format == undefined) {ns1blankspace.format = {}}

ns1blankspace.format.tags =
		[
			{
				type: 3,
				caption: "Today"
			},
			{
				object: 5,
				type: 1,
				caption: "Reference",
				source: "invoice.reference"
			},
			{
				object: 5,
				type: 1,
				caption: "Sent Date",
				source: "invoice.sentdate"
			},
			{
				object: 5,
				type: 1,
				caption: "Due Date",
				source: "invoice.duedate"
			},
			{
				object: 5,
				type: 1,
				caption: "Description",
				source: "invoice.description"
			},
			{
				object: 5,
				type: 1,
				caption: "Amount",
				source: "invoice.amount"
			},
			{
				object: 5,
				type: 1,
				caption: "Tax",
				source: "invoice.tax"
			},
			{
				object: 5,
				type: 1,
				caption: "Description",
				source: "invoice.description"
			},			
			{
				object: 5,
				type: 1,
				caption: "Purchase Order",
				source: "invoice.purchaseorder"
			},			
			{
				object: 5,
				type: 1,
				caption: "Project",
				source: "invoice.projecttext"
			},			
			{
				object: 5,
				type: 1,
				caption: "Business",
				source: "invoice.contactbusinesssenttotext"
			},	
			{
				object: 5,
				type: 1,
				caption: "Person",
				source: "invoice.contactpersonsenttotext"
			},			
			{
				object: 5,
				type: 2,
				caption: "Item Description",
				method: "FINANCIAL_ITEM_SEARCH",
				source: "lineitem.description"
			},
			{
				object: 5,
				type: 2,
				caption: "Item Account",
				method: "FINANCIAL_ITEM_SEARCH",
				source: "lineitem.financialaccounttext"
			},
			{
				object: 5,
				type: 2,
				caption: "Item Amount",
				method: "FINANCIAL_ITEM_SEARCH",
				source: "lineitem.amount"
			},
			{
				object: 5,
				type: 2,
				caption: "Item Tax",
				method: "FINANCIAL_ITEM_SEARCH",
				source: "lineitem.tax"
			},
			{
				object: 5,
				type: 2,
				caption: "Item Tax Type",
				method: "FINANCIAL_ITEM_SEARCH",
				source: "lineitem.taxtyperevenuetext"
			},
			{
				object: 5,
				type: 2,
				caption: "Item Currency",
				method: "FINANCIAL_ITEM_SEARCH",
				source: "lineitem.issuedcurrencytext"
			}						
			
		]		

ns1blankspace.format.test = function()
{
	ns1blankspace.format.xhtmlTest = '<table><tr><td>[[Reference]]</td></tr></table>' +
										'<table>' +
										'<tr><td>Item Reference</td><td>Amount</td></tr>' +
										'<tr><td>[[Item Reference]]</td><td>[[Item Amount]]</td></tr>' +
										'</table>';

	return ns1blankspace.format.render({xhtmlTemplate: ns1blankspace.format.xhtmlTest});
}

ns1blankspace.format.render = function (oParam)
				{
					var sXHTMLTemplate;
					var sXHTMLRendered;
					var iObject;
					var aSourceMethods = [];

					if (oParam != undefined)
					{
						if (oParam.xhtmlTemplate != undefined) {sXHTMLTemplate = oParam.xhtmlTemplate}
						if (oParam.object != undefined) {iObject = oParam.object}		
					}

					sXHTMLTemplate = (sXHTMLTemplate).replace(/\[\[/g,'<div class="template">');
					sXHTMLTemplate = (sXHTMLTemplate).replace(/\]\]/g,'</div>');

					var oXHTML = $(sXHTMLTemplate);
					var aXHTML = [];

					$(oXHTML).each(function()
					{
						$(this).find('div.template').each(function(i,e) 
						{
							var oTemplateTag = $.grep(ns1blankspace.format.tags, function (a) { return a.caption == $(e).html(); })

							if (oTemplateTag[0])
							{
								$(e).html('');
								$(e).attr('data-format-tag', oTemplateTag[0].caption);
								$(e).attr('data-format-source', oTemplateTag[0].source);

								var aSource = (oTemplateTag[0].source).split('.');
								$(e).attr('data-format-source-group', aSource[0]); 

								if (oTemplateTag[0].object == iObject && oTemplateTag[0].type == 1)
								{
									var sSource = oTemplateTag[0].source;

									if (ns1blankspace.objectContextData[sSource])
									{	
										$(e).html(ns1blankspace.objectContextData[sSource]);
									}
									else (ns1blankspace.objectContextData[oTemplateTag[0].source])
									{
										var aSource = (sSource).split('.');
										sSource = aSource[aSource.length-1];

										if (ns1blankspace.objectContextData[sSource])
										{	
											$(e).html(ns1blankspace.objectContextData[sSource]);
										}
									}	
								}

								if (oTemplateTag[0].object == iObject && oTemplateTag[0].type == 2)
								{
									if ($.grep(aSourceMethods, function (a) { return a.method == oTemplateTag[0].method; }).length == 0)
									{
										aSourceMethods.push({method: oTemplateTag[0].method, group: aSource[0]});
									}	
								}
							}			
						});

						aXHTML.push($(this).html())

					});
						
					//TYPE = 2 - subtables - need to gather up
					
					$(aSourceMethods).each(function() 
					{
						var oSearch = new AdvancedSearch();
						oSearch.method = this.method;
						oSearch.addField('*');
						oSearch.addFilter('object', 'EQUAL_TO', ns1blankspace.object);
						oSearch.addFilter('objectcontext', 'EQUAL_TO', ns1blankspace.objectContext);

						var oTmp = {group: this.group};
						oSearch.getResults(function(data) {ns1blankspace.format.process(oTmp, data)});
					});

					return aXHTML.join('');
				};

ns1blankspace.format.process = function (oParam, oResponse)
				{
					var aTR = [];
					var sTRID = 'template-' + oParam.group;

					$('[data-format-source-group="' + oParam.group + '"]').each(function(i) 
					{
						$('[data-format-source-group="' + oParam.group + '"]:first').closest('tr').clone()


						var oTR = $(this).closest('tr');
						var sTRXHTML = $(oTR).html();
						$(oTR).addClass(sTRID);

						$(sTRXHTML).each(function()
						{
							$(this).find('div.template').each(function(i,e) 
							{
								$(e).html($(e).attr('data-format-source'));
							});

							aTR.push($(this).html());
						});
					});	

					sTRXHTML = aTR.join('');

					$(oResponse.data.rows).each(function()
					{	
						var oRow = this;

						$('[data-format-source-group="' + oParam.group + '"]:first').closest('tr').clone()
						.find('[data-format-source]').each(function()
							{
								$(this).html(oRow[$(this).attr('data-format-source')]);

							}).end().appendTo($('[data-format-source-group="' + oParam.group + '"]:first').closest('tr').parent());
							
					});

					$('[data-format-source-group="' + oParam.group + '"]:first').closest('tr').remove();
				};

ns1blankspace.format.editor = 
{
	init:		function (oParam)
				{
					var sHeight = "370px";
					var bDynamicTags = false;
					var sAdditional = '';

					if (oParam != undefined)
					{
						if (oParam.height != undefined) {sHeight = oParam.height}
						if (oParam.dynamicTags != undefined) {bDynamicTags = oParam.dynamicTags}
					}

					if (ns1blankspace.option.richTextEditing)
					{
					
						if (bDynamicTags) {sAdditional = 'dynamicTags,'}

						tinyMCE.init(
						{
							mode : "none",
							height : sHeight, 
							width : "100%",
							theme : "advanced",

							plugins : "table,advimage,advlink,emotions,iespell,insertdatetime," + sAdditional + "preview,media,fullscreen,print,visualchars,nonbreaking,pagebreak,style,paste,searchreplace,print,contextmenu", 

							theme_advanced_buttons1_add_before : "forecolor,backcolor", 
							theme_advanced_buttons1_add : "fontselect,fontsizeselect", 
					 
							theme_advanced_buttons2_add : "separator,insertdate,inserttime,preview,zoom,separator,nonbreaking,pagebreak,visualchars", 
							theme_advanced_buttons2_add_before: "cut,copy,paste,pasteword,separator,search,replace,separator", 
							
							theme_advanced_buttons3_add_before : "tablecontrols,separator", 
							theme_advanced_buttons3_add : "emotions,iespell,fullscreen,print," + sAdditional + "media,selectall,advhr",
					 
							plugin_insertdate_dateFormat : "%d-%m-%y", 
							plugin_insertdate_timeFormat : "%H:%M:%S", 
						
							theme_advanced_toolbar_location : "top",
							theme_advanced_toolbar_align : "left",
							theme_advanced_resizing : true,
						
							font_size_style_values : "8pt,10pt,12pt,14pt,18pt,24pt,36pt",
							
							extended_valid_elements : "style,input[accept|accesskey|align<bottom?left?middle?right?top|alt|checked<checked|class|dir<ltr?rtl|disabled<disabled|id|ismap<ismap|lang|maxlength|name|onblur|onclick|ondblclick|onfocus|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|onselect|readonly<readonly|size|src|style|tabindex|title|type<button?checkbox?file?hidden?image?password?radio?reset?submit?text|usemap|value],select[class|dir<ltr?rtl|disabled<disabled|id|lang|multiple<multiple|name|onblur|onchange|onclick|ondblclick|onfocus|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|size|style|tabindex|title],ol[class|compact<compact|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|start|style|title|type],div[align<center?justify?left?right|class|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|style|title],li[class|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|style|title|type|value],iframe[src|width|height|name|align|frameborder|scrolling|marginheight|marginwidth]",

							fullscreen_new_window : true, 
							fullscreen_settings : 
							{ 
								theme_advanced_path_location : "top" 
							}, 
							relative_urls : false, 
							remove_script_host : false, 
							convert_urls : false, 
							visual : true, 
							gecko_spellcheck : true,
							TemplateLinkType : "32",
							content_css : ns1blankspace.xhtml.editorCSS,
							
							external_link_list_url : "/ondemand/core/?method=CORE_EDITOR_LINK_SEARCH", 
							external_image_list_url : "/ondemand/core/?method=CORE_EDITOR_LINK_SEARCH&object=19&objectcontext=" + ns1blankspace.objectContext, 
							media_external_list_url : "/ondemand/core/?method=CORE_EDITOR_LINK_SEARCH&object=19&objectcontext=" + ns1blankspace.objectContext
						});				
					
					}
				},

	addTag:		function (oParam)
				{ 
					var sXHTMLElementID;
					var sEditorID;
					var oMCEBookmark;
					
					if (oParam != undefined)
					{
						if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
						if (oParam.editorID != undefined) {sEditorID = oParam.editorID}
						if (oParam.mceBookmark != undefined) {oMCEBookmark = oParam.mceBookmark}
						
						var oEditor = tinyMCE.get(sEditorID); 
						var sInsertText = $('#' + sXHTMLElementID).attr('data-caption');
						if (oMCEBookmark != undefined)
						{
							tinyMCE.get(sEditorID).selection.moveToBookmark(oMCEBookmark);
						}
						oEditor.execCommand('mceInsertContent', false, sInsertText); 
					}
					else
					{
						ns1blankspaceConfim({title: 'Error inserting field!', html: ["An error occurred when inserting the field. Please contact support." +
																					  "<br /><br />Details: No parameters passed to ns1blankspaceEditorAddTag"]});
						return false;
					}
				}
}

ns1blankspace.format.tree = 
{
	init: 		function (oParam)
				{
					var sXHTMLElementID;
					var oDataRoot;
					var sXHTMLElementContext = '';

					if (oParam != undefined)
					{
						if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
						if (oParam.dataRoot != undefined) {oDataRoot = oParam.dataRoot}
						if (oParam.xhtmlElementContext != undefined) {sXHTMLElementContext = oParam.xhtmlElementContext}
					}

					if ($('#' + sXHTMLElementID + ' .ns1blankspaceTreeRoot').length == 0)
					{	
						var aHTML = [];

						aHTML.push('<table id="ns1blankspaceTree_' + sXHTMLElementID + '"" class="ns1blankspaceContainer ns1blankspaceTreeRoot">');

						if (oDataRoot)
						{
							$(oDataRoot).each(function(i) 
							{
								aHTML.push('<tr><td id="ns1blankspaceRow' + sXHTMLElementContext + '-' + i + '" class="ns1blankspaceRow" style="width: 100%;"></td></tr>');
							});

						}
						else
						{
							aHTML.push('<tr><td id="ns1blankspaceRow' + sXHTMLElementContext + '-1" class="ns1blankspaceRow" style="width: 100%;"></td></tr>');
						}

						aHTML.push('</table>');

						$('#' + sXHTMLElementID).html(aHTML.join(''))

						ns1blankspace.format.tree.root(oParam);

						//if (ns1blankspace.format.initStatus == undefined)
						//{
							$('#' + sXHTMLElementID).off('mouseup', '.ns1blankspaceParent');
							$('#' + sXHTMLElementID).on('mouseup', '.ns1blankspaceParent', function(event)
							{
								oParam.xhtmlElementID = (event.target.id ? event.target.id : event.target.parentElement.id);
								ns1blankspace.format.tree.branch(oParam);
							});

							$('#' + sXHTMLElementID).off('mouseup', '.ns1blankspaceRoot');
							$('#' + sXHTMLElementID).on('mouseup', '.ns1blankspaceRoot', function(event)
							{
								oParam.xhtmlElementID = (event.target.id ? event.target.id : event.target.parentElement.id);
								oParam.shaded = true;
								ns1blankspace.format.tree.branch(oParam);
							});

							ns1blankspace.format.initStatus = 1;
						}	
					//}
				},
				
	root: 	function(oParam)
				{	
					var sXHTMLElementID;
					var oDataRoot;
					var oDataTree;
					var sXHTMLElementContext = '';
					
					if (oParam != undefined)
					{
						if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
						if (oParam.dataRoot != undefined) {oDataRoot = oParam.dataRoot}
						if (oParam.dataTree != undefined) {oDataTree = oParam.dataTree}
						if (oParam.xhtmlElementContext != undefined) {sXHTMLElementContext = oParam.xhtmlElementContext}
					}

					if (oDataRoot)
					{
						$(oDataRoot).each(function(i) 
						{
							var aHTML = [];

							aHTML.push('<table>' +
											'<tr><td id="ns1blankspace' + sXHTMLElementContext + '_' + i + '-1" data-title="' + (this.title?this.title:'') + '" data-id="' + (this.id?this.id:'') + '" class="' +
											(this.class ? this.class : 'ns1blankspaceRoot') + '" style="width:150px;">' +
											(this.xhtml ? this.xhtml : this.title) +
											'</td>' +
											'<td id="ns1blankspace' + sXHTMLElementContext + '_' + i + '-2" data-parent-id="' + (this.id?this.id:'') + '"class="' + (this.class ? this.class : 'ns1blankspaceChild') + '"></td></tr>' +
											'</table>');

							$('#' + sXHTMLElementID + ' #ns1blankspaceRow' + sXHTMLElementContext + '-' + i).html(aHTML.join(''))

						});
					}				
				},

	branch: 	function(oParam)
				{	
					var sXHTMLElementID;
					var iParentID;
					var oDataTree;
					var oDataBranch;
					var oDataRoot;
					var sXHTMLElementContext = '';
					var sBranchDetailName = 'amount'
					var sParentClass;
					var sClass = '';
					var bShaded = false;

					if (oParam != undefined)
					{
						if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
						if (oParam.xhtmlElementContext != undefined) {sXHTMLElementContext = oParam.xhtmlElementContext}
						if (oParam.dataTree != undefined) {oDataTree = oParam.dataTree}
						if (oParam.dataBranch != undefined) {oDataBranch = oParam.dataBranch}
						if (oParam.dataRoot != undefined) {oDataRoot = oParam.dataRoot}
						if (oParam.branchDetailName != undefined) {sBranchDetailName = oParam.branchDetailName}
						if (oParam.shaded != undefined)
						{
							bShaded = oParam.shaded;
							oParam.shaded = false;
						}
					}

					iParentID = $('#' + sXHTMLElementID).attr('data-id');
					sTitle = $('#' + sXHTMLElementID).attr('data-title');
					var oDataTreeChild = $.grep(oDataTree, function (a) {return parseInt(a.parentaccount) == parseInt(iParentID);})

					var oDataRootBranch = $.grep(oDataRoot, function (a) {return a.title == sTitle;})[0];

					if (oDataRootBranch)
					{
						if (oDataRootBranch.filter)
						{
							var oDataTreeChild = $.grep(oDataTreeChild, oDataRootBranch.filter)
						}
					}

					var aHTML= [];

					if (oDataTreeChild.length > 0)
					{
						if ($('#' + sXHTMLElementID).attr('data-tree-type') == "2")
						{
							var sHTML = $('#' + sXHTMLElementID + ' .ns1blankspaceTreeSubContext').html();
							
							if (sHTML)
							{
								$('#' + sXHTMLElementID).next("td").html(sHTML);
								$('#' + sXHTMLElementID + ' .ns1blankspaceTreeSubContext').html('');
								$('#' + sXHTMLElementID).next("td").css('text-align', 'right');
							}
							else
							{
								$('#' + sXHTMLElementID).next("td").html('&nbsp;');
							}

							$('#' + sXHTMLElementID).attr('data-tree-type', '1');
						}
						else
						{
							var sHTML = $('#' + sXHTMLElementID).next("td").html();
							$('#' + sXHTMLElementID + ' .ns1blankspaceTreeSubContext').html(sHTML)
							$('#' + sXHTMLElementID).attr('data-tree-type', '2'); 
						
							aHTML.push('<table>');

							$(oDataTreeChild).each(function(i, k) 
							{
								if (bShaded)
								{
									if (sClass == '')
									{
										sClass = ' ns1blankspaceRowShaded';
									}
									else
									{
										sClass = '';
									}
								}

								var oDataTreeHasChild = $.grep(oDataTree, function (a) {return parseInt(a.parentaccount) == parseInt(k.id);})[0]
								if (oDataTreeHasChild) {sParentClass = 'ns1blankspaceParent ' } else {sParentClass = ''}

								var oDataBranchChild = $.grep(oDataBranch, function (a) {return parseInt(a.financialaccount) == parseInt(k.id);})[0]

								if (oDataBranchChild)
								{
									aHTML.push('<tr><td id="' + sXHTMLElementID + '_' + i + '-1" data-tree-type="1" data-id="' + this.id + '" class="' + sParentClass + 'ns1blankspaceTreeColumn1' + sClass + '">' +
												this.title +
												'<br /><span class="ns1blankspaceSub ns1blankspaceTreeSubContext">' +
												'</td>' +
												'<td id="' + sXHTMLElementID + '_' + i + '-2" data-parent-id="' + this.id + '" class="ns1blankspaceChild ns1blankspaceTreeColumn2' + sClass + '" style="text-align: right;">');

									aHTML.push(oDataBranchChild[sBranchDetailName]);

									$('#' + sXHTMLElementID).next("td").css('text-align', 'left');
								}
								else
								{
									aHTML.push('<tr><td id="' + sXHTMLElementID + '_' + i + '-1" data-tree-type="1" data-id="' + this.id + '" class="' + sParentClass + 'ns1blankspaceTreeColumn1' + sClass + '" >' +
												this.title +
												'<br /><span class="ns1blankspaceSub ns1blankspaceTreeSubContext">' +
												'</td>' +
												'<td id="' + sXHTMLElementID + '_' + i + '-2" data-parent-id="' + this.id + '" class="ns1blankspaceChild ns1blankspaceTreeColumn2' + sClass + '" style="text-align: right; color: #CCCCCC">-&nbsp;');

									$('#' + sXHTMLElementID).next("td").css('text-align', 'left');
								}
								
								aHTML.push('</td></tr>');
							});

							aHTML.push('</table>');

							$('#' + sXHTMLElementID).next("td").html(aHTML.join(''));
						}	
					}
					else
					{
						var oDataBranchChild = $.grep(oDataBranch, function (a) {return parseInt(a.financialaccount) == parseInt(iParentID);})[0]

						if (oDataBranchChild)
						{
							$('#' + sXHTMLElementID).next("td").html(oDataBranchChild[sBranchDetailName]);
						}
					}			
				}


}



