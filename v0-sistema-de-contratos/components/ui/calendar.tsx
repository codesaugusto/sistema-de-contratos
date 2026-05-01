"use client";

import * as React from "react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

const YEAR_MIN = 1900;
const YEAR_MAX = 2100;

function CalendarCaption({
  date,
  onDateChange,
}: {
  date: Date;
  onDateChange: (date: Date) => void;
}) {
  const [showYearSelector, setShowYearSelector] = React.useState(false);
  const [showMonthSelector, setShowMonthSelector] = React.useState(false);
  const captionRef = React.useRef<HTMLDivElement>(null);
  const yearListRef = React.useRef<HTMLDivElement>(null);

  // Derivados do prop `date` para manter sincronismo com navegação prev/next
  const selectedYear = date.getFullYear();
  const selectedMonth = date.getMonth();

  const months = [
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

  // Fechar seletores quando clicar fora
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        captionRef.current &&
        !captionRef.current.contains(event.target as Node)
      ) {
        setShowYearSelector(false);
        setShowMonthSelector(false);
      }
    }

    if (showYearSelector || showMonthSelector) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showYearSelector, showMonthSelector]);

  // Rolar automaticamente até o ano selecionado ao abrir o seletor
  React.useEffect(() => {
    if (showYearSelector && yearListRef.current) {
      const selectedBtn = yearListRef.current.querySelector(
        '[data-selected="true"]',
      ) as HTMLElement | null;
      selectedBtn?.scrollIntoView({ block: "center", behavior: "instant" });
    }
  }, [showYearSelector]);

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(date);
    newDate.setMonth(monthIndex);
    onDateChange(newDate);
    setShowMonthSelector(false);
  };

  const handleYearSelect = (year: number) => {
    const newDate = new Date(date);
    newDate.setFullYear(year);
    onDateChange(newDate);
    setShowYearSelector(false);
  };

  const years = Array.from(
    { length: YEAR_MAX - YEAR_MIN + 1 },
    (_, i) => YEAR_MIN + i,
  );

  return (
    <div ref={captionRef} className="relative">
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => {
            setShowMonthSelector(!showMonthSelector);
            setShowYearSelector(false);
          }}
          className="hover:bg-accent hover:text-accent-foreground px-2 py-1 rounded-md transition-colors cursor-pointer font-medium"
          title="Clique para selecionar mês"
        >
          {months[selectedMonth]}
        </button>
        <button
          onClick={() => {
            setShowYearSelector(!showYearSelector);
            setShowMonthSelector(false);
          }}
          className="hover:bg-accent hover:text-accent-foreground px-2 py-1 rounded-md transition-colors cursor-pointer font-medium"
          title="Clique para selecionar ano"
        >
          {selectedYear}
        </button>
      </div>

      {/* Month Selector */}
      {showMonthSelector && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-popover border border-input rounded-lg shadow-lg p-3">
          <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
            {months.map((month, idx) => (
              <button
                key={month}
                onClick={() => handleMonthSelect(idx)}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer",
                  selectedMonth === idx
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground",
                )}
              >
                {month.substring(0, 3)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Year Selector */}
      {showYearSelector && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-popover border border-input rounded-lg shadow-lg p-3">
          <div ref={yearListRef} className="max-h-64 overflow-y-auto">
            <div className="grid grid-cols-4 gap-2">
              {years.map((year) => (
                <button
                  key={year}
                  data-selected={year === selectedYear}
                  onClick={() => handleYearSelect(year)}
                  className={cn(
                    "px-2 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer",
                    year === selectedYear
                      ? "bg-primary text-primary-foreground"
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
    </div>
  );
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
}) {
  const defaultClassNames = getDefaultClassNames();
  const [displayMonth, setDisplayMonth] = React.useState(
    props.defaultMonth || new Date(),
  );

  const handleDateChange = React.useCallback((newDate: Date) => {
    setDisplayMonth(newDate);
  }, []);

  return (
    <DayPicker
      month={displayMonth}
      onMonthChange={setDisplayMonth}
      fromYear={YEAR_MIN}
      toYear={YEAR_MAX}
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-background group/calendar p-3 [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className,
      )}
      captionLayout="label"
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "flex gap-4 flex-col md:flex-row relative",
          defaultClassNames.months,
        ),
        month: cn("flex flex-col w-full gap-4", defaultClassNames.month),
        nav: cn(
          "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
          defaultClassNames.nav,
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
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
        week_number_header: cn(
          "select-none w-(--cell-size)",
          defaultClassNames.week_number_header,
        ),
        week_number: cn(
          "text-[0.8rem] select-none text-muted-foreground",
          defaultClassNames.week_number,
        ),
        day: cn(
          "relative w-full h-full p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square select-none",
          defaultClassNames.day,
        ),
        range_start: cn(
          "rounded-l-md bg-accent",
          defaultClassNames.range_start,
        ),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn("rounded-r-md bg-accent", defaultClassNames.range_end),
        today: cn(
          "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none",
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
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          );
        },
        MonthCaption: () => (
          <CalendarCaption
            date={displayMonth}
            onDateChange={handleDateChange}
          />
        ),
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-4", className)} {...props} />
            );
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("size-4", className)}
                {...props}
              />
            );
          }

          return (
            <ChevronDownIcon className={cn("size-4", className)} {...props} />
          );
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>
          );
        },
        ...components,
      }}
      {...props}
    />
  );
}

function CalendarDayButton({
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
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 dark:hover:text-accent-foreground flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] data-[range-end=true]:rounded-md data-[range-end=true]:rounded-r-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md data-[range-start=true]:rounded-l-md [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className,
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
