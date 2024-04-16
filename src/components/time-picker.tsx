import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import dayjs, { Dayjs } from 'dayjs';

interface TimePickerProps {
  id: string;
  label: string;
  setTime: (val: Dayjs | null) => void;
  time: Dayjs | null;
}

export function TimePicker(props: TimePickerProps) {
  return (
    <div>
      <Label htmlFor={props.id}>{props.label}</Label>
      <Input
        id={props.id}
        value={props.time ? props.time.format('HH:mm') : '' }
        className="mb-2"
        onChange={(e) => {
          if (e.target.value.length > 0) {
            props.setTime(dayjs(e.target.value, 'HH:mm'))
          } else {
            props.setTime(null)
          }
        }}
        type="time" />
    </div>
  )
}
