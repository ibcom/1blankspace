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

    if (mydigitalstructureContextId != undefined && mydigitalstructureContextId != '')
    {
        aContext = mydigitalstructureContextId.split('|'); 
    }
    else if (window.location.hash != '')
    {
        aContext = window.location.hash.replace('#', '').split('|');
    }

    $.each(aContext, function (c, context)
    {
        oContext[context.split('=')[0]] = context.split('=')[1]
    })

    ns1blankspace.util.site.collect.init(oContext)
});


ns1blankspace.util.site.collect =
{
    data: {_publicKey: '1234', option: {}},

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
                        url: '/rpc/site/?method=SITE_COLLECT_PAYMENT_STRIPE',
                        data: 'getapikey=1',
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
                    
                    if (ns1blankspace.util.site.collect.data.option.elements)
                    {
                        ns1blankspace.util.site.collect.stripe.elements.init(oParam);
                    }
                    else
                    {
                        ns1blankspace.util.site.collect.stripe.render(oParam)
                    }
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
                        ns1blankspace.util.site.collect.data.xhtml = data;
                        ns1blankspace.util.site.collect.stripe.bind(oParam);
                    },
                    error: function(data)
                    {
                        ns1blankspace.util.site.collect.error('No payment collection template');
                    }
                });
            }
            else
            {
                ns1blankspace.util.site.collect.data.xhtml = ns1blankspace.util.site.collect.data.xhtmlContainer.html();
                ns1blankspace.util.site.collect.stripe.bind(oParam);
            }    
        },

        bind: function (oParam)
        {
            ns1blankspace.util.site.collect.data.xhtml =
                ns1blankspace.util.site.collect.data.xhtml.replace(/\[\[Amount\]\]/g, oParam.amount);
            ns1blankspace.util.site.collect.data.xhtmlContainer.html(ns1blankspace.util.site.collect.data.xhtml)
            ns1blankspace.util.site.collect.data.xhtmlContainer.show();

            $("#site-collect-container").submit(function(event)
            {
                return false;
            });

            $('#site-collect-process').click(function(event)
            {
                ns1blankspace.util.site.collect.stripe.process();
            });
        },

        process: function (oParam)
        {
            //OLD - Use Elements
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

            /*v2
            ns1blankspace.util.site.collect.data.stripe.createToken(
            {
                number: oParam.number,
                cvc: oParam.cvc,
                exp_month: oParam.exp_month,
                exp_year: oParam.exp_year
            },
            ns1blankspace.util.site.collect.stripe.processToken);*/
        },

        processToken: function (sToken)
        {
            $.ajax(
            {
                type: 'POST',
                url: '/rpc/site/?method=SITE_COLLECT_PAYMENT_STRIPE',
                data: 'token=' + sToken,
                dataType: 'json',
                success: function (data)
                {
                    ns1blankspace.util.site.collect.stripe.processComplete(data);
                }
            });
        },

        processComplete: function (oResponse)
        {
            //if oResponse.status == 'OK'
        },

        error: function (sMessage)
        {
            $('#site-collect-status').html(sMessage).addClass('alert-danger');
            //$('#site-collect-process').prop('disabled', false);
            return false;
        },

        elements:
        {
            init: function ()
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

                ns1blankspace.util.site.collect.data.card.mount('#card-container');

                ns1blankspace.util.site.collect.data.card.addEventListener('change', function(event)
                {
                    var displayError = document.getElementById('card-errors');
                    
                    if (event.error)
                    {
                        ns1blankspace.util.site.collect.data.error = true;
                        displayError.textContent = event.error.message;
                    }
                    else
                    {
                        ns1blankspace.util.site.collect.data.error = false;
                        displayError.textContent = '';
                    }
                });

                // Handle form submission.
                var form = document.getElementById('site-collect-container');

                form.addEventListener('submit', function(event)
                {
                    event.preventDefault();

                    ns1blankspace.util.site.collect.stripe.getToken()

                   /* stripe.createToken(card).then(function(result)
                    {
                        if (result.error)
                        {
                             // Inform the user if there was an error.
                            var errorElement = document.getElementById('card-errors');
                            errorElement.textContent = result.error.message;
                        }
                        else
                        {
                            // Send the token to your server.
                            stripeTokenHandler(result.token);
                        }
                    });*/
                });
            }
        }  
    }
}

/*

Notes for SITE_COLLECT_PAYMENT_STRIPE....

Stripe.com is the easier version of PayPal.

Currently there we have;

1. SITE_COLLECT_PAYMENT - which is integrated with processing an order.
2. SITE_PAYPAL_PDT_METHOD - which is integrated with PayPal,  It is most similar to what we need to do with Stripe.

So propose doing a copy of SITE_PAYPAL_PDT_METHOD and calling it SITE_COLLECT_PAYMENT_STRIPE.

Most of the work is done in view-controller, including the sourcing of a Stripe-token, but still need to do a final call to Stripe in context of a Stripe account with secret password help in financial funds manage the account.

See; http://docs.mydigitalstructure.com/community_stripe

1. SETUP_FINANCIAL_FUNDS_TRANSFER_ACCOUNT_MANAGE

Add Provider = "Stripe"

2. SITE_COLLECT_PAYMENT_STRIPE

## View-controller call to: 

/rpc/site/?method=SITE_COLLECT_PAYMENT_STRIPE
&account= [from SETUP_FINANCIAL_FUNDS_TRANSFER_ACCOUNT_MANAGE - used to get apipassword]
&token= [token from Stripe]
&invoiceGUID= [from myds, optional]
&amount=
&currency= [AUD default]
&description=

## Then method does https call to Stripe and returns to view-controller what stripe returns.

https://api.stripe.com/v1/charges

SetHeader("Authorization: Bearer", [apipassword from SETUP_FINANCIAL_FUNDS_TRANSFER_ACCOUNT_MANAGE account]"

data:
&source= [token passed]
&amount= [as passed]
&currency= [as passed or AUD as default]
&description= [as passed]

--- If the call to SITE_COLLECT_PAYMENT_STRIPE has getapikey=1 and account Provider = Stripe then just return the account apikey - it is needed by view-controller to get the token client side.

--- Also if invoiceGUID is set and in the same space as the funds transfer account, and Stripe return is successful then need to do an "AUTO_PAYMENT" for the amount of the payment.
*/






