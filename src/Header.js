import React from 'react';

function Header() {
  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 shadow-md">
      <div className="container flex pl-8">
        <h1 className="text-2xl font-bold">Pixel Color Extractor for my babe</h1>
        <nav>
          <ul className="flex space-x-4">
            {/* <li><a href="/home" className="hover:text-gray-200">Home</a></li>
            <li><a href="/about" className="hover:text-gray-200">About</a></li>
            <li><a href="/contact" className="hover:text-gray-200">Contact</a></li> */}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;