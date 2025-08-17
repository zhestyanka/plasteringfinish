export default function TestPage() {
  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Тестовая страница работает!
        </h1>
        <p className="text-gray-600">
          Если вы видите эту страницу, значит сервер работает корректно.
        </p>
        <div className="mt-4 p-4 bg-green-100 rounded">
          <p className="text-green-800">
            ✅ Сервер: Работает<br/>
            ✅ Next.js: Работает<br/>
            ✅ Компоненты: Загружаются
          </p>
        </div>
      </div>
    </div>
  )
}
