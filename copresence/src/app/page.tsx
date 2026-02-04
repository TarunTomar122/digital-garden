
import { getTopTrack } from "@/actions/spotifyembed";
import { Suspense } from "react";
import Link from "next/link";

// Use ISR with 1 hour revalidation
export const revalidate = 3600;

async function TopTrack() {
  try {
    const top = await getTopTrack();
    if (!top) {
      console.log('TopTrack: No track data available');
      return null;
    }
    return (
      <section className="flex items-center gap-3">
        <img src="/vinyl.gif" alt="Vinyl animation" className="rounded-full ring-1 ring-muted/50 h-[64px] w-[64px]" />
        <div className="space-y-1">
          <p className="text-sm text-muted">Fav song this week</p>
          <p className="font-sans">{top.name} — <span className="text-muted">{top.artist}</span></p>
        </div>
      </section>
    );
  } catch (error) {
    console.error('TopTrack component error:', error);
    return null;
  }
}

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 space-y-8">
      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-2deg); }
          75% { transform: rotate(2deg); }
        }
        .wild-link:hover {
          animation: wiggle 0.8s ease-in-out infinite;
        }
      `}</style>

      <header className="space-y-2">
        <h1 className="font-display text-5xl md:text-6xl tracking-tight">Tarats Garden 🌱</h1>
      </header>

      <section className="space-y-4 mb-12">
        <p className="font-sans text-lg leading-relaxed">
          A place for notes, projects, and loose thoughts from my work as a design engineer at Adobe and things I build on my own. Mostly about <span className="font-semibold">AI, design, and productivity</span>. Occasionally about <span className="font-semibold">running, cooking, and longevity</span>.
        </p>

        {/* <p className="font-display italic text-2xl leading-snug">
          "Cultivate ideas slowly. Let some stay <Link href="/easter-eggs" className="wild-link underline underline-offset-2 cursor-pointer hover:opacity-80 inline-block origin-center">wild</Link>."
        </p> */}
      </section>

       {/* Listening To */}
       <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wider text-muted/60">Addicted To</p>
            <Suspense fallback={
              <div className="flex items-center gap-3" aria-busy="true">
                <img src="/vinyl.gif" alt="Vinyl animation" className="rounded-full ring-1 ring-muted/50 h-[64px] w-[64px]" />
                <div className="space-y-1">
                  <p className="text-sm text-muted">Fav song this week</p>
                  <div className="h-5 w-48 rounded bg-foreground/10" />
                </div>
              </div>
            }>
              {/* Partial prerender: stream this once available */}
              <TopTrack />
            </Suspense>
          </div>

      <section className="space-y-8 mt-12">


        {/* Working On */}
        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wider text-muted/60">Building</p>
          <div>
            <p className="font-sans text-muted leading-relaxed">An Anti Brain Rot Feed @  <a
              href="https://yourtrace.online"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4 hover:opacity-80 transition-opacity"
            >
              yourtrace.online
            </a></p>
          </div>
        </div>


        {/* Divider */}
        <div className="border-t border-foreground/10"></div>

        {/* Projects */}
        <p className="pb-0.5 font-sans text-lg leading-relaxed">
          <span className="text-muted">projects, experiments — </span>
          <Link prefetch href="/projects" className="text-foreground underline underline-offset-4 hover:opacity-80">
            /projects
          </Link>
        </p>
        <p className="pb-0.5 font-sans text-lg leading-relaxed">
          <span className="text-muted">blogs, shower thoughts, rants — </span>
          <Link prefetch href="/writings" className="text-foreground underline underline-offset-4 hover:opacity-80">
            /writings
          </Link>{" "}
          <span className="text-sm font-light text-muted">(start here if you&apos;re confused)</span>
        </p>
        <p className="pb-0.5 font-sans text-lg leading-relaxed">
          <span className="text-muted">books, reads — </span>
          <Link prefetch href="/library" className="text-foreground underline underline-offset-4 hover:opacity-80">
            /library
          </Link>
        </p>
        <p className="pb-0.5 font-sans text-lg leading-relaxed">
          <span className="text-muted">progress, achievements — </span>
          <Link prefetch href="/timeline" className="text-foreground underline underline-offset-4 hover:opacity-80">
            /timeline
          </Link>
        </p>
        <p className="pb-0.5 font-sans text-lg leading-relaxed">
          <span className="text-muted">goals, wishes — </span>
          <Link prefetch href="/list100" className="text-foreground underline underline-offset-4 hover:opacity-80">
            /list100
          </Link>
        </p>
        {/* <p className="pb-0.5 font-sans text-lg leading-relaxed">
          <span className="text-muted">threads, paths — </span>
          <Link prefetch href="/network" className="text-foreground underline underline-offset-4 hover:opacity-80">
            /network
          </Link>
        </p> */}
        {/* <p className="font-sans text-lg leading-relaxed">AI me - <Link prefetch href="/tarat-ai" className="underline underline-offset-4 hover:opacity-80">/tarat-ai</Link></p> */}
      </section>

      <footer className="">
        <div className="flex items-center gap-6 text-foreground text-center">
          <p className="font-sans text-lg leading-relaxed text-muted">elsewhere:</p>
          <a href="https://x.com/tarat_211" target="_blank" rel="noreferrer" aria-label="X / Twitter" className="opacity-80 hover:opacity-100">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 50 50">
              <path d="M 11 4 C 7.134 4 4 7.134 4 11 L 4 39 C 4 42.866 7.134 46 11 46 L 39 46 C 42.866 46 46 42.866 46 39 L 46 11 C 46 7.134 42.866 4 39 4 L 11 4 z M 13.085938 13 L 21.023438 13 L 26.660156 21.009766 L 33.5 13 L 36 13 L 27.789062 22.613281 L 37.914062 37 L 29.978516 37 L 23.4375 27.707031 L 15.5 37 L 13 37 L 22.308594 26.103516 L 13.085938 13 z M 16.914062 15 L 31.021484 35 L 34.085938 35 L 19.978516 15 L 16.914062 15 z"></path>
            </svg>
          </a>
          <a href="https://www.linkedin.com/in/tarun-tomar-4ab0b5193/" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="opacity-80 hover:opacity-100">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 50 50">
              <path d="M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M17,20v19h-6V20H17z M11,14.47c0-1.4,1.2-2.47,3-2.47s2.93,1.07,3,2.47c0,1.4-1.12,2.53-3,2.53C12.2,17,11,15.87,11,14.47z M39,39h-6c0,0,0-9.26,0-10 c0-2-1-4-3.5-4.04h-0.08C27,24.96,26,27.02,26,29c0,0.91,0,10,0,10h-6V20h6v2.56c0,0,1.93-2.56,5.81-2.56 c3.97,0,7.19,2.73,7.19,8.26V39z"></path>
            </svg>
          </a>
          <a href="https://www.instagram.com/tarat.hobbies/" target="_blank" rel="noreferrer" aria-label="Instagram" className="opacity-80 hover:opacity-100">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 50 50">
              <path d="M 16 3 C 8.83 3 3 8.83 3 16 L 3 34 C 3 41.17 8.83 47 16 47 L 34 47 C 41.17 47 47 41.17 47 34 L 47 16 C 47 8.83 41.17 3 34 3 L 16 3 z M 37 11 C 38.1 11 39 11.9 39 13 C 39 14.1 38.1 15 37 15 C 35.9 15 35 14.1 35 13 C 35 11.9 35.9 11 37 11 z M 25 14 C 31.07 14 36 18.93 36 25 C 36 31.07 31.07 36 25 36 C 18.93 36 14 31.07 14 25 C 14 18.93 18.93 14 25 14 z M 25 16 C 20.04 16 16 20.04 16 25 C 16 29.96 20.04 34 25 34 C 29.96 34 34 29.96 34 25 C 34 20.04 29.96 16 25 16 z"></path>
            </svg>
          </a>
          <a href="https://github.com/TarunTomar122" target="_blank" rel="noreferrer" aria-label="GitHub" className="opacity-80 hover:opacity-100">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="36" height="36" viewBox="0 0 30 30">
              <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>
            </svg>
          </a>
          <a href="https://www.buymeacoffee.com/taratdev" target="_blank" rel="noreferrer" aria-label="Buy Me a Coffee" className="opacity-80 hover:opacity-100">
            <svg width="32" height="29" viewBox="0 0 27 39" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.3206 17.9122C12.9282 18.5083 11.3481 19.1842 9.30013 19.1842C8.44341 19.1824 7.59085 19.0649 6.76562 18.8347L8.18203 33.3768C8.23216 33.9847 8.50906 34.5514 8.95772 34.9645C9.40638 35.3776 9.994 35.6069 10.6039 35.6068C10.6039 35.6068 12.6122 35.7111 13.2823 35.7111C14.0036 35.7111 16.1662 35.6068 16.1662 35.6068C16.776 35.6068 17.3635 35.3774 17.8121 34.9643C18.2606 34.5512 18.5374 33.9846 18.5876 33.3768L20.1046 17.3073C19.4267 17.0757 18.7425 16.9219 17.9712 16.9219C16.6372 16.9214 15.5623 17.3808 14.3206 17.9122Z" fill="#FFDD00"></path>
              <path d="M26.6584 10.3609L26.4451 9.28509C26.2537 8.31979 25.8193 7.40768 24.8285 7.05879C24.5109 6.94719 24.1505 6.89922 23.907 6.66819C23.6634 6.43716 23.5915 6.07837 23.5351 5.74565C23.4308 5.13497 23.3328 4.52377 23.2259 3.91413C23.1336 3.39002 23.0606 2.80125 22.8202 2.32042C22.5073 1.6748 21.858 1.29723 21.2124 1.04743C20.8815 0.923938 20.5439 0.819467 20.2012 0.734533C18.5882 0.308987 16.8922 0.152536 15.2328 0.0633591C13.241 -0.046547 11.244 -0.0134338 9.25692 0.162444C7.77794 0.296992 6.22021 0.459701 4.81476 0.971295C4.30108 1.15851 3.77175 1.38328 3.38115 1.78015C2.90189 2.26775 2.74544 3.02184 3.09537 3.62991C3.34412 4.06172 3.7655 4.3668 4.21242 4.56862C4.79457 4.82867 5.40253 5.02654 6.02621 5.15896C7.76282 5.54279 9.56148 5.6935 11.3356 5.75765C13.302 5.83701 15.2716 5.77269 17.2286 5.56521C17.7126 5.51202 18.1956 5.44822 18.6779 5.37382C19.2458 5.28673 19.6103 4.54411 19.4429 4.02678C19.2427 3.40828 18.7045 3.16839 18.0959 3.26173C18.0062 3.27581 17.917 3.28885 17.8273 3.30189L17.7626 3.31128C17.5565 3.33735 17.3503 3.36169 17.1441 3.38429C16.7182 3.43018 16.2913 3.46773 15.8633 3.49693C14.9048 3.56368 13.9437 3.59445 12.9831 3.59602C12.0391 3.59602 11.0947 3.56942 10.1529 3.50736C9.72314 3.4792 9.29447 3.44339 8.86684 3.39993C8.67232 3.37959 8.47832 3.35821 8.28432 3.33422L8.0997 3.31076L8.05955 3.30502L7.86816 3.27738C7.47703 3.21845 7.0859 3.15066 6.69895 3.06878C6.6599 3.06012 6.62498 3.03839 6.59994 3.0072C6.57491 2.976 6.56127 2.9372 6.56127 2.8972C6.56127 2.85721 6.57491 2.81841 6.59994 2.78721C6.62498 2.75602 6.6599 2.73429 6.69895 2.72563H6.70625C7.04158 2.65418 7.37951 2.59317 7.71849 2.53997C7.83148 2.52224 7.94482 2.50486 8.05851 2.48782H8.06164C8.27389 2.47374 8.48718 2.43567 8.69839 2.41064C10.536 2.2195 12.3845 2.15434 14.231 2.2156C15.1275 2.24168 16.0234 2.29435 16.9157 2.38509C17.1076 2.40491 17.2985 2.42577 17.4894 2.44923C17.5624 2.4581 17.6359 2.46853 17.7094 2.47739L17.8575 2.49878C18.2893 2.56309 18.7189 2.64115 19.1462 2.73293C19.7793 2.87061 20.5923 2.91546 20.8739 3.60906C20.9636 3.82913 21.0043 4.07371 21.0538 4.30474L21.1169 4.59939C21.1186 4.60467 21.1198 4.61008 21.1206 4.61555C21.2697 5.31089 21.4191 6.00623 21.5686 6.70157C21.5795 6.75293 21.5798 6.80601 21.5693 6.85748C21.5589 6.90895 21.5379 6.95771 21.5078 7.00072C21.4776 7.04373 21.4389 7.08007 21.3941 7.10747C21.3493 7.13487 21.2993 7.15274 21.2473 7.15997H21.2431L21.1519 7.17248L21.0617 7.18448C20.7759 7.22168 20.4897 7.25644 20.2033 7.28878C19.639 7.3531 19.0739 7.40872 18.5079 7.45566C17.3831 7.54918 16.2562 7.61055 15.127 7.63975C14.5516 7.65505 13.9763 7.66217 13.4013 7.66113C11.1124 7.65933 8.82553 7.5263 6.55188 7.2627C6.30574 7.2335 6.05959 7.20221 5.81344 7.1704C6.00431 7.19491 5.67472 7.15162 5.60797 7.14224C5.45152 7.12033 5.29506 7.09756 5.13861 7.07392C4.61346 6.99517 4.09144 6.89817 3.56733 6.81317C2.9337 6.70887 2.32771 6.76102 1.75458 7.07392C1.28413 7.33136 0.903361 7.72614 0.663078 8.20558C0.415886 8.71665 0.342354 9.2731 0.231796 9.82224C0.121237 10.3714 -0.0508594 10.9622 0.0143284 11.526C0.154613 12.7427 1.00518 13.7314 2.22863 13.9525C3.37959 14.1611 4.5368 14.3301 5.69714 14.474C10.2552 15.0323 14.8601 15.0991 19.4325 14.6733C19.8048 14.6385 20.1767 14.6006 20.548 14.5596C20.6639 14.5468 20.7813 14.5602 20.8914 14.5987C21.0016 14.6372 21.1017 14.6998 21.1845 14.782C21.2673 14.8642 21.3307 14.9639 21.37 15.0737C21.4093 15.1836 21.4235 15.3009 21.4116 15.4169L21.2958 16.5423C21.0625 18.8164 20.8292 21.0903 20.596 23.3641C20.3526 25.7519 20.1077 28.1395 19.8612 30.5269C19.7916 31.1993 19.7221 31.8715 19.6526 32.5436C19.5858 33.2054 19.5764 33.888 19.4507 34.542C19.2526 35.5704 18.5564 36.2019 17.5405 36.433C16.6098 36.6448 15.659 36.756 14.7045 36.7646C13.6464 36.7704 12.5888 36.7234 11.5307 36.7292C10.4011 36.7354 9.01755 36.6311 8.1456 35.7905C7.37951 35.052 7.27365 33.8958 7.16935 32.8961C7.03028 31.5725 6.89243 30.2491 6.75579 28.9259L5.98918 21.568L5.49324 16.8072C5.48489 16.7285 5.47655 16.6508 5.46873 16.5715C5.40927 16.0036 5.0072 15.4477 4.37357 15.4764C3.83121 15.5004 3.21479 15.9614 3.27841 16.5715L3.64607 20.1011L4.40642 27.4021C4.62302 29.4759 4.8391 31.5501 5.05465 33.6247C5.09637 34.022 5.13548 34.4205 5.17929 34.8179C5.41762 36.9894 7.07599 38.1596 9.12967 38.4892C10.3291 38.6822 11.5578 38.7218 12.775 38.7416C14.3353 38.7667 15.9113 38.8267 17.4461 38.544C19.7203 38.1268 21.4267 36.6082 21.6702 34.2526C21.7398 33.5725 21.8093 32.8923 21.8788 32.2119C22.11 29.9618 22.3409 27.7115 22.5714 25.4611L23.3255 18.1079L23.6713 14.7379C23.6885 14.5708 23.759 14.4137 23.8725 14.2898C23.986 14.1659 24.1363 14.0819 24.3012 14.0501C24.9515 13.9233 25.5732 13.7069 26.0357 13.212C26.7721 12.424 26.9187 11.3967 26.6584 10.3609ZM2.19525 11.0879C2.20516 11.0832 2.18691 11.1682 2.17909 11.2079C2.17752 11.1479 2.18065 11.0947 2.19525 11.0879ZM2.25836 11.5761C2.26357 11.5724 2.27921 11.5933 2.29538 11.6183C2.27087 11.5953 2.25523 11.5781 2.25783 11.5761H2.25836ZM2.32041 11.6579C2.34284 11.696 2.35483 11.72 2.32041 11.6579V11.6579ZM2.44505 11.7591H2.44818C2.44818 11.7627 2.45392 11.7664 2.456 11.7701C2.45255 11.766 2.4487 11.7624 2.44453 11.7591H2.44505ZM24.271 11.6079C24.0373 11.83 23.6853 11.9333 23.3375 11.9849C19.4366 12.5638 15.479 12.8569 11.5354 12.7275C8.71299 12.6311 5.92035 12.3176 3.12613 11.9229C2.85234 11.8843 2.55561 11.8342 2.36735 11.6324C2.01273 11.2517 2.18691 10.4851 2.27921 10.0251C2.3637 9.60373 2.52536 9.04207 3.02653 8.9821C3.80878 8.89031 4.71724 9.22042 5.49115 9.33776C6.4229 9.47996 7.35813 9.59382 8.29683 9.67935C12.303 10.0444 16.3765 9.98755 20.3649 9.45354C21.0919 9.35584 21.8163 9.24233 22.538 9.11299C23.181 8.99774 23.8939 8.78132 24.2825 9.44728C24.5489 9.90098 24.5844 10.508 24.5432 11.0207C24.5305 11.244 24.4329 11.4541 24.2705 11.6079H24.271Z" fill="#0D0C22"></path>
            </svg>
          </a>
        </div>
        <p className="mt-6 text-xs font-regular text-muted opacity-60">last rearranged 12th January 2026</p>
      </footer>

    </main>
  );
}
