import clsx from 'clsx'

export default function Button({ children, className, ...props }) {
  return (
    <button
      {...props}
      className={clsx(
        "w-full bg-blue-200 hover:bg-blue-400 text-white font-semibold py-2 rounded-md transition-colors",
        className
      )}
    >
      {children}
    </button>
  )
}
