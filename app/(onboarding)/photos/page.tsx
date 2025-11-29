export default function PhotosPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Upload Your Photos</h1>
      <p className="text-gray-600 mb-6">
        Please upload 5-6 photos of yourself. These will be reviewed by our
        admin team.
      </p>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <p className="text-gray-500">Drag and drop photos here</p>
        <p className="text-sm text-gray-400 mt-2">or click to browse</p>
      </div>
    </div>
  );
}

