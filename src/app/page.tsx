/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
import projectdata from './projects/projects.json';

export default function Home() {
  const project = projectdata['projects'][0];
  return (
    <main className="min-h-screen py-8 px-10 md:px-48 grid grid-cols-1 xl:grid-cols-2 gap-8">


      <div className="">

        <p className="text-xl lg:text-4xl leading-relaxed text-neutral-400 font-extralight">
          Hey  there, I’m <a href="https://bento.me/tarat" target="_blank" className="text-neutral-950 cursor-alias hover:border-purple-400 hover:border-b-2" >TaraT</a> 👋 Welcome to my
          digital garden 🐛
          I am currently developing
          experiences at <a href="https://www.adobe.com/" target="_blank" className="text-neutral-950 cursor-alias hover:border-indigo-400 hover:border-b-2">adobe</a>.
        </p>
        <br />
        <p className="text-xl lg:text-4xl leading-relaxed text-neutral-400 font-extralight">
          In my free time, I like to <a href="/reading" className="text-neutral-950 cursor-pointer hover:border-red-400 hover:border-b-2">read</a> books, <a href="/writing" className="cursor-pointer text-neutral-950 hover:border-green-400 hover:border-b-2">write</a> blogs, <a href="/hobbies" className="cursor-pointer text-neutral-950 hover:border-yellow-400 hover:border-b-2">run</a> 5Kms, <a href="/hobbies" className="cursor-pointer text-neutral-950 hover:border-pink-400 hover:border-b-2">play</a> piano, <a href="/projects" className="cursor-pointer text-neutral-950 hover:border-violet-400 hover:border-b-2">code</a> my new project, <a href="/hobbies" className="cursor-pointer text-neutral-950 hover:border-blue-400 hover:border-b-2">climb</a> that wall or <a href="/projects" className="cursor-pointer text-neutral-950 hover:border-fuchsia-400 hover:border-b-2">rant</a> about latest tech.
        </p>
        <br />
        <p className="text-xl lg:text-4xl leading-relaxed text-neutral-400 font-extralight">
          This is my little space on the internet where I collect all of those things together.
        </p>

      </div>

      <div>
        <a className="cursor-alias py-6 px-6 card bg-neutral-50 border rounded shadow flex flex-col justify-between" href={project.link} target="_blank" rel="noopener noreferrer">

          <div className='text-gray-600 text-sm flex flex-row justify-between items-center'>
            <p className='text-m lg:text-xl'>{project.title}</p>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </div>
          <p className="text-sm lg:text-lg text-gray-600 pt-1 mb-2">{project.description}</p>

          <img src={project.img} className="border-2 border-red-50 mt-3 rounded-t" alt={project.title} />
        </a>
      </div>


    </main >
  )
}
