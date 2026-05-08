import { Markdown } from "@/lib/markdown";
import { InsightBox } from "./InsightBox";

interface Props {
  body: string;
  insight?: { label: string; text: string };
}

export function CompanyBrief({ body, insight }: Props) {
  return (
    <div className="rounded-[14px] border border-sage-mist-2 bg-chalk p-6 mb-4">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-charcoal mb-3">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-pale-sage text-[13px]">
          📋
        </span>
        Your brief
      </h2>
      <div className="text-sm leading-7 text-charcoal-2 prose-sm max-w-none">
        <Markdown source={body} />
      </div>
      {insight && (
        <div className="mt-4">
          <InsightBox label={`💡 ${insight.label}`} text={insight.text} />
        </div>
      )}
    </div>
  );
}
