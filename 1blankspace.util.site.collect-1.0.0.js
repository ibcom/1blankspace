/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 *
 * v
 *
 * http://www.larryullman.com/2012/12/05/writing-the-javascript-code-for-handling-stripe-payments/
 * https://bootsnipp.com/snippets/featured/responsive-stripe-payment-form
 *
 * Example /paynow;

    <script src="/jscripts/jquery-1.8.3.min.js"></script>
    <script src="https://js.stripe.com/v3/"></script>
    <script src="/site/312/1blankspace.util.site.collect-1.0.0.js"></script>
    <p>Pay Now</p>
    <div id="ns1blankspaceUtilFinancialStripeContainer"></div>
 */

"use strict";

if (ns1blankspace === undefined) {var ns1blankspace = {}}
if (ns1blankspace.util === undefined) {ns1blankspace.util = {}}
if (ns1blankspace.util.site === undefined) {ns1blankspace.util.site = {}}
if (ns1blankspace.util.site.collect === undefined) {ns1blankspace.util.site.collect = {}}

$(document).ready(function()
{  
    var aContext = [];
    var oContext = {};

    if (window.mydigitalstructureContextId != undefined && window.mydigitalstructureContextId != '')
    {
        aContext = window.mydigitalstructureContextId.split('|'); 
    }
    else if (window.location.hash != '')
    {
        aContext = window.location.hash.replace('#', '').split('|');
    }

    $.each(aContext, function (c, context)
    {
        oContext[context.split('=')[0]] = context.split('=')[1]
    })

    ns1blankspace.util.site.collect.data.context = oContext;
    ns1blankspace.util.site.collect.init(oContext)
});


ns1blankspace.util.site.collect =
{
    data: {_publicKey: 'pk_test_ZCsqtZ8k3XCjHx9qjJwfyWS4', option: {autoReceipt: true}},

    init: function (oParam)
    {    
        if (window.location.protocol == 'http:')
        {
            window.location.href = window.location.href.replace('http', 'https')
        }
        else
        {
            ns1blankspace.util.site.collect.data.xhtmlContainer = 
                $('#ns1blankspaceUtilFinancialStripeContainer');

            ns1blankspace.util.site.collect.data.xhtmlContainerSuccess = 
                $('#ns1blankspaceUtilFinancialStripeContainer-Success');

            ns1blankspace.util.site.collect.data.option.stripe =
                (ns1blankspace.util.site.collect.data.xhtmlContainer != undefined)

            if (ns1blankspace.util.site.collect.data.option.stripe && window.Stripe == undefined)
            {
                ns1blankspace.util.site.collect.data.option.stripe = false
            }

            if (ns1blankspace.util.site.collect.data.option.stripe)
            {
                ns1blankspace.util.site.collect.data.option.elements = (ns1blankspace.util.site.collect.data.xhtmlContainer.attr('data-ui') == 'elements')
                ns1blankspace.util.site.collect.stripe.init(oParam);
            }    
        }    
    },

    error: function (sError)
    {
        ns1blankspace.util.site.collect.data.xhtmlContainer.html(sError)
    },

    stripe:
    {
        data: {},

        init: function (oParam, oResponse)
        {
            if (oResponse == undefined)
            {
                if (ns1blankspace.util.site.collect.data._publicKey != undefined)
                {
                    ns1blankspace.util.site.collect.stripe.init(oParam,
                    {
                        apikey: ns1blankspace.util.site.collect.data._publicKey,
                        status: 'OK'
                    }); 
                }
                else
                {
                    $.ajax(
                    {
                        type: 'POST',
                        url: '/rpc/site/?method=SITE_FUNDS_TRANSFER_ACCOUNT_SEARCH&advanced=1',
                        data: 'criteria={"fields":[{"name":"apikey"}]}',
                        dataType: 'json',
                        success: function (data)
                        {
                            ns1blankspace.util.site.collect.stripe.init(oParam, data);
                        }
                    });
                }    
            }
            else
            {
                if (oResponse.status == 'OK')
                {
                    ns1blankspace.util.site.collect.data.publicKey = oResponse.apikey;
                    ns1blankspace.util.site.collect.data.stripe = Stripe(ns1blankspace.util.site.collect.data.publicKey);
                    
                    ns1blankspace.util.site.collect.stripe.render(oParam)
                }
                else
                {
                    ns1blankspace.util.site.collect.error('Error')
                }
            }    
        },

        render: function (oParam)
        { 
            if (ns1blankspace.util.site.collect.data.xhtmlContainer.html() == '')
            {
                $.ajax(
                {
                    type: 'GET',
                    url: window.location.protocol + '//' + window.location.host + '/site/' + mydigitalstructureSiteId + '/1blankspace.util.site.collect-1.0.0.html',
                    dataType: 'text',
                    global: false,
                    success: function(data)
                    {
                        if (data != '')
                        {
                            ns1blankspace.util.site.collect.data.xhtmlContainer.html(data);
                            ns1blankspace.util.site.collect.stripe.render(oParam);
                        } 
                    },
                    error: function(data)
                    {
                        ns1blankspace.util.site.collect.error('No payment collection template');
                    }
                });
            }
            else
            {                
                ns1blankspace.util.site.collect.data.xhtmlContainerSuccess.hide();

                ns1blankspace.util.site.collect.data.xhtml = ns1blankspace.util.site.collect.data.xhtmlContainer.html();

                ns1blankspace.util.site.collect.data.xhtml =
                    ns1blankspace.util.site.collect.data.xhtml.replace(/\[\[Amount\]\]/g, oParam.amount);

                ns1blankspace.util.site.collect.data.xhtmlContainer.html(ns1blankspace.util.site.collect.data.xhtml);

                if (ns1blankspace.util.site.collect.data.option.elements)
                {
                    ns1blankspace.util.site.collect.stripe.elements.init(oParam);
                }
                else
                {
                    ns1blankspace.util.site.collect.stripe.bind(oParam);
                }    
            }    
        },

        bind: function (oParam)
        {
            $("#payment-form").submit(function(event)
            {
                event.preventDefault();

                if ($('#site-collect-process').length == 0)
                {
                    ns1blankspace.util.site.collect.stripe.getToken()
                }   
            });

             $("#site-collect-container").submit(function(event)
            {
                event.preventDefault();

                if ($('#site-collect-process').length == 0)
                {
                    ns1blankspace.util.site.collect.stripe.getToken();
                }
            });

            $('#site-collect-process').click(function(event)
            {
                if (ns1blankspace.util.site.collect.data.option.elements)
                {
                    ns1blankspace.util.site.collect.stripe.getToken();
                }
                else
                {
                    ns1blankspace.util.site.collect.stripe.process();
                }    
            });

            if (ns1blankspace.util.site.collect.data.option.elements)
            {
                ns1blankspace.util.site.collect.data.card.addEventListener('change', function(event)
                {
                    if (event.error)
                    {
                        ns1blankspace.util.site.collect.data.error = true;
                        $('#card-errors').addClass('alert alert-danger');
                        $('#card-errors').html(event.error.message);
                    }
                    else
                    {
                        ns1blankspace.util.site.collect.data.error = false;
                        $('#card-errors').removeClass('alert alert-danger');
                        $('#card-errors').html('');
                    }
                });
            }    
        },

        process: function (oParam)
        {
            //If not using Stripe Elements

            if (oParam == undefined) {oParam = {}}
            oParam.error = false;
            oParam.errorMessages = [];
     
            oParam.number = $('.card-number').val();
            if (oParam.number == undefined) {oParam.number = $('.number').val()}

            oParam.cvc = $('.card-cvc').val();
            if (oParam.cvc == undefined) {oParam.cvc = $('.cvc').val()}
            
            oParam.exp_month = $('.card-expiry-month').val();
            if (oParam.exp_month == undefined) {oParam.exp_month = $('.expiry-month').val()}
            
            oParam.exp_year = $('.card-expiry-year').val();
            if (oParam.exp_year == undefined) {oParam.exp_year = $('.expiry-year').val()}

            if ((oParam.exp_year == undefined || oParam.exp_year == '')
                    && (oParam.exp_month == undefined || oParam.exp_month == ''))
            {
                oParam.expiry = $('.expiry').val();
                if (oParam.expiry != undefined)
                {
                    var aExpiry = oParam.expiry.split('/');
                    if (aExpiry.length > 0)
                    {
                        oParam.exp_month = aExpiry[0];
                        oParam.exp_year = aExpiry[1];
                    }    
                }
            }
            
            if (!Stripe.card.validateCardNumber(oParam.number))
            {
                oParam.error = true;
                oParam.errorMessages.push('<div>The credit card number appears to be invalid.</div>');
            }
             
            if (!Stripe.card.validateCVC(oParam.cvc))
            {
                oParam.error = true;
                oParam.errorMessages.push('<div>The CVC number appears to be invalid.</div>');
            }
             
            if (!Stripe.card.validateExpiry(oParam.exp_month, oParam.exp_year))
            {
                oParam.error = true;
                oParam.errorMessages.push('<div>The expiration date appears to be invalid.</div>');
            }

            if (!oParam.error)
            {
                ns1blankspace.util.site.collect.stripe.getToken()
            }
            else
            {
                ns1blankspace.util.site.collect.stripe.error(oParam.errorMessages.join(''));
            }
        },  

        getToken: function (oParam)
        {
            $('#site-collect-process').prop('disabled', true);

            ns1blankspace.util.site.collect.data.stripe.createToken(ns1blankspace.util.site.collect.data.card)
            .then(function(result)
            {
                if (result.error)
                {
                    ns1blankspace.util.site.collect.stripe.error(result.error.message);
                }
                else
                {
                    ns1blankspace.util.site.collect.stripe.processToken(result.token);
                }
            });
        },

        processToken: function (oToken)
        {
            if (oToken != undefined)
            {
                var sCurrency = ns1blankspace.util.site.collect.data.context.currency;
                if (sCurrency == undefined) {sCurrency = 'AUD'}

                var oData =
                {
                    token: oToken.id,
                    currency: sCurrency,
                    amount: ns1blankspace.util.site.collect.data.context.amount,
                    invoiceGUID: ns1blankspace.util.site.collect.data.context.invoiceGUID,
                    description: ns1blankspace.util.site.collect.data.context.description,
                    account: siteAccount,
                    site: window.mydigitalstructureSiteId
                }

                $.ajax(
                {
                    type: 'POST',
                    url: '/rpc/site/?method=SITE_COLLECT_PAYMENT_STRIPE',
                    data: oData,
                    dataType: 'json',
                    success: function (data)
                    {
                        ns1blankspace.util.site.collect.stripe.processComplete(data);
                    },
                    error: function (data)
                    {
                        ns1blankspace.util.site.collect.stripe.error(data.responseJSON.error.errornotes)
                    }
                });
            }
            else
            {
                ns1blankspace.util.site.collect.stripe.error('Bad token')
            }    
        },

        processComplete: function (oResponse)
        {
            if (oResponse.status == 'OK')
            {
                if (oResponse.stripe_status == 'succeeded')
                {
                    if (ns1blankspace.util.site.collect.data.option.autoReceipt)
                    {   
                        ns1blankspace.util.site.collect.stripe.autoReceipt({chargeToken: oResponse.stripe_id})
                    }
                    else
                    {
                        ns1blankspace.util.site.collect.data.xhtmlContainer.hide();
                        ns1blankspace.util.site.collect.data.xhtmlContainerSuccess.show();
                    }
                }
                else
                {
                    ns1blankspace.util.site.collect.stripe.error(oResponse.stripe_outcome_sellermessage)
                }
            }
            else
            {
                ns1blankspace.util.site.collect.data.xhtmlContainer.html('<h3>There is something wrong with the set up of this page!')
            }
        },

        autoReceipt: function (oParam, oResponse)
        {
            if (oResponse == undefined)
            {
                var oData =
                {
                    amount: ns1blankspace.util.site.collect.data.context.amount,
                    guid: ns1blankspace.util.site.collect.data.context.invoiceGUID,
                    description: oParam.chargeToken,
                    site: window.mydigitalstructureSiteId
                }

                $.ajax(
                {
                    type: 'POST',
                    url: '/rpc/site/?method=SITE_AUTO_RECEIPT',
                    data: oData,
                    dataType: 'json',
                    success: function (data)
                    {
                        ns1blankspace.util.site.collect.stripe.autoReceipt(oParam, data);
                    }
                });
            }
            else
            {
                if (oResponse.status == 'ER')
                {
                    ns1blankspace.util.site.collect.stripe.error(oResponse.error.errornotes)
                }
                else
                {
                    ns1blankspace.util.site.collect.data.xhtmlContainer.hide();
                    ns1blankspace.util.site.collect.data.xhtmlContainerSuccess.show();
                }
            }    
        },

        error: function (sMessage)
        {
            $('#card-errors').html(sMessage).addClass('alert alert-danger');
            $('#site-collect-process').prop('disabled', false);
            return false;
        },

        elements:
        {
            init: function (oParam)
            {        
                ns1blankspace.util.site.collect.data.elements = ns1blankspace.util.site.collect.data.stripe.elements();

                ns1blankspace.util.site.collect.data.style =
                {
                    base:
                    {
                        color: '#32325d',
                        lineHeight: '18px',
                        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                        fontSmoothing: 'antialiased',
                        fontSize: '16px',
                        '::placeholder':
                        {
                          color: '#aab7c4'
                        }
                    },
                    invalid:
                    {
                        color: '#fa755a',
                        iconColor: '#fa755a'
                    }
                }

                ns1blankspace.util.site.collect.data.card = ns1blankspace.util.site.collect.data.elements
                    .create('card', {style: ns1blankspace.util.site.collect.data.style});

                ns1blankspace.util.site.collect.data.card.mount('#card-element');

                ns1blankspace.util.site.collect.stripe.bind(oParam);
            }
        }  
    }
}




