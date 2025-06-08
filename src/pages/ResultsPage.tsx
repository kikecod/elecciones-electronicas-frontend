import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Download, Filter, Share2, ChevronDown } from 'lucide-react';

// Mock data for election results
const mockResults = {
  totalVotes: 5432,
  participation: 78.4,
  parties: [
    { name: 'MUR', fullName: 'Movimiento Universitario Renovación', votes: 2145, percentage: 39.5, color: '#3B82F6' },
    { name: 'UEP', fullName: 'Unión Estudiantil Progresista', votes: 1876, percentage: 34.5, color: '#EF4444' },
    { name: 'ADE', fullName: 'Alianza Democrática Estudiantil', votes: 953, percentage: 17.5, color: '#22C55E' },
    { name: 'FUI', fullName: 'Frente Universitario Independiente', votes: 458, percentage: 8.5, color: '#F97316' },
  ],
  faculties: [
    { name: 'Ingeniería', registered: 1850, voted: 1456, participation: 78.7 },
    { name: 'Ciencias Económicas', registered: 1620, voted: 1289, participation: 79.6 },
    { name: 'Medicina', registered: 980, voted: 823, participation: 84.0 },
    { name: 'Humanidades', registered: 1240, voted: 894, participation: 72.1 },
    { name: 'Ciencias', registered: 870, voted: 640, participation: 73.6 },
    { name: 'Derecho', registered: 930, voted: 754, participation: 81.1 },
  ],
  voterTypes: [
    { name: 'Estudiantes', registered: 6500, voted: 5100, participation: 78.5 },
    { name: 'Docentes', registered: 980, voted: 764, participation: 77.9 },
  ]
};

// Prepare data for charts
const participationData = mockResults.faculties.map((faculty) => ({
  name: faculty.name,
  participacion: faculty.participation,
}));

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  );
};

const ResultsPage: React.FC = () => {
  const [selectedFaculty, setSelectedFaculty] = useState('all');
  const [selectedView, setSelectedView] = useState<'general' | 'byFaculty' | 'byVoterType'>('general');
  
  return (
    <div className="fade-in py-8">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Resultados Electorales</h1>
            <p className="text-gray-600">
              Visualización de los resultados del proceso electoral universitario.
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <button className="btn btn-outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </button>
            <button className="btn btn-outline">
              <Share2 className="h-4 w-4 mr-2" />
              Compartir
            </button>
          </div>
        </div>
        
        {/* Statistics cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Votos Emitidos</h3>
            <p className="text-3xl font-bold">{mockResults.totalVotes.toLocaleString()}</p>
          </div>
          
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Participación</h3>
            <p className="text-3xl font-bold">{mockResults.participation}%</p>
          </div>
          
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Ganador</h3>
            <p className="text-3xl font-bold text-primary">{mockResults.parties[0].name}</p>
            <p className="text-sm text-gray-500">{mockResults.parties[0].fullName}</p>
          </div>
          
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Facultad con Mayor Participación</h3>
            <p className="text-3xl font-bold">Medicina</p>
            <p className="text-sm text-gray-500">84.0% de participación</p>
          </div>
        </div>
        
        {/* View selector */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            className={`py-3 px-6 border-b-2 font-medium text-sm ${
              selectedView === 'general'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setSelectedView('general')}
          >
            Resultados Generales
          </button>
          <button
            className={`py-3 px-6 border-b-2 font-medium text-sm ${
              selectedView === 'byFaculty'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setSelectedView('byFaculty')}
          >
            Por Facultad
          </button>
          <button
            className={`py-3 px-6 border-b-2 font-medium text-sm ${
              selectedView === 'byVoterType'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setSelectedView('byVoterType')}
          >
            Por Tipo de Votante
          </button>
        </div>
        
        {/* General Results */}
        {selectedView === 'general' && (
          <div className="space-y-8">
            {/* Results by party */}
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-6">Resultados por Partido</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Chart */}
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockResults.parties}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="votes"
                      >
                        {mockResults.parties.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Table */}
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Partido
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Votos
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Porcentaje
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockResults.parties.map((party) => (
                        <tr key={party.name} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: party.color }}></div>
                              <span className="font-medium">{party.name}</span>
                            </div>
                            <p className="text-xs text-gray-500">{party.fullName}</p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {party.votes.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {party.percentage}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            {/* Participation by faculty */}
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-6">Participación por Facultad</h3>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={participationData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis unit="%" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="participacion" name="Participación" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
        
        {/* By Faculty */}
        {selectedView === 'byFaculty' && (
          <div className="space-y-8">
            <div className="card p-4 mb-6">
              <div className="flex items-center">
                <Filter className="h-5 w-5 text-gray-400 mr-2" />
                <select
                  className="form-input max-w-xs"
                  value={selectedFaculty}
                  onChange={(e) => setSelectedFaculty(e.target.value)}
                >
                  <option value="all">Todas las Facultades</option>
                  {mockResults.faculties.map((faculty) => (
                    <option key={faculty.name} value={faculty.name}>{faculty.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Facultad</h3>
                <p className="text-3xl font-bold">
                  {selectedFaculty === 'all' ? 'Todas' : selectedFaculty}
                </p>
              </div>
              
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Votantes Registrados</h3>
                <p className="text-3xl font-bold">
                  {selectedFaculty === 'all'
                    ? mockResults.faculties.reduce((sum, faculty) => sum + faculty.registered, 0).toLocaleString()
                    : mockResults.faculties.find(f => f.name === selectedFaculty)?.registered.toLocaleString() || 0}
                </p>
              </div>
              
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Participación</h3>
                <p className="text-3xl font-bold">
                  {selectedFaculty === 'all'
                    ? (mockResults.faculties.reduce((sum, faculty) => sum + faculty.voted, 0) / 
                       mockResults.faculties.reduce((sum, faculty) => sum + faculty.registered, 0) * 100).toFixed(1)
                    : mockResults.faculties.find(f => f.name === selectedFaculty)?.participation || 0}%
                </p>
              </div>
            </div>
            
            {/* Results by party for faculty */}
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-6">Resultados por Partido</h3>
              
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Partido
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Votos
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Porcentaje
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockResults.parties.map((party) => (
                      <tr key={party.name} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: party.color }}></div>
                            <span className="font-medium">{party.name}</span>
                          </div>
                          <p className="text-xs text-gray-500">{party.fullName}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {/* Just mock data for the example */}
                          {Math.floor(party.votes * (selectedFaculty === 'all' ? 1 : 0.2)).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {/* Just mock data for the example */}
                          {(party.percentage + (selectedFaculty === 'Ingeniería' ? 2 : 0)).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {/* By Voter Type */}
        {selectedView === 'byVoterType' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {mockResults.voterTypes.map((type) => (
                <div key={type.name} className="card p-6">
                  <h3 className="text-xl font-semibold mb-4">{type.name}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Registrados</p>
                      <p className="text-2xl font-bold">{type.registered.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Votaron</p>
                      <p className="text-2xl font-bold">{type.voted.toLocaleString()}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Participación</p>
                      <p className="text-2xl font-bold">{type.participation}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Results by party for each voter type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockResults.voterTypes.map((type) => (
                <div key={type.name} className="card p-6">
                  <h3 className="text-xl font-semibold mb-4">Resultados en {type.name}</h3>
                  
                  <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Partido
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Porcentaje
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {mockResults.parties.map((party, index) => (
                          <tr key={party.name} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: party.color }}></div>
                                <span className="font-medium">{party.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              {/* Just mock data for the example - different percentages for students vs faculty */}
                              {(party.percentage + (type.name === 'Estudiantes' ? -2 : 2) * index).toFixed(1)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;