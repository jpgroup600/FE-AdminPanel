import React, { useEffect, useRef, useContext } from "react";
import Plus from "../../assets/plus.svg";
import { useState } from "react";
import { basicSettings } from "../../Constants/ConstBasic";
import DaumPostcode from "react-daum-postcode";
import axios from "axios";
import './campaigns.css'
import { BackEndAPI } from "../../BaseURI/BackEndUrI";


const Campaigns = () => {
  const [uploadedImagesNew, setUploadedImagesNEw] = useState([]);
  const [fill, setFill] = useState([]);
  const [tabs, settabs] = useState([]);

  // console.log(token, "token");
  useEffect(() => {
    const fetchHeads = async () => {
      try {
        const response = await axios.get(
          "https://webjacob-c0f6c8e947aa.herokuapp.com/final/getheadings"
        );
        if (!response.status == 200) {
          throw new Error("Failed to fetch banners");
        }

        // console.log(response.data.headings[0]);

        setFill(response.data.headings[0]);
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
      try {
        const response = await axios.get(
          "https://webjacob-c0f6c8e947aa.herokuapp.com/final/getTabs"
        );
        if (!response.status == 200) {
          throw new Error("Failed to fetch Tabs");
        }

        // console.log(response.data.tabs[0].stringsArray);
        settabs(response.data.tabs[0].stringsArray);
        // setFill(response.data.headings[0]);
      } catch {
        console.error("Error fetching Tabs:", error);
      }
    };

    fetchHeads();
  }, []);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const uploadImages = async (fileArray) => {
    const formData = new FormData();

    fileArray.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await axios.post(
        "https://webjacob-c0f6c8e947aa.herokuapp.com/images",
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

  const handleImageClick = () => {
    fileInputRef.current.click();
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

  useEffect(() => {
    // console.log("UserId", localStorage.getItem("userID"));
  });

  const handleSubmit = async () => {
    if (!userData.campaignName || files.length === 0) {
      alert(
        "Please fill in all required fields and upload at least one image."
      );
      return;
    }

    try {
      const derivedData = {
        userId: "",
        email:"",
        campaignName: userData.campaignName,
        isVisitOrShip: activeVisit ? "Visit" : "Ship",
        location: `Sido: ${userData.address?.sido} | Sigungu: ${userData.address?.sigungu} | Address: ${userData.address?.address}`,
        checkDay: activeWeek
          .map((week) => week.charAt(0).toUpperCase() + week.slice(1))
          .join(", "),
        availableTime: `${userData.startTime} - ${userData.endTime}`,
        numberOfPeople: userData.member,
        image:
          `https://webjacob-c0f6c8e947aa.herokuapp.com/${img[0]?.path}` || " ",
        textArea1: userData.Info,
        textArea2: userData.howtoregister,
        textArea3: userData.keywords,
        textArea4: userData.aditionalinfo,
        textArea5: "Additional details",
        channel: activeChanel.join(", "),
        image1:
          `https://webjacob-c0f6c8e947aa.herokuapp.com/${img[1]?.path}` || " ",
        image2:
          `https://webjacob-c0f6c8e947aa.herokuapp.com/${img[2]?.path}` || " ",
        image3:
          `https://webjacob-c0f6c8e947aa.herokuapp.com/${img[3]?.path}` || " ",
        catagory: userData.catagory,
      };
      const response = await fetch(
        
        BackEndAPI+"/admin/add-product",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(derivedData),
        }
      );

      if (response.ok) {
        alert("Added successfully");
      } else {
        alert("Failed to add campaign. Please check the data.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to perform operation: " + error);
    }
  };
  const [modalState, setModalState] = useState(false);
  const [test, settest] = useState(true);

  const [activeVisit, setActiveVisit] = useState(false);
  const [isCompaign, setIsCompaign] = useState(false);
  const [activeChanel, setActiveChanel] = useState([]);
  const [activeWeek, setActiveWeek] = useState([]);
  const [userData, setUserData] = useState(basicSettings);
  useEffect(() => {
    // console.log(userData);
  }, [userData]);

  return (
    <>
      <div className="container mt-5 basic-campian-section 2xl:px-12 lg:px-5">
        <div className=" 2xl:px-12">
          <div className="basic-setting 2xl:px-12 lg:px-0">
            <h2>Campagin</h2>
            <button className="bring-prev">Bring prev campaign</button>
            <button className="reset">reset</button>
          </div>
          <div className="basic-setting-main-page">
            <div className="basic-setting-one flex items-center gap-3">
              <div className="one">
                <span> 1</span>
              </div>
              <div className="basic-setting-headin">
                <h1>Basic settings</h1>
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
                <label>Campaign Name(30letter)</label>
                <input
                  className="input-campaign-name w-full mt-4 h-[50px] px-4 rounded-[5px]"
                  type="text"
                  placeholder="campaign name"
                  value={userData.campaignName}
                  onChange={(e) =>
                    setUserData({ ...userData, campaignName: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="form-data ">
              <div className="form-input-group">
                <label>Service</label>
                <textarea name="Info" id="" rows={10}></textarea>
              </div>
            </div>
            <div className="form-data">
              <div className="form-input-group">
                <label>Category</label>
                <select
                  value={userData.category}
                  onChange={(e) =>
                    setUserData({ ...userData, catagory: e.target.value })
                  }
                  className="w-full mt-4 h-[50px] px-4 rounded-[5px]"
                >
                  {tabs.map((category) => (
                    <option value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            {/* Monday friday*/}

            <div className="chanel-social">
              <h3>가능한 요일</h3>
              <div className="flex justify-between mt-4 gap-1">
                <div
                  className={`${activeWeek.includes("mon") ? "youtube" : "insta"
                    }`}
                  onClick={() => {
                    checkWeek("mon");
                  }}
                >
                  Monday
                </div>

                <div
                  className={`${activeWeek.includes("tue") ? "youtube" : "insta"
                    }`}
                  onClick={() => {
                    checkWeek("tue");
                  }}
                >
                  Tuesday
                </div>

                <div
                  className={`${activeWeek.includes("wen") ? "youtube" : "insta"
                    }`}
                  onClick={() => {
                    checkWeek("wen");
                  }}
                >
                  Wednesday
                </div>

                <div
                  className={`${activeWeek.includes("thur") ? "youtube" : "insta"
                    }`}
                  onClick={() => {
                    checkWeek("thur");
                  }}
                >
                  Thursday
                </div>

                <div
                  className={`${activeWeek.includes("fri") ? "youtube" : "insta"
                    }`}
                  onClick={() => {
                    checkWeek("fri");
                  }}
                >
                  Friday
                </div>

                <div
                  className={`${activeWeek.includes("sat") ? "youtube" : "insta"
                    }`}
                  onClick={() => {
                    checkWeek("sat");
                  }}
                >
                  Saturday
                </div>

                <div
                  className={`${activeWeek.includes("sun") ? "youtube" : "insta"
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
                <label>Start Time</label>
                <input
                  type="time"
                  value={userData.startTime}
                  onChange={(e) =>
                    setUserData({ ...userData, startTime: e.target.value })
                  }
                  className="w-full mt-4 h-[50px] px-4 rounded-[5px]"
                />
              </div>

              <div className="w-1/2 pl-2">
                <label>End Time</label>
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
                  <label>How many members</label>
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
                  <label>(Optional) Points to give out</label>
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
                className={` ship ${activeVisit ? " border-green-500 border-2" : "ship"}`}
                onClick={() => {
                  setActiveVisit(true);
                  console.log(activeVisit);
                  setUserData({ ...userData, campaignType: "visit" });
                }}
              >
                <h4>Visit</h4>
                <p>Visit and reivew</p>
              </div>

              <div
                 className={` ship ${activeVisit ? "ship":" border-green-500 border-2" }`}
                onClick={() => {
                  setActiveVisit(false);
                  console.log(activeVisit);
                  setUserData({ ...userData, campaignType: "ship" });
                }}
              >
                <h4>Ship</h4>
                <p>Get shipping and review</p>
              </div>
            </div>


            {/* 나머지 주소 입력 */}

            {/* Drop */}
            <div
              className="drop"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="Main-image">
                <p>Thumbnail image </p>
              </div>
              <div className="drag-drop">
                <div className="drag-drop-heading">
                  <h2>Drag to upload</h2>
                  <p>600x520px, 10mb 이하, jpg/png 권장</p>
                </div>
                <div
                  className="upload"
                  onClick={handleImageClick}
                  style={{ cursor: "pointer" }}
                >
                  <img src={Plus} alt="Upload" />
                </div>
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </div>
              <div
                className="file-list"
                style={{ marginTop: "20px", display: "flex", flexWrap: "wrap" }}
              >
                {files.map((file, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      background: "#f0f0f0",
                      padding: "5px 10px",
                      margin: "5px",
                      borderRadius: "5px",
                      position: "relative",
                    }}
                  >
                    <span style={{ marginRight: "10px" }}>{file.name}</span>
                    <button
                      onClick={() => handleRemoveFile(index)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#ff6347",
                        fontSize: "16px",
                        cursor: "pointer",
                        position: "absolute",
                        top: "2px",
                        right: "2px",
                      }}
                    >
                      ✖
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div
              className="drop"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="Main-image">
                <p>Main image (Max 5)</p>
              </div>
              <div className="drag-drop">
                <div className="drag-drop-heading">
                  <h2>Drag to upload</h2>
                  <p>600x520px, 10mb 이하, jpg/png 권장</p>
                </div>
                <div
                  className="upload"
                  onClick={handleImageClick}
                  style={{ cursor: "pointer" }}
                >
                  <img src={Plus} alt="Upload" />
                </div>
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </div>
              <div
                className="file-list"
                style={{ marginTop: "20px", display: "flex", flexWrap: "wrap" }}
              >
                {files.map((file, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      background: "#f0f0f0",
                      padding: "5px 10px",
                      margin: "5px",
                      borderRadius: "5px",
                      position: "relative",
                    }}
                  >
                    <span style={{ marginRight: "10px" }}>{file.name}</span>
                    <button
                      onClick={() => handleRemoveFile(index)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#ff6347",
                        fontSize: "16px",
                        cursor: "pointer",
                        position: "absolute",
                        top: "2px",
                        right: "2px",
                      }}
                    >
                      ✖
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* text area  */}
            <div className="form-data ">
              <div className="form-input-group">
                <label>Info</label>
                <textarea
                  value={fill.field1}
                  name="Info"
                  id=""
                  className="w-full mt-4 h-[50px] px-4 rounded-[5px] border"
                  rows={10}
                  onChange={(e) => {
                    setFill({ ...fill, field1: e.target.value });
                    setUserData({ ...userData, Info: e.target.value });
                  }}
                ></textarea>
              </div>
            </div>

            <div className="form-data ">
              <div className="form-input-group">
                <label>How to Register</label>
                <textarea
                  name="How to Register"
                  id=""
                  rows={10}
                  className="w-full mt-4 h-[50px] px-4 rounded-[5px] border"
                  value={fill.field2}
                  onChange={(e) => {
                    setFill({ ...fill, field2: e.target.value });
                    setUserData({ ...userData, howtoregister: e.target.value });
                  }}
                ></textarea>
              </div>
            </div>

            <div className="form-data ">
              <div className="form-input-group">
                <label>Mission</label>
                <textarea
                  name="Mission"
                  value={fill.field3}
                  id=""
                  className="w-full mt-4 h-[50px] px-4 rounded-[5px] border"
                  rows={10}
                  onChange={(e) => {
                    setFill({ ...fill, field3: e.target.value });
                    setUserData({ ...userData, mission: e.target.value });
                  }}
                ></textarea>
              </div>
            </div>

            <div className="form-data ">
              <div className="form-input-group">
                <label>Keywords</label>
                <textarea
                  name="Keywords"
                  value={fill.field4}
                  id=""
                  className="w-full mt-4 h-[50px] px-4 rounded-[5px] border"
                  rows={10}
                  onChange={(e) => {
                    setFill({ ...fill, field4: e.target.value });
                    setUserData({ ...userData, keywords: e.target.value });
                  }}
                ></textarea>
              </div>
            </div>

            <div className="form-data ">
              <div className="form-input-group">
                <label>Aditional Info</label>
                <textarea
                  name="Aditional Info"
                  value={fill.field5}
                  id=""
                  className="w-full mt-4 h-[50px] px-4 rounded-[5px] border"
                  rows={10}
                  onChange={(e) => {
                    setFill({ ...fill, field5: e.target.value });
                    setUserData({ ...userData, aditionalinfo: e.target.value });
                  }}
                ></textarea>
              </div>
            </div>
            {/* Adress to visit */}
            <div className="Adress_to_visit">
              <div className="address_to_visit_para">
                <p>Adress to visit</p>
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
              <h3>Chanel</h3>
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
                  className={`${activeChanel.includes("etc") ? "youtube" : "insta"
                    }`}
                  onClick={() => {
                    checkChanel("Tiktok");
                  }}
                >
                  Tiktok
                </div>
              </div>
            </div>

            {/* End */}
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
        </div>
      </div>
    </>
  );
};

export default Campaigns