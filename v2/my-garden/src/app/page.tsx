export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center md:px-24 lg:px-48 xl:px-96 px-8 py-6">
      <h2>Hey there,</h2>
      <h3 className="mt-2">I'm still working on v2 of this site :)</h3>
      <h3 className="mt-2">till then you can reach out to me by clicking
        {" "}
        <span className="border-slate-400 border-b-2 cursor-pointer">
          <a href="https://bento.me/tarat" target="_blank">here.</a>
        </span>
      </h3>
    </main>
  );
}
