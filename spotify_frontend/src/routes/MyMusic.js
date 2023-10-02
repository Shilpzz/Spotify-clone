import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import spotify_logo from "../assets/images/spotify_logo_white.svg";
import IconText from "../components/shared/IconText";
import TextWithHover from "../components/shared/TextWithHover";
import SingleSongCard from "../components/shared/SingleSongCard";
import { makeAuthenticatedGETRequest } from "../utils/serverHelpers";


const MyMusic = () => {
    const [songData, setSongData] = useState([]);

    useEffect(() => {
        const getData = async () => {
            const response = await makeAuthenticatedGETRequest(
                "/song/get/mysongs"
            );
            // console.log(response.data);
            setSongData(response.data);
        };
        getData();
    }, []);

    return (
        <div className="h-full w-full flex">
            {/* This first div will be left part */}
            <div className="h-full w-1/5 bg-black flex flex-col justify-between pb-10">
                <div>
                    {/* This div is for logo */}
                    <div className="logoDiv p-6">
                        <img src={spotify_logo} alt="spotify logo" width={125} />
                    </div>
                    <div className="py-5">
                        <IconText
                            iconName={"material-symbols:home"}
                            displayText={"Home"}
                        />
                        <IconText
                            iconName={"material-symbols:search"}
                            displayText={"Search"}
                        />
                        <IconText
                            iconName={"icomoon-free:books"}
                            displayText={"Library"}
                        />
                        <IconText
                            iconName={"entypo:music"}
                            displayText={"My Music"}
                            active
                        />
                    </div>
                    <div className="pt-5">
                        <IconText
                            iconName={"icon-park-solid:add"}
                            displayText={"Create Playlist"}
                        />
                        <IconText
                            iconName={"mdi:heart"}
                            displayText={"Liked Songs"}
                        />
                    </div>
                </div>
                <div className="px-5">
                    <div className="border border-gray-100 text-white w-2/5 flex px-2 py-1 rounded-full items-center justify-center hover:border-white cursor-pointer">
                        <Icon icon="carbon:earth" />
                        <div className="ml-2 font-semibold text-sm ">English</div>
                    </div>
                </div>
            </div>
            {/* This second div will be right part */}
            <div className="h-full w-4/5 bg-app-black overflow-auto">
                <div className="navbar w-full h-1/10 bg-black bg-opacity-30 flex items-center justify-end">
                    <div className="w-1/2 flex h-full">
                        <div className="w-2/3 flex justify-around items-center ">
                            <TextWithHover displayText={"Premium"} />
                            <TextWithHover displayText={"Support"} />
                            <TextWithHover displayText={"Download"} />
                            <div className="h-1/3 border-r border-white"></div>
                        </div>
                        <div className="w-2/5 flex justify-around h-full items-center">
                            <TextWithHover displayText={"Upload Song"} />
                            <div className="bg-white w-10 h-10 flex items-center justify-center rounded-full font-semibold cursor-pointer">
                                SM
                            </div>
                        </div>
                    </div>
                </div>
                <div className="content p-8 overflow-auto">
                    <div className="text-white text-xl font-semibold pb-4 pl-2">
                        My Songs
                    </div>
                    <div className="space-y-3 overflow-auto">
                        {songData.map((item) => {
                            return <SingleSongCard info={item}/>;
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};


export default MyMusic;