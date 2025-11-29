export default function AdminUserDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">User Profile</h1>
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">Profile Information</h3>
          <p className="text-gray-600">User ID: {params.id}</p>
        </div>
        <div>
          <h3 className="font-semibold">Photos</h3>
          <div className="grid grid-cols-3 gap-4 mt-2">
            {/* Photo gallery will go here */}
          </div>
        </div>
        <div>
          <h3 className="font-semibold">Questionnaire Results</h3>
          <p className="text-gray-600">Questionnaire scores will appear here</p>
        </div>
      </div>
    </div>
  );
}

