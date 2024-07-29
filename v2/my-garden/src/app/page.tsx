import Recent from '../components/Recent/recent';

export default async function Page() {
  return (
    <main className="flex min-h-screen flex-col px-16 md:px-24 lg:px-48 xl:px-96">

      {/* Present */}
      <section className="py-8">
        <p className="text-2xl py-4">Present</p>
        <section className="text-slate-400 md:leading-10 leading-8 text-lg">
          <p>Tarun is currently helping ship
            {" "}
            <span className="border-b-2 border-b-slate-400 text-slate-200">
              <a href="https://s2.spectrum.adobe.com/index.html" target="_blank">Spectrum 2 @Adobe</a>
            </span>
          </p>
          <p>but also, he is</p>
          <p>writing weekly newsletters on substack as
            {" "}
            <span className="border-b-2 border-b-slate-400 text-slate-200">
              <a href="https://tarat122.substack.com/" target="_blank">tarat's week on internet</a>
            </span>
            {","}
          </p>
          <p>documenting hobbies on instagram as
            {" "}
            <span className="border-b-2 border-b-slate-400 text-slate-200">
              <a href="https://www.instagram.com/tarat.hobbies/" target="_blank">tarat.hobbies</a>
            </span>
            {","}
          </p>
          <p>
            {" "}
            <span className="border-b-2 border-b-slate-400 text-slate-200">
              <a href="/writings">writing blogs</a>
            </span>
            {", "}
            <span className="border-b-2 border-b-slate-400 text-slate-200">
              <a href="/library">reading books</a>
            </span>
            {" and, "}
            <span className="border-b-2 border-b-slate-400 text-slate-200">
              <a href="/dump">creating half finished projects.</a>
            </span>
          </p>
        </section>
      </section>

      {/* Recent */}
      <section className="py-8">
        <Recent />
      </section>

      {/* Footer */}
      <section className="pt-8">
        <p>last updated {new Date().toLocaleDateString()}</p>
      </section>

    </main >
  );
}
