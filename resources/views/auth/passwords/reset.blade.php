@extends('layouts.blank')
@section('content')
<div class="container login">
    <div class="content-container">
        <div class="section">
            <div class="section-inner">
                <div class="row d-flex align-items-center">
                    <div class="col-sm-7 align-self-center p-2">
                        <div class="widget widget-sideTitle">
                            <h1>Branch Liaison<br/>Management Information<br/>System</h1>
                        </div>
                    </div>
                    <div class="col-sm-5">
                        <div class="widget widget-login float-right">
                            
                            @if ($errors->has('token'))
                                <div class="alert alert-danger">
                                    {{ $errors->first('token') }}
                                </div>
                            @endif
                            <div class="widget-inner">
                                <h5>Reset Password</h5>
                                <form class="needs-validation" role="form" method="POST" novalidate  action="{{ url('/password/reset') }}">
                                    {!! csrf_field() !!}
                                    <input type="hidden" name="token" value="{{ $token }}">
                                    <div class="form-group">
                                        <label for="user_name">User Name</label>
                                        <div class="input-group-prepend">
                                            <span class="input-group-text"><i class="fas fa-user"></i></span>
                                            <input type="text" id="user_name" name="user_name" aautocomplete="off" class="form-control{{ $errors->has('user_name') ? ' is-invalid' : '' }}" placeholder="@userName" value="{{ !empty($user_name) ? $user_name : old('user_name') }}"/>
                                            @if ($errors->has('user_name'))
                                            <div class="invalid-feedback">{{ $errors->first('user_name') }}</div>
                                            @endif
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="user_pass">New Password</label>
                                        <div class="input-group-prepend">
                                            <span class="input-group-text"><i class="fas fa-lock"></i></span>
                                            <input type="password" id="user_pass" name="password" class="form-control{{ $errors->has('password') ? ' is-invalid' : '' }}" placeholder="********" value="{{ old('password') }}"/>
                                            @if ($errors->has('password'))
                                            <div class="invalid-feedback">{{ $errors->first('password') }}</div>
                                            @endif
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="user_pass2">Re-type New Password</label>
                                        <div class="input-group-prepend">
                                            <span class="input-group-text"><i class="fas fa-lock"></i></span>
                                            <input type="password" id="user_pass2" name="password_confirmation" class="form-control{{ $errors->has('password_confirmation') ? ' is-invalid' : '' }}" placeholder="********" />
                                            @if ($errors->has('password_confirmation'))
                                            <div class="invalid-feedback">{{ $errors->first('password_confirmation') }}</div>
                                            @endif
                                        </div>
                                    </div>
                                    <div class="">
                                        <button type="submit" class="btn btn-primary btn-block">Submit</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
@section('script')
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
<script>
$('input').on('keypress change', function(){
    $(this).removeClass('is-invalid');
    $(this).off('keypress change');
});
</script>
@endsection