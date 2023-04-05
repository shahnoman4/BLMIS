@extends('layouts.admin-blank')
@section('content')

<div class="container login">
    <div class="content-container">
        <div class="section">
            <div class="section-inner">
                <div class="row d-flex">
                    <div class="col-sm-7 align-self-center p-2">
                        <div class="widget widget-sideTitle">
                            <h1>Welcome to<br />BLMIS Portal</h1>
                        </div>
                    </div>

                    <div class="col-sm-5">
                        <div class="widget widget-pin float-right">
                            <div class="widget-inner">
                                <div class="form-heading">
                                    <h1>PIN Verification</h1>
                                    <div class="d-flex justify-content-between">
                                        <span class="float-left text-muted small">Please enter 4 digit code we sent on registered email</span>
                                    </div>
                                </div>

                                @if($errors->has('max_attempts'))
                                <div class="form-group">
                                    <div class="text-danger">{{$errors->first('max_attempts')}}</div>
                                </div>
                                @else
                                <form name="verify_token" class="needs-validation" method="POST" onsubmit="this.submit.disabled = true;">
                                    @csrf
                                    <div class="form-group">
                                        <label htmlFor="user_name">Enter Code</label>

                                        <div class="digit-container">
                                            <input class="digit" autocomplete="off" autofocus name='e_pin_digit_1' maxlength="1" />
                                            <input class="digit" autocomplete="off" name='e_pin_digit_2' maxlength="1" />
                                            <input class="digit" autocomplete="off" name='e_pin_digit_3' maxlength="1" />
                                            <input class="digit" autocomplete="off" name='e_pin_digit_4' maxlength="1" />
                                        </div>
                                    </div>

                                    @if ($errors->any())
                                    <div class="form-group">
                                        <div class="text-danger">{{$errors->first()}}</div>
                                    </div>
                                    @endif
                                    <div class="form-group">
                                        <button name="submit" type="submit" class="btn btn-primary btn-block">Verify</button>
                                    </div>
                                </form>
                                @endif
                                <div class="resend-msg">
                                    <form name="resend_2fa" method="post" action="{{url('/admin/2fa/resend')}}">
                                        @csrf
                                    </form>
                                    Resend Code <span class="link" id="btn_resend">Click here</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    (function() {
        var inputs = document.getElementsByClassName('digit');
        var count = inputs.length;
        for (var i = 0; i < count; i++) {
            (function(elem, idx) {
                elem.addEventListener('keydown', function(e) {
                    if (/\d/.test(e.key)) {
                        if (idx < count - 1 && inputs[idx + 1].value == "") {
                            setTimeout(function() {
                                inputs[idx + 1].focus();
                            }, 1);
                        }
                    } else if ([8,9,13].indexOf(e.keyCode) === -1) { // if not backspace or Enter or Tab
                        e.preventDefault();
                    }
                }, false);
            })(inputs[i], i);
        }
        document.getElementById('btn_resend').addEventListener('click', function() {
            document.resend_2fa.submit();
        }, false);
    })();
</script>
@endsection