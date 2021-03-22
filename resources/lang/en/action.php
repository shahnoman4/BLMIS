<?php

use \App\Lookups\ApplicationStatus;

return [
    'signup' => [
        ApplicationStatus::NEW => 'Application submitted for signup',
        ApplicationStatus::SUBMITTED => '',
        ApplicationStatus::APPROVED => 'Application approved for signup.',
        ApplicationStatus::REJECTED => 'Application rejected for signup.',
        ApplicationStatus::COMMENTED => 'Application added comments on signup application.',
        // ApplicationStatus::UPDATED => 'Updated application for signup.',
        ApplicationStatus::UPDATED => [
            'all' => 'Updated application for signup.',
            'company' => 'Updated application for signup (Foreign Company Details).',
            'contact' => 'Updated application for signup (Foreign Company Contact Person).',
            'po' => 'Updated application for signup (Principal Officer Information).',
            'directors' => 'Updated application for signup (Director(s) Information).',
        ],
    ],
    'branch' => [
        ApplicationStatus::NEW => 'Application submitted for branch/liaison office permission.',
        ApplicationStatus::RENEWED => 'Application submitted for renewal of branch/liaison office permission.',
        ApplicationStatus::SUBMITTED => 'Application submitted for review.',
        ApplicationStatus::APPROVED => 'Application approved for branch/liaison office permission.',
        ApplicationStatus::REJECTED => 'Application rejected for branch/liaison office permission.',
        ApplicationStatus::COMMENTED => 'Application added comments on branch/liaison application',
        ApplicationStatus::CIRCULATED => 'Application circulated for branch/liaison office permission.',
        ApplicationStatus::REVERTED => 'Application reverted for branch/liaison office permission.',
        ApplicationStatus::HELD => 'Application held for branch/liaison office permission.',
        // ApplicationStatus::UPDATED => 'Updated application for branch office permission.',
        ApplicationStatus::UPDATED => [
            'all' => 'Updated application for branch/liaison office permission.',
            'branch' => 'Updated application for branch/liaison office permission (Business Information).',
            'localSponsor' => 'Updated application for branch/liaison office permission (Company\'s Local Sponsor).',
            'company' => 'Updated application for branch/liaison office permission (Contractee Information).',
            'agent' => 'Updated application for branch/liaison office permission (Agent Information).',
            'contract' => 'Updated application for branch office permission (Contract Information).',
            'partner_companies' => 'Updated application for branch office permission (Local Company/ Partner Details).',
            'investment' => 'Updated application for branch/liaison office permission (Investment Information).',
            'security_agency' => 'Updated application for branch/liaison office permission (Security Information).',
        ],

    ],
    'contract' => [
        ApplicationStatus::NEW => 'Application submitted for add contract permission.',
        ApplicationStatus::SHARED => 'Sent copy for information.',
        ApplicationStatus::APPROVED => 'Application approved for contract permission.',
        ApplicationStatus::REJECTED => 'Application rejected for contract permission.',
        ApplicationStatus::COMMENTED => 'Application added comments on contract permission',
        ApplicationStatus::UPDATED => 'Updated application for contract permission.',

    ]
];