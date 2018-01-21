<?php

namespace App\Controllers\Book;

use App\Model;

class Book {

    public $mBook;

    public function __construct() {
        $this->mBook = new Model\Book();
    }

    public function getBooks() {
        $iBookNo = (string)$_POST['bookNo'];
        $aBooks = $this->mBook->getBooks($iBookNo);
        echo json_encode($aBooks);
    }

    public function detail() {
        require dirname(__FILE__).'/../../../view/book_detail.html';
    }
}