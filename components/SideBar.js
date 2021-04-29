import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import classNames from 'classnames';

const SideBar = () => {

    const router = useRouter();

    const activeCollapse = (link) => { return router.pathname.indexOf(link) > -1; }
    const activeLink = (link) => { return router.pathname === link; }


    return (
        <section>
            <div id="sidebar-nav" className="sidebar">
                <div className="sidebar-scroll">
                    <nav>
                        <ul className="nav">
                            <li><Link href="/"><a className={classNames({ "active": activeLink('/') })}><i className="lnr lnr-pie-chart" aria-hidden></i> <span>Dashboard</span></a></Link></li>
                            <li><Link href="/manage/product"><a className={classNames({ "active": activeLink('/manage/product') })}><i className="lnr lnr-layers" aria-hidden></i> <span>Quản lí sản phẩm</span></a></Link></li>
                            <li><Link href="/manage/brand"><a className={classNames({ "active": activeLink('/manage/brand') })}><i className="lnr lnr-layers" aria-hidden></i> <span>Quản lí thương hiệu</span></a></Link></li>
                            <li><Link href="/manage/category"><a className={classNames({ "active": activeLink('/manage/category') })}><i className="lnr lnr-layers" aria-hidden></i> <span>Quản lí danh mục</span></a></Link></li>
                            <li><Link href="/manage/user"><a className={classNames({ "active": activeLink('/manage/user') })}><i className="lnr lnr-users" aria-hidden></i> <span>Quản lí người dùng</span></a></Link></li>
                            <li><Link href="/manage/seller"><a className={classNames({ "active": activeLink('/manage/seller') })}><i className="lnr lnr-user" aria-hidden></i> <span>Quản lí người bán</span></a></Link></li>
                            <li><Link href="/manage/post"><a className={classNames({ "active": activeLink('/manage/post') })}><i className="lnr lnr-bookmark" aria-hidden></i> <span>Quản lí tin tức</span></a></Link></li>
                            <li><Link href="/manage/report"><a className={classNames({ "active": activeLink('/manage/report') })}><i className="lnr lnr-file-empty" aria-hidden="true"></i> <span>Quản lí báo cáo</span></a></Link></li>
                            <li><Link href="/manage/statistics"><a className={classNames({ "active": activeLink('/manage/statistics') })}><i className="lnr lnr-chart-bars" aria-hidden></i> <span>Thống kê</span></a></Link></li>
                        </ul>
                    </nav>
                </div>
            </div>
        </section>
    )
}

export default SideBar;