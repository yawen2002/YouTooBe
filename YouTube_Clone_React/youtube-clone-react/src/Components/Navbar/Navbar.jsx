import React, { useState } from 'react';
import './Navbar.css';
import menu_icon from '../../assets/menu.png';
import logo from '../../assets/logo.png';
import search_icon from '../../assets/search.png';
import upload_icon from '../../assets/upload.png';
import more_icon from '../../assets/more.png';
import notification_icon from '../../assets/notification.png';
import jack_img from '../../assets/jack.png';
import { Link } from 'react-router-dom';

const Navbar = ({ setSidebar }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const sidebar_toggle = (e) => {
        setSidebar((prev) => prev === false ? true : false);
    };

    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearch = () => {
        if (searchQuery.length) {
            const searchLink = `https://www.youtube.com/results?search_query=${searchQuery}`;
            window.location.href = searchLink;
        }
    };

    return (
        <nav className='flex-div'>
            <div className="nav-left flex-div">
                <img src={menu_icon} alt="" className="menu-icon" onClick={sidebar_toggle} />
                <Link to='/'> <img src={logo} alt="" className="logo" /></Link>
            </div>
            <div className="nav-middle flex-div">
                <div className="search-box flex-div">
                    <input 
                        type="text" 
                        placeholder="Search" 
                        value={searchQuery}
                        onChange={handleInputChange}
                    />
                    <img 
                        src={search_icon} 
                        alt="" 
                        onClick={handleSearch}
                        className="search-icon"
                    />
                </div>
            </div>
            <div className="nav-right flex-div">
                <img src={upload_icon} alt="" />
                <img src={more_icon} alt="" />
                <img src={notification_icon} alt="" />
                <img src={jack_img} alt="" className="user-icon" />
            </div>
        </nav>
    );
};

export default Navbar;
