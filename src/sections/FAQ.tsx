import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

/**
 * ROOTLINE FAQ — every answer is a receipt. Plain, proud, and documented.
 */

interface QA {
  q: string
  a: string
}

const QAS: QA[] = [
  {
    q: 'Who owns ROOTLINE?',
    a: 'We do — together. Two founders hold 51% between them. The first 50 creators split 49% equally — 0.98% each, written down, not promised. And no matter your seat, every creator keeps 100% of their masters. Your work is yours. That part is not negotiable.',
  },
  {
    q: 'What happens after the Founding 50?',
    a: 'The doors stay open. Creators who join after the fiftieth seat get the full platform — all four monetization lanes, the review protections, the receipts — just without the equity stake. Ownership was the founding gift. The income is forever.',
  },
  {
    q: 'How do creators get paid?',
    a: 'Four lanes, and the split always favors the person who made the work. Premium Ads pay 70% to the creator. Members pay 90%. The Licensing Desk pays 85%. Direct Support pays 90%. No hidden fees, no "net revenue" gymnastics — the percentage you read is the percentage you keep.',
  },
  {
    q: 'What are receipts?',
    a: 'Proof, in writing. Every decision that touches your money — a flag, a hold, a release, a payout — comes with a receipt: human-reviewed, evidence-backed, and attached to your account. If you disagree, you can appeal it. Nothing happens to your income in the dark.',
  },
  {
    q: 'How does review work?',
    a: 'AI flags concerns — never verdicts. A machine can raise a hand; it cannot lower the gavel. Human reviewers with cultural context make every call, and any change that could touch your income sits in held-review with the receipt visible to you the entire time. You watch the process; you are never surprised by it.',
  },
  {
    q: 'What are the upload limits?',
    a: 'Standard accounts upload up to 3 hours, 50GB, in 4K SDR. Approved Partners get 12 hours, 256GB, 4K HDR, and priority review. An 8K tier exists as an invite-only pilot while we make sure it holds the standard. Quality first, then scale.',
  },
  {
    q: 'Who is the Griot?',
    a: 'Our elder host. The Griot welcomes you when you arrive and reads receipts aloud in The Boardroom, because some things deserve a voice and not just a notification. He is the memory of the house — every tradition needs one.',
  },
  {
    q: 'Is this live?',
    a: 'This is a working concept demo. The data you see is sample data; the craft is real. Every screen, every flow, and every receipt behaves the way the finished network will — we are showing our work before we ask for yours.',
  },
]

export default function FAQ() {
  return (
    <section id="faq" className="bg-[#0A0908] py-32">
      <div className="mx-auto max-w-4xl px-6">
        {/* Eyebrow + headline */}
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#D4A437]">
            Questions, answered plainly
          </p>
          <h2 className="mx-auto mt-4 max-w-3xl font-display text-4xl leading-[1.05] tracking-tight text-[#F5EFE6] sm:text-5xl lg:text-6xl">
            Everything has a receipt.{' '}
            <span className="italic text-[#D4A437]">Even the answers.</span>
          </h2>
        </div>

        {/* Accordion */}
        <Accordion
          type="single"
          collapsible
          className="mt-14 space-y-4"
        >
          {QAS.map((item, i) => (
            <AccordionItem
              key={item.q}
              value={`q-${i}`}
              className="rounded-xl border border-white/10 bg-[#120E0A] px-6 transition-colors duration-300 last:border-b data-[state=open]:border-[#D4A437]/40"
            >
              <AccordionTrigger className="py-5 text-left font-display text-lg text-[#F5EFE6] transition-colors duration-300 hover:text-[#D4A437] hover:no-underline data-[state=open]:text-[#D4A437] sm:text-xl [&>svg]:size-5 [&>svg]:text-[#D4A437]">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-base leading-relaxed text-stone-300">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
