import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-200 py-4 shadow-inner">
      <div className="container mx-auto text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} Copyright © 2024 Taxol Zeng & Ut Gong, All Rights Reserved</p>
      </div>
    </footer>
  );
}

export default Footer;