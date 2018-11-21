<?php

function write_to_file($json)
{
  $wh = file_put_contents('username.json', $json);
  if ($wh) return 1;
  else return 0;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  if (isset($_POST["username"])){
    $data = $_POST['username'];
    $d = file_get_contents('username.json', true);
    $t = json_decode($d);
    if (empty($t)) $t = array();
      array_push($t, $data);
    $j = json_encode($t);
    $wh = file_put_contents('username.json', $j);

    if ($wh)  echo "Successfully regestired to BIRB";
    else echo "Something went wrong, try again later";
  }
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
   $usernames = file_get_contents('username.json', true);
   $json = json_decode($usernames);
   print json_encode($json);
}
?>
