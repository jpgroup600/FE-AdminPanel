import React, { useEffect, useRef, useContext } from "react";
import Plus from "../../../src/assets/plus.svg";
import { useState } from "react";
import { basicSettings } from "../../Constants/ConstBasic";
import DaumPostcode from "react-daum-postcode";
import axios from "axios";
import './campaigns.css'
import { BackEndAPI } from "../../BaseURI/BackEndUrI";
import ImageUploader from "../../Components/ImageUploader";
import { useNavigate } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './Main.scss'
import apiUrl from "../../hooks/apiUrl";
import Select from 'react-select';




const Campaigns = () => {
  const [uploadedImagesNew, setUploadedImagesNEw] = useState([]);
  const [fill, setFill] = useState([]);
  const [tabs, settabs] = useState([]);
  const [thumbnailFiles, setThumbnailFiles] = useState([]);
  const [mainFiles, setMainFiles] = useState([]);
  const thumbnailInputRef = useRef(null);
  const mainInputRef = useRef(null);

  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [thumbnailPath, setThumbnailPath] = useState([]);
  const [mainImagePaths, setMainImagePaths] = useState([]);
  const [allMerchants, setAllMerchants] = useState({});
  const [selectedMerchant, setSelectedMerchant] = useState(null);

  const MainMaxFiles = 5;
  const ThumbnailMaxFiles = 3;
  // console.log(token, "token");

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],  // dropdown with colors
      [{ 'font': [] }],
      [{ 'align': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ]
  };



  const handleMainFileChange = async (event, setFilesState, fileState, setImagepathState, maxFiles) => {
    const newFiles = Array.from(event.target.files);
    console.log("mainFiles", fileState);
    if (fileState.length + newFiles.length <= maxFiles) {
      setFilesState([...fileState, ...newFiles]);

      try {
        const uploadedFiles = await uploadImages(newFiles);
        console.log("uploadedFiles", uploadedFiles);

        if (uploadedFiles) {
          const newPaths = uploadedFiles.files.map(file => apiUrl + "/" + file.path)
          setImagepathState(prev => [...prev, ...newPaths]);
          console.log("newPaths", newPaths)

        }
      }

      catch (error) {
        console.error("Upload failed:", error);
      }

    }

    else {
      alert(`최대 이미지 ${maxFiles} 까지만 업로드 가능합니다`);
    }

  };

  const fetchAllMerchants = async () => {
    try {
      const response = await axios.get(`${BackEndAPI}/adminroutes/get-all-merchants`);
      if (response.status !== 200) {
        throw new Error("Failed to fetch merchants");
      }
      console.log("response", response.data);
      setAllMerchants(response.data);
    } catch (error) {
      console.error("Error fetching merchants:", error);
    }
  }

  const fetchHeads = async () => {
    try {
      const response = await axios.get(`${apiUrl}/final/getheadings`);
      if (response.status !== 200) {
        throw new Error("Failed to fetch banners");
      }
      
      // Set the state once with all the data
      const headingsData = response.data.headings[0];
      console.log("Setting initial data:", headingsData);
      setFill(headingsData);
       // Get tabs data
      const tabsResponse = await axios.get(`${apiUrl}/final/getTabs`);
      if (tabsResponse.status !== 200) {
        throw new Error("Failed to fetch Tabs");
      }
      settabs(tabsResponse.data.tabs[0].stringsArray);
     } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    

    fetchHeads();
    fetchAllMerchants();
    console.log("Component mounted - fetching data");
  }, []);

  useEffect (() => {
    console.log("Fill state changed:", {
      time: new Date().toISOString(),
      data: fill,
      dataKeys: fill ? Object.keys(fill) : []
    });
  }, [fill])


  const uploadImages = async (fileArray) => {
    const formData = new FormData();

    fileArray.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await axios.post(
        `${apiUrl}/images`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Images uploaded successfully:", response.data.files);
      console.log("Uploaded Images:", response.data.files);
      setUploadedImagesNEw(response.data.files);

      console.log("FileNames in state", uploadedImagesNew);
      // Handle the response data as needed here
      return response.data;
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };
  const formRef = useRef();
  const handleReset = () => {
    formRef.current.reset();
  };
  const [img, setimg] = useState([]);
  useEffect(() => {
    // console.log("Files in state useEffect", uploadedImagesNew);
    setimg(uploadedImagesNew);
  }, [uploadedImagesNew]);

  const handleFileChange = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);

    try {
      const uploadedData = await uploadImages(selectedFiles);
      console.log("Response after uploading:", uploadedData);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleImageClick = (ref) => {
    ref.current.click();
  };
  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const newFiles = Array.from(event.dataTransfer.files);
    newFiles.forEach((file) => uploadImages(file));
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleRemoveFile = (indexToRemove) => {
    setFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const InputItems = {
    width: "514px",
    background: "transparent ",
    border: "1px solid #ccc",
  };

  const basicInfo = {
    marginTop: "170px",
  };

  const handleOpenModal = () => {
    setModalState(false);
  };

  //check chanel state
  const checkChanel = (input_chanel) => {
    if (activeChanel.includes(input_chanel)) {
      setActiveChanel(activeChanel.filter((chanel) => chanel !== input_chanel));
      setUserData({
        ...userData,
        chanel: activeChanel.filter((chanel) => chanel !== input_chanel),
      });
    } else {
      setActiveChanel([...activeChanel, input_chanel]);
      setUserData({ ...userData, chanel: [...activeChanel, input_chanel] });
    }
  };

  const checkWeek = (input_week) => {
    if (activeWeek.includes(input_week)) {
      setActiveWeek(activeWeek.filter((week) => week !== input_week));
      setUserData({
        ...userData,
        week: activeWeek.filter((week) => week !== input_week),
      });
    } else {
      setActiveWeek([...activeWeek, input_week]);
      setUserData({ ...userData, week: [...activeWeek, input_week] });
    }
  };

  // function for cheking daum map api
  const onCompletePost = (data) => {
    setModalState(false);
    setUserData({
      ...userData,
      address: {
        address: data.address,
        sido: data.sido,
        sigungu: data.sigungu,
      },
    });
  };


  const handleSubmit = async () => {
    if (!userData.campaignName || mainImagePaths.length === 0 || thumbnailPath.length === 0) {
      alert(
        "내용 혹은 사진이 입력되지 않았습니다 해당 항목을 다 입력해주세요"
      );
      return;
    }

    try {
      const derivedData = {
        service: userData.service,
        businessName: selectedMerchant?.businessName,
        email: selectedMerchant?.email,
        campaignName: userData.campaignName,
        isVisitOrShip: activeVisit ? "Visit" : "Ship",
        location: userData.address,
        checkDay: activeWeek
          .map((week) => week.charAt(0).toUpperCase() + week.slice(1))
          .join(", "),
        availableTime: `${userData.startTime} - ${userData.endTime}`,
        numberOfPeople: userData.member,
        image:
          thumbnailPath || " ",
        textArea1: fill.field1,
        textArea2: fill.field2,
        textArea3: fill.field3,
        textArea4: fill.field4,
        textArea5: fill.field5,
        channel: activeChanel.join(", "),
        image1: mainImagePaths || " ",
        catagory: userData.catagory,
        token: ""
      };

      const response = await fetch(
        `${BackEndAPI}/products/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(derivedData),
        }
      );

      if (response.ok) {
        alert("캠페인이 정상적으로 등록되었습니다 관리자가 확인 진행중입니다");
        // navigate("/");
      } else {
        alert("캠페인 등록에 실패하였습니다 다시 시도해주세요");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to perform operation: " + error);
    }
  };
  const [modalState, setModalState] = useState(false);
  const [test, settest] = useState(true);

  const [activeVisit, setActiveVisit] = useState(true);
  const [isCompaign, setIsCompaign] = useState(false);
  const [activeChanel, setActiveChanel] = useState([]);
  const [activeWeek, setActiveWeek] = useState([]);
  const [userData, setUserData] = useState(basicSettings);
  useEffect(() => {
    // console.log(userData);
  }, [userData]);

  const options = allMerchants?.merchants?.map((merchant) => ({
    value: merchant,
    label: `${merchant.businessName} - ${merchant.name}`
  }));

  return (
    <>
      <div className="container mt-5 basic-campian-section 2xl:px-12 lg:px-5">
        <div className=" 2xl:px-12">
          <div className="basic-setting 2xl:px-14 lg:px-2">
            <h2>캠페인 설정</h2>

            <button className="reset">초기화</button>
          </div>
          <div className="basic-setting-main-page">
            <div className="basic-setting-one flex items-center gap-3">
              <div className="one">
                <span> 1</span>
              </div>
              <div className="basic-setting-headin">
                <h1>기본 설정</h1>
              </div>
              <div
                className="last-basic flex items-center gap-2 justify-center"
                style={{
                  whiteSpace: "normal",
                  overflow: "visible",
                  wordWrap: "break-word",
                  maxWidth: "none",
                  width: "auto",
                }}
              >
                <p>필수</p>
              </div>
            </div>

            <div className="form-data ">
              <div className="">
                

                <label className="mr-8">등록할 사용자</label>
                <Select
            className="mb-4"
            options={options}
            onChange={(selected) => {
              setSelectedMerchant(selected.value);
              console.log("selected", selected.value);
            }}
            placeholder="검색하세요..."
            isSearchable={true}
            styles={{
              control: (baseStyles) => ({
                ...baseStyles,
                height: '50px',
                borderColor: '#e5e7eb',
                              borderRadius: '5px'
                            })
                          }}
                />


                <label>상품명</label>
                <input
                  className="input-campaign-name w-full mt-4 h-[50px] px-4 rounded-[5px]"
                  type="text"
                  placeholder="캠페인 이름 설정"
                  value={userData.campaignName}
                  onChange={(e) =>
                    setUserData({ ...userData, campaignName: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="form-data ">
              <div className="form-input-group">
                <label>서비스명</label>
                <textarea name="Info" id="" rows={10} value={userData.service} onChange={(e) =>
                  setUserData({ ...userData, service: e.target.value })
                }></textarea>
              </div>
            </div>
            <div className="form-data">
              <div className="form-input-group">
                <label>카테고리 설정</label>
                <select
                  value={userData.category}
                  onChange={(e) =>
                    setUserData({ ...userData, catagory: e.target.value })
                  }
                  className="w-full mt-4 h-[50px] px-4 rounded-[5px]"
                >
                  {tabs.map((category,index) => (
                    <option value={category} key={`${category}-${index}`}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            {/* Monday friday*/}

            <div className="chanel-social">
              <h3>가능한 요일</h3>
              <div className="flex justify-between mt-4">
                <div
                  className={`${activeWeek.includes("mon") ? "weekend-active" : "weekend"
                    }`}
                  onClick={() => {
                    checkWeek("mon");
                  }}
                >
                  Monday
                </div>

                <div
                  className={`${activeWeek.includes("tue") ? "weekend-active" : "weekend"
                    }`}
                  onClick={() => {
                    checkWeek("tue");
                  }}
                >
                  Tuesday
                </div>

                <div
                  className={`${activeWeek.includes("wen") ? "weekend-active" : "weekend"
                    }`}
                  onClick={() => {
                    checkWeek("wen");
                  }}
                >
                  Wednesday
                </div>

                <div
                  className={`${activeWeek.includes("thur") ? "weekend-active" : "weekend"
                    }`}
                  onClick={() => {
                    checkWeek("thur");
                  }}
                >
                  Thursday
                </div>

                <div
                  className={`${activeWeek.includes("fri") ? "weekend-active" : "weekend"
                    }`}
                  onClick={() => {
                    checkWeek("fri");
                  }}
                >
                  Friday
                </div>

                <div
                  className={`${activeWeek.includes("sat") ? "weekend-active" : "weekend"
                    }`}
                  onClick={() => {
                    checkWeek("sat");
                  }}
                >
                  Saturday
                </div>

                <div
                  className={`${activeWeek.includes("sun") ? "weekend-active" : "weekend"
                    }`}
                  onClick={() => {
                    checkWeek("sun");
                  }}
                >
                  Sunday
                </div>
              </div>
            </div>

            {/* Time */}
            <div className="form-data flex">
              <div className="w-1/2 pr-2">
                <label>가능 시간</label>
                <input
                  type="time"
                  value={userData.startTime}
                  onChange={(e) => {
                    setUserData({ ...userData, startTime: e.target.value })
                    console.log(e.target.value)
                  }}
                  className="w-full mt-4 h-[50px] px-4 rounded-[5px]"
                />
              </div>

              <div className="w-1/2 pl-2">
                <label>~ 까지</label>
                <input
                  type="time"
                  value={userData.endTime}
                  onChange={(e) =>
                    setUserData({ ...userData, endTime: e.target.value })
                  }
                  className="w-full mt-4 h-[50px] px-4 rounded-[5px]"
                />
              </div>
            </div>

            {/* how many membmers */}
            <div className="form-data">
              <div className="flex justify-between">
                <div className="form-input-group mt-12">
                  <label>신청 가능 인원수</label>
                  <div className="member-input">
                    <span
                      className="plus-minus-btn"
                      onClick={() => {
                        if (userData.member > 1) {
                          setUserData({
                            ...userData,
                            member: userData.member - 1,
                          });
                        }
                      }}
                      style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "black",
                      }}
                    >
                      -
                    </span>
                    <p>{userData.member}</p>
                    <span
                      className="plus-minus-btn"
                      onClick={() => {
                        if (userData.member < 100) {
                          setUserData({
                            ...userData,
                            member: userData.member + 1,
                          });
                        }
                      }}
                      style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "black",
                      }} // Adjust font size as desired
                    >
                      +
                    </span>
                  </div>
                  <span className="mt-2">range of 1~100</span>
                </div>

                <div className="form-input-group mt-12">
                  <label>(현재 불가능) 나눠줄 포인트 </label>
                  <div
                    className="zero-input"
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <strong style={{ color: "#9E9E9E", marginRight: "8px" }}>
                      0
                    </strong>
                    <input
                      type="number"
                      disabled={true}
                      className="zero-input-number"
                      value={userData.points}
                      onChange={(e) =>
                        setUserData({ ...userData, points: e.target.value })
                      }
                      style={{
                        width: "60px",
                        padding: "5px",
                        textAlign: "center",
                      }}
                    />
                    <strong style={{ marginLeft: "8px" }}>p</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* basic */}
            <div
              style={{ marginTop: "10%" }}
              className="basic-setting-one flex items-start gap-3"
            >
              <div className="one">
                <span> 2</span>
              </div>

              <div className="basic-setting-headin flex flex-col">
                <h1 className="font-bold">Campaign info</h1>
                <h3
                  style={{
                    fontWeight: 400,
                    marginTop: "25%",
                    marginLeft: "-25%",
                  }}
                  className="font-bold"
                >
                  Campaign info2
                </h3>
              </div>

              <div
                className="last-basic flex items-center gap-2 justify-center"
                style={{
                  whiteSpace: "normal",
                  overflow: "visible",
                  wordWrap: "break-word",
                  maxWidth: "none",
                  width: "auto",
                  marginTop: 10,
                }}
              >
                <p>필수</p>
              </div>
            </div>

            {/* Visit */}

            <div className="flex justify-between">
              <div
                className={` ${activeVisit ? "visti" : "ship"}`}
                onClick={() => {
                  setActiveVisit(true);
                  console.log(activeVisit);
                  setUserData({ ...userData, campaignType: "visit" });
                }}
              >
                <h4>방문</h4>
                <p>방문 후 리뷰</p>
              </div>

              <div
                className={` ${activeVisit ? "ship" : "visti"}`}
              // onClick={() => {
              //   setActiveVisit(false);
              //   console.log(activeVisit);
              //   setUserData({ ...userData, campaignType: "ship" });
              // }}
              >
                <h4>배송</h4>
                <p>배송 후 리뷰</p>
              </div>
            </div>


            {/* 나머지 주소 입력 */}

            {/* Drop */}

            <ImageUploader
              title="썸네일 이미지를 넣어주세요 (최대 3개)"
              onClick={() => { handleImageClick(thumbnailInputRef) }}
              files={thumbnailFiles}
              inputRef={thumbnailInputRef}
              onFileChange={(event) => handleMainFileChange(event, setThumbnailFiles, thumbnailFiles, setThumbnailPath, ThumbnailMaxFiles)}
              multiple={true}
              maxFiles={ThumbnailMaxFiles}
            >

            </ImageUploader>

            <ImageUploader
              title="상세 이미지를 넣어주세요 (최대 5개)"
              onClick={() => { handleImageClick(mainInputRef) }}
              files={mainFiles}
              inputRef={mainInputRef}
              onFileChange={(event) => handleMainFileChange(event, setMainFiles, mainFiles, setMainImagePaths, MainMaxFiles)}
              multiple={true}
              maxFiles={MainMaxFiles}
            >

            </ImageUploader>



            {/* text area  */}
            <div className="form-data ">
              <div className="form-input-group">
                <label>제공 내역</label>
                <ReactQuill
                  modules={modules}
                  style={{ resize: "vertical", overflowY: "auto", height: "200px" }}
                  value={fill?.field1}
                  onChange={(e) => {
                    setFill(prevFill => ({
                      ...prevFill,  // Keep all existing fields
                      field1: e     // Update only field1
                    }));
                    setUserData(prevData => ({
                      ...prevData,
                      field1: e
                    }));
                  }}d
                  
                >
                </ReactQuill>

              </div>
            </div>

            <div className="form-data ">
              <div className="form-input-group">
                <label>방문 및 예약 안내</label>
                <ReactQuill
                  modules={modules}
                  style={{ resize: "vertical", overflowY: "auto", height: "200px" }}
                  value={fill?.field2}
                  onChange={(e) => {
                    setFill(prevFill => ({
                      ...prevFill,
                      field2: e
                    }));
                    setUserData(prevData => ({
                      ...prevData, field2: e }));
                  }}
                  
                ></ReactQuill>
              </div>
            </div>

            <div className="form-data ">
              <div className="form-input-group">
                <label>캠페인 미션</label>
                <ReactQuill
                  modules={modules}
                  style={{ resize: "vertical", overflowY: "auto", height: "200px" }}
                  value={fill?.field3}
                  onChange={(e) => {
                    setFill(prevFill => ({
                      ...prevFill,
                      field3: e
                    }));
                    setUserData(prevData => ({
                      ...prevData, field3: e }));
                  }}
                ></ReactQuill>
              </div>
            </div>

            <div className="form-data ">
              <div className="form-input-group">
                <label>키워드</label>
                
                <ReactQuill
                  modules={modules}
                  style={{ resize: "vertical", overflowY: "auto", height: "200px" }}
                  value={fill?.field4}
                  onChange={(e) => {
                    setFill(prevFill => ({
                      ...prevFill,
                      field4: e
                    }));
                    setUserData(prevData => ({
                      ...prevData, field4: e }));
                  }}
                ></ReactQuill>
              </div>
            </div>

            <div className="form-data ">
              <div className="form-input-group">
                <label>추가 안내사항</label>
                <ReactQuill
                  modules={modules}
                  style={{ resize: "vertical", overflowY: "auto", height: "200px" }}
                  value={fill?.field5}
                  onChange={(e) => {
                    setFill(prevFill => ({
                      ...prevFill,
                      field5: e
                    }));
                    setUserData(prevData => ({
                      ...prevData, field5: e }));
                  }}
                ></ReactQuill>
              </div>
            </div>
            {/* Adress to visit */}
            <div className="Adress_to_visit">
              <div className="address_to_visit_para">
                <p>업소 위치</p>
              </div>
              <div
                className="address-one mt-3 px-5"
                onClick={() => {
                  setModalState(true);
                }}
              >
                <span style={{ color: "#9E9E9E" }}>
                  {userData.address.address
                    ? userData.address.address
                    : "주소 설정"}
                </span>
                <span>| {"    "}주소 검색</span>
                {modalState && (
                  <div className="modal">
                    <div
                      style={{
                        position: "relative",
                        width: "400px",
                        height: "500px",
                      }}
                    >
                      <DaumPostcode
                        autoClose={true}
                        style={{
                          width: "100%",
                          height: "100%",
                        }}
                        onComplete={onCompletePost}
                      />
                      <button
                        onClick={handleOpenModal}
                        style={{
                          marginTop: "10px",
                          padding: "8px 16px",
                          backgroundColor: "#f00",
                          color: "#fff",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                          display: "block",
                          width: "100%",
                        }}
                      >
                        <div> </div>
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <input
              type="text"
              placeholder="나머지 주소 입력"
              className="last-container mt-2"
              onChange={(e) => {
                setUserData({
                  ...userData,
                  address: {
                    ...userData.address,
                    detailAddress: e.target.value,
                  },
                });
              }}
            ></input>

            {/* Chanel  youtube active insta inactive*/}
            <div className="chanel-social">
              <h3>흥보 채널</h3>
              <div className="flex justify-between mt-4">
                <div
                  className={`${activeChanel.includes("youtube") ? "youtube" : "insta"
                    }`}
                  onClick={() => {
                    checkChanel("youtube");
                  }}
                >
                  Youtube
                </div>

                <div
                  className={`${activeChanel.includes("instagram") ? "youtube" : "insta"
                    }`}
                  onClick={() => {
                    checkChanel("instagram");
                  }}
                >
                  instagram
                </div>

                <div
                  className={`${activeChanel.includes("blog") ? "youtube" : "insta"
                    }`}
                  onClick={() => {
                    checkChanel("blog");
                  }}
                >
                  Blog
                </div>

                <div
                  className={`${activeChanel.includes("web") ? "youtube" : "insta"
                    }`}
                  onClick={() => {
                    checkChanel("web");
                  }}
                >
                  Web
                </div>

                <div
                  className={`${activeChanel.includes("tiktok") ? "youtube" : "insta"
                    }`}
                  onClick={() => {
                    checkChanel("tiktok");
                  }}
                >
                  Tiktok
                </div>
              </div>
            </div>

            {/* End */}
          </div>
        </div>
        <div
          className="2xl:px-12  mt-10 mb-12"
          style={{ paddingBottom: "90px" }}
        >
          <div className="flex justify-between max-w-[1220px] mx-auto ">
            <div className="bottom-btn-one cursor-pointer ">
              <p>캠페인 미리보기</p>
            </div>
            <div
              className="bottom-btn-two cursor-pointer	"
              onClick={handleSubmit}
            >
              <p>캠페인 등록하기</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Campaigns;