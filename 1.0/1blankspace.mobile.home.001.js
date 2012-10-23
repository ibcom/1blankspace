$(function()
{

});

function interfaceHomeViewport()
{
	//TODO: set up so shows actions, today, tomorrow, future,  overdue
	
	var aHTML = [];
	var h = -1;
	
	aHTML[++h] = '<table id="tableInterfaceMobileHomeViewport">';
	
	aHTML[++h] = '<tr>' +
						'<td id="tdInterfaceMobileHomeViewportAction">' +
						'Welcome ' + gsUserName +
						'</td>' +
						'</tr>';
					
	aHTML[++h] = '</table>';					
			
	$('#divInterfaceMain').html(aHTML.join(''));
	
	//TODO : interfaceMasterHomeViewportBind();
}

function interfaceMasterHomeViewportBind()
{
	
	$('#tdInterfaceViewportControlActionToday').click(function(event)
	{
		$('#tdInterfaceMainHomeColumn1').html(gsLoadingXHTML);
		gsHomeDefaultElementId = this.id;
		
		interfaceMasterHomeTodayActions({
			show: false,
			xhtmlElementId: 'tdInterfaceMainHomeColumn1',
			day: 0
			})
	});

	$('#tdInterfaceViewportControlActionTomorrow').click(function(event)
	{
		$('#tdInterfaceMainHomeColumn1').html(gsLoadingXHTML);
		gsHomeDefaultElementId = this.id;
		
		interfaceMasterHomeTodayActions({
			show: false,
			xhtmlElementId: 'tdInterfaceMainHomeColumn1',
			day: 1
			})
	});
	
	$('#tdInterfaceViewportControlActionOverdue').click(function(event)
	{
		$('#tdInterfaceMainHomeColumn1').html(gsLoadingXHTML);
		gsHomeDefaultElementId = this.id;
		
		interfaceMasterHomeTodayActions({
			show: false,
			xhtmlElementId: 'tdInterfaceMainHomeColumn1',
			overdue: true
			})
	});
	
	$('#tdInterfaceViewportControlActionFuture').click(function(event)
	{
		$('#tdInterfaceMainHomeColumn1').html(gsLoadingXHTML);
		gsHomeDefaultElementId = this.id;
		
		interfaceMasterHomeTodayActions({
			show: false,
			xhtmlElementId: 'tdInterfaceMainHomeColumn1',
			future: true
			})
	});
	
}	

