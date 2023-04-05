<?php

namespace App\Exports;

use App\Models\LiaisonTopTenCities;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class LiaisonTopTenCitiesExport implements FromCollection, WithHeadings
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return LiaisonTopTenCities::all();
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
