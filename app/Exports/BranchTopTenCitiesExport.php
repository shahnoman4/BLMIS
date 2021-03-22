<?php

namespace App\Exports;

use App\Models\BranchTopTenCities;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class BranchTopTenCitiesExport implements FromCollection, WithHeadings
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return BranchTopTenCities::all();
    }


    public function headings(): array
    {
        return [
            'City',
            'No of Companies',
            'From Date',
            'To Date',
        ];
    }
}
