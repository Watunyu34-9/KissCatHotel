import React, { useRef, useEffect, useState, } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import '../App.css'
import { firebase } from "../backend/backend"
import { FooterInnerRoom } from '../component/footer';
import { Footer } from '../component/footer';
import cameradownload from '../asset/cameradownload.png'
import qrcode from '../asset/qrcode.png'
import pay from '../asset/pay.png'
import right from '../asset/right.png'



export default function ServiceCamera({ navigation }) {
    const navigate = useNavigate();
    const location = useLocation();
    const AdminDatabse = "QvmmP2ELa7cgkgC9MCGzy5xjTy73"

    // const { isMe } = location.state || {};

    const [isMe, setMe] = useState([])
    console.log("isMe: ", isMe);

    // useEffect(() => {
    //     console.log("ServiceCamera..");

    // }, []);

    useEffect(() => {
        navigate('/Service-Camera', { replace: true });
    
        window.history.pushState(null, '', window.location.href);
    
        const handlePopState = () => {
          window.history.pushState(null, '', window.location.href);
        };
    
        window.addEventListener('popstate', handlePopState);
    
        return () => {
          window.removeEventListener('popstate', handlePopState);
        };
      }, [navigate]);

      

    const goBack = () => {
        navigate("/")
    }

    return (
        <>
            <div
                onClick={() => goBack()}
                style={{
                    backgroundColor: '#FFF',
                    fontFamily: 'Itim-Regular',
                    cursor: 'pointer',
                    padding: '20px 40px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 10,
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    fontSize: 24,
                    position: 'absolute',
                    left: 20,
                    top: 200,
                }}
            >
                {'<-'} ย้อนกลับ
            </div>
            <div
                style={{
                    display: 'flex',
                    flex: 1,
                    justifyContent: 'center',
                    marginTop: 90,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    padding: '0px 20px',
                }}
            >
                <div
                    style={{
                        backgroundColor: '#FFF',
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        display: 'flex',
                        marginTop: 40,
                        padding: 40,
                        borderTopLeftRadius: 10,
                        borderBottomLeftRadius: 10,
                    }}
                >
                    <img src={cameradownload} style={{ width: 918, height: 600 }} alt="Camera Download" />
                </div>
                <div
                    style={{
                        backgroundColor: '#FFF',
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        padding: 40,
                        alignItems: 'center',
                        marginTop: 40,
                        justifyContent: 'center',
                        borderBottomRightRadius: 15,
                        borderTopRightRadius: 15,
                    }}
                >
                    <div style={{ fontFamily: 'Itim-Regular', fontSize: 20 }}>แอด Line IP กล้องวงจรปิด</div>
                    <img src={qrcode} style={{ width: 243, height: 233, marginTop: 20 }} alt="QR Code" />
                    <div style={{ flexDirection: 'column', display: 'flex', alignSelf: 'flex-start' }}>
                        <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', marginTop: 20 }}>
                            <img src={pay} style={{ width: 32, height: 32 }} alt="Pay" />
                            <div style={{ fontFamily: 'Itim-Regular', fontSize: 20, color: '#714B1C', marginLeft: 10 }}>ดาวน์โหลด</div>
                        </div>
                        <div style={{ flexDirection: 'column', display: 'flex', fontFamily: 'Itim-Regular', fontSize: 20, cursor: 'pointer' }}>
                            <a
                                href="https://apps.apple.com/th/app/toshy-remote-for-smart-tv/id1444512403?l=th"
                                // style={{ color: '#000' }}
                            >
                                https://apps.apple.com/th/app/toshy-remote-for-smart-tv/id1444512403?l=th
                            </a>
                        </div>
                        <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', marginTop: 20 }}>
                            <img src={pay} style={{ width: 32, height: 32 }} alt="Pay" />
                            <div style={{ fontFamily: 'Itim-Regular', fontSize: 20, color: '#714B1C', marginLeft: 10 }}>ดาวน์โหลด</div>
                        </div>
                        <div style={{ flexDirection: 'column', display: 'flex', fontFamily: 'Itim-Regular', fontSize: 20, cursor: 'pointer' }}>
                            <a
                                href="https://play.google.com/store/apps/details?id=com.toshiba.smartcenter&pcampaignid=web_share"
                                // style={{ color: '#000' }}
                            >
                                https://play.google.com/store/apps/details?id=com.toshiba.smartcenter&pcampaignid=web_share
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};