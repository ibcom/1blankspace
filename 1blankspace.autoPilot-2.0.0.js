//Could put to canvas and then capture as image

var oAutoPilot = Get(.json)
var sXHTMLElementID;

.capture = function (oParam)
{
	$.each(oAutoPilot.flightplan, function (i, v)
	{
		sXHTMLElementID = (v.xhtmlElementID=undefined?'ns1blankspaceContainer':v.xhtmlElementID)

		v.method(v.param);
		
		//Capture the state of the view.
		if .capture = 'xhtml'
		{	
			v.xhtml = $('#' + v.sXHTMLID).html();
		}
		else
		{
			v.lastAjaxRequest = ns1blankspace.lastAjaxRequest;
			v.lastAjaxResponse = ns1blankspace.lastAjaxResponse;
		}
	});
}

.show = function (oParam)
{
	var iIndex = ns1blankspace.util.getParam(oParam. 'index', {"default": 0}).value;
	var sXHTMLElementID = ns1blankspace.util.getParam(oParam. 'xhtmlElementID', {"default": 'ns1blankspaceMain'}).value;

	$('#' + sXHTMLElementID).html(oAutoPilot.xhtml);  //SHOW THE Title etc also

}

.replay = function (oParam)
{
	var iIndex = ns1blankspace.util.getParam(oParam. 'index', {"default": 0}).value;

	if (iIndex < oAutopilot.length)
	{	
		.show()
		iIndex = iIndex + 1;
		window.timeout(3000, ".show({index: ' + iIndex + '})");
	}
}



