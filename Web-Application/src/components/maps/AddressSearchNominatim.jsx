import { useState, useEffect } from "react";
import Button from "../button/Button";

export default function AddressSearchNominatim({ value, onSelect }) {
  const [query, setQuery] = useState(value || "");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    setQuery(value || "");
  }, [value]);  

  const handleSearch = async () => { 
    if (!query.trim()) return;
    setLoading(true);
    setSuggestions([]);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
          new URLSearchParams({
            q: query + ", Sri Lanka", // bias toward SL
            format: "json",
            addressdetails: "1",
            limit: "5",
            countrycodes: "lk",
          })
      );
      const data = await res.json();

      if (data.length === 0) {
        alert("No location found. Try nearest city or town.");
        return;
      }

      // prioritize street-level results
      const best = data.find(
        (d) =>
          d.type === "house" ||
          d.type === "residential" ||
          d.type === "road" ||
          d.type === "neighbourhood"
      ) || data[0];

      setSuggestions(data);

      // Automatically pick the best result
      const lat = parseFloat(best.lat);
      const lng = parseFloat(best.lon);

      onSelect?.({
        address: best.display_name,
        lat,
        lng,
      });
    } catch (error) {
      console.error("Geocoding failed:", error);
      alert("Error searching address.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleSelectSuggestion = (place) => {
    const lat = parseFloat(place.lat);
    const lng = parseFloat(place.lon);
    setQuery(place.display_name);
    setSuggestions([]);
    onSelect?.({
      address: place.display_name,
      lat,
      lng,
    });
  };

  return (
    <div className="flex flex-col gap-2 relative">
      <label className="text-sm font-semibold text-gray-700">Address</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Enter address"
          className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary-500"
        />
        <Button
          type="button"
          onClick={handleSearch}
          loading={loading}
          className="whitespace-nowrap"
        >
          Search
        </Button>
      </div>

      {/* Dropdown suggestions */}
      {suggestions.length > 0 && (
        <ul className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-md z-50 max-h-48 overflow-y-auto">
          {suggestions.map((s, i) => (
            <li
              key={i}
              onClick={() => handleSelectSuggestion(s)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
            >
              {s.display_name}
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-gray-500">
        Type full address or pick a suggestions.
      </p>
    </div>
  );
}
