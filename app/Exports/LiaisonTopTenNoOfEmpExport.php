<?php

namespace App\Exports;

use App\Models\LiaisonTopTenNoOfEmp;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class LiaisonTopTenNoOfEmpExport implements FromCollection, WithHeadings
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return LiaisonTopTenNoOfEmp::all();
    }

    public function headings(): array
    {
        return [
            'Company Name',
            'Total Employee',
            'Created At',
        ];
    }
}
