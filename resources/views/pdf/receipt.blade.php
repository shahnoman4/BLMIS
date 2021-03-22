<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Receipt</title>
    <link rel="stylesheet" href="style.css" media="all" />
  </head>
  <body>
    <header class="clearfix">
      <div id="logo">
        <img src="media/logo-boi.PNG">
      </div>
      <div class="lineh1">
      <h1>Branch Liaison Management Information System</h1>
         <p>  Payment Receipt (<?php if(isset($branch->payment->pp_txn_ref_no) && $branch->payment->pp_txn_ref_no!=""){ echo 'Manual';}else{echo 'Online';} ?>)</p>
       <p>Application ID <?php if(isset($branch->uid)){ echo substr($branch->uid, 0, 3) . substr($branch->uid, strlen($branch->uid) - 3);} ?></p>
       </div>
      <!-- <div id="company" class="clearfix">
        <div>Company Name</div>
        <div>455 Foggy Heights,<br /> AZ 85004, US</div>
        <div>(602) 519-0450</div>
        <div><a href="mailto:company@example.com">company@example.com</a></div>
      </div> -->
      <div id="project">
        <div><span>Company Name</span> {{$signup->name}}</div>
        <!-- <div><span>Application ID</span> <?php if(isset($branch->uid)){ echo substr($branch->uid, 0, 3) . substr($branch->uid, strlen($branch->uid) - 3);} ?></div> -->
        <!-- <div><span>PROJECT</span> Website development</div>
        <div><span>CLIENT</span> John Doe</div> -->
        
        <div><span>E-mail</span> <a href="#"><?php if(isset($branch->company->contact->primary_email)){ echo $branch->company->contact->primary_email;} ?></a></div>
        <div><span>Transaction ID</span> <?php if(isset($branch->payment->pp_txn_ref_no) && $branch->payment->pp_txn_ref_no!=""){ echo $branch->payment->pp_txn_ref_no;}else if(isset($branch->payment->pp_retreival_ref_no) && $branch->payment->pp_retreival_ref_no!=""){echo $branch->payment->pp_retreival_ref_no;} ?></div>
        <div><span>Transaction Date</span><?php if(isset($branch->payment->updated_at)){ echo $branch->payment->updated_at;}else if(isset($branch->payment->created_at)){ echo $branch->payment->created_at ;} ?></div>
        <div><span>Address</span> <?php if(isset($branch->company->contact->location->address_line1)){ echo $branch->company->contact->location->address_line1;} ?></div>
      </div>
    </header>
    <main>
      <table>
        <thead>
          <tr>
            <th class="service">TYPE OF SERVICES</th>
            <th>USD AMOUNT</th>
            <th>PKR RATE</th>
            <th>PKR TOTAL</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="service"><?php $service = collect(App\Lookups\ServiceType::DATA)->firstWhere('value', $branch->service_type_id); echo $service['text']; ?></td>
            <td class="desc">$<?php if(isset($branch->payment->usd_amount)){ echo $branch->payment->usd_amount;} ?></td>
            <td class="unit"><?php if(isset($branch->payment->pkr_rate)){ echo $branch->payment->pkr_rate;} ?></td>
            <td class="total"><?php if(isset($branch->payment->usd_amount)){ echo $branch->payment->usd_amount * $branch->payment->pkr_rate;} ?></td>
          </tr>
          <!-- <tr>
            <td colspan="3">SUBTOTAL</td>
            <td class="total"><?php if(isset($branch->payment->usd_amount)){ echo $branch->payment->usd_amount * $branch->payment->pkr_rate;} ?></td>
          </tr>
          <tr>
            <td colspan="3">DISCOUNT</td>
            <td class="total">00.00</td>
          </tr>
          <tr>
            <td colspan="3" class="grand total"> TOTAL</td>
            <td class="grand total"><?php if(isset($branch->payment->usd_amount)){ echo $branch->payment->usd_amount * $branch->payment->pkr_rate;} ?></td>
          </tr> -->
          <tr>
            <td colspan="3" class="grand total"> </td>
            <td class="grand total"></td>
          </tr>
        </tbody>
      </table>
      <!-- <div id="notices">
        <div>NOTICE:</div>
        <div class="notice">A finance charge of 1.5% will be made on unpaid balances after 30 days.</div>
      </div> -->
    </main>
    <footer>
      Invoice was created on a computer and is valid without the signature and seal.
    </footer>
  </body>
</html>

<style type="text/css">
  .clearfix:after {
  content: "";
  display: table;
  clear: both;
}

a {
  color: #5D6975;
  text-decoration: underline;
}

body {
  position: relative;
  width: 18cm;  
  height: 29.7cm; 
  margin: 0 auto; 
  color: #001028;
  background: #FFFFFF; 
  font-family: Arial, sans-serif; 
  font-size: 12px; 
  font-family: Arial;
}

header {
  padding: 10px 0;
  margin-bottom: 30px;
}

#logo {
  text-align: center;
  margin-bottom: 10px;
}

#logo img {
  width: 54px;
  height: 64px;
}

h1 {
  
  color: #5D6975;
  line-height: 0.4em;
  text-align: center;
  /*font-size: 2.4em;
  line-height: 1.4em;
  font-weight: normal;*/
  
}

p {
  
  color: #5D6975;
  font-size: 1.8em;
  line-height: 0.4em;
  text-align: center;
  /*font-size: 2.4em;
  line-height: 1.4em;
  font-weight: normal;*/
  
}

.lineh1{
  border-top: 1px solid  #5D6975;
  border-bottom: 1px solid  #5D6975;
  text-align: left;
  margin: 0 0 20px 0;
  background: url(media\dimension.png);
}

#project {
  float: left;
}

#project span {
  color: #5D6975;
  text-align: right;
  width: 52px;
  margin-left:10px;
  margin-right: 10px;
  display: inline-block;
  font-size: 0.8em;
}

#company {
  float: right;
  text-align: right;
}

#project div,
#company div {
  white-space: nowrap;        
}

table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  margin-bottom: 20px;
}

table tr:nth-child(2n-1) td {
  background: #F5F5F5;
}

table th,
table td {
  text-align: center;
}

table th {
  padding: 5px 20px;
  color: #5D6975;
  border-bottom: 1px solid #C1CED9;
  white-space: nowrap;        
  font-weight: normal;
}

table .service,
table .desc {
  text-align: left;
}

table td {
  padding: 20px;
  text-align: right;
}

table td.service,
table td.desc {
  vertical-align: top;
}

table td.unit,
table td.qty,
table td.total {
  font-size: 1.2em;
}

table td.grand {
  border-top: 1px solid #5D6975;;
}

#notices .notice {
  color: #5D6975;
  font-size: 1.2em;
}

footer {
  color: #5D6975;
  width: 100%;
  height: 30px;
  position: absolute;
  bottom: 0;
  border-top: 1px solid #C1CED9;
  padding: 8px 0;
  text-align: center;
}
</style>