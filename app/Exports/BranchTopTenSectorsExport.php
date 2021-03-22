<?php

namespace App\Exports;

use App\Models\BranchTopTenSectors;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class BranchTopTenSectorsExport implements FromCollection, WithHeadings
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return BranchTopTenSectors::all();
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
