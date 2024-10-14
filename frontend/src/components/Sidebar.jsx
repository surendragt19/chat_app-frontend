import React, { useState } from 'react';
import { BiSearchAlt2 } from 'react-icons/bi';
import OtherUsers from './OtherUsers';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setAuthUser, setOtherUsers, setSelectedUser } from '../redux/userSlice';
import { setMessages } from '../redux/messageSlice';
// import { BASE_URL } from '..';

const Sidebar = () => {
    const [search, setSearch] = useState("");
    const [isVisible, setIsVisible] = useState(true); // State for visibility
    const { otherUsers } = useSelector(store => store.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/v1/user/logout`);
            navigate("/login");
            toast.success(res.data.message);
            dispatch(setAuthUser(null));
            dispatch(setMessages(null));
            dispatch(setOtherUsers(null));
            dispatch(setSelectedUser(null));
        } catch (error) {
            console.log(error);
        }
    }

    const searchSubmitHandler = (e) => {
        e.preventDefault();
        const conversationUser = otherUsers?.find((user) => user.fullName.toLowerCase().includes(search.toLowerCase()));
        if (conversationUser) {
            dispatch(setOtherUsers([conversationUser]));
        } else {
            toast.error("User not found!");
        }
    }

    const toggleVisibility = () => {
        setIsVisible(prev => !prev);
    }

    return (
        <div className="relative">
            {/* Toggle button always visible */}
            {!isVisible && (
                <button 
                    onClick={toggleVisibility} 
                    className="btn btn-sm fixed top-4 right-4 z-50 bg-zinc-200 text-black"
                >
                    Show User
                </button>
            )}
            {/* Sidebar content */}
            {isVisible && (
                <div className='border-r border-slate-500 p-4 flex flex-col h-[550px]'>
                    <form onSubmit={searchSubmitHandler} action="" className='flex items-center gap-2'>
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className='input input-bordered rounded-md' type="text"
                            placeholder='Search...'
                        />
                        <button type='submit' className='btn bg-zinc-700 text-white'>
                            <BiSearchAlt2 className='w-6 h-6 outline-none'/>
                        </button>
                    </form>
                    <div className="divider px-3"></div>
                    <OtherUsers />
                    <div className='mt-2'>
                        <button onClick={logoutHandler} className='btn btn-sm'>Logout</button>
                        <button onClick={toggleVisibility} className='btn btn-sm ml-2'>
                            Hide User
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Sidebar;
