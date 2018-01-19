<?php

namespace App\Controllers\Index;

use Conf;

class Index {

    public function index() {
        require dirname(__FILE__).'/../../../view/index.html';
    }
}