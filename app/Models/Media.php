<?php

namespace App\Models;
use Illuminate\Support\Facades\Storage;
use Illuminate\Filesystem\Filesystem;

class Media extends Model{
    use \App\Traits\UsesUuid;

    protected $table = 'media';
    private $adapter;
    protected $hidden = [
        'pivot', 'trashed_at', 
    ];
    
    const CREATED_AT = 'uploaded_at';
    const UPDATED_AT = null;

    public function __construct(array $attributes = []){
        parent::__construct($attributes);
        $this->adapter = new Filesystem;
    }

    public function fillFromPath($_path, $filename = "", $type = null){
        $adapter = $this->adapter;
        $path = Storage::path($_path);
        $this->mime_type = $adapter->mimeType($path);
        $this->extension = $adapter->extension($path);
        $this->media_type = $type;
        $this->filename = $filename;
        $this->path = $_path;
        $this->url = Storage::url($_path);
        return $this;
    }

}