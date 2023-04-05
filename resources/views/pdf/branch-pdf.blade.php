<!DOCTYPE html>
<html>
<head>
    <title>Branch Application</title>
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
            
          <h5 style="margin:0; margin-bottom: 10px;font-family: sans-serif;text-align: center;">BRANCH / LIAISON MANAGEMENT INFORMATION SYSTEM</h5>
          <h5 style="margin-bottom: 4px;font-family: sans-serif;color: #929090;text-align: left;margin-top:-90px;">Submited On: {{date('d/m/Y', strtotime($branch->created_at))}}</h5>

          <img src="{{$img}}" style="width:150px;height:100px; margin-left:550px;margin-top:-90px;">
      
      <main>
        
      <table cellspacing="0" style="width: 100%;text-align: left; margin-bottom: 150px;">
        <tbody>
          <tr>
            <th colspan="2" style="background-color: #01B7FF;color: #FFF;padding: 20px 20px;font-size: 16px;font-family: sans-serif;">Business Information</th>
          </tr>
          <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Type of Services</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"><?php $service = collect(App\Lookups\ServiceType::DATA)->firstWhere('value', $branch->service_type_id); echo $service['text']; ?></td>
          </tr>
          <tr style="background-color: #fafeff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Country of Origin</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">
              
              @if($branch->original_country!==0)
              <?php $original_country = collect(App\Lookups\Country::DATA)->firstWhere('value', $branch->original_country); echo $original_country['text']; 
               ?>

            @endif</td>

          </tr>
          <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Present Business Activities</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$branch->primary_info}}</td>
          </tr>
          <tr style="background-color: #fafeff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Detail of Proposed Company is Subsidiary of any Other Organization</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$branch->other_org_info}}</td>
          </tr>
          <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Detail Of Project / Ventures in other Countries</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$branch->other_country_info}}</td>
          </tr>
          
          <tr style="background-color: #fafeff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Existing B/L Office in other Country/Countries</th>
              <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"><?php $country = explode(",",$branch->current_country);
                $country_name="";
                foreach ($country as  $value) {
                  $current_country = collect(App\Lookups\Country::DATA)->firstWhere('value', $value);
                     $country_name .= $current_country['text'].',';

                }
                  echo rtrim($country_name,",");
               ?>
              </td>
          </tr>
          <!-- <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">City where project is underway</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$branch->current_city}}</td>
          </tr> -->
          <tr style="background-color: #fafeff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Location where permission is required to establish office in pakistan</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$branch->desired_location}}</td>
          </tr>
          <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Proposed address in Pakistan also indicates places if more than one</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$branch->desired_places}}</td>
          </tr>
          <tr style="background-color: #fafeff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Intended Business Activities in Pakistan</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$branch->business_info}}</td>
          </tr>
          <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Projects/Details of work in Pakistan</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$branch->project_info}}</td>
          </tr>
          <tr style="background-color: #fafeff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Number of Personnel</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$branch->no_of_personnel_employee}}</td>
          </tr>
          <tr style="background-color: #fafeff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Details of foreign firm for capital</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$branch->firm_for_capital}}</td>
          </tr>
          <tr style="background-color: #fafeff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Details of foreign firm for profit</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$branch->firm_for_profit}}</td>
          </tr>
          <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">State if repatriation facilities are required by the foreign firm for Capital and Profit</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$branch->repatriation_info}}</td>
          </tr>
          <tr style="background-color: #fafeff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">State if any Pakistani Co/individual is associated in the Co. with details of investment (% Share)</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$branch->local_associate_info}}</td>
          </tr>
          <!-- <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Permission Period From</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$branch->start_month}}</td>
          </tr>
          <tr style="background-color: #fafeff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Permission Period To</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$branch->start_year}}</td>
          </tr> -->
          <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Detail Background</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$branch->background_info}}</td>
          </tr>
          <tr style="background-color: #fafeff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Purpose for Opening</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$branch->purpose_info}}</td>
          </tr>

          <!-- Company's Local Sponsor -->
          <tr>
            <th colspan="2" style="background-color: #01B7FF;color:#FFF;padding: 20px 20px;font-size: 16px;font-family: sans-serif;">Company's Local Sponsor</th>
          </tr>
         <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Location</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"><?php if(isset($branch->local_sponsor->location->address_line1)){ echo $branch->local_sponsor->location->address_line1;} ?></td>
          </tr>
           
          <tr style="background-color: #fafeff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">City</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"><?php if(isset($branch->local_sponsor->location->city)){ echo $branch->local_sponsor->location->city;} ?></td>
          </tr>
          
          <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Telephone Number </th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"><?php if(isset($branch->local_sponsor->office_phone)){ echo $branch->local_sponsor->office_phone;} ?></td>
          </tr>

          <tr style="background-color: #fafeff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Cell Number</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"><?php if(isset($branch->local_sponsor->mobile_phone)){ echo $branch->local_sponsor->mobile_phone;} ?></td>
          </tr>
          <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Fax Number</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"><?php if(isset($branch->local_sponsor->office_fax)){ echo $branch->local_sponsor->office_fax;} ?></td>
          </tr>
          <tr style="background-color: #fafeff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Email Address</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"><?php if(isset($branch->local_sponsor->office_email)){ echo $branch->local_sponsor->office_email;} ?></td>
          </tr>


          <!-- Company's Complete Local Address-->
          <tr>
            <th colspan="2" style="background-color: #01B7FF;color:#FFF;padding: 20px 20px;font-size: 16px;font-family: sans-serif;">Company's Complete Local Address</th>
          </tr>
         <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Location</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"><?php if(isset($branch->local_contact->location->address_line1)){ echo $branch->local_contact->location->address_line1;} ?></td>
          </tr>
           
          <tr style="background-color: #fafeff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">City</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"><?php if(isset($branch->local_contact->location->city)){ echo $branch->local_contact->location->city;} ?></td>
          </tr>
          
          <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Telephone Number </th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"><?php if(isset($branch->local_contact->office_phone)){ echo $branch->local_contact->office_phone;} ?></td>
          </tr>

          <tr style="background-color: #fafeff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Cell Number</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"><?php if(isset($branch->local_contact->mobile_phone)){ echo $branch->local_contact->mobile_phone;} ?></td>
          </tr>
          <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Fax Number</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"><?php if(isset($branch->local_contact->office_fax)){ echo $branch->local_contact->office_fax;} ?></td>
          </tr>
          <tr style="background-color: #fafeff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Email Address</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"><?php if(isset($branch->local_contact->office_email)){ echo $branch->local_contact->office_email;} ?></td>
          </tr>

          <!-- Contractee Information -->
           <tr>
            <th colspan="2" style="background-color: #01B7FF;color: #FFF;padding: 20px 20px;font-size: 16px;font-family: sans-serif;">Contractee Information</th>
          </tr>
          <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Company Name</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$branch->company->name}}</td>
          </tr>
          <tr style="background-color: #fafeff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Company Sector </th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"><?php $sector = explode(",",$branch->company->sector_id);
                $sector_id="";
                foreach ($sector as  $value) {
                  $sector = collect(App\Lookups\Sector::DATA)->firstWhere('value', $value);
                     $sector_id .= $sector['text'].',';

                }
                  echo rtrim($sector_id,",");
               ?><!-- <?php // $sector = collect(App\Lookups\Sector::DATA)->firstWhere('value', $branch->company->sector_id); echo $sector['text']; ?> --></td>
          </tr>
          <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Company Address  </th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$branch->company->contact->location->address_line1}}</td>
          </tr>
          <tr style="background-color: #fafeff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Country  </th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$branch->company->contact->location->country}}</td>
          </tr>
          <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">City</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$branch->company->contact->location->city}}</td>
          </tr>
          <tr style="background-color: #fafeff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Postal Code/Zip Code</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$branch->company->contact->location->zip}}</td>
          </tr>
          <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"> Phone Number</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$branch->company->contact->office_phone}}</td>
          </tr>
          <tr style="background-color: #fafeff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"> Fax Number</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$branch->company->contact->office_fax}}</td>
          </tr>
          <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Company Email Address</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$branch->company->contact->office_email}}</td>
          </tr>

          <!-- Agent Information -->
          <tr>
            <th colspan="2" style="background-color: #01B7FF;color: #FFF;padding: 20px 20px;font-size: 16px;font-family: sans-serif;">Agent Information</th>
          </tr>
          <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"> Full Name </th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$branch->agent->full_name}}</td>
          </tr>
          
          <tr style="background-color: #fafeff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"> Type</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"><?php $type = collect(App\Lookups\AgentType::DATA)->firstWhere('value', $branch->agent->contact_category_id); echo $type['text']; ?></td>
          </tr>

          <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"> Cell No</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$branch->agent->mobile_phone}}</td>
          </tr>
          <tr style="background-color: #fafeff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"> Email</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$branch->agent->primary_email}}</td>
          </tr>
          <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"> Address</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$branch->agent->location->address_line1}}</td>
          </tr>
          <tr style="background-color: #fafeff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"> Country</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$branch->agent->location->country}}</td>
          </tr>
          <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">City</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$branch->agent->location->city}}</td>
          </tr>

          <!-- Contract Information -->
          <?php if(($branch->service_type_id=='1') || ($branch->service_type_id=='2')) { ?>
          <tr>
            <th colspan="2" style="background-color: #01B7FF;color: #FFF;padding: 20px 20px;font-size: 16px;font-family: sans-serif;">Contract Information
            </th>
          </tr>
          <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Title of Contract </th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$branch->contract->title}}</td>
          </tr>
          <?php 
                 $timestamp = strtotime($branch->contract->start_date);
                 $newDate = date('F j, Y', $timestamp); 
          ?>
          <tr style="background-color: #fafeff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"> Starting Date</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$newDate}}</td>
          </tr>
          <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"> Page Number</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$branch->contract->start_page}}</td>
          </tr>
          <tr style="background-color: #fafeff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"> Clause Number</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$branch->contract->start_clause}}</td>
          </tr>
          <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"> Validity Period</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$branch->contract->valid_for_years}}</td>
          </tr>
          <tr style="background-color: #fafeff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"> Defects Period From</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$branch->contract->defect_start_month}}/{{$branch->contract->defect_start_year}}</td>
          </tr>
          <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Defects Period To</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$branch->contract->defect_end_month}}/{{$branch->contract->defect_end_year}}</td>
          </tr>
          <tr style="background-color: #fafeff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"> Cost of Project</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$branch->contract->project_cost}}</td>
          </tr>
          
          <!-- Local Company/ Partner Details -->
          @foreach($branch->partnerCompanies as $key => $row)
          <tr>
            <th colspan="2" style="background-color: #01B7FF;color: #FFF;padding: 20px 20px;font-size: 16px;font-family: sans-serif;">Local Company/ Partner Details {{$key+1}}</th>
          </tr>

          <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Full Name </th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$row->full_name}}</td>
          </tr>
          <tr style="background-color: #fafeff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"> Company Address</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"><?php if(isset($row->location->address_line1)){ echo $row->location->address_line1;} ?></td>
          </tr>
          <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"> Country</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"><?php if(isset($row->location->address_line1)){ echo $row->location->country;} ?></td>
          </tr>
          <tr style="background-color: #fafeff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">City</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"><?php if(isset($row->location->address_line1)){ echo $row->location->city;} ?></td>
          </tr>
          <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"> Postal Code/Zip Code</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"><?php if(isset($row->location->address_line1)){ echo $row->location->zip;} ?></td>
          </tr>
          <tr style="background-color: #fafeff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"> Phone Number</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$row->office_phone}}</td>
          </tr>
          <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Fax Number</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$row->office_fax}}</td>
          </tr>
          <tr style="background-color: #fafeff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Company Email Address</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$row->office_email}}</td>
          </tr>
          <!-- Local Company/Partner Contact Person -->
          <tr>
            <th colspan="2" style="background-color: #01B7FF;color: #FFF;padding: 20px 20px;font-size: 16px;font-family: sans-serif;"> Local Company/Partner Contact Person {{$key+1}}</th>
          </tr>
            <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Full Name </th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"><?php if(isset($row->contact->full_name)){ echo $row->contact->full_name;} ?></td>
          </tr>
          <tr style="background-color: #fafeff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Email</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"><?php if(isset($row->contact->primary_email)){ echo $row->contact->primary_email;} ?></td>
          </tr>
          <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"> Contact Number</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"><?php if(isset($row->contact->primary_phone)){ echo $row->contact->primary_phone;} ?></td>
          </tr>
          <tr style="background-color: #fafeff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">CNIC No</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"><?php if(isset($row->contact->nic_no)){ echo $row->contact->nic_no;} ?></td>
          </tr>
          @endforeach
          <?php }?>
          <!-- Investment Information -->
          <tr>
            <th colspan="2" style="background-color: #01B7FF;color: #FFF;padding: 20px 20px;font-size: 16px;font-family: sans-serif;">Investment Information</th>
          </tr>
          <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Investment proposed to be made in detail foreign/local  </th>
            <td style="padding:10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$branch->investment->proposal_info}}</td>
          </tr>
          <tr style="background-color: #fafeff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Annual Recurring expenses of office  </th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$branch->investment->annual_expenses}}</td>
          </tr>
          <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">State programe to establish investment project in pakistan, if so nature of the same </th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$branch->investment->investment_info}}</td>
          </tr>
          <tr style="background-color: #fafeff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Name of Bank in Pakistan </th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$branch->investment->pk_bank}}</td>
          </tr>
          <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"> Designated person </th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$branch->investment->designated_person}}</td>
          </tr>
          <tr style="background-color: #fafeff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">other information  </th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">{{$branch->investment->comments}}</td>
          </tr>
          <!-- Security Information -->
              <tr>
            <th colspan="2" style="background-color: #01B7FF;color: #FFF;padding: 20px 20px;font-size: 16px;font-family: sans-serif;">Security Information</th>
          </tr>
          @if($branch->security_required==1)
          <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Is Services Needed   </th>
            <td style="padding:10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Yes</td>
          </tr>
          <tr style="background-color: #fafeff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Registered Name </th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"><?php if(isset($branch->securityAgency->name)){ echo $branch->securityAgency->name;} ?></td>
          </tr>
          
          <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Company NTN No  </th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"><?php if(isset($branch->securityAgency->ntn)){ echo $branch->securityAgency->ntn;} ?></td>
          </tr>
          <tr style="background-color: #fafeff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Is the security company purely pakistani based  </th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"><?php if(isset($branch->securityAgency->is_pk_based) && $branch->securityAgency->is_pk_based==1){ echo "Yes"; }else{ echo "No";} ?></td>
          </tr>
          <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Has it hired services of foreign consultant/nationals, in any form or manner </th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"><?php if(isset($branch->securityAgency->has_foreign_consultant) && $branch->securityAgency->has_foreign_consultant==1){ echo "Yes"; }else{ echo "No";} ?></td>
          </tr>
          <tr style="background-color: #fafeff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Is it a Pakistani chapter/partnership/extension of a foreign security company? If yes give details </th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"><?php if(isset($branch->securityAgency->is_extension) && $branch->securityAgency->is_extension==1){ echo "Yes"; }else{ echo "No";} ?></td>
          </tr>

          <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Address  </th>
            <td style="padding:10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"><?php if(isset($branch->securityAgency->contact->location->address_line1)){ echo $branch->securityAgency->contact->location->address_line1;} ?></td>
          </tr>
          <tr style="background-color: #fafeff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Country </th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"><?php if(isset($branch->securityAgency->contact->location->country)){ echo $branch->securityAgency->contact->location->country;} ?></td>
          </tr>
          <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">City </th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"><?php if(isset($branch->securityAgency->contact->location->city)){ echo $branch->securityAgency->contact->location->city;} ?></td>
          </tr>
          <tr style="background-color: #fafeff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Telephone Number  </th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"><?php if(isset($branch->securityAgency->contact->office_phone)){ echo $branch->securityAgency->contact->office_phone;} ?></td>
          </tr>
          <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"> Fax Number  </th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"><?php if(isset($branch->securityAgency->contact->office_fax)){ echo $branch->securityAgency->contact->office_fax;} ?></td>
          </tr>
          <tr style="background-color: #fafeff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Email Address   </th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"><?php if(isset($branch->securityAgency->contact->office_email)){ echo $branch->securityAgency->contact->office_email;} ?></td>
          </tr>
          <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Postal Code/Zip Code  </th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"><?php if(isset($branch->securityAgency->contact->location->zip)){ echo $branch->securityAgency->contact->location->zip;} ?></td>
          </tr>
          @else
          <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">Is Services Needed   </th>
            <td style="padding:10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">No</td>
          </tr>
          @endif

          <tr>
            <th colspan="2" style="background-color: #01B7FF;color: #FFF;padding: 20px 20px;font-size: 16px;font-family: sans-serif;">Payment Information</th>
          </tr>
            <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">USD Amount </th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"><?php if(isset($branch->payment->usd_amount)){ echo $branch->payment->usd_amount;} ?></td>
          </tr>
          <tr style="background-color: #fafeff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;">PKR Rate</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"><?php if(isset($branch->payment->pkr_rate)){ echo $branch->payment->pkr_rate;} ?></td>
          </tr>
          <tr style="background-color: #fff;">
            <th style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"> Challan No</th>
            <td style="padding:  10px 20px;font-size: 14px;font-family: sans-serif;color: #333;border-top: 1px solid #dee2e6;"><?php if(isset($branch->payment->pp_txn_ref_no)){ echo $branch->payment->pp_txn_ref_no;} ?></td>
          </tr>
          
        </tbody>
      </table>
    </main>
        <h5 style="margin:0; margin-bottom: 4px;font-size:14px; font-family: sans-serif; color:#333;text-align: right;">SIGNATURE OF CHIEF EXECUTIVEVE</h5>
        <h5 style="margin:0; margin-bottom: 4px;font-size:14px;font-family: sans-serif;color:#333;text-align: right;">OF THE COMPANY WITH THE STAMP</h5>

</body>
</html>