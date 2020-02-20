import React, { useRef } from 'react';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import useOnclickOutside from 'react-cool-onclickoutside';
import { List } from 'semantic-ui-react';

const PlacesAutocomplete = () => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions
  } = usePlacesAutocomplete({
    requestOptions: { /* Define search scope here */ },
    debounce: 300
  });
  const ref = useRef<HTMLDivElement>(null);
  useOnclickOutside(ref, () => {
    // When user clicks outside of the component, we can dismiss
    // the searched suggestions by calling this method
    clearSuggestions();
  });

  const handleInput = (e: any) => {
    // Update the keyword of the input element
    setValue(e.target.value);
  };

  const handleSelect = (suggestion: any) => () => {
    // When user selects a place, we can replace the keyword without request data from API
    // by setting the second parameter as "false"
    const { description } = suggestion;
    console.log(description);

    setValue(description, false);
    clearSuggestions();

    // Get latitude and longitude via utility functions
    getGeocode({ address: description })
      .then(results => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        console.log('📍 Coordinates: ', { lat, lng });
      }).catch(error => {
        console.log('😱 Error: ', error)
      });
  };

  const renderSuggestions = () =>
    data.map(suggestion => {
      const {
        id,
        structured_formatting: { main_text, secondary_text }
      } = suggestion;

      return (
          <List.Item key={id} onClick={handleSelect(suggestion)} >
            <List.Icon name='marker' size='large' verticalAlign='middle' />
            <List.Content>
              <List.Header>{main_text}</List.Header>
              <List.Description>{secondary_text} </List.Description>
            </List.Content>
          </List.Item>
      );
    });

  return (
    <div ref={ref}>
      <input
        value={value}
        onChange={handleInput}
        disabled={!ready}
        placeholder="Where is your event?"
      />
      {/* We can use the "status" to decide whether we should display the dropdown or not */}
      {status === 'OK' && <List selection divided relaxed>{renderSuggestions()}</List>}
    </div>
  );
};

export default PlacesAutocomplete;