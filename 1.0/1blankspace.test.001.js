$(function()
{
})

function test_SETUP_ACTION_TYPE_SEARCH()
{
	var oSearch = new AdvancedSearch();
	oSearch.endPoint = 'setup';
	oSearch.method = 'SETUP_ACTION_TYPE_SEARCH';
	oSearch.addField('SystemType');
	oSearch.rf = 'xml';
	oSearch.addFilter('id', 'EQUAL_TO', 397);
	oSearch.getResults(function(data){alert(data)});
}		

function test_MESSAGING_CONVERSATION_POST_SEARCH()
{
	var oSearch = new AdvancedSearch();
	oSearch.endPoint = 'messaging';
	oSearch.method = 'MESSAGING_CONVERSATION_POST_SEARCH';
	oSearch.addField('Conversation,ConversationText,Message,Owner,OwnerText,Subject,createddate');
	oSearch.rf = 'xml';
	oSearch.addFilter('conversation', 'EQUAL_TO', 508);
	oSearch.getResults(function(data){alert(data)});
}		

//TEXT_IS_EQUAL_TO
//TEXT_IS_NOT_EQUAL_TO


function test_CONTACT_PERSON_EQUAL_TO()
{
	var oSearch = new AdvancedSearch();
	oSearch.method = 'CONTACT_PERSON_SEARCH';
	oSearch.addField('firstname');
	oSearch.rf = 'xml';
	oSearch.rows = 5;
	oSearch.addFilter('firstname', 'EQUAL_TO', 'Mark');
	oSearch.getResults(function(data){alert(data)})
}	

function test_CONTACT_PERSON_NOT_EQUAL_TO()
{
	var oSearch = new AdvancedSearch();
	oSearch.method = 'CONTACT_PERSON_SEARCH';
	oSearch.addField('firstname');
	oSearch.rf = 'xml';
	oSearch.rows = 5;
	oSearch.addFilter('firstname', 'NOT_EQUAL_TO', 'Mark');
	oSearch.getResults(function(data){alert(data)})
}

function test_CONTACT_PERSON_RETURN()
{
	var oSearch = new AdvancedSearch();
	oSearch.method = 'CONTACT_BUSINESS_SEARCH';
	//oSearch.addField('tradename');
	oSearch.rf = 'xml';
	//oSearch.returnParameters = 'contactperson,contactperson.contactbusiness,contactperson.contactbusiness.audititemtype';
	oSearch.returnParameters = 'contactbusiness,contactbusiness.audititemtype';
	oSearch.getResults(function(data){alert(data)});

}	

function test_CONTACT_BUSINESS_RETURN()
{
	var oSearch = new AdvancedSearch();
	oSearch.method = 'CONTACT_BUSINESS_SEARCH';
	//oSearch.addField('tradename');
	oSearch.rf = 'xml';
	//oSearch.returnParameters = 'contactperson,contactperson.contactbusiness,contactperson.contactbusiness.audititemtype';
	oSearch.returnParameters = 'contactbusiness,contactbusiness.audititemtype';
	oSearch.getResults(function(data){alert(data)});

}	

function test_AUDIT_ITEM_RETURN()
{
	var oSearch = new AdvancedSearch();
	oSearch.method = 'AUDIT_ITEM_TYPE_SEARCH';
	//oSearch.addField('tradename');
	oSearch.rf = 'xml';
	//oSearch.returnParameters = 'contactperson,contactperson.contactbusiness,contactperson.contactbusiness.audititemtype';
	oSearch.returnParameters = 'audititemtype.contactbusiness.contactperson,audititemtype.itemtype';
	//oSearch.returnParameters = '*';
	oSearch.getResults(function(data){alert(data)});

}	




