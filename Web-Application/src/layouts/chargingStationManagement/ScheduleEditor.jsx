import { useState } from "react";
import Button from "../../components/button/Button";
import Input from "../../components/input/Input";

export default function ScheduleEditor({ schedules = [], onChange, onClose }) {
  const [localSchedules, setLocalSchedules] = useState([...schedules]);

  const handleAdd = () => {
    setLocalSchedules((prev) => [
      ...prev,
      { dayOfWeek: 1, startTime: "08:00", endTime: "12:00", slotCount: 2 },
    ]);
  };

  const handleUpdate = (index, field, value) => {
    const updated = [...localSchedules];
    updated[index][field] = value;
    setLocalSchedules(updated);
  };

  const handleDelete = (index) => {
    setLocalSchedules(localSchedules.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onChange(localSchedules);
    onClose();
  };

  return (
    <div className="space-y-4">
      {localSchedules.map((s, idx) => (
        <div
          key={idx}
          className="grid grid-cols-12 gap-3 items-center border-b pb-3"
        >
          <div className="col-span-2">
            <select
              className="border-2 border-gray-200 rounded-xl px-3 py-2 w-full"
              value={s.dayOfWeek}
              onChange={(e) => handleUpdate(idx, "dayOfWeek", parseInt(e.target.value))}
            >
              <option value={0}>Sunday</option>
              <option value={1}>Monday</option>
              <option value={2}>Tuesday</option>
              <option value={3}>Wednesday</option>
              <option value={4}>Thursday</option>
              <option value={5}>Friday</option>
              <option value={6}>Saturday</option>
            </select>
          </div>

          <div className="col-span-3">
            <Input
              type="time"
              value={s.startTime}
              onChange={(e) => handleUpdate(idx, "startTime", e.target.value)}
            />
          </div>

          <div className="col-span-3">
            <Input
              type="time"
              value={s.endTime}
              onChange={(e) => handleUpdate(idx, "endTime", e.target.value)}
            />
          </div>

          <div className="col-span-2">
            <Input
              type="number"
              value={s.slotCount}
              onChange={(e) => handleUpdate(idx, "slotCount", parseInt(e.target.value))}
            />
          </div>

          <div className="col-span-2 text-right">
            <Button variant="danger" size="sm" onClick={() => handleDelete(idx)}>
              Delete
            </Button>
          </div>
        </div>
      ))}

      <div className="flex justify-between pt-3">
        <Button variant="secondary" onClick={handleAdd}>
          + Add Schedule
        </Button>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Schedules</Button>
        </div>
      </div>
    </div>
  );
}
