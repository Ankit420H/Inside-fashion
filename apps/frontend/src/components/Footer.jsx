import React from 'react';
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        <div>
          <img src={assets.logo} className="mb-5 w-32" alt="Inside Fashion logo" />
          <p className="w-full md:w-2/3 text-gray-600">
            Welcome to Inside Fashion – your ultimate gateway to the latest
            trends, timeless styles, and fashion inspiration! At Inside Fashion,
            we believe that style is more than just clothing; it's a personal
            expression and a reflection of culture, creativity, and
            individuality.
          </p>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li><Link to="/" className="hover:text-black transition-colors">Home</Link></li>
            <li><Link to="/about" className="hover:text-black transition-colors">About us</Link></li>
            <li><Link to="/collection" className="hover:text-black transition-colors">Collection</Link></li>
            <li><Link to="/contact" className="hover:text-black transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>
              <a href="tel:+919571313688" className="hover:text-black transition-colors">+91 9571313688</a>
            </li>
            <li>
              <a href="mailto:contact@insidefashion.com" className="hover:text-black transition-colors">contact@insidefashion.com</a>
            </li>
          </ul>
        </div>
      </div>

      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          Copyright {new Date().getFullYear()} &copy; insidefashion.com - All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
