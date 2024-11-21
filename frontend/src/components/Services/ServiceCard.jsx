import React from 'react';

const ServiceCard = ({ item, index }) => {
    const { name, desc } = item;

    return (
        <div className="py-[30px] px-3 lg:px-5" >
            <h2 className="text-[26px] leading-9 text-black font-[700]">
                {name}
            </h2>
            <p className="text-[16px] Leading-7 font-[400] text-black mt-4">
                {desc}
            </p>
        </div>

    );
};

export default ServiceCard;