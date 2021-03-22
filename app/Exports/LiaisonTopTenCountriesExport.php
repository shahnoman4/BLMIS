<?php

namespace App\Exports;

use App\Models\LiaisonTopTenCountries;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class LiaisonTopTenCountriesExport implements FromCollection, WithHeadings
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return LiaisonTopTenCountries::all();
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
