<?php
    $n = (int)$_GET["n"];
    if($n <= 0) $n = 1;

    $l = (int)$_GET["l"];
    if($l <= 0) $l = 1;
?><!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <title>Is MOFUN busy?</title>
    <script type="text/javascript" src="https://www.google.com/jsapi"></script>
    <script src="http://code.jquery.com/jquery-1.9.1.min.js"></script>
    <script type="text/javascript" src="mofun.js" charset="utf-8"></script>
    <script type="text/javascript">
        google.load("visualization", "1", {packages:["corechart"]});
        google.setOnLoadCallback(function() { init(<?=$n?>); });
    </script>
    <link rel="stylesheet" type="text/css" href="style.css" />
</head>
<body>
    <div id="chart" style="height: <?=($l * 100 - 5)?>%;"></div>
</body>
</html>
