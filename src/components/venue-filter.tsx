"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface VenueFilterProps {
  venues: string[];
  updateChecked: (name: string, add: boolean) => void;
  checked: string[];
}

export function VenueFilter(props: VenueFilterProps) {
  const onChanged = (name: string) => {
    return (checked: boolean) => {
      props.updateChecked(name, checked);
    }
  }

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="mb-2" variant="outline">Select Venues</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Venues</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {
            props.venues.map(name =>
              <DropdownMenuCheckboxItem
                key={name}
                checked={props.checked.includes(name)}
                onCheckedChange={onChanged(name)} 
                >
                {name}
              </DropdownMenuCheckboxItem>)
          }
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

