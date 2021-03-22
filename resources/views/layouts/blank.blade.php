<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>{{ env('APP_NAME') }}</title>

    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
</head>
<body>
    <div class="container-fluid container-light relative">
        <div class="bg-img" style="background-image: url({{asset('media/banner.png')}}); min-height: 100vh;"></div>
        <div class="bg-overlay relative">
            <div class="container">        
                <div class="content-container">
                    <nav class="navbar navbar-expand-lg navbar-dark">
                    <a class="navbar-brand" href="{{url('/')}}"><img src="{{asset('media/logo.PNG')}}"/><img src="{{asset('media/logo-boi.png')}}"/></a>                   
                    </nav>
                </div>
            </div>
            @yield('content')
        </div>
    </div>
    <div class="footer">
        <div class="footer-inner">
            <div class="container">
                <div class="d-flex">
                    <div class="float-left">
                        <img class="footer-logo" src={{asset('media/logo-footer.png')}} />
                    </div>
                    <div class="col footer-desc">
                        <p>Copyright &copy; {{date('Y')}} Board of Investment. All rights reserved.</p>
                        //change_me
                        <p>Designed and Developed by: Evamp & Saanga</p>
                    </div>
                    <div class="float-right">
                        <div class="social-icons">
                            &nbsp;
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    @yield('script')
</body>
</html>
