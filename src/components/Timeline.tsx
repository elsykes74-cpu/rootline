import { useEffect, useRef, useState, type ReactNode } from "react";

export interface TimelineNode {
  year: string;
  title: string;
  line: string;
  image: string;
  alt: string;
}

/** Observe an element once and report when it enters the viewport. */
function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

function Reveal({
  children,
  delay = 0,
  from = "left",
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  from?: "left" | "right" | "up";
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.15);
  const hidden =
    from === "left"
      ? "opacity-0 -translate-x-8"
      : from === "right"
        ? "opacity-0 translate-x-8"
        : "opacity-0 translate-y-8";

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        inView ? "opacity-100 translate-x-0 translate-y-0" : hidden
      } ${className}`}
    >
      {children}
    </div>
  );
}

function NodeCard({ node }: { node: TimelineNode }) {
  return (
    <div className="group relative rounded-lg border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-[#D4A437]/40 hover:bg-white/[0.05]">
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-[#D4A437]/50">
          <img
            src={node.image}
            alt={node.alt}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908]/60 to-transparent" />
        </div>
        <div>
          <p className="font-display text-2xl leading-none text-[#D4A437]">
            {node.year}
          </p>
          <h4 className="font-display mt-2 text-lg leading-snug text-[#F5EFE6]">
            {node.title}
          </h4>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-stone-400">{node.line}</p>
    </div>
  );
}

export default function Timeline({ nodes }: { nodes: TimelineNode[] }) {
  const { ref: spineRef, inView: spineInView } = useInView<HTMLDivElement>(0.05);

  return (
    <div ref={spineRef} className="relative">
      {/* Gold spine — left on mobile, centered on desktop */}
      <div
        aria-hidden="true"
        className="absolute top-0 bottom-0 left-5 w-px md:left-1/2 md:-translate-x-1/2"
      >
        <div
          className={`h-full w-full bg-gradient-to-b from-[#D4A437]/10 via-[#D4A437] to-[#D4A437]/10 transition-transform duration-[2000ms] ease-out origin-top ${
            spineInView ? "scale-y-100" : "scale-y-0"
          }`}
        />
      </div>

      <ol className="relative space-y-14 md:space-y-20">
        {nodes.map((node, i) => {
          const left = i % 2 === 0;
          return (
            <li key={node.year} className="relative">
              {/* Dot marker */}
              <div
                aria-hidden="true"
                className="absolute top-8 left-5 -translate-x-1/2 md:left-1/2"
              >
                <span className="block h-3.5 w-3.5 rounded-full bg-[#D4A437] ring-4 ring-[#D4A437]/20 ring-offset-2 ring-offset-[#0A0908]" />
              </div>

              {/* Mobile layout: always to the right of the spine */}
              <div className="pl-14 md:hidden">
                <Reveal delay={i * 60} from="up">
                  <NodeCard node={node} />
                </Reveal>
              </div>

              {/* Desktop layout: alternating sides */}
              <div className="hidden md:grid md:grid-cols-2 md:gap-16">
                {left ? (
                  <>
                    <Reveal from="left" delay={80}>
                      <NodeCard node={node} />
                    </Reveal>
                    <div />
                  </>
                ) : (
                  <>
                    <div />
                    <Reveal from="right" delay={80}>
                      <NodeCard node={node} />
                    </Reveal>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
