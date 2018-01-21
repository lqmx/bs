<?php


require_once('../vendor/autoload.php');

use NoahBuscher\Macaw\Macaw;
use App\Route;

$rIndex = new App\Route\Index();
$rBook = new App\Route\Book();

Macaw::dispatch();