<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <!-- Base URL -->
    <meta name="base-url" content="{{ request()->getBaseUrl() }}">

    <title>{{ env('APP_NAME') }}</title>

    <!-- Styles -->
    <link href="{{ asset('css/app.css')}}" rel="stylesheet">
</head>
<body>
    <div id="app"></div>
    
    <script id="tmp_ss">
        window.__app = {!! json_encode($config) !!}
        __app.LOOKUP.get = function(path){
            return _.get(this, path);
        }
        __app.LOOKUP.text = function(path, value){
            return (_.find(this.get(path + ".data"), {value: value}) || {}).text;
        }
        document.getElementById('tmp_ss').remove();
    </script>
    <script src="{{ asset('js/app.js') }}"></script>
    @if($config['_theme'] == 'public')
    <script src="https://www.google.com/recaptcha/api.js?render=explicit" async defer></script>
    @endif
    @if($errors->any())
    <script>notify.error("{{$errors->first()}}", null, 20000)</script>
    @endif
</body>
</html>
