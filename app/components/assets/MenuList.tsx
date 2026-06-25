import React, { useState } from 'react';
import { Link } from 'react-router';

export function MenuList(props: any) {
    const [popupVisible, setPopupVisible] = useState(false);
    const [iframeUrl, setIframeUrl] = useState('');

    if (props?.menuList?.length === 0) {
        return null;
    }

    const handleLinkClick = (url: string, openInNewTab: boolean) => {
        if (openInNewTab) {
            window.open(url, '_blank');
        } else {
            setIframeUrl(url);
            setPopupVisible(true);
        }
    };

    const closePopup = () => {
        setPopupVisible(false);
        setIframeUrl('');
    };

    return (
        <div id="menu-list" className="">
            <h3 className="text-[24px] mb-[30px]">Menus</h3>
            <div className="flex gap-[30px] max-w-[400px] flex-wrap">
                {props?.menuList?.map((menu: { link: string, name: string, openInNewTab: boolean }, index: number) => (
                    <a
                        className="text-[16px] text-primaryGreen underline cursor-pointer"
                        onClick={() => handleLinkClick(menu.link, menu.openInNewTab)}
                        key={index}
                    >
                        {menu.name}
                    </a>
                ))}
            </div>
            {popupVisible && (
                <div className="fixed top-0 left-0 w-full h-full inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[99]">
                    <div className="relative w-[80%] h-[95vh]">
                        <button className="bg-white p-[5px] rounded-full absolute top-[-10px] right-[-20px]" onClick={closePopup}>
                            <svg
                                width="22"
                                height="20"
                                viewBox="0 0 22 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <line
                                    x1="1"
                                    y1="-1"
                                    x2="26.3636"
                                    y2="-1"
                                    transform="matrix(0.730887 0.682499 -0.730887 0.682499 0 1.3241)"
                                    stroke="black"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <line
                                    x1="1"
                                    y1="-1"
                                    x2="26.3636"
                                    y2="-1"
                                    transform="matrix(-0.730887 0.682499 -0.730887 -0.682499 20 0)"
                                    stroke="black"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                        </button>
                        <iframe src={iframeUrl} className="w-full h-full" />
                    </div>
                </div>
            )}
        </div>
    );
}
