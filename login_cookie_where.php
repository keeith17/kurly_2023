<?
include_once('./header.php');

//화면에서 보낸 아이디 비밀번호
$userId = $_POST['userId'];
$userPw = $_POST['userPw'];

//데이터베이스 데이터 모두 가져오기

//한사람의 아이디 비밀번호 가져오기
$sql = "SELECT * FROM kurly_member WHERE id='$userId' AND pw='$userPw'";
$result = mysqli_query($conn, $sql);

//1개 이상의 데이터를
//반복처리 행단위 데이터 뽑아서 변수 $row에 저장
//화면 입력된 아이디, 비밀번호를 데이터베이스 모든 데이터와 반복 비교처리
//찾았을 경우 쿠키설정(로그인 가능한 상태)
if( mysqli_num_rows($result) > 0){
    $row = mysqli_fetch_array($result);

    $expires = time()+(60*60*24*3);
    setcookie('userId', $row['id'], $expires, '/');
    
    $json_data = '{"세션":"'.$expires.'", "아이디":"'.$row['id'].'", "이름":"'.$row['irum'].'"}';    
}


//응답 AXIOS에
echo $json_data;

include_once('./footer.php');
?>