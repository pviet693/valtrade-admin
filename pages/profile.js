import Head from 'next/head';
import { useRef } from 'react';

const Profile = () => {
    const imageFile = useRef(null);

    const addImageFile = (e) => {
        e.preventDefault();
        // const file = e.target;
        // if (!file) return;
        // let tempImages = images;
        // tempImages.identifiedFront = file;
        // setImages(tempImages);
        
        // let tempUrl = urlImages;
        // tempUrl.identifiedFront = URL.createObjectURL(file);
        // setUrlImages({ ...tempUrl });
    }
    return (
        <>
            <Head>
                Tài khoản
            </Head>
            <div className="profile-container">
                <div className="profile-admin-title">
                    Thông tin tài khoản
                </div>
                <div className="profile-admin-content">
                    <div className="profile-admin-left">
                        <div className="profile-admin-photo">
                            <header>
                                <h4>Ảnh đại diện</h4>
                            </header>
                            <div className="profile-admin-photo-content">
                                <img className="image-photo" src="/static/assets/img/user5.png" alt="" />
                                <div className="box-imagefile">
                                    <input type="file" accept="image/*" ref={imageFile} onChange={addImageFile} style={{
                                        opacity: 0,
                                        visibility: 'hidden',
                                        position: 'fixed',
                                        left: '-1000px',
                                        display: 'none',
                                    }}/>
                                    <p onClick={()=>{
                                        imageFile.current.click();
                                    }} className="text-add-file">Add File</p>
                                    <div className="d-flex flex-column">
                                        <p>1. Kích thước: Tối đa 5Mb</p>
                                        <p>2. Định dạng: jpg, png</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className="profile-admin-information">
                            <header className="information-title">
                                Thông tin cá nhân
                            </header>
                            <div className="infomation-content">
                                <div className="form-group row align-items-center d-flex">
                                    <label htmlFor="name" className="col-md-3 col-form-label">Tên</label>
                                    <div className="col-md-9">
                                        <input type="text" className="form-control" id="name" placeholder="Tên người bán" name="name" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>                    
                    <div className="profile-admin-right">
                        
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile;