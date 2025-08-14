import React, { useState } from 'react';
import Modal from 'react-modal';
import trash from '../asset/trash.png';
import addpiccomponent from '../asset/addpiccomponent.png';
import { FiAlertOctagon } from "react-icons/fi";

export const ModalDelete = ({ isOpen, onRequestClose, title, message, onConfirm }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Confirmation Modal"
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)'
                },
                content: {
                    width: '50%',
                    height: '20%',
                    margin: 'auto',
                    zIndex: 999999,
                    borderRadius: 10,
                    padding: 20,
                },
            }}
        >
            <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", flexDirection: "rox" }}>
                    <img
                        src={trash} alt="Trash Icon" style={{ width: 35, height: 38 }}
                    />
                    <div style={{ display: "flex", flexDirection: "column", paddingLeft: 20 }}>
                        <div style={{ fontFamily: "Prompt-Medium", fontSize: 22, }}>
                            {title}
                        </div>
                        <div style={{ marginTop: 10 }}>
                            <div style={{ fontFamily: "Prompt-Light", fontSize: 22, }}>
                                {message}
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 30, flexDirection: "row" }}>
                    <div onClick={onRequestClose} style={{ borderRadius: 10, color: "#66AB65", padding: '10px 20px', cursor: "pointer", fontFamily: "Prompt-Light", fontSize: 20, marginRight: 16, borderWidth: 3, borderColor: "#66AB65", borderStyle: "solid" }}>
                        ยกเลิก
                    </div>
                    <div onClick={onConfirm} style={{ backgroundColor: "#FF4949", borderRadius: 10, color: "#FFF", padding: '10px 20px', cursor: "pointer", fontFamily: "Prompt-Light", fontSize: 20 }}>
                        ลบ
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export const ModalEdit = ({ isOpen, onRequestClose, title, nametype, price, detail, fileName, Capacity, size, PicComponent2, PicComponent3, PicComponent4, item_placeholder, onNameTypeChange, onPriceChange, onDetailChange, onPicChange, onCapacityChange, onSizeChange, onPicComponent2Change, onPicComponent3Change, onPicComponent4Change, onConfirm }) => {
    return (
        <>
            <Modal
                isOpen={isOpen}
                onRequestClose={onRequestClose}
                contentLabel="Example Modal"
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    },
                    content: {
                        width: '60%',
                        height: '60%',
                        margin: 'auto',
                        zIndex: 999999,
                        borderRadius: 10,
                        padding: 20,
                    },
                }}
            >
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <button onClick={onRequestClose} style={{ position: "absolute", right: 10 }}>X</button>
                    <div style={{ fontFamily: "Prompt-Medium", fontSize: 40, color: "#714B1C", alignSelf: "center" }}>
                        {title}
                    </div>
                    <div style={{ flexDirection: "column", display: 'flex', marginTop: 10 }}>
                        <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, color: "#714B1C" }}>
                            ชื่อประเภทห้องพัก
                        </div>
                        <input
                            type="text"
                            value={nametype}
                            onChange={onNameTypeChange}
                            style={{ width: "100%", height: 51, paddingLeft: 40, boxSizing: "border-box", borderRadius: 8, borderColor: "#A9A9A9", borderStyle: "solid", borderWidth: 1, fontFamily: "Prompt-Medium", fontSize: 17 }}
                            placeholder={`${item_placeholder.name_room}`}
                        />
                    </div>

                    <div style={{ flexDirection: "row", display: 'flex', justifyContent: "space-between" }}>
                        <div style={{ width: "100%", marginRight: 30 }}>
                            <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, color: "#714B1C" }}>
                                ขนาด
                            </div>
                            <div style={{ position: "relative", width: "100%", height: 51 }}>
                                <input
                                    type="text"
                                    value={size}
                                    onChange={onSizeChange}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        boxSizing: "border-box",
                                        borderRadius: 8,
                                        borderColor: "#A9A9A9",
                                        borderStyle: "solid",
                                        borderWidth: 1,
                                        fontFamily: "Prompt-Medium",
                                        fontSize: 17,
                                        paddingLeft: 40,
                                    }}
                                    placeholder={`${item_placeholder.size_room}`}
                                />
                                <div style={{
                                    position: "absolute",
                                    right: 10,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    fontFamily: "Prompt-Medium",
                                    fontSize: 17,
                                    pointerEvents: "none" // เพื่อไม่ให้รบกวนการพิมพ์ของผู้ใช้
                                }}>
                                    / เมตร
                                </div>
                            </div>
                        </div>
                        <div style={{ width: "100%" }}>
                            <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, color: "#714B1C" }}>
                                ราคา
                            </div>
                            <div style={{ position: "relative", width: "100%", height: 51 }}>
                                <input
                                    type="text"
                                    value={price}
                                    onChange={onPriceChange}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        boxSizing: "border-box",
                                        borderRadius: 8,
                                        borderColor: "#A9A9A9",
                                        borderStyle: "solid",
                                        borderWidth: 1,
                                        fontFamily: "Prompt-Medium",
                                        fontSize: 17,
                                        paddingLeft: 40,
                                    }}
                                    placeholder={`${item_placeholder.price_room}`}
                                />
                                <div style={{
                                    position: "absolute",
                                    right: 10,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    fontFamily: "Prompt-Medium",
                                    fontSize: 17,
                                    pointerEvents: "none" // เพื่อไม่ให้รบกวนการพิมพ์ของผู้ใช้
                                }}>
                                    บาท / วัน
                                </div>
                            </div>
                        </div>
                        <div style={{ width: "100%", marginLeft: 30 }}>
                            <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, color: "#714B1C" }}>
                                ความจุแมว
                            </div>
                            <div style={{ position: "relative", width: "100%", height: 51 }}>
                                <input
                                    type="text"
                                    value={Capacity}
                                    onChange={onCapacityChange}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        boxSizing: "border-box",
                                        borderRadius: 8,
                                        borderColor: "#A9A9A9",
                                        borderStyle: "solid",
                                        borderWidth: 1,
                                        fontFamily: "Prompt-Medium",
                                        fontSize: 17,
                                        paddingLeft: 40,
                                    }}
                                    placeholder={`${item_placeholder.capacity_room}`}
                                />
                                <div style={{
                                    position: "absolute",
                                    right: 10,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    fontFamily: "Prompt-Medium",
                                    fontSize: 17,
                                    pointerEvents: "none" // เพื่อไม่ให้รบกวนการพิมพ์ของผู้ใช้
                                }}>
                                    ตัว / ห้อง
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ flexDirection: "column", display: 'flex' }}>
                        <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, color: "#714B1C" }}>
                            รายละเอียด
                        </div>
                        <input
                            type="text"
                            value={detail}
                            onChange={onDetailChange}
                            style={{ width: "100%", height: 51, paddingLeft: 40, boxSizing: "border-box", borderRadius: 8, borderColor: "#A9A9A9", borderStyle: "solid", borderWidth: 1, fontFamily: "Prompt-Medium", fontSize: 17 }}
                            placeholder={`${item_placeholder.detail_room}`}
                        />
                    </div>
                    <div style={{ flexDirection: "row", display: 'flex', justifyContent: "space-between", marginTop: 10 }}>
                        <div style={{ width: "100%", }}>
                            <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, color: "#714B1C" }}>
                                รูป
                            </div>
                            <div style={{}}>
                                {fileName
                                    ? <img onClick={() => document.getElementById('hidden-file-input').click()} src={fileName} alt="Selected" style={{ width: 140, height: 140, borderRadius: 20, cursor: "pointer" }} />
                                    : <img onClick={() => document.getElementById('hidden-file-input').click()} src={item_placeholder.pic} alt="Selected" style={{ width: 140, height: 140, borderRadius: 20, cursor: "pointer" }} />
                                }
                                <input
                                    type="file"
                                    id="hidden-file-input"
                                    style={{ display: 'none' }}
                                    onChange={onPicChange}
                                />
                            </div>
                        </div>
                        <div style={{ width: "100%",}}>
                            <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, color: "#714B1C" }}>
                                รูปภาพประกอบ 2
                            </div>
                            <div style={{}}>
                                {PicComponent2
                                    ? <img onClick={() => document.getElementById('hidden-file-input2').click()} src={PicComponent2} alt="Selected" style={{ width: 140, height: 140, borderRadius: 20, cursor: "pointer" }} />
                                    : <img onClick={() => document.getElementById('hidden-file-input2').click()} src={(item_placeholder.pic_component2 === "") ? addpiccomponent : item_placeholder.pic_component2} alt="Selected" style={{ width: 140, height: 140, borderRadius: 20, cursor: "pointer" }} />
                                }
                                <input
                                    type="file"
                                    id="hidden-file-input2"
                                    style={{ display: 'none' }}
                                    onChange={onPicComponent2Change}
                                />
                            </div>
                        </div>
                        <div style={{ width: "100%" }}>
                            <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, color: "#714B1C" }}>
                                รูปภาพประกอบ 3
                            </div>
                            <div style={{}}>
                                {PicComponent3
                                    ? <img onClick={() => document.getElementById('hidden-file-input3').click()} src={PicComponent3} alt="Selected" style={{ width: 140, height: 140, borderRadius: 20, cursor: "pointer" }} />
                                    : <img onClick={() => document.getElementById('hidden-file-input3').click()} src={(item_placeholder.pic_component3 === "") ? addpiccomponent : item_placeholder.pic_component3} alt="Selected" style={{ width: 140, height: 140, borderRadius: 20, cursor: "pointer" }} />
                                }
                                <input
                                    type="file"
                                    id="hidden-file-input3"
                                    style={{ display: 'none' }}
                                    onChange={onPicComponent3Change}
                                />
                            </div>
                        </div>
                        <div style={{ width: "100%" }}>
                            <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, color: "#714B1C" }}>
                                รูปภาพประกอบ 4
                            </div>
                            <div style={{}}>
                                {PicComponent4
                                    ? <img onClick={() => document.getElementById('hidden-file-input4').click()} src={PicComponent4} alt="Selected" style={{ width: 140, height: 140, borderRadius: 20, cursor: "pointer" }} />
                                    : <img onClick={() => document.getElementById('hidden-file-input4').click()} src={(item_placeholder.pic_component4 === "") ? addpiccomponent : item_placeholder.pic_component4} alt="Selected" style={{ width: 140, height: 140, borderRadius: 20, cursor: "pointer" }} />
                                }
                                <input
                                    type="file"
                                    id="hidden-file-input4"
                                    style={{ display: 'none' }}
                                    onChange={onPicComponent4Change}
                                />
                            </div>
                        </div>
                    </div>
                    <div style={{ flexDirection: "row", display: "flex", alignSelf: "flex-end", marginTop: 10 }}>
                        <div
                            onClick={onConfirm}
                            style={{
                                width: 60,
                                height: 40,
                                backgroundColor: "#714B1C",
                                borderRadius: 10,
                                color: "#FFF",
                                alignItems: "center",
                                justifyContent: "center",
                                display: "flex",
                                fontFamily: "Prompt-Medium",
                                fontSize: 20,
                                width: 156,
                                height: 46,
                                cursor: "pointer"
                            }}
                        >
                            แก้ไข
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export const ModalEditInner = ({ isOpen, onRequestClose, title, nametype, price, detail, fileName, item_placeholder, onNameTypeChange, onPriceChange, onDetailChange, onPicChange, onConfirm }) => {
    return (
        <>
            <Modal
                isOpen={isOpen}
                onRequestClose={onRequestClose}
                contentLabel="Example Modal"
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    },
                    content: {
                        width: '60%',
                        height: '50%',
                        margin: 'auto',
                        zIndex: 999999,
                        borderRadius: 10,
                        padding: 20,
                    },
                }}
            >
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <button onClick={onRequestClose} style={{ position: "absolute", right: 10 }}>X</button>
                    <div style={{ fontFamily: "Prompt-Medium", fontSize: 40, color: "#714B1C", alignSelf: "center" }}>
                        {title}
                    </div>
                    <div style={{ flexDirection: "column", display: 'flex', marginTop: 20 }}>
                        <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, color: "#714B1C" }}>
                            ชื่อห้องพัก
                        </div>
                        <input
                            type="text"
                            value={nametype}
                            onChange={onNameTypeChange}
                            style={{ width: "100%", height: 51, paddingLeft: 40, boxSizing: "border-box", borderRadius: 8, borderColor: "#A9A9A9", borderStyle: "solid", borderWidth: 1, fontFamily: "Prompt-Medium", fontSize: 17 }}
                            placeholder={`${item_placeholder.name_room}`}
                        />
                    </div>
                    <div style={{ flexDirection: "column", display: 'flex', marginTop: 20 }}>
                        <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, color: "#714B1C" }}>
                            รูป
                        </div>
                        <div style={{ marginLeft: 40 }}>
                            {fileName
                                ? <img onClick={() => document.getElementById('hidden-file-input').click()} src={fileName} alt="Selected" style={{ width: 180, height: 180, borderRadius: 20, cursor: "pointer" }} />
                                : <img onClick={() => document.getElementById('hidden-file-input').click()} src={item_placeholder.pic} alt="Selected" style={{ width: 180, height: 180, borderRadius: 20, cursor: "pointer" }} />
                            }
                            <input
                                type="file"
                                id="hidden-file-input"
                                style={{ display: 'none' }}
                                onChange={onPicChange}
                            />
                        </div>
                    </div>
                    <div style={{ flexDirection: "row", display: "flex", alignSelf: "flex-end", marginTop: 10 }}>
                        <div
                            onClick={onConfirm}
                            style={{
                                width: 60,
                                height: 40,
                                backgroundColor: "#714B1C",
                                borderRadius: 10,
                                color: "#FFF",
                                alignItems: "center",
                                justifyContent: "center",
                                display: "flex",
                                fontFamily: "Prompt-Medium",
                                fontSize: 20,
                                width: 156,
                                height: 46,
                                cursor: "pointer"
                            }}
                        >
                            แก้ไข
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export const ModalAlert = ({ isOpen, onRequestClose, title, message, }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Confirmation Modal"
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)'
                },
                content: {
                    width: '50%',
                    height: '20%',
                    margin: 'auto',
                    zIndex: 999999,
                    borderRadius: 10,
                    padding: 20,
                },
            }}
        >
            <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", flexDirection: "rox" }}>
                    <FiAlertOctagon style={{ width: 65, height: 65, color: "red" }} />
                    <div style={{ display: "flex", flexDirection: "column", paddingLeft: 20 }}>
                        <div style={{ fontFamily: "Prompt-Medium", fontSize: 27, }}>
                            {title}
                        </div>
                        <div style={{ marginTop: 10 }}>
                            <div style={{ fontFamily: "Prompt-Light", fontSize: 22, }}>
                                {message}
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 30, flexDirection: "row" }}>
                    <div onClick={onRequestClose} style={{ borderRadius: 10, color: "#66AB65", padding: '10px 20px', cursor: "pointer", fontFamily: "Prompt-Light", fontSize: 20, marginRight: 16, borderWidth: 3, borderColor: "#66AB65", borderStyle: "solid" }}>
                        ตกลง
                    </div>
                </div>
            </div>
        </Modal>
    );
};