//STANDARD OBJECT TEMPLATE / FORMATTING
//type: 1=local primary object json, 2=remote mydigitalstructure object

/* 

PARSE 1 - PREP:

	<table><tr><td>[[Reference]]>/td></tr></table>
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
	gaTestHTML.push('<table><tr><td>[[Reference]]>/td></tr></table>');
	gaTestHTML.push('<table>');
	gaTestHTML.push('<tr><td>Item Reference</td><td>Amount</td></tr>');
	gaTestHTML.push('<tr><td>[[Item Reference]]</td><td>[[Item Amount]]</td></tr>');
	gaTestHTML.push('</table>');
}

function interfaceFormatInitialise()
{
	gaFormatTags =
		[
			{
				object: 5,
				type: 1
				caption: "Reference",
				source: "invoice.reference",
			},
			{
				object: 5,
				type: 2
				caption: "Item Reference",
				method: "FINANCIAL_ITEM_SEARCH",
				source: "item.reference"
			},
			{
				object: 5,
				type: 2
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

	sXHTMLTemplate = (sXHTMLTemplate).replace(/[[/g,'<div class="template">');
	sXHTMLTemplate = (sXHTMLTemplate).replace(/]]/g,'</div>');

	$('div.template', sXHTMLTemplate).each(function(i,k) 
	{

		var oTemplateTag = $.grep(gaFormatTags, function (a) { return a.caption == (k).html(); })

		this.attr('data-format-tag', oTemplateTag.caption;
		this.attr('data-format-source', oTemplateTag.source);
	});

	$(gaFormatTags).each(function() 
	{
		if (this.object == iObject && this.type == 2)
		{



		}
	});
}





