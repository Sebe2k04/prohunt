"use client"
import { usePathname } from 'next/navigation';
import React from 'react'
import Navbar from './Navbar';

const NavbarHandler = () => {
    const path = usePathname();
    return (
      <div>
        {path.startsWith("/secure")? (
          ""
        ) : (
          <Navbar />
        )}
      </div>
    );
}

export default NavbarHandler
