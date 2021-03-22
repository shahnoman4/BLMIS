<?php

namespace App\Exports;

use App\Models\BranchTopTenProjects;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class BranchTopTenProjectsExport implements FromCollection, WithHeadings
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return BranchTopTenProjects::all();
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
