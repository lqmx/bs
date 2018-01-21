<?php

namespace App\Model;

use App\Tool\Log;

class Book {

    public $aBooks;

    public function __construct() {

        $aTmp = array(
            array(
                'name' => '光纤光栅传感应用原理',
                'page' => 120,
            ),
            array(
                'name' => '模糊控制理论与应用',
                'page' => 400,
            ),
            array(
                'name' => '代码大全',
                'page' => 900,
            ),
            array(
                'name' => '信息系统管理',
                'page' => 300,
            ),
            array(
                'name' => '算法',
                'page' => 1000,
            ),
        );
        $aType = array('A', 'B', 'C', 'D');
        for($i = 0; $i < 15; $i ++) {
            foreach($aTmp as $v) {
                $sNo = ''.$aType[rand(0, 3)].'1'.rand(10, 99);
                $this->aBooks[$sNo] = array(
                    'no' => $sNo,
                    'name' => $v['name'],
                    'page' => $v['page'],
                );
            }
        }
    }

    public function getBooks($iBookNo) {
        if($iBookNo === '') {
            return array_values($this->aBooks);
        }
        return isset($this->aBooks[$iBookNo])?$this->aBooks[$iBookNo]: array();
    }
}