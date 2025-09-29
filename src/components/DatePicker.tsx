import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DatePicker({ date, onChange }: { date: string, onChange: (d: string) => void }) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(date ? new Date(date) : new Date())

  const handleSelect = (d: Date | undefined) => {
    setSelectedDate(d)
    if (d) onChange(format(d, "yyyy-MM-dd"))
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex w-full text-left justify-between items-center text-center mb-4">
          <span className="text-[15px] font-medium mt-[4px]">
            {selectedDate ? format(selectedDate, "yyyy-MM-dd") : "เลือกวันที่"}
          </span>
          <CalendarIcon
            size={17}
            className="text-gray-600 group-hover:text-foreground shrink-0 transition-colors"
            aria-hidden="true"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar className="p-2" mode="single" selected={selectedDate} onSelect={handleSelect} />
      </PopoverContent>
    </Popover>
  )
}
