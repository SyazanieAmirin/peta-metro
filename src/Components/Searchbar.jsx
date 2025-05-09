export default function Searchbar({ placeholder, onChange, value, onFocus }) {
    return (
        <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onFocus={onFocus}
            className="bg-surface px-4 py-3 rounded-lg text-text-primary w-full placeholder:text-text-secondary/70 outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm transition-all duration-300 ease-in-out"
        />
    )
}