const WrapComponent = () => {
    //모달 상태관리
    const [modal, setModal] = React.useState({
        isShow: false,
        title: "모달 테스트 타이틀",
    });

    //로그인 회원가입 상태관리
    const [login, setLogin] = React.useState(false);
    const [member, setMember] = React.useState(true);

    const LoginState = () => {
        setLogin(true);
        setMember(false);
    };
    const MemberState = () => {
        setLogin(false);
        setMember(true);
    };

    const modalCloseFn = () => {
        setModal({ ...modal, isShow: false });
    };
    const modalOpenFn = (tit) => {
        setModal({ ...modal, isShow: true, title: tit });
    };
    return (
        <div id="wrap">
            <HeaderComponent
                LoginState={LoginState}
                MemberState={MemberState}
            />
            {login && <LoginComponent MemberState={MemberState} />}
            {member && (
                <MainComponent modal={modal} modalOpenFn={modalOpenFn} />
            )}
            <FooterComponent />
            <ModalComponent modal={modal} modalCloseFn={modalCloseFn} />
        </div>
    );
};

const HeaderComponent = ({ LoginState, MemberState }) => {
    //로그인 상태관리
    const [isLogin, setIsLogin] = React.useState(false);
    const [userName, setUserName] = React.useState("");

    //팝업창 상태관리 멤버변수
    const [popup, setPopup] = React.useState(false);

    //로그인이벤트
    const loginEvent = () => {
        //로컬스토리지 key : userId
        //userId "아이디" : "moonjong", "이름" : "이순신"
        if (localStorage.length <= 0) return;
        const localData = JSON.parse(localStorage.getItem("userId"));

        //쿠키이름:userId
        let result = getCookie("PHPSESSID");
        if (result === undefined || localData === null) return;
        if (result === localData.세션) {
            setIsLogin(true);
            setUserName(localData.이름);
        }
    };
    React.useEffect(() => {
        loginEvent();
    }, []);

    //로그아웃이벤트
    const onClickLogout = (e) => {
        e.preventDefault();
        let value = getCookie("PHPSESSID");
        let newDate = new Date();

        newDate.setDate(newDate.getDate() - 1);
        document.cookie = `${"PHPSESSID"}=${value}; path=/; expires=${newDate.toUTCString()};`;
        localStorage.removeItem("userId");
        setIsLogin(false);
        setUserName("");
    };

    //회원가입버튼 클릭이벤트
    const onClickMember = (e) => {
        e.preventDefault();
        MemberState();
    };

    //로그인버튼 클릭이벤트
    const onClickLogin = (e) => {
        e.preventDefault();
        LoginState();
    };

    const getCookie = (name) => {
        let temp = [];
        let obj = [];
        let found = "";

        if (document.cookie === "") {
            return;
        }
        temp = document.cookie.split(";");
        temp.map((item, idx) => {
            obj[idx] = {
                name: item.split("=")[0].trim(),
                value: item.split("=")[1].trim(),
            };
        });

        //쿠키 이름을 비교 판단
        obj.map((item) => {
            if (item.name === name) {
                found = item.value;
            }
        });

        return found;
    };

    const onClickPopupClose = (e) => {
        e.preventDefault();
        //팝업창 닫고
        setPopup(false);

        //쿠키 설정 (셋 쿠키)
        function setCookie(name, value, expires) {
            let newDate = new Date();
            newDate.setDate(newDate.getDate() + expires); //1일 더한다 날짜 연산
            document.cookie = `${name}=${value}; path=/; expires=${newDate.toUTCString()};`;
        }
        setCookie("popup20220809_event", "no", 1);
    };

    //팝업창 띄우기 함수
    const popupOpen = () => {
        const result = getCookie("popup20220809_event");
        if (result !== "no") {
            setPopup(true);
        }
    };

    React.useEffect(() => {
        popupOpen();
    }, []);

    return (
        <header id="header">
            <div className="container">
                <div className="wrap">
                    {popup && (
                        <div className="popup">
                            <div className="popup-container">
                                <a href="#!">
                                    <span>
                                        지금 가입하고 인기상품 100원에
                                        받아가세요!
                                        <i>
                                            <img
                                                src="./images/ico_arrow_fff_84x84.webp"
                                                alt="arrow"
                                            />
                                        </i>
                                    </span>
                                </a>
                                <span>
                                    <button
                                        onClick={onClickPopupClose}
                                        className="popup-close-btn"
                                        title="닫기"
                                    >
                                        <img
                                            src="./images/ico_close_fff_42x42.png"
                                            alt="close"
                                        />
                                    </button>
                                </span>
                            </div>
                        </div>
                    )}
                    <aside id="aside">
                        <ul>
                            <li>
                                {isLogin === false ? (
                                    <a href="#" onClick={onClickMember}>
                                        회원가입
                                    </a>
                                ) : (
                                    <a href="#">웰컴</a>
                                )}
                            </li>
                            <li>
                                <span>|</span>
                            </li>
                            <li>
                                {isLogin === false ? (
                                    <a href="#" onClick={onClickLogin}>
                                        로그인
                                    </a>
                                ) : (
                                    <a href="#">{userName}님!</a>
                                )}
                            </li>
                            <li>
                                <span>|</span>
                            </li>
                            <li>
                                {isLogin === false ? (
                                    <a href="#">고객센터</a>
                                ) : (
                                    <a href="#" onClick={onClickLogout}>
                                        로그아웃
                                    </a>
                                )}
                            </li>
                        </ul>
                    </aside>
                    <h1>
                        <a href="#!" className="logo" title="logo">
                            <img src="./images/logo_x2.png" alt="logo" />
                        </a>
                    </h1>
                </div>
            </div>
        </header>
    );
};

const LoginComponent = ({ MemberState }) => {
    const [userId, setUserId] = React.useState("");
    const [userPw, setUserPw] = React.useState("");

    const onChangeId = (e) => {
        setUserId(e.target.value);
    };
    const onChangePw = (e) => {
        setUserPw(e.target.value);
    };

    //로그인 구현 클릭 이벤트
    //입력폼 아이디, 비밀번호를
    //AXIOS를 이용해 서버(login.php)에 전송
    //전송된 아이디 비밀번호를 데이터베이스 데이터와 비교
    //찾으면 로그인 메시지에 응답하고 로그인 이후 내용을 나타낸다

    const axiosEvent = () => {
        let formData = new FormData();
        formData.append("userId", userId);
        formData.append("userPw", userPw);

        axios({
            url: "./login_session_cookie_where.php",
            method: "POST",
            data: formData,
        })
            .then((res) => {
                console.log(res.data);
                localStorage.setItem(
                    "userId",
                    `{"세션": "${res.data.세션}", "아이디": "${res.data.아이디}", "이름": "${res.data.이름}"}`
                );
                location.href = "./";
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const onClickLoginEvent = (e) => {
        e.preventDefault();
        axiosEvent();
    };

    //회원가입 창으로 이동 이벤트
    const onClickGaibEvent = () => {
        MemberState();
    };
    return (
        <div id="login">
            <div className="container">
                <div className="title">
                    <h1>로그인</h1>
                </div>
                <div className="content">
                    <form
                        name="login_form"
                        id="loginForm"
                        method="post"
                        autoComplete="off"
                    >
                        <ul>
                            <li>
                                <input
                                    type="text"
                                    name="id"
                                    id="id"
                                    onChange={onChangeId}
                                    value={userId}
                                    placeholder="아이디를 입력해 주세요"
                                />
                            </li>
                            <li>
                                <input
                                    type="password"
                                    name="pw"
                                    id="pw"
                                    onChange={onChangePw}
                                    value={userPw}
                                    placeholder="비밀번호를 입력해 주세요"
                                />
                            </li>
                            <li>
                                <div className="search">
                                    <span>
                                        <a href="#">아이디 찾기</a>
                                    </span>
                                    <span>
                                        <i>|</i>
                                    </span>
                                    <span>
                                        <a href="#">비밀번호 찾기</a>
                                    </span>
                                </div>
                            </li>
                            <li>
                                <button
                                    onClick={onClickLoginEvent}
                                    class="login-btn"
                                    type="button"
                                >
                                    로그인
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={onClickGaibEvent}
                                    class="gaib-btn"
                                    type="button"
                                >
                                    회원가입
                                </button>
                            </li>
                        </ul>
                    </form>
                </div>
            </div>
        </div>
    );
};

const MainComponent = ({ modalOpenFn }) => {
    return (
        <main id="main">
            <MemberComponent modalOpenFn={modalOpenFn} />
        </main>
    );
};

const MemberComponent = ({ modalOpenFn, 이용약관 }) => {
    const stylePost = {
        position: "fixed",
        top: "50%",
        left: "50%",
        width: "420px",
        height: "500px",
        background: "#fff",
        zIndex: "2",
        border: "1px solid #ccc",
        marginTop: "-250px",
        marginLeft: "-210px",
    };

    const [field, setField] = React.useState({
        아이디: "",
        아이디중복확인Ok: "",
        isShowId: false,
        isClassId: "",

        비밀번호: "",
        isShowPw: false,
        isClassPw1: "",
        isClassPw2: "",
        isClassPw3: "",

        비밀번호확인: "",
        isShowPwRe: false,
        isClassPwRe: "",

        이름: "",

        이메일: "",
        이메일확인: "",
        이메일중복확인Ok: false,

        휴대폰: "",
        휴대폰확인: "",
        인증번호: "",
        인증확인번호: "",
        휴대폰인증확인Ok: false,
        setId: "",
        isDisabledHp: true,
        isShowHp: false,
        minutes: 2,
        seconds: 59,
        isDisabledHpInput: false,
        isDisabledHpBtn: false,
        isShowHpSpan: true,

        isShowAddress: false, //주소입력상자
        isShowAddress2: false, //주소검색 API
        주소1: "",
        주소2: "",

        성별: "선택안함",

        생년: "",
        생월: "",
        생일: "",
        isShowBirthText: "",
        isShowBirthError: false,

        isShowAddInput: false,
        추가입력사항: "",
        추가입력사항선택: "",

        이용약관동의: [],
    });

    const [checkMember, setCheckMember] = React.useState({ 가입회원: [] });

    //아이디시작
    const onChangeId = (e) => {
        const regExp = /^(?=.*[A-Za-z])+(?=.*[0-9])*[^\s][A-Z0-9]{5,}$/gi;
        let isClassId = "";
        if (regExp.test(e.target.value)) {
            isClassId = true;
        } else {
            isClassId = false;
        }
        setField({ ...field, 아이디: e.target.value, isClassId: isClassId });
    };
    const onFocusId = () => {
        setField({ ...field, isShowId: true });
    };

    const onClickIdModal = (e) => {
        e.preventDefault();
        axiosGet();
        if (field.아이디 === "") {
            modalOpenFn("아이디를 입력해 주세요");
            return;
        } else {
            if (field.isClassId === false) {
                modalOpenFn("아이디 양식을 확인해 주세요");
            } else {
                let imsi = [];
                imsi = checkMember.가입회원;
                // for(let i=0; i<localStorage.length; i++){
                //     imsi.push( JSON.parse(localStorage.getItem(localStorage.key(i))) );
                // }

                let result = "";
                result = imsi.map((item) => item.아이디 === field.아이디);
                if (result.includes(true)) {
                    modalOpenFn("중복된 아이디입니다");
                } else if (result.includes(false)) {
                    setField({ ...field, 아이디중복확인Ok: true });
                    modalOpenFn("사용가능한 아이디입니다");
                }
            }
        }
    };
    //아이디끝

    //비밀번호
    const onChangePw = (e) => {
        const regExp1 = /.{10,}/;
        const regExp2 =
            /((?=.*[A-Za-z])+((?=.*[0-9])+|(?=.*[!@#$%&*_-])+)+)[^\s][A-Za-z0-9!@#$%^&_-]{9,}/;
        const regExp3 = /(.)\1\1/; //긍정문이라 true가 error인 것

        let imsi1 = "";
        let imsi2 = "";
        let imsi3 = "";

        if (regExp1.test(e.target.value)) {
            imsi1 = true;
        } else {
            imsi1 = false;
        }

        if (regExp2.test(e.target.value)) {
            imsi2 = true;
        } else {
            imsi2 = false;
        }

        if (regExp3.test(e.target.value)) {
            imsi3 = false;
        } else {
            imsi3 = true;
        }

        setField({
            ...field,
            비밀번호: e.target.value,
            isClassPw1: imsi1,
            isClassPw2: imsi2,
            isClassPw3: imsi3,
        });
    };

    const onFocusPw = (e) => {
        setField({ ...field, isShowPw: true });
    };

    //비밀번호끝

    //비밀번호확인
    const onChangePwRe = (e) => {
        let imsi = "";
        if (field.비밀번호 === e.target.value) {
            imsi = true;
        } else {
            imsi = false;
        }
        setField({ ...field, 비밀번호확인: e.target.value, isClassPwRe: imsi });
    };

    const onFocusPwRe = (e) => {
        setField({ ...field, isShowPwRe: true });
    };
    //비밀번호확인끝

    //이름
    const onChangeName = (e) => {
        const regExp = /[^A-Za-z가-힣ㄱ-ㅎㅏ-ㅣ\s]/g;
        let imsi = "";

        imsi = e.target.value.toString().replace(regExp, "");
        setField({ ...field, 이름: imsi });
    };
    //이름끝

    //이메일
    const onChangEmail = (e) => {
        const regExp =
            /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*.[A-Za-z]{2,3}$/;
        let imsi = "";
        if (regExp.test(e.target.value)) {
            imsi = true;
        } else {
            imsi = false;
        }
        setField({ ...field, 이메일: e.target.value, 이메일확인: imsi });
    };
    const onClickEmailModal = (e) => {
        e.preventDefault();
        axiosGet();
        if (field.이메일 === "") {
            modalOpenFn("이메일을 입력해 주세요");
        } else {
            if (field.이메일확인 === false) {
                modalOpenFn("잘못된 이메일 형식입니다");
            } else {
                modalOpenFn("중복 검사만 하세요");
                let imsi = [];
                imsi = checkMember.가입회원;
                // for(let i=0; i<localStorage.length; i++){
                //     imsi.push( JSON.parse(localStorage.getItem(localStorage.key(i))) );
                // }

                let result = imsi.map((item) => item.이메일 === field.이메일);

                if (result.includes(true)) {
                    modalOpenFn("중복된 이메일입니다");
                } else {
                    setField({ ...field, 이메일중복확인Ok: true });
                    modalOpenFn("사용가능한 이메일입니다");
                }
            }
        }
    };

    //이메일끝

    //휴대폰
    const onChangeHp = (e) => {
        const regExp = /^01[0|6|7|8|9]+\d{3,4}\d{4}$/;
        let imsi = "";
        if (regExp.test(e.target.value)) {
            imsi = true;
        } else {
            imsi = false;
        }
        setField({
            ...field,
            휴대폰: e.target.value,
            휴대폰확인: imsi,
            isDisabledHp: !imsi,
        });
    };

    //휴대폰 인증 버튼 클릭 이벤트
    const onClickHp = (e) => {
        e.preventDefault();
        let num = Math.floor(Math.random() * 900000 + 100000);
        setField({ ...field, isShowHp: true, 인증번호: num.toString() });
        modalOpenFn(`인증번호 ${num}을 전송했습니다`);
    };

    const onMouseDownHp = (e) => {
        clearInterval(field.setId);
        setField({ ...field, isShowHp: false });
    };

    //인증번호 전송 입력 대기상태의 카운트타이머
    const countTimer = () => {
        //분, 초
        let minutes = 2;
        let seconds = 59;
        let setId = 0;

        //타이머설정 setInterval();
        const setTimer = () => {
            seconds--;
            if (seconds < 0) {
                minutes--;
                seconds = 59;
                if (minutes <= 0) {
                    clearInterval(setId);
                    seconds = 0;
                    minutes = 0;
                }
            }

            setField({
                ...field,
                minutes: minutes,
                seconds: seconds,
                setId: setId,
            });
        };
        setId = setInterval(setTimer, 1000);
    };

    //훅 useEffect
    React.useEffect(() => {
        field.isShowHp && countTimer();
    }, [field.isShowHp]);

    //인증번호확인 입력상자
    const onChangeHpNum = (e) => {
        clearInterval(field.setId);
        setField({ ...field, 인증확인번호: e.target.value });
    };

    //인증번호확인 버튼 클릭 이벤트
    const onClickConfirm = (e) => {
        e.preventDefault();
        if (field.인증번호 === field.인증확인번호) {
            modalOpenFn("인증이 확인되었습니다");
            setField({
                ...field,
                isDisabledHpInput: true,
                isDisabledHpBtn: true,
                isShowHpSpan: false,
                인증확인번호: " ",
                휴대폰인증확인Ok: true,
            });
        } else {
            modalOpenFn("인증 실패");
        }
    };

    //휴대폰끝

    //주소
    const onCompletePost = (data) => {
        setField({ ...field, isShowAddress: true, 주소1: data.address });
    };

    const onClickAddress = (e) => {
        e.preventDefault();
        post.open();
    };
    let post = new daum.Postcode({
        oncomplete: function (data) {
            onCompletePost(data);
        },
    });

    const onChangeAddress1 = (e) => {
        setField({ ...field, 주소1: e.target.value });
    };
    const onChangeAddress2 = (e) => {
        setField({ ...field, 주소2: e.target.value });
    };
    //주소끝

    //성별시작
    const onChangeGender = (e) => {
        setField({ ...field, 성별: e.target.value });
    };
    //성별끝

    //생년월일
    const onChangeYear = (e) => {
        const regExp = /[^0-9]/g;
        let imsi = e.target.value.trim().replace(regExp, "");
        setField({ ...field, 생년: imsi });
    };
    const onChangeMonth = (e) => {
        const regExp = /[^0-9]/g;
        let imsi = e.target.value.trim().replace(regExp, "");
        setField({ ...field, 생월: imsi });
    };
    const onChangeDate = (e) => {
        const regExp = /[^0-9]/g;
        let imsi = e.target.value.trim().replace(regExp, "");
        setField({ ...field, 생일: imsi });
    };

    //년도, 월, 일 규칙 패턴
    const birthDayCheck = () => {
        const { 생년, 생월, 생일 } = field;

        const regExpYear = /^(?:19[0-9][0-9]|2[0-9][0-9][0-9])$/g;
        const regExpMonth = /^(?:0?[1-9]|1[0-2])$/g;
        const regExpDate = /^(?:0?[1-9]|1[0-9]|2[0-9]|3[0-1])$/g;

        //현재 년월일 데이터
        const nowYear = new Date().getFullYear(); //년 4자리
        const nowMonth = new Date().getMonth() + 1; //월 0~11
        const nowDate = new Date().getDate(); //일

        //현재년월일
        const today = new Date(nowYear, nowMonth, nowDate);

        if (생년 === "" && 생월 === "" && 생일 === "") {
            setField({
                ...field,
                isShowBirthText: "태어난 년도 4자리를 정확하게 입력해주세요",
                isShowBirthError: true,
            });
            return;
        } else {
            if (regExpYear.test(생년) === false) {
                setField({
                    ...field,
                    isShowBirthText:
                        "태어난 년도 4자리를 정확하게 입력해주세요",
                    isShowBirthError: true,
                });
                return;
            } else {
                setField({
                    ...field,
                    isShowBirthError: false,
                    isShowBirthText: "",
                });

                if (regExpMonth.test(생월) === false) {
                    setField({
                        ...field,
                        isShowBirthText: "태어난 월을 정확하게 입력해주세요",
                        isShowBirthError: true,
                    });
                    return;
                } else {
                    setField({
                        ...field,
                        isShowBirthError: false,
                        isShowBirthText: "",
                    });

                    if (regExpDate.test(생일) === false) {
                        setField({
                            ...field,
                            isShowBirthText:
                                "태어난 일을 정확하게 입력해주세요",
                            isShowBirthError: true,
                        });
                        return;
                    } else {
                        setField({
                            ...field,
                            isShowBirthError: false,
                            isShowBirthText: "",
                        });
                    }
                    //생년월일 모두 완료, 추가조건:14세미만, 미래, 120세초과
                    const birthDay = new Date(생년, 생월, 생일); //생년월일
                    const nowYear120 = new Date(
                        nowYear - 120,
                        nowMonth,
                        nowDate
                    );
                    const nowYear14 = new Date(nowYear - 14, nowMonth, nowDate); //14세 미만 변수

                    if (birthDay > today) {
                        setField({
                            ...field,
                            isShowBirthText: "생년월일이 미래로 입력되었어요",
                            isShowBirthError: true,
                        });
                        return;
                    } else {
                        setField({
                            ...field,
                            isShowBirthError: false,
                            isShowBirthText: "",
                        });
                    }

                    if (birthDay > nowYear14) {
                        setField({
                            ...field,
                            isShowBirthText: "만 14세 미만은 가입이 불가합니다",
                            isShowBirthError: true,
                        });
                        return;
                    } else {
                        setField({
                            ...field,
                            isShowBirthError: false,
                            isShowBirthText: "",
                        });
                    }

                    if (birthDay < nowYear120) {
                        setField({
                            ...field,
                            isShowBirthText: "생년월일을 다시한번 확인해주세요",
                            isShowBirthError: true,
                        });
                        return;
                    } else {
                        setField({
                            ...field,
                            isShowBirthError: false,
                            isShowBirthText: "",
                        });
                    }
                }
            }
        }
    };

    //생년월일끝

    //추천인 이벤트

    const onChangeRadioAddInput = (e) => {
        setField({
            ...field,
            isShowAddInput: true,
            추가입력사항선택: e.target.value,
        });
    };

    //추가입력
    const onChangeAddInput = (e) => {
        setField({ ...field, 추가입력사항: e.target.value });
    };

    //추천인 이벤트 끝

    //이용약관동의
    //1 전체동의합니다
    const onChangeServiceAll = (e) => {
        if (e.target.checked) {
            setField({ ...field, 이용약관동의: 이용약관 });
        } else {
            setField({ ...field, 이용약관동의: [] });
        }
    };

    //2 각각 동의합니다
    const onChangeService = (e) => {
        let imsi = [];
        if (e.target.checked === true) {
            if (field.이용약관동의.includes("SMS")) {
                if (
                    e.target.value ===
                    "무료배송, 할인쿠폰 등 혜택/정보 수신 동의"
                ) {
                    setField({
                        ...field,
                        이용약관동의: [
                            ...field.이용약관동의,
                            "무료배송, 할인쿠폰 등 혜택/정보 수신 동의",
                            "이메일",
                        ],
                    });
                } else if (e.target.value === "이메일") {
                    setField({
                        ...field,
                        이용약관동의: [
                            ...field.이용약관동의,
                            "무료배송, 할인쿠폰 등 혜택/정보 수신 동의",
                            "이메일",
                        ],
                    });
                } else {
                    setField({
                        ...field,
                        이용약관동의: [...field.이용약관동의, e.target.value],
                    });
                }
            } else if (field.이용약관동의.includes("이메일")) {
                if (
                    e.target.value ===
                    "무료배송, 할인쿠폰 등 혜택/정보 수신 동의"
                ) {
                    setField({
                        ...field,
                        이용약관동의: [
                            ...field.이용약관동의,
                            "무료배송, 할인쿠폰 등 혜택/정보 수신 동의",
                            "SMS",
                        ],
                    });
                } else if (e.target.value === "SMS") {
                    setField({
                        ...field,
                        이용약관동의: [
                            ...field.이용약관동의,
                            "무료배송, 할인쿠폰 등 혜택/정보 수신 동의",
                            "SMS",
                        ],
                    });
                } else {
                    setField({
                        ...field,
                        이용약관동의: [...field.이용약관동의, e.target.value],
                    });
                }
            } else {
                if (
                    e.target.value ===
                    "무료배송, 할인쿠폰 등 혜택/정보 수신 동의"
                ) {
                    setField({
                        ...field,
                        이용약관동의: [
                            ...field.이용약관동의,
                            "무료배송, 할인쿠폰 등 혜택/정보 수신 동의",
                            "SMS",
                            "이메일",
                        ],
                    });
                } else {
                    setField({
                        ...field,
                        이용약관동의: [...field.이용약관동의, e.target.value],
                    });
                }
            }
        } else {
            if (
                e.target.value === "무료배송, 할인쿠폰 등 혜택/정보 수신 동의"
            ) {
                imsi = field.이용약관동의.filter(
                    (item) => item !== e.target.value
                );
                imsi = imsi.filter((item) => item !== "SMS");
                imsi = imsi.filter((item) => item !== "이메일");
                setField({ ...field, 이용약관동의: imsi });
            } else if (
                field.이용약관동의.includes("이메일") &&
                e.target.value === "SMS"
            ) {
                imsi = field.이용약관동의.filter((item) => item !== "SMS");
                imsi = imsi.filter(
                    (item) =>
                        item !== "무료배송, 할인쿠폰 등 혜택/정보 수신 동의"
                );
                setField({ ...field, 이용약관동의: imsi });
            } else if (
                field.이용약관동의.includes("SMS") &&
                e.target.value === "이메일"
            ) {
                imsi = field.이용약관동의.filter((item) => item !== "이메일");
                imsi = imsi.filter(
                    (item) =>
                        item !== "무료배송, 할인쿠폰 등 혜택/정보 수신 동의"
                );
                setField({ ...field, 이용약관동의: imsi });
            } else {
                imsi = field.이용약관동의.filter(
                    (item) => item !== e.target.value
                );
                setField({ ...field, 이용약관동의: imsi });
            }
        }
    };

    //전송 submit
    //1 로컬스토리지 저장
    //2 닷홈 비동기 전송방식: AXIOS 전송 => 서버(PHP, MYSQL)와 정보 송수신(CRUD)하기 위해 사용
    const onSubmitMember = (e) => {
        e.preventDefault();
        const {
            아이디,
            비밀번호,
            비밀번호확인,
            이름,
            이메일,
            휴대폰,
            주소1,
            주소2,
            성별,
            생년,
            생월,
            생일,
            추가입력사항선택,
            추가입력사항,
            이용약관동의,
            아이디중복확인Ok,
            이메일중복확인Ok,
            휴대폰인증확인Ok,
        } = field;

        if (
            아이디 === "" ||
            비밀번호 === "" ||
            비밀번호확인 === "" ||
            이름 === "" ||
            이메일 === "" ||
            휴대폰 === "" ||
            주소1 === "" ||
            주소2 === "" ||
            아이디중복확인Ok === false ||
            이메일중복확인Ok === false ||
            휴대폰인증확인Ok === false
        ) {
            if (아이디 === "") {
                modalOpenFn("아이디를 입력해주세요");
            } else if (비밀번호 === "") {
                modalOpenFn("비밀번호를 입력해주세요");
            } else if (비밀번호확인 === "") {
                modalOpenFn("비밀번호확인을 입력해주세요");
            } else if (이름 === "") {
                modalOpenFn("이름을 입력해주세요");
            } else if (이메일 === "") {
                modalOpenFn("이메일을 입력해주세요");
            } else if (휴대폰 === "") {
                modalOpenFn("휴대폰을 입력해주세요");
            } else if (주소1 === "") {
                modalOpenFn("주소를 검색해주세요");
            } else if (주소2 === "") {
                modalOpenFn("자세한 주소를 입력해주세요");
            } else if (아이디중복확인Ok === false) {
                modalOpenFn("아이디 중복확인 해주세요");
            } else if (이메일중복확인Ok === false) {
                modalOpenFn("이메일 중복확인 해주세요");
            } else if (휴대폰인증확인Ok === false) {
                modalOpenFn("휴대폰 인증번호 확인해주세요");
            }
            return;
        } else {
            let cnt = 0;
            이용약관동의.map((item) => {
                if (item.includes("필수")) {
                    cnt++;
                }
            });

            if (cnt < 3) {
                modalOpenFn(`필수 약관에 모두 동의해 주세요(현재 ${cnt} 개)`);
            } else {
                let imsi = {
                    아이디: 아이디,
                    비밀번호: 비밀번호,
                    비밀번호확인: 비밀번호확인,
                    이름: 이름,
                    이메일: 이메일,
                    휴대폰: 휴대폰,
                    주소: `${주소1} ${주소2}`,
                    성별: 성별,
                    생년월일: `${생년}-${생월}-${생일}`,
                    추가입력사항: `${추가입력사항선택}: ${추가입력사항}`,
                    이용약관동의: 이용약관동의,
                    가입일자: `${new Date().getFullYear()}-${
                        new Date().getMonth() + 1
                    }-${new Date().getDate()}`,
                };

                localStorage.setItem(imsi.아이디, JSON.stringify(imsi)); //로컬스토리지는 객체저장불가능, json.stringfy 사용 문자열변환

                //AXIOS 서버에게 데이터 전송 구현

                //폼데이터 객체 생성
                const axiosFn = () => {
                    let formData = new FormData();
                    formData.append("id", 아이디);
                    formData.append("pw", 비밀번호);
                    formData.append("irum", 이름);
                    formData.append("email", 이메일);
                    formData.append("hp", 휴대폰);
                    formData.append("address", `${주소1} ${주소2}`);
                    formData.append("gender", 성별);
                    formData.append("birthday", `${생년}-${생월}-${생일}`);
                    formData.append(
                        "addinput",
                        `${추가입력사항선택}: ${추가입력사항}`
                    );
                    formData.append("service", 이용약관동의);
                    formData.append(
                        "gaib",
                        `${new Date().getFullYear()}-${
                            new Date().getMonth() + 1
                        }-${new Date().getDate()}`
                    );

                    //AXIOS 비동기 전송
                    axios({
                        url: "./response.php",
                        method: "POST",
                        data: formData,
                    })
                        .then((response) => {
                            modalOpenFn(
                                "마켓컬리 회원가입을 진심으로 감사드립니다"
                            );
                            setField({
                                ...field,

                                아이디: "",
                                아이디중복확인Ok: "",
                                isShowId: false,
                                isClassId: "",

                                비밀번호: "",
                                isShowPw: false,
                                isClassPw1: "",
                                isClassPw2: "",
                                isClassPw3: "",

                                비밀번호확인: "",
                                isShowPwRe: false,
                                isClassPwRe: "",

                                이름: "",

                                이메일: "",
                                이메일확인: "",
                                이메일중복확인Ok: false,

                                휴대폰: "",
                                휴대폰확인: "",
                                인증번호: "",
                                인증확인번호: "",
                                휴대폰인증확인Ok: false,
                                setId: "",
                                isDisabledHp: true,
                                isShowHp: false,
                                minutes: 2,
                                seconds: 59,
                                isDisabledHpInput: false,
                                isDisabledHpBtn: false,
                                isShowHpSpan: true,

                                isShowAddress: false,
                                주소1: "",
                                주소2: "",

                                성별: "선택안함",

                                생년: "",
                                생월: "",
                                생일: "",
                                isShowBirthText: "",
                                isShowBirthError: false,

                                isShowAddInput: false,
                                추가입력사항: "",
                                추가입력사항선택: "",

                                이용약관동의: [],
                            });
                            console.log(`AXIOS 성공: ${response.data}`);
                            return;
                        })
                        .catch((error) => {
                            console.log(`AXIOS 실패: ${error}`);
                            modalOpenFn("AXIOS 실패 다시 확인하세요");
                            return;
                        });
                };
                axiosFn();
            }
        }
    };

    //데이터베이스에서 데이터 가져오기 GET => select.php
    const axiosGet = () => {
        axios({
            url: "./select.php",
            method: "GET",
        })
            .then((res) => {
                setCheckMember({ 가입회원: res.data });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    React.useEffect(() => {
        axiosGet();
    }, []);

    return (
        <section id="member">
            <div className="container">
                <div className="wrap">
                    <div className="title">
                        <h2>회원가입</h2>
                    </div>
                    <div className="content">
                        <form
                            onSubmit={onSubmitMember}
                            id="member"
                            autoComplete="off"
                            name="member"
                            method="post"
                            action="response.php"
                        >
                            <ul className="inputForm">
                                <li>
                                    <h3>
                                        <i>*</i>
                                        <span>필수입력사항</span>
                                    </h3>
                                </li>
                                <li>
                                    <div className="left">
                                        <label>
                                            <span>아이디</span>
                                            <i>*</i>
                                        </label>
                                    </div>
                                    <div className="right">
                                        <input
                                            type="text"
                                            id="inputId"
                                            name="inputId"
                                            placeholder="6자 이상의 영문 혹은 영문과 숫자를 조합"
                                            maxLength="20"
                                            onChange={onChangeId}
                                            onFocus={onFocusId}
                                            value={field.아이디}
                                        />
                                        <button
                                            onClick={onClickIdModal}
                                            className="id-double-btn"
                                            title="중복확인"
                                        >
                                            중복확인
                                        </button>
                                        {field.isShowId && (
                                            <div className="guide-text guide-id">
                                                <p
                                                    className={
                                                        field.isClassId === ""
                                                            ? ""
                                                            : field.isClassId
                                                            ? "success"
                                                            : "error"
                                                    }
                                                >
                                                    6자 이상의 영문 혹은 영문과
                                                    숫자를 조합
                                                </p>
                                                <p
                                                    className={
                                                        field.아이디중복확인Ok ===
                                                        ""
                                                            ? ""
                                                            : field.아이디중복확인Ok
                                                            ? "success"
                                                            : "error"
                                                    }
                                                >
                                                    아이디 중복확인
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </li>
                                <li>
                                    <div className="left">
                                        <label>
                                            <span>비밀번호</span>
                                            <i>*</i>
                                        </label>
                                    </div>
                                    <div className="right">
                                        <input
                                            type="password"
                                            id="inputPw"
                                            name="inputPw"
                                            placeholder="비밀번호를 입력해 주세요"
                                            maxLength="20"
                                            onChange={onChangePw}
                                            onFocus={onFocusPw}
                                            value={field.비밀번호}
                                        />
                                        {field.isShowPw && (
                                            <div className="guide-text guide-pw">
                                                <p
                                                    className={
                                                        field.isClassPw1 === ""
                                                            ? ""
                                                            : field.isClassPw1
                                                            ? "success"
                                                            : "error"
                                                    }
                                                >
                                                    10자 이상 입력
                                                </p>
                                                <p
                                                    className={
                                                        field.isClassPw2 === ""
                                                            ? ""
                                                            : field.isClassPw2
                                                            ? "success"
                                                            : "error"
                                                    }
                                                >
                                                    영문/숫자/특수문자(공백
                                                    제외)만 허용하며, 2개 이상
                                                    조합
                                                </p>
                                                <p
                                                    className={
                                                        field.isClassPw3 === ""
                                                            ? ""
                                                            : field.isClassPw3
                                                            ? "success"
                                                            : "error"
                                                    }
                                                >
                                                    동일한 숫자 3개 이상 연속
                                                    사용 불가
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </li>
                                <li>
                                    <div className="left">
                                        <label>
                                            <span>비밀번호확인</span>
                                            <i>*</i>
                                        </label>
                                    </div>
                                    <div className="right">
                                        <input
                                            type="password"
                                            id="inputPwChk"
                                            name="inputIdChk"
                                            placeholder="비밀번호를 한번 더 입력해 주세요"
                                            maxLength="20"
                                            onChange={onChangePwRe}
                                            onFocus={onFocusPwRe}
                                            value={field.비밀번호확인}
                                        />
                                        {field.isShowPwRe && (
                                            <div className="guide-text guide-pw-check">
                                                <p
                                                    className={
                                                        field.isClassPwRe === ""
                                                            ? ""
                                                            : field.isClassPwRe
                                                            ? "success"
                                                            : "error"
                                                    }
                                                >
                                                    동일한 비밀번호를
                                                    입력해주세요.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </li>
                                <li>
                                    <div className="left">
                                        <label>
                                            <span>이름</span>
                                            <i>*</i>
                                        </label>
                                    </div>
                                    <div className="right">
                                        <input
                                            type="text"
                                            id="inputName"
                                            name="inputName"
                                            placeholder="이름을 입력해 주세요"
                                            onChange={onChangeName}
                                            value={field.이름}
                                        />
                                    </div>
                                </li>
                                <li>
                                    <div className="left">
                                        <label>
                                            <span>이메일</span>
                                            <i>*</i>
                                        </label>
                                    </div>
                                    <div className="right">
                                        <input
                                            type="Email"
                                            id="inputEmail"
                                            name="inputEmail"
                                            placeholder="예:marketkurly@kurly.com"
                                            onChange={onChangEmail}
                                            value={field.이메일}
                                        />
                                        <button
                                            onClick={onClickEmailModal}
                                            className="email-double-btn"
                                            title="중복확인"
                                        >
                                            중복확인
                                        </button>
                                    </div>
                                </li>
                                <li>
                                    <div className="left">
                                        <label>
                                            <span>휴대폰</span>
                                            <i>*</i>
                                        </label>
                                    </div>
                                    <div className="right">
                                        <input
                                            type="text"
                                            id="inputPhone"
                                            name="inputPhone"
                                            placeholder="숫자만 입력해주세요"
                                            maxLength="11"
                                            onChange={onChangeHp}
                                            value={field.휴대폰}
                                        />
                                        <button
                                            onMouseDown={onMouseDownHp}
                                            onClick={onClickHp}
                                            disabled={field.isDisabledHp}
                                            className={
                                                field.isDisabledHp
                                                    ? "phone-btn"
                                                    : "phone-btn on"
                                            }
                                            title="인증번호"
                                        >
                                            인증번호받기
                                        </button>
                                        {field.isShowHp && (
                                            <>
                                                <input
                                                    disabled={
                                                        field.isDisabledHpInput
                                                    }
                                                    onChange={onChangeHpNum}
                                                    type="text"
                                                    id="inputPhoneok"
                                                    name="inputPhoneok"
                                                    placeholder="인증번호를 입력해주세요"
                                                    maxLength="6"
                                                    value={field.인증확인번호}
                                                />
                                                <button
                                                    disabled={
                                                        field.isDisabledHpBtn
                                                    }
                                                    onClick={onClickConfirm}
                                                    className={
                                                        field.isDisabledHpBtn ===
                                                        true
                                                            ? "phone-btn phone-ok-btn"
                                                            : "phone-btn phone-ok-btn on"
                                                    }
                                                    title="인증번호확인"
                                                >
                                                    인증번호확인
                                                </button>
                                                {field.isShowHpSpan && (
                                                    <span className="count-timer">
                                                        {field.minutes}:
                                                        {field.seconds < 10
                                                            ? `0${field.seconds}`
                                                            : `${field.seconds}`}
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </li>
                                <li className="address">
                                    <div className="left">
                                        <label>
                                            <span>주소</span>
                                            <i>*</i>
                                        </label>
                                    </div>
                                    <div className="right">
                                        {field.isShowAddress && (
                                            <>
                                                <input
                                                    onChange={onChangeAddress1}
                                                    value={field.주소1}
                                                    type="text"
                                                    id="inputAddress1"
                                                    name="inputAddress1"
                                                    placeholder="검색주소"
                                                />
                                                <input
                                                    onChange={onChangeAddress2}
                                                    value={field.주소2}
                                                    type="text"
                                                    id="inputAddress2"
                                                    name="inputAddress2"
                                                    placeholder="세부주소를 입력하세요"
                                                />
                                            </>
                                        )}
                                        <button
                                            onClick={onClickAddress}
                                            id="addressBtn"
                                            className="address-btn"
                                            title="주소검색"
                                        >
                                            <span>
                                                <img
                                                    src="./images/ico_search.svg"
                                                    alt=""
                                                />
                                                <i>주소검색</i>
                                            </span>
                                        </button>
                                        <div className="guide-text guide-address">
                                            <h4>샛별|택배|불가</h4>
                                        </div>
                                        <p className="address-p">
                                            배송지에 따라 상품 정보가 달라질 수
                                            있습니다.
                                        </p>
                                        {/* 주소검색 카카오 패키지 컴포넌트 API */}
                                        <div id="postcode">
                                            {field.isShowAddress2 && (
                                                <div>
                                                    <Postcode
                                                        id="postcode"
                                                        style={stylePost}
                                                        onComplete={
                                                            onCompletePost
                                                        }
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className="left">
                                        <label>
                                            <span>성별</span>
                                        </label>
                                    </div>
                                    <div className="right gender">
                                        <label htmlFor="male">
                                            <input
                                                onChange={onChangeGender}
                                                checked={field.성별.includes(
                                                    "남자"
                                                )}
                                                type="radio"
                                                id="male"
                                                name="gender"
                                                value="남자"
                                            />
                                            <span> 남자</span>
                                        </label>
                                        <label htmlFor="female">
                                            <input
                                                onChange={onChangeGender}
                                                checked={field.성별.includes(
                                                    "여자"
                                                )}
                                                type="radio"
                                                id="female"
                                                name="gender"
                                                value="여자"
                                            />
                                            <span> 여자</span>
                                        </label>
                                        <label htmlFor="none">
                                            <input
                                                onChange={onChangeGender}
                                                checked={field.성별.includes(
                                                    "선택안함"
                                                )}
                                                type="radio"
                                                id="none"
                                                name="gender"
                                                value="선택안함"
                                            />
                                            <span> 선택안함</span>
                                        </label>
                                    </div>
                                </li>
                                <li>
                                    <div className="left">
                                        <label>
                                            <span>생년월일</span>
                                        </label>
                                    </div>
                                    <div className="right">
                                        <div className="date-box">
                                            <ul>
                                                <li>
                                                    <input
                                                        type="text"
                                                        onChange={onChangeYear}
                                                        onBlur={birthDayCheck}
                                                        value={field.생년}
                                                        id="year"
                                                        name="year"
                                                        placeholder="YYYY"
                                                        maxLength="4"
                                                    />
                                                </li>
                                                <li>
                                                    <span>/</span>
                                                </li>
                                                <li>
                                                    <input
                                                        type="text"
                                                        onChange={onChangeMonth}
                                                        onFocus={birthDayCheck}
                                                        onBlur={birthDayCheck}
                                                        value={field.생월}
                                                        id="month"
                                                        name="month"
                                                        placeholder="MM"
                                                        maxLength="2"
                                                    />
                                                </li>
                                                <li>
                                                    <span>/</span>
                                                </li>
                                                <li>
                                                    <input
                                                        type="text"
                                                        onChange={onChangeDate}
                                                        onFocus={birthDayCheck}
                                                        onBlur={birthDayCheck}
                                                        value={field.생일}
                                                        id="date"
                                                        name="date"
                                                        placeholder="DD"
                                                        maxLength="2"
                                                    />
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="guide-text guide-birthday-confirm">
                                            {field.isShowBirthError && (
                                                <p className="error">
                                                    {" "}
                                                    {field.isShowBirthText}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </li>
                                <li className="add-item">
                                    <div className="left">
                                        <label>
                                            <span>추가입력 사항</span>
                                        </label>
                                    </div>
                                    <div className="right gender add">
                                        <label htmlFor="add1">
                                            <input
                                                onChange={onChangeRadioAddInput}
                                                checked={field.추가입력사항선택.includes(
                                                    "추천인 아이디"
                                                )}
                                                type="radio"
                                                id="add1"
                                                name="add"
                                                className="add-radio"
                                                value="추천인 아이디"
                                            />
                                            <span>추천인 아이디</span>
                                        </label>
                                        <label htmlFor="add2">
                                            <input
                                                onChange={onChangeRadioAddInput}
                                                checked={field.추가입력사항선택.includes(
                                                    "참여 이벤트"
                                                )}
                                                type="radio"
                                                id="add2"
                                                name="add"
                                                className="add-radio"
                                                value="참여 이벤트"
                                            />
                                            <span>참여 이벤트</span>
                                        </label>
                                        {field.isShowAddInput && (
                                            <div className="add-input-box">
                                                <input
                                                    onChange={onChangeAddInput}
                                                    type="text"
                                                    id="inputAdd"
                                                    name="inputAdd"
                                                    placeholder=""
                                                    value={field.추가입력사항}
                                                />
                                                <p>
                                                    추천인 아이디와 참여
                                                    이벤트명 중 하나만 선택
                                                    가능합니다.
                                                    <br />
                                                    가입 이후, 수정이
                                                    불가합니다.
                                                    <br />
                                                    대소문자 및 띄어쓰기에
                                                    유의해주세요.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </li>

                                <li>
                                    <hr />
                                </li>

                                <li className="check-box">
                                    <div className="left">
                                        <label>
                                            <span>
                                                이용약관동의<i>*</i>
                                            </span>
                                        </label>
                                    </div>
                                    <div className="right service">
                                        <ol>
                                            <li>
                                                <label htmlFor="chkAll">
                                                    <input
                                                        onChange={
                                                            onChangeServiceAll
                                                        }
                                                        checked={
                                                            field.이용약관동의
                                                                .length >= 7
                                                                ? true
                                                                : false
                                                        }
                                                        type="checkbox"
                                                        id="chkAll"
                                                        name="chkAll"
                                                        value="전체동의합니다."
                                                    />
                                                    <span>전체동의합니다.</span>
                                                </label>
                                                <p>
                                                    선택항목에 동의하지 않은
                                                    경우도 회원가입 및 일반적인
                                                    서비스를 이용할 수 있습니다.
                                                </p>
                                            </li>

                                            <li className="view-box">
                                                <label htmlFor="chk1">
                                                    <input
                                                        onChange={
                                                            onChangeService
                                                        }
                                                        checked={field.이용약관동의.includes(
                                                            "이용약관동의(필수)"
                                                        )}
                                                        type="checkbox"
                                                        id="chk1"
                                                        name="chk1"
                                                        className="chkbox-btn"
                                                        value="이용약관동의(필수)"
                                                    />
                                                    <span>
                                                        이용약관동의
                                                        <i>(필수)</i>
                                                    </span>
                                                </label>
                                                <span>
                                                    <a
                                                        href="#!"
                                                        className="view-btn-box"
                                                    >
                                                        약관보기<i>&gt;</i>
                                                    </a>
                                                </span>
                                            </li>

                                            <li className="view-box">
                                                <label htmlFor="chk2">
                                                    <input
                                                        onChange={
                                                            onChangeService
                                                        }
                                                        checked={field.이용약관동의.includes(
                                                            "개인정보 수집·이용 동의(필수)"
                                                        )}
                                                        type="checkbox"
                                                        id="chk2"
                                                        name="chk2"
                                                        className="chkbox-btn"
                                                        value="개인정보 수집·이용 동의(필수)"
                                                    />
                                                    <span>
                                                        개인정보 수집·이용 동의
                                                        <i>(필수)</i>
                                                    </span>
                                                </label>
                                                <span>
                                                    <a
                                                        href="#!"
                                                        className="view-btn-box"
                                                    >
                                                        약관보기<i>&gt;</i>
                                                    </a>
                                                </span>
                                            </li>

                                            <li className="view-box">
                                                <label htmlFor="chk3">
                                                    <input
                                                        onChange={
                                                            onChangeService
                                                        }
                                                        checked={field.이용약관동의.includes(
                                                            "개인정보 수집·이용 동의(선택)"
                                                        )}
                                                        type="checkbox"
                                                        id="chk3"
                                                        name="chk3"
                                                        className="chkbox-btn"
                                                        value="개인정보 수집·이용 동의(선택)"
                                                    />
                                                    <span>
                                                        개인정보 수집·이용 동의
                                                        <i>(선택)</i>
                                                    </span>
                                                </label>
                                                <span>
                                                    <a
                                                        href="#!"
                                                        className="view-btn-box"
                                                    >
                                                        약관보기<i>&gt;</i>
                                                    </a>
                                                </span>
                                            </li>

                                            <li>
                                                <label htmlFor="chk4">
                                                    <input
                                                        onChange={
                                                            onChangeService
                                                        }
                                                        checked={field.이용약관동의.includes(
                                                            "무료배송, 할인쿠폰 등 혜택/정보 수신 동의"
                                                        )}
                                                        type="checkbox"
                                                        id="chk4"
                                                        name="chk4"
                                                        className="chkbox-btn"
                                                        value="무료배송, 할인쿠폰 등 혜택/정보 수신 동의"
                                                    />
                                                    <span>
                                                        무료배송, 할인쿠폰 등
                                                        혜택/정보 수신 동의
                                                        <i>(선택)</i>
                                                    </span>
                                                </label>
                                                <dl>
                                                    <dd>
                                                        <label htmlFor="chk5">
                                                            <input
                                                                onChange={
                                                                    onChangeService
                                                                }
                                                                checked={field.이용약관동의.includes(
                                                                    "SMS"
                                                                )}
                                                                type="checkbox"
                                                                id="chk5"
                                                                name="chk5"
                                                                className="chkbox-btn"
                                                                value="SMS"
                                                            />
                                                            <span>SMS</span>
                                                        </label>
                                                        <label htmlFor="chk6">
                                                            <input
                                                                onChange={
                                                                    onChangeService
                                                                }
                                                                type="checkbox"
                                                                checked={field.이용약관동의.includes(
                                                                    "이메일"
                                                                )}
                                                                id="chk6"
                                                                name="chk6"
                                                                className="chkbox-btn"
                                                                value="이메일"
                                                            />
                                                            <span>이메일</span>
                                                        </label>
                                                    </dd>
                                                    <dt>
                                                        <p>
                                                            동의 시 한 달간
                                                            [5%적립] + [2만원
                                                            이상 무료배송] 첫
                                                            주문 후 안내
                                                        </p>
                                                    </dt>
                                                </dl>
                                            </li>

                                            <li>
                                                <label htmlFor="chk7">
                                                    <input
                                                        onChange={
                                                            onChangeService
                                                        }
                                                        type="checkbox"
                                                        checked={field.이용약관동의.includes(
                                                            "본인은 만 14세 이상입니다.(필수)"
                                                        )}
                                                        id="chk7"
                                                        name="chk7"
                                                        className="chkbox-btn"
                                                        value="본인은 만 14세 이상입니다.(필수)"
                                                    />
                                                    <span>
                                                        본인은 만 14세
                                                        이상입니다.<i>(필수)</i>
                                                    </span>
                                                </label>
                                            </li>
                                        </ol>
                                    </div>
                                </li>
                                <li className="bottom-line">
                                    <hr />
                                </li>
                                <li className="button-box">
                                    <button
                                        type="submit"
                                        className="submit-btn"
                                    >
                                        가입하기
                                    </button>
                                </li>
                            </ul>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

MemberComponent.defaultProps = {
    이용약관: [
        "이용약관동의(필수)",
        "개인정보 수집·이용 동의(필수)",
        "개인정보 수집·이용 동의(선택)",
        "무료배송, 할인쿠폰 등 혜택/정보 수신 동의",
        "SMS",
        "이메일",
        "본인은 만 14세 이상입니다.(필수)",
    ],
};

const FooterComponent = () => {
    return (
        <footer id="footer">
            <div className="container">
                <div className="wrap"></div>
            </div>
        </footer>
    );
};

const ModalComponent = ({ modal, modalCloseFn }) => {
    const onClickClose = () => {
        modalCloseFn();
    };

    return (
        modal.isShow && (
            <div id="modal">
                <div className="container">
                    <ul>
                        <li>
                            <h2>알림메시지</h2>
                            <button
                                onClick={onClickClose}
                                className="close-btn modal-close"
                            >
                                <img
                                    src="./images/icon-close-button.webp"
                                    alt=""
                                />
                            </button>
                        </li>
                        <li>
                            <p className="modal-msg">{modal.title}</p>
                        </li>
                    </ul>
                    <div className="button-box">
                        <button
                            onClick={onClickClose}
                            className="ok-btn modal-close"
                        >
                            확인
                        </button>
                    </div>
                </div>
            </div>
        )
    );
};

ReactDOM.render(<WrapComponent />, document.getElementById("root"));
