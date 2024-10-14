import React from 'react';

function Header({ handleLogout, isAuthenticated }) {
  return (
    <header className="bg-purple-300 text-white py-4 shadow-md">
      <div className="container flex px-8">
        <h1 className="text-2xl font-bold">Color Extraction Tool for My Dear Babe</h1>
      </div>
    </header>
  );
}

export default Header;