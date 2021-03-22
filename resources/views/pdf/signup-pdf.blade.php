<!DOCTYPE html>
<html>
<head>
    <title>SIGNUP DETAILS</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0px auto;width: 100%;background: #FFFFFF;">
         
<?php 
//dd(URL::to('media/uploads').'/'.$imag[0]->path);
$img = 'media/uploads'.'/'.$imag[0]->path;
?>
          <h5 style="margin:0; margin-bottom: 4px;font-family: sans-serif;text-align: center;">PRIME MINISTER'S OFFICE</h5>
          
          <h5 style="margin:0; margin-bottom: 4px;font-family: sans-serif;text-align: center;">BOARD OF INVESTMENT</h5>

          <h5 style="margin-bottom: 4px;font-family: sans-serif;color: #929090;text-align: left;margin-top:-90px;">Registered On: {{date('d/m/Y', strtotime($signup->subscribed_at))}}</h5>
         
           <img src="{{$img}}" style="width:150px;height:80px; margin-left:550px;margin-top:-80px;">
      <main>
        
      <table cellspacing="0" style="width: 100%;text-align: left; margin-bottom: 150px;">
        <tbody>
          <tr>
            <th colspan="2" style="background-color: #01B7FF;color: #FFF;padding: 20px 20px;font-size: 16px;font-family: sans-serif;">Foreign Company Details</th>
          </tr>
         <!--  <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Company Name</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"><?php $service = collect(App\Lookups\ServiceType::DATA)->firstWhere('value', $signup->service_type_id); echo $service['text']; ?></td>
          </tr> -->
          <tr style="background-color: #fafeff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Company Name</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$signup->name}}</td>
          </tr>
          <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Company Sector</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"><?php $sector = explode(",",$signup->sector_id);
                $sector_id="";
                foreach ($sector as  $value) {
                  $sector = collect(App\Lookups\Sector::DATA)->firstWhere('value', $value);
                     $sector_id .= $sector['text'].',';

                }
                  echo rtrim($sector_id,",");
               ?>
                 
               </td>
          </tr>
          <tr style="background-color: #fafeff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Company Address</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$signup->contact->location->address_line1}}</td>
          </tr>
          <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Country</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"><?php $country = collect(App\Lookups\Country::DATA)->firstWhere('value', $signup->contact->location->country); echo $country['text']; ?></td>
          </tr>
          <tr style="background-color: #fafeff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">City</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"><?php $city = collect(App\Lookups\City::DATA)->firstWhere('value', $signup->contact->location->city); echo $city['text']; ?></td>
          </tr>
          <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Postal Code / Zip Code </th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$signup->contact->location->zip}}</td>
          </tr>
          <tr style="background-color: #fafeff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Company Telephone No </th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$signup->contact->office_phone}}</td>
          </tr>
          <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Company Fax No</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$signup->contact->office_fax}}</td>
          </tr>
          <tr style="background-color: #fafeff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Company Email</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$signup->contact->office_email}}</td>
          </tr>
     
          <!-- Foreign Company Contact Person -->
          <tr>
            <th colspan="2" style="background-color: #01B7FF;color:#FFF;padding: 20px 20px;font-size: 16px;font-family: sans-serif;">Foreign Company Contact Person</th>
          </tr>
         <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Full Name </th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$signup->contact->full_name}}</td>
          </tr>

          <tr style="background-color: #fafeff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Email Address </th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$signup->contact->primary_email}}</td>
          </tr>
          
          <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Contact No  </th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$signup->contact->primary_phone}}</td>
          </tr>

          <tr style="background-color: #fafeff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">National Card </th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$signup->contact->nic_no}}</td>
          </tr>
          <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Passport Number </th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$signup->contact->passport_no}}</td>
          </tr>
          

          <!-- Principal Officer Information -->
           <tr>
            <th colspan="2" style="background-color: #01B7FF;color: #FFF;padding: 20px 20px;font-size: 16px;font-family: sans-serif;">Principal Officer Information</th>
          </tr>
          <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Full Name</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$signup->principal_officer->full_name}}</td>
          </tr>
          <tr style="background-color: #fafeff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">National Card </th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$signup->principal_officer->nic_no}}</td>
          </tr>
          <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Passport Number </th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$signup->principal_officer->passport_no}}</td>
          </tr>
          

          <!-- Director Information -->
          @if($signup->directors)
          @foreach($signup->directors as $key => $row)
          <tr>
            <th colspan="2" style="background-color: #01B7FF;color: #FFF;padding: 20px 20px;font-size: 16px;font-family: sans-serif;">Director Information {{$key+1}}</th>
          </tr>
          
          <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Full Name</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$row->full_name}}</td>
          </tr>
          <tr style="background-color: #fafeff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">National Card </th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$row->nic_no}}</td>
          </tr>
          <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Passport Number </th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$row->passport_no}}</td>
          </tr>
          @endforeach
          @endif
        </tbody>
      </table>
    </main>
        <h5 style="margin:0; margin-bottom: 4px;font-size:14px; font-family: sans-serif; color:#333;text-align: right;">SIGNATURE OF CHIEF EXECUTIVEVE</h5>
        <h5 style="margin:0; margin-bottom: 4px;font-size:14px;font-family: sans-serif;color:#333;text-align: right;">OF THE COMPANY WITH THE STAMP</h5>

</body>
</html>