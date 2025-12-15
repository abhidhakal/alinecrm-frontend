import Header from '../components/Header';

export default function Product() {
  return (
    <div className="flex w-full flex-col min-h-screen bg-white font-sans">
      <Header />
      <div className="flex flex-col items-center justify-center px-4 py-20 text-center max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
          The All-In-One CRM for Modern Teams
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
          Manage relationships, track pipelines, and automate workflows with a tool designed for speed and clarity. No clutter, just results.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a href="#" className="rounded-md bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Get started
          </a>
          <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
            Learn more <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className="mt-20 flow-root sm:mt-24">
          <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
            <div className="bg-white p-10 rounded-lg shadow-sm">
              <p className="text-gray-500 italic">Product Dashboard Placeholder - Visualizing Sales Data</p>
              {/* In a real scenario, an image or interactive demo would go here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
