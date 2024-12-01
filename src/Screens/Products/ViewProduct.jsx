import axios from "axios";
import apiUrl from "../../BaseURI/apiUrl";
import React, { useEffect, useContext, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import useTimeLeft from "../../hooks/useTimeLeft";
import testImage from "../../assets/012.png"

const HeaderText = ({ product }) => {

    return (
        <div className="blog-title-container mt-32">
            <div className="blog-title-text text-[1.8rem] font-[800]">[{product?.businessName}] {product?.campaignName}</div>
            <div className="blog-sub-title-text text-[1rem] font-[500] mt-3 text-[#6D6D6D]">{product?.service}</div>
            <div className="mt-8 font-[700] text-[1rem]">{useTimeLeft(product?.createdAt)}일남음</div>

            <div className="mt-8 font-[700] text-[1.2rem]">주소
                <span className="mr-8"></span >
                <span className="font-[500] text-[1rem]">{product?.location.sido} {product?.location.sigungu} {product?.location.address} {product?.location.detailAddress}</span>
            </div>
            <hr className="mt-4 border-t-2 border-grey"></hr>
        </div>
    )
}


const ContentSideBar = ({ setRegisterForm, product, scrollToSection, info1Ref, info2Ref, info3Ref, info4Ref, info5Ref }) => {
    return (
        <div
            style={{ top: '32px', position: 'sticky' }}
            className="event-container rounded-[20px] bg-white border-[3px] shadow-lg border-[#F5F3F3] mt-32 px-[5%] py-8">
            <div className="event-details-container flex flex-col gap-4">
                <div className="event-row-container flex flex-row  gap-4 flex-nowrap">
                    <div className="font-[700] text-[1rem]">신청가능 시간</div>
                    <div className="font-[500] text-[1rem]">{product?.availableTime}</div>
                </div>

                <div className="event-row-container flex flex-row  gap-4 flex-nowrap">
                    <div className="font-[700] text-[1rem]">인풀루언서 발표</div>
                    <div className="font-[500] text-[1rem]">07.11(수) ~ 07.21(토)</div>
                </div>

                <div className="event-row-container flex flex-row  gap-4 flex-nowrap">
                    <div className="font-[700] text-[1rem]">체험기간</div>
                    <div className="font-[500] text-[1rem]">07.11(수) ~ 07.21(토)</div>
                </div>

                <div className="event-row-container flex flex-row  gap-4 flex-nowrap">
                    <div className="font-[700] text-[1rem]">캠페인 결과발표</div>
                    <div className="font-[500] text-[1rem]">08.02(목)</div>
                </div>

                <div className="event-row-container flex flex-row  gap-4 flex-nowrap">
                    <div className="font-[700] text-[1rem]">실시간 지원현황</div>
                    <div className="font-[500] text-[1rem]">{product?.registeredUsers.length} / {product?.numberOfPeople}명</div>
                </div>
            </div>

            <hr className="mt-4 mb-4 border-t-2 border-grey"></hr>
            <div className=" font-[700] text-[1rem] flex flex-col gap-2 justify-center  border-b-2 border-grey">

                <div className="text-[0.9rem] font-[600] mb-4" onClick={() => { scrollToSection(info1Ref) }} style={{ cursor: "pointer" }}>제공 내역</div>
            </div>

            <div className=" font-[700] text-[1rem] flex flex-col gap-2 justify-center  border-grey border-b-2">

                <div className="text-[0.9rem] font-[600] mt-4 mb-4"
                    onClick={() => { scrollToSection(info2Ref) }} style={{ cursor: "pointer" }}
                >방문 및 예약안내</div>
            </div>

            <div className=" font-[700] text-[1rem] flex flex-col gap-2 justify-center  border-grey border-b-2">

                <div className="text-[0.9rem] font-[600] mt-4 mb-4"
                    onClick={() => { scrollToSection(info3Ref) }} style={{ cursor: "pointer" }}>캠페인 미션</div>
            </div>

            <div className=" font-[700] text-[1rem] flex flex-col gap-2 justify-center  border-grey border-b-2">

                <div className="text-[0.9rem] font-[600] mt-4 mb-4"
                    onClick={() => { scrollToSection(info4Ref) }} style={{ cursor: "pointer" }}
                >키워드</div>
            </div>

            <div className=" font-[700] text-[1rem] flex flex-col gap-2 justify-center  border-grey border-b-2">

                <div className="text-[0.9rem] font-[600] mt-4 mb-4"
                    onClick={() => { scrollToSection(info5Ref) }} style={{ cursor: "pointer" }}
                >추가 안내사항</div>
            </div>

            <div className="bg-[#2C9512] rounded-[5px] mt-8 px-[5%] py-3">
                <div className="text-[1rem] font-[600] text-white text-center"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                        if (localStorage.getItem("userType") === "influencer") {
                            setRegisterForm(true)
                        } else {
                            alert("인플루언서만 신청할 수 있습니다.")
                        }
                    }}
                >캠페인 신청하기</div>
            </div>

            <div className="rounded-[5px] mt-4  py-10 h-full">
                <img src={testImage} alt="test" className="w-[100%] border-2 border-[#F5F3F3] rounded-[5px] h-[100%] object-cover relative" />
            </div>

        </div>
    )
}

const DetailedInfo = React.forwardRef(({ title = null, content = null }, ref) => {


    return (
        <div className="detailed-info-container w-[100%] mt-8" ref={ref}>
            <div className="detailed-info-wraper flex flex-row gap-10 mb-10" >
                <div className="detailed-title-container flex items-center w-1/4">
                    <div className="detailed-title-text font-[700] text-[1.3rem]">{title}</div>
                </div>
                <div className="detailed-info-content-container flex justify-start items-center pr-8 w-3/4">
                    <div className="detailed-info-content-title font-[400] text-[1rem] max-w-full overflow-hidden">
                        {content}
                    </div>
                </div>
            </div>
            <hr className="mt-32 border-t-2 border-grey" ></hr>
        </div>
    )
})

const SignUpForm = ({ setRegisterForm, id = null,product = null }) => {

    const handleRegister = async () => {
        try {
            const response = await axios.post(`${apiUrl}/final/registerUser`,  {
                registerInfo: registerInfo,
                _id : id,
            });

            if (response.status === 200 || response.status === 201) {
                alert("신청이 완료되었습니다.");
            } 
            else if (response.status === 205) {
                alert("이미 신청하신 상품입니다");
            }
            else {
                alert("신청에 실패하였습니다.");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const [registerInfo, setRegisterInfo] = useState({
        channel : "",
        url : "",
        name : "",
        phoneNumber : "",
        _id : "",
        email : "",
        status : "pending"
    });

    useEffect(() => {
        setRegisterInfo({
            channel: "",  // These will be set by select
            url: "",     // These will be set by select
            name: localStorage.getItem("name") || "",
            phoneNumber: localStorage.getItem("phoneNumber") || "",
            _id: localStorage.getItem("userID") || "",
            email: localStorage.getItem("email") || "",
            status : "pending"
        });
    }, []); // Empty dependency array means this runs once on mount
     

    const platformNames = {
        'YouTube': '유튜브',
        'Blog': '블로그',
        'Instagram': '인스타그램',
        'TikTok': '틱톡',
        'Web': '그 외'
    };


    const rawData = localStorage.getItem("influenceType");
    const influenceTypes = JSON.parse(rawData);
    const typesArray = Object.values(influenceTypes);

    return (
        <>
            <div className="fixed inset-0 bg-black/80 z-[9999]" style={{ position: 'fixed', top: 0, left: 0 }}>
                <div className="register-form-container flex flex-col items-start justify-center h-full w-2/6 mx-auto">
                    <label className="register-form-title-text text-white text-[1.5rem] font-[700]">흥보할 주소</label>
                    <select className="w-[100%] h-[50px] rounded-[5px] border-2 bg-white mt-2 pl-4" 
                    onChange={(e) => {
                        const selectedArray = typesArray.find(type => type[0] === e.target.value);
                        setRegisterInfo({
                            ...registerInfo,
                            channel : selectedArray[0],
                            url : selectedArray[1]
                        });
                    }}
                    >
                        <option value="">선택</option>
                        {
                            typesArray?.map((type, index) => {
                                console.log(type);
                                return (
                                    <option value={type[0]} key={index}>
                                        {platformNames[type[0]] || type[0]}  {/* Use Korean name if available, fallback to English */}
                                    </option>
                                )
                            })
                        }

                    </select>
                    <input className="w-[100%] h-[50px] rounded-[5px] border-2 bg-white mt-2 pl-4"
                        onChange={(e) => setRegisterInfo({
                            ...registerInfo,
                            url : e.target.value
                        })}
                        value={registerInfo.url}
                    ></input>

                    <label className="register-form-title-text text-white text-[1.5rem] font-[700] mt-4">이름</label>
                    <input className="w-[100%] h-[50px] rounded-[5px] border-2 bg-white mt-2 pl-4"
                        onChange={(e) => setRegisterInfo({
                            ...registerInfo,
                            name : e.target.value
                        })}
                        value={registerInfo.name}
                    ></input>

                    <label className="register-form-title-text text-white text-[1.5rem] font-[700] mt-4">연락처</label>
                    <input className="w-[100%] h-[50px] rounded-[5px] border-2 bg-white mt-2 pl-4"
                        onChange={(e) => setRegisterInfo({
                            ...registerInfo,
                            phoneNumber : e.target.value
                        })}
                        value={registerInfo.phoneNumber}
                    ></input>

                    <div className="button-container flex flex-row gap-4 w-full mt-12">
                        <button className="button-text text-white text-[1.5rem] font-[700] w-full bg-[#2C9512] rounded-[5px] py-2"
                            onClick={handleRegister}
                        >신청</button>
                        <button className="button-text text-white text-[1.5rem] font-[700] w-full bg-[#6D6D6D] rounded-[5px] py-2"
                            onClick={() => { setRegisterForm(false) }}
                        >취소</button>

                    </div>
                </div>

            </div>
        </>
    )
}


const ViewProduct = () => {



    const [product, setProduct] = useState(null);
    const [moreButton, setMoreButton] = useState(false);

    const [registerForm, setRegisterForm] = useState(false);

    const { id } = useParams();

    const info1Ref = useRef(null);
    const info2Ref = useRef(null);
    const info3Ref = useRef(null);
    const info4Ref = useRef(null);
    const info5Ref = useRef(null);


    const scrollToSection = (refElement) => {
        if (refElement.current) {
            refElement.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    };

    const fetchData = async () => {
        try {
            const response = await axios.post(`${apiUrl}/new/getProd`, {
                _id: id
            })
            if (response.status === 200) {
                setProduct(response.data[0]);
                console.log(response.data[0]);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchData();
    }, [])



    // const { userID, name, token, email } = useContext(AuthContext); // Access context values
    // const { item, isLoggedIn, setIsLoggedIn } = useContext(AppProvider);

    return (
        <>
            {registerForm && <SignUpForm id={id} product={product} setRegisterForm={setRegisterForm}></SignUpForm>}

            <div className="grid-container w-[90%] mx-auto flex flex-row">
                <div className="grid-section1 h-full w-3/4 pr-6">

                    <HeaderText product={product} />

                    <div className="relative">
                        <div className={`mt-8 transition-all ease ${!moreButton ? 'h-[70vh] overflow-hidden after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-20 after:bg-gradient-to-t after:from-white after:to-transparent' : 'h-full'}`}>
                            <div className="transition-transform duration-500 ease-in-out">

                                {product?.image1.map((image, index) => (
                                    <img src={image} key={index} alt="test" className="w-[100%] h-[100%] object-cover relative" />
                                ))}

                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setMoreButton(!moreButton)}
                        className="w-full shadow-inner rounded-md text-[1rem] font-[600] text-center mt-4 py-2 hover:bg-gray-300 transition-colors"
                    >
                        {moreButton ? '접기' : '더보기'}
                    </button>



                    <hr className="mt-32 border-t-2 border-grey"></hr>
                    <div className="detailed-info-container w-[100%] mt-8">
                        <DetailedInfo title="제공 내역" content={product?.textArea1} ref={info1Ref}></DetailedInfo>

                        <DetailedInfo title="방문 및 예약안내" content={product?.textArea2} ref={info2Ref}></DetailedInfo>

                        <DetailedInfo title="캠페인 미션" content={product?.textArea3} ref={info3Ref}></DetailedInfo>

                        <DetailedInfo title="키워드" content={product?.textArea4} ref={info4Ref}></DetailedInfo>

                        <DetailedInfo title="추가 안내사항" content={product?.textArea5} ref={info5Ref}></DetailedInfo>
                    </div>


                </div>

                {/* 오른쪽 영역 */}
                <div className="grid-section2  h-full w-1/4 static">
                    <ContentSideBar scrollToSection={scrollToSection}
                        product={product}
                        info1Ref={info1Ref}
                        info2Ref={info2Ref}
                        info3Ref={info3Ref}
                        info4Ref={info4Ref}
                        info5Ref={info5Ref}
                        setRegisterForm={setRegisterForm}
                    ></ContentSideBar>
                </div>




            </div>
            <div className="h-[30vh] bg-[#F5F3F3] w-full">
                {/* <ContentItem /> */}

            </div>
        </>
    )
}

export default ViewProduct;
