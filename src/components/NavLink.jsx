// NavLink — typographic link for use in header/footer navigation lists
//
// Encapsulates: nav-link underline hover effect, reduced opacity, consistent font size.
// Caller controls only: destination (to), label (children), click handler (onClick).

function NavLink({ to, children, onClick }) {
  return (
    <Link to={to} onClick={onClick} className="nav-link" style={{ fontSize: 14, opacity: 0.78 }}>
      {children}
    </Link>
  );
}
