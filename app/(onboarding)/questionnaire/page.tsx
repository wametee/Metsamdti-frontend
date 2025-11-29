export default function QuestionnairePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Personality Questionnaire</h1>
      <p className="text-gray-600 mb-6">
        Please answer these questions to help us find your best match.
      </p>
      <form className="space-y-6">
        <div>
          <p className="font-medium mb-3">Question 1: ...</p>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="radio" name="q1" className="mr-2" />
              Option A
            </label>
            <label className="flex items-center">
              <input type="radio" name="q1" className="mr-2" />
              Option B
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}

