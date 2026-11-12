export default function Card({ children, className = '', ...props }) {
  return (
    <div className={`card-base ${className}`} {...props}>
      {children}
    </div>
  )
}
