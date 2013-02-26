<?
    $domain = "http://www14.atwiki.jp";
    $uri = $_SERVER['REQUEST_URI'];
    $uri_start = "/jubeat_memo/m";
    if(strncmp($uri, $uri_start, strlen($uri_start))) {
        if($uri == '/') header("Location: $uri_start");
        else die("error");
    }
    $contents = file_get_contents($domain.$uri);
    $contents = str_replace($domain, "", $contents);
    $contents = str_replace("\x81\xA0", "\x81\x5A", $contents);
    echo $contents;
?>
