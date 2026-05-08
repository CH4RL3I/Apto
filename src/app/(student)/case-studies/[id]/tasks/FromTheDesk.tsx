interface Props {
  quote: string;
  authorName: string;
  authorTitle: string;
  authorInitials: string;
}

export function FromTheDesk({ quote, authorName, authorTitle, authorInitials }: Props) {
  return (
    <div className="relative overflow-hidden rounded-[14px] bg-charcoal p-6 mb-5">
      <div className="absolute inset-x-0 top-0 h-[3px] bg-sage" />
      <div
        aria-hidden
        className="text-[40px] leading-none text-sage opacity-30 font-serif -mb-2 select-none"
      >
        &ldquo;
      </div>
      <p className="italic text-sm leading-7 text-chalk/85 mb-4">{quote}</p>
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sage text-charcoal font-bold text-xs">
          {authorInitials}
        </div>
        <div>
          <div className="text-[13px] font-semibold text-chalk">{authorName}</div>
          <div className="text-[11px] text-chalk/50">{authorTitle}</div>
        </div>
      </div>
    </div>
  );
}
