<?php

namespace App\Exports;

use App\Models\LiaisonTopTenProjects;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class LiaisonTopTenProjectsExport implements FromCollection, WithHeadings
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return LiaisonTopTenProjects::all();
    }

    public function headings(): array
    {
        return [
            'Project',
            'Annual Expenses',
            'Created At',
        ];
    }
}
