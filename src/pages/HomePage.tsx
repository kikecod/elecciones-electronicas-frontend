import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Shield, Users, BarChart3, FileCheck, Server, MapPin, Vote, Settings } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-24">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Elecciones Universitarias Electrónicas
            </h1>
            <p className="text-xl mb-8">
              Sistema integral para la gestión de procesos electorales universitarios de forma segura, 
              transparente y accesible para todos los miembros de la comunidad académica.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/voting" className="btn bg-white text-blue-700 hover:bg-gray-100 px-6 py-3 rounded-full font-semibold">
                Ir a Votar
              </Link>
              <Link to="/results" className="btn bg-transparent border-2 border-white text-white hover:bg-white/10 px-6 py-3 rounded-full font-semibold">
                Ver Resultados
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Sobre Nuestro Sistema</h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
            <p className="max-w-3xl mx-auto text-gray-600 text-lg">
              UniVote es un sistema diseñado específicamente para las necesidades de la comunidad universitaria, 
              facilitando procesos electorales democráticos, seguros y transparentes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Objective */}
            <div className="card p-6 h-full">
              <div className="mb-4 text-primary">
                <FileCheck className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Objetivo General</h3>
              <p className="text-gray-600">
                Proporcionar una plataforma digital que garantice la integridad, transparencia y accesibilidad de 
                los procesos electorales universitarios, optimizando recursos y ampliando la participación estudiantil.
              </p>
            </div>

            {/* Mission */}
            <div className="card p-6 h-full">
              <div className="mb-4 text-primary">
                <Shield className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Misión</h3>
              <p className="text-gray-600">
                Facilitar procesos electorales democráticos mediante tecnología de vanguardia, 
                garantizando elecciones justas, seguras y accesibles para todos los miembros de la 
                comunidad universitaria.
              </p>
            </div>

            {/* Vision */}
            <div className="card p-6 h-full">
              <div className="mb-4 text-primary">
                <BarChart3 className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Visión</h3>
              <p className="text-gray-600">
                Ser el referente en sistemas de elecciones electrónicas universitarias, promoviendo 
                la participación estudiantil, la transparencia y la confianza en los procesos democráticos 
                de la institución.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Beneficios del Voto Electrónico</h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
            <p className="max-w-3xl mx-auto text-gray-600 text-lg">
              El sistema de votación electrónica ofrece numerosas ventajas sobre los métodos tradicionales, 
              mejorando tanto la experiencia del votante como la gestión del proceso electoral.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Mayor Participación</h3>
                <p className="text-gray-600">
                  Facilita el acceso al voto desde cualquier dispositivo con internet, aumentando los índices de participación estudiantil.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Resultados Inmediatos</h3>
                <p className="text-gray-600">
                  Conteo automático que permite conocer los resultados de forma inmediata al cierre de la votación.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Reducción de Costos</h3>
                <p className="text-gray-600">
                  Elimina gastos en materiales físicos, logística y personal, optimizando los recursos universitarios.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Mayor Precisión</h3>
                <p className="text-gray-600">
                  Elimina errores humanos en el conteo de votos, garantizando resultados precisos y confiables.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Seguridad Avanzada</h3>
                <p className="text-gray-600">
                  Implementa protocolos de seguridad que garantizan la integridad del voto y la confidencialidad del votante.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Accesibilidad</h3>
                <p className="text-gray-600">
                  Facilita la participación de estudiantes con discapacidades o que se encuentran fuera del campus.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Módulos del Sistema</h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
            <p className="max-w-3xl mx-auto text-gray-600 text-lg">
              Nuestro sistema integral cuenta con módulos especializados que cubren todas las etapas 
              del proceso electoral universitario.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Link to="/election-management" className="card group p-6 transition-all duration-300 hover:shadow-lg">
              <div className="mb-4 text-primary group-hover:text-accent transition-colors duration-300">
                <Settings className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-primary">Gestión de Elecciones</h3>
              <p className="text-gray-600">
                Administración completa de elecciones, configuración de parámetros, fechas y 
                asignación de recursos.
              </p>
            </Link>

            <Link to="/electoral-roll" className="card group p-6 transition-all duration-300 hover:shadow-lg">
              <div className="mb-4 text-primary group-hover:text-accent transition-colors duration-300">
                <Users className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-primary">Padrón Electoral</h3>
              <p className="text-gray-600">
                Gestión de estudiantes y docentes habilitados para votar, con verificación de identidad 
                y pertenencia a facultades.
              </p>
            </Link>

            <Link to="/party-registration" className="card group p-6 transition-all duration-300 hover:shadow-lg">
              <div className="mb-4 text-primary group-hover:text-accent transition-colors duration-300">
                <FileCheck className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-primary">Inscripción de Partidos</h3>
              <p className="text-gray-600">
                Registro de partidos políticos y sus candidatos por facultad o carrera, con validación 
                de requisitos.
              </p>
            </Link>

            <Link to="/academic-admin" className="card group p-6 transition-all duration-300 hover:shadow-lg">
              <div className="mb-4 text-primary group-hover:text-accent transition-colors duration-300">
                <Server className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-primary">Administración Académica</h3>
              <p className="text-gray-600">
                Gestión de facultades, carreras y asignaciones relacionadas para la estructura organizativa.
              </p>
            </Link>

            <Link to="/precinct-admin" className="card group p-6 transition-all duration-300 hover:shadow-lg">
              <div className="mb-4 text-primary group-hover:text-accent transition-colors duration-300">
                <MapPin className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-primary">Administración de Recintos</h3>
              <p className="text-gray-600">
                Asignación de lugares de votación, dispositivos habilitados y responsables de cada recinto.
              </p>
            </Link>

            <Link to="/voting" className="card group p-6 transition-all duration-300 hover:shadow-lg">
              <div className="mb-4 text-primary group-hover:text-accent transition-colors duration-300">
                <Vote className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-primary">Módulo de Votación</h3>
              <p className="text-gray-600">
                Interfaz segura y accesible para que los votantes emitan su voto de manera confidencial y segura.
              </p>
            </Link>

            <Link to="/results" className="card group p-6 transition-all duration-300 hover:shadow-lg">
              <div className="mb-4 text-primary group-hover:text-accent transition-colors duration-300">
                <BarChart3 className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-primary">Resultados Electorales</h3>
              <p className="text-gray-600">
                Visualización de resultados en tiempo real con gráficos y tablas por facultad, carrera y tipo de votante.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-6">¿Listo para comenzar?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Inicie su proceso electoral universitario con nuestro sistema completo y seguro.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/voting" className="btn bg-white text-blue-700 hover:bg-gray-100 px-6 py-3 rounded-full font-semibold">
              Ir a Votar
            </Link>
            <Link to="/election-management" className="btn bg-transparent border-2 border-white text-white hover:bg-white/10 px-6 py-3 rounded-full font-semibold">
              Gestionar Elecciones
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;