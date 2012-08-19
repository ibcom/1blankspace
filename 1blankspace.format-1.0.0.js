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

var gaFormatTags;
var gaTestHTML = [];

function interfaceFormatTestInitialise()
{
	gaTestHTML.push('<table><tr><td>[[Reference]]</td></tr></table>');
	gaTestHTML.push('<table>');
	gaTestHTML.push('<tr><td>Item Reference</td><td>Amount</td></tr>');
	gaTestHTML.push('<tr><td>[[Item Reference]]</td><td>[[Item Amount]]</td></tr>');
	gaTestHTML.push('</table>');

	interfaceFormatInitialise();

	return interfaceFormatRender({xhtmlTemplate: gaTestHTML.join('')});
}

function interfaceFormatInitialise()
{
	gaFormatTags =
		[
			{
				object: 5,
				type: 1,
				caption: "Reference",
				source: "invoice.reference"
			},
			{
				object: 5,
				type: 2,
				caption: "Item Reference",
				method: "FINANCIAL_ITEM_SEARCH",
				source: "item.reference"
			},
			{
				object: 5,
				type: 2,
				caption: "Item Amount",
				method: "FINANCIAL_ITEM_SEARCH",
				source: "item.amount"
			}		
			
		]		
}

function interfaceFormatRender(aParam)
{
	var sXHTMLTemplate;
	var sXHTMLRendered;
	var iObject;

	if (aParam != undefined)
	{
		if (aParam.xhtmlTemplate != undefined) {sXHTMLTemplate = aParam.xhtmlTemplate}
		if (aParam.object != undefined) {iObject = aParam.object}		
	}

	interfaceFormatInitialise();

	sXHTMLTemplate = (sXHTMLTemplate).replace(/\[\[/g,'<div class="template">');
	sXHTMLTemplate = (sXHTMLTemplate).replace(/\]\]/g,'</div>');

	var oXHTML = $(sXHTMLTemplate);
	var aXHTML = [];

	$(oXHTML).each(function()
	{
		$(this).find('div.template').each(function(i,e) 
		{
			var oTemplateTag = $.grep(gaFormatTags, function (a) { return a.caption == $(e).html(); })
			$(e).attr('data-format-tag', oTemplateTag[0].caption);
			$(e).attr('data-format-source', oTemplateTag[0].source);

			if (oTemplateTag[0].object == iObject && oTemplateTag[0].type == 1)
			{
				var sSource = oTemplateTag[0].source;

				if (goObjectContext[sSource])
				{	
					$(e).html(goObjectContext[sSource]);
				}
				else (goObjectContext[oTemplateTag[0].source])
				{
					var aSource = (sSource).split('.');
					sSource = aSource[aSource.length-1];

					if (goObjectContext[sSource])
					{	
						$(e).html(goObjectContext[sSource]);
					}
				}	
			}
		});

		aXHTML.push($(this).html())

	});
		
	//$(gaFormatTags).each(function() 
	//{
	//	if (this.object == iObject && this.type == 1)
	//	{
	//		$('[data-format-tag="' + this.caption + '"]').html(this.source);

	//	}
	//});

	return aXHTML.join('');
}

function interfaceFormatEditorInitialise(aParam)
{
	var sHeight = "370px";
	var bDynamicTags = false;
	var sAdditional = '';

	if (aParam != undefined)
	{
		if (aParam.height != undefined) {sHeight = aParam.height}
		if (aParam.dynamicTags != undefined) {bDynamicTags = aParam.dynamicTags}
	}

	if (gbRichEdit)
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
			content_css : gsEditorCSS,
			
			external_link_list_url : "/ondemand/core/?method=CORE_EDITOR_LINK_SEARCH", 
			external_image_list_url : "/ondemand/core/?method=CORE_EDITOR_LINK_SEARCH&object=19&objectcontext=" + giObjectContext, 
			media_external_list_url : "/ondemand/core/?method=CORE_EDITOR_LINK_SEARCH&object=19&objectcontext=" + giObjectContext, 

		});				
	
	}
}


