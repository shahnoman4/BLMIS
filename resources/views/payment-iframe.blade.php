<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>{{ env('APP_NAME') }}</title>

    <style>
    </style>
</head>
<body>
    <?php

if(config('auth.JAZZ_ENV') == "sandbox"){

            $postURL = "https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform";
        }
        else if(config('auth.JAZZ_ENV') == "live"){
            
            $postURL = "https://payments.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform";
        }
        else{
            $postURL = "https://testpayments.jazzcash.com.pk/PayAxisCustomerPortal/transactionmanagement/merchantform";
        }
    ?>


        @if($branch->status_id === \App\Lookups\ApplicationStatus::PAYMENT_PENDING)
        <form name='ppf_payment_form' method="post" action="{{$postURL}}" onsubmit="onSubmit()">  
            @foreach ($data as $key => $value)
                <input type="hidden" name="{{$key}}" value="{{$value}}" />
            @endforeach

            <button type="submit">Pay</button>
        </form>

        <script>
            function onSubmit(){
                document.ppf_payment_form.style.display = 'none';
                var parentWindow = window.opener || window.top;
                parentWindow.postMessage({view: 'payment', status: 'opened', type: '{{$payment->entity_type}}'});
            }
            if(window.opener){
                document.ppf_payment_form.style.display='none';
                document.write('<h3>Loading...</h3>');
                document.ppf_payment_form.submit();
                onSubmit.call(document.ppf_payment_form);
            }
        </script>
        @else
            <h3>Thanks</h3>
            <script>
                var parentWindow = window.opener || window.top;
                parentWindow.postMessage({view: 'payment', status: 'paid', type: '{{$payment->entity_type}}'});
                window.close();
            </script>
        @endif
</body>
</html>
