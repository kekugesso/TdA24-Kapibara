import { useState } from "react";
import { _reservation, location_reservation, student, tag, status } from "@/components/basic/lecturer";
import dayjs from "dayjs";
import { ExIcon } from "@/components/basic/icons";

export default function ReservationModal({ open, _onClose, lecturer_subjects, onReservationCreated, checkValidation }: { open: boolean, _onClose: () => void, lecturer_subjects: tag[], onReservationCreated: (reservation: _reservation) => void, checkValidation: (reservation: _reservation) => { valid: boolean, message: string } }) {
  const [student_first_name, setStudentFirstName] = useState<string>("");
  const [student_last_name, setStudentLastName] = useState<string>("");
  const [student_email, setStudentEmail] = useState<string>("");
  const [student_phone, setStudentPhone] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [start_hour, setStartHour] = useState<Date>(new Date());
  const [end_hour, setEndHour] = useState<Date>(new Date());
  const [location, setLocation] = useState<location_reservation>(location_reservation.Online);
  const [subjects, setSubjects] = useState<tag[]>([]);
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState<string>("");
  const createReservation = () => {
    const reservation = new _reservation(
      "",
      dayjs(date).hour(dayjs(start_hour).hour()).set('minutes', 0).set('seconds', 0).toDate(),
      dayjs(date).hour(dayjs(end_hour).hour()).set('minutes', 0).set('seconds', 0).toDate(),
      new student(
        student_first_name,
        student_last_name,
        student_email,
        student_phone,
      ),
      location,
      status.Reserved,
      description,
      subjects,
    );
    const validation = checkValidation(reservation);
    console.log(validation);
    if (!validation.valid) { setError(validation.message); return; }
    onReservationCreated(reservation)
  };
  const onClose = () => {
    setStudentFirstName("");
    setStudentLastName("");
    setStudentEmail("");
    setStudentPhone("");
    setDate(new Date());
    setStartHour(new Date());
    setEndHour(new Date());
    setLocation(location_reservation.Online);
    setSubjects([]);
    setDescription("");
    setError("");
    _onClose();
  }

  const Modal = ({ open, onClose, children }: { open: boolean, onClose: () => void, children: any }) => {
    if (!open) return null;
    const handleBackdropClick = (e: any) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    };
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50" onClick={handleBackdropClick}>
        <div className="bg-white p-4 rounded-lg shadow-lg relative max-w-screen-lg min-w-[80%] min-h-[80%] scale-90 2xl:scale-100">
          <header className="mb-3">
            <h2 className="inline text-3xl font-semibold">Create Reservation</h2>
            <button
              onClick={onClose}
              className="inline float-end text-gray-500 hover:text-gray-800"
            >
              <ExIcon className="w-7 h-7" />
            </button>
          </header>
          {children}
          <footer className="bg-white my-2 grid gap-1">
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button
              onClick={() => { createReservation() }}
              className="p-3 bg-blue text-blue-foreground rounded-xl"
            >
              Save
            </button>
          </footer>
        </div>
      </div >
    );
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex w-full flex-col">
        <div className="flex-1 flex">
          <div className="grid w-full gap-4 bg-blue/40 dark:bg-dark_blue/40 rounded-lg">
            <div className="flex flex-col gap-4 p-4 md:p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <FormInputWithLabel
                  label="Student First Name"
                  type="student_first_name"
                  name="student_first_name"
                  value={student_first_name}
                  onChange={(e) => setStudentFirstName(e.target.value)}
                />
                <FormInputWithLabel
                  label="Student Last Name"
                  type="student_last_name"
                  name="student_last_name"
                  value={student_last_name}
                  onChange={(e) => setStudentLastName(e.target.value)}
                />
                <FormInputWithLabel
                  label="Student Email"
                  type="student_email"
                  name="student_email"
                  value={student_email}
                  onChange={(e) => setStudentEmail(e.target.value)}
                />
                <FormInputWithLabel
                  label="Student Phone"
                  type="student_phone"
                  name="student_phone"
                  value={student_phone}
                  onChange={(e) => setStudentPhone(e.target.value)}
                />
                <FormInputWithLabel
                  className="col-span-2"
                  label="Date"
                  type="date"
                  name="date"
                  value={dayjs(date).format('YYYY-MM-DD')}
                  onChange={(e) => setDate(dayjs(e.target.value, 'YYYY-MM-DD').toDate())}
                />
                <FormHourPickerWithLabel
                  label="Start Time"
                  name="start_time"
                  value={dayjs(start_hour).hour()}
                  onChange={(hour) => setStartHour(dayjs(start_hour).hour(hour).toDate())}
                />
                <FormHourPickerWithLabel
                  label="End Time"
                  name="end_time"
                  value={dayjs(end_hour).hour()}
                  onChange={(hour) => setEndHour(dayjs(end_hour).hour(hour).toDate())}
                />
                <FormSlectWithLabel
                  label="Location"
                  type="location"
                  name="location"
                  options={
                    [
                      "Online",
                      "Offline"
                    ]
                  }
                  value={location}
                  onChange={(e) => setLocation(e.target.value as location_reservation)}
                />
                <FormAdditiveSelectWithLabel
                  label="Subjects"
                  type="subjects"
                  name="subjects"
                  options={!lecturer_subjects ? [] : lecturer_subjects}
                  value={subjects}
                  onChange={(e) => setSubjects(e)}
                />
                <FormTextAreaWithLabel
                  label="Description"
                  type="description"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}


function FormTextAreaWithLabel(props: { label: string, type: string, name: string, value: string, onChange: (e: any) => void }) {
  const [value, setValue] = useState<string>(props.value);
  return (
    <div className="col-span-2">
      <label
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1"
        htmlFor={props.name}
      >
        {props.label}
      </label>
      <textarea
        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[150px] resize-none"
        id={props.name}
        placeholder={`Enter ${props.label.toLowerCase()}`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={(e) => props.onChange(e)}
      ></textarea>
    </div>
  );
}

function FormHourPickerWithLabel(props: { label: string, name: string, value: string, onChange: (hour: Date) => void }) {
  const handleHourChange = (e) => {
    const selectedHour = parseInt(e.target.value);
    if (!isNaN(selectedHour)) {
      props.onChange(selectedHour);
    }
  };

  return (
    <div>
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1">
        {props.label}
      </label>
      <select
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        value={props.value}
        onChange={handleHourChange}
      >
        {Array.from({ length: 13 }, (_, i) => i).map((hour) => (
          <option key={`TimePicker_${props.name}_hour_${hour + 8}`} value={hour + 8}>{hour + 8}</option>
        ))}
      </select>
    </div>
  );
}

function FormInputWithLabel(props: { label: string, type: string, name: string, value: string, onChange: (e: any) => void, className?: string }) {
  const [value, setValue] = useState<string>(props.value);
  console.log(props.value);
  return (
    <div className={props.className}>
      <label
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1"
        htmlFor={props.name}
      >
        {props.label}
      </label>
      <input
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        type={props.type}
        id={props.name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={(e) => props.onChange(e)}
        placeholder={`Enter ${props.label.toLowerCase()}`}
      />
    </div>
  );
}

function FormSlectWithLabel(props: { label: string, type: string, name: string, options: string[], value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void }) {
  return (
    <div>
      <label
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1"
        htmlFor={props.name}
      >
        {props.label}
      </label>
      <select
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        id={props.name}
        value={props.value}
        onChange={props.onChange}
      >
        {props.options.map((option, index) => (
          <option key={`Option_${props.label}_${index}`} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}

function FormAdditiveSelectWithLabel(props: { label: string, type: string, name: string, options: tag[], value: tag[], onChange: (e: tag[]) => void }) {
  const [search, setSearch] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const handleSelect = (option: tag) => {
    if (!props.value.find(selectedOption => selectedOption.uuid === option.uuid)) {
      props.onChange([...props.value, option]);
    }
    setSearch('');
    setIsDropdownOpen(false);
  };

  const handleRemove = (option: tag) => {
    props.onChange(props.value.filter(selectedOption => selectedOption.uuid !== option.uuid));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setIsDropdownOpen(true);
  };

  const handleDropdownClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div>
      <label
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1"
        htmlFor={props.name}
      >
        {props.label}
      </label>
      <div className="relative">
        <div className="flex flex-wrap gap-2 items-center border border-input bg-white px-3 py-2 rounded-md">
          {props.value.map((option, index) => (
            <div key={`SelectedOption_${props.label}_${index}`} className="flex items-center gap-2 bg-primary/10 rounded-md p-2">
              <span>{option.name}</span>
              <button onClick={() => handleRemove(option)} className="text-primary/50 hover:text-primary/90">
                &times;
              </button>
            </div>
          ))}
          <input
            value={search}
            onChange={handleSearchChange}
            onClick={handleDropdownClick}
            className="flex-grow bg-transparent outline-none"
            type="text"
            id={props.name}
          />
        </div>
        {(isDropdownOpen && props.options.length !== props.value.length) && (
          <div className="absolute w-full bg-white rounded-md shadow-lg border border-gray-200 mt-1">
            {props.options
              .filter(option => !props.value.find(selectedOption => selectedOption.name === option.name))
              .filter(option => option.name.toLowerCase().includes(search.toLowerCase()))
              .map((option, index) => (
                <div key={`Option_${props.label}_${index}`} onClick={() => handleSelect(option)} className="p-2 hover:bg-gray-100 cursor-pointer">
                  {option.name}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
