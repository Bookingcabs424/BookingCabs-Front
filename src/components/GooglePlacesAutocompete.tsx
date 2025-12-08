'use client';
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import { useState, useRef, useEffect } from 'react';

type PlaceResult = google.maps.places.PlaceResult;

interface GooglePlacesAutocompleteProps {
  apiKey?: string;
  onPlaceSelected: (place: PlaceResult) => void;
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export default function GooglePlacesAutocomplete({
  apiKey = "AIzaSyAU6d5m52RrtWFeZgt-adAt9ohCT7PYZUc",
  onPlaceSelected,
  value = "",
  onChange,
  placeholder = 'Enter an address',
  className = '',
}: GooglePlacesAutocompleteProps) {
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const onLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.formatted_address) { 
        setInputValue(place.formatted_address);
        onPlaceSelected(place);
        if (onChange) {
          onChange(place.formatted_address);
        }
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value; 
    setInputValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = value;
      setInputValue(value);
    }
  }, [value]);

  return (
      <Autocomplete
        onLoad={onLoad}
        onPlaceChanged={onPlaceChanged}
        fields={['address_components', 'geometry', 'formatted_address']}
        types={['address']}
      >
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={`w-full p-2 border border-gray-300 rounded-md ${className}`}
        />
      </Autocomplete>
  );
}