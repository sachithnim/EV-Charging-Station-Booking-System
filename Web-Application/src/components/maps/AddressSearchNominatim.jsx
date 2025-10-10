import { useState, useEffect } from "react";
import Button from "../button/Button";

export default function AddressSearchNominatim({ value, onSelect, onChangeText }) {
  const [query, setQuery] = useState(value || "");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [resolvedLabel, setResolvedLabel] = useState(null); // what Nominatim matched

  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  const fetchResults = async (q) => {
    const url =
      "https://nominatim.openstreetmap.org/search?" +
      new URLSearchParams({
        q: `${q}, Sri Lanka`,
        format: "json",
        addressdetails: "1",
        limit: "5",
        countrycodes: "lk",
        dedupe: "1",
      });
    const res = await fetch(url, { headers: { "accept-language": "en" } });
    if (!res.ok) throw new Error(`Nominatim HTTP ${res.status}`);
    return res.json();
  };

  const handleSearch = async () => {
    const q = query.trim();
    if (!q) return;
    setLoading(true);
    setSuggestions([]);
    setResolvedLabel(null);
    try {
      const data = await fetchResults(q);

      if (!data || data.length === 0) {
        alert("No location found. Try nearest city or town.");
        return;
      }

      // prioritize street-level results
      const best =
        data.find(
          (d) =>
            d.type === "house" ||
            d.type === "residential" ||
            d.type === "road" ||
            d.type === "neighbourhood"
        ) || data[0];

      setSuggestions(data);

      // Fill lat/lng & map using best match — KEEP user's typed address
      const lat = parseFloat(best.lat);
      const lng = parseFloat(best.lon);

      onSelect?.({
        address: q,                // keep user typed one
        lat,
        lng,
        resolvedLabel: best.display_name, // helpful metadata if parent wants it
      });

      setResolvedLabel(best.display_name); // show what it matched to (read-only)
    } catch (err) {
      console.error("Geocoding failed:", err);
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
    // Selecting a suggestion refines coords
    const lat = parseFloat(place.lat);
    const lng = parseFloat(place.lon);
    setSuggestions([]);
    setResolvedLabel(place.display_name);

    onSelect?.({
      address: query.trim() || place.display_name, // prefer user's text; fallback if empty
      lat,
      lng,
      resolvedLabel: place.display_name,
    });
  };

  const handleChange = (e) => {
    const next = e.target.value;
    setQuery(next);
    setResolvedLabel(null); // new typing invalidates previous match label
    onChangeText?.(next);   // keep parent form in sync as you type
  };

  return (
    <div className="flex flex-col gap-2 relative">
      <label className="text-sm font-semibold text-gray-700">
        Address <span className="text-red-500">*</span>
      </label>

      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={handleChange}
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
        <ul className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-md z-[9999] max-h-56 overflow-y-auto">
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

      {/* Show what the geocoder matched to, but don't overwrite the input */}
      {resolvedLabel && (
        <p className="text-xs text-gray-500">
          Resolved to: <span className="italic">{resolvedLabel}</span>
        </p>
      )}

      <p className="text-xs text-gray-500">
        Type full address or pick a suggestions.
      </p>
    </div>
  );
}
