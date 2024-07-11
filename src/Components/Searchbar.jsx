export default function Searchbar({ placeholder, onChange, value, onFocus }) {
    return (
        <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onFocus={onFocus}
            className="bg-primary px-3 py-2 rounded-md text-white w-full placeholder:text-white/40 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out"
        />
    )
}