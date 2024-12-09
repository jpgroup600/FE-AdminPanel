import React, { useState, useEffect } from "react";
import { Button, InputGroup, FormControl } from "react-bootstrap";
import SideBar from "../../Components/SideBar/SideBar";
import "./Categories.css";
import axios from "axios";
import { BackEndAPI } from "../../BaseURI/BackEndUrI";
import axiosInstance from "../../../helper/axiosInstance";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DOMPurify from 'dompurify';

const Categories = () => {
  // State for image upload
  const [imageNames, setImageNames] = useState([]);

  // State for title and tabs management
  const [title, setTitle] = useState("");
  const [titleList, setTitleList] = useState([]);
  const [tabName, setTabName] = useState("");
  const [tabList, setTabList] = useState([]);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitleIndex, setEditingTitleIndex] = useState(null);
  const [isEditingTab, setIsEditingTab] = useState(false);
  const [editingTabIndex, setEditingTabIndex] = useState(null);
  const [ref, setref] = useState(false);
  const [urls, setUrls] = useState([]); // To store uploaded image URLs
  const [filex, setfilex] = useState(); // To store uploaded image URLs
  const [banners, setbanners] = useState([]); // To store uploaded image URLs
  const [addTab, setAddTab] = useState("");


  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],  // dropdown with colors
      [{ 'font': [] }],
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ]
  };

  const fieldNames = {
    1: "제공 내역",
    2: "방문 및 예약안내",
    3: "캠페인 미션",
    4: "키워드",
    5: "추가 안내사항",
  }

  useEffect(() => {
    const getData = async () => {
      const res = await axios.get(`${BackEndAPI}/tabs/getTab`);
      const arrayData = Array.isArray(res.data.data[0].stringsArray)
        ? res.data.data[0].stringsArray
        : Array.from(res.data.data[0].stringsArray || []);

      setTabList(arrayData);
      const res2 = await axios.get(`${BackEndAPI}/heading/fields/`);

      const head = [];
      head.push(
        res2.data?.field1,
        res2.data?.field2,
        res2.data?.field3,
        res2.data?.field4,
        res2.data?.field5
      );
      const bannersx = await axios.get(`${BackEndAPI}/adminroutes/allBanners`);
      console.log("res2", res2?.data);
      console.log(bannersx.data.images);

      setbanners(bannersx.data.images); // Set the 'images' array to the state
      // const arrayData2 = Array.isArray(res.data.data[0].stringsArray)
      //   ? res.data.data[0].stringsArray
      //   : Array.from(res.data.data[0].stringsArray || []);
      setTitleList(head);
    };

    getData();
  }, [ref]);
  // Functions for image upload
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const fileNames = files.map((file) => file.name);
    setImageNames(fileNames);
    setfilex(files);
  };

  const handleSubmitImages = () => {
    const formData = new FormData();
    filex.forEach((file) => {
      formData.append("images", file); // 'images' should match the field name on the server
    });

    // Send files via Axios
    axiosInstance
      .post(
        "/images/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set content type to multipart/form-data
          },
        }
      )
      .then((response) => {
        // Assuming the server responds with an array of URLs
        setUrls(response.data.uploadedImages); // Set uploaded image URLs in state

        axiosInstance
          .post(
            "/images/save",
            { links: response.data.uploadedImages },
            {}
          )
          .then((response) => {
            if (response.status == 201) {
              alert("Files submitted successfully!");
              setref(!ref);
            } else {
              alert("Failed to Upload files!");
            }
          });
      })
      .catch((error) => {
        alert("Error Uploading...");
        console.error("Error uploading files:", error);
      });
  };
  const updateOnBackend = async (f) => {
    const data = {
      field1: f[0] ? f[0] : "...",
      field2: f[1] ? f[1] : "...",
      field3: f[2] ? f[2] : "...",
      field4: f[3] ? f[3] : "...",
      field5: f[4] ? f[4] : "...",
    };
    try {
      const res = await axios.post(`${BackEndAPI}/heading/fields/update`, data);
      if (res.status === 200) {
        setref(!ref);
        alert("변경이 완료됬습니다");
      }
    } catch (err) {
      alert("Failed to update titles, Empty fields are not not allowed");
    }
  };
  const handleDeleteImg = async (id) => {
    const img = await axios.post(`${BackEndAPI}/adminroutes/delImg`, {
      id: id,
    });
    if (img.status === 200) {
      alert("Image Deleted Successfully ");
      setref(!ref);
    } else {
      alert("Failed to delete Image");
    }
  };
  // Functions for title management
  const handleAddTitle = () => {
    if (title.trim() === "") {
      alert("Title cannot be empty!");
      return;
    }

    if (isEditingTitle) {
      const updatedTitles = [...titleList];
      updatedTitles[editingTitleIndex] = title;
      setTitleList(updatedTitles);
      setIsEditingTitle(false);
      setEditingTitleIndex(null);
      updateOnBackend(updatedTitles);
    } else {
      alert("Only 5 Fields are allowed!");
    }
    setTitle("");
  };

  const handleEditTitle = (index) => {
    setTitle(titleList[index]);
    setEditingTitleIndex(index);
    setIsEditingTitle(true);
  };

  const handleDeleteTitle = async (index) => {
    const updatedTitles = titleList.filter((_, i) => i !== index);

    try {
      const res = await axios.post(`${BackEndAPI}/heading/fields/delete`, {
        field: "field" + [index + 1],
      });
      if (res.status === 200) {
        setref(!ref);
      }
    } catch (err) {
      console.log(err);
      alert("Failed to delete title");
    }
  };

  // Functions for tab management
  const handleAddTab = async () => {
    if (tabName.trim() === "" && addTab.trim() === "") {
      alert("Tab name cannot be empty!");
      return;
    }

    let data;
    if (tabList.length > 0) {
      data = tabList + "," + tabName;
    } else {
      data = tabName;
    }

    if (addTab.length > 0) {
      data = tabList + "," + addTab;
    } else {
      data = addTab;
    }

    console.log(data);
    const res = await axios.post(`${BackEndAPI}/tabs/array`, { strings: data });
    if (res.status == 200) {
      alert("Tab added successfully");
      setref(!ref);
      setTabName("");
    } else {
      alert("Failed to add tab");
      setTabName("");
    }
  };

  const handleEditTab = (index) => {
    setTabName(tabList[index]);
    setEditingTabIndex(index);
    setIsEditingTab(true);
  };

  const handleDeleteTab = async (index) => {
    const updatedTabs = tabList.filter((_, i) => i !== index);

    const res = await axios.post(`${BackEndAPI}/tabs/deleteTab`, {
      tabValue: tabList[index],
    });
    if (res.status === 200) {
      setref(!ref);
    }
  };

  return (
    <>
      <SideBar />
      <div className="page-content">
        {/* Upload Banner Images Section */}
        <h1 className="upload-heading">Upload Banner Images</h1>
        <div
          className="centered-container"
          style={{
            flexDirection: "row",
            minWidth: "80%",
            justifyContent: "space-around",
          }}
        >
          <div>
            <Button
              variant="primary"
              as="label"
              htmlFor="image-upload"
              className="upload-button"
            >
              Upload Images
            </Button>
            <input
              type="file"
              id="image-upload"
              multiple
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />

            <div className="image-names-scroll">
              <ul className="image-names-list">
                {imageNames.map((name, index) => (
                  <li key={index}>{name}</li>
                ))}
              </ul>
            </div>

            <Button
              variant="success"
              onClick={handleSubmitImages}
              className="submit-button"
            >
              Submit Files
            </Button>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            {banners.map((b, index) => (
              <div key={index} className="banner-item">
                <img
                  src={b.url.replace(
                    "http://localhost:8080",
                    "https://admin-backend-jacob-627c227daad2.herokuapp.com"
                  )}
                  alt="banner"
                  style={{ height: "50px", width: "auto" }}
                />
                <div style={{ marginTop: 5 }} className="banner-actions">
                  <Button
                    onClick={() => {
                      handleDeleteImg(b._id);
                    }}
                    style={{ width: 50, fontSize: 10 }}
                    className="delete-banner-button"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Full-width container for Titles and Tabs management */}
        <div className="full-width-container">
          {/* Left container for Add Tabs */}
          <div className="left-container">
            <h2 className="section-heading">카테고리 설정</h2>

            <InputGroup className="mb-3">
              <FormControl
                as="textarea"
                placeholder="카테고리 이름 입력"
                value={addTab}
                onChange={(e) => setAddTab(e.target.value)}
                rows={8} // Set default height with rows
                style={{ resize: "vertical", overflowY: "auto", height: 65 }} // Allow resizing and scrolling
                aria-multiline="true"
              />
              
              <Button
                style={{ height: 65 }} // Allow resizing and scrolling
                onClick={handleAddTab}
                className="add-tab-button"
              >
                추가
              </Button>
            </InputGroup>

            
            <InputGroup className="mb-3">
              <FormControl
                as="textarea"
                placeholder="카테고리 수정"
                value={tabName}
                onChange={(e) => setTabName(e.target.value)}
                rows={8} // Set default height with rows
                style={{ resize: "vertical", overflowY: "auto", height: 65 }} // Allow resizing and scrolling
                aria-multiline="true"
              />
              
              <Button
                style={{ height: 65 }} // Allow resizing and scrolling
                onClick={handleAddTab}
                className="add-tab-button"
              >
                수정
              </Button>
            </InputGroup>

            <div className="tab-list">
              {tabList.map((tab, index) => (
                <div key={index} className="tab-item">
                  <div className="tab-container">
                    <span className="tab-text">{tab}</span>
                    <div className="tab-actions">
                      <Button
                        onClick={() => handleEditTab(index)}
                        className="edit-tab-button"
                      >
                        수정
                      </Button>
                      <Button
                        onClick={() => handleDeleteTab(index)}
                        className="delete-tab-button"
                      >
                        삭제
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right container for Add Title */}
          <div className="right-container">
            <h2 className="section-heading">안내 문구 설정</h2>
            {isEditingTitle ?  (
            <InputGroup className="mb-3">
              {/* <FormControl
                as="textarea"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                rows={10} // Set default height with rows
                style={{ resize: "vertical", overflowY: "auto", height: 65 }}
                aria-multiline="true"
              /> */}

              <ReactQuill modules={modules} value={title} onChange={(e) => setTitle(e)}
                style={{ resize: "vertical", overflowY: "auto", height: 300 }}
              />



              <Button
                style={{ height: 30, marginTop: 10 , width: "100%"  , display: "flex", justifyContent: "center", alignItems: "center"}}
                onClick={handleAddTitle}
                className="add-title-button"
              >
                변경
              </Button>
             


            </InputGroup>
            ) : (<></>)}

            <div className="title-list">
              {titleList.map((item, index) => (
                <div key={index} className="title-item">
                  <div className="field-container">
                    <div style={{display: "flex",width: "100%", justifyContent: "space-between", alignItems: "end"}}>
                    <div style={{fontSize: 16, fontWeight: "bold" , marginBottom: 10}}>{fieldNames[index+1]}</div>
                    <Button
                        onClick={() => handleEditTitle(index)}
                        className="edit-title-button"
                      >
                        수정
                      </Button>
                      </div>
                    <div
                    
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item) }}
                      className="rich-text-content"
                    />
                    <div className="title-actions">
                      
                      {/* <Button
                        onClick={() => handleDeleteTitle(index)}
                        className="delete-title-button"
                      >
                        Delete
                      </Button> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Categories;
