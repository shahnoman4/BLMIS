<?php

use \App\Lookups\ApplicationStatus;
use \App\Lookups\Authorization;
use \App\Lookups\Permission;

/*
|------------------------------------------------------------
| Define menus & routes to be used by React
|------------------------------------------------------------
|
*/
if(strtoupper(env('MENU_BAR')) === 'OFF'){
    $publicMenu =  [
        ["label" => "Home", "to" => "/", "exact" => true],
        ["label" => "Fees", "to" => "/fees"],
        ["label" => "Login", "to" => "/login"],
    ]; 
}
else{
    $publicMenu = [
        ["label" => "Home", "to" => "/", "exact" => true],
        // ["label" => "Locations", "to" => "/location"],
        ["label" => "Fees", "to" => "/fees"],
        ["label" => "Help", "to" => "/help"],
        ["label" => "Contact Us", "to" => "/contact-us"],
        ["label" => "Login", "to" => "/login"],
        ["label" => "Sign Up", "to" => "/signup"]
    ];
}
return [
    "menus" => [
        "public" =>  $publicMenu,  
        "company" => [
            ["label" => "Dashboard", "to" => "/", "exact" => true],
            ["label" => "Branch/Liaison Office", "to" => "/branch", "exact" => true, "active" => ApplicationStatus::APPROVED],
            ["label" => "Sub Branch/Liaison Office", "to" => "/sub-branch", "active" => ApplicationStatus::APPROVED],
            ["label" => "Company Profile", "to" => "/company-profile"],
            ["label" => "Password Reset", "to" => "/security"],
        ],
        "admin" => [
            ["label" => "Dashboard", "to" => "/", "exact" => true, 'id' => 1],
            [
                "label" => "Company Signup", "to" => "/application/signup", "htmlId" => "menu_signups", 'id' => 2,
                "menus" => [
                    ["label" => "All Signups", "to" => "/application/signup/all", 'id' => 3],
                    ["label" => "New Signups", "to" => "/application/signup/new", 'id' => 4],
                    ["label" => "Rejected Signups", "to" => "/application/signup/rejected", 'id' => 5],
                    ["label" => "Approved Signups", "to" => "/application/signup/approved", 'id' => 6],
                ]
            ],
            [
                "label" => "Branch Office", "to" => "/application/branch", "htmlId" => "menu_branches", 'id' => 7,
                "menus" => [
                    ["label" => "All Applications", "to" => "/application/branch/all", 'id' => 8],
                    ["label" => "New Applications", "to" => "/application/branch/new", 'id' => 9],
                    ["label" => "Reverted Applications", "to" => "/application/branch/reverted", 'id' => 7, 'authorization_id' => Authorization::SUPER_ADMIN],
                    ["label" => "Circulated Applications", "to" => "/application/branch/circulated", 'id' => 10],
                    ["label" => "Mature Applications", "to" => "/application/branch/matured", 'id' => 24],
                    ["label" => "Approved Applications", "to" => "/application/branch/approved", 'id' => 12],
                    ["label" => "Rejected Applications", "to" => "/application/branch/reject", 'id' => 11],
                    ["label" => "Completely Rejected Applications", "to" => "/application/branch/rejected", 'id' => 11, 'authorization_id' => Authorization::SUPER_ADMIN],
                    ["label" => "Hold Applications", "to" => "/application/branch/hold", 'id' =>7],
                    ["label" => "Under Review Applications", "to" => "/application/branch/reviewable", 'id' => 11],
                    ["label" => "Expiring Applications", "to" => "/application/branch/expiring", 'id' => 7],
                    ["label" => "Expired Applications", "to" => "/application/branch/expired", 'id' => 7],
                ]
            ],
            [
                "label" => "Liaison Office", "to" => "/application/liaison", "htmlId" => "menu_liaisons", 'id' => 13,
                "menus" => [
                    ["label" => "All Applications", "to" => "/application/liaison/all", 'id' => 14],
                    ["label" => "New Applications", "to" => "/application/liaison/new", 'id' => 15],
                    ["label" => "Reverted Applications", "to" => "/application/liaison/reverted", 'id' => 13, 'authorization_id' => Authorization::SUPER_ADMIN],
                    ["label" => "Circulated Applications", "to" => "/application/liaison/circulated", 'id' => 16],
                    ["label" => "Mature Applications", "to" => "/application/liaison/matured", 'id' => 25],
                    ["label" => "Approved Applications", "to" => "/application/liaison/approved", 'id' => 18],
                    ["label" => "Rejected Applications", "to" => "/application/liaison/reject", 'id' => 17],
                    ["label" => "Completely Rejected Applications", "to" => "/application/liaison/rejected", 'id' => 17, 'authorization_id' => Authorization::SUPER_ADMIN],
                    ["label" => "Hold Applications", "to" => "/application/liaison/hold", 'id' => 13],
                    ["label" => "Under Review Applications", "to" => "/application/liaison/reviewable", 'id' => 17],
                    ["label" => "Expiring Applications", "to" => "/application/liaison/expiring", 'id' => 13],
                    ["label" => "Expired Applications", "to" => "/application/liaison/expired", 'id' => 13],
                ]
            ],
            [
                "label" => "Converted Branch Office", "to" => "/application/converted-branch", "htmlId" => "menu_c_liaisons", 'id' => 7,
                "menus" => [
                    ["label" => "New Applications", "to" => "/application/converted-branch/new", 'id' => 7],
                    ["label" => "Circulated Applications", "to" => "/application/converted-branch/circulated", 'id' => 7],
                    ["label" => "Mature Applications", "to" => "/application/converted-branch/matured", 'id' => 7],
                    ["label" => "Approved Applications", "to" => "/application/converted-branch/approved", 'id' => 7],
                    ["label" => "Rejected Applications", "to" => "/application/converted-branch/reject", 'id' => 7],
                    ["label" => "Under Review Applications", "to" => "/application/converted-branch/reviewable", 'id' => 7],
                    ["label" => "Hold Applications", "to" => "/application/converted-branch/hold", 'id' => 7],
                ]
            ],
            [
                "label" => "Converted Liaison Office", "to" => "/application/converted-liaison", "htmlId" => "menu_c_branches", 'id' => 13,
                "menus" => [
                    ["label" => "New Applications", "to" => "/application/converted-liaison/new", 'id' => 13],
                    ["label" => "Circulated Applications", "to" => "/application/converted-liaison/circulated", 'id' => 13],
                    ["label" => "Mature Applications", "to" => "/application/converted-liaison/matured", 'id' => 13],
                    ["label" => "Approved Applications", "to" => "/application/converted-liaison/approved", 'id' => 13],
                    ["label" => "Rejected Applications", "to" => "/application/converted-liaison/reject", 'id' => 13],
                    ["label" => "Under Review Applications", "to" => "/application/converted-liaison/reviewable", 'id' => 13],
                    ["label" => "Hold Applications", "to" => "/application/converted-liaison/hold", 'id' => 13],
                ]
            ],
            [
                "label" => "Renewal Requests", "to" => "/application/renewal", 'id' => 19,
            ],
            [
                "label" => "Contract Requests", "to" => "/application/contract", 'id' => 29, 'authorization_id' => Authorization::SUPER_ADMIN
            ],
            [
                "label" => "Copy For Information", "to" => "/application/contract", 'id' => 28, 'authorization_id' => Authorization::ADMIN
            ],
            [
                "label" => "Manage Users", "to" => "/users", "htmlId" => "menu_users", 'id' => 20,
                "menus" => [
                    ["label" => "All Users", "to" => "/users", "exact" => true, 'id' => 21],
                    ["label" => "Add New User", "to" => "/users/new", 'id' => 21],
                    ["label" => "All Roles", "to" => "/users/roles", "exact" => true, 'id' => 22],
                    ["label" => "Add New Role", "to" => "/users/roles/new", 'id' => 22],
                    ["label" => "All Groups", "to" => "/users/groups", "exact" => true, 'id' => 23],
                    ["label" => "Add New Group", "to" => "/users/groups/new", 'id' => 23],
                ]
            ],
            // Reports (code by noman)
            [
                "label" => "Branch Reports", "to" => "/branchReports", "htmlId" => "menu_branch_reports", 'id' => 7,
                "menus" => [
                    ["label" => "Top Ten Cities", "to" => "/branchReports/Branchtoptencities", "exact" => true, 'id' => 7],
                    ["label" => "Top Ten Countries", "to" => "/branchReports/Branchtoptencountries", "exact" => true, 'id' => 7],
                    ["label" => "Top Ten Projects", "to" => "/branchReports/Branchtoptenprojects", "exact" => true, 'id' => 7],
                   // ["label" => "Top Ten Sectors", "to" => "/branchReports/Branchtoptensectors", "exact" => true, 'id' => 7],
                    ["label" => "Top Ten No Of Employee", "to" => "/branchReports/BranchtoptenNoOfEmp", "exact" => true, 'id' => 7],
                ]
            ],

            [
                "label" => "Liaison Reports", "to" => "/liaisonReports", "htmlId" => "menu_liaison_reports", 'id' => 13,
                "menus" => [
                    ["label" => "Top Ten Cities", "to" => "/liaisonReports/Liaisontoptencities", "exact" => true, 'id' => 13],
                    ["label" => "Top Ten Countries", "to" => "/liaisonReports/Liaisontoptencountries", "exact" => true, 'id' => 13],
                    ["label" => "Top Ten Projects", "to" => "/liaisonReports/Liaisontoptenprojects", "exact" => true, 'id' => 13],
                   // ["label" => "Top Ten Sectors", "to" => "/liaisonReports/Liaisontoptensectors", "exact" => true, 'id' => 13],
                    ["label" => "Top Ten No Of Employee", "to" => "/liaisonReports/LiaisontoptenNoOfEmp", "exact" => true, 'id' => 13],
                ]
            ],

            [
                "label" => "Daily Currency Rates", "to" => "/DailyCurrencyRate", 'id' => 13
            ],
            [
                "label" => "Payment Details", "to" => "/PaymentDetail", 'id' => 13
            ],

            // Reports (code by noman)

            [
                "label" => "Password Reset", "to" => "/security", 'id' => 27
            ],

            ["label" => "All Sliders Images", "to" => "/sliders", "exact" => true, 'id' => 23],
            ["label" => "Add New Image", "to" => "/sliders/new", 'id' => 23],
            
            [
                "label" => "Site Config", "to" => "/siteConfig", 'id' => 27
            ],
        ]
    ],
    "routes" => [
        "public" => [
            [
                "path" => "/application-guide", "content" => "public/ApplicationGuide", "exact" => true,
                "bgImage" => "/media/banner-inner.png",
                "props" => ["heading" => "Application Guide"]
            ],
            [
                "path" => "/how-to-apply", "content" => "public/HowToApply", "exact" => true,
                "bgImage" => "/media/banner-inner.png",
                "props" => ["heading" => "How To Apply"]
            ],
            [
                "path" => "/photograph-guide", "content" => "public/PhotographGuide", "exact" => true,
                "bgImage" => "/media/banner-inner.png",
                "props" => ["heading" => "Photograph Guide"]
            ],
            [
                "path" => "/document-guide", "content" => "public/DocumentGuide", "exact" => true,
                "bgImage" => "/media/banner-inner.png",
                "props" => ["heading" => "Document Guide"]
            ],
            [
                "path" => "/", "content" => "public/Home", "exact" => true,
                "bgImage" => "/media/banner-inner.png",
                "props" => ["heading" => "Welcome to Branch Liaison<br/>Management Information System"]
            ],
            [
                "path" => "/fees", "content" => "public/Fees",
                "bgImage" => "/media/banner-inner.png",
                "props" => ["heading" => "Welcome to Branch Liaison<br/>Management Information System"]
            ],
            [
                "path" => "/help", "content" => "public/Help",
                "bgImage" => "/media/banner-inner.png",
                "props" => ["heading" => "Help"]
            ],
            [
                "path" => "/signup", "exact" => true, "content" => "public/SignUp",
                "bgImage" => "/media/banner-inner.png",
                "heading" => "Welcome to Branch Liaison<br/>Management Information System"
            ],
            [
                "path" => "/login", "bgContent" => "public/SignIn",
                "props" => ["heading" => "Welcome to Branch Liaison<br/>Management Information System"],
                "content" => "Common:Blank",
                "bgImage" => "/media/banner.png",
            ],
            [
                "path" => "/branchGuide", "content" => "public/BranchGuide",
                "bgImage" => "/media/banner-inner.png",
            ],
            [
                "path" => "/liaisonGuide", "content" => "public/LiaisonGuide",
                "bgImage" => "/media/banner-inner.png",
            ],

            [
                "path" => "/NewBranch", "content" => "public/NewBranch",
                "bgImage" => "/media/banner-inner.png",
            ],

            [
                "path" => "/RenewalBranch", "content" => "public/RenewalBranch",
                "bgImage" => "/media/banner-inner.png",
            ],

            [
                "path" => "/Conversion", "content" => "public/Conversion",
                "bgImage" => "/media/banner-inner.png",
            ],

            [
                "path" => "/NewLiaison", "content" => "public/NewLiaison",
                "bgImage" => "/media/banner-inner.png",
            ],

            [
                "path" => "/RenewalLiaison", "content" => "public/RenewalLiaison",
                "bgImage" => "/media/banner-inner.png",
            ],
            ["content" => "HttpError"],
        ],
        
        "company" => [
            [
                "path" => "/", "content" => "company/Home", "exact" => true,
                "bgImage" => "/media/banner-inner.png"
            ],
            [
                "path" => "/notification", "content" => "Notification", 
                "bgImage" => "/media/banner-inner.png",
                "heading" => "Notifications",
                "props" => ["theme" => "public", "watch" => false]
            ],
            [
                "path" => "/branch/apply", "content" => "company/branch/NewApplication",
                "bgImage" => "/media/banner-inner.png",
                "heading" => "Application<br/>for Branch/Liaison Permission",
                "active" => ApplicationStatus::APPROVED,
            ],
            [
                "path" => "/sub-branch/apply", "content" => "company/branch/NewSubBranchApplication",
                "bgImage" => "/media/banner-inner.png",
                "heading" => "Application<br/>for Sub Branch/Liaison Permission",
                "active" => ApplicationStatus::APPROVED,
            ],
            [
                "path" => "/branch/convert", "content" => "company/branch/NewApplication",
                "bgImage" => "/media/banner-inner.png",
                "heading" => "Application<br/>for Branch/Liaison Permission",
                "active" => ApplicationStatus::APPROVED,
                "props" => ["convert" => true]
            ],
            [
                "path" => "/branch/renew", "content" => "company/branch/Renewal",
                "bgImage" => "/media/banner-inner.png",
                "heading" => "Branch/Liaison Office",
                "active" => ApplicationStatus::APPROVED,
            ],
            [
                "path" => "/branch/:id/add-contract", "content" => "company/branch/NewContract",
                "bgImage" => "/media/banner-inner.png",
                "heading" => "Branch/Liaison Office",
                "active" => ApplicationStatus::APPROVED,
            ],
            [
                "path" => "/extend-contract", "content" => "company/branch/NewContract",
                "bgImage" => "/media/banner-inner.png",
                "heading" => "Branch/Liaison Office",
                "active" => ApplicationStatus::APPROVED,
            ],
            [
                "path" => "/branch/fees/:id", "content" => "company/branch/Fees",
                "bgImage" => "/media/banner-inner.png",
                "heading" => "Branch/Liaison Office",
                "active" => ApplicationStatus::APPROVED,
            ],
            [
                "path" => "/branch", "content" => "company/branch/Profile",
                "bgImage" => "/media/banner-inner.png",
                "heading" => "Branch",
                "active" => ApplicationStatus::APPROVED
            ],
            [
                "path" => "/sub-branch", "exact" => true, "content" => "company/branch/SubBranches",
                "bgImage" => "/media/banner-inner.png",
                "heading" => "Sub Branch / Liaison Office",
                "active" => ApplicationStatus::APPROVED
            ],
            [
                "path" => "/sub-branch/:id", "content" => "company/branch/Profile",
                "bgImage" => "/media/banner-inner.png",
                "heading" => "Sub Branch / Liaison Office",
                "active" => ApplicationStatus::APPROVED
            ],
            [
                "path" => "/company-profile", "content" => "company/Profile",
                "bgImage" => "/media/banner-inner.png",
                "heading" => "Profile"
            ],
            [
                "path" => "/security", "content" => "company/PasswordReset",
                "bgImage" => "/media/banner-inner.png",
                "heading" => "Password"
            ],
            [
                "path" => "/login", "content" => "Common:Redirect", "props" => ["to" => "/"]
            ],
            ["content" => "HttpError"],
        ],
        "adminPublic" => [
            [
                "path" => "/", "exact" => true, "content" => "Common:Redirect", "props" => ["to" => "/login"]
            ],
            [
                "path" => "/login", "bgContent" => "public/SignIn",
                "props" => ["heading" => "Welcome to<br/>BLMIS Portal"],
                "content" => "Common:Blank",
                "bgImage" => "/media/bg.jpg",
            ],
            ["content" => "HttpError"],
        ],
        "admin" => [
            [
                "path" => "/", "exact" => true, "content" => "admin/Dashboard", 'id' => 1
            ],
            [
                "path" => "/notification", "content" => "Notification", "props" => ["theme" => "admin", "watch" => false]
            ],
            [
                "path" => "/application/signup/:type", "exact" => true, "content" => "admin/SignUps"
            ],
            [
                "path" => "/application/signup/:type/:id", "content" => "admin/SignUpDetail"
            ],
            [
                "path" => "/application/branch/:type", "exact" => true, "content" => "admin/Branches", "props" => ['serviceType' => 'branch']
            ],
            [
                "path" => "/application/converted-branch/:type", "exact" => true, "content" => "admin/Branches", "props" => ['serviceType' => 'branch', 'converted' => true]
            ],
            [
                "path" => "/application/branch/:id/contracts", "exact" => true, "content" => "admin/ContractRequests", "props" => ['serviceType' => 'branch']
            ],
            [
                "path" => "/application/branch/:type/:id", "content" => "admin/BranchDetail", "props" => ['serviceType' => 'branch']
            ],
            [
                "path" => "/application/converted-branch/:type/:id", "content" => "admin/BranchDetail", "props" => ['serviceType' => 'branch', 'converted' => true]
            ],
            [
                "path" => "/application/liaison/:type", "exact" => true, "content" => "admin/Branches", "props" => ['serviceType' => 'liaison']
            ],
            [
                "path" => "/application/converted-liaison/:type", "exact" => true, "content" => "admin/Branches", "props" => ['serviceType' => 'liaison', 'converted' => true]
            ],
            [
                "path" => "/application/liaison/:id/contracts", "exact" => true, "content" => "admin/ContractRequests", "props" => ['serviceType' => 'liaison']
            ],
            [
                "path" => "/application/liaison/:type/:id", "content" => "admin/BranchDetail", "props" => ['serviceType' => 'liaison']
            ],
            [
                "path" => "/application/converted-liaison/:type/:id", "content" => "admin/BranchDetail", "props" => ['serviceType' => 'liaison', 'converted' => true]
            ],
            [
                "path" => "/application/renewal", "content" => "admin/RenewalRequests"
            ],
            [
                "path" => "/application/contract/:id", "content" => "admin/ContractDetail"
            ],
            [
                "path" => "/application/contract", "content" => "admin/ContractRequests"
            ],
            [
                "path" => "/users", "content" => "admin/Users", "exact" => true
            ],
            [
                "path" => "/users/new", "content" => "admin/Users:UserForm"
            ],
            [
                "path" => "/users/roles", "content" => "admin/Roles", "exact" => true
            ],
            [
                "path" => "/users/roles/new", "content" => "admin/Roles:RoleForm"
            ],
            [
                "path" => "/users/groups", "content" => "admin/UserGroups", "exact" => true
            ],
            [
                "path" => "/users/groups/new", "content" => "admin/UserGroups:GroupForm"
            ],
            [
                "path" => "/login", "content" => "Common:Redirect", "props" => ["to" => "/"]
            ],
            [
                "path" => "/security", "content" => "admin/PasswordReset",
            ],
            

            [
                "path" => "/siteConfig", "content" => "admin/SiteConfig",
            ],

            [
                "path" => "/sliders", "content" => "admin/Slider", "exact" => true
            ],
            [
                "path" => "/sliders/new", "content" => "admin/Slider:SliderForm"
            ],
            
            //Report (code by noman)
            //branch reports
            [
                "path" => "/branchReports/Branchtoptencities", "content" => "admin/BranchTopTenCities", "exact" => true
            ],
            [
                "path" => "/branchReports/Branchtoptencountries", "content" => "admin/BranchTopTenCounteries", "exact" => true
            ],
            [
                "path" => "/branchReports/Branchtoptenprojects", "content" => "admin/BranchTopTenProjects", "exact" => true
            ],
            [
                "path" => "/branchReports/Branchtoptensectors", "content" => "admin/BranchTopTenSectors", "exact" => true
            ],
            [
                "path" => "/branchReports/BranchtoptenNoOfEmp", "content" => "admin/BranchTopTenNoOfEmp", "exact" => true
            ],
            // liaison reports
            [
                "path" => "/liaisonReports/Liaisontoptencities", "content" => "admin/LiaisonTopTenCities", "exact" => true
            ],
            [
                "path" => "/liaisonReports/Liaisontoptencountries", "content" => "admin/LiaisonTopTenCounteries", "exact" => true
            ],
            [
                "path" => "/liaisonReports/Liaisontoptenprojects", "content" => "admin/LiaisonTopTenProjects", "exact" => true
            ],
            [
                "path" => "/liaisonReports/Liaisontoptensectors", "content" => "admin/LiaisonTopTenSectors", "exact" => true
            ],
            [
                "path" => "/liaisonReports/LiaisontoptenNoOfEmp", "content" => "admin/LiaisonTopTenNoOfEmp", "exact" => true
            ],
            [
                "path" => "/DailyCurrencyRate", "content" => "admin/DailyCurrencyRate", "exact" => true
            ],
            [
                "path" => "/PaymentDetail", "content" => "admin/PaymentDetail", "exact" => true
            ],
            
            //Report (code by noman)
            ["content" => "HttpError"],
        ]
    ]
];