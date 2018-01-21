<?php

namespace App\Tool;

use Monolog\Logger;
use Monolog\Handler\StreamHandler;

class Log {

    public static $logs;

    const D = Logger::DEBUG;
    const W = Logger::WARNING;
    public static $aLevel = array(
        self::D, self::W,
    );

    public static function addLog($sName = '', $level = self::D) {
        if(isset(self::$logs[$sName])) {
            return self::$logs[$sName];
        }
        if(!in_array($level, self::$aLevel)) {
            $level = self::D;
        }
        $log = new Logger($sName);
        $sPath = "/qmx/github.com/lqmx/bs/log/";
        $log->pushHandler(new StreamHandler($sPath.'bs.log', $level));
        self::$logs[$sName] = $log;
        return self::$logs[$sName];
    }

    public static function getInstance($sName = '') {
        if(isset(self::$logs[$sName])) {
            return self::$logs[$sName];
        }
        return self::addLog($sName);
    }
}