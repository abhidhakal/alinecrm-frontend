import Header from '../components/Header';

export default function About() {
  return (
    <div className="flex w-full flex-col min-h-screen bg-white font-sans">
      <Header />
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">About AlineCRM</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            We are a team of passionate developers and salespeople who believe that CRM software should be intuitive, fast, and helpful—not a burden.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 text-base font-semibold leading-7 text-gray-900 sm:grid-cols-2 md:flex lg:gap-x-10">
            <a href="#">Our Team <span aria-hidden="true">&rarr;</span></a>
            <a href="#">Careers <span aria-hidden="true">&rarr;</span></a>
            <a href="#">Contact <span aria-hidden="true">&rarr;</span></a>
          </div>
          <dl className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col-reverse">
              <dt className="text-base leading-7 text-gray-600">Offices Worldwide</dt>
              <dd className="text-2xl font-bold leading-9 tracking-tight text-gray-900">4</dd>
            </div>
            <div className="flex flex-col-reverse">
              <dt className="text-base leading-7 text-gray-600">Full-time colleagues</dt>
              <dd className="text-2xl font-bold leading-9 tracking-tight text-gray-900">120+</dd>
            </div>
            <div className="flex flex-col-reverse">
              <dt className="text-base leading-7 text-gray-600">Hours per week</dt>
              <dd className="text-2xl font-bold leading-9 tracking-tight text-gray-900">40</dd>
            </div>
            <div className="flex flex-col-reverse">
              <dt className="text-base leading-7 text-gray-600">Paid time off</dt>
              <dd className="text-2xl font-bold leading-9 tracking-tight text-gray-900">Unlimited</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
