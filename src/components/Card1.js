import React from 'react'
import { ethers } from 'ethers'




const Card1 = ({ eventt, toggle, setToggle, setEventt }) => {
  const togglePop = () => {
    setEventt(eventt);
    toggle ? setToggle(false) : setToggle(true);
  };

  return (
    <div className="p-4 lg:w-1/3">
      <div className="rounded overflow-hidden shadow-lg">
        <div className="p-8">
          <div className="flex flex-col items-start">
            <span className="text-gray-500 pb-2 mb-2 border-b-2 border-gray-200">
              {eventt.date}
            </span>
            <span className="font-medium text-lg text-gray-800 title-font mb-4">
              {eventt.time}
            </span>
            <h2 className="tracking-widest text-xl title-font font-medium text-indigo-500 mb-1">
              {eventt.name}
            </h2>
            <h1 className="title-font text-x1 font-medium text-gray-900 mb-3">
              {eventt.location}
            </h1>
            <p className="leading-relaxed mb-5">NFT Photo</p>
            <a className="inline-flex items-center">
              <img
                alt="blog"
                src="https://dummyimage.com/103x103"
                className="w-8 h-8 rounded-full flex-shrink-0 object-cover object-center"
              />
              <span className="flex-grow flex flex-col pl-3">
                <span className="title-font font-medium text-gray-900">
                  {ethers.utils.formatUnits(
                    eventt.cost.toString(),
                    'ether'
                  )}{' '}
                  ETH
                </span>
                <span className="title-font font-medium text-gray-900">
                  {eventt.tickets.toString() === '0' ? (
                    <button className="bg-red-500  text-white py-1 px-1 
                    rounded" type="button" disabled>
                      Sold Out
                    </button>
                  ) : (
                    <button className="bg-blue-500 hover:bg-blue-700 text-white 
                     py-1 px-1 rounded" type="button" onClick={togglePop}>
                      View Seats
                    </button>
                  )}
                </span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card1;

