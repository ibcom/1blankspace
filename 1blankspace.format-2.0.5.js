/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
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
				caption: "Outstanding Amount",
				source: "invoice.outstandingamount"
			},
			{
				object: 5,
				type: 1,
				caption: "Receipted Amount",
				source: "invoice.receiptamount"
			},
			{
				object: 5,
				type: 1,
				caption: "Credit Note Amount",
				source: "invoice.creditamount"
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
			},
			{
				object: 175,
				type: 1,
				caption: "Name",
				source: "debtorname"
			},
			{
				object: 175,
				type: 1,
				caption: "Outstanding Amount",
				source: "total"
			},
			{
				object: 175,
				type: 1,
				caption: "Last Receipt Date",
				source: "lastreceiptdate"
			},
			{
				object: 175,
				type: 1,
				caption: "Last Receipt Amount",
				source: "lastreceiptamount"
			},
			{
				object: 175,
				type: 2,
				caption: "Invoice Amount",
				source: "invoice.amount"
			},
			{
				object: 175,
				type: 2,
				caption: "Invoice Outstanding Amount",
				source: "invoice.outstandingamount"
			},
			{
				object: 175,
				type: 2,
				caption: 'Invoice Reference',
				source: 'invoice.reference'
			},
			{
				object: 175,
				type: 2,
				caption: 'Invoice Date',
				source: 'invoice.sentdate'
			},
			{
				object: 175,
				type: 2,
				caption: 'Invoice Date Due',
				source: 'invoice.duedate'
			},
			{
				object: 37,
				type: 1,
				caption: 'Business Name',
				source: 'contactbusinesstext'
			},
			{
				object: 37,
				type: 1,
				caption: 'Year',
				source: 'year'
			},
			{
				object: 37,
				type: 1,
				caption: 'First Name',
				source: 'employee.contactperson.firstname'
			},
			{
				object: 37,
				type: 1,
				caption: 'Last Name',
				source: 'employee.contactperson.surname'
			},
			{
				object: 37,
				type: 1,
				caption: 'TFN',
				source: 'employee.taxfilenumber'
			},
			{
				object: 37,
				type: 1,
				caption: 'Gross Salary',
				source: 'employee.grosssalary'
			},
			{
				object: 37,
				type: 1,
				caption: 'Net Salary',
				source: 'employee.netsalary'
			},
			{
				object: 37,
				type: 1,
				caption: 'Tax Before Rebate',
				source: 'employee.taxbeforerebate'
			},
			{
				object: 37,
				type: 1,
				caption: 'Superannuation',
				source: 'employee.superannuation'
			},
			{
				object: 37,
				type: 1,
				caption: 'Start Date',
				source: 'startdate'
			},
			{
				object: 37,
				type: 1,
				caption: 'End Date',
				source: 'enddate'
			},
			{
				object: 37,
				type: 1,
				caption: 'Street Address 1',
				source: 'employee.contactperson.streetaddress1'
			},
			{
				object: 37,
				type: 1,
				caption: 'Street Address 2',
				source: 'employee.contactperson.streetaddress2'
			},
			{
				object: 37,
				type: 1,
				caption: 'Street Postcode',
				source: 'employee.contactperson.streetpostcode'
			},
			{
				object: 37,
				type: 1,
				caption: 'Street Suburb',
				source: 'employee.contactperson.streetsuburb'
			},
			{
				object: 37,
				type: 1,
				caption: 'Email',
				source: 'employee.contactperson.email'
			},
			{
				object: 37,
				type: 2,
				caption: 'Pay Gross Salary',
				source: 'grosssalary'
			},
			{
				object: 37,
				type: 2,
				caption: 'Pay Net Salary',
				source: 'netsalary'
			},
			{
				object: 37,
				type: 2,
				caption: 'Pay Superannuation',
				source: 'superannuation'
			},
			{
				object: 37,
				type: 2,
				caption: 'Pay Deductions',
				source: 'deductions'
			},		
			{
				object: 37,
				type: 2,
				caption: 'Pay Date',
				source: 'payrecord.payperiod.paydate'
			},
			{
				object: 371,
				type: 1,
				caption: 'Pay Slip Business Name',
				source: 'contactbusinesstext'
			},
			{
				object: 371,
				type: 1,
				caption: 'Pay Slip First Name',
				source: 'payrecord.employee.contactperson.firstname'
			},
			{
				object: 371,
				type: 1,
				caption: 'Pay Slip Last Name',
				source: 'payrecord.employee.contactperson.surname'
			},
			{
				object: 371,
				type: 1,
				caption: 'Pay Slip TFN',
				source: 'payrecord.employee.taxfilenumber'
			},
			{
				object: 371,
				type: 1,
				caption: 'Pay Slip Gross Salary',
				source: 'payrecord.grosssalary'
			},
			{
				object: 371,
				type: 1,
				caption: 'Pay Slip Net Salary',
				source: 'payrecord.netsalary'
			},
			{
				object: 371,
				type: 1,
				caption: 'Pay Slip Tax Before Rebate',
				source: 'payrecord.taxbeforerebate'
			},
			{
				object: 371,
				type: 1,
				caption: 'Pay Slip Superannuation',
				source: 'payrecord.superannuation'
			},
			{
				object: 371,
				type: 1,
				caption: 'Pay Slip Start Date',
				source: 'payrecord.payperiod.startdate'
			},
			{
				object: 371,
				type: 1,
				caption: 'Pay Slip Pay Date',
				source: 'payrecord.payperiod.paydate'
			},
			{
				object: 371,
				type: 2,
				caption: 'Pay Slip Item Type',
				source: 'typetext'
			},
			{
				object: 371,
				type: 2,
				caption: 'Pay Slip Item Hours',
				source: 'hours'
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
	var iObject = ns1blankspace.object;
	var iObjectContext = ns1blankspace.objectContext;
	var aSourceMethods = [];
	var oObjectData = ns1blankspace.objectContextData;
	var oObjectOtherData;

	if (oParam != undefined)
	{
		if (oParam.xhtmlTemplate != undefined) {sXHTMLTemplate = oParam.xhtmlTemplate}
		if (oParam.object != undefined) {iObject = oParam.object}
		if (oParam.objectContext != undefined) {iObjectContext = oParam.objectContext}
		if (oParam.objectData != undefined) {oObjectData = oParam.objectData}
		if (oParam.objectOtherData != undefined) {oObjectOtherData = oParam.objectOtherData}		
	}

	sXHTMLTemplate = (sXHTMLTemplate).replace(/\[\[/g,'<span class="template">');
	sXHTMLTemplate = (sXHTMLTemplate).replace(/\]\]/g,'</span>');

	var oXHTML;

	$(ns1blankspace.xhtml.container).html(sXHTMLTemplate)
	oXHTML = $(ns1blankspace.xhtml.container);

	var aXHTML = [];

	$('span.template', oXHTML).each(function(i,e) 
	{
		var oTemplateTag = $.grep(ns1blankspace.format.tags, function (a) { return a.caption == $(e).html() && a.object == iObject; })

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

				if (oObjectData[sSource])
				{	
					$(e).html(oObjectData[sSource]);
				}
				else
				{
					var aSource = (sSource).split('.');
					sSource = aSource[aSource.length-1];

					if (oObjectData[sSource])
					{	
						$(e).html(oObjectData[sSource]);
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

	//TYPE = 2 - subtables - need to gather up

	var sHTML = $(oXHTML).html();

	if (aSourceMethods.length != 0)
	{	
		$(aSourceMethods).each(function() 
		{
			if (oObjectOtherData === undefined)
			{
				var oSearch = new AdvancedSearch();
				oSearch.method = this.method;
				oSearch.addField('*');
				oSearch.addFilter('object', 'EQUAL_TO', iObject);
				oSearch.addFilter('objectcontext', 'EQUAL_TO', iObjectContext);
				oSearch.sort('id', 'desc');

				var oTmp = {group: this.group};
				oSearch.getResults(function(oResponse) {ns1blankspace.format.process(oTmp, oResponse.data.rows)});

			}
			else
			{
				oParam.group = this.group;
				oParam.xhtml = sHTML;
				sHTML = ns1blankspace.format.process(oParam, oObjectOtherData)
			}
		});
	}	

	return sHTML;
};

ns1blankspace.format.process = function (oParam, oResponse)
{
	var oXHTML = document;

	if (ns1blankspace.util.param(oParam, 'xhtml').exists)
	{
		$(ns1blankspace.xhtml.container).html(ns1blankspace.util.param(oParam, 'xhtml').value)
		oXHTML = $(ns1blankspace.xhtml.container);
	}

	var aTR = [];
	var sTRID = 'template-' + oParam.group;

	$('[data-format-source-group="' + oParam.group + '"]', oXHTML).each(function(i) 
	{
		$('[data-format-source-group="' + oParam.group + '"]:first', oXHTML).closest('tr').clone()

		var oTR = $(this).closest('tr');
		var sTRXHTML = $(oTR).html();
		$(oTR).addClass(sTRID);

		$(sTRXHTML).each(function()
		{
			$(this).find('span.template').each(function(i,e) 
			{
				$(e).html($(e).attr('data-format-source'));
			});

			aTR.push($(this).html());
		});
	});	

	sTRXHTML = aTR.join('');

	$(oResponse).each(function()
	{	
		var oRow = this;

		var oTRClone = $('[data-format-source-group="' + oParam.group + '"]:first', oXHTML).closest('tr').clone();

		oTRClone.find('[data-format-source]').each(function()
			{
				var sSource = $(this).attr('data-format-source');

				if (oRow[sSource])
				{	
					$(this).html(oRow[sSource]);
				}
				else
				{
					var aSource = (sSource).split('.');
					sSource = aSource[aSource.length-1];

					if (oRow[sSource])
					{	
						$(this).html(oRow[sSource]);
					}
				}	
			})

		$('[data-format-source-group="' + oParam.group + '"]:first', oXHTML).closest('tr').parent().after(oTRClone);
			
	});

	$('[data-format-source-group="' + oParam.group + '"]:first', oXHTML).closest('tr').remove();

	if (ns1blankspace.util.param(oParam, 'xhtml').exists)
		{return oXHTML.html()};
};

ns1blankspace.format.editor = 
{
	init:		function (oParam)
				{
					var sHeight = ns1blankspace.util.getParam(oParam, 'height', {"default": '370px'}).value;
					var sWidth = ns1blankspace.util.getParam(oParam, 'width', {"default": '100%'}).value;
					var bDynamicTags = ns1blankspace.util.getParam(oParam, 'dynamicTags', {"default": false}).value;
					var sVersion = ns1blankspace.util.getParam(oParam, 'version').value;
					var sTheme = ns1blankspace.util.getParam(oParam, 'theme', {"default": 'advanced'}).value;
					var sXHTMLElement = ns1blankspace.util.getParam(oParam, 'xhtmlElement', {"default": 'textarea'}).value;
					var sSelector = ns1blankspace.util.getParam(oParam, 'selector', {"default": sXHTMLElement}).value;
					var iObject = ns1blankspace.util.getParam(oParam, 'object', {"default": '32'}).value;
					var aToolbars = ns1blankspace.util.getParam(oParam, 'toolbars').value;
					var bSimple = ns1blankspace.util.getParam(oParam, 'simple', {"default": false}).value;
					var oInit = ns1blankspace.util.getParam(oParam, 'init').value;
					var fOnInit = ns1blankspace.util.getParam(oParam, 'onInit').value;
					var sContentCSS = ns1blankspace.util.getParam(oParam, 'contentCSS').value;

					var sAdditional = '';

					if (sVersion == undefined && tinyMCE != undefined )
					{
						sVersion = tinyMCE.majorVersion;
					}

					if (sTheme == 'advanced' && sVersion == '4') {sTheme = 'modern'}

					if (ns1blankspace.option.richTextEditing)
					{
						if (bDynamicTags) {sAdditional = 'dynamicTags,'}

						if (sVersion == '4')
						{	
							if (oInit == undefined)
							{	
								oInit = 
								{
									selector: sSelector,
									theme: "modern",
									skin: 'light',
									height : sHeight, 
									width : sWidth,
									plugins:
									[
														"advlist autolink autosave link image lists charmap print preview hr anchor pagebreak",
														"searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
														"table contextmenu directionality emoticons template textcolor paste fullpage textcolor colorpicker textpattern"
									],

									menubar: false,
									statusbar : false,
									toolbar_items_size: 'small',

									style_formats:
									[
													{title: 'Bold text', inline: 'b'}
									],

									templates: '/ondemand/core/?method=CORE_DYNAMIC_TAG_SEARCH',
									link_list: '/rpc/core/?method=CORE_EDITOR_LINK_SEARCH',
									image_list: '/rpc/core/?method=CORE_EDITOR_IMAGE_SEARCH',

									browser_spellcheck: true,
									content_css: sContentCSS,
									
									convert_urls: false
								}

								if (bSimple)
								{
									oInit.toolbar1 = 'bold italic underline | alignleft aligncenter alignright alignjustify | fontselect fontsizeselect';
									oInit.toolbar2 = 'forecolor backcolor | cut copy paste | bullist numlist | outdent indent blockquote | undo redo | link unlink anchor image media code';
								}	
								else
								{	
									if (aToolbars == undefined)
									{
										oInit.toolbar1 = 'bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | formatselect fontselect fontsizeselect | fullscreen';
							        	oInit.toolbar2 = 'forecolor backcolor | cut copy paste | bullist numlist | outdent indent blockquote | undo redo | link unlink anchor image media code';
							        	oInit.toolbar3 = 'table | hr removeformat | subscript superscript | charmap emoticons | ltr rtl | visualchars visualblocks nonbreaking pagebreak | template';
									}
									else
									{
										$.each(aToolbars, function (t, toolbar)
										{
											oInit['toolbar' + (t+1)] = toolbar;
										});
									}
								}

								if (fOnInit != undefined)
								{
									oInit.init_instance_callback = fOnInit;
								}	
							}	
						}
						else if (sVersion == '3')
						{
							var oInit = 
							{
								mode : "none",
								height : sHeight, 
								width : "100%",
								theme : sTheme,

								theme_advanced_path : false,

								plugins : "table,advimage,advlink,emotions,iespell,insertdatetime," + sAdditional + "preview,media,fullscreen,print,visualchars,nonbreaking,pagebreak,style,paste,searchreplace,print,contextmenu", 

								theme_advanced_buttons1_add_before : "forecolor,backcolor", 
								theme_advanced_buttons1_add : "fontselect,fontsizeselect", 
						 
								theme_advanced_buttons2_add : "separator,insertdate,inserttime,preview,zoom,separator,nonbreaking,pagebreak", 
								theme_advanced_buttons2_add_before: "cut,copy,paste,pasteword,separator,search,replace,separator", 
								
								theme_advanced_buttons3_add_before : "tablecontrols,separator", 
								theme_advanced_buttons3_add : "emotions,iespell,fullscreen,print," + sAdditional + "media,selectall,advhr",
						 
								plugin_insertdate_dateFormat : "%d-%m-%y", 
								plugin_insertdate_timeFormat : "%H:%M:%S", 
							
								theme_advanced_toolbar_location : "top",
								theme_advanced_toolbar_align : "left",
								theme_advanced_resizing : true,
							
								font_size_style_values : "8pt,10pt,12pt,14pt,18pt,24pt,36pt",
								
								extended_valid_elements : "style,input[accept|accesskey|align<bottom?left?middle?right?top|alt|checked<checked|class|dir<ltr?rtl|disabled<disabled|id|ismap<ismap|lang|maxlength|name|onblur|onclick|ondblclick|onfocus|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|onselect|readonly<readonly|size|src|style|tabindex|title|type<button?checkbox?file?hidden?image?password?radio?reset?submit?text|usemap|value],select[class|dir<ltr?rtl|disabled<disabled|id|lang|multiple<multiple|name|onblur|onchange|onclick|ondblclick|onfocus|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|size|style|tabindex|title],ol[class|compact<compact|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|start|style|title|type],div[align<center?justify?left?right|class|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|style|title],li[class|dir<ltr?rtl|id|lang|onclick|ondblclick|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|style|title|type|value],iframe[src|width|height|name|align|frameborder|scrolling|marginheight|marginwidth],article,section",

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
								TemplateLinkType : iObject,
								content_css : ns1blankspace.xhtml.editorCSS,
								
								external_link_list_url : "/ondemand/core/?method=CORE_EDITOR_LINK_SEARCH", 
								external_image_list_url : "/ondemand/core/?method=CORE_EDITOR_IMAGE_SEARCH&object=19&objectcontext=" + ns1blankspace.objectContext, 
								media_external_list_url : "/ondemand/core/?method=CORE_EDITOR_MEDIA_SEARCH&object=19&objectcontext=" + ns1blankspace.objectContext
							}
						}	

						tinyMCE.init(oInit);								
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
					var fOnLastChild;
					var sLastChildElementID;
					var bShowAll = ns1blankspace.util.getParam(oParam, 'showAll', {"default": false}).value;

					if (oParam != undefined)
					{
						if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
						if (oParam.dataRoot != undefined) {oDataRoot = oParam.dataRoot}
						if (oParam.xhtmlElementContext != undefined) {sXHTMLElementContext = oParam.xhtmlElementContext}
						if (oParam.onLastChild != undefined) {fOnLastChild = oParam.onLastChild}
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

						if (fOnLastChild)
						{	
							$('#' + sXHTMLElementID).off('mouseup', '.ns1blankspaceLastChild');
							$('#' + sXHTMLElementID).on('mouseup', '.ns1blankspaceLastChild', function(event)
							{
								sLastChildElementID = event.target.id;
								
								fOnLastChild(
								{
									xhtmlElementID: sLastChildElementID,
									id: $(this).attr('data-id')
								});
							});
						}	

						ns1blankspace.format.initStatus = 1;
						
						if (bShowAll)
						{
							oParam.isDataRoot = true;
							ns1blankspace.format.tree.show(oParam);
						}	
						
					}	
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
											(this["class"] ? this["class"] : 'ns1blankspaceRoot') + '" style="width:150px;">' +
											(this.xhtml ? this.xhtml : this.title) +
											'</td>' +
											'<td id="ns1blankspace' + sXHTMLElementContext + '_' + i + '-2" data-parent-id="' + (this.id?this.id:'') + '"class="' + (this["class"] ? this["class"] : 'ns1blankspaceChild') + '"></td></tr>' +
											'</table>');

							$('#' + sXHTMLElementID + ' #ns1blankspaceRow' + sXHTMLElementContext + '-' + i).html(aHTML.join(''))

						});
					}				
				},

	branch: 	function(oParam)
				{	
					var sXHTMLElementID;
					var iParentID = ns1blankspace.util.getParam(oParam, 'parentID').value;
					var oDataTree;
					var oDataBranch;
					var oDataRoot;
					var sXHTMLElementContext = '';
					var sBranchDetailName = 'amount'
					var sParentClass;
					var sClass = '';
					var bShaded = false;
					var sTitle = ns1blankspace.util.getParam(oParam, 'title').value;

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

					if (iParentID == undefined) {iParentID = $('#' + sXHTMLElementID).attr('data-id')};
					if (sTitle == undefined) {sTitle = $('#' + sXHTMLElementID).attr('data-title')};

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

								var oDataTreeHasChild = $.grep(oDataTree, function (a) {return parseInt(a.parentaccount) == parseInt(k.id);})[0];
								if (oDataTreeHasChild) {sParentClass = 'ns1blankspaceParent ' } else {sParentClass = 'ns1blankspaceLastChild '}

								var oDataBranchChild = $.grep(oDataBranch, function (a) {return parseInt(a.financialaccount) == parseInt(k.id);})[0]

								if (oDataBranchChild)
								{
									aHTML.push('<tr id="' + sXHTMLElementID + '_' + i + '"><td id="' + sXHTMLElementID + '_' + i + '-1" data-tree-type="1" data-id="' + this.id + '"' +
												' data-title="' + k.title + '" class="' + sParentClass + 'ns1blankspaceTreeColumn1' + sClass + '">' +
												this.title +
												'<br /><span class="ns1blankspaceSub ns1blankspaceTreeSubContext">' +
												'</td>' +
												'<td id="' + sXHTMLElementID + '_' + i + '-2" data-parent-id="' + this.id + '" class="ns1blankspaceChild ns1blankspaceTreeColumn2' + sClass + '" style="text-align: right;">');

									aHTML.push(oDataBranchChild[sBranchDetailName]);

									$('#' + sXHTMLElementID).next("td").css('text-align', 'left');
								}
								else
								{
									aHTML.push('<tr id="' + sXHTMLElementID + '_' + i + '"><td id="' + sXHTMLElementID + '_' + i + '-1" data-tree-type="1" data-id="' + this.id + '"' +
												' data-title="' + k.title + '" class="' + sParentClass + 'ns1blankspaceTreeColumn1' + sClass + '" >' +
												k.title +
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
				},

	show: 		function (oParam)
				{
					var oData;
					var sClass = '.ns1blankspaceParent';

					if (oParam.isDataRoot)
					{
						oData = oParam.dataRoot;
						sClass = '.ns1blankspaceRoot';
					}
					else
					{
						oData = oParam.dataBranch;
					}

					$($.grep(oData, function (dR) {return dR.id != undefined})).each(function(i, dataRoot) 
					{
						oParam.xhtmlElementID = $(sClass + '[data-title="' + dataRoot.title + '"]').attr('id');
						oParam.parentID = dataRoot.id;
						oParam.shaded = $(sClass + '[data-title="' + dataRoot.title + '"]').hasClass('ns1blankspaceRoot');

						ns1blankspace.format.tree.branch(oParam);
					});

					var oDataBranch = $('.ns1blankspaceParent[data-tree-type="1"]').map(function (a)
					{
						var oReturn = {};
						oReturn.id = $(this).attr('data-id');
						oReturn.title = $(this).attr('data-title');
						return oReturn;
					});
					
					if (oDataBranch.length != 0)
					{
						var oParamBranch = $.extend(true, oParam, {});
						oParamBranch.isDataRoot = false;
						oParamBranch.dataBranch = oDataBranch;
						ns1blankspace.format.tree.show(oParamBranch);
					}
				}	
}

ns1blankspace.format.templates = 
{
	data: 		{},

	convert:  	function (oParam)
				{
					var iObject = ns1blankspace.util.getParam(oParam, 'object').value;
					
					var oSearch = new AdvancedSearch();
					oSearch.method = 'DOCUMENT_SEARCH';
					oSearch.addField('title,content');
					oSearch.addFilter('type', 'EQUAL_TO', 10);
					oSearch.addFilter('object', 'IS_NULL');
					oSearch.addFilter('title', 'TEXT_IS_LIKE', 'TEMPLATE');
					
					oSearch.getResults(function(oResponse)
					{
						if (oResponse.data.rows.length == 0)
						{
							ns1blankspace.util.onComplete(oParam);
						}	
						else
						{
							$.each(oResponse.data.rows, function (r, row)
							{
								var oData = {id: row.id}

								if (row.title.indexOf('INVOICE') >= 0) {oData.object = 5}
								if (row.title.indexOf('STATEMENT') >= 0) {oData.object = 175}
								if (row.title.indexOf('PAYSLIP') >= 0) {oData.object = 371}
								if (row.title.indexOf('PAYROLL') >= 0) {oData.object = 37}
								
								$.ajax(
								{
									type: 'POST',
									url: ns1blankspace.util.endpointURI('DOCUMENT_MANAGE'),
									data: oData,
									success: function ()
									{
										if (r == oResponse.data.rows.length-1)
										{	
											ns1blankspace.util.onComplete(oParam);
										}	
									}
								});
							});
						}	
					});	
				},

	init:  		function (oParam)
				{
					var iObject = ns1blankspace.util.getParam(oParam, 'object').value;
					var bRefresh = ns1blankspace.util.getParam(oParam, 'refresh', {"default": false}).value;
					var bNew = ns1blankspace.util.getParam(oParam, 'new', {"default": true}).value;

					if (ns1blankspace.format.templates.data[iObject] == undefined || bRefresh)
					{
						ns1blankspace.format.templates.data[iObject] == [];

						var oSearch = new AdvancedSearch();
						oSearch.method = 'DOCUMENT_SEARCH';
						oSearch.addField('title,content');
						oSearch.addFilter('type', 'EQUAL_TO', 10);
						oSearch.addFilter('object', 'EQUAL_TO', iObject);
						
						oSearch.getResults(function(oResponse)
						{
							if (oResponse.data.rows.length == 0)
							{
								if (bNew)
								{ 
									ns1blankspace.format.templates.new(oParam);
								}
								else
								{
									ns1blankspace.util.onComplete(oParam);
								}	
							}
							else
							{
								ns1blankspace.format.templates.data[iObject] = oResponse.data.rows;

								$.each(ns1blankspace.format.templates.data[iObject], function (t, template)
								{	
									template.xhtml = (template.content).formatXHTML();
								});

								ns1blankspace.util.onComplete(oParam);
							}
						});		
					}
					else
					{
						ns1blankspace.util.onComplete(oParam);
					}
				},

	get: 		function (oParam)
				{
					var iObject = ns1blankspace.util.getParam(oParam, 'object').value;
					var iDocument = ns1blankspace.util.getParam(oParam, 'document').value;
					var oTemplate, aTemplate;

					if (iObject != undefined)
					{	
						aTemplate = ns1blankspace.format.templates.data[iObject];

						if (iDocument != undefined)
						{
							aTemplate = $.grep(aTemplate, function (template) {return template.id == iDocument});
						}	

						if (aTemplate.length != 0) {oTemplate = aTemplate[0]}
					}

					return oTemplate
				},		

	"new": 		function (oParam)
				{
					var sTemplate = ns1blankspace.util.getParam(oParam, 'template', {"default": 'invoice'}).value;
					var iObject = ns1blankspace.util.getParam(oParam, 'object').value;

					$.ajax(
					{
						type: 'GET',
						url: ns1blankspace.xhtml.templates.source[sTemplate],
						dataType: 'text',
						global: false,
						success: function(data)
						{
							oParam = ns1blankspace.util.setParam(oParam, 'content', data);
							ns1blankspace.format.templates.save(oParam);
						},
						error: function(data)
						{
							oParam = ns1blankspace.util.setParam(oParam, 'content', '');
							ns1blankspace.format.templates.save(oParam);
						}
					});	
				},

	save:		function (oParam)
				{
					var sTemplate = ns1blankspace.util.getParam(oParam, 'template', {"default": 'invoice'}).value;
					var sContent = ns1blankspace.util.getParam(oParam, 'content').value;
					var iDocumentID = ns1blankspace.util.getParam(oParam, 'document').value;
					var iObject = ns1blankspace.util.getParam(oParam, 'object').value;

					ns1blankspace.status.working();

					var oData = 
					{
						id: iDocumentID,
						content: sContent,
						type: 10,
						object: iObject
					}

					if (iDocumentID == undefined)
					{
						sTitle = sTemplate.toUpperCase() + ' TEMPLATE';

						if (ns1blankspace.format.templates.data[iObject] != undefined)
						{	
							if (ns1blankspace.format.templates.data[iObject].length >= 1)
							{
								sTitle = sTitle + ' ' + (ns1blankspace.format.templates.data[iObject].length + 1)
							}
						}	

						oData.title = sTitle;
						oParam.refresh = true;
					}	

					$.ajax(
					{
						type: 'POST',
						url: ns1blankspace.util.endpointURI('DOCUMENT_MANAGE'),
						data: oData,
						dataType: 'json',
						success: function(data)
						{
							oParam = ns1blankspace.util.setParam(oParam, 'document', data.id);
							ns1blankspace.status.message('Saved');
							ns1blankspace.format.templates.init(oParam);
						}
					});	
				}	
}				





