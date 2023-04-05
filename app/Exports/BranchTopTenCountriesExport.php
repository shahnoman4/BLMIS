<?php

namespace App\Exports;

use App\Models\BranchTopTenCountries;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class BranchTopTenCountriesExport implements FromCollection, WithHeadings
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return BranchTopTenCountries::all();
    }

    public function headings(): array
    {
        return [
            'Country Name',
            'No of Companies',
            'From Date',
            'To Date',
        ];
    }
}
