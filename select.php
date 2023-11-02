<?
include_once('./header.php');

//테스트 점검
//http://paranoiaque.dothome.co.kr/axios_kurly/select.php

$sql = "SELECT * from kurly_member";
$result = mysqli_query($conn, $sql);

//확인 테스트: 개수
//echo '레코드(행==줄==튜플) 개수'.mysqli_num_rows($result);

//데이터베이스 데이터를 리액트가 사용할 수 있도록 객체(배열객체)로 저장하고
$arr = array(); //배열선언

//배열객체에데이터속성넣기함수(배열객체, array());

if(mysqli_num_rows($result) > 0){
    //반복처리해서 객체를 생성한다
    //1행씩 $row에 가져와서 반복처리
    while($row = mysqli_fetch_array($result)){
        array_push($arr, array(
            '번호' => $row['idx'],
            '아이디' => $row['id'],
            '비밀번호' => $row['pw'],
            '이름' => $row['irum'],
            '이메일' => $row['email'],
            '휴대폰' => $row['hp'],
            '주소' => $row['address_'],
            '성별' => $row['gender'],
            '생년월일' => $row['birthday'],
            '추가입력사항' => $row['addinput'],
            '이용약관동의' => $row['service_'],
            '가입일자' => $row['gaib']
        ));        
    }
}

//idx, id, pw, irum, email, hp, address_, gender, birthday, addinput, service_, gaib

//JSON 데이터로 변환하여 내보내기한다
$jsonData = json_encode($arr, JSON_UNESCAPED_UNICODE);
echo $jsonData;

include_once('./footer.php');
?>