/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 
ns1blankspace.option.defaultView = 'Website';
ns1blankspace.option.defaultSetupView = 'Spaces';

ns1blankspace.views = 
[
	{
		title: 'Financials',
		parentnamespace: '',
		namespace: 'financial',
		endpoint: 'FINANCIAL',
		show: true,
		group: 1,
		type: 1
	},
	{
		title: 'Bank Accounts',
		parentnamespace: 'financial',
		namespace: 'bankAccount',
		endpoint: 'FINANCIAL_BANK_ACCOUNT',
		show: true,
		group: 1,
		type: 1
	},
	{
		title: 'Invoices',
		parentnamespace: 'financial',
		namespace: 'invoice',
		endpoint: 'FINANCIAL_INVOICE',
		show: true,
		group: 1,
		type: 1
	},
	{
		title: 'Expenses',
		parentnamespace: 'financial',
		namespace: 'expense',
		endpoint: 'FINANCIAL_EXPENSE',
		show: true,
		group: 1,
		type: 1
	},
	{
		title: 'Receipts',
		parentnamespace: 'financial',
		namespace: 'receipt',
		endpoint: 'FINANCIAL_RECEIPT',
		show: true,
		group: 1,
		type: 1
	},
	{
		title: 'Payments',
		parentnamespace: 'financial',
		namespace: 'payment',
		endpoint: 'FINANCIAL_PAYMENT',
		show: true,
		group: 1,
		type: 1
	},
	{
		title: 'Payroll',
		parentnamespace: 'financial',
		namespace: 'payroll',
		endpoint: 'FINANCIAL_PAYROLL',
		show: true,
		group: 1,
		type: 1
	},
	{
		title: 'Tax',
		parentnamespace: 'financial',
		namespace: 'tax',
		endpoint: 'FINANCIAL_TAX',
		show: true,
		group: 1,
		type: 1
	},
	{
		title: 'Financials',
		parentnamespace: 'setup',
		namespace: 'financial',
		endpoint: 'SETUP_FINANCIAL',
		show: true,
		group: 1,
		type: 2
	},
	{
		title: 'Users',
		parentnamespace: 'setup',
		namespace: 'user',
		endpoint: 'SETUP_USER',
		show: true,
		group: 1,
		type: 2
	},
	{
		title: 'Sign up a client',
		parentnamespace: 'developer',
		namespace: 'space',
		endpoint: 'REGISTER',
		show: true,
		group: 1,
		type: 2
	}
]

ns1blankspace.views.show = function ()
{
	if (ns1blankspace.viewportXHTML == undefined)
	{
		var aHTML = [];

		aHTML.push('<table id='ns1blankspaceViewControl' class='ns1blankspaceViewControlContainer'>');
		aHTML.push('<tr class='ns1blankspaceViewControlColumnContainer'>');

		$($.grep(ns1blankspace.views, function (a) {return a.type == 1;})).each(function()
		{
			aHTML.push('<tr class='ns1blankspaceViewControl'>' +
							'<td id='ns1blankspaceViewControl_' + this.parentnamespace + '_' + this.namespace '' class='interfaceViewControl'>' +
							'<span id='ns1blankspaceViewControl' + this.parentnamespace + '_' + this.namespace '' class='interfaceViewControl'>' + 
							this.title + '</span>' +
							'</td></tr>');
		});		

		ns1blankspace.viewportXHTML = aHTML.join('');	
	}

	return ns1blankspace.viewportXHTML
}			

ns1blankspace.views.bind = function ()
{
	$($.grep(ns1blankspace.views, function (a) {return a.type == 1;})).each(function()
	{
		$('#ns1blankspaceViewControl' + this.parentnamespace + '_' + this.namespace).click(function(event)
		{
			$(ns1blankspace.xhtml.container).attr('data-initiator', '');

			if (this.parentnamespace)
			{
				var oNS = ns1blankspace[this.parentnamespace][this.namespace];
			}
			else
			{
				var oNS = ns1blankspace[this.parentnamespace];
			}

			oNS.init();
		});
}			

ns1blankspace.setup.views.show = function ()
{
	if (ns1blankspace.viewportXHTML == undefined)
	{
		var aHTML = [];

		aHTML.push('<table id='ns1blankspaceViewControl' class='ns1blankspaceViewControlContainer'>');
		aHTML.push('<tr class='ns1blankspaceViewControlColumnContainer'>');

		$($.grep(ns1blankspace.views, function (a) {return a.type == 2;})).each(function()
		{
			aHTML.push('<tr class='ns1blankspaceViewControl'>' +
							'<td id='ns1blankspaceViewControl_' + this.parentnamespace + '_' + this.namespace '' class='interfaceViewControl'>' +
							'<span id='ns1blankspaceViewControl' + this.parentnamespace + '_' + this.namespace '' class='interfaceViewControl'>' + 
							this.title + '</span>' +
							'</td></tr>');
		});		

		ns1blankspace.viewportXHTML = aHTML.join('');	
	}

	return ns1blankspace.viewportXHTML
}			

ns1blankspace.setup.views.bind = function ()
{
	$($.grep(ns1blankspace.views, function (a) {return a.type == 2;})).each(function()
	{
		$('#ns1blankspaceViewControl' + this.parentnamespace + '_' + this.namespace).click(function(event)
		{
			$(ns1blankspace.xhtml.container).attr('data-initiator', '');

			if (this.parentnamespace)
			{
				var oNS = ns1blankspace[this.parentnamespace][this.namespace];
			}
			else
			{
				var oNS = ns1blankspace[this.parentnamespace];
			}

			oNS.init();
		});
}			