@if($user->isCompanyOwner())
Dear Sir / Madam,
<br/>
<br/>
  Your application for signup username = {{$user->user_name}} has been received, Your password is {{$password}}, You will be informed regarding the progress shortly.
<br/>
<br/>
Regards,<br/>
FTP Section<br/>
Prime Minister's Office<br/>
Board of Investment<br/> 
@else
A new company is registered.
@endif