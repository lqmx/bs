<?php

namespace App\Route;
use NoahBuscher\Macaw\Macaw;

class Book {

    public function __construct() {
        $this->exec();
    }

    public function exec() {
        Macaw::post('/book/getbooks', 'App\Controllers\Book\Book@getBooks');
        Macaw::get('/book/detail', 'App\Controllers\Book\Book@detail');
    }
}