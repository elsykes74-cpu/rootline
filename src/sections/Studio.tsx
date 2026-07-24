import Wizard from "../components/studio/Wizard";
import { useReveal } from "../components/studio/useReveal";

export default function Studio() {
  const header = useReveal<HTMLDivElement>();
  const body = useReveal<HTMLDivElement>();

  return (
    <section id="studio" className="relative bg-[#0A0908] py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div
          ref={header.ref}
          className={`mb-16 max-w-3xl transition-all duration-700 ${
            header.visible
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <p className="gold-text mb-4 text-xs font-semibold uppercase tracking-[0.3em]">
            Creator Studio
          </p>
          <h2 className="font-display text-4xl leading-tight tracking-tight text-[#F5EFE6] md:text-6xl">
            Upload. Package.{" "}
            <span className="gold-text italic">Publish.</span>
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-stone-400">
            A demo workspace for packaging, review, publishing, and receipts.
            Files stay in this session — nothing leaves your machine.
          </p>
        </div>

        <div
          ref={body.ref}
          className={`transition-all delay-150 duration-700 ${
            body.visible
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <Wizard />
        </div>
      </div>
    </section>
  );
}
