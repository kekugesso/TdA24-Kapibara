import { useEffect, useState } from "react";
import { Lecturer_Card, location_reservation, tag } from "../basic/lecturer";
import { Range as ReactRange, getTrackBackground } from 'react-range';

export default function Search({ lecturers, subjects }: { lecturers: Lecturer_Card[], subjects: tag[] }) {
  const maxPrice = Math.max(...lecturers.map(lecturer => lecturer.price_per_hour));
  const [range, setRange] = useState<range>({ min: 0, max: maxPrice });
  const [tags, setTags] = useState<tag[]>([]);
  const [location, setLocation] = useState<location_reservation>(location_reservation.Online);


  return (
    <section className="flex bg-white dark:bg-jet text-black items-center justify-between z-50">
      <FormSlectWithLabel
        label="Lokace"
        type="text"
        name="location"
        options={Object.values(location_reservation)}
        value={location}
        onChange={(e) => { setLocation(e.target.value as location_reservation) }}
      />
      <FormAdditiveSelectWithLabel
        label="Předměty"
        type="text"
        name="tags"
        options={subjects}
        value={tags}
        onChange={(e) => { setTags(e) }}
      />
      <Range
        label="Cena za hodinu"
        name="price"
        range={{ min: 0, max: maxPrice } as range}
        value={range}
        setRange={setRange}
      />
    </section>
  );
}

type range = {
  min: number;
  max: number;
};
function Range({ label, name, range, value, setRange }: { label: string, name: string, range: range, value: range, setRange: (e: range) => void }) {
  const [values, setValues] = useState<number[]>([value.min, value.max]);

  useEffect(() => {
    setValues([value.min, value.max]);
  }, [value]);

  const handleChange = (newValues: number[]) => {
    setValues(newValues);
  };

  const handleFinalChange = (newValues: number[]) => {
    setRange({ min: newValues[0], max: newValues[1] });
  };

  return (
    <div>
      <label
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1"
        htmlFor={name}
      >
        {label}
      </label>
      <div className="flex flex-col items-center">
        <ReactRange
          step={1}
          min={range.min}
          max={range.max}
          values={values}
          onChange={handleChange}
          onFinalChange={handleFinalChange}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: '6px',
                width: '100%',
                background: getTrackBackground({
                  values,
                  colors: ['#ccc', '#548BF4', '#ccc'],
                  min: range.min,
                  max: range.max
                }),
                borderRadius: '4px',
              }}
            >
              {children}
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: '24px',
                width: '24px',
                backgroundColor: '#FFF',
                border: '1px solid #CCC',
                borderRadius: '50%',
              }}
            />
          )}
        />
        <div className="flex justify-between text-sm mt-2 w-full">
          <span>Min: {values[0]}</span>
          <span>Max: {values[1]}</span>
        </div>
      </div>
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
