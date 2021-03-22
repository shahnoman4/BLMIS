<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;

class MediaController extends Controller
{

    public function uploadTempFile(Request $request){
        $request->validate([
            'temp' => 'bail|required|file|max:10000|mimes:pdf', //,doc,docx,xls,xlsx,png,jpg,jpeg',
        ]);
        $path = $request->file('temp')->store("tmp");
        return ["path" => $path, "filename" => $request->file('temp')->getClientOriginalName()];
    }

    public function uploadTempImage(Request $request){
        $request->validate([
            'temp' => 'bail|required|file|max:20000|mimes:png,jpg,jpeg', //,doc,docx,xls,xlsx,png,jpg,jpeg',
        ]);
        $path = $request->file('temp')->store("tmp");
        return ["path" => $path, "filename" => $request->file('temp')->getClientOriginalName()];
    }
}