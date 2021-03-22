<?php

namespace App\Exports;

use App\Models\LiaisonTopTenSectors;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class LiaisonTopTenSectorsExport implements FromCollection, WithHeadings
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return LiaisonTopTenSectors::all();
    }

    public function headings(): array
    {
        return [
            'Sector',
            'Total',
            'From Date',
            'To Date',
        ];
    }
}
