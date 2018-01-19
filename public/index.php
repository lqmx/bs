<?php


require_once('../vendor/autoload.php');

use NoahBuscher\Macaw\Macaw;
use App\Route;

$index = new App\Route\Index();

Macaw::dispatch();