<?php
    $dday = (int)((mktime(0, 0, 0, 4, 20, 2014) - time()) / 60 / 60 / 24) + 1;
    $type = $_GET['type'];
    if($type == 'xml') {
        $xml = '<?xml version="1.0" encoding="utf-8" ?>';
        $xml .= "<dday>{$dday}</dday>";
        header('Content-type', 'application/xml; charset=utf-8');
        echo $xml;
    }else if($type == 'json') {
        $json = '{ "dday" : '.$dday.' }';
        header('Content-type', 'application/json; charset=utf-8');
        echo $json;
    }else {
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <title>D-Day</title>
    </head>
    <body>
        D-<?=$dday?>

    </body>
</html>
<?php
    }
?>
