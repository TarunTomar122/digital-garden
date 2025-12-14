export default function ResumePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 space-y-8">
      <h1 className="font-display text-4xl">Experience</h1>

      <section className="space-y-6">
        <div>
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-2xl">Adobe</h2>
            <span className="text-sm text-muted">JUN 2023 – PRESENT</span>
          </div>
          <h3 className="font-medium mt-1">Design Engineer</h3>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-foreground/90">
            <li>Core contributor to the migration of Adobe&apos;s Web Component library to Spectrum 2.0.</li>
            <li>Built an App Frame component for Spectrum 2.0 to ensure scalability and consistency across flagship apps like Adobe Express, Firefly, Illustrator Web, etc.</li>
          </ul>
        </div>

        <div className="pt-4 border-muted/50">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-2xl">Adobe</h2>
            <span className="text-sm text-muted">MAY 2022 – JUL 2022</span>
          </div>
          <h3 className="font-medium mt-1">Core Tech Intern</h3>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-foreground/90">
            <li>Prototyped an AI assistant for Adobe Express using GenAI to help users generate content.</li>
            <li>Implemented canvas aware content suggestion and generation of dynamic design templates.</li>
          </ul>
        </div>

        <div className="pt-4 border-muted/50">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-2xl">Astu</h2>
            <span className="text-sm text-muted">OCT 2021 – MAR 2022</span>
          </div>
          <h3 className="font-medium mt-1">Full stack intern</h3>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-foreground/90">
            <li>Designed and implemented the backend and frontend architecture for a mental health mobile app.</li>
            <li>Shipped features including listener–talker matching, real‑time end‑to‑end encrypted chat, and Google Auth.</li>
            <li>Supported 500+ users with reliable infrastructure and a privacy‑first approach.</li>
          </ul>
        </div>
 
      </section>

      <h1 className="font-display text-4xl">Education</h1>
      <section className="space-y-6">
        <div>
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-2xl">Indian Institute of Technology, Jodhpur</h2>
            <span className="text-sm text-muted">AUG 2019 – JUN 2023</span>
          </div>
          <h3 className="font-medium mt-1">B.Tech in Computer Science and Engineering</h3>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-foreground/90">
            <li>Pattern Recognition and Machine Learning, Data Structures and Algorithms, Operating Systems, Computer Networks, Database Management Systems, Computer Architecture, Software Engineering, etc.</li>
            <li>CGPA: 8.0</li>
          </ul>
        </div>
      </section>


      <h1 className="font-display text-4xl">Achievements</h1>
      <section className="space-y-6">
        <div>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-foreground/90">
             <li><b>5<sup>th</sup> Place</b> - Amazon DeepRacer Challenge (2025)</li>
             <li><b>1<sup>st</sup> Place</b> - Razorpay FTX Hackathon (2021)</li>
             <li><b>2<sup>nd</sup> Place</b> - Software Hackathon, IIT Jodhpur (2020)</li>
             <li><b>1<sup>st</sup> Place</b> - Hardware Hackathon, IIT Jodhpur (2020)</li>
          </ul>
        </div>
      </section>
    </main>
  );
}


