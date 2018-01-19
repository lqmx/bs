<?php

namespace App\Route;
use NoahBuscher\Macaw\Macaw;

class Index {

    public function __construct() {
        $this->exec();
    }

    public function exec() {
        Macaw::get('/', 'App\Controllers\Index\Index@index');
    }
}


