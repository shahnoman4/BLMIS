import React from "react";
import ListComponent from "./commonComponent/listComponent";
import GuideList from "./commonComponent/guideLinks";
import {Link} from 'react-router-dom'
import api from '../../config/app';
import Slider from "react-slick";

class Home extends React.Component{
      constructor(props){
        super(props); 
        this.istlist=[
            {
                child:{ 
                    img:[
                        asset('images/b1.png'), 
                    ]
                }
            }
        ];
        this.state = {
            data:[],
            slider:[],
        };
    }

    componentDidMount(){
        api.get('user/siteConfig').then(res => {
          this.setState({ data: res['config'],slider: res['slider']});
        })
        .catch(function (error) {
          console.log(error);
        })
    }
    render(){
  var settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
      responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1,
                        infinite: true,
                        dots: false
                    }
                },
                {
                    breakpoint: 991,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1,
                        infinite: true,
                        dots: false
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1,
                        infinite: true,
                        dots: false
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        initialSlide: 2
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
    };
        return(
        <React.Fragment>
        <div className="home-page-wrappwer">   
        <div id="demo" className="carousel slide" data-ride="carousel">

        
        <ul className="carousel-indicators">
            <li data-target="#demo" data-slide-to="0" className="active"></li>
            <li data-target="#demo" data-slide-to="1"></li>
            <li data-target="#demo" data-slide-to="2"></li>
        </ul>

       
        <div className="carousel-inner">
             {
               this.state.slider && this.state.slider.map((slider,index)=>{
                    return(
                            <div key={index} className={"carousel-item" + (index==0 ? " active" : "")}>
                              <img src={"media/uploads/slider/" + slider.uploads} alt=""/>
                                <div className="banner-content">
                                    <h3>{slider.title_1}</h3><br/>
                                    <h4>{slider.title_2}</h4><br/>
                                    <h4>{slider.title_3}</h4>
                                </div>
                            </div>
                          )
                })
            }
        </div>

        <a className="carousel-control-prev" href="#demo" data-slide="prev">
            <span className="carousel-control-prev-icon"></span>
        </a>
        <a className="carousel-control-next" href="#demo" data-slide="next">
            <span className="carousel-control-next-icon"></span>
        </a>
    </div>

    
    <div className="attantion-msg">
        <p><marquee><span>Note:</span>{this.state.data.notes}</marquee></p>
    </div>

    <div className="container">
        <div className="row">
            <div className="col-md-12">
            <div class="news-details mb-0">
				    <ul class="details">
                          <li class="item">
						        <span class="btn-text font-12 letter-spacing-custom custom-blue">All the applications for permission of grant/ renewal of Branch / Liaison Office 
						        cases will be accepted through “Branch/Liaison Office Management Information System (BLMIS)”</span>
				        </li>
                        <li class="item">
				      
						        <span class="btn-text font-12 letter-spacing-custom custom-blue">The company will upload all necessary documents as 
						        listed in the instructions in pdf format. Each file not more than 1500 kilobytes. However, pictures can be uploaded in png, jpg and jpeg formats”</span>
				          
				        </li>
                        <li class="item">
				          
						        <span class="btn-text font-12 letter-spacing-custom custom-blue">The process of submission of application will be 
						        completed after payment of the requisite fee.</span>
				 
				        </li>
				        <li class="item">
			
						        <span class="btn-text font-12 letter-spacing-custom custom-blue">The application will be returned to the company online 
						        through “Branch/Liaison Office Management Information System (BLMIS)” and will appear in the user account, 
						        if found incomplete or in case of any query. The application can be re-submitted with the provision of requisite information.</span>
				            
				        </li>
				        <li class="item">
				      
						        <span class="btn-text font-12 letter-spacing-custom custom-blue">The companies are required to send one (01) hard copy of Registration/ Incorporation certificate and Articles/ Memorandum of Association duly attested by respective 
						        Pakistan Mission to Board of Investment within 15 (fifteen) days of filling the application on “Branch/Liaison Office Management Information System (BLMIS)”.</span>
				       
				        </li>
				    </ul>
			    </div>
                <div className="process-section">
                    <img src="images/process.png" alt=""></img>
                </div>
            </div>

	            <div className="process-links">
				    <ul className="links">
                        <li className="link">
                            <a href="how-to-apply">
                                 <img src="images/info.png" className="icon" alt=""></img>
                                 <span className="btn-text text-upper letter-spacing-custom">How to apply</span>
                                 <span class="btn-text font-10">Learn how to apply for Branch/Liaison</span>
                            </a>
                         </li>
				        <li className="link">
				           <a href="photograph-guide">
						        <img src="images/camera.png" className="icon" alt=""></img>
						        <span className="btn-text text-upper letter-spacing-custom">PHOTOGRAPH GUIDE</span>
						        <span class="btn-text font-10">How to upload photo</span>
				            </a>
				        </li>
				         <li className="link">
				            <a href="document-guide">
						         <img src="images/doc.png" className="icon" alt=""></img>
						         <span className="btn-text text-upper letter-spacing-custom">DOCUMENTS GUIDE</span>
						         <span class="btn-text font-10">How to upload documents</span>
				            </a>
				         </li>
				         <li className="link">
				            <a href="application-guide">
						         <img src="images/search-icon.png" className="icon" alt=""></img>
						         <span className="btn-text text-upper letter-spacing-custom">APPLICATION GUIDE</span>
						         <span class="btn-text font-10">Detailed guide for the application</span>
				            </a>
				         </li>
				         
				    </ul>
			    </div>
        </div>
    </div>
    
    <div className="b-l-c">
        <div className="container">
            <div className="row">
                <div className="col-sm-12">
                    <h4>Branch/Liaison Categories</h4>
                </div>
                <Slider {...settings} className="custom-slider">
   
                <div className="col-md-3 custom-img">
                    <div className="card-wrapper">
                      <Link to="/NewBranch">
                        <div className="card-inner">
                            <img src="images/n-p.png" alt=""/>
                        </div>
                        <div className="c-content">
                            <h3>NEW PERMISSION TO BRANCH </h3>
                        </div>
                      </Link>  
                    </div>
                </div>
                <div className="col-md-3 custom-img">
                    <div className="card-wrapper">
                      <Link to="/RenewalBranch">
                        <div className="card-inner">
                            <img src="images/r-b.png" alt=""/>
                        </div>
                        <div className="c-content">
                            <h3>RENEWAL OF BRANCH </h3>
                        </div>
                      </Link>  
                    </div>
                </div>
                <div className="col-md-3 custom-img">
                    <div className="card-wrapper">
                      <Link to="/NewLiaison">
                        <div className="card-inner">
                            <img src="images/n-l.png" alt=""/>
                        </div>
                        <div className="c-content">
                            <h3>NEW PERMISSION
                                TO LIAISON</h3>
                        </div>
                      </Link>  
                    </div>
                </div>
                <div className="col-md-3 custom-img">
                    <div className="card-wrapper">
                      <Link to="/RenewalLiaison">
                        <div className="card-inner">
                            <img src="images/r-l.png" alt=""/>
                        </div>
                        <div className="c-content">
                            <h3>RENEWAL OF LIAISON</h3>
                        </div>
                      </Link>  
                    </div>
                </div>
                <div className="col-md-3 custom-img">
                    <div className="card-wrapper">
                      <Link to="/Conversion">
                        <div className="card-inner">
                            <img src="images/r-b.png" alt=""/>
                        </div>
                        <div className="c-content">
                            <h3> CONVERSION </h3>
                        </div>
                      </Link>  
                    </div>
                </div>
	            </Slider>
            </div>
        </div>
    </div>


    <div className="land-video">
        <div className="container">
            <div className="row">
                <div className="col-sm-6">
                    <div className="land-content">
                        <h3>{this.state.data.title_1}</h3>
                        <p>{this.state.data.description}</p>
                    </div>
                </div>
                <div className="col-sm-6">
                    <div className="video-con">
                        <iframe width="560" height="315" src={this.state.data.video_link} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
    </React.Fragment>
        );
    }
}

export default Home;