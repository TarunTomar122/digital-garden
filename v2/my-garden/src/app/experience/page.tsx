export default function Page() {
    return (
        <main className='flex justify-center xl:px-40 2xl:px-60'>
            <div className='min-w-full px-8 md:container md:px-28 lg:px-60 py-8 mb-20'>
                {/* Header */}
                <section className="mb-12">
                    <p className="text-4xl md:text-5xl font-normal text-white pb-2">
                        Experience
                    </p>
                    <p className="text-slate-400 md:text-lg mt-4">
                        Places I've worked at and things I've built
                    </p>
                </section>

                <h1 className="text-2xl md:text-3xl mt-8 mb-1">Design Engineer @Adobe</h1>
                <p className="text-lg text-slate-400">June 2023 - Present</p>
                <p className="text-lg text-slate-300 my-4 max-w-4xl leading-relaxed">
                    I am currently working on the {" "}
                    <a href="https://opensource.adobe.com/spectrum-web-components/getting-started/" target="_blank" className="text-blue-300 ">The Spectrum Web Components</a> {" "}
                    project which is an implementation of Spectrum (Adobe's Design system) on web.
                </p>
                <li className="text-lg text-slate-300 max-w-4xl my-2 leading-relaxed">
                    I spearheaded the migration of SWC library to <a className="text-blue-300" target="_blank" href="https://s2.spectrum.adobe.com/">Spectrum 2.0</a> while ensuring full support to all the product teams at the older spectrum version.
                </li>
                <li className="text-lg text-slate-300 max-w-4xl leading-relaxed">
                    Collaborated cross-functionally with internal (CSS, design tokens) as well as external dependencies (browsers, <a className="text-blue-300" target="_blank" href="https://lit.dev/">lit</a> team) to
                    implement new features and optimize existing patterns.
                </li>

                {/** Adobe Design Engineer */}
                <h1 className="text-2xl md:text-3xl mt-16 mb-1">Emerging Tech Intern @Adobe</h1>
                <p className="text-lg text-slate-400">May 2022 – Jul 2022</p>
                <li className="text-lg text-slate-300 max-w-4xl leading-relaxed my-4">
                    I designed and prototyped an AI assistant for Adobe Express to aid designers in their creative journey.
                </li>
                <li className="text-lg text-slate-300 max-w-4xl leading-relaxed">
                    Some of my early explorations were around context aware photo editing, content suggestion and template generation using GenAI.
                </li>

                {/** Adobe Design Engineer */}
                <h1 className="text-2xl md:text-3xl mt-16 mb-1">Full Stack Dev @Astu</h1>
                <p className="text-lg text-slate-400">Nov 2020 – Jul 2021</p>
                <li className="text-lg text-slate-300 max-w-4xl leading-relaxed my-4">
                    I developed the entire backend and frontend architecture for a mobile app that helped over 500 people
                    in tackling their mental health problems.
                </li>
                <li className="text-lg text-slate-300 max-w-4xl leading-relaxed">
                    Some of its features included listener-talker matching algorithm, real time end-to-end encrypted chat,
                    google auth etc.
                </li>
            

            </div>
        </main>
    );
}

export const revalidate = false;