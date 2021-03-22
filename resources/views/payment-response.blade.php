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
    @if($response['success'])
        <h3>Congratulations! Your payment is successfull.</h3>
    @else
        <h3 style="color: red">{{$response['message']}}</h3>
        {{-- <p>Refresh your browser to try again.</p> --}}
    @endif
    @if($response['success'])
    <script>
        var parentWindow = window.opener || window.top;
        parentWindow.postMessage({view: 'payment', status: 'success', type: '{{$payment->entity_type}}'});
        if(window.opener){
            window.close();
        }
    </script>
    @endif
</body>
</html>
