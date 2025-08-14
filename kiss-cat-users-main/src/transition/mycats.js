import React, { useRef, useEffect, useState, } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import '../App.css'
import { firebase } from "../backend/backend"
import { FooterInnerRoom } from '../component/footer';
import { Footer } from '../component/footer';
import addcat from '../asset/addcat.png'
import trash from '../asset/trash.png'

export default function MyCats({ navigation }) {
    const navigate = useNavigate();
    const AdminDatabse = "QvmmP2ELa7cgkgC9MCGzy5xjTy73"
    const [isUsersCats, setUsersCats] = useState([])
    const [isAddCatsMore, setAddCatsMore] = useState(false)
    //add
    const [isNameCat, setNameCat] = useState("")
    const [isGenderCat, setGenderCat] = useState("")
    const [isBirthdayCat, setBirthdayCat] = useState("")
    const [isBreedCat, setBreedCat] = useState("")
    const [isWeightCat, setWeightCat] = useState("")
    const [isColorCat, setColorCat] = useState("")
    const [isPicCat, setPicCat] = useState("")
    const [isVaccineCatName, setVaccineCatName] = useState("")
    const [isVaccineCatPic, setVaccineCatPic] = useState("")
    //edit
    const [isNameCatEdit, setNameCatEdit] = useState("")
    const [isGenderCatEdit, setGenderCatEdit] = useState("")
    const [isBirthdayCatEdit, setBirthdayCatEdit] = useState("")
    const [isBreedCatEdit, setBreedCatEdit] = useState("")
    const [isWeightCatEdit, setWeightCatEdit] = useState("")
    const [isColorCatEdit, setColorCatEdit] = useState("")
    const [isPicCatEdit, setPicCatEdit] = useState("")
    const [isVaccineCatNameEdit, setVaccineCatNameEdit] = useState("")
    const [isVaccineCatPicEdit, setVaccineCatPicEdit] = useState("")
    //
    const [isEditThisCat, setEditThisCat] = useState(false)
    const [isEditThisCatItem, setEditThisCatItem] = useState({});
    const [isEditThisCatIndex, setEditThisCatIndex] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        console.log("MyCats..");
        getUsersCats();
    }, []);

    const goBack = () => {
        if (isAddCatsMore === true) {
            FinishAddCat()
        } else if (isEditThisCat === true) {
            FinishEditCat()
        } else {
            navigate("/")
        }
    }

    const FinishAddCat = () => {
        setNameCat("")
        setGenderCat("")
        setBirthdayCat("")
        setBreedCat("")
        setWeightCat("")
        setColorCat("")
        setPicCat("")
        setVaccineCatName("")
        setVaccineCatPic("")
        setAddCatsMore(false)
    }

    const FinishEditCat = () => {
        setNameCatEdit("")
        setGenderCatEdit("")
        setBirthdayCatEdit("")
        setBreedCatEdit("")
        setWeightCatEdit("")
        setColorCatEdit("")
        setPicCatEdit("")
        setVaccineCatNameEdit("")
        setVaccineCatPicEdit("")
        setEditThisCat(false)
    }

    const getUsersCats = async () => {
        const isUser = firebase.auth().currentUser.uid;
        const docRef = firebase.firestore().collection('users').doc(isUser);
        docRef.onSnapshot((doc) => {
            if (doc.exists) {
                const data = doc.data().my_cat;
                console.log('เช็คข้อมูล', data);
                setUsersCats(data)
            }
        });
    }


    const handleCatVaccineChange = (event) => {
        console.log("event: ", event);
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            console.log("reader: ", reader);
            reader.onloadend = () => {
                setVaccineCatPic(reader.result);
            };
            reader.readAsDataURL(file);
            setVaccineCatName(event.target.files[0].name)
        } else {
            window.alert('เกิดข้อผิดพลาด ไฟล์ของคุณไม่ใช่ไฟล์รูปภาพ');
            event.target.value = null; // ล้างค่าของ input field
            setVaccineCatName(null);
            setVaccineCatPic(null);
        }
    };

    const handleFileChangeCat = (event) => {
        console.log("event: ", event);
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            console.log("reader: ", reader);
            reader.onloadend = () => {
                setPicCat(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            window.alert('เกิดข้อผิดพลาด ไฟล์ของคุณไม่ใช่ไฟล์รูปภาพ');
            event.target.value = null; // ล้างค่าของ input field
            setPicCat(null);
        }
    };

    const handleCatVaccineChangeEdit = (event) => {
        console.log("event: ", event);
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            console.log("reader: ", reader);
            reader.onloadend = () => {
                setVaccineCatPicEdit(reader.result);
            };
            reader.readAsDataURL(file);
            setVaccineCatNameEdit(event.target.files[0].name)
        } else {
            window.alert('เกิดข้อผิดพลาด ไฟล์ของคุณไม่ใช่ไฟล์รูปภาพ');
            event.target.value = null; // ล้างค่าของ input field
            setVaccineCatNameEdit(null);
            setVaccineCatPicEdit(null);
        }
    };

    const handleFileChangeCatEdit = (event) => {
        console.log("event: ", event);
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            console.log("reader: ", reader);
            reader.onloadend = () => {
                setPicCatEdit(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            window.alert('เกิดข้อผิดพลาด ไฟล์ของคุณไม่ใช่ไฟล์รูปภาพ');
            event.target.value = null; // ล้างค่าของ input field
            setPicCatEdit(null);
        }
    };

    const goAddCats = async () => {
        const isUser = firebase.auth().currentUser.uid;
        try {
            console.log("23423: ",
                isNameCat,
                isGenderCat,
                isBirthdayCat,
                isBreedCat,
                isWeightCat,
                isColorCat);
            if (!isNameCat || !isPicCat || !isVaccineCatPic) {
                window.alert("กรุณากรอกข้อมูลที่จำเป็นให้ครบ ชื่อแมว รูปแมว และรูปภาพรับวัคซีนแมว");
                return;
            } else {
                console.log("...addnew ");
                const firestore = firebase.firestore();
                const userRef = firestore.collection('users').doc(isUser);
                const doc = await userRef.get();
                if (!doc.exists || !doc.data().my_cat) {
                    await userRef.set({ my_cat: [] }, { merge: true });
                }
                const lastItemId = doc.data().my_cat.length > 0 ? doc.data().my_cat[doc.data().my_cat.length - 1].id : 0;
                const newItemId = lastItemId + 1;
                const storageRef = firebase.storage().ref();
                //รูปแมว
                const imageRef = storageRef.child(`${isUser}/cat/${newItemId}`);
                await imageRef.putString(isPicCat, 'data_url');
                const imageUrl = await imageRef.getDownloadURL();
                //รูปวัคซีนแมว
                const imageVaccineRef = storageRef.child(`${isUser}/cat/vaccine/${newItemId}`);
                await imageVaccineRef.putString(isVaccineCatPic, 'data_url');
                const imageVaccineUrl = await imageVaccineRef.getDownloadURL();
                await userRef.update({
                    my_cat: firebase.firestore.FieldValue.arrayUnion({
                        id: newItemId,
                        pic_cat: imageUrl,
                        name_cat: isNameCat,
                        gender_cat: isGenderCat,
                        birthday_cat: isBirthdayCat,
                        vaccine_cat: imageVaccineUrl,
                        breed_cat: isBreedCat,
                        weight_cat: isWeightCat,
                        color_cat: isColorCat
                    }),
                });

                // อัปเดตข้อมูลใน collection admin
                const adminRef = firestore.collection('admin').doc(AdminDatabse);
                const adminDoc = await adminRef.get();
                if (adminDoc.exists) {
                    const adminData = adminDoc.data();
                    const manageUsers = adminData.my_manageusers || [];
                    const userIndex = manageUsers.findIndex(user => user.users_uid === isUser);

                    if (userIndex !== -1) {
                        const userManageData = manageUsers[userIndex];
                        userManageData.catdata = userManageData.catdata || [];
                        userManageData.catdata.push({
                            id: newItemId,
                            pic_cat: imageUrl,
                            name_cat: isNameCat,
                            gender_cat: isGenderCat,
                            birthday_cat: isBirthdayCat,
                            vaccine_cat: imageVaccineUrl,
                            breed_cat: isBreedCat,
                            weight_cat: isWeightCat,
                            color_cat: isColorCat
                        });
                        // อัปเดตข้อมูลที่เปลี่ยนแปลงใน Firestore
                        manageUsers[userIndex] = userManageData;
                        await adminRef.update({ my_manageusers: manageUsers });
                    }
                }
                FinishAddCat()
            }

        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการอัปเดตข้อมูล:', error);
        }
    };

    const DeleteCats = async (item, index) => {
        console.log("DeleteCats item: ", item);
        console.log("DeleteCats index: ", index);
        const isUser = firebase.auth().currentUser.uid;
        try {
            // ถามผู้ใช้ว่าต้องการลบแมวหรือไม่
            const confirmation = window.confirm('คุณต้องการลบแมวนี้หรือไม่?');

            // ถ้าผู้ใช้กด "Cancel" หรือปุ่มปิดก็ไม่ต้องทำอะไร
            if (!confirmation) {
                return;
            }
            //อัพเดท users
            const userRef = firebase.firestore().collection('users').doc(isUser);
            const doc = await userRef.get();
            if (doc.exists) {
                const userData = doc.data();
                // รับชื่อ id ของแมวที่ต้องการลบ
                const deletedCatId = userData.my_cat[index].id;
                console.log("deletedCatId: ", deletedCatId);

                // ลบออกจากฟิลด์ my_cat โดยใช้ index
                userData.my_cat.splice(index, 1);

                // อัปเดตข้อมูลใน Firestore
                await userRef.update({ my_cat: userData.my_cat });

                // ลบรูปภาพที่เกี่ยวข้องกับใน Firebase Storage
                const storageRef = firebase.storage().ref();
                const imageRef = storageRef.child(`${isUser}/cat/${deletedCatId}`);
                await imageRef.delete();
                const imageVaccineRef = storageRef.child(`${isUser}/cat/vaccine/${deletedCatId}`);
                await imageVaccineRef.delete();

            }

            // อัปเดตข้อมูลใน collection admin
            const adminRef = firebase.firestore().collection('admin').doc(AdminDatabse);
            const adminDoc = await adminRef.get();
            if (adminDoc.exists) {
                const adminData = adminDoc.data();
                const manageUsers = adminData.my_manageusers || [];
                const userIndex = manageUsers.findIndex(user => user.users_uid === isUser);

                if (userIndex !== -1) {
                    const userManageData = manageUsers[userIndex];
                    const catIndex = userManageData.catdata.findIndex(cat => cat.id === item.id);

                    if (catIndex !== -1) {
                        // ลบออกจากฟิลด์ catdata โดยใช้ catIndex
                        userManageData.catdata.splice(catIndex, 1);

                        // อัปเดตข้อมูลที่เปลี่ยนแปลงใน Firestore
                        manageUsers[userIndex] = userManageData;
                        await adminRef.update({ my_manageusers: manageUsers });
                    }
                }
            }

        } catch (error) {
            console.log("error: ", error);
        }
    }

    const goEditThisCat = (item, index) => {
        setEditThisCat(true);
        setEditThisCatItem(item);
        setEditThisCatIndex(index);

    }

    const EditCats = async (item, index) => {
        console.log("EditCats item: ", item);
        console.log("EditCats index: ", index);
        const isUser = firebase.auth().currentUser.uid;

        try {
            const storageRef = firebase.storage().ref();
            const imageRef = storageRef.child(`${isUser}/cat/${item.id}`);
            const imageVaccineRef = storageRef.child(`${isUser}/cat/vaccine/${item.id}`);
            //รูปแมว
            if (isPicCatEdit) {
                await imageRef.putString(isPicCatEdit, 'data_url');
            }
            const imageUrl = await imageRef.getDownloadURL();
            //วัคซีนแมว
            if (isVaccineCatPicEdit) {
                await imageVaccineRef.putString(isVaccineCatPicEdit, 'data_url');
            }
            const imageVaccineUrl = await imageVaccineRef.getDownloadURL();

            const firestore = firebase.firestore();
            const userRef = firestore.collection('users').doc(isUser);

            const snapshot = await userRef.get();
            if (snapshot.exists) {
                const userData = snapshot.data();
                const cats = userData.my_cat;
                const updatedCats = cats.map((cat, idx) => {
                    if (idx === index) {
                        return {
                            ...cat,
                            birthday_cat: isBirthdayCatEdit || cat.birthday_cat,
                            breed_cat: isBreedCatEdit || cat.breed_cat,
                            color_cat: isColorCatEdit || cat.color_cat,
                            gender_cat: isGenderCatEdit || cat.gender_cat,
                            name_cat: isNameCatEdit || cat.name_cat,
                            pic_cat: imageUrl || cat.pic_cat,
                            vaccine_cat: imageVaccineUrl || cat.vaccine_cat,
                            weight_cat: isWeightCatEdit || cat.weight_cat,
                        };
                    }
                    return cat;
                });

                await userRef.update({
                    my_cat: updatedCats,
                });

                // อัปเดตข้อมูลใน collection admin
                const adminRef = firebase.firestore().collection('admin').doc(AdminDatabse);
                const adminDoc = await adminRef.get();
                if (adminDoc.exists) {
                    const adminData = adminDoc.data();
                    const manageUsers = adminData.my_manageusers || [];
                    const userIndex = manageUsers.findIndex(user => user.users_uid === isUser);

                    if (userIndex !== -1) {
                        const userManageData = manageUsers[userIndex];
                        const updatedCatData = userManageData.catdata.map((cat, idx) => {
                            if (idx === index) {
                                return {
                                    ...cat,
                                    birthday_cat: isBirthdayCatEdit || cat.birthday_cat,
                                    breed_cat: isBreedCatEdit || cat.breed_cat,
                                    color_cat: isColorCatEdit || cat.color_cat,
                                    gender_cat: isGenderCatEdit || cat.gender_cat,
                                    name_cat: isNameCatEdit || cat.name_cat,
                                    pic_cat: imageUrl || cat.pic_cat,
                                    vaccine_cat: imageVaccineUrl || cat.vaccine_cat,
                                    weight_cat: isWeightCatEdit || cat.weight_cat,
                                };
                            }
                            return cat;
                        });

                        manageUsers[userIndex].catdata = updatedCatData;

                        await adminRef.update({
                            my_manageusers: manageUsers
                        });
                    }
                }

                FinishEditCat();
            } else {
                console.log('ไม่พบข้อมูลผู้ใช้');
            }
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการแก้ไขเมนู:', error);
        }
    };


    return (
        <>
            <div style={{ marginLeft: 20, marginRight: 20, overflowY: (isUsersCats.length > 3) ? "auto" : null }}>
                <div style={{ marginTop: 40, flexDirection: "row", display: "flex", justifyContent: "space-between" }}>
                    <div onClick={() => goBack()} style={{ backgroundColor: "#FFF", fontFamily: "Itim-Regular", cursor: "pointer", padding: "20px 40px", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: 10, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", fontSize: 24 }}>
                        {"<-"} ย้อนกลับ
                    </div>
                    {(isUsersCats.length === 0 || isAddCatsMore === true || isEditThisCat === true)
                        ? null
                        : <div style={{ fontFamily: "Itim-Regular", display: "flex", justifyContent: "center", alignItems: "center", fontSize: 32 }}>
                            แมวของฉัน
                        </div>
                    }
                    {(isUsersCats.length === 0 || isAddCatsMore === true || isEditThisCat === true)
                        ? null
                        : <div
                            onClick={() => setAddCatsMore(true)}
                            style={{ backgroundColor: "#40A578", fontFamily: "Itim-Regular", cursor: "pointer", padding: "20px 40px", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: 10, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", color: "#FFF", fontSize: 24 }}>
                            เพิ่มแมว
                        </div>
                    }
                </div>
                {(isUsersCats.length === 0 || isAddCatsMore === true || isEditThisCat === true)
                    ? <div style={{ marginTop: 40, flexDirection: "column", display: "flex", backgroundColor: "#FFF", width: "100%", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", borderRadius: 10 }}>
                        <div style={{ flexDirection: "row", display: "flex", justifyContent: "space-around", marginTop: 20, marginBottom: 50 }}>
                            <div style={{ flexDirection: "column", display: "flex", alignItems: "center", flex: 1, marginLeft: 50, marginRight: 50 }}>
                                <div style={{ fontFamily: "Itim-Regular", fontSize: 32, marginTop: 20, marginBottom: 30, paddingBottom: 30 }}>
                                    เพิ่มแมว
                                </div>
                                {(isUsersCats.length === 0 || isAddCatsMore === true)
                                    // ของคนที่ไม่มีแมวซักตัว หรือ ตอนแอดเพิ่ม
                                    ? (isPicCat === "")
                                        //แสดง layout แอดรูป
                                        ? <div>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                style={{ display: 'none' }}
                                                onChange={handleFileChangeCat}
                                                accept="image/*"
                                            />
                                            <div
                                                onClick={() => fileInputRef.current.click()}
                                                style={{
                                                    width: 326, height: 300, fontFamily: "Itim-Regular", fontSize: 32, display: "flex",
                                                    alignItems: "center", justifyContent: "center", borderRadius: 10, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                                    cursor: "pointer"
                                                }}>
                                                + รูป
                                            </div >
                                        </div >
                                        // แสดงรูปที่เลือกตอนเพิ่มแมว
                                        : <div style={{ cursor: "pointer" }}>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                style={{ display: 'none' }}
                                                onChange={handleFileChangeCat}
                                                accept="image/*"
                                            />
                                            <img
                                                src={isPicCat} alt="Brief Screen" className="brief-image"
                                                onClick={() => fileInputRef.current.click()}
                                                style={{
                                                    width: 326, height: 300, fontFamily: "Itim-Regular", fontSize: 32, display: "flex", borderRadius: 10
                                                }}
                                            />
                                        </div >
                                    // ของคนที่คลิกรูปแมวมา
                                    : (isPicCatEdit === "")
                                        ? <div style={{ cursor: "pointer" }}>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                style={{ display: 'none' }}
                                                onChange={handleFileChangeCatEdit}
                                                accept="image/*"
                                            />
                                            <img
                                                src={isEditThisCatItem.pic_cat} alt="Brief Screen" className="brief-image"
                                                onClick={() => fileInputRef.current.click()}
                                                style={{
                                                    width: 326, height: 300, fontFamily: "Itim-Regular", fontSize: 32, display: "flex", borderRadius: 10
                                                }}
                                            />
                                        </div >
                                        : <div style={{ cursor: "pointer" }}>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                style={{ display: 'none' }}
                                                onChange={handleFileChangeCatEdit}
                                                accept="image/*"
                                            />
                                            <img
                                                src={isPicCatEdit} alt="Brief Screen" className="brief-image"
                                                onClick={() => fileInputRef.current.click()}
                                                style={{
                                                    width: 326, height: 300, fontFamily: "Itim-Regular", fontSize: 32, display: "flex", borderRadius: 10
                                                }}
                                            />
                                        </div >
                                }
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", flex: 1, marginLeft: 50, marginRight: 50, justifyContent: "space-between", }}>
                                <div>
                                    <div style={{ fontFamily: "Itim-Regular", fontSize: 24, marginBottom: 15, wordWrap: "break-word", whiteSpace: "normal" }}>
                                        ชื่อแมว :
                                    </div>
                                    <input
                                        type="text"
                                        value={(isUsersCats.length === 0 || isAddCatsMore === true) ? isNameCat : isNameCatEdit}
                                        onChange={(e) => {
                                            (isUsersCats.length === 0 || isAddCatsMore === true)
                                                ? setNameCat(e.target.value)
                                                : setNameCatEdit(e.target.value)
                                        }}
                                        style={{ width: "100%", height: 51, paddingLeft: 40, boxSizing: "border-box", borderRadius: 8, borderColor: "#A9A9A9", borderStyle: "solid", borderWidth: 1, fontFamily: "Prompt-Medium", fontSize: 17, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
                                        placeholder={(isUsersCats.length === 0 || isAddCatsMore === true) ? null : `${isEditThisCatItem.name_cat}`}
                                    />
                                </div>
                                <div>
                                    <div style={{ fontFamily: "Itim-Regular", fontSize: 24, marginBottom: 15, wordWrap: "break-word", whiteSpace: "normal" }}>
                                        เพศแมว:
                                    </div>
                                    <select
                                        value={(isUsersCats.length === 0 || isAddCatsMore === true) ? isGenderCat : isGenderCatEdit}
                                        onChange={(e) => {
                                            (isUsersCats.length === 0 || isAddCatsMore === true)
                                                ? setGenderCat(e.target.value)
                                                : setGenderCatEdit(e.target.value)
                                        }}
                                        style={{
                                            width: "100%",
                                            height: 51,
                                            paddingLeft: 40,
                                            boxSizing: "border-box",
                                            borderRadius: 8,
                                            borderColor: "#A9A9A9",
                                            borderStyle: "solid",
                                            borderWidth: 1,
                                            fontFamily: "Prompt-Medium",
                                            fontSize: 17,
                                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                            wordWrap: "break-word", whiteSpace: "normal"
                                        }}
                                    >
                                        {(isUsersCats.length === 0 || isAddCatsMore === true) ? (
                                            <>
                                                <option value=""></option>
                                                <option value="ตัวผู้">ตัวผู้</option>
                                                <option value="ตัวเมีย">ตัวเมีย</option>
                                            </>
                                        ) : isEditThisCatItem.gender_cat === "ตัวผู้" ? (
                                            <>
                                                <option value="ตัวผู้">ตัวผู้</option>
                                                <option value="ตัวเมีย">ตัวเมีย</option>
                                            </>
                                        ) : (
                                            <>
                                                <option value="ตัวเมีย">ตัวเมีย</option>
                                                <option value="ตัวผู้">ตัวผู้</option>
                                            </>
                                        )}
                                    </select>
                                </div>
                                <div >
                                    <div style={{ fontFamily: "Itim-Regular", fontSize: 24, marginBottom: 15, wordWrap: "break-word", whiteSpace: "normal" }}>
                                        วันเกิดแมว :
                                    </div>
                                    <input
                                        type="text"
                                        value={(isUsersCats.length === 0 || isAddCatsMore === true) ? isBirthdayCat : isBirthdayCatEdit}
                                        onChange={(e) => {
                                            (isUsersCats.length === 0 || isAddCatsMore === true)
                                                ? setBirthdayCat(e.target.value)
                                                : setBirthdayCatEdit(e.target.value)
                                        }}
                                        style={{ width: "100%", height: 51, paddingLeft: 40, boxSizing: "border-box", borderRadius: 8, borderColor: "#A9A9A9", borderStyle: "solid", borderWidth: 1, fontFamily: "Prompt-Medium", fontSize: 17, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
                                        placeholder={(isUsersCats.length === 0 || isAddCatsMore === true) ? null : `${isEditThisCatItem.birthday_cat}`}
                                    />
                                </div>
                                <div style={{ position: 'relative', width: 'fit-content' }}>
                                    <div style={{ fontFamily: "Itim-Regular", fontSize: 24, marginBottom: 20, wordWrap: "break-word", whiteSpace: "normal" }}>
                                        สมุดรับวัคซีนแมว :
                                    </div>
                                    <div style={{ display: "flex" }}>
                                        <input
                                            type="file"
                                            style={{
                                                display: 'none',
                                            }}
                                            id="file-upload"
                                            onChange={(isUsersCats.length === 0 || isAddCatsMore === true) ? handleCatVaccineChange : handleCatVaccineChangeEdit}
                                            placeholder={(isUsersCats.length === 0 || isAddCatsMore === true) ? null : `${isEditThisCatItem.vaccine_cat}`}
                                        />
                                        <label
                                            htmlFor="file-upload"
                                            style={{
                                                padding: '10px 20px',
                                                display: 'inline-block',
                                                borderRadius: 10,
                                                cursor: 'pointer',
                                                backgroundColor: '#57DDC5',
                                                color: '#FFF',
                                                fontFamily: 'Itim-Regular',
                                                fontSize: '16px',
                                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
                                            }}
                                        >
                                            <img
                                                src={addcat} alt="Brief Screen" className="brief-image"
                                                style={{
                                                    width: 16, height: 14, marginRight: 10
                                                }}
                                            />
                                            อัปโหลดรูป
                                            {/* {fileName || 'เลือกไฟล์'} */}
                                        </label>
                                        <div style={{ fontFamily: "Itim-Regular", fontSize: 18, display: "flex", alignItems: "flex-end", marginLeft: 20 }}>
                                            {(isUsersCats.length === 0 || isAddCatsMore === true) ? isVaccineCatName : isVaccineCatNameEdit}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", flex: 1, marginLeft: 50, marginRight: 50, justifyContent: "space-between" }}>
                                <div>
                                    <div style={{ fontFamily: "Itim-Regular", fontSize: 24, marginBottom: 15 }}>
                                        พันธ์แมว :
                                    </div>
                                    <input
                                        type="text"
                                        value={(isUsersCats.length === 0 || isAddCatsMore === true) ? isBreedCat : isBreedCatEdit}
                                        onChange={(e) => {
                                            (isUsersCats.length === 0 || isAddCatsMore === true)
                                                ? setBreedCat(e.target.value)
                                                : setBreedCatEdit(e.target.value)
                                        }}
                                        style={{ width: "100%", height: 51, paddingLeft: 40, boxSizing: "border-box", borderRadius: 8, borderColor: "#A9A9A9", borderStyle: "solid", borderWidth: 1, fontFamily: "Prompt-Medium", fontSize: 17, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
                                        placeholder={(isUsersCats.length === 0 || isAddCatsMore === true) ? null : `${isEditThisCatItem.breed_cat}`}
                                    />
                                </div>
                                <div style={{}}>
                                    <div style={{ fontFamily: "Itim-Regular", fontSize: 24, marginBottom: 15 }}>
                                        น้ำหนักแมว :
                                    </div>
                                    <input
                                        type="text"
                                        value={(isUsersCats.length === 0 || isAddCatsMore === true) ? isWeightCat : isWeightCatEdit}
                                        onChange={(e) => {
                                            (isUsersCats.length === 0 || isAddCatsMore === true)
                                                ? setWeightCat(e.target.value)
                                                : setWeightCatEdit(e.target.value)
                                        }}
                                        style={{ width: "100%", height: 51, paddingLeft: 40, boxSizing: "border-box", borderRadius: 8, borderColor: "#A9A9A9", borderStyle: "solid", borderWidth: 1, fontFamily: "Prompt-Medium", fontSize: 17, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
                                        placeholder={(isUsersCats.length === 0 || isAddCatsMore === true) ? null : `${isEditThisCatItem.weight_cat}`}
                                    />
                                </div>
                                <div style={{ marginBottom: 27 }}>
                                    <div style={{ fontFamily: "Itim-Regular", fontSize: 24, marginBottom: 15 }}>
                                        สีแมว :
                                    </div>
                                    <input
                                        type="text"
                                        value={(isUsersCats.length === 0 || isAddCatsMore === true) ? isColorCat : isColorCatEdit}
                                        onChange={(e) => {
                                            (isUsersCats.length === 0 || isAddCatsMore === true)
                                                ? setColorCat(e.target.value)
                                                : setColorCatEdit(e.target.value)
                                        }}
                                        style={{ width: "100%", height: 51, paddingLeft: 40, boxSizing: "border-box", borderRadius: 8, borderColor: "#A9A9A9", borderStyle: "solid", borderWidth: 1, fontFamily: "Prompt-Medium", fontSize: 17, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
                                        placeholder={(isUsersCats.length === 0 || isAddCatsMore === true) ? null : `${isEditThisCatItem.color_cat}`}
                                    />
                                </div>
                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <div
                                        onClick={() => { (isUsersCats.length === 0 || isAddCatsMore === true) ? goAddCats() : EditCats(isEditThisCatItem, isEditThisCatIndex) }}
                                        style={{ fontFamily: "Itim-Regular", fontSize: 24, backgroundColor: "#40A578", borderRadius: 10, color: "#FFF", padding: "15px 65px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", cursor: "pointer" }}>
                                        บันทึก
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>//เพิ่มแมว แก้แมว
                    : <div style={{
                        marginTop: 40,
                        paddingBottom: 50,
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "20px", // ปรับ gap ระหว่างไอเท็ม,
                    }}>
                        {isUsersCats.map((item, index) => (
                            <div
                                key={index}
                                style={{
                                    backgroundColor: "#FFF",
                                    padding: 20,
                                    borderRadius: 10,
                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    height: 511,
                                    position: "relative",
                                }}>
                                <div
                                    onClick={() => DeleteCats(item, index)}
                                    style={{ position: "absolute", top: 15, right: 15, cursor: "pointer" }}
                                >
                                    <img
                                        src={trash} alt="Brief Screen" className="brief-image" style={{ width: 30, height: 33 }}
                                    />
                                </div>
                                <div
                                    onClick={() => goEditThisCat(item, index)}
                                    style={{ backgroundColor: "#FFF", position: "absolute", cursor: "pointer", alignItems: "center", display: "flex", justifyContent: "center", borderRadius: 10, padding: "20px 40px", borderWidth: 1, borderStyle: "solid", bottom: 40, left: "40%", fontFamily: "Itim-Regular", fontSize: 24, }}>
                                    แก้ไข
                                </div>
                                <div style={{}}>
                                    <img
                                        src={item.pic_cat} alt="Brief Screen" className="brief-image" style={{ width: 249, height: 280, borderRadius: 10 }}
                                    />
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", width: "100%", height: 280, justifyContent: "space-between", paddingLeft: 25 }}>
                                    <div style={{
                                        fontFamily: "Itim-Regular",
                                        fontSize: 32,
                                        wordWrap: "break-word",
                                        whiteSpace: "normal",
                                    }}>
                                        {item.name_cat}
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "row" }}>
                                        <div style={{
                                            fontFamily: "Itim-Regular",
                                            fontSize: 18,
                                            wordWrap: "break-word",
                                            whiteSpace: "normal",
                                            textAlign: "center",
                                        }}>
                                            พันธ์แมว :
                                        </div>
                                        {(item.breed_cat !== "")
                                            ? <div style={{
                                                fontFamily: "Itim-Regular",
                                                fontSize: 18,
                                                wordWrap: "break-word",
                                                whiteSpace: "normal",
                                                textAlign: "center",
                                                marginLeft: 10
                                            }}>
                                                {item.breed_cat}
                                            </div>
                                            : <div style={{
                                                fontFamily: "Itim-Regular",
                                                fontSize: 18,
                                                wordWrap: "break-word",
                                                whiteSpace: "normal",
                                                textAlign: "center",
                                                marginLeft: 10,
                                                color: "red"
                                            }}>
                                                ยังไม่ได้ระบุ
                                            </div>
                                        }
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "row" }}>
                                        <div style={{
                                            fontFamily: "Itim-Regular",
                                            fontSize: 18,
                                            wordWrap: "break-word",
                                            whiteSpace: "normal",
                                            textAlign: "center",
                                        }}>
                                            เพศแมว :
                                        </div>
                                        {(item.gender_cat !== "")
                                            ? <div style={{
                                                fontFamily: "Itim-Regular",
                                                fontSize: 18,
                                                wordWrap: "break-word",
                                                whiteSpace: "normal",
                                                textAlign: "center",
                                                marginLeft: 10
                                            }}>
                                                {item.gender_cat}
                                            </div>
                                            : <div style={{
                                                fontFamily: "Itim-Regular",
                                                fontSize: 18,
                                                wordWrap: "break-word",
                                                whiteSpace: "normal",
                                                textAlign: "center",
                                                marginLeft: 10,
                                                color: "red"
                                            }}>
                                                ยังไม่ได้ระบุ
                                            </div>
                                        }
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "row" }}>
                                        <div style={{
                                            fontFamily: "Itim-Regular",
                                            fontSize: 18,
                                            wordWrap: "break-word",
                                            whiteSpace: "normal",
                                            textAlign: "center",
                                        }}>
                                            น้ำหนักแมว :
                                        </div>
                                        {(item.weight_cat !== "")
                                            ? <div style={{
                                                fontFamily: "Itim-Regular",
                                                fontSize: 18,
                                                wordWrap: "break-word",
                                                whiteSpace: "normal",
                                                textAlign: "center",
                                                marginLeft: 10
                                            }}>
                                                {item.weight_cat}
                                            </div>
                                            : <div style={{
                                                fontFamily: "Itim-Regular",
                                                fontSize: 18,
                                                wordWrap: "break-word",
                                                whiteSpace: "normal",
                                                textAlign: "center",
                                                marginLeft: 10,
                                                color: "red"
                                            }}>
                                                ยังไม่ได้ระบุ
                                            </div>
                                        }
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "row" }}>
                                        <div style={{
                                            fontFamily: "Itim-Regular",
                                            fontSize: 18,
                                            wordWrap: "break-word",
                                            whiteSpace: "normal",
                                            textAlign: "center",
                                        }}>
                                            วันเกิด :
                                        </div>
                                        {(item.birthday_cat !== "")
                                            ? <div style={{
                                                fontFamily: "Itim-Regular",
                                                fontSize: 18,
                                                wordWrap: "break-word",
                                                whiteSpace: "normal",
                                                textAlign: "center",
                                                marginLeft: 10
                                            }}>
                                                {item.birthday_cat}
                                            </div>
                                            : <div style={{
                                                fontFamily: "Itim-Regular",
                                                fontSize: 18,
                                                wordWrap: "break-word",
                                                whiteSpace: "normal",
                                                textAlign: "center",
                                                marginLeft: 10,
                                                color: "red"
                                            }}>
                                                ยังไม่ได้ระบุ
                                            </div>
                                        }
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "row" }}>
                                        <div style={{
                                            fontFamily: "Itim-Regular",
                                            fontSize: 18,
                                            wordWrap: "break-word",
                                            whiteSpace: "normal",
                                            textAlign: "center",
                                        }}>
                                            สีแมว :
                                        </div>
                                        {(item.color_cat !== "")
                                            ? <div style={{
                                                fontFamily: "Itim-Regular",
                                                fontSize: 18,
                                                wordWrap: "break-word",
                                                whiteSpace: "normal",
                                                textAlign: "center",
                                                marginLeft: 10
                                            }}>
                                                {item.color_cat}
                                            </div>
                                            : <div style={{
                                                fontFamily: "Itim-Regular",
                                                fontSize: 18,
                                                wordWrap: "break-word",
                                                whiteSpace: "normal",
                                                textAlign: "center",
                                                marginLeft: 10,
                                                color: "red"
                                            }}>
                                                ยังไม่ได้ระบุ
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>//แสดงแมว
                }
            </div >

        </>

    );
};