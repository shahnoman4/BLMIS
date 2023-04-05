<!DOCTYPE html>
<html>
    <head>
        <title>Something Went Wrong</title>

        <link href="https://fonts.googleapis.com/css?family=Lato:100" rel="stylesheet" type="text/css">
        <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet">
        <style>
            html, body {
                height: 100%;
            }

            .error.container {
                margin: 0;
                padding: 0;
                width: 100%;
                height: calc(100vh - 80px);
                font-weight: 100;
                text-align: center;
                display: table;
            }

            .error .content {
                text-align: center;
                display: table-cell;
                vertical-align: middle;
                width: 100%;
            }

            .error .code {
                font-size: 72px;
                font-weight: bold;
                margin-bottom: 40px;
            }
        </style>
    </head>
    <body>
        <nav class="navbar navbar-default">
            <div class="container">
                <div class="navbar-header">
                    <a class="navbar-brand" href="{{ url('/') }}">
                        {{env("APP_NAME")}}
                    </a>
                </div>
            </div>
        </nav>
        <div class="error container">
            <div class="content">
                <div class="code text-danger">{{$e->getStatusCode()}}</div>
                <h4>
                    @if($e->getMessage())
                        {{$e->getMessage()}}
                    @elseif($e->getStatusCode() == 404)
                        The resource you are looking for is not found
                    @endif
                </h4>
            </div>
        </div>
    </body>
</html>