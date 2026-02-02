export function StudentDetails({ student }) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Student Details</h2>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-gray-700">Name:</h3>
            <p className="text-gray-900">{student.name}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700">Dojo:</h3>
            <p className="text-gray-900">{student.dojo}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700">Rank:</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              student.rank === 'Black' ? 'bg-black text-white' :
              student.rank === 'Brown' ? 'bg-yellow-900 text-white' :
              student.rank === 'Green' ? 'bg-green-600 text-white' :
              'bg-gray-200 text-gray-800'
            }`}>
              {student.rank} Belt
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700">Age:</h3>
            <p className="text-gray-900">{student.age}</p>
          </div>
        </div>
      </div>
    </div>
  );
}