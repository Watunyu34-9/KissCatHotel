import React, { useEffect, useState } from 'react';
import '../App.css'
import { firebase } from "../backend/backend"
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import manageroomIcon from '../asset/manageroomIcon.png'
import addroomIcon from '../asset/addroomIcon.png'
import Modal from 'react-modal';
import { ModalDelete, ModalEdit, ModalEditInner, ModalAlert } from '../component/modal';

export default function ManageRoom({ allRoomm, selectRoom, nameTypeRoom, nameRoomidTopic, onRoomSelect }) {
    console.log("allRoomm: ", allRoomm);
    console.log("selectRoom: ", selectRoom);
    const isIndex = selectRoom.findIndex(value => value === true);
    console.log("isIndex: ", isIndex);
    console.log("nameRoomidTopic: ", nameRoomidTopic);
    console.log("nameTypeRoom: ", nameTypeRoom);
    const isUser = firebase.auth().currentUser.uid;
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalIsOpenInner, setModalIsOpenInner] = useState(false);
    const [isModalDeleteOpen, setModalDeleteOpen] = useState(false);
    const [isModalDeleteOpenInner, setModalDeleteOpenInner] = useState(false);
    const [isModalEditOpen, setModalEditOpen] = useState(false);
    const [isSelectedRoomIndex, setSelectedRoomIndex] = useState(null);
    const [isSelectedRoomIndexInner, setSelectedRoomIndexInner] = useState(null);
    const [isSelectedRoomItemxEdit, setSelectedRoomItemxEdit] = useState({});
    const [isSelectedRoomIndexEdit, setSelectedRoomIndexEdit] = useState(null);
    //add mainroom
    const [isNameRoom, setNameRoom] = useState("");
    const [isPriceRoom, setPriceRoom] = useState("");
    const [isDetailRoom, setDetailRoom] = useState("");
    const [isFileName, setFileName] = useState("");
    const [isPicRoom, setPicRoom] = useState("");
    const [isCapacity, setCapacity] = useState(""); // เพิ่ม
    const [isSize, setSize] = useState(""); // เพิ่ม
    //add innerroom
    const [isNameRoomId, setNameRoomId] = useState("");
    const [isFileNameInner, setFileNameInner] = useState("");
    const [isPicRoomInner, setPicRoomInner] = useState("");
    //edit mainroom
    const [isNameTypeRoomEdit, setNameTypeRoomEdit] = useState("");
    const [isPriceRoomEdit, setPriceRoomEdit] = useState("");
    const [isDetailRoomEdit, setDetailRoomEdit] = useState("");
    const [isPicRoomEdit, setPicRoomEdit] = useState("");
    const [isCapacityEdit, setCapacityEdit] = useState(""); // เพิ่ม
    const [isSizeEdit, setSizeEdit] = useState(""); // เพิ่ม
    const [isPicComponent2, setPicComponent2] = useState(""); // เพิ่ม
    const [isPicComponent3, setPicComponent3] = useState(""); // เพิ่ม
    const [isPicComponent4, setPicComponent4] = useState(""); // เพิ่ม
    //edit innerroom
    const [isNameTypeRoomEditInner, setNameTypeRoomEditInner] = useState("")
    const [isPicRoomEditInner, setPicRoomEditInner] = useState("")
    //modal
    const [isModalEditOpenInner, setModalEditOpenInner] = useState(false);
    const [isSelectedRoomItemxEditInner, setSelectedRoomItemxEditInner] = useState({})
    const [isSelectedRoomIndexEditInner, setSelectedRoomIndexEditInner] = useState(null)
    const [isModalAlert, setModalAlert] = useState(false)

    //
    const [isRoomData, setRoomData] = useState([])

    useEffect(() => {
        console.log("ManageRoom..");
        getRoomsData();
    }, [allRoomm, isIndex, nameTypeRoom, nameRoomidTopic]);

    const getRoomsData = async () => {
        const docRef = firebase.firestore().collection('admin').doc(isUser);
        docRef.onSnapshot((doc) => {
            if (doc.exists) {
                const data = doc.data();
                console.log('เช็คข้อมูล', data);
                if (data.my_catroom && data.my_catroom.length > 0) {
                    if (allRoomm === true) {
                        setRoomData(data.my_catroom);
                    } else {
                        const selectedCatRoom = data.my_catroom[isIndex];
                        if (selectedCatRoom && selectedCatRoom.inner_room) {
                            console.log("data.my_catroom[isIndex] ใน else : ", selectedCatRoom);
                            setRoomData(selectedCatRoom.inner_room);
                        } else {
                            console.log("ไม่พบข้อมูล inner_room หรือ my_catroom ที่ isIndex");
                            setRoomData([]);
                        }
                    }
                } else {
                    setRoomData([]);
                }
            }
        });
    }

    const handleNameRoom = (event) => {
        setNameRoom(event.target.value);
    };

    const handleCapacity = (event) => {
        const value = event.target.value;
        // กรองเฉพาะตัวเลข
        const numericValue = value.replace(/\D/g, '');
        setCapacity(numericValue);
    };

    const handlePriceRoom = (event) => {
        const value = event.target.value;
        // กรองเฉพาะตัวเลข
        const numericValue = value.replace(/\D/g, '');
        setPriceRoom(numericValue);
    };

    const handleDetailRoom = (event) => {
        setDetailRoom(event.target.value);
    };

    const handleSize = (event) => {
        setSize(event.target.value);
    };

    const handleFileChange = (event) => {
        console.log("event: ", event);
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            console.log("reader: ", reader);
            reader.onloadend = () => {
                setPicRoom(reader.result);
            };
            reader.readAsDataURL(file);
            setFileName(event.target.files[0].name)
        } else {
            window.alert('เกิดข้อผิดพลาด ไฟล์ของคุณไม่ใช่ไฟล์รูปภาพ');
            event.target.value = null; // ล้างค่าของ input field
            setFileName(null);
            setPicRoom(null);
        }
    };

    const handleNameRoomInner = (event) => {
        setNameRoomId(event.target.value);
    };

    const handleFileChangeInner = (event) => {
        console.log("event: ", event);
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            console.log("reader: ", reader);
            reader.onloadend = () => {
                setPicRoomInner(reader.result);
            };
            reader.readAsDataURL(file);
            setFileNameInner(event.target.files[0].name)
        } else {
            window.alert('เกิดข้อผิดพลาด ไฟล์ของคุณไม่ใช่ไฟล์รูปภาพ');
            event.target.value = null; // ล้างค่าของ input field
            setFileNameInner(null);
            setPicRoomInner(null);
        }
    };

    const handleFileChangeRoomEdit = (event) => {
        console.log("event1111: ", event);
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            console.log("reader: ", reader);
            reader.onloadend = () => {
                setPicRoomEdit(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            window.alert('เกิดข้อผิดพลาด ไฟล์ของคุณไม่ใช่ไฟล์รูปภาพ');
            event.target.value = null; // ล้างค่าของ input field
            setPicRoomEdit(null);
        }
    };

    const handleFileChangeRoomPicComponent2Edit = (event) => {
        console.log("event2222: ", event);
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            console.log("reader: ", reader);
            reader.onloadend = () => {
                setPicComponent2(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            window.alert('เกิดข้อผิดพลาด ไฟล์ของคุณไม่ใช่ไฟล์รูปภาพ');
            event.target.value = null; // ล้างค่าของ input field
            setPicComponent2(null);
        }
    };

    const handleFileChangeRoomPicComponent3Edit = (event) => {
        console.log("event: ", event);
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            console.log("reader: ", reader);
            reader.onloadend = () => {
                setPicComponent3(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            window.alert('เกิดข้อผิดพลาด ไฟล์ของคุณไม่ใช่ไฟล์รูปภาพ');
            event.target.value = null; // ล้างค่าของ input field
            setPicComponent3(null);
        }
    };

    const handleFileChangeRoomPicComponent4Edit = (event) => {
        console.log("event: ", event);
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            console.log("reader: ", reader);
            reader.onloadend = () => {
                setPicComponent4(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            window.alert('เกิดข้อผิดพลาด ไฟล์ของคุณไม่ใช่ไฟล์รูปภาพ');
            event.target.value = null; // ล้างค่าของ input field
            setPicComponent4(null);
        }
    };

    const handleFileChangeRoomEditInner = (event) => {
        console.log("event: ", event);
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            console.log("reader: ", reader);
            reader.onloadend = () => {
                setPicRoomEditInner(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            window.alert('เกิดข้อผิดพลาด ไฟล์ของคุณไม่ใช่ไฟล์รูปภาพ');
            event.target.value = null; // ล้างค่าของ input field
            setPicRoomEditInner(null);
        }
    };

    const handleRoomClick = (item, index) => {
        console.log("index handleRoomClick ", index);
        onRoomSelect(item, index);
    };

    const openModal = () => {
        setModalIsOpen(true);
    }

    const closeModal = () => {
        setModalIsOpen(false);
        setNameRoom("")
        setPriceRoom("")
        setDetailRoom("")
        setFileName(null)
        setPicRoom("")
        setCapacity(""); // เพิ่ม
        setSize("");
    }

    const AddRoom = async () => {
        if (!isNameRoom || !isPriceRoom || !isDetailRoom || !isFileName || !isSize || !isCapacity) {
            alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        } else {
            try {
                const firestore = firebase.firestore();
                const adminRef = firestore.collection('admin').doc(isUser);
                const doc = await adminRef.get();
                if (!doc.exists || !doc.data().my_catroom) {
                    await adminRef.set({ my_catroom: [] }, { merge: true });
                }
                const lastItemId = doc.data().my_catroom.length > 0 ? doc.data().my_catroom[doc.data().my_catroom.length - 1].id : 0;
                const newItemId = lastItemId + 1;
                const storageRef = firebase.storage().ref();
                const imageRef = storageRef.child(`${isUser}/catroom/${newItemId}`);
                await imageRef.putString(isPicRoom, 'data_url');
                const imageUrl = await imageRef.getDownloadURL();
                await adminRef.update({
                    my_catroom: firebase.firestore.FieldValue.arrayUnion({
                        id: newItemId,
                        name_room: isNameRoom,
                        size_room: isSize,
                        price_room: isPriceRoom,
                        capacity_room: isCapacity,
                        detail_room: isDetailRoom,
                        pic: imageUrl,
                        inner_room: [],
                        pic_component2: "",
                        pic_component3: "",
                        pic_component4: "",
                    }),
                });
                closeModal();
            } catch (error) {
                console.log("Error: ", error);
            }
        }
    };

    const AddRoomInner = async () => {
        if (!isNameRoomId || !isFileNameInner) {
            alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        } else {
            try {
                const firestore = firebase.firestore();
                const adminRef = firestore.collection('admin').doc(isUser);
                const doc = await adminRef.get();
                if (!doc.exists) {
                    console.error("Document does not exist!");
                    return;
                }
                let myCatRoom = doc.data().my_catroom || [];
                if (isIndex === undefined || isIndex < 0 || isIndex >= myCatRoom.length) {
                    console.error("Invalid isIndex value!");
                    return;
                }
                let lastItemId = 0;
                const catRoom = myCatRoom[isIndex];
                if (catRoom.inner_room && catRoom.inner_room.length > 0) {
                    const innerLastId = catRoom.inner_room[catRoom.inner_room.length - 1].id;
                    lastItemId = innerLastId > lastItemId ? innerLastId : lastItemId;
                }
                const newItemId = lastItemId + 1;
                const storageRef = firebase.storage().ref();
                const imageRef = storageRef.child(`${isUser}/catroom/${catRoom.id}/${newItemId}`);
                await imageRef.putString(isPicRoomInner, 'data_url');
                const imageUrl = await imageRef.getDownloadURL();
                if (!catRoom.inner_room) {
                    catRoom.inner_room = [];
                }
                catRoom.inner_room.push({
                    id: newItemId,
                    name_room: isNameRoomId,
                    pic: imageUrl,
                    status_inner: "N",
                    my_reservation: []
                });
                myCatRoom[isIndex] = catRoom;
                await adminRef.update({ my_catroom: myCatRoom });
                firebase.firestore().runTransaction(async (transaction) => {
                    const doc = await transaction.get(adminRef);
                    if (!doc.exists) {
                        throw "Document does not exist!";
                    }
                    let my_dashboard = doc.data().my_dashboard || [];
                    if (my_dashboard.length > 0) {
                        if (my_dashboard[0].hasOwnProperty('rooms_number')) {
                            my_dashboard[0].rooms_number += 1;
                        } else {
                            my_dashboard[0].rooms_number = 1;
                        }
                    } else {
                        my_dashboard.push({ rooms_number: 1 });
                    }
                    transaction.update(adminRef, { my_dashboard: my_dashboard });
                });
                closeModalInner();
            } catch (error) {
                console.log("Error: ", error);
            }
        }
    };

    // const DeleteRoom = async (index) => {
    //     console.log("Confirmed!");
    //     try {
    //         const AdminRef = firebase.firestore().collection('admin').doc(isUser);
    //         const doc = await AdminRef.get();
    //         if (doc.exists) {
    //             const AdminData = doc.data();
    //             const deletedRoom = AdminData.my_catroom[index];

    //             // เช็คสถานะของ inner_room ทั้งหมด
    //             let hasReservedInnerRoom = false;
    //             if (deletedRoom.inner_room && deletedRoom.inner_room.length > 0) {
    //                 for (const innerRoom of deletedRoom.inner_room) {
    //                     if (innerRoom.status_inner === "Y") {
    //                         hasReservedInnerRoom = true;
    //                         break;
    //                     }
    //                 }
    //             }

    //             if (hasReservedInnerRoom) {
    //                 setModalAlert(true)
    //                 closeModalDelete()
    //                 return;
    //             }

    //             const storageRef = firebase.storage().ref();
    //             if (deletedRoom.inner_room && deletedRoom.inner_room.length > 0) {
    //                 for (const innerRoom of deletedRoom.inner_room) {
    //                     const innerImageRef = storageRef.child(`${isUser}/catroom/${deletedRoom.id}/${innerRoom.id}`);
    //                     await innerImageRef.delete().catch((error) => {
    //                         console.log(`Failed to delete inner room image: ${innerRoom.id}`, error);
    //                     });
    //                 }
    //             }
    //             const imageRef = storageRef.child(`${isUser}/catroom/${deletedRoom.id}`);
    //             await imageRef.delete().catch((error) => {
    //                 console.log(`Failed to delete main room image: ${deletedRoom.id}`, error);
    //             });
    //             const folderRef = storageRef.child(`${isUser}/catroom/${deletedRoom.id}`);
    //             await folderRef.listAll().then((listResults) => {
    //                 listResults.items.forEach((itemRef) => {
    //                     itemRef.delete().catch((error) => {
    //                         console.log(`Failed to delete item in folder: ${deletedRoom.id}`, error);
    //                     });
    //                 });
    //             }).catch((error) => {
    //                 console.log(`Failed to list items in folder: ${deletedRoom.id}`, error);
    //             });
    //             AdminData.my_catroom.splice(index, 1);
    //             await AdminRef.update({ my_catroom: AdminData.my_catroom });
    //             await firebase.firestore().runTransaction(async (transaction) => {
    //                 const doc = await transaction.get(AdminRef);
    //                 if (!doc.exists) {
    //                     throw "Document does not exist!";
    //                 }
    //                 let my_dashboard = doc.data().my_dashboard || [];
    //                 if (my_dashboard.length > 0) {
    //                     if (my_dashboard[0].hasOwnProperty('rooms_number')) {
    //                         my_dashboard[0].rooms_number -= (deletedRoom.inner_room ? deletedRoom.inner_room.length : 0);
    //                     } else {
    //                         my_dashboard[0].rooms_number = 0;
    //                     }
    //                 } else {
    //                     my_dashboard.push({ rooms_number: 0 });
    //                 }
    //                 transaction.update(AdminRef, { my_dashboard: my_dashboard });
    //             });
    //             closeModalDelete();
    //             console.log('เมนูถูกลบออกจาก my_catroom ของผู้ใช้แล้ว');
    //         } else {
    //             console.log('ไม่พบข้อมูลของผู้ใช้');
    //         }
    //     } catch (error) {
    //         console.log("Error deleting room: ", error);
    //     }
    // };

    const DeleteRoom = async (index) => {
        console.log("Confirmed!");
        try {
            const AdminRef = firebase.firestore().collection('admin').doc(isUser);
            const doc = await AdminRef.get();
            if (doc.exists) {
                const AdminData = doc.data();
                const deletedRoom = AdminData.my_catroom[index];
    
                // เช็คสถานะของ inner_room ทั้งหมด
                let hasReservedInnerRoom = false;
                if (deletedRoom.inner_room && deletedRoom.inner_room.length > 0) {
                    for (const innerRoom of deletedRoom.inner_room) {
                        if (innerRoom.status_inner === "Y") {
                            hasReservedInnerRoom = true;
                            break;
                        }
                    }
                }
    
                if (hasReservedInnerRoom) {
                    setModalAlert(true);
                    closeModalDelete();
                    return;
                }
    
                const storageRef = firebase.storage().ref();
                const pathsToDelete = [
                    `${isUser}/catroom/component2/${deletedRoom.id}`,
                    `${isUser}/catroom/component3/${deletedRoom.id}`,
                    `${isUser}/catroom/component4/${deletedRoom.id}`
                ];
    
                for (const path of pathsToDelete) {
                    await storageRef.child(path).delete().catch((error) => {
                        if (error.code === 'storage/object-not-found') {
                            console.log(`Folder not found: ${path}`);
                        } else {
                            console.log(`Failed to delete folder: ${path}`, error);
                        }
                    });
                }
    
                const imageRef = storageRef.child(`${isUser}/catroom/${deletedRoom.id}`);
                await imageRef.delete().catch((error) => {
                    console.log(`Failed to delete main room image: ${deletedRoom.id}`, error);
                });
    
                AdminData.my_catroom.splice(index, 1);
                await AdminRef.update({ my_catroom: AdminData.my_catroom });
                await firebase.firestore().runTransaction(async (transaction) => {
                    const doc = await transaction.get(AdminRef);
                    if (!doc.exists) {
                        throw "Document does not exist!";
                    }
                    let my_dashboard = doc.data().my_dashboard || [];
                    if (my_dashboard.length > 0) {
                        if (my_dashboard[0].hasOwnProperty('rooms_number')) {
                            my_dashboard[0].rooms_number -= (deletedRoom.inner_room ? deletedRoom.inner_room.length : 0);
                        } else {
                            my_dashboard[0].rooms_number = 0;
                        }
                    } else {
                        my_dashboard.push({ rooms_number: 0 });
                    }
                    transaction.update(AdminRef, { my_dashboard: my_dashboard });
                });
                closeModalDelete();
                console.log('เมนูถูกลบออกจาก my_catroom ของผู้ใช้แล้ว');
            } else {
                console.log('ไม่พบข้อมูลของผู้ใช้');
            }
        } catch (error) {
            console.log("Error deleting room: ", error);
        }
    };
    
    
    const DeleteRoomInner = async (catRoomIndex, innerRoomIndex) => {
        try {
            const AdminRef = firebase.firestore().collection('admin').doc(isUser);
            const doc = await AdminRef.get();
            if (doc.exists) {
                const AdminData = doc.data();
                const catRoom = AdminData.my_catroom[catRoomIndex];
                if (!catRoom || !catRoom.inner_room || innerRoomIndex < 0 || innerRoomIndex >= catRoom.inner_room.length) {
                    console.error("Invalid catRoomIndex or innerRoomIndex!");
                    return;
                }
                const innerRoom = catRoom.inner_room[innerRoomIndex];

                // เช็คสถานะ inner_room
                if (innerRoom.status_inner === "Y") {
                    setModalAlert(true);
                    closeModalDeleteInner();
                    return;
                }

                const storageRef = firebase.storage().ref();
                const innerImageRef = storageRef.child(`${isUser}/catroom/${catRoom.id}/${innerRoom.id}`);
                await innerImageRef.delete().catch((error) => {
                    console.log(`Failed to delete inner room image: ${innerRoom.id}`, error);
                });
                catRoom.inner_room.splice(innerRoomIndex, 1);
                AdminData.my_catroom[catRoomIndex] = catRoom;

                await AdminRef.update({ my_catroom: AdminData.my_catroom });
                await firebase.firestore().runTransaction(async (transaction) => {
                    const doc = await transaction.get(AdminRef);
                    if (!doc.exists) {
                        throw "Document does not exist!";
                    }
                    let my_dashboard = doc.data().my_dashboard || [];
                    if (my_dashboard.length > 0) {
                        if (my_dashboard[0].hasOwnProperty('rooms_number')) {
                            my_dashboard[0].rooms_number -= 1;
                        } else {
                            my_dashboard[0].rooms_number = 0;
                        }
                    } else {
                        my_dashboard.push({ rooms_number: 0 });
                    }
                    transaction.update(AdminRef, { my_dashboard: my_dashboard });
                });
                closeModalDeleteInner();
                console.log('inner_room ถูกลบออกจาก my_catroom ของผู้ใช้แล้ว');
            } else {
                console.log('ไม่พบข้อมูลของผู้ใช้');
            }
        } catch (error) {
            console.log("Error deleting inner room: ", error);
        }
    };

    const EditRoom = async (item, index) => {
        console.log("item EditRoom: ", item);
        console.log("index EditRoom: ", index);
        if (index < 0) {
            console.error('ตรวจสอบว่าค่า index ไม่เป็นค่าลบก่อนใช้งาน (index < 0)');
            return;
        }
        try {
            const storageRef = firebase.storage().ref();
            //รูปหลัก
            const oldImageRef = storageRef.child(`${isUser}/catroom/${item.name_room}/${item.id}`);
            let imageUrl = item.pic;
            if (isPicRoomEdit) {
                await oldImageRef.delete().catch((error) => {
                    console.log(`Failed to delete old image: ${item.id}`, error);
                });
                const newImageRef = storageRef.child(`${isUser}/catroom/${isNameTypeRoomEdit}/${item.id}`);
                await newImageRef.putString(isPicRoomEdit, 'data_url');
                imageUrl = await newImageRef.getDownloadURL();
            }
            //รูปประกอบ 2
            const oldImage2Ref = storageRef.child(`${isUser}/catroom/component2/${item.id}`);
            let imageUrl2 = item.pic_component2;
            if (isPicComponent2) {
                await oldImage2Ref.delete().catch((error) => {
                    console.log(`Failed to delete old image: ${item.id}`, error);
                });
                const newImageRef2 = storageRef.child(`${isUser}/catroom/component2/${item.id}`);
                await newImageRef2.putString(isPicComponent2, 'data_url');
                imageUrl2 = await newImageRef2.getDownloadURL();
            }
            //รูปประกอบ 3
            const oldImage3Ref = storageRef.child(`${isUser}/catroom/component3/${item.id}`);
            let imageUrl3 = item.pic_component3;
            if (isPicComponent3) {
                await oldImage3Ref.delete().catch((error) => {
                    console.log(`Failed to delete old image: ${item.id}`, error);
                });
                const newImageRef3 = storageRef.child(`${isUser}/catroom/component3/${item.id}`);
                await newImageRef3.putString(isPicComponent3, 'data_url');
                imageUrl3 = await newImageRef3.getDownloadURL();
            }
            //รูปประกอบ 4
            const oldImage4Ref = storageRef.child(`${isUser}/catroom/component4/${item.id}`);
            let imageUrl4 = item.pic_component4;
            if (isPicComponent4) {
                await oldImage4Ref.delete().catch((error) => {
                    console.log(`Failed to delete old image: ${item.id}`, error);
                });
                const newImageRef4 = storageRef.child(`${isUser}/catroom/component4/${item.id}`);
                await newImageRef4.putString(isPicComponent4, 'data_url');
                imageUrl4 = await newImageRef4.getDownloadURL();
            }
            //
            const firestore = firebase.firestore();
            const adminRef = firestore.collection('admin').doc(isUser);
            const snapshot = await adminRef.get();
            if (snapshot.exists) {
                const adminData = snapshot.data();
                const managerooms = adminData.my_catroom;
                if (index >= managerooms.length) {
                    console.error('ตรวจสอบว่าค่า index ไม่เกินขอบเขตของ array managerooms (index >= managerooms.length)');
                    return;
                }
                const updatedRooms = managerooms.map((room, idx) => {
                    if (idx === index) {
                        return {
                            ...room,
                            name_room: isNameTypeRoomEdit || room.name_room,
                            price_room: isPriceRoomEdit || room.price_room,
                            detail_room: isDetailRoomEdit || room.detail_room,
                            pic: imageUrl,
                            size_room: isSizeEdit || room.size_room,
                            capacity_room: isCapacityEdit || room.capacity_room,
                            pic_component2: imageUrl2,
                            pic_component3: imageUrl3,
                            pic_component4: imageUrl4,
                        };
                    }
                    return room;
                });
                await adminRef.update({
                    my_catroom: updatedRooms,
                });
                closeModalEditRoom();
            } else {
                console.log('ไม่พบข้อมูลผู้ใช้');
            }
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการแก้ไขข้อมูล:', error);
        }
    };

    const EditRoomInner = async (item, index, innerIndex) => {
        console.log("item EditRoomInner: ", item);
        console.log("index EditRoomInner: ", index);
        console.log("innerIndex EditRoomInner: ", innerIndex);

        if (index < 0 || innerIndex < 0) {
            console.error('ตรวจสอบว่าค่า index และ innerIndex ไม่เป็นค่าลบก่อนใช้งาน (index < 0 || innerIndex < 0)');
            return;
        }

        try {
            const storageRef = firebase.storage().ref();
            const oldImageRef = storageRef.child(`${isUser}/catroom/${nameRoomidTopic}/${item.id}`);
            let imageUrl = item.pic; // ค่าเริ่มต้นคือ URL ของรูปภาพเดิม

            if (isPicRoomEditInner) {
                // ลบรูปภาพเก่าก่อนที่จะอัปโหลดรูปภาพใหม่
                await oldImageRef.delete().catch((error) => {
                    console.log(`Failed to delete old inner room image: ${item.id}`, error);
                });

                const newImageRef = storageRef.child(`${isUser}/catroom/${nameRoomidTopic}/${item.id}`);
                await newImageRef.putString(isPicRoomEditInner, 'data_url');
                imageUrl = await newImageRef.getDownloadURL(); // รับ URL ของรูปภาพใหม่
            }

            const firestore = firebase.firestore();
            const adminRef = firestore.collection('admin').doc(isUser);

            // ค้นหาเมนูที่ต้องการแก้ไข
            const snapshot = await adminRef.get();
            if (snapshot.exists) {
                const adminData = snapshot.data();
                const managerooms = adminData.my_catroom;

                if (index >= managerooms.length) {
                    console.error('ตรวจสอบว่าค่า index ไม่เกินขอบเขตของ array managerooms (index >= managerooms.length)');
                    return;
                }

                const room = managerooms[index];

                if (!room.inner_room || innerIndex >= room.inner_room.length) {
                    console.error('ตรวจสอบว่าค่า innerIndex ไม่เกินขอบเขตของ array inner_room');
                    return;
                }

                const updatedInnerRooms = room.inner_room.map((innerRoom, idx) => {
                    if (idx === innerIndex) {
                        return {
                            ...innerRoom,
                            name_room: isNameTypeRoomEditInner || innerRoom.name_room,
                            pic: imageUrl
                        };
                    }
                    return innerRoom;
                });

                const updatedRooms = managerooms.map((room, idx) => {
                    if (idx === index) {
                        return {
                            ...room,
                            inner_room: updatedInnerRooms
                        };
                    }
                    return room;
                });

                // อัปเดตข้อมูลใน Firestore collection 'admin'
                await adminRef.update({
                    my_catroom: updatedRooms,
                });

                closeModalEditRoomInner();
            } else {
                console.log('ไม่พบข้อมูลผู้ใช้');
            }
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการแก้ไขข้อมูล:', error);
        }
    }

    const openModalDeleteInner = (index) => {
        setSelectedRoomIndexInner(index);
        setModalDeleteOpenInner(true)
    }

    const closeModalDeleteInner = () => {
        setModalDeleteOpenInner(false)
        setSelectedRoomIndexInner(null);
    }

    const openModalDelete = (index) => {
        setSelectedRoomIndex(index);
        setModalDeleteOpen(true)
    }

    const closeModalDelete = () => {
        setModalDeleteOpen(false);
        setSelectedRoomIndex(null);
    };

    const openModalEditRoom = (item, index) => {
        setSelectedRoomItemxEdit(item);
        setSelectedRoomIndexEdit(index);
        setModalEditOpen(true);
    }

    const openModalEditRoomInner = (item, index) => {
        setSelectedRoomItemxEditInner(item);
        setSelectedRoomIndexEditInner(index);
        setModalEditOpenInner(true);
    }

    const closeModalEditRoom = () => {
        setModalEditOpen(false);
        setSelectedRoomIndexEdit(null);
        setNameTypeRoomEdit("");
        setPriceRoomEdit("");
        setDetailRoomEdit("");
        setPicRoomEdit("");
        setCapacityEdit(""); // เพิ่ม
        setSizeEdit(""); // เพิ่ม
        setPicComponent2(""); // เพิ่ม
        setPicComponent3(""); // เพิ่ม
        setPicComponent4(""); // เพิ่ม
    };

    const closeModalEditRoomInner = () => {
        setModalEditOpenInner(false);
        setSelectedRoomIndexEditInner(null);
        setNameTypeRoomEditInner("");
        setPicRoomEditInner("");
    }

    const openModalInner = () => {
        setModalIsOpenInner(true);
    }

    const closeModalInner = () => {
        setModalIsOpenInner(false);
        setNameRoomId("")
        setFileNameInner(null)
        setPicRoomInner("")
    }

    const modal = () => {
        return (
            <>
                <div style={{}}>
                    <Modal
                        isOpen={modalIsOpen}//const [modalIsOpen, setModalIsOpen] = useState(false);ถ้า setตัวหลัง ทรู อันนี้จะขึ้นมา โดยการเชื่อมตัวหน้า Modal เพิ่มเมนู
                        onRequestClose={closeModal}
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
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", }}>
                            <button onClick={closeModal} style={{ position: "absolute", right: 10, }}>X</button>
                            <div style={{ fontFamily: "Prompt-Medium", fontSize: 40, color: "#714B1C", alignSelf: "center" }}>
                                เพิ่มประเภทห้องพัก
                            </div>
                            <div style={{ flexDirection: "column", display: 'flex', marginTop: 20 }}>
                                <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, color: "#714B1C" }}>
                                    ชื่อประเภทห้องพัก
                                </div>
                                <input
                                    type="text"
                                    value={isNameRoom}
                                    onChange={handleNameRoom}
                                    style={{ width: "100%", height: 51, paddingLeft: 40, boxSizing: "border-box", borderRadius: 8, borderColor: "#A9A9A9", borderStyle: "solid", borderWidth: 1, fontFamily: "Prompt-Medium", fontSize: 17, }}
                                >
                                </input>
                            </div>
                            <div style={{ flexDirection: "row", display: 'flex', justifyContent: "space-between" }}>
                                <div style={{ width: "100%", marginRight: 30 }}>
                                    <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, color: "#714B1C" }}>
                                        ขนาด
                                    </div>
                                    <div style={{ position: "relative", width: "100%", height: 51 }}>
                                        <input
                                            type="text"
                                            value={isSize}
                                            onChange={handleSize}
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
                                            value={isPriceRoom}
                                            onChange={handlePriceRoom}
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
                                            value={isCapacity}
                                            onChange={handleCapacity}
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
                            <div style={{ flexDirection: "column", display: 'flex', }}>
                                <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, color: "#714B1C" }}>
                                    รายละเอียด
                                </div>
                                <input
                                    type="text"
                                    value={isDetailRoom}
                                    onChange={handleDetailRoom}
                                    style={{ width: "100%", height: 51, paddingLeft: 40, boxSizing: "border-box", borderRadius: 8, borderColor: "#A9A9A9", borderStyle: "solid", borderWidth: 1, fontFamily: "Prompt-Medium", fontSize: 17, }}
                                >
                                </input>
                            </div>
                            <div style={{ flexDirection: "column", display: 'flex', }}>
                                <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, color: "#714B1C" }}>
                                    รูป
                                </div>
                                <input
                                    type="text"
                                    value={isFileName}
                                    readOnly
                                    onClick={() => document.getElementById('hidden-file-input').click()}
                                    style={{
                                        width: '100%',
                                        height: 51,
                                        paddingLeft: 40,
                                        boxSizing: 'border-box',
                                        borderRadius: 8,
                                        borderColor: '#A9A9A9',
                                        borderStyle: 'solid',
                                        borderWidth: 1,
                                        cursor: "pointer",
                                        fontFamily: "Prompt-Medium",
                                        fontSize: 17,
                                    }}
                                />
                                <input
                                    type="file"
                                    id="hidden-file-input"
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                />
                            </div>
                            <div style={{ flexDirection: "row", display: "flex", alignSelf: "flex-end", marginTop: 30 }}>
                                <div onClick={() => AddRoom()} style={{ width: 60, height: 40, backgroundColor: "#714B1C", borderRadius: 10, color: "#FFF", alignItems: "center", justifyContent: "center", display: "flex", fontFamily: "Prompt-Medium", fontSize: 20, width: 156, height: 46, cursor: "pointer" }}>
                                    เพิ่ม
                                </div>
                            </div>
                        </div>
                    </Modal >
                </div >
            </>
        )
    }

    const modalInner = () => {
        return (
            <>
                <div style={{}}>
                    <Modal
                        isOpen={modalIsOpenInner}//const [modalIsOpen, setModalIsOpen] = useState(false);ถ้า setตัวหลัง ทรู อันนี้จะขึ้นมา โดยการเชื่อมตัวหน้า Modal เพิ่มเมนู
                        onRequestClose={closeModalInner}
                        contentLabel="Example Modal"
                        style={{
                            overlay: {
                                backgroundColor: 'rgba(0, 0, 0, 0.5)'
                            },
                            content: {
                                width: '60%',
                                height: '40%',
                                margin: 'auto',
                                zIndex: 999999,
                                borderRadius: 10,
                                padding: 20,

                            },

                        }}
                    >
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", }}>
                            <button onClick={closeModalInner} style={{ position: "absolute", right: 10, }}>X</button>
                            <div style={{ fontFamily: "Prompt-Medium", fontSize: 40, color: "#714B1C", alignSelf: "center" }}>
                                เพิ่มห้องพัก
                            </div>
                            <div style={{ flexDirection: "column", display: 'flex', marginTop: 20 }}>
                                <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, color: "#714B1C" }}>
                                    หมายเลขห้องพัก
                                </div>
                                <input
                                    type="text"
                                    value={isNameRoomId}
                                    onChange={handleNameRoomInner}
                                    style={{ width: "100%", height: 51, paddingLeft: 40, boxSizing: "border-box", borderRadius: 8, borderColor: "#A9A9A9", borderStyle: "solid", borderWidth: 1, fontFamily: "Prompt-Medium", fontSize: 17, }}
                                >
                                </input>
                            </div>
                            <div style={{ flexDirection: "column", display: 'flex', marginTop: 20 }}>
                                <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, color: "#714B1C" }}>
                                    รูป
                                </div>
                                <input
                                    type="text"
                                    value={isFileNameInner}
                                    readOnly
                                    onClick={() => document.getElementById('hidden-file-input').click()}
                                    style={{
                                        width: '100%',
                                        height: 51,
                                        paddingLeft: 40,
                                        boxSizing: 'border-box',
                                        borderRadius: 8,
                                        borderColor: '#A9A9A9',
                                        borderStyle: 'solid',
                                        borderWidth: 1,
                                        cursor: "pointer",
                                        fontFamily: "Prompt-Medium",
                                        fontSize: 17,
                                    }}
                                />
                                <input
                                    type="file"
                                    id="hidden-file-input"
                                    style={{ display: 'none' }}
                                    onChange={handleFileChangeInner}
                                />
                            </div>
                            <div style={{ flexDirection: "row", display: "flex", alignSelf: "flex-end", marginTop: 30 }}>
                                <div onClick={() => AddRoomInner()} style={{ width: 60, height: 40, backgroundColor: "#714B1C", borderRadius: 10, color: "#FFF", alignItems: "center", justifyContent: "center", display: "flex", fontFamily: "Prompt-Medium", fontSize: 20, width: 156, height: 46, cursor: "pointer" }}>
                                    เพิ่ม
                                </div>
                            </div>
                        </div>
                    </Modal >
                </div >
            </>
        )
    }

    const modalDelete = () => {
        return (
            <>
                <ModalDelete
                    isOpen={isModalDeleteOpen || isModalDeleteOpenInner}
                    onRequestClose={(isModalDeleteOpen) ? closeModalDelete : closeModalDeleteInner}
                    title={(isModalDeleteOpen) ? "ต้องการลบประเภทห้องพัก?" : "ต้องการลบห้องพัก"}
                    message="คุณต้องการลบห้องพัก ใช่ หรือ ไม่?"
                    onConfirm={(isModalDeleteOpen) ? () => DeleteRoom(isSelectedRoomIndex) : () => DeleteRoomInner(isIndex, isSelectedRoomIndexInner)}
                />
            </>
        )
    }

    const modalEdit = () => {
        return (
            <>
                <ModalEdit
                    isOpen={isModalEditOpen}
                    onRequestClose={closeModalEditRoom}
                    title={"แก้ไขประเภทห้องพัก"}
                    nametype={isNameTypeRoomEdit}
                    price={isPriceRoomEdit}
                    detail={isDetailRoomEdit}
                    fileName={isPicRoomEdit}
                    Capacity={isCapacityEdit} //เพิ่ม
                    size={isSizeEdit} //เพิ่ม
                    PicComponent2={isPicComponent2} //เพิ่ม
                    PicComponent3={isPicComponent3} //เพิ่ม
                    PicComponent4={isPicComponent4} //เพิ่ม
                    //
                    item_placeholder={isSelectedRoomItemxEdit}
                    onNameTypeChange={(e) => setNameTypeRoomEdit(e.target.value)}
                    onPriceChange={(e) => {
                        const value = e.target.value;
                        // กรองเฉพาะตัวเลข
                        const numericValue = value.replace(/\D/g, '');
                        setPriceRoomEdit(numericValue)
                    }}
                    onDetailChange={(e) => setDetailRoomEdit(e.target.value)}
                    onPicChange={handleFileChangeRoomEdit}
                    //เพิ่ม
                    onCapacityChange={(e) => setCapacityEdit(e.target.value)}
                    onSizeChange={(e) => setSizeEdit(e.target.value)}
                    onPicComponent2Change={handleFileChangeRoomPicComponent2Edit}
                    onPicComponent3Change={handleFileChangeRoomPicComponent3Edit}
                    onPicComponent4Change={handleFileChangeRoomPicComponent4Edit}
                    //
                    onConfirm={() => EditRoom(isSelectedRoomItemxEdit, isSelectedRoomIndexEdit)}
                />
            </>
        )
    }

    const modalEditInner = () => {
        return (
            <>
                <ModalEditInner
                    isOpen={isModalEditOpenInner}
                    onRequestClose={closeModalEditRoomInner}
                    title={"แก้ไขห้องพัก"}
                    nametype={isNameTypeRoomEditInner}
                    fileName={isPicRoomEditInner}
                    item_placeholder={isSelectedRoomItemxEditInner}
                    onNameTypeChange={(e) => setNameTypeRoomEditInner(e.target.value)}
                    onPicChange={handleFileChangeRoomEditInner}
                    onConfirm={() => EditRoomInner(isSelectedRoomItemxEditInner, isIndex, isSelectedRoomIndexEditInner)}
                />
            </>
        )
    }

    const modalAlert = () => {
        return (
            <>
                <ModalAlert
                    isOpen={isModalAlert}
                    onRequestClose={() => setModalAlert(false)}
                    title={"คุณกำลังลบห้องที่มีผู้ใช้จองอยู่"}
                    message={"ไม่สามารถลบห้องที่มีผู้ใช้จองอยู่ได้"}
                />
            </>
        )
    }

    return (
        <>
            <div style={{ width: "100%", overflow: "scroll", paddingBottom: (isRoomData.length >= 4) ? 60 : null }}>
                {modal()}
                {modalInner()}
                {modalDelete()}
                {modalEdit()}
                {modalEditInner()}
                {modalAlert()}
                <div style={{ flexDirection: "row", display: "flex", paddingLeft: 20, paddingTop: 20, alignItems: "center" }}>
                    <img
                        src={manageroomIcon} alt="Brief Screen" className="brief-image" style={{ width: 46, height: 46, }}
                    />
                    {(allRoomm === true)
                        ? <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, marginLeft: 20 }}>
                            จัดการประเภทห้องพัก
                        </div>
                        : <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, marginLeft: 20 }}>
                            จัดการห้องพัก {nameTypeRoom}
                        </div>
                    }
                </div >
                <div style={{ FlexDirection: "row", display: "flex", paddingLeft: 19, flexWrap: "wrap", marginTop: 30, gap: 19 }}>
                    <div
                        onClick={(allRoomm === true) ? openModal : openModalInner}
                        style={{
                            backgroundColor: "#FFF", flexDirection: "column", alignItems: "center", justifyContent: "center", display: "flex", width: "22%", boxSizing: "border-box", padding: 8, height: 330, borderRadius: 10, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", cursor: "pointer"
                        }}>
                        <img
                            src={addroomIcon} alt="Brief Screen" className="brief-image" style={{ width: 46, height: 46, }}
                        />
                        {(allRoomm === true)
                            ? <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, }}>
                                จัดการประเภทห้องพัก
                            </div>
                            : <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, }}>
                                เพิ่มห้องพัก
                            </div>
                        }
                    </div>
                    {isRoomData.map((item, index) => (
                        (allRoomm === true)
                            ? <div key={index}
                                onClick={() => handleRoomClick(item, index)}
                                style={{ backgroundColor: "#EEE4D8", flexDirection: "column", display: "flex", width: "22%", boxSizing: "border-box", paddingTop: 19, height: 330, borderRadius: 10, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", cursor: "pointer" }}
                            >
                                <div style={{ display: "flex", alignSelf: "center" }}>
                                    <img
                                        src={item.pic} alt="Brief Screen" className="brief-image" style={{ width: 257, height: 174, }}
                                    />
                                </div>
                                <div style={{ display: "flex", flexDirection: "row", marginTop: 18, marginLeft: 18 }}>
                                    <div style={{ fontFamily: "Prompt-Medium", fontSize: 15, }}>
                                        ประเภทห้อง :
                                    </div>
                                    <div style={{ fontFamily: "Prompt-Medium", fontSize: 15, marginLeft: 9 }}>
                                        {item.name_room}
                                    </div>
                                </div>
                                <div style={{ display: "flex", flexDirection: "row", alignSelf: "center", marginTop: 18 }}>
                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation(); // เพื่อป้องกันการคลิกที่ onClick ของ parent
                                            openModalEditRoom(item, index);
                                        }}
                                        style={{ fontFamily: "Prompt-Medium", fontSize: 20, color: "#FFF", backgroundColor: "#ECE431", borderRadius: 10, width: 123, height: 50, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                                        แก้ไข
                                    </div>
                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation(); // เพื่อป้องกันการคลิกที่ onClick ของ parent
                                            openModalDelete(index);
                                        }}
                                        style={{ fontFamily: "Prompt-Medium", fontSize: 20, marginLeft: 9, color: "#FFF", backgroundColor: "#FF553E", borderRadius: 10, width: 123, height: 50, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                                        ลบ
                                    </div>
                                </div>
                            </div>
                            : <div key={index} style={{ backgroundColor: "#EEE4D8", flexDirection: "column", display: "flex", width: "22%", boxSizing: "border-box", paddingTop: 19, height: 330, borderRadius: 10, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
                                <div style={{ display: "flex", alignSelf: "center" }}>
                                    <img
                                        src={item.pic} alt="Brief Screen" className="brief-image" style={{ width: 257, height: 174, }}
                                    />
                                </div>
                                <div style={{ display: "flex", flexDirection: "row", marginTop: 18, marginLeft: 18 }}>
                                    <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, }}>
                                        ประเภทห้อง :
                                    </div>
                                    <div style={{ fontFamily: "Prompt-Medium", fontSize: 20, marginLeft: 9 }}>
                                        {item.name_room}
                                    </div>
                                </div>
                                <div style={{ display: "flex", flexDirection: "row", alignSelf: "center", marginTop: 18 }}>
                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openModalEditRoomInner(item, index)
                                        }}
                                        style={{ fontFamily: "Prompt-Medium", fontSize: 20, color: "#FFF", backgroundColor: "#ECE431", borderRadius: 10, width: 123, height: 50, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                                        แก้ไข
                                    </div>
                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation(); // เพื่อป้องกันการคลิกที่ onClick ของ parent
                                            openModalDeleteInner(index);
                                        }}
                                        style={{
                                            fontFamily: "Prompt-Medium", fontSize: 20, marginLeft: 9, color: "#FFF", backgroundColor: "#FF553E", borderRadius: 10, width: 123, height: 50, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
                                        }}>
                                        ลบ
                                    </div>
                                </div>
                            </div>
                    ))
                    }
                </div>
            </div>
        </>
    )


}