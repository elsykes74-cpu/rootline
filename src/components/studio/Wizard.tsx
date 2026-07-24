import { useCallback, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Stepper from "./Stepper";
import StepSelectFile, { type Source } from "./StepSelectFile";
import StepDetails, { EMPTY_DETAILS, type PackageDetails } from "./StepDetails";
import StepRights, { type RightsState } from "./StepRights";
import StepProcessing from "./StepProcessing";
import StepPublish from "./StepPublish";
import LimitsSidebar from "./LimitsSidebar";
import { DECLARATIONS, STEPS } from "./data";

export default function Wizard() {
  const [step, setStep] = useState(0);
  const [maxReached, setMaxReached] = useState(0);
  const [source, setSource] = useState<Source | null>(null);
  const [details, setDetails] = useState<PackageDetails>(EMPTY_DETAILS);
  const [rights, setRights] = useState<RightsState>({
    declarations: {},
    advisory: "",
  });
  const [processingDone, setProcessingDone] = useState(false);

  const handleProcessingChange = useCallback(
    (complete: boolean) => setProcessingDone(complete),
    [],
  );

  const canContinue = (() => {
    switch (step) {
      case 0:
        return source !== null;
      case 1:
        return (
          details.title.trim().length > 0 &&
          details.category !== "" &&
          details.videoType !== ""
        );
      case 2:
        return DECLARATIONS.every((d) => rights.declarations[d.id]);
      case 3:
        return processingDone;
      default:
        return false;
    }
  })();

  const goTo = (next: number) => {
    setStep(next);
    setMaxReached((m) => Math.max(m, next));
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
      {/* Wizard card */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#100E0C]">
        {/* Kente accent stripe */}
        <div className="flex h-1">
          <span className="w-1/3 bg-[#D4A437]" />
          <span className="w-1/3 bg-[#B5372A]" />
          <span className="w-1/3 bg-[#1E6B4F]" />
        </div>

        <div className="grid md:grid-cols-[240px_1fr]">
          {/* Stepper */}
          <div className="border-b border-white/10 p-6 md:border-b-0 md:border-r">
            <Stepper current={step} maxReached={maxReached} onSelect={goTo} />
          </div>

          {/* Step content */}
          <div className="flex flex-col p-6 md:p-8">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#D4A437]">
              Step {step + 1} of {STEPS.length}
            </p>
            <h3 className="font-display mb-6 text-2xl text-[#F5EFE6]">
              {STEPS[step]}
            </h3>

            {/* Steps stay mounted (hidden) so processing results and the
                publish success state survive Back/Continue navigation. */}
            <div className="min-h-[320px] flex-1">
              <div className={step === 0 ? "" : "hidden"}>
                <StepSelectFile source={source} onSelect={setSource} />
              </div>
              <div className={step === 1 ? "" : "hidden"}>
                <StepDetails details={details} onChange={setDetails} />
              </div>
              <div className={step === 2 ? "" : "hidden"}>
                <StepRights rights={rights} onChange={setRights} />
              </div>
              <div className={step === 3 ? "" : "hidden"}>
                <StepProcessing onCompleteChange={handleProcessingChange} />
              </div>
              <div className={step === 4 ? "" : "hidden"}>
                <StepPublish />
              </div>
            </div>

            {/* Nav */}
            <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
              <button
                type="button"
                onClick={() => goTo(Math.max(0, step - 1))}
                disabled={step === 0}
                className={`inline-flex items-center gap-2 rounded-sm border px-5 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors duration-300 ${
                  step === 0
                    ? "cursor-not-allowed border-white/10 text-stone-600"
                    : "border-white/20 text-[#F5EFE6] hover:border-[#D4A437] hover:text-[#D4A437]"
                }`}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>

              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={() => canContinue && goTo(step + 1)}
                  disabled={!canContinue}
                  className={`inline-flex items-center gap-2 rounded-sm px-6 py-2.5 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 ${
                    canContinue
                      ? "bg-[#D4A437] text-[#0A0908] hover:bg-[#e2b84f]"
                      : "cursor-not-allowed bg-[#D4A437]/25 text-[#0A0908]/50"
                  }`}
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <span className="text-[11px] uppercase tracking-wider text-stone-500">
                  Final step — publish when ready
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <LimitsSidebar />
    </div>
  );
}
