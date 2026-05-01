"use client";

import * as React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const YEAR_MIN = 2000;
const YEAR_MAX = 2100;
type PickerView = "year" | "month" | "day";

const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const YEARS = Array.from(
  { length: YEAR_MAX - YEAR_MIN + 1 },
  (_, i) => YEAR_MIN + i,
);

interface DatePickerProps {
  value?: string; // formato YYYY-MM-DD
  onChange?: (date: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  name?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Selecione uma data",
  required,
  className,
  name,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [view, setView] = React.useState<PickerView>("year");
  const [tempYear, setTempYear] = React.useState<number>(() =>
    value
      ? new Date(value + "T00:00:00").getFullYear()
      : new Date().getFullYear(),
  );
  const [tempMonth, setTempMonth] = React.useState<number>(() =>
    value ? new Date(value + "T00:00:00").getMonth() : new Date().getMonth(),
  );

  const yearListRef = React.useRef<HTMLDivElement>(null);

  // Sincronizar estado temporário com valor externo
  React.useEffect(() => {
    if (value) {
      const d = new Date(value + "T00:00:00");
      setTempYear(d.getFullYear());
      setTempMonth(d.getMonth());
    }
  }, [value]);

  const handleOpenChange = (o: boolean) => {
    setOpen(o);
    if (o) setView("year");
  };

  // Auto-scroll para o ano selecionado ao abrir a visão de anos
  React.useEffect(() => {
    if (view === "year" && yearListRef.current) {
      const btn = yearListRef.current.querySelector(
        "[data-selected='true']",
      ) as HTMLElement | null;
      btn?.scrollIntoView({ block: "center", behavior: "instant" });
    }
  }, [view]);

  const selectedDate = value ? new Date(value + "T00:00:00") : undefined;

  const handleDaySelect = (date: Date | undefined) => {
    if (date) {
      onChange?.(format(date, "yyyy-MM-dd"));
    }
    setOpen(false);
  };

  const handleMonthChange = (newMonth: Date) => {
    setTempYear(newMonth.getFullYear());
    setTempMonth(newMonth.getMonth());
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-between text-left font-normal h-9",
            "border border-[var(--border-default)] dark:border-slate-700",
            "bg-white dark:bg-slate-800",
            "text-slate-900 dark:text-slate-50",
            "hover:bg-slate-50 dark:hover:bg-slate-700",
            "focus:ring-1 focus:ring-[var(--sky-trust)] focus:!border-[var(--sky-trust)]",
            !value && "text-slate-400 dark:text-slate-500",
            className,
          )}
        >
          {selectedDate
            ? format(selectedDate, "dd/MM/yyyy", { locale: ptBR })
            : placeholder}
          <CalendarIcon className="w-4 h-4 text-slate-400" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-63 p-0 dark:bg-slate-900" align="start">
        {/* ── Visão: Ano ── */}
        {view === "year" && (
          <div className="p-3">
            <p className="text-sm font-semibold text-center mb-3 text-muted-foreground">
              Selecione o ano
            </p>
            <div ref={yearListRef} className="h-56 overflow-y-auto">
              <div className="grid grid-cols-4 gap-1">
                {YEARS.map((year) => (
                  <button
                    key={year}
                    data-selected={year === tempYear}
                    onClick={() => {
                      setTempYear(year);
                      setView("month");
                    }}
                    className={cn(
                      "px-1 py-2 rounded-md text-sm font-medium transition-colors",
                      year === tempYear
                        ? "bg-[var(--sky-trust)] text-white"
                        : "hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Visão: Mês ── */}
        {view === "month" && (
          <div className="p-3">
            <button
              onClick={() => setView("year")}
              className="flex items-center gap-1 text-sm font-semibold mb-4 hover:text-primary transition-colors"
            >
              <ChevronLeftIcon className="size-4" />
              {tempYear}
            </button>
            <div className="grid grid-cols-3 gap-2">
              {MONTHS.map((month, idx) => (
                <button
                  key={month}
                  onClick={() => {
                    setTempMonth(idx);
                    setView("day");
                  }}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    idx === tempMonth
                      ? "bg-[var(--sky-trust)] text-white"
                      : "hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  {month.substring(0, 3)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Visão: Dia ── */}
        {view === "day" && (
          <PickerDayView
            year={tempYear}
            month={tempMonth}
            selected={selectedDate}
            onSelect={handleDaySelect}
            onMonthChange={handleMonthChange}
            onBack={() => setView("year")}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}

// ── Componente interno: grade de dias ──────────────────────────────────────

function PickerDayButtonInner({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames();
  const ref = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      className={cn(
        "data-[selected-single=true]:bg-[var(--sky-trust)] data-[selected-single=true]:text-white",
        "group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50",
        "dark:hover:text-accent-foreground flex aspect-square size-auto w-full min-w-(--cell-size)",
        "flex-col gap-1 leading-none font-normal",
        "group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px]",
        "[&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className,
      )}
      {...props}
    />
  );
}

function PickerDayView({
  year,
  month,
  selected,
  onSelect,
  onMonthChange,
  onBack,
}: {
  year: number;
  month: number;
  selected?: Date;
  onSelect: (d: Date | undefined) => void;
  onMonthChange: (d: Date) => void;
  onBack: () => void;
}) {
  const defaultClassNames = getDefaultClassNames();
  const displayMonth = new Date(year, month, 1);

  return (
    <DayPicker
      mode="single"
      month={displayMonth}
      onMonthChange={onMonthChange}
      selected={selected}
      onSelect={onSelect}
      locale={ptBR}
      fromYear={YEAR_MIN}
      toYear={YEAR_MAX}
      showOutsideDays
      className="bg-background p-3 [--cell-size:--spacing(8)]"
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn("flex gap-4 flex-col relative", defaultClassNames.months),
        month: cn("flex flex-col w-full gap-4", defaultClassNames.month),
        nav: cn(
          "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
          defaultClassNames.nav,
        ),
        button_previous: cn(
          buttonVariants({ variant: "ghost" }),
          "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: "ghost" }),
          "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
          defaultClassNames.button_next,
        ),
        month_caption: cn(
          "flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)",
          defaultClassNames.month_caption,
        ),
        caption_label: cn(
          "select-none font-medium text-sm",
          defaultClassNames.caption_label,
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem] select-none",
          defaultClassNames.weekday,
        ),
        week: cn("flex w-full mt-2", defaultClassNames.week),
        day: cn(
          "relative w-full h-full p-0 text-center group/day aspect-square select-none",
          defaultClassNames.day,
        ),
        today: cn(
          "bg-accent text-accent-foreground rounded-md",
          defaultClassNames.today,
        ),
        outside: cn(
          "text-muted-foreground aria-selected:text-muted-foreground",
          defaultClassNames.outside,
        ),
        disabled: cn(
          "text-muted-foreground opacity-50",
          defaultClassNames.disabled,
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
      }}
      components={{
        MonthCaption: ({ calendarMonth }) => (
          <button
            onClick={onBack}
            title="Voltar para seleção de ano"
            className="flex items-center justify-center gap-1 text-sm font-semibold hover:text-primary transition-colors w-full"
          >
            <ChevronLeftIcon className="size-3.5" />
            {MONTHS[calendarMonth.date.getMonth()]}{" "}
            {calendarMonth.date.getFullYear()}
          </button>
        ),
        Chevron: ({ orientation, className, ...props }) => {
          if (orientation === "left")
            return (
              <ChevronLeftIcon className={cn("size-4", className)} {...props} />
            );
          return (
            <ChevronRightIcon className={cn("size-4", className)} {...props} />
          );
        },
        DayButton: PickerDayButtonInner,
      }}
    />
  );
}
