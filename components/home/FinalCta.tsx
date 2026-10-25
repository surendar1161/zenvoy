import { ArrowRightOutlined } from "@ant-design/icons";
import { Reveal } from "@/components/site/motion";
import { ButtonLink } from "@/components/site/ui";

export default function FinalCta() {
  return (
    <section className="px-5 py-16 sm:px-6 sm:py-24" aria-label="Get started">
      <Reveal className="relative mx-auto max-w-6xl overflow-hidden rounded-[36px] bg-gradient-to-br from-ink via-ink-800 to-brand-900 px-6 py-16 text-center text-white shadow-float sm:px-12 sm:py-24">
        <div className="dp-grid absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000,transparent)]" aria-hidden />
        <div className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 animate-aurora rounded-full bg-brand-500/40 blur-[90px]" aria-hidden />
        <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 animate-aurora rounded-full bg-violet-500/40 blur-[90px]" style={{ animationDelay: "-5s" }} aria-hidden />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="text-[34px] font-extrabold leading-[1.1] sm:text-[50px]">Close your next deal with a calmer mind.</h2>
          <p className="mt-5 text-[17px] leading-relaxed text-ink-300">Generate your first proposal in 60 seconds. No credit card, no setup call, no commitment.</p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/sign-up" variant="light" size="lg" className="font-bold">Start free <ArrowRightOutlined className="text-[13px]" /></ButtonLink>
            <ButtonLink href="/pricing" variant="ghost" size="lg" className="border border-white/20 !text-white hover:!bg-white/10">Compare plans</ButtonLink>
          </div>
          <p className="mt-6 text-[13px] text-ink-400">Free forever plan · 1,200+ freelancers · Cancel anytime</p>
        </div>
      </Reveal>
    </section>
  );
}
