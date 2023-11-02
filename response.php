<?php
//데이터 접속
$dbservername = 'localhost';
$dbusername = 'paranoiaque';
$dbuserpassword = 'rkqls315!';
$dbname = 'paranoiaque';

$conn = mysqli_connect($dbservername,$dbusername,$dbuserpassword,$dbname);
mysqli_set_charset($conn, 'utf8');

if(!$conn){
    die('데이터베이스 접속 실패');
}


//데이터 php 변수에 대입
$id = $_POST['id'];
$pw = $_POST['pw'];
$irum = $_POST['irum'];
$email = $_POST['email'];
$hp = $_POST['hp'];
$address = $_POST['address'];
$gender = $_POST['gender'];
$birthday = $_POST['birthday'];
$addinput = $_POST['addinput'];
$service = $_POST['service'];
$gaib = $_POST['gaib'];

//테이블 생성
// kurly_member

// idx         자동증가번호   
// id          아이디         
// pw          비밀번호
// irum        이름
// email       이메일
// hp          휴대폰
// address     주소
// gender      성별
// birthday    생년월일
// addinput    추가입력
// service     이용약관동의
// gaib        가입일자

//데이터베이스 저장
$sql = "INSERT INTO kurly_member (id, pw, irum, email, hp, address_, gender, birthday, addinput, service_, gaib)
        VALUES ('$id', '$pw', '$irum', '$email', '$hp', '$address', '$gender', '$birthday', '$addinput', '$service', '$gaib')";

$result = mysqli_query($conn, $sql);

//데이터 닫기
mysqli_close($conn);

?>