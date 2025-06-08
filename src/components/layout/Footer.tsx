import React from 'react';
import { Link } from 'react-router-dom';
import { Vote, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Vote className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold">UniVote</span>
            </div>
            <p className="text-gray-400 mb-4">
              Sistema de elecciones electrónicas universitarias seguro, 
              transparente y accesible para todos.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-primary transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/election-management" className="text-gray-400 hover:text-primary transition-colors">
                  Gestión de Elecciones
                </Link>
              </li>
              <li>
                <Link to="/electoral-roll" className="text-gray-400 hover:text-primary transition-colors">
                  Padrón Electoral
                </Link>
              </li>
              <li>
                <Link to="/party-registration" className="text-gray-400 hover:text-primary transition-colors">
                  Inscripción de Partidos
                </Link>
              </li>
              <li>
                <Link to="/results" className="text-gray-400 hover:text-primary transition-colors">
                  Resultados
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Módulos del Sistema</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/academic-admin" className="text-gray-400 hover:text-primary transition-colors">
                  Administración Académica
                </Link>
              </li>
              <li>
                <Link to="/precinct-admin" className="text-gray-400 hover:text-primary transition-colors">
                  Administración de Recintos
                </Link>
              </li>
              <li>
                <Link to="/voting" className="text-gray-400 hover:text-primary transition-colors">
                  Módulo de Votación
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-primary mr-2" />
                <span className="text-gray-400">contacto@univote.edu</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-primary mr-2" />
                <span className="text-gray-400">+123 456 7890</span>
              </li>
              <li className="flex items-center">
                <MapPin className="h-5 w-5 text-primary mr-2" />
                <span className="text-gray-400">Campus Universitario Central</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">
            &copy; {year} UniVote. Todos los derechos reservados.
          </p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-4">
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  Términos de Servicio
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;