import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Vote } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className={`sticky top-0 z-50 transition-colors duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Vote className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-gray-900">UniVote</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <nav className="flex space-x-1">
              <NavLink to="/" className={({isActive}) => isActive ? 'nav-link-active' : 'nav-link'} end>
                Inicio
              </NavLink>
              <NavLink to="/election-management" className={({isActive}) => isActive ? 'nav-link-active' : 'nav-link'}>
                Elecciones
              </NavLink>
              <NavLink to="/electoral-roll" className={({isActive}) => isActive ? 'nav-link-active' : 'nav-link'}>
                Padrón Electoral
              </NavLink>
              <NavLink to="/party-registration" className={({isActive}) => isActive ? 'nav-link-active' : 'nav-link'}>
                Partidos
              </NavLink>
              <NavLink to="/academic-admin" className={({isActive}) => isActive ? 'nav-link-active' : 'nav-link'}>
                Admin. Académica
              </NavLink>
              <NavLink to="/precinct-admin" className={({isActive}) => isActive ? 'nav-link-active' : 'nav-link'}>
                Recintos
              </NavLink>
              <NavLink to="/voting" className={({isActive}) => isActive ? 'nav-link-active' : 'nav-link'}>
                Votación
              </NavLink>
              <NavLink to="/results" className={({isActive}) => isActive ? 'nav-link-active' : 'nav-link'}>
                Resultados
              </NavLink>
            </nav>
          </div>
          
          <div className="md:hidden">
            <button 
              onClick={toggleMenu} 
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span className="sr-only">Abrir menú</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
          <NavLink to="/" className={({isActive}) => isActive ? 'block nav-link-active' : 'block nav-link'} end>
            Inicio
          </NavLink>
          <NavLink to="/election-management" className={({isActive}) => isActive ? 'block nav-link-active' : 'block nav-link'}>
            Elecciones
          </NavLink>
          <NavLink to="/electoral-roll" className={({isActive}) => isActive ? 'block nav-link-active' : 'block nav-link'}>
            Padrón Electoral
          </NavLink>
          <NavLink to="/party-registration" className={({isActive}) => isActive ? 'block nav-link-active' : 'block nav-link'}>
            Partidos
          </NavLink>
          <NavLink to="/academic-admin" className={({isActive}) => isActive ? 'block nav-link-active' : 'block nav-link'}>
            Admin. Académica
          </NavLink>
          <NavLink to="/precinct-admin" className={({isActive}) => isActive ? 'block nav-link-active' : 'block nav-link'}>
            Recintos
          </NavLink>
          <NavLink to="/voting" className={({isActive}) => isActive ? 'block nav-link-active' : 'block nav-link'}>
            Votación
          </NavLink>
          <NavLink to="/results" className={({isActive}) => isActive ? 'block nav-link-active' : 'block nav-link'}>
            Resultados
          </NavLink>
        </div>
      </div>
    </header>
  );
};

export default Header;