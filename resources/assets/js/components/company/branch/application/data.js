export const newApplicationModel = {
    Branch: {
        service_type_id: '1',
        original_country: 'PAK',
        primary_info: 'This is primary info',
        other_org_info: 'This is other org info',
        other_country_info: 'This is other country info',
        current_country: 'PAK',
        current_city: 'Karachi',
        desired_location: 'JM',
        desired_places: 'R1,R2,R3',
        business_info: 'This is business info',
        project_info: 'This is project info',
        personnel_info: 'This is personnel info',
        repatriation_info: 'This is repatriation info',
        local_associate_info: 'This is local associated company info',
        start_month: '1',
        start_year: '2017',
        permission_period: '2',
        background_info: 'This is background info',
        purpose_info: 'This is purpose info',
    },
    LocalContact: {
        Location: {
            address_line1: "JM"
        },
        office_phone: '123222123222',
        mobile_phone: '123222123222',
        office_fax: '123222123222',
        office_email: 'local@contact.com',
        full_name: 'local full name',
        primary_phone: '123222123222',
    },
    LocalSponsor: {
        Location: {
            address_line1: 'JM',
            city: 'Karachi',
        },
        office_phone: '123222123222',
        mobile_phone: '123222123222',
        office_fax: '123222123222',
        office_email: 'ofc@local.com',
    },
    Company: {
        registration_letter: {path: "tmp/CyKweU1xohikO6H1MmNuHigDJrBAcVUIsKwnlETI.pdf", filename: "Devops Manager.pdf"},
        memorandum_article: {path: "tmp/CyKweU1xohikO6H1MmNuHigDJrBAcVUIsKwnlETI.pdf", filename: "Devops Manager.pdf"},
        authority_letter: {path: "tmp/CyKweU1xohikO6H1MmNuHigDJrBAcVUIsKwnlETI.pdf", filename: "Devops Manager.pdf"},
        org_profile: {path: "tmp/CyKweU1xohikO6H1MmNuHigDJrBAcVUIsKwnlETI.pdf", filename: "Devops Manager.pdf"},
    },
    Agent: {
        full_name: 'name is agent',
        contact_category_id: '1',
        mobile_phone: '123222123222',
        primary_email: 'agent@br.com',
        Location: {
            address_line1: 'JM',
            city: 'Karachi',
            country: 'PAK',
        },
    },
    Contract: {
        title: 'this is contract',
        agreement_letter: {path: "tmp/CyKweU1xohikO6H1MmNuHigDJrBAcVUIsKwnlETI.pdf", filename: "Devops Manager.pdf"},
        start_date: '2019-06-02',
        start_page: '1',
        start_clause: 'C1',
        valid_for_years: '3',
        end_page: '2',
        end_clause: 'C35',
        defect_start_month: '1',
        defect_start_year: '2020',
        defect_end_month: '1',
        defect_end_year: '2022',
        project_cost: '20',
    },
    PartnerCompanies: [
        {
            full_name: 'CA',
            lease_agreement: {path: "tmp/CyKweU1xohikO6H1MmNuHigDJrBAcVUIsKwnlETI.pdf", filename: "Devops Manager.pdf"},
            office_phone: '123222123222',
            office_fax: '123222123222',
            office_email: 'c1@prt.com',
            secp_certificate: {path: "tmp/CyKweU1xohikO6H1MmNuHigDJrBAcVUIsKwnlETI.pdf", filename: "Devops Manager.pdf"},
            Location: {
                address_line1: 'JM',
                city: 'Karachi',
                country: 'PAK',
                zip: '2345000',
            },
            Contact: {
                full_name: 'CA full name',
                primary_email: 'c1@prt.cn.com',
                primary_phone: '123222123222',
                nic_no: '3454-354343345-4',
                nic_copy: {path: "tmp/CyKweU1xohikO6H1MmNuHigDJrBAcVUIsKwnlETI.pdf", filename: "Devops Manager.pdf"},
            }
        }
    ],
    Investment: {
        proposal_info: 'This is proposal info',
        annual_expenses: '32',
        expenses_copy: {path: "tmp/CyKweU1xohikO6H1MmNuHigDJrBAcVUIsKwnlETI.pdf", filename: "Devops Manager.pdf"},
        investment_info: 'This is investment info',
        pk_bank: 'SCB Ltd',
        designated_person: 'MZ',
        comments: 'Nothing',
    },
    SecurityAgency: {
        security_required: '1',
        name: 'Muhafiz',
        ntn: '43432',
        secp_certificate: {path: "tmp/CyKweU1xohikO6H1MmNuHigDJrBAcVUIsKwnlETI.pdf", filename: "Devops Manager.pdf"},
        is_pk_based: '1',
        has_foreign_consultant: '1',
        is_extension: '1',
        extension_info: 'This is extension info',
        Contact: {
            office_phone: '123222123222',
            office_fax: '123222123222',
            office_email: 'security@br.com',
            Location: {
                address_line1: 'JM',
                city: 'Karachi',
                country: 'PAK',
                zip: '34534',
            },
        }
    }
};