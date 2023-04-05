<?php

namespace App\Exports;

use App\Models\BranchTopTenNoOfEmp;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class BranchTopTenNoOfEmpExport implements FromCollection, WithHeadings
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return BranchTopTenNoOfEmp::all();
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
