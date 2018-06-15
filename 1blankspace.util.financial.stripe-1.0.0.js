/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 *
 * http://docs.mydigitalstructure.com/community_stripe
 *
 * http://www.larryullman.com/2012/12/05/writing-the-javascript-code-for-handling-stripe-payments/
 *
 */

"use strict";

if (ns1blankspace === undefined) {var ns1blankspace = {}}
if (ns1blankspace.util === undefined) {ns1blankspace.util = {}}
if (ns1blankspace.util.financial === undefined) {ns1blankspace.util.financial = {}}

$(document).ready(function()
{
    /*check for https

   //if window.location = /payment 
   
   //get other data passed in URL out of mydigitalstructureContextId or window.location hash

   //ns1blankspace.util.financial.stripe.init(
   {
        invoice: [GUID],
        amount: 
   })

    //could encrypt hash
   */

}); // document ready.

ns1blankspace.util.financial.stripe =
{
    data: {},

    init: function (oParam)
    {    
        Stripe.setPublishableKey('lksdajSDFmn2345nv');
        //dynamically render form if required
        //https://bootsnipp.com/snippets/featured/responsive-stripe-payment-form

        //hook into form submit

        $("#payment-form").submit(function(event) {
            $('#submitBtn').attr('disabled', 'disabled');
            return false;
        }); // form submission
    },

    getAccountAPIKey: function (oParam, oResponse)
    {
        if (oReponse == undefined)
        {
            //SITE_COLLECT_PAYMENT
        }
        else
        {

        }    
    },

    validate: function (oParam)
    {
        var error = false;
 
        // Get the values:
        var ccNum = $('.card-number').val(),
            cvcNum = $('.card-cvc').val(),
            expMonth = $('.card-expiry-month').val(),
            expYear = $('.card-expiry-year').val();
         
        // Validate the number:
        if (!Stripe.card.validateCardNumber(ccNum)) {
            error = true;
            reportError('The credit card number appears to be invalid.');
        }
         
        // Validate the CVC:
        if (!Stripe.card.validateCVC(cvcNum)) {
            error = true;
            reportError('The CVC number appears to be invalid.');
        }
         
        // Validate the expiration:
        if (!Stripe.card.validateExpiry(expMonth, expYear)) {
            error = true;
            reportError('The expiration date appears to be invalid.');
        }

        if (!error)
        {
            ns1blankspace.util.financial.stripe.getToken()
        }
    },  

    getToken: function (oParam)
    {
        // Get the Stripe token:
        Stripe.card.createToken({
            number: ccNum,
            cvc: cvcNum,
            exp_month: expMonth,
            exp_year: expYear
        }, ns1blankspace.util.financial.stripe.processToken);
    },

    processToken: function (oStatus, oResponse)
    {
        if (response.error)
        {
            reportError(response.error.message);
        }
        else
        {
            // Get a reference to the form:
            var f = $("#payment-form");
             
            // Get the token from the response:
            var token = response.id;
             
            // Add the token to the form:
            f.append('<input type="hidden" name="stripeToken" value="' + token + '" />');
             
            // Submit the form:
            f.get(0).submit();

            //use ajax form submit
        }
    },

    error: function (oParam)
    {
        $('#payment-errors').text(msg).addClass('error');
 
        // Re-enable the submit button:
        $('#submitBtn').prop('disabled', false);
     
        return false;
    }
}

/*
    //GET .net library -- https://stripe.com/docs/api/dotnet#intro
    //mydigitalstructure code - SITE_COLLECT_PAYMENT
    &token=[form data]
    &invoiceGUID=
    &amount
    &account
    &currency=
    &source=

*/






