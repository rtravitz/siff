import { Button } from './components/ui/button'
import { CircleHelp } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { linkStyle } from './App'

export function InfoPopover() {
  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="ghost" className="mr-2" size="icon">
          <CircleHelp />
          <span className="sr-only">Help</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <p>
        This site helps you find showtimes at the Seattle International Film Festival. It is in no way associated with SIFF. 
        It's just a passion project to help my partner plan what to attend.
        </p>
        <p className="mt-2">
        You can find the source code on <a className={linkStyle} href="https://github.com/rtravitz/siff">Github</a>.
        </p>
      </PopoverContent>
    </Popover>
  )
}
