import React from 'react';
import Plus from "../../src/assets/plus.svg";

const ImageUploader = ({
    title,
    files,
    onFileChange,
    onRemoveFile,
    inputRef,
    onClick,
    onDrop,
    multiple = false,
    maxFiles = null
}) => {
    return (
        <div className="drop" onDragOver={(e) => e.preventDefault()} onDrop={onDrop}>
            <div className="Main-image">
                <p>{title}</p>
            </div>
            <div className="drag-drop">
                <div className="drag-drop-heading">
                    <h2>클릭해서 업로드</h2>
                    <p>600x520px, 10mb 이하, jpg/png 권장</p>
                </div>
                <div className="upload" onClick={onClick} style={{ cursor: "pointer" }}>
                    <img src={Plus} alt="Upload" />
                </div>
                <input
                    type="file"
                    multiple={multiple}
                    ref={inputRef}
                    style={{ display: "none" }}
                    onChange={onFileChange}
                />
            </div>
            <div className="file-list" style={{ marginTop: "20px", display: "flex", flexWrap: "wrap" }}>
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
                            onClick={() => onRemoveFile(index)}
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
    );
};

export default ImageUploader; 